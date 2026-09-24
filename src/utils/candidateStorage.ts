import { CandidateIdea, CandidateStatus, Verdict } from '../types';

/**
 * Lokaler Speicher der Kandidatenliste (Tab „Unverpackt").
 *
 * Bis 24.09.2026 (Schlüssel v1) lag hier die *ganze* Liste, und beim Laden
 * gewann die gespeicherte Kopie jedes Eintrags gegen die Daten im Repo. Wer die
 * Seite einmal geöffnet hatte, sah danach keine Korrektur mehr — jede
 * Prüfprotokoll-Änderung (`frei` → `besetzt`) blieb in seinem Browser
 * unsichtbar.
 *
 * Seit v2 speichert der Browser nur noch, was wirklich lokal ist:
 *  - `overrides`: Status, den jemand im Browser von Hand umgestellt hat,
 *    zusammen mit dem Repo-Status, gegen den er umgestellt wurde (`baseStatus`).
 *    Ändert sich der Repo-Status danach, gewinnt das Repo — die Handänderung
 *    bezog sich auf einen Stand, den es nicht mehr gibt.
 *  - `custom`: Ideen, die das Repo nicht kennt (selbst angelegt, importiert).
 */

export const STORAGE_KEY_V1 = 'amelie_unpacked_candidates_v1';
export const STORAGE_KEY_V2 = 'amelie_unpacked_candidates_v2';

export interface CandidateOverride {
  status: CandidateStatus;
  suggestedVerdict: Verdict;
  baseStatus: CandidateStatus;
}

export interface StoredCandidates {
  overrides: Record<string, CandidateOverride>;
  custom: CandidateIdea[];
}

export const EMPTY_STORED: StoredCandidates = { overrides: {}, custom: [] };

/** Repo-Daten plus lokale Änderungen. Eigene Ideen stehen vorn. */
export function mergeCandidates(base: CandidateIdea[], stored: StoredCandidates): CandidateIdea[] {
  const baseIds = new Set(base.map((b) => b.id));
  const merged = base.map((b) => {
    const o = stored.overrides[b.id];
    if (!o || o.baseStatus !== b.status) return b;
    return { ...b, status: o.status, suggestedVerdict: o.suggestedVerdict };
  });
  const custom = stored.custom.filter((c) => c && c.id && !baseIds.has(c.id));
  return [...custom, ...merged];
}

/** Zerlegt die aktuelle Liste in das, was gespeichert werden muss. */
export function toStored(base: CandidateIdea[], candidates: CandidateIdea[]): StoredCandidates {
  const baseById = new Map(base.map((b) => [b.id, b]));
  const overrides: Record<string, CandidateOverride> = {};
  const custom: CandidateIdea[] = [];
  for (const c of candidates) {
    const b = baseById.get(c.id);
    if (!b) {
      custom.push(c);
    } else if (c.status !== b.status) {
      overrides[c.id] = { status: c.status, suggestedVerdict: c.suggestedVerdict, baseStatus: b.status };
    }
  }
  return { overrides, custom };
}

/**
 * Übernimmt aus dem alten v1-Speicher nur die eigenen Ideen. Statuswerte aus
 * v1 werden verworfen: Dort lässt sich eine Handänderung nicht von einer
 * veralteten Kopie unterscheiden, und veraltete Kopien sind der Fehler, den v2
 * behebt.
 */
export function migrateV1(base: CandidateIdea[], v1: unknown): StoredCandidates {
  if (!Array.isArray(v1)) return EMPTY_STORED;
  const baseIds = new Set(base.map((b) => b.id));
  const custom = (v1 as CandidateIdea[]).filter(
    (c) => c && typeof c.id === 'string' && typeof c.title === 'string' && !baseIds.has(c.id)
  );
  return { overrides: {}, custom };
}

export function parseStored(raw: string | null): StoredCandidates | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    if (p && typeof p === 'object' && !Array.isArray(p)) {
      return {
        overrides: p.overrides && typeof p.overrides === 'object' ? p.overrides : {},
        custom: Array.isArray(p.custom) ? p.custom : [],
      };
    }
  } catch {
    // kaputter Eintrag: wie leer behandeln
  }
  return null;
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Liest v2, sonst migriert v1 (und löscht es danach). */
export function loadCandidates(base: CandidateIdea[], storage: StorageLike): CandidateIdea[] {
  try {
    const v2 = parseStored(storage.getItem(STORAGE_KEY_V2));
    if (v2) return mergeCandidates(base, v2);
    const rawV1 = storage.getItem(STORAGE_KEY_V1);
    if (rawV1) {
      const migrated = migrateV1(base, JSON.parse(rawV1));
      storage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
      storage.removeItem(STORAGE_KEY_V1);
      return mergeCandidates(base, migrated);
    }
  } catch {
    // Speicher nicht verfügbar oder kaputt: Repo-Stand zeigen
  }
  return base;
}

export function saveCandidates(base: CandidateIdea[], candidates: CandidateIdea[], storage: StorageLike): void {
  try {
    storage.setItem(STORAGE_KEY_V2, JSON.stringify(toStored(base, candidates)));
  } catch {
    // Speicher voll oder gesperrt: nichts zu tun
  }
}

export function clearCandidates(storage: StorageLike): void {
  try {
    storage.removeItem(STORAGE_KEY_V2);
    storage.removeItem(STORAGE_KEY_V1);
  } catch {
    // ignorieren
  }
}

/** Ideen, die als geprüft und nicht besetzt gelten — nur die dürfen gepackt werden. */
export function isReadyToPack(status: CandidateStatus): boolean {
  return status === 'frei' || status === 'verengt';
}

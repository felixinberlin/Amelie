import { describe, it, expect } from 'vitest';
import { CandidateIdea } from '../types';
import {
  mergeCandidates,
  toStored,
  migrateV1,
  loadCandidates,
  saveCandidates,
  STORAGE_KEY_V1,
  STORAGE_KEY_V2,
  isReadyToPack,
} from './candidateStorage';

function idea(id: string, status: CandidateIdea['status']): CandidateIdea {
  return {
    id,
    title: id,
    round: 'Test',
    date: '24.09.2026',
    conceptDe: '',
    conceptEn: '',
    status,
    suggestedVerdict: 'gift',
    recipientDe: '',
    recipientEn: '',
    sourceType: 'Typ A',
    sourceDe: '',
    sourceEn: '',
    evidenceDe: '',
    evidenceEn: '',
    reviewDate: '–',
  };
}

function memoryStorage(init: Record<string, string> = {}) {
  const data = new Map(Object.entries(init));
  return {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    data,
  };
}

describe('candidateStorage', () => {
  it('Repo-Korrektur schlägt die alte v1-Kopie (der Fehler, den v2 behebt)', () => {
    const base = [idea('a', 'besetzt')];
    const storage = memoryStorage({ [STORAGE_KEY_V1]: JSON.stringify([idea('a', 'frei')]) });
    const list = loadCandidates(base, storage);
    expect(list.find((c) => c.id === 'a')?.status).toBe('besetzt');
    expect(storage.data.has(STORAGE_KEY_V1)).toBe(false);
    expect(storage.data.has(STORAGE_KEY_V2)).toBe(true);
  });

  it('v1-Migration behält eigene Ideen', () => {
    const base = [idea('a', 'frei')];
    const migrated = migrateV1(base, [idea('a', 'frei'), idea('custom-1', 'unklar')]);
    expect(migrated.custom.map((c) => c.id)).toEqual(['custom-1']);
    expect(migrated.overrides).toEqual({});
  });

  it('Handänderung bleibt, solange das Repo gleich bleibt', () => {
    const base = [idea('a', 'ungeprüft')];
    const edited = [{ ...idea('a', 'unklar') }];
    const stored = toStored(base, edited);
    expect(mergeCandidates(base, stored)[0].status).toBe('unklar');
  });

  it('Handänderung verfällt, wenn das Repo den Status inzwischen geändert hat', () => {
    const oldBase = [idea('a', 'ungeprüft')];
    const stored = toStored(oldBase, [idea('a', 'frei')]);
    const newBase = [idea('a', 'besetzt')];
    expect(mergeCandidates(newBase, stored)[0].status).toBe('besetzt');
  });

  it('speichert nur Abweichungen und eigene Ideen', () => {
    const base = [idea('a', 'frei'), idea('b', 'verengt')];
    const storage = memoryStorage();
    saveCandidates(base, [idea('custom-1', 'frei'), ...base], storage);
    const saved = JSON.parse(storage.data.get(STORAGE_KEY_V2)!);
    expect(saved.overrides).toEqual({});
    expect(saved.custom.map((c: CandidateIdea) => c.id)).toEqual(['custom-1']);
  });

  it('kaputter Speicher zeigt den Repo-Stand', () => {
    const base = [idea('a', 'frei')];
    const storage = memoryStorage({ [STORAGE_KEY_V2]: '{kaputt' , [STORAGE_KEY_V1]: 'auch kaputt' });
    expect(loadCandidates(base, storage)).toEqual(base);
  });

  it('ungeprüft ist nicht packfertig', () => {
    expect(isReadyToPack('ungeprüft')).toBe(false);
    expect(isReadyToPack('verengt')).toBe(true);
  });
});

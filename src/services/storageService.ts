import { DoseItem, CandidateIdea, StorageProvider, IdeasDatabaseExport } from '../types';
import { DOSEN_DATA, DISCARDED_DATA } from '../data/dosen';
import { CANDIDATE_IDEAS_DATA } from '../data/unpacked';

const STORAGE_KEY_PROVIDER = 'amelie_storage_provider';
const STORAGE_KEY_DOSEN = 'amelie_custom_dosen';
const STORAGE_KEY_CANDIDATES = 'amelie_custom_candidates';

/**
 * Get active storage provider. Default is 'github_pages' for 100% static hosting on GitHub Pages.
 */
export function getStorageProvider(): StorageProvider {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROVIDER);
    if (saved === 'firebase' || saved === 'github_pages') {
      return saved;
    }
  } catch (e) {
    // fallback
  }
  return 'github_pages';
}

/**
 * Set active storage provider.
 */
export function setStorageProvider(provider: StorageProvider): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROVIDER, provider);
  } catch (e) {
    console.error('Failed to save storage provider', e);
  }
}

/**
 * Load all Dosen (seed dataset merged with any locally created or edited Dosen).
 */
export function getActiveDosen(): DoseItem[] {
  try {
    const localStr = localStorage.getItem(STORAGE_KEY_DOSEN);
    if (localStr) {
      const parsed: DoseItem[] = JSON.parse(localStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Create map of seed doses
        const map = new Map<string, DoseItem>();
        DOSEN_DATA.forEach((d) => map.set(d.id, d));
        // Overwrite or append custom ones
        parsed.forEach((d) => map.set(d.id, d));
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.warn('Error reading custom dosen from localStorage:', e);
  }
  return DOSEN_DATA;
}

/**
 * Save or update a Dose in local storage (GitHub Pages friendly).
 */
export function saveDoseLocal(dose: DoseItem): void {
  try {
    const current = getActiveDosen();
    const idx = current.findIndex((d) => d.id === dose.id);
    let updated: DoseItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = dose;
    } else {
      updated = [dose, ...current];
    }
    localStorage.setItem(STORAGE_KEY_DOSEN, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save dose locally:', e);
  }
}

/**
 * Load all candidate ideas (unpacked), merging seed data with local additions.
 */
export function getActiveCandidates(): CandidateIdea[] {
  try {
    const localStr = localStorage.getItem(STORAGE_KEY_CANDIDATES);
    if (localStr) {
      const parsed: CandidateIdea[] = JSON.parse(localStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map<string, CandidateIdea>();
        CANDIDATE_IDEAS_DATA.forEach((c) => map.set(c.id, c));
        parsed.forEach((c) => map.set(c.id, c));
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.warn('Error reading custom candidates from localStorage:', e);
  }
  return CANDIDATE_IDEAS_DATA;
}

/**
 * Save or update a Candidate Idea locally.
 */
export function saveCandidateLocal(candidate: CandidateIdea): void {
  try {
    const current = getActiveCandidates();
    const idx = current.findIndex((c) => c.id === candidate.id);
    let updated: CandidateIdea[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = candidate;
    } else {
      updated = [candidate, ...current];
    }
    localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save candidate locally:', e);
  }
}

/**
 * Formats full dataset into clean, beautiful JSON ready for committing to Git
 * or serving from public/data/ on GitHub Pages.
 */
export function exportDatabaseAsJson(dosen: DoseItem[], candidates: CandidateIdea[]): string {
  const exportPayload: IdeasDatabaseExport = {
    $schema: 'https://raw.githubusercontent.com/felixinberlin/amelie/main/public/data/amelie-schema.json',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    license: 'CC0-1.0 (Public Domain / Kula-Ring)',
    storageProvider: getStorageProvider(),
    repository: 'https://github.com/felixinberlin/amelie',
    stats: {
      totalDosen: dosen.length,
      totalUnpacked: candidates.length,
      totalDiscarded: DISCARDED_DATA.length,
    },
    dosen,
    unpackedCandidates: candidates,
    discarded: DISCARDED_DATA,
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Exports a Dose into the official Amélie Markdown Dossier format with YAML Frontmatter,
 * perfectly compatible with GitHub Pages, Jekyll, Hugo, and Obsidian.
 */
export function exportDoseAsMarkdown(dose: DoseItem, lang: 'de' | 'en' = 'de'): string {
  const isDe = lang === 'de';
  const tagsStr = dose.tags ? dose.tags.map((t) => `"${t}"`).join(', ') : '';
  const whyList = isDe ? dose.whyNowDe : dose.whyNowEn;
  const whyFormatted = whyList && whyList.length > 0 ? whyList.map((w, i) => `${i + 1}. **${w}**`).join('\n') : '';

  return `---
id: "${dose.id}"
title: "${dose.title}"
date: "${dose.date}"
review_after: "${dose.reviewAfter}"
domain: "${dose.domain}"
verdict: "${dose.verdict}"
status: "${dose.status}"
recipients: "${isDe ? dose.recipientsDe : dose.recipientsEn}"
tags: [${tagsStr}]
license: "CC0-1.0 (Public Domain / Kula-Ring)"
---

# ${dose.title}

**Ein Satz:** ${isDe ? dose.oneLinerDe : dose.oneLinerEn}

**Stand:** ${dose.date} · **Prüfen ab:** ${dose.reviewAfter}
**Empfänger:** ${isDe ? dose.recipientsDe : dose.recipientsEn}
**Verdikt:** ${dose.verdict === 'gift' ? '🎁 verschenken' : dose.verdict === 'build_first' ? '🔨 erst bauen' : '📦 behalten'}

---

## ${isDe ? 'Das Problem' : 'The Problem'}

${isDe ? dose.problemDe : dose.problemEn}

## ${isDe ? 'Warum das jetzt geht' : 'Why Now'}

${whyFormatted}

## ${isDe ? 'Skizze' : 'Architecture Sketch'}

${isDe ? dose.sketchDe : dose.sketchEn}

## ${isDe ? 'Erster Schritt' : 'First Step'}

**Ticket:** ${isDe ? dose.firstStepDe.ticket : dose.firstStepEn.ticket}
**Kriterien:** ${isDe ? dose.firstStepDe.criteria : dose.firstStepEn.criteria}

## ${isDe ? 'Wo es kippt' : 'Where it Breaks (Failure Mode)'}

${isDe ? dose.failureModeDe : dose.failureModeEn}

## ${isDe ? 'Wer es schon versucht hat' : 'Prior Art'}

${isDe ? dose.priorArtDe : dose.priorArtEn}

---

*Diese Idee gehört niemandem. Nimm sie, bau sie, verschenke sie — du schuldest niemandem etwas.*
*CC0 / Public Domain. — Kula-Ring · github.com/felixinberlin/amelie*
`;
}

/**
 * Browser file download helper.
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'application/json'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validates and imports ideas from uploaded JSON.
 */
export function importDatabaseFromJson(jsonStr: string): { importedDosen: number; importedCandidates: number } {
  const parsed = JSON.parse(jsonStr);
  let importedDosen = 0;
  let importedCandidates = 0;

  if (parsed.dosen && Array.isArray(parsed.dosen)) {
    const current = getActiveDosen();
    const map = new Map<string, DoseItem>();
    current.forEach((d) => map.set(d.id, d));
    parsed.dosen.forEach((d: DoseItem) => {
      if (d.id && d.title) {
        map.set(d.id, d);
        importedDosen++;
      }
    });
    localStorage.setItem(STORAGE_KEY_DOSEN, JSON.stringify(Array.from(map.values())));
  }

  if (parsed.unpackedCandidates && Array.isArray(parsed.unpackedCandidates)) {
    const currentCands = getActiveCandidates();
    const mapC = new Map<string, CandidateIdea>();
    currentCands.forEach((c) => mapC.set(c.id, c));
    parsed.unpackedCandidates.forEach((c: CandidateIdea) => {
      if (c.id && c.title) {
        mapC.set(c.id, c);
        importedCandidates++;
      }
    });
    localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(Array.from(mapC.values())));
  }

  return { importedDosen, importedCandidates };
}

/**
 * Resets local overrides back to bundled source data.
 */
export function resetLocalDatabase(): void {
  localStorage.removeItem(STORAGE_KEY_DOSEN);
  localStorage.removeItem(STORAGE_KEY_CANDIDATES);
  localStorage.removeItem(STORAGE_KEY_SENT_EMAILS);
}

const STORAGE_KEY_SENT_EMAILS = 'amelie_sent_emails';

export interface SentEmailRecord {
  sent: boolean;
  sentAt: string;
  notes?: string;
}

/**
 * Retrieves the sent emails map from localStorage.
 * Initializes mail-1 as sent if no records exist yet (fulfilling user request).
 */
export function getSentEmailsMap(): Record<string, SentEmailRecord> {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SENT_EMAILS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load sent emails from storage', e);
  }
  // Initial default state with Mail 1 marked as sent
  const initialMap: Record<string, SentEmailRecord> = {
    'mail-1': {
      sent: true,
      sentAt: '2026-09-20T07:03:55Z',
      notes: 'Altbau Thermal → Forschungsverbund EnergyMap Berlin (UdK Berlin)',
    },
  };
  try {
    localStorage.setItem(STORAGE_KEY_SENT_EMAILS, JSON.stringify(initialMap));
  } catch (e) {
    // ignore
  }
  return initialMap;
}

export function saveSentEmailsMap(map: Record<string, SentEmailRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY_SENT_EMAILS, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save sent emails to localStorage:', e);
  }
}

export function markEmailAsSent(mailId: string, sent: boolean = true, customDate?: string): SentEmailRecord {
  const current = getSentEmailsMap();
  const record: SentEmailRecord = {
    sent,
    sentAt: sent ? customDate || new Date().toISOString() : '',
  };
  current[mailId] = record;
  saveSentEmailsMap(current);
  return record;
}

export function isEmailMarkedSent(mailId: string): boolean {
  const current = getSentEmailsMap();
  return !!current[mailId]?.sent;
}

import { CandidateIdea } from '../types';
import { CANDIDATE_IDEAS_DATA } from '../data/unpacked';
const STORAGE_KEY_CANDIDATES = 'amelie_custom_candidates';

/**
 * Load all candidate ideas (unpacked), merging seed data with local additions.
 */
export function getActiveCandidates(): CandidateIdea[] {
  try {
    const localStr = localStorage.getItem(STORAGE_KEY_CANDIDATES);
    if (localStr) {
      const parsed: CandidateIdea[] = JSON.parse(localStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Repo-Daten gewinnen für bekannte ids — wie bei getActiveDosen. Vorher
        // gewann die lokale Kopie, und Korrekturen aus dem Prüfprotokoll kamen
        // bei wiederkehrenden Besuchern nie an.
        const map = new Map<string, CandidateIdea>();
        CANDIDATE_IDEAS_DATA.forEach((c) => map.set(c.id, c));
        parsed.forEach((c) => {
          if (c && c.id && !map.has(c.id)) map.set(c.id, c);
        });
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


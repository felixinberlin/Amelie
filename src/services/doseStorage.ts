import { DoseItem } from '../types';
import { DOSEN_DATA } from '../data/dosen';
const STORAGE_KEY_DOSEN = 'amelie_custom_dosen';
const STORAGE_KEY_CANDIDATES = 'amelie_custom_candidates';

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
        // Overwrite or append custom ones, preserving repository integrity
        parsed.forEach((d) => {
          const seed = map.get(d.id);
          if (seed) {
            map.set(d.id, {
              ...d,
              ...seed,
              tags: Array.from(new Set([...(seed.tags || []), ...(d.tags || [])])),
              emailTemplates: (seed.emailTemplates && seed.emailTemplates.length > 0) ? seed.emailTemplates : d.emailTemplates,
            });
          } else {
            map.set(d.id, d);
          }
        });
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.warn('Error reading custom dosen from localStorage:', e);
  }
  return DOSEN_DATA;
}

/**
 * Resets local storage cache to match the codebase/repository defaults.
 */
export function resetDosenStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_DOSEN);
    localStorage.removeItem(STORAGE_KEY_CANDIDATES);
  } catch (e) {
    console.error('Failed to reset localStorage:', e);
  }
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


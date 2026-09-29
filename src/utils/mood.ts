import { DEFAULT_MOOD, MOODS, MoodId, isMoodId } from '../data/moods';

export const MOOD_STORAGE_KEY = 'amelie_mood_v1';

/** Reihenfolge: ?mood=… in der URL (zum Teilen), dann das zuletzt gewählte, dann die Standardstimmung. */
export function resolveInitialMood(search: string, stored: string | null): MoodId {
  const fromUrl = new URLSearchParams(search).get('mood');
  if (isMoodId(fromUrl)) return fromUrl;
  if (isMoodId(stored)) return stored;
  return DEFAULT_MOOD;
}

export function readStoredMood(): string | null {
  try {
    return localStorage.getItem(MOOD_STORAGE_KEY);
  } catch {
    return null; // privater Modus o. Ä.
  }
}

/** Entfernt ?mood= aus der Adresszeile, damit die Auswahl einen Reload übersteht. */
export function clearMoodFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('mood')) return;
    url.searchParams.delete('mood');
    window.history.replaceState(window.history.state, '', url);
  } catch {
    /* Adresszeile bleibt unverändert */
  }
}

export function storeMood(id: MoodId): void {
  try {
    localStorage.setItem(MOOD_STORAGE_KEY, id);
  } catch {
    /* Auswahl gilt dann nur für diese Sitzung */
  }
}

/** Setzt die Stimmung am <html>-Element und färbt die Browserleiste mit. */
export function applyMood(id: MoodId): void {
  const root = document.documentElement;
  if (id === DEFAULT_MOOD) root.removeAttribute('data-mood');
  else root.setAttribute('data-mood', id);
  const meta = document.querySelector('meta[name="theme-color"]');
  const def = MOODS.find((m) => m.id === id);
  if (meta && def) meta.setAttribute('content', def.themeColor);
}

export function initMood(): MoodId {
  const id = resolveInitialMood(window.location.search, readStoredMood());
  applyMood(id);
  return id;
}

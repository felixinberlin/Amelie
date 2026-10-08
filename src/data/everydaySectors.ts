import { CandidateIdea } from '../types';

export type EverydaySector = 'care' | 'craft' | 'cleaning' | 'food' | 'transport' | 'education' | 'forestry';

/**
 * Berufsfeld-Zuordnung für den Tab „Alltagsarbeit".
 *
 * Jede Idee gehört zu genau einem Feld (erster Treffer in dieser Reihenfolge),
 * damit die Zähler zusammen die Gesamtzahl ergeben. Vorher wurden Tags in drei
 * Kopien der Liste geprüft; Fleischer, Bäcker und Landschaftsbauer zählten
 * doppelt („Handwerk" und „Lebensmittel"/„Gartenbau"). „craft" steht zuletzt,
 * weil „Handwerk" als Tag fast überall mitläuft.
 */
export const SECTOR_TAGS: Array<[EverydaySector, string[]]> = [
  ['care', ['Pflege', 'Gesundheit', 'Wundversorgung', 'Altenpflege', 'Senioren']],
  ['cleaning', ['Reinigung']],
  ['transport', ['Lieferanten', 'Paketboten', 'Transport', 'LKW', 'Busfahrer', 'ÖPNV']],
  ['food', ['Gastronomie', 'Bäcker', 'Kochen', 'Lebensmittel', 'Fleischer', 'Kellner', 'Service']],
  ['education', ['Kita', 'Bildung', 'Erzieher']],
  ['forestry', ['Forstwirtschaft', 'Wald', 'Landwirtschaft', 'Bauern', 'Gartenbau', 'GaLaBau']],
  ['craft', ['Handwerk', 'Baustelle', 'Sanitär', 'Dachdecker', 'Schornsteinfeger', 'Kfz', 'Schreiner', 'Tischler', 'Friseur']],
];

export function sectorOf(idea: CandidateIdea): EverydaySector | null {
  const tags = idea.tags ?? [];
  for (const [sector, sectorTags] of SECTOR_TAGS) {
    if (tags.some((t) => sectorTags.includes(t))) return sector;
  }
  return null;
}

import { CandidateIdea, Language } from '../types';
import {
  PRIVACY_AND_LOCAL_IDEAS,
  HOME_AND_FINANCE_IDEAS,
  COMMUNITY_AND_RURAL_IDEAS,
  UTILITIES_AND_TRADES_IDEAS,
  CIVIC_AND_ECOLOGY_IDEAS,
  CRAFT_AND_MAKING_IDEAS,
  HEALTH_AND_CARE_IDEAS,
  EDUCATION_AND_FAMILY_IDEAS,
  CIVIC_AND_PUBLIC_GOODS_IDEAS,
  ADDITIONAL_PRACTICAL_IDEAS,
  MICRO_UTILITIES_BATCH,
  REGIONAL_AND_RESILIENCE_IDEAS,
  AI_NATIVE_FRONTIER_IDEAS,
  NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS,
  GAME_IDEAS,
} from './ideas';

/**
 * Wer zeigt was?
 *
 * CANDIDATE_IDEAS_DATA bleibt die vollständige Liste (Export, Prüfprotokoll-Abgleich).
 * Die Ansichten zeigen daraus jeweils ihren eigenen Ausschnitt, damit keine Idee
 * an zwei Orten steht:
 *  - Tab „Ideen-Pipeline": nur noch nicht verpackte Themenideen — ohne Spielideen
 *    (Tab „Games"), ohne Alltagsberufe (Tab „Alltagsarbeit") und standardmäßig
 *    ohne Ideen, die schon als Dose vorliegen.
 *  - Tab „Alltagsarbeit": NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.
 *  - Tab „Games": GAME_IDEAS, Spiel-Dosen und spielbare Mini-Spiele.
 */

const GAME_IDS = new Set(GAME_IDEAS.map((i) => i.id));
const EVERYDAY_IDS = new Set(NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.map((i) => i.id));

/** Ids der Dosen, die im Kern ein Spiel sind. */
export const GAME_DOSE_IDS = ['fugenduell-asphalt-arena', 'lebendes-spielobjekt', 'tischschiedsrichter'] as const;

export const isGameIdea = (idea: CandidateIdea): boolean => GAME_IDS.has(idea.id);
export const isEverydayIdea = (idea: CandidateIdea): boolean => EVERYDAY_IDS.has(idea.id);
export const isPackedIdea = (idea: CandidateIdea): boolean => Boolean(idea.packedDoseId);

/** Ideen, die im Pipeline-Tab erscheinen. `showPacked` blendet bereits gepackte wieder ein. */
export function pipelineIdeas(all: CandidateIdea[], showPacked = false): CandidateIdea[] {
  return all.filter((i) => !isGameIdea(i) && !isEverydayIdea(i) && (showPacked || !isPackedIdea(i)));
}

export interface PipelineTheme {
  id: string;
  label: Record<Language, string>;
  ideas: CandidateIdea[];
}

const themeOfList = (
  id: string,
  de: string,
  en: string,
  es: string,
  ...lists: CandidateIdea[][]
): PipelineTheme => ({ id, label: { de, en, es }, ideas: lists.flat() });

/** Themenkörbe für die Pipeline. Eine Idee gehört zu genau einem Korb; der Rest landet in „Forschungsrunden". */
export const PIPELINE_THEMES: PipelineTheme[] = [
  themeOfList('civic', 'Gemeinwohl & Land', 'Civic, Land & Community', 'Bien común y campo',
    CIVIC_AND_ECOLOGY_IDEAS, CIVIC_AND_PUBLIC_GOODS_IDEAS, COMMUNITY_AND_RURAL_IDEAS, REGIONAL_AND_RESILIENCE_IDEAS),
  themeOfList('home', 'Haus, Garten & Geld', 'Home, Garden & Money', 'Hogar, jardín y dinero',
    HOME_AND_FINANCE_IDEAS, MICRO_UTILITIES_BATCH),
  themeOfList('craft', 'Werkstatt & Handwerk', 'Workshop & Trades', 'Taller y oficios',
    CRAFT_AND_MAKING_IDEAS, UTILITIES_AND_TRADES_IDEAS),
  themeOfList('health', 'Gesundheit & Pflege', 'Health & Care', 'Salud y cuidados', HEALTH_AND_CARE_IDEAS),
  themeOfList('education', 'Bildung & Familie', 'Education & Family', 'Educación y familia', EDUCATION_AND_FAMILY_IDEAS),
  themeOfList('privacy', 'Datenschutz & Lokal', 'Privacy & Local-First', 'Privacidad y local', PRIVACY_AND_LOCAL_IDEAS),
  themeOfList('ai', 'KI-Frontier', 'AI-Native Frontier', 'Frontera IA', AI_NATIVE_FRONTIER_IDEAS),
  themeOfList('field', 'Feldnotizen', 'Field Notes', 'Notas de campo', ADDITIONAL_PRACTICAL_IDEAS),
];

export const RESEARCH_THEME_ID = 'research';

const THEME_BY_ID = new Map<string, string>();
for (const theme of PIPELINE_THEMES) for (const idea of theme.ideas) THEME_BY_ID.set(idea.id, theme.id);

export const themeIdOf = (idea: CandidateIdea): string => THEME_BY_ID.get(idea.id) ?? RESEARCH_THEME_ID;

export const RESEARCH_THEME_LABEL: Record<Language, string> = {
  de: 'Forschungsrunden',
  en: 'Research Rounds',
  es: 'Rondas de investigación',
};

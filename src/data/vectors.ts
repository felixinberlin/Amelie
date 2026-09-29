import type { Language } from '../types';
import doseVectorsJson from './doseVectors.json';

/**
 * Vektor-Katalog des Idea Reviewers (Skill `idea-reviewer`, Rubrik in
 * `skills/idea-reviewer/idea-reviewer/references/vector-rubrics.md`).
 * V1–V7 sind die Kernvektoren (Summe /35, Dose-Ready-Gate ≥ 24), V8 „Fun"
 * ist seit 29.09.2026 ein additiver Blick (Gesamt /40) und kompensiert nie.
 */
export type VectorKey = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'fun';

export interface VectorDef {
  key: VectorKey;
  code: string;
  labelDe: string;
  labelEn: string;
  questionDe: string;
  questionEn: string;
  /** false = zählt nicht zum Dose-Ready-Kernscore */
  core: boolean;
}

export const VECTOR_CATALOG: VectorDef[] = [
  { key: 'v1', code: 'V1', labelDe: 'Neuheit', labelEn: 'Novelty', core: true,
    questionDe: 'Wie weit ist die Idee vom Erwartbaren entfernt (Boden, Lückensatz)?',
    questionEn: 'How far is the idea from the obvious (Boden, lacunar gap)?' },
  { key: 'v2', code: 'V2', labelDe: 'Komplexität', labelEn: 'Complexity', core: true,
    questionDe: 'Wie leicht ist es zu bauen und zu warten? (5 = statisch, ohne Server)',
    questionEn: 'How light to build and maintain? (5 = static, no server)' },
  { key: 'v3', code: 'V3', labelDe: 'Machbarkeit', labelEn: 'Possibility', core: true,
    questionDe: 'Trägt die Physik/das Recht, und was macht es jetzt möglich („Why now")?',
    questionEn: 'Do physics/law hold, and what makes it possible now ("why now")?' },
  { key: 'v4', code: 'V4', labelDe: 'Langlebigkeit', labelEn: 'Longevity', core: true,
    questionDe: 'Wie lange bleibt das Geschenk relevant und lauffähig?',
    questionEn: 'How long does the gift stay relevant and running?' },
  { key: 'v5', code: 'V5', labelDe: 'Civic SWOT', labelEn: 'Civic SWOT', core: true,
    questionDe: 'Wie widerstandsfähig ist das Geschenk (Achillesferse vs. Verteidigungsanker)?',
    questionEn: 'How resilient is the gift (Achilles heel vs. defensibility anchor)?' },
  { key: 'v6', code: 'V6', labelDe: 'Tech-Tree', labelEn: 'Tech tree', core: true,
    questionDe: 'Sitzt der Kern zwischen tragfähigen Wurzeln und echten Abzweigen?',
    questionEn: 'Does the core sit between solid roots and real branches?' },
  { key: 'v7', code: 'V7', labelDe: 'Dokumentation', labelEn: 'Documentation', core: true,
    questionDe: 'Wie belastbar ist die Primärquelle (Typ A–D)?',
    questionEn: 'How solid is the primary source (Type A–D)?' },
  { key: 'fun', code: 'V8', labelDe: 'Fun', labelEn: 'Fun', core: false,
    questionDe: 'Macht schon die erste Viertelstunde Freude — Spiel, Sinneseindruck, Entdeckung, Humor?',
    questionEn: 'Are the first five minutes enjoyable in themselves — play, sensory feedback, discovery, humor?' },
];

export type FunSource = 'play' | 'sensory' | 'discovery' | 'humor' | 'mastery' | 'none';

export const FUN_SOURCE_LABEL: Record<FunSource, { de: string; en: string }> = {
  play: { de: 'Spiel', en: 'Play' },
  sensory: { de: 'Sinneseindruck', en: 'Sensory' },
  discovery: { de: 'Entdeckung', en: 'Discovery' },
  humor: { de: 'Humor', en: 'Humor' },
  mastery: { de: 'Meisterschaft', en: 'Mastery' },
  none: { de: 'keine', en: 'none' },
};

export interface DoseVectors {
  /** V1–V7 in Katalogreihenfolge */
  v: [number, number, number, number, number, number, number];
  fun: number;
  funSource: FunSource;
  funDe: string;
  funEn: string;
  /** Herkunft/Anmerkung des Reviewers (optional) */
  note?: string;
}

export const DOSE_VECTORS: Record<string, DoseVectors> = doseVectorsJson as unknown as Record<string, DoseVectors>;

export function getDoseVectors(id: string): DoseVectors | undefined {
  return DOSE_VECTORS[id];
}

export function vectorScore(vec: DoseVectors, key: VectorKey): number {
  return key === 'fun' ? vec.fun : vec.v[Number(key.slice(1)) - 1];
}

export const coreScore = (vec: DoseVectors): number => vec.v.reduce((a, b) => a + b, 0);
export const totalScore = (vec: DoseVectors): number => coreScore(vec) + vec.fun;

export function vectorLabel(def: VectorDef, lang: Language): string {
  return lang === 'de' ? def.labelDe : def.labelEn;
}
export function vectorQuestion(def: VectorDef, lang: Language): string {
  return lang === 'de' ? def.questionDe : def.questionEn;
}

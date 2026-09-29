import quellenJson from './quellen.json';

/**
 * Quellen-Register: jede Quelle, aus der Amélie Ideen, Technik und Möglichkeiten holt, ist ein Objekt
 * (Typ, Kategorie, Zugang, Inhalt, Status, Ertrag, Verlauf, Vektoren Q1–Q6).
 * Wahrheit ist `quellen.json`; `06-suche/amelie-quellen.md` wird daraus erzeugt.
 * Geschrieben wird nur über `npm run quellen -- …` (Bibliothekar). Handbuch: 06-suche/amelie-quellen-register.md
 */
export type QuelleStatus = 'offen' | 'angekratzt' | 'durchsucht' | 'erschöpft' | 'gesperrt';
export type QuelleRolle = 'ideenquelle' | 'besetzt-test' | 'evidenz' | 'empfaenger' | 'geldgeber';
export type QuelleEvidenz = 'seite' | 'schnipsel' | 'unbekannt';
export type QuelleZugangArt = 'web' | 'pdf' | 'repo' | 'api' | 'norm' | 'formular' | 'app' | 'register' | 'paywall' | 'offline';
export type QuelleErreichbar = 'ja' | 'teilweise' | 'gesperrt' | 'unbekannt';
export type VektorBasis = 'auto' | 'bibliothekar' | 'reviewer' | 'mensch';
export type QuellenVektorKey = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6';

export interface QuelleVerlauf {
  datum: string;
  agent: string;
  runde: string;
  notiz: string;
  status?: QuelleStatus;
}

export interface Quelle {
  id: string;
  name: string;
  /** Historischer Quellentyp A–W (Playbook) */
  typ: string;
  kategorie: string;
  rollen: QuelleRolle[];
  tags: string[];
  urls: string[];
  /** Wie kommt ein Agent heran, und geht das überhaupt? */
  zugang: { art: QuelleZugangArt; erreichbar: QuelleErreichbar; wie: string };
  enthaelt: string;
  /** Wonach dort gesucht werden soll */
  fokus: string;
  status: QuelleStatus;
  statusNotiz: string;
  evidenz: QuelleEvidenz;
  zuletzt: string | null;
  wiedervorlage?: string;
  ertrag: { dosen: string[]; graeber: string[]; kandidaten?: string[] };
  /** Q1–Q6 in Katalogreihenfolge, je 1–5 */
  vektoren: { q: [number, number, number, number, number, number]; basis: VektorBasis; datum: string };
  verlauf: QuelleVerlauf[];
}

export interface QuellenTyp { id: string; titel: string; muster: string; suchstring: string; hinweis: string }

export interface QuellenVektorDef {
  key: QuellenVektorKey;
  code: string;
  labelDe: string;
  labelEn: string;
  questionDe: string;
  questionEn: string;
}

interface Labeled { de: string; en: string }
export interface QuellenKatalog {
  status: { id: QuelleStatus; de: string; en: string; hint: string }[];
  kategorien: Record<string, Labeled>;
  rollen: Record<QuelleRolle, Labeled>;
  zugangArt: Record<QuelleZugangArt, string>;
  erreichbar: Record<QuelleErreichbar, string>;
  evidenz: Record<QuelleEvidenz, string>;
  basis: Record<VektorBasis, string>;
  vektoren: QuellenVektorDef[];
}

interface QuellenRegister {
  schema: number;
  stand: string;
  katalog: QuellenKatalog;
  typen: QuellenTyp[];
  quellen: Quelle[];
  nichtNutzen: string[];
}

const REGISTER = quellenJson as unknown as QuellenRegister;

export const QUELLEN_KATALOG = REGISTER.katalog;
export const QUELLEN_TYPEN = REGISTER.typen;
export const QUELLEN_DATA: Quelle[] = REGISTER.quellen;
export const QUELLEN_NICHT_NUTZEN = REGISTER.nichtNutzen;
export const QUELLEN_STAND = REGISTER.stand;

export function getQuelle(id: string): Quelle | undefined {
  return QUELLEN_DATA.find((q) => q.id === id);
}

export const quellenScore = (q: Quelle): number => q.vektoren.q.reduce((a, b) => a + b, 0);

/** Wie sinnvoll ist es, diese Quelle als Nächstes zu graben? (Gewichte wie `npm run quellen -- next`) */
export function quellenEmpfehlung(q: Quelle): number {
  const [q1, q2, q3, q4, q5, q6] = q.vektoren.q;
  return q2 * 3 + q3 * 2 + q5 * 2 + q1 * 2 + q4 + q6 * 0.5;
}

/** Quellen, die zu einer Dose geführt haben. */
export const quellenFuerDose = (doseId: string): Quelle[] => QUELLEN_DATA.filter((q) => q.ertrag.dosen.includes(doseId));

export function quellenNachKategorie(): Record<string, Quelle[]> {
  const out: Record<string, Quelle[]> = {};
  for (const q of QUELLEN_DATA) (out[q.kategorie] ??= []).push(q);
  return out;
}

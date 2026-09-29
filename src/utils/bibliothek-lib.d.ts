declare module '*bibliothek-lib.mjs' {
  export const PROTOKOLL: string;
  export const URTEILE: string[];
  export const GRAB_FELDER: string[];
  export interface Args { pos: string[]; flags: Record<string, string[]>; one(k: string): string | undefined; many(k: string): string[]; has(k: string): boolean }
  export interface ProtokollRow { line: number; section: string; idee: string; urteil: string | null; urteilRoh: string; beleg: string; pruefenAb: string; method: string | null; text: string }
  export interface ProtokollFelder { nr?: string; idee: string; method: string; urteil: string; beleg: string; marke: string; datum: string; pruefenAb: string }
  export function parseArgs(argv: string[]): Args;
  export function norm(s: unknown): string;
  export function matches(text: string, terms: string[], any?: boolean): boolean;
  export function snippet(text: string, terms: string[], width?: number): string;
  export function verdictOf(cell: string): string | null;
  export function parseProtokoll(text: string): ProtokollRow[];
  export function protokollStats(rows: ProtokollRow[]): { gesamt: Record<string, number>; nachAbschnitt: Record<string, Record<string, number>>; nachMethode: Record<string, Record<string, number>> };
  export function buildProtokollFelder(a: Record<string, string | undefined>): ProtokollFelder;
  export function formatProtokollRow(f: ProtokollFelder, spalten: 4 | 8): string;
  export function insertProtokollRow(text: string, a: { runde: string; felder: ProtokollFelder; neuerAbschnitt?: string }): { text: string; row: string };
  export function readCandidates(root?: string): { id: string; title: string; status: string; concept: string; packedDoseId: string | null; file: string }[];
  export function readDosen(): { id: string; title: string; text: string; file: string }[];
  export function findAll(terms: string[], o?: { any?: boolean; root?: string; quellen?: any[] }): { kind: string; bindend: boolean; id: string; title: string; where: string; snippet: string }[];
  export function readEnum(typeName: string, typesFile?: string): string[];
  export function validateGrab(g: Record<string, unknown>, o?: { graeber?: { id: string }[]; doseIds?: string[]; root?: string; enums?: Record<string, string[]> }): string[];
  export function orderGrab(g: Record<string, unknown>): Record<string, unknown>;
  export function parseQuellenmeldung(text: string, ctx: { quellen: any[]; katalog: any; doseIds: Set<string>; graveIds: Set<string>; typen: string[] }): { eintraege: any[]; fehler: string[] };
  export function meldungToArgs(e: any, o: { agent: string; runde: string }): string[];
}

declare module '*dosen-lib.mjs' {
  export const repoRoot: string;
  export function loadGraeber(file?: string): any[];
  export function readDataIds(): { dosen: string[]; discarded: string[] };
}

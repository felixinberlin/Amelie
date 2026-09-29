declare module '*bibliothek-lib.mjs' {
  export const PROTOKOLL: string;
  export const URTEILE: string[];
  export const GRAB_FELDER: string[];
  export const BOOLEAN_FLAGS: Set<string>;
  export interface Args { pos: string[]; flags: Record<string, string[]>; one(k: string): string | undefined; many(k: string): string[]; has(k: string): boolean }
  export interface ProtokollRow { line: number; section: string; idee: string; urteil: string | null; urteilRoh: string; beleg: string; pruefenAb: string; method: string | null; text: string }
  export interface ProtokollFelder { nr?: string; idee: string; method: string; urteil: string; beleg: string; marke: string; datum: string; pruefenAb: string }
  export function parseArgs(argv: string[]): Args;
  export function norm(s: unknown): string;
  export function matches(text: string, terms: string[], any?: boolean, wort?: boolean): boolean;
  export function snippet(text: string, terms: string[], width?: number): string;
  export function verdictOf(cell: string): string | null;
  export function parseProtokoll(text: string): ProtokollRow[];
  export function protokollStats(rows: ProtokollRow[]): { gesamt: Record<string, number>; nachAbschnitt: Record<string, Record<string, number>>; nachMethode: Record<string, Record<string, number>> };
  export function buildProtokollFelder(a: Record<string, string | undefined>): ProtokollFelder;
  export function formatProtokollRow(f: ProtokollFelder, spalten: 4 | 8): string;
  export function insertProtokollRow(text: string, a: { runde: string; felder: ProtokollFelder; neuerAbschnitt?: string }): { text: string; row: string };
  export function readCandidates(root?: string): { id: string; title: string; status: string; concept: string; packedDoseId: string | null; file: string }[];
  export function readDosen(): { id: string; title: string; text: string; file: string }[];
  export function findAll(terms: string[], o?: { any?: boolean; wort?: boolean; root?: string; quellen?: any[] }): { kind: string; bindend: boolean; id: string; title: string; where: string; snippet: string }[];
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

declare module '*bib-errors.mjs' {
  export class BibError extends Error { code: string; field: string; op?: number; constructor(o: { code: string; field?: string; message: string; op?: number }); toJSON(): { code: string; field: string; message: string; op?: number } }
  export const EXIT: Record<string, number>;
  export const ERROR_CODES: Record<string, number>;
  export function exitFor(errors: { code: string }[]): number;
}

declare module '*bib-store.mjs' {
  export const REL: Record<string, string>;
  export function acquireLock(root: string, o?: { wait?: number; actor?: string }): () => void;
  export function snapshot(root: string, extra?: string[]): any;
  export function restore(root: string, snap: any): void;
  export function writeJournal(root: string, snap: any, meta: any): void;
  export function recoverJournal(root: string): any;
  export function hashFile(root: string, rel: string): string;
  export function storeHashes(root: string): Record<string, string>;
  export function readLedger(root: string): { applied: Record<string, any> };
  export function permit(config: any, actor: string, op: string, o?: { flags?: Record<string, boolean> }): { ok: boolean; reason?: string };
}

declare module '*bib-apply.mjs' {
  export function applyPlan(plan: any, opts?: { root?: string; dryRun?: boolean; wait?: number; key?: string; planId?: string; actor?: string; agent?: string; runde?: string; generate?: boolean; exportData?: boolean; hooks?: { afterWrite?: () => void } }): any;
  export function readPlanFile(file: string): any;
}

declare module '*bib-ops.mjs' {
  export function buildSchema(root: string): any;
  export const OPERATIONS: Record<string, { required: string[]; optional: string[] }>;
}

declare module '*quellen-lib.mjs' {
  export function matchUrl(data: any, url: string): { id: string; name: string; matchedUrl: string; score: number; kind: string }[];
  export function loadQuellen(): any;
}

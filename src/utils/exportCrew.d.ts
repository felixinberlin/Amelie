// Typen für die Crew-Skripte (scripts/crew/*.mjs), damit die Tests unter tsc laufen. Bewusst locker: die Skripte sind JS.
declare module '*crew/contracts.mjs' {
  export const URTEILE: string[];
  export const EVIDENZ: string[];
  export const CONTRACTS: Record<string, { validate: (d: any) => string[]; shape: string }>;
  export function extractJson(text: unknown): { data?: any; error?: string };
  export function stripJson(text: unknown): string;
  export function validateCandidates(data: any): string[];
  export function validateReviews(data: any): string[];
  export function validateLibrarian(data: any): string[];
  export const TRIAGE: string[];
  export const DOSE_READY_GATE: number;
  export function loadGraveEnums(): Promise<{ cause: string[]; killer: string[]; foundBy: string[] }>;
  export function setGraveEnums(e: any): void;
  export function checkReport(contract: string, text: unknown): { ok: boolean; data: any; errors: string[] };
}
declare module '*crew/crew.mjs' {
  export const EXIT: { OK: number; USAGE: number; INCOMPLETE: number; WRITE_FAILED: number };
  export function loadDef(root: string, agent: string): { name: string; description: string; tools: string[]; body: string };
  export function systemPrompt(def: any, profile: any): string;
  export function fixedAdapter(text: string | (() => string), o?: any): any;
  export function runAgent(o: any): Promise<any>;
}
declare module '*crew/profiles.mjs' {
  export const PROFILES: Record<string, any>;
  export const CREW: string[];
  export function candidatesFromInputs(inputs: any[]): any[];
}
declare module '*crew/runs.mjs' {
  export const RUNS_DIR: string;
  export function newRunId(agent: string, now?: Date, rand?: () => number): string;
  export function runsDir(root: string, dir?: string): string;
  export function saveRun(root: string, record: any, o?: { dir?: string }): { json: string; md: string };
  export function listRuns(root: string, o?: { agent?: string; dir?: string }): any[];
  export function loadRun(root: string, ref: string, o?: { dir?: string }): any;
}
declare module '*crew/write.mjs' {
  export const LOGS: Record<string, string>;
  export function appendLog(o: any): any;
  export function bibApply(o: any): { status: number; out: any };
  export function renderLogSection(o: any): string;
  export function applyWrites(o: any): Promise<any>;
}
declare module '*crew/merge.mjs' {
  export function mergeRuns(runs: any[]): any;
  export function renderMerge(m: any): string;
}

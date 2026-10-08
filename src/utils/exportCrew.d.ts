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
declare module '*crew/librarian.mjs' {
  export const ACTOR: string;
  export const PLAYBOOK: string;
  export function quellenOps(lines: string[], o?: any): { ops: any[]; fehler: string[] };
  export function buildPlan(data: any, o?: any): { plan: any; fehler: string[] };
  export function dryRun(o: any): { errors: string[]; out: any; file: string };
  export function renderRetro(data: any, record: any): string | null;
}
declare module '*crew/merge.mjs' {
  export function mergeRuns(runs: any[]): any;
  export function renderMerge(m: any): string;
}

declare module '*crew/bundle.mjs' {
  export const ROLES: Record<string, any>;
  export const BUNDLE_SHAPES: Record<string, string>;
  export function validateBundle(data: any, opts?: { agent?: string; root?: string; requireBranch?: boolean }): string[];
  export function insertInto(src: string, s: any, rule: any): string;
  export function applyBundle(opts: { root: string; agent: string; data: any; dryRun?: boolean; gates?: string[][]; log?: (m: string) => void; touch?: string[]; pre?: () => void }): { planned: any[]; gates: any[]; dryRun: boolean };
  export function testBundle(opts: { root: string; data: any; timeoutMs?: number }): { ok: boolean; output: string };
  export function bundleToolText(opts: { agent: string; root: string; draft: any; test?: boolean }): string;
  export function currentBranch(root: string): string;
}

declare module '*crew/throttle.mjs' {
  export const DEFAULTS: { gapMs: number; tries: number; baseMs: number; maxMs: number };
  export function retryHint(err: unknown): number | null;
  export function backoffMs(i: number, err: unknown, opts?: { baseMs?: number; maxMs?: number; rand?: () => number }): number;
  export function sharedState(opts?: { key?: string; dir?: string; now?: () => number; sleep?: (ms: number) => Promise<void> }): { file: string; claim: (gapMs: number) => Promise<number>; cooldown: (ms: number) => Promise<number>; peek: () => any; reset: () => void };
  export function withThrottle(adapter: any, opts?: any): any;
  export const throttleKey: (spec: any) => string;
}

declare module '*crew/profiles.mjs' {
  export function downgradeCandidates(data: any, ctx: { toolLog?: any[] }): string[];
  export function downgradeReviews(data: any, ctx: { toolLog?: any[] }): string[];
}

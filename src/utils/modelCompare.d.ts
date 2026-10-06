declare module '*model-compare/lib.mjs' {
  export const VERDICTS: string[];
  export const JUDGE_VERDICTS: string[];
  export function parseKandidaten(text: string): { id: string | null; title: string; urteil: string | null; urteilRoh: string; beleg: string; urls: string[]; seite: number; schnipsel: number }[];
  export function keyTokens(row: { id?: string | null; title: string }): string[];
  export function similar(a: any, b: any): boolean;
  export function priorArt(row: any, findFn: (terms: string[]) => any[]): { known: boolean; buried: boolean; packed: boolean; hits: number };
  export function scoreRun(run: any, ctx: { quellenCtx?: any; findFn: (terms: string[]) => any[] }): any;
  export function costOf(usage: { in?: number; out?: number }, price: { in: number | null; out: number | null } | null | undefined): number | null;
  export function clusterKandidaten(perModel: Record<string, any[]>): any[];
  export function konvergenz(clusters: any[], models: string[]): Record<string, number | null>;
  export function ueberschneidung(clusters: any[], models: string[]): Record<string, Record<string, number | null>>;
  export function judgeList(clusters: any[]): string;
  export function parseJudge(text: string): { n: number; verdict: string; reason: string }[];
  export function judgeShare(clusters: any[], judged: { n: number; verdict: string }[], models: string[]): Record<string, any>;
  export function aggregateModel(scores: any[], price: any): any;
  export function renderReport(o: { meta: any; models: any[]; agg: any; konv: any; judge: any }): string;
}
declare module '*model-compare/tools.mjs' {
  export const TOOL_DEFS: { name: string; description: string; input_schema: any }[];
  export function htmlToText(html: string): string;
  export function createHandlers(o?: { quellen?: any[]; fetchFn?: (url: string) => Promise<{ status: number; text: string; type: string }>; maxFetch?: number; findFn?: any }): Record<string, (args: any) => Promise<string>>;
}
declare module '*model-compare/providers.mjs' {
  export const PROVIDERS: string[];
  export function runConversation(adapter: any, o: { system: string; user: string; tools: any[]; handlers: Record<string, (a: any) => Promise<string>>; nativeSearch?: boolean; maxTurns?: number; meta?: any; requireTool?: { names: string[]; nudge: string; max?: number } | null }): Promise<{ text: string; usage: any; toolLog: any[]; stop: string; turns: number }>;
  export function resolveEnv(spec: any, env?: Record<string, string | undefined>): { project: string | null; region: string; geminiKey: string | null };
  export function checkReady(spec: any, o?: { env?: Record<string, string | undefined>; loadSdk?: (name: string) => Promise<any> }): Promise<{ ok: boolean; problems: string[] }>;
  export function mockReply(spec: any, o?: { engine?: string }): string;
  export function createProvider(spec: any, deps?: { client?: any; fetch?: any; baseDelay?: number; loadSdk?: (name: string) => Promise<any>; env?: Record<string, string | undefined> }): Promise<any>;
}
declare module '*model-compare/prompts.mjs' {
  export const ENGINES: Record<string, { agent: string; skill: string; label: string }>;
  export function quellenFormatText(quellen: any): string;
  export function warnliste(thema: string, quellen: any, root: string): string;
  export function buildPrompts(o: { root: string; thema: string; datum: string; engine: string; quellen: any; search?: string }): { system: string; user: string; label: string };
}
declare module '*model-compare/runner.mjs' {
  export const RUNS: string;
  export const BERICHTE: string;
  export function loadConfig(root: string, file?: string): { judge?: string; models: any[]; file: string };
  export function runAll(opts: any, deps?: any): Promise<any>;
  export function loadRun(root: string, run: string, runsDir?: string): { dir: string; meta: any; perModel: Record<string, any[]> };
  export function scoreRunDir(o: { root?: string; run: string; write?: boolean; runsDir?: string; berichteDir?: string }): any;
  export function judgeRun(o: { root?: string; run: string; spec: any; mock?: boolean; runsDir?: string }, deps?: any): Promise<{ judge: string; clusters: number; verdicts: number; missing: number }>;
}

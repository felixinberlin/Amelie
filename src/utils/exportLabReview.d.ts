declare module '*lab-review-lib.mjs' {
  export const PROPOSALS: string;
  export function parseNameStatus(text: string): { status: string; path: string }[];
  export function checkScope(files: { status: string; path: string }[]): string[];
  export function checkPr(pr: { number: number; state: string; headRefName: string }): string[];
  export function parseRecommendation(text: string): 'merge' | 'nicht mergen' | null;
  export function decide(o: { blockers: string[]; merged: boolean }): 'gemergt' | 'abgelehnt' | null;
  export function assess(o: { results: { name: string; ok: boolean; note?: string; tool?: boolean }[]; recommendation?: string | null; noAgent?: boolean }): { blockers: string[]; incomplete: string[]; mergeReady: boolean };
  export function buildComment(o: { decision: string; existenzCheck: boolean; sources?: string[]; findings?: string[]; agentText?: string }): string;
}

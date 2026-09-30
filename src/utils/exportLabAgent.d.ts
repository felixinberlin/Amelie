declare module '*lab-librarian-agent.mjs' {
  export function createLibrarianHandlers(o: { root: string; proposalsDir: string; allowed?: Set<string> | null }): Record<string, (a?: any) => Promise<string>>;
  export function pickModel(cfg: any, id?: string): { id: string; provider: string };
  export const isTransient: (e: unknown) => boolean;
  export function withRetry(adapter: any, o?: any): any;
  export function librarianTools(o?: { delegate?: boolean }): { name: string }[];
  export function planGroups(files: any[], manifests: any[]): { manifest: any; files: any[] }[];
  export function reviewPlans(opts: any, deps?: any): Promise<any>;
  export function runLabLibrarian(opts: any, deps?: any): Promise<any>;
}

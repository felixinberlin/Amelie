declare module '*lab-librarian-agent.mjs' {
  export function createLibrarianHandlers(o: { root: string; proposalsDir: string }): Record<string, (a?: any) => Promise<string>>;
  export function pickModel(cfg: any, id?: string): { id: string; provider: string };
  export function runLabLibrarian(opts: any, deps?: any): Promise<any>;
}

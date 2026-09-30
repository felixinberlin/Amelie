declare module '*agent-kit.mjs' {
  export const DELEGABLE: string[];
  export const KIT_TOOLS: Record<string, { name: string }>;
  export function cliDenied(prog: string, args: unknown): string | null;
  export function safePath(root: string, rel: unknown): string | null;
  export function listSkills(root: string): { name: string; description: string }[];
  export function loadSkill(root: string, name: unknown, reference?: string): string;
  export function parseAgentDef(text: string): { name: string; description: string; tools: string[]; body: string } | null;
  export function listAgents(root: string): { name: string; description: string; tools: string[] }[];
  export function toolsForAgent(def: { tools: string[] }): string[];
  export function createKit(o: any): { handlers: Record<string, (a?: any) => Promise<string>>; ledger: { agentCalls: any[] } };
}

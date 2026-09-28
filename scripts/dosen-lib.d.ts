declare module '*dosen-lib.mjs' {
  export const repoRoot: string;
  export const DATA_FILE: string;
  export const DOSEN_DIR: string;
  export function readDataIds(file?: string): { dosen: string[]; discarded: string[] };
  export function readDoseFiles(dir?: string): string[];
  export function duplicates(list: string[]): string[];
}

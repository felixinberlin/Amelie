declare module '*dosen-lib.mjs' {
  export const repoRoot: string;
  export const DATA_FILE: string;
  export const DOSEN_DIR: string;
  export const GRAEBER_FILE: string;
  export function loadGraeber(file?: string): any[];
  export function readDataIds(file?: string, graeberFile?: string): { dosen: string[]; discarded: string[] };
  export function readDoseFiles(dir?: string): string[];
  export function duplicates(list: string[]): string[];
}

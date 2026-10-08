// @ts-ignore
import { readFileSync, readdirSync, existsSync } from 'node:fs';
// @ts-ignore
import { join, dirname } from 'node:path';
// @ts-ignore
import { fileURLToPath } from 'node:url';

// @ts-ignore
export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DATA_FILE = join(repoRoot, 'src/data/dosen.ts');
export const DOSEN_DIR = join(repoRoot, '05-dosen');

const ID_LINE = /^ {4}id: '([^']+)'/gm;

/** Gibt die ids aus DOSEN_DATA und DISCARDED_DATA getrennt zurück. */
export function readDataIds(file = DATA_FILE) {
  const src = readFileSync(file, 'utf8');
  const dosenStart = src.indexOf('export const DOSEN_DATA');
  const discardedStart = src.indexOf('export const DISCARDED_DATA');
  if (dosenStart === -1 || discardedStart === -1) {
    throw new Error(`Konnte DOSEN_DATA/DISCARDED_DATA in ${file} nicht finden.`);
  }
  const collect = (text: string) => [...text.matchAll(ID_LINE)].map((m) => m[1]);
  // Gräber liegen seit der Bibliotheks-CLI in graeber.json neben dosen.ts.
  const graeberFile = join(dirname(file), 'graeber.json');
  return {
    dosen: collect(src.slice(dosenStart, discardedStart)),
    discarded: existsSync(graeberFile)
      ? (JSON.parse(readFileSync(graeberFile, 'utf8')) as { id: string }[]).map((g) => g.id)
      : collect(src.slice(discardedStart)),
  };
}

/** Dateinamen (ohne .md) in 05-dosen/, ohne _-Dateien. */
export function readDoseFiles(dir = DOSEN_DIR) {
  return readdirSync(dir)
    .filter((f: string) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f: string) => f.replace(/\.md$/, ''))
    .sort();
}

export function duplicates(list: string[]) {
  const seen = new Set();
  const dupes = new Set();
  for (const item of list) (seen.has(item) ? dupes : seen).add(item);
  return [...dupes];
}

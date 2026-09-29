// Gemeinsame Hilfsfunktionen für die Dosen-Skripte.
//
// src/data/dosen.ts ist TypeScript und wird hier ohne Compiler gelesen. Das ist
// bewusst: Ein Guard, der eine Toolchain braucht, läuft irgendwann nicht mehr.
// Gelesen wird nur, was stabil ist — die id-Zeilen innerhalb der beiden Arrays.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DATA_FILE = join(repoRoot, 'src/data/dosen.ts');
export const DOSEN_DIR = join(repoRoot, '05-dosen');
export const GRAEBER_FILE = join(repoRoot, 'src/data/graeber.json');

/** Gräber (Totenscheine) liegen als JSON; geschrieben wird nur über `npm run bib -- grab add`. */
export const loadGraeber = (file = GRAEBER_FILE) => JSON.parse(readFileSync(file, 'utf8'));

const ID_LINE = /^ {4}id: '([^']+)'/gm;

/** Gibt die ids aus DOSEN_DATA und den Gräbern (graeber.json) getrennt zurück. */
export function readDataIds(file = DATA_FILE, graeberFile = GRAEBER_FILE) {
  const src = readFileSync(file, 'utf8');
  const dosenStart = src.indexOf('export const DOSEN_DATA');
  const discardedStart = src.indexOf('export const DISCARDED_DATA');
  if (dosenStart === -1 || discardedStart === -1) {
    throw new Error(`Konnte DOSEN_DATA/DISCARDED_DATA in ${file} nicht finden.`);
  }
  const collect = (text) => [...text.matchAll(ID_LINE)].map((m) => m[1]);
  return {
    dosen: collect(src.slice(dosenStart, discardedStart)),
    discarded: existsSync(graeberFile) ? loadGraeber(graeberFile).map((g) => g.id) : collect(src.slice(discardedStart)),
  };
}

/** Dateinamen (ohne .md) in 05-dosen/, ohne _-Dateien (_entsorgt.md ist nur noch ein Wegweiser auf 08-friedhof/). */
export function readDoseFiles(dir = DOSEN_DIR) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();
}

export function duplicates(list) {
  const seen = new Set();
  const dupes = new Set();
  for (const item of list) (seen.has(item) ? dupes : seen).add(item);
  return [...dupes];
}

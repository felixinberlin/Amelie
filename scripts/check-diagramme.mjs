#!/usr/bin/env node
// Prüft alle ```mermaid-Blöcke in den Markdown-Dateien des Repos auf gültige Syntax
// (mermaid.parse in Node mit jsdom, ohne Browser). Exit 1 bei Fehlern — Teil von npm run lint.
//
//   node scripts/check-diagramme.mjs [datei.md …]   (ohne Argumente: alle .md im Repo)

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = new URL('..', import.meta.url).pathname;
const SKIP = new Set(['node_modules', '.git', '.claude', 'dist', 'build', 'coverage']);

function findMarkdown(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) findMarkdown(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// Liefert { code, line } je Block; line = Zeile des öffnenden ```mermaid.
export function extractMermaid(text) {
  const blocks = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*```mermaid\s*$/.test(lines[i])) continue;
    const start = i + 1;
    let j = start;
    while (j < lines.length && !/^\s*```\s*$/.test(lines[j])) j++;
    blocks.push({ code: lines.slice(start, j).join('\n'), line: i + 1 });
    i = j;
  }
  return blocks;
}

async function main() {
  const args = process.argv.slice(2);
  const files = args.length ? args : findMarkdown(ROOT);
  const found = files.map((f) => ({ f, blocks: extractMermaid(readFileSync(f, 'utf8')) })).filter((x) => x.blocks.length);
  if (!found.length) {
    console.log('Diagramme ok: keine Mermaid-Blöcke gefunden.');
    return;
  }

  const dom = new JSDOM('<!doctype html><body></body>');
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  const mermaid = (await import('mermaid')).default;

  let total = 0;
  const errors = [];
  for (const { f, blocks } of found) {
    for (const b of blocks) {
      total++;
      try {
        await mermaid.parse(b.code);
      } catch (e) {
        const msg = String(e?.message ?? e).split('\n').slice(0, 4).join(' | ');
        errors.push(`${relative(ROOT, f)}:${b.line}: ${msg}`);
      }
    }
  }
  if (errors.length) {
    console.error(`Diagramme: ${errors.length} von ${total} Mermaid-Blöcken ungültig:`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }
  console.log(`Diagramme ok: ${total} Mermaid-Blöcke in ${found.length} Dateien.`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();

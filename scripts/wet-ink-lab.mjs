#!/usr/bin/env node
// Bundles scripts/wet-ink-lab/lab.ts with esbuild (ships with Vite) and runs it,
// so the lab can import the TypeScript engine without a TS runtime.
import { build } from 'esbuild';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outfile = resolve(root, 'node_modules/.cache/wet-ink-lab/lab.mjs');
await build({
  entryPoints: [resolve(root, 'scripts/wet-ink-lab/lab.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile,
  logLevel: 'warning',
});
await import(pathToFileURL(outfile).href);

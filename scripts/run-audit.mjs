#!/usr/bin/env node
import { build } from 'esbuild';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { repoRoot } from './dosen-lib.mjs';

const dir = mkdtempSync(join(tmpdir(), 'amelie-audit-cli-'));
const entry = join(dir, 'entry.ts');
const out = join(dir, 'bundle.mjs');

writeFileSync(
  entry,
  `export { runAudit, writeAuditArtifacts } from ${JSON.stringify(join(repoRoot, 'src/audit/index.ts'))};`
);

let mod;
try {
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    logLevel: 'error',
  });
  mod = await import(pathToFileURL(out).href);
} finally {
  rmSync(dir, { recursive: true, force: true });
}

const { runAudit, writeAuditArtifacts } = mod;

const args = process.argv.slice(2);
const isJsonOnly = args.includes('--json');
const isMarkdownOnly = args.includes('--markdown');
const isCheck = args.includes('--check');

const { health, jsonOutput, markdownOutput } = runAudit({ root: repoRoot });

if (isJsonOnly) {
  process.stdout.write(jsonOutput);
} else if (isMarkdownOnly) {
  process.stdout.write(markdownOutput);
} else {
  writeAuditArtifacts();
  console.log(`Amélie Self-Audit completed.`);
  console.log(`  Dosen: ${health.inventory.doses}`);
  console.log(`  Gräber: ${health.inventory.graves}`);
  console.log(`  Demos: ${health.inventory.demos}`);
  console.log(`  Books: ${health.inventory.books}`);
  console.log(`  Findings: ${health.findings.length}`);
  console.log(`Wrote public/data/amelie-health.json & AMELIE_STATUS.md`);
}

if (isCheck) {
  const errors = health.findings.filter((f) => f.severity === 'error');
  if (errors.length > 0) {
    console.error(`\nAudit failed with ${errors.length} error-level finding(s):`);
    for (const e of errors) {
      console.error(`  - [${e.id}] ${e.message}`);
    }
    process.exit(1);
  }
}

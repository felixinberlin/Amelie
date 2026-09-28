#!/usr/bin/env node
// Schreibt die statischen Schnappschüsse unter public/data/ neu:
//   amelie-ideas.json  (Gesamtexport, Format von exportDatabaseAsJson)
//   dosen.json         (DOSEN_DATA)
//   unpacked.json      (CANDIDATE_IDEAS_DATA)
//
// Hintergrund: Die Dateien wurden bisher von Hand über den Export-Knopf der
// App erzeugt und eingecheckt. Am 24.09.2026 standen sie auf dem Stand vom
// 18.09. (23 statt 36 Dosen, alle Katalogideen `frei`). Wer Daten ändert, lässt
// dieses Skript laufen: npm run export:data
//
// Die TS-Quellen werden mit esbuild (liegt über Vite ohnehin im Baum) zu
// einem temporären ESM-Bündel gepackt und geladen.

import { build } from 'esbuild';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { repoRoot } from './dosen-lib.mjs';

const dir = mkdtempSync(join(tmpdir(), 'amelie-export-'));
const entry = join(dir, 'entry.ts');
const out = join(dir, 'bundle.mjs');
writeFileSync(
  entry,
  `export { DOSEN_DATA, DISCARDED_DATA } from ${JSON.stringify(join(repoRoot, 'src/data/dosen.ts'))};
export { CANDIDATE_IDEAS_DATA } from ${JSON.stringify(join(repoRoot, 'src/data/unpacked.ts'))};
export { exportDatabaseAsJson } from ${JSON.stringify(join(repoRoot, 'src/services/storageService.ts'))};
export { FUNDING_DATA } from ${JSON.stringify(join(repoRoot, 'src/data/funding.ts'))};
`
);

try {
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
  const { DOSEN_DATA, CANDIDATE_IDEAS_DATA, exportDatabaseAsJson, FUNDING_DATA } = await import(pathToFileURL(out).href);
  const pub = join(repoRoot, 'public/data');
  writeFileSync(join(pub, 'amelie-ideas.json'), exportDatabaseAsJson(DOSEN_DATA, CANDIDATE_IDEAS_DATA) + '\n');
  writeFileSync(join(pub, 'dosen.json'), JSON.stringify(DOSEN_DATA, null, 2) + '\n');
  writeFileSync(join(pub, 'unpacked.json'), JSON.stringify(CANDIDATE_IDEAS_DATA, null, 2) + '\n');
  writeFileSync(join(pub, 'funding.json'), JSON.stringify(FUNDING_DATA, null, 2) + '\n');
  console.log(`public/data geschrieben: ${DOSEN_DATA.length} Dosen, ${CANDIDATE_IDEAS_DATA.length} Kandidaten, ${FUNDING_DATA.length} Fördereinträge.`);

  // Self-Audit artifacts update
  const auditEntry = join(dir, 'audit-entry.ts');
  const auditOut = join(dir, 'audit-bundle.mjs');
  writeFileSync(auditEntry, `export { writeAuditArtifacts } from ${JSON.stringify(join(repoRoot, 'src/audit/index.ts'))};`);
  await build({ entryPoints: [auditEntry], bundle: true, format: 'esm', platform: 'node', outfile: auditOut, logLevel: 'error' });
  const { writeAuditArtifacts } = await import(pathToFileURL(auditOut).href);
  writeAuditArtifacts({ root: repoRoot });
  console.log('public/data/amelie-health.json & AMELIE_STATUS.md aktualisiert.');
} finally {
  rmSync(dir, { recursive: true, force: true });
}

#!/usr/bin/env node
// Startet `node --test` ohne Test-Isolation, unabhängig von der Node-Version.
//
// Warum: package.json rief `node --test --test-isolation=none` auf. Den Schalter
// gibt es so erst ab Node 23; Node 22 (Cloud-Container) kennt ihn nur als
// `--experimental-test-isolation` und brach mit „bad option“ ab. Dadurch war
// `npm test` in jeder Cloud-Sitzung rot, obwohl die Tests selbst grün sind.
//
// Aufruf: node scripts/run-node-test.mjs <testdatei> …

import { spawnSync } from 'node:child_process';

const dateien = process.argv.slice(2);
if (!dateien.length) {
  console.error('Aufruf: node scripts/run-node-test.mjs <testdatei> …');
  process.exit(2);
}
const major = Number(process.versions.node.split('.')[0]);
const schalter = major >= 23 ? '--test-isolation=none' : '--experimental-test-isolation=none';
const r = spawnSync(process.execPath, ['--test', schalter, ...dateien], { stdio: 'inherit' });
process.exit(r.status ?? 1);

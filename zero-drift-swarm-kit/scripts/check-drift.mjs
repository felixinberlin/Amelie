#!/usr/bin/env node
/**
 * Zero-Drift Swarm Kit: Drift Guard Linter
 * 
 * Verifies that specifications in `specs/*.md` and entities in `src/data/registry.ts`
 * remain 100% in parity.
 * 
 * Exit 0 = Clean parity.
 * Exit 1 = Spec or code drift detected.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const specsDir = path.join(rootDir, 'specs');
const registryFile = path.join(rootDir, 'src', 'data', 'registry.ts');

if (!fs.existsSync(specsDir)) {
  fs.mkdirSync(specsDir, { recursive: true });
}

// 1. Read spec files (IDs derived from filenames: specs/<id>.md)
const specFiles = fs.readdirSync(specsDir)
  .filter(f => f.endsWith('.md'))
  .map(f => path.basename(f, '.md'));

// 2. Read registered IDs from code registry
if (!fs.existsSync(registryFile)) {
  console.error(`[DRIFT-GUARD ERROR] Missing registry file at ${registryFile}`);
  process.exit(1);
}

const registryContent = fs.readFileSync(registryFile, 'utf-8');
const idMatches = [...registryContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

// 3. Detect drift
const missingInCode = specFiles.filter(id => !idMatches.includes(id));
const missingInSpecs = idMatches.filter(id => !specFiles.includes(id));

const errors = [];

if (missingInCode.length > 0) {
  errors.push(
    `Specification exists in specs/ but missing in src/data/registry.ts (${missingInCode.length}):\n` +
    missingInCode.map(id => `  - specs/${id}.md`).join('\n') +
    `\n  -> Action required: Register the entity in src/data/registry.ts.`
  );
}

if (missingInSpecs.length > 0) {
  errors.push(
    `Entity exists in src/data/registry.ts but missing specification file (${missingInSpecs.length}):\n` +
    missingInSpecs.map(id => `  - id: "${id}"`).join('\n') +
    `\n  -> Action required: Create specs/<id>.md defining the specification.`
  );
}

if (errors.length > 0) {
  console.error('\n🚨 [DRIFT-GUARD ALERT] Repository specification drift detected:\n');
  for (const err of errors) {
    console.error(err + '\n');
  }
  process.exit(1);
}

console.log(`✅ [DRIFT-GUARD] Parity confirmed: ${specFiles.length} specifications match ${idMatches.length} registered code entities.`);
process.exit(0);

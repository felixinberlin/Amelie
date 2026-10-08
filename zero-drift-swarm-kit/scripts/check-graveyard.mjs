#!/usr/bin/env node
/**
 * Zero-Drift Swarm Kit: Graveyard Schema Validator
 * 
 * Verifies that all autopsy certificates in `memory/graveyard/graveyard.json`
 * meet the mandatory 8-field postmortem schema.
 * 
 * Exit 0 = Valid graveyard schema.
 * Exit 1 = Invalid or incomplete autopsy.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const graveyardFile = path.join(rootDir, 'memory', 'graveyard', 'graveyard.json');

if (!fs.existsSync(graveyardFile)) {
  console.error(`[GRAVEYARD ERROR] Missing ${graveyardFile}`);
  process.exit(1);
}

const raw = fs.readFileSync(graveyardFile, 'utf-8');
let entries = [];
try {
  entries = JSON.parse(raw);
} catch (e) {
  console.error(`[GRAVEYARD ERROR] Invalid JSON in ${graveyardFile}:`, e);
  process.exit(1);
}

const requiredFields = ['id', 'name', 'date', 'cause', 'killer', 'foundBy', 'stage', 'resurrectIf'];
const allowedCauses = ['built-elsewhere', 'reality-check', 'premise-flaw', 'complexity', 'duplicate'];

const errors = [];

entries.forEach((entry, idx) => {
  for (const field of requiredFields) {
    if (!entry[field] || typeof entry[field] !== 'string' || entry[field].trim() === '') {
      errors.push(`Entry #${idx} (${entry.id || 'unknown'}): Missing or empty required field '${field}'`);
    }
  }
  if (entry.cause && !allowedCauses.includes(entry.cause)) {
    errors.push(`Entry #${idx} (${entry.id}): Invalid cause '${entry.cause}'. Must be one of: ${allowedCauses.join(', ')}`);
  }
});

if (errors.length > 0) {
  console.error('\n🚨 [GRAVEYARD VALIDATION FAILED] Incomplete autopsy certificates:\n');
  for (const err of errors) console.error('  - ' + err);
  process.exit(1);
}

console.log(`✅ [GRAVEYARD GUARD] All ${entries.length} autopsy certificates are valid.`);
process.exit(0);

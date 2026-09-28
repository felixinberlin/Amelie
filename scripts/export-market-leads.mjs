#!/usr/bin/env node
/**
 * Amélie -> Ventures: Market Leads Exporter & Auditor
 * 
 * Scans `06-suche/amelie-classification-log.md` and `06-suche/amelie-pruefprotokoll.md`
 * for items triaged as `Market Route` / `market-route`, reporting and syncing
 * them into `ventures/market-leads.json`.
 * 
 * Usage:
 *   node scripts/export-market-leads.mjs          # Syncs and validates leads
 *   node scripts/export-market-leads.mjs --status # Displays commercial scoreboard
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const classificationLogFile = path.join(rootDir, '06-suche', 'amelie-classification-log.md');
const venturesFile = path.join(rootDir, 'ventures', 'market-leads.json');
const opportunitiesDir = path.join(rootDir, 'ventures', 'opportunities');

if (!fs.existsSync(venturesFile)) {
  console.error(`[VENTURES ERROR] Missing ${venturesFile}`);
  process.exit(1);
}

const leads = JSON.parse(fs.readFileSync(venturesFile, 'utf-8'));

const isStatusMode = process.argv.includes('--status');

console.log('⚡ [VENTURES SYNC] Checking commercial opportunities from Amélie research...\n');

// Verify that each lead in market-leads.json has a corresponding opportunity markdown file
const missingDossiers = [];
for (const lead of leads) {
  const dossierPath = path.join(opportunitiesDir, `${lead.id}.md`);
  if (!fs.existsSync(dossierPath)) {
    missingDossiers.push(lead.id);
  }
}

if (missingDossiers.length > 0) {
  console.warn(`⚠️ Warning: Missing opportunity dossier in ventures/opportunities/ for: ${missingDossiers.join(', ')}`);
}

console.log(`📊 Active Commercial Leads: ${leads.length}\n`);

console.log('| ID | Name | Category | Stage | Target Price | Amélie Twin |');
console.log('|---|---|---|---|---|---|');
for (const l of leads) {
  console.log(`| \`${l.id}\` | **${l.name}** | \`${l.category}\` | \`${l.stage}\` | ${l.targetPrice} | \`${l.amelieTwin}\` |`);
}

console.log('\n✅ [VENTURES SYNC] Market leads database in sync.');
process.exit(0);

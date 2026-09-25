#!/usr/bin/env node
// Schreibt für jede Dose in 05-dosen/*.md einen YAML-Frontmatter-Block nach
// dem IdeaFrontmatter-Schema (src/types.ts), abgeleitet aus dem tatsächlichen
// DoseItem.status in src/data/dosen.ts.
//
// Richtung, wie bei dose-md-from-data.mjs: src/data/dosen.ts → 05-dosen/*.md.
// Der Frontmatter-Block ist eine Projektion, keine zweite Wahrheit — wer den
// Status ändern will, ändert ihn in dosen.ts und lässt dieses Skript erneut
// laufen. IdeaStatus (Available/Delivered/In Progress/Launched) ist dabei nur
// die englische Übersetzung von DoseStatus für die Frontmatter-Verbraucher
// (src/utils/ideaFrontmatter.ts hält dieselbe Tabelle in TypeScript; hier
// dieselbe Zuordnung als Objektliteral, aus demselben Grund wie in
// dosen-lib.mjs: ein Skript, das eine Toolchain zum Lesen von TS braucht,
// läuft irgendwann nicht mehr).
//
// Aufruf: node scripts/sync-idea-frontmatter.mjs [--check]
//   --check   nur prüfen, nichts schreiben; Exit 1 bei Abweichung (für CI/lint)

import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import { DATA_FILE, DOSEN_DIR, readDoseFiles, repoRoot } from './dosen-lib.mjs';

const REVIEW_FILE = join(repoRoot, 'scripts/dosen-review-metadata.json');
const REVIEW_METADATA = existsSync(REVIEW_FILE)
  ? JSON.parse(readFileSync(REVIEW_FILE, 'utf8'))
  : {};

const DOSE_STATUS_TO_IDEA_STATUS = {
  gefunden: 'Available',
  gepackt: 'Available',
  zugestellt: 'Delivered',
  antwort: 'In Progress',
  gebaut: 'Launched',
  entsorgt: 'Available',
};

const DELIVERY_METHOD = 'E-Mail';

const GERMAN_MONTHS = {
  januar: '01', februar: '02', märz: '03', april: '04', mai: '05', juni: '06',
  juli: '07', august: '08', september: '09', oktober: '10', november: '11', dezember: '12',
};

/** "19. September 2026" → "2026-09-19T00:00:00Z"; unparsable input → null. */
function parseGermanDoseDateToIso(date) {
  const match = /^(\d{1,2})\.\s*([A-Za-zäöüÄÖÜ]+)\s+(\d{4})$/.exec((date ?? '').trim());
  if (!match) return null;
  const [, day, monthName, year] = match;
  const month = GERMAN_MONTHS[monthName.toLowerCase()];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, '0')}T00:00:00Z`;
}

/** Kürzt einen Empfänger-String auf den Namen der ersten Organisation. */
function shortTargetMaker(recipientsDe) {
  return (recipientsDe ?? '')
    .split(' · ')[0]
    .split(' (')[0]
    .trim();
}

/** Lädt DOSEN_DATA, indem die TS-Typannotationen entfernt und als ESM geladen wird. */
async function loadData() {
  const src = readFileSync(DATA_FILE, 'utf8')
    .replace(/^import[^;]+;\s*$/gm, '')
    .replace(/:\s*(DoseItem|DiscardedItem)\[\]/g, '');
  const dir = mkdtempSync(join(tmpdir(), 'amelie-idea-frontmatter-'));
  const file = join(dir, 'dosen.data.mjs');
  writeFileSync(file, src, 'utf8');
  try {
    return await import(pathToFileURL(file).href);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function buildFrontmatter(dose) {
  const status = DOSE_STATUS_TO_IDEA_STATUS[dose.status];
  if (!status) {
    throw new Error(`Unbekannter DoseStatus '${dose.status}' für '${dose.id}' — DOSE_STATUS_TO_IDEA_STATUS ergänzen.`);
  }
  const data = { status };
  if (status !== 'Available') {
    const iso = parseGermanDoseDateToIso(dose.date);
    if (iso) data.date_delivered = iso;
  }
  data.delivery_method = DELIVERY_METHOD;
  const targetMaker = shortTargetMaker(dose.recipientsDe);
  if (targetMaker) data.target_maker = targetMaker;
  const review = REVIEW_METADATA[dose.id];
  if (review) {
    data.review_score = review.review_score;
    data.architecture_tier = review.architecture_tier;
    data.source_type = review.source_type;
  }
  return data;
}

function withFrontmatter(fileContent, data) {
  const { content } = matter(fileContent);
  return matter.stringify(content.replace(/^\n+/, ''), data);
}

const { DOSEN_DATA } = await loadData();
const checkOnly = process.argv.includes('--check');
const files = readDoseFiles(); // ids, ohne _entsorgt

let changed = 0;
let problems = 0;

for (const id of files) {
  const dose = DOSEN_DATA.find((d) => d.id === id);
  if (!dose) {
    console.error(`Keine DOSEN_DATA-Eintrag für '${id}' — check:dosen sollte das bereits melden.`);
    problems++;
    continue;
  }

  const path = join(DOSEN_DIR, `${id}.md`);
  const before = readFileSync(path, 'utf8');
  const frontmatter = buildFrontmatter(dose);
  const after = withFrontmatter(before, frontmatter);

  if (before === after) continue;

  if (checkOnly) {
    console.error(`Frontmatter veraltet: 05-dosen/${id}.md`);
    problems++;
  } else {
    writeFileSync(path, after, 'utf8');
    console.log(`aktualisiert: 05-dosen/${id}.md (status: ${frontmatter.status})`);
    changed++;
  }
}

if (checkOnly) {
  if (problems > 0) {
    console.error(`\n${problems} Dose(n) mit veralteter Frontmatter. node scripts/sync-idea-frontmatter.mjs ausführen.`);
    process.exit(1);
  }
  console.log(`Frontmatter-Abgleich in Ordnung: ${files.length} Dosen geprüft.`);
} else {
  console.log(`Fertig: ${changed} Datei(en) aktualisiert, ${files.length} geprüft.`);
  if (problems > 0) process.exitCode = 1;
}

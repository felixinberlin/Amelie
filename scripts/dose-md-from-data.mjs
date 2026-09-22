#!/usr/bin/env node
// Erzeugt eine Dose-Markdown-Seite aus einem Frontend-Eintrag.
//
// Richtung: src/data/dosen.ts → 05-dosen/<id>.md. Gedacht für Ideen, die im
// Frontend entstanden sind und deshalb keine Markdown-Seite haben. Der
// umgekehrte Weg bleibt Handarbeit: Eine Dose ist ein Text, den ein Mensch
// verschickt, kein Datensatz.
//
// Aufruf:  node scripts/dose-md-from-data.mjs <id> [<id> ...]
//          node scripts/dose-md-from-data.mjs --missing   (alle fehlenden)

import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { DATA_FILE, DOSEN_DIR, readDoseFiles } from './dosen-lib.mjs';

/** Lädt die Datenarrays, indem die Typannotationen entfernt und als ESM geladen wird. */
async function loadData() {
  const src = readFileSync(DATA_FILE, 'utf8')
    .replace(/^import[^;]+;\s*$/gm, '')
    .replace(/:\s*(DoseItem|DiscardedItem)\[\]/g, '');
  const dir = mkdtempSync(join(tmpdir(), 'amelie-dosen-'));
  const file = join(dir, 'dosen.data.mjs');
  writeFileSync(file, src, 'utf8');
  try {
    return await import(pathToFileURL(file).href);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const VERDIKT = {
  gift: '🎁 verschenken',
  build_first: '🔨 erst Skelett, dann verschenken',
  keep: '🔒 behalten',
  discarded: '🗑 entsorgt',
};

function absatz(text) {
  return (text ?? '').trim();
}

function liste(items) {
  return (items ?? []).map((i) => `- ${i.trim()}`).join('\n');
}

function render(d) {
  const titel = d.titleEn && d.titleEn !== d.title ? `${d.title}\n\n*(englisch: ${d.titleEn})*` : d.title;
  return `# ${titel}

**Ein Satz:** ${absatz(d.oneLinerDe)}

**Stand:** ${d.date} · **Prüfen ab:** ${d.reviewAfter}
**Empfänger:** ${absatz(d.recipientsDe)}
**Verdikt:** ${VERDIKT[d.verdict] ?? d.verdict}

---

## Das Problem

${absatz(d.problemDe)}

## Warum das jetzt geht

${liste(d.whyNowDe)}

## Skizze

${absatz(d.sketchDe)}

## Erster Schritt

**Ticket:** ${absatz(d.firstStepDe?.ticket)}

${absatz(d.firstStepDe?.criteria)}

## Wo es kippt

${absatz(d.failureModeDe)}

## Wer es schon versucht hat

${absatz(d.priorArtDe)}

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: \`node scripts/dose-md-from-data.mjs ${d.id}\`.
Inhaltliche Quelle ist \`src/data/dosen.ts\`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet \`scripts/check-dosen-drift.mjs\` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
`;
}

const { DOSEN_DATA } = await loadData();
const vorhanden = new Set(readDoseFiles());

let ids = process.argv.slice(2);
if (ids.length === 1 && ids[0] === '--missing') {
  ids = DOSEN_DATA.map((d) => d.id).filter((id) => !vorhanden.has(id));
}
if (!ids.length) {
  console.error('Aufruf: node scripts/dose-md-from-data.mjs <id> [<id> ...] | --missing');
  process.exit(2);
}

for (const id of ids) {
  const dose = DOSEN_DATA.find((d) => d.id === id);
  if (!dose) {
    console.error(`Kein Frontend-Eintrag mit id '${id}'.`);
    process.exitCode = 1;
    continue;
  }
  const ziel = join(DOSEN_DIR, `${id}.md`);
  writeFileSync(ziel, render(dose), 'utf8');
  console.log(`geschrieben: 05-dosen/${id}.md`);
}

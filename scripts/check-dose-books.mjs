#!/usr/bin/env node
// Prüft, ob jedes in src/data/doseBooks.ts eingetragene Kapitel wirklich im
// Repo liegt und zu einer bekannten Dose gehört.
//
// Hintergrund: Die Dosenseite verlinkt und rendert Recherchedateien aus
// 02-recherche/ und Nachbarordnern. Benennt jemand eine Datei um, zeigt das
// Buch ins Leere — und zwar still, weil ein fehlendes Kapitel nur beim Leser
// auffällt. Bei einem Projekt, dessen Wert Nachprüfbarkeit ist, ist das der
// teuerste kleine Fehler. Deshalb bricht hier der Lint.
//
// Exit 0 = alle Kapitel vorhanden, Exit 1 = mindestens eins fehlt.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDataIds } from './dosen-lib.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const quelle = readFileSync(resolve(root, 'src/data/doseBooks.ts'), 'utf8');

// Der Block je Dose: "  <id>: [ ... ]," — ids sind entweder nackt oder gequotet
const bloecke = [...quelle.matchAll(/^ {2}'?([a-z0-9-]+)'?:\s*\[([\s\S]*?)^ {2}\],/gm)];

const { dosen } = readDataIds();
const probleme = [];
const slugsGesehen = new Set();
let kapitelGesamt = 0;

for (const [, doseId, block] of bloecke) {
  if (!dosen.includes(doseId)) {
    probleme.push(`Buch für unbekannte Dose "${doseId}" — keine id in DOSEN_DATA.`);
  }

  const pfade = [...block.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
  const slugs = [...block.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

  if (pfade.length !== slugs.length) {
    probleme.push(`Dose "${doseId}": ${slugs.length} slugs, aber ${pfade.length} Pfade — ein Kapitel ist unvollständig.`);
  }

  for (const slug of slugs) {
    const key = `${doseId}#${slug}`;
    if (slugsGesehen.has(key)) {
      probleme.push(`Dose "${doseId}": slug "${slug}" doppelt — die Kapitel-URL wäre mehrdeutig.`);
    }
    slugsGesehen.add(key);
  }

  for (const pfad of pfade) {
    kapitelGesamt++;
    if (!existsSync(resolve(root, pfad))) {
      probleme.push(`Dose "${doseId}": Kapitel-Datei fehlt — ${pfad}`);
    }
  }
}

if (bloecke.length === 0) {
  probleme.push('Keine Bücher gefunden — hat sich die Struktur von doseBooks.ts geändert? Dann gehört dieses Skript nachgezogen.');
}

if (probleme.length) {
  console.error('\nProbleme im Buch zur Dose:\n');
  for (const p of probleme) console.error('  ' + p);
  console.error('');
  process.exit(1);
}

console.log(
  `Bücher in Ordnung: ${bloecke.length} Dosen mit zusammen ${kapitelGesamt} Kapiteln, alle Dateien vorhanden.`
);

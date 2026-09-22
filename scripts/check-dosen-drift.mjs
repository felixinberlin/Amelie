#!/usr/bin/env node
// Prüft, ob 05-dosen/*.md und src/data/dosen.ts dieselben Ideen kennen.
//
// Hintergrund: Das Frontend liest die Markdown-Dosen nicht, es hat mit
// DOSEN_DATA eine eigene Liste. Wer nur eine der beiden Seiten pflegt, baut
// eine Idee, die auf der Seite unsichtbar bleibt — genau das ist bei der
// Glasanflug-Ampel passiert. Dieser Guard macht das laut statt still.
//
// Exit 0 = deckungsgleich, Exit 1 = Drift.

import { readDataIds, readDoseFiles, duplicates } from './dosen-lib.mjs';

const { dosen, discarded } = readDataIds();
const dateien = readDoseFiles();

const fehltImFrontend = dateien.filter((id) => !dosen.includes(id) && !discarded.includes(id));
const fehltAlsDatei = dosen.filter((id) => !dateien.includes(id));
const dopplungen = [...duplicates(dosen), ...duplicates(dateien)];
const inBeidenArrays = dosen.filter((id) => discarded.includes(id));

const probleme = [];
if (fehltImFrontend.length) {
  probleme.push(
    `Dose als Markdown vorhanden, aber ohne Frontend-Eintrag (${fehltImFrontend.length}):\n` +
      fehltImFrontend.map((id) => `    05-dosen/${id}.md`).join('\n') +
      '\n  → Eintrag in src/data/dosen.ts ergänzen, sonst ist die Idee auf der Seite unsichtbar.'
  );
}
if (fehltAlsDatei.length) {
  probleme.push(
    `Frontend-Eintrag ohne Dose-Datei (${fehltAlsDatei.length}):\n` +
      fehltAlsDatei.map((id) => `    ${id}`).join('\n') +
      '\n  → node scripts/dose-md-from-data.mjs <id> erzeugt die fehlende Seite.'
  );
}
if (dopplungen.length) {
  probleme.push(`Doppelte ids: ${dopplungen.join(', ')}`);
}
if (inBeidenArrays.length) {
  probleme.push(
    `id steht gleichzeitig in DOSEN_DATA und DISCARDED_DATA: ${inBeidenArrays.join(', ')}\n` +
      '  → Eine Idee ist entweder gepackt oder entsorgt, nicht beides.'
  );
}

if (probleme.length) {
  console.error('\nDosen-Drift gefunden:\n');
  for (const p of probleme) console.error('  ' + p + '\n');
  process.exit(1);
}

console.log(
  `Dosen-Abgleich in Ordnung: ${dateien.length} Markdown-Dosen, ${dosen.length} Frontend-Einträge, ` +
    `${discarded.length} entsorgte Ideen.`
);

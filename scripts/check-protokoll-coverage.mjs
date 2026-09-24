#!/usr/bin/env node
// Prüft, ob alles, was ein Urteil trägt, eine Zeile im Prüfprotokoll hat.
//
// Hintergrund: Der Protokollkopf sagt seit dem 18.09.2026 „Neue Dose ohne
// Zeile hier = Fehler, sofort nachtragen". Geprüft wurde das von Hand — und am
// 24.09.2026 standen acht Dosen ohne Zeile im Repo, dazu 131 Katalogeinträge
// mit `status: 'frei'`, von denen keiner je gesucht worden war. Dieser Guard
// macht die Regel mechanisch.
//
// Geprüft wird:
//   1. jede Dose in 05-dosen/*.md (ohne _entsorgt.md)
//   2. jeder Kandidat in src/data/unpacked.ts und src/data/ideas/*.ts,
//      dessen Status ein Urteil ist (frei · verengt · unklar · besetzt).
//      `ungeprüft` ist ausdrücklich kein Urteil und braucht keine Zeile.
//
// Als Fundstelle zählt die id oder der Kurztitel (Titel bis zum ersten „:",
// „ (" oder „ —"), wenn dieser Kurztitel eindeutig ist. Zwei Einträge mit
// demselben Kurztitel („DienstplanWächter") brauchen ihre id im Protokoll.
//
// Exit 0 = alles abgedeckt, Exit 1 = Lücken.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot, DOSEN_DIR, readDoseFiles } from './dosen-lib.mjs';

const PROTOKOLL = join(repoRoot, '06-suche/amelie-pruefprotokoll.md');
const URTEILE = new Set(['frei', 'verengt', 'unklar', 'besetzt']);

const protokoll = readFileSync(PROTOKOLL, 'utf8').toLowerCase();

export function kurztitel(title) {
  return title.split(/:| \(| —| – /)[0].trim();
}

function readCandidates(file) {
  const src = readFileSync(file, 'utf8');
  const out = [];
  // Einträge beginnen mit „  {" und einer id-Zeile mit vier Leerzeichen Einzug.
  const parts = src.split(/\n {4}id: '/).slice(1);
  for (const part of parts) {
    const id = part.slice(0, part.indexOf("'"));
    const title = (part.match(/\n {4}title: '((?:[^'\\]|\\.)*)'/) || [])[1] ?? id;
    const status = (part.match(/\n {4}status: '([^']*)'/) || [])[1];
    out.push({ id, title: title.replace(/\\'/g, "'"), status, file: file.replace(repoRoot + '/', '') });
  }
  return out;
}

const ideasDir = join(repoRoot, 'src/data/ideas');
const candidateFiles = [
  join(repoRoot, 'src/data/unpacked.ts'),
  ...readdirSync(ideasDir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .map((f) => join(ideasDir, f)),
];
const candidates = candidateFiles.flatMap(readCandidates);

const doses = readDoseFiles().map((id) => {
  const md = readFileSync(join(DOSEN_DIR, `${id}.md`), 'utf8');
  const h1 = (md.match(/^# (.+)$/m) || [])[1] ?? id;
  return { id, title: h1, file: `05-dosen/${id}.md` };
});

// Kurztitel, die mehrfach vorkommen, taugen nicht als Fundstelle.
const zaehler = new Map();
for (const x of [...candidates, ...doses]) {
  const k = kurztitel(x.title).toLowerCase();
  zaehler.set(k, (zaehler.get(k) ?? 0) + 1);
}
// Eine Dose und ihr Katalogeintrag teilen sich legitim einen Titel.
for (const d of doses) {
  const k = kurztitel(d.title).toLowerCase();
  const katalog = candidates.filter((c) => kurztitel(c.title).toLowerCase() === k);
  if (katalog.length === 1) zaehler.set(k, 1);
}

function gefunden(x) {
  if (protokoll.includes(x.id.toLowerCase())) return true;
  const k = kurztitel(x.title).toLowerCase();
  return k.length >= 5 && zaehler.get(k) === 1 && protokoll.includes(k);
}

const unbekannterStatus = candidates.filter((c) => c.status !== 'ungeprüft' && !URTEILE.has(c.status));
const doseLuecken = doses.filter((d) => !gefunden(d));
const kandidatLuecken = candidates.filter((c) => URTEILE.has(c.status) && !gefunden(c));

const probleme = [];
if (doseLuecken.length) {
  probleme.push(
    `Dose ohne Zeile im Prüfprotokoll (${doseLuecken.length}):\n` +
      doseLuecken.map((d) => `    ${d.file}  „${d.title}"`).join('\n') +
      '\n  → Existenzprüfung nachholen und Zeile in 06-suche/amelie-pruefprotokoll.md eintragen.'
  );
}
if (kandidatLuecken.length) {
  probleme.push(
    `Kandidat mit Urteil, aber ohne Zeile im Prüfprotokoll (${kandidatLuecken.length}):\n` +
      kandidatLuecken.map((c) => `    ${c.file}  ${c.id}  (${c.status})`).join('\n') +
      "\n  → Entweder prüfen und eintragen, oder ehrlich `status: 'ungeprüft'` setzen."
  );
}
if (unbekannterStatus.length) {
  probleme.push(
    `Unbekannter Status:\n` + unbekannterStatus.map((c) => `    ${c.file}  ${c.id}  (${c.status})`).join('\n')
  );
}

if (probleme.length) {
  console.error('\nPrüfprotokoll-Abdeckung unvollständig:\n');
  for (const p of probleme) console.error('  ' + p + '\n');
  process.exit(1);
}

const geurteilt = candidates.filter((c) => URTEILE.has(c.status)).length;
console.log(
  `Prüfprotokoll-Abdeckung in Ordnung: ${doses.length} Dosen, ${geurteilt} Kandidaten mit Urteil, ` +
    `${candidates.length - geurteilt} ungeprüft.`
);

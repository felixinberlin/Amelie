#!/usr/bin/env node
// Gründungsnavigator: baut Daten und Paket-Kern in die beiden Demo-Seiten ein.
//
// Quelle der Inhalte sind die JSON-Dateien in 07-demos/gruendungsnavigator/data/
// (Normregister, Telefonbaum und Fragen, Fall-Landkarte, Branchenpakete). Die
// Seiten bleiben einzelne Dateien, die ohne Server und offline laufen: Dieses
// Skript schreibt die Daten als <script id="gn-daten" type="application/json">
// und den getesteten Kern (src/engine/gruendungsnavigator/paket.ts, mit esbuild
// gebündelt) als <script id="gn-kern"> hinein. Im Browser läuft also derselbe
// Code wie in den Tests.
//
// Aufruf:
//   npm run build:gn            schreibt die Seiten neu
//   npm run build:gn -- --check prüft nur (Lint): Exit 1, wenn eine Seite veraltet ist

import { build } from 'esbuild';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = resolve(ROOT, '07-demos/gruendungsnavigator/data');
const PUB = resolve(ROOT, 'public/gruendungsnavigator');
const check = process.argv.includes('--check');

const json = (datei) => JSON.parse(readFileSync(resolve(DATA, datei), 'utf8'));
const ohneSchema = ({ $schema, ...rest }) => rest;

const normen = json('normen.json');
const navigator = json('navigator.json');
const landkarte = json('landkarte.json');

// Reihenfolge im Auswahlfeld: Webentwicklung (der ursprüngliche Beispielfall) zuerst,
// dann alphabetisch nach Titel, das leere Paket zuletzt.
const pakete = readdirSync(resolve(DATA, 'pakete'))
  .filter((d) => d.endsWith('.json'))
  .map((d) => ohneSchema(json(`pakete/${d}`)))
  .sort((a, b) => {
    const rang = (p) => (p.id === 'webentwicklung' ? 0 : p.id === 'leer' ? 2 : 1);
    return rang(a) - rang(b) || a.titel.localeCompare(b.titel, 'de');
  });

const geprueftIso = Object.values(normen).map((n) => n.geprueftAm).sort().at(-1);
const geprueft = geprueftIso.split('-').reverse().join('.');

const kern = (
  await build({
    entryPoints: [resolve(ROOT, 'src/engine/gruendungsnavigator/paket.ts')],
    bundle: true,
    format: 'iife',
    globalName: 'GNKern',
    platform: 'browser',
    target: 'es2019',
    legalComments: 'none',
    write: false,
  })
).outputFiles[0].text.trim();

const KOPF = '/* Erzeugt von scripts/build-gruendungsnavigator.mjs aus src/engine/gruendungsnavigator/paket.ts. Nicht von Hand ändern. */\n';
const alsJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

const seiten = {
  'index.html': { daten: { geprueft, normen, navigator, pakete } },
  'fall-landkarte.html': { daten: { geprueft, normen, landkarte, pakete } },
};

function einsetzen(html, id, inhalt, datei) {
  if (/<\/script/i.test(inhalt)) throw new Error(`${datei}: Inhalt für #${id} enthält </script`);
  const re = new RegExp(`(<script id="${id}"[^>]*>)[\\s\\S]*?(</script>)`);
  if (!re.test(html)) throw new Error(`${datei}: <script id="${id}"> fehlt`);
  return html.replace(re, (_, auf, zu) => auf + inhalt + zu);
}

let veraltet = 0;
for (const [datei, { daten }] of Object.entries(seiten)) {
  const pfad = resolve(PUB, datei);
  const alt = readFileSync(pfad, 'utf8');
  let neu = einsetzen(alt, 'gn-daten', alsJson(daten), datei);
  neu = einsetzen(neu, 'gn-kern', '\n' + KOPF + kern + '\n', datei);
  if (neu === alt) { console.log(`✓ ${datei} aktuell`); continue; }
  if (check) { console.error(`✗ ${datei} ist veraltet: npm run build:gn`); veraltet++; continue; }
  writeFileSync(pfad, neu);
  console.log(`→ ${datei} neu geschrieben (${(neu.length / 1024).toFixed(0)} KB)`);
}

// Das Schema liegt neben den Seiten, damit heruntergeladene Pakete im Editor geprüft werden können.
const schemaQuelle = readFileSync(resolve(DATA, 'paket.schema.json'), 'utf8');
const schemaZiel = resolve(PUB, 'paket.schema.json');
let schemaAlt = '';
try { schemaAlt = readFileSync(schemaZiel, 'utf8'); } catch { /* fehlt noch */ }
if (schemaAlt !== schemaQuelle) {
  if (check) { console.error('✗ paket.schema.json in public/ ist veraltet: npm run build:gn'); veraltet++; }
  else { writeFileSync(schemaZiel, schemaQuelle); console.log('→ paket.schema.json kopiert'); }
}

console.log(`${pakete.length} Pakete: ${pakete.map((p) => p.id).join(', ')} · Normen geprüft am ${geprueft}`);
process.exit(veraltet ? 1 : 0);

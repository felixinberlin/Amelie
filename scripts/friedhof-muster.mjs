#!/usr/bin/env node
// Schreibt die Musterauswertung und die Gräberliste in 08-friedhof/README.md
// (zwischen den Markern <!-- MUSTER:START --> … <!-- MUSTER:END -->).
//
// Quelle ist DISCARDED_DATA in src/data/dosen.ts, gerechnet mit derselben
// Funktion wie die App (src/utils/friedhof.ts) — README und Seite können sich
// deshalb nicht widersprechen.
//
// Aufruf: node scripts/friedhof-muster.mjs [--check]
//   --check   nur prüfen; Exit 1, wenn der README-Block veraltet ist (lint)

import { build } from 'esbuild';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { repoRoot } from './dosen-lib.mjs';

const README = join(repoRoot, '08-friedhof/README.md');
const START = '<!-- MUSTER:START -->';
const END = '<!-- MUSTER:END -->';

const dir = mkdtempSync(join(tmpdir(), 'amelie-friedhof-'));
const entry = join(dir, 'entry.ts');
const out = join(dir, 'bundle.mjs');
writeFileSync(
  entry,
  `export { DISCARDED_DATA } from ${JSON.stringify(join(repoRoot, 'src/data/dosen.ts'))};
export * from ${JSON.stringify(join(repoRoot, 'src/utils/friedhof.ts'))};
`
);

let mod;
try {
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
  mod = await import(pathToFileURL(out).href);
} finally {
  rmSync(dir, { recursive: true, force: true });
}

const { DISCARDED_DATA, friedhofMuster, nachTodesdatum, formatTodesdatum, URSACHE, KILLER, FUNDWEG, HERKUNFT, STADIUM } = mod;
const m = friedhofMuster(DISCARDED_DATA);
const pct = (n, of) => (of ? `${Math.round((n / of) * 100)} %` : '–');

function tabelle(titel, rows, labels, of = m.total) {
  const lines = [`**${titel}**`, '', '| | Gräber | Anteil |', '|---|---:|---:|'];
  for (const r of rows) lines.push(`| ${labels[r.key].de} | ${r.count} | ${pct(r.count, of)} |`);
  return lines.join('\n');
}

const zeile = (d) =>
  `| ${d.title} | ${formatTodesdatum(d.diedOn, 'de')} | ${URSACHE[d.cause].de} | ${KILLER[d.killer].de} | ${FUNDWEG[d.foundBy].de} | ${HERKUNFT[d.origin].de} | ${STADIUM[d.stage].de} |`;

const block = [
  START,
  '',
  `*Automatisch erzeugt aus \`src/data/dosen.ts\` (\`DISCARDED_DATA\`) mit \`npm run friedhof\`. Nicht von Hand bearbeiten — \`npm run lint\` meldet Abweichungen.*`,
  '',
  `**${m.total} Gräber.** ${m.spaete} davon starben erst als Dose oder Mail-Entwurf (teure Tode). ` +
    `Von ${m.dokumentierteFundwege} dokumentierten Fundwegen kamen ${m.ohneNeueSuche} ohne neue Suche aus ` +
    `(eigener Atlas, eigenes Protokoll oder Reality-Check) — ${pct(m.ohneNeueSuche, m.dokumentierteFundwege)}.`,
  '',
  tabelle('Woran sie starben', m.ursache, URSACHE),
  '',
  tabelle('Welche Suche traf', m.fundweg, FUNDWEG),
  '',
  tabelle('Woher sie kamen', m.herkunft, HERKUNFT),
  '',
  tabelle('Wer sie schon hatte', m.killer, KILLER),
  '',
  tabelle('Wie weit sie kamen', m.stadium, STADIUM),
  '',
  '### Alle Gräber (neueste zuerst)',
  '',
  '| Idee | † | Ursache | Wer sie hatte | Gefunden durch | Herkunft | Kam bis |',
  '|---|---|---|---|---|---|---|',
  ...nachTodesdatum(DISCARDED_DATA).map(zeile),
  '',
  END,
].join('\n');

const readme = readFileSync(README, 'utf8');
const a = readme.indexOf(START);
const b = readme.indexOf(END);
if (a === -1 || b === -1) {
  console.error(`Marker ${START} / ${END} fehlen in 08-friedhof/README.md.`);
  process.exit(1);
}
const next = readme.slice(0, a) + block + readme.slice(b + END.length);

if (process.argv.includes('--check')) {
  if (next !== readme) {
    console.error('08-friedhof/README.md ist veraltet — npm run friedhof ausführen.');
    process.exit(1);
  }
  console.log(`Friedhof in Ordnung: ${m.total} Gräber, README aktuell.`);
} else {
  writeFileSync(README, next);
  console.log(`08-friedhof/README.md geschrieben: ${m.total} Gräber.`);
}

#!/usr/bin/env node
// Gründungsnavigator: hält jedes wörtliche Zitat (Feld `q`) beider Demo-Seiten
// gegen den amtlichen Normtext auf gesetze-im-internet.de.
//
// Warum: Die Seiten versprechen „Wörtliches ist zitiert, Sinngemäßes als
// Kurzfassung markiert“. Am 11.10.2026 fand dieser Abgleich trotz Handprüfung
// am selben Tag vier Abweichungen (§ 10 SGB II, § 16 SGB I, § 44 SGB X, § 87 SGG).
//
// Zitate werden an „[…]“, „…“ und eckigen Einschüben in Stücke geteilt; jedes
// Stück (> 8 Zeichen) muss im Normtext vorkommen. Ein leerer oder gescheiterter
// Abruf ist KEINE Abweichung und wird getrennt gezählt.
//
// Braucht Netz, steht deshalb nicht im Lint. Aufruf:
//   npm run check:gn-zitate
// Exit 0 = alle abrufbaren Zitate stimmen, 1 = Abweichung, 2 = nichts abrufbar.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../public/gruendungsnavigator');
const PRE = 'const G = "https://www.gesetze-im-internet.de/", D = "https://dejure.org/gesetze/";';

/** Liest `const NAME = …;` aus einer Demo-Seite (gleiche Logik wie die Vitest-Suite). */
function konstante(html, name) {
  const start = html.indexOf(`const ${name} = `);
  if (start < 0) throw new Error(`Konstante ${name} fehlt`);
  const ab = start + `const ${name} = `.length;
  const ende = html.slice(ab).search(/\n[\]}];/);
  return new Function(`${PRE}; return (${html.slice(ab, ab + ende + 3).replace(/;$/, '')});`)();
}

const register = {
  'index.html': konstante(readFileSync(resolve(root, 'index.html'), 'utf8'), 'LAW'),
  'fall-landkarte.html': konstante(readFileSync(resolve(root, 'fall-landkarte.html'), 'utf8'), 'L'),
};

const ENT = { auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß', sect: '§', bdquo: '"', ldquo: '"', rdquo: '"', ndash: '–', quot: '"', amp: '&', hellip: '…', nbsp: ' ' };
const glatt = (t) => t.replace(/\s+/g, ' ').replace(/[„“"]/g, '"').trim();

const cache = new Map();
const gescheitert = new Set();
async function normtext(url) {
  if (cache.has(url)) return cache.get(url);
  let buf = null;
  for (let i = 0; i < 4 && !buf; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Amelie Zitat-Abgleich)' }, signal: AbortSignal.timeout(20000) });
      if (r.ok) {
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length > 2000) buf = b;
      }
    } catch { /* nächster Versuch */ }
  }
  if (!buf) { gescheitert.add(url); cache.set(url, ''); return ''; }
  let t = new TextDecoder('utf-8').decode(buf);
  if (t.includes('�')) t = new TextDecoder('latin1').decode(buf);
  t = t.replace(/<[^>]+>/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&(\w+);/g, (m, e) => ENT[e] ?? m);
  const out = glatt(t);
  cache.set(url, out);
  return out;
}

let ok = 0;
let abweichend = 0;
for (const [seite, reg] of Object.entries(register)) {
  for (const [id, n] of Object.entries(reg)) {
    if (!n.q) continue;
    const t = await normtext(n.u);
    if (!t) continue;
    const stuecke = n.q.split(/\[…\]|…|\[[^\]]*\]/).map(glatt).map((s) => s.replace(/^[,.;: ]+|[,.;: ]+$/g, '')).filter((s) => s.length > 8);
    const fehlt = stuecke.filter((s) => !t.includes(s));
    if (fehlt.length) {
      abweichend++;
      console.log(`ABWEICHUNG ${seite} ${id} (${n.t}):\n  ` + fehlt.map((s) => JSON.stringify(s.slice(0, 160))).join('\n  '));
    } else ok++;
  }
}
console.log(`\nZitat-Abgleich: ${ok} stimmen, ${abweichend} weichen ab, ${gescheitert.size} Seiten nicht abrufbar.`);
if (gescheitert.size) console.log('Nicht abrufbar (kein Befund, später erneut prüfen):\n  ' + [...gescheitert].join('\n  '));
process.exit(abweichend ? 1 : ok === 0 ? 2 : 0);

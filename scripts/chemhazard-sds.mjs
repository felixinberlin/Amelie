#!/usr/bin/env node
/**
 * ChemHazard Stop — Sicherheitsdatenblatt (SDB) → Produktdatensatz
 *
 *   node scripts/chemhazard-sds.mjs extract <datei.pdf|url> [--json]
 *   node scripts/chemhazard-sds.mjs check
 *   node scripts/chemhazard-sds.mjs barcodes     (schreibt data/barcodes/<gtin>.svg)
 *
 * `extract` liest ein SDB nach REACH Anhang II und zieht nur Tatsachen heraus:
 * Kennzeichnung (Abschnitt 2), Inhaltsstoffe mit CAS (Abschnitt 3), pH (Abschnitt 9),
 * Überarbeitungsdatum und SHA-256 der Datei. Die Gefahrengruppen werden daraus nach
 * einer festen Tabelle abgeleitet (siehe GROUP_RULES), nie geschätzt.
 * Das PDF selbst wird nicht ins Repo gelegt (Urheberrecht des Herstellers).
 *
 * `check` prüft data/products.json: Schema, GTIN-Prüfziffern, Herkunft.
 *
 * PDF-Text: `pdftotext` (poppler), sonst pdfjs-dist. pdfjs-dist ist keine
 * Projektabhängigkeit; Pfad über CHEMHAZARD_PDFJS=<…/pdf.mjs> oder
 * `npm i --no-save pdfjs-dist`. Fehlt beides: Exit 3 (nicht geprüft).
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEMO = path.join(ROOT, '07-demos/chemhazard-stop');

/** GS1-Prüfziffer (GTIN-8/12/13/14). */
export function isValidGtin(gtin) {
  if (typeof gtin !== 'string' || !/^(\d{8}|\d{12,14})$/.test(gtin)) return false;
  const digits = gtin.split('').map(Number);
  const check = digits.pop();
  const sum = digits.reverse().reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}

const EAN_L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const EAN_G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const EAN_R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const EAN_PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

/** EAN-13 als 95 Module; dieselbe Kodierung wie src/engine/chemhazard/ean13.ts (ein Test hält beide gleich). */
export function ean13Modules(gtin) {
  if (!/^\d{13}$/.test(gtin) || !isValidGtin(gtin)) return null;
  const d = gtin.split('').map(Number);
  let out = '101';
  for (let i = 1; i <= 6; i++) out += (EAN_PARITY[d[0]][i - 1] === 'L' ? EAN_L : EAN_G)[d[i]];
  out += '01010';
  for (let i = 7; i <= 12; i++) out += EAN_R[d[i]];
  return out + '101';
}

/** Druckbares SVG mit Ruhezone; Balken zu Rechtecken zusammengefasst. */
export function ean13Svg(gtin, label) {
  const modules = ean13Modules(gtin);
  if (!modules) return null;
  const quiet = 11;
  const bars = [...modules.matchAll(/1+/g)].map((m) => `<rect x="${quiet + m.index}" y="4" width="${m[0].length}" height="60"/>`).join('');
  const title = `EAN-13 ${gtin}${label ? ` – ${label}` : ''}`.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${modules.length + quiet * 2} 76" width="351" height="228" role="img" data-gtin="${gtin}" data-modules="${modules}"><title>${title}</title><rect width="100%" height="100%" fill="#fff"/><g fill="#000">${bars}</g><text x="${(modules.length + quiet * 2) / 2}" y="73" text-anchor="middle" font-family="monospace" font-size="8">${gtin}</text></svg>\n`;
}

/** Soll-Inhalt des Ordners data/barcodes: Dateiname → SVG. */
export function barcodeFiles(products) {
  const files = {};
  for (const p of products) for (const g of p.gtins || []) {
    const svg = ean13Svg(g.length === 14 && g.startsWith('0') ? g.slice(1) : g, `${p.brand} ${p.name}`);
    if (svg) files[`${g.length === 14 && g.startsWith('0') ? g.slice(1) : g}.svg`] = svg;
  }
  return files;
}

/**
 * Feste Ableitung der Gefahrengruppen. Jede Gruppe nennt ihren Grund,
 * damit ein Mensch die Zuordnung am SDB nachprüfen kann.
 */
export const GROUP_RULES = {
  hypochlorite: {
    // Aktivchlor-Abspalter. EUH031/EUH206 sind die Etikettensätze dazu.
    cas: ['7681-52-9', '7778-54-3', '7778-66-7', '2893-78-9', '51580-86-0', '2782-57-2', '87-90-1'],
    statements: ['EUH031', 'EUH206']
  },
  acid: {
    cas: [
      '7664-38-2', '7647-01-0', '5329-14-6', '77-92-9', '5949-29-1', '64-18-6', '79-33-4', '50-21-5',
      '75-75-2', '7697-37-2', '7664-93-9', '64-19-7', '79-14-1', '144-62-7', '110-16-7', '7681-38-1',
      '6915-15-7', '87-69-4', '110-15-6', '124-04-9', '2809-21-4'
    ],
    phMax: 5
  },
  ammonia: { cas: ['1336-21-6', '7664-41-7'] },
  peroxide: { cas: ['7722-84-1', '79-21-0', '15630-89-4', '124-43-6'] },
  caustic_lye: { cas: ['1310-73-2', '1310-58-3', '1310-65-2'], phMin: 12.5 },
  organic_solvent: {
    cas: ['64-17-5', '67-63-0', '71-23-8', '111-76-2', '107-98-2', '34590-94-8', '112-34-5', '5131-66-8', '67-64-1', '100-51-6']
  },
  flammable: { statements: ['H222', 'H224', 'H225', 'H226'] }
};

export function deriveChemicalGroups({ casNumbers = [], hazardStatements = [], ph } = {}) {
  const cas = new Set(casNumbers);
  const stm = new Set(hazardStatements);
  const groups = [];
  const reasons = {};
  const add = (g, why) => {
    if (!groups.includes(g)) groups.push(g);
    (reasons[g] ||= []).push(why);
  };
  for (const [group, rule] of Object.entries(GROUP_RULES)) {
    for (const c of rule.cas || []) if (cas.has(c)) add(group, `CAS ${c}`);
    for (const s of rule.statements || []) if (stm.has(s)) add(group, s);
    if (rule.phMax !== undefined && ph && typeof ph.max === 'number' && ph.max <= rule.phMax) add(group, `pH ≤ ${rule.phMax}`);
    if (rule.phMin !== undefined && ph && typeof ph.min === 'number' && ph.min >= rule.phMin) add(group, `pH ≥ ${rule.phMin}`);
  }
  if (groups.includes('hypochlorite') || groups.includes('peroxide') || ['H271', 'H272'].some((s) => stm.has(s))) {
    add('oxidizer', groups.includes('hypochlorite') ? 'Aktivchlor' : groups.includes('peroxide') ? 'Peroxid' : 'H271/H272');
  }
  if (groups.length === 0) add('unknown', 'keine erkannte Gefahrengruppe; keine Neutralitätsaussage');
  return { groups, reasons };
}

const num = (s) => Number(String(s).replace(',', '.'));

/** Schneidet Abschnitt n (1–16) aus dem SDB-Text. */
export function sdsSection(text, n) {
  const head = (k) => new RegExp(`(?:^|\\n)\\s*(?:ABSCHNITT|SECTION|Abschnitt|Section)\\s*${k}\\s*[:.]?`, 'g');
  const starts = [...text.matchAll(head(n))].map((m) => m.index);
  if (starts.length === 0) return '';
  // Der letzte Treffer vor dem nächsten Abschnitt: Inhaltsverzeichnisse stehen davor.
  let best = '';
  for (const start of starts) {
    const rest = text.slice(start + 1);
    const next = [...rest.matchAll(head(n + 1))].map((m) => m.index)[0];
    const chunk = next === undefined ? rest : rest.slice(0, next);
    if (chunk.length > best.length) best = chunk;
  }
  return best;
}

export function parseSdsText(text) {
  const flat = text.replace(/ /g, ' ').replace(/[ \t]+/g, ' ');
  const s2 = sdsSection(flat, 2);
  const s3 = sdsSection(flat, 3);
  const s9 = sdsSection(flat, 9);
  const s10 = sdsSection(flat, 10);

  // Kennzeichnung des Gemischs: nur Abschnitt 2. Abschnitt 3 nennt die Sätze der Einzelstoffe.
  const hazardStatements = [...new Set((s2.match(/\b(?:EUH\s?\d{3}[A-Z]?|H\d{3}[A-Za-z]{0,2})\b/g) || []).map((s) => s.replace(/\s/g, '')))]
    .filter((s) => /^(EUH\d{3}A?|H[234]\d{2}[A-Za-z]{0,2})$/.test(s))
    .sort();
  const signalWord = (s2.match(/Signalwort\s*:?\s*(Gefahr|Achtung)\b/i) || s2.match(/Signal word\s*:?\s*(Danger|Warning)\b/i) || [])[1] || null;
  const ufi = (flat.match(/\b([0-9A-HJ-NP-Y]{4}-[0-9A-HJ-NP-Y]{4}-[0-9A-HJ-NP-Y]{4}-[0-9A-HJ-NP-Y]{4})\b/) || [])[1] || null;

  const casNumbers = [...new Set(s3.match(/(?<![\d-])\d{2,7}-\d{2}-\d(?![\d-])/g) || [])].filter((c) => {
    // CAS-Prüfziffer, damit EG-/Index-Nummern nicht hineinrutschen.
    const d = c.replace(/-/g, '').split('').map(Number);
    const check = d.pop();
    return d.reverse().reduce((a, x, i) => a + x * (i + 1), 0) % 10 === check;
  });

  let ph;
  // Bei zweispaltigem Satz landet die pH-Zeile hinter der Überschrift von Abschnitt 10.
  const phLines = [...s9.split('\n'), ...flat.split('\n').filter((l) => /^\s*pH(?:-Wert| value)\b/i.test(l))];
  for (const line of phLines) {
    if (!/\bpH\b/i.test(line)) continue;
    // Klammern („bei 20 °C“, „1 %ige Lösung“) und Prüfnormen tragen fremde Zahlen.
    const rest = line.replace(/\([^)]*\)/g, ' ').replace(/^.*?\bpH(?:-Wert| value)?\s*:?/i, ' ');
    const m = rest.match(/((?:[<>≤≥]=?|ca\.|circa|~)?\s*\d{1,2}(?:[.,]\d+)?)(?:\s*(?:-|–|bis)\s*(\d{1,2}(?:[.,]\d+)?))?/);
    if (!m) continue;
    const first = m[1].trim();
    const a = num(first.match(/\d{1,2}(?:[.,]\d+)?/)[0]);
    const b = m[2] !== undefined ? num(m[2]) : undefined;
    if (a > 14 || (b !== undefined && b > 14)) continue;
    if (b !== undefined) ph = { min: Math.min(a, b), max: Math.max(a, b) };
    else if (/^[<≤]/.test(first)) ph = { max: a };
    else if (/^[>≥]/.test(first)) ph = { min: a };
    else ph = { min: a, max: a };
    break;
  }

  // Datum steht als 03.02.2022 oder 2022-10-24, manchmal erst in der nächsten Zeile.
  const date = (labels) => {
    const m = flat.match(new RegExp(`(?:${labels})\\s*:?\\s*(?:(\\d{1,2})[./](\\d{1,2})[./](\\d{4})|(\\d{4})-(\\d{2})-(\\d{2}))`, 'i'));
    if (!m) return null;
    const [y, mo, d] = m[3] ? [m[3], m[2], m[1]] : [m[4], m[5], m[6]];
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };
  const revisionDate =
    date('Überarbeitet am|Überarbeitungsdatum|Datum der Überarbeitung|Revisionsdatum|Revision date|Überarbeitung') ||
    date('Datum der Erstellung|Druckdatum|Ausgabedatum|Erstellt am|Date of issue');

  // GISCODE steht je nach Satz vor oder hinter dem Etikett „GISCODE/Produkt-Code:“.
  const gis = flat.match(/(?:\b([A-Z]{1,3}) ?(\d{1,3})[ \t]+)?GISCODE(?:\/Produkt-Code)?[ \t]*:?[ \t]*(?:([A-Z]{1,3}) ?(\d{1,3})\b)?/);
  const giscode = gis ? (gis[3] ? gis[3] + gis[4] : gis[1] ? gis[1] + gis[2] : null) : null;

  const incompat = (s10.match(/10\.5\.?[^\n]*\n([\s\S]{0,400}?)(?=\n\s*10\.6)/) || [])[1];

  const { groups, reasons } = deriveChemicalGroups({ casNumbers, hazardStatements, ph });
  return {
    revisionDate,
    ufi,
    giscode,
    signalWord,
    hazardStatements,
    casNumbers,
    ph: ph || null,
    incompatibleMaterials: incompat ? incompat.replace(/\s+/g, ' ').trim() : null,
    chemicalGroups: groups,
    groupReasons: reasons,
    sectionsFound: { 2: s2.length > 0, 3: s3.length > 0, 9: s9.length > 0, 10: s10.length > 0 }
  };
}

async function pdfToText(buffer, file) {
  const viaPoppler = file && spawnSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (viaPoppler && viaPoppler.status === 0 && viaPoppler.stdout.trim()) return viaPoppler.stdout;
  let pdfjs;
  try {
    const spec = process.env.CHEMHAZARD_PDFJS ? pathToFileURL(path.resolve(process.env.CHEMHAZARD_PDFJS)).href : 'pdfjs-dist/legacy/build/pdf.mjs';
    pdfjs = await import(spec);
  } catch {
    console.error('Kein PDF-Leser: pdftotext installieren oder CHEMHAZARD_PDFJS=<…/pdfjs-dist/legacy/build/pdf.mjs> setzen. Nicht geprüft.');
    process.exit(3);
  }
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer), verbosity: 0 }).promise;
  let out = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const content = await (await doc.getPage(p)).getTextContent();
    let lastY;
    for (const item of content.items) {
      const y = item.transform ? Math.round(item.transform[5]) : lastY;
      if (lastY !== undefined && y !== lastY) out += '\n';
      else if (out && !out.endsWith('\n')) out += ' ';
      out += item.str;
      lastY = y;
    }
    out += '\n';
  }
  return out;
}

async function cmdExtract(target, flags) {
  let buffer;
  let file = null;
  if (/^https?:\/\//.test(target)) {
    const res = await fetch(target, { headers: { 'user-agent': 'Mozilla/5.0 (ChemHazard Stop SDB-Abgleich)' } });
    if (!res.ok) {
      console.error(`Abruf fehlgeschlagen (${res.status}): ${target}. Nicht geprüft.`);
      process.exit(3);
    }
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    file = path.resolve(target);
    buffer = await readFile(file);
  }
  if (buffer.subarray(0, 5).toString() !== '%PDF-') {
    console.error(`Kein PDF: ${target}`);
    process.exit(1);
  }
  const text = await pdfToText(buffer, file);
  const facts = { source: target, sha256: createHash('sha256').update(buffer).digest('hex'), ...parseSdsText(text) };
  if (flags.includes('--text')) console.log(text);
  else console.log(JSON.stringify(facts, null, 2));
  const missing = Object.entries(facts.sectionsFound).filter(([, ok]) => !ok).map(([n]) => n);
  if (missing.length) {
    console.error(`Abschnitt(e) ${missing.join(', ')} nicht gefunden: Werte von Hand am SDB prüfen.`);
    process.exit(2);
  }
}

/** Prüft den Produktbestand. Gibt eine Liste von Befunden zurück (leer = gut). */
export function checkProducts(products) {
  const problems = [];
  const seen = new Map();
  for (const p of products) {
    const at = (msg) => problems.push(`${p.id}: ${msg}`);
    for (const g of p.gtins || []) {
      if (!isValidGtin(g)) at(`GTIN ${g} hat eine falsche Prüfziffer`);
      if (seen.has(g)) at(`GTIN ${g} steht auch bei ${seen.get(g)}`);
      seen.set(g, p.id);
    }
    if ((p.gtins || []).length > 0 && !p.provenance?.gtinSource) at('GTIN ohne gtinSource');
    for (const key of ['hazardsConfirmed', 'completenessReviewed', 'currentVersionChecked']) {
      const r = p.reviewMetadata?.[key];
      if (p[key] && (!r || !/^\d{4}-\d{2}-\d{2}$/.test(r.date || '') || !r.basis?.trim())) at(`${key} ohne dokumentierte Review-Metadaten`);
    }
    for (const g of p.gtins || []) {
      if (g.length !== 14) at(`GTIN ${g} nicht kanonisch (14 Stellen)`);
      const m = p.gtinMappings?.[g];
      if (!m || typeof m.confirmed !== 'boolean') at(`GTIN ${g} ohne Mapping-Status`);
      if (m?.confirmed && (!/^\d{4}-\d{2}-\d{2}$/.test(m.review?.date || '') || !m.review?.basis?.trim())) at(`GTIN ${g} bestätigt ohne Review`);
    }
    if (p.hazardStatementsEvidence === 'documented_absence' && p.hazardStatements?.length) at('dokumentierte Abwesenheit widerspricht H-Satzliste');
    if (p.hazardStatementsEvidence === 'documented' && !p.hazardStatements?.length) at('leere H-Satzliste ohne dokumentierte Abwesenheit');
    if (!p.hazardsConfirmed) continue;
    const pr = p.provenance || {};
    if (!/^https:\/\//.test(pr.sourceUrl || '')) at('hazardsConfirmed, aber ohne sourceUrl (https)');
    if (!/^[0-9a-f]{64}$/.test(pr.sha256 || '')) at('hazardsConfirmed, aber ohne SHA-256 des SDB');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pr.revisionDate || '')) at('hazardsConfirmed, aber ohne Überarbeitungsdatum des SDB');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pr.verificationDate || '')) at('hazardsConfirmed, aber ohne verificationDate');
    const derived = deriveChemicalGroups({ casNumbers: p.casNumbers, hazardStatements: p.hazardStatements, ph: p.ph }).groups;
    const want = [...derived].sort().join(',');
    const have = [...p.chemicalGroups].sort().join(',');
    if (want !== have) at(`chemicalGroups [${have}] weichen von der Ableitung [${want}] ab`);
  }
  return problems;
}

async function cmdBarcodes() {
  const products = JSON.parse(await readFile(path.join(DEMO, 'data/products.json'), 'utf8'));
  const dir = path.join(DEMO, 'data/barcodes');
  const want = barcodeFiles(products);
  await mkdir(dir, { recursive: true });
  for (const name of await readdir(dir)) if (name.endsWith('.svg') && !(name in want)) await rm(path.join(dir, name));
  for (const [name, svg] of Object.entries(want)) await writeFile(path.join(dir, name), svg);
  const rows = products.filter((p) => (p.gtins || []).length).flatMap((p) => p.gtins.map((g) => `| ${p.brand} | ${p.name} | \`${g}\` | ![${g}](${g.length === 14 && g.startsWith('0') ? g.slice(1) : g}.svg) |`));
  await writeFile(path.join(dir, 'README.md'), `# Strichcodes der Referenzprodukte\n\nErzeugt mit \`npm run chemhazard:barcodes\` aus \`../products.json\`. Nicht von Hand ändern.\nJede Datei ist der EAN-13-Code, wie er auf dem Gebinde steht (Fundstelle der Nummer: \`provenance.gtinSource\`).\n\n| Marke | Produkt | GTIN | Strichcode |\n|---|---|---|---|\n${rows.join('\n')}\n`);
  console.log(`${Object.keys(want).length} Strichcodes nach ${path.relative(ROOT, dir)} geschrieben.`);
}

async function cmdCheck() {
  const products = JSON.parse(await readFile(path.join(DEMO, 'data/products.json'), 'utf8'));
  const schema = JSON.parse(await readFile(path.join(DEMO, 'schemas/product.schema.json'), 'utf8'));
  const { default: Ajv2020 } = await import('ajv/dist/2020.js');
  const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
  const problems = checkProducts(products);
  for (const p of products) {
    if (!validate(p)) for (const e of validate.errors) problems.push(`${p.id}: Schema ${e.instancePath} ${e.message}`);
  }
  const want = barcodeFiles(products);
  const have = await readdir(path.join(DEMO, 'data/barcodes')).catch(() => []);
  for (const [name, svg] of Object.entries(want)) {
    const cur = await readFile(path.join(DEMO, 'data/barcodes', name), 'utf8').catch(() => null);
    if (cur !== svg) problems.push(`barcodes/${name} fehlt oder ist veraltet (npm run chemhazard:barcodes)`);
  }
  for (const name of have) if (name.endsWith('.svg') && !(name in want)) problems.push(`barcodes/${name} gehört zu keiner GTIN im Bestand`);
  if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\n${problems.length} Befund(e) in ${products.length} Produkten.`);
    process.exit(1);
  }
  const confirmedHazards = products.filter((p) => p.hazardsConfirmed).length;
  const confirmedMappings = products.flatMap((p) => Object.values(p.gtinMappings || {})).filter((m) => m.confirmed).length;
  const gtins = products.reduce((n, p) => n + (p.gtins || []).length, 0);
  console.log(`ChemHazard-Bestand in Ordnung: ${products.length} Produkte, ${confirmedHazards} mit belegten Gefahren (auch Händlerkopien); Vollständigkeit/Aktualität separat, ${gtins} GTINs mit gültiger Prüfziffer, ${confirmedMappings} bestätigte Zuordnungen.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = rest.filter((a) => !a.startsWith('--'));
  const flags = rest.filter((a) => a.startsWith('--'));
  if (cmd === 'extract' && args[0]) await cmdExtract(args[0], flags);
  else if (cmd === 'check') await cmdCheck();
  else if (cmd === 'barcodes') await cmdBarcodes();
  else {
    console.error('Aufruf: chemhazard-sds.mjs extract <datei.pdf|url> [--text] | check | barcodes');
    process.exit(1);
  }
}

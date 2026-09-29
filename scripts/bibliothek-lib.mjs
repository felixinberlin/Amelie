// Reine Funktionen der Bibliotheks-CLI (scripts/bibliothek.mjs).
//
// Bewusst ohne Seiteneffekte auf Dateien, damit src/utils/bibliothek.test.ts sie
// prüfen kann: Suche über das ganze Gedächtnis, Protokoll lesen und erweitern,
// Totenscheine validieren, Quellenmeldungen der Agenten in Register-Aufrufe übersetzen.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot, DOSEN_DIR, readDoseFiles, loadGraeber } from './dosen-lib.mjs';

export const PROTOKOLL = join(repoRoot, '06-suche/amelie-pruefprotokoll.md');
export const URTEILE = ['frei', 'verengt', 'unklar', 'besetzt'];
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DAY_OR_MONTH = /^\d{4}-\d{2}(-\d{2})?$/;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------- Argumente

/** Schalter ohne Wert: sie dürfen den folgenden Begriff nicht als Wert verschlucken (`find a --any b`). */
export const BOOLEAN_FLAGS = new Set(['any', 'alle', 'json', 'dry-run', 'netz', 'schnell', 'abschnitte', 'wort']);

/** `--flag wert`, `--flag` (= "true") und Positionsargumente. */
export function parseArgs(argv) {
  const flags = {};
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = !BOOLEAN_FLAGS.has(key) && argv[i + 1] !== undefined && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      (flags[key] ??= []).push(val);
    } else pos.push(argv[i]);
  }
  return { pos, flags, one: (k) => flags[k]?.[0], many: (k) => flags[k] ?? [], has: (k) => k in flags };
}

// ---------------------------------------------------------------- Suche

/** Kleinschreibung, Umlaute und Diakritika vereinheitlicht: „Straßennamen-Prüfer“ → „strassennamen-pruefer“. */
export function norm(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Alle (oder mit any: mindestens ein) Suchbegriffe müssen im Text stehen.
 * Mit wort=true zählen nur ganze Wörter (`pegel` trifft nicht „Wetterverlauf“, `spiel` nicht „Spielarchiv“).
 */
export function matches(text, terms, any = false, wort = false) {
  const t = norm(text);
  const ts = terms.map(norm).filter(Boolean);
  if (!ts.length) return false;
  const hit = wort
    ? (x) => new RegExp(`(^|[^a-z0-9])${x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(t)
    : (x) => t.includes(x);
  return any ? ts.some(hit) : ts.every(hit);
}

export function snippet(text, terms, width = 160) {
  const flat = String(text).replace(/\s+/g, ' ').trim();
  const t = norm(flat);
  const at = terms.map((x) => t.indexOf(norm(x))).filter((n) => n >= 0).sort((a, b) => a - b)[0] ?? 0;
  const from = Math.max(0, at - 40);
  return (from > 0 ? '…' : '') + flat.slice(from, from + width) + (from + width < flat.length ? '…' : '');
}

// ---------------------------------------------------------------- Protokoll

const splitRow = (line) => line.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());
const isSeparator = (line) => /^\|[\s:|-]+\|?\s*$/.test(line);

export function verdictOf(cell) {
  const m = /\b(frei|verengt|unklar|besetzt)\b/i.exec(cell ?? '');
  return m ? m[1].toLowerCase() : null;
}

/** Zerlegt das Prüfprotokoll in Zeilen mit Abschnitt, Urteil und Methode. */
export function parseProtokoll(text) {
  const rows = [];
  let section = '';
  text.split('\n').forEach((line, i) => {
    const h = /^## (.+)$/.exec(line);
    if (h) section = h[1].trim();
    if (!line.startsWith('|') || isSeparator(line)) return;
    const cells = splitRow(line);
    if (cells.length < 3 || /^\*{0,2}(?:idee\b|nr\b|#(?!\d))/i.test(cells[0])) return;
    // Tabellen sind nicht einheitlich: manche haben eine Nummernspalte (H4, B4, 3) vor dem Titel,
    // das Urteil steht nicht immer in Spalte 2. Urteil = erste Zelle, die mit einem Urteilswort beginnt.
    const nummer = /^[A-Za-z]?\d{1,3}\.?$|^#\d+$/.test(cells[0]) && cells.length > 3;
    const vi = cells.findIndex((c, k) => k >= 1 && /^[*`\s]*(frei|verengt|unklar|besetzt)\b/i.test(c));
    rows.push({
      line: i + 1,
      section,
      idee: nummer ? cells[1] : cells[0],
      urteil: vi >= 0 ? verdictOf(cells[vi]) : null,
      urteilRoh: vi >= 0 ? cells[vi] : '',
      beleg: cells[nummer ? 2 : 2] ?? '',
      pruefenAb: cells[cells.length - 1] ?? '',
      method: (/\[method:\s*([^\]]+)\]/.exec(line) ?? [])[1]?.trim() ?? null,
      text: line,
    });
  });
  return rows;
}

export function protokollStats(rows) {
  const zaehle = (list, keyFn) => {
    const out = {};
    for (const r of list) {
      const k = keyFn(r);
      out[k] ??= { frei: 0, verengt: 0, unklar: 0, besetzt: 0, sonst: 0, summe: 0 };
      out[k][r.urteil ?? 'sonst']++;
      out[k].summe++;
    }
    return out;
  };
  return { gesamt: zaehle(rows, () => 'gesamt').gesamt, nachAbschnitt: zaehle(rows, (r) => r.section || '(ohne Abschnitt)'), nachMethode: zaehle(rows, (r) => r.method ?? '(ohne method-Marke)') };
}

const cell = (s) => String(s).replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|').trim();
const HEAD_NEU = '| # | Idee | Methode | Urteil (Merge → nach Review) | Beleg (kurz) | Evidenz | Geprüft | Prüfen ab |';

/** Prüft die Angaben zu einer Protokollzeile; wirft, wenn Pflichtangaben fehlen. */
export function buildProtokollFelder({ titel, id, was, urteil, beleg, method, evidenz, pruefenAb, datum, nr }) {
  if (!titel) throw new Error('--titel fehlt');
  if (!URTEILE.includes(urteil)) throw new Error(`--urteil muss ${URTEILE.join(' | ')} sein`);
  if (!beleg) throw new Error('--beleg fehlt (Beleg in kurz: was wurde gefunden, wo)');
  if (!['seite', 'schnipsel'].includes(evidenz)) throw new Error('--evidenz seite | schnipsel ist Pflicht (Playbook: jede Zeile trägt [Seite] oder [Schnipsel])');
  if (!method) throw new Error('--method fehlt (ideenrunde | bisoziation | inversion | review …)');
  if (!/^(\d{2}\/\d{4}|–|-)$/.test(pruefenAb ?? '')) throw new Error('--pruefen-ab im Format MM/JJJJ (oder –)');
  if (id && !KEBAB.test(id)) throw new Error('--id muss kebab-case sein');
  const marke = evidenz === 'seite' ? '[Seite]' : '[Schnipsel]';
  return {
    nr,
    idee: `**${cell(titel)}**${id ? ` (\`${id}\`)` : ''}${was ? ` — ${cell(was)}` : ''}`,
    method: /\[method:/i.test(method) ? method : `[method: ${method}]`,
    urteil,
    beleg: `${cell(beleg)}${/\[(Seite|Schnipsel)\]/i.test(beleg) ? '' : ` ${marke}`}`,
    marke,
    datum: datum ?? new Date().toISOString().slice(0, 10).split('-').reverse().join('.'),
    pruefenAb,
  };
}

/** Formatiert die Felder für eine der zwei im Protokoll vorkommenden Tabellenformen (4 Spalten klassisch, 8 Spalten seit der Teamrunde). */
export function formatProtokollRow(f, spalten) {
  if (spalten === 4) return `| ${f.idee} | \`${f.urteil}\` | ${f.method} ${f.beleg} | ${f.pruefenAb} |`;
  return `| ${f.nr} | ${f.idee} | ${f.method} | \`${f.urteil}\` | ${f.beleg.replace(/ \[(Seite|Schnipsel)\]$/, '')} | ${f.marke} | ${f.datum} | ${f.pruefenAb} |`;
}

/**
 * Fügt eine Zeile in die letzte passende Idee-Urteil-Tabelle des Abschnitts `runde` ein
 * (Abschnittstitel = Text nach „## “, Präfix genügt). Erkennt die 4- und die 8-Spalten-Form.
 * Gibt es den Abschnitt nicht, wird er nur mit `neuerAbschnitt` (Einleitungszeile) am Dateiende angelegt (8-Spalten-Form).
 */
export function insertProtokollRow(text, { runde, felder, neuerAbschnitt }) {
  const lines = text.split('\n');
  const head = lines.findIndex((l) => l.startsWith('## ') && norm(l.slice(3)).startsWith(norm(runde)));
  if (head === -1) {
    if (!neuerAbschnitt) throw new Error(`Abschnitt „${runde}“ nicht gefunden (Präfix des Titels nach „## “; Übersicht: bib protokoll stats --abschnitte). Neuen Abschnitt mit --neuer-abschnitt "<Einleitung>" anlegen.`);
    const row = formatProtokollRow({ ...felder, nr: felder.nr ?? 'N1' }, 8);
    return { row, text: text.replace(/\n*$/, '\n') + ['', '---', '', `## ${runde}`, '', neuerAbschnitt, '', HEAD_NEU, '|---|---|---|---|---|---|---|---|', row, ''].join('\n') };
  }
  let end = lines.findIndex((l, i) => i > head && l.startsWith('## '));
  if (end === -1) end = lines.length;
  // Abschnitte enthalten oft weitere Tabellen (Vektoren, Zählungen), die nicht gemeint sind.
  let ziel = null;
  for (let i = head + 1; i < end; i++) {
    if (!lines[i].startsWith('|') || lines[i - 1].startsWith('|')) continue;
    const kopf = splitRow(lines[i]);
    const idee = kopf.findIndex((c) => /idee/i.test(c));
    const urteil = kopf.findIndex((c) => /urteil/i.test(c));
    if (idee < 0 || urteil < 0 || (kopf.length !== 4 && kopf.length !== 8)) continue;
    let j = i;
    while (j + 1 < end && lines[j + 1].startsWith('|')) j++;
    ziel = { spalten: kopf.length, last: j };
  }
  if (!ziel) throw new Error(`Abschnitt „${runde}“ hat keine Tabelle „Idee | Urteil …“ mit 4 oder 8 Spalten — Zeile von Hand einfügen oder neuen Abschnitt anlegen.`);
  let nr = felder.nr;
  if (ziel.spalten === 8 && !nr) {
    const zuletzt = /^\|\s*([A-Za-z]*)(\d+)\s*\|/.exec(lines[ziel.last]);
    nr = zuletzt ? `${zuletzt[1]}${Number(zuletzt[2]) + 1}` : String(lines.slice(head, ziel.last).filter((l) => l.startsWith('|')).length - 1);
  }
  const row = formatProtokollRow({ ...felder, nr }, ziel.spalten);
  lines.splice(ziel.last + 1, 0, row);
  return { text: lines.join('\n'), row };
}

// ---------------------------------------------------------------- Kandidaten, Dosen

export function readCandidates(root = repoRoot) {
  const ideasDir = join(root, 'src/data/ideas');
  const files = [join(root, 'src/data/unpacked.ts'), ...readdirSync(ideasDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts').map((f) => join(ideasDir, f))];
  const out = [];
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    for (const part of src.split(/\n {4}id: '/).slice(1)) {
      const id = part.slice(0, part.indexOf("'"));
      const get = (k) => ((part.match(new RegExp(`\\n {4}${k}: '((?:[^'\\\\]|\\\\.)*)'`)) || [])[1] ?? '').replace(/\\'/g, "'");
      out.push({ id, title: get('title') || id, status: get('status'), concept: get('conceptDe'), packedDoseId: get('packedDoseId') || null, file: file.replace(root + '/', '') });
    }
  }
  return out;
}

export function readDosen() {
  return readDoseFiles().map((id) => {
    const md = readFileSync(join(DOSEN_DIR, `${id}.md`), 'utf8');
    return { id, title: (md.match(/^# (.+)$/m) || [])[1] ?? id, text: md, file: `05-dosen/${id}.md` };
  });
}

const LOG_FILES = [
  '06-suche/amelie-classification-log.md',
  '06-suche/amelie-bisoziation-log.md',
  '06-suche/amelie-inversions-log.md',
  '06-suche/amelie-suchplaybook.md',
  '06-suche/amelie-foerderlandschaft.md',
  '06-suche/amelie-foerder-und-preisatlas.md',
  '08-friedhof/nachrufe.md',
];

/** Durchsucht das gesamte Gedächtnis. `kind` „bindend“ heißt: Treffer sind ein „schon da“-Signal. */
export function findAll(terms, { any = false, wort = false, root = repoRoot, quellen = [] } = {}) {
  const hits = [];
  const add = (kind, bindend, id, title, text, where, extra = {}) => {
    if (matches(`${id} ${title} ${text}`, terms, any, wort)) hits.push({ kind, bindend, id, title, where, ...extra, snippet: snippet(text || title, terms) });
  };
  const protokoll = readFileSync(PROTOKOLL, 'utf8');
  for (const r of parseProtokoll(protokoll)) add('protokoll', true, '', r.idee, r.text, `06-suche/amelie-pruefprotokoll.md:${r.line} [${r.urteil ?? '?'}]`, { file: '06-suche/amelie-pruefprotokoll.md', line: r.line, verdict: r.urteil, section: r.section });
  for (const g of loadGraeber()) {
    add('grab', true, g.id, g.title, [g.originalIdeaDe, g.whyDiscardedDe, g.lessonDe, g.domain, ...(g.evidence ?? [])].join(' '), `graeber.json [${g.cause}/${g.killer}, ${g.diedOn}]`, { file: 'src/data/graeber.json', cause: g.cause, killer: g.killer, diedOn: g.diedOn });
  }
  for (const d of readDosen()) add('dose', true, d.id, d.title, d.text, d.file, { file: d.file });
  for (const c of readCandidates(root)) add('kandidat', true, c.id, c.title, c.concept, `${c.file} [${c.status || '?'}${c.packedDoseId ? ` → Dose ${c.packedDoseId}` : ''}]`, { file: c.file, status: c.status || null, packedDoseId: c.packedDoseId });
  for (const q of quellen) add('quelle', false, q.id, q.name, [q.enthaelt, q.fokus, ...(q.tags ?? [])].join(' '), `quellen.json [${q.status}]`, { file: 'src/data/quellen.json', status: q.status });
  for (const f of LOG_FILES) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    readFileSync(p, 'utf8').split('\n').forEach((line, i) => add('log', false, '', f.split('/').pop(), line, `${f}:${i + 1}`, { file: f, line: i + 1 }));
  }
  return hits;
}

// ---------------------------------------------------------------- Gräber

/** Liest die Werte einer String-Union aus src/types.ts, damit CLI und Typen nicht auseinanderlaufen. */
export function readEnum(typeName, typesFile = join(repoRoot, 'src/types.ts')) {
  const src = readFileSync(typesFile, 'utf8');
  const m = new RegExp(`export type ${typeName} =([^;]+);`).exec(src);
  if (!m) throw new Error(`Typ ${typeName} nicht in src/types.ts gefunden`);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

export const GRAB_FELDER = ['id', 'title', 'titleKey', 'originalIdeaDe', 'originalIdeaEn', 'whyDiscardedDe', 'whyDiscardedEn', 'lessonDe', 'lessonEn', 'domain', 'evidence', 'cause', 'killer', 'foundBy', 'origin', 'stage', 'bornIn', 'diedOn', 'resurrectIfDe', 'resurrectIfEn', 'nachruf'];
const GRAB_PFLICHT = GRAB_FELDER.filter((f) => f !== 'titleKey' && f !== 'nachruf');

/** Prüft einen Totenschein nach der Friedhofsordnung; gibt Fehlertexte zurück (leer = ok). */
export function validateGrab(g, { graeber = [], doseIds = [], root = repoRoot, enums } = {}) {
  const e = enums ?? { cause: readEnum('Todesursache'), killer: readEnum('Killerart'), foundBy: readEnum('Fundweg'), origin: readEnum('Herkunft'), stage: readEnum('Stadium') };
  const errs = [];
  for (const f of GRAB_PFLICHT) {
    if (f === 'evidence') {
      if (!Array.isArray(g.evidence)) errs.push('evidence muss eine Liste sein (darf leer bleiben, wenn die Idee ohne Suche starb)');
    } else if (!String(g[f] ?? '').trim()) errs.push(`Pflichtfeld „${f}“ fehlt`);
  }
  for (const k of Object.keys(g)) if (!GRAB_FELDER.includes(k)) errs.push(`unbekanntes Feld „${k}“`);
  for (const [f, list] of Object.entries(e)) if (g[f] && !list.includes(g[f])) errs.push(`${f} „${g[f]}“ ungültig — erlaubt: ${list.join(' · ')}`);
  if (g.id && !KEBAB.test(g.id)) errs.push('id muss kebab-case sein');
  if (g.id && graeber.some((x) => x.id === g.id)) errs.push(`Grab „${g.id}“ gibt es schon`);
  if (g.id && doseIds.includes(g.id)) errs.push(`„${g.id}“ ist noch als Dose in 05-dosen/ — erst nach Friedhofsordnung Schritt 2 bestatten (Dose aus DOSEN_DATA nehmen, Datei nach 08-friedhof/grabbeigaben/)`);
  if (g.diedOn && !ISO_DAY_OR_MONTH.test(g.diedOn)) errs.push('diedOn muss ISO-Datum oder ISO-Monat sein (2026-09-29 | 2026-09)');
  if (g.nachruf && !existsSync(join(root, g.nachruf))) errs.push(`nachruf „${g.nachruf}“ existiert nicht`);
  if ((g.stage === 'dose' || g.stage === 'zugestellt') && !g.nachruf) errs.push(`stage=${g.stage}: die Dose hat Text hinterlassen — nachruf (Grabbeigabe unter 08-friedhof/grabbeigaben/) angeben`);
  return errs;
}

/** Bringt einen Totenschein in die Feldreihenfolge der bestehenden Gräber. */
export function orderGrab(g) {
  const out = {};
  for (const f of GRAB_FELDER) if (g[f] !== undefined && g[f] !== '') out[f] = g[f];
  return out;
}

// ---------------------------------------------------------------- Quellenmeldungen

const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/, '');

/**
 * Zerlegt Zeilen im Format
 *   QUELLE <id | NEU: Name> | status=… | evidenz=… | zugang=<ja|teilweise|gesperrt> [wie: …] | ertrag=Dose x, Grab y | urls=… | note=…
 * (neue Quellen zusätzlich typ=, kategorie=, enthaelt=, optional fokus=, tags=, rolle=, id=).
 * Prüft gegen das Register; nichts wird geschrieben. Ergebnis: { eintraege, fehler }.
 */
export function parseQuellenmeldung(text, { quellen, katalog, doseIds, graveIds, typen }) {
  const eintraege = [];
  const fehler = [];
  const bekannt = new Set(quellen.map((q) => q.id));
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim().replace(/^[-*]\s+/, '');
    if (!/^QUELLE\s/i.test(line)) return;
    const at = `Zeile ${i + 1}`;
    const parts = line.replace(/^QUELLE\s+/i, '').split(/\s\|\s/).map((p) => p.trim());
    const kopf = parts.shift();
    const f = {};
    for (const p of parts) {
      const m = /^([a-zäöü]+)\s*=\s*([\s\S]*)$/i.exec(p);
      if (m) f[m[1].toLowerCase()] = m[2].trim();
    }
    const neu = /^NEU:\s*/i.test(kopf);
    const name = neu ? kopf.replace(/^NEU:\s*/i, '') : null;
    const id = neu ? f.id ?? slug(name) : kopf;
    const e = { zeile: i + 1, neu, id, name, note: f.note ?? '' };
    const problem = (msg) => fehler.push(`${at} (${id}): ${msg}`);
    if (!e.note) problem('note= fehlt (ein Satz: was wurde gefunden)');
    if (neu) {
      if (bekannt.has(id)) problem('NEU, aber die id gibt es schon — ohne NEU melden');
      for (const k of ['typ', 'kategorie', 'enthaelt']) if (!f[k]) problem(`NEU braucht ${k}=`);
      if (f.typ && !typen.includes(f.typ)) problem(`typ „${f.typ}“ unbekannt (erlaubt: ${typen.join(' ')}; Erklärung: bib quellen formate)`);
      if (f.kategorie && !katalog.kategorien[f.kategorie]) problem(`kategorie „${f.kategorie}“ unbekannt (erlaubt: ${Object.keys(katalog.kategorien).join(' · ')})`);
      Object.assign(e, { typ: f.typ, kategorie: f.kategorie, enthaelt: f.enthaelt, fokus: f.fokus, tags: (f.tags ?? '').split(/[,\s]+/).filter(Boolean), rollen: (f.rolle ?? '').split(/[,\s]+/).filter(Boolean) });
    } else if (!bekannt.has(id)) problem('unbekannte Quelle — als NEU: Name melden oder id prüfen (`quellen list`)');
    if (f.status) {
      if (!katalog.status.some((s) => s.id === f.status)) problem(`status „${f.status}“ unbekannt (erlaubt: ${katalog.status.map((s) => s.id).join(' · ')})`);
      e.status = f.status;
    }
    if (f.evidenz) {
      if (!katalog.evidenz[f.evidenz]) problem(`evidenz „${f.evidenz}“ unbekannt (erlaubt: ${Object.keys(katalog.evidenz).join(' · ')})`);
      e.evidenz = f.evidenz;
    }
    if ((e.status === 'durchsucht' || e.status === 'erschöpft') && e.evidenz !== 'seite') problem(`status=${e.status} verlangt evidenz=seite (Regel 1: nur hochsetzen, wenn selbst gelesen)`);
    if (f.zugang) {
      const m = /^(ja|teilweise|gesperrt|unbekannt)\s*(?:\[wie:\s*([\s\S]*?)\])?$/i.exec(f.zugang);
      if (!m) problem('zugang= muss „ja|teilweise|gesperrt|unbekannt“ sein, optional gefolgt von [wie: …]');
      else Object.assign(e, { erreichbar: m[1].toLowerCase(), wie: m[2] });
    }
    e.dose = []; e.grab = []; e.kandidat = [];
    for (const m of (f.ertrag ?? '').matchAll(/\b(dose|grab|idee|kandidat)[:\s]+([a-z0-9]+(?:-[a-z0-9]+)*)/gi)) {
      const art = m[1].toLowerCase() === 'idee' ? 'kandidat' : m[1].toLowerCase();
      if (art === 'dose' && !doseIds.has(m[2])) problem(`ertrag Dose „${m[2]}“ existiert nicht (erst packen)`);
      if (art === 'grab' && !graveIds.has(m[2])) problem(`ertrag Grab „${m[2]}“ existiert nicht (erst begraben: bib grab add)`);
      e[art].push(m[2]);
    }
    e.urls = (f.urls ?? '').split(/[\s,]+/).filter((u) => /^https?:\/\//.test(u));
    eintraege.push(e);
  });
  if (!eintraege.length) fehler.push('keine „QUELLE …“-Zeile gefunden');
  return { eintraege, fehler };
}

/** Übersetzt einen geprüften Eintrag in die Argumentliste für scripts/quellen.mjs. */
export function meldungToArgs(e, { agent, runde }) {
  const a = [];
  const push = (flag, v) => { if (v !== undefined && v !== '') a.push(`--${flag}`, String(v)); };
  if (e.neu) {
    a.push('add');
    push('id', e.id); push('name', e.name); push('typ', e.typ); push('kategorie', e.kategorie);
    push('enthaelt', e.enthaelt); push('fokus', e.fokus);
    for (const t of e.tags ?? []) push('tag', t);
    for (const r of e.rollen ?? []) push('rolle', r);
  } else {
    a.push('log', e.id);
  }
  push('note', e.note); push('status', e.status); push('evidenz', e.evidenz);
  push('erreichbar', e.erreichbar); push('wie', e.wie);
  for (const u of e.urls) push('url', u);
  for (const d of e.dose) push('dose', d);
  for (const g of e.grab) push('grab', g);
  for (const k of e.kandidat) push('kandidat', k);
  push('agent', agent); push('runde', runde);
  return a;
}

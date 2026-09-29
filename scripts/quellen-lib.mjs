// Gemeinsame Funktionen für das Quellen-Register (src/data/quellen.json).
//
// Das Register ist die Wahrheit; 06-suche/amelie-quellen.md wird daraus erzeugt
// (npm run quellen -- md) und nicht mehr von Hand gepflegt. Wie beim Friedhof:
// Datei und Seite können sich deshalb nicht widersprechen.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot, readDoseFiles, readDataIds } from './dosen-lib.mjs';
import { BibError } from './bib-errors.mjs';

export const QUELLEN_JSON = join(repoRoot, 'src/data/quellen.json');
export const QUELLEN_MD = join(repoRoot, '06-suche/amelie-quellen.md');
const START = '<!-- QUELLEN:START -->';
const END = '<!-- QUELLEN:END -->';

export const loadQuellen = (file = QUELLEN_JSON) => JSON.parse(readFileSync(file, 'utf8'));
export const saveQuellen = (data, file = QUELLEN_JSON) => writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

export const isoToday = () => new Date().toISOString().slice(0, 10);
export const scoreOf = (q) => q.vektoren.q.reduce((a, b) => a + b, 0);
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Prüft das Register; gibt eine Liste von Fehlertexten zurück (leer = ok). */
export function validate(data, { doseIds, graveIds } = {}) {
  const errs = [];
  const k = data.katalog;
  const statusIds = k.status.map((s) => s.id);
  const typIds = new Set(data.typen.map((t) => t.id));
  const seen = new Set();
  for (const q of data.quellen) {
    const at = `Quelle „${q.id}“`;
    if (!ID.test(q.id ?? '')) errs.push(`${at}: id muss kebab-case sein`);
    if (seen.has(q.id)) errs.push(`${at}: doppelte id`);
    seen.add(q.id);
    if (!q.name?.trim()) errs.push(`${at}: name fehlt`);
    if (!typIds.has(q.typ)) errs.push(`${at}: unbekannter Typ „${q.typ}“`);
    if (!k.kategorien[q.kategorie]) errs.push(`${at}: unbekannte Kategorie „${q.kategorie}“`);
    if (!statusIds.includes(q.status)) errs.push(`${at}: unbekannter Status „${q.status}“`);
    if (!k.evidenz[q.evidenz]) errs.push(`${at}: unbekannte Evidenz „${q.evidenz}“`);
    if (!q.rollen?.length || q.rollen.some((r) => !k.rollen[r])) errs.push(`${at}: rollen leer oder unbekannt`);
    if (q.zuletzt !== null && !ISO.test(q.zuletzt ?? '')) errs.push(`${at}: zuletzt muss ISO-Datum oder null sein`);
    if (!k.zugangArt[q.zugang?.art]) errs.push(`${at}: zugang.art unbekannt`);
    if (!k.erreichbar[q.zugang?.erreichbar]) errs.push(`${at}: zugang.erreichbar unbekannt`);
    for (const u of q.urls ?? []) if (!/^https?:\/\//.test(u)) errs.push(`${at}: URL ohne http(s): ${u}`);
    const v = q.vektoren;
    if (!v || v.q?.length !== k.vektoren.length || v.q.some((n) => !Number.isInteger(n) || n < 1 || n > 5)) errs.push(`${at}: vektoren.q braucht ${k.vektoren.length} Ganzzahlen 1–5`);
    if (!k.basis[v?.basis]) errs.push(`${at}: vektoren.basis unbekannt`);
    if (!Array.isArray(q.verlauf) || !q.verlauf.length) errs.push(`${at}: verlauf braucht mindestens einen Eintrag`);
    for (const e of q.verlauf ?? []) if (!ISO.test(e.datum ?? '') || !e.notiz) errs.push(`${at}: verlauf-Eintrag braucht datum (ISO) und notiz`);
    if (q.verlauf?.length && q.zuletzt && q.verlauf.some((e) => e.status && !statusIds.includes(e.status))) errs.push(`${at}: verlauf.status unbekannt`);
    if (doseIds) for (const d of q.ertrag?.dosen ?? []) if (!doseIds.has(d)) errs.push(`${at}: ertrag.dosen „${d}“ ist keine Dose`);
    if (graveIds) for (const g of q.ertrag?.graeber ?? []) if (!graveIds.has(g)) errs.push(`${at}: ertrag.graeber „${g}“ ist kein Grab`);
  }
  for (const t of data.typen) if (!/^[A-Z]$/.test(t.id) || !t.titel) errs.push(`Typ „${t.id}“: Buchstabe und Titel nötig`);
  return errs;
}

export function refIds() {
  const { dosen, discarded } = readDataIds();
  return { doseIds: new Set(readDoseFiles().concat(dosen)), graveIds: new Set(discarded) };
}

// --- Schreiboperationen (von scripts/quellen.mjs und `bib apply` gemeinsam genutzt) ----------------------
//
// Reine Funktionen auf dem geladenen Register: sie verändern `data` im Speicher und werfen BibError.
// Speichern und Markdown-Erzeugung machen die Aufrufer.

const findQuelle = (data, id, field = 'id') => {
  const q = data.quellen.find((x) => x.id === id);
  if (!q) {
    const nah = data.quellen.filter((x) => x.id.includes(String(id ?? '').split('-')[0])).map((x) => x.id).slice(0, 5);
    throw new BibError({ code: 'NOT_FOUND', field, message: `Unbekannte Quelle „${id}“. Ähnliche: ${nah.join(', ') || '–'}` });
  }
  return q;
};

const qArray = (data, q, field = 'q') => {
  const n = data.katalog.vektoren.length;
  const a = Array.isArray(q) ? q.map(Number) : String(q).split(',').map((x) => Number(x.trim()));
  if (a.length !== n || a.some((x) => !Number.isInteger(x) || x < 1 || x > 5)) {
    throw new BibError({ code: 'VALUE_INVALID', field, message: `${field} braucht ${n} Ganzzahlen 1–5 (Q1–Q6)` });
  }
  return a;
};

/** Regel 1 des Registers: `durchsucht`/`erschöpft` nur mit selbst gelesener Seite. */
const regel1 = (q, field) => {
  if ((q.status === 'durchsucht' || q.status === 'erschöpft') && q.evidenz !== 'seite') {
    throw new BibError({ code: 'RULE_VIOLATION', field, message: `status=${q.status} verlangt evidenz=seite (Regel 1: nur hochsetzen, wenn selbst gelesen)` });
  }
};

/** Bucht einen Fund bei einer bestehenden Quelle. `strict` erzwingt Regel 1 (apply); die CLI `quellen log` bleibt wie bisher. */
export function logQuelle(data, o, { strict = false, heute = isoToday() } = {}) {
  const q = findQuelle(data, o.id);
  if (!o.note) throw new BibError({ code: 'FIELD_REQUIRED', field: 'note', message: 'note ist Pflicht (was wurde gefunden?)' });
  const datum = o.datum ?? heute;
  if (o.status) q.status = o.status;
  if (o.evidenz) q.evidenz = o.evidenz;
  if (o.erreichbar) q.zugang.erreichbar = o.erreichbar;
  if (o.wie) q.zugang.wie = o.wie;
  if (o.art) q.zugang.art = o.art;
  for (const u of o.urls ?? []) if (!q.urls.includes(u)) q.urls.push(u);
  for (const [flag, key] of [['dose', 'dosen'], ['grab', 'graeber'], ['kandidat', 'kandidaten']]) {
    q.ertrag[key] ??= [];
    for (const id of o[flag] ?? []) if (!q.ertrag[key].includes(id)) q.ertrag[key].push(id);
  }
  if (o.wv) q.wiedervorlage = o.wv;
  q.zuletzt = datum;
  if (o.status) q.statusNotiz = '';
  if (strict && (o.status || o.evidenz)) regel1(q, 'status');
  q.verlauf.push({ datum, agent: o.agent ?? 'bibliothekar', runde: o.runde ?? '', notiz: o.note, ...(o.status ? { status: q.status } : {}), ...(o.planId ? { planId: o.planId } : {}) });
  return q;
}

export function rateQuelle(data, o, { heute = isoToday() } = {}) {
  const q = findQuelle(data, o.id);
  if (o.q === undefined) throw new BibError({ code: 'FIELD_REQUIRED', field: 'q', message: 'q (Q1–Q6) ist Pflicht' });
  q.vektoren = { q: qArray(data, o.q), basis: o.basis ?? 'bibliothekar', datum: heute };
  q.verlauf.push({ datum: heute, agent: o.agent ?? 'bibliothekar', runde: o.runde ?? '', notiz: `Vektoren bewertet [${q.vektoren.q.join(' ')}]${o.note ? ': ' + o.note : ''}`, ...(o.planId ? { planId: o.planId } : {}) });
  return q;
}

export function addQuelle(data, o, { strict = false, heute = isoToday() } = {}) {
  for (const r of ['id', 'name', 'typ', 'kategorie', 'enthaelt']) {
    if (!o[r]) throw new BibError({ code: 'FIELD_REQUIRED', field: r, message: `${r} ist Pflicht` });
  }
  if (data.quellen.some((q) => q.id === o.id)) throw new BibError({ code: 'DUPLICATE', field: 'id', message: `id „${o.id}“ existiert schon — mit „log“ ergänzen` });
  const datum = o.datum ?? heute;
  const status = o.status ?? 'offen';
  const q = {
    id: o.id, name: o.name, typ: o.typ, kategorie: o.kategorie,
    rollen: o.rollen?.length ? o.rollen : ['ideenquelle'], tags: o.tags ?? [], urls: o.urls ?? [],
    zugang: { art: o.art ?? 'web', erreichbar: o.erreichbar ?? 'unbekannt', wie: o.wie ?? '' },
    enthaelt: o.enthaelt, fokus: o.fokus ?? '', status, statusNotiz: '', evidenz: o.evidenz ?? 'unbekannt',
    zuletzt: status === 'offen' ? null : datum, ...(o.wv ? { wiedervorlage: o.wv } : {}),
    ertrag: { dosen: o.dose ?? [], graeber: o.grab ?? [], kandidaten: o.kandidat ?? [] },
    vektoren: { q: o.q !== undefined ? qArray(data, o.q) : [3, 5, 3, 3, 4, 3], basis: o.q !== undefined ? o.basis ?? 'bibliothekar' : 'auto', datum: heute },
    verlauf: [{ datum, agent: o.agent ?? 'bibliothekar', runde: o.runde ?? '', notiz: o.note ?? 'Neu ins Register aufgenommen.', status, ...(o.planId ? { planId: o.planId } : {}) }],
  };
  if (strict) regel1(q, 'status');
  data.quellen.push(q);
  return q;
}

/** Findet Quellen, deren URLs zur gegebenen passen (gleiche Adresse > gleicher Pfadpräfix > gleicher Host). */
export function matchUrl(data, url) {
  const norm = (u) => {
    try {
      const x = new URL(u);
      return { host: x.hostname.replace(/^www\./, '').toLowerCase(), path: x.pathname.replace(/\/+$/, '') };
    } catch { return null; }
  };
  const t = norm(url);
  if (!t) throw new BibError({ code: 'VALUE_INVALID', field: 'url', message: `Keine gültige URL: ${url}` });
  const treffer = [];
  for (const q of data.quellen) {
    let best = 0;
    let via = '';
    for (const u of q.urls ?? []) {
      const n = norm(u);
      if (!n || n.host !== t.host) continue;
      const s = n.path === t.path ? 3 : n.path === '' ? 1 : t.path.startsWith(n.path + '/') || n.path.startsWith(t.path + '/') ? 2 : 0.5;
      if (s > best) { best = s; via = u; }
    }
    if (best) treffer.push({ id: q.id, name: q.name, matchedUrl: via, score: best, kind: best === 3 ? 'exakt' : best === 2 ? 'pfad' : 'host' });
  }
  return treffer.sort((a, b) => b.score - a.score);
}

// --- Auswertung ---------------------------------------------------------------
const count = (list, fn) => list.reduce((m, x) => ((m[fn(x)] = (m[fn(x)] ?? 0) + 1), m), {});

export function stats(data) {
  const qs = data.quellen;
  const avg = data.katalog.vektoren.map((_, i) => +(qs.reduce((a, q) => a + q.vektoren.q[i], 0) / qs.length).toFixed(2));
  const dosen = new Set(qs.flatMap((q) => q.ertrag.dosen));
  return {
    gesamt: qs.length,
    status: count(qs, (q) => q.status),
    kategorie: count(qs, (q) => q.kategorie),
    typ: count(qs, (q) => q.typ),
    evidenz: count(qs, (q) => q.evidenz),
    zugang: count(qs, (q) => q.zugang.erreichbar),
    vektorenBasis: count(qs, (q) => q.vektoren.basis),
    mittelVektoren: avg,
    dosenMitQuelle: dosen.size,
  };
}

/** Nächste-Quelle-Empfehlung: viel Restpotenzial, gut erreichbar, frei, ergiebig. */
export function empfehlung(q) {
  const [q1, q2, q3, q4, q5, q6] = q.vektoren.q;
  return q2 * 3 + q3 * 2 + q5 * 2 + q1 * 2 + q4 + q6 * 0.5;
}

// --- Markdown -----------------------------------------------------------------
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();
const de = (d) => (d ? d.split('-').reverse().join('.') : '–');

export function renderMarkdown(data) {
  const k = data.katalog;
  const st = stats(data);
  const L = [];
  L.push('# Amélie — Quellen');
  L.push('');
  L.push('> **Diese Datei wird erzeugt.** Wahrheit ist das Register `src/data/quellen.json` (ein Objekt pro Quelle: Typ, Kategorie, Zugang, Inhalt, Status, Ertrag, Verlauf, Vektoren Q1–Q6).');
  L.push('> Ändern nur über `npm run quellen -- …` (Bibliothekar), danach `npm run quellen -- md`. Handbuch: `06-suche/amelie-quellen-register.md`.');
  L.push('');
  L.push('Runde 2 hat gezeigt: Überlebende Ideen kommen aus Primärquellen, nicht aus Brainstorming. Diese Liste sagt, **wo** gegraben wird, und hält fest, **was schon durchgegraben ist**.');
  L.push('');
  L.push('**Status:** ' + k.status.map((s) => `\`${s.id}\` (${s.hint})`).join(' · '));
  L.push('');
  L.push(`**Bestand:** ${st.gesamt} Quellen · ` + k.status.map((s) => `${st.status[s.id] ?? 0} ${s.id}`).join(' · ') + ` · Evidenz: ${st.evidenz.seite ?? 0} gelesen, ${st.evidenz.schnipsel ?? 0} nur Schnipsel, ${st.evidenz.unbekannt ?? 0} unbekannt.`);
  L.push('');
  L.push('**Vektoren Q1–Q6** (1–5, Summe /30): ' + k.vektoren.map((v) => `${v.code} ${v.labelDe}`).join(' · ') + '. `auto` = aus Status/Evidenz/Ertrag abgeleitet, noch nicht bewertet.');
  L.push('');
  L.push(START);
  for (const t of data.typen) {
    const qs = data.quellen.filter((q) => q.typ === t.id);
    if (!qs.length) continue;
    L.push('');
    L.push(`## Typ ${t.id} — ${t.titel}`);
    L.push('');
    if (t.muster) L.push(`*${t.muster.replace(/^\*+|\*+$/g, '')}*`, '');
    if (t.hinweis) L.push(`**${t.hinweis.replace(/^\*+|\*+$/g, '')}**`, '');
    L.push('| Quelle | Enthält / Fokus | Zugang | Status | Zuletzt | Ertrag | Q |');
    L.push('|---|---|---|---|---|---|---|');
    for (const q of qs) {
      const inhalt = [q.enthaelt, q.fokus && `**Fokus:** ${q.fokus}`].filter(Boolean).join(' — ') + (q.evidenz === 'schnipsel' ? ' *[Schnipsel]*' : '');
      const zug = `${k.zugangArt[q.zugang.art]}${['teilweise', 'gesperrt'].includes(q.zugang.erreichbar) ? ` (${q.zugang.erreichbar})` : ''}${q.zugang.wie ? ': ' + q.zugang.wie : ''}`;
      const ertrag = [...q.ertrag.dosen.map((d) => `Dose \`${d}\``), ...q.ertrag.graeber.map((g) => `Grab \`${g}\``), ...(q.ertrag.kandidaten ?? []).map((c) => `Kandidat \`${c}\``)].join(', ') || '–';
      const stat = `\`${q.status}\`${q.statusNotiz ? ' — ' + q.statusNotiz : ''}`;
      const letzte = q.verlauf.filter((e) => e.agent !== 'migration').at(-1);
      const notiz = letzte ? ` *(${de(letzte.datum)}: ${letzte.notiz})*` : '';
      L.push(`| **${cell(q.name)}** \`${q.id}\` | ${cell(inhalt)} | ${cell(zug)} | ${cell(stat + notiz)} | ${de(q.zuletzt)}${q.wiedervorlage ? ` (WV ${q.wiedervorlage})` : ''} | ${cell(ertrag)} | ${scoreOf(q)}${q.vektoren.basis === 'auto' ? '*' : ''} |`);
    }
    if (t.suchstring) L.push('', `**Suchstring:** ${t.suchstring.replace(/^\*+Suchstring:\*+\s*/, '')}`);
  }
  L.push('');
  L.push(END);
  L.push('');
  L.push('## Nicht mehr als Quelle nutzen');
  L.push('');
  for (const n of data.nichtNutzen) L.push(`- ${n}`);
  L.push('');
  return L.join('\n');
}

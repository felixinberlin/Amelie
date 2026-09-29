// Operationen eines Plans (`bib apply`) und das Schema, das sie beschreibt.
//
// Eine Operation ist ein Objekt { op: "grave.add", … }. Jede läuft auf einem geladenen Zustand im Speicher
// (`loadState`), wirft BibError bei Regelverstoß und meldet, welche Speicher sie verändert hat (`state.dirty`).
// Geschrieben wird nichts hier; das macht die Engine (bib-apply.mjs) erst, wenn der ganze Plan gültig ist.

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BibError, EXIT, ERROR_CODES } from './bib-errors.mjs';
import { REL, readJson, readText, loadActors } from './bib-store.mjs';
import { addQuelle, logQuelle, rateQuelle, validate as validateQuellen } from './quellen-lib.mjs';
import {
  GRAB_FELDER, URTEILE, buildProtokollFelder, insertProtokollRow, orderGrab, readEnum, validateGrab,
} from './bibliothek-lib.mjs';

const VECTOR_KEYS = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'];
const MAX_DELTA = 2;

// ---------------------------------------------------------------- Zustand

export function loadState(root) {
  return {
    root,
    quellen: readJson(root, REL.quellen, { quellen: [], katalog: {}, typen: [] }),
    graeber: readJson(root, REL.graeber, []),
    protokoll: readText(root, REL.protokoll) ?? '',
    doseVectors: readJson(root, REL.doseVectors, {}),
    candidateVectors: readJson(root, REL.candidateVectors, {}),
    vectorLog: readJson(root, REL.vectorLog, []),
    dirty: new Set(),
  };
}

/** Ids der Dosen: Markdown-Dossiers und die Einträge in dosen.ts (falls vorhanden). */
export function doseIdsOf(root) {
  const ids = new Set();
  const dir = join(root, '05-dosen');
  if (existsSync(dir)) for (const f of readdirSync(dir)) if (f.endsWith('.md') && !f.startsWith('_')) ids.add(f.replace(/\.md$/, ''));
  const ts = readText(root, 'src/data/dosen.ts');
  if (ts) {
    const start = ts.indexOf('export const DOSEN_DATA');
    const end = ts.indexOf('export const DISCARDED_DATA');
    for (const m of ts.slice(start, end === -1 ? undefined : end).matchAll(/^ {4}id: '([^']+)'/gm)) ids.add(m[1]);
  }
  return ids;
}

const graveIdsOf = (state) => new Set(state.graeber.map((g) => g.id));

// ---------------------------------------------------------------- Hilfen

const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
const need = (op, fields) => {
  for (const f of fields) if (isEmpty(op[f])) throw new BibError({ code: 'FIELD_REQUIRED', field: f, message: `${f} ist Pflicht` });
};
const arrayOf = (op, fields) => {
  for (const f of fields) if (op[f] !== undefined && !Array.isArray(op[f])) throw new BibError({ code: 'VALUE_INVALID', field: f, message: `${f} muss eine Liste sein` });
};

const camel = (flag) => flag.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
/** Fehler der älteren Hilfsfunktionen (Text mit --flag) in BibError mit passendem Feld übersetzen. */
const wrap = (fn) => {
  try { return fn(); } catch (e) {
    if (e instanceof BibError) throw e;
    const m = /--([a-z][a-z-]*)/.exec(e.message);
    throw new BibError({ code: 'VALUE_INVALID', field: m ? camel(m[1]) : '', message: e.message.replace(/--([a-z-]+)/g, (_, f) => camel(f)) });
  }
};

/** Prüft die eine berührte Quelle gegen die Registerregeln (Katalogwerte, Ertragsverweise), mit den Gräbern dieses Plans. */
function checkSource(state, q, doseIds) {
  const errs = validateQuellen(
    { katalog: state.quellen.katalog, typen: state.quellen.typen, quellen: [q] },
    { doseIds, graveIds: graveIdsOf(state) },
  );
  if (errs.length) throw new BibError({ code: 'VALUE_INVALID', field: 'source', message: errs.join('; ') });
}

const prov = (ctx) => ({ agent: ctx.agent, runde: ctx.runde, planId: ctx.planId });

// ---------------------------------------------------------------- Operationen

const SOURCE_ADD_FIELDS = ['id', 'name', 'typ', 'kategorie', 'enthaelt', 'fokus', 'tags', 'rollen', 'urls', 'status', 'evidenz', 'art', 'erreichbar', 'wie', 'q', 'basis', 'dose', 'grab', 'kandidat', 'wv', 'datum', 'note'];
const SOURCE_LOG_FIELDS = ['id', 'note', 'status', 'evidenz', 'erreichbar', 'wie', 'art', 'urls', 'dose', 'grab', 'kandidat', 'wv', 'datum'];

export const OPERATIONS = {
  'source.add': {
    required: ['id', 'name', 'typ', 'kategorie', 'enthaelt'],
    optional: SOURCE_ADD_FIELDS.filter((f) => !['id', 'name', 'typ', 'kategorie', 'enthaelt'].includes(f)),
    run(state, op, ctx) {
      need(op, ['id', 'name', 'typ', 'kategorie', 'enthaelt']);
      arrayOf(op, ['tags', 'rollen', 'urls', 'dose', 'grab', 'kandidat']);
      const q = addQuelle(state.quellen, { ...op, ...prov(ctx) }, { strict: true, heute: ctx.heute });
      checkSource(state, q, ctx.doseIds);
      state.dirty.add('quellen');
      return { target: q.id, detail: `Quelle aufgenommen (${q.status})` };
    },
  },
  'source.log': {
    required: ['id', 'note'],
    optional: SOURCE_LOG_FIELDS.filter((f) => !['id', 'note'].includes(f)),
    run(state, op, ctx) {
      need(op, ['id', 'note']);
      arrayOf(op, ['urls', 'dose', 'grab', 'kandidat']);
      const q = logQuelle(state.quellen, { ...op, ...prov(ctx) }, { strict: true, heute: ctx.heute });
      checkSource(state, q, ctx.doseIds);
      state.dirty.add('quellen');
      return { target: q.id, detail: `gebucht → ${q.status}, ${q.verlauf.length} Verlaufseinträge` };
    },
  },
  'source.rate': {
    required: ['id', 'q'],
    optional: ['basis', 'note'],
    run(state, op, ctx) {
      need(op, ['id', 'q']);
      const q = rateQuelle(state.quellen, { ...op, ...prov(ctx) }, { heute: ctx.heute });
      state.dirty.add('quellen');
      return { target: q.id, detail: `bewertet ${q.vektoren.q.join(' ')}` };
    },
  },
  'grave.add': {
    required: ['grave'],
    optional: [],
    describe: 'grave = Totenschein-Objekt (Felder: siehe graves.fields im Schema)',
    run(state, op, ctx) {
      need(op, ['grave']);
      const g = op.grave;
      if (typeof g !== 'object' || Array.isArray(g)) throw new BibError({ code: 'VALUE_INVALID', field: 'grave', message: 'grave muss ein Objekt sein' });
      const errs = validateGrab(g, { graeber: state.graeber, doseIds: [...ctx.doseIds], root: state.root, enums: graveEnums(state.root) });
      if (errs.length) throw new BibError({ code: 'VALUE_INVALID', field: 'grave', message: errs.join('; ') });
      state.graeber.push(orderGrab(g));
      state.dirty.add('graeber');
      return { target: g.id, detail: `begraben (${g.cause}/${g.killer})` };
    },
  },
  'protokoll.add': {
    required: ['runde', 'titel', 'urteil', 'beleg', 'evidenz', 'method', 'pruefenAb'],
    optional: ['id', 'was', 'nr', 'datum', 'neuerAbschnitt'],
    run(state, op) {
      need(op, ['runde', 'titel', 'urteil', 'beleg', 'evidenz', 'method', 'pruefenAb']);
      const felder = wrap(() => buildProtokollFelder(op));
      const { text } = wrap(() => insertProtokollRow(state.protokoll, { runde: op.runde, felder, neuerAbschnitt: op.neuerAbschnitt }));
      state.protokoll = text;
      state.dirty.add('protokoll');
      return { target: op.id ?? op.titel, detail: `Zeile in „${op.runde}“ (${op.urteil})` };
    },
  },
  'vector.set': {
    required: ['kind', 'id', 'set', 'evidence'],
    optional: ['expect', 'reason'],
    describe: 'set = {V1: 3, …} (nur V1–V7, 1–5, |Δ| ≤ 2 je Vektor); expect = {V1: 4, …} Vorbedingung auf den heutigen Wert; V8 (Fun) ist nie änderbar',
    run(state, op, ctx) {
      need(op, ['kind', 'id', 'set', 'evidence']);
      if (!['dose', 'candidate'].includes(op.kind)) throw new BibError({ code: 'VALUE_INVALID', field: 'kind', message: 'kind muss dose oder candidate sein' });
      if (typeof op.evidence !== 'string' || op.evidence.trim().length < 10) throw new BibError({ code: 'RULE_VIOLATION', field: 'evidence', message: 'evidence ist Pflicht (mindestens ein Satz: woran die Änderung hängt)' });
      if (typeof op.set !== 'object' || Array.isArray(op.set)) throw new BibError({ code: 'VALUE_INVALID', field: 'set', message: 'set muss ein Objekt {V1: 3, …} sein' });
      const store = op.kind === 'dose' ? state.doseVectors : state.candidateVectors;
      const entry = store[op.id];
      if (!entry) throw new BibError({ code: 'NOT_FOUND', field: 'id', message: `${op.kind} „${op.id}“ hat keinen Vektor-Eintrag` });
      const changes = [];
      for (const [key, to] of Object.entries(op.set)) {
        const k = key.toUpperCase();
        if (k === 'V8' || k === 'FUN') throw new BibError({ code: 'RULE_VIOLATION', field: `set.${key}`, message: 'V8 (Fun) wird nie über einen Plan geändert (Fun kompensiert nie; nur der Reviewer bewertet es)' });
        const i = VECTOR_KEYS.indexOf(k);
        if (i < 0) throw new BibError({ code: 'VALUE_INVALID', field: `set.${key}`, message: `Unbekannter Vektor „${key}“ (erlaubt: ${VECTOR_KEYS.join(' ')})` });
        if (!Number.isInteger(to) || to < 1 || to > 5) throw new BibError({ code: 'VALUE_INVALID', field: `set.${key}`, message: `${key} muss eine Ganzzahl 1–5 sein` });
        const from = entry.v[i];
        if (op.expect && op.expect[key] !== undefined && op.expect[key] !== from) {
          throw new BibError({ code: 'PRECONDITION_FAILED', field: `expect.${key}`, message: `${op.id} ${key} ist jetzt ${from}, erwartet war ${op.expect[key]} (Speicher hat sich seit der Beurteilung geändert)` });
        }
        if (Math.abs(to - from) > MAX_DELTA) throw new BibError({ code: 'RULE_VIOLATION', field: `set.${key}`, message: `${key} ${from} → ${to} überschreitet |Δ| ≤ ${MAX_DELTA}` });
        if (to !== from) changes.push({ key: k, i, from, to });
      }
      for (const key of Object.keys(op.expect ?? {})) {
        if (!(key in op.set) && VECTOR_KEYS.includes(key.toUpperCase()) && entry.v[VECTOR_KEYS.indexOf(key.toUpperCase())] !== op.expect[key]) {
          throw new BibError({ code: 'PRECONDITION_FAILED', field: `expect.${key}`, message: `${op.id} ${key} ist jetzt ${entry.v[VECTOR_KEYS.indexOf(key.toUpperCase())]}, erwartet war ${op.expect[key]}` });
        }
      }
      for (const c of changes) {
        entry.v[c.i] = c.to;
        state.vectorLog.push({
          at: ctx.jetzt, planId: ctx.planId, agent: ctx.agent, actor: ctx.actor, runde: ctx.runde,
          kind: op.kind, id: op.id, vector: c.key, from: c.from, to: c.to, evidence: op.evidence, ...(op.reason ? { reason: op.reason } : {}),
        });
      }
      if (changes.length) state.dirty.add(op.kind === 'dose' ? 'doseVectors' : 'candidateVectors').add('vectorLog');
      return { target: op.id, detail: changes.length ? changes.map((c) => `${c.key} ${c.from} → ${c.to}`).join(', ') : 'unverändert (bereits auf dem Zielwert)' };
    },
  },
};

const enumCache = new Map();
function graveEnums(root) {
  const types = join(root, 'src/types.ts');
  const key = types;
  if (!enumCache.has(key)) {
    enumCache.set(key, { cause: readEnum('Todesursache', types), killer: readEnum('Killerart', types), foundBy: readEnum('Fundweg', types), origin: readEnum('Herkunft', types), stage: readEnum('Stadium', types) });
  }
  return enumCache.get(key);
}

// ---------------------------------------------------------------- Schema

const keysOf = (o) => Object.keys(o ?? {});

/** Alles, was der Lab-Bibliothekar sonst abschreiben müsste: erlaubte Werte, Regeln, Operationen, Codes. */
export function buildSchema(root) {
  const q = readJson(root, REL.quellen, { katalog: {}, typen: [] });
  const k = q.katalog ?? {};
  const actors = loadActors(root);
  let grave = {};
  try {
    const e = graveEnums(root);
    grave = { ...e, fields: GRAB_FELDER, required: GRAB_FELDER.filter((f) => f !== 'titleKey' && f !== 'nachruf') };
  } catch { /* Fixture ohne types.ts */ }
  return {
    schemaVersion: 1,
    sources: {
      typ: (q.typen ?? []).map((t) => ({ id: t.id, titel: t.titel })),
      kategorie: keysOf(k.kategorien),
      status: (k.status ?? []).map((s) => s.id),
      evidenz: keysOf(k.evidenz),
      zugangArt: keysOf(k.zugangArt),
      erreichbar: keysOf(k.erreichbar),
      rollen: keysOf(k.rollen),
      basis: keysOf(k.basis),
      vektoren: (k.vektoren ?? []).map((v) => ({ code: v.code, label: v.labelDe })),
      rules: ['status durchsucht/erschöpft nur mit evidenz=seite (Regel 1)', 'ertrag.grab/dose müssen existieren (Grab zuerst)'],
    },
    graves: grave,
    protokoll: {
      urteile: URTEILE,
      evidenz: ['seite', 'schnipsel'],
      pruefenAbFormat: 'MM/JJJJ oder –',
      tables: ['4 Spalten (Idee | Urteil | Beleg | Prüfen ab)', '8 Spalten (# | Idee | Methode | Urteil | Beleg | Evidenz | Geprüft | Prüfen ab)'],
    },
    vectors: { keys: VECTOR_KEYS, forbidden: ['V8'], min: 1, max: 5, maxDelta: MAX_DELTA, evidenceRequired: true, kinds: ['dose', 'candidate'] },
    plan: {
      required: ['plan_id', 'ops'],
      optional: ['actor', 'agent', 'runde', 'human_accepted', 'expect'],
      expect: { hashes: 'Objekt {pfad: "sha256:…"}; Hashes liefert `bib state`. Weicht eine Datei ab, wird nichts geschrieben.' },
      idempotency: 'key (Standard: plan_id) wird im Ledger 06-suche/bib-ledger.json geführt; erneutes Anwenden meldet already_applied',
    },
    operations: Object.fromEntries(Object.entries(OPERATIONS).map(([name, o]) => [name, { required: o.required, optional: o.optional, ...(o.describe ? { describe: o.describe } : {}) }])),
    actors: Object.fromEntries(Object.entries(actors.actors ?? {}).map(([n, a]) => [n, { allow: a.allow ?? [], conditional: a.conditional ?? {} }])),
    exitCodes: EXIT,
    errorCodes: ERROR_CODES,
    errorShape: { code: 'string (stabil)', field: 'string (Pfad im Plan, z. B. ops[2].grave)', message: 'string (Klartext, kann sich ändern)', op: 'number (Index der Operation, falls zutreffend)' },
    stores: Object.fromEntries(['quellen', 'graeber', 'protokoll', 'doseVectors', 'candidateVectors', 'vectorLog', 'ledger', 'audit', 'actors'].map((s) => [s, REL[s]])),
  };
}

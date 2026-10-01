// Datenverträge der Crew: Jeder Agent beendet seinen Bericht mit EINEM ```json-Block, den das Programm prüft.
//
// Vorbild ist der Schema-Validator im Schwesterprojekt (Amélie-lab): Form zuerst (Felder, Typen, erlaubte Werte),
// er schreibt nie etwas um und ruft kein Modell. Bricht ein Bericht den Vertrag, bekommt der Agent die Fehlerliste
// für EINEN Reparaturaufruf (ohne neue Suchen). Scheitert auch der, bleibt der Lauf mit den Fehlern erhalten.

export const URTEILE = ['frei', 'verengt', 'unklar', 'besetzt'];
export const EVIDENZ = ['seite', 'schnipsel'];

/** Letzter ```json-Block eines Textes, geparst. { data } oder { error }. */
export function extractJson(text) {
  const s = String(text ?? '');
  const blocks = [...s.matchAll(/```json\s*\n([\s\S]*?)\n```/g)];
  if (!blocks.length) return { error: 'Kein json-Block (```json … ```) am Ende des Berichts gefunden.' };
  try {
    return { data: JSON.parse(blocks[blocks.length - 1][1]) };
  } catch (e) {
    return { error: `Der json-Block ist kein gültiges JSON: ${e.message}` };
  }
}

/** Bericht ohne den JSON-Block (für Menschen). */
export function stripJson(text) {
  const s = String(text ?? '');
  const idx = s.lastIndexOf('```json');
  return (idx >= 0 ? s.slice(0, idx) : s).trim();
}

// ---------------------------------------------------------------- kleine Prüfhelfer

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const SLUG = /^[a-z0-9][a-z0-9-]{1,79}$/;

function need(errors, obj, field, path, test = isStr, hint = 'Text') {
  if (!test(obj?.[field])) errors.push(`${path}.${field}: fehlt oder ist kein ${hint}`);
}
function oneOf(errors, obj, field, path, values) {
  if (!values.includes(obj?.[field])) errors.push(`${path}.${field}: „${obj?.[field]}“ ist nicht erlaubt (${values.join(' | ')})`);
}
function strList(errors, obj, field, path, { required = false } = {}) {
  const v = obj?.[field];
  if (v === undefined && !required) return;
  if (!Array.isArray(v) || !v.every((x) => typeof x === 'string')) errors.push(`${path}.${field}: muss eine Liste von Texten sein`);
}

// ---------------------------------------------------------------- Vertrag: Kandidaten (Scout, Inversion, Kollider)

/**
 * {
 *   "candidates": [{ "id", "title", "beschreibung", "quelle", "empfaenger", "urteil", "beleg", "evidenz", "restluecke", "urls"? }],
 *   "gelernt": ["…"], "naechstesMal": ["…"],
 *   "quellenmeldung": ["QUELLE … | …"]      // Zeilen im Format von 06-suche/amelie-quellen-register.md
 * }
 */
export function validateCandidates(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Wurzel: muss ein Objekt sein'];
  if (!Array.isArray(data.candidates)) errors.push('candidates: muss eine Liste sein (darf leer sein)');
  (data.candidates ?? []).forEach((c, i) => {
    const p = `candidates[${i}]`;
    if (!isStr(c?.id) || !SLUG.test(c.id)) errors.push(`${p}.id: muss ein Kurzname in Kleinbuchstaben mit Bindestrichen sein (z. B. „dop-scanner-stahl“)`);
    for (const f of ['title', 'beschreibung', 'empfaenger', 'beleg']) need(errors, c, f, p);
    oneOf(errors, c, 'urteil', p, URTEILE);
    oneOf(errors, c, 'evidenz', p, EVIDENZ);
    if (c?.urteil === 'frei' && c?.evidenz !== 'seite') errors.push(`${p}: „frei“ nur mit evidenz „seite“ (eine wirklich gelesene Seite)`);
    if (c?.urteil === 'verengt' && !isStr(c?.restluecke)) errors.push(`${p}.restluecke: bei „verengt“ Pflicht (die Restlücke in einem Satz)`);
    strList(errors, c, 'urls', p);
  });
  const ids = (data.candidates ?? []).map((c) => c?.id);
  const dup = ids.filter((id, i) => id && ids.indexOf(id) !== i);
  if (dup.length) errors.push(`candidates: doppelte id ${[...new Set(dup)].join(', ')}`);
  strList(errors, data, 'gelernt', 'Wurzel');
  strList(errors, data, 'naechstesMal', 'Wurzel');
  strList(errors, data, 'quellenmeldung', 'Wurzel');
  (data.quellenmeldung ?? []).forEach((l, i) => {
    if (typeof l === 'string' && !/^QUELLE\s/.test(l.trim())) errors.push(`quellenmeldung[${i}]: muss mit „QUELLE <id> |“ oder „QUELLE NEU: <Name> |“ beginnen`);
  });
  return errors;
}

export const CANDIDATES_SHAPE = `\`\`\`json
{
  "candidates": [
    {
      "id": "kurzname-in-kleinbuchstaben",
      "title": "Kurzname für Menschen",
      "beschreibung": "Ein Satz: was, für wen.",
      "quelle": "Woher die Idee kommt (Quelle, Typ) oder Rahmen/Zielsystem",
      "empfaenger": "Institution mit Mandat (oder: kein Empfänger gefunden)",
      "urteil": "frei | verengt | unklar | besetzt",
      "beleg": "Was gefunden wurde, mit URL",
      "evidenz": "seite | schnipsel",
      "restluecke": "Pflicht bei verengt, sonst leer",
      "urls": ["https://…"]
    }
  ],
  "gelernt": ["…"],
  "naechstesMal": ["…"],
  "quellenmeldung": ["QUELLE NEU: Name | typ=L | kategorie=referenzsammlung | enthaelt=… | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://… | note=…"]
}
\`\`\``;

// ---------------------------------------------------------------- Vertrag: Reviews (idea-reviewer)

export const TRIAGE = ['Dose Ready', 'Market Route', 'Needs Research', 'Baustein', 'Friedhof'];
export const DOSE_READY_GATE = 24;
const VKEYS = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8'];

let graveEnums = null;
/** Erlaubte Werte des Totenscheins aus src/types.ts (über die Bibliotheks-CLI, damit nichts auseinanderläuft). */
export async function loadGraveEnums() {
  if (!graveEnums) {
    const { readEnum } = await import('../bibliothek-lib.mjs');
    graveEnums = { cause: readEnum('Todesursache'), killer: readEnum('Killerart'), foundBy: readEnum('Fundweg') };
  }
  return graveEnums;
}
export function setGraveEnums(e) { graveEnums = e; }

/**
 * {
 *   "reviews": [{ "id", "title", "vectors": {V1…V8: 1–5}, "kern", "gesamt", "triage", "begruendung",
 *                 "gegenSuche"?, "dose"?: {empfaenger, ersterSchritt}, "market"?, "baustein"?,
 *                 "grab"?: {cause, killer, foundBy, resurrectIfDe, resurrectIfEn} }],
 *   "lehren": ["…"]
 * }
 */
export function validateReviews(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Wurzel: muss ein Objekt sein'];
  if (!Array.isArray(data.reviews)) errors.push('reviews: muss eine Liste sein');
  (data.reviews ?? []).forEach((r, i) => {
    const p = `reviews[${i}]`;
    if (!isStr(r?.id) || !SLUG.test(r.id)) errors.push(`${p}.id: Kurzname in Kleinbuchstaben mit Bindestrichen`);
    need(errors, r, 'title', p);
    need(errors, r, 'begruendung', p);
    const v = r?.vectors ?? {};
    for (const k of VKEYS) if (!Number.isInteger(v[k]) || v[k] < 1 || v[k] > 5) errors.push(`${p}.vectors.${k}: ganze Zahl 1–5`);
    const kern = VKEYS.slice(0, 7).reduce((a, k) => a + (Number(v[k]) || 0), 0);
    if (r?.kern !== kern) errors.push(`${p}.kern: muss die Summe V1–V7 sein (${kern}), nicht ${r?.kern}`);
    if (r?.gesamt !== kern + (Number(v.V8) || 0)) errors.push(`${p}.gesamt: muss kern + V8 sein (${kern + (Number(v.V8) || 0)})`);
    oneOf(errors, r, 'triage', p, TRIAGE);
    if (r?.triage === 'Dose Ready') {
      if (kern < DOSE_READY_GATE) errors.push(`${p}: „Dose Ready“ erst ab ${DOSE_READY_GATE}/35 (V8 zählt nicht), hier ${kern}`);
      need(errors, r, 'gegenSuche', p, isStr, 'Text (eigene, unabhängige Gegen-Suche mit URL)');
      need(errors, r?.dose ?? {}, 'empfaenger', `${p}.dose`);
      need(errors, r?.dose ?? {}, 'ersterSchritt', `${p}.dose`);
    }
    if (r?.triage === 'Market Route') need(errors, r, 'market', p, isStr, 'Text (5 Commercial Vectors)');
    if (r?.triage === 'Baustein') need(errors, r, 'baustein', p, isStr, 'Text (id der Dose, zu der es gehört)');
    if (r?.triage === 'Friedhof') {
      const g = r?.grab ?? {};
      const e = graveEnums;
      for (const f of ['cause', 'killer', 'foundBy']) {
        if (e) oneOf(errors, g, f, `${p}.grab`, e[f]);
        else need(errors, g, f, `${p}.grab`);
      }
      need(errors, g, 'resurrectIfDe', `${p}.grab`);
      need(errors, g, 'resurrectIfEn', `${p}.grab`);
    }
  });
  strList(errors, data, 'lehren', 'Wurzel');
  return errors;
}

export const REVIEWS_SHAPE = `\`\`\`json
{
  "reviews": [
    {
      "id": "kurzname-wie-im-eingang",
      "title": "Kurzname für Menschen",
      "vectors": { "V1": 3, "V2": 3, "V3": 3, "V4": 3, "V5": 3, "V6": 3, "V7": 3, "V8": 2 },
      "kern": 21,
      "gesamt": 23,
      "triage": "Dose Ready | Market Route | Needs Research | Baustein | Friedhof",
      "begruendung": "Zwei, drei Sätze: warum diese Scores, warum dieses Urteil.",
      "gegenSuche": "Pflicht bei Dose Ready: eigene Gegen-Suche mit URL",
      "dose": { "empfaenger": "nur bei Dose Ready", "ersterSchritt": "nur bei Dose Ready" },
      "market": "nur bei Market Route: WTP, Time-to-Ship, Channel, Monetization, Defensibility",
      "baustein": "nur bei Baustein: id der Dose",
      "grab": { "cause": "nur bei Friedhof", "killer": "…", "foundBy": "…", "resurrectIfDe": "Wann darf das Grab geöffnet werden?", "resurrectIfEn": "What new evidence would resurrect it?" }
    }
  ],
  "lehren": ["…"]
}
\`\`\`
Felder, die zum Urteil nicht passen, lässt du weg. kern = Summe V1–V7, gesamt = kern + V8. Erlaubte Werte für grab: \`run_cli bib grab werte\`.`;

// ---------------------------------------------------------------- Register

export const CONTRACTS = {
  candidates: { validate: validateCandidates, shape: CANDIDATES_SHAPE },
  reviews: { validate: validateReviews, shape: REVIEWS_SHAPE, prepare: loadGraveEnums },
};

/** Prüft einen Bericht gegen einen Vertrag. { ok, data, errors } */
export function checkReport(contractName, text) {
  const contract = CONTRACTS[contractName];
  if (!contract) return { ok: false, data: null, errors: [`Vertrag „${contractName}“ unbekannt`] };
  const { data, error } = extractJson(text);
  if (error) return { ok: false, data: null, errors: [error] };
  const errors = contract.validate(data);
  return { ok: errors.length === 0, data, errors };
}

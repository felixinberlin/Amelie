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

// ---------------------------------------------------------------- Register

export const CONTRACTS = {
  candidates: { validate: validateCandidates, shape: CANDIDATES_SHAPE },
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

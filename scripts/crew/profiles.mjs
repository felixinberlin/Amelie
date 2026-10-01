// Profile der Crew: was jeder Agent von der Kommandozeile bekommt und was er abliefert.
//
// Ein Profil legt fest:
//   contract     Datenvertrag des JSON-Blocks (scripts/crew/contracts.mjs)
//   buildTask    Auftrag aus --task / --thema / --input
//   summarize    eine Zeile für `npm run agent -- runs`
//   writes       der eine Schreibweg, den die Agentendefinition erlaubt (nur mit Freigabe, siehe crew-write.mjs)
//   mockReply    feste Antwort für --mock (ganze Kette ohne Netz und ohne Kosten)
//
// Neue Agenten kommen einzeln hinzu, jeweils mit Tests (src/utils/crew.test.ts).

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { LOGS, renderLogSection } from './write.mjs';
import { validateLibrarian } from './contracts.mjs';
import { ACTOR, PLAYBOOK, buildPlan, dryRun, renderRetro } from './librarian.mjs';
import { runsDir } from './runs.mjs';
import { makeBundleProfiles } from './profiles-bundle.mjs';

const TRIAGE_ORDER = ['Dose Ready', 'Market Route', 'Needs Research', 'Baustein', 'Friedhof'];
const count = (list, key, values) => values.map((v) => `${list.filter((x) => x?.[key] === v).length} ${v}`).join(' / ');


// ---------------------------------------------------------------- Beweispflicht: das Programm stuft herab, was nicht belegt ist

const SEARCHED = new Set(['web_search', 'web_fetch']);
const callsOf = (toolLog, names) => (toolLog ?? []).filter((t) => names.has(t.name)).length;
const PLACEHOLDER_RECIPIENT = /^(felix|félix|ich|niemand|unbekannt|tbd|n\/a|–|-)\b/i;

/** Engines: ohne Suchaufruf im Lauf gibt es kein frei/verengt; „seite“ nur mit mindestens einem web_fetch. */
export function downgradeCandidates(data, { toolLog }) {
  const notes = [];
  const searched = callsOf(toolLog, SEARCHED);
  const fetched = callsOf(toolLog, new Set(['web_fetch']));
  for (const c of data.candidates) {
    if (!searched && (c.urteil === 'frei' || c.urteil === 'verengt')) {
      notes.push(`${c.id}: ${c.urteil} → unklar (kein web_search/web_fetch im Lauf, Existenzprüfung fehlt)`);
      c.urteil = 'unklar'; c.evidenz = 'schnipsel';
      c.restluecke = `${c.restluecke ? `${c.restluecke} ` : ''}[ungeprüft: Lauf ohne Suchaufruf]`.trim();
    } else if (c.evidenz === 'seite' && !fetched) {
      notes.push(`${c.id}: Evidenz seite → schnipsel (kein web_fetch im Lauf)`);
      c.evidenz = 'schnipsel';
      if (c.urteil === 'frei') c.urteil = 'unklar';
    }
  }
  return notes;
}

/** Reviewer: Dose Ready nur mit eigener Gegen-Suche (Aufruf im Lauf + URL) und einem benannten Empfänger. */
export function downgradeReviews(data, { toolLog }) {
  const notes = [];
  const searched = callsOf(toolLog, SEARCHED);
  for (const r of data.reviews) {
    if (r.triage !== 'Dose Ready') continue;
    const why = [];
    if (!searched) why.push('kein web_search/web_fetch im Lauf');
    if (!/https?:\/\//.test(String(r.gegenSuche ?? ''))) why.push('Gegen-Suche ohne URL');
    if (PLACEHOLDER_RECIPIENT.test(String(r.dose?.empfaenger ?? '').trim())) why.push(`Empfänger „${r.dose?.empfaenger}“ ist keine Stelle`);
    if (!why.length) continue;
    notes.push(`${r.id}: Dose Ready → Needs Research (${why.join('; ')})`);
    r.triage = 'Needs Research';
    r.herabgestuft = why;
    r.begruendung = `[Vom Programm herabgestuft: ${why.join('; ')}] ${r.begruendung ?? ''}`.trim();
  }
  return notes;
}

// ---------------------------------------------------------------- ideen-scout

const scoutTask = ({ task, thema }) => {
  if (task && task.trim()) return task.trim();
  if (!thema) throw new Error('ideen-scout braucht --thema "<Thema>" oder --task / --task-file.');
  return `Teamrunde, Engine 1 (Primärquellen). Thema: ${thema}

Arbeitsreihenfolge:
1. Pflichtlektüre laut deiner Definition (letzte Retro und Besetzungsatlas in 06-suche/amelie-suchplaybook.md, Skill amelie-ideenrunde).
2. Eine offene Quelle passend zum Thema wählen (run_cli quellen next; quellen show <id>).
3. 4–6 Ideen aus der Quelle ableiten, jede mit run_cli bib find --stamm <Wortstämme> gegen den Bestand halten.
4. Je Idee höchstens 4 Suchen, Empfänger zuerst; Prämisse vor Urteil. Ob es den Empfänger als Stelle wirklich gibt und wo er sitzt, prüft places_find (Information, nicht zitierfähig; Beleg per web_fetch).
Liefere Bericht + JSON-Block (Vertrag „candidates“).`;
};

const scoutMock = () => `## Kandidaten (Mock)

| Idee | Urteil | Beleg |
|---|---|---|
| Mock-Idee A | verengt | [Schnipsel] https://example.org/a |
| Mock-Idee B | besetzt | [Seite] https://example.org/b |

## Gelernt / Nächstes Mal
- Mock-Lauf ohne Netz.

\`\`\`json
{
  "candidates": [
    { "id": "mock-idee-a", "title": "Mock-Idee A", "beschreibung": "Testidee für die Kette.", "quelle": "Mock (Typ L)", "empfaenger": "Beispielamt (Mandat: Test)", "urteil": "verengt", "beleg": "Ähnliches Werkzeug ohne Teil X, https://example.org/a", "evidenz": "schnipsel", "restluecke": "Teil X fehlt.", "urls": ["https://example.org/a"] },
    { "id": "mock-idee-b", "title": "Mock-Idee B", "beschreibung": "Zweite Testidee.", "quelle": "Mock (Typ L)", "empfaenger": "kein Empfänger gefunden", "urteil": "besetzt", "beleg": "Gibt es als App, https://example.org/b", "evidenz": "seite", "restluecke": "", "urls": ["https://example.org/b"] }
  ],
  "gelernt": ["Mock-Lauf ohne Netz."],
  "naechstesMal": ["Echten Lauf mit Modell starten."],
  "quellenmeldung": ["QUELLE NEU: Beispielquelle Mock | typ=L | kategorie=referenzsammlung | enthaelt=Testinhalt | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://example.org/a | note=Mock-Meldung."]
}
\`\`\``;

const engineSummary = (d) => `${d.candidates.length} Ideen: ${count(d.candidates, 'urteil', ['frei', 'verengt', 'unklar', 'besetzt'])}`;

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const candidateTable = (d) => [
  '| Idee | Beschreibung | Herkunft | Empfänger | Urteil | Beleg | Restlücke |',
  '|---|---|---|---|---|---|---|',
  ...d.candidates.map((c) => `| ${cell(c.title)} (\`${c.id}\`) | ${cell(c.beschreibung)} | ${cell(c.quelle)} | ${cell(c.empfaenger)} | \`${c.urteil}\` | ${cell(c.beleg)} [${c.evidenz === 'seite' ? 'Seite' : 'Schnipsel'}] | ${cell(c.restluecke) || '–'} |`),
].join('\n');

/** Mock-Antwort einer Engine: zwei Kandidaten, eine Quellenmeldung, gültig nach Vertrag „candidates“. */
const engineMock = (prefix, herkunft) => () => scoutMock()
  .replaceAll('mock-idee-', `${prefix}-idee-`)
  .replaceAll('Mock-Idee', `${herkunft} Mock-Idee`)
  .replaceAll('"Mock (Typ L)"', `"${herkunft} (Mock)"`);

// ---------------------------------------------------------------- Eingänge aus früheren Läufen

/** Alle Kandidaten aus Engine-Läufen, mit Herkunft; gleiche id aus mehreren Läufen = Doppelfund. */
export function candidatesFromInputs(inputs) {
  const byId = new Map();
  for (const run of inputs ?? []) {
    if (run?.contract !== 'candidates' || run?.status !== 'ok') continue;
    for (const c of run.data?.candidates ?? []) {
      const prev = byId.get(c.id);
      if (prev) prev.foundBy.push(run.agent);
      else byId.set(c.id, { ...c, foundBy: [run.agent], run_id: run.run_id });
    }
  }
  return [...byId.values()].map((c) => ({ ...c, doppelfund: c.foundBy.length > 1 }));
}

// ---------------------------------------------------------------- idea-reviewer

const reviewTask = ({ task, inputs }) => {
  const cands = candidatesFromInputs(inputs).filter((c) => c.urteil !== 'besetzt');
  if (!cands.length && !(task && task.trim())) throw new Error('idea-reviewer braucht --input <Engine-Lauf> (mit frei/verengt/unklar-Kandidaten) oder --task.');
  const list = cands.map((c) => `- ${c.id}${c.doppelfund ? ` (DOPPELFUND: ${c.foundBy.join(' + ')})` : ''}: ${JSON.stringify({ title: c.title, beschreibung: c.beschreibung, quelle: c.quelle, empfaenger: c.empfaenger, urteil: c.urteil, beleg: c.beleg, evidenz: c.evidenz, restluecke: c.restluecke })}`).join('\n');
  return `${task?.trim() ? `${task.trim()}\n\n` : ''}${cands.length ? `Konsolidierte Kandidatenliste (Existenzprüfung der Engines; besetzte Ideen gehen direkt an den Bibliothekar):
${list}

Bewerte jeden Kandidaten über die 8 Vektoren nach der Rubrik (load_skill idea-reviewer, Referenz vector-rubrics). Prüfe Baustein-Nähe zu bestehenden Dosen (run_cli bib find …). Dose Ready nur ab 24/35, mit eigener, unabhängiger Gegen-Suche (web_search aufrufen, URL in gegenSuche) und einer benannten Stelle als Empfänger (nie „Felix“, nie eine Kategorie wie „Kommunen“). Ohne Suchaufruf in diesem Lauf stuft das Programm Dose Ready herab. Für Friedhof einen vollständigen Totenschein (Werte: run_cli bib grab werte).` : ''}`;
};

const reviewMock = ({ inputs } = {}) => {
  const cands = candidatesFromInputs(inputs).filter((c) => c.urteil !== 'besetzt');
  const list = cands.length ? cands : [{ id: 'mock-idee-a', title: 'Mock-Idee A' }];
  const reviews = list.map((c) => ({
    id: c.id, title: c.title,
    vectors: { V1: 3, V2: 3, V3: 2, V4: 3, V5: 2, V6: 3, V7: 2, V8: 2 }, kern: 18, gesamt: 20,
    triage: 'Friedhof', begruendung: 'Mock: Restlücke zu dünn, Empfänger ohne Mandat.',
    grab: { cause: 'beim-empfaenger', killer: 'gemeinnuetzig', foundBy: 'empfaenger', resurrectIfDe: 'Wenn der Empfänger die Lücke selbst benennt.', resurrectIfEn: 'If the recipient names the gap itself.' },
  }));
  return `## Review (Mock)\n\n${reviews.map((r) => `- ${r.title}: ${r.kern}/35 → ${r.triage}`).join('\n')}\n\n\`\`\`json\n${JSON.stringify({ reviews, lehren: ['Mock-Lauf ohne Netz.'] }, null, 2)}\n\`\`\``;
};

const reviewTable = (d) => [
  '| Kandidat | V1 | V2 | V3 | V4 | V5 | V6 | V7 | Kern /35 | V8 | Gesamt /40 | Triage |',
  '|---|---|---|---|---|---|---|---|---|---|---|---|',
  ...d.reviews.map((r) => `| ${r.title} (\`${r.id}\`) | ${['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'].map((k) => r.vectors[k]).join(' | ')} | **${r.kern}** | ${r.vectors.V8} | ${r.gesamt} | ${r.triage} |`),
].join('\n');

// ---------------------------------------------------------------- bibliothekar

const PLAN_CHECK_TOOL = {
  name: 'plan_check',
  description: 'Prüft deinen JSON-Entwurf (gleiche Form wie dein Abschluss-Block) ohne zu schreiben: Form, Quellenmeldung, dann Trockenlauf von bib apply gegen das echte Gedächtnis. Liefert „sauber“ oder die Fehlerliste. So oft aufrufen, bis er sauber ist.',
  input_schema: { type: 'object', properties: { draft: { type: 'object', description: 'Dein Entwurf: runde, einleitung, protokoll, graeber, quellenmeldung, retro, offen' } }, required: ['draft'] },
};

const opCount = (ops) => Object.entries(ops.reduce((a, o) => ({ ...a, [o.op]: (a[o.op] ?? 0) + 1 }), {})).map(([k, v]) => `${v} ${k}`).join(', ');

/** Reviews aus Reviewer-Läufen, nach id. */
export function reviewsFromInputs(inputs) {
  const m = new Map();
  for (const run of inputs ?? []) if (run?.contract === 'reviews' && run?.status === 'ok') for (const r of run.data?.reviews ?? []) m.set(r.id, { ...r, run_id: run.run_id });
  return m;
}

function librarianTask({ task, thema, inputs }) {
  const cands = candidatesFromInputs(inputs);
  const reviews = reviewsFromInputs(inputs);
  if (!cands.length && !reviews.size && !(task && task.trim())) throw new Error('bibliothekar braucht --input <Läufe> (Engines und Reviewer) oder --task.');
  const day = new Date().toISOString().slice(0, 10).split('-').reverse().join('.');
  const engines = (inputs ?? []).filter((r) => r?.contract === 'candidates' && r.status === 'ok');
  const lines = (label, list) => (list.length ? `${label}:\n${list.map((x) => `- ${x}`).join('\n')}\n` : '');
  const kandidaten = cands.map((c) => {
    const r = reviews.get(c.id);
    return `- ${c.id} [${c.foundBy.join(' + ')}${c.doppelfund ? ', DOPPELFUND' : ''}]: ${JSON.stringify({ title: c.title, beschreibung: c.beschreibung, quelle: c.quelle, empfaenger: c.empfaenger, urteil: c.urteil, beleg: c.beleg, evidenz: c.evidenz, restluecke: c.restluecke, urls: c.urls })}${r ? `\n  REVIEW: ${JSON.stringify({ kern: r.kern, gesamt: r.gesamt, triage: r.triage, begruendung: r.begruendung, grab: r.grab, dose: r.dose, baustein: r.baustein })}` : ''}`;
  }).join('\n');
  return `${task?.trim() ? `${task.trim()}\n\n` : ''}${cands.length || reviews.size ? `Buche die Runde ${thema ? `„${thema}“ ` : ''}ins Gedächtnis. Vorschlag für den Abschnittstitel: „${thema ? `Teamrunde ${thema}` : 'Teamrunde'} ${day}“ (prüfe mit run_cli bib protokoll stats --abschnitte, ob es ihn schon gibt).

Eingänge: ${(inputs ?? []).map((r) => `${r.run_id} (${r.agent}, ${r.status})`).join(', ')}

Kandidaten (Doppelfunde einmal buchen, alle Engines im Beleg nennen):
${kandidaten || '(keine)'}

${lines('Quellenmeldungen der Engines (deduplizieren, Werte prüfen, Erträge auf Gräber dieses Plans setzen)', engines.flatMap((r) => r.data.quellenmeldung ?? []))}
${lines('Gelernt (Engines)', engines.flatMap((r) => r.data.gelernt ?? []))}
${lines('Nächstes Mal (Engines)', engines.flatMap((r) => r.data.naechstesMal ?? []))}
${lines('Lehren (Reviewer)', [...(inputs ?? [])].filter((r) => r?.contract === 'reviews' && r.status === 'ok').flatMap((r) => r.data.lehren ?? []))}
Aufgaben:
1. Je Kandidat eine Protokollzeile (method nach Engine: ideen-scout → ideenrunde, bisoziations-kollider → bisoziation, inversions-agent → inversion). Vorher run_cli bib find --stamm gegen Wiedergänger; ein Wiedergänger wird als Nachprüfung im Beleg markiert, nicht doppelt gebucht. Prüfen ab: 12 Monate nach heute.
2. Gräber: jede „besetzt“-Idee, die noch nicht begraben ist, und jede Review mit Triage „Friedhof“ (dessen Totenschein übernehmen), mit vollständigem Totenschein auf Deutsch und Englisch.
3. Quellenmeldungen zusammenführen.
4. Retro für das Playbook (mindestens ein konkreter „Nächstes Mal“-Punkt) und offene Entscheidungen für Félix.
5. Entwurf mit plan_check prüfen, bis er sauber ist. Dann Bericht + JSON-Block.` : ''}`;
}

function librarianMock({ inputs } = {}) {
  const cands = candidatesFromInputs(inputs);
  const reviews = reviewsFromInputs(inputs);
  const list = cands.length ? cands : [{ id: 'mock-idee-b', title: 'Mock-Idee B', urteil: 'besetzt', beleg: 'Gibt es als App, https://example.org/b', evidenz: 'seite', foundBy: ['ideen-scout'], beschreibung: 'Zweite Testidee.' }];
  const day = new Date().toISOString().slice(0, 10);
  const method = (a) => ({ 'ideen-scout': 'ideenrunde', 'bisoziations-kollider': 'bisoziation', 'inversions-agent': 'inversion' }[a] ?? 'ideenrunde');
  const protokoll = list.map((c) => ({ titel: c.title, id: c.id, urteil: c.urteil, beleg: `${c.foundBy.join(' + ')}: ${c.beleg}${reviews.get(c.id) ? ` → nach Review: ${reviews.get(c.id).triage} (${reviews.get(c.id).kern}/35)` : ''}`, evidenz: c.evidenz, method: method(c.foundBy[0]), pruefenAb: '10/2027' }));
  const dead = list.filter((c) => c.urteil === 'besetzt' || reviews.get(c.id)?.triage === 'Friedhof');
  const graeber = dead.map((c) => {
    const g = reviews.get(c.id)?.grab ?? { cause: 'gebaut', killer: 'kommerziell', foundBy: 'deutsch', resurrectIfDe: 'Wenn es das Werkzeug nicht mehr gibt.', resurrectIfEn: 'If the existing tool disappears.' };
    return { id: c.id, title: c.title, originalIdeaDe: c.beschreibung ?? c.title, originalIdeaEn: `Mock idea: ${c.title}`, whyDiscardedDe: c.beleg, whyDiscardedEn: 'Mock: already exists.', lessonDe: 'Mock-Lehre.', lessonEn: 'Mock lesson.', domain: 'Mock', evidence: ['https://example.org/b'], cause: g.cause, killer: g.killer, foundBy: g.foundBy, origin: 'quelle', stage: 'kandidat', bornIn: 'Mock-Runde (Kommandozeile)', diedOn: day, resurrectIfDe: g.resurrectIfDe, resurrectIfEn: g.resurrectIfEn };
  });
  const data = {
    runde: `Mock-Runde Kommandozeile ${day}`,
    einleitung: `Mock-Lauf der Crew ohne Netz (${list.length} Ideen).`,
    protokoll, graeber,
    quellenmeldung: [],
    retro: { erledigt: ['Mock-Kette gelaufen.'], gelernt: [], fehler: [], naechstesMal: ['Echten Lauf starten.'], atlas: [] },
    offen: [],
  };
  return `## Buchung (Mock)\n\n${protokoll.length} Protokollzeilen, ${graeber.length} Gräber.\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
}

// ---------------------------------------------------------------- Register

export const PROFILES = {
  'ideen-scout': {
    role: 'Engine 1: leitet Ideen aus Primärquellen ab und prüft, ob es sie schon gibt.',
    contract: 'candidates',
    postProcess: downgradeCandidates,
    buildTask: scoutTask,
    summarize: engineSummary,
    writes: null, // schreibt laut Definition nichts; Ergebnisse gehen an Reviewer und Bibliothekar
    mockReply: scoutMock,
  },
  'idea-reviewer': {
    role: 'Prüfer: bewertet frei/verengt/unklar-Kandidaten über 8 Vektoren und vergibt ein Triage-Urteil.',
    contract: 'reviews',
    postProcess: downgradeReviews,
    buildTask: reviewTask,
    summarize: (d) => `${d.reviews.length} Reviews: ${TRIAGE_ORDER.map((t) => `${d.reviews.filter((r) => r.triage === t).length} ${t}`).filter((s) => !s.startsWith('0 ')).join(' / ') || 'keine'}`,
    writes: {
      describe: `${LOGS.classification} (neuer Abschnitt, nur mit --write)`,
      files: [LOGS.classification],
      build: (record) => [{ kind: 'append', file: LOGS.classification, text: renderLogSection({ record, title: `Review ${record.thema ? `„${record.thema}“ ` : ''}per Kommandozeile`, table: reviewTable(record.data) }) }],
    },
    mockReply: reviewMock,
  },
  'inversions-agent': {
    role: 'Engine 3: invertiert ein reguliertes oder finanziertes System in ein unbebautes Gemeingut-Werkzeug und prüft die Kandidaten.',
    contract: 'candidates',
    postProcess: downgradeCandidates,
    buildTask: ({ task, thema }) => {
      if (task && task.trim()) return task.trim();
      if (!thema) throw new Error('inversions-agent braucht --thema "<Thema>" oder --task / --task-file.');
      return `Teamrunde, Engine 3 (Inversion). Thema: ${thema}

Arbeitsreihenfolge:
1. load_skill asymmetric-inversion (SKILL.md und die references, die die Methode verlangt); letzte Retro und Atlas in 06-suche/amelie-suchplaybook.md; Kopf und letzte Läufe von 06-suche/amelie-inversions-log.md.
2. Ein reales Zielsystem zum Thema wählen (Norm, Gesetz, Gebührenwerk, Förderprogramm, Bewertungsmonopol), möglichst aus dem Register (run_cli quellen next / quellen show). Asymmetrie-Karte: wer zahlt, wer trägt die Last, wo enden die Daten, was ist der blinde Fleck.
3. Mit einem der fünf Operatoren invertieren, 3–5 Kandidaten. Jeden mit run_cli bib find --stamm gegen den Bestand halten.
4. Je Kandidat höchstens 4 Suchen, Empfänger mit Mandat zuerst; „Beweismittel vor Funktion“: zählt das Ergebnis im Zielverfahren überhaupt?
Im Feld „quelle“ jedes Kandidaten: Zielsystem + Operator. Liefere Bericht + JSON-Block (Vertrag „candidates“).`;
    },
    summarize: engineSummary,
    writes: {
      describe: `${LOGS.inversion} (neuer Lauf-Abschnitt, nur mit --write)`,
      files: [LOGS.inversion],
      build: (record) => [{ kind: 'append', file: LOGS.inversion, text: renderLogSection({ record, title: `Inversions-Lauf ${record.thema ? `„${record.thema}“ ` : ''}per Kommandozeile`, table: candidateTable(record.data) }) }],
    },
    mockReply: engineMock('inv', 'Zielsystem × OP-1'),
  },
  'bisoziations-kollider': {
    role: 'Engine 2: kollidiert einen quellengestützten Rahmen A mit einem fernen Rahmen B und prüft die Ideen, die eine echte Lücke öffnen.',
    contract: 'candidates',
    postProcess: downgradeCandidates,
    buildTask: ({ task, thema }) => {
      if (task && task.trim()) return task.trim();
      if (!thema) throw new Error('bisoziations-kollider braucht --thema "<Thema>" oder --task / --task-file.');
      return `Teamrunde, Engine 2 (Bisoziation). Thema: ${thema}

Arbeitsreihenfolge:
1. load_skill lacunar-bisociation (SKILL.md und references/lenses.md); letzte Retro und Atlas in 06-suche/amelie-suchplaybook.md; Modus-Liste und letzte Läufe in 06-suche/amelie-bisoziation-log.md (was schon oft kam, ist verbraucht).
2. Rahmen A: eine reale Quelle mit Reibung zum Thema, möglichst aus dem Register (run_cli quellen next / quellen show). Rahmen B: ein ferner Bereich (Distanz ≥ 3).
3. Kollidieren, nur Ideen behalten, die eine echte Lücke öffnen; 3–5 Kandidaten. Jeden mit run_cli bib find --stamm gegen den Bestand halten.
4. Je Kandidat höchstens 4 Suchen, Empfänger mit Mandat zuerst; Prämisse vor Urteil.
Im Feld „quelle“ jedes Kandidaten: Rahmen A × Rahmen B, Distanz. Liefere Bericht + JSON-Block (Vertrag „candidates“).`;
    },
    summarize: engineSummary,
    writes: {
      describe: `${LOGS.bisoziation} (neuer Lauf-Abschnitt, nur mit --write)`,
      files: [LOGS.bisoziation],
      build: (record) => [{ kind: 'append', file: LOGS.bisoziation, text: renderLogSection({ record, title: `Bisoziations-Lauf ${record.thema ? `„${record.thema}“ ` : ''}per Kommandozeile`, table: candidateTable(record.data) }) }],
    },
    mockReply: engineMock('bis', 'Rahmen A × Rahmen B, Distanz 4'),
  },
  bibliothekar: {
    role: 'Gedächtnis: bucht Protokollzeilen, Gräber und Quellen als einen Plan über bib apply und schreibt die Retro ins Playbook.',
    contract: 'librarian',
    repairRounds: 3,
    extraTools: ['plan_check'],
    toolDefs: { plan_check: PLAN_CHECK_TOOL },
    handlers: ({ root }) => ({
      async plan_check(args) {
        const draft = args?.draft;
        if (!draft || typeof draft !== 'object') return 'Fehler: draft fehlt (dein JSON-Entwurf als Objekt).';
        const form = validateLibrarian(draft);
        if (form.length) return `Formfehler:\n- ${form.join('\n- ')}`;
        const { plan, fehler } = buildPlan(draft, { root, planId: 'crew-plan-check' });
        if (fehler.length) return `Quellenmeldung fehlerhaft:\n- ${fehler.join('\n- ')}`;
        const r = dryRun({ root, plan });
        return r.errors.length ? `Trockenlauf abgelehnt (${plan.ops.length} Operationen):\n- ${r.errors.join('\n- ')}` : `Trockenlauf sauber: ${plan.ops.length} Operationen (${opCount(plan.ops)}).`;
      },
    }),
    buildTask: librarianTask,
    postValidate: (data, { root, record }) => {
      const { plan, fehler } = buildPlan(data, { root, planId: `crew-${record.run_id}` });
      if (fehler.length) return fehler.map((f) => `quellenmeldung: ${f}`);
      return dryRun({ root, plan }).errors;
    },
    summarize: (d) => `Plan: ${d.protokoll?.length ?? 0} Protokollzeilen, ${d.graeber?.length ?? 0} Gräber, ${d.quellenmeldung?.length ?? 0} Quellenmeldungen`,
    writes: {
      describe: `bib apply als Akteur ${ACTOR} (Protokoll, Gräber, Quellen; alles oder nichts) + Retro-Abschnitt in ${PLAYBOOK}, nur mit --write`,
      files: [PLAYBOOK],
      build: (record, { root }) => {
        const { plan } = buildPlan(record.data, { root, planId: `crew-${record.run_id}` });
        const planFile = join(runsDir(root), 'bibliothekar', `${record.run_id}.plan.json`);
        mkdirSync(dirname(planFile), { recursive: true });
        writeFileSync(planFile, `${JSON.stringify(plan, null, 2)}\n`);
        const retro = renderRetro(record.data, record);
        return [
          { kind: 'bib-apply', planFile, plan_id: plan.plan_id, actor: ACTOR },
          ...(retro ? [{ kind: 'append', file: PLAYBOOK, text: retro }] : []),
        ];
      },
    },
    mockReply: librarianMock,
  },
};

// Bauer-Rollen (Datei-Pakete mit Schranke), siehe profiles-bundle.mjs
Object.assign(PROFILES, makeBundleProfiles({ candidatesFromInputs, reviewsFromInputs }));

export const CREW = Object.keys(PROFILES);

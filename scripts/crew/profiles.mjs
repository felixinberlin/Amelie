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

import { LOGS, renderLogSection } from './write.mjs';

const TRIAGE_ORDER = ['Dose Ready', 'Market Route', 'Needs Research', 'Baustein', 'Friedhof'];
const count = (list, key, values) => values.map((v) => `${list.filter((x) => x?.[key] === v).length} ${v}`).join(' / ');

// ---------------------------------------------------------------- ideen-scout

const scoutTask = ({ task, thema }) => {
  if (task && task.trim()) return task.trim();
  if (!thema) throw new Error('ideen-scout braucht --thema "<Thema>" oder --task / --task-file.');
  return `Teamrunde, Engine 1 (Primärquellen). Thema: ${thema}

Arbeitsreihenfolge:
1. Pflichtlektüre laut deiner Definition (letzte Retro und Besetzungsatlas in 06-suche/amelie-suchplaybook.md, Skill amelie-ideenrunde).
2. Eine offene Quelle passend zum Thema wählen (run_cli quellen next; quellen show <id>).
3. 4–6 Ideen aus der Quelle ableiten, jede mit run_cli bib find --stamm <Wortstämme> gegen den Bestand halten.
4. Je Idee höchstens 4 Suchen, Empfänger zuerst; Prämisse vor Urteil.
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

Bewerte jeden Kandidaten über die 8 Vektoren nach der Rubrik (load_skill idea-reviewer, Referenz vector-rubrics). Prüfe Baustein-Nähe zu bestehenden Dosen (run_cli bib find …). Dose Ready nur ab 24/35 und mit eigener, unabhängiger Gegen-Suche. Für Friedhof einen vollständigen Totenschein (Werte: run_cli bib grab werte).` : ''}`;
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

// ---------------------------------------------------------------- Register

export const PROFILES = {
  'ideen-scout': {
    role: 'Engine 1: leitet Ideen aus Primärquellen ab und prüft, ob es sie schon gibt.',
    contract: 'candidates',
    buildTask: scoutTask,
    summarize: engineSummary,
    writes: null, // schreibt laut Definition nichts; Ergebnisse gehen an Reviewer und Bibliothekar
    mockReply: scoutMock,
  },
  'idea-reviewer': {
    role: 'Prüfer: bewertet frei/verengt/unklar-Kandidaten über 8 Vektoren und vergibt ein Triage-Urteil.',
    contract: 'reviews',
    buildTask: reviewTask,
    summarize: (d) => `${d.reviews.length} Reviews: ${TRIAGE_ORDER.map((t) => `${d.reviews.filter((r) => r.triage === t).length} ${t}`).filter((s) => !s.startsWith('0 ')).join(' / ') || 'keine'}`,
    writes: {
      describe: `${LOGS.classification} (neuer Abschnitt, nur mit --write)`,
      files: [LOGS.classification],
      build: (record) => [{ kind: 'append', file: LOGS.classification, text: renderLogSection({ record, title: `Review ${record.thema ? `„${record.thema}“ ` : ''}per Kommandozeile`, table: reviewTable(record.data) }) }],
    },
    mockReply: reviewMock,
  },
};

export const CREW = Object.keys(PROFILES);

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
};

export const CREW = Object.keys(PROFILES);

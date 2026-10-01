# Testlauf der Crew-Verdrahtung: Diagramme und Ablauf

Zweck: lokal prüfen, ob alle Teile der Kommandozeilen-Crew zusammenarbeiten (Skripte, Agentendefinitionen, Skills, Werkzeuge, Gedächtnis). Thema des Testlaufs: **Starkregen und Überflutungsvorsorge im Quartier** (im Protokoll nur 1 Treffer, `verengt`, also dünnes Feld).

## 1. Gesamtbild: wer ruft wen

```mermaid
flowchart TD
  H([Mensch: npm run teamrunde -- Thema]) --> TR[scripts/crew/teamrunde.sh]
  TR --> VF[bib vorflug<br/>git fetch, fremde Branches, Netztest]
  TR --> AR[scripts/agent-run.mjs<br/>ein Agent = ein Lauf]

  subgraph Profil[scripts/crew/profiles.mjs]
    PR[Profil je Agent<br/>Auftrag, Vertrag, Schreibweg, Mock]
  end
  AR --> PR
  AR --> DEF[.claude/agents/*.md<br/>Agentendefinition]
  AR --> MC[models.local.json<br/>Modell je Agent]
  MC --> AD[Adapter<br/>Claude direkt, Vertex, Gemini]

  AR --> KIT[scripts/agent-kit.mjs<br/>Werkzeugkasten]
  KIT --> T1[run_cli: nur Lesebefehle<br/>bib, quellen]
  KIT --> T2[read_file, search_repo]
  KIT --> T3[web_fetch, web_search]
  KIT --> T4[load_skill<br/>skills/ und .claude/skills/]
  KIT --> T5[call_agent<br/>Tiefe 1, max 3, nur lesend]

  AR --> CT[scripts/crew/contracts.mjs<br/>JSON-Block prüfen, 1 Reparaturaufruf]
  CT --> RUN[(06-suche/agent-runs/<br/>Lauf-Akte, git-ignoriert)]
```

## 2. Ablauf der Teamrunde

```mermaid
sequenceDiagram
  autonumber
  participant M as Mensch
  participant T as teamrunde.sh
  participant E as 3 Engines parallel
  participant G as merge.mjs
  participant R as idea-reviewer
  participant B as bibliothekar
  participant S as Gedächtnis

  M->>T: Thema (optional --mock, --write)
  T->>S: bib vorflug (lesen)
  T->>E: ideen-scout, bisoziations-kollider, inversions-agent
  E->>S: bib find, quellen next (lesen)
  E-->>T: Bericht + JSON candidates
  T->>G: Läufe zusammenlegen, Doppelfunde zählen (ohne Modell)
  G-->>T: Merge
  T->>R: frei und verengt prüfen, V1 bis V8
  R-->>T: JSON reviews (Dose Ready, Needs Research, Friedhof)
  T->>B: Plan bauen (plan_check im Trockenlauf)
  alt ohne --write
    B-->>M: nur Plan, nichts geschrieben
  else mit --write
    B->>S: bib apply (alles oder nichts), Retro im Playbook
    E->>S: je ein Abschnitt im eigenen Log
    R->>S: Abschnitt in amelie-classification-log.md
    T->>S: bib abschluss (export:data, lint, test)
  end
```

## 3. Wer darf wohin schreiben

```mermaid
flowchart LR
  SC[ideen-scout] -->|nichts| X1[ ]
  KO[bisoziations-kollider] -->|--write| L2[amelie-bisoziation-log.md]
  IN[inversions-agent] -->|--write| L3[amelie-inversions-log.md]
  RV[idea-reviewer] -->|--write| L4[amelie-classification-log.md]
  BI[bibliothekar<br/>Akteur cli-bibliothekar] -->|bib apply| L5[Protokoll, Friedhof, Quellen]
  BI -->|Retro| L6[amelie-suchplaybook.md]
  style X1 fill:none,stroke:none
```

Packer, Demo-Bauer und Venture laufen weiter nur in Claude Code, nicht in dieser Kette.

## 4. Testlauf in Stufen (vom billigsten zum echten)

Vorbereitung (einmal):

```bash
export PATH="/home/felix/.nvm/versions/node/v26.3.1/bin:$PATH"
git fetch origin && git checkout claude/compassionate-wozniak-vky2x6 && git pull
npm install
cp scripts/model-compare/models.example.json scripts/model-compare/models.local.json   # Modell-Ids selbst eintragen
npm run bib -- vorflug --netz
```

| Stufe | Befehl | Prüft | Kosten |
|---|---|---|---|
| 0 | `npm test -- crew` und `npm run lint` | Verträge, Profile, Gedächtnis-Drift | 0 |
| 1 | `npm run agent -- list` | Profile und Schreibwege sichtbar | 0 |
| 2 | `npm run teamrunde -- "Starkregen und Überflutungsvorsorge im Quartier" --mock` | ganze Kette ohne Netz, schreibt nie | 0 |
| 3 | `npm run agent -- ideen-scout --thema "Starkregen und Überflutungsvorsorge im Quartier"` | ein echter Agent, Werkzeuge, Vertrag, Akte | klein |
| 4 | `npm run agent -- runs` und `npm run agent -- show latest:ideen-scout` | Akte lesen, JSON-Block, Tool-Aufrufe | 0 |
| 5 | `npm run teamrunde -- "Starkregen und Überflutungsvorsorge im Quartier"` | volle Kette, Trockenlauf des Bibliothekars | mittel |
| 6 | gleicher Befehl mit `--write` (erst nach Durchsicht von Stufe 5) | `bib apply`, Logs, `abschluss` | mittel |

Einzelne Teile testen: `--engines "ideen-scout"` begrenzt die Engines, `--no-delegate` (beim Lab-Bibliothekar) schaltet `call_agent` ab, `npm run agent -- write <run> --dry-run` zeigt den Schreibweg eines früheren Laufs.

## 5. Worauf du achten solltest (Abnahme)

- Jede Engine endet mit gültigem JSON-Block (Exit 0). Reparaturaufruf nötig = Prompt prüfen.
- In der Akte stehen echte `bib find`-Aufrufe vor jedem Urteil, Empfänger zuerst.
- Kein `frei` für etwas, das im Friedhof liegt (Kennzahl aus `npm run vergleich`).
- `merge` meldet Doppelfunde zwischen den Engines (erwartet bei dünnem Feld: wenige).
- Trockenlauf: `plan_check` des Bibliothekars grün, bevor `--write` kommt.
- Nach `--write`: `git status` zeigt nur Logs, Protokoll, Gräber, Quellen, Playbook; `npm run lint && npm test` grün.
- Bekannt offen: Claude-Adapter (direkt, Vertex) sind nie live gelaufen. Wenn Stufe 3 dort scheitert, ist das der erste Verdacht.

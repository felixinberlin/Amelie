# Agenten-Orchestrierung ausprobieren, ohne pleitezugehen
## Was ein Repo mit sieben Agenten über Schreibrechte, Doppelfunde und Rechenkosten verrät

*Von Félix und Claude · Berlin, 1. Oktober 2026 · Alle Inhalte CC0 (Public Domain)*

> Du brauchst keinen Investor, kein Team und keine Marke, um Agenten-Orchestrierung zu verstehen. Du brauchst ein Repo, das sie vormacht, und einen Befehl, der nichts kostet.

---

## 1. Warum dieser Artikel für dich ist, egal in welchem Stack

Du arbeitest in TYPO3, in Rails, in Go, in Data Engineering oder in der Cloud-Infrastruktur? Die Orchestrierung in diesem Repo hängt an keinem davon. Sie besteht aus Markdown-Dateien (`.claude/agents/`), ein paar Node-Skripten und einer Regel: **Viele Agenten dürfen lesen und vorschlagen, nur einer darf schreiben.** Das Thema der Runde ist austauschbar: bei uns sind es Ideen zum Verschenken, bei dir können es Migrationen, Code-Reviews, Testlücken oder Förderanträge sein.

Amélie ist ein Projekt, das Ideen an die Menschen verschenkt, die sie brauchen (Details in `README.md`). Dafür läuft eine Teamrunde: drei Entdeckungs-Engines parallel, ein Merge, ein unabhängiger Reviewer, ein Packer, ein Demo-Bauer, ein Bibliothekar. Sieben Subagenten, 44 verpackte Dosen, 141 begrabene Ideen. Die Zahlen sind weniger wichtig als das, was beim Bauen schiefging.

## 2. Sieben Lehren, jede mit einem Beleg aus dem Repo

**1. Ein Schreiber, viele Leser.** Die Agenten haben disjunkte Schreibrechte; das geteilte Gedächtnis (Prüfprotokoll, Gräber, Quellen) schreibt allein der Bibliothekar, und zwar über `bib apply` alles oder nichts, mit Snapshot, Journal, Rollback und Ledger. Warum: Zwei Sitzungen im selben Repo verdoppelten einmal die Suche am selben Thema. Vor jeder Runde gibt es deshalb einen Vorflug (`git fetch`, fremde Branches, offene PRs).

**2. Ohne Deduplizierung flutet Orchestrierung dich.** Automatische Batch-Läufe erzeugten über 100 Pull Requests, viele davon Stubs oder Duplikate. In zwei Triage-Runden wurden 92 geschlossen. Die Lehre: Plane die Zusammenführung vor dem Start, nicht danach. Bei uns heißt das Konvergenz-Merge, bei dir vielleicht ein Cluster-Lead je Thema.

**3. Der Reviewer darf nicht die Engine sein.** Die Entdeckungs-Engines bewerten ihre eigenen Funde zu wohlwollend. Ein unabhängiger Prüfer mit eigener Rubrik (acht Vektoren, ein Gate bei 24 von 35 Punkten) hält die Quote ehrlich: In mehreren Runden kam keine einzige Idee durch.

**4. Ein Format-Vertrag schlägt einen schönen Prompt.** In einer Testrunde lieferten drei von vier Berichten ihre Quellenmeldungen im falschen Format. Seitdem endet jeder Bericht der Crew-Agenten mit einem geprüften JSON-Block samt einem Reparaturaufruf, und geschrieben wird nur mit `--write`, vom Programm und nicht vom Modell. Bei der PR-Prüfung gilt zusätzlich: Ein ausgefallener Agent lehnt nie ab, er endet mit Exit-Code 3, statt ein Urteil zu simulieren.

**5. Mock-Modus zuerst.** Die ganze Kette läuft ohne Netz mit geskripteten Modellen und schreibt nie (`--mock`). Dadurch haben wir Fehler in der CLI gefunden, ohne einen Token zu verbrauchen, zum Beispiel einen Bibliotheksbefehl, der die falschen Rückgabefelder las und Gräber und Dosen immer ablehnte. Seitdem gibt es dafür einen Regressionstest über den echten CLI-Aufruf.

**6. Lint ist der beste Mitarbeiter.** Die Dossiers existieren doppelt (Markdown und Frontend-Daten). Statt zu hoffen, dass jemand daran denkt, prüft `npm run lint` auf Deckungsgleichheit, auf Protokoll-Abdeckung, auf Friedhof, Quellen und Diagramme. Agenten, die gegen eine Schranke laufen, werden schneller brauchbar als Agenten mit längerem Prompt.

**7. Die Prämisse vor dem Urteil.** Mehrere Ideen starben, weil ihre Grundannahme falsch war (eine Beseitigungspflicht, die es nicht gibt; eine Datenquelle, die nur den Ist-Stand liefert, nie den Vorgängerwert). Lass Agenten die Annahme prüfen, bevor sie bewerten. Das gilt für Code-Reviews genauso.

## 3. So startest du, ohne zu zahlen

Alles hier ist ausprobiert und läuft heute:

```bash
git clone https://github.com/felixinberlin/Amelie && cd Amelie && npm ci
npm run agent -- list                       # die Rollen und ihre Schreibrechte
npm run teamrunde -- "Holz" --mock          # ganze Kette ohne Netz, schreibt nie
```

Danach in dieser Reihenfolge:

1. **Ein günstiges Modell, nur Trockenlauf.** `scripts/model-compare/models.example.json` nach `models.local.json` kopieren, ein Modell eintragen (Gemini-Gratisstufe, ein kleines Claude-Modell, ein lokales). Ohne `--write` schreibt die Runde nichts; du liest die Akte unter `06-suche/agent-runs/`.
2. **Preise messen, nicht raten.** `npm run vergleich -- models|run|judge|score` lässt dieselbe Runde über mehrere Modelle laufen. Ehrlich gesagt: Die erste echte Messung steht bei uns noch aus, und die Preise in der Beispielkonfiguration sind Platzhalter. Prüfe sie gegen die Preisseite deines Anbieters.
3. **Eigene Rollen.** Kopiere eine Definition aus `.claude/agents/`, ändere Auftrag und Werkzeuge, lass sie über `npm run agent` laufen. Fang mit zwei Rollen an: ein Leser und ein Prüfer. Der Schreiber kommt zuletzt.

## 4. Wenn es doch Geld kostet: woher Credits kommen können

Wir haben das im Frontend (Recherche, Förderkompass, Reiter „KI-Credits & Runway“) und in `06-suche/amelie-ki-credits-und-runway.md` zusammengetragen. Die ehrliche Kurzfassung:

- **Gratis, sofort:** Gemini-API-Gratisstufe (Limits wechseln, nicht garantiert), Microsoft Founders Hub (Idea-Stufe, laut Berichten 1.000 $ Azure-Guthaben), Mistral-Gratisplan.
- **Open-Source-Programme:** Anthropic „Claude for Open Source“ gibt 6 Monate Max 20x, **keine API-Credits**. Achtung, viele Aggregatoren nennen 5.000 Sterne und eine Frist; die offiziellen Bedingungen nennen beides nicht. Dort stehen sechs Kriterien (zum Beispiel 100 gemergte PRs in fremden Repos in 12 Monaten oder 20 externe Mitwirkende), ein GitHub-Konto über zwei Jahre und eine OSI-Lizenz. Beiträge zu irgendeinem OSI-Projekt zählen, nicht nur zu deinem eigenen. OpenAIs Codex Open Source Fund nennt bis zu 25.000 $ API-Credits.
- **Firmenprogramme:** Anthropic für Startups gibt Credits nur mit Eigenkapital eines institutionellen Investors; Google Cloud hat eine Start-Stufe von 2.000 $ für Firmen unter 24 Monaten mit MVP. Als Einzelperson ohne Firma bist du dort nicht dabei.
- **Gemeinnützig:** Claude for Nonprofits und Google for Nonprofits setzen eine anerkannt gemeinnützige Organisation voraus.
- **Geld statt Credits:** Prototype Fund (bis 47.500 € für Einzelpersonen, Bewerbung bis 30.11.2026) und NLnet (Frist 3.11.2026). Beide wollen offene Lizenzen; NLnet verlangt, jede KI-Nutzung samt Prompts offenzulegen, und lehnt KI-generierte Projekte ab.

Die Evidenz ist überwiegend Suchschnipsel. Prüfe Betrag, Frist und Zulässigkeit auf der Primärseite, bevor du dich bewirbst, und blähe nie Kennzahlen auf: Die Anthropic-Bedingungen nennen das ausdrücklich als Widerrufsgrund.

## 5. Und das Einkommen?

Kein Fördertopf ersetzt laufende Aufträge. Egal ob du TYPO3, WordPress, Kubernetes oder Datenbanken kannst: Wartung, Migrationen, Audits und Unteraufträge sind der verlässlichste Runway. Viele Ökosysteme haben außerdem eigene Töpfe (die TYPO3 Association vergibt 2026 über ein Community Budget, die Sovereign Tech Agency und die PHP Foundation fördern Basistechnik). Suche das Gegenstück in deinem Stack.

## 6. Was wir nicht wissen

- Was eine Teamrunde mit welchem Modell wirklich kostet. Die Kostenzeile existiert, die echte Messung nicht.
- Ob die Claude-Adapter gegen die Live-APIs laufen; live gelaufen ist bisher nur Gemini über Vertex AI.
- Ob Orchestrierung bei dir mehr bringt als ein guter Agent mit einem Linter. Unser Eindruck: Der Gewinn kommt aus Schreibrechten, Verträgen und Prüfern, nicht aus der Zahl der Agenten.

---

*Die Orchestrierung ist CC0. Nimm sie, baue sie um, verschenke sie weiter. Dokumentation: `06-suche/amelie-kommandozeile.md`, Orchestrator-Skill: `skills/amelie-orchestrator/`.*

# Agent Postmortem Recorder — Nachprüfung 24.09.2026

**Ergebnis:** Der Satz der Dose „die Präskriptions-Hälfte ist unbesetzt" war falsch. Werkzeuge, die aus Session-Logs Regeln für `CLAUDE.md` machen, gibt es mehrfach, eines davon mit ~1,6k Sternen. Neues Verdikt: **nicht neu bauen, als PR an claude-reflect verschenken**. Der PR erledigt zwei Punkte aus dem *eigenen* Backlog des Repos, statt Wünsche draufzulegen.

Methode: vier Suchen, fünf Seiten gelesen, dazu `claude-reflect` geklont und an `main` 2c892ca (v3.2.0) gelesen: `CLAUDE.md`, `BACKLOG.md`, `commands/reflect.md`, `scripts/lib/reflect_utils.py`, Testsuite (322 grün).

## Wer die Präskriptions-Hälfte besetzt

| Projekt | Was es tut | Löschseite? |
|---|---|---|
| [claude-reflect](https://github.com/BayramAnnakov/claude-reflect) (Bayram Annakov, ~1,6k ★) | `UserPromptSubmit`-Hook erkennt Korrekturen (Regex, dann semantische Prüfung per `claude -p`), Queue pro Projekt, `/reflect` mit menschlicher Freigabe schreibt in CLAUDE.md, `.claude/rules/`, CLAUDE.local.md, Skill-Dateien, AGENTS.md, Auto-Memory. `--dedupe`, Widerspruchserkennung, `--scan-history`, 150-Zeilen-Warnung, `/reflect-skills` | nein — „Once applied to CLAUDE.md, entries are permanent" |
| [claude-doctor](https://github.com/millionco/claude-doctor) (~600 ★) | liest `~/.claude/`-Transkripte, erkennt Edit-Thrashing und korrekturlastige Sessions, `--rules` erzeugt Regeln | nein |
| [claude-learn](https://github.com/OutcomefocusAi/claude-learn) (0 ★) | Regeln mit Evidenz-Score, Verfall, Archivierung unter Schwelle | ja — unbeachtet |
| [RuleReceipt](https://dev.to/rulereceipt/i-measured-whether-claude-code-actually-follows-my-claudemd-25ao) | prüft gegen Transkripte, ob bestehende Regeln befolgt werden, mit Beleg | liefert die Daten dafür |
| [/insights → Regeln CLI](https://dev.to/yahav10/i-built-a-cli-that-turns-claude-codes-insights-report-into-actionable-skills-rules-and-workflows-377) | macht aus Claude Codes `/insights`-Bericht Skills, Regeln, Workflows | nein |

## Was von den ersten drei „Lücken" übrig blieb

Am Vormittag standen drei vermutete Lücken im Raum. Nach dem Lesen des Codes:

- **Routing (Regel vs. Skill vs. Hook vs. nichts)** — weitgehend vorhanden: hierarchie-bewusstes Routing, Skill-Rückführung. **Gestrichen.**
- **Replay-Test** (Turn vor der Korrektur mit gepatchter CLAUDE.md neu laufen lassen) — unbelegt, kostet einen `claude -p`-Aufruf pro Regel. Das Backlog des Repos sagt ausdrücklich: „Reproduced, measured or found-in-review earns a place here; speculation does not." **Gestrichen.**
- **Löschseite** — bleibt, aber messbar statt geraten (siehe unten).

## Was das Repo selbst als offen führt

`BACKLOG.md` ist gemessen und nennt die Kosten jedes offenen Punkts:

- **#1 Wiederkehrende Korrekturen zuerst.** Zensus von 102 Queue-Einträgen eines Vielnutzers: 55 „no, <Einmal-Umlenkung>", 13 „actually …", 20 schon verworfen, **~16 echte Regeln**. „use unipile mcp" kam viermal in vier Formulierungen über Monate, wurde jedes Mal erkannt und landete nie in CLAUDE.md. `/reflect` zeigt nach Zeitstempel — wer 80 Einmal-Korrekturen durchwaten muss, hört auf, `/reflect` zu benutzen.
- **#2 Regex trennt Regel und Moment nicht.** Neue Regex-Muster bewegen die Präzision um ~1 von 100.
- **#3 Kein Test führt die Hooks so aus wie Claude Code.** Der CI-Smoke-Test schickt `"test"`, der Schreibpfad läuft nie — so überlebten der `WinError 267`- und der cp1252-Bug, beide zweimal von Nutzern gemeldet.

Offene PRs (#31–#40) betreffen Windows, Pfade, False Positives, Inclusion-Graph — **keiner** berührt #1 oder #3.

## Der Befund, der aus #1 herausfällt

`commands/reflect.md`, Step 4: Findet sich eine Korrektur schon in CLAUDE.md, wird sie als Duplikat behandelt, Angebot „[s]kip". Wenn aber eine Korrektur **wiederkehrt, obwohl die Regel schon dasteht**, wirkt die Regel nicht. Das ist die Löschseite der Dose in belegbarer Form: nicht „welche Regel wurde nie gebraucht" (das braucht Befolgungsdaten, RuleReceipts Spur), sondern „welche Regel steht da und hilft nachweislich nicht".

## Das Geschenk

Patch in `07-demos/agent-postmortem-recorder/claude-reflect-recurrence.patch`, Erklärung für die Maintainer in `07-demos/agent-postmortem-recorder/README.md`. Vier neue Dateien, keine Änderung an bestehendem Code, auf frischem Klon angewandt: **340 Tests grün** (vorher 322).

**Grenze, offen benannt:** Wortbasiertes Clustering. Auf einem verrauschten Satz von 35 Einträgen waren 3 von 9 Gruppen Zufallstreffer der Größe 2. Es ordnet nur, es verwirft nichts. Windows nicht selbst getestet.

## Prüfen ab

03/2027 (Tooling, schnelllebig) — oder früher, sobald der PR beantwortet oder in claude-reflect ein Ranking nach Wiederkehr gelandet ist.

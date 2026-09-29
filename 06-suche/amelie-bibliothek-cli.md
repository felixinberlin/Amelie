# Bibliotheks-CLI — Handbuch

Ein Werkzeug für das ganze Gedächtnis: `npm run bib -- <befehl>` (Skript `scripts/bibliothek.mjs`, reine Funktionen in `scripts/bibliothek-lib.mjs`, Tests in `src/utils/bibliothek.test.ts`). Es ergänzt `npm run quellen` (Quellen-Register) um alles, wofür es bisher nur Prüfskripte oder Handarbeit gab: Protokoll, Friedhof, Doppelprüfung, Vorflug, Rundenabschluss.

**Prinzip wie beim Quellen-Register:** Lesen darf jeder Agent, **schreiben nur der Bibliothekar**. Jeder Schreibbefehl validiert, kennt `--dry-run` und speichert nichts, wenn etwas nicht stimmt. `npm run bib -- hilfe` zeigt die Kurzfassung.

## Lesen (alle Agenten)

| Befehl | Zweck |
|---|---|
| `find <begriff…> [--any] [--alle] [--json]` | **„Gibt es das schon?“** Durchsucht Prüfprotokoll, Friedhof (`graeber.json`), Dosen (`05-dosen/`), Kandidaten (`unpacked.ts`, `ideas/*.ts`), Quellen-Register und die Logs (Klassifikation, Bisoziation, Inversion, Playbook/Atlas, Förderlandschaft, Nachrufe). Mehrere Begriffe: alle müssen im selben Eintrag stehen, `--any` genügt einer. Umlaute und Groß-/Kleinschreibung sind egal (`strassennamen` findet „Straßennamen“). |
| `vorflug [--thema x] [--netz]` | `git fetch`, Remote-Branches mit Commits der letzten 14 Tage, mit `--thema` Commits/Branches/Gedächtnis-Treffer zum Thema, mit `--netz` ein 5-Sekunden-Test einiger Hosts. Offene PRs kann die CLI nicht sehen: dafür `list_pull_requests`. |
| `grab werte` | Erlaubte Werte des Totenscheins (cause, killer, foundBy, origin, stage). `grab list` meldet ungültige Filterwerte mit dieser Liste, statt „0 Gräber“ zu zeigen. |
| `quellen formate` | Gültige `typ`/`kategorie`/`status`/`evidenz`/`zugang`/`rolle`-Werte des Quellen-Registers plus zwei Beispielzeilen der Quellenmeldung. Vor jeder Meldung lesen: `typ` ist ein historischer Buchstabe A–W (Playbook), keine freie Beschreibung, und `kategorie` stammt aus einer festen Liste. |
| `grab list [--cause x] [--killer x] [--found-by x] [--stage x] [--origin x] [--since ISO]` | Gräber filtern (Warnliste für den Friedhofsgang). |
| `grab show <id>` · `grab stats` | Totenschein als JSON · Zählung nach Ursache, Killer, Fundweg, Stadium, Herkunft. |
| `protokoll show <begriff…>` | Zeilen des Prüfprotokolls mit Zeilennummer, Urteil, Beleg, Prüfdatum. |
| `protokoll stats [--abschnitte]` | Urteile gesamt, je Methode (`[method: …]`) und je Rundenabschnitt. Grundlage der Trefferquote. |
| `status` | Dosen, Gräber, Protokollzeilen, Kandidaten, Quellen, Branch, offene Änderungen. |

**Schalter** (`--any`, `--wort`, `--alle`, `--json`, `--dry-run`, `--netz`, `--schnell`, `--abschnitte`) nehmen keinen Wert und dürfen vor oder nach den Begriffen stehen. `--wort` zählt nur ganze Wörter (`wette` trifft nicht „Wetterverlauf“); ohne `--wort` ist die Suche eine Teilstring-Suche mit Umlaut-Faltung. Kompositum ohne Treffer sagt nichts über das Feld: mit Teilbegriffen und `--any` gegenprüfen. Ohne `-s` (`npm run -s bib -- …`) steht npm-Rauschen in der Ausgabe; alternativ `node scripts/bibliothek.mjs …`.

**Exit-Codes von `find`:** `0` = kein Treffer in Protokoll/Friedhof/Dosen/Kandidaten, `2` = **schon da**. Treffer nur in Quellen oder Logs (Hintergrund) ändern den Exit-Code nicht. Ein Treffer heißt nicht „tot“, sondern: lesen und abgrenzen, bevor `frei` vergeben wird. Kein Treffer heißt nicht „frei“: die Existenzsuche bleibt Pflicht.

## Schreiben (nur Bibliothekar)

### `protokoll add`

```
npm run bib -- protokoll add --runde "Heimatgedächtnis-Runde" --titel "Ortsneckname" --id ortsneckname \
  --was "Spottnamen der Nachbardörfer als Ratespiel" --urteil unklar --evidenz schnipsel --method ideenrunde \
  --pruefen-ab 12/2026 --beleg "UDI Würzburg: 1.503 Einträge, Spielform in Franken besetzt" [--nr H9] [--dry-run]
```

* `--runde` ist der Anfang des Abschnittstitels nach `## ` (Präfix genügt). Gibt es den Abschnitt nicht, muss `--neuer-abschnitt "<Einleitung>"` angegeben werden; er wird am Dateiende mit der 8-Spalten-Tabelle angelegt.
* Eingefügt wird in die **letzte** Tabelle des Abschnitts mit Kopf „Idee … Urteil …“. Beide im Protokoll vorkommenden Formen werden erkannt: 4 Spalten (`Idee | Urteil | Beleg | Prüfen ab`) und 8 Spalten (`# | Idee | Methode | Urteil | Beleg | Evidenz | Geprüft | Prüfen ab`, Nummer wird hochgezählt, sonst `--nr`).
* Pflicht: `--urteil` (frei · verengt · unklar · besetzt), `--evidenz seite|schnipsel`, `--method`, `--pruefen-ab MM/JJJJ` (oder `–`), `--beleg`. `|` im Text wird maskiert. Steht die `--id` schon im Protokoll, gibt es einen Hinweis (Neubewertung: Vorurteil im Beleg nennen).
* Danach `npm run check:protokoll`.

### `grab add`

```
npm run bib -- grab add --from grab.json [--dry-run]
```

`grab.json` ist **ein** Objekt oder eine **Liste** von Objekten (dann wird alles geprüft, auch gegeneinander, und nur einmal geschrieben; ein Fehler bricht alles ab) mit den Feldern des Totenscheins (Vorlage: ein Eintrag aus `src/data/graeber.json`, Felder und Werte: `08-friedhof/README.md`, Typen: `src/types.ts` → `DiscardedItem`). Statt `--from` gehen auch Einzelflags (`--id --title --original-de --original-en --why-de --why-en --lesson-de --lesson-en --domain --cause --killer --found-by --origin --stage --born-in --died-on --resurrect-de --resurrect-en [--evidence …]… [--nachruf pfad]`).

Geprüft wird: alle Pflichtfelder, `cause`/`killer`/`foundBy`/`origin`/`stage` gegen die Aufzählungen in `src/types.ts` (die CLI liest sie von dort, kein Drift), kebab-case-`id`, keine doppelte `id`, `diedOn` als ISO-Datum oder -Monat, `nachruf`-Pfad existiert, und bei `stage` `dose`/`zugestellt` ist ein `nachruf` (Grabbeigabe) Pflicht. **Eine `id`, die noch in `05-dosen/` liegt, wird abgelehnt** — erst nach Friedhofsordnung Schritt 2 bestatten. Danach schreibt die CLI `src/data/graeber.json` und regeneriert die Muster in `08-friedhof/README.md`.

Ablauf danach: Quelle mit `--grab <id>` verknüpfen (`quellen import` oder `quellen log`), Protokollzeile, `abschluss`.

### `quellen import <datei|-> --agent <name> --runde "…"`

Bucht die **Quellenmeldung**-Zeilen der Agenten (Format: `06-suche/amelie-quellen-register.md`) ins Register. Erst wird die ganze Datei geprüft, dann gebucht: bei einem Fehler in irgendeiner Zeile wird **nichts** gebucht.

Zusätzliche Regeln gegenüber Handarbeit:
* Eine Zeile ist `QUELLE <id | NEU: Name> | status=… | evidenz=… | zugang=<ja|teilweise|gesperrt> [wie: …] | ertrag=Dose x, Grab y, Idee z | urls=… | note=…`. Trenner ist ` | `; in `note`, `wie` und `enthaelt` darf **kein** ` | ` vorkommen.
* `NEU:` braucht zusätzlich `typ=`, `kategorie=`, `enthaelt=` (optional `fokus=`, `tags=a,b`, `rolle=`, `id=`).
* `status=durchsucht` oder `erschöpft` verlangt `evidenz=seite` (Regel 1 des Registers).
* `ertrag=Dose x` / `Grab y` müssen existieren (Grab: erst begraben). `Idee z` wird als Kandidat gebucht.
* `--dry-run` zeigt die erzeugten `npm run quellen`-Aufrufe.

Vektoren Q1–Q6 bewertet weiterhin `npm run quellen -- rate`.

### `abschluss [--schnell]`

Führt nacheinander `npm run export:data`, `npm run lint` und `npm test` aus (bei rotem Lint Abbruch, `--schnell` lässt die Tests aus), fasst ✓/✗ zusammen und listet die noch nicht committeten Änderungen. Exit-Code 1, wenn etwas rot ist. Ersetzt die manuelle Checkliste aus `CLAUDE.md` §6 (außer Commit und Push).

## Maschinen-Schnittstelle: `apply`, `schema`, Lookups (für das Lab und andere Agenten-Projekte)

Wer Amélies Gedächtnis von außen beschreibt (z. B. der Lab-Bibliothekar), braucht keine eigene Kopie der Regeln, keine mehreren CLIs und kein eigenes Zurückrollen: **eine Eingabe, ein JSON-Ergebnis, alles oder nichts.** Die Regeln liegen hier, in Amélie.

### `bib apply <plan.json|-> [--dry-run] [--json] [--key k] [--wait s] [--actor a] [--agent a] [--runde r] [--plan-id id]`

```json
{
  "plan_id": "lab-2026-09-29-017",
  "actor": "lab-librarian",
  "agent": "lab", "runde": "Multiplayer-Runde",
  "human_accepted": false,
  "expect": { "hashes": { "src/data/quellen.json": "sha256:…" } },
  "ops": [
    { "op": "source.log", "id": "wetterturnier", "note": "Zugang bestätigt.", "erreichbar": "ja" },
    { "op": "grave.add", "grave": { "id": "…", "title": "…", "…": "…" } },
    { "op": "protokoll.add", "runde": "Multiplayer-Runde", "titel": "…", "urteil": "unklar", "beleg": "…", "evidenz": "schnipsel", "method": "ideenrunde", "pruefenAb": "12/2026", "human_accepted": true },
    { "op": "vector.set", "kind": "dose", "id": "abbe-fourier-filter", "set": { "V1": 3 }, "expect": { "V1": 4 }, "evidence": "Warum sich V1 ändert (ein Satz mit Beleg)." }
  ]
}
```

| Operation | Pflichtfelder | Regeln |
|---|---|---|
| `source.add` | `id name typ kategorie enthaelt` (+ optionale wie bei `quellen add`) | Katalogwerte, Regel 1, Ertragsverweise |
| `source.log` | `id note` (+ `status evidenz erreichbar wie urls dose grab kandidat wv …`) | Regel 1 (`durchsucht`/`erschöpft` nur mit `evidenz=seite`), `grab`/`dose` müssen existieren (auch aus früheren Operationen desselben Plans) |
| `source.rate` | `id q` (6 Zahlen 1–5) | |
| `grave.add` | `grave` (Totenschein-Objekt) | alle Pflichtfelder, Aufzählungen aus `src/types.ts`, keine doppelte `id`, keine noch lebende Dose, Nachruf bei Stadium `dose`/`zugestellt` |
| `protokoll.add` | `runde titel urteil beleg evidenz method pruefenAb` (+ `id was nr datum neuerAbschnitt`) | 4- und 8-Spalten-Tabelle, Evidenzmarke, Prüfdatum `MM/JJJJ` |
| `vector.set` | `kind id set evidence` (+ `expect reason`) | nur V1–V7, 1–5, \|Δ\| ≤ 2 je Vektor, **V8 (Fun) nie**, Evidenz (mindestens ein Satz) Pflicht; jede Änderung im Vektor-Log `src/data/vectorChanges.json` |

Reihenfolge zählt: Operationen laufen nacheinander auf demselben Zustand (ein `grave.add` vor dem `source.log --grab`).

**Ablauf:** Form prüfen → Rechte des Akteurs → Schreibsperre → Journal-Recovery → Idempotenz (Ledger) → Vorbedingungen → **alle** Operationen im Speicher durchspielen → `--dry-run` endet hier → Snapshot + Journal → Speicher und erzeugte Dateien schreiben (`amelie-quellen.md`, Friedhof-README, `public/data/*`, `AMELIE_STATUS.md`) → nachprüfen (Register, Friedhof, Protokollabdeckung) → Ledger + Audit. Jeder Fehler nach dem Snapshot rollt **alle** Dateien zurück, auch die erzeugten. Ein hart abgebrochener Lauf (Prozess getötet) hinterlässt `06-suche/.bib-journal.json`; der nächste Schreibvorgang rollt zuerst diesen Zustand zurück (Ergebnisfeld `recovered`).

**Ergebnis (`--json`):**

```json
{ "ok": true, "exit": 0, "plan_id": "…", "key": "…", "dry_run": false, "already_applied": false, "actor": "lab-librarian",
  "ops": [ { "index": 0, "op": "source.log", "ok": true, "target": "wetterturnier", "detail": "…" } ],
  "files": [ "src/data/quellen.json", "06-suche/amelie-quellen.md", "…" ],
  "errors": [] }
```

Fehler haben immer die Form `{ "code": "…", "field": "ops[2].grave", "message": "…", "op": 2 }`. `code` und Exit-Code sind stabil, `message` darf sich ändern.

| Exit | Code(s) | Bedeutung |
|---|---|---|
| 0 | – | ok; auch bei `already_applied: true` |
| 1 | `USAGE` | falscher Aufruf |
| 2 | – | nur `find`: Treffer in Protokoll/Friedhof/Dosen/Kandidaten |
| 4 | – | `exists`/`quellen match`/`grab show`: nichts gefunden |
| 10 | `PLAN_INVALID` `OP_UNKNOWN` `FIELD_REQUIRED` `VALUE_INVALID` `NOT_FOUND` `DUPLICATE` `RULE_VIOLATION` | Validierung: nichts geschrieben |
| 11 | `PRECONDITION_FAILED` | `expect` stimmt nicht mehr: nichts geschrieben |
| 12 | `PERMISSION_DENIED` | Akteur darf die Operation nicht: nichts geschrieben |
| 13 | `LOCK_TIMEOUT` | Schreibsperre nicht bekommen |
| 14 | `APPLY_FAILED` | beim Schreiben etwas schiefgegangen, alles zurückgerollt |

Bei mehreren Fehlern gewinnt der schwerste Code (Rechte vor Vorbedingung vor Form).

### Idempotenz: `--key`

Der Schlüssel ist `--key`, sonst `key` im Plan, sonst `plan_id`. Das Ledger `06-suche/bib-ledger.json` merkt sich jeden angewendeten Schlüssel samt Dateien und Hashes danach. Ein zweiter Aufruf mit demselben Schlüssel schreibt nichts und antwortet `already_applied: true` (Exit 0). Ein Wiederholen nach einem Absturz ist damit harmlos. `bib exists plan <key>` und `bib ledger` zeigen, was angewendet wurde.

### Schreibsperre: `--wait`

Es schreibt immer nur einer (`06-suche/.bib.lock`, mit PID und Akteur). Das gilt für `apply` **und** für die direkten Schreibbefehle (`grab add`, `protokoll add`, `quellen import`, `quellen log|rate|add`); ein Kindprozess des Halters erbt die Sperre. `--wait <Sekunden>` wartet darauf, sonst sofort Exit 13. Verwaiste Sperren (Prozess tot oder älter als 15 Minuten) werden geräumt. `--dry-run` liest nur und braucht die Sperre nicht. `bib abschluss` hält sie nicht (es läuft Minuten).

### Vorbedingungen: `expect`

* **Dateien:** `expect.hashes` im Plan oder an einer Operation: `{ "<pfad>": "sha256:…" }`. `bib state --json` liefert die aktuellen Hashes aller Speicher. Weicht eine Datei ab, wird nichts geschrieben (Exit 11). Das schützt vor „der Beurteiler hat auf altem Stand entschieden“.
* **Vektoren:** `expect: { "V1": 4 }` an `vector.set`: der heutige Wert muss stimmen, sonst `PRECONDITION_FAILED`. Auch Vektoren, die nur in `expect` stehen, werden geprüft.

### Akteure und Rechte: `06-suche/bib-actors.json`

```json
{ "default": "deny",
  "actors": {
    "bibliothekar": { "allow": ["*"] },
    "lab-librarian": { "allow": ["source.log", "grave.add"], "conditional": { "protokoll.add": { "requires": "human_accepted" } } } } }
```

`allow` nennt Operationen (`*` = alle). `conditional.<op>.requires` verlangt, dass die Operation **oder** der Plan das Feld mit `true` trägt. Unbekannte Akteure sind gesperrt. Geprüft wird vor Sperre und Zustand; eine einzige verbotene Operation blockiert den ganzen Plan. Änderungen an den Rechten sind ein Commit in Amélie, nicht im Lab. Die direkten CLI-Befehle sind der Bibliothekar und nicht eingeschränkt.

### Herkunft

`--agent`, `--runde`, `--plan-id` (oder die Plan-Felder) landen im Verlauf der Quellen (`verlauf[].agent/runde/planId`), im Vektor-Log und im **Audit-Log** `06-suche/bib-audit.jsonl` (eine Zeile je Operation, eine je angewendetem Plan, eine je Wiederherstellung; auch die direkten Schreibbefehle schreiben hinein). Das Audit-Log ist append-only und wird mitcommittet.

### Lookups und Schema (nur lesend)

| Befehl | Zweck |
|---|---|
| `bib schema` | Erlaubte Werte als JSON: Quellentypen/-kategorien/-status/-evidenz, Grab-Ursachen/-Killer/-Fundwege/-Herkunft/-Stadien, Urteile, Vektorregeln, Operationen mit Pflicht-/Optionalfeldern, Rechte der Akteure, Exit- und Fehlercodes. Das Lab kopiert diese Listen nicht mehr. |
| `bib exists <source\|grave\|dose\|candidate\|protokoll\|plan> <id>` | Vorprüfung, Exit 0 = gibt es, 4 = nicht |
| `bib quellen match --url <u>` | welche Quelle gehört zu dieser Adresse (`exakt` > `pfad` > `host`, gleiche Domain ohne `www.`) |
| `bib find <…> --json` | strukturierte Treffer: `kind`, `binding`, `id`, `title`, `file`, `line`, `verdict`/`status`/`cause`, `snippet`; oben `alreadyThere` |
| `bib state` | Hashes der Speicher, Sperre, offenes Journal, Ledger-Größe |
| `bib vector show <dose\|candidate> <id>` | Vektoren und letzte Änderungen |

`--json` gilt für **jeden** Befehl: reines JSON auf stdout, Fehler als `{ "ok": false, "errors": [ {code, field, message} ] }`. Bequemlichkeit für Menschen: `bib vector set --kind dose --id x --set V1=3 --expect V1=4 --evidence "…"` baut einen Ein-Operationen-Plan und ruft `apply` (Akteur `bibliothekar`, ohne `public/data`-Export).

### Noch nicht enthalten

Terminologie, Fragen und Dossier-Notizen (`dossier.annotate`) gibt es in Amélie noch nicht als Speicher. Sobald das Lab das Format und den Zielort festlegt, kommen sie als weitere Operationen dazu; bis dahin antwortet `apply` mit `OP_UNKNOWN` (Exit 10).

## Wer nutzt was

| Agent | Befehle |
|---|---|
| `ideen-scout`, `bisoziations-kollider`, `inversions-agent` | `find` vor jedem Urteil, `grab list`, `quellen next/show` (Register), am Ende Block **Quellenmeldung** |
| `idea-reviewer` | `find` (Baustein? Wiedergänger?), `grab list --cause …` |
| `dose-packer` | `find <id>` vor dem Packen, `protokoll show`, die eine Gepackt-Zeile mit `protokoll add` |
| `bibliothekar` | alles, insbesondere `protokoll add`, `grab add`, `quellen import`, `abschluss` |
| Orchestrator | `vorflug` (Phase 0), `find` + `grab list` (Friedhofsgang), `abschluss` (Phase 6) |

## Daten

* **Gräber:** `src/data/graeber.json` ist die Wahrheit. `DISCARDED_DATA` in `src/data/dosen.ts` importiert sie (Typprüfung durch `tsc`), `08-friedhof/README.md` wird daraus erzeugt (`npm run friedhof`, geprüft von `check:friedhof`). Nicht mehr in `dosen.ts` bearbeiten.
* **Nicht von der CLI angefasst:** Playbook (Trefferquote-Tabelle, Atlas, Retro) — freies Format, bleibt Handarbeit; Zahlen liefert `protokoll stats`. Dosen packen bleibt Sache des `dose-packer`.

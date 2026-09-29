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

`grab.json` ist **ein** Objekt mit den Feldern des Totenscheins (Vorlage: ein Eintrag aus `src/data/graeber.json`, Felder und Werte: `08-friedhof/README.md`, Typen: `src/types.ts` → `DiscardedItem`). Statt `--from` gehen auch Einzelflags (`--id --title --original-de --original-en --why-de --why-en --lesson-de --lesson-en --domain --cause --killer --found-by --origin --stage --born-in --died-on --resurrect-de --resurrect-en [--evidence …]… [--nachruf pfad]`).

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

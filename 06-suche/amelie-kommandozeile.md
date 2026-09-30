# Amélie von der Kommandozeile: Läufe, Kosten, Datenbank-Vorbereitung (Stand 01.10.2026)

Ziel: so viel wie möglich ohne Claude-Code-Sitzung und ohne Claude-Credits. Node-PATH falls nötig: `export PATH="/home/felix/.nvm/versions/node/v26.3.1/bin:$PATH"`.

## 1. Was kostet was

| Weg | Kosten | Wofür |
|---|---|---|
| `npm run bib -- …` (find, grab, protokoll, vorflug, status) | 0 | Doppelprüfung, Lesen des Gedächtnisses |
| `npm run lint`, `npm test`, `npm run export:data` | 0 | Drift-Guards, Tests, Frontend-Daten |
| `npm run lab -- list \| review <pr> --no-agent` | 0 | Lab-PR maschinell prüfen |
| `npm run agent -- <agent> …` (Gemini über Vertex AI) | Promo-Guthaben des Labs, etwa 0,01 bis 0,30 USD je Lauf | Scout, Reviewer, Inversion, Kollider, nur lesend |
| Lab-Suchdienst (`python -m agents.search_service`) | 5000 Suchen im Monat gratis, danach 14 USD je 1000 | Websuche, läuft über `web_search` im Kit |
| Claude-Code-Subagenten (`.claude/agents`) | Claude-Credits, teuer | nur wenn nötig |

Stand im Lab (`runner.py --costs`, Schätzung, nicht die Rechnung): 250 USD Guthaben, 3,26 USD ausgegeben, 37 Läufe, im Mittel 0,09 USD je Lauf. Preise stehen in `Amelie-lab/data/pricing.json` und sind **nicht gegen die Cloud Console geprüft**.

**Nicht geprüft:** Was das Google- oder das Claude-Pro-Abo an Nutzungslimits oder API-Guthaben hergibt. Das sind Abo-Grenzen, keine API-Preise. Vor jeder Planung auf der Anbieterseite nachsehen und hier eintragen.

## 2. Befehle

```
npm run bib -- find --stamm <Wortstämme>     # Doppelprüfung (Exit 2 = schon da)
npm run bib -- grab list --cause <ursache>   # Friedhof
npm run bib -- protokoll stats               # Prüfprotokoll
npm run lab -- list                          # offene Lab-PRs
npm run lab -- review <pr> --no-agent        # kostenlose Prüfung
npm run agent -- ideen-scout --task-file aufgabe.txt --model gemini-flash
npm run agent -- idea-reviewer --task "…" --model gemini-pro
```

`npm run agent` (Skript `scripts/agent-run.mjs`) startet einen der Agenten `ideen-scout`, `idea-reviewer`, `inversions-agent`, `bisoziations-kollider` mit eigener Schleife gegen das Modell aus `scripts/model-compare/models.local.json`. Nur lesend; der Bericht kommt auf die Standardausgabe, Verbrauch auf die Fehlerausgabe. Er bucht nichts. Websuche über den Lab-Suchdienst (`AMELIE_LAB` oder `../Amelie-lab` mit `.venv`).

**Lab-Läufe nachliefern** (im Lab-Repo): `.venv/bin/python -m bridge.librarian_pr --status` zeigt ungelieferte Läufe; `doPR --all --dry-run` baut die Vorschläge im isolierten Clone ohne Push. Die Dateien unter `06-suche/proposals/` lassen sich von dort nach Amélie kopieren (so am 01.10.2026 geschehen, Commit 16e9c22).

## 3. Lehren aus den ersten Läufen

- **Gemini lässt Anbieter-Suche und Funktionswerkzeuge nicht zusammen zu.** Mit eingeschalteter Anbieter-Suche wurden read_file, bib und web_fetch ignoriert (0 Werkzeugaufrufe). Das Kit schaltet die Anbieter-Suche jetzt ab, sobald der Lab-Suchdienst da ist. Gilt auch für `npm run lab` mit Unter-Agenten.
- **Flash liefert ohne Werkzeugzwang leere Hüllen** (Tabelle mit Leerzeichen). Aufgabe muss die Werkzeugreihenfolge nennen.
- **„frei“ auf Schnipseln ist kein Urteil.** Ergebnisse der Agentenläufe gelten als Hinweis; Urteil erst nach geholter Seite und Gegenprüfung durch den Bibliothekar.
- Der Spanien-Lauf endete leer (2 Runden); wiederholen, Modell `gemini-pro` probieren.

## 4. Vorbereitung auf die Datenbank (macht eine andere Sitzung)

Heute ist das Gedächtnis Dateien; die Datenbank soll sie abbilden, nicht ersetzen, bis sie trägt.

| Entität | Quelle der Wahrheit heute | Schlüssel | Menge |
|---|---|---|---|
| Gräber | `src/data/graeber.json` | `id` | 124 |
| Quellen | `src/data/quellen.json` (`quellen`, `typen`, `katalog`) | `id` | 223 |
| Dosen-Vektoren | `src/data/doseVectors.json` | Dosen-`id` | 44 |
| Kandidaten-Vektoren | `src/data/candidateVectors.json` | Kandidaten-`id` | 156 |
| Prüfprotokoll | `06-suche/amelie-pruefprotokoll.md` (Zeilen, kein Schema) | keiner, nur Titel und Id im Text | etwa 980 Zeilen |
| Lab-Läufe | `Amelie-lab/results/{inversion,lacunar}/<run_id>.json` | `run_id` | 18 |
| Lab-Vorschläge | `06-suche/proposals/<plan_id>.md` + `.manifest.json` | `plan_id`, `run_id` | 17 Manifeste |
| Schreibvorgänge | `06-suche/bib-audit.jsonl`, `bib-ledger.json` | Ledger-`key` | 180 Audit-Zeilen |

**Regeln für die Brücke**
- **Ein Schreibweg:** `bib apply` (alles oder nichts, Ledger, Audit, Akteursrechte). Die Datenbank schreibt nie an `bib` vorbei; sie liest daraus (Audit-Log als Änderungsstrom) oder wird von `bib apply` als zweites Ziel bedient.
- **Stabile Ids existieren** für Gräber, Quellen, Dosen, Kandidaten, Läufe. **Das Prüfprotokoll hat keine** (Freitext-Zeilen): erste Aufgabe der Datenbank-Sitzung, die Zeilen in Datensätze mit Id, Urteil, Datum, Lauf und Verweis auf Dose/Grab zu überführen (`bib protokoll show --json` liefert den Ausgangspunkt).
- **Herkunft mitführen:** Lab-`run_id`, Modell, Suchfragen, geholte Seiten (siehe Lab-Datei `prior_art`, `tool_calls`). Dazu Existenzstatus `ungeprueft` → Urteil.
- **Terminologie, Fragen, Dossier-Notizen** haben noch keinen Speicher (offen in der Bibliotheks-CLI).
- **Offen für Félix:** Wo läuft die Datenbank (lokal SQLite, Firebase, andere)? Ist sie öffentlich lesbar (Repo ist öffentlich, `ventures/` darf nie hinein)? Sollen Lab-Rohläufe (Suchantworten) mit hinein?

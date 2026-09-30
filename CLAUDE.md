# AGENTS.md — Leitfaden für KI-Assistenten in Amélie

Willkommen bei **Amélie**. Dieses Dokument ist die erste Anlaufstelle für jeden Agenten. Lies es zu Beginn jeder Sitzung, um ohne Raten sofort produktiv und konform mit den Projektregeln zu arbeiten.

---

## 1. Was ist Amélie?

Amélie ist ein offenes Projekt, das schlüsselfertige Software- und Datenwerkzeuge an Universitäten, Behörden, NGOs und Open-Source-Communities **verschenkt** (CC0 Public Domain).
* **Kein Pitching:** Wir verkaufen nichts, wollen keine Beratungsmandate und haken niemals nach.
* **Fünf unumstößliche Zustellregeln:**
  1. *Geschenk-Prinzip:* Die Idee wird bedingungslos verschenkt.
  2. *Reale Person & Institution:* Adressiert an echte Fachleute mit konkretem Mandat.
  3. *CC0 & Druckfreiheit:* Keine Vorbedingungen, kein Nachfassen.
  4. *Lauffähiges Scaffolding:* Jede Dose hat ein Open-Source-Repository / Scaffolding mit Code und Tests (`07-demos/`).
  5. *Deep-Link-Pflicht:* Links zum Simulator oder der Live-Demo in E-Mails und Dokumenten MÜSSEN immer den direkten Dosen-Anker tragen (`https://felixinberlin.github.io/Amelie/#dose=<id>`), niemals die unqualifizierte Startseite.

---

## 2. Die Gedächtnis-Architektur: `06-suche` & `08-friedhof`

Amélie speichert sein Gedächtnis nicht in Chat-Transkripten, sondern im Dateisystem:

* **`06-suche/` (Vorwärts-Gedächtnis):**
  * `amelie-pruefprotokoll.md`: Das lückenlose Logbuch jeder geprüften Idee mit Schiedsrichter-Urteil (`frei`, `verengt`, `unklar`, `besetzt`). **Jede neue oder geänderte Dose muss hier sofort eingetragen werden.**
  * `amelie-quellen.md` (**erzeugt**) ← **Quellen-Register** `src/data/quellen.json`: jede Quelle (Fachgremium, Citizen Science, Norm, Förderprogramm, Preis, Datensatz, Empfänger …) ist ein Objekt mit Typ, Kategorie, Zugang (`wie` kommt ein Agent heran), Inhalt, Status, Ertrag (Dosen/Gräber), Verlauf und Vektoren Q1–Q6. Nur der Bibliothekar schreibt, per `npm run quellen -- log|add|rate|next|stats|check` (Handbuch: `06-suche/amelie-quellen-register.md`). Agenten melden am Ende einen Block **Quellenmeldung**.
  * `amelie-suchplaybook.md`: Die Heuristiken, Stoppregeln und erprobten Suchstrategien.
  * `amelie-inversions-log.md` & `amelie-bisoziation-log.md`: Operative Protokolle der Ideenfindung.
* **`08-friedhof/` (Rückwärts-Gedächtnis / Obduktionssaal):**
  * Enthält die beerdigten Ideen mit vollem Totenschein (`cause`, `killer`, `foundBy`, `stage`). Die Totenscheine liegen als Daten in `src/data/graeber.json` (nicht mehr in `dosen.ts`; `DISCARDED_DATA` liest sie von dort).
  * **Regel:** Vor jeder neuen Ideengenerierung ist der Gang über den Friedhof Pflicht, um keine Wiedergänger zu produzieren — am schnellsten mit `npm run bib -- find <Begriffe>` und `npm run bib -- grab list --cause …`.

* **Bibliotheks-CLI (`npm run bib -- hilfe`, Handbuch `06-suche/amelie-bibliothek-cli.md`):** ein Werkzeug für das ganze Gedächtnis. **Lesen (alle Agenten):** `find` (Doppelprüfung über Protokoll, Friedhof, Dosen, Kandidaten, Quellen, Logs; Exit 2 = schon da), `vorflug` (git fetch, fremde Branches, Netztest), `grab list|show|stats`, `protokoll show|stats`, `status`. **Schreiben (nur Bibliothekar, mit `--dry-run`):** `grab add`, `protokoll add`, `quellen import`, `abschluss`.

---

### Förderlandschaft (`06-suche/amelie-foerderlandschaft.md` + `amelie-foerder-und-preisatlas.md`)

Geldgeber, Preise, EU-Programme, Städte und Angels sind Ideenquelle, Besetzt-Test und Empfängerliste zugleich. **Katalog** (Fristen, Summen, Passung, Status) in `amelie-foerderlandschaft.md`, **Methodik und Suchrezepte** im Atlas. Nutzung:
* **Vor jeder Ideensuche:** Geförderte-Projekte-Listen (Prototype Fund, Civic Coding, DBU, mFUND, Open Source Wettbewerb) nach dem Thema durchsehen. Ein Treffer ist ein `besetzt`-Signal.
* **Jede Dose bekommt eine Förderbrücke:** „Wer könnte Ticket 01 finanzieren?" (Prototype Fund, DBU-Skizze, BMJV/BLE, mFUND, CERV, Civic Coding) plus Voraussetzungen. Nur ein Hinweis, kein Pitching.
* **Empfänger:** Preisträger, Jurys, Smart-City-Modellprojekte (Ablage OpenCoDE.de, Stelle KTS), Unit GovTech Berlin.
* **Venture:** Abschnitt E des Katalogs und `ventures/funding-and-angels.md`. Behördenvertrieb ist der Engpass (GovTech Startup Monitor 2026), Pilot vor Ausschreibung.
* **Evidenz ist Suchschnipsel** (Stand 28.09.2026). Vor Nennung in einer Mail oder Dose Frist, Summe und Zulässigkeit auf der Primärseite prüfen und den Katalog nachziehen. Abgelaufene Fristen nie als offen darstellen.
* **Offen (nicht entschieden):** Rechtsform/Antragsteller, CC0-Vereinbarkeit mit Prototype-Fund-Lizenzpflicht, Fördertipps in Empfängermails. Bis zur Entscheidung keine Mail mit Fördertipp versenden.

---

## 3. Die „Dual Data"-Architektur (Häufige Stolperfalle!)

Das Projekt besitzt eine zweistufige Datenebene:
1. **Markdown-Dossiers:** `05-dosen/<id>.md` und `en/05-dosen/<id>.md`.
2. **Frontend-Datenbestand:** `src/data/dosen.ts` (`DOSEN_DATA`), das direkt von der React-App (`App.tsx`) im Browser gerendert wird.

### ⚠️ Wichtig bei Dosen-Änderungen:
Wenn du ein Ticket, ein Kriterium oder eine Dosen-Beschreibung änderst, musst du **immer alle drei Schritte** ausführen:
1. Markdown aktualisieren (`05-dosen/` & `en/05-dosen/`).
2. `src/data/dosen.ts` aktualisieren (`firstStepDe`, `firstStepEn`, `sketch`, `emailTemplate`).
3. **`npm run export:data`** ausführen! Dies regeneriert `public/data/dosen.json` und `public/data/amelie-ideas.json`.
4. Eintrag im Prüfprotokoll aktualisieren (`06-suche/amelie-pruefprotokoll.md`).

---

## 4. Technische Umgebung & Befehle

* **Node.js:** Node v26 liegt unter `/home/felix/.nvm/versions/node/v26.3.1/bin/node`.  
  Falls `node` in einer Subshell nicht gefunden wird:  
  `export PATH="/home/felix/.nvm/versions/node/v26.3.1/bin:$PATH"`
* **Tests:** `npm test` (führt Vitest über alle 14 Suiten aus).
* **Linter & Drift-Guards:** `npm run lint` führt aus:
  * `tsc --noEmit` (TypeScript-Typüberprüfung)
  * `check:dosen` (prüft Deckungsgleichheit Markdown ↔ `src/data/dosen.ts`)
  * `check:books` (prüft Vollständigkeit der Kapitel in `02-recherche/` und `07-demos/`)
  * `check:idea-frontmatter` (Frontmatter-Abgleich)
  * `check:protokoll` (stellt sicher, dass jedes Urteil im Prüfprotokoll steht)
  * `check:friedhof` (prüft Totenscheine und README im Friedhof)
  * `check:quellen` (validiert das Quellen-Register und prüft, dass `06-suche/amelie-quellen.md` daraus aktuell erzeugt ist)
  * `check:diagramme` (parst alle ```` ```mermaid ````-Blöcke in den Markdown-Dateien; ein Syntaxfehler bricht Lint ab)
* **Bibliotheks-CLI:** `npm run bib -- <befehl>` (siehe §2); Rundenabschluss in einem Schritt: `npm run bib -- abschluss` (`export:data` → `lint` → `test`).

---

## 5. Aktueller Projektstand (Stand: 28. September 2026)

* **Farmacia-Runde (30.09.2026, Teamrunde 5, auf Wunsch nach dem Ventures-Lauf):**
  * Thema Apotheke/Farmacia (ES und DE). Vorflug mit `bib vorflug --netz`: keine Parallel-PRs, Netz offen. Drei Engines parallel → Merge → Reviewer → Bibliothekar (kein Packer/Demo-Builder). Protokoll der Runde: 21 Zeilen (0 frei / 6 verengt / 3 unklar / 12 besetzt).
  * **0 Dose Ready** (bestes Ergebnis `kuehlketten-steckbrief` 23/35, Gate 24), Needs Research: `kuehlketten-steckbrief` (Rang 1), `engpass-prognosetreue`, `fachinfo-aenderungsdiff`, `haeufigkeits-umrechner`, `import-prospekt-bruecke`, `nebenwirkungs-meldeassistent`; **7 neue Gräber (103 gesamt)**, 18 neue Quellen.
  * **Lehre (Tag-0-Problem):** Änderungs-Feeds (CIMA `registroCambios`, BfArM-Lieferengpass-CSV) liefern nur den Ist-Stand oder die Kategorie, nie den Vorgängerwert. Jede Idee „Was hat sich geändert“ oder „Wie treu war die Prognose“ braucht ein Archiv; Vorfrage: Gibt es die Vorgängerfassung als Datensatz? Fachkreisseite der Apotheke ist gesättigt, Empfänger fehlen. Doppelfunde: `fachinfo-aenderungsdiff` (Scout + Kollider) und Rückruf/Charge (Inversion + Kollider, beides Grab); Notdienst/Guardia dreifach besetzt.
  * **Offen:** Datentest `kuehlketten-steckbrief` (10 Fachinfos aus CIMA/EMA), Snapshot-Archiv über 6 bis 8 Wochen für `engpass-prognosetreue` und `fachinfo-aenderungsdiff` (Frage, ob ein offenes Archiv Gemeingut sein soll); Ansprechpersonen nirgends verifiziert; Register hat keinen Typ/keine Kategorie für Apotheke/Pharmakovigilanz (Entscheidung Félix). Der Reviewer-Agent brach am Nutzungslimit ab, hatte seinen Logabschnitt aber vollständig geschrieben.
* **Ventures-Tab (30.09.2026, öffentlich auf main):** Tab `ventures` im Bereich Recherche (`VenturesTab`, Übersicht, Leads mit Vektoren, Lauf „Apotheken-Vermittlung ES“ mit Diagrammen, Deep-Link `#venture=farmacia-mandate-engine&lang=es`). Daten: `public/data/ventures-dashboard.json` (`scripts/export-ventures.mjs`, läuft in `npm run export:data`), nur Leads und Vektoren, keine Kills/Fristen/Notizen. Dossier `ventures/opportunities/farmacia-mandate-engine.md` (spanisch, Kostenmodell `src/data/pharmaAcquisition.ts`, alle Zahlen Annahmen). Der lokale Branch `feat/venture-leads-round-2` behält sein privates Dashboard.
* **Modellvergleich (29.09.2026):** `npm run vergleich -- models|run|judge|score` (Handbuch `06-suche/amelie-modellvergleich.md`). Lässt dieselbe Runde (Agenten- + Skill-Prompts der drei Engines, gleiche Werkzeuge `bib_find`/`web_fetch`) mit Claude direkt, Claude über Vertex AI und Gemini laufen und misst Nachprüfbares: Formtreue der Quellenmeldung, **als frei gemeldet, obwohl begraben**, „[Seite]“ ohne geholte URL, Doppelfund-Quote über Modelle, Richter-Urteil (nutzbar vs. Ausschuss), Kosten. Keine Gesamtnote. `--mock` testet die ganze Kette ohne Netz, echte Läufe brauchen `--yes`. **Adapter nicht gegen Live-APIs gelaufen** (keine Zugangsdaten in der Entwicklungsumgebung); Gemini-Modell-Id in `models.local.json` selbst eintragen. Offen: erste echte Messung.
* **Maschinen-Schnittstelle der Bibliotheks-CLI (29.09.2026, Anfrage aus dem Lab-Projekt):** `bib apply <plan.json>` schreibt einen typisierten Stapel (`source.add|log|rate`, `grave.add`, `protokoll.add`, `vector.set`) **alles oder nichts** samt erzeugter Dateien (Snapshot + Journal + Rollback, Crash-Recovery), idempotent über Ledger (`06-suche/bib-ledger.json`, `--key`), mit Schreibsperre (`--wait`), Vorbedingungen (`expect.hashes`, `expect: {V1: 4}`), Herkunft im Verlauf und Audit-Log (`06-suche/bib-audit.jsonl`) und Akteurs-Rechten in `06-suche/bib-actors.json` (Lab-Bibliothekar: `source.log`, `grave.add`, `protokoll.add` nur mit `human_accepted`). `--json` an jedem Befehl, stabile Exit-Codes (10 Validierung · 11 Vorbedingung · 12 Rechte · 13 Sperre · 14 zurückgerollt) und Fehler als `{code, field, message}`; `bib schema`, `exists`, `quellen match --url`, `state`, `ledger`, `vector set|show` (Rubrik: nur V1–V7, |Δ| ≤ 2, V8 nie, Evidenz Pflicht; Log `src/data/vectorChanges.json`). Handbuch: Abschnitt „Maschinen-Schnittstelle“ in `06-suche/amelie-bibliothek-cli.md`. Noch nicht enthalten: Terminologie, Fragen, Dossier-Notizen (kein Speicher; Format vom Lab).
* **Bibliotheks-CLI (29.09.2026):** `npm run bib -- …` (Handbuch `06-suche/amelie-bibliothek-cli.md`). Bisher hatte nur das Quellen-Register eine CLI; Protokoll, Friedhof und Doppelprüfung waren Handarbeit oder `grep`. Jetzt: `find` (Doppelprüfung über alles, Exit 2 = schon da), `vorflug`, `grab list|show|stats|add`, `protokoll show|stats|add`, `quellen import` (Quellenmeldungen buchen, alles-oder-nichts), `status`, `abschluss`. **Gräber liegen jetzt in `src/data/graeber.json`** (statt in `dosen.ts`; `DISCARDED_DATA` liest sie). Agenten-Definitionen (Engines, Reviewer, Packer, Bibliothekar) und Orchestrator-Skill nutzen die Befehle; Tests `src/utils/bibliothek.test.ts`. Playbook-Schreiben bleibt Handarbeit.

* **Multiplayer-Runde (29.09.2026, Teamrunde 4, Testlauf der neuen Agenten und der Bibliotheks-CLI):**
  * Thema gemeinsames Spielen (Regelwerke, Recht, Institutionen). Vorflug mit `bib vorflug`: keine fremden Branches/PRs zum Thema. Drei Engines parallel → Merge → Reviewer → Bibliothekar (kein Packer/Demo-Builder). 3 Doppelfunde (Boule, Skill-Luck, LAN-Strom); Gesamtprotokoll der Runde 25 Zeilen (0 frei / 3 verengt / 9 unklar / 13 besetzt).
  * **0 Dose Ready** (bestes Ergebnis 22/35, Gate 24), **6 Needs Research** (`kritische-masse-rechner`, `spielplatzpflicht-vorpruefer`, `sportlaerm-belegungs-vorpruefer`, `ludothek-vollstaendigkeit`, `pegel-wette`, `fluesterpost-stammbaum`), **11 neue Gräber (92 gesamt)**. Multiplayer ist als Feld dicht: gemeinsames Spielen ist kommerziell, akademisch oder Rechtsratgeber; reguliert sind Geld, Ort, Lärm. Empfänger fehlt öfter als Technik. `pegel-wette` und `wetterregel-liga` gemeinsam prüfen (ein Skill-Score-Kern).
  * **CLI-Befunde und Fixes:** `--any` verschluckte den nächsten Begriff (jetzt Schalterliste), `find --wort` neu, `grab list` meldet ungültige Filterwerte, `grab werte` und `quellen formate` neu, `quellen import` las die falschen Rückgabefelder von `refIds()` (Grab/Dose immer abgelehnt; gefixt, Regressionstest über den echten CLI-Aufruf), `grab add --from` nimmt Listen, Audit-Test zählt Dosen/Gräber nicht mehr fest.
  * **Offen:** 3 von 4 Berichten lieferten Quellenmeldungen in falschem Format oder mit ungültigen Werten (Engine-Prompts nennen jetzt `bib quellen formate`); Typ-Buchstaben T/U und eine Kategorie „Spielrecht"/„verband" fehlen im Register (Entscheidung Félix); `.claude/skills/` und `skills/` sind zwei getrennte Varianten und müssen bei Änderungen beide gepflegt werden.

* **Vektor V8 „Fun" (29.09.2026):**
  * Der Reviewer bewertet jetzt **8 Vektoren** (V1–V7 Kern /35, V8 Fun additiv → Gesamt /40). Fun kompensiert nie; das Dose-Ready-Gate rechnet nur V1–V7 (≥ 24/35). Rubrik: `skills/idea-reviewer/idea-reviewer/references/vector-rubrics.md`.
  * Alle 44 Dosen wurden neu klassifiziert (Log: Abschnitt „Fun-Re-Klassifikation" in `06-suche/amelie-classification-log.md`). Datenquelle fürs Frontend: `src/data/doseVectors.json` (+ Katalog `src/data/vectors.ts`, Export `public/data/vectors.json`). Sichtbar im Dosen-Modal, auf der Einzelseite (`DoseVectorPanel`) und als Mini-Balken plus Sortierung in der Galerie.
  * Auch die 146 ungepackten Kandidaten haben V1–V8 (Schreibtisch-Triage ohne Websuche, `src/data/candidateVectors.json`; gepackte erben von ihrer Dose). Sichtbar in der Ideen-Pipeline (Panel + Sortierung). Neue Kandidaten dort eintragen (`vectors.test.ts` prüft es).
  * **Vergleichsseite** (Haupt-Tab Compare, `VectorCompareView`): bis zu 6 Dosen/Kandidaten anklicken, Netzdiagramm über V1–V8 plus Tabelle nebeneinander (gepackte Kandidaten werden nicht doppelt gelistet); die Auswahl steht im Link (`#compare=dose:<id>,cand:<id>`, Button „Auswahl teilen").
  * **Bei jeder neuen Dose:** Eintrag in `src/data/doseVectors.json` ergänzen (`vectors.test.ts` schlägt sonst fehl), dann `npm run export:data`.

* **Heimatgedächtnis-Runde (Fun-Fokus, 29.09.2026, Teamrunde 3):**
  * Thema lokales Ortswissen (Flurnamen, Dialekt, Ortsnamen). Vorflug mit `git fetch`: keine offenen PRs, Netz offen. 14 geprüfte Ideen (2 frei/dünn, 4 verengt, 8 unklar) + 9 direkt besetzt → Reviewer → **1 Dose, 9 Needs Research, 12 neue Gräber (81 gesamt)**.
  * **`strassennamen-pruefer` gepackt** (24/35, knapp am Gate, V8 Fun nur 2): deterministischer Ähnlichkeitsprüfer für neue Straßennamen (Kölner Phonetik, Grundwort-Doppelung), sagt **nie „unzulässig"**. Scaffolding `07-demos/strassennamen-pruefer/` + Engine (31 Tests), Fixtures synthetisch. Empfänger: Vermessung/Geoinformation einer Stadt — **Person vor Versand verifizieren**, keine Mail angelegt.
  * Needs Research: `flurnamen-verortungsspiel` (Rostock-Cluster, Datentest Leave-one-out), `ortsneckname`, `abzaehlreim`, `wenkerbogen-lesehilfe`, `legenden-alibi`, `flurnamen-deutungswerkbank`, `mundart-echtheitsprobe`, `wetterregel-liga`, `wossidlo-entzifferer`. Höchstens eine Dose pro Empfängergruppe (Rostock).
  * Lehre: keine der fünf Fun-5-Ideen wurde Dose; Sammeln im Feld ist dicht/beim Empfänger, Lücken liegen bei Spielschicht und Prüfen-gegen-Messbares. V8 kompensiert nie.

* **Tab-Aufräumrunde (29.09.2026):**
  * Neuer Tab **Games** (`GamesView`, Hauptnavigation): spielbare Mini-Spiele (aus „Funny & Better" umgezogen; neu: „Lichter im Hof", Regelkern `src/engine/zen-games/hofLichterEngine.ts`), Spiel-Dosen (`GAME_DOSE_IDS` in `src/data/pipeline.ts`) und Spielideen (`src/data/ideas/games.ts`, `GAME_IDEAS`). Neue Spielideen dort eintragen, nicht in die Themenlisten.
  * **Ideen-Pipeline** zeigt nur noch nicht gepackte Themenideen: ohne Spiele, ohne Alltagsberufe (eigener Tab), ohne Ideen mit `packedDoseId` (per Häkchen einblendbar); Themenkörbe in `PIPELINE_THEMES`. `CANDIDATE_IDEAS_DATA` bleibt vollständig (Export, Protokoll-Abgleich).
  * **Alltagsarbeit:** jede Idee in genau einem Berufsfeld (`src/data/everydaySectors.ts`); Badge „Als Dose gepackt" mit Link. Wird eine Idee zur Dose, `packedDoseId` setzen.

* **Post 13 — Amélie selbst → r/ClaudeCode (28.09.2026, gepostet):**
  * Showcase-Kommentar im „Weekly Showcase Thread" von `r/ClaudeCode`: verschenkt wird die Methode (Orchestrator + 7 Subagenten), keine einzelne Dose. Eintrag `post-13` in `src/data/deliveries.ts` (ohne `doseLinks`, `sent: true`), Notiz in `03-zuordnung/mails-q4-2026/post-13-reddit-claudecode.md`.
  * `loadSentEmailsMap` übernimmt für Einträge ohne verlinkte Dose den Seed-Status (`sent`/`sentAt`), statt sie als unversendet zu melden.
  * Kein zweiter Post zum selben Projekt (Subreddit-Regel); Fragen im Thread beantworten ist erlaubt.

* **`tarot-zustandsmaschine` / Arcana Schema (Dose & Post 10):**
  * **Spezifikation & Playground LIVE:** Arcana Schema v2.0.0 ([felixinberlin.github.io/Arcana-schema](https://felixinberlin.github.io/Arcana-schema/)) dual-validiert (Draft 2020-12 & Draft-7) mit `@arcana-schema/validator` auf npm.
  * **Post 10 (Reddit Announcement):** An `r/tarot` Moderatoren via Modmail versendet (Vorab-Genehmigung bezüglich Regel 9 / No AI). Status in Dossiers und Zustellliste auf `Delivered` / `sent: true` gesetzt.
  * **Simulator:** Altes `TarotGraphSimulator.tsx` entfernt; verweist im Frontend & Dossier direkt auf die GitHub-Pages-Instanz.
* **`dose-cleaner-chemical-safety` / ChemGefahr-Stopp (Dose & Mails 11/12):**
  * **Zustellung ERFOLGT:** Anschreiben an den Spitzenverband **BIV** (`biv@die-gebaeudedienstleister.de`, z. Hd. Christine Sudhop, Mail 11) sowie BG BAU (`gefahrstoffe@bgbau.de`) versendet. Dosenstatus auf `zugestellt` / `Delivered` gesetzt.
  * **0-Byte Video-Fassade:** Google Drive Demonstration ohne Ladezeit-Einbußen per Lightbox integriert.
  * **Mail 12 bereit:** Passgenaue europäische Kaltmail an EU-OSHA (`information@osha.europa.eu` via BAuA Focal Point) vorbereitet.
* **`kristallwachstum-3d` (Dose & Mail 9):**
  * **Ticket 01 ist ABGESCHLOSSEN:** WebGPU-Pipeline (`webgpuPipeline.ts`) mit CPU-Voxel-Laufzeitkern, 50-Schritte-Phasenfeld-Glättung, Live-$D_f$-Literaturvergleich, 6 Gefügelinsen, 3D-Kamera und STL-Export sind verifiziert (8 Tests in `engine.test.ts`).
  * **Ticket 02 ist BEREIT:** GPU-Marching-Cubes Isosurface-Extraktion & Mehrfarbiger 3MF-Farbexport (`07-demos/kristallwachstum-3d/ticket-02-gpu-marching-cubes-3mf.md`).
  * **Mail 9:** An Prof. Dr. Timm John (FU Berlin Geowissenschaften) ist auditiert und versandfertig.
* **Agenten- und Skill-Architektur:**
  * **3 Entdeckungs-Engines:**
    * `skills/amelie-ideenrunde/` (Empirische Primärquellen-Suche).
    * `skills/lacunar-bisociation/` (Analoge Kollision & lakunäre Lückenfindung).
    * `skills/asymmetric-inversion/` (Invertierte Reibungsmethode / Vollzugslücken).
  * **1 Reviewer & Vektor-Klassifikator:**
    * `skills/idea-reviewer/` (`idea-reviewer.skill`): 7-Vektoren-Audit (Novelty, Complexity, Possibility, Longevity, Civic SWOT, Tech Tree, Ground Truth) mit Logbuch in `06-suche/amelie-classification-log.md`.
  * **1 Packaging-Agent:**
    * `skills/dose-packer/` (`dose-packer.skill` & Subagent `dose-packer`): Schreibt zweisprachige Dossiers (`05-dosen/`, `en/05-dosen/`), verknüpft Dosen im React-Frontend (`src/data/dosen.ts`), synchronisiert Frontmatter und Caches (`export:data`).
  * **Orchestrierung (Team-Agenten):** `skills/amelie-orchestrator/` beschreibt die Teamrunde (Vorflug → 3 Engines parallel → Konvergenz-Merge → Reviewer → Packer → Demo-Builder → Bibliothekar → Abschluss). Die Rollen liegen als Subagenten in `.claude/agents/` (`ideen-scout`, `bisoziations-kollider`, `inversions-agent`, `idea-reviewer`, `dose-packer`, `demo-builder`, `bibliothekar`) mit disjunkten Schreibrechten.
  * **Aktueller Dosenstand:** 45 Dosen im Bestand, 103 Gräber. Neu verpackt: `strassennamen-pruefer` (Heimatgedächtnis-Runde 29.09.2026), `umsetzungsplan-register` (Offenlegungs-Runde Lauf A 28.09.2026), `vernichtungs-offenlegungsregister` (Teamrunde ESPR 28.09.2026), `abbundzeichen-fundbuch` (Holz-Runde 27.09.2026), `bleifrei-lotse` und `tarot-zustandsmaschine` (Arcana Schema).
* **Offenlegungs-Runde, Lauf A (lokal, 28.09.2026, Teamrunde 2 mit `venture-analyst`):**
  * Gleiches Thema wie Lauf B, parallel und ohne Absprache gelaufen; Abgleich im Prüfprotokoll. **Netz offen**, Normtexte als `[Seite]` gelesen (eur-lex nur über `publications.europa.eu/resource/celex/<CELEX>`).
  * 22 Engine-Kandidaten → 14 Ideen, zwei Dreifachfunde (EnEfG § 9, DSA Art. 15) → Reviewer → **1 Dose, 1 Needs Research (`wahlwerbe-herbarium`, 12/2026), 7 neue Gräber** (4 Überschneidungen mit Lauf B nicht doppelt begraben; Konfliktmineralien: A am Volltext → Grab, überholt B).
  * **`umsetzungsplan-register` gepackt** (25/35, `build_first`): offenes Register der veröffentlichten Umsetzungspläne nach § 9 EnEfG (BT-Drs. 21/8027; EED Art. 11 Abs. 2 sichert die Veröffentlichung). Nie „säumig“, keine Quote, kein Ranking. Schema gegen BAFA-Merkblatt **16.09.2026 (fünf Pflichtangaben)**. Empfänger DENEFF (Christian Noll) — **vor Versand verifizieren**. Keine Mail angelegt.
  * Scaffolding `07-demos/umsetzungsplan-register/` + Engine (89 Tests), drei echte Fixtures (Muster GmbH, Sanofi, VON ARDENNE) mit SHA-256; Registerkern aus `vernichtungs-offenlegungsregister` importiert.
  * **Venture-Spur:** 5 Firmenseiten-Zwillinge geprüft → 0 Leads, 5 Kills (Formulare, meist gratis). Nichts in `ventures/`.
  * **Lehre:** Vor Phase 0 `git fetch` und offene PRs/`claude/*`-Branches auf dasselbe Thema prüfen — zwei Sitzungen im selben Repo verdoppelten die Suche.

* **Offenlegung-Runde, Lauf B (Cloud-Sitzung, 28.09.2026, Teamrunde 2):**
  * Thema: Muster „Offenlegungspflicht ohne Register" auf LkSG, EUDR, CSRD, BattVO, VerpackG/PPWR übertragen. 15 Ideen → 0 frei, 3 verengt, 6 unklar, 6 besetzt → **0 Dosen** (Reviewer: keine `Dose Ready`), 6 neue Gräber (58 gesamt).
  * Muster trägt nur bei junger Pflicht ohne Registerträger (ESPR war die Ausnahme). Neue Vorfilter 0–4 im Playbook-Atlas. Empfehlung: Themenwechsel weg von EU-Compliance-Regimen.
  * `Needs Research` (je 20/35): Konfliktmineralien-Berichtsregister (DEKSOR/BGR), LkSG-Beschwerdekanal-Verzeichnis. Bausteine: Nenner-Schätzer → `vernichtungs-offenlegungsregister`.
  * Evidenz durchgehend nur Suchschnipsel (Egress-Proxy sperrt Behörden-Seiten).

* **Holz-Runde (27.09.2026):**
  * Drei Engines parallel auf das Thema Holz → 19 geprüfte Ideen (2 frei, 6 verengt, 3 unklar, 8 besetzt) → Reviewer → 1 Dose.
  * **`abbundzeichen-fundbuch` gepackt** (26/35, Tier 1): Zählfolgen-Prüfer für Abbundzeichen an Fachwerk; Empfänger IgB-Hausforschung. **Kontakt (Dr. Julia Ricker) nur aus Suchschnipsel — vor jedem Versand auf igbauernhaus.de verifizieren.** Keine Mail angelegt.
  * Scaffolding `07-demos/abbundzeichen-fundbuch/` + Engine `src/engine/abbundzeichen-fundbuch/` (44 Tests). Offen in Ticket 01: Fixture aus publiziertem Zeichenregister, statische Offline-Seite.
  * Baustein-Empfehlungen des Reviewers (nicht umgesetzt): Altholz-Weiche als dritter Ausgang der `sperrmuell-weiche`; Brennholz-Kaufprüfer als Modus von `wood-stove-firewood-moisture-estimator`. `Needs Research`: Dosenfund-Dolmetscher (historische Holzschutzmittelverzeichnisse DIBt/IfBt).
  * Evidenz dieser Runde nur Suchschnipsel: Die Netzwerk-Policy der Cloud-Umgebung sperrte Seitenabrufe (lfu.bayern.de, thuenen.de, …).

* **Teamrunde ESPR (28.09.2026, erste Orchestrierungs-Runde):**
  * Thema ESPR/DPP + Recht auf Reparatur (seit Inversion Run 2 dreimal übertragen). 16 Engine-Kandidaten → 11 Ideen (1 frei, 5 verengt, 1 unklar, 4 besetzt) → Reviewer → 1 Dose, 1 Needs Research, 9 Gräber.
  * **`vernichtungs-offenlegungsregister` gepackt** (24/35, `build_first`): **Dreifachfund** aller drei Engines. Offenes Register der Offenlegungen vernichteter unverkaufter Ware nach ESPR Art. 24 / DVO (EU) 2026/2; Kern ist ein deterministischer Anhang-I-Prüfer, der **nie „Verstoß" sagt** (die Pflicht ist bedingt). Empfänger DUH Kreislaufwirtschaft — **Ansprechperson vor Versand verifizieren**. Keine Mail angelegt.
  * Scaffolding `07-demos/vernichtungs-offenlegungsregister/` + Engine (28 Tests). **Schema `vorläufig`**, Fixtures synthetisch. Offen in Ticket 01: Normtext DVO 2026/2 Anhang I + ESPR Art. 24 lesen, Signify-Offenlegung GJ 2025 von Hand übertragen.
  * `reparaturfall-pflichtabgleich` (K3) ist `Needs Research`: ORDS-Datentest zuerst.
  * Evidenz nur Suchschnipsel (eur-lex, duh.de, repair.eu u. a. vom Proxy gesperrt).

* **PR-Triage & Ventures-Zweig (28.09.2026):**
  * **PR-Bereinigung:** Automatische Batch-Läufe produzierten über 100 PRs (viele Stubs & Duplikate). In zwei Triage-Runden wurden insgesamt 92 Duplikate und unvollständige Stubs geschlossen und deren Remote-Branches gelöscht (Queue von 68 auf 16 distinkte Cluster-Leads reduziert).
  * **Lokaler Branch `feat/venture-leads-round-2`:** Enthält die durch den `venture-analyst` bewerteten kommerziellen Zwillinge (`spdx-driftguard-ci` und `procure-lens-pro` sowie 10 Leads in `ventures/market-leads.json`).
  * **Eiserne Trennung:** Kommerzielle Produktkonzepte verbleiben auf `feat/venture-*`, während `main` 100 % CC0 Gemeingut bleibt. Für zukünftige Venture-Sessions: `git checkout feat/venture-leads-round-2`.

---

## 6. Checkliste vor dem Beenden einer Sitzung

- [ ] Laufen `npm run lint` und `npm test` komplett fehlerfrei durch?
- [ ] Wurden Änderungen an Dosen auch in `src/data/dosen.ts` eingepflegt und `npm run export:data` ausgeführt?
- [ ] Wurde das Prüfprotokoll (`06-suche/amelie-pruefprotokoll.md`) aktualisiert?
- [ ] Sind alle Git-Änderungen sauber committet und auf `origin/main` gepusht?

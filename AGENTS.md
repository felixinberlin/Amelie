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
  * `amelie-suchplaybook.md`: Die Heuristiken, Stoppregeln und erprobten Suchstrategien.
  * `amelie-inversions-log.md` & `amelie-bisoziation-log.md`: Operative Protokolle der Ideenfindung.
* **`08-friedhof/` (Rückwärts-Gedächtnis / Obduktionssaal):**
  * Enthält 58 beerdigte Ideen mit vollem Totenschein (`cause`, `killer`, `foundBy`, `stage`).
  * **Regel:** Vor jeder neuen Ideengenerierung ist der Gang über den Friedhof Pflicht, um keine Wiedergänger zu produzieren.

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

---

## 5. Aktueller Projektstand (Stand: 28. September 2026)

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
  * **Aktueller Dosenstand:** 44 Dosen im Bestand, 69 Gräber. Neu verpackt: `umsetzungsplan-register` (Offenlegungs-Runde Lauf A 28.09.2026), `vernichtungs-offenlegungsregister` (Teamrunde ESPR 28.09.2026), `abbundzeichen-fundbuch` (Holz-Runde 27.09.2026), `bleifrei-lotse` und `tarot-zustandsmaschine` (Arcana Schema).
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

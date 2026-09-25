# AGENTS.md — Leitfaden für KI-Assistenten in Amélie

Willkommen bei **Amélie**. Dieses Dokument ist die erste Anlaufstelle für jeden Agenten. Lies es zu Beginn jeder Sitzung, um ohne Raten sofort produktiv und konform mit den Projektregeln zu arbeiten.

---

## 1. Was ist Amélie?

Amélie ist ein offenes Projekt, das schlüsselfertige Software- und Datenwerkzeuge an Universitäten, Behörden, NGOs und Open-Source-Communities **verschenkt** (CC0 Public Domain).
* **Kein Pitching:** Wir verkaufen nichts, wollen keine Beratungsmandate und haken niemals nach.
* **Vier unumstößliche Zustellregeln:**
  1. *Geschenk-Prinzip:* Die Idee wird bedingungslos verschenkt.
  2. *Reale Person & Institution:* Adressiert an echte Fachleute mit konkretem Mandat.
  3. *CC0 & Druckfreiheit:* Keine Vorbedingungen, kein Nachfassen.
  4. *Lauffähiges Scaffolding:* Jede Dose hat ein Open-Source-Repository / Scaffolding mit Code und Tests (`07-demos/`).

---

## 2. Die Gedächtnis-Architektur: `06-suche` & `08-friedhof`

Amélie speichert sein Gedächtnis nicht in Chat-Transkripten, sondern im Dateisystem:

* **`06-suche/` (Vorwärts-Gedächtnis):**
  * `amelie-pruefprotokoll.md`: Das lückenlose Logbuch jeder geprüften Idee mit Schiedsrichter-Urteil (`frei`, `verengt`, `unklar`, `besetzt`). **Jede neue oder geänderte Dose muss hier sofort eingetragen werden.**
  * `amelie-suchplaybook.md`: Die Heuristiken, Stoppregeln und erprobten Suchstrategien.
  * `amelie-inversions-log.md` & `amelie-bisoziation-log.md`: Operative Protokolle der Ideenfindung.
* **`08-friedhof/` (Rückwärts-Gedächtnis / Obduktionssaal):**
  * Enthält 33 beerdigte Ideen mit vollem Totenschein (`cause`, `killer`, `foundBy`, `stage`).
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

## 5. Aktueller Projektstand (Stand: 25. September 2026)

* **`kristallwachstum-3d` (Dose & Mail 9):**
  * **Ticket 01 ist ABGESCHLOSSEN:** WebGPU-Pipeline (`webgpuPipeline.ts`) mit CPU-Voxel-Laufzeitkern, 50-Schritte-Phasenfeld-Glättung, Live-$D_f$-Literaturvergleich, 6 Gefügelinsen, 3D-Kamera und STL-Export sind verifiziert (8 Tests in `engine.test.ts`).
  * **Ticket 02 ist BEREIT:** GPU-Marching-Cubes Isosurface-Extraktion & Mehrfarbiger 3MF-Farbexport (`07-demos/kristallwachstum-3d/ticket-02-gpu-marching-cubes-3mf.md`).
  * **Mail 9:** An Prof. Dr. Timm John (FU Berlin Geowissenschaften) ist auditiert und versandfertig.
* **Ideenfindung / Skills:**
  * Neuer Skill `skills/asymmetric-inversion/` (Invertierte Reibungsmethode).
  * Erster Kandidat: `hof-entkoppler` in `src/data/unpacked.ts` eingetragen.

---

## 6. Checkliste vor dem Beenden einer Sitzung

- [ ] Laufen `npm run lint` und `npm test` komplett fehlerfrei durch?
- [ ] Wurden Änderungen an Dosen auch in `src/data/dosen.ts` eingepflegt und `npm run export:data` ausgeführt?
- [ ] Wurde das Prüfprotokoll (`06-suche/amelie-pruefprotokoll.md`) aktualisiert?
- [ ] Sind alle Git-Änderungen sauber committet und auf `origin/main` gepusht?

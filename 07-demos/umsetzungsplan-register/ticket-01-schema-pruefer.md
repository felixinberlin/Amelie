# Ticket 01: Schema aus dem BAFA-Merkblatt, ein Prüfer, drei echte Pläne

**Komponente:** `07-demos/umsetzungsplan-register` / `src/engine/umsetzungsplan-register`
**Status:** Offen (Prüfer, Register, Auswertung und Tests fertig; Merkblatt-Abgleich und drei echte Fixtures stehen aus)
**Zuständigkeit:** Civic Tech / Energie-Vollzug
**Zugehörige Dose:** [`05-dosen/umsetzungsplan-register.md`](../../05-dosen/umsetzungsplan-register.md) · [Die Dose online](https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register)

---

## 1. Problemstellung & Ziel

Umsetzungspläne nach § 9 EnEfG erscheinen verstreut auf Firmenwebsites und in Jahresberichten. Ein reiner TypeScript-Kern `pruefeUmsetzungsplan(plan)` prüft einen übertragenen Plan gegen die 7 Pflichtangaben des BAFA-Merkblatts und meldet jede Auffälligkeit als **Frage** mit Regel-ID. Das Register kennt nur **„gefunden"** und **„kein Plan gefunden (Stand, Suchweg)"** — nie „säumig" oder „Verstoß". Ausgabe nur als Aggregat mit Selektionshinweis im Kopf, ohne Ranking.

---

## 2. Aufgabenpakete

- [ ] **Task 0: Aktuelle Merkblattfassung lesen (Vorbedingung)**
  - Die aktuell gültige Fassung des BAFA-Merkblatts zum EnEfG auf bafa.de lesen (gelesen ist nur 02/2025; 10/2025 und 05/2026 sind ungelesen).
  - **Offen.** Bis dahin trägt das Schema `"schemaStatus": "vorläufig"`. Danach Spalten, Vokabular und `x-annahmen` korrigieren und `SCHEMA_STATUS` auf `gegen Merkblatt <Fassung> geprüft am JJJJ-MM-TT` setzen.

- [x] **Task 1: Vorläufiges Schema (`umsetzungsplan-schema.json`)**
  - Draft-07; sieben Pflichtangaben, Statusvokabular, `rechtsstand` (a. F. / n. F.), `merkblattFassung`, jedes Feld darf `unbekannt` sein (Pläne ohne Standardtabelle wie im SWU-Fall).

- [x] **Task 2: Deterministischer Prüfer (`pruefeUmsetzungsplan`)**
  - **U0-KEINE-TABELLE**, **U1-PFLICHTANGABE**, **U2-STATUS**, **U3-ZEITRAHMEN**, **U4-INVESTITION**, **U5-MERKBLATT**. Jeder Befund ist eine Frage (De/En).

- [x] **Task 3: Register und Auswertung (`erstelleRegister`, `erstelleAuswertung`, `registerAlsCsv`)**
  - Zwei Status; Stand und Suchweg Pflicht; Kopf mit Selektionshinweis; Statusverteilung, Statusquote über Maßnahmen, Investitionssumme der offenen Maßnahmen; kein Ranking, keine Quote gegen die 16.461-Schätzung.

- [x] **Task 4: Tests (Ziel ≥ 15, erreicht 29)**
  - Vollständiger Plan, fehlende Pflichtangabe, Status außerhalb des Vokabulars, Zeitrahmen nicht lesbar, Investition nicht numerisch, Plan ohne Tabelle, Rechtsstand a. F. / n. F., neutrale Sprache, kein Ranking, kein Nenner, Selektionshinweis, Schemastand.

- [ ] **Task 5: Drei echte Fixtures von Hand übertragen**
  - Muster GmbH aus dem Merkblatt, Sanofi-Aventis Deutschland (11/2025), VON ARDENNE (07.04.2025), jeweils mit Quell-URL, Abrufdatum und Archiv-Snapshot (vollständige URLs vor Nutzung ermitteln).
  - **Offen:** Die PDFs wurden beim Bau nicht gelesen. Es gibt bewusst **keine** Fixture, die echte Zahlen behauptet; alle vorhandenen sind `synthetisch: true` mit erfundenen Firmen und `example.org`-URLs.

---

## 3. Verifikation

```bash
npx vitest run src/engine/umsetzungsplan-register
```

---
Lizenz: CC0 1.0 Public Domain.

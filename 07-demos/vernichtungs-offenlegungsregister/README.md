# Vernichtungs-Offenlegungsregister — Scaffolding & Offenlegungs-Prüfer

> Ein deterministischer Prüfer für die Offenlegungen nach Art. 24 ESPR über vernichtete unverkaufte Verbraucherprodukte, gegen ein **vorläufiges** Anhang-I-Schema (DVO (EU) 2026/2). Jeder Befund ist eine **Frage**, und das Register kennt nur zwei Status: **„gefunden"** oder **„keine Offenlegung gefunden (Stand, Suchweg)"**.
> *CC0 / Public-Domain-Geschenk für die Deutsche Umwelthilfe e.V. (DUH), Bereich Kreislaufwirtschaft.*
>
> *(English: Destruction Disclosure Register — a deterministic checker for Art. 24 ESPR disclosures on discarded unsold consumer products, against a **provisional** Annex I schema. Every finding is a **question**; the register knows only two statuses: **found** or **no disclosure found (as of, search path)**.)*

---

## 1. Problem & Lücke

Seit dem Geschäftsjahr 2025 müssen große Unternehmen, die unverkaufte Verbraucherprodukte entsorgen, jährlich offenlegen, wie viel, warum und auf welchem Weg (Art. 24 ESPR, VO (EU) 2024/1781). Die Angaben stehen verstreut auf Firmenseiten, in PDFs und in Nachhaltigkeitsberichten, aber nirgends nebeneinander. Ab Offenlegungsjahr 2029 gilt das Tabellenformat aus Anhang I der DVO (EU) 2026/2; bis dahin ist das Format frei.

*The mandatory figures on destroyed goods appear every year on hundreds of company pages and PDFs, but nowhere side by side.*

---

## 2. Der Sicherheitsnachweis (Safety Case)

> [!CAUTION]
> **Das Register ist kein Pranger. Es sagt nie „Verstoß", „säumig" oder „violation". Die Pflicht ist bedingt (nur wer entsorgt, muss offenlegen), und es gibt keine Liste der Verpflichteten — „keine Offenlegung gefunden" kann auch „nichts entsorgt" heißen.**
> *The register never says "violation". The duty is conditional and there is no list of obliged companies.*

Harte Invarianten (jede durch einen Test abgesichert):

1. **Zwei Status, sonst nichts.** `RegisterStatus = 'gefunden' | 'keine Offenlegung gefunden'`. Letzterer trägt immer Stand (ISO-Datum) und Suchweg (Orte + Suchbegriffe); ohne beides wirft der Kern.
2. **Kein Gesamturteil.** `pruefeOffenlegung()` liefert Befunde und unbekannte Felder, aber kein `ok`, `grün` oder `erfüllt`. Null Befunde heißt nur: keine Regel hat eine Frage ausgelöst.
3. **Befunde sind Fragen.** Jeder Befund trägt Regel-ID, `art: 'frage'` und Klartext De/En, der mit `?` endet — der Kern wirft sonst.
4. **Neutrale Sprache als Code, nicht als Konvention.** `assertNeutraleSprache()` läuft über jeden erzeugten Text; übertragener Freitext mit Vorwurfswort wird nicht zitiert, sondern nummeriert.
5. **Jede Zeile mit Herkunft.** „gefunden" nur mit Quell-URL und Abrufdatum; Archiv-Snapshot optional, aber vorgesehen.
6. **Kein stilles Raten.** Negative Mengen, Anteile außerhalb 0–100, unbekannte Behandlungswege, doppelte Positions-IDs und Widersprüche (gleiches Unternehmen × GJ als gefunden *und* nicht gefunden) werfen einen Fehler.
7. **Offline, ohne Modell.** Keine Importe, kein `fetch` (per Test auf den Quelltext geprüft).

---

## 3. Schema-Stand: vorläufig

> [!WARNING]
> **`schemaStatus: "vorläufig"`.** Der Normtext der DVO (EU) 2026/2 (Art. 2/3, Anhang I), der Delegierten VO (EU) 2026/296 und von ESPR Art. 24 Abs. 1 wurde **nicht gelesen** — der Seitenabruf war gesperrt (`EGRESS_BLOCKED`). Das Schema behauptet deshalb keine Feldnummern aus Anhang I.
> *The legal text was not read. The schema claims no Annex I field numbers.*

Die sechs Fachfelder sind Annahmen aus Sekundärquellen (Kanzlei- und Anbieterschnipsel) und in `anhang1-schema.json` unter `x-annahmen` sowie im Kern unter `ANNAHMEN` einzeln mit Herkunft benannt:

| Feld | Annahme | Herkunft |
|---|---|---|
| `stueck` | Menge je Warengruppe in Stück | Kanzleischnipsel zu Art. 24 Abs. 1 |
| `gewichtKg` | Gewicht je Warengruppe in kg | Kanzlei-/Anbieterschnipsel zu Anhang I |
| `gruende` | Codes aus der Ausnahmeliste (Art. 25 Abs. 5 ESPR, präzisiert durch Delegierte VO (EU) 2026/296) — sinngemäß, nicht wortgleich | Kanzleischnipsel |
| `behandlungswege` | Anteile in % entlang der Abfallhierarchie (Vorbereitung zur Wiederverwendung, Wiederaufbereitung, Recycling, sonstige Verwertung, Beseitigung) | Schnipsel zu Art. 24 Abs. 1; Prozentform angenommen |
| `cnCode` | achtstelliger KN-Code | Anbieterschnipsel zu Anhang I |
| `geschaetzt` | Kennzeichnung gemessen/geschätzt | Kanzleischnipsel zu DVO 2026/2 |

Die Markierung fällt erst, wenn das Schema Feld für Feld gegen den Normtext geprüft ist (`gegen Normtext geprüft am …`).

---

## 4. Architektur-Übersicht

```
Offenlegung (von Hand oder bestätigter LLM-Vorschlag → anhang1-schema.json)
   │   + Quelle { url, abgerufenAm, archivSnapshot }
   ▼
pruefeOffenlegung()   deterministisch, ohne Netz, ohne Modell
   │   V0 Freitext ohne Tabelle      V1 Prozentsumme Behandlungswege ≠ 100 (±0,5)
   │   V2 Grund außerhalb der Liste  V3 KN-Code formal (8 Stellen, Kap. 01–97, ≠ 77)
   │   V4 Stück ↔ Gewicht            V5 Schätzkennzeichnung fehlt
   ▼
PruefErgebnis  { schemaStatus, befunde[{regel, art:'frage', position, frageDe, frageEn}], felderUnbekannt[] }
   │
   ▼
erstelleRegister(offenlegungen, suchnachweise)
   │   gefunden                    ← Offenlegung mit Quelle
   │   keine Offenlegung gefunden  ← Suchnachweis mit Stand + Suchweg
   ▼
registerAlsCsv()   statische CSV/JSON je Unternehmen × Geschäftsjahr, keine Quoten
```

**Regeln im Detail / rules:**

| ID | Auslöser | Frage (Kurzform) |
|---|---|---|
| `V0-FREITEXT` | Format `freitext` | Lassen sich die Felder von Hand übertragen? |
| `V1-PROZENTSUMME` | Summe der Wegeanteile weicht um mehr als 0,5 Punkte von 100 ab | Fehlt ein Behandlungsweg? / Ist ein Weg doppelt gezählt? |
| `V2-GRUND` | Grund nicht auf der vorläufigen Ausnahmeliste, oder kein Grund übertragen | Entspricht er einer Ausnahme nach Art. 25 Abs. 5, oder ist es ein freier Grund? |
| `V3-CN-CODE` | nicht 8 Ziffern, nur HS-Ebene (4/6), oder Kapitel außerhalb 01–97 bzw. 77 | Ist der Code richtig übertragen? |
| `V4-STUECK-GEWICHT` | kg je Stück außerhalb einer groben Spanne je KN-Kapitel (Heuristik, keine Norm), oder eine Angabe null und die andere nicht | Sind Einheiten vertauscht? |
| `V5-SCHAETZUNG` | Mengen ohne Kennzeichnung gemessen/geschätzt | Sagt die Offenlegung, wie sie ermittelt wurden? |

---

## 5. Enthaltene Module

* `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.ts` — Prüfer `pruefeOffenlegung`, Register `erstelleRegister`, Export `registerAlsCsv`, Hilfen `cnCodeProblem`, `assertNeutraleSprache`, Konstanten `SCHEMA_STATUS`, `ANNAHMEN`, `AUSNAHME_GRUENDE`, `BEHANDLUNGSWEGE`.
* `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.test.ts` — Vitest-Suite (28 Fälle) inkl. kleinem JSON-Schema-Prüfer.
* `07-demos/vernichtungs-offenlegungsregister/anhang1-schema.json` — **vorläufiges** Anhang-I-Schema (Draft-07) mit `schemaStatus`, `x-annahmen` und `x-ausnahmeGruende`.
* `07-demos/vernichtungs-offenlegungsregister/data/synthetische-offenlegungen.json` — 5 **synthetische** Offenlegungen erfundener Firmen (Beispiel GmbH, Muster Mode AG, Exempel Schuh KG, Probe Leuchten GmbH, Fiktiv Handel SE) und 1 synthetischer Suchnachweis, alle `synthetisch: true`, URLs auf `example.org`.

> [!NOTE]
> **Ehrlichkeit / honesty:** Alle Fixtures sind synthetisch. Die erste echte Fixture — die **Signify-Offenlegung zum GJ 2025** (PDF vom 04.05.2026) — ist **noch nicht** übertragen, weil das PDF in dieser Umgebung nicht abrufbar war. Das bleibt in Ticket 01 offen.
> *All fixtures are synthetic. Signify's FY 2025 disclosure has not been transcribed yet; this stays open in Ticket 01.*

---

## 6. Entwicklungs-Tickets

- [ ] [Ticket 01: Anhang I als Schema, ein Prüfer, eine echte Offenlegung](./ticket-01-anhang1-pruefer.md) — Prüfer, Register und Tests fertig; offen: Normtext lesen, Signify-Fixture von Hand übertragen.

---

## 7. Live-Demo

* **Die Dose im Web:** [felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister](https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister)
* **Lokal testen / run locally:** `npx vitest run src/engine/vernichtungs-offenlegungsregister`

---
Lizenz: CC0 1.0 Public Domain.

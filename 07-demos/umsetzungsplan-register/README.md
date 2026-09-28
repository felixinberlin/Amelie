# Umsetzungsplan-Register — Scaffolding & Umsetzungsplan-Prüfer

> Ein deterministischer Prüfer für die Umsetzungspläne, die Unternehmen nach **§ 9 EnEfG** (und EED Art. 11 Abs. 2) veröffentlichen müssen. Er prüft jeden Plan gegen die Angaben des **BAFA-Merkblatts EnEfG** und gibt je Plan die **Statusverteilung** und das **Investitionsvolumen der offenen Maßnahmen** aus. Jeder Befund ist eine **Frage**. Das Register kennt nur **„gefunden"** oder **„kein Plan gefunden (Stand, Suchweg)"**.
> *CC0 / Public-Domain-Geschenk für die DENEFF e.V. (Deutsche Unternehmensinitiative Energieeffizienz).*
>
> *(English: Implementation Plan Register — a deterministic checker for the plans companies must publish under § 9 EnEfG. It reports the status distribution and the investment volume of open measures per plan. Every finding is a **question**; the register knows only **found** or **no plan found (as of, search path)**.)*

---

## 1. Problem & Lücke

Unternehmen oberhalb einer Verbrauchsschwelle müssen nach dem Energieaudit einen Umsetzungsplan für alle wirtschaftlichen Endenergieeinsparmaßnahmen erstellen und **veröffentlichen**. Umsetzen müssen sie die Maßnahmen nicht. Die Pläne liegen verstreut als PDF auf Firmenseiten; es gibt kein Register und keine Liste der Verpflichteten. Jede Maßnahme im Plan ist per Definition wirtschaftlich (§ 9 Abs. 2), „Offen" heißt also: wirtschaftlich, aber noch nicht umgesetzt.

*Thousands of companies must publicly state which economic savings measures are still open, but nobody counts how many stay open.*

---

## 2. Der Sicherheitsnachweis (Safety Case)

> [!CAUTION]
> **Das Register ist kein Pranger und keine Vertriebsliste. Es sagt nie „säumig", „Verstoß", „violation" oder „fehlt". Die Pflicht ist bedingt: Die Verbrauchsschwelle ist nicht öffentlich, Unternehmen mit EnMS/UMS können anders berichten, Geschäftsgeheimnisse dürfen gewahrt werden, und die Frist läuft ab einem Audit, dessen Datum niemand kennt. „Kein Plan gefunden" beweist nichts.**
> *The register never says "violation". The duty is conditional; "no plan found" proves nothing.*

Harte Invarianten (jede durch einen Test abgesichert):

1. **Zwei Status, sonst nichts.** `PlanRegisterStatus = 'gefunden' | 'kein Plan gefunden'`. Letzterer trägt immer Stand (ISO-Datum) und Suchweg (Orte + Suchbegriffe); ohne beides wirft der Registerkern.
2. **Kein Gesamturteil.** `pruefeUmsetzungsplan()` liefert Befunde, unbekannte Felder, Statusverteilung und Beträge, aber kein `ok`, `grün` oder `erfüllt`.
3. **Befunde sind Fragen.** Regel-ID, `art: 'frage'`, Klartext De/En mit `?` am Ende, sonst wirft der Kern.
4. **Keine Quote, kein Nenner.** Die Drucksache schätzt rund 16.461 Verpflichtete nach der Novelle. Das ist eine Behördenschätzung, keine Liste. Keine Ausgabe rechnet dagegen; die Auswertung sagt nur „N gefundene Pläne, davon M Maßnahmen offen, Investitionsvolumen offen X €".
5. **Kein Ranking.** Die Auswertung nennt keine Unternehmen und ist unabhängig von der Eingabereihenfolge. Das Register ist alphabetisch sortiert und hat keine Betragsspalte.
6. **Selektionshinweis im Kopf jeder Auswertung:** „Veröffentlicht haben die, die veröffentlichen. Die Umsetzungsquote der gefundenen Pläne beschreibt diese Pläne, nicht die Branche und nicht alle Verpflichteten."
7. **Kein stilles Umdeuten.** Ein Status außerhalb der Merkblatt-Kategorien (z. B. „geplant", „laufend") wird gezählt und erfragt, aber nie still als „Offen" gebucht.
8. **Neutrale Sprache als Code.** `assertNeutral()` = Sprachwächter des Registerkerns plus „fehlt"/„Pranger"; übertragener Text mit Vorwurfswort wird nicht zitiert.
9. **Offline, ohne Modell.** Einziger Import ist der Registerkern; kein `fetch` (per Test geprüft).

---

## 3. Schema-Stand: versioniert nach Merkblattfassung

> [!IMPORTANT]
> **Das Merkblatt hat sich geändert.** Die Dose ging von **sieben** Pflichtangaben aus (Merkblatt 12.02.2025, Reviewer-Lesung). Die **aktuell gültige Fassung vom 16.09.2026** (am 28.09.2026 auf bafa.de abgerufen und Abschnitt 5 selbst gelesen) nennt nur noch **fünf**: Priorisierung, Bezeichnung, kalkuliertes Investitionsvolumen, Zeitrahmen, Umsetzungsfortschritt. Herkunft und verantwortliche Person sind seit der **7. Änderung (30.04.2026, „Reduzierung und Klarstellung der Inhalte")** nicht mehr im Muster.
> *The current BAFA guidance (16.09.2026) lists five items, not seven.*

| Fassung | Pflichtangaben | `schemaStatus` | Lesestand |
|---|---|---|---|
| **16.09.2026** (Standard) | `prioritaet`, `massnahme`, `investitionsvolumen`, `zeitrahmen`, `status` | `gegen Merkblatt 16.09.2026 geprüft am 2026-09-28` | Abschnitt 5 selbst gelesen, PDF-sha256 `1a62fa7d…` |
| 12.02.2025 | zusätzlich `herkunft`, `verantwortlich` | `vorläufig` | **nicht selbst gelesen**, Angaben aus der Reviewer-Lesung |

Was das Merkblatt 16.09.2026 außerdem sagt und der Prüfer umsetzt:

* **Investitionsvolumen** darf aufgerundet oder als **Bandbreite** stehen („2.000 € - 5.000 €", „bis 20.000 €"); optional steht nur das **Gesamtvolumen** (Fußnote * zum Muster) — dann fragt der Prüfer nicht nach Einzelwerten.
* **Zeitrahmen** „bis wann die Umsetzung … abgeschlossen sein soll", mit Monat und Jahr. Der Prüfer liest auch Quartale („Q2 - Q3 2024") und mehrteilige Angaben („Q2/2024 & Q1 - Q2/2026").
* **Status** „kann" in den Kategorien Offen / In Bearbeitung / Abgeschlossen erfolgen. Das Vokabular ist also nicht zwingend — deshalb ist ein anderes Wort eine **Frage**, keine Beanstandung.

Das Feld **`rechtsstand`** (`a. F.` / `n. F.`) hält fest, unter welchem § 9 ein Plan steht. Beide Fassungen des Merkblatts beschreiben § 9 a. F.; ein Plan nach n. F. löst Regel U7 aus, bis es ein Merkblatt zur Novelle gibt.

---

## 4. Architektur-Übersicht

```
Umsetzungsplan-PDF ──(von Hand, wortgetreu)──▶ umsetzungsplan-schema.json
   │   + Quelle { url, abgerufenAm, sha256, archivSnapshot }  + rechtsstand + merkblattFassung
   ▼
pruefeUmsetzungsplan(plan, { fassung })   deterministisch, ohne Netz, ohne Modell
   │   U0 Freitext ohne Tabelle            U1 Angabe der Fassung nicht übertragen
   │   U2 Status außerhalb der Kategorien  U3 Zeitrahmen nicht lesbar / vertauscht
   │   U4 Investitionsvolumen kein Betrag  U5 Summenzeile ≠ Summe der Zeilen
   │   U6 Zeitrahmen vor Planstand abgelaufen, Status ≠ Abgeschlossen
   │   U7 Rechtsstand des Plans ≠ Rechtsstand des Merkblatts
   ▼
PlanErgebnis { befunde[], felderUnbekannt[], statusVerteilung, investitionOffen, … }
   │
   ├──▶ werteAus(ergebnisse)  Selektionshinweis · N Pläne · M offen · X € offen · keine Namen, keine Quote
   │
   └──▶ erstellePlanRegister(plaene, suchnachweise)
            │   Adapter auf erstelleRegister() aus vernichtungs-offenlegungsregister
            │   gefunden            ← Plan mit Quelle
            │   kein Plan gefunden  ← Suchnachweis mit Stand + Suchweg
            ▼
        planRegisterAlsCsv()  über registerAlsCsv() des Registerkerns
```

| ID | Auslöser | Frage (Kurzform) |
|---|---|---|
| `U0-FREITEXT` | Format `freitext` | Lassen sich die Felder von Hand übertragen? |
| `U1-ANGABE` | Angabe der gewählten Fassung in keiner / einer Zeile übertragen | Steht sie an anderer Stelle? / Wurde sie übersprungen? |
| `U2-STATUS` | Status nicht Offen / In Bearbeitung / Abgeschlossen (Groß-/Kleinschreibung egal) | Welcher Kategorie entspricht er? |
| `U3-ZEITRAHMEN` | nicht als Monat/Quartal + Jahr lesbar, oder Ende vor Beginn | Wie ist er gemeint? / Vertauscht? |
| `U4-INVESTITION` | weder Betrag noch Bandbreite, oder Untergrenze > Obergrenze | Bewusst nicht genannt (Geschäftsgeheimnis)? |
| `U5-SUMME` | Summenzeile liegt außerhalb der Summe der Einzelwerte (±1 €) | Zeile nicht übertragen? |
| `U6-ZEITRAHMEN-ABGELAUFEN` | Ende < Planstand, Status nicht „Abgeschlossen" | Ist der Status noch aktuell? |
| `U7-RECHTSSTAND` | `rechtsstand` des Plans ≠ Rechtsstand der Merkblattfassung | Gibt es schon ein Merkblatt dazu? |

---

## 5. Enthaltene Module

* `src/engine/umsetzungsplan-register/umsetzungsplanPruefer.ts` — `pruefeUmsetzungsplan`, `werteAus`, `erstellePlanRegister`, `planRegisterAlsCsv`, Leser `leseBetrag` und `leseZeitrahmen`, `assertNeutral`, Konstanten `FASSUNGEN`, `STATUS_VOKABULAR`, `SELEKTIONSHINWEIS_DE/EN`. Importiert `erstelleRegister`, `registerAlsCsv`, `assertNeutraleSprache`, `istNeutral` aus `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.ts`.
* `src/engine/umsetzungsplan-register/umsetzungsplanPruefer.test.ts` — Vitest-Suite (89 Fälle) inkl. kleinem JSON-Schema-Prüfer.
* `07-demos/umsetzungsplan-register/umsetzungsplan-schema.json` — Schema (Draft-07) mit `schemaStatus`, `x-fassungen` und `x-statusVokabular`.
* `07-demos/umsetzungsplan-register/data/umsetzungsplaene.json` — **drei von Hand übertragene Pläne**, am 28.09.2026 abgerufen und gelesen, mit URL und sha256:
  * **Muster GmbH** — Musterbeispiel aus dem Merkblatt 16.09.2026 (S. 14–15), 4 Zeilen, Bandbreiten. Kein echtes Unternehmen (`datenart: merkblatt-muster`).
  * **Sanofi-Aventis Deutschland GmbH**, Plan 11/2025 — 12 Zeilen, sieben Spalten, Summenzeile 19.712.576,00 €.
  * **VON ARDENNE GmbH**, Plan vom 07.04.2025 — 9 Zeilen, sieben Spalten, Status „abgeschlossen" / „laufend" / „geplant".
* `07-demos/umsetzungsplan-register/data/synthetische-faelle.json` — 8 **synthetische** Randfälle erfundener Firmen (`example.org`) für U0–U7 und 1 synthetischer Suchnachweis.

**Was die drei Pläne zeigen:**

| Plan | Befunde | Offen | In Bearbeitung | Abgeschlossen | außerhalb | Investition offen |
|---|---|---|---|---|---|---|
| Muster GmbH (Merkblatt) | 0 | 3 | 1 | 0 | 0 | 32.000 € – 45.000 € |
| Sanofi 11/2025 | 0 | 0 | 11 | 1 | 0 | 0 € |
| VON ARDENNE 04/2025 | 8 × U2 | 0 | 0 | 1 | 8 (6 „geplant", 2 „laufend") | 0 € (außerhalb: 2.059.771 €) |

Die beiden veröffentlichten Pläne haben also **keine einzige Maßnahme mit dem Status „Offen"**. Bei VON ARDENNE heißen die sechs noch nicht begonnenen Maßnahmen (1.804.771 €) „geplant". Der Prüfer rechnet sie nicht in „Offen" um, er fragt nach. Genau diese Stelle muss ein Kurator entscheiden, bevor ein Aggregat über viele Pläne etwas aussagt (siehe Ticket 01, Task 6).

> [!NOTE]
> **Ehrlichkeit / honesty:** Beide Unternehmenspläne und das Merkblatt-Muster sind selbst gelesen und wortgetreu übertragen (einschließlich „Unternehmensbeschluß Q4I2023"). Die Untergrenze „bis 20.000 €" setzt der Prüfer auf 0 €; das Merkblatt selbst summiert dieselbe Zeile als 20.000 € (Summenzeile 52.000–65.000 €). Archiv-Snapshots der drei PDFs sind noch nicht angelegt.

---

## 6. Entwicklungs-Tickets

- [ ] [Ticket 01: Pflichtangaben als Schema, ein Prüfer, drei echte Pläne](./ticket-01-pflichtangaben-pruefer.md) — Schema, Prüfer, Register, Auswertung und 89 Tests fertig; offen: Archiv-Snapshots, Merkblatt 12.02.2025 selbst lesen, Kuratorentscheid zu Statuswörtern außerhalb des Vokabulars.

---

## 7. Live-Demo

* **Die Dose im Web:** [felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register](https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register)
* **Schwester-Dose (Registerkern):** [felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister](https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister)
* **Lokal testen / run locally:** `npx vitest run src/engine/umsetzungsplan-register`

---
Lizenz: CC0 1.0 Public Domain.

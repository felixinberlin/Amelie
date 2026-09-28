# Umsetzungsplan-Register — Scaffolding & Plan-Prüfer

> Ein deterministischer Prüfer für die Umsetzungspläne nach § 9 EnEfG gegen die 7 Pflichtangaben des BAFA-Merkblatts, gegen ein **vorläufiges** Schema. Jeder Befund ist eine **Frage**, und das Register kennt nur zwei Status: **„gefunden"** oder **„kein Plan gefunden (Stand, Suchweg)"**.
> *CC0 / Public-Domain-Geschenk für DENEFF e.V. (Ansprechperson vor Versand verifizieren).*
>
> *(English: Implementation Plan Register — a deterministic checker for implementation plans published under § 9 EnEfG against the 7 mandatory fields of the BAFA leaflet, against a **provisional** schema. Every finding is a **question**; the register knows only two statuses: **found** or **no plan found (as of, search path)**.)*

---

## 1. Problem & Lücke

Unternehmen mit hohem Energieverbrauch müssen nach einem Energieaudit binnen drei Monaten Umsetzungspläne für die wirtschaftlichen Maßnahmen erstellen und veröffentlichen (§ 9 EnEfG). Die Pläne stehen verstreut auf Firmenseiten und in Jahresberichten. Ein Sammler fehlt, und das Bundesratsverfahren zur Novelle läuft (Bundesrat will die Veröffentlichungspflicht streichen). Der Lückensatz: Tausende Firmen müssen öffentlich sagen, welche wirtschaftlichen Sparmaßnahmen noch offen sind, aber niemand zählt, wie viele liegen bleiben.

*Plans are scattered; no aggregator exists; nobody counts how many economic measures stay open.*

---

## 2. Der Sicherheitsnachweis (Safety Case)

> [!CAUTION]
> **Das Register ist kein Pranger und kein Ranking. Es sagt nie „säumig", „Verstoß", „violation" oder „fehlt". Die Pflicht ist bedingt (Verbrauchsschwelle von außen unbekannt, EnMS/UMS-Ausnahme nach § 9 Abs. 6, Schwärzung nach Abs. 5, Frist ab Audit), und es gibt keine Liste der Verpflichteten. „Kein Plan gefunden" ist kein Urteil über ein Unternehmen.**
> *The register never says "delinquent" or "violation". The duty is conditional and there is no list of obliged companies.*

Harte Invarianten (jede durch einen Test abgesichert):

1. **Zwei Status, sonst nichts.** `RegisterStatus = 'gefunden' | 'kein Plan gefunden'`. Letzterer trägt immer Stand (ISO-Datum) und Suchweg (Orte + Suchbegriffe); ohne beides wirft der Kern.
2. **Kein Gesamturteil, kein `ok`.** `pruefeUmsetzungsplan()` liefert Befunde und unbekannte Felder. Null Befunde heißt nur: keine Regel hat eine Frage ausgelöst.
3. **Befunde sind Fragen** mit Regel-ID, `art: 'frage'` und Klartext De/En, der mit `?` endet.
4. **Neutrale Sprache als Code.** `assertNeutraleSprache()` läuft über jede erzeugte Ausgabe (Basisliste aus dem `vernichtungs-offenlegungsregister`, erweitert um „fehlt", „fehlend", „missing").
5. **Kein Ranking, keine Sortierung nach Firma oder Volumen.** Ausgaben folgen der Erfassungsreihenfolge; Ausgabe nur als Aggregat „N gefundene Pläne, davon M Maßnahmen offen, Investitionsvolumen der offenen Maßnahmen" plus Einzelnachweis. Sonst wäre die Tabelle eine Lead-Liste für Contractoren.
6. **Selektionshinweis fest im Kopf jeder Auswertung** (`Auswertung.kopf`, erste Zeilen von `auswertungAlsText`, Kommentarzeilen von `registerAlsCsv`): Veröffentlichen tun die Sorgfältigen; die Umsetzungsquote der gefundenen Pläne ist eine Obergrenze-Tendenz der Disziplinierten und kein Branchenmaß.
7. **Keine Quote gegen die Schätzung.** Die Behördenschätzung (~16.461 Verpflichtete, BT-Drs. 21/8027) steht nur als Zitat im Kopf, nie als Nenner.
8. **Kein stilles Raten.** Ungültige URL, Datum, Rechtsstand, fehlende `merkblattFassung`, doppelte IDs und Widersprüche (gefunden *und* nicht gefunden) werfen einen Fehler.
9. **Offline, ohne Modell.** Kein `fetch`, einziger Import ist die Wortliste aus dem Vorbild (per Test geprüft).

---

## 3. Schema-Stand: vorläufig

> [!WARNING]
> **`schemaStatus: "vorläufig"`.** Gelesen wurde das BAFA-Merkblatt in der Fassung **02/2025** (Kopie auf visalvis.de). Die Fassungen **10/2025 und 05/2026** sind nur aus Suchschnipseln bekannt und **ungelesen**; die aktuell gültige Fassung auf bafa.de wurde **nicht gelesen**.

Das Schemafeld `merkblattFassung` versioniert jeden Plan gegen die Fassung, nach der er erstellt wurde. Weicht sie von der gelesenen ab, stellt Regel U5 eine Frage. Der Schemastand fällt erst auf `gegen Merkblatt <Fassung> geprüft am …`, wenn die gültige Fassung gelesen und Feld für Feld verglichen ist. Das Schema trägt außerdem `rechtsstand` (a. F. / n. F.).

Die sieben Pflichtangaben: Priorität, Maßnahmenbezeichnung, Investitionsvolumen, Zeitrahmen, Herkunft, verantwortliche Funktion, Status ∈ {Offen, In Bearbeitung, Abgeschlossen}.

---

## 4. Architektur-Übersicht

```
Plan (von Hand aus PDF/Webseite → umsetzungsplan-schema.json)
   │   + Quelle { url, abgerufenAm, archivSnapshot } + rechtsstand + merkblattFassung
   ▼
pruefeUmsetzungsplan()   deterministisch, ohne Netz, ohne Modell
   │   U0 Plan ohne Tabelle          U1 Pflichtangabe ohne Wert
   │   U2 Status ∉ Vokabular         U3 Zeitrahmen nicht lesbar / Ende vor Beginn
   │   U4 Investition nicht numerisch  U5 Merkblattfassung ≠ gelesene
   ▼
PruefErgebnis { schemaStatus, befunde[{regel, art:'frage', massnahme, frageDe, frageEn}], felderUnbekannt[] }
   │
   ▼
erstelleRegister(plaene, suchnachweise)   gefunden ← Plan mit Quelle · kein Plan gefunden ← Stand + Suchweg
   ▼
erstelleAuswertung()   Kopf mit Selektionshinweis · Statusverteilung · Statusquote (über Maßnahmen)
                       · Investitionssumme der offenen Maßnahmen (Untergrenze bei unlesbaren Werten)
                       · Einzelnachweise in Erfassungsreihenfolge
   ▼
auswertungAlsText() / registerAlsCsv()
```

Die **Statusquote** ist der Anteil je Status an den Maßnahmen mit lesbarem Status **in den gefundenen Plänen**, nicht an den Firmen und nicht an den Verpflichteten. Sie ist ein Selektionsprodukt (siehe Hinweis im Kopf).

---

## 5. Enthaltene Module

* `src/engine/umsetzungsplan-register/umsetzungsplanPruefer.ts` — Prüfer `pruefeUmsetzungsplan`, Register `erstelleRegister`, Aggregat `erstelleAuswertung`, Export `auswertungAlsText` / `registerAlsCsv`, Hilfen `parseInvestition`, `parseZeitrahmen`, `normalisiereStatus`, `assertNeutraleSprache`, Konstanten `SCHEMA_STATUS`, `MERKBLATT_GELESEN`, `PFLICHTANGABEN`, `STATUS_VOKABULAR`, `ANNAHMEN`.
* `src/engine/umsetzungsplan-register/umsetzungsplanPruefer.test.ts` — Vitest-Suite (29 Fälle).
* `07-demos/umsetzungsplan-register/umsetzungsplan-schema.json` — **vorläufiges** Schema (Draft-07) mit `schemaStatus`, `merkblattFassung`, `x-pflichtangaben`, `x-statusVokabular`, `x-annahmen`.
* `07-demos/umsetzungsplan-register/data/synthetische-plaene.json` — 6 **synthetische** Pläne erfundener Firmen und 1 synthetischer Suchnachweis, alle `synthetisch: true`, URLs auf `example.org`.

> [!NOTE]
> **Ehrlichkeit / honesty:** Alle Fixtures und alle Zahlen darin sind erfunden. Die drei echten Fixtures (Muster GmbH aus dem Merkblatt, Sanofi-Aventis Deutschland 11/2025, VON ARDENNE 04/2025) sind **noch nicht** übertragen; das bleibt in Ticket 01 offen. Keine Zahl aus einem echten Plan wurde übernommen.
> *All fixtures are synthetic; the three real plans are not transcribed yet.*

---

## 6. Entwicklungs-Tickets

- [ ] [Ticket 01: Schema aus dem BAFA-Merkblatt, ein Prüfer, drei echte Pläne](./ticket-01-schema-pruefer.md) — Prüfer, Register, Auswertung und Tests fertig; offen: gültige Merkblattfassung lesen, drei echte Pläne von Hand übertragen.

---

## 7. Live-Demo

* **Die Dose im Web:** [felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register](https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register)
* **Lokal testen / run locally:** `npx vitest run src/engine/umsetzungsplan-register`

---
Lizenz: CC0 1.0 Public Domain.

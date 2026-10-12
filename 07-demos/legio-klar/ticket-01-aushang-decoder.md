# Ticket 01: Treppenhaus-Aushang-Decoder & UBA-Ampel

**Komponente:** `07-demos/legio-klar` / `src/engine/legio-klar`  
**Status:** Abgeschlossen (Kern, UBA-Matrix, Temperatur-Audit, Fixture, Schreiben-Generator und Tests fertig)  
**Zugehörige Dose:** [`05-dosen/legio-klar.md`](../../05-dosen/legio-klar.md) · [Die Dose online](https://felixinberlin.github.io/Amelie/#dose=legio-klar)

---

## 1. Ziel

Ein deterministischer Kern in TypeScript, der Laborprüfberichte von Legionellenuntersuchungen nach der Trinkwasserverordnung 2023 (§§ 31, 51, 52) einliest, gegen die UBA-Empfehlung Risikoabschätzung und DVGW W 551 prüft und für Mieter verständliche Handlungsempfehlungen sowie ein Mängelanzeigen-Schreiben nach § 536c BGB erzeugt.

---

## 2. Erledigte Aufgaben

- [x] **Task 1: UBA-Maßnahmenmatrix (`legioKlarEngine.ts`)**
  - Stufenlose Klassifikation: <100 (grün), 100 bis <1.000 (gelb), 1.000 bis <10.000 (orange), ≥10.000 (rot).
  - Maßnahmenwert-Prüfung (100 KBE/100ml).
- [x] **Task 2: Temperatur-Audit nach DVGW W 551**
  - Prüfung Warmwasserspeicheraustritt ($\ge 60\,^\circ\text{C}$).
  - Prüfung Zirkulationsrücklauf ($\ge 55\,^\circ\text{C}$).
  - Identifikation gefährlicher Wachstumsfenster an Entnahmestellen ($25\text{--}50\,^\circ\text{C}$).
- [x] **Task 3: Generator für Mieter-Auskunftsersuchen & Mängelanzeige**
  - Rechtssichere Zitate von TrinkwV § 51, § 52 und BGB § 536c.
  - Dynamischer Hinweis auf Duschverbote und Sterilfilter bei Extremwerten.
- [x] **Task 4: Synthetische Testfixture & JSON Schema**
  - `laborbefund-schema.json`
  - `data/synthetischer-aushang-befund.json`
- [x] **Task 5: Vitest-Suite**
  - 10 automatisierte Tests in `src/engine/legio-klar/legioKlarEngine.test.ts`.

---

## 3. Akzeptanzkriterien

- [x] Alle 10 Tests in `src/engine/legio-klar/legioKlarEngine.test.ts` laufen erfolgreich durch.
- [x] Keine externen Netzwerkaufrufe im Kern.
- [x] Klare Trennung von technischer Sachstandsfeststellung und Rechtsberatung.

---

Lizenz: CC0 1.0 Public Domain.

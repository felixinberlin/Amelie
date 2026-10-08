# Ticket 01: Anhang I als Schema, ein Prüfer, eine echte Offenlegung

**Komponente:** `07-demos/vernichtungs-offenlegungsregister` / `src/engine/vernichtungs-offenlegungsregister`
**Status:** Historischer Vertrag vom 28.09.2026; fachlich durch [Ticket 02](ticket-02-normtext-und-realfixture.md) ersetzt.

> Die folgenden Aufgabenstände und Akzeptanzkriterien sind archiviert und bleiben unverändert nachvollziehbar. Der Normtext-Abgleich am 08.10.2026 hat insbesondere Ausnahmewhitelist und Achtstellengebot widerlegt; aktueller Stand im [Normtext-Abgleich](normtext-abgleich-2026-10-08.md).
**Zuständigkeit:** Civic Tech / Umweltvollzug
**Zugehörige Dose:** [`05-dosen/vernichtungs-offenlegungsregister.md`](../../05-dosen/vernichtungs-offenlegungsregister.md) · [Die Dose online](https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister)

---

## 1. Problemstellung & Ziel

Die Offenlegungen nach Art. 24 ESPR über vernichtete unverkaufte Verbraucherprodukte erscheinen verstreut und im freien Format. Ein reiner TypeScript-Kern `pruefeOffenlegung(offenlegung)` soll eine übertragene Offenlegung gegen das Anhang-I-Format der DVO (EU) 2026/2 prüfen und jede Auffälligkeit als **Frage** mit Regel-ID melden. Das Register daneben kennt nur **„gefunden"** und **„keine Offenlegung gefunden (Stand, Suchweg)"** — nie einen Vorwurf.

---

## 2. Aufgabenpakete

- [ ] **Task 0: Normtext lesen (Vorbedingung)**
  - DVO (EU) 2026/2 (Art. 2/3, Anhang I), Delegierte VO (EU) 2026/296 und ESPR Art. 24 Abs. 1 im Volltext lesen.
  - **Offen:** In der Bauumgebung war eur-lex.europa.eu gesperrt (`EGRESS_BLOCKED`). Das Schema trägt deshalb `"schemaStatus": "vorläufig"` und nennt je Feld die Schnipselquelle (`x-annahmen`). Nach dem Abgleich: Felder, Ausnahmeliste und Behandlungswege korrigieren, `SCHEMA_STATUS` auf `gegen Normtext geprüft am JJJJ-MM-TT` setzen.

- [x] **Task 1: Vorläufiges Schema (`07-demos/vernichtungs-offenlegungsregister/anhang1-schema.json`)**
  - Draft-07; Fachfelder `stueck`, `gewichtKg`, `gruende`, `behandlungswege`, `cnCode`, `geschaetzt` als benannte Annahmen; jedes Feld darf `unbekannt` sein (Freitext-Offenlegungen). Keine behaupteten Feldnummern aus Anhang I.

- [x] **Task 2: Deterministischer Prüfer (`src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.ts` → `pruefeOffenlegung`)**
  - **V0-FREITEXT:** Format `freitext` → Frage, ob sich die Felder übertragen lassen; Felder `unbekannt`.
  - **V1-PROZENTSUMME:** $\left|\sum_w a_w - 100\right| > 0{,}5$ je Warengruppe.
  - **V2-GRUND:** Grund $\notin$ vorläufiger Ausnahmeliste, oder keiner übertragen.
  - **V3-CN-CODE:** nicht genau 8 Ziffern (Leerzeichen/Punkte ignoriert), nur HS-Ebene, oder Kapitel $\notin [01, 97]$ bzw. $= 77$.
  - **V4-STUECK-GEWICHT:** $m/n$ außerhalb einer groben Spanne je KN-Kapitel (Heuristik), oder genau eine von $m, n$ ist $0$.
  - **V5-SCHAETZUNG:** Mengen ohne Kennzeichnung gemessen/geschätzt.

- [x] **Task 3: Register (`erstelleRegister`, `registerAlsCsv`)**
  - Zwei Status; „keine Offenlegung gefunden" nur mit Stand und Suchweg; jede „gefunden"-Zeile mit Quell-URL und Abrufdatum; keine Quoten.

- [ ] **Task 4: Erste echte Fixture — Signify N.V., GJ 2025**
  - „Disclosure on Discarded Unsold Consumer Products", PDF vom 04.05.2026 (assets.signify.com, Dateiname `20260504-signify-espr-disclosure.pdf`; vollständige URL vor Nutzung ermitteln) **von Hand** übertragen, mit Quell-URL, Abrufdatum und Archiv-Snapshot.
  - **Offen:** Das PDF wurde nicht gelesen. Es gibt bewusst **keine** Fixture, die Signify-Daten behauptet; alle vorhandenen Fixtures sind `synthetisch: true` mit erfundenen Firmen und `example.org`-URLs.

---

## 3. Akzeptanzkriterien (Definition of Done)

Spiegelt „Fertig, wenn" der Dose; Stand 28.09.2026.

1. ☑ **Vitest-Suite ≥ 15 Fälle, grün** (`offenlegungsPruefer.test.ts`, 28 Fälle), darunter:
   - ☑ vollständige Offenlegung → 0 Befunde
   - ☑ Prozentsumme ≠ 100 → `V1-PROZENTSUMME`
   - ☑ Grund außerhalb der Ausnahmeliste → `V2-GRUND`
   - ☑ ungültiger CN-Code → `V3-CN-CODE`
   - ☑ Stück und Gewicht unplausibel → `V4-STUECK-GEWICHT`
   - ☑ fehlende Schätzkennzeichnung → `V5-SCHAETZUNG`
   - ☑ Freitext-Offenlegung ohne Tabelle → läuft durch, Felder `unbekannt`
2. ☐ **Die Signify-Offenlegung zum GJ 2025** ist von Hand als erste Fixture übertragen, mit Quell-URL und Abrufdatum.
   *Offen: PDF nicht gelesen (Seitenabruf gesperrt). Keine Fixture behauptet Signify-Daten.*
3. ☑ **Neutrale Sprache:** Ein Test stellt sicher, dass keine Ausgabe (Prüfergebnisse, Register-JSON, CSV) „Verstoß", „säumig" oder „violation" enthält, und dass der einzige Status für fehlende Offenlegungen „keine Offenlegung gefunden" mit Datum und Suchweg ist.
4. ☑ **Jeder Befund trägt eine Regel-ID und eine Klartextfrage (De/En).** Test über alle Fixtures; der Kern wirft, wenn ein Text nicht auf `?` endet.
5. ☑/☐ **Das Schema weist seinen Stand aus.** ☑ `schemaStatus: "vorläufig"` in Schema, Kern und Ergebnis (Test). ☐ `gegen Normtext geprüft am …` steht aus (Task 0).
6. ☑ **Alles liegt im Scaffolding** unter `07-demos/vernichtungs-offenlegungsregister/` (Regel 4) bzw. im Engine-Modul `src/engine/vernichtungs-offenlegungsregister/`.
7. ☑ **Kein Gesamturteil:** Das Prüfergebnis hat keine Felder außer `unternehmen`, `geschaeftsjahr`, `schemaStatus`, `befunde`, `felderUnbekannt` (Test).
8. ☑ **Leistung:** 500 Offenlegungen × 10 Positionen werden in < 100 ms geprüft und ins Register übernommen.

---
Lizenz: CC0 1.0 Public Domain.

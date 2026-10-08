# Ticket 01: Pflichtangaben als Schema, ein Prüfer, drei echte Pläne

**Komponente:** `07-demos/umsetzungsplan-register` / `src/engine/umsetzungsplan-register`
**Status:** Offen (Schema, Prüfer, Register, Auswertung, Tests und drei Fixtures fertig; Archiv-Snapshots, Lesung der Fassung 12.02.2025 und Kuratorentscheid zu Statuswörtern stehen aus)
**Zuständigkeit:** Civic Tech / Energieeffizienzpolitik
**Zugehörige Dose:** [`05-dosen/umsetzungsplan-register.md`](../../05-dosen/umsetzungsplan-register.md) · [Die Dose online](https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register)

---

## 1. Problemstellung & Ziel

Umsetzungspläne nach § 9 EnEfG erscheinen verstreut als PDF, niemand zählt sie. Ein reiner TypeScript-Kern `pruefeUmsetzungsplan(plan)` soll einen übertragenen Plan gegen die Angaben des BAFA-Merkblatts prüfen, jede Auffälligkeit als **Frage** melden und Statusverteilung sowie Investitionsvolumen der offenen Maßnahmen ausgeben. Das Register daneben kennt nur **„gefunden"** und **„kein Plan gefunden (Stand, Suchweg)"** und nutzt den Registerkern der Schwester-Dose `vernichtungs-offenlegungsregister`.

---

## 2. Aufgabenpakete

- [x] **Task 0: Aktuelle Merkblattfassung lesen (Vorbedingung)**
  - BAFA-Merkblatt EnEfG am 28.09.2026 von bafa.de abgerufen: **Stand 16.09.2026** (9. Änderung, „Anpassung Inhalt Umsetzungsplan"), sha256 `1a62fa7dac0253e007eca19a32b9c12395d3d272e600b7f839d869dbc435d529`. Abschnitt 5 (S. 12–15) gelesen.
  - **Abweichung von der Dose:** Die Fassung nennt **fünf** Angaben (Priorisierung, Bezeichnung, Investitionsvolumen, Zeitrahmen, Umsetzungsfortschritt), nicht sieben. Herkunft und verantwortliche Person sind seit der 7. Änderung (30.04.2026) nicht mehr im Muster. Das Schema ist deshalb **versioniert**: Fassung 16.09.2026 geprüft, Fassung 12.02.2025 (sieben Angaben, nur aus der Reviewer-Lesung) `vorläufig`.

- [x] **Task 1: Schema (`07-demos/umsetzungsplan-register/umsetzungsplan-schema.json`)**
  - Draft-07; Zeilentexte wortgetreu als Zeichenketten; `rechtsstand` ∈ {`a. F.`, `n. F.`}; `merkblattFassung`; `datenart` ∈ {`veroeffentlichter-plan`, `merkblatt-muster`, `synthetisch`}; Quelle mit `url`, `abgerufenAm`, `sha256`, `archivSnapshot`; `x-fassungen` mit Pflichtangaben und Stand je Fassung; `x-statusVokabular`.

- [x] **Task 2: Deterministischer Prüfer (`src/engine/umsetzungsplan-register/umsetzungsplanPruefer.ts` → `pruefeUmsetzungsplan`)**
  - **U0-FREITEXT:** Format `freitext` → Frage; alle Felder `unbekannt`.
  - **U1-ANGABE:** Angabe der gewählten Fassung in keiner Zeile (eine Frage je Plan) oder in einzelnen Zeilen (eine Frage je Zeile). Kopfangabe „verantwortliche Person" gilt für alle Zeilen; nur Gesamtvolumen statt Einzelwerten ist zulässig (Merkblatt-Fußnote *).
  - **U2-STATUS:** Status $\notin$ {Offen, In Bearbeitung, Abgeschlossen} (ohne Groß-/Kleinschreibung). Wird gezählt, nie umgedeutet.
  - **U3-ZEITRAHMEN:** nicht lesbar (MM/JJJJ, Monatsname JJJJ, Qn[/ ]JJJJ, JJJJ, TT.MM.JJJJ, Bereiche mit „-"/„–", Teile mit „&"; fehlendes Anfangsjahr = Jahr des Endes) oder $t_\text{Ende} < t_\text{Beginn}$.
  - **U4-INVESTITION:** weder Betrag noch Bandbreite (Formate „2.575.074,00 €", „2.000 € - 5.000 €", „bis 20.000 €" → $[0, 20\,000]$, „ca.", „T€", „Mio. €"), oder $v_\text{von} > v_\text{bis}$.
  - **U5-SUMME:** Summenzeile $[g_\text{von}, g_\text{bis}] \not\subseteq [\sum v_\text{von} - 1\,€,\ \sum v_\text{bis} + 1\,€]$.
  - **U6-ZEITRAHMEN-ABGELAUFEN:** $t_\text{Ende} < t_\text{Planstand}$ und Status $\neq$ Abgeschlossen.
  - **U7-RECHTSSTAND:** `rechtsstand` des Plans $\neq$ Rechtsstand der Merkblattfassung.
  - Ausgabe: `statusVerteilung`, `statusAusserhalbVokabular`, `investitionOffen`, `investitionAusserhalbVokabular`, `investitionGesamt` als Spannen in Euro mit Zähler `ohneBetrag`.

- [x] **Task 3: Auswertung (`werteAus`)**
  - Selektionshinweis in De/En als erste Felder; Summen über Pläne; Satz „N gefundene Pläne, davon M Maßnahmen offen, Investitionsvolumen offen X €", ergänzt um Maßnahmen außerhalb des Vokabulars und Einträge, die kein veröffentlichter Plan sind. Keine Unternehmensnamen, keine Quote, kein Nenner.

- [x] **Task 4: Register über den Registerkern (`erstellePlanRegister`, `planRegisterAlsCsv`)**
  - Adapter auf `erstelleRegister` und `registerAlsCsv` aus `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.ts` (importiert, nicht kopiert). Schlüssel Unternehmen × Planjahr. Status „kein Plan gefunden" statt „keine Offenlegung gefunden"; CSV-Spalte `planjahr` statt `geschaeftsjahr`, angehängt `planstand`, `rechtsstand`, `datenart`.
  - **Naht:** Der Registerkern ist auf seine eigenen Status-Literale typisiert; die CSV-Übergabe braucht deshalb eine strukturelle Typumwandlung. Sauberer wäre ein Kern mit parametrisierbaren Statusbezeichnungen — das ist eine Änderung an der Schwester-Dose und gehört in ein eigenes Ticket dort.

- [ ] **Task 5: Archiv-Snapshots**
  - Für die drei Quell-URLs je einen Snapshot (z. B. web.archive.org) anlegen und in `quelle.archivSnapshot` eintragen. Die sha256-Werte der am 28.09.2026 geladenen Dateien stehen schon in der Fixture.

- [ ] **Task 6: Kuratorentscheid zu Statuswörtern außerhalb des Vokabulars**
  - VON ARDENNE nutzt „geplant" (6 Zeilen, 1.804.771 €) und „laufend" (2 Zeilen). Der Prüfer fragt nach, er deutet nicht um. Für ein Aggregat über viele Pläne braucht es eine **sichtbare** Zuordnung durch einen Menschen (z. B. Feld `statusZuordnung` je Plan, im Ergebnis ausgewiesen). Das ist eine Erweiterung und braucht ein eigenes Ticket; dieses Ticket legt nur fest, dass es nie still geschieht.

- [ ] **Task 7: Fassung 12.02.2025 selbst lesen**
  - Die sieben Angaben stammen aus der Reviewer-Lesung einer Kopie auf visalvis.de. Selbst lesen, dann `FASSUNGEN['2025-02-12'].schemaStand` auf `gegen Merkblatt 12.02.2025 geprüft am …` setzen — oder die Fassung entfernen, wenn sie für Pläne ab 2025 keine Rolle spielt.

---

## 3. Akzeptanzkriterien (Definition of Done)

Spiegelt „Fertig, wenn" der Dose; Stand 28.09.2026.

1. ☑ **Vitest-Suite grün** (`umsetzungsplanPruefer.test.ts`, 89 Fälle), darunter:
   - ☑ vollständiger Plan → 0 Befunde (Muster GmbH, Sanofi)
   - ☑ fehlende Pflichtangabe → `U1-ANGABE`
   - ☑ Status außerhalb des Vokabulars → `U2-STATUS`
   - ☑ unlesbarer Zeitrahmen → `U3-ZEITRAHMEN`
   - ☑ nicht-numerisches Investitionsvolumen → `U4-INVESTITION`
   - ☑ Statusverteilung und Investitionssumme „Offen" korrekt (Muster GmbH: 3 offen, 32.000–45.000 €; Sanofi: 0 offen; Aggregat über drei Pläne)
   - ☑ Freitext-Plan ohne Tabelle → läuft durch, Felder `unbekannt`
2. ☑ **Drei Fixtures von Hand übertragen**, jeweils mit Quell-URL, Abrufdatum und sha256: Muster GmbH (Merkblatt **16.09.2026**, nicht 12.02.2025), Sanofi-Aventis Deutschland 11/2025, VON ARDENNE 04/2025.
3. ☑ **Neutrale Sprache und kein Nenner:** Ein Test stellt sicher, dass keine Ausgabe (Ergebnisse, Register, Auswertung, CSV) „säumig", „Verstoß", „violation" oder „fehlt" enthält, dass fehlende Pläne nur als „kein Plan gefunden" mit Datum und Suchweg erscheinen und dass keine Ausgabe die Verpflichtetenschätzung, ein Prozentzeichen oder ein Quoten-/Anteilsfeld enthält.
4. ☑ **Selektionshinweis und kein Ranking:** Jede Auswertung trägt den Selektionshinweis als erste Felder; sie nennt keine Unternehmen und ist unabhängig von der Eingabereihenfolge; das Register ist alphabetisch und hat kein Betrags- oder Rangfeld (Tests).
5. ☑ **Registerkern importiert statt kopiert:** Test prüft, dass der einzige Import `../vernichtungs-offenlegungsregister/offenlegungsPruefer` ist und `erstelleRegister`, `registerAlsCsv`, `assertNeutraleSprache` nicht neu definiert werden.
6. ☑ **Das Schema weist seinen Stand aus:** `gegen Merkblatt 16.09.2026 geprüft am 2026-09-28` für die aktuelle Fassung, `vorläufig` für 12.02.2025 — gleich in Schema, Kern und Ergebnis (Test).
7. ☑ **Alles liegt im Scaffolding** unter `07-demos/umsetzungsplan-register/` bzw. `src/engine/umsetzungsplan-register/` (Regel 4).
8. ☑ **Leistung:** 500 Pläne × 20 Zeilen werden in < 250 ms geprüft, ins Register übernommen und ausgewertet.
9. ☐ **Archiv-Snapshots** der drei Quellen eingetragen (Task 5).

---
Lizenz: CC0 1.0 Public Domain.

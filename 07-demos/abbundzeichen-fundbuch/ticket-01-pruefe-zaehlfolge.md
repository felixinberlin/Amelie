# Ticket 01: Eine Wand, eine Zählfolge, ein Verdacht

**Komponente:** `07-demos/abbundzeichen-fundbuch` / `src/engine/abbundzeichen-fundbuch`
**Status:** Offen (Kern und Tests fertig; Literatur-Fixture und statische Offline-Seite stehen aus)
**Zuständigkeit:** Civic Tech / Hausforschung
**Zugehörige Dose:** [`05-dosen/abbundzeichen-fundbuch.md`](../../05-dosen/abbundzeichen-fundbuch.md) · [Die Dose online](https://felixinberlin.github.io/Amelie/#dose=abbundzeichen-fundbuch)

---

## 1. Problemstellung & Ziel

Abbundzeichen sind bei einer Sanierung nur wenige Wochen sichtbar, und kaum ein Laie kann sie lesen. Ein reiner TypeScript-Kern `pruefeZaehlfolge(bauteile)` soll die eingetragenen Zeichen einer Wand als Zählfolge prüfen und Auffälligkeiten als `hinweis` oder `verdacht` melden — für zwei Zeichensysteme: **römisch mit Ausstich/Serienzeichen** und **römisch einfach**. Additive Formen (`IIII`, `VIIII`) sind zimmermannsüblich und gültig. Der Fund wird als JSON exportiert, das Hausforschende sammeln können.

---

## 2. Aufgabenpakete

- [x] **Task 1: Parser (`src/engine/abbundzeichen-fundbuch/fundbuchEngine.ts` → `parseZeichen`)**
  - Zeichen → `{ wert, notation: 'additiv'|'subtraktiv'|'neutral', serie: { typ, anzahl } }`.
  - Grammatik der Ziffer: `^(C{0,3})(XC|XL|L?X{0,4})(IX|IV|V?I{0,4})$`; Serienzeichen `^` `>` `/` `o`, Anzahl = Wiederholung.
  - `unlesbar` (auch `unreadable`, `?`) ist ein eigener Zustand; unbekannte Notation wirft.

- [x] **Task 2: Fünf deterministische Regeln (`pruefeZaehlfolge`)**
  - **R1-LUECKE** (`hinweis`): fehlender Wert $v$ mit $1 \le v < \max$ in der Folge (Wand × Rolle, dominante Serie); gedeckt, wenn zwischen den Nachbarn mindestens so viele unlesbare Bauteile stehen, wie Werte fehlen.
  - **R2-DOPPELUNG** (`verdacht`): gleicher Wert in derselben Serie, Rolle und Wand.
  - **R3-FREMDE-SERIE** (`verdacht`): Serienzeichen ≠ dominante Serie der Wand (strikte Mehrheit $> 50\,\%$) → Verdacht Zweitverwendung.
  - **R4-NOTATIONSBRUCH** (`hinweis`): additive und subtraktive Schreibweise in derselben Wand und Serie.
  - **R5-RICHTUNGSBRUCH** (`verdacht`): Bauteile außerhalb der längsten nicht-strikt monotonen Teilfolge entlang der Positionen (Richtung nach Mehrheit der Nachbarschritte).

- [x] **Task 3: JSON-Export (`exportiereFund`)**
  - Felder je Bauteil: Markierungsart, Werkzeug, Lage (Wand, Position, Rolle, Seite), Serie, Lesung — angelehnt an die in VA 49/1 (2018) geforderte Erfassung (Artikel nicht im Volltext gelesen).
  - Ort nur `gemeinde`/`landkreis`/`land`; genauere Ortsfelder werfen einen Fehler.
  - Schema: `07-demos/abbundzeichen-fundbuch/schemas/fund-export.schema.json`.

- [ ] **Task 4: Literatur-Fixture**
  - Ein publiziertes Zeichenregister (DSD-Kulturspur „Abbundzeichen", ing-hofer.de 2019 oder ein Beispiel aus Gerner 1996) von Hand als Fixture übertragen und den publizierten Befund als erwartetes Ergebnis festhalten.
  - **Fixture aus publiziertem Register steht aus — Quelle im Volltext lesen und von Hand übertragen.** In der Bauumgebung dieses Tickets war jeder Seitenabruf gesperrt; die vorhandenen Fixtures sind ausdrücklich **synthetisch**.

- [ ] **Task 5: Statische Offline-Seite**
  - Eine einzelne HTML-Seite, die den Kern bündelt (z. B. per esbuild), eine Eingabetabelle bietet und Ergebnis + Export anzeigt — ohne Netzwerkaufruf, ohne Modell.

---

## 3. Akzeptanzkriterien (Definition of Done)

Spiegelt „Fertig, wenn" der Dose; Stand 27.09.2026.

1. ☑ **Vitest-Suite ≥ 20 Fälle, grün** (`fundbuchEngine.test.ts`, 44 Fälle), darunter:
   - ☑ lückenlose Wand → 0 Befunde
   - ☑ fehlender Ständer → `R1-LUECKE`
   - ☑ Balken mit fremdem Ausstich → `R3-FREMDE-SERIE`, Verdacht Zweitverwendung
   - ☑ `IIII` neben `IV` → `R4-NOTATIONSBRUCH` als Hinweis
   - ☑ unlesbares Zeichen → bleibt `unlesbar`, bricht nichts
   - ☑ Umsetzung → `R5-RICHTUNGSBRUCH`
2. ☐ **Mindestens ein publiziertes Zeichenregister aus der Literatur** (DSD-Kulturspur, ing-hofer.de oder Gerner 1996) ist von Hand als Fixture übertragen, und das Ergebnis stimmt mit dem publizierten Befund überein.
   *Offen: Fixture aus publiziertem Register steht aus — Quelle im Volltext lesen und von Hand übertragen. Keine der bisherigen Fixtures stammt aus der Literatur.*
3. ☐ **Der Kern läuft als einzelne statische Seite offline im Browser**, ohne Netzwerkaufruf und ohne Modell.
   *Teilweise: Der Kern selbst ist rein und importfrei (Test prüft den Quelltext auf `fetch`, `XMLHttpRequest`, `WebSocket`, dynamische und Paket-Importe). Die statische Seite fehlt noch (Task 5).*
4. ☑ **Jede Meldung trägt Regel-ID und Klartextbegründung (De/En).** Test über alle Fixtures.
5. ☑ **Alles liegt im Scaffolding unter `07-demos/abbundzeichen-fundbuch/`** (Regel 4) bzw. im zugehörigen Engine-Modul `src/engine/abbundzeichen-fundbuch/`.
6. ☑ **Invariante „nie bestätigt":** `Stufe` ist `'hinweis' | 'verdacht'`; `'bestaetigt'` scheitert an `tsc` (`@ts-expect-error`-Test) und an `assertZulaessigeStufe` zur Laufzeit.
7. ☑ **Standortschutz:** Der Export wirft bei Straße, Hausnummer, PLZ, Koordinaten oder Flurstück; alle Exporte sind gültig gegen `fund-export.schema.json`.
8. ☑ **Leistung:** 480 Bauteile (40 Wände × 12 Ständer) werden in < 50 ms geprüft.

---
Lizenz: CC0 1.0 Public Domain.

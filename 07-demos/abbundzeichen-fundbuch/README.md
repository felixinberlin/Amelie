# Abbundzeichen-Fundbuch — Scaffolding & Zählfolgen-Prüfer

> Ein deterministischer Prüfer für Zählfolgen von Abbundzeichen: Sanierende tragen die Zeichen einer freigelegten Fachwerkwand ein, der Kern meldet Lücken, Doppelungen, fremde Serien, Notations- und Richtungsbrüche als **Hinweis** oder **Verdacht** — nie als Befund — und exportiert den Fund als JSON für kuratierende Hausforschende.
> *CC0 / Public-Domain-Geschenk für die Interessengemeinschaft Bauernhaus e.V. (IgB), Bereich Hausforschung.*
>
> *(English: Carpenters' Marks Logbook — a deterministic sequence checker for carpenters' assembly marks. It grades every message as a **hint** or a **suspicion**, never as a finding, and exports the record as JSON for curating house historians.)*

---

## 1. Problem & Lücke

Wer ein Fachwerkhaus saniert, sieht die Abbundzeichen genau einmal — in den wenigen Wochen, in denen Putz und Verkleidung ab sind — und kann sie meist nicht lesen. Die wenigen, die sie lesen können, sammeln von Hand und bitten öffentlich um Sichtungen. So entsteht nie eine Verteilung, aus der man Umbauten, Zweitverwendung oder regionale Zeichensysteme ablesen könnte.

*Renovators see the marks once and cannot read them; the few who can read them collect by hand. No distribution ever emerges.*

---

## 2. Der Sicherheitsnachweis (Safety Case)

> [!CAUTION]
> **Der Kern vergibt nur zwei Stufen: `hinweis` und `verdacht`. Einen bestätigten Befund kann er weder im Typsystem noch zur Laufzeit erzeugen.**
> *The kernel only grades `hinweis` (hint) and `verdacht` (suspicion). It cannot produce a confirmed finding — neither in the type system nor at runtime.*

Harte Invarianten (jede durch einen Test abgesichert):

1. **Nie „bestätigt".** `type Stufe = 'hinweis' | 'verdacht'`; ein `@ts-expect-error`-Test beweist, dass `'bestaetigt'` nicht zuweisbar ist, und `assertZulaessigeStufe` wirft zur Laufzeit.
2. **`unlesbar` ist gleichberechtigt.** Ein unlesbares Zeichen landet in `unlesbar[]`, löst keine Regel aus und kann eine Lücke an seiner Stelle decken.
3. **Jede Meldung trägt Regel-ID und Klartextbegründung (De/En).**
4. **Ort nur auf Gemeindeebene.** Der Export lehnt Straße, Hausnummer, PLZ, Koordinaten, Flurstück mit einem Fehler ab — nichts wird still verworfen.
5. **Kein stilles Raten.** Unbekannte Notation, doppelte IDs, fehlende Wand oder ungültige Position werfen einen Fehler.
6. **Offline, ohne Modell.** Keine Importe außer Typen, kein `fetch`, kein Modellaufruf (per Test auf den Quelltext geprüft).

---

## 3. Architektur-Übersicht

```
Bauteile (Wand/Bund, Position, Rolle, Zeichen)
   │
   ▼
parseZeichen()   "VIIII" → 9, additiv · "XII^" → 12, Ausstich×1 · "VII>>" → 7, Fähnchen×2 · "unlesbar"
   │
   ▼
Gruppierung      Wand → dominante Serie (strikte Mehrheit) → Folgen je Rolle
   │
   ▼
Fünf Regeln      R1 Lücke (hinweis) · R2 Doppelung (verdacht) · R3 fremde Serie (verdacht)
                 R4 Notationsbruch (hinweis) · R5 Richtungsbruch (verdacht)
   │
   ▼
PruefErgebnis    { serien[], befunde[{regel, stufe, bauteile, textDe, textEn}], unlesbar[] }
   │
   ▼
exportiereFund() JSON: Markierungsart · Werkzeug · Lage · Serie · Lesung · Ort (Gemeinde)
```

**Notation / notation:** römische Ziffer, additiv (`IIII`, `VIIII`) oder subtraktiv (`IV`, `IX`), plus optional wiederholtes Serienzeichen: `^` Ausstich, `>` Fähnchen, `/` Beistrich, `o` Kreis. Die Wiederholung ist die Anzahl (`VII>>` = zwei Fähnchen). `unlesbar` (auch `unreadable`, `?`) ist ein eigener Zustand.

**Regeln im Detail / rules:**

| ID | Stufe | Auslöser | Klartext (Kurzform) |
|---|---|---|---|
| `R1-LUECKE` | hinweis | In der Folge (Wand × Rolle, dominante Serie) fehlt ein Wert zwischen I und dem Höchstwert; nicht gemeldet, wenn genügend unlesbare Bauteile an der Stelle stehen | fehlendes Bauteil, Umbau oder noch verdeckt |
| `R2-DOPPELUNG` | verdacht | gleicher Wert, gleiche Serie, gleiche Rolle, gleiche Wand | Verwechslung oder Zweitverwendung |
| `R3-FREMDE-SERIE` | verdacht | Serienzeichen weicht von der strikten Mehrheitsserie der Wand ab | Holz aus einem anderen Verband |
| `R4-NOTATIONSBRUCH` | hinweis | additive und subtraktive Schreibweise in derselben Wand und Serie | anderer Zimmerer oder andere Bauphase |
| `R5-RICHTUNGSBRUCH` | verdacht | Bauteil außerhalb der längsten monotonen Teilfolge entlang der Positionen (auf- oder absteigend) | Umsetzung oder falsche Positionsangabe |

---

## 4. Enthaltene Module

* `src/engine/abbundzeichen-fundbuch/fundbuchEngine.ts` — Parser `parseZeichen`, Prüfer `pruefeZaehlfolge`, Export `exportiereFund`, Invarianten-Wächter `assertZulaessigeStufe`.
* `src/engine/abbundzeichen-fundbuch/fundbuchEngine.test.ts` — Vitest-Suite (44 Fälle) inkl. kleinem JSON-Schema-Prüfer.
* `07-demos/abbundzeichen-fundbuch/schemas/bauteil.schema.json` — Eingabeformat eines Bauteils (Draft-07).
* `07-demos/abbundzeichen-fundbuch/schemas/fund-export.schema.json` — Exportformat (Draft-07). Die Erfassungsfelder sind an die in *Vernacular Architecture* 49/1 (2018) geforderte einheitliche Erfassung **angelehnt**; der Artikel wurde nicht im Volltext gelesen, die Abbildung ist ungeprüft.
* `07-demos/abbundzeichen-fundbuch/data/synthetische-faelle.json` — 8 **synthetische** Wände (von Hand konstruiert, nicht aus einem publizierten Register).

> [!NOTE]
> **Ehrlichkeit / honesty:** Alle Fixtures sind synthetisch. Ein publiziertes Zeichenregister (DSD-Kulturspur, ing-hofer.de, Gerner 1996) ist **noch nicht** übertragen — in dieser Umgebung war kein Seitenabruf möglich. Das ist in Ticket 01 als offener Punkt markiert.
> *All fixtures are synthetic. No published mark register has been transcribed yet; this stays open in Ticket 01.*

---

## 5. Entwicklungs-Tickets

- [ ] [Ticket 01: Eine Wand, eine Zählfolge, ein Verdacht](./ticket-01-pruefe-zaehlfolge.md) — Kern und Tests fertig; offen: Literatur-Fixture, statische Offline-Seite.

---

## 6. Live-Demo

* **Die Dose im Web:** [felixinberlin.github.io/Amelie/#dose=abbundzeichen-fundbuch](https://felixinberlin.github.io/Amelie/#dose=abbundzeichen-fundbuch)
* **Lokal testen / run locally:** `npx vitest run src/engine/abbundzeichen-fundbuch`

---
Lizenz: CC0 1.0 Public Domain.

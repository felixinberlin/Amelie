# Ticket 01: Kanonisches Keltisches Kreuz als typisierte JSON-Spezifikation

**Komponente:** `07-demos/tarot-zustandsmaschine` / `src/data/dosen.ts`
**Status:** In Progress / Bereitgestellt
**Zuständigkeit:** Creative Coding / Graph DSL / Narrative Engine
**Zugehörige Dose:** [`05-dosen/tarot-zustandsmaschine.md`](../../05-dosen/tarot-zustandsmaschine.md)
**Architektur:** [`02-recherche/tarot-zustandsmaschine-dsl.md`](../../02-recherche/tarot-zustandsmaschine-dsl.md)

---

## 1. Problemstellung

Bisherige Tarot-Programme und APIs behandeln Legesysteme als starre, textbasierte Listen von Positionen. Beziehungen zwischen Positionen (wie das klassische orthogonale „Kreuzen" in Position 2, das Fundieren in Position 3 oder die temporale Sequenz nach Position 6) sind nirgends maschinenlesbar formalisiert.

Ziel dieses Tickets ist die Erstellung einer deklarativen, deck-unabhängigen Spezifikation für das Keltische Kreuz auf Basis von JSON Schema (Draft 2020-12).

---

## 2. Aufgabenpakete

- [x] **Task 1: Formale JSON-Schema-Definition (`spread.schema.json`)**
  - Definition des `deckContract` (Prüfung gegen Mindest-Kartenanzahl, Arcana-Anforderungen, Reversal-Policy).
  - Definition der Slots (relative $(x, y)$-Koordinaten, Rotationswinkel in Grad, Ebene/Z-Index, semantische Rolle).
  - Definition gerichteter Relationen (`crosses`, `grounds`, `crowns`, `leads_to`, `mirrors`, `opposes`, `synthesizes`).

- [x] **Task 2: Referenz-Instanz Keltisches Kreuz (`celtic-cross.json`)**
  - Vollständige Erfassung der 10 traditionellen Positionen nach Waite (1910).
  - Modellierung der Querkarte (Slot 2 kreuzt Slot 1 bei $\theta = 90^\circ$ auf Ebene 1).
  - Kanten-Definitionen für die 4 Kardinal-Slots des Zentrums und die 4 Slots des rechten Stabs (Staff).

- [x] **Task 3: Renderer-Unabhängigkeit nachweisen**
  - Nachweis, dass ein Renderer allein anhand der JSON-Datei ohne hardcodiertes CSS das klassische Keltische Kreuz korrekt positioniert.

---

## 3. Akzeptanzkriterien (Definition of Done)

1. **Schema-Validierung:** Die Instanz `celtic-cross.json` validiert fehlerfrei gegen das JSON Schema.
2. **Kompaktheit:** Die Spezifikation umfasst alle 10 Slots und deren 8 Kernbeziehungen in unter 150 Zeilen JSON.
3. **Deck-Sicherheit:** Versuche, das 10-Karten-Keltische-Kreuz mit einem 9-Karten-Lenormand-Teildeck auszuführen, scheitern deterministisch an der `deckContract`-Schranke.

# Open-Source-Software-Architektur für Tarot-Zustandsmaschinen

**Datum:** 25. September 2026
**Zugehörige Dose:** `05-dosen/tarot-zustandsmaschine.md`
**Autor:** Amélie Recherche-Team (Félix, Berlin)

---

## 1. Empfohlene Open-Source-Bausteine

Um eine produktionsreife, plattformübergreifende Tarot-Zustandsmaschine zu bauen, muss kein Rad neu erfunden werden. Folgende etablierte Open-Source-Bibliotheken ergänzen sich ideal:

| Ebene | Open-Source-Projekt | Lizenz | Rolle im System |
|---|---|---|---|
| **Karten-Datenkatalog** | `metabismuth/tarot-json` | MIT | Liefert alle 78 Rider-Waite-Smith-Karten mit Rängen, Arkana, Elementen und gemeinfreien HD-Scans (1909 Pamela Colman Smith). |
| **State-Machine & Logik** | `statelyai/xstate` (v5) | MIT | Modelliert die Legung als deterministischen endlichen Automaten. Zustände = aufgedeckte Slots, Events = `DRAW_CARD`, `FLIP_CARD`, `EVALUATE_EDGE`. |
| **Graph-Layout & Topologie** | `@xyflow/react` (React Flow) / `dagre` | MIT | Rendert Knoten und gerichtete Kanten. Ermöglicht Drag-and-Drop, Zoom/Pan sowie dynamische Kantenspannungen ohne CSS-Kopfschmerz. |
| **Schema-Validierung** | `ajv` (Another JSON Schema Validator) | MIT | Validiert Custom-Spreads gegen `spread.schema.json` zur Laufzeit (inklusive `deckContract`-Prüfung). |
| **Narrative Engine Bridge** | `inkle/inkjs` / `tweecode/twine` | MIT | Übergibt den evaluierten Graphen direkt an narrative Spiel-Engines für prozedurale Quest-Generierung. |

---

## 2. Architektur des lauffähigen Demos

Das im Frontend integrierte Demo (`src/components/simulators/TarotGraphSimulator.tsx` & `src/engine/tarot/tarotEngine.ts`) implementiert diese Architektur schlank und framework-unabhängig:

1. **`deckContract`-Schranke:**
   Prüft vor der Ziehung, ob das geladene Deck die geforderte Mindestanzahl an Karten (z. B. 10 für Keltisches Kreuz) und geforderte Arkana erfüllt.
2. **Topologischer Slot-Renderer:**
   Berechnet $(x, y)$-Koordinaten, zentriert Karten dynamisch und wendet die $90^\circ$-Rotation auf Z-Ebene 1 für Slot 2 (`cross_obstacle`) autonom an.
3. **Hermetische Elementar-Würden-Engine (*Golden Dawn*):**
   - **Freundlich / Nährend (+0.25):** Feuer + Luft, Wasser + Erde. Gleiche Elemente verstärken sich (+0.15).
   - **Feindlich / Konflikt (-0.35):** Feuer vs. Wasser, Luft vs. Erde.
   - **Neutral (0.0):** Feuer + Erde, Wasser + Luft.
4. **Reversal-Vektor-Modulator:**
   Umgekehrte Karten reduzieren die Durchlässigkeit von gerichteten Transitions-Kanten (`leads_to` um -0.30) und schärfen orthogonale Konflikte (`crosses`).
5. **Inspektor für Entwickler:**
   Ein Klick auf „DSL JSON" zeigt die vollständige, schema-konforme JSON-Spezifikation für den Export in Dritt-Tools oder LLM-MCP-Pipelines.

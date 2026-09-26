# Tarot Spread Graph Engine & DSL Scaffolding

Dieses Verzeichnis stellt die lauffähige Referenz-Spezifikation für maschinenlesbare Tarot-Legesysteme bereit:
1. `spread.schema.json`: Vollständiges JSON-Schema (Draft 2020-12) für herstellerunabhängige Spreads mit `deckContract`, Slots und 8 typisierten Relationen.
2. `celtic-cross.json`: Das Keltische Kreuz (10 Slots) als kanonische Graph-Spezifikation inklusive typisierter Relationen (`crosses`, `grounds`, `crowns`, `leads_to`).
3. `three-card-linear.json`: Zeitstrahl-Spread (3 Slots: Vergangenheit → Gegenwart → Zukunft) mit Transitions-Kanten.
4. `horseshoe.json`: Das klassische Hufeisen-Legesystem (7 Slots in U-Form).
5. `relationship-cross.json`: Das Beziehungskreuz (5 Slots für relationale Dynamiken).
6. TypeScript-Engine (`src/engine/tarot/tarotEngine.ts`) mit Golden Dawn Elementar-Würden, Reversal-Modulatoren, Deck-Vertrags-Validierung und Lese-Zusammenfassungs-Generator (50 Tests in `src/engine/tarot/tarotEngine.test.ts`).
7. Interaktiver Simulator (`src/components/simulators/TarotGraphSimulator.tsx`) mit 2D-Layout, SVG-Kanten-Visualisierung und DSL-JSON-Inspektor.

---

## 1. Warum eine Graph-Notation?

Bestehende Tarot-Software speichert Legungen als flache Arrays:
```json
// Bisherige Praxis: Fest verdrahtet, keine Beziehungssemantik
{ "positions": ["Gegenwart", "Hürde", "Vergangenheit", "Zukunft"] }
```

Die Amélie-Spread-DSL modelliert Legesysteme stattdessen als **gerichteten Graphen mit typisierten Relationen**:
```json
{
  "source": "situation",
  "target": "obstacle",
  "type": "crosses",
  "visual": { "rotation": 90, "layer": 1 }
}
```

Dadurch kann ein Frontend:
- Das exakte Layout deterministisch aus den Slot-Koordinaten und Relationen rendern, ohne hardcodierte CSS-Regeln.
- Semantische Spannungsfelder und Richtungsdynamiken (z. B. Konflikte, Wurzeln, Konsequenzen) für Screenreader und Generative Engines barrierefrei beschreiben.
- Verträge über Kartendecks (`deckContract`) erzwingen, bevor Karten gezogen werden (z. B. Mindestanzahl, Eignung für 22-Karten-Majors-Only Decks).

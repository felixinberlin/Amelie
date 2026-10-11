# Fugenduell — reading order for agents and people

1. [`design-vision.md`](design-vision.md): **start here.** Where we are, what the tests taught us, the shared vision (powers, power-ups, named places, evolution across years), balance gate, roadmap, open questions.
2. [`wetterjahr-modus.md`](wetterjahr-modus.md): the core idea (real city weather, month by month) and the decided rules (watch mode, same city, relative thresholds, places).
3. [`regelwerk-v0.1.md`](regelwerk-v0.1.md): card-game rules (hand, intents, reactions) and the measurement → card conversion.
4. [`kartenzahl-und-beispielkarte.md`](kartenzahl-und-beispielkarte.md): deck sizes (research across 10 games) and a fully explained example card.
5. [`testspiel-2026-10-11.md`](testspiel-2026-10-11.md): the first games between two agents and what they broke.
6. [`daten-audit-2026-10-09.md`](daten-audit-2026-10-09.md): why there are no invented numbers.

Older brainstorms in this folder (`Mechanics.md`, `Fugenduell-battle.md`, `skill-tree.md`, `economy.txt`, …) are unchecked imports: useful ideas, not rules.

Code: `src/engine/fugenduell/` (engine + tests), `src/data/fugenduellPlaces.ts`, `src/components/simulators/FugenduellWeatherWatch.tsx`.

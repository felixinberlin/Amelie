# Fugenduell — First test games: two agents play watch mode

11.10.2026. Engine: `src/engine/fugenduell/watchMode.ts` (watch-v1) + `weatherYear.ts` (wetter-v1), real daily data from NASA POWER for **Berlin and Madrid, March 2025 – February 2026** (`src/data/fugenduellWeather/`).
Decisions by Félix before the games: **watch mode first, same city for both players, relative thresholds** (which months count as rain, warm, heat, drought or cold months is relative to the city's own year; how hard they hit is measured in absolute units).

## Setup

Two independent agents (player A and player B) got **the identical brief**: rules, species table with card cycles and indicator values, and the public month cards of both cities. Each picked 3 species per city, blind and at the same time, without code or files. The simulation then ran with no further input.

## Round 1

| City | Player A | Player B | Result |
|---|---|---|---|
| Berlin | butterfly bush, celandine, plantain | **same** | draw |
| Madrid | celandine, plantain, meadow grass | **same** | draw (before the bug fix: B won through a tie-break bug) |

Both agents had **misread** a rule line ("heat (minus 1 if T ≥ 7)" was read as "only warm-loving plants lose"). That's why they took "neutral" plants for Madrid.

## Round 2 (clarified rule text, no results revealed)

| City | Player A | Player B | Result |
|---|---|---|---|
| Berlin | butterfly bush, celandine, plantain | **same** | draw |
| Madrid | butterfly bush, toadflax, purslane | butterfly bush, wall-rue, celandine | **B wins 337 : 282** shoot-months |

Madrid round 2, shoots at the end of each month (first number in the bracket = butterfly bush):

| Month | Card | A | B |
|---|---|---|---|
| Mar | rain, cold | 11 (3/4/4) | 10 (3/3/4) |
| Apr | rain | 16 | 18 |
| May | – | 24 | 26 |
| Jun | warm, heat 2 | 22 (15/3/4) | 36 (15/4/17) |
| Jul | warm, heat 3, drought 3 | 18 (18/0/0) | 34 (18/1/15) |
| Aug | warm, heat 3, drought 4 | 20 | 31 |
| Sep | warm, heat 2, drought 3 | 25 | 30 |
| Oct | drought 2 | 27 | 31 |
| Nov | – | 29 | 31 |
| Dec–Feb | cold | 30 (30/0/0) | 30 (30/0/0) |

B wins through celandine (height 3), which survives shading in June and July while A's toadflax and purslane (height 2) are shaded out completely by the two butterfly bushes. From December on, **only the two butterfly bushes are left in the crack**, 30 shoots each.

## What the test games found

**Bugs, fixed in this session (with tests):**
1. **Rounding bug in strategy points:** butterfly bush, celandine and meadow grass got only 9 cards; the tenth was `undefined`. That species then **froze for the rest of the year**. Now: C5/S4/R1, C5/S1/R4, C1/S3/R6, and a guard against it.
2. **Shading tie-break** always hit player A first: mirror matches weren't draws. Now ties alternate between the sides.
3. **A Spread card with no own shoot** used up energy, so dead perennials couldn't regrow from seed. Now it's skipped at no cost.

**Design problems, open for Félix:**
4. **The butterfly bush is a dominant strategy.** Height class 4 + 5 Spread cards + 4 Endure cards: it ends up holding the whole crack in every game. In a real pavement crack, trampling and street cleaning remove shrubs; the simulation doesn't have them. Proposal: a **crack type** with a disturbance rule (pavement crack: each month the tallest species lose shoots to trampling and cleaning, rosette and cushion plants less; wall joint and wasteland: hardly any).
5. **Full information → identical picks.** Both agents picked identically 3 out of 4 times. With public month cards the year is predictable. Options: "surprise year" (city known, year hidden), or only showing the next 1–2 months.
6. **The rule text has to be unambiguous.** Loss rules need to be written as "everyone loses X, adapted plants lose 1 less", not in brackets.
7. **Scoring rewards early mass:** shoot-months add up over the year, so who's big in spring and autumn decides. It works, but check whether "presence at the end + seeds" would fit an annual-plant year better.

## Reproduce

```bash
npx vitest run src/engine/fugenduell/        # 43 tests, including mirror matches and capacity limits
python3 scripts/fugenduell/wetterjahr.py 40.42 -3.70 2025 madrid-2025 Madrid   # new fixture
```

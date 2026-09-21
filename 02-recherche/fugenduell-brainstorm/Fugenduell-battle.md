Solving Battle Clarity in Fugenduell
The core problem is that the spec describes a battle outcome ("both plants start at 50% coverage, events shift coverage") but never defines how stats, CSR, arenas, skills, and events actually resolve into that outcome. Without a transparent resolution pipeline, players will feel like they're watching random numbers, and the game will lose its educational value.

Here is a complete, implementable mechanic set designed for clarity, agency, drama, and async play.

1. The Core Insight: Make the Resolution Visible
The battle should not be a black box. Every round should follow the same visible pipeline:

text
EVENT → TEST → TACTIC → MATH → RESULT → DRAMA
Each step is shown to the player in the battle log. By the end of the battle, the player should be able to explain exactly why they won or lost.

2. The Coverage Bar (The Board)
The crack is represented as a horizontal tug-of-war bar from 0% to 100%.

text
Löwenzahn [████████████░░░░░░░░░░░░░░] Mauerraute
            52%                    48%
Both plants start at 50% / 50%.

Coverage is clamped to 5%–95% (no instant win).

The bar animates on every change.

The bar is the primary visual on the battle screen.

This is immediately readable. You do not need to understand CSR theory to see who is winning.

3. The Event Deck (The Drama)
Each of the 6 rounds draws one Event from a seasonal deck. Events are the same for both plants (fair), and each event tests one primary stat.

Example Year Deck (6 Events)
Round	Month	Event	Tests	Flavor
1	March	Snowmelt	WURZEL	Nutrients flush into the crack
2	May	Street Sweeper	TRITT	Mechanical destruction
3	July	Heatwave 38°C	DÜRRE	The asphalt oven
4	September	Seed Dispersal	SAAT	Who spreads further?
5	November	First Frost	DÜRRE	The cold snap
6	January	Ice & Salt	CHEMIE	Winter salt and freeze-thaw
Why this works:

Each round tests a different stat, so no single stat dominates.

The events are thematic and educational.

Both plants face the same events, so it is fair.

The player can predict which stats matter and build their plant accordingly.

4. The Tactic System (The Agency)
Before each round, both players secretly choose a Tactic from four options. Tactics modify the stat test and create rock-paper-scissors mind games.

Tactic	Effect	Beats	Loses To
Wachsen (Grow)	+3 to your tested stat	Aussäen	Halten
Halten (Hold)	+3 to defense (opponent's stat -3)	Wachsen	Chemie
Aussäen (Seed)	Bank +2 to any future round	Chemie	Wachsen
Chemie (Chem)	-3 to opponent's tested stat	Halten	Aussäen
Resolution: Both tactics reveal simultaneously. Apply both effects. Then compare stats.

Why this works:

The player has meaningful choices every round.

The rock-paper-scissors creates prediction and bluffing.

The effects are small (+3/-3) so they don't override plant stats.

The tactics are simple to understand and display.

5. The Resolution Formula (The Math)
For each round, calculate each plant's Effective Stat:

text
Effective Stat = Base Stat
              × Arena Modifier
              × CSR Modifier
              + Tactic Modifier
              + Skill Modifier
Then:

text
If A > B:  A gains (A - B) × 0.5 coverage
If B > A:  B gains (B - A) × 0.5 coverage
If A = B:  No change
Cap: Coverage change is capped at ±20% per round.

Clamp: Coverage is clamped to 5%–95%.

Arena Modifiers (Simple Multipliers)
Arena	WURZEL	TRITT	DÜRRE	SAAT	TEMPO	CHEMIE
Gehwegfuge (Sidewalk)	×1	×2	×1	×1	×1	×0.5
Mauerfuge (Wall Joint)	×2	×0	×2	×0.5	×0.5	×1
Baumscheibe (Tree Pit)	×1.5	×0.5	×0.5	×1.5	×1	×1
Straßenrand (Gutter)	×0.5	×1	×1.5	×1	×1	×2
Gleisschotter (Railway)	×1	×0.5	×1.5	×0.5	×1	×2
These are displayed in the battle UI: "In this arena, TRITT is doubled, DÜRRE is halved."

CSR Modifiers
Class	Bonus	Penalty
C (Competitor)	+2 when no disturbance event has occurred in the last 2 rounds	-2 against TRITT events
S (Stress-tolerator)	+2 to DÜRRE and TRITT	-2 to TEMPO and SAAT
R (Ruderal)	+2 to TEMPO and SAAT	-2 to TRITT and DÜRRE
This creates the rock-paper-scissors:

C beats R (outgrows them in stable conditions)

R beats S (recovers faster from disturbance)

S beats C (survives where C cannot)

6. The Battle Log (The Clarity)
Every round produces a log entry that shows the full math. Example:

text
ROUND 3: July — Heatwave (38°C)
Test: DÜRRE

Löwenzahn (RC):
  Base DÜRRE: 4
  × Arena (Gehwegfuge): ×1.0 = 4.0
  × CSR (RC): ×0.5 = 2.0
  + Tactic (Wachsen): +3 = 5.0
  + Skill (Pfahlwurzelbohrer): +0 = 5.0
  Effective: 5.0

Portulak (SR):
  Base DÜRRE: 9
  × Arena (Gehwegfuge): ×1.0 = 9.0
  × CSR (SR): ×1.5 = 13.5
  + Tactic (Halten): +0 = 13.5
  + Skill (C4-Turbo): ×3.0 = 40.5
  Effective: 40.5

Result: Portulak wins by 35.5
Coverage change: +17.75% (capped at +20%)
Löwenzahn: 50% → 32.25%
Portulak: 50% → 67.75%

Skill Triggered: C4-Turbo (DÜRRE counts 3x in heatwaves)
Why this works:

The player sees exactly why they won or lost.

The math is simple enough to follow.

The skills feel impactful because they visibly change the math.

The log is educational: players learn what DÜRRE, CSR, and arena modifiers mean.

7. Async Play (The Format)
Battles are asynchronous but not passive.

How it works:
Challenge: Player A selects a plant from their collection and challenges Player B (or an AI ghost).

Arena: Determined by the crack type (or chosen from a list).

Tactic Setting: Both players set their tactics for all 6 rounds in advance (like Football Manager).

Resolution: The battle resolves server-side instantly.

Replay: Both players watch the replay, round by round, with the full battle log.

Result: Winner gains XP, seeds, and crack level progress.

Optional Live Mode: For players who want real-time mind games, a live mode allows round-by-round tactic selection with a 30-second timer.

Why this works:

Async means no waiting for opponents.

Pre-set tactics mean the battle can resolve instantly.

The replay is dramatic because you see the coverage bar move and the log unfold.

Live mode adds tension for those who want it.

8. Comeback Mechanics (The Drama)
To prevent runaway victories and keep battles tense:

Underdog Bonus: A plant below 20% coverage gains +2 to all stats.

Momentum: Winning a round by more than 10% grants +1 to the next round's stat.

Last Stand: At 5% coverage, a plant automatically triggers its Signature Move (if unlocked).

Event Escalation: Rounds 5 and 6 have stronger events (×1.5 effect) for dramatic finishes.

These mechanics ensure that no battle is truly over until the final round.

9. Signature Moves (The Unlock)
At Level 3 (Phenology), a plant unlocks its Signature Move. This is a passive or triggered ability that is always visible in the battle log.

Examples:

Plant	Signature Move	Effect
Löwenzahn	Fallschirmwolke	When you win a round, gain +2% coverage
Breitwegerich	Trittplatte	TRITT counts double in high-disturbance arenas
Mauerraute	Kalkanker	Invincible in Mauerfuge unless opponent uses Chemie
Portulak	C4-Turbo	DÜRRE counts ×3 in heatwave events
Schöllkraut	Milchsaft	At battle start, opponent's CHEMIE is reduced by 2
These are not active abilities. They are always-on modifiers that make each plant feel unique without adding cognitive load.

10. Concrete Example Battle
Let me walk through a full battle to show how this all works.

Setup:

Arena: Gehwegfuge (Sidewalk)

Plant A: Löwenzahn (RC) — WURZEL 7, TRITT 5, DÜRRE 4, SAAT 9, TEMPO 8, CHEMIE 3

Plant B: Breitwegerich (RCS) — WURZEL 6, TRITT 9, DÜRRE 6, SAAT 7, TEMPO 5, CHEMIE 4

Pre-Battle Tactics:

Round	Plant A Tactic	Plant B Tactic
1	Wachsen	Halten
2	Halten	Wachsen
3	Aussäen	Chemie
4	Wachsen	Wachsen
5	Halten	Halten
6	Chemie	Aussäen
Round 1: March — Snowmelt (WURZEL)

Arena: Gehwegfuge (WURZEL ×1)

Plant A: 7 × 1 = 7 + 3 (Wachsen) = 10

Plant B: 6 × 1 = 6 + 3 (Halten defense) = 9, but Halten reduces A by 3 → A = 7

Result: A (7) vs B (6) → A wins by 1 → +0.5% coverage

Coverage: A 50.5%, B 49.5%

Round 2: May — Street Sweeper (TRITT)

Arena: Gehwegfuge (TRITT ×2)

Plant A: 5 × 2 = 10 + 0 (Halten) = 10

Plant B: 9 × 2 = 18 + 3 (Wachsen) = 21

Plant A's Halten reduces B by 3 → B = 18

Result: B (18) vs A (10) → B wins by 8 → +4% coverage

Coverage: A 46.5%, B 53.5%

Round 3: July — Heatwave (DÜRRE)

Arena: Gehwegfuge (DÜRRE ×1)

Plant A: 4 × 1 = 4 + 0 (Aussäen) = 4

Plant B: 6 × 1 = 6 + 0 (Chemie) = 6

Plant B's Chemie reduces A by 3 → A = 1

Result: B (6) vs A (1) → B wins by 5 → +2.5% coverage

Coverage: A 44%, B 56%

Round 4: September — Seed Dispersal (SAAT)

Arena: Gehwegfuge (SAAT ×1)

Plant A: 9 × 1 = 9 + 3 (Wachsen) = 12

Plant B: 7 × 1 = 7 + 3 (Wachsen) = 10

Result: A wins by 2 → +1% coverage

Coverage: A 45%, B 55%

Round 5: November — First Frost (DÜRRE, ×1.5 effect)

Arena: Gehwegfuge (DÜRRE ×1)

Plant A: 4 × 1 = 4 + 0 (Halten) = 4

Plant B: 6 × 1 = 6 + 0 (Halten) = 6

Result: B wins by 2 → +1% × 1.5 = +1.5% coverage

Coverage: A 43.5%, B 56.5%

Round 6: January — Ice & Salt (CHEMIE, ×1.5 effect)

Arena: Gehwegfuge (CHEMIE ×0.5)

Plant A: 3 × 0.5 = 1.5 + 0 (Chemie) = 1.5

Plant B: 4 × 0.5 = 2 + 0 (Aussäen) = 2

Plant A's Chemie reduces B by 3 → B = -1 (clamped to 0)

Result: A (1.5) vs B (0) → A wins by 1.5 → +0.75% × 1.5 = +1.125% coverage

Final: A 44.625%, B 55.375%

Winner: Breitwegerich (Plant B)

The battle log shows every step. The player can see that Breitwegerich won because it dominated the TRITT and DÜRRE rounds, while Löwenzahn's strengths (SAAT, TEMPO) were not tested enough.

11. Why This Solves Battle Clarity
Problem	Solution
No resolution formula	Effective Stat formula with visible math
No player agency	Tactic system with rock-paper-scissors
No drama	Coverage bar, comeback mechanics, escalating events
No educational value	Battle log teaches CSR, stats, arenas
No async support	Pre-set tactics + replay
No balance	Caps, clamps, underdog bonus, event variety
No skill integration	Signature Moves as passive modifiers
No arena meaning	Simple multipliers displayed in UI
12. Implementation Notes
Battle engine: Pure TypeScript function resolveBattle(plantA, plantB, arena, tacticsA, tacticsB, events) returns a BattleLog[].

Deterministic: No RNG. The same inputs always produce the same output. This is critical for fairness and replayability.

Testable: You can unit-test every round resolution.

Extensible: New events, arenas, tactics, and skills are just data.

Displayable: Every step of the math is a string that can be shown in the UI.

13. What I Would Change in the Spec
Add a battles table with plant_a_id, plant_b_id, arena_type, tactics_a, tactics_b, event_deck, result_log.

Add an events table with name, stat_tested, multiplier, season.

Add an arena_weights table with arena_type, stat, multiplier.

Add a signature_moves table with species_id, name, effect_type, effect_value.

Define the resolution formula in the PRD so the AI coding agent does not have to guess.

Bottom Line
Battle clarity is solved by making the resolution visible, deterministic, and player-driven. The Coverage Bar shows who is winning. The Event Deck creates drama. The Tactic System creates agency. The Battle Log creates understanding. The CSR/Arena/Skill modifiers create depth. And the async replay format makes it all work on mobile.
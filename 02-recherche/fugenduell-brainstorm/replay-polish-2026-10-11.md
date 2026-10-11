# Fugenduell: playable combos and readable replays — 11 October 2026

This pass builds on the combo prototype. It introduces no new botanical claims or sources. Effects below are game rules, not measured ecological outcomes.

- Canopy protection: a living plant of height class ≥3 makes its shade-tolerant teammates lose shoots to crowding after unprotected plants. Wall Clan uses the same priority for wall dwellers, only at wall sites. If every remaining plant is protected, ordinary height and shade rules still resolve crowding. Capacity always applies.
- Heatwave Gang: living members pool their hardening against heat damage after species resistance. Protection is allocated one point per member per pass in species-ID order; spent hardening is debited in the same order. Remaining hardening handles other weather losses normally. Reordering the team cannot change this allocation.
- Deep cracks add a cleaning in local August (February south of the equator), following ordinary cleaning rules; it does not double an already scheduled cleaning.
- Recheck capacity after late special attacks and succession bonuses, before monthly status and scoring.
- Paving Armour grants one shoot per surviving armour member when any trampling removes shoots, rather than one per removed shoot. The description now matches the existing implementation.

Replay improvements: green-team strategy presets, duplicate prevention in team selection, touch-accessible combo explanations, adjustable playback speed, automatic pause on mode changes, cumulative score graph, and evolved capacity in the ground bar. Setup changes take effect when the next year is loaded. The score graph reveals only months already reached; full calculation details remain expandable.

Verification covers evolved capacity/HP bounds across all generic places and soil levels, exchanged-team symmetry, active shield/cleaning effects, and mobile replay controls. Existing deterministic weather fixtures are used; no paid map APIs or model calls.

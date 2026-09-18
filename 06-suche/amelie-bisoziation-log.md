# Bisoziation-Log

State file for the `lacunar-bisociation` skill. Every run reads this file first and adds to it at the end.
Rows record frame pairs; the retro records what the method learned.

Companion to `amelie-pruefprotokoll.md`, `amelie-suchplaybook.md` and `amelie-quellen.md` — this
file tracks a different idea-generation method (frame collision) rather than search-and-check;
survivors here still go through the normal Amélie existence check before becoming a tin.

## Frame pairs

| Date | Anchor (Frame A, source) | Collider (Frame B) | Distance 1–5 | Candidates | Survivors | Best gap (one sentence, no solution) | Amélie verdict(s) |
|---|---|---|---|---|---|---|---|
| 18.09.2026 | Citizen fireball reporting (Type B): AMS/IMO fireball report forms + German Feuerkugelnetz successor networks — witnesses submit sighting reports independently, hours to days later, from memory; professionals group and triangulate them asynchronously, "not in real time" (AMS) | Ant stigmergy: decentralized pheromone-trail reinforcement, no central evaluator, continuous real-time convergence, fast evaporation of unreinforced trails | 5 | 20 (4 taken to reality check) | 2 (packed as one tin, two Bausteine) | A single fireball report sits alone in an asynchronous queue for days until enough independent witnesses happen to submit the same event from memory, instead of nearby people being alerted within minutes while recollection is sharpest — and the far denser network of ambient dashcam/doorbell cameras that already outnumbers dedicated sky cameras loses its footage to auto-overwrite before anyone notices what it caught. | verengt, verengt (Feuerkugel-Sofortnetz, 05-dosen/feuerkugel-sofortnetz.md); besetzt ×2 (radio-scatter correlation → FRIPON; phone infrasound → RedVox) |

## Distance yield

| Distance | Pairs tried | Survivors | Survivors that Amélie judged frei/verengt |
|---|---|---|---|
| 1–2 | 0 | 0 | 0 |
| 3 | 0 | 0 | 0 |
| 4 | 0 | 0 | 0 |
| 5 | 1 | 2 | 2 |

## Colliders that yielded

- **Ant stigmergy** (biology, distance 5) — against a Type B citizen-science anchor (fireball witness reporting), it produced the gap between asynchronous/passive corroboration and real-time/active corroboration. Worth trying against a *different* Type B anchor (e.g. a different asynchronous volunteer-then-expert pipeline) to see if the same "make the passive step active/real-time" move generalizes, or if it was specific to this anchor.

## Retros

### Run 0 (template)
- **Learned:** —
- **Mistake:** —
- **Next time:** Pick a Type B anchor (citizen science with manual evaluation) and a distance-4 collider.

### Run 3 — 18.09.2026 (Researcher #3, method A/B test)
- **Learned:** Following the Run 0 retro (Type B anchor) but pushing distance to 5 instead of 4 worked well here — "ant stigmergy" vs. "citizen fireball reporting" produced two genuinely non-obvious survivors and two clean kills, not a pile of unusable noise. Distance 5 didn't degrade into nonsense when the anchor was concrete and well-documented (AMS/IMO process, stated explicitly as non-real-time).
- **Learned:** Two of the four tail-sampled candidates (radio-scatter correlation, phone infrasound) turned out to already exist at the institutional/citizen-science level (FRIPON, RedVox) — both were still non-obvious enough to not be on the mode list, which suggests the *mode list* and *occupied territory* are genuinely different filters: an idea can be simultaneously "no LLM would guess this first" and "already built by a specialist community." Both checks are needed, not just one.
- **Mistake:** Nearly packed the two survivors as separate one-page tins; on reflection they share one recipient class (fireball citizen-science networks: AMS/IMO/GMN) and one "why now," so bundling them as two Bausteine of one tin was the better match to Amélie rule 1 (matching is the work) than two thin cans.
- **Next time:** Try a Type A or C anchor instead of Type B (already used twice in this log's two runs so far, once by each researcher going by the retro template) to see if the ant-stigmergy-style "passive→active, batch→real-time" collision move still produces survivors outside citizen-science pipelines — e.g. against a public AI trial (Type C) with a named async bottleneck.

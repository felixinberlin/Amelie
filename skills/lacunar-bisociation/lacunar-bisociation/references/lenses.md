# Lenses and templates

## Frame distance scale

Rate how far Frame B is from Frame A. Aim for 3 or higher.

| Score | Meaning | Example (A = volunteer bird-nest monitoring) |
|---|---|---|
| 1 | same domain | another citizen-science app |
| 2 | neighbouring domain | forestry inventory software |
| 3 | different domain, shared mechanic | museum conservation (slow, careful handling of fragile objects) |
| 4 | different domain, different values | speedrunning communities (instant feedback, leaderboards) |
| 5 | seemingly incompatible | Lectio Divina, tidal rhythms, fermentation |

Distance 5 produces many unusable candidates, but it also produces the rare lacunar one. Mix distances across runs and record in the log which distances yielded survivors.

## Anchor sources (Frame A)

These must come from a real document or observation, taken from Amélie's source types:

| Type | Pattern | Where the friction is |
|---|---|---|
| A: scheme without software | scoring system, checklist or thresholds, applied by hand | the person applying it at 23:00 with a clipboard |
| B: citizen science with manual evaluation | volunteers deliver data, and professionals evaluate it for months | the volunteer who never hears back |
| C: public AI trial | a workshop report with named limits | the limit they name |
| D: research without a tool | a paper proves feasibility, but no tool exists for laypeople | the gap between the PDF and a phone |

Félix's own projects also count as anchors when the user asks about them, such as tortilla physics, WBS search or the wood-selling agent. Read the relevant memory or project file first.

## Collider catalog (Frame B)

This is a starter list. Extend it in the log when a collider yields something.

- **Crafts:** sourdough feeding, tortilla flipping, bookbinding, dry-stone walling, cork harvesting (9-year cycle)
- **Physical processes:** Maillard reaction, annealing, capillary action, tides, frost heave
- **Social rituals:** Stammtisch, tapeo, Kirchweih, Sunday market haggling, the siesta
- **Biology:** ant stigmergy, mycorrhizal trading, bird mobbing calls, cuttlefish camouflage
- **Old techniques:** Llull's combinatorial wheels, memory palaces, marginalia, commonplace books
- **Recent AI capabilities:** on-device vision, long-context reading of entire archives, voice cloning for accessibility, cheap agentic web actions, video-to-3D reconstruction

## Decomposition template

| Slot | Frame A | Frame B |
|---|---|---|
| Materials | | |
| Mechanics | | |
| Goals | | |
| Emotions | | |
| Constraints | | |
| Rituals / timing | | |

Put one line per cell. Contradictions between the two columns are the friction points.

## Friction prompts

- A assumes ___ is scarce, but B treats it as abundant. What if A had B's abundance?
- A is fast and B is slow, or the reverse. What would A look like on B's clock?
- A is solitary and B is communal, or the reverse.
- A fails silently, while B makes failure visible or audible.
- A's expert is replaced by B's apprentice. What would the apprentice need?

## Optional slow-reading lenses

These are **prompting devices**, not claims about how insight works. Use at most one per run.

- **Lectio-style reading.** Take one key sentence from the anchor source and read it four times: literally, as an image, as a demand, and as a promise. Note what shifts between the readings.
- **Llull wheel.** Put the 6 slots of A and the 6 slots of B on two rings. Rotate through all 36 pairings quickly, and stop at the ones that make you hesitate.
- **Tree walk.** Move the idea through a fixed ladder of levels, from material through function, community and meaning to purpose, and ask what changes at each rung. The ladder is loosely inspired by the kabbalistic tree of life as a structure for invention. Use it only as a checklist.

## Tail-sampling prompt (for step 4)

> For friction point F, give 5 ideas, each with an estimated probability that a typical assistant would propose it. Sample from the tails: every idea must have a probability below 0.10.

Then discard any idea that still resembles an item on the step-1 mode list.

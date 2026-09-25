---
status: Available
delivery_method: E-Mail
target_maker: Pl@ntNet and The Plant Game
review_score: 28/35
architecture_tier: Tier 1/2
source_type: Type C/D
---
# The Living Game Object

**One sentence:** A location-based game in which the contested object is neither a portal nor a gym but a real plant in a real pavement crack — one that can freeze, be swept away or pulled out between two rounds, and then is gone.

**As of:** 21. September 2026 · **Recheck by:** März 2027  
**Recipient:** Pl@ntNet and The Plant Game (INRIA, Cirad, IRD — they already have a duel mode) · secondary: Play Curious, MMOS, Scientific Game Jam  
**Verdict:** 🔨 **build skeleton first, then gift**  
**Review:** 28/35 · Tier 1/2 · Type C/D (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Location-based games have an object problem nobody talks about: their world is curated. Gyms, portals and places are database rows pinned to postboxes and murals. They do not move, grow or die. Meanwhile there are games about real plants that play out in a built world. Between the two lies an empty category: a game object that exists whether or not anyone plays. A wall fern in a joint has been there for eighty years; a dandelion survives the winter or does not. That inverts the genre's basic assumption — the save file is no longer authoritative.

## Why now

- Individual re-identification rather than species identification: not "this is Taraxacum officinale" but "this is the same plant as in the photo from the day before yesterday, taken by someone else". Instance segmentation plus feature matching on device — the one part that did not exist two years ago.
- Species identification has become free and need not be built; existing platforms provide it through an API.
- The stats need not be invented: plant trait databases supply them. That is not AI but legwork — and it means the balance comes from ecology rather than from a hunch.

## Sketch

The object is the plant, not the place: an individual in a joint, recognisable from the photo, with stats from its species' trait data and modifiers from its location — trampling, substrate, road salt in winter. Claiming and defending work as the genre does, but between people over a thing nobody owns. The season is the opponent, not the other player: events come from real weather and real municipal operations. Death is real — if the plant disappears, the object disappears, and what remains is the history. The invariant without which it must not be built: no point ever changes hands because a plant is missing.

## First step

**Ticket:** The runnable skeleton, without which the idea would not be a gift under rule four.

The destruction invariant is the core: duels are fought with a seed card drawn when documenting; the individual stays place-bound and untradeable. Absence triggers nothing — if a contested object disappears mid-dispute, the dispute is void. The location carries a value that rises with the diversity of species there, so pulling a plant lowers your own multiplier. Done when those four rules demonstrably hold in the prototype.

## Where it breaks

A game about urban nature in which uprooting is a winning move is worse than no game. The incentive comes not from malice but from structure: destruction produces a state indistinguishable from natural death, costs nothing and benefits the perpetrator. The usual patches miss — expiring history punishes the victim, and points for holding overlook that the attacker takes no points but switches off someone else's yield.

## Who has already tried this

Out and About (2026) is cozy foraging over real plant species, single player in a built world — "a game about real plants" is therefore taken and no longer a pitch by itself. Niche builds real Mendelian genetics into its core loop and proves the pattern of real science as a game system while removing its novelty. Pokémon GO, Ingress and Munzee have had claiming and defending mature for years — on curated virtual objects with no lifespan. What remains free is the object that exists without the game and dies without it.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

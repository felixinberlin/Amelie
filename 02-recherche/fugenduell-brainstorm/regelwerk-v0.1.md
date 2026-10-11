# Fugenduell — Rulebook v0.1 (draft for discussion)

Status: Draft, 11.10.2026. Not balanced and not playtested. Not wired into the engine.
It builds on `Mechanics.md`, `Fugenduell-battle.md` and the community engine (`src/engine/fugenduell/communityEngine.ts`). It also follows the data audit of 09.10.2026 (`daten-audit-2026-10-09.md`), which paused score-based duels until there is "an explicit conversion into game rules". This document proposes that conversion.

---

## 0. The one rule above all rules

**No number without a measurement.** Every number on a card comes from a sourced value, converted by a rule in the published conversion table (§3). Each rule is versioned. If a value is missing, the card shows **?** and that rule does not fire: no bonus and no penalty. A missing value never means zero.

What is invented is said to be invented. The game board (sites, seasons, energy, card effects) is game design and is labelled that way. The plants are not invented.

---

## 1. What we borrow, and from where

| Game | What we take | What we leave out |
|---|---|---|
| **Slay the Spire** (1 and 2, EA since 03/2026) | Energy per turn, draw 5 and discard at end of turn. **Enemy intents**: you see the next threat before you play. After a fight you pick 1 of 3 cards or skip. You can remove cards. Relics. A branching map. Ascension levels. | Hit points. Here, the space you hold in the crack is your life total. |
| **Yu-Gi-Oh!** | **Graveyard as a resource**, which becomes the **seed bank**. Cards set face down that fire on a condition (traps), which become **reactions**. A short **chain** (last in, first out). A **ban list**, used for *Ailanthus*. A fixed deck size with a copy limit. | Turn-1 combos, burning life points, extra deck. |
| **Marvel Snap** | **6 turns**, **3 locations**, win **2 of 3**. Both players play face down and reveal at the same time. Each location has its own conditions. | Rising energy 1→6 (we tie energy to day length instead), the Snap/cube bet. |
| **Inscryption** | The **scale** (a tug-of-war bar) is the most readable win condition there is. That is our coverage bar, one per section. | Sacrifice costs. |
| **Pokémon TCG / games** | A type triangle. Here it is Grime's C-S-R, but taken from **measured** CSR shares, not from archetypes. | Weakness ×2 (too swingy, and there is no ecological basis for it). |
| **Phylo** (UBC, open source, since 2010) | Real species, events like wildfire as cards, open decks that anyone can extend. There is evidence that it teaches ecology better than a slideshow (Palgrave Communications 2019). | Its food chains: a crack is not a food web. |
| **Wingspan / Forest Shuffle** | Real natural history printed on the card. The facts are part of the joy, not a footnote. | Engine scoring through points salad. |
| **Balatro** | Show the math. Every number on the screen can be followed. | — |

---

## 2. Overview

Two players, or one player against the year (solo mode, §9). Each player brings a **community** of 3 species. The **crack** has 3 sections. A game lasts **one year = 6 seasons**. At the end, whoever holds the majority of the ground in **2 of the 3 sections** wins.

```
              Section A           Section B            Section C
              Crack centre        Kerb edge            Wall foot
Profile       L8 F4 R7 N6 S2      L8 F3 R8 N5 S4       L5 F6 R8 N7 S0
Disturbance   high (trampling)    medium (salt, broom) low
Ground        10 fields           10 fields            10 fields
Bar           You ███░░░░ Rival   ...                  ...
```

---

## 3. From measurement to card: conversion table v1

All the source values are already in the repo: Pladias (`fugenduellScientificTraits.json`) and UNDERPLOT v39 (`fugenduellRootTraits.json`).

| Card field | Source value | Conversion rule v1 | Missing → |
|---|---|---|---|
| **Strategy points C/S/R** | Pierce C-, S- and R-score (%) | Divide each by 10 and round with the largest-remainder method so the three sum to **10** | species locked (§8) |
| **Site preference** | Ellenberg-type indicator values L, F, R, N, S (Pladias, ordinal) | Shown as printed. `x` = broad amplitude, always fits | **?**, counts neither for nor against |
| **Height class** | Height [m], midpoint of the range | ≤0.1 → 1 · ≤0.3 → 2 · ≤1 → 3 · ≤5 → 4 · >5 → 5 | 2 (median) and marked ? |
| **Flowering window** | Flowering period [month] | The seasons whose month falls inside the window | no Bloom cards |
| **Life form** | Raunkiær life form | therophyte = annual, hemicryptophyte = bud at the soil, phanerophyte = woody | treated as hemicryptophyte, marked ? |
| **Keyword Deep root** | UNDERPLOT RDepth | ≥ 0.5 m | no keyword |
| **Keyword Bud bank** | UNDERPLOT BBsize | ≥ 10 buds | no keyword |
| **Signature keywords** | Facts with a source in `fugenduellBotany.ts` | 1 card per evidenced fact, from a fixed list (§5.4) | no card |

Indicator values describe **where a species is found**. They do not describe how strong it is. That is why the game only uses them as *fit to a site*, never as attack power.

### 3.1 Resulting values (computed from the repo data, 11.10.2026)

| Species | Pierce CSR | C/S/R points | Height | Life form | Flowering | L F R N S | Keywords |
|---|---|---|---|---|---|---|---|
| Greater plantain | C/CR | 8/0/2 | 2 | hemicr. | Jun–Oct | 7 5 6x 6 1 | Bud bank |
| Annual meadow grass | SR | 1/3/6 | 2 | hemicr. (thero.) | Jan–Dec | 7 6 6x 8 1 | — |
| Hairy bittercress | R/CR | 2/0/8 | 2 | thero. | Apr–Jun | 6 5 5 6 0 | — |
| Ivy-leaved toadflax | R/CR | 4/0/6 | 2 | hemicr. | May–Sep | 6 4 8 5 0 | Bud bank |
| Wall-rue | S/CSR | 1/6/3 | 2 | hemicr. | Jul–Sep* | 8 3 8 3 0 | Bud bank |
| Purslane | R | 0/0/10 | 2 | thero. | Jun–Oct | 8 4 7 7 2 | — |
| Greater celandine | CR | 5/1/4 | 3 | hemicr. | May–Sep | 6 5 7x 8 0 | Bud bank |
| Procumbent pearlwort | SR | 0/5/5 | 1 | hemicr. | May–Oct | 7 6 5 6 1 | Bud bank |
| Danish scurvygrass | R | 1/0/9 | 2 | thero. (hemicr.) | May–Jun | ? ? ? ? ? | Bud bank |
| Butterfly bush | CS | 5/4/1 | 4 | nanophan. | Jul–Aug | 8 4 7 4 0 | — |
| *Tree of heaven* | C/CS | 8/2/0 | 5 | macrophan. | Jun | 7 5 7 7 1 | **banned** (§8) |
| Dandelion | — | **locked** | — | — | — | — | Deep root (RDepth 1.39 m), Bud bank |
| Canadian horseweed | — | **locked** | — | — | — | — | Deep root (0.64 m) |
| Silver moss | — | **locked** | — | — | — | — | — |

\* For a fern, "flowering" means the period when spores ripen. The card says so.

These numbers hold surprises. In Pierce's leaf-trait method the plantain is a **C** plant (82 %), not a trampling specialist, and its S score is 0. The game keeps this. Its trampling strength comes from the **rosette** (a fact with a source), not from S. Players learn that CSR is a method and not a character trait.

---

## 4. Components

* **Species card** (3 per player, face up): all the values from §3.1 plus the facts with their sources.
* **Deck** (exactly 36 cards in the duel, starting with 12 in solo mode): built automatically from your community (§5). Numbers and a full example card: `kartenzahl-und-beispielkarte.md`.
* **Shoots** (tokens in your colour): one shoot holds one field.
* **Seed bank** (one per section, in your colour): seeds lying in the ground. This is the Yu-Gi-Oh graveyard turned into ecology.
* **Event deck**: 6 season stacks (§6).
* **Coverage bar** for each section.

---

## 5. Building the deck

### 5.1 Strategy cards (30)

Each species brings its 10 strategy points as cards:

| Type | Card | Cost | Effect (game design) |
|---|---|---|---|
| **C**, competition | *Spread* | 2 | Place 2 shoots of this species in one section (adjust for fit, §5.3). If the section is full: **shading** (§7.2). |
| **S**, stress tolerance | *Endure* | 1 | Put 2 **hardening** on your shoots in one section. Hardening cancels 1 shoot loss from heat, drought or salt. It lasts until it is used up. |
| **R**, ruderal strategy | *Sprout* | 1 | Turn up to 2 of your own seeds in a section into shoots, on empty fields only. |

That gives each strategy its home ground. C needs undisturbed ground and is expensive. S keeps what it has. R is cheap and lives on gaps left by disturbance. Grime in three cards.

### 5.2 Bloom cards (one per species)

*Bloom* (cost 1): only in seasons that fall inside the species' flowering window. Put 1 seed per shoot of this species into the seed bank of that section, up to 3. *Annual meadow grass* can bloom all year. *Danish scurvygrass* can only bloom in May.

### 5.3 Site fit

For each section, compare the species' indicator values with the section profile. A value fits if it is within ±1, or if it is marked `x`.
* **4 or 5 fits** → *Spread* places **3** shoots.
* **2 or 3 fits** → 2 shoots.
* **0 or 1 fits** (with at least 3 known values) → 1 shoot.
* **Fewer than 3 known values** → always 2 (neutral; a missing value is not a penalty).

### 5.4 Signature cards (evidenced keywords only)

| Keyword | Evidence | Card |
|---|---|---|
| Deep root | RDepth ≥ 0.5 m | Passive: the broom (*street sweeper*) removes at most 1 of these shoots per section |
| Bud bank | BBsize ≥ 10 | Reaction: "When shoots of this species are removed: put 1 back right away" |
| Rosette | fact from the source | Passive: −1 loss from trampling |
| Wind fruits | fact from the source | *Spread* may also target a neighbouring section |
| Exploding pods | fact from the source | Reaction: "When this species loses shoots: 1 seed into a neighbouring section" |
| Seed bank (long-lived) | fact from the source | Seeds of this species survive the **winter rule** (§6.3) completely |
| Crevice dweller / wall | fact from the source | Fit +1 in a section with a wall |

The effect is game design. The evidence only says that the trait exists. Every card shows the evidence line together with "Game effect: abstraction".

### 5.5 Deck limits

Duel deck exactly 36 = 30 strategy + 3 Bloom + 3 signature slots (max 1 copy per keyword per species). At most **one species with a height class ≥ 4** per community.

---

## 6. The year: seasons, energy, events

> **Superseded (11.10.2026):** the year now comes from a real city's weather, 12 months instead of 6 seasons; see `wetterjahr-modus.md`. The section below remains as the earlier version.

### 6.1 The six seasons

| Season | Month | Energy (day length) | Typical event |
|---|---|---|---|
| 1 | March | 3 | Snowmelt / ground frost |
| 2 | May | 4 | Street sweeper / trampling rush |
| 3 | July | 4 | Heatwave |
| 4 | September | 3 | Autumn storm |
| 5 | November | 2 | First frost |
| 6 | January | 2 | Freezing rain & road salt |

Energy follows day length, which is a qualitative abstraction and not a measurement. In winter both players can afford less.

### 6.2 Events and intents (borrowed from Slay the Spire)

At the **start** of each season, the event of the **next** season is turned face up. It shows its target section and its strength. Like an enemy intent in Slay the Spire, you see the threat coming one turn ahead and can prepare for it.

Examples (game design; strengths are scenario values):

* **Street sweeper (A, 3):** remove 3 shoots per player in section A. Rosette −1 each.
* **Heatwave (all, 2):** in every section with L ≥ 8, each player loses 2 shoots. Hardening prevents this.
* **Road salt (B, 3):** 3 shoot loss in B. Species with S indicator ≥ 2 lose 1 less.
* **Autumn storm:** every player may place each seed from the seed bank 1 section to the right, or leave it.
* **Rain (bonus):** both players draw 2 cards.

### 6.3 Winter rule (Raunkiær, data-backed)

After the November event:
* **Therophytes (annuals):** all their shoots die and **each becomes 1 seed** in its section. They really do spend the winter as seed.
* **Hemicryptophytes:** shoots stay, but are **dormant**. They do not count towards fit until March.
* **Phanerophytes:** stay unchanged.

---

## 7. The round

Every season runs the same way. Steps 3 and 4 happen at the same time (Marvel Snap).

1. **Announce:** turn up the event for the next season (§6.2).
2. **Draw:** fill your hand to 5 cards. Gain energy for the season.
3. **Plan:** play cards face down onto sections. You may **set 1 reaction** face down.
4. **Reveal:** flip all cards at once. They resolve in this order: *Endure* → *Sprout* → *Spread* → *Bloom*. The player who is **behind** on the bars resolves first within each step (comeback lever).
5. **Shading:** if a section is over 10 fields (§7.2).
6. **Event:** the event announced last season resolves. Reactions may respond (§7.3).
7. **Clean up:** discard your hand, but you may **keep 1 card** (a bud).

### 7.1 Coverage bar

For each section: **your shoots vs. the rival's shoots**. Empty fields belong to no one. The bar shows it straight away.

### 7.2 Shading (competition through height)

If more than 10 shoots stand in a section, remove the excess from the shoots of the **lowest height class**, alternating between players. Height is the one measured value that decides competition for light. A tall plant takes space but pays more for it (*Spread* costs the same, but large plants usually have little R).

### 7.3 Reactions and chain (from Yu-Gi-Oh, kept small)

A reaction set face down fires when its condition is met. The opponent may answer with their own reaction. **At most 2 links.** They resolve last in, first out. That is enough for "Ha, the bud bank!" without the rules lawyering.

---

## 8. Ban list, locked species, the citizen science hook

* **Banned:** *Tree of heaven* is on the Union list of invasive species (Regulation (EU) 1143/2014; listed since 2019). It is never a player card. It appears **as an event or a boss**: "Root suckers: every season 2 shoots in a random section, wins every shading".
* **Locked (Field book):** *Dandelion*, *Canadian horseweed* and *Silver moss* do not have a CSR value in our data. They stay locked **until the values come from a source**. This is not a weakness of the game but its hook: "Help measure the dandelion." When values arrive, the conversion table generates the card and nobody balances it by hand.
* **Missing details** (e.g. *Danish scurvygrass*, which has no indicator values) are shown as ? and work neutrally.

---

## 9. Solo mode: the yearly run (Slay the Spire structure)

* **Map:** a neighbourhood (Kiez) as a branching path. Nodes: *crack* (fight against a rival community), *event*, *rain* (remove 1 card or harden 1 card), *custodian* (swap 1 card), *boss*.
* **Acts = seasons of the city:** Act 1 boss *street sweeper* (intent visible each round), Act 2 *heat summer*, Act 3 *winter service*. Final boss: *tree of heaven*.
* **Reward:** after each crack, **choose 1 of 3** cards or skip. Thin decks win; the game says so.
* **Relics = site gifts:** *dog corner* (N +2 in one section), *drainpipe* (F +2), *shady linden* (L −2), *cobble joint* (trampling −1). Each one changes the site profile, so fit is calculated again. Players learn the indicator values without a lecture.
* **Ascension = sealing level:** each level seals 1 more field per section, for real and visibly. Urban soil sealing is the game's difficulty level.

---

## 10. Link to the real Stelle (custody model)

From `Mechanics.md`: Erstsichter, Chronist, Hüter.
* **A real Stelle generates a section:** its profile = **the average indicator values of the species observed there**. This is the standard way to use Ellenberg values, so the field gives a real, honest scenario.
* **Observations give access, never power.** Your observed plant gives the card a field book variant (photo, place, date) and access to a species, but never better numbers. Otherwise people would game the data, and data quality matters more than balance.

---

## 11. Worked example (excerpt)

*Player A: plantain, pearlwort, wall-rue. Player B: purslane, bittercress, celandine.*

**Season 2 (May), energy 4.** Turned face up: *heatwave (3) in July, all sections with L ≥ 8* (A and B).
* A plays *Spread* (plantain → C, wall foot: L7 vs 5 ✗, F5 vs 6 ✓, R6x ✓, N6 vs 7 ✓, S1 vs 0 ✓ → 4 fits → **3 shoots**) and *Endure* (pearlwort → A, 2 hardening against July).
* B plays *Spread* (celandine → C: L6 vs 5 ✓, F5 vs 6 ✓, R7x ✓, N8 vs 7 ✓, S0 ✓ → 5 fits → **3 shoots**) and *Bloom* (bittercress in May ✓, 2 shoots in A → 2 seeds).
* Wall foot: 6 of 10 fields used, no shading. The event this season (street sweeper on A, 3) costs both players 3 shoots in A. A loses only 2 thanks to the plantain rosette.

Everything that happens comes from the cards, can be traced, and is backed by data.

---

## 12. Open questions (for Félix)

1. **One bar or three sections?** Three sections (Marvel Snap) give more decisions and use site profiles. One bar is closer to the old spec and easier on mobile.
2. **Unlock the locked species?** Keep the dandelion locked until there is a CSR source (honest, and a citizen science hook), or allow a second CSR source (e.g. Pierce's global table) with a different label?
3. **How strongly can signature cards act?** The evidence shows that a trait exists, not how strong it is. Is "Game effect: abstraction" on the card enough?
4. **Solo first or PvP first?** Solo (the yearly run) needs no server and no matchmaking, and fits a gift (Dose) better. Recommendation: **solo first**.
5. **Fold in the community engine?** The current `communityEngine.ts` (energy 4, hand 3, six actions) is a direct predecessor. Recommendation: rebuild it on these rules instead of keeping two systems.

---

### Sources for the reference games

* Slay the Spire 2, early access from 05.03.2026, energy 3 per turn, intent icons: [onemoregame.ph](https://onemoregame.ph/2026/02/slay-the-spire-2-early-access-date-march-5/), [Bossrush review](https://bossrush.net/2026/04/slay-the-spire-2-early-access-review/), [sts2.untapped.gg intents](https://sts2.untapped.gg/guides/how-to-read-enemy-intent)
* Marvel Snap: 6 turns, 3 locations, simultaneous reveal: [marvelsnapzone.com](https://marvelsnapzone.com/how-to-play-marvel-snap-for-beginners/), [Shacknews](https://www.shacknews.com/article/132689/how-to-play-marvel-snap)
* Phylo (UBC, open source, study 2019): [UBC Science](https://science.ubc.ca/news/pok%C3%A9mon-card-game-can-help-teach-ecology-ubc-research), [Beaty Museum](https://beatymuseum.ubc.ca/phylo)
* Yu-Gi-Oh!, Inscryption, Pokémon TCG, Wingspan, Balatro: general knowledge of the rules, not checked again on a primary source in this session.

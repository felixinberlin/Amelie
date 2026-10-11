# Fugenduell — Combos and special attacks (brainstorm)

Status: brainstorm, 11.10.2026. **Balance is deliberately ignored** (Félix: "we fix that later"). The goal is *cool*: moments players tell each other about. Nothing here is built.
Every idea still notes its real background, because that's what makes it cool: *this really happens in the crack outside your door*.

Status of the background: ✓ source checked or already in the repo · ⚠ plausible, source still missing · 🎲 pure game fantasy (allowed only for city objects/events, never as plant biology).

Builds on: `design-vision.md` §6 (powers), the older brainstorms `dandelion.md`, `muraria.md`, `crack-flora-master-card-deck.de.md` (skill names), and the source check in `design-vision.md` §13b.

---

## 1. The grammar of a power

Every power has four parts, so players can read it at a glance and plan counters:

```
TRIGGER  →  EFFECT  →  COUNTER  →  REAL BACKGROUND
"when …"     "then …"   "unless …"   "because in nature …"
```

**Charge ring:** a special attack (⚡ *Ultimate*) charges through events that happen to the plant (survived drought, trampled three times …) and fires **once per year**, either automatically (watch mode) or when the player chooses (hand mode). The charge condition *is* the story: the plant has to suffer before it strikes back.

---

## 2. One special attack per plant

### Playable (10)

| Plant | ⚡ Special attack | Charges when … | Effect | Background |
|---|---|---|---|---|
| **Greater plantain** | **Schuhtaxi** (shoe taxi) | 3 months trampled and survived | Its sticky seeds hitch a ride on shoes: 3 seeds land in the **neighbouring place** (lane) and sprout immediately, even into enemy territory | Seeds become sticky when wet and travel on shoes and tyres ⚠ (the "Sohlenfracht" in the old deck; source missing) |
| **Annual meadow grass** | **Saatsturm** (seed storm) | wilted once (0 shoots, seeds left) | The entire seed bank sprouts in one month, no energy needed, as far as space allows | Flowers all year (Pladias ✓), seeds viable ≥ 4 years (RHS ✓) |
| **Hairy bittercress** | **Schotenmörser** (pod mortar) | it loses shoots to an enemy | Counter-fire: for every lost shoot, 1 seed lands **in a field the enemy just vacated**, before the enemy can refill it | Explosive pods (Hofhuis et al. 2016, *Cell* ✓; speed unconfirmed) |
| **Ivy-leaved toadflax** | **Rückwärts-Saat** (reverse sowing) | 2 cleanings survived | Its seeds are pressed *into* the crack: this year's seeds are immune to cleaning and sprout +1 | Fruit stalks bend away from light into crevices ⚠ ("Lichtflucht" in the old deck; source missing) |
| **Wall-rue** | **Scheintod** (playing dead) | lost shoots to drought | Drops to 1 shoot and becomes untouchable for the month; after the next rain month it is **back at full strength** | Desiccation-tolerant fern ⚠ (`muraria.md`: 4–7 % relative water content; source to check) |
| **Common purslane** | **Hitzerausch** (heat rush) | first heat month | For 2 months heat is *food*: every heat point becomes +1 shoot instead of a loss | C4 photosynthesis with facultative CAM ⚠ (only the genus note "fleshy leaves" in the repo) |
| **Greater celandine** | **Ameisen-Express** (ant express) | it blooms | Ants carry 3 seeds into their nest **under the paving**: a hidden seed bank that no cleaning, trampling or frost can touch; sprouts in spring | Elaiosomes, ants carry the seeds away (Servigne & Detrain ✓) |
| **Procumbent pearlwort** | **Polsterbunker** (cushion bunker) | trampled 2 months in a row | Under the feet it *thrives*: for every shoot the trampling takes from the others this month, pearlwort gets +1 | Height 2–5 cm (Pladias ✓); typical of paving joints ⚠ (no source in the repo yet) |
| **Danish scurvygrass** | **Salzstraßen-Sprint** (salt-road sprint) | first salt month | It races along the road: +3 shoots and 2 seeds into the **next place on the same road** | Spread along salted roads at ≈ 62–65 km/year (*Preslia* 2018 ✓) |
| **Butterfly bush** | **Schmetterlingssturm** (butterfly storm) | it blooms (Jul–Aug) | Pollinators swarm: **every flowering plant in the crack** gets +1 seed, *including the enemy's*. Double-edged | Butterfly bush attracts many pollinators ⚠ (well known; source missing; whether neighbours benefit is debated in the literature) |

### Locked (unlock when data arrives): the special attacks are the reward

| Plant | ⚡ Special attack | Effect | Background |
|---|---|---|---|
| **Dandelion** | **Hydra** | Every cleaning that hits it creates **+1 shoot** instead of a loss (cut root pieces sprout again) | Regenerates from root fragments ⚠ (well known; source to check) |
| **Dandelion** | **Pusteblumen-Orkan** (blowball hurricane) | Once a year: 6 seeds to **all other places in the city** | Pappus, wind dispersal (RHS ✓ "seed heads disperse on the wind") |
| **Silver moss** | **Auferstehung** (resurrection) | Never dies of drought; in the first rain month after a drought it comes back with **all** lost shoots | Desiccation tolerance, silvery when dry (BBS ✓ silvery; tolerance ⚠) |
| **Canadian horseweed** | **Glyphosat-Panzer** (glyphosate armour) | Immune to cleaning *by weed killer* (railway places) | Herbicide-resistant populations ⚠ (well documented, source to add) |

### Boss: tree of heaven (never playable, EU invasive list)

| ⚡ | Effect | Background |
|---|---|---|
| **Wurzelbrut** (root suckers) | Every month 2 new shoots in a random place in the city; cleaning makes it *worse* (+1) | Suckers (RHS ✓) |
| **Ailanthon** | Allelopathy: plants next to it sprout −1 | Ailanthone is a known allelochemical ⚠ (source to add) |

---

## 3. Combo hands: named team synergies (Balatro meets botany)

Like poker hands in Balatro: certain **team combinations** are recognised automatically and announced with their name ("**PFLASTER-PANZER!**"). That gives the pick a second layer: *not just the three strongest plants, but the best hand.*

### Two-plant combos

| Combo hand | Team | Effect | Ecology behind it |
|---|---|---|---|
| **Pflaster-Panzer** (paving armour) | plantain + pearlwort | Both flat: in trampling months they claim the fields trampling clears from others, +1 each | Trampling-tolerant plants replace sensitive ones on paths ✓ (rosette, height 1 in the data) |
| **Schirm & Schatten** (umbrella & shade) | tall plant (butterfly bush / celandine) + shade-tolerant ally (toadflax / bittercress) | The tall plant's shading hits **only enemies**; your shade-tolerant ally lives underneath | Shade tolerance (light indicator ✓) |
| **Kinderstube** (nursery) | pearlwort (cushion) + an annual | Seeds of the annual sprouting next to the cushion get +1 shoot | "Nurse plant" effect: cushions shelter seedlings ⚠ (well-known ecological concept; urban crack evidence missing) |
| **Salzwall** (salt wall) | scurvygrass + a salt-tolerant ally (plantain, meadow grass, pearlwort: salt indicator ≥ 1) | Winter salt hits only plants with salt indicator 0, i.e. only the enemy, ×2 | Salt tolerance from Pladias ✓ + road corridors ✓ |
| **Ameisenstraße** (ant road) | celandine + any plant | The ants of the *Ameisen-Express* also carry 1 seed of the ally into the safe nest | Ants carry many seeds, not only elaiosome seeds ⚠ (they retrieved celandine seeds *without* elaiosome too, Servigne & Detrain 2008 ✓) |
| **Mauer-Clan** (wall clan) | wall-rue + toadflax | In a wall joint: both wall bonuses stack, and the clan can't be shaded by non-wall plants | Both are wall dwellers (RHS ✓) |

### Three-plant combos (the "royal flush" of the crack)

| Combo hand | Team | Effect | Ecology behind it |
|---|---|---|---|
| **Staffellauf** (relay race) | bittercress (spring) + purslane (summer) + meadow grass (all year) | As long as *some* plant of the team blooms each month, the team gets +1 energy (light is never wasted) | Temporal niche partitioning: different flowering times ✓ (Pladias flowering months) |
| **Sukzessionskette** (succession chain) | an annual + a perennial herb + a shrub | When an annual fruits and dies, it leaves humus: the perennial sprouts +1 next month; when the perennial is cleaned, the shrub gets +1 | Primary succession in cracks: annuals → perennials → woody plants ⚠ (Sukopp/Kowarik, to check); crack soils get richer in organic carbon ✓ (Manu et al.) |
| **Wildnis-Trio** (wilderness trio) | butterfly bush + celandine + toadflax | *Schmetterlingssturm* + *Ameisen-Express* in the same summer: the seeds land directly in the ant nest | 🎲 the combination is fantasy, both parts are ⚠/✓ individually |
| **Hitzewelle-Gang** (heatwave gang) | purslane + butterfly bush + toadflax (all T ≥ 7) | In a warm month the whole team counts as one heat fighter: losses go to whoever has the most hardening | Warm-loving plants (temperature indicator ✓) |

---

## 4. Chain reactions with weather and the city

These are combos between plants, the **real weather year** and **city objects**: the moments you only get *because the weather is real*.

| Chain | What happens | Why it's cool |
|---|---|---|
| **Monsunbombe** (monsoon bomb) | A rain month right after a drought month: **every seed bank** in the crack sprouts +1 per seed (max. 3). Teams that saved seeds during the drought explode | Real: rain triggers germination after drought ✓ (general seed ecology). In Berlin 2025 it really happens: August drought → September rain month |
| **Hydra im Herbst** | Dandelion + cleaning month + rain | *Hydra* + rain: every cut root piece sprouts twice. The city crew makes it worse every time |
| **Hundewiesen-Rausch** (dog meadow rush) | 🐕 Dog corner (N +2) + nitrogen lovers (celandine N8, meadow grass N8) | Fit jumps to the maximum, Spread +1. The dirty corner becomes a power spot |
| **Festival-Fallout** | 🎪 Street festival (trampling ×3) + *Pflaster-Panzer* | The festival wipes out everything upright; the flat duo takes over the whole crack overnight |
| **Kreidekreis-Konter** (chalk circle counter) | 🖍 Chalk hopscotch (3 months no trampling) against *Pflaster-Panzer* | The children's game takes away the trampling advantage: upright plants fight back. City life as a counter-card |
| **Bauzaun-Zeitkapsel** (construction-fence time capsule) | 🚧 Construction fence (4 months untouched) + shrub | Behind the fence the butterfly bush grows unchecked; when the fence comes down, there's a shrub where the crack was |
| **Salz-Lawine** (salt avalanche) | Cold month + 🧂 grit bin + *Salzwall* | The whole winter becomes a salt weapon; scurvygrass sprints along the road (*Salzstraßen-Sprint*) |
| **Odaiba-Gischt** (sea spray) | Odaiba's year-round salt spray + scurvygrass | The only place where scurvygrass is at home all year: a "home level" for the coastal plant |

---

## 5. Counters: every combo has an answer

Without counters, combos become a solved pick. Every strong hand needs at least one natural enemy:

| Combo | Countered by | Why |
|---|---|---|
| Pflaster-Panzer | 🖍 chalk circle, 🚧 construction fence | No trampling, no advantage |
| Schirm & Schatten | cleaning months (the tall plant is cut) | City crews remove what stands out |
| Saatsturm / seed-bank teams | 🐦 **pigeon flock** (city event: seed banks −⅓) | Birds eat seeds ⚠ (granivory, general ecology) |
| Salzwall | a rainy winter (salt is washed out: salt events halved) | Rain leaches road salt ✓ (Dutch study: scurvygrass thrives in central reservations *because* rain doesn't wash the salt out there) |
| Ameisen-Express | ☔ **flooded ant nest** (heavy rain month: hidden seeds sprout too early, before the frost) | 🎲 timing risk |
| Hitzewelle-Gang | a cool, wet year (Berlin instead of Madrid) | The real weather year is the counter: *choose your city wisely* |
| Wurzelbrut (boss) | only *competition*: a full crack gives the suckers no space | Invasive plants exploit open ground ⚠ |

---

## 6. Making it feel good (presentation)

- **Combo hands are announced** in big letters when the team is picked ("PFLASTER-PANZER erkannt!") and again when they fire.
- **Charge rings** on each plant card; when full, the card glows. In hand mode the player chooses the moment, in watch mode the AI fires it.
- **The background line** appears after the attack: *"Really true: bittercress pods shoot seeds explosively (Hofhuis et al. 2016)."* The game teaches through wow moments.
- **Replay highlight:** at the end of the year, the three biggest moments are shown again ("August: Schotenmörser hits 4 freed fields").
- **Combo collection:** discovered combo hands go into a book (like a Pokédex), with the real ecology behind each one.

---

## 7. Proposed first prototype (5 pieces)

Chosen because the background is ✓ and they show five different kinds of power:

1. **Ameisen-Express** (celandine): hidden seed bank. Background ✓.
2. **Schotenmörser** (bittercress): counter-attack into freed fields. Background ✓.
3. **Salzstraßen-Sprint** (scurvygrass) + combo **Salzwall**: road corridor. Background ✓.
4. **Pflaster-Panzer** (plantain + pearlwort): first combo hand. Background ✓.
5. **Monsunbombe** (rain after drought): first chain reaction with the real weather.

## 8. Questions for Félix

1. Combo hands **automatic** (recognised at the pick, like Balatro) or **cards** you have to draw and play?
2. Special attacks once per year, or recharge (stronger rhythm, more chaos)?
3. May the *Schmetterlingssturm* help the enemy too? (Double-edged attacks create great decisions.)
4. Which 5 do you want to see first, or do you have favourites from this list?

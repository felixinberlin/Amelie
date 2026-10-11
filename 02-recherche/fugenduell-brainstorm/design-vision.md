# Fugenduell — Design vision v1 (for all agents)

Status: 11.10.2026. Shared thinking document for every agent working on Fugenduell (Claude Code, Antigravity, Lab agents) and for Félix. **Read this before changing rules.** Proposals marked *proposal* are not built yet. Everything marked *built* exists in code with tests.

Félix's brief: *fun, fun, fun, deep strategic content, cool extra powers and power-ups, and plants that evolve: a plant that won a fight is bigger next year, has more seeds or deeper roots.*

---

## 0. How to work on this (agents)

1. **Read first:** this file → `wetterjahr-modus.md` → `regelwerk-v0.1.md` → `testspiel-2026-10-11.md`. Code: `src/engine/fugenduell/watchMode.ts`, `weatherYear.ts`, `src/data/fugenduellPlaces.ts`.
2. **One idea, one PR.** Branch `claude/…`, `antigravity/…` or `lab/…`. The other agents review it.
3. **The referee is a measurement, not an opinion.** Every rule change runs the round robin (all 120 teams × 6 places × Berlin/Madrid) and reports the balance metrics in §10. A rule that "feels cool" but breaks the metrics doesn't merge.
4. **Honesty rule** (§11): every number on a plant comes from a source, or is labelled as game design. Missing data is neutral, never zero, never a weakness.
5. **Play-test with agents:** two agents pick blind from the same brief (protocol in §12) and the referee posts the report.

---

## 1. Where we are (built)

| Layer | Built | Where |
|---|---|---|
| Real weather year | NASA POWER daily values → 12 month cards (March → February). Which months are rain, warm, heat, drought or cold is **relative to the city**; how hard they hit is **measured** | `weatherYear.ts` |
| Plants from data | 10 playable species. C/S/R points (Pierce) → a cycle of 10 cards; height, flowering window, life form, indicator values; dandelion, horseweed and silver moss **locked** (no CSR data); tree of heaven **banned** | `watchMode.ts` |
| Places in the city | Pavement crack, cobbles, wall joint, tree pit, kerb, wasteland: space, trampling, cleaning, microclimate, salt (labelled assumptions) | `fugenduellPlaces.ts` |
| **HP** (watch-v2) | Max HP = most shoots a plant can hold: life form (annual 12 / perennial herb 16 / woody 20) + bud bank (UNDERPLOT; ≥ 10 buds +2, ≥ 20 +4; unknown +0) | `plantMaxHp` |
| **Resistances** (watch-v2) | 🔥 heat 1 (T ≥ 7) · 🏜 drought 1/2 (F ≤ 4 / ≤ 3) · ❄ frost 1 (hemicryptophyte: buds at the soil surface) · 🧂 salt (S ≥ 1 immune, S = 0 hit, unknown = no damage) · 👣 trampling (height 1 or rosette) · 🌳 shade (L ≤ 6: shaded last) · 🌱 regrowth (bud bank ≥ 10: +1 shoot after cleaning) | `plantResistances` |
| **Death** (watch-v2) | **alive** (shoots > 0) → **wilted** 🥀 (0 shoots, seeds in the soil, can sprout again) → **died out** ☠ (no shoots, no seeds; final for the year). Annuals fruit and die after their last flowering month: shoots → seeds | `runWatch` |
| Watch view | City, year 1981–2025, place, two teams; month cards, HP bars, resistances, death badges, each month's math | `FugenduellWeatherWatch.tsx` |
| Tests | 52 engine tests: mirror matches are draws, capacity, HP cap, death is final | `weatherYear.test.ts` |

### What the tests and the round robin taught us

1. **Without costs, every resistance is a free buff.** After watch-v2, *ivy-leaved toadflax* (heat 1, drought 1, frost 1, shade, regrowth, HP 18) is in the top 10 of 11 out of 12 place/city settings. Nature charges for stress tolerance (Grime: stress-tolerators grow slowly). The game has to charge too (§6.1).
2. **The shade rule helps shade-tolerant plants and hurts light-demanding small ones.** Plantain, meadow grass and pearlwort scored only 30 shoot-months in Berlin's pavement crack against celandine and toadflax. Ecologically plausible, but in play it's a *lockout*.
3. **Full information → solved picks.** Two agents picked identical teams in 3 of 4 games.
4. **Shoot-month scoring creates garbage time.** By August the result is usually fixed.
5. **The place really matters** (the strongest finding). Different places produce different winners. That's the core of the strategy and must stay.

### 1b. Six cities, 24 named places: balance measurement (watch-v2, 11.10.2026)

Featured cities with four famous places each (`src/data/fugenduellCities.ts`): **Berlin** (Wall at Bernauer Straße, tram tracks on Kastanienallee, Tempelhofer Feld, Südgelände), **Frankfurt am Main** (Römerberg, Main quay wall, track field at the Hauptbahnhof, tree pits on the Zeil), **Madrid** (Plaza Mayor, Muralla árabe, Madrid Río, kerb of the Castellana), **Tokyo** (Shibuya Crossing, Edo Castle walls, Odaiba seafront with year-round salt spray, Yamanote line ballast), **Shanghai** (the Bund, Yu Garden, Tianzifang lanes, plane-tree pits on Wukang Road), **Ciudad de México** (Zócalo, Xochimilco chinampas, Paseo de la Reforma, Pedregal lava field). Real 2025/26 weather for all six cities is bundled offline. Place values are labelled scenario assumptions, and each place lists the facts still to verify.

Round robin of all 120 teams against each other at every place (345,600 games): best team, its win rate, and how many of the 10 best teams contain each species.

| City | Place | Best team | Win rate | Species in the 10 best teams |
|---|---|---|---|---|
| Berlin | Berlin Wall (Bernauer Straße) | Bittercr + Celandine + ButterflyB | 98% | ButterflyB 10, Celandine 8, Toadflax 3, Bittercr 2 |
| Berlin | Tram tracks, Kastanienallee | Toadflax + Celandine + ButterflyB | 99% | Celandine 10, Toadflax 7, ButterflyB 4, Bittercr 2 |
| Berlin | Runway, Tempelhofer Feld | Toadflax + Celandine + ButterflyB | 99% | Toadflax 10, ButterflyB 8, Celandine 3, MeadowGr 2 |
| Berlin | Südgelände nature park (old rail yard) | Toadflax + Celandine + ButterflyB | 99% | Celandine 8, Toadflax 7, ButterflyB 6, Bittercr 3 |
| Frankfurt am Main | Cobbles of the Römerberg | Plantain + Toadflax + ButterflyB | 98% | Toadflax 10, Plantain 7, ButterflyB 4, MeadowGr 2 |
| Frankfurt am Main | Main river quay wall | Bittercr + Celandine + ButterflyB | 98% | ButterflyB 10, Celandine 8, Toadflax 3, Bittercr 2 |
| Frankfurt am Main | Track field, Hauptbahnhof | MeadowGr + Toadflax + Celandine | 99% | Toadflax 8, MeadowGr 6, Celandine 6, WallRue 4 |
| Frankfurt am Main | Tree pits on the Zeil | Toadflax + Celandine + ButterflyB | 99% | Celandine 10, Toadflax 8, Bittercr 3, ButterflyB 2 |
| Madrid | Cobbles of the Plaza Mayor | Plantain + MeadowGr + Toadflax | 99% | Toadflax 10, Plantain 6, MeadowGr 4, WallRue 3 |
| Madrid | Arab city wall | MeadowGr + Celandine + ButterflyB | 96% | ButterflyB 10, Celandine 8, Bittercr 3, MeadowGr 2 |
| Madrid | Madrid Río riverside path | Plantain + Celandine + ButterflyB | 99% | Celandine 10, ButterflyB 6, Toadflax 5, Plantain 2 |
| Madrid | Kerb of the Castellana | Toadflax + Celandine + Scurvygr | 99% | Toadflax 10, Celandine 5, Plantain 4, Bittercr 4 |
| Tokyo · 東京 | Shibuya Crossing | Bittercr + Toadflax + Celandine | 99% | Toadflax 10, Bittercr 7, Celandine 4, Plantain 2 |
| Tokyo · 東京 | Edo Castle stone walls | Bittercr + Celandine + ButterflyB | 98% | Celandine 9, ButterflyB 9, Bittercr 3, Toadflax 3 |
| Tokyo · 東京 | Odaiba seafront | Plantain + Toadflax + ButterflyB | 98% | Toadflax 9, ButterflyB 6, MeadowGr 5, Plantain 3 |
| Tokyo · 東京 | Yamanote line ballast | Bittercr + Toadflax + Celandine | 99% | Toadflax 10, Celandine 7, WallRue 3, Plantain 3 |
| Shanghai · 上海 | The Bund promenade | Plantain + MeadowGr + Toadflax | 98% | Plantain 9, Toadflax 8, MeadowGr 4, Scurvygr 3 |
| Shanghai · 上海 | Walls and rocks of the Yu Garden | Toadflax + Celandine + ButterflyB | 99% | Celandine 10, ButterflyB 8, Toadflax 3, Bittercr 2 |
| Shanghai · 上海 | Shikumen lanes of Tianzifang | Bittercr + Toadflax + Celandine | 99% | Toadflax 8, Celandine 8, Plantain 4, Bittercr 3 |
| Shanghai · 上海 | Plane-tree pits, Wukang Road | Bittercr + Celandine + ButterflyB | 98% | Celandine 10, Toadflax 8, Bittercr 3, ButterflyB 2 |
| Ciudad de México | Paving of the Zócalo | Plantain + Toadflax + WallRue | 99% | Plantain 9, Toadflax 9, WallRue 3, Pearlwort 3 |
| Ciudad de México | Canal edges of the Xochimilco chinampas | Toadflax + Celandine + ButterflyB | 99% | Celandine 9, ButterflyB 9, Toadflax 3, Bittercr 3 |
| Ciudad de México | Tree pits on the Paseo de la Reforma | Bittercr + Toadflax + Celandine | 99% | Celandine 10, Toadflax 8, Bittercr 3, MeadowGr 2 |
| Ciudad de México | Pedregal lava field (UNAM) | Toadflax + Celandine + ButterflyB | 99% | Celandine 9, ButterflyB 9, Toadflax 3, Bittercr 3 |

- IN BEST TEAM (of 24 places): Celandine 19, Toadflax 18, ButterflyB 15, Bittercr 8, Plantain 6, MeadowGr 4, Scurvygr 1, WallRue 1
- STRONG (>=5 of top-10 teams) at N places: Celandine 17, Toadflax 17, ButterflyB 11, Plantain 4, MeadowGr 2, Bittercr 1

**Reading:** the places *do* change the winner (plantain on the cobbles of the Römerberg, Plaza Mayor, the Bund and the Zócalo; butterfly bush on every wall; wall-rue at the Zócalo; Danish scurvygrass on the Castellana kerb). But **greater celandine and ivy-leaved toadflax are strong almost everywhere** (17 of 24 places each), and the best team wins 96–99 % of its matches. Purslane and procumbent pearlwort never make a best team. Causes: celandine combines HP 20 (bud bank 20), height 3 (rarely shaded), shade tolerance, regrowth and 5 Spread cards; toadflax collects five free resistances plus the wall bonus. → Phase 1 of the roadmap (§6.1 Grime tax, §9 scoring, §10 balance gate) is now the most important next step; the target is no species strong at more than 2/3 of the places.

---

## 2. The design problem in one sentence

**The data makes the game honest; it doesn't make it fun.** Fun comes from *decisions with consequences*, *drama until the last month*, *characters you love*, and *growth you can feel*. Every proposal below adds one of these four, without inventing biology.

## 3. Six pillars

| # | Pillar | Test question for every rule |
|---|---|---|
| P1 | **A real decision every month** | Can a good player do clearly better than a bad one in *this* month? |
| P2 | **Drama to the last month** | Can the player who's behind in August still win? |
| P3 | **Plants with character** | Can you describe each plant's play style in one sentence? |
| P4 | **Growth across years** | Do I want to play next year *with this lineage*? |
| P5 | **The real city is the board** | Does choosing a place/city/year change my plan? |
| P6 | **Honesty is a feature** | Can every number be traced to a source or a labelled rule? |

---

## 4. Three time scales (the core architecture)

```
  MONTH  (tactics)    play cards, react to the forecast            ~30 s
    ↓ ×12
  YEAR   (match)      one city, one place, one year of real weather  ~10 min
    ↓ ×N
  LINEAGE (campaign)  real successive years, plants carry over,    an evening / a season
                      adapt and evolve
```

Most of today's code is the *year*. *Month* (decisions) and *lineage* (evolution) are the two missing scales, and they're where the fun is.

---

## 5. MONTH: decisions every turn (*proposal*, from `regelwerk-v0.1.md` §7)

- **Hand of cards:** your 3 species' cards form one deck (36: 30 strategy + 3 Bloom + 3 signature). Draw to 5, spend the month's energy (day length), keep 1 card as a "bud".
- **Choose card *and* target plant.** The deck is the plant's measured character (8 Spread cards for plantain); the *timing* is yours.
- **Forecast:** next month's card is face up (like enemy intents in Slay the Spire): "drought 4 next month → harden *now*".
- **Simultaneous, hidden play** (Marvel Snap); the player behind resolves first (comeback lever).
- **One reaction face down** (Yu-Gi-Oh trap, at most 2 links): e.g. *bud bank: when your shoots are removed, put 1 back*.
- **Watch mode stays** as the "auto-play" of the same engine: the card cycle is simply the default AI. The two modes share one engine.

---

## 6. POWERS: three tiers

### 6.1 Resistances need a price: the Grime tax (*proposal*, fixes the toadflax problem)

Ecology: stress tolerance costs growth (Grime's C–S–R trade-off). So in the game:

> **Each resistance point that actually blocks damage this month costs 1 energy next month** ("the plant spent its reserves surviving").

- Toadflax still survives the wall-joint drought, but grows slower afterwards: a visible, fair trade.
- Resistances that never fire cost nothing, so "resistant but slow" becomes a choice, not a free buff.
- Alternative (simpler): a budget where active resistances ≤ S points ÷ 2. Rejected for now: it would silence real data (toadflax *is* drought-tolerant, Pladias F4).
- **Must be measured:** after the change, no species in the top 10 of more than 8 of 12 settings.

### 6.2 Signature powers: a character for each plant (*proposal*)

Format: **trait (source) → power (game abstraction) → charge condition**. Status ✓ = trait sourced in the repo; ⚠ = trait plausible, source missing (not playable until sourced).

| Plant | Trait (source) | Power (*Ultimate*, 1× per year when charged) | Charge | Status |
|---|---|---|---|---|
| Greater plantain | Low leaf rosette; tolerates compacted soil (RHS) | **Footprint:** when trampling removes ≥ 3 opposing shoots in one month, plantain immediately takes 2 of the freed fields | 3 trampling months survived | ✓ |
| Annual meadow grass | Seeds viable ≥ 4 years (RHS); flowers all year (Pladias) | **Seed rain:** after a month in which it lost all its shoots, it sprouts 3 seeds at no energy cost | wilts once | ✓ |
| Hairy bittercress | Ripe pods eject seeds (RHS); several generations per season (RHS) | **Catapult:** when it fruits and dies, 2 seeds sprout immediately in empty fields; with no empty field, they go into the seed bank | automatic at end of cycle | ✓ |
| Ivy-leaved toadflax | Stems root as they spread; paving cracks and walls (RHS) | **Creeper:** Spread works even after cleaning removed all shoots (stems root again) | 2 cleanings survived | ✓ |
| Wall-rue | Rock and wall crevices (RHS); moisture indicator 3 (Pladias) | **Crevice hold:** in the wall joint it can only be shaded by other wall dwellers | passive | ✓ |
| Common purslane | *Genus:* slightly succulent, fleshy leaves (RHS, genus level) | **Water store:** the first drought of the year costs 0 | first drought month | ⚠ genus level only |
| Greater celandine | Orange sap, skin irritant (RHS) | **Irritant sap:** cleaning removes 1 shoot less ("nobody weeds it by hand") | passive | ⚠ effect plausible, source for behaviour missing |
| Procumbent pearlwort | Height 2–5 cm (Pladias), perennial (WFO) | **Cushion:** immune to shading for 1 month after a trampling month (it's under the feet, not under the leaves) | after trampling | ✓ trait, ⚠ effect |
| Danish scurvygrass | Coastal native range (POWO) | none yet: the data audit says coastal range ≠ salt glands | — | ✗ needs source |
| Butterfly bush | Fast-growing deciduous shrub (RHS); drought resistance (RHS) | **Wall crown:** +2 crack capacity *for everyone* per year it survives (roots open the joint) | survives a year | ⚠ masonry damage needs source |

Powers are **once per year** and shown with a charge ring. They create highlight moments ("Footprint! Plantain takes the field after the festival crowd") without permanent snowballing.

### 6.3 Power-ups: Kiez objects and city events (*proposal*)

Not plant biology but **city life**, labelled as scenario objects. They change the place's profile (L/F/R/N/S, trampling, space), so the existing fit rules do the rest. They're drafted as rewards (solo) or placed alternately (duel).

| Kiez object | Effect (game design) | Who benefits (via existing data) |
|---|---|---|
| 🖍 Chalk hopscotch | 3 months: trampling 0 in this place | upright plants (meadow grass, celandine) |
| 🐕 Dog corner | N +2 (nutrients) | N-lovers (meadow grass N8, celandine N8) |
| 💧 Leaky drainpipe | F +2, drought −1 | moisture plants (meadow grass F6, pearlwort F6) |
| 🍺 Flattened can | 2 fields L −3 (shade), F +1 | shade-tolerant plants (🌳) |
| 🧂 Grit bin | Salt in every cold month, +1 | salt-tolerant (🧂✓) |
| 🚧 Construction fence | 4 months: no trampling, no cleaning | everything slow (S strategists, the bush) |
| 🍂 Autumn leaves | Oct–Nov: L −2, N +1 | celandine, toadflax |
| 🎪 Street festival | 1 month: trampling ×3 | flat plants (👣✓) |

**City events** (one per year, drawn): *street festival*, *sewer works* (crack halved for 2 months), *new tree planted* (place becomes partly a tree pit), *weed killer ban* (no cleaning). **Never invented weather**: weather is always the real year.

### 6.4 Named places: Berlin isn't just "Berlin" (*proposal*, from Félix)

A city isn't one board but a map of stories: *a historic plant growing in the Berlin Wall itself*, or *a posh little plant in the tram tracks on Kastanienallee*. So:

**Named place = place type + 1–2 local quirks + story card + home advantage from real records.** The weather stays the city's real year (one NASA grid cell); the named place changes everything else.

| Named place (Berlin) | Base type | Local quirks (scenario, labelled) | Story / why it's fun | Facts to verify |
|---|---|---|---|---|
| **The Wall itself** (memorial strip, Bernauer Straße) | wall joint | No trampling (memorial), but **heritage care**: woody shoots removed once a year; old concrete, lime → R high | "Plants that grew where nothing was allowed to grow": the oldest lineage in the game. **Heritage bonus:** a lineage that survives here 3 years becomes a *Wall ecotype* | Wall segments and memorial at Bernauer Str.; care regime |
| **Tram tracks, Kastanienallee** (Prenzlauer Berg) | paving between rails | Tram every few minutes (wind, vibration: **trampling 1** even without feet), track cleaning, café terraces = **weekend crowd** (trampling ×2 on 1 month), spilled latte = N +1 | The posh street-crack plant: flat, fast, survives brunch crowds. Flat plants (👣✓) rule | Tram route on Kastanienallee; track care |
| **Runway cracks, Tempelhofer Feld** | wasteland | Huge space, wind, **heat +1** (open concrete), no cleaning, kite-flyers and skaters (trampling 1 on the paths) | Open-field battles; the bush grows unchecked → the place for big lineages | Concrete surfaces, park rules |
| **Old railway yard, Südgelände** (Schöneberg) | gravel | Rails and ballast, **succession**: every year +1 space for woody plants (the nature park lets it grow wild) | The famous urban wilderness: watch an annual pioneer lose to woody plants over the years (campaign!) | Nature park on the former marshalling yard |
| **Linden on Unter den Linden** | tree pit | Tourist feet, tree shade, municipal mowing | Where shade-tolerant plants (🌳) shine | Street trees, care |

The same works in every city: *Madrid → cracks of the Plaza Mayor, roadside of the M-30, wall of the Muralla árabe*; *Sevilla → orange-tree pits*.

**Home advantage from real records (honest, *proposal*):** for a named place with coordinates, the game queries open biodiversity records (GBIF / iNaturalist, open APIs) within ~500 m. **A species actually recorded there gets +1 fit** ("it's already at home here") and the card shows the record ("observed 2023 by …"). Missing records are neutral. That makes every place feel real and invites players to **go there and record the plant themselves**: an observation adds the species to the place's local flora (that's the Chronist/custody idea in `Mechanics.md`, now with a purpose). Licences of the individual records have to be respected (CC0 / CC BY / CC BY-NC differ).

**Map of places = level select:** a city becomes a map with 5–10 named places, each with its own best plants. Over a campaign, your lineages "spread" to neighbouring places (seed rain), and the map shows which Kiez your lineage holds.

---

## 7. EVOLUTION: plants that grow and adapt across years (*proposal*)

Félix's question: *does a plant that won get bigger next year, with more seeds or deeper roots?* Yes, and in the right way, it's even biologically honest, because there are **two real mechanisms**:

### 7.1 Growth (individuals): establishment

Perennial plants really do get bigger year by year: the root system and the bud bank grow, and next spring starts from more reserves. Annuals carry over only what they left in the seed bank.

**Carry-over between years** (game rules, labelled):
- **Perennials:** start next year with **½ of their February shoots** (winter loss) + **+1 max HP per year survived** (establishment, at most +4).
- **Annuals:** the seed bank carries over; **⅓ of the seeds decay** each winter, except species with a long-lived seed bank (meadow grass, RHS ≥ 4 years).
- **Woody plants:** keep all their shoots unless cleaned (a bush that survives two years becomes a real problem for the others).

→ **"A winner is bigger next year" emerges by itself:** winning = more ground = more seeds and more established shoots. No arbitrary prize needed.

### 7.2 Adaptation (populations): urban evolution is real and fast

Documented examples to verify against the primary sources (leads):
- *Crepis sancta* on sidewalk tree-pit patches in **Montpellier**: urban populations produce more non-dispersing seeds; dispersing seeds had a 55 % lower chance of settling in their patch; the model suggests ≈ 5–12 generations of selection (Cheptou et al. 2008, PNAS 105: 3796–3799; abstract checked 11.10.2026). Exactly our setting: plants in small urban patches.
- White clover adapts to cities worldwide (Global Urban Evolution Project, Santangelo et al. 2022, Science).
- Overview: Johnson & Munshi-South 2017, Science, "Evolution of life in urban environments".
- *Conyza/Erigeron canadensis*: glyphosate-resistant populations (since about 2000; horseweed is in our roster, locked).
- *Plantago major*: trampling-tolerant prostrate forms on paths (ecotypes; source to verify).

**Adaptation draft** (Slay the Spire card reward, *proposal*): after each year, every species that **bloomed at least once** (no seeds, no evolution) chooses **1 of 3 adaptations**. The options are drawn **from what hurt it most this year** (selection pressure: heat damage → heat adaptations offered). **Every adaptation has a trade-off**: evolution never gives anything for free, and that's the strategic depth:

| Adaptation | Gain | Cost (trade-off) | Real model |
|---|---|---|---|
| **Heavier seeds** | Sprout +1 shoot | Bloom −1 seed | *Crepis sancta* (Cheptou 2008) |
| **Prostrate growth** | 👣 trampling immune | height class −1 (loses in shading) | trampling ecotypes |
| **Early flowering** | flowering window starts 1 month earlier | ends 1 month earlier | urban heat islands → earlier phenology |
| **Heat hardiness** | 🔥 +1 | max HP −2 | stress tolerance costs growth (Grime) |
| **Deep roots** | 🏜 +1 | Spread costs +1 in the first month of the year | root investment |
| **Salt tolerance** | 🧂 ✓ | −1 shoot in rain months | roadside populations (to verify) |
| **Herbicide resistance** | cleaning removes 1 less | max HP −1 | glyphosate-resistant horseweed |
| **Dense cushion** | 🌳 shaded last | Spread +1 cost | — |

**Anti-snowball** (as in nature):
- **Losers draft first, and from 4 options instead of 3** (stronger selection pressure → faster adaptation). Winners grow; losers adapt.
- **Density pressure:** the species with the most shoots attracts a *pest/herbivore event* next year (negative density dependence, Janzen–Connell). It keeps monocultures in check.

### 7.3 The lineage: your plant's family tree (*proposal*)

- A **campaign = real successive years in one city**, e.g. **Berlin 2016 → 2025**, including the 2018 drought summer. You *live through* history with your lineage.
- Each species becomes a **lineage card**: name ("Berliner Gehweg-Breitwegerich, line 2016"), years survived, adaptations, best year. That's the *Stammbaum* from `economy.txt`, now with real content.
- After 3+ adaptations a lineage becomes a named **ecotype**: collectible, shareable, and playable in other cities ("my Madrid-hardened purslane against your Berlin plantain").
- **The honest twist for learning:** at the end, the game shows which of your adaptations really exist in nature and links the paper. The game becomes a door into urban evolution research.

---

## 8. Where the strategic depth comes from (checklist)

1. **Pick:** place × city × year × opponent (counter-picks, blind).
2. **Month:** hand management, forecast planning, tempo (Spread now) vs resilience (harden for August).
3. **Year:** seed-bank timing (bloom before drought), overwintering, when to fire the *Ultimate*.
4. **Lineage:** which adaptation, with which trade-off, for which future city or year.
5. **Hidden information:** blind picks, private hands, "surprise year" (city known, year hidden until the end).
6. **Asymmetry:** each plant plays differently (powers + C/S/R deck).

## 9. Scoring: kill the garbage time (*proposal, to test*)

Today: shoot-months over the year (early lead decides). Options, measured by **"lead changes after August"** in the round robin:
- **A. Overwintering score:** February shoots + 2 × viable seeds. Annuals finally have a win condition.
- **B. Monthly majority** (Marvel Snap): each month, the player with more shoots *in a lane* wins that lane-month; the most lane-months wins.
- **C. Hybrid:** monthly majority + overwintering bonus.
Recommendation: test A and C first.

## 10. Balance governance (CI gate, *proposal*)

The round robin (120 teams × 6 places × 2 cities) runs on every rule PR and reports:
- No species in the top 10 of more than **8 of 12** settings (today toadflax: 11 ✗).
- Mirror matches always draw ✓ (tested).
- Every place has a different best team in at least one city.
- At least **30 %** of matches change the leader after August (to be measured).
- No species without a win in any of the 12 settings (today: purslane and pearlwort, to be measured).

## 11. Honesty rules for powers and items

- Every plant power shows: **trait + source**, **effect = game abstraction**, **strength = game value**.
- Status ✓ (sourced) / ⚠ (plausible, source missing: not in ranked play) / ✗ (contradicts data: not allowed). Example ✗: "wall-rue immune to salt", because Pladias gives salt indicator 0.
- Kiez objects and city events are labelled *scenario*; they never pretend to be biology.
- Locked species (dandelion, horseweed, silver moss) unlock **when data arrives**: a citizen-science hook, not a balance decision.

## 12. Agents playing together (*proposal*)

- `npm run fugenduell -- brief --city … --year … --place …` → identical brief for every player.
- Blind picks via commit → reveal: first `sha256(picks + salt)`, then the picks. The files go in `fugenduell-matches/<match>/`.
- `npm run fugenduell -- play <match>` → referee report (month table, deaths, powers fired).
- Month-hand mode: agents answer each month in a live run (same command), not over PRs (too slow).

## 13. Roadmap

| Phase | Content | Measure of success |
|---|---|---|
| 1 | Grime tax (§6.1) + scoring A/C (§9) + balance gate (§10) | Toadflax ≤ 8/12; lead changes ≥ 30 % |
| 2 | Month-hand mode (§5) + match CLI (§12) | Agent duels; a good player beats the cycle AI ≥ 70 % |
| 3 | Signature powers ✓ (§6.2) + Kiez objects (§6.3) | Every plant described in one sentence by playtesters |
| 4 | Lineage campaign (§7): carry-over, adaptation draft, Berlin 2016–2025 | "One more year" feeling; losers catch up |
| 5 | Named places with home advantage from GBIF/iNaturalist (§6.4), lanes in one crack, Ultimate animations, ecotype cards | Players visit a real place to record a plant |

## 13b. Source check of Félix's research comment (11.10.2026)

The PR comment "Real Science for Roguelite Mechanics" cites eight studies. Checked against abstracts and primary listings (not full texts):

| Claim | Status | What holds |
|---|---|---|
| Urban crevice soils, SOC up to +436 % (Manu et al.) | ✓ exists, **misread** | Nashville (USA), *Int. J. Sust. Dev. World Ecol.* 32(6). 436 % is the **maximum**; crevice soils were also **warmer, more alkaline, more conductive and drier** than roadside soils. → A "moss sponge absorbs drought" level contradicts the study; a crack that gets **richer (N +1) but not wetter** over the years fits it |
| *Crepis sancta* rapid evolution (Cheptou 2008) | ✓ | Montpellier, 5–12 generations (abstract); the "99 % mortality" figure is not in the abstract |
| *Cardamine hirsuta* explosive pods (Hofhuis 2016, *Cell* 166: 222–233) | ✓ paper | Mechanism confirmed (turgid fruit, asymmetric lignin in endocarp b); **10 m/s not confirmed** in the abstract |
| *Cochlearia danica* spreading along salted roads | ✓ phenomenon | Confirmed by *Preslia* 2018 (8 continental countries, ≈ 62–65 km/year) and *Gorteria* 1996 (Dutch motorways, central reservations). "Scott & Davison 1985" **not found**. → Scurvygrass can get **salt resistance ✓** with the Preslia source: this closes its data gap |
| *Chelidonium majus* seeds carried by ants (elaiosomes) | ✓ | Elaiosomes documented; ants retrieve them (Servigne & Detrain 2008/2010, *Myrmica rubra*). "Gorb & Gorb 2003" is a book, not a celandine study; *Lasius niger* in pavement not confirmed. → "Ant bread: seeds hidden from cleaning" can be ✓ trait, game effect labelled |
| Root growth pressure 0.5–1.5 MPa (Misra et al. 1986) | ✗ overstated | Measured ≈ 0.24–0.50 MPa axial, in **pea, cotton and sunflower**, not dandelion. "10-bar dandelion" stays without a source (and dandelion is locked) |
| *Bryum argenteum* hyaline hair points, desiccation tolerance | not checked | Silver moss is locked (no CSR data) |
| Succession stages (Sukopp, Kowarik) | not checked | Plausible; check the primary texts before using them as level rules |

**Consequence for the design:** the **3-year succession campaign** (the crack itself develops: fresh crack → humus crack → widened crack) fits §7, with two corrections: humus brings nutrients, not water (Manu et al.); widening comes from woody roots and frost, not from "10 bar dandelion pressure". Perks are allowed only with a ✓ source (§11).

## 14. Open questions for Félix

1. Grime tax (energy) or resistance budget (§6.1)?
2. Scoring A, B or C (§9)?
3. Evolution: should lineages be shareable across players and cities (§7.3), or stay in one campaign?
4. Are ⚠ powers allowed in casual play (labelled), or only ✓ powers everywhere?
5. Which campaign city first: Berlin 2016–2025 (with the 2018 drought) or Madrid?
6. Which named places first (§6.4)? Proposal: the Wall at Bernauer Straße, the tram tracks on Kastanienallee, Tempelhofer Feld, the Südgelände.

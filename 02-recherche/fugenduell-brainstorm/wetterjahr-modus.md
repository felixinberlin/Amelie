# Fugenduell — Weather year: pick a city, play its real year

Status: Draft, 11.10.2026. Core idea from Félix: **pick any city in the world, load its real weather for one year, and the plants fight month by month. Depending on the weather, some get bonuses and some don't.**
This replaces the six invented seasonal events in `regelwerk-v0.1.md` §6 with **12 real months**. The rest of the rulebook stays (deck, sections, cards, site fit). Not playtested.

Prototype script: `scripts/fugenduell/wetterjahr.py <lat> <lon> <year>` (NASA POWER, standard library only).

---

## 1. Why this is the right core

* **The weather is the opponent's deck.** In Slay the Spire you see what the enemy is about to do. Here the next month's forecast lies face up. Nobody wrote it: it really happened.
* **The same plants play out differently in another city.** Purslane is weak in Berlin and strong in Madrid. That's the replay value (a different city every game) and the lesson (climate decides) in one.
* **It fits the "no number without a measurement" rule.** The plants come from Pladias and UNDERPLOT; the board comes from measured weather. Only the *conversion rules* are game design, and they are labelled as such.

---

## 2. Data

| Source | What | Access | Limit |
|---|---|---|---|
| **NASA POWER** (Daily API, MERRA-2) | Daily mean, max and min temperature, precipitation, worldwide since 1981 | free, no key; worked from this container | grid of about 0.5° × 0.625° (≈ 50 km): **no urban heat island**. The crack in the asphalt is hotter than the grid cell |
| **Open-Meteo Historical** (ERA5 / ERA5-Land, 0.1°) | same, plus sunshine, evaporation, soil moisture | free, CC BY 4.0, no key | daily request limit; hit from this shared container ("Daily API request limit exceeded"), not tested |
| **Day length** | hours from sunrise to sunset | calculated (CBM model, Forsythe et al. 1995), no data needed | astronomy, exact |

Recommendation: Open-Meteo ERA5-Land in the app (finer grid, fetched by the player's browser, so there's no shared limit), NASA POWER as a fallback. Check the terms of both before publishing.

**Honest limits, shown in the game:**
* The grid cell is not the street. Madrid's 15 frost days in January 2025 are for the grid cell including its surroundings, not the city centre.
* The plant data (Pladias) is from the Czech flora. A city far outside Central Europe is an **experiment** ("What would happen if…"), not a prediction.
* **Southern hemisphere:** flowering windows are shifted by 6 months (labelled as an approximation). In the tropics, flowering is shown as **?**.

---

## 3. How a game runs

1. **Choose a city** (map or search) and a **year** — or "surprise year": the year stays hidden until the end ("That was Berlin 2018, the drought summer").
2. Both players choose their community of 3 species (same city, same year).
3. The game loads the year and generates **12 month cards**. The plant year runs **March → February** (start of the growing season first).
4. **12 rounds, one per month.** At the start of each round the **next** month card is turned face up (the forecast, like a Slay the Spire intent).
5. At the end: majority of ground in 2 of 3 sections wins (as in the rulebook).

---

## 4. From weather to month card: weather conversion v1

Each month card is calculated from the daily values. All thresholds are game design (labelled), and all inputs are measured.

| Month feature | Calculation | Effect in the round |
|---|---|---|
| **Energy** | Day length in the middle of the month: < 9 h → 2 · 9–12 h → 3 · 12–15 h → 4 · ≥ 15 h → 5 | Energy for this round. Light is the plants' currency |
| **Rain month** | Precipitation ≥ 50 mm | everyone draws +1 card; *Sprout* +1 shoot |
| **Drought** | t_mean ≥ 10 °C **and** longest run of dry days (< 1 mm) ≥ 14 days | Event: each player loses (dry days ÷ 7, rounded down) shoots per section |
| **Heat** | Days with Tmax ≥ 30 °C ≥ 5 | Event: loss = hot days ÷ 10, rounded up, in sections with L ≥ 8 (sunny) |
| **Warm month** | t_mean ≥ 20 °C | warmth bonus (§5) |
| **Frost month** | ≥ 10 days with Tmin < 0 °C | the first frost month after the summer triggers the **winter rule** (annuals → seeds, perennials dormant). In frost months, cards place at most 1 shoot |
| **Thaw** | first month after the frost months with < 5 frost days | dormant shoots wake up, seeds sprout +1 |

**Hardening** (from *Endure*, i.e. the plant's S points) absorbs drought and heat losses as before.

---

## 5. Who gets bonuses: plant data meets weather

The bonuses only use what's on the species card. Indicator values describe **where a species is found** along a gradient. That's why they only give fit bonuses, never attack power.

| Plant data | Weather | Bonus |
|---|---|---|
| **Temperature indicator T ≥ 7** (purslane 8, toadflax 7, butterfly bush 7) | Warm month | +1 shoot on every card that places shoots of this species; heat loss −1 |
| **Moisture indicator F ≤ 4** (wall-rue 3, purslane 4, toadflax 4, butterfly bush 4) | Drought | drought loss −1 per section |
| **Moisture indicator F ≥ 6** (meadow grass 6, pearlwort 6) | Rain month | +1 shoot on every card that places shoots of this species |
| **`x` value** (e.g. plantain T5x) | — | broad amplitude: no bonus and no penalty |
| **Flowering window** | Month inside the window | *Bloom* is playable |
| **Life form therophyte** | First frost month | all shoots → seeds (they really do overwinter as seed) |
| **S points** (hardening cards) | Drought, heat | absorbs losses |
| **Missing value (?)** | — | no bonus and no penalty |

---

## 6. Two real years compared: Berlin and Madrid 2025

Data: NASA POWER, grid cells at 52.52° N 13.41° E and 40.42° N 3.70° W, fetched 11.10.2026. Shown here January to December. The game itself runs March → February.

### Berlin 2025

| Month | Day length | Energy | t_mean °C | Precip. mm | Dry run (days) | Hot days | Frost days | Month card |
|---|---|---|---|---|---|---|---|---|
| Jan | 8.2 h | 2 | 1.0 | 66 | 8 | 0 | 20 | Rain, Frost |
| Feb | 9.9 h | 3 | 0.5 | 23 | 11 | 0 | 20 | Frost |
| Mar | 11.8 h | 3 | 5.6 | 16 | 13 | 0 | 13 | Frost |
| Apr | 13.9 h | 4 | 11.1 | 15 | 12 | 0 | 2 | Thaw |
| May | 15.7 h | 5 | 13.7 | 39 | 11 | 0 | 0 | – |
| Jun | 16.8 h | 5 | 19.7 | 41 | 7 | 4 | 0 | – |
| Jul | 16.4 h | 5 | 20.2 | 141 | 6 | 3 | 0 | Rain, Warm |
| Aug | 14.8 h | 4 | 19.5 | 30 | 17 | 4 | 0 | Drought 2 |
| Sep | 12.8 h | 4 | 16.3 | 48 | 8 | 0 | 0 | – |
| Oct | 10.7 h | 3 | 10.4 | 60 | 5 | 0 | 1 | Rain |
| Nov | 8.8 h | 2 | 4.5 | 53 | 7 | 0 | 10 | Rain, Frost → winter rule |
| Dec | 7.7 h | 2 | 2.1 | 24 | 21 | 0 | 17 | Frost |

Total energy: 42 (vs 18 in the 6-round version).

### Madrid 2025

| Month | Day length | Energy | t_mean °C | Precip. mm | Dry run (days) | Hot days | Frost days | Month card |
|---|---|---|---|---|---|---|---|---|
| Jan | 9.6 h | 3 | 5.1 | 53 | 8 | 0 | 15 | Rain, Frost |
| Feb | 10.6 h | 3 | 6.9 | 25 | 8 | 0 | 10 | Frost |
| Mar | 11.9 h | 3 | 7.1 | 202 | 7 | 0 | 4 | Rain, Thaw |
| Apr | 13.2 h | 4 | 11.7 | 90 | 7 | 0 | 1 | Rain |
| May | 14.4 h | 4 | 15.3 | 66 | 16 | 3 | 0 | Rain, Drought 2 |
| Jun | 15.0 h | 5 | 24.1 | 21 | 12 | 20 | 0 | Heat 2, Warm |
| Jul | 14.8 h | 4 | 25.8 | 17 | 26 | 29 | 0 | Drought 3, Heat 3, Warm |
| Aug | 13.8 h | 4 | 27.3 | 3 | 31 | 26 | 0 | Drought 4, Heat 3, Warm |
| Sep | 12.5 h | 4 | 20.5 | 3 | 27 | 12 | 0 | Drought 3, Heat 2, Warm |
| Oct | 11.2 h | 3 | 16.5 | 32 | 19 | 1 | 0 | Drought 2 |
| Nov | 10.0 h | 3 | 7.6 | 62 | 8 | 0 | 6 | Rain |
| Dec | 9.3 h | 3 | 4.9 | 38 | 10 | 0 | 10 | Frost → winter rule |

Total energy: 43.

### What that means for the plants

| Species | Berlin 2025 | Madrid 2025 |
|---|---|---|
| **Purslane** (R 10, T8, F4, flowers Jun–Oct, annual) | 1 warm month (Jul). Dies to seed in November. Weak | 4 warm months +1 shoot, heat and drought −1, blooms all summer. **Strong** |
| **Wall-rue** (S 6, F3) | little stress; its hardening is mostly wasted | 6 hardening cards + drought −1 → **survives the summer** |
| **Plantain** (C 8, S 0, T5x, F5) | no heat, only 1 drought; 8 Spread cards in long days. **Strong** | no hardening, no bonus → **loses ground in summer** |
| **Pearlwort** (S 5, F6) | 3 rain months in the game year (Jul, Oct, Nov) +1 shoot | 4 rain months (Mar, Apr, May, Nov) +1, but summer losses |
| **Meadow grass** (F6, flowers all year) | rain bonus, *Bloom* in every round | spring strong, summer weak |

The same three species win in one city and lose in the other — without anyone having balanced it.

---

## 7. Changes to the rulebook

* **12 rounds instead of 6.** Duel deck stays at **36**. With a hand of 5 and keeping 1, you see 5 + 11 × 4 = 49 cards: the deck is reshuffled once (as in Slay the Spire). Played per game: ≈ 25–28 cards (energy ≈ 42).
* §6.1 (seasons) and §6.2 (invented events) are replaced by §4 of this document. The winter rule (§6.3) is triggered by the **first real frost month**, not by the calendar. In Singapore it never comes, and annuals never die.
* Day length becomes energy: Berlin June 5, December 2. A city near the equator has 3 all year round.

---

## 7a. Decided (11.10.2026)

* **Watch mode first** — implemented in `src/engine/fugenduell/watchMode.ts`, tests in `weatherYear.test.ts`.
* **Same city for both players.**
* **Relative thresholds:** *which* months count as rain, warm, heat, drought or cold months is relative to the city (the top or bottom third of its 12 months). *How hard* they hit stays absolute: heat = hot days ≥ 30 °C ÷ 10 (rounded up), drought = longest dry run ÷ 7, frost = frost days ÷ 10. A cool city has heat months, but they cost nothing if there are no hot days. Day length stays astronomy.
* The first test games and their findings: `testspiel-2026-10-11.md`.

## 7b. Places in the city (11.10.2026)

Every city has the same six places; the weather is the city's, the place changes the rules (`src/data/fugenduellPlaces.ts`). Capacity, trampling, cleaning months, microclimate and salt are **scenario assumptions**. The fit uses the Pladias indicator values; *rosette* (plantain) and *wall dweller* (toadflax, wall-rue) come from the RHS fact sheets.

| Place | Space | Trampling | Cleaning | Microclimate |
|---|---|---|---|---|
| Pavement crack (asphalt) | 40 | 1 | Apr, Jul, Oct | heat +1 |
| Cobbles on a square | 50 | 2 | May, Sep | – |
| Old wall joint | 25 | 0 | – | drought +1, wall dwellers +1 |
| Tree pit | 60 | 1 | Jun | heat −1 (shade), nutrient-rich |
| Kerb on a main road | 35 | 0 | 5× a year (sweeper) | heat +1, salt in cold months (only plants with salt indicator 0) |
| Railway gravel / wasteland | 80 | 0 | – | heat +1, drought +1 |

Rules: **trampling** costs upright plants shoots every month (height class 2: 1, height ≥ 3: 2); flat plants (height class 1 or rosette) escape. **Cleaning** removes all woody shoots, half of the others (flat plants round down), never seeds. **Shading** is now independent of player order: exact ties lose at the same time.

Round robin of all 120 teams against each other per place (Berlin and Madrid 2025): the place decides. Trampled places → plantain + meadow grass; wall joint and wasteland → butterfly bush + celandine; tree pit → celandine + toadflax + meadow grass; kerb → plantain, meadow grass, wall-rue. Gaps: Danish scurvygrass has no indicator values (so no salt advantage), purslane starts too slowly from only 2 seeds.

**Watch view in the app:** Fugenduell simulator → "Weather year · watch". 18 cities + custom coordinates, year 1981–2025, six places, two teams of three. Berlin and Madrid 2025 offline from the fixtures, everything else live from NASA POWER (in the browser, no key).

## 8. Open questions for Félix (status before the decisions)

1. **Interactive or auto battle?** (a) Players play cards each month (rulebook), or (b) you only choose city, year and 3 species, then watch the year play out (12 months, with the math shown like the Balatro scoring). (b) is quick and great for teaching; (a) is the game. Proposal: (b) as the entry point, (a) as the duel.
2. **One city for both, or each their own?** Same weather for both is fair (current proposal). "My Berlin against your Madrid" would be a different game: who chose the better plants *for their own city*?
3. **Thresholds (50 mm, 14 dry days, 30 °C, 10 frost days)** are game design. Fix them as conversion v1, or derive them from the city's own distribution (e.g. the wettest third of months)? The second option works the same way in every climate.
4. **Data source in the app:** Open-Meteo (finer, CC BY 4.0, request limit per IP) or NASA POWER (coarser, no limit hit here)?

---

### Sources

* NASA POWER Daily API: [power.larc.nasa.gov](https://power.larc.nasa.gov/) (query in `scripts/fugenduell/wetterjahr.py`, MERRA-2)
* Open-Meteo Historical Weather API: [open-meteo.com](https://open-meteo.com/en/docs/historical-weather-api) (not reachable here: daily limit)
* Day length model: Forsythe, W. C. et al. (1995), *A model comparison for daylength as a function of latitude and day of year*, Ecological Modelling 80: 87–95

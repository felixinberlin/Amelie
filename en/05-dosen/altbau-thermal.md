# Altbau Thermal

**One sentence:** Draw a floor plan, pick a construction-era class, and see what your own apartment does thermally — at the corner behind the wardrobe, not on average. The inside view to complement what EnergyMap Berlin calculates from the outside for every building.

**As of:** 19 September 2026 · **Recheck by:** September 2027
**Recipient:** the EnergyMap Berlin research consortium (led by UdK Berlin, VPT department) · secondary: Verbraucherzentrale Berlin (energy consulting)
**Verdict:** 🎁 gift — search protocol: *narrowed* (see "Who has already tried this")

---

## The problem

Since May 2025, **EnergyMap Berlin** has used AI to forecast the heat demand of Berlin's building stock (around 360,000 buildings). That answers: *what does this building need?* What remains open: **what does my apartment do?** That depends on the floor plan, on the corner behind the wardrobe, on the radiator under the alcove. No cadastre can close that.

- **The mold dispute.** Tenants are told they ventilate wrong; the landlord's side says the wall is fine. What's missing is a statement both sides can check: **"This corner stays below 80 % surface humidity as long as the room air stays below X % relative humidity."** If X is 42 %, ventilating alone barely helps, because ordinary room humidity already exceeds the limit. If X is 60 %, the corner has headroom.
- **The €20,000 decision.** Replace windows, insulate, or enlarge radiators: nobody can compare the options for *their* floor plan.
- **The consulting gap.** The Verbraucherzentrale explains in conversation what an image would show in ten seconds (the Basis-Check home visit for tenants is free, the Gebäude-Check costs a €30 own share). The advice-seeker has nothing to take home.

**Not a competing product:** the tool starts at the building envelope and consumes EnergyMap's data rather than replacing it.

## Why now

1. **Floor plan from a photo or PDF** exists as a product (RoomSketcher, FloorScan). Openings are recognized worse than walls, so a human confirms every detection.
2. **Parameters without expertise.** Nobody knows their wall's U-value, but almost everyone knows "pre-war, around 1905, box-type windows". IWU's building typology (TABULA) maps construction-era classes to component build-ups; 35 cm solid brick from the Gründerzeit sits at U ≈ 1.4–1.6. The **spread within a class** is the band the interface has to show.
3. **2D heat conduction in the browser.** Steady-state needs only JavaScript or WASM; WebGL2 pays off only for the transient real-time animation.
4. **Free weather data:** DWD/BBSR test reference years.
5. **Retrievable building data:** EnergyMap offers CSV download and Energy Atlas services, and `energymap4py` is published on GitHub. Which attributes exactly (construction era, geometry, renovation state) can be queried I have not checked — the first question to the consortium.

## Sketch

Draw → parametrize → simulate → compare.

- **Input:** floor plan on a grid or from an image; walls, windows, radiators. Address → building context from EnergyMap, correctable by hand.
- **Model:** heat conduction in **two sections**: horizontal (outer corners, reveals — the mold case) and vertical (ceiling junction, parapet, radiator niche). Room air as one well-mixed node, no airflow. The furniture effect enters through the surface resistance behind the wardrobe (0.25 instead of 0.13 m²K/W).
- **Mold is not dew point.** It grows from about 80 % relative surface humidity, without any condensation (fRsi ≥ 0.70; at 20 °C/50 %/−5 °C that is 12.6 °C, while the dew point is 9.3 °C). This steady-state limit is conservative; the weather year adds the **hours above 80 %** as a risk indicator, never as a finding.
- **Output:** temperature field, corner surface temperature, the corner's humidity limit, consumption and cost **as a band**.
- **The real value: A/B.** Two variants of the same floor plan, same weather, same usage.

**Not included:** no energy certificate, no standard-compliant heating load, no expert opinion, no evidence in a rent dispute, no 3D.

## First step

**Ticket: one outer corner, one window, one radiator, steady-state.**

Grid editor for a room with two exterior walls; sliders for wall U, window U, air exchange, room humidity; output: heating power, corner surface temperature, humidity limit as a band.

**Done when:** (1) the 2D solver reproduces the two-dimensional test cases from Annex A of DIN EN ISO 10211 (per WUFI, to 0.1 K) and (2) the heating power matches a hand calculation per DIN EN 12831 within 10 % and visibly reacts to a change in window U-value. Everything else hangs off this one validated room; for transience, the VDI 6007 Part 1 test cases are the yardstick.

## Where it breaks

**A simulation that looks precise and is wrong is worse than none.** People make five-figure decisions with it and argue with their property management.

- **Never a single number, never "harmless".** The model may say "critical" or "unclear". A 2D section underestimates the cold of real room corners where three surfaces meet; the band is therefore one-sidedly optimistic, and the interface has to say so.
- **Validate against established methods** before anyone outside sees it (see ticket). The methodology lives in the consortium, not in my head.
- **The model doesn't say whose fault it is.** It shows the condition under which a corner stays dry; no floor plan measures the actual room humidity.

**Second risk:** being read as an energy-certificate substitute. The disclaimer belongs in the interface, not the imprint. **Third:** the floor-plan import is where laypeople drop off; if drawing takes longer than three minutes, the tool is dead.

## Who has already tried this

Verdict **narrowed**, not free (19 Sep 2026, five searches).

- **Ubakus "Thermische Simulation"** (since November 2023): heating demand and summer overtemperature degree-hours over a test reference year, but tabular input, **one air temperature per zone**, components reduced to 1D. No floor plan, no temperature field, no corners. **The summer direction is thereby taken at zone level**; only the spatial distribution would be new.
- **Thermal-bridge tools:** Schöck calculator (manufacturer tool), Ubakus U-value (2D FEM per component), Better Building Heat Transfer Simulator (2025, professionals), ThermCAD: components, not apartments.
- **fRsi/dew-point calculators:** a single number from a measured surface temperature. **airtec WohnCheck:** only the description seen, scope unchecked.
- **Floor-plan recognition** (RoomSketcher, FloorScan, HottCAD): geometry; HottCAD's thermal scope unchecked.

Not found: a layperson's tool that combines floor plan, spatial surface temperature, humidity limit and A/B.

## Prior work

- **EnergyMap Berlin:** UdK Berlin with co2online, SEnerCon, LUP and the Charlottenburg-Wilmersdorf district office, federally funded; web app since 28 May 2025; validation of the AI model presented at BauSIM 2026 (Zurich, 9–11 September).
- **CoolingMap** (since April 2026) and **CO2OL ISLANDS** (since March 2026), both coordinated by UdK: cooling demand and urban heat, a connection point for the summer direction.
- **Prototype Fund:** applications 1 Oct–30 Nov 2026, but since 2025 its only priorities are data security and software infrastructure. An apartment app doesn't fit; an open, validated 2D heat-conduction core as a library might count as infrastructure — to be clarified beforehand, not assumed. A student thesis within the consortium is the closer fit.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

# Altbau Thermal

**One sentence:** Draw a floor plan, pick a construction-era class, watch what your own apartment does thermally — the inside view to complement what EnergyMap Berlin calculates from the outside for every building.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** the EnergyMap Berlin research consortium (project lead: UdK Berlin) · secondary: co2online gGmbH, Verbraucherzentrale Berlin

---

## The problem

Since May 2025 there's **EnergyMap Berlin**: a public web app that uses AI to forecast the heat demand of individual Berlin buildings, lets you play through renovation options, and connects to the Energieatlas. Plus a Python interface for developers. That answers a question that used to be open: *what does this building need?*

The question that comes after that is unanswered: **what is my apartment doing?**

Between the building envelope and the resident lies a gap no cadastre can close, because it depends on the floor plan — on the corner behind the wardrobe, the window in the Berlin room, the radiator under the alcove. Three situations where this concretely hurts:

- **The mold dispute.** Tenants are told they're ventilating wrong; the landlord's side says the wall is fine. A building value in kWh/m²a helps nobody in this argument. What's missing is the surface temperature **at this specific corner** — a shared model both sides can look at together.
- **The €20,000 decision.** Replace the windows, add insulation, or enlarge the radiators: anyone who wants to compare the three options for *their* floor plan has no tool for it.
- **The consulting gap.** Free energy consulting explains in conversation what an image would show in ten seconds. Consultants lack a visualization the advice-seeker can take home.

**Explicitly not a competing product.** This tool starts where EnergyMap stops: at the building envelope. It consumes their data, it doesn't replace it.

## Why now

Five things used to each be expensive and no longer are — the fifth is new as of last year:

1. **Floor plan from a photo or PDF.** Extracting walls, windows, and doors from a listing's floor plan is a solved image problem today. It used to be manual work or CAD import — where lay tools have failed so far.
2. **Parameters without expertise.** Nobody knows their exterior wall's U-value. But almost everyone knows "pre-war building, around 1905, Berlin room, box-type double windows" — building-component parameters can be derived from that, by construction era, in language instead of forms.
3. **Interactive simulation in the browser.** Transient 2D heat conduction plus air exchange runs in real time via WebGL2 on a mid-range laptop. Until a few years ago this was licensed desktop FEM software.
4. **Freely usable weather data.** The location-specific test reference years from DWD and BBSR provide a realistic Berlin hourly year.
5. **The building data is now publicly available.** That was exactly the missing piece — and with the EnergyMap web app and `energymap4py` it's existed since 2025. The apartment-level simulation no longer has to guess the building context, it can query it.

## Sketch

Draw → parametrize → simulate → compare.

- **Input:** draw a floor plan on a grid or import it from an image. Place walls, windows, doors, radiators. Enter an address → pre-fill building context from EnergyMap, correctable by hand afterward.
- **Model:** transient heat conduction in a 2D cross-section per component, air exchange per room (window closed/tilted/burst ventilation), radiators as a source with thermostat behavior, time-stepped over a DWD test reference year.
- **Output:** animated temperature field, surface temperature at the critical corners (mold risk as dew-point undershoot, not a gut feeling), consumption and cost **as a band, never a single number**.
- **The real value:** A/B comparison. Two variants of the same floor plan side by side, same weather data, same usage.
- **The summer direction falls out for free.** Same equation, opposite sign: overheating, shading, night ventilation. For a project that catalogues cooling demand at the building level, this is the matching apartment-level layer.

**Not included:** no energy certificate, no norm-compliant calculation, no 3D, no equipment contracting. A tool for understanding, not a compliance instrument.

## First step

**Ticket: one room, one window, one radiator, steady-state.**

Grid editor for a single room with one exterior wall. Three sliders: wall U-value, window U-value, air-exchange rate. Output: required heating power and surface temperature in the cold corner, at Berlin's average January temperature.

**Done when:** changing the window U-value visibly changes the required heating power, and the number matches a hand calculation done to code within 10%.

Everything further — transience, weather year, floor-plan recognition, EnergyMap connection, A/B comparison — hangs off this one validated room.

## Where it breaks

**The main risk isn't technical, it's ethical: a simulation that looks precise and is wrong is worse than none at all.** People make five-figure decisions with this and get into disputes with their property management using it. False precision does real damage here.

The only countermeasure I know is discipline in presentation:

- **Never output a single number.** Always a band, and the band has to be honestly wide.
- **Validate against established methods** before anyone outside sees this — the validation methodology for that exists in this consortium, not in my head.
- **Make uncertainty visible, don't design it away.** Anyone who doesn't know the building condition sees a wider band, not a footnote.

**Second risk:** the tool gets read as an energy-certificate substitute and inherits regulatory expectations it can't meet. Response: the disclaimer belongs in the interface, not in the fine print.

**Third risk, honestly:** the floor-plan upload is where laypeople drop off. If drawing takes longer than three minutes, the tool is dead. So the input, not the physics, is where the real risk sits.

## Prior work that already exists

- **EnergyMap Berlin** — a research consortium led by UdK Berlin with co2online, SEnerCon, LUP, and the Charlottenburg-Wilmersdorf district office, funded by the federal government. Public web app since May 2025, plus the Python interface `energymap4py`. The AI model's validation was most recently presented at BauSIM 2026 in Zurich.
- **CoolingMap** (2026–2029) and **CO2OL ISLANDS** (2026–2030) — the follow-up projects on cooling demand and climate-resilient urban development. That's where the summer-direction version of this tool could connect.
- **DWD test reference years (TRY)** — location-specific hourly weather data, produced with the BBSR.
- **Verbraucherzentrale Berlin, building check** — the free consulting track a tool like this could plug into as a communication aid.
- **TEASER** (RWTH-EBC) and **SimStadt** — building-stock modeling at the district level. Both model stocks. Neither addresses the individual apartment and its resident. That's exactly the gap.
- **Prototype Fund** — application window from October 1, 2026, open-source requirement. If you want to turn this into a student thesis or a small project: there's money for it there.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

---
status: Available
delivery_method: E-Mail
target_maker: co2online
review_score: 32/35
architecture_tier: Tier 1
source_type: Type A
---
# Heat Signature

**One sentence:** Twelve monthly meter readings plus the weather yield how much heat this flat loses per degree of temperature difference, and at which outdoor temperature it starts heating — as an honest band, without anyone drawing a floor plan.

**As of:** 19. September 2026 · **Recheck by:** März 2027  
**Recipient:** co2online (operator of a heating-cost check and partner in the EnergyMap consortium) · secondary: the EnergyMap Berlin research consortium as a calibration target, consumer advice centres  
**Verdict:** 🎁 **gift**  
**Review:** 32/35 · Tier 1 · Type A (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Tenants with remotely readable meters now receive their heat consumption monthly — together with nothing but a comparison to an average user. "You are 30 % above average" does not answer what the resident wants to know: is it my flat or is it me? The quantity that answers it — heat loss in watts per kelvin — is precisely what laypeople cannot supply, because nobody knows the U-value of their exterior wall. Yet part of the answer is already in the drawer: in the meter readings.

## Why now

- The monthly series arrives unasked: meters had to be retrofitted for remote reading by the end of 2026, after which at least monthly consumption information is mandatory. Until recently there was one value a year.
- The energy signature — regressing consumption against outdoor temperature — is textbook. What is new is the Bayesian version that yields a band instead of a number (arXiv 2503.22321, 2025), and it runs in any browser.
- Weather data is free, and a building-level comparison value is available through an open Python interface.

## Sketch

Input in under a minute: six to twenty-four monthly values as a photo of the consumption statement, meter readings or CSV, plus postcode and floor area. Model: consumption equals heat loss times degree days plus a base load for hot water, Bayesian linear regression against monthly weather means. Output never as a single number but as a band for heat loss, plus the heating threshold temperature, the hot-water share, and where the band sits against the building comparison — without judgement. Not included: energy certificates, renovation forecasts, criticism of behaviour, or a server.

## First step

**Ticket:** A notebook: twelve monthly values in, a heat-loss band out.

Done when the band contains the true value of a synthetic flat in at least 90 % of a thousand runs — and the width of the band is reported alongside, so one can see whether it is informative at all.

## Where it breaks

Heat cost allocators do not measure kilowatt-hours but dimensionless units that the annual bill distributes across the building; whether a monthly figure derived from them is physically sound is contested. It works cleanly only with real kWh — a flat's own gas boiler, a heat meter, a heat interface unit. Room temperature, ventilation behaviour and heat from neighbouring flats are also baked into the value. The band has to show that honestly; if it becomes so wide that it says nothing, the idea is dead — the test in the first ticket decides that, not an opinion.

## Who has already tried this

The existing heating check takes one annual value, floor area and postcode and compares them; no monthly trajectory and no heat-loss coefficient appeared. A cost-tracking app forecasts back payments without building parameters. Advice sites and a DIY heat-pump forum derive heating load from gas consumption for sizing — the nearest neighbour, but without an uncertainty band. Research knows energy-signature methods for apartment buildings, where the data comes from the owner. Not found: a consumer tool that turns one flat's monthly series into a band with uncertainty.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

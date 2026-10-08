---
status: Available
delivery_method: E-Mail
target_maker: Joep Breuer, TNO / BIRDSAFE
---
# EuroBirdCast — Bird Weather

Bird Weather for Germany and Europe: combine recent radar, weather forecasts and historical migration knowledge, then test on unseen nights whether the forecasts improve.

**Status:** Build first. No live forecast and no demonstrated accuracy improvement. CC0 code; third-party data retain their licenses.

## Problem

The next migration night depends on current conditions and long-term species patterns. Radar, ringing, GPS and sightings measure different things. EuroBirdCast aims to build an auditable migration forecast from them. The first real radar/ERA5 pilot failed its quality gate (Protzel, October 2021–2023: 5/3/0 usable nights); better predictions have not been demonstrated. The previous BfN rejection of an offshore reproducibility gap remains valid.

## Architecture

Connect three timescales: recent airborne movement from radar, hours-to-days from weather forecasts, and seasonal/species patterns from long-term research. Preserve each source’s observation model, species, place, effort, license, uncertainty and availability time. Papers inform features rather than becoming measurement points. Compare seasonal history, add weather, add recent radar, then species knowledge. First target: nightly integrated density; direction/altitude and regional propagation are later separate targets. No turbine control. The frontend shows source roles, the quality gate and the existing historical map.

## Prior art

Narrowed; demand uncertain. FlySafe already provides recent radar observations and multi-day migration forecasts for Germany, Belgium and the Netherlands (UvA, 25 August 2026). Aloft/CROW, getRad/bioRad, HiRAD and FluxRGNN address data, analysis and models. EuroBirdPortal, EURING and Movebank provide different historical perspectives. The potential contribution is a testable comparison of additional knowledge sources; neither a first-of-kind system nor improved accuracy is claimed.

## First step

Join history, weather and recent radar through a verifiable data gate.

Runnable: Python pipeline in 07-demos/eurobirdcast/forecast/, three archived radar months plus ERA5, source SHA-256 hashes and a quality report. The first gate failed: 5/3/0 nights before radar lag, 1/0/0 afterwards; therefore no model and no forecast. Next completion: sufficient quality-controlled multi-season data, archived weather forecast runs with issue times and independent site/year tests; evaluate additional species sources separately against the same baselines.

## Limits and history

The BfN rejection of the former offshore proposal remains valid. Radar is not species identification or collision risk. Historical records have unequal effort and changing climate; access and redistribution are source-specific. ERA5 includes later observations, so it cannot certify operational forecast skill. EuroBirdCast is a working title, unaffiliated with BirdCast.

## Recipient and funding

Joep Breuer, TNO / BIRDSAFE, is a documented technical contact; a new need is unconfirmed. No outreach. DBU is a potential bridge for a future implementation pilot with a German partner and measurable environmental benefit, subject to eligibility and CC0 checks; monitoring, basic research, statutory obligations and already begun projects are excluded.

## Research and demo

- [Forecasting and data fusion](../../02-recherche/eurobirdcast-bird-weather-2026-10-08.md)
- [Revival research](../../02-recherche/eurobirdcast-revival-2026-10-08.md)
- [Runnable pilot](../../07-demos/eurobirdcast/forecast/README.md)
- [DBU](https://www.dbu.de/foerderung/projektfoerderung/)
- [Project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)

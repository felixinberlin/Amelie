---
status: Available
delivery_method: E-Mail
target_maker: Peter Desmet, INBO / Aloft
---
# EuroBirdCast — Bird Weather

Make bird migration visible like weather: an animated map of real radar observations, migration intensity and movement direction over Germany and neighbouring countries.

**Status:** Historical movement map working. Retrospective model comparison executed; operational forecasting remains open. CC0 code; third-party data retain their licenses.

## Problem

The next migration night depends on current conditions and long-term species patterns. Radar, ringing, GPS and sightings measure different things. A runnable comparison on published European data uses 61,881 nighttime radar hours across 21 shared sites: adding weather reduces held-out 2017 log-MAE by 16.6% against seasonal history. This uses retrospective weather and does not establish live forecast skill. The previous BfN rejection remains valid.

## Architecture

Start with a clear movement map: 21 radar sites, 168 hours from 1–7 October 2017, time slider, date selection, nighttime playback, verified site names, station time charts and an expanded map view. Circle colour and size show estimated vertically integrated bird density; arrows show measured mean movement bearing with schematic length. Missing and excluded daytime observations stay distinct. No invented connections between stations. Science, sources, model comparison and expert contacts expand behind the map. Fresh observations and forecasts are later additions.

## Prior art

Narrowed; demand uncertain. FlySafe already provides recent radar observations and multi-day migration forecasts for Germany, Belgium and the Netherlands (UvA, 25 August 2026). Aloft/CROW, getRad/bioRad, HiRAD and FluxRGNN address data, analysis and models. EuroBirdPortal, EURING and Movebank provide different historical perspectives. The potential contribution is a testable comparison of additional knowledge sources; neither a first-of-kind system nor improved accuracy is claimed.

## First step

Show a scientifically traceable movement map in the frontend.

Implemented: animated frontend map with 21 sites, 168 hours and 1,351 available nighttime readings, CC-BY attribution and independent data review. Reproduce from 07-demos/eurobirdcast/map/. Executed: 07-demos/eurobirdcast/benchmark/ reuses published radar/ERA5 data, trains on 2015, tunes on 2016 and tests 18,217 radar hours from 2017. Seasonal log-MAE 0.7925; adding weather 0.6606. Source license, masks, CRC and SHA-256 documented. Separate Protzel raw-data pilot remains insufficient with 9/4/1 bird-discriminated nights. Next completion: issue-time weather forecasts, fresh radar, multiple seasons/sites and separate tests of species knowledge; expert QC requests to INBO/UvA drafted, not sent.

## Limits and history

The BfN rejection of the former offshore proposal remains valid. Radar is not species identification or collision risk. Historical records have unequal effort and changing climate; access and redistribution are source-specific. ERA5 includes later observations, so it cannot certify operational forecast skill. EuroBirdCast is a working title, unaffiliated with BirdCast.

## Recipient and funding

Peter Desmet (INBO/Aloft): data quality; Judy Shamoun-Baranes (UvA): scientific comparison; further verified contacts in the research chapter. New demand unconfirmed; no outreach. DBU is a potential bridge for a future implementation pilot with a German partner and measurable environmental benefit, subject to eligibility and CC0 checks; monitoring, basic research, statutory obligations and already begun projects are excluded.

## Research and demo

- [Forecasting and data fusion](../../02-recherche/eurobirdcast-bird-weather-2026-10-08.md)
- [Revival research](../../02-recherche/eurobirdcast-revival-2026-10-08.md)
- [Runnable pilot](../../07-demos/eurobirdcast/forecast/README.md)
- [DBU](https://www.dbu.de/foerderung/projektfoerderung/)
- [Project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)

- [Real Amélie test](../02-recherche/eurobirdcast-real-test-2026-10-08.md)
- [Verified contacts and unsent drafts](../02-recherche/eurobirdcast-contacts-2026-10-08.md)

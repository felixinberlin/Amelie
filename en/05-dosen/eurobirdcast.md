---
status: Available
delivery_method: E-Mail
target_maker: Joep Breuer, TNO / BIRDSAFE
---
# EuroBirdCast — Migration Evidence Lab

Explore European nocturnal migration and replay curtailment scenarios: an open research workbench with data quality checks, rotor-height coverage and explicit assumptions.

Revived with a narrower scope on 8 October 2026. Build first; new demand unconfirmed. CC0. No affiliation with BirdCast.

## Problem

Radar profiles describe regional migration; a wind-farm decision additionally needs local measurements, applicable rules and grid conditions. The original project was buried after negative BfN demand feedback on 30 September 2026. The new, unconfirmed residual gap is a portable comparison report: which data and heights were actually observed, how does a user-selected scenario threshold change the result, and what remains unknown?

## Sketch

Two separate layers: European VPTS profiles for regional context and optional local bird-radar/power imports. Density (birds/km³) × speed (km/h) × observed layer thickness (km) yields MTR (birds/km/h). Missing or quality-rejected layers block rotor-band evaluation. Scenarios compare observed passage and hypothetical energy losses; they do not estimate collisions or birds saved. Exports retain source, license, UTC, height reference, parameters and software version. No live shutdown service.

## Limits

BfN saw no reproducibility gap and considered DWD weather radar unsuitable for the former offshore use case. That feedback remains valid. Regional MTR is not collision risk; partial coverage is not zero migration. New demand confirmation and local validation are missing. Stop expansion if BIRDSAFE/HiRAD already cover the export format or see no value. EuroBirdCast is a working title with no affiliation to the US BirdCast project.

## Prior art

Narrowed, demand uncertain (8 October 2026): Aloft/CROW visualize European migration; getRad and bioRad provide access and analysis; BirdCast offers US maps and forecasts. Dutch Start/Stop, BIRDSAFE and BfN projects already address offshore protection. VoVis Wx processes radar for military migration advice. No novelty claim for radar, forecasting or curtailment; only an interoperable, quality-aware research report remains to be tested.

## Why now

- Desmet et al. (2025) document European VPTS datasets released under CC0, with UTC timestamps. Open access does not guarantee local suitability.
- HiRAD added radar locations on 11 February 2026 while explicitly warning that biological signal quality has not been evaluated.
- The Dutch amendment of 30 January 2026 replaces the fixed 500 birds/km/h threshold with model-based decisions using a flexible boundary.
- BIRDSAFE already investigates radar, cameras and curtailment strategies. EuroBirdCast must fit as a complementary export module rather than duplicate that research.

## First step

One rotor band, one auditable MTR report.

The CC0 TypeScript core and synthetic tests are in 07-demos/eurobirdcast/. Ticket 01 completes only after importing an archived real VPTS excerpt with URL, license and SHA-256, verifying the height reference and independently reproducing the MTR calculation. Missing layers, rain flags, overlaps, zero migration and invalid values must be handled explicitly. A research partner must confirm the export format is useful before expansion.

## Recipient

Joep Breuer, TNO / BIRDSAFE (technical contact in the 2025 Wozep poster); secondary: HiRAD / UvA. New demand unconfirmed; no repeat delivery to BfN.

## Funding bridge

DBU project funding is a candidate for a future implementation pilot with a German partner and demonstrable environmental benefit. Applications may be submitted continuously; pure monitoring, basic research and statutory obligations are excluded. Eligibility, applicant and CC0 terms need checking before applying; no funding promise or outreach.

## Research and demo

- [Research dossier](../../02-recherche/eurobirdcast-revival-2026-10-08.md)
- [CC0 scaffold](../../07-demos/eurobirdcast/README.md)
- [Project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)
- [DBU funding](https://www.dbu.de/foerderung/projektfoerderung/)


## Historische Messdatenkarte / Historical observation map

Die Projektseite enthält zusätzlich die am 08.10.2026 auf `origin/main` veröffentlichte Karte: Protzel, Dresden und Ummendorf, 01.10.2023 UTC. `src/data/birdMigrationSample.json` enthält Quell-URLs, SHA-256 und Dateigrößen; Regeneration: `scripts/eurobird-demo/fetch.py`. Diese echte historische Stichprobe ist unabhängig vom synthetischen MTR-Kern: Stunden-/Höhenmittel sind keine vollständige vertikale Integration und validieren keine Abschaltempfehlung. Die Karte benötigt für Basiskacheln Internet; die Messtabelle bleibt ohne Kacheln nutzbar. Keine europaweite Messabdeckung. Weitere Recherche: `02-recherche/eurobirdcast-radar-kakeya-research-2026.md`; kein neues Kakeya-Theorem implementiert.

The project page also includes the historical observation map merged from `origin/main`: three German radars, 1 October 2023 UTC. Source URLs and raw SHA-256 checksums are retained in the sample JSON. This real snapshot is separate from the synthetic MTR kernel; hourly averages do not validate rotor-band traffic or curtailment. No new Kakeya theorem is implemented.

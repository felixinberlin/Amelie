> Superseded extraction audit: v1 incorrectly treated velocity gaps as invalid density and omitted insect thresholding. See the density-v2 README and real-test report; historical v1 counts below are retained as an audit trail, not the current result.

# EuroBirdCast — Bird Weather from recent data and long-term science

**8 October 2026.** User direction: combine fresh observations with the history and science of bird migration in Germany/Europe to improve “bird weather” predictions. Research and implemented pilot, not a validated forecasting service. The original offshore/BfN rejection remains on record.

## Intended product

An hourly-to-nightly outlook for migration intensity, altitude and direction, with uncertainty and data age visible. Start with a single precisely defined target, nighttime integrated density; test altitude/direction and movement between regions separately later. Germany comes first, then European transfer tests. “All history” is a collection strategy, not a claim that a complete, uniform historical census exists.

Historical records contribute knowledge of species, timing and connectivity. Recent radar constrains what is moving now. Weather forecasts describe possible future conditions. Scientific publications guide model structure and identify variables and limits. Their observations cannot simply be poured into the same table: sightings, ring recoveries, tagged individuals and radar density differ in units, sampling and detectability.

## Source roles, actual access and evidence

Sources below were inspected on 8 October 2026. Website readability is not permission to download its underlying database. Only the bounded radar/ERA5 subset described later has been ingested.

| Source | Contribution | Access / limitation | Evidence |
|---|---|---|---|
| [Aloft FAQ](https://aloftdata.eu/faq/) | Historical profiles and fresh aggregate airborne movement | UvA coverage begins 2008; BALTRAD 2012. Daily updates; HDF5 typically about 24h behind observation, CSV summaries within 48h. Bucket data are not generally quality controlled. CC0. | Page read; three monthly files downloaded |
| [Desmet et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11871220/) | Measurement definitions and provenance | Height is the lower altitude-bin boundary in metres AMSL; bins 200m; density, direction and velocity describe biological targets. Sensor configurations and station changes matter. | Scientific full text inspected |
| [EURING databank](https://euring.org/data-and-codes/euring-databank) | Species-specific phenology and connectivity | Dataset access by application; scheme-dependent recovery types and time distribution. Not an hourly flux target. | Page read |
| [CMS Migration Atlas launch](https://www.cms.int/news/un-initiative-establish-global-atlas-animal-migration-sets-milestone-launch-new-bird-migration) | Long historical synthesis | Describes over 100 years of ringing knowledge for 300 species, supplemented by tracking for over 100. Atlas visibility is not a blanket raw-data license. | Official page read |
| [EuroBirdPortal help](https://www.eurobirdportal.org/ebp/en/help/) | Seasonal and regional species presence | Maps aggregate records in space and time and account for uneven reporting effort. Request a suitable research extract; do not use a screenshot as training data. | Page read |
| [DDA ornitho data use](https://www.dda-web.de/ornitho/datennutzung) | German species observations and effort-aware context | Data-use application required; approved extracts are the citable data. Publicly displayed records are incomplete, and DDA warns against copying them to bypass applications. | Page read; no application sent |
| [Movebank FAQ](https://www.movebank.org/cms/movebank-content/faq) | Individual routes and weather/behaviour responses | Owners control study access and licenses. Live tag feeds can update studies several times daily, but that does not make all tracking public or representative. | Page read |
| [eBird data help](https://support.ebird.org/en/support/solutions/articles/48000838205-download-ebird-data) | Supplementary checklists with effort metadata | EBD requires login and a project description; monthly release. Recent API requires a personal key. Europe coverage and bias must be assessed. | Official help inspected; not downloaded |
| [Copernicus ERA5](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=documentation) | Long-term weather context | From 1940; retrospective reanalysis, not the weather forecast known in the past. Attribution/license retained. | Official documentation inspected |
| [Open-Meteo historical weather](https://open-meteo.com/en/docs/historical-weather-api) | Small reproducible ERA5 retrieval | Explicit `models=era5` avoids changing automatic model blends; 100m wind here is only a proxy for higher bird layers. | Documentation read; three bounded responses downloaded |
| [Open-Meteo historical forecast](https://open-meteo.com/en/docs/historical-forecast-api) | Future operational evaluation data | Stitched recent model runs differ from exact issue-time runs. Previous Runs and Single Runs products retain appropriate lead/run information; availability depends on model/date. | Documentation read, no forecast data downloaded |
| [ECMWF open forecast data](https://www.ecmwf.int/en/forecasts/datasets/open-data) | Future operational weather input | Public rolling forecast archive is short; preserve each run as it arrives or acquire historical runs under applicable access terms. | Official page read |
| [FlySafe, UvA 25 August 2026](https://ibed.uva.nl/content/news/2026/08/flysafe-service-to-observe-bird-migration.html) | Existing service and comparator | Already offers radar observations and several-day predictions for Netherlands, Belgium and Germany. Public service does not imply an available redistribution API. | University page read |
| [Lippert et al., FluxRGNN extension, arXiv:2407.10259v1](https://arxiv.org/abs/2407.10259) | Research-informed movement-model design | Hybrid physical movement and learned components; abstract describes US-network experiments. No assumed German improvement and no theorem imported. | Primary abstract/version read, not reproduced |

A recent [Western European migration/wind-energy paper](https://www.nature.com/articles/s41893-026-01853-4) also surfaced; only its search abstract was accessible. It is a direct overlap signal for the older curtailment direction, not evidence of forecast performance. The complete study should be read before using its methods or numerical conclusions.

## How historical science enters a forecast

Keep a versioned evidence ledger: claim ID, DOI/URL and version, species/population, geography, study years, method, sample size if reported, effect/uncertainty, known limitations and retraction/correction status. A paper proposes a feature, prior or hypothesis; it is not itself a target-night measurement. Do not copy a published percentage into a model weight without a transportability argument and validation.

Use separate observation models:

- Radar likelihood: aggregate airborne density, altitude and direction; unknown species mix, angular gaps, contamination, station configuration and calibration.
- Sightings/checklists: occurrence or abundance conditioned on time, observer effort and detection; ground records are not airborne density.
- Ringing: encounter-conditioned connectivity and seasonal timing, with ringing/recovery effort and historical sampling changes.
- Tracking: trajectories conditioned on chosen species, tagging and surviving individuals; not the population census.
- Weather: historical atmospheric context for research, actual archived forecast runs for issue-time testing.

An eventual hierarchical state/flow model could combine these layers with species-specific seasonal priors and migration continuity. This is a proposed architecture, not implemented or proven better. Compare against existing practical models before increasing complexity. Climate and land-use changes mean very old records may inform routes and seasonal priors without receiving the same weight as contemporary radar targets.

## Implemented, reproducible first test

[Pipeline, data and instructions](../07-demos/eurobirdcast/forecast/README.md). Python standard library, bounded downloads, source SHA-256 and retrieval times; no paid APIs. Three Protzel radar months, October 2021/2022/2023, joined to ERA5 at the station. The archived input summaries and frontend result are committed.

Protocol fixed before fitting: five accepted 200m bins spanning 1000–2000m AMSL; at least 75% quarter-hour coverage in each 18:00–06:00 UTC window. That clock window is not astronomical darkness. Nominal timestamp/source-file grouping and deterministic per-slot selection prevent multiple files from being counted as independent measurements. Processing-version semantics still need expert review.

| Stage | 2021 | 2022 | 2023 |
|---|---:|---:|---:|
| Candidate complete October windows | 30 | 30 | 30 |
| Target quality gate passed | 5 | 3 | 0 |
| With recent radar satisfying assumed availability | 1 | 0 | 0 |

**Result: `blocked-data-quality`.** No fit, forecasts or accuracy metrics were produced. The minimum eight common nights per year is a software experimentation guard, not a scientific sufficiency claim. Thresholds were not relaxed after inspecting the outcome. This extraction failed; the result does not reject all Aloft data or the fusion concept. Coverage filtering can depend on weather and introduce selection bias.

The implemented comparison, behind that gate, is seasonal ridge → add weather → add recent radar. Annual sine/cosine terms remain fixed across models. Training-only standardization; tune penalties 1/10/100 on 2021→2022; refit on those years and hold 2023 out. Predict log-transformed density. A full radar observation window must end at least 48h before simulated issue time; the most recent eligible lag within 96h is used. That is assumed availability, not an archive of actual publication times.

If enough data existed, report log-MAE/RMSE, original-unit MAE, relative MAE improvement against seasonal history and paired descriptive block intervals. ERA5 contains later information, so target-night ERA5 makes this an **oracle-weather historical experiment**, never a real-time forecast backtest. One station and one month cannot support Germany-wide claims. The repository mathematician reviewed this design and the failed data gate; no expert ornithological validation is implied.

## Next concrete gates

1. Audit filtering attrition, source versions and station configuration with a radar-domain expert. Retain this failed version. Acquire sufficient multi-season/site data under a new documented extraction protocol; use fresh held-out seasons/sites for final assessment.
2. Archive exact operational forecast runs and actual radar availability timestamps. Test Germany first with solar-night windows and flight-layer winds; report missing-data performance as well as successful-night accuracy.
3. Start the science ledger and obtain suitable licensed species datasets. Add one historical source at a time and measure its contribution on the same validation set. Older and recent records must not duplicate the same observations across train/test.
4. Run prospective shadow forecasts for multiple seasons. Calibrate uncertainty and peak-migration probabilities, report false alarms/missed peaks, compare to FlySafe or an obtainable equivalent baseline. Publish improvements only after this evidence exists.

The frontend now exposes this architecture and the actual failed pilot instead of a simulated “better forecast.” It remains the first project. No external application, recipient message, credentials or new data-use agreement was submitted.

## Quellenmeldung

For Bibliothekar, without editing the canonical register: Aloft FAQ and the downloaded Protzel archive (CC0); ERA5/Open-Meteo (weather, CC BY attribution); EURING/CMS Atlas (historical species knowledge, application access); DDA/EuroBirdPortal (observations and effort, application access); Movebank (study-level tracking access); FlySafe (direct comparator); FluxRGNN v1 (model research). Exact URLs, evidence and current import status above. Yield: changed `eurobirdcast`, verdict `verengt`, new demand `unklar`; no score increase and no demonstrated forecast gain.

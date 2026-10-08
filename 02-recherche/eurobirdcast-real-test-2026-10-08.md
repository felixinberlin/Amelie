# EuroBirdCast: Amélie real-system test · 2026-10-08

Requested outcome: working bird-weather research, reuse of existing data even where novelty is small, and concrete people who can help. This is development of the existing dose, not another idea-generation round. CC0 code; each input retains its source terms.

## What the system actually tested

Three native independent roles audited radar/mathematics, existing datasets/code, and verified contacts. No Vertex calls. Preflight fetched origin and found no open PRs. Existing BfN rejection and the 22/35 research score remain; neither funding, novelty nor scientific endorsement is inferred.

The audits found two implementation mistakes in protocol v1: velocity `gap` was treated as missing density, and the recorded biological discrimination threshold was omitted. Source files sharing quarter-hour timestamps are real five-minute scans, not processing versions. Corrected **density-v2** preserves finite density with positive reflectivity support, requires finite discrimination values, zeroes values below the recorded threshold, and averages within-slot scan profiles. Missing discrimination is missing, not zero. Same complete five layers and 75% slot coverage remain.

| October / Protzel | v1 nights | Animal-density support only | v2 bird-discriminated nights | v2 with lag |
|---|---:|---:|---:|---:|
| 2021 | 5 | 30 | 9 | 5 |
| 2022 | 3 | 30 | 4 | 0 |
| 2023 | 0 | 27 | 1 | 0 |

Thus the original blocked result did not establish that the archive lacked density. The corrected conservative bird target still lacks enough nights. No missing values were invented and no gate was relaxed to obtain a score. Original artifacts remain in Git commit `53d8e63`. Regression tests cover quality semantics, threshold boundary, scan averaging, exact coverage boundary, midnight grouping, units and wind sign.

Primary correction evidence: [vol2bird releases](https://github.com/adokter/vol2bird/releases), [bioRad workflow](https://adokter.r-universe.dev/bioRad/doc/bioRad.html). These are automated checks, not expert validation.

## Existing data and reuse priorities

| Family | Existing material | Concrete use / remaining access |
|---|---|---|
| Prepared European radar benchmark | [FluxRGNN dataset](https://zenodo.org/records/6874789), 269.7MB data archive; omit29.2GB results | Reuse published density/missingness, weather and preprocessing; run transparent baselines first. Original [code archive](https://zenodo.org/records/6921595). |
| Curated continental event | [ecog-04003](https://zenodo.org/records/1172801), autumn2016,84sites/70afterQC;393MB processed profiles | Independent QC reference and geographic transfer test; filtering YAML explicitly documents exclusions. |
| Broad radar archive | [Aloft](https://aloftdata.eu/faq/), BALTRAD2012onward, UvA2008–2023 varying coverage | Station-season catalog and variable-specific QC, then ingestion with actual publication times; CC0, daily updates with delay. |
| Species observations | [EuroBirdPortal](https://www.eurobirdportal.org/ebp/en/help/), [DDA](https://www.dda-web.de/ornitho/datennutzung), [eBird](https://support.ebird.org/en/support/solutions/articles/48000838205-download-ebird-data) | Effort-aware phenology priors; request extracts via published procedures. Public maps are not raw-data licenses. |
| Historical ringing | [EURING](https://euring.org/data-and-codes/obtaining-data) and Migration Atlas | Long-term timing/connectivity; bounded application and redistribution terms, not nightly aerial abundance. |
| Tracking | [Movebank archive](https://www.movebank.org/cms/movebank-content/data-repository) | Study-specific licensed routes/timing validation; avoid counting tagged animals as regional density. |
| Weather | [ERA5](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=documentation), archived issue-time runs | ERA5 for historical oracle comparison; true operational test requires forecast runs available at issuance, flight-layer weather and provenance. |
| Existing service | [FlySafe](https://www.flysafe-birdtam.eu/) | Public operational comparator and collaboration context; no scraped feed or claim EuroBirdCast invented European forecasting. |
| Publications | Species, departure, radar-calibration and model papers | Extract testable priors with citation/time/region; papers are evidence, not fabricated measurement rows. |

This is an inventory of major relevant families, not a claim to have ingested every European dataset or all historical literature. Each new family must improve the same unseen-year/site comparison or provide independent validation. Incremental reproducibility can be useful even without algorithmic novelty.

## Contacts and actual next decisions

[Six verified contacts and two unsent personalized drafts](eurobirdcast-contacts-2026-10-08.md). Start with Peter Desmet (INBO/Aloft) for corrected QC and suitable periods; Judy Shamoun-Baranes(UvA) for benchmark relevance; Heiko Schmaljohann(Oldenburg) for departure ecology. DDA, EURING and Sarah Davidson(Movebank) address distinct permissions and validation needs. No delivery was recorded. No BfN follow-up.

The real-test success criterion is an independently reproducible comparison plus an explicit next scientific question. It is not a new dose, inflated score or sent email. Operational completion still requires fresh radar/weather ingestion, saved issue timestamps, prospective errors, additional seasons/sites and expert review.

## Quellenmeldung

Primary pages actually inspected: Aloft/VPTS, vol2bird, bioRad, FluxRGNN/code/preprocessing, Zenodo6874789/1172801, and the six official contact routes. Source-register updates are delegated to the librarian using the sanctioned CLI. New yield: corrected executable QC, existing reusable European benchmark, six specific expertise/access routes. No demand, endorsement or data permission inferred.

## Amélie workflow accounting

Adapted the existing-project workflow explicitly: preflight and memory → independent data/math/contact research → merge → conservative reviewer → executable experiment → librarian → validation. No new-dose packaging or new-idea tally is appropriate here. One existing dose developed; zero new doses, zero new graves, six verified contact routes, two unsent drafts, eight newly registered primary sources. The independent reviewer retained the 22/35 research status and required clear separation of animal-density support from bird discrimination. Full source check passed with 291 total entries. This is evidence of a useful internal correction, not yet evidence that a recipient wants the project.

## Executed European comparison

Actual downloaded prepared data, source CC BY4.0: **61,881** common eligible nighttime radar-hour records, **21** shared stations across Germany/Belgium/Netherlands. Train2015(22,480rows), tune2016(21,184), test2017(18,217). Source tables contain22 sites; evaluation uses the common station intersection. Separate station models, annual/hourly seasonal terms, training-only standardization, ridge penalties1/10/100 selected on2016. No new neural model and no claim to reproduce the original study's metrics.

| Model | 2017 log-MAE | MAE birds/km² | RMSE birds/km² |
|---|---:|---:|---:|
| Station log-climatology | 0.8582 | 6.8610 | 13.3701 |
| Seasonal history | 0.7925 | 6.4959 | 12.6486 |
| Season + ERA5 weather | 0.6606 | 5.8118 | 12.2828 |

Weather reduced held-out log-MAE by **16.6%** against seasonality in this selected historical comparison. This is positive evidence for weather covariates here, not an operational forecast, statistical-significance claim, present-day transfer result, or proof of benefit from ringing/tracking/species knowledge. Upstream preprocessing is inherited; future raw-data validation remains necessary. Independent mathematical review passed masks and chronological fitting.

Reproduce: `python3 07-demos/eurobirdcast/benchmark/run.py`. First run fetches bounded ZIP members; later runs use cache, source CRC and per-member SHA-256. [Method and results](../07-demos/eurobirdcast/benchmark/README.md). The frontend displays these measured errors above the separate Protzel raw-data diagnostic.

## Frontend map priority

User steered the outcome to a clear observation-based map. Delivered a seven-day historical replay (1–7 October2017),21 radar sites,168 hourly frames and1,351 available nighttime observations. Circles summarize estimated integrated density; fixed-length arrows show measured aggregate bearing from bird_u/bird_v. No invented tracks or between-station connections. Independent data review,5map tests and focused browser coverage accompany the demo. Research and contacts remain behind an expandable panel. [Map method](../07-demos/eurobirdcast/map/README.md).

Final verification: `npm run lint` and production build pass;757 Vitest tests,23 Python tests (13 raw forecast /5 European benchmark /5 map) and15 browser tests pass. Rendered map inspected visually; new browser coverage exercises date selection, keyboard time navigation, playback/pause,21 readings, source attribution and German controls. A nested-summary test selector was corrected; scroll-restoration checks now wait for fonts before recording the initial position. No scientific data gate was weakened.

Nach Integration des parallel entstandenen Constraint-Release-Workflows:760 Vitest-Tests plus23 Python-Tests bestanden; Lint ebenfalls grün. [Lehren für die nächsten Runden](../06-suche/eurobirdcast-next-rounds.md) hält Fehler, Korrekturen und den konkreten Neustart fest.

Demo-Politur: verifizierte Stationsnamen, segmentierte Standort-Zeitdiagramme mit Abdeckung und eigener Skala, Nachtwiedergabe, große Kartenansicht und prominenter Forschungsdank. Energiebetreiber werden zu offenen Monitoring-/Schutzdaten aufgefordert; keine unbelegte Schuldzuweisung. 18 Browser-Tests,760 Vitest-Tests,23 Python-Tests, Lint und Build bestanden. Große Karte nach visuell erkanntem Containing-Block-Fehler per Portal korrigiert;21 Marker tatsächlich sichtbar, Desktop/Mobil geprüft. Quellenregister292 Einträge.

# Historical European bird movement map

Run `python3 07-demos/eurobirdcast/map/prepare.py` from the repository root.
The first run uses the benchmark's bounded ZIP-member downloader; existing
`/tmp/eurobirdcast-europe-members` data make this completely offline.
Output: `src/data/birdMovementMap.json`, 21 common stations and 168 aligned UTC
hours, **1–7 October 2017**. This is an observation replay, not current data.

Published prepared data: Lippert, Kranstauber, Forré and van Loon (2022),
[Zenodo 6874789](https://doi.org/10.5281/zenodo.6874789), **CC BY 4.0**.
Source member CRC, byte size and SHA-256 are embedded. Code here is CC0.
Station coordinates come from the 2017 static table. Sites must be observed
in all three source annual tables; this is a coverage selection, not a test-target
selection. The map uses density `birds_km2`, and **ground movement** `bird_u`
(eastward) / `bird_v` (northward), in m/s. It never substitutes ERA5 wind vectors.

Each station has one reading per global time index. Source daytime synthetic
zeros are hidden as `daytime`. Source missing observations remain `missing`,
with null values. Nighttime exact-zero density is retained if valid. Density and
vector finiteness are checked separately, after the common source missing flag;
both vector components must be finite to draw a direction. Upstream QC is
inherited and has not been independently biologically validated.

Arrows show aggregate local movement, not tracked individuals, inferred routes,
or measured links between radars. Neither the station map nor the interpolation
between animation frames establishes continuous geographic observation coverage.

Offline tests:
`python3 -m unittest discover -s 07-demos/eurobirdcast/map -p 'test_*.py'`.

[EuroBirdCast project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)

## Frontend exploration

The map now includes verified names from the [Aloft OPERA-derived radar catalog](https://aloftdata.eu/radars/), station selection by map click or dropdown, a separate weekly density chart, recorded/daytime/missing counts, and a shortcut to the largest recorded value. Chart traces split at absent observations; the vertical scale varies by station and is labeled. Missing periods are not reconstructed. Playback can skip frames without usable observations while the slider retains every hour. An expanded map supports Escape, keyboard focus return and its own time control. Popup values are inserted as text nodes.

Research teams receive prominent credit. The call for energy operators to open monitoring and mitigation evidence is a request for accountability, not an allegation that this radar dataset measures collisions or establishes liability.

## Review and recent real-data acquisition — 8 October 2026

Downloaded two actual Aloft BALTRAD daily CSVs for **5 October 2026**:
Protzel (`depro`, Germany) and Wideumont (`bewid`, Belgium), 7,200 layer rows
per station. The existing density-v2 gate finds **0 / 1,440** eligible rows
in the 1,000–2,000 m band at Protzel, versus **1,440 / 1,440**, covering 96
nominal quarter-hour timestamps, at Wideumont. This is a row-level audit;
complete-profile aggregation and biological validation remain necessary before
adding recent estimates to the movement map. The requested Dutch `nldbl`
object returned HTTP 404, which does not imply no migration.

See `recent-acquisition-audit.json` for direct URLs, SHA-256, download sizes,
retrieval times, server headers and five actual eligible Belgian rows. The
files use VPTS 1.0: absent `height_reference` means sea level, according to the
[VPTS specification](https://aloftdata.eu/vpts-csv/). Bucket data are CC0;
[Aloft warns they are not generally quality controlled](https://aloftdata.eu/faq/).
Object Last-Modified is retained separately from measurement/retrieval times;
it does not establish first publication time. No live-feed claim is made.
Raw CSV files are temporarily in `/tmp/bird-<radar>-20261005.csv`.

The frontend review adds an optional common station-chart scale, exact selected
hour readings, station CSV export with citation and explicit missing cells,
playback speed controls, a fullscreen legend, and consistent restart at the
last frame. Range controls expose the actual UTC timestamp to assistive tools.

## Recent real observations and forecast check — 8 October 2026

`python3 07-demos/eurobirdcast/map/recent.py` downloads (bounded, 26 MB cap per file, cache `/tmp/eurobirdcast-recent-cache`)
Aloft BALTRAD daily VPTS files for 1–6 October 2026 (19 radars, CC0) and writes `src/data/birdRecentMap.json`.
Same density-v2 gate and 1000–1800 m five-layer rule as `../forecast/prepare.py` (the gate function is imported, not copied).
Statuses: `observed` (gate passed), `unscreened` (density present, `sd_vvp` missing: no rain test, shown dashed, no arrow),
`daytime` (sun above −6°), `missing`. Density is the **1–2 km layer**, not the column, so it is not comparable with 2017.
Of 19 radars only bejab, bewid and nldhl have screened hours in quantity.

`python3 07-demos/eurobirdcast/map/forecast_check.py evaluate|issue|score`: ridge forecast of the change in log(1+density),
trained on the 2017 week, features trend / upwind neighbour / hour of day. Results, all variants, in `src/data/birdForecastCheck.json`.
`issue` archives a forecast (with hash) before its data exist; `score` fetches the later files (404 = pending, never zero).
Tests: `test_forecast_check.py` (leakage, missing hours, upwind sector, zero clamp, gate rules).

## Usability, interaction and navigation polish — 8 October 2026 (third round)

- **Station navigation**: clicking a row in the radar readings table highlights the station, pans the map, opens its popup, and selects it in the weekly chart.
- **Precision playback**: added 1-hour step buttons (`◀ −1 h` and `+1 h ▶`) and a single-click shortcut to the week's peak migration hour (`⚡ Peak wave` / `⚡ Zugspitze`). Also available in fullscreen expanded mode.
- **Directional & speed clarity**: bearings include 16-point cardinal directions (`SW (215°)`) and ground speed converted to km/h (`42 km/h`) across vectors, popups, tooltips, and the readings table.
- **Week overview strip**: rendered day boundary lines and date labels (`1. Okt` .. `7. Okt`) under the overview bar chart so users see the synoptic waves at a glance.
- **Interactive chart scrubbing**: clicking anywhere on the weekly station density chart jumps the map directly to that hour. Station peak density and time are highlighted.
- **Verified**: 13 browser tests, 764 Vitest tests, 16 map Python tests; lint and production build green.


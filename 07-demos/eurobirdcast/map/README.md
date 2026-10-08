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

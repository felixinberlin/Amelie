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

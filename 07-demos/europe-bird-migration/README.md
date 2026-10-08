# European bird-migration map — bounded demo

The frontend Manifest section contains an interactive Leaflet map: hourly playback, three altitude bands, station popups and a keyboard-accessible readings table. The snapshot is real Aloft BALTRAD data from Protzel, Dresden and Ummendorf, 1 October 2023 (UTC). It is a European map with a three-station German sample, not Europe-wide coverage.

Run `npm ci && npm run dev`, open `/manifest/`, scroll to the new mathematics section. `npm run build` verifies compilation. Regenerate the snapshot from repository root with `python scripts/eurobird-demo/fetch.py` (Python standard library, network required). Source URLs, raw SHA256 checksums and byte counts are retained in `src/data/birdMigrationSample.json`.

Aggregation: for each UTC hour and height band, discard gap-flagged rows, missing/nonfinite density or horizontal velocity, and negative density. Average remaining density values equally; weight u/v by density. This diagnostic is neither a complete vertical integral nor a calibrated migration traffic rate. Counts expose incomplete sampling; equal weighting is not a duration/coverage correction. Lines have fixed display length and indicate local ground-motion direction only. They do not reconstruct routes or predict migration. Near-ground contamination and processing differences require further quality control. Missing stations are not zero migration.

Data: https://aloftdata.eu/faq/ (portal states CC0); metadata https://aloftdata.eu/radars/. Basemap: OpenStreetMap attribution shown in the map, online tiles required. No automated tile download. Station readings remain accessible without map tiles.

Research found existing CROW (https://crow.aloftdata.eu/), FlySafe (https://ibed.uva.nl/content/news/2026/08/flysafe-service-to-observe-bird-migration.html), and Vogelradar (https://vogelradar.com/). This demo claims no novelty. A next agent should compare these services and test whether a clear educational use remains underserved before extending geographic coverage.

The old EuroBirdCast grave concerns turbine-specific curtailment recommendations. This map experiment neither changes that decision nor supports shutdown advice. No Kakeya theorem or new reconstruction method is implemented. The purpose is to make movement visible and let people explore a real dataset.

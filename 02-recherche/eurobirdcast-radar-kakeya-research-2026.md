# EuroBirdCast — radar aeroecology, open European VPTS data, and Kakeya (research handoff)

**Research date:** 2026-10-08  
**Status:** Research input for BIB / Bibliothekar; **not** an approved Dose, delivered proposal, implemented feature, or proof of novel intellectual property.  
**License of this dossier:** CC0 (Amélie convention). External datasets, code and papers retain their own respective terms.  
**Scope:** Evidence, prior art, testable hypotheses, source handoff; no automated registration or outreach.

## 1. Executive finding

EuroBirdCast asks whether we can reconstruct and eventually forecast *large-scale bird migration* using weather radars across Germany and Europe. The immediate research opportunity is **not** an untested use of the newly announced Kakeya results: it is the existing, accessible European vertical-profile time-series (VPTS) data, including a historical CC0 dataset and an ongoing updated data portal.

**Most important correction to earlier concept discussion:** We do not need raw weather-radar scans merely to begin a multi-radar feasibility study. Public **processed** radar products already describe biological-target density, movement direction and speed by time/altitude. They do *not* provide individual bird trajectories, bird species, exact paths between radars, or complete bird-versus-insect separation.

**Aloft** offers BALTRAD VPTS from 151 radars, 2012 onward, with daily updates; expected processed data lag is approximately 24–48 h, so do not market as real-time or instantaneous without confirming current conditions. The fixed **Zenodo version 2 (Jan 2025)** covers 151 radars at 140 locations in 18 countries, variably from 2012–2023, approximately 47.4 GB in country archives. The historical version and living data service have different time scopes. Source: [Aloft FAQ](https://aloftdata.eu/faq/), [Zenodo](https://zenodo.org/records/14711024), [Desmet et al., Scientific Data (2025)](https://doi.org/10.1038/s41597-025-04641-5).

## 2. Primary sources and access paths

| Source | Direct URL | What it contains | Caveat / action |
|---|---|---|---|
| Desmet et al. 2025, *Biological data derived from European weather radars* | https://doi.org/10.1038/s41597-025-04641-5 | Peer-reviewed methods, fields, 200 m altitude bins, typically 5/15-minute sampling, UTC timestamps, limitations, radar coverage | Read methods and validation before deciding on model |
| BALTRAD_VPTS v2 (INBO, Zenodo) | https://zenodo.org/records/14711024 | Historic CC0 VPTS for 151 radars / 18 countries; country archives, `coverage.csv`, `vpts-csv-table-schema.json` | Large archive; start with metadata and a small geographic/month subset |
| UVA_VPTS supplement | https://doi.org/10.5281/zenodo.14711244 | Complementary Belgium/Germany/Netherlands dataset | Check overlap and duplicated stations; different processing provenance |
| Aloft portal FAQ | https://aloftdata.eu/faq/ | Daily-updated BALTRAD processed VPTS, update cadence, exact directory and file formats | Verify accessibility and freshness at runtime |
| Aloft radar metadata | https://aloftdata.eu/radars/ | Radar identifiers, locations and supporting information | Inspect metadata and availability before geographic reconstruction |
| Aloft browser | https://aloftdata.eu/browse/?prefix=baltrad/monthly/ | Browsable monthly VPTS files; HDF5/daily/monthly paths | Monthly compressed CSV is recommended by portal |
| vol2bird | https://github.com/adokter/vol2bird | Existing software extracting bird/biological signals from weather radar | Do not reinvent classification; review false positives and outputs |
| bioRad | https://github.com/adokter/bioRad | Radar aeroecology R tools | Prior art and baseline |
| vptstools | https://github.com/enram/vptstools | Processing VPTS and supporting analysis | Prior art and baseline |
| OpenAI math overview, family 074 | https://github.com/openai/math/blob/main/overview.tex | Claims: 3D Kakeya maximal conjecture; 4D Kakeya Hausdorff dimension | Very recent **preprints/claims**, not validated engineering algorithms |
| OpenAI 3D Kakeya manuscript | https://github.com/openai/math/blob/main/preprints/The-Kakeya-maximal-conjecture-in-three-dimensions-September-23-2026/paper.pdf | Claimed tube maximal-operator bound in 3D | Independent verification required; no derived EuroBirdCast model |
| OpenAI 4D Kakeya manuscript | https://github.com/openai/math/blob/main/preprints/Every-four-dimensional-Kakeya-set-has-full-Hausdorff-dimension-September-24-2026/paper.pdf | Claimed full Hausdorff dimension in 4D | Not a 4D bird-radar model |
| OpenAI math corrections log | https://github.com/openai/math/blob/main/history.md | Withdrawals and revisions in October 2026 | Monitor revisions before citing mathematical results |

**Verifiable VPTS characteristics:** density, speed, direction of biological targets in radar coverage volumes, stratified by radar, UTC datetime and height; typically 200-m height resolution. Some products contain more detailed metrics and quality columns; use the provided schema, not assumed field names. Data derive from OPERA radar measurements with extraction optimized for birds. See the [paper](https://doi.org/10.1038/s41597-025-04641-5).

**Access sketch (do not run a bulk download first):** open Zenodo `coverage.csv` and the JSON schema; identify 2–4 geographically adjacent radars in Germany/Netherlands/Belgium; download one *monthly* compressed CSV for each via Aloft; normalize timestamps into UTC, altitude units, velocity and quality flags. For the fixed Zenodo dataset the Germany country archive is ~7.9 GB; a full ingestion is unnecessary for a pilot.

## 3. Where the new Kakeya mathematics might intersect

The classical Kakeya question asks about sets containing unit line segments in every direction. Harmonic analysis studies directional concentrations of waves and Fourier transforms. The September/October 2026 OpenAI release lists, under **result family 074**, (a) a 3D maximal-operator estimate for thin tubes, and (b) full Hausdorff dimension for four-dimensional Kakeya sets; see primary manuscript links above. These are **mathematical statements about geometric estimates**, not radar-tracking techniques.

**Speculative transfer path only:** Directional geometry and harmonic-analysis bounds may eventually inform proofs for certain inverse problems, wave reconstruction, directional regularization or sparse angular measurements. A useful bridge would require (1) an explicit observation/forward operator modeling VPTS or raw radar measurements, (2) a derived inequality relevant to its stability or error bounds, (3) a constructive computational algorithm and (4) competitive empirical benchmarks.

**Critical anti-hype rule:** VPTS are *aggregated processed biological target profiles*, not a set of raw coherent wave observations or thin Euclidean tubes. Never claim Kakeya already improves bird/rain discrimination, interpolates radars, identifies migration corridors, predicts birds, or yields fewer radars. The 4D theorem does not automatically describe 3D space + time tracking. Treat Kakeya as an optional theoretical research watch, not a product dependency.

## 4. Existing work / occupied territory

- **Aloft, vol2bird, bioRad and vptstools** already supply data processing and tools; a generic pan-European bird migration map/replay is not necessarily novel.
- **ENRAM / GloBAM** and the published Desmet et al. datasets establish this as an existing radar-aeroecology research field.
- **FlySafe and related operational migration services** are known prior-art search targets. Independently verify current operating geographies, licensing, precision and target markets before any claim of uniqueness.
- The missing niche might instead be **transparent, uncertainty-aware interpolation of missing-radar/altitude coverage**, **reproducible cross-border validation**, or a **bird-collision conservation use case**. These are hypotheses, not validated gaps.
- Do not merge this directly into the already delivered `glasanflug-ampel` Dose: that project scores *glass facade hazards*, not bird migration forecasts. A scientifically grounded risk overlay could be studied later, but night migration intensity cannot directly predict facade mortality.

## 5. Research design for EuroBirdCast

### Research questions
1. At a withheld radar site, can a model predict biological-target density/direction/speed by height from neighbouring radars plus meteorological conditions?
2. Can a model forecast profiles 1, 3 and 6 hours ahead better than simple persistence/advection/seasonal baselines?
3. How does accuracy degrade with distance, terrain, weather, missing stations and altitude?
4. Does bird/insect or precipitation contamination dominate uncertainty, and do quality columns allow useful filtering?
5. Are there scientifically defensible applications in conservation (e.g., migration intensity notices) without overclaiming species-level tracking?

### MVP, measurable and modest
- **Data slice:** choose 2–4 adjacent radar sites, one spring and one autumn period; inspect 2020–2023 historical coverage and gaps before choosing dates. Include Germany and a bordering country only if licensing/coverage align.
- **Ingest:** `coverage.csv` + schema; one-month VPTS per radar; UTC, provenance, altitude, observation quality, null/invalid-value treatment and license metadata.
- **Baselines:** station seasonal median, last-known-value/persistence, wind-advection-informed baseline if meteorology is obtained and licensed.
- **Candidate methods:** geospatial interpolation with time/altitude covariates; Gaussian-process or state-space model; simple transport/advection model. Complexity justified only by outperforming baselines.
- **Validation:** leave-one-radar-out spatial holdouts; chronological train/test partitions (no random adjacent-time leakage); hold out complete migration nights; evaluate height-specific MAE/RMSE, directional circular error, calibration/interval coverage and event detection precision/recall. Report each radar and season separately.
- **Deliverables:** reproducible dataset manifest, small open baseline notebook/script, quality report, maps of uncertainty, clear negative findings and an evidence-backed go/no-go memo. Never report "birds detected" from unspecified biological reflectivity without caveats.

### Explicit non-goals
Raw per-bird tracking; species ID; zero-latency service; weather-radar beam triangulation from VPTS alone; treating radar coverage circles as independent continuous bird-position measurements; claiming a Kakeya-derived solver without derivation.

## 6. Failure modes and gates

1. **Data gaps and incomparable stations:** check `coverage.csv`, radar calibration, changes to processing, metadata and site-level coverage first.
2. **Target contamination:** the processed targets are *predominantly birds*, not pure bird labels; rain and insects can contaminate signals. Quantify uncertainty.
3. **Inadequate spatial observability:** sparse radar volumes do not recover exact flight paths; reconstruct only aggregate flow with uncertainty bounds.
4. **Temporal leakage:** nearby observations are autocorrelated; validate across nights and stations.
5. **Existing services already solve use case:** assess ENRAM, Aloft, FlySafe, BirdCast-type work before proposing a Dose.
6. **Source drift:** Aloft is updated daily; distinguish historical frozen Zenodo release from living data and archive retrieval dates.
7. **Mathematical-result drift:** OpenAI updated/withdrew several other preprints 2026-10-07; independent verification of the family-074 claims remains required.
8. **Research-use and distribution rights:** Zenodo paper describes CC0 for the deposited datasets; check current portal terms and third-party meteorological inputs separately.

## 7. What BIB should do next

1. **Bibliothekar:** inspect `src/data/quellen.json` for source IDs/duplicates; register/update primary sources using `npm run quellen -- add|log|rate` according to `06-suche/amelie-quellen-register.md`. Regenerate the derived `06-suche/amelie-quellen.md` using the CLI, then `npm run export:data` and `npm run lint`. This PR deliberately does **not** edit the generated register.
2. **Researcher:** perform occupied-territory test: Aloft tools, ENRAM/GloBAM, operational FlySafe and similar European forecast products; identify actual unsolved tasks rather than starting a redundant public map.
3. **Data agent:** fetch only schema/coverage metadata and a tiny geographically coherent VPTS sample; log source/version, license and checksums. No bulk transfer by default.
4. **Scientific reviewer:** define the correct observable, uncertainties, holdouts and benchmarks; don't conflate a biological-target profile with a path or species.
5. **Math reviewer (optional):** read family 074 primary proofs and check whether *any* stability theorem applies to the observation operator. Record **no known practical transfer** until a derivation and benchmark exist.
6. **Idea reviewer:** only after prior art and baseline metrics decide whether this merits an Amélie candidate/Dose, recipient research, or a graveyard finding. Never contact institutions automatically.

### Proposed first ticket
**EuroBirdCast: historical VPTS cross-radar feasibility baseline**

Done when: a dataset manifest covering at least three neighbouring radar IDs and a one-month window exists; one station is held out; a persistence/seasonal baseline and one spatial reconstruction baseline are compared; errors and uncertainties are tabulated by altitude; the README reports quality filters, leakage controls, observed failure modes, data rights and prior art. No front-end demo or delivery until this passes expert review.

## 8. Quellenmeldung (for BIB; do not manually edit generated Markdown)

These reports document review of their described public pages, **not** a full scientific audit of all linked publications. Bibliothekar should check existing register IDs and downgrade evidential status as appropriate.

QUELLE NEU: BALTRAD VPTS Zenodo v2 | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://zenodo.org/records/14711024 | note=151 radars, 18 countries, variable 2012–2023 CC0 processed biological vertical profiles; includes schema and coverage metadata; Kategorie datensatz, Rollen evidenz/ideenquelle.
QUELLE NEU: Aloft radar data portal | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://aloftdata.eu/faq/,https://aloftdata.eu/browse/?prefix=baltrad/monthly/ | note=Daily-updated processed BALTRAD VPTS; approximate 24–48 h lag, HDF5/daily/monthly access; Kategorie datensatz, Rollen evidenz/ideenquelle.
QUELLE NEU: Desmet et al. 2025 European radar biological data paper | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://doi.org/10.1038/s41597-025-04641-5 | note=Peer-reviewed methods/fields, target limitations, 200m height bins and typical 5/15-minute profiles; Kategorie referenzsammlung, Rolle evidenz.
QUELLE NEU: OpenAI math Kakeya family 074 | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://github.com/openai/math/blob/main/overview.tex,https://github.com/openai/math/blob/main/history.md | note=2026 claims in 3D/4D Kakeya, no established radar engineering transfer; paper proofs not yet audited; Kategorie referenzsammlung, Rollen evidenz/ideenquelle.
QUELLE NEU: vol2bird | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://github.com/adokter/vol2bird | note=Established biological extraction code; audit source and outputs in follow-up; Kategorie messverfahren.
QUELLE NEU: bioRad | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://github.com/adokter/bioRad | note=Existing radar aeroecology tools; prior-art baseline; Kategorie referenzsammlung.
QUELLE NEU: vptstools | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://github.com/enram/vptstools | note=Existing VPTS tooling to evaluate before implementation; Kategorie referenzsammlung.

**Suggested re-check:** 2026-11 for data access; revisit Kakeya status when independently reviewed. Research handoff only; no accepted performance claims, new Dose, or source-register mutation in this PR.

# EuroBirdCast — CC0 research scaffold

A deterministic TypeScript kernel for migration traffic rate (MTR) in an explicitly selected height band, plus an experimental threshold scenario. This is a synthetic, offline scaffold, not an operational migration forecast.

From the repository root:

```sh
npx vitest run 07-demos/eurobirdcast/engine.test.ts
```

`integrate(profile, band)` requires provenance, license, UTC timestamps, matching height references and disjoint layers. It intersects each accepted layer with the requested band and sums density × speed × thickness in kilometres. Units: birds/km³ × km/h × km = birds/km/h. Uniform density and speed within a layer are assumptions. This is scalar traffic through an abstract transect, not direction-specific rotor interception.

A missing, rain-rejected or absent layer produces `insufficient-coverage` and a null MTR. Zero density with full coverage produces zero MTR. AGL and AMSL must be reconciled outside the kernel using surveyed elevations; no silent conversion occurs.

`scenario(report, threshold, durationHours, baselineMw)` uses an explicitly supplied experimental threshold. It reports integrated passage per kilometre and hypothetical energy foregone at a constant counterfactual power baseline. It assumes full curtailment and constant migration during the supplied interval. It is not actual turbine production, collision probability, birds saved, a legal rule engine or a control recommendation. Missing profiles must never be interpolated silently.

## Next ticket / acceptance gate

1. Archive a real VPTS excerpt with original URL, retrieval time, license, SHA-256 and radar metadata. No real measurement fixture is claimed in this scaffold.
2. Build an adapter for VPTS missing-value conventions, altitude datum, quality fields and speed definition. Reject mismatches rather than coercing unknown fields.
3. Have an independent analyst reproduce the band MTR by hand and compare with bioRad on the same accepted layers.
4. Validate timestamps and layer quality with a domain expert; add original rain/contamination flags to the report.
5. Confirm a partner actually needs the portable export. BIRDSAFE/HiRAD may already provide it. Stop expansion if they do.

The new project has not been sent to anyone. The former BfN rejection remains valid. EuroBirdCast is a working title, unaffiliated with BirdCast.

[Project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast) · [Research](../../02-recherche/eurobirdcast-revival-2026-10-08.md)

License: CC0-1.0 for this scaffold and its synthetic tests. Third-party data and packages retain their own licenses.

## Bird Weather direction (8 October 2026)

The new forecasting/fusion experiment is in [forecast/README.md](forecast/README.md). It joins real radar and ERA5 summaries, preserves provenance and blocks model fitting when quality or chronological coverage is inadequate. This MTR core remains a separate unit-tested foundation; it is not a migration forecasting model.

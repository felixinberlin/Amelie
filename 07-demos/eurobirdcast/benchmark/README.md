# EuroBirdCast: real European benchmark

This independent, standard-library experiment uses published prepared European
radar and ERA5 data from Lippert, Kranstauber, Forré and van Loon (2022),
[Zenodo 6874789](https://doi.org/10.5281/zenodo.6874789), **CC BY 4.0**.
Code here is CC0; the input data keep their original license and attribution.
It is a simple baseline/weather ablation, not a reproduction of FluxRGNN.

```sh
python3 07-demos/eurobirdcast/benchmark/run.py
```

The first run requires public network access. HTTP Range downloads only six CSV
members of `data.zip`: three autumn dynamic tables and three station tables,
approximately 25 MB compressed instead of the 269.7 MB archive. The cache lives
in `/tmp/eurobirdcast-europe-members`. Later runs reuse it. Every decompressed
member is validated against ZIP size and CRC and recorded with SHA-256 in
`src/data/birdEuropeanBenchmark.json`. The top-level provenance digest hashes
the ordered member metadata, **not the entire archive**. No raw input is committed.

The source contains 22 radar sites in Germany, the Netherlands and Belgium during
autumn 2015–2017. This comparison evaluates **21 sites** marked observed in all
three annual static tables; `nldbl` is not observed in every year. Selection uses
static coverage flags, not held-out target values. Use `birds_km2` (density),
not `birds` (cell total). Evaluation
requires source `night=True` and `missing=False`, finite nonnegative density and
finite weather. Valid nighttime zeros remain observations; source daytime zeros
are excluded. Each model sees the same eligible target rows.

Three separate models per radar: station log-climatology (training mean of log
density, not arithmetic historical average); ridge with annual
and hourly sine/cosine terms; same ridge plus ERA5 `u`, `v`, `t2m`, `tp`, `sp`,
`cc`. Fit on 2015; choose a shared ridge penalty from 1, 10 and 100 by pooled
2016 log MAE; refit on 2015–2016; evaluate 2017 once. All feature standardization
uses that fit's training data only. Targets are `log1p(birds_km2)`; predictions
are clipped at log zero then inverted. Metrics describe pooled eligible radar
hours, not independent samples. No significance claim or confidence interval.

ERA5 target-hour weather makes this an **oracle-weather historical benchmark**.
It is not an issue-time operational forecast or evidence of Germany-wide skill.
Published upstream preprocessing/QC is inherited, without raw-radar validation.
The original neural study has different sequence and validation protocols;
[its code release](https://doi.org/10.5281/zenodo.6921595) remains the reference
for reproducing FluxRGNN. This experiment adds no ringing, tracking or citizen
science data and does not claim to contain the complete historical record.

[EuroBirdCast project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)

## Executed result, 8 October 2026

Eligible training/validation/test radar hours: **22,480 / 21,184 / 18,217**,
61,881 in total. These are radar hours across 21 sites, not independent nights.
The prepared archive contains no eligible nighttime exact-zero density values;
the mask nevertheless retains them if present. This property is inherited from
the source and is not proof that birds were always present.

| Model | 2017 log MAE | MAE (birds/km²) | RMSE (birds/km²) |
|---|---:|---:|---:|
| Station log-climatology | 0.858203 | 6.860963 | 13.370131 |
| Seasonal and hourly terms | 0.792467 | 6.495889 | 12.648567 |
| Same terms + ERA5 weather | 0.660558 | 5.811755 | 12.282796 |

Weather has **16.65% lower held-out log MAE** than the seasonal/hourly model in
this defined comparison. This is exploratory oracle-weather evidence, not an
operational accuracy claim. Validation selected alpha=1 for seasonal and alpha=10
for weather. No test-year penalty selection. The independent mathematical review
confirmed physical-value columns and the mask/split; raw-source QC remains inherited.

Offline guard tests:
`python3 -m unittest discover -s 07-demos/eurobirdcast/benchmark -p 'test_*.py'`.
They cover missing versus true zero, daytime imposed zeros, nonfinite weather,
station intersection and test-target changes leaving validation selection unchanged.

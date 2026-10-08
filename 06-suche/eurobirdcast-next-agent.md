# EuroBirdCast — questions and handover for the next agent

Written 8 October 2026. The user ended the session and requested this handover. **Do not continue research or implementation in this session.** These are questions for the next authorized round, not promises or completed work.

## Start from what works

[Published demo](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast). Last functional commit: `4bb29a3a`. Deployment run `37833413727` succeeded. The published version was tested in a real browser: station chart selection, 21 radar markers, fullscreen viewport, playback, Escape/focus return, researcher credit; no client errors.

The user prioritizes a beautiful, science- and observation-based movement map over a perfect forecasting system. Keep the map first and the research expandable. Researchers receive credit; the call to energy operators is for open monitoring/mitigation evidence, without unsupported blame. No emails were sent.

Current data: 21 radar sites in Germany, Belgium and the Netherlands; 168 hours, 1–7 October 2017; 1,351 available nighttime observations. This is historical replay, not current migration or individual bird tracks. Source: Lippert et al. 2022, DOI 10.5281/zenodo.6874789, CC BY 4.0. Code is CC0.

Read [lessons and restart procedure](eurobirdcast-next-rounds.md), [real-system test](../02-recherche/eurobirdcast-real-test-2026-10-08.md), [map method](../07-demos/eurobirdcast/map/README.md), and [verified contacts / unsent drafts](../02-recherche/eurobirdcast-contacts-2026-10-08.md). Do not restart the entire literature search or replace the working demo with a plan.

## Questions, in priority order

1. **What is the smallest defensible step toward fresher observations?** Which German/European station-period has usable density and bird-motion fields, reliable timestamps and documented latency? Start with one bounded acquisition and compare it with the existing map schema. Save measurement, publication (when actually available), and retrieval times. A recent filename alone does not establish live access.
2. **Can the published source-quality rules be reproduced for that newer subset?** Distinguish density support, velocity gaps and biological discrimination. Missing `sd_vvp` is not proof of birds or zero migration. Ask Peter Desmet to review a concrete protocol only if the user authorizes outreach; the prepared draft is not a sent message.
3. **How much coverage does a new period genuinely add?** Report observed/daytime/missing counts per site, not just total rows. Preserve all time slots and genuine zeros. Do not connect radars with invented tracks or interpolate across absent observations. Check station changes, coordinates and height reference before combining years.
4. **Can users understand the current map without our explanation?** Try a small usability check: do they recognize the historical date, density units, local aggregate bearings, changing chart scales and missing observations? Improve the explanation and interaction before adding model complexity. Verify desktop, mobile and keyboard operation; test actual visible markers as well as controls.
5. **Would another season or region make the demo more informative?** Choose one additional, well-documented replay, such as spring versus autumn, with consistent processing. Define the selection before looking for dramatic events. Keep payload and download budgets bounded; reuse prepared datasets where appropriate.
6. **What independent observations could validate timing or direction?** Identify one licensed German NocMig, stopover, ringing or tracking dataset. Which observable can it test, with what effort and selection bias? It cannot automatically validate airborne abundance or species composition. DDA, EURING, Heiko Schmaljohann and Sarah Davidson have distinct access/expertise routes; do not send a generic mailing campaign.
7. **If forecasts are requested later, what information was available at issue time?** Archive weather forecast runs and radar publication/ingestion times prospectively. Existing ERA5 results are oracle-weather hindcasts. The historical 16.6% log-MAE reduction is neither operational skill nor evidence that species priors help. Test added sources one at a time on common held-out observations.
8. **Can the separate withheld-station experiment add useful evidence?** Read the constraint-release log before starting it. A fully withheld target station cannot supply its own training baseline. This proposed gap-reconstruction test was not executed by the map round; do not present the 2017 existing-site comparison as spatial transfer validation.
9. **What specific public evidence should energy operators release?** Define a usable monitoring/mitigation data schema or a concrete research question first. Radar density is not a collision measurement, shutdown rule or liability finding. Do not turn an accountability request into an unsupported accusation.
10. **Who actually finds this contribution useful?** The dose remains a research workbench at 22/35, with demand unconfirmed. Ask a bounded question backed by the working demo when contact is authorized. Preserve the earlier BfN rejection; no follow-up or bypass through another employee. Reuse existing European science without claiming first-of-kind novelty.

## Technical restart

- UI: `src/components/BirdMigrationDemo.tsx`, `BirdStationChart.tsx`; supporting research: `BirdForecastLab.tsx`, `BirdEuropeanBenchmarkPanel.tsx`.
- Data: `src/data/birdMovementMap.json`, `birdRadarNames.ts`, `birdEuropeanBenchmark.json`.
- Generators/tests: `07-demos/eurobirdcast/map/`, `benchmark/`, `forecast/`. Raw caches under `/tmp` are temporary and may be gone. Generators provide bounded reacquisition; do not commit raw archives.
- Last checks: 760 Vitest + 23 Python + 18 browser tests, Lint and production build passed. Browser tests serve `dist`; rebuild after UI edits. Expanded map uses a body portal because transformed ancestors broke CSS-fixed positioning.
- Git: fetch/check overlapping work first. Preserve disjoint changes. Update DE/EN dossiers, frontend data, export and protocol together for dose changes. Source-register edits go through the librarian CLI. No Vertex calls without renewed credits.

## Next-round completion criterion

Pick **one** question with an observable result. Deliver a working incremental improvement or a reproducible negative result, with provenance and relevant tests. Keep the published demo usable. Write what changed, what remains unknown, and the next bounded question; commit and push when authorized. Do not claim to have exhausted every possible dataset or scientific paper.

# Amélie: turn new mathematics into testable applications

Date: 2026-10-08. Executable handoff for the next command-line coding/research agent.

## Mission

Amélie exists to find new chances to make people’s lives happier. Investigate the current OpenAI math catalogue as a new source of those chances: less tedious work, more accessible tools, safer surroundings, healthier ecosystems, better learning, creative play and stronger community life. Identify concrete useful applications and test the best small opportunity using Amélie’s existing workflow. Begin with EuroBirdCast, then consider other domains. Deliver evidence and reproducible experiments, including negative findings. Do not build a new orchestration platform or generate hundreds of speculative ideas.

A useful chain is: mathematical claim → exact assumptions → applicable observation/computation → constructive method or useful bound → comparison with existing methods → recipient task and measurable benefit.

## Verified starting state

- Repository: https://github.com/felixinberlin/Amelie
- PR #180: https://github.com/felixinberlin/Amelie/pull/180
- Checked 2026-10-08: open, draft, unmerged, mergeable=true. Recheck before working.
- PR head branch: `research/eurobirdcast-kakeya-radar-2026-10`.
- Existing dossier: `02-recherche/eurobirdcast-radar-kakeya-research-2026.md` on that branch. Read it in full; its source reports are research inputs, not independently audited proofs.
- Math catalogue: https://github.com/openai/math/blob/main/overview.tex
- Corrections: https://github.com/openai/math/blob/main/history.md
- Source repository: https://github.com/openai/math

Do not treat earlier chat summaries, headline counts, result numbers or application suggestions as authoritative. Resolve them against the current catalogue and exact manuscript version. A catalogue entry is not independent validation. Keep proof status, implementation status, benchmark status and commercial relevance separate.

## Human benefit is the selection criterion

For every shortlisted opportunity answer: who benefits, what difficulty or unmet wish do they have, what becomes easier/safer/more enjoyable, and how would we observe that improvement? Include people affected indirectly, such as communities benefiting from conservation. Technical performance is evidence toward this purpose, not the purpose itself.

Look beyond efficiency and business: education, accessibility, civic participation, nature protection, creative tools and playful discovery are legitimate directions. Do not limit the search to EuroBirdCast or current projects. Let a new result suggest a previously impractical gift, then check the need, prior art and feasibility. Seek leverage from new mathematical techniques and constructive objects as well as headline theorems. An application may use an intermediate method even when the headline result itself has no direct product use.

Keep discovery open and experimental. Permit imaginative hypotheses, label them clearly, and turn promising ones into inexpensive tests. A technical success without a credible human benefit is not enough to package a Dose. Follow the existing reviewer rules: fun matters, but does not erase feasibility or evidence requirements.

## 0. Repository preflight

Work in the user's actual Amélie checkout; do not assume the historical local path is current.

```bash
pwd
git status --short
git remote -v
git fetch origin
gh pr view 180 --repo felixinberlin/Amelie --json state,isDraft,mergeable,headRefName,headRefOid,files
rg --files -g AGENTS.md -g SKILL.md -g package.json
```

Read root and applicable nested `AGENTS.md`, the source-register handbook, search playbook, idea-reviewer instructions, existing topic dossiers, graveyard and current open PRs. Read relevant role instructions in `.claude/agents/` and existing skills before assigning BIB/MARK work. Preserve uncommitted user changes. Inspect overlapping PRs before creating another branch. Use an isolated worktree if needed; do not merge PR #180 merely to obtain its file.

Current root instructions explicitly say Vertex credits are exhausted: no Vertex-backed Lab/comparison/team runs until Félix confirms new credits. Use already available tools within their limits. Do not provision paid services.

Only Bibliothekar updates `src/data/quellen.json`, using the documented `npm run quellen -- ...` CLI. Other roles produce Quellenmeldung blocks. Never hand-edit the generated `06-suche/amelie-quellen.md`.

## 1. Screen the whole catalogue cheaply

Pin the math repository commit and retrieval date. Read README, overview, history and available validation notes. Parse structured result entries using a small local script or existing tools; preserve IDs and manuscript URLs. Do not download every PDF first. Record parsing failures rather than silently dropping entries.

Create one compact screening table covering the catalogue. For each family: title, domain, claim type (algorithm / constructive object / estimate / existence / impossibility), manuscript links, current revision status, plausible task, reason to inspect or defer. Label this as catalogue-level triage; do not imply full-paper review.

Shortlist at most 10 families. Rank by an explicit executable method, accessible data, practical assumptions, feasible compute, independent scrutiny and a concrete unmet task. A surprising theorem alone earns no implementation priority. Fully investigate at most three candidates before choosing one experiment.

Search directions, not established application claims:

| Area to inspect | Concrete question | Gate before coding |
|---|---|---|
| Harmonic analysis, Kakeya and inverse problems | Does a result improve an error/stability bound for a real observation operator? | Derive the bridge; shared words such as radar/waves are insufficient |
| Matrix algorithms and numerical methods | Is there an implementable method with useful sizes, precision and memory cost? | Compare practical constants and numerical stability against an optimized baseline |
| Constructive sequences and coding | Can an explicit finite construction improve a relevant correlation/error metric? | Obtain reproducible construction, verify finite-length properties and prior art |
| Optimization and computational complexity | Does a bound change method selection for a specific planning problem? | Show the problem matches the theorem; hardness does not itself supply a faster solver |
| Probability, transport and dynamical systems | Can a result improve a model guarantee or calibrated uncertainty? | Match stochastic/physical assumptions to measured data |

Record pure-theory results as research watch items when no actionable bridge exists. Do not force a business idea for every result.

## 2. BIB evidence card for each shortlisted result

Use existing formats where possible. Required fields:

- Stable family ID, exact theorem statement and manuscript section/page.
- Primary URL, pinned commit/version, retrieval date, revision/withdrawal status.
- Original novelty claim and relevant earlier work.
- Assumptions, domain, finite/asymptotic regime, constants and nonconstructive steps.
- Proof review: author claim / independent review found / formal artifact checked / unresolved. Cite the reviewer and scope. Never let an LLM declaring a proof correct count as independent mathematical validation.
- Formalization, if present: exact theorem checked, dependencies, toolchain and assumptions; a successful check only verifies the represented statement.
- Artifact availability: pseudocode/code/data/license and reproducibility status.
- Application task, observation or computational operator, and explicit mapping from theorem assumptions.
- What changes: algorithm, guarantee, impossibility boundary, or merely theoretical understanding.
- Existing best approach and evidence that a relevant gap remains.
- Smallest falsifiable experiment, metrics, compute budget, decision rule and failure modes.
- Verdict: test now / needs expert review / watch / no practical bridge / withdrawn.

Inspect citations and full primary papers for finalists. Search independent expert discussion and follow it to technical evidence. Mark inaccessible full texts as blocked. Record what was actually read. Keep source reports ready for Bibliothekar ingestion and deduplication.

## 3. MARK application work

Feed MARK the evidence cards, prior-art findings and current Amélie context. Ask for at most three application hypotheses per finalist. Every hypothesis must name the people who benefit, the improvement to their lives, a user task or wish, current bottleneck, mathematical mechanism, data, comparator, observable benefit and cheapest falsification.

Require a sentence: “Without this new result we can do X; with it, under assumptions A, we can test Y.” If Y follows from an established method instead, classify the proposal as a useful existing-method application, not a new-math breakthrough.

Run Amélie's occupied-territory and graveyard checks. Apply the current reviewer rubric without inflating novelty. Main remains CC0 public-interest work. Commercial hypotheses belong only on the existing venture track after checking its current branch and rules; do not mix sales proposals into main.

## 4. First concrete track: EuroBirdCast

Read PR #180 before repeating its research. Verify processed European biological vertical-profile time series (VPTS), schemas, coverage, access and licenses using its primary references:

- https://doi.org/10.1038/s41597-025-04641-5
- https://zenodo.org/records/14711024
- https://aloftdata.eu/faq/
- https://aloftdata.eu/radars/
- https://github.com/adokter/vol2bird
- https://github.com/adokter/bioRad
- https://github.com/enram/vptstools

These are starting sources to recheck, not guaranteed current access or license assertions in this handoff.

### A. Establish an ordinary baseline first

Select three or four neighbouring radars and one month with compatible coverage. Inspect metadata before downloading; avoid country-wide archives. Record station IDs, timestamps, altitude bins, units, quality flags, missingness, processing provenance, license, version and checksums. Use actual schema field names.

Define the target as aggregate biological density/velocity profiles, not individual birds, species or exact routes. Direction needs circular metrics; near-zero movement can make direction ill-defined. Explain contamination and processing limitations.

For spatial reconstruction, hold out an entire radar. For temporal forecasting, use chronological held-out nights and only data available at forecast issue time. Distinguish retrospective reconstruction from operational forecasting: service latency can make recent inputs unavailable. Estimate seasonal baselines using training data only; persistence requires target-site history and is not a valid comparator for a completely unseen station unless that history is explicitly permitted.

Compare a suitable training-only climatology and distance-weighted spatial baseline. Add persistence for the separately defined temporal task. Use height-specific MAE/RMSE for density, circular directional error when defined, and interval coverage plus width if uncertainty intervals are produced. Do not claim calibrated uncertainty without testing it. Report by site/night; avoid random adjacent-time splits. Record station distance, weather/missingness and failure cases.

### B. Evaluate Kakeya separately

Verify the current family 074 and related manuscripts; check corrections. Write the observation model, for example `y = A(rho) + noise`, and define every term using the actual data product. Explain whether A is an aggregation operator or a raw radar sensing operator. They are not interchangeable.

Identify an exact lemma/inequality, show its assumptions hold, and derive what it would change: stability bound, uncertainty estimate, sensor placement criterion or constructive solver. If that derivation cannot be supplied, conclude “no demonstrated transfer to VPTS” and keep the ordinary baseline useful on its own.

A full-dimensional Kakeya set does not establish reconstruction of space-time bird paths. A maximal-operator estimate does not automatically improve bird/rain discrimination. Do not label ordinary interpolation a Kakeya algorithm.

Only implement a new-math variant after an explicit mathematical bridge exists and unresolved proof issues are stated. Compare on identical data splits and compute budgets. Choose a practically meaningful improvement threshold before inspecting final test results; report negative results.

## 5. Deliverables and completion

Follow actual repository conventions rather than imposing these names. Suggested research outputs under `02-recherche/`:

1. Catalogue screening table with version provenance and shortlist rationale.
2. Evidence dossier for at most three finalists, with source reports for BIB.
3. One implementation ticket with dataset, comparator, metrics, budget, dependencies and stop criteria.
4. If feasible, one small reproducible baseline under the existing demo/experiment conventions, with a manifest, run instructions and results. Otherwise provide the exact blocker and runnable next step.
5. Decision memo separating mathematical validity, application fit, benchmark evidence, novelty and recipient usefulness.

No dashboard, new agent framework or mass-generated Dosen in this first pass. Do not make a Dose before reviewer approval and working scaffolding. If a Dose is approved, follow all current dual-data, language, vector, protocol and export requirements.

Run repository-required validation (`npm run lint`, `npm test`; exports/source CLI checks when relevant). Report checks actually executed, failures and network/data blockers. Commit only intended files and update the relevant existing draft PR or create one focused draft PR when justified. Do not merge or send outreach as part of this task. End with the commit/PR link, tested result, unresolved questions and next executable step.

## Ready-to-paste agent prompt

> Amélie’s purpose is to discover new chances to make people’s lives happier; mathematics is an opportunity source, not the end goal. Read this handoff and the current Amélie AGENTS.md. Inspect PR #180 and overlapping work. Execute the preflight, pin and screen the current math catalogue, then deeply investigate at most three actionable results. Use BIB for source verification/registration and MARK for falsifiable applications according to existing role instructions. Start with a small EuroBirdCast VPTS baseline; pursue Kakeya only after an explicit mathematical bridge. Keep claims, independent validation and measured usefulness separate. Do not use Vertex, spend new credits, bulk-download data, merge PRs or contact recipients. Produce evidence cards, one concrete experiment ticket, a reproducible baseline if feasible, negative findings and one focused draft PR. Continue until the deliverables are complete or an exact external blocker is documented.

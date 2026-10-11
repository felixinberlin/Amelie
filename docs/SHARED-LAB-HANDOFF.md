# Shared Lab intake checkpoint — 2026-10-11

## Current checkpoint — reviewed intake (11 October 2026)

This supersedes the initial processing counts below. All 72 batches and 159
ideas have a documented disposition, including all 11 research/review packets,
embedded research runs and the zero-survivor run. Worker
`amelie-intake-20261011` claimed and transitioned every batch through `bib lab`.
No active leases remain.

| Workflow state | Batches | Meaning |
| --- | ---: | --- |
| processed | 10 | Existing decisions reconciled or primary-source recheck completed |
| needs_research | 43 | Reviewed; explicit evidence/data/mandate gaps remain |
| archived | 19 | 40 commercial Mark offers outside CC0-main mandate; no market verdict |
| received / in_progress | 0 | No untouched or leased intake remains |

64 previously unreviewed civic proposals have individual eight-vector Reviewer
cards and Prüfprotokoll entries; 55 proposals link to earlier Amélie reviews.
None of the new reviews reaches the packaging gate. No new Dose, candidate or
grave was created. This completes intake disposition, not the outstanding
research: **43 batches still require the specific artifacts named in their
notes.** Do not infer existence judgments from workflow states.

- [Complete review and primary-source audit](../06-suche/lab-intake-review-20261011.md)
  and [machine-readable crosswalk](../06-suche/lab-intake-review-20261011.json)
  cover every receipt/local idea ID and preserve original receipt hashes.
- Existing `needs_research` **umsetzungsplan-register** is processed: current
  §9, BAFA guidance and EED were read; bill/current law and publication locations
  corrected in DE/EN dossiers, frontend and scaffolding. BAFA SHA256 matches
  the existing five-field schema. Historical vectors remain 25/35 + V8=1.
  Archive snapshots, the older guidance edition and explicit status-word
  mapping remain open in Ticket01; no claim of absent aggregators is proved.
- Existing `needs_research` **jobcenter-empowerment** remains open: primary
  statute checks narrow the legal claims; the qualitative IAB page cannot
  support the numerical effects. Obtain original papers/pages, year,
  population and denominators. Access failures are not proof of fabrication.
- Jobcenter proposals overlap open PR187 and each other. Coordinate on the
  existing KdU/rights/Beistand clusters before packaging; no parallel Dose.
- Mark proposals remain immutable source material. Archiving outside this
  mandate neither kills their markets nor accepts a Venture. Civic kernels
  were cross-linked to the corresponding noncommercial reviews.

[Wishes and lessons for the next Lab transfer](lab-transfer-next-round.md)
contain the requested concrete improvements: primary claim locations,
versioned law, independent reference tests, known-review/PR crosswalks,
recipient and operating mandates, and truthful zero-survivor accounting.
The [GitHub-transfer design](lab-github-transfer.md) remains a proposal;
these recommendations do not silently change the receipt schema.

Quellenmeldung: 17 new source objects and an existing UFZ source log were
written by Bibliothekar via the validated `lab-intake-review-20261011` apply
transaction. Only opened primary pages/PDFs are labelled `seite`; the NIAID
PDF remains `schnipsel` after unsuccessful retrieval. Source checks confirm
313 objects and current generated Markdown. No outreach, Vertex or paid Maps
calls occurred. The sister Lab handoff was read, not changed.

Validation checkpoint: exports and inventory account for 72/159; all receipt
hashes, local-ID coverage, scores and cleared leases independently checked.
Lint and production build pass. Python suites pass (34 tests); all five Node intake/lease tests pass outside the sandbox. Ordinary full Vitest: 57/59 files pass, with the two already documented time-limit failures (modelCompare 5 seconds and implementation-plan performance 500 ms). A direct serial Vitest run is in progress; no thresholds or implementation were changed. Publication/CI result follows below.

## Imported records — historical import checkpoint

Recovered the previously unpublished isolated round from:
`/home/felix/amelie/Amelie-lab/data/rounds/studio-intake-20261010/repo`

Original Lab head: `a1826a2`. Import branch: `lab/import-studio-intake-20261011`.
All 216 source files are create-only additions under `06-suche/proposals/`.
No source receipt, proposal, or manifest was modified. The sister checkout was read only.

| Engine | Batches | Ideas |
| --- | ---: | ---: |
| Mark | 19 | 40 |
| Lacunar | 22 | 75 |
| Inversion | 16 | 36 |
| Scarcity | 4 | 8 |
| Research/review | 11 | 0 |
| Total | 72 | 159 |

The existing `lab-ideas.html` frontend aggregates every engine. Review records retain their full findings even when they contain no survivor ideas. Imported material remains unchecked background; it assigns no existence verdicts, vectors, Doses, graves or commercial product entries. Original commercial proposals remain source material, not accepted Amélie products.

## Initial processing — superseded historical checkpoint

Worker: `amelie-bib-20261011`. Both batches were shown and claimed through `bib lab` before being marked `needs_research`; neither retains an active lease.

- `amelie-lab-review-jobcenter-empowerment-ac8405496d9f5801`: two supplied source URLs could not be accessed. An alternative [IAB primary page](https://iab-forum.de/das-iab-projekt-psychisch-kranke-im-sgb-ii-situation-und-betreuung/) was read; it describes qualitative research and does not substantiate the submitted effect percentages. The original percentages and quotations remain unverified. Obtain exact primary publications and locations for each claim before adopting them; also check current law and existing services. Access failure is not proof that a source does not exist.
- `amelie-lab-review-umsetzungsplan-register-2251d190445809eb`: `bib find` returns the existing Dose and Prüfprotokoll. Treat as a recheck. The Lab material mixes commentary on a legislative draft with an unlocated quote and a blind-review evidence gap. Read the current primary legislation and BAFA guidance before proposing changes to the existing Dose.

At that initial checkpoint, the remaining 70 batches were `received`, unclaimed and unreviewed. No full novelty review or scoring has been completed. Processing status files preserve the detailed next steps separately from immutable producer records.

For the next review session, [the complete working inventory](lab-inbox-inventory.md) lists all 72 batches and 159 ideas, producer quote-status fields, source domains, literal references to existing Doses/graves and repeated titles. Rebuild it with `node scripts/inventory-lab-inbox.mjs` after changing receipts or processing state. Its hints are not novelty judgments or evidence approval.

## Validation

Import: PR-mode manifest validation passes for all 72 new manifests, including the required `Existenzprüfung: nein` PR text. Export yields 72 batches and 159 ideas. Production build and lint pass. Full tests pass outside the filesystem sandbox: 59 Vitest files / 797 tests, 34 Python tests, and five Node intake/lease tests. Sandbox child-process checks failed without output; the unrestricted rerun passed.

After changing processing state, regenerate the inbox and validate before committing. Continue via `docs/lab-intake.md`, the Bibliothekar role and existing review workflow. Do not start Vertex calls while the recorded credit restriction remains in force.

Inventory follow-up: all 72 batch sections and 159 idea rows, relative file links and deterministic regeneration were checked; lint passes. Repeated full-test runs hit existing timing limits in the model-comparison mock (5 seconds) and, intermittently, the implementation-plan performance assertion (500 ms). A serial run also hit these limits. Test limits and implementation were not changed. GitHub’s stable runner subsequently passed the full verify workflow (lint, tests, build and browser checks) for import PR #192.

## Quellenmeldung

IAB primary page read for the Jobcenter evidence check: https://iab-forum.de/das-iab-projekt-psychisch-kranke-im-sgb-ii-situation-und-betreuung/ . Used only as background; it does not verify the imported percentages. No source-register write, existence verdict, Dose or grave was produced.

## Publication checkpoint

Both complete branches are committed and pushed to GitHub:

- [PR #192: immutable receipt import](https://github.com/felixinberlin/Amelie/pull/192), branch `lab/import-studio-intake-20261011`, complete import head `83d599bd8c09cfe80c8e00b036f3e88456c75f4f`; merged into `main` as `43d5bf03` after green GitHub CI.
- [PR #193: processing notes, inventory and handoff](https://github.com/felixinberlin/Amelie/pull/193), branch `lab/triage-studio-intake-20261011`, now targets `main`; its diff contained only the two processing files, documentation and inventory generator; PR193 has since merged into main.

Publication resumed after the connection recovered; the earlier partial 20-commit upload is now replaced by the full import. The immutable import is already merged. Check current state and CI for #193 before merging the remaining processing/inventory changes. Do not recreate these PRs or the producer round. At that historical checkpoint, processing remained incomplete: two batches needed research and 70 were received. The current checkpoint above supersedes those counts.

See `docs/lab-github-transfer.md` for the proposed GitHub-hosted transfer workflow.

## Maps cost restriction (2026-10-11)
Google Maps Platform APIs (Places, JavaScript, Static and Embed) are disabled at Félix’s request because of cost. Do not use or re-enable them, even with existing keys or budget overrides. Verify institutions and addresses via official websites; existing coordinates and OpenStreetMap links remain usable. Re-enabling requires Félix’s explicit authorization.

# Shared Lab intake checkpoint — 2026-10-11

## Imported records

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

## Initial processing

Worker: `amelie-bib-20261011`. Both batches were shown and claimed through `bib lab` before being marked `needs_research`; neither retains an active lease.

- `amelie-lab-review-jobcenter-empowerment-ac8405496d9f5801`: two supplied source URLs could not be accessed. An alternative [IAB primary page](https://iab-forum.de/das-iab-projekt-psychisch-kranke-im-sgb-ii-situation-und-betreuung/) was read; it describes qualitative research and does not substantiate the submitted effect percentages. The original percentages and quotations remain unverified. Obtain exact primary publications and locations for each claim before adopting them; also check current law and existing services. Access failure is not proof that a source does not exist.
- `amelie-lab-review-umsetzungsplan-register-2251d190445809eb`: `bib find` returns the existing Dose and Prüfprotokoll. Treat as a recheck. The Lab material mixes commentary on a legislative draft with an unlocated quote and a blind-review evidence gap. Read the current primary legislation and BAFA guidance before proposing changes to the existing Dose.

The remaining 70 batches are `received`, unclaimed and unreviewed. No full novelty review or scoring has been completed. Processing status files preserve the detailed next steps separately from immutable producer records.

## Validation

Import: PR-mode manifest validation passes for all 72 new manifests, including the required `Existenzprüfung: nein` PR text. Export yields 72 batches and 159 ideas. Production build and lint pass. Full tests pass outside the filesystem sandbox: 59 Vitest files / 797 tests, 34 Python tests, and five Node intake/lease tests. Sandbox child-process checks failed without output; the unrestricted rerun passed.

After changing processing state, regenerate the inbox and validate before committing. Continue via `docs/lab-intake.md`, the Bibliothekar role and existing review workflow. Do not start Vertex calls while the recorded credit restriction remains in force.

## Quellenmeldung

IAB primary page read for the Jobcenter evidence check: https://iab-forum.de/das-iab-projekt-psychisch-kranke-im-sgb-ii-situation-und-betreuung/ . Used only as background; it does not verify the imported percentages. No source-register write, existence verdict, Dose or grave was produced.

## Publication checkpoint

Both complete branches are committed locally: `lab/import-studio-intake-20261011` (all receipts) and `lab/triage-studio-intake-20261011` (two processing notes and documentation). GitHub received the first 20 original Lab commits through `4e78e6d`; subsequent publication attempts returned HTTP 408. No complete import PR has been created or merged. Do not treat the partially uploaded branch as the complete 72-record handoff. Resume by pushing the complete import branch, then create/resume its PR; publish the triage branch separately afterward.

See `docs/lab-github-transfer.md` for the proposed GitHub-hosted transfer workflow.

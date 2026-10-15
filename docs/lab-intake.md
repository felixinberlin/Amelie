# Shared Lab intake

Independent Labs submit immutable `06-suche/proposals/<plan-id>.inbox.json` records alongside their proposal and manifest. Each Lab sets a stable, unique `AMELIE_LAB_ID` (or `librarian --lab-id`). The receipt identifies the producer, engine, original run and content revision. Idea IDs include the receipt and local candidate ID; two Labs can use the same run and candidate names without collisions. Changed content creates a new revision; identical receipts deduplicate. Conflicting payloads with the same receipt ID stop export.

Original records are preserved, including missing evidence, quote checks, killed approaches, research history and accounting. Receipt is not approval. New intake never creates an existence verdict, vector score, Dose, grave or Prüfprotokoll entry. Producer labels identify the submitting Lab; they are not authentication. The proposal PR remains create-only. Labs cannot change Amélie's processing state.

`npm run export:lab-inbox`, `npm run export:data` and `npm run build` rebuild `public/data/lab-inbox.json` and full records under `public/data/lab-runs/` from ALL committed receipts. Only Amélie's build writes the combined index, so one Lab cannot replace another Lab's view. Generated files are derived; source receipts are the durable record. The main navigation links to `lab-ideas.html`, with filters for Lab, engine and processing status. Claims and links are displayed as unverified original material. The page requests one shared index and opens full records on demand. `bib find` also indexes proposal markdown as nonbinding, unchecked background leads.

## Plain-language descriptions

The Lab ideas page shows a short title and explanation for each idea, with a German/English selector. Original claims, technical details and cited links remain available inside each card's expandable details.

Editorial summaries are maintained separately in `src/data/labIdeaDescriptions.json`, keyed by the full `<batch-id>:<local-id>` identity. Each entry has `de` and `en` objects with a `title` and `description`. Describe who the proposal helps, what it would do and its purpose in short everyday sentences. Present proposed capabilities as proposals; do not repeat unverified accuracy, price, legal compliance or safety promises as facts.

Add both translations when adding a new idea. `npm run test:lab-inbox` checks coverage against all committed receipts and rejects missing or orphaned summaries. Export attaches these explanations as `plain_language` on index ideas; it never edits source receipts, full run records, scores or processing state. An idea without a summary still exports and displays its original text, so intake is not blocked by editorial work.

## Processing work in Amélie

```sh
npm run bib -- lab list --json
npm run bib -- lab show <batch-id> --json
npm run bib -- lab claim <batch-id> --worker reviewer-one --lease 1800 --json
npm run bib -- lab needs-research <batch-id> --worker reviewer-one --note "Primary page needed" --json
npm run bib -- lab claim <batch-id> --worker reviewer-two --json
npm run bib -- lab finish <batch-id> --worker reviewer-two --note "Review recorded in the appropriate register" --json
npm run export:lab-inbox
```

Processing writes require an actor with `lab.process` or `*` rights (the current Bibliothekar has `*`; `lab-librarian` does not). `--dry-run` checks without writing status. `release` returns a currently leased batch to received; `archive` closes the work item. Claims use Amélie's existing write lock and a renewable lease. Only the current lease owner can finish/release/archive or request more research; expired leases allow another worker to recover interrupted work. Completed and archived revisions cannot be claimed again. A revised source record is a new received item.

Processing state is stored separately in `06-suche/lab-processing/<batch-id>.json`: received, in_progress, needs_research, processed or archived, with worker, lease, note and update time. These are workflow states, never existence verdicts. Marking an item processed does not replace the existing Bibliothekar, Reviewer or Packer operations. Workers share one authoritative Amélie workspace and lock. Workers on other hosts must claim through that workspace/coordinator; git checkouts on separate machines do not provide a distributed lock. Publishing the status requires the ordinary commit/build workflow.

## Checks

`npm run test:lab-inbox` verifies multiple Labs, identical retries, revisions, immutable conflicts, actor rights, lease exclusivity and recovery. The ordinary build validates every receipt against `scripts/lab-inbox.schema.json` before writing the index. The Lab's Librarian validates and recomputes each receipt from the submitted source record before applying it. Malformed receipts block the build instead of disappearing silently.

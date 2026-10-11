# Proposal: GitHub-to-GitHub Lab intake

Status: design proposal, not implemented. This preserves the intake contract in `docs/lab-intake.md`.

## Existing capability and gap

`Amelie-lab/bridge/rounds.py:finish_round` already validates an isolated Amélie clone, pushes its producer branch and creates a PR with `gh`. It saves the PR URL for idempotent resumption. Today this publication runs on the local machine and depends on its network. The Lab repository currently has no GitHub Actions workflows; the immutable receipts from the studio round exist in the isolated Amélie clone, not as a published export in the Lab repository.

## Recommended transfer

1. The Lab packages an explicitly accepted round as immutable export files and commits them under `exports/amelie/<round-id>/` in its own GitHub repository. Include each existing proposal, manifest and `.inbox.json`; retain full original records and receipt identities. Do not export the mutable SQLite database, cost credentials, or processing state.
2. An Amélie workflow is started manually with the Lab repository, exact 40-character commit SHA and export path. Initially allow only the known Lab repository. Later, a scheduled workflow can discover new accepted exports; it still resolves each to an exact SHA before reading it.
3. The workflow reads the pinned files on GitHub's runner and copies only validated export members to `06-suche/proposals/`. The importer runs trusted Amélie code. It never runs scripts from the producer export. Reject unexpected files, path traversal, symlinks, altered existing receipts and producer/receipt identity mismatches.
4. Validate schema, manifests, receipt conflicts and immutable content. Identical imports become no-ops; changed content requires a new receipt revision. Run PR-mode manifest checks, inbox export, lint, tests and build.
5. Open one create-only import PR identified by Lab ID, round and source SHA. Record provenance and `Existenzprüfung: nein`. Find the existing PR before creating another; retries must resume the same import. Amélie merges through its normal review path.
6. After merge, Amélie rebuilds the combined frontend. Reviewers claim batches in the authoritative workspace and publish processing notes separately. A merged import is receipt acceptance, not approval of claims or ideas.

Public Lab exports can be read without a cross-repository write token. The Amélie workflow needs permission to create its own branch and PR; repository settings must allow that. For a private Lab, use a narrowly scoped GitHub App or read credential. Do not assume Amélie's default workflow token can access a separate private repository.

## Reliability and publication

Upload a small accepted round once from the local machine. The larger transfer, dependency installation, validation and PR creation then run between GitHub repositories. The initial local upload still needs a working connection. GitHub execution does not remove that requirement.

Use immutable committed exports as the durable source, rather than relying on temporary workflow artifacts. Record both the source commit and the receipt content revision. Never force-push to recover an interrupted transfer. Import retries should preserve matching existing files, reject conflicts and identify progress without repeating review work.

A PR created with the default workflow token may not trigger ordinary PR workflows. The import workflow should therefore run all required checks itself. If branch protection requires separately triggered checks, use an approved GitHub App token or explicit validation dispatch; confirm repository settings before enabling automation.

## First implementation slice

- Lab: deterministic accepted-round export plus a manifest of allowed files and hashes; tests for retry, content revision and incomplete export.
- Amélie: importer with `--dry-run`, pinned-source provenance and create-only conflict checks; meaningful tests for traversal, immutable conflicts, duplicates and all engines.
- Amélie: manually triggered workflow that validates and opens/resumes the PR. Automatic discovery follows only after the manual path is proven.

No model run is required for transfer. No Vertex calls, existence judgments, scoring, Packer operations or email delivery belong in this workflow.

## Review-session feedback

See [lessons and wishes from the completed 72-batch intake disposition](lab-transfer-next-round.md). These improve evidence and reconciliation inputs; they do not authorize automatic Lab verdicts or replace the immutable receipt contract.

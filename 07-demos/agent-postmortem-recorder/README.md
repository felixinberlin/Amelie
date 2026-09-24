# claude-reflect: two backlog items and one signal that Step 4 throws away

*For the maintainers of [claude-reflect](https://github.com/BayramAnnakov/claude-reflect). Read against `main` 2c892ca (v3.2.0), 24.09.2026.*

## TL;DR

This is a patch for two items already in your `BACKLOG.md`: #1 (rank repeat corrections first) and #3 (end-to-end hook test). It also adds one signal that falls out of #1 at no extra cost. It is not a feature wish list.

- **New files only.** 4 files, 567 lines, no edits to existing code, stdlib only. It only reads the queue and the memory files.
- **Tested.** The suite goes from 322 to 340 passing on Python 3.11 (Linux), and also passes under a cp1252 locale.
- **Opt-in.** `/reflect` behaves exactly as before until you add one step to `commands/reflect.md` (proposed below).
- **No reply owed.** Take it, change it, or ignore it.

Patch: [`claude-reflect-recurrence.patch`](./claude-reflect-recurrence.patch). Apply it with `git apply`.

## What is already there, and stays

Most things people would suggest for this project are already built:

| Idea someone might suggest | Already in claude-reflect |
| --- | --- |
| Route a correction somewhere other than CLAUDE.md | Hierarchy-aware routing: guardrails, path-scoped rules, local, auto memory, skill files, AGENTS.md |
| Merge near-duplicates | Step 3.5 (within the queue), `--dedupe` (within CLAUDE.md), `detect_contradictions()` |
| Warn when a file gets too long | `--targets`, 150-line threshold |
| Catch non-English corrections | Semantic pass via `claude -p` |
| Mine old sessions | `--scan-history`, tool rejections, tool errors |

So the patch adds none of these. It only touches what your own backlog lists as measured and open.

## BACKLOG #1: rank repeat corrections first

`scripts/lib/recurrence.py` groups queue items that say the same thing and shows the recurring groups first. Your "use unipile mcp" case (four wordings over three months, mixed in with eight one-off redirects) comes out like this:

```
#1  ×4 over 4 day(s)  2026-06-02 → 2026-09-11   [unipile]
      "no, use unipile mcp"
      "use the unipile mcp for linkedin, not the browser"
      "actually go through unipile"
      "why didn't you use unipile mcp?"

8 one-off item(s) below — review last.
```

How it works, and why:

- **Similarity is an IDF-weighted overlap coefficient.** Overlap, not Jaccard, because people often state a rule once briefly and once at length. The IDF is computed over the queue itself, so words the user says all the time count for less.
- **Only words that appear in at least two items can link items.** A word that appears once cannot show recurrence, but it did pull scores down (the "through" in "go *through* unipile").
- **Complete-link, not single-link.** The first version used single-link and chained "tests" → "run tests before commit" → "commit" into one blob of six. A regression test guards against that now.
- **`distinct_days`** separates a real recurrence from one angry minute.
- **`similarity_fn=`** lets you plug in the existing semantic layer later without touching the clustering.

This follows #2: no new regexes, and no decision about what is "a rule". The tool only changes the order, and the human still decides.

**Known limit.** Matching is by words, not meaning, so a group of two can be a coincidence. On a noisy set of 35 items, 3 of 9 groups were weak ("smaller" alone, "api" alone). That costs little because they rank below the larger groups, and `similarity_fn` is the fix.

## The signal Step 4 currently throws away

Right now, Step 4 treats a correction that matches an existing memory entry as a duplicate and offers "skip". But if the user keeps correcting the same thing while the rule is already written down, the rule is not working. That is the most useful thing the queue can say about someone's CLAUDE.md.

`find_ineffective_entries()` checks recurring groups (size ≥ 2) against `read_all_memory_entries()`:

```
ALREADY WRITTEN DOWN, STILL CORRECTED — 1
  ./CLAUDE.md:2  "Use the unipile MCP for LinkedIn"
      ↑ corrected ×4 anyway (2026-06-02 → 2026-09-11). Rewrite, move, or make it a hook?
```

This is pruning based on evidence rather than guesses. It points at entries that take up attention without working, and it does not need to know which rules were "never used". That would require compliance data, which is RuleReceipt's area, not claude-reflect's.

**Caveat, shown to the user:** the corrections may be older than the entry. That is why the report shows the first and last dates. A future version could compare them with the `git log -S` date of the line. I left that out to keep this patch read-only and simple.

## BACKLOG #3: the capture path CI never ran

`tests/test_hook_e2e.py` runs `capture_learning.py` the same way Claude Code does. It starts a subprocess with a throwaway `HOME`/`USERPROFILE`, a real `transcript_path`, and no `PYTHONIOENCODING`, so the platform's default codepage applies. It checks that:

- a real correction lands in `projects/<folder>/learnings-queue.json`, with empty stderr and the confirmation on stdout
- a non-ASCII correction (`café-api`) survives unchanged
- two captures append instead of overwriting
- `"test"` still leaves an empty queue

It runs inside the normal `pytest` step, so `test.yml` does not change. It passes on Linux. It only proves its worth on `windows-latest`, which is where the cp1252 and `WinError 267` bugs lived. I could not run Windows here, so please check that the first run there is green.

## The code, and the one step to wire it in

| File | Lines | What |
| --- | --- | --- |
| `scripts/lib/recurrence.py` | 261 | `tokenize`, `cluster_learnings`, `find_ineffective_entries`, `format_report` |
| `scripts/rank_queue.py` | 68 | CLI. Uses `load_queue_at`, not `load_queue`, so it never triggers a migration |
| `tests/test_recurrence.py` | 164 | 14 tests, including the unipile census shape and the no-chaining regression |
| `tests/test_hook_e2e.py` | 74 | 4 subprocess tests for BACKLOG #3 |

Try it on a real queue. There is nothing to install, and it writes nothing:

```bash
git apply claude-reflect-recurrence.patch
python3 scripts/rank_queue.py            # this project's queue
python3 scripts/rank_queue.py --json     # for the slash command
python -m pytest tests/ -v               # 340 passed
```

Proposed addition to `commands/reflect.md`, right before Step 5a:

```markdown
### Step 4.5: Rank by recurrence

Run: !`python3 "${CLAUDE_PLUGIN_ROOT}/scripts/rank_queue.py" --json`

- Present clusters with size >= 2 first, labelled "×N over D days".
- For each `ineffective` hit, do NOT offer "skip" as the default. Offer:
  [r]ewrite the existing entry | [m]ove it (e.g. to a path-scoped rule) |
  [h]ook (if it is a hard invariant) | [k]eep as is.
- One-off items come last, collapsed under "N one-off items".
```

Constraints I kept to:

- Works on Python 3.8, the oldest version in the CI matrix (`capture_output` needs 3.7 or later, and nothing newer is used).
- Paths work across platforms.
- `--json` output is ASCII-safe.
- Any exception during memory discovery falls back to ranking only.

## What this deliberately does not ask for

- **Replay testing** (re-running the turn before a correction with the patched CLAUDE.md). Nice in theory, but it costs one `claude -p` call per rule and nobody has measured whether it works. Your backlog says speculation doesn't earn a place.
- **Automatic line budgets or auto-deletion.** Memory files stay under human control, as `/reflect` already promises.
- **"Rule never used" detection.** That needs compliance data. RuleReceipt does it, so link to it instead of rebuilding it.
- **New regexes.** See #2.
- **Any change to capture, the queue format, or the hooks.**

---

*CC0. From Félix, Berlin ([github.com/felixinberlin](https://github.com/felixinberlin)), via [Amélie](https://felixinberlin.github.io/Amelie/), which gives ideas to whoever can use them. No reply owed.*

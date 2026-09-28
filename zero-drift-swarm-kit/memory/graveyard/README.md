# The Graveyard (Rückwärts-Gedächtnis)

> *"A graveyard is not a portfolio. It is an autopsy room."*

This directory stores every failed hypothesis, disproven approach, and discarded architectural idea — with an autopsy certificate.

We don't keep them as sentimental archives. We keep them so that **AI agents never resurrect zombie ideas** that have already been proven false.

---

## The Graveyard Protocol

1. **Pre-flight Check:** Before any new feature or architectural pivot, the `orchestrator` must check this graveyard.
2. **Strict Autopsy Schema:** Every grave must contain the mandatory fields:
   - `id`: Unique kebab-case identifier.
   - `name`: Human-readable title.
   - `date`: ISO date when it was discarded.
   - `cause`: Why it died (`built-elsewhere`, `reality-check`, `premise-flaw`, `complexity`, `duplicate`).
   - `killer`: The exact test, benchmark, or proof that killed it.
   - `foundBy`: How it was discovered.
   - `stage`: How far it got (`idea`, `architecture-review`, `tdd-test`, `production`).
   - `resurrectIf`: The precise, falsifiable condition required to reopen this approach.
3. **No Zombies:** Never retry a buried approach unless its `resurrectIf` condition has explicitly come true.

---

<!-- MUSTER:START -->
### Failure Statistics (2 Buried Hypotheses)

#### Why Approaches Died
| Cause | Count | Ratio |
|---|---:|---:|
| `reality-check` | 1 | 50% |
| `complexity` | 1 | 50% |

#### Who Disproved Them
| Disproved By | Count | Ratio |
|---|---:|---:|
| `Multi-line nested codeblocks in LLM output` | 1 | 50% |
| `Git index lock race condition (.git/index.lock)` | 1 | 50% |

#### At Which Stage They Died
| Stage | Count | Ratio |
|---|---:|---:|
| `tdd-test` | 1 | 50% |
| `architecture-review` | 1 | 50% |

#### Recent Autopsies
| ID | Date | Cause | Killer | Stage |
|---|---|---|---|---|
| **Shared-Branch Concurrent Subagent Commits** (`direct-git-worktree-concurrency`) | 2026-09-28 | `complexity` | Git index lock race condition (.git/index.lock) | `architecture-review` |
| **Naive Regex Markdown JSON Extractor** (`naive-regex-json-parser`) | 2026-09-28 | `reality-check` | Multi-line nested codeblocks in LLM output | `tdd-test` |
<!-- MUSTER:END -->

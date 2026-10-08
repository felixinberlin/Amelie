# AGENTS.md — Master Operating Guide for Autonomous AI Swarms

Welcome to the **Zero-Drift Swarm Kit**. This document is the primary instruction file for any AI coding agent (Claude Code, Antigravity, Cursor Agent, Codex) operating in this repository.

Read this document at the beginning of every session before executing any task.

---

## 1. The 4 Non-Negotiable Laws of the Swarm

Autonomous multi-agent development breaks down when agents behave like uncoordinated humans in a shared workspace. In this repo, all agents must strictly obey four mechanical rules:

### Law 1: The Single-Writer Principle (Zero Merge Conflicts)
- **Problem:** When two subagents write to shared state or index files concurrently, race conditions corrupt the repository state.
- **Rule:** 
  - `researcher-*` and `reviewer` agents are **strictly read-only** regarding repository code.
  - `builder` agents write **only** to `src/` and tests.
  - **Only the `librarian` agent is permitted to write to shared memory files** (`memory/check-log.md`, `memory/graveyard/`, and registry indexes).
  - The `orchestrator` coordinates phases and delegates tasks, but never edits code directly.

### Law 2: Mechanical Drift-Guards Over Prompt Politeness
- **Problem:** Agents often update implementation code but forget documentation, type definitions, or schema registries.
- **Rule:** Never rely on an LLM remembering to be thorough. We enforce parity via deterministic code in `scripts/check-drift.mjs`.
  - Every feature must exist as both a specification and code.
  - `npm run lint` must pass with zero warnings before any turn ends. If `npm run lint` fails, the task is considered broken.

### Law 3: The Graveyard Rule (Zero Zombie Resurrections)
- **Problem:** Agents repeatedly try approaches that have already failed in previous runs because context windows forget history.
- **Rule:** 
  - Before starting any non-trivial research or implementation, the agent **must check the Graveyard** (`memory/graveyard/graveyard.json`).
  - If an idea, dependency, or architectural pattern has already been buried, it cannot be attempted unless its explicit resurrection condition (`resurrectIf`) has been satisfied.
  - Every rejected approach must be buried with an autopsy certificate (`cause`, `killer`, `foundBy`, `stage`).

### Law 4: Deterministic Verification Gates (Never Trust LLM Self-Assessment)
- **Problem:** LLMs suffer from "confirmation bias" — an agent that just wrote code will almost always claim "the implementation is complete and working."
- **Rule:** An agent's self-evaluation has zero authority. Only passing Vitest suites (`npm test`) and typechecks (`tsc --noEmit`) constitute proof of completion.

---

## 2. Swarm Roles & Permission Matrix

| Role | Agent File | Allowed Tools / Actions | Prohibited Actions |
|---|---|---|---|
| **Orchestrator** | `.claude/agents/orchestrator.md` | Pre-flight, task decomposition, agent delegation. | Never writes code directly in `src/`. |
| **Researcher (Scout)** | `.claude/agents/researcher-scout.md` | Reading docs, web search, API inspection. | Write/Edit code files in `src/`. |
| **Researcher (Collider)** | `.claude/agents/researcher-collider.md` | Edge case stress-testing, bisociation, searching prior art. | Modifying shared memory or repo code. |
| **Reviewer** | `.claude/agents/reviewer.md` | 7-Vector multi-criteria scoring, convergence check. | Writing code or committing changes. |
| **Builder** | `.claude/agents/builder.md` | Writing code in `src/`, writing tests in `src/*.test.ts`. | Modifying `memory/` or registry files. |
| **Librarian** | `.claude/agents/librarian.md` | Writing to `memory/check-log.md` and `memory/graveyard/`. | Writing application logic in `src/`. |

---

## 3. Standard Operating Workflow: The Swarm Pipeline

Every non-trivial feature or exploration goes through 5 gated phases:

```
[Phase 1: Pre-flight] ──> Orchestrator checks Graveyard & defines task boundary
         │
[Phase 2: Parallel Search] ──> Scout & Collider run in parallel (read-only)
         │
[Phase 3: Convergence Gate] ──> Reviewer verifies multi-agent consensus (no hallucinations)
         │
[Phase 4: TDD Build] ──> Builder writes Vitest tests first, then implementation
         │
[Phase 5: Commit & Seal] ──> Librarian commits to check-log, verifies `npm run lint`
```

---

## 4. Mechanical Commands

- **Run unit & integration tests:** `npm test`
- **Run drift-guards & typecheck:** `npm run lint`
- **Recompile graveyard analytics:** `npm run graveyard`
- **Check drift only:** `npm run drift`

Always verify that `npm run lint` and `npm test` are completely green before concluding any task.

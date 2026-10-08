# CLAUDE.md — Claude Code Instructions

Welcome to the **Zero-Drift Swarm Kit**. This file governs Claude Code sessions.

## Quick Reference Commands

- **Run all tests:** `npm test`
- **Run drift checks & linting:** `npm run lint`
- **Check drift specifically:** `npm run drift`
- **Update graveyard analytics:** `npm run graveyard`

## Codebase Principles

1. **Follow `AGENTS.md` unconditionally:** Review `AGENTS.md` before starting any major task.
2. **Strict separation of roles:** Do not combine the role of the Librarian (who manages shared memory in `memory/`) with the Builder (who writes code in `src/`).
3. **No Drift:** Whenever you create or modify an entity in `src/data/` or `src/engine/`, ensure the corresponding specification file in `specs/` is updated, or `npm run lint` will fail.
4. **Never bypass tests:** Write deterministic Vitest tests for any logic added. Green tests are the only accepted proof of correctness.

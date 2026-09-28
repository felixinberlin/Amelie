# Zero-Drift Swarm Kit
> **The Battle-Tested Autonomous Multi-Agent Boilerplate for Claude Code, Antigravity, and Cursor.**

Stop your AI coding agents from hallucinating architecture, overwriting each other's code, or burning $50 in runaway loops.

---

## 🚀 Quickstart in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Drift & Execution Gates
```bash
npm run lint
npm test
```
Both commands must exit with 0 errors.

### 3. Launch an Autonomous Multi-Agent Session
Open **Claude Code**, **Antigravity**, or **Cursor** in this directory:
```bash
claude
```
And prompt:
```
Read AGENTS.md. Act as orchestrator. Follow the 5-phase pipeline for task: [Describe your task].
```

---

## 🏛️ The Architecture: Why Most Agent Setups Drift (and How We Fixed It)

```
                              [TASK PROMPT]
                                    │
                       Phase 1: Pre-flight Check
                                    │
                       ┌────────────┴────────────┐
                       ▼                         ▼
             [Researcher (Scout)]      [Researcher (Collider)]
             (Primary Docs & APIs)     (Edge Cases & Stress Tests)
                       │                         │
                       └────────────┬────────────┘
                                    │
                       Phase 3: Convergence Gate
                                    │
                                [Reviewer]
                      (5-Vector Feasibility Audit)
                                    │
                       Phase 4: Test-Driven Build
                                    │
                                 [Builder]
                     (Vitest Tests First -> TypeScript)
                                    │
                       Phase 5: Commit & Seal
                                    │
                               [Librarian]
                     (ONLY WRITER TO SHARED MEMORY)
                                    │
                      [npm run lint && npm test]
```

### The 4 Non-Negotiable Laws
1. **The Single-Writer Principle (`.claude/agents/librarian.md`):** Multiple agents can read, analyze, and test. But **only one agent** is ever allowed to write to shared state files, registries, and memory. Zero git collisions.
2. **Mechanical Drift-Guards (`scripts/check-drift.mjs`):** We don't ask agents nicely to keep docs updated. `npm run lint` automatically compares your markdown specifications in `specs/` against your TypeScript registry in `src/data/registry.ts`. If they drift, CI halts immediately.
3. **The Graveyard Protocol (`memory/graveyard/`):** Context windows forget past failures. Every dead approach gets a structured autopsy certificate. Agents must check the graveyard before exploring dead ends.
4. **Deterministic Verification Gates (`npm test`):** Never trust an LLM saying "it works". Only passing Vitest suites and zero-drift lint passes allow a turn to finish.

---

## 📂 Repository Structure

```
.
├── .claude/
│   └── agents/               # 6 Pre-configured Agent roles with least-privilege toolsets
│       ├── orchestrator.md   # Pipeline coordination and task decomposition
│       ├── researcher-scout.md # Primary source reader (read-only)
│       ├── researcher-collider.md # Adversarial stress tester (read-only)
│       ├── reviewer.md       # 5-Vector convergence auditor (read-only)
│       ├── builder.md        # TDD implementer (writes to src/ and tests)
│       └── librarian.md      # The SINGLE WRITER to memory and registries
├── memory/
│   ├── check-log.md          # Forward memory: Verified audit trail of shipped work
│   └── graveyard/            # Backward memory: Structured autopsy log of dead ends
│       ├── README.md         # Auto-compiled failure statistics
│       └── graveyard.json    # Machine-readable error taxonomy
├── specs/                    # Markdown specifications of all features
├── src/                      # Production TypeScript implementation
│   ├── data/registry.ts      # Typed registry kept in sync with specs/
│   └── engine/               # Sample deterministic state machine
├── scripts/                  # Mechanical CI verification guards
│   ├── check-drift.mjs       # Parity checker (specs vs code)
│   ├── check-graveyard.mjs   # Schema validator for autopsies
│   └── graveyard-muster.mjs  # Analytics compiler
├── AGENTS.md                 # Operating manual governing all subagent behavior
├── CLAUDE.md                 # Root instructions for Claude Code sessions
└── package.json              # Configured npm scripts
```

---

## 🛠️ Built by Félix
Extracted directly from the real-world engineering infrastructure of **Amélie** (Berlin) — 42 shipped software tools, 52 documented dead ends, and 14 automated test suites running completely in green.

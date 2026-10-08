# Reddit & Hacker News Launch Post

**Target Subreddits:** `r/ClaudeCode`, `r/cursor`, `r/MachineLearning`, `r/ArtificialIntelligence`  
**Hacker News:** "Show HN: Zero-Drift Swarm – A multi-agent framework that prevents code drift via deterministic linters"

---

## Post Title:
**How we ran 100+ autonomous multi-agent sessions in Claude Code without a single git conflict or silent spec drift**

---

## Post Body:

Hey everyone,

Over the last few months, I built **Amélie**—an open project where autonomous AI agents research, verify, and scaffold complex software tools. To date, the system has delivered 42 shipped modules, buried 52 dead-end approaches in a structured graveyard, and maintains 14 automated Vitest test suites running 100% green.

When I started running multi-agent swarms in Claude Code and Cursor, I ran into the same four walls that everyone encounters:
1. **Concurrent File Collisions:** Two subagents editing files at the same time corrupting git state.
2. **Silent Spec Drift:** The agent updates business logic but forgets schemas, database migrations, or documentation.
3. **The Zombie Loop:** Burning $40 in tokens watching an agent retry an approach that had already failed in a previous session.
4. **Context Pollution:** Chat transcripts getting choked with repetitive back-and-forth.

Here are the 4 architectural patterns that completely solved these problems for us:

---

### 1. The Single-Writer Principle ("The Librarian")
In standard multi-agent setups, every agent gets write permissions. That’s a recipe for race conditions.

In our architecture:
- Subagents (`scout`, `collider`, `reviewer`) are **strictly read-only**. They can run shell commands, grep, read docs, and search APIs, but they cannot edit files.
- The `builder` agent writes only to `src/` and tests.
- **Only ONE agent—the Librarian—has permission to write to shared state, registries, and memory.**

Because only one agent touches the state files, concurrent merge conflicts simply cannot happen.

---

### 2. Mechanical Drift-Guards via Custom Linters (Stop Asking Nicely)
Prompts like *"Please remember to keep documentation and schemas in sync"* fail 30% of the time.

Instead of prompt politeness, we use mechanical enforcement:
We built a lightweight Node script (`scripts/check-drift.mjs`) that hooks into `npm run lint`. It scans our markdown specs in `specs/` and matches them against our typed TypeScript registry in `src/data/registry.ts`.
- If an agent adds code without a spec $\rightarrow$ `npm run lint` fails with Exit 1.
- If an agent writes a spec without registering it in code $\rightarrow$ `npm run lint` fails with Exit 1.

The agent literally cannot finish its turn until both sides are 100% in parity.

---

### 3. The Graveyard Protocol (Backward Memory)
Context windows forget past failures. If an agent tries an approach and fails, the next agent 10 minutes later will happily try the exact same bad idea and burn another $15 in tokens.

We created a structured **Graveyard** (`memory/graveyard/graveyard.json`). Every rejected approach receives a mandatory 8-field autopsy certificate:
```json
{
  "id": "naive-regex-json-parser",
  "cause": "reality-check",
  "killer": "Nested markdown codeblocks in LLM output",
  "foundBy": "Vitest edge-case runner",
  "stage": "tdd-test",
  "resurrectIf": "Never. Use an AST-based tokenizer instead."
}
```
Before any agent starts a task, the `orchestrator` must check the graveyard. Zombie approaches are blocked before execution begins.

---

### 4. Multi-Engine Convergence Over LLM Self-Scoring
Never ask an LLM: *"Is this code good?"* It will almost always say yes.

Instead, we launch two independent research engines in parallel:
- Engine A (`scout`): Looks for empirical primary sources (docs, RFCs, APIs).
- Engine B (`collider`): Actively stress-tests against edge cases, network drops, and performance limits.

A solution is only approved if both independent angles converge on the same conclusion.

---

### Open Sourcing / Starter Kit
A lot of developers reached out after my showcase comment asking how to set this up in their own repositories. 

I cleaned up our internal scripts, agent prompt specs, and drift-guard linters and packaged them into a clean, standalone boilerplate:
👉 **[Link to Zero-Drift Swarm Kit on Lemon Squeezy / GitHub]**

Would love to hear how you handle multi-agent state and drift in your workflows. Happy to answer questions in the comments!

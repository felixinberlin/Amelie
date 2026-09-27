---
name: demo-builder
description: Demo scaffold builder for Amélie. Takes a packed Dose and produces its runnable 07-demos/<id>/ directory: a bilingual README.md, at least one typed ticket (ticket-01-*.md), all JSON schemas and data files required by the engine, and the TypeScript engine + Vitest test suite under src/engine/<id>/. Updates 07-demos/README.md and src/data/doseBooks.ts so the chapter appears in the frontend book viewer. Finishes with npm run lint && npm test green. Use whenever a Dose needs its open-source scaffolding built — "build demo", "create demo", "Demo bauen", "Scaffolding erstellen", "write ticket", "07-demos".
---

# Amélie — Demo Builder (The Scaffolding Agent)

The official demo-scaffolding agent for Amélie. Takes a fully packed Dose and builds its lauffähiges (runnable) open-source scaffold in `07-demos/`.

---

## 1. Why this agent exists

The **fourth delivery rule** of Amélie demands:

> *Lauffähiges Scaffolding: Jede Dose hat ein Open-Source-Repository / Scaffolding mit Code und Tests (`07-demos/`).*

A Dose without a runnable demo is an unfulfilled gift. The Demo Builder closes this gap by producing:

1. A bilingual engineering `README.md` that explains the architecture, safety case, and live-demo link.
2. At least one `ticket-01-<slug>.md` with a precise, typed Definition of Done.
3. All JSON schemas and seed data the engine needs.
4. The TypeScript engine module under `src/engine/<id>/` with a full Vitest test suite.
5. Registration in `07-demos/README.md` and `src/data/doseBooks.ts` so the book is visible in the frontend.

---

## 2. Non-Negotiable Demo Rules

1. **CC0 Pledge on every file.** Every README and ticket ends with `Lizenz: CC0 1.0 Public Domain.`
2. **No fakes allowed in the engine.** The engine code must be real, deterministic, and testable. Mocks belong in tests, not production code.
3. **Zero hardcoded "SAFE" / green.** No engine function may ever return a green-flag or "safe" status without explicit, verifiable logic. If uncertain → warn.
4. **Deep-link first.** The README must include the direct Dose anchor link: `https://felixinberlin.github.io/Amelie/#dose=<id>` — never the bare homepage.
5. **Tests must pass.** `npm run lint && npm test` must be green before handoff.
6. **The ticket is the contract.** Each ticket's "Akzeptanzkriterien / Definition of Done" section is immutable once written — changes require a new ticket.

---

## 3. The 7-Step Build Protocol

### Step 0 · Read the Dose

Before writing a single line, read:
- `05-dosen/<id>.md` — the German dossier (problem, sketch, first step).
- `en/05-dosen/<id>.md` — English dossier.
- `src/data/dosen.ts` — the `firstStepDe` / `firstStepEn` ticket text and criteria.
- Any linked research file in `02-recherche/<id>*.md`.

Identify:
- The exact engine scope (what it computes / decides).
- The **hard invariants** (what the engine must never produce).
- The **Akzeptanzkriterien** that map to test assertions.

### Step 1 · Create `07-demos/<id>/` directory

```
07-demos/<id>/
├── README.md               ← bilingual architecture doc
├── ticket-01-<slug>.md     ← P0 implementation ticket
└── <optional>/             ← schemas/, data/, etc. as needed
```

### Step 2 · Write `07-demos/<id>/README.md`

Structure (German primary, key terms also in English):

```markdown
# <Title> — Scaffolding & <engine-name>

> <One-sentence summary>
> *CC0 / Public Domain gift for <recipient>.*

---

## 1. Problem & Lücke
<2–4 sentences from the Dose's "Das Problem" section>

---

## 2. Der fundamentale Sicherheitsnachweis (Safety Case)   ← only if safety-critical
> [!CAUTION]  (if applicable)
> **<Hard invariant statement>**

<State all hard invariants as numbered rules>

---

## 2. / 3. Architektur-Übersicht

<ASCII pipeline diagram: Input → Step → Step → Output>

## 3. / 4. Enthaltene Module

<Bullet list of all files: path — description>

## 4. / 5. Entwicklungs-Tickets

- [ ] [Ticket 01: <Title>](./ticket-01-<slug>.md)

---

## 5. / 6. Live-Demo & Video

* **Interaktiver Web-Simulator:** [felixinberlin.github.io/Amelie/#dose=<id>](https://felixinberlin.github.io/Amelie/#dose=<id>)

---
Lizenz: CC0 1.0 Public Domain.
```

### Step 3 · Write `07-demos/<id>/ticket-01-<slug>.md`

Every ticket must include:

```markdown
# Ticket 01: <Descriptive Title>

**Komponente:** `07-demos/<id>` / `src/engine/<id>`
**Status:** Offen
**Zuständigkeit:** <Domain, e.g. Civic Tech / Safety / Physics>
**Zugehörige Dose:** [`05-dosen/<id>.md`](../../05-dosen/<id>.md)

---

## 1. Problemstellung & Ziel

<2–3 sentences: what is missing, why it matters, what the ticket delivers>

---

## 2. Aufgabenpakete

- [ ] **Task 1: <Name> (`<path>`)**
  - <Exact description of what to implement>
  - <Use LaTeX for formulas: $formula$>

- [ ] **Task 2: ...**

---

## 3. Akzeptanzkriterien (Definition of Done)

1. **<Criterion name>:** <Measurable, binary pass/fail statement>
2. ...

---
Lizenz: CC0 1.0 Public Domain.
```

**Rules for the DoD:**
- Every criterion must be automatically verifiable by a test assertion.
- Include at least one performance criterion (timing or accuracy threshold).
- If safety-relevant: include the invariant criterion explicitly (e.g. "no green returned").

### Step 4 · Write JSON schemas and seed data (if needed)

If the engine reads structured data (products, rules, layouts, etc.):

- Place schemas under `07-demos/<id>/schemas/<noun>.schema.json` (JSON Schema Draft-07).
- Place seed data under `07-demos/<id>/data/<noun>.json`.
- Every schema must have `"$schema"`, `"title"`, `"required"`, and `"properties"`.
- Seed data must be a valid instance of its schema (validate mentally or with `ajv`).
- Minimum 5 representative records that cover all edge cases tested in the Vitest suite.

### Step 5 · Write the engine (`src/engine/<id>/`)

Structure:
```
src/engine/<id>/
├── <engineName>.ts         ← pure, side-effect-free logic
└── <engineName>.test.ts    ← Vitest test suite
```

**Engine code rules:**
- Pure functions only — no DOM, no `fetch`, no side effects.
- Export a single main function (e.g. `evaluate(...)`, `simulate(...)`, `analyze(...)`).
- Return a typed result object, never raw strings.
- Hard invariants enforced via `throw new Error(...)` — never silently ignored.
- Add TSDoc comments on every exported function and type.

**Test suite rules:**
- Import with `import { describe, it, expect } from 'vitest'`.
- Cover: happy path, edge cases, invariant violations (expect `toThrow`), performance.
- Use `performance.now()` for timing assertions (e.g. `< 50ms`).
- Seed data loaded from `../../07-demos/<id>/data/` for integration tests.
- Target 100% branch coverage for the invariant logic paths.

### Step 6 · Register in `07-demos/README.md`

Add a row to the table in `07-demos/README.md`:

```markdown
| `<id>` | <What it is, one sentence> | <Date built, e.g. 2026-09-27> | <What is faked or not faked> |
```

### Step 7 · Register in `src/data/doseBooks.ts`

Add a chapter entry so the demo files are navigable in the frontend book viewer:

```typescript
'<id>': [
  {
    slug: 'readme',
    label: 'README',
    labelEn: 'README',
    path: '07-demos/<id>/README.md',
  },
  {
    slug: 'ticket-01',
    label: 'Ticket 01: <Short title>',
    labelEn: 'Ticket 01: <Short title EN>',
    path: '07-demos/<id>/ticket-01-<slug>.md',
  },
  // add more chapters for each additional ticket
],
```

---

## 4. Verification Checklist

Run after every build:

```bash
export PATH="/home/felix/.nvm/versions/node/v26.3.1/bin:$PATH"
npm run lint && npm test
```

All of the following must pass with zero errors:
- [ ] `tsc --noEmit` — TypeScript types clean.
- [ ] `check:dosen` — Markdown ↔ `src/data/dosen.ts` in sync.
- [ ] `check:books` — all `doseBooks.ts` chapter paths exist on disk.
- [ ] `check:idea-frontmatter` — frontmatter consistent.
- [ ] `check:protokoll` — every Dose has a Prüfprotokoll entry.
- [ ] `check:friedhof` — no zombie ideas.
- [ ] All Vitest suites green (including the new `<engineName>.test.ts`).

---

## 5. Handoff Contract (From Packer to Demo Builder)

The Dose Packer sends the Demo Builder:
1. The Dose `id` and `title`.
2. The `firstStepDe.ticket` and `firstStepDe.criteria` text (source of the DoD).
3. The `sketchDe` description (source of the engine architecture).
4. Any hard invariants listed in `failureModeDe`.
5. The research file path in `02-recherche/` (for algorithm references).

---

## 6. Common Pitfalls

| Pitfall | Remedy |
|---|---|
| Forgetting to update `07-demos/README.md` | `check:books` will not catch this — it's a manual step |
| `doseBooks.ts` path with wrong relative root | All paths are relative to the repo root, not to `src/` |
| Engine throws but test expects a value | Check that invariant tests use `expect(() => ...).toThrow()` |
| Seed data not matching schema `required` fields | Run `ajv validate -s schema.json -d data.json` locally |
| Missing `CC0` license footer | Grep for `CC0` in every new file before committing |
| Deep-link pointing to bare homepage | Always append `#dose=<id>` to the Amélie GitHub Pages URL |

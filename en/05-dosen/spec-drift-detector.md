# Spec-Drift Detector

**One sentence:** A CI check that verifies prose specifications against the actual implementation and turns the build red on divergence.

**As of:** September 2026 · **Recheck by:** March 2027 (fast-moving field)
**Recipient:** GitHub Spec Kit (discussion), Tessl · **Verdict:** 🔒 **keep and build** — spread the idea publicly anyway

---

## The problem

Spec-driven development has no immune system.

The spec gets written, the agent builds from it, and from the first refactor onward the implementation drifts away from the spec. Nobody notices, because nothing checks it: tests check the code against itself, linters check syntax, reviews check the diff. Nobody checks the spec.

The damage is asymmetric and grows: **from the moment of divergence, the agent reliably builds the wrong thing, with a justification attached.** It reads a spec that's no longer true and draws correct-sounding conclusions about a state that doesn't exist. That's worse than having no spec at all, because it looks authoritative.

Who suffers: every repo where spec documents count as the source of truth — currently four of mine.

## Why now

1. **Checking prose against code has only recently become possible.** "Does this document say something about behavior that the code doesn't do" was, until recently, not an automatable question. That's the entire reason this doesn't exist yet.
2. **Spec-driven development has just become the standard** — with GitHub Spec Kit and commercial platforms. The practice has existed broadly for about a year; the matching control tool hasn't.
3. **CI integration is trivial.** A check that turns red needs no new infrastructure.

## Sketch

- Input: spec documents (Markdown) + the code they refer to.
- Break the spec down into **checkable statements** — every claim about behavior, interfaces, invariants becomes a check point anchored in the document.
- Per statement: look for evidence in the code. Three outcomes — **covered**, **contradicted**, **not found**.
- Output: a report plus an exit code. Contradicted turns it red, not found turns it yellow.
- **Cache keyed on spec hash and code hash**, or every CI run is too expensive.

**Not included:** no generating code from the spec, no rewriting the spec. Only the finding that the two have diverged — plus the location.

## First step

**Ticket: one document, ten statements, one exit code.**

Break one spec file into statements, check each against the repo, output a report, exit with code 1 on contradiction.

**Done when:** it finds a real divergence in one of my own repos that I didn't know about — and no false alarm in the first pass.

## Where it breaks

**False alarms kill this tool within a week.** A CI check that turns red for no reason gets disabled, permanently. That's the single most dangerous failure point. Countermeasures: an extremely conservative threshold, never treat "not found" as an error, and a `# spec-drift: ignore` for deliberate deviations.

**Second risk: cost.** Checking the entire spec against the entire repo on every commit is unaffordable. Only changed sections against changed files, everything else from cache.

**Third risk:** the spec is sometimes *correctly* ahead — it describes what should be built. A tool that flags that as an error misunderstands spec-driven development. So every statement needs a status: *decided* or *planned*.

## Who's already tried it

Research, September 2026, and the result splits in two:

- **API schema drift is a mature, commercial market.** Several vendors compare OpenAPI specs against live traffic or implementation. That half is occupied and uninteresting.
- **Prose spec drift is open — and is currently being publicly named as a problem.** In 2026, pieces appeared describing exactly this as the recurring trap of the spec-driven-development movement (the "prose spec-drift trap, reloaded"). There are a few small scattered repos, but no established tool.

**Hence 🔒:** the problem is real, I have it myself across several repos, the gap is named and unoccupied, and the self-interest payoff is immediate. That's the best reason to build there is.

**And spread it anyway:** the idea costs me nothing once it's public, and it will get built by several parties regardless. A post in the Spec Kit discussion is a gift to the movement and costs me no lead time — my lead comes from having this problem daily.

## Prior work

- **GitHub Spec Kit** — open-source toolkit for spec-driven development, discussions open, exactly this problem space.
- **Tessl** — "spec as source" as their product thesis; drift detection is the missing half.
- **OpenAPI drift tools** — for the schema half, as a model for reporting and CI behavior.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

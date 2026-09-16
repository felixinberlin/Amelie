# Agent Postmortem Recorder

**One sentence:** Not another dashboard about agent sessions, but the consequence of one — the concrete `CLAUDE.md` patch against the misunderstanding class that's statistically costing you the most.

**As of:** September 2026 · **Recheck by:** March 2027 (fast-moving field)
**Recipient:** the Claude Code plugin community · secondary: existing hook-observability projects (as a PR), Anthropic DevRel
**Verdict:** 🔨 build a skeleton first, then give away — a weekend

---

## The problem

Anyone who uses agents seriously accumulates frustration in the form of repetition: the same misunderstood instruction, the same file in the wrong place, the same convention that never sticks. The information about this sits entirely in the session logs. It just never turns into a change.

The existing tools stop at the wrong point. They measure: tokens, tool calls, read/edit ratio, cost, error rates. That answers *what happened*. It doesn't answer the only question that leads to an improvement: **which three lines should have been in the instruction file so this wouldn't happen?**

Who suffers: everyone with multi-agent setups — exactly the people for whom the repetition multiplies.

## Why now

1. **The logs are structured and local.** Hook events and session transcripts already exist in machine-readable form — nothing needs to be instrumented, only read.
2. **Classifying error patterns across many sessions has become cheap.** "These 14 corrections are the same root cause" is exactly the kind of task that used to be manual labor.
3. **The output is a diff, not a report.** And a diff can be applied. That's the difference between insight and improvement.

## Sketch

- Runs locally over existing session logs, no telemetry, nothing leaves the machine.
- Looks for **correction loops**: places where the human reined the agent back in — abort, revert, "no, do it differently," a repeated attempt on the same file.
- Clusters these across sessions into root-cause classes, sorted by cost (time, tokens, attempts).
- Output: a **patch proposal** for `CLAUDE.md` or the relevant skill/rule file, one rule per cluster, with evidence — "this rule addresses 14 corrections across 9 sessions, here are three examples."

**Not included:** no live dashboard, no cloud, no scores. Anyone who wants observability already has it.

## First step

**Ticket: find and count correction loops.**

A script that reads local session logs and outputs the ten most frequent correction patterns — no patch generation yet, just the list with frequency and an example.

**Done when:** reading the list stings — i.e., it shows you something you wouldn't have known yourself.

## Where it breaks

**This thing can bloat an instruction file until it gets worse.** Every added rule competes with all the others for attention — a 200-line `CLAUDE.md` gets followed worse than a 30-line one. A tool that automatically proposes rules has a built-in tendency to sprawl. **Countermeasure: it must also propose rules to delete** — which existing rule was never needed, which one gets ignored anyway. Without the deletion side, it's net harmful.

**Second risk:** correlation, not causation. That the human corrected something doesn't mean a rule was missing — sometimes the task was just unclear. The patch proposal has to present itself as a hypothesis, not a finding.

## Who's already tried it

Research, September 2026: the **analysis half is occupied.** There are session analyzers for Claude Code logs (thinking depth, read/edit ratio, cost, behavioral signals), OpenTelemetry setups, hook-based live dashboards, and transcript-analysis skills.

**The prescriptive half is open.** No tool found closes the loop from "here's the pattern" to "here's the rule change, apply it." That makes the tin narrower than originally thought — and sharper: it's explicitly **not** an observability project, but a patch generator that can sit on top of existing observability.

## Prior work

- Existing hook-event and session-analysis projects — as a data source, and as a place for a PR rather than a wish.
- OpenTelemetry integrations for agent sessions — the measurement side to build on top of.
- The Claude Code plugin ecosystem — here, building *is* the giving away: publish, done.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

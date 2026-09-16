# Ghost Replay for Editing

**One sentence:** Your own editing rhythm played back as a "ghost," Trackmania style — not what you wrote, but how you moved through the code, including the forty seconds of scrolling before every decision.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** HCI and software-engineering research · secondary: editor DevEx teams, bootcamps and mentors
**Verdict:** 🎁 give away **to research** — as a question, not a product. Narrowed, see below.

---

## The problem

We measure developer work by its artifacts: commits, lines, closed tickets, and lately tokens. All these measures have one thing in common — they kick in **after** the decision.

The work itself happens before that and goes unobserved: jumping between four files, scrolling back to the same function three times, the pause in which it becomes clear that the assumption was wrong. Every experienced person knows that's where the time goes. There's no instrument for it, even though every editor produces the data.

This is precisely a **research question** dressed up as a toy: how do developers actually navigate through code, and do beginners and experts differ systematically? The Trackmania metaphor — your own ghost racing beside you — isn't decoration here, it's the reason anyone would voluntarily record this.

Who benefits: research groups who can publish exactly this; mentors who want to see the process and only get the result.

## Why now

1. **Recording is cheap and local.** Cursor position, viewport, file switches, search actions — all accessible via editor APIs, without capturing content.
2. **The analysis is new.** Condensing movement traces into patterns — "orientation phase," "targeted jump," "search loop" — used to be manual coding by researchers, hour after hour of video. That's exactly what's now automatable, and that's why the question is workable today and wasn't five years ago.
3. **Playback in the browser** has become trivial; the trace is a small time-series format.

## Sketch

- Recording as an extension: a time series of file, cursor line, viewport, search events. **No content**, only positions — that's what makes it shareable.
- Playback: your own history as a ghost over the current file, speed-adjustable.
- Analysis: phase detection, dwell time per region, return frequency ("which function did you look at seven times").
- **Comparison as a core feature, not an extra:** same task, two people — that's the moment something gets learned.

**Not included:** no productivity metric, no score, no employer evaluation.

## First step

**Ticket: record and play back one session.**

An extension that logs positions, plus a viewer that animates the trace over the file.

**Done when:** watching it teaches you something about yourself you didn't know before.

## Where it breaks

**This is a surveillance tool if set up wrong — and the wrong setter-upper is almost always an employer.** A trace showing when someone looked at what, for how long, is performance monitoring in an employment relationship. In Germany that also triggers co-determination requirements, but the real problem isn't legal, it's cultural: the moment the trace can leave the device, the tool loses its purpose, because nobody works honestly anymore while it's running.

**The only sustainable design:** local, voluntary, deletable at any time, no server component, no team view. And the natural home is therefore **research** with consent, not a product with terms of service.

**Second risk:** observer effect. Knowing you're being recorded changes how you work. Manageable for research, a fundamental problem for self-insight.

## Who's already tried it

Research, September 2026, and it narrows this tin considerably: **the recording technology exists.** There are tools that record and replay typing sessions, and session replay for editor tasks in exam and assessment contexts. As a "new tool," the idea is largely occupied.

**What's open is the question, not the technology:** systematically analyzing and comparing movement patterns, rather than just replaying sessions. That's not a product, that's a paper. Which is why this tin goes to research groups, not editor vendors — and why it needs no accompanying code, just a well-posed question.

## Prior work

- Existing **record-and-replay tools for editor sessions** — nobody needs to rebuild the recording layer.
- **HCI and software-engineering research** (CHI, VL/HCC, ICSE circles; in Germany, groups with a developer-experience focus) — a publishable open question, no code required, ideal recipient type.
- **Bootcamps and mentors** — the ghost shows the rhythm a code review never sees.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

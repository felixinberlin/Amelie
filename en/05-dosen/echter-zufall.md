# True Randomness as a Service

**One sentence:** An MCP server between a noise diode and an agent — thirty lines of code, and every dice roll, every sigil, every card draw pulls from physical noise instead of `Math.random()`.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** Infinite Noise TRNG (`waywardgeek/infnoise`, distributed via leetronics in Germany) · secondary: the Crowd Supply/Hackaday public, cryptography education
**Verdict:** 🔨 build a skeleton first, then give away — solo maintainer, so come with code

---

## The problem

There are two worlds that have never met.

In one, open, affordable TRNG hardware has been sitting around for years: noise diodes, ring-oscillator jitter, finished USB sticks for under a hundred euros, fully documented. It's used almost exclusively for cryptography, where it belongs.

In the other, millions of applications pull randomness from a pseudo-random generator seeded with the system clock. For cryptography that would be fatal; for a dice game it doesn't matter — **except where the randomness itself is the point.** A tarot app, a dice oracle, an I Ching, a generative artwork, a lottery procedure: there, where the randomness comes from isn't an implementation detail, it's half the point.

Who suffers: no one urgently. But it's one of the few ideas in the stack where **an afternoon of work produces permanently useful infrastructure.**

## Why now

1. **MCP standardized the plug.** Previously every application would have needed its own integration. Now it's a tool server that any number of agents and applications can call.
2. **The hardware is finished and open.** Nothing needs to be developed, only connected.
3. **Suddenly there are consumers.** Agentic applications that roll dice, draw lots, or generate things have become numerous only recently. The demand side is barely two years old.

## Sketch

- A Raspberry Pi or any computer with a TRNG stick.
- MCP server with three tools: `random_bytes(n)`, `random_int(min, max)` (with correct, unbiased rejection sampling), `draw(from_list, k, with_replacement)`.
- **A health endpoint as the core, not an afterthought:** running min-entropy estimate, source status, and an honest answer when the hardware is unreachable.
- **Never silently fall back to `Math.random()`.** If the source is gone, the call is an error. A server that secretly delivers pseudo-randomness defeats the entire idea.

**Not included:** no cryptography claims, no certification, no key material. For real cryptography, use the OS CSPRNG — that's not modesty, it's correctness.

## First step

**Ticket: pass bytes through, report status.**

An MCP server that reads the hardware, provides `random_bytes`, and reports estimated min-entropy in the health check.

**Done when:** an agent can roll dice, and unplugging the stick produces a clear error instead of silent fallback values.

## Where it breaks

**The biggest danger is theater.** For 99% of applications, physical randomness is no better than a good PRNG — it's just more honest about where it comes from. Marketing it with security promises sells superstition to people who can't verify it. The right positioning is aesthetic and epistemic, not security-technical: *you know where this number came from.*

**Second risk:** availability. A service tied to a device on someone's desk will occasionally be unavailable. Hence the hard failure instead of a fallback — and hence this belongs to someone who's running the hardware anyway.

## Who's already tried it

Research, September 2026: there's an MCP server for random numbers, but software-based. **I didn't find a bridge from real noise-source hardware to MCP.** The hardware scene (TRNG sticks, Crowd Supply projects, research on entropy sources) and the agent scene are two separate worlds with zero overlap.

This gap is small and obvious enough that it's probably closed within twelve months. So: soon, or never.

## Prior work

- **Infinite Noise TRNG** (`waywardgeek/infnoise`, Crowd Supply history, distributed via leetronics in Germany) — finished open hardware with a driver. **Solo maintainer: approach only with working code, never as a feature request.**
- **MCP registries** — the distribution path once the server runs.
- **Its own neighbor tins** — the tarot DSL and dice toys are the first consumers. A gift that serves other gifts.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

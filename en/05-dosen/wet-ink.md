# Wet Ink

**One sentence:** Ink on paper as a real simulation — capillary flow, bleeding, fiber anisotropy, edge darkening. One physics, deep rather than wide.

**As of:** September 2026 · **Recheck by:** September 2027
**Verdict:** 🔒 **keep** — but the **plan** gets given away
**Recipients of the plan:** Escape Motions (Rebelle), the calligraphy and sumi scene, the WebGL demoscene, education (graphics seminars)

---

## Why this tin is different

Here it's not the idea that gets given away, it's the **map**. The thing itself, I'm building.

That's not a contradiction of Amélie, it's Rule 5 in action: anyone who only gives away never builds. Two ideas stay, this is one of them — because it takes twelve days, needs no infrastructure, and there's something to look at from day three.

Something real still gets given away: **a fully worked-out implementation plan** that doesn't exist anywhere else — including a CPU reference implementation for testing GPU kernels, visual regression tests, and an honest warning about SVG export. For anyone planning something similar, that's worth more than the idea itself.

## The problem (for recipients of the plan)

Five effects distinguish real ink from a Photoshop filter: feathering along the fibers, edge darkening on the dried rim, backruns where wet meets damp, granulation in the paper's valleys, dry brush skipping over the paper's peaks. All five fall out of the physics when you model it correctly — and out of no texture when you don't.

The pitfall that kills projects like this has a name, and it's in the plan: **without a capillary threshold, everything goes soft and cloudy.** It ends up looking like smoke, not ink. That's why feathering (P2) comes before flow (P3) — a sequencing decision you'd normally only make after two lost weeks.

## Why now

1. **WebGL2 with float textures** makes three coupled simulation layers possible in real time in the browser — previously desktop software territory.
2. **Kubelka-Munk instead of alpha blending** is the difference between "looks like ink" and "looks like a filter": layers stack like real glazes.
3. **Testability is solved, but nobody writes it down.** The trick — implement every kernel twice, once as a shader and once as a slow CPU loop, and compare both at 32×32 — is why this project is doable in twelve days instead of three months of flying blind.

## Sketch

Three layers as float textures: paper (height, fiber direction, capacity), surface water (height, velocity, dissolved pigment), fiber layer (saturation, deposited pigment — what you actually see).

Seven passes per step, order matters: input → velocity → divergence relaxation → advection → **capillary flow with a threshold** → transfer → evaporation. Edge darkening falls out of step 7 for free, if you don't force it.

The full plan with phases, tests, risks, and reading list: `wet-ink-plan.md`.

## First step

**P0: WebGL2 harness and paper generator.** Ping-pong FBOs, seeded fBm for the grain, a direction field for the fibers, a capacity map. Done when blank paper with grain is on screen and three presets look visibly different.

## Where it breaks

**"Looks like smoke, not ink"** is the most likely outcome, and the countermeasure is a sequencing decision, not a technique: capillary threshold first.

**Tuning eats the project.** Fifteen coupled parameters; without a debug panel from P1 and preset export from P2, every good setting gets lost again.

**The SVG export is the weakest link.** A fluid simulation is raster. What works is marching squares on multiple iso-levels — a banded vector shape. That's a **style**, not a reproduction, and it has to be communicated early, or it creates disappointment.

## Who's already tried it

**Escape Motions / Rebelle** has done real fluid-watercolor simulation for years, currently at version 8.3 — desktop, commercial, very good. That's not a reason not to build this, it's the reason they're recipients of the plan: a WebGL2 variant isn't competition, it's a demonstration that this physics runs in the browser.

Academically, the field is well covered and openly accessible: Curtis et al. (SIGGRAPH 1997) for the layer model, Chu & Tai ("MoXi," SIGGRAPH 2005) for ink in absorbent paper, Stam ("Stable Fluids," 1999) for the advection. **The papers aren't the problem. The implementation order is** — and that's in none of them.

## How the plan gets given away

Not now. **Once P2 is running and a GIF exists** showing directional feathering on Japanese paper: publish the plan as a blog post or gist, the GIF is the distributor. Before that it's a claim, after that it's evidence.

---

The plan belongs to no one. Take it, build from it, sell the result — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

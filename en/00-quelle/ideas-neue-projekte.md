# Vibe-code ideas — entirely new projects

None of this overlaps with tortilla-world / tortillaC / openCulinaryRuntime / tortilladepatatas.org / recipes-API / phone-motion-3d / OpenCIB / Kleinanzeigen-Agent / WBS Solvente / wesnoth-mcp.

Tags: **S** = weekend · **M** = a few weeks · **L** = a real project

---

## 1. Agent & MCP tooling

**git-archaeologist (MCP)** — **M**
Exposes repo history as a question interface: "why does this line exist?" → blame + PR + issue + discussion as one chain. Claude stops guessing why your code looks the way it does.

**Spec-Drift Detector** — **M**
CI check: an LLM compares spec documents against the actual implementation and fails the build on divergence. You have several spec-driven repos — this is exactly the gap that otherwise falls through manually.

**Agent Postmortem Recorder** — **S**
Hook-based logger for Claude Code sessions → statistics on *what* the agent regularly gets wrong. Output is a concrete CLAUDE.md patch, not a feeling.

**Diffgeist** — **S**
Watches your dependencies' release notes and greps them against your actual usage: "React 20 changes X, you use X in 4 places." A personalized changelog instead of a newsletter.

**Home-Network MCP** — **S**
Router/Fritzbox as a tool server: who's on the network, bandwidth, toggling DNS blocklists — via chat instead of a web UI.

---

## 2. Physics toys (your home turf, minus food)

**Wet Ink** — **M**
Ink on paper: capillary flow, bleeding, paper-fiber noise. WebGL brush, export as SVG/PNG. One physics, deep rather than wide.

**Altbau Thermal** — **L**
Draw a floor plan → thermal simulation: windows open/closed, radiators, exterior walls, air exchange. Berlin's pre-war housing stock as a sim sandbox, with an honest heating-cost curve.

**Pin Tumbler** — **M**
Lock-cylinder physics as a learning device: pins, springs, tolerances, feedback via phone vibration. Explains a mechanical system almost nobody has ever actually seen.

**Räucher-Sim (Smoke Sim)** — **S**
Smoke fluid sim that reacts to microphone input (breath moves the smoke). Meditative, no goal, no score.

**Kristallwachstum 3D (Crystal Growth 3D)** — **M**
Diffusion-limited aggregation in 3D space, parameters adjustable live, export as GLB. Every run is an object you can render or print.

---

## 3. Berlin / everyday life

**Sperrmüll-Radar (Bulky-Waste Radar)** — **M**
Photo of a street find → classification (chair, shelf, monitor) → geo-pin that expires after 12h. Extremely Berlin, extremely useful, no accounts needed.

**Commute Oracle** — **M**
No official ETA: you log your own trips, the model learns *your* route and tells you when you really need to leave. Small amount of data, honest result.

**Kiez-Lärmkarte (Neighborhood Noise Map)** — **L**
Phone mic measures only dB levels (never audio), aggregation local, map shows quiet windows per street. Privacy-first by design, or it's dead on arrival.

---

## 4. The esoteric corner, but as software

**Tarot as a state machine** — **M**
Cards are typed state transitions, a spread is a small program. You build a reading like a graph, and the animation falls out of the structure.

**Dream journal with a motif map** — **M**
Entries embedded locally, recurring motifs shown as a 3D cluster over time. Nothing leaves the device — that's the feature.

**True randomness as a service** — **S/Hardware**
Raspberry Pi + noise diode as a TRNG, serving entropy over MCP. Every dice roll, every sigil, every card draw in your apps pulls from real physical noise.

---

## 5. Meta / dev culture

**Repo Museum** — **M**
A walkable 3D gallery of your GitHub repos: repo = room, commits = exhibits, dead branches = the basement. react-three-fiber, generated from the API.

**Ghost Replay for editing** — **M**
Records your editing rhythm and plays it back as a "ghost," Trackmania style. Shows you how you actually move through code — including the 40 seconds of scrolling before every decision.

**Bugs → Spaced Repetition** — **S**
Every fixed bug automatically becomes a flashcard: symptom on the front, root cause on the back. After three months you know which error class is really costing you.

---

## If you had to pick one

Fastest payoff: **Spec-Drift Detector** (solves a problem you actually have, across several repos).
Prettiest thing: **Wet Ink** (one physics, immediately visible, no infrastructure).
Biggest thing: **Altbau Thermal** (sim engine + UI + real usefulness, scales into a product).

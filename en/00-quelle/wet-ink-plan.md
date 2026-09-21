# Wet Ink — Implementation Plan

Ink on paper as a real simulation: capillary flow, bleeding, fiber anisotropy, edge darkening.
A WebGL2 brush, not a paint program. **One physics, deep rather than wide.**

---

## 0. What the thing has to do (acceptance = the eye, not a unit test)

Five effects that real ink produces and Photoshop doesn't. If these are present, the project is done:

| Effect | Where it physically comes from |
|---|---|
| **Feathering** — fraying along the fibers | Capillary flow through the fiber network, anisotropic |
| **Edge darkening** — a darker rim on the dried spot | Water flows outward, evaporates there, pigment stays behind |
| **Backrun / cauliflower** — a cauliflower-shaped edge when wet meets damp | Pressure gradient pushes pigment back into the wetter zone |
| **Granulation** — pigment collects in the paper's valleys | Height field + deposition proportional to water depth |
| **Dry brush** — skipping over the paper's peaks | Brush only deposits where paper height < water film |

Everything else (layers, brush libraries, color wheels) is explicitly **out of scope**.

---

## 1. Physics model

Three layers, all as float textures on the GPU, ping-pong FBOs.

**Paper (static, generated once)**
- `height` — fBm noise, the tooth/grain
- `fiberDir` — anisotropic direction field (strong on Japanese paper, nearly isotropic on copier paper)
- `capacity` — how much water the fiber can locally absorb (sizing)

**Surface layer (the water still sitting on top)**
- `h` water height, `u,v` velocity, `p` dissolved pigment

**Fiber layer (what's been soaked in)**
- `s` saturation, `d` deposited pigment ← *this is what you see*

**One simulation step** (order matters):

1. **Input** — brush stamp writes `h`, `p` additively
2. **Velocity update** — pressure from `∇h`, viscosity, drag from paper height
3. **Divergence relax** — 20–40 Jacobi iterations, or it blows up
4. **Advect pigment** — semi-Lagrangian, `p` rides on `u,v`
5. **Capillary flow** — `s` diffuses through the fiber layer, **with a threshold**: only keeps flowing once `s > εmin`, damped along `fiberDir`. This threshold is the entire reason a blot has a *frayed* edge instead of a round one.
6. **Transfer** — surface → fiber (absorption rate α), dissolved → deposited (deposition/lift-off, Curtis-style)
7. **Evaporate** — `h` shrinks; fastest at the edge → edge darkening falls out for free

**Rendering:** Kubelka-Munk instead of alpha blending. K/S coefficients per ink, so layers stack like real glazes instead of semi-transparent PNGs. That's the difference between "looks like ink" and "looks like a filter."

---

## 2. Stack & structure

Your stack, minus everything unnecessary. **No three.js** — these are fullscreen quads, not a scene.

- **Raw WebGL2** (+ `twgl` as 3kB sugar), `EXT_color_buffer_float`
- **TypeScript strict**, Vite, Vitest
- **React 19 only for the UI shell**, Zustand for parameters — the engine knows nothing about React
- No Canvas2D fallback. No WebGPU (not yet, see risks)

```
src/
  engine/            # framework-free, testable, exportable
    paper/           # generator: fBm, fibers, capacity
    sim/             # one module per pass, all the same signature
      velocity.ts  divergence.ts  advect.ts
      capillary.ts transfer.ts    evaporate.ts
    render/          # Kubelka-Munk compositing
    gl/              # FBO pool, ping-pong, shader loader
    reference/       # CPU reference implementation of the same kernels (32×32)
  brush/             # pointer → footprint → stamp
  ui/                # React: presets, sliders, export
  presets/           # ink + paper as JSON
```

**Why the CPU reference:** GPU simulations are otherwise untestable. Every kernel exists twice — once as a shader, once as a slow TS loop. The test runs both on 32×32 and compares. Costs discipline, saves you the week spent blindly fiddling with shaders.

---

## 3. Phases

Every phase ends with something you can **look at**. No "infrastructure sprint."

**P0 — Paper (0.5 day)**
WebGL2 context, ping-pong helper, paper generator, render. You see blank paper with grain.
✅ Deterministic: same seed → same framebuffer hash.

**P1 — The blot (1 day)**
Stamp writes water+pigment, absorption, evaporation. No flow. One click = one spot that dries.
✅ Mass conservation: water in == absorbed + evaporated, ±0.1%.

**P2 — Feathering (2 days) ← the centerpiece**
Capillary diffusion with a threshold and fiber anisotropy. The blot gets a frayed edge that looks different depending on the paper.
✅ Visual: the Japanese-paper preset frays visibly directional, copier paper stays round.

**P3 — Flow (2–3 days)**
Shallow water: velocity, divergence relaxation, pigment advection. Now you get backruns and blooms.
✅ Stable under dt spikes (tab switching) — CFL clamp kicks in, nothing explodes.

**P4 — Pigment (2 days)**
Deposition/lift-off, granulation, edge darkening, Kubelka-Munk. From here it looks like ink.
✅ Two layers of the same ink on top of each other = visibly darker, not muddy.

**P5 — Brush (1–2 days)**
PointerEvent: `pressure`, `tiltX/Y`, speed → footprint size, water amount, angle. Stroke interpolation between events (otherwise a "pearl necklace" effect on fast strokes). Dry brush.

✅ A fast stroke is thinner and drier than a slow one. Without anyone explaining why.

**P6 — Presets & UI (1–2 days)**
Ink: `Sumi`, `Fountain-pen blue`, `Sepia`. Paper: `Rough watercolor`, `Copier paper`, `Japanese paper`, `Blotting paper`.
Presets are versioned JSON and encodable into the URL → a recipe can be shared. Undo = layer snapshot every N seconds.

**P7 — Export (1–2 days)**
- **PNG** — primary. High-res via re-simulation on a larger grid with the same seed + event log.
- **SVG** — *honestly the weakest link.* A fluid sim is raster. Realistically: marching squares on `d` at N iso levels → Douglas-Peucker → a banded vector shape. That's a **style**, not a reproduction. Sell it as "screen-print export" and the expectation lines up. If you need true vector fidelity, that's a different project.

**Total: ~12 working days.** P2 and P4 are where the tuning time goes — budget generously there.

---

## 4. Testing (because you want to see green before the next phase starts)

Four layers, all in Vitest:

1. **Invariants** — mass conservation, no NaNs, `s` never > `capacity`. `gl.readPixels` readback, headless via Playwright/Chromium.
2. **GPU vs. CPU** — every kernel against its reference implementation at 32×32, tolerance 1e-4.
3. **Determinism** — fixed seed, fixed timestep, N steps → stable hash. Catches accidental frame dependencies.
4. **Visual regression** — 6 scenarios (single blot, wet-on-wet, fast stroke, dry brush, two layers, Japanese paper), screenshot vs. golden PNG with pixelmatch, 1% tolerance. This is the test that actually protects you — physics regressions are *visible*, not numeric.

CI: Node + headless Chromium, runs in under 2 minutes.

---

## 5. Risks, honestly

| Risk | Reality | Response |
|---|---|---|
| **Float textures on mobile** | iOS restricts float blending | Default to `half-float` (RGBA16F) from the start, full float only as opt-in |
| **Shallow water blows up** | Guaranteed to happen on tab switch (dt = 3s) | Fixed timestep with sub-steps, velocity clamp, CFL check |
| **"Looks like smoke, not ink"** | The most likely outcome | Hence P2 before P3: capillary threshold first. Without it, everything goes soft and cloudy |
| **Tuning eats the project** | 15 parameters, all coupled | Debug panel from P1, preset export from P2, nail down every good setting as JSON immediately |
| **SVG expectations** | See P7 | Communicate early, not at the end |

---

## 6. First ticket (Rewritten for Open Source & RTE Plugin)

**`Ticket #1: @wet-ink/core — Headless Fluid Kernel & TipTap/RTE Signature Node`**

- **Zero-dependency Core Engine** in `src/engine/wet-ink/` with no React or Three.js dependencies (< 15 kB)
- **Substrate Generator**: Seeded fBm (height/grain relief), anisotropic fiber vector field, moisture capacity map
- **7-Pass Simulation with Capillary Threshold $\varepsilon_{\min}$**: Eliminates the "smoke bug" and drives authentic physical feathering along paper fibers
- **3-Phase Lifecycle for Rich-Text Editors**:
  - *Phase 1 (Wet, 60 FPS)*: Active drawing dynamics, pressure/speed, fluid surface transport
  - *Phase 2 (Drying, ~3-4s)*: Perimeter contact line evaporation and physical edge darkening (coffee-ring effect)
  - *Phase 3 (Rest / Dormant, 0 FPS)*: Freeze state into `ImageBitmap`, killing animation loop (0% CPU/GPU at rest)
- **Dual Serialization Format**: Delta-compressed vector stroke event stream (1-4 KB) + baked PNG raster fallback
- **Done when:** A stroke on washi paper visibly feathers, darkens at the outer perimeter, freezes after 3 seconds, and rests inside a TipTap/ProseMirror document as a serialized block with 0% CPU consumption.

---

## 7. Reading list (in this order)

1. **Curtis et al., "Computer-Generated Watercolor," SIGGRAPH 1997** — the layer model, deposition/lift-off, edge darkening, Kubelka-Munk. The foundation.
2. **Chu & Tai, "MoXi: Real-Time Ink Dispersion in Absorbent Paper," SIGGRAPH 2005** — ink rather than watercolor, capillary flow through the fiber network, real-time capable. Closer to what you want.
3. **Stam, "Stable Fluids," 1999** — the advection/projection mechanics you'll need in P3.

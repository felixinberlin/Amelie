---
status: Available
delivery_method: E-Mail
target_maker: Escape Motions
review_score: 32/35
architecture_tier: Tier 1
source_type: Type D
---
# Wet Ink

**One-liner:** Ink on paper as a physical multi-layer simulation in the browser — capillary flow with pore thresholding, fiber anisotropy, Kubelka-Munk optical glazing, tactile Web Audio acoustics, and Marching Squares vector export in a headless decoupled SDK.

**Status:** September 2026 · **Review after:** September 2027  
**Live Simulator:** [felixinberlin.github.io/Amelie/#dose=wet-ink](https://felixinberlin.github.io/Amelie/#dose=wet-ink)  
**Verdict:** 🎁 **Gift** — Fully implemented, tested, and released as an open `@wet-ink/*` ecosystem under CC0 Public Domain  
**Review:** 32/35 · Tier 1 · Type D (Details: [Audit Report](../06-suche/amelie-39-dosen-audit-report.md))  
**Target Recipients:** Escape Motions (Rebelle), Rich-Text & Editor communities (TipTap, ProseMirror, Obsidian, tldraw), Calligraphy and Sumi-e circles, Graphics & WebGL educators  
**Scaffolding & Tests:** `src/engine/wet-ink/` · `packages/wet-ink-core/` · `packages/wet-ink-tiptap/` · `packages/wet-ink-react/` · `packages/wet-ink-obsidian/` (24 suites, 315 tests green)

---

## The Gift: Physical Fluid Dynamics Instead of Bitmap Stamps

Digital drawing and signature tools (in Photoshop, Procreate, DocuSign, or common web RTEs) rely almost exclusively on **repeated bitmap stamps** stamped along Bézier paths. They produce lifeless, uniform pixel or vector lines with zero physical awareness of the paper substrate beneath them.

Real wet ink on paper behaves fundamentally differently: it is a living interaction of fluid mechanics, porous capillarity, and optical pigment layering.

With **Wet Ink**, we are gifting a turnkey, zero-dependency WebGL2 engine and a modular SDK that brings authentic fluid ink physics directly into any browser — with no native desktop binaries, no cloud subscriptions, and zero server infrastructure.

---

## The Five Phenomena of Real Ink

From the 7-pass simulation, five classic behaviors of porous fluid drawing emerge deterministically from physical conservation laws:

1. **Feathering along Cellulose Fibers:** Ink travels capillarily through the paper's microscopic pore network. On directional Japanese paper (Washi), strokes feather anisotropically along fiber orientations; on laid or rough watercolor paper, ink pools along surface valleys.
2. **Edge Darkening (The Coffee-Ring Effect):** Thinner stroke edges evaporate faster than the fluid puddle core. A hydrodynamic replenishment flow carries suspended pigment outward to the drying perimeter, depositing a sharp, dark rim.
3. **Backruns & Wet-on-Wet Bleeding:** Introducing a wet stroke into a drying, damp wash causes surface tension and concentration gradients to drive pigment backward into the existing moisture film (blooms and cauliflowers).
4. **Granulation in Paper Valleys:** Dense mineral pigments settle into microscopic hollows of rough papers, while lighter binders remain on ridges.
5. **Dry Brush over Peaks:** Rapid brush gestures with low moisture deposit pigment solely on paper elevations, leaving valleys untouched.

---

## Why This Is Possible Now

1. **WebGL2 with Float32 Textures:** Three coupled simulation textures (paper substrate, surface water, fiber deposition) run at 60 FPS in real-time across desktop and mobile GPUs.
2. **Kubelka-Munk Optical Layering:** Physical absorption ($K$) and scattering ($S$) spectra replace artificial alpha blending. Washes glaze subtractively like authentic mineral inks (Sumi, Iron Gall, Indigo, Cinnabar).
3. **The Capillary Threshold ($\varepsilon_{\min}$):** The key algorithmic safeguard. Without a strict capillary threshold, fluid diffuses softly like smoke in air. With the threshold, spread halts cleanly at pore boundaries.
4. **Web Audio Tactile Acoustics:** Procedural synthesis of nib friction sounds dynamically modulated by stroke velocity, pen pressure, and substrate roughness.
5. **Marching Squares Vectorization:** Deterministic multi-isocontour extraction (Wash, Body, Core) directly from simulation density fields, enabling resolution-independent vector SVG exports.

---

## The Modular Architecture (`packages/`)

The codebase is structured as a headless, decoupled SDK modeled after modern developer standards:

* **`@wet-ink/core` (`packages/wet-ink-core/`):**
  - Framework-agnostic controller (`WetInkController`).
  - Three-phase lifecycle: *Wet 60 FPS* $\rightarrow$ *Settling ~3s* $\rightarrow$ *0 FPS / 0% CPU Idle Rest*.
  - Procedural Web Audio synthesizer (`PenAudioSynthesizer`).
  - Marching Squares vector exporter (`WetInkSVGExporter`).
  - Native `<wet-ink-signature>` Web Component for vanilla HTML, Vue, Svelte, or Web Components.
* **`@wet-ink/tiptap` (`packages/wet-ink-tiptap/`):**
  - ProseMirror NodeView adapter for TipTap and RTE platforms.
  - Serializes strokes, bakes vector SVGs, and integrates fluid signatures directly into document transaction histories.
* **`@wet-ink/react` (`packages/wet-ink-react/`):**
  - Declarative `<WetInkSignature />` component with preset handling.
  - Flexible `useWetInk()` hook for custom canvas controllers.
* **`@wet-ink/obsidian` (`packages/wet-ink-obsidian/`):**
  - Markdown codeblock processor (````wet-ink````) for personal vaults, handwritten notes, and PDF exports.

---

## Simulation Pipeline & Physics Passes

Seven sequential shader passes per simulation step:

$$\text{Input (Stylus/Pressure)} \longrightarrow \text{Velocity} \longrightarrow \text{Divergence Relaxation} \longrightarrow \text{Advection} \longrightarrow \mathbf{\text{Capillary Flow}}\ (\varepsilon_{\min}) \longrightarrow \text{Transfer} \longrightarrow \text{Evaporation}$$

- **Layer 1 — Paper Substrate:** Roughness heightfield $h(x,y)$, fiber grain vector $\vec{f}(x,y)$, and local moisture capacity.
- **Layer 2 — Surface Water:** Free fluid puddle with velocity field $\vec{u}(x,y)$ and dissolved pigment density.
- **Layer 3 — Stained Fibers:** Bound moisture and pinned pigment deposits (the permanent visible artwork).

---

## Completed Tickets & Verification

* **Ticket #1: `@wet-ink/core` — Headless Fluid Kernel & TipTap/RTE Signature Block.**
  * *Status:* **Completed & verified.** 7-pass simulation, capillary thresholding, 3-phase lifecycle, and ProseMirror integration.
* **Ticket #2: Tactile Acoustics, Blotting Action & Vector SVG Export.**
  * *Status:* **Completed & verified.** Integrated into `@wet-ink/core` and Amélie's interactive simulator (`WetInkSimulator.tsx`).
* **Test Suite:** 24 test suites with 315 tests passing with zero errors (`simulation.test.ts`, `kubelka-munk.test.ts`, `WetInkController.test.ts`, `WetInkExtension.test.ts`, `WetInkReact.test.ts`, `WetInkObsidian.test.ts`).

---

## Failure Modes & Countermeasures

* **"Looks like smoke, not ink":** The standard failure in porous media simulation. Solved by enforcing the capillary threshold $\varepsilon_{\min}$ prior to advection.
* **CPU/Battery Drain:** Continuous simulation would throttle mobile devices. The idle monitor transitions into a 0 FPS sleep state immediately upon drying.
* **Vector SVG vs. Raster Fluid:** Fluid grids are continuous raster fields. Solved via multi-level Marching Squares generating clean, banded vector geometry.

---

## Prior Art & Distinction

* **Escape Motions (Rebelle 8):** Commercial desktop gold standard ($89–$150). Superb fluid watercolor physics, but closed C++ desktop software without web embeddability or open SDKs. Wet Ink proves authentic fluid physics in standard browsers.
* **Adobe Fresco:** Closed iOS/Windows subscription app requiring Adobe CC login. Wet Ink operates completely client-side without logins, telemetry, or server dependencies.
* **Expresii (MoXi / Chu & Tai 2005):** Renowned East Asian ink simulation on DirectX 11. Wet Ink brings these physical principles to universal WebGL2 standards.

---

## Delivery & Public Domain Dedication

This tool and its entire source code belong to no one. Take it, embed it into your editors, extend it, or build commercial products on top — you owe no one anything, not even a reply.

**CC0 1.0 Universal / Public Domain.** — Félix, Berlin · github.com/felixinberlin

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
* **Ticket #3: Chinese Calligraphy & Seal Art (书法与篆刻).**
  * *Status:* **Completed & verified.** Three Xuan paper maturation grades (`sheng-xuan`, `ban-shu-xuan`, `shu-xuan`), specialized Mao-Bi hair dynamics for `langhao` (weasel), `yanghao` (goat), and `jianhao` (hybrid), interactive practice grids (Mi Zi Ge, Jiu Gong Ge, Yongzi Bafa with 8 fundamental strokes), and authentic cinnabar seal impressions (Zhuwen & Baiwen with chipped antique stone edges).
* **Ticket #4: Color Science, Percolation Fractals & Paper Chromatography.**
  * *Status:* **Completed & verified.** Saunderson (1942) Fresnel boundary formulation for air-substrate optical interfaces, ISO/CIE 11664-6 CIEDE2000 ($\Delta E_{00}$) color difference engine validated against Sharma (2005) ground truth, box-counting fractal dimension ($D_f$) of capillary boundaries distinguishing invasion percolation on raw Xuan ($D_f \ge 1.25$) from sized paper ($D_f \approx 1.00$), and radial paper chromatography following Lucas (1918) & Washburn (1921) with size-exclusion Darcy pore filtration (*Fen-Mo* 分墨 pigment splitting).
* **Ticket #5: Non-Newtonian Rheology, DLVO Colloid Stability, Deegan Coffee-Ring & Wetting Regimes.**
  * *Status:* **Completed & verified.** Cross (1965) and Carreau-Yasuda (1972) shear-thinning viscosity with Herschel-Bulkley yield stress ($\tau_y$) and thixotropic structural recovery ($\tau_{\text{rec}}$), DLVO colloid stability (Derjaguin & Landau 1941, Verwey & Overbeek 1948) with evaporative Debye double-layer collapse and irreversible pigment granulation, Deegan (1997) singular contact-line evaporative divergence $J(r)$ with depth-averaged continuity flow $\bar{v}_r(r)$ and Marangoni counter-circulation, and Wenzel (1936) / Cassie-Baxter (1944) topography wetting transitions with Laplace breakthrough pressure.
* **Ticket #6: Continuum Kubelka-Munk Optics, Meniscal Transfer Dynamics, Cake Filtration Pore Clogging & Subtractive Glazing Mechanics.**
  * *Status:* **Completed & verified.** Full continuum spectral optical field $(\mathbf{K}, \mathbf{S}) \in \mathbb{R}^3$ per grid cell following Duncan (1940) and Kubelka-Munk (1931). Preserves deposited pigment optical signatures independently when switching active palette pigments, produces rich subtractive optical mixing (Cadmium Yellow + Prussian Blue $\to$ Emerald Green), eliminates premature hard clamping via Laplace-Young meniscal fluid transfer $\eta_h(h)$ and Krieger-Dougherty colloidal packing limits $\eta_p(p)$, models cake filtration pore resistance (Hermia 1982 / Ruth 1935, $\frac{1}{1 + 0.45 \cdot d_i}$), and authentic standing-water lift-off/re-suspension.
* **Ticket #7: Mo Fen Wu Se (墨分五色) Ink Wash Dilution, Continuous HSL Color Formulation & Non-Destructive Redo History.**
  * *Status:* **Completed & verified.** Physical scaling of pigment concentration across traditional dilution grades (*Jiāo* 焦 scorched/dry $\to$ *Nóng* 浓 dense dark $\to$ *Zhòng* 重 balanced standard $\to$ *Dàn* 淡 translucent wash $\to$ *Qīng* 清 whisper mist), continuous HSL slider mixer with native system eyedropper, Deegan-symmetric WebGL2 dual-slot deposition, and comprehensive keyboard & UI-driven Undo/Redo state management (Ctrl+Z / Ctrl+Y).
* **Ticket #8: Brush Tip Geometries & Expressive Capillary Bleeding (Yunran 晕染 & Po Mo 破墨).**
  * *Status:* **Completed & verified.** Five physical brush footprint geometries (`round` pointed Zhongfeng, `flat` 45° chisel ribbon with 1:0.35 aspect ratio, `slanted` Cefeng side-cutting blade, `fan` 4-cluster split bristle striations, and `dagger` tapered leaf teardrop). Expressive capillary bleed action (`pulseBleed`) with film-to-fiber transfer and threshold-relaxed wicking along paper fibers under strict float-precision mass conservation of fluid, pigment, and optical spectra.
* **Ticket #9: Brush Bristle Materials (毛料 - Weasel, Goat, Hybrid, Bristle, Sable), Elasticity, Fluid Reservoirs & Acoustic Friction.**
  * *Status:* **Completed & verified.** Five authentic physical brush materials (`weasel` / Langhao 狼毫 with high spring stiffness $\kappa=0.85$ and dynamic snap-back thinning, `goat` / Yanghao 羊毫 with thirsty fluid reservoir $\Omega=1.45$ and luscious broad deflection, `mixed` / Jianhao 兼毫 as balanced master all-rounder with weasel core in goat mantle, `horse` / Maha/Zhubin 马毫/猪鬃 with rugged fiber striations and early *Fei Bai* dry-brush skipping, and `sable` / Zihao 紫毫 with velvety continuous flow without scratchiness). Modulates physical speed-thinning exponents, fluid release, and acoustic friction synthesizer audio.
* **Test Suite:** 70 test suites with 1029 tests passing with zero errors (`calligraphy.test.ts`, `rheology.test.ts`, `dlvo.test.ts`, `evaporation-deegan.test.ts`, `wetting-regimes.test.ts`, `color-science.test.ts`, `chromatography.test.ts`, `metrics.test.ts`, `simulation.test.ts`, `kubelka-munk.test.ts`, `WetInkController.test.ts`, `WetInkExtension.test.ts`, `WetInkReact.test.ts`, `WetInkObsidian.test.ts`).

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

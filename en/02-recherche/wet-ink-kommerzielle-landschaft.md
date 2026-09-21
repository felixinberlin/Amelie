# Research: Commercial Landscape for Fluid Ink & Digital Watercolor Physics

**Topic:** Commercial applications, proprietary software suites, and brush pack economies — and why releasing Wet Ink as a free, open-source web engine (CC0 / MIT) fills a major void.

**Date:** September 2026 · **Author:** Félix (Berlin) · Amélie Project  
**References:** Tin #10 (`05-dosen/wet-ink.md`), Implementation Plan (`00-quelle/wet-ink-plan.md`), RTE Architecture (`04-werkzeug/wet-ink-rte-plugin.md`)

---

## 1. Market Overview: Who Sells This Physics and for How Much?

Porous fluid dynamics, cellulose capillary action, and pigment advection have been well-established in academic literature for decades (Curtis et al. SIGGRAPH 1997, Chu & Tai SIGGRAPH 2005). Yet commercially, this physics is almost exclusively gatekept inside **expensive desktop monoliths**, **cloud subscriptions**, or **static bitmap stamp illusions**:

| Product / Vendor | Pricing Model | Platform & Type | Technical Reality & Limitations |
|---|---|---|---|
| **Escape Motions: Rebelle 8** | **$89.99 – $149.99** (one-time) | Desktop (Windows / macOS) | **Gold standard for digital fluid watercolor.** Full Navier-Stokes surface transport, pigment granulation, wet edge fringing. However: Closed proprietary C++ desktop software. No browser runtime, no embeddable SDK, cannot be dropped into document editors. |
| **Adobe Fresco / Creative Cloud** | **$9.99/mo** or CC bundle (~**$65/mo**) | iPad / Windows Surface | **"Live Brushes".** Excellent visual wash blending, but locked into Adobe Creative Cloud, Adobe IDs, and native app silos. Zero open API, zero embeddability. |
| **Expresii (Nelson Chu)** | **$69.00** (desktop license) | Windows Desktop (DirectX 11) | Direct commercialization of the *MoXi* research (Chu & Tai 2005). Beautiful Asian ink and calligraphy dynamics. Standalone monolithic program, requires heavy dedicated GPUs, no web integration. |
| **Corel Painter 2024** | **$429.00** or **$199/yr** | Desktop (Windows / macOS) | "Real Watercolor" and "Digital Watercolor". Very heavy legacy codebase, desktop-only, no web standards. |
| **Procreate & Photoshop Brush Packs** (GrutBrushes, MaxPacks, Kyle Webster) | **$15 – $45** per pack | Add-on brush stamps | **The bitmap illusion:** These are NOT fluid simulations. They are repeated static PNG stamps with textured perimeter masks. Adjacent strokes have no awareness of paper fibers; no authentic edge darkening or cauliflower backruns. |
| **E-Signature SaaS** (DocuSign, Adobe Sign, PandaDoc) | **$10 – $40/user/mo** | Web SaaS | Signatures are lifeless, uniform black vector curves. Zero paper interaction, zero drying dynamics, immediately recognizable as synthetic digital vectors. |

---

## 2. Why Hasn't This Existed as Open Source on the Web?

1. **The "Too Heavy for the Browser" Myth:** Developers commonly assume fluid porous simulation requires multi-gigabyte VRAM and native C++ binaries. Our Wet Ink architecture disproves this: on an optimized 384×256 Float32 grid, a 7-pass simulation step executes in < 2 ms on standard mobile CPUs.
2. **Conflating Painting Apps with Physics Kernels:** Commercial teams always build an entire bloated painting suite (layers, color wheels, PSD exporters). They sell the software suite rather than the focused physics kernel.
3. **The Algorithmic Pitfall ("The Smoke Bug"):** Naive fluid models produce soft, smoky blur instead of ink. Because academic textbooks gloss over the percolation threshold ($\varepsilon_{\min}$), open-source attempts usually stall in early phases.

---

## 3. The Open-Source Gift: Free Web Infrastructure

We do not build a $150 proprietary painting app. We gift the **physics kernel as a zero-dependency npm package (`@wet-ink/core`)**:

* **License:** CC0 / Public Domain / MIT — unconditionally free.
* **Size & Footprint:** Framework-free TypeScript micro-library (< 15 kB gzipped), no Three.js or WebAssembly requirement.
* **Ecosystem Targets:**
  - **TipTap / ProseMirror:** Margin annotations and live-drying ink signatures directly inside rich-text documents.
  - **tldraw:** Organic sumi-e and fountain pen brush on infinite collaborative canvases.
  - **Obsidian / Logseq:** Tactile handwritten zettelkasten sketches and marginalia.
  - **Open-source E-Signatures:** Real iron-gall signatures that soak into document paper and dry in real time.

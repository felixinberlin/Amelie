# Commercial Opportunity: Wet Ink Pro SDK & Plugins

**ID:** `wet-ink-pro-sdk`  
**Amélie Twin:** `wet-ink` (Dose #10)  
**Status:** **Ready for Launch** (Bundled in `packages/wet-ink-tiptap/wet-ink-pro-editor-plugin-v1.0.0.zip`)  
**Category:** Developer Tool / Creative & Legaltech SDK  
**Target Buyer:** TipTap/ProseMirror Developers, E-Signature Startups, Luxury Brand Platforms, Digital Whiteboard Apps, Obsidian Users  

---

## 1. The Core Commercial Problem
Existing digital signature and drawing tools on the web produce lifeless, flat black SVG vector paths. Real ink and watercolor physics (Navier-Stokes fluid advection, capillary paper grain diffusion, edge darkening, and drying dynamics) currently exist only in proprietary desktop silos (Rebelle for $150, Adobe Fresco at $65/mo) or heavy DirectX/C++ native apps.
- **The Pain:** Legaltech, luxury document platforms, and creative note-taking apps want authentic, tangible pen-and-paper signatures and ink rendering, but cannot build Navier-Stokes capillary physics in JavaScript.
- **The Solution:** An ultra-lightweight (<15 kB) 7-pass Float32 fluid simulation engine running at <2 ms per frame on mobile CPUs, packaged as a Pro plugin for **TipTap**, **ProseMirror**, **React**, and **Obsidian**.

---

## 2. The 5 Commercial Vectors

| Vector | Rating | Analysis |
|---|:---:|---|
| **1. Pain & WTP** | **4/5** | High aesthetic and differentiation value for document SaaS, luxury portals, and creative webapps. Developers pay $49–$499 for pro canvas plugins. |
| **2. Time-to-Ship** | **5/5** | **Fully Built:** Package at `packages/wet-ink-tiptap/` with TipTap NodeView, React drop-in `<WetInkSignature />`, Marching Squares SVG export, Web Audio nib acoustics, and 11 Vitest tests. |
| **3. Distribution** | **5/5** | Developer ecosystem: TipTap community, ProseMirror forums, React ecosystem, Obsidian Community Plugins, GitHub, ProductHunt, Reddit (r/webdev, r/reactjs). |
| **4. Monetization** | **4/5** | $49 (Solo Dev) / $149 (Team / Multi-App) / $399 (OEM & Source) on Lemon Squeezy. |
| **5. Defensibility** | **5/5** | High mathematical barrier: solving Navier-Stokes on a Float32 grid with capillary threshold ($\varepsilon_{\min}$) avoiding the "smoke bug" without requiring WebGL/GPU shaders, paired with real-time procedural audio synthesis. |

---

## 3. Shipped Deliverables (`packages/wet-ink-tiptap/`)
1. **Interactive Demo:** `demo/index.html` with side-by-side dead vector vs. live fluid canvas, real-time procedural audio, tool selector, blotting paper action, and live SVG export.
2. **TipTap & ProseMirror Extension:** Full NodeView lifecycle with automatic dormant freeze (0% CPU, 0 FPS).
3. **React Drop-In Component:** `<WetInkSignature />` with imperative ref handles (`exportPNG`, `exportSVG`, `blot`, `clear`).
4. **Obsidian Integration:** Codeblock processor adapter and integration guide (`docs/OBSIDIAN_INTEGRATION.md`).
5. **Procedural Nib Friction Audio:** Web Audio synthesizer simulating microscopic nib friction with zero external sound assets.
6. **Marching Squares Multi-Iso SVG Vectorizer:** Traces capillary wash, pigment body, and dense core into 300+ DPI scalable SVGs.
7. **Production Archive:** `wet-ink-pro-editor-plugin-v1.0.0.zip` ready for Lemon Squeezy digital delivery.

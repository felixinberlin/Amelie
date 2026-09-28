# Commercial Opportunity: Wet Ink Pro SDK & Plugins

**ID:** `wet-ink-pro-sdk`  
**Amélie Twin:** `wet-ink` (Dose #10)  
**Status:** Architecture Validated (`02-recherche/wet-ink-kommerzielle-landschaft.md`)  
**Category:** Developer Tool / Creative & Legaltech SDK  
**Target Buyer:** TipTap/ProseMirror Developers, E-Signature Startups, Luxury Brand Platforms, Digital Whiteboard Apps  

---

## 1. The Core Commercial Problem
Existing digital signature and drawing tools on the web produce lifeless, flat black SVG vector paths. Real ink and watercolor physics (Navier-Stokes fluid advection, capillary paper grain diffusion, edge darkening, and drying dynamics) currently exist only in proprietary desktop silos (Rebelle for $150, Adobe Fresco at $65/mo) or heavy DirectX/C++ native apps.
- **The Pain:** Legaltech, luxury document platforms, and creative note-taking apps want authentic, tangible pen-and-paper signatures and ink rendering, but cannot build Navier-Stokes capillary physics in JavaScript.
- **The Solution:** An ultra-lightweight (<15 kB) 7-pass Float32 fluid simulation engine running at <2 ms per frame on mobile CPUs, packaged as a Pro plugin for **TipTap**, **ProseMirror**, **tldraw**, and a standalone **Authentic Signature Widget**.

---

## 2. The 5 Commercial Vectors

| Vector | Rating | Analysis |
|---|:---:|---|
| **1. Pain & WTP** | **4/5** | High aesthetic and differentiation value for document SaaS, luxury portals, and creative webapps. Developers pay $49–$499 for pro canvas plugins. |
| **2. Time-to-Ship** | **4/5** | Physics simulation kernel, Kubelka-Munk optical math, and paper grain model already built and verified in `src/engine/wet-ink/` (27 Vitest tests). |
| **3. Distribution** | **5/5** | Developer ecosystem: TipTap community, ProseMirror forums, tldraw extension library, GitHub, ProductHunt. |
| **4. Monetization** | **4/5** | $49 (Single site developer license) / $299 (Commercial SaaS / OEM embed license) on Lemon Squeezy / Gumroad. |
| **5. Defensibility** | **5/5** | High mathematical barrier: solving Navier-Stokes on a 384x256 Float32 grid with capillary threshold ($\varepsilon_{\min}$) avoiding the "smoke bug" without requiring WebGL/GPU shaders. |

---

## 3. Minimum Viable Product (MVP) Scope
1. **Interactive Demo:** Side-by-side canvas showing dead SVG vector lines vs. realistic ink bleeding and drying.
2. **NPM Distribution:** Private NPM package (`@wet-ink/pro`) accessible via license token.
3. **Plug-and-play Adapters:** Pre-built extensions for TipTap and React Canvas.

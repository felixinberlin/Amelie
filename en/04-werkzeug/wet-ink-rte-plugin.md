# Wet Ink as an RTE Plugin: Concept, Architecture & Ecosystems

**One sentence:** How to embed real physical ink simulation (capillary flow, edge darkening, paper granulation) as a lightweight open-source plugin into modern Rich Text Editors and infinite canvas tools.

**Date:** September 2026 · **Status:** Architectural Documentation & Specification  
**Reference:** Tin #10 (`05-dosen/wet-ink.md`) · Implementation Masterplan (`00-quelle/wet-ink-plan.md`)

---

## 1. Premise: Why Fluid Physics in a Text Editor?

Standard freehand drawing tools in digital editors (Apple Pencil on iPad, Excalidraw, Notion sketches) produce smooth Bézier curves with sterile, uniform opacity. They feel like CAD paths rather than ink.

Real ink on porous paper possesses three fundamental physical traits that no vector path renderer replicates:
1. **Substrate Interaction:** Ink bleeds microscopically into cellulose fibers (*anisotropic feathering* along the paper grain).
2. **Temporal Drying Dynamics:** A stroke takes several seconds to dry. At first, the wet fluid film reflects light with a liquid sheen; then suspended pigment drifts outward to form a crisp perimeter (*coffee-ring edge darkening*).
3. **Glazed Layering:** Where two strokes cross, real ink doesn't blend into murky 50% alpha gray; it deposits pigment according to optical absorption principles (Kubelka-Munk optical density).

### Core Use Cases in Text Editors
* **Marginalia & Proofreading Red-Lines:** Underlines, margin notes, and crossed-out phrases that bleed organically into the page substrate.
* **The Wet Ink Signature Block:** Authentic signature blocks that visibly soak into document paper and dry in real time.
* **Calligraphic Drop-Caps & Vignettes:** Hand-drawn initials, sumi-e chapter dividers, and ink sketches between prose paragraphs.
* **Tactical Personal Journals & Zettelkästen:** Note-taking environments (Obsidian, Logseq) where users seek tactile, analog writing aesthetics.

---

## 2. Three Integration Patterns in the Rich-Text DOM

A Rich Text Editor manages paragraphs, headers, and lists as structured document nodes. Wet Ink can be integrated using three distinct architectural patterns:

```
Pattern A: Atomic Block           Pattern B: Margin Overlay        Pattern C: Ephemeral Drying
┌─────────────────────────┐      ┌───────┬─────────────────┐      ┌─────────────────────────┐
│ Paragraph prose         │      │   🖋   │ Paragraph text  │      │ Typed text or freehand  │
├─────────────────────────┤      │(Margin│ with red-line   │      │ calligraphic initial    │
│ [ Wet-Ink-Canvas-Block] │      │ note) │ stroke-through  │      │ [sheen pools -> dries]  │
├─────────────────────────┤      └───────┴─────────────────┘      ├─────────────────────────┤
│ Next paragraph          │      (Transparent layer over text)    │ Freezes to static bitmap│
└─────────────────────────┘                                       └─────────────────────────┘
```

### Pattern A: The Atomic Block (`Inline / Block NodeView`)
* **Behavior:** Functions like an interactive math formula (`$$ \LaTeX $$`) or diagram block.
* **Use case:** Signature lines, sketch boxes, illuminated initials.
* **Focus:** Clicking activates the brush toolbar (fountain pen, sumi brush, ink wash).

### Pattern B: The Margin & Overlay Layer (`Marginalia`)
* **Behavior:** A z-indexed canvas layer floating over or alongside document columns.
* **Anchor:** Coordinates bind to block IDs (`data-node-id="p-42"`). When paragraphs shift during editing, ink annotations transform accordingly.
* **Use case:** Editorial proofreading, glosses, academic marginalia.

### Pattern C: Ephemeral "Live-Drying" with Automatic Freeze
* **Behavior:** The 60 FPS physics loop runs while drawing. Once the pointer lifts, water evaporates over 3–4 seconds. When dry, the state freezes into a cached `ImageBitmap`, killing the animation loop.
* **Use case:** Essential performance guarantee for long documents containing dozens of drawings.

---

## 3. Ecosystem Target Analysis: Best Open-Source Candidates

### Target 1: TipTap / ProseMirror *(Industry Standard)*
* **Relevance:** TipTap is the dominant headless RTE framework today (powering GitBook, GitLab, and numerous Notion alternatives). ProseMirror provides the deterministic state model.
* **Integration Strategy:**
  * Implement as a custom TipTap Node (`WetInkExtension`).
  * Custom `NodeView` using `@tiptap/react` or vanilla JavaScript.
  * HTML Serialization:
    ```html
    <figure class="wet-ink-block" data-paper="buetten" data-pigment="sepia" data-seed="1042">
      <img src="data:image/png;base64,..." alt="Wet Ink Signature" />
      <script type="application/json" class="wet-ink-raw">
        {"strokes": [...], "params": {...}}
      </script>
    </figure>
    ```
* **Advantage:** Embeddable in any modern web application without framework lock-in.

### Target 2: tldraw *(Modern Open-Source Infinite Canvas)*
* **Relevance:** tldraw is the leading open-source collaborative whiteboard in the web ecosystem.
* **Integration Strategy:**
  * Implement as a custom shape (`WetInkShapeUtil`).
  * Replaces flat vector strokes with a physical porous substrate layer.
  * Bounding-box isolated: Fluid simulation executes strictly inside the shape's bounding box, avoiding entire-canvas overhead.
* **Advantage:** Native pressure, speed, and tilt stylus handling (Apple Pencil, Wacom) are already solved in tldraw.

### Target 3: Obsidian (Community Plugin)
* **Relevance:** Obsidian has an active community passionate about calligraphic aesthetics, journaling, and digital zettelkästen.
* **Integration Strategy:**
  * Custom Markdown Code Block Processor:
    ````markdown
    ```wet-ink
    paper: washi
    pigment: sumi
    preset: signature
    strokes: eJzt1zEOgCAMAMD/kDYs... (compressed coordinates)
    ```
    ````
  * Immediate rendering in Reading view; click to edit in Live Preview.
* **Advantage:** High organic community adoption.

### Target 4: Lexical (Meta)
* **Relevance:** Modern, accessible, and fast successor to Draft.js.
* **Integration Strategy:** Custom `DecoratorNode` (`WetInkNode`) mounting an isolated canvas container.

---

## 4. The Performance & Lifecycle Solution

A naive implementation would run dozens of active WebGL or Canvas simulation loops simultaneously, causing CPU spikes and battery drain.

The **Three-Phase Lifecycle Model** solves this completely:

```
[INTERACTION]                [SETTLING]                   [FROZEN DORMANT]
Stylus contacts canvas ──>   Stylus lifted          ──>   Water evaporated
- 60 FPS physics loop        - 30 FPS settling            - 0 FPS (Loop terminated!)
- Velocity & advection       - Edge darkening finalizes   - Offscreen ImageBitmap
- Active fluid cells         - Evaporation (t < 5s)       - 0% CPU / 0% GPU
                             ▲
                             │ (Click to rehydrate)
                             └─────────────────────────────
```

1. **Phase 1: WET (Interactive, 60 FPS)**
   - Only active on the currently focused node.
   - Updates fluid velocity, semi-Lagrangian advection, and capillary transfer.
2. **Phase 2: SETTLING (Drying, ~3–5 seconds)**
   - When drawing ceases, fluid velocity advection halts.
   - Evaporation and contact line edge darkening continue until moisture drops below $water < 0.001$.
3. **Phase 3: FROZEN (Dormant, 0 FPS)**
   - `cancelAnimationFrame` terminates the loop completely.
   - The dried stain transfers into an offscreen `ImageBitmap`.
   - During regular document reading and scrolling, the block costs exactly as much memory and CPU as a standard `<img>` tag.
4. **Rehydration:** When the user clicks the block with a pen tool, the dried stain re-loads into float buffers, allowing fresh ink to interact (which naturally creates authentic cauliflower backruns over the old dried strokes!).

---

## 5. Serialization: How to Store Wet Ink

Document formats require compact, diffable, and portable persistence.

### The Dual Storage Model

A Wet Ink block stores two synchronized representations:

1. **Event Stream (Compact, Deterministic, Editable):**
   * Paper seed (`seed: 42`)
   * Presets (`paper: "washi"`, `pigment: "sepia"`)
   * Delta-encoded stroke coordinates: `[x, y, pressure, dt]`.
   * Size: Only **1 to 4 KB** per drawing.
   * Scalability: Re-simulates at arbitrary target resolutions for high-DPI print exports.

2. **Baked Rendering (Portable, Offline Fallback):**
   * PNG Data URL or asset reference.
   * Portability: If exported to PDF or opened in an editor without the Wet Ink plugin, the final artwork displays cleanly.

### Vector Export (SVG)
* As established in the 12-day masterplan: a fluid simulation is raster-based.
* Naive vector tracing creates messy mesh triangles.
* **The Clean Solution:** Marching Squares across 3 to 5 iso-density thresholds produces layered vector bands. Marketed as **"Risograph / Woodcut Vector Export"**, this yields clean, artistic outputs suitable for pen plotters and vector design tools.

---

## 6. Modular Package Architecture

For an open-source rollout, a monorepo structure cleanly decouples the physics core from editor adapters:

```
packages/
  ├── @wet-ink/core            # Framework-free simulation (zero DOM/React dependencies)
  │     ├── paper/             # Seeded fBm, fiber vectors, capacity maps
  │     ├── sim/               # Capillary percolation, edge darkening, granulation
  │     └── render/            # Optical compositing, freeze-to-bitmap
  │
  ├── @wet-ink/tiptap          # TipTap / ProseMirror Node extension
  │     ├── WetInkNode.ts      # Schema, parsing, serialization
  │     └── WetInkView.tsx     # React/DOM NodeView with lifecycle & toolbar
  │
  ├── @wet-ink/tldraw          # tldraw custom shape extension
  │     └── WetInkShapeUtil.ts # Bounding-box shape with stylus dynamics
  │
  └── @wet-ink/obsidian        # Standalone Obsidian Community Plugin
        └── main.ts            # Markdown code block processor
```

---

## 7. Summary

Wet Ink as an RTE plugin bridges the longstanding divide between sterile vector drawing tools and cumbersome desktop painting applications.

Because the core engine is:
- **under 15 kB gzipped**,
- **free of heavy 3D frameworks**,
- **implemented in pure TypeScript Float32 array kernels**,
- **and consumes 0% CPU in its dormant frozen state**,

it is primed to serve as an open-source extension for **TipTap**, **tldraw**, and **Obsidian**, bringing the tactile depth of physical ink back to digital documents.

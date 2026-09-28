# @wet-ink/core
> **Universal Headless Physical Fluid Ink & Watercolor Engine**

The framework-agnostic foundation powering **Wet Ink Pro** plugins for TipTap, ProseMirror, React, Vue, Svelte, Obsidian, and Native Web Components.

---

## 🌟 Capabilities

- **7-Pass Navier-Stokes Fluid Advection & Capillary Bleeding:** Ink wicks along authentic paper fiber relief (Washi, handmade Bütten, rough watercolor, standard paper).
- **Procedural Web Audio Synthesizer:** Real-time paper-nib friction sound modulated by velocity, pressure, and paper tooth. 0 external sound files, 0 latency.
- **Marching Squares Multi-Iso Vector SVG Export:** Traces 3 physical density levels (wash fringe, stroke body, dense core) into crisp, resolution-independent vector SVGs suitable for 300+ DPI legal contracts.
- **3-Phase Zero-CPU Lifecycle:** 60 FPS while drawing $\to$ Settles & evaporates $\to$ Freezes to static ImageBitmap (0 FPS / 0% CPU).
- **Native Web Component:** Comes with `<wet-ink-signature>`, ready to drop into any HTML, Vue, Svelte, or Angular app with zero framework wrappers.

---

## 🚀 Headless Quickstart (Vanilla Canvas)

```typescript
import { WetInkController } from '@wet-ink/core';

const canvas = document.querySelector('canvas')!;
const controller = new WetInkController({
  target: canvas,
  paper: 'washi',
  pigment: 'eisengallus',
  tool: 'fountain-pen',
  enableAudio: true,
  onSave: ({ png, svg, strokes }) => {
    console.log('Saved vector SVG:', svg);
  }
});

// Programmatic controls
controller.blot(); // Instantly dry surface ink
const vectorSvg = controller.exportSVG();
const rasterPng = controller.exportPNG();
```

---

## 🌐 Native Web Component Drop-in

```html
<script type="module" src="node_modules/@wet-ink/core/dist/index.js"></script>

<wet-ink-signature 
  paper="buetten" 
  pigment="eisengallus" 
  width="500" 
  height="180" 
  audio="true">
</wet-ink-signature>
```

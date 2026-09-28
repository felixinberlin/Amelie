# @wet-ink/tiptap
> **Physical Fluid Ink & Watercolor Extension for TipTap and ProseMirror.**

Give your web application real, physical ink. Simulate Navier-Stokes fluid advection, capillary paper fiber bleeding, Kubelka-Munk optical color blending, and drying dynamics right inside your rich-text editor—with **0% CPU/GPU overhead when dormant**.

---

## 🌟 Why Wet Ink?

Standard digital signature and drawing tools generate lifeless, uniform black SVG Bézier curves. They look like cheap Microsoft Paint annotations.

**Wet Ink Pro** delivers authentic physical pen-on-paper aesthetics:
1. **Capillary Fiber Bleeding:** Ink wicks anisotropically along real cellulose paper fibers (Washi, handmade Bütten, rough watercolor).
2. **Kubelka-Munk Layering:** Crossing strokes physically blend pigments based on spectral absorption and scattering—never naive muddy alpha blending.
3. **Wet Glimmer & Edge Darkening:** Watch ink glisten when wet, migrate to the contact perimeter (coffee-ring effect), and dry permanently into the sheet.
4. **The 3-Phase Lifecycle:** Active 60 FPS while signing $\to$ Settles and evaporates $\to$ **Freezes to static ImageBitmap (0 FPS / 0% CPU load)**.

---

## 📦 Installation

```bash
npm install @wet-ink/tiptap
```

*(Requires `@tiptap/core` and `@tiptap/pm` as peer dependencies).*

---

## 🚀 Quickstart in TipTap

```typescript
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { createTipTapWetInkExtension } from '@wet-ink/tiptap';

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [
    StarterKit,
    createTipTapWetInkExtension({
      defaultPaper: 'buetten',       // 'buetten' | 'washi' | 'aquarell-rau' | 'kopierpapier'
      defaultPigment: 'eisengallus',  // 'eisengallus' | 'sumi' | 'sepia' | 'indigo'
      defaultWidth: 480,
      defaultHeight: 160,
      dryingTimeLimit: 4000,          // automatically freezes at 0 FPS after 4 seconds
      enableToolbar: true
    })
  ],
  content: `
    <h2>Mutual Non-Disclosure Agreement</h2>
    <p>Please provide your signature below:</p>
    <figure class="wet-ink-block" data-paper="buetten" data-pigment="eisengallus"></figure>
  `
});
```

---

## 🏛️ The 3-Phase Lifecycle

Rich-text documents often contain dozens of notes or signatures. A naive canvas simulation would run continuous RAF loops, draining the user's laptop battery.

Wet Ink solves this with a strict state machine:
- **Phase 1: WET (60 FPS):** Initiated on `pointerdown`. Captures pressure, velocity, and tilt. Fluid cells calculate pressure projection and advection.
- **Phase 2: SETTLING (Evaporation, 3–4 seconds):** On `pointerup`, input stops. Water evaporates, and pigment settles into paper valleys.
- **Phase 3: FROZEN (0 FPS, 0% CPU):** Once surface water reaches $h < 0.001$, `cancelAnimationFrame()` is called. The final rendering is baked into a static PNG data URL. The block now consumes exactly as many CPU cycles as an ordinary `<img>` tag.

---

## 💾 Dual Serialization (Universal Fallback)

When saving an editor document to HTML or JSON, Wet Ink stores both an editable vector event stream and a high-resolution baked PNG:

```html
<figure class="wet-ink-block" 
        data-paper="buetten" 
        data-pigment="eisengallus" 
        data-width="480" 
        data-height="160"
        data-strokes='[{"t":0,"p":[[10.5,20.3,0.65,0],...]}]'
        data-frozen="true">
  <!-- Universal fallback for print, PDF export, or email clients -->
  <img src="data:image/png;base64,iVBORw0KGgoAAA..." alt="Wet Ink Signature" />
</figure>
```

---

## 📜 Commercial License

Wet Ink Pro is available under commercial developer and OEM licenses via [Lemon Squeezy](https://lemonsqueezy.com):
- **Solo Developer License ($49):** 1 commercial application.
- **Pro Embed & TipTap SDK ($149):** Up to 3 commercial SaaS products + all paper and pigment presets.
- **Commercial OEM / Source ($399):** Unlimited projects, white-label, priority support, full source code.

*Created by Félix (Berlin) · Part of the Ventures Project.*

# @wet-ink/tiptap (Wet Ink Pro)
> **Tactile Fluid Ink & Watercolor Extension for TipTap, ProseMirror, React & Obsidian.**

Give your web applications and rich-text editors authentic physical ink. Simulate Navier-Stokes fluid advection, capillary paper fiber bleeding, Kubelka-Munk optical color blending, and drying dynamics—with **procedural nib acoustics, multi-contour vector SVG export, and 0% CPU overhead when dormant**.

---

## 🌟 Why Wet Ink Pro?

Standard digital signature and drawing tools generate lifeless, uniform Bézier lines. They look like cheap vector annotations.

**Wet Ink Pro** delivers true physical pen-on-paper aesthetics:
1. **Capillary Fiber Bleeding:** Ink wicks anisotropically along authentic cellulose paper fibers (Japanese Washi, handmade Bütten, rough watercolor, standard office paper).
2. **Procedural Nib Friction Audio:** Real-time acoustic synthesis reacts to stylus velocity, pressure, and paper roughness. 100% procedural Web Audio—zero external sound files, 0ms latency.
3. **Multi-Iso Vector SVG Export:** Marching Squares vectorizer traces 3 distinct physical density thresholds (wash feathering, pigment body, dense core) into crisp, resolution-independent SVGs suitable for 300+ DPI legal contracts.
4. **Blotting Paper ("Löschpapier"):** A single action absorbs surface water and immediately fixes pigment in place.
5. **The 3-Phase Lifecycle:** Active 60 FPS while signing $\to$ Settles and evaporates $\to$ **Freezes to static ImageBitmap (0 FPS / 0% CPU load)**.

---

## 📦 Installation

```bash
npm install @wet-ink/tiptap
```

---

## 🚀 Quickstarts

### 1. TipTap Extension

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
      defaultTool: 'fountain-pen',   // 'fountain-pen' | 'dip-pen' | 'sumi-brush'
      defaultWidth: 480,
      defaultHeight: 160,
      dryingTimeLimit: 4000,          // automatically freezes at 0 FPS after 4 seconds
      enableToolbar: true,
      enableAudio: true               // procedural nib acoustic synthesis
    })
  ]
});
```

### 2. Standalone React Drop-In Component

```tsx
import React, { useRef } from 'react';
import { WetInkSignature, WetInkSignatureHandle } from '@wet-ink/tiptap';

export function ContractSigningPage() {
  const sigRef = useRef<WetInkSignatureHandle>(null);

  const handleSave = () => {
    // Export 300+ DPI vector SVG with physical feathering
    const svgMarkup = sigRef.current?.exportSVG();
    const pngDataUrl = sigRef.current?.exportPNG();
    // Submit to legal contract backend
  };

  return (
    <div className="signature-container">
      <h3>Sign Agreement</h3>
      <WetInkSignature
        ref={sigRef}
        width={500}
        height={180}
        paper="buetten"
        pigment="eisengallus"
        tool="fountain-pen"
        enableAudio={true}
        enableToolbar={true}
      />
      <button onClick={handleSave}>Confirm Signature</button>
    </div>
  );
}
```

### 3. Obsidian Markdown Integration

See [docs/OBSIDIAN_INTEGRATION.md](./docs/OBSIDIAN_INTEGRATION.md) for registering the `wet-ink` codeblock processor for markdown notes and iPad / tablet stylus signing.

---

## 🏛️ The 3-Phase Lifecycle (Zero CPU Waste)

Rich-text documents often contain dozens of notes or signatures. A continuous canvas render loop would drain laptops and mobile batteries.

Wet Ink Pro implements a strict state machine:
- **Phase 1: WET (60 FPS):** Initiated on `pointerdown`. Captures pressure, velocity, and tilt. Fluid cells calculate pressure projection and advection. Real-time acoustic scratching synthesized via Web Audio.
- **Phase 2: SETTLING (Evaporation, 3–4 seconds):** On `pointerup`, input stops. Water evaporates, and pigment settles into paper valleys.
- **Phase 3: FROZEN (0 FPS, 0% CPU):** Once surface water reaches $h < 0.001$ or blotting paper is tapped, `cancelAnimationFrame()` is called. The final rendering is baked into a static PNG data URL. The block now consumes exactly as many CPU cycles as an ordinary `<img>` tag.

---

## 📐 Multi-Iso Vector SVG Export

Generate resolution-independent SVG files that capture physical capillary feathering:

```typescript
import { WetInkSVGExporter } from '@wet-ink/tiptap';

const svgString = WetInkSVGExporter.export(nodeView.getSimulation(), {
  thresholds: {
    wash: 0.04,     // capillary feathering halo
    midtone: 0.28,  // main body of ink
    core: 0.65      // dense core deposits
  },
  colorHex: '#1e1c18',
  backgroundColor: '#faf8f5',
  simplifyTolerance: 0.35
});
```

---

## 📜 Commercial Licensing

Wet Ink Pro is distributed under commercial developer and enterprise licenses via [Lemon Squeezy](https://lemonsqueezy.com):
- **Solo Dev / Single Project ($49):** 1 commercial application / webapp.
- **Team / Multi-App License ($149):** Up to 3 commercial SaaS products + all paper & pigment presets.
- **Enterprise OEM & Source ($399):** Unlimited projects, white-label, priority support, full source code access.

*Created by Félix (Berlin) · Part of the Ventures Project.*

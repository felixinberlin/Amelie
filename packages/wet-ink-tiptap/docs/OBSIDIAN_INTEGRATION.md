# Obsidian Integration Guide — Wet Ink Pro

Wet Ink Pro can be embedded into [Obsidian](https://obsidian.md) either as a Community Plugin or via an internal codeblock processor.

---

## 1. Quick Integration via Plugin CodeBlock

Add `registerWetInkCodeBlock` inside your Obsidian plugin's `onload()` lifecycle method:

```typescript
import { Plugin } from 'obsidian';
import { registerWetInkCodeBlock } from '@wet-ink/pro/obsidian';

export default class WetInkObsidianPlugin extends Plugin {
  async onload() {
    registerWetInkCodeBlock(this, {
      defaultPaper: 'washi',
      defaultPigment: 'eisengallus',
      enableAudio: true
    });
  }
}
```

---

## 2. Using Wet Ink in Obsidian Notes

In any Markdown note, insert a codeblock tagged `wet-ink`:

````markdown
```wet-ink
paper: buetten
pigment: eisengallus
width: 480
height: 160
```
````

### Supported Parameters:
| Key | Options / Type | Default | Description |
|---|---|---|---|
| `paper` | `buetten`, `washi`, `aquarell-rau`, `kopierpapier` | `buetten` | Substrate texture and fiber orientation |
| `pigment` | `eisengallus`, `sumi`, `sepia`, `indigo` | `eisengallus` | Ink chemical formulation and bleed speed |
| `width` | integer (px) | `480` | Canvas width |
| `height` | integer (px) | `160` | Canvas height |
| `readonly` | `true`, `false` | `false` | Lock strokes once completed |

---

## 3. PDF Export & Mobile Stylus Support

- **Apple Pencil & Samsung S-Pen:** Wet Ink captures high-precision pressure gradients and stylus velocity.
- **PDF Export:** When exporting an Obsidian note to PDF (`Ctrl + P` $\to$ *Export to PDF*), the block is automatically baked to a 300+ DPI vector SVG or high-resolution PNG, preserving physical feathering and drying rings.
- **0% Idle CPU:** Once a stroke dries, the physics loop cancels `requestAnimationFrame` and goes completely dormant.

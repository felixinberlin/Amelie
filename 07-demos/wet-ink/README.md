# Scaffolding & Demos: Wet Ink (Capillary Flow Simulator & Modular SDK)

Dieses Verzeichnis dokumentiert das lauffähige Scaffolding, die Tickets und die modulare Code-Architektur für die Dose **Wet Ink** (`05-dosen/wet-ink.md`).

---

## 🏛️ Architektur & Code-Bestandteile

Die Implementierung gliedert sich in die Simulations-Engine und vier modulare Integrations-Pakete:

1. **Simulationskern (`src/engine/wet-ink/`):**
   - 7-Pass-Simulation mit Navier-Stokes-Advektion und Kapillarschwelle ($\varepsilon_{\min}$).
   - Kubelka-Munk optisches Absorptions- und Streuungsmodell (`kubelka-munk.ts`).
   - Web Audio Taktil-Synthesizer (`audio.ts`).
   - Marching-Squares Multi-Iso Vektorkonverter (`svgExport.ts`).
   - 27 Unit-Tests (`simulation.test.ts`, `kubelka-munk.test.ts`).

2. **Modulares SDK (`packages/`):**
   - **`@wet-ink/core` (`packages/wet-ink-core/`):** Headless Controller, 3-Phasen-Lifecycle, Event-Emitter und `<wet-ink-signature>` Web Component.
   - **`@wet-ink/tiptap` (`packages/wet-ink-tiptap/`):** ProseMirror-NodeView für Rich-Text-Editoren mit Dokumenten-Transaktionen.
   - **`@wet-ink/react` (`packages/wet-ink-react/`):** `<WetInkSignature />`-Komponente und `useWetInk()`-Hook.
   - **`@wet-ink/obsidian` (`packages/wet-ink-obsidian/`):** Markdown-Codeblock-Prozessor für Obsidian-Notizbücher.

3. **Interaktiver Web-Simulator (`src/components/simulators/`):**
   - Live-Simulator im Amélie-Frontend (`WetInkSimulator.tsx`).
   - Physikalisches Shader-Labor (`WetInkPhysicsLab.tsx`).
   - Deep-Link: `https://felixinberlin.github.io/Amelie/#dose=wet-ink`

---

## 🧪 Tests ausführen

```bash
# Alle Vitest-Suiten (inkl. Simulation und aller Adapter) ausführen
npm test

# Nur Wet-Ink-spezifische Tests ausführen
npx vitest run wet-ink
```

---

## 📋 Ticket-Übersicht

- [x] **[Ticket #1: Core Fluid-Kernel & TipTap RTE-Adapter](ticket-01-core-engine-und-tiptap.md)** (Abgeschlossen & verifiziert)
- [x] **[Ticket #2: Taktile Reibungs-Akustik & Multi-Iso SVG-Export](ticket-02-akustik-und-svg-vektorisierung.md)** (Abgeschlossen & verifiziert)

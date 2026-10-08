# Ticket #1: `@wet-ink/core` — Headless Fluid-Kernel & TipTap/RTE Signatur-Block

**Status:** ABGESCHLOSSEN & VERIFIZIERT  
**Dose:** Wet Ink (`05-dosen/wet-ink.md`)  
**Pakete:** `packages/wet-ink-core/`, `packages/wet-ink-tiptap/`, `src/engine/wet-ink/`  

---

## Zielsetzung

Entwicklung einer framework-freien TypeScript-Engine (< 15 kB komprimiert) mit 7-Pass-Simulation, Kapillarschwelle $\varepsilon_{\min}$ und 3-Phasen-Lifecycle (*Nass 60 FPS* $\rightarrow$ *Trocknen 3s* $\rightarrow$ *0 FPS Ruhezustand / 0% CPU*). Lauffähig als quelloffenes Drop-in-Plugin in TipTap/ProseMirror, tldraw und Web-Formularen — ohne 150-Dollar-Lizenz, ohne Serverkosten und ohne native Desktop-Binaries.

---

## Definition of Done (DoD)

1. [x] **Kapillare 7-Pass-Simulation:** Input $\rightarrow$ Velocity $\rightarrow$ Divergenz-Relaxation $\rightarrow$ Advektion $\rightarrow$ Kapillarfluss ($\varepsilon_{\min}$) $\rightarrow$ Transfer $\rightarrow$ Verdunstung.
2. [x] **Kubelka-Munk Optik:** Subtraktive Absorption ($K$) und Streuung ($S$) für Sumi, Eisengallus, Ultramarin und Zinnober.
3. [x] **3-Phasen Lifecycle:** Aktives Zeichnen (60 FPS) $\rightarrow$ Trocknungsprozess (~3s) $\rightarrow$ Ruhezustand (0 FPS / 0 % CPU).
4. [x] **TipTap / ProseMirror Extension:** Custom NodeView mit Stroke-Serialisierung und Undo/Redo im Transaktions-Tree.
5. [x] **Tests:** Determinismus- und Invarianten-Tests in `simulation.test.ts` und `WetInkExtension.test.ts` bestehen zu 100 %.

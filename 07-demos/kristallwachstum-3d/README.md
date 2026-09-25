# Kristallwachstum 3D: Standalone Open Source Scaffolding

Dieses Verzeichnis stellt die offene Quellcode-Implementierung der in der Dose `kristallwachstum-3d` beschriebenen hybriden Pipeline bereit.

Es integriert die Erkenntnisse und Algorithmen aus den geprüften Referenz-Repositories:
- **`scttfrdmn/webgpu-compute-exploration`**: WebGPU WGSL Compute-Shader Scaffolding & Buffer-Uploads.
- **`fronkt/solidify`**: Kobayashi (1993) 3D-Phasenfeld-Gleichungen mit anisotroper Oberflächenenergie und den 5 wissenschaftlichen Gefügelinsen (`ORIENT`, `MELT`, `THERM`, `CURV`, `SEM`).
- **`markstock/dla-nd`**: Off-Lattice DLA mit analytischer sphärischer Driftkorrektur gegen Gitterartefakte.

---

## Architektur-Übersicht

```
[DLA Partikel-Injektion] (markstock/dla-nd)
          │
          ▼
[Quartic-Solver Zufalls-Schritt & Anchoring]
          │
          ▼
[3D Voxel Order Parameter phi]
          │
          ▼
[Kobayashi Phase-Field Relaxation] (fronkt/solidify)
          │  τ ∂φ/∂t = ∇·(ε²∇φ) + φ(1-φ)(φ - 1/2 + m(T))
          ▼
[5 Gefügelinsen & 3D Box-Counting D_f]
          │
          ▼
[Wasserdichtes 3MF / STL Mesh Export]
```

## Enthaltene Module

- `src/engine/kristallwachstum/shaders.wgsl.ts`: Reine WGSL-Shaderkerne für WebGPU-Browser-Ausführung.
- `src/engine/kristallwachstum/engine.ts`: Vollständige TypeScript-Simulationsklasse mit Box-Counting und ASCII-STL-Meshing.
- `src/engine/kristallwachstum/engine.test.ts`: Vitest-Testsuite zur Verifikation der fraktalen Dimension und Wasserdichtheit.
- `src/components/simulators/KristallwachstumSimulator.tsx`: Reaktives UI-Dashboard mit Echtzeit-Canvas, Linsen-Umschaltung und interaktiven Parametern.

---
Lizenz: CC0 1.0 Public Domain.

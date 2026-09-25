# Kristallwachstum 3D: Standalone Open Source Scaffolding

Dieses Verzeichnis stellt die offene Quellcode-Implementierung der in der Dose `kristallwachstum-3d` beschriebenen hybriden Pipeline bereit.

Es integriert die Erkenntnisse und Algorithmen aus den geprüften Referenz-Repositories:
- **`scttfrdmn/webgpu-compute-exploration`**: WebGPU WGSL Compute-Shader Scaffolding & Buffer-Uploads.
- **`fronkt/solidify`**: Kobayashi (1993) 3D-Phasenfeld-Gleichungen mit anisotroper Oberflächenenergie und den 6 wissenschaftlichen Gefügelinsen (`ORIENT`, `MELT`, `THERM`, `CURV`, `SEM`, `ZONING`) sowie interaktiver Schnitt-Ebene.
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
[6 Gefügelinsen, Z-Schnitt & 3D Box-Counting D_f]
          │
          ▼
[Wasserdichtes 3MF / STL Mesh Export]
```

## Enthaltene Module

- `src/engine/kristallwachstum/shaders.wgsl.ts`: Reine WGSL-Shaderkerne für WebGPU-Browser-Ausführung (DLA & Kobayashi Phase-Field).
- `src/engine/kristallwachstum/webgpuPipeline.ts`: WebGPU Compute Pipeline Runner mit Hardware-Erkennung und sauberem CPU-Fallback.
- `src/engine/kristallwachstum/engine.ts`: Vollständige TypeScript-Simulationsklasse mit Box-Counting und ASCII-STL-Meshing.
- `src/engine/kristallwachstum/engine.test.ts`: Vitest-Testsuite zur Verifikation der fraktalen Dimension, 50-Schritte-Relaxation und Wasserdichtheit.
- `src/components/simulators/KristallwachstumSimulator.tsx`: Reaktives UI-Dashboard mit 3D-Kamera, Z-Schnitt, 6 Gefügelinsen und interaktiven Parametern.

## Entwicklungs-Tickets

- [x] [Ticket 01: Hybride WebGPU-Dendriten-Keimung mit Kobayashi-Relaxation & D_f-Messung](./ticket-01-hybride-keimung.md) (Abgeschlossen & Verifiziert)
- [ ] [Ticket 02: GPU-Marching-Cubes Isosurface-Extraktion & Mehrfarbiger 3MF-Farbexport](./ticket-02-gpu-marching-cubes-3mf.md) (Nächster Schritt)

---
Lizenz: CC0 1.0 Public Domain.

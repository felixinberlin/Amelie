# Kristallwachstum 3D (Crystal Growth 3D)

**One sentence:** The first hybrid DLA phase-field pipeline in the browser: Brownian nucleation meets anisotropic Kobayashi thermodynamics — from fractal solidification didactics with 9 microstructure lenses to a watertight, 3D-printable recipe.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** FU Berlin Geosciences / Educational Publishers · secondary: Three.js/WebGPU demo scene, Nervous System (Jessica Rosenkrantz & Jesse Louis-Rosenberg), Printables/Prusa Community
**Verdict:** 🎁 give away — narrowed to hybrid pipeline & educational microstructure analysis

---

## The problem

Crystallization, dendritic solidification, and microstructure formation (from snowflakes and metallic alloys to geological pegmatites) are taught in schools and universities almost exclusively using static 2D textbook diagrams. Physically rigorous 3D simulations previously required supercomputer clusters.

Simultaneously, the creative coding and maker communities suffer from a twofold gap:
1. **The screensaver trap:** Thousands of Diffusion-Limited Aggregation (DLA) implementations produce pretty point-cloud renders, but ignore thermodynamic constraints (anisotropic surface energy, undercooling, orientation fields) and carry zero didactic value.
2. **The gap before 3D printing:** Between a fractal particle cloud and a physically printable object lies tedious, unglamorous geometry work: wall-thickness control, preventing fragile branches from snapping, enforcing overhang angles, and producing a guaranteed watertight manifold mesh.

## Why now

1. **WebGPU Compute Shaders (WGSL) in the browser:** Modern WebGPU pipelines simulate Brownian random walks and tens of thousands of grid cells in parallel at 60+ FPS directly on consumer GPUs.
2. **Hybrid DLA + Phase-Field synthesis:** The Kobayashi (1993) phase-field model for undercooled melts can now be solved on 3D volumetric grids (up to 192³ voxels) in WGSL. Coupling it with DLA particle nucleation produces physically realistic dendrite morphology without requiring high-performance computing clusters.
3. **GPU Marching Cubes & parametric recipes:** Watertight isosurface meshes can be extracted directly on the GPU. A concise seed string encodes the physical growth recipe and guarantees identical reproduction.

## Sketch

- **Stage 1 (WebGPU DLA Nucleation):** Spherical particle injection with an analytical quartic solver drift correction (after Mark Stock) to eliminate directional bias. An orientation SSBO stores crystal lattice axes per crystallite.
- **Stage 2 (Kobayashi Phase-Field Relaxation):** The DLA skeleton initializes the phase order parameter $\phi$. Discrete Allen-Cahn steps with anisotropic surface energy smooth interfaces, simulate thermal undercooling, and produce crystallographic facets (cubic, hexagonal).
- **Stage 3 (Scientific Microstructure Lenses & 3D Slicing):** Toggleable educational analysis layers with interactive 3D camera orbit and slicing plane:
  - `ORIENT`: Crystal grain orientation as an Inverse Pole Figure (IPF) false-color map.
  - `MELT`: Phase order parameter $\phi$ (liquid/solid interface boundary).
  - `THERM`: Local thermal and supersaturation field with latent heat release.
  - `CURV`: Mean surface curvature and Gibbs-Thomson effects.
  - `SEM`: Virtual scanning electron microscope illumination (BSE contrast).
  - `ZONING`: Petrological growth zoning (crystallization rings by birth iteration).
  - `Z-SLICE`: Interactive cross-section plane to inspect internal cavities and hopper funnels.
- **Stage 4 (Real-time Metrics & Print Recipe):**
  - Live calculation of fractal dimension $D_f$ via 3D octree box-counting.
  - Physical print constraints (minimum branch thickness, overhang limit) enforced directly in the growth solver.
  - Export: Watertight 3MF/STL for 3D printing alongside a shareable seed string (`K3D-[Seed]-[Params]`).

**Not included:** No proprietary slicer, no closed marketplace, no cloud batch computation (runs 100% locally in the browser).

## Research Book

- [Chapter 1: Educational & Physical Research](../../02-recherche/kristallwachstum-3d-didaktik-physik.md) — Analysis of WebGPU DLA (`scttfrdmn`, `markstock/dla-nd`), phase-field solidification (`fronkt/solidify`, Kobayashi 1993), and the 4-stage browser architecture.
- [Chapter 2: Open-Source Scaffolding](../../07-demos/kristallwachstum-3d/README.md) — Concrete WGSL compute kernels (`shaders.wgsl.ts`), DLA drift bias, box-counting, and STL meshing.

## Implementation Status & Next Step

- **Ticket 01 (Completed & Verified):** Hybrid Brownian DLA nucleation coupled with Kobayashi phase-field relaxation, 3D box-counting ($D_f$ measured against literature values), interactive 3D camera orbit, Z-slice cross section, 6 microstructure lenses, and watertight STL export (`src/engine/kristallwachstum/` & `KristallwachstumSimulator.tsx`).
- **Ticket 02 (Next Step): GPU Marching Cubes Isosurface Extraction & Multi-Color 3MF Export.**
  1. Marching Cubes kernel for smooth facet reconstruction at $\phi = 0.5$ eliminating voxel staircasing.
  2. Construction of valid 3MF OPC/ZIP packages with `<colorgroup>` material channels.
  3. Direct baking of EBSD-IPF crystallographic orientations and petrological growth zoning (`ZONING`) into separate extruder channels for multi-material 3D printing (e.g., Bambu Lab AMS / Prusa MMU).
  4. **Done when:** The exported 3MF archive loads without repair warnings in PrusaSlicer/Bambu Studio and prints concentric growth rings in distinct filament colors.
  - Detail Ticket: [07-demos/kristallwachstum-3d/ticket-02-gpu-marching-cubes-3mf.md](../../07-demos/kristallwachstum-3d/ticket-02-gpu-marching-cubes-3mf.md)

## Where it breaks

1. **WebGPU hardware requirement:** Older mobile devices or environments without WebGPU fall back to simplified WebGL2/Canvas modes.
2. **Numerical instability with large timesteps:** Phase-field equations can oscillate if $\Delta t$ is too large. Adaptive CFL timestep bounds in compute passes are mandatory.
3. **Morphological fatigue:** Unconstrained DLA trees look visually repetitive after twenty seeds. Only coupling with crystal lattice anisotropy produces authentic mineralogical variety.

## Prior work

- **scttfrdmn/webgpu-compute-exploration:** Outstanding WebGPU compute demos for DLA and particle physics, but lacks phase-field thermodynamics or 3D print pipelines.
- **fronkt/solidify:** Landmark WGSL implementation of Kobayashi phase-field at 192³ voxels with 9 lenses and EBSD maps — purely continuum-based without DLA nucleation.
- **markstock/dla-nd:** Mathematically rigorous 1D–5D off-lattice DLA reference with quartic solver bias correction (C codebase).
- **Nervous System:** Pioneers of generative 3D printing (Hyphae, Floraform); proprietary commercial focus rather than open educational physics.
- **Mineralogy classrooms:** Still reliant on plastic lattice models and 2D textbook plates.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

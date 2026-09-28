# Schallschutz-Gitter-Designer (SGD) - Sound Protection Grid Designer

## An Amélie Initiative for Acoustic Metamaterials in Urban Spaces

### Problem Statement
Noise pollution is a significant problem in urban areas, negatively impacting the quality of life and health of citizens. Traditional noise mitigation measures like walls or greenery are often inefficient, aesthetically disruptive, or space-intensive. Acoustic metamaterials offer an innovative solution through their ability to manipulate sound waves in unique ways (e.g., absorb, scatter, or redirect). However, the design and simulation of such complex structures require specialized knowledge and proprietary software, which are inaccessible to most municipalities and NGOs.

### The Schallschutz-Gitter-Designer (SGD) Project
The Schallschutz-Gitter-Designer (SGD) is an open-source web tool being developed to enable urban planners, architects, and environmental agencies to design, simulate, and evaluate acoustic metamaterial structures for specific urban noise abatement requirements. Based on advanced numerical methods (such as the Finite Element Method or Boundary Element Method) and optimized using WebAssembly and WebGPU, SGD provides an interactive platform for generating and analyzing metamaterial-based noise protection solutions.

### Core Features
*   **Interactive 3D Designer**: Visual creation and customization of metamaterial geometries (e.g., resonators, diffusers) using parametric templates.
*   **Simulation Engine (WASM/WebGPU)**: Real-time or near real-time simulation of sound propagation and absorption for designed structures within a given urban context (e.g., based on OpenStreetMap data).
*   **Performance Analysis**: Calculation of sound reduction values, frequency response analyses, and visualization of sound fields.
*   **Optimization Modules**: Algorithms for automatic generation and optimization of metamaterial structures based on target objectives (e.g., maximum sound absorption with minimal material usage).
*   **Export Function**: Export of 3D models (e.g., STL for 3D printing) and technical specifications for manufacturing.

### Technological Basis
*   **Frontend**: TypeScript, React/Vue, Three.js/Babylon.js for 3D visualization.
*   **Computation Engine**: C++/Rust code compiled to WebAssembly (WASM), leveraging WebGPU for highly parallel simulations on the GPU.
*   **Numerical Methods**: Implementation of FEM (Finite Element Method) or BEM (Boundary Element Method) for acoustic simulations.
*   **Data Integration**: Potential integration with OpenStreetMap for geometry data and open noise maps.

### Target Institution
TU Berlin, Department of Technical Acoustics, as well as municipal environmental offices and planning agencies in Berlin and beyond.

### Example TypeScript Entry

```typescript
// src/core/MetamaterialSimulator.ts
import { AcousticMaterial } from './AcousticMaterial';
import { Geometry } from './Geometry';
import { WebGPUEngine } from './WebGPUEngine';

export class MetamaterialSimulator {
    private webGPUEngine: WebGPUEngine;

    constructor(canvas: HTMLCanvasElement) {
        this.webGPUEngine = new WebGPUEngine(canvas);
    }

    async initialize(): Promise<void> {
        await this.webGPUEngine.init();
    }

    async simulate(geometry: Geometry, material: AcousticMaterial, frequencyHz: number): Promise<Float32Array> {
        // Prepare simulation data for WebGPU
        const geometryData = geometry.toWebGPUFormat();
        const materialProperties = material.getProperties();

        // Offload heavy computation to WebGPU via WASM kernel
        const result = await this.webGPUEngine.runAcousticFEM(geometryData, materialProperties, frequencyHz);
        return result; // Returns sound pressure levels
    }

    renderResult(simulationResult: Float32Array): void {
        // Visualize the sound pressure field in 3D
        this.webGPUEngine.render(simulationResult);
    }
}
```
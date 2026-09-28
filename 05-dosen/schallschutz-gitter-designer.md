# Schallschutz-Gitter-Designer (SGD)

## Eine Amélie-Initiative für akustische Metamaterialien im urbanen Raum

### Problemstellung
Lärmverschmutzung ist ein erhebliches Problem in urbanen Gebieten, das die Lebensqualität und Gesundheit der Bürger beeinträchtigt. Herkömmliche Lärmschutzmaßnahmen wie Wände oder Begrünungen sind oft ineffizient, ästhetisch störend oder raumintensiv. Akustische Metamaterialien bieten eine innovative Lösung durch ihre Fähigkeit, Schallwellen auf einzigartige Weise zu manipulieren (z.B. absorbieren, streuen oder umlenken). Der Entwurf und die Simulation solcher komplexen Strukturen erfordern jedoch spezialisiertes Wissen und proprietäre Software, die für Kommunen und NGOs unzugänglich sind.

### Das Schallschutz-Gitter-Designer (SGD) Projekt
Der Schallschutz-Gitter-Designer (SGD) ist ein Open-Source-Webtool, das entwickelt wird, um Stadtplanern, Architekten und Umweltämtern den Entwurf, die Simulation und die Evaluierung von akustischen Metamaterialstrukturen für spezifische urbane Lärmschutzanforderungen zu ermöglichen. Basierend auf fortschrittlichen numerischen Methoden (wie der Finite-Elemente-Methode oder der Randelementmethode) und optimiert durch WebAssembly und WebGPU, bietet SGD eine interaktive Plattform zur Generierung und Analyse von metamaterialbasierten Lärmschutzlösungen.

### Kernfunktionen
*   **Interaktiver 3D-Designer**: Visuelle Erstellung und Anpassung von Metamaterial-Geometrien (z.B. Resonatoren, Diffusoren) mit parametrischen Vorlagen.
*   **Simulations-Engine (WASM/WebGPU)**: Echtzeit- oder quasi-Echtzeit-Simulation der Schallausbreitung und -absorption für die entworfenen Strukturen in einem gegebenen urbanen Kontext (z.B. basierend auf OpenStreetMap-Daten).
*   **Leistungsanalyse**: Berechnung von Schallreduktionswerten, Frequenzganganalysen und Visualisierung von Schallfeldern.
*   **Optimierungsmodule**: Algorithmen zur automatischen Generierung und Optimierung von Metamaterialstrukturen basierend auf Zielvorgaben (z.B. maximale Schallabsorption bei minimalem Materialverbrauch).
*   **Exportfunktion**: Export von 3D-Modellen (z.B. STL für 3D-Druck) und technischen Spezifikationen für die Fertigung.

### Technologische Basis
*   **Frontend**: TypeScript, React/Vue, Three.js/Babylon.js für 3D-Visualisierung.
*   **Berechnungs-Engine**: C++/Rust-Code, kompiliert nach WebAssembly (WASM), nutzt WebGPU für hochparallele Simulationen auf der GPU.
*   **Numerische Methoden**: Implementierung von FEM (Finite-Elemente-Methode) oder BEM (Randelementmethode) für akustische Simulationen.
*   **Datenintegration**: Potenziell Anbindung an OpenStreetMap für Geometriedaten und offene Lärmkarten.

### Zielinstitution
TU Berlin, Fachgebiet Technische Akustik, sowie städtische Umweltämter und Planungsbüros in Berlin und darüber hinaus.

### Beispiel TypeScript Entry

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
// 07-demos/schallschutz-gitter-designer/src/test/MetamaterialSimulator.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetamaterialSimulator } from '../core/MetamaterialSimulator';
import { AcousticMaterial } from '../core/AcousticMaterial';
import { Geometry } from '../core/Geometry';
import { WebGPUEngine } from '../core/WebGPUEngine';

// Mock WebGPUEngine as it depends on browser environment
vi.mock('../core/WebGPUEngine', () => {
    class MockWebGPUEngine {
        constructor(canvas: HTMLCanvasElement) { /* mock */ }
        async init(): Promise<void> { return Promise.resolve(); }
        async runAcousticFEM(geometryData: any, materialProperties: any, frequencyHz: number): Promise<Float32Array> {
            // Simulate a simple sound reduction for testing
            if (frequencyHz > 1000) { // Higher frequencies attenuated more
                return Promise.resolve(new Float32Array([0.1, 0.2, 0.1, 0.05]));
            }
            return Promise.resolve(new Float32Array([0.5, 0.6, 0.5, 0.4]));
        }
        render(simulationResult: Float32Array): void { /* mock */ }
    }
    return { WebGPUEngine: MockWebGPUEngine };
});

describe('MetamaterialSimulator', () => {
    let simulator: MetamaterialSimulator;
    let mockCanvas: HTMLCanvasElement;
    let mockGeometry: Geometry;
    let mockMaterial: AcousticMaterial;

    beforeEach(() => {
        mockCanvas = document.createElement('canvas');
        simulator = new MetamaterialSimulator(mockCanvas);

        mockGeometry = new Geometry({ vertices: [], faces: [] }); // Simplified mock
        mockMaterial = new AcousticMaterial('test-material', { density: 1.2, speedOfSound: 343 }); // Simplified mock

        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    it('should initialize the WebGPU engine', async () => {
        const initSpy = vi.spyOn(simulator['webGPUEngine'], 'init');
        await simulator.initialize();
        expect(initSpy).toHaveBeenCalledOnce();
    });

    it('should simulate sound propagation and return results', async () => {
        const runAcousticFEMSpy = vi.spyOn(simulator['webGPUEngine'], 'runAcousticFEM');
        const result = await simulator.simulate(mockGeometry, mockMaterial, 500); // Low frequency
        expect(runAcousticFEMSpy).toHaveBeenCalledWith(
            mockGeometry.toWebGPUFormat(),
            mockMaterial.getProperties(),
            500
        );
        expect(result).toBeInstanceOf(Float32Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBeCloseTo(0.5); // Based on mock logic

        const highFreqResult = await simulator.simulate(mockGeometry, mockMaterial, 2000); // High frequency
        expect(highFreqResult[0]).toBeCloseTo(0.1); // Based on mock logic
    });

    it('should render simulation results', async () => {
        const renderSpy = vi.spyOn(simulator['webGPUEngine'], 'render');
        const simulationResult = new Float32Array([0.1, 0.2, 0.3]);
        simulator.renderResult(simulationResult);
        expect(renderSpy).toHaveBeenCalledWith(simulationResult);
    });

    it('should handle material and geometry conversion correctly before simulation', async () => {
        const geometryToWebGPUFormatSpy = vi.spyOn(mockGeometry, 'toWebGPUFormat');
        const materialGetPropertiesSpy = vi.spyOn(mockMaterial, 'getProperties');

        await simulator.simulate(mockGeometry, mockMaterial, 1000);

        expect(geometryToWebGPUFormatSpy).toHaveBeenCalledOnce();
        expect(materialGetPropertiesSpy).toHaveBeenCalledOnce();
    });
});
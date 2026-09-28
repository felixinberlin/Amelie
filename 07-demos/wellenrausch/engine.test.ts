import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWaveSimulator, WaveSimulator, WaveType, MediumProperties } from '../src/index';

describe('Wellenrausch Wave Simulator', () => {
  let simulator: WaveSimulator;

  beforeEach(() => {
    // Mock WebAssembly and WebGL dependencies if necessary for unit tests
    // For integration, a real Wasm module would be loaded.
    // Here, we'll mock the core `calculateStep` to simulate its behavior.
    const mockWasmModule = {
      instance: {
        exports: {
          _init_simulator: vi.fn((width, height, deltaT, waveSpeed) => { /* mock init */ }),
          _set_source: vi.fn((x, y, amplitude, frequency) => { /* mock set source */ }),
          _calculate_step: vi.fn((iterations) => { /* mock calculation */ return new Float32Array(100); }), // Returns mock data
          _get_wave_data: vi.fn(() => new Float32Array(100)), // Returns mock data
          _set_medium_property: vi.fn((x, y, propertyType, value) => { /* mock set medium */ })
        }
      }
    };
    vi.spyOn(WebAssembly, 'instantiateStreaming').mockResolvedValue(mockWasmModule as any);
    
    // Mock WebGL context for visualization tests if needed, or focus on data output.
    // For this test, we assume WebGL just consumes the data.
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return { getContext: vi.fn(() => ({})), setAttribute: vi.fn() } as any;
      }
      return null as any;
    });
  });

  it('should initialize the simulator with given dimensions and parameters', async () => {
    simulator = await createWaveSimulator(10, 10, 0.1, 1.0);
    expect(simulator).toBeDefined();
    expect(WebAssembly.instantiateStreaming).toHaveBeenCalledOnce();
    expect(simulator.init).toHaveBeenCalledWith(10, 10, 0.1, 1.0);
  });

  it('should set a wave source correctly', async () => {
    simulator = await createWaveSimulator(10, 10, 0.1, 1.0);
    simulator.setWaveSource(WaveType.Sine, 5, 5, 1.0, 10.0);
    expect(simulator.setWaveSource).toHaveBeenCalledWith(WaveType.Sine, 5, 5, 1.0, 10.0);
    // Expect the underlying Wasm function to be called
    expect((simulator as any).wasmExports._set_source).toHaveBeenCalledWith(5, 5, 1.0, 10.0);
  });

  it('should calculate a simulation step and retrieve data', async () => {
    simulator = await createWaveSimulator(10, 10, 0.1, 1.0);
    await simulator.calculateStep(1);
    const waveData = simulator.getWaveData();
    expect(waveData).toBeInstanceOf(Float32Array);
    expect(waveData.length).toBe(100); // Based on mock data size
    expect((simulator as any).wasmExports._calculate_step).toHaveBeenCalledWith(1);
    expect((simulator as any).wasmExports._get_wave_data).toHaveBeenCalledOnce();
  });

  it('should update medium properties', async () => {
    simulator = await createWaveSimulator(10, 10, 0.1, 1.0);
    simulator.setMediumProperties(2, 3, MediumProperties.WaveSpeed, 0.5);
    expect(simulator.setMediumProperties).toHaveBeenCalledWith(2, 3, MediumProperties.WaveSpeed, 0.5);
    expect((simulator as any).wasmExports._set_medium_property).toHaveBeenCalledWith(2, 3, MediumProperties.WaveSpeed, 0.5);
  });

  it('should handle errors during Wasm loading', async () => {
    vi.spyOn(WebAssembly, 'instantiateStreaming').mockRejectedValue(new Error('Wasm failed to load'));
    await expect(createWaveSimulator(10, 10, 0.1, 1.0)).rejects.toThrow('Wasm failed to load');
  });
});

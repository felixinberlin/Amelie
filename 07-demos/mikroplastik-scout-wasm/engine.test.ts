// 07-demos/microplastic-scout-wasm/tests/detector.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MicroplasticDetector } from '../src/microplastic-detector'; // Assuming this is the main module

// Mock the actual WASM module interaction for testing
// In a real scenario, you might have a small dummy WASM model or mock the WASM runtime itself.
// For this example, we'll mock the internal detection logic.
vi.mock('../src/wasm-inference-module', () => ({
  loadWasmModel: vi.fn(() => Promise.resolve({
    instance: {
      exports: {
        init: vi.fn(),
        detect: vi.fn((inputPtr, width, height) => {
          // Simulate detection results (e.g., two plastic particles)
          // In a real WASM module, this would write to shared memory.
          // For a mock, we can return a simplified structure or just indicate success.
          // Let's assume a simple return indicating success for now.
          console.log('Mock WASM detect called');
          return 2; // Number of detections
        }),
        getDetectionResult: vi.fn((index) => {
          // Simulate getting results from WASM memory
          if (index === 0) return { bbox: [10, 20, 30, 40], labelId: 0, score: 0.98 };
          if (index === 1) return { bbox: [50, 60, 20, 20], labelId: 1, score: 0.92 };
          return null;
        }),
        allocate: vi.fn((size) => 100), // Mock memory allocation
        deallocate: vi.fn(),
        memory: { buffer: new ArrayBuffer(1024) } // Mock WASM memory
      }
    }
  })),
  LABEL_MAP: ['Fiber', 'Fragment'] // Mock label map
}));

import * as WasmInferenceModule from '../src/wasm-inference-module';

describe('MicroplasticDetector', () => {
  let detector: MicroplasticDetector;
  const mockImageData = new ImageData(10, 10); // Dummy image data

  beforeEach(async () => {
    // Reset mocks before each test
    vi.clearAllMocks();
    detector = new MicroplasticDetector();
    await detector.loadModel('path/to/model.onnx');
  });

  it('should load the WASM model successfully', async () => {
    expect(WasmInferenceModule.loadWasmModel).toHaveBeenCalledWith('path/to/model.onnx');
    expect(detector.isModelLoaded()).toBe(true);
  });

  it('should perform detection and return results', async () => {
    const mockLoadWasmModel = WasmInferenceModule.loadWasmModel as unknown as vi.Mock;
    const mockWasmExports = mockLoadWasmModel.mock.results[0].value.instance.exports;

    // Simulate the actual WASM detect function writing to memory
    mockWasmExports.detect.mockImplementation((inputPtr, width, height) => {
      // For this test, we'll just return the number of detections, and mock getDetectionResult
      return 2;
    });

    const detections = await detector.detect(mockImageData);

    expect(mockWasmExports.detect).toHaveBeenCalledWith(100, 10, 10); // Expect allocate ptr and image dims
    expect(detections).toHaveLength(2);
    expect(detections[0]).toEqual({ bbox: [10, 20, 30, 40], label: 'Fiber', score: 0.98 });
    expect(detections[1]).toEqual({ bbox: [50, 60, 20, 20], label: 'Fragment', score: 0.92 });
  });

  it('should handle no detections gracefully', async () => {
    const mockLoadWasmModel = WasmInferenceModule.loadWasmModel as unknown as vi.Mock;
    const mockWasmExports = mockLoadWasmModel.mock.results[0].value.instance.exports;

    mockWasmExports.detect.mockImplementation(() => 0); // Simulate no detections
    mockWasmExports.getDetectionResult.mockReturnValue(null);

    const detections = await detector.detect(mockImageData);

    expect(mockWasmExports.detect).toHaveBeenCalled();
    expect(detections).toHaveLength(0);
  });

  it('should throw an error if detection is called before model is loaded', async () => {
    const unloadedDetector = new MicroplasticDetector();
    await expect(unloadedDetector.detect(mockImageData)).rejects.toThrow('Model not loaded');
  });
});
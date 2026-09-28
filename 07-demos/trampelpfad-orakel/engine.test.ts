// 07-demos/trampelpfad-orakel/tests/main.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runDesirePathDetection } from '../src/main';

// Mock the internal modules to isolate runDesirePathDetection logic
vi.mock('../src/detector', () => ({
  detectDesirePaths: vi.fn(async (imageUrl: string, threshold?: number) => {
    if (imageUrl.includes('error')) throw new Error('Simulated detection error');
    return [
      { id: 'mock-path-1', pixels: [[10, 20], [15, 25]], confidence: 0.95 },
      { id: 'mock-path-2', pixels: [[30, 40], [35, 45], [40, 50]], confidence: 0.88 },
      ...(threshold && threshold > 0.9 ? [] : [{ id: 'mock-path-3', pixels: [[50, 60]], confidence: 0.7 }]),
    ];
  }),
}));

vi.mock('../src/geospatial', () => ({
  processGeospatialData: vi.fn(async (rawDetections: any[], bbox: number[]) => {
    if (!rawDetections || rawDetections.length === 0) return [];
    return rawDetections.map((d, i) => ({
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[bbox[0] + i * 0.01, bbox[1] + i * 0.01], [bbox[2] - i * 0.01, bbox[3] - i * 0.01]] },
      properties: { confidence: d.confidence, lengthKm: 0.1 + i * 0.02 },
    }));
  }),
}));

vi.mock('../src/exporter', () => ({
  exportGeoJson: vi.fn(async (data: any, fileName: string) => {
    if (fileName.includes('fail')) throw new Error('Simulated export failure');
    return true;
  }),
}));

describe('runDesirePathDetection', () => {
  const mockConfig = {
    imageUrl: 'http://example.com/aerial-image.tif',
    imageBbox: [13.3, 52.5, 13.4, 52.6] as [number, number, number, number],
    outputFileName: 'test-paths.geojson',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully detect and process desire paths', async () => {
    const result = await runDesirePathDetection(mockConfig);

    expect(result).toBeDefined();
    expect(result.metadata.sourceImage).toEqual(mockConfig.imageUrl);
    expect(result.features).toHaveLength(3); // Based on mock data
    expect(result.features[0].geometry.type).toEqual('LineString');
    expect(result.features[0].properties.confidence).toBeGreaterThan(0.8);

    // Ensure mocks were called
    const { detectDesirePaths } = await import('../src/detector');
    const { processGeospatialData } = await import('../src/geospatial');
    const { exportGeoJson } = await import('../src/exporter');

    expect(detectDesirePaths).toHaveBeenCalledWith(mockConfig.imageUrl, undefined);
    expect(processGeospatialData).toHaveBeenCalledWith(expect.any(Array), mockConfig.imageBbox);
    expect(exportGeoJson).toHaveBeenCalledWith(expect.any(Object), mockConfig.outputFileName);
  });

  it('should filter paths based on confidence threshold', async () => {
    const configWithThreshold = { ...mockConfig, confidenceThreshold: 0.9 };
    const result = await runDesirePathDetection(configWithThreshold);

    expect(result.features).toHaveLength(2); // Mock path 3 (confidence 0.7) should be filtered
    expect(result.features.some(f => f.properties.confidence < 0.9)).toBeFalsy();

    const { detectDesirePaths } = await import('../src/detector');
    expect(detectDesirePaths).toHaveBeenCalledWith(configWithThreshold.imageUrl, 0.9);
  });

  it('should handle detection errors gracefully', async () => {
    const errorConfig = { ...mockConfig, imageUrl: 'http://example.com/error-image.tif' };
    await expect(runDesirePathDetection(errorConfig)).rejects.toThrow('Simulated detection error');
  });

  it('should not export if outputFileName is not provided', async () => {
    const configNoExport = { ...mockConfig, outputFileName: undefined };
    await runDesirePathDetection(configNoExport);

    const { exportGeoJson } = await import('../src/exporter');
    expect(exportGeoJson).not.toHaveBeenCalled();
  });

  it('should handle export errors', async () => {
    const configExportFail = { ...mockConfig, outputFileName: 'fail-export.geojson' };
    await expect(runDesirePathDetection(configExportFail)).rejects.toThrow('Simulated export failure');
  });

  it('should return empty features array if no paths are detected', async () => {
    vi.mocked((await import('../src/detector')).detectDesirePaths).mockResolvedValueOnce([]);

    const result = await runDesirePathDetection(mockConfig);
    expect(result.features).toHaveLength(0);

    const { processGeospatialData } = await import('../src/geospatial');
    expect(processGeospatialData).toHaveBeenCalledWith([], mockConfig.imageBbox);
  });
});
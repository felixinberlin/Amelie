import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { type WildmuellDetectionResult, processAerialImage, initializeAIModel, shutdownAIModel } from '../src/wildmuell-scan-core';

// Mock the core AI model functions for testing purposes
// In a real scenario, these would interact with a Python backend or WASM module
const mockDetectionResults: WildmuellDetectionResult[] = [
  {
    id: 'dump-123',
    bbox: [10, 20, 100, 150], // [x, y, width, height]
    confidence: 0.95,
    type: 'construction-debris',
    coordinates: { lat: 52.52, lon: 13.40 }, // Example coordinates
    estimatedAreaSqM: 15.5
  },
  {
    id: 'dump-124',
    bbox: [200, 300, 50, 70],
    confidence: 0.88,
    type: 'household-waste',
    coordinates: { lat: 52.521, lon: 13.405 },
    estimatedAreaSqM: 4.2
  }
];

describe('wildmuell-scan-core AI integration', () => {
  let isModelInitialized = false;

  beforeAll(async () => {
    // Simulate AI model initialization
    const success = await initializeAIModel();
    isModelInitialized = success;
    expect(isModelInitialized).toBe(true);
  });

  afterAll(async () => {
    // Simulate AI model shutdown
    await shutdownAIModel();
    isModelInitialized = false;
  });

  it('should initialize the AI model successfully', () => {
    expect(isModelInitialized).toBe(true);
  });

  it('should process an aerial image and return detection results', async () => {
    if (!isModelInitialized) {
      throw new Error('AI model not initialized for test.');
    }
    const mockImageBuffer = Buffer.from('mock-image-data-base64', 'base64');
    const results = await processAerialImage(mockImageBuffer);

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('bbox');
    expect(results[0]).toHaveProperty('confidence');
    expect(results[0]).toHaveProperty('type');
    expect(results[0]).toHaveProperty('coordinates');
    expect(results[0]).toHaveProperty('estimatedAreaSqM');
    expect(results[0].confidence).toBeGreaterThan(0.8);
    expect(results[0].type).toMatch(/^(construction-debris|household-waste|electronic-waste)$/);
  });

  it('should handle an empty image buffer gracefully', async () => {
    if (!isModelInitialized) {
      throw new Error('AI model not initialized for test.');
    }
    const emptyBuffer = Buffer.from('');
    const results = await processAerialImage(emptyBuffer);
    expect(results).toBeInstanceOf(Array);
    // Depending on implementation, it might return an empty array or throw an error
    // For this test, we expect an empty array for no detections.
    expect(results.length).toBe(0);
  });

  it('should classify different types of waste correctly based on mock data', async () => {
    if (!isModelInitialized) {
      throw new Error('AI model not initialized for test.');
    }
    const mockImageBuffer = Buffer.from('another-mock-image-data', 'base64');
    const results = await processAerialImage(mockImageBuffer);

    const constructionDebris = results.find(r => r.type === 'construction-debris');
    const householdWaste = results.find(r => r.type === 'household-waste');

    expect(constructionDebris).toBeDefined();
    expect(householdWaste).toBeDefined();
    expect(constructionDebris?.confidence).toBeGreaterThan(0.9);
    expect(householdWaste?.confidence).toBeGreaterThan(0.8);
  });

  it('should return correct geocoordinates and estimated area for detections', async () => {
    if (!isModelInitialized) {
      throw new Error('AI model not initialized for test.');
    }
    const mockImageBuffer = Buffer.from('geo-test-image', 'base64');
    const results = await processAerialImage(mockImageBuffer);

    expect(results.length).toBeGreaterThan(0);
    const firstResult = results[0];
    expect(firstResult.coordinates).toBeDefined();
    expect(typeof firstResult.coordinates.lat).toBe('number');
    expect(typeof firstResult.coordinates.lon).toBe('number');
    expect(firstResult.estimatedAreaSqM).toBeGreaterThan(0);
  });
});

// Placeholder for the actual core TypeScript file (src/wildmuell-scan-core.ts)
// In a real project, this would contain the actual logic to interface with the AI model
// (e.g., via gRPC, HTTP API to a Python backend, or a WASM-compiled model).
export type Coordinates = { lat: number; lon: number; };
export type WildmuellDetectionResult = {
  id: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
  confidence: number;
  type: 'construction-debris' | 'household-waste' | 'electronic-waste' | 'other';
  coordinates: Coordinates;
  estimatedAreaSqM: number;
};

export async function initializeAIModel(): Promise<boolean> {
  // Simulate async model loading
  return new Promise(resolve => setTimeout(() => resolve(true), 50));
}

export async function shutdownAIModel(): Promise<void> {
  // Simulate async model unloading
  return new Promise(resolve => setTimeout(() => resolve(), 20));
}

export async function processAerialImage(imageBuffer: Buffer): Promise<WildmuellDetectionResult[]> {
  // In a real implementation, this would send the image to an AI backend
  // For testing, we return mock data based on input or predefined scenarios.
  if (imageBuffer.toString() === '') {
    return []; // No detections for empty buffer
  }
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 100));

  // Return different mock data based on input to simulate different scenarios
  if (imageBuffer.toString() === 'another-mock-image-data') {
    return [
      mockDetectionResults[0], // Construction debris
      mockDetectionResults[1]  // Household waste
    ];
  } else if (imageBuffer.toString() === 'geo-test-image') {
      return [
        { ...mockDetectionResults[0], coordinates: { lat: 52.53, lon: 13.41 }, estimatedAreaSqM: 20.1 }
      ];
  }
  return mockDetectionResults;
}

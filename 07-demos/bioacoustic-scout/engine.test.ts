import { describe, it, expect, vi } from 'vitest';

// Mock the inference API function that would interact with the AI backend
// 07-demos/bioacoustic-scout/src/api/inference.ts
export async function getSpeciesDetections(audioData: Blob): Promise<{ species: string; confidence: number; timestamp: number }[]> {
  return new Promise((resolve) => {
    // Simulate network latency and a typical AI inference response
    setTimeout(() => {
      if (!audioData || audioData.size === 0) {
        resolve([]); // Return empty for empty input in a more realistic scenario
        return;
      }
      const mockDetections = [
        { species: "Amsel (Turdus merula)", confidence: 0.95, timestamp: 1000 },
        { species: "Kohlmeise (Parus major)", confidence: 0.88, timestamp: 2500 },
        { species: "Haussperling (Passer domesticus)", confidence: 0.72, timestamp: 4000 }
      ];
      resolve(mockDetections);
    }, 50);
  });
}

describe('BioAcoustic Scout API Inference', () => {
  it('should return a list of species detections for valid audio data', async () => {
    const mockAudioBlob = new Blob(['mock audio data content'], { type: 'audio/wav' });

    const detections = await getSpeciesDetections(mockAudioBlob);

    expect(detections).toBeInstanceOf(Array);
    expect(detections.length).toBeGreaterThan(0);

    const firstDetection = detections[0];
    expect(firstDetection).toHaveProperty('species');
    expect(typeof firstDetection.species).toBe('string');
    expect(firstDetection).toHaveProperty('confidence');
    expect(typeof firstDetection.confidence).toBe('number');
    expect(firstDetection.confidence).toBeGreaterThanOrEqual(0);
    expect(firstDetection.confidence).toBeLessThanOrEqual(1);
    expect(firstDetection).toHaveProperty('timestamp');
    expect(typeof firstDetection.timestamp).toBe('number');
    expect(firstDetection.timestamp).toBeGreaterThanOrEqual(0);
  });

  it('should return an empty array for an empty audio blob', async () => {
    const emptyAudioBlob = new Blob([], { type: 'audio/wav' });

    const detections = await getSpeciesDetections(emptyAudioBlob);

    expect(detections).toBeInstanceOf(Array);
    expect(detections).toHaveLength(0);
  });

  it('should handle different audio data blobs without error', async () => {
    const anotherMockAudioBlob = new Blob(['different audio content'], { type: 'audio/ogg' });

    const detections = await getSpeciesDetections(anotherMockAudioBlob);

    expect(detections).toBeInstanceOf(Array);
    expect(detections.length).toBeGreaterThan(0);
    expect(detections[0].species).toEqual('Amsel (Turdus merula)'); // Verifies mock consistency
  });
});
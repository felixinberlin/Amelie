import { describe, it, expect, vi } from 'vitest';

// Assume this is part of the core library for BioAkustik-Scout
// types.ts (or similar)
export type SpeciesClassification = {
  species: string;
  confidence: number;
  timestamp: number; // Start time of the segment relative to the recording start
  duration: number; // Duration of the detected sound event
};

export type AudioSegment = {
  buffer: Float32Array;
  timestamp: number; // Absolute start time of this segment in the overall recording (seconds)
  duration: number; // Duration of the segment (seconds)
};

// Mock AI inference function
// In a real scenario, this would call a WASM model, a backend API, or a WebWorker
const mockAIInference = vi.fn(async (segmentBuffer: Float32Array): Promise<SpeciesClassification[]> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 50));

  // Simple mock logic: if the buffer length indicates a 'bird' or 'frog' sound
  if (segmentBuffer.length > 5000) { // Arbitrary threshold for 'bird'
    return [
      { species: 'Amsel (Turdus merula)', confidence: 0.95, timestamp: 0.1, duration: 1.8 }
    ];
  } else if (segmentBuffer.length > 1000) { // Arbitrary threshold for 'frog'
    return [
      { species: 'Laubfrosch (Hyla arborea)', confidence: 0.88, timestamp: 0.5, duration: 1.0 }
    ];
  }
  return [
    { species: 'Umgebungsgeräusch', confidence: 0.60, timestamp: 0, duration: 3.0 }
  ];
});

/**
 * Classifies a given audio segment using an AI inference model.
 * Adjusts the relative timestamps from the AI model to absolute timestamps based on the segment's position.
 * @param segment The audio segment to classify, including its buffer and absolute timestamp.
 * @returns A promise resolving to an array of SpeciesClassification objects.
 */
export async function classifyAudioSegment(segment: AudioSegment): Promise<SpeciesClassification[]> {
  const results = await mockAIInference(segment.buffer);
  // Adjust timestamps based on the segment's original absolute timestamp
  return results.map(r => ({
    ...r,
    timestamp: segment.timestamp + r.timestamp, // Convert relative timestamp to absolute
    duration: Math.min(r.duration, segment.duration - r.timestamp) // Ensure duration doesn't exceed segment bounds
  }));
}

describe('BioAkustik-Scout Core Classification Logic', () => {
  it('should correctly classify a bird sound segment and adjust timestamps', async () => {
    const birdSoundBuffer = new Float32Array(6000).fill(0.1); // Simulate a bird sound buffer
    const segment: AudioSegment = { buffer: birdSoundBuffer, timestamp: 10, duration: 2 };
    const classifications = await classifyAudioSegment(segment);

    expect(classifications).toHaveLength(1);
    expect(classifications[0].species).toBe('Amsel (Turdus merula)');
    expect(classifications[0].confidence).toBeGreaterThan(0.9);
    expect(classifications[0].timestamp).toBeCloseTo(10.1); // 10 (segment start) + 0.1 (relative detection start)
    expect(classifications[0].duration).toBeCloseTo(1.8); // Should be the detected duration
    expect(mockAIInference).toHaveBeenCalledWith(birdSoundBuffer);
  });

  it('should classify a frog sound segment and adjust timestamps', async () => {
    const frogSoundBuffer = new Float32Array(2000).fill(0.05); // Simulate a frog sound buffer
    const segment: AudioSegment = { buffer: frogSoundBuffer, timestamp: 25.5, duration: 1.5 };
    const classifications = await classifyAudioSegment(segment);

    expect(classifications).toHaveLength(1);
    expect(classifications[0].species).toBe('Laubfrosch (Hyla arborea)');
    expect(classifications[0].confidence).toBeGreaterThan(0.8);
    expect(classifications[0].timestamp).toBeCloseTo(26.0); // 25.5 (segment start) + 0.5 (relative detection start)
    expect(classifications[0].duration).toBeCloseTo(1.0); // Should be the detected duration
  });

  it('should classify an ambient sound segment and adjust timestamps', async () => {
    const ambientSoundBuffer = new Float32Array(500).fill(0.01); // Simulate ambient noise buffer
    const segment: AudioSegment = { buffer: ambientSoundBuffer, timestamp: 50, duration: 3 };
    const classifications = await classifyAudioSegment(segment);

    expect(classifications).toHaveLength(1);
    expect(classifications[0].species).toBe('Umgebungsgeräusch');
    expect(classifications[0].confidence).toBeGreaterThan(0.5);
    expect(classifications[0].timestamp).toBeCloseTo(50.0); // 50 (segment start) + 0 (relative detection start)
    expect(classifications[0].duration).toBeCloseTo(3.0); // Should be the detected duration
  });

  it('should handle an empty buffer gracefully, returning ambient noise', async () => {
    const emptyBuffer = new Float32Array(0);
    const segment: AudioSegment = { buffer: emptyBuffer, timestamp: 0, duration: 0 };
    const classifications = await classifyAudioSegment(segment);
    // The mockAIInference returns 'Umgebungsgeräusch' for small/empty buffers
    expect(classifications).toEqual([{ species: 'Umgebungsgeräusch', confidence: 0.60, timestamp: 0, duration: 0 }]);
  });

  it('should ensure detected duration does not exceed segment bounds', async () => {
    // Simulate a detection that goes beyond the segment's actual end
    // Modify mockAIInference temporarily for this test or create a specific mock for it
    const longDetectionMock = vi.fn(async (segmentBuffer: Float32Array): Promise<SpeciesClassification[]> => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return [{ species: 'Überlanger Ruf', confidence: 0.90, timestamp: 0.5, duration: 5.0 }]; // 5s detection in a 2s segment
    });
    vi.spyOn(mockAIInference, 'mockImplementation').mockImplementation(longDetectionMock);

    const buffer = new Float32Array(10000).fill(0.2); // Large enough to trigger a detection
    const segment: AudioSegment = { buffer: buffer, timestamp: 100, duration: 2.0 }; // Segment is only 2 seconds long
    const classifications = await classifyAudioSegment(segment);

    expect(classifications).toHaveLength(1);
    expect(classifications[0].species).toBe('Überlanger Ruf');
    expect(classifications[0].timestamp).toBeCloseTo(100.5);
    // The duration should be capped: segment.duration (2.0) - relative_start (0.5) = 1.5
    expect(classifications[0].duration).toBeCloseTo(1.5);

    // Restore original mock after test
    vi.spyOn(mockAIInference, 'mockImplementation').mockRestore();
  });
});

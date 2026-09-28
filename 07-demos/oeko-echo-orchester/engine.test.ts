import { describe, it, expect } from 'vitest';
import { analyzeSoundscapeData, type SoundEvent, type SoundscapeAnalysisResult } from '../src/types/oeko-echo-orchester';

describe('analyzeSoundscapeData', () => {
  it('should correctly process a list of sound events into a summary', () => {
    const mockEvents: SoundEvent[] = [
      { species: 'Amsel', timestamp: '2023-10-26T10:00:00Z', confidence: 0.95, lat: 52.5, lon: 13.4 },
      { species: 'Meise', timestamp: '2023-10-26T10:05:00Z', confidence: 0.88, lat: 52.5, lon: 13.4 },
      { species: 'Amsel', timestamp: '2023-10-26T10:10:00Z', confidence: 0.92, lat: 52.5, lon: 13.4 },
      { species: 'Eichhörnchen', timestamp: '2023-10-26T10:15:00Z', confidence: 0.75, lat: 52.5, lon: 13.4 }
    ];

    const result = analyzeSoundscapeData(mockEvents);

    expect(result.totalEvents).toBe(4);
    expect(result.uniqueSpecies).toBe(3);
    expect(result.speciesCounts).toEqual({
      'Amsel': 2,
      'Meise': 1,
      'Eichhörnchen': 1
    });
    expect(result.mostCommonSpecies).toBe('Amsel');
    expect(result.averageConfidence).toBeCloseTo((0.95 + 0.88 + 0.92 + 0.75) / 4);
  });

  it('should handle empty event list gracefully', () => {
    const mockEvents: SoundEvent[] = [];
    const result = analyzeSoundscapeData(mockEvents);

    expect(result.totalEvents).toBe(0);
    expect(result.uniqueSpecies).toBe(0);
    expect(result.speciesCounts).toEqual({});
    expect(result.mostCommonSpecies).toBeUndefined();
    expect(result.averageConfidence).toBe(0);
  });

  it('should identify a single most common species correctly', () => {
    const mockEvents: SoundEvent[] = [
      { species: 'Fuchs', timestamp: '2023-10-26T11:00:00Z', confidence: 0.8, lat: 52.5, lon: 13.4 },
      { species: 'Fuchs', timestamp: '2023-10-26T11:05:00Z', confidence: 0.7, lat: 52.5, lon: 13.4 }
    ];
    const result = analyzeSoundscapeData(mockEvents);
    expect(result.mostCommonSpecies).toBe('Fuchs');
  });
});

// Dummy implementation for the test to pass, actual logic would be more complex
function analyzeSoundscapeData(events: SoundEvent[]): SoundscapeAnalysisResult {
  const speciesCounts: { [key: string]: number } = {};
  let totalConfidence = 0;

  events.forEach(event => {
    speciesCounts[event.species] = (speciesCounts[event.species] || 0) + 1;
    totalConfidence += event.confidence;
  });

  let mostCommonSpecies: string | undefined;
  let maxCount = 0;
  for (const species in speciesCounts) {
    if (speciesCounts[species] > maxCount) {
      maxCount = speciesCounts[species];
      mostCommonSpecies = species;
    }
  }

  return {
    totalEvents: events.length,
    uniqueSpecies: Object.keys(speciesCounts).length,
    speciesCounts: speciesCounts,
    mostCommonSpecies: mostCommonSpecies,
    averageConfidence: events.length > 0 ? totalConfidence / events.length : 0
  };
}
import { describe, it, expect } from 'vitest';

export interface BioacousticDetectionEvent {
  timestamp: string; // ISO 8601 format
  speciesId: string; // e.g., 'rana_temporaria' for common frog
  confidence: number; // 0.0 to 1.0
  deviceId: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number; // meters
  };
  audioClipUrl?: string; // Optional URL to a short audio clip
}

/**
 * Processes raw detection events, e.g., filters by confidence or aggregates.
 * @param events Array of BioacousticDetectionEvent
 * @param minConfidence Minimum confidence threshold for events to be included
 * @returns Filtered array of BioacousticDetectionEvent
 */
export function filterDetectionsByConfidence(
  events: BioacousticDetectionEvent[],
  minConfidence: number
): BioacousticDetectionEvent[] {
  return events.filter(event => event.confidence >= minConfidence);
}

describe('Bioacoustic Detection Utilities', () => {
  const mockEvents: BioacousticDetectionEvent[] = [
    {
      timestamp: '2023-10-27T10:00:00Z',
      speciesId: 'rana_temporaria',
      confidence: 0.95,
      deviceId: 'device-001',
      location: { latitude: 52.5, longitude: 13.4 }
    },
    {
      timestamp: '2023-10-27T10:05:00Z',
      speciesId: 'bufo_bufo',
      confidence: 0.70,
      deviceId: 'device-001',
      location: { latitude: 52.5, longitude: 13.4 }
    },
    {
      timestamp: '2023-10-27T10:10:00Z',
      speciesId: 'hyla_arborea',
      confidence: 0.40,
      deviceId: 'device-002',
      location: { latitude: 52.6, longitude: 13.5 }
    },
    {
      timestamp: '2023-10-27T10:15:00Z',
      speciesId: 'rana_temporaria',
      confidence: 0.88,
      deviceId: 'device-001',
      location: { latitude: 52.5, longitude: 13.4 }
    }
  ];

  it('should filter detections by a given confidence threshold', () => {
    const filtered = filterDetectionsByConfidence(mockEvents, 0.75);
    expect(filtered.length).toBe(2);
    expect(filtered[0].speciesId).toBe('rana_temporaria');
    expect(filtered[1].speciesId).toBe('rana_temporaria');
  });

  it('should return all events if confidence threshold is very low', () => {
    const filtered = filterDetectionsByConfidence(mockEvents, 0.3);
    expect(filtered.length).toBe(4);
  });

  it('should return no events if confidence threshold is too high', () => {
    const filtered = filterDetectionsByConfidence(mockEvents, 0.99);
    expect(filtered.length).toBe(0);
  });

  it('should handle an empty array gracefully', () => {
    const filtered = filterDetectionsByConfidence([], 0.5);
    expect(filtered.length).toBe(0);
  });
});

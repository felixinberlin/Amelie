import { describe, it, expect } from 'vitest';

// A hypothetical function that processes raw cosmic ray counts
// and calculates a rate per minute, handling potential edge cases.
function calculateCosmicRayRate(rawCounts: number[], intervalSeconds: number): number | null {
  if (!rawCounts || rawCounts.length === 0 || intervalSeconds <= 0) {
    return null; // Invalid input
  }

  const totalCounts = rawCounts.reduce((sum, count) => sum + count, 0);
  const totalTimeMinutes = (rawCounts.length * intervalSeconds) / 60;

  if (totalTimeMinutes === 0) {
    return null; // Avoid division by zero if interval is too small or counts length is 0
  }

  return totalCounts / totalTimeMinutes; // Rate per minute
}

describe('calculateCosmicRayRate', () => {
  it('should correctly calculate the rate per minute for valid counts', () => {
    const counts = [10, 12, 8, 15, 10]; // 5 readings
    const interval = 60; // 60 seconds per reading
    // Total counts = 55
    // Total time = 5 * 60 seconds = 300 seconds = 5 minutes
    // Rate = 55 / 5 = 11 counts/minute
    expect(calculateCosmicRayRate(counts, interval)).toBeCloseTo(11);
  });

  it('should handle different intervals correctly', () => {
    const counts = [5, 5, 5, 5]; // 4 readings
    const interval = 30; // 30 seconds per reading
    // Total counts = 20
    // Total time = 4 * 30 seconds = 120 seconds = 2 minutes
    // Rate = 20 / 2 = 10 counts/minute
    expect(calculateCosmicRayRate(counts, interval)).toBeCloseTo(10);
  });

  it('should return null for empty counts array', () => {
    expect(calculateCosmicRayRate([], 60)).toBeNull();
  });

  it('should return null for invalid interval (zero)', () => {
    expect(calculateCosmicRayRate([10, 20], 0)).toBeNull();
  });

  it('should return null for invalid interval (negative)', () => {
    expect(calculateCosmicRayRate([10, 20], -10)).toBeNull();
  });

  it('should handle zero counts correctly', () => {
    const counts = [0, 0, 0];
    const interval = 60;
    expect(calculateCosmicRayRate(counts, interval)).toBeCloseTo(0);
  });

  it('should handle non-integer intervals', () => {
    const counts = [1, 1, 1]; // 3 counts
    const interval = 20; // 20 seconds per count
    // Total counts = 3
    // Total time = 3 * 20 seconds = 60 seconds = 1 minute
    // Rate = 3 / 1 = 3 counts/minute
    expect(calculateCosmicRayRate(counts, interval)).toBeCloseTo(3);
  });
});
import { describe, it, expect } from 'vitest';

// A utility function for basic data processing, e.g., calculating moving average
// This would be part of the OpenPhyLab's analysis module
function calculateMovingAverage(data: number[], windowSize: number): number[] {
  if (windowSize <= 0 || windowSize > data.length) {
    throw new Error('Invalid window size');
  }
  const result: number[] = [];
  for (let i = 0; i <= data.length - windowSize; i++) {
    const sum = data.slice(i, i + windowSize).reduce((acc, val) => acc + val, 0);
    result.push(sum / windowSize);
  }
  return result;
}

describe('calculateMovingAverage', () => {
  it('should calculate the moving average correctly for a simple array', () => {
    const data = [1, 2, 3, 4, 5];
    const windowSize = 3;
    const expected = [2, 3, 4]; // (1+2+3)/3=2, (2+3+4)/3=3, (3+4+5)/3=4
    expect(calculateMovingAverage(data, windowSize)).toEqual(expected);
  });

  it('should handle an array with fewer elements than window size gracefully', () => {
    const data = [1, 2];
    const windowSize = 3;
    expect(() => calculateMovingAverage(data, windowSize)).toThrow('Invalid window size');
  });

  it('should return an empty array if data is empty', () => {
    const data: number[] = [];
    const windowSize = 1;
    expect(() => calculateMovingAverage(data, windowSize)).toThrow('Invalid window size');
  });

  it('should calculate moving average for window size 1 (original data)', () => {
    const data = [10, 20, 30];
    const windowSize = 1;
    expect(calculateMovingAverage(data, windowSize)).toEqual([10, 20, 30]);
  });

  it('should handle float values', () => {
    const data = [1.0, 2.5, 3.0, 4.5];
    const windowSize = 2;
    const expected = [1.75, 2.75, 3.75]; // (1.0+2.5)/2=1.75, (2.5+3.0)/2=2.75, (3.0+4.5)/2=3.75
    expect(calculateMovingAverage(data, windowSize)).toEqual(expected);
  });
});

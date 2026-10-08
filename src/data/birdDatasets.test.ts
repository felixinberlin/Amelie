import { describe, it, expect } from 'vitest';
import { cardinalDirection, strongestFrame, BIRD_DATASETS } from './birdDatasets';

describe('cardinalDirection', () => {
  it('converts cardinal compass angles to English points', () => {
    expect(cardinalDirection(0, false)).toBe('N');
    expect(cardinalDirection(360, false)).toBe('N');
    expect(cardinalDirection(45, false)).toBe('NE');
    expect(cardinalDirection(90, false)).toBe('E');
    expect(cardinalDirection(135, false)).toBe('SE');
    expect(cardinalDirection(180, false)).toBe('S');
    expect(cardinalDirection(200, false)).toBe('SSW');
    expect(cardinalDirection(225, false)).toBe('SW');
    expect(cardinalDirection(270, false)).toBe('W');
    expect(cardinalDirection(315, false)).toBe('NW');
  });

  it('converts cardinal compass angles to German points', () => {
    expect(cardinalDirection(0, true)).toBe('N');
    expect(cardinalDirection(45, true)).toBe('NO');
    expect(cardinalDirection(90, true)).toBe('O');
    expect(cardinalDirection(135, true)).toBe('SO');
    expect(cardinalDirection(200, true)).toBe('SSW');
    expect(cardinalDirection(225, true)).toBe('SW');
    expect(cardinalDirection(270, true)).toBe('W');
    expect(cardinalDirection(315, true)).toBe('NW');
  });

  it('handles wrap-around and negative angles gracefully', () => {
    expect(cardinalDirection(-45, false)).toBe('NW');
    expect(cardinalDirection(720, false)).toBe('N');
  });
});

describe('strongestFrame', () => {
  it('finds the peak migration frame for recent and historical datasets', () => {
    const historical = BIRD_DATASETS.historical.data;
    const peakHistorical = strongestFrame(historical);
    expect(peakHistorical).toBeGreaterThanOrEqual(0);
    expect(peakHistorical).toBeLessThan(historical.times.length);

    const recent = BIRD_DATASETS.recent.data;
    const peakRecent = strongestFrame(recent);
    expect(peakRecent).toBeGreaterThanOrEqual(0);
    expect(peakRecent).toBeLessThan(recent.times.length);
  });
});

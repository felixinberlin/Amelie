// 07-demos/spektro-analyst.test.ts
import { describe, it, expect } from 'vitest';
import { parseCsvData, applyBaselineCorrection, findPeaks } from '../src/spektro-analyst';

describe('Spektro-Analyst Core Functions', () => {
  const mockCsvData = "wavelength,intensity\n400,100\n410,105\n420,110\n430,120\n440,115\n450,108\n460,100";
  const mockSpectrum = [
    { x: 400, y: 100 }, { x: 410, y: 105 }, { x: 420, y: 110 },
    { x: 430, y: 120 }, { x: 440, y: 115 }, { x: 450, y: 108 },
    { x: 460, y: 100 }
  ];

  it('should correctly parse CSV data into a spectrum array', () => {
    const parsed = parseCsvData(mockCsvData);
    expect(parsed).toEqual(mockSpectrum);
    expect(parsed.length).toBe(7);
  });

  it('should apply a simple baseline correction (e.g., subtracting min value)', () => {
    const corrected = applyBaselineCorrection(mockSpectrum, 'min');
    // Assuming 'min' correction subtracts 100 from all values
    expect(corrected[0].y).toBe(0);
    expect(corrected[3].y).toBe(20);
  });

  it('should find peaks in a given spectrum', () => {
    const spectrumWithPeak = [
      { x: 500, y: 10 }, { x: 510, y: 12 }, { x: 520, y: 50 },
      { x: 530, y: 15 }, { x: 540, y: 11 }
    ];
    const peaks = findPeaks(spectrumWithPeak, { threshold: 20, prominence: 5 });
    expect(peaks.length).toBe(1);
    expect(peaks[0].x).toBe(520);
  });

  it('should handle empty input for parsing', () => {
    const parsed = parseCsvData('');
    expect(parsed).toEqual([]);
  });

  it('should return empty peaks if no peaks meet criteria', () => {
    const flatSpectrum = [
      { x: 1, y: 10 }, { x: 2, y: 11 }, { x: 3, y: 10 }
    ];
    const peaks = findPeaks(flatSpectrum, { threshold: 50 });
    expect(peaks).toEqual([]);
  });
});

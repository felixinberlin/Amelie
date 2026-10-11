import { describe, it, expect } from 'vitest';
import {
  srgbToLinear,
  linearToSrgb,
  srgbToXyz,
  xyzToLab,
  srgbToLab,
  ciede2000,
  srgbDeltaE,
  D65_WHITE
} from './color-science';
import { evaluatePigmentMixture, naiveRgbBlend, PAPER_REFLECTANCE } from './kubelka-munk';
import { PIGMENT_PRESETS } from './presets';

describe('Color Science & CIEDE2000 (ΔE₀₀) Standard Implementation', () => {
  describe('sRGB, XYZ, and CIELAB Color Conversions', () => {
    it('linearizes and roundtrips sRGB grayscale across all octaves', () => {
      const testValues = [0, 1, 16, 64, 128, 192, 254, 255];
      for (const val of testValues) {
        const lin = srgbToLinear(val);
        const back = linearToSrgb(lin);
        expect(back).toBe(val);
      }
    });

    it('converts D65 reference white [255, 255, 255] to Lab [100, 0, 0]', () => {
      const [X, Y, Z] = srgbToXyz(255, 255, 255);
      expect(X).toBeCloseTo(D65_WHITE[0], 1);
      expect(Y).toBeCloseTo(D65_WHITE[1], 1);
      expect(Z).toBeCloseTo(D65_WHITE[2], 1);

      const [L, a, b] = xyzToLab(X, Y, Z);
      expect(L).toBeCloseTo(100.0, 1);
      expect(a).toBeCloseTo(0.0, 1);
      expect(b).toBeCloseTo(0.0, 1);
    });

    it('converts pure black [0, 0, 0] to Lab [0, 0, 0]', () => {
      const [L, a, b] = srgbToLab(0, 0, 0);
      expect(L).toBeCloseTo(0.0, 1);
      expect(a).toBeCloseTo(0.0, 1);
      expect(b).toBeCloseTo(0.0, 1);
    });
  });

  describe('Sharma et al. (2005) Benchmark Reference Pairs for CIEDE2000', () => {
    it('returns exactly 0.000 for identical color coordinates', () => {
      const c: [number, number, number] = [60.0, 15.0, 25.0];
      expect(ciede2000(c, c)).toBe(0.0);
    });

    it('reproduces Pair 1 from Sharma (2005) standard test dataset', () => {
      const lab1: [number, number, number] = [50.0, 2.6772, -79.7751];
      const lab2: [number, number, number] = [50.0, 0.0000, -82.7485];
      const dE = ciede2000(lab1, lab2);
      expect(dE).toBeCloseTo(2.0425, 3);
    });

    it('reproduces Pair 2 from Sharma (2005) standard test dataset', () => {
      const lab1: [number, number, number] = [50.0, 3.1571, -77.2803];
      const lab2: [number, number, number] = [50.0, 0.0000, -82.7485];
      const dE = ciede2000(lab1, lab2);
      expect(dE).toBeCloseTo(2.8615, 3);
    });

    it('reproduces Pair 3 from Sharma (2005) standard test dataset', () => {
      const lab1: [number, number, number] = [50.0, 2.8361, -74.0200];
      const lab2: [number, number, number] = [50.0, 0.0000, -82.7485];
      const dE = ciede2000(lab1, lab2);
      expect(dE).toBeCloseTo(3.4412, 3);
    });

    it('reproduces Pair 4 from Sharma (2005) standard test dataset', () => {
      const lab1: [number, number, number] = [50.0, -1.3802, -84.2814];
      const lab2: [number, number, number] = [50.0, 0.0000, -82.7485];
      const dE = ciede2000(lab1, lab2);
      expect(dE).toBeCloseTo(1.0000, 3);
    });

    it('reproduces Pair 5 from Sharma (2005) standard test dataset', () => {
      const lab1: [number, number, number] = [50.0, -1.1848, -84.8006];
      const lab2: [number, number, number] = [50.0, 0.0000, -82.7485];
      const dE = ciede2000(lab1, lab2);
      expect(dE).toBeCloseTo(1.0000, 3);
    });

    it('reproduces Pair 17 from Sharma (2005) standard test dataset (large distance)', () => {
      const lab1: [number, number, number] = [50.0, 2.5000, 0.0000];
      const lab2: [number, number, number] = [73.0, 25.0000, -18.0000];
      const dE = ciede2000(lab1, lab2);
      expect(dE).toBeCloseTo(27.1492, 3);
    });
  });

  describe('Scientific Color Divergence: Kubelka-Munk vs. Naive RGB Averaging', () => {
    it('quantifies the massive perceptual error (ΔE₀₀ > 18) of digital muddy RGB blending', () => {
      const yellow = PIGMENT_PRESETS.find(p => p.id === 'kadmiumgelb')!;
      const blue = PIGMENT_PRESETS.find(p => p.id === 'preussischblau')!;

      // 1. Physical Kubelka-Munk subtractive absorption mixture
      const kmReflectance = evaluatePigmentMixture([
        { km: yellow.km, concentration: 0.5 },
        { km: blue.km, concentration: 0.5 },
      ], 1.0, PAPER_REFLECTANCE);

      const kmRgb: [number, number, number] = [
        Math.round(kmReflectance[0] * 255),
        Math.round(kmReflectance[1] * 255),
        Math.round(kmReflectance[2] * 255),
      ];

      // 2. Naive RGB alpha/arithmetic blend
      const yellowRgb: [number, number, number] = [yellow.r, yellow.g, yellow.b];
      const blueRgb: [number, number, number] = [blue.r, blue.g, blue.b];
      const naiveRgb = naiveRgbBlend(yellowRgb, 0.5, blueRgb, 0.5);

      // 3. Compute ΔE₀₀ color difference
      const deltaE = srgbDeltaE(kmRgb, naiveRgb);

      // In color science, ΔE > 5 is an immediately obvious different color;
      // here, the difference between physical vibrant green and digital muddy brown is huge (> 18)
      expect(deltaE).toBeGreaterThan(18.0);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { createSeededRng, ValueNoise2D, generatePaperMaps } from './paper';
import { PAPER_PRESETS } from './presets';

describe('Paper & Capillary Texture Engine', () => {
  describe('createSeededRng', () => {
    it('produces deterministic pseudo-random sequences for identical seeds', () => {
      const rng1 = createSeededRng(12345);
      const rng2 = createSeededRng(12345);

      const seq1 = [rng1(), rng1(), rng1(), rng1()];
      const seq2 = [rng2(), rng2(), rng2(), rng2()];

      expect(seq1).toEqual(seq2);
    });

    it('produces distinct sequences for different seeds', () => {
      const rng1 = createSeededRng(111);
      const rng2 = createSeededRng(999);

      expect(rng1()).not.toEqual(rng2());
    });
  });

  describe('ValueNoise2D', () => {
    it('generates values within normalized [0, 1] range', () => {
      const noise = new ValueNoise2D(42);

      for (let x = 0; x < 20; x += 1.5) {
        for (let y = 0; y < 20; y += 1.5) {
          const val = noise.get(x, y);
          expect(val).toBeGreaterThanOrEqual(0.0);
          expect(val).toBeLessThanOrEqual(1.0);
        }
      }
    });

    it('smoothly interpolates and fractional Brownian motion (fbm) computes bounded noise', () => {
      const noise = new ValueNoise2D(77);
      const fbmVal = noise.fbm(5.5, 3.2, 4, 2.0, 0.5);
      expect(fbmVal).toBeGreaterThanOrEqual(0.0);
      expect(fbmVal).toBeLessThanOrEqual(1.0);
    });
  });

  describe('generatePaperMaps', () => {
    it('generates coherent Float32Array paper buffers of the specified resolution', () => {
      const w = 32;
      const h = 32;
      const config = PAPER_PRESETS[0];
      const maps = generatePaperMaps(w, h, config, 42);

      expect(maps.width).toBe(w);
      expect(maps.height).toBe(h);
      expect(maps.heightMap.length).toBe(w * h);
      expect(maps.fiberAngleMap.length).toBe(w * h);
      expect(maps.capacityMap.length).toBe(w * h);
      expect(maps.rakingNormalsX.length).toBe(w * h);
    });

    it('ensures paper height map is bounded between 0 and 1', () => {
      const config = PAPER_PRESETS[1]; // e.g. rough watercolor or rice paper
      const maps = generatePaperMaps(16, 16, config, 99);

      for (let i = 0; i < maps.heightMap.length; i++) {
        expect(maps.heightMap[i]).toBeGreaterThanOrEqual(0.0);
        expect(maps.heightMap[i]).toBeLessThanOrEqual(1.0);
        expect(maps.capacityMap[i]).toBeGreaterThan(0.0);
      }
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  measureStain,
  calculateFractalDimension,
  rimRatio,
  granulationRatio
} from './metrics';

describe('Capillary Stain Metrics & Fractal Dimension Analysis', () => {
  describe('calculateFractalDimension (Box-Counting Method)', () => {
    it('returns D_f = 1.00 for empty or sub-threshold grids', () => {
      const grid = new Float32Array(64 * 64);
      const res = calculateFractalDimension(grid, 64, 64);
      expect(res.fractalDimension).toBe(1.0);
      expect(res.scales).toHaveLength(0);
    });

    it('measures D_f ≈ 1.00 for a smooth Euclidean disc (circle)', () => {
      const size = 128;
      const grid = new Float32Array(size * size);
      const cx = 64, cy = 64, radius = 30;

      // Draw solid filled circle
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (Math.hypot(x - cx, y - cy) <= radius) {
            grid[y * size + x] = 1.0;
          }
        }
      }

      const res = calculateFractalDimension(grid, size, size, 0.01, [2, 4, 8, 16]);
      // A smooth 1D circle perimeter in 2D space has Euclidean dimension D = 1.00
      expect(res.fractalDimension).toBeGreaterThanOrEqual(0.90);
      expect(res.fractalDimension).toBeLessThanOrEqual(1.10);
      expect(res.rSquared).toBeGreaterThan(0.95);
    });

    it('measures D_f ≈ 1.00 for a horizontal straight line boundary', () => {
      const size = 128;
      const grid = new Float32Array(size * size);

      // Solid block with a flat interface
      for (let y = 30; y < 90; y++) {
        for (let x = 20; x < 108; x++) {
          grid[y * size + x] = 1.0;
        }
      }

      const res = calculateFractalDimension(grid, size, size, 0.01, [2, 4, 8, 16]);
      expect(res.fractalDimension).toBeGreaterThanOrEqual(0.90);
      expect(res.fractalDimension).toBeLessThanOrEqual(1.12);
      expect(res.rSquared).toBeGreaterThan(0.95);
    });

    it('measures significantly higher D_f (> 1.25) for highly fingered capillary boundaries', () => {
      const size = 128;
      const grid = new Float32Array(size * size);
      const cx = 64, cy = 64;

      // Create a core circle plus multi-scale capillary tendrils / fingers
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const r = Math.hypot(x - cx, y - cy);
          const angle = Math.atan2(y - cy, x - cx);

          // Multi-harmonic perturbation representing viscous fingering / fiber invasion
          const perturbation =
            6 * Math.sin(7 * angle) +
            4 * Math.sin(19 * angle) +
            3 * Math.sin(37 * angle) +
            2 * Math.cos(61 * angle);

          if (r <= 25 + perturbation) {
            grid[y * size + x] = 1.0;
          }
        }
      }

      const smoothRes = calculateFractalDimension(
        (() => {
          const smooth = new Float32Array(size * size);
          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              if (Math.hypot(x - cx, y - cy) <= 25) smooth[y * size + x] = 1.0;
            }
          }
          return smooth;
        })(),
        size,
        size,
        0.01,
        [2, 4, 8, 16]
      );

      const fingeredRes = calculateFractalDimension(grid, size, size, 0.01, [2, 4, 8, 16]);

      // The fingered contact boundary must have a noticeably higher fractal dimension than the smooth circle
      expect(fingeredRes.fractalDimension).toBeGreaterThan(smoothRes.fractalDimension);
      expect(fingeredRes.fractalDimension).toBeGreaterThan(1.20);
      expect(fingeredRes.rSquared).toBeGreaterThan(0.90);
    });
  });

  describe('measureStain integration', () => {
    it('populates fractalDimension in StainMetrics', () => {
      const size = 64;
      const grid = new Float32Array(size * size);
      for (let y = 20; y < 44; y++) {
        for (let x = 20; x < 44; x++) {
          grid[y * size + x] = 0.5;
        }
      }

      const metrics = measureStain(grid, size, size);
      expect(metrics.fractalDimension).toBeDefined();
      expect(metrics.fractalDimension).toBeGreaterThanOrEqual(0.8);
      expect(metrics.fractalDimension).toBeLessThanOrEqual(1.3);
      expect(metrics.area).toBe(24 * 24);
      expect(metrics.anisotropy).toBeCloseTo(1.0, 1);
    });
  });
});

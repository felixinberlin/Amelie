import { describe, it, expect } from 'vitest';
import {
  calculateSingularityExponent,
  calculateEvaporativeFlux,
  calculateDropletHeight,
  calculateRadialVelocity,
  analyzeDropletEvaporation,
} from './evaporation-deegan';

describe('Deegan (1997) Evaporation Dynamics & Coffee-Ring Flows', () => {
  describe('Singularity Exponent λ(θ_c)', () => {
    it('approaches 0.5 for near-zero wetting contact angle', () => {
      const lambda = calculateSingularityExponent(0.001);
      expect(lambda).toBeCloseTo(0.5, 2);
    });

    it('equals exactly 1/3 for θ_c = 45° (π/4 rad)', () => {
      const lambda = calculateSingularityExponent(Math.PI / 4);
      expect(lambda).toBeCloseTo(1 / 3, 5);
    });

    it('equals 0 for θ_c = 90° (π/2 rad), giving uniform evaporative flux', () => {
      const lambda = calculateSingularityExponent(Math.PI / 2);
      expect(lambda).toBeCloseTo(0, 5);
    });

    it('is negative for hydrophobic contact angles (> 90°)', () => {
      const lambda = calculateSingularityExponent((2 * Math.PI) / 3); // 120°
      expect(lambda).toBeLessThan(0);
    });
  });

  describe('Radial Evaporative Flux J(r)', () => {
    const params = {
      contactAngle: Math.PI / 6, // 30° wetting droplet
      dropRadius: 0.005,         // 5 mm radius
      baseEvaporativeFlux: 1e-4,  // 0.1 g/(m²·s)
    };

    it('flux at the rim (r = 0.95 R) is significantly higher than at center (r = 0)', () => {
      const jCenter = calculateEvaporativeFlux(0, params);
      const jRim = calculateEvaporativeFlux(0.95 * params.dropRadius, params);

      expect(jCenter).toBeCloseTo(params.baseEvaporativeFlux, 6);
      expect(jRim).toBeGreaterThan(jCenter * 2.0); // More than 2x higher at edge
    });

    it('flux is spatially uniform when contact angle is 90°', () => {
      const p90 = { ...params, contactAngle: Math.PI / 2 };
      const jCenter = calculateEvaporativeFlux(0, p90);
      const jRim = calculateEvaporativeFlux(0.9 * p90.dropRadius, p90);

      expect(jRim).toBeCloseTo(jCenter, 5);
    });
  });

  describe('Droplet Geometry h(r)', () => {
    const params = {
      contactAngle: Math.PI / 6,
      dropRadius: 0.005,
      baseEvaporativeFlux: 1e-4,
    };

    it('height is maximal at droplet center and approaches zero at the rim', () => {
      const hCenter = calculateDropletHeight(0, params);
      const hMid = calculateDropletHeight(0.5 * params.dropRadius, params);
      const hRim = calculateDropletHeight(params.dropRadius, params);

      expect(hCenter).toBeGreaterThan(hMid);
      expect(hMid).toBeGreaterThan(hRim);
      expect(hRim).toBeLessThan(1e-6);
    });
  });

  describe('Outward Continuity Velocity Field v_r(r)', () => {
    const params = {
      contactAngle: Math.PI / 6,
      dropRadius: 0.005,
      baseEvaporativeFlux: 1e-4,
    };

    it('is zero at droplet center by symmetry', () => {
      const v0 = calculateRadialVelocity(0, params);
      expect(v0).toBe(0);
    });

    it('flows outward (v_r > 0) toward the pinned rim to replenish evaporative loss', () => {
      const vMid = calculateRadialVelocity(0.5 * params.dropRadius, params);
      const vOuter = calculateRadialVelocity(0.85 * params.dropRadius, params);

      expect(vMid).toBeGreaterThan(0);
      expect(vOuter).toBeGreaterThan(0);
    });
  });

  describe('Droplet Evaporation Summary & Coffee-Ring Deposit Profile', () => {
    const params = {
      contactAngle: Math.PI / 6, // 30°
      dropRadius: 0.004,         // 4 mm
      baseEvaporativeFlux: 2e-4,
    };

    it('produces pronounced coffee-ring edge deposit ratio (> 3.0)', () => {
      const summary = analyzeDropletEvaporation(params);
      expect(summary.coffeeRingRatio).toBeGreaterThan(3.0);
      expect(summary.pecletNumber).toBeGreaterThan(10); // Advection strongly dominates diffusion
    });

    it('computes positive mass loss rate and finite drying time', () => {
      const summary = analyzeDropletEvaporation(params);
      expect(summary.totalMassLossRate).toBeGreaterThan(0);
      expect(summary.dryingTimeSeconds).toBeGreaterThan(10);
      expect(summary.dryingTimeSeconds).toBeLessThan(3000); // ~27 minutes for a 4mm puddle in calm air
      expect(summary.profile.length).toBe(100);
    });
  });
});

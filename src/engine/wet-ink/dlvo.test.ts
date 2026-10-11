import { describe, it, expect } from 'vitest';
import {
  calculateDebyeProperties,
  calculateVanDerWaalsEnergy,
  calculateElectrostaticRepulsion,
  calculateTotalDlvoEnergy,
  analyzeDlvoStability,
  simulateEvaporativeDlvo,
  COLLOID_PIGMENT_CATALOG,
} from './dlvo';

describe('DLVO Colloid Stability & Evaporative Flocculation', () => {
  describe('Debye Properties & Screened Electrostatics', () => {
    it('computes expected Debye length for 1 mM and 10 mM aqueous electrolyte at 25 °C', () => {
      // Theoretical values for 1:1 electrolyte in water at 25 °C (eps_r = 78.4):
      // at 1 mM (0.001 M): lambda_D ≈ 9.6 nm
      // at 10 mM (0.010 M): lambda_D ≈ 3.04 nm
      const res1mM = calculateDebyeProperties({
        temperature: 298.15,
        ionicStrength: 0.001,
      });
      expect(res1mM.debyeLength * 1e9).toBeCloseTo(9.63, 1);

      const res10mM = calculateDebyeProperties({
        temperature: 298.15,
        ionicStrength: 0.01,
      });
      expect(res10mM.debyeLength * 1e9).toBeCloseTo(3.04, 1);
    });

    it('Debye length shrinks inversely with sqrt(ionic strength)', () => {
      const res1 = calculateDebyeProperties({ temperature: 298.15, ionicStrength: 0.001 });
      const res4 = calculateDebyeProperties({ temperature: 298.15, ionicStrength: 0.004 });
      // ratio should be sqrt(4) = 2
      expect(res1.debyeLength / res4.debyeLength).toBeCloseTo(2.0, 3);
    });
  });

  describe('Van der Waals Attractive Energy', () => {
    const carbon = COLLOID_PIGMENT_CATALOG.carbonBlackGelatin.particle;

    it('is strictly negative for all separations', () => {
      const separations = [0.1e-9, 1e-9, 5e-9, 10e-9, 50e-9];
      for (const H of separations) {
        const va = calculateVanDerWaalsEnergy(H, carbon);
        expect(va).toBeLessThan(0);
      }
    });

    it('magnitude increases strongly as separation approaches zero', () => {
      const va10nm = calculateVanDerWaalsEnergy(10e-9, carbon);
      const va1nm = calculateVanDerWaalsEnergy(1e-9, carbon);
      const va01nm = calculateVanDerWaalsEnergy(0.1e-9, carbon);

      expect(Math.abs(va1nm)).toBeGreaterThan(Math.abs(va10nm));
      expect(Math.abs(va01nm)).toBeGreaterThan(Math.abs(va1nm));
    });
  });

  describe('Electrostatic Double-Layer Repulsion', () => {
    const carbon = COLLOID_PIGMENT_CATALOG.carbonBlackGelatin.particle;
    const solution = COLLOID_PIGMENT_CATALOG.carbonBlackGelatin.defaultSolution;

    it('is strictly non-negative', () => {
      const vr = calculateElectrostaticRepulsion(2e-9, carbon, solution);
      expect(vr).toBeGreaterThan(0);
    });

    it('decays monotonically with increasing separation distance', () => {
      const vr1 = calculateElectrostaticRepulsion(1e-9, carbon, solution);
      const vr5 = calculateElectrostaticRepulsion(5e-9, carbon, solution);
      const vr20 = calculateElectrostaticRepulsion(20e-9, carbon, solution);

      expect(vr1).toBeGreaterThan(vr5);
      expect(vr5).toBeGreaterThan(vr20);
    });
  });

  describe('Total DLVO Energy & Colloidal Stability', () => {
    const carbon = COLLOID_PIGMENT_CATALOG.carbonBlackGelatin.particle;
    const solution = COLLOID_PIGMENT_CATALOG.carbonBlackGelatin.defaultSolution;

    it('pine soot ink in dilute solution displays a stable energy barrier (V_max > 20 k_B T)', () => {
      const profile = analyzeDlvoStability(carbon, solution);
      expect(profile.stability).toBe('stable');
      expect(profile.barrierKBT).toBeGreaterThan(20);
      expect(profile.hBarrier).toBeGreaterThan(0.5e-9); // Barrier located around 1-5 nm
      expect(profile.hBarrier).toBeLessThan(15e-9);
    });

    it('mineral vermilion cinnabar has lower barrier and earlier instability than carbon soot', () => {
      const vermilion = COLLOID_PIGMENT_CATALOG.vermilionMineral;
      const vProfile = analyzeDlvoStability(vermilion.particle, vermilion.defaultSolution);
      const cProfile = analyzeDlvoStability(carbon, solution);

      // Vermilion has higher Hamaker constant and lower zeta potential
      expect(vProfile.barrierKBT).toBeLessThan(cProfile.barrierKBT);
    });
  });

  describe('Evaporative Destabilization & Granulation Dynamics', () => {
    const vermilion = COLLOID_PIGMENT_CATALOG.vermilionMineral;

    it('as water evaporates, ionic strength rises and collapses the barrier', () => {
      const carbon = COLLOID_PIGMENT_CATALOG.carbonBlackGelatin;
      const wet = simulateEvaporativeDlvo(carbon.particle, carbon.defaultSolution, 1.0);
      const drying = simulateEvaporativeDlvo(carbon.particle, carbon.defaultSolution, 0.35); // 65% evaporated
      const dry = simulateEvaporativeDlvo(carbon.particle, carbon.defaultSolution, 0.01); // 99% evaporated

      expect(drying.currentIonicStrength).toBeGreaterThan(wet.currentIonicStrength);
      expect(dry.currentIonicStrength).toBeGreaterThan(drying.currentIonicStrength);

      expect(wet.profile.barrierKBT).toBeGreaterThan(20);
      expect(drying.profile.barrierKBT).toBeLessThan(wet.profile.barrierKBT);
      expect(dry.profile.barrierKBT).toBeLessThan(drying.profile.barrierKBT);

      // In late stage drying, aggregation rate factor rises toward 1.0 (fast coagulation)
      expect(dry.aggregationRateFactor).toBeGreaterThan(wet.aggregationRateFactor);
      expect(dry.profile.stability).toBe('fast_coagulation');
    });
  });
});

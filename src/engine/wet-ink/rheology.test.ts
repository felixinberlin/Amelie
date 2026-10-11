import { describe, it, expect } from 'vitest';
import {
  calculateCrossViscosity,
  calculateCarreauYasudaViscosity,
  calculateHerschelBulkley,
  calculateSteadyStateThixotropy,
  evolveThixotropy,
  estimateShearRate,
  INK_RHEOLOGY_CATALOG,
} from './rheology';

describe('Non-Newtonian Ink Rheology & Thixotropy', () => {
  describe('Cross (1965) Viscosity Model', () => {
    const pineInk = INK_RHEOLOGY_CATALOG.pineSootGelatin.cross;

    it('matches zero-shear viscosity at gammaDot = 0', () => {
      const etaZero = calculateCrossViscosity(0, pineInk);
      expect(etaZero).toBeCloseTo(pineInk.eta0, 5);
    });

    it('approaches infinite-shear viscosity at high shear rate (10^6 s^-1)', () => {
      const etaInf = calculateCrossViscosity(1e6, pineInk);
      expect(etaInf).toBeCloseTo(pineInk.etaInf, 3);
    });

    it('is strictly monotonic decreasing with shear rate (shear-thinning)', () => {
      const rates = [0, 0.1, 1, 10, 100, 1000, 10000];
      const viscosities = rates.map((r) => calculateCrossViscosity(r, pineInk));
      for (let i = 1; i < viscosities.length; i++) {
        expect(viscosities[i]).toBeLessThan(viscosities[i - 1]);
      }
    });

    it('handles negative shear rates by clamping to zero', () => {
      expect(calculateCrossViscosity(-10, pineInk)).toBeCloseTo(pineInk.eta0, 5);
    });
  });

  describe('Carreau-Yasuda (1972) Viscosity Model', () => {
    const pineCarreau = INK_RHEOLOGY_CATALOG.pineSootGelatin.carreau;

    it('matches zero-shear viscosity at gammaDot = 0', () => {
      const eta = calculateCarreauYasudaViscosity(0, pineCarreau);
      expect(eta).toBeCloseTo(pineCarreau.eta0, 5);
    });

    it('approaches infinite-shear viscosity at extreme shear rate', () => {
      const etaHigh = calculateCarreauYasudaViscosity(1e6, pineCarreau);
      expect(etaHigh).toBeCloseTo(pineCarreau.etaInf, 3);
    });

    it('exhibits smooth transition governed by powerLawIndex n < 1', () => {
      const etaLow = calculateCarreauYasudaViscosity(1, pineCarreau);
      const etaMid = calculateCarreauYasudaViscosity(100, pineCarreau);
      expect(etaMid).toBeLessThan(etaLow);
      expect(etaMid).toBeGreaterThan(pineCarreau.etaInf);
    });
  });

  describe('Herschel-Bulkley Yield Stress Model', () => {
    const vermilion = INK_RHEOLOGY_CATALOG.vermilionCinnabar.yieldStress;

    it('reports unyielded state with exact yield stress at near-zero shear', () => {
      const res = calculateHerschelBulkley(0, vermilion);
      expect(res.isYielded).toBe(false);
      expect(res.shearStress).toBeCloseTo(vermilion.yieldStress, 4);
      expect(res.apparentViscosity).toBeGreaterThan(1e5);
    });

    it('yields and shows increasing shear stress under active flow', () => {
      const lowShear = calculateHerschelBulkley(10, vermilion);
      const highShear = calculateHerschelBulkley(100, vermilion);

      expect(lowShear.isYielded).toBe(true);
      expect(highShear.isYielded).toBe(true);
      expect(highShear.shearStress).toBeGreaterThan(lowShear.shearStress);
      // Apparent viscosity should decrease due to shear thinning
      expect(highShear.apparentViscosity).toBeLessThan(lowShear.apparentViscosity);
    });
  });

  describe('Thixotropic Structural Breakdown & Recovery', () => {
    const thix = INK_RHEOLOGY_CATALOG.pineSootGelatin.thixotropy;

    it('steady state structural parameter is 1.0 at rest (gammaDot = 0)', () => {
      const lambdaSS = calculateSteadyStateThixotropy(0, thix);
      expect(lambdaSS).toBeCloseTo(1.0, 5);
    });

    it('steady state structural parameter decreases toward 0 under high shear', () => {
      const lambdaSheared = calculateSteadyStateThixotropy(500, thix);
      expect(lambdaSheared).toBeLessThan(0.3);
      expect(lambdaSheared).toBeGreaterThan(0.0);
    });

    it('evolves over time: recovers toward 1.0 when shear ceases', () => {
      let lambda = 0.2; // deeply broken gel structure
      // Let it rest for 15 seconds (30 steps of 0.5 s, > 3 tau_rec)
      for (let t = 0; t < 30; t++) {
        lambda = evolveThixotropy(lambda, 0, 0.5, thix);
      }
      expect(lambda).toBeGreaterThan(0.90);
    });

    it('evolves over time: breaks down toward lambda_ss under persistent shear', () => {
      let lambda = 1.0; // fully structured gel
      // 50 steps of 0.1 s = 5.0 s under persistent shear
      for (let t = 0; t < 50; t++) {
        lambda = evolveThixotropy(lambda, 100, 0.1, thix);
      }
      const targetSS = calculateSteadyStateThixotropy(100, thix);
      expect(lambda).toBeCloseTo(targetSS, 2);
    });
  });

  describe('Stylus Tip Shear Rate Estimation', () => {
    it('estimates plausible shear rate for fountain pen writing (v=100 mm/s, h=10 μm)', () => {
      // 100 mm/s = 0.1 m/s, 10 μm = 1e-5 m => gammaDot = 0.1 / 1e-5 = 10,000 s^-1
      const gamma = estimateShearRate(100, 10);
      expect(gamma).toBeCloseTo(10000, 0);
    });

    it('estimates plausible shear rate for slow calligraphy brush wash (v=10 mm/s, h=50 μm)', () => {
      // 10 mm/s = 0.01 m/s, 50 μm = 5e-5 m => gammaDot = 0.01 / 5e-5 = 200 s^-1
      const gamma = estimateShearRate(10, 50);
      expect(gamma).toBeCloseTo(200, 0);
    });
  });

  describe('Catalog Presets Integrity', () => {
    it('contains all 5 authentic historical and modern ink formulations', () => {
      const keys = Object.keys(INK_RHEOLOGY_CATALOG);
      expect(keys).toContain('pineSootGelatin');
      expect(keys).toContain('vermilionCinnabar');
      expect(keys).toContain('fountainPenCarbon');
      expect(keys).toContain('ironGallHistoric');
      expect(keys).toContain('acrylicCalligraphy');
    });

    it('vermilion cinnabar has the highest yield stress in the catalog', () => {
      const cinnabarYield = INK_RHEOLOGY_CATALOG.vermilionCinnabar.yieldStress.yieldStress;
      for (const [key, profile] of Object.entries(INK_RHEOLOGY_CATALOG)) {
        if (key !== 'vermilionCinnabar') {
          expect(profile.yieldStress.yieldStress).toBeLessThan(cinnabarYield);
        }
      }
    });

    it('fountain pen carbon has the lowest rest viscosity (near water)', () => {
      const fpEta0 = INK_RHEOLOGY_CATALOG.fountainPenCarbon.cross.eta0;
      expect(fpEta0).toBeLessThan(0.01); // < 10 mPa·s
    });
  });
});

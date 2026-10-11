import { describe, it, expect } from 'vitest';
import {
  calculateWenzelAngle,
  calculateCassieBaxterAngle,
  calculateCriticalTransitionAngle,
  calculateLaplaceBreakthroughPressure,
  analyzePaperWettingRegime,
  PAPER_TOPOGRAPHY_CATALOG,
} from './wetting-regimes';

describe('Paper Topography & Wenzel / Cassie-Baxter Wetting Regimes', () => {
  describe('Wenzel (1936) Roughness Model', () => {
    it('smooth surface (r_w = 1.0) reproduces exact Young contact angle', () => {
      const thetaY = (45 * Math.PI) / 180;
      const thetaW = calculateWenzelAngle(thetaY, 1.0);
      expect(thetaW).toBeCloseTo(thetaY, 6);
    });

    it('roughness enhances hydrophilicity for theta_Y < 90°', () => {
      const thetaY = (60 * Math.PI) / 180; // cos(60°) = 0.5
      // With r_w = 1.5, cos(theta_W) = 1.5 * 0.5 = 0.75 => theta_W ≈ 41.4°
      const thetaW = calculateWenzelAngle(thetaY, 1.5);
      expect(thetaW).toBeLessThan(thetaY);
      expect((thetaW * 180) / Math.PI).toBeCloseTo(41.41, 1);
    });

    it('predicts complete wetting (theta_W = 0°) when r_w * cos(theta_Y) >= 1.0', () => {
      const thetaY = (30 * Math.PI) / 180; // cos(30°) ≈ 0.866
      // r_w = 1.5 => 1.5 * 0.866 = 1.299 >= 1
      const thetaW = calculateWenzelAngle(thetaY, 1.5);
      expect(thetaW).toBe(0.0);
    });
  });

  describe('Cassie-Baxter (1944) Heterogeneous Model', () => {
    it('solidFraction = 1.0 matches Young contact angle', () => {
      const thetaY = (50 * Math.PI) / 180;
      const thetaCB = calculateCassieBaxterAngle(thetaY, 1.0);
      expect(thetaCB).toBeCloseTo(thetaY, 6);
    });

    it('air trapping increases apparent contact angle (theta_CB > theta_Y)', () => {
      const thetaY = (50 * Math.PI) / 180;
      const thetaCB = calculateCassieBaxterAngle(thetaY, 0.5); // 50% fiber tops, 50% air pockets
      expect(thetaCB).toBeGreaterThan(thetaY);
    });
  });

  describe('Thermodynamic Transition Angle θ_c*', () => {
    it('computes critical angle where Wenzel and Cassie-Baxter energies intersect', () => {
      const rw = 1.5;
      const fs = 0.5;
      const thetaCrit = calculateCriticalTransitionAngle(rw, fs);
      // cos(theta_crit) = (0.5 - 1) / (1.5 - 0.5) = -0.5 / 1.0 = -0.5 => theta_crit = 120° (2π/3)
      expect((thetaCrit * 180) / Math.PI).toBeCloseTo(120, 3);
    });
  });

  describe('Laplace Breakthrough Pressure', () => {
    it('is negative for hydrophilic pores (spontaneous capillary suction)', () => {
      const thetaY = (40 * Math.PI) / 180; // cos > 0
      const poreRadius = 2e-6; // 2 μm
      const pLaplace = calculateLaplaceBreakthroughPressure(thetaY, poreRadius);
      expect(pLaplace).toBeLessThan(0);
      // ΔP = -2 * 0.0728 * cos(40°) / 2e-6 ≈ -55,768 Pa
      expect(pLaplace).toBeCloseTo(-55768, -2);
    });

    it('is positive for hydrophobic pores (resistance requiring stylus pressure)', () => {
      const thetaY = (110 * Math.PI) / 180; // cos < 0
      const poreRadius = 2e-6;
      const pLaplace = calculateLaplaceBreakthroughPressure(thetaY, poreRadius);
      expect(pLaplace).toBeGreaterThan(0);
    });
  });

  describe('Catalog Presets & Paper Behavior Analysis', () => {
    it('raw Sheng Xuan exhibits complete wetting due to high roughness and hydrophilicity', () => {
      const report = analyzePaperWettingRegime(PAPER_TOPOGRAPHY_CATALOG.shengXuan);
      expect(report.stableRegime).toBe('complete_wetting');
      expect(report.wenzelAngleDeg).toBe(0);
      expect(report.laplaceBreakthroughPressurePa).toBeLessThan(-20000); // Strong suction
    });

    it('sized Shu Xuan maintains a finite apparent contact angle and stable film', () => {
      const report = analyzePaperWettingRegime(PAPER_TOPOGRAPHY_CATALOG.shuXuan);
      expect(report.wenzelAngleDeg).toBeGreaterThan(70);
      expect(report.stableRegime).toBe('wenzel');
    });

    it('Arches Cold Press has highest roughness ratio (r_w > 2.0) in catalog', () => {
      const arches = PAPER_TOPOGRAPHY_CATALOG.archesAquarelle;
      expect(arches.roughnessRatio).toBeGreaterThan(2.0);
    });
  });
});

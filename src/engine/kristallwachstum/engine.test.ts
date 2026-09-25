import { describe, it, expect } from 'vitest';
import { KristallEngine, SimulationConfig } from './engine';

describe('KristallEngine: Hybrid DLA + Kobayashi Phase-Field', () => {
  const defaultConfig: SimulationConfig = {
    gridSize: 32,
    anisotropy: 0.05,
    undercooling: 0.65,
    stickiness: 0.85,
    symmetry: 'cubic',
    minWallThickness: 1.2,
    maxOverhang: 45,
    seed: 'K3D-TEST-001',
  };

  it('initializes with seed crystal at grid center', () => {
    const engine = new KristallEngine(defaultConfig);
    const metrics = engine.getMetrics();
    expect(metrics.solidVoxels).toBeGreaterThan(0);
    expect(metrics.isWatertight).toBe(true);
  });

  it('aggregates particles and relaxes via phase-field across steps', () => {
    const engine = new KristallEngine(defaultConfig);
    const initialVoxels = engine.getMetrics().solidVoxels;

    engine.step(150, 2);
    const newMetrics = engine.getMetrics();

    expect(newMetrics.solidVoxels).toBeGreaterThanOrEqual(initialVoxels);
    expect(newMetrics.growthTimeSteps).toBe(1);
    expect(newMetrics.fractalDimension).toBeGreaterThan(1.5);
    expect(newMetrics.fractalDimension).toBeLessThanOrEqual(3.0);
  });

  it('computes realistic 3D box-counting fractal dimension', () => {
    const engine = new KristallEngine(defaultConfig);
    engine.step(300, 3);
    const boxCount = engine.computeBoxCountingDimension();

    expect(boxCount.scales.length).toBeGreaterThan(1);
    expect(boxCount.dimension).toBeGreaterThan(1.8);
    expect(boxCount.dimension).toBeLessThan(3.0);
  });

  it('generates valid, watertight ASCII STL for 3D printing', () => {
    const engine = new KristallEngine(defaultConfig);
    engine.step(100, 1);
    const stl = engine.generateSTL();

    expect(stl.startsWith('solid Kristallwachstum3D_')).toBe(true);
    expect(stl.includes('facet normal')).toBe(true);
    expect(stl.includes('outer loop')).toBe(true);
    expect(stl.includes('endfacet')).toBe(true);
    expect(stl.endsWith('endsolid Kristallwachstum3D_K3D-TEST-001\n')).toBe(true);
  });
});

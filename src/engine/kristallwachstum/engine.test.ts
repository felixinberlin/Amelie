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

  it('extracts renderable surface voxels and respects slicing plane', () => {
    const engine = new KristallEngine(defaultConfig);
    engine.step(120, 2);

    const allVoxels = engine.getRenderableVoxels();
    expect(allVoxels.length).toBeGreaterThan(0);
    const firstVoxel = allVoxels[0];
    expect(firstVoxel).toHaveProperty('x');
    expect(firstVoxel).toHaveProperty('y');
    expect(firstVoxel).toHaveProperty('z');
    expect(firstVoxel).toHaveProperty('phi');
    expect(firstVoxel).toHaveProperty('orientHue');
    expect(firstVoxel).toHaveProperty('normal');
    expect(firstVoxel.normal.length).toBe(3);

    // Test slicing plane (cut off top half of the grid)
    const slicedVoxels = engine.getRenderableVoxels(16);
    expect(slicedVoxels.every((v) => v.z <= 16)).toBe(true);
  });

  it('supports dynamic config update without breaking state', () => {
    const engine = new KristallEngine(defaultConfig);
    engine.updateConfig({ anisotropy: 0.08, undercooling: 0.8 });
    const cfg = engine.getConfig();
    expect(cfg.anisotropy).toBe(0.08);
    expect(cfg.undercooling).toBe(0.8);
    expect(cfg.seed).toBe('K3D-TEST-001');
  });

  it('completes 50 iterations of Kobayashi phase-field relaxation without numerical blowup (Ticket 1 DoD)', () => {
    const engine = new KristallEngine(defaultConfig);
    // Initial DLA nucleation seed
    engine.step(200, 0);
    const initialVoxels = engine.getMetrics().solidVoxels;

    // Run 50 continuous iterations of Kobayashi phase-field relaxation
    engine.step(0, 50);

    const metricsAfter50 = engine.getMetrics();
    expect(metricsAfter50.solidVoxels).toBeGreaterThanOrEqual(initialVoxels);
    // Fractal dimension must be physically plausible (1.85 <= D_f <= 2.85)
    expect(metricsAfter50.fractalDimension).toBeGreaterThanOrEqual(1.85);
    expect(metricsAfter50.fractalDimension).toBeLessThanOrEqual(2.85);
    expect(metricsAfter50.isWatertight).toBe(true);

    // Phi values in the grid must remain strictly within [0, 1]
    const phiGrid = engine.getPhiGrid();
    for (let i = 0; i < phiGrid.length; i++) {
      expect(phiGrid[i]).toBeGreaterThanOrEqual(0.0);
      expect(phiGrid[i]).toBeLessThanOrEqual(1.0);
    }
  });

  it('WebGPUKristallPipeline gracefully detects support and provides safe CPU fallback', async () => {
    const { WebGPUKristallPipeline } = await import('./webgpuPipeline');
    const pipeline = new WebGPUKristallPipeline();
    const isSupported = WebGPUKristallPipeline.isWebGPUSupported();
    const initialized = await pipeline.initialize(32);

    const status = pipeline.getStatus();
    expect(status.supported).toBe(isSupported);
    if (!isSupported) {
      expect(initialized).toBe(false);
      expect(status.active).toBe(false);
    }
    pipeline.dispose();
  });
});

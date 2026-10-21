import { describe, it, expect } from 'vitest';
import { KristallEngine, SimulationConfig, boxCountingDimension, stabilityNumbers, PHYSICS } from './engine';

const base: SimulationConfig = {
  gridSize: 32,
  anisotropy: 0.05,
  undercooling: 0.6,
  stickiness: 0.85,
  symmetry: 'cubic',
  minWallThickness: 1.2,
  maxOverhang: 45,
  seed: 'K3D-TEST-001',
};

/** Distance from the grid centre to the last solid voxel along a direction. */
function extent(e: KristallEngine, dir: [number, number, number]): number {
  const g = e.getConfig().gridSize;
  const c = (g - 1) / 2;
  const phi = e.getPhiGrid();
  const L = Math.hypot(...dir);
  let r = 0;
  for (let t = 0; t < g; t += 0.25) {
    const x = Math.round(c + (dir[0] / L) * t);
    const y = Math.round(c + (dir[1] / L) * t);
    const z = Math.round(c + (dir[2] / L) * t);
    if (x < 0 || y < 0 || z < 0 || x >= g || y >= g || z >= g) break;
    if (phi[x + g * (y + g * z)] >= 0.5) r = t;
    else if (t > r + 2) break;
  }
  return r;
}

describe('KristallEngine: Kobayashi phase field + heat equation + seeded DLA', () => {
  it('uses a stable explicit time step (CFL ≤ 1) and refuses unstable settings', () => {
    const s = stabilityNumbers({ anisotropy: 0.1 });
    expect(s.phiCfl).toBeLessThan(1);
    expect(s.tCfl).toBeLessThan(1);
    expect(() => new KristallEngine({ ...base, anisotropy: 2 })).toThrow(/Unstable/);
  });

  it('is deterministic: same seed and ticks give an identical crystal', () => {
    const a = new KristallEngine(base);
    const b = new KristallEngine(base);
    a.tick(6);
    b.tick(6);
    expect(Array.from(a.getPhiGrid())).toEqual(Array.from(b.getPhiGrid()));
    expect(Array.from(a.getTempGrid())).toEqual(Array.from(b.getTempGrid()));

    const c = new KristallEngine({ ...base, seed: 'K3D-OTHER' });
    c.tick(6);
    expect(Array.from(c.getPhiGrid())).not.toEqual(Array.from(a.getPhiGrid()));
  });

  it('reset reproduces the run from the start', () => {
    const a = new KristallEngine(base);
    a.tick(4);
    const first = Array.from(a.getPhiGrid());
    a.resetWithSeed(base.seed);
    a.tick(4);
    expect(Array.from(a.getPhiGrid())).toEqual(first);
    expect(a.getMetrics().ticks).toBe(4);
  });

  it('stays numerically stable without clamping (strong anisotropy, deep undercooling)', () => {
    const e = new KristallEngine({ ...base, anisotropy: 0.1, undercooling: 0.95 });
    e.tick(30);
    const m = e.getMetrics();
    expect(m.clampEvents).toBe(0);
    const phi = e.getPhiGrid();
    for (let i = 0; i < phi.length; i++) {
      expect(Number.isFinite(phi[i])).toBe(true);
      expect(phi[i]).toBeGreaterThanOrEqual(0);
      expect(phi[i]).toBeLessThanOrEqual(1);
    }
  });

  it('grows under undercooling and does not grow without it', () => {
    const grow = new KristallEngine({ ...base, walkersPerTick: 0 });
    const n0 = grow.getMetrics().solidVoxels;
    grow.tick(20);
    expect(grow.getMetrics().solidVoxels).toBeGreaterThan(n0 * 3);

    const still = new KristallEngine({ ...base, undercooling: 0, walkersPerTick: 0 });
    const s0 = still.getMetrics().solidVoxels;
    still.tick(20);
    expect(still.getMetrics().solidVoxels).toBeLessThanOrEqual(s0);
  });

  it('releases latent heat at the interface, bounded near T_eq', () => {
    const e = new KristallEngine({ ...base, walkersPerTick: 0 });
    e.tick(20);
    const t0 = PHYSICS.tEq - base.undercooling;
    const m = e.getMetrics();
    expect(m.maxTemperature).toBeGreaterThan(t0 + 0.2);
    expect(m.maxTemperature).toBeLessThan(PHYSICS.tEq + 0.2);
  });

  it('grows isotropically when δ = 0 (within lattice error)', () => {
    const e = new KristallEngine({ ...base, gridSize: 40, anisotropy: 0, walkersPerTick: 0 });
    e.tick(15);
    const ax = [extent(e, [1, 0, 0]), extent(e, [0, 1, 0]), extent(e, [0, 0, 1])];
    const diag = extent(e, [1, 1, 1]);
    expect(Math.max(...ax) - Math.min(...ax)).toBeLessThanOrEqual(1);
    expect(Math.abs(diag / ax[0] - 1)).toBeLessThan(0.15);
  });

  it('cubic anisotropy: growth along ⟨100⟩ is faster than along ⟨111⟩', () => {
    const cfg = { ...base, gridSize: 40, undercooling: 0.8, walkersPerTick: 0 };
    const iso = new KristallEngine({ ...cfg, anisotropy: 0 });
    const ani = new KristallEngine({ ...cfg, anisotropy: 0.08 });
    iso.tick(22);
    ani.tick(22);
    const rIso = extent(iso, [1, 0, 0]) / extent(iso, [1, 1, 1]);
    const rAni = extent(ani, [1, 0, 0]) / extent(ani, [1, 1, 1]);
    expect(rAni).toBeGreaterThan(rIso + 0.08);
  });

  it('hexagonal symmetry grows plate-like (basal plane faster than c-axis)', () => {
    const e = new KristallEngine({ ...base, gridSize: 40, symmetry: 'hexagonal', anisotropy: 0.08, undercooling: 0.8, walkersPerTick: 0 });
    e.tick(25);
    expect(extent(e, [1, 0, 0]) - extent(e, [0, 0, 1])).toBeGreaterThanOrEqual(2);
  });

  it('DLA walkers attach and mark their birth tick', () => {
    const e = new KristallEngine({ ...base, walkersPerTick: 40, pfStepsPerTick: 0 });
    const n0 = e.getMetrics().solidVoxels;
    e.tick(3);
    expect(e.getMetrics().solidVoxels).toBeGreaterThan(n0);
    const birth = e.getBirthGrid();
    let max = 0;
    for (let i = 0; i < birth.length; i++) max = Math.max(max, birth[i]);
    expect(max).toBeGreaterThanOrEqual(1);
    expect(max).toBeLessThanOrEqual(3);
  });

  it('box counting recovers D = 1, 2, 3 for a line, a plane and a cube (honest R²)', () => {
    const g = 64;
    const line = new Float32Array(g ** 3);
    const plane = new Float32Array(g ** 3);
    const cube = new Float32Array(g ** 3);
    for (let z = 0; z < g; z++) for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) {
      const i = x + g * (y + g * z);
      if (y === 32 && z === 32) line[i] = 1;
      if (z === 32) plane[i] = 1;
      cube[i] = 1;
    }
    for (const [f, d] of [[line, 1], [plane, 2], [cube, 3]] as const) {
      const r = boxCountingDimension(f, g);
      expect(r.dimension).toBeCloseTo(d, 1);
      expect(r.r2).toBeGreaterThan(0.99);
    }
  });

  it('box counting warns instead of inventing a value for tiny crystals', () => {
    const e = new KristallEngine(base);
    const r = e.computeBoxCountingDimension();
    expect(r.warning).not.toBeNull();
  });

  it('mean curvature of a sphere is about 2/R', () => {
    const g = 32;
    const R = 8;
    const c = (g - 1) / 2;
    const phi = new Float32Array(g ** 3);
    for (let z = 0; z < g; z++) for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) {
      const d = Math.hypot(x - c, y - c, z - c);
      phi[x + g * (y + g * z)] = 0.5 * (1 - Math.tanh((d - R) / 1.5));
    }
    const e = new KristallEngine(base);
    e.setFields(phi, e.getTempGrid());
    let sum = 0;
    let n = 0;
    for (let z = 1; z < g - 1; z++) for (let y = 1; y < g - 1; y++) for (let x = 1; x < g - 1; x++) {
      const p = phi[x + g * (y + g * z)];
      if (p > 0.3 && p < 0.7) {
        sum += e.curvatureAt(x, y, z);
        n++;
      }
    }
    expect(sum / n).toBeGreaterThan((2 / R) * 0.75);
    expect(sum / n).toBeLessThan((2 / R) * 1.25);
  });

  it('IPF colour: ⟨001⟩ red, ⟨101⟩ green, ⟨111⟩ blue', () => {
    const r = KristallEngine.ipfColor([0, 0, 1]);
    const gr = KristallEngine.ipfColor([Math.SQRT1_2, 0, Math.SQRT1_2]);
    const b = KristallEngine.ipfColor([1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)]);
    expect(r[0]).toBe(255);
    expect(gr[1]).toBe(255);
    expect(b[2]).toBe(255);
  });

  it('renderable voxels respect the slicing plane and carry lens attributes', () => {
    const e = new KristallEngine(base);
    e.tick(8);
    const all = e.getRenderableVoxels();
    expect(all.length).toBeGreaterThan(0);
    expect(all[0].ipf).toHaveLength(3);
    expect(Number.isFinite(all[0].curvature)).toBe(true);
    const sliced = e.getRenderableVoxels(16);
    expect(sliced.every((v) => v.z <= 16)).toBe(true);
  });

  it('WebGPUKristallPipeline reports no support in Node and stays inactive', async () => {
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

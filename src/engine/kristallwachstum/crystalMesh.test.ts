import { describe, it, expect } from 'vitest';
import { formatRecipe, parseRecipe, Recipe } from './recipe';
import { KristallEngine } from './engine';
import { buildCrystalMesh, vertexColors, exportMaterials, inferno } from './crystalMesh';
import { meshStats } from './isosurface';

describe('recipe token', () => {
  const r: Recipe = { seed: 'K3D-BI-9941', anisotropy: 0.08, undercooling: 0.8, stickiness: 0.88, gridSize: 48, symmetry: 'cubic', ticks: 37 };

  it('round-trips, including seeds with dashes', () => {
    const tok = formatRecipe(r);
    expect(tok).toBe('K3D1-K3D-BI-9941-A80-U80-S88-G48-C-T37');
    expect(parseRecipe(tok)).toEqual(r);
  });

  it('rejects malformed or out-of-range tokens', () => {
    expect(parseRecipe('nonsense')).toBeNull();
    expect(parseRecipe('K3D1-seed-A80-U80-S88-G47-C-T37')).toBeNull();
    expect(parseRecipe('K3D1-seed-A80-U80-S88-G48-X-T37')).toBeNull();
    expect(parseRecipe('K3D1--A80-U80-S88-G48-C-T37')).toBeNull();
    expect(parseRecipe('K3D1-seed-A80-U80-S88-G48-C-T99999')).toBeNull();
  });

  it('replaying a recipe reproduces the crystal', () => {
    const cfg = { gridSize: 32, anisotropy: 0.06, undercooling: 0.7, stickiness: 0.8, symmetry: 'cubic' as const, minWallThickness: 1, maxOverhang: 45, seed: 'abc' };
    const a = new KristallEngine(cfg);
    a.tick(5);
    const parsed = parseRecipe(formatRecipe({ ...cfg, ticks: a.getMetrics().ticks }))!;
    const b = new KristallEngine({ ...cfg, ...parsed });
    b.tick(parsed.ticks);
    expect(Array.from(b.getPhiGrid())).toEqual(Array.from(a.getPhiGrid()));
  });
});

describe('crystal mesh from a grown crystal', () => {
  const engine = new KristallEngine({ gridSize: 32, anisotropy: 0.06, undercooling: 0.75, stickiness: 0.85, symmetry: 'cubic', minWallThickness: 1, maxOverhang: 45, seed: 'mesh' });
  engine.tick(18);
  const data = buildCrystalMesh(engine, { voxelSize: 1 });

  it('is watertight and samples attributes per vertex', () => {
    const s = meshStats(data.mesh);
    expect(s.isWatertight).toBe(true);
    const nV = data.mesh.positions.length / 3;
    expect(data.birth.length).toBe(nV);
    expect(data.maxTick).toBeGreaterThan(1);
    expect(data.tempRange[1]).toBeGreaterThanOrEqual(data.tempRange[0]);
  });

  it('cross-section stays watertight', () => {
    const half = buildCrystalMesh(engine, { voxelSize: 1, maxZ: 15 });
    expect(meshStats(half.mesh).isWatertight).toBe(true);
  });

  it('every lens yields valid colours in [0,1]', () => {
    for (const lens of ['ORIENT', 'ZONING', 'THERM', 'CURV', 'SEM'] as const) {
      const c = vertexColors(data, lens);
      expect(c.length).toBe(data.mesh.positions.length);
      for (let i = 0; i < c.length; i++) {
        expect(c[i]).toBeGreaterThanOrEqual(0);
        expect(c[i]).toBeLessThanOrEqual(1);
      }
    }
  });

  it('export materials index into their palette', () => {
    for (const lens of ['ZONING', 'ORIENT'] as const) {
      const { triangleMaterial, palette } = exportMaterials(data, lens);
      expect(triangleMaterial.length).toBe(data.mesh.indices.length / 3);
      expect(Math.max(...triangleMaterial)).toBeLessThan(palette.length);
      expect(new Set(triangleMaterial).size).toBeGreaterThan(1);
    }
  });

  it('inferno ramp runs dark to bright', () => {
    const lo = inferno(0);
    const hi = inferno(1);
    expect(lo[0] + lo[1] + lo[2]).toBeLessThan(hi[0] + hi[1] + hi[2]);
  });
});

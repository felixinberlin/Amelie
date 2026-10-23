import { describe, it, expect } from 'vitest';
import { extractIsosurface, meshStats, triangleNormals, triangleCentroids, vertexNormals } from './isosurface';
import { mulberry32 } from './prng';

function sphereField(g: number, R: number, width = 1.5): Float32Array {
  const c = (g - 1) / 2;
  const f = new Float32Array(g ** 3);
  for (let z = 0; z < g; z++) for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) {
    const d = Math.hypot(x - c, y - c, z - c);
    f[x + g * (y + g * z)] = 0.5 * (1 - Math.tanh((d - R) / width));
  }
  return f;
}

describe('marching tetrahedra isosurface (Ticket 02, Task 1)', () => {
  it('sphere: watertight, outward oriented, volume within 5 %', () => {
    const g = 32;
    const R = 10;
    const vs = 0.5;
    const mesh = extractIsosurface(sphereField(g, R), g, { voxelSize: vs });
    const s = meshStats(mesh);
    expect(s.isWatertight).toBe(true);
    expect(s.volumeMm3).toBeGreaterThan(0);
    const exact = (4 / 3) * Math.PI * (R * vs) ** 3;
    expect(Math.abs(s.volumeMm3 / exact - 1)).toBeLessThan(0.05);
  });

  it('random noise field: still watertight and 2-manifold (robustness)', () => {
    const g = 16;
    const rng = mulberry32(42);
    for (let trial = 0; trial < 3; trial++) {
      const f = new Float32Array(g ** 3);
      for (let i = 0; i < f.length; i++) f[i] = rng();
      const s = meshStats(extractIsosurface(f, g, { voxelSize: 1 }));
      expect(s.triangles).toBeGreaterThan(100);
      expect(s.boundaryEdges).toBe(0);
      expect(s.nonManifoldEdges).toBe(0);
      expect(s.inconsistentEdges).toBe(0);
    }
  });

  it('solid touching the grid border is closed (virtual padding)', () => {
    const g = 8;
    const f = new Float32Array(g ** 3).fill(1);
    const s = meshStats(extractIsosurface(f, g, { voxelSize: 1 }));
    expect(s.isWatertight).toBe(true);
    expect(s.volumeMm3).toBeGreaterThan(0);
  });

  it('a single voxel gives a closed surface', () => {
    const g = 5;
    const f = new Float32Array(g ** 3);
    f[2 + g * (2 + g * 2)] = 1;
    const s = meshStats(extractIsosurface(f, g, { voxelSize: 1 }));
    expect(s.triangles).toBeGreaterThan(0);
    expect(s.isWatertight).toBe(true);
  });

  it('flat faces are smooth: mean normal deviation < 5° (Ticket 02 DoD 1)', () => {
    const g = 32;
    const f = new Float32Array(g ** 3);
    // box with linear ramps at its faces, so the iso-plane cuts between voxels
    const lo = 8.3, hi = 23.6;
    const ramp = (v: number) => Math.max(0, Math.min(1, Math.min(v - lo, hi - v) + 0.5));
    for (let z = 0; z < g; z++) for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) {
      f[x + g * (y + g * z)] = Math.min(ramp(x), ramp(y), ramp(z));
    }
    const mesh = extractIsosurface(f, g, { voxelSize: 1 });
    const n = triangleNormals(mesh);
    const cen = triangleCentroids(mesh);
    const c = (g - 1) / 2;
    let devSum = 0;
    let count = 0;
    for (let t = 0; t < n.length; t += 3) {
      const p = [cen[t] + c, cen[t + 1] + c, cen[t + 2] + c];
      // keep triangles on the +x face, away from edges
      if (p[0] < hi - 1.5 || Math.abs(p[1] - c) > 5 || Math.abs(p[2] - c) > 5) continue;
      devSum += (Math.acos(Math.min(1, n[t])) * 180) / Math.PI;
      count++;
    }
    expect(count).toBeGreaterThan(20);
    expect(devSum / count).toBeLessThan(5);
  });

  it('maxZ slice yields a closed mesh with a flat cap', () => {
    const g = 32;
    const mesh = extractIsosurface(sphereField(g, 10), g, { voxelSize: 1, maxZ: 15 });
    const s = meshStats(mesh);
    expect(s.isWatertight).toBe(true);
    const full = meshStats(extractIsosurface(sphereField(g, 10), g, { voxelSize: 1 }));
    expect(s.volumeMm3).toBeLessThan(full.volumeMm3 * 0.6);
    expect(s.volumeMm3).toBeGreaterThan(full.volumeMm3 * 0.4);
  });

  it('vertex normals are unit length', () => {
    const mesh = extractIsosurface(sphereField(16, 5), 16, { voxelSize: 1 });
    const vn = vertexNormals(mesh);
    for (let v = 0; v < vn.length; v += 3) {
      expect(Math.hypot(vn[v], vn[v + 1], vn[v + 2])).toBeCloseTo(1, 4);
    }
  });
});

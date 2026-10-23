/**
 * Crystal mesh + lens colouring (shared by the WebGL viewer and the exports).
 *
 * Builds the φ = 0.5 isosurface of the current crystal and samples per-vertex
 * attributes from the simulation fields (birth tick, temperature, curvature).
 * Colour lenses:
 *   ORIENT  IPF-style colour of the surface normal (single crystal, so this
 *           shows facet orientation, not an EBSD grain map)
 *   ZONING  growth bands by the tick in which a voxel solidified
 *   THERM   temperature field (latent heat), inferno-like ramp
 *   CURV    mean curvature κ, blue (concave) → white → red (convex tips)
 *   SEM     neutral grey; the viewer adds edge brightening (SEM-like look)
 */

import { KristallEngine } from './engine';
import { extractIsosurface, IndexedMesh, vertexNormals } from './isosurface';
import { PaletteEntry } from './export3mf';

export type ColorLens = 'ORIENT' | 'ZONING' | 'THERM' | 'CURV' | 'SEM';

export interface CrystalMeshData {
  mesh: IndexedMesh;
  normals: Float32Array;
  birth: Float32Array; // per vertex
  temp: Float32Array; // per vertex
  curvature: Float32Array; // per vertex, 1/voxel
  maxTick: number;
  tempRange: [number, number];
}

export function buildCrystalMesh(engine: KristallEngine, opts: { voxelSize: number; maxZ?: number }): CrystalMeshData {
  const g = engine.getConfig().gridSize;
  const phi = engine.getPhiGrid();
  const T = engine.getTempGrid();
  const B = engine.getBirthGrid();
  const mesh = extractIsosurface(phi, g, { voxelSize: opts.voxelSize, maxZ: opts.maxZ });
  const normals = vertexNormals(mesh);
  const nV = mesh.positions.length / 3;
  const birth = new Float32Array(nV);
  const temp = new Float32Array(nV);
  const curvature = new Float32Array(nV);
  const c = (g - 1) / 2;
  const vs = opts.voxelSize;
  const clamp = (v: number) => (v < 1 ? 1 : v > g - 2 ? g - 2 : v);
  let maxTick = 1;
  let tMin = Infinity;
  let tMax = -Infinity;
  for (let v = 0; v < nV; v++) {
    const px = mesh.positions[v * 3] / vs + c;
    const py = mesh.positions[v * 3 + 1] / vs + c;
    const pz = mesh.positions[v * 3 + 2] / vs + c;
    // step half a voxel inward (against the outward normal) to land in the solid
    const ix = clamp(Math.round(px - normals[v * 3] * 0.5));
    const iy = clamp(Math.round(py - normals[v * 3 + 1] * 0.5));
    const iz = clamp(Math.round(pz - normals[v * 3 + 2] * 0.5));
    const i = ix + g * (iy + g * iz);
    birth[v] = B[i];
    temp[v] = T[i];
    curvature[v] = engine.curvatureAt(ix, iy, iz);
    if (B[i] > maxTick) maxTick = B[i];
    if (T[i] < tMin) tMin = T[i];
    if (T[i] > tMax) tMax = T[i];
  }
  if (!Number.isFinite(tMin)) {
    tMin = 0;
    tMax = 1;
  }
  return { mesh, normals, birth, temp, curvature, maxTick, tempRange: [tMin, tMax] };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Inferno-like ramp, t ∈ [0, 1] → rgb ∈ [0, 1]. */
export function inferno(t: number): [number, number, number] {
  const stops: [number, number, number][] = [
    [0.0, 0.0, 0.02],
    [0.34, 0.06, 0.43],
    [0.73, 0.21, 0.33],
    [0.98, 0.55, 0.04],
    [0.99, 1.0, 0.64],
  ];
  const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const k = Math.min(stops.length - 2, Math.floor(x));
  const f = x - k;
  return [lerp(stops[k][0], stops[k + 1][0], f), lerp(stops[k][1], stops[k + 1][1], f), lerp(stops[k][2], stops[k + 1][2], f)];
}

function hsl(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

/** Per-vertex rgb (0–1) for a lens. */
export function vertexColors(d: CrystalMeshData, lens: ColorLens, bands = 7): Float32Array {
  const nV = d.mesh.positions.length / 3;
  const out = new Float32Array(nV * 3);
  for (let v = 0; v < nV; v++) {
    let rgb: [number, number, number];
    if (lens === 'ORIENT') {
      const ipf = KristallEngine.ipfColor([d.normals[v * 3], d.normals[v * 3 + 1], d.normals[v * 3 + 2]]);
      // soften toward pastel so lighting stays readable
      rgb = [0.25 + (0.75 * ipf[0]) / 255, 0.25 + (0.75 * ipf[1]) / 255, 0.25 + (0.75 * ipf[2]) / 255];
    } else if (lens === 'ZONING') {
      const band = Math.floor(((d.birth[v] || 1) / Math.max(1, d.maxTick)) * bands);
      const h = (200 + band * 47) % 360;
      rgb = hsl(h, 0.75, band % 2 ? 0.62 : 0.48);
    } else if (lens === 'THERM') {
      const [lo, hi] = d.tempRange;
      rgb = inferno(hi > lo ? (d.temp[v] - lo) / (hi - lo) : 0.5);
    } else if (lens === 'CURV') {
      const k = Math.max(-1, Math.min(1, d.curvature[v] / 0.5));
      rgb = k >= 0 ? [1, 1 - 0.8 * k, 1 - 0.85 * k] : [1 + 0.8 * k, 1 + 0.5 * k, 1];
    } else {
      rgb = [0.78, 0.78, 0.8];
    }
    out[v * 3] = rgb[0];
    out[v * 3 + 1] = rgb[1];
    out[v * 3 + 2] = rgb[2];
  }
  return out;
}

/** Per-triangle material index + palette for the coloured 3MF export. */
export function exportMaterials(d: CrystalMeshData, lens: 'ZONING' | 'ORIENT', bands = 4): { triangleMaterial: Uint8Array; palette: PaletteEntry[] } {
  const I = d.mesh.indices;
  const nT = I.length / 3;
  const mat = new Uint8Array(nT);
  if (lens === 'ZONING') {
    const palette: PaletteEntry[] = [];
    for (let b = 0; b < bands; b++) {
      const [r, g, bl] = hsl((200 + b * 47) % 360, 0.75, b % 2 ? 0.62 : 0.48);
      const hex = [r, g, bl].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
      palette.push({ name: `Wachstumszone ${b + 1}`, color: `#${hex}` });
    }
    for (let t = 0; t < nT; t++) {
      const b = (d.birth[I[t * 3]] + d.birth[I[t * 3 + 1]] + d.birth[I[t * 3 + 2]]) / 3;
      mat[t] = Math.min(bands - 1, Math.floor((Math.max(1, b) / Math.max(1, d.maxTick)) * bands));
    }
    return { triangleMaterial: mat, palette };
  }
  // ORIENT: nearest of the three cubic poles ⟨100⟩, ⟨110⟩, ⟨111⟩
  const palette: PaletteEntry[] = [
    { name: '⟨100⟩', color: '#e8504a' },
    { name: '⟨110⟩', color: '#4ac26b' },
    { name: '⟨111⟩', color: '#4a7be8' },
  ];
  const poles = [
    [0, 0, 1],
    [0, Math.SQRT1_2, Math.SQRT1_2],
    [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)],
  ];
  for (let t = 0; t < nT; t++) {
    let nx = 0, ny = 0, nz = 0;
    for (let k = 0; k < 3; k++) {
      const v = I[t * 3 + k] * 3;
      nx += d.normals[v];
      ny += d.normals[v + 1];
      nz += d.normals[v + 2];
    }
    const a = [Math.abs(nx), Math.abs(ny), Math.abs(nz)].sort((p, q) => p - q);
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    let best = 0;
    let bestDot = -1;
    poles.forEach((p, k) => {
      const dot = (a[0] * p[0] + a[1] * p[1] + a[2] * p[2]) / l;
      if (dot > bestDot) {
        bestDot = dot;
        best = k;
      }
    });
    mat[t] = best;
  }
  return { triangleMaterial: mat, palette };
}

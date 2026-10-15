/**
 * Isosurface extraction for Kristallwachstum 3D (Ticket 02, Task 1).
 *
 * Algorithm: marching tetrahedra, a lookup-table variant of marching cubes.
 * Each grid cube is split into the six Freudenthal tetrahedra that share the
 * main diagonal (corner 0 → corner 7). The split is translation invariant, so
 * neighbouring cubes cut their shared face along the same diagonal and the
 * surface has no cracks. Unlike the classic 15-case marching cubes table, a
 * tetrahedron has no ambiguous configurations, so the output is watertight and
 * 2-manifold by construction (verified in isosurface.test.ts, including on
 * random noise). Trade-off: roughly twice as many triangles.
 *
 * Vertices are welded per grid edge, so the output is an indexed mesh.
 * Values outside the grid count as 0 (virtual padding), so the surface is
 * closed even where solid touches the border.
 */

export interface IndexedMesh {
  /** xyz per vertex, millimetres, centred on the grid centre */
  positions: Float32Array;
  /** three vertex indices per triangle, counter-clockwise seen from outside */
  indices: Uint32Array;
}

export interface IsosurfaceOptions {
  iso?: number;
  voxelSize: number;
  /** cells with z > maxZ are treated as outside (cross-section with flat cap) */
  maxZ?: number;
}

// Freudenthal decomposition; corner bit layout: x = 1, y = 2, z = 4.
const TETS: [number, number, number, number][] = [
  [0, 1, 3, 7],
  [0, 1, 5, 7],
  [0, 2, 3, 7],
  [0, 2, 6, 7],
  [0, 4, 5, 7],
  [0, 4, 6, 7],
];

export function extractIsosurface(field: Float32Array, g: number, opts: IsosurfaceOptions): IndexedMesh {
  const iso = opts.iso ?? 0.5;
  const vs = opts.voxelSize;
  const maxZ = opts.maxZ ?? g - 1;
  const c = (g - 1) / 2;
  // padded lattice: coordinates -1 … g, size P per axis
  const P = g + 2;
  const NP = P * P * P;

  const value = (x: number, y: number, z: number): number => {
    if (x < 0 || y < 0 || z < 0 || x >= g || y >= g || z >= g || z > maxZ) return 0;
    return field[x + g * (y + g * z)];
  };
  const pid = (x: number, y: number, z: number) => x + 1 + P * (y + 1 + P * (z + 1));

  const positions: number[] = [];
  const indices: number[] = [];
  const edgeVert = new Map<number, number>();

  const cx = new Int32Array(8);
  const cy = new Int32Array(8);
  const cz = new Int32Array(8);
  const cv = new Float64Array(8);

  const vertexOn = (a: number, b: number): number => {
    const ia = pid(cx[a], cy[a], cz[a]);
    const ib = pid(cx[b], cy[b], cz[b]);
    const key = ia < ib ? ia * NP + ib : ib * NP + ia;
    const hit = edgeVert.get(key);
    if (hit !== undefined) return hit;
    // interpolate from the lower-id endpoint so welding is exact
    const [p, q] = ia < ib ? [a, b] : [b, a];
    let t = (iso - cv[p]) / (cv[q] - cv[p]);
    if (!(t > 1e-4)) t = 1e-4;
    if (t > 1 - 1e-4) t = 1 - 1e-4;
    const x = cx[p] + t * (cx[q] - cx[p]);
    const y = cy[p] + t * (cy[q] - cy[p]);
    const z = cz[p] + t * (cz[q] - cz[p]);
    const id = positions.length / 3;
    positions.push((x - c) * vs, (y - c) * vs, (z - c) * vs);
    edgeVert.set(key, id);
    return id;
  };

  const emit = (a: number, b: number, d: number, inA: number[], outB: number[]) => {
    // orient so the normal points from inside corners to outside corners
    const pa = a * 3, pb = b * 3, pd = d * 3;
    const ux = positions[pb] - positions[pa], uy = positions[pb + 1] - positions[pa + 1], uz = positions[pb + 2] - positions[pa + 2];
    const wx = positions[pd] - positions[pa], wy = positions[pd + 1] - positions[pa + 1], wz = positions[pd + 2] - positions[pa + 2];
    const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    let dx = 0, dy = 0, dz = 0;
    for (const k of outB) { dx += cx[k]; dy += cy[k]; dz += cz[k]; }
    dx /= outB.length; dy /= outB.length; dz /= outB.length;
    let ix = 0, iy = 0, iz = 0;
    for (const k of inA) { ix += cx[k]; iy += cy[k]; iz += cz[k]; }
    ix /= inA.length; iy /= inA.length; iz /= inA.length;
    if (nx * (dx - ix) + ny * (dy - iy) + nz * (dz - iz) >= 0) indices.push(a, b, d);
    else indices.push(a, d, b);
  };

  for (let z = -1; z < g; z++) {
    for (let y = -1; y < g; y++) {
      for (let x = -1; x < g; x++) {
        let nIn = 0;
        for (let k = 0; k < 8; k++) {
          const X = x + (k & 1), Y = y + ((k >> 1) & 1), Z = z + ((k >> 2) & 1);
          cx[k] = X; cy[k] = Y; cz[k] = Z;
          cv[k] = value(X, Y, Z);
          if (cv[k] > iso) nIn++;
        }
        if (nIn === 0 || nIn === 8) continue;
        for (const tet of TETS) {
          const inside: number[] = [];
          const outside: number[] = [];
          for (const k of tet) (cv[k] > iso ? inside : outside).push(k);
          if (inside.length === 0 || inside.length === 4) continue;
          if (inside.length === 1 || inside.length === 3) {
            const lone = inside.length === 1 ? inside[0] : outside[0];
            const others = inside.length === 1 ? outside : inside;
            const v0 = vertexOn(lone, others[0]);
            const v1 = vertexOn(lone, others[1]);
            const v2 = vertexOn(lone, others[2]);
            emit(v0, v1, v2, inside, outside);
          } else {
            const [a, b] = inside;
            const [cc, d] = outside;
            const ac = vertexOn(a, cc), ad = vertexOn(a, d), bd = vertexOn(b, d), bc = vertexOn(b, cc);
            emit(ac, ad, bd, inside, outside);
            emit(ac, bd, bc, inside, outside);
          }
        }
      }
    }
  }
  return { positions: new Float32Array(positions), indices: new Uint32Array(indices) };
}

export interface MeshStats {
  triangles: number;
  vertices: number;
  boundaryEdges: number;
  nonManifoldEdges: number;
  inconsistentEdges: number;
  isWatertight: boolean;
  volumeMm3: number;
  surfaceAreaMm2: number;
}

/** Watertight = every undirected edge in exactly two triangles, each direction once. */
export function meshStats(mesh: IndexedMesh): MeshStats {
  const { positions: P, indices: I } = mesh;
  const V = P.length / 3;
  const undirected = new Map<number, number>();
  const directed = new Map<number, number>();
  let vol = 0;
  let area = 0;
  for (let t = 0; t < I.length; t += 3) {
    const v = [I[t], I[t + 1], I[t + 2]];
    for (let k = 0; k < 3; k++) {
      const a = v[k], b = v[(k + 1) % 3];
      const u = a < b ? a * V + b : b * V + a;
      undirected.set(u, (undirected.get(u) ?? 0) + 1);
      const d = a * V + b;
      directed.set(d, (directed.get(d) ?? 0) + 1);
    }
    const [a, b, c] = v.map((i) => [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]]);
    vol += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
    area += Math.hypot(uy * wz - uz * wy, uz * wx - ux * wz, ux * wy - uy * wx) / 2;
  }
  let boundary = 0, nonManifold = 0, inconsistent = 0;
  for (const n of undirected.values()) {
    if (n === 1) boundary++;
    else if (n > 2) nonManifold++;
  }
  for (const n of directed.values()) if (n > 1) inconsistent++;
  return {
    triangles: I.length / 3,
    vertices: V,
    boundaryEdges: boundary,
    nonManifoldEdges: nonManifold,
    inconsistentEdges: inconsistent,
    isWatertight: boundary === 0 && nonManifold === 0 && inconsistent === 0,
    volumeMm3: vol,
    surfaceAreaMm2: area,
  };
}

export function triangleNormals(mesh: IndexedMesh): Float32Array {
  const { positions: P, indices: I } = mesh;
  const out = new Float32Array(I.length);
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
    const wx = P[c] - P[a], wy = P[c + 1] - P[a + 1], wz = P[c + 2] - P[a + 2];
    let nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    out[t] = nx; out[t + 1] = ny; out[t + 2] = nz;
  }
  return out;
}

export function triangleCentroids(mesh: IndexedMesh): Float32Array {
  const { positions: P, indices: I } = mesh;
  const out = new Float32Array(I.length);
  for (let t = 0; t < I.length; t += 3) {
    for (let k = 0; k < 3; k++) {
      out[t + k] = (P[I[t] * 3 + k] + P[I[t + 1] * 3 + k] + P[I[t + 2] * 3 + k]) / 3;
    }
  }
  return out;
}

/** Smooth per-vertex normals (area-weighted), for shading in the viewer. */
export function vertexNormals(mesh: IndexedMesh): Float32Array {
  const { positions: P, indices: I } = mesh;
  const out = new Float32Array(P.length);
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
    const wx = P[c] - P[a], wy = P[c + 1] - P[a + 1], wz = P[c + 2] - P[a + 2];
    const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    for (const v of [a, b, c]) { out[v] += nx; out[v + 1] += ny; out[v + 2] += nz; }
  }
  for (let v = 0; v < out.length; v += 3) {
    const l = Math.hypot(out[v], out[v + 1], out[v + 2]) || 1;
    out[v] /= l; out[v + 1] /= l; out[v + 2] /= l;
  }
  return out;
}

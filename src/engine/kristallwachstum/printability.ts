/**
 * Printability check (Ticket 02, Task 4).
 *
 * Overhang: a downward-facing triangle counts as overhang when its surface is
 * tilted more than `maxOverhangDeg` away from vertical, i.e. when the angle
 * between its normal and straight down (−Z) is smaller than 90° − maxOverhang.
 * Vertical walls (0°) are fine, flat ceilings (90°) are overhangs. Triangles
 * resting on the build plate (lowest Z) are excluded.
 *
 * Feature size: the honest bound is the grid resolution (one voxel edge).
 * This is not a medial-axis wall-thickness analysis.
 */

import { IndexedMesh, triangleNormals } from './isosurface';

export interface PrintabilityReport {
  overhangAreaFraction: number;
  overhangTriangles: number;
  smallestFeatureMm: number;
  belowNozzle: boolean;
  warningsDe: string[];
  warningsEn: string[];
}

export function analyzePrintability(
  mesh: IndexedMesh,
  opts: { maxOverhangDeg?: number; nozzleMm?: number; voxelSize: number }
): PrintabilityReport {
  const maxOverhang = opts.maxOverhangDeg ?? 45;
  const nozzle = opts.nozzleMm ?? 0.4;
  const { positions: P, indices: I } = mesh;
  const n = triangleNormals(mesh);
  let zMin = Infinity;
  for (let v = 2; v < P.length; v += 3) zMin = Math.min(zMin, P[v]);
  const bedTol = 1e-3 * opts.voxelSize + 1e-6;
  // overhang if angle(normal, −Z) < 90° − maxOverhang  ⇔  −n.z > cos(90° − maxOverhang) = sin(maxOverhang)
  const limit = Math.sin((maxOverhang * Math.PI) / 180);
  let total = 0;
  let over = 0;
  let overCount = 0;
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
    const wx = P[c] - P[a], wy = P[c + 1] - P[a + 1], wz = P[c + 2] - P[a + 2];
    const area = Math.hypot(uy * wz - uz * wy, uz * wx - ux * wz, ux * wy - uy * wx) / 2;
    total += area;
    const onBed = Math.max(P[a + 2], P[b + 2], P[c + 2]) <= zMin + bedTol;
    if (!onBed && -n[t + 2] > limit) {
      over += area;
      overCount++;
    }
  }
  const frac = total > 0 ? over / total : 0;
  const smallest = opts.voxelSize;
  const below = smallest < nozzle;
  const warningsDe: string[] = [];
  const warningsEn: string[] = [];
  if (frac > 0.05) {
    warningsDe.push(`${(frac * 100).toFixed(0)} % der Oberfläche hängen über (> ${maxOverhang}°): Stützstrukturen nötig oder kopfüber/flüssigharz drucken.`);
    warningsEn.push(`${(frac * 100).toFixed(0)} % of the surface overhangs (> ${maxOverhang}°): needs supports or resin printing.`);
  }
  if (below) {
    warningsDe.push(`Gitterauflösung ${smallest} mm liegt unter der Düse (${nozzle} mm): feine Äste verschwinden beim FDM-Druck. Voxelgröße erhöhen.`);
    warningsEn.push(`Grid resolution ${smallest} mm is below the nozzle (${nozzle} mm): fine branches will be lost in FDM. Increase the voxel size.`);
  }
  return { overhangAreaFraction: frac, overhangTriangles: overCount, smallestFeatureMm: smallest, belowNozzle: below, warningsDe, warningsEn };
}

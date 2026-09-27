/**
 * Measurements of a dried stain, used by the acceptance tests and the
 * wet-ink lab. They turn "looks like ink" into numbers that can regress:
 *
 *   anisotropy — ratio of the stain's principal axes (1 = round). Washi must
 *                feather along its grain, copy paper must stay round.
 *   roughness  — boundary length ÷ circumference of a circle with the same
 *                area (1 = smooth disc).
 *   hairs      — share of stained cells that are thin, line-like (at most
 *                two stained 4-neighbours): fibre tendrils. Feathering on
 *                washi makes this grow; a clean edge keeps it near 0.
 *   rimRatio   — mean pigment in a ring just inside the edge ÷ mean pigment
 *                in the centre. Above 1 means edge darkening.
 */

export interface StainMetrics {
  /** Cells with deposited pigment above `threshold` */
  area: number;
  /** Pigment-weighted centroid */
  cx: number;
  cy: number;
  anisotropy: number;
  /** Orientation of the major axis in radians, (-π/2, π/2] */
  majorAngle: number;
  roughness: number;
  hairs: number;
  totalPigment: number;
}

export function measureStain(
  pigment: Float32Array,
  width: number,
  height: number,
  threshold: number = 0.01
): StainMetrics {
  let m = 0, mx = 0, my = 0, area = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = pigment[y * width + x];
      if (v <= threshold) continue;
      area++;
      m += v;
      mx += v * x;
      my += v * y;
    }
  }
  if (area === 0) {
    return { area: 0, cx: 0, cy: 0, anisotropy: 1, majorAngle: 0, roughness: 0, hairs: 0, totalPigment: 0 };
  }
  const cx = mx / m;
  const cy = my / m;

  // Shape (not ink density) decides anisotropy: unweighted second moments
  let cxx = 0, cyy = 0, cxy = 0, perimeter = 0, thin = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (pigment[i] <= threshold) continue;
      cxx += (x - cx) ** 2;
      cyy += (y - cy) ** 2;
      cxy += (x - cx) * (y - cy);
      const onEdge =
        x === 0 || y === 0 || x === width - 1 || y === height - 1 ||
        pigment[i - 1] <= threshold || pigment[i + 1] <= threshold ||
        pigment[i - width] <= threshold || pigment[i + width] <= threshold;
      if (onEdge) perimeter++;
      if (x > 0 && y > 0 && x < width - 1 && y < height - 1) {
        const n = (pigment[i - 1] > threshold ? 1 : 0) + (pigment[i + 1] > threshold ? 1 : 0) +
          (pigment[i - width] > threshold ? 1 : 0) + (pigment[i + width] > threshold ? 1 : 0);
        if (n <= 2) thin++;
      }
    }
  }
  const tr = cxx + cyy;
  const det = cxx * cyy - cxy * cxy;
  const disc = Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const l1 = tr / 2 + disc;
  const l2 = Math.max(1e-9, tr / 2 - disc);
  const majorAngle = 0.5 * Math.atan2(2 * cxy, cxx - cyy);
  const radius = Math.sqrt(area / Math.PI);

  return {
    area,
    cx,
    cy,
    anisotropy: Math.sqrt(l1 / l2),
    majorAngle,
    roughness: perimeter / (2 * Math.PI * radius),
    hairs: thin / area,
    totalPigment: m,
  };
}

/**
 * Edge darkening of a stain made by one round drop: mean pigment in the band
 * `[inner, outer] × radius` around (cx, cy) divided by the mean inside
 * `core × radius`. The radius is the drop's own footprint, not the halo.
 */
export function rimRatio(
  pigment: Float32Array,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  core: number = 0.5,
  inner: number = 0.8,
  outer: number = 1.05
): number {
  let rim = 0, rn = 0, cen = 0, cn = 0;
  const r0 = Math.max(0, Math.floor(cy - radius * outer - 1));
  const r1 = Math.min(height - 1, Math.ceil(cy + radius * outer + 1));
  const c0 = Math.max(0, Math.floor(cx - radius * outer - 1));
  const c1 = Math.min(width - 1, Math.ceil(cx + radius * outer + 1));
  for (let y = r0; y <= r1; y++) {
    for (let x = c0; x <= c1; x++) {
      const r = Math.hypot(x - cx, y - cy) / radius;
      const v = pigment[y * width + x];
      if (r < core) { cen += v; cn++; }
      else if (r >= inner && r <= outer) { rim += v; rn++; }
    }
  }
  if (cn === 0 || rn === 0 || cen === 0) return 0;
  return (rim / rn) / (cen / cn);
}

/**
 * Granulation: mean pigment on the lowest third of the paper relief divided
 * by the mean on the highest third, inside a window. Above 1 = pigment has
 * settled into the valleys.
 */
export function granulationRatio(
  pigment: Float32Array,
  heightMap: Float32Array,
  width: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): number {
  const hs: number[] = [];
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) hs.push(heightMap[y * width + x]);
  hs.sort((a, b) => a - b);
  const lo = hs[Math.floor(hs.length / 3)];
  const hi = hs[Math.floor((hs.length * 2) / 3)];
  let valley = 0, vn = 0, peak = 0, pn = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = y * width + x;
      if (heightMap[i] <= lo) { valley += pigment[i]; vn++; }
      else if (heightMap[i] >= hi) { peak += pigment[i]; pn++; }
    }
  }
  if (!vn || !pn || peak === 0) return 0;
  return (valley / vn) / (peak / pn);
}

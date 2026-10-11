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
  /** Box-counting fractal dimension D_f of the capillary contact line (1.0 = smooth Euclidean, >1.2 = capillary fingering) */
  fractalDimension: number;
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
    return { area: 0, cx: 0, cy: 0, anisotropy: 1, majorAngle: 0, roughness: 0, hairs: 0, totalPigment: 0, fractalDimension: 1.0 };
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

  const fractal = calculateFractalDimension(pigment, width, height, threshold);

  return {
    area,
    cx,
    cy,
    anisotropy: Math.sqrt(l1 / l2),
    majorAngle,
    roughness: perimeter / (2 * Math.PI * radius),
    hairs: thin / area,
    totalPigment: m,
    fractalDimension: fractal.fractalDimension,
  };
}

export interface FractalAnalysis {
  /** Box-counting fractal dimension D_f of boundary (typically 1.0 <= D_f <= 2.0) */
  fractalDimension: number;
  /** R^2 goodness-of-fit for log N(ε) vs log(1/ε) linear scaling */
  rSquared: number;
  /** Box counts for each scale ε */
  scales: Array<{ epsilon: number; count: number }>;
}

/**
 * Calculates the box-counting fractal dimension (D_f) of the capillary stain
 * contact line (boundary), grounded in invasion percolation and wetting physics
 * (Mandelbrot 1982; Family & Vicsek 1991; Buldyrev et al. 1992).
 *
 * Physical significance:
 *   - Euclidean circle / smooth droplet: D_f ≈ 1.00
 *   - Sized paper (Shu Xuan) with suppressed feathering: D_f ≈ 1.05 - 1.15
 *   - Raw unsized paper (Sheng Xuan / Washi) with capillary fingering along fibers: D_f >= 1.20
 *
 * @param pigment Float32Array grid of deposited pigment
 * @param width Grid width in cells
 * @param height Grid height in cells
 * @param threshold Density threshold defining stained cells (default 0.01)
 * @param epsilons Box sizes to probe (default [2, 4, 8, 16, 32])
 */
export function calculateFractalDimension(
  pigment: Float32Array,
  width: number,
  height: number,
  threshold: number = 0.01,
  epsilons: number[] = [2, 4, 8, 16, 32]
): FractalAnalysis {
  const edgeX: number[] = [];
  const edgeY: number[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (pigment[i] <= threshold) continue;

      const isBoundary =
        x === 0 || y === 0 || x === width - 1 || y === height - 1 ||
        pigment[i - 1] <= threshold ||
        pigment[i + 1] <= threshold ||
        pigment[i - width] <= threshold ||
        pigment[i + width] <= threshold;

      if (isBoundary) {
        edgeX.push(x);
        edgeY.push(y);
      }
    }
  }

  if (edgeX.length === 0) {
    return { fractalDimension: 1.0, rSquared: 1.0, scales: [] };
  }

  const maxDimension = Math.min(width, height);
  const validEpsilons = epsilons.filter(eps => eps >= 1 && eps <= maxDimension / 2);
  if (validEpsilons.length < 2) {
    return { fractalDimension: 1.0, rSquared: 1.0, scales: [] };
  }

  const scales: Array<{ epsilon: number; count: number }> = [];

  for (const eps of validEpsilons) {
    const nx = Math.ceil(width / eps);
    const ny = Math.ceil(height / eps);
    const occupied = new Uint8Array(nx * ny);
    let count = 0;

    for (let k = 0; k < edgeX.length; k++) {
      const bx = Math.floor(edgeX[k] / eps);
      const by = Math.floor(edgeY[k] / eps);
      const idx = by * nx + bx;
      if (occupied[idx] === 0) {
        occupied[idx] = 1;
        count++;
      }
    }

    if (count > 0) {
      scales.push({ epsilon: eps, count });
    }
  }

  if (scales.length < 2) {
    return { fractalDimension: 1.0, rSquared: 1.0, scales };
  }

  // OLS Linear Regression on: x_k = ln(1 / eps) = -ln(eps), y_k = ln(count)
  let sumX = 0, sumY = 0;
  const n = scales.length;
  const xs: number[] = [];
  const ys: number[] = [];

  for (let i = 0; i < n; i++) {
    const xVal = -Math.log(scales[i].epsilon);
    const yVal = Math.log(scales[i].count);
    xs.push(xVal);
    ys.push(yVal);
    sumX += xVal;
    sumY += yVal;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  let sxx = 0, syy = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }

  if (sxx < 1e-12) {
    return { fractalDimension: 1.0, rSquared: 1.0, scales };
  }

  const slope = sxy / sxx;
  const rSquared = syy > 1e-12 ? Math.max(0.0, Math.min(1.0, (sxy * sxy) / (sxx * syy))) : 1.0;
  const fractalDimension = Math.round(Math.max(0.5, Math.min(2.0, slope)) * 10000) / 10000;

  return { fractalDimension, rSquared, scales };
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

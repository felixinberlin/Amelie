import { WetInkSimulation } from '../../../src/engine/wet-ink/index';

export interface SVGExportOptions {
  /** Thresholds for multi-iso extraction (0 to 1) */
  thresholds?: {
    wash?: number;     // capillary feathering halo (default: 0.04)
    midtone?: number;  // body of stroke (default: 0.28)
    core?: number;     // dense core deposit (default: 0.65)
  };
  /** Base stroke color in hex (default: pigment color or #1c1a17) */
  colorHex?: string;
  /** Background paper color or 'transparent' (default: 'transparent') */
  backgroundColor?: string;
  /** Sub-pixel path simplification tolerance (default: 0.35) */
  simplifyTolerance?: number;
  /** Include XML declaration */
  xmlDeclaration?: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface Segment {
  p1: Point;
  p2: Point;
}

/**
 * High-performance Marching Squares Vectorizer for Wet Ink physical simulations.
 * Extracts multi-density iso-surfaces directly from deposited/fiber pigment arrays,
 * converting organic fluid feathering into resolution-independent SVG paths.
 */
export class WetInkSVGExporter {
  /**
   * Export a WetInkSimulation instance to a multi-layered vector SVG string.
   */
  public static export(sim: WetInkSimulation, options: SVGExportOptions = {}): string {
    const width = sim.width;
    const height = sim.height;
    const washThresh = options.thresholds?.wash ?? 0.04;
    const midThresh = options.thresholds?.midtone ?? 0.28;
    const coreThresh = options.thresholds?.core ?? 0.65;
    const tol = options.simplifyTolerance ?? 0.35;
    const baseColor = options.colorHex || sim.pigmentConfig?.colorHex || '#1e1c18';
    const bg = options.backgroundColor || 'transparent';

    // 1. Build combined pigment density grid
    const density = new Float32Array(width * height);
    const dep = sim.pigmentDeposited;
    const susp = sim.pigmentSuspended;
    const fib = sim.pigmentFiber;

    let maxVal = 0.001;
    for (let i = 0; i < density.length; i++) {
      const v = dep[i] + (susp ? susp[i] : 0) + (fib ? fib[i] : 0);
      density[i] = v;
      if (v > maxVal) maxVal = v;
    }

    // Normalize density to [0, 1] relative to peak deposit
    const normFactor = 1.0 / maxVal;
    for (let i = 0; i < density.length; i++) {
      density[i] *= normFactor;
    }

    // 2. Trace contours for 3 physical layers
    const washPaths = this.traceIsoContours(density, width, height, washThresh, tol);
    const midPaths = this.traceIsoContours(density, width, height, midThresh, tol);
    const corePaths = this.traceIsoContours(density, width, height, coreThresh, tol);

    // 3. Assemble SVG markup
    const xmlHeader = options.xmlDeclaration ? '<?xml version="1.0" encoding="UTF-8"?>\n' : '';
    const bgRect = bg !== 'transparent' ? `<rect width="${width}" height="${height}" fill="${bg}" />\n` : '';

    return `${xmlHeader}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color:${bg};">
  <defs>
    <filter id="ink-diffuse" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur stdDeviation="0.4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  ${bgRect}<!-- Layer 1: Capillary Wash / Feathering Fringe -->
  <path d="${washPaths}" fill="${baseColor}" opacity="0.22" fill-rule="evenodd" />
  <!-- Layer 2: Main Pigment Body -->
  <path d="${midPaths}" fill="${baseColor}" opacity="0.65" fill-rule="evenodd" />
  <!-- Layer 3: Dense Core Deposits -->
  <path d="${corePaths}" fill="${baseColor}" opacity="0.95" fill-rule="evenodd" />
</svg>`;
  }

  /**
   * Run Marching Squares on the 2D scalar field for a given threshold value.
   */
  private static traceIsoContours(
    data: Float32Array,
    w: number,
    h: number,
    threshold: number,
    simplifyTol: number
  ): string {
    const segments: Segment[] = [];

    // Sweep 2x2 cells
    for (let y = 0; y < h - 1; y++) {
      const rowOffset = y * w;
      const nextRowOffset = (y + 1) * w;

      for (let x = 0; x < w - 1; x++) {
        const v0 = data[rowOffset + x];         // Top-left
        const v1 = data[rowOffset + x + 1];     // Top-right
        const v2 = data[nextRowOffset + x + 1]; // Bottom-right
        const v3 = data[nextRowOffset + x];     // Bottom-left

        let caseIdx = 0;
        if (v0 >= threshold) caseIdx |= 1;
        if (v1 >= threshold) caseIdx |= 2;
        if (v2 >= threshold) caseIdx |= 4;
        if (v3 >= threshold) caseIdx |= 8;

        if (caseIdx === 0 || caseIdx === 15) continue;

        // Linear interpolation helper
        const lerp = (valA: number, valB: number) => {
          const diff = valB - valA;
          if (Math.abs(diff) < 1e-7) return 0.5;
          return Math.max(0, Math.min(1, (threshold - valA) / diff));
        };

        const topP: Point = { x: x + lerp(v0, v1), y: y };
        const rightP: Point = { x: x + 1, y: y + lerp(v1, v2) };
        const bottomP: Point = { x: x + lerp(v3, v2), y: y + 1 };
        const leftP: Point = { x: x, y: y + lerp(v0, v3) };

        switch (caseIdx) {
          case 1:
            segments.push({ p1: leftP, p2: topP });
            break;
          case 2:
            segments.push({ p1: topP, p2: rightP });
            break;
          case 3:
            segments.push({ p1: leftP, p2: rightP });
            break;
          case 4:
            segments.push({ p1: rightP, p2: bottomP });
            break;
          case 5: {
            // Saddle disambiguation using cell center average
            const avg = (v0 + v1 + v2 + v3) * 0.25;
            if (avg >= threshold) {
              segments.push({ p1: leftP, p2: bottomP });
              segments.push({ p1: topP, p2: rightP });
            } else {
              segments.push({ p1: leftP, p2: topP });
              segments.push({ p1: rightP, p2: bottomP });
            }
            break;
          }
          case 6:
            segments.push({ p1: topP, p2: bottomP });
            break;
          case 7:
            segments.push({ p1: leftP, p2: bottomP });
            break;
          case 8:
            segments.push({ p1: bottomP, p2: leftP });
            break;
          case 9:
            segments.push({ p1: bottomP, p2: topP });
            break;
          case 10: {
            const avg = (v0 + v1 + v2 + v3) * 0.25;
            if (avg >= threshold) {
              segments.push({ p1: bottomP, p2: rightP });
              segments.push({ p1: topP, p2: leftP });
            } else {
              segments.push({ p1: topP, p2: leftP });
              segments.push({ p1: bottomP, p2: rightP });
            }
            break;
          }
          case 11:
            segments.push({ p1: bottomP, p2: rightP });
            break;
          case 12:
            segments.push({ p1: rightP, p2: leftP });
            break;
          case 13:
            segments.push({ p1: rightP, p2: topP });
            break;
          case 14:
            segments.push({ p1: topP, p2: leftP });
            break;
        }
      }
    }

    if (segments.length === 0) return '';

    // Connect segments into closed loops / paths
    const loops = this.stitchSegments(segments);
    let pathD = '';

    for (const loop of loops) {
      if (loop.length < 3) continue;
      const simplified = this.simplifyRDP(loop, simplifyTol);
      if (simplified.length < 3) continue;

      pathD += `M ${simplified[0].x.toFixed(2)} ${simplified[0].y.toFixed(2)} `;
      for (let i = 1; i < simplified.length; i++) {
        pathD += `L ${simplified[i].x.toFixed(2)} ${simplified[i].y.toFixed(2)} `;
      }
      pathD += 'Z ';
    }

    return pathD.trim();
  }

  /**
   * Stitch loose directed segments into ordered contiguous polylines/loops.
   */
  private static stitchSegments(segments: Segment[]): Point[][] {
    const loops: Point[][] = [];
    const used = new Uint8Array(segments.length);
    const EPS = 0.05;

    // Spatial hash / bucketing by start point for O(N) lookup
    const bucket = new Map<string, number[]>();
    const key = (p: Point) => `${Math.round(p.x * 20)},${Math.round(p.y * 20)}`;

    for (let i = 0; i < segments.length; i++) {
      const k = key(segments[i].p1);
      const list = bucket.get(k);
      if (list) {
        list.push(i);
      } else {
        bucket.set(k, [i]);
      }
    }

    for (let i = 0; i < segments.length; i++) {
      if (used[i]) continue;

      const currentLoop: Point[] = [segments[i].p1, segments[i].p2];
      used[i] = 1;

      let currentEnd = segments[i].p2;
      let finding = true;

      while (finding) {
        finding = false;
        const k = key(currentEnd);
        const candidates = bucket.get(k);

        if (candidates) {
          for (const candIdx of candidates) {
            if (used[candIdx]) continue;
            const cand = segments[candIdx];
            const dx = cand.p1.x - currentEnd.x;
            const dy = cand.p1.y - currentEnd.y;
            if (dx * dx + dy * dy < EPS * EPS) {
              used[candIdx] = 1;
              currentLoop.push(cand.p2);
              currentEnd = cand.p2;
              finding = true;
              break;
            }
          }
        }
      }

      if (currentLoop.length >= 3) {
        loops.push(currentLoop);
      }
    }

    return loops;
  }

  /**
   * Ramer-Douglas-Peucker path simplification
   */
  private static simplifyRDP(points: Point[], epsilon: number): Point[] {
    if (points.length <= 2) return points;

    let dmax = 0;
    let index = 0;
    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
      const d = this.perpendicularDistance(points[i], points[0], points[end]);
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }

    if (dmax > epsilon) {
      const recResults1 = this.simplifyRDP(points.slice(0, index + 1), epsilon);
      const recResults2 = this.simplifyRDP(points.slice(index), epsilon);
      return recResults1.slice(0, recResults1.length - 1).concat(recResults2);
    } else {
      return [points[0], points[end]];
    }
  }

  private static perpendicularDistance(p: Point, p1: Point, p2: Point): number {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag < 1e-7) {
      const px = p.x - p1.x;
      const py = p.y - p1.y;
      return Math.sqrt(px * px + py * py);
    }
    const u = ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / (mag * mag);
    const clampedU = Math.max(0, Math.min(1, u));
    const closestX = p1.x + clampedU * dx;
    const closestY = p1.y + clampedU * dy;
    const distX = p.x - closestX;
    const distY = p.y - closestY;
    return Math.sqrt(distX * distX + distY * distY);
  }
}

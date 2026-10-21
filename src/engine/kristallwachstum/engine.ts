/**
 * Kristallwachstum 3D: core simulation engine (CPU reference implementation).
 *
 * Model (dimensionless, after Kobayashi 1993, "Modeling and numerical
 * simulations of dendritic crystal growth", Physica D 63, 410–423):
 *
 *   τ ∂φ/∂t = ε(n)² ∇²φ + φ(1−φ)(φ − ½ + m(T)),   m(T) = (α/π)·atan(γ (T_eq − T))
 *   ∂T/∂t   = ∇²T + K ∂φ/∂t
 *
 * φ = 1 solid, φ = 0 melt; T is the dimensionless temperature, T_eq = 1,
 * the melt starts at T0 = T_eq − ΔT (ΔT = undercooling slider).
 *
 * Honest simplifications (documented, not hidden):
 * - The anisotropic cross terms of the full Kobayashi operator
 *   ∇·(ε²∇φ) + ∂/∂x(εε'…) are dropped; we use ε(n)²∇²φ. The anisotropy
 *   therefore acts on interface mobility/width only. Growth is still faster
 *   along directions with larger ε (tested: ⟨100⟩ vs ⟨111⟩).
 * - Hexagonal symmetry is a six-fold term in the basal plane plus a reduced
 *   ε along the c-axis (plate habit). It is not a full ice-crystal model.
 * - DLA walkers are a stochastic nucleation/noise source on top of the
 *   deterministic phase field (the "hybrid"); they walk on the lattice.
 *
 * Explicit Euler; the constructor asserts the stability (CFL) bound.
 * Every random decision uses the seeded PRNG, so a seed + parameters +
 * tick count reproduce the crystal bit for bit.
 */

import { rngFromSeed } from './prng';

export interface SimulationConfig {
  gridSize: number; // voxels per edge (32 or 48)
  anisotropy: number; // δ, strength of ε(n) variation (0 … 0.1)
  undercooling: number; // ΔT = T_eq − T0 (0 … 1)
  stickiness: number; // DLA attachment probability (0 … 1)
  symmetry: 'cubic' | 'hexagonal';
  minWallThickness: number; // mm per voxel edge for export
  maxOverhang: number; // degrees, for printability analysis
  seed: string;
  walkersPerTick?: number; // default 12
  pfStepsPerTick?: number; // default 12
  /** 'insulated' (zero heat flux, default) or 'cold' (walls held at T0). */
  thermalBoundary?: 'insulated' | 'cold';
  /** Latent heat K (default 1.6, Kobayashi 1993). */
  latentHeat?: number;
}

/** Physical constants (Kobayashi 1993, Table/Fig. parameters). */
export const PHYSICS = {
  tau: 3e-4,
  epsilonBar: 0.01,
  dx: 0.03,
  dt: 1e-4,
  alpha: 0.9,
  gamma: 10,
  latentHeat: 1.6, // K
  tEq: 1,
} as const;

export interface BoxCountResult {
  dimension: number;
  r2: number;
  scales: number[]; // 1/s values (grid / box size)
  counts: number[];
  warning: string | null;
}

export interface RenderableVoxel {
  x: number;
  y: number;
  z: number;
  phi: number;
  temp: number;
  /** IPF-style colour of the surface normal (cubic standard triangle), 0–255. */
  ipf: [number, number, number];
  /** Hue derived from ipf (kept for simple HSL rendering). */
  orientHue: number;
  zoningStep: number;
  /** Mean curvature κ = ∇·n in 1/voxel (positive on convex tips). */
  curvature: number;
  normal: [number, number, number];
  isSurface: boolean;
}

export interface SimulationMetrics {
  fractalDimension: number;
  fractalR2: number;
  fractalWarning: string | null;
  solidVoxels: number;
  ticks: number;
  /** @deprecated alias of ticks, kept for older UI code */
  growthTimeSteps: number;
  meanCurvature: number;
  maxTemperature: number;
  clampEvents: number;
  radius: number;
}

export function stabilityNumbers(cfg: Pick<SimulationConfig, 'anisotropy'>) {
  const etaMax = 1 + 2 * Math.abs(cfg.anisotropy);
  const dPhi = (PHYSICS.epsilonBar * etaMax) ** 2 / PHYSICS.tau;
  const phiCfl = (PHYSICS.dt * dPhi * 6) / (PHYSICS.dx * PHYSICS.dx);
  const tCfl = (PHYSICS.dt * 6) / (PHYSICS.dx * PHYSICS.dx);
  return { phiCfl, tCfl };
}

export class KristallEngine {
  private config: SimulationConfig;
  private g: number;
  private phi: Float32Array;
  private phiNext: Float32Array;
  private temp: Float32Array;
  private tempNext: Float32Array;
  private birth: Uint16Array;
  private rng: () => number;
  private occupied = 0;
  private ticks = 0;
  private clamps = 0;
  private radius = 2;

  constructor(config: SimulationConfig) {
    this.config = { walkersPerTick: 12, pfStepsPerTick: 12, ...config };
    this.g = config.gridSize;
    const n = this.g ** 3;
    this.phi = new Float32Array(n);
    this.phiNext = new Float32Array(n);
    this.temp = new Float32Array(n);
    this.tempNext = new Float32Array(n);
    this.birth = new Uint16Array(n);
    this.rng = rngFromSeed(config.seed);
    this.assertStable();
    this.resetWithSeed(config.seed);
  }

  private assertStable(): void {
    const { phiCfl, tCfl } = stabilityNumbers(this.config);
    if (phiCfl > 1 || tCfl > 1) {
      throw new Error(`Unstable time step: phiCfl=${phiCfl.toFixed(3)}, tCfl=${tCfl.toFixed(3)} (must be ≤ 1)`);
    }
  }

  private idx(x: number, y: number, z: number): number {
    return x + this.g * (y + this.g * z);
  }

  public resetWithSeed(seedStr: string): void {
    this.config.seed = seedStr;
    this.rng = rngFromSeed(seedStr);
    const g = this.g;
    const t0 = PHYSICS.tEq - this.config.undercooling;
    this.phi.fill(0);
    this.phiNext.fill(0);
    this.temp.fill(t0);
    this.tempNext.fill(t0);
    this.birth.fill(0);
    this.ticks = 0;
    this.clamps = 0;
    this.occupied = 0;

    // Smooth spherical nucleus (radius 2.5 voxels) so it survives curvature.
    const c = (g - 1) / 2;
    const r0 = 2.5;
    for (let z = 1; z < g - 1; z++) {
      for (let y = 1; y < g - 1; y++) {
        for (let x = 1; x < g - 1; x++) {
          const d = Math.hypot(x - c, y - c, z - c);
          if (d < r0 + 2) {
            const v = 0.5 * (1 - Math.tanh((d - r0) / 0.8));
            const i = this.idx(x, y, z);
            this.phi[i] = v;
            if (v >= 0.5) {
              this.birth[i] = 1;
              this.occupied++;
            }
          }
        }
      }
    }
    this.radius = r0;
  }

  public updateConfig(partial: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...partial };
    this.assertStable();
  }

  public getConfig(): Readonly<SimulationConfig> {
    return this.config;
  }

  public getStepCount(): number {
    return this.ticks;
  }

  /** One reproducible simulation unit: DLA walkers, then phase-field steps. */
  public tick(count = 1): void {
    for (let k = 0; k < count; k++) {
      this.step(this.config.walkersPerTick ?? 12, this.config.pfStepsPerTick ?? 12);
    }
  }

  /** Low-level: `walkers` DLA walkers followed by `pfSteps` phase-field steps. Counts as one tick. */
  public step(walkers: number, pfSteps: number): void {
    this.ticks++;
    if (walkers > 0) this.stepDLA(walkers);
    for (let i = 0; i < pfSteps; i++) this.stepPhaseField();
    this.updateRadius();
  }

  // ---------------------------------------------------------------- DLA

  private stepDLA(count: number): void {
    const g = this.g;
    const c = (g - 1) / 2;
    const rInj = Math.min(c - 2, this.radius + 4);
    const rKill = Math.min(c - 1, this.radius + 9);
    const K = PHYSICS.latentHeat;
    const rng = this.rng;

    for (let p = 0; p < count; p++) {
      const u = rng() * 2 - 1;
      const th = rng() * 2 * Math.PI;
      const s = Math.sqrt(1 - u * u);
      let x = Math.round(c + rInj * s * Math.cos(th));
      let y = Math.round(c + rInj * s * Math.sin(th));
      let z = Math.round(c + rInj * u);

      for (let w = 0; w < 400; w++) {
        const dir = Math.floor(rng() * 6);
        if (dir === 0) x++;
        else if (dir === 1) x--;
        else if (dir === 2) y++;
        else if (dir === 3) y--;
        else if (dir === 4) z++;
        else z--;
        if (Math.hypot(x - c, y - c, z - c) > rKill) break;
        if (x < 2 || y < 2 || z < 2 || x > g - 3 || y > g - 3 || z > g - 3) break;
        const i = this.idx(x, y, z);
        if (this.phi[i] >= 0.5) break; // walked into solid (should not happen)
        const sx = 1;
        const sy = g;
        const sz = g * g;
        const touches =
          this.phi[i + sx] >= 0.5 || this.phi[i - sx] >= 0.5 ||
          this.phi[i + sy] >= 0.5 || this.phi[i - sy] >= 0.5 ||
          this.phi[i + sz] >= 0.5 || this.phi[i - sz] >= 0.5;
        if (touches && rng() < this.config.stickiness) {
          const before = this.phi[i];
          this.phi[i] = 1;
          this.temp[i] += K * (1 - before); // latent heat of the attached voxel
          if (this.birth[i] === 0) {
            this.birth[i] = Math.min(65535, this.ticks);
            this.occupied++;
          }
          break;
        }
      }
    }
  }

  // ---------------------------------------------------------- phase field

  private stepPhaseField(): void {
    const g = this.g;
    const { tau, epsilonBar, dx, dt, alpha, gamma, tEq } = PHYSICS;
    const latentHeat = this.config.latentHeat ?? PHYSICS.latentHeat;
    const insulated = (this.config.thermalBoundary ?? 'insulated') === 'insulated';
    const inv2 = 1 / (dx * dx);
    const delta = this.config.anisotropy;
    const cubic = this.config.symmetry === 'cubic';
    const t0 = tEq - this.config.undercooling;
    const phi = this.phi;
    const T = this.temp;
    const pN = this.phiNext;
    const tN = this.tempNext;
    const sy = g;
    const sz = g * g;
    const mScale = alpha / Math.PI;
    const tick = Math.min(65535, Math.max(1, this.ticks));

    // Boundary layer: φ = 0; T either held at T0 (cold) or mirrored (insulated, below).
    for (let z = 0; z < g; z++) {
      for (let y = 0; y < g; y++) {
        for (let x = 0; x < g; x++) {
          const i = x + sy * y + sz * z;
          if (x === 0 || y === 0 || z === 0 || x === g - 1 || y === g - 1 || z === g - 1) {
            pN[i] = 0;
            tN[i] = t0;
            continue;
          }
          const p = phi[i];
          const pxp = phi[i + 1], pxm = phi[i - 1];
          const pyp = phi[i + sy], pym = phi[i - sy];
          const pzp = phi[i + sz], pzm = phi[i - sz];
          const t = T[i];
          const lapT = (T[i + 1] + T[i - 1] + T[i + sy] + T[i - sy] + T[i + sz] + T[i - sz] - 6 * t) * inv2;

          // Exact shortcut: uniform 0 or 1 neighbourhood has dφ/dt = 0.
          if ((p === 0 || p === 1) && pxp === p && pxm === p && pyp === p && pym === p && pzp === p && pzm === p) {
            pN[i] = p;
            tN[i] = t + dt * lapT;
            continue;
          }

          const lapPhi = (pxp + pxm + pyp + pym + pzp + pzm - 6 * p) * inv2;
          const gx = pxp - pxm;
          const gy = pyp - pym;
          const gz = pzp - pzm;
          const g2 = gx * gx + gy * gy + gz * gz;
          let eta = 1;
          if (g2 > 1e-10) {
            const nx2 = (gx * gx) / g2;
            const ny2 = (gy * gy) / g2;
            const nz2 = (gz * gz) / g2;
            if (cubic) {
              eta = 1 - 3 * delta + 4 * delta * (nx2 * nx2 + ny2 * ny2 + nz2 * nz2);
            } else {
              // Re[(nx + i·ny)^6] = s³·cos 6ψ (six-fold, basal plane); slower along c.
              const nx = gx / Math.sqrt(g2);
              const ny = gy / Math.sqrt(g2);
              const x2 = nx * nx;
              const y2 = ny * ny;
              const six = x2 * x2 * x2 - 15 * x2 * x2 * y2 + 15 * x2 * y2 * y2 - y2 * y2 * y2;
              eta = 1 + delta * six - 2 * delta * nz2;
            }
          }
          const eps = epsilonBar * eta;
          const m = mScale * Math.atan(gamma * (tEq - t));
          const dphi = (dt / tau) * (eps * eps * lapPhi + p * (1 - p) * (p - 0.5 + m));
          let np = p + dphi;
          if (np < 0 || np > 1) {
            this.clamps++;
            np = np < 0 ? 0 : 1;
          }
          pN[i] = np;
          tN[i] = t + dt * lapT + latentHeat * (np - p);
          if (np >= 0.5 && p < 0.5 && this.birth[i] === 0) {
            this.birth[i] = tick;
          }
        }
      }
    }
    if (insulated) {
      // Zero-flux walls: boundary T mirrors the adjacent interior cell.
      const cl = (v: number) => (v < 1 ? 1 : v > g - 2 ? g - 2 : v);
      for (let z = 0; z < g; z++) {
        for (let y = 0; y < g; y++) {
          for (let x = 0; x < g; x++) {
            if (x === 0 || y === 0 || z === 0 || x === g - 1 || y === g - 1 || z === g - 1) {
              tN[x + sy * y + sz * z] = tN[cl(x) + sy * cl(y) + sz * cl(z)];
            }
          }
        }
      }
    }
    this.phi = pN;
    this.phiNext = phi;
    this.temp = tN;
    this.tempNext = T;
  }

  private updateRadius(): void {
    const g = this.g;
    const c = (g - 1) / 2;
    let r2 = 0;
    let n = 0;
    for (let z = 1; z < g - 1; z++) {
      for (let y = 1; y < g - 1; y++) {
        for (let x = 1; x < g - 1; x++) {
          if (this.phi[this.idx(x, y, z)] >= 0.5) {
            n++;
            const d2 = (x - c) ** 2 + (y - c) ** 2 + (z - c) ** 2;
            if (d2 > r2) r2 = d2;
          }
        }
      }
    }
    this.occupied = n;
    this.radius = Math.max(2, Math.sqrt(r2));
  }

  // ---------------------------------------------------- analysis helpers

  /** Mean curvature κ = ∇·n (n outward = −∇φ/|∇φ|) at a voxel, in 1/voxel. */
  public curvatureAt(x: number, y: number, z: number): number {
    const g = this.g;
    if (x < 1 || y < 1 || z < 1 || x > g - 2 || y > g - 2 || z > g - 2) return 0;
    const f = (a: number, b: number, c: number) => this.phi[this.idx(a, b, c)];
    const p = f(x, y, z);
    const fx = (f(x + 1, y, z) - f(x - 1, y, z)) / 2;
    const fy = (f(x, y + 1, z) - f(x, y - 1, z)) / 2;
    const fz = (f(x, y, z + 1) - f(x, y, z - 1)) / 2;
    const fxx = f(x + 1, y, z) - 2 * p + f(x - 1, y, z);
    const fyy = f(x, y + 1, z) - 2 * p + f(x, y - 1, z);
    const fzz = f(x, y, z + 1) - 2 * p + f(x, y, z - 1);
    const fxy = (f(x + 1, y + 1, z) - f(x + 1, y - 1, z) - f(x - 1, y + 1, z) + f(x - 1, y - 1, z)) / 4;
    const fxz = (f(x + 1, y, z + 1) - f(x + 1, y, z - 1) - f(x - 1, y, z + 1) + f(x - 1, y, z - 1)) / 4;
    const fyz = (f(x, y + 1, z + 1) - f(x, y + 1, z - 1) - f(x, y - 1, z + 1) + f(x, y - 1, z - 1)) / 4;
    const g2 = fx * fx + fy * fy + fz * fz;
    if (g2 < 1e-8) return 0;
    const lap = fxx + fyy + fzz;
    const hess = fx * fx * fxx + fy * fy * fyy + fz * fz * fzz + 2 * (fx * fy * fxy + fx * fz * fxz + fy * fz * fyz);
    const divGradUnit = (g2 * lap - hess) / Math.pow(g2, 1.5);
    return -divGradUnit;
  }

  /** IPF-style colour of a direction: red ⟨001⟩, green ⟨101⟩, blue ⟨111⟩ (cubic standard triangle). */
  public static ipfColor(n: [number, number, number]): [number, number, number] {
    const a = [Math.abs(n[0]), Math.abs(n[1]), Math.abs(n[2])].sort((p, q) => q - p);
    const r = a[0] - a[1];
    const gr = a[1] - a[2];
    const b = a[2] * Math.sqrt(3);
    const mx = Math.max(r, gr, b, 1e-6);
    return [Math.round((255 * r) / mx), Math.round((255 * gr) / mx), Math.round((255 * b) / mx)];
  }

  private static rgbHue([r, g, b]: [number, number, number]): number {
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    if (mx === mn) return 0;
    let h: number;
    if (mx === r) h = ((g - b) / (mx - mn)) % 6;
    else if (mx === g) h = (b - r) / (mx - mn) + 2;
    else h = (r - g) / (mx - mn) + 4;
    return (h * 60 + 360) % 360;
  }

  /** Surface voxels (and the cut face when sliced) with lens attributes. */
  public getRenderableVoxels(sliceZ?: number): RenderableVoxel[] {
    const g = this.g;
    const out: RenderableVoxel[] = [];
    const maxZ = sliceZ !== undefined ? Math.min(g - 2, sliceZ) : g - 2;
    const phi = this.phi;
    for (let z = 1; z <= maxZ; z++) {
      for (let y = 1; y < g - 1; y++) {
        for (let x = 1; x < g - 1; x++) {
          const i = this.idx(x, y, z);
          const p = phi[i];
          if (p < 0.5) continue;
          const sy = g;
          const sz = g * g;
          const surface =
            phi[i + 1] < 0.5 || phi[i - 1] < 0.5 || phi[i + sy] < 0.5 || phi[i - sy] < 0.5 ||
            phi[i + sz] < 0.5 || phi[i - sz] < 0.5;
          const cut = sliceZ !== undefined && z === maxZ;
          if (!surface && !cut) continue;
          let nx = phi[i - 1] - phi[i + 1];
          let ny = phi[i - sy] - phi[i + sy];
          let nz = phi[i - sz] - phi[i + sz];
          const len = Math.hypot(nx, ny, nz);
          if (len < 1e-6) {
            nx = 0;
            ny = 0;
            nz = 1;
          } else {
            nx /= len;
            ny /= len;
            nz /= len;
          }
          const normal: [number, number, number] = [nx, ny, nz];
          const ipf = KristallEngine.ipfColor(normal);
          out.push({
            x,
            y,
            z,
            phi: p,
            temp: this.temp[i],
            ipf,
            orientHue: KristallEngine.rgbHue(ipf),
            zoningStep: this.birth[i],
            curvature: this.curvatureAt(x, y, z),
            normal,
            isSurface: surface,
          });
        }
      }
    }
    return out;
  }

  /**
   * Box-counting dimension over box sizes 1 … g/4, least-squares fit of
   * log N(s) against log(1/s). No clamping, no fallback: if the crystal is
   * too small the result carries a warning instead of an invented number.
   */
  public computeBoxCountingDimension(threshold = 0.5): BoxCountResult {
    return boxCountingDimension(this.phi, this.g, threshold);
  }

  public getMetrics(): SimulationMetrics {
    const box = this.computeBoxCountingDimension();
    const g = this.g;
    let kSum = 0;
    let kN = 0;
    let tMax = -Infinity;
    for (let z = 1; z < g - 1; z++) {
      for (let y = 1; y < g - 1; y++) {
        for (let x = 1; x < g - 1; x++) {
          const i = this.idx(x, y, z);
          const t = this.temp[i];
          if (t > tMax) tMax = t;
          const p = this.phi[i];
          if (p > 0.1 && p < 0.9) {
            kSum += this.curvatureAt(x, y, z);
            kN++;
          }
        }
      }
    }
    return {
      fractalDimension: box.dimension,
      fractalR2: box.r2,
      fractalWarning: box.warning,
      solidVoxels: this.occupied,
      ticks: this.ticks,
      growthTimeSteps: this.ticks,
      meanCurvature: kN ? kSum / kN : 0,
      maxTemperature: tMax,
      clampEvents: this.clamps,
      radius: this.radius,
    };
  }

  public getPhiGrid(): Float32Array {
    return this.phi;
  }

  public getTempGrid(): Float32Array {
    return this.temp;
  }

  public getBirthGrid(): Uint16Array {
    return this.birth;
  }

  /** Replace φ and T (used by the GPU backend after a readback). */
  public setFields(phi: Float32Array, temp: Float32Array): void {
    this.phi.set(phi);
    this.temp.set(temp);
  }

  /**
   * Voxel ASCII STL (one cube face per exposed voxel face).
   * Note: not guaranteed 2-manifold where voxels only touch at edges.
   * Superseded by the smooth isosurface export (Ticket 02).
   */
  public generateSTL(): string {
    const g = this.g;
    const s = this.config.minWallThickness;
    const lines: string[] = [];
    const quad = (a: number[], b: number[], c: number[], d: number[], n: number[]) => {
      for (const tri of [[a, b, c], [a, c, d]]) {
        lines.push(`  facet normal ${n[0]} ${n[1]} ${n[2]}\n    outer loop`);
        for (const v of tri) lines.push(`      vertex ${v[0]} ${v[1]} ${v[2]}`);
        lines.push('    endloop\n  endfacet');
      }
    };
    const solid = (x: number, y: number, z: number) => this.phi[this.idx(x, y, z)] >= 0.5;
    for (let z = 1; z < g - 1; z++) {
      for (let y = 1; y < g - 1; y++) {
        for (let x = 1; x < g - 1; x++) {
          if (!solid(x, y, z)) continue;
          const px = (x - g / 2) * s, py = (y - g / 2) * s, pz = (z - g / 2) * s;
          const X = px + s, Y = py + s, Z = pz + s;
          if (!solid(x + 1, y, z)) quad([X, py, pz], [X, Y, pz], [X, Y, Z], [X, py, Z], [1, 0, 0]);
          if (!solid(x - 1, y, z)) quad([px, py, pz], [px, py, Z], [px, Y, Z], [px, Y, pz], [-1, 0, 0]);
          if (!solid(x, y + 1, z)) quad([px, Y, pz], [px, Y, Z], [X, Y, Z], [X, Y, pz], [0, 1, 0]);
          if (!solid(x, y - 1, z)) quad([px, py, pz], [X, py, pz], [X, py, Z], [px, py, Z], [0, -1, 0]);
          if (!solid(x, y, z + 1)) quad([px, py, Z], [X, py, Z], [X, Y, Z], [px, Y, Z], [0, 0, 1]);
          if (!solid(x, y, z - 1)) quad([px, py, pz], [px, Y, pz], [X, Y, pz], [X, py, pz], [0, 0, -1]);
        }
      }
    }
    const name = `Kristallwachstum3D_${this.config.seed}`;
    return `solid ${name}\n${lines.join('\n')}${lines.length ? '\n' : ''}endsolid ${name}\n`;
  }
}

/** Box counting on any scalar grid (exported for tests). */
export function boxCountingDimension(field: Float32Array, g: number, threshold = 0.5): BoxCountResult {
  const scales: number[] = [];
  const counts: number[] = [];
  let solid = 0;
  for (let i = 0; i < field.length; i++) if (field[i] >= threshold) solid++;
  for (let s = 1; s <= g / 4; s *= 2) {
    let n = 0;
    for (let bz = 0; bz < g; bz += s) {
      for (let by = 0; by < g; by += s) {
        for (let bx = 0; bx < g; bx += s) {
          let hit = false;
          for (let z = bz; z < Math.min(g, bz + s) && !hit; z++) {
            for (let y = by; y < Math.min(g, by + s) && !hit; y++) {
              const row = g * (y + g * z);
              for (let x = bx; x < Math.min(g, bx + s); x++) {
                if (field[x + row] >= threshold) {
                  hit = true;
                  break;
                }
              }
            }
          }
          if (hit) n++;
        }
      }
    }
    scales.push(g / s);
    counts.push(n);
  }
  const pts = scales.map((s, k) => [Math.log(s), Math.log(Math.max(1, counts[k]))]);
  const n = pts.length;
  let warning: string | null = null;
  if (n < 3) warning = 'too few box sizes';
  if (solid < 200) warning = 'crystal too small for a fractal dimension';
  if (n < 2) return { dimension: NaN, r2: NaN, scales, counts, warning };
  const mx = pts.reduce((a, p) => a + p[0], 0) / n;
  const my = pts.reduce((a, p) => a + p[1], 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const [x, y] of pts) {
    sxy += (x - mx) * (y - my);
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
  }
  const slope = sxy / sxx;
  const r2 = syy > 0 ? (sxy * sxy) / (sxx * syy) : 1;
  return { dimension: slope, r2, scales, counts, warning };
}

import { PaperMaps } from './paper';
import { WetInkPaperConfig, WetInkPigmentConfig, WetInkSimParams, SimulationLayer } from './types';
import { KubelkaMunkLUT } from './kubelka-munk';

/**
 * CPU reference simulation of ink on paper.
 *
 * Three layers, seven pools:
 *   surface  — h (water film), u/v (velocity), p (pigment suspended in the film)
 *   fibers   — s (water wicked into cellulose), f (pigment carried in fiber water)
 *   fixed    — d (pigment bound to fibers — what stays on the page)
 *
 * Every pass moves mass between pools as an explicit flux, so the invariants
 *   waterInjected  == Σh + Σs + waterEvaporated
 *   pigmentInjected == Σp + Σf + Σd
 * hold to float precision. Tests rely on that; so should any tuning.
 *
 * Physics follows Curtis et al. 1997 (wet-area mask, edge darkening by
 * contact-line evaporation, deposition/lift-off) and Chu & Tai 2005 (MoXi:
 * capillary flow along a fiber network that only starts above a saturation
 * threshold ε_min — the reason a stain frays instead of blurring like smoke).
 */

/** Fixed simulation timestep. `advance()` sub-steps real time into this. */
export const WET_INK_DT = 1 / 60;
/** Upper bound on sub-steps per `advance()` call; a 3 s tab switch cannot explode the sim. */
export const WET_INK_MAX_SUBSTEPS = 4;

const WET_H = 1e-3;          // surface film counts as wet above this depth
const WET_S = 0.02;          // fibers count as damp above this saturation
const DRY_EPS = 1e-4;        // below this a pool is considered empty and flushed
const TILE_SHIFT = 4;        // 16×16 tiles: dry tiles are skipped by the capillary sweeps
const FACE_CFL = 0.2;        // max fraction of a cell's film that may cross one face per step

/** Tunable physical constants of the CPU reference model. */
export const WET_INK_PHYSICS = {
  pressure: 0.35,            // ∇h → acceleration
  paperSlope: 0.8,           // paper relief in the free surface (× granulation): film pools in valleys
  tilt: 0.25,                // easel tilt → acceleration
  damping: 0.82,             // per-step velocity retention on smooth paper
  roughnessDrag: 0.25,       // extra damping on paper peaks
  absorption: 0.08,          // surface → fiber soak rate per step (× capacity² × unsaturation)
  fiberVolume: 0.1,          // water a fully sized-open fiber cell holds, in film-depth units
  pigmentSieve: 0.55,        // fraction of pigment the fibers let through while soaking
  capillary: 0.5,            // max fraction of the way to equal saturation one pair moves per sweep
  capillaryIterations: 4,    // capillary sweeps per step (alternating direction)
  mobilityExponent: 3,       // fiber conductance ∝ saturation^n (0 = linear diffusion)
  kappaScale: 1.0,           // overall capillary conductance
  felt: 0.04,                // conductance of the felt between strands (strand = 1)
  chromatography: 0.95,      // pigment lags the water front in fibers (pale halo)
  depositSurface: 0.001,     // surface pigment adsorption rate
  depositFiber: 0.001,       // fiber pigment fixation rate
  liftOff: 0.004,            // deposited pigment re-suspended by standing water (backruns)
  evaporation: 0.003,        // surface film evaporation per step
  edgeEvaporation: 5.0,      // extra evaporation at the contact line (× edgeDarkening); the
                             // pressure gradient it creates pulls pigment outward — the coffee ring
  fiberEvaporation: 0.0002,  // fiber water evaporation once the film is gone
};

interface SimSnapshot {
  waterFilm: Float32Array;
  velX: Float32Array;
  velY: Float32Array;
  pigmentSuspended: Float32Array;
  fiberMoisture: Float32Array;
  pigmentFiber: Float32Array;
  pigmentDeposited: Float32Array;
  waterInjected: number;
  waterEvaporated: number;
  pigmentInjected: number;
  isActive: boolean;
  box: [number, number, number, number];
}

export interface WetInkMassReport {
  waterInjected: number;
  waterPresent: number;
  waterEvaporated: number;
  /** |injected − present − evaporated| / injected */
  waterError: number;
  pigmentInjected: number;
  pigmentPresent: number;
  /** |injected − present| / injected */
  pigmentError: number;
}

function sum(a: Float32Array): number {
  let t = 0;
  for (let i = 0; i < a.length; i++) t += a[i];
  return t;
}

export class WetInkSimulation {
  readonly width: number;
  readonly height: number;
  readonly size: number;

  // Physical layers (all Float32Array)
  waterFilm: Float32Array;       // h: surface water depth
  velX: Float32Array;            // u: surface velocity X (cells / step)
  velY: Float32Array;            // v: surface velocity Y
  pigmentSuspended: Float32Array;// p: pigment floating in the film
  fiberMoisture: Float32Array;   // s: water wicked into fibers (0..capacity)
  pigmentFiber: Float32Array;    // f: pigment travelling with fiber water
  pigmentDeposited: Float32Array;// d: pigment bound to fibers (what you see once dry)

  // Scratch buffers for flux passes
  private waterTemp: Float32Array;
  private pigmentTemp: Float32Array;
  private pigmentFiberTemp: Float32Array;
  private edgeMask: Uint8Array;
  /** Water the fibers of each cell can hold: paper sizing × fiber volume. */
  fiberCapacity: Float32Array;
  private invFiberCapacity: Float32Array;
  private condRight: Float32Array;
  private condDown: Float32Array;
  private condDownRight: Float32Array;
  private condDownLeft: Float32Array;
  // Sparse bookkeeping: which 16×16 tiles hold a capillary donor, and which to sweep
  private readonly tilesX: number;
  private tileWet: Uint8Array;
  private tileActive: Uint8Array;

  paper: PaperMaps;
  paperConfig: WetInkPaperConfig;
  pigmentConfig: WetInkPigmentConfig;
  params: WetInkSimParams;

  // Precomputed optics & substrate relief
  kmLUT: KubelkaMunkLUT;
  paperReliefR: Float32Array;
  paperReliefG: Float32Array;
  paperReliefB: Float32Array;

  // Active bounding box (only wet regions are simulated)
  minActiveX: number = 0;
  minActiveY: number = 0;
  maxActiveX: number = 0;
  maxActiveY: number = 0;
  isActive: boolean = false;

  // Mass bookkeeping
  waterInjected: number = 0;
  waterEvaporated: number = 0;
  pigmentInjected: number = 0;

  // Stats / monitoring
  totalWater: number = 0;          // surface + fiber water currently on the page
  totalDepositedPigment: number = 0;
  activeFluidCells: number = 0;
  stepCount: number = 0;

  private timeAccumulator: number = 0;

  constructor(
    width: number,
    height: number,
    paper: PaperMaps,
    paperConfig: WetInkPaperConfig,
    pigmentConfig: WetInkPigmentConfig,
    params: WetInkSimParams
  ) {
    this.width = width;
    this.height = height;
    this.size = width * height;

    this.waterFilm = new Float32Array(this.size);
    this.velX = new Float32Array(this.size);
    this.velY = new Float32Array(this.size);
    this.pigmentSuspended = new Float32Array(this.size);
    this.fiberMoisture = new Float32Array(this.size);
    this.pigmentFiber = new Float32Array(this.size);
    this.pigmentDeposited = new Float32Array(this.size);

    this.waterTemp = new Float32Array(this.size);
    this.pigmentTemp = new Float32Array(this.size);
    this.pigmentFiberTemp = new Float32Array(this.size);
    this.edgeMask = new Uint8Array(this.size);
    this.fiberCapacity = new Float32Array(this.size);
    this.invFiberCapacity = new Float32Array(this.size);
    this.condRight = new Float32Array(this.size);
    this.condDown = new Float32Array(this.size);
    this.condDownRight = new Float32Array(this.size);
    this.condDownLeft = new Float32Array(this.size);
    this.tilesX = (width >> TILE_SHIFT) + 1;
    this.tileWet = new Uint8Array(this.tilesX * ((height >> TILE_SHIFT) + 1));
    this.tileActive = new Uint8Array(this.tileWet.length);

    this.paper = paper;
    this.paperConfig = paperConfig;
    this.pigmentConfig = pigmentConfig;
    this.params = params;

    this.paperReliefR = new Float32Array(this.size);
    this.paperReliefG = new Float32Array(this.size);
    this.paperReliefB = new Float32Array(this.size);
    this.updatePaperRelief();
    this.updateFiberCapacity();

    this.kmLUT = new KubelkaMunkLUT(this.kmFor(pigmentConfig));
  }

  private kmFor(config: WetInkPigmentConfig) {
    return config.km || {
      K: [config.r > 150 ? 0.3 : 2.5, config.g > 150 ? 0.3 : 2.5, config.b > 150 ? 0.3 : 2.5] as [number, number, number],
      S: [0.3, 0.3, 0.3] as [number, number, number],
    };
  }

  private updatePaperRelief(rakingAngle: number = 2.4, rakingIntensity: number = 0.65) {
    const lx = Math.cos(rakingAngle);
    const ly = Math.sin(rakingAngle);
    const rScale = this.paperConfig.roughness * 0.5 * rakingIntensity;
    for (let i = 0; i < this.size; i++) {
      const nx = this.paper.rakingNormalsX[i];
      const ny = this.paper.rakingNormalsY[i];
      const slope = nx * lx + ny * ly;
      const relief = 1.0 + slope * rScale;
      this.paperReliefR[i] = 0.970 * relief;
      this.paperReliefG[i] = 0.955 * relief;
      this.paperReliefB[i] = 0.920 * relief;
    }
  }

  private updateFiberCapacity() {
    const vol = WET_INK_PHYSICS.fiberVolume;
    for (let i = 0; i < this.size; i++) {
      this.fiberCapacity[i] = this.paper.capacityMap[i] * vol;
      this.invFiberCapacity[i] = 1 / this.fiberCapacity[i];
    }
    this.updateConductance();
  }

  setPaper(paper: PaperMaps, config: WetInkPaperConfig) {
    this.paper = paper;
    this.paperConfig = config;
    this.updatePaperRelief();
    this.updateFiberCapacity();
  }

  setPigment(config: WetInkPigmentConfig) {
    this.pigmentConfig = config;
    this.kmLUT = new KubelkaMunkLUT(this.kmFor(config));
  }

  setParams(params: WetInkSimParams) {
    this.params = params;
  }

  clear() {
    this.pushSnapshot();
    this.waterFilm.fill(0);
    this.velX.fill(0);
    this.velY.fill(0);
    this.pigmentSuspended.fill(0);
    this.fiberMoisture.fill(0);
    this.pigmentFiber.fill(0);
    this.pigmentDeposited.fill(0);
    this.stepCount = 0;
    this.totalWater = 0;
    this.totalDepositedPigment = 0;
    this.activeFluidCells = 0;
    this.waterInjected = 0;
    this.waterEvaporated = 0;
    this.pigmentInjected = 0;
    this.timeAccumulator = 0;
    this.tileWet.fill(0);
    this.isActive = false;
    this.minActiveX = 0;
    this.minActiveY = 0;
    this.maxActiveX = 0;
    this.maxActiveY = 0;
  }

  /** Conservation check: how far the pools drift from what went in. */
  massReport(): WetInkMassReport {
    const waterPresent = sum(this.waterFilm) + sum(this.fiberMoisture);
    const pigmentPresent = sum(this.pigmentSuspended) + sum(this.pigmentFiber) + sum(this.pigmentDeposited);
    const wIn = this.waterInjected;
    const pIn = this.pigmentInjected;
    return {
      waterInjected: wIn,
      waterPresent,
      waterEvaporated: this.waterEvaporated,
      waterError: wIn > 0 ? Math.abs(wIn - waterPresent - this.waterEvaporated) / wIn : 0,
      pigmentInjected: pIn,
      pigmentPresent,
      pigmentError: pIn > 0 ? Math.abs(pIn - pigmentPresent) / pIn : 0,
    };
  }

  // ---------------------------------------------------------------------------
  // Undo / redo
  // ---------------------------------------------------------------------------

  private historyStack: SimSnapshot[] = [];
  private redoStack: SimSnapshot[] = [];

  private capture(): SimSnapshot {
    return {
      waterFilm: new Float32Array(this.waterFilm),
      velX: new Float32Array(this.velX),
      velY: new Float32Array(this.velY),
      pigmentSuspended: new Float32Array(this.pigmentSuspended),
      fiberMoisture: new Float32Array(this.fiberMoisture),
      pigmentFiber: new Float32Array(this.pigmentFiber),
      pigmentDeposited: new Float32Array(this.pigmentDeposited),
      waterInjected: this.waterInjected,
      waterEvaporated: this.waterEvaporated,
      pigmentInjected: this.pigmentInjected,
      isActive: this.isActive,
      box: [this.minActiveX, this.minActiveY, this.maxActiveX, this.maxActiveY],
    };
  }

  private restore(snap: SimSnapshot) {
    this.waterFilm.set(snap.waterFilm);
    this.velX.set(snap.velX);
    this.velY.set(snap.velY);
    this.pigmentSuspended.set(snap.pigmentSuspended);
    this.fiberMoisture.set(snap.fiberMoisture);
    this.pigmentFiber.set(snap.pigmentFiber);
    this.pigmentDeposited.set(snap.pigmentDeposited);
    this.waterInjected = snap.waterInjected;
    this.waterEvaporated = snap.waterEvaporated;
    this.pigmentInjected = snap.pigmentInjected;
    this.isActive = snap.isActive;
    [this.minActiveX, this.minActiveY, this.maxActiveX, this.maxActiveY] = snap.box;
    this.totalWater = sum(this.waterFilm) + sum(this.fiberMoisture);
    this.totalDepositedPigment = sum(this.pigmentDeposited);
    this.activeFluidCells = this.totalWater > 0 ? 1 : 0;
    this.rebuildTiles();
  }

  private rebuildTiles() {
    this.tileWet.fill(0);
    for (let i = 0; i < this.size; i++) {
      if (this.waterFilm[i] > 0 || this.fiberMoisture[i] > 0) {
        this.tileWet[((((i / this.width) | 0) >> TILE_SHIFT) * this.tilesX) + ((i % this.width) >> TILE_SHIFT)] = 1;
      }
    }
  }

  pushSnapshot() {
    if (this.historyStack.length >= 10) {
      this.historyStack.shift();
    }
    this.historyStack.push(this.capture());
    // Any new action clears the redo branch
    this.redoStack = [];
  }

  canUndo(): boolean {
    return this.historyStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  undo(): boolean {
    const snap = this.historyStack.pop();
    if (!snap) return false;
    this.redoStack.push(this.capture());
    this.restore(snap);
    return true;
  }

  redo(): boolean {
    const snap = this.redoStack.pop();
    if (!snap) return false;
    this.historyStack.push(this.capture());
    this.restore(snap);
    return true;
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------

  private growActiveBox(minX: number, minY: number, maxX: number, maxY: number) {
    const pad = 4;
    if (!this.isActive) {
      this.minActiveX = Math.max(1, minX - pad);
      this.maxActiveX = Math.min(this.width - 2, maxX + pad);
      this.minActiveY = Math.max(1, minY - pad);
      this.maxActiveY = Math.min(this.height - 2, maxY + pad);
      this.isActive = true;
    } else {
      this.minActiveX = Math.max(1, Math.min(this.minActiveX, minX - pad));
      this.maxActiveX = Math.min(this.width - 2, Math.max(this.maxActiveX, maxX + pad));
      this.minActiveY = Math.max(1, Math.min(this.minActiveY, minY - pad));
      this.maxActiveY = Math.min(this.height - 2, Math.max(this.maxActiveY, maxY + pad));
    }
  }

  /** Adds water and pigment to one cell, clamped, and books exactly what was added. */
  private deposit(idx: number, water: number, pigment: number, maxWater: number) {
    this.tileWet[((((idx / this.width) | 0) >> TILE_SHIFT) * this.tilesX) + ((idx % this.width) >> TILE_SHIFT)] = 1;
    const h0 = this.waterFilm[idx];
    const h1 = Math.min(maxWater, h0 + water);
    if (h1 > h0) {
      this.waterFilm[idx] = h1;
      this.waterInjected += h1 - h0;
    }
    const p0 = this.pigmentSuspended[idx];
    const p1 = Math.min(3.0, p0 + pigment);
    if (p1 > p0) {
      this.pigmentSuspended[idx] = p1;
      this.pigmentInjected += p1 - p0;
    }
  }

  // Pass 1: Add droplet / stamp
  injectInk(
    centerX: number,
    centerY: number,
    radius: number,
    waterAmount: number,
    pigmentAmount: number,
    dryBrushFilter: boolean = false
  ) {
    // Keep the stamp one cell away from the border: border cells are never simulated.
    const minX = Math.max(1, Math.floor(centerX - radius));
    const maxX = Math.min(this.width - 2, Math.ceil(centerX + radius));
    const minY = Math.max(1, Math.floor(centerY - radius));
    const maxY = Math.min(this.height - 2, Math.ceil(centerY + radius));
    if (minX > maxX || minY > maxY || radius <= 0) return;

    this.growActiveBox(minX, minY, maxX, maxY);
    const rSq = radius * radius;
    const density = this.pigmentConfig.density;

    for (let y = minY; y <= maxY; y++) {
      const dy = y - centerY;
      for (let x = minX; x <= maxX; x++) {
        const dx = x - centerX;
        const dSq = dx * dx + dy * dy;
        if (dSq > rSq) continue;
        const idx = y * this.width + x;
        const falloff = Math.max(0, 1 - Math.sqrt(dSq) / radius);

        // Dry brush: bristles skip over paper peaks
        if (dryBrushFilter && this.paper.heightMap[idx] > 0.62) continue;

        this.deposit(idx, waterAmount * falloff, pigmentAmount * falloff * density, 2.5);
      }
    }
  }

  // Stamped Vermilion / Hanko Seal
  injectSeal(centerX: number, centerY: number, size: number = 32) {
    const half = Math.floor(size / 2);
    const minX = Math.max(1, Math.floor(centerX - half));
    const maxX = Math.min(this.width - 2, Math.ceil(centerX + half));
    const minY = Math.max(1, Math.floor(centerY - half));
    const maxY = Math.min(this.height - 2, Math.ceil(centerY + half));
    if (minX > maxX || minY > maxY) return;

    this.growActiveBox(minX, minY, maxX, maxY);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dx = Math.abs(x - centerX);
        const dy = Math.abs(y - centerY);

        // Square border (2-3px frame)
        const isBorder = (dx >= half - 3 && dx <= half && dy <= half) || (dy >= half - 3 && dy <= half && dx <= half);
        // Stylized character lines
        const isInnerCross = (dx <= 2 && dy <= half - 6) || (dy <= 2 && dx <= half - 6);
        const isInnerDot = (dx >= 5 && dx <= 8 && dy >= 5 && dy <= 8);

        if (isBorder || isInnerCross || isInnerDot) {
          this.deposit(y * this.width + x, 0.9, 1.8, 2.2);
        }
      }
    }
  }

  // Force-dry: evaporates all water immediately and fixes all pigment in place
  forceDry() {
    for (let i = 0; i < this.size; i++) {
      this.flushCell(i);
      this.velX[i] = 0;
      this.velY[i] = 0;
    }
    this.totalWater = 0;
    this.totalDepositedPigment = sum(this.pigmentDeposited);
    this.activeFluidCells = 0;
    this.tileWet.fill(0);
    this.isActive = false;
  }

  /** Evaporates whatever water a cell holds and binds all its mobile pigment. */
  private flushCell(i: number) {
    this.waterEvaporated += this.waterFilm[i] + this.fiberMoisture[i];
    this.waterFilm[i] = 0;
    this.fiberMoisture[i] = 0;
    this.pigmentDeposited[i] += this.pigmentSuspended[i] + this.pigmentFiber[i];
    this.pigmentSuspended[i] = 0;
    this.pigmentFiber[i] = 0;
  }

  // ---------------------------------------------------------------------------
  // Time stepping
  // ---------------------------------------------------------------------------

  /**
   * Advances by wall-clock time using fixed sub-steps. Time beyond
   * WET_INK_MAX_SUBSTEPS steps is dropped, so a long pause (tab switch)
   * slows the ink down instead of destabilising it. Returns steps taken.
   */
  advance(seconds: number): number {
    if (!this.isActive) {
      this.timeAccumulator = 0;
      return 0;
    }
    this.timeAccumulator = Math.min(
      this.timeAccumulator + Math.max(0, seconds),
      WET_INK_DT * WET_INK_MAX_SUBSTEPS
    );
    let steps = 0;
    while (this.timeAccumulator >= WET_INK_DT - 1e-9 && this.isActive) {
      this.step(WET_INK_DT);
      this.timeAccumulator -= WET_INK_DT;
      steps++;
    }
    return steps;
  }

  /** One simulation step. `dt` is clamped to [0, 2/60]; rates are per 1/60 s. */
  step(dt: number = WET_INK_DT) {
    if (!this.isActive) return;
    const k = Math.max(0, Math.min(2 * WET_INK_DT, Number.isFinite(dt) ? dt : 0)) / WET_INK_DT;
    if (k === 0) return;

    this.stepCount++;
    const P = WET_INK_PHYSICS;
    const w = this.width;
    const x0 = Math.max(1, this.minActiveX);
    const x1 = Math.min(w - 2, this.maxActiveX);
    const y0 = Math.max(1, this.minActiveY);
    const y1 = Math.min(this.height - 2, this.maxActiveY);

    const h = this.waterFilm;
    const u = this.velX;
    const v = this.velY;
    const p = this.pigmentSuspended;
    const s = this.fiberMoisture;
    const f = this.pigmentFiber;
    const d = this.pigmentDeposited;
    const paperH = this.paper.heightMap;
    const cap = this.fiberCapacity;
    const net = this.paper.fiberNetwork;
    const params = this.params;
    const pigment = this.pigmentConfig;

    const isWet = (i: number) => h[i] > WET_H || s[i] > WET_S;

    // --- Pass 2: face velocities from the free-surface gradient ------------
    // Staggered (MAC) grid: u[i] lives on the face between i and i+1, v[i] on
    // the face between i and i+w. Collocated central differences would let odd
    // and even cells decouple into a checkerboard. Water only moves between
    // cells inside the wet area — the contact line is pinned.
    const gx = (params.tiltX || 0) * P.tilt;
    const gy = (params.tiltY || 0) * P.tilt;
    const lim = FACE_CFL / k;
    // Heavy, granulating pigments ride the paper relief: the film pools in the
    // valleys and leaves its pigment there when it dries.
    const slope = P.paperSlope * pigment.granulationFactor * params.granulationStrength;
    for (let y = y0 - 1; y <= y1; y++) {
      for (let x = x0 - 1; x <= x1; x++) {
        const i = y * w + x;
        // Horizontal face (i | i+1), both cells interior
        if (y >= 1 && x >= 1 && x + 1 <= w - 2 && (h[i] > WET_H || h[i + 1] > WET_H) && isWet(i) && isWet(i + 1)) {
          const drop = (h[i] + paperH[i] * slope) - (h[i + 1] + paperH[i + 1] * slope);
          const damp = Math.pow(P.damping * (1 - (paperH[i] + paperH[i + 1]) * 0.5 * P.roughnessDrag), k);
          const vx = (u[i] + (drop * P.pressure + gx) * k) * damp;
          u[i] = vx > lim ? lim : vx < -lim ? -lim : vx;
        } else {
          u[i] = 0;
        }
        // Vertical face (i | i+w)
        const j = i + w;
        if (x >= 1 && y >= 1 && y + 1 <= this.height - 2 && (h[i] > WET_H || h[j] > WET_H) && isWet(i) && isWet(j)) {
          const drop = (h[i] + paperH[i] * slope) - (h[j] + paperH[j] * slope);
          const damp = Math.pow(P.damping * (1 - (paperH[i] + paperH[j]) * 0.5 * P.roughnessDrag), k);
          const vy = (v[i] + (drop * P.pressure + gy) * k) * damp;
          v[i] = vy > lim ? lim : vy < -lim ? -lim : vy;
        } else {
          v[i] = 0;
        }
      }
    }

    // --- Pass 3/4: conservative upwind transport of film + pigment ----------
    // Each face moves mass from its upwind cell; a cell has four faces each
    // capped at FACE_CFL, so no cell can be drained below zero.
    const hN = this.waterTemp;
    const pN = this.pigmentTemp;
    for (let y = y0 - 1; y <= y1 + 1; y++) {
      const row = y * w;
      for (let x = x0 - 1; x <= x1 + 1; x++) {
        hN[row + x] = h[row + x];
        pN[row + x] = p[row + x];
      }
    }
    for (let y = y0 - 1; y <= y1; y++) {
      for (let x = x0 - 1; x <= x1; x++) {
        const i = y * w + x;
        const fu = u[i] * k;
        if (fu !== 0) {
          const src = fu > 0 ? i : i + 1;
          const dst = fu > 0 ? i + 1 : i;
          const m = h[src] * Math.abs(fu);
          if (m > 0) {
            const pm = (p[src] / h[src]) * m;
            hN[src] -= m;
            hN[dst] += m;
            pN[src] -= pm;
            pN[dst] += pm;
          }
        }
        const fv = v[i] * k;
        if (fv !== 0) {
          const src = fv > 0 ? i : i + w;
          const dst = fv > 0 ? i + w : i;
          const m = h[src] * Math.abs(fv);
          if (m > 0) {
            const pm = (p[src] / h[src]) * m;
            hN[src] -= m;
            hN[dst] += m;
            pN[src] -= pm;
            pN[dst] += pm;
          }
        }
      }
    }
    for (let y = y0 - 1; y <= y1 + 1; y++) {
      const row = y * w;
      for (let x = x0 - 1; x <= x1 + 1; x++) {
        const i = row + x;
        h[i] = hN[i] > 0 ? hN[i] : 0;
        p[i] = pN[i] > 0 ? pN[i] : 0;
      }
    }

    // --- Pass 5a: surface → fiber absorption --------------------------------
    const sieve = P.pigmentSieve * (1 - pigment.granulationFactor * 0.5);
    // Unsized paper (high capacity) drinks fast; sized paper lets the film stand.
    const absorb = P.absorption * this.paperConfig.capacity * this.paperConfig.capacity * k;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = y * w + x;
        const hi = h[i];
        const room = cap[i] - s[i];
        if (hi <= DRY_EPS || room <= 0) continue;
        // Soak rate falls as the fibers saturate
        const q = Math.min(hi, absorb * (room / cap[i]) * (0.35 + 0.65 * net[i]), room);
        const pq = (p[i] * q / hi) * sieve;
        h[i] -= q;
        s[i] += q;
        p[i] -= pq;
        f[i] += pq;
      }
    }

    // --- Pass 5b: capillary flow along fibers with threshold ε_min ----------
    const threshold = params.enableCapillaryThreshold ? params.capillaryThreshold : 0.0;
    const kappa = P.kappaScale * params.capillarySpeed * pigment.bleedSpeed * k;
    this.dilateTiles();
    for (let it = 0; it < P.capillaryIterations; it++) {
      this.capillaryPass(x0, y0, x1, y1, kappa, threshold, (it & 1) === 1);
    }

    // --- Pass 6: deposition, fixation, lift-off (granulation lives here) ---
    const depSurface = P.depositSurface * params.granulationStrength * k;
    const depFiber = P.depositFiber * k;
    const lift = P.liftOff * params.backrunStrength * k;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = y * w + x;
        if (p[i] > 0) {
          // Pigment settles into paper valleys
          const valley = 0.35 + (1 - paperH[i]) * 1.6 * pigment.granulationFactor;
          const q = Math.min(p[i], p[i] * depSurface * valley);
          p[i] -= q;
          d[i] += q;
        }
        if (f[i] > 0) {
          const q = Math.min(f[i], f[i] * depFiber);
          f[i] -= q;
          d[i] += q;
        }
        // Standing water re-suspends some bound pigment (backruns, blooms)
        if (h[i] > 0.15 && d[i] > 0) {
          const q = d[i] * lift * Math.min(1, h[i]);
          d[i] -= q;
          p[i] += q;
        }
      }
    }

    // --- Pass 7: evaporation, fastest at the contact line -------------------
    // Deegan 1997: the rim thins first, the next step's pressure gradient
    // refills it from the interior, and that flow carries pigment to the edge.
    const evap = P.evaporation * params.evaporationRate * this.paperConfig.evaporationMult * k;
    const edgeBoost = 1 + P.edgeEvaporation * params.edgeDarkeningStrength * pigment.edgeDarkening;
    const fiberEvap = P.fiberEvaporation * params.evaporationRate * this.paperConfig.evaporationMult * k;
    const edge = this.edgeMask;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = y * w + x;
        edge[i] = h[i] > WET_H && (h[i - 1] <= WET_H || h[i + 1] <= WET_H || h[i - w] <= WET_H || h[i + w] <= WET_H) ? 1 : 0;
      }
    }

    let activeCount = 0;
    let waterAcc = 0;
    let bx0 = w, by0 = this.height, bx1 = -1, by1 = -1;
    const tileWet = this.tileWet;
    const tilesX = this.tilesX;
    const donorLevel = threshold;
    tileWet.fill(0);
    for (let y = y0 - 1; y <= y1 + 1; y++) {
      for (let x = x0 - 1; x <= x1 + 1; x++) {
        const i = y * w + x;
        const inside = x >= x0 && x <= x1 && y >= y0 && y <= y1;
        if (inside) {
          if (h[i] > 0) {
            const e = Math.min(h[i], evap * (edge[i] ? edgeBoost : 1));
            h[i] -= e;
            this.waterEvaporated += e;
          } else if (s[i] > 0) {
            const e = Math.min(s[i], fiberEvap);
            s[i] -= e;
            this.waterEvaporated += e;
          }
          // Dried out: whatever pigment was mobile gets bound where it is
          if (h[i] <= DRY_EPS && h[i] > 0) {
            this.waterEvaporated += h[i];
            h[i] = 0;
          }
          if (h[i] === 0 && p[i] > 0) {
            d[i] += p[i];
            p[i] = 0;
          }
          if (s[i] <= DRY_EPS && s[i] > 0) {
            this.waterEvaporated += s[i];
            s[i] = 0;
          }
          if (s[i] === 0 && h[i] === 0 && f[i] > 0) {
            d[i] += f[i];
            f[i] = 0;
          }
        }
        const water = h[i] + s[i];
        if (water > 0) {
          waterAcc += water;
          // Only cells that can still give water away need capillary sweeps
          if (h[i] > 0 || s[i] > donorLevel * cap[i]) tileWet[(y >> TILE_SHIFT) * tilesX + (x >> TILE_SHIFT)] = 1;
          if (h[i] > WET_H) activeCount++;
          if (x < bx0) bx0 = x;
          if (x > bx1) bx1 = x;
          if (y < by0) by0 = y;
          if (y > by1) by1 = y;
        }
      }
    }

    this.activeFluidCells = activeCount;
    this.totalWater = waterAcc;

    if (bx1 < 0) {
      // Everything evaporated: flush stragglers in the ring around the box
      for (let y = y0 - 1; y <= y1 + 1; y++) {
        for (let x = x0 - 1; x <= x1 + 1; x++) {
          const i = y * w + x;
          if (p[i] > 0 || f[i] > 0) this.flushCell(i);
          u[i] = 0;
          v[i] = 0;
        }
      }
      this.isActive = false;
      this.totalWater = 0;
    } else {
      // Shrink-wrap the box around remaining water, with room to spread
      this.minActiveX = Math.max(1, bx0 - 2);
      this.maxActiveX = Math.min(w - 2, bx1 + 2);
      this.minActiveY = Math.max(1, by0 - 2);
      this.maxActiveY = Math.min(this.height - 2, by1 + 2);
    }

    // Deposited total is only needed for stats; keep it cheap.
    if (!this.isActive || (this.stepCount & 7) === 0) {
      this.totalDepositedPigment = sum(d);
    }
  }

  /**
   * Static fiber conductance (0..1) of every cell pair: fiber alignment with
   * the pair's direction × whether a strand connects both cells. Depends only
   * on the paper, so it is computed once instead of every sweep.
   */
  private updateConductance() {
    const w = this.width;
    const felt = WET_INK_PHYSICS.felt;
    const net = this.paper.fiberNetwork;
    const wH = this.paper.fiberWeightH;
    const wV = this.paper.fiberWeightV;
    const wD1 = this.paper.fiberWeightD1;
    const wD2 = this.paper.fiberWeightD2;
    const conduct = (a: number, b: number, dir: number) =>
      Math.min(1, dir * (felt + (1 - felt) * Math.min(net[a], net[b])));
    for (let y = 0; y < this.height - 1; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        this.condRight[i] = x + 1 < w ? conduct(i, i + 1, (wH[i] + wH[i + 1]) * 0.5) : 0;
        this.condDown[i] = conduct(i, i + w, (wV[i] + wV[i + w]) * 0.5);
        this.condDownRight[i] = x + 1 < w ? conduct(i, i + w + 1, (wD1[i] + wD1[i + w + 1]) * 0.35) : 0;
        this.condDownLeft[i] = x > 0 ? conduct(i, i + w - 1, (wD2[i] + wD2[i + w - 1]) * 0.35) : 0;
      }
    }
  }

  /**
   * A tile is swept if it or any neighbour tile holds a donor: surface water
   * (which feeds the fibers) or fiber water above ε_min. Water moves at most
   * one cell per sweep, so with ≤ 16 sweeps per step it cannot outrun the
   * one-tile margin before the set is rebuilt. Damp paper below the threshold
   * — most of the drying phase — costs nothing.
   */
  private dilateTiles() {
    const tx = this.tilesX;
    const ty = this.tileWet.length / tx;
    const wet = this.tileWet;
    const act = this.tileActive;
    act.fill(0);
    for (let y = 0; y < ty; y++) {
      for (let x = 0; x < tx; x++) {
        if (!wet[y * tx + x]) continue;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= ty) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            if (xx >= 0 && xx < tx) act[yy * tx + xx] = 1;
          }
        }
      }
    }
  }

  /**
   * One capillary sweep over the fiber layer (active tiles only).
   *
   * Each cell pair moves a fraction θ of the way towards equal saturation
   * (s / capacity), updating in place (Gauss–Seidel). A single pair can never
   * overshoot, so the sweep is unconditionally stable, exactly conservative
   * and needs no snapshot — and strands can conduct at full speed, which an
   * explicit diffusion step (≤ 1/16 per pair) cannot.
   *
   * Nothing leaves a donor below ε_min. Each hop along a strand roughly halves
   * saturation, so the threshold also bounds how far water cascades in one
   * sweep: the front advances along the best-connected strands and stalls in
   * the felt between them — the frayed edge, instead of a blur (MoXi).
   * Odd sweeps run backwards so the traversal order leaves no directional bias.
   */
  private capillaryPass(x0: number, y0: number, x1: number, y1: number, kappa: number, threshold: number, backwards: boolean) {
    const w = this.width;
    const s = this.fiberMoisture;
    const f = this.pigmentFiber;
    const cap = this.fiberCapacity;
    const invCap = this.invFiberCapacity;
    const T = 1 << TILE_SHIFT;
    const tilesX = this.tilesX;
    const act = this.tileActive;
    const chroma = WET_INK_PHYSICS.chromatography;
    const thetaMax = WET_INK_PHYSICS.capillary;
    const mobilityExp = WET_INK_PHYSICS.mobilityExponent;
    const minDonor = WET_S * 0.5;

    const flow = (i: number, j: number, c: number) => {
      const ri = s[i] * invCap[i];
      const rj = s[j] * invCap[j];
      let a = i, b = j, ra = ri, rb = rj;
      if (rj > ri) { a = j; b = i; ra = rj; rb = ri; }
      if (ra <= threshold || ra === rb) return;
      const sa = s[a];
      if (sa <= minDonor) return;
      // Paper conducts far better wet than damp (Richards / Washburn): upwind
      // mobility grows with the donor's saturation, which keeps the wetted
      // zone nearly full up to a sharp front instead of a long diffusive ramp.
      let mob = ra;
      for (let e = 1; e < mobilityExp; e++) mob *= ra;
      let theta = kappa * c * mob;
      if (theta > thetaMax) theta = thetaMax;
      const capA = cap[a];
      const capB = cap[b];
      // Fraction θ of the transfer that would equalise both saturations
      const q = theta * (ra - rb) * ((capA * capB) / (capA + capB));
      if (q <= 0) return;
      const fq = (f[a] / sa) * q * chroma;
      s[a] = sa - q;
      s[b] += q;
      f[a] -= fq;
      f[b] += fq;
    };

    // Pairs never touch the border ring: border cells are not simulated, so
    // water that reached them could never evaporate.
    const xMax = w - 2;
    const yMax = this.height - 2;
    const cR = this.condRight;
    const cD = this.condDown;
    const cDR = this.condDownRight;
    const cDL = this.condDownLeft;
    const lim = threshold * 0.999;
    const cell = (x: number, y: number, canDown: boolean) => {
      const i = y * w + x;
      const canRight = x + 1 <= xMax;
      // Water only leaves a donor above ε_min, so a pair with neither side
      // above it cannot flow — that is most of a damp halo.
      const di = s[i] * invCap[i] > lim;
      if (canRight && (di || s[i + 1] * invCap[i + 1] > lim)) flow(i, i + 1, cR[i]);
      if (!canDown) return;
      if (di || s[i + w] * invCap[i + w] > lim) flow(i, i + w, cD[i]);
      if (canRight && (di || s[i + w + 1] * invCap[i + w + 1] > lim)) flow(i, i + w + 1, cDR[i]);
      if (x >= x0 && x - 1 >= 1 && (di || s[i + w - 1] * invCap[i + w - 1] > lim)) flow(i, i + w - 1, cDL[i]);
    };

    const rx0 = x0 - 1, rx1 = x1 + 1, ry0 = y0 - 1, ry1 = y1 + 1;
    const tx0 = rx0 >> TILE_SHIFT, tx1 = rx1 >> TILE_SHIFT;
    const ty0 = ry0 >> TILE_SHIFT, ty1 = ry1 >> TILE_SHIFT;
    const tyStart = backwards ? ty1 : ty0, tyEnd = backwards ? ty0 - 1 : ty1 + 1, tStep = backwards ? -1 : 1;
    const txStart = backwards ? tx1 : tx0, txEnd = backwards ? tx0 - 1 : tx1 + 1;
    for (let ty = tyStart; ty !== tyEnd; ty += tStep) {
      for (let tx = txStart; tx !== txEnd; tx += tStep) {
        if (!act[ty * tilesX + tx]) continue;
        const sx0 = Math.max(1, rx0, tx * T), sx1 = Math.min(x1, tx * T + T - 1);
        const sy0 = Math.max(1, ry0, ty * T), sy1 = Math.min(y1, ty * T + T - 1);
        if (backwards) {
          for (let y = sy1; y >= sy0; y--) {
            const canDown = y + 1 <= yMax;
            for (let x = sx1; x >= sx0; x--) cell(x, y, canDown);
          }
        } else {
          for (let y = sy0; y <= sy1; y++) {
            const canDown = y + 1 <= yMax;
            for (let x = sx0; x <= sx1; x++) cell(x, y, canDown);
          }
        }
      }
    }
  }

  // Render to RGBA ImageData for Canvas display (Optimized with O(1) LUT)
  renderToImageData(
    targetData: ImageData,
    layer: SimulationLayer,
    rakingLightAngle: number = 2.4, // angle of grazing light
    rakingIntensity: number = 0.65
  ) {
    const pixels = targetData.data;
    const pr = this.pigmentConfig.r;
    const pg = this.pigmentConfig.g;
    const pb = this.pigmentConfig.b;

    // Light direction vector for raking light
    const lx = Math.cos(rakingLightAngle);
    const ly = Math.sin(rakingLightAngle);

    if (layer === 'paper') {
      for (let i = 0; i < this.size; i++) {
        const pIdx = i * 4;
        const nx = this.paper.rakingNormalsX[i];
        const ny = this.paper.rakingNormalsY[i];
        const slope = nx * lx + ny * ly;
        const shade = Math.max(0, Math.min(255, 230 + slope * 180 * rakingIntensity));
        // Fiber strands shimmer faintly through the relief
        const strand = this.paper.fiberNetwork[i] * 10;
        pixels[pIdx] = shade - strand;
        pixels[pIdx + 1] = shade * 0.98 - strand;
        pixels[pIdx + 2] = shade * 0.92 - strand;
        pixels[pIdx + 3] = 255;
      }
      return;
    }

    if (layer === 'moisture') {
      const thresh = this.params.capillaryThreshold;
      for (let i = 0; i < this.size; i++) {
        const pIdx = i * 4;
        const s = this.fiberMoisture[i];
        const water = this.waterFilm[i];
        if (s > 0.001 || water > 0.001) {
          const isThresh = s > thresh;
          pixels[pIdx] = isThresh ? 20 : 70;
          pixels[pIdx + 1] = Math.min(255, (120 + s * 135) | 0);
          pixels[pIdx + 2] = Math.min(255, (180 + water * 75) | 0);
          pixels[pIdx + 3] = 255;
        } else {
          pixels[pIdx] = 248;
          pixels[pIdx + 1] = 246;
          pixels[pIdx + 2] = 240;
          pixels[pIdx + 3] = 255;
        }
      }
      return;
    }

    if (layer === 'pigment') {
      for (let i = 0; i < this.size; i++) {
        const pIdx = i * 4;
        const total = this.pigmentDeposited[i] + this.pigmentFiber[i] + this.pigmentSuspended[i];
        if (total > 0.001) {
          const intensity = Math.min(1.0, total * 0.9);
          pixels[pIdx] = (255 - (255 - pr) * intensity) | 0;
          pixels[pIdx + 1] = (255 - (255 - pg) * intensity) | 0;
          pixels[pIdx + 2] = (255 - (255 - pb) * intensity) | 0;
          pixels[pIdx + 3] = 255;
        } else {
          pixels[pIdx] = 255;
          pixels[pIdx + 1] = 255;
          pixels[pIdx + 2] = 255;
          pixels[pIdx + 3] = 255;
        }
      }
      return;
    }

    if (layer === 'vectorField') {
      for (let i = 0; i < this.size; i++) {
        const pIdx = i * 4;
        const vx = this.velX[i];
        const vy = this.velY[i];
        const spd = Math.hypot(vx, vy);
        pixels[pIdx] = (128 + vx * 300) | 0;
        pixels[pIdx + 1] = (128 + vy * 300) | 0;
        pixels[pIdx + 2] = Math.min(255, (spd * 600) | 0);
        pixels[pIdx + 3] = 255;
      }
      return;
    }

    // --- COMPOSITE INK (O(1) Kubelka-Munk LUT + Precomputed Paper Relief) ---
    const lut = this.kmLUT;
    const lutScale = lut.scale;
    const maxIdx = lut.resolution - 1;
    const lutR = lut.tableR;
    const lutG = lut.tableG;
    const lutB = lut.tableB;
    const baseR = this.paperReliefR;
    const baseG = this.paperReliefG;
    const baseB = this.paperReliefB;
    const pigmentDeposited = this.pigmentDeposited;
    const pigmentFiber = this.pigmentFiber;
    const pigmentSuspended = this.pigmentSuspended;
    const waterFilm = this.waterFilm;

    for (let i = 0; i < this.size; i++) {
      const pIdx = i * 4;
      const bR = baseR[i];
      const bG = baseG[i];
      const bB = baseB[i];

      const totalPigment = pigmentDeposited[i] * 1.1 + pigmentFiber[i] + pigmentSuspended[i] * 0.85;

      let r = bR * 255;
      let g = bG * 255;
      let b = bB * 255;

      if (totalPigment > 0.0005) {
        const lutIdx = Math.min(maxIdx, (totalPigment * lutScale) | 0);
        // Optical modulation over paper tooth relief
        r = lutR[lutIdx] * 255 * (bR * 1.031); // 1.031 ≈ 1 / 0.970
        g = lutG[lutIdx] * 255 * (bG * 1.047); // 1.047 ≈ 1 / 0.955
        b = lutB[lutIdx] * 255 * (bB * 1.087); // 1.087 ≈ 1 / 0.920
      }

      // Wet surface specular sheen (when active surface water film is present)
      const water = waterFilm[i];
      if (water > 0.04) {
        const wetGlint = Math.min(35, water * 40);
        r += wetGlint;
        g += wetGlint;
        b += wetGlint;
      }

      pixels[pIdx] = (r + 0.5) | 0;
      pixels[pIdx + 1] = (g + 0.5) | 0;
      pixels[pIdx + 2] = (b + 0.5) | 0;
      pixels[pIdx + 3] = 255;
    }
  }
}

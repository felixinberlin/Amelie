import { PaperMaps } from './paper';
import { WetInkPaperConfig, WetInkPigmentConfig, WetInkSimParams, SimulationLayer } from './types';
import { calculateKMReflectance } from './kubelka-munk';

export class WetInkSimulation {
  readonly width: number;
  readonly height: number;
  readonly size: number;

  // Physical layers (all Float32Array)
  waterFilm: Float32Array;      // h: surface water depth (0..2+)
  waterTemp: Float32Array;      // ping-pong buffer for water
  velX: Float32Array;           // u: surface fluid velocity X
  velY: Float32Array;           // v: surface fluid velocity Y
  pigmentSuspended: Float32Array;// p: mobile pigment floating in water film
  pigmentTemp: Float32Array;    // ping-pong buffer for pigment

  fiberMoisture: Float32Array;  // s: moisture absorbed into cellulose fibers (0..1)
  fiberMoistureTemp: Float32Array;
  pigmentDeposited: Float32Array;// d: stained pigment fixed to cellulose fibers (what you see!)

  paper: PaperMaps;
  paperConfig: WetInkPaperConfig;
  pigmentConfig: WetInkPigmentConfig;
  params: WetInkSimParams;

  // Stats / Monitoring
  totalWater: number = 0;
  totalDepositedPigment: number = 0;
  activeFluidCells: number = 0;
  stepCount: number = 0;

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
    this.waterTemp = new Float32Array(this.size);
    this.velX = new Float32Array(this.size);
    this.velY = new Float32Array(this.size);
    this.pigmentSuspended = new Float32Array(this.size);
    this.pigmentTemp = new Float32Array(this.size);

    this.fiberMoisture = new Float32Array(this.size);
    this.fiberMoistureTemp = new Float32Array(this.size);
    this.pigmentDeposited = new Float32Array(this.size);

    this.paper = paper;
    this.paperConfig = paperConfig;
    this.pigmentConfig = pigmentConfig;
    this.params = params;
  }

  setPaper(paper: PaperMaps, config: WetInkPaperConfig) {
    this.paper = paper;
    this.paperConfig = config;
  }

  setPigment(config: WetInkPigmentConfig) {
    this.pigmentConfig = config;
  }

  setParams(params: WetInkSimParams) {
    this.params = params;
  }

  clear() {
    this.pushSnapshot();
    this.waterFilm.fill(0);
    this.waterTemp.fill(0);
    this.velX.fill(0);
    this.velY.fill(0);
    this.pigmentSuspended.fill(0);
    this.pigmentTemp.fill(0);
    this.fiberMoisture.fill(0);
    this.fiberMoistureTemp.fill(0);
    this.pigmentDeposited.fill(0);
    this.stepCount = 0;
    this.totalWater = 0;
    this.totalDepositedPigment = 0;
    this.activeFluidCells = 0;
  }

  // Snapshot, Undo & Redo stack
  private historyStack: Array<{
    waterFilm: Float32Array;
    velX: Float32Array;
    velY: Float32Array;
    pigmentSuspended: Float32Array;
    fiberMoisture: Float32Array;
    pigmentDeposited: Float32Array;
    totalWater: number;
    totalDepositedPigment: number;
  }> = [];

  private redoStack: Array<{
    waterFilm: Float32Array;
    velX: Float32Array;
    velY: Float32Array;
    pigmentSuspended: Float32Array;
    fiberMoisture: Float32Array;
    pigmentDeposited: Float32Array;
    totalWater: number;
    totalDepositedPigment: number;
  }> = [];

  pushSnapshot() {
    if (this.historyStack.length >= 10) {
      this.historyStack.shift();
    }
    this.historyStack.push({
      waterFilm: new Float32Array(this.waterFilm),
      velX: new Float32Array(this.velX),
      velY: new Float32Array(this.velY),
      pigmentSuspended: new Float32Array(this.pigmentSuspended),
      fiberMoisture: new Float32Array(this.fiberMoisture),
      pigmentDeposited: new Float32Array(this.pigmentDeposited),
      totalWater: this.totalWater,
      totalDepositedPigment: this.totalDepositedPigment,
    });
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

    // Save current state to redo
    this.redoStack.push({
      waterFilm: new Float32Array(this.waterFilm),
      velX: new Float32Array(this.velX),
      velY: new Float32Array(this.velY),
      pigmentSuspended: new Float32Array(this.pigmentSuspended),
      fiberMoisture: new Float32Array(this.fiberMoisture),
      pigmentDeposited: new Float32Array(this.pigmentDeposited),
      totalWater: this.totalWater,
      totalDepositedPigment: this.totalDepositedPigment,
    });

    this.waterFilm.set(snap.waterFilm);
    this.waterTemp.fill(0);
    this.velX.set(snap.velX);
    this.velY.set(snap.velY);
    this.pigmentSuspended.set(snap.pigmentSuspended);
    this.pigmentTemp.fill(0);
    this.fiberMoisture.set(snap.fiberMoisture);
    this.fiberMoistureTemp.fill(0);
    this.pigmentDeposited.set(snap.pigmentDeposited);
    this.totalWater = snap.totalWater;
    this.totalDepositedPigment = snap.totalDepositedPigment;
    this.activeFluidCells = snap.totalWater > 0 ? 1 : 0;
    return true;
  }

  redo(): boolean {
    const snap = this.redoStack.pop();
    if (!snap) return false;

    // Save current state back to undo
    this.historyStack.push({
      waterFilm: new Float32Array(this.waterFilm),
      velX: new Float32Array(this.velX),
      velY: new Float32Array(this.velY),
      pigmentSuspended: new Float32Array(this.pigmentSuspended),
      fiberMoisture: new Float32Array(this.fiberMoisture),
      pigmentDeposited: new Float32Array(this.pigmentDeposited),
      totalWater: this.totalWater,
      totalDepositedPigment: this.totalDepositedPigment,
    });

    this.waterFilm.set(snap.waterFilm);
    this.waterTemp.fill(0);
    this.velX.set(snap.velX);
    this.velY.set(snap.velY);
    this.pigmentSuspended.set(snap.pigmentSuspended);
    this.pigmentTemp.fill(0);
    this.fiberMoisture.set(snap.fiberMoisture);
    this.fiberMoistureTemp.fill(0);
    this.pigmentDeposited.set(snap.pigmentDeposited);
    this.totalWater = snap.totalWater;
    this.totalDepositedPigment = snap.totalDepositedPigment;
    this.activeFluidCells = snap.totalWater > 0 ? 1 : 0;
    return true;
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
    const minX = Math.max(0, Math.floor(centerX - radius));
    const maxX = Math.min(this.width - 1, Math.ceil(centerX + radius));
    const minY = Math.max(0, Math.floor(centerY - radius));
    const maxY = Math.min(this.height - 1, Math.ceil(centerY + radius));

    const rSq = radius * radius;

    for (let y = minY; y <= maxY; y++) {
      const dy = y - centerY;
      for (let x = minX; x <= maxX; x++) {
        const dx = x - centerX;
        const dSq = dx * dx + dy * dy;
        if (dSq <= rSq) {
          const idx = y * this.width + x;
          const dist = Math.sqrt(dSq);
          const falloff = Math.max(0, 1 - dist / radius);

          // Dry brush condition: skip peaks if dryBrushFilter is active
          if (dryBrushFilter) {
            const paperHeight = this.paper.heightMap[idx];
            // If paper peak exceeds contact threshold, brush hair skips over it
            if (paperHeight > 0.62) {
              continue;
            }
          }

          const addedWater = waterAmount * falloff;
          const addedPigment = pigmentAmount * falloff * this.pigmentConfig.density;

          this.waterFilm[idx] = Math.min(2.5, this.waterFilm[idx] + addedWater);
          this.pigmentSuspended[idx] = Math.min(3.0, this.pigmentSuspended[idx] + addedPigment);
        }
      }
    }
  }

  // Force-dry: Evaporates all water immediately and deposits suspended pigment
  forceDry() {
    for (let i = 0; i < this.size; i++) {
      if (this.pigmentSuspended[i] > 0) {
        this.pigmentDeposited[i] += this.pigmentSuspended[i];
        this.pigmentSuspended[i] = 0;
      }
      this.waterFilm[i] = 0;
      this.fiberMoisture[i] = 0;
      this.velX[i] = 0;
      this.velY[i] = 0;
    }
    this.totalWater = 0;
    this.activeFluidCells = 0;
  }

  // Stamped Vermilion / Hanko Seal with authentic ink feathering
  injectSeal(centerX: number, centerY: number, size: number = 32) {
    const half = Math.floor(size / 2);
    const minX = Math.max(0, Math.floor(centerX - half));
    const maxX = Math.min(this.width - 1, Math.ceil(centerX + half));
    const minY = Math.max(0, Math.floor(centerY - half));
    const maxY = Math.min(this.height - 1, Math.ceil(centerY + half));

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
          const idx = y * this.width + x;
          this.waterFilm[idx] = Math.min(2.2, this.waterFilm[idx] + 0.9);
          this.pigmentSuspended[idx] = Math.min(3.0, this.pigmentSuspended[idx] + 1.8);
        }
      }
    }
  }

  // Core Simulation Step (7 Passes strictly in order)
  step(dt: number = 0.016) {
    this.stepCount++;
    const w = this.width;
    const h = this.height;

    // --- Pass 2 & 3: Velocity update from water height gradient + Paper roughness drag ---
    let activeCount = 0;
    let totalWaterAcc = 0;
    let totalDepositedAcc = 0;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const water = this.waterFilm[idx];

        if (water > 0.0005) {
          activeCount++;
          totalWaterAcc += water;

          // Gradient of surface water level
          const dhx = this.waterFilm[idx + 1] - this.waterFilm[idx - 1];
          const dhy = this.waterFilm[idx + w] - this.waterFilm[idx - w];

          // Gravity tilt force (if paper is tilted on easel)
          const gravityX = (this.params.tiltX || 0) * 1.8;
          const gravityY = (this.params.tiltY || 0) * 1.8;

          // Acceleration from pressure gradient + easel tilt
          const accelX = -dhx * 2.8 + gravityX;
          const accelY = -dhy * 2.8 + gravityY;

          // Drag from paper roughness (higher roughness = more resistance)
          const roughnessDrag = 1.0 - this.paper.heightMap[idx] * 0.45;
          const damping = 0.88 * roughnessDrag;

          let vx = (this.velX[idx] + accelX * dt * 8.0) * damping;
          let vy = (this.velY[idx] + accelY * dt * 8.0) * damping;

          // CFL safety clamp: max velocity 1.5 pixels per step
          const speed = Math.hypot(vx, vy);
          if (speed > 1.5) {
            vx = (vx / speed) * 1.5;
            vy = (vy / speed) * 1.5;
          }

          this.velX[idx] = vx;
          this.velY[idx] = vy;
        } else {
          this.velX[idx] = 0;
          this.velY[idx] = 0;
        }
      }
    }

    // --- Pass 4: Advect Suspended Pigment (Semi-Lagrangian transport on velocity) ---
    this.pigmentTemp.set(this.pigmentSuspended);

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (this.waterFilm[idx] > 0.001) {
          const vx = this.velX[idx];
          const vy = this.velY[idx];

          // Backtrace point
          const srcX = Math.max(0, Math.min(w - 1.01, x - vx * 1.2));
          const srcY = Math.max(0, Math.min(h - 1.01, y - vy * 1.2));

          // Bilinear sample from pigmentTemp
          const x0 = Math.floor(srcX);
          const y0 = Math.floor(srcY);
          const x1 = x0 + 1;
          const y1 = y0 + 1;
          const fx = srcX - x0;
          const fy = srcY - y0;

          const p00 = this.pigmentTemp[y0 * w + x0];
          const p10 = this.pigmentTemp[y0 * w + x1];
          const p01 = this.pigmentTemp[y1 * w + x0];
          const p11 = this.pigmentTemp[y1 * w + x1];

          const pTop = p00 * (1 - fx) + p10 * fx;
          const pBot = p01 * (1 - fx) + p11 * fx;
          this.pigmentSuspended[idx] = pTop * (1 - fy) + pBot * fy;
        }
      }
    }

    // --- Pass 5: Capillary Flow in Paper Fibers with Threshold & Anisotropy (The Core!) ---
    // This is the make-or-break mechanism:
    // If moisture > capillaryThreshold (or if threshold disabled, > 0.001), it spreads to neighbors
    // preferentially aligned with fiberAngle!
    this.fiberMoistureTemp.set(this.fiberMoisture);

    const threshold = this.params.enableCapillaryThreshold ? this.params.capillaryThreshold : 0.001;
    const capillaryRate = this.params.capillarySpeed * this.pigmentConfig.bleedSpeed * 0.22;

    // Neighbor offsets (4-connectivity + diagonals)
    const offsets = [
      { dx: 1, dy: 0, angle: 0 },
      { dx: -1, dy: 0, angle: Math.PI },
      { dx: 0, dy: 1, angle: Math.PI * 0.5 },
      { dx: 0, dy: -1, angle: -Math.PI * 0.5 },
      { dx: 1, dy: 1, angle: Math.PI * 0.25 },
      { dx: -1, dy: 1, angle: Math.PI * 0.75 },
      { dx: 1, dy: -1, angle: -Math.PI * 0.25 },
      { dx: -1, dy: -1, angle: -Math.PI * 0.75 },
    ];

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const moisture = this.fiberMoistureTemp[idx];

        if (moisture > threshold) {
          const fiberAngle = this.paper.fiberAngleMap[idx];
          const fiberStrength = this.paper.fiberStrengthMap[idx];

          for (let i = 0; i < 8; i++) {
            const off = offsets[i];
            const nIdx = (y + off.dy) * w + (x + off.dx);
            const nCap = this.paper.capacityMap[nIdx];
            const nMoisture = this.fiberMoistureTemp[nIdx];

            if (nMoisture < moisture && nMoisture < nCap) {
              // Anisotropic conductance: angle alignment with fiber direction
              // cos^2 gives high transmission along the fiber axis, low perpendicular
              const angleDiff = off.angle - fiberAngle;
              const alignment = Math.cos(angleDiff);
              const anisotropicWeight = (1 - fiberStrength) + fiberStrength * (alignment * alignment);

              // Transfer amount
              const flow = (moisture - nMoisture) * capillaryRate * anisotropicWeight * (off.dx !== 0 && off.dy !== 0 ? 0.7 : 1.0);
              this.fiberMoisture[idx] -= flow * 0.125;
              this.fiberMoisture[nIdx] = Math.min(nCap, this.fiberMoisture[nIdx] + flow * 0.125);

              // Drag some suspended pigment into fiber capillary zone
              if (this.pigmentSuspended[idx] > 0.005) {
                const pigmentBleed = flow * 0.18 * this.pigmentSuspended[idx];
                this.pigmentSuspended[idx] -= pigmentBleed;
                this.pigmentDeposited[nIdx] += pigmentBleed;
              }
            }
          }
        }
      }
    }

    // --- Pass 6: Transfer Surface -> Fibers & Granulation Deposition ---
    const absorptionRate = 0.035 * (1.0 / Math.max(0.1, this.paperConfig.capacity));
    const depositionBase = 0.02 * this.params.granulationStrength;

    for (let i = 0; i < this.size; i++) {
      const water = this.waterFilm[i];
      const cap = this.paper.capacityMap[i];
      const moisture = this.fiberMoisture[i];

      // Surface water soaks into fibers
      if (water > 0.0001 && moisture < cap) {
        const soak = Math.min(water, (cap - moisture) * absorptionRate);
        this.waterFilm[i] -= soak;
        this.fiberMoisture[i] += soak;
      }

      // Pigment deposition onto fibers
      const susp = this.pigmentSuspended[i];
      if (susp > 0.0001) {
        // Granulation effect: pigment deposits faster in valleys (1 - heightMap)
        const valleyFactor = 0.5 + (1.0 - this.paper.heightMap[i]) * 1.5 * this.pigmentConfig.granulationFactor;
        const depAmount = Math.min(susp, susp * depositionBase * valleyFactor);

        this.pigmentSuspended[i] -= depAmount;
        this.pigmentDeposited[i] += depAmount;
      }

      totalDepositedAcc += this.pigmentDeposited[i];
    }

    // --- Pass 7: Evaporate & Edge Darkening (Coffee-Ring Effect) ---
    // Thin boundary water evaporates first. Fluid continuity pulls suspended pigment outward to the rim!
    const evapRate = this.params.evaporationRate * this.paperConfig.evaporationMult * 0.004;
    const edgeDarken = this.params.edgeDarkeningStrength * this.pigmentConfig.edgeDarkening;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const water = this.waterFilm[idx];
        const moisture = this.fiberMoisture[idx];

        if (water > 0) {
          // Check if at wet boundary (neighbor has low water)
          const nL = this.waterFilm[idx - 1];
          const nR = this.waterFilm[idx + 1];
          const nU = this.waterFilm[idx - w];
          const nD = this.waterFilm[idx + w];

          const isEdge = (nL < 0.02 || nR < 0.02 || nU < 0.02 || nD < 0.02);

          // Edge evaporates faster
          const localEvap = isEdge ? evapRate * 2.2 : evapRate;
          this.waterFilm[idx] = Math.max(0, water - localEvap);

          // Edge darkening: deposit pigment aggressively at evaporating contact line
          if (isEdge && this.pigmentSuspended[idx] > 0.01) {
            const edgeDeposit = this.pigmentSuspended[idx] * (0.05 * edgeDarken);
            this.pigmentSuspended[idx] -= edgeDeposit;
            this.pigmentDeposited[idx] += edgeDeposit * 1.4;
          }
        }

        // Fiber moisture slow evaporation
        if (moisture > 0) {
          this.fiberMoisture[idx] = Math.max(0, moisture - evapRate * 0.35);
        }
      }
    }

    // --- Pass 8: Backrun / Cauliflower dynamics ---
    // When wet pool (high water) borders a damp region (high fiberMoisture, low water),
    // capillary pressure gradient pushes outward, depositing a dark cauliflower rim
    if (this.params.backrunStrength > 0) {
      for (let y = 2; y < h - 2; y += 2) {
        for (let x = 2; x < w - 2; x += 2) {
          const idx = y * w + x;
          const water = this.waterFilm[idx];

          if (water > 0.3) {
            // Check neighbor with damp fiber but zero surface water
            const nIndices = [idx - 1, idx + 1, idx - w, idx + w];
            for (let k = 0; k < 4; k++) {
              const ni = nIndices[k];
              if (this.waterFilm[ni] < 0.05 && this.fiberMoisture[ni] > 0.15) {
                // Backrun shockwave: deposit boundary rim
                const push = 0.015 * this.params.backrunStrength;
                if (this.pigmentSuspended[idx] > push) {
                  this.pigmentSuspended[idx] -= push;
                  this.pigmentDeposited[ni] += push * 1.8;
                }
              }
            }
          }
        }
      }
    }

    this.activeFluidCells = activeCount;
    this.totalWater = totalWaterAcc;
    this.totalDepositedPigment = totalDepositedAcc;
  }

  // Render to RGBA ImageData for Canvas display
  renderToImageData(
    targetData: ImageData,
    layer: SimulationLayer,
    rakingLightAngle: number = 2.4, // angle of grazing light
    rakingIntensity: number = 0.65
  ) {
    const pixels = targetData.data;
    const w = this.width;
    const h = this.height;

    const pr = this.pigmentConfig.r;
    const pg = this.pigmentConfig.g;
    const pb = this.pigmentConfig.b;

    // Light direction vector for raking light
    const lx = Math.cos(rakingLightAngle);
    const ly = Math.sin(rakingLightAngle);

    for (let i = 0; i < this.size; i++) {
      const pIdx = i * 4;

      if (layer === 'paper') {
        // Visualize 3D Paper Relief tooth with grazing raking light
        const nx = this.paper.rakingNormalsX[i];
        const ny = this.paper.rakingNormalsY[i];
        const slope = nx * lx + ny * ly;
        const shade = Math.max(0, Math.min(255, 230 + slope * 180 * rakingIntensity));

        pixels[pIdx] = shade;
        pixels[pIdx + 1] = shade * 0.98;
        pixels[pIdx + 2] = shade * 0.92;
        pixels[pIdx + 3] = 255;
      } else if (layer === 'moisture') {
        // Visualize Fiber Saturation & Capillary Front (Cyan/Blue)
        const s = this.fiberMoisture[i];
        const water = this.waterFilm[i];
        const isThresh = s > this.params.capillaryThreshold;

        if (s > 0.001 || water > 0.001) {
          pixels[pIdx] = isThresh ? 20 : 70;
          pixels[pIdx + 1] = Math.min(255, Math.floor(120 + s * 135));
          pixels[pIdx + 2] = Math.min(255, Math.floor(180 + water * 75));
          pixels[pIdx + 3] = 255;
        } else {
          pixels[pIdx] = 248;
          pixels[pIdx + 1] = 246;
          pixels[pIdx + 2] = 240;
          pixels[pIdx + 3] = 255;
        }
      } else if (layer === 'pigment') {
        // Isolated Pigment Layer (shows Edge Darkening & Granulation purely)
        const d = this.pigmentDeposited[i];
        const p = this.pigmentSuspended[i];
        const total = d + p;

        if (total > 0.001) {
          const intensity = Math.min(1.0, total * 0.9);
          pixels[pIdx] = Math.floor(255 - (255 - pr) * intensity);
          pixels[pIdx + 1] = Math.floor(255 - (255 - pg) * intensity);
          pixels[pIdx + 2] = Math.floor(255 - (255 - pb) * intensity);
          pixels[pIdx + 3] = 255;
        } else {
          pixels[pIdx] = 255;
          pixels[pIdx + 1] = 255;
          pixels[pIdx + 2] = 255;
          pixels[pIdx + 3] = 255;
        }
      } else if (layer === 'vectorField') {
        // Fluid Velocity Vector Field (Eulerian Grid Visualization)
        const vx = this.velX[i];
        const vy = this.velY[i];
        const spd = Math.hypot(vx, vy);
        pixels[pIdx] = Math.floor(128 + vx * 80);
        pixels[pIdx + 1] = Math.floor(128 + vy * 80);
        pixels[pIdx + 2] = Math.floor(Math.min(255, spd * 160));
        pixels[pIdx + 3] = 255;
      } else {
        // --- COMPOSITE INK (The true optical result) ---
        // 1. Base paper color modulated by raking light relief
        const nx = this.paper.rakingNormalsX[i];
        const ny = this.paper.rakingNormalsY[i];
        const slope = nx * lx + ny * ly;
        const relief = 1.0 + slope * 0.5 * this.paperConfig.roughness;

        // Paper base reflectance
        const RgR = 0.970 * relief;
        const RgG = 0.955 * relief;
        const RgB = 0.920 * relief;

        // 2. Pigment absorption (Scientific Kubelka-Munk optical glaze)
        const deposited = this.pigmentDeposited[i];
        const suspended = this.pigmentSuspended[i];
        const totalPigment = deposited * 1.1 + suspended * 0.85;

        let r = RgR * 255;
        let g = RgG * 255;
        let b = RgB * 255;

        if (totalPigment > 0.0005) {
          const km = this.pigmentConfig.km || {
            K: [pr > 150 ? 0.3 : 2.5, pg > 150 ? 0.3 : 2.5, pb > 150 ? 0.3 : 2.5],
            S: [0.3, 0.3, 0.3],
          };

          const refR = calculateKMReflectance(km.K[0], km.S[0], totalPigment, RgR);
          const refG = calculateKMReflectance(km.K[1], km.S[1], totalPigment, RgG);
          const refB = calculateKMReflectance(km.K[2], km.S[2], totalPigment, RgB);

          r = refR * 255;
          g = refG * 255;
          b = refB * 255;
        }

        // 3. Wet Surface Specular Sheen (when water film is active)
        const water = this.waterFilm[i];
        if (water > 0.04) {
          const wetGlint = Math.min(35, water * 40);
          r = Math.min(255, r + wetGlint);
          g = Math.min(255, g + wetGlint);
          b = Math.min(255, b + wetGlint);
        }

        pixels[pIdx] = Math.max(0, Math.min(255, Math.floor(r)));
        pixels[pIdx + 1] = Math.max(0, Math.min(255, Math.floor(g)));
        pixels[pIdx + 2] = Math.max(0, Math.min(255, Math.floor(b)));
        pixels[pIdx + 3] = 255;
      }
    }
  }
}

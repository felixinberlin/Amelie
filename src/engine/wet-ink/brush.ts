import { WetInkSimulation } from './simulation';
import { WetInkPigmentConfig, BrushTipShape, BrushMaterial, BRUSH_MATERIAL_PRESETS } from './types';

export type BrushToolType =
  | 'fountain-pen'
  | 'sumi-brush'
  | 'wash-brush'
  | 'dropper'
  | 'water-drop'
  | 'langhao'
  | 'yanghao'
  | 'jianhao'
  | 'seal-stamp';

export interface BrushState {
  tool: BrushToolType;
  baseRadius: number;
  waterRatio: number;   // water-to-pigment balance (0.2 = dry ink, 2.0 = wet wash)
  dryBrush: boolean;    // whether skipping over paper hills is active
  tipShape?: BrushTipShape; // footprint geometry ('round', 'flat', 'slanted', 'fan', 'dagger')
  material?: BrushMaterial; // bristle fiber composition ('weasel', 'goat', 'mixed', 'horse', 'sable')
  angle?: number;       // custom brush orientation angle (radians)
}

// Ink per stamp when stamps are one radius apart (scaled down for closer spacing)
const INK_PER_RADIUS = 0.6;
// Ink a motionless pen releases per millisecond, relative to one stamp
const DWELL_PER_MS = 0.004;

export class WetInkBrushManager {
  private carry: number = 0;
  private lastX: number | null = null;
  private lastY: number | null = null;
  private lastTime: number | null = null;

  stroke(
    sim: WetInkSimulation,
    x: number,
    y: number,
    pressure: number,
    state: BrushState,
    isFirstPoint: boolean = false,
    // Event timestamp in ms. Pass the PointerEvent's timeStamp (or a recorded
    // one) so that replaying a stroke log reproduces the same speeds.
    now: number = performance.now(),
    pigmentConfig?: WetInkPigmentConfig
  ) {
    const dt = Math.max(1, now - (this.lastTime ?? now));

    let dist = 0;
    let speed = 0;

    if (!isFirstPoint && this.lastX !== null && this.lastY !== null) {
      const dx = x - this.lastX;
      const dy = y - this.lastY;
      dist = Math.hypot(dx, dy);
      speed = dist / dt; // pixels per ms
    }

    // Resolve brush material
    let matId: BrushMaterial = state.material ?? 'mixed';
    if (!state.material) {
      if (state.tool === 'langhao') matId = 'weasel';
      else if (state.tool === 'yanghao') matId = 'goat';
      else if (state.tool === 'jianhao') matId = 'mixed';
    }
    const mat = BRUSH_MATERIAL_PRESETS.find((m) => m.id === matId) ?? BRUSH_MATERIAL_PRESETS[2];

    // Dynamic radius based on tool and pressure
    let radius = state.baseRadius;
    let waterAmt = 0.5;
    let pigmentAmt = 0.8;
    let enableDryFilter = false;

    // Wash dilution concentration factor (墨分五色 - The Five Shades of Ink):
    // Concentrated/dry ink (waterRatio < 1) yields higher pigment density (up to 1.35x),
    // while dilute washes (waterRatio > 1) scale down pigment concentration so pale washes
    // render with translucent luminosity rather than thick floods.
    const conc =
      state.tool === 'water-drop'
        ? 0.0
        : state.tool === 'seal-stamp'
        ? 1.0
        : Math.min(1.35, Math.max(0.2, Math.pow(1.0 / Math.max(0.25, state.waterRatio), 0.65)));

    if (state.tool === 'fountain-pen') {
      radius = state.baseRadius * (0.7 + pressure * 0.8);
      waterAmt = 0.45 * state.waterRatio;
      pigmentAmt = 0.92 * conc;
    } else if (state.tool === 'seal-stamp') {
      // Seal stamp mode: single crisp impression with rich cinnabar paste
      radius = state.baseRadius * 1.6;
      waterAmt = 0.45;
      pigmentAmt = 1.6;
    } else if (state.tool === 'wash-brush') {
      radius = state.baseRadius * 2.2 * mat.reservoir;
      waterAmt = 1.6 * state.waterRatio * mat.flowRate;
      pigmentAmt = 0.45 * conc; // diluted wash
    } else if (state.tool === 'dropper') {
      radius = state.baseRadius * 2.8;
      waterAmt = 2.4 * state.waterRatio;
      pigmentAmt = 1.2 * conc;
    } else if (state.tool === 'water-drop') {
      // Pure clear water (0 pigment) to trigger backruns, dilution & edge lifting
      radius = state.baseRadius * 2.2;
      waterAmt = 2.2 * state.waterRatio;
      pigmentAmt = 0.0;
    } else {
      // General brush tools ('sumi-brush', 'langhao', 'yanghao', 'jianhao'):
      // Modulated by physical bristle material properties (stiffness, reservoir, flow, dry brush)
      const stiffness = mat.stiffness;
      // Soft bristles (goat) deflect more under pressure; stiff bristles (weasel/horse) stay springy and controlled
      const deflScale = 1.45 - stiffness * 0.65;
      // Stiff bristles snap back rapidly under motion, thinning line width faster with speed
      const speedThinExponent = 0.65 + stiffness * 0.70;
      const speedThinning = Math.max(0.35, 1 / (1 + speed * speedThinExponent));

      radius = state.baseRadius * (0.50 + pressure * 1.25 * deflScale) * speedThinning;
      waterAmt = 0.75 * state.waterRatio * mat.reservoir * mat.flowRate * speedThinning;
      pigmentAmt = 0.88 * conc * (0.85 + 0.15 * stiffness);

      // Dry brush (Fei Bai 飞白) trigger:
      // Coarse bristles (horse, hog) skip over paper peaks at lower speeds/light pressure;
      // thirsty soft bristles (goat) hold ink longer before skipping.
      const drySpeedThresh = 0.90 / mat.dryBrushSensitivity;
      const dryPressureThresh = 0.32 * mat.dryBrushSensitivity;
      if (state.dryBrush && (speed > drySpeedThresh || pressure < dryPressureThresh)) {
        enableDryFilter = true;
        waterAmt *= Math.max(0.35, 0.60 / mat.dryBrushSensitivity);
      }
    }

    // Brush footprint geometry & orientation angle
    const tipShape: BrushTipShape = state.tipShape ?? 'round';
    const bristleSplitting = mat.bristleSplitting;
    let strokeAngle = state.angle ?? 0;
    if (state.angle === undefined) {
      if (tipShape === 'flat') {
        // Classical italic/chisel nib angle: fixed 45°
        strokeAngle = Math.PI * 0.25;
      } else if (!isFirstPoint && this.lastX !== null && this.lastY !== null && dist > 0.5) {
        const moveAngle = Math.atan2(y - this.lastY, x - this.lastX);
        if (tipShape === 'slanted' || tipShape === 'fan') {
          strokeAngle = moveAngle + Math.PI * 0.5;
        } else if (tipShape === 'dagger') {
          strokeAngle = moveAngle;
        }
      }
    }

    // Ink is laid down per unit of path with tight continuous spacing so lines never break
    const spacing = Math.max(1.0, radius * 0.28);
    const perStamp = (INK_PER_RADIUS * spacing) / Math.max(1, radius);
    const firstStamp = Math.max(0.45, perStamp);
    if (isFirstPoint || this.lastX === null || this.lastY === null) {
      sim.injectInk(x, y, radius, waterAmt * firstStamp, pigmentAmt * firstStamp, enableDryFilter, pigmentConfig, tipShape, strokeAngle, bristleSplitting);
      this.carry = 0;
    } else {
      let along = spacing - this.carry;
      while (along <= dist) {
        const t = along / dist;
        sim.injectInk(
          this.lastX + (x - this.lastX) * t,
          this.lastY + (y - this.lastY) * t,
          radius, waterAmt * perStamp, pigmentAmt * perStamp, enableDryFilter, pigmentConfig, tipShape, strokeAngle, bristleSplitting
        );
        along += spacing;
      }
      this.carry = dist - (along - spacing);
      // A resting pen keeps bleeding into the paper
      if (speed < 0.02) {
        const dwell = Math.min(dt, 50) * DWELL_PER_MS;
        sim.injectInk(x, y, radius * 0.8, waterAmt * dwell, pigmentAmt * dwell, enableDryFilter, pigmentConfig, tipShape, strokeAngle, bristleSplitting);
      }
    }

    this.lastX = x;
    this.lastY = y;
    this.lastTime = now;
  }

  endStroke() {
    this.lastX = null;
    this.lastY = null;
    this.lastTime = null;
    this.carry = 0;
  }
}

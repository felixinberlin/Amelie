import { WetInkSimulation } from './simulation';

export type BrushToolType = 'fountain-pen' | 'sumi-brush' | 'wash-brush' | 'dropper' | 'water-drop';

export interface BrushState {
  tool: BrushToolType;
  baseRadius: number;
  waterRatio: number;   // water-to-pigment balance (0.2 = dry ink, 2.0 = wet wash)
  dryBrush: boolean;    // whether skipping over paper hills is active
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
    now: number = performance.now()
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

    // Dynamic radius based on tool and pressure
    let radius = state.baseRadius;
    let waterAmt = 0.5;
    let pigmentAmt = 0.8;
    let enableDryFilter = false;

    if (state.tool === 'fountain-pen') {
      radius = state.baseRadius * (0.6 + pressure * 0.8);
      waterAmt = 0.35 * state.waterRatio;
      pigmentAmt = 0.9;
    } else if (state.tool === 'sumi-brush') {
      // Fast stroke = thinner, drier (authentic calligraphy behavior)
      // A flick (~1 px/ms) leaves ~40 % of the width a slow, pressed stroke does
      const speedThinning = Math.max(0.35, 1 / (1 + speed * 1.5));
      radius = state.baseRadius * (0.5 + pressure * 1.2) * speedThinning;
      waterAmt = 0.6 * state.waterRatio * speedThinning;
      pigmentAmt = 0.85;

      // Dry brush trigger on fast flick or light pressure
      if (state.dryBrush && (speed > 0.8 || pressure < 0.3)) {
        enableDryFilter = true;
        waterAmt *= 0.4;
      }
    } else if (state.tool === 'wash-brush') {
      radius = state.baseRadius * 2.2;
      waterAmt = 1.6 * state.waterRatio;
      pigmentAmt = 0.45; // diluted wash
    } else if (state.tool === 'dropper') {
      radius = state.baseRadius * 2.8;
      waterAmt = 2.4 * state.waterRatio;
      pigmentAmt = 1.2;
    } else if (state.tool === 'water-drop') {
      // Pure clear water (0 pigment) to trigger backruns, dilution & edge lifting
      radius = state.baseRadius * 2.2;
      waterAmt = 2.2 * state.waterRatio;
      pigmentAmt = 0.0;
    }

    // Ink is laid down per unit of path, not per pointer event: stamps sit
    // every `spacing` px along the path (the remainder carries over between
    // events), each holding the ink for that stretch. Otherwise a slow stroke —
    // many events, tiny steps — would flood the paper, and a fast one would
    // leave a string of pearls.
    const spacing = Math.max(1.5, radius * 0.35);
    const perStamp = (INK_PER_RADIUS * spacing) / Math.max(1, radius);
    if (isFirstPoint || this.lastX === null || this.lastY === null) {
      sim.injectInk(x, y, radius, waterAmt * perStamp, pigmentAmt * perStamp, enableDryFilter);
      this.carry = 0;
    } else {
      let along = spacing - this.carry;
      while (along <= dist) {
        const t = along / dist;
        sim.injectInk(
          this.lastX + (x - this.lastX) * t,
          this.lastY + (y - this.lastY) * t,
          radius, waterAmt * perStamp, pigmentAmt * perStamp, enableDryFilter
        );
        along += spacing;
      }
      this.carry = dist - (along - spacing);
      // A resting pen keeps bleeding into the paper
      if (speed < 0.02) {
        const dwell = Math.min(dt, 50) * DWELL_PER_MS;
        sim.injectInk(x, y, radius * 0.8, waterAmt * dwell, pigmentAmt * dwell, enableDryFilter);
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

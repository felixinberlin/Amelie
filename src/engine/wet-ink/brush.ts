import { WetInkSimulation } from './simulation';

export type BrushToolType = 'fountain-pen' | 'sumi-brush' | 'wash-brush' | 'dropper' | 'water-drop';

export interface BrushState {
  tool: BrushToolType;
  baseRadius: number;
  waterRatio: number;   // water-to-pigment balance (0.2 = dry ink, 2.0 = wet wash)
  dryBrush: boolean;    // whether skipping over paper hills is active
}

export class WetInkBrushManager {
  private lastX: number | null = null;
  private lastY: number | null = null;
  private lastTime: number = 0;

  stroke(
    sim: WetInkSimulation,
    x: number,
    y: number,
    pressure: number,
    state: BrushState,
    isFirstPoint: boolean = false
  ) {
    const now = performance.now();
    const dt = Math.max(1, now - (this.lastTime || now));

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
      const speedThinning = Math.max(0.4, 1.0 - speed * 0.35);
      radius = state.baseRadius * (0.5 + pressure * 1.2) * speedThinning;
      waterAmt = 0.6 * state.waterRatio;
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

    // Interpolate points between lastX, lastY and x, y to prevent string-of-pearls gaps
    if (isFirstPoint || this.lastX === null || this.lastY === null) {
      sim.injectInk(x, y, radius, waterAmt, pigmentAmt, enableDryFilter);
    } else {
      const stepDist = Math.max(1.5, radius * 0.4);
      const steps = Math.ceil(dist / stepDist);

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const curX = this.lastX + (x - this.lastX) * t;
        const curY = this.lastY + (y - this.lastY) * t;
        sim.injectInk(curX, curY, radius, waterAmt / (steps * 0.6), pigmentAmt / (steps * 0.6), enableDryFilter);
      }
    }

    this.lastX = x;
    this.lastY = y;
    this.lastTime = now;
  }

  endStroke() {
    this.lastX = null;
    this.lastY = null;
    this.lastTime = 0;
  }
}

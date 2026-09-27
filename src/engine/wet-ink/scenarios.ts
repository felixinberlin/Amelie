import { generatePaperMaps, PaperMaps } from './paper';
import { PAPER_PRESETS, PIGMENT_PRESETS } from './presets';
import { WetInkSimulation } from './simulation';
import { WetInkBrushManager, BrushState } from './brush';
import { WetInkSimParams } from './types';

/**
 * The six reference scenes from the plan (§4 "Visuelle Regression"):
 * single blot, wet-in-wet, fast stroke, dry brush, two layers, washi.
 * Everything is deterministic — fixed seed, fixed timestep, recorded brush
 * timestamps — so the same scene always dries into the same image.
 */

export const REFERENCE_PARAMS: WetInkSimParams = {
  capillaryThreshold: 0.12,
  enableCapillaryThreshold: true,
  capillarySpeed: 1,
  evaporationRate: 1,
  edgeDarkeningStrength: 1,
  granulationStrength: 1,
  backrunStrength: 1,
  dryBrushSensitivity: 0.5,
};

export interface Scenario {
  id: string;
  pigment: string;
  /** Draws onto the simulation; may step it. Drying to completion happens afterwards. */
  draw: (sim: WetInkSimulation) => void;
}

const DT = 1 / 60;
const FRAME_MS = 1000 / 60;

/** Drags a brush along `path` at one point per frame, stepping the sim like the UI does. */
export function brushPath(
  sim: WetInkSimulation,
  path: Array<[number, number, number]>,
  state: BrushState,
  msPerPoint: number = FRAME_MS
) {
  const brush = new WetInkBrushManager();
  path.forEach(([x, y, pressure], n) => {
    brush.stroke(sim, x, y, pressure, state, n === 0, n * msPerPoint);
    sim.step(DT);
  });
  brush.endStroke();
}

function wave(x0: number, x1: number, cy: number, amp: number, points: number): Array<[number, number, number]> {
  const out: Array<[number, number, number]> = [];
  for (let n = 0; n < points; n++) {
    const t = n / (points - 1);
    out.push([x0 + (x1 - x0) * t, cy + Math.sin(t * Math.PI * 2) * amp, 0.7]);
  }
  return out;
}

const SUMI: BrushState = { tool: 'sumi-brush', baseRadius: 5, waterRatio: 1, dryBrush: false };

export const SCENARIOS: Scenario[] = [
  {
    id: 'klecks',
    pigment: 'sepia',
    draw: (sim) => sim.injectInk(sim.width / 2, sim.height / 2, 12, 1.2, 0.35),
  },
  {
    id: 'nass-in-nass',
    pigment: 'preussischblau',
    draw: (sim) => {
      sim.injectInk(sim.width / 2, sim.height / 2, 22, 0.8, 0.3);
      for (let n = 0; n < 70; n++) sim.step(DT);
      sim.injectInk(sim.width / 2, sim.height / 2, 7, 1.5, 0);
    },
  },
  {
    id: 'schneller-strich',
    pigment: 'sumi',
    // 12 points across the tile: ~10 px per 16 ms ≈ 0.6 px/ms, a quick flick
    draw: (sim) => brushPath(sim, wave(16, sim.width - 16, sim.height / 2, 22, 12), SUMI),
  },
  {
    id: 'langsamer-strich',
    pigment: 'sumi',
    // Same path, 100 points: ~1 px per 16 ms ≈ 0.07 px/ms
    draw: (sim) => brushPath(sim, wave(16, sim.width - 16, sim.height / 2, 22, 100), SUMI),
  },
  {
    id: 'dry-brush',
    pigment: 'sumi',
    draw: (sim) => brushPath(
      sim,
      wave(16, sim.width - 16, sim.height / 2, 10, 30).map(([x, y]) => [x, y, 0.2] as [number, number, number]),
      { ...SUMI, baseRadius: 9, dryBrush: true }
    ),
  },
  {
    id: 'zwei-lagen',
    pigment: 'krapplack',
    draw: (sim) => {
      sim.injectInk(sim.width * 0.4, sim.height / 2, 16, 0.9, 0.25);
      while (sim.isActive) sim.step(DT);
      sim.injectInk(sim.width * 0.6, sim.height / 2, 16, 0.9, 0.25);
    },
  },
];

const mapsCache = new Map<string, PaperMaps>();

/** Runs a scenario on a paper until everything is dry (or `maxSteps`). */
export function runScenario(
  scenario: Scenario,
  paperId: string,
  size: number = 128,
  params: WetInkSimParams = REFERENCE_PARAMS,
  /** Stop after this many steps even if still wet (snapshots mid-drying) */
  maxSteps: number = 5000
): { sim: WetInkSimulation; dryingSteps: number } {
  const paper = PAPER_PRESETS.find((p) => p.id === paperId);
  const pigment = PIGMENT_PRESETS.find((p) => p.id === scenario.pigment);
  if (!paper || !pigment) throw new Error(`unknown paper/pigment ${paperId}/${scenario.pigment}`);
  const key = `${paperId}@${size}`;
  let maps = mapsCache.get(key);
  if (!maps) {
    maps = generatePaperMaps(size, size, paper, 42);
    mapsCache.set(key, maps);
  }
  const sim = new WetInkSimulation(size, size, maps, paper, pigment, { ...params });
  scenario.draw(sim);
  let dryingSteps = 0;
  while (sim.isActive && dryingSteps < maxSteps) {
    sim.step(DT);
    dryingSteps++;
  }
  return { sim, dryingSteps };
}

import { describe, it, expect } from 'vitest';
import { WetInkSimulation, WET_INK_DT, WET_INK_MAX_SUBSTEPS } from './simulation';
import { generatePaperMaps } from './paper';
import { PAPER_PRESETS, PIGMENT_PRESETS } from './presets';
import { WetInkBrushManager } from './brush';
import { measureStain, rimRatio, granulationRatio } from './metrics';
import { SCENARIOS, REFERENCE_PARAMS, runScenario, brushPath } from './scenarios';

const SIZE = 128;
const paper = (id: string) => PAPER_PRESETS.find((p) => p.id === id)!;
const pigment = (id: string) => PIGMENT_PRESETS.find((p) => p.id === id)!;
const scene = (id: string) => SCENARIOS.find((s) => s.id === id)!;
// Heavy runs get an explicit budget; the default 5 s is for unit-sized tests
const SLOW = 60_000;

// Each (scene, paper, params) is simulated once and shared between tests
const runs = new Map<string, ReturnType<typeof runScenario>>();
function dried(sceneId: string, paperId: string, params = REFERENCE_PARAMS) {
  const key = `${sceneId}|${paperId}|${JSON.stringify(params)}`;
  let r = runs.get(key);
  if (!r) {
    r = runScenario(scene(sceneId), paperId, SIZE, params);
    runs.set(key, r);
  }
  return r;
}

function freshSim(paperId = 'washi', pigmentId = 'sepia', size = SIZE) {
  const cfg = paper(paperId);
  return new WetInkSimulation(size, size, generatePaperMaps(size, size, cfg, 42), cfg, pigment(pigmentId), { ...REFERENCE_PARAMS });
}

/** FNV-1a over the raw bytes of a float buffer: stable across runs, sensitive to any bit. */
function hash(a: Float32Array): string {
  const bytes = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  let h = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i];
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

function assertSane(sim: WetInkSimulation) {
  const cap = sim.fiberCapacity;
  for (let i = 0; i < sim.size; i++) {
    const vals = [sim.waterFilm[i], sim.fiberMoisture[i], sim.pigmentSuspended[i], sim.pigmentFiber[i], sim.pigmentDeposited[i]];
    for (const v of vals) {
      if (!Number.isFinite(v) || v < -1e-6) throw new Error(`bad value ${v} at ${i}`);
    }
    if (sim.fiberMoisture[i] > cap[i] + 1e-6) throw new Error(`fiber over capacity at ${i}: ${sim.fiberMoisture[i]} > ${cap[i]}`);
  }
}

describe('Wet Ink simulation — invariants (plan §4.1)', { timeout: SLOW }, () => {
  it.each(PAPER_PRESETS.map((p) => p.id))('conserves water and pigment to ±0.1 %% on %s', (paperId) => {
    const sim = freshSim(paperId);
    sim.injectInk(64, 64, 12, 1.2, 0.35);
    for (let n = 0; n < 600 && sim.isActive; n++) {
      sim.step(WET_INK_DT);
      if (n % 50 === 0) {
        const r = sim.massReport();
        expect(r.waterError).toBeLessThan(1e-3);
        expect(r.pigmentError).toBeLessThan(1e-3);
      }
    }
    const r = sim.massReport();
    expect(r.waterError).toBeLessThan(1e-3);
    expect(r.pigmentError).toBeLessThan(1e-3);
    // Dry: all water evaporated, all pigment bound to the fibers
    expect(sim.isActive).toBe(false);
    expect(r.waterPresent).toBe(0);
    expect(r.waterEvaporated).toBeCloseTo(r.waterInjected, 3);
  });

  it('never produces NaNs, negative pools or over-full fibers', () => {
    const sim = freshSim('aquarell-rau', 'sumi');
    const brush = new WetInkBrushManager();
    for (let n = 0; n < 60; n++) {
      brush.stroke(sim, 20 + n * 1.5, 64 + Math.sin(n / 6) * 30, 0.8,
        { tool: 'wash-brush', baseRadius: 6, waterRatio: 2, dryBrush: false }, n === 0, n * 16);
      sim.step(WET_INK_DT);
      if (n % 10 === 0) assertSane(sim);
    }
    brush.endStroke();
    for (let n = 0; n < 800 && sim.isActive; n++) {
      sim.step(WET_INK_DT);
      if (n % 40 === 0) assertSane(sim);
    }
    assertSane(sim);
  });

  it('keeps its books through undo and redo', () => {
    const sim = freshSim();
    sim.injectInk(40, 64, 10, 1, 0.3);
    for (let n = 0; n < 30; n++) sim.step(WET_INK_DT);
    sim.pushSnapshot();
    sim.injectInk(90, 64, 10, 1, 0.3);
    for (let n = 0; n < 30; n++) sim.step(WET_INK_DT);
    expect(sim.undo()).toBe(true);
    expect(sim.massReport().pigmentError).toBeLessThan(1e-3);
    expect(sim.redo()).toBe(true);
    for (let n = 0; n < 800 && sim.isActive; n++) sim.step(WET_INK_DT);
    const r = sim.massReport();
    expect(r.waterError).toBeLessThan(1e-3);
    expect(r.pigmentError).toBeLessThan(1e-3);
  });
});

describe('Wet Ink simulation — determinism (plan §4.3)', { timeout: SLOW }, () => {
  it('dries the same scene into bit-identical pigment twice', () => {
    const a = dried('schneller-strich', 'washi');
    const b = dried('schneller-strich', 'washi');
    expect(a.dryingSteps).toBe(b.dryingSteps);
    expect(hash(a.sim.pigmentDeposited)).toBe(hash(b.sim.pigmentDeposited));
  });

  it('replays a brush stroke identically when timestamps are recorded', () => {
    const run = () => {
      const sim = freshSim('buetten', 'sumi');
      const path: Array<[number, number, number]> = [];
      for (let n = 0; n < 40; n++) path.push([20 + n * 2, 64 + Math.cos(n / 5) * 20, 0.4 + (n % 5) * 0.1]);
      brushPath(sim, path, { tool: 'sumi-brush', baseRadius: 5, waterRatio: 1, dryBrush: false }, 12);
      while (sim.isActive) sim.step(WET_INK_DT);
      return hash(sim.pigmentDeposited);
    };
    expect(run()).toBe(run());
  });
});

describe('Wet Ink simulation — stability (plan §5: tab switch, dt = 3 s)', { timeout: SLOW }, () => {
  it('advance() sub-steps a 3 s pause into at most a few fixed steps', () => {
    const sim = freshSim();
    sim.injectInk(64, 64, 14, 1.5, 0.4);
    const steps = sim.advance(3.0);
    expect(steps).toBeLessThanOrEqual(WET_INK_MAX_SUBSTEPS);
    assertSane(sim);
    expect(sim.massReport().waterError).toBeLessThan(1e-3);
  });

  it('step() clamps a huge or invalid dt instead of exploding', () => {
    const sim = freshSim('kopierpapier', 'sumi');
    sim.injectInk(64, 64, 14, 2.5, 1);
    sim.step(3.0);
    sim.step(Number.NaN);
    sim.step(-1);
    for (let n = 0; n < 20; n++) sim.step(0.5);
    assertSane(sim);
    const r = sim.massReport();
    expect(r.waterError).toBeLessThan(1e-3);
    expect(r.pigmentError).toBeLessThan(1e-3);
  });

  it('advance() accumulates small frame times into whole steps', () => {
    const sim = freshSim();
    sim.injectInk(64, 64, 10, 1, 0.3);
    let steps = 0;
    for (let n = 0; n < 120; n++) steps += sim.advance(1 / 120);
    expect(steps).toBe(60);
  });
});

describe('Wet Ink acceptance — the five effects', { timeout: SLOW }, () => {
  it('P2 feathering: washi wicks along its grain, copy paper stays round', () => {
    const washi = dried('klecks', 'washi').sim;
    const copy = dried('klecks', 'kopierpapier').sim;
    const w = measureStain(washi.pigmentDeposited, SIZE, SIZE);
    const c = measureStain(copy.pigmentDeposited, SIZE, SIZE);

    // Directed: elongated, and the long axis follows the fibers (±15°)
    expect(w.anisotropy).toBeGreaterThan(1.15);
    const grain = paper('washi').fiberBaseAngle;
    expect(Math.abs(w.majorAngle - grain)).toBeLessThan((15 * Math.PI) / 180);
    // Copy paper: nearly round
    expect(c.anisotropy).toBeLessThan(1.1);
    // Unsized washi wicks the same drop much further than sized copy paper
    expect(w.area).toBeGreaterThan(c.area * 1.3);
  });

  it('P2 feathering: bütten wicks along its vertical laid lines', () => {
    const { sim } = dried('klecks', 'buetten');
    const m = measureStain(sim.pigmentDeposited, SIZE, SIZE);
    expect(m.anisotropy).toBeGreaterThan(1.05);
    // Grain is 90°: the major axis is vertical (±15°)
    expect(Math.abs(Math.abs(m.majorAngle) - Math.PI / 2)).toBeLessThan((15 * Math.PI) / 180);
  });

  it('P2 capillary threshold: a higher ε_min holds the stain in', () => {
    const area = (params: typeof REFERENCE_PARAMS) =>
      measureStain(dried('klecks', 'washi', params).sim.pigmentDeposited, SIZE, SIZE).area;
    const off = area({ ...REFERENCE_PARAMS, enableCapillaryThreshold: false });
    const high = area({ ...REFERENCE_PARAMS, capillaryThreshold: 0.4 });
    expect(high).toBeLessThan(off);
  });

  it('P4 edge darkening: a drop on sized paper dries with a dark rim', () => {
    const { sim } = dried('klecks', 'kopierpapier');
    expect(rimRatio(sim.pigmentDeposited, SIZE, SIZE, SIZE / 2, SIZE / 2, 12)).toBeGreaterThan(1.1);
  });

  it('P4 layering: two layers of the same ink are visibly darker where they overlap', () => {
    const { sim } = dried('zwei-lagen', 'kopierpapier');
    const img = { data: new Uint8ClampedArray(SIZE * SIZE * 4), width: SIZE, height: SIZE } as unknown as ImageData;
    sim.renderToImageData(img, 'composite');
    // Mean luminance of a 5×5 patch
    const lum = (cx: number, cy: number) => {
      let t = 0;
      for (let y = cy - 2; y <= cy + 2; y++) {
        for (let x = cx - 2; x <= cx + 2; x++) {
          const i = (y * SIZE + x) * 4;
          t += 0.2126 * img.data[i] + 0.7152 * img.data[i + 1] + 0.0722 * img.data[i + 2];
        }
      }
      return t / 25;
    };
    const single = lum(Math.round(SIZE * 0.3), SIZE / 2);  // only the first drop
    const overlap = lum(SIZE / 2, SIZE / 2);                 // both drops
    expect(overlap).toBeLessThan(single - 10);
  });

  it('P4 granulation: pigment settles into the valleys of rough paper', () => {
    const { sim } = dried('klecks', 'aquarell-rau');
    const ratio = granulationRatio(sim.pigmentDeposited, sim.paper.heightMap, SIZE, 56, 56, 72, 72);
    expect(ratio).toBeGreaterThan(1.03);
  });

  it('P5 brush: a fast stroke is thinner and drier than a slow one along the same path', () => {
    const fast = dried('schneller-strich', 'buetten').sim;
    const slow = dried('langsamer-strich', 'buetten').sim;
    const f = measureStain(fast.pigmentDeposited, SIZE, SIZE);
    const s = measureStain(slow.pigmentDeposited, SIZE, SIZE);
    expect(f.area).toBeLessThan(s.area * 0.85);
    expect(fast.waterInjected).toBeLessThan(slow.waterInjected * 0.85);
  });

  it('P5 brush: ink follows path length, not the number of pointer events', () => {
    const inkFor = (events: number) => {
      const sim = freshSim('kopierpapier', 'sumi');
      const brush = new WetInkBrushManager();
      const state = { tool: 'fountain-pen' as const, baseRadius: 4, waterRatio: 1, dryBrush: false };
      for (let n = 0; n <= events; n++) {
        // Same 80 px line and the same 400 ms duration, sampled differently
        brush.stroke(sim, 24 + (80 * n) / events, 64, 0.6, state, n === 0, (400 * n) / events);
      }
      return sim.waterInjected;
    };
    const coarse = inkFor(10);
    const fine = inkFor(80);
    expect(Math.abs(fine - coarse) / coarse).toBeLessThan(0.1);
  });

  it('P5 dry brush: the brush skips over paper peaks', () => {
    const { sim } = dried('dry-brush', 'aquarell-rau');
    // Along the stroke's core line there are unpainted gaps
    let gaps = 0;
    for (let x = 20; x < SIZE - 20; x++) {
      const y = Math.round(SIZE / 2 + Math.sin(((x - 16) / (SIZE - 32)) * Math.PI * 2) * 10);
      if (sim.pigmentDeposited[y * SIZE + x] < 0.05) gaps++;
    }
    expect(gaps).toBeGreaterThan(0);
  });

  it('every reference scene dries within 10 s of simulated time', () => {
    for (const sc of SCENARIOS) {
      for (const p of PAPER_PRESETS) {
        const { sim, dryingSteps } = dried(sc.id, p.id);
        expect(sim.isActive, `${sc.id} on ${p.id}`).toBe(false);
        expect(dryingSteps, `${sc.id} on ${p.id}`).toBeLessThan(600);
      }
    }
  });
});

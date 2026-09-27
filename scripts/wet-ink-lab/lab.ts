// Wet Ink lab: headless renders, stain metrics, parameter sweeps, benchmarks.
//
//   npm run wet-ink:lab -- render [tag]         contact sheet of all scenes × papers
//   npm run wet-ink:lab -- one <scene> <paper> [layer]  one scene at 4× zoom
//   npm run wet-ink:lab -- metrics              numbers behind the acceptance tests
//   npm run wet-ink:lab -- sweep '[{...},...]'  metrics for WET_INK_PHYSICS overrides
//   npm run wet-ink:lab -- bench                ms per step at UI resolution
//
// PHYS='{"felt":0.1}' overrides physics constants for any command;
// PARAMS='{"enableCapillaryThreshold":false}' overrides sim params for `one` and `metrics`;
// STEPS=60 stops `one` mid-drying.
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { writePng } from './png';
import {
  PAPER_PRESETS, PIGMENT_PRESETS, WET_INK_PHYSICS, WetInkSimulation, WetInkBrushManager,
  generatePaperMaps, measureStain, rimRatio, granulationRatio, SCENARIOS, runScenario, REFERENCE_PARAMS,
} from '../../src/engine/wet-ink';

const OUT = resolve(process.cwd(), 'scripts/wet-ink-lab/out');
mkdirSync(OUT, { recursive: true });
const base = { ...WET_INK_PHYSICS };
Object.assign(WET_INK_PHYSICS, JSON.parse(process.env.PHYS || '{}'));

const [cmd = 'render', arg] = process.argv.slice(2);
const SIZE = 128;
const ZOOM = 2;

function render(tag: string) {
  const papers = PAPER_PRESETS.map((p) => p.id);
  const tileW = SIZE * ZOOM;
  const W = tileW * papers.length;
  const H = tileW * SCENARIOS.length;
  const sheet = new Uint8ClampedArray(W * H * 4);
  const img = { data: new Uint8ClampedArray(SIZE * SIZE * 4), width: SIZE, height: SIZE } as unknown as ImageData;
  SCENARIOS.forEach((sc, row) => {
    papers.forEach((paperId, col) => {
      const { sim, dryingSteps } = runScenario(sc, paperId, SIZE);
      sim.renderToImageData(img, 'composite');
      for (let y = 0; y < tileW; y++) {
        for (let x = 0; x < tileW; x++) {
          const si = (((y / ZOOM) | 0) * SIZE + ((x / ZOOM) | 0)) * 4;
          const di = ((row * tileW + y) * W + col * tileW + x) * 4;
          const grid = x === 0 || y === 0 ? 170 : -1;
          sheet[di] = grid >= 0 ? grid : img.data[si];
          sheet[di + 1] = grid >= 0 ? grid : img.data[si + 1];
          sheet[di + 2] = grid >= 0 ? grid : img.data[si + 2];
          sheet[di + 3] = 255;
        }
      }
      const r = sim.massReport();
      console.log(`${sc.id.padEnd(17)} ${paperId.padEnd(13)} dry=${String(dryingSteps).padStart(4)} ` +
        `water±${r.waterError.toExponential(1)} pigment±${r.pigmentError.toExponential(1)}`);
    });
  });
  const file = resolve(OUT, `sheet-${tag}.png`);
  writePng(file, W, H, sheet);
  console.log(`rows: ${SCENARIOS.map((s) => s.id).join(', ')}\ncols: ${papers.join(', ')}\n→ ${file}`);
}

function metrics() {
  const klecks = SCENARIOS.find((s) => s.id === 'klecks')!;
  const rows: string[] = [];
  const params = { ...REFERENCE_PARAMS, ...JSON.parse(process.env.PARAMS || '{}') };
  for (const paper of PAPER_PRESETS) {
    const { sim, dryingSteps } = runScenario(klecks, paper.id, SIZE, params);
    const m = measureStain(sim.pigmentDeposited, SIZE, SIZE);
    const rim = rimRatio(sim.pigmentDeposited, SIZE, SIZE, SIZE / 2, SIZE / 2, 12);
    const gran = granulationRatio(sim.pigmentDeposited, sim.paper.heightMap, SIZE, 56, 56, 72, 72);
    rows.push(`${paper.id.padEnd(13)} dry=${String(dryingSteps).padStart(4)} spread=×${(m.area / (Math.PI * 144)).toFixed(2)} ` +
      `aniso=${m.anisotropy.toFixed(2)} angle=${((m.majorAngle * 180) / Math.PI).toFixed(0)}° ` +
      `(grain ${((paper.fiberBaseAngle * 180) / Math.PI).toFixed(0)}°) rough=${m.roughness.toFixed(2)} hairs=${(m.hairs * 100).toFixed(1)}% rim=${rim.toFixed(2)} gran=${gran.toFixed(2)}`);
  }
  return rows.join('\n');
}

function bench() {
  const W = 384, H = 256;
  for (const paper of [PAPER_PRESETS[0], PAPER_PRESETS[3]]) {
    const sim = new WetInkSimulation(W, H, generatePaperMaps(W, H, paper, 42), paper, PIGMENT_PRESETS[0], { ...REFERENCE_PARAMS });
    const brush = new WetInkBrushManager();
    const times: number[] = [];
    const tick = () => { const t = performance.now(); sim.step(1 / 60); times.push(performance.now() - t); };
    // A five-stroke signature, one brush event per frame
    for (let s = 0; s < 5; s++) {
      for (let i = 0; i < 45; i++) {
        brush.stroke(sim, 30 + s * 70 + i * 1.2, 60 + s * 25 + Math.sin(i / 7) * 40, 0.6,
          { tool: 'sumi-brush', baseRadius: 5, waterRatio: 1, dryBrush: false }, i === 0, (s * 45 + i) * 16.7);
        tick();
      }
      brush.endStroke();
    }
    while (sim.isActive && times.length < 5000) tick();
    const sorted = [...times].sort((a, b) => a - b);
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`${paper.id.padEnd(13)} steps=${times.length} mean=${mean.toFixed(2)}ms ` +
      `p95=${sorted[(sorted.length * 0.95) | 0].toFixed(2)}ms max=${sorted[sorted.length - 1].toFixed(2)}ms`);
  }
}

function one(sceneId: string, paperId: string, layer: string = 'composite') {
  const sc = SCENARIOS.find((s) => s.id === sceneId);
  if (!sc) throw new Error(`unknown scene ${sceneId}`);
  const params = { ...REFERENCE_PARAMS, ...JSON.parse(process.env.PARAMS || '{}') };
  const { sim, dryingSteps } = runScenario(sc, paperId, SIZE, params, Number(process.env.STEPS || 5000));
  const img = { data: new Uint8ClampedArray(SIZE * SIZE * 4), width: SIZE, height: SIZE } as unknown as ImageData;
  sim.renderToImageData(img, layer as never);
  const Z = 4;
  const out = new Uint8ClampedArray(SIZE * Z * SIZE * Z * 4);
  for (let y = 0; y < SIZE * Z; y++) {
    for (let x = 0; x < SIZE * Z; x++) {
      const si = (((y / Z) | 0) * SIZE + ((x / Z) | 0)) * 4;
      out.set(img.data.subarray(si, si + 4), (y * SIZE * Z + x) * 4);
    }
  }
  const file = resolve(OUT, `one-${sceneId}-${paperId}-${layer}${process.env.PARAMS ? '-params' : ''}.png`);
  writePng(file, SIZE * Z, SIZE * Z, out);
  console.log(`dry=${dryingSteps} → ${file}`);
}

/** Water front reach (max distance of damp fiber from the drop centre) over time. */
function probe(paperId: string) {
  const params = { ...REFERENCE_PARAMS, ...JSON.parse(process.env.PARAMS || '{}') };
  const cfg = PAPER_PRESETS.find((p) => p.id === paperId)!;
  const sim = new WetInkSimulation(SIZE, SIZE, generatePaperMaps(SIZE, SIZE, cfg, 42), cfg, PIGMENT_PRESETS[1], params);
  sim.injectInk(64, 64, 12, 1.2, 0.35);
  for (let n = 0; n <= 400 && sim.isActive; n++) {
    if (n % 20 === 0) {
      let reach = 0, film = 0, donors = 0, damp = 0;
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
        const i = y * SIZE + x;
        if (sim.waterFilm[i] > 1e-3) film++;
        if (sim.fiberMoisture[i] > 0.002) { damp++; reach = Math.max(reach, Math.hypot(x - 64, y - 64)); }
        if (sim.fiberMoisture[i] > params.capillaryThreshold * sim.fiberCapacity[i]) donors++;
      }
      if (process.env.PROFILE) {
        const row: string[] = [];
        for (let x = 64; x < 96; x++) {
          const i = 64 * SIZE + x;
          row.push((sim.fiberMoisture[i] / sim.fiberCapacity[i]).toFixed(2) + (sim.waterFilm[i] > 1e-3 ? '*' : ''));
        }
        console.log('   sat→ ' + row.join(' '));
      }
      console.log(`step ${String(n).padStart(3)} film=${film} damp=${damp} donors=${donors} reach=${reach.toFixed(1)} fiberWater=${sim.fiberMoisture.reduce((a, b) => a + b, 0).toFixed(2)} film=${sim.waterFilm.reduce((a, b) => a + b, 0).toFixed(1)} evaporated=${sim.waterEvaporated.toFixed(1)}`);
    }
    sim.step(1 / 60);
  }
}

if (cmd === 'render') render(arg || 'latest');
else if (cmd === 'probe') probe(arg || 'washi');
else if (cmd === 'one') one(arg, process.argv[4] || 'washi', process.argv[5]);
else if (cmd === 'metrics') console.log(metrics());
else if (cmd === 'bench') bench();
else if (cmd === 'sweep') {
  for (const override of JSON.parse(arg || '[{}]')) {
    Object.assign(WET_INK_PHYSICS, base, JSON.parse(process.env.PHYS || '{}'), override);
    console.log(JSON.stringify(override));
    console.log(metrics().replace(/^/gm, '   '));
  }
} else {
  console.error(`unknown command ${cmd}`);
  process.exit(1);
}

// Ablauf des Modellvergleichs: Läufe ausführen, Richter befragen, auswerten, Bericht schreiben.
// Alle Funktionen nehmen `root` und `deps` (Tests ersetzen Netz und SDKs); die CLI ist scripts/model-compare.mjs.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { findAll, norm } from '../bibliothek-lib.mjs';
import { repoRoot } from '../dosen-lib.mjs';
import { ENGINES, buildPrompts } from './prompts.mjs';
import { TOOL_DEFS, createHandlers } from './tools.mjs';
import { createProvider, runConversation, checkReady } from './providers.mjs';
import { aggregateModel, clusterKandidaten, judgeList, judgeShare, konvergenz, parseJudge, parseKandidaten, renderReport, scoreRun, ueberschneidung } from './lib.mjs';

export { repoRoot };
const DIR = 'scripts/model-compare';
export const RUNS = '06-suche/modellvergleich/runs';
export const BERICHTE = '06-suche/modellvergleich/berichte';
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const loadQuellen = (root) => readJson(join(root, 'src/data/quellen.json'));

/** Konfiguration: models.local.json (nicht im Repo), sonst das Beispiel. */
export function loadConfig(root, file) {
  const p = file ?? [join(root, DIR, 'models.local.json'), join(root, DIR, 'models.example.json')].find(existsSync);
  const cfg = readJson(p);
  for (const m of cfg.models) if (!m.id || !m.provider) throw new Error(`Modell ohne id/provider in ${p}`);
  return { ...cfg, file: p };
}

export const runDirOf = (root, run, runsDir) => (existsSync(run) ? run : join(runsDir ?? join(root, RUNS), run));

// ---------------------------------------------------------------- Läufe

async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); }
  }));
  return out;
}

/**
 * Führt Modelle × Engines × Wiederholungen aus und legt die Berichte unter runs/<id>/<modell>/<engine>-<i>.md ab.
 * opts: { root, thema, datum, models (Spezifikationen), engines, repeats, search, mock, parallel, maxTurns, runId, dryRun }
 */
export async function runAll(opts, deps = {}) {
  const root = opts.root ?? repoRoot;
  const datum = opts.datum ?? new Date().toISOString().slice(0, 10);
  const engines = opts.engines ?? Object.keys(ENGINES);
  const repeats = opts.repeats ?? 1;
  const search = opts.search ?? 'none';
  const runId = opts.runId ?? `${datum}-${slug(opts.thema)}`;
  const dir = join(opts.runsDir ?? join(root, RUNS), runId);
  const quellen = loadQuellen(root);
  const specs = opts.models.map((m) => (opts.mock ? { ...m, provider: 'mock' } : m));
  const units = specs.flatMap((spec) => engines.flatMap((engine) => Array.from({ length: repeats }, (_, i) => ({ spec, engine, i: i + 1 }))));
  const prompts = Object.fromEntries(engines.map((e) => [e, buildPrompts({ root, thema: opts.thema, datum, engine: e, quellen, search })]));
  const promptsHash = createHash('sha256').update(JSON.stringify(prompts)).digest('hex').slice(0, 12);
  if (opts.dryRun) return { runId, dir, units: units.length, prompts, promptsHash, dryRun: true };

  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'run.json'), JSON.stringify({
    runId, thema: opts.thema, datum, engines, repeats, search, mock: !!opts.mock, promptsHash, created: new Date().toISOString(),
    models: specs.map(({ id, provider, model, effort, price, priceNote }) => ({ id, provider, model, effort, price: price ?? null, priceNote })),
  }, null, 2) + '\n');

  const adapters = new Map();
  const results = await pool(units, opts.parallel ?? 3, async ({ spec, engine, i }) => {
    const t0 = Date.now();
    let out = { text: '', usage: { in: 0, out: 0, turns: 0 }, toolLog: [], stop: '' };
    let error = null;
    try {
      if (!adapters.has(spec.id)) adapters.set(spec.id, await createProvider(spec, deps));
      const handlers = createHandlers({ quellen: quellen.quellen, fetchFn: deps.fetchFn });
      out = await runConversation(adapters.get(spec.id), { system: prompts[engine].system, user: prompts[engine].user, tools: TOOL_DEFS, handlers, nativeSearch: search === 'native', maxTurns: opts.maxTurns ?? 20, meta: { engine } });
    } catch (e) { error = e.message; }
    const sub = join(dir, spec.id);
    mkdirSync(sub, { recursive: true });
    writeFileSync(join(sub, `${engine}-${i}.md`), out.text ?? '');
    writeFileSync(join(sub, `${engine}-${i}.json`), JSON.stringify({ model: spec.id, engine, repeat: i, usage: out.usage, toolLog: out.toolLog, stop: out.stop, error, ms: Date.now() - t0, nativeSearch: search === 'native' }, null, 2) + '\n');
    opts.onUnit?.({ model: spec.id, engine, i, error, ms: Date.now() - t0, tokens: out.usage });
    return { model: spec.id, engine, i, error };
  });
  return { runId, dir, units: units.length, results, promptsHash };
}

// ---------------------------------------------------------------- Auswertung

export function loadRun(root, run, runsDir) {
  const dir = runDirOf(root, run, runsDir);
  const meta = readJson(join(dir, 'run.json'));
  const perModel = {};
  for (const m of meta.models) {
    perModel[m.id] = [];
    const sub = join(dir, m.id);
    if (!existsSync(sub)) continue;
    for (const f of readdirSync(sub).filter((x) => x.endsWith('.json')).sort()) {
      const info = readJson(join(sub, f));
      const text = existsSync(join(sub, f.replace(/\.json$/, '.md'))) ? readFileSync(join(sub, f.replace(/\.json$/, '.md')), 'utf8') : '';
      perModel[m.id].push({ ...info, text });
    }
  }
  return { dir, meta, perModel };
}

/** Wertet einen Lauf aus, schreibt bericht.json (im Lauf) und den Markdown-Bericht (unter berichte/, versionierbar). */
export function scoreRunDir({ root = repoRoot, run, write = true, runsDir, berichteDir }) {
  const { dir, meta, perModel } = loadRun(root, run, runsDir);
  const q = loadQuellen(root);
  const quellenCtx = { quellen: q.quellen, katalog: q.katalog, typen: q.typen.map((t) => t.id), doseIds: new Set(), graveIds: new Set() };
  const findFn = (terms) => findAll(terms, { root, quellen: q.quellen });
  const graeber = readJson(join(root, 'src/data/graeber.json'));
  for (const g of graeber) quellenCtx.graveIds.add(g.id);
  const doseDir = join(root, '05-dosen');
  if (existsSync(doseDir)) for (const f of readdirSync(doseDir)) if (f.endsWith('.md') && !f.startsWith('_')) quellenCtx.doseIds.add(f.replace(/\.md$/, ''));

  const agg = {};
  const rowsByModel = {};
  const scores = {};
  for (const m of meta.models) {
    scores[m.id] = perModel[m.id].map((r) => scoreRun(r, { quellenCtx, findFn }));
    agg[m.id] = aggregateModel(scores[m.id], m.price);
    rowsByModel[m.id] = perModel[m.id].flatMap((r) => parseKandidaten(r.text));
  }
  const ids = meta.models.map((m) => m.id);
  const clusters = clusterKandidaten(rowsByModel);
  const konv = konvergenz(clusters, ids);
  const overlap = ueberschneidung(clusters, ids);
  const judgeFile = join(dir, 'judge.json');
  let judge = null;
  let judgeId = null;
  if (existsSync(judgeFile)) {
    const j = readJson(judgeFile);
    judgeId = j.judge;
    judge = judgeShare(clusters, j.verdicts, ids);
  }
  const report = renderReport({ meta: { ...meta, judge: judgeId }, models: meta.models, agg, konv, judge });
  const result = { meta, agg, konvergenz: konv, ueberschneidung: overlap, judge, clusters: clusters.map((c) => ({ n: c.n, title: c.title, id: c.id, models: c.models })), scores };
  if (write) {
    writeFileSync(join(dir, 'bericht.json'), JSON.stringify(result, null, 2) + '\n');
    const bdir = berichteDir ?? join(root, BERICHTE);
    mkdirSync(bdir, { recursive: true });
    writeFileSync(join(bdir, `${meta.runId}.md`), report);
  }
  return { ...result, report };
}

// ---------------------------------------------------------------- Richter

const JUDGE_SYSTEM = `Du bist der Idea Reviewer von Amélie — Advocatus Diaboli, nicht Fan. Amélie verschenkt Werkzeug-Ideen (CC0) an Institutionen mit Mandat; eine Idee ist nur dann etwas wert, wenn (1) es sie nicht schon gibt, (2) ein Empfänger mit Mandat existiert, (3) ein Messwert oder eine Rechenregel sie trägt und (4) sie ohne Server baubar ist.
Ordne jede Idee genau einem Urteil zu:
- dose_ready: trägt, Lücke belegt, Empfänger da (selten)
- needs_research: Restlücke, ein konkreter Datentest würde entscheiden
- besetzt: gibt es schon oder der Empfänger macht es selbst
- friedhof: trägt nicht (trivial, kein Empfänger, kein Nachweiswert, Premisse falsch)
Antworte NUR mit einem JSON-Array: [{"n": 1, "verdict": "needs_research", "reason": "ein Satz"}, …] — eine Zeile je Idee, n ist die Nummer aus der Liste.`;

/** Der Richter ordnet die Vereinigung aller Kandidaten ein (ohne zu wissen, von welchem Modell sie stammen). */
export async function judgeRun({ root = repoRoot, run, spec, mock = false, runsDir }, deps = {}) {
  const { dir, meta, perModel } = loadRun(root, run, runsDir);
  const rowsByModel = Object.fromEntries(Object.entries(perModel).map(([m, runs]) => [m, runs.flatMap((r) => parseKandidaten(r.text))]));
  const clusters = clusterKandidaten(rowsByModel);
  if (!clusters.length) throw new Error('Keine Kandidaten im Lauf — nichts zu beurteilen.');
  const s = mock ? { ...spec, provider: 'mock' } : spec;
  const adapter = await createProvider(s, deps);
  const user = `Thema der Runde: ${meta.thema}\n\nIdeen (Herkunft absichtlich nicht genannt):\n${judgeList(clusters)}\n\nGib das JSON-Array zurück.`;
  let text = '';
  let usage = {};
  if (s.provider === 'mock') {
    text = JSON.stringify(clusters.map((c, i) => ({ n: c.n, verdict: ['needs_research', 'besetzt', 'friedhof', 'dose_ready'][i % 4], reason: 'Mock-Urteil' })));
  } else {
    const r = await runConversation(adapter, { system: JUDGE_SYSTEM, user, tools: [], handlers: {}, maxTurns: 2, meta: {} });
    text = r.text;
    usage = r.usage;
  }
  const verdicts = parseJudge(text);
  writeFileSync(join(dir, 'judge.json'), JSON.stringify({ judge: spec.id, at: new Date().toISOString(), clusters: clusters.map((c) => ({ n: c.n, title: c.title, models: c.models })), verdicts, raw: text, usage }, null, 2) + '\n');
  return { judge: spec.id, clusters: clusters.length, verdicts: verdicts.length, missing: clusters.length - verdicts.length };
}

export { checkReady };

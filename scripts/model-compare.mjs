#!/usr/bin/env node
// Modellvergleich für Amélies Engines: dieselbe Runde mit verschiedenen Modellen, gemessen an dem, was sich nachprüfen lässt.
// Handbuch: 06-suche/amelie-modellvergleich.md
//
//   npm run vergleich -- models [--check]                       Konfiguration zeigen; --check prüft Zugang und SDK ohne Aufruf
//   npm run vergleich -- run --thema "…" [--models a,b] [--engines scout,kollider,inversion] [--repeats 1]
//                        [--search none|native] [--parallel 3] [--max-turns 20] [--run-id x] [--yes | --mock | --dry-run]
//   npm run vergleich -- judge --run <id|pfad> [--judge <modell-id>] [--mock]   ein Modell ordnet die Vereinigung aller Kandidaten ein
//   npm run vergleich -- score --run <id|pfad> [--json]         Kennzahlen und Bericht (06-suche/modellvergleich/berichte/<id>.md)
//
// Echte Läufe kosten Geld: ohne --yes (oder --mock/--dry-run) bricht `run` ab. --mock testet die ganze Kette ohne Netz.

import { parseArgs } from './bibliothek-lib.mjs';
import { ENGINES } from './model-compare/prompts.mjs';
import { checkReady, judgeRun, loadConfig, repoRoot, runAll, scoreRunDir } from './model-compare/runner.mjs';

const [cmd = 'hilfe', ...rest] = process.argv.slice(2);
const { one, has } = parseArgs(rest);
const die = (m, code = 1) => { console.error(m); process.exit(code); };
const HELP = readHelp();
function readHelp() { return `Modellvergleich — npm run vergleich -- <befehl>\n\n  models [--check]   run --thema "…" [--models a,b] [--engines …] [--repeats n] [--search none|native] [--yes|--mock|--dry-run]\n  judge --run <id> [--judge <id>] [--mock]   score --run <id> [--json]\n\nHandbuch: 06-suche/amelie-modellvergleich.md`; }

function pick(cfg, list) {
  if (!list) return cfg.models;
  const wanted = list.split(',').map((s) => s.trim()).filter(Boolean);
  const out = wanted.map((id) => cfg.models.find((m) => m.id === id) ?? die(`Unbekanntes Modell „${id}“ (bekannt: ${cfg.models.map((m) => m.id).join(', ')})`));
  return out;
}

async function main() {
  if (cmd === 'hilfe' || cmd === 'help') return console.log(HELP);
  const cfg = loadConfig(repoRoot, one('config'));

  if (cmd === 'models') {
    console.log(`Konfiguration: ${cfg.file}\nRichter (Standard): ${cfg.judge ?? '–'}\n`);
    for (const m of cfg.models) {
      const line = `${m.id.padEnd(16)} ${m.provider.padEnd(14)} ${String(m.model).padEnd(22)} ${m.price ? `$${m.price.in}/$${m.price.out} je Mio.` : 'kein Preis'}`;
      if (has('check')) {
        const r = await checkReady(m);
        console.log(`${r.ok ? '✓' : '✗'} ${line}${r.ok ? '' : '\n    ' + r.problems.join('\n    ')}`);
      } else console.log(line);
    }
    return;
  }

  if (cmd === 'run') {
    const thema = one('thema') ?? die('--thema "…" fehlt');
    const models = pick(cfg, one('models'));
    const engines = (one('engines') ?? Object.keys(ENGINES).join(',')).split(',').map((s) => s.trim());
    for (const e of engines) if (!ENGINES[e]) die(`Unbekannte Engine „${e}“ (${Object.keys(ENGINES).join(' | ')})`);
    const search = one('search') ?? 'none';
    if (!['none', 'native'].includes(search)) die('--search none | native');
    const mock = has('mock');
    const dryRun = has('dry-run');
    const repeats = Number(one('repeats') ?? 1);
    const calls = models.length * engines.length * repeats;
    if (!mock && !dryRun) {
      const bad = [];
      for (const m of models) { const r = await checkReady(m); if (!r.ok) bad.push(`${m.id}: ${r.problems.join('; ')}`); }
      if (bad.length) die(`Nicht startklar:\n  ${bad.join('\n  ')}\n(prüfen mit: npm run vergleich -- models --check; Probelauf ohne Netz: --mock)`);
      if (!has('yes')) die(`${calls} Läufe (${models.length} Modelle × ${engines.length} Engines × ${repeats}) kosten echtes Geld und rufen echte APIs auf.\nMit --yes bestätigen, mit --dry-run nur die Prompts zeigen, mit --mock ohne Netz testen.`, 2);
    }
    const res = await runAll({ thema, models, engines, repeats, search, mock, dryRun, parallel: Number(one('parallel') ?? 3), maxTurns: Number(one('max-turns') ?? 20), runId: one('run-id'), onUnit: (u) => console.log(`${u.error ? '✗' : '✓'} ${u.model} · ${u.engine}-${u.i} · ${Math.round(u.ms / 1000)} s${u.error ? ' · ' + u.error : ` · ${u.tokens?.in ?? 0}→${u.tokens?.out ?? 0} Tokens`}`) });
    if (dryRun) {
      for (const [e, p] of Object.entries(res.prompts)) console.log(`\n■ ${e} (${p.label}): System ${p.system.length} Zeichen, Nutzer ${p.user.length} Zeichen\n${p.user}`);
      return console.log(`\nDry-run: ${res.units} Läufe würden starten (Prompt-Hash ${res.promptsHash}). Nichts aufgerufen, nichts geschrieben.`);
    }
    console.log(`\nLauf ${res.runId} fertig (${res.units} Läufe). Weiter: npm run vergleich -- judge --run ${res.runId}${mock ? ' --mock' : ''}  dann  score --run ${res.runId}`);
    return;
  }

  if (cmd === 'judge') {
    const run = one('run') ?? die('--run <id|pfad> fehlt');
    const id = one('judge') ?? cfg.judge ?? die('--judge <modell-id> fehlt (oder "judge" in der Konfiguration)');
    const spec = cfg.models.find((m) => m.id === id) ?? die(`Unbekannter Richter „${id}“`);
    if (!has('mock')) { const r = await checkReady(spec); if (!r.ok) die(`Richter nicht startklar: ${r.problems.join('; ')}`); }
    const r = await judgeRun({ run, spec, mock: has('mock') });
    return console.log(`Richter ${r.judge}: ${r.verdicts}/${r.clusters} Kandidaten beurteilt${r.missing ? ` (${r.missing} ohne Urteil — Antwort unvollständig)` : ''}. Weiter: score --run ${run}`);
  }

  if (cmd === 'score') {
    const run = one('run') ?? die('--run <id|pfad> fehlt');
    const r = scoreRunDir({ root: repoRoot, run });
    if (has('json')) return console.log(JSON.stringify({ ok: true, agg: r.agg, konvergenz: r.konvergenz, ueberschneidung: r.ueberschneidung, judge: r.judge }, null, 2));
    console.log(r.report);
    return console.log(`Bericht: 06-suche/modellvergleich/berichte/${r.meta.runId}.md`);
  }

  die(`Unbekannter Befehl „${cmd}“.\n\n${HELP}`);
}

main().catch((e) => die(e.message));

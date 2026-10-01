#!/usr/bin/env node
// npm run agent — die Amélie-Crew von der Kommandozeile. Handbuch: 06-suche/amelie-kommandozeile.md
//
// Jeder Agent ist ein eigenes Programm mit eigener Schleife gegen ein Modell (Gemini, Claude direkt oder über Vertex),
// liest mit den Werkzeugen des Kits, liefert Bericht + geprüften JSON-Block und hinterlässt einen Laufdatensatz.
// Geschrieben wird nur mit ausdrücklicher Freigabe und nur auf dem Weg, den die Definition des Agenten erlaubt.

import { readFileSync } from 'node:fs';
import { loadConfig, repoRoot } from './model-compare/runner.mjs';
import { createProvider } from './model-compare/providers.mjs';
import { withRetry } from './lab-librarian-agent.mjs';
import { EXIT, fixedAdapter, runAgent } from './crew/crew.mjs';
import { CREW, PROFILES } from './crew/profiles.mjs';
import { listRuns, loadRun, saveRun } from './crew/runs.mjs';
import { applyWrites } from './crew/write.mjs';

const HELP = `Amélie-Crew — Agenten von der Kommandozeile

  npm run agent -- list                               Agenten, Rollen, Schreibwege
  npm run agent -- <agent> [Auftrag] [Optionen]       einen Agenten laufen lassen
  npm run agent -- runs [--agent <name>] [--json]     Läufe auflisten (neueste zuerst)
  npm run agent -- show <run> [--json]                einen Lauf zeigen (run_id, Pfad oder latest:<agent>)
  npm run agent -- write <run> [--dry-run]            Schreibweg eines früheren Laufs ausführen (nach Durchsicht)

Auftrag (einer davon):
  --thema "<Thema>"        Standardauftrag des Agenten zu einem Thema
  --task "<Text>"          eigener Auftrag
  --task-file <Datei>      eigener Auftrag aus Datei
  --input <run>            Ergebnis eines früheren Laufs mitgeben (mehrfach; run_id, Pfad, latest:<agent>)

Optionen:
  --model <id>             Modell aus scripts/model-compare/models.local.json
                           (Standard: "agents": {"<agent>": id} → "crew" → "librarian" → "judge" → erstes)
  --mock                   ohne Netz und Kosten: feste Antwort, prüft die ganze Kette
  --max-turns <n>          Werkzeugrunden (Standard 20)
  --search                 Websuche des Anbieters statt Lab-Suchdienst
  --no-repair              keinen Reparaturaufruf bei Vertragsfehlern
  --write                  nach einem ok-Lauf den erlaubten Schreibweg ausführen (eigenes Log; Bibliothekar: bib apply)
  --dry-write              Schreibweg nur zeigen bzw. prüfen, nichts ändern
  --json                   Laufdatensatz als JSON auf stdout (für Skripte), sonst der Bericht
  --runs-dir <Pfad>        anderes Laufverzeichnis (Standard 06-suche/agent-runs, oder AMELIE_RUNS)

Exit-Codes: 0 ok · 1 Aufruf falsch · 3 Lauf unvollständig (Modellfehler, leer, Vertrag gebrochen) · 4 Schreiben abgelehnt
Agenten: ${CREW.join(', ')}`;

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n) => { const i = argv.indexOf(`--${n}`); return i < 0 ? undefined : argv[i + 1]; };
const opts = (n) => argv.flatMap((a, i) => (a === `--${n}` && argv[i + 1] ? [argv[i + 1]] : []));
const err = (s) => process.stderr.write(`${s}\n`);
const dir = opt('runs-dir');

/** Modell wählen: --model, dann agents.<agent>, crew, librarian, judge, erstes. */
export function pickCrewModel(cfg, agent, id) {
  const want = id ?? cfg.agents?.[agent] ?? cfg.crew ?? cfg.librarian ?? cfg.judge ?? cfg.models[0]?.id;
  const spec = cfg.models.find((m) => m.id === want);
  if (!spec) throw new Error(`Modell „${want}“ steht nicht in ${cfg.file} (vorhanden: ${cfg.models.map((m) => m.id).join(', ')})`);
  return spec;
}

async function main() {
  const cmd = argv[0];
  if (!cmd || cmd === 'hilfe' || cmd === 'help' || flag('help')) { console.log(HELP); return cmd ? EXIT.OK : EXIT.USAGE; }

  if (cmd === 'list') {
    for (const [name, p] of Object.entries(PROFILES)) console.log(`${name.padEnd(24)} ${p.role}\n${' '.repeat(25)}schreibt: ${p.writes?.describe ?? 'nichts'}`);
    return EXIT.OK;
  }
  if (cmd === 'runs') {
    const runs = listRuns(repoRoot, { agent: opt('agent'), dir });
    if (flag('json')) console.log(JSON.stringify(runs, null, 2));
    else if (!runs.length) console.log('(keine Läufe)');
    else for (const r of runs) console.log(`${r.run_id.padEnd(48)} ${String(r.status).padEnd(16)} ${String(r.model ?? '').padEnd(14)} ${r.summary}`);
    return EXIT.OK;
  }
  if (cmd === 'show') {
    const r = loadRun(repoRoot, argv[1], { dir });
    if (flag('json')) console.log(JSON.stringify(r, null, 2));
    else console.log(`# ${r.run_id} (${r.status}, ${r.model?.id})\n${r.summary ?? ''}\n${r.errors?.length ? `\nFehler:\n- ${r.errors.join('\n- ')}\n` : ''}\n${r.report}`);
    return EXIT.OK;
  }

  if (cmd === 'write') {
    let r;
    try { r = loadRun(repoRoot, argv[1], { dir }); } catch (e) { err(e.message); return EXIT.USAGE; }
    return doWrite(r, { dryRun: flag('dry-run') });
  }

  if (!PROFILES[cmd]) { err(`„${cmd}“ ist kein Agent und kein Befehl.\n\n${HELP}`); return EXIT.USAGE; }
  const agent = cmd;
  const task = opt('task') ?? (opt('task-file') ? readFileSync(opt('task-file'), 'utf8') : undefined);
  let inputs;
  try { inputs = opts('input').map((ref) => loadRun(repoRoot, ref, { dir })); } catch (e) { err(e.message); return EXIT.USAGE; }

  let spec; let adapter;
  if (flag('mock')) {
    spec = { id: 'mock', provider: 'mock' };
    adapter = fixedAdapter(() => PROFILES[agent].mockReply({ inputs }), { usage: { in: 1000, out: 400 } });
  } else {
    try { spec = pickCrewModel(loadConfig(repoRoot), agent, opt('model')); } catch (e) { err(e.message); return EXIT.USAGE; }
    adapter = withRetry(await createProvider(spec), { onRetry: (n, ms, e) => err(`[Wiederholung ${n} in ${Math.round(ms / 1000)} s] ${e?.message ?? e}`) });
  }

  let record;
  try {
    record = await runAgent({
      root: repoRoot, agent, task, thema: opt('thema'), inputs, adapter, spec, dir,
      maxTurns: Number(opt('max-turns')) || 20,
      repair: !flag('no-repair'),
      kitOptions: flag('search') ? { nativeSearch: true } : {},
      log: err,
    });
  } catch (e) { err(e.message); return EXIT.USAGE; }

  let code = record.status === 'ok' ? EXIT.OK : EXIT.INCOMPLETE;
  if (code === EXIT.OK && (flag('write') || flag('dry-write'))) code = await doWrite(record, { dryRun: flag('dry-write'), quiet: true });
  if (flag('json')) console.log(JSON.stringify(record, null, 2));
  else console.log(record.report || '(kein Bericht)');
  if (record.errors.length) err(`\nFehler:\n- ${record.errors.join('\n- ')}`);
  err(`\n[${record.agent}] ${record.status} · ${record.summary} · ${record.usage.in} Token ein, ${record.usage.out} aus · ${record.cost_usd ?? '?'} USD · ${record.toolLog.length} Werkzeugaufrufe`);
  err(`[${record.agent}] run_id=${record.run_id} datei=${record.files?.json ?? '-'}`);
  return code;
}

/** Schreibweg eines Laufs ausführen und den Datensatz mit dem Ergebnis neu speichern. */
async function doWrite(record, { dryRun, quiet = false }) {
  const profile = PROFILES[record.agent];
  if (!profile?.writes) { err(`${record.agent} schreibt laut Definition nichts.`); return EXIT.USAGE; }
  try {
    const done = await applyWrites({ root: repoRoot, record, profile, dryRun });
    for (const w of done) err(`[${record.agent}] ${dryRun ? 'würde schreiben' : 'geschrieben'}: ${w.file ?? `bib apply ${w.plan_id} (Akteur ${w.actor})`}${w.bytes ? `, ${w.bytes} Byte` : ''}`);
    if (dryRun && !quiet) for (const w of done) if (w.preview) console.log(`--- ${w.file} (Vorschau) ---\n${w.preview}${w.bytes > 600 ? '\n[…]' : ''}`);
    return EXIT.OK;
  } catch (e) {
    err(`[${record.agent}] Schreiben abgelehnt: ${e.message}`);
    return EXIT.WRITE_FAILED;
  } finally {
    saveRun(repoRoot, record, { dir });
  }
}

main().then((code) => process.exit(code)).catch((e) => { err(e?.stack ?? String(e)); process.exit(EXIT.INCOMPLETE); });

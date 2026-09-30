#!/usr/bin/env node
// Startet einen Amélie-Agenten (ideen-scout, idea-reviewer, inversions-agent, bisoziations-kollider) über Gemini,
// nur lesend, ohne Claude-Code-Subagenten. Handbuch: 06-suche/amelie-kommandozeile.md
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig, repoRoot } from './model-compare/runner.mjs';
import { createProvider } from './model-compare/providers.mjs';
import { createKit, DELEGABLE } from './agent-kit.mjs';
import { pickModel, withRetry } from './lab-librarian-agent.mjs';

const HELP = `Aufruf: npm run agent -- <agent> (--task "<Text>" | --task-file <Datei>) [--model <id>] [--max-turns <n>]
Agenten: ${DELEGABLE.join(', ')}
Nur lesend; der Bericht kommt auf die Standardausgabe. Modell aus scripts/model-compare/models.local.json (Standard "librarian", z. B. gemini-flash).`;

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? undefined : args[i + 1]; };
const agent = args[0];
if (!agent || agent.startsWith('-') || args.includes('--help')) { console.log(HELP); process.exit(agent ? 0 : 1); }
if (!DELEGABLE.includes(agent)) { console.error(`„${agent}“ ist kein erlaubter Agent.\n${HELP}`); process.exit(1); }
const task = opt('task') ?? (opt('task-file') ? readFileSync(opt('task-file'), 'utf8') : '');
if (task.trim().length < 20) { console.error(`Aufgabe fehlt oder ist zu kurz.\n${HELP}`); process.exit(1); }

const cfg = loadConfig(repoRoot);
const spec = pickModel(cfg, opt('model'));
const adapter = withRetry(await createProvider(spec), { onRetry: (e, n) => console.error(`[Wiederholung ${n}] ${e?.message ?? e}`) });
const quellen = JSON.parse(readFileSync(join(repoRoot, 'src/data/quellen.json'), 'utf8')).quellen;
const kit = createKit({ root: repoRoot, quellen, makeAdapter: async () => adapter, maxAgentCalls: 1, ...(args.includes('--search') ? { nativeSearch: true } : {}), maxAgentTurns: Number(opt('max-turns')) || 20 });
const out = await kit.handlers.call_agent({ agent, task });
console.log(out);
const u = kit.ledger.agentCalls.reduce((a, c) => ({ in: a.in + (c.usage?.in ?? 0), out: a.out + (c.usage?.out ?? 0) }), { in: 0, out: 0 });
const cost = spec.price ? ((u.in * spec.price.in + u.out * spec.price.out) / 1e6).toFixed(3) : '?';
console.error(`\n[${spec.id}: ${u.in} Token ein, ${u.out} aus, geschätzt ${cost} USD]`);

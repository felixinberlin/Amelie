// Die Crew: Amélie-Agenten als eigenständige Programme (eigene Gesprächsschleife gegen ein Modell, kein Claude-Code-Subagent).
//
// Ein Lauf = Agentendefinition aus .claude/agents/<name>.md (Systemtext, Werkzeuge) + Betriebsart Kommandozeile
// + Profil aus scripts/crew/profiles.mjs (Auftrag, Datenvertrag, erlaubter Schreibweg). Ablauf:
//
//   1. Gespräch mit Lesewerkzeugen aus dem Kit (scripts/agent-kit.mjs): Repo lesen, bib/quellen-Lesebefehle,
//      Skills laden, Web holen/suchen. Kein Werkzeug schreibt.
//   2. Vertrag prüfen (scripts/crew/contracts.mjs). Bei Fehlern EIN Reparaturaufruf ohne Werkzeuge.
//   3. Laufdatensatz speichern (scripts/crew/runs.mjs).
//   4. Nur mit Freigabe (--write / --apply): das Programm, nicht das Modell, schreibt auf dem einen Weg, den die
//      Definition des Agenten erlaubt (eigenes Log; beim Bibliothekar `bib apply`).

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runConversation } from '../model-compare/providers.mjs';
import { KIT_TOOLS, createKit, parseAgentDef, toolsForAgent } from '../agent-kit.mjs';
import { CONTRACTS, checkReport, stripJson } from './contracts.mjs';
import { newRunId, saveRun } from './runs.mjs';
import { PROFILES } from './profiles.mjs';

export const EXIT = { OK: 0, USAGE: 1, INCOMPLETE: 3, WRITE_FAILED: 4 };

/** Agentendefinition laden. */
export function loadDef(root, agent) {
  const file = join(root, '.claude/agents', `${agent}.md`);
  if (!existsSync(file)) throw new Error(`Definition .claude/agents/${agent}.md fehlt.`);
  const def = parseAgentDef(readFileSync(file, 'utf8'));
  if (!def) throw new Error(`Definition von ${agent} hat kein Frontmatter.`);
  return def;
}

/** Systemtext: Definition + Betriebsart Kommandozeile + Vertrag. */
export function systemPrompt(def, profile) {
  const shape = CONTRACTS[profile.contract].shape;
  return `${def.body}

---
Betriebsart: Kommandozeile (npm run agent). Du läufst als eigenständiger Agent ohne Claude Code.
- Deine Werkzeuge lesen nur. Was du laut deiner Definition in eine Datei schreiben würdest, gehört in deinen Bericht; das Programm schreibt es danach, wenn Félix es freigibt. Schreibbefehle (grab add, protokoll add, quellen import, apply) gibt es hier nicht.
- Skill-Pfade in deiner Anweisung (skills/<name>/… oder .claude/skills/<name>/SKILL.md) lädst du mit load_skill(name), Dateien aus references/ mit load_skill(name, reference).
- Arbeite mit den Werkzeugen, nicht aus dem Gedächtnis: erst Pflichtlektüre (read_file, load_skill), dann Doppelprüfung (run_cli bib find …), dann Suche (web_search, web_fetch). Ein Urteil ohne Werkzeugaufruf ist kein Urteil.
- Belege, die du nicht mit web_fetch geholt hast, sind „schnipsel“. „frei“ gibt es nur mit „seite“.
${profile.extraRules ? `${profile.extraRules}\n` : ''}
Schreibe zuerst deinen Bericht für Menschen (Markdown, kurz) und beende ihn mit GENAU EINEM \`\`\`json-Block in dieser Form (das Programm liest nur diesen Block):
${shape}`;
}

/** Adapter, der eine feste Antwort liefert (--mock und Tests). */
export function fixedAdapter(text, { name = 'mock', usage = { in: 0, out: 0 } } = {}) {
  return {
    name,
    start() { return {}; },
    async step() { return { text: typeof text === 'function' ? text() : text, calls: [], usage, stop: 'end_turn' }; },
    addToolResults() {},
  };
}

const cost = (spec, u) => (spec?.price ? Number((((u.in ?? 0) * spec.price.in + (u.out ?? 0) * spec.price.out) / 1e6).toFixed(4)) : null);
const addUsage = (a, b) => ({ in: (a.in ?? 0) + (b?.in ?? 0), out: (a.out ?? 0) + (b?.out ?? 0), turns: (a.turns ?? 0) + (b?.turns ?? 0), searches: (a.searches ?? 0) + (b?.searches ?? 0) });

/**
 * Führt einen Agenten aus und speichert den Lauf.
 * opts: { root, agent, task, inputs, adapter, repairAdapter, spec, kitOptions, maxTurns, save, dir, now, log }
 * Liefert den Laufdatensatz (record) samt Pfaden (record.files).
 */
export async function runAgent(opts) {
  const { root, agent, adapter, spec = { id: 'unbekannt' }, maxTurns = 20, save = true, dir, now = () => new Date(), log = () => {} } = opts;
  const profile = PROFILES[agent];
  if (!profile) throw new Error(`„${agent}“ ist kein Agent der Crew (${Object.keys(PROFILES).join(', ')}).`);
  const def = loadDef(root, agent);
  const inputs = opts.inputs ?? [];
  const task = profile.buildTask({ task: opts.task, thema: opts.thema, inputs, root });
  const started = now();
  const record = {
    run_id: newRunId(agent, started),
    agent,
    started: started.toISOString(),
    model: { id: spec.id, provider: spec.provider ?? null, model: spec.model ?? null },
    contract: profile.contract,
    thema: opts.thema ?? null,
    task,
    inputs: inputs.map((r) => r.run_id),
    status: 'error',
    report: '',
    data: null,
    errors: [],
    repaired: false,
    usage: { in: 0, out: 0, turns: 0, searches: 0 },
    cost_usd: null,
    toolLog: [],
    writes: [],
  };

  const kit = createKit({ root, quellen: loadQuellen(root), ...(opts.kitOptions ?? {}) });
  const names = [...toolsForAgent(def), ...(profile.extraTools ?? [])].filter((n, i, a) => a.indexOf(n) === i);
  const handlers = { ...Object.fromEntries(names.filter((n) => kit.handlers[n]).map((n) => [n, kit.handlers[n]])), ...(profile.handlers?.({ root, kit }) ?? {}) };
  const tools = names.map((n) => KIT_TOOLS[n] ?? profile.toolDefs?.[n]).filter(Boolean);
  const system = systemPrompt(def, profile);

  try {
    await CONTRACTS[profile.contract].prepare?.();
    log(`[${agent}] Lauf ${record.run_id} mit ${spec.id}, ${tools.length} Werkzeuge`);
    const r = await runConversation(adapter, {
      system, user: task, tools, handlers,
      nativeSearch: !!opts.kitOptions?.nativeSearch && def.tools.includes('WebSearch'),
      maxTurns, meta: { engine: agent },
    });
    record.usage = addUsage(record.usage, r.usage);
    record.toolLog = r.toolLog;
    record.stop = r.stop;
    record.report = String(r.text ?? '');
    if (!record.report.trim()) {
      record.status = 'empty';
      record.errors = [`Leere Antwort (Stopp: ${r.stop})`];
    } else {
      const fullCheck = async (text) => {
        const c = checkReport(profile.contract, text);
        if (!c.ok || !profile.postValidate) return c;
        const more = await profile.postValidate(c.data, { root, record });
        return more.length ? { ok: false, data: c.data, errors: more } : c;
      };
      let check = await fullCheck(record.report);
      if (!check.ok && opts.repair !== false) {
        log(`[${agent}] Vertrag verletzt (${check.errors.length} Fehler), ein Reparaturaufruf`);
        const fix = await runConversation(opts.repairAdapter ?? adapter, {
          system: `Du reparierst den JSON-Block eines Berichts. Keine neuen Fakten, keine Suche: nur Form und Werte so ändern, dass die Fehlerliste erfüllt ist. Fehlt eine Angabe, schreibe ehrlich, dass sie fehlt (z. B. urteil „unklar“). Antworte NUR mit dem korrigierten \`\`\`json-Block in dieser Form:\n${CONTRACTS[profile.contract].shape}`,
          user: `Fehler:\n- ${check.errors.join('\n- ')}\n\nBericht:\n${record.report.slice(0, 30000)}`,
          tools: [], handlers: {}, maxTurns: 1, meta: { engine: `${agent}-reparatur` },
        });
        record.usage = addUsage(record.usage, fix.usage);
        const fixed = await fullCheck(fix.text);
        record.repaired = true;
        if (fixed.ok) {
          record.report = `${stripJson(record.report)}\n\n${String(fix.text).trim()}`;
          check = fixed;
        } else {
          check = { ok: false, data: fixed.data ?? check.data, errors: [...check.errors, '— nach Reparatur weiterhin:', ...fixed.errors] };
        }
      }
      record.data = check.data;
      record.errors = check.errors;
      record.status = check.ok ? 'ok' : 'contract_failed';
    }
  } catch (e) {
    record.status = 'error';
    record.errors = [String(e?.message ?? e)];
  }
  record.finished = now().toISOString();
  record.cost_usd = cost(spec, record.usage);
  record.summary = record.status === 'ok' ? profile.summarize(record.data) : `${record.status}: ${record.errors[0] ?? ''}`.slice(0, 200);
  if (save) record.files = saveRun(root, record, { dir });
  return record;
}

function loadQuellen(root) {
  try { return JSON.parse(readFileSync(join(root, 'src/data/quellen.json'), 'utf8')).quellen; } catch { return []; }
}

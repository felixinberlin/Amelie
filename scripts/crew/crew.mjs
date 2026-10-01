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

/** Entfernt Leerraum-Müll (Modelle, die sich festfahren, geben tausende Leerzeichen aus). */
export const cleanReport = (t) => String(t ?? '').replace(/[ \t]{40,}/g, ' ').replace(/\n{4,}/g, '\n\n').replace(/(\s*\n){6,}/g, '\n\n');
const searchCalls = (log) => (log ?? []).filter((t) => t.name === 'web_search' || t.name === 'web_fetch').length;
const hasJson = (t) => /```json\s*\n[\s\S]*?\n```/.test(t);
const summarizeTools = (log) => (log ?? []).map((t, i) => `${i + 1}. ${t.name}(${JSON.stringify(t.args).slice(0, 200)}) → ${String(t.result).replace(/\s+/g, ' ').slice(0, 300)}`).join('\n') || '(keine)';

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

  const kit = createKit({ root, quellen: loadQuellen(root), ...(profile.kitOptions ?? {}), ...(opts.kitOptions ?? {}) });
  const names = [...toolsForAgent(def), ...(profile.extraTools ?? [])].filter((n, i, a) => a.indexOf(n) === i);
  const handlers = { ...Object.fromEntries(names.filter((n) => kit.handlers[n]).map((n) => [n, kit.handlers[n]])), ...(profile.handlers?.({ root, kit }) ?? {}) };
  const tools = names.map((n) => KIT_TOOLS[n] ?? profile.toolDefs?.[n]).filter(Boolean);
  const system = systemPrompt(def, profile);

  try {
    await CONTRACTS[profile.contract].prepare?.();
    log(`[${agent}] Lauf ${record.run_id} mit ${spec.id}, ${tools.length} Werkzeuge`);
    const converse = (user) => runConversation(adapter, {
      system, user, tools, handlers,
      nativeSearch: !!opts.kitOptions?.nativeSearch && def.tools.includes('WebSearch'),
      maxTurns, meta: { engine: agent },
    });
    let r = await converse(task);
    record.usage = addUsage(record.usage, r.usage);
    // Suchpflicht: eine Antwort ganz ohne web_search/web_fetch ist kein Urteil. Einmal neu, mit ausdrücklicher Pflicht.
    if (profile.requireSearch && (opts.enforce ?? spec.provider !== 'mock') && !searchCalls(r.toolLog) && handlers.web_search) {
      log(`[${agent}] kein web_search/web_fetch im Lauf, Neustart mit Suchpflicht`);
      const first = r;
      r = await converse(`PFLICHT, weil dein letzter Versuch ohne eine einzige Suche abgegeben wurde: Rufe web_search (und danach web_fetch auf die wichtigsten Treffer) AUF, bevor du ein Urteil schreibst. Beginne mit dem Empfänger, dann mit der Konkurrenz. Ohne Suchaufruf stuft das Programm jedes Urteil herab und der Lauf ist wertlos.\n\n${task}`);
      record.usage = addUsage(record.usage, r.usage);
      record.restarted = true;
      r = { ...r, toolLog: [...first.toolLog, ...r.toolLog] };
    }
    record.toolLog = r.toolLog;
    record.stop = r.stop;
    record.report = cleanReport(r.text);
    if (!hasJson(record.report) && (r.stop === 'max_turns' || !record.report.trim()) && opts.wrapUp !== false) {
      // Werkzeugrunden verbraucht oder keine Antwort: ein Abschlussaufruf ohne Werkzeuge, nur mit dem, was gesammelt ist
      log(`[${agent}] keine Antwort mit JSON-Block (Stopp: ${r.stop}), ein Abschlussaufruf ohne Werkzeuge`);
      const wrap = await runConversation(opts.repairAdapter ?? adapter, {
        system: `${system}\n\nDu hast keine Werkzeugrunden mehr. Schreibe JETZT deinen Bericht und den JSON-Block aus dem, was du bis hierher gefunden hast. Was du nicht prüfen konntest, ist „unklar“ bzw. Evidenz „schnipsel“, nie erfunden. Keine Werkzeuge, kein Python.`,
        user: `${task}\n\nBisheriger Stand (Werkzeugaufrufe und Ergebnisse):\n${summarizeTools(r.toolLog)}\n${record.report.trim() ? `\nDein bisheriger Text:\n${record.report.slice(0, 20000)}` : ''}`,
        tools: [], handlers: {}, maxTurns: 1, meta: { engine: `${agent}-abschluss` },
      });
      record.usage = addUsage(record.usage, wrap.usage);
      record.wrappedUp = true;
      record.report = cleanReport(wrap.text);
    }
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
      const rounds = opts.repair === false ? 0 : (profile.repairRounds ?? 1);
      let current = record.report;
      for (let round = 1; !check.ok && round <= rounds; round++) {
        log(`[${agent}] Vertrag verletzt (${check.errors.length} Fehler), Reparaturaufruf ${round}/${rounds}`);
        const fix = await runConversation(opts.repairAdapter ?? adapter, {
          system: `Du reparierst den JSON-Block eines Berichts. Keine neuen Fakten, keine Suche: nur Form und Werte so ändern, dass die Fehlerliste erfüllt ist. Fehlt eine Angabe, schreibe ehrlich, dass sie fehlt (z. B. urteil „unklar“). Streiche, was die Fehlerliste als nicht vorhanden meldet (unbekannte Typen, Verweise auf Gräber oder Quellen, die es nicht gibt), statt es umzubenennen. Antworte NUR mit dem korrigierten \`\`\`json-Block in dieser Form:\n${CONTRACTS[profile.contract].shape}`,
          user: `Fehler:\n- ${check.errors.join('\n- ')}\n\nBericht:\n${current.slice(0, 30000)}`,
          tools: [], handlers: {}, maxTurns: 1, meta: { engine: `${agent}-reparatur` },
        });
        record.usage = addUsage(record.usage, fix.usage);
        record.repaired = true;
        const fixed = await fullCheck(fix.text);
        if (fixed.ok) {
          record.report = `${stripJson(record.report)}\n\n${String(fix.text).trim()}`;
          check = fixed;
        } else {
          current = `${stripJson(current)}\n\n${String(fix.text).trim()}`;
          check = { ok: false, data: fixed.data ?? check.data, errors: round === rounds ? [...check.errors, '— nach Reparatur weiterhin:', ...fixed.errors] : fixed.errors };
        }
      }
      if (check.ok && profile.postProcess) {
        const notes = profile.postProcess(check.data, { root, record, toolLog: record.toolLog }) ?? [];
        if (notes.length) { record.downgrades = notes; record.report = `${stripJson(record.report)}\n\n> **Vom Programm herabgestuft (Beweispflicht):**\n${notes.map((n) => `> - ${n}`).join('\n')}\n\n${record.report.slice(record.report.lastIndexOf('```json'))}`; log(`[${agent}] ${notes.length} Urteil(e) vom Programm herabgestuft: ${notes.slice(0, 3).join(' · ')}`); }
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

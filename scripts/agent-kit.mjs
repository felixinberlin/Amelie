// Werkzeug-Kit für eigenständige Amélie-Agenten (Agenten mit eigener Schleife, nicht Claude-Code-Subagenten).
//
// Gibt einem Agenten Zugriff auf das, was das Projekt hat, ohne dass er schreiben darf:
//   run_cli       lesende Befehle der Bibliotheks-CLI (bib) und des Quellen-Registers (quellen), nur aus einer Erlaubnisliste
//   read_file     Dateien des Repos lesen (ohne .git, node_modules, Zugangsdaten)
//   search_repo   git grep im Repo
//   web_fetch     Webseite holen (Text, gekürzt; Werkzeug des Modellvergleichs)
//   list_skills / load_skill   die Skills unter .claude/skills (Anleitungen, als Text in den Kontext geladen)
//   list_agents / call_agent   die anderen Amélie-Agenten aus .claude/agents als Unter-Agent rufen, NUR LESEND
//
// Unter-Agenten bekommen die Werkzeuge ihrer Definition (Read/Grep/Glob/Bash/WebFetch/WebSearch), aber nie Edit/Write
// und nie call_agent (Tiefe 1). Was sie "schreiben" würden, kommt als Text zurück. Ein Lauf hat eine Obergrenze an Aufrufen.

import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runConversation } from './model-compare/providers.mjs';
import { createHandlers as createWebHandlers } from './model-compare/tools.mjs';

const MAX_OUT = 8000;
const MAX_FILE = 24000;

/** Agenten, die als Unter-Agent laufen dürfen: keine Schreiber des Gedächtnisses, keine Bauer. */
export const DELEGABLE = ['ideen-scout', 'idea-reviewer', 'inversions-agent', 'bisoziations-kollider'];

// ---------------------------------------------------------------- Erlaubnisliste für run_cli

/** Nur lesende Unterbefehle. Schlüssel = Programm, Wert = erlaubte erste Wörter (bei Bedarf mit Unterbefehl). */
const CLI_ALLOW = {
  bib: {
    find: true, exists: true, vorflug: true, status: true, state: true, ledger: true, schema: true,
    grab: ['list', 'show', 'stats', 'werte'],
    protokoll: ['show', 'stats'],
    vector: ['show'],
    quellen: ['match', 'formate'],
  },
  quellen: { next: true, show: true, stats: true, check: true, match: true, formate: true, list: true },
};
const CLI_SCRIPT = { bib: 'scripts/bibliothek.mjs', quellen: 'scripts/quellen.mjs' };
const FORBIDDEN_FLAGS = /^--(dry-run|wait|actor|key|plan-id|no-export|apply)$/;

/** Prüft einen CLI-Aufruf. Liefert null, wenn erlaubt, sonst den Grund. */
export function cliDenied(prog, args) {
  const table = CLI_ALLOW[prog];
  if (!table) return `Programm „${prog}“ ist nicht erlaubt (bib | quellen).`;
  if (!Array.isArray(args) || !args.every((a) => typeof a === 'string')) return 'args muss eine Liste von Texten sein.';
  const [cmd, sub] = args;
  if (!cmd || cmd.startsWith('-')) return 'Der erste Wert muss ein Befehl sein.';
  const rule = table[cmd];
  if (!rule) return `„${prog} ${cmd}“ ist nicht erlaubt (nur Lesebefehle: ${Object.keys(table).join(', ')}).`;
  if (Array.isArray(rule) && !rule.includes(sub)) return `„${prog} ${cmd} ${sub ?? ''}“ ist nicht erlaubt (erlaubt: ${rule.join(', ')}).`;
  const flag = args.find((a) => FORBIDDEN_FLAGS.test(a));
  if (flag) return `Schalter ${flag} ist für Schreibvorgänge gedacht und hier gesperrt.`;
  return null;
}

// ---------------------------------------------------------------- Dateien

const DENY_PATH = /(^|\/)(\.git|node_modules|\.env[^/]*|client_secret[^/]*|models\.local\.json|\.claude\/settings[^/]*|[^/]*\.(key|pem))(\/|$)/i;

/** Löst einen Pfad relativ zur Wurzel auf; null, wenn er herausführt oder gesperrt ist. */
export function safePath(root, rel) {
  const s = String(rel ?? '');
  if (!s || s.includes('\0')) return null;
  const abs = resolve(root, s);
  const base = resolve(root);
  if (abs !== base && !abs.startsWith(base + sep)) return null;
  const relOut = abs.slice(base.length + 1);
  if (DENY_PATH.test(relOut)) return null;
  if (existsSync(abs)) {
    try { const real = realpathSync(abs); if (real !== base && !real.startsWith(realpathSync(base) + sep)) return null; } catch { return null; }
  }
  return abs;
}

// ---------------------------------------------------------------- Skills und Agenten

export function listSkills(root) {
  const dir = join(root, '.claude/skills');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((d) => existsSync(join(dir, d, 'SKILL.md')))
    .map((name) => {
      const text = readFileSync(join(dir, name, 'SKILL.md'), 'utf8');
      const desc = text.match(/^description:\s*(.+)$/m)?.[1] ?? '';
      return { name, description: desc.replace(/^["']|["']$/g, '').slice(0, 220) };
    });
}

/** SKILL.md oder eine Datei aus references/ bzw. assets/. */
export function loadSkill(root, name, reference) {
  const base = join(root, '.claude/skills', String(name ?? ''));
  if (!/^[a-z0-9-]+$/i.test(String(name ?? '')) || !existsSync(join(base, 'SKILL.md'))) return `Fehler: Skill „${name}“ gibt es nicht. list_skills zeigt die vorhandenen.`;
  if (!reference) {
    const refs = ['references', 'assets'].flatMap((d) => (existsSync(join(base, d)) ? readdirSync(join(base, d)).map((f) => `${d}/${f}`) : []));
    const text = readFileSync(join(base, 'SKILL.md'), 'utf8');
    return `${text.slice(0, MAX_FILE)}${text.length > MAX_FILE ? '\n[… gekürzt]' : ''}${refs.length ? `\n\n[Weitere Dateien, mit load_skill(name, reference) lesbar: ${refs.join(', ')}]` : ''}`;
  }
  const p = safePath(base, reference);
  if (!p || !existsSync(p) || !statSync(p).isFile()) return `Fehler: ${reference} gibt es in diesem Skill nicht.`;
  const text = readFileSync(p, 'utf8');
  return `${text.slice(0, MAX_FILE)}${text.length > MAX_FILE ? '\n[… gekürzt]' : ''}`;
}

/** Agentendefinition (.claude/agents/<name>.md): Frontmatter name, description, tools; Rest ist der Systemtext. */
export function parseAgentDef(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const fm = Object.fromEntries(m[1].split('\n').map((l) => { const i = l.indexOf(':'); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l, '']; }));
  return { name: fm.name, description: fm.description ?? '', tools: (fm.tools ?? '').split(',').map((t) => t.trim()).filter(Boolean), body: m[2].trim() };
}

export function listAgents(root) {
  return DELEGABLE.filter((n) => existsSync(join(root, '.claude/agents', `${n}.md`))).map((name) => {
    const def = parseAgentDef(readFileSync(join(root, '.claude/agents', `${name}.md`), 'utf8'));
    return { name, description: (def?.description ?? '').slice(0, 240), tools: def?.tools ?? [] };
  });
}

// ---------------------------------------------------------------- Werkzeugdefinitionen

export const KIT_TOOLS = {
  run_cli: {
    name: 'run_cli',
    description: 'Führt einen LESENDEN Befehl der Amélie-Bibliotheks-CLI aus. prog = "bib" (find, exists, vorflug, status, state, ledger, schema, grab list|show|stats|werte, protokoll show|stats, vector show, quellen match|formate) oder "quellen" (next, show, stats, check, match, formate, list). args = Liste, z. B. prog "bib", args ["grab","list","--cause","besetzt"]. Schreibbefehle sind gesperrt.',
    input_schema: { type: 'object', properties: { prog: { type: 'string', enum: ['bib', 'quellen'] }, args: { type: 'array', items: { type: 'string' } } }, required: ['prog', 'args'] },
  },
  read_file: {
    name: 'read_file',
    description: 'Liest eine Datei des Amélie-Repos (Pfad relativ zur Wurzel, z. B. 06-suche/amelie-suchplaybook.md). Gekürzt auf 24000 Zeichen; mit offset/limit ab einer Zeichenposition.',
    input_schema: { type: 'object', properties: { path: { type: 'string' }, offset: { type: 'number' } }, required: ['path'] },
  },
  search_repo: {
    name: 'search_repo',
    description: 'Durchsucht das Repo mit git grep (Text oder Regex, ohne Groß-/Kleinschreibung). Optional path = Unterverzeichnis. Höchstens 40 Treffer.',
    input_schema: { type: 'object', properties: { pattern: { type: 'string' }, path: { type: 'string' } }, required: ['pattern'] },
  },
  web_fetch: {
    name: 'web_fetch',
    description: 'Holt eine Webseite (http/https) als Text, gekürzt auf etwa 8000 Zeichen. Nur was du so geholt hast, darfst du mit [Seite] belegen, sonst [Schnipsel].',
    input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
  },
  list_skills: { name: 'list_skills', description: 'Listet die Skills des Projekts (Anleitungen unter .claude/skills) mit Kurzbeschreibung.', input_schema: { type: 'object', properties: {} } },
  load_skill: {
    name: 'load_skill',
    description: 'Lädt einen Skill als Text in deinen Kontext: SKILL.md, oder mit reference eine Datei aus references/ bzw. assets/. Lade einen Skill nur, wenn deine Aufgabe seine Methode braucht.',
    input_schema: { type: 'object', properties: { name: { type: 'string' }, reference: { type: 'string' } }, required: ['name'] },
  },
  list_agents: { name: 'list_agents', description: 'Listet die Amélie-Agenten, die du als Unter-Agent rufen darfst (nur lesend).', input_schema: { type: 'object', properties: {} } },
  call_agent: {
    name: 'call_agent',
    description: 'Ruft einen anderen Amélie-Agenten (ideen-scout, idea-reviewer, inversions-agent, bisoziations-kollider) mit einer klaren Aufgabe. Er läuft nur lesend und liefert seinen Bericht als Text zurück; Dateien schreibt er nicht. Teuer: nur rufen, wenn deine Prüfung ihn braucht. Pro Lauf sind wenige Aufrufe erlaubt.',
    input_schema: { type: 'object', properties: { agent: { type: 'string', enum: DELEGABLE }, task: { type: 'string', description: 'Die vollständige Aufgabe samt allem Kontext; der Agent kennt dein Gespräch nicht.' } }, required: ['agent', 'task'] },
  },
};

const AGENT_TOOL_MAP = {
  Read: ['read_file'], Grep: ['search_repo'], Glob: ['search_repo'], Bash: ['run_cli'], WebFetch: ['web_fetch'],
  WebSearch: [], // serverseitige Suche des Anbieters (nativeSearch), kein eigenes Werkzeug
};

/** Werkzeugnamen, die eine Agentendefinition bekommt (nie Edit/Write, nie call_agent). */
export function toolsForAgent(def) {
  const names = new Set(['list_skills', 'load_skill']);
  for (const t of def.tools) for (const n of AGENT_TOOL_MAP[t] ?? []) names.add(n);
  return [...names];
}

// ---------------------------------------------------------------- Handler

/**
 * createKit({ root, makeAdapter, depth, ledger, maxAgentCalls, maxAgentTurns, fetchFn, quellen })
 *  makeAdapter(role) → Adapter für Unter-Agenten (ohne: call_agent meldet, dass er nicht verfügbar ist)
 *  ledger: { agentCalls: [{ agent, usage, turns, toolLog }] }, wird gefüllt
 */
export function createKit({ root, makeAdapter, depth = 0, ledger = { agentCalls: [] }, maxAgentCalls = 3, maxAgentTurns = 14, fetchFn, quellen = [] } = {}) {
  const web = createWebHandlers({ quellen, ...(fetchFn ? { fetchFn } : {}) });
  const handlers = {
    async run_cli(args) {
      const prog = String(args?.prog ?? '');
      const list = args?.args;
      const why = cliDenied(prog, list);
      if (why) return `Fehler: ${why}`;
      const r = spawnSync('node', [CLI_SCRIPT[prog], ...list], { cwd: root, encoding: 'utf8', timeout: 90_000, maxBuffer: 16 * 1024 * 1024 });
      const out = `${r.stdout ?? ''}${r.stderr ? `\n${r.stderr}` : ''}`.trim();
      return `[Exit ${r.status}] ${out.slice(0, MAX_OUT)}${out.length > MAX_OUT ? '\n[… gekürzt]' : ''}`;
    },
    async read_file(args) {
      const p = safePath(root, args?.path);
      if (!p) return 'Fehler: Pfad nicht erlaubt (nur Dateien im Repo, ohne .git, node_modules und Zugangsdaten).';
      if (!existsSync(p) || !statSync(p).isFile()) return `Fehler: ${args.path} ist keine Datei.`;
      const text = readFileSync(p, 'utf8');
      const off = Math.max(0, Number(args?.offset) || 0);
      const part = text.slice(off, off + MAX_FILE);
      return `${part}${off + MAX_FILE < text.length ? `\n[… gekürzt, weiter mit offset ${off + MAX_FILE}]` : ''}`;
    },
    async search_repo(args) {
      const pattern = String(args?.pattern ?? '');
      if (!pattern) return 'Fehler: pattern fehlt.';
      const args2 = ['grep', '-n', '-I', '-i', '-E', '-m', '5', '-e', pattern];
      if (args?.path) { const p = safePath(root, args.path); if (!p) return 'Fehler: Pfad nicht erlaubt.'; args2.push('--', args.path); }
      const r = spawnSync('git', args2, { cwd: root, encoding: 'utf8', timeout: 30_000, maxBuffer: 16 * 1024 * 1024 });
      if (r.status === 1) return '(keine Treffer)';
      if (r.status !== 0) return `Fehler: ${String(r.stderr).trim().slice(0, 300)}`;
      const lines = r.stdout.split('\n').filter(Boolean).filter((l) => !DENY_PATH.test(l.split(':')[0]));
      return lines.slice(0, 40).map((l) => l.slice(0, 220)).join('\n') + (lines.length > 40 ? `\n[… ${lines.length - 40} weitere]` : '');
    },
    web_fetch: (a) => web.web_fetch(a),
    async list_skills() { return listSkills(root).map((s) => `${s.name}: ${s.description}`).join('\n') || '(keine)'; },
    async load_skill(a) { return loadSkill(root, a?.name, a?.reference); },
    async list_agents() { return listAgents(root).map((a) => `${a.name}: ${a.description}`).join('\n') || '(keine)'; },
    async call_agent(a) {
      if (depth > 0) return 'Fehler: Unter-Agenten dürfen keine weiteren Agenten rufen.';
      if (!makeAdapter) return 'Fehler: Unter-Agenten sind in diesem Lauf nicht verfügbar.';
      const name = String(a?.agent ?? '');
      if (!DELEGABLE.includes(name)) return `Fehler: „${name}“ ist kein erlaubter Unter-Agent (${DELEGABLE.join(', ')}).`;
      if (ledger.agentCalls.length >= maxAgentCalls) return `Fehler: Obergrenze von ${maxAgentCalls} Unter-Agenten je Lauf erreicht.`;
      const task = String(a?.task ?? '').trim();
      if (task.length < 20) return 'Fehler: task ist zu kurz; der Agent kennt dein Gespräch nicht.';
      const file = join(root, '.claude/agents', `${name}.md`);
      const def = existsSync(file) ? parseAgentDef(readFileSync(file, 'utf8')) : null;
      if (!def) return `Fehler: Definition von ${name} fehlt.`;
      const names = toolsForAgent(def);
      const sub = createKit({ root, makeAdapter, depth: depth + 1, ledger, fetchFn, quellen });
      const system = `${def.body}\n\n---\nBetriebsart: Du läufst als Unter-Agent einer Lab-PR-Prüfung im NUR-LESEN-Modus. Schreibrechte entfallen: Was du sonst in eine Datei schreiben würdest, gibst du als Text in deinem Bericht zurück. Du rufst keine weiteren Agenten. Skills kannst du mit load_skill laden (Skill-Pfade in deiner Anweisung entsprechen .claude/skills/<name>/SKILL.md). Halte den Bericht kurz.`;
      const r = await runConversation(await makeAdapter(name), {
        system, user: task, tools: names.map((n) => KIT_TOOLS[n]),
        handlers: Object.fromEntries(names.map((n) => [n, sub.handlers[n]])),
        nativeSearch: def.tools.includes('WebSearch'), maxTurns: maxAgentTurns, meta: { engine: name },
      });
      ledger.agentCalls.push({ agent: name, usage: r.usage, turns: r.turns, toolLog: r.toolLog, stop: r.stop });
      return `[Bericht von ${name}, ${r.turns} Runden, ${r.toolLog.length} Werkzeugaufrufe]\n${String(r.text || '(leer)').slice(0, 12000)}`;
    },
  };
  return { handlers, ledger };
}

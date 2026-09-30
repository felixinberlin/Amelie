import { describe, it, expect } from 'vitest';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DELEGABLE, cliDenied, createKit, listAgents, listSkills, loadSkill, parseAgentDef, safePath, toolsForAgent } from '../../scripts/agent-kit.mjs';
import { isTransient, librarianTools, runLabLibrarian, withRetry } from '../../scripts/lab-librarian-agent.mjs';

const ROOT = process.cwd();

describe('agent-kit: run_cli nur lesend', () => {
  it('erlaubt Lesebefehle', () => {
    expect(cliDenied('bib', ['find', 'walnuss'])).toBeNull();
    expect(cliDenied('bib', ['grab', 'list', '--cause', 'besetzt'])).toBeNull();
    expect(cliDenied('bib', ['protokoll', 'stats'])).toBeNull();
    expect(cliDenied('quellen', ['next', '--limit', '3'])).toBeNull();
  });
  it('sperrt Schreibbefehle, Schalter und fremde Programme', () => {
    for (const a of [['apply', 'x.json'], ['grab', 'add'], ['protokoll', 'add'], ['quellen', 'import'], ['abschluss'], ['vector', 'set'], ['find', 'x', '--dry-run'], ['--json'], []]) {
      expect(cliDenied('bib', a), JSON.stringify(a)).not.toBeNull();
    }
    expect(cliDenied('quellen', ['add'])).not.toBeNull();
    expect(cliDenied('quellen', ['log'])).not.toBeNull();
    expect(cliDenied('rm', ['-rf', '/'])).not.toBeNull();
    expect(cliDenied('bib', 'find' as unknown as string[])).not.toBeNull();
  });
});

describe('agent-kit: Dateien', () => {
  it('bleibt im Repo und meidet Gesperrtes', () => {
    expect(safePath(ROOT, '06-suche/amelie-suchplaybook.md')).toContain('suchplaybook');
    for (const bad of ['../etc/passwd', '/etc/passwd', '.git/config', 'node_modules/x', '.env', '.env.local', 'scripts/model-compare/models.local.json', 'a\0b', '']) {
      expect(safePath(ROOT, bad), bad).toBeNull();
    }
  });
  it('read_file und search_repo liefern Inhalt oder klare Fehler', async () => {
    const { handlers } = createKit({ root: ROOT });
    expect(await handlers.read_file({ path: 'package.json' })).toContain('"name"');
    expect(await handlers.read_file({ path: '../x' })).toContain('nicht erlaubt');
    expect(await handlers.search_repo({ pattern: 'Tag-0-Problem', path: '06-suche' })).toContain('suchplaybook');
    expect(await handlers.search_repo({ pattern: 'zzzzqqqq-nirgends' })).toContain('keine Treffer');
  });
  it('run_cli führt einen Lesebefehl aus und lehnt einen Schreibbefehl ab', async () => {
    const { handlers } = createKit({ root: ROOT });
    expect(await handlers.run_cli({ prog: 'quellen', args: ['formate'] })).toMatch(/^\[Exit 0\]/);
    expect(await handlers.run_cli({ prog: 'bib', args: ['grab', 'add'] })).toContain('Fehler');
  });
});

describe('agent-kit: Skills und Agenten des Projekts', () => {
  it('listet und lädt Skills', () => {
    const names = listSkills(ROOT).map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(['idea-reviewer', 'amelie-ideenrunde', 'asymmetric-inversion']));
    expect(loadSkill(ROOT, 'idea-reviewer')).toContain('Idea Reviewer');
    expect(loadSkill(ROOT, 'idea-reviewer')).toContain('references/');
    expect(loadSkill(ROOT, 'idea-reviewer', 'references/tech-tree-framework.md').length).toBeGreaterThan(200);
    expect(loadSkill(ROOT, '../etc')).toContain('Fehler');
    expect(loadSkill(ROOT, 'idea-reviewer', '../../../package.json')).toContain('Fehler');
  });
  it('kennt nur die erlaubten Unter-Agenten und nimmt ihnen Schreibrechte', () => {
    expect(listAgents(ROOT).map((a) => a.name).sort()).toEqual([...DELEGABLE].sort());
    expect(DELEGABLE).not.toContain('bibliothekar');
    expect(DELEGABLE).not.toContain('dose-packer');
    const def = parseAgentDef('---\nname: x\ndescription: d\ntools: Read, Grep, Edit, Write, Bash, WebFetch\n---\nKörper');
    expect(def?.body).toBe('Körper');
    const names = toolsForAgent(def!);
    expect(names).toEqual(expect.arrayContaining(['read_file', 'search_repo', 'run_cli', 'web_fetch', 'load_skill']));
    expect(names).not.toContain('call_agent');
    expect(names.join()).not.toMatch(/write|edit/i);
  });
  it('der Bibliothekar-Agent bekommt das Kit, ohne Delegation nur die Lesewerkzeuge', () => {
    const all = librarianTools().map((t: { name: string }) => t.name);
    expect(all).toEqual(expect.arrayContaining(['bib_find', 'read_proposal', 'run_cli', 'load_skill', 'call_agent', 'list_agents']));
    const noDel = librarianTools({ delegate: false }).map((t: { name: string }) => t.name);
    expect(noDel).toContain('load_skill');
    expect(noDel).not.toContain('call_agent');
    expect(all.join()).not.toMatch(/write|edit|apply|merge/i);
  });
});

/** Geskripteter Adapter: jede Antwort ist eine Funktion des Zustands. */
const scripted = (steps: ((turn: number, st: any) => any)[]) => ({
  name: 'skript',
  start: ({ system, user }: any) => ({ system, user, turn: 0, seen: [] as string[] }),
  async step(st: any) { const f = steps[Math.min(st.turn, steps.length - 1)]; st.turn++; return f(st.turn, st); },
  addToolResults(st: any, res: any[]) { for (const r of res) st.seen.push(`${r.name}:${r.content}`); },
});

describe('agent-kit: call_agent', () => {
  const task = 'Prüfe, ob der Survivor „Walnuss-Klopftest“ eine Nachprüfung übersteht, und berichte kurz.';
  it('läuft lesend, zählt mit und hält Obergrenze und Tiefe ein', async () => {
    let subSystem = '';
    let subTools: string[] = [];
    const sub = {
      name: 's',
      start: ({ system, tools }: any) => { subSystem = system; subTools = tools.map((t: any) => t.name); return { turn: 0 }; },
      async step() { return { text: 'Survivor hält: kein Treffer.', calls: [], usage: { in: 100, out: 40 }, stop: 'end_turn' }; },
      addToolResults() {},
    };
    const { handlers, ledger } = createKit({ root: ROOT, makeAdapter: async () => sub, maxAgentCalls: 2 });
    const out = await handlers.call_agent({ agent: 'ideen-scout', task });
    expect(out).toContain('Bericht von ideen-scout');
    expect(out).toContain('Survivor hält');
    expect(subSystem).toContain('NUR-LESEN-Modus');
    expect(subTools).toEqual(expect.arrayContaining(['read_file', 'run_cli', 'load_skill']));
    expect(subTools).not.toContain('call_agent');
    expect(ledger.agentCalls).toHaveLength(1);
    expect(await handlers.call_agent({ agent: 'dose-packer', task })).toContain('kein erlaubter');
    expect(await handlers.call_agent({ agent: 'ideen-scout', task: 'kurz' })).toContain('zu kurz');
    await handlers.call_agent({ agent: 'idea-reviewer', task });
    expect(await handlers.call_agent({ agent: 'inversions-agent', task })).toContain('Obergrenze');
    const deep = createKit({ root: ROOT, makeAdapter: async () => sub, depth: 1 });
    expect(await deep.handlers.call_agent({ agent: 'ideen-scout', task })).toContain('keine weiteren Agenten');
  });

  it('der Bibliothekar-Agent ruft einen Unter-Agenten und rechnet dessen Token mit', async () => {
    const wt = mkdtempSync(join(tmpdir(), 'lab-kit-'));
    mkdirSync(join(wt, '06-suche/proposals'), { recursive: true });
    const main = scripted([
      () => ({ text: '', calls: [{ id: '1', name: 'load_skill', args: { name: 'idea-reviewer' } }, { id: '2', name: 'call_agent', args: { agent: 'idea-reviewer', task: 'Bewerte den Survivor Walnuss-Klopftest nach der Rubrik und nenne nur die Summe.' } }], usage: { in: 10, out: 5 }, stop: 'tool_use' }),
      (_t: number, st: any) => ({ text: `Skill geladen: ${st.seen[0].includes('Idea Reviewer')}. Unter-Agent: ${st.seen[1].includes('Summe 20')}.\nEMPFEHLUNG: merge`, calls: [], usage: { in: 10, out: 5 }, stop: 'end_turn' }),
    ]);
    const sub = scripted([() => ({ text: 'Summe 20/35', calls: [], usage: { in: 100, out: 50 }, stop: 'end_turn' })]);
    const r = await runLabLibrarian(
      { root: ROOT, worktree: wt, pr: { number: 1, title: 't' }, files: [], results: [], manifest: null },
      { adapter: main, makeAdapter: async () => sub },
    );
    expect(r.text).toContain('Skill geladen: true. Unter-Agent: true.');
    expect(r.agentCalls).toHaveLength(1);
    expect(r.usage.subagent).toEqual({ in: 100, out: 50 });
    expect(r.usage.in).toBe(10 + 10 + 100);
    expect(r.toolLog.map((t: { name: string }) => t.name)).toEqual(['load_skill', 'call_agent']);
  });
});

describe('Wiederholung bei vorübergehenden Anbieterfehlern', () => {
  it('erkennt 429 und 503, nicht aber andere Fehler', () => {
    expect(isTransient(new Error('{"error":{"code":429,"status":"RESOURCE_EXHAUSTED"}}'))).toBe(true);
    expect(isTransient(new Error('503 UNAVAILABLE'))).toBe(true);
    expect(isTransient(new Error('fetch failed'))).toBe(true);
    expect(isTransient(Object.assign(new Error('x'), { cause: { code: 'ECONNRESET' } }))).toBe(true);
    expect(isTransient(new Error('Modell lehnte ab (refusal)'))).toBe(false);
    expect(isTransient(new Error('SDK fehlt'))).toBe(false);
  });
  it('wartet wachsend und gibt nach dem letzten Versuch auf', async () => {
    const waits: number[] = [];
    let calls = 0;
    const flaky = { name: 'f', start: () => ({}), addToolResults() {}, async step() { calls++; if (calls < 3) throw new Error('429 RESOURCE_EXHAUSTED'); return { text: 'ok', calls: [], usage: {}, stop: 'end_turn' }; } };
    const a = withRetry(flaky, { baseMs: 10, sleep: async (ms: number) => { waits.push(ms); } });
    expect((await a.step({})).text).toBe('ok');
    expect(waits).toEqual([10, 20]);
    const dead = { ...flaky, async step() { throw new Error('429'); } };
    await expect(withRetry(dead, { tries: 2, baseMs: 1, sleep: async () => {} }).step({})).rejects.toThrow('429');
    const fatal = { ...flaky, async step() { throw new Error('SDK fehlt'); } };
    let slept = 0;
    await expect(withRetry(fatal, { sleep: async () => { slept++; } }).step({})).rejects.toThrow('SDK fehlt');
    expect(slept).toBe(0);
  });
});

describe('Abschlussbericht, wenn der Agent keine Empfehlung liefert', () => {
  it('erzwingt nach der Rundengrenze einen Bericht ohne Werkzeuge', async () => {
    const wt = mkdtempSync(join(tmpdir(), 'lab-fin-'));
    mkdirSync(join(wt, '06-suche/proposals'), { recursive: true });
    const adapter = {
      name: 'endlos',
      start: ({ user }: any) => ({ final: String(user).includes('Werkzeuglauf ist beendet') }),
      async step(st: any) {
        if (st.final) return { text: 'Bericht aus dem Verlauf.\nEMPFEHLUNG: nicht mergen', calls: [], usage: { in: 5, out: 5 }, stop: 'end_turn' };
        return { text: '', calls: [{ id: 'x', name: 'list_proposals', args: {} }], usage: { in: 10, out: 10 }, stop: 'tool_use' };
      },
      addToolResults() {},
    };
    const r = await runLabLibrarian({ root: ROOT, worktree: wt, pr: { number: 1, title: 't' }, files: [], results: [], manifest: null, maxTurns: 2 }, { adapter });
    expect(r.text).toContain('EMPFEHLUNG: nicht mergen');
    expect(r.usage.in).toBe(10 + 10 + 5);
  });
});

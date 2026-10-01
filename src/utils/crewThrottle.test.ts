import { describe, it, expect } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { backoffMs, retryHint, sharedState, withThrottle } from '../../scripts/crew/throttle.mjs';
import { fixedAdapter, runAgent } from '../../scripts/crew/crew.mjs';
import { runConversation } from '../../scripts/model-compare/providers.mjs';

const clock = () => { let t = 1_000_000; return { now: () => t, sleep: async (ms: number) => { t += ms; }, advance: (ms: number) => { t += ms; } }; };
const e429 = (extra = '') => new Error(`{"error":{"code":429,"status":"RESOURCE_EXHAUSTED","message":"Resource exhausted ${extra}"}}`);

describe('Drossel gegen 429', () => {
  it('liest die Wartezeit des Anbieters', () => {
    expect(retryHint(new Error('Please retry in 12.5s'))).toBe(12500);
    expect(retryHint(new Error('"retryDelay":"30s"'))).toBe(30000);
    expect(retryHint(new Error('Retry-After: 7'))).toBe(7000);
    expect(retryHint(new Error('nichts'))).toBeNull();
  });

  it('Pause wächst, ist gedeckelt, hat Jitter und respektiert den Hinweis', () => {
    const r = () => 0.5;
    expect(backoffMs(1, e429(), { baseMs: 10_000, rand: r })).toBe(10_000);
    expect(backoffMs(3, e429(), { baseMs: 10_000, rand: r })).toBe(40_000);
    expect(backoffMs(9, e429(), { baseMs: 10_000, maxMs: 120_000, rand: r })).toBe(120_000);
    expect(backoffMs(1, e429(), { rand: () => 0 })).toBe(7500);
    expect(backoffMs(1, e429('retry in 60s'), { baseMs: 10_000, rand: r })).toBe(61_000);
  });

  it('mehrere Prozesse teilen Abstand und Abkühlzeit', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'rl-'));
    const c = clock();
    const a = sharedState({ key: 'm', dir, now: c.now, sleep: c.sleep });
    const b = sharedState({ key: 'm', dir, now: c.now, sleep: c.sleep }); // „anderer Prozess“, gleiche Datei
    expect(await a.claim(1500)).toBe(0);
    expect(await b.claim(1500)).toBe(1500);
    expect(await a.claim(1500)).toBe(3000);
    c.advance(10_000);
    expect(await b.claim(1500)).toBe(0);
    await a.cooldown(20_000);
    expect(await b.claim(1500)).toBe(20_000);
    await b.cooldown(5000); // verkürzt nie
    expect((await a.peek()).cooldownUntil).toBe(c.now() + 20_000);
  });

  it('wiederholt den Schritt, ohne den Gesprächsstand zu verlieren, und sperrt alle', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'rl-'));
    const c = clock();
    let calls = 0;
    const adapter = { start: () => ({}), async step() { calls++; if (calls < 3) throw e429(); return { text: 'fertig', calls: [], usage: { in: 1, out: 1 }, stop: 'end_turn' }; }, addToolResults() {} };
    const retries: number[] = [];
    const t = withThrottle(adapter, { key: 'x', dir, now: c.now, sleep: c.sleep, rand: () => 0.5, baseMs: 1000, gapMs: 100, onRetry: (_i: number, ms: number) => retries.push(ms) });
    const r = await t.step({});
    expect(r.text).toBe('fertig');
    expect(retries).toEqual([1000, 2000]);
    expect(calls).toBe(3);
    const other = sharedState({ key: 'x', dir, now: c.now, sleep: c.sleep });
    expect((await other.peek()).cooldownUntil).toBeGreaterThan(0);
  });

  it('gibt nach allen Versuchen und bei dauerhaften Fehlern auf', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'rl-'));
    const c = clock();
    const bad = { start: () => ({}), step: async () => { throw e429(); }, addToolResults() {} };
    await expect(withThrottle(bad, { key: 'y', dir, now: c.now, sleep: c.sleep, tries: 3, baseMs: 10, gapMs: 1 }).step({})).rejects.toThrow(/429|exhausted/i);
    let n = 0;
    const perm = { start: () => ({}), step: async () => { n++; throw new Error('400 Bad Request'); }, addToolResults() {} };
    await expect(withThrottle(perm, { key: 'z', dir, now: c.now, sleep: c.sleep, gapMs: 1 }).step({})).rejects.toThrow(/400/);
    expect(n).toBe(1);
  });
});

describe('Robustheit gegen schwache Modelle', () => {
  it('unbekanntes Werkzeug: Antwort nennt die vorhandenen', async () => {
    const calls = [{ id: '1', name: 'google:python_interpreter', args: {} }];
    let step = 0;
    const adapter = { start: () => ({}), async step() { return step++ === 0 ? { text: '', calls, usage: {} } : { text: 'ok', calls: [], usage: {} }; }, addToolResults() {} };
    const r = await runConversation(adapter, { system: 's', user: 'u', tools: [], handlers: { run_cli: async () => 'x', read_file: async () => 'y' } });
    expect(r.toolLog[0].result).toMatch(/NUR diese Werkzeuge.*run_cli, read_file/);
  });

  it('Werkzeugrunden verbraucht: Abschlussaufruf liefert Bericht und JSON', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'crew-runs-'));
    const json = '```json\n{"candidates":[],"gelernt":["g"],"naechstesMal":["n"]}\n```';
    let n = 0;
    const adapter = {
      start: () => ({}),
      async step() { n++; return n <= 2 ? { text: '', calls: [{ id: String(n), name: 'search_repo', args: { pattern: 'x' } }], usage: { in: 1, out: 1 } } : { text: `Abschluss\n\n${json}`, calls: [], usage: { in: 1, out: 1 }, stop: 'end_turn' }; },
      addToolResults() {},
    };
    const rec = await runAgent({ root: process.cwd(), agent: 'ideen-scout', thema: 'Test', adapter, spec: { id: 't', provider: 'mock' }, dir, maxTurns: 2 });
    expect(rec.status).toBe('ok');
    expect(rec.wrappedUp).toBe(true);
    const off = await runAgent({ root: process.cwd(), agent: 'ideen-scout', thema: 'Test', adapter: { ...adapter, step: async () => ({ text: '', calls: [{ id: '1', name: 'search_repo', args: { pattern: 'x' } }], usage: {} }) }, spec: { id: 't', provider: 'mock' }, dir, maxTurns: 2, wrapUp: false });
    expect(off.status).toBe('empty');
  });

  it('Leerraum-Müll wird entfernt, der Bericht bleibt gültig', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'crew-runs-'));
    const ok = fixedAdapter(() => `Bericht${' '.repeat(5000)}\n\n\n\n\n\n\n\nText\n\n${'```json\n{"candidates":[],"gelernt":[],"naechstesMal":[]}\n```'}`);
    const rec = await runAgent({ root: process.cwd(), agent: 'ideen-scout', thema: 'Test', adapter: ok, spec: { id: 't', provider: 'mock' }, dir });
    expect(rec.status).toBe('ok');
    expect(rec.report.length).toBeLessThan(300);
  });
});

import { downgradeCandidates, downgradeReviews, PROFILES } from '../../scripts/crew/profiles.mjs';

describe('Beweispflicht: das Programm stuft herab', () => {
  const cand = (o: any = {}) => ({ id: 'a-b', title: 'T', beschreibung: 'b', empfaenger: 'Amt X', urteil: 'verengt', beleg: 'x', evidenz: 'seite', restluecke: 'Lücke', ...o });
  it('Engine ohne Suchaufruf: frei/verengt wird unklar, besetzt bleibt', () => {
    const d = { candidates: [cand(), cand({ id: 'c-d', urteil: 'besetzt' }), cand({ id: 'e-f', urteil: 'frei' })] };
    const notes = downgradeCandidates(d, { toolLog: [{ name: 'read_file' }] });
    expect(d.candidates.map((c: any) => c.urteil)).toEqual(['unklar', 'besetzt', 'unklar']);
    expect(d.candidates[0].evidenz).toBe('schnipsel');
    expect(d.candidates[0].restluecke).toMatch(/ungeprüft/);
    expect(notes.length).toBe(3); // auch „besetzt“ mit Evidenz seite ohne web_fetch → schnipsel
  });
  it('seite braucht ein web_fetch, sonst schnipsel (und frei wird unklar)', () => {
    const d = { candidates: [cand({ urteil: 'frei' })] };
    downgradeCandidates(d, { toolLog: [{ name: 'web_search' }] });
    expect(d.candidates[0]).toMatchObject({ urteil: 'unklar', evidenz: 'schnipsel' });
    const ok = { candidates: [cand()] };
    expect(downgradeCandidates(ok, { toolLog: [{ name: 'web_search' }, { name: 'web_fetch' }] })).toEqual([]);
    expect(ok.candidates[0].evidenz).toBe('seite');
  });
  it('Reviewer: Dose Ready ohne Suche, ohne URL oder mit Platzhalter-Empfänger wird Needs Research', () => {
    const r = (o: any = {}) => ({ id: 'x-y', title: 'X', triage: 'Dose Ready', begruendung: 'gut', gegenSuche: 'siehe https://example.org/a', dose: { empfaenger: 'BAW Karlsruhe', ersterSchritt: 's' }, ...o });
    const none = { reviews: [r()] };
    expect(downgradeReviews(none, { toolLog: [{ name: 'web_search' }] })).toEqual([]);
    const bad = { reviews: [r(), r({ id: 'a-b', gegenSuche: 'ohne Link' }), r({ id: 'c-d', dose: { empfaenger: 'Felix', ersterSchritt: 's' } }), r({ id: 'e-f', triage: 'Needs Research' })] };
    const notes = downgradeReviews(bad, { toolLog: [] });
    expect(bad.reviews.map((x: any) => x.triage)).toEqual(['Needs Research', 'Needs Research', 'Needs Research', 'Needs Research']);
    expect(notes.length).toBe(3);
    expect(bad.reviews[2].herabgestuft.join()).toMatch(/Felix/);
    expect(bad.reviews[0].begruendung).toMatch(/herabgestuft/);
  });
  it('im Lauf: Datensatz meldet downgrades, Bibliothekar bekommt mehrere Reparaturrunden', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'crew-runs-'));
    const reply = `Bericht\n\n\`\`\`json\n${JSON.stringify({ candidates: [{ id: 'idee-eins', title: 'I', beschreibung: 'b', quelle: 'q', empfaenger: 'Amt', urteil: 'verengt', beleg: 'x', evidenz: 'seite', restluecke: 'L' }], gelernt: [], naechstesMal: [] })}\n\`\`\``;
    const rec = await runAgent({ root: process.cwd(), agent: 'ideen-scout', thema: 'T', adapter: fixedAdapter(reply), spec: { id: 't', provider: 'mock' }, dir });
    expect(rec.status).toBe('ok');
    expect(rec.data.candidates[0].urteil).toBe('unklar');
    expect(rec.downgrades.length).toBe(1);
    expect(rec.report).toMatch(/Vom Programm herabgestuft/);
    expect(PROFILES.bibliothekar.repairRounds).toBe(3);
  });
});

describe('Suchpflicht: Neustart ohne Suche', () => {
  it('startet einmal neu, wenn kein web_search lief, und zählt beide Läufe', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'crew-runs-'));
    const good = `Bericht\n\n\`\`\`json\n${JSON.stringify({ candidates: [], gelernt: [], naechstesMal: [] })}\n\`\`\``;
    let n = 0; const users: string[] = [];
    const adapter: any = {
      start: (a: any) => { users.push(a.user); return {}; },
      async step() { n++; return n === 2 ? { text: '', calls: [{ id: 's', name: 'web_search', args: { question: 'Test Frage hier' } }], usage: { in: 1, out: 1 } } : { text: good, calls: [], usage: { in: 1, out: 1 }, stop: 'end_turn' }; },
      addToolResults() {},
    };
    const rec = await runAgent({ root: process.cwd(), agent: 'ideen-scout', thema: 'T', adapter, spec: { id: 't', provider: 'mock' }, dir, enforce: true, kitOptions: { labDir: null, nativeSearch: false } });
    expect(rec.restarted).toBe(true);
    expect(users.length).toBe(2);
    expect(users[1]).toMatch(/^PFLICHT/);
    expect(rec.toolLog.some((t: any) => t.name === 'web_search')).toBe(true);
    const again = await runAgent({ root: process.cwd(), agent: 'ideen-scout', thema: 'T', adapter: fixedAdapter(good), spec: { id: 't', provider: 'mock' }, dir, enforce: false });
    expect(again.restarted).toBeUndefined();
  });
});

describe('Erzwungene Suche auf API-Ebene', () => {
  const run = (script: any[]) => {
    const forced: any[] = []; const users: string[] = []; let i = 0;
    const adapter: any = {
      start: () => ({}),
      async step(st: any) { forced.push(st.force ?? null); return script[Math.min(i++, script.length - 1)]; },
      addUser: (_st: any, t: string) => users.push(t),
      addToolResults() {},
    };
    return { adapter, forced, users };
  };
  const req = { names: ['web_search'], nudge: 'SUCHE JETZT', max: 2 };

  it('Antwort ohne Suche: Nutzerzeile und erzwungener Werkzeugaufruf im nächsten Schritt', async () => {
    const t2 = run([{ text: 'fertig ohne Suche', calls: [], usage: {} }, { text: '', calls: [{ id: '1', name: 'web_search', args: { question: 'x y z' } }], usage: {} }, { text: 'jetzt mit Suche', calls: [], usage: {} }]);
    const out = await runConversation(t2.adapter, { system: 's', user: 'u', tools: [], handlers: { web_search: async () => 'treffer' }, requireTool: req });
    expect(t2.users).toEqual(['SUCHE JETZT']);
    expect(t2.forced).toEqual([null, ['web_search'], null]);
    expect(out.text).toBe('jetzt mit Suche');
    expect(out.toolLog.map((x: any) => x.name)).toEqual(['web_search']);
  });

  it('gibt nach max Aufforderungen auf und lässt Läufe mit Suche in Ruhe', async () => {
    const stubborn = run([{ text: 'nein', calls: [], usage: {} }]);
    const out = await runConversation(stubborn.adapter, { system: 's', user: 'u', tools: [], handlers: { web_search: async () => 'x' }, requireTool: req });
    expect(stubborn.users.length).toBe(2);
    expect(out.text).toBe('nein');
    const fine = run([{ text: '', calls: [{ id: '1', name: 'web_search', args: {} }], usage: {} }, { text: 'ok', calls: [], usage: {} }]);
    await runConversation(fine.adapter, { system: 's', user: 'u', tools: [], handlers: { web_search: async () => 'x' }, requireTool: req });
    expect(fine.users).toEqual([]);
  });

  it('Gemini: toolConfig ANY nur im erzwungenen Schritt; Claude: tool_choice', async () => {
    const { createProvider } = await import('../../scripts/model-compare/providers.mjs');
    const seen: any[] = [];
    const client = { models: { generateContent: async (a: any) => { seen.push(a.config.toolConfig ?? null); return { candidates: [{ content: { role: 'model', parts: [{ text: 'x' }] }, finishReason: 'STOP' }], usageMetadata: {} }; } } };
    const g: any = await createProvider({ id: 'g', provider: 'gemini', model: 'm' }, { client });
    const st = g.start({ system: 's', user: 'u', tools: [{ name: 'web_search', description: 'd', input_schema: { type: 'object' } }] });
    await g.step(st); st.force = ['web_search']; await g.step(st);
    expect(seen).toEqual([null, { functionCallingConfig: { mode: 'ANY', allowedFunctionNames: ['web_search'] } }]);
    const reqs: any[] = [];
    const cclient = { messages: { create: async (a: any) => { reqs.push(a.tool_choice ?? null); return { content: [{ type: 'text', text: 'x' }], stop_reason: 'end_turn', usage: {} }; } } };
    const c: any = await createProvider({ id: 'c', provider: 'anthropic', model: 'm' }, { client: cclient });
    const cs = c.start({ system: 's', user: 'u', tools: [{ name: 'web_search', description: 'd', input_schema: { type: 'object' } }] });
    await c.step(cs); cs.force = ['web_search']; await c.step(cs);
    expect(reqs).toEqual([null, { type: 'tool', name: 'web_search' }]);
  });

  it('Reviewer: erfundene Suchmaschinen-Links sind keine Fundstelle', () => {
    const r = (g: string) => ({ reviews: [{ id: 'x-y', triage: 'Dose Ready', gegenSuche: g, dose: { empfaenger: 'BAW' }, begruendung: 'b' }] });
    const tl = [{ name: 'web_search' }];
    expect(downgradeReviews(r('https://www.google.com/search?q=fischabstieg+tool'), { toolLog: tl })[0]).toMatch(/Suchmaschinen-Links/);
    expect(downgradeReviews(r('siehe https://www.baw.de/de/forschung.html'), { toolLog: tl })).toEqual([]);
    expect(downgradeReviews(r('https://www.google.com/search?q=a und https://baw.de/x'), { toolLog: tl })).toEqual([]);
  });
});

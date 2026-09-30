import { describe, it, expect } from 'vitest';
import { mkdtempSync, existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  parseKandidaten, keyTokens, similar, priorArt, scoreRun, costOf, clusterKandidaten, konvergenz, ueberschneidung,
  parseJudge, judgeShare, judgeList, aggregateModel, renderReport,
} from '../../scripts/model-compare/lib.mjs';
import { createHandlers, htmlToText, TOOL_DEFS } from '../../scripts/model-compare/tools.mjs';
import { createProvider, runConversation, checkReady, mockReply, resolveEnv } from '../../scripts/model-compare/providers.mjs';
import { buildPrompts, warnliste } from '../../scripts/model-compare/prompts.mjs';
import { runAll, judgeRun, scoreRunDir } from '../../scripts/model-compare/runner.mjs';
import quellenJson from '../data/quellen.json';

const real = process.cwd();
const TABLE = `## Kandidaten

| Idee (Kurzname) | Beschreibung | Quelle (Typ) | Empfänger | Urteil (frei/verengt) | Beleg [Seite|Schnipsel] + URL | Restlücke |
|---|---|---|---|---|---|---|
| 1 \`pegel-wette\` | Gruppe tippt Pegel | B | Wetterturnier | **verengt** | [Seite] https://wetterturnier.de/history/ und [Schnipsel] https://x.example/a. | Persistenz |
| 2 **Boule-Messfoto** | Foto misst | B | DPV | \`frei\` | [Schnipsel] https://apps.example/boule | keine |
| 3 \`kader-zuverlaessigkeit\` | Binomial | B | KSA | besetzt | – | – |

## Gelernt
- x
`;

describe('Kandidatentabelle', () => {
  it('liest Id, Titel, Urteil, URLs und die Evidenzmarken', () => {
    const rows = parseKandidaten(TABLE);
    expect(rows.map((r) => [r.id, r.urteil, r.seite, r.schnipsel])).toEqual([['pegel-wette', 'verengt', 1, 1], [null, 'frei', 0, 1], ['kader-zuverlaessigkeit', 'besetzt', 0, 0]]);
    expect(rows[0].urls).toEqual(['https://wetterturnier.de/history/', 'https://x.example/a']);
    expect(rows[1].title).toBe('Boule-Messfoto');
  });
  it('ignoriert Tabellen ohne Idee/Urteil/Beleg und Text drumherum', () => {
    expect(parseKandidaten('| a | b |\n|---|---|\n| 1 | 2 |')).toEqual([]);
    expect(parseKandidaten('')).toEqual([]);
  });
  it('erkennt dieselbe Idee in anderem Kleid, aber nicht Nachbarn', () => {
    const a = { id: 'pegel-wette', title: 'Pegel-Wette' };
    expect(similar(a, { id: null, title: 'Wette auf Pegelstände (Pegel-Wette)' })).toBe(true);
    expect(similar(a, { id: 'pegel-wette', title: 'x' })).toBe(true);
    expect(similar(a, { id: 'wetter-liga', title: 'Wetterregel-Liga' })).toBe(false);
    expect(keyTokens({ id: 'pegel-wette', title: '' }).sort()).toEqual(['pegel', 'wette']);
  });
});

describe('Kennzahlen je Lauf', () => {
  const hit = (kind: string, bindend = true) => [{ kind, bindend, id: 'x', title: 't', where: 'w' }];
  const findFn = (terms: string[]) => (terms.includes('boule') ? hit('grab') : terms.includes('kader') ? hit('dose') : []);
  const q = quellenJson as any;
  const quellenCtx = { quellen: q.quellen, katalog: q.katalog, typen: q.typen.map((t: any) => t.id), doseIds: new Set(), graveIds: new Set() };
  const base = { text: TABLE + '\n**Quellenmeldung**\nQUELLE NEU: A | typ=D | kategorie=norm | enthaelt=x | note=ok\nQUELLE NEU: B | typ=Datensatz | kategorie=Forschung | enthaelt=x | note=falsch\n', toolLog: [] as any[], usage: { in: 10, out: 5, turns: 1 }, ms: 1000 };

  it('zählt Wiedergänger, ungedeckte [Seite] und die Formtreue der Quellenmeldung', () => {
    const s = scoreRun({ ...base }, { quellenCtx, findFn });
    expect(s.ok).toBe(true);
    expect(s.kandidaten.verdicts).toEqual({ frei: 1, verengt: 1, unklar: 0, besetzt: 1 });
    expect(s.vorwissen).toMatchObject({ bekannt: 2, begraben: 1, gepackt: 1, freiTrotzGrab: 1 });
    expect(s.evidenz).toMatchObject({ seite: 1, seiteUngedeckt: 1, freiOhneSeite: 1, pruefbar: true });
    expect(s.quellen).toMatchObject({ zeilen: 2, gueltig: 1, fehlerhaft: 1 });
    expect(s.form).toEqual({ kandidatenTabelle: true, gelernt: true, quellenmeldung: true });
  });
  it('eine wirklich geholte URL deckt [Seite]; bei nativer Suche ist es nicht prüfbar', () => {
    const geholt = scoreRun({ ...base, toolLog: [{ name: 'web_fetch', args: { url: 'https://www.wetterturnier.de/history' } }] }, { quellenCtx, findFn });
    expect(geholt.evidenz.seiteUngedeckt).toBe(0);
    const nativ = scoreRun({ ...base, nativeSearch: true }, { quellenCtx, findFn });
    expect(nativ.evidenz).toMatchObject({ seiteUngedeckt: null, pruefbar: false });
  });
  it('Fehlerlauf und leere Antwort sind nicht ok', () => {
    expect(scoreRun({ text: '', error: 'HTTP 500' }, { quellenCtx, findFn })).toMatchObject({ ok: false, error: 'HTTP 500' });
    expect(scoreRun({ text: 'Keine Tabelle' }, { quellenCtx, findFn }).ok).toBe(false);
  });
  it('priorArt sucht mit den längsten Wortteilen der Id', () => {
    let seen: string[] = [];
    priorArt({ id: 'kritische-masse-rechner', title: '' }, (t) => { seen = t; return []; });
    expect(seen[0]).toBe('kritische');
    expect(priorArt({ id: null, title: 'ab' }, () => [])).toMatchObject({ known: false });
  });
  it('Kosten nur mit Preisfeld', () => {
    expect(costOf({ in: 1e6, out: 1e6 }, { in: 4, out: 20 })).toBe(24);
    expect(costOf({ in: 1, out: 1 }, null)).toBeNull();
    expect(costOf({ in: 1, out: 1 }, { in: 4, out: null })).toBeNull();
  });
});

describe('Konvergenz, Richter, Bericht', () => {
  const R = (id: string | null, title: string) => ({ id, title, urteil: 'verengt', beleg: 'b' });
  const per = { a: [R('pegel-wette', 'Pegel-Wette'), R('x-eins', 'Nur Eins')], b: [R(null, 'Pegel-Wette Tipps'), R('y-zwei', 'Nur Zwei Sache')], c: [R('z-drei', 'Nur Drei Sache')] };
  const clusters = clusterKandidaten(per);
  it('gruppiert dieselbe Idee und misst Doppelfunde und Überschneidung', () => {
    expect(clusters).toHaveLength(4);
    expect(clusters[0].models.sort()).toEqual(['a', 'b']);
    expect(konvergenz(clusters, ['a', 'b', 'c'])).toEqual({ a: 0.5, b: 0.5, c: 0 });
    const o = ueberschneidung(clusters, ['a', 'b', 'c']);
    expect(o.a.b).toBe(0.5);
    expect(o.a.c).toBe(0);
  });
  it('liest die Richter-Antwort aus Codeblock oder Rohtext und normalisiert Urteile', () => {
    const fenced = 'Bitte:\n```json\n[{"n":1,"verdict":"Needs Research","reason":"a"},{"n":"C2","verdict":"dose-ready"},{"n":3,"verdict":"unsinn"}]\n```';
    expect(parseJudge(fenced)).toEqual([{ n: 1, verdict: 'needs_research', reason: 'a' }, { n: 2, verdict: 'dose_ready', reason: '' }]);
    expect(parseJudge('[{"n":1,"verdict":"friedhof"}]')[0].verdict).toBe('friedhof');
    expect(parseJudge('kein json')).toEqual([]);
    expect(parseJudge('[kaputt')).toEqual([]);
  });
  it('Richter-Anteile je Modell', () => {
    const j = judgeShare(clusters, [{ n: 1, verdict: 'needs_research' }, { n: 2, verdict: 'besetzt' }, { n: 3, verdict: 'friedhof' }, { n: 4, verdict: 'dose_ready' }], ['a', 'b', 'c']);
    expect(j.a).toMatchObject({ beurteilt: 2, nutzbar: 0.5, ausschuss: 0.5 });
    expect(j.c).toMatchObject({ beurteilt: 1, nutzbar: 1 });
    expect(judgeList(clusters)).toContain('C1: Pegel-Wette (pegel-wette)');
  });
  it('Bericht ist ohne Gesamtnote, hebt die Wiedergänger-Zeile hervor und nennt die Stichprobe', () => {
    const score = { ok: true, error: null, form: { kandidatenTabelle: true, gelernt: true, quellenmeldung: true }, quellen: { zeilen: 2, gueltig: 1 }, kandidaten: { n: 3, verdicts: { frei: 1, verengt: 1, unklar: 0, besetzt: 1 } }, vorwissen: { bekannt: 2, begraben: 1, freiTrotzGrab: 1 }, evidenz: { seite: 1, seiteUngedeckt: 1, freiOhneSeite: 1, pruefbar: true }, nutzung: { in: 100, out: 50, ms: 2000, werkzeugaufrufe: 3, fetches: 1 } };
    const agg = { m1: aggregateModel([score], { in: 4, out: 20 }) };
    const md = renderReport({ meta: { thema: 'T', runId: 'r', datum: '2026-09-29', engines: ['scout'], repeats: 1, search: 'none' }, models: [{ id: 'm1', provider: 'mock', model: 'x' }], agg, konv: { m1: 0.5 }, judge: null });
    expect(md).toContain('**als frei/verengt gemeldet, obwohl begraben**');
    expect(md).toContain('| **1** |');
    expect(md).toContain('$0.00');
    expect(md).not.toMatch(/Gesamtnote|Rang(liste|folge):/);
    expect(md).toContain('Stichprobe: 1 Engines');
  });
});

describe('Werkzeuge', () => {
  const html = (t: string) => ({ status: 200, text: t, type: 'text/html' });
  it('web_fetch holt Text, kürzt, zählt und lehnt interne Adressen und Nicht-http ab', async () => {
    const h = createHandlers({ quellen: [], fetchFn: async () => html('<html><script>x()</script><p>Hallo&nbsp;Welt</p>' + 'a'.repeat(9000) + '</html>'), maxFetch: 2 });
    const r = await h.web_fetch({ url: 'https://example.org/x' });
    expect(r).toMatch(/^\[Seite geholt\] https:\/\/example\.org\/x\nHallo Welt/);
    expect(r).toContain('[… gekürzt]');
    expect(await h.web_fetch({ url: 'http://localhost:8080' })).toMatch(/interne/);
    expect(await h.web_fetch({ url: 'http://192.168.1.5/' })).toMatch(/interne/);
    expect(await h.web_fetch({ url: 'file:///etc/passwd' })).toMatch(/nur http/);
    expect(await h.web_fetch({ url: 'kein url' })).toMatch(/keine gültige URL/);
    await h.web_fetch({ url: 'https://example.org/2' });
    expect(await h.web_fetch({ url: 'https://example.org/3' })).toMatch(/Limit von 2/);
  });
  it('web_fetch meldet Netzfehler als Text statt zu werfen', async () => {
    const h = createHandlers({ fetchFn: async () => { throw new Error('HTTP 503'); } });
    expect(await h.web_fetch({ url: 'https://example.org/' })).toMatch(/Fehler beim Holen.*HTTP 503/);
  });
  it('bib_find fasst zusammen und markiert „schon da“ mit *', async () => {
    const h = createHandlers({ quellen: (quellenJson as any).quellen });
    const r = await h.bib_find({ terms: ['strassennamen'] });
    expect(r).toMatch(/Treffer, \d+ davon „schon da“/);
    expect(r).toMatch(/\*/);
    expect(await h.bib_find({ terms: [] })).toMatch(/terms fehlt/);
  });
  it('htmlToText entfernt Skripte und Tags; Werkzeugdefinitionen sind anbieterneutral', () => {
    expect(htmlToText('<style>a{}</style><b>X</b> &amp; Y')).toBe('X & Y');
    expect(TOOL_DEFS.map((t) => t.name)).toEqual(['bib_find', 'web_fetch']);
    expect(TOOL_DEFS[0].input_schema.required).toEqual(['terms']);
  });
});

describe('Anbieter-Adapter (gegen nachgebaute SDK-Antworten)', () => {
  const handlers = { bib_find: async () => 'ok-find', web_fetch: async () => 'ok-fetch' };
  const spec = (p: string, extra = {}) => ({ id: 'm', provider: p, model: 'modell-x', ...extra });

  it('Claude: Werkzeugschleife, Thinking-Blöcke bleiben unverändert im Verlauf, Tokens werden summiert', async () => {
    const calls: any[] = [];
    const responses = [
      { content: [{ type: 'thinking', thinking: '', signature: 's' }, { type: 'tool_use', id: 't1', name: 'bib_find', input: { terms: ['a'] } }], stop_reason: 'tool_use', usage: { input_tokens: 10, output_tokens: 5 } },
      { content: [{ type: 'text', text: 'Fertig.' }], stop_reason: 'end_turn', usage: { input_tokens: 20, output_tokens: 7 } },
    ];
    const client = { messages: { create: async (req: any) => { calls.push(JSON.parse(JSON.stringify(req))); return responses[calls.length - 1]; } } };
    const a = await createProvider(spec('vertex-claude', { effort: 'high' }), { client });
    const r = await runConversation(a, { system: 'S', user: 'U', tools: TOOL_DEFS, handlers });
    expect(r.text).toBe('Fertig.');
    expect(r.usage).toMatchObject({ in: 30, out: 12, turns: 2 });
    expect(r.toolLog).toEqual([{ name: 'bib_find', args: { terms: ['a'] }, result: 'ok-find' }]);
    expect(calls[0]).toMatchObject({ model: 'modell-x', max_tokens: 16000, system: 'S', output_config: { effort: 'high' } });
    expect(calls[0].tools.map((t: any) => t.name)).toEqual(['bib_find', 'web_fetch']);
    const zweite = calls[1].messages;
    expect(zweite[1]).toEqual({ role: 'assistant', content: responses[0].content });
    expect(zweite[2]).toEqual({ role: 'user', content: [{ type: 'tool_result', tool_use_id: 't1', content: 'ok-find' }] });
  });
  it('Claude: native Suche wählt je Plattform die Werkzeugvariante; ohne Werkzeuge kein tools-Feld; pause_turn setzt fort; Ablehnung wirft', async () => {
    const seen: any[] = [];
    const mk = (resps: any[]) => ({ messages: { create: async (req: any) => { seen.push(req); return resps.shift(); } } });
    const txt = { content: [{ type: 'text', text: 'x' }], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1, server_tool_use: { web_search_requests: 2 } } };
    let r = await runConversation(await createProvider(spec('vertex-claude'), { client: mk([txt]) }), { system: 's', user: 'u', tools: [], handlers, nativeSearch: true });
    expect(seen[0].tools).toEqual([{ type: 'web_search_20250305', name: 'web_search' }]);
    expect(r.usage.searches).toBe(2);
    await runConversation(await createProvider(spec('anthropic'), { client: mk([txt]) }), { system: 's', user: 'u', tools: [], handlers, nativeSearch: true });
    expect(seen[1].tools[0].type).toBe('web_search_20260209');
    await runConversation(await createProvider(spec('anthropic'), { client: mk([txt]) }), { system: 's', user: 'u', tools: [], handlers });
    expect('tools' in seen[2]).toBe(false);
    r = await runConversation(await createProvider(spec('anthropic'), { client: mk([{ content: [{ type: 'text', text: 'teil' }], stop_reason: 'pause_turn', usage: {} }, { ...txt, content: [{ type: 'text', text: 'ganz' }] }]) }), { system: 's', user: 'u', tools: [], handlers });
    expect(r.text).toBe('ganz');
    expect(r.turns).toBe(2);
    await expect(runConversation(await createProvider(spec('anthropic'), { client: mk([{ content: [], stop_reason: 'refusal', stop_details: { category: 'cyber' }, usage: {} }]) }), { system: 's', user: 'u', tools: [], handlers })).rejects.toThrow(/refusal: cyber/);
  });
  it('Gemini: Funktionsaufruf → functionResponse (mit id), Denk-Tokens zählen als Ausgabe, Denkteile fallen aus dem Text', async () => {
    const calls: any[] = [];
    const responses = [
      { candidates: [{ content: { role: 'model', parts: [{ functionCall: { id: 'c1', name: 'web_fetch', args: { url: 'https://example.org' } } }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 3, thoughtsTokenCount: 4 } },
      { candidates: [{ content: { role: 'model', parts: [{ text: 'grübel', thought: true }, { text: 'Antwort.' }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 30, candidatesTokenCount: 6 } },
    ];
    const client = { models: { generateContent: async (req: any) => { calls.push(JSON.parse(JSON.stringify(req))); return responses[calls.length - 1]; } } };
    const r = await runConversation(await createProvider(spec('gemini', { temperature: 0.2 }), { client }), { system: 'S', user: 'U', tools: TOOL_DEFS, handlers });
    expect(r.text).toBe('Antwort.');
    expect(r.usage).toMatchObject({ in: 40, out: 13 });
    expect(calls[0].config).toMatchObject({ systemInstruction: 'S', maxOutputTokens: 16000, temperature: 0.2 });
    expect(calls[0].config.tools[0].functionDeclarations.map((d: any) => d.name)).toEqual(['bib_find', 'web_fetch']);
    expect(calls[0].config.tools[0].functionDeclarations[0].parametersJsonSchema.required).toEqual(['terms']);
    expect(calls[1].contents[2]).toEqual({ role: 'user', parts: [{ functionResponse: { id: 'c1', name: 'web_fetch', response: { output: 'ok-fetch' } } }] });
  });
  it('Gemini: native Suche nur mit googleSearch; ohne Werkzeuge kein tools-Feld; blockierte Anfrage wirft', async () => {
    const seen: any[] = [];
    const ok = { candidates: [{ content: { parts: [{ text: 'x' }] } }], usageMetadata: {} };
    const client = { models: { generateContent: async (req: any) => { seen.push(req); return seen.length < 3 ? ok : { promptFeedback: { blockReason: 'SAFETY' } }; } } };
    const a = await createProvider(spec('gemini'), { client });
    await runConversation(a, { system: 's', user: 'u', tools: TOOL_DEFS, handlers, nativeSearch: true });
    expect(seen[0].config.tools).toEqual([{ googleSearch: {} }]);
    await runConversation(a, { system: 's', user: 'u', tools: [], handlers });
    expect('tools' in seen[1].config).toBe(false);
    await expect(runConversation(a, { system: 's', user: 'u', tools: [], handlers })).rejects.toThrow(/blockiert/);
  });
  it('Schleife bricht nach maxTurns ab; unbekanntes Werkzeug und Handlerfehler werden als Ergebnis gemeldet', async () => {
    const loop = { content: [{ type: 'tool_use', id: 't', name: 'gibts-nicht', input: {} }, { type: 'tool_use', id: 'u', name: 'bib_find', input: {} }], stop_reason: 'tool_use', usage: { input_tokens: 1, output_tokens: 1 } };
    const client = { messages: { create: async () => loop } };
    const r = await runConversation(await createProvider(spec('anthropic'), { client }), { system: 's', user: 'u', tools: TOOL_DEFS, handlers: { bib_find: async () => { throw new Error('kaputt'); } }, maxTurns: 3 });
    expect(r.stop).toBe('max_turns');
    expect(r.turns).toBe(3);
    expect(r.toolLog[0].result).toMatch(/Unbekanntes Werkzeug/);
    expect(r.toolLog[1].result).toMatch(/Fehler: kaputt/);
  });
  it('Startklar-Prüfung nennt fehlende Modell-Id, Zugang und SDK; SDK-Fehler hat einen Installationshinweis', async () => {
    const noSdk = async () => { throw new Error('nope'); };
    const r = await checkReady(spec('gemini', { model: 'SET_ME', vertex: false }), { env: {}, loadSdk: noSdk });
    expect(r.ok).toBe(false);
    expect(r.problems.join(' | ')).toMatch(/model ist nicht gesetzt.*GEMINI_API_KEY.*npm i --no-save @google\/genai/);
    expect((await checkReady(spec('vertex-claude'), { env: {}, loadSdk: noSdk })).problems.join()).toMatch(/GCP-Projekt fehlt/);
    expect((await checkReady(spec('anthropic'), { env: { ANTHROPIC_API_KEY: 'k' }, loadSdk: async () => ({}) })).ok).toBe(true);
    expect((await checkReady({ id: 'x', provider: 'unbekannt', model: 'm' }, { env: {}, loadSdk: noSdk })).problems[0]).toMatch(/unbekannt/);
    await expect(createProvider(spec('gemini'), { loadSdk: noSdk, env: {} })).rejects.toThrow(/npm i --no-save @google\/genai/);
    expect(resolveEnv({ region: 'eu' }, { GOOGLE_CLOUD_PROJECT: 'p' })).toMatchObject({ project: 'p', region: 'eu' });
  });
});

describe('Prompts und Ablauf (Mock, ohne Netz)', () => {
  const quellen = quellenJson as any;
  it('System-Prompt enthält Agent, Skill, Betriebsart und gültige Werte der Quellenmeldung; Warnliste kennt das Gedächtnis', () => {
    const p = buildPrompts({ root: real, thema: 'Straßennamen', datum: '2026-09-29', engine: 'scout', quellen, search: 'none' });
    expect(p.system).toContain('Ideen-Scout');
    expect(p.system).toContain('Betriebsart: Modellvergleich');
    expect(p.system).toContain('`bib_find`');
    expect(p.system).toMatch(/kategorie: fachgremium/);
    expect(p.user).toContain('Thema: **Straßennamen**');
    expect(p.user).toMatch(/strassennamen/i);
    expect(buildPrompts({ root: real, thema: 'x', datum: 'd', engine: 'kollider', quellen, search: 'native' }).system).toContain('eingebaute Websuche');
    expect(() => buildPrompts({ root: real, thema: 'x', datum: 'd', engine: 'nix', quellen })).toThrow(/Unbekannte Engine/);
    expect(warnliste('qqqxyzzy', quellen, real)).toMatch(/keine Treffer/);
  });
  it('Mock-Antwort ist für die Auswertung lesbar und variiert je Modell', () => {
    expect(parseKandidaten(mockReply({ id: 'a' })).length).toBe(3);
    const ids = ['claude-opus', 'claude-sonnet', 'gemini', 'x', 'yy', 'zzz'].map((id) => mockReply({ id }));
    expect(new Set(ids).size).toBeGreaterThan(1);
  });
  it('Läufe → Richter → Auswertung: Dateien, Kennzahlen, Bericht', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'vergleich-'));
    const runsDir = join(tmp, 'runs');
    const berichteDir = join(tmp, 'berichte');
    const models = [
      { id: 'claude-opus', provider: 'vertex-claude', model: 'claude-opus-5-5', price: { in: 4, out: 20 } },
      { id: 'claude-sonnet', provider: 'vertex-claude', model: 'claude-sonnet-5-5', price: { in: 2, out: 10 } },
      { id: 'gemini', provider: 'gemini', model: 'x', price: null },
    ];
    const seen: string[] = [];
    const res = await runAll({ root: real, thema: 'Hochwasser Pegel', datum: '2026-09-29', models, mock: true, repeats: 2, runId: 't1', runsDir, onUnit: (u: any) => seen.push(`${u.model}/${u.engine}-${u.i}`) });
    expect(res.units).toBe(3 * 3 * 2);
    expect(seen).toHaveLength(18);
    expect(existsSync(join(runsDir, 't1', 'run.json'))).toBe(true);
    expect(existsSync(join(runsDir, 't1', 'gemini', 'inversion-2.md'))).toBe(true);
    const j = await judgeRun({ root: real, run: 't1', spec: models[0], mock: true, runsDir });
    expect(j.missing).toBe(0);
    const s = scoreRunDir({ root: real, run: 't1', runsDir, berichteDir });
    expect(s.agg['claude-opus'].laeufeOk).toBe(6);
    expect(s.agg['claude-opus'].kandidaten).toBe(18);
    expect(s.agg['claude-opus'].vorwissen.freiTrotzGrab).toBeGreaterThan(0); // Mock meldet boule-messfoto (begraben) als frei
    expect(s.agg['claude-sonnet'].vorwissen.freiTrotzGrab).toBe(0);
    expect(s.agg.gemini.kosten).toBeNull();
    expect(s.agg['claude-opus'].kosten).toBeCloseTo((6000 * 4 + 2400 * 20) / 1e6, 6);
    expect(s.judge['claude-opus'].beurteilt).toBeGreaterThan(0);
    expect(s.konvergenz['claude-opus']).toBeGreaterThan(0);
    const md = readFileSync(join(berichteDir, 't1.md'), 'utf8');
    expect(md).toContain('# Modellvergleich — Hochwasser Pegel');
    expect(md).toContain('Urteil des Richters (claude-opus)');
    expect(existsSync(join(runsDir, 't1', 'bericht.json'))).toBe(true);
  });
  it('Fehler eines Modells landen im Lauf und im Bericht, die anderen laufen weiter', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'vergleich-'));
    const runsDir = join(tmp, 'runs');
    const models = [{ id: 'ok', provider: 'mock', model: 'a' }, { id: 'kaputt', provider: 'anthropic', model: 'b' }];
    await runAll({ root: real, thema: 'T', datum: '2026-09-29', models, engines: ['scout'], runId: 'f1', runsDir }, { loadSdk: async () => { throw new Error('x'); } });
    const s = scoreRunDir({ root: real, run: 'f1', runsDir, berichteDir: join(tmp, 'b') });
    expect(s.agg.ok.laeufeOk).toBe(1);
    expect(s.agg.kaputt.laeufeOk).toBe(0);
    expect(s.agg.kaputt.fehler[0]).toMatch(/SDK fehlt/);
  });
});

describe('CLI', () => {
  // Immer die Beispielkonfiguration: eine lokale models.local.json (git-ignoriert) darf die Tests nicht verändern.
  const cli = (args: string[]) => spawnSync('node', ['scripts/model-compare.mjs', ...args, '--config', 'scripts/model-compare/models.example.json'], { encoding: 'utf8', cwd: real });
  it('dry-run zeigt die Prompts und ruft nichts auf; echte Läufe ohne Zugang oder ohne --yes brechen ab', () => {
    const d = cli(['run', '--thema', 'Testthema', '--dry-run']);
    expect(d.status, d.stderr).toBe(0);
    expect(d.stdout).toMatch(/Dry-run: 9 Läufe/);
    const bad = cli(['run', '--thema', 'Testthema', '--models', 'gemini']);
    expect(bad.status).toBe(1);
    expect(bad.stderr).toMatch(/Nicht startklar/);
    expect(cli(['run']).stderr).toMatch(/--thema/);
    expect(cli(['run', '--thema', 'x', '--models', 'gibts-nicht']).stderr).toMatch(/Unbekanntes Modell/);
    expect(cli(['run', '--thema', 'x', '--search', 'komisch', '--dry-run']).stderr).toMatch(/--search/);
  });
  it('models listet die Konfiguration', () => {
    const r = cli(['models']);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/claude-opus\s+vertex-claude\s+claude-opus-5-5/);
  });
});

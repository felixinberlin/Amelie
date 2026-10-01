import { describe, it, expect } from 'vitest';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkReport, extractJson, stripJson, validateCandidates } from '../../scripts/crew/contracts.mjs';
import { EXIT, fixedAdapter, runAgent, systemPrompt, loadDef } from '../../scripts/crew/crew.mjs';
import { CREW, PROFILES } from '../../scripts/crew/profiles.mjs';
import { listRuns, loadRun, newRunId } from '../../scripts/crew/runs.mjs';

const ROOT = process.cwd();
const tmpRuns = () => mkdtempSync(join(tmpdir(), 'crew-runs-'));

/** Modell, das eine feste Folge von Schritten abspielt (Werkzeugaufrufe, dann Text). */
function scripted(steps: any[]) {
  let i = 0;
  const seen: any[] = [];
  return {
    seen,
    name: 'scripted',
    start(a: any) { seen.push({ start: a }); return {}; },
    async step() { const s = steps[Math.min(i++, steps.length - 1)]; return { text: s.text ?? '', calls: s.calls ?? [], usage: { in: 100, out: 50 }, stop: s.calls?.length ? 'tool_use' : 'end_turn' }; },
    addToolResults(_st: any, res: any) { seen.push({ results: res }); },
  };
}

const goodCandidates = {
  candidates: [{ id: 'test-idee', title: 'Test-Idee', beschreibung: 'x', quelle: 'q', empfaenger: 'Amt', urteil: 'verengt', beleg: 'b https://e.org', evidenz: 'schnipsel', restluecke: 'Rest', urls: ['https://e.org'] }],
  gelernt: ['a'], naechstesMal: ['b'], quellenmeldung: ['QUELLE NEU: X | typ=L'],
};
const block = (o: unknown) => `Bericht\n\n\`\`\`json\n${JSON.stringify(o, null, 2)}\n\`\`\``;

describe('crew: Datenvertrag candidates', () => {
  it('liest den letzten json-Block und trennt den Bericht', () => {
    const t = `Text\n\`\`\`json\n{"a":1}\n\`\`\`\nmehr\n\`\`\`json\n{"a":2}\n\`\`\``;
    expect(extractJson(t).data).toEqual({ a: 2 });
    expect(extractJson('kein Block').error).toMatch(/Kein json-Block/);
    expect(extractJson('```json\n{kaputt}\n```').error).toMatch(/kein gültiges JSON/);
    expect(stripJson(block({ a: 1 }))).toBe('Bericht');
  });
  it('akzeptiert einen sauberen Bericht', () => {
    expect(validateCandidates(goodCandidates)).toEqual([]);
    expect(checkReport('candidates', block(goodCandidates)).ok).toBe(true);
  });
  it('findet Formfehler und Regelbrüche', () => {
    const bad = { candidates: [
      { ...goodCandidates.candidates[0], id: 'Mit Leerzeichen', urteil: 'super' },
      { ...goodCandidates.candidates[0], id: 'frei-ohne-seite', urteil: 'frei', evidenz: 'schnipsel' },
      { ...goodCandidates.candidates[0], id: 'verengt-ohne-rest', restluecke: '' },
      { ...goodCandidates.candidates[0], id: 'verengt-ohne-rest', restluecke: 'x' },
    ], quellenmeldung: ['keine Quelle'] };
    const e = validateCandidates(bad).join('\n');
    expect(e).toMatch(/candidates\[0\]\.id/);
    expect(e).toMatch(/urteil: „super“/);
    expect(e).toMatch(/„frei“ nur mit evidenz „seite“/);
    expect(e).toMatch(/restluecke: bei „verengt“ Pflicht/);
    expect(e).toMatch(/doppelte id verengt-ohne-rest/);
    expect(e).toMatch(/quellenmeldung\[0\]/);
    expect(validateCandidates([])).toEqual(['Wurzel: muss ein Objekt sein']);
  });
});

describe('crew: Lauf', () => {
  it('Systemtext enthält Definition, Betriebsart und Vertrag', () => {
    const s = systemPrompt(loadDef(ROOT, 'ideen-scout'), PROFILES['ideen-scout']);
    expect(s).toContain('Ideen-Scout');
    expect(s).toContain('Betriebsart: Kommandozeile');
    expect(s).toContain('"candidates"');
  });

  it('nutzt Werkzeuge, prüft den Vertrag und speichert den Lauf', async () => {
    const dir = tmpRuns();
    const adapter = scripted([
      { calls: [{ id: '1', name: 'run_cli', args: { prog: 'bib', args: ['status'] } }, { id: '2', name: 'run_cli', args: { prog: 'bib', args: ['grab', 'add'] } }] },
      { calls: [{ id: '3', name: 'load_skill', args: { name: 'amelie-ideenrunde' } }] },
      { text: block(goodCandidates) },
    ]);
    const r = await runAgent({ root: ROOT, agent: 'ideen-scout', thema: 'Test', adapter, spec: { id: 't', price: { in: 1, out: 2 } }, dir });
    expect(r.status).toBe('ok');
    expect(r.toolLog.map((t: any) => t.name)).toEqual(['run_cli', 'run_cli', 'load_skill']);
    expect(r.toolLog[0].result).toContain('[Exit 0]');
    expect(r.toolLog[1].result).toContain('nicht erlaubt'); // Schreibbefehl gesperrt
    expect(r.toolLog[2].result).toContain('name: amelie-ideenrunde');
    expect(r.summary).toBe('1 Ideen: 0 frei / 1 verengt / 0 unklar / 0 besetzt');
    expect(r.cost_usd).toBeCloseTo((300 * 1 + 150 * 2) / 1e6);
    expect(existsSync(r.files.json) && existsSync(r.files.md)).toBe(true);
    expect(JSON.parse(readFileSync(r.files.json, 'utf8')).data.candidates[0].id).toBe('test-idee');
    const tools = adapter.seen[0].start.tools.map((t: any) => t.name);
    expect(tools).toEqual(expect.arrayContaining(['read_file', 'search_repo', 'run_cli', 'web_fetch', 'load_skill']));
    expect(tools).not.toContain('call_agent');
  });

  it('repariert einen kaputten Block einmal ohne Werkzeuge', async () => {
    const dir = tmpRuns();
    const broken = { ...goodCandidates, candidates: [{ ...goodCandidates.candidates[0], urteil: 'neu' }] };
    const repairAdapter = scripted([{ text: block(goodCandidates) }]);
    const r = await runAgent({ root: ROOT, agent: 'ideen-scout', thema: 'T', adapter: fixedAdapter(`Langer Bericht.\n\n${block(broken)}`), repairAdapter, spec: { id: 't' }, dir });
    expect(r.status).toBe('ok');
    expect(r.repaired).toBe(true);
    expect(r.report).toContain('Langer Bericht.');
    expect(repairAdapter.seen[0].start.tools).toEqual([]);
    expect(repairAdapter.seen[0].start.user).toMatch(/urteil: „neu“/);
  });

  it('meldet gebrochene Verträge, leere Antworten und Modellfehler als unvollständig', async () => {
    const dir = tmpRuns();
    const r1 = await runAgent({ root: ROOT, agent: 'ideen-scout', thema: 'T', adapter: fixedAdapter('nur Text'), spec: { id: 't' }, dir, repair: false });
    expect(r1.status).toBe('contract_failed');
    const r2 = await runAgent({ root: ROOT, agent: 'ideen-scout', thema: 'T', adapter: fixedAdapter(''), spec: { id: 't' }, dir });
    expect(r2.status).toBe('empty');
    const boom = { start() { return {}; }, async step() { throw new Error('429 RESOURCE_EXHAUSTED'); }, addToolResults() {} };
    const r3 = await runAgent({ root: ROOT, agent: 'ideen-scout', thema: 'T', adapter: boom, spec: { id: 't' }, dir });
    expect(r3.status).toBe('error');
    expect(r3.errors[0]).toMatch(/429/);
    expect(listRuns(ROOT, { dir }).length).toBe(3);
  });

  it('verlangt einen Auftrag und kennt nur Crew-Agenten', async () => {
    await expect(runAgent({ root: ROOT, agent: 'ideen-scout', adapter: fixedAdapter('x'), dir: tmpRuns() })).rejects.toThrow(/--thema/);
    await expect(runAgent({ root: ROOT, agent: 'dose-packer', adapter: fixedAdapter('x'), dir: tmpRuns() })).rejects.toThrow(/kein Agent der Crew/);
  });

  it('jedes Profil liefert eine Mock-Antwort, die seinen Vertrag erfüllt', () => {
    for (const name of CREW) {
      const p = PROFILES[name];
      expect(checkReport(p.contract, p.mockReply({ inputs: [] })).errors, name).toEqual([]);
    }
  });
});

describe('crew: Laufdateien', () => {
  it('run_id ist sortierbar und eindeutig genug', () => {
    expect(newRunId('ideen-scout', new Date('2026-10-01T10:00:00Z'), () => 0.5)).toBe('ideen-scout-20261001T100000-7fffff');
  });
  it('lädt per run_id, Pfad und latest:<agent>', async () => {
    const dir = tmpRuns();
    const r = await runAgent({ root: ROOT, agent: 'ideen-scout', thema: 'T', adapter: fixedAdapter(block(goodCandidates)), spec: { id: 't' }, dir });
    expect(loadRun(ROOT, r.run_id, { dir }).run_id).toBe(r.run_id);
    expect(loadRun(ROOT, r.files.json, { dir }).run_id).toBe(r.run_id);
    expect(loadRun(ROOT, 'latest:ideen-scout', { dir }).run_id).toBe(r.run_id);
    expect(() => loadRun(ROOT, 'gibt-es-nicht', { dir })).toThrow(/nicht gefunden/);
  });
});

describe('crew: Kommandozeile', () => {
  const cli = (args: string[], dir: string) => spawnSync('node', ['scripts/agent-run.mjs', ...args, '--runs-dir', dir], { cwd: ROOT, encoding: 'utf8' });
  it('--mock läuft die ganze Kette, --json liefert den Datensatz', () => {
    const dir = tmpRuns();
    const r = cli(['ideen-scout', '--thema', 'Holz', '--mock', '--json'], dir);
    expect(r.status).toBe(EXIT.OK);
    const rec = JSON.parse(r.stdout);
    expect(rec.status).toBe('ok');
    expect(r.stderr).toContain(`run_id=${rec.run_id}`);
    const runs = cli(['runs', '--json'], dir);
    expect(JSON.parse(runs.stdout)[0].run_id).toBe(rec.run_id);
    expect(cli(['show', rec.run_id], dir).stdout).toContain('Mock-Idee A');
  });
  it('falscher Aufruf endet mit Exit 1', () => {
    const dir = tmpRuns();
    expect(cli(['gibt-es-nicht'], dir).status).toBe(EXIT.USAGE);
    expect(cli(['ideen-scout', '--mock'], dir).status).toBe(EXIT.USAGE);
    expect(cli(['ideen-scout', '--thema', 'x', '--mock', '--input', 'nirgends'], dir).status).toBe(EXIT.USAGE);
  });
});

// ---------------------------------------------------------------- idea-reviewer

import { validateReviews } from '../../scripts/crew/contracts.mjs';
import { applyWrites, renderLogSection } from '../../scripts/crew/write.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const review = (o: any = {}) => ({
  id: 'test-idee', title: 'Test-Idee', vectors: { V1: 3, V2: 3, V3: 3, V4: 3, V5: 3, V6: 3, V7: 3, V8: 2 }, kern: 21, gesamt: 23,
  triage: 'Friedhof', begruendung: 'b',
  grab: { cause: 'gebaut', killer: 'kommerziell', foundBy: 'deutsch', resurrectIfDe: 'x', resurrectIfEn: 'y' }, ...o,
});
const engineRun = (agent: string, cands: any[]) => ({ run_id: `${agent}-r`, agent, contract: 'candidates', status: 'ok', data: { candidates: cands } });
const cand = (id: string, urteil = 'verengt') => ({ ...goodCandidates.candidates[0], id, urteil });

describe('crew: idea-reviewer', () => {
  it('Vertrag rechnet Kern und Gesamt nach und kennt die Gates', async () => {
    const { loadGraveEnums } = await import('../../scripts/crew/contracts.mjs');
    await loadGraveEnums();
    expect(validateReviews({ reviews: [review()], lehren: [] })).toEqual([]);
    const e = validateReviews({ reviews: [
      review({ kern: 20 }),
      review({ id: 'zu-schwach', triage: 'Dose Ready' }),
      review({ id: 'ohne-schein', grab: { cause: 'erfunden' } }),
      review({ id: 'v8-zu-gross', vectors: { V1: 3, V2: 3, V3: 3, V4: 3, V5: 3, V6: 3, V7: 3, V8: 6 }, gesamt: 27 }),
      review({ id: 'baustein', triage: 'Baustein', grab: undefined }),
    ] }).join('\n');
    expect(e).toMatch(/kern: muss die Summe V1–V7 sein \(21\), nicht 20/);
    expect(e).toMatch(/„Dose Ready“ erst ab 24\/35/);
    expect(e).toMatch(/gegenSuche/);
    expect(e).toMatch(/grab\.cause: „erfunden“ ist nicht erlaubt/);
    expect(e).toMatch(/resurrectIfDe/);
    expect(e).toMatch(/V8: ganze Zahl 1–5/);
    expect(e).toMatch(/baustein: fehlt/);
    const ok = review({ id: 'dose', vectors: { V1: 4, V2: 4, V3: 4, V4: 3, V5: 3, V6: 3, V7: 3, V8: 2 }, kern: 24, gesamt: 26, triage: 'Dose Ready', gegenSuche: 'x https://e.org', dose: { empfaenger: 'Amt', ersterSchritt: 'Mail' }, grab: undefined });
    expect(validateReviews({ reviews: [ok] })).toEqual([]);
  });

  it('Auftrag aus Engine-Läufen: ohne besetzte, mit Doppelfunden', () => {
    const task = PROFILES['idea-reviewer'].buildTask({ inputs: [
      engineRun('ideen-scout', [cand('a'), cand('b', 'besetzt')]),
      engineRun('inversions-agent', [cand('a'), cand('c', 'unklar')]),
      { ...engineRun('bisoziations-kollider', [cand('d')]), status: 'contract_failed' },
    ] });
    expect(task).toMatch(/- a \(DOPPELFUND: ideen-scout \+ inversions-agent\)/);
    expect(task).toMatch(/- c:/);
    expect(task).not.toMatch(/- b:/);
    expect(task).not.toMatch(/- d:/); // kaputte Läufe zählen nicht
    expect(() => PROFILES['idea-reviewer'].buildTask({ inputs: [] })).toThrow(/--input/);
  });

  it('schreibt nur mit Freigabe, nur ins eigene Log, nur einmal', async () => {
    const root = mkdtempSync(join(tmpdir(), 'crew-root-'));
    mkdirSync(join(root, '06-suche'));
    writeFileSync(join(root, '06-suche/amelie-classification-log.md'), '# Log\n\n## Alt\n\nText\n');
    const record: any = { run_id: 'idea-reviewer-x', agent: 'idea-reviewer', status: 'ok', started: '2026-10-01T10:00:00Z', model: { id: 'm' }, inputs: ['ideen-scout-r'], thema: 'Holz', report: `# Kopf\n\nBefund.\n\n\`\`\`json\n{}\n\`\`\``, data: { reviews: [review()], lehren: [] }, writes: [] };
    const profile = PROFILES['idea-reviewer'];
    const dry = await applyWrites({ root, record, profile, dryRun: true });
    expect(dry[0].dryRun).toBe(true);
    expect(readFileSync(join(root, '06-suche/amelie-classification-log.md'), 'utf8')).not.toContain('Kommandozeile');
    await applyWrites({ root, record, profile });
    const log = readFileSync(join(root, '06-suche/amelie-classification-log.md'), 'utf8');
    expect(log).toContain('## Review „Holz“ per Kommandozeile (01.10.2026)');
    expect(log).toContain('| Test-Idee (`test-idee`) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | **21** | 2 | 23 | Friedhof |');
    expect(log).toContain('Befund.');
    expect(log).not.toContain('```json');
    expect(log.startsWith('# Log\n\n## Alt')).toBe(true);
    await expect(applyWrites({ root, record, profile })).rejects.toThrow(/schon geschrieben/);
    await expect(applyWrites({ root, record: { ...record, status: 'contract_failed', writes: [] }, profile })).rejects.toThrow(/nicht „ok“/);
    await expect(applyWrites({ root, record: { ...record, agent: 'ideen-scout', writes: [] }, profile: PROFILES['ideen-scout'] })).rejects.toThrow(/schreibt laut Definition nichts/);
  });

  it('Log-Abschnitt hebt Überschriften des Berichts unter den Kopf', () => {
    const s = renderLogSection({ record: { run_id: 'r', agent: 'a', started: '2026-10-01T00:00:00Z', model: { id: 'm' }, report: '# Titel\n\n## Teil\n\nx' }, title: 'T' });
    expect(s).toMatch(/^## T \(01\.10\.2026\)/);
    expect(s).toContain('### Teil');
    expect(s).not.toContain('# Titel');
  });

  it('Kette per CLI: Scout-Lauf als Eingang des Reviewers', () => {
    const dir = tmpRuns();
    const cli = (args: string[]) => spawnSync('node', ['scripts/agent-run.mjs', ...args, '--runs-dir', dir], { cwd: ROOT, encoding: 'utf8' });
    expect(cli(['ideen-scout', '--thema', 'Holz', '--mock']).status).toBe(0);
    const r = cli(['idea-reviewer', '--input', 'latest:ideen-scout', '--mock', '--json']);
    expect(r.status).toBe(0);
    const rec = JSON.parse(r.stdout);
    expect(rec.inputs[0]).toMatch(/^ideen-scout-/);
    expect(rec.data.reviews.map((x: any) => x.id)).toEqual(['mock-idee-a']);
    const w = cli(['write', rec.run_id, '--dry-run']);
    expect(w.status).toBe(0);
    expect(w.stdout).toContain('amelie-classification-log.md (Vorschau)');
  });
});

// ---------------------------------------------------------------- inversions-agent

describe('crew: inversions-agent', () => {
  it('Standardauftrag lädt die Inversions-Skill und verlangt Zielsystem + Operator', () => {
    const t = PROFILES['inversions-agent'].buildTask({ thema: 'Baumschutz' });
    expect(t).toContain('Thema: Baumschutz');
    expect(t).toContain('load_skill asymmetric-inversion');
    expect(t).toContain('Zielsystem + Operator');
    expect(() => PROFILES['inversions-agent'].buildTask({})).toThrow(/--thema/);
    expect(loadDef(ROOT, 'inversions-agent').body).toContain('asymmetric-inversion');
  });
  it('schreibt einen Lauf-Abschnitt mit Kandidatentabelle nur ins Inversionslog', async () => {
    const root = mkdtempSync(join(tmpdir(), 'crew-root-'));
    mkdirSync(join(root, '06-suche'));
    writeFileSync(join(root, '06-suche/amelie-inversions-log.md'), '# Inversionslog\n');
    const record: any = { run_id: 'inversions-agent-x', agent: 'inversions-agent', status: 'ok', started: '2026-10-01T10:00:00Z', model: { id: 'm' }, thema: 'Baumschutz', report: 'Bericht', data: { ...goodCandidates, candidates: [{ ...goodCandidates.candidates[0], beleg: 'a | b' }] }, writes: [] };
    await applyWrites({ root, record, profile: PROFILES['inversions-agent'] });
    const log = readFileSync(join(root, '06-suche/amelie-inversions-log.md'), 'utf8');
    expect(log).toContain('## Inversions-Lauf „Baumschutz“ per Kommandozeile (01.10.2026)');
    expect(log).toContain('| Test-Idee (`test-idee`) |');
    expect(log).toContain('a \\| b [Schnipsel]'); // Pipe im Beleg bricht die Tabelle nicht
    expect(PROFILES['inversions-agent'].writes.files).toEqual(['06-suche/amelie-inversions-log.md']);
  });
});

// ---------------------------------------------------------------- bisoziations-kollider

describe('crew: bisoziations-kollider', () => {
  it('Standardauftrag lädt die Lacunar-Skill und verlangt Rahmen A × B', () => {
    const t = PROFILES['bisoziations-kollider'].buildTask({ thema: 'Schmetterlinge' });
    expect(t).toContain('load_skill lacunar-bisociation');
    expect(t).toContain('Rahmen A × Rahmen B');
    expect(() => PROFILES['bisoziations-kollider'].buildTask({})).toThrow(/--thema/);
    expect(PROFILES['bisoziations-kollider'].writes.files).toEqual(['06-suche/amelie-bisoziation-log.md']);
  });
  it('drei Engines parallel, Reviewer sieht Doppelfunde (Mock-Kette)', async () => {
    const dir = tmpRuns();
    const runs = await Promise.all(['ideen-scout', 'inversions-agent', 'bisoziations-kollider'].map((agent) =>
      runAgent({ root: ROOT, agent, thema: 'T', adapter: fixedAdapter(block({ ...goodCandidates, candidates: [cand('gemeinsam'), cand(`${agent}-eigen`)] })), spec: { id: 't' }, dir })));
    expect(runs.every((r) => r.status === 'ok')).toBe(true);
    const task = PROFILES['idea-reviewer'].buildTask({ inputs: runs });
    expect(task).toContain('- gemeinsam (DOPPELFUND: ideen-scout + inversions-agent + bisoziations-kollider)');
    expect(task.match(/-eigen:/g)?.length).toBe(3);
  });
});

// ---------------------------------------------------------------- bibliothekar

import { validateLibrarian } from '../../scripts/crew/contracts.mjs';
import { buildPlan, dryRun, quellenOps } from '../../scripts/crew/librarian.mjs';
import { copyFileSync } from 'node:fs';
import { dirname } from 'node:path';

const PROTOKOLL_FIX = '# Prüfprotokoll\n\n## Alt — 29.09.2026\n\n| # | Idee | Methode | Urteil | Beleg | Evidenz | Geprüft | Prüfen ab |\n|---|---|---|---|---|---|---|---|\n| T1 | **Alt** | [method: x] | `besetzt` | b | [Seite] | 29.09.2026 | – |\n';

/** Mini-Repo wie in bibApply.test.ts: zwei echte Quellen, leerer Friedhof, Protokoll, Playbook, echte Typen und Rechte. */
function memFixture() {
  const root = mkdtempSync(join(tmpdir(), 'crew-mem-'));
  const put = (rel: string, text: string) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
  const q = JSON.parse(readFileSync(join(ROOT, 'src/data/quellen.json'), 'utf8'));
  q.quellen = q.quellen.slice(0, 2).map((x: any) => ({ ...x, urls: x.urls?.length ? x.urls : ['https://example.org/a'] }));
  put('src/data/quellen.json', JSON.stringify(q, null, 2) + '\n');
  put('src/data/graeber.json', '[]\n');
  put('src/data/doseVectors.json', '{}\n');
  put('src/data/candidateVectors.json', '{}\n');
  put('06-suche/amelie-pruefprotokoll.md', PROTOKOLL_FIX);
  put('06-suche/amelie-suchplaybook.md', '# Playbook\n');
  copyFileSync(join(ROOT, 'src/types.ts'), join(root, 'src/types.ts'));
  copyFileSync(join(ROOT, '06-suche/bib-actors.json'), join(root, '06-suche/bib-actors.json'));
  put('.claude/agents/bibliothekar.md', readFileSync(join(ROOT, '.claude/agents/bibliothekar.md'), 'utf8'));
  return { root, known: q.quellen[0].id as string };
}

const GRAVE = { id: 'crew-testgrab', title: 'Testgrab', originalIdeaDe: 'a', originalIdeaEn: 'a', whyDiscardedDe: 'b', whyDiscardedEn: 'b', lessonDe: 'c', lessonEn: 'c', domain: 'Test', evidence: ['https://e.org'], cause: 'gebaut', killer: 'kommerziell', foundBy: 'deutsch', origin: 'quelle', stage: 'kandidat', bornIn: 'Crew-Test', diedOn: '2026-10-01', resurrectIfDe: 'nie', resurrectIfEn: 'never' };
const libData = (o: any = {}) => ({
  runde: 'Crew-Testrunde 01.10.2026', einleitung: 'Test der Crew.',
  protokoll: [
    { titel: 'Testgrab', id: 'crew-testgrab', urteil: 'besetzt', beleg: 'Scout: gibt es https://e.org', evidenz: 'seite', method: 'ideenrunde', pruefenAb: '10/2027' },
    { titel: 'Zweite', id: 'crew-zweite', urteil: 'verengt', beleg: 'Kollider: halb', evidenz: 'schnipsel', method: 'bisoziation', pruefenAb: '10/2027' },
  ],
  graeber: [GRAVE],
  quellenmeldung: ['QUELLE NEU: Crew Testquelle | typ=L | kategorie=referenzsammlung | enthaelt=Test | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=Grab crew-testgrab | urls=https://e.org/q | note=Testmeldung.'],
  retro: { erledigt: ['Kette getestet.'], naechstesMal: ['Live-Lauf.'] },
  offen: ['foundBy für spanische Quellen'],
  ...o,
});

describe('crew: bibliothekar', () => {
  it('Vertrag: Form, Prüfdatum, leerer Plan', () => {
    expect(validateLibrarian(libData())).toEqual([]);
    const e = validateLibrarian({ runde: '', protokoll: [{ titel: 't', urteil: 'neu', beleg: 'b', evidenz: 'seite', method: 'm', pruefenAb: '2027' }] }).join('\n');
    expect(e).toMatch(/runde: fehlt/);
    expect(e).toMatch(/urteil: „neu“/);
    expect(e).toMatch(/pruefenAb: Format MM\/JJJJ/);
    expect(validateLibrarian({ runde: 'x', protokoll: [] }).join()).toMatch(/Plan ist leer/);
  });

  it('Plan: Protokoll zuerst (mit neuem Abschnitt), dann Gräber, dann Quellen mit Ertrag auf das neue Grab', () => {
    const { plan, fehler } = buildPlan(libData(), { root: ROOT, planId: 'p1' });
    expect(fehler).toEqual([]);
    expect(plan.actor).toBe('cli-bibliothekar');
    expect(plan.ops.map((o: any) => o.op)).toEqual(['protokoll.add', 'protokoll.add', 'grave.add', 'source.add']);
    expect(plan.ops[0].neuerAbschnitt).toBe('Test der Crew.');
    expect(plan.ops[1].neuerAbschnitt).toBeUndefined();
    expect(plan.ops[3]).toMatchObject({ id: 'crew-testquelle', typ: 'L', kategorie: 'referenzsammlung', grab: ['crew-testgrab'], urls: ['https://e.org/q'] });
    expect(quellenOps(['QUELLE NEU: X | typ=Q9 | kategorie=quatsch | enthaelt=x | note=n'], { root: ROOT }).fehler.join()).toMatch(/typ „Q9“ unbekannt/);
  });

  it('Trockenlauf gegen das Gedächtnis findet, was bib apply ablehnen würde', () => {
    const f = memFixture();
    expect(dryRun({ root: f.root, plan: buildPlan(libData(), { root: ROOT, planId: 'p2' }).plan }).errors).toEqual([]);
    const bad = buildPlan(libData({ graeber: [{ ...GRAVE, cause: 'tot' }] }), { root: ROOT, planId: 'p3' }).plan;
    expect(dryRun({ root: f.root, plan: bad }).errors.join()).toMatch(/VALUE_INVALID ops\[2\]\.grave/);
  });

  it('postValidate macht einen Plan, den bib apply ablehnt, zum Vertragsfehler (mit Reparaturversuch)', async () => {
    const f = memFixture();
    const dir = tmpRuns();
    const bad = libData({ graeber: [{ ...GRAVE, killer: 'niemand' }] });
    const repairAdapter = scripted([{ text: block(libData()) }]);
    const r = await runAgent({ root: f.root, agent: 'bibliothekar', task: 'Buche den Test.', adapter: fixedAdapter(`Bericht.\n\n${block(bad)}`), repairAdapter, spec: { id: 't' }, dir });
    expect(repairAdapter.seen[0].start.user).toMatch(/killer/);
    expect(r.status).toBe('ok');
    expect(r.data.graeber[0].killer).toBe('kommerziell');
  });

  it('plan_check meldet sauber oder Fehler, ohne zu schreiben', async () => {
    const f = memFixture();
    const before = readFileSync(join(f.root, 'src/data/graeber.json'), 'utf8');
    const h = PROFILES.bibliothekar.handlers({ root: f.root });
    expect(await h.plan_check({ draft: libData() })).toMatch(/Trockenlauf sauber: 4 Operationen \(2 protokoll\.add, 1 grave\.add, 1 source\.add\)/);
    expect(await h.plan_check({ draft: libData({ graeber: [{ ...GRAVE, foundBy: 'zufall' }] }) })).toMatch(/Trockenlauf abgelehnt/);
    expect(await h.plan_check({ draft: { runde: 'x' } })).toMatch(/Formfehler/);
    expect(readFileSync(join(f.root, 'src/data/graeber.json'), 'utf8')).toBe(before);
  });

  it('--write bucht alles über bib apply und hängt die Retro ans Playbook, einmal', async () => {
    const f = memFixture();
    const dir = tmpRuns();
    const r = await runAgent({ root: f.root, agent: 'bibliothekar', task: 'Buche den Test.', thema: 'Crew', adapter: fixedAdapter(block(libData())), spec: { id: 't', provider: 'gemini' }, dir });
    expect(r.status).toBe('ok');
    const done = await applyWrites({ root: f.root, record: r, profile: PROFILES.bibliothekar });
    expect(done.map((w: any) => w.kind)).toEqual(['bib-apply', 'append']);
    expect(JSON.parse(readFileSync(join(f.root, 'src/data/graeber.json'), 'utf8')).map((g: any) => g.id)).toEqual(['crew-testgrab']);
    expect(readFileSync(join(f.root, '06-suche/amelie-pruefprotokoll.md'), 'utf8')).toMatch(/## Crew-Testrunde 01\.10\.2026[\s\S]*Test der Crew\.[\s\S]*\*\*Zweite\*\*/);
    expect(JSON.parse(readFileSync(join(f.root, 'src/data/quellen.json'), 'utf8')).quellen.some((q: any) => q.id === 'crew-testquelle')).toBe(true);
    const pb = readFileSync(join(f.root, '06-suche/amelie-suchplaybook.md'), 'utf8');
    expect(pb).toContain('## Retro Crew-Testrunde 01.10.2026');
    expect(pb).toContain('- Live-Lauf.');
    expect(pb).toContain('**Offen (Entscheidung Félix)**');
    expect(JSON.parse(readFileSync(join(f.root, '06-suche/bib-ledger.json'), 'utf8')).applied[`crew-${r.run_id}`].actor).toBe('cli-bibliothekar');
    await expect(applyWrites({ root: f.root, record: r, profile: PROFILES.bibliothekar })).rejects.toThrow(/schon geschrieben/);
  });

  it('Mock-Läufe schreiben nie ins Gedächtnis', async () => {
    const f = memFixture();
    const r = await runAgent({ root: f.root, agent: 'bibliothekar', task: 'Buche den Test.', adapter: fixedAdapter(block(libData())), spec: { id: 'mock', provider: 'mock' }, dir: tmpRuns() });
    await expect(applyWrites({ root: f.root, record: r, profile: PROFILES.bibliothekar })).rejects.toThrow(/Mock-Läufe schreiben nicht/);
    expect((await applyWrites({ root: f.root, record: r, profile: PROFILES.bibliothekar, dryRun: true }))[0].dryRun).toBe(true);
  });

  it('Auftrag nennt Reviews, Doppelfunde und Quellenmeldungen der Engines', () => {
    const t = PROFILES.bibliothekar.buildTask({ thema: 'Holz', inputs: [
      { ...engineRun('ideen-scout', [cand('a'), cand('b', 'besetzt')]), data: { candidates: [cand('a'), cand('b', 'besetzt')], quellenmeldung: ['QUELLE NEU: Q1 | typ=L'], gelernt: ['g1'] } },
      engineRun('inversions-agent', [cand('a')]),
      { run_id: 'rev', agent: 'idea-reviewer', contract: 'reviews', status: 'ok', data: { reviews: [review({ id: 'a' })], lehren: ['l1'] } },
    ] });
    expect(t).toMatch(/- a \[ideen-scout \+ inversions-agent, DOPPELFUND\]/);
    expect(t).toMatch(/REVIEW: \{"kern":21,"gesamt":23,"triage":"Friedhof"/);
    expect(t).toContain('- QUELLE NEU: Q1 | typ=L');
    expect(t).toContain('- g1');
    expect(t).toContain('- l1');
    expect(t).toContain('Teamrunde Holz');
    expect(() => PROFILES.bibliothekar.buildTask({ inputs: [] })).toThrow(/--input/);
  });
});

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createLibrarianHandlers, pickModel, runLabLibrarian } from '../../scripts/lab-librarian-agent.mjs';
import { assess, buildComment, checkPr, checkScope, decide, parseNameStatus, parseRecommendation } from '../../scripts/lab-review-lib.mjs';

describe('lab-review Regeln', () => {
  it('Umfang: nur neue Dateien in 06-suche/proposals/', () => {
    const ok = parseNameStatus('A\t06-suche/proposals/a.md\nA\t06-suche/proposals/a.manifest.json\n');
    expect(checkScope(ok)).toEqual([]);
    expect(checkScope(parseNameStatus('M\t06-suche/proposals/a.md')).join()).toContain('create-only');
    expect(checkScope(parseNameStatus('A\tsrc/data/quellen.json')).join()).toContain('außerhalb');
    expect(checkScope(parseNameStatus('A\tscripts/bibliothek.mjs'))).toHaveLength(1);
    expect(checkScope([])).toHaveLength(1);
  });

  it('Umbenennung zählt mit dem neuen Pfad', () => {
    expect(parseNameStatus('R100\told.md\t06-suche/proposals/new.md')[0]).toEqual({ status: 'R', path: '06-suche/proposals/new.md' });
  });

  it('nur offene PRs mit Branch lab/*', () => {
    expect(checkPr({ number: 1, state: 'OPEN', headRefName: 'lab/round-x' })).toEqual([]);
    expect(checkPr({ number: 2, state: 'MERGED', headRefName: 'lab/round-x' })).toHaveLength(1);
    expect(checkPr({ number: 3, state: 'OPEN', headRefName: 'claude/foo' })).toHaveLength(1);
  });

  it('liest die letzte Empfehlungszeile, sonst null', () => {
    expect(parseRecommendation('Befund\nEMPFEHLUNG: merge')).toBe('merge');
    expect(parseRecommendation('x\nEMPFEHLUNG: nicht mergen\n')).toBe('nicht mergen');
    expect(parseRecommendation('ich empfehle zu mergen')).toBeNull();
  });

  it('Entscheidung: Merge gewinnt, Befund lehnt ab, sonst offen', () => {
    expect(decide({ blockers: [], merged: true })).toBe('gemergt');
    expect(decide({ blockers: ['lint'], merged: false })).toBe('abgelehnt');
    expect(decide({ blockers: [], merged: false })).toBeNull();
  });

  it('ein ausgefallener Agent lehnt nie ab und sperrt nur den Merge', () => {
    const ok = [{ name: 'lint', ok: true }, { name: 'test', ok: true }];
    const down = [...ok, { name: 'Bibliothekar-Agent', ok: false, note: 'nicht gelaufen', tool: true }];
    const a = assess({ results: down, recommendation: null });
    expect(a.blockers).toEqual([]);
    expect(a.incomplete).toHaveLength(1);
    expect(a.mergeReady).toBe(false);
    expect(decide({ blockers: a.blockers, merged: false })).toBeNull(); // → nichts wird gepostet
  });

  it('Sachbefunde lehnen ab, „nicht mergen“ auch, nur Grün plus „merge“ ist mergebar', () => {
    const ok = [{ name: 'lint', ok: true }];
    expect(assess({ results: [{ name: 'Umfang', ok: false, note: 'x' }] }).blockers).toEqual(['Umfang: x']);
    expect(assess({ results: ok, recommendation: 'nicht mergen' }).blockers).toHaveLength(1);
    expect(assess({ results: ok, recommendation: 'merge' }).mergeReady).toBe(true);
    expect(assess({ results: ok, recommendation: null }).mergeReady).toBe(false);
    expect(assess({ results: ok, noAgent: true }).mergeReady).toBe(true);
  });

  it('Kommentar beginnt mit der festen Kopfzeile und enthält die Empfehlungszeile nicht', () => {
    const c = buildComment({ decision: 'gemergt', existenzCheck: false, findings: ['✓ lint'], agentText: 'Alles sauber.\nEMPFEHLUNG: merge' });
    expect(c.split('\n').slice(0, 3)).toEqual(['Entscheidung: gemergt', 'Existenzprüfung: offen', 'Gebuchte Quellen: keine']);
    expect(c).toContain('- ✓ lint');
    expect(c).not.toContain('EMPFEHLUNG');
    expect(buildComment({ decision: 'abgelehnt', existenzCheck: true, sources: ['a', 'b'] })).toContain('Existenzprüfung: erfolgt\nGebuchte Quellen: a, b');
  });
});

describe('npm run lab', () => {
  const run = (...args: string[]) => spawnSync('node', ['scripts/lab-review.mjs', ...args], { encoding: 'utf8' });
  it('zeigt die Hilfe und lehnt unbekannte Befehle und fehlende PR-Nummern ab', () => {
    expect(run('hilfe').stdout).toContain('review <pr>');
    expect(run('nix').status).toBe(1);
    expect(run('review').stderr).toContain('PR-Nummer');
  });
});

describe('Bibliothekar als eigenständiger Agent', () => {
  const setup = () => {
    const wt = mkdtempSync(join(tmpdir(), 'lab-agent-'));
    mkdirSync(join(wt, '06-suche/proposals'), { recursive: true });
    writeFileSync(join(wt, '06-suche/proposals/a.md'), '# Vorschlag\nIdee Walnuss-Klopftest');
    writeFileSync(join(wt, 'geheim.txt'), 'nicht lesen');
    return wt;
  };
  const opts = (wt: string) => ({
    root: process.cwd(), worktree: wt,
    pr: { number: 9, title: 'Test' }, files: [{ status: 'A', path: '06-suche/proposals/a.md' }],
    results: [{ name: 'lint', ok: true, note: '' }], manifest: null,
  });

  it('die Werkzeuge lesen nur unter proposals/ und schreiben nichts', async () => {
    const h = createLibrarianHandlers({ root: process.cwd(), proposalsDir: join(setup(), '06-suche/proposals') });
    expect(await h.list_proposals()).toBe('a.md');
    expect(await h.read_proposal({ name: 'a.md' })).toContain('Walnuss');
    expect(await h.read_proposal({ name: '../../geheim.txt' })).toContain('Fehler');
    expect(await h.read_proposal({ name: '/etc/passwd' })).toContain('Fehler');
    expect(await h.read_proposal({ name: 'fehlt.md' })).toContain('nicht gefunden');
    expect(Object.keys(h).sort()).toEqual(['bib_find', 'list_proposals', 'quellen_match', 'read_proposal']);
    expect(await h.quellen_match({ url: 'kein url' })).toContain('Fehler');
    expect(await h.bib_find({ terms: [] })).toContain('Fehler');
    // echte Daten: das Werkzeug muss durchlaufen (früher: „quellen is not iterable“)
    expect(await h.bib_find({ terms: ['pillsafe'] })).toMatch(/^\d+ Treffer/);
    expect(await h.bib_find({ terms: ['geräusch'], stamm: true })).toMatch(/^\d+ Treffer/);
  });

  it('die Schleife ruft Werkzeuge und liefert Bericht mit Empfehlung', async () => {
    const seen: string[] = [];
    let turn = 0;
    const adapter = {
      name: 'skript',
      start: () => ({}),
      async step() {
        turn++;
        if (turn === 1) return { text: '', calls: [{ id: '1', name: 'list_proposals', args: {} }, { id: '2', name: 'read_proposal', args: { name: 'a.md' } }], usage: { in: 10, out: 5 }, stop: 'tool_use' };
        return { text: 'Keine Doppelfunde.\nEMPFEHLUNG: merge', calls: [], usage: { in: 10, out: 5 }, stop: 'end_turn' };
      },
      addToolResults(_st: unknown, res: { name: string; content: string }[]) { for (const r of res) seen.push(`${r.name}:${r.content.slice(0, 12)}`); },
    };
    const wt = setup();
    const r = await runLabLibrarian(opts(wt), { adapter });
    expect(seen).toEqual(['list_proposals:a.md', 'read_proposal:# Vorschlag\n']);
    expect(r.toolLog.map((t: { name: string }) => t.name)).toEqual(['list_proposals', 'read_proposal']);
    expect(parseRecommendation(r.text)).toBe('merge');
    expect(r.usage.turns).toBe(2);
  });

  it('wählt das Modell aus der Konfiguration und sagt klar, wenn es fehlt', () => {
    const cfg = { file: 'x.json', judge: 'b', models: [{ id: 'a', provider: 'mock' }, { id: 'b', provider: 'mock' }] };
    expect(pickModel(cfg, undefined).id).toBe('b');
    expect(pickModel({ ...cfg, librarian: 'a' }, undefined).id).toBe('a');
    expect(pickModel(cfg, 'a').id).toBe('a');
    expect(() => pickModel(cfg, 'zz')).toThrow(/zz.*x\.json/);
  });
});

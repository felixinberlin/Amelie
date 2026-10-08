import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { applyBundle, insertInto, ROLES, validateBundle } from '../../scripts/crew/bundle.mjs';
import { fixedAdapter, runAgent } from '../../scripts/crew/crew.mjs';
import { CREW, PROFILES } from '../../scripts/crew/profiles.mjs';

const ROOT = process.cwd();

/** Kleines git-Repo mit den Zieldateien der Rollen. */
function fixture(branch = 'main') {
  const root = mkdtempSync(join(tmpdir(), 'crew-bundle-'));
  const sh = (...a: string[]) => spawnSync('git', a, { cwd: root, encoding: 'utf8' });
  sh('init', '-q', '-b', branch);
  sh('config', 'user.email', 'a@b.c'); sh('config', 'user.name', 'x');
  for (const d of ['src/data', '05-dosen', 'en/05-dosen', '07-demos', 'ventures/opportunities']) mkdirSync(join(root, d), { recursive: true });
  writeFileSync(join(root, 'src/data/dosen.ts'), "export const DOSEN_DATA: DoseItem[] = [\n  {\n    id: 'alt',\n    title: 'Alt',\n  }\n];\n");
  writeFileSync(join(root, 'src/data/doseVectors.json'), '{\n  "alt": {\n    "v": [3]\n  }\n}\n');
  writeFileSync(join(root, 'src/data/doseBooks.ts'), "export const DOSE_BOOKS: Record<string, unknown[]> = {\n  'alt': [\n    {},\n  ],\n};\n");
  writeFileSync(join(root, '07-demos/README.md'), '| Tin | What |\n|---|---|\n| `alt` | x |\n');
  writeFileSync(join(root, 'ventures/market-leads.json'), '[\n  { "id": "alt" }\n]\n');
  sh('add', '-A'); sh('commit', '-qm', 'init');
  return root;
}

const mockData = (agent: string) => JSON.parse(PROFILES[agent].mockReply().match(/```json\n([\s\S]*?)\n```/)![1]);

describe('Paketvertrag der Bauer-Rollen', () => {
  it('die drei Rollen sind in der Crew und haben Schreibweg und Schranke', () => {
    for (const a of ['dose-packer', 'demo-builder', 'venture-analyst']) {
      expect(CREW).toContain(a);
      expect(PROFILES[a].writes.describe).toMatch(/--write/);
      expect(ROLES[a].gates.length).toBeGreaterThan(0);
    }
  });

  it('die Mock-Pakete sind gültig', () => {
    for (const a of ['dose-packer', 'demo-builder', 'venture-analyst']) expect(validateBundle(mockData(a), { agent: a })).toEqual([]);
  });

  it('lehnt fremde Pfade, Überschreiben, Pfadflucht und fremde Einfügestellen ab', () => {
    const root = fixture();
    const d = mockData('dose-packer');
    const bad = { ...d, files: [...d.files, { path: 'src/data/dosen.ts', content: 'x' }, { path: '../evil.md', content: 'x' }, { path: 'README.md', content: 'x' }], inserts: [...d.inserts, { target: 'package.json', mode: 'append', text: 'x' }] };
    const e = validateBundle(bad, { agent: 'dose-packer', root }).join('\n');
    expect(e).toMatch(/src\/data\/dosen\.ts ist für dose-packer nicht erlaubt/);
    expect(e).toMatch(/kein sicherer Pfad/);
    expect(e).toMatch(/README\.md ist für dose-packer nicht erlaubt/);
    expect(e).toMatch(/package\.json ist für dose-packer nicht erlaubt/);
    writeFileSync(join(root, '05-dosen/mock-dose.md'), 'schon da');
    expect(validateBundle(d, { agent: 'dose-packer', root }).join('\n')).toMatch(/gibt es schon/);
  });

  it('prüft Deep-Link, CC0-Zusage, TypeScript-Syntax und id', () => {
    const d = mockData('dose-packer');
    const e = validateBundle({ ...d, files: [{ path: d.files[0].path, content: '---\nstatus: A\n---\nnix' }, d.files[1]], inserts: [{ ...d.inserts[0], text: "{ id: 'mock-dose', title: " }, d.inserts[1]] }, { agent: 'dose-packer' }).join('\n');
    expect(e).toMatch(/TypeScript-Syntax/);
    const e2 = validateBundle({ ...d, files: [{ path: d.files[0].path, content: '---\nstatus: A\n---\nnix' }, d.files[1]] }, { agent: 'dose-packer' }).join('\n');
    expect(e2).toMatch(/Deep-Link/);
    expect(e2).toMatch(/CC0-Zusage/);
  });

  it('Demo-Bauer: Tests sind Pflicht, CC0 in jeder Datei, kein hartkodiertes „grün“', () => {
    const d = mockData('demo-builder');
    expect(validateBundle({ ...d, files: d.files.filter((f: any) => !/\.test\.ts$/.test(f.path)) }, { agent: 'demo-builder' }).join('\n')).toMatch(/test\.ts fehlt/);
    const noCc0 = d.files.map((f: any) => (f.path.endsWith('kern.ts') ? { ...f, content: 'export const green = true;' } : f));
    expect(validateBundle({ ...d, files: noCc0 }, { agent: 'demo-builder' }).join('\n')).toMatch(/CC0-Zeile fehlt/);
    const fake = d.files.map((f: any) => (f.path.endsWith('kern.ts') ? { ...f, content: '// CC0\nconst r = { sicher: true };' } : f));
    expect(validateBundle({ ...d, files: fake }, { agent: 'demo-builder' }).join('\n')).toMatch(/hartkodiertes/);
  });

  it('Venture: kill braucht keine Dateien, lead verlangt Vektoren und Preis', () => {
    const d = mockData('venture-analyst');
    expect(validateBundle({ id: 'x-y', verdict: 'kill', vectors: d.vectors, begruendung: 'Formular gratis.', files: [], inserts: [] }, { agent: 'venture-analyst' })).toEqual([]);
    expect(validateBundle({ id: 'x-y', verdict: 'kill', vectors: d.vectors, begruendung: 'x', files: d.files, inserts: [] }, { agent: 'venture-analyst' }).join('\n')).toMatch(/kill/);
    expect(validateBundle({ ...d, vectors: { ...d.vectors, wtp: 9 } }, { agent: 'venture-analyst' }).join('\n')).toMatch(/vectors\.wtp/);
    expect(validateBundle({ ...d, files: [{ path: d.files[0].path, content: '# nur Text' }] }, { agent: 'venture-analyst' }).join('\n')).toMatch(/Defensibility/);
  });
});

describe('Einfügen', () => {
  it('ts-array hängt ein Objekt vor das schließende ];', () => {
    const rule = ROLES['dose-packer'].inserts[0];
    const out = insertInto("export const DOSEN_DATA: X[] = [\n  {\n    id: 'a',\n  }\n];\n", { text: "{\n  id: 'b',\n}" }, rule);
    expect(out).toBe("export const DOSEN_DATA: X[] = [\n  {\n    id: 'a',\n  },\n  {\n    id: 'b',\n  },\n];\n");
  });
  it('ts-record, json-key, json-array und append', () => {
    expect(insertInto("export const DOSE_BOOKS = {\n  'a': [],\n};\n", { text: "'b': []" }, ROLES['demo-builder'].inserts[0])).toBe("export const DOSE_BOOKS = {\n  'a': [],\n  'b': [],\n};\n");
    expect(JSON.parse(insertInto('{"a":1}', { key: 'b', value: { x: 1 } }, ROLES['dose-packer'].inserts[1]))).toEqual({ a: 1, b: { x: 1 } });
    expect(JSON.parse(insertInto('[{"id":"a"}]', { value: { id: 'b' } }, ROLES['venture-analyst'].inserts[0]))).toEqual([{ id: 'a' }, { id: 'b' }]);
    expect(insertInto('| a |\n', { text: '| b |' }, ROLES['demo-builder'].inserts[1])).toBe('| a |\n| b |\n');
  });
  it('trifft das echte dosen.ts und doseBooks.ts, ohne die Syntax zu brechen', () => {
    const dosen = readFileSync(join(ROOT, 'src/data/dosen.ts'), 'utf8');
    const out = insertInto(dosen, { text: "{ id: 'neu-x', title: 'N' }" }, ROLES['dose-packer'].inserts[0]);
    expect(out.length).toBeGreaterThan(dosen.length);
    expect(out).toMatch(/\{ id: 'neu-x', title: 'N' \},\n\];/);
    const books = readFileSync(join(ROOT, 'src/data/doseBooks.ts'), 'utf8');
    expect(insertInto(books, { text: "'neu-x': []" }, ROLES['demo-builder'].inserts[0])).toMatch(/'neu-x': \[\],\n\};/);
  });
});

describe('Schreiben mit Schranke', () => {
  it('Trockenlauf ändert nichts', () => {
    const root = fixture();
    const r = applyBundle({ root, agent: 'dose-packer', data: mockData('dose-packer'), dryRun: true });
    expect(r.planned.length).toBe(4);
    expect(existsSync(join(root, '05-dosen/mock-dose.md'))).toBe(false);
  });

  it('schreibt, führt die Schranke aus und behält das Ergebnis', () => {
    const root = fixture();
    const r = applyBundle({ root, agent: 'dose-packer', data: mockData('dose-packer'), gates: [['node', '-e', 'process.exit(0)']] });
    expect(r.gates[0].exit).toBe(0);
    expect(readFileSync(join(root, 'src/data/dosen.ts'), 'utf8')).toMatch(/id: 'mock-dose'/);
    expect(JSON.parse(readFileSync(join(root, 'src/data/doseVectors.json'), 'utf8'))['mock-dose']).toBeTruthy();
    expect(existsSync(join(root, 'en/05-dosen/mock-dose.md'))).toBe(true);
  });

  it('rollt bei roter Schranke alles zurück, auch erzeugte Nebendateien', () => {
    const root = fixture();
    const before = readFileSync(join(root, 'src/data/dosen.ts'), 'utf8');
    const gate = ['node', '-e', "require('fs').writeFileSync('erzeugt.txt','x'); require('fs').appendFileSync('src/data/doseVectors.json','\\n'); process.stderr.write('kaputt'); process.exit(1)"];
    expect(() => applyBundle({ root, agent: 'dose-packer', data: mockData('dose-packer'), gates: [gate] })).toThrow(/zurückgesetzt[\s\S]*kaputt/);
    expect(readFileSync(join(root, 'src/data/dosen.ts'), 'utf8')).toBe(before);
    expect(existsSync(join(root, '05-dosen/mock-dose.md'))).toBe(false);
    expect(existsSync(join(root, 'erzeugt.txt'))).toBe(false);
    expect(spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout.trim()).toBe('');
  });

  it('rollt auch zurück, wenn der Vorlauf (pre) scheitert, und sichert schon veränderte Dateien', () => {
    const root = fixture();
    writeFileSync(join(root, 'src/data/doseVectors.json'), '{\n  "alt": { "v": [9] }\n}\n'); // vorher schon geändert
    const dirtyText = readFileSync(join(root, 'src/data/doseVectors.json'), 'utf8');
    expect(() => applyBundle({ root, agent: 'dose-packer', data: mockData('dose-packer'), gates: [], pre: () => { throw new Error('bib abgelehnt'); } })).toThrow(/bib abgelehnt/);
    expect(readFileSync(join(root, 'src/data/doseVectors.json'), 'utf8')).toBe(dirtyText);
    expect(readdirSync(join(root, '05-dosen'))).toEqual([]);
  });

  it('Venture schreibt nur auf feat/venture-*', () => {
    const main = fixture('main');
    expect(() => applyBundle({ root: main, agent: 'venture-analyst', data: mockData('venture-analyst'), gates: [] })).toThrow(/nie auf main/);
    expect(existsSync(join(main, 'ventures/opportunities/mock-lead.md'))).toBe(false);
    const br = fixture('feat/venture-test');
    applyBundle({ root: br, agent: 'venture-analyst', data: mockData('venture-analyst'), gates: [] });
    expect(existsSync(join(br, 'ventures/opportunities/mock-lead.md'))).toBe(true);
    expect(JSON.parse(readFileSync(join(br, 'ventures/market-leads.json'), 'utf8')).map((x: any) => x.id)).toEqual(['alt', 'mock-lead']);
  });

  it('Venture kill schreibt nichts', () => {
    const root = fixture('feat/venture-test');
    const r = applyBundle({ root, agent: 'venture-analyst', data: { id: 'x-y', verdict: 'kill', vectors: { wtp: 1, tts: 1, channel: 1, monetization: 1, defensibility: 1 }, begruendung: 'Gratis-Formular.', files: [], inserts: [] }, gates: [] });
    expect(r.planned).toEqual([]);
  });
});

describe('Läufe der Bauer-Rollen', () => {
  it('Mock-Lauf liefert gültigen Datensatz; der Packer wählt die Dose aus dem Review', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'crew-runs-'));
    const review = { run_id: 'idea-reviewer-x', agent: 'idea-reviewer', contract: 'reviews', status: 'ok', data: { reviews: [{ id: 'eine-dose', title: 'E', kern: 25, gesamt: 27, triage: 'Dose Ready' }, { id: 'andere', title: 'A', kern: 20, gesamt: 21, triage: 'Needs Research' }], lehren: [] } };
    const rec = await runAgent({ root: ROOT, agent: 'dose-packer', inputs: [review], adapter: fixedAdapter(() => PROFILES['dose-packer'].mockReply(), { usage: { in: 1, out: 1 } }), spec: { id: 'mock', provider: 'mock' }, dir, repair: false });
    expect(rec.status).toBe('ok');
    expect(rec.task).toMatch(/„eine-dose“/);
    expect(rec.task).not.toMatch(/„andere“/);
    await expect(runAgent({ root: ROOT, agent: 'dose-packer', inputs: [{ ...review, data: { reviews: [{ ...review.data.reviews[1] }] } }], adapter: fixedAdapter(''), spec: { id: 'mock', provider: 'mock' }, dir })).rejects.toThrow(/--thema/);
    await expect(runAgent({ root: ROOT, agent: 'dose-packer', thema: 'andere', inputs: [review], adapter: fixedAdapter(''), spec: { id: 'mock', provider: 'mock' }, dir })).rejects.toThrow(/nicht „Dose Ready“/);
  });
});

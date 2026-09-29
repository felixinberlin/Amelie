import { describe, it, expect, beforeEach } from 'vitest';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { applyPlan } from '../../scripts/bib-apply.mjs';
import { buildSchema } from '../../scripts/bib-ops.mjs';
import { REL, acquireLock, hashFile, snapshot, writeJournal, storeHashes, readLedger, permit } from '../../scripts/bib-store.mjs';
import { EXIT, exitFor } from '../../scripts/bib-errors.mjs';
import { matchUrl } from '../../scripts/quellen-lib.mjs';

const real = process.cwd();
const PROTOKOLL = `# Protokoll

## Testrunde — 29.09.2026

| # | Idee | Methode | Urteil (Merge → nach Review) | Beleg (kurz) | Evidenz | Geprüft | Prüfen ab |
|---|---|---|---|---|---|---|---|
| T1 | **Alt** (\`alt\`) | [method: x] | \`besetzt\` | b | [Seite] | 29.09.2026 | – |
`;

/** Mini-Repo: zwei echte Quellen samt Katalog, ein Vektoreintrag, ein Protokollabschnitt, die echten Rechte und Typen. */
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'bib-fixture-'));
  const put = (rel: string, text: string) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
  const q = JSON.parse(readFileSync(join(real, 'src/data/quellen.json'), 'utf8'));
  q.quellen = q.quellen.slice(0, 2).map((x: any) => ({ ...x, urls: x.urls?.length ? x.urls : ['https://example.org/a'] }));
  put('src/data/quellen.json', JSON.stringify(q, null, 2) + '\n');
  put('src/data/graeber.json', '[]\n');
  put('src/data/doseVectors.json', JSON.stringify({ 'dose-a': { v: [4, 5, 3, 4, 4, 4, 4], fun: 3, funSource: 'play' } }, null, 2) + '\n');
  put('src/data/candidateVectors.json', '{}\n');
  put('06-suche/amelie-pruefprotokoll.md', PROTOKOLL);
  put('05-dosen/dose-a.md', '# Dose A\n');
  mkdirSync(join(root, 'src'), { recursive: true });
  copyFileSync(join(real, 'src/types.ts'), join(root, 'src/types.ts'));
  copyFileSync(join(real, REL.actors), join(root, REL.actors));
  return { root, q, id0: q.quellen[0].id as string };
}

const GRAVE = { id: 'testgrab', title: 'T', originalIdeaDe: 'a', originalIdeaEn: 'a', whyDiscardedDe: 'b', whyDiscardedEn: 'b', lessonDe: 'c', lessonEn: 'c', domain: 'D', evidence: ['e'], cause: 'gebaut', killer: 'kommerziell', foundBy: 'englisch', origin: 'brainstorm', stage: 'kandidat', bornIn: 'R', diedOn: '2026-09-29', resurrectIfDe: 'nie', resurrectIfEn: 'never' };
const PROT = { op: 'protokoll.add', runde: 'Testrunde', titel: 'Neu', id: 'neu', urteil: 'unklar', beleg: 'b', evidenz: 'schnipsel', method: 'test', pruefenAb: '09/2027' };
const base = (ops: any[], extra: any = {}) => ({ plan_id: `p-${Math.random().toString(36).slice(2, 8)}`, actor: 'bibliothekar', ops, ...extra });
const hashes = (root: string) => JSON.stringify(storeHashes(root)) + hashFile(root, REL.ledger) + hashFile(root, REL.audit) + hashFile(root, REL.quellenMd);

describe('bib apply: alles oder nichts', () => {
  let f: ReturnType<typeof fixture>;
  beforeEach(() => { f = fixture(); });

  it('schreibt nichts, wenn eine Operation ungültig ist, und meldet {code, field, message} je Operation', () => {
    const before = hashes(f.root);
    const r = applyPlan(base([{ op: 'source.log', id: f.id0, note: 'ok' }, { op: 'grave.add', grave: { ...GRAVE, cause: 'tot' } }, { op: 'nix.tun' }]), { root: f.root });
    expect(r.ok).toBe(false);
    expect(r.exit).toBe(EXIT.VALIDATION);
    expect(r.errors.map((e: any) => [e.code, e.field, e.op])).toEqual([['OP_UNKNOWN', 'ops[2].op', 2]]);
    const r2 = applyPlan(base([{ op: 'source.log', id: f.id0, note: 'ok' }, { op: 'grave.add', grave: { ...GRAVE, cause: 'tot' } }]), { root: f.root });
    expect(r2.errors[0]).toMatchObject({ code: 'VALUE_INVALID', field: 'ops[1].grave', op: 1 });
    expect(r2.ops[0].ok).toBe(true); // die gute Operation ist geprüft, aber nichts geschrieben
    expect(hashes(f.root)).toBe(before);
  });

  it('wendet alle Operationen an, erzeugt quellen.md, schreibt Ledger und Audit und trägt die Herkunft ein', () => {
    const plan = base([
      { op: 'grave.add', grave: GRAVE },
      { op: 'source.log', id: f.id0, note: 'Grab verknüpft', grab: ['testgrab'] },
      PROT,
    ], { agent: 'lab', runde: 'Testrunde' });
    const r = applyPlan(plan, { root: f.root });
    expect(r.ok, JSON.stringify(r.errors)).toBe(true);
    expect(r.files).toEqual(expect.arrayContaining([REL.graeber, REL.quellen, REL.quellenMd, REL.protokoll, REL.ledger, REL.audit]));
    const q = JSON.parse(readFileSync(join(f.root, REL.quellen), 'utf8')).quellen[0];
    expect(q.ertrag.graeber).toContain('testgrab');
    expect(q.verlauf.at(-1)).toMatchObject({ agent: 'lab', runde: 'Testrunde', planId: plan.plan_id });
    expect(readFileSync(join(f.root, REL.protokoll), 'utf8')).toContain('**Neu** (`neu`)');
    expect(readFileSync(join(f.root, REL.audit), 'utf8').trim().split('\n').length).toBe(4); // 3 Operationen + Abschluss
    expect(Object.keys(readLedger(f.root).applied)).toEqual([plan.plan_id]);
  });

  it('erzwingt die Reihenfolge: Grab-Verweis vor dem Grab schlägt fehl', () => {
    const r = applyPlan(base([{ op: 'source.log', id: f.id0, note: 'x', grab: ['testgrab'] }, { op: 'grave.add', grave: GRAVE }]), { root: f.root });
    expect(r.ok).toBe(false);
    expect(r.errors[0].field).toBe('ops[0].source');
  });

  it('Regel 1: durchsucht ohne evidenz=seite wird abgelehnt', () => {
    const r = applyPlan(base([{ op: 'source.log', id: f.id0, note: 'x', status: 'durchsucht', evidence: 'x', evidenz: 'schnipsel' }]), { root: f.root });
    expect(r.errors[0]).toMatchObject({ code: 'RULE_VIOLATION' });
  });

  it('dry-run schreibt nichts und legt kein Ledger an', () => {
    const before = hashes(f.root);
    const r = applyPlan(base([PROT]), { root: f.root, dryRun: true });
    expect(r.ok).toBe(true);
    expect(r.dry_run).toBe(true);
    expect(r.files).toContain(REL.protokoll);
    expect(hashes(f.root)).toBe(before);
    expect(existsSync(join(f.root, REL.ledger))).toBe(false);
  });

  it('rollt nach einem Fehler beim Schreiben alle Dateien zurück und räumt das Journal', () => {
    const before = hashes(f.root);
    const r = applyPlan(base([{ op: 'grave.add', grave: GRAVE }, PROT]), { root: f.root, hooks: { afterWrite: () => { throw new Error('Absturz nach dem Schreiben'); } } });
    expect(r.ok).toBe(false);
    expect(r.exit).toBe(EXIT.APPLY_FAILED);
    expect(r.errors[0]).toMatchObject({ code: 'APPLY_FAILED' });
    expect(r.ops.every((o: any) => o.rolledBack)).toBe(true);
    expect(hashes(f.root)).toBe(before);
    expect(existsSync(join(f.root, REL.journal))).toBe(false);
    expect(existsSync(join(f.root, REL.lock))).toBe(false);
  });

  it('stellt nach einem harten Abbruch (Journal liegt noch da) den alten Stand her, bevor der nächste Plan läuft', () => {
    const before = hashes(f.root);
    writeJournal(f.root, snapshot(f.root), { plan_id: 'abgebrochen', actor: 'x' });
    writeFileSync(join(f.root, REL.graeber), '[{"id":"halb-geschrieben"}]\n'); // halb geschriebener Zustand
    const r = applyPlan(base([PROT]), { root: f.root });
    expect(r.ok).toBe(true);
    expect(r.recovered).toMatchObject({ plan_id: 'abgebrochen' });
    expect(readFileSync(join(f.root, REL.graeber), 'utf8')).toBe('[]\n');
    expect(hashes(f.root)).not.toBe(before);
  });
});

describe('bib apply: Idempotenz, Sperre, Vorbedingungen', () => {
  let f: ReturnType<typeof fixture>;
  beforeEach(() => { f = fixture(); });

  it('zweites Anwenden desselben Schlüssels meldet already_applied und ändert nichts', () => {
    const plan = base([PROT]);
    expect(applyPlan(plan, { root: f.root }).ok).toBe(true);
    const after = hashes(f.root);
    const again = applyPlan(plan, { root: f.root });
    expect(again).toMatchObject({ ok: true, already_applied: true, exit: 0 });
    expect(hashes(f.root)).toBe(after);
    // --key überschreibt die plan_id als Schlüssel
    const other = applyPlan({ ...plan, plan_id: 'anderer-name' }, { root: f.root, key: plan.plan_id });
    expect(other.already_applied).toBe(true);
  });

  it('verweigert die Sperre, solange ein lebender Prozess sie hält, und räumt eine verwaiste', () => {
    mkdirSync(join(f.root, '06-suche'), { recursive: true });
    writeFileSync(join(f.root, REL.lock), JSON.stringify({ pid: process.pid, token: 'fremd', actor: 'anderer', at: 'jetzt' }));
    const busy = applyPlan(base([PROT]), { root: f.root, wait: 0 });
    expect(busy).toMatchObject({ ok: false, exit: EXIT.LOCK });
    expect(busy.errors[0].code).toBe('LOCK_TIMEOUT');
    writeFileSync(join(f.root, REL.lock), JSON.stringify({ pid: 2 ** 22 + 12345, token: 'tot', actor: 'weg', at: 'früher' }));
    expect(applyPlan(base([PROT]), { root: f.root, wait: 0 }).ok).toBe(true);
    expect(existsSync(join(f.root, REL.lock))).toBe(false);
  });

  it('acquireLock erlaubt Kindprozessen des Halters die Freigabe über das Token', () => {
    const release = acquireLock(f.root, { actor: 'eltern' });
    try {
      expect(() => acquireLock(f.root, { wait: 0 })).not.toThrow(); // gleicher Prozess trägt das Token
    } finally { release(); }
    expect(existsSync(join(f.root, REL.lock))).toBe(false);
  });

  it('Datei-Hashes als Vorbedingung: veraltet → Exit 11, nichts geschrieben', () => {
    const stale = hashFile(f.root, REL.protokoll);
    applyPlan(base([PROT]), { root: f.root }); // ändert das Protokoll
    const before = hashes(f.root);
    const r = applyPlan(base([{ ...PROT, titel: 'Zwei', id: 'zwei' }], { expect: { hashes: { [REL.protokoll]: stale } } }), { root: f.root });
    expect(r).toMatchObject({ ok: false, exit: EXIT.PRECONDITION });
    expect(r.errors[0]).toMatchObject({ code: 'PRECONDITION_FAILED', field: `expect.hashes.${REL.protokoll}` });
    expect(hashes(f.root)).toBe(before);
    const ok = applyPlan(base([{ ...PROT, titel: 'Zwei', id: 'zwei' }], { expect: { hashes: { [REL.protokoll]: hashFile(f.root, REL.protokoll) } } }), { root: f.root });
    expect(ok.ok).toBe(true);
  });
});

describe('bib apply: Rechte der Akteure', () => {
  let f: ReturnType<typeof fixture>;
  beforeEach(() => { f = fixture(); });
  const as = (actor: string, ops: any[], extra: any = {}) => applyPlan(base(ops, { actor, ...extra }), { root: f.root });

  it('lab-librarian: source.log und grave.add ja, protokoll.add nur mit human_accepted, vector.set nein, Unbekannte nein', () => {
    expect(as('lab-librarian', [{ op: 'source.log', id: f.id0, note: 'x' }, { op: 'grave.add', grave: GRAVE }]).ok).toBe(true);
    const nein = as('lab-librarian', [PROT]);
    expect(nein).toMatchObject({ ok: false, exit: EXIT.PERMISSION });
    expect(nein.errors[0]).toMatchObject({ code: 'PERMISSION_DENIED', field: 'ops[0].op' });
    expect(as('lab-librarian', [PROT], { human_accepted: true }).ok).toBe(true);
    expect(as('lab-librarian', [{ ...PROT, titel: 'B', id: 'b', human_accepted: true }]).ok).toBe(true);
    expect(as('lab-librarian', [{ op: 'vector.set', kind: 'dose', id: 'dose-a', set: { V1: 3 }, evidence: 'eine Begründung' }]).exit).toBe(EXIT.PERMISSION);
    expect(as('irgendwer', [PROT]).exit).toBe(EXIT.PERMISSION);
  });

  it('eine verbotene Operation blockiert den ganzen Plan, auch die erlaubten', () => {
    const before = hashes(f.root);
    const r = as('lab-librarian', [{ op: 'source.log', id: f.id0, note: 'x' }, PROT]);
    expect(r.ok).toBe(false);
    expect(hashes(f.root)).toBe(before);
  });

  it('permit: Regeln kommen aus der Konfiguration', () => {
    const cfg = { actors: { a: { allow: ['x.y'], conditional: { 'z.w': { requires: 'ok' } } }, b: { allow: ['*'] } } };
    expect(permit(cfg, 'a', 'x.y').ok).toBe(true);
    expect(permit(cfg, 'a', 'z.w').ok).toBe(false);
    expect(permit(cfg, 'a', 'z.w', { flags: { ok: true } }).ok).toBe(true);
    expect(permit(cfg, 'b', 'irgendwas').ok).toBe(true);
    expect(permit(cfg, 'c', 'x.y').ok).toBe(false);
  });
});

describe('bib apply: Vektoren', () => {
  let f: ReturnType<typeof fixture>;
  beforeEach(() => { f = fixture(); });
  const vec = (set: any, extra: any = {}) => ({ op: 'vector.set', kind: 'dose', id: 'dose-a', set, evidence: 'Begründung mit Beleg.', ...extra });

  it('ändert V1–V7, protokolliert jede Änderung und lässt den Rest unberührt', () => {
    const r = applyPlan(base([vec({ V1: 3, V3: 4 }, { expect: { V1: 4, V3: 3 }, reason: 'Recht geändert' })], { agent: 'adjudicator', runde: 'R' }), { root: f.root });
    expect(r.ok, JSON.stringify(r.errors)).toBe(true);
    const v = JSON.parse(readFileSync(join(f.root, REL.doseVectors), 'utf8'))['dose-a'];
    expect(v.v).toEqual([3, 5, 4, 4, 4, 4, 4]);
    expect(v.fun).toBe(3);
    const log = JSON.parse(readFileSync(join(f.root, REL.vectorLog), 'utf8'));
    expect(log).toHaveLength(2);
    expect(log[0]).toMatchObject({ vector: 'V1', from: 4, to: 3, agent: 'adjudicator', kind: 'dose', id: 'dose-a', reason: 'Recht geändert' });
  });

  it('erzwingt die Rubrik: V8 nie, |Δ| ≤ 2, Bereich 1–5, Evidenz Pflicht, bekannter Eintrag', () => {
    const codes = (op: any) => applyPlan(base([op]), { root: f.root }).errors.map((e: any) => `${e.code}:${e.field}`);
    expect(codes(vec({ V8: 5 }))).toEqual(['RULE_VIOLATION:ops[0].set.V8']);
    expect(codes(vec({ fun: 5 }))).toEqual(['RULE_VIOLATION:ops[0].set.fun']);
    expect(codes(vec({ V2: 2 }))).toEqual(['RULE_VIOLATION:ops[0].set.V2']); // 5 → 2
    expect(codes(vec({ V1: 6 }))).toEqual(['VALUE_INVALID:ops[0].set.V1']);
    expect(codes(vec({ V9: 3 }))).toEqual(['VALUE_INVALID:ops[0].set.V9']);
    expect(codes(vec({ V1: 3 }, { evidence: '' }))).toEqual(['FIELD_REQUIRED:ops[0].evidence']);
    expect(codes(vec({ V1: 3 }, { evidence: 'kurz' }))).toEqual(['RULE_VIOLATION:ops[0].evidence']);
    expect(codes(vec({ V1: 3 }, { id: 'gibts-nicht' }))).toEqual(['NOT_FOUND:ops[0].id']);
  });

  it('veraltete Erwartung („4 → 3“, aber V1 ist inzwischen 5): Exit 11, nichts geschrieben', () => {
    applyPlan(base([vec({ V1: 5 })]), { root: f.root });
    const before = hashes(f.root);
    const r = applyPlan(base([vec({ V1: 3 }, { expect: { V1: 4 } })]), { root: f.root });
    expect(r).toMatchObject({ ok: false, exit: EXIT.PRECONDITION });
    expect(r.errors[0]).toMatchObject({ code: 'PRECONDITION_FAILED', field: 'ops[0].expect.V1' });
    expect(hashes(f.root)).toBe(before);
  });
});

describe('bib schema, Lookups, Fehlercodes', () => {
  it('schema listet erlaubte Werte, Operationen, Rechte und Codes aus den echten Quellen', () => {
    const s = buildSchema(real);
    expect(s.sources.typ.length).toBeGreaterThan(10);
    expect(s.sources.kategorie).toContain('norm');
    expect(s.graves.cause).toEqual(expect.arrayContaining(['gebaut', 'praemisse']));
    expect(s.graves.required).toContain('resurrectIfDe');
    expect(Object.keys(s.operations).sort()).toEqual(['grave.add', 'protokoll.add', 'source.add', 'source.log', 'source.rate', 'vector.set']);
    expect(s.vectors).toMatchObject({ forbidden: ['V8'], maxDelta: 2, evidenceRequired: true });
    expect(s.actors['lab-librarian'].conditional['protokoll.add']).toEqual({ requires: 'human_accepted' });
    expect(s.exitCodes).toMatchObject({ VALIDATION: 10, PRECONDITION: 11, PERMISSION: 12, LOCK: 13, APPLY_FAILED: 14 });
    expect(s.errorShape.code).toBeTruthy();
  });

  it('matchUrl: exakt vor Pfad vor Host', () => {
    const data = { quellen: [{ id: 'a', name: 'A', urls: ['https://www.example.org/x/y'] }, { id: 'b', name: 'B', urls: ['https://example.org/'] }, { id: 'c', name: 'C', urls: ['https://andere.de/x'] }] };
    expect(matchUrl(data, 'https://example.org/x/y/').map((m) => [m.id, m.kind])).toEqual([['a', 'exakt'], ['b', 'host']]);
    expect(matchUrl(data, 'https://example.org/x/y/z')[0]).toMatchObject({ id: 'a', kind: 'pfad' });
    expect(matchUrl(data, 'https://nirgends.io')).toEqual([]);
    expect(() => matchUrl(data, 'kein url')).toThrow(/URL/);
  });

  it('der schwerste Fehler bestimmt den Exit-Code', () => {
    expect(exitFor([{ code: 'VALUE_INVALID' }, { code: 'PERMISSION_DENIED' }])).toBe(EXIT.PERMISSION);
    expect(exitFor([{ code: 'FIELD_REQUIRED' }])).toBe(EXIT.VALIDATION);
  });
});

describe('CLI mit --json (echtes Repo, nur lesend oder dry-run)', () => {
  const cli = (args: string[]) => spawnSync('node', ['scripts/bibliothek.mjs', ...args], { encoding: 'utf8', cwd: real });
  it('Lesebefehle liefern reines JSON, Fehler die Form {code, field, message}', () => {
    for (const a of [['status'], ['grab', 'werte'], ['grab', 'stats'], ['protokoll', 'stats'], ['quellen', 'formate'], ['state'], ['ledger'], ['schema']]) {
      const r = cli([...a, '--json']);
      expect(r.status, a.join(' ') + r.stderr).toBe(0);
      expect(JSON.parse(r.stdout).ok, a.join(' ')).toBe(true);
    }
    const bad = cli(['grab', 'list', '--cause', 'nix', '--json']);
    expect(bad.status).toBe(EXIT.VALIDATION);
    expect(JSON.parse(bad.stdout)).toMatchObject({ ok: false, errors: [{ code: 'VALUE_INVALID', field: 'cause' }] });
    const usage = cli(['find', '--json']);
    expect(JSON.parse(usage.stdout).errors[0]).toMatchObject({ code: 'USAGE' });
  });

  it('find --json liefert strukturierte Treffer (Datei, Zeile, Urteil, binding) und Exit 2', () => {
    const r = cli(['find', 'strassennamen', '--json']);
    expect(r.status).toBe(EXIT.FOUND);
    const d = JSON.parse(r.stdout);
    expect(d.alreadyThere).toBe(true);
    const prot = d.hits.find((h: any) => h.kind === 'protokoll');
    expect(prot).toMatchObject({ file: '06-suche/amelie-pruefprotokoll.md', binding: true });
    expect(typeof prot.line).toBe('number');
    expect(d.hits.find((h: any) => h.kind === 'grab')).toMatchObject({ file: 'src/data/graeber.json' });
  });

  it('exists und quellen match: Exit 0 bei Treffer, 4 ohne', () => {
    expect(cli(['exists', 'grave', 'lan-stromplaner', '--json']).status).toBe(0);
    const no = cli(['exists', 'source', 'gibt-es-nicht-xyz', '--json']);
    expect(no.status).toBe(EXIT.NOT_FOUND);
    expect(JSON.parse(no.stdout)).toMatchObject({ ok: true, exists: false });
    const src = (JSON.parse(readFileSync(join(real, 'src/data/quellen.json'), 'utf8')).quellen as any[]).find((q) => q.urls?.length);
    const m = cli(['quellen', 'match', '--url', src.urls[0], '--json']);
    expect(m.status).toBe(0);
    expect(JSON.parse(m.stdout).matches[0].kind).toBe('exakt');
    expect(cli(['quellen', 'match', '--url', 'https://gibt-es-nicht.invalid/', '--json']).status).toBe(EXIT.NOT_FOUND);
  });

  it('apply --dry-run --json prüft einen Plan gegen das echte Repo, ohne etwas zu ändern', () => {
    const dir = mkdtempSync(join(tmpdir(), 'bib-plan-'));
    const file = join(dir, 'plan.json');
    writeFileSync(file, JSON.stringify(base([{ op: 'source.log', id: JSON.parse(readFileSync(join(real, 'src/data/quellen.json'), 'utf8')).quellen[0].id, note: 'Dry-run-Test' }])));
    const before = storeHashes(real);
    const r = cli(['apply', file, '--dry-run', '--json']);
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toMatchObject({ ok: true, dry_run: true });
    expect(storeHashes(real)).toEqual(before);
    expect(existsSync(join(real, REL.ledger))).toBe(false);
    const bad = cli(['apply', file, '--dry-run', '--json', '--actor', 'unbekannt']);
    expect(bad.status).toBe(EXIT.PERMISSION);
    rmSync(dir, { recursive: true, force: true });
  });
});

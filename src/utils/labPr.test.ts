import { describe, it, expect } from 'vitest';
// @ts-expect-error reines JS-Modul
import { checkManifest } from '../../scripts/check-lab-pr.mjs';

const PID = 'lab-2026-09-30-inversion-20260930T100000-abc123';
const base = (over: Record<string, unknown> = {}) => ({
  manifest_version: 1,
  run_id: 'inversion-20260930T100000-abc123',
  plan_id: PID,
  engine: 'inversion',
  model: 'gemini-2.5-flash',
  existence_check: false,
  survivors: { count: 2, status: 'ungeprueft' },
  files: [`06-suche/proposals/${PID}.md`, `06-suche/proposals/${PID}.manifest.json`],
  source_ops: [],
  grave_proposals: 0,
  touches_memory: false,
  ...over,
});
const ctx = { exists: () => true, fileName: `${PID}.manifest.json` };

describe('check:lab-pr: checkManifest', () => {
  it('akzeptiert ein gültiges Manifest mit engine inversion', () => {
    expect(checkManifest(base(), ctx)).toEqual([]);
  });
  it('lehnt eine unbekannte Engine ab', () => {
    expect(checkManifest(base({ engine: 'magie' }), ctx).join(' ')).toMatch(/Schema/);
  });
  it('lehnt touches_memory, Dateien außerhalb von proposals/ und fehlendes Manifest in files ab', () => {
    const e = checkManifest(base({ touches_memory: true, files: ['src/data/graeber.json'] }), ctx).join(' | ');
    expect(e).toMatch(/touches_memory/);
    expect(e).toMatch(/außerhalb von 06-suche\/proposals\//);
    expect(e).toMatch(/Manifest selbst/);
  });
  it('prüft Überlebende gegen Status und Existenzprüfung', () => {
    expect(checkManifest(base({ survivors: { count: 0, status: 'ungeprueft' } }), ctx).join(' ')).toMatch(/"keine"/);
    expect(checkManifest(base({ survivors: { count: 2, status: 'geprueft' } }), ctx).join(' ')).toMatch(/ohne existence_check/);
  });
  it('das Lab setzt human_accepted nie', () => {
    const ops = [{ op: 'source.log', id: 'x', human_accepted: true, urls: [] }];
    expect(checkManifest(base({ source_ops: ops }), ctx).join(' ')).toMatch(/human_accepted/);
  });
  it('vergleicht die Pflichtzeile im PR-Text mit existence_check', () => {
    expect(checkManifest(base(), { ...ctx, prText: 'Existenzprüfung: nein' })).toEqual([]);
    expect(checkManifest(base(), { ...ctx, prText: 'Existenzprüfung: ja' }).join(' ')).toMatch(/Manifest existence_check=false/);
    expect(checkManifest(base(), { ...ctx, prText: 'nichts' }).join(' ')).toMatch(/Pflichtzeile/);
  });
  it('PR-Diff: nur neue Dateien in proposals/, deckungsgleich mit files', () => {
    const diff = [{ status: 'A', path: `06-suche/proposals/${PID}.md` }, { status: 'M', path: 'src/data/graeber.json' }];
    const e = checkManifest(base(), { ...ctx, diffFiles: diff }).join(' | ');
    expect(e).toMatch(/außerhalb/);
    expect(e).toMatch(/create-only/);
    expect(e).toMatch(/im PR nicht enthalten/);
  });
  it('Quellen-Ops: source.add bei Host-Treffer und source.log auf Unbekanntes scheitern', () => {
    const register = { quellen: [{ id: 'ebms', name: 'eBMS', urls: ['https://butterfly-monitoring.net/de/bms-methods'] }] };
    const ops = [
      { op: 'source.add', id: 'neu', human_accepted: false, urls: ['https://butterfly-monitoring.net/x.pdf'] },
      { op: 'source.log', id: 'gibtsnicht', human_accepted: false, urls: [] },
    ];
    const e = checkManifest(base({ source_ops: ops }), { ...ctx, register }).join(' | ');
    expect(e).toMatch(/host-Treffer ebms.*source\.log statt source\.add/);
    expect(e).toMatch(/unbekannte Quelle gibtsnicht/);
  });
});

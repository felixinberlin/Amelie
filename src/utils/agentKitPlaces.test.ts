import { describe, it, expect } from 'vitest';
import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// @ts-ignore
import { createKit, KIT_TOOLS, toolsForAgent, DEFAULT_BUDGETS } from '../../scripts/agent-kit.mjs';

/** Falsches Lab: .venv/bin/python ist ein Skript, das eine feste Places-Antwort liefert. */
function fakeLab(body: string, code = 0) {
  const dir = mkdtempSync(join(tmpdir(), 'lab-'));
  mkdirSync(join(dir, '.venv/bin'), { recursive: true });
  mkdirSync(join(dir, 'agents'), { recursive: true });
  writeFileSync(join(dir, 'agents/search_service.py'), '');
  const py = join(dir, '.venv/bin/python');
  writeFileSync(py, `#!/bin/sh\necho '${body}'\nexit ${code}\n`);
  chmodSync(py, 0o755);
  return dir;
}
const PLACES = JSON.stringify([{ id: 'abc', name: 'Landesfischereiverband', address: 'Werder', lat: 52.4, lng: 12.9, website: 'http://lfv.example', rating: null }]);

describe('places_find im Kit', () => {
  it('ist ein Werkzeug jedes Agenten mit WebSearch', () => {
    expect(KIT_TOOLS.places_find.name).toBe('places_find');
    expect(toolsForAgent({ tools: ['Read', 'WebSearch'] })).toContain('places_find');
    expect(toolsForAgent({ tools: ['Read'] })).not.toContain('places_find');
  });

  it('liefert Orte, standardmäßig als Information und nicht zitierfähig', async () => {
    const kit = createKit({ root: process.cwd(), labDir: fakeLab(PLACES) });
    const out = await kit.handlers.places_find({ query: 'Fischereiverband Brandenburg' });
    expect(out).toMatch(/Landesfischereiverband \| Werder \| 52.4, 12.9 \| http:\/\/lfv.example/);
    expect(out).toMatch(/place_id:abc/);
    expect(out).toMatch(/nicht zitierfähig/);
  });

  it('beim Venture-Analyst (citePlaces) zitierfähig', async () => {
    const kit = createKit({ root: process.cwd(), labDir: fakeLab(PLACES), citePlaces: true });
    expect(await kit.handlers.places_find({ query: 'Mitbewerber Berlin' })).toMatch(/zitierfähig \(Evidenz/);
  });

  it('meldet fehlendes Lab, zu kurze Anfrage, Dienstfehler, leere Treffer', async () => {
    expect(await createKit({ root: process.cwd(), labDir: null }).handlers.places_find({ query: 'abc def' })).toMatch(/Ortsdienst nicht gefunden/);
    const kit = createKit({ root: process.cwd(), labDir: fakeLab(PLACES) });
    expect(await kit.handlers.places_find({ query: 'a' })).toMatch(/zu kurz/);
    expect(await createKit({ root: process.cwd(), labDir: fakeLab('[]') }).handlers.places_find({ query: 'Nichts Berlin' })).toMatch(/fand nichts/);
    expect(await createKit({ root: process.cwd(), labDir: fakeLab('[x] rejected', 1) }).handlers.places_find({ query: 'Test Stadt' })).toMatch(/Fehler: Ortssuche fehlgeschlagen \(Exit 1\)/);
  });

  it('Obergrenze je Lauf, für den Venture-Analyst höher', async () => {
    expect(DEFAULT_BUDGETS.places_find).toBe(3);
    const kit = createKit({ root: process.cwd(), labDir: fakeLab(PLACES) });
    for (let i = 0; i < 3; i++) expect(await kit.handlers.places_find({ query: `Ort ${i} Stadt` })).not.toMatch(/Obergrenze/);
    expect(await kit.handlers.places_find({ query: 'Ort 4 Stadt' })).toMatch(/Obergrenze von 3 Aufrufen für places_find/);
    const more = createKit({ root: process.cwd(), labDir: fakeLab(PLACES), budgets: { places_find: 8 } });
    for (let i = 0; i < 8; i++) expect(await more.handlers.places_find({ query: `Ort ${i} Stadt` })).not.toMatch(/Obergrenze/);
    expect(await more.handlers.places_find({ query: 'Ort 9 Stadt' })).toMatch(/Obergrenze von 8/);
  });
});

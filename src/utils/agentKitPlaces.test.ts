import { describe, it, expect } from 'vitest';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// @ts-ignore
import { createKit, toolsForAgent, DEFAULT_BUDGETS } from '../../scripts/agent-kit.mjs';

describe('Maps cost guard', () => {
  it('does not advertise paid Places alongside web search', () => {
    expect(toolsForAgent({ tools: ['Read', 'WebSearch'] })).not.toContain('places_find');
    expect(DEFAULT_BUDGETS.places_find).toBe(0);
  });
  it('blocks legacy calls and budget overrides before launching the Lab', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'maps-disabled-'));
    mkdirSync(join(dir, '.venv/bin'), { recursive: true });
    const marker = join(dir, 'called');
    const python = join(dir, '.venv/bin/python');
    writeFileSync(python, `#!/bin/sh\ntouch '${marker}'\n`);
    chmodSync(python, 0o755);
    const kit = createKit({ root: process.cwd(), labDir: dir, citePlaces: true, budgets: { places_find: 99 } });
    expect(await kit.handlers.places_find({ query: 'Berlin' })).toMatch(/wegen Kosten deaktiviert/);
    expect(existsSync(marker)).toBe(false);
    expect(await createKit({ root: process.cwd(), labDir: null }).handlers.places_find({ query: 'Berlin' })).toMatch(/wegen Kosten deaktiviert/);
  });
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_MOOD, MOODS, isMoodId } from './moods';
import { resolveInitialMood } from '../utils/mood';

const css = readFileSync(join(__dirname, '../moods.css'), 'utf8');
const TOKENS = [
  'accent', 'accent-strong', 'on-accent', 'ink', 'ink-2', 'ink-3', 'muted', 'line', 'line-strong',
  'gold', 'copper', 'bg', 'bg-2', 'surface', 'surface-2', 'sunk', 'green', 'green-2',
];

describe('Stimmungen', () => {
  it('Ids sind eindeutig und die Standardstimmung existiert', () => {
    expect(new Set(MOODS.map((m) => m.id)).size).toBe(MOODS.length);
    expect(isMoodId(DEFAULT_MOOD)).toBe(true);
  });

  it('jede Stimmung außer der Standardstimmung hat einen Block in moods.css', () => {
    for (const m of MOODS.filter((x) => x.id !== DEFAULT_MOOD)) {
      expect(css, m.id).toContain(`:root[data-mood='${m.id}']`);
    }
  });

  it('jeder Block in moods.css gehört zu einer bekannten Stimmung', () => {
    const ids = [...css.matchAll(/data-mood='([a-z]+)'/g)].map((x) => x[1]);
    for (const id of ids) expect(isMoodId(id), id).toBe(true);
  });

  it('die Standardstimmung definiert alle Tokens; jede andere definiert sie ebenfalls', () => {
    const rootBlock = css.split(":root[data-mood='")[0];
    for (const t of TOKENS) expect(rootBlock, `:root --m-${t}`).toContain(`--m-${t}:`);
    for (const m of MOODS.filter((x) => x.id !== DEFAULT_MOOD)) {
      const block = css.split(`:root[data-mood='${m.id}'] {`)[1].split('\n}')[0];
      for (const t of TOKENS) expect(block, `${m.id} --m-${t}`).toContain(`--m-${t}:`);
    }
  });

  it('URL schlägt Gespeichertes schlägt Standard; Unbekanntes wird ignoriert', () => {
    expect(resolveInitialMood('?mood=kitchen', 'warm')).toBe('kitchen');
    expect(resolveInitialMood('', 'warm')).toBe('warm');
    expect(resolveInitialMood('?mood=nope', 'nope')).toBe(DEFAULT_MOOD);
    expect(resolveInitialMood('', null)).toBe(DEFAULT_MOOD);
  });
});

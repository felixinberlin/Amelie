import { describe, expect, it } from 'vitest';
import { retireDose } from '../../scripts/quellen-lib.mjs';

describe('source yields after a gift is retired', () => {
  const source = () => ({ quellen: [{
    id: 'evidence', ertrag: { dosen: ['retired', 'active'], graeber: [], kandidaten: ['research'] },
    zuletzt: '2026-10-11', verlauf: [{ datum: '2026-10-11', notiz: 'Original research' }],
  }] });

  it('moves only the retired yield, preserves research and history, and is idempotent', () => {
    const data = source();
    const refs = { doseIds: new Set(['active']), graveIds: new Set(['retired']) };
    expect(retireDose(data, 'retired', refs)).toBe(1);
    expect(data.quellen[0].ertrag).toEqual({ dosen: ['active'], graeber: ['retired'], kandidaten: ['research'] });
    expect(data.quellen[0].verlauf[0].notiz).toBe('Original research');
    expect(data.quellen[0].verlauf).toHaveLength(2);
    expect(retireDose(data, 'retired', refs)).toBe(0);
    expect(data.quellen[0].verlauf).toHaveLength(2);
  });

  it('refuses active gifts and missing graves without changing sources', () => {
    const data = source();
    const before = structuredClone(data);
    expect(() => retireDose(data, 'retired', { doseIds: new Set(['retired']), graveIds: new Set(['retired']) })).toThrow();
    expect(() => retireDose(data, 'retired', { doseIds: new Set(), graveIds: new Set() })).toThrow();
    expect(data).toEqual(before);
  });
});

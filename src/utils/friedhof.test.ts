import { describe, it, expect } from 'vitest';
import { DISCARDED_DATA } from '../data/dosen';
import { friedhofMuster, nachTodesdatum, formatTodesdatum, URSACHE, KILLER, FUNDWEG, HERKUNFT, STADIUM } from './friedhof';

describe('Friedhof', () => {
  it('jedes Grab hat einen vollständigen Totenschein', () => {
    for (const g of DISCARDED_DATA) {
      expect(URSACHE[g.cause], g.id).toBeDefined();
      expect(KILLER[g.killer], g.id).toBeDefined();
      expect(FUNDWEG[g.foundBy], g.id).toBeDefined();
      expect(HERKUNFT[g.origin], g.id).toBeDefined();
      expect(STADIUM[g.stage], g.id).toBeDefined();
      expect(g.diedOn, g.id).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
      expect(g.resurrectIfDe.length, g.id).toBeGreaterThan(2);
      expect(g.lessonDe.length, g.id).toBeGreaterThan(10);
    }
  });

  it('keine doppelten Gräber', () => {
    const ids = DISCARDED_DATA.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('Muster summieren sich zur Zahl der Gräber', () => {
    const m = friedhofMuster(DISCARDED_DATA);
    const sum = (xs: { count: number }[]) => xs.reduce((a, b) => a + b.count, 0);
    expect(sum(m.ursache)).toBe(m.total);
    expect(sum(m.fundweg)).toBe(m.total);
    expect(sum(m.herkunft)).toBe(m.total);
    expect(m.spaete).toBeLessThanOrEqual(m.total);
  });

  it('neueste Gräber zuerst, Monatsangaben zuletzt im Monat', () => {
    const sorted = nachTodesdatum(DISCARDED_DATA);
    expect(sorted[0].diedOn >= sorted[sorted.length - 1].diedOn).toBe(true);
  });

  it('formatiert Todesdaten', () => {
    expect(formatTodesdatum('2026-09-21', 'de')).toBe('21.09.2026');
    expect(formatTodesdatum('2026-09', 'de')).toBe('09/2026');
  });
});

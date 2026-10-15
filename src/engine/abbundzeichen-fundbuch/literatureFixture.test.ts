// CC0 1.0 Public Domain. Facts transcribed from the cited Oxford Archaeology report.
import { describe, it, expect } from 'vitest';
import fixture from '../../../07-demos/abbundzeichen-fundbuch/data/west-wycombe-2013.json';
import { pruefeZaehlfolge, type Bauteil } from './fundbuchEngine';

const observations = fixture.bauteile as Bauteil[];

describe('published West Wycombe sequence segment (not a complete building register)', () => {
  it('agrees with the published consecutive I–IIII segment on one beam', () => {
    const result = pruefeZaehlfolge(observations);
    expect(result.befunde.map(flag => flag.regel)).toEqual(fixture.expectedRuleIds);
    expect(result.unlesbar).toEqual([]);
    expect(result.serien[0].folgen[0].werte).toEqual([1, 2, 3, 4]);
  });

  it('detects an artificial missing observation as a counterexample, not a historical claim', () => {
    const artificialGap = observations.filter(part => part.zeichen !== 'III');
    const result = pruefeZaehlfolge(artificialGap);
    expect(result.befunde.map(flag => flag.regel)).toEqual(['R1-LUECKE']);
    expect(result.befunde[0].stufe).toBe('hinweis');
    expect(result.befunde[0].bauteile).toEqual(['ww-mark-2', 'ww-mark-4']);
  });
});

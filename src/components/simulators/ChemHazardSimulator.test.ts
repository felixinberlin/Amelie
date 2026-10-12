import { describe, it, expect } from 'vitest';
import { formatPh } from './ChemHazardSimulator';
import products from '../../../07-demos/chemhazard-stop/data/products.json';

describe('ChemHazard pH measurement conditions', () => {
  it.each([true, false])('displays dilution rather than concentrate for DESIFOR-QUICK (%s)', (de) => {
    const p = products.find((p) => p.id === 'dr-schnell-desifor-quick')!;
    const text = formatPh(p.ph, de);
    expect(text).toContain(de ? '1% Lösung' : '1% solution');
    expect(text).not.toContain(de ? 'Konzentrat' : 'concentrate');
  });
  it('distinguishes concentrate, unspecified measurement basis and missing pH', () => {
    expect(formatPh({ min: 13, max: 13, concentrationPercent: 100 }, false)).toContain('concentrate');
    expect(formatPh({ min: 7, max: 7 }, false)).toContain('measurement basis not recorded');
    expect(formatPh(undefined, false)).toBe('Unknown');
    expect(formatPh(undefined, true)).toBe('Unbekannt');
  });
});

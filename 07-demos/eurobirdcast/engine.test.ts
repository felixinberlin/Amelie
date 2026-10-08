import { describe, expect, it } from 'vitest';
import { integrate, scenario, type Profile } from './engine';
const band = { bottomM: 100, topM: 300, heightReference: 'AMSL' as const };
const profile = (): Profile => ({ source: 'synthetic:hand-calculation', license: 'CC0-1.0', timestampUtc: '2026-10-08T21:00:00Z', heightReference: 'AMSL', layers: [
  { bottomM: 0, topM: 200, densityBirdsKm3: 10, speedKmH: 50, quality: 'accepted' },
  { bottomM: 200, topM: 400, densityBirdsKm3: 20, speedKmH: 40, quality: 'accepted' },
] });
describe('EuroBirdCast research kernel', () => {
  it('integrates partial layer intersections with explicit units: 10×50×.1 + 20×40×.1 = 130', () => {
    expect(integrate(profile(), band)).toMatchObject({ coverage: 1, status: 'complete', mtrBirdsKmH: 130 });
  });
  it('preserves true zero migration', () => {
    const p = profile(); p.layers.forEach(l => l.densityBirdsKm3 = 0);
    expect(integrate(p, band).mtrBirdsKmH).toBe(0);
  });
  it.each(['missing', 'rain', 'gap'])('blocks %s coverage instead of treating it as zero', reason => {
    const p = profile();
    if (reason === 'missing') p.layers[1].densityBirdsKm3 = null;
    if (reason === 'rain') p.layers[1].quality = 'rejected';
    if (reason === 'gap') p.layers[1].bottomM = 250;
    const report = integrate(p, band);
    expect(report.status).toBe('insufficient-coverage');
    expect(report.mtrBirdsKmH).toBeNull();
    expect(scenario(report, 100, 1, 5).status).toBe('unknown');
  });
  it('rejects overlaps', () => { const p = profile(); p.layers[1].bottomM = 150; expect(() => integrate(p, band)).toThrow('overlapping'); });
  it('rejects mismatched height references', () => { const p = profile(); p.heightReference = 'AGL'; expect(() => integrate(p, band)).toThrow('references'); });
  it.each([-1, NaN, Infinity])('rejects invalid density %s', n => { const p = profile(); p.layers[0].densityBirdsKm3 = n; expect(() => integrate(p, band)).toThrow(); });
  it('requires UTC and provenance', () => {
    const p = profile(); p.timestampUtc = '2026-10-08T21:00:00+02:00'; expect(() => integrate(p, band)).toThrow();
    p.timestampUtc = '2026-10-08T21:00:00Z'; p.license = ''; expect(() => integrate(p, band)).toThrow();
  });
  it('uses a declared inclusive experimental threshold and supplied power baseline', () => {
    expect(scenario(integrate(profile(), band), 130, 2, 5)).toEqual({status: 'selected', passageBirdsKm: 260, hypotheticalLossMwh: 10});
    expect(scenario(integrate(profile(), band), 131, 2, 5).hypotheticalLossMwh).toBe(0);
  });
  it('rejects invalid energy/time assumptions', () => { expect(() => scenario(integrate(profile(), band), 100, 0, 5)).toThrow(); });
});

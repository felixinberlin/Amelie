import { describe, it, expect } from 'vitest';
import {
  calculateKMReflectance,
  evaluatePigmentMixture,
  naiveRgbBlend,
  PAPER_REFLECTANCE,
} from './kubelka-munk';
import { PIGMENT_PRESETS } from './presets';

describe('Kubelka-Munk Optical Engine', () => {
  it('returns paper substrate reflectance when layer thickness or concentration is zero', () => {
    const R = calculateKMReflectance(0.5, 0.5, 0, 0.95);
    expect(R).toBe(0.95);

    const zeroCoeff = calculateKMReflectance(0, 0, 1.0, 0.95);
    expect(zeroCoeff).toBe(0.95);
  });

  it('approaches theoretical infinite layer limit R_inf for thick pigment deposits', () => {
    const K = 2.0;
    const S = 1.0;
    const a = 1.0 + K / S; // 3.0
    const b = Math.sqrt(a * a - 1.0); // sqrt(8) ~ 2.8284
    const theoreticalRinf = a - b; // ~ 0.17157

    const R_thick = calculateKMReflectance(K, S, 50.0, 0.95);
    expect(R_thick).toBeCloseTo(theoreticalRinf, 3);
  });

  it('keeps reflectance strictly in the physically plausible [0, 1] range', () => {
    const extremeDark = calculateKMReflectance(100.0, 0.01, 10.0, 0.95);
    expect(extremeDark).toBeGreaterThanOrEqual(0.0);
    expect(extremeDark).toBeLessThanOrEqual(1.0);

    const extremeLight = calculateKMReflectance(0.001, 10.0, 1.0, 0.98);
    expect(extremeLight).toBeGreaterThanOrEqual(0.0);
    expect(extremeLight).toBeLessThanOrEqual(1.0);
  });

  it('evaluates mixture of yellow and blue to yield optical green instead of muddy RGB gray', () => {
    const yellow = PIGMENT_PRESETS.find(p => p.id === 'kadmiumgelb')!;
    const blue = PIGMENT_PRESETS.find(p => p.id === 'preussischblau')!;

    expect(yellow).toBeDefined();
    expect(blue).toBeDefined();

    const mixed = evaluatePigmentMixture([
      { km: yellow.km, concentration: 0.5 },
      { km: blue.km, concentration: 0.5 },
    ], 1.0, PAPER_REFLECTANCE);

    // Green channel should dominate over red and blue in subtractive absorption
    // Red absorbed by blue pigment; Blue absorbed by yellow pigment -> Green reflected!
    expect(mixed[1]).toBeGreaterThan(mixed[0]); // Green > Red
    expect(mixed[1]).toBeGreaterThan(mixed[2]); // Green > Blue
  });

  it('returns paper reflectance when mixture has no components or zero concentration', () => {
    const emptyMix = evaluatePigmentMixture([]);
    expect(emptyMix).toEqual([...PAPER_REFLECTANCE]);

    const zeroMix = evaluatePigmentMixture([
      { km: PIGMENT_PRESETS[0].km, concentration: 0 },
    ]);
    expect(zeroMix).toEqual([...PAPER_REFLECTANCE]);
  });

  it('demonstrates naive RGB blend produces muddy arithmetic averages', () => {
    const yellowRgb: [number, number, number] = [240, 200, 30];
    const blueRgb: [number, number, number] = [20, 50, 180];
    const naive = naiveRgbBlend(yellowRgb, 0.5, blueRgb, 0.5);

    // Naive linear blend gives grayish muddy color
    expect(naive[0]).toBe(130);
    expect(naive[1]).toBe(125);
    expect(naive[2]).toBe(105);
  });
});

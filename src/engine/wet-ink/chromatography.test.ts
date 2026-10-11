import { describe, it, expect } from 'vitest';
import {
  lucasWashburnRadius,
  simulateRadialChromatography,
  PIGMENT_PARTICLE_CATALOG
} from './chromatography';
import { PIGMENT_PRESETS } from './presets';
import { ciede2000, srgbToLab } from './color-science';

describe('Radial Capillary Chromatography & Multi-Pigment Separation', () => {
  describe('Lucas-Washburn Capillary Front Model (Lucas 1918; Washburn 1921)', () => {
    it('returns exact initial radius R0 at t = 0', () => {
      const r0 = 3.5;
      expect(lucasWashburnRadius(r0, 0)).toBe(r0);
    });

    it('demonstrates asymptotic diffusive square-root scaling R(t) ∝ sqrt(t)', () => {
      const r0 = 2.0;
      const r1 = lucasWashburnRadius(r0, 1.0);
      const r4 = lucasWashburnRadius(r0, 4.0);

      // (r(4)^2 - r0^2) / (r(1)^2 - r0^2) must equal 4.0 exactly according to Washburn's law
      const delta1 = r1 * r1 - r0 * r0;
      const delta4 = r4 * r4 - r0 * r0;
      expect(delta4 / delta1).toBeCloseTo(4.0, 3);
    });

    it('wicks faster in raw Xuan paper (larger pore radius) than tight copy paper', () => {
      const t = 1.0;
      const r0 = 2.0;
      const rRawXuan = lucasWashburnRadius(r0, t, 12.0, 15.0); // 12 µm pore, 15° contact angle
      const rCopy = lucasWashburnRadius(r0, t, 2.0, 75.0);     // 2 µm pore, 75° contact angle
      expect(rRawXuan).toBeGreaterThan(rCopy * 2.0);
    });
  });

  describe('Multi-Pigment Separation: Sumi Pine Soot vs. Cinnabar Vermilion (Fen-Mo)', () => {
    it('separates coarse mineral cinnabar from fine colloidal soot radially', () => {
      const sumi = PIGMENT_PRESETS.find(p => p.id === 'sumi')!;
      const zinnober = PIGMENT_PRESETS.find(p => p.id === 'zinnober')!;

      const result = simulateRadialChromatography([
        {
          pigment: zinnober,
          initialFraction: 0.5,
          particle: PIGMENT_PARTICLE_CATALOG.zinnober,
        },
        {
          pigment: sumi,
          initialFraction: 0.5,
          particle: PIGMENT_PARTICLE_CATALOG.sumi,
        },
      ], 3.0, 1.2, 100);

      expect(result.peakRadii).toHaveLength(2);
      expect(result.retentionFactors).toHaveLength(2);

      const rfZinnober = result.retentionFactors[0];
      const rfSumi = result.retentionFactors[1];

      // Physical expectation: Fine soot nano-aggregates (Rf ~ 0.94) travel noticeably further
      // than heavy cinnabar mineral grains (Rf ~ 0.62)
      expect(rfSumi).toBeGreaterThan(rfZinnober);
      expect(result.peakRadii[1]).toBeGreaterThan(result.peakRadii[0]);

      // Perceptual color shift: CIEDE2000 ΔE₀₀ from cinnabar-dominated core to smoky perimeter
      const maxDeltaE = Math.max(...Array.from(result.deltaEProfile));
      expect(maxDeltaE).toBeGreaterThan(12.0); // Immediately perceptible separation to the human eye
    });
  });

  describe('Subtractive Color Transition: Prussian Blue + Cadmium Yellow Wash', () => {
    it('develops an olive/emerald center and a vivid cyan-blue chromatographic halo', () => {
      const blue = PIGMENT_PRESETS.find(p => p.id === 'preussischblau')!;
      const yellow = PIGMENT_PRESETS.find(p => p.id === 'kadmiumgelb')!;

      const result = simulateRadialChromatography([
        {
          pigment: yellow,
          initialFraction: 0.5,
          particle: PIGMENT_PARTICLE_CATALOG.kadmiumgelb,
        },
        {
          pigment: blue,
          initialFraction: 0.5,
          particle: PIGMENT_PARTICLE_CATALOG.preussischblau,
        },
      ], 2.5, 1.5, 120);

      const rfYellow = result.retentionFactors[0];
      const rfBlue = result.retentionFactors[1];

      // Prussian blue colloidal particles outpace coarser cadmium yellow crystals
      expect(rfBlue).toBeGreaterThan(rfYellow);
      expect(result.peakRadii[1]).toBeGreaterThan(result.peakRadii[0]);

      // Check spectral color shift between the yellow-rich inner ring and the blue-rich outer ring
      const dr = result.radialGrid[1] - result.radialGrid[0];
      const peak0Rgb = result.srgbProfile[Math.floor(result.peakRadii[0] / dr)];
      const peak1Rgb = result.srgbProfile[Math.floor(result.peakRadii[1] / dr)];

      // Inner peak has warm red/yellow dominance; outer peak has distinctly higher blue-to-red ratio
      const peak0BlueToRed = peak0Rgb[2] / (peak0Rgb[0] + 1);
      const peak1BlueToRed = peak1Rgb[2] / (peak1Rgb[0] + 1);
      expect(peak1BlueToRed).toBeGreaterThan(peak0BlueToRed * 1.25);

      // Quantify perceptible color difference between the two separated pigment zones
      const dE = ciede2000(
        srgbToLab(peak0Rgb[0], peak0Rgb[1], peak0Rgb[2]),
        srgbToLab(peak1Rgb[0], peak1Rgb[1], peak1Rgb[2])
      );
      expect(dE).toBeGreaterThan(6.0); // Distinct visible color change between chromatographic zones
    });
  });
});

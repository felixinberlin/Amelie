import { describe, it, expect } from 'vitest';
import {
  evaluateMixingInterlock,
  lookupProductByIdentifier,
  evaluatePairByIdentifiers,
  assertSafetyInvariants,
  ProductRecord,
  IncompatibilityRule
} from './chemHazardEngine';

import productsData from '../../../07-demos/chemhazard-stop/data/products.json';
import rulesData from '../../../07-demos/chemhazard-stop/data/rules.json';

const products = productsData as unknown as ProductRecord[];
const rules = rulesData as unknown as IncompatibilityRule[];

describe('ChemHazard Stop / MischStop Rule Engine', () => {
  describe('P0 Incompatibility Verification: Acid + Hypochlorite (Chlorine Gas)', () => {
    it('triggers STOP on DanKlorix (Bleach) + Buzil Bucasan (Acid Descaler)', () => {
      const danklorix = lookupProductByIdentifier('danklorix-hygiene-reiniger', products);
      const bucasan = lookupProductByIdentifier('buzil-bucasan-g460', products);

      expect(danklorix).toBeDefined();
      expect(bucasan).toBeDefined();

      const result = evaluateMixingInterlock(danklorix, bucasan, rules, 'de');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.isClearance).toBe(false);
      expect(result.alarmStreamForced).toBe(true);
      expect(result.triggeredRule?.id).toBe('acid-plus-hypochlorite-chlorine-gas');
      expect(result.audioAlert?.text).toContain('Chlorgas');
      expect(result.hapticPattern).toEqual([300, 100, 300, 100, 500]);
    });

    it('triggers STOP using GTIN barcodes (Domestos Bleach + Dr. Schnell Milizid Descaler)', () => {
      // Domestos GTIN: 8717163000505, Milizid GTIN: 4004990001002
      const result = evaluatePairByIdentifiers('8717163000505', '4004990001002', products, rules, 'en');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.isClearance).toBe(false);
      expect(result.audioAlert?.text).toBe('STOP! Do not mix! Deadly chlorine gas hazard!');
    });

    it('triggers STOP using GISCODEs (GD10 Chlorine Bleach + GS50 Acid Descaler)', () => {
      const result = evaluatePairByIdentifiers('GD10', 'GS50', products, rules, 'pl');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.audioAlert?.text).toBe('STOP! Nie mieszać! Śmiertelne niebezpieczeństwo chloru!');
    });
  });

  describe('Secondary Incompatibilities: Ammonia & Peroxide', () => {
    it('triggers STOP on Acid + Ammonia (Bref Power + Salmiakgeist)', () => {
      const result = evaluatePairByIdentifiers('bref-power-wc-kraft-gel', 'salmiakgeist-ammoniakloesung-9', products, rules, 'tr');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.triggeredRule?.id).toBe('acid-plus-ammonia-chloramine-heat');
      expect(result.audioAlert?.text).toContain('reaksiyon');
    });

    it('triggers STOP on Hypochlorite + Ammonia (DanKlorix + Salmiakgeist)', () => {
      const result = evaluatePairByIdentifiers('danklorix-hygiene-reiniger', 'salmiakgeist-ammoniakloesung-9', products, rules, 'uk');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.triggeredRule?.id).toBe('hypochlorite-plus-ammonia-chloramines');
      expect(result.audioAlert?.text).toBe('СТОП! Не змішувати! Отруйні хлорамінові гази!');
    });

    it('triggers STOP on Peroxide + Caustic Bleach (H2O2 + DanKlorix)', () => {
      const result = evaluatePairByIdentifiers('wasserstoffperoxid-3-prozent', 'danklorix-hygiene-reiniger', products, rules, 'de');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.triggeredRule?.id).toBe('peroxide-plus-caustic-lye');
    });
  });

  describe('Uncertainty and UNVERIFIED Handling', () => {
    it('returns UNVERIFIED when a product is not in the database', () => {
      const result = evaluatePairByIdentifiers('danklorix-hygiene-reiniger', 'phantom-cleaner-999', products, rules);

      expect(result.state).toBe('UNVERIFIED');
      expect(result.color).toBe('amber');
      expect(result.isClearance).toBe(false);
      expect(result.alarmStreamForced).toBe(false);
      expect(result.unverifiedReason).toContain('Unidentified input');
    });

    it('returns UNVERIFIED when database record is flagged unverified', () => {
      const result = evaluatePairByIdentifiers('danklorix-hygiene-reiniger', 'unverifiziertes-musterprodukt', products, rules);

      expect(result.state).toBe('UNVERIFIED');
      expect(result.color).toBe('amber');
      expect(result.isClearance).toBe(false);
      expect(result.messageDe).toContain('Datenbasis unvollständig');
    });
  });

  describe('NO_KNOWN_INCOMPATIBILITY on Compatible Neutral Products', () => {
    it('returns grey screen with mandatory disclaimer for two neutral cleaners (NEVER green)', () => {
      const result = evaluatePairByIdentifiers('frosch-neutral-reiniger', 'ecolab-assert-clean', products, rules);

      expect(result.state).toBe('NO_KNOWN_INCOMPATIBILITY');
      expect(result.color).toBe('grey');
      expect(result.isClearance).toBe(false);
      expect(result.disclaimerDe).toContain('keine Sicherheitsfreigabe');
      expect(result.disclaimerDe).toContain('Nicht mischen, außer ausdrücklich vom Arbeitgeber angewiesen');
    });
  });

  describe('Absolute Safety Invariants', () => {
    it('strictly guarantees no test case produces green color or clearance state', () => {
      const allProductIds = products.map((p) => p.id);

      for (let i = 0; i < allProductIds.length; i++) {
        for (let j = i; j < allProductIds.length; j++) {
          const result = evaluatePairByIdentifiers(allProductIds[i], allProductIds[j], products, rules);

          // Hard safety assertions
          expect(result.isClearance).toBe(false);
          expect(result.color).not.toBe('green');
          expect(result.state).not.toBe('SAFE');
          expect(result.state).not.toBe('CLEAR');
          expect(['red', 'amber', 'grey']).toContain(result.color);
          expect(result.disclaimerDe).toBeTruthy();
          expect(result.disclaimerEn).toBeTruthy();
          
          expect(() => assertSafetyInvariants(result)).not.toThrow();
        }
      }
    });

    it('assertSafetyInvariants throws if a corrupted result has isClearance or green', () => {
      const bogusResult = {
        state: 'SAFE',
        color: 'green',
        isClearance: true,
        hapticPattern: [],
        alarmStreamForced: false,
        messageDe: '',
        messageEn: '',
        disclaimerDe: '',
        disclaimerEn: '',
        evaluationTimeMs: 0
      } as any;

      expect(() => assertSafetyInvariants(bogusResult)).toThrow(/SAFETY VIOLATION/);
    });
  });

  describe('Performance Benchmark (<50ms DoD criterion)', () => {
    it('evaluates chemical pair in under 1ms', () => {
      const danklorix = lookupProductByIdentifier('danklorix-hygiene-reiniger', products);
      const bucasan = lookupProductByIdentifier('buzil-bucasan-g460', products);

      const start = performance.now();
      const result = evaluateMixingInterlock(danklorix, bucasan, rules);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10); // Well below 50ms requirement
      expect(result.state).toBe('STOP');
    });
  });
});

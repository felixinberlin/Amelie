import { describe, it, expect } from 'vitest';
import {
  evaluateMixingInterlock,
  lookupProductByIdentifier,
  evaluatePairByIdentifiers,
  assertSafetyInvariants,
  isValidGtin,
  gtinFromScan,
  gs1DigitalLink,
  ProductRecord,
  IncompatibilityRule
} from './chemHazardEngine';
import { ean13Modules, decodeEan13Modules } from './ean13';
// @ts-expect-error plain ESM script without type declarations
import { barcodeFiles, checkProducts, deriveChemicalGroups, parseSdsText } from '../../../scripts/chemhazard-sds.mjs';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

import productsData from '../../../07-demos/chemhazard-stop/data/products.json';
import rulesData from '../../../07-demos/chemhazard-stop/data/rules.json';

const products = productsData as unknown as ProductRecord[];
const rules = rulesData as unknown as IncompatibilityRule[];
const fullyReviewed = (p: ProductRecord): ProductRecord => ({ ...p,
  completenessReviewed: true, currentVersionChecked: true,
  hazardStatementsEvidence: p.hazardStatements.length ? 'documented' : 'documented_absence',
  reviewMetadata: { ...p.reviewMetadata,
    completenessReviewed: { date: '2026-10-12', basis: 'Synthetic regression review only' },
    currentVersionChecked: { date: '2026-10-12', basis: 'Synthetic regression review only' } }
});
const byId = (id: string) => products.find((p) => p.id === id) as ProductRecord;

describe('ChemHazard Stop / MischStop Rule Engine', () => {
  describe('P0 Incompatibility Verification: Acid + Hypochlorite (Chlorine Gas)', () => {
    it('triggers STOP on Dan Klorix (bleach) + Buzil Bucalex (phosphoric acid)', () => {
      const danklorix = lookupProductByIdentifier('danklorix-hygiene-reiniger', products);
      const bucalex = lookupProductByIdentifier('buzil-bucalex-g460', products);

      expect(danklorix).not.toBeNull();
      expect(bucalex).not.toBeNull();

      const result = evaluateMixingInterlock(danklorix, bucalex, rules, 'de');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.isClearance).toBe(false);
      expect(result.alarmStreamForced).toBe(true);
      expect(result.triggeredRule?.id).toBe('acid-plus-hypochlorite-chlorine-gas');
      expect(result.audioAlert?.text).toContain('Chlorgas');
      expect(result.hapticPattern).toEqual([300, 100, 300, 100, 500]);
    });

    it('triggers STOP using real GTIN barcodes (Kiehl ARENAS-bleach + Kiehl Powerfix-Gel)', () => {
      const result = evaluatePairByIdentifiers('4031255046754', '4031255000121', products, rules, 'en');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.isClearance).toBe(false);
      expect(result.audioAlert?.text).toBe('STOP! Do not mix! Deadly chlorine gas hazard!');
    });

    it('resolves every container size of a product to the same record', () => {
      const powerfixGel = byId('kiehl-powerfix-gel');
      expect((powerfixGel.gtins ?? []).length).toBeGreaterThan(1);
      for (const gtin of powerfixGel.gtins ?? []) {
        expect(lookupProductByIdentifier(gtin, products)?.id).toBe('kiehl-powerfix-gel');
      }
    });

    it('triggers STOP from a GS1 Digital Link QR payload and from a UFI', () => {
      const qr = gs1DigitalLink('4031255046754');
      expect(qr).toBe('https://id.gs1.org/01/04031255046754');
      const result = evaluatePairByIdentifiers(qr, '3U20-V0J5-1002-NR4J', products, rules, 'pl');

      expect(result.state).toBe('STOP');
      expect(result.audioAlert?.text).toBe('STOP! Nie mieszać! Śmiertelne niebezpieczeństwo chloru!');
    });

    // Regression: the rule used to demand EUH031 on one of the two labels. Real bleach
    // labels often carry EUH206 instead, or neither phrase, and the pair slipped through.
    it('triggers STOP for bleach whose label lacks EUH031', () => {
      const withoutEuh031 = products.filter(
        (p) => p.hazardsConfirmed && p.chemicalGroups.includes('hypochlorite') && !p.hazardStatements.includes('EUH031')
      );
      expect(withoutEuh031.map((p) => p.id)).toEqual(
        expect.arrayContaining(['danklorix-hygiene-reiniger', 'domestos-professional-original'])
      );
      for (const bleach of withoutEuh031) {
        const result = evaluateMixingInterlock(bleach, byId('dr-schnell-milizid'), rules);
        expect(result.state).toBe('STOP');
        expect(result.triggeredRule?.id).toBe('acid-plus-hypochlorite-chlorine-gas');
      }
    });

    it('warns for every sourced acid + hypochlorite pair in this catalogue', () => {
      const acids = products.filter((p) => p.hazardsConfirmed && p.chemicalGroups.includes('acid'));
      const bleaches = products.filter((p) => p.hazardsConfirmed && p.chemicalGroups.includes('hypochlorite'));
      expect(acids.length).toBeGreaterThanOrEqual(5);
      expect(bleaches.length).toBeGreaterThanOrEqual(3);
      for (const acid of acids) {
        for (const bleach of bleaches) {
          expect(evaluateMixingInterlock(acid, bleach, rules).state).toBe('STOP');
          expect(evaluateMixingInterlock(bleach, acid, rules).state).toBe('STOP');
        }
      }
    });
  });

  describe('Secondary Incompatibilities: Ammonia & Peroxide', () => {
    it('triggers STOP on Acid + Ammonia (Kiehl Calinex + Salmiakgeist)', () => {
      const result = evaluatePairByIdentifiers('kiehl-calinex', 'meffert-salmiakgeist-9-5', products, rules, 'tr');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.triggeredRule?.id).toBe('acid-plus-ammonia-chloramine-heat');
      expect(result.audioAlert?.text).toContain('reaksiyon');
    });

    it('triggers STOP on Hypochlorite + Ammonia (Dan Klorix + Salmiakgeist)', () => {
      const result = evaluatePairByIdentifiers('danklorix-hygiene-reiniger', 'meffert-salmiakgeist-9-5', products, rules, 'uk');

      expect(result.state).toBe('STOP');
      expect(result.color).toBe('red');
      expect(result.triggeredRule?.id).toBe('hypochlorite-plus-ammonia-chloramines');
      expect(result.audioAlert?.text).toBe('СТОП! Не змішувати! Отруйні хлорамінові гази!');
    });

    it('triggers STOP on Peroxide + Caustic Lye (Kiehl Oxycal + Kiehl Fumex)', () => {
      const result = evaluatePairByIdentifiers('kiehl-oxycal', 'kiehl-fumex', products, rules, 'de');

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

    it('returns UNVERIFIED for a barcode with a wrong check digit', () => {
      expect(gtinFromScan('4031255000120')).toBeNull();
      const result = evaluatePairByIdentifiers('4031255000120', 'danklorix-hygiene-reiniger', products, rules);
      expect(result.state).toBe('UNVERIFIED');
    });

    it('does not guess a product from a GISCODE that several products share', () => {
      const shared = products.filter((p) => p.giscode === 'GS80');
      expect(shared.length).toBeGreaterThan(1);
      expect(lookupProductByIdentifier('GS80', products)).toBeNull();
      expect(evaluatePairByIdentifiers('GS80', 'danklorix-hygiene-reiniger', products, rules).state).toBe('UNVERIFIED');
    });

    it('never resolves even a unique GISCODE', () => {
      expect(lookupProductByIdentifier('GG70', products)).toBeNull();
      expect(lookupProductByIdentifier('gg 70', products)).toBeNull();
    });
  });

  describe('NO_KNOWN_INCOMPATIBILITY on Compatible Products', () => {
    it('returns grey screen with mandatory disclaimer for two maintenance cleaners (NEVER green)', () => {
      const reviewed = ['kiehl-sanikal', 'kiehl-torvan-konzentrat'].map((id) => fullyReviewed(byId(id)));
      const result = evaluateMixingInterlock(reviewed[0], reviewed[1], rules);

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
      const bucalex = lookupProductByIdentifier('buzil-bucalex-g460', products);

      const start = performance.now();
      const result = evaluateMixingInterlock(danklorix, bucalex, rules);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10); // Well below 50ms requirement
      expect(result.state).toBe('STOP');
    });
  });
});

describe('ChemHazard seed data guard', () => {
  it('passes the provenance, GTIN and derivation checks', () => {
    expect(checkProducts(products)).toEqual([]);
  });

  it('counts what the README and roadmap claim', () => {
    expect(products.filter((p) => p.hazardsConfirmed).length).toBe(41);
    expect(products.filter((p) => p.sourceType === 'sds').length).toBe(40);
    expect(products.flatMap((p) => p.gtins ?? []).length).toBe(92);
  });

  // Counter-probes: the guard must reject deliberately wrong input.
  it('rejects a GTIN with a wrong check digit', () => {
    const bad = [{ ...byId('kiehl-sanikal'), gtins: ['4031255000100'] }];
    expect(checkProducts(bad).join('\n')).toContain('falsche Prüfziffer');
    expect(isValidGtin('4031255000183')).toBe(true);
    expect(isValidGtin('4031255000100')).toBe(false);
  });

  it('rejects a verified record without source URL, hash or revision date', () => {
    const p = byId('kiehl-sanikal');
    const bad = [{ ...p, provenance: { sourceDocument: 'SDB', verificationDate: '2026-10-12' } }];
    const found = checkProducts(bad).join('\n');
    expect(found).toContain('ohne sourceUrl');
    expect(found).toContain('ohne SHA-256');
    expect(found).toContain('ohne Überarbeitungsdatum');
  });

  it('rejects hand-edited chemical groups that contradict the CAS numbers', () => {
    const bad = [{ ...byId('kiehl-arenas-bleach'), chemicalGroups: ['neutral'] }];
    expect(checkProducts(bad).join('\n')).toContain('weichen von der Ableitung');
  });

  it('rejects the same GTIN on two products', () => {
    const a = byId('kiehl-sanikal');
    const b = { ...byId('kiehl-santex'), gtins: [a.gtins![0]] };
    expect(checkProducts([a, b]).join('\n')).toContain('steht auch bei kiehl-sanikal');
  });

  it('derives hypochlorite from the CAS number alone, without any EUH phrase', () => {
    expect(deriveChemicalGroups({ casNumbers: ['7681-52-9'], hazardStatements: ['H314'] }).groups).toEqual(
      expect.arrayContaining(['hypochlorite', 'oxidizer'])
    );
    expect(deriveChemicalGroups({ casNumbers: [], hazardStatements: ['EUH206'] }).groups).toContain('hypochlorite');
    expect(deriveChemicalGroups({ casNumbers: ['69011-36-5'], hazardStatements: [] }).groups).toEqual(['unknown']);
  });

  it('parses a safety data sheet text into facts', () => {
    const text = [
      'Überarbeitet am: 12.12.2022 Materialnummer: x',
      'ABSCHNITT 1: Bezeichnung',
      'UFI: 3U20-V0J5-1002-NR4J',
      'ABSCHNITT 2: Mögliche Gefahren',
      'Skin Corr. 1B; H314',
      'Signalwort:',
      'Gefahr',
      'EUH031 Entwickelt bei Berührung mit Säure giftige Gase.',
      'ABSCHNITT 3: Zusammensetzung',
      '5 - < 10 % 7681-52-9 Natriumhypochlorit 231-668-3 017-011-00-1 H290 H400',
      'ABSCHNITT 4: Erste Hilfe',
      'GS80 GISCODE/Produkt-Code:',
      'ABSCHNITT 9: Physikalische Eigenschaften',
      'pH-Wert (bei 20 °C): > 12,5 K-QP1012C',
      'ABSCHNITT 10: Stabilität',
      'ABSCHNITT 11: Toxikologie'
    ].join('\n');
    const facts = parseSdsText(text);
    expect(facts.revisionDate).toBe('2022-12-12');
    expect(facts.ufi).toBe('3U20-V0J5-1002-NR4J');
    expect(facts.giscode).toBe('GS80');
    expect(facts.signalWord).toBe('Gefahr');
    // Section 3 lists the statements of single substances; they are not the label of the mixture.
    expect(facts.hazardStatements).toEqual(['EUH031', 'H314']);
    // The index number 017-011-00-1 must not be read as a CAS number.
    expect(facts.casNumbers).toEqual(['7681-52-9']);
    expect(facts.ph).toEqual({ min: 12.5 });
    expect(facts.chemicalGroups).toEqual(expect.arrayContaining(['hypochlorite', 'caustic_lye', 'oxidizer']));
  });
});

describe('EAN-13 barcode modules', () => {
  it('encodes every catalog EAN-13 so that it decodes back to the same number', () => {
    const gtins = products.flatMap((p) => p.gtins ?? []).map((g) => g.slice(1));
    expect(gtins.length).toBeGreaterThan(40);
    for (const gtin of gtins) {
      const modules = ean13Modules(gtin);
      expect(modules).toHaveLength(95);
      expect(decodeEan13Modules(modules as string)).toBe(gtin);
    }
  });

  // Worked by hand from the GS1 tables: first digit 4 selects the parity LGLLGG.
  it('matches the hand-derived pattern for 4006381333931', () => {
    expect(ean13Modules('4006381333931')).toBe(
      '101' + '0001101' + '0100111' + '0101111' + '0111101' + '0001001' + '0110011' + '01010' +
        '1000010' + '1000010' + '1000010' + '1110100' + '1000010' + '1100110' + '101'
    );
  });

  it('keeps one current SVG per catalog GTIN in data/barcodes, encoded like the engine does', () => {
    const dir = '07-demos/chemhazard-stop/data/barcodes';
    const want = barcodeFiles(products) as Record<string, string>;
    expect(Object.keys(want)).toHaveLength(92);
    for (const [name, svg] of Object.entries(want)) {
      expect(existsSync(`${dir}/${name}`), name).toBe(true);
      expect(readFileSync(`${dir}/${name}`, 'utf8')).toBe(svg);
      const gtin = name.replace('.svg', '');
      expect(svg).toContain(`data-modules="${ean13Modules(gtin)}"`);
    }
    expect(readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()).toEqual(Object.keys(want).sort());
  });

  it('refuses a number with a wrong check digit', () => {
    expect(ean13Modules('4031255000120')).toBeNull();
    expect(ean13Modules('123')).toBeNull();
  });
});


describe('Catalogue hardening regressions', () => {
  it('canonicalizes short GTINs and Digital Links to exactly 14 digits', () => {
    expect(gtinFromScan('4031255000121')).toBe('04031255000121');
    expect(gtinFromScan(gs1DigitalLink('4031255000121'))).toBe('04031255000121');
    expect(gtinFromScan('00000096385074')).toBe('00000096385074');
  });
  it('rejects duplicate GTIN, UFI and ID matches rather than selecting the first', () => {
    const a = byId('kiehl-powerfix-gel');
    const b = { ...a, id: 'duplicate' };
    for (const identifier of [a.gtins![0], a.ufi!]) {
      expect(lookupProductByIdentifier(identifier, [a, b])).toBeNull();
      expect(evaluatePairByIdentifiers(identifier, a.id, [a, b], rules).state).toBe('UNVERIFIED');
    }
    expect(lookupProductByIdentifier(a.id, [a, a])).toBeNull();
  });
  it('rejects unconfirmed and undocumented barcode mappings despite valid check digits', () => {
    const a = byId('danklorix-hygiene-reiniger');
    expect(isValidGtin(a.gtins![0])).toBe(true);
    expect(lookupProductByIdentifier(a.gtins![0], products)).toBeNull();
    expect(evaluatePairByIdentifiers(a.gtins![0], 'kiehl-powerfix-gel', products, rules).state).toBe('UNVERIFIED');
    const p = byId('kiehl-powerfix-gel');
    expect(lookupProductByIdentifier(p.gtins![0], [{ ...p, gtinMappings: { [p.gtins![0]]: { confirmed: true } } }])).toBeNull();
  });
  it('preserves sourced STOP with pending completeness and old retailer copies', () => {
    for (const id of ['danklorix-hygiene-reiniger', 'domestos-professional-original', 'mellerud-schimmel-vernichter']) {
      expect(evaluateMixingInterlock(byId(id), byId('kiehl-powerfix-gel'), rules).state).toBe('STOP');
    }
    // Unconfirmed unrelated record facts cannot contribute, but cannot erase a supported trigger.
    const both = { ...byId('kiehl-arenas-bleach'), chemicalGroups: ['acid', 'hypochlorite'] as ProductRecord['chemicalGroups'] };
    expect(evaluateMixingInterlock(both, byId('unverifiziertes-musterprodukt'), rules).state).toBe('STOP');
    expect(evaluateMixingInterlock(both, null, rules).state).toBe('UNVERIFIED');
  });
  it('requires all three documented checks for grey, never grants clearance', () => {
    const a = fullyReviewed(byId('kiehl-sanikal'));
    const b = fullyReviewed(byId('kiehl-torvan-konzentrat'));
    expect(evaluateMixingInterlock(a, b, rules).state).toBe('NO_KNOWN_INCOMPATIBILITY');
    for (const key of ['hazardsConfirmed', 'completenessReviewed', 'currentVersionChecked'] as const) {
      expect(evaluateMixingInterlock({ ...a, [key]: false }, b, rules).state).toBe('UNVERIFIED');
      expect(evaluateMixingInterlock({ ...a, reviewMetadata: { ...a.reviewMetadata, [key]: undefined } }, b, rules).state).toBe('UNVERIFIED');
    }
    expect(evaluateMixingInterlock({ ...a, chemicalGroups: ['unknown'] }, b, rules).state).toBe('UNVERIFIED');
    expect(evaluateMixingInterlock({ ...a, hazardStatementsEvidence: 'undocumented' }, b, rules).state).toBe('UNVERIFIED');
    expect(deriveChemicalGroups({}).groups).toEqual(['unknown']);
  });
  it('keeps completeness pending after source review and all pair outcomes symmetric', () => {
    expect(products.filter((p) => p.completenessReviewed)).toEqual([]);
    expect(products.filter((p) => p.currentVersionChecked)).toHaveLength(36);
    for (const a of products) for (const b of products) {
      const ab = evaluateMixingInterlock(a, b, rules);
      const ba = evaluateMixingInterlock(b, a, rules);
      expect([ab.state, ab.color, ab.triggeredRule?.id]).toEqual([ba.state, ba.color, ba.triggeredRule?.id]);
      expect(ab.isClearance).toBe(false);
      expect(ab.color).not.toBe('green');
    }
  });
});

describe('Manufacturer SDS review and expanded product coverage', () => {
  it('identifies new manufacturer codes without conflating MILIZID variants', () => {
    expect(lookupProductByIdentifier('4008439001045', products)?.id).toBe('dr-schnell-milizid');
    expect(lookupProductByIdentifier('4008439009928', products)?.id).toBe('dr-schnell-milizid-eco');
    expect(lookupProductByIdentifier('4008439001069', products)?.id).toBe('dr-schnell-milizid-kalkreiniger');
    expect(evaluatePairByIdentifiers('4008439044103', '4031255046754', products, rules).state).toBe('STOP');
    expect(evaluatePairByIdentifiers('4008439006156', '4031255046754', products, rules).state).toBe('STOP');
    expect(byId('dr-schnell-perocid').chemicalGroups).toContain('acid');
    expect(byId('dr-schnell-perocid').chemicalGroups).not.toContain('peroxide');
  });

  it('keeps source review distinct from completeness for every added product', () => {
    const expanded = products.filter((p) => p.id.startsWith('dr-schnell-'));
    expect(expanded).toHaveLength(22);
    expect(expanded.every((p) => p.currentVersionChecked && !p.completenessReviewed)).toBe(true);
    expect(evaluatePairByIdentifiers('4008439205931', '4008439036283', products, rules).state).toBe('UNVERIFIED');
    for (const id of ['dr-schnell-onemue-2000', 'dr-schnell-easy-quick-n', 'dr-schnell-ecolution-forol-sticks', 'dr-schnell-desifor-one', 'dr-schnell-desifor-plexifee']) {
      expect(byId(id).chemicalGroups).toContain('unknown');
    }
  });

  it('distinguishes documented absence of H/EUH statements from missing evidence', () => {
    expect(byId('dr-schnell-easy-quick-n').hazardStatementsEvidence).toBe('documented_absence');
    expect(byId('dr-schnell-desifor-plexifee').hazardStatementsEvidence).toBe('documented_absence');
    expect(byId('mellerud-schimmel-vernichter').hazardStatementsEvidence).toBe('undocumented');
  });

  it('uses the newer Meffert manufacturer sheet while retaining unresolved retailer sources', () => {
    const p = byId('meffert-salmiakgeist-9-5');
    expect(p.provenance.sourceHost).toBe('manufacturer');
    expect(p.provenance.revisionDate).toBe('2025-01-28');
    expect(p.ufi).toBe('3A84-40DS-200D-6F0Q');
    expect(p.hazardStatements).not.toContain('H412');
    expect(byId('domestos-professional-original').currentVersionChecked).toBe(false);
    expect(lookupProductByIdentifier('4011200652902', products)).toBeNull();
  });

  it('retains dilution when parsing pH and does not classify concentrate from diluted pH', () => {
    const text = [
      'ABSCHNITT 2: Mögliche Gefahren', 'H319',
      'ABSCHNITT 3: Zusammensetzung', 'ABSCHNITT 4: Erste Hilfe',
      'ABSCHNITT 9: Physikalische Eigenschaften', 'pH-Wert 13 (in wässriger Lösung: 1 % (w/w))',
      'ABSCHNITT 10: Stabilität', 'ABSCHNITT 11: Toxikologie'
    ].join('\n');
    expect(parseSdsText(text).ph).toEqual({ min: 13, max: 13, concentrationPercent: 1 });
    expect(parseSdsText(text).chemicalGroups).toEqual(['unknown']);
    expect(deriveChemicalGroups({ ph: { min: 13, max: 13, concentrationPercent: 100 } }).groups).toContain('caustic_lye');
    expect(deriveChemicalGroups({ ph: { min: 0, max: 0, concentrationPercent: 1 } }).groups).toEqual(['unknown']);
    expect(byId('dr-schnell-desifor-quick').ph?.concentrationPercent).toBe(1);
    expect(byId('dr-schnell-ecolution-forol-sticks').ph?.concentrationPercent).toBe(1);
  });
});

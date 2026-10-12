import { describe, expect, it } from 'vitest';
import { evaluatePairByIdentifiers, isValidGtin, lookupProductByIdentifier, type ProductRecord, type IncompatibilityRule } from './chemHazardEngine';
import productsData from '../../../07-demos/chemhazard-stop/data/products.json';
import rulesData from '../../../07-demos/chemhazard-stop/data/rules.json';
import leads from '../../../07-demos/chemhazard-stop/data/additional-product-research.json';

const products = productsData as unknown as ProductRecord[];
const rules = rulesData as IncompatibilityRule[];
const pendingIds = ['dr-schnell-perotex-intensiv', 'dr-schnell-gastro-pur-eco', 'dr-schnell-milifee', 'dr-schnell-perocid-eco'];

describe('Additional products after merged source review', () => {
  it('adds only four pending entries and preserves reviewed overlapping products', () => {
    expect(products).toHaveLength(47);
    expect(new Set(products.map((p) => p.id)).size).toBe(47);
    expect(products.filter((p) => p.hazardsConfirmed)).toHaveLength(41);
    for (const id of ['dr-schnell-gastro-pur', 'dr-schnell-perocid']) {
      const p = lookupProductByIdentifier(id, products)!;
      expect(p.hazardsConfirmed).toBe(true);
      expect(p.provenance.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(lookupProductByIdentifier(p.gtins![0], products)?.id).toBe(id);
    }
  });
  it.each(pendingIds)('keeps %s selectable but unverified and without confirmed barcode identity', (id) => {
    const lead = leads.products.find((p) => p.productId === id)!;
    const p = lookupProductByIdentifier(id, products)!;
    expect(p.provenance.sourceUrl).toBe(lead.sourceUrl);
    expect(p.gtins).toEqual([lead.gtin]);
    expect(isValidGtin(lead.gtin)).toBe(true);
    expect(p.chemicalGroups).toEqual(['unknown']);
    expect(p.hazardStatements).toEqual([]);
    expect(p.hazardStatementsEvidence).toBe('undocumented');
    expect([p.hazardsConfirmed, p.completenessReviewed, p.currentVersionChecked]).toEqual([false, false, false]);
    expect(p.reviewMetadata).toEqual({});
    expect(p.gtinMappings?.[lead.gtin].confirmed).toBe(false);
    expect(lookupProductByIdentifier(lead.gtin, products)).toBeNull();
    expect(lookupProductByIdentifier(lead.gtin.slice(1), products)).toBeNull();
    const result = evaluatePairByIdentifiers(id, 'kiehl-powerfix-gel', products, rules);
    expect(result.state).toBe('UNVERIFIED');
    expect(result.isClearance).toBe(false);
  });
});

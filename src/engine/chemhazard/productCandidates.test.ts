import { describe, it, expect } from 'vitest';
import { isValidGtin, lookupProductByIdentifier, type ProductRecord } from './chemHazardEngine';
import candidates from '../../../07-demos/chemhazard-stop/data/product-candidates.json';
import productsData from '../../../07-demos/chemhazard-stop/data/products.json';

const products = productsData as unknown as ProductRecord[];

describe('Manufacturer source-reviewed product queue', () => {
  it('records 21 additional products plus existing MILIZID, with 41 published EANs', () => {
    expect(candidates.status).toBe('source_reviewed_completeness_pending');
    expect(candidates.products).toHaveLength(22);
    expect(candidates.products.filter((p) => p.existingProductId === null)).toHaveLength(21);
    const codes = candidates.products.flatMap((p) => p.gtins);
    expect(codes).toHaveLength(41);
    expect(codes.every(isValidGtin)).toBe(true);
    expect(new Set(codes.map((g) => g.padStart(14, '0'))).size).toBe(codes.length);
  });

  it('requires a matching manufacturer SDS and documents remaining package/completeness review', () => {
    for (const p of candidates.products) {
      expect(new URL(p.sourceUrl).hostname).toBe('shop.dr-schnell.com');
      expect(p.status).toBe('source_reviewed');
      expect(p.hazardReviewCompleted).toBe(true);
      expect(p.packageMappingReviewed).toBe(false);
      const record = products.find((r) => r.id === p.runtimeProductId)!;
      expect(record.provenance.sourceUrl).toBe(p.sdsSourceUrl);
      expect(record.completenessReviewed).toBe(false);
      for (const code of p.gtins) {
        expect(lookupProductByIdentifier(code, products)?.id).toBe(p.runtimeProductId);
        expect(lookupProductByIdentifier(code.padStart(14, '0'), products)?.id).toBe(p.runtimeProductId);
      }
    }
  });

  it('keeps empty refill-bottle codes out of product lookup', () => {
    const codes = candidates.products.flatMap((p) => p.gtins);
    for (const excluded of candidates.excludedContainerGtins) {
      expect(codes).not.toContain(excluded.gtin);
      expect(lookupProductByIdentifier(excluded.gtin, products)).toBeNull();
      expect(isValidGtin(excluded.gtin)).toBe(true);
    }
  });
});

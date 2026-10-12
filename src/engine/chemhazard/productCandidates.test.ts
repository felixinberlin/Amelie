import { describe, it, expect } from 'vitest';
import { isValidGtin, lookupProductByIdentifier, type ProductRecord } from './chemHazardEngine';
import candidates from '../../../07-demos/chemhazard-stop/data/product-candidates.json';
import productsData from '../../../07-demos/chemhazard-stop/data/products.json';

const products = productsData as unknown as ProductRecord[];

describe('Manufacturer identity research queue', () => {
  it('records 13 new product candidates and four EANs for existing MILIZID', () => {
    expect(candidates.status).toBe('pending_sds_review');
    expect(candidates.products).toHaveLength(14);
    expect(candidates.products.filter((p) => p.existingProductId === null)).toHaveLength(13);
    const existing = candidates.products.filter((p) => p.existingProductId !== null);
    expect(existing).toHaveLength(1);
    expect(existing[0].existingProductId).toBe('dr-schnell-milizid');
    expect(existing[0].gtins).toHaveLength(4);
    expect(products.some((p) => p.id === existing[0].existingProductId)).toBe(true);
    const codes = candidates.products.flatMap((p) => p.gtins);
    expect(codes).toHaveLength(26);
    expect(codes.every(isValidGtin)).toBe(true);
    expect(new Set(codes.map((g) => g.padStart(14, '0'))).size).toBe(codes.length);
  });

  it('retains manufacturer sources without claiming SDS or package verification', () => {
    for (const p of candidates.products) {
      expect(new URL(p.sourceUrl).hostname).toBe('shop.dr-schnell.com');
      expect(p.status).toBe('pending_sds_review');
      expect(p.hazardReviewCompleted).toBe(false);
      expect(p.packageMappingReviewed).toBe(false);
    }
  });

  it('keeps pending product codes and empty-bottle codes out of runtime lookup', () => {
    const codes = candidates.products.flatMap((p) => p.gtins);
    for (const code of codes) {
      expect(lookupProductByIdentifier(code, products)).toBeNull();
      expect(lookupProductByIdentifier(code.padStart(14, '0'), products)).toBeNull();
    }
    expect(candidates.excludedContainerGtins.map((p) => p.gtin)).toEqual(['4008439312073', '4008439312059']);
    for (const excluded of candidates.excludedContainerGtins) {
      expect(codes).not.toContain(excluded.gtin);
      expect(lookupProductByIdentifier(excluded.gtin, products)).toBeNull();
      expect(isValidGtin(excluded.gtin)).toBe(true);
    }
  });
});

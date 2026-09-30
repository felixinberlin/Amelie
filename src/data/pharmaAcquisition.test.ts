import { describe, it, expect } from 'vitest';
import {
  APPROACHES,
  BASE_ASSUMPTIONS,
  PHARMA_FACTS,
  PHARMA_SOURCES,
  computeAll,
  computeApproach,
} from './pharmaAcquisition';

describe('Apotheken-Vermittlung: Kostenmodell', () => {
  it('rechnet Aufträge, Abschlüsse und Provision der Briefe von Hand nach', () => {
    const letters = APPROACHES.find((a) => a.id === 'letters')!;
    const r = computeApproach(letters, BASE_ASSUMPTIONS);
    expect(r.mandatesPerYear).toBeCloseTo(28 * 0.12, 6);
    expect(r.closingsPerYear).toBeCloseTo(28 * 0.12 * 0.4, 6);
    expect(r.feesPerYear).toBeCloseTo(28 * 0.12 * 0.4 * 30_000, 4);
    expect(r.opexPerYear).toBe(4800);
    expect(r.monthsToFirstFee).toBeCloseTo(1.5 + 1 + 8, 6);
  });

  it('bucht Vorlauf ein: 24-Monats-Ergebnis liegt unter dem eingeschwungenen', () => {
    for (const r of computeAll()) {
      if (r.roi24m === null) continue;
      const steady24 = (r.feesPerYear - r.opexPerYear) * 2 - r.approach.setupEur;
      expect(r.net24m).toBeLessThan(steady24);
    }
  });

  it('zieht bei Empfehlern die Erfolgsvergütung ab', () => {
    const ref = APPROACHES.find((a) => a.id === 'referral')!;
    const withShare = computeApproach(ref);
    const without = computeApproach({ ...ref, successFeeShare: 0 });
    expect(withShare.opexPerYear - without.opexPerYear).toBeCloseTo(without.feesPerYear * 0.15, 4);
    expect(withShare.net24m).toBeLessThan(without.net24m);
  });

  it('gibt der Käuferseite keinen ROI, weil sie allein keine Provision erzeugt', () => {
    const buyers = computeApproach(APPROACHES.find((a) => a.side === 'buy')!);
    expect(buyers.roi24m).toBeNull();
    expect(buyers.feesPerYear).toBe(0);
    expect(buyers.net24m).toBe(-(2000 + 800 * 24));
  });

  it('zeigt: Provision und Preis wirken direkt auf das Ergebnis', () => {
    const letters = APPROACHES.find((a) => a.id === 'letters')!;
    const base = computeApproach(letters);
    const doubled = computeApproach(letters, { ...BASE_ASSUMPTIONS, dealPriceEur: 2_000_000 });
    expect(doubled.feesPerYear).toBeCloseTo(base.feesPerYear * 2, 4);
    const lowClose = computeApproach(letters, { ...BASE_ASSUMPTIONS, mandateToClose: 0 });
    expect(lowClose.paybackMonth).toBeNull();
  });

  it('jede Zahl in den Belegen verweist auf eine gelistete Quelle', () => {
    const ids = new Set(PHARMA_SOURCES.map((s) => s.id));
    for (const f of PHARMA_FACTS) expect(ids.has(f.sourceId)).toBe(true);
    for (const s of PHARMA_SOURCES) expect(s.url.startsWith('https://')).toBe(true);
  });
});

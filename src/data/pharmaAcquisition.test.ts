import { APPROACH_ES, FACTS_ES, TEST_ES } from './pharmaAcquisitionEs';
import { describe, it, expect } from 'vitest';
import {
  APPROACHES,
  BASE_ASSUMPTIONS,
  PHARMA_FACTS,
  PHARMA_LAB_CONTRAST,
  PHARMA_LAB_KILL,
  PHARMA_LAB_MODELS,
  PHARMA_LAB_NEXT,
  PHARMA_LAB_RUN,
  PHARMA_SOURCES,
  computeAll,
  computeApproach,
  cashCurve,
  PHARMA_TEST_PLAN,
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

  it('die Kapitalkurve endet dort, wo das 24-Monats-Ergebnis liegt', () => {
    for (const ap of APPROACHES) {
      const r = computeApproach(ap);
      expect(cashCurve(ap)[24]).toBeCloseTo(r.net24m, 4);
      expect(cashCurve(ap)[0]).toBe(-ap.setupEur);
    }
  });

  it('die spanische Fassung deckt jeden Ansatz, jeden Beleg und jeden Testschritt', () => {
    for (const ap of APPROACHES) {
      const es = APPROACH_ES[ap.id];
      expect(es?.name && es.what && es.risk).toBeTruthy();
    }
    expect(FACTS_ES.length).toBe(PHARMA_FACTS.length);
    expect(TEST_ES.length).toBe(PHARMA_TEST_PLAN.length);
  });

  it('der Lab-Lauf ist dreisprachig und seine Faktenprüfung summiert sich auf 16', () => {
    const reopen = PHARMA_LAB_MODELS.flatMap((m) => (m.reopen ? [m.reopen] : []));
    for (const t of [...PHARMA_LAB_MODELS.flatMap((m) => [m.name, m.note]), ...reopen, ...PHARMA_LAB_CONTRAST, ...PHARMA_LAB_NEXT, ...PHARMA_LAB_KILL]) {
      expect(t.de && t.en && t.es).toBeTruthy();
    }
    // Verworfene Modelle bleiben sichtbar und nennen, was sie wieder öffnen würde.
    for (const m of PHARMA_LAB_MODELS) expect(Boolean(m.reopen)).toBe(m.status === 'killed');
    expect(PHARMA_LAB_MODELS.filter((m) => m.status === 'shortlist').map((m) => m.id)).toEqual(['V1', 'V4']);
    const c = PHARMA_LAB_RUN.factChecks;
    expect(c.supported + c.partial + c.unsupported + c.unchecked).toBe(16);
  });

  it('stützt die Aussagen zum Lab-Lauf: kein Weg bringt im ersten Jahr einen ganzen Abschluss', () => {
    for (const ap of APPROACHES) {
      const r = computeApproach(ap);
      if (r.monthsToFirstFee === null) continue;
      // Erster Auftrag je nach Weg nach 2 bis 9 Monaten, Provision frühestens gerundet in Monat 10.
      expect(ap.monthsToFirstLead + 1).toBeGreaterThanOrEqual(1.5);
      expect(ap.monthsToFirstLead + 1).toBeLessThanOrEqual(9);
      expect(Math.round(r.monthsToFirstFee)).toBeGreaterThanOrEqual(10);
      const feePerClosing = BASE_ASSUMPTIONS.dealPriceEur * BASE_ASSUMPTIONS.feePct;
      const paidYearOne = (cashCurve(ap, BASE_ASSUMPTIONS, 12)[12] + ap.setupEur + ap.monthlyEur * 12) / (feePerClosing * (1 - (ap.successFeeShare ?? 0)));
      expect(paidYearOne).toBeLessThan(1);
    }
  });
});

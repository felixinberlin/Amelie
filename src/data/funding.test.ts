import { describe, it, expect } from 'vitest';
import { FUNDING_DATA, FUNDING_EVENTS, fundingStatus, daysUntil, FundingItem } from './funding';

const base = FUNDING_DATA.find((f) => f.id === 'prototype-fund')!;
const at = (iso: string) => new Date(`${iso}T12:00:00`);

describe('Förderkompass-Daten', () => {
  it('hat eindeutige IDs und https-URLs', () => {
    const ids = FUNDING_DATA.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of FUNDING_DATA) if (f.url) expect(f.url.startsWith('https://')).toBe(true);
  });

  it('verlangt für Fristen ein gültiges ISO-Datum', () => {
    for (const f of FUNDING_DATA) {
      for (const d of [f.deadline, f.opens, f.checked]) {
        if (d) expect(Number.isNaN(new Date(`${d}T00:00:00`).getTime())).toBe(false);
      }
      if (f.timing === 'dated') expect(f.deadline).toBeTruthy();
    }
  });

  it('nennt jedes Ereignis mit existierendem Eintrag', () => {
    const ids = new Set(FUNDING_DATA.map((f) => f.id));
    for (const e of FUNDING_EVENTS) if (e.refId) expect(ids.has(e.refId)).toBe(true);
  });

  it('zeigt Prototype Fund vor dem 01.10. als „öffnet bald", danach „offen", nahe der Frist „Frist naht", später „abgelaufen"', () => {
    expect(fundingStatus(base, at('2026-09-28'))).toBe('opens-soon');
    expect(fundingStatus(base, at('2026-10-15'))).toBe('open');
    expect(fundingStatus(base, at('2026-11-20'))).toBe('closing');
    expect(fundingStatus(base, at('2026-12-01'))).toBe('closed');
  });

  it('behandelt zyklische, laufende und pausierte Einträge ohne Frist-Fehlalarm', () => {
    const cyc = FUNDING_DATA.find((f) => f.id === 'startsocial')!;
    expect(fundingStatus(cyc, at('2026-09-28'))).toBe('cycle');
    const rolling = FUNDING_DATA.find((f) => f.id === 'dbu-digital-natur')!;
    expect(fundingStatus(rolling, at('2030-01-01'))).toBe('rolling');
    const paused = FUNDING_DATA.find((f) => f.id === 'ngi-zero')!;
    expect(fundingStatus(paused, at('2026-09-28'))).toBe('paused');
  });

  it('markiert einmalige Calls nach der Frist als abgelaufen, nie als offen', () => {
    const once: FundingItem = { ...base, timing: 'dated', opens: undefined, deadline: '2026-01-01' };
    expect(fundingStatus(once, at('2026-09-28'))).toBe('closed');
    expect(daysUntil('2026-09-30', at('2026-09-28'))).toBe(3);
  });
});

describe('Gründer & B2B-Zwillinge Datensätze', () => {
  it('enthält alle 8 kommerziellen Zwillinge mit eindeutigen IDs und Preisen', async () => {
    const { VENTURE_LEADS_DATA } = await import('./funding');
    expect(VENTURE_LEADS_DATA.length).toBe(8);
    const ids = VENTURE_LEADS_DATA.map((v) => v.id);
    expect(new Set(ids).size).toBe(8);
    for (const v of VENTURE_LEADS_DATA) {
      expect(v.pricingDe).toBeTruthy();
      expect(v.defensibilityDe).toBeTruthy();
      expect(v.channelDe).toBeTruthy();
    }
  });

  it('enthält Solo-Gründer Leitfäden mit konkreten Summen und Dos and Don’ts', async () => {
    const { SOLO_FOUNDER_GUIDES } = await import('./funding');
    expect(SOLO_FOUNDER_GUIDES.length).toBeGreaterThanOrEqual(6);
    for (const g of SOLO_FOUNDER_GUIDES) {
      expect(g.amountDe).toBeTruthy();
      expect(g.prosDe.length).toBeGreaterThan(0);
      expect(g.watchOutDe).toBeTruthy();
    }
  });

  it('enthält reale NGO- und Smart-City-Challenges mit Schmerzpunkten und Chancen', async () => {
    const { REAL_PROJECTS_DATA } = await import('./funding');
    expect(REAL_PROJECTS_DATA.length).toBeGreaterThanOrEqual(5);
    for (const p of REAL_PROJECTS_DATA) {
      expect(p.initiator).toBeTruthy();
      expect(p.painDe).toBeTruthy();
      expect(p.opportunityDe).toBeTruthy();
    }
  });
});


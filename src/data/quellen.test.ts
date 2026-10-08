import { describe, it, expect } from 'vitest';
import { DOSEN_DATA, DISCARDED_DATA } from './dosen';
import { QUELLEN_DATA, QUELLEN_KATALOG, QUELLEN_TYPEN, quellenScore, quellenEmpfehlung, quellenFuerDose } from './quellen';

describe('Quellen-Register', () => {
  it('Katalog hat sechs Vektoren Q1–Q6', () => {
    expect(QUELLEN_KATALOG.vektoren.map((v) => v.code)).toEqual(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']);
  });

  it('jede Quelle ist vollständig und gültig', () => {
    const statuses = QUELLEN_KATALOG.status.map((s) => s.id);
    const typen = new Set(QUELLEN_TYPEN.map((t) => t.id));
    const ids = new Set<string>();
    for (const q of QUELLEN_DATA) {
      expect(ids.has(q.id), `doppelte id ${q.id}`).toBe(false);
      ids.add(q.id);
      expect(q.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(typen.has(q.typ), `${q.id}: Typ ${q.typ}`).toBe(true);
      expect(QUELLEN_KATALOG.kategorien[q.kategorie], `${q.id}: Kategorie`).toBeDefined();
      expect(statuses).toContain(q.status);
      expect(q.rollen.length).toBeGreaterThan(0);
      for (const r of q.rollen) expect(QUELLEN_KATALOG.rollen[r]).toBeDefined();
      expect(q.vektoren.q).toHaveLength(6);
      for (const s of q.vektoren.q) expect(Number.isInteger(s) && s >= 1 && s <= 5).toBe(true);
      expect(quellenScore(q)).toBeGreaterThanOrEqual(6);
      expect(quellenScore(q)).toBeLessThanOrEqual(30);
      expect(q.verlauf.length).toBeGreaterThan(0);
      if (q.zuletzt) expect(q.zuletzt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const u of q.urls) expect(u).toMatch(/^https?:\/\//);
    }
  });

  it('Ertragsverweise zeigen auf echte Dosen und Gräber', () => {
    const dosen = new Set(DOSEN_DATA.map((d) => d.id));
    const graeber = new Set(DISCARDED_DATA.map((d) => d.id));
    for (const q of QUELLEN_DATA) {
      for (const d of q.ertrag.dosen) expect(dosen.has(d), `${q.id} → Dose ${d}`).toBe(true);
      for (const g of q.ertrag.graeber) expect(graeber.has(g), `${q.id} → Grab ${g}`).toBe(true);
    }
  });

  it('Auswertungshilfen rechnen', () => {
    const lichtplan = quellenFuerDose('lichtplan-check');
    expect(lichtplan.length).toBeGreaterThan(0);
    const offen = QUELLEN_DATA.find((q) => q.status === 'offen')!;
    const erschoepft = QUELLEN_DATA.find((q) => q.status === 'erschöpft')!;
    expect(quellenEmpfehlung(offen)).toBeGreaterThan(quellenEmpfehlung(erschoepft));
  });
});

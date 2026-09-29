import { describe, it, expect } from 'vitest';
import { DOSEN_DATA } from './dosen';
import { DOSE_VECTORS, VECTOR_CATALOG, coreScore, totalScore } from './vectors';

describe('Reviewer-Vektoren (V1–V8)', () => {
  it('Katalog hat acht Vektoren, Fun ist der einzige Nicht-Kernvektor', () => {
    expect(VECTOR_CATALOG).toHaveLength(8);
    expect(VECTOR_CATALOG.filter((d) => !d.core).map((d) => d.key)).toEqual(['fun']);
  });

  it('jede Dose hat Vektoren, jeder Score liegt in 1–5', () => {
    for (const dose of DOSEN_DATA) {
      const vec = DOSE_VECTORS[dose.id];
      expect(vec, `Vektoren fehlen für ${dose.id}`).toBeDefined();
      for (const s of [...vec.v, vec.fun]) expect(s >= 1 && s <= 5).toBe(true);
      expect(vec.funDe.length).toBeGreaterThan(0);
      expect(totalScore(vec)).toBe(coreScore(vec) + vec.fun);
    }
  });

  it('keine Vektoren für unbekannte Dosen', () => {
    const ids = new Set(DOSEN_DATA.map((d) => d.id));
    for (const id of Object.keys(DOSE_VECTORS)) expect(ids.has(id)).toBe(true);
  });
});

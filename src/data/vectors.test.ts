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

describe('Kandidaten-Vektoren', () => {
  it('jeder ungepackte Kandidat hat Vektoren, gepackte erben von ihrer Dose', async () => {
    const { CANDIDATE_IDEAS_DATA } = await import('./unpacked');
    const { CANDIDATE_VECTORS, getCandidateVectors } = await import('./vectors');
    for (const c of CANDIDATE_IDEAS_DATA) {
      const vec = getCandidateVectors(c.id, c.packedDoseId);
      expect(vec, `Vektoren fehlen für Kandidat ${c.id}`).toBeDefined();
      for (const s of [...vec!.v, vec!.fun]) expect(s >= 1 && s <= 5).toBe(true);
    }
    const ids = new Set(CANDIDATE_IDEAS_DATA.map((c) => c.id));
    for (const id of Object.keys(CANDIDATE_VECTORS)) expect(ids.has(id)).toBe(true);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DOSEN_DATA, DISCARDED_DATA } from '../data/dosen';
import { CANDIDATE_IDEAS_DATA } from '../data/unpacked';
import { DOSE_BOOKS } from '../data/doseBooks';
import { DOSE_SIMULATOR_MAP } from '../data/doseSimulators';
import { getActiveDosen, saveDoseLocal } from './doseStorage';
import { getActiveCandidates, saveCandidateLocal } from './candidateStorage';
import { importDatabaseFromJson, exportDatabaseAsJson } from './storageService';

const id = 'gruendungsnavigator';
const retired = { ...DOSEN_DATA[0], id, title: 'Former gift' };
const custom = { ...DOSEN_DATA[0], id: 'my-local-tool', title: 'My local tool' };
const candidate = { ...CANDIDATE_IDEAS_DATA[0], id };

beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe('retired gifts', () => {
  it('keeps the spin-out only in the cemetery, without active book or simulator', () => {
    expect(DOSEN_DATA.some((dose) => dose.id === id)).toBe(false);
    expect(DOSE_BOOKS[id]).toBeUndefined();
    expect(DOSE_SIMULATOR_MAP[id]).toBeUndefined();
    expect(DISCARDED_DATA.find((grave) => grave.id === id)).toMatchObject({
      cause: 'gebaut', killer: 'kommerziell', foundBy: 'eigener-bestand', stage: 'dose',
    });
    expect(CANDIDATE_IDEAS_DATA.some((idea) => idea.packedDoseId === id)).toBe(false);
  });

  it('cannot resurrect an old browser copy while retaining custom gifts and current seeds', () => {
    localStorage.setItem('amelie_custom_dosen', JSON.stringify([retired, custom]));
    expect(getActiveDosen().some((dose) => dose.id === id)).toBe(false);
    expect(getActiveDosen()).toContainEqual(custom);
    expect(getActiveDosen()).toContainEqual(DOSEN_DATA[0]);
    localStorage.setItem('amelie_custom_candidates', JSON.stringify([candidate]));
    expect(getActiveCandidates().some((idea) => idea.id === id)).toBe(false);
  });

  it('rejects retired records on import and save, and exports them only as graves', () => {
    expect(importDatabaseFromJson(JSON.stringify({
      dosen: [retired, custom], unpackedCandidates: [candidate],
    }))).toEqual({ importedDosen: 1, importedCandidates: 0 });
    saveDoseLocal(retired);
    saveCandidateLocal(candidate);
    expect(JSON.parse(localStorage.getItem('amelie_custom_dosen')!).some((dose: { id: string }) => dose.id === id)).toBe(false);
    const exported = JSON.parse(exportDatabaseAsJson(getActiveDosen(), getActiveCandidates()));
    expect(exported.dosen.some((dose: { id: string }) => dose.id === id)).toBe(false);
    expect(exported.discarded.some((grave: { id: string }) => grave.id === id)).toBe(true);
  });
});

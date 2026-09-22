import { describe, it, expect } from 'vitest';
import { DOSE_BOOKS, getBook, findChapter } from './doseBooks';
import { DOSEN_DATA } from './dosen';

const alleKapitel = Object.entries(DOSE_BOOKS).flatMap(([doseId, chapters]) =>
  chapters.map((c) => ({ doseId, ...c }))
);

describe('Buch zur Dose — Registry', () => {
  it('kennt nur Dosen, die es wirklich gibt', () => {
    const ids = new Set(DOSEN_DATA.map((d) => d.id));
    const unbekannt = Object.keys(DOSE_BOOKS).filter((id) => !ids.has(id));
    expect(unbekannt).toEqual([]);
  });

  it('hat je Dose eindeutige Slugs — sonst wäre die Kapitel-URL mehrdeutig', () => {
    for (const [doseId, chapters] of Object.entries(DOSE_BOOKS)) {
      const slugs = chapters.map((c) => c.slug);
      expect(new Set(slugs).size, `Dose ${doseId}`).toBe(slugs.length);
    }
  });

  it('verlinkt jede Quelldatei nur einmal', () => {
    const pfade = alleKapitel.map((c) => c.path);
    expect(new Set(pfade).size).toBe(pfade.length);
  });

  it('nutzt repo-relative Pfade, keine URLs und kein führender Slash', () => {
    for (const c of alleKapitel) {
      expect(c.path.startsWith('/'), c.path).toBe(false);
      expect(c.path.includes('://'), c.path).toBe(false);
      expect(c.path).toMatch(/\.(md|pdf)$/);
    }
  });

  it('deklariert die Art passend zur Dateiendung', () => {
    for (const c of alleKapitel) {
      const erwartet = c.path.endsWith('.pdf') ? 'pdf' : 'md';
      expect(c.kind, c.path).toBe(erwartet);
    }
  });

  it('erklärt jedes Kapitel in beiden Sprachen', () => {
    for (const c of alleKapitel) {
      expect(c.titleDe.length, c.path).toBeGreaterThan(3);
      expect(c.titleEn.length, c.path).toBeGreaterThan(3);
      expect(c.noteDe.length, c.path).toBeGreaterThan(10);
      expect(c.noteEn.length, c.path).toBeGreaterThan(10);
    }
  });

  it('slugs sind URL-tauglich', () => {
    for (const c of alleKapitel) {
      expect(c.slug, c.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe('Buch zur Dose — Zugriff', () => {
  it('gibt für eine Dose ohne Buch eine leere Liste statt undefined', () => {
    expect(getBook('gibt-es-nicht')).toEqual([]);
  });

  it('findet ein Kapitel über seinen Slug', () => {
    const kapitel = findChapter('eurobirdcast', 'besetzung');
    expect(kapitel?.path).toBe('02-recherche/eurobirdcast-besetzung-2026-09-22.md');
  });

  it('gibt undefined für einen unbekannten Slug', () => {
    expect(findChapter('eurobirdcast', 'gibt-es-nicht')).toBeUndefined();
  });
});

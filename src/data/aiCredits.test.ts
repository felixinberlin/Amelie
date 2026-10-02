import { describe, it, expect } from 'vitest';
import { AI_CREDIT_PROGRAMS, AI_CREDIT_PATHS, AI_CREDIT_BLOCKERS, AI_CREDIT_DATES } from './aiCredits';
import { SISTER_PROJECTS, SISTER_GROUPS, SISTER_APPROACHES } from './sisterProjects';

describe('aiCredits', () => {
  it('Programm-IDs sind eindeutig und zweisprachig gefüllt', () => {
    const ids = AI_CREDIT_PROGRAMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of AI_CREDIT_PROGRAMS) {
      expect(p.nameDe && p.nameEn && p.valueDe && p.valueEn && p.whoDe && p.whoEn && p.nextDe && p.nextEn).toBeTruthy();
      expect(p.url).toMatch(/^https:\/\//);
    }
  });
  it('Wege, Hindernisse und Termine sind gefüllt, Termine sortiert', () => {
    expect(AI_CREDIT_PATHS.length).toBeGreaterThan(0);
    expect(AI_CREDIT_BLOCKERS.length).toBeGreaterThan(0);
    const dates = AI_CREDIT_DATES.map((d) => d.date);
    expect([...dates].sort()).toEqual(dates);
  });
  it('die überholte 5.000-Sterne-Schwelle taucht nicht als Bedingung auf', () => {
    const oss = AI_CREDIT_PROGRAMS.find((p) => p.id === 'anthropic-oss')!;
    expect(oss.whoDe).not.toMatch(/5\.000 Sterne/);
  });
});

describe('sisterProjects', () => {
  it('IDs eindeutig, Gruppen und Haltungen gültig, jede Karte hat Kontaktwege', () => {
    const ids = SISTER_PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const groups = new Set(SISTER_GROUPS.map((g) => g.id));
    const approaches = new Set(SISTER_APPROACHES.map((a) => a.id));
    for (const p of SISTER_PROJECTS) {
      expect(groups.has(p.group)).toBe(true);
      expect(approaches.has(p.approach)).toBe(true);
      expect(p.contacts.length).toBeGreaterThan(0);
      expect(p.whatDe && p.whatEn && p.lessonDe && p.lessonEn && p.kinshipDe && p.kinshipEn).toBeTruthy();
    }
  });
  it('E-Mail-Kontakte sehen aus wie Adressen, Links wie URLs', () => {
    for (const p of SISTER_PROJECTS) {
      for (const c of p.contacts) {
        if (c.kind === 'email') expect(c.value).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
        else expect(c.value).toMatch(/^https:\/\//);
      }
    }
  });
  it('die Kernverwandten sind enthalten', () => {
    for (const id of ['fat-lab', 'precious-plastic', 'open-source-ecology', 'open-source-ideas', 'tdcommons']) {
      expect(SISTER_PROJECTS.some((p) => p.id === id)).toBe(true);
    }
  });
});

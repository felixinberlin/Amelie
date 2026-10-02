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

import { SISTER_ETIQUETTE, SISTER_LESSONS } from './sisterProjects';
import { SISTER_ES, CREDITS_ES, UI_ES } from './relativesEs';
import { AI_CREDIT_STEPS, AI_STARTER_STEPS } from './aiCredits';

describe('spanische Oberfläche', () => {
  it('deckt Projekte, Gruppen, Haltungen, Etikette und Lehren ab', () => {
    for (const p of SISTER_PROJECTS) expect(SISTER_ES.taglines[p.id], p.id).toBeTruthy();
    for (const g of SISTER_GROUPS) expect(SISTER_ES.groups[g.id], g.id).toBeTruthy();
    for (const a of SISTER_APPROACHES) expect(SISTER_ES.approaches[a.id], a.id).toBeTruthy();
    expect(SISTER_ES.etiquette).toHaveLength(SISTER_ETIQUETTE.length);
    expect(SISTER_ES.lessons).toHaveLength(SISTER_LESSONS.length);
  });
  it('deckt Wege, Hindernisse, Termine und Schritte der Credits ab', () => {
    for (const p of AI_CREDIT_PATHS) expect(CREDITS_ES.paths[p.id], p.id).toBeTruthy();
    for (const b of AI_CREDIT_BLOCKERS) expect(CREDITS_ES.blockers[b.id], b.id).toBeTruthy();
    for (const d of AI_CREDIT_DATES) expect(CREDITS_ES.dates[d.date], d.date).toBeTruthy();
    expect(CREDITS_ES.steps).toHaveLength(AI_CREDIT_STEPS.length);
    expect(CREDITS_ES.stepTitles).toHaveLength(AI_STARTER_STEPS.length);
  });
  it('die Bedientexte der Gruppen und Haltungen stehen in der Übersetzungstabelle', () => {
    for (const g of SISTER_GROUPS) expect(UI_ES[g.en], g.en).toBeTruthy();
    for (const a of SISTER_APPROACHES) expect(UI_ES[a.en], a.en).toBeTruthy();
  });
});

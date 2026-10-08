import { describe, it, expect } from 'vitest';
import { CANDIDATE_IDEAS_DATA } from './unpacked';
import { DOSEN_DATA } from './dosen';
import { GAME_IDEAS } from './ideas/games';
import { NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS } from './ideas/normalJobsAndEverydayPeople';
import {
  GAME_DOSE_IDS,
  PIPELINE_THEMES,
  isEverydayIdea,
  isGameIdea,
  isPackedIdea,
  pipelineIdeas,
  themeIdOf,
} from './pipeline';
import { sectorOf } from './everydaySectors';

describe('Ideen-Pipeline: jede Idee steht an genau einem Ort', () => {
  it('Ids sind eindeutig', () => {
    const ids = CANDIDATE_IDEAS_DATA.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('Pipeline enthält weder Spiele noch Alltagsberufe noch (standardmäßig) gepackte Ideen', () => {
    const list = pipelineIdeas(CANDIDATE_IDEAS_DATA);
    expect(list.some(isGameIdea)).toBe(false);
    expect(list.some(isEverydayIdea)).toBe(false);
    expect(list.some(isPackedIdea)).toBe(false);
  });

  it('showPacked blendet gepackte Themenideen wieder ein, aber weiter keine Spiele', () => {
    const withPacked = pipelineIdeas(CANDIDATE_IDEAS_DATA, true);
    expect(withPacked.length).toBeGreaterThan(pipelineIdeas(CANDIDATE_IDEAS_DATA).length);
    expect(withPacked.some(isGameIdea)).toBe(false);
  });

  it('Pipeline + Spiele + Alltagsarbeit + gepackte Themenideen = Gesamtliste', () => {
    const all = CANDIDATE_IDEAS_DATA.length;
    const pipeline = pipelineIdeas(CANDIDATE_IDEAS_DATA, true).length;
    const gamesAndEveryday = CANDIDATE_IDEAS_DATA.filter((c) => isGameIdea(c) || isEverydayIdea(c)).length;
    expect(pipeline + gamesAndEveryday).toBe(all);
    expect(gamesAndEveryday).toBe(GAME_IDEAS.length + NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.length);
  });

  it('packedDoseId verweist auf eine existierende Dose', () => {
    const doseIds = new Set(DOSEN_DATA.map((d) => d.id));
    for (const c of CANDIDATE_IDEAS_DATA.filter(isPackedIdea)) {
      expect(doseIds.has(c.packedDoseId!), `${c.id} → ${c.packedDoseId}`).toBe(true);
    }
  });

  it('Spiel-Dosen existieren', () => {
    const doseIds = new Set(DOSEN_DATA.map((d) => d.id));
    for (const id of GAME_DOSE_IDS) expect(doseIds.has(id), id).toBe(true);
  });

  it('jede Idee gehört zu höchstens einem Themenkorb', () => {
    const seen = new Set<string>();
    for (const theme of PIPELINE_THEMES) {
      for (const idea of theme.ideas) {
        expect(seen.has(idea.id), idea.id).toBe(false);
        seen.add(idea.id);
      }
    }
    expect(themeIdOf(CANDIDATE_IDEAS_DATA[0])).toBeTruthy();
  });
});

describe('Alltagsarbeit: Berufsfelder', () => {
  it('jede Idee hat genau ein Berufsfeld', () => {
    for (const idea of NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS) {
      expect(sectorOf(idea), idea.id).not.toBeNull();
    }
  });
});

import { describe, expect, it } from 'vitest';
import { FUGENDUELL_STARTER_ROSTER } from './fugenduellData';
import { BOTANY } from './fugenduellBotany';
import traits from './fugenduellScientificTraits.json';

describe('botanical provenance', () => {
 it('provides a named source and taxon context for every roster species', () => {
  for (const plant of FUGENDUELL_STARTER_ROSTER) {
   const profile = BOTANY[plant.id];
   expect(profile.publisher).toBeTruthy(); expect(profile.scope).toBeTruthy();
   expect(new URL(profile.source).protocol).toBe('https:');
   expect(profile.facts.length).toBeGreaterThan(0);
  }
 });
 it('preserves ordinal qualifiers, missing data and measured unit labels', () => {
  expect(traits['plantago-major'].values['Height [m]']).toBe('0.1–0.4');
  expect(traits['plantago-major'].values['Temperature indicator value']).toBe('5x');
  expect(traits['plantago-major'].values['Life strategy (Pierce method based on leaf traits)']).toBe('C/CR');
  expect(traits['erigeron-canadensis'].values).toEqual({});
  expect(traits['erigeron-canadensis'].error).toBeTruthy();
  expect(traits['cochlearia-danica'].values).not.toHaveProperty('Salinity indicator value');
 });
 it('has plausible CSR sums without silently forcing rounded observations to 100', () => {
  for (const record of Object.values(traits)) {
   if (!('checkedAt' in record)) continue;
   const values=record.values as Record<string,string>;
   const sum=['C','S','R'].reduce((total,axis)=>total+parseFloat(values[`Life strategy (Pierce method, ${axis}-score)`]),0);
   expect(sum).toBeGreaterThanOrEqual(99.8); expect(sum).toBeLessThanOrEqual(100.2);
  }
 });
});

describe('scientific skills', () => {
 it('gives each species four distinct evidence-backed trait cards and no game budget', () => {
  for (const plant of FUGENDUELL_STARTER_ROSTER) {
   expect(plant.skills).toHaveLength(4);
   expect(new Set(plant.skills.map(skill=>skill.id)).size).toBe(4);
   expect(plant.totalBudget).toBeNull();
   expect(plant.growthTimeLapseWeeks).toEqual([]);
   for (const skill of plant.skills) {
    expect(new URL(skill.source).protocol).toBe('https:');
    expect(skill.scope).toBeTruthy();
    expect(skill.descriptionDe).toBeTruthy();
    for (const value of skill.values) if (typeof value.value === 'number') expect(Number.isFinite(value.value)).toBe(true);
   }
   for (const key of ['tritt','duerre','saat','tempo','chemie'] as const) expect(plant.stats[key]).toBeNull();
  }
 });
 it('separates method references from absent physiological observations', () => {
  for (const plant of FUGENDUELL_STARTER_ROSTER) {
   expect(plant.stressMeasurements).toHaveLength(4);
   for (const trait of plant.stressMeasurements) {
    expect(trait.value).toBeNull(); expect(trait.observationSource).toBeNull();
    expect(new URL(trait.methodSource).protocol).toBe('https:');
   }
  }
 });
 it('preserves real units, species means and method-specific CSR', () => {
  const dandelion=FUGENDUELL_STARTER_ROSTER.find(p=>p.id==='taraxacum-officinale')!;
  const plantain=FUGENDUELL_STARTER_ROSTER.find(p=>p.id==='plantago-major')!;
  const moss=FUGENDUELL_STARTER_ROSTER.find(p=>p.id==='bryum-argenteum')!;
  expect(dandelion.stats.wurzel).toBe(1.394675);
  expect(plantain.stats.wurzel).toBe(0.496666666666667);
  expect(plantain.csr).toBe('C/CR');
  expect(moss.stats.wurzel).toBeNull(); expect(moss.csr).toBeNull();
  const roots=dandelion.skills.find(s=>s.id==='belowground')!;
  expect(roots.values.find(v=>v.field==='RDepth')?.unit).toBe('m');
 });
 it('never treats scientific metres or missing measurements as game points', async () => {
  const { calculateSkillModifiers }=await import('../engine/fugenduell/battleEngine');
  const { startCommunity }=await import('../engine/fugenduell/communityEngine');
  expect(()=>calculateSkillModifiers(FUGENDUELL_STARTER_ROSTER[0],FUGENDUELL_STARTER_ROSTER[1],'wurzel')).toThrow('Game conversion pending');
  expect(()=>startCommunity(['taraxacum-officinale','plantago-major','bryum-argenteum'])).toThrow('Game conversion pending');
 });
});

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

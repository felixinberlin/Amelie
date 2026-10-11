import { describe, it, expect } from 'vitest';
import { detectComboHands, getCrackState } from './combos';
import { placeById, CITY_PLACES } from '../../data/fugenduellPlaces';
import { aggregateMonths, monthCards, fromFixture, WeatherYearFixture } from './weatherYear';
import berlin from '../../data/fugenduellWeather/berlin-2025.json';
import { runWatch, speciesProfile } from './watchMode';

describe('combo hands (Balatro meets botany)', () => {
  it('detects Pflaster-Panzer for Plantago + Sagina', () => {
    const team = ['plantago-major', 'sagina-procumbens', 'poa-annua'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands.map(h => h.id)).toContain('pflaster-panzer');
  });

  it('detects Salzwall for Cochlearia + salt-tolerant ally', () => {
    const team = ['cochlearia-danica', 'poa-annua', 'chelidonium-majus'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands.map(h => h.id)).toContain('salzwall');
  });

  it('detects Schirm & Schatten for tall shrub + shade-tolerant ally', () => {
    const team = ['buddleja-davidii', 'cymbalaria-muralis', 'poa-annua'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands.map(h => h.id)).toContain('schirm-schatten');
  });

  it('detects Staffellauf for spring + summer + all-year flowering trio', () => {
    const team = ['cardamine-hirsuta', 'portulaca-oleracea', 'poa-annua'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands.map(h => h.id)).toContain('staffellauf');
  });

  it('detects Mauer-Clan for wall specialists', () => {
    const team = ['asplenium-ruta-muraria', 'cymbalaria-muralis', 'plantago-major'].map(id => speciesProfile(id)!);
    const wall = CITY_PLACES.find(p => p.wallJoint)!;
    expect(detectComboHands(team).map(h => h.id)).not.toContain('mauer-clan');
    const hands = detectComboHands(team, wall);
    expect(hands.map(h => h.id)).toContain('mauer-clan');
  });

  it('detects Hitzewelle-Gang for three heat-loving species', () => {
    const team = ['portulaca-oleracea', 'buddleja-davidii', 'cymbalaria-muralis'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands.map(h => h.id)).toContain('hitzewelle-gang');
  });

  it('detects Kinderstube for Sagina + annual therophyte', () => {
    const team = ['sagina-procumbens', 'cardamine-hirsuta', 'poa-annua'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands.map(h => h.id)).toContain('kinderstube');
  });

  it('detects Ameisenstraße for Chelidonium + ally', () => {
    const team = ['chelidonium-majus', 'poa-annua', 'plantago-major'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands.map(h => h.id)).toContain('ameisenstrasse');
  });

  it('detects Sukzessionskette for annual + perennial + tall shrub', () => {
    const team = ['cardamine-hirsuta', 'plantago-major', 'buddleja-davidii'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands.map(h => h.id)).toContain('sukzessionskette');
  });

  it('returns empty array when no known combo matches', () => {
    const team = ['asplenium-ruta-muraria', 'plantago-major', 'poa-annua'].map(id => speciesProfile(id)!);
    const hands = detectComboHands(team);
    expect(hands).toHaveLength(0);
  });
});

describe('crack evolution (Manu et al. 2025)', () => {
  it('advances from mineral grit (L1) to organic carbon sponge (L2) and fractured asphalt (L3)', () => {
    const l1 = getCrackState(1);
    expect(l1.capacityBonus).toBe(0);
    expect(l1.droughtShield).toBe(0);

    const l2 = getCrackState(2);
    expect(l2.capacityBonus).toBe(15);
    expect(l2.droughtShield).toBe(1);

    const l3 = getCrackState(3);
    expect(l3.capacityBonus).toBe(30);
    expect(l3.extraCleaning).toBe(true);
  });
});


describe('combo resolution and arena invariants', () => {
  const cards = monthCards(aggregateMonths(fromFixture(berlin as WeatherYearFixture)));
  const teams: [string[], string[]] = [
    ['portulaca-oleracea', 'buddleja-davidii', 'cymbalaria-muralis'],
    ['plantago-major', 'sagina-procumbens', 'poa-annua'],
  ];
  it('keeps every monthly arena within evolved capacity and species HP', () => {
    for (const place of CITY_PLACES) for (const level of [1, 2, 3] as const) {
      const result = runWatch(teams, cards, 52.52, 'en', place, level);
      expect(result.capacity).toBe(place.capacity + getCrackState(level).capacityBonus);
      for (const month of result.months) {
        expect(month.sideShoots[0] + month.sideShoots[1]).toBeLessThanOrEqual(result.capacity);
        month.shoots.forEach((shoots, side) => shoots.forEach((n, i) => {
          expect(n).toBeGreaterThanOrEqual(0);
          expect(n).toBeLessThanOrEqual(speciesProfile(teams[side][i])!.maxHp);
        }));
      }
    }
  });
  it('gives the same scores when the team sides are exchanged', () => {
    for (const place of CITY_PLACES) {
      const a = runWatch(teams, cards, 52.52, 'en', place, 3);
      const b = runWatch([teams[1], teams[0]], cards, 52.52, 'en', place, 3);
      expect(a.score).toEqual([...b.score].reverse());
      expect(a.seeds).toEqual([...b.seeds].reverse());
    }
  });
  it('shares and spends heat hardening, and activates the deep-crevice cleaning cost', () => {
    const hot = cards.map(c => ({ ...c, heat: 3, cold: false, frost: 0, drought: 0 }));
    const result = runWatch(teams, hot, 52.52, 'en', placeById('gehwegfuge'), 3);
    expect(result.months.flatMap(m => m.lines).some(l => l.includes('shares hardening'))).toBe(true);
    expect(result.months.find(m => m.card.month === 8)!.lines).toContain('Deep crevice: extra cleaning in August');
  });
  it('keeps heat-sharing results stable when plants are reordered', () => {
    const hot = cards.map(c => ({ ...c, heat: 3, cold: false, frost: 0, drought: 0 }));
    const a = runWatch(teams, hot, 52.52, 'en', placeById('brache'));
    const b = runWatch([[...teams[0]].reverse(), teams[1]], hot, 52.52, 'en', placeById('brache'));
    expect(a.score).toEqual(b.score);
    expect(a.seeds).toEqual(b.seeds);
    for (const plant of a.plants) {
      expect(b.plants.find(p => p.side === plant.side && p.id === plant.id)).toEqual(plant);
    }
  });
  it('does not detect trio bonuses for empty or incomplete teams', () => {
    expect(detectComboHands([])).toEqual([]);
    expect(detectComboHands([speciesProfile('portulaca-oleracea')!]).map(h => h.id)).not.toContain('hitzewelle-gang');
  });
});

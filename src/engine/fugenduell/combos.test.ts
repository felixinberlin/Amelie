import { describe, it, expect } from 'vitest';
import { detectComboHands, getCrackState, KNOWN_COMBO_HANDS } from './combos';
import { speciesProfile } from './watchMode';

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
    const hands = detectComboHands(team);
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

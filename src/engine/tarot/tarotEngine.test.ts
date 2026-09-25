import { describe, it, expect } from 'vitest';
import {
  BUILT_IN_SPREADS,
  TAROT_DECK,
  getElementalAffinity,
  evaluateSpreadEdge,
  DrawnCardPlacement,
} from './tarotEngine';

describe('Tarot Graph Engine & Elemental Dignities', () => {
  it('loads canonical Celtic Cross with 10 slots and 8 relations', () => {
    const cc = BUILT_IN_SPREADS['celtic-cross'];
    expect(cc).toBeDefined();
    expect(cc.slots).toHaveLength(10);
    expect(cc.relations).toHaveLength(8);

    // Crossing card must have 90 degree rotation and layer 1
    const crossSlot = cc.slots.find((s) => s.id === 'cross_obstacle');
    expect(crossSlot).toBeDefined();
    expect(crossSlot?.layout.rotation).toBe(90);
    expect(crossSlot?.layout.layer).toBe(1);
  });

  it('correctly calculates Golden Dawn elemental dignities', () => {
    // Compatible
    expect(getElementalAffinity('fire', 'air')).toBe('friendly');
    expect(getElementalAffinity('air', 'fire')).toBe('friendly');
    expect(getElementalAffinity('water', 'earth')).toBe('friendly');
    expect(getElementalAffinity('earth', 'water')).toBe('friendly');

    // Hostile / Inimical
    expect(getElementalAffinity('fire', 'water')).toBe('hostile');
    expect(getElementalAffinity('water', 'fire')).toBe('hostile');
    expect(getElementalAffinity('air', 'earth')).toBe('hostile');
    expect(getElementalAffinity('earth', 'air')).toBe('hostile');

    // Identical
    expect(getElementalAffinity('fire', 'fire')).toBe('identical');
    expect(getElementalAffinity('water', 'water')).toBe('identical');

    // Neutral
    expect(getElementalAffinity('fire', 'earth')).toBe('neutral');
    expect(getElementalAffinity('water', 'air')).toBe('neutral');
  });

  it('modulates edge tension when elemental dignity is evaluated', () => {
    const fireCard = TAROT_DECK.find((c) => c.element === 'fire')!;
    const waterCard = TAROT_DECK.find((c) => c.element === 'water')!;
    const airCard = TAROT_DECK.find((c) => c.element === 'air')!;

    const baseRelation = {
      source: 'card1',
      target: 'card2',
      type: 'crosses' as const,
      tension: -0.5,
      evaluateElementalDignity: true,
    };

    // Fire vs Water: Hostile -> aggravates tension (-0.5 - 0.35 = -0.85)
    const hostileEval = evaluateSpreadEdge(
      baseRelation,
      { slotId: 'card1', card: fireCard, isReversed: false },
      { slotId: 'card2', card: waterCard, isReversed: false }
    );
    expect(hostileEval.elementalAffinity).toBe('hostile');
    expect(hostileEval.effectiveTension).toBeLessThan(-0.5);

    // Fire vs Air: Friendly -> softens hostile tension (-0.5 + 0.25 = -0.25)
    const friendlyEval = evaluateSpreadEdge(
      baseRelation,
      { slotId: 'card1', card: fireCard, isReversed: false },
      { slotId: 'card2', card: airCard, isReversed: false }
    );
    expect(friendlyEval.elementalAffinity).toBe('friendly');
    expect(friendlyEval.effectiveTension).toBeGreaterThan(-0.5);
  });

  it('reversals degrade directional progression edges', () => {
    const fool = TAROT_DECK.find((c) => c.id === 'fool')!;
    const magician = TAROT_DECK.find((c) => c.id === 'magician')!;

    const leadRelation = {
      source: 's1',
      target: 's2',
      type: 'leads_to' as const,
      tension: 0.2,
      evaluateElementalDignity: false,
    };

    // Upright flow
    const uprightEval = evaluateSpreadEdge(
      leadRelation,
      { slotId: 's1', card: fool, isReversed: false },
      { slotId: 's2', card: magician, isReversed: false }
    );
    expect(uprightEval.effectiveTension).toBe(0.2);

    // Reversed origin stalls transition
    const reversedEval = evaluateSpreadEdge(
      leadRelation,
      { slotId: 's1', card: fool, isReversed: true },
      { slotId: 's2', card: magician, isReversed: false }
    );
    expect(reversedEval.effectiveTension).toBeLessThan(0.2);
  });
});

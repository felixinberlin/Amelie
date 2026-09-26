import { describe, it, expect } from 'vitest';
import {
  BUILT_IN_SPREADS,
  TAROT_DECK,
  getElementalAffinity,
  evaluateSpreadEdge,
  validateDeckContract,
  validateSpreadDefinition,
  generateReadingSummary,
  DrawnCardPlacement,
  TarotElement,
  SpreadRelation,
  SpreadDefinition,
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

// ────────────────────────────────────────────────────────
// Exhaustive Elemental Dignity Matrix (4×4 = 16 combinations)
// ────────────────────────────────────────────────────────

describe('Exhaustive Elemental Dignity Matrix', () => {
  const elements: TarotElement[] = ['fire', 'water', 'air', 'earth'];

  it('covers all 16 element pair combinations', () => {
    const expected: Record<string, string> = {
      'fire-fire': 'identical',
      'fire-water': 'hostile',
      'fire-air': 'friendly',
      'fire-earth': 'neutral',
      'water-fire': 'hostile',
      'water-water': 'identical',
      'water-air': 'neutral',
      'water-earth': 'friendly',
      'air-fire': 'friendly',
      'air-water': 'neutral',
      'air-air': 'identical',
      'air-earth': 'hostile',
      'earth-fire': 'neutral',
      'earth-water': 'friendly',
      'earth-air': 'hostile',
      'earth-earth': 'identical',
    };

    for (const e1 of elements) {
      for (const e2 of elements) {
        const key = `${e1}-${e2}`;
        expect(getElementalAffinity(e1, e2), `${key}`).toBe(expected[key]);
      }
    }
  });

  it('is symmetric: affinity(A, B) === affinity(B, A)', () => {
    for (const e1 of elements) {
      for (const e2 of elements) {
        expect(
          getElementalAffinity(e1, e2),
          `symmetry ${e1}-${e2}`
        ).toBe(getElementalAffinity(e2, e1));
      }
    }
  });
});

// ────────────────────────────────────────────────────────
// Edge Description Coverage (all 8 relation types)
// ────────────────────────────────────────────────────────

describe('Edge description coverage for all relation types', () => {
  const fireCard = TAROT_DECK.find((c) => c.element === 'fire')!;
  const waterCard = TAROT_DECK.find((c) => c.element === 'water')!;

  const relationTypes = [
    'crosses', 'grounds', 'crowns', 'leads_to',
    'mirrors', 'opposes', 'clarifies', 'synthesizes',
  ] as const;

  for (const relType of relationTypes) {
    it(`generates bilingual descriptions for '${relType}'`, () => {
      const relation: SpreadRelation = {
        source: 'a', target: 'b', type: relType, tension: 0.0,
        evaluateElementalDignity: true,
      };
      const result = evaluateSpreadEdge(
        relation,
        { slotId: 'a', card: fireCard, isReversed: false },
        { slotId: 'b', card: waterCard, isReversed: false }
      );
      expect(result.descriptionDe.length).toBeGreaterThan(10);
      expect(result.descriptionEn.length).toBeGreaterThan(10);
      // Should not contain the generic fallback
      expect(result.descriptionDe).not.toContain('Beziehungstyp:');
      expect(result.descriptionEn).not.toContain('Relation type:');
    });
  }
});

// ────────────────────────────────────────────────────────
// Reversal Effects on Multiple Relation Types
// ────────────────────────────────────────────────────────

describe('Reversal effects on relation types', () => {
  const fool = TAROT_DECK.find((c) => c.id === 'fool')!;
  const empress = TAROT_DECK.find((c) => c.id === 'empress')!;

  it('reversed source on leads_to blocks flow (tension decreases)', () => {
    const rel: SpreadRelation = {
      source: 'a', target: 'b', type: 'leads_to', tension: 0.4,
      evaluateElementalDignity: false,
    };
    const normal = evaluateSpreadEdge(
      rel,
      { slotId: 'a', card: fool, isReversed: false },
      { slotId: 'b', card: empress, isReversed: false }
    );
    const reversed = evaluateSpreadEdge(
      rel,
      { slotId: 'a', card: fool, isReversed: true },
      { slotId: 'b', card: empress, isReversed: false }
    );
    expect(reversed.effectiveTension).toBeLessThan(normal.effectiveTension);
  });

  it('reversed target on leads_to also blocks flow', () => {
    const rel: SpreadRelation = {
      source: 'a', target: 'b', type: 'leads_to', tension: 0.4,
      evaluateElementalDignity: false,
    };
    const reversed = evaluateSpreadEdge(
      rel,
      { slotId: 'a', card: fool, isReversed: false },
      { slotId: 'b', card: empress, isReversed: true }
    );
    expect(reversed.effectiveTension).toBeLessThan(0.4);
    expect(reversed.descriptionEn).toContain('Reversed target card');
  });

  it('reversal on crosses edge intensifies friction to negative', () => {
    const rel: SpreadRelation = {
      source: 'a', target: 'b', type: 'crosses', tension: -0.5,
      evaluateElementalDignity: false,
    };
    const reversed = evaluateSpreadEdge(
      rel,
      { slotId: 'a', card: fool, isReversed: true },
      { slotId: 'b', card: empress, isReversed: false }
    );
    expect(reversed.effectiveTension).toBeLessThanOrEqual(0);
  });

  it('identical element intensifies the prevailing polarity', () => {
    const card1 = TAROT_DECK.find((c) => c.element === 'fire' && c.id === 'emperor')!;
    const card2 = TAROT_DECK.find((c) => c.element === 'fire' && c.id === 'strength')!;

    // Positive base tension → should increase
    const positiveRel: SpreadRelation = {
      source: 'a', target: 'b', type: 'mirrors', tension: 0.3,
      evaluateElementalDignity: true,
    };
    const posResult = evaluateSpreadEdge(
      positiveRel,
      { slotId: 'a', card: card1, isReversed: false },
      { slotId: 'b', card: card2, isReversed: false }
    );
    expect(posResult.effectiveTension).toBeGreaterThan(0.3);
    expect(posResult.elementalAffinity).toBe('identical');

    // Negative base tension → should decrease (become more negative)
    const negativeRel: SpreadRelation = {
      source: 'a', target: 'b', type: 'opposes', tension: -0.3,
      evaluateElementalDignity: true,
    };
    const negResult = evaluateSpreadEdge(
      negativeRel,
      { slotId: 'a', card: card1, isReversed: false },
      { slotId: 'b', card: card2, isReversed: false }
    );
    expect(negResult.effectiveTension).toBeLessThan(-0.3);
  });
});

// ────────────────────────────────────────────────────────
// Deck Contract Validation
// ────────────────────────────────────────────────────────

describe('Deck Contract Validation', () => {
  it('validates a sufficient deck passes', () => {
    const result = validateDeckContract(TAROT_DECK, {
      minCards: 10,
      requiredArcana: 'any',
      allowReversals: true,
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects deck with too few cards', () => {
    const tinyDeck = TAROT_DECK.slice(0, 2);
    const result = validateDeckContract(tinyDeck, {
      minCards: 10,
      requiredArcana: 'any',
      allowReversals: true,
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('at least 10');
  });

  it('rejects empty deck', () => {
    const result = validateDeckContract([], {
      minCards: 1,
      requiredArcana: 'any',
      allowReversals: true,
    });
    expect(result.valid).toBe(false);
  });

  it('rejects deck missing majors for full_78 contract', () => {
    const minorsOnly = TAROT_DECK.filter((c) => c.arcana === 'minor');
    const result = validateDeckContract(minorsOnly, {
      minCards: 1,
      requiredArcana: 'full_78',
      allowReversals: true,
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('full 78-card deck');
  });

  it('rejects deck with no majors for major_only contract', () => {
    const minorsOnly = TAROT_DECK.filter((c) => c.arcana === 'minor');
    const result = validateDeckContract(minorsOnly, {
      minCards: 1,
      requiredArcana: 'major_only',
      allowReversals: true,
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Major Arcana');
  });

  it('rejects deck with no minors for minor_only contract', () => {
    const majorsOnly = TAROT_DECK.filter((c) => c.arcana === 'major');
    const result = validateDeckContract(majorsOnly, {
      minCards: 1,
      requiredArcana: 'minor_only',
      allowReversals: true,
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Minor Arcana');
  });

  it('rejects Lenormand deck with too few cards', () => {
    const result = validateDeckContract(TAROT_DECK, {
      minCards: 36,
      requiredArcana: 'lenormand_36',
      allowReversals: false,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('36-card Lenormand'))).toBe(true);
  });
});

// ────────────────────────────────────────────────────────
// Spread Definition Validation
// ────────────────────────────────────────────────────────

describe('Spread Definition Validation', () => {
  it('validates all built-in spreads pass structural checks', () => {
    for (const [key, spread] of Object.entries(BUILT_IN_SPREADS)) {
      const result = validateSpreadDefinition(spread);
      expect(result.valid, `Spread '${key}' has errors: ${result.errors.join(', ')}`).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });

  it('detects duplicate slot IDs', () => {
    const badSpread: SpreadDefinition = {
      id: 'test', name: 'Test', nameDe: 'Test', author: 'Test',
      description: 'Test', deckContract: { minCards: 2, requiredArcana: 'any', allowReversals: true },
      slots: [
        { id: 'dup', order: 1, label: 'A', labelDe: 'A', role: 'situation', layout: { x: 0, y: 0, rotation: 0, layer: 0 } },
        { id: 'dup', order: 2, label: 'B', labelDe: 'B', role: 'outcome', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
      ],
      relations: [],
    };
    const result = validateSpreadDefinition(badSpread);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Duplicate slot IDs');
  });

  it('detects non-sequential order numbers', () => {
    const badSpread: SpreadDefinition = {
      id: 'test', name: 'Test', nameDe: 'Test', author: 'Test',
      description: 'Test', deckContract: { minCards: 2, requiredArcana: 'any', allowReversals: true },
      slots: [
        { id: 'a', order: 1, label: 'A', labelDe: 'A', role: 'situation', layout: { x: 0, y: 0, rotation: 0, layer: 0 } },
        { id: 'b', order: 5, label: 'B', labelDe: 'B', role: 'outcome', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
      ],
      relations: [],
    };
    const result = validateSpreadDefinition(badSpread);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('not sequential');
  });

  it('detects dangling relation references', () => {
    const badSpread: SpreadDefinition = {
      id: 'test', name: 'Test', nameDe: 'Test', author: 'Test',
      description: 'Test', deckContract: { minCards: 2, requiredArcana: 'any', allowReversals: true },
      slots: [
        { id: 'a', order: 1, label: 'A', labelDe: 'A', role: 'situation', layout: { x: 0, y: 0, rotation: 0, layer: 0 } },
        { id: 'b', order: 2, label: 'B', labelDe: 'B', role: 'outcome', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
      ],
      relations: [
        { source: 'a', target: 'nonexistent', type: 'leads_to', tension: 0.0 },
      ],
    };
    const result = validateSpreadDefinition(badSpread);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("'nonexistent'");
  });

  it('detects self-referencing relations', () => {
    const badSpread: SpreadDefinition = {
      id: 'test', name: 'Test', nameDe: 'Test', author: 'Test',
      description: 'Test', deckContract: { minCards: 2, requiredArcana: 'any', allowReversals: true },
      slots: [
        { id: 'a', order: 1, label: 'A', labelDe: 'A', role: 'situation', layout: { x: 0, y: 0, rotation: 0, layer: 0 } },
        { id: 'b', order: 2, label: 'B', labelDe: 'B', role: 'outcome', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
      ],
      relations: [
        { source: 'a', target: 'a', type: 'mirrors', tension: 0.0 },
      ],
    };
    const result = validateSpreadDefinition(badSpread);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Self-referencing');
  });

  it('warns about orphaned slots', () => {
    const spread: SpreadDefinition = {
      id: 'test', name: 'Test', nameDe: 'Test', author: 'Test',
      description: 'Test', deckContract: { minCards: 3, requiredArcana: 'any', allowReversals: true },
      slots: [
        { id: 'a', order: 1, label: 'A', labelDe: 'A', role: 'situation', layout: { x: 0, y: 0, rotation: 0, layer: 0 } },
        { id: 'b', order: 2, label: 'B', labelDe: 'B', role: 'outcome', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
        { id: 'orphan', order: 3, label: 'C', labelDe: 'C', role: 'clarifier', layout: { x: 80, y: 80, rotation: 0, layer: 0 } },
      ],
      relations: [
        { source: 'a', target: 'b', type: 'leads_to', tension: 0.0 },
      ],
    };
    const result = validateSpreadDefinition(spread);
    expect(result.valid).toBe(true); // Orphans are warnings, not errors
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('orphan');
  });
});

// ────────────────────────────────────────────────────────
// Built-in Spread Structural Integrity
// ────────────────────────────────────────────────────────

describe('Built-in Spread Structural Integrity', () => {
  it('contains exactly 4 built-in spreads', () => {
    expect(Object.keys(BUILT_IN_SPREADS)).toHaveLength(4);
  });

  it('Horseshoe has 7 slots and 7 relations in U-shape', () => {
    const hs = BUILT_IN_SPREADS['horseshoe'];
    expect(hs).toBeDefined();
    expect(hs.slots).toHaveLength(7);
    expect(hs.relations).toHaveLength(7);
    expect(hs.deckContract.minCards).toBe(7);
  });

  it('Relationship Cross has 5 slots and 5 relations', () => {
    const rc = BUILT_IN_SPREADS['relationship-cross'];
    expect(rc).toBeDefined();
    expect(rc.slots).toHaveLength(5);
    expect(rc.relations).toHaveLength(5);
    expect(rc.deckContract.minCards).toBe(5);
  });

  it('Three-Card has 3 slots with linear layout', () => {
    const tc = BUILT_IN_SPREADS['three-card'];
    expect(tc.slots).toHaveLength(3);
    // All at same y coordinate (horizontal line)
    const ys = new Set(tc.slots.map((s) => s.layout.y));
    expect(ys.size).toBe(1);
  });

  it('all spreads have unique slot IDs within each spread', () => {
    for (const [key, spread] of Object.entries(BUILT_IN_SPREADS)) {
      const ids = spread.slots.map((s) => s.id);
      const unique = new Set(ids);
      expect(unique.size, `Duplicate IDs in '${key}'`).toBe(ids.length);
    }
  });

  it('all relation endpoints in all spreads reference valid slots', () => {
    for (const [key, spread] of Object.entries(BUILT_IN_SPREADS)) {
      const slotIds = new Set(spread.slots.map((s) => s.id));
      for (const rel of spread.relations) {
        expect(slotIds.has(rel.source), `'${key}': source '${rel.source}' not found`).toBe(true);
        expect(slotIds.has(rel.target), `'${key}': target '${rel.target}' not found`).toBe(true);
      }
    }
  });
});

// ────────────────────────────────────────────────────────
// Deck Data Integrity
// ────────────────────────────────────────────────────────

describe('Deck Data Integrity', () => {
  it('TAROT_DECK contains exactly 30 curated cards', () => {
    expect(TAROT_DECK).toHaveLength(30);
  });

  it('contains all 22 Major Arcana', () => {
    const majors = TAROT_DECK.filter((c) => c.arcana === 'major');
    expect(majors).toHaveLength(22);
    // Numbers 0-21
    const majorNumbers = majors.map((c) => c.number).sort((a, b) => a - b);
    expect(majorNumbers[0]).toBe(0);
    expect(majorNumbers[21]).toBe(21);
  });

  it('contains 8 representative Minor Arcana across all 4 suits', () => {
    const minors = TAROT_DECK.filter((c) => c.arcana === 'minor');
    expect(minors).toHaveLength(8);
    const suits = new Set(minors.map((c) => c.suit));
    expect(suits).toEqual(new Set(['wands', 'cups', 'swords', 'pentacles']));
  });

  it('every card has bilingual keywords and reversed keywords', () => {
    for (const card of TAROT_DECK) {
      expect(card.keywordsDe.length, `${card.id} missing DE keywords`).toBeGreaterThan(0);
      expect(card.keywordsEn.length, `${card.id} missing EN keywords`).toBeGreaterThan(0);
      expect(card.reversedKeywordsDe.length, `${card.id} missing DE reversed keywords`).toBeGreaterThan(0);
      expect(card.reversedKeywordsEn.length, `${card.id} missing EN reversed keywords`).toBeGreaterThan(0);
    }
  });

  it('every card has a valid element assignment', () => {
    const validElements: TarotElement[] = ['fire', 'water', 'air', 'earth'];
    for (const card of TAROT_DECK) {
      expect(validElements).toContain(card.element);
    }
  });

  it('all card IDs are unique', () => {
    const ids = TAROT_DECK.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ────────────────────────────────────────────────────────
// Tension Clamping
// ────────────────────────────────────────────────────────

describe('Tension clamping to [-1, 1]', () => {
  it('clamps extreme hostile tension to -1.0', () => {
    const fireCard = TAROT_DECK.find((c) => c.element === 'fire')!;
    const waterCard = TAROT_DECK.find((c) => c.element === 'water')!;
    const rel: SpreadRelation = {
      source: 'a', target: 'b', type: 'crosses', tension: -0.9,
      evaluateElementalDignity: true,
    };
    const result = evaluateSpreadEdge(
      rel,
      { slotId: 'a', card: fireCard, isReversed: true },
      { slotId: 'b', card: waterCard, isReversed: false }
    );
    expect(result.effectiveTension).toBeGreaterThanOrEqual(-1.0);
    expect(result.effectiveTension).toBeLessThanOrEqual(1.0);
  });

  it('clamps extreme friendly tension to 1.0', () => {
    const airCard1 = TAROT_DECK.find((c) => c.element === 'air')!;
    const fireCard = TAROT_DECK.find((c) => c.element === 'fire')!;
    const rel: SpreadRelation = {
      source: 'a', target: 'b', type: 'synthesizes', tension: 0.9,
      evaluateElementalDignity: true,
    };
    const result = evaluateSpreadEdge(
      rel,
      { slotId: 'a', card: airCard1, isReversed: false },
      { slotId: 'b', card: fireCard, isReversed: false }
    );
    expect(result.effectiveTension).toBeLessThanOrEqual(1.0);
  });
});

// ────────────────────────────────────────────────────────
// Reading Summary Generator
// ────────────────────────────────────────────────────────

describe('Reading Summary Generator', () => {
  it('generates a valid summary for a complete Celtic Cross reading', () => {
    const spread = BUILT_IN_SPREADS['celtic-cross'];
    const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
    const placements: Record<string, DrawnCardPlacement> = {};

    spread.slots.forEach((slot, i) => {
      placements[slot.id] = {
        slotId: slot.id,
        card: shuffled[i],
        isReversed: i % 3 === 0,
      };
    });

    const edges = spread.relations.map((r) =>
      evaluateSpreadEdge(r, placements[r.source], placements[r.target])
    );

    const summary = generateReadingSummary(spread, placements, edges);

    expect(summary.spreadName).toBe('The Celtic Cross');
    expect(summary.totalSlots).toBe(10);
    expect(summary.filledSlots).toBe(10);
    expect(summary.reversedCount).toBeGreaterThanOrEqual(0);
    expect(summary.averageTension).toBeGreaterThanOrEqual(-1);
    expect(summary.averageTension).toBeLessThanOrEqual(1);
    expect(summary.dominantElement).toBeTruthy();
    expect(summary.narrativeDe.length).toBeGreaterThan(10);
    expect(summary.narrativeEn.length).toBeGreaterThan(10);
  });

  it('handles empty placements gracefully', () => {
    const spread = BUILT_IN_SPREADS['three-card'];
    const summary = generateReadingSummary(spread, {}, []);

    expect(summary.filledSlots).toBe(0);
    expect(summary.reversedCount).toBe(0);
    expect(summary.averageTension).toBe(0);
  });

  it('detects high reversal density', () => {
    const spread = BUILT_IN_SPREADS['three-card'];
    const fireCard = TAROT_DECK.find((c) => c.id === 'emperor')!;
    const placements: Record<string, DrawnCardPlacement> = {
      past: { slotId: 'past', card: fireCard, isReversed: true },
      present: { slotId: 'present', card: fireCard, isReversed: true },
      future: { slotId: 'future', card: fireCard, isReversed: true },
    };
    const edges = spread.relations.map((r) =>
      evaluateSpreadEdge(r, placements[r.source], placements[r.target])
    );
    const summary = generateReadingSummary(spread, placements, edges);

    expect(summary.reversedCount).toBe(3);
    expect(summary.narrativeEn).toContain('reversal density');
  });
});

// ────────────────────────────────────────────────────────
// Edge Cases
// ────────────────────────────────────────────────────────

describe('Edge cases', () => {
  it('evaluateSpreadEdge works without card placements', () => {
    const rel: SpreadRelation = {
      source: 'a', target: 'b', type: 'leads_to', tension: 0.5,
      evaluateElementalDignity: true,
    };
    const result = evaluateSpreadEdge(rel);
    expect(result.effectiveTension).toBe(0.5);
    expect(result.elementalAffinity).toBeUndefined();
  });

  it('evaluateSpreadEdge skips elemental dignity when flag is false', () => {
    const fireCard = TAROT_DECK.find((c) => c.element === 'fire')!;
    const waterCard = TAROT_DECK.find((c) => c.element === 'water')!;
    const rel: SpreadRelation = {
      source: 'a', target: 'b', type: 'mirrors', tension: 0.0,
      evaluateElementalDignity: false,
    };
    const result = evaluateSpreadEdge(
      rel,
      { slotId: 'a', card: fireCard, isReversed: false },
      { slotId: 'b', card: waterCard, isReversed: false }
    );
    // Should NOT modify tension (hostile would normally subtract)
    expect(result.effectiveTension).toBe(0.0);
    expect(result.elementalAffinity).toBeUndefined();
  });
});

import { describe, it, expect } from 'vitest';
import {
  calculateTacticBonus,
  calculateSkillModifiers,
  resolveDuelRound,
  calculateSeedReward,
  validateStarterRoster,
  getPlantById,
  getEventForRound,
} from './battleEngine';
import { FUGENDUELL_STARTER_ROSTER, SEASONAL_BATTLE_EVENTS } from '../../data/fugenduellData';

describe('Fugenduell Battle Engine', () => {
  describe('validateStarterRoster', () => {
    it('validates that all starter plants comply with the 36-point budget rule', () => {
      const result = validateStarterRoster(FUGENDUELL_STARTER_ROSTER);
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it('contains balanced CSR strategy types across the roster', () => {
      expect(FUGENDUELL_STARTER_ROSTER.length).toBeGreaterThanOrEqual(10);
      const csrTypes = new Set(FUGENDUELL_STARTER_ROSTER.map(p => p.csr));
      expect(csrTypes.has('RC')).toBe(true); // Dandelion
      expect(csrTypes.has('RCS')).toBe(true); // Plantain
      expect(csrTypes.has('R')).toBe(true); // Poa annua
      expect(csrTypes.has('SR')).toBe(true); // Sagina
    });

    it('flags plants exceeding the 36 budget limit', () => {
      const invalidPlant = {
        ...FUGENDUELL_STARTER_ROSTER[0],
        id: 'super-weed',
        stats: { wurzel: 10, tritt: 10, duerre: 10, saat: 10, tempo: 10, chemie: 10 },
        totalBudget: 60,
      };
      const result = validateStarterRoster([invalidPlant]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('exceeds maximum allowed budget of 36');
    });
  });

  describe('calculateTacticBonus', () => {
    it('applies root_reserve bonuses to wurzel and duerre, penalizes tempo', () => {
      expect(calculateTacticBonus('root_reserve', 'wurzel')).toBe(3);
      expect(calculateTacticBonus('root_reserve', 'duerre')).toBe(3);
      expect(calculateTacticBonus('root_reserve', 'tempo')).toBe(-2);
      expect(calculateTacticBonus('root_reserve', 'chemie')).toBe(0);
    });

    it('applies rapid_spurt bonuses to tempo and saat, penalizes tritt', () => {
      expect(calculateTacticBonus('rapid_spurt', 'tempo')).toBe(3);
      expect(calculateTacticBonus('rapid_spurt', 'saat')).toBe(3);
      expect(calculateTacticBonus('rapid_spurt', 'tritt')).toBe(-2);
      expect(calculateTacticBonus('rapid_spurt', 'wurzel')).toBe(0);
    });

    it('applies toxin_defense bonuses to chemie and tritt, penalizes wurzel', () => {
      expect(calculateTacticBonus('toxin_defense', 'chemie')).toBe(3);
      expect(calculateTacticBonus('toxin_defense', 'tritt')).toBe(3);
      expect(calculateTacticBonus('toxin_defense', 'wurzel')).toBe(-1);
    });

    it('returns +1 baseline for balanced stance across all stats', () => {
      expect(calculateTacticBonus('balanced', 'wurzel')).toBe(1);
      expect(calculateTacticBonus('balanced', 'tempo')).toBe(1);
      expect(calculateTacticBonus('balanced', 'chemie')).toBe(1);
    });
  });

  describe('calculateSkillModifiers', () => {
    const dandelion = getPlantById('taraxacum-officinale');
    const plantain = getPlantById('plantago-major');
    const celandine = getPlantById('chelidonium-majus');

    it('gives Taraxacum +2 bonus on wurzel checks', () => {
      const mod = calculateSkillModifiers(dandelion, plantain, 'wurzel');
      expect(mod.pSkillBonus).toBe(2);
      expect(mod.aSkillBonus).toBe(0);
    });

    it('gives Plantago +3 bonus on tritt checks', () => {
      const mod = calculateSkillModifiers(dandelion, plantain, 'tritt');
      expect(mod.pSkillBonus).toBe(0);
      expect(mod.aSkillBonus).toBe(3);
    });

    it('applies Chelidonium alkaloid sap to reduce opponent chemistry by 2', () => {
      const mod = calculateSkillModifiers(celandine, dandelion, 'chemie');
      expect(mod.effectiveAiStat).toBe(Math.max(1, dandelion.stats.chemie - 2));
    });
  });

  describe('resolveDuelRound', () => {
    const dandelion = getPlantById('taraxacum-officinale');
    const plantain = getPlantById('plantago-major');
    const eventRound1 = getEventForRound(1); // Snowmelt & Root Flush (testedStat: wurzel)

    it('correctly calculates deterministic round shift when AI variance is controlled', () => {
      const res = resolveDuelRound({
        playerPlant: dandelion,
        aiPlant: plantain,
        event: eventRound1,
        currentRound: 1,
        currentCoverage: 50,
        selectedTactic: 'root_reserve',
        aiTacticOverride: 0,
      });

      // dandelion wurzel=5, tactic=+3, skill=+2 -> total 10
      // plantain wurzel=5, tactic=0, skill=0 -> total 5
      // netScore = 10 - 5 = 5
      // coverageShift = 5 * 4 = +20%
      // newCoverage = 50 + 20 = 70%
      expect(res.netScore).toBe(5);
      expect(res.coverageShift).toBe(20);
      expect(res.newCoverage).toBe(70);
      expect(res.isBattleOver).toBe(false);
    });

    it('clamps coverage strictly between 0% and 100%', () => {
      const res = resolveDuelRound({
        playerPlant: dandelion,
        aiPlant: plantain,
        event: eventRound1,
        currentRound: 1,
        currentCoverage: 95,
        selectedTactic: 'root_reserve',
        aiTacticOverride: 0,
      });

      expect(res.newCoverage).toBe(100);
      expect(res.isBattleOver).toBe(true);
      expect(res.winner).toBe('player');
    });

    it('declares battle over on round 6', () => {
      const eventRound6 = getEventForRound(6);
      const res = resolveDuelRound({
        playerPlant: dandelion,
        aiPlant: plantain,
        event: eventRound6,
        currentRound: 6,
        currentCoverage: 55,
        selectedTactic: 'balanced',
        aiTacticOverride: 0,
      });

      expect(res.isBattleOver).toBe(true);
      expect(res.winner).toBe('player');
    });
  });

  describe('calculateSeedReward', () => {
    it('awards 2 seeds for victory, 0 for loss', () => {
      expect(calculateSeedReward('player', 65)).toBe(2);
      expect(calculateSeedReward('ai', 35)).toBe(0);
      expect(calculateSeedReward('draw', 50)).toBe(0);
    });
  });
});

import { PlantRosterItem, BattleEvent, FUGENDUELL_STARTER_ROSTER, SEASONAL_BATTLE_EVENTS } from '../../data/fugenduellData';
import { TacticalStance, RoundResolutionResult, RoundResolutionOptions } from './types';

/**
 * Calculates the tactical stance stat modifier for a given tested stat.
 */
export function calculateTacticBonus(tactic: TacticalStance, statKey: keyof PlantRosterItem['stats']): number {
  if (tactic === 'root_reserve') {
    if (statKey === 'wurzel' || statKey === 'duerre') return 3;
    if (statKey === 'tempo') return -2;
    return 0;
  }
  if (tactic === 'rapid_spurt') {
    if (statKey === 'tempo' || statKey === 'saat') return 3;
    if (statKey === 'tritt') return -2;
    return 0;
  }
  if (tactic === 'toxin_defense') {
    if (statKey === 'chemie' || statKey === 'tritt') return 3;
    if (statKey === 'wurzel') return -1;
    return 0;
  }
  // Balanced default
  return 1;
}

/**
 * Calculates signature skill modifiers for a matchup in the given round stat.
 */
export function calculateSkillModifiers(
  playerPlant: PlantRosterItem,
  aiPlant: PlantRosterItem,
  statKey: keyof PlantRosterItem['stats']
): {
  pSkillBonus: number;
  aSkillBonus: number;
  effectivePlayerStat: number;
  effectiveAiStat: number;
} {
  let effectivePlayerStat = playerPlant.stats[statKey];
  let effectiveAiStat = aiPlant.stats[statKey];
  let pSkillBonus = 0;
  let aSkillBonus = 0;

  // Player skill bonuses
  if (playerPlant.id === 'taraxacum-officinale' && statKey === 'wurzel') pSkillBonus += 2;
  if (playerPlant.id === 'plantago-major' && statKey === 'tritt') pSkillBonus += 3;
  if (playerPlant.id === 'poa-annua' && statKey === 'tempo') pSkillBonus += 3;
  if (playerPlant.id === 'portulaca-oleracea' && statKey === 'duerre') pSkillBonus += 3;
  if (playerPlant.id === 'cochlearia-danica' && statKey === 'chemie') pSkillBonus += 3;
  if (playerPlant.id === 'chelidonium-majus') {
    effectiveAiStat = Math.max(1, effectiveAiStat - 2);
  }

  // AI skill bonuses
  if (aiPlant.id === 'taraxacum-officinale' && statKey === 'wurzel') aSkillBonus += 2;
  if (aiPlant.id === 'plantago-major' && statKey === 'tritt') aSkillBonus += 3;
  if (aiPlant.id === 'poa-annua' && statKey === 'tempo') aSkillBonus += 3;
  if (aiPlant.id === 'portulaca-oleracea' && statKey === 'duerre') aSkillBonus += 3;
  if (aiPlant.id === 'cochlearia-danica' && statKey === 'chemie') aSkillBonus += 3;
  if (aiPlant.id === 'chelidonium-majus') {
    effectivePlayerStat = Math.max(1, effectivePlayerStat - 2);
  }

  return {
    pSkillBonus,
    aSkillBonus,
    effectivePlayerStat,
    effectiveAiStat,
  };
}

/**
 * Resolves a single seasonal battle round between two plant species in a crack arena.
 */
export function resolveDuelRound(options: RoundResolutionOptions): RoundResolutionResult {
  const {
    playerPlant,
    aiPlant,
    event,
    currentRound,
    currentCoverage,
    selectedTactic,
    aiTacticOverride,
    lang = 'de',
  } = options;

  const statKey = event.testedStat;

  // Modifiers
  const pTactic = calculateTacticBonus(selectedTactic, statKey);
  const aTactic = aiTacticOverride !== undefined ? aiTacticOverride : Math.floor(Math.random() * 3) - 1;

  const {
    pSkillBonus,
    aSkillBonus,
    effectivePlayerStat,
    effectiveAiStat,
  } = calculateSkillModifiers(playerPlant, aiPlant, statKey);

  const pTotal = effectivePlayerStat + pTactic + pSkillBonus;
  const aTotal = effectiveAiStat + aTactic + aSkillBonus;
  const netScore = pTotal - aTotal;

  // Coverage shift: each net point grants ~4% coverage change
  const coverageShift = Math.round(netScore * 4);
  const newCoverage = Math.max(0, Math.min(100, currentCoverage + coverageShift));

  const isBattleOver = currentRound >= 6 || newCoverage >= 100 || newCoverage <= 0;
  let winner: 'player' | 'ai' | 'draw' | null = null;
  if (isBattleOver) {
    if (newCoverage > 50) winner = 'player';
    else if (newCoverage < 50) winner = 'ai';
    else winner = 'draw';
  }

  const isDe = lang === 'de';
  const summary = netScore > 0
    ? (isDe ? `Vorteil +${coverageShift}% Deckung für ${playerPlant.nameCommonDe}` : `Gain +${coverageShift}% coverage for ${playerPlant.nameCommonEn}`)
    : netScore < 0
    ? (isDe ? `Verlust ${coverageShift}% Deckung an ${aiPlant.nameCommonDe}` : `Loss ${coverageShift}% coverage to ${aiPlant.nameCommonEn}`)
    : (isDe ? 'Gleichstand in der Fuge' : 'Dead heat in the seam');

  return {
    round: currentRound,
    month: isDe ? event.monthDe : event.monthEn,
    eventName: isDe ? event.titleDe : event.titleEn,
    testedStat: isDe ? event.statLabelDe : event.statLabelEn,
    playerStatValue: effectivePlayerStat,
    aiStatValue: effectiveAiStat,
    playerTacticBonus: pTactic,
    aiTacticBonus: aTactic,
    skillBonusPlayer: pSkillBonus,
    skillBonusAi: aSkillBonus,
    netScore,
    coverageShift,
    newCoverage,
    summary,
    isBattleOver,
    winner,
  };
}

/**
 * Calculates seed reward upon battle completion.
 */
export function calculateSeedReward(winner: 'player' | 'ai' | 'draw' | null, finalCoverage: number): number {
  if (winner === 'player' || finalCoverage > 50) {
    return 2;
  }
  return 0;
}

/**
 * Validates that all plant roster species satisfy the 36-point budget rule and data constraints.
 */
export function validateStarterRoster(roster: PlantRosterItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const plant of roster) {
    const sum =
      plant.stats.wurzel +
      plant.stats.tritt +
      plant.stats.duerre +
      plant.stats.saat +
      plant.stats.tempo +
      plant.stats.chemie;

    if (sum !== plant.totalBudget) {
      errors.push(`Plant ${plant.id} totalBudget (${plant.totalBudget}) does not match stat sum (${sum})`);
    }

    if (sum > 36) {
      errors.push(`Plant ${plant.id} exceeds maximum allowed budget of 36 points (has ${sum})`);
    }

    if (!plant.signatureSkill || !plant.signatureSkill.nameDe || !plant.signatureSkill.nameEn) {
      errors.push(`Plant ${plant.id} is missing signature skill definitions`);
    }

    if (!plant.csr || !['R', 'C', 'S', 'RC', 'RCS', 'SR', 'CR', 'CS'].includes(plant.csr)) {
      errors.push(`Plant ${plant.id} has invalid CSR classification: ${plant.csr}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Helper to fetch a species from the starter roster by ID with fallback.
 */
export function getPlantById(id: string): PlantRosterItem {
  const found = FUGENDUELL_STARTER_ROSTER.find(p => p.id === id);
  return found || FUGENDUELL_STARTER_ROSTER[0];
}

/**
 * Helper to get a battle event by round number (1-6).
 */
export function getEventForRound(round: number): BattleEvent {
  const index = Math.max(0, Math.min(round - 1, SEASONAL_BATTLE_EVENTS.length - 1));
  return SEASONAL_BATTLE_EVENTS[index];
}

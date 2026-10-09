import { PlantRosterItem, BattleEvent, ArenaContext, FUGENDUELL_STARTER_ROSTER, SEASONAL_BATTLE_EVENTS } from '../../data/fugenduellData';
import { TacticalStance, RoundResolutionResult, RoundResolutionOptions, DuelState, INITIAL_DUEL_STATE } from './types';

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

type StatKey = keyof PlantRosterItem['stats'];

/** Flat bonus a plant's own signature skill grants on the tested stat (arena only matters where the deck says so). */
function ownSkillBonus(plant: PlantRosterItem, statKey: StatKey, arena: ArenaContext | undefined, notes: string[], round = 0, state: DuelState = INITIAL_DUEL_STATE): number {
  const base = plant.stats[statKey];
  switch (plant.id) {
    case 'taraxacum-officinale':
      return statKey === 'wurzel' ? 2 : 0;
    case 'plantago-major':
      if (statKey === 'saat' && arena && arena.disturbance >= 7) return 2; // Sohlenfracht
      if (statKey !== 'tritt') return 0;
      if (arena && arena.disturbance >= 7) { notes.push('Trittplatte: TRITT verdoppelt (Störung ≥ 7)'); return base; }
      return 3;
    case 'poa-annua':
      return statKey === 'tempo' ? 3 : 0;
    case 'portulaca-oleracea':
      if (statKey !== 'duerre') return 0;
      if (arena) {
        if (arena.surfaceTempC > 35) { notes.push('C4-Turbo: DÜRRE verdreifacht (gedeckelt, Asphalt > 35 °C)'); return 6; }
        return 0;
      }
      return 3;
    case 'cochlearia-danica':
      return statKey === 'chemie' ? 3 : 0;
    case 'asplenium-ruta-muraria':
      if (statKey === 'duerre' && arena?.surface === 'mortar' && state.fracture === 0) { notes.push('Kalkanker: Dürre im Kalkmörtel wirkungslos'); return 4; }
      return 0;
    case 'cymbalaria-muralis':
      if (arena?.vertical && state.fracture === 0 && (statKey === 'wurzel' || statKey === 'tritt' || statKey === 'duerre')) { notes.push('Vertikalkletterer: +3 in senkrechter Wand'); return 3; }
      return 0;
    case 'cardamine-hirsuta':
      return round === 1 ? 2 : 0; // Frühstarter: Tauwetter-Vorsprung in Runde 1
    case 'chelidonium-majus':
      return statKey === 'saat' ? 2 : 0; // Ameisenpost
    case 'erigeron-canadensis':
      return statKey === 'saat' && arena && arena.surface === 'gravel' ? 2 : 0; // Achenensegel: Aufwinde am Gleis
    case 'ailanthus-altissima':
      return statKey === 'wurzel' && arena?.surface === 'asphalt' ? 2 : 0; // Asphaltsprenger
    case 'buddleja-davidii':
      return state.fracture; // Mauerkrone: jeder Riss stärkt die Pflanze
    default:
      return 0;
  }
}

/** Penalty the opponent's skill puts on this plant's stat. */
function skillPenaltyAgainst(plant: PlantRosterItem, enemy: PlantRosterItem, statKey: StatKey, notes: string[]): number {
  let penalty = 0;
  if (enemy.id === 'chelidonium-majus' && statKey === 'chemie') {
    penalty += plant.id === 'erigeron-canadensis' ? 1 : 2; // Resistenzfeld halbiert
    if (plant.id === 'erigeron-canadensis') notes.push('Resistenzfeld: Milchsaft nur −1');
  }
  if (enemy.id === 'ailanthus-altissima') {
    penalty += plant.id === 'erigeron-canadensis' && statKey === 'chemie' ? 1 : 2;
  }
  if (plant.id === 'cochlearia-danica' && statKey === 'chemie' && penalty > 0) penalty -= 1; // Vitamingift
  return penalty;
}

/** Stat after arena handicaps (Wall-Rue on asphalt, Scurvygrass away from salt). */
function arenaAdjustedStat(plant: PlantRosterItem, statKey: StatKey, arena: ArenaContext | undefined, notes: string[]): number {
  const base = plant.stats[statKey];
  if (!arena) return base;
  if (plant.id === 'asplenium-ruta-muraria' && arena.surface === 'asphalt') {
    notes.push('Kalkanker: Werte halbiert auf Asphalt');
    return Math.floor(base / 2);
  }
  if (plant.id === 'cochlearia-danica' && !arena.saline) {
    notes.push('Salzpumpe: ohne Salz −2');
    return Math.max(1, base - 2);
  }
  return base;
}

/**
 * Calculates signature skill modifiers for a matchup in the given round stat.
 * Without an arena only the arena-independent skills apply (backwards compatible).
 */
export function calculateSkillModifiers(
  playerPlant: PlantRosterItem,
  aiPlant: PlantRosterItem,
  statKey: StatKey,
  arena?: ArenaContext,
  notes: string[] = [],
  round = 0,
  state: DuelState = INITIAL_DUEL_STATE
): {
  pSkillBonus: number;
  aSkillBonus: number;
  effectivePlayerStat: number;
  effectiveAiStat: number;
} {
  const effectivePlayerStat = Math.max(1, arenaAdjustedStat(playerPlant, statKey, arena, notes) - skillPenaltyAgainst(playerPlant, aiPlant, statKey, notes));
  const effectiveAiStat = Math.max(1, arenaAdjustedStat(aiPlant, statKey, arena, notes) - skillPenaltyAgainst(aiPlant, playerPlant, statKey, notes));
  return {
    pSkillBonus: ownSkillBonus(playerPlant, statKey, arena, notes, round, state) + state.cloneBonus.player,
    aSkillBonus: ownSkillBonus(aiPlant, statKey, arena, notes, round, state) + state.cloneBonus.ai,
    effectivePlayerStat,
    effectiveAiStat,
  };
}

/**
 * Coverage rules of the deck that are not stat bonuses: loss halving, trample immunity,
 * seed ejection, cushion healing, salt doubling and the moss floor. Shift is from the player's view.
 */
function adjustCoverageShift(
  shift: number,
  player: PlantRosterItem,
  ai: PlantRosterItem,
  statKey: StatKey,
  arena: ArenaContext | undefined,
  notes: string[]
): number {
  let out = shift;
  const sides: Array<{ plant: PlantRosterItem; sign: 1 | -1 }> = [
    { plant: player, sign: 1 },
    { plant: ai, sign: -1 },
  ];
  for (const { plant, sign } of sides) {
    const own = out * sign; // + = gain for this plant
    if (own < 0) {
      let loss = -own;
      if (plant.id === 'taraxacum-officinale' && (statKey === 'wurzel' || statKey === 'tritt')) { loss = Math.ceil(loss / 2); notes.push('Pfahlwurzelbohrer: halber Deckungsverlust'); }
      if (plant.id === 'sagina-procumbens' && statKey === 'tritt') { loss = 0; notes.push('Polstergriff: kein Trittschaden'); }
      if (plant.id === 'cardamine-hirsuta') { loss = Math.max(0, loss - 2); notes.push('Schleudersitz: +2 % Samen in Nachbarritzen'); }
      out = sign * -loss;
    } else if (own > 0 && plant.id === 'cochlearia-danica' && arena?.saline) {
      out = sign * own * 2;
      notes.push('Salzpumpe: doppelter Zugewinn in der Salzzone');
    }
    if (plant.id === 'sagina-procumbens') { out += sign * 3; notes.push('Polstergriff: +3 % Heilung'); }
  }
  return out;
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
    arena,
    state = INITIAL_DUEL_STATE,
    lang = 'de',
  } = options;

  const statKey = event.testedStat;
  const notes: string[] = [];

  // Modifiers
  const pTactic = calculateTacticBonus(selectedTactic, statKey);
  const aTactic = aiTacticOverride !== undefined ? aiTacticOverride : Math.floor(Math.random() * 3) - 1;

  const {
    pSkillBonus,
    aSkillBonus,
    effectivePlayerStat,
    effectiveAiStat,
  } = calculateSkillModifiers(playerPlant, aiPlant, statKey, arena, notes, currentRound, state);

  const pTotal = effectivePlayerStat + pTactic + pSkillBonus;
  const aTotal = effectiveAiStat + aTactic + aSkillBonus;
  const netScore = pTotal - aTotal;

  // Coverage shift: each net point grants ~4% coverage change, then deck coverage rules
  let baseShift = Math.round(netScore * 4);
  // Dauerblüte: Poa annua hat Vorrang, ein Gleichstand geht an sie
  if (netScore === 0) {
    if (playerPlant.id === 'poa-annua') { baseShift = 4; notes.push('Dauerblüte: Vorrang entscheidet den Gleichstand'); }
    else if (aiPlant.id === 'poa-annua') { baseShift = -4; notes.push('Dauerblüte: Vorrang entscheidet den Gleichstand'); }
  }
  const coverageShift = adjustCoverageShift(baseShift, playerPlant, aiPlant, statKey, arena, notes);
  let newCoverage = Math.max(0, Math.min(100, currentCoverage + coverageShift));
  // Silver Moss never drops below 5 % (Trockenstarre)
  if (playerPlant.id === 'bryum-argenteum' && newCoverage < 5) { newCoverage = 5; notes.push('Trockenstarre: nie unter 5 % Deckung'); }
  if (aiPlant.id === 'bryum-argenteum' && newCoverage > 95) { newCoverage = 95; notes.push('Trockenstarre: nie unter 5 % Deckung'); }

  // Zustand für die nächste Runde: Fallschirmwolke, Mauerkrone, Nektarrausch
  const playerWon = coverageShift > 0;
  const aiWon = coverageShift < 0;
  const nextState: DuelState = {
    cloneBonus: { ...state.cloneBonus },
    fracture: state.fracture,
    biodiversity: { ...state.biodiversity },
  };
  const sideWins: Array<['player' | 'ai', PlantRosterItem, boolean]> = [['player', playerPlant, playerWon], ['ai', aiPlant, aiWon]];
  for (const [side, plant, won] of sideWins) {
    if (!won) continue;
    if (plant.id === 'taraxacum-officinale') {
      nextState.cloneBonus[side] = Math.min(3, nextState.cloneBonus[side] + 1);
      notes.push('Fallschirmwolke: Klonpunkt in der Nachbarritze (+1 ab nächster Runde)');
    }
    if (plant.id === 'buddleja-davidii') {
      nextState.fracture = Math.min(3, nextState.fracture + 1);
      nextState.biodiversity[side] += 1;
      notes.push('Mauerkrone: Mörtelfuge gerissen, Arena dauerhaft verändert');
    }
  }
  for (const [side, plant] of [['player', playerPlant], ['ai', aiPlant]] as const) {
    if (plant.id === 'buddleja-davidii') nextState.biodiversity[side] += 1; // Nektarrausch: jede Runde Bestäuber
  }

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
    state: nextState,
    notes: Array.from(new Set(notes)),
    isBattleOver,
    winner,
  };
}

/**
 * Calculates seed reward upon battle completion.
 */
export function calculateSeedReward(winner: 'player' | 'ai' | 'draw' | null, finalCoverage: number, biodiversity = 0): number {
  // Nektarrausch: ab 4 Biodiversitätspunkten ein Zusatzsamen, auch bei Niederlage
  const nectar = biodiversity >= 4 ? 1 : 0;
  if (winner === 'player' || finalCoverage > 50) {
    return 2 + nectar;
  }
  return nectar;
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

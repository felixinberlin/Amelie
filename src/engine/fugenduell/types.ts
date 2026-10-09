import { PlantRosterItem, BattleEvent, ArenaContext } from '../../data/fugenduellData';

/** Mehrrunden-Zustand der Deck-Fähigkeiten (Fallschirmwolke, Mauerkrone, Nektarrausch). */
export interface DuelState {
  cloneBonus: { player: number; ai: number };   // Fallschirmwolke: Klonpunkte (max 3)
  fracture: number;                              // Mauerkrone: Risse in der Arena (max 3)
  biodiversity: { player: number; ai: number };  // Nektarrausch: Punkte
}

export const INITIAL_DUEL_STATE: DuelState = {
  cloneBonus: { player: 0, ai: 0 },
  fracture: 0,
  biodiversity: { player: 0, ai: 0 },
};

export type TacticalStance = 'root_reserve' | 'rapid_spurt' | 'toxin_defense' | 'balanced';

export interface RoundResolutionResult {
  round: number;
  month: string;
  eventName: string;
  testedStat: string;
  playerStatValue: number;
  aiStatValue: number;
  playerTacticBonus: number;
  aiTacticBonus: number;
  skillBonusPlayer: number;
  skillBonusAi: number;
  netScore: number;
  coverageShift: number; // in %
  newCoverage: number;
  summary: string;
  state: DuelState; // Zustand nach dieser Runde
  notes: string[]; // ausgelöste Fähigkeiten dieser Runde
  isBattleOver: boolean;
  winner: 'player' | 'ai' | 'draw' | null;
}

export interface RoundResolutionOptions {
  playerPlant: PlantRosterItem;
  aiPlant: PlantRosterItem;
  event: BattleEvent;
  currentRound: number;
  currentCoverage: number;
  selectedTactic: TacticalStance;
  aiTacticOverride?: number;
  arena?: ArenaContext;
  state?: DuelState;
  lang?: 'de' | 'en' | 'es';
}

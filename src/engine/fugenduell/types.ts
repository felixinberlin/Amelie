import { PlantRosterItem, BattleEvent } from '../../data/fugenduellData';

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
  lang?: 'de' | 'en' | 'es';
}

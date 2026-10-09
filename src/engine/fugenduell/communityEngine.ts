import { requirePrototypeStat } from './battleEngine';
import { BOTANY } from '../../data/fugenduellBotany';
import { FUGENDUELL_STARTER_ROSTER, SEASONAL_BATTLE_EVENTS } from '../../data/fugenduellData';

export const ACTIONS = {
  roots: { de: 'Wurzeln stärken', en: 'Establish roots', cost: 2, noteDe: '+2 Widerstand (+3 bei Pfahlwurzel)', noteEn: '+2 resistance (+3 with taproot)' },
  grow: { de: 'Blätter entfalten', en: 'Grow leaves', cost: 2, noteDe: '+7 Raumanspruch, −1 Reserve', noteEn: '+7 space demand, −1 reserve' },
  store: { de: 'Reserven bilden', en: 'Build reserves', cost: 1, noteDe: '+3 Reserve für Stress und Regeneration', noteEn: '+3 reserve for stress and recovery' },
  seeds: { de: 'Ausbreiten', en: 'Disperse', cost: 2, noteDe: '+3 Besiedlungskraft (+4 bei belegter Ausbreitung)', noteEn: '+3 colonisation (+4 with documented dispersal)' },
  repair: { de: 'Nachwachsen', en: 'Regrow', cost: 1, noteDe: 'Bis zu 3 Reserven in Raumanspruch umwandeln', noteEn: 'Convert up to 3 reserves into space demand' },
  hold: { de: 'Standhalten', en: 'Hold position', cost: 0, noteDe: '+4 Widerstand nur für diese Runde', noteEn: '+4 resistance for this round' },
} as const;
export type Action = keyof typeof ACTIONS;
export interface PlantState { id: string; cover: number; reserve: number; roots: number; seeds: number }
export interface Community { plants: PlantState[]; energy: number; hand: Action[]; draw: Action[]; discard: Action[] }
export interface CommunityGame { player: Community; rival: Community; round: number; seed: number; log: string[]; winner: 'player' | 'rival' | 'draw' | null }
export type Habitat = 'pavement' | 'wall' | 'roadside';
export function cover(side: Community): number { return side.plants.reduce((sum, p) => sum + p.cover, 0); }
export function emptyGround(game: CommunityGame): number { return Math.max(0, 100 - cover(game.player) - cover(game.rival)); }
function random(seed: number): [number, number] { const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return [next / 4294967296, next]; }
function shuffle(cards: Action[], game: { seed: number }): Action[] {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) { const [r, next] = random(game.seed); game.seed = next; const j = Math.floor(r * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
function refill(side: Community, game: { seed: number }): void {
  while (side.hand.length < 3) {
    if (!side.draw.length) { side.draw = shuffle(side.discard, game); side.discard = []; }
    const card = side.draw.pop(); if (!card) break; side.hand.push(card);
  }
}
export function startCommunity(ids: string[], seed = 1): CommunityGame {
  if (ids.length !== 3 || new Set(ids).size !== 3 || ids.some(id => !FUGENDUELL_STARTER_ROSTER.some(p => p.id === id && !p.bannedFromRanked))) throw new Error('Choose three distinct playable species');
  if (ids.some(id => FUGENDUELL_STARTER_ROSTER.find(p => p.id === id)?.totalBudget === null)) throw new Error('Game conversion pending');
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 4294967295) throw new Error('Invalid seed');
  const game: CommunityGame = { player: null!, rival: null!, round: 1, seed, log: [], winner: null };
  const make = (species: string[]): Community => {
    const side: Community = { plants: species.map(id => ({ id, cover: 12, reserve: 2, roots: 0, seeds: 0 })), energy: 4, hand: [], draw: shuffle((Object.keys(ACTIONS) as Action[]).flatMap(a => [a, a]), game), discard: [] }; refill(side, game); return side;
  };
  game.player = make(ids); game.rival = make(['poa-annua', 'portulaca-oleracea', 'cardamine-hirsuta']); return game;
}
function trait(p: PlantState, round: number, habitat: Habitat): number {
  const species = FUGENDUELL_STARTER_ROSTER.find(s => s.id === p.id)!;
  const stat = SEASONAL_BATTLE_EVENTS[round - 1].testedStat;
  const context = habitat === 'wall' ? (BOTANY[p.id]?.wall ? 2 : 0) : habitat === 'roadside' && stat === 'chemie' ? -1 : 0;
  return requirePrototypeStat(species, stat) + context;
}
function apply(side: Community, index: number, target: number): { demand: number[]; shields: number[]; action: Action } {
  const action = side.hand[index]; const plant = side.plants[target];
  if (!action || !plant || ACTIONS[action].cost > side.energy) throw new Error('Invalid or unaffordable action');
  const demand = side.plants.map(() => 0); const shields = side.plants.map(() => 0);
  side.energy -= ACTIONS[action].cost; side.discard.push(...side.hand.splice(index, 1));
  if (action === 'roots') plant.roots = Math.min(6, plant.roots + (BOTANY[plant.id]?.taproot ? 3 : 2));
  if (action === 'grow') { demand[target] = 7; plant.reserve = Math.max(0, plant.reserve - 1); }
  if (action === 'store') plant.reserve = Math.min(8, plant.reserve + 3);
  if (action === 'seeds') plant.seeds = Math.min(6, plant.seeds + (BOTANY[plant.id]?.dispersal ? 4 : 3));
  if (action === 'repair') { const spent = Math.min(3, plant.reserve); plant.reserve -= spent; demand[target] = spent * 3; }
  if (action === 'hold') shields[target] = 4;
  return { demand, shields, action };
}
/** Playful allocation model. Trait scores and all coefficients are game design, not measurements. */
export function playCommunity(game: CommunityGame, cardIndex: number, targetIndex: number, habitat: Habitat): CommunityGame {
  if (game.winner) throw new Error('Season finished');
  const next: CommunityGame = structuredClone(game);
  const pAction = apply(next.player, cardIndex, targetIndex);
  const rivalTarget = next.rival.plants.map((p, i) => ({ i, value: trait(p, next.round, habitat) + p.reserve })).sort((a, b) => a.value - b.value)[0].i;
  const affordable = next.rival.hand.map((a, i) => ({ a, i })).filter(({ a }) => ACTIONS[a].cost <= next.rival.energy);
  const preferred = next.rival.plants[rivalTarget].reserve < 2 ? ['store', 'hold', 'roots', 'seeds', 'grow', 'repair'] : ['roots', 'seeds', 'repair', 'grow', 'store', 'hold'];
  affordable.sort((a, b) => preferred.indexOf(a.a) - preferred.indexOf(b.a));
  const aAction = apply(next.rival, affordable[0]?.i ?? 0, rivalTarget);
  const event = SEASONAL_BATTLE_EVENTS[next.round - 1];
  const before = [cover(next.player), cover(next.rival)];
  [next.player, next.rival].forEach((side, sideIndex) => {
    const action = sideIndex === 0 ? pAction : aAction;
    side.plants.forEach((plant, i) => {
      const stress = Math.max(0, event.environmentalIntensity * 2 - trait(plant, next.round, habitat) - plant.roots - action.shields[i]);
      const spent = Math.min(plant.reserve, Math.ceil(stress / 2)); plant.reserve -= spent;
      plant.cover = Math.max(0, plant.cover - Math.max(0, stress - spent));
    });
  });
  const space = emptyGround(next);
  const demands = [next.player, next.rival].flatMap((side, s) => side.plants.map((p, i) => ({ p, amount: (s === 0 ? pAction : aAction).demand[i] + p.seeds + (p.cover > 0 ? 1 : 0) })));
  const total = demands.reduce((sum, d) => sum + d.amount, 0);
  demands.forEach(({ p, amount }) => { p.cover += total ? amount * Math.min(1, space / total) : 0; });
  next.log.unshift(`${event.monthEn}: ${pAction.action} / ${aAction.action}; ${before[0].toFixed(1)} → ${cover(next.player).toFixed(1)} | ${before[1].toFixed(1)} → ${cover(next.rival).toFixed(1)}; ${emptyGround(next).toFixed(1)}% empty`);
  if (next.round === 6) { const difference = cover(next.player) - cover(next.rival); next.winner = Math.abs(difference) < 0.0001 ? 'draw' : difference > 0 ? 'player' : 'rival'; }
  else { next.round++; for (const side of [next.player, next.rival]) { side.energy = Math.min(6, side.energy + 2); refill(side, next); } }
  return next;
}

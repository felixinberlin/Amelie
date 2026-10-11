/**
 * Fugenduell watch mode: two communities of 3 species live through a real weather year.
 * No player input after the setup; every number comes from Pladias, UNDERPLOT or the weather data,
 * converted by the rules in 02-recherche/fugenduell-brainstorm/regelwerk-v0.1.md and wetterjahr-modus.md.
 */
import pladiasData from '../../data/fugenduellScientificTraits.json';
import { FUGENDUELL_STARTER_ROSTER } from '../../data/fugenduellData';
import { MonthCard } from './weatherYear';

export type Strategy = 'C' | 'S' | 'R';
export type LifeForm = 'therophyte' | 'hemicryptophyte' | 'phanerophyte' | null;
export interface Indicator { value: number; broad: boolean }

export interface SpeciesProfile {
  id: string;
  nameDe: string;
  nameEn: string;
  points: Record<Strategy, number>; // sums to 10
  cycle: Strategy[]; // the 10 strategy cards in play order
  heightClass: number;
  heightKnown: boolean;
  floweringMonths: number[]; // empty = unknown
  lifeForm: LifeForm;
  T: Indicator | null;
  F: Indicator | null;
}

export const WATCH_RULES = {
  version: 'watch-v1',
  capacity: 60,
  startShoots: 2,
  startSeeds: 2,
  maxHardening: 6,
  bloomMaxSeeds: 3,
  cost: { C: 2, S: 1, R: 1 } as Record<Strategy, number>,
} as const;

const pladias = pladiasData as Record<string, { values: Record<string, string> }>;
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

function indicator(raw: string | undefined): Indicator | null {
  if (!raw) return null;
  const m = /^(\d+)(x?)$/.exec(raw.trim());
  return m ? { value: Number(m[1]), broad: m[2] === 'x' } : null;
}

export function parseFlowering(raw: string | undefined): number[] {
  if (!raw) return [];
  const parts = raw.toLowerCase().split(/[–-]/).map(s => MONTHS.indexOf(s.trim()) + 1);
  if (parts.some(p => p < 1)) return [];
  const [a, b = parts[0]] = parts;
  const out: number[] = [];
  for (let m = a; ; m = (m % 12) + 1) { out.push(m); if (m === b) break; }
  return out;
}

function lifeForm(raw: string | undefined): LifeForm {
  const first = raw?.split('(')[0].trim() ?? '';
  if (first.startsWith('therophyte')) return 'therophyte';
  if (first.startsWith('hemicryptophyte')) return 'hemicryptophyte';
  if (first.includes('phanerophyte')) return 'phanerophyte';
  return null;
}

function heightClass(raw: string | undefined): number | null {
  if (!raw) return null;
  const nums = raw.split(/[–-]/).map(Number).filter(Number.isFinite);
  if (!nums.length) return null;
  const mid = nums.length > 1 ? (nums[0] + nums[1]) / 2 : nums[0];
  return mid <= 0.1 ? 1 : mid <= 0.3 ? 2 : mid <= 1 ? 3 : mid <= 5 ? 4 : 5;
}

/** Largest-remainder rounding of the Pierce C/S/R scores to 10 points. */
export function strategyPoints(c: number, s: number, r: number): Record<Strategy, number> {
  const raw = [c, s, r].map(x => x / 10);
  const floor = raw.map(Math.floor);
  const order = [0, 1, 2].sort((a, b) => (raw[b] - floor[b]) - (raw[a] - floor[a]) || a - b);
  const missing = 10 - floor.reduce((x, y) => x + y, 0);
  for (let k = 0; k < missing; k++) floor[order[k]]++;
  return { C: floor[0], S: floor[1], R: floor[2] };
}

/** Interleaves the strategy cards evenly (C before S before R on ties). */
export function strategyCycle(points: Record<Strategy, number>): Strategy[] {
  if (points.C + points.S + points.R !== 10 || [points.C, points.S, points.R].some(n => !Number.isInteger(n) || n < 0)) throw new Error('Strategy points must be 10 whole points');
  const used: Record<Strategy, number> = { C: 0, S: 0, R: 0 };
  const out: Strategy[] = [];
  for (let k = 1; k <= 10; k++) {
    const pick = (['C', 'S', 'R'] as Strategy[]).filter(t => used[t] < points[t]).sort((a, b) => (points[b] * k / 10 - used[b]) - (points[a] * k / 10 - used[a]))[0];
    used[pick]++; out.push(pick);
  }
  return out;
}

/** Builds a playable species from the verified data, or null if it is locked (no CSR) or banned. */
export function speciesProfile(id: string): SpeciesProfile | null {
  const species = FUGENDUELL_STARTER_ROSTER.find(p => p.id === id);
  const v = pladias[id]?.values;
  if (!species || species.bannedFromRanked || id === 'ailanthus-altissima' || !v) return null;
  const score = (k: string) => parseFloat(v[`Life strategy (Pierce method, ${k}-score)`] ?? '');
  const [c, s, r] = ['C', 'S', 'R'].map(score);
  if (![c, s, r].every(Number.isFinite)) return null;
  const points = strategyPoints(c, s, r);
  const h = heightClass(v['Height [m]']);
  return {
    id, nameDe: species.nameCommonDe, nameEn: species.nameCommonEn, points, cycle: strategyCycle(points),
    heightClass: h ?? 2, heightKnown: h !== null,
    floweringMonths: parseFlowering(v['Flowering period [month]']),
    lifeForm: lifeForm(v['Life form']),
    T: indicator(v['Temperature indicator value']),
    F: indicator(v['Moisture indicator value']),
  };
}

export function playableSpecies(): SpeciesProfile[] {
  return FUGENDUELL_STARTER_ROSTER.map(p => speciesProfile(p.id)).filter((p): p is SpeciesProfile => p !== null);
}

/** Southern hemisphere: Central European flowering calendar shifted by 6 months (approximation, flagged in the UI). */
export function localFlowering(p: SpeciesProfile, lat: number): number[] {
  return lat < 0 ? p.floweringMonths.map(m => ((m + 5) % 12) + 1) : p.floweringMonths;
}

export interface PlantState { id: string; side: 0 | 1; shoots: number; seeds: number; hardening: number; next: number; shootMonths: number }
export interface MonthLog { card: MonthCard; lines: string[]; shoots: number[][]; seeds: number[][]; sideShoots: [number, number] }
export interface WatchResult { months: MonthLog[]; plants: PlantState[]; score: [number, number]; seeds: [number, number]; winner: 0 | 1 | 'draw' }

const name = (p: SpeciesProfile, lang: 'de' | 'en') => lang === 'de' ? p.nameDe : p.nameEn;
const warmBonus = (p: SpeciesProfile, card: MonthCard) => card.warm && p.T && !p.T.broad && p.T.value >= 7 ? 1 : 0;
const rainBonus = (p: SpeciesProfile, card: MonthCard) => card.rain && p.F && !p.F.broad && p.F.value >= 6 ? 1 : 0;

export function runWatch(sides: [string[], string[]], cards: MonthCard[], lat: number, lang: 'de' | 'en' = 'en'): WatchResult {
  if (cards.length !== 12) throw new Error('Need 12 month cards');
  const profiles = sides.map(ids => {
    if (ids.length !== 3 || new Set(ids).size !== 3) throw new Error('Each side needs three distinct species');
    return ids.map(id => { const p = speciesProfile(id); if (!p) throw new Error(`Species not playable: ${id}`); return p; });
  });
  const R = WATCH_RULES;
  const plants: PlantState[] = profiles.flatMap((ps, side) => ps.map(p => ({ id: p.id, side: side as 0 | 1, shoots: R.startShoots, seeds: R.startSeeds, hardening: 0, next: 0, shootMonths: 0 })));
  const prof = (s: PlantState) => profiles[s.side][plants.filter(x => x.side === s.side).indexOf(s)];
  const months: MonthLog[] = [];

  for (const card of cards) {
    const lines: string[] = [];
    // 1. Bloom: in the flowering window, existing shoots set seed.
    for (const s of plants) {
      const p = prof(s);
      if (s.shoots > 0 && localFlowering(p, lat).includes(card.month)) {
        const n = Math.min(R.bloomMaxSeeds, s.shoots); s.seeds += n;
        lines.push(`${name(p, lang)}: bloom +${n} seed`);
      }
    }
    // 2. Strategy cards, paid with day-length energy.
    for (const s of plants) {
      const p = prof(s); let energy = card.energy; const played: string[] = [];
      let skipped = 0;
      while (skipped < p.cycle.length && R.cost[p.cycle[s.next % p.cycle.length]] <= energy) {
        const t = p.cycle[s.next % p.cycle.length];
        // A card that cannot do anything is skipped at no cost (no parent shoot / no seed).
        if ((t === 'C' && s.shoots === 0) || (t === 'R' && s.seeds === 0)) { s.next++; skipped++; continue; }
        skipped = 0; energy -= R.cost[t]; s.next++;
        const bonus = warmBonus(p, card) + rainBonus(p, card);
        if (t === 'C') {
          let add = 2 + bonus; if (card.cold) add = Math.min(add, 1);
          s.shoots += add; played.push(`Spread+${add}`);
        } else if (t === 'R') {
          let n = Math.min(s.seeds, 2 + (card.rain ? 1 : 0)); if (card.cold) n = Math.min(n, 1);
          s.seeds -= n; const add = card.cold ? n : n + bonus; s.shoots += add; played.push(`Sprout+${add}`);
        } else {
          s.hardening = Math.min(R.maxHardening, s.hardening + 2); played.push('Endure+2');
        }
      }
      if (played.length) lines.push(`${name(p, lang)}: ${played.join(', ')}`);
    }
    // 3. Shading: over capacity, the lowest plants lose first.
    let total = plants.reduce((x, s) => x + s.shoots, 0);
    const shaded = new Map<PlantState, number>();
    let lastSide: 0 | 1 = 1;
    while (total > R.capacity) {
      // Lowest height first, then most shoots; remaining ties alternate between the sides (mirror matches stay symmetric).
      const victim = plants.filter(s => s.shoots > 0).sort((a, b) => prof(a).heightClass - prof(b).heightClass || b.shoots - a.shoots || (a.side === lastSide ? 1 : 0) - (b.side === lastSide ? 1 : 0))[0];
      victim.shoots--; total--; lastSide = victim.side; shaded.set(victim, (shaded.get(victim) ?? 0) + 1);
    }
    for (const [s, n] of shaded) lines.push(`${name(prof(s), lang)}: shaded −${n}`);
    // 4. Weather events, absorbed by hardening.
    if (card.heat || card.drought || card.frost) {
      for (const s of plants) {
        const p = prof(s);
        const heat = Math.max(0, card.heat - (p.T && !p.T.broad && p.T.value >= 7 ? 1 : 0));
        const drought = Math.max(0, card.drought - (p.F && !p.F.broad && p.F.value <= 4 ? 1 : 0));
        const loss = heat + drought + card.frost;
        if (!loss || !s.shoots) continue;
        const absorbed = Math.min(s.hardening, loss); s.hardening -= absorbed;
        const lost = Math.min(s.shoots, loss - absorbed); s.shoots -= lost;
        lines.push(`${name(p, lang)}: weather −${loss} (heat ${heat}, drought ${drought}, frost ${card.frost}); hardening absorbs ${absorbed} → −${lost}`);
      }
    }
    // 5. Annuals complete their cycle after the last flowering month: shoots → seeds.
    for (const s of plants) {
      const p = prof(s); const fl = localFlowering(p, lat);
      if (p.lifeForm === 'therophyte' && fl.length && fl[fl.length - 1] === card.month && s.shoots > 0) {
        lines.push(`${name(p, lang)}: annual fruits and dies, ${s.shoots} shoots → seeds`);
        s.seeds += s.shoots; s.shoots = 0;
      }
      s.shootMonths += s.shoots;
    }
    const by = (side: number, f: (s: PlantState) => number) => plants.filter(s => s.side === side).map(f);
    months.push({ card, lines, shoots: [by(0, s => s.shoots), by(1, s => s.shoots)], seeds: [by(0, s => s.seeds), by(1, s => s.seeds)],
      sideShoots: [by(0, s => s.shoots).reduce((a, b) => a + b, 0), by(1, s => s.shoots).reduce((a, b) => a + b, 0)] });
  }
  const sum = (side: number, f: (s: PlantState) => number) => plants.filter(s => s.side === side).reduce((a, s) => a + f(s), 0);
  const score: [number, number] = [sum(0, s => s.shootMonths), sum(1, s => s.shootMonths)];
  const seeds: [number, number] = [sum(0, s => s.seeds), sum(1, s => s.seeds)];
  const winner = score[0] !== score[1] ? (score[0] > score[1] ? 0 : 1) : seeds[0] !== seeds[1] ? (seeds[0] > seeds[1] ? 0 : 1) : 'draw';
  return { months, plants, score, seeds, winner };
}

/**
 * Fugenduell watch mode: two communities of 3 species live through a real weather year.
 * No player input after the setup; every number comes from Pladias, UNDERPLOT or the weather data,
 * converted by the rules in 02-recherche/fugenduell-brainstorm/regelwerk-v0.1.md and wetterjahr-modus.md.
 */
import pladiasData from '../../data/fugenduellScientificTraits.json';
import rootData from '../../data/fugenduellRootTraits.json';
import { FUGENDUELL_STARTER_ROSTER } from '../../data/fugenduellData';
import { BOTANY } from '../../data/fugenduellBotany';
import { CityPlace } from '../../data/fugenduellPlaces';
import { MonthCard } from './weatherYear';
import { ComboHand, detectComboHands, CrackState, getCrackState } from './combos';

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
  /** Site indicators L, F, R, N, S (Pladias), used only for fit to a place. */
  site: Record<'L' | 'F' | 'R' | 'N' | 'S', Indicator | null>;
  rosette: boolean; // RHS fact sheet mentions a leaf rosette (flat to the ground)
  wallDweller: boolean; // RHS / BBS habitat: walls
  budBank: number | null; // UNDERPLOT BBsize (species mean); null = not measured
  maxHp: number; // most shoots this plant can hold, see plantMaxHp
  resist: Resistances;
}

/** Resistances: each comes from one data field; a missing value is neutral (never a weakness). */
export interface Resistances {
  heat: number; // shoots less lost per heat month: 1 if temperature indicator T ≥ 7
  drought: number; // 1 if moisture indicator F ≤ 4, 2 if F ≤ 3
  frost: number; // 1 for hemicryptophytes (Raunkiær: overwintering buds at the soil surface)
  salt: boolean | null; // true = salt indicator S ≥ 1, false = S 0 (takes salt damage), null = unknown (no damage)
  trample: boolean; // flat plant: height class 1 or rosette, no trampling loss
  shade: boolean; // light indicator L ≤ 6: shaded only after light-demanding plants of the same height
  regrowth: boolean; // bud bank ≥ 10: regrows 1 shoot after cleaning
}

export const WATCH_RULES = {
  version: 'watch-v2',
  capacity: 60,
  startShoots: 2,
  startSeeds: 2,
  maxHardening: 6,
  bloomMaxSeeds: 3,
  cost: { C: 2, S: 1, R: 1 } as Record<Strategy, number>,
} as const;

const pladias = pladiasData as Record<string, { values: Record<string, string> }>;
const roots = (rootData as { records: Record<string, { values: Record<string, number | null> }> }).records;
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

/**
 * Maximum HP = the most shoots one plant can hold.
 * Life form (Pladias, Raunkiær): annual 12, perennial herb 16, woody 20, unknown 16.
 * Bud bank (UNDERPLOT BBsize): ≥ 20 buds +4, ≥ 10 buds +2, unknown +0.
 */
export function plantMaxHp(lifeForm: LifeForm, budBank: number | null): number {
  const base = lifeForm === 'therophyte' ? 12 : lifeForm === 'phanerophyte' ? 20 : 16;
  const bonus = budBank === null ? 0 : budBank >= 20 ? 4 : budBank >= 10 ? 2 : 0;
  return base + bonus;
}

export function plantResistances(p: Pick<SpeciesProfile, 'T' | 'F' | 'site' | 'lifeForm' | 'heightClass' | 'rosette' | 'budBank'>): Resistances {
  const known = (i: Indicator | null) => i && !i.broad ? i.value : null;
  const T = known(p.T), F = known(p.F), L = known(p.site.L);
  return {
    heat: T !== null && T >= 7 ? 1 : 0,
    drought: F === null ? 0 : F <= 3 ? 2 : F <= 4 ? 1 : 0,
    frost: p.lifeForm === 'hemicryptophyte' ? 1 : 0,
    salt: p.site.S === null ? null : p.site.S.broad || p.site.S.value >= 1,
    trample: p.heightClass <= 1 || p.rosette,
    shade: L !== null && L <= 6,
    regrowth: p.budBank !== null && p.budBank >= 10,
  };
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
  const lf = lifeForm(v['Life form']);
  const budBank = roots[id]?.values.BBsize ?? null;
  const T = indicator(v['Temperature indicator value']), F = indicator(v['Moisture indicator value']);
  const site = {
    L: indicator(v['Light indicator value']), F, R: indicator(v['Reaction indicator value']),
    N: indicator(v['Nutrient indicator value']), S: indicator(v['Salinity indicator value']),
  };
  const rosette = (BOTANY[id]?.facts ?? []).some(f => /rosette/i.test(f[2]) && !/erect|arising/i.test(f[2]));
  const heightCls = h ?? 2;
  return {
    id, nameDe: species.nameCommonDe, nameEn: species.nameCommonEn, points, cycle: strategyCycle(points),
    heightClass: heightCls, heightKnown: h !== null,
    floweringMonths: parseFlowering(v['Flowering period [month]']),
    lifeForm: lf, T, F, site, rosette,
    wallDweller: !!BOTANY[id]?.wall,
    budBank, maxHp: plantMaxHp(lf, budBank),
    resist: plantResistances({ T, F, site, lifeForm: lf, heightClass: heightCls, rosette, budBank }),
  };
}

export function playableSpecies(): SpeciesProfile[] {
  return FUGENDUELL_STARTER_ROSTER.map(p => speciesProfile(p.id)).filter((p): p is SpeciesProfile => p !== null);
}

/** Southern hemisphere: Central European flowering calendar shifted by 6 months (approximation, flagged in the UI). */
export function localFlowering(p: SpeciesProfile, lat: number): number[] {
  return lat < 0 ? p.floweringMonths.map(m => ((m + 5) % 12) + 1) : p.floweringMonths;
}

export type PlantStatus = 'alive' | 'wilted' | 'dead';
/** alive: has shoots · wilted: no shoots but seeds, can sprout again · dead: no shoots and no seeds, out for the rest of the year. */
export interface PlantState {
  id: string;
  side: 0 | 1;
  shoots: number;
  seeds: number;
  hardening: number;
  next: number;
  shootMonths: number;
  status: PlantStatus;
  diedIn: number | null;
  undergroundSeeds?: number;
  ultimateUsed?: boolean;
}
export interface MonthLog { card: MonthCard; lines: string[]; shoots: number[][]; seeds: number[][]; hardening: number[][]; status: PlantStatus[][]; sideShoots: [number, number] }
export interface WatchResult {
  capacity: number;
  months: MonthLog[];
  plants: PlantState[];
  score: [number, number];
  seeds: [number, number];
  winner: 0 | 1 | 'draw';
  comboHands?: [ComboHand[], ComboHand[]];
  crackState?: CrackState;
}

/** Fit of a species to a place: indicator values within ±1 (or broad "x") count. Fewer than 3 known values = neutral. */
export function placeFit(p: SpeciesProfile, place: CityPlace): { fits: number; known: number; bonus: number } {
  let fits = 0, known = 0;
  for (const k of ['L', 'F', 'R', 'N', 'S'] as const) {
    const v = p.site[k]; if (!v) continue;
    known++; if (v.broad || Math.abs(v.value - place.profile[k]) <= 1) fits++;
  }
  let bonus = known < 3 ? 0 : fits >= 4 ? 1 : fits <= 1 ? -1 : 0;
  if (place.wallJoint && p.wallDweller) bonus += 1;
  return { fits, known, bonus };
}

/** Trampling: flat plants (height class 1 or rosette) escape, upright tall plants suffer twice. */
export function trampleLoss(p: SpeciesProfile, place: CityPlace): number {
  if (!place.trample || p.resist.trample) return 0;
  return place.trample * (p.heightClass >= 3 ? 2 : 1);
}

const localMonth = (m: number, lat: number) => lat < 0 ? ((m + 5) % 12) + 1 : m;

const name = (p: SpeciesProfile, lang: 'de' | 'en') => lang === 'de' ? p.nameDe : p.nameEn;
const warmBonus = (p: SpeciesProfile, card: MonthCard) => card.warm && p.T && !p.T.broad && p.T.value >= 7 ? 1 : 0;
const rainBonus = (p: SpeciesProfile, card: MonthCard) => card.rain && p.F && !p.F.broad && p.F.value >= 6 ? 1 : 0;

export function runWatch(sides: [string[], string[]], cards: MonthCard[], lat: number, lang: 'de' | 'en' = 'en', place?: CityPlace, crackLevel: 1 | 2 | 3 = 1): WatchResult {
  if (cards.length !== 12) throw new Error('Need 12 month cards');
  const profiles = sides.map(ids => {
    if (ids.length !== 3 || new Set(ids).size !== 3) throw new Error('Each side needs three distinct species');
    return ids.map(id => { const p = speciesProfile(id); if (!p) throw new Error(`Species not playable: ${id}`); return p; });
  });
  const R = WATCH_RULES;
  const crackState = getCrackState(crackLevel);
  const comboHands: [ComboHand[], ComboHand[]] = [
    detectComboHands(profiles[0], place),
    detectComboHands(profiles[1], place),
  ];
  const plants: PlantState[] = profiles.flatMap((ps, side) => ps.map(p => ({
    id: p.id, side: side as 0 | 1, shoots: R.startShoots, seeds: R.startSeeds, hardening: 0, next: 0,
    shootMonths: 0, status: 'alive' as PlantStatus, diedIn: null, undergroundSeeds: 0, ultimateUsed: false,
  })));
  const prof = (s: PlantState) => profiles[s.side][plants.filter(x => x.side === s.side).indexOf(s)];
  const capacity = (place?.capacity ?? R.capacity) + crackState.capacityBonus;
  const fitBonus = (p: SpeciesProfile, side: 0 | 1) => {
    let b = place ? placeFit(p, place).bonus : 0;
    if (place?.wallJoint && comboHands[side].some(h => h.id === 'mauer-clan') && p.wallDweller) b += 1;
    return b;
  };
  const months: MonthLog[] = [];

  for (let cardIdx = 0; cardIdx < cards.length; cardIdx++) {
    const card = cards[cardIdx];
    const prevCard = cardIdx > 0 ? cards[cardIdx - 1] : null;
    const lines: string[] = [];

    // Announce combos and crack state at start of year
    if (cardIdx === 0) {
      if (crackState.level > 1) {
        lines.push(lang === 'de' ? `Bodenstufe: ${crackState.nameDe} (Kapazität +${crackState.capacityBonus})` : `Soil Level: ${crackState.nameEn} (Capacity +${crackState.capacityBonus})`);
      }
      for (const side of [0, 1] as const) {
        for (const h of comboHands[side]) {
          lines.push(`${side === 0 ? (lang === 'de' ? 'Team Grün' : 'Team Green') : (lang === 'de' ? 'Team Rot' : 'Team Red')}: 💥 COMBO: ${lang === 'de' ? h.nameDe : h.nameEn} — ${lang === 'de' ? h.taglineDe : h.taglineEn}!`);
        }
      }
    }

    // Chain Reaction: Monsunbombe (rain month right after drought month)
    if (prevCard && prevCard.drought > 0 && card.rain) {
      lines.push(lang === 'de' ? '🌧️ KETTENREAKTION: Monsunbombe! Regen nach Dürre löst Massenkeimung aus!' : '🌧️ CHAIN REACTION: Monsoon Bomb! Rain after drought triggers mass germination!');
      for (const s of plants) {
        if (s.seeds > 0 && s.status !== 'dead') {
          const p = prof(s);
          const sprout = Math.min(s.seeds, 2);
          s.seeds -= sprout;
          s.shoots = Math.min(p.maxHp, s.shoots + sprout);
          lines.push(`${name(p, lang)}: Monsun-Keimung +${sprout} Triebe`);
        }
      }
    }

    // 1. Bloom: in the flowering window, existing shoots set seed.
    for (const s of plants) {
      const p = prof(s);
      if (s.shoots > 0 && localFlowering(p, lat).includes(card.month)) {
        const n = Math.min(R.bloomMaxSeeds, s.shoots); s.seeds += n;
        lines.push(`${name(p, lang)}: bloom +${n} seed`);
        // Special: Chelidonium Ameisen-Express
        if (p.id === 'chelidonium-majus' && !s.ultimateUsed && s.status !== 'dead') {
          s.ultimateUsed = true;
          s.seeds += 3;
          lines.push(`${name(p, lang)}: ⚡ SPEZIAL: Ameisen-Express (+3 Samen sicher im unterirdischen Nest!)`);
          if (comboHands[s.side].some(h => h.id === 'ameisenstrasse')) {
            const ally = plants.find(other => other.side === s.side && other !== s && other.status !== 'dead');
            if (ally) {
              ally.seeds += 1;
              lines.push(`${name(prof(ally), lang)}: Ameisenstraße (+1 Samen von Ameisen ins sichere Nest getragen!)`);
            }
          }
        }
        // Special: Buddleja Schmetterlingssturm
        if (p.id === 'buddleja-davidii' && !s.ultimateUsed && s.status !== 'dead') {
          s.ultimateUsed = true;
          s.shoots = Math.min(p.maxHp, s.shoots + 2);
          s.seeds += 3;
          lines.push(`${name(p, lang)}: ⚡ SPEZIAL: Schmetterlingssturm (Sommerblüte lockt Schwärme von Bestäubern an: +2 Triebe, +3 Samen!)`);
        }
      }
    }
    // 2. Strategy cards, paid with day-length energy (+ Staffellauf combo bonus).
    for (const s of plants) {
      const p = prof(s);
      let energy = card.energy;
      // Staffellauf bonus: +1 energy if at least one plant on side blooms this month
      if (comboHands[s.side].some(h => h.id === 'staffellauf')) {
        const anyBlooms = profiles[s.side].some(ally => localFlowering(ally, lat).includes(card.month));
        if (anyBlooms) energy += 1;
      }
      const played: string[] = [];
      if (s.status === 'dead') continue;
      let skipped = 0;
      while (skipped < p.cycle.length && R.cost[p.cycle[s.next % p.cycle.length]] <= energy) {
        const t = p.cycle[s.next % p.cycle.length];
        // A card that cannot do anything is skipped at no cost (no shoot to spread or harden / no seed).
        if (((t === 'C' || t === 'S') && s.shoots === 0) || (t === 'R' && s.seeds === 0)) { s.next++; skipped++; continue; }
        skipped = 0; energy -= R.cost[t]; s.next++;
        const bonus = warmBonus(p, card) + rainBonus(p, card) + fitBonus(p, s.side);
        if (t === 'C') {
          let add = Math.max(0, 2 + bonus); if (card.cold) add = Math.min(add, 1);
          s.shoots += add; played.push(`Spread+${add}`);
        } else if (t === 'R') {
          let n = Math.min(s.seeds, 2 + (card.rain ? 1 : 0)); if (card.cold) n = Math.min(n, 1);
          s.seeds -= n; const add = card.cold ? n : Math.max(0, n + bonus); s.shoots += add; played.push(`Sprout+${add}`);
        } else {
          s.hardening = Math.min(R.maxHardening, s.hardening + 2); played.push('Endure+2');
        }
      }
      if (s.shoots > p.maxHp) { played.push(`max HP ${p.maxHp} (−${s.shoots - p.maxHp} wasted)`); s.shoots = p.maxHp; }
      if (played.length) lines.push(`${name(p, lang)}: ${played.join(', ')}`);
    }
    // 3. Shading: over capacity, the lowest plants lose first.
    const resolveCrowding = () => {
      let total = plants.reduce((x, s) => x + s.shoots, 0);
      const shaded = new Map<PlantState, number>();
      while (total > capacity) {
        // Lowest height first, then most shoots. Exact ties all lose one shoot at once.
        const protectedByCanopy = (s: PlantState) => comboHands[s.side].some(h => h.id === 'schirm-schatten') && prof(s).resist.shade && plants.some(ally => ally.side === s.side && ally !== s && ally.shoots > 0 && prof(ally).heightClass >= 3);
        const protectedByWall = (s: PlantState) => place?.wallJoint && prof(s).wallDweller && comboHands[s.side].some(h => h.id === 'mauer-clan');
        const allAlive = plants.filter(s => s.shoots > 0);
        // Protection changes priority, never removes the capacity limit.
        const exposed = allAlive.filter(s => !protectedByCanopy(s) && !protectedByWall(s));
        const alive = exposed.length ? exposed : allAlive;
        const minH = Math.min(...alive.map(s => prof(s).heightClass));
        let tier = alive.filter(s => prof(s).heightClass === minH);
        if (tier.some(s => !prof(s).resist.shade)) tier = tier.filter(s => !prof(s).resist.shade); // shade-tolerant plants last
        const most = Math.max(...tier.map(s => s.shoots));
        for (const victim of tier.filter(s => s.shoots === most)) {
          victim.shoots--; total--; shaded.set(victim, (shaded.get(victim) ?? 0) + 1);
          // Special: Cardamine Schotenmörser triggered when shaded
          if (prof(victim).id === 'cardamine-hirsuta' && !victim.ultimateUsed && victim.status !== 'dead') {
            victim.ultimateUsed = true;
            victim.seeds += 2;
            lines.push(`${name(prof(victim), lang)}: ⚡ SPEZIAL: Schotenmörser (feuert 2 Mörsersamen bei Beschattung!)`);
          }
        }
      }
      for (const [s, n] of shaded) lines.push(`${name(prof(s), lang)}: shaded −${n}`);
    };
    resolveCrowding();

    // 4. The place: trampling every month, cleaning in maintenance months (seeds are never removed).
    if (place) {
      const cleaning = place.maintenanceMonths.includes(localMonth(card.month, lat)) || (crackState.extraCleaning && localMonth(card.month, lat) === 8);
      if (crackState.extraCleaning && localMonth(card.month, lat) === 8) lines.push(lang === 'de' ? 'Tief-Spalt: zusätzliche Reinigung im August' : 'Deep crevice: extra cleaning in August');
      let trampleVictims = 0;
      for (const s of plants) {
        const p = prof(s);
        const trampled = Math.min(s.shoots, trampleLoss(p, place));
        if (trampled) {
          s.shoots -= trampled;
          trampleVictims += trampled;
          lines.push(`${name(p, lang)}: trampled −${trampled}`);
        }
        if (cleaning && s.shoots) {
          const removed = p.lifeForm === 'phanerophyte' ? s.shoots : (p.heightClass <= 1 || p.rosette) ? Math.floor(s.shoots / 2) : Math.ceil(s.shoots / 2);
          if (removed) {
            s.shoots -= removed;
            const back = p.resist.regrowth && p.lifeForm !== 'phanerophyte' ? 1 : 0; s.shoots += back;
            lines.push(`${name(p, lang)}: cleaning removes ${removed}${back ? ', bud bank regrows 1' : ''}`);
          }
        }
      }
      // Combo: Pflaster-Panzer trigger in trampling months
      if (trampleVictims > 0) {
        for (const side of [0, 1] as const) {
          if (comboHands[side].some(h => h.id === 'pflaster-panzer')) {
            for (const s of plants.filter(x => x.side === side && (x.id === 'plantago-major' || x.id === 'sagina-procumbens'))) {
              if (s.shoots > 0 && s.shoots < prof(s).maxHp && s.status !== 'dead') {
                s.shoots += 1;
                lines.push(`${name(prof(s), lang)}: 🛡️ Pflaster-Panzer besiedelt Trittlücke (+1 Trieb)`);
              }
            }
          }
        }
      }
    }
    // 5. Weather events, changed by the place, absorbed by hardening.
    const heatBase = place ? (card.heat > 0 ? Math.max(0, card.heat + place.heatShift) : card.warm && place.heatShift > 0 ? place.heatShift : 0) : card.heat;
    const rawDrought = place && card.drought > 0 ? Math.max(0, card.drought + place.droughtShift) : card.drought;
    const droughtBase = Math.max(0, rawDrought - crackState.droughtShield);
    if (crackState.droughtShield > 0 && rawDrought > 0) {
      lines.push(lang === 'de' ? `Bodenstufe ${crackState.level}: Moos-Humus absorbiert ${crackState.droughtShield} Dürreschaden` : `Soil level ${crackState.level}: Moss-humus absorbs ${crackState.droughtShield} drought loss`);
    }
    const salt = (place?.winterSalt && card.cold) || place?.saltSpray ? 1 : 0;
    const sharedHeat = new Map<PlantState, number>();
    for (const side of [0, 1] as const) {
      if (!comboHands[side].some(h => h.id === 'hitzewelle-gang') || !heatBase) continue;
      const members = plants.filter(s => s.side === side && s.shoots > 0).sort((a, b) => a.id.localeCompare(b.id));
      // Spend the shared pool one point per member per pass; team ordering cannot decide protection.
      let pool = members.reduce((sum, s) => sum + s.hardening, 0);
      let spent = 0;
      while (pool > 0) {
        let progress = false;
        for (const s of members) {
          const need = Math.max(0, heatBase - prof(s).resist.heat);
          if (pool && (sharedHeat.get(s) ?? 0) < need) {
            sharedHeat.set(s, (sharedHeat.get(s) ?? 0) + 1); pool--; spent++; progress = true;
          }
        }
        if (!progress) break;
      }
      let debit = spent;
      while (debit > 0) for (const s of members) if (debit && s.hardening > 0) { s.hardening--; debit--; }
      if (spent) lines.push(lang === 'de' ? `COMBO: Hitzewelle-Gang teilt Härtung: ${spent} Hitzeschaden abgefangen` : `COMBO: Heatwave Gang shares hardening: ${spent} heat damage absorbed`);
    }
    if (heatBase || droughtBase || card.frost || salt) {
      for (const s of plants) {
        const p = prof(s);
        // Special: Portulaca Hitzerausch
        if (p.id === 'portulaca-oleracea' && (card.heat > 0 || (card.warm && place?.heatShift)) && !s.ultimateUsed && s.status !== 'dead') {
          s.ultimateUsed = true;
          s.shoots = Math.min(p.maxHp, s.shoots + 2);
          lines.push(`${name(p, lang)}: ⚡ SPEZIAL: Hitzerausch (C4-Nitro macht Hitze zur Nahrung: +2 Triebe!)`);
        }
        // Special: Cochlearia Salzstraßen-Sprint
        if (p.id === 'cochlearia-danica' && salt > 0 && !s.ultimateUsed && s.status !== 'dead') {
          s.ultimateUsed = true;
          s.shoots = Math.min(p.maxHp, s.shoots + 3);
          s.seeds += 2;
          lines.push(`${name(p, lang)}: ⚡ SPEZIAL: Salzstraßen-Sprint (+3 Triebe entlang der Salzstraße!)`);
        }
        let heat = Math.max(0, heatBase - p.resist.heat - (sharedHeat.get(s) ?? 0));
        if (p.lifeForm === 'therophyte' && comboHands[s.side].some(h => h.id === 'kinderstube') && heat > 0) {
          heat = Math.max(0, heat - 1);
        }
        const drought = Math.max(0, droughtBase - p.resist.drought);
        const frost = Math.max(0, card.frost - p.resist.frost);
        let saltLoss = salt && p.resist.salt === false ? 1 : 0; // unknown salt value: no penalty
        // Combo: Salzwall makes salt hit enemies without salt tolerance harder
        const enemySide = s.side === 0 ? 1 : 0;
        if (saltLoss > 0 && comboHands[enemySide].some(h => h.id === 'salzwall')) {
          saltLoss += 1;
        }
        const loss = heat + drought + frost + saltLoss;
        if (!loss || !s.shoots) continue;
        const absorbed = Math.min(s.hardening, loss); s.hardening -= absorbed;
        const lost = Math.min(s.shoots, loss - absorbed); s.shoots -= lost;
        lines.push(`${name(p, lang)}: weather −${loss} (heat ${heat}, drought ${drought}, frost ${frost}${saltLoss ? `, salt ${saltLoss}` : ''}); hardening absorbs ${absorbed} → −${lost}`);
      }
    }
    // 6. Annuals complete their cycle after the last flowering month: shoots → seeds.
    for (const s of plants) {
      const p = prof(s); const fl = localFlowering(p, lat);
      if (p.lifeForm === 'therophyte' && fl.length && fl[fl.length - 1] === card.month && s.shoots > 0) {
        lines.push(`${name(p, lang)}: annual fruits and dies, ${s.shoots} shoots → seeds`);
        s.seeds += s.shoots; s.shoots = 0;
        // Combo: Sukzessionskette gives biomass / humus boost to perennial ally
        if (comboHands[s.side].some(h => h.id === 'sukzessionskette')) {
          for (const ally of plants.filter(other => other.side === s.side && other !== s && other.status !== 'dead')) {
            const allyProf = prof(ally);
            if (allyProf.lifeForm === 'hemicryptophyte' && ally.shoots < allyProf.maxHp) {
              ally.shoots = Math.min(allyProf.maxHp, ally.shoots + 1);
              lines.push(`${name(allyProf, lang)}: Sukzessionskette (Humus aus abgestorbener Einjähriger nährt Trieb: +1 HP!)`);
            }
          }
        }
      }
    }
    // Combos and specials may add shoots after the first capacity check.
    resolveCrowding();
    for (const s of plants) {
      const p = prof(s);
      if (s.status !== 'dead') {
        const next: PlantStatus = s.shoots > 0 ? 'alive' : s.seeds > 0 ? 'wilted' : 'dead';
        if (next !== s.status) lines.push(`${name(p, lang)}: ${next === 'alive' ? 'grows again' : next === 'wilted' ? 'wilted (seeds remain)' : 'DIES OUT — no shoots, no seeds'}`);
        s.status = next; if (next === 'dead') s.diedIn = card.month;
      }
      s.shootMonths += s.shoots;
    }
    const by = <T,>(side: number, f: (s: PlantState) => T): T[] => plants.filter(s => s.side === side).map(f);
    months.push({ card, lines, shoots: [by(0, s => s.shoots), by(1, s => s.shoots)], seeds: [by(0, s => s.seeds), by(1, s => s.seeds)],
      hardening: [by(0, s => s.hardening), by(1, s => s.hardening)], status: [by(0, s => s.status), by(1, s => s.status)],
      sideShoots: [by(0, s => s.shoots).reduce((a, b) => a + b, 0), by(1, s => s.shoots).reduce((a, b) => a + b, 0)] });
  }
  const sum = (side: number, f: (s: PlantState) => number) => plants.filter(s => s.side === side).reduce((a, s) => a + f(s), 0);
  const score: [number, number] = [sum(0, s => s.shootMonths), sum(1, s => s.shootMonths)];
  const seeds: [number, number] = [sum(0, s => s.seeds), sum(1, s => s.seeds)];
  const winner = score[0] !== score[1] ? (score[0] > score[1] ? 0 : 1) : seeds[0] !== seeds[1] ? (seeds[0] > seeds[1] ? 0 : 1) : 'draw';
  return { capacity, months, plants, score, seeds, winner, comboHands, crackState };
}

import { describe, it, expect } from 'vitest';
import { aggregateMonths, dayLength, energyFor, fetchNasaPowerYear, fromFixture, monthCards, WeatherYearData, WeatherYearFixture } from './weatherYear';
import { parseFlowering, placeFit, plantMaxHp, playableSpecies, runWatch, speciesProfile, strategyCycle, strategyPoints, trampleLoss } from './watchMode';
import { CITY_PLACES, placeById } from '../../data/fugenduellPlaces';
import berlinRaw from '../../data/fugenduellWeather/berlin-2025.json';
import madridRaw from '../../data/fugenduellWeather/madrid-2025.json';

const berlin = fromFixture(berlinRaw as WeatherYearFixture);
const madrid = fromFixture(madridRaw as WeatherYearFixture);
const cards = (d: WeatherYearData) => monthCards(aggregateMonths(d));

describe('weather year (wetter-v1)', () => {
  it('computes day length astronomically', () => {
    expect(dayLength(52.52, '2025-06-21')).toBeCloseTo(16.8, 0);
    expect(dayLength(52.52, '2025-12-21')).toBeCloseTo(7.6, 0);
    expect(dayLength(0, '2025-03-20')).toBeCloseTo(12.1, 0);
    expect([energyFor(7.7), energyFor(10), energyFor(13), energyFor(16.8)]).toEqual([2, 3, 4, 5]);
  });

  it('aggregates the plant year March to February without inventing missing days', () => {
    const months = aggregateMonths(berlin);
    expect(months.map(m => m.month)).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2]);
    expect(months[0].year).toBe(2025); expect(months[11].year).toBe(2026);
    expect(months.reduce((s, m) => s + m.days, 0)).toBe(365);
    const gap: WeatherYearData = { ...berlin, days: berlin.days.map(d => d.date.startsWith('2025-07') ? { ...d, precipMm: null } : d) };
    const july = aggregateMonths(gap)[4];
    expect(july.missing).toBe(true);
    expect(monthCards(aggregateMonths(gap))[4].reasons).toContain('missing');
  });

  it('marks exactly a third of the months per category, relative to the city', () => {
    for (const d of [berlin, madrid]) {
      const c = cards(d);
      expect(c.filter(x => x.rain)).toHaveLength(4);
      expect(c.filter(x => x.warm)).toHaveLength(4);
      expect(c.filter(x => x.cold)).toHaveLength(4);
    }
  });

  it('keeps event strength absolute: Madrid summers hit harder than Berlin summers', () => {
    const peak = (d: WeatherYearData) => Math.max(...cards(d).map(c => c.heat + c.drought));
    expect(peak(madrid)).toBe(7); // August 2025: 26 hot days, 31 dry days
    expect(peak(berlin)).toBe(3);
    const madridAug = cards(madrid)[5];
    expect([madridAug.month, madridAug.heat, madridAug.drought]).toEqual([8, 3, 4]);
  });

  it('a city without hot days has heat months that cost nothing', () => {
    const cool: WeatherYearData = { ...berlin, days: berlin.days.map(d => ({ ...d, tMax: d.tMax === null ? null : Math.min(d.tMax, 25) })) };
    expect(cards(cool).every(c => c.heat === 0)).toBe(true);
  });

  it('parses NASA POWER responses and keeps fill values missing', async () => {
    const body = { header: { fill_value: -999 }, properties: { parameter: {
      T2M: { '20250301': 2, '20250302': -999 }, T2M_MAX: { '20250301': 5, '20250302': 4 }, T2M_MIN: { '20250301': -1, '20250302': 0 }, PRECTOTCORR: { '20250301': 0, '20250302': 1 },
    } } };
    const fake = (async () => ({ ok: true, json: async () => body })) as unknown as typeof fetch;
    const year = await fetchNasaPowerYear({ id: 'x', name: 'X', lat: 1, lon: 2 }, 2025, fake);
    expect(year.days).toEqual([
      { date: '2025-03-01', tMean: 2, tMax: 5, tMin: -1, precipMm: 0 },
      { date: '2025-03-02', tMean: null, tMax: 4, tMin: 0, precipMm: 1 },
    ]);
    await expect(fetchNasaPowerYear({ id: 'x', name: 'X', lat: 99, lon: 2 }, 2025, fake)).rejects.toThrow();
  });
});

describe('species from verified data', () => {
  it('rounds Pierce CSR scores to 10 strategy points', () => {
    expect(strategyPoints(82.3, 0, 17.7)).toEqual({ C: 8, S: 0, R: 2 });
    expect(strategyPoints(12.6, 54.6, 32.8)).toEqual({ C: 1, S: 6, R: 3 });
    expect(strategyCycle({ C: 8, S: 0, R: 2 }).filter(t => t === 'C')).toHaveLength(8);
  });

  it('parses flowering windows including wrap-around', () => {
    expect(parseFlowering('June–October')).toEqual([6, 7, 8, 9, 10]);
    expect(parseFlowering('June')).toEqual([6]);
    expect(parseFlowering('November–February')).toEqual([11, 12, 1, 2]);
    expect(parseFlowering(undefined)).toEqual([]);
  });

  it('locks species without CSR data and bans the tree of heaven', () => {
    expect(speciesProfile('taraxacum-officinale')).toBeNull();
    expect(speciesProfile('bryum-argenteum')).toBeNull();
    expect(speciesProfile('ailanthus-altissima')).toBeNull();
    expect(playableSpecies().map(p => p.id)).toHaveLength(10);
    const plantago = speciesProfile('plantago-major')!;
    expect(plantago.points).toEqual({ C: 8, S: 0, R: 2 });
    expect(plantago.T).toEqual({ value: 5, broad: true });
  });
});

describe('watch mode', () => {
  const heatTeam = ['portulaca-oleracea', 'asplenium-ruta-muraria', 'buddleja-davidii'];
  const neutralTeam = ['chelidonium-majus', 'plantago-major', 'poa-annua'];

  it('is deterministic and a mirror match is a draw', () => {
    for (const d of [berlin, madrid]) {
      const a = runWatch([neutralTeam, neutralTeam], cards(d), d.lat);
      expect(a.winner).toBe('draw');
      expect(runWatch([neutralTeam, neutralTeam], cards(d), d.lat)).toEqual(a);
    }
  });

  it('never exceeds the crack capacity and never goes negative', () => {
    const species = playableSpecies().map(p => p.id);
    for (const d of [berlin, madrid]) for (let i = 0; i < species.length - 5; i++) {
      const r = runWatch([species.slice(i, i + 3), species.slice(i + 3, i + 6)], cards(d), d.lat);
      for (const m of r.months) {
        expect(m.sideShoots[0] + m.sideShoots[1]).toBeLessThanOrEqual(60);
        [...m.shoots.flat(), ...m.seeds.flat()].forEach(n => expect(n).toBeGreaterThanOrEqual(0));
      }
    }
  });

  it('climate matters: the Madrid summer costs the neutral team far more than the Berlin one', () => {
    const madridGame = runWatch([neutralTeam, heatTeam], cards(madrid), madrid.lat);
    const berlinGame = runWatch([neutralTeam, heatTeam], cards(berlin), berlin.lat);
    expect(madridGame.winner).toBe(1);
    expect(madridGame.score[0]).toBeLessThan(berlinGame.score[0]);
  });

  it('every species has exactly 10 strategy cards and plays when it can', () => {
    for (const p of playableSpecies()) {
      expect(p.cycle).toHaveLength(10);
      expect(p.cycle.every(t => t === 'C' || t === 'S' || t === 'R')).toBe(true);
    }
    expect(() => strategyCycle({ C: 5, S: 4, R: 0 })).toThrow();
  });

  it('rejects locked, banned or duplicate picks', () => {
    expect(() => runWatch([['taraxacum-officinale', 'plantago-major', 'poa-annua'], heatTeam], cards(berlin), 52)).toThrow();
    expect(() => runWatch([['ailanthus-altissima', 'plantago-major', 'poa-annua'], heatTeam], cards(berlin), 52)).toThrow();
    expect(() => runWatch([['poa-annua', 'poa-annua', 'plantago-major'], heatTeam], cards(berlin), 52)).toThrow();
  });
});

describe('places in the city', () => {
  const pavement = placeById('gehwegfuge');
  const wasteland = placeById('brache');
  const wall = placeById('mauerfuge');

  it('flat plants escape trampling, tall upright plants suffer twice', () => {
    expect(speciesProfile('plantago-major')!.rosette).toBe(true); // RHS: low leaf rosette
    expect(trampleLoss(speciesProfile('plantago-major')!, placeById('platzpflaster'))).toBe(0);
    expect(trampleLoss(speciesProfile('sagina-procumbens')!, placeById('platzpflaster'))).toBe(0); // height class 1
    expect(trampleLoss(speciesProfile('poa-annua')!, placeById('platzpflaster'))).toBe(2);
    expect(trampleLoss(speciesProfile('chelidonium-majus')!, placeById('platzpflaster'))).toBe(4);
    expect(trampleLoss(speciesProfile('chelidonium-majus')!, wall)).toBe(0);
  });

  it('fits plants to places from indicator values and the wall habitat', () => {
    expect(placeFit(speciesProfile('cymbalaria-muralis')!, wall).bonus).toBe(2); // fit + wall dweller
    expect(placeFit(speciesProfile('cochlearia-danica')!, wall)).toEqual({ fits: 0, known: 0, bonus: 0 }); // missing = neutral
  });

  it('street cleaning removes woody shoots, seeds stay', () => {
    const r = runWatch([['buddleja-davidii', 'poa-annua', 'plantago-major'], ['chelidonium-majus', 'cymbalaria-muralis', 'sagina-procumbens']], cards(berlin), berlin.lat, 'en', pavement);
    const april = r.months[1];
    expect(april.lines.some(l => l.startsWith('Butterfly Bush: cleaning removes'))).toBe(true);
    expect(april.shoots[0][0]).toBe(0);
  });

  it('the place decides: butterfly bush thrives on the wasteland and collapses in the pavement crack', () => {
    const shrubTeam = ['buddleja-davidii', 'chelidonium-majus', 'cymbalaria-muralis'];
    const trampleTeam = ['plantago-major', 'poa-annua', 'cymbalaria-muralis'];
    for (const d of [berlin, madrid]) {
      const open = runWatch([shrubTeam, trampleTeam], cards(d), d.lat, 'en', wasteland);
      const crack = runWatch([shrubTeam, trampleTeam], cards(d), d.lat, 'en', pavement);
      expect(open.winner).toBe(0);
      // the shrub itself (cleaning removes all woody shoots) holds far less ground in the crack
      expect(crack.plants[0].shootMonths).toBeLessThan(open.plants[0].shootMonths * 0.25);
    }
  });

  it('stays within each place capacity and keeps mirror matches drawn', () => {
    for (const place of CITY_PLACES) for (const d of [berlin, madrid]) {
      const team = ['buddleja-davidii', 'poa-annua', 'plantago-major'];
      const r = runWatch([team, team], cards(d), d.lat, 'en', place);
      expect(r.winner).toBe('draw');
      r.months.forEach(m => expect(m.sideShoots[0] + m.sideShoots[1]).toBeLessThanOrEqual(place.capacity));
    }
  });
});

describe('HP, resistances and death (watch-v2)', () => {
  it('derives max HP from life form and bud bank; a missing bud bank is neutral', () => {
    expect(plantMaxHp('therophyte', null)).toBe(12);
    expect(plantMaxHp('hemicryptophyte', 12.5)).toBe(18);
    expect(plantMaxHp('phanerophyte', null)).toBe(20);
    expect(speciesProfile('plantago-major')!.maxHp).toBe(20); // perennial + bud bank 20
    expect(speciesProfile('portulaca-oleracea')!.maxHp).toBe(12); // annual, bud bank 1.2
    expect(speciesProfile('buddleja-davidii')!.maxHp).toBe(20); // woody, bud bank not measured
  });

  it('takes every resistance from one data field', () => {
    const wallRue = speciesProfile('asplenium-ruta-muraria')!.resist;
    expect(wallRue.drought).toBe(2); // moisture indicator 3
    expect(wallRue.salt).toBe(false); // salt indicator 0
    expect(speciesProfile('cochlearia-danica')!.resist.salt).toBeNull(); // no indicator values: unknown, no damage
    expect(speciesProfile('plantago-major')!.resist).toMatchObject({ trample: true, frost: 1, heat: 0 }); // rosette, hemicryptophyte, T 5x
    expect(speciesProfile('portulaca-oleracea')!.resist.frost).toBe(0); // annual
  });

  it('never lets a plant grow beyond its max HP', () => {
    for (const d of [berlin, madrid]) {
      const r = runWatch([['buddleja-davidii', 'chelidonium-majus', 'cymbalaria-muralis'], ['plantago-major', 'poa-annua', 'sagina-procumbens']], cards(d), d.lat, 'en', placeById('brache'));
      const ids = [['buddleja-davidii', 'chelidonium-majus', 'cymbalaria-muralis'], ['plantago-major', 'poa-annua', 'sagina-procumbens']];
      r.months.forEach(m => m.shoots.forEach((side, si) => side.forEach((n, i) => expect(n).toBeLessThanOrEqual(speciesProfile(ids[si][i])!.maxHp))));
    }
  });

  it('a plant wilts with seeds left and dies only without shoots and seeds; death is final', () => {
    const species = playableSpecies().map(p => p.id);
    let sawWilted = false, sawDead = false;
    for (const place of CITY_PLACES) for (const d of [berlin, madrid]) for (let i = 0; i + 6 <= species.length; i++) {
      const r = runWatch([species.slice(i, i + 3), species.slice(i + 3, i + 6)], cards(d), d.lat, 'en', place);
      r.months.forEach((m, k) => m.status.forEach((side, si) => side.forEach((st, j) => {
        const shoots = m.shoots[si][j], seeds = m.seeds[si][j];
        if (st === 'alive') expect(shoots).toBeGreaterThan(0);
        if (st === 'wilted') { sawWilted = true; expect(shoots).toBe(0); expect(seeds).toBeGreaterThan(0); }
        if (st === 'dead') { sawDead = true; expect(shoots + seeds).toBe(0); r.months.slice(k).forEach(later => expect(later.status[si][j]).toBe('dead')); }
      })));
    }
    expect(sawWilted).toBe(true);
    expect(sawDead).toBe(true);
  });
});

/**
 * Fugenduell weather year: a city's real daily weather -> 12 month cards (March -> February).
 *
 * Conversion "wetter-v1" (draft 11.10.2026, decided with Félix):
 * - WHICH months are rain, warm, heat, drought or cold months is relative to the city's own year
 *   (the wettest / warmest / driest / coldest third of its 12 months).
 * - HOW HARD an event hits is measured in absolute units (hot days ≥ 30 °C, dry days < 1 mm, frost days < 0 °C).
 *   A cool city has heat months, but with zero hot days they cost nothing.
 * - Energy comes from day length, which is astronomy, not a game threshold.
 */

export interface DailyWeather { date: string; tMean: number | null; tMax: number | null; tMin: number | null; precipMm: number | null }

export interface WeatherYearData {
  id: string;
  name: string;
  lat: number;
  lon: number;
  startYear: number;
  source: string;
  fetched?: string;
  days: DailyWeather[];
}

/** Compact fixture format written by scripts/fugenduell/wetterjahr.py. */
export interface WeatherYearFixture extends Omit<WeatherYearData, 'days'> {
  fields: string[];
  days: Array<[string, number | null, number | null, number | null, number | null]>;
}

export interface MonthWeather {
  year: number;
  month: number; // 1-12
  days: number; // days with complete values
  missing: boolean;
  tMean: number;
  tMaxMean: number;
  frostDays: number;
  hotDays: number;
  precipMm: number;
  longestDryRun: number;
  dayLengthH: number;
}

export interface MonthCard {
  index: number; // 0 = March
  year: number;
  month: number;
  weather: MonthWeather;
  energy: number;
  rain: boolean;
  warm: boolean;
  cold: boolean;
  heat: number; // shoots lost per species, 0 = no effect
  drought: number;
  frost: number;
  reasons: string[];
}

export const WEATHER_CONVERSION = {
  version: 'wetter-v1',
  shareOfMonths: 4, // a third of 12 months
  hotDayMinC: 30,
  dryDayMaxMm: 1,
  growingMeanMinC: 5, // drought only matters while plants grow
  heatDaysPerShoot: 10, // heat loss = ceil(hot days / 10)
  dryDaysPerShoot: 7, // drought loss = floor(longest dry run / 7)
  frostDaysPerShoot: 10, // frost loss = floor(frost days / 10)
  energyFromDayLength: [ [9, 2], [12, 3], [15, 4], [Infinity, 5] ] as Array<[number, number]>,
} as const;

export function fromFixture(f: WeatherYearFixture): WeatherYearData {
  return { id: f.id, name: f.name, lat: f.lat, lon: f.lon, startYear: f.startYear, source: f.source, fetched: f.fetched,
    days: f.days.map(([date, tMean, tMax, tMin, precipMm]) => ({ date, tMean, tMax, tMin, precipMm })) };
}

/** Hours between sunrise and sunset (CBM model, Forsythe et al. 1995, p = 0.8333°). */
export function dayLength(lat: number, isoDate: string): number {
  const d = new Date(isoDate + 'T12:00:00Z');
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const j = Math.floor((d.getTime() - start) / 86400000);
  const theta = 0.2163108 + 2 * Math.atan(0.9671396 * Math.tan(0.0086 * (j - 186)));
  const phi = Math.asin(0.39795 * Math.cos(theta));
  const p = 0.8333 * Math.PI / 180, latR = lat * Math.PI / 180;
  const x = (Math.sin(p) + Math.sin(latR) * Math.sin(phi)) / (Math.cos(latR) * Math.cos(phi));
  return 24 - (24 / Math.PI) * Math.acos(Math.max(-1, Math.min(1, x)));
}

export function energyFor(dayLengthH: number): number {
  for (const [limit, energy] of WEATHER_CONVERSION.energyFromDayLength) if (dayLengthH < limit) return energy;
  return 5;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Aggregates one plant year (March of startYear -> February of startYear + 1). Missing days are skipped, never zero. */
export function aggregateMonths(data: WeatherYearData): MonthWeather[] {
  const out: MonthWeather[] = [];
  for (let i = 0; i < 12; i++) {
    const month = ((2 + i) % 12) + 1;
    const year = data.startYear + (month < 3 ? 1 : 0);
    const prefix = `${year}-${String(month).padStart(2, '0')}-`;
    const days = data.days.filter(d => d.date.startsWith(prefix) && d.tMean !== null && d.tMax !== null && d.tMin !== null && d.precipMm !== null);
    let run = 0, longest = 0;
    for (const d of days) { run = d.precipMm! < WEATHER_CONVERSION.dryDayMaxMm ? run + 1 : 0; longest = Math.max(longest, run); }
    const n = days.length;
    out.push({
      year, month, days: n, missing: n === 0,
      tMean: n ? round1(days.reduce((s, d) => s + d.tMean!, 0) / n) : 0,
      tMaxMean: n ? round1(days.reduce((s, d) => s + d.tMax!, 0) / n) : 0,
      frostDays: days.filter(d => d.tMin! < 0).length,
      hotDays: days.filter(d => d.tMax! >= WEATHER_CONVERSION.hotDayMinC).length,
      precipMm: Math.round(days.reduce((s, d) => s + d.precipMm!, 0)),
      longestDryRun: longest,
      dayLengthH: round1(dayLength(data.lat, `${prefix}15`)),
    });
  }
  return out;
}

/** Indices of the top third by value (stable: earlier month wins ties). Missing or ineligible months never qualify. */
function third(months: MonthWeather[], value: (m: MonthWeather) => number, direction: 'high' | 'low', eligible: (m: MonthWeather) => boolean = () => true): Set<number> {
  const idx = months.map((_, i) => i).filter(i => !months[i].missing && eligible(months[i]));
  idx.sort((a, b) => direction === 'high' ? value(months[b]) - value(months[a]) || a - b : value(months[a]) - value(months[b]) || a - b);
  return new Set(idx.slice(0, WEATHER_CONVERSION.shareOfMonths));
}

export function monthCards(months: MonthWeather[]): MonthCard[] {
  if (months.length !== 12) throw new Error('A weather year needs 12 months');
  const C = WEATHER_CONVERSION;
  const rain = third(months, m => m.precipMm, 'high', m => m.precipMm > 0);
  const warm = third(months, m => m.tMean, 'high');
  const hot = third(months, m => m.tMaxMean, 'high');
  const dry = third(months, m => m.longestDryRun, 'high', m => m.tMean >= C.growingMeanMinC);
  const cold = third(months, m => m.tMean, 'low');
  return months.map((w, i) => {
    const reasons: string[] = [];
    const isRain = rain.has(i), isWarm = warm.has(i), isCold = cold.has(i);
    const heat = hot.has(i) ? Math.ceil(w.hotDays / C.heatDaysPerShoot) : 0;
    const drought = dry.has(i) ? Math.floor(w.longestDryRun / C.dryDaysPerShoot) : 0;
    const frost = isCold ? Math.floor(w.frostDays / C.frostDaysPerShoot) : 0;
    if (w.missing) reasons.push('missing');
    if (isRain) reasons.push(`rain:${w.precipMm}mm`);
    if (isWarm) reasons.push(`warm:${w.tMean}C`);
    if (hot.has(i)) reasons.push(`heat:${w.hotDays}d>=30C`);
    if (dry.has(i)) reasons.push(`drought:${w.longestDryRun}d`);
    if (isCold) reasons.push(`cold:${w.tMean}C,${w.frostDays}frost`);
    return { index: i, year: w.year, month: w.month, weather: w, energy: energyFor(w.dayLengthH), rain: isRain, warm: isWarm, cold: isCold, heat, drought, frost, reasons };
  });
}

/** Loads one plant year from the NASA POWER daily API (CORS open, no key). */
export async function fetchNasaPowerYear(city: { id: string; name: string; lat: number; lon: number }, startYear: number, fetchImpl: typeof fetch = fetch): Promise<WeatherYearData> {
  if (!(city.lat >= -90 && city.lat <= 90 && city.lon >= -180 && city.lon <= 180)) throw new Error('Invalid coordinates');
  if (!Number.isInteger(startYear) || startYear < 1981) throw new Error('Invalid year');
  const params = 'T2M,T2M_MAX,T2M_MIN,PRECTOTCORR';
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${params}&community=AG&longitude=${city.lon}&latitude=${city.lat}&start=${startYear}0301&end=${startYear + 1}0228&format=JSON`;
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`NASA POWER ${response.status}`);
  const json = await response.json();
  const raw = json?.properties?.parameter;
  if (!raw?.T2M) throw new Error('Unexpected NASA POWER response');
  const fill = json?.header?.fill_value ?? -999;
  const v = (p: string, k: string): number | null => { const x = raw[p]?.[k]; return typeof x === 'number' && x !== fill ? x : null; };
  const days = Object.keys(raw.T2M).sort().map(k => ({ date: `${k.slice(0, 4)}-${k.slice(4, 6)}-${k.slice(6, 8)}`, tMean: v('T2M', k), tMax: v('T2M_MAX', k), tMin: v('T2M_MIN', k), precipMm: v('PRECTOTCORR', k) }));
  return { ...city, startYear, source: 'NASA POWER Daily API v2 (MERRA-2), community AG', fetched: new Date().toISOString().slice(0, 10), days };
}

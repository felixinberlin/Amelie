import React, { useEffect, useMemo, useState } from 'react';
import { Language } from '../../types';
import { CITY_PLACES, placeById } from '../../data/fugenduellPlaces';
import { aggregateMonths, fetchNasaPowerYear, fromFixture, MonthCard, monthCards, WeatherYearData, WeatherYearFixture } from '../../engine/fugenduell/weatherYear';
import { placeFit, playableSpecies, runWatch, SpeciesProfile, trampleLoss, WatchResult } from '../../engine/fugenduell/watchMode';
import berlin2025 from '../../data/fugenduellWeather/berlin-2025.json';
import madrid2025 from '../../data/fugenduellWeather/madrid-2025.json';

const CITIES = [
  { id: 'berlin', name: 'Berlin', lat: 52.52, lon: 13.41 },
  { id: 'madrid', name: 'Madrid', lat: 40.42, lon: -3.70 },
  { id: 'sevilla', name: 'Sevilla', lat: 37.39, lon: -5.98 },
  { id: 'barcelona', name: 'Barcelona', lat: 41.39, lon: 2.17 },
  { id: 'paris', name: 'Paris', lat: 48.86, lon: 2.35 },
  { id: 'london', name: 'London', lat: 51.51, lon: -0.13 },
  { id: 'wien', name: 'Wien / Vienna', lat: 48.21, lon: 16.37 },
  { id: 'roma', name: 'Roma', lat: 41.9, lon: 12.5 },
  { id: 'stockholm', name: 'Stockholm', lat: 59.33, lon: 18.07 },
  { id: 'reykjavik', name: 'Reykjavík', lat: 64.15, lon: -21.94 },
  { id: 'cairo', name: 'Cairo', lat: 30.04, lon: 31.24 },
  { id: 'delhi', name: 'Delhi', lat: 28.61, lon: 77.21 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { id: 'singapore', name: 'Singapore', lat: 1.35, lon: 103.82 },
  { id: 'newyork', name: 'New York', lat: 40.71, lon: -74.01 },
  { id: 'mexico', name: 'Ciudad de México', lat: 19.43, lon: -99.13 },
  { id: 'buenosaires', name: 'Buenos Aires', lat: -34.6, lon: -58.38 },
  { id: 'sydney', name: 'Sydney', lat: -33.87, lon: 151.21 },
];
const FIXTURES: Record<string, WeatherYearFixture> = { 'berlin-2025': berlin2025 as WeatherYearFixture, 'madrid-2025': madrid2025 as WeatherYearFixture };
const LAST_YEAR = 2025; // plant year March 2025 – February 2026 is the latest complete one
const YEARS = Array.from({ length: LAST_YEAR - 1981 + 1 }, (_, i) => LAST_YEAR - i);
const TEAM_COLOURS = [['#166534', '#22c55e', '#86efac'], ['#9f1239', '#f43f5e', '#fda4af']];

interface Game { data: WeatherYearData; cards: MonthCard[]; result: WatchResult; teams: [string[], string[]]; placeId: string }

export function FugenduellWeatherWatch({ lang }: { lang: Language }) {
  const de = lang === 'de';
  const t = (d: string, e: string) => (de ? d : e);
  const engineLang = de ? 'de' : 'en';
  const species = useMemo(() => playableSpecies(), []);
  const nameOf = (id: string) => { const p = species.find(s => s.id === id); return p ? (de ? p.nameDe : p.nameEn) : id; };
  const monthName = (m: number) => new Intl.DateTimeFormat(lang, { month: 'short' }).format(new Date(Date.UTC(2025, m - 1, 15)));

  const [cityId, setCityId] = useState('berlin');
  const [custom, setCustom] = useState({ lat: '52.52', lon: '13.41' });
  const [year, setYear] = useState(LAST_YEAR);
  const [placeId, setPlaceId] = useState('gehwegfuge');
  const [teamA, setTeamA] = useState(['plantago-major', 'poa-annua', 'sagina-procumbens']);
  const [teamB, setTeamB] = useState(['buddleja-davidii', 'chelidonium-majus', 'portulaca-oleracea']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [step, setStep] = useState(0); // 0 = start, k = after month k
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || !game) return;
    if (step >= 12) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep(s => s + 1), 1300);
    return () => window.clearTimeout(timer);
  }, [playing, step, game]);

  const teamValid = (team: string[]) => new Set(team).size === 3;
  const start = async () => {
    if (!teamValid(teamA) || !teamValid(teamB)) { setError(t('Jedes Team braucht drei verschiedene Arten.', 'Each team needs three different species.')); setStatus('error'); return; }
    const preset = CITIES.find(c => c.id === cityId);
    const city = preset ?? { id: 'custom', name: `${custom.lat}, ${custom.lon}`, lat: Number(custom.lat), lon: Number(custom.lon) };
    setStatus('loading'); setError(''); setPlaying(false);
    try {
      const fixture = FIXTURES[`${city.id}-${year}`];
      const data = fixture ? fromFixture(fixture) : await fetchNasaPowerYear(city, year);
      const months = aggregateMonths(data);
      if (months.filter(m => m.missing).length > 2) throw new Error('too many missing months');
      const cards = monthCards(months);
      const teams: [string[], string[]] = [teamA, teamB];
      const result = runWatch(teams, cards, data.lat, engineLang, placeById(placeId));
      setGame({ data, cards, result, teams, placeId }); setStep(0); setStatus('idle');
    } catch {
      setStatus('error');
      setError(t('Das Wetterjahr konnte nicht geladen werden (Netz, Koordinaten oder Jahr). Berlin und Madrid 2025 funktionieren auch offline.', 'Could not load the weather year (network, coordinates or year). Berlin and Madrid 2025 also work offline.'));
    }
  };

  const select = (team: string[], setTeam: (t: string[]) => void, side: 0 | 1) => team.map((id, i) => (
    <label key={i} className="block text-sm">
      <span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{ background: TEAM_COLOURS[side][i] }} aria-hidden="true" />
      {t('Pflanze', 'Plant')} {i + 1}
      <select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={id} onChange={e => setTeam(team.map((old, j) => (j === i ? e.target.value : old)))}>
        {species.map(p => <option key={p.id} value={p.id}>{de ? p.nameDe : p.nameEn}</option>)}
      </select>
    </label>
  ));

  const place = placeById(game?.placeId ?? placeId);
  const month = game && step > 0 ? game.result.months[step - 1] : null;
  const shootsAt = (side: 0 | 1, i: number) => (month ? month.shoots[side][i] : 2);
  const seedsAt = (side: 0 | 1, i: number) => (month ? month.seeds[side][i] : 2);
  const total = (side: 0 | 1) => [0, 1, 2].reduce((s, i) => s + shootsAt(side, i), 0);
  const runningScore = (side: 0 | 1) => game ? game.result.months.slice(0, step).reduce((s, m) => s + m.sideShoots[side], 0) : 0;

  const cardBadges = (c: MonthCard) => {
    const b: string[] = [];
    if (c.rain) b.push(`🌧 ${t('Regen', 'rain')}`);
    if (c.warm) b.push(`☀ ${t('warm', 'warm')}`);
    if (c.heat) b.push(`🔥 ${t('Hitze', 'heat')} ${c.heat}`);
    if (c.drought) b.push(`🏜 ${t('Dürre', 'drought')} ${c.drought}`);
    if (c.cold) b.push(`❄ ${t('kalt', 'cold')}${c.frost ? ` · ${t('Frost', 'frost')} ${c.frost}` : ''}`);
    return b;
  };

  return (
    <section className="space-y-4 min-w-0">
      <header className="rounded-2xl bg-stone-900 text-white p-4 sm:p-6">
        <h2 className="text-2xl font-bold">{t('Wetterjahr: Stadt wählen, Ort wählen, zuschauen.', 'Weather year: pick a city, pick a place, watch.')}</h2>
        <p className="mt-2 text-sm">{t('Zwei Gemeinschaften aus je drei Arten leben ein echtes Wetterjahr lang (März bis Februar) an einem Ort in der Stadt. Niemand greift ein: Wetter, Ort und die gemessenen Pflanzendaten entscheiden.', 'Two communities of three species each live through a real weather year (March to February) at one place in the city. Nobody intervenes: weather, place and the measured plant data decide.')}</p>
        <p className="mt-2 text-sm text-amber-200">{t('Pflanzenwerte: Pladias, UNDERPLOT, RHS. Wetter: NASA POWER (Raster ca. 50 km, ohne städtische Wärmeinsel). Ortswerte (Tritt, Reinigung, Platz) sind Spielannahmen. Regeln: watch-v1, wetter-v1.', 'Plant values: Pladias, UNDERPLOT, RHS. Weather: NASA POWER (grid about 50 km, no urban heat island). Place values (trampling, cleaning, space) are game assumptions. Rules: watch-v1, wetter-v1.')}</p>
      </header>

      <div className="rounded-xl border bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block text-sm">{t('Stadt', 'City')}
            <select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={cityId} onChange={e => setCityId(e.target.value)}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              <option value="custom">{t('Eigene Koordinaten …', 'Custom coordinates …')}</option>
            </select>
          </label>
          <label className="block text-sm">{t('Pflanzenjahr (März – Februar)', 'Plant year (March – February)')}
            <select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={year} onChange={e => setYear(Number(e.target.value))}>
              {YEARS.map(y => <option key={y} value={y}>{y}/{String(y + 1).slice(2)}</option>)}
            </select>
          </label>
          <label className="block text-sm">{t('Ort in der Stadt', 'Place in the city')}
            <select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={placeId} onChange={e => setPlaceId(e.target.value)}>
              {CITY_PLACES.map(p => <option key={p.id} value={p.id}>{de ? p.labelDe : lang === 'es' ? p.labelEs : p.labelEn}</option>)}
            </select>
          </label>
        </div>
        {cityId === 'custom' && <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">{t('Breite', 'Latitude')}<input inputMode="decimal" className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={custom.lat} onChange={e => setCustom({ ...custom, lat: e.target.value })} /></label>
          <label className="block text-sm">{t('Länge', 'Longitude')}<input inputMode="decimal" className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={custom.lon} onChange={e => setCustom({ ...custom, lon: e.target.value })} /></label>
        </div>}
        <p className="text-sm text-stone-600">{de ? placeById(placeId).descriptionDe : placeById(placeId).descriptionEn} {t('Platz', 'Space')}: {placeById(placeId).capacity}.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <fieldset className="space-y-2"><legend className="font-bold text-emerald-800">{t('Team Grün', 'Team green')}</legend>{select(teamA, setTeamA, 0)}</fieldset>
          <fieldset className="space-y-2"><legend className="font-bold text-rose-800">{t('Team Rot', 'Team red')}</legend>{select(teamB, setTeamB, 1)}</fieldset>
        </div>
        <button onClick={start} disabled={status === 'loading'} className="min-h-11 rounded-lg bg-emerald-800 px-4 text-white font-bold disabled:opacity-50">
          {status === 'loading' ? t('Lade Wetterjahr …', 'Loading weather year …') : t('Jahr laden und zuschauen', 'Load the year and watch')}
        </button>
        {status === 'error' && <p role="alert" className="text-rose-800">{error}</p>}
      </div>

      {game && <>
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <h3 className="font-bold">{game.data.name} · {game.data.startYear}/{String(game.data.startYear + 1).slice(2)} · {de ? place.labelDe : place.labelEn}</h3>
          {game.data.lat < 0 && <p className="text-sm text-amber-800">{t('Südhalbkugel: Blühmonate und Reinigungsmonate um 6 Monate verschoben (Näherung). Die Pflanzendaten stammen aus Mitteleuropa.', 'Southern hemisphere: flowering and cleaning months shifted by 6 months (approximation). The plant data are from Central Europe.')}</p>}
          {Math.abs(game.data.lat) < 23.5 && <p className="text-sm text-amber-800">{t('Tropen: Die Blühkalender aus Mitteleuropa gelten hier nicht. Ein Gedankenexperiment, keine Vorhersage.', 'Tropics: the Central European flowering calendars do not apply here. A thought experiment, not a prediction.')}</p>}
          <ol className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1" aria-label={t('Monatskarten', 'Month cards')}>
            {game.cards.map((c, i) => (
              <li key={i}>
                <button onClick={() => { setPlaying(false); setStep(i + 1); }} aria-current={step === i + 1 ? 'step' : undefined}
                  className={`w-full min-h-24 rounded-lg border p-1 text-left text-xs ${step === i + 1 ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400' : i < step ? 'bg-stone-50' : 'bg-white'}`}>
                  <strong className="block text-sm">{monthName(c.month)}</strong>
                  <span className="block">⚡{c.energy} · {c.weather.tMean}°C</span>
                  {cardBadges(c).map(b => <span key={b} className="block">{b}</span>)}
                </button>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2">
            <button className="min-h-11 rounded-lg border px-4" onClick={() => { setPlaying(false); setStep(0); }}>⏮ {t('Anfang', 'Start')}</button>
            <button className="min-h-11 rounded-lg border px-4" disabled={step === 0} onClick={() => { setPlaying(false); setStep(s => Math.max(0, s - 1)); }}>◀ {t('Zurück', 'Back')}</button>
            <button className="min-h-11 rounded-lg bg-emerald-800 px-4 text-white font-bold" onClick={() => { if (step >= 12) setStep(0); setPlaying(p => !p); }}>{playing ? `⏸ ${t('Pause', 'Pause')}` : `▶ ${t('Abspielen', 'Play')}`}</button>
            <button className="min-h-11 rounded-lg border px-4" disabled={step >= 12} onClick={() => { setPlaying(false); setStep(s => Math.min(12, s + 1)); }}>{t('Weiter', 'Next')} ▶</button>
            <button className="min-h-11 rounded-lg border px-4" onClick={() => { setPlaying(false); setStep(12); }}>{t('Ende', 'End')} ⏭</button>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 space-y-3" aria-live="polite">
          <h3 className="font-bold">{step === 0 ? t('Start: je 2 Triebe und 2 Samen', 'Start: 2 shoots and 2 seeds each') : `${monthName(game.cards[step - 1].month)} ${game.cards[step - 1].year}`}</h3>
          <div className="flex h-8 rounded-lg overflow-hidden bg-stone-200" role="img" aria-label={t(`Grün ${total(0)}, Rot ${total(1)}, Platz ${place.capacity}`, `Green ${total(0)}, red ${total(1)}, space ${place.capacity}`)}>
            {([0, 1] as const).flatMap(side => [0, 1, 2].map(i => (
              <div key={`${side}-${i}`} style={{ width: `${(shootsAt(side, i) / place.capacity) * 100}%`, background: TEAM_COLOURS[side][i], transition: 'width 0.6s' }} />
            )))}
          </div>
          <p className="text-sm">{t('Grün', 'Green')} {total(0)} · {t('Rot', 'Red')} {total(1)} · {t('frei', 'empty')} {Math.max(0, place.capacity - total(0) - total(1))} / {place.capacity} · {t('Punkte bisher (Trieb-Monate)', 'Score so far (shoot-months)')}: {runningScore(0)} : {runningScore(1)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {([0, 1] as const).map(side => (
              <ul key={side} className="space-y-1">
                {game.teams[side].map((id, i) => {
                  const p = species.find(s => s.id === id) as SpeciesProfile;
                  const fit = placeFit(p, place);
                  return <li key={id} className="rounded-lg border p-2 text-sm">
                    <span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{ background: TEAM_COLOURS[side][i] }} aria-hidden="true" />
                    <strong>{nameOf(id)}</strong> · {shootsAt(side, i)} {t('Triebe', 'shoots')} · {seedsAt(side, i)} {t('Samen', 'seeds')}
                    <span className="block text-xs text-stone-600">C{p.points.C}/S{p.points.S}/R{p.points.R} · {t('Höhe', 'height')} {p.heightClass}{p.rosette ? ` · ${t('Rosette', 'rosette')}` : ''} · {t('Passung', 'fit')} {fit.known < 3 ? '?' : `${fit.fits}/${fit.known}`}{fit.bonus ? ` (${fit.bonus > 0 ? '+' : ''}${fit.bonus})` : ''} · {t('Tritt', 'trampling')} −{trampleLoss(p, place)}</span>
                  </li>;
                })}
              </ul>
            ))}
          </div>
          {month && <details open className="rounded-lg bg-stone-50 p-3">
            <summary className="min-h-11 cursor-pointer font-bold">{t('Rechenweg dieses Monats', 'This month’s math')}</summary>
            <ol className="mt-2 space-y-1 text-sm font-mono">{month.lines.map((l, i) => <li key={i}>{l}</li>)}</ol>
          </details>}
          {step === 12 && <div role="status" className="rounded-xl bg-amber-100 p-4 font-bold">
            {game.result.winner === 'draw' ? t('Unentschieden', 'Draw') : game.result.winner === 0 ? t('Team Grün gewinnt', 'Team green wins') : t('Team Rot gewinnt', 'Team red wins')} · {game.result.score[0]} : {game.result.score[1]} {t('Trieb-Monate', 'shoot-months')} ({t('Samen am Ende', 'seeds at the end')} {game.result.seeds[0]} : {game.result.seeds[1]})
          </div>}
        </div>
        <p className="text-sm text-stone-500">{t('Quelle', 'Source')}: {game.data.source}{game.data.fetched ? `, ${t('abgerufen', 'fetched')} ${game.data.fetched}` : ''} · {game.data.lat}°, {game.data.lon}°</p>
      </>}
    </section>
  );
}

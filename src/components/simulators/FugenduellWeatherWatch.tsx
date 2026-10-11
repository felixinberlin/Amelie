import React, { useEffect, useMemo, useState } from 'react';
import { Language } from '../../types';
import { CITY_PLACES, CityPlace, placeById } from '../../data/fugenduellPlaces';
import { FEATURED_CITIES, NAMED_PLACES, NamedPlace } from '../../data/fugenduellCities';
import { aggregateMonths, fetchNasaPowerYear, fromFixture, MonthCard, monthCards, WeatherYearData } from '../../engine/fugenduell/weatherYear';
import { placeFit, playableSpecies, runWatch, SpeciesProfile, trampleLoss, WatchResult } from '../../engine/fugenduell/watchMode';
import { detectComboHands, getCrackState, ComboHand, CrackState } from '../../engine/fugenduell/combos';

/** A named place of a featured city, or a generic place type (for custom coordinates). */
const resolvePlace = (id: string): CityPlace | NamedPlace => NAMED_PLACES.find(p => p.id === id) ?? placeById(id);
const isNamed = (p: CityPlace | NamedPlace): p is NamedPlace => 'cityId' in p;
const LAST_YEAR = 2025; // plant year March 2025 – February 2026 is the latest complete one
const YEARS = Array.from({ length: LAST_YEAR - 1981 + 1 }, (_, i) => LAST_YEAR - i);
const TEAM_COLOURS = [['#166534', '#22c55e', '#86efac'], ['#9f1239', '#f43f5e', '#fda4af']];

interface Game { data: WeatherYearData; cards: MonthCard[]; result: WatchResult; teams: [string[], string[]]; placeId: string; crackLevel: 1 | 2 | 3 }

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
  const [placeId, setPlaceId] = useState('berlin-kastanienallee');
  const [crackLevel, setCrackLevel] = useState<1 | 2 | 3>(1);
  const [teamA, setTeamA] = useState(['plantago-major', 'poa-annua', 'sagina-procumbens']);
  const [teamB, setTeamB] = useState(['buddleja-davidii', 'chelidonium-majus', 'portulaca-oleracea']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [step, setStep] = useState(0); // 0 = start, k = after month k
  const [playing, setPlaying] = useState(false);

  const teamAProfiles = useMemo(() => teamA.map(id => species.find(s => s.id === id)).filter((p): p is SpeciesProfile => Boolean(p)), [teamA, species]);
  const teamBProfiles = useMemo(() => teamB.map(id => species.find(s => s.id === id)).filter((p): p is SpeciesProfile => Boolean(p)), [teamB, species]);
  const chosenPlace = resolvePlace(placeId);
  const combosA = useMemo(() => detectComboHands(teamAProfiles, chosenPlace), [teamAProfiles, chosenPlace]);
  const combosB = useMemo(() => detectComboHands(teamBProfiles, chosenPlace), [teamBProfiles, chosenPlace]);

  useEffect(() => {
    if (!playing || !game) return;
    if (step >= 12) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep(s => s + 1), 1300);
    return () => window.clearTimeout(timer);
  }, [playing, step, game]);

  const teamValid = (team: string[]) => new Set(team).size === 3;
  const start = async () => {
    if (!teamValid(teamA) || !teamValid(teamB)) { setError(t('Jedes Team braucht drei verschiedene Arten.', 'Each team needs three different species.')); setStatus('error'); return; }
    const preset = FEATURED_CITIES.find(c => c.id === cityId);
    const city = preset ? { id: preset.id, name: preset.name, lat: preset.lat, lon: preset.lon } : { id: 'custom', name: `${custom.lat}, ${custom.lon}`, lat: Number(custom.lat), lon: Number(custom.lon) };
    setStatus('loading'); setError(''); setPlaying(false);
    try {
      const fixture = preset?.fixtures[year];
      const data = fixture ? fromFixture(fixture) : await fetchNasaPowerYear(city, year);
      const months = aggregateMonths(data);
      if (months.filter(m => m.missing).length > 2) throw new Error('too many missing months');
      const cards = monthCards(months);
      const teams: [string[], string[]] = [teamA, teamB];
      const result = runWatch(teams, cards, data.lat, engineLang, resolvePlace(placeId), crackLevel);
      setGame({ data, cards, result, teams, placeId, crackLevel }); setStep(0); setStatus('idle');
    } catch {
      setStatus('error');
      setError(t('Das Wetterjahr konnte nicht geladen werden (Netz, Koordinaten oder Jahr). Für 2025 funktionieren alle sechs Städte auch offline.', 'Could not load the weather year (network, coordinates or year). For 2025 all six cities also work offline.'));
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

  const place = resolvePlace(game?.placeId ?? placeId);
  const chosen = resolvePlace(placeId);
  const cityPlaces: (CityPlace | NamedPlace)[] = FEATURED_CITIES.find(c => c.id === cityId)?.places ?? CITY_PLACES;
  const label = (p: CityPlace) => de ? p.labelDe : lang === 'es' ? p.labelEs : p.labelEn;
  const month = game && step > 0 ? game.result.months[step - 1] : null;
  const shootsAt = (side: 0 | 1, i: number) => (month ? month.shoots[side][i] : 2);
  const seedsAt = (side: 0 | 1, i: number) => (month ? month.seeds[side][i] : 2);
  const hardAt = (side: 0 | 1, i: number) => (month ? month.hardening[side][i] : 0);
  const statusAt = (side: 0 | 1, i: number) => (month ? month.status[side][i] : 'alive');
  const resistText = (p: SpeciesProfile) => {
    const r = p.resist; const out: string[] = [];
    if (r.heat) out.push(`🔥−${r.heat}`);
    if (r.drought) out.push(`🏜−${r.drought}`);
    if (r.frost) out.push(`❄−${r.frost}`);
    out.push(r.salt === null ? `🧂?` : r.salt ? '🧂✓' : '🧂✗');
    if (r.trample) out.push(`👣✓`);
    if (r.shade) out.push(`🌳✓`);
    if (r.regrowth) out.push(`🌱↺`);
    return out.join(' ');
  };
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
        <p className="mt-2 text-sm text-amber-200">{t('Pflanzenwerte: Pladias, UNDERPLOT, RHS. Wetter: NASA POWER (Raster ca. 50 km, ohne städtische Wärmeinsel). Ortswerte (Tritt, Reinigung, Platz) sind Spielannahmen. HP = höchstens so viele Triebe (Lebensform + Knospenbank); Resistenzen aus je einem Datenfeld. Eine Pflanze welkt ohne Triebe und stirbt aus, wenn auch keine Samen mehr da sind. Regeln: watch-v2, wetter-v1.', 'Plant values: Pladias, UNDERPLOT, RHS. Weather: NASA POWER (grid about 50 km, no urban heat island). Place values (trampling, cleaning, space) are game assumptions. HP = most shoots a plant can hold (life form + bud bank); each resistance from one data field. A plant wilts without shoots and dies out when no seeds are left either. Rules: watch-v2, wetter-v1.')}</p>
      </header>

      <div className="rounded-xl border bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block text-sm">{t('Stadt', 'City')}
            <select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={cityId} onChange={e => { const id = e.target.value; setCityId(id); setPlaceId((FEATURED_CITIES.find(c => c.id === id)?.places ?? CITY_PLACES)[0].id); }}>
              {FEATURED_CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
              {cityPlaces.map(p => <option key={p.id} value={p.id}>{label(p)}</option>)}
            </select>
          </label>
          <label className="block text-sm">{t('Fugen-Bodenstufe (Evolution)', 'Crack Soil (Evolution)')}
            <select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={crackLevel} onChange={e => setCrackLevel(Number(e.target.value) as 1 | 2 | 3)}>
              <option value={1}>{t('Stufe 1: Mineralischer Splitt', 'Level 1: Mineral Sand')}</option>
              <option value={2}>{t('Stufe 2: Moos-Humus (+436% C)', 'Level 2: Moss-Humus (+436% SOC)')}</option>
              <option value={3}>{t('Stufe 3: Aufgesprengter Asphalt', 'Level 3: Fractured Asphalt')}</option>
            </select>
          </label>
        </div>
        {cityId === 'custom' && <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">{t('Breite', 'Latitude')}<input inputMode="decimal" className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={custom.lat} onChange={e => setCustom({ ...custom, lat: e.target.value })} /></label>
          <label className="block text-sm">{t('Länge', 'Longitude')}<input inputMode="decimal" className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={custom.lon} onChange={e => setCustom({ ...custom, lon: e.target.value })} /></label>
        </div>}
        <div className="rounded-lg bg-stone-50 p-3 text-sm space-y-1">
          {isNamed(chosen) && <p className="font-bold">{chosen.nameLocal} · <span className="font-normal">{de ? chosen.ecosystemDe : chosen.ecosystemEn}</span></p>}
          <p>{de ? chosen.descriptionDe : chosen.descriptionEn}</p>
          <p className="text-stone-600">{t('Platz', 'Space')} {chosen.capacity} · {t('Tritt', 'trampling')} {chosen.trample} · {t('Reinigung', 'cleaning')} {chosen.maintenanceMonths.length ? chosen.maintenanceMonths.map(m => monthName(m)).join(', ') : t('nie', 'never')} · {t('Hitze', 'heat')} {chosen.heatShift > 0 ? '+' : ''}{chosen.heatShift} · {t('Dürre', 'drought')} {chosen.droughtShift > 0 ? '+' : ''}{chosen.droughtShift}{chosen.winterSalt ? ` · ${t('Streusalz im Winter', 'road salt in winter')}` : ''}{chosen.saltSpray ? ` · ${t('Salzgischt ganzjährig', 'salt spray all year')}` : ''}{chosen.wallJoint ? ` · ${t('Mauer', 'wall')}` : ''} · L{chosen.profile.L} F{chosen.profile.F} R{chosen.profile.R} N{chosen.profile.N} S{chosen.profile.S}</p>
          {isNamed(chosen) && <p className="text-xs text-stone-500">📍 <a className="underline" href={`https://www.openstreetmap.org/?mlat=${chosen.lat}&mlon=${chosen.lon}#map=17/${chosen.lat}/${chosen.lon}`} target="_blank" rel="noopener noreferrer">{chosen.lat.toFixed(4)}, {chosen.lon.toFixed(4)}</a> · {t('Ortswerte sind Spielannahmen. Noch zu prüfen', 'Place values are game assumptions. Still to verify')}: {chosen.verify.join('; ')}</p>}
        </div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-950 space-y-1">
          <p className="font-bold">🔬 {t('Urbane Bodenentwicklung (UCS / Manu et al. 2025):', 'Urban Crevice Soils (Manu et al. 2025):')}</p>
          <p>
            {crackLevel === 1 && t('Stufe 1 (Pionierfuge): Reiner mineralischer Sand/Splitt. Geringe Wasserspeicherung, Kapazitätsbonus 0.', 'Stage 1 (Pioneer): Pure mineral sand/grit. Low water storage, capacity bonus 0.')}
            {crackLevel === 2 && t('Stufe 2 (Reife Fuge): Moos- und Wurzelzerfall reichern organischen Kohlenstoff um +436% an. Fungiert als Schwamm gegen Sommertrockenheit (Dürreschaden −1, Kapazität +15).', 'Stage 2 (Mature): Moss and root decay enrich organic carbon by +436%. Functions as a sponge against summer drought (drought loss −1, capacity +15).')}
            {crackLevel === 3 && t('Stufe 3 (Spaltbildung): Frost- und Wurzelsprengung öffnen Tiefenräume im Asphalt. Größter Wurzelraum für Gehölzpioniere (Kapazität +30, Dürreschaden −2), lockt aber Straßenreinigung an.', 'Stage 3 (Fracture): Frost and root wedging open deep spaces in asphalt. Maximum root space for woody pioneers (capacity +30, drought loss −2), but attracts street sweepers.')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <fieldset className="space-y-2">
            <legend className="font-bold text-emerald-800">{t('Team Grün', 'Team green')}</legend>
            {select(teamA, setTeamA, 0)}
            {combosA.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-semibold text-emerald-900">{t('Erkannte Combos (Balatro-Synergie):', 'Detected Combos (Balatro Synergy):')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {combosA.map(c => (
                    <span key={c.id} className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-900 shadow-sm" title={`${de ? c.taglineDe : c.taglineEn}: ${de ? c.descriptionDe : c.descriptionEn}\n\nÖkologie: ${de ? c.ecologyDe : c.ecologyEn}`}>
                      💥 {de ? c.nameDe : c.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="font-bold text-rose-800">{t('Team Rot', 'Team red')}</legend>
            {select(teamB, setTeamB, 1)}
            {combosB.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-semibold text-rose-900">{t('Erkannte Combos (Balatro-Synergie):', 'Detected Combos (Balatro Synergy):')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {combosB.map(c => (
                    <span key={c.id} className="inline-flex items-center rounded-full bg-rose-100 border border-rose-300 px-2.5 py-0.5 text-xs font-bold text-rose-900 shadow-sm" title={`${de ? c.taglineDe : c.taglineEn}: ${de ? c.descriptionDe : c.descriptionEn}\n\nÖkologie: ${de ? c.ecologyDe : c.ecologyEn}`}>
                      💥 {de ? c.nameDe : c.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </fieldset>
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-lg">{step === 0 ? t('Start: je 2 Triebe und 2 Samen', 'Start: 2 shoots and 2 seeds each') : `${monthName(game.cards[step - 1].month)} ${game.cards[step - 1].year}`}</h3>
            {game.result.crackState && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-sm">
                🌱 {de ? game.result.crackState.nameDe : game.result.crackState.nameEn} (Kap. +{game.result.crackState.capacityBonus})
              </span>
            )}
          </div>

          {month && (() => {
            const specials = month.lines.filter(l =>
              l.includes('SPEZIAL:') ||
              l.includes('KETTENREAKTION:') ||
              l.includes('COMBO:') ||
              l.includes('Ameisenstraße') ||
              l.includes('Sukzessionskette') ||
              l.includes('Monsun')
            );
            if (!specials.length) return null;
            return (
              <div className="rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 p-3 shadow-md space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs uppercase tracking-wide">
                  <span className="animate-bounce">⚡</span>
                  <span>{t('Fugen-Highlight dieses Monats!', 'Crack Highlight This Month!')}</span>
                </div>
                {specials.map((s, idx) => (
                  <p key={idx} className="text-xs sm:text-sm font-bold text-amber-950">
                    {s}
                  </p>
                ))}
              </div>
            );
          })()}

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
                  const st = statusAt(side, i);
                  const isSpecialActive = month && month.lines.some(l => l.includes(nameOf(id)) && (l.includes('SPEZIAL:') || l.includes('Monsun') || l.includes('Sukzessionskette')));
                  return <li key={id} className={`rounded-lg border p-2 text-sm ${st === 'dead' ? 'bg-stone-100 opacity-70' : isSpecialActive ? 'border-amber-400 bg-amber-50/50 ring-1 ring-amber-300' : ''}`}>
                    <span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{ background: TEAM_COLOURS[side][i] }} aria-hidden="true" />
                    <strong>{nameOf(id)}</strong> {st === 'dead' ? `☠ ${t('ausgestorben', 'died out')}` : st === 'wilted' ? `🥀 ${t('verwelkt, Samen im Boden', 'wilted, seeds in the soil')}` : ''}
                    {isSpecialActive && <span className="ml-1.5 inline-block rounded bg-amber-200 border border-amber-400 px-1.5 py-0.2 text-[10px] font-extrabold text-amber-900 animate-pulse">⚡ SPEZIAL!</span>}
                    <span className="mt-1 flex h-2 rounded bg-stone-200 overflow-hidden" role="img" aria-label={`HP ${shootsAt(side, i)}/${p.maxHp}`}><span style={{ width: `${(shootsAt(side, i) / p.maxHp) * 100}%`, background: TEAM_COLOURS[side][i], transition: 'width 0.6s' }} /></span>
                    <span className="block">HP {shootsAt(side, i)}/{p.maxHp} {t('Triebe', 'shoots')} · 🛡 {hardAt(side, i)} · {seedsAt(side, i)} {t('Samen', 'seeds')}</span>
                    <span className="block text-xs" title={t('Resistenzen: Hitze, Dürre, Frost, Salz, Tritt, Schatten, Wiederaustrieb', 'Resistances: heat, drought, frost, salt, trampling, shade, regrowth')}>{resistText(p)}</span>
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

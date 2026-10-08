import { useState } from 'react';
import { Language } from '../types';
import experiment from '../data/birdForecastExperiment.json';
import { BIRD_FORECAST_SOURCES } from '../data/birdForecastSources';

export function BirdForecastLab({ lang }: { lang: Language }) {
  const de = lang === 'de';
  const [selected, setSelected] = useState<string>('radar');
  const source = BIRD_FORECAST_SOURCES.find(s => s.id === selected)!;
  const years = ['2021', '2022', '2023'] as const;
  const blocked = experiment.status === 'blocked-data-quality';
  const metrics = experiment.metrics as Record<string, { maeLog: number; relativeMaeImprovement: number | null }>;
  return <section aria-labelledby="bird-forecast-title" className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 sm:p-7 space-y-5">
    <div>
      <p className="text-xs uppercase tracking-widest text-sky-800">EuroBirdCast · {de ? 'Bird Weather · Forschungsstand' : 'Bird Weather · research status'}</p>
      <h2 id="bird-forecast-title" className="text-2xl font-serif-title mt-2">{de ? 'Das Zuggeschehen heute mit dem Wissen von gestern verbinden' : 'Connect today’s migration with the knowledge of the past'}</h2>
      <p className="text-stone-700 mt-3">{de ? 'Ziel: Intensität, Flughöhe und Richtung des Nachtzugs für Deutschland und Europa vorhersagen — aus jüngstem Radar, Wettervorhersagen und langfristigem Artenwissen. Jede zusätzliche Quelle muss ihren Nutzen an bislang ungesehenen Nächten zeigen.' : 'Goal: predict nocturnal migration intensity, altitude and direction across Germany and Europe using recent radar, weather forecasts and long-term species knowledge. Every added source must demonstrate its value on unseen nights.'}</p>
    </div>
    <div className="grid sm:grid-cols-3 gap-3 text-sm">
      {[de ? '1 · Historische Muster lernen' : '1 · Learn historical patterns', de ? '2 · Mit jüngsten Daten aktualisieren' : '2 · Update with recent observations', de ? '3 · Prognosen unabhängig prüfen' : '3 · Test forecasts independently'].map(t => <div key={t} className="rounded-lg bg-white border border-sky-100 p-3 font-medium">{t}</div>)}
    </div>
    <div>
      <label htmlFor="bird-source" className="block text-sm font-semibold mb-2">{de ? 'Welche Wissensquelle trägt was bei?' : 'What does each source contribute?'}</label>
      <select id="bird-source" value={selected} onChange={e => setSelected(e.target.value)} className="w-full sm:w-auto rounded-lg border border-stone-300 bg-white p-2">
        {BIRD_FORECAST_SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <div className="rounded-xl bg-white border border-stone-200 p-4 mt-3 space-y-2" aria-live="polite">
        <p className="font-semibold">{de ? source.periodDe : source.periodEn}</p>
        <p className="text-sm">{de ? source.roleDe : source.roleEn}</p>
        <p className="text-xs font-medium text-sky-900">{de ? source.statusDe : source.statusEn}</p>
        <p className="text-sm text-stone-600">{de ? source.constraintDe : source.constraintEn}</p>
        <a href={source.url} target="_blank" rel="noreferrer" className="inline-block text-sm underline text-sky-800">{de ? 'Originalquelle' : 'Original source'} ↗</a>
      </div>
    </div>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
      <h3 className="font-semibold">{blocked ? (de ? 'Erster echter Datentest: Qualitätsprüfung nicht bestanden' : 'First real-data pilot: quality check not passed') : (de ? 'Historischer Modellvergleich — keine operative Prognose' : 'Historical model comparison — no operational forecast')}</h3>
      <p className="text-sm">{de ? 'Protzel / Berlin, Oktober 2021–2023, Höhenband 1.000–2.000 m über Meer. Radar und ERA5-Wetter wurden geladen. Vollständige Höhenschichten und mindestens 75 % der 15-Minuten-Zeitfenster sind Pflicht. Der Bericht zeigt, welche Nächte das feste Datengate passieren.' : 'Protzel / Berlin, October 2021–2023, altitude band 1,000–2,000 m above sea level. Radar and ERA5 weather were downloaded. Complete altitude layers and at least 75% of 15-minute time slots are required. The report shows which nights pass the fixed data gate.'}</p>
      <div className="overflow-x-auto"><table className="w-full text-sm text-left">
        <caption className="sr-only">{de ? 'Datenabdeckung im historischen Pilot' : 'Historical pilot data coverage'}</caption>
        <thead><tr><th scope="col" className="py-2">{de ? 'Jahr' : 'Year'}</th><th scope="col">{de ? 'Nächte nach Qualitätsfilter / 30' : 'Nights after quality filter / 30'}</th><th scope="col">{de ? 'Davon mit verfügbarem Radar-Lag' : 'With an eligible recent radar lag'}</th></tr></thead>
        <tbody>{years.map(year => <tr key={year} className="border-t border-amber-200"><th scope="row" className="py-2">{year}</th><td>{experiment.split.beforeLagCounts[year]} / 30</td><td>{experiment.split.counts[year]}</td></tr>)}</tbody>
      </table></div>
      <p className="text-sm font-medium">{blocked ? (de ? 'Keine Prognose ausgegeben. Keine Genauigkeitsverbesserung belegt. Das Ergebnis betrifft diesen Ausschnitt und Filter, nicht die gesamte Radarquelle.' : 'No forecast issued. No accuracy improvement demonstrated. This result concerns the selected subset and filter, not the entire radar archive.') : (de ? 'Rückblickender Vergleich mit ERA5; keine belegte operative Prognosegüte.' : 'Retrospective comparison with ERA5; no demonstrated operational forecast skill.')}</p>
    </div>
    {!blocked && <div className="overflow-x-auto"><table className="w-full text-sm text-left">
      <caption>{de ? 'Historischer Vergleich, Log-MAE: kleiner ist besser' : 'Historical comparison, log-MAE: lower is better'}</caption>
      <thead><tr><th scope="col">Model</th><th scope="col">Log-MAE</th><th scope="col">{de ? 'Relativ zur Historie' : 'Relative to history'}</th></tr></thead>
      <tbody>{Object.entries(metrics).map(([name, m]) => <tr key={name}><th scope="row">{name}</th><td>{m.maeLog.toFixed(3)}</td><td>{m.relativeMaeImprovement === null ? '—' : `${(100 * m.relativeMaeImprovement).toFixed(1)}%`}</td></tr>)}</tbody>
    </table></div>}
    <div className="text-sm space-y-2 text-stone-700">
      <p>{de ? 'Nächster Vergleich: saisonale Historie → plus Wetter → plus jüngstes Radar → danach artspezifisches Vorwissen. Zielnacht und Radarstandorte bleiben beim Training verborgen; Fehler, Ausfälle und Unsicherheit werden gemeinsam berichtet.' : 'Next comparison: seasonal history → add weather → add recent radar → then species-specific knowledge. Target nights and validation radar sites stay unseen during training; errors, outages and uncertainty are reported together.'}</p>
      <p>{de ? 'Aktuelle Messungen, Vorhersagen und historische Forschung behalten eigene Zeitstempel. Aloft-CSV ist typischerweise bis 48 Stunden verzögert. ERA5 ist rückblickende Wetterrekonstruktion, keine damals verfügbare Vorhersage. Es gibt hier noch keinen Live-Datenanschluss.' : 'Observations, forecasts and historical research retain separate timestamps. Aloft CSV is typically delayed by up to 48 hours. ERA5 reconstructs past weather; it is not an issue-time forecast. This project has no live data connection yet.'}</p>
      <p><a href="https://www.flysafe-birdtam.eu/" target="_blank" rel="noreferrer" className="underline text-sky-800">FlySafe ↗</a> — {de ? 'bestehender öffentlicher Dienst mit aktuellen Radaransichten und Prognosen für Deutschland, Belgien und die Niederlande; Vergleichspartner, kein EuroBirdCast-Datenfeed.' : 'existing public radar views and forecasts for Germany, Belgium and the Netherlands; a comparator, not a EuroBirdCast data feed.'}</p>
    </div>
  </section>;
}

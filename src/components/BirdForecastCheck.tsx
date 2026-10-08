import check from '../data/birdForecastCheck.json';
import { BIRD_RADAR_NAMES } from '../data/birdRadarNames';
import { Language } from '../types';

interface Forecast { station: string; targetUtc: string; horizonH: number; model: number; persistence: number | null }
interface Issued { file: string; sha256: string; issuedAtUtc: string; forecasts: Forecast[]; scored: { pending: number; results: { station: string; targetUtc: string; observed: number | null }[] } | null }

const pct = (value: number | null) => value === null ? '—' : `${value >= 0 ? '+' : '−'}${Math.abs(value * 100).toFixed(0)} %`;
const tone = (value: number | null) => value === null ? 'text-slate-500' : value > 0.02 ? 'text-emerald-700' : value < -0.02 ? 'text-rose-700' : 'text-slate-700';
const when = (iso: string) => iso.slice(5, 16).replace('T', ' ') + ' UTC';

/** Forecast learned from the 2017 radar week, with every test result shown, including the failures. */
export function BirdForecastCheck({ lang }: { lang: Language }) {
  const de = lang === 'de';
  const lodo = check.leaveOneDay2017;
  const independent = (h: number, w: number) => check.independent2026.find(r => r.horizonH === h && r.recentWeight === w)?.skill ?? null;
  const issued = (check.prospective as Issued[]).at(-1);
  const pending = issued?.scored?.pending ?? issued?.forecasts.length ?? 0;
  return <div data-testid="bird-forecast-check" className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 space-y-3">
    <div>
      <p className="text-xs uppercase tracking-wider text-sky-800">{de ? 'Vorhersage · aus historischen Daten gelernt' : 'Forecast · learned from historical data'}</p>
      <h3 className="font-semibold text-slate-900 mt-1">{de ? 'Kann ein aus 2017 gelerntes Modell die nächsten Stunden vorhersagen?' : 'Can a model learned from 2017 predict the next hours?'}</h3>
      <p className="text-sm text-slate-700 mt-1">{de
        ? 'Ein Ridge-Modell lernt aus den Stundenänderungen der 21 Radare der Woche 2017: Trend, Dichte am Standort „windaufwärts“ und Tageszeit. Es nutzt kein Wetter. Verglichen wird mit der einfachsten Prognose: „die nächsten Stunden gleichen dieser Stunde“.'
        : 'A ridge model learns from the hourly changes at the 21 radars of the 2017 week: trend, density at the upwind neighbour station and time of day. It uses no weather. It is compared with the simplest forecast: “the coming hours equal this hour”.'}</p>
    </div>
    <div className="overflow-x-auto"><table className="w-full text-sm text-left">
      <caption className="sr-only">{de ? 'Prognosegüte gegenüber Persistenz' : 'Forecast skill against persistence'}</caption>
      <thead><tr className="text-xs text-slate-600"><th scope="col" className="py-1">{de ? 'Vorlauf' : 'Lead time'}</th><th scope="col">{de ? '2017, ein Tag ausgelassen' : '2017, one day held out'}</th><th scope="col">{de ? 'Okt 2026, nur 2017 gelernt' : 'Oct 2026, 2017 only'}</th><th scope="col">{de ? 'Okt 2026, mit neuen Daten nachgelernt' : 'Oct 2026, updated with new data'}</th></tr></thead>
      <tbody>{lodo.map(row => <tr key={row.horizonH} className="border-t border-sky-100">
        <th scope="row" className="py-1.5 font-normal">+{row.horizonH} h</th>
        <td className={`font-mono ${tone(row.skill)}`}>{pct(row.skill)}</td>
        <td className={`font-mono ${tone(independent(row.horizonH, 0))}`}>{pct(independent(row.horizonH, 0))}</td>
        <td className={`font-mono ${tone(independent(row.horizonH, 20))}`}>{pct(independent(row.horizonH, 20))}</td>
      </tr>)}</tbody></table></div>
    <p className="text-xs text-slate-600">{de ? 'Wert = Fehlerreduktion gegenüber Persistenz (log-Dichte). Positiv ist besser als „gleichbleibend“, negativ schlechter.' : 'Value = error reduction against persistence (log density). Positive beats “unchanged”, negative is worse.'}</p>
    <p className="text-sm text-slate-800"><strong>{de ? 'Ergebnis:' : 'Result:'}</strong> {de
      ? 'In der aktiven Zugwoche 2017 sagt das gelernte Muster die nächsten Stunden etwas besser voraus als Gleichbleiben. Auf der ruhigen Oktoberwoche 2026 ist ein nur aus 2017 gelerntes Modell deutlich schlechter als Gleichbleiben; mit den neuen Messungen nachgelernt liegt es etwa gleichauf (−3 % bis +7 %, drei Radare, wenige Dutzend Stunden: das ist Rauschen, kein Nachweis). Wir zeigen es deshalb als Test, nicht als Vorhersage, auf die man sich verlassen kann.'
      : 'In the active 2017 migration week the learned pattern predicts the next hours somewhat better than “unchanged”. On the quiet October 2026 week a model learned from 2017 alone is clearly worse than “unchanged”; updated with the new measurements it is roughly level (−3 % to +7 %, three radars, a few dozen hours: noise, not evidence). We therefore present it as a test, not as a forecast to rely on.'}</p>
    {issued && <div className="rounded-lg bg-white border border-sky-100 p-3 text-sm space-y-2">
      <p className="font-semibold text-slate-900">{de ? 'Vorab festgehaltene Prognose für den 7. Oktober 2026' : 'Forecast archived in advance for 7 October 2026'}</p>
      <p className="text-xs text-slate-600">{de ? `Ausgestellt ${when(issued.issuedAtUtc)}, Prüfsumme ${issued.sha256.slice(0, 12)}…. Die Radardateien des 7. Oktober waren noch nicht veröffentlicht; ${pending} von ${issued.forecasts.length} Prognosen warten auf Bewertung. Zahlen in Vögel/km², Schicht 1–2 km.` : `Issued ${when(issued.issuedAtUtc)}, checksum ${issued.sha256.slice(0, 12)}…. The 7 October radar files were not yet published; ${pending} of ${issued.forecasts.length} forecasts await scoring. Values in birds/km², 1–2 km layer.`}</p>
      <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead><tr className="text-slate-600"><th scope="col">Radar</th><th scope="col">{de ? 'Zielstunde' : 'Target hour'}</th><th scope="col">{de ? 'Modell' : 'Model'}</th><th scope="col">{de ? 'Gleichbleiben' : 'Unchanged'}</th><th scope="col">{de ? 'Gemessen' : 'Observed'}</th></tr></thead>
        <tbody>{issued.forecasts.map(f => {
          const scored = issued.scored?.results.find(r => r.station === f.station && r.targetUtc === f.targetUtc);
          const stationName = BIRD_RADAR_NAMES[f.station] ?? f.station.toUpperCase();
          return <tr key={f.station + f.targetUtc} className="border-t border-slate-100 font-mono"><td>{stationName} <span className="text-slate-400 font-normal">({f.station.toUpperCase()})</span></td><td>{when(f.targetUtc)}</td><td>{f.model.toFixed(2)}</td><td>{f.persistence?.toFixed(2)}</td><td>{scored?.observed != null ? scored.observed.toFixed(2) : (de ? 'steht aus' : 'pending')}</td></tr>;
        })}</tbody></table></div>
      <p className="text-xs text-slate-600">{de ? 'Bewertung später mit' : 'Score later with'} <code>python3 07-demos/eurobirdcast/map/forecast_check.py score</code>.</p>
    </div>}
    <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">{check.caveats.map(c => <li key={c}>{c}</li>)}</ul>
  </div>;
}

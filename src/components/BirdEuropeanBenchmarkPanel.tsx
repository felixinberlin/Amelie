import report from '../data/birdEuropeanBenchmark.json';
import { Language } from '../types';

/** Published preprocessed observations, kept distinct from operational forecasts. */
export function BirdEuropeanBenchmarkPanel({ lang }: { lang: Language }) {
  const de = lang === 'de';
  const data = report as unknown as {
    status: string; source: { doi: string; license: string };
    coverage: { stations: unknown; years: unknown; rows: number };
    protocol: { trainYears: unknown; validationYear: unknown; testYear: unknown; target: string };
    metrics: { model: string; n: number; mae: number; rmse: number; logMae: number }[];
    limitations: string[];
  };
  const labels: Record<string, string> = { station_climatology: de ? 'Stationshistorie (Log-Mittel)' : 'Station log-climatology', seasonal: de ? 'Saisonale Historie' : 'Seasonal history', weather: de ? 'Historie + Wetter' : 'History + weather', weather_recent_radar: de ? 'Historie + Wetter + Radar' : 'History + weather + radar' };
  return <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
    <h3 className="font-semibold">{de ? 'Bestehende europäische Forschung ausführbar machen' : 'Make existing European research runnable'}</h3>
    <p className="text-sm">{de ? 'Vergleich auf publizierten Radar-/ERA5-Daten von FluxRGNN. Ein eigener einfacher Modellvergleich; keine Reproduktion der publizierten neuronalen Ergebnisse und keine Live-Prognose.' : 'Comparison using published FluxRGNN radar/ERA5 data. Our own simple baseline experiment; no reproduction of the published neural results and no live forecast.'}</p>
    <p className="text-xs"><a className="underline" href={`https://doi.org/${data.source.doi}`}>{data.source.doi}</a> · Lippert, Kranstauber, Forré & van Loon (2022) · {data.source.license}</p>
    <p className="text-sm">{data.protocol.target}</p>
    <p className="text-sm">{de ? 'Radarstandorte' : 'Radar sites'}: {Array.isArray(data.coverage.stations) ? data.coverage.stations.length : String(data.coverage.stations)} · {de ? 'Datenzeilen' : 'Data rows'}: {data.coverage.rows.toLocaleString()} · {de ? 'Testjahr' : 'Test year'}: {String(data.protocol.testYear)}</p>
    {data.status === 'completed' && <div className="overflow-x-auto"><table className="w-full text-sm text-left">
      <caption>{de ? 'Historischer Test · kleinere Fehler sind besser' : 'Historical test · lower errors are better'}</caption>
      <thead><tr><th scope="col">Model</th><th scope="col">n</th><th scope="col">MAE</th><th scope="col">RMSE</th><th scope="col">Log-MAE</th></tr></thead>
      <tbody>{data.metrics.map(m => <tr className="border-t border-emerald-200" key={m.model}><th scope="row" className="py-2">{labels[m.model] ?? m.model}</th><td>{m.n}</td><td>{m.mae.toFixed(2)}</td><td>{m.rmse.toFixed(2)}</td><td>{m.logMae.toFixed(3)}</td></tr>)}</tbody>
    </table></div>}
    <p className="text-sm">{de ? 'ERA5 ist rückblickendes Wetter. Ein Fehlerunterschied belegt noch keine operative Prognosegüte. Zusätzliche Artenquellen und unabhängige Standorte sind gesondert zu testen.' : 'ERA5 is retrospective weather. A difference in error does not establish operational forecasting skill. Additional species sources and independent sites require separate tests.'}</p>
    <details className="text-xs"><summary>{de ? 'Methodische Grenzen' : 'Method limitations'}</summary><ul className="list-disc pl-5 mt-2">{data.limitations.map(t => <li key={t}>{t}</li>)}</ul></details>
  </div>;
}

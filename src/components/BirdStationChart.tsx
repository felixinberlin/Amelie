import { useState } from 'react';
import { BIRD_DATASETS, BirdDatasetId } from '../data/birdDatasets';
import { BIRD_RADAR_NAMES } from '../data/birdRadarNames';
import { Language } from '../types';

export function BirdStationChart({ dataset, code, frame, lang, onStation, onTime }: { dataset: BirdDatasetId; code: string; frame: number; lang: Language; onStation: (code: string) => void; onTime: (frame: number) => void }) {
  const de = lang === 'de';
  const meta = BIRD_DATASETS[dataset];
  const observations = meta.data;
  const recent = dataset === 'recent';
  const [fixedScale, setFixedScale] = useState(false);
  const station = observations.stations.find(s => s.code === code)!;
  const readings = station.readings;
  const observed = readings.filter(r => r.status === 'observed' && r.density !== null).length;
  const unscreened = readings.filter(r => r.status === 'unscreened').length;
  const daytime = readings.filter(r => r.status === 'daytime').length;
  const missing = readings.length - observed - unscreened - daytime;
  const maximum = Math.max(1, ...(fixedScale ? observations.stations.flatMap(s => s.readings) : readings).map(r => r.density ?? 0));
  // Screened and unscreened hours are separate traces; neither is joined across absent hours.
  const traceOf = (status: string) => {
    const out: { index: number; density: number }[][] = [];
    readings.forEach((r, index) => {
      if (r.density === null || r.status !== status) return;
      const previous = out.at(-1);
      if (previous?.at(-1)?.index === index - 1) previous.push({ index, density: r.density });
      else out.push([{ index, density: r.density }]);
    });
    return out;
  };
  const segments = traceOf('observed');
  const rawSegments = traceOf('unscreened');
  const x = (index: number) => 40 + index / (readings.length - 1) * 945;
  const y = (density: number) => 140 - density / maximum * 125;
  const peak = readings.reduce((best, r, i) => (r.density ?? -1) > (readings[best].density ?? -1) ? i : best, 0);
  const peakReading = readings[peak];
  const current = readings[frame];
  const pickTime = (event: React.MouseEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - box.left) / box.width;
    const normX = Math.max(0, Math.min(1, (relX * 1000 - 40) / 945));
    const index = Math.round(normX * (readings.length - 1));
    if (index >= 0 && index < readings.length) {
      onTime(index);
    }
  };
  const download = () => {
    const csv = [
      recent ? '# Source: Aloft BALTRAD daily VPTS files, https://aloftdata.eu/ ; CC0-1.0' : '# Source: Lippert, Kranstauber, Forré & van Loon (2022); https://doi.org/10.5281/zenodo.6874789; CC BY 4.0',
      recent ? '# Recent real radar files (Aloft/BALTRAD, CC0), density in the 1000-2000 m layer. status=unscreened means sd_vvp was missing. Empty numeric cells mean unavailable, not zero. u/v in m/s.' : '# Historical subset; empty numeric cells mean unavailable, not zero. u/v are ground movement in m/s.',
      'station,time_utc,status,density_birds_km2,bird_u_ms,bird_v_ms',
      ...readings.map((r, i) => [code, observations.times[i], r.status, r.density ?? '', r.u ?? '', r.v ?? ''].join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `eurobirdcast-${code}-${meta.first}_${meta.last.slice(8, 10)}.csv`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
    <div className="flex flex-wrap justify-between gap-3 items-end">
      <div><p className="text-xs uppercase tracking-wider text-slate-500">{de ? 'Aufgezeichnete Stunden · Lücken bleiben leer' : 'Recorded hours · gaps remain empty'}</p><h3 className="font-semibold text-slate-900 mt-1">{BIRD_RADAR_NAMES[code] ?? code.toUpperCase()} <span className="text-xs font-mono text-slate-500">({code.toUpperCase()})</span></h3></div>
      <label className="text-xs text-slate-600">{de ? 'Radarstandort' : 'Radar station'}<select aria-label={de ? 'Radarstandort' : 'Radar station'} value={code} onChange={e => onStation(e.target.value)} className="block mt-1 border border-slate-300 rounded-lg bg-white p-2 text-slate-900 max-w-full">{observations.stations.map(s => <option key={s.code} value={s.code}>{BIRD_RADAR_NAMES[s.code] ?? s.code} ({s.code.toUpperCase()})</option>)}</select></label>
    </div>
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
      <span><strong className="text-slate-900">{observed}</strong> {recent ? (de ? 'Stunden geprüft' : 'hours screened') : (de ? 'Stunden beobachtet' : 'hours observed')}</span>
      <span>{daytime} {de ? 'Tagesstunden ausgeblendet' : 'daytime hours excluded'}</span>
      {unscreened > 0 && <span className="text-amber-800">{unscreened} {de ? 'Stunden ungeprüft (sd_vvp fehlt)' : 'hours unscreened (sd_vvp missing)'}</span>}
      <span>{missing} {de ? 'Stunden ohne Dichtemessung' : 'hours without density readings'}</span>
      {peakReading && peakReading.density !== null && (
        <span className="text-slate-700">
          · {de ? 'Spitzenwert:' : 'Peak:'} <strong className="text-slate-900">{peakReading.density.toFixed(1)} {recent ? (de ? 'Vögel/km² (1–2 km)' : 'birds/km² (1–2 km)') : (de ? 'Vögel/km²' : 'birds/km²')}</strong> ({observations.times[peak].slice(8, 10)}. {de ? 'Okt' : 'Oct'} {observations.times[peak].slice(11, 16)} UTC)
        </span>
      )}
    </div>
    <div className="flex flex-wrap justify-between gap-3 text-xs text-slate-600"><label className="flex items-center gap-2"><input type="checkbox" checked={fixedScale} onChange={e => setFixedScale(e.target.checked)} />{de ? 'Gemeinsame Skala für alle Standorte' : 'Use the same scale for all stations'}</label><button type="button" onClick={download} className="underline underline-offset-2 text-teal-800">{de ? 'Standortdaten herunterladen (CSV)' : 'Download station data (CSV)'}</button></div>
    <p className="text-sm text-slate-700" data-testid="bird-station-reading"><time dateTime={observations.times[frame]}>{observations.times[frame].replace('T', ' ').replace('Z', ' UTC')}</time> · <strong>{current.density !== null ? `${current.density.toFixed(2)} ${de ? 'Vögel/km²' : 'birds/km²'}${current.status === 'unscreened' ? (de ? ' (ungeprüft)' : ' (unscreened)') : ''}` : current.status === 'daytime' ? (de ? 'Tagsüber nicht ausgewertet' : 'Daytime not evaluated') : (de ? 'Messwert fehlt' : 'Missing observation')}</strong></p>
    <svg viewBox="0 0 1000 170" role="img" aria-label="Observed density over the week" onClick={pickTime} className="w-full h-36 sm:h-44 cursor-pointer">
      <title>{code.toUpperCase()} · {de ? 'Beobachtete Dichte im Wochenverlauf, Vögel/km² (anklicken zum Springen)' : 'Observed density over the week, birds/km² (click to jump to hour)'}</title>
      <desc>{de ? 'Lücken bleiben leer; grau hinterlegte Stunden sind tagsüber ausgeschlossen. Klicke auf eine Position im Diagramm, um diese Stunde auf der Karte anzuzeigen.' : 'Gaps remain empty; grey shading marks excluded daytime hours. Click anywhere on the chart to show that hour on the map.'}</desc>
      {readings.map((r, i) => r.status === 'daytime' ? <rect key={i} x={x(i) - 2.8} y="10" width="5.7" height="130" fill="#e2e8f0" opacity=".7" /> : null)}
      {[0, maximum / 2, maximum].map(v => <g key={v}><line x1="40" x2="985" y1={y(v)} y2={y(v)} stroke="#cbd5e1" strokeDasharray="3 4" /><text x="34" y={y(v) + 4} textAnchor="end" fontSize="11" fill="#64748b">{v.toFixed(0)}</text></g>)}
      {segments.map((segment, i) => <g key={i}><path data-testid="density-segment" d={segment.map((p, j) => `${j ? 'L' : 'M'}${x(p.index)},${y(p.density)}`).join(' ')} fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinejoin="round" />{segment.length === 1 && <circle cx={x(segment[0].index)} cy={y(segment[0].density)} r="2.5" fill="#0f766e" />}</g>)}
      {rawSegments.map((segment, i) => <path key={`u${i}`} data-testid="unscreened-segment" d={segment.map((p, j) => `${j ? 'L' : 'M'}${x(p.index)},${y(p.density)}`).join(' ')} fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="4 3" strokeLinejoin="round" />)}
      <line x1={x(frame)} x2={x(frame)} y1="8" y2="143" stroke="#0f172a" strokeWidth="1.5" />
      {current.density !== null && <circle cx={x(frame)} cy={y(current.density)} r="4" fill="#0f172a" stroke="white" strokeWidth="1.5" />}
      {readings.map((_, i) => i).filter(i => i % 24 === 0).map(i => <text key={i} x={x(i)} y="161" fontSize="11" textAnchor="middle" fill="#64748b">{Number(observations.times[i].slice(8, 10))} Oct</text>)}
    </svg>
    <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-slate-600"><span>{recent ? (de ? 'Dichte der Schicht 1–2 km · Vögel/km² · UTC' : '1–2 km layer density · birds/km² · UTC') : (de ? 'Höhenintegrierte Dichte · Vögel/km² · UTC' : 'Vertically integrated density · birds/km² · UTC')} · {fixedScale ? (de ? 'Gemeinsame Skala' : 'Shared scale') : (de ? 'Skala je Standort' : 'Scale varies by station')}</span><button type="button" onClick={() => onTime(peak)} className="underline underline-offset-2 text-teal-800 font-medium hover:text-teal-950">{de ? 'Größten aufgezeichneten Wert zeigen' : 'Show largest recorded value'} ↗</button></div>
  </div>;
}

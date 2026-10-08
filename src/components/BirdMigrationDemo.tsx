import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import observations from '../data/birdMovementMap.json';
import { Language } from '../types';

const intensityColor = (density: number) => density < 1 ? '#fef08a' : density < 5 ? '#fbbf24' : density < 20 ? '#f97316' : density < 50 ? '#e11d48' : '#9333ea';
const prettyTime = (time: string, de: boolean) => new Intl.DateTimeFormat(de ? 'de-DE' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(time)) + ' UTC';
const dayOf = (time: string) => time.slice(0, 10);

export function BirdMigrationDemo({ lang = 'en' }: { lang?: Language }) {
  const de = lang === 'de';
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<ReturnType<typeof L.map> | null>(null);
  const marks = useRef<ReturnType<typeof L.layerGroup> | null>(null);
  const [frame, setFrame] = useState(Math.min(20, observations.times.length - 1));
  const [playing, setPlaying] = useState(false);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);
  const time = observations.times[frame];
  const dates = [...new Set(observations.times.map(dayOf))];
  const observed = observations.stations.filter(s => s.readings[frame].density !== null).length;
  const selectFrame = (value: number) => { setPlaying(false); setFrame(value); };

  useEffect(() => {
    if (!host.current) return;
    const m = L.map(host.current, { scrollWheelZoom: false, minZoom: 4, maxZoom: 10 });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 10 }).addTo(m);
    tiles.on('tileerror', () => setTilesUnavailable(true));
    m.fitBounds(L.latLngBounds(observations.stations.map(s => [s.lat, s.lon] as [number, number])), { padding: [45, 45] });
    map.current = m;
    marks.current = L.layerGroup().addTo(m);
    const observer = new ResizeObserver(() => m.invalidateSize()); observer.observe(host.current);
    return () => { observer.disconnect(); m.remove(); map.current = null; marks.current = null; };
  }, []);

  useEffect(() => {
    const layers = marks.current; if (!layers) return;
    layers.clearLayers();
    for (const station of observations.stations) {
      const reading = station.readings[frame];
      const available = reading.density !== null;
      const density = reading.density ?? 0;
      const missing = reading.status === 'daytime' ? (de ? 'Tagsüber nicht ausgewertet' : 'Daytime not evaluated') : (de ? 'Messwert fehlt' : 'Missing observation');
      const circle = L.circleMarker([station.lat, station.lon], {
        radius: available ? 6 + Math.min(19, Math.sqrt(density) * 2) : 5,
        color: available ? '#431407' : '#64748b', fillColor: available ? intensityColor(density) : '#cbd5e1',
        fillOpacity: available ? .8 : .35, weight: available ? 1.5 : 1, dashArray: available ? undefined : '3 3',
      }).addTo(layers);
      // Create text nodes so even a future station label cannot inject popup HTML.
      const content = document.createElement('div');
      const heading = document.createElement('strong'); heading.textContent = station.code.toUpperCase(); content.append(heading);
      const value = document.createElement('p'); value.textContent = available ? `${density.toFixed(1)} ${de ? 'geschätzte Vögel/km²' : 'estimated birds/km²'}` : missing; content.append(value);
      const stamp = document.createElement('p'); stamp.textContent = prettyTime(time, de); content.append(stamp);
      circle.bindPopup(content);
      circle.bindTooltip(`${station.code.toUpperCase()} · ${available ? density.toFixed(1) + ' birds/km²' : missing}`);
      if (available && density > 0 && reading.u !== null && reading.v !== null) {
        const speed = Math.hypot(reading.u, reading.v);
        if (speed > .01) {
          // 65km display length only: observed mean bearing, never a projected route.
          const north = reading.v / speed, east = reading.u / speed;
          const kmToLat = 1 / 111.2, kmToLon = kmToLat / Math.cos(station.lat * Math.PI / 180);
          const tip: [number, number] = [station.lat + north * 65 * kmToLat, station.lon + east * 65 * kmToLon];
          const left: [number, number] = [tip[0] + (-north * 13 + east * 7) * kmToLat, tip[1] + (-east * 13 - north * 7) * kmToLon];
          const right: [number, number] = [tip[0] + (-north * 13 - east * 7) * kmToLat, tip[1] + (-east * 13 + north * 7) * kmToLon];
          L.polyline([[station.lat, station.lon], tip], { color: '#0f172a', weight: 2.5, opacity: .85, interactive: false }).addTo(layers);
          L.polyline([left, tip, right], { color: '#0f172a', weight: 2.5, opacity: .85, interactive: false }).addTo(layers);
          const direction = document.createElement('p');
          direction.textContent = `${de ? 'Mittlere Bewegungsrichtung' : 'Mean movement bearing'}: ${((Math.atan2(east, north) * 180 / Math.PI + 360) % 360).toFixed(0)}°`;
          content.append(direction);
        }
      }
    }
  }, [frame, de, time]);

  useEffect(() => {
    if (!playing) return;
    if (frame >= observations.times.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setFrame(f => f + 1), 650);
    return () => window.clearTimeout(timer);
  }, [playing, frame]);

  return <section id="bird-migration-demo" aria-labelledby="bird-map-title" className="scroll-mt-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="bg-slate-950 text-white p-5 sm:p-7 space-y-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-200"><span className="h-2 w-2 rounded-full bg-amber-300" />EuroBirdCast · {de ? 'Radar-Archiv · Beobachtungen' : 'Radar archive · observations'}</div>
      <h2 id="bird-map-title" className="text-2xl sm:text-3xl font-serif-title">{de ? 'Vogelbewegung über Deutschland und Nachbarländern' : 'Bird movement over Germany and neighbouring countries'}</h2>
      <p className="text-sm text-slate-300">{de ? 'Eine Woche Vogelzug abspielen: 1.–7. Oktober 2017. Echte Radarschätzungen aus Deutschland, Belgien und den Niederlanden.' : 'Replay a week of migration: 1–7 October 2017. Real radar estimates from Germany, Belgium and the Netherlands.'}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm"><span>{observations.stations.length} {de ? 'Radarstandorte' : 'radar sites'}</span><span>{de ? 'Stündliche Messungen' : 'Hourly observations'}</span><span>{de ? 'Historische Wiedergabe' : 'Historical replay'}</span></div>
    </div>
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <button type="button" onClick={() => { if (!playing && frame === observations.times.length - 1) setFrame(0); setPlaying(p => !p); }} aria-label={playing ? 'Pause' : (de ? 'Bewegung abspielen' : 'Play movement')} aria-pressed={playing} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">{playing ? 'Ⅱ Pause' : `▶ ${de ? 'Bewegung abspielen' : 'Play movement'}`}</button>
        <label className="text-xs font-semibold text-slate-600">{de ? 'Datum (UTC)' : 'Date (UTC)'}<select aria-label={de ? 'Datum (UTC)' : 'Date (UTC)'} value={dayOf(time)} onChange={e => {
          const hour = time.slice(11, 13);
          const index = observations.times.findIndex(t => dayOf(t) === e.target.value && t.slice(11, 13) === hour);
          selectFrame(index >= 0 ? index : observations.times.findIndex(t => dayOf(t) === e.target.value));
        }} className="block mt-1 border border-slate-300 rounded-lg p-2 bg-white text-slate-900">{dates.map(date => <option key={date} value={date}>{date}</option>)}</select></label>
        <output data-testid="bird-map-time" className="ml-auto text-sm font-mono text-slate-900">{prettyTime(time, de)}</output>
      </div>
      <label className="block text-xs font-semibold text-slate-600">{de ? 'Beobachtungszeit · durch die Woche bewegen' : 'Observation time · move through the week'}<input aria-label="Observation time" type="range" min="0" max={observations.times.length - 1} value={frame} onChange={e => selectFrame(Number(e.target.value))} className="block w-full mt-2 accent-slate-900" /></label>
      <div className="flex justify-between text-xs text-slate-500"><span>1 Oct 2017</span><span>{observed}/{observations.stations.length} {de ? 'Standorte mit Dichtemessung' : 'sites with density observations'}</span><span>7 Oct 2017</span></div>
      <div ref={host} role="region" aria-label="Bird migration radar map" className="rounded-xl border border-slate-200 bg-slate-100" style={{ height: 470, zIndex: 0 }} />
      {tilesUnavailable && <p role="status" className="text-xs text-slate-600">{de ? 'Hintergrundkarte nicht vollständig erreichbar. Radarmessungen sind weiter in der Tabelle verfügbar.' : 'Background map is not fully available. Radar observations remain available in the table.'}</p>}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-700" aria-label={de ? 'Kartenlegende' : 'Map legend'}>
        {[['#fef08a', '0–1'], ['#fbbf24', '1–5'], ['#f97316', '5–20'], ['#e11d48', '20–50'], ['#9333ea', '50+']].map(([color, label]) => <span key={label} className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-slate-500" style={{ background: color }} />{label}</span>)}
        <span>{de ? 'geschätzte Vögel/km²' : 'estimated birds/km²'}</span><span>↗ {de ? 'Bewegungsrichtung' : 'Movement bearing'}</span><span>◌ {de ? 'fehlend / tagsüber' : 'missing / daytime'}</span>
      </div>
      <p className="text-sm text-slate-600">{de ? 'Kreisfarbe und -größe zeigen die geschätzte Vogeldichte über dem Radarstandort. Pfeile zeigen die gemessene mittlere Bewegungsrichtung; ihre Länge ist schematisch. Graue Punkte und leere Gebiete bedeuten fehlende Beobachtung. Die Karte zeigt weder einzelne Vogelrouten noch eine Vorhersage.' : 'Circle colour and size show estimated bird density above each radar site. Arrows show the measured mean movement bearing; their length is schematic. Grey points and empty areas indicate absent observations. These are neither individual bird tracks nor a forecast.'}</p>
      <details className="border-t border-slate-200 pt-3"><summary className="cursor-pointer text-sm font-semibold">{de ? 'Radarmessungen' : 'Radar readings'}</summary>
        <div className="overflow-x-auto mt-3"><table className="w-full text-sm text-left"><caption className="sr-only">{de ? 'Beobachtungen zum gewählten Zeitpunkt' : 'Observations at selected time'}</caption><thead><tr><th scope="col">Radar</th><th scope="col">{de ? 'Vögel/km²' : 'Birds/km²'}</th><th scope="col">{de ? 'Richtung' : 'Bearing'}</th></tr></thead><tbody>{observations.stations.map(s => {
          const r = s.readings[frame]; const direction = r.density !== null && r.density > 0 && r.u !== null && r.v !== null && Math.hypot(r.u, r.v) > .01 ? `${((Math.atan2(r.u, r.v) * 180 / Math.PI + 360) % 360).toFixed(0)}°` : '—';
          return <tr key={s.code} className="border-t border-slate-100"><th scope="row" className="py-2 font-normal uppercase">{s.code}</th><td>{r.density === null ? (r.status === 'daytime' ? (de ? 'Tagsüber' : 'Daytime') : (de ? 'Fehlend' : 'Missing')) : r.density.toFixed(2)}</td><td>{direction}</td></tr>;
        })}</tbody></table></div>
      </details>
      <p className="text-xs text-slate-500">{de ? 'Daten:' : 'Data:'} Lippert, Kranstauber, Forré &amp; van Loon (2022), <a className="underline" href="https://doi.org/10.5281/zenodo.6874789">European radar / ERA5 dataset</a> · CC BY 4.0. {de ? 'Für diese Karte zeitlich ausgewählt; veröffentlichte Nacht- und Fehlwertmasken beibehalten. Dichte ist höhenintegriert, Richtung aus bird_u/bird_v. Kartenkacheln benötigen Internet.' : 'Time subset selected for this map; published night and missingness masks retained. Density is vertically integrated; bearing uses bird_u/bird_v. Map tiles require internet.'}</p>
    </div>
  </section>;
}

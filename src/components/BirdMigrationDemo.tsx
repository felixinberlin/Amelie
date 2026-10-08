import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import sample from '../data/birdMigrationSample.json';

export function BirdMigrationDemo() {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<ReturnType<typeof L.map> | null>(null);
  const marks = useRef<ReturnType<typeof L.layerGroup> | null>(null);
  const [hour, setHour] = useState(0);
  const [band, setBand] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    const m = L.map(host.current, { scrollWheelZoom: false }).setView([52, 12], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 12 }).addTo(m);
    map.current = m; marks.current = L.layerGroup().addTo(m);
    const observer = new ResizeObserver(() => m.invalidateSize()); observer.observe(host.current);
    return () => { observer.disconnect(); m.remove(); map.current = null; marks.current = null; };
  }, []);
  useEffect(() => {
    const layers = marks.current; if (!layers) return;
    layers.clearLayers();
    for (const station of sample.stations) {
      const b = station.hours[hour][band];
      const available = b.density !== null;
      const circle = L.circleMarker([station.lat, station.lon], { radius: available ? 7 + Math.min(22, Math.sqrt(b.density!)) : 7, color: available ? '#047857' : '#64748b', fillColor: available ? '#34d399' : '#94a3b8', fillOpacity: .65, weight: 2 }).addTo(layers);
      circle.bindTooltip(station.name);
      circle.bindPopup(`${station.name}<br>${String(hour).padStart(2,'0')}:00 UTC<br>${available ? b.density!.toFixed(1) + ' birds/km³ (estimated)' : 'No usable sample'}<br>${b.valid}/${b.total} profile rows usable`);
      if (b.u !== null && b.v !== null) {
        // Fixed schematic arrow length. u eastward, v northward; not a flight route.
        const norm = Math.hypot(b.u, b.v);
        if (norm > 0) {
          const dy = b.v / norm * .65, dx = b.u / norm * .65 / Math.cos(station.lat*Math.PI/180);
          const end: [number, number] = [station.lat+dy,station.lon+dx];
          L.polyline([[station.lat,station.lon],end],{color:'#065f46',weight:3}).addTo(layers);
          L.circleMarker(end,{radius:3,color:'#065f46',fillOpacity:1}).addTo(layers);
        }
      }
    }
  }, [hour, band]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setHour(h => (h+1)%24), 900);
    return () => window.clearInterval(timer);
  }, [playing]);
  return <section id="bird-migration-demo" className="rounded-xl border border-emerald-200 bg-white p-4 space-y-4">
    <div><span className="text-xs uppercase tracking-wider text-emerald-700">Working demo · real historical data</span><h4 className="text-xl font-semibold">A night of movement over Europe</h4><p className="text-sm text-stone-600">1 October 2023 · three German radar stations · explore the hours and heights.</p></div>
    <div className="flex flex-wrap items-center gap-4"><button type="button" onClick={() => setPlaying(p=>!p)} className="rounded-lg bg-emerald-800 px-4 py-2 text-white">{playing ? 'Pause' : 'Play day'}</button><label className="text-sm">Altitude <select value={band} onChange={e=>setBand(Number(e.target.value))} className="ml-2 border rounded p-2"><option value={0}>0–1,000 m</option><option value={1}>1,000–2,000 m</option><option value={2}>2,000–4,000 m</option></select></label><output className="font-mono">{String(hour).padStart(2,'0')}:00 UTC</output></div>
    <label className="block text-sm">Hour (UTC)<input aria-label="Hour UTC" type="range" min="0" max="23" value={hour} onChange={e=>setHour(Number(e.target.value))} className="block w-full mt-2" /></label>
    <div ref={host} role="region" aria-label="Bird migration radar map" className="rounded-lg border" style={{height:380,zIndex:0}} />
    <p className="text-sm text-stone-600">Green circles show mean estimated density in usable profile rows. Lines show density-weighted movement direction, with a fixed display length. Grey means missing data. Empty areas are unmeasured. These are local radar observations, not individual birds, species, routes or a forecast.</p>
    <table className="w-full text-sm text-left"><caption className="sr-only">Radar readings at selected time and altitude</caption><thead><tr><th scope="col">Station</th><th scope="col">Birds/km³</th><th scope="col">Usable rows</th></tr></thead><tbody>{sample.stations.map(s=>{const b=s.hours[hour][band];return <tr key={s.code} className="border-t"><th scope="row" className="py-2 font-normal">{s.name}</th><td>{b.density===null?'Missing':b.density.toFixed(1)}</td><td>{b.valid} / {b.total}</td></tr>;})}</tbody></table>
    <p className="text-xs text-stone-500">Source: <a className="underline" href="https://aloftdata.eu/faq/">Aloft / BALTRAD (CC0)</a>. Aggregated hourly; gap-flagged rows and non-finite density or velocity excluded. Heights follow source profile bins. No new mathematical theorem is used in this demo. Map tiles require internet; readings remain available in the table.</p>
  </section>;
}

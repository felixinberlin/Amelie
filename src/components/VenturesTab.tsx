import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Language } from '../types';
import {
  VenturesData, VECTOR_KEYS, VECTOR_LABELS, VentureScores, averageVectors, loadVentures, total,
} from '../data/venturesDashboard';
import { PharmaAcquisitionPanel } from './PharmaAcquisitionPanel';
import { parseVentureFromUrl } from '../utils/doseUrl';

type Sub = 'overview' | 'leads' | 'farmacia';

export const FARMACIA_LEAD_ID = 'farmacia-mandate-engine';

const Bars: React.FC<{ s: VentureScores; lang: Language }> = ({ s, lang }) => (
  <div className="space-y-1">
    {VECTOR_KEYS.map((k) => (
      <div key={k} className="flex items-center gap-2 text-[11px]">
        <span className="w-28 shrink-0 text-[var(--m-ink-3)]">{VECTOR_LABELS[k][lang]}</span>
        <div className="flex-1 h-1.5 rounded bg-[var(--m-sunk)]"><div className="h-1.5 rounded bg-[var(--m-accent)]" style={{ width: `${(s[k] / 5) * 100}%` }} /></div>
        <span className="font-typewriter w-4 text-right text-[var(--m-ink-2)]">{s[k]}</span>
      </div>
    ))}
  </div>
);

const Kpi: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-xl border border-[var(--m-line)] bg-[var(--m-bg-2)] p-3">
    <div className="text-[11px] text-[var(--m-ink-3)]">{label}</div>
    <div className="font-amelie text-2xl font-bold text-[var(--m-ink)]">{value}</div>
  </div>
);

/** Ventures-Tab: kommerzielle Zwillinge mit Commercial Vectors und die Läufe mit eigener Ansicht. */
export function VenturesTab({ lang }: { lang: Language }) {
  const L = (de: string, en: string, es: string) => (lang === 'de' ? de : lang === 'es' ? es : en);
  const [data, setData] = useState<VenturesData | null>(null);
  const [failed, setFailed] = useState(false);
  const [sub, setSub] = useState<Sub>(() => (parseVentureFromUrl() === FARMACIA_LEAD_ID ? 'farmacia' : 'overview'));
  const [stage, setStage] = useState('all');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => { loadVentures().then(setData).catch(() => setFailed(true)); }, []);

  useEffect(() => {
    const onHash = () => { if (parseVentureFromUrl() === FARMACIA_LEAD_ID) setSub('farmacia'); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const avg = useMemo(() => (data ? averageVectors(data.leads) : null), [data]);
  const stages = useMemo(() => Array.from(new Set((data?.leads ?? []).map((l) => l.stage))), [data]);
  const leads = useMemo(() => {
    const list = (data?.leads ?? []).filter((l) => stage === 'all' || l.stage === stage);
    const sc = (l: { vectors: VentureScores | null }) => (l.vectors ? total(l.vectors) : -1);
    return [...list].sort((a, b) => (sortDesc ? sc(b) - sc(a) : sc(a) - sc(b)));
  }, [data, stage, sortDesc]);
  const farmacia = data?.leads.find((l) => l.id === FARMACIA_LEAD_ID);

  const tabs: [Sub, string][] = [
    ['overview', L('Übersicht', 'Overview', 'Resumen')],
    ['leads', 'Leads'],
    ['farmacia', L('Lauf: Apotheken-Vermittlung ES', 'Run: pharmacy brokerage ES', 'Análisis: intermediación de farmacias')],
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-[var(--m-accent)] mb-2">
          <Briefcase className="w-5 h-5" />
          <span className="font-typewriter text-xs uppercase tracking-wider">Ventures</span>
        </div>
        <h2 className="font-amelie text-2xl sm:text-3xl font-bold text-[var(--m-ink)]">{L('Ventures-Läufe', 'Ventures runs', 'Análisis de Ventures')}</h2>
        <p className="mt-1 text-xs text-[var(--m-ink-3)]">
          {L(
            'Kommerzielle Zwillinge der Amélie-Funde und Anfragen von außen. Amélie selbst bleibt CC0; hier steht, was sich verkaufen ließe.',
            'Commercial twins of Amélie findings and outside requests. Amélie itself stays CC0; this shows what could be sold.',
            'Gemelos comerciales de los hallazgos de Amélie y peticiones externas. Amélie sigue siendo CC0; aquí se ve lo que podría venderse.',
          )}
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {tabs.map(([id, l]) => (
          <button key={id} onClick={() => setSub(id)}
            className={`px-2.5 py-1 rounded-lg text-xs border cursor-pointer whitespace-nowrap ${sub === id ? 'bg-[var(--m-sunk)] font-semibold border-[var(--m-line-strong)] text-[var(--m-ink)]' : 'border-transparent text-[var(--m-ink-3)]'}`}>{l}</button>
        ))}
      </div>

      {sub === 'farmacia' ? (
        <PharmaAcquisitionPanel lang={lang} vectors={farmacia?.vectors ?? null} />
      ) : failed ? (
        <p className="text-sm text-[var(--m-ink-2)]">{L('Keine Daten. Zuerst `npm run export:data` ausführen.', 'No data. Run `npm run export:data` first.', 'Sin datos. Ejecuta primero `npm run export:data`.')}</p>
      ) : !data ? (
        <p className="text-sm text-[var(--m-ink-3)]">…</p>
      ) : sub === 'overview' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Kpi label="Leads" value={data.leads.length} />
            <Kpi label={L('Mit Scores', 'With scores', 'Con puntuación')} value={data.leads.filter((l) => l.vectors).length} />
            <Kpi label={L('Engine fertig', 'Engine ready', 'Motor listo')} value={data.leads.filter((l) => l.mvpEngineReady).length} />
          </div>
          <div className="rounded-xl border border-[var(--m-line)] bg-[var(--m-bg-2)] p-4 max-w-md">
            <div className="text-sm font-semibold text-[var(--m-ink)] mb-2">{L('Ø je Commercial Vector (0–5)', 'Average per commercial vector (0–5)', 'Media por vector comercial (0–5)')}</div>
            {avg && <Bars s={Object.fromEntries(VECTOR_KEYS.map((k) => [k, Math.round(avg[k] * 10) / 10])) as unknown as VentureScores} lang={lang} />}
          </div>
          <button onClick={() => setSub('farmacia')} className="text-xs underline text-[var(--m-accent)] cursor-pointer">
            {L('Neuester Lauf: Apotheken-Vermittlung in Spanien →', 'Latest run: pharmacy brokerage in Spain →', 'Último análisis: intermediación de farmacias en España →')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select value={stage} onChange={(e) => setStage(e.target.value)} className="border border-[var(--m-line)] rounded px-2 py-1 bg-[var(--m-bg)]">
              <option value="all">{L('Alle Status', 'All stages', 'Todos los estados')}</option>
              {stages.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setSortDesc((v) => !v)} className="border border-[var(--m-line)] rounded px-2 py-1 cursor-pointer">{L('Gesamtscore', 'Total score', 'Puntuación total')} {sortDesc ? '↓' : '↑'}</button>
            <span className="text-[var(--m-ink-3)]">{leads.length}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {leads.map((l) => (
              <div key={l.id} className="rounded-xl border border-[var(--m-line)] bg-[var(--m-bg-2)] p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-sm text-[var(--m-ink)]">{l.name}</div>
                  <span className="text-[10px] font-typewriter px-1.5 rounded border border-[var(--m-line)] shrink-0">{l.stage}</span>
                </div>
                <div className="text-[11px] text-[var(--m-ink-3)]">{l.category} · {l.targetPrice}</div>
                {l.vectors ? <><Bars s={l.vectors} lang={lang} /><div className="text-[11px] font-typewriter text-[var(--m-ink-2)]">Σ {total(l.vectors)}/25</div></> : <div className="text-[11px] text-[var(--m-ink-3)]">{L('keine Scores', 'no scores', 'sin puntuación')}</div>}
                {l.id === FARMACIA_LEAD_ID && (
                  <button onClick={() => setSub('farmacia')} className="text-[11px] underline text-[var(--m-accent)] cursor-pointer">{L('Analyse öffnen', 'Open analysis', 'Abrir análisis')}</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { Search, X, Radar, Gift, Sparkles, RotateCcw, ExternalLink, Link2, Check } from 'lucide-react';
import { CandidateIdea, DoseItem, Language } from '../types';
import { getLocalizedTitle } from '../i18n';
import { parseCompareFromUrl, getCompareUrl } from '../utils/doseUrl';
import {
  VECTOR_CATALOG,
  FUN_SOURCE_LABEL,
  DoseVectors,
  getDoseVectors,
  getCandidateVectors,
  vectorScore,
  vectorLabel,
  vectorQuestion,
  coreScore,
  totalScore,
} from '../data/vectors';

interface Props {
  lang: Language;
  dosen: DoseItem[];
  candidates: CandidateIdea[];
  onOpenDose?: (id: string) => void;
}

interface Entry {
  id: string;
  kind: 'dose' | 'candidate';
  title: string;
  vec: DoseVectors;
  sub: string;
}

const MAX_SELECTED = 6;

/** Okabe-Ito (farbenblind-sicher); zusätzlich unterscheidet die Strichart. */
const SERIES = [
  { color: '#0072B2', dash: '' },
  { color: '#D55E00', dash: '6 3' },
  { color: '#009E73', dash: '2 3' },
  { color: '#CC79A7', dash: '10 3 2 3' },
  { color: '#E69F00', dash: '' },
  { color: '#56B4E9', dash: '6 3' },
];

const SIZE = 460;
const C = SIZE / 2;
const R = 150;
const angle = (i: number) => (-90 + (360 / VECTOR_CATALOG.length) * i) * (Math.PI / 180);
const pt = (i: number, value: number) => {
  const r = (value / 5) * R;
  return [C + r * Math.cos(angle(i)), C + r * Math.sin(angle(i))] as const;
};

export const VectorCompareView: React.FC<Props> = ({ lang, dosen, candidates, onOpenDose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDe = lang === 'de';
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<'all' | 'dose' | 'candidate'>('all');
  const [hover, setHover] = useState<string | null>(null);

  const entries = useMemo<Entry[]>(() => {
    const list: Entry[] = [];
    for (const d of dosen) {
      const vec = getDoseVectors(d.id);
      if (vec) list.push({ id: `dose:${d.id}`, kind: 'dose', title: getLocalizedTitle(d, lang), vec, sub: d.domain });
    }
    for (const c of candidates) {
      if (c.packedDoseId) continue; // steckt schon als Dose in der Liste
      const vec = getCandidateVectors(c.id, c.packedDoseId);
      if (vec) list.push({ id: `cand:${c.id}`, kind: 'candidate', title: getLocalizedTitle(c, lang), vec, sub: c.status });
    }
    return list;
  }, [dosen, candidates, lang]);

  const byId = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries]);

  // Auswahl kommt aus dem Link (#compare=…), sonst ein Startpaar; unbekannte Ids fallen weg.
  const fromUrl = (): string[] => {
    const ids = parseCompareFromUrl();
    if (ids === null) return ['dose:kristallwachstum-3d', 'dose:dose-cleaner-chemical-safety'];
    return [...new Set(ids)].filter((id) => byId.has(id)).slice(0, MAX_SELECTED);
  };
  const selected = fromUrl();
  const setSelected = (value: string[] | ((previous: string[]) => string[])) => {
    const next = typeof value === 'function' ? value(selected) : value;
    const query = new URLSearchParams(location.search);
    query.set('items', next.join(','));
    navigate({ pathname: '/compare/', search: '?' + query.toString() }, { replace: true });
  };
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getCompareUrl(selected));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Zwischenablage gesperrt: Adresszeile enthält den Link ohnehin */
    }
  };
  const chosen = selected.map((id) => byId.get(id)).filter((e): e is Entry => !!e);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => (scope === 'all' || e.kind === scope) && (!q || e.title.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)))
      .sort((a, b) => totalScore(b.vec) - totalScore(a.vec) || a.title.localeCompare(b.title));
  }, [entries, query, scope]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= MAX_SELECTED ? prev : [...prev, id]));

  const preset = (fn: (a: Entry, b: Entry) => number, kind?: Entry['kind']) =>
    setSelected(entries.filter((e) => !kind || e.kind === kind).sort(fn).slice(0, 3).map((e) => e.id));

  const seriesOf = (id: string) => SERIES[selected.indexOf(id) % SERIES.length];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-6">
        <div className="flex items-center gap-2 text-[var(--m-accent)] font-typewriter text-xs uppercase tracking-wider font-semibold">
          <Radar className="w-4 h-4" />
          {isDe ? 'Vektor-Vergleich' : 'Vector comparison'}
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-bold font-amelie text-[var(--m-ink)]">
            {isDe ? 'Ideen nebeneinander legen' : 'Lay ideas side by side'}
          </h2>
          <button
            type="button"
            onClick={copyLink}
            disabled={selected.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--m-line-strong)] text-xs font-semibold text-[var(--m-ink)] hover:bg-[var(--m-sunk)] disabled:opacity-40"
            title={isDe ? 'Link zu dieser Auswahl kopieren' : 'Copy a link to this selection'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[var(--m-green)]" /> : <Link2 className="w-3.5 h-3.5" />}
            {copied ? (isDe ? 'Link kopiert!' : 'Link copied!') : isDe ? 'Auswahl teilen' : 'Share selection'}
          </button>
        </div>
        <p className="mt-2 text-sm text-[var(--m-ink-2)] max-w-3xl">
          {isDe
            ? `Wähle bis zu ${MAX_SELECTED} Dosen oder Kandidaten und vergleiche ihre acht Reviewer-Vektoren im Netzdiagramm. Kandidaten sind Schreibtisch-Triage (ohne Websuche), Dosen sind vollständig geprüft. Bei V2 heißt 5 „leicht zu bauen".`
            : `Pick up to ${MAX_SELECTED} tins or candidates and compare their eight reviewer vectors on a radar chart. Candidates are desk triage (no web search); tins are fully reviewed. For V2, 5 means "light to build".`}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-6 items-start">
        {/* Picker */}
        <aside className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4 space-y-3 lg:sticky lg:top-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m-muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isDe ? 'Idee suchen…' : 'Search ideas…'}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] text-sm"
            />
          </div>
          <div className="flex gap-1.5 text-xs font-semibold" role="tablist">
            {(['all', 'dose', 'candidate'] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={scope === s}
                onClick={() => setScope(s)}
                className={`px-3 py-1 rounded-full border ${scope === s ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)] border-[var(--m-accent)]' : 'border-[var(--m-line-strong)] text-[var(--m-ink-2)]'}`}
              >
                {s === 'all' ? (isDe ? 'Alle' : 'All') : s === 'dose' ? (isDe ? 'Dosen' : 'Tins') : isDe ? 'Kandidaten' : 'Candidates'}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <button type="button" className="px-2 py-1 rounded-lg border border-[var(--m-line)] hover:bg-[var(--m-sunk)]" onClick={() => preset((a, b) => totalScore(b.vec) - totalScore(a.vec))}>
              {isDe ? 'Top 3 gesamt' : 'Top 3 overall'}
            </button>
            <button type="button" className="px-2 py-1 rounded-lg border border-[var(--m-line)] hover:bg-[var(--m-sunk)]" onClick={() => preset((a, b) => b.vec.fun - a.vec.fun || totalScore(b.vec) - totalScore(a.vec))}>
              {isDe ? 'Top 3 Fun' : 'Top 3 fun'}
            </button>
            <button type="button" className="px-2 py-1 rounded-lg border border-[var(--m-line)] hover:bg-[var(--m-sunk)]" onClick={() => preset((a, b) => totalScore(b.vec) - totalScore(a.vec), 'candidate')}>
              {isDe ? 'Top 3 Kandidaten' : 'Top 3 candidates'}
            </button>
            <button type="button" className="px-2 py-1 rounded-lg border border-[var(--m-line)] hover:bg-[var(--m-sunk)] inline-flex items-center gap-1" onClick={() => setSelected([])}>
              <RotateCcw className="w-3 h-3" />
              {isDe ? 'Leeren' : 'Clear'}
            </button>
          </div>
          <p className="text-[11px] text-[var(--m-muted)] font-typewriter">
            {selected.length}/{MAX_SELECTED} {isDe ? 'gewählt' : 'selected'} · {visible.length} {isDe ? 'Treffer' : 'results'}
          </p>
          <ul className="max-h-[520px] overflow-y-auto -mx-1 pr-1 space-y-1" aria-label={isDe ? 'Ideenliste' : 'Idea list'}>
            {visible.map((e) => {
              const on = selected.includes(e.id);
              const full = !on && selected.length >= MAX_SELECTED;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => toggle(e.id)}
                    disabled={full}
                    aria-pressed={on}
                    className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs transition-colors ${
                      on ? 'border-[var(--m-accent)] bg-[var(--m-accent)]/8' : 'border-transparent hover:bg-[var(--m-sunk)]'
                    } ${full ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 border border-[var(--m-line-strong)]"
                      style={{ background: on ? seriesOf(e.id).color : 'transparent' }}
                      aria-hidden="true"
                    />
                    {e.kind === 'dose' ? <Gift className="w-3.5 h-3.5 shrink-0 text-[var(--m-green)]" /> : <Sparkles className="w-3.5 h-3.5 shrink-0 text-[var(--m-copper)]" />}
                    <span className="flex-1 min-w-0 truncate font-semibold text-[var(--m-ink)]">{e.title}</span>
                    <span className="font-typewriter text-[var(--m-muted)] whitespace-nowrap">
                      {totalScore(e.vec)}/40
                    </span>
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && <li className="text-xs text-[var(--m-muted)] px-2 py-4">{isDe ? 'Nichts gefunden.' : 'Nothing found.'}</li>}
          </ul>
        </aside>

        {/* Chart + table */}
        <section className="space-y-6 min-w-0">
          {chosen.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--m-line-strong)] p-10 text-center text-sm text-[var(--m-muted)]">
              {isDe ? 'Klicke links auf Ideen, um ihre Vektoren zu vergleichen.' : 'Click ideas on the left to compare their vectors.'}
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {chosen.map((e) => {
                    const s = seriesOf(e.id);
                    return (
                      <span
                        key={e.id}
                        onMouseEnter={() => setHover(e.id)}
                        onMouseLeave={() => setHover(null)}
                        className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full border text-xs font-semibold bg-[var(--m-surface)]"
                        style={{ borderColor: s.color }}
                      >
                        <svg width="22" height="8" aria-hidden="true">
                          <line x1="0" y1="4" x2="22" y2="4" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dash} />
                        </svg>
                        <span className="max-w-[200px] truncate text-[var(--m-ink)]">{e.title}</span>
                        <button type="button" onClick={() => toggle(e.id)} aria-label={isDe ? 'Entfernen' : 'Remove'} className="p-0.5 rounded-full hover:bg-[var(--m-sunk)]">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <svg viewBox={`-90 0 ${SIZE + 180} ${SIZE}`} className="w-full max-w-[680px] mx-auto block" role="img"
                  aria-label={isDe ? 'Netzdiagramm der acht Vektoren' : 'Radar chart of the eight vectors'}>
                  {[1, 2, 3, 4, 5].map((ring) => (
                    <polygon
                      key={ring}
                      points={VECTOR_CATALOG.map((_, i) => pt(i, ring).join(',')).join(' ')}
                      fill="none"
                      stroke="var(--m-line-strong)"
                      strokeWidth={ring === 3 ? 1.5 : 0.75}
                      strokeDasharray={ring === 3 ? '4 3' : undefined}
                      opacity={ring === 3 ? 0.9 : 0.5}
                    />
                  ))}
                  {VECTOR_CATALOG.map((def, i) => {
                    const [x, y] = pt(i, 5);
                    const [lx, ly] = pt(i, 5.75);
                    const anchor = Math.abs(lx - C) < 8 ? 'middle' : lx > C ? 'start' : 'end';
                    return (
                      <g key={def.key}>
                        <line x1={C} y1={C} x2={x} y2={y} stroke="var(--m-line-strong)" strokeWidth="0.75" opacity="0.6" />
                        <text x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fontSize="12" fontWeight="600" fill="var(--m-ink)">
                          {def.code} {vectorLabel(def, lang)}
                          <title>{vectorQuestion(def, lang)}</title>
                        </text>
                      </g>
                    );
                  })}
                  {[1, 3, 5].map((ring) => (
                    <text key={ring} x={C + 4} y={C - (ring / 5) * R - 2} fontSize="9" fill="var(--m-muted)">{ring}</text>
                  ))}
                  {chosen.map((e) => {
                    const s = seriesOf(e.id);
                    const faded = hover && hover !== e.id;
                    const pts = VECTOR_CATALOG.map((d, i) => pt(i, vectorScore(e.vec, d.key)));
                    return (
                      <g key={e.id} opacity={faded ? 0.15 : 1}>
                        <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={s.color} fillOpacity="0.12" stroke={s.color} strokeWidth="2.25" strokeDasharray={s.dash} strokeLinejoin="round" />
                        {pts.map(([x, y], i) => (
                          <circle key={i} cx={x} cy={y} r="3.5" fill={s.color}>
                            <title>{`${e.title}: ${VECTOR_CATALOG[i].code} ${vectorLabel(VECTOR_CATALOG[i], lang)} = ${vectorScore(e.vec, VECTOR_CATALOG[i].key)}/5`}</title>
                          </circle>
                        ))}
                      </g>
                    );
                  })}
                </svg>
                <p className="text-[11px] text-[var(--m-muted)] text-center font-typewriter">
                  {isDe ? 'Gestrichelter Ring = Schwelle 3 · V8 Fun zählt nicht zum Dose-Ready-Gate' : 'Dashed ring = threshold 3 · V8 Fun is not part of the Dose Ready gate'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--m-line)] text-left">
                      <th className="p-3 font-typewriter uppercase tracking-wider text-[var(--m-muted)]">{isDe ? 'Vektor' : 'Vector'}</th>
                      {chosen.map((e) => (
                        <th key={e.id} className="p-3 align-bottom min-w-[110px]">
                          <span className="block w-full h-1 rounded mb-1.5" style={{ background: seriesOf(e.id).color }} />
                          <span className="block font-semibold text-[var(--m-ink)] line-clamp-2">{e.title}</span>
                          <span className="block text-[10px] font-normal text-[var(--m-muted)]">
                            {e.kind === 'dose' ? (isDe ? 'Dose' : 'Tin') : isDe ? 'Kandidat' : 'Candidate'}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {VECTOR_CATALOG.map((def) => {
                      const vals = chosen.map((e) => vectorScore(e.vec, def.key));
                      const max = Math.max(...vals);
                      const differs = new Set(vals).size > 1;
                      return (
                        <tr key={def.key} className="border-b border-[var(--m-line)]/60" title={vectorQuestion(def, lang)}>
                          <td className="p-3 whitespace-nowrap">
                            <span className="font-typewriter text-[var(--m-muted)] mr-1.5">{def.code}</span>
                            <span className="font-semibold text-[var(--m-ink)]">{vectorLabel(def, lang)}</span>
                          </td>
                          {vals.map((v, i) => (
                            <td key={chosen[i].id} className={`p-3 font-typewriter ${differs && v === max ? 'font-bold text-[var(--m-ink)]' : 'text-[var(--m-ink-2)]'}`}>
                              {v}/5{differs && v === max ? ' ▲' : ''}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    <tr className="border-b border-[var(--m-line)]/60 bg-[var(--m-sunk)]">
                      <td className="p-3 font-semibold">{isDe ? 'Kern V1–V7' : 'Core V1–V7'}</td>
                      {chosen.map((e) => <td key={e.id} className="p-3 font-typewriter font-bold">{coreScore(e.vec)}/35</td>)}
                    </tr>
                    <tr className="bg-[var(--m-sunk)]">
                      <td className="p-3 font-semibold">{isDe ? 'Gesamt inkl. Fun' : 'Total incl. Fun'}</td>
                      {chosen.map((e) => <td key={e.id} className="p-3 font-typewriter font-bold">{totalScore(e.vec)}/40</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 align-top font-semibold">{isDe ? 'Warum Fun?' : 'Why this Fun score?'}</td>
                      {chosen.map((e) => (
                        <td key={e.id} className="p-3 align-top text-[var(--m-ink-2)] leading-relaxed">
                          <span className="font-typewriter text-[var(--m-copper)]">{isDe ? FUN_SOURCE_LABEL[e.vec.funSource].de : FUN_SOURCE_LABEL[e.vec.funSource].en}</span>
                          {' · '}
                          {isDe ? e.vec.funDe : e.vec.funEn}
                          {e.kind === 'dose' && onOpenDose && (
                            <button type="button" onClick={() => onOpenDose(e.id.slice(5))} className="mt-2 inline-flex items-center gap-1 text-[var(--m-accent)] font-semibold hover:underline">
                              {isDe ? 'Dose öffnen' : 'Open tin'} <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

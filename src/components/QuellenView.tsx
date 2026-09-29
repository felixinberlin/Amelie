import React, { useMemo, useState } from 'react';
import { Library, Search, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import {
  QUELLEN_DATA, QUELLEN_KATALOG, QUELLEN_STAND, Quelle, QuelleStatus, quellenScore, quellenEmpfehlung,
} from '../data/quellen';

type SortKey = 'empfehlung' | 'score' | 'name';

/** Quellen-Register als eigene Ansicht. Wahrheit ist src/data/quellen.json; geschrieben wird nur per `npm run quellen`. */
export function QuellenView({ lang }: { lang: Language }) {
  const de = lang === 'de';
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<QuelleStatus | 'all'>('all');
  const [kategorie, setKategorie] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('empfehlung');
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = QUELLEN_DATA.filter((s) =>
      (status === 'all' || s.status === status) &&
      (kategorie === 'all' || s.kategorie === kategorie) &&
      (!needle || [s.name, s.enthaelt, s.fokus, s.tags.join(' ')].join(' ').toLowerCase().includes(needle)),
    );
    const by: Record<SortKey, (a: Quelle, b: Quelle) => number> = {
      empfehlung: (a, b) => quellenEmpfehlung(b) - quellenEmpfehlung(a),
      score: (a, b) => quellenScore(b) - quellenScore(a),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...list].sort(by[sort]);
  }, [q, status, kategorie, sort]);

  const label = (l: { de: string; en: string }) => (de ? l.de : l.en);
  const autoCount = QUELLEN_DATA.filter((s) => s.vektoren.basis === 'auto').length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[var(--m-accent)] mb-2">
          <Library className="w-5 h-5" />
          <span className="font-typewriter text-xs uppercase tracking-wider">{de ? 'Quellen-Register' : 'Source register'}</span>
        </div>
        <h2 className="font-amelie text-2xl sm:text-3xl font-bold text-[var(--m-ink)]">
          {QUELLEN_DATA.length} {de ? 'Quellen, aus denen Amélie schöpft' : 'sources Amélie draws from'}
        </h2>
        <p className="mt-2 text-sm text-[var(--m-ink-2)] max-w-3xl">
          {de
            ? `Stand ${QUELLEN_STAND}. Q1–Q6 sind bei ${autoCount} Quellen nur abgeleitet („auto“), nicht bewertet; der Bibliothekar ersetzt sie, sobald eine Runde die Quelle angefasst hat. „Empfehlung“ sortiert nach dem Nächstes-graben-Gewicht.`
            : `As of ${QUELLEN_STAND}. Q1–Q6 are only derived ("auto") for ${autoCount} sources, not rated; the librarian replaces them once a round has touched the source. "Recommendation" sorts by next-to-dig weight.`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center text-sm">
        <label className="flex items-center gap-2 border border-[var(--m-line-strong)] rounded-lg px-3 py-1.5 bg-[var(--m-bg)]">
          <Search className="w-4 h-4 text-[var(--m-ink-3)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={de ? 'Suchen…' : 'Search…'} className="bg-transparent outline-none w-44" />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value as QuelleStatus | 'all')} className="border border-[var(--m-line-strong)] rounded-lg px-2 py-1.5 bg-[var(--m-bg)]">
          <option value="all">{de ? 'Alle Status' : 'All statuses'}</option>
          {QUELLEN_KATALOG.status.map((s) => <option key={s.id} value={s.id}>{label(s)}</option>)}
        </select>
        <select value={kategorie} onChange={(e) => setKategorie(e.target.value)} className="border border-[var(--m-line-strong)] rounded-lg px-2 py-1.5 bg-[var(--m-bg)]">
          <option value="all">{de ? 'Alle Kategorien' : 'All categories'}</option>
          {Object.entries(QUELLEN_KATALOG.kategorien).map(([id, l]) => <option key={id} value={id}>{label(l)}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="border border-[var(--m-line-strong)] rounded-lg px-2 py-1.5 bg-[var(--m-bg)]">
          <option value="empfehlung">{de ? 'Sortiert: Empfehlung' : 'Sort: recommendation'}</option>
          <option value="score">{de ? 'Sortiert: Q-Summe' : 'Sort: Q total'}</option>
          <option value="name">{de ? 'Sortiert: Name' : 'Sort: name'}</option>
        </select>
        <span className="text-xs font-typewriter text-[var(--m-ink-3)]">{rows.length} / {QUELLEN_DATA.length}</span>
      </div>

      <ul className="space-y-2">
        {rows.map((s) => {
          const isOpen = open === s.id;
          const stat = QUELLEN_KATALOG.status.find((x) => x.id === s.status);
          return (
            <li key={s.id} className="rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-bg)]">
              <button onClick={() => setOpen(isOpen ? null : s.id)} className="w-full text-left px-4 py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-semibold text-[var(--m-ink)]">{s.name}</span>
                <span className="text-[11px] font-typewriter text-[var(--m-ink-3)]">
                  {de ? 'Typ' : 'Type'} {s.typ} · {label(QUELLEN_KATALOG.kategorien[s.kategorie] ?? { de: s.kategorie, en: s.kategorie })}
                </span>
                <span className="ml-auto text-[11px] font-typewriter text-[var(--m-ink-2)]">
                  {stat ? label(stat) : s.status} · {QUELLEN_KATALOG.erreichbar[s.zugang.erreichbar] ?? s.zugang.erreichbar}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-[var(--m-ink-2)] space-y-2 border-t border-[var(--m-line)] pt-3">
                  <p>{s.enthaelt}</p>
                  <p><b>{de ? 'Fokus:' : 'Focus:'}</b> {s.fokus}</p>
                  <p><b>{de ? 'Zugang:' : 'Access:'}</b> {s.zugang.wie}</p>
                  {s.statusNotiz && <p className="text-[var(--m-ink-3)]">{s.statusNotiz}</p>}
                  <p className="font-typewriter text-xs">
                    Q1–Q6: {s.vektoren.q.join(' · ')} ({s.vektoren.basis === 'auto' ? (de ? 'abgeleitet' : 'derived') : QUELLEN_KATALOG.basis[s.vektoren.basis]})
                    {' · '}{de ? 'Ertrag' : 'Yield'}: {s.ertrag.dosen.length} {de ? 'Dosen' : 'doses'}, {s.ertrag.graeber.length} {de ? 'Gräber' : 'graves'}
                  </p>
                  {s.urls.length > 0 && (
                    <p className="flex flex-wrap gap-3">
                      {s.urls.slice(0, 3).map((u) => (
                        <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline break-all">
                          {u.replace(/^https?:\/\//, '')}<ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import React from 'react';
import { Language } from '../types';
import {
  VECTOR_CATALOG,
  FUN_SOURCE_LABEL,
  getDoseVectors,
  getCandidateVectors,
  vectorScore,
  vectorLabel,
  vectorQuestion,
  coreScore,
  totalScore,
} from '../data/vectors';

interface Props {
  /** Dose-Id (oder Kandidaten-Id, wenn `candidate` gesetzt) */
  doseId: string;
  candidate?: { packedDoseId?: string };
  lang: Language;
  /** compact = nur Mini-Balken (Galeriekarte) */
  compact?: boolean;
}

/** Farbe nach Score: 1–2 kritisch, 3 Schwelle, 4–5 stark. Fun bekommt eigene Akzentfarbe. */
const barColor = (score: number, isFun: boolean) =>
  isFun ? 'var(--m-copper)' : score >= 4 ? 'var(--m-green)' : score === 3 ? 'var(--m-gold)' : 'var(--m-accent)';

export const DoseVectorPanel: React.FC<Props> = ({ doseId, candidate, lang, compact }) => {
  const vec = candidate ? getCandidateVectors(doseId, candidate.packedDoseId) : getDoseVectors(doseId);
  const isDe = lang === 'de';
  if (!vec) return null;
  const core = coreScore(vec);
  const total = totalScore(vec);

  if (compact) {
    return (
      <div
        className="flex items-center gap-2"
        title={isDe ? `Kern ${core}/35 · gesamt ${total}/40 · Fun ${vec.fun}/5` : `Core ${core}/35 · total ${total}/40 · Fun ${vec.fun}/5`}
      >
        <div className="flex items-end gap-[2px] h-4" aria-hidden="true">
          {VECTOR_CATALOG.map((def) => {
            const s = vectorScore(vec, def.key);
            return (
              <span
                key={def.key}
                className="w-[5px] rounded-sm"
                style={{ height: `${(s / 5) * 100}%`, background: barColor(s, !def.core) }}
              />
            );
          })}
        </div>
        <span className="text-[10px] font-typewriter text-[var(--m-muted)]">
          {total}/40 · Fun {vec.fun}
        </span>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[var(--m-line)] bg-[var(--m-sunk)] p-4" aria-label={isDe ? 'Reviewer-Vektoren' : 'Reviewer vectors'}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h4 className="font-typewriter uppercase tracking-wider text-xs font-semibold text-[var(--m-muted)]">
          {candidate
            ? (isDe ? 'Vektoren (Reviewer, Schreibtisch-Triage)' : 'Vectors (Reviewer, desk triage)')
            : (isDe ? 'Vektoren (Idea Reviewer)' : 'Vectors (Idea Reviewer)')}
        </h4>
        <span className="text-xs font-typewriter text-[var(--m-ink)]">
          {isDe ? 'Kern' : 'Core'} <strong>{core}/35</strong> · {isDe ? 'gesamt inkl. Fun' : 'total incl. Fun'} <strong>{total}/40</strong>
        </span>
      </div>
      <ul className="space-y-2">
        {VECTOR_CATALOG.map((def) => {
          const s = vectorScore(vec, def.key);
          const isFun = def.key === 'fun';
          return (
            <li key={def.key} title={vectorQuestion(def, lang)}>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-7 font-typewriter text-[var(--m-muted)]">{def.code}</span>
                <span className="w-28 shrink-0 font-semibold text-[var(--m-ink)]">{vectorLabel(def, lang)}</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--m-line)]/50 overflow-hidden" role="meter" aria-valuemin={1} aria-valuemax={5} aria-valuenow={s} aria-label={vectorLabel(def, lang)}>
                  <div className="h-full rounded-full" style={{ width: `${(s / 5) * 100}%`, background: barColor(s, isFun) }} />
                </div>
                <span className="w-8 text-right font-typewriter font-bold text-[var(--m-ink)]">{s}/5</span>
              </div>
              {isFun && (
                <p className="ml-9 mt-1 text-xs text-[var(--m-ink-2)]">
                  <span className="font-typewriter text-[var(--m-copper)]">
                    {isDe ? FUN_SOURCE_LABEL[vec.funSource].de : FUN_SOURCE_LABEL[vec.funSource].en}
                  </span>
                  {' · '}
                  {isDe ? vec.funDe : vec.funEn}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[10px] text-[var(--m-muted)] font-typewriter">
        {isDe
          ? 'Fun ist additiv und kompensiert nie: Das Dose-Ready-Gate rechnet nur V1–V7 (≥ 24/35).'
          : 'Fun is additive and never compensates: the Dose Ready gate only counts V1–V7 (≥ 24/35).'}
      </p>
    </section>
  );
};

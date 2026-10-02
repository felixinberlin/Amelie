import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, CalendarClock, ListChecks, HelpCircle, Coins, Filter, Terminal } from 'lucide-react';
import { Language } from '../types';
import { UI_ES, CREDITS_ES } from '../data/relativesEs';
import {
  AI_CREDIT_SUMMARY,
  AI_CREDIT_PATHS,
  AI_CREDIT_PROGRAMS,
  AI_CREDIT_BLOCKERS,
  AI_CREDIT_DATES,
  AI_CREDIT_STEPS,
  AI_CREDIT_QUESTIONS,
  AI_CREDIT_CHECKED,
  AI_STARTER_STEPS,
  CreditFit,
  CreditKind,
} from '../data/aiCredits';

interface AiCreditsGuideProps {
  lang: Language;
}

const FIT_STYLE: Record<CreditFit, { cls: string; de: string; en: string }> = {
  try: { cls: 'bg-[#d1fae5] text-[#064e3b] border-[#34d399]', de: 'Jetzt versuchen', en: 'Try now' },
  maybe: { cls: 'bg-[#fde68a] text-[#78350f] border-[#f59e0b]', de: 'Mit Bedingungen', en: 'With conditions' },
  blocked: { cls: 'bg-[#fee2e2] text-[#7f1d1d] border-[#f87171]', de: 'Derzeit verschlossen', en: 'Currently closed to you' },
};

const KIND_LABEL: Record<CreditKind, { de: string; en: string }> = {
  credits: { de: 'API-Credits', en: 'API credits' },
  subscription: { de: 'Abo gratis', en: 'Free subscription' },
  'free-tier': { de: 'Gratisstufe', en: 'Free tier' },
  cash: { de: 'Geld', en: 'Cash' },
  tooling: { de: 'Werkzeug', en: 'Tooling' },
};

export const AiCreditsGuide: React.FC<AiCreditsGuideProps> = ({ lang }) => {
  const isDe = lang === 'de';
  const isEs = lang === 'es';
  const L = (de: string, en: string) => (isDe ? de : isEs ? (UI_ES[en] ?? en) : en);
  const [fit, setFit] = useState<CreditFit | 'all'>('all');

  const programs = AI_CREDIT_PROGRAMS.filter((p) => fit === 'all' || p.fit === fit);

  return (
    <div className="space-y-8" data-testid="ai-credits-guide">
      <section className="rounded-2xl border border-[var(--m-line-strong)] bg-gradient-to-br from-[#fcf7ee] to-[#f4e8d3] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-[var(--m-accent)] mb-2">
          <Coins className="w-5 h-5" />
          <h3 className="font-amelie text-xl sm:text-2xl font-bold text-[var(--m-ink)]">
            {L('KI-Credits und Runway: wie bezahlt ein Einzelentwickler die Rechenkosten?', 'AI credits and runway: how does a solo developer pay for compute?')}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-[var(--m-ink-2)] max-w-3xl leading-relaxed">{isEs ? CREDITS_ES.summary : L(AI_CREDIT_SUMMARY.de, AI_CREDIT_SUMMARY.en)}</p>
        <p className="mt-3 text-xs text-[var(--m-muted)] font-typewriter">
          {L(`Stand ${AI_CREDIT_CHECKED}. Gelesen auf Primärseite nur: Anthropic-Bedingungen für Open Source, NLnet. Alles andere Suchschnipsel: vor jeder Bewerbung prüfen.`, `As of ${AI_CREDIT_CHECKED}. Read on primary pages only: Anthropic open-source terms, NLnet. Everything else is search snippets: verify before applying.`)}
        </p>
      </section>

      {isEs && <p className="text-xs italic text-[var(--m-muted)]">{L('', 'The dossier texts are in English; the interface is translated.')}</p>}

      <section className="space-y-3">
        <h4 className="font-amelie text-lg font-bold text-[var(--m-ink)]">{L('Fünf Wege, nach Tempo geordnet', 'Five paths, ordered by speed')}</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {AI_CREDIT_PATHS.map((p) => (
            <article key={p.id} className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-4 shadow-xs space-y-1.5">
              <h5 className="font-bold text-[var(--m-ink)]">{isEs ? CREDITS_ES.paths[p.id]?.title ?? p.titleEn : L(p.titleDe, p.titleEn)}</h5>
              <p className="text-[11px] font-typewriter text-[var(--m-accent)]">{isEs ? CREDITS_ES.paths[p.id]?.speed ?? p.speedEn : L(p.speedDe, p.speedEn)}</p>
              <p className="text-sm text-[var(--m-ink-2)] leading-relaxed">{L(p.bodyDe, p.bodyEn)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-amelie text-lg font-bold text-[var(--m-ink)]">
            {isEs ? `Programas (${programs.length} de ${AI_CREDIT_PROGRAMS.length})` : L(`Programme (${programs.length} von ${AI_CREDIT_PROGRAMS.length})`, `Programmes (${programs.length} of ${AI_CREDIT_PROGRAMS.length})`)}
          </h4>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={L('Passung filtern', 'Filter by fit')}>
            <Filter className="w-4 h-4 text-[var(--m-muted)]" />
            {(['all', 'try', 'maybe', 'blocked'] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={fit === f}
                onClick={() => setFit(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                  fit === f ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)] border-[var(--m-accent-strong)]' : 'bg-[var(--m-bg)] text-[var(--m-ink-2)] border-[var(--m-line-strong)]'
                }`}
              >
                {f === 'all' ? L('Alle', 'All') : L(FIT_STYLE[f].de, FIT_STYLE[f].en)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {programs.map((p) => (
            <article key={p.id} className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-4 sm:p-5 shadow-xs flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-typewriter">
                <span className={`px-2 py-0.5 rounded border ${FIT_STYLE[p.fit].cls}`}>{L(FIT_STYLE[p.fit].de, FIT_STYLE[p.fit].en)}</span>
                <span className="px-2 py-0.5 rounded border border-[var(--m-line-strong)] text-[var(--m-ink-2)]">{L(KIND_LABEL[p.kind].de, KIND_LABEL[p.kind].en)}</span>
                <span className="text-[var(--m-muted)]">{p.provider}</span>
              </div>
              <h5 className="font-amelie text-base sm:text-lg font-bold text-[var(--m-ink)]">{L(p.nameDe, p.nameEn)}</h5>
              <p className="text-sm font-semibold text-[var(--m-accent)]">{L(p.valueDe, p.valueEn)}</p>
              <p className="text-xs sm:text-sm text-[var(--m-ink-2)] leading-relaxed"><span className="font-bold text-[var(--m-ink)]">{L('Wer darf: ', 'Who may: ')}</span>{L(p.whoDe, p.whoEn)}</p>
              <p className="text-xs sm:text-sm text-[var(--m-ink-2)] leading-relaxed"><span className="font-bold text-[var(--m-ink)]">{L('Für Félix: ', 'For Félix: ')}</span>{L(p.nextDe, p.nextEn)}</p>
              <div className="mt-auto flex flex-wrap items-center gap-3 text-xs">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[var(--m-accent)] hover:underline">
                  {L('Primärseite', 'Primary page')} <ExternalLink className="w-3 h-3" />
                </a>
                {p.evidence === 'read' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700"><ShieldCheck className="w-3.5 h-3.5" />{L('Seite gelesen', 'page read')}</span>
                ) : (
                  <span className="text-amber-700">{L('Suchschnipsel, prüfen', 'search snippet, verify')}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3" data-testid="ai-starter">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--m-accent)]" />
          <h4 className="font-amelie text-lg font-bold text-[var(--m-ink)]">
            {L('Agenten-Orchestrierung selbst ausprobieren: günstig starten', 'Try agent orchestration yourself: start cheap')}
          </h4>
        </div>
        <p className="text-sm text-[var(--m-ink-2)] max-w-3xl leading-relaxed">
          {L(
            'Für jede Entwicklerin und jeden Entwickler, nicht nur für Amélie-Beitragende: Das Repo ist ein vollständiges, kleines Beispiel für eine Orchestrierung mit drei Entdeckungs-Engines, Reviewer, Packer und einem einzigen Schreiber für das geteilte Gedächtnis. Der Einstieg kostet nichts.',
            'For every developer, not just Amélie contributors: the repo is a complete, small example of an orchestration with three discovery engines, a reviewer, a packer and a single writer for the shared memory. Getting started costs nothing.'
          )}
        </p>
        <ol className="grid gap-3 md:grid-cols-2">
          {AI_STARTER_STEPS.map((st, i) => (
            <li key={i} className="rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-4 shadow-xs space-y-1.5">
              <h5 className="font-bold text-[var(--m-ink)]">{isEs ? CREDITS_ES.stepTitles[i] ?? st.titleEn : L(st.titleDe, st.titleEn)}</h5>
              <p className="text-sm text-[var(--m-ink-2)] leading-relaxed">{L(st.bodyDe, st.bodyEn)}</p>
              {st.command && <code className="block rounded-lg bg-[var(--m-bg-2)] border border-[var(--m-line)] px-3 py-2 text-xs font-typewriter text-[var(--m-ink)] overflow-x-auto">{st.command}</code>}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h4 className="font-amelie text-lg font-bold text-[var(--m-ink)]">{L('Hindernisse, die vorab zu klären sind', 'Blockers to clear first')}</h4>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {AI_CREDIT_BLOCKERS.map((b) => (
            <article key={b.id} className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 space-y-1">
              <h5 className="font-bold text-amber-950">{isEs ? CREDITS_ES.blockers[b.id] ?? b.titleEn : L(b.titleDe, b.titleEn)}</h5>
              <p className="leading-relaxed">{L(b.bodyDe, b.bodyEn)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2"><CalendarClock className="w-4 h-4 text-[var(--m-accent)]" /><h4 className="font-amelie text-lg font-bold text-[var(--m-ink)]">{L('Termine', 'Dates')}</h4></div>
          <ul className="space-y-2 text-sm text-[var(--m-ink-2)]">
            {AI_CREDIT_DATES.map((d) => (
              <li key={d.date}><span className="font-typewriter font-bold text-[var(--m-ink)]">{d.date}</span> · {isEs ? CREDITS_ES.dates[d.date] ?? d.labelEn : L(d.labelDe, d.labelEn)}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2"><ListChecks className="w-4 h-4 text-[var(--m-accent)]" /><h4 className="font-amelie text-lg font-bold text-[var(--m-ink)]">{L('Nächste Schritte', 'Next steps')}</h4></div>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-[var(--m-ink-2)]">
            {AI_CREDIT_STEPS.map((s, i) => (<li key={i}>{isEs ? CREDITS_ES.steps[i] ?? s.en : L(s.de, s.en)}</li>))}
          </ol>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-[var(--m-accent)]" /><h4 className="font-amelie text-lg font-bold text-[var(--m-ink)]">{L('Offene Fragen, die den Rat ändern', 'Open questions that change the advice')}</h4></div>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--m-ink-2)]">
          {AI_CREDIT_QUESTIONS.map((q, i) => (<li key={i}>{L(q.de, q.en)}</li>))}
        </ul>
      </section>
    </div>
  );
};

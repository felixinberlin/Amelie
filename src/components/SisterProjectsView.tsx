import React, { useMemo, useState } from 'react';
import { Search, ExternalLink, Mail, Github, MessageCircle, FileText, Globe, Users, CalendarDays, ChevronDown, ChevronUp, Heart, ShieldCheck, AlertTriangle, Library } from 'lucide-react';
import { Language } from '../types';
import {
  SISTER_PROJECTS,
  SISTER_GROUPS,
  SISTER_APPROACHES,
  SISTER_ETIQUETTE,
  SISTER_LESSONS,
  SisterGroup,
  SisterContact,
  SisterContactKind,
  SisterProject,
  SisterStatus,
} from '../data/sisterProjects';

interface SisterProjectsViewProps {
  lang: Language;
}

const STATUS_STYLE: Record<SisterStatus, { cls: string; de: string; en: string }> = {
  active: { cls: 'bg-[#d1fae5] text-[#064e3b] border-[#34d399]', de: 'Aktiv', en: 'Active' },
  rebooted: { cls: 'bg-[#dbeafe] text-[#1e3a8a] border-[#60a5fa]', de: 'Beendet, Neustart 2025', en: 'Ended, restarted 2025' },
  ended: { cls: 'bg-[#e7e5e4] text-[#57534e] border-[#d6d3d1]', de: 'Beendet', en: 'Ended' },
  dormant: { cls: 'bg-[#fde68a] text-[#78350f] border-[#f59e0b]', de: 'Ruhend', en: 'Dormant' },
};

const CONTACT_ICON: Record<SisterContactKind, React.ElementType> = {
  email: Mail,
  form: FileText,
  web: Globe,
  forum: MessageCircle,
  github: Github,
  social: Users,
  meetup: CalendarDays,
};

const contactHref = (c: SisterContact) => (c.kind === 'email' ? `mailto:${c.value}` : c.value);

export const SisterProjectsView: React.FC<SisterProjectsViewProps> = ({ lang }) => {
  const isDe = lang === 'de';
  const L = (de: string, en: string) => (isDe ? de : en);
  const [group, setGroup] = useState<SisterGroup | 'all'>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SISTER_PROJECTS.filter((p) => {
      if (group !== 'all' && p.group !== group) return false;
      if (!q) return true;
      const hay = [p.name, p.place, p.taglineDe, p.taglineEn, p.whatDe, p.whatEn, p.lessonDe, p.lessonEn]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [group, query]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: SISTER_PROJECTS.length };
    SISTER_PROJECTS.forEach((p) => {
      m[p.group] = (m[p.group] || 0) + 1;
    });
    return m;
  }, []);

  const approachLabel = (p: SisterProject) => {
    const a = SISTER_APPROACHES.find((x) => x.id === p.approach);
    return a ? L(a.de, a.en) : '';
  };

  return (
    <div className="space-y-6" data-testid="sister-projects-view">
      <section className="rounded-2xl border border-[var(--m-line-strong)] bg-gradient-to-br from-[#fcf7ee] to-[#f4e8d3] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-[var(--m-accent)] mb-2">
          <Heart className="w-5 h-5" />
          <h2 className="font-amelie text-xl sm:text-2xl font-bold text-[var(--m-ink)]">
            {L('Die Verwandten: Schwesterprojekte und wie man sie erreicht', 'The relatives: sister projects and how to reach them')}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[var(--m-ink-2)] max-w-3xl leading-relaxed">
          {L(
            'Amélie ist nicht allein. Hier steht, was die nächsten Verwandten tun (Geschenk, Public Domain, offene Baupläne, Ideenbanken, Rechts-Werkzeuge), was Amélie von ihnen lernt und auf welchem Weg sie erreichbar sind. Stand 01.10.2026. Alle Kontakte sind recherchiert, nichts wurde versendet.',
            'Amélie is not alone. This page shows what the closest relatives do (gift, public domain, open blueprints, idea banks, legal tools), what Amélie learns from them and how to reach them. As of 1 Oct 2026. All contacts are researched, nothing has been sent.'
          )}
        </p>
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <ul className="space-y-1.5 leading-relaxed list-disc pl-4">
            {SISTER_ETIQUETTE.map((e, i) => (
              <li key={i}>{L(e.de, e.en)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label={L('Filter', 'Filter')} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', de: 'Alle', en: 'All' }, ...SISTER_GROUPS].map((g) => {
            const active = group === g.id;
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={active}
                onClick={() => setGroup(g.id as SisterGroup | 'all')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  active
                    ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)] border-[var(--m-accent-strong)]'
                    : 'bg-[var(--m-bg)] text-[var(--m-ink-2)] border-[var(--m-line-strong)] hover:border-[var(--m-accent)]/50'
                }`}
              >
                {L(g.de, g.en)} <span className="opacity-70">({counts[g.id] || 0})</span>
              </button>
            );
          })}
        </div>
        {group !== 'all' && (
          <p className="text-xs sm:text-sm text-[var(--m-ink-2)]">
            {(() => {
              const g = SISTER_GROUPS.find((x) => x.id === group);
              return g ? L(g.hintDe, g.hintEn) : '';
            })()}
          </p>
        )}
        <label className="relative block max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={L('Projekt, Ort oder Begriff suchen', 'Search project, place or term')}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] text-sm text-[var(--m-ink)]"
          />
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {visible.length === 0 && (
          <p className="text-sm text-[var(--m-muted)]">{L('Keine Treffer.', 'No matches.')}</p>
        )}
        {visible.map((p) => {
          const st = STATUS_STYLE[p.status];
          const isOpen = open === p.id;
          const grp = SISTER_GROUPS.find((g) => g.id === p.group);
          return (
            <article
              key={p.id}
              id={`relative-${p.id}`}
              className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-4 sm:p-5 shadow-xs flex flex-col gap-3"
            >
              <header className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-typewriter">
                  <span className={`px-2 py-0.5 rounded border ${st.cls}`}>{L(st.de, st.en)}</span>
                  {grp && <span className="px-2 py-0.5 rounded border border-[var(--m-line-strong)] text-[var(--m-ink-2)]">{L(grp.de, grp.en)}</span>}
                  <span className="text-[var(--m-muted)]">{p.place} · {p.founded}</span>
                </div>
                <h3 className="font-amelie text-lg font-bold text-[var(--m-ink)]">{p.name}</h3>
                <p className="text-sm text-[var(--m-ink-2)] leading-relaxed">{L(p.taglineDe, p.taglineEn)}</p>
              </header>

              <div className="rounded-lg bg-[var(--m-bg-2)] border border-[var(--m-line)] p-3 text-xs sm:text-sm text-[var(--m-ink-2)] leading-relaxed">
                <p className="font-bold text-[var(--m-ink)] mb-1">{L('Haltung beim Kontakt', 'Stance when in contact')}: {approachLabel(p)}</p>
                <p>{L(p.approachDe, p.approachEn)}</p>
              </div>

              <ul className="space-y-1.5" aria-label={L('Kontaktwege', 'Contact routes')}>
                {p.contacts.map((c, i) => {
                  const Icon = CONTACT_ICON[c.kind];
                  return (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <Icon className="w-4 h-4 mt-0.5 text-[var(--m-accent)] shrink-0" />
                      <div className="min-w-0">
                        <a
                          href={contactHref(c)}
                          target={c.kind === 'email' ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          className="font-semibold text-[var(--m-accent)] hover:underline break-all"
                        >
                          {c.kind === 'email' ? c.value : c.value.replace(/^https?:\/\//, '')}
                          {c.kind !== 'email' && <ExternalLink className="inline w-3 h-3 ml-1" />}
                        </a>
                        <span className="block text-[var(--m-muted)]">
                          {L(c.labelDe, c.labelEn)}
                          {' · '}
                          {c.verified ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-700"><ShieldCheck className="w-3 h-3" />{L('Seite gelesen', 'page read')}</span>
                          ) : (
                            <span className="text-amber-700">{L('nur Schnipsel, prüfen', 'snippet only, verify')}</span>
                          )}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : p.id)}
                aria-expanded={isOpen}
                className="self-start inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--m-accent)] cursor-pointer"
              >
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isOpen ? L('Dossier einklappen', 'Collapse dossier') : L('Dossier: was sie tun, Lehre für Amélie', 'Dossier: what they do, lesson for Amélie')}
              </button>

              {isOpen && (
                <div className="space-y-3 text-xs sm:text-sm text-[var(--m-ink-2)] leading-relaxed border-t border-[var(--m-line)] pt-3">
                  <div>
                    <h4 className="font-bold text-[var(--m-ink)] mb-0.5">{L('Was sie tun', 'What they do')}</h4>
                    <p>{L(p.whatDe, p.whatEn)}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--m-ink)] mb-0.5">{L('Modell, Lizenz, Größe', 'Model, licence, scale')}</h4>
                    <p>{L(p.modelDe, p.modelEn)}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--m-ink)] mb-0.5">{L('Warum Schwester, wo sich Amélie unterscheidet', 'Why a sister, where Amélie differs')}</h4>
                    <p>{L(p.kinshipDe, p.kinshipEn)}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--m-ink)] mb-0.5">{L('Was Amélie lernt', 'What Amélie learns')}</h4>
                    <p>{L(p.lessonDe, p.lessonEn)}</p>
                  </div>
                  <p className="text-[11px] font-typewriter text-[var(--m-muted)]">
                    {L('Evidenz', 'Evidence')}: {p.evidence === 'read' ? L('Seite gelesen', 'page read') : L('Suchschnipsel', 'search snippet')} · {L('geprüft', 'checked')} {p.checked}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Library className="w-5 h-5 text-[var(--m-accent)]" />
          <h3 className="font-amelie text-lg font-bold text-[var(--m-ink)]">{L('Fünf Lehren aus der Verwandtschaft', 'Five lessons from the kinship')}</h3>
        </div>
        <ol className="space-y-3 list-decimal pl-5 text-sm text-[var(--m-ink-2)] leading-relaxed">
          {SISTER_LESSONS.map((x, i) => (
            <li key={i}>
              <span className="font-bold text-[var(--m-ink)]">{L(x.titleDe, x.titleEn)}.</span> {L(x.bodyDe, x.bodyEn)}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-[var(--m-muted)]">
          {L(
            'Negativbefund: Kein Projekt gefunden, das Ideen an benannte Personen mit Mandat verschenkt und dazu ein lauffähiges Skelett unter CC0 liefert. Das stützt Befund 1 der Landschaft, beruht aber nur auf Suchschnipseln. Ausführlich: `02-recherche/amelie-verwandte-dossier.md`.',
            'Negative finding: no project found that gifts ideas to named people with a mandate and ships a runnable skeleton under CC0. This supports finding 1 of the landscape, but rests on search snippets only. In full: `02-recherche/amelie-verwandte-dossier.md`.'
          )}
        </p>
      </section>
    </div>
  );
};

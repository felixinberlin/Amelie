import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Flower2, ScrollText, Sprout, Search, BookOpen, ExternalLink, X, Moon } from 'lucide-react';
import { DiscardedItem, Language, Todesursache, Fundweg, Herkunft, Killerart } from '../types';
import { getLocalizedTitle } from '../i18n';
import {
  friedhofMuster,
  nachTodesdatum,
  formatTodesdatum,
  URSACHE,
  KILLER,
  FUNDWEG,
  HERKUNFT,
  STADIUM,
  Zaehlung,
} from '../utils/friedhof';

interface DiscardedGalleryProps {
  discarded: DiscardedItem[];
  lang: Language;
}

const REPO_BLOB = 'https://github.com/felixinberlin/Amelie/blob/main/';

type Filter =
  | { kind: 'cause'; key: Todesursache }
  | { kind: 'foundBy'; key: Fundweg }
  | { kind: 'origin'; key: Herkunft }
  | { kind: 'killer'; key: Killerart }
  | null;

function tx(lang: Language, de: string, en: string, es: string) {
  return lang === 'de' ? de : lang === 'es' ? es : en;
}

/** Eine Zeile im Musterfeld: Balken, Zahl, klickbar als Filter. */
function MusterBlock<K extends string>({
  title,
  hint,
  rows,
  label,
  active,
  onPick,
}: {
  title: string;
  hint: string;
  rows: Zaehlung<K>[];
  label: (k: K) => string;
  active: K | null;
  onPick: (k: K) => void;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="space-y-2.5">
      <div>
        <h4 className="text-[11px] font-mono-code uppercase tracking-[0.14em] text-stone-400">{title}</h4>
        <p className="text-[11px] text-stone-500 leading-snug mt-0.5">{hint}</p>
      </div>
      <ul className="space-y-1.5">
        {rows.map((r) => {
          const on = active === r.key;
          return (
            <li key={r.key}>
              <button
                type="button"
                onClick={() => onPick(r.key)}
                aria-pressed={on}
                className={`group w-full text-left rounded-md px-1.5 py-1 transition-colors ${
                  on ? 'bg-amber-200/10 ring-1 ring-amber-300/50' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className={on ? 'text-amber-100' : 'text-stone-200'}>{label(r.key)}</span>
                  <span className="font-mono-code tabular-nums text-stone-400">{r.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-stone-700/70 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${on ? 'bg-amber-300' : 'bg-stone-400 group-hover:bg-stone-300'}`}
                    style={{ width: `${(r.count / max) * 100}%` }}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Der Totenschein, als Dialog über dem Gräberfeld. */
function Totenschein({ item, lang, onClose }: { item: DiscardedItem; lang: Language; onClose: () => void }) {
  const de = lang === 'de';
  const cause = URSACHE[item.cause];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  // Portal: der Seitencontainer animiert mit transform, und darin wäre `fixed`
  // nicht am Fenster, sondern am Container ausgerichtet.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-[2px] p-0 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`totenschein-${item.id}`}
    >
      <div
        className="relative w-full sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#fdfbf7] border border-stone-300 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-stone-200 bg-[#fdfbf7]/95 backdrop-blur px-5 py-4">
          <div>
            <p className="text-[11px] font-mono-code uppercase tracking-[0.14em] text-stone-500">
              {tx(lang, 'Totenschein', 'Death certificate', 'Certificado de defunción')} · † {formatTodesdatum(item.diedOn, lang)}
            </p>
            <h3 id={`totenschein-${item.id}`} className="mt-1 font-serif-title text-xl font-bold text-stone-900">
              {getLocalizedTitle(item, lang)}
            </h3>
            <p className="mt-0.5 font-serif-title italic text-sm text-stone-600">„{de ? cause.stoneDe : cause.stoneEn}"</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-stone-500 hover:bg-stone-200/70 hover:text-stone-900" aria-label={tx(lang, 'Schließen', 'Close', 'Cerrar')}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 text-sm space-y-3">
          <div>
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-stone-500">{tx(lang, 'Die Idee', 'The idea', 'La idea')}</span>
            <p className="mt-0.5 font-serif-title italic text-stone-800">„{de ? item.originalIdeaDe : item.originalIdeaEn}"</p>
          </div>
          <div className="rounded-lg bg-stone-100/80 border border-stone-200 p-3">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-stone-600">{tx(lang, 'Todesursache', 'Cause of death', 'Causa de muerte')}</span>
            <p className="mt-0.5 text-stone-800 leading-relaxed">{de ? item.whyDiscardedDe : item.whyDiscardedEn}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <dt className="text-stone-500">{tx(lang, 'Wer sie hatte', 'Who had it', 'Quién la tenía')}</dt>
            <dd className="text-stone-800">{KILLER[item.killer][lang]}</dd>
            <dt className="text-stone-500">{tx(lang, 'Gefunden durch', 'Found by', 'Hallada por')}</dt>
            <dd className="text-stone-800">{FUNDWEG[item.foundBy][lang]}</dd>
            <dt className="text-stone-500">{tx(lang, 'Herkunft', 'Origin', 'Origen')}</dt>
            <dd className="text-stone-800">{HERKUNFT[item.origin][lang]}</dd>
            <dt className="text-stone-500">{tx(lang, 'Kam bis', 'Got as far as', 'Llegó hasta')}</dt>
            <dd className="text-stone-800">{STADIUM[item.stage][lang]}</dd>
            <dt className="text-stone-500">{tx(lang, 'Feld', 'Field', 'Campo')}</dt>
            <dd className="text-stone-800">{item.domain}</dd>
          </dl>
          {item.evidence.length > 0 && (
            <div>
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-stone-500">{tx(lang, 'Belege', 'Evidence', 'Pruebas')}</span>
              <ul className="mt-1 text-xs text-stone-700 list-disc list-inside space-y-0.5">
                {item.evidence.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-2 text-xs text-stone-700 bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5">
            <BookOpen className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-800" />
            <p>
              <span className="font-semibold text-stone-900">{tx(lang, 'Lehre: ', 'Lesson: ', 'Lección: ')}</span>
              {de ? item.lessonDe : item.lessonEn}
            </p>
          </div>
          <div className="flex gap-2 text-xs text-stone-700 bg-emerald-50/60 border border-emerald-200/70 rounded-lg p-2.5">
            <Sprout className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-800" />
            <p>
              <span className="font-semibold text-stone-900">{tx(lang, 'Auferstehung, wenn: ', 'Resurrect if: ', 'Resucita si: ')}</span>
              {de ? item.resurrectIfDe : item.resurrectIfEn}
            </p>
          </div>
          {item.nachruf && (
            <a
              href={REPO_BLOB + item.nachruf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2"
            >
              <ExternalLink className="w-3 h-3" />
              {item.nachruf.includes('grabbeigaben')
                ? tx(lang, 'Grabbeigabe: die Dose, wie sie war', 'Grave good: the tin as it was', 'Ofrenda: la lata tal como era')
                : tx(lang, 'Nachruf lesen', 'Read the obituary', 'Leer el obituario')}
            </a>
          )}
                </div>
      </div>
    </div>,
    document.body
  );
}

/** Ein Grabstein. Oben gewölbt, unten Gras; der Totenschein klappt darunter auf. */
function Grabstein({ item, lang, onOpen }: { item: DiscardedItem; lang: Language; onOpen: () => void }) {
  const cause = URSACHE[item.cause];
  const late = item.stage !== 'kandidat';
  const title = getLocalizedTitle(item, lang);
  const de = lang === 'de';

  return (
    <article className="flex flex-col" id={`grab-${item.id}`}>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="group relative text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-t-[50%_30%]"
      >
        <div
          className="relative mx-auto w-full border border-stone-300 bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300/90 px-5 pt-9 pb-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-10px_24px_rgba(68,64,60,0.12),0_10px_18px_-12px_rgba(28,25,23,0.45)] transition-transform duration-300 group-hover:-translate-y-0.5"
          style={{ borderTopLeftRadius: '50% 30%', borderTopRightRadius: '50% 30%' }}
        >
          {late && (
            <span
              className="absolute top-3 right-4 inline-flex items-center gap-1 text-[10px] font-mono-code uppercase tracking-wider text-rose-800/80"
              title={tx(lang, 'Starb erst als Dose oder Mail — ein teurer Tod', 'Died only after becoming a tin or mail — an expensive death', 'Murió ya como lata o correo — una muerte cara')}
            >
              <Flower2 className="w-3 h-3" />
              {STADIUM[item.stage][lang]}
            </span>
          )}
          <svg viewBox="0 0 12 18" className="mx-auto h-5 w-auto text-stone-400/90" aria-hidden>
            <path d="M5 0h2v5h5v2H7v11H5V7H0V5h5z" fill="currentColor" />
          </svg>
          <h3 className="mt-2 font-serif-title text-lg sm:text-xl font-bold text-stone-800 leading-tight [text-shadow:0_1px_0_rgba(255,255,255,0.8)]">
            {title}
          </h3>
          <p className="mt-1.5 text-[11px] font-mono-code text-stone-500 tracking-wide">
            {item.bornIn} · <span className="whitespace-nowrap">† {formatTodesdatum(item.diedOn, lang)}</span>
          </p>
          <p className="mt-3 font-serif-title italic text-sm text-stone-700 [text-shadow:0_1px_0_rgba(255,255,255,0.7)]">
            „{de ? cause.stoneDe : cause.stoneEn}"
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-[10px] font-mono-code uppercase tracking-wide">
            <span className="rounded-full border border-stone-400/60 bg-white/40 px-2 py-0.5 text-stone-700">{cause[lang]}</span>
            <span className="rounded-full border border-stone-400/40 bg-white/25 px-2 py-0.5 text-stone-600">{FUNDWEG[item.foundBy][lang]}</span>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-[11px] text-stone-500 group-hover:text-stone-800">
            <ScrollText className="w-3.5 h-3.5" />
            {tx(lang, 'Totenschein lesen', 'Read death certificate', 'Leer certificado')}
          </span>
        </div>
        {/* Grasnarbe */}
        <div className="h-3 -mt-px rounded-b-md bg-gradient-to-b from-emerald-800/70 to-emerald-900/80" aria-hidden />
      </button>

    </article>
  );
}

export const DiscardedGallery: React.FC<DiscardedGalleryProps> = ({ discarded, lang }) => {
  const muster = useMemo(() => friedhofMuster(discarded), [discarded]);
  const [filter, setFilter] = useState<Filter>(null);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = <K extends string>(kind: NonNullable<Filter>['kind'], key: K) =>
    setFilter((f) => (f && f.kind === kind && f.key === key ? null : ({ kind, key } as Filter)));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nachTodesdatum(discarded).filter((d) => {
      if (filter) {
        const v = filter.kind === 'cause' ? d.cause : filter.kind === 'foundBy' ? d.foundBy : filter.kind === 'origin' ? d.origin : d.killer;
        if (v !== filter.key) return false;
      }
      if (!q) return true;
      return [d.title, d.originalIdeaDe, d.originalIdeaEn, d.whyDiscardedDe, d.domain, ...d.evidence].some((s) => s.toLowerCase().includes(q));
    });
  }, [discarded, filter, query]);

  const filterLabel = filter
    ? filter.kind === 'cause'
      ? URSACHE[filter.key][lang]
      : filter.kind === 'foundBy'
      ? FUNDWEG[filter.key][lang]
      : filter.kind === 'origin'
      ? HERKUNFT[filter.key][lang]
      : KILLER[filter.key][lang]
    : null;

  const anteilOhneSuche = muster.dokumentierteFundwege
    ? Math.round((muster.ohneNeueSuche / muster.dokumentierteFundwege) * 100)
    : 0;

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto">
      {/* Nachthimmel über dem Friedhof */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c1a24] via-[#23212b] to-[#2a2a26] text-stone-200 border border-stone-800 shadow-md">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,.7) 50%, transparent 51%), radial-gradient(1px 1px at 34% 8%, rgba(255,255,255,.5) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 71% 22%, rgba(255,255,255,.6) 50%, transparent 51%), radial-gradient(1px 1px at 86% 12%, rgba(255,255,255,.5) 50%, transparent 51%), radial-gradient(1px 1px at 55% 30%, rgba(255,255,255,.35) 50%, transparent 51%), radial-gradient(1px 1px at 22% 40%, rgba(255,255,255,.3) 50%, transparent 51%)',
          }}
        />
        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-600 bg-white/5 px-3 py-1 text-[11px] font-mono-code uppercase tracking-[0.16em] text-stone-300">
              <Moon className="w-3.5 h-3.5 text-amber-200" />
              08-friedhof
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-50 tracking-tight">
              {tx(lang, 'Der Friedhof', 'The Graveyard', 'El cementerio')}
            </h2>
            <p className="font-serif-title italic text-lg text-amber-100/90">
              {tx(
                lang,
                'Ein Friedhof ist kein Portfolio. Er ist ein Obduktionssaal.',
                'A graveyard is not a portfolio. It is an autopsy room.',
                'Un cementerio no es un portafolio. Es una sala de autopsias.'
              )}
            </p>
            <p className="text-sm text-stone-300 leading-relaxed max-w-prose">
              {tx(
                lang,
                'Jede Idee, die gestorben ist, liegt hier mit Totenschein: woran sie starb, wer sie schon hatte, welche Suche es herausfand und wie weit sie kam. Einzeln sind das Anekdoten. Zusammen zeigen sie, wo die Methode blind ist.',
                'Every idea that died lies here with a death certificate: what killed it, who already had it, which search found out and how far it got. One by one these are anecdotes. Together they show where the method is blind.',
                'Cada idea que murió yace aquí con su certificado: de qué murió, quién ya la tenía, qué búsqueda lo descubrió y hasta dónde llegó. Una a una son anécdotas. Juntas muestran dónde la método está ciega.'
              )}
            </p>
            <dl className="grid grid-cols-3 gap-3 pt-2 max-w-md">
              <div className="rounded-xl border border-stone-700 bg-white/5 p-3">
                <dt className="text-[10px] font-mono-code uppercase tracking-wider text-stone-400">{tx(lang, 'Gräber', 'Graves', 'Tumbas')}</dt>
                <dd className="mt-1 text-2xl font-bold text-stone-50 tabular-nums">{muster.total}</dd>
              </div>
              <div className="rounded-xl border border-stone-700 bg-white/5 p-3">
                <dt className="text-[10px] font-mono-code uppercase tracking-wider text-stone-400">{tx(lang, 'Teure Tode', 'Costly deaths', 'Muertes caras')}</dt>
                <dd className="mt-1 text-2xl font-bold text-rose-200 tabular-nums">{muster.spaete}</dd>
              </div>
              <div className="rounded-xl border border-stone-700 bg-white/5 p-3">
                <dt className="text-[10px] font-mono-code uppercase tracking-wider text-stone-400">{tx(lang, 'Ohne Suche', 'No search', 'Sin búsqueda')}</dt>
                <dd className="mt-1 text-2xl font-bold text-amber-200 tabular-nums">{anteilOhneSuche}%</dd>
              </div>
            </dl>
            <p className="text-[11px] text-stone-500 max-w-md">
              {tx(
                lang,
                '„Teure Tode": starben erst als Dose oder Mail-Entwurf. „Ohne Suche": vom eigenen Atlas, Protokoll oder einem Reality-Check getötet — Anteil an den dokumentierten Fundwegen.',
                '"Costly deaths": died only as a tin or mail draft. "No search": killed by the own atlas, log or a reality check — share of documented discoveries.',
                '"Muertes caras": murieron ya como lata o borrador de correo. "Sin búsqueda": las mató el propio atlas, registro o un choque con la realidad.'
              )}
            </p>
          </div>

          {/* Muster */}
          <div className="grid gap-6 sm:grid-cols-2 rounded-2xl border border-stone-700/80 bg-black/20 p-5">
            <MusterBlock
              title={tx(lang, 'Woran sie starben', 'What killed them', 'De qué murieron')}
              hint={tx(lang, 'Todesursache', 'Cause of death', 'Causa')}
              rows={muster.ursache}
              label={(k) => URSACHE[k][lang]}
              active={filter?.kind === 'cause' ? filter.key : null}
              onPick={(k) => toggle('cause', k)}
            />
            <MusterBlock
              title={tx(lang, 'Welche Suche traf', 'Which search hit', 'Qué búsqueda acertó')}
              hint={tx(lang, 'Das Muster für die Suchreihenfolge', 'The pattern for search order', 'El patrón para el orden de búsqueda')}
              rows={muster.fundweg}
              label={(k) => FUNDWEG[k][lang]}
              active={filter?.kind === 'foundBy' ? filter.key : null}
              onPick={(k) => toggle('foundBy', k)}
            />
            <MusterBlock
              title={tx(lang, 'Woher sie kamen', 'Where they came from', 'De dónde venían')}
              hint={tx(lang, 'Welche Ideenquelle liefert Tote', 'Which idea source produces dead ones', 'Qué fuente produce muertas')}
              rows={muster.herkunft}
              label={(k) => HERKUNFT[k][lang]}
              active={filter?.kind === 'origin' ? filter.key : null}
              onPick={(k) => toggle('origin', k)}
            />
            <MusterBlock
              title={tx(lang, 'Wer sie schon hatte', 'Who already had them', 'Quién ya las tenía')}
              hint={tx(lang, 'Art des Vorgängers', 'Kind of predecessor', 'Tipo de predecesor')}
              rows={muster.killer}
              label={(k) => KILLER[k][lang]}
              active={filter?.kind === 'killer' ? filter.key : null}
              onPick={(k) => toggle('killer', k)}
            />
          </div>
        </div>
      </section>

      {/* Suche und aktiver Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tx(lang, 'Grab suchen (Idee, Killer, Feld) …', 'Search graves (idea, killer, field) …', 'Buscar tumba …')}
            className="w-full rounded-xl border border-stone-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
          />
        </label>
        {filterLabel && (
          <button
            type="button"
            onClick={() => setFilter(null)}
            className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 text-stone-50 px-3 py-1.5 text-xs"
          >
            {filterLabel}
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <span className="text-xs text-stone-500 ml-auto">
          {tx(lang, `${visible.length} von ${discarded.length} Gräbern · neueste zuerst`, `${visible.length} of ${discarded.length} graves · newest first`, `${visible.length} de ${discarded.length} tumbas`)}
        </span>
      </div>

      {/* Gräberfeld */}
      <section className="relative rounded-3xl bg-gradient-to-b from-[#f4f1e8] to-[#e9eadf] border border-stone-200 px-4 sm:px-8 pt-10 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 items-start">
          {visible.map((item) => (
            <Grabstein
              key={item.id}
              item={item}
              lang={lang}
              onOpen={() => setOpenId(item.id)}
            />
          ))}
        </div>
        {visible.length === 0 && (
          <p className="text-center text-sm text-stone-500 py-10">
            {tx(lang, 'Hier liegt niemand, der zu dieser Suche passt.', 'Nobody here matches this search.', 'Nadie aquí coincide con esta búsqueda.')}
          </p>
        )}
      </section>

      {openId && discarded.find((d) => d.id === openId) && (
        <Totenschein item={discarded.find((d) => d.id === openId)!} lang={lang} onClose={() => setOpenId(null)} />
      )}

      {/* Friedhofsordnung */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          [
            tx(lang, '1 · Trennen', '1 · Separate', '1 · Separar'),
            tx(
              lang,
              'Was stirbt, verlässt die Dosen am selben Tag. Keine Dose mit Warnbanner, keine Mail an einen Toten.',
              'What dies leaves the tins the same day. No tin with a warning banner, no mail to a dead idea.',
              'Lo que muere sale de las latas el mismo día. Ninguna lata con aviso, ningún correo a una muerta.'
            ),
          ],
          [
            tx(lang, '2 · Totenschein', '2 · Death certificate', '2 · Certificado'),
            tx(
              lang,
              'Jedes Grab nennt Ursache, Killer, Fundweg, Herkunft, Stadium, Datum und die Lehre. Ein Grab ohne Ursache ist ein Archiveintrag — und Archive sind verboten.',
              'Every grave names cause, killer, discovery, origin, stage, date and the lesson. A grave without a cause is an archive entry — and archives are forbidden.',
              'Cada tumba nombra causa, responsable, hallazgo, origen, etapa, fecha y lección. Una tumba sin causa es un archivo — y los archivos están prohibidos.'
            ),
          ],
          [
            tx(lang, '3 · Keine Wiedergänger', '3 · No revenants', '3 · Sin resucitados'),
            tx(
              lang,
              'Ein Grab wird nur geöffnet, wenn die Auferstehungsbedingung eingetreten ist. Vor jeder neuen Idee: erst über den Friedhof gehen.',
              'A grave is opened only when its resurrection condition has occurred. Before any new idea: walk through the graveyard first.',
              'Una tumba solo se abre si se cumple su condición. Antes de cada idea nueva: primero pasar por el cementerio.'
            ),
          ],
        ].map(([h, p]) => (
          <div key={h} className="rounded-2xl border border-stone-200 bg-[#fdfbf7] p-5">
            <h4 className="font-serif-title font-bold text-stone-900">{h}</h4>
            <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">{p}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

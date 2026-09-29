import React, { useMemo, useState } from 'react';
import { Gamepad2, Gift, Search, Sparkles, ArrowRight, Puzzle, Play, Lightbulb } from 'lucide-react';
import { CandidateIdea, DoseItem, Language } from '../types';
import { GAME_IDEAS } from '../data/ideas/games';
import { GAME_DOSE_IDS } from '../data/pipeline';
import { getLocalizedTitle } from '../i18n';
import { GrainSackZenGame } from './GrainSackZenGame';
import { TravelingGnomeGame } from './TravelingGnomeGame';
import { PhotoboothAlbumGame } from './PhotoboothAlbumGame';

interface GamesViewProps {
  lang: Language;
  dosen: DoseItem[];
  onOpenDose: (doseId: string) => void;
}

type PlayableId = 'grain' | 'gnome' | 'photobooth';

const PLAYABLES: Array<{
  id: PlayableId;
  emoji: string;
  de: string;
  en: string;
  es: string;
  Component: React.FC<{ lang: Language }>;
}> = [
  { id: 'grain', emoji: '🌾', de: 'Hand im Getreidesack', en: 'Hand in the Grain Sack', es: 'Mano en el saco de grano', Component: GrainSackZenGame },
  { id: 'gnome', emoji: '🧙', de: 'Der reisende Gartenzwerg', en: 'The Traveling Gnome', es: 'El gnomo viajero', Component: TravelingGnomeGame },
  { id: 'photobooth', emoji: '📸', de: 'Ninos Fotoautomaten-Album', en: "Nino's Photobooth Album", es: 'El álbum del fotomatón de Nino', Component: PhotoboothAlbumGame },
];

const pick = (lang: Language, de: string, en: string, es: string) => (lang === 'de' ? de : lang === 'es' ? es : en);

export const GamesView: React.FC<GamesViewProps> = ({ lang, dosen, onOpenDose }) => {
  const [query, setQuery] = useState('');
  const [activePlayable, setActivePlayable] = useState<PlayableId | null>(null);
  const q = query.trim().toLowerCase();

  const gameDosen = useMemo(
    () => GAME_DOSE_IDS.map((id) => dosen.find((d) => d.id === id)).filter((d): d is DoseItem => Boolean(d)),
    [dosen]
  );

  const doseText = (d: DoseItem) => ({
    title: lang === 'de' ? d.title : d.titleEn || d.title,
    oneLiner: lang === 'de' ? d.oneLinerDe : lang === 'es' ? d.oneLinerEs || d.oneLinerEn : d.oneLinerEn,
  });

  const shownDosen = gameDosen.filter((d) => {
    if (!q) return true;
    const t = doseText(d);
    return `${t.title} ${t.oneLiner} ${(d.tags || []).join(' ')}`.toLowerCase().includes(q);
  });

  const ideaText = (i: CandidateIdea) => ({
    title: getLocalizedTitle(i, lang) || i.title,
    concept: lang === 'de' ? i.conceptDe : i.conceptEn,
    recipient: lang === 'de' ? i.recipientDe : i.recipientEn,
    ticket: lang === 'de' ? i.firstStepTicketDe : i.firstStepTicketEn,
  });

  const shownIdeas = GAME_IDEAS.filter((i) => {
    if (!q) return true;
    const t = ideaText(i);
    return `${t.title} ${t.concept} ${t.recipient} ${(i.tags || []).join(' ')}`.toLowerCase().includes(q);
  });

  const shownPlayables = PLAYABLES.filter((p) => !q || `${p.de} ${p.en} ${p.es}`.toLowerCase().includes(q));
  const total = PLAYABLES.length + gameDosen.length + GAME_IDEAS.length;
  const Active = PLAYABLES.find((p) => p.id === activePlayable);

  return (
    <div id="games-view" className="space-y-8 pb-16">
      <div className="bg-gradient-to-br from-[#f8f5ee] to-[#f4efe4] border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200/80">
          <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
          <span>{pick(lang, `${total} Spiele & Spielideen`, `${total} games & game ideas`, `${total} juegos e ideas de juego`)}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">Games</h1>
        <p className="text-sm sm:text-base text-stone-700 max-w-3xl leading-relaxed">
          {pick(
            lang,
            'Alle Spielideen an einem Ort: sofort Spielbares, Spiele, die schon als Dose verpackt sind, und Ideen, die noch auf ein Ticket 01 warten.',
            'Every game idea in one place: playable now, already packed as Tins, and ideas still waiting for a Ticket 01.',
            'Todas las ideas de juego en un solo lugar: jugables ya, empaquetadas como latas, y las que aún esperan un Ticket 01.'
          )}
        </p>
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="games-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pick(lang, 'Spiele durchsuchen…', 'Search games…', 'Buscar juegos…')}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-2xs"
          />
        </div>
      </div>

      {shownPlayables.length > 0 && (
        <section className="space-y-3" aria-labelledby="games-playable-heading">
          <h2 id="games-playable-heading" className="flex items-center gap-2 text-lg font-serif font-bold text-stone-900">
            <Play className="w-4 h-4 text-[#8c1d40]" />
            {pick(lang, 'Jetzt spielbar', 'Playable now', 'Jugables ahora')} ({shownPlayables.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {shownPlayables.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlayable(activePlayable === p.id ? null : p.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                  activePlayable === p.id
                    ? 'bg-[#8c1d40] text-white border-[#741533] shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-[#8c1d40]/40'
                }`}
              >
                <span className="mr-1.5">{p.emoji}</span>
                {pick(lang, p.de, p.en, p.es)}
              </button>
            ))}
          </div>
          {Active ? (
            <Active.Component lang={lang} />
          ) : (
            <p className="text-xs text-stone-500">
              {pick(lang, 'Wähle ein Spiel, um es zu öffnen.', 'Pick a game to open it.', 'Elige un juego para abrirlo.')}
            </p>
          )}
        </section>
      )}

      {shownDosen.length > 0 && (
        <section className="space-y-3" aria-labelledby="games-dosen-heading">
          <h2 id="games-dosen-heading" className="flex items-center gap-2 text-lg font-serif font-bold text-stone-900">
            <Gift className="w-4 h-4 text-[#8c1d40]" />
            {pick(lang, 'Als Dose verpackt', 'Packed as Tins', 'Empaquetadas como latas')} ({shownDosen.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shownDosen.map((d) => {
              const t = doseText(d);
              return (
                <button
                  key={d.id}
                  onClick={() => onOpenDose(d.id)}
                  className="text-left bg-white border border-stone-200 hover:border-[#8c1d40]/40 rounded-2xl p-5 shadow-2xs transition-all flex flex-col gap-2"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c1d40] font-bold">{d.status}</span>
                  <span className="font-serif text-lg font-bold text-stone-900 leading-snug">{t.title}</span>
                  <span className="text-sm text-stone-700 leading-relaxed line-clamp-4">{t.oneLiner}</span>
                  <span className="mt-auto pt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8c1d40]">
                    {pick(lang, 'Dose öffnen', 'Open Tin', 'Abrir lata')} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {shownIdeas.length > 0 && (
        <section className="space-y-3" aria-labelledby="games-ideas-heading">
          <h2 id="games-ideas-heading" className="flex items-center gap-2 text-lg font-serif font-bold text-stone-900">
            <Lightbulb className="w-4 h-4 text-[#8c1d40]" />
            {pick(lang, 'Spielideen', 'Game ideas', 'Ideas de juego')} ({shownIdeas.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {shownIdeas.map((i) => {
              const t = ideaText(i);
              return (
                <article key={i.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">{i.status}</span>
                    {i.packedDoseId && (
                      <span className="px-2 py-0.5 rounded bg-[#8c1d40]/10 text-[#8c1d40] border border-[#8c1d40]/25 font-semibold">
                        {pick(lang, 'als Dose gepackt', 'packed as Tin', 'ya empaquetada')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">{t.title}</h3>
                  <p className="text-sm text-stone-700 leading-relaxed">{t.concept}</p>
                  <p className="text-xs text-stone-500">
                    <strong>{pick(lang, 'Empfänger: ', 'Recipient: ', 'Destinatario: ')}</strong>
                    {t.recipient}
                  </p>
                  {t.ticket && (
                    <p className="text-xs text-stone-600 flex items-start gap-1.5">
                      <Puzzle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Ticket 01: </strong>
                        {t.ticket}
                      </span>
                    </p>
                  )}
                  {i.packedDoseId && (
                    <button
                      onClick={() => onOpenDose(i.packedDoseId!)}
                      className="mt-auto pt-2 self-start inline-flex items-center gap-1 text-xs font-semibold text-[#8c1d40] hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {pick(lang, 'Dose öffnen', 'Open Tin', 'Abrir lata')}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {q && shownPlayables.length + shownDosen.length + shownIdeas.length === 0 && (
        <p className="text-sm text-stone-500">{pick(lang, 'Keine Treffer.', 'No matches.', 'Sin resultados.')}</p>
      )}
    </div>
  );
};

import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  History,
  Loader2,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Language } from '../types';
import { BookChapter } from '../data/doseBooks';
import {
  getRepoFileUrl,
  getRepoHistoryUrl,
  getRepoRawUrl,
  hasSource,
  loadSource,
} from '../utils/bookSources';
import { patchToHtml } from '../utils/patchHtml';
import { parseBookSlugFromUrl } from '../utils/doseUrl';

interface DoseBookProps {
  chapters: BookChapter[];
  lang: Language;
  /** Kapitel, mit dem geöffnet wird (aus der URL) */
  initialSlug?: string;
  /** Meldet den Kapitelwechsel nach oben, damit die URL mitwandert */
  onChapterChange?: (slug: string) => void;
  chapterHref?: (slug: string) => string;
}

marked.setOptions({ gfm: true, breaks: false });

function ChapterControl({ href, disabled, onClick, className, children, 'aria-current': current }: {
  href?: string; disabled?: boolean; onClick: () => void; className: string;
  children: React.ReactNode; 'aria-current'?: 'page';
}) {
  if (href && !disabled) return <Link to={href} className={className} aria-current={current}>{children}</Link>;
  return <button disabled={disabled} onClick={onClick} className={className} aria-current={current}>{children}</button>;
}

export const DoseBook: React.FC<DoseBookProps> = ({
  chapters,
  lang,
  initialSlug,
  onChapterChange,
  chapterHref,
}) => {
  const location = useLocation();
  const isDe = lang === 'de';
  const isEs = lang === 'es';
  const startIndex = Math.max(
    0,
    chapters.findIndex((c) => c.slug === initialSlug)
  );
  const [localIndex, setIndex] = useState(startIndex);
  const index = chapterHref ? Math.max(0, chapters.findIndex(c => c.slug === parseBookSlugFromUrl())) : localIndex;
  const [html, setHtml] = useState<string>('');
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  const chapter = chapters[index];
  const readable =
    chapter && (chapter.kind === 'md' || chapter.kind === 'patch') && hasSource(chapter.path);
  const isPatch = chapter?.kind === 'patch';

  useEffect(() => {
    if (!chapter) return;
    if (!readable) {
      setHtml('');
      setState('idle');
      return;
    }
    let cancelled = false;
    setState('loading');
    loadSource(chapter.path)
      .then((raw) => {
        if (cancelled) return;
        setHtml(isPatch ? patchToHtml(raw) : (marked.parse(raw) as string));
        setState('idle');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
    // onChapterChange bewusst nicht in den Abhängigkeiten: eine neue
    // Funktionsidentität pro Render würde das Kapitel endlos neu laden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.path, readable, isPatch]);

  const toc = useMemo(
    () =>
      chapters.map((c, i) => ({
        ...c,
        i,
        title: isDe ? c.titleDe : c.titleEn,
        note: isDe ? c.noteDe : c.noteEn,
      })),
    [chapters, isDe]
  );

  if (!chapter) return null;

  return (
    <div className="amelie-tin-box p-0 overflow-hidden">
      {/* Kopf */}
      <div className="amelie-tin-header flex items-center gap-2 px-5 py-3">
        <BookOpen className="w-4 h-4" />
        <span className="font-typewriter text-xs font-bold tracking-wide uppercase">
          {isDe ? 'Das Buch zur Dose' : isEs ? 'El libro de la lata' : 'The book behind the tin'}
        </span>
        <span className="ml-auto font-mono-code text-[11px] opacity-70">
          {index + 1} / {chapters.length}
        </span>
      </div>

      <div className="grid md:grid-cols-[minmax(0,17rem)_1fr]">
        {/* Inhaltsverzeichnis */}
        <nav className="border-b md:border-b-0 md:border-r border-[var(--m-line-strong)] bg-[var(--m-surface-2)] p-3 space-y-1.5">
          {toc.map((c) => {
            const active = c.i === index;
            return (
              <ChapterControl
                key={c.slug}
                href={chapterHref?.(c.slug)}
                onClick={() => { setIndex(c.i); onChapterChange?.(c.slug); }}
                aria-current={active ? 'page' : undefined}
                className={`block w-full text-left px-3 py-2.5 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'bg-white border-[#c9a227] shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-[var(--m-sunk)]'
                }`}
              >
                <div className="flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--m-muted)]" />
                  <div className="min-w-0">
                    <div className="font-typewriter text-xs font-bold text-[var(--m-ink)] leading-snug">
                      {c.title}
                    </div>
                    <div className="font-typewriter text-[11px] text-[var(--m-ink-3)] leading-snug mt-1">
                      {c.note}
                    </div>
                    <div className="font-mono-code text-[10px] text-[#9a8570] mt-1">
                      {c.date}
                      {c.kind === 'pdf' && ' · PDF'}
                      {c.kind === 'patch' && ' · Patch'}
                    </div>
                  </div>
                </div>
              </ChapterControl>
            );
          })}
        </nav>

        {/* Kapitel */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-[var(--m-line)] bg-white/60">
            <a
              href={getRepoFileUrl(chapter.path)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono-code text-[11px] text-[var(--m-ink-2)] hover:text-[#8b1e2f] underline decoration-dotted break-all"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              {chapter.path}
            </a>
            {isPatch && (
              <a
                href={getRepoRawUrl(chapter.path)}
                download
                className="inline-flex items-center gap-1.5 font-typewriter text-[11px] font-bold text-[#8b1e2f] hover:text-[#c94b32] ml-auto"
                title={
                  isDe
                    ? 'Rohdatei herunterladen, dann: git apply <datei>'
                    : isEs ? 'Descargar el archivo y luego: git apply <archivo>' : 'Download the raw file, then: git apply <file>'
                }
              >
                <Download className="w-3 h-3" />
                {isDe ? 'Patch laden' : isEs ? 'Descargar parche' : 'Download patch'}
              </a>
            )}
            <a
              href={getRepoHistoryUrl(chapter.path)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 font-typewriter text-[11px] text-[var(--m-ink-2)] hover:text-[#8b1e2f] ${isPatch ? '' : 'ml-auto'}`}
              title={
                isDe
                  ? 'Commit-Historie: wann was geprüft und was korrigiert wurde'
                  : isEs ? 'Historial de commits: cuándo se comprobó cada afirmación y qué se corrigió' : 'Commit history: when each claim was checked and what was corrected'
              }
            >
              <History className="w-3 h-3" />
              {isDe ? 'Verlauf' : isEs ? 'Historial' : 'History'}
            </a>
          </div>

          <div className="p-5 md:p-7 max-h-[70vh] overflow-y-auto">
            {state === 'loading' && (
              <div className="flex items-center gap-2 font-typewriter text-xs text-[var(--m-ink-3)] py-8">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isDe ? 'Kapitel wird geladen …' : isEs ? 'Cargando capítulo …' : 'Loading chapter …'}
              </div>
            )}

            {state === 'error' && (
              <div className="flex items-start gap-2 font-typewriter text-xs text-[#8b1e2f] py-8">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {isDe
                    ? 'Dieses Kapitel ließ sich nicht laden. Über den Pfad oben liegt es im Repo.'
                    : isEs ? 'No se pudo cargar este capítulo. La ruta de arriba lleva a él en el repositorio.' : 'This chapter could not be loaded. The path above leads to it in the repository.'}
                </span>
              </div>
            )}

            {state === 'idle' && !readable && (
              <div className="font-typewriter text-sm text-[#4a3a2d] py-6 space-y-3">
                <p>
                  {isDe
                    ? 'Dieses Kapitel ist keine Textdatei und wird deshalb nicht hier angezeigt.'
                    : isEs ? 'Este capítulo no es un archivo de texto y por eso no se muestra aquí.' : 'This chapter is not a text file and is therefore not rendered here.'}
                </p>
                <a
                  href={getRepoFileUrl(chapter.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-amelie-or inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {isDe ? 'Im Repo öffnen' : isEs ? 'Abrir en el repositorio' : 'Open in the repository'}
                </a>
              </div>
            )}

            {state === 'idle' && readable && (
              <article
                className="amelie-book-prose"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </div>

          {/* Blättern */}
          <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-[var(--m-line)] bg-[var(--m-surface-2)]">
            <ChapterControl
              href={chapterHref?.(chapters[Math.max(0, index - 1)].slug)}
              onClick={() => { const next = Math.max(0, index - 1); setIndex(next); onChapterChange?.(chapters[next].slug); }}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--m-line-strong)] bg-white font-typewriter text-xs font-bold text-[var(--m-ink-2)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--m-sunk)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {isDe ? 'Voriges' : isEs ? 'Anterior' : 'Previous'}
            </ChapterControl>
            <ChapterControl
              href={chapterHref?.(chapters[Math.min(chapters.length - 1, index + 1)].slug)}
              onClick={() => { const next = Math.min(chapters.length - 1, index + 1); setIndex(next); onChapterChange?.(chapters[next].slug); }}
              disabled={index === chapters.length - 1}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--m-line-strong)] bg-white font-typewriter text-xs font-bold text-[var(--m-ink-2)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--m-sunk)] transition-colors cursor-pointer"
            >
              {isDe ? 'Nächstes' : isEs ? 'Siguiente' : 'Next'}
              <ChevronRight className="w-3.5 h-3.5" />
            </ChapterControl>
          </div>
        </div>
      </div>
    </div>
  );
};

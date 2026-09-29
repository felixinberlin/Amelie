import React, { useEffect, useRef, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Language } from '../types';
import { MOODS, MoodId } from '../data/moods';
import { applyMood, clearMoodFromUrl, initMood, storeMood } from '../utils/mood';

interface MoodSwitcherProps {
  lang: Language;
}

const label = (lang: Language) => (lang === 'de' ? 'Stimmung' : lang === 'es' ? 'Ambiente' : 'Mood');

/** Knopf mit Auswahlfeld: wechselt die Stimmung der ganzen Seite per Klick. */
export const MoodSwitcher: React.FC<MoodSwitcherProps> = ({ lang }) => {
  const [mood, setMood] = useState<MoodId>(initMood);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const choose = (id: MoodId) => {
    setMood(id);
    applyMood(id);
    storeMood(id);
    clearMoodFromUrl();
    setOpen(false);
  };

  const current = MOODS.find((m) => m.id === mood) ?? MOODS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        title={`${label(lang)}: ${current.name[lang]}`}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-[var(--m-line-strong)] bg-[var(--m-sunk)]/90 text-[var(--m-ink-2)] hover:text-[var(--m-ink)] text-xs font-medium shadow-2xs cursor-pointer transition-colors"
      >
        <Palette className="w-3.5 h-3.5 text-[var(--m-accent)]" />
        <span className="hidden sm:inline">
          {current.emoji} {current.name[lang]}
        </span>
        <span className="sm:hidden">{current.emoji}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label(lang)}
          className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[var(--m-surface)] border border-[var(--m-line)] shadow-2xl p-2 z-50 animate-fadeIn"
        >
          <div className="px-2.5 pt-1 pb-2 text-[10px] font-typewriter uppercase tracking-widest font-bold text-[var(--m-accent)]">
            ✦ {label(lang)} ✦
          </div>
          {MOODS.map((m) => {
            const active = m.id === mood;
            return (
              <button
                key={m.id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(m.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                  active ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)]' : 'hover:bg-[var(--m-surface-2)] text-[var(--m-ink)]'
                }`}
              >
                <span className="flex shrink-0 rounded-lg overflow-hidden border border-black/10" aria-hidden>
                  {m.swatch.map((c, i) => (
                    <span key={i} className="w-3.5 h-7" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {m.emoji} {m.name[lang]}
                  </span>
                  <span className={`block text-[11px] leading-snug ${active ? 'opacity-90' : 'text-[var(--m-muted)]'}`}>{m.desc[lang]}</span>
                </span>
                {active && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

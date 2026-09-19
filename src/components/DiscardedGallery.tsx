import React from 'react';
import { Trash2, Sparkles, ShieldX, BookOpen } from 'lucide-react';
import { DiscardedItem, Language } from '../types';
import { getTranslation } from '../i18n';

interface DiscardedGalleryProps {
  discarded: DiscardedItem[];
  lang: Language;
}

export const DiscardedGallery: React.FC<DiscardedGalleryProps> = ({ discarded, lang }) => {
  const t = getTranslation(lang);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Intro Box */}
      <div className="rounded-2xl bg-rose-900/5 border border-rose-800/20 p-6 md:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold">
          <Trash2 className="w-3.5 h-3.5 text-rose-800" />
          <span>{t.discarded.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
          {t.ui.discarded_heading}
        </h2>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {t.ui.discarded_subheading}
        </p>
      </div>

      {/* Discarded Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discarded.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-stone-200 bg-[#fdfbf7] flex flex-col justify-between shadow-2xs hover:border-rose-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code font-bold uppercase text-rose-800 flex items-center gap-1.5">
                  <ShieldX className="w-3.5 h-3.5" />
                  {t.discarded.verdict}
                </span>
                <span className="text-xs text-stone-500 font-mono-code">{item.domain}</span>
              </div>

              <h3 className="text-xl font-bold font-serif-title text-stone-900">
                {item.title}
              </h3>

              <div className="space-y-1">
                <span className="text-xs text-stone-600 block">
                  {t.discarded.original_idea}
                </span>
                <p className="text-sm text-stone-800 italic font-serif-title">
                  "{lang === 'de' ? item.originalIdeaDe : item.originalIdeaEn}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 text-xs sm:text-sm text-rose-950 space-y-1.5 leading-relaxed">
                <span className="font-bold font-mono-code uppercase tracking-wide block text-rose-900">
                  {t.discarded.why_discarded}
                </span>
                <p>{lang === 'de' ? item.whyDiscardedDe : item.whyDiscardedEn}</p>
              </div>

              {item.evidence && item.evidence.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-stone-500 block font-mono-code uppercase">
                    {t.discarded.evidence}
                  </span>
                  <ul className="text-xs text-stone-600 list-disc list-inside mt-1 space-y-0.5">
                    {item.evidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 space-y-1 text-xs text-stone-700 bg-stone-100/60 p-2.5 rounded-lg">
              <span className="font-bold text-stone-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                {t.discarded.key_lesson}
              </span>
              <p className="italic">
                "{lang === 'de' ? item.lessonDe : item.lessonEn}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Philosophy of Discarding */}
      <div className="p-6 rounded-2xl bg-stone-900 text-stone-200 text-xs sm:text-sm space-y-3 border border-stone-800">
        <h4 className="font-bold text-base font-serif-title text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          {t.discarded.philosophy_title}
        </h4>
        <p className="leading-relaxed">
          {t.discarded.philosophy_desc}
        </p>
      </div>
    </div>
  );
};

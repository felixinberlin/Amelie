import React, { useState } from 'react';
import { Mail, Copy, Check, Sparkles, ShieldAlert, CheckCircle2, Send, AlertTriangle, FileText, Compass, ExternalLink } from 'lucide-react';
import { AMELIE_MUSTERS, AMELIE_ANTI_PATTERNS, MusterEmail } from '../data/musterEmails';
import { Language } from '../types';
import { getTranslation } from '../i18n';

interface MusterEmailsSectionProps {
  lang: Language;
}

export const MusterEmailsSection: React.FC<MusterEmailsSectionProps> = ({ lang }) => {
  const [selectedMusterId, setSelectedMusterId] = useState<string>('muster-forschung');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = getTranslation(lang);

  const isDe = lang === 'de';
  const isEs = lang === 'es';

  const currentMuster = AMELIE_MUSTERS.find((m) => m.id === selectedMusterId) || AMELIE_MUSTERS[0];

  const handleCopy = (muster: MusterEmail) => {
    const text = isDe ? muster.bodyDe : muster.bodyEn;
    const fullEmail = `Subject: ${isDe ? muster.subjectDe : muster.subjectEn}\n\n${text}`;
    navigator.clipboard.writeText(fullEmail);
    setCopiedId(muster.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#faf4e8] via-[#f5ede1] to-[#eedfcb] border border-[#d8cbba] p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute right-3 top-2 select-none pointer-events-none opacity-5 hidden sm:block">
          <div className="font-amelie text-9xl font-bold text-[#8c1d40]">LETTRE</div>
        </div>

        <div className="max-w-3xl space-y-3 relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8c1d40]/10 border border-[#8c1d40]/25 text-[#8c1d40] text-xs font-typewriter font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>
                {isDe
                  ? 'MUSTER-E-MAILS · AMÉLIE-PHILOSOPHIE'
                  : isEs
                  ? 'MUESTRAS DE CORREO · FILOSOFÍA AMÉLIE'
                  : 'SAMPLE EMAILS · AMÉLIE PHILOSOPHY'}
              </span>
            </span>
            <span className="text-[11px] font-typewriter text-[#8b6f57]">
              {isDe
                ? '✦ Einmal senden, nie nachfassen ✦'
                : isEs
                ? '✦ Enviar una sola vez, nunca insistir ✦'
                : '✦ Send once, never follow up ✦'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-amelie text-[#2b1e16] tracking-tight">
            {isDe
              ? 'Muster-E-Mails nach den fünf Amélie-Regeln'
              : isEs
              ? 'Muestras de correo según las cinco reglas de Amélie'
              : 'Sample Outbound Emails Following Amélie Philosophy'}
          </h2>
          <p className="text-sm sm:text-base text-[#5c4a3d] leading-relaxed font-sans">
            {isDe
              ? 'Jede Mail ist ein bedingungsloses Geschenk (CC0). Sie enthält keine Terminanfrage, keine Bitte um Feedback und kein Nachfassen. Der Empfänger erhält die ausdrückliche Erlaubnis, nicht zu antworten.'
              : isEs
              ? 'Cada correo es un regalo incondicional (CC0). No contiene peticiones de reunión, no solicita retroalimentación y promete no insistir jamás. Se otorga permiso explícito para no responder.'
              : 'Every message is an unconditional gift under CC0. It contains zero meeting requests, zero demands for feedback, and absolute immunity from follow-ups. The recipient is granted explicit permission not to reply.'}
          </p>
        </div>
      </div>

      {/* The 6 Golden Amélie Email Pillars */}
      <div className="p-5 rounded-2xl bg-[#fffdf9] border border-[#dfd1be] space-y-3">
        <div className="flex items-center gap-2 text-xs font-typewriter uppercase tracking-widest font-bold text-[#8c1d40]">
          <Sparkles className="w-4 h-4 text-[#f6bd60]" />
          <span>{t.pillars.title}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-[#4a3728]">
          <div className="p-3 rounded-xl bg-[#faf5eb] border border-[#e4d7c5] space-y-1">
            <span className="font-bold text-[#8c1d40] block">{t.pillars.p1_title}</span>
            <p>{t.pillars.p1_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#faf5eb] border border-[#e4d7c5] space-y-1">
            <span className="font-bold text-[#8c1d40] block">{t.pillars.p2_title}</span>
            <p>{t.pillars.p2_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#faf5eb] border border-[#e4d7c5] space-y-1">
            <span className="font-bold text-[#8c1d40] block">{t.pillars.p3_title}</span>
            <p>{t.pillars.p3_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#faf5eb] border border-[#e4d7c5] space-y-1">
            <span className="font-bold text-[#8c1d40] block">{t.pillars.p4_title}</span>
            <p>{t.pillars.p4_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#faf5eb] border border-[#e4d7c5] space-y-1">
            <span className="font-bold text-[#8c1d40] block">{t.pillars.p5_title}</span>
            <p>{t.pillars.p5_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#faf5eb] border border-[#8c1d40]/30 bg-[#8c1d40]/5 space-y-1">
            <span className="font-bold text-[#8c1d40] block">{t.pillars.p6_title}</span>
            <p>{t.pillars.p6_desc}</p>
          </div>
        </div>
      </div>

      {/* Template Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AMELIE_MUSTERS.map((m) => {
          const isSelected = selectedMusterId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMusterId(m.id)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#8c1d40] text-white border-[#701531] shadow-md ring-2 ring-[#f6bd60]/40'
                  : 'bg-[#fffdf9] text-[#2b1e16] border-[#dfd1be] hover:border-[#8c1d40]/40 hover:bg-[#faf5ec]'
              }`}
            >
              <div>
                <span
                  className={`text-[10px] font-typewriter uppercase tracking-widest font-bold block mb-1 ${
                    isSelected ? 'text-[#f6bd60]' : 'text-[#8c1d40]'
                  }`}
                >
                  {m.typeId.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold font-amelie line-clamp-2">
                  {isDe ? m.titleDe : m.titleEn}
                </h4>
              </div>
              <p
                className={`text-[11px] mt-2 line-clamp-2 ${
                  isSelected ? 'text-stone-200' : 'text-[#6b5849]'
                }`}
              >
                {isDe ? m.targetDe : m.targetEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Template Card */}
      <div className="rounded-2xl border border-[#dfd1be] bg-[#fffdf9] overflow-hidden shadow-xs">
        {/* Card Header */}
        <div className="p-6 bg-[#faf5eb] border-b border-[#dfd1be] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-typewriter px-2 py-0.5 rounded bg-[#8c1d40]/10 text-[#8c1d40] border border-[#8c1d40]/25 font-bold">
                  {currentMuster.typeId.toUpperCase()}
                </span>
                <span className="text-xs text-[#8b6f57] font-typewriter">
                  {t.ui.rules_applied}{' '}
                  {currentMuster.rulesApplied.map((r) => `#${r}`).join(' ')}
                </span>
              </div>
              <h3 className="text-xl font-bold font-amelie text-[#2b1e16] mt-1">
                {isDe ? currentMuster.titleDe : currentMuster.titleEn}
              </h3>
              <p className="text-xs text-[#6b5849] mt-0.5">
                <span className="font-semibold">{t.ui.target_audience}{' '}</span>
                {isDe ? currentMuster.targetDe : currentMuster.targetEn}
              </p>
            </div>

            <button
              onClick={() => handleCopy(currentMuster)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8c1d40] hover:bg-[#741533] text-white text-xs font-typewriter font-bold transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              {copiedId === currentMuster.id ? (
                <>
                  <Check className="w-4 h-4 text-[#f6bd60]" />
                  <span>{t.ui.email_copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.ui.copy_template}</span>
                </>
              )}
            </button>
          </div>

          {/* Context Explainer */}
          <div className="p-3.5 rounded-xl bg-white border border-[#e2d5c3] text-xs text-[#5c4a3d] space-y-1">
            <span className="font-bold text-[#8c1d40] block font-typewriter">
              ✦ {t.ui.why_tone}
            </span>
            <p>{isDe ? currentMuster.contextDe : currentMuster.contextEn}</p>
          </div>
        </div>

        {/* Email Body in Typewriter Style */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-typewriter text-[#8b6f57] uppercase tracking-wider block">
              {t.ui.subject_line}
            </span>
            <div className="p-3 rounded-xl bg-[#fcf8f0] border border-[#dfd1be] font-typewriter text-xs sm:text-sm font-bold text-[#2b1e16]">
              {isDe ? currentMuster.subjectDe : currentMuster.subjectEn}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-typewriter text-[#8b6f57] uppercase tracking-wider block">
              {t.ui.message_text}
            </span>
            <div className="p-5 sm:p-6 rounded-xl bg-[#fcf8f0] border border-[#dfd1be] font-typewriter text-xs sm:text-sm text-[#2b1e16] whitespace-pre-wrap leading-relaxed shadow-inner">
              {isDe ? currentMuster.bodyDe : currentMuster.bodyEn}
            </div>
          </div>

          {/* Key Strengths */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-typewriter uppercase tracking-wider text-[#1b4332] font-bold block">
              ✦ {t.ui.strengths}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(isDe ? currentMuster.keyStrengthsDe : currentMuster.keyStrengthsEn).map((str, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#3d2f23]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32] shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Anti-Patterns (Was nach Amélie strikt verboten ist) */}
      <section className="space-y-4 pt-4 border-t border-[#dfd1be]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#b91c1c]" />
          <h3 className="text-lg font-bold font-amelie text-[#2b1e16]">
            {t.anti.heading}
          </h3>
        </div>
        <p className="text-xs text-[#6b5849]">
          {t.anti.subheading}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AMELIE_ANTI_PATTERNS.map((anti, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#fdf2f2] border border-[#fecaca] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-typewriter font-bold text-[#b91c1c]">
                    {t.anti.mistake} #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#fee2e2] text-[#991b1b] text-[10px] font-mono-code font-bold">
                    {t.anti.violation} {anti.violatedRule}
                  </span>
                </div>
                <blockquote className="text-xs font-typewriter italic text-[#7f1d1d] bg-white/80 p-2.5 rounded-lg border border-[#fca5a5]">
                  {anti.badExample}
                </blockquote>
                <p className="text-xs text-[#450a0a] leading-relaxed">
                  {isDe ? anti.explanationDe : anti.explanationEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

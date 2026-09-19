import React, { useState } from 'react';
import { X, Copy, Check, Download, AlertTriangle, Lightbulb, Target, Wrench, ShieldAlert, Sparkles, Send, Printer, Brain, GraduationCap, ShieldCheck, Heart } from 'lucide-react';
import { DoseItem, Language } from '../types';
import { AMELIE_PLEDGE } from '../data/manifest';
import { getTranslation } from '../i18n';

interface DoseModalProps {
  dose: DoseItem;
  lang: Language;
  onClose: () => void;
}

export const DoseModal: React.FC<DoseModalProps> = ({ dose, lang, onClose }) => {
  const [copiedPledge, setCopiedPledge] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const t = getTranslation(lang);

  const copyPledge = () => {
    navigator.clipboard.writeText(AMELIE_PLEDGE[lang]);
    setCopiedPledge(true);
    setTimeout(() => setCopiedPledge(false), 2000);
  };

  const activeEmailTemplate = dose.emailTemplates && dose.emailTemplates.length > 0
    ? dose.emailTemplates[selectedEmailIndex] || dose.emailTemplates[0]
    : dose.emailTemplate
      ? {
          recipientName: lang === 'de' ? dose.recipientsDe : dose.recipientsEn,
          to: dose.emailTemplate.to,
          subjectDe: dose.emailTemplate.subjectDe,
          bodyDe: dose.emailTemplate.bodyDe,
          subjectEn: dose.emailTemplate.subjectEn,
          bodyEn: dose.emailTemplate.bodyEn,
        }
      : null;

  const getLocalizedEmailDraft = () => {
    if (activeEmailTemplate) {
      const subject = lang === 'de' ? activeEmailTemplate.subjectDe : activeEmailTemplate.subjectEn;
      const body = lang === 'de' ? activeEmailTemplate.bodyDe : activeEmailTemplate.bodyEn;
      const to = activeEmailTemplate.to ? `An: ${activeEmailTemplate.to}\n` : '';
      return `${to}Betreff: ${subject}\n\n${body}`;
    }

    if (lang === 'de') {
      return `Betreff: Idee zu verschenken: ${dose.title}

Hallo,

ich recherchiere Software, die erst seit Kurzem technisch möglich ist, und baue nur einen kleinen Teil davon selbst. Diese Idee gehört zu Ihrem Projekt und nicht zu mir, deshalb schenke ich sie Ihnen.

${dose.oneLinerDe}

Das Problem:
${dose.problemDe}

Erster Schritt (Ticket #1):
${dose.firstStepDe.ticket}
Fertig, wenn: ${dose.firstStepDe.criteria}

Wo es kippt:
${dose.failureModeDe}

Pledge:
${AMELIE_PLEDGE.de}

Félix (Berlin)`;
    } else if (lang === 'es') {
      return `Asunto: Idea de regalo: ${dose.title}

Hola,

Investigo software que solo recientemente se ha vuelto técnicamente viable, y solo construyo una pequeña fracción yo mismo. Esta idea pertenece a su proyecto y no a mí, por eso se la regalo.

${dose.oneLinerEn}

El problema:
${dose.problemEn}

Primer paso (Ticket #1):
${dose.firstStepEn.ticket}
Completado cuando: ${dose.firstStepEn.criteria}

Punto crítico de falla:
${dose.failureModeEn}

Compromiso:
${AMELIE_PLEDGE.es}

Félix (Berlín)`;
    } else {
      return `Subject: Idea as a gift: ${dose.title}

Hello,

I research software that has only recently become technically viable, and I only build a small fraction myself. This idea belongs to your project and not to me, which is why I am gifting it to you.

${dose.oneLinerEn}

The Problem:
${dose.problemEn}

First Milestone (Ticket #1):
${dose.firstStepEn.ticket}
Done when: ${dose.firstStepEn.criteria}

Where it breaks:
${dose.failureModeEn}

Pledge:
${AMELIE_PLEDGE.en}

Félix (Berlin)`;
    }
  };

  const emailDraft = getLocalizedEmailDraft();

  const copyEmail = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const downloadMarkdown = () => {
    const isDe = lang === 'de';
    const mdContent = `# ${dose.title}

**${isDe ? 'Ein Satz' : 'One sentence'}:** ${isDe ? dose.oneLinerDe : dose.oneLinerEn}

**${isDe ? 'Stand' : 'Date'}:** ${dose.date} · **${isDe ? 'Prüfen ab' : 'Review after'}:** ${dose.reviewAfter}
**${isDe ? 'Empfänger' : 'Recipient'}:** ${isDe ? dose.recipientsDe : dose.recipientsEn}
**${isDe ? 'Verdikt' : 'Verdict'}:** ${dose.verdict === 'gift' ? '🎁 gift' : dose.verdict === 'build_first' ? '🔨 build first' : '🔒 kept'}

---

## ${isDe ? 'Das Problem' : 'The Problem'}
${isDe ? dose.problemDe : dose.problemEn}

## ${isDe ? 'Warum das jetzt geht' : 'Why Now'}
${(isDe ? dose.whyNowDe : dose.whyNowEn).map((w, i) => `${i + 1}. ${w}`).join('\n')}

## ${isDe ? 'Skizze' : 'Sketch'}
${isDe ? dose.sketchDe : dose.sketchEn}

## ${isDe ? 'Erster Schritt' : 'First Step'}
**Ticket: ${isDe ? dose.firstStepDe.ticket : dose.firstStepEn.ticket}**
${isDe ? dose.firstStepDe.criteria : dose.firstStepEn.criteria}

## ${isDe ? 'Wo es kippt' : 'Where it Breaks'}
${isDe ? dose.failureModeDe : dose.failureModeEn}

## ${isDe ? 'Wer es schon versucht hat' : 'Prior Art'}
${isDe ? dose.priorArtDe : dose.priorArtEn}

${dose.emailTemplates && dose.emailTemplates.length > 0 ? `
---

## ${isDe ? 'Schenkungs-Mails (In der Dose verpackt)' : 'Handover Letters (Packaged in Tin)'}
${dose.emailTemplates.map((tmpl, idx) => `
### Mail ${idx + 1}: ${tmpl.recipientName}
**${isDe ? 'An' : 'To'}:** ${tmpl.to}
**${isDe ? 'Betreff' : 'Subject'}:** ${isDe ? tmpl.subjectDe : tmpl.subjectEn}

\`\`\`text
${isDe ? tmpl.bodyDe : tmpl.bodyEn}
\`\`\`
`).join('\n')}
` : ''}
---

## ${isDe ? 'Der Pledge' : 'The Pledge'}
> ${AMELIE_PLEDGE[lang]}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${dose.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn print:p-0 print:bg-white print:fixed print:inset-0">
      <div 
        className="bg-[#fcf9f2] w-full max-w-4xl rounded-2xl border-2 border-[#c5832b]/60 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar - Deep Amélie Wine & Brass */}
        <div className="bg-[#701531] text-[#fff9f5] px-6 py-4 flex items-center justify-between border-b-2 border-[#c5832b]/40 print:bg-white print:text-black print:border-b-2 print:border-stone-900 print:px-0">
          <div className="flex items-center gap-3.5">
            <span className="text-2xl print:hidden transform -rotate-3">
              {dose.verdict === 'gift' ? '🎁' : dose.verdict === 'build_first' ? '🔨' : '🔒'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-typewriter tracking-widest text-[#f6bd60] print:text-stone-900 font-bold">
                  {lang === 'de' ? 'Boîte en fer-blanc · Dosen-Inhalt' : lang === 'es' ? 'Boîte en fer-blanc · Contenido' : 'Boîte en fer-blanc · Tin Canister'}
                </span>
                <span className="text-[#c5832b]">·</span>
                <span className="text-xs text-[#fde047]/90 font-typewriter print:text-stone-600">{dose.id}.md</span>
              </div>
              <h2 className="text-xl font-amelie font-bold text-white print:text-black tracking-tight">
                {dose.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={printDossier}
              className="p-2 rounded-lg text-[#f4ede0] hover:text-white hover:bg-[#8c1d40] transition-colors"
              title={lang === 'de' ? 'Dossier als A4 drucken' : 'Print A4 Dossier'}
            >
              <Printer className="w-4 h-4 text-[#f6bd60]" />
            </button>
            <button
              onClick={downloadMarkdown}
              className="p-2 rounded-lg text-[#f4ede0] hover:text-white hover:bg-[#8c1d40] transition-colors"
              title={lang === 'de' ? 'Markdown herunterladen' : lang === 'es' ? 'Descargar markdown' : 'Download markdown file'}
            >
              <Download className="w-4 h-4 text-[#f6bd60]" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#f4ede0] hover:text-white hover:bg-[#8c1d40] transition-colors"
              title={t.ui.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-[#2b1e16]">
          {/* One Liner Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#faf3e6] to-[#f4e9d5] border border-[#d8cbba] text-[#3b2a1c] font-amelie text-lg sm:text-xl italic leading-relaxed shadow-xs">
            « {lang === 'de' ? dose.oneLinerDe : dose.oneLinerEn} »
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-[#f4ede0] p-4 rounded-xl border border-[#dfd1be]">
            <div>
              <span className="text-[#8b6f57] block font-typewriter uppercase tracking-wider font-semibold">
                {t.ui.recipient}
              </span>
              <span className="font-bold text-[#2b1e16] text-sm">
                {lang === 'de' ? dose.recipientsDe : dose.recipientsEn}
              </span>
            </div>
            <div>
              <span className="text-[#8b6f57] block font-typewriter uppercase tracking-wider font-semibold">
                {lang === 'de' ? 'Verdikt:' : lang === 'es' ? 'Veredicto:' : 'Verdict:'}
              </span>
              <span className="font-bold text-[#8c1d40] text-sm">
                {dose.verdict === 'gift'
                  ? t.ui.verdict_gift
                  : dose.verdict === 'build_first'
                  ? t.ui.verdict_build_first
                  : t.ui.verdict_keep}
              </span>
            </div>
            <div>
              <span className="text-[#8b6f57] block font-typewriter uppercase tracking-wider font-semibold">
                {lang === 'de' ? 'Stand:' : lang === 'es' ? 'Fecha:' : 'Date:'}
              </span>
              <span className="font-bold text-[#2b1e16] font-typewriter">
                {dose.date}
              </span>
            </div>
          </div>

          {/* The Pledge Banner - Styled like vintage velvet jewelry box */}
          <div className="p-5 rounded-2xl bg-[#1b4332] text-[#f4fbf7] border-2 border-[#2d5a27] relative shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-typewriter uppercase text-[#f6bd60] font-bold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f6bd60]" />
                {t.pledge.title} · PLEDGE CC0
              </span>
              <button
                onClick={copyPledge}
                className="flex items-center gap-1 text-xs text-[#f4fbf7] hover:text-white px-3 py-1 rounded-lg bg-[#143527] hover:bg-[#0e271c] transition-colors border border-[#2d5a27]"
              >
                {copiedPledge ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#86efac]" />
                    <span className="text-[#86efac] font-typewriter">{t.pledge.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#f6bd60]" />
                    <span className="font-typewriter">{t.pledge.copy}</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-amelie italic text-sm text-[#ecfdf5] leading-relaxed">
              « {AMELIE_PLEDGE[lang]} »
            </p>
          </div>

          {/* Section 1: Problem */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-typewriter uppercase tracking-wider text-[#8c1d40] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#8c1d40]" />
              {lang === 'de' ? 'Das Problem' : lang === 'es' ? 'El Problema' : 'The Friction & Problem'}
            </h3>
            <p className="text-sm text-[#3b2a1c] leading-relaxed bg-[#fbf7f0] p-4 rounded-xl border border-[#e8ded0]">
              {lang === 'de' ? dose.problemDe : dose.problemEn}
            </p>
          </div>

          {/* Section 2: Why now */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-typewriter uppercase tracking-wider text-[#8c1d40] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#c5832b]" />
              {lang === 'de' ? 'Warum das jetzt geht (Technologie-Knick)' : lang === 'es' ? 'Por qué ahora (Avance técnico)' : 'Why Now (Technical Breakthrough)'}
            </h3>
            <ul className="space-y-2 text-sm text-[#3b2a1c]">
              {(lang === 'de' ? dose.whyNowDe : dose.whyNowEn).map((point, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-[#fbf7f0] border border-[#e8ded0]">
                  <span className="w-5 h-5 rounded-full bg-[#c5832b]/20 text-[#78350f] flex items-center justify-center text-xs font-typewriter font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Sketch */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-typewriter uppercase tracking-wider text-[#8c1d40] flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#5c4a3d]" />
              {lang === 'de' ? 'Skizze & Architektur' : lang === 'es' ? 'Esquema y Arquitectura' : 'Sketch & Architecture'}
            </h3>
            <div className="p-4 rounded-xl bg-[#f4ede0] border border-[#dfd1be] text-sm text-[#2b1e16] leading-relaxed font-sans">
              {lang === 'de' ? dose.sketchDe : dose.sketchEn}
            </div>
          </div>

          {/* Section 4: Ticket #1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-typewriter uppercase tracking-wider text-[#1b4332] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#1b4332]" />
              {lang === 'de' ? 'Erster Schritt (Ticket #1)' : lang === 'es' ? 'Primer paso (Ticket #1)' : 'First Milestone (Ticket #1)'}
            </h3>
            <div className="p-4 rounded-xl bg-[#1b4332]/10 border border-[#1b4332]/30 space-y-2">
              <div className="font-bold text-[#1b4332] text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#1b4332] text-[#f4fbf7] text-xs font-typewriter">
                  Ticket 1
                </span>
                <span>{lang === 'de' ? dose.firstStepDe.ticket : dose.firstStepEn.ticket}</span>
              </div>
              <div className="text-xs text-[#143527] pl-1 font-medium">
                <span className="font-bold">
                  {lang === 'de' ? 'Fertig, wenn: ' : lang === 'es' ? 'Completado cuando: ' : 'Done when: '}
                </span>
                {lang === 'de' ? dose.firstStepDe.criteria : dose.firstStepEn.criteria}
              </div>
            </div>
          </div>

          {/* Section 5: Failure mode */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-typewriter uppercase tracking-wider text-[#8c1d40] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#8c1d40]" />
              {lang === 'de' ? 'Wo es kippt (Bruchstelle)' : lang === 'es' ? 'Punto crítico de falla' : 'Where it Breaks (Crucial Failure Mode)'}
            </h3>
            <div className="p-4 rounded-xl bg-[#8c1d40]/10 border border-[#8c1d40]/30 text-sm text-[#741533] leading-relaxed font-medium">
              {lang === 'de' ? dose.failureModeDe : dose.failureModeEn}
            </div>
          </div>

          {/* Section 6: Prior Art */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-typewriter uppercase tracking-wider text-[#8c1d40]">
              {lang === 'de' ? 'Wer es schon versucht hat' : lang === 'es' ? 'Intentos previos y brecha' : 'Prior Art & Unoccupied Gap'}
            </h3>
            <p className="text-sm text-[#4a3b2c] leading-relaxed bg-[#fbf7f0] p-4 rounded-xl border border-[#e8ded0]">
              {lang === 'de' ? dose.priorArtDe : dose.priorArtEn}
            </p>
          </div>

          {/* Section: AI-Native Frontier & Learning Plan (if present) */}
          {dose.aiFrontier && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-amber-50/50 border border-indigo-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-700" />
                  {lang === 'de' ? 'KI-Frontier & Warum vor KI unmöglich' : 'AI-Native Frontier & Breakthrough'}
                </span>
                <span className="text-xs text-indigo-800 font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  {lang === 'de' ? 'Fokus: Für normale Bürger' : 'Focus: Empowering Ordinary People'}
                </span>
              </div>

              {/* What was impossible before AI */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase font-mono-code tracking-wider text-indigo-950">
                  {lang === 'de' ? '⚡ Was vor moderner KI unmöglich war' : '⚡ What was Impossible Before AI'}
                </h4>
                <p className="text-sm text-indigo-950/90 leading-relaxed">
                  {lang === 'de' ? dose.aiFrontier.impossibleBeforeAiDe : dose.aiFrontier.impossibleBeforeAiEn}
                </p>
              </div>

              {/* Ordinary people benefit & Privacy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/80 border border-indigo-100 space-y-1">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                    {lang === 'de' ? 'Konkreter Nutzen im Alltag' : 'Everyday Human Benefit'}
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed">
                    {lang === 'de' ? dose.aiFrontier.ordinaryPeopleBenefitDe : dose.aiFrontier.ordinaryPeopleBenefitEn}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/80 border border-indigo-100 space-y-1">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {lang === 'de' ? 'Datenschutz & Souveränität' : 'Privacy & Local Sovereignty'}
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed">
                    {lang === 'de' ? dose.aiFrontier.privacyModelDe : dose.aiFrontier.privacyModelEn}
                  </p>
                </div>
              </div>

              {/* Tech stack pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-mono-code text-stone-600 font-semibold mr-1">
                  {lang === 'de' ? 'Tech-Stack:' : 'Tech Stack:'}
                </span>
                {dose.aiFrontier.aiTechStack.map((tech, i) => (
                  <span key={i} className="text-[11px] font-mono-code px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-900 font-medium">
                    {tech}
                  </span>
                ))}
              </div>

              {/* 4-Week Learning Curriculum */}
              <div className="pt-3 border-t border-indigo-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase font-mono-code tracking-wider text-indigo-950 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-700" />
                    {lang === 'de' ? 'Lernplan: In 4 Wochen vom Konzept zum Prototyp' : 'Learning Plan: 4-Week Curriculum to Functional Prototype'}
                  </h4>
                  <span className="text-[11px] text-indigo-800 font-medium font-mono-code">
                    4 Milestones
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(lang === 'de' ? dose.aiFrontier.learningCurriculumDe : dose.aiFrontier.learningCurriculumEn).map((c) => (
                    <div key={c.step} className="p-3 rounded-xl bg-white/90 border border-indigo-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-semibold text-indigo-950">
                        <span>{c.title}</span>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-700 font-mono-code">
                          Step {c.step}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        <span className="font-semibold text-stone-700">{lang === 'de' ? 'Schwerpunkt: ' : 'Focus: '}</span>
                        {c.focus}
                      </p>
                      <div className="text-emerald-800 font-medium text-[11px] pt-0.5 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{c.milestone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 7: Outreach Draft */}
          <div className="pt-4 border-t border-[#dfd1be] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold font-typewriter uppercase tracking-wider text-[#8c1d40] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#8c1d40]" />
                {lang === 'de' ? 'Sendefertiger Kaltmail-Entwurf (Dosen-Post)' : lang === 'es' ? 'Borrador de carta listo para enviar' : 'Ready-to-Send Outreach Letter'}
              </h3>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg border border-[#c5832b]/40 bg-[#faf3e6] hover:bg-[#f5ead5] font-typewriter font-bold text-[#78350f] transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span className="text-[#1b4332]">{t.ui.email_copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8b6f57]" />
                    <span>{t.ui.copy_email}</span>
                  </>
                )}
              </button>
            </div>

            {/* Recipient switcher if multiple templates exist */}
            {dose.emailTemplates && dose.emailTemplates.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-typewriter text-[#8b6f57] font-semibold mr-1">
                  {lang === 'de' ? 'Empfänger:' : 'Recipient:'}
                </span>
                {dose.emailTemplates.map((tmpl, idx) => {
                  const isSelected = selectedEmailIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedEmailIndex(idx)}
                      className={`text-xs font-typewriter px-3 py-1.5 rounded-lg transition-all border ${
                        isSelected
                          ? 'bg-[#8c1d40] text-white font-bold border-[#701531] shadow-xs'
                          : 'bg-[#f4ede0] text-[#5c4a3d] hover:bg-[#eee1d0] border-[#d8cbba]'
                      }`}
                    >
                      {tmpl.recipientName}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative rounded-2xl bg-[#2b1e16] text-[#fbf7f0] border-2 border-[#d8cbba] p-5 shadow-inner overflow-hidden">
              <div className="absolute top-2 right-3 text-[10px] font-typewriter uppercase tracking-wider text-[#c5832b] select-none pointer-events-none opacity-40">
                MACHINE À ÉCRIRE · PARIS 18e
              </div>
              <pre className="text-xs font-typewriter overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 text-[#f5ece0]">
                {emailDraft}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#f4ede0] border-t border-[#dfd1be] flex items-center justify-between text-xs text-[#8b6f57] font-typewriter">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#8c1d40]">✦</span>
            <span>{lang === 'de' ? 'Amélie Dosen-Format · Alle Inhalte CC0 Public Domain' : lang === 'es' ? 'Formato Lata Amélie · Todo CC0 Dominio Público' : 'Amélie Tin Canister · All content CC0 Public Domain'}</span>
          </div>
          <button
            onClick={onClose}
            className="btn-amelie-rouge px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all"
          >
            {t.ui.close}
          </button>
        </div>
      </div>
    </div>
  );
};

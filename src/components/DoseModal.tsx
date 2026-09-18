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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn print:p-0 print:bg-white print:fixed print:inset-0">
      <div 
        className="bg-[#fdfbf7] w-full max-w-4xl rounded-2xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-stone-800 print:bg-white print:text-black print:border-b-2 print:border-stone-900 print:px-0">
          <div className="flex items-center gap-3">
            <span className="text-xl print:hidden">
              {dose.verdict === 'gift' ? '🎁' : dose.verdict === 'build_first' ? '🔨' : '🔒'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono-code tracking-widest text-amber-400 print:text-stone-900 font-bold">
                  {lang === 'de' ? 'Amélie Blechdose' : lang === 'es' ? 'Lata Amélie' : 'Amélie Tin Canister'}
                </span>
                <span className="text-stone-500">·</span>
                <span className="text-xs text-stone-300 font-mono-code print:text-stone-600">{dose.id}.md</span>
              </div>
              <h2 className="text-lg font-serif-title font-bold text-white print:text-black tracking-tight">
                {dose.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={printDossier}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              title={lang === 'de' ? 'Dossier als A4 drucken' : 'Print A4 Dossier'}
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={downloadMarkdown}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              title={lang === 'de' ? 'Markdown herunterladen' : lang === 'es' ? 'Descargar markdown' : 'Download markdown file'}
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title={t.ui.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-stone-800">
          {/* One Liner Box */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 font-serif-title text-base sm:text-lg italic leading-relaxed">
            "{lang === 'de' ? dose.oneLinerDe : dose.oneLinerEn}"
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-stone-100 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 block font-medium">
                {t.ui.recipient}
              </span>
              <span className="font-semibold text-stone-900">
                {lang === 'de' ? dose.recipientsDe : dose.recipientsEn}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block font-medium">
                {lang === 'de' ? 'Verdikt:' : lang === 'es' ? 'Veredicto:' : 'Verdict:'}
              </span>
              <span className="font-semibold text-stone-900">
                {dose.verdict === 'gift'
                  ? t.ui.verdict_gift
                  : dose.verdict === 'build_first'
                  ? t.ui.verdict_build_first
                  : t.ui.verdict_keep}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block font-medium">
                {lang === 'de' ? 'Stand:' : lang === 'es' ? 'Fecha:' : 'Date:'}
              </span>
              <span className="font-semibold text-stone-800 font-mono-code">
                {dose.date}
              </span>
            </div>
          </div>

          {/* The Pledge Banner */}
          <div className="p-4 rounded-xl bg-stone-900 text-stone-100 border border-amber-900/40 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t.pledge.title}
              </span>
              <button
                onClick={copyPledge}
                className="flex items-center gap-1 text-xs text-stone-300 hover:text-white px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 transition-colors"
              >
                {copiedPledge ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.pledge.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.pledge.copy}</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-serif-title italic text-sm text-stone-200 leading-relaxed">
              "{AMELIE_PLEDGE[lang]}"
            </p>
          </div>

          {/* Section 1: Problem */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wider text-stone-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              {lang === 'de' ? 'Das Problem' : lang === 'es' ? 'El Problema' : 'The Friction & Problem'}
            </h3>
            <p className="text-sm text-stone-800 leading-relaxed">
              {lang === 'de' ? dose.problemDe : dose.problemEn}
            </p>
          </div>

          {/* Section 2: Why now */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wider text-stone-600 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              {lang === 'de' ? 'Warum das jetzt geht (Technologie-Knick)' : lang === 'es' ? 'Por qué ahora (Avance técnico)' : 'Why Now (Technical Breakthrough)'}
            </h3>
            <ul className="space-y-2 text-sm text-stone-800">
              {(lang === 'de' ? dose.whyNowDe : dose.whyNowEn).map((point, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-mono-code font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Sketch */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wider text-stone-600 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-stone-700" />
              {lang === 'de' ? 'Skizze & Architektur' : lang === 'es' ? 'Esquema y Arquitectura' : 'Sketch & Architecture'}
            </h3>
            <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-sm text-stone-800 leading-relaxed font-sans">
              {lang === 'de' ? dose.sketchDe : dose.sketchEn}
            </div>
          </div>

          {/* Section 4: Ticket #1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wider text-stone-600 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-700" />
              {lang === 'de' ? 'Erster Schritt (Ticket #1)' : lang === 'es' ? 'Primer paso (Ticket #1)' : 'First Milestone (Ticket #1)'}
            </h3>
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <div className="font-semibold text-emerald-950 text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-xs font-mono-code">
                  Ticket 1
                </span>
                <span>{lang === 'de' ? dose.firstStepDe.ticket : dose.firstStepEn.ticket}</span>
              </div>
              <div className="text-xs text-emerald-900/90 pl-1">
                <span className="font-semibold text-emerald-950">
                  {lang === 'de' ? 'Fertig, wenn: ' : lang === 'es' ? 'Completado cuando: ' : 'Done when: '}
                </span>
                {lang === 'de' ? dose.firstStepDe.criteria : dose.firstStepEn.criteria}
              </div>
            </div>
          </div>

          {/* Section 5: Failure mode */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wider text-stone-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              {lang === 'de' ? 'Wo es kippt (Bruchstelle)' : lang === 'es' ? 'Punto crítico de falla' : 'Where it Breaks (Crucial Failure Mode)'}
            </h3>
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 text-sm text-rose-950 leading-relaxed">
              {lang === 'de' ? dose.failureModeDe : dose.failureModeEn}
            </div>
          </div>

          {/* Section 6: Prior Art */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wider text-stone-600">
              {lang === 'de' ? 'Wer es schon versucht hat' : lang === 'es' ? 'Intentos previos y brecha' : 'Prior Art & Unoccupied Gap'}
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
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
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold font-mono-code uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-800" />
                {lang === 'de' ? 'Sendefertiger Kaltmail-Entwurf' : lang === 'es' ? 'Borrador de correo listo para enviar' : 'Ready-to-Send Outreach Draft'}
              </h3>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 font-medium text-stone-800 transition-colors shadow-2xs self-start sm:self-auto"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{t.ui.email_copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>{t.ui.copy_email}</span>
                  </>
                )}
              </button>
            </div>

            {/* Recipient switcher if multiple templates exist */}
            {dose.emailTemplates && dose.emailTemplates.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-mono-code text-stone-500 font-semibold mr-1">
                  {lang === 'de' ? 'Empfänger:' : 'Recipient:'}
                </span>
                {dose.emailTemplates.map((tmpl, idx) => {
                  const isSelected = selectedEmailIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedEmailIndex(idx)}
                      className={`text-xs font-mono-code px-3 py-1.5 rounded-lg transition-all border ${
                        isSelected
                          ? 'bg-amber-900 text-white font-bold border-amber-950 shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300'
                      }`}
                    >
                      {tmpl.recipientName}
                    </button>
                  );
                })}
              </div>
            )}

            <pre className="p-4 rounded-xl bg-stone-900 text-stone-200 text-xs font-mono-code overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64">
              {emailDraft}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>{lang === 'de' ? 'Amélie Dosen-Format · Alle Inhalte CC0' : lang === 'es' ? 'Formato Lata Amélie · Todo CC0' : 'Amélie Tin Canister · All content CC0'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors"
          >
            {t.ui.close}
          </button>
        </div>
      </div>
    </div>
  );
};

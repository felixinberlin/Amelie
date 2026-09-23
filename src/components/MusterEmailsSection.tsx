import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Send,
  AlertTriangle,
  FileText,
  Compass,
  ExternalLink,
  Maximize2,
  Link2,
  Eye,
  Package,
  RotateCcw,
} from 'lucide-react';
import { AMELIE_MUSTERS, AMELIE_ANTI_PATTERNS, MusterEmail } from '../data/musterEmails';
import { DoseItem, Language } from '../types';
import { getTranslation, getLocalizedTitle } from '../i18n';
import { getDoseUrl } from '../utils/doseUrl';
import { getSentEmailsMap, markEmailAsSent, SentEmailRecord } from '../services/storageService';

interface MusterEmailsSectionProps {
  lang: Language;
  dosen?: DoseItem[];
  onOpenSinglePage?: (dose: DoseItem) => void;
  onOpenModal?: (dose: DoseItem) => void;
}

export const MusterEmailsSection: React.FC<MusterEmailsSectionProps> = ({
  lang,
  dosen = [],
  onOpenSinglePage,
  onOpenModal,
}) => {
  const [selectedMusterId, setSelectedMusterId] = useState<string>('muster-forschung');
  const [selectedDoseId, setSelectedDoseId] = useState<string>('altbau-thermal');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedDoseUrl, setCopiedDoseUrl] = useState(false);
  const [sentMap, setSentMap] = useState<Record<string, SentEmailRecord>>(() => getSentEmailsMap());
  const t = getTranslation(lang);

  const isDe = lang === 'de';
  const isEs = lang === 'es';

  useEffect(() => {
    setSentMap(getSentEmailsMap());
  }, []);

  const currentMuster = AMELIE_MUSTERS.find((m) => m.id === selectedMusterId) || AMELIE_MUSTERS[0];
  const linkedDose = dosen.find((d) => d.id === selectedDoseId) || dosen[0] || null;

  const linkedDoseUrl = linkedDose ? getDoseUrl(linkedDose.id) : '';
  const linkedDoseTitle = linkedDose ? getLocalizedTitle(linkedDose, lang) : '';

  // Generate customized email text with real deep link
  const getCustomizedEmail = (muster: MusterEmail) => {
    let subject = isDe ? muster.subjectDe : muster.subjectEn;
    let body = isDe ? muster.bodyDe : muster.bodyEn;

    if (linkedDose) {
      // Substitute placeholders
      subject = subject.replace(/\[Name der Idee\]/g, linkedDoseTitle);
      
      const oneLiner = isDe ? linkedDose.oneLinerDe : linkedDose.oneLinerEn;
      const problem = isDe ? linkedDose.problemDe : linkedDose.problemEn;

      body = body
        .replace(/\[Name der Idee\]/g, linkedDoseTitle)
        .replace(/\[Das konkrete Problem\]/g, problem)
        .replace(
          /https:\/\/felixinberlin\.github\.io\/Amelie\/\s*\(bzw\.\s*https:\/\/github\.com\/felixinberlin\/Amelie\/blob\/main\/05-dosen\/\[slug\]\.md\)/g,
          `${linkedDoseUrl}\n(Direkt-Link zur Einzelseite der Dose — frei im Browser aufrufbar)`
        )
        .replace(/\[slug\]/g, linkedDose.id);
    }

    return { subject, body, fullText: `Subject: ${subject}\n\n${body}` };
  };

  const currentCustomEmail = getCustomizedEmail(currentMuster);
  const currentKey = `muster-${selectedMusterId}-${selectedDoseId}`;
  const isMusterSent = !!sentMap[currentKey]?.sent;

  const handleToggleMusterSent = () => {
    const newRecord = markEmailAsSent(currentKey, !isMusterSent);
    setSentMap((prev) => ({
      ...prev,
      [currentKey]: newRecord,
    }));
  };

  const handleOpenMailer = () => {
    const subject = currentCustomEmail.subject;
    const body = currentCustomEmail.body;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    if (!isMusterSent) {
      handleToggleMusterSent();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCustomEmail.fullText);
    setCopiedId(currentMuster.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleCopyDoseUrl = () => {
    if (!linkedDoseUrl) return;
    navigator.clipboard.writeText(linkedDoseUrl);
    setCopiedDoseUrl(true);
    setTimeout(() => setCopiedDoseUrl(false), 2000);
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
              ? 'Jede Mail ist ein bedingungsloses Geschenk (CC0). Sie enthält keine Terminanfrage, keine Bitte um Feedback und kein Nachfassen. Der Empfänger erhält einen direkten Einzelseiten-Link zur Dose und die ausdrückliche Erlaubnis, nicht zu antworten.'
              : isEs
              ? 'Cada correo es un regalo incondicional (CC0). Contiene el enlace directo a la página única de la lata y permiso explícito para no responder.'
              : 'Every message is an unconditional gift under CC0. It contains a direct single-page link to the tin and explicit permission not to reply.'}
          </p>
        </div>
      </div>

      {/* Linked Dose Selector & Permanent URL Bar */}
      {dosen.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#fffdf9] border border-[#dfd1be] shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-typewriter uppercase tracking-wider font-bold text-[#8c1d40] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#c5832b]" />
                {isDe
                  ? 'Konkrete Dose für E-Mail & Link verknüpfen:'
                  : isEs
                  ? 'Vincular lata concreta al correo:'
                  : 'Link a specific Tin to this Email:'}
              </span>
              <p className="text-xs text-[#6b5849]">
                {isDe
                  ? 'Wähle eine Dose aus dem Archiv. Der E-Mail-Text wird automatisch mit Titel und dem permanenten Einzelseiten-URL aktualisiert.'
                  : isEs ? 'Elige una lata del archivo. La plantilla se actualiza sola con su título y su URL directa permanente.' : 'Select a tin from the archive. The template will automatically update with its title and permanent direct URL.'}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <select
                value={selectedDoseId}
                onChange={(e) => setSelectedDoseId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#faf5ec] border border-[#d8cbba] text-xs font-typewriter font-semibold text-[#2b1e16] focus:outline-none focus:ring-2 focus:ring-[#8c1d40]/30 cursor-pointer shadow-2xs"
              >
                {dosen.map((d) => (
                  <option key={d.id} value={d.id}>
                    {getLocalizedTitle(d, lang)} ({d.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Connected Dose Action Bar */}
          {linkedDose && (
            <div className="p-3.5 rounded-xl bg-[#faf5eb] border border-[#e4d7c5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-typewriter font-bold text-[#2b1e16] truncate">
                  {linkedDoseTitle}
                </span>
                <span className="font-mono-code text-[11px] text-[#8b6f57] bg-white px-2 py-0.5 rounded border border-[#dfd1be] hidden md:inline truncate max-w-xs">
                  {linkedDoseUrl}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Copy URL */}
                <button
                  type="button"
                  onClick={handleCopyDoseUrl}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-[#d8cbba] font-typewriter text-xs font-semibold text-[#5c4a3d] cursor-pointer transition-colors"
                  title="Dose-Link in Zwischenablage kopieren"
                >
                  {copiedDoseUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5 text-[#c5832b]" />}
                  <span>{copiedDoseUrl ? (isDe ? 'Kopiert!' : isEs ? '¡Copiado!' : 'Copied!') : (isDe ? 'Link zur Dose' : isEs ? 'Copiar URL de la lata' : 'Copy Tin URL')}</span>
                </button>

                {/* Open in Single Page */}
                {onOpenSinglePage && (
                  <button
                    type="button"
                    onClick={() => onOpenSinglePage(linkedDose)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8c1d40] hover:bg-[#741533] text-white font-typewriter text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{isDe ? 'Einzelseite öffnen' : isEs ? 'Abrir página' : 'Open Single Page'}</span>
                  </button>
                )}

                {/* Open in Modal / Pop-up */}
                {onOpenModal && (
                  <button
                    type="button"
                    onClick={() => onOpenModal(linkedDose)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-[#d8cbba] font-typewriter text-xs font-semibold text-[#5c4a3d] cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#8c1d40]" />
                    <span>{isDe ? 'Pop-up' : isEs ? 'Ventana emergente' : 'Pop-up'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
          const isSent = !!sentMap[`muster-${m.id}-${selectedDoseId}`]?.sent;

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
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-typewriter uppercase tracking-widest font-bold block ${
                      isSelected ? 'text-[#f6bd60]' : 'text-[#8c1d40]'
                    }`}
                  >
                    {m.typeId.toUpperCase()}
                  </span>
                  {isSent && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-900 text-emerald-200 border border-emerald-600'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-500" />
                      <span>{isDe ? 'Versendet' : isEs ? 'Enviados' : 'Sent'}</span>
                    </span>
                  )}
                </div>
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
        {/* Sent Banner */}
        {isMusterSent && (
          <div className="p-3.5 bg-emerald-50 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">
                  {isDe
                    ? `✓ Als versendet markiert für « ${linkedDoseTitle} »`
                    : `✓ Marked as sent for "${linkedDoseTitle}"`}
                </span>
                <span className="text-emerald-700 block sm:inline sm:ml-2 text-[11px]">
                  {isDe ? 'Amélie-Pledge: Niemals nachfassen.' : isEs ? 'Compromiso Amélie: sin seguimiento.' : 'Amélie Pledge: No follow-ups.'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleMusterSent}
              className="inline-flex items-center gap-1 text-[11px] font-typewriter text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isDe ? 'Rückgängig' : isEs ? 'Deshacer' : 'Undo'}</span>
            </button>
          </div>
        )}

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
                {isMusterSent && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ {isDe ? 'Versendet' : isEs ? 'Enviados' : 'Sent'}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold font-amelie text-[#2b1e16] mt-1">
                {isDe ? currentMuster.titleDe : currentMuster.titleEn}
              </h3>
              <p className="text-xs text-[#6b5849] mt-0.5">
                <span className="font-semibold">{t.ui.target_audience}{' '}</span>
                {isDe ? currentMuster.targetDe : currentMuster.targetEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Mark as Sent Toggle */}
              <button
                type="button"
                onClick={handleToggleMusterSent}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-typewriter font-bold transition-all shadow-2xs cursor-pointer ${
                  isMusterSent
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
                title={isMusterSent ? (isDe ? 'Status ändern' : isEs ? 'Cambiar estado' : 'Toggle status') : ''}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {isMusterSent
                    ? (isDe ? '✓ Versendet (Ändern)' : isEs ? '✓ Enviado (cambiar)' : '✓ Sent (Toggle)')
                    : (isDe ? 'Als versendet markieren' : isEs ? 'Marcar como enviado' : 'Mark as sent')}
                </span>
              </button>

              {/* Open in Mailer */}
              <button
                type="button"
                onClick={handleOpenMailer}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#dfd1be] text-[#2b1e16] text-xs font-typewriter font-semibold transition-colors shadow-2xs cursor-pointer"
                title={isDe ? 'Im lokalen Mail-Programm öffnen' : isEs ? 'Abrir en el cliente de correo local' : 'Open in local mail client'}
              >
                <Send className="w-3.5 h-3.5 text-[#8c1d40]" />
                <span>{isDe ? 'In Mailer öffnen' : isEs ? 'Abrir en el correo' : 'Open in Mailer'}</span>
              </button>

              {/* Copy Template */}
              <button
                type="button"
                onClick={handleCopy}
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
              {currentCustomEmail.subject}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-typewriter text-[#8b6f57] uppercase tracking-wider block">
              {t.ui.message_text}
            </span>
            <div className="p-5 sm:p-6 rounded-xl bg-[#fcf8f0] border border-[#dfd1be] font-typewriter text-xs sm:text-sm text-[#2b1e16] whitespace-pre-wrap leading-relaxed shadow-inner">
              {currentCustomEmail.body}
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


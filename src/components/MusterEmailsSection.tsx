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
} from 'lucide-react';
import { AMELIE_MUSTERS, AMELIE_ANTI_PATTERNS, MusterEmail } from '../data/musterEmails';
import { DoseItem, Language } from '../types';
import { getTranslation, getLocalizedTitle } from '../i18n';
import { getDeliveryDoseUrl } from '../utils/doseUrl';
import { loadDeliveryStateForDose } from '../services/ideaDeliveryService';

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
  const [isMusterSent, setIsMusterSent] = useState(false);
  const [musterSentLoading, setMusterSentLoading] = useState(true);
  const t = getTranslation(lang);

  const isDe = lang === 'de';
  const isEs = lang === 'es';

  // Whether the linked Dose has been delivered comes from its 05-dosen/*.md
  // frontmatter now, not a per-template localStorage toggle — fetched
  // asynchronously whenever the selected Dose changes.
  useEffect(() => {
    let active = true;
    setMusterSentLoading(true);
    loadDeliveryStateForDose(selectedDoseId)
      .then((state) => {
        if (active) setIsMusterSent(state.sent);
      })
      .catch((err) => {
        console.warn('Failed to load delivery state from 05-dosen/ frontmatter:', err);
      })
      .finally(() => {
        if (active) setMusterSentLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedDoseId]);

  const currentMuster = AMELIE_MUSTERS.find((m) => m.id === selectedMusterId) || AMELIE_MUSTERS[0];
  const linkedDose = dosen.find((d) => d.id === selectedDoseId) || dosen[0] || null;

  const linkedDoseUrl = linkedDose ? getDeliveryDoseUrl(linkedDose.id) : '';
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

  const handleOpenMailer = () => {
    const subject = currentCustomEmail.subject;
    const body = currentCustomEmail.body;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    // Marking as sent happens by updating the Dose's status in
    // src/data/dosen.ts and re-running scripts/sync-idea-frontmatter.mjs.
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
      <div className="rounded-2xl bg-gradient-to-br from-[var(--m-surface-2)] via-[#f5ede1] to-[#eedfcb] border border-[var(--m-line-strong)] p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute right-3 top-2 select-none pointer-events-none opacity-5 hidden sm:block">
          <div className="font-amelie text-9xl font-bold text-[var(--m-accent)]">LETTRE</div>
        </div>

        <div className="max-w-3xl space-y-3 relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--m-accent)]/10 border border-[var(--m-accent)]/25 text-[var(--m-accent)] text-xs font-typewriter font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>
                {isDe
                  ? 'MUSTER-E-MAILS · AMÉLIE-PHILOSOPHIE'
                  : isEs
                  ? 'MUESTRAS DE CORREO · FILOSOFÍA AMÉLIE'
                  : 'SAMPLE EMAILS · AMÉLIE PHILOSOPHY'}
              </span>
            </span>
            <span className="text-[11px] font-typewriter text-[var(--m-muted)]">
              {isDe
                ? '✦ Einmal senden, nie nachfassen ✦'
                : isEs
                ? '✦ Enviar una sola vez, nunca insistir ✦'
                : '✦ Send once, never follow up ✦'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-amelie text-[var(--m-ink)] tracking-tight">
            {isDe
              ? 'Muster-E-Mails nach den fünf Amélie-Regeln'
              : isEs
              ? 'Muestras de correo según las cinco reglas de Amélie'
              : 'Sample Outbound Emails Following Amélie Philosophy'}
          </h2>
          <p className="text-sm sm:text-base text-[var(--m-ink-2)] leading-relaxed font-sans">
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
        <div className="p-5 rounded-2xl bg-[var(--m-surface)] border border-[var(--m-line)] shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-typewriter uppercase tracking-wider font-bold text-[var(--m-accent)] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[var(--m-copper)]" />
                {isDe
                  ? 'Konkrete Dose für E-Mail & Link verknüpfen:'
                  : isEs
                  ? 'Vincular lata concreta al correo:'
                  : 'Link a specific Tin to this Email:'}
              </span>
              <p className="text-xs text-[var(--m-ink-3)]">
                {isDe
                  ? 'Wähle eine Dose aus dem Archiv. Der E-Mail-Text wird automatisch mit Titel und dem permanenten Einzelseiten-URL aktualisiert.'
                  : isEs ? 'Elige una lata del archivo. La plantilla se actualiza sola con su título y su URL directa permanente.' : 'Select a tin from the archive. The template will automatically update with its title and permanent direct URL.'}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <select
                value={selectedDoseId}
                onChange={(e) => setSelectedDoseId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#faf5ec] border border-[var(--m-line-strong)] text-xs font-typewriter font-semibold text-[var(--m-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--m-accent)]/30 cursor-pointer shadow-2xs"
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
            <div className="p-3.5 rounded-xl bg-[var(--m-surface-2)] border border-[var(--m-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-typewriter font-bold text-[var(--m-ink)] truncate">
                  {linkedDoseTitle}
                </span>
                <span className="font-mono-code text-[11px] text-[var(--m-muted)] bg-white px-2 py-0.5 rounded border border-[var(--m-line)] hidden md:inline truncate max-w-xs">
                  {linkedDoseUrl}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Copy URL */}
                <button
                  type="button"
                  onClick={handleCopyDoseUrl}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-[var(--m-line-strong)] font-typewriter text-xs font-semibold text-[var(--m-ink-2)] cursor-pointer transition-colors"
                  title="Dose-Link in Zwischenablage kopieren"
                >
                  {copiedDoseUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5 text-[var(--m-copper)]" />}
                  <span>{copiedDoseUrl ? (isDe ? 'Kopiert!' : isEs ? '¡Copiado!' : 'Copied!') : (isDe ? 'Link zur Dose' : isEs ? 'Copiar URL de la lata' : 'Copy Tin URL')}</span>
                </button>

                {/* Open in Single Page */}
                {onOpenSinglePage && (
                  <button
                    type="button"
                    onClick={() => onOpenSinglePage(linkedDose)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--m-accent)] hover:bg-[var(--m-accent-strong)] text-white font-typewriter text-xs font-bold cursor-pointer transition-colors shadow-2xs"
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-[var(--m-line-strong)] font-typewriter text-xs font-semibold text-[var(--m-ink-2)] cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--m-accent)]" />
                    <span>{isDe ? 'Pop-up' : isEs ? 'Ventana emergente' : 'Pop-up'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* The 6 Golden Amélie Email Pillars */}
      <div className="p-5 rounded-2xl bg-[var(--m-surface)] border border-[var(--m-line)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-typewriter uppercase tracking-widest font-bold text-[var(--m-accent)]">
          <Sparkles className="w-4 h-4 text-[var(--m-gold)]" />
          <span>{t.pillars.title}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-[#4a3728]">
          <div className="p-3 rounded-xl bg-[var(--m-surface-2)] border border-[var(--m-line)] space-y-1">
            <span className="font-bold text-[var(--m-accent)] block">{t.pillars.p1_title}</span>
            <p>{t.pillars.p1_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--m-surface-2)] border border-[var(--m-line)] space-y-1">
            <span className="font-bold text-[var(--m-accent)] block">{t.pillars.p2_title}</span>
            <p>{t.pillars.p2_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--m-surface-2)] border border-[var(--m-line)] space-y-1">
            <span className="font-bold text-[var(--m-accent)] block">{t.pillars.p3_title}</span>
            <p>{t.pillars.p3_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--m-surface-2)] border border-[var(--m-line)] space-y-1">
            <span className="font-bold text-[var(--m-accent)] block">{t.pillars.p4_title}</span>
            <p>{t.pillars.p4_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--m-surface-2)] border border-[var(--m-line)] space-y-1">
            <span className="font-bold text-[var(--m-accent)] block">{t.pillars.p5_title}</span>
            <p>{t.pillars.p5_desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--m-surface-2)] border border-[var(--m-accent)]/30 bg-[var(--m-accent)]/5 space-y-1">
            <span className="font-bold text-[var(--m-accent)] block">{t.pillars.p6_title}</span>
            <p>{t.pillars.p6_desc}</p>
          </div>
        </div>
      </div>

      {/* Template Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AMELIE_MUSTERS.map((m) => {
          const isSelected = selectedMusterId === m.id;
          // Sent-ness is a property of the linked Dose, not of which sample
          // template is being viewed — same value for every card here.
          const isSent = isMusterSent;

          return (
            <button
              key={m.id}
              onClick={() => setSelectedMusterId(m.id)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[var(--m-accent)] text-white border-[var(--m-accent-strong)] shadow-md ring-2 ring-[var(--m-gold)]/40'
                  : 'bg-[var(--m-surface)] text-[var(--m-ink)] border-[var(--m-line)] hover:border-[var(--m-accent)]/40 hover:bg-[#faf5ec]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-typewriter uppercase tracking-widest font-bold block ${
                      isSelected ? 'text-[var(--m-gold)]' : 'text-[var(--m-accent)]'
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
                  isSelected ? 'text-stone-200' : 'text-[var(--m-ink-3)]'
                }`}
              >
                {isDe ? m.targetDe : m.targetEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Template Card */}
      <div className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] overflow-hidden shadow-xs">
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
            <span className="text-[11px] font-typewriter text-emerald-700">
              {isDe
                ? 'Status kommt aus der Dose (05-dosen/)'
                : isEs ? 'El estado viene de la lata (05-dosen/)' : 'Status comes from the tin (05-dosen/)'}
            </span>
          </div>
        )}

        {/* Card Header */}
        <div className="p-6 bg-[var(--m-surface-2)] border-b border-[var(--m-line)] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-typewriter px-2 py-0.5 rounded bg-[var(--m-accent)]/10 text-[var(--m-accent)] border border-[var(--m-accent)]/25 font-bold">
                  {currentMuster.typeId.toUpperCase()}
                </span>
                <span className="text-xs text-[var(--m-muted)] font-typewriter">
                  {t.ui.rules_applied}{' '}
                  {currentMuster.rulesApplied.map((r) => `#${r}`).join(' ')}
                </span>
                {isMusterSent && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ {isDe ? 'Versendet' : isEs ? 'Enviados' : 'Sent'}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold font-amelie text-[var(--m-ink)] mt-1">
                {isDe ? currentMuster.titleDe : currentMuster.titleEn}
              </h3>
              <p className="text-xs text-[var(--m-ink-3)] mt-0.5">
                <span className="font-semibold">{t.ui.target_audience}{' '}</span>
                {isDe ? currentMuster.targetDe : currentMuster.targetEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {musterSentLoading ? (
                <span className="text-xs font-typewriter text-stone-400 animate-pulse px-1">
                  {isDe ? 'Lädt Status …' : isEs ? 'Cargando estado …' : 'Loading status …'}
                </span>
              ) : (
                isMusterSent && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-typewriter font-bold bg-emerald-100 text-emerald-900 border border-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>{isDe ? '✓ Versendet' : isEs ? '✓ Enviado' : '✓ Sent'}</span>
                  </span>
                )
              )}

              {/* Open in Mailer */}
              <button
                type="button"
                onClick={handleOpenMailer}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[var(--m-line)] text-[var(--m-ink)] text-xs font-typewriter font-semibold transition-colors shadow-2xs cursor-pointer"
                title={isDe ? 'Im lokalen Mail-Programm öffnen' : isEs ? 'Abrir en el cliente de correo local' : 'Open in local mail client'}
              >
                <Send className="w-3.5 h-3.5 text-[var(--m-accent)]" />
                <span>{isDe ? 'In Mailer öffnen' : isEs ? 'Abrir en el correo' : 'Open in Mailer'}</span>
              </button>

              {/* Copy Template */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--m-accent)] hover:bg-[var(--m-accent-strong)] text-white text-xs font-typewriter font-bold transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                {copiedId === currentMuster.id ? (
                  <>
                    <Check className="w-4 h-4 text-[var(--m-gold)]" />
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
          <div className="p-3.5 rounded-xl bg-white border border-[var(--m-line)] text-xs text-[var(--m-ink-2)] space-y-1">
            <span className="font-bold text-[var(--m-accent)] block font-typewriter">
              ✦ {t.ui.why_tone}
            </span>
            <p>{isDe ? currentMuster.contextDe : currentMuster.contextEn}</p>
          </div>
        </div>

        {/* Email Body in Typewriter Style */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-typewriter text-[var(--m-muted)] uppercase tracking-wider block">
              {t.ui.subject_line}
            </span>
            <div className="p-3 rounded-xl bg-[#fcf8f0] border border-[var(--m-line)] font-typewriter text-xs sm:text-sm font-bold text-[var(--m-ink)]">
              {currentCustomEmail.subject}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-typewriter text-[var(--m-muted)] uppercase tracking-wider block">
              {t.ui.message_text}
            </span>
            <div className="p-5 sm:p-6 rounded-xl bg-[#fcf8f0] border border-[var(--m-line)] font-typewriter text-xs sm:text-sm text-[var(--m-ink)] whitespace-pre-wrap leading-relaxed shadow-inner">
              {currentCustomEmail.body}
            </div>
          </div>

          {/* Key Strengths */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-typewriter uppercase tracking-wider text-[var(--m-green)] font-bold block">
              ✦ {t.ui.strengths}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(isDe ? currentMuster.keyStrengthsDe : currentMuster.keyStrengthsEn).map((str, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#3d2f23]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--m-green-2)] shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Anti-Patterns (Was nach Amélie strikt verboten ist) */}
      <section className="space-y-4 pt-4 border-t border-[var(--m-line)]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#b91c1c]" />
          <h3 className="text-lg font-bold font-amelie text-[var(--m-ink)]">
            {t.anti.heading}
          </h3>
        </div>
        <p className="text-xs text-[var(--m-ink-3)]">
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


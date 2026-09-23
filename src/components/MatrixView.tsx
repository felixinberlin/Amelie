import React, { useState, useEffect } from 'react';
import {
  Mail,
  Check,
  Copy,
  ExternalLink,
  Calendar,
  CheckSquare,
  Sparkles,
  Filter,
  Link2,
  Maximize2,
  Send,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { MatrixRow, DeliveryEmail, Language, DoseItem } from '../types';
import { getTranslation, getLocalizedTitle, withCount } from '../i18n';
import { resolveEmailBodyDoseUrls, getDoseUrl } from '../utils/doseUrl';
import { MusterEmailsSection } from './MusterEmailsSection';
import { getSentEmailsMap, markEmailAsSent, SentEmailRecord } from '../services/storageService';

interface MatrixViewProps {
  matrix: MatrixRow[];
  deliveries: DeliveryEmail[];
  dosen: DoseItem[];
  lang: Language;
  onSelectDoseById: (doseId: string) => void;
  onOpenSinglePageById?: (doseId: string) => void;
  onSwitchToUnpacked?: () => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  matrix,
  deliveries,
  dosen,
  lang,
  onSelectDoseById,
  onOpenSinglePageById,
  onSwitchToUnpacked,
}) => {
  const [activeSection, setActiveSection] = useState<'deliveries' | 'musters' | 'matrix'>('deliveries');
  const [selectedMailTab, setSelectedMailTab] = useState(0);
  const [copiedMailId, setCopiedMailId] = useState<string | null>(null);
  const [copiedDoseUrlId, setCopiedDoseUrlId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [mailFilter, setMailFilter] = useState<'all' | 'sent' | 'pending'>('all');
  const [sentEmails, setSentEmails] = useState<Record<string, SentEmailRecord>>(() => getSentEmailsMap());
  const t = getTranslation(lang);

  const isDe = lang === 'de';
  const isEs = lang === 'es';

  // Synchronize initial state or changes
  useEffect(() => {
    setSentEmails(getSentEmailsMap());
  }, []);

  const handleToggleSent = (mailId: string) => {
    const isCurrentlySent = !!sentEmails[mailId]?.sent;
    const newRecord = markEmailAsSent(mailId, !isCurrentlySent);
    setSentEmails((prev) => ({
      ...prev,
      [mailId]: newRecord,
    }));
  };

  const isEmailSent = (mailId: string): boolean => {
    if (sentEmails[mailId] !== undefined) {
      return !!sentEmails[mailId]?.sent;
    }
    const seedMail = deliveries.find((m) => m.id === mailId);
    return !!seedMail?.sent;
  };

  const getEmailSentDate = (mailId: string): string | null => {
    if (sentEmails[mailId]?.sentAt) {
      return sentEmails[mailId].sentAt;
    }
    const seedMail = deliveries.find((m) => m.id === mailId);
    return seedMail?.sentAt || null;
  };

  // Filtered deliveries list based on mailFilter
  const filteredDeliveries = deliveries.filter((m) => {
    const sent = isEmailSent(m.id);
    if (mailFilter === 'sent') return sent;
    if (mailFilter === 'pending') return !sent;
    return true;
  });

  const totalSentCount = deliveries.filter((m) => isEmailSent(m.id)).length;

  // Safe selected mail tab
  const activeMailIndex = deliveries.findIndex((d) => d.id === (filteredDeliveries[selectedMailTab]?.id || deliveries[selectedMailTab]?.id));
  const currentMail = deliveries[activeMailIndex >= 0 ? activeMailIndex : 0] || deliveries[0];
  const isCurrentMailSent = isEmailSent(currentMail.id);
  const currentMailSentDate = getEmailSentDate(currentMail.id);

  const handleCopyEmail = (mail: DeliveryEmail) => {
    const toLabel = isDe ? 'An:' : isEs ? 'Para:' : 'To:';
    const subjectLabel = isDe ? 'Betreff:' : isEs ? 'Asunto:' : 'Subject:';
    const rawBody = isDe ? mail.bodyDe : mail.bodyEn;
    const resolvedBody = resolveEmailBodyDoseUrls(rawBody, mail.doseLinks);
    const textToCopy = `${toLabel} ${mail.contactPathDe}\n${subjectLabel} ${isDe ? mail.subjectDe : mail.subjectEn}\n\n${resolvedBody}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMailId(mail.id);
    setTimeout(() => setCopiedMailId(null), 2000);
  };

  const handleOpenInEmailClient = (mail: DeliveryEmail) => {
    const rawBody = isDe ? mail.bodyDe : mail.bodyEn;
    const resolvedBody = resolveEmailBodyDoseUrls(rawBody, mail.doseLinks);
    const subject = isDe ? mail.subjectDe : mail.subjectEn;
    const emailMatch = mail.contactPathDe.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const to = emailMatch ? emailMatch[0] : '';
    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(resolvedBody)}`;
    window.open(mailtoUrl, '_blank');

    // Automatically mark as sent
    if (!isEmailSent(mail.id)) {
      handleToggleSent(mail.id);
    }
  };

  const handleCopyDoseUrl = (e: React.MouseEvent, doseId: string) => {
    e.stopPropagation();
    const url = getDoseUrl(doseId);
    navigator.clipboard.writeText(url);
    setCopiedDoseUrlId(doseId);
    setTimeout(() => setCopiedDoseUrlId(null), 2000);
  };

  const categories = Array.from(new Set(matrix.map((m) => (lang === 'de' ? m.categoryDe : m.categoryEn))));

  const filteredMatrix = matrix.filter((row) => {
    const matchesCat =
      selectedCategory === 'all' ||
      (lang === 'de' ? row.categoryDe : row.categoryEn) === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || row.status === selectedStatus;
    return matchesCat && matchesStatus;
  });

  const getVerdictLabel = (verdict: string) => {
    if (verdict === 'gift') return lang === 'de' ? '🎁 Verschenken' : lang === 'es' ? '🎁 Regalar' : '🎁 Gift';
    if (verdict === 'build_first') return lang === 'de' ? '🔨 Erst bauen' : lang === 'es' ? '🔨 Construir primero' : '🔨 Build first';
    if (verdict === 'keep') return lang === 'de' ? '🔒 Behalten' : lang === 'es' ? '🔒 Conservar' : '🔒 Kept';
    return lang === 'de' ? '🗑️ Entsorgt' : lang === 'es' ? '🗑️ Descartada' : '🗑️ Discarded';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'gepackt') return lang === 'de' ? 'gepackt' : lang === 'es' ? 'empaquetada' : 'packed';
    if (status === 'entsorgt') return lang === 'de' ? 'entsorgt' : lang === 'es' ? 'descartada' : 'discarded';
    if (status === 'gebaut') return lang === 'de' ? 'gebaut' : lang === 'es' ? 'construida' : 'built';
    if (status === 'zugestellt') return lang === 'de' ? 'zugestellt' : lang === 'es' ? 'entregada' : 'delivered';
    return status;
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Sub-Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#ede3d1]/80 border border-[#d8cbba] max-w-2xl shadow-2xs">
        <button
          onClick={() => setActiveSection('deliveries')}
          className={`flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-typewriter font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'deliveries'
              ? 'bg-[#8c1d40] text-white shadow-xs'
              : 'text-[#5c4a3d] hover:text-[#2b1e16] hover:bg-[#faf4e8]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === 'de' ? 'Q4 Zustellungen (3)' : lang === 'es' ? 'Entregas Q4 (3)' : 'Q4 Deliveries (3)'}</span>
        </button>

        <button
          onClick={() => setActiveSection('musters')}
          className={`flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-typewriter font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'musters'
              ? 'bg-[#8c1d40] text-white shadow-xs ring-2 ring-[#f6bd60]/40'
              : 'text-[#5c4a3d] hover:text-[#2b1e16] hover:bg-[#faf4e8]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>{lang === 'de' ? 'Muster-E-Mails (4)' : lang === 'es' ? 'Modelos de correo (4)' : 'Sample Emails (4)'}</span>
        </button>

        <button
          onClick={() => setActiveSection('matrix')}
          className={`flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-typewriter font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'matrix'
              ? 'bg-[#8c1d40] text-white shadow-xs'
              : 'text-[#5c4a3d] hover:text-[#2b1e16] hover:bg-[#faf4e8]'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>{lang === 'de' ? 'Ideen-Matrix (19)' : lang === 'es' ? 'Matriz de ideas (19)' : 'Idea Matrix (19)'}</span>
        </button>
      </div>

      {/* SECTION: MUSTER-EMAILS */}
      {activeSection === 'musters' && (
        <MusterEmailsSection
          lang={lang}
          dosen={dosen}
          onOpenSinglePage={(d) => onOpenSinglePageById && onOpenSinglePageById(d.id)}
          onOpenModal={(d) => onSelectDoseById(d.id)}
        />
      )}

      {/* SECTION 1: Q4 2026 DELIVERY PLAN */}
      {activeSection === 'deliveries' && (
      <section className="space-y-6">
        <div className="rounded-2xl bg-amber-900/5 border border-amber-800/20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-amber-800" />
                <span>{t.ui.deliveries_badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
                {withCount(t.ui.deliveries_heading, deliveries.length)}
              </h2>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                {t.ui.deliveries_subheading}
              </p>
            </div>

            {/* Delivery Progress & Quick Stats */}
            <div className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-2.5 shrink-0 min-w-[240px]">
              <div className="flex items-center justify-between text-xs font-mono-code font-bold">
                <span className="text-stone-700">{isDe ? 'Status Q4 2026:' : isEs ? 'Estado Q4 2026:' : 'Q4 2026 Status:'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {totalSentCount} / {deliveries.length} {isDe ? 'versendet' : isEs ? 'enviados' : 'sent'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(totalSentCount / deliveries.length) * 100}%` }}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1 pt-1 text-[11px] font-mono-code">
                <button
                  type="button"
                  onClick={() => setMailFilter('all')}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                    mailFilter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {isDe ? 'Alle' : isEs ? 'Todos' : 'All'} ({deliveries.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMailFilter('sent')}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                    mailFilter === 'sent' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {isDe ? 'Versendet' : isEs ? 'Enviados' : 'Sent'} ({totalSentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setMailFilter('pending')}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                    mailFilter === 'pending' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {isDe ? 'Ausstehend' : isEs ? 'Pendientes' : 'Pending'} ({deliveries.length - totalSentCount})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Email Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredDeliveries.map((mail, idx) => {
            const isSelected = currentMail.id === mail.id;
            const sent = isEmailSent(mail.id);
            const sentDate = getEmailSentDate(mail.id);

            return (
              <button
                key={mail.id}
                onClick={() => {
                  const originalIndex = deliveries.findIndex((d) => d.id === mail.id);
                  if (originalIndex >= 0) setSelectedMailTab(originalIndex);
                }}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-800 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-[#fdfbf7] text-stone-800 border-stone-200 hover:border-amber-800/30 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                    <span
                      className={`font-mono-code font-bold uppercase tracking-wider ${
                        isSelected ? 'text-amber-400' : 'text-amber-800'
                      }`}
                    >
                      Mail {mail.mailIndex}
                    </span>

                    {sent ? (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-700'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>{isDe ? 'Versendet' : isEs ? 'Enviado' : 'Sent'}</span>
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {isDe ? 'Ausstehend' : isEs ? 'Listos' : 'Ready'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold font-serif-title line-clamp-2">
                    {isDe ? mail.titleDe : mail.titleEn}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/40 flex items-center justify-between text-xs">
                  <p
                    className={`line-clamp-1 text-[11px] ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {mail.recipientOrg}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Email View */}
        <div className="bg-[#fdfbf7] rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-0">
          {/* Status Alert Banner */}
          {isCurrentMailSent ? (
            <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="flex items-start sm:items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">
                      {isDe ? '✓ Diese E-Mail ist als versendet markiert' : isEs ? '✓ Este correo está marcado como enviado' : '✓ This email is marked as sent'}
                    </span>
                    {currentMailSentDate && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 font-mono-code text-[11px] text-emerald-800 border border-emerald-300">
                        {isDe ? 'Datum:' : isEs ? 'Fecha:' : 'Date:'} {currentMailSentDate.split('T')[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    {isDe
                      ? 'Geschenk übergeben (CC0). Gemäß Amélie-Pledge wird niemals nachgefasst oder um Feedback gebeten.'
                      : isEs ? 'Regalo entregado (CC0). Según el compromiso Amélie, nunca se enviará seguimiento.' : 'Gift handed over (CC0). Per the Amélie Pledge, no follow-up will ever be sent.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSent(currentMail.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-emerald-300 text-emerald-800 text-xs font-mono-code font-semibold cursor-pointer transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
                title={isDe ? 'Als ungesendet zurücksetzen' : isEs ? 'Marcar de nuevo como no enviado' : 'Reset as unsend'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isDe ? 'Als ungesendet markieren' : isEs ? 'Marcar como no enviado' : 'Mark as unsend'}</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50/80 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  {isDe
                    ? 'Status: Versandbereit für Q4 2026 · Noch nicht versendet'
                    : isEs ? 'Estado: listo para enviar en Q4 2026 · aún no enviado' : 'Status: Ready for dispatch Q4 2026 · Not yet sent'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSent(currentMail.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isDe ? 'Als versendet markieren' : isEs ? 'Marcar como enviado' : 'Mark as sent'}</span>
              </button>
            </div>
          )}

          {/* Email Header Info */}
          <div className="p-6 bg-stone-100/70 border-b border-stone-200 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-amber-800 font-bold">
                    {isDe ? currentMail.recipientTypeDe : currentMail.recipientTypeEn}
                  </span>
                  {isCurrentMailSent && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ {isDe ? 'Versendet' : isEs ? 'Enviados' : 'Sent'}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-serif-title text-stone-900">
                  {currentMail.recipientOrg}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  <span className="font-semibold">{isDe ? 'Kontaktweg: ' : isEs ? 'Canal de contacto: ' : 'Contact route: '}</span>
                  {isDe ? currentMail.contactPathDe : currentMail.contactPathEn}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Mark as Sent Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleSent(currentMail.id)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all shadow-xs cursor-pointer ${
                    isCurrentMailSent
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                  title={isCurrentMailSent ? (isDe ? 'Klicken, um Status zu ändern' : isEs ? 'Clic para cambiar' : 'Click to toggle') : ''}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isCurrentMailSent
                      ? (isDe ? '✓ Versendet (Ändern)' : isEs ? '✓ Enviado' : '✓ Sent (Toggle)')
                      : (isDe ? 'Als versendet markieren' : isEs ? 'Marcar como enviado' : 'Mark as sent')}
                  </span>
                </button>

                {/* Open in Email Client (mailto:) */}
                <button
                  type="button"
                  onClick={() => handleOpenInEmailClient(currentMail)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-mono-code font-semibold transition-colors shadow-xs cursor-pointer"
                  title={isDe ? 'Im lokalen E-Mail-Programm öffnen (mailto:)' : isEs ? 'Abrir en el cliente de correo local (mailto:)' : 'Open in local mail client (mailto:)'}
                >
                  <Send className="w-3.5 h-3.5 text-stone-700" />
                  <span>{isDe ? 'In Mailer öffnen' : isEs ? 'Abrir en el correo' : 'Open in Mailer'}</span>
                </button>

                {/* Copy Email Text */}
                <button
                  type="button"
                  onClick={() => handleCopyEmail(currentMail)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                >
                  {copiedMailId === currentMail.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{t.ui.email_copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.ui.copy_email}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="pt-3 border-t border-stone-200/80">
              <span className="text-xs font-bold font-mono-code uppercase tracking-wider text-stone-600 block mb-2">
                {lang === 'de' ? 'Vorab-Prüfung & Verifikation:' : lang === 'es' ? 'Verificación previa al envío:' : 'Pre-flight Verification:'}
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700">
                {(lang === 'de'
                  ? [
                      'Empfänger hat die Kapazität oder das Mandat zum Bauen',
                      'Kein kommerzielles Konkurrenzprodukt; offene Datenbasis vorhanden',
                      'Ticket #1 in 2 Tagen umsetzbar',
                      'Amélie-Pledge angehängt, niemals nachfassen',
                    ]
                  : lang === 'es'
                  ? [
                      'El destinatario tiene la capacidad o mandato para construirlo',
                      'Sin conflicto comercial; datos abiertos disponibles',
                      'Ticket #1 ejecutable en 2 días',
                      'Compromiso Amélie adjunto, sin seguimiento posterior',
                    ]
                  : [
                      'Recipient has the capacity or mandate to build',
                      'Zero commercial conflict; open data foundation exists',
                      'Ticket #1 verifiable in 2 days',
                      'Amélie Pledge attached, strict no-follow-up policy',
                    ]
                ).map((check, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-stone-200/60">
                    <CheckSquare className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Linked Tins */}
            {currentMail.doseLinks && currentMail.doseLinks.length > 0 && (
              <div className="pt-3 border-t border-stone-200/80 space-y-2">
                <span className="text-xs font-mono-code text-stone-600 block">
                  {lang === 'de' ? 'Verlinkte Dosen (Einzelseite & URL):' : lang === 'es' ? 'Latas vinculadas (página y URL):' : 'Linked Tins (Single Page & URL):'}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentMail.doseLinks.map((doseId) => {
                    const linkedDose = dosen.find((d) => d.id === doseId);
                    const isCopied = copiedDoseUrlId === doseId;
                    return (
                      <div
                        key={doseId}
                        className="inline-flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-medium shadow-2xs"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenSinglePageById) {
                              onOpenSinglePageById(doseId);
                            } else {
                              onSelectDoseById(doseId);
                            }
                          }}
                          className="hover:underline font-bold flex items-center gap-1 text-[#8c1d40]"
                          title={lang === 'de' ? 'Als Einzelseite öffnen' : lang === 'es' ? 'Abrir como página' : 'Open as Single Page'}
                        >
                          <span>🎁 {linkedDose ? linkedDose.title : doseId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <span className="text-amber-300">|</span>

                        <button
                          type="button"
                          onClick={() => onSelectDoseById(doseId)}
                          className="text-[11px] font-mono-code text-stone-600 hover:text-stone-900 px-1 py-0.5 rounded hover:bg-amber-200/70"
                          title={lang === 'de' ? 'Im Popup öffnen' : lang === 'es' ? 'Abrir en ventana emergente' : 'Open in popup'}
                        >
                          Popup
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleCopyDoseUrl(e, doseId)}
                          className="p-1 rounded text-stone-600 hover:text-amber-900 hover:bg-amber-200/80 transition-colors"
                          title={isCopied ? 'URL kopiert!' : 'Dosen-URL kopieren'}
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-700" /> : <Link2 className="w-3 h-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Email Body Preview */}
          <div className="p-6 md:p-8 space-y-4">
            <div>
              <span className="text-xs text-stone-400 font-mono-code block mb-1">
                {lang === 'de' ? 'Betreff:' : lang === 'es' ? 'Asunto:' : 'Subject:'}
              </span>
              <div className="p-3 bg-stone-100 rounded-lg text-sm font-semibold font-mono-code text-stone-800 border border-stone-200">
                {lang === 'de' ? currentMail.subjectDe : currentMail.subjectEn}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-stone-400 font-mono-code block">
                  {lang === 'de' ? 'Nachricht (mit generierten Dosen-URLs):' : lang === 'es' ? 'Mensaje (con URLs generadas):' : 'Body (with generated tin URLs):'}
                </span>
                <span className="text-[11px] font-mono-code text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {lang === 'de' ? '« Link zur Dose » aufgelöst' : lang === 'es' ? '« Enlace a la lata » resuelto' : '« Link zur Dose » resolved'}
                </span>
              </div>
              <pre className="p-5 rounded-xl bg-[#2a2723] text-stone-200 text-xs font-mono-code whitespace-pre-wrap leading-relaxed overflow-x-auto border border-stone-800 max-h-96">
                {resolveEmailBodyDoseUrls(lang === 'de' ? currentMail.bodyDe : currentMail.bodyEn, currentMail.doseLinks)}
              </pre>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* SECTION 2: THE 19-IDEA MATRIX */}
      {activeSection === 'matrix' && (
      <section className="space-y-6 pt-6 border-t border-stone-200">
        {onSwitchToUnpacked && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950 font-serif-title">
                  {lang === 'de' ? 'Neue ungepackte Dosen-Ideen (Schritt 0,5)' : lang === 'es' ? 'Nuevas ideas aún no empaquetadas (Paso 0.5)' : 'New Not Yet Packed Tin Candidates (Step 0.5)'}
                </h3>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  {lang === 'de'
                    ? 'Recherchierte Lücken (Glasanflug-Ampel, Brettchen-Vorsortierer, Streiflicht...) im Ideenspeicher prüfen & packen.'
                    : lang === 'es'
                    ? 'Brechas investigadas (semáforo de colisión con cristal, pre-clasificador de nidos, luz rasante...) listas para inspeccionar y empaquetar.'
                    : 'Surveyed gaps (Glass hazard score, Bee nesting annotator, Grazing light...) ready to inspect & pack.'}
                </p>
              </div>
            </div>
            <button
              onClick={onSwitchToUnpacked}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <span>{lang === 'de' ? 'Zum Ideenspeicher →' : lang === 'es' ? 'Ver candidatas →' : 'View Candidate Pipeline →'}</span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-serif-title text-stone-900 tracking-tight">
              {t.ui.matrix_heading}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {withCount(t.ui.matrix_subheading, matrix.length)}
            </p>
          </div>

          {/* Category & Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-700 shadow-xs"
            >
              <option value="all">{lang === 'de' ? 'Alle Kategorien' : lang === 'es' ? 'Todas las categorías' : 'All Categories'}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-700 shadow-xs"
            >
              <option value="all">{lang === 'de' ? 'Alle Status' : lang === 'es' ? 'Todos los estados' : 'All Statuses'}</option>
              <option value="gepackt">{lang === 'de' ? 'gepackt (bereit)' : lang === 'es' ? 'empaquetada (lista)' : 'packed (ready)'}</option>
              <option value="entsorgt">{lang === 'de' ? 'entsorgt' : lang === 'es' ? 'descartada' : 'discarded'}</option>
              <option value="zugestellt">{lang === 'de' ? 'zugestellt' : lang === 'es' ? 'entregada' : 'delivered'}</option>
              <option value="gebaut">{lang === 'de' ? 'gebaut' : lang === 'es' ? 'construida' : 'built'}</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-[#fdfbf7] rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-mono-code uppercase">
                  <th className="py-3.5 px-4 font-semibold">{lang === 'de' ? 'Idee & Aufwand' : lang === 'es' ? 'Idea y Esfuerzo' : 'Idea & Effort'}</th>
                  <th className="py-3.5 px-4 font-semibold">{lang === 'de' ? 'Verdikt' : lang === 'es' ? 'Veredicto' : 'Verdict'}</th>
                  <th className="py-3.5 px-4 font-semibold">{t.ui.recipient}</th>
                  <th className="py-3.5 px-4 font-semibold">{lang === 'de' ? 'Kanal' : lang === 'es' ? 'Canal' : 'Channel'}</th>
                  <th className="py-3.5 px-4 font-semibold">{lang === 'de' ? 'Hook' : lang === 'es' ? 'Gancho' : 'Pitch Hook'}</th>
                  <th className="py-3.5 px-4 font-semibold">{lang === 'de' ? 'Status' : lang === 'es' ? 'Estado' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {filteredMatrix.map((row) => {
                  const isDiscarded = row.status === 'entsorgt';
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-amber-50/50 transition-colors ${
                        isDiscarded ? 'bg-stone-50/60 opacity-70' : ''
                      }`}
                    >
                      {/* Name & Effort */}
                      <td className="py-3 px-4 font-medium text-stone-900">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {getLocalizedTitle({ id: row.doseId || row.id, title: row.name, titleEn: row.nameEn }, lang)}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-mono-code text-xs">
                            {row.effort}
                          </span>
                        </div>
                        {row.doseId && (
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (onOpenSinglePageById) {
                                  onOpenSinglePageById(row.doseId!);
                                } else {
                                  onSelectDoseById(row.doseId!);
                                }
                              }}
                              className="text-[#8c1d40] hover:underline text-xs flex items-center gap-1 font-semibold"
                              title={lang === 'de' ? 'Einzelseite & URL' : lang === 'es' ? 'Página única y URL' : 'Single Page & URL'}
                            >
                              <span>{t.ui.open_tin}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-stone-300">·</span>
                            <button
                              type="button"
                              onClick={() => onSelectDoseById(row.doseId!)}
                              className="text-stone-500 hover:text-stone-800 text-[11px] font-mono-code"
                              title={lang === 'de' ? 'Im Popup öffnen' : lang === 'es' ? 'Abrir en ventana emergente' : 'Open in popup'}
                            >
                              Popup
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleCopyDoseUrl(e, row.doseId!)}
                              className="p-0.5 text-stone-400 hover:text-stone-700"
                              title={copiedDoseUrlId === row.doseId ? (lang === 'de' ? 'URL kopiert!' : lang === 'es' ? '¡URL copiada!' : 'URL copied!') : (lang === 'de' ? 'URL kopieren' : lang === 'es' ? 'Copiar URL' : 'Copy URL')}
                            >
                              {copiedDoseUrlId === row.doseId ? (
                                <Check className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <Link2 className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Verdict */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            row.verdict === 'gift'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.verdict === 'build_first'
                              ? 'bg-amber-100 text-amber-900'
                              : row.verdict === 'keep'
                              ? 'bg-stone-200 text-stone-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {getVerdictLabel(row.verdict)}
                        </span>
                      </td>

                      {/* Recipient */}
                      <td className="py-3 px-4 text-stone-800 max-w-[200px]">
                        <span className="font-semibold block">
                          {lang === 'de' ? row.recipientsDe : row.recipientsEn}
                        </span>
                        <span className="text-stone-500 text-xs line-clamp-1">
                          {lang === 'de' ? row.beneficiaryDe : row.beneficiaryEn}
                        </span>
                      </td>

                      {/* Channel */}
                      <td className="py-3 px-4 text-stone-600 max-w-[150px]">
                        {lang === 'de' ? row.channelDe : row.channelEn}
                      </td>

                      {/* Hook */}
                      <td className="py-3 px-4 text-stone-700 italic font-serif-title max-w-[280px]">
                        {lang === 'de' ? row.hookDe : row.hookEn}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-mono-code font-bold ${
                            row.status === 'gepackt'
                              ? 'bg-emerald-100 text-emerald-900'
                              : row.status === 'entsorgt'
                              ? 'bg-rose-100 text-rose-900'
                              : row.status === 'gebaut'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-stone-200 text-stone-800'
                          }`}
                        >
                          {getStatusLabel(row.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

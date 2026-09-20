import React, { useState } from 'react';
import { Mail, Check, Copy, ExternalLink, Calendar, CheckSquare, Sparkles, Filter } from 'lucide-react';
import { MatrixRow, DeliveryEmail, Language, DoseItem } from '../types';
import { getTranslation, getLocalizedTitle } from '../i18n';
import { MusterEmailsSection } from './MusterEmailsSection';

interface MatrixViewProps {
  matrix: MatrixRow[];
  deliveries: DeliveryEmail[];
  dosen: DoseItem[];
  lang: Language;
  onSelectDoseById: (doseId: string) => void;
  onSwitchToUnpacked?: () => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  matrix,
  deliveries,
  dosen,
  lang,
  onSelectDoseById,
  onSwitchToUnpacked,
}) => {
  const [activeSection, setActiveSection] = useState<'deliveries' | 'musters' | 'matrix'>('deliveries');
  const [selectedMailTab, setSelectedMailTab] = useState(0);
  const [copiedMailId, setCopiedMailId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const t = getTranslation(lang);

  const currentMail = deliveries[selectedMailTab] || deliveries[0];

  const handleCopyEmail = (mail: DeliveryEmail) => {
    const isDe = lang === 'de';
    const isEs = lang === 'es';
    const toLabel = isDe ? 'An:' : isEs ? 'Para:' : 'To:';
    const subjectLabel = isDe ? 'Betreff:' : isEs ? 'Asunto:' : 'Subject:';
    const textToCopy = `${toLabel} ${mail.contactPathDe}\n${subjectLabel} ${isDe ? mail.subjectDe : mail.subjectEn}\n\n${isDe ? mail.bodyDe : mail.bodyEn}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMailId(mail.id);
    setTimeout(() => setCopiedMailId(null), 2000);
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
    if (status === 'gepackt') return lang === 'de' ? 'gepackt' : lang === 'es' ? 'empacada' : 'packed';
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
        <MusterEmailsSection lang={lang} />
      )}

      {/* SECTION 1: Q4 2026 DELIVERY PLAN */}
      {activeSection === 'deliveries' && (
      <section className="space-y-6">
        <div className="rounded-2xl bg-amber-900/5 border border-amber-800/20 p-6 md:p-8">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span>{t.ui.deliveries_badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
              {t.ui.deliveries_heading}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {t.ui.deliveries_subheading}
            </p>
          </div>
        </div>

        {/* Email Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {deliveries.map((mail, idx) => {
            const isSelected = selectedMailTab === idx;
            return (
              <button
                key={mail.id}
                onClick={() => setSelectedMailTab(idx)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-800 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-[#fdfbf7] text-stone-800 border-stone-200 hover:border-amber-800/30 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span
                    className={`font-mono-code font-bold uppercase tracking-wider ${
                      isSelected ? 'text-amber-400' : 'text-amber-800'
                    }`}
                  >
                    Mail {mail.mailIndex}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {lang === 'de' ? mail.scheduleDe.split('·')[0] : mail.scheduleEn.split('·')[0]}
                  </span>
                </div>
                <h4 className="text-sm font-bold font-serif-title line-clamp-1">
                  {lang === 'de' ? mail.titleDe : mail.titleEn}
                </h4>
                <p
                  className={`text-xs mt-1 line-clamp-1 ${
                    isSelected ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  {mail.recipientOrg}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Email View */}
        <div className="bg-[#fdfbf7] rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          {/* Email Header Info */}
          <div className="p-6 bg-stone-100/70 border-b border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono-code uppercase tracking-wider text-amber-800 font-bold">
                  {lang === 'de' ? currentMail.recipientTypeDe : currentMail.recipientTypeEn}
                </span>
                <h3 className="text-lg font-bold font-serif-title text-stone-900">
                  {currentMail.recipientOrg}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  <span className="font-semibold">{lang === 'de' ? 'Kontaktweg: ' : lang === 'es' ? 'Canal de contacto: ' : 'Contact route: '}</span>
                  {lang === 'de' ? currentMail.contactPathDe : currentMail.contactPathEn}
                </p>
              </div>

              <button
                onClick={() => handleCopyEmail(currentMail)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-xs"
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
              <div className="pt-3 border-t border-stone-200/80 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono-code text-stone-600">
                  {lang === 'de' ? 'Verlinkte Dosen:' : lang === 'es' ? 'Latas vinculadas:' : 'Linked Tins:'}
                </span>
                {currentMail.doseLinks.map((doseId) => {
                  const linkedDose = dosen.find((d) => d.id === doseId);
                  return (
                    <button
                      key={doseId}
                      onClick={() => onSelectDoseById(doseId)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-colors"
                    >
                      <span>🎁 {linkedDose ? linkedDose.title : doseId}</span>
                      <ExternalLink className="w-3 h-3 text-amber-700" />
                    </button>
                  );
                })}
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
              <span className="text-xs text-stone-400 font-mono-code block mb-1">
                {lang === 'de' ? 'Nachricht:' : lang === 'es' ? 'Mensaje:' : 'Body:'}
              </span>
              <pre className="p-5 rounded-xl bg-[#2a2723] text-stone-200 text-xs font-mono-code whitespace-pre-wrap leading-relaxed overflow-x-auto border border-stone-800 max-h-96">
                {lang === 'de' ? currentMail.bodyDe : currentMail.bodyEn}
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
                  {lang === 'de' ? 'Neue ungepackte Dosen-Ideen (Schritt 0,5)' : lang === 'es' ? 'Nuevas ideas aún no empacadas (Paso 0.5)' : 'New Not Yet Packed Tin Candidates (Step 0.5)'}
                </h3>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  {lang === 'de'
                    ? 'Recherchierte Lücken (Glasanflug-Ampel, Brettchen-Vorsortierer, Streiflicht...) im Ideenspeicher prüfen & packen.'
                    : lang === 'es'
                    ? 'Brechas investigadas (semáforo de colisión con cristal, pre-clasificador de nidos, luz rasante...) listas para inspeccionar y empacar.'
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
              {t.ui.matrix_subheading}
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
              <option value="gepackt">{lang === 'de' ? 'gepackt (bereit)' : lang === 'es' ? 'empacada (lista)' : 'packed (ready)'}</option>
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
                          <button
                            onClick={() => onSelectDoseById(row.doseId!)}
                            className="text-amber-800 hover:underline text-xs flex items-center gap-1 mt-0.5 font-medium"
                          >
                            <span>{t.ui.open_tin}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
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

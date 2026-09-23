import React, { useState } from 'react';
import {
  FileText,
  Lock,
  RefreshCw,
  CheckCircle2,
  Calendar,
  CheckSquare,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../../types';

interface KlarLokalSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

export const KlarLokalSimulator: React.FC<KlarLokalSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  const [selectedLetterKey, setSelectedLetterKey] = useState<'finanzamt' | 'jobcenter' | 'auslaenderbehoerde' | 'custom'>('finanzamt');
  const [customLetterText, setCustomLetterText] = useState<string>('');
  const [copiedExtension, setCopiedExtension] = useState<boolean>(false);
  const [isProcessingLocal, setIsProcessingLocal] = useState<boolean>(false);

  const sampleLetters = {
    finanzamt: {
      sender: 'Finanzamt Berlin-Neukölln',
      subject: 'Erinnerung an die Abgabe der Einkommensteuererklärung 2024 / Androhung von Zwangsgeld gem. § 328 AO',
      date: '18. September 2026',
      rawText: `Sehr geehrte/r Steuerpflichtige/r,

gemäß § 149 Abs. 2 der Abgabenordnung (AO) waren Sie verpflichtet, die Einkommensteuererklärung für das Kalenderjahr 2024 bis zum Ablauf der gesetzlichen Frist einzureichen. Ein Eingang der vorgenannten Erklärung konnte hierorts bis dato nicht festgestellt werden.

Ich fordere Sie hiermit auf, die ausstehende Steuererklärung nunmehr unverzüglich, spätestens jedoch bis zum

15. Oktober 2026

beim unterzeichnenden Finanzamt einzureichen.

Sollten Sie dieser Aufforderung nicht innerhalb der vorstehend genannten Frist nachkommen, wird gemäß § 162 AO eine Schätzung der Besteuerungsgrundlagen vorgenommen. Des Weiteren wird gemäß § 152 AO ein Verspätungszuschlag von mindestens 25 Euro für jeden angefangenen Monat der Säumnis festgesetzt sowie die Festsetzung eines Zwangsgeldes in Höhe von 500,00 Euro gem. § 328 AO angedroht.`,
      verdictDe: 'Das Finanzamt fordert Ihre Steuererklärung für 2024 nach, sonst schätzt es Ihr Einkommen nachteilig und verlangt 500 Euro Strafe.',
      verdictEn: 'The tax office demands your 2024 tax return; otherwise they will estimate your income unfavorably and fine you 500 Euros.',
      deadline: '15. Oktober 2026',
      daysLeft: 27,
      urgency: 'high' as const,
      checklistDe: [
        'Prüfen, ob alle Belege und Rechnungen für das Steuerjahr 2024 vorliegen.',
        'Wenn bis 15. Oktober nicht machbar: Heute noch den Muster-Fristverlängerungsantrag (unten) per Elster oder Einschreiben absenden.',
        'Steuererklärung online via Elster oder Steuersoftware finalisieren und einreichen.'
      ],
      checklistEn: [
        'Check that all receipts and income summaries for the tax year 2024 are ready.',
        'If not achievable by Oct 15: Send the one-page deadline extension request (template below) today via Elster or postal mail.',
        'Finalize and submit the 2024 declaration online using your preferred software or Elster.'
      ],
      extensionDraftDe: `Finanzamt Berlin-Neukölln
Steuernummer: [Ihre Steuernummer eintragen]

Betreff: Antrag auf Fristverlängerung zur Abgabe der Einkommensteuererklärung 2024
Ihr Schreiben vom 18.09.2026

Sehr geehrte Damen und Herren,

hiermit beantrage ich eine Verlängerung der Frist zur Einreichung meiner Einkommensteuererklärung für das Jahr 2024 bis zum 30. November 2026.

Begründung: Es stehen noch betriebliche Jahresabschlussbelege und Bankabrechnungen aus, die erst Ende Oktober vorliegen.

Ich bitte um eine kurze schriftliche Bestätigung.

Mit freundlichen Grüßen
[Ihr Name]`,
      extensionDraftEn: `Tax Office Berlin-Neukölln
Tax ID: [Insert your Tax ID]

Subject: Request for Deadline Extension for 2024 Income Tax Return
Reference: Letter dated 18.09.2026

Dear Sir or Madam,

I hereby request an extension of the deadline for submitting my 2024 income tax declaration until November 30, 2026.

Reason: Pending third-party business invoices and bank statements expected by late October.

I kindly request written confirmation of this extension.

Sincerely,
[Your Name]`
    },
    jobcenter: {
      sender: 'Jobcenter Berlin Mitte',
      subject: 'Aufforderung zur Mitwirkung nach § 60 Erstes Buch Sozialgesetzbuch (SGB I)',
      date: '17. September 2026',
      rawText: `Sehr geehrte/r Bürgergeldberechtigte/r,

für die Prüfung Ihres Weiterbewilligungsantrages auf Leistungen zur Sicherung des Lebensunterhalts nach dem SGB II werden noch ergänzende Nachweise benötigt.

Bitte reichen Sie bis zum

02. Oktober 2026

folgende Unterlagen lückenlos in Kopie ein:
1. Lückenlose Kontoauszüge aller vorhandenen Girokonten und Unterkonten der letzten drei Monate (Juli, August, September 2026).
2. Aktueller Nachweis über die tatsächliche Warmmiete (Heizkostenabrechnung des Vermieters vom laufenden Jahr).

Kommen Sie dieser Mitwirkungspflicht innerhalb der genannten Frist nicht nach, können die Leistungen ganz oder teilweise entzogen oder versagt werden, bis Sie die Mitwirkung nachholen (§§ 60, 66 SGB I). Dies bedeutet, dass zum 1. November 2026 keine Auszahlung erfolgt.`,
      verdictDe: 'Das Jobcenter verlangt Ihre Kontoauszüge und die Mietbescheinigung, sonst wird Ihre Bürgergeld-Zahlung ab November gestoppt.',
      verdictEn: 'The jobcenter demands bank statements and rent proof, otherwise your welfare payments will be halted in November.',
      deadline: '02. Oktober 2026',
      daysLeft: 14,
      urgency: 'critical' as const,
      checklistDe: [
        'Kontoauszüge von Juli, August und September 2026 als PDF herunterladen (Ausgaben mit religiösem/intimen Bezug dürfen geschwärzt werden).',
        'Kopie der aktuellen Heizkostenabrechnung des Vermieters bereitlegen.',
        'Unterlagen bis spätestens 02. Oktober online via Jobcenter.digital hochladen oder persönlich gegen Quittung einwerfen.'
      ],
      checklistEn: [
        'Download July, August, and September 2026 bank statements (sensitive private expenses may be redacted).',
        'Attach a copy of the landlord\'s current heating and rent utility statement.',
        'Submit via Jobcenter.digital or drop into mailbox with a receipt request before October 2.'
      ],
      extensionDraftDe: `Jobcenter Berlin Mitte
Bedarfsgemeinschaftsnummer (BG): [Ihre BG-Nummer]

Betreff: Antrag auf Fristverlängerung zur Mitwirkungspflicht
Ihr Schreiben vom 17.09.2026

Sehr geehrte Damen und Herren,

zur Erbringung der erbetenen Kontoauszüge und Unterlagen beantrage ich eine Fristverlängerung bis zum 16. Oktober 2026.

Begründung: Eine Bankbescheinigung über ein stillgelegtes Sparkonto liegt der Bank noch zur Ausfertigung vor.

Ich bitte um kurze Eingangsbestätigung.

Mit freundlichen Grüßen
[Ihr Name]`,
      extensionDraftEn: `Jobcenter Berlin Mitte
Case Reference (BG Number): [Insert BG Number]

Subject: Request for Extension of Deadline for Cooperation Requirements
Reference: Letter dated 17.09.2026

Dear Sir or Madam,

Regarding the requested bank statements and documentation, I request an extension until October 16, 2026.

Reason: A secondary account statement is currently pending retrieval from my bank branch.

Please confirm receipt of this notice.

Sincerely,
[Your Name]`
    },
    auslaenderbehoerde: {
      sender: 'Landesamt für Einwanderung (LEA Berlin)',
      subject: 'Anhörung gem. § 28 VwVfG zur beabsichtigten Versagung der Aufenthaltserlaubnis gem. § 21 AufenthG',
      date: '15. September 2026',
      rawText: `Sehr geehrte/r Antragsteller/in,

Sie haben die Verlängerung Ihrer Aufenthaltserlaubnis zur Ausübung einer selbständigen Tätigkeit nach § 21 AufenthG beantragt. Nach Prüfung der bisherigen Unterlagen bestehen Zweifel, ob Ihr Lebensunterhalt aus der selbständigen Tätigkeit dauerhaft eigenständig gesichert ist (§ 5 Abs. 1 Nr. 1 AufenthG).

Vor Erlass eines ablehnenden Verwaltungsaktes gebe ich Ihnen hiermit gem. § 28 Verwaltungsverfahrensgesetz (VwVfG) Gelegenheit, sich bis zum

20. Oktober 2026

zu den für die Entscheidung erheblichen Tatsachen schriftlich zu äußern und eine aktuelle betriebswirtschaftliche Auswertung (BWA) mit Summen- und Saldenliste sowie eine Prognose der Steuerberaterin für das Folgejahr vorzulegen.

Nach Ablauf der Anhörungsfrist wird nach Lage der Akten entschieden.`,
      verdictDe: 'Die Ausländerbehörde prüft, ob Ihr Einkommen als Selbstständige(r) reicht, und droht mit Ablehnung, wenn Sie bis zum 20. Oktober keine aktuellen BWA-Zahlen vorlegen.',
      verdictEn: 'The immigration office questions whether your freelance income is sustainable and warns of a rejection unless you submit an updated BWA profit summary by October 20.',
      deadline: '20. Oktober 2026',
      daysLeft: 32,
      urgency: 'high' as const,
      checklistDe: [
        'Sofort Steuerberaterin oder Buchhaltung für aktuelle BWA und Summen- und Saldenliste 2026 kontaktieren.',
        'Drei bezahlte Kundenrechnungen oder Verträge der letzten Monate als Beleg für zukünftige Einnahmen sammeln.',
        'Schriftliche Stellungnahme vor dem 20. Oktober per Einschreiben oder LEA-Upload-Portal einreichen.'
      ],
      checklistEn: [
        'Immediately ask tax accountant for updated 2026 BWA profit assessment and ledger.',
        'Collect 3 paid client invoices or signed contracts as proof of commercial pipeline.',
        'Submit written response and documents via certified mail or LEA upload before October 20.'
      ],
      extensionDraftDe: `Landesamt für Einwanderung (LEA Berlin)
Aktenzeichen: [Ihr Aktenzeichen eintragen]

Betreff: Anhörung nach § 28 VwVfG / Fristverlängerung zur Vorlage der BWA
Ihr Schreiben vom 15.09.2026

Sehr geehrte Damen und Herren,

zur Vorlage der erbetenen betriebswirtschaftlichen Auswertungen und Stellungnahme bitte ich um Verlängerung der Anhörungsfrist bis zum 15. November 2026.

Begründung: Die Quartalsbuchhaltung für Q3/2026 wird durch mein Steuerbüro erst Ende Oktober abgeschlossen.

Mit freundlichen Grüßen
[Ihr Name]`,
      extensionDraftEn: `State Immigration Office (LEA Berlin)
File Reference: [Insert Case Reference]

Subject: Hearing § 28 VwVfG / Deadline Extension for Accounting Submission
Reference: Letter dated 15.09.2026

Dear Sir or Madam,

Regarding the submission of business evaluations and financial reports, I request an extension of the response deadline until November 15, 2026.

Reason: Q3 2026 quarterly bookkeeping will only be finalized by my tax advisor in late October.

Sincerely,
[Your Name]`
    }
  };

  const activeLetter = selectedLetterKey === 'custom' ? {
    sender: 'Benutzerdefiniertes Behördenschreiben',
    subject: 'Eingefügter Bescheidtext',
    date: 'Aktuelles Datum',
    rawText: customLetterText || 'Bitte fügen Sie den Text eines amtlichen Schreibens ein...',
    verdictDe: 'Dieses Schreiben fordert Sie zu einer fristgebundenen Erklärung oder Nachreichung von Unterlagen auf.',
    verdictEn: 'This letter requests a formal clarification or submission of missing documents before a designated deadline.',
    deadline: 'Prüffrist aktiv (siehe Schreiben)',
    daysLeft: 21,
    urgency: 'high' as const,
    checklistDe: [
      'Genaue Frist und Aktenzeichen im oberen Briefkopf notieren.',
      'Geforderte Nachweise zusammentragen oder Fristverlängerung beantragen.',
      'Rückmeldung nachweisbar per Einschreiben oder Online-Portal absenden.'
    ],
    checklistEn: [
      'Note the exact case reference number and deadline from the letterhead.',
      'Gather required evidence or apply for an extension immediately.',
      'Submit verification via certified post or official digital citizen portal.'
    ],
    extensionDraftDe: `Sehr geehrte Damen und Herren,\n\nzu Ihrem Schreiben bitte ich hiermit um Fristverlängerung um 4 Wochen zur Zusammenstellung der geforderten Nachweise.\n\nMit freundlichen Grüßen`,
    extensionDraftEn: `Dear Sir or Madam,\n\nRegarding your notice, I hereby request an extension of 4 weeks to assemble the requested records.\n\nSincerely`
  } : sampleLetters[selectedLetterKey];

  const handleSimulateLocalInference = () => {
    setIsProcessingLocal(true);
    setTimeout(() => {
      setIsProcessingLocal(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner for KlarLokal */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-stone-100 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono-code mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Offline Edge-Compute · WebGPU · Zero Cloud Telemetry</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white tracking-tight">
              {lang === 'de' ? 'KlarLokal: Das Beamtendeutsch-Brecheisen' : lang === 'es' ? 'KlarLokal: el ariete contra la burocracia' : 'KlarLokal: The Bureaucracy Battering Ram'}
            </h3>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl font-serif-title">
              {lang === 'de'
                ? 'Wandelt amtliche Drohbescheide und Paragraphenketten lokal im Browser (DIN SPEC 33429 / Leichte Sprache) in drei beruhigende, exakte Fakten um: Das Urteil, die Frist und die Checkliste.'
                : lang === 'es' ? 'Descifra en el navegador, de forma local, cartas administrativas alemanas en tres datos claros: el veredicto, el plazo y la lista de acciones, sin que ningún dato salga del dispositivo.' : 'Locally decodes German administrative mail in-browser into three clear facts: The Verdict, The Deadline, and The Action Checklist, with zero data leaving the device.'}
            </p>
          </div>

          {/* Security Pill Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-950/90 p-3 rounded-xl border border-stone-800 text-center font-mono-code text-2xs">
            <div className="p-2 bg-stone-900 rounded-lg">
              <div className="text-stone-400 text-3xs uppercase">Network Out</div>
              <div className="text-emerald-400 font-bold text-sm">0 Bytes</div>
            </div>
            <div className="p-2 bg-stone-900 rounded-lg">
              <div className="text-stone-400 text-3xs uppercase">Standard</div>
              <div className="text-amber-400 font-bold text-sm">DIN 33429</div>
            </div>
            <div className="p-2 bg-stone-900 rounded-lg col-span-2 sm:col-span-1">
              <div className="text-stone-400 text-3xs uppercase">Engine</div>
              <div className="text-blue-400 font-bold text-sm">WebGPU</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Letter Selector & Raw German Bureaucracy Text */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-stone-700" />
              <h4 className="font-bold text-stone-900 font-serif-title text-base">
                {lang === 'de' ? '1. Behördenschreiben wählen oder einfügen' : lang === 'es' ? '1. Elige o pega una notificación oficial' : '1. Select or Paste Administrative Notice'}
              </h4>
            </div>
            <span className="text-2xs font-mono-code bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              Dose #18
            </span>
          </div>

          {/* Sample Letter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setSelectedLetterKey('finanzamt'); handleSimulateLocalInference(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLetterKey === 'finanzamt'
                  ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🏛️ Finanzamt Neukölln
            </button>
            <button
              type="button"
              onClick={() => { setSelectedLetterKey('jobcenter'); handleSimulateLocalInference(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLetterKey === 'jobcenter'
                  ? 'bg-red-100 text-red-950 font-bold border border-red-300 shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🏢 Jobcenter Mitte
            </button>
            <button
              type="button"
              onClick={() => { setSelectedLetterKey('auslaenderbehoerde'); handleSimulateLocalInference(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLetterKey === 'auslaenderbehoerde'
                  ? 'bg-blue-100 text-blue-950 font-bold border border-blue-300 shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🌍 LEA (Ausländerbehörde)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLetterKey('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLetterKey === 'custom'
                  ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              ✍️ Eigener Text
            </button>
          </div>

          {/* Raw Administrative Letter Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span className="font-mono-code font-medium">{activeLetter.sender}</span>
              <span className="font-mono-code text-3xs">{activeLetter.date}</span>
            </div>

            {selectedLetterKey === 'custom' ? (
              <textarea
                value={customLetterText}
                onChange={(e) => setCustomLetterText(e.target.value)}
                placeholder="Fügen Sie hier den Text Ihres amtlichen Schreibens ein (wird rein lokal im Browser verarbeitet)..."
                className="w-full h-64 p-3.5 bg-stone-50 border border-stone-300 rounded-xl font-mono-code text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <div className="p-3.5 bg-stone-50 border border-stone-300 rounded-xl font-serif text-xs text-stone-800 leading-relaxed max-h-72 overflow-y-auto space-y-2 shadow-inner">
                <div className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 font-sans text-xs">
                  {activeLetter.subject}
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs text-stone-700 leading-relaxed">
                  {activeLetter.rawText}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="inline-flex items-center gap-1.5 text-2xs text-stone-500">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Kein Serverkontakt · Lokale WebLLM-Inferenz</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateLocalInference}
                disabled={isProcessingLocal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-mono-code font-bold rounded-lg transition-all shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isProcessingLocal ? 'animate-spin' : ''}`} />
                <span>{isProcessingLocal ? 'WebGPU rechnet...' : 'Lokal destillieren'}</span>
              </button>
            </div>
          </div>

          {/* DIN SPEC 33429 Rule Checklist */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>DIN SPEC 33429 Qualitätsfilter aktiv:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-2xs pt-1 font-mono-code text-stone-500">
              <div>✓ Keine Schachtelsätze &gt; 15 Wörter</div>
              <div>✓ Konjunktiv restlos eliminiert</div>
              <div>✓ Nominalstil in Verben übersetzt</div>
              <div>✓ Paragraphen in Klarsinn aufgelöst</div>
            </div>
          </div>
        </div>

        {/* Right Column: The 3 Structured Outputs */}
        <div className="lg:col-span-6 space-y-4">
          {/* Output 1: Das Urteil (The Verdict) */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-2xs font-mono-code uppercase tracking-wider text-stone-500 font-bold">
                {lang === 'de' ? '1. Das Urteil (Kernaussage)' : lang === 'es' ? '1. El veredicto (en lenguaje claro)' : '1. The Verdict (Plain Language)'}
              </span>
              <span className="px-2 py-0.5 rounded text-3xs font-mono-code bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                DIN SPEC 33429
              </span>
            </div>
            <p className="text-base font-bold text-stone-900 leading-snug font-serif-title">
              „{lang === 'de' ? activeLetter.verdictDe : activeLetter.verdictEn}"
            </p>
            <div className="text-2xs text-stone-500 font-sans">
              {lang === 'de'
                ? 'Ohne juristische Drohkulisse auf den Punkt gebracht.'
                : lang === 'es' ? 'Sin intimidación, resumido en una sola frase humana.' : 'Stripped of intimidation, condensed into a single human sentence.'}
            </div>
          </div>

          {/* Output 2: Die Frist (The Deadline) */}
          <div className={`rounded-2xl border p-5 shadow-xs space-y-2 ${
            activeLetter.urgency === 'critical'
              ? 'bg-red-50/80 border-red-200'
              : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
              <span className="text-2xs font-mono-code uppercase tracking-wider text-stone-700 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-800" />
                <span>{lang === 'de' ? '2. Die Frist' : lang === 'es' ? '2. El plazo' : '2. The Deadline'}</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-3xs font-mono-code font-bold ${
                activeLetter.urgency === 'critical'
                  ? 'bg-red-200 text-red-900 border border-red-300'
                  : 'bg-amber-200 text-amber-900 border border-amber-300'
              }`}>
                {activeLetter.daysLeft} {lang === 'de' ? 'Tage verbleibend' : lang === 'es' ? 'días restantes' : 'days left'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold font-mono-code text-stone-900">
                {activeLetter.deadline}
              </div>
              <div className="text-xs font-sans text-stone-600">
                {activeLetter.urgency === 'critical'
                  ? (lang === 'de' ? '⚠️ Dringend: Leistungsausfall droht' : lang === 'es' ? '⚠️ Crítico: se congelan las prestaciones' : '⚠️ Critical: Benefits freeze')
                  : (lang === 'de' ? '⏰ Feste Ausschlussfrist' : lang === 'es' ? '⏰ Plazo legal' : '⏰ Regulatory limit')}
              </div>
            </div>
          </div>

          {/* Output 3: Die Checkliste (Action Checklist) */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-2xs font-mono-code uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'de' ? '3. Die Checkliste (Genau 3 Schritte)' : lang === 'es' ? '3. El plan de acción en 3 pasos' : '3. The 3-Step Action Plan'}</span>
              </span>
              <span className="text-3xs font-mono-code text-stone-400">Schritt für Schritt</span>
            </div>
            <ol className="space-y-2.5">
              {(lang === 'de' ? activeLetter.checklistDe : activeLetter.checklistEn).map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-stone-800">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-mono-code font-bold flex items-center justify-center text-3xs border border-stone-300">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* One-Click Muster-Fristverlängerung */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-mono-code text-amber-300">
                  {lang === 'de' ? 'Panik-Bremse: Muster-Fristverlängerung' : lang === 'es' ? 'Antipánico: plantilla de prórroga' : 'Anti-Panic: Extension Template'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(lang === 'de' ? activeLetter.extensionDraftDe : activeLetter.extensionDraftEn);
                  setCopiedExtension(true);
                  setTimeout(() => setCopiedExtension(false), 2200);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-2xs font-mono-code transition-all border border-stone-700"
              >
                {copiedExtension ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-stone-300" />}
                <span>{copiedExtension ? (lang === 'de' ? 'Kopiert!' : lang === 'es' ? '¡Copiado!' : 'Copied!') : (lang === 'de' ? 'Vorlage kopieren' : lang === 'es' ? 'Copiar borrador' : 'Copy Draft')}</span>
              </button>
            </div>
            <p className="text-2xs text-stone-400 font-sans leading-relaxed">
              {lang === 'de'
                ? 'Kopieren und sofort per Elster, Jobcenter.digital oder Post einreichen, um die Frist sanktionsfrei um bis zu 4 Wochen nach hinten zu schieben:'
                : lang === 'es' ? 'Cópialo y envíalo de inmediato por el portal oficial o por correo certificado para suspender legalmente la ejecución hasta 4 semanas:' : 'Copy and submit immediately via official portal or certified mail to legally suspend enforcement by up to 4 weeks:'}
            </p>
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-2xs font-mono-code text-stone-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {lang === 'de' ? activeLetter.extensionDraftDe : activeLetter.extensionDraftEn}
            </div>

            {onOpenDose && (
              <div className="pt-2 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => onOpenDose('klarlokal')}
                  className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs flex items-center gap-1 font-semibold"
                >
                  <span>{lang === 'de' ? 'Dose: KlarLokal öffnen' : lang === 'es' ? 'Abrir lata: KlarLokal' : 'Open Tin: KlarLokal'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

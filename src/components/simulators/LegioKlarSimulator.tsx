import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Thermometer,
  ShieldAlert,
  Copy,
  Check,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { Language } from '../../types';
import {
  analysiereLaborbefund,
  erzeugeMieterSchreibenEntwurf,
  LaborbefundInput,
  ProbeBefund
} from '../../engine/legio-klar/legioKlarEngine';

interface LegioKlarSimulatorProps {
  lang: Language;
  isEmbedded?: boolean;
}

const DEFAULT_SAMPLE_PROBES: ProbeBefund[] = [
  {
    id: 'P01',
    entnahmestelle: 'Keller: Warmwasserspeicher Austritt',
    entnahmeTyp: 'speicheraustritt',
    kbePro100ml: 0,
    temperaturC: 58.5
  },
  {
    id: 'P02',
    entnahmestelle: 'Keller: Zirkulationssammler Rücklauf',
    entnahmeTyp: 'zirkulationsruecklauf',
    kbePro100ml: 240,
    temperaturC: 51.2
  },
  {
    id: 'P03',
    entnahmestelle: 'Steigstrang B (4. OG rechts, Bad Dusche)',
    entnahmeTyp: 'steigstrang',
    kbePro100ml: 1800,
    temperaturC: 47.0
  },
  {
    id: 'P04',
    entnahmestelle: 'Steigstrang A (EG, Leerstand Zapfstelle)',
    entnahmeTyp: 'steigstrang',
    kbePro100ml: 12500,
    temperaturC: 23.5
  }
];

export const LegioKlarSimulator: React.FC<LegioKlarSimulatorProps> = ({
  lang,
  isEmbedded = false
}) => {
  const [probes, setProbes] = useState<ProbeBefund[]>(DEFAULT_SAMPLE_PROBES);
  const [speicherTemp, setSpeicherTemp] = useState<number>(58.5);
  const [zirkulationTemp, setZirkulationTemp] = useState<number>(51.2);
  const [showRealNoticePhoto, setShowRealNoticePhoto] = useState<boolean>(true);
  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);

  // Form input for letter drafting
  const [tenantName, setTenantName] = useState<string>('Familie Mustermieter');
  const [apartmentLocation, setApartmentLocation] = useState<string>('3. OG rechts');
  const [propertyAddress, setPropertyAddress] = useState<string>('Musterstraße 24, 12345 Berlin');
  const [landlordCompany, setLandlordCompany] = useState<string>('Hausverwaltung WohnGlück GmbH');

  const befundInput: LaborbefundInput = {
    probeDatum: '2026-09-15',
    anlage: {
      gebaeudeTyp: 'Mehrfamilienhaus 24 WE',
      speicherTemperaturC: speicherTemp,
      zirkulationRuecklaufC: zirkulationTemp
    },
    proben: probes
  };

  const analyse = analysiereLaborbefund(befundInput);
  const letterDraft = erzeugeMieterSchreibenEntwurf({
    mieterName: tenantName,
    wohnungLage: apartmentLocation,
    vermieterOderVerwaltung: landlordCompany,
    gebaeudeAdresse: propertyAddress,
    analyse,
    aushangDatum: '12.10.2026'
  });

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(letterDraft);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  const updateProbeKbe = (index: number, val: number) => {
    const updated = [...probes];
    updated[index] = { ...updated[index], kbePro100ml: Math.max(0, val) };
    setProbes(updated);
  };

  const getBadgeClass = (farbe: 'gruen' | 'gelb' | 'orange' | 'rot') => {
    switch (farbe) {
      case 'gruen':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'gelb':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'orange':
        return 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30';
      case 'rot':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
    }
  };

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : 'max-w-5xl mx-auto p-4'}`}>
      {/* Title & Introduction */}
      <div className="bg-[var(--m-card-bg)] border border-[var(--m-line)] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium mb-2 border border-blue-500/20">
              <Building className="w-3.5 h-3.5" />
              <span>TrinkwV § 31 / § 51 / § 52 Decoder</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--m-ink)]">
              {lang === 'de'
                ? 'LegioKlar: Treppenhaus-Aushang & Laborbefund-Decoder'
                : lang === 'es'
                ? 'LegioKlar: Decodificador de Avisos de Legionella en Escalera'
                : 'LegioKlar: Stairwell Notice Board Legionella Report Decoder'}
            </h3>
            <p className="text-sm text-[var(--m-ink-2)] mt-1">
              {lang === 'de'
                ? 'Übersetzt Fachchinesisch aus Laborprüfberichten (KBE/100ml, DVGW W 551) in die offizielle UBA-Risikomatrix und erzeugt sofort eine rechtssichere Mängelanzeige.'
                : 'Decodes complex laboratory microbiological results into official German UBA risk tiers and generates instant formal defect notices under § 536c BGB.'}
            </p>
          </div>
          <button
            onClick={() => setShowRealNoticePhoto(!showRealNoticePhoto)}
            className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--m-line)] hover:bg-[var(--m-card-hover)] transition-colors text-[var(--m-ink)]"
          >
            <ImageIcon className="w-4 h-4 text-blue-500" />
            <span>{showRealNoticePhoto ? (lang === 'de' ? 'Foto ausblenden' : 'Hide Photo') : (lang === 'de' ? 'Echtes Aushang-Foto zeigen' : 'Show Notice Photo')}</span>
          </button>
        </div>
      </div>

      {/* Real Notice Board Photo View */}
      {showRealNoticePhoto && (
        <div className="bg-[var(--m-card-bg)] border border-blue-500/30 rounded-2xl p-5 overflow-hidden animate-fadeIn">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 max-w-sm rounded-xl overflow-hidden border border-[var(--m-line)] shadow-md bg-stone-900">
              <img
                src={`${import.meta.env.BASE_URL}legio-klar/aushang-beispiel.jpg`}
                alt="Laborbefund Aushang im Treppenhaus"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-3 text-sm text-[var(--m-ink-2)]">
              <div className="inline-block font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                {lang === 'de' ? 'Dokumentarischer Vor-Ort-Befund' : 'On-Site Notice Board Evidence'}
              </div>
              <h4 className="text-base font-bold text-[var(--m-ink)]">
                {lang === 'de' ? 'Wie der Aushang im Treppenhaus aussieht' : 'What the Hallway Notice Looks Like'}
              </h4>
              <p className="leading-relaxed">
                {lang === 'de'
                  ? 'Laborprüfberichte nach DIN EN ISO 11731 hängen oft nur wenige Tage im Hausflur. Für Mieter ist unklar: Was bedeutet ein Wert von 240 oder 1.800 KBE/100ml? Wann gilt ein Duschverbot? Und welche Pflichten hat die Hausverwaltung jetzt?'
                  : 'Test reports according to DIN EN ISO 11731 are pinned to bulletin boards. Most residents do not understand whether 240 or 1,800 CFU/100ml requires a shower ban or rent reduction.'}
              </p>
              <div className="p-3 rounded-lg bg-[var(--m-bg)] border border-[var(--m-line)] text-xs space-y-1 font-mono">
                <div>• Prüfnorm: DIN EN ISO 11731 / TrinkwV § 31</div>
                <div>• Technischer Maßnahmenwert: 100 KBE / 100 ml</div>
                <div>• Betreiberpflicht: Unverzügliche Meldung & Risikoabschätzung (§ 51)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls & Data Entry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[var(--m-card-bg)] border border-[var(--m-line)] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--m-ink)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                {lang === 'de' ? 'Messwerte der Entnahmestellen' : 'Sampling Location Values'}
              </h4>
              <span className="text-xs text-[var(--m-ink-3)] font-mono">KBE / 100 ml</span>
            </div>

            <div className="space-y-3">
              {probes.map((probe, idx) => (
                <div key={probe.id || idx} className="p-3 rounded-xl bg-[var(--m-bg)] border border-[var(--m-line)] space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium text-[var(--m-ink)]">
                    <span className="truncate pr-2">{probe.entnahmestelle}</span>
                    <span className="font-mono text-[var(--m-ink-2)]">{probe.temperaturC}°C</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="15000"
                      step="50"
                      value={probe.kbePro100ml}
                      onChange={(e) => updateProbeKbe(idx, parseInt(e.target.value) || 0)}
                      className="flex-1 accent-blue-600"
                    />
                    <input
                      type="number"
                      min="0"
                      value={probe.kbePro100ml}
                      onChange={(e) => updateProbeKbe(idx, parseInt(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-xs font-mono font-bold text-right rounded-md bg-[var(--m-card-bg)] border border-[var(--m-line)] text-[var(--m-ink)]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Temperatures */}
            <div className="pt-3 border-t border-[var(--m-line)] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--m-ink)] flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                {lang === 'de' ? 'Anlagentemperaturen (DVGW W 551)' : 'Plant Temperatures (DVGW W 551)'}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[var(--m-ink-2)] mb-1">Speicher (Soll ≥60°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={speicherTemp}
                    onChange={(e) => setSpeicherTemp(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 font-mono font-semibold rounded-lg bg-[var(--m-bg)] border border-[var(--m-line)] text-[var(--m-ink)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--m-ink-2)] mb-1">Zirkulation (Soll ≥55°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={zirkulationTemp}
                    onChange={(e) => setZirkulationTemp(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 font-mono font-semibold rounded-lg bg-[var(--m-bg)] border border-[var(--m-line)] text-[var(--m-ink)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Assessment & UBA Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Status Card */}
          <div className="bg-[var(--m-card-bg)] border border-[var(--m-line)] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--m-ink-2)]">
                {lang === 'de' ? 'UBA-Gesamtbewertung' : 'Overall UBA Assessment'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${getBadgeClass(analyse.gesamtAmpelFarbe)}`}>
                {analyse.gesamtStufe.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[var(--m-bg)] border border-[var(--m-line)]">
                <div className="text-xs text-[var(--m-ink-2)]">Maximalwert</div>
                <div className="text-lg font-bold font-mono text-[var(--m-ink)]">{analyse.maximalKbePro100ml} <span className="text-xs font-normal">KBE</span></div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--m-bg)] border border-[var(--m-line)]">
                <div className="text-xs text-[var(--m-ink-2)]">Maßnahmenwert (100)</div>
                <div className={`text-lg font-bold font-mono ${analyse.massnahmenwertUeberschritten ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {analyse.massnahmenwertUeberschritten ? 'Überschritten' : 'Eingehalten'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--m-bg)] border border-[var(--m-line)]">
                <div className="text-xs text-[var(--m-ink-2)]">Befallene Stellen</div>
                <div className="text-lg font-bold font-mono text-[var(--m-ink)]">
                  {analyse.betroffeneEntnahmestellenAnzahl} / {analyse.einzelbewertungen.length}
                </div>
              </div>
            </div>

            {/* Acute Danger Banner if Red */}
            {analyse.gesamtStufe === 'extrem_hohe_kontamination' && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex gap-3">
                <AlertOctagon className="w-5 h-5 shrink-0 text-rose-600" />
                <div className="space-y-1">
                  <div className="font-bold">Akute Gefahrenstufe (≥ 10.000 KBE/100 ml):</div>
                  <p>
                    Bei diesen Extremwerten ist ein behördliches Duschverbot oder der sofortige Einsatz endständiger Sterilfilter zwingend indiziert. Vermeiden Sie jegliches Einatmen von Warmwasser-Sprühnebel!
                  </p>
                </div>
              </div>
            )}

            {/* DVGW Temperature Findings */}
            {analyse.temperaturAbweichungen.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-[var(--m-ink)] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'de' ? 'Technische Mängel bei Wassertemperaturen:' : 'Temperature Deficiencies:'}</span>
                </div>
                <div className="space-y-1.5">
                  {analyse.temperaturAbweichungen.map((abw, i) => (
                    <div key={i} className="text-xs p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
                      <strong>{abw.messort}:</strong> {lang === 'de' ? abw.befundDe : abw.befundEn}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generated Tenant Letter Draft */}
          <div className="bg-[var(--m-card-bg)] border border-[var(--m-line)] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--m-ink)] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-500" />
                {lang === 'de' ? 'Mängelanzeige gem. § 536c BGB & § 51 TrinkwV' : 'Statutory Defect Notice & Disclosure Request'}
              </h4>
              <button
                onClick={handleCopyLetter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLetter ? (lang === 'de' ? 'Kopiert!' : 'Copied!') : (lang === 'de' ? 'Schreiben kopieren' : 'Copy Letter')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[var(--m-ink-3)] mb-0.5">Mietername</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[var(--m-bg)] border border-[var(--m-line)] text-[var(--m-ink)]"
                />
              </div>
              <div>
                <label className="block text-[var(--m-ink-3)] mb-0.5">Hausverwaltung</label>
                <input
                  type="text"
                  value={landlordCompany}
                  onChange={(e) => setLandlordCompany(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[var(--m-bg)] border border-[var(--m-line)] text-[var(--m-ink)]"
                />
              </div>
            </div>

            <pre className="p-3.5 rounded-xl bg-[var(--m-bg)] border border-[var(--m-line)] text-xs font-mono text-[var(--m-ink)] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {letterDraft}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

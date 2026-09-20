import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Sliders, Sun, Thermometer, ShieldAlert, CheckCircle2, AlertTriangle, Info, Play, RefreshCw, Layers, Droplets, CloudRain, Zap, BatteryCharging, Gauge, ArrowRight, Copy, Check, FileText, Lock, Clock, Calendar, CheckSquare, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { computeAltbau, effectiveWindowWidth } from '../services/altbauThermal';

interface InteractiveTinSandboxesProps {
  lang: Language;
  initialSandbox?: 'altbau' | 'glasanflug' | 'streiflicht' | 'wetink' | 'balkon' | 'regenwasser' | 'klarlokal' | 'crackflora';
}

export const InteractiveTinSandboxes: React.FC<InteractiveTinSandboxesProps> = ({
  lang,
  initialSandbox = 'altbau',
}) => {
  const [activeTab, setActiveTab] = useState<'altbau' | 'glasanflug' | 'streiflicht' | 'wetink' | 'balkon' | 'regenwasser' | 'klarlokal' | 'crackflora'>(initialSandbox);

  // -------------------------------------------------------------
  // SIMULATOR 1: Altbau Thermal (Wohnungsebene)
  // -------------------------------------------------------------
  const [wallType, setWallType] = useState<'brick_uninsulated' | 'brick_renovated' | 'solid_concrete'>('brick_uninsulated');
  const [windowGlazing, setWindowGlazing] = useState<'single' | 'double_old' | 'triple_modern'>('double_old');
  const [outsideTemp, setOutsideTemp] = useState<number>(-2);
  const [roomTemp, setRoomTemp] = useState<number>(20);
  const [windowTilted, setWindowTilted] = useState<boolean>(false);
  const [roomArea, setRoomArea] = useState<number>(22); // m² (Berliner Zimmer)
  const [roomWidth, setRoomWidth] = useState<number>(5.0); // m, Länge der Außenwand
  const [windowWidth, setWindowWidth] = useState<number>(2.4); // m, Höhe fest 1.9 m
  const [relHumidity, setRelHumidity] = useState<number>(50); // % rel. Raumluftfeuchte

  // Rough rule-of-thumb U-values (W/m²K), unchecked. Verify against TABULA / DIN 4108-4 before real use.
  const wallUValues = {
    brick_uninsulated: 1.7, // 38cm Vollziegel ungedämmt
    brick_renovated: 0.24,  // 38cm Ziegel + 14cm WDVS
    solid_concrete: 2.1,    // Betonwand unsaniert
  };
  const windowUValues = {
    single: 5.0,
    double_old: 2.8,
    triple_modern: 0.8,
  };

  const wallU = wallUValues[wallType];
  const windowU = windowUValues[windowGlazing];
  // Infiltration ventilation rate: normal 0.5/h, tilted window 3.0/h
  const airChangeRate = windowTilted ? 3.0 : 0.5;

  // Steady-state balance, everything as a band (see src/services/altbauThermal.ts)
  const altbau = computeAltbau({
    roomWidth, roomArea, windowWidth, wallU, windowU,
    airChange: airChangeRate, roomTemp, outsideTemp, relHumidity,
  });
  const tr3 = (de: string, en: string, es: string) => (lang === 'de' ? de : lang === 'es' ? es : en);
  const numLocale = lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-GB';
  const nf = (x: number, d = 1) => x.toLocaleString(numLocale, { minimumFractionDigits: d, maximumFractionDigits: d });
  const round10 = (x: number) => Math.round(x / 10) * 10;
  const heatAxisMax = Math.max(1000, Math.ceil((altbau.heatHigh * 1.15) / 500) * 500);
  const tempAxisMin = Math.floor(Math.min(outsideTemp, altbau.cornerLow, altbau.dewPoint) - 1);
  const tempAxisMax = Math.ceil(roomTemp + 0.5);
  const tempPos = (t: number) => `${(100 * (t - tempAxisMin)) / (tempAxisMax - tempAxisMin)}%`;
  const partTotal = altbau.hWall + altbau.hWindow + altbau.hVent;
  const effWindowWidth = effectiveWindowWidth(roomWidth, windowWidth);
  const altbauSlider = (
    id: string, label: string, valueText: string,
    min: number, max: number, step: number, value: number,
    onChange: (v: number) => void, hint?: string,
  ) => (
    <div>
      <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1">
        <label htmlFor={id}>{label}</label>
        <span className="font-mono-code font-bold text-amber-900">{valueText}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-800 cursor-pointer"
      />
      {hint && <div className="text-[10px] text-stone-400 font-mono-code mt-0.5">{hint}</div>}
    </div>
  );

  // -------------------------------------------------------------
  // SIMULATOR 2: Glasanflug-Ampel (LAG-VSW Standard)
  // -------------------------------------------------------------
  const [paneTransparency, setPaneTransparency] = useState<'clear' | 'tinted' | 'mirrored'>('clear');
  const [vegetationDistance, setVegetationDistance] = useState<'immediate' | 'medium' | 'none'>('immediate');
  const [throughVision, setThroughVision] = useState<boolean>(true); // Durchsicht (Eckverglasung / Korridor)
  const [patternType, setPatternType] = useState<'none' | 'dots_9x9' | 'stripes_5mm' | 'silhouettes'>('none');

  let birdRiskScore = 0;
  if (paneTransparency === 'mirrored') birdRiskScore += 45;
  else if (paneTransparency === 'clear') birdRiskScore += 30;
  else birdRiskScore += 15;

  if (vegetationDistance === 'immediate') birdRiskScore += 35; // Trees reflecting directly into glass
  else if (vegetationDistance === 'medium') birdRiskScore += 20;

  if (throughVision) birdRiskScore += 30;

  // Pattern mitigation
  if (patternType === 'dots_9x9') birdRiskScore = Math.max(5, birdRiskScore - 65);
  else if (patternType === 'stripes_5mm') birdRiskScore = Math.max(8, birdRiskScore - 60);
  else if (patternType === 'silhouettes') birdRiskScore = Math.max(25, birdRiskScore - 15); // Black bird stickers are ineffective!

  const birdTrafficLight: 'green' | 'amber' | 'red' =
    birdRiskScore < 25 ? 'green' : birdRiskScore < 50 ? 'amber' : 'red';

  // -------------------------------------------------------------
  // SIMULATOR 3: Streiflicht (Smartphone RTI Simulation)
  // -------------------------------------------------------------
  const [lightAngle, setLightAngle] = useState<number>(20); // 0° = grazing (horizontal), 90° = direct front
  const [lightAzimuth, setLightAzimuth] = useState<number>(45); // degrees around 360°
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeTab !== 'streiflicht') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 0, width, height);

    // Weathered sandstone stone base texture
    ctx.fillStyle = '#44403c';
    ctx.fillRect(20, 20, width - 40, height - 40);

    // Light direction vector
    const radAz = (lightAzimuth * Math.PI) / 180;
    const radEl = (lightAngle * Math.PI) / 180;
    const lx = Math.cos(radAz) * Math.cos(radEl);
    const ly = Math.sin(radAz) * Math.cos(radEl);
    const lz = Math.sin(radEl);

    // Render stone surface with virtual RTI normal-map relief
    // Sample text: "HIER RUHET IN GOTT / ANNO 1784"
    ctx.font = 'bold 26px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center';

    const text1 = 'ANNO DOMINI 1784';
    const text2 = 'HIER RUHET IN GOTT';
    const text3 = 'JOHANNES KOCH';

    // Relief intensity depends inversely on elevation angle (low angle = maximum grazing shadow)
    const grazingFactor = Math.max(0.1, 1.0 - lz);
    const shadowOffsetX = -lx * 8 * grazingFactor;
    const shadowOffsetY = -ly * 8 * grazingFactor;
    const highlightOffsetX = lx * 5 * grazingFactor;
    const highlightOffsetY = ly * 5 * grazingFactor;

    // If light is high (ambient/flat), contrast is nearly zero (weathered stone illegible to LLMs)
    // If light is low (Streiflicht), shadow cast reveals incision groove!
    const contrastRatio = Math.pow(grazingFactor, 1.8);

    // Shadow in engraved groove
    ctx.fillStyle = `rgba(15, 12, 10, ${0.15 + contrastRatio * 0.8})`;
    ctx.fillText(text1, width / 2 + shadowOffsetX, 85 + shadowOffsetY);
    ctx.fillText(text2, width / 2 + shadowOffsetX, 140 + shadowOffsetY);
    ctx.fillText(text3, width / 2 + shadowOffsetX, 195 + shadowOffsetY);

    // Highlight on opposite rim
    ctx.fillStyle = `rgba(235, 225, 210, ${0.05 + contrastRatio * 0.75})`;
    ctx.fillText(text1, width / 2 + highlightOffsetX, 85 + highlightOffsetY);
    ctx.fillText(text2, width / 2 + highlightOffsetX, 140 + highlightOffsetY);
    ctx.fillText(text3, width / 2 + highlightOffsetX, 195 + highlightOffsetY);

    // Base weathered text color
    ctx.fillStyle = `rgba(120, 113, 108, ${0.4 + (1 - contrastRatio) * 0.3})`;
    ctx.fillText(text1, width / 2, 85);
    ctx.fillText(text2, width / 2, 140);
    ctx.fillText(text3, width / 2, 195);

    // Draw virtual flashlight indicator in corner
    ctx.beginPath();
    ctx.arc(60, height - 60, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(28, 25, 23, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Direction line
    ctx.beginPath();
    ctx.moveTo(60, height - 60);
    ctx.lineTo(60 + Math.cos(radAz) * 20, height - 60 + Math.sin(radAz) * 20);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [activeTab, lightAngle, lightAzimuth]);

  // -------------------------------------------------------------
  // SIMULATOR 4: Wet Ink Capillary Diffusion
  // -------------------------------------------------------------
  const inkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [inkColor, setInkColor] = useState<'sepia' | 'cobalt' | 'sumi'>('sepia');

  const inkColors = {
    sepia: { stroke: 'rgba(80, 48, 24, 0.85)', bleed: 'rgba(120, 72, 36, 0.18)' },
    cobalt: { stroke: 'rgba(24, 48, 96, 0.85)', bleed: 'rgba(40, 80, 150, 0.16)' },
    sumi: { stroke: 'rgba(26, 26, 26, 0.9)', bleed: 'rgba(60, 60, 60, 0.15)' },
  };

  const clearInkCanvas = () => {
    const canvas = inkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#f8f5ee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // subtle paper texture fibers
    ctx.fillStyle = 'rgba(215, 205, 185, 0.15)';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }
  };

  useEffect(() => {
    if (activeTab === 'wetink') {
      clearInkCanvas();
    }
  }, [activeTab]);

  const drawInkPoint = (x: number, y: number) => {
    const canvas = inkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = inkColors[inkColor];

    // Core stroke
    ctx.fillStyle = colors.stroke;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Capillary bleed into fibers (anisotropic random radius)
    ctx.fillStyle = colors.bleed;
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 3 + Math.random() * 6;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 2 + Math.random() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    drawInkPoint(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    drawInkPoint(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerUp = () => setIsDrawing(false);

  // -------------------------------------------------------------
  // SIMULATOR 5: Balkonkraftwerk & Mieter-Strom Rechner
  // -------------------------------------------------------------
  const [balkonWatts, setBalkonWatts] = useState<number>(800);
  const [balkonOrientation, setBalkonOrientation] = useState<'south' | 'southeast_west' | 'east_west' | 'north'>('south');
  const [balkonTilt, setBalkonTilt] = useState<'vertical_90' | 'angled_30' | 'flat_0'>('vertical_90');
  const [balkonShade, setBalkonShade] = useState<'none' | 'partial' | 'heavy'>('none');
  const [householdBaseLoad, setHouseholdBaseLoad] = useState<'single' | 'couple' | 'family'>('couple');
  const [electricityPrice, setElectricityPrice] = useState<number>(0.36);
  const [hardwareCost, setHardwareCost] = useState<number>(420);

  const orientEff = { south: 1.0, southeast_west: 0.92, east_west: 0.78, north: 0.48 }[balkonOrientation];
  const tiltEff = { angled_30: 1.0, vertical_90: 0.74, flat_0: 0.86 }[balkonTilt];
  const shadeEff = { none: 1.0, partial: 0.78, heavy: 0.52 }[balkonShade];

  const annualYieldKwh = Math.round((balkonWatts / 1000) * 1020 * orientEff * tiltEff * shadeEff);
  const baseConsumptionRate = { single: 0.62, couple: 0.76, family: 0.89 }[householdBaseLoad];
  const sizeModifier = balkonWatts <= 400 ? 0.12 : balkonWatts <= 600 ? 0.05 : 0;
  const selfConsumptionRatio = Math.min(0.95, baseConsumptionRate + sizeModifier);

  const selfConsumedKwh = Math.round(annualYieldKwh * selfConsumptionRatio);
  const fedToGridKwh = Math.max(0, annualYieldKwh - selfConsumedKwh);
  const annualMoneySavedEur = Math.round(selfConsumedKwh * electricityPrice);
  const paybackYears = Number((hardwareCost / Math.max(15, annualMoneySavedEur)).toFixed(1));
  const co2AvoidedKg = Math.round(annualYieldKwh * 0.38);

  // -------------------------------------------------------------
  // SIMULATOR 6: Zisterne & Regenwasser-Autonomie
  // -------------------------------------------------------------
  const [roofAreaM2, setRoofAreaM2] = useState<number>(85);
  const [rainIndexMm, setRainIndexMm] = useState<number>(580);
  const [roofSurface, setRoofSurface] = useState<'tiles' | 'metal_sheet' | 'green_roof'>('tiles');
  const [cisternVolumeL, setCisternVolumeL] = useState<number>(1800);
  const [useForToilets, setUseForToilets] = useState<boolean>(true);
  const [gardenAreaM2, setGardenAreaM2] = useState<number>(140);

  const runoffCoeff = { tiles: 0.85, metal_sheet: 0.92, green_roof: 0.50 }[roofSurface];
  const filterEff = 0.90;
  const annualRainfallHarvestL = Math.round(roofAreaM2 * rainIndexMm * runoffCoeff * filterEff);

  const weeklyToiletNeedL = useForToilets ? 420 : 0;
  const weeklyGardenNeedL = Math.round(gardenAreaM2 * 7.5);
  const totalWeeklyNeedL = weeklyToiletNeedL + weeklyGardenNeedL;

  const droughtAutonomyDays = Math.round((cisternVolumeL / Math.max(10, totalWeeklyNeedL / 7)));
  const actualLitersUsedPerYear = Math.min(annualRainfallHarvestL, totalWeeklyNeedL * 32);
  const annualWaterSavingsEur = Number(((actualLitersUsedPerYear / 1000) * 4.25).toFixed(0));

  // -------------------------------------------------------------
  // SIMULATOR 7: KlarLokal (Das 100% Offline Beamtendeutsch-Brecheisen)
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // SIMULATOR 8: Crack Flora Watcher (Toughness Index & Pavement Lab)
  // -------------------------------------------------------------
  const [selectedPlantId, setSelectedPlantId] = useState<'dandelion' | 'plantain' | 'shepherd' | 'fleabane' | 'yarrow'>('dandelion');
  const [substrateType, setSubstrateType] = useState<'pure_asphalt' | 'deep_crack' | 'curb_joint' | 'mortar_wall'>('pure_asphalt');
  const [trafficExposure, setTrafficExposure] = useState<'high_foot' | 'medium_bike' | 'parked_car_tire' | 'low_quiet'>('high_foot');
  const [sunExposure, setSunExposure] = useState<'full_baking_sun' | 'variable_canyon' | 'subway_grate_humid'>('full_baking_sun');
  const [timeLapseWeek, setTimeLapseWeek] = useState<number>(4);
  const [exportedKrautschauData, setExportedKrautschauData] = useState<boolean>(false);

  const plantCatalog = {
    dandelion: {
      nameDe: 'Gewöhnlicher Löwenzahn (Taraxacum sect. Ruderalia)',
      nameEn: 'Common Dandelion (Taraxacum sect. Ruderalia)',
      baseHardiness: 7.2,
      superpowerDe: 'Pfahlwurzel erzeugt bis zu 10 bar osmotischen Turgordruck und sprengt Asphaltschichten.',
      superpowerEn: 'Taproot generates up to 10 bars of osmotic turgor pressure, fracturing solid bitumen layers.',
      urbanNicheDe: 'Dehnungsfugen, Bordsteinkanten, heiße Bushaltestellen',
      urbanNicheEn: 'Expansion seams, curbstones, sweltering bus station asphalt',
      chalkTag: '#Krautschau #Taraxacum #AsphaltPioneer',
      growthStages: [
        { week: 1, labelDe: 'Keimling in Bitumenspalte (2 mm)', labelEn: 'Seedling in bitumen seam (2 mm)' },
        { week: 2, labelDe: 'Blattrosette presst sich an den Asphalt', labelEn: 'Leaf rosette flattens against asphalt' },
        { week: 4, labelDe: 'Gelbe Blütenkrone trotzt Fußgänger-Schritten', labelEn: 'Bright flowerhead defying footsteps' },
        { week: 8, labelDe: 'Pusteblume streut Samen über den Kiezwind', labelEn: 'Seed clock launching parachutes in urban updrafts' }
      ]
    },
    plantain: {
      nameDe: 'Breitwegerich (Plantago major)',
      nameEn: 'Greater Plantain / Waybread (Plantago major)',
      baseHardiness: 8.5,
      superpowerDe: 'Extreme Trittfestigkeit durch elastische Blattadern; verträgt bis zu 250 Trittbelastungen pro Tag.',
      superpowerEn: 'Extreme compaction tolerance via elastic leaf veins; withstanding 250+ foot strikes daily.',
      urbanNicheDe: 'Kopfsteinpflaster, Schulhof-Risse, U-Bahn-Eingänge',
      urbanNicheEn: 'Cobblestone gaps, schoolyard cracks, subway station thresholds',
      chalkTag: '#Krautschau #PlantagoMajor #PavementTank',
      growthStages: [
        { week: 1, labelDe: 'Zweikeimblättrig in Mörtelfuge', labelEn: 'Cotyledons emerging from mortar' },
        { week: 2, labelDe: 'Flache, lederartige Schutzblätter etablieren sich', labelEn: 'Flat, leathery armor leaves ground themselves' },
        { week: 4, labelDe: 'Robuste Blütenähren widerstehen Tritten', labelEn: 'Tough flower spikes enduring pedestrian strides' },
        { week: 8, labelDe: 'Schleimige Samenkapseln haften an Schuhsohlen', labelEn: 'Sticky mucilaginous seeds hitching rides on shoe soles' }
      ]
    },
    shepherd: {
      nameDe: 'Hirtentäschelkraut (Capsella bursa-pastoris)',
      nameEn: 'Shepherd’s Purse (Capsella bursa-pastoris)',
      baseHardiness: 7.8,
      superpowerDe: 'Samen sondern bei Nässe klebrigen Schleim ab, der sie im Asphaltstaub wie Zement verankert.',
      superpowerEn: 'Seeds secrete adhesive mucilage upon rainfall, cementing themselves into micron-level asphalt dust.',
      urbanNicheDe: 'Trockene Parkplatzritzen, Gehweg-Ecken',
      urbanNicheEn: 'Baking parking lot cracks, sunny sidewalk corners',
      chalkTag: '#Krautschau #Capsella #ConcretePioneer',
      growthStages: [
        { week: 1, labelDe: 'Mikroskopischer Trieb im Rissgrund', labelEn: 'Microscopic sprout in crack base' },
        { week: 2, labelDe: 'Filigrane Stängelbildung trotz Staubtrockenheit', labelEn: 'Slender stems shooting up despite bone-dry dust' },
        { week: 4, labelDe: 'Herzförmige Schötchen gefüllt mit Überdauerungssamen', labelEn: 'Heart-shaped seedpods brimming with survival seeds' },
        { week: 8, labelDe: 'Vollständiger Lebenszyklus in 6 Wochen vollendet', labelEn: 'Complete seed-to-seed lifecycle completed in 6 weeks' }
      ]
    },
    fleabane: {
      nameDe: 'Kanadisches Berufkraut (Erigeron canadensis)',
      nameEn: 'Canadian Horseweed (Erigeron canadensis)',
      baseHardiness: 8.0,
      superpowerDe: 'Wärmeliebender Neophyt; profitiert von städtischen Wärmeinseln und gedeiht bei über 45 °C Asphalttemperatur.',
      superpowerEn: 'Heat-thriving urban pioneer; capitalizing on microclimates with surface temperatures exceeding 45 °C.',
      urbanNicheDe: 'Hauswand-Abschlüsse, Schotterbetten, Fassadenfugen',
      urbanNicheEn: 'Building perimeter joints, gravel edges, facade crevices',
      chalkTag: '#Krautschau #Erigeron #HeatIslandHero',
      growthStages: [
        { week: 1, labelDe: 'Dichte Rosette im Mauerwinkel', labelEn: 'Dense hairy rosette hugging brick foundation' },
        { week: 2, labelDe: 'Rasanter vertikaler Austrieb entlang der Hauswand', labelEn: 'Rapid vertical shoot tracing building wall' },
        { week: 4, labelDe: 'Über 100 winzige Korbblüten trotzen der Straßenglut', labelEn: '100+ miniature flowerheads defying radiant street heat' },
        { week: 8, labelDe: 'Zehntausende Schirmchensamen segeln durch Straßenschluchten', labelEn: 'Tens of thousands of pappus seeds gliding down wind tunnels' }
      ]
    },
    yarrow: {
      nameDe: 'Gemeine Schafgarbe (Achillea millefolium)',
      nameEn: 'Common Yarrow (Achillea millefolium)',
      baseHardiness: 7.0,
      superpowerDe: 'Tiefwurzelndes Rhizomnetzwerk speichert Feuchtigkeit und widersteht Winter-Streusalz.',
      superpowerEn: 'Deep-rooting rhizome network hoarding moisture while resisting winter street deicing salt.',
      urbanNicheDe: 'Baumscheiben-Ränder, Schotterfugen, Tramgleis-Schotter',
      urbanNicheEn: 'Tree pit edges, gravel curb gutters, tramway gravel beds',
      chalkTag: '#Krautschau #Achillea #SaltResilient',
      growthStages: [
        { week: 1, labelDe: 'Fiederblättchen lugen zwischen Granitsteinen hervor', labelEn: 'Feathery pinnate foliage peeking between cobblestones' },
        { week: 2, labelDe: 'Wurzelgeflecht verankert sich im Unterbausand', labelEn: 'Rhizome network locking into deep sub-pavement sand' },
        { week: 4, labelDe: 'Weiße Doldenblüte zieht Wildbienen mitten im Verkehr an', labelEn: 'White flat-topped flower cluster drawing wild solitary bees' },
        { week: 8, labelDe: 'Robuster Rückzug ins Rhizom vor dem Frost', labelEn: 'Hardy dormancy retreat into protected underground rhizome' }
      ]
    }
  };

  const substrateModifiers = {
    pure_asphalt: { score: 1.8, labelDe: 'Reiner Asphalt (Null Substrat)', labelEn: 'Pure Solid Asphalt (Zero Soil)' },
    deep_crack: { score: 1.2, labelDe: 'Tiefer Dehnungsriss (3-5 mm)', labelEn: 'Deep Expansion Seam (3-5 mm)' },
    curb_joint: { score: 0.9, labelDe: 'Bordsteinfuge / Sandbett', labelEn: 'Curbstone Joint / Sand Bed' },
    mortar_wall: { score: 1.5, labelDe: 'Vertikale Mörtelwand / Klinker', labelEn: 'Vertical Brick Wall Mortar' }
  };

  const trafficModifiers = {
    high_foot: { score: 1.2, labelDe: 'Hohe Trittfrequenz (>500 Passanten/Tag)', labelEn: 'High Foot Traffic (>500 walkers/day)' },
    medium_bike: { score: 0.8, labelDe: 'Radweg-Schulter / Skater', labelEn: 'Bike Lane Shoulder / Skaters' },
    parked_car_tire: { score: 1.4, labelDe: 'Parkschein-Zone (Öl & Reifenkontakt)', labelEn: 'Street Parking (Oil & Tire Compaction)' },
    low_quiet: { score: 0.3, labelDe: 'Ruhige Kiez-Ecke', labelEn: 'Quiet Residential Corner' }
  };

  const sunModifiers = {
    full_baking_sun: { score: 1.0, labelDe: 'Glühende Südlage (>50 °C Oberfläche)', labelEn: 'Full Baking Sun (>50 °C surface)' },
    variable_canyon: { score: 0.5, labelDe: 'Straßenschlucht mit Zugluft', labelEn: 'Street Canyon Wind Tunnel' },
    subway_grate_humid: { score: 0.2, labelDe: 'U-Bahn-Schachtabluft (feucht-warm)', labelEn: 'Subway Vent Exhaust (warm-humid)' }
  };

  const currentPlantData = plantCatalog[selectedPlantId];
  const rawToughnessScore = Math.min(
    10.0,
    Number((
      currentPlantData.baseHardiness * 0.55 +
      substrateModifiers[substrateType].score * 1.5 +
      trafficModifiers[trafficExposure].score * 1.2 +
      sunModifiers[sunExposure].score * 1.0
    ).toFixed(1))
  );

  const toughnessRank = rawToughnessScore >= 9.0
    ? (lang === 'de' ? '👑 König der Ritzen (Legendär)' : '👑 King of the Cracks (Legendary)')
    : rawToughnessScore >= 8.0
    ? (lang === 'de' ? '⚔️ Asphaltheld (Elite)' : '⚔️ Asphalt Warrior (Elite)')
    : (lang === 'de' ? '🌿 Kiez-Pionier (Stark)' : '🌿 Sidewalk Pioneer (Sturdy)');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-stone-50 border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-mono-code mb-3 border border-amber-200/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>{lang === 'de' ? 'Interaktive Dosen-Simulatoren' : lang === 'es' ? 'Simuladores Interactivos de Latas' : 'Interactive Tin Sandboxes'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
              {lang === 'de'
                ? 'Das physikalische Herz der Dosen ausprobieren'
                : lang === 'es'
                ? 'Experimenta la lógica física central de las latas'
                : 'Experience the Core Physical Logic of the Tins'}
            </h2>
            <p className="text-sm text-stone-600 mt-1.5 max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Jede Amélie-Dose stützt sich auf eine konkrete Formel, physikalische Norm oder API-Lücke. Testen Sie hier die Prototyp-Mechanik direkt im Browser, bevor Sie das Briefing versenden.'
                : lang === 'es'
                ? 'Cada lata Amélie se basa en una fórmula concreta, norma física o brecha de API. Prueba la mecánica de prototipo en el navegador antes de enviar el briefing.'
                : 'Every Amélie tin is grounded in a specific physical formula, regulatory standard, or API gap. Test the prototype mechanics right here in your browser before sending the briefing.'}
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200/80 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('altbau')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'altbau'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🏢 {lang === 'de' ? 'Altbau' : lang === 'es' ? 'Edificio Antiguo' : 'Old Building'}
            </button>
            <button
              onClick={() => setActiveTab('glasanflug')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'glasanflug'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🐦 {lang === 'de' ? 'Glasanflug' : lang === 'es' ? 'Colisión de Aves' : 'Bird Glass'}
            </button>
            <button
              onClick={() => setActiveTab('streiflicht')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'streiflicht'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🔦 {lang === 'de' ? 'Streiflicht' : lang === 'es' ? 'Luz Rasante' : 'Raking Light'}
            </button>
            <button
              onClick={() => setActiveTab('wetink')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'wetink'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🖋️ {lang === 'de' ? 'Tinte' : lang === 'es' ? 'Tinta Líquida' : 'Wet Ink'}
            </button>
            <button
              onClick={() => setActiveTab('balkon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'balkon'
                  ? 'bg-white text-amber-900 shadow-xs font-bold border border-amber-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ☀️ {lang === 'de' ? 'Balkonkraftwerk' : lang === 'es' ? 'Placas de Balcón' : 'Balcony Solar'}
            </button>
            <button
              onClick={() => setActiveTab('regenwasser')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'regenwasser'
                  ? 'bg-white text-blue-900 shadow-xs font-bold border border-blue-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌧️ {lang === 'de' ? 'Regenwasser' : lang === 'es' ? 'Agua de Lluvia' : 'Rainwater'}
            </button>
            <button
              onClick={() => setActiveTab('klarlokal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'klarlokal'
                  ? 'bg-white text-emerald-950 shadow-xs font-bold border border-emerald-400'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🛡️ {lang === 'de' ? 'KlarLokal (Brecheisen)' : lang === 'es' ? 'KlarLokal (Palanca)' : 'KlarLokal (Battering Ram)'}
            </button>
            <button
              onClick={() => setActiveTab('crackflora')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'crackflora'
                  ? 'bg-white text-lime-950 shadow-xs font-bold border border-lime-500'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌱 {lang === 'de' ? 'Crack Flora (Ritzengrün)' : lang === 'es' ? 'Crack Flora (Grietas)' : 'Crack Flora (Pavement)'}
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 1: ALTBAU THERMAL */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'altbau' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Honest framing: sketch, not a certification tool */}
          <div className="lg:col-span-12 p-3.5 rounded-xl border-2 border-amber-700 bg-amber-50/70 text-xs text-amber-950 flex items-start gap-2.5" role="note">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{tr3('Skizze, kein Nachweisinstrument.', 'Sketch, not a certification tool.', 'Boceto, no es un instrumento de certificación.')}</strong>{' '}
              {tr3(
                'Kein Energieausweis, keine normkonforme Berechnung: ein stationäres Rechenmodell mit offenen Annahmen. Es zeigt Größenordnungen und Unsicherheit, keine Gewissheit über Ihre Wohnung. Bei Schimmel oder einer Investitionsentscheidung: messen und beraten lassen.',
                'No energy certificate, no standards-compliant calculation: a steady-state model with open assumptions. It shows orders of magnitude and uncertainty, not certainty about your flat. For mould or an investment decision: measure and get advice.',
                'Sin certificado energético ni cálculo conforme a norma: un modelo estacionario con supuestos abiertos. Muestra órdenes de magnitud e incertidumbre, no certeza sobre su vivienda. Ante moho o una decisión de inversión: mida y pida asesoramiento.',
              )}
            </p>
          </div>
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-700" />
                <span>{tr3('Wohnungsebene: Berliner Zimmer (DIN 4108)', 'Apartment Room Heat Loss & Dew Point', 'Habitación de vivienda: pérdida de calor y punto de rocío')}</span>
              </h3>
              <span className="text-xs font-mono-code bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                Tin #1
              </span>
            </div>

            {/* Wall Construction */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {tr3('Außenwand-Aufbau:', 'Exterior Wall Construction:', 'Construcción del muro exterior:')}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setWallType('brick_uninsulated')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    wallType === 'brick_uninsulated'
                      ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block font-semibold">{tr3('Altbau Ziegel', 'Old-building brick', 'Ladrillo de edificio antiguo')}</span>
                  <span className="text-[11px] text-stone-500">{tr3('38cm ungedämmt (U=1.7)', '38cm uninsulated (U=1.7)', '38cm sin aislar (U=1,7)')}</span>
                </button>
                <button
                  onClick={() => setWallType('brick_renovated')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    wallType === 'brick_renovated'
                      ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block font-semibold">{tr3('Saniert + WDVS', 'Renovated + ETICS', 'Rehabilitado + SATE')}</span>
                  <span className="text-[11px] text-stone-500">{tr3('14cm Dämmung (U=0.24)', '14cm insulation (U=0.24)', '14cm de aislamiento (U=0,24)')}</span>
                </button>
                <button
                  onClick={() => setWallType('solid_concrete')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    wallType === 'solid_concrete'
                      ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block font-semibold">{tr3('Beton unsaniert', 'Concrete, unrenovated', 'Hormigón sin rehabilitar')}</span>
                  <span className="text-[11px] text-stone-500">{tr3('Kältebrücke (U=2.1)', 'thermal bridge (U=2.1)', 'puente térmico (U=2,1)')}</span>
                </button>
              </div>
            </div>

            {/* Window Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {tr3('Fenster-Verglasung:', 'Window Glazing:', 'Acristalamiento de la ventana:')}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setWindowGlazing('single')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    windowGlazing === 'single'
                      ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {tr3('Einfachglas (U=5.0)', 'Single glazing (U=5.0)', 'Vidrio simple (U=5,0)')}
                </button>
                <button
                  onClick={() => setWindowGlazing('double_old')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    windowGlazing === 'double_old'
                      ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {tr3('Doppelglas alt (U=2.8)', 'Old double glazing (U=2.8)', 'Doble acristalamiento antiguo (U=2,8)')}
                </button>
                <button
                  onClick={() => setWindowGlazing('triple_modern')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    windowGlazing === 'triple_modern'
                      ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {tr3('Dreifachglas (U=0.8)', 'Triple glazing (U=0.8)', 'Triple acristalamiento (U=0,8)')}
                </button>
              </div>
            </div>

            {/* Outside / room temperature */}
            {altbauSlider(
              'altbau-outside',
              tr3('Außentemperatur Berlin:', 'Outside Winter Temperature:', 'Temperatura exterior en invierno:'),
              `${nf(outsideTemp, 0)} °C`, -14, 15, 1, outsideTemp, setOutsideTemp,
              tr3(
                '-14°C ≈ Auslegungsfall (ungeprüft) · 0°C ≈ Wintermittel · +15°C Frühling',
                '-14°C ≈ design case (unchecked) · 0°C ≈ winter mean · +15°C spring',
                '-14°C ≈ caso de diseño (sin verificar) · 0°C ≈ media invernal · +15°C primavera',
              ),
            )}
            {altbauSlider(
              'altbau-room',
              tr3('Raumtemperatur:', 'Room Temperature:', 'Temperatura interior:'),
              `${nf(roomTemp, 1)} °C`, 15, 24, 0.5, roomTemp, setRoomTemp,
            )}
            {/* Window Tilt Toggle */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  {tr3('Dauergekipptes Fenster im Berliner Zimmer?', 'Window Tilted Continuously?', '¿Ventana abatible abierta de forma permanente?')}
                </span>
                <span className="text-[11px] text-stone-500">
                  {tr3('Erhöht Luftwechselrate von 0.5/h auf 3.0/h', 'Increases air change rate from 0.5/h to 3.0/h', 'Aumenta la renovación de aire de 0,5/h a 3,0/h')}
                </span>
              </div>
              <button
                onClick={() => setWindowTilted(!windowTilted)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  windowTilted
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {windowTilted ? tr3('Aktiv (Gekippt)', 'Tilted', 'Abatible abierta') : tr3('Geschlossen', 'Closed', 'Cerrada')}
              </button>
            </div>

            {/* Room geometry & humidity: the areas are no longer fixed */}
            <details className="rounded-xl border border-stone-200 p-3.5 text-xs">
              <summary className="cursor-pointer font-bold text-stone-900">
                {tr3('Raum & Luftfeuchte anpassen', 'Adjust room & humidity', 'Ajustar habitación y humedad')}
              </summary>
              <div className="mt-3 space-y-4">
                {altbauSlider(
                  'altbau-area',
                  tr3('Raumfläche:', 'Room floor area:', 'Superficie de la habitación:'),
                  `${nf(roomArea, 0)} m²`, 10, 50, 1, roomArea, setRoomArea,
                )}
                {altbauSlider(
                  'altbau-width',
                  tr3('Länge der Außenwand:', 'Length of exterior wall:', 'Longitud del muro exterior:'),
                  `${nf(roomWidth, 1)} m`, 2.5, 8, 0.1, roomWidth, setRoomWidth,
                )}
                {altbauSlider(
                  'altbau-window',
                  tr3('Fensterbreite (Höhe fest 1,9 m):', 'Window width (height fixed 1.9 m):', 'Ancho de ventana (altura fija 1,9 m):'),
                  `${nf(effWindowWidth, 1)} m`, 0.6, 4, 0.1, windowWidth, setWindowWidth,
                )}
                {altbauSlider(
                  'altbau-rh',
                  tr3('Relative Raumluftfeuchte:', 'Room relative humidity:', 'Humedad relativa interior:'),
                  `${relHumidity} %`, 30, 70, 1, relHumidity, setRelHumidity,
                )}
                <p className="text-[11px] text-stone-500">
                  {tr3(
                    'U-Werte der Voreinstellungen sind grobe Richtwerte, ungeprüft. Vor jeder Nutzung gegen TABULA / DIN 4108-4 prüfen.',
                    'Preset U-values are rough rules of thumb, unchecked. Verify against TABULA / DIN 4108-4 before any use.',
                    'Los valores U de los ajustes son cifras orientativas sin verificar. Compruébelos con TABULA / DIN 4108-4 antes de usarlos.',
                  )}
                </p>
              </div>
            </details>
          </div>

          {/* Results & Visualizer */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
              <div className="flex items-center justify-between mb-4 gap-2">
                <span className="text-xs font-mono-code uppercase tracking-wider text-stone-400">
                  {tr3('Wärmebilanz als Band (stationär, Raumebene)', 'Heat balance as a band (steady state, room level)', 'Balance térmico como rango (estacionario, nivel habitación)')}
                </span>
                <span className="text-xs font-mono-code bg-stone-800 px-2.5 py-0.5 rounded text-amber-300 border border-stone-700 shrink-0">
                  {tr3('Skizze · Annahmen offen', 'Sketch · assumptions open', 'Boceto · supuestos abiertos')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {/* Heating power band */}
                <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700/60">
                  <span className="text-xs text-stone-400 block mb-1">
                    {tr3('Erforderliche Heizleistung', 'Required heating power', 'Potencia de calefacción necesaria')}
                  </span>
                  <div className="text-2xl font-bold font-mono-code text-amber-400">
                    ≈ {nf(round10(altbau.heatLow), 0)}–{nf(round10(altbau.heatHigh), 0)} <span className="text-sm text-stone-300 font-sans">W</span>
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    ≈ {nf(altbau.heatLow / roomArea, 0)}–{nf(altbau.heatHigh / roomArea, 0)} W/m²
                  </span>
                  <div className="relative h-4 mt-3 rounded bg-stone-700/60" aria-hidden="true">
                    <div
                      className="absolute top-0.5 bottom-0.5 rounded bg-amber-500/80"
                      style={{
                        left: `${(100 * altbau.heatLow) / heatAxisMax}%`,
                        width: `${(100 * (altbau.heatHigh - altbau.heatLow)) / heatAxisMax}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono-code mt-0.5" aria-hidden="true">
                    <span>0</span>
                    <span>{nf(heatAxisMax, 0)} W</span>
                  </div>
                  <div className="flex h-2.5 mt-3 rounded overflow-hidden" aria-hidden="true">
                    <div className="bg-stone-400" style={{ width: `${(100 * altbau.hWall) / partTotal}%` }} />
                    <div className="bg-sky-400" style={{ width: `${(100 * altbau.hWindow) / partTotal}%` }} />
                    <div className="bg-amber-400" style={{ width: `${(100 * altbau.hVent) / partTotal}%` }} />
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 flex flex-wrap gap-x-3">
                    <span>{tr3('Wand', 'Wall', 'Muro')} {nf((100 * altbau.hWall) / partTotal, 0)} %</span>
                    <span>{tr3('Fenster', 'Window', 'Ventana')} {nf((100 * altbau.hWindow) / partTotal, 0)} %</span>
                    <span>{tr3('Lüftung', 'Ventilation', 'Ventilación')} {nf((100 * altbau.hVent) / partTotal, 0)} %</span>
                  </div>
                </div>

                {/* Corner surface temperature band */}
                <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700/60">
                  <span className="text-xs text-stone-400 block mb-1">
                    {tr3('Oberflächentemperatur, kalte Ecke', 'Surface temperature, cold corner', 'Temperatura superficial, esquina fría')}
                  </span>
                  <div className={`text-2xl font-bold font-mono-code ${altbau.verdict === 'below' ? 'text-rose-400' : altbau.verdict === 'above' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ≈ {nf(altbau.cornerLow, 1)}–{nf(altbau.cornerHigh, 1)} <span className="text-sm text-stone-300 font-sans">°C</span>
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    {tr3('Taupunkt', 'Dew point', 'Punto de rocío')}: {nf(altbau.dewPoint, 1)} °C · {tr3('Schimmel-Schwelle (80 % Oberflächenfeuchte)', 'mould threshold (80 % surface humidity)', 'umbral de moho (80 % humedad superficial)')}: {nf(altbau.moldThreshold, 1)} °C
                  </span>
                  <div className="relative h-4 mt-3 rounded bg-stone-700/60" aria-hidden="true">
                    <div
                      className="absolute top-0.5 bottom-0.5 rounded bg-amber-500/80"
                      style={{
                        left: tempPos(altbau.cornerLow),
                        width: `${(100 * (altbau.cornerHigh - altbau.cornerLow)) / (tempAxisMax - tempAxisMin)}%`,
                      }}
                    />
                    <div className="absolute -top-1 -bottom-1 border-l-2 border-dashed border-amber-200" style={{ left: tempPos(altbau.dewPoint) }} />
                    <div className="absolute -top-1 -bottom-1 border-l-2 border-dashed border-rose-400" style={{ left: tempPos(altbau.moldThreshold) }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono-code mt-0.5" aria-hidden="true">
                    <span>{tempAxisMin} °C</span>
                    <span>{tempAxisMax} °C</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1">
                    <span className="text-amber-200">┆</span> {tr3('Taupunkt', 'dew point', 'rocío')} <span className="text-rose-400 ml-2">┆</span> {tr3('Schimmel-Schwelle', 'mould threshold', 'umbral de moho')}
                  </div>
                </div>
              </div>

              {/* Verdict: three honest states, never a single number */}
              <div role="status" aria-live="polite">
                {altbau.verdict === 'above' && (
                  <div className="p-3 rounded-xl bg-stone-800/70 border border-stone-700/80 text-stone-300 text-xs flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>
                      {tr3(
                        'Kein Befund in diesem Modell: Das Band liegt vollständig über der Schimmel-Schwelle. Das ist kein Nachweis, denn echte Raumecken (2D/3D) sind kälter als die hier gerechnete Wand.',
                        'No finding in this model: the band lies entirely above the mould threshold. That is not proof, because real room corners (2D/3D) are colder than the wall computed here.',
                        'Sin hallazgo en este modelo: el rango queda por completo por encima del umbral de moho. No es una prueba, porque las esquinas reales (2D/3D) son más frías que el muro calculado aquí.',
                      )}
                    </span>
                  </div>
                )}
                {altbau.verdict === 'overlap' && (
                  <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-700/80 text-amber-100 text-xs flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        {tr3('Nicht entscheidbar aus diesen Eingaben.', 'Not decidable from these inputs.', 'No se puede decidir con estos datos.')}
                      </span>
                      <span className="text-[11px] text-amber-200/90 leading-relaxed block mt-0.5">
                        {tr3(
                          'Das Band überschneidet die Schimmel-Schwelle. Hier hilft nur Messen (Oberflächenthermometer, Feuchtelogger), nicht ein genauer aussehendes Modell.',
                          'The band overlaps the mould threshold. Only measuring helps here (surface thermometer, humidity logger), not a more precise-looking model.',
                          'El rango se solapa con el umbral de moho. Aquí solo ayuda medir (termómetro de superficie, registrador de humedad), no un modelo de aspecto más preciso.',
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {altbau.verdict === 'below' && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        {tr3('Das Band liegt vollständig unter der Schimmel-Schwelle.', 'The band lies entirely below the mould threshold.', 'El rango queda por completo por debajo del umbral de moho.')}
                      </span>
                      <span className="text-[11px] text-rose-300/90 leading-relaxed block mt-0.5">
                        {tr3(
                          'Unter diesen Annahmen ist die Ecke kritisch. Das ist ein Hinweis, kein Beweis: Bauzustand und Möblierung sind unbekannt.',
                          'Under these assumptions the corner is critical. This is a hint, not proof: construction and furniture are unknown.',
                          'Con estos supuestos la esquina es crítica. Es un indicio, no una prueba: se desconocen la construcción y el mobiliario.',
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {altbau.dewInBand && (
                  <p className="text-[11px] text-amber-200 mt-2">
                    {tr3('Achtung: Der Taupunkt liegt im Band, Kondensat ist möglich.', 'Note: the dew point lies inside the band, condensation is possible.', 'Atención: el punto de rocío está dentro del rango, es posible la condensación.')}
                  </p>
                )}
                <p className="text-[10px] text-stone-500 mt-2">
                  {tr3(
                    'Keine Aussage über Schuld oder Lüftungsverhalten. Das Modell zeigt nur, was bei diesen Annahmen physikalisch plausibel ist.',
                    'No statement about blame or ventilation behaviour. The model only shows what is physically plausible under these assumptions.',
                    'Sin afirmaciones sobre culpa ni hábitos de ventilación. El modelo solo muestra lo físicamente plausible con estos supuestos.',
                  )}
                </p>
              </div>

              {/* Hand calculation: the core fits on a sheet of paper */}
              <details className="mt-4 text-xs text-stone-300">
                <summary className="cursor-pointer font-bold text-stone-200">
                  {tr3('Nachrechnen (Rechenkern der Mittelannahme)', 'Check by hand (calculation core, mid assumption)', 'Comprobar a mano (núcleo de cálculo, supuesto medio)')}
                </summary>
                <table className="w-full mt-2 font-mono-code text-[11px]">
                  <tbody>
                    {[
                      [tr3('Fensterfläche = b · 1,9 m', 'Window area = w · 1.9 m', 'Área de ventana = a · 1,9 m'), `${nf(effWindowWidth, 1)} · 1.9 = ${nf(altbau.windowArea, 2)} m²`],
                      [tr3('Wandfläche = B · 3,4 m − Fenster', 'Wall area = W · 3.4 m − window', 'Área de muro = A · 3,4 m − ventana'), `${nf(roomWidth, 1)} · 3.4 − ${nf(altbau.windowArea, 2)} = ${nf(altbau.wallArea, 2)} m²`],
                      [tr3('Volumen = Fläche · 3,4 m', 'Volume = area · 3.4 m', 'Volumen = área · 3,4 m'), `${nf(roomArea, 0)} · 3.4 = ${nf(altbau.volume, 1)} m³`],
                      ['H_T,' + tr3('Wand', 'wall', 'muro') + ' = U · A', `${nf(wallU, 2)} · ${nf(altbau.wallArea, 2)} = ${nf(altbau.hWall, 1)} W/K`],
                      ['H_T,' + tr3('Fenster', 'window', 'ventana') + ' = U · A', `${nf(windowU, 1)} · ${nf(altbau.windowArea, 2)} = ${nf(altbau.hWindow, 1)} W/K`],
                      ['H_V = 0,34 · n · V', `0.34 · ${nf(airChangeRate, 1)} · ${nf(altbau.volume, 1)} = ${nf(altbau.hVent, 1)} W/K`],
                      ['ΔT = θi − θe', `${nf(roomTemp, 0)} − ${nf(outsideTemp, 0)} = ${nf(altbau.deltaT, 0)} K`],
                      ['Φ = (H_T,W + H_T,F + H_V) · ΔT', `${nf(altbau.heatMid, 0)} W`],
                      ['θsi = θi − U_W · Rsi · ΔT  (Rsi = 0,25)', `${nf(altbau.cornerMid, 1)} °C`],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-stone-800 align-top">
                        <td className="py-1 pr-2">{k}</td>
                        <td className="py-1 text-right whitespace-nowrap">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
                  {tr3(
                    'Band = unsichere Eingaben: U-Werte ×0,8…×1,25 (Bauzustand unbekannt), Luftwechsel ×0,6…×1,6 (Nutzung), Rsi in der Ecke 0,25…0,35 m²K/W (0,25 = Wert für Ecken/hinter Möbeln nach DIN 4108-2, 0,35 = Annahme für zugestellt). Diese Bandbreiten sind Annahmen dieser Skizze, keine Normwerte. Innenwände, Boden, Decke grenzen an beheizte Räume; keine solaren oder inneren Gewinne; die Ecke wird als 1D-Wand gerechnet, echte Raumecken (2D/3D, ISO 10211) sind kälter, das ganze Band ist daher eher optimistisch.',
                    'Band = uncertain inputs: U-values ×0.8…×1.25 (unknown construction), air change ×0.6…×1.6 (usage), corner Rsi 0.25…0.35 m²K/W (0.25 = DIN 4108-2 value for corners / behind furniture, 0.35 = assumption for blocked). These ranges are assumptions of this sketch, not standard values. Interior walls, floor, ceiling border heated rooms; no solar or internal gains; the corner is computed as a 1D wall, real room corners (2D/3D, ISO 10211) are colder, so the whole band is rather optimistic.',
                    'Rango = entradas inciertas: valores U ×0,8…×1,25 (construcción desconocida), renovación de aire ×0,6…×1,6 (uso), Rsi en la esquina 0,25…0,35 m²K/W (0,25 = valor DIN 4108-2 para esquinas / detrás de muebles, 0,35 = supuesto de esquina tapada). Estos rangos son supuestos de este boceto, no valores normativos. Paredes interiores, suelo y techo lindan con estancias calefactadas; sin ganancias solares ni internas; la esquina se calcula como un muro 1D, las esquinas reales (2D/3D, ISO 10211) son más frías, así que todo el rango es más bien optimista.',
                  )}
                </p>
              </details>

              {/* Link into Tin Brief */}
              <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>{tr3('Dose: Altbau Thermal', 'Tin: Altbau Thermal', 'Lata: Altbau Thermal')}</span>
                <span className="text-amber-400 font-mono-code">Status: gepackt → UdK Berlin</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Info className="w-4 h-4" />
                <span>{tr3('Was dieses Modell zeigt, und was nicht:', 'What this model shows, and what it does not:', 'Qué muestra este modelo y qué no:')}</span>
              </div>
              <p className="text-amber-900/90 leading-relaxed text-[11px]">
                {tr3(
                  'EnergyMap Berlin prognostiziert seit Mai 2025 den Wärmebedarf einzelner Gebäude. Offen bleibt die Wohnungsebene. Dieses Modell zeigt nur einen Raum im stationären Zustand: wie Wand, Fenster und Luftwechsel Heizleistung und Ecktemperatur als Band verschieben. Ob gekipptes Lüften die Ecke auskühlt und wie stark der Grundriss (Möblierung, Heizkörperplatz, Nachbarräume) sie zusätzlich beeinflusst, zeigt es nicht. Das ist eine Hypothese für das vollständige Werkzeug mit instationärer 2D-Simulation.',
                  'Since May 2025, EnergyMap Berlin has forecast the heat demand of individual buildings. The apartment level remains open. This model shows only one room in steady state: how wall, window and air change shift heating power and corner temperature as a band. It does not show whether a tilted window cools the corner, or how much the floor plan (furniture, radiator position, neighbouring rooms) additionally affects it. That is a hypothesis for the full tool with transient 2D simulation.',
                  'Desde mayo de 2025, EnergyMap Berlin pronostica la demanda de calor de edificios individuales. El nivel de la vivienda sigue abierto. Este modelo muestra solo una habitación en régimen estacionario: cómo el muro, la ventana y la renovación de aire desplazan la potencia de calefacción y la temperatura de la esquina como un rango. No muestra si una ventana abatible abierta enfría la esquina, ni cuánto influye además la planta (mobiliario, posición del radiador, habitaciones vecinas). Es una hipótesis para la herramienta completa con simulación 2D transitoria.',
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 2: GLASANFLUG-AMPEL */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'glasanflug' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                <span>{lang === 'de' ? 'Vogelschlag-Risiko nach LAG-VSW Standard' : 'Bird Glass Hazard Score Calculator'}</span>
              </h3>
              <span className="text-xs font-mono-code bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                Candidate Pipeline
              </span>
            </div>

            {/* Glass Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {lang === 'de' ? 'Glas-Reflexionsgrad:' : 'Glass Reflection Index:'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setPaneTransparency('clear')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    paneTransparency === 'clear' ? 'border-amber-800 bg-amber-50/80 font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Normales Floatglas (15%)
                </button>
                <button
                  onClick={() => setPaneTransparency('mirrored')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    paneTransparency === 'mirrored' ? 'border-amber-800 bg-amber-50/80 font-bold text-rose-900' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Sonnenschutz / Verspiegelt (&gt;30%)
                </button>
                <button
                  onClick={() => setPaneTransparency('tinted')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    paneTransparency === 'tinted' ? 'border-amber-800 bg-amber-50/80 font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Entspiegelt / Mattiert (&lt;8%)
                </button>
              </div>
            </div>

            {/* Vegetation Distance */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {lang === 'de' ? 'Vegetation / Bäume vor der Scheibe:' : 'Vegetation / Trees Facing Glass:'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setVegetationDistance('immediate')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    vegetationDistance === 'immediate' ? 'border-amber-800 bg-amber-50/80 font-bold text-rose-900' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Direkt vor Scheibe (&lt;5m)
                </button>
                <button
                  onClick={() => setVegetationDistance('medium')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    vegetationDistance === 'medium' ? 'border-amber-800 bg-amber-50/80 font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Mittlere Distanz (5-15m)
                </button>
                <button
                  onClick={() => setVegetationDistance('none')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    vegetationDistance === 'none' ? 'border-amber-800 bg-amber-50/80 font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Freie Fläche / Hof
                </button>
              </div>
            </div>

            {/* Pattern Grid Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {lang === 'de' ? 'Vogelschutz-Markierung auf Pos. 1 (Außenseite):' : 'Protective Markings on Pane:'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setPatternType('none')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    patternType === 'none' ? 'border-amber-800 bg-amber-50 font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Keine Markierung
                </button>
                <button
                  onClick={() => setPatternType('dots_9x9')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    patternType === 'dots_9x9' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Punktraster 9x9cm (LAG-Norm)
                </button>
                <button
                  onClick={() => setPatternType('stripes_5mm')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    patternType === 'stripes_5mm' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Vertikalstreifen 5mm / 10cm
                </button>
                <button
                  onClick={() => setPatternType('silhouettes')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    patternType === 'silhouettes' ? 'border-rose-700 bg-rose-50 text-rose-900 font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Greifvogel-Aufkleber (Nutzen 0)
                </button>
              </div>
            </div>

            {/* Through vision */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <span className="text-xs font-medium text-stone-700">
                {lang === 'de' ? 'Vollständige Durchsicht vorhanden (z.B. Eckverglasung, Gang)?' : 'Through-vision corridor present?'}
              </span>
              <input
                type="checkbox"
                checked={throughVision}
                onChange={(e) => setThroughVision(e.target.checked)}
                className="w-4 h-4 accent-amber-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Evaluation Results */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono-code uppercase tracking-wider text-stone-400">
                  {lang === 'de' ? 'LAG-VSW Risikobewertung' : 'LAG-VSW Hazard Classification'}
                </span>
                <span className="text-xs font-mono-code text-stone-300">BNatSchG §44 Abs. 1 Nr. 1</span>
              </div>

              {/* Traffic Light Card */}
              <div
                className={`p-5 rounded-xl border mb-5 flex items-center gap-4 ${
                  birdTrafficLight === 'green'
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-100'
                    : birdTrafficLight === 'amber'
                    ? 'bg-amber-950/80 border-amber-600 text-amber-100'
                    : 'bg-rose-950/80 border-rose-700 text-rose-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-mono-code shrink-0 ${
                    birdTrafficLight === 'green'
                      ? 'bg-emerald-500 text-white'
                      : birdTrafficLight === 'amber'
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-rose-600 text-white animate-pulse'
                  }`}
                >
                  {birdRiskScore}
                </div>
                <div>
                  <h4 className="font-serif-title font-bold text-base">
                    {birdTrafficLight === 'green'
                      ? lang === 'de'
                        ? 'GRÜN — Wirksam vogelschlagarm (<25%)'
                        : 'GREEN — Highly bird-safe (<25%)'
                      : birdTrafficLight === 'amber'
                      ? lang === 'de'
                        ? 'GELB — Erhöhtes Kollisionsrisiko'
                        : 'AMBER — Elevated hazard rate'
                      : lang === 'de'
                      ? 'ROT — Akute Tötungsfalle nach §44'
                      : 'RED — Severe collision hazard (§44 violation)'}
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5">
                    {patternType === 'silhouettes'
                      ? (lang === 'de'
                        ? 'Achtung: Greifvogel-Silhouetten werden von Singvögeln schlicht umflogen — die Scheibe daneben bleibt tödlich.'
                        : 'Warning: Bird silhouettes are ineffective. Birds simply fly around the sticker.')
                      : ''}
                    {patternType === 'dots_9x9' && (lang === 'de' ? 'Geprüftes Punktraster unterbricht Spiegelung physikalisch.' : 'Certified dot matrix breaks reflections.')}
                    {patternType === 'none' && (lang === 'de' ? 'Unmarkierte Glasfläche mit Pflanzenspiegelung ist für Vögel unsichtbar.' : 'Unmarked glass reflecting vegetation is visually invisible.')}
                  </p>
                </div>
              </div>

              {/* Ready to send */}
              <div className="pt-4 border-t border-stone-800 text-xs flex items-center justify-between text-stone-400">
                <span>{lang === 'de' ? 'Empfänger: LAG Vogelschutzwarten / NABU' : 'Recipient: LAG Bird Conservation / NABU'}</span>
                <span className="text-emerald-400 font-mono-code">{lang === 'de' ? 'Status: Lücke frei' : 'Status: Gap open'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block text-emerald-900">
                {lang === 'de' ? 'Warum existiert diese App noch nicht?' : 'Why is this tool not yet built?'}
              </span>
              <p className="text-emerald-900/90 text-[11px] leading-relaxed">
                {lang === 'de'
                  ? 'Das offizielle Prüfschema existiert seit Jahren als 30-seitiges PDF der Vogelschutzwarten. Architekten und Bauämter blättern es mühsam durch. Ein 3-Klick-Rechner im Browser schließt diese Lücke sofort.'
                  : 'The regulatory standard has existed for years as a 30-page PDF document. Architects and building authorities thumb through it manually. A clean web calculator makes it instantly usable.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 3: STREIFLICHT (SMARTPHONE RTI) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'streiflicht' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-700" />
                <span>{lang === 'de' ? 'Streiflicht: Virtuelle RTI-Reliefabtastung' : 'Grazing Light RTI Relief Simulation'}</span>
              </h3>
              <span className="text-xs font-mono-code bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                Candidate Pipeline
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'de'
                ? 'CompGen zeigte im Mai 2026: Vision-LLMs halluzinieren Buchstaben bei verwitterten Inschriften. Bewegen Sie den Lichtwinkel auf Streiflicht (flach): Die Schattenkante macht die Gravur lesbar, ohne dass KI raten muss.'
                : 'CompGen reported in May 2026: Vision LLMs hallucinate text on eroded historical inscriptions. Drag the light to a grazing angle: cast shadows reveal carved topography deterministically.'}
            </p>

            {/* Light Elevation Angle Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1">
                <span>{lang === 'de' ? 'Licht-Einfallswinkel (Höhe):' : 'Light Elevation Angle:'}</span>
                <span className="font-mono-code font-bold text-amber-900">{lightAngle}° {lightAngle <= 25 ? '(Streiflicht / Grazing)' : lightAngle >= 70 ? '(Frontal / Flat)' : ''}</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="2"
                value={lightAngle}
                onChange={(e) => setLightAngle(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono-code mt-0.5">
                <span>5° (Maximales Streiflicht)</span>
                <span>45° (Schräg)</span>
                <span>90° (Frontal, Text unsichtbar)</span>
              </div>
            </div>

            {/* Azimuth Angle (Around 360) */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1">
                <span>{lang === 'de' ? 'Lichtposition (360° um Inschrift):' : 'Light Azimuth Rotation:'}</span>
                <span className="font-mono-code font-bold text-amber-900">{lightAzimuth}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={lightAzimuth}
                onChange={(e) => setLightAzimuth(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
            </div>

            {/* Presets */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => { setLightAngle(12); setLightAzimuth(45); }}
                className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium"
              >
                🔦 {lang === 'de' ? 'Optimales Streiflicht (12°)' : 'Optimal Grazing (12°)'}
              </button>
              <button
                onClick={() => { setLightAngle(85); setLightAzimuth(90); }}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
              >
                ☁️ {lang === 'de' ? 'Normales Tageslicht (85°)' : 'Flat Ambient (85°)'}
              </button>
            </div>
          </div>

          {/* Canvas Output */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-stone-900 rounded-2xl p-4 shadow-md border border-stone-800 flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={480}
                height={260}
                className="rounded-xl border border-stone-700/80 shadow-inner w-full max-w-md h-auto"
              />
              <div className="w-full flex items-center justify-between text-xs text-stone-400 mt-3 px-2">
                <span>{lightAngle <= 25 ? '✅ Relief sichtbar (Topographie lesbar)' : '⚠️ Frontal: Gravur im Stein verwaschen'}</span>
                <span className="font-mono-code text-amber-400">RTI PTM Kernel</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1">
              <span className="font-bold block text-amber-900">
                {lang === 'de' ? 'Die Lücke für CompGen e.V.:' : 'The Gap for CompGen e.V.:'}
              </span>
              <p className="text-amber-900/90 text-[11px] leading-relaxed">
                {lang === 'de'
                  ? 'CompGen nutzt KI-Transkription für Grabsteine, kämpft aber mit Halluzinationen. Statt einem noch größeren Sprachmodell genügt die Handytaschenlampe flach an den Stein gehalten — 3 Fotos, Differenzbild, und die Gravur ist deterministisch lesbar.'
                  : 'CompGen struggles with LLMs inventing names on weathered gravestones. A grazing flashlight turns micro-surface grooves into sharp contrast, eliminating transcription errors.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 4: WET INK (CAPILLARY BLEED) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'wetink' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <span>{lang === 'de' ? 'Wet Ink: Kapillardiffusion & Ränder' : 'Wet Ink: Capillary Paper Bleed'}</span>
              </h3>
              <span className="text-xs font-mono-code bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                Tin #10
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'de'
                ? 'Digitale Tinte (Apple Pencil, Tablets) zeichnet glatte Vektorlinien. Echte Tinte spreizt sich mikroskopisch in Papierfasern und dunkelt am Rand durch Pigmentwanderung nach. Zeichnen Sie auf der Leinwand:'
                : 'Digital ink draws sterile vector lines. Real fountain pen ink bleeds into porous fibers with capillary edge pooling. Draw on the canvas to inspect:'}
            </p>

            {/* Ink Tone Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {lang === 'de' ? 'Tinten-Rezeptur:' : 'Ink Formulation:'}
              </label>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setInkColor('sepia')}
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                    inkColor === 'sepia' ? 'border-amber-900 bg-amber-50 font-bold text-amber-950' : 'border-stone-200'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#503018]" />
                  <span>Sepia Eisengallus</span>
                </button>
                <button
                  onClick={() => setInkColor('cobalt')}
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                    inkColor === 'cobalt' ? 'border-blue-900 bg-blue-50 font-bold text-blue-950' : 'border-stone-200'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#183060]" />
                  <span>Königsblau</span>
                </button>
                <button
                  onClick={() => setInkColor('sumi')}
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                    inkColor === 'sumi' ? 'border-stone-900 bg-stone-100 font-bold text-stone-950' : 'border-stone-200'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
                  <span>Sumi Tusche</span>
                </button>
              </div>
            </div>

            <button
              onClick={clearInkCanvas}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? 'Papier leeren' : 'Clear Paper'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-[#f8f5ee] rounded-2xl border border-stone-300/80 p-4 shadow-inner flex flex-col items-center">
            <canvas
              ref={inkCanvasRef}
              width={560}
              height={320}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="rounded-xl shadow-xs border border-stone-300 cursor-crosshair touch-none w-full h-auto bg-[#f8f5ee]"
            />
            <span className="text-[11px] text-stone-500 font-mono-code mt-2">
              {lang === 'de' ? 'Zeichnen mit Maus oder Stift · Zeigt anisotrope Kapillarausbreitung' : 'Draw with pointer · Demonstrates microscopic anisotropic fiber diffusion'}
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 5: BALKONKRAFTWERK & MIETER-STROM */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'balkon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-600" />
                <span>{lang === 'de' ? 'Stecker-Solar: Ertrag & Mieter-Amortisation' : 'Balcony Solar: Yield & Tenant Payback'}</span>
              </h3>
              <span className="text-xs font-mono-code bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
                Solarpaket I
              </span>
            </div>

            {/* Inverter / Module Wattage */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {lang === 'de' ? 'Wechselrichter-Leistung:' : 'Inverter & Module Peak:'}
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono-code">
                {[400, 600, 800, 1000].map((w) => (
                  <button
                    key={w}
                    onClick={() => setBalkonWatts(w)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      balkonWatts === w
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div>{w} W</div>
                    <div className="text-3xs text-stone-500 mt-0.5 font-normal">
                      {w === 800 ? (lang === 'de' ? 'Standard' : 'Limit') : `${w / 400} Mod.`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {lang === 'de' ? 'Balkon-Ausrichtung:' : 'Balcony Compass Orientation:'}
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'south', labelDe: 'Süden (100%)', labelEn: 'South (100%)' },
                  { id: 'southeast_west', labelDe: 'SO / SW (92%)', labelEn: 'SE / SW (92%)' },
                  { id: 'east_west', labelDe: 'Ost / West (78%)', labelEn: 'East/West (78%)' },
                  { id: 'north', labelDe: 'Nord (48%)', labelEn: 'North (48%)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setBalkonOrientation(item.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      balkonOrientation === item.id
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    {lang === 'de' ? item.labelDe : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Railing Tilt Angle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {lang === 'de' ? 'Neigungswinkel am Geländer:' : 'Mounting Tilt Angle:'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'vertical_90', labelDe: '90° Senkrecht', labelEn: '90° Vertical', descDe: 'Einfach am Gitter', descEn: 'Direct railing' },
                  { id: 'angled_30', labelDe: '30° Aufgeständert', labelEn: '30° Angled', descDe: 'Optimum Sommer', descEn: 'Summer peak' },
                  { id: 'flat_0', labelDe: '0° Flach (Balkonboden)', labelEn: '0° Flat', descDe: 'Verschmutzungsgefahr', descEn: 'Dust accumulation' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setBalkonTilt(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      balkonTilt === item.id
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="font-semibold">{lang === 'de' ? item.labelDe : item.labelEn}</div>
                    <div className="text-3xs text-stone-500 mt-0.5">{lang === 'de' ? item.descDe : item.descEn}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shading & Base Load */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                  {lang === 'de' ? 'Verschattung:' : 'Obstruction / Shade:'}
                </label>
                <select
                  value={balkonShade}
                  onChange={(e) => setBalkonShade(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                >
                  <option value="none">{lang === 'de' ? 'Freier Himmel (100%)' : 'Unshaded Sky (100%)'}</option>
                  <option value="partial">{lang === 'de' ? 'Leichter Baumschatten (78%)' : 'Tree / Rail shadow (78%)'}</option>
                  <option value="heavy">{lang === 'de' ? 'Tiefer Berliner Hinterhof (52%)' : 'Dense urban courtyard (52%)'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                  {lang === 'de' ? 'Grundlast am Tag:' : 'Daytime Standby Load:'}
                </label>
                <select
                  value={householdBaseLoad}
                  onChange={(e) => setHouseholdBaseLoad(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                >
                  <option value="single">{lang === 'de' ? 'Single (~120W, Kühlschrank/WLAN)' : 'Single (~120W standby)'}</option>
                  <option value="couple">{lang === 'de' ? 'Paar (~220W, Homeoffice/PC)' : 'Couple (~220W, WFH setup)'}</option>
                  <option value="family">{lang === 'de' ? 'Familie (~350W, Spülmaschine)' : 'Family (~350W heavy day use)'}</option>
                </select>
              </div>
            </div>

            {/* Electricity Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-stone-600">{lang === 'de' ? 'Aktueller Strompreis:' : 'Electricity Tariff:'}</span>
                <span className="font-bold text-amber-900">{(electricityPrice * 100).toFixed(0)} ct / kWh</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="0.55"
                step="0.01"
                value={electricityPrice}
                onChange={(e) => setElectricityPrice(parseFloat(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-6 bg-stone-900 text-white rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="text-xs font-mono-code uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>{lang === 'de' ? 'Ertrags- & Amortisations-Rechnung' : 'Annual Yield & Cash Savings'}</span>
              </div>
              <span className="text-3xs font-mono-code bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                DIN VDE 0100-551-1
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80">
                <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Jahresertrag' : 'Annual Yield'}</div>
                <div className="text-2xl font-bold font-mono-code text-amber-300 mt-1">{annualYieldKwh}</div>
                <div className="text-3xs text-stone-400">kWh / {lang === 'de' ? 'Jahr' : 'year'}</div>
              </div>

              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80">
                <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Direktverbrauch' : 'Self-Consumed'}</div>
                <div className="text-2xl font-bold font-mono-code text-emerald-400 mt-1">{selfConsumedKwh}</div>
                <div className="text-3xs text-stone-400">{Math.round(selfConsumptionRatio * 100)}% {lang === 'de' ? 'im Haushalt' : 'on-site'}</div>
              </div>

              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 col-span-2 sm:col-span-1">
                <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Geldeinsparung' : 'Annual Savings'}</div>
                <div className="text-2xl font-bold font-mono-code text-amber-400 mt-1">{annualMoneySavedEur} €</div>
                <div className="text-3xs text-stone-400">{lang === 'de' ? 'pro Jahr im Geldbeutel' : 'in your pocket'}</div>
              </div>
            </div>

            {/* Payback bar */}
            <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300 font-medium">
                  {lang === 'de' ? 'Amortisationszeit (Kaufpreis ~420 €):' : 'Payback Period (~420 € hardware):'}
                </span>
                <span className="font-mono-code font-bold text-emerald-400">
                  {paybackYears} {lang === 'de' ? 'Jahre' : 'years'}
                </span>
              </div>
              <div className="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(15, (5 / paybackYears) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-3xs text-stone-400 font-mono-code">
                <span>{lang === 'de' ? 'Schnell amortisiert (< 3 J.)' : 'Fast (< 3 yrs)'}</span>
                <span>{lang === 'de' ? 'Nach 25 Jahren Garantie: Reiner Gewinn' : '25-yr warranty yields pure gain'}</span>
              </div>
            </div>

            {/* Environmental & Autonomy Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-800/40 border border-stone-700/50">
                <span className="text-stone-400 block text-3xs">{lang === 'de' ? 'CO2-Vermeidung:' : 'CO2 Avoided:'}</span>
                <span className="font-mono-code font-bold text-stone-200 text-sm">~{co2AvoidedKg} kg / {lang === 'de' ? 'Jahr' : 'yr'}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-800/40 border border-stone-700/50">
                <span className="text-stone-400 block text-3xs">{lang === 'de' ? 'Netzeinspeisung (Schenkung):' : 'Fed to grid (unmetered gift):'}</span>
                <span className="font-mono-code font-bold text-stone-200 text-sm">~{fedToGridKwh} kWh / {lang === 'de' ? 'Jahr' : 'yr'}</span>
              </div>
            </div>

            {/* Amélie Insight Box */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 leading-relaxed font-serif-title">
              <p>
                {lang === 'de'
                  ? '💡 Amélie-Perspektive: Ein Balkonkraftwerk ist angewandte Volkssouveränität. Es braucht keinen Solarteur, keinen Dachdecker und keinen Notartermin. Es schenkt einer normalen Mietwohnung 20 Jahre lang kostenlosen Basisstrom für den Kühlschrank.'
                  : '💡 Amélie Perspective: Balcony solar is grassroots energy sovereignty. It requires no roofing contractor, no electrician permits, and no debt. It gives an ordinary rental flat 20 years of free baseline power for the family refrigerator.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 6: ZISTERNE & REGENWASSER-AUTONOMIE */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'regenwasser' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <span>{lang === 'de' ? 'Zisterne: Erntemenge & Trockenheits-Autonomie' : 'Rain Harvesting & Drought Resilience Gauge'}</span>
              </h3>
              <span className="text-xs font-mono-code bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">
                DIN 1989-1
              </span>
            </div>

            {/* Roof Area Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-stone-600">{lang === 'de' ? 'Wirksame Dachgrundfläche:' : 'Catchment Roof Area:'}</span>
                <span className="font-bold text-blue-900">{roofAreaM2} m²</span>
              </div>
              <input
                type="range"
                min="20"
                max="220"
                step="5"
                value={roofAreaM2}
                onChange={(e) => setRoofAreaM2(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-3xs text-stone-400 font-mono-code mt-0.5">
                <span>20 m² ({lang === 'de' ? 'Schuppen' : 'Shed'})</span>
                <span>80 m² ({lang === 'de' ? 'Reihenhaus' : 'Row House'})</span>
                <span>200 m² ({lang === 'de' ? 'Einfamilienhaus' : 'Detached'})</span>
              </div>
            </div>

            {/* Annual Rain Index */}
            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-stone-600">{lang === 'de' ? 'Mittlerer Jahresniederschlag:' : 'Annual Rainfall Index:'}</span>
                <span className="font-bold text-blue-900">{rainIndexMm} mm / {lang === 'de' ? 'Jahr' : 'yr'}</span>
              </div>
              <input
                type="range"
                min="450"
                max="1200"
                step="25"
                value={rainIndexMm}
                onChange={(e) => setRainIndexMm(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-3xs text-stone-400 font-mono-code mt-0.5">
                <span>480 mm ({lang === 'de' ? 'Berlin / Brandenburg' : 'Dry East'})</span>
                <span>750 mm ({lang === 'de' ? 'Köln / Frankfurt' : 'Central'})</span>
                <span>1100 mm ({lang === 'de' ? 'Voralpenland' : 'Alpine Rim'})</span>
              </div>
            </div>

            {/* Roof Surface Material */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
                {lang === 'de' ? 'Dach-Eindeckung (Abflussbeiwert):' : 'Roof Surface Material:'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'tiles', labelDe: 'Ton-/Betonziegel', labelEn: 'Clay Tiles', coeff: '85%' },
                  { id: 'metal_sheet', labelDe: 'Blech / Zinkfalz', labelEn: 'Sheet Metal', coeff: '92%' },
                  { id: 'green_roof', labelDe: 'Extensiv Gründach', labelEn: 'Green Roof', coeff: '50%' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRoofSurface(item.id as any)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      roofSurface === item.id
                        ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="font-medium text-2xs">{lang === 'de' ? item.labelDe : item.labelEn}</div>
                    <div className="text-3xs text-blue-700 font-mono-code font-bold mt-0.5">{item.coeff} {lang === 'de' ? 'Ertrag' : 'drain'}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cistern Volume */}
            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-stone-600">{lang === 'de' ? 'Zisternen- / Speichervolumen:' : 'Cistern Storage Volume:'}</span>
                <span className="font-bold text-blue-900">{cisternVolumeL.toLocaleString()} Liter</span>
              </div>
              <input
                type="range"
                min="300"
                max="6000"
                step="100"
                value={cisternVolumeL}
                onChange={(e) => setCisternVolumeL(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-3xs text-stone-400 font-mono-code mt-0.5">
                <span>300 L ({lang === 'de' ? 'Regentonne' : 'Barrel'})</span>
                <span>1.500 L ({lang === 'de' ? 'Kompakt-Tank' : 'Modular'})</span>
                <span>5.000 L ({lang === 'de' ? 'Erdzisterne' : 'Underground'})</span>
              </div>
            </div>

            {/* Consumption check */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={useForToilets}
                  onChange={(e) => setUseForToilets(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{lang === 'de' ? 'WC-Spülung angeschlossen (spart ~60 L Trinkwasser täglich)' : 'Connected to toilet flushing (~60 L daily savings)'}</span>
              </label>

              <div>
                <div className="flex justify-between text-xs font-mono-code mb-1">
                  <span className="text-stone-600">{lang === 'de' ? 'Gartenfläche zur Bewässerung:' : 'Irrigated Garden Area:'}</span>
                  <span className="font-bold text-stone-800">{gardenAreaM2} m²</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="20"
                  value={gardenAreaM2}
                  onChange={(e) => setGardenAreaM2(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-6 bg-stone-900 text-white rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="text-xs font-mono-code uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                <span>{lang === 'de' ? 'Wasserbilanz & Trockenheitspuffer' : 'Water Balance & Drought Autonomy'}</span>
              </div>
              <span className="text-3xs font-mono-code bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                WHG § 55 Abs. 2
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80">
                <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Jahres-Ernte' : 'Annual Harvest'}</div>
                <div className="text-2xl font-bold font-mono-code text-blue-300 mt-1">
                  {(annualRainfallHarvestL / 1000).toFixed(1)} m³
                </div>
                <div className="text-3xs text-stone-400">{annualRainfallHarvestL.toLocaleString()} Liter</div>
              </div>

              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80">
                <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Trocken-Puffer' : 'Drought Days'}</div>
                <div className="text-2xl font-bold font-mono-code text-emerald-400 mt-1">{droughtAutonomyDays}</div>
                <div className="text-3xs text-stone-400">{lang === 'de' ? 'Tage ohne Regen' : 'days autonomy'}</div>
              </div>

              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 col-span-2 sm:col-span-1">
                <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Kostenersparnis' : 'Money Saved'}</div>
                <div className="text-2xl font-bold font-mono-code text-amber-400 mt-1">{annualWaterSavingsEur} €</div>
                <div className="text-3xs text-stone-400">{lang === 'de' ? 'Trink- & Abwasser' : 'water tariff / yr'}</div>
              </div>
            </div>

            {/* Cistern Visual Water Level */}
            <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-medium">
                  {lang === 'de' ? 'Sommerlicher Trockenheits-Schutzfaktor:' : 'Summer Heatwave Protection Level:'}
                </span>
                <span className={`font-mono-code font-bold px-2 py-0.5 rounded text-3xs ${
                  droughtAutonomyDays >= 21 ? 'bg-emerald-900/80 text-emerald-300' : droughtAutonomyDays >= 10 ? 'bg-amber-900/80 text-amber-300' : 'bg-red-900/80 text-red-300'
                }`}>
                  {droughtAutonomyDays >= 21
                    ? (lang === 'de' ? '🟢 Voll krisenfest (> 3 Wochen)' : '🟢 Fully resilient (> 3 wks)')
                    : droughtAutonomyDays >= 10
                    ? (lang === 'de' ? '🟡 Ausreichend (1-2 Wochen)' : '🟡 Moderate (1-2 wks)')
                    : (lang === 'de' ? '🔴 Kritisch klein (< 10 Tage)' : '🔴 Tank too small')}
                </span>
              </div>

              {/* Water Tank Level Indicator */}
              <div className="relative w-full h-8 bg-stone-950 rounded-lg overflow-hidden border border-stone-700">
                <div
                  className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 h-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(10, (droughtAutonomyDays / 30) * 100))}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-3xs font-mono-code text-white font-bold drop-shadow">
                  {lang === 'de' ? `Reicht für ${Math.round(droughtAutonomyDays / 7)} Wochen Hitzeperiode` : `Sustains ${Math.round(droughtAutonomyDays / 7)} weeks of severe heatwave`}
                </span>
              </div>
            </div>

            {/* Municipal Fee Deduction Info */}
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 leading-relaxed font-serif-title">
              <p>
                {lang === 'de'
                  ? '💧 Satzungsvorteil: Wer Regenwasser auf eigenem Grund nutzt und nicht in die Mischkanalisation einleitet, spart in den meisten deutschen Kommunen 1,50 bis 2,20 € pro m² versiegelter Fläche an Niederschlagswassergebühr — ganz ohne Antragsgebühr.'
                  : '💧 Municipal Advantage: Harvesting rainfall on-site avoids stormwater runoff fees in most European cities (saving 1.50 - 2.20 €/m² of sealed roof area every year), while safeguarding local groundwater tables.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 7: KLARLOKAL (THE BATTERING RAM) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'klarlokal' && (
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
                  {lang === 'de' ? 'KlarLokal: Das Beamtendeutsch-Brecheisen' : 'KlarLokal: The Bureaucracy Battering Ram'}
                </h3>
                <p className="text-sm text-stone-400 mt-1 max-w-2xl font-serif-title">
                  {lang === 'de'
                    ? 'Wandelt amtliche Drohbescheide und Paragraphenketten lokal im Browser (DIN SPEC 33429 / Leichte Sprache) in drei beruhigende, exakte Fakten um: Das Urteil, die Frist und die Checkliste.'
                    : 'Locally decodes German administrative mail in-browser into three clear facts: The Verdict, The Deadline, and The Action Checklist, with zero data leaving the device.'}
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
                    {lang === 'de' ? '1. Behördenschreiben wählen oder einfügen' : '1. Select or Paste Administrative Notice'}
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
                    {lang === 'de' ? '1. Das Urteil (Kernaussage)' : '1. The Verdict (Plain Language)'}
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
                    : 'Stripped of intimidation, condensed into a single human sentence.'}
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
                    <span>{lang === 'de' ? '2. Die Frist' : '2. The Deadline'}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-3xs font-mono-code font-bold ${
                    activeLetter.urgency === 'critical'
                      ? 'bg-red-200 text-red-900 border border-red-300'
                      : 'bg-amber-200 text-amber-900 border border-amber-300'
                  }`}>
                    {activeLetter.daysLeft} {lang === 'de' ? 'Tage verbleibend' : 'days left'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold font-mono-code text-stone-900">
                    {activeLetter.deadline}
                  </div>
                  <div className="text-xs font-sans text-stone-600">
                    {activeLetter.urgency === 'critical'
                      ? (lang === 'de' ? '⚠️ Dringend: Leistungsausfall droht' : '⚠️ Critical: Benefits freeze')
                      : (lang === 'de' ? '⏰ Feste Ausschlussfrist' : '⏰ Regulatory limit')}
                  </div>
                </div>
              </div>

              {/* Output 3: Die Checkliste (Action Checklist) */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-2xs font-mono-code uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'de' ? '3. Die Checkliste (Genau 3 Schritte)' : '3. The 3-Step Action Plan'}</span>
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
                      {lang === 'de' ? 'Panik-Bremse: Muster-Fristverlängerung' : 'Anti-Panic: Extension Template'}
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
                    <span>{copiedExtension ? (lang === 'de' ? 'Kopiert!' : 'Copied!') : (lang === 'de' ? 'Vorlage kopieren' : 'Copy Draft')}</span>
                  </button>
                </div>
                <p className="text-2xs text-stone-400 font-sans leading-relaxed">
                  {lang === 'de'
                    ? 'Kopieren und sofort per Elster, Jobcenter.digital oder Post einreichen, um die Frist sanktionsfrei um bis zu 4 Wochen nach hinten zu schieben:'
                    : 'Copy and submit immediately via official portal or certified mail to legally suspend enforcement by up to 4 weeks:'}
                </p>
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-2xs font-mono-code text-stone-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                  {lang === 'de' ? activeLetter.extensionDraftDe : activeLetter.extensionDraftEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 8: CRACK FLORA WATCHER (TOUGHNESS INDEX & PAVEMENT LAB) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'crackflora' && (
        <div className="space-y-6">
          {/* Hero Banner for Crack Flora Watcher */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-stone-100 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-lime-950/80 border border-lime-500/50 text-lime-300 text-xs font-mono-code mb-2">
                  <span>🌱 #Krautschau Citizen Science · Senckenberg & Flora Incognita Bridge</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white tracking-tight">
                  {lang === 'de' ? 'Crack Flora Watcher: Das Ritzengrün-Labor' : 'Crack Flora Watcher: Pavement Botany Lab'}
                </h3>
                <p className="text-sm text-stone-400 mt-1 max-w-2xl font-serif-title">
                  {lang === 'de'
                    ? '„Sie sagten, hier kann nichts wachsen. Die Pflanzen sahen das anders." – Berechnen Sie den Härtegrad-Index (Toughness Index) und simulieren Sie das Zeitraffer-Wachstum in extremen Asphalt-Mikrolebensräumen.'
                    : '"They said nothing could grow here. The plants disagreed." – Calculate the Toughness Index and explore multi-week growth time-lapses in hostile asphalt micro-habitats.'}
                </p>
              </div>

              {/* Toughness Index Quick Badge */}
              <div className="bg-stone-950/90 p-3.5 rounded-xl border border-stone-800 text-center font-mono-code min-w-[200px]">
                <div className="text-stone-400 text-3xs uppercase tracking-wider">Toughness Index</div>
                <div className="text-3xl font-bold text-lime-400 font-mono-code my-0.5">
                  {rawToughnessScore} <span className="text-xs text-stone-500">/ 10.0</span>
                </div>
                <div className="text-2xs font-sans text-stone-300 font-medium">
                  {toughnessRank}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Plant Selection & Substrate Parameters */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌿</span>
                  <h4 className="font-bold text-stone-900 font-serif-title text-base">
                    {lang === 'de' ? '1. Asphaltheld & Standort wählen' : '1. Select Pavement Survivor & Micro-Habitat'}
                  </h4>
                </div>
                <span className="text-2xs font-mono-code bg-lime-50 text-lime-800 px-2 py-0.5 rounded border border-lime-300">
                  Dose #19
                </span>
              </div>

              {/* Plant Buttons */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-2">
                  {lang === 'de' ? 'Pflaster-Pionierart:' : 'Pioneer Species:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(plantCatalog) as Array<keyof typeof plantCatalog>).map((pKey) => {
                    const p = plantCatalog[pKey];
                    const isSelected = selectedPlantId === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => setSelectedPlantId(pKey)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'bg-lime-50/80 border-lime-500 text-lime-950 font-bold shadow-2xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="truncate font-sans font-medium text-stone-900">{lang === 'de' ? p.nameDe.split('(')[0] : p.nameEn.split('(')[0]}</div>
                        <div className="text-3xs font-mono-code text-stone-500 italic truncate">({p.nameDe.split('(')[1]?.replace(')', '') || ''})</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Substrate Selector */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-2">
                  {lang === 'de' ? 'Untergrund / Substrat-Härte:' : 'Substrate Adversity:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(Object.keys(substrateModifiers) as Array<keyof typeof substrateModifiers>).map((subKey) => {
                    const isSelected = substrateType === subKey;
                    return (
                      <button
                        key={subKey}
                        type="button"
                        onClick={() => setSubstrateType(subKey)}
                        className={`p-2 rounded-lg border text-left text-2xs transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white font-bold border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className="font-sans">{lang === 'de' ? substrateModifiers[subKey].labelDe : substrateModifiers[subKey].labelEn}</div>
                        <div className="text-3xs font-mono-code text-stone-400">+{substrateModifiers[subKey].score} Toughness</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Traffic / Compaction Selector */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-2">
                  {lang === 'de' ? 'Tritt- & Belastungseinfluss:' : 'Foot & Vehicle Compaction:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(Object.keys(trafficModifiers) as Array<keyof typeof trafficModifiers>).map((trafKey) => {
                    const isSelected = trafficExposure === trafKey;
                    return (
                      <button
                        key={trafKey}
                        type="button"
                        onClick={() => setTrafficExposure(trafKey)}
                        className={`p-2 rounded-lg border text-left text-2xs transition-all ${
                          isSelected
                            ? 'bg-amber-950 text-amber-100 font-bold border-amber-800'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className="font-sans">{lang === 'de' ? trafficModifiers[trafKey].labelDe : trafficModifiers[trafKey].labelEn}</div>
                        <div className="text-3xs font-mono-code text-amber-500/80">+{trafficModifiers[trafKey].score} Pts</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sun & Microclimate */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-2">
                  {lang === 'de' ? 'Mikroklima & Hitzeinsel-Faktor:' : 'Microclimate & Heat Stress:'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(Object.keys(sunModifiers) as Array<keyof typeof sunModifiers>).map((sKey) => {
                    const isSelected = sunExposure === sKey;
                    return (
                      <button
                        key={sKey}
                        type="button"
                        onClick={() => setSunExposure(sKey)}
                        className={`p-2 rounded-lg border text-left text-2xs transition-all ${
                          isSelected
                            ? 'bg-stone-800 text-white font-bold border-stone-800'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className="font-sans leading-tight">{lang === 'de' ? sunModifiers[sKey].labelDe.split('(')[0] : sunModifiers[sKey].labelEn.split('(')[0]}</div>
                        <div className="text-3xs font-mono-code text-stone-400">+{sunModifiers[sKey].score}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bot Superpower Card */}
              <div className="p-3.5 bg-lime-50/70 border border-lime-200 rounded-xl space-y-1.5 text-xs text-lime-950">
                <div className="font-bold flex items-center gap-1.5 text-stone-900 font-mono-code text-2xs uppercase">
                  <span>⚡ Urban Survival Superpower:</span>
                </div>
                <p className="font-serif-title text-xs leading-relaxed text-stone-800">
                  {lang === 'de' ? currentPlantData.superpowerDe : currentPlantData.superpowerEn}
                </p>
                <div className="text-3xs font-mono-code text-lime-800 pt-1">
                  Typischer Kiez-Spot: {lang === 'de' ? currentPlantData.urbanNicheDe : currentPlantData.urbanNicheEn}
                </div>
              </div>
            </div>

            {/* Right Column: Time-Lapse Visualizer & Krautschau Export */}
            <div className="lg:col-span-6 space-y-4">
              {/* Time-Lapse Box */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-2xs font-mono-code uppercase tracking-wider text-stone-600 font-bold flex items-center gap-1.5">
                    <span>⏱️ Kanten-ausgerichtetes Zeitraffer-Tracking</span>
                  </span>
                  <span className="text-3xs font-mono-code bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                    Woche {timeLapseWeek} von 8
                  </span>
                </div>

                {/* Asphalt Crack Simulated Canvas */}
                <div className="h-44 bg-gradient-to-br from-stone-800 via-stone-900 to-black rounded-xl p-4 relative overflow-hidden flex flex-col justify-between border border-stone-700 shadow-inner">
                  {/* Asphalt Texture Overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                  {/* Simulated Crack Line across canvas */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0,90 Q 60,85 110,105 T 220,95 T 320,115 T 450,100" fill="none" stroke="#222" strokeWidth="6" strokeLinecap="round" />
                    <path d="M 0,90 Q 60,85 110,105 T 220,95 T 320,115 T 450,100" fill="none" stroke="#555" strokeWidth="1.5" strokeDasharray="4 2" />
                    <circle cx="220" cy="95" r="4" fill="#a3e635" />
                  </svg>

                  {/* Top Bar on Canvas */}
                  <div className="relative z-10 flex justify-between items-center text-3xs font-mono-code text-stone-400">
                    <span className="bg-black/60 px-2 py-0.5 rounded text-lime-400">
                      OpenCV Contour Match: 98.4%
                    </span>
                    <span className="bg-black/60 px-2 py-0.5 rounded text-stone-300">
                      GPS: 52.4862° N, 13.4321° E (Berlin-Neukölln)
                    </span>
                  </div>

                  {/* Growth Stage Center Description */}
                  <div className="relative z-10 text-center py-4">
                    <div className="inline-block p-3 rounded-2xl bg-black/80 border border-stone-700 backdrop-blur-xs text-white max-w-sm mx-auto shadow-lg">
                      <div className="text-xs font-bold text-lime-300 font-serif-title">
                        {lang === 'de'
                          ? currentPlantData.growthStages.find((s) => s.week === timeLapseWeek)?.labelDe || currentPlantData.growthStages[2].labelDe
                          : currentPlantData.growthStages.find((s) => s.week === timeLapseWeek)?.labelEn || currentPlantData.growthStages[2].labelEn}
                      </div>
                      <div className="text-3xs text-stone-400 font-mono-code mt-1">
                        Substrat: {lang === 'de' ? substrateModifiers[substrateType].labelDe : substrateModifiers[substrateType].labelEn}
                      </div>
                    </div>
                  </div>

                  {/* Chalk Hashtag simulation */}
                  <div className="relative z-10 flex justify-between items-end text-3xs font-mono-code text-amber-200/90 font-serif">
                    <span className="bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded">
                      ✏️ Kreide-Tag: {currentPlantData.chalkTag}
                    </span>
                    <span className="text-stone-500">Foto 1 von 4 synchronisiert</span>
                  </div>
                </div>

                {/* Week Slider Controls */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-2xs font-mono-code text-stone-600">
                    <span>Woche 1: Keimung</span>
                    <span>Woche 2: Rosette</span>
                    <span>Woche 4: Blüte</span>
                    <span>Woche 8: Samen</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 8].map((wk) => (
                      <button
                        key={wk}
                        type="button"
                        onClick={() => setTimeLapseWeek(wk)}
                        className={`py-1.5 rounded-lg text-xs font-mono-code font-bold border transition-all ${
                          timeLapseWeek === wk
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200'
                        }`}
                      >
                        W{wk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Data & #Krautschau Senckenberg Export */}
              <div className="bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏛️</span>
                    <span className="text-xs font-bold font-mono-code text-lime-300">
                      {lang === 'de' ? 'Forschungs-Export (#Krautschau & Flora Incognita)' : 'Citizen Science Export (GBIF & #Krautschau)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setExportedKrautschauData(true);
                      setTimeout(() => setExportedKrautschauData(false), 2400);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-2xs font-mono-code transition-all border border-stone-700"
                  >
                    {exportedKrautschauData ? <Check className="w-3 h-3 text-lime-400" /> : <Copy className="w-3 h-3 text-stone-300" />}
                    <span>{exportedKrautschauData ? (lang === 'de' ? 'Exportiert!' : 'Exported!') : (lang === 'de' ? 'GeoJSON kopieren' : 'Copy GeoJSON')}</span>
                  </button>
                </div>

                <p className="text-2xs text-stone-400 font-sans leading-relaxed">
                  {lang === 'de'
                    ? 'Standardisiertes Format für urbane Biodiversitäts-Datenbanken nach dem GartenDiv-Tag-Modell von Flora Incognita:'
                    : 'Standardized observation record following the Flora Incognita GartenDiv model for urban biodiversity studies:'}
                </p>

                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-2xs font-mono-code text-stone-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
{`{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [13.4321, 52.4862] },
  "properties": {
    "project": "CrackFloraWatcher",
    "campaign": "Krautschau2026",
    "taxon": "${currentPlantData.nameEn.split('(')[0].trim()}",
    "scientificName": "${currentPlantData.nameDe.split('(')[1]?.replace(')', '') || 'Taraxacum'}",
    "toughnessIndex": ${rawToughnessScore},
    "toughnessRank": "${toughnessRank}",
    "substrate": "${substrateType}",
    "compactionStress": "${trafficExposure}",
    "urbanHeatStress": "${sunExposure}",
    "timeLapseObservationWeeks": ${timeLapseWeek},
    "privacyNoiseOffsetMeters": 25.0,
    "license": "CC0-1.0-Public-Domain"
  }
}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import {
  Thermometer,
  Info,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Flame,
  Wind,
  Home,
  Sliders,
  TrendingDown,
  Layers,
  Activity,
} from 'lucide-react';
import { Language } from '../../types';
import {
  computeAltbau,
  effectiveWindowWidth,
  BERLIN_TYPOLOGY_PRESETS,
  BuildingTypologyPreset,
  calculateFRsi,
  CEILING_H,
  WINDOW_H,
} from '../../services/altbauThermal';

interface AltbauThermalSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

type ViewMode = 'floorplan' | 'corner2d' | 'stratification' | 'comparison';
type ProbePoint = 'corner' | 'wall' | 'window' | 'radiator' | 'center' | 'floor';

export const AltbauThermalSimulator: React.FC<AltbauThermalSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  // Preset or custom
  const [selectedPresetId, setSelectedPresetId] = useState<string>('altbau_1905');
  const [wallType, setWallType] = useState<'brick_uninsulated' | 'brick_renovated' | 'solid_concrete'>('brick_uninsulated');
  const [windowGlazing, setWindowGlazing] = useState<'single' | 'double_old' | 'triple_modern'>('double_old');
  const [outsideTemp, setOutsideTemp] = useState<number>(-2);
  const [roomTemp, setRoomTemp] = useState<number>(20);
  const [windowTilted, setWindowTilted] = useState<boolean>(false);
  const [roomArea, setRoomArea] = useState<number>(22); // m² (Berliner Zimmer)
  const [roomWidth, setRoomWidth] = useState<number>(5.0); // m, Länge der Außenwand
  const [windowWidth, setWindowWidth] = useState<number>(2.4); // m, Höhe fest 1.9 m
  const [relHumidity, setRelHumidity] = useState<number>(50); // % rel. Raumluftfeuchte
  const [wardrobePosition, setWardrobePosition] = useState<'tight' | 'ventilated' | 'none'>('tight');
  const [hasSecondExteriorWall, setHasSecondExteriorWall] = useState<boolean>(true); // Ecksituation
  const [showMeshNodes, setShowMeshNodes] = useState<boolean>(false); // 2D Finite-Difference Grid Toggle

  // View modes
  const [viewMode, setViewMode] = useState<ViewMode>('floorplan');
  const [activeProbe, setActiveProbe] = useState<ProbePoint>('corner');
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Variant B for comparison
  const [variantBWallU, setVariantBWallU] = useState<number>(0.24); // WDVS saniert
  const [variantBWindowU, setVariantBWindowU] = useState<number>(0.8); // 3-fach Verglasung
  const [variantBAirChange, setVariantBAirChange] = useState<number>(0.5); // Stoßlüftung

  const wallUValues = {
    brick_uninsulated: 1.7,
    brick_renovated: 0.24,
    solid_concrete: 2.1,
  };
  const windowUValues = {
    single: 5.0,
    double_old: 2.8,
    triple_modern: 0.8,
  };

  const wallU = wallUValues[wallType];
  const windowU = windowUValues[windowGlazing];
  const airChangeRate = windowTilted ? 3.0 : 0.5;
  const hasCornerFurniture = wardrobePosition === 'tight';

  // Current simulation (with deep physics finite-difference + microclimate + stratification)
  const altbau = computeAltbau({
    roomWidth,
    roomArea,
    windowWidth,
    wallU,
    windowU,
    airChange: airChangeRate,
    roomTemp,
    outsideTemp,
    relHumidity,
    hasCornerFurniture,
    hasSecondExteriorWall,
  });

  // Variant B simulation for comparison
  const altbauVariantB = computeAltbau({
    roomWidth,
    roomArea,
    windowWidth,
    wallU: variantBWallU,
    windowU: variantBWindowU,
    airChange: variantBAirChange,
    roomTemp,
    outsideTemp,
    relHumidity,
    hasCornerFurniture: false,
    hasSecondExteriorWall,
  });

  const tr3 = (de: string, en: string, es: string) => (lang === 'de' ? de : lang === 'es' ? es : en);
  const numLocale = lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-GB';
  const nf = (x: number, d = 1) => x.toLocaleString(numLocale, { minimumFractionDigits: d, maximumFractionDigits: d });
  const round10 = (x: number) => Math.round(x / 10) * 10;
  const tempAxisMin = Math.floor(Math.min(outsideTemp, altbau.cornerLow, altbau.dewPoint) - 1);
  const tempAxisMax = Math.ceil(roomTemp + 0.5);
  const tempPos = (t: number) => `${(100 * (t - tempAxisMin)) / (tempAxisMax - tempAxisMin)}%`;
  const partTotal = altbau.hWall + altbau.hWindow + altbau.hVent;
  const effWindowWidth = effectiveWindowWidth(roomWidth, windowWidth);

  // Apply building preset
  const handleApplyPreset = (preset: BuildingTypologyPreset) => {
    setSelectedPresetId(preset.id);
    if (preset.wallU <= 0.3) {
      setWallType('brick_renovated');
    } else if (preset.wallU > 1.9) {
      setWallType('solid_concrete');
    } else {
      setWallType('brick_uninsulated');
    }

    if (preset.windowU <= 1.0) {
      setWindowGlazing('triple_modern');
    } else if (preset.windowU <= 3.0) {
      setWindowGlazing('double_old');
    } else {
      setWindowGlazing('single');
    }
  };

  // Surface temperatures at probes
  const roomDepth = roomArea / roomWidth;
  const wallSurfaceTemp1D = roomTemp - wallU * 0.13 * (roomTemp - outsideTemp);
  const windowGlassSurfaceTemp = roomTemp - windowU * 0.13 * (roomTemp - outsideTemp);
  const cornerSurfaceTemp = altbau.corner2DGeometricMid;
  const cornerFRsi = calculateFRsi(cornerSurfaceTemp, roomTemp, outsideTemp);

  // Probe detail info
  const getProbeDetails = () => {
    switch (activeProbe) {
      case 'corner':
        return {
          title: tr3('Außenecke (hinter Schrank)', 'Exterior Corner (behind wardrobe)', 'Esquina exterior (tras armario)'),
          temp: cornerSurfaceTemp,
          fRsi: cornerFRsi,
          rh: altbau.surfaceRhCorner,
          status: cornerFRsi < 0.70 ? 'danger' : 'safe',
          desc: tr3(
            `2D-Finite-Differenzen-Berechnung (DIN EN ISO 10211). Lokale Oberflächenfeuchte: ${nf(altbau.surfaceRhCorner, 1)} %. ${
              altbau.surfaceRhCorner >= 80
                ? `Schimmelpilz-Auskeimung nach Sedlbauer LIM in ca. ${altbau.moldGerminationDays} Tagen!`
                : 'Oberflächenfeuchte unter 80 %: Keine akute Keimungsgefahr.'
            }`,
            `2D Finite Difference Calculation (DIN EN ISO 10211). Local surface humidity: ${nf(altbau.surfaceRhCorner, 1)}%. ${
              altbau.surfaceRhCorner >= 80
                ? `Spore germination estimated in ~${altbau.moldGerminationDays} days per Sedlbauer LIM!`
                : 'Surface humidity below 80%: Safe microclimate.'
            }`,
            `Cálculo 2D por diferencias finitas (DIN EN ISO 10211). Humedad superficial: ${nf(altbau.surfaceRhCorner, 1)} %.`
          ),
        };
      case 'wall':
        return {
          title: tr3('Ungestörte Außenwandmitte', 'Undisturbed Wall Mid-section', 'Centro de muro no perturbado'),
          temp: wallSurfaceTemp1D,
          fRsi: calculateFRsi(wallSurfaceTemp1D, roomTemp, outsideTemp),
          rh: altbau.surfaceRhWall,
          status: 'safe',
          desc: tr3(
            `1D-Wärmeleitung (Rsi=0.13 m²K/W). Oberflächenfeuchte: ${nf(altbau.surfaceRhWall, 1)} %. Durch freie Raumluftkonvektion erwärmt und getrocknet.`,
            `1D heat conduction (Rsi=0.13 m²K/W). Surface humidity: ${nf(altbau.surfaceRhWall, 1)}%. Kept dry by free room convection.`,
            `Conducción térmica 1D estándar. Humedad: ${nf(altbau.surfaceRhWall, 1)} %.`
          ),
        };
      case 'window':
        return {
          title: tr3('Fenster-Glasoberfläche innen', 'Inner Window Glass Surface', 'Superficie interior del vidrio'),
          temp: windowGlassSurfaceTemp,
          fRsi: calculateFRsi(windowGlassSurfaceTemp, roomTemp, outsideTemp),
          rh: windowGlassSurfaceTemp < altbau.dewPoint ? 100 : Math.round((relHumidity / (altbau.dewPoint + 20)) * 25),
          status: windowGlassSurfaceTemp < altbau.dewPoint ? 'danger' : 'safe',
          desc: tr3(
            windowGlassSurfaceTemp < altbau.dewPoint
              ? `Achtung: Temperatur (${nf(windowGlassSurfaceTemp, 1)} °C) < Taupunkt (${nf(altbau.dewPoint, 1)} °C)! Scheibe beschlägt mit flüssigem Tauwasser.`
              : 'Glasoberfläche liegt über dem Taupunkt. Kein unmittelbarer Kondensatausfall.',
            windowGlassSurfaceTemp < altbau.dewPoint
              ? `Warning: Below dew point (${nf(altbau.dewPoint, 1)} °C)! Glass will run with condensation.`
              : 'Glass surface is above dew point. No surface condensation.',
            'Superficie de vidrio calculada.'
          ),
        };
      case 'radiator':
        return {
          title: tr3('Heizkörper-Nahbereich (Konvektion)', 'Radiator Zone (Convective Plume)', 'Zona del radiador'),
          temp: roomTemp + 3.5,
          fRsi: 1.0,
          rh: 32,
          status: 'safe',
          desc: tr3(
            'Konvektiver Auftriebsstrom nach DIN EN 442. Warme Luft steigt mit ca. 0,35 m/s nach oben und verteilt sich unter der 3,40 m hohen Decke.',
            'Convective upward plume per DIN EN 442. Warm air ascends at ~0.35 m/s toward the 3.4m high ceiling.',
            'Corriente convectiva ascendente hacia el techo de 3,4 m.'
          ),
        };
      case 'floor':
        return {
          title: tr3('Fußboden / Knöchelhöhe (z = 0,1 m)', 'Floor / Ankle Level (z = 0.1 m)', 'Nivel del suelo (z = 0,1 m)'),
          temp: altbau.stratification.floorTemp,
          fRsi: calculateFRsi(altbau.stratification.floorTemp, roomTemp, outsideTemp),
          rh: 58,
          status: altbau.stratification.draftRiskPercent > 20 ? 'danger' : 'safe',
          desc: tr3(
            `Kaltluftabsenkung im Altbau. Temperatur am Boden: ${nf(altbau.stratification.floorTemp, 1)} °C. ${
              windowTilted
                ? `⚠️ Durch Kippfenster strömt Kaltluft direkt auf den Boden (Zugluftrisiko ISO 7730 PPD: ${altbau.stratification.draftRiskPercent} %)!`
                : 'Mäßige Temperaturschichtung ohne spürbare Zugerscheinung.'
            }`,
            `Altbau floor cold pool. Floor temperature: ${nf(altbau.stratification.floorTemp, 1)} °C. ${
              windowTilted
                ? `⚠️ Tilted window causes cold air lake on floor (ISO 7730 draft dissatisfaction PPD: ${altbau.stratification.draftRiskPercent}%)!`
                : 'Moderate thermal stratification.'
            }`,
            `Temperatura en el suelo: ${nf(altbau.stratification.floorTemp, 1)} °C.`
          ),
        };
      case 'center':
      default:
        return {
          title: tr3('Raummitte / Aufenthaltszone (z = 1,7 m)', 'Room Center / Living Zone (z = 1.7 m)', 'Zona central (z = 1,7 m)'),
          temp: roomTemp,
          fRsi: 1.0,
          rh: relHumidity,
          status: 'safe',
          desc: tr3(
            `Behagliche Raumlufttemperatur: ${nf(roomTemp, 1)} °C bei ${relHumidity} % relativer Feuchte.`,
            `Comfort ambient air: ${nf(roomTemp, 1)} °C at ${relHumidity} % relative humidity.`,
            `Temperatura ambiente: ${nf(roomTemp, 1)} °C.`
          ),
        };
    }
  };

  const probeInfo = getProbeDetails();

  // Copy inspection report
  const handleCopyReport = () => {
    const text = `=== AMÉLIE KULA-RING: ALTBAU THERMAL PRÜFPROTOKOLL (DIN EN ISO 10211) ===
Objekt: Berliner Altbau-Zimmer (${nf(roomArea, 0)} m², Außenwand ${nf(roomWidth, 1)} m, Deckenhöhe 3,40 m)
Typologie: ${wallType === 'brick_uninsulated' ? '38 cm Vollziegel ungedämmt' : wallType === 'brick_renovated' ? 'Ziegel mit WDVS' : 'Beton/Platte'} (U = ${nf(wallU, 2)} W/m²K)
Verglasung: ${windowGlazing} (U = ${nf(windowU, 1)} W/m²K)
Lüftung: ${windowTilted ? 'Dauergekippt (n = 3.0 /h)' : 'Geschlossen (n = 0.5 /h)'}
Klimarandbedingungen: Außen ${nf(outsideTemp, 0)} °C, Raum ${nf(roomTemp, 1)} °C, Raumfeuchte ${relHumidity} %

PHYSIKALISCHE ERGEBNISSE:
- 2D-Wärmebrücke Außenecke (ISO 10211): θ_si = ${nf(cornerSurfaceTemp, 1)} °C (f_Rsi = ${nf(cornerFRsi, 2)})
- Normgrenze DIN 4108-2: f_Rsi ≥ 0,70 -> ${cornerFRsi >= 0.70 ? 'EINGEHALTEN' : 'NICHT EINGEHALTEN (Schimmelgefahr!)'}
- Linearer Wärmedurchgangskoeffizient: Ψ = ${nf(altbau.finiteDifference2D.psiValue, 3)} W/(m·K)
- Lokale Oberflächenfeuchte Ecke: φ_si = ${nf(altbau.surfaceRhCorner, 1)} %
- Schimmelgrenze (80 % Feuchte): θ_mold = ${nf(altbau.moldThreshold, 1)} °C
- Taupunkt: θ_dew = ${nf(altbau.dewPoint, 1)} °C
- Sedlbauer LIM Myzelkeimung: ${altbau.moldGerminationDays < 900 ? `in ca. ${altbau.moldGerminationDays} Tagen` : 'Keine Keimung (> 60 Tage)'}
- Fußbodentemperatur (z = 0,1 m): ${nf(altbau.stratification.floorTemp, 1)} °C (Zugluftrisiko ISO 7730: ${altbau.stratification.draftRiskPercent} % PPD)
- Heizleistungsbedarf: ≈ ${nf(round10(altbau.heatLow), 0)} – ${nf(round10(altbau.heatHigh), 0)} W
- Jahreswärmebedarf (Berlin HGT 3200): ${nf(Math.round(altbau.annualKwhMid), 0)} kWh/a (ca. ${nf(Math.round(altbau.annualCostMid), 0)} €/a)

MÖBLIERUNGSEFFEKT:
${wardrobePosition === 'tight' ? 'Schrank bündig an der Ecke (0 cm) -> Luftkonvektion blockiert (Rsi = 0.45 m²K/W).' : wardrobePosition === 'ventilated' ? 'Schrank mit 10 cm Hinterlüftung -> Konvektion intakt, Wand ca. 1.8 K wärmer.' : 'Freie Ecke.'}

HINWEIS: Berechnet auf Basis stationärer finite-Differenzen-Verfahren (DIN EN ISO 10211).`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Framing Banner */}
      <div className="p-4 rounded-2xl border-2 border-amber-700 bg-amber-50/80 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs" role="note">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>{tr3('Reale Thermodynamik nach DIN EN ISO 10211, DIN 4108-2 & Sedlbauer-Modell.', 'Realistic thermodynamics based on DIN EN ISO 10211, DIN 4108-2 & Sedlbauer model.', 'Termodinámica según DIN EN ISO 10211 y DIN 4108-2.')}</strong>{' '}
            {tr3(
              'Löst die 2D-Wärmeleitungsgleichung (Laplace-Operator) numerisch per finite Differenzen. Berechnet Schimmelpilz-Keimungszeiten und thermische Schichtung im 3,40 m hohen Berliner Altbau.',
              'Numerically solves the 2D heat conduction equation via finite differences. Computes mold germination days and vertical air stratification in 3.40m Berlin Altbau rooms.',
              'Resuelve la ecuación de calor 2D por diferencias finitas y calcula estratificación térmica.'
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-950 hover:bg-amber-100/60 font-semibold text-xs transition-colors cursor-pointer"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
            <span>{copiedReport ? tr3('Kopiert!', 'Copied!', '¡Copiado!') : tr3('Prüfprotokoll', 'Report text', 'Informe')}</span>
          </button>
        </div>
      </div>

      {/* Building Typology Presets Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <div className="text-xs font-mono-code uppercase font-bold text-stone-600 mb-2.5 flex items-center justify-between">
          <span>{tr3('Berliner Baualtersklasse wählen (Schnellauswahl):', 'Select Berlin Building Typology Preset:', 'Seleccionar tipología de Berlín:')}</span>
          <span className="text-[11px] text-amber-800 font-sans font-normal">{tr3('Lädt historische Wand- & Fenster-U-Werte', 'Loads historic wall & window U-values', 'Carga valores U históricos')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {BERLIN_TYPOLOGY_PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-700 bg-amber-50/90 shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-0.5">
                  <span className="truncate">{lang === 'de' ? p.nameDe : p.nameEn}</span>
                  {p.isInsulated && <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono-code">KfW</span>}
                </div>
                <div className="text-[11px] text-stone-500 font-mono-code">
                  U_Wand = {p.wallU.toFixed(2)} · U_Fenster = {p.windowU.toFixed(1)}
                </div>
                <div className="text-[10px] text-stone-400 mt-1 line-clamp-1">
                  {lang === 'de' ? p.wallTypeDescDe : p.wallTypeDescEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls on Left, Visualizer / Drawing on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-title font-bold text-stone-900 text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-700" />
                <span>{tr3('Parameter & Randbedingungen', 'Parameters & Boundary Conditions', 'Parámetros y condiciones')}</span>
              </h3>
              <span className="text-xs font-mono-code bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                DIN 4108 / ISO 10211
              </span>
            </div>

            {/* Outdoor temperature & room temperature sliders */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1">
                <span>{tr3('Außentemperatur (Berlin Winter):', 'Outdoor Winter Temperature:', 'Temperatura exterior:')}</span>
                <span className="font-mono-code font-bold text-amber-900">{outsideTemp} °C</span>
              </div>
              <input
                type="range"
                min={-15}
                max={15}
                step={1}
                value={outsideTemp}
                onChange={(e) => setOutsideTemp(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono-code mt-0.5">
                <span>-15°C (Norm-Auslegung)</span>
                <span>0°C (Mittel)</span>
                <span>+15°C</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1">
                <span>{tr3('Raumtemperatur Sollwert:', 'Room Setpoint Temperature:', 'Temperatura interior:')}</span>
                <span className="font-mono-code font-bold text-amber-900">{roomTemp.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min={16}
                max={24}
                step={0.5}
                value={roomTemp}
                onChange={(e) => setRoomTemp(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1">
                <span>{tr3('Relative Raumluftfeuchte:', 'Room Relative Humidity:', 'Humedad relativa:')}</span>
                <span className="font-mono-code font-bold text-amber-900">{relHumidity} %</span>
              </div>
              <input
                type="range"
                min={30}
                max={75}
                step={1}
                value={relHumidity}
                onChange={(e) => setRelHumidity(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="text-[10px] text-stone-500 mt-0.5">
                {relHumidity > 60
                  ? tr3('⚠️ Erhöhte Feuchte (>60 %): Hohes Schimmelrisiko an kalten Ecken!', '⚠️ Elevated humidity (>60%): Strong mold hazard!', '⚠️ Humedad elevada: riesgo de moho.')
                  : tr3('Standard-Winterklima: 40–50 %', 'Normal winter target: 40–50%', 'Clima normal de invierno: 40–50%')}
              </div>
            </div>

            {/* Furniture Placement (The Core Dispute Item) */}
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-800" />
                  {tr3('Möblierung Außenecke (Schrank):', 'Corner Furniture (Wardrobe):', 'Mobiliario en esquina:')}
                </span>
                <span className="text-[10px] font-mono-code bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-900">
                  Rsi-Effekt
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setWardrobePosition('tight')}
                  className={`p-2 rounded-lg text-center font-medium transition-all ${
                    wardrobePosition === 'tight'
                      ? 'bg-rose-900 text-white font-bold shadow-2xs'
                      : 'bg-white border border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="text-[11px] leading-tight">{tr3('Bündig (0 cm)', 'Flush (0 cm)', 'Pegado (0 cm)')}</div>
                  <div className="text-[9px] opacity-80 font-mono-code">Rsi=0.45</div>
                </button>
                <button
                  type="button"
                  onClick={() => setWardrobePosition('ventilated')}
                  className={`p-2 rounded-lg text-center font-medium transition-all ${
                    wardrobePosition === 'ventilated'
                      ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                      : 'bg-white border border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="text-[11px] leading-tight">{tr3('10 cm Abstand', '10 cm gap', '10 cm sep.')}</div>
                  <div className="text-[9px] opacity-80 font-mono-code">Rsi=0.25</div>
                </button>
                <button
                  type="button"
                  onClick={() => setWardrobePosition('none')}
                  className={`p-2 rounded-lg text-center font-medium transition-all ${
                    wardrobePosition === 'none'
                      ? 'bg-stone-800 text-white font-bold shadow-2xs'
                      : 'bg-white border border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="text-[11px] leading-tight">{tr3('Kein Möbel', 'No furniture', 'Sin mueble')}</div>
                  <div className="text-[9px] opacity-80 font-mono-code">Freie Ecke</div>
                </button>
              </div>
              <p className="text-[10px] text-amber-900/80 leading-relaxed">
                {wardrobePosition === 'tight'
                  ? tr3('Häufigster Schlichtungsfall: Ein Schrank an der kalten Außenecke behindert die Raumluft-Konvektion. Die Wandoberfläche kühlt drastisch ab.', 'Top dispute cause: A wardrobe flush against an external corner blocks convection, plunging the surface temperature.', 'Causa típica de disputas: el armario bloquea la convección.')
                  : tr3('Hinterlüftung erlaubt dem warmen Raumluftstrom das Vorbeiziehen an der Wandecke.', 'Air gap allows buoyant room air to circulate behind the furniture.', 'La ventilación permite que el aire caliente circule tras el mueble.')}
              </p>
            </div>

            {/* Window Tilt Toggle */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-stone-600" />
                  {tr3('Fenster-Kipplüftung?', 'Window Tilted Open?', '¿Ventana abatible?')}
                </span>
                <span className="text-[11px] text-stone-500">
                  {windowTilted
                    ? tr3('Luftwechsel 3.0/h (Kaltluftsee am Boden, Zugluft)', 'Air change 3.0/h (floor cold pool, draft risk)', 'Renovación 3,0/h')
                    : tr3('Geschlossen: 0.5/h (Fugengrundlüftung)', 'Closed: 0.5/h (baseline infiltration)', 'Cerrada: 0,5/h')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWindowTilted(!windowTilted)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  windowTilted
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {windowTilted ? tr3('Gekippt (3.0/h)', 'Tilted', 'Abatible') : tr3('Geschlossen', 'Closed', 'Cerrada')}
              </button>
            </div>

            {/* Room Geometry Accordion */}
            <details className="rounded-xl border border-stone-200 p-3.5 text-xs">
              <summary className="cursor-pointer font-bold text-stone-900">
                {tr3('Geometrie & Bauteil-Details anpassen', 'Customize Geometry & Component Details', 'Personalizar geometría')}
              </summary>
              <div className="mt-3 space-y-3 pt-2 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <span>{tr3('Raumfläche:', 'Floor Area:', 'Superficie:')}</span>
                  <span className="font-mono-code font-bold">{roomArea} m²</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={45}
                  step={1}
                  value={roomArea}
                  onChange={(e) => setRoomArea(Number(e.target.value))}
                  className="w-full accent-amber-800"
                />

                <div className="flex justify-between items-center">
                  <span>{tr3('Länge der Außenwand:', 'Exterior Wall Length:', 'Longitud del muro:')}</span>
                  <span className="font-mono-code font-bold">{roomWidth.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={8}
                  step={0.2}
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Number(e.target.value))}
                  className="w-full accent-amber-800"
                />

                <div className="flex justify-between items-center">
                  <span>{tr3('Fensterbreite (Höhe 1,9 m):', 'Window Width (1.9 m tall):', 'Ancho de ventana:')}</span>
                  <span className="font-mono-code font-bold">{effWindowWidth.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={3.6}
                  step={0.1}
                  value={windowWidth}
                  onChange={(e) => setWindowWidth(Number(e.target.value))}
                  className="w-full accent-amber-800"
                />

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-stone-700">{tr3('Ecksituation (2 Außenwände):', 'Corner Room (2 exterior walls):', 'Habitación en esquina:')}</span>
                  <input
                    type="checkbox"
                    checked={hasSecondExteriorWall}
                    onChange={(e) => setHasSecondExteriorWall(e.target.checked)}
                    className="accent-amber-800 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </details>
          </div>

          {/* DIN 4108-2 & Sedlbauer Hygiene Card */}
          <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
            cornerFRsi < 0.70 ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold font-mono-code uppercase tracking-wider flex items-center gap-1.5">
                {cornerFRsi < 0.70 ? (
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                )}
                <span>{tr3('DIN 4108-2 Temperaturfaktor f_Rsi', 'DIN 4108-2 Temperature Factor f_Rsi', 'Factor f_Rsi DIN 4108-2')}</span>
              </span>
              <span className={`px-2 py-0.5 rounded font-mono-code font-bold text-xs ${
                cornerFRsi < 0.70 ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
              }`}>
                f_Rsi = {nf(cornerFRsi, 2)}
              </span>
            </div>

            {/* Visual Gauge */}
            <div className="relative h-4 rounded-full bg-stone-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  cornerFRsi < 0.70 ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, cornerFRsi * 100))}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-stone-900 z-10"
                style={{ left: '70%' }}
                title="DIN 4108-2 Mindestwert: 0,70"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono-code text-stone-500">
              <span>0.00</span>
              <span className="font-bold text-stone-900">Grenze 0.70 (Schimmelfreiheit)</span>
              <span>1.00</span>
            </div>

            {/* Sedlbauer Microclimate Indicator */}
            <div className="p-2.5 rounded-lg bg-white/70 border border-stone-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span>{tr3('Eck-Mikroklima (Sedlbauer LIM):', 'Corner Microclimate (Sedlbauer LIM):', 'Microclima de esquina:')}</span>
                <span className={`font-mono-code font-bold ${altbau.surfaceRhCorner >= 80 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  φ_si = {nf(altbau.surfaceRhCorner, 1)} %
                </span>
              </div>
              <div className="text-[10px] text-stone-600 flex justify-between">
                <span>
                  {altbau.surfaceRhCorner >= 80
                    ? `⚠️ Schimmelkeimung in ca. ${altbau.moldGerminationDays} Tagen!`
                    : '✅ Keimung inhibiert (Feuchte < 80 %)'}
                </span>
                <span className="font-mono-code">
                  Ψ = {nf(altbau.finiteDifference2D.psiValue, 3)} W/(m·K)
                </span>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed">
              {cornerFRsi < 0.70 ? (
                <span>
                  <strong>{tr3('Schimmelgefahr an der Ecke!', 'Mold risk at corner!', '¡Riesgo de moho en esquina!')}</strong>{' '}
                  {tr3(
                    `f_Rsi (${nf(cornerFRsi, 2)}) < 0,70. An der Oberfläche steigt die Feuchte über 80 %. Sporen finden optimale Wachstumsbedingungen.`,
                    `f_Rsi (${nf(cornerFRsi, 2)}) < 0.70. Surface RH exceeds 80%, promoting fungal mycelium germination.`,
                    `Factor f_Rsi crítico. Riesgo de moho activo.`
                  )}
                </span>
              ) : (
                <span>
                  <strong>{tr3('Normative Behaglichkeitsgrenze eingehalten.', 'DIN threshold met.', 'Límite normativo cumplido.')}</strong>{' '}
                  {tr3(
                    `f_Rsi = ${nf(cornerFRsi, 2)} ≥ 0,70 verhindert Schimmelbildung zuverlässig bei Normklima.`,
                    `f_Rsi = ${nf(cornerFRsi, 2)} ≥ 0.70 safely prevents mold formation at standard conditions.`,
                    `Superficie suficientemente cálida.`
                  )}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Column: Visualizer View Switcher + Canvas/Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* View Mode Tabs */}
          <div className="flex items-center justify-between bg-stone-100 p-1.5 rounded-xl border border-stone-200 overflow-x-auto">
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('floorplan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'floorplan'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📐 {tr3('Grundriss (2D-Feld)', 'Floor Plan (2D)', 'Plano')}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('corner2d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'corner2d'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🔬 {tr3('2D-Finite-Differenzen', '2D Finite Diff.', 'Dif. Finitas')}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('stratification')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'stratification'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🌡️ {tr3('3,40 m Raumhöhe & Schichtung', '3.4m Stratification', 'Estratificación 3,4m')}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('comparison')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'comparison'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ⚖️ {tr3('A/B-Sanierung', 'A/B Retrofit', 'Comparación A/B')}
              </button>
            </div>
            <span className="text-[11px] font-mono-code text-stone-500 hidden sm:inline ml-2">
              Berliner Zimmer
            </span>
          </div>

          {/* VIEW 1: Architectural Floorplan with 2D Heat Gradient & Airflow */}
          {viewMode === 'floorplan' && (
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    <Home className="w-4 h-4 text-amber-400" />
                    <span>{tr3('Thermischer Grundriss: Berliner Zimmer (5,0 × 4,4 m)', 'Thermal Floor Plan: Berlin Altbau Room (5.0 × 4.4 m)', 'Plano térmico: Habitación de Berlín')}</span>
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {tr3('Messpunkte anklicken für mikro-klimatische Auswertung', 'Click probe points on the floor plan for microclimate data', 'Haga clic en los puntos de medición')}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono-code">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-stone-300">Außen {outsideTemp} °C</span>
                </div>
              </div>

              {/* SVG Floorplan Drawing */}
              <div className="relative w-full aspect-[16/10] bg-[#1a1816] rounded-xl border border-stone-700/80 overflow-hidden shadow-inner select-none">
                <svg viewBox="0 0 600 380" className="w-full h-full">
                  <defs>
                    {/* Thermal gradient representing heat flow across room */}
                    <radialGradient id="heatSourceRadiator" cx="50%" cy="12%" r="65%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                      <stop offset="35%" stopColor="#d97706" stopOpacity="0.25" />
                      <stop offset="70%" stopColor="#78716c" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#1c1917" stopOpacity="0.0" />
                    </radialGradient>

                    {/* Cold corner gradient behind wardrobe */}
                    <radialGradient id="coldCornerThermalBridge" cx="8%" cy="12%" r="40%">
                      <stop offset="0%" stopColor={cornerFRsi < 0.70 ? '#e11d48' : '#3b82f6'} stopOpacity={cornerFRsi < 0.70 ? 0.65 : 0.35} />
                      <stop offset="40%" stopColor={cornerFRsi < 0.70 ? '#9f1239' : '#1d4ed8'} stopOpacity="0.3" />
                      <stop offset="80%" stopColor="#1c1917" stopOpacity="0" />
                    </radialGradient>

                    {/* Window cold draft gradient */}
                    <linearGradient id="windowColdDraft" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={windowTilted ? 0.6 : 0.15} />
                      <stop offset="50%" stopColor="#0284c7" stopOpacity={windowTilted ? 0.35 : 0.05} />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Parquet pattern */}
                    <pattern id="parquet" width="30" height="30" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="30" y2="30" stroke="#38332c" strokeWidth="0.5" />
                      <line x1="30" y1="0" x2="0" y2="30" stroke="#38332c" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* Room floor background */}
                  <rect x="40" y="40" width="520" height="300" fill="#24211e" />
                  <rect x="40" y="40" width="520" height="300" fill="url(#parquet)" />

                  {/* Thermal overlays */}
                  <rect x="40" y="40" width="520" height="300" fill="url(#heatSourceRadiator)" />
                  <rect x="40" y="40" width="520" height="300" fill="url(#coldCornerThermalBridge)" />
                  {windowTilted && (
                    <polygon points="180,40 380,40 430,240 130,240" fill="url(#windowColdDraft)" />
                  )}

                  {/* Walls: Exterior Top Wall */}
                  <rect x="25" y="20" width="550" height="20" fill="#44403c" stroke="#57534e" strokeWidth="1.5" />
                  <text x="300" y="14" fill="#a8a29e" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    {tr3('Außenwand (38 cm Ziegel)', 'Exterior Wall (38 cm Brick)', 'Muro exterior (38 cm)')} · {outsideTemp} °C
                  </text>

                  {/* Left Exterior/Adjoining Wall */}
                  <rect x="20" y="20" width="20" height="340" fill={hasSecondExteriorWall ? '#44403c' : '#292524'} stroke="#57534e" strokeWidth="1.5" />
                  <text x="14" y="200" fill="#a8a29e" fontSize="9" fontFamily="monospace" textAnchor="middle" transform="rotate(-90, 14, 200)">
                    {hasSecondExteriorWall ? tr3('2. Außenwand', '2nd Ext. Wall', '2º muro ext.') : tr3('Innenwand', 'Int. Wall', 'Muro int.')}
                  </text>

                  {/* Right Adjoining Wall */}
                  <rect x="560" y="20" width="20" height="340" fill="#292524" stroke="#44403c" strokeWidth="1.5" />

                  {/* Bottom Wall with Door */}
                  <rect x="20" y="340" width="560" height="20" fill="#292524" stroke="#44403c" strokeWidth="1.5" />
                  {/* Door opening */}
                  <rect x="420" y="340" width="60" height="20" fill="#1a1816" />
                  <path d="M 420 340 A 60 60 0 0 1 480 340" fill="none" stroke="#78716c" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="420" y1="340" x2="420" y2="280" stroke="#d6d3d1" strokeWidth="2" />
                  <text x="450" y="355" fill="#a8a29e" fontSize="9" textAnchor="middle">
                    {tr3('Flur / Diele', 'Hallway', 'Pasillo')}
                  </text>

                  {/* High Altbau Window (Top Wall, Centered) */}
                  <rect x="200" y="16" width="160" height="28" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                  <rect x="204" y="22" width="74" height="16" fill="#e0f2fe" opacity="0.3" />
                  <rect x="282" y="22" width="74" height="16" fill="#e0f2fe" opacity="0.3" />
                  <text x="280" y="34" fill="#f0f9ff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {tr3('Kastenfenster', 'Double Window', 'Ventana')} ({effWindowWidth.toFixed(1)}m × 1,9m)
                  </text>

                  {/* Radiator directly underneath window */}
                  <rect x="210" y="45" width="140" height="16" rx="3" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="280" y="57" fill="#fef3c7" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {tr3('Heizkörper (50°C)', 'Radiator (50°C)', 'Radiador (50°C)')}
                  </text>

                  {/* Airflow Streamlines */}
                  {/* Radiator rising plume */}
                  <path d="M 230 45 Q 230 80 250 110" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <path d="M 330 45 Q 330 80 310 110" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                  {/* Wardrobe at Corner (Interactive Placement) */}
                  {wardrobePosition !== 'none' && (
                    <g
                      transform={`translate(${wardrobePosition === 'tight' ? 44 : 58}, ${wardrobePosition === 'tight' ? 44 : 58})`}
                      className="transition-all duration-300"
                    >
                      <rect
                        x="0"
                        y="0"
                        width="80"
                        height="50"
                        rx="4"
                        fill="#573a27"
                        stroke="#8b5e34"
                        strokeWidth="1.5"
                      />
                      <line x1="40" y1="0" x2="40" y2="50" stroke="#3d281a" strokeWidth="1" />
                      <circle cx="34" cy="25" r="2" fill="#d4af37" />
                      <circle cx="46" cy="25" r="2" fill="#d4af37" />
                      <text x="40" y="28" fill="#f5ede3" fontSize="8" fontWeight="bold" textAnchor="middle">
                        {tr3('Schrank', 'Wardrobe', 'Armario')}
                      </text>
                      {wardrobePosition === 'tight' && (
                        <text x="40" y="42" fill="#fca5a5" fontSize="7" textAnchor="middle">
                          0 cm Wandabstand
                        </text>
                      )}
                      {wardrobePosition === 'ventilated' && (
                        <text x="40" y="42" fill="#86efac" fontSize="7" textAnchor="middle">
                          10 cm hinterlüftet
                        </text>
                      )}
                    </g>
                  )}

                  {/* Cold corner mold mycelium alert icon */}
                  {cornerFRsi < 0.70 && (
                    <g transform="translate(48, 48)">
                      <circle cx="0" cy="0" r="14" fill="#e11d48" opacity="0.85" />
                      <text x="0" y="4" fill="#ffffff" fontSize="12" textAnchor="middle">⚠️</text>
                    </g>
                  )}

                  {/* PROBE PINS ON BLUEPRINT */}
                  {/* Probe 1: Cold Corner */}
                  <g
                    onClick={() => setActiveProbe('corner')}
                    className="cursor-pointer group"
                    transform="translate(42, 42)"
                  >
                    <circle cx="0" cy="0" r={activeProbe === 'corner' ? 12 : 9} fill={cornerFRsi < 0.70 ? '#e11d48' : '#10b981'} stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">1</text>
                  </g>

                  {/* Probe 2: Mid Wall */}
                  <g
                    onClick={() => setActiveProbe('wall')}
                    className="cursor-pointer group"
                    transform="translate(140, 40)"
                  >
                    <circle cx="0" cy="0" r={activeProbe === 'wall' ? 12 : 9} fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">2</text>
                  </g>

                  {/* Probe 3: Window Pane */}
                  <g
                    onClick={() => setActiveProbe('window')}
                    className="cursor-pointer group"
                    transform="translate(280, 26)"
                  >
                    <circle cx="0" cy="0" r={activeProbe === 'window' ? 12 : 9} fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">3</text>
                  </g>

                  {/* Probe 4: Radiator Plume */}
                  <g
                    onClick={() => setActiveProbe('radiator')}
                    className="cursor-pointer group"
                    transform="translate(280, 52)"
                  >
                    <circle cx="0" cy="0" r={activeProbe === 'radiator' ? 12 : 9} fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">4</text>
                  </g>

                  {/* Probe 5: Room Center */}
                  <g
                    onClick={() => setActiveProbe('center')}
                    className="cursor-pointer group"
                    transform="translate(300, 190)"
                  >
                    <circle cx="0" cy="0" r={activeProbe === 'center' ? 12 : 9} fill="#a8a29e" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">5</text>
                  </g>

                  {/* Probe 6: Floor Ankle Level */}
                  <g
                    onClick={() => setActiveProbe('floor')}
                    className="cursor-pointer group"
                    transform="translate(280, 140)"
                  >
                    <circle cx="0" cy="0" r={activeProbe === 'floor' ? 12 : 9} fill={windowTilted ? '#38bdf8' : '#78716c'} stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">6</text>
                  </g>

                  {/* Legend / Dimensions */}
                  <text x="50" y="330" fill="#a8a29e" fontSize="9" fontFamily="monospace">
                    {roomWidth.toFixed(1)} m × {roomDepth.toFixed(1)} m = {roomArea} m²
                  </text>
                </svg>
              </div>

              {/* Active Probe Inspector Card */}
              <div className="p-3.5 rounded-xl bg-stone-800/90 border border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono-code text-amber-400">
                      [Messpunkt {activeProbe.toUpperCase()}]
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {probeInfo.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 max-w-xl leading-relaxed">
                    {probeInfo.desc}
                  </p>
                </div>
                <div className="text-right shrink-0 bg-stone-900/90 px-3 py-2 rounded-lg border border-stone-700">
                  <div className="text-[10px] text-stone-400 font-mono-code">Temperatur & Feuchte</div>
                  <div className={`text-xl font-bold font-mono-code ${
                    probeInfo.temp < altbau.moldThreshold ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {nf(probeInfo.temp, 1)} °C
                  </div>
                  <div className="text-[10px] font-mono-code text-stone-300">
                    φ = {probeInfo.rh} % · f_Rsi: {nf(probeInfo.fRsi, 2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: 2D Finite Difference Numerical Mesh (DIN EN ISO 10211) */}
          {viewMode === 'corner2d' && (
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>{tr3('2D-Finite-Differenzen Wärmebrücke (DIN EN ISO 10211)', '2D Finite Difference Thermal Bridge (DIN EN ISO 10211)', 'Diferencias finitas 2D')}</span>
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {tr3('Lösung von ∇²T = 0 im L-Wand-Querschnitt (24×24 Diskretisierungsnetz)', 'Numerical solution of ∇²T = 0 across 24×24 node mesh', 'Solución numérica de ∇²T = 0')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMeshNodes(!showMeshNodes)}
                    className={`px-2.5 py-1 rounded text-xs font-mono-code transition-all cursor-pointer ${
                      showMeshNodes ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-800 text-stone-400 border border-stone-700'
                    }`}
                  >
                    {showMeshNodes ? tr3('Netzknoten: AN', 'Mesh: ON', 'Nodos: ON') : tr3('Netzknoten: AUS', 'Mesh: OFF', 'Nodos: OFF')}
                  </button>
                  <span className="text-xs font-mono-code bg-stone-800 text-amber-300 px-2 py-1 rounded border border-stone-700">
                    Ψ = {nf(altbau.finiteDifference2D.psiValue, 3)} W/(m·K)
                  </span>
                </div>
              </div>

              {/* 2D Numerical Simulation Canvas / Visualizer */}
              <div className="relative w-full aspect-[16/10] bg-[#141210] rounded-xl border border-stone-700/80 p-3 overflow-hidden">
                <svg viewBox="0 0 500 320" className="w-full h-full">
                  {/* Outer Air Environment */}
                  <rect x="0" y="0" width="500" height="320" fill="#0f172a" />
                  <text x="20" y="30" fill="#38bdf8" fontSize="12" fontFamily="monospace">
                    Außenluft: {outsideTemp} °C (h_e = 25 W/m²K)
                  </text>

                  {/* 38 cm Wall L-Corner Body */}
                  <path
                    d="M 140 0 L 140 170 L 500 170 L 500 320 L 0 320 L 0 0 Z"
                    fill="#3f3f46"
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />

                  {/* Render Discretized Finite Difference Heat Nodes if enabled */}
                  {showMeshNodes &&
                    altbau.finiteDifference2D.grid.map((row, y) =>
                      row.map((t, x) => {
                        if (x > 8 && y > 8) return null; // in room air
                        const cx = (x / 23) * 500;
                        const cy = 320 - (y / 23) * 320;
                        // Color scale from outsideTemp (blue) to roomTemp (red)
                        const norm = Math.max(0, Math.min(1, (t - outsideTemp) / (roomTemp - outsideTemp)));
                        const r = Math.round(norm * 255);
                        const b = Math.round((1 - norm) * 255);
                        const color = `rgb(${r}, 120, ${b})`;
                        return (
                          <circle
                            key={`${x}-${y}`}
                            cx={cx}
                            cy={cy}
                            r={3}
                            fill={color}
                            opacity={0.8}
                          />
                        );
                      })
                    )}

                  {/* Isotherm lines calculated directly from numerical field */}
                  {altbau.finiteDifference2D.isotherms.map((iso, idx) => {
                    const strokeColor =
                      iso.temp <= 0
                        ? '#60a5fa'
                        : iso.temp <= 5
                        ? '#34d399'
                        : iso.temp <= 10
                        ? '#f59e0b'
                        : iso.temp <= 13
                        ? '#f43f5e'
                        : '#fb7185';
                    // Generate smooth bezier curve through points
                    if (iso.points.length < 2) return null;
                    const pathD = iso.points.reduce((acc, p, i) => {
                      const px = p[0] * 500;
                      const py = 320 - p[1] * 320;
                      return i === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`;
                    }, '');
                    return (
                      <g key={idx}>
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={iso.temp === 12.6 ? 3 : 2}
                          strokeDasharray={iso.temp === 12.6 ? '4 2' : undefined}
                        />
                      </g>
                    );
                  })}

                  {/* Isotherm Labels */}
                  <text x="120" y="70" fill="#93c5fd" fontSize="10" fontFamily="monospace">0 °C</text>
                  <text x="100" y="110" fill="#6ee7b7" fontSize="10" fontFamily="monospace">+5 °C</text>
                  <text x="80" y="150" fill="#fcd34d" fontSize="10" fontFamily="monospace">+10 °C</text>
                  <text x="50" y="190" fill="#fda4af" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    +12,6 °C (Schimmel-Grenze)
                  </text>

                  {/* Inner Room Area */}
                  <rect x="0" y="0" width="140" height="170" fill="#262320" />
                  <text x="35" y="55" fill="#fcd34d" fontSize="12" fontWeight="bold">
                    Raum: {roomTemp} °C
                  </text>
                  <text x="35" y="75" fill="#a8a29e" fontSize="10">
                    φ = {relHumidity} %
                  </text>

                  {/* Wardrobe if tight */}
                  {wardrobePosition === 'tight' && (
                    <g transform="translate(10, 10)">
                      <rect x="0" y="0" width="125" height="155" fill="#573a27" stroke="#d4af37" strokeWidth="1.5" opacity="0.9" />
                      <text x="62" y="80" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Schrank (0 cm)
                      </text>
                      <text x="62" y="100" fill="#fca5a5" fontSize="9" textAnchor="middle">
                        Luftstau Rsi=0.45
                      </text>
                    </g>
                  )}

                  {/* Calculated Cold Corner Vertex Point */}
                  <circle cx="140" cy="170" r={8} fill={cornerFRsi < 0.70 ? '#e11d48' : '#10b981'} stroke="#ffffff" strokeWidth="2" />
                  <text x="155" y="165" fill="#ffffff" fontSize="12" fontWeight="bold">
                    θ_si = {nf(altbau.finiteDifference2D.minCornerTemp, 1)} °C
                  </text>
                  <text x="155" y="185" fill={cornerFRsi < 0.70 ? '#fca5a5' : '#86efac'} fontSize="10">
                    f_Rsi = {nf(altbau.finiteDifference2D.fRsi2D, 2)} ({cornerFRsi >= 0.70 ? 'DIN-konform' : 'Schimmelgefahr'})
                  </text>
                </svg>
              </div>

              {/* Numerical Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-800/80 p-3.5 rounded-xl border border-stone-700">
                <div>
                  <div className="text-[10px] text-stone-400 font-mono-code">Linearer Leitwert Ψ</div>
                  <div className="font-bold text-amber-300 font-mono-code text-sm">
                    {nf(altbau.finiteDifference2D.psiValue, 3)} W/(m·K)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-mono-code">1D-Wand Asymptote</div>
                  <div className="font-bold text-stone-200 font-mono-code text-sm">
                    {nf(altbau.finiteDifference2D.asymptotic1DTemp, 1)} °C
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-mono-code">Oberflächenfeuchte</div>
                  <div className={`font-bold font-mono-code text-sm ${altbau.surfaceRhCorner >= 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {nf(altbau.surfaceRhCorner, 1)} %
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-mono-code">Sedlbauer Myzelbildung</div>
                  <div className="font-bold text-stone-200 font-mono-code text-sm">
                    {altbau.moldGerminationDays < 900 ? `${altbau.moldGerminationDays} Tage` : '> 60 Tage'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: 3.40m Room Height & Thermal Stratification */}
          {viewMode === 'stratification' && (
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>{tr3('Vertikalschnitt: 3,40 m Berliner Zimmer & Temperaturschichtung', 'Vertical Section: 3.40m Berlin Ceiling & Air Stratification', 'Corte vertical: 3,40 m')}</span>
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {tr3('Thermischer Auftrieb, Kaltluftsee am Boden und Zugluftrisiko nach DIN EN ISO 7730', 'Thermal buoyancy, floor cold lake, and ISO 7730 draft rating', 'Estratificación térmica y riesgo de corrientes')}
                  </p>
                </div>
                <span className={`text-xs font-mono-code px-2.5 py-1 rounded border ${
                  altbau.stratification.draftRiskPercent > 20
                    ? 'bg-rose-900/80 text-rose-300 border-rose-700'
                    : 'bg-emerald-900/80 text-emerald-300 border-emerald-700'
                }`}>
                  Zugluftrisiko: {altbau.stratification.draftRiskPercent} % PPD
                </span>
              </div>

              {/* Architectural Vertical Section SVG */}
              <div className="relative w-full aspect-[16/10] bg-[#1a1816] rounded-xl border border-stone-700/80 p-3 overflow-hidden">
                <svg viewBox="0 0 600 360" className="w-full h-full">
                  <defs>
                    <linearGradient id="verticalStratGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                      <stop offset="45%" stopColor="#78716c" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={windowTilted ? 0.7 : 0.25} />
                    </linearGradient>
                  </defs>

                  {/* Air Column Gradient */}
                  <rect x="160" y="30" width="380" height="290" fill="url(#verticalStratGrad)" />

                  {/* Ceiling (Stucco moulding at 3.40 m) */}
                  <rect x="20" y="10" width="560" height="20" fill="#292524" stroke="#44403c" strokeWidth="2" />
                  {/* Decorative stucco line */}
                  <path d="M 160 30 Q 170 36 180 30 Q 190 36 200 30" fill="none" stroke="#d6d3d1" strokeWidth="1" />
                  <text x="350" y="24" fill="#d6d3d1" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Altbau-Stuckdecke (h = 3,40 m) · θ_decke = {nf(altbau.stratification.ceilingTemp, 1)} °C
                  </text>

                  {/* Floor (Parquet at 0.0 m) */}
                  <rect x="20" y="320" width="560" height="25" fill="#3d281a" stroke="#573a27" strokeWidth="2" />
                  <text x="350" y="337" fill="#f5ede3" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Dielenboden (z = 0,0 m) · θ_boden = {nf(altbau.stratification.floorTemp, 1)} °C
                  </text>

                  {/* Left Exterior Wall */}
                  <rect x="20" y="30" width="140" height="290" fill="#44403c" stroke="#57534e" strokeWidth="2" />
                  <text x="90" y="55" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Außenwand (38 cm)
                  </text>
                  <text x="90" y="70" fill="#a8a29e" fontSize="9" textAnchor="middle">
                    U = {wallU.toFixed(2)} W/m²K
                  </text>

                  {/* Box Sash Window (1.90 m high, bottom at 0.90 m sill) */}
                  {/* Window sill at y = 230, top at y = 90 */}
                  <rect x="30" y="90" width="120" height="130" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
                  <text x="90" y="155" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Fenster (1,9 m)
                  </text>
                  {windowTilted && (
                    <text x="90" y="170" fill="#fef08a" fontSize="8" textAnchor="middle">
                      GEKIPPT (3.0/h)
                    </text>
                  )}

                  {/* Radiator under window sill */}
                  <rect x="35" y="235" width="110" height="75" rx="3" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
                  <text x="90" y="275" fill="#fef3c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Heizkörper
                  </text>

                  {/* Convective Flow Arrows */}
                  {/* Warm air rising from radiator */}
                  <path d="M 155 240 Q 200 120 280 45" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 2" />
                  <polygon points="280,45 270,50 274,40" fill="#f59e0b" />

                  {/* Cold drop from window if tilted */}
                  {windowTilted ? (
                    <g>
                      <path d="M 155 95 Q 230 180 260 305" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 3" />
                      <polygon points="260,305 255,295 265,295" fill="#38bdf8" />
                      {/* Cold pool puddle along floor */}
                      <ellipse cx="350" cy="315" rx="150" ry="8" fill="#38bdf8" opacity="0.4" />
                      <text x="350" y="310" fill="#e0f2fe" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Kaltluftsee am Boden (Zugluft!)
                      </text>
                    </g>
                  ) : (
                    <path d="M 150 160 Q 170 230 190 300" fill="none" stroke="#78716c" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  )}

                  {/* Standing Human Figure Silhouette at x = 440 */}
                  <g transform="translate(440, 160)">
                    {/* Head at z = 1.7 m */}
                    <circle cx="0" cy="0" r="12" fill="#d6d3d1" />
                    <text x="25" y="4" fill="#ffffff" fontSize="10" fontFamily="monospace">
                      Kopf (1,7m): {nf(altbau.stratification.headTemp, 1)} °C
                    </text>

                    {/* Torso / Seated height (1.1 m) */}
                    <line x1="0" y1="12" x2="0" y2="70" stroke="#d6d3d1" strokeWidth="8" strokeLinecap="round" />
                    <text x="25" y="55" fill="#a8a29e" fontSize="9" fontFamily="monospace">
                      Sitzen (1,1m): {nf(altbau.stratification.sittingTemp, 1)} °C
                    </text>

                    {/* Legs down to floor */}
                    <line x1="-8" y1="70" x2="-8" y2="155" stroke="#d6d3d1" strokeWidth="4" />
                    <line x1="8" y1="70" x2="8" y2="155" stroke="#d6d3d1" strokeWidth="4" />
                    <text x="25" y="150" fill={windowTilted ? '#38bdf8' : '#d6d3d1'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                      Knöchel (0,1m): {nf(altbau.stratification.floorTemp, 1)} °C
                    </text>
                  </g>

                  {/* Delta T Gradient Badge */}
                  <g transform="translate(240, 140)">
                    <rect x="0" y="0" width="130" height="40" rx="8" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" />
                    <text x="65" y="17" fill="#a8a29e" fontSize="8" textAnchor="middle">
                      KOPF-ZU-FUSS GRADIENT
                    </text>
                    <text x="65" y="32" fill="#fcd34d" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      ΔT = {nf(altbau.stratification.headTemp - altbau.stratification.floorTemp, 1)} K
                    </text>
                  </g>
                </svg>
              </div>

              {/* Stratification Explanation */}
              <div className="text-xs text-stone-300 space-y-1.5 bg-stone-800/80 p-3.5 rounded-xl border border-stone-700">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" />
                  <span>{tr3('Warum Berliner Altbauten bei Kippfenstern auskühlen:', 'Why Berlin Altbau feels drafty with tilted windows:', 'Por qué se enfría con ventanas abatibles:')}</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  {tr3(
                    `In Räumen mit 3,40 m Deckenhöhe erzeugt der Dichteunterschied zwischen warmer Deckenluft (ρ ≈ 1,18 kg/m³) und winterlicher Außenluft (ρ ≈ 1,29 kg/m³) einen Kaltluftfallstrom. Die kalte Luft stürzt ungebremst auf den Dielenboden, während teure Heizwärme ungenutzt unter der Stuckdecke verbleibt. Bei Dauerkipplüftung liegt das Zugluft-Unbehaglichkeitsrisiko nach ISO 7730 bei ${altbau.stratification.draftRiskPercent} %.`,
                    `In 3.40m Altbau rooms, density differences cause cold incoming air to cascade directly to the floor. Warm air stays trapped uselessly under the stucco ceiling while feet freeze in the floor cold pool. Continuous tilt ventilation produces an ISO 7730 draft dissatisfaction rating of ${altbau.stratification.draftRiskPercent}%.`,
                    `En techos de 3,40 m, el aire frío cae directamente al suelo formando un lago frío.`
                  )}
                </p>
              </div>
            </div>
          )}

          {/* VIEW 4: A/B Variant Retrofit Comparison */}
          {viewMode === 'comparison' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <span>{tr3('Sanierungs- & Verhaltensvergleich (A/B)', 'Retrofit & Behavior Comparison (A/B)', 'Comparación de rehabilitación (A/B)')}</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {tr3('Ist-Zustand gegen geplante energetische Sanierung', 'Current state vs planned thermal retrofit', 'Estado actual vs rehabilitación')}
                  </p>
                </div>
                <span className="text-xs font-mono-code bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  Energieberatung
                </span>
              </div>

              {/* Side by side cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Variant A: Current */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 uppercase font-mono-code">
                      Variante A: {tr3('Ist-Zustand', 'Current', 'Actual')}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono-code">
                      U_W={wallU.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-stone-600">Heizleistung:</div>
                    <div className="text-lg font-bold font-mono-code text-stone-900">
                      ≈ {nf(round10(altbau.heatLow), 0)}–{nf(round10(altbau.heatHigh), 0)} W
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-stone-600">Jahresverbrauch Raum:</div>
                    <div className="text-base font-bold font-mono-code text-amber-900">
                      ≈ {nf(Math.round(altbau.annualKwhMid), 0)} kWh/a ({nf(Math.round(altbau.annualCostMid), 0)} €/a)
                    </div>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-stone-200">
                    <div className="text-xs text-stone-600">Ecktemperatur:</div>
                    <div className={`text-sm font-bold font-mono-code ${cornerFRsi < 0.70 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {nf(cornerSurfaceTemp, 1)} °C (f_Rsi={nf(cornerFRsi, 2)})
                    </div>
                    <span className="text-[10px] text-stone-500">
                      {cornerFRsi < 0.70 ? '⚠️ Schimmelgefährdet' : '✅ Schimmelfrei'}
                    </span>
                  </div>
                </div>

                {/* Variant B: Retrofitted */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 uppercase font-mono-code">
                      Variante B: {tr3('Saniert (KfW)', 'Retrofitted', 'Rehabilitado')}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-mono-code">
                      U_W=0.24 · 3-fach
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-emerald-900">Heizleistung:</div>
                    <div className="text-lg font-bold font-mono-code text-emerald-900">
                      ≈ {nf(round10(altbauVariantB.heatLow), 0)}–{nf(round10(altbauVariantB.heatHigh), 0)} W
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-emerald-900">Jahresverbrauch Raum:</div>
                    <div className="text-base font-bold font-mono-code text-emerald-800">
                      ≈ {nf(Math.round(altbauVariantB.annualKwhMid), 0)} kWh/a ({nf(Math.round(altbauVariantB.annualCostMid), 0)} €/a)
                    </div>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-emerald-200">
                    <div className="text-xs text-emerald-900">Ecktemperatur:</div>
                    <div className="text-sm font-bold font-mono-code text-emerald-800">
                      {nf(altbauVariantB.corner2DGeometricMid, 1)} °C (f_Rsi={nf(altbauVariantB.fRsiMid, 2)})
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      ✅ Schimmelrisiko dauerhaft behoben
                    </span>
                  </div>
                </div>
              </div>

              {/* Delta Box */}
              <div className="p-3.5 rounded-xl bg-stone-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-400 font-mono-code uppercase">
                    {tr3('Mögliche Einsparung pro Raum:', 'Potential savings per room:', 'Ahorro potencial:')}
                  </div>
                  <div className="text-lg font-bold font-mono-code text-emerald-400">
                    - {nf(Math.round(altbau.annualKwhMid - altbauVariantB.annualKwhMid), 0)} kWh/a
                    <span className="text-sm text-stone-300 font-normal"> (ca. -{nf(Math.round(altbau.annualCostMid - altbauVariantB.annualCostMid), 0)} €/Jahr)</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-stone-400">
                  <span className="font-bold text-amber-300">
                    {nf(((altbau.annualKwhMid - altbauVariantB.annualKwhMid) / altbau.annualKwhMid) * 100, 0)} %
                  </span>{' '}
                  Heizenergie-Reduktion
                </div>
              </div>
            </div>
          )}

          {/* Results Summary Box (Heat Balance Band) */}
          <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-md border border-stone-800 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono-code uppercase tracking-wider text-stone-400">
                {tr3('Wärmebilanz als Band (stationär, Raumebene)', 'Heat balance as band (steady state)', 'Balance térmico como rango')}
              </span>
              <span className="text-xs font-mono-code bg-stone-800 px-2 py-0.5 rounded text-amber-300 border border-stone-700">
                {tr3('Offene Annahmen', 'Open assumptions', 'Supuestos abiertos')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Heating power band */}
              <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60">
                <span className="text-xs text-stone-400 block mb-1">
                  {tr3('Heizleistungsbedarf', 'Required heating power', 'Potencia de calefacción')}
                </span>
                <div className="text-2xl font-bold font-mono-code text-amber-400">
                  ≈ {nf(round10(altbau.heatLow), 0)}–{nf(round10(altbau.heatHigh), 0)} <span className="text-sm text-stone-300 font-sans">W</span>
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  ≈ {nf(altbau.heatLow / roomArea, 0)}–{nf(altbau.heatHigh / roomArea, 0)} W/m²
                </span>
                {/* Breakdown bar */}
                <div className="flex h-2.5 mt-3 rounded overflow-hidden" aria-hidden="true">
                  <div className="bg-stone-400" style={{ width: `${(100 * altbau.hWall) / partTotal}%` }} />
                  <div className="bg-sky-400" style={{ width: `${(100 * altbau.hWindow) / partTotal}%` }} />
                  <div className="bg-amber-400" style={{ width: `${(100 * altbau.hVent) / partTotal}%` }} />
                </div>
                <div className="text-[10px] text-stone-400 mt-1 flex justify-between">
                  <span>Wand: {nf((100 * altbau.hWall) / partTotal, 0)}%</span>
                  <span>Fenster: {nf((100 * altbau.hWindow) / partTotal, 0)}%</span>
                  <span>Lüftung: {nf((100 * altbau.hVent) / partTotal, 0)}%</span>
                </div>
              </div>

              {/* Corner surface temperature band */}
              <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60">
                <span className="text-xs text-stone-400 block mb-1">
                  {tr3('Oberflächentemperatur kalte Ecke', 'Surface temp cold corner', 'Temp. superficial esquina fría')}
                </span>
                <div className={`text-2xl font-bold font-mono-code ${cornerFRsi < 0.70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ≈ {nf(cornerSurfaceTemp, 1)} <span className="text-sm text-stone-300 font-sans">°C</span>
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Taupunkt: {nf(altbau.dewPoint, 1)} °C · Schimmel (80%): {nf(altbau.moldThreshold, 1)} °C
                </span>
                {/* Visual line */}
                <div className="relative h-3 mt-3 rounded bg-stone-700" aria-hidden="true">
                  <div
                    className="absolute top-0 bottom-0 rounded bg-amber-500"
                    style={{
                      left: tempPos(altbau.cornerLow),
                      width: `${Math.max(5, (100 * (altbau.cornerHigh - altbau.cornerLow)) / (tempAxisMax - tempAxisMin))}%`,
                    }}
                  />
                  <div className="absolute top-0 bottom-0 w-0.5 bg-rose-400" style={{ left: tempPos(altbau.moldThreshold) }} />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 font-mono-code mt-1">
                  <span>{tempAxisMin} °C</span>
                  <span className="text-rose-400 font-bold">| Schimmelgrenze</span>
                  <span>{tempAxisMax} °C</span>
                </div>
              </div>
            </div>

            {/* Link into Tin Brief */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              {onOpenDose ? (
                <button
                  type="button"
                  onClick={() => onOpenDose('altbau-thermal')}
                  className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span>{tr3('Dose: Altbau Thermal öffnen', 'Open Tin: Altbau Thermal', 'Abrir lata: Altbau Thermal')}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              ) : (
                <span>{tr3('Dose: Altbau Thermal', 'Tin: Altbau Thermal', 'Lata: Altbau Thermal')}</span>
              )}
              <span className="text-amber-400 font-mono-code">Status: gepackt → UdK Berlin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

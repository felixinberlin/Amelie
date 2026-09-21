import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Clock,
  ShieldCheck,
  Moon,
  Sun,
  Bed,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  Info,
  AlertTriangle,
  HeartPulse,
  Compass,
  ArrowRight,
  Layers,
  MapPin,
  Activity,
  Sliders,
} from 'lucide-react';
import { Language } from '../../types';
import { KiezNoiseMap, BERLIN_NOISE_AREAS, getNoiseColor } from './KiezNoiseMap';

interface KiezLaermSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

export interface StreetProfile {
  id: string;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  kiez: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionEs: string;
  surface: string;
  trafficType: string;
  // 24 hourly average sound levels in dB(A)
  hourlyDb: number[];
  spreadDb: number;
}

const BERLIN_STREET_PROFILES: StreetProfile[] = BERLIN_NOISE_AREAS.map((area) => ({
  id: area.id,
  nameDe: area.nameDe,
  nameEn: area.nameEn,
  nameEs: area.nameEs,
  kiez: area.kiez,
  descriptionDe: `${area.surface}. ${area.trafficType}.`,
  descriptionEn: `${area.surface}. ${area.trafficType}.`,
  descriptionEs: `${area.surface}. ${area.trafficType}.`,
  surface: area.surface,
  trafficType: area.trafficType,
  hourlyDb: area.hourlyDb,
  spreadDb: area.spreadDb,
}));

export const KiezLaermSimulator: React.FC<KiezLaermSimulatorProps> = ({ lang, onOpenDose }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('kollwitz-cobblestone');
  const [currentHour, setCurrentHour] = useState<number>(14); // 14:00 default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tranquilityThreshold, setTranquilityThreshold] = useState<number>(45); // dB(A)
  const [windowState, setWindowState] = useState<'open' | 'tilted' | 'closed'>('tilted');
  const [copiedGeoJson, setCopiedGeoJson] = useState<boolean>(false);

  // Virtual Acoustic Probe (Simulated Live Edge Sensor - 100% Zero Mic Access)
  const [probeOffset, setProbeOffset] = useState<number>(0);

  const profile = useMemo(
    () => BERLIN_STREET_PROFILES.find((p) => p.id === selectedProfileId) || BERLIN_STREET_PROFILES[0],
    [selectedProfileId]
  );

  // Timeline loop animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentHour((prev) => (prev + 1) % 24);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Gentle micro-fluctuation for virtual edge sensor probe
  useEffect(() => {
    const timer = setInterval(() => {
      // Brownian slight oscillation around 0 (+- 1.4 dB)
      setProbeOffset(Math.round((Math.sin(Date.now() / 600) * 0.9 + (Math.random() - 0.5) * 1.2) * 10) / 10);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Window acoustic attenuation
  const windowAttenuation = useMemo(() => {
    switch (windowState) {
      case 'open':
        return 0;
      case 'tilted':
        return 15; // standard German tilted window: ~15 dB(A) reduction
      case 'closed':
        return 30; // standard modern double-glazed: ~30-34 dB(A) reduction
    }
  }, [windowState]);

  const outdoorDb = profile.hourlyDb[currentHour];
  const simulatedSensorDb = Math.max(25, Math.round((outdoorDb + probeOffset) * 10) / 10);
  const indoorDb = Math.max(20, outdoorDb - windowAttenuation);

  // Calculate L_night (average from 22:00 to 06:00 per EU Directive)
  const nightHours = [22, 23, 0, 1, 2, 3, 4, 5];
  const lNightOutdoor = useMemo(() => {
    const energySum = nightHours.reduce((acc, h) => acc + Math.pow(10, profile.hourlyDb[h] / 10), 0);
    return Math.round((10 * Math.log10(energySum / nightHours.length)) * 10) / 10;
  }, [profile]);

  // Calculate L_den (Day-Evening-Night EU formula)
  const lDen = useMemo(() => {
    const dayHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const eveHours = [18, 19, 20, 21];
    const nHours = [22, 23, 0, 1, 2, 3, 4, 5];

    const sumDay = dayHours.reduce((acc, h) => acc + 12 * Math.pow(10, profile.hourlyDb[h] / 10), 0);
    const sumEve = eveHours.reduce((acc, h) => acc + 4 * Math.pow(10, (profile.hourlyDb[h] + 5) / 10), 0);
    const sumNight = nHours.reduce((acc, h) => acc + 8 * Math.pow(10, (profile.hourlyDb[h] + 10) / 10), 0);

    const total = (sumDay + sumEve + sumNight) / 24;
    return Math.round((10 * Math.log10(total)) * 10) / 10;
  }, [profile]);

  // Tranquility Windows (consecutive hours with outdoorDb <= tranquilityThreshold)
  const quietWindows = useMemo(() => {
    const windows: { start: number; end: number; duration: number }[] = [];
    let start: number | null = null;

    for (let h = 0; h < 24; h++) {
      if (profile.hourlyDb[h] <= tranquilityThreshold) {
        if (start === null) start = h;
      } else {
        if (start !== null) {
          windows.push({ start, end: h - 1, duration: h - start });
          start = null;
        }
      }
    }
    if (start !== null) {
      windows.push({ start, end: 23, duration: 24 - start });
    }
    return windows;
  }, [profile, tranquilityThreshold]);

  // WHO Sleep Evaluation based on indoorDb during night
  const whoIndoorSleepEvaluation = useMemo(() => {
    // WHO Europe recommends indoor night noise < 30 dB(A) to prevent sleep stage alterations
    if (indoorDb <= 30) {
      return {
        level: 'good',
        labelDe: 'Ideal für ungestörten Tiefschlaf (WHO < 30 dB)',
        labelEn: 'Optimal for undisturbed deep sleep (WHO < 30 dB)',
        labelEs: 'Óptimo para sueño profundo reparador (OMS < 30 dB)',
        color: 'text-emerald-800 bg-emerald-100/80 border-emerald-300',
      };
    } else if (indoorDb <= 40) {
      return {
        level: 'moderate',
        labelDe: 'Akzeptabel (Leichte vegetative Reaktionen möglich)',
        labelEn: 'Acceptable (Minor autonomic reactions possible)',
        labelEs: 'Aceptable (Posibles reacciones vegetativas leves)',
        color: 'text-amber-800 bg-amber-100/80 border-amber-300',
      };
    } else {
      return {
        level: 'critical',
        labelDe: 'Gesundheitsrisiko (Schlafunterbrechungen & Cortisolanstieg)',
        labelEn: 'Health risk (Awakenings & elevated cortisol risk)',
        labelEs: 'Riesgo biológico (Interrupciones del sueño y estrés)',
        color: 'text-rose-800 bg-rose-100/80 border-rose-300',
      };
    }
  }, [indoorDb]);

  // Generate GeoJSON export matching NoiseCapture standard
  const geoJsonData = useMemo(() => {
    const area = BERLIN_NOISE_AREAS.find((a) => a.id === profile.id);
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [area?.coordinates.map(([lat, lng]) => [lng, lat]) || []],
      },
      properties: {
        id: profile.id,
        street_name: profile.nameDe,
        kiez: profile.kiez,
        surface: profile.surface,
        traffic_class: profile.trafficType,
        L_den_dBA: lDen,
        L_night_dBA: lNightOutdoor,
        who_night_compliant: lNightOutdoor <= 40,
        quiet_windows: quietWindows.map((w) => `${w.start}:00-${w.end}:00 (${w.duration}h)`),
        hourly_profile_dBA: profile.hourlyDb,
        data_standard: 'NoiseCapture / SenUMVK Berlin Open Data Alignment',
        privacy_architecture: '100% Zero-Audio RAM Edge Processing (No microphone storage)',
      },
    };
  }, [profile, lDen, lNightOutdoor, quietWindows]);

  const handleCopyGeoJson = () => {
    navigator.clipboard.writeText(JSON.stringify(geoJsonData, null, 2));
    setCopiedGeoJson(true);
    setTimeout(() => setCopiedGeoJson(false), 2000);
  };

  const handleDownloadGeoJson = () => {
    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kiez-laerm-${profile.id}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-2xl bg-[#faf6ee] border border-[#d6c7b2] p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8c1d40]/10 text-[#8c1d40] text-xs font-mono-code font-semibold border border-[#8c1d40]/20">
              <Compass className="w-3.5 h-3.5" />
              <span>
                {lang === 'de'
                  ? 'Kiez-Lärmkarte · Ruhe-Fenster statt Jahresmittel'
                  : lang === 'es'
                  ? 'Mapa de Ruido · Ventanas de Tranquilidad'
                  : 'Kiez Noise Map · Tranquility Windows over Averages'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-[#2c1d11]">
              {lang === 'de'
                ? 'Wann ist meine Straße leise? (24h Lärmkarte & Schlaftest)'
                : lang === 'es'
                ? '¿Cuándo está tranquila mi calle? (Mapa 24h)'
                : 'When is my street quiet? (24h Noise Map & Sleep Audit)'}
            </h3>
            <p className="text-xs sm:text-sm text-[#63513d] max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Die interaktive Lärmkarte zeigt farbige Schallimmissionszonen nach Berliner Straßen-Typologien. Wählen Sie eine Straße auf der Karte oder nutzen Sie den Zeitschieberegler, um die täglichen Ruhe-Fenster und die WHO-Schlaftauglichkeit bei gekipptem Fenster zu analysieren.'
                : lang === 'es'
                ? 'El mapa interactivo muestra zonas coloreadas de ruido por tipologías viales en Berlín. Seleccione una calle o desplace el horario para descubrir ventanas de tranquilidad y evaluar el descanso nocturno.'
                : 'Interactive noise map displaying colored decibel contours for Berlin street typologies. Click any zone on the map or scrub through the 24h timeline to reveal quiet work windows and WHO sleep compatibility.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenDose && (
              <button
                onClick={() => onOpenDose('kiez-laermkarte')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8c1d40] text-white text-xs font-semibold hover:bg-[#701531] transition-colors shadow-xs"
              >
                <span>{lang === 'de' ? 'Dose Kiez-Lärmkarte öffnen' : lang === 'es' ? 'Abrir lata de ruido' : 'View Kiez Tin'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🗺️ INTERACTIVE COLORED GOOGLE-STYLE NOISE MAP */}
      <KiezNoiseMap
        lang={lang}
        currentHour={currentHour}
        selectedAreaId={selectedProfileId}
        tranquilityThreshold={tranquilityThreshold}
        onSelectArea={(areaId) => {
          setSelectedProfileId(areaId);
        }}
        onHourChange={(newHour) => {
          setCurrentHour(newHour);
        }}
      />

      {/* Main Grid: Left Typologies & Parameters / Right Diurnal Rhythm & Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Typology & Street Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Street Typology Selector */}
          <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block font-mono-code">
                {lang === 'de' ? 'Berliner Lärmzonen (10 Zonen)' : lang === 'es' ? 'Zonas de ruido (10 tipologías)' : 'Berlin Noise Zones (10 Typologies)'}
              </label>
              <span className="text-[10px] font-mono-code text-stone-500">Klick synchronisiert Karte</span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {BERLIN_STREET_PROFILES.map((p) => {
                const isSelected = p.id === selectedProfileId;
                const activeDb = p.hourlyDb[currentHour];
                const colorSpec = getNoiseColor(activeDb);

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfileId(p.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-[#8c1d40] bg-[#8c1d40]/5 font-semibold text-stone-900 shadow-xs ring-1 ring-[#8c1d40]/30'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/60 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: colorSpec.fill }}
                        />
                        <span className="font-bold text-sm">
                          {lang === 'de' ? p.nameDe : lang === 'es' ? p.nameEs : p.nameEn}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono-code">
                        <span className="text-xs font-bold text-stone-900">{activeDb} dB</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-700">
                          {p.kiez.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-stone-500 font-mono-code">
                      <span className="truncate max-w-[200px]">{p.surface.split(' ')[0]} · {p.trafficType.split('·')[0]}</span>
                      <span className={activeDb <= tranquilityThreshold ? 'text-emerald-700 font-bold' : 'text-stone-500'}>
                        {activeDb <= tranquilityThreshold ? '🌿 Ruhe-Fenster' : 'Lauter'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Window Condition & Attenuation */}
          <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block font-mono-code">
                {lang === 'de' ? 'Fensterzustand & Schalldämmung' : lang === 'es' ? 'Estado de la ventana' : 'Window Acoustic State'}
              </label>
              <span className="text-xs font-mono-code text-[#8c1d40] font-bold">
                -{windowAttenuation} dB(A)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setWindowState('open')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all text-xs ${
                  windowState === 'open'
                    ? 'border-[#8c1d40] bg-[#8c1d40]/10 text-[#8c1d40] font-bold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="text-base mb-1">🪟</div>
                <div className="font-semibold">{lang === 'de' ? 'Offen' : lang === 'es' ? 'Abierta' : 'Open'}</div>
                <div className="text-[10px] text-stone-500 font-mono-code">0 dB Dämpfung</div>
              </button>

              <button
                onClick={() => setWindowState('tilted')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all text-xs ${
                  windowState === 'tilted'
                    ? 'border-[#8c1d40] bg-[#8c1d40]/10 text-[#8c1d40] font-bold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="text-base mb-1">📐</div>
                <div className="font-semibold">{lang === 'de' ? 'Gekippt' : lang === 'es' ? 'Oscilobatiente' : 'Tilted'}</div>
                <div className="text-[10px] text-stone-500 font-mono-code">-15 dB(A)</div>
              </button>

              <button
                onClick={() => setWindowState('closed')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all text-xs ${
                  windowState === 'closed'
                    ? 'border-[#8c1d40] bg-[#8c1d40]/10 text-[#8c1d40] font-bold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="text-base mb-1">🔒</div>
                <div className="font-semibold">{lang === 'de' ? 'Geschlossen' : lang === 'es' ? 'Cerrada' : 'Closed'}</div>
                <div className="text-[10px] text-stone-500 font-mono-code">-30 dB(A)</div>
              </button>
            </div>

            {/* Tranquility Threshold Slider */}
            <div className="pt-2 border-t border-stone-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">
                  {lang === 'de' ? 'Ruhe-Schwelle für „Leise-Fenster":' : lang === 'es' ? 'Umbral de tranquilidad:' : 'Tranquility threshold:'}
                </span>
                <span className="font-mono-code font-bold text-stone-800">{tranquilityThreshold} dB(A)</span>
              </div>
              <input
                type="range"
                min="35"
                max="65"
                step="1"
                value={tranquilityThreshold}
                onChange={(e) => setTranquilityThreshold(Number(e.target.value))}
                className="w-full accent-[#8c1d40] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-600 font-mono-code">
                <span>35 dB (Flüstern)</span>
                <span>45 dB (Wohnraum)</span>
                <span>65 dB (Büro)</span>
              </div>
            </div>
          </div>

          {/* Privacy Architecture: Zero-Audio Edge Processing (No Mic Access Needed) */}
          <div className="rounded-xl bg-[#fdfaf5] border border-emerald-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono-code">
                  {lang === 'de' ? 'Datenschutz: Zero-Audio Architektur' : lang === 'es' ? 'Privacidad: Sin captura de audio' : 'Privacy: Zero-Audio Architecture'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono-code font-bold">
                0 Byte Mikrofon-Zugriff
              </div>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed">
              {lang === 'de'
                ? 'Für diese Demo ist kein Mikrofon-Zugriff erforderlich. Das Kiez-Lärmkarte-Konzept garantiert bauartbedingt: Es werden niemals Audiodateien erfasst, gespeichert oder übertragen. Alle Berechnungen basieren auf amtlichen SenUMVK-Open-Data-Gittern und mathematischen RMS-Schallenergiemodellen.'
                : lang === 'es'
                ? 'Esta demo no requiere acceso al micrófono. El concepto de privacidad garantiza que jamás se graba ni transmite audio. Los cálculos emplean datos abiertos de Berlín y modelos acústicos matemáticos.'
                : 'No microphone access required for this demo. The architecture guarantees zero audio capture, caching, or streaming. Noise models use Berlin open municipal data and mathematical sound energy curves.'}
            </p>

            <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-600 font-mono-code text-[11px]">
                <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Virtueller Schallpegel-Sensor:</span>
              </div>
              <div className="font-mono-code font-bold text-emerald-800 text-sm">
                {simulatedSensorDb} dB(A)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 24h Interactive Timeline & Acoustic Verdict (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main 24-Hour Soundscape Bar Chart */}
          <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono-code">
                  {lang === 'de' ? '24h Tagesgang & Ruhe-Fenster' : lang === 'es' ? 'Ritmo diario de 24h' : '24h Diurnal Soundscape'}
                </span>
                <h4 className="text-lg font-bold text-stone-900 font-serif-title">
                  {lang === 'de' ? profile.nameDe : lang === 'es' ? profile.nameEs : profile.nameEn}
                </h4>
              </div>

              {/* Play / Pause Time Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Zeitraffer'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentHour(14);
                  }}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  title="Reset to 14:00"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Current Hour Display and Big Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
              <div className="space-y-0.5">
                <div className="text-[11px] text-stone-600 font-medium">Uhrzeit</div>
                <div className="text-xl font-mono-code font-bold text-[#8c1d40]">
                  {String(currentHour).padStart(2, '0')}:00
                </div>
                <div className="text-[10px] text-stone-600 font-mono-code">
                  {currentHour >= 22 || currentHour < 6 ? '🌙 Nachtzeit' : currentHour >= 18 ? '🌆 Abend' : '☀️ Tag'}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[11px] text-stone-600 font-medium">Außenpegel</div>
                <div className="text-xl font-mono-code font-bold text-stone-900">
                  {outdoorDb} <span className="text-xs text-stone-500 font-normal">dB(A)</span>
                </div>
                <div className="text-[10px] text-stone-600 font-mono-code">± {profile.spreadDb} dB Streuung</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[11px] text-stone-600 font-medium">Innenpegel</div>
                <div className="text-xl font-mono-code font-bold text-blue-900">
                  {indoorDb} <span className="text-xs text-stone-500 font-normal">dB(A)</span>
                </div>
                <div className="text-[10px] text-blue-700/80 font-mono-code">{windowState} (-{windowAttenuation} dB)</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[11px] text-stone-600 font-medium">Status</div>
                <div className="text-xs font-bold pt-1">
                  {outdoorDb <= tranquilityThreshold ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-mono-code">
                      <Check className="w-3 h-3" /> Ruhe-Fenster
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-stone-700 bg-stone-200 px-2 py-0.5 rounded-md font-mono-code">
                      Lauter als {tranquilityThreshold} dB
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Visual 24-Bar Soundscape Chart */}
            <div className="space-y-1.5 pt-2">
              <div className="h-44 flex items-end gap-1 sm:gap-1.5 pt-4 pb-2 px-1 relative bg-gradient-to-b from-stone-50/50 to-stone-100/40 rounded-lg border border-stone-200">
                {/* Horizontal Threshold Guideline */}
                <div
                  className="absolute left-0 right-0 border-b-2 border-dashed border-emerald-600/60 pointer-events-none z-10"
                  style={{
                    bottom: `${((tranquilityThreshold - 25) / (85 - 25)) * 100}%`,
                  }}
                >
                  <span className="absolute right-2 -top-4 text-[9px] font-mono-code font-bold text-emerald-800 bg-white/90 px-1.5 py-0.5 rounded shadow-xs border border-emerald-300">
                    Ruhe-Grenze: {tranquilityThreshold} dB
                  </span>
                </div>

                {/* WHO Night Guideline (40 dB) */}
                <div
                  className="absolute left-0 right-0 border-b border-dotted border-amber-600/50 pointer-events-none z-10"
                  style={{
                    bottom: `${((40 - 25) / (85 - 25)) * 100}%`,
                  }}
                >
                  <span className="absolute left-2 -top-3.5 text-[9px] font-mono-code text-amber-800 bg-white/80 px-1 rounded">
                    WHO Nachtrichtwert (40 dB)
                  </span>
                </div>

                {profile.hourlyDb.map((db, hour) => {
                  const isCurrent = hour === currentHour;
                  const isQuiet = db <= tranquilityThreshold;
                  const isNight = hour >= 22 || hour < 6;
                  const heightPercent = Math.max(10, Math.min(100, ((db - 25) / (85 - 25)) * 100));

                  return (
                    <button
                      key={hour}
                      onClick={() => setCurrentHour(hour)}
                      className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer focus:outline-none"
                    >
                      {/* Bar Fill */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all duration-200 ${
                          isCurrent
                            ? 'bg-[#8c1d40] ring-2 ring-[#8c1d40]/40 shadow-sm'
                            : isQuiet
                            ? 'bg-emerald-500/80 hover:bg-emerald-600'
                            : isNight
                            ? 'bg-amber-600/70 hover:bg-amber-600'
                            : 'bg-stone-400 hover:bg-stone-500'
                        }`}
                      />

                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] font-mono-code px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                        {hour}:00 · {db} dB(A)
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hour X-Axis Labels */}
              <div className="flex justify-between text-[10px] text-stone-600 font-mono-code px-1">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
              </div>
            </div>

            {/* Time Slider Controls */}
            <div className="space-y-1 pt-1">
              <input
                type="range"
                min="0"
                max="23"
                value={currentHour}
                onChange={(e) => setCurrentHour(Number(e.target.value))}
                className="w-full accent-[#8c1d40] h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Biological & Scientific Verdict: "Kann ich mit offenem Fenster schlafen?" */}
          <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Bed className="w-4 h-4 text-[#8c1d40]" />
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-mono-code">
                {lang === 'de'
                  ? 'Schlaftest: Kann ich hier mit gekipptem Fenster schlafen?'
                  : lang === 'es'
                  ? 'Prueba de sueño: ¿Se puede dormir con ventana abierta?'
                  : 'Sleep Audit: Can you sleep here with a tilted window?'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WHO Metric Card */}
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                  <span>EU L_night (22:00–06:00):</span>
                  <span className="font-mono-code font-bold text-stone-900">{lNightOutdoor} dB(A)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                  <span>EU L_den (Jahreswert):</span>
                  <span className="font-mono-code font-bold text-stone-900">{lDen} dB(A)</span>
                </div>
                <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/60 leading-relaxed">
                  {lNightOutdoor <= 40
                    ? '✅ Erfüllt WHO-Zielwert für die Nacht (< 40 dB Außenpegel).'
                    : '⚠️ Überschreitet WHO-Grenzwert für gesunden Nachtschlaf.'}
                </div>
              </div>

              {/* Current Indoor Sleep Verdict */}
              <div className={`p-3.5 rounded-lg border space-y-1.5 ${whoIndoorSleepEvaluation.color}`}>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono-code">
                    Innenraum um {String(currentHour).padStart(2, '0')}:00 Uhr
                  </span>
                </div>
                <div className="text-xs font-medium leading-snug">
                  {lang === 'de'
                    ? whoIndoorSleepEvaluation.labelDe
                    : lang === 'es'
                    ? whoIndoorSleepEvaluation.labelEs
                    : whoIndoorSleepEvaluation.labelEn}
                </div>
                <div className="text-[10px] opacity-85 font-mono-code">
                  Aktueller Innenpegel: {indoorDb} dB(A)
                </div>
              </div>
            </div>

            {/* Identified Quiet Windows */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-stone-700 block">
                {lang === 'de' ? 'Erkannte Ruhe-Fenster für diesen Kiez:' : lang === 'es' ? 'Ventanas de tranquilidad detectadas:' : 'Detected Tranquility Windows:'}
              </span>
              {quietWindows.length === 0 ? (
                <p className="text-xs text-stone-500 italic">
                  {lang === 'de'
                    ? `Keine zusammenhängenden Ruhe-Fenster unter ${tranquilityThreshold} dB(A). Dieser Kiez ist durchgehend über dem Schwellenwert.`
                    : 'No continuous tranquility windows found under this threshold.'}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {quietWindows.map((w, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-mono-code font-semibold shadow-xs"
                    >
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>
                        {String(w.start).padStart(2, '0')}:00 – {String(w.end).padStart(2, '0')}:59 ({w.duration}h Dauer)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Civic Tech & GeoJSON Export Bar */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-stone-500">
                <span className="font-semibold text-stone-700">Open Data Export:</span> Standardisiertes GeoJSON für CityLAB / NoiseCapture
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyGeoJson}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                >
                  {copiedGeoJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGeoJson ? 'Kopiert!' : 'GeoJSON kopieren'}</span>
                </button>
                <button
                  onClick={handleDownloadGeoJson}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .geojson</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Home,
  Eye,
  Activity,
  Flame,
  Wind,
  AlertTriangle,
  Layers,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../../types';
import {
  AltbauResult,
  effectiveWindowWidth,
  calculateFRsi,
  CEILING_H,
} from '../../services/altbauThermal';

export type ProbePoint = 'corner' | 'wall' | 'window' | 'reveal' | 'niche' | 'radiator' | 'center' | 'floor';
export type DrawingLayer = 'blueprint' | 'thermal_heatmap' | 'mold_risk' | 'airflow';

export interface AltbauRoomDrawingProps {
  lang: Language;
  altbau: AltbauResult;
  roomWidth: number;
  roomArea: number;
  windowWidth: number;
  wallU: number;
  windowU: number;
  outsideTemp: number;
  roomTemp: number;
  relHumidity: number;
  wardrobePosition: 'tight' | 'ventilated' | 'interior_wall' | 'none';
  setWardrobePosition?: (pos: 'tight' | 'ventilated' | 'interior_wall' | 'none') => void;
  hasRadiatorNiche: boolean;
  setHasRadiatorNiche?: (val: boolean) => void;
  curtainOverRadiator: boolean;
  setCurtainOverRadiator?: (val: boolean) => void;
  windowTilted: boolean;
  setWindowTilted?: (val: boolean) => void;
  hasSecondExteriorWall: boolean;
  activeProbe: ProbePoint;
  setActiveProbe: (probe: ProbePoint) => void;
}

export const AltbauRoomDrawing: React.FC<AltbauRoomDrawingProps> = ({
  lang,
  altbau,
  roomWidth,
  roomArea,
  windowWidth,
  wallU,
  windowU,
  outsideTemp,
  roomTemp,
  relHumidity,
  wardrobePosition,
  setWardrobePosition,
  hasRadiatorNiche,
  setHasRadiatorNiche,
  curtainOverRadiator,
  setCurtainOverRadiator,
  windowTilted,
  setWindowTilted,
  hasSecondExteriorWall,
  activeProbe,
  setActiveProbe,
}) => {
  const [activeLayer, setActiveLayer] = useState<DrawingLayer>('blueprint');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const tr3 = (de: string, en: string, es: string) => (lang === 'de' ? de : lang === 'es' ? es : en);
  const numLocale = lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-GB';
  const nf = (x: number, d = 1) => x.toLocaleString(numLocale, { minimumFractionDigits: d, maximumFractionDigits: d });

  const roomDepth = roomArea / roomWidth;
  const effWindowWidth = effectiveWindowWidth(roomWidth, windowWidth);
  const cornerFRsi = calculateFRsi(altbau.corner2DGeometricMid, roomTemp, outsideTemp);
  const isInsulated = wallU <= 0.35;

  // Measurement probe values
  const wallSurfaceTemp1D = roomTemp - wallU * 0.13 * (roomTemp - outsideTemp);
  const cornerSurfaceTemp = altbau.corner2DGeometricMid;

  return (
    <div className="bg-[#141210] rounded-2xl border border-stone-800 p-4 sm:p-5 text-stone-100 shadow-xl space-y-4">
      {/* Top Header of Room Drawing: Title, Subtitle, Quick Layer Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-amber-500 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
              CAD 2D-PLAN
            </span>
            <h4 className="font-serif-title font-bold text-base text-stone-100">
              {tr3('Berliner Zimmer: Architektonischer Thermik-Grundriss', 'Berlin Altbau Room: Thermal CAD Blueprint', 'Plano térmico: Habitación tradicional')}
            </h4>
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {tr3(
              `5,0 m × ${nf(roomDepth, 1)} m (${roomArea} m²), 3,40 m Deckenhöhe · 38 cm Vollziegelmauerwerk · Kastenfenster`,
              `5.0 m × ${nf(roomDepth, 1)} m (${roomArea} m²), 3.4m ceiling · 38 cm solid brick masonry · Box sash window`,
              `5,0 m × ${nf(roomDepth, 1)} m (${roomArea} m²), 3,4m de altura · Muro de 38 cm · Ventana tradicional`
            )}
          </p>
        </div>

        {/* Layer Mode Selector Pills */}
        <div className="flex items-center bg-stone-900/90 p-1 rounded-xl border border-stone-800 gap-1 self-start sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveLayer('blueprint')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'blueprint'
                ? 'bg-amber-700 text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={tr3('Architektonischer Bauplan mit Maßen und Bauteilen', 'Architectural blueprint with dimensions', 'Plano arquitectónico')}
          >
            <Home className="w-3 h-3" />
            <span>{tr3('Bauplan', 'Blueprint', 'Plano')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('thermal_heatmap')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'thermal_heatmap'
                ? 'bg-rose-700 text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={tr3('Infrarot-Thermografie: Reales Temperaturfeld', 'Infrared thermography temperature gradient', 'Termografía')}
          >
            <Flame className="w-3 h-3" />
            <span>{tr3('Wärmebild', 'Thermal Map', 'Térmico')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('mold_risk')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'mold_risk'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={tr3('Schimmel-Risikokarte (Oberflächenfeuchte φ ≥ 80 %)', 'Mold risk zones with surface humidity ≥ 80%', 'Riesgo de moho')}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>{tr3('Schimmel-Zone', 'Mold Risk', 'Riesgo moho')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('airflow')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'airflow'
                ? 'bg-sky-700 text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={tr3('Konvektionsströmung & Zugluftrisiko am Boden', 'Convective circulation & draft risk', 'Circulación')}
          >
            <Wind className="w-3 h-3" />
            <span>{tr3('Konvektion', 'Airflow', 'Flujo de aire')}</span>
          </button>
        </div>
      </div>

      {/* Main SVG Blueprint Canvas */}
      <div className="relative w-full aspect-[16/10] bg-[#1a1714] rounded-xl border border-stone-700/80 overflow-hidden shadow-inner select-none">
        <svg viewBox="0 0 620 390" className="w-full h-full">
          <defs>
            {/* Masonry brick hatching pattern (45 degree lines) */}
            <pattern id="brickHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#68625d" strokeWidth="1" />
            </pattern>

            {/* Insulation pattern (zigzag / stippling) */}
            <pattern id="insulationPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 5 Q 2.5 0 5 5 T 10 5" fill="none" stroke="#eab308" strokeWidth="0.8" opacity="0.6" />
            </pattern>

            {/* Wooden Parquet Flooring Pattern */}
            <pattern id="parquetPattern" width="28" height="28" patternUnits="userSpaceOnUse">
              <rect width="28" height="28" fill="#24201c" />
              <line x1="0" y1="0" x2="28" y2="28" stroke="#352e27" strokeWidth="0.75" />
              <line x1="28" y1="0" x2="0" y2="28" stroke="#352e27" strokeWidth="0.75" />
              <line x1="0" y1="14" x2="28" y2="14" stroke="#2c2620" strokeWidth="0.5" />
              <line x1="14" y1="0" x2="14" y2="28" stroke="#2c2620" strokeWidth="0.5" />
            </pattern>

            {/* Thermal Infrarot Radiator Gradient (Warm zone) */}
            <radialGradient id="thermalRadiatorGradient" cx="50%" cy="10%" r="65%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={activeLayer === 'thermal_heatmap' ? 0.85 : 0.4} />
              <stop offset="25%" stopColor="#f97316" stopOpacity={activeLayer === 'thermal_heatmap' ? 0.7 : 0.25} />
              <stop offset="55%" stopColor="#eab308" stopOpacity={activeLayer === 'thermal_heatmap' ? 0.45 : 0.12} />
              <stop offset="85%" stopColor="#065f46" stopOpacity={activeLayer === 'thermal_heatmap' ? 0.25 : 0.0} />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
            </radialGradient>

            {/* Thermal Infrarot Corner Thermal Bridge (Cold zone) */}
            <radialGradient id="thermalCornerGradient" cx="8%" cy="10%" r="38%">
              <stop
                offset="0%"
                stopColor={cornerFRsi < 0.70 ? '#7f1d1d' : '#1e3a8a'}
                stopOpacity={activeLayer === 'thermal_heatmap' ? 0.9 : 0.55}
              />
              <stop
                offset="40%"
                stopColor={cornerFRsi < 0.70 ? '#b91c1c' : '#2563eb'}
                stopOpacity={activeLayer === 'thermal_heatmap' ? 0.65 : 0.3}
              />
              <stop offset="85%" stopColor="#1e293b" stopOpacity="0.0" />
            </radialGradient>

            {/* Mold Risk Warning Zone (Stripes) */}
            <pattern id="moldDangerPattern" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#e11d48" strokeWidth="4" opacity="0.8" />
              <line x1="6" y1="0" x2="6" y2="12" stroke="#450a0a" strokeWidth="4" opacity="0.8" />
            </pattern>

            {/* Window Cold Fall Gradient */}
            <linearGradient id="windowColdDraftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={windowTilted ? 0.8 : 0.2} />
              <stop offset="45%" stopColor="#0284c7" stopOpacity={windowTilted ? 0.45 : 0.08} />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.0" />
            </linearGradient>

            {/* Sacrificial Condensation Mist */}
            <pattern id="condensationDrops" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="#bae6fd" opacity="0.75" />
              <circle cx="9" cy="8" r="1" fill="#bae6fd" opacity="0.6" />
              <circle cx="5" cy="10" r="1.2" fill="#7dd3fc" opacity="0.7" />
            </pattern>
          </defs>

          {/* 1. ROOM FLOOR WITH PARQUET PATTERN */}
          <rect x="45" y="42" width="530" height="305" fill="url(#parquetPattern)" />

          {/* 2. LAYER OVERLAYS: HEATMAP / MOLD / AIRFLOW */}
          {/* Infrared Thermography Overlay */}
          {(activeLayer === 'thermal_heatmap' || activeLayer === 'blueprint') && (
            <>
              <rect x="45" y="42" width="530" height="305" fill="url(#thermalRadiatorGradient)" />
              <rect x="45" y="42" width="530" height="305" fill="url(#thermalCornerGradient)" />
            </>
          )}

          {/* Mold Hazard Overlay (Sedlbauer phi >= 80%) */}
          {activeLayer === 'mold_risk' && (
            <g className="animate-pulse duration-1000">
              {/* Mold zone behind wardrobe at exterior corner */}
              {wardrobePosition === 'tight' ? (
                <path
                  d="M 45 42 L 140 42 L 140 120 L 45 120 Z"
                  fill="url(#moldDangerPattern)"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
              ) : wardrobePosition === 'ventilated' ? (
                <path
                  d="M 45 42 L 75 42 L 75 80 L 45 80 Z"
                  fill="#10b981"
                  opacity="0.3"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
              ) : null}

              {/* Window reveal mold risk if poorly insulated */}
              {wallU > 1.0 && (
                <>
                  <rect x="195" y="42" width="20" height="25" fill="url(#moldDangerPattern)" opacity="0.75" />
                  <rect x="405" y="42" width="20" height="25" fill="url(#moldDangerPattern)" opacity="0.75" />
                </>
              )}

              {/* High risk alert badge on floor */}
              {cornerFRsi < 0.70 && (
                <g transform="translate(60, 60)">
                  <circle cx="0" cy="0" r="16" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="5" fill="#ffffff" fontSize="14" textAnchor="middle">⚠️</text>
                  <text x="24" y="4" fill="#fda4af" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    φ = {nf(altbau.surfaceRhCorner, 0)} % (Keimung: {altbau.moldGerminationDays}d)
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Airflow Circulation Streamlines Overlay */}
          {(activeLayer === 'airflow' || windowTilted) && (
            <g>
              {/* Cold drop from window */}
              <polygon points="210,42 410,42 460,250 160,250" fill="url(#windowColdDraftGrad)" />
              {/* Cold cascade arrows */}
              <path d="M 270 45 Q 260 140 240 260" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" />
              <polygon points="240,260 234,250 246,252" fill="#38bdf8" />

              <path d="M 350 45 Q 360 140 380 260" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" />
              <polygon points="380,260 374,252 386,250" fill="#38bdf8" />

              {/* Floor cold air lake puddle */}
              <ellipse cx="310" cy="285" rx="190" ry="24" fill="#0284c7" opacity={windowTilted ? 0.35 : 0.12} />
              <text x="310" y="288" fill="#e0f2fe" fontSize="10" fontWeight="bold" textAnchor="middle">
                {windowTilted ? '⚠️ Kaltluftsee am Boden (15 °C, Zugluft ISO 7730 PPD 68%)' : 'Mäßiger Kaltluftsee (18 °C)'}
              </text>

              {/* Warm buoyancy plume rising from radiator */}
              <path d="M 240 50 Q 210 120 200 190" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
              <polygon points="200,190 206,182 195,182" fill="#f59e0b" />

              <path d="M 380 50 Q 410 120 420 190" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
              <polygon points="420,190 414,182 425,182" fill="#f59e0b" />

              {/* Wardrobe ventilation loop arrow if ventilated */}
              {wardrobePosition === 'ventilated' && (
                <g>
                  <path d="M 52 140 Q 52 48 140 48" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
                  <polygon points="140,48 132,44 132,52" fill="#10b981" />
                  <text x="56" y="105" fill="#86efac" fontSize="8" fontWeight="bold" transform="rotate(-90, 56, 105)">
                    Hinterlüftungs-Konvektion (0,15 m/s)
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 3. WALL ARCHITECTURE & MASONRY CUTS */}
          {/* Top Exterior Wall (38 cm solid brick masonry) */}
          <g>
            {/* Outer plaster or insulation */}
            {isInsulated && (
              <rect x="22" y="10" width="576" height="12" fill="url(#insulationPattern)" stroke="#ca8a04" strokeWidth="1" />
            )}
            {/* Solid brickwork body */}
            <rect x="22" y="22" width="576" height="20" fill="#3f3c39" stroke="#57534e" strokeWidth="1.5" />
            <rect x="22" y="22" width="576" height="20" fill="url(#brickHatch)" />
            {/* Interior lime plaster line */}
            <line x1="22" y1="42" x2="598" y2="42" stroke="#d6d3d1" strokeWidth="1.5" />

            {/* Dimension text on top wall */}
            <text x="310" y="16" fill="#a8a29e" fontSize="10" fontFamily="monospace" textAnchor="middle">
              {tr3('Außenwand: 38 cm Vollziegel', 'Exterior Wall: 38 cm Solid Brick', 'Muro exterior: 38 cm ladrillo macizo')}
              {isInsulated ? ' + 16 cm WDVS' : ' (ungedämmt)'} · U = {wallU.toFixed(2)} W/m²K
            </text>
          </g>

          {/* Left Wall: Exterior corner or interior adjoining wall */}
          <g>
            {hasSecondExteriorWall && isInsulated && (
              <rect x="10" y="22" width="12" height="345" fill="url(#insulationPattern)" stroke="#ca8a04" strokeWidth="1" />
            )}
            <rect
              x="22"
              y="22"
              width="23"
              height="345"
              fill={hasSecondExteriorWall ? '#3f3c39' : '#292524'}
              stroke="#57534e"
              strokeWidth="1.5"
            />
            {hasSecondExteriorWall && <rect x="22" y="22" width="23" height="345" fill="url(#brickHatch)" />}
            <line x1="45" y1="22" x2="45" y2="367" stroke="#d6d3d1" strokeWidth="1.5" />
            <text x="14" y="210" fill="#a8a29e" fontSize="9" fontFamily="monospace" textAnchor="middle" transform="rotate(-90, 14, 210)">
              {hasSecondExteriorWall
                ? tr3('2. Außenwand (Ecksituation)', '2nd Exterior Wall (Corner room)', '2º muro exterior')
                : tr3('Innenwand zum Nachbarzimmer (20 °C)', 'Interior wall to neighbor room (20 °C)', 'Muro interior')}
            </text>
          </g>

          {/* Right Adjoining Wall */}
          <rect x="575" y="22" width="23" height="345" fill="#292524" stroke="#44403c" strokeWidth="1.5" />
          <line x1="575" y1="22" x2="575" y2="367" stroke="#d6d3d1" strokeWidth="1.5" />

          {/* Bottom Wall with Door to Hallway (Diele / Flur) */}
          <g>
            <rect x="22" y="347" width="576" height="20" fill="#292524" stroke="#44403c" strokeWidth="1.5" />
            <line x1="22" y1="347" x2="598" y2="347" stroke="#d6d3d1" strokeWidth="1.5" />

            {/* Door cutout and swing arc */}
            <rect x="430" y="347" width="70" height="20" fill="#141210" />
            <path d="M 430 347 A 70 70 0 0 1 500 347" fill="none" stroke="#78716c" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="430" y1="347" x2="430" y2="280" stroke="#f5ede3" strokeWidth="2.5" />
            <circle cx="434" cy="290" r="2.5" fill="#d4af37" />
            <text x="465" y="361" fill="#a8a29e" fontSize="9" textAnchor="middle">
              {tr3('Flur / Diele', 'Hallway door', 'Puerta al pasillo')}
            </text>
          </g>

          {/* 4. HISTORIC BOX SASH WINDOW (DOPPELKASTENFENSTER) */}
          {/* Centered along top exterior wall, 1.90 m high */}
          <g
            className="cursor-pointer group"
            onClick={() => setActiveProbe('window')}
            onMouseEnter={() => setHoveredElement('window')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            {/* Window Opening Reveals (Fensterlaibung) */}
            <rect x="210" y="16" width="200" height="28" fill="#0284c7" opacity="0.25" />
            <line x1="210" y1="16" x2="210" y2="44" stroke="#38bdf8" strokeWidth="2" />
            <line x1="410" y1="16" x2="410" y2="44" stroke="#38bdf8" strokeWidth="2" />

            {/* Outer Box Frame */}
            <rect x="212" y="18" width="196" height="24" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Outer Sash (Außenflügel) */}
            <line x1="214" y1="22" x2="406" y2="22" stroke="#60a5fa" strokeWidth="2" />
            {/* Inner Sash (Innenflügel) */}
            <line x1="214" y1="38" x2="406" y2="38" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Glass Panes */}
            <rect x="218" y="24" width="88" height="12" fill="#bae6fd" opacity="0.35" />
            <rect x="314" y="24" width="88" height="12" fill="#bae6fd" opacity="0.35" />
            <line x1="310" y1="20" x2="310" y2="40" stroke="#e2e8f0" strokeWidth="2" />

            {/* Condensation on glass if below dew point */}
            {altbau.windowInnerSurfaceTemp <= altbau.dewPoint && (
              <rect x="218" y="24" width="184" height="12" fill="url(#condensationDrops)" />
            )}

            {/* Tilt ventilation opening indicator */}
            {windowTilted && (
              <g>
                <polygon points="300,16 320,16 325,10 295,10" fill="#38bdf8" opacity="0.85" />
                <text x="310" y="8" fill="#7dd3fc" fontSize="8" fontWeight="bold" textAnchor="middle">
                  GEKIPPT (3.0 /h)
                </text>
              </g>
            )}

            {/* Window Label */}
            <text x="310" y="33" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              {windowU <= 1.0
                ? tr3('3-fach Isolierglas', 'Triple Glazed Window', 'Triple vidrio')
                : windowU <= 3.0
                ? tr3('Kastenfenster (Doppel)', 'Box Sash Window', 'Ventana doble')
                : tr3('Einfachglas', 'Single Glazed', 'Vidrio simple')}
              {' '}({effWindowWidth.toFixed(1)} m)
            </text>
          </g>

          {/* 5. RECESSED RADIATOR NICHE (HEIZKÖRPERNISCHE) & RADIATOR */}
          <g>
            {/* Niche cut into wall if enabled */}
            {hasRadiatorNiche && (
              <g>
                <rect x="225" y="32" width="170" height="12" fill="#1c1917" stroke="#e11d48" strokeWidth="1" strokeDasharray="3 2" />
                <text x="310" y="39" fill="#f87171" fontSize="7" fontFamily="monospace" textAnchor="middle">
                  {tr3('Nische: Wand nur 12 cm dünn!', 'Niche: wall only 12 cm thin!', '¡Nicho: muro de 12 cm!')}
                </text>
              </g>
            )}

            {/* Cast-iron radiator ribs under window */}
            <g
              className="cursor-pointer group"
              onClick={() => setActiveProbe('radiator')}
              onMouseEnter={() => setHoveredElement('radiator')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <rect
                x="230"
                y={hasRadiatorNiche ? "38" : "48"}
                width="160"
                height="20"
                rx="3"
                fill="#9a3412"
                stroke="#ea580c"
                strokeWidth="1.5"
              />
              {/* Radiator rib lines */}
              {Array.from({ length: 15 }).map((_, i) => (
                <line
                  key={i}
                  x1={238 + i * 10}
                  y1={hasRadiatorNiche ? 39 : 49}
                  x2={238 + i * 10}
                  y2={hasRadiatorNiche ? 57 : 67}
                  stroke="#fdba74"
                  strokeWidth="1"
                />
              ))}
              {/* Thermostat valve knob */}
              <circle cx="230" cy={hasRadiatorNiche ? 48 : 58} r="4" fill="#ffffff" stroke="#ea580c" strokeWidth="1.5" />
              <text x="310" y={hasRadiatorNiche ? 52 : 62} fill="#ffedd5" fontSize="9" fontWeight="bold" textAnchor="middle">
                {tr3('Gliederheizkörper (Vorlauf 55 °C)', 'Ribbed Radiator (55 °C)', 'Radiador de hierro fundido')}
              </text>
            </g>

            {/* Heavy velvet curtain draped over radiator if enabled */}
            {curtainOverRadiator && (
              <g>
                <path
                  d="M 215 44 Q 225 78 235 78 Q 245 44 255 78 Q 265 44 275 78 Q 285 44 295 78 Q 305 44 315 78 Q 325 44 335 78 Q 345 44 355 78 Q 365 44 375 78 Q 385 44 395 78 Q 405 44 415 78 L 415 44 Z"
                  fill="#7f1d1d"
                  stroke="#b91c1c"
                  strokeWidth="1.5"
                  opacity="0.88"
                />
                <text x="310" y="74" fill="#fecdd3" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {tr3('⚠️ Schwerer Vorhang staut Wärme am Fenster!', 'Curtain traps heat at window!', '¡Cortina bloquea el calor!')}
                </text>
              </g>
            )}
          </g>

          {/* 6. THE INFAMOUS WARDROBE (DER SCHRANK) */}
          {/* Position can be: tight (0 cm at corner), ventilated (10 cm gap), interior_wall, or none */}
          {wardrobePosition !== 'none' && (
            <g
              transform={
                wardrobePosition === 'tight'
                  ? 'translate(47, 44)'
                  : wardrobePosition === 'ventilated'
                  ? 'translate(62, 58)'
                  : 'translate(460, 260)' // interior wall position
              }
              className="transition-all duration-300 cursor-pointer group"
              onClick={() => setActiveProbe('corner')}
            >
              {/* Shadow */}
              <rect x="2" y="2" width="85" height="52" rx="4" fill="#000000" opacity="0.4" />
              {/* Wardrobe Body */}
              <rect
                x="0"
                y="0"
                width="85"
                height="52"
                rx="4"
                fill="#5c3d2e"
                stroke={wardrobePosition === 'tight' && cornerFRsi < 0.70 ? '#f43f5e' : '#a27b5c'}
                strokeWidth={wardrobePosition === 'tight' && cornerFRsi < 0.70 ? 2 : 1.5}
              />
              {/* Door divider and brass knobs */}
              <line x1="42.5" y1="0" x2="42.5" y2="52" stroke="#3f281e" strokeWidth="1.2" />
              <circle cx="36" cy="26" r="2.2" fill="#d4af37" />
              <circle cx="49" cy="26" r="2.2" fill="#d4af37" />

              {/* Text label inside wardrobe */}
              <text x="42.5" y="23" fill="#fbf8f5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                {tr3('Kleiderschrank', 'Wardrobe', 'Armario')}
              </text>
              <text
                x="42.5"
                y="36"
                fill={
                  wardrobePosition === 'tight'
                    ? '#fca5a5'
                    : wardrobePosition === 'ventilated'
                    ? '#86efac'
                    : '#e2e8f0'
                }
                fontSize="7.5"
                fontWeight="semibold"
                textAnchor="middle"
              >
                {wardrobePosition === 'tight'
                  ? tr3('0 cm (Bündig)', '0 cm (Flush)', '0 cm (Pegado)')
                  : wardrobePosition === 'ventilated'
                  ? tr3('10 cm Abstand', '10 cm gap', '10 cm sep.')
                  : tr3('An Innenwand', 'Interior wall', 'Pared interior')}
              </text>
            </g>
          )}

          {/* Stagnant air zone indicator behind wardrobe if tight */}
          {wardrobePosition === 'tight' && (
            <g transform="translate(45, 42)">
              <rect x="0" y="0" width="87" height="4" fill="#e11d48" opacity="0.8" />
              <rect x="0" y="0" width="4" height="54" fill="#e11d48" opacity="0.8" />
              <text x="45" y="10" fill="#fca5a5" fontSize="7" fontFamily="monospace">
                Rsi = 0.45 m²K/W (Luftstau)
              </text>
            </g>
          )}

          {/* 7. CLICKABLE MEASUREMENT PROBES (1 TO 7) */}
          {/* Probe 1: Außenecke (Cold Corner) */}
          <g
            onClick={() => setActiveProbe('corner')}
            className="cursor-pointer group"
            transform="translate(46, 44)"
          >
            {activeProbe === 'corner' && (
              <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-75" />
            )}
            <circle
              cx="0"
              cy="0"
              r={activeProbe === 'corner' ? 12 : 9.5}
              fill={cornerFRsi < 0.70 ? '#e11d48' : '#10b981'}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">1</text>
          </g>

          {/* Probe 2: Ungestörte Wand (Mid-wall) */}
          <g
            onClick={() => setActiveProbe('wall')}
            className="cursor-pointer group"
            transform="translate(145, 42)"
          >
            {activeProbe === 'wall' && (
              <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-75" />
            )}
            <circle
              cx="0"
              cy="0"
              r={activeProbe === 'wall' ? 12 : 9.5}
              fill="#d97706"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">2</text>
          </g>

          {/* Probe 3: Fenster-Verglasung (Window Glass) */}
          <g
            onClick={() => setActiveProbe('window')}
            className="cursor-pointer group"
            transform="translate(310, 30)"
          >
            {activeProbe === 'window' && (
              <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-75" />
            )}
            <circle
              cx="0"
              cy="0"
              r={activeProbe === 'window' ? 12 : 9.5}
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">3</text>
          </g>

          {/* Probe 4: Fensterlaibung (Reveal Thermal Bridge) */}
          <g
            onClick={() => setActiveProbe('reveal')}
            className="cursor-pointer group"
            transform="translate(212, 42)"
          >
            {activeProbe === 'reveal' && (
              <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-75" />
            )}
            <circle
              cx="0"
              cy="0"
              r={activeProbe === 'reveal' ? 12 : 9.5}
              fill="#8b5cf6"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">4</text>
          </g>

          {/* Probe 5: Heizkörpernische (Niche) */}
          <g
            onClick={() => setActiveProbe('niche')}
            className="cursor-pointer group"
            transform="translate(310, 52)"
          >
            {activeProbe === 'niche' && (
              <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-75" />
            )}
            <circle
              cx="0"
              cy="0"
              r={activeProbe === 'niche' ? 12 : 9.5}
              fill="#ea580c"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">5</text>
          </g>

          {/* Probe 6: Raummitte (Living Zone Center) */}
          <g
            onClick={() => setActiveProbe('center')}
            className="cursor-pointer group"
            transform="translate(310, 195)"
          >
            {activeProbe === 'center' && (
              <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-75" />
            )}
            <circle
              cx="0"
              cy="0"
              r={activeProbe === 'center' ? 12 : 9.5}
              fill="#78716c"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">6</text>
          </g>

          {/* Probe 7: Fußboden / Knöchelhöhe (Floor Cold Lake) */}
          <g
            onClick={() => setActiveProbe('floor')}
            className="cursor-pointer group"
            transform="translate(310, 275)"
          >
            {activeProbe === 'floor' && (
              <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-75" />
            )}
            <circle
              cx="0"
              cy="0"
              r={activeProbe === 'floor' ? 12 : 9.5}
              fill={windowTilted ? '#38bdf8' : '#64748b'}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">7</text>
          </g>

          {/* Room Dimensions & Scale Tag */}
          <g transform="translate(55, 335)">
            <text fill="#a8a29e" fontSize="9" fontFamily="monospace">
              ↔ {roomWidth.toFixed(1)} m Außenwand × ↕ {roomDepth.toFixed(1)} m Tiefe = {roomArea} m²
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Quick-Controls Bar directly beneath the drawing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-stone-900/90 p-3.5 rounded-xl border border-stone-800 text-xs">
        {/* Wardrobe Position Quick Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-stone-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-amber-500" />
              <span>{tr3('Schrank-Position:', 'Wardrobe Position:', 'Posición armario:')}</span>
            </span>
            <span className="font-mono-code text-[10px] text-amber-400">
              {wardrobePosition === 'tight'
                ? '0 cm (Kritisch)'
                : wardrobePosition === 'ventilated'
                ? '10 cm (Sicher)'
                : wardrobePosition === 'interior_wall'
                ? 'Innenwand'
                : 'Kein Schrank'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setWardrobePosition?.('tight')}
              className={`p-1.5 rounded text-center transition-all cursor-pointer ${
                wardrobePosition === 'tight'
                  ? 'bg-rose-900 text-white font-bold border border-rose-600'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
              }`}
            >
              <div className="text-[10px]">{tr3('Bündig', 'Flush', 'Pegado')}</div>
              <div className="text-[8px] opacity-75 font-mono-code">0 cm</div>
            </button>
            <button
              type="button"
              onClick={() => setWardrobePosition?.('ventilated')}
              className={`p-1.5 rounded text-center transition-all cursor-pointer ${
                wardrobePosition === 'ventilated'
                  ? 'bg-emerald-900 text-white font-bold border border-emerald-600'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
              }`}
            >
              <div className="text-[10px]">{tr3('Belüftet', 'Gap', 'Separado')}</div>
              <div className="text-[8px] opacity-75 font-mono-code">10 cm</div>
            </button>
            <button
              type="button"
              onClick={() => setWardrobePosition?.('interior_wall')}
              className={`p-1.5 rounded text-center transition-all cursor-pointer ${
                wardrobePosition === 'interior_wall'
                  ? 'bg-amber-800 text-white font-bold border border-amber-600'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
              }`}
            >
              <div className="text-[10px]">{tr3('Innenwand', 'Int. Wall', 'Pared int.')}</div>
              <div className="text-[8px] opacity-75 font-mono-code">Sicher</div>
            </button>
          </div>
        </div>

        {/* Niche & Curtain Toggles */}
        <div className="space-y-1.5">
          <span className="text-stone-300 font-medium block">
            {tr3('Heizkörper & Nische Details:', 'Radiator & Niche Details:', 'Detalles del radiador:')}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHasRadiatorNiche?.(!hasRadiatorNiche)}
              className={`flex-1 p-1.5 rounded text-center transition-all cursor-pointer border ${
                hasRadiatorNiche
                  ? 'bg-amber-950 text-amber-200 border-amber-700 font-semibold'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              <div className="text-[10px]">{tr3('Heizkörpernische', 'Radiator Niche', 'Nicho')}</div>
              <div className="text-[8px] font-mono-code opacity-75">
                {hasRadiatorNiche ? '+12 cm Mauerwerk' : 'Vollwand (38 cm)'}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setCurtainOverRadiator?.(!curtainOverRadiator)}
              className={`flex-1 p-1.5 rounded text-center transition-all cursor-pointer border ${
                curtainOverRadiator
                  ? 'bg-rose-950 text-rose-200 border-rose-700 font-semibold'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              <div className="text-[10px]">{tr3('Langer Vorhang', 'Long Curtain', 'Cortina')}</div>
              <div className="text-[8px] font-mono-code opacity-75">
                {curtainOverRadiator ? '+18% Glasverlust' : 'Heizkörper frei'}
              </div>
            </button>
          </div>
        </div>

        {/* Ventilation Mode Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-stone-300 font-medium">
            <span>{tr3('Lüftungsverhalten:', 'Ventilation Mode:', 'Ventilación:')}</span>
            <span className="font-mono-code text-[10px] text-sky-400">
              {windowTilted ? '3.0 /h (Dauerkipp)' : '0.5 /h (Stoßlüften)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWindowTilted?.(!windowTilted)}
            className={`w-full p-2 rounded-lg text-center transition-all cursor-pointer border font-bold ${
              windowTilted
                ? 'bg-rose-900/80 text-rose-200 border-rose-700'
                : 'bg-emerald-950 text-emerald-300 border-emerald-700'
            }`}
          >
            {windowTilted
              ? tr3('⚠️ Dauerkipplüftung (Kaltluftsee & Zugluft)', '⚠️ Tilted 24/7 (Draft & Floor Cold Pool)', 'Abatible 24h')
              : tr3('✅ Stoßlüften (3× täglich 5 Min)', '✅ Shock Ventilation (3× daily 5 min)', 'Ventilación cruzada')}
          </button>
        </div>
      </div>
    </div>
  );
};

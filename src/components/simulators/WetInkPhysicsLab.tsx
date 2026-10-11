import React, { useState, useRef, useEffect } from 'react';
import {
  Cpu,
  Droplets,
  Layers,
  Sparkles,
  RefreshCw,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Activity,
  Zap,
  Info,
  Wind,
} from 'lucide-react';
import { Language } from '../../types';
import {
  PAPER_PRESETS,
  PIGMENT_PRESETS,
  createPigmentFromHex,
  generatePaperMaps,
  WetInkPaperConfig,
  WetInkPigmentConfig,
  WetInkSimParams,
  SimulationLayer,
  WebGL2WetInkEngine,
  calculateKMReflectance,
  evaluatePigmentMixture,
  naiveRgbBlend,
  PAPER_REFLECTANCE,
  srgbDeltaE,
  simulateRadialChromatography,
  PIGMENT_PARTICLE_CATALOG,
  calculateCrossViscosity,
  calculateCarreauYasudaViscosity,
  calculateHerschelBulkley,
  calculateSteadyStateThixotropy,
  INK_RHEOLOGY_CATALOG,
  simulateEvaporativeDlvo,
  COLLOID_PIGMENT_CATALOG,
  analyzeDropletEvaporation,
  calculateSingularityExponent,
  analyzePaperWettingRegime,
  PAPER_TOPOGRAPHY_CATALOG,
  GLSL_KUBELKA_MUNK_SNIPPET,
  FRAGMENT_SHADER_ADVECT,
  FRAGMENT_SHADER_CAPILLARY,
  FRAGMENT_SHADER_COFFEE_RING,
  FRAGMENT_SHADER_KUBELKA_MUNK,
} from '../../engine/wet-ink';

interface WetInkPhysicsLabProps {
  lang: Language;
}

export const WetInkPhysicsLab: React.FC<WetInkPhysicsLabProps> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<WebGL2WetInkEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  const [activeTab, setActiveTab] = useState<'simulation' | 'kubelka-munk' | 'chromatography' | 'rheology' | 'dlvo-wetting' | 'coffee-ring' | 'fiber-anisotropy' | 'shaders'>('simulation');
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [brushRadius, setBrushRadius] = useState<number>(14);
  const [selectedPaper, setSelectedPaper] = useState<WetInkPaperConfig>(PAPER_PRESETS[0]);
  const [selectedPigment1, setSelectedPigment1] = useState<WetInkPigmentConfig>(
    PIGMENT_PRESETS.find((p) => p.id === 'kadmiumgelb') || PIGMENT_PRESETS[2]
  );
  const [selectedPigment2, setSelectedPigment2] = useState<WetInkPigmentConfig>(
    PIGMENT_PRESETS.find((p) => p.id === 'preussischblau') || PIGMENT_PRESETS[3]
  );
  const [activeLayer, setActiveLayer] = useState<SimulationLayer>('composite');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeShaderTab, setActiveShaderTab] = useState<'advect' | 'capillary' | 'coffee' | 'km'>('km');

  // Scientific Optics: Saunderson (1942) Fresnel Boundary
  const [applySaunderson, setApplySaunderson] = useState<boolean>(true);

  // Radial Chromatography Simulation Parameters
  const [chromaDropletR, setChromaDropletR] = useState<number>(3.0);
  const [chromaDuration, setChromaDuration] = useState<number>(1.2);
  const [chromaPoreUm, setChromaPoreUm] = useState<number>(10.0);

  // 4. Ink Rheology & Thixotropy State
  const [selectedRheologyKey, setSelectedRheologyKey] = useState<string>('pineSootGelatin');
  const [rheoShearRate, setRheoShearRate] = useState<number>(50); // s^-1
  const [rheoTipSpeedMmS, setRheoTipSpeedMmS] = useState<number>(100); // mm/s
  const [rheoFilmThicknessUm, setRheoFilmThicknessUm] = useState<number>(20); // μm

  // 5. DLVO Colloid Stability & Paper Wetting State
  const [selectedColloidKey, setSelectedColloidKey] = useState<string>('carbonBlackGelatin');
  const [dlvoWaterFraction, setDlvoWaterFraction] = useState<number>(0.50); // 50% evaporated
  const [selectedTopographyKey, setSelectedTopographyKey] = useState<string>('shengXuan');

  // 6. Deegan Coffee-Ring Parameters
  const [deeganContactAngleDeg, setDeeganContactAngleDeg] = useState<number>(30);
  const [deeganDropRadiusMm, setDeeganDropRadiusMm] = useState<number>(4.0);
  const [deeganBaseFluxG, setDeeganBaseFluxG] = useState<number>(0.2); // 0.2 g/(m^2·s)

  // Simulation Parameters
  const [params, setParams] = useState<WetInkSimParams>({
    capillaryThreshold: 0.14,
    enableCapillaryThreshold: true,
    capillarySpeed: 1.25,
    evaporationRate: 1.0,
    edgeDarkeningStrength: 1.35,
    granulationStrength: 1.2,
    backrunStrength: 1.0,
    dryBrushSensitivity: 1.0,
    tiltX: 0,
    tiltY: 0,
  });

  // Kubelka-Munk Lab Ratios
  const [ratioP1, setRatioP1] = useState<number>(0.5);
  const [kmThickness, setKmThickness] = useState<number>(1.2);

  // WebGL2 Telemetry
  const [gpuStats, setGpuStats] = useState({ fps: 60, frameTime: 0.8, isWebGL2: true });

  const SIM_W = 384;
  const SIM_H = 256;

  // Initialize WebGL2 Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paperMaps = generatePaperMaps(SIM_W, SIM_H, selectedPaper, 42);
    const engine = new WebGL2WetInkEngine(
      canvas,
      SIM_W,
      SIM_H,
      paperMaps,
      selectedPaper,
      selectedPigment1,
      params
    );

    if (selectedPigment2) {
      engine.setPigment(selectedPigment2, 2);
    }

    engineRef.current = engine;
    setGpuStats((s) => ({ ...s, isWebGL2: engine.isSupported }));

    // Demo injection: create an overlapping wash of Pigment 1 and Pigment 2
    if (engine.isSupported) {
      // Circle 1 (Yellow)
      engine.injectInk(SIM_W * 0.4, SIM_H * 0.5, 45, 1.2, 1.5, 1);
      // Circle 2 (Blue) overlapping
      engine.injectInk(SIM_W * 0.6, SIM_H * 0.5, 45, 1.2, 1.5, 2);
    }

    let lastTime = performance.now();
    let frameCount = 0;

    const loop = () => {
      const now = performance.now();
      if (engine.isSupported) {
        engine.step(0.016);
        engine.render(activeLayer, 2.4, 0.65);
      }

      frameCount++;
      if (now - lastTime >= 500) {
        setGpuStats({
          fps: Math.round((frameCount * 1000) / (now - lastTime)),
          frameTime: Math.round(engine.gpuTimeMs * 10) / 10,
          isWebGL2: engine.isSupported,
        });
        frameCount = 0;
        lastTime = now;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      engine.dispose();
    };
  }, [selectedPaper]);

  // Update engine pigments and params
  useEffect(() => {
    if (engineRef.current && engineRef.current.isSupported) {
      engineRef.current.setPigment(selectedPigment1, 1);
      if (selectedPigment2) engineRef.current.setPigment(selectedPigment2, 2);
      engineRef.current.setParams(params);
    }
  }, [selectedPigment1, selectedPigment2, params]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleInjectDrop = (xFrac: number, yFrac: number, slot: 1 | 2) => {
    if (engineRef.current && engineRef.current.isSupported) {
      engineRef.current.injectInk(SIM_W * xFrac, SIM_H * yFrac, 32, 1.0, 1.4, slot);
    }
  };

  const handleClear = () => {
    if (engineRef.current && engineRef.current.isSupported) {
      engineRef.current.clear();
    }
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = SIM_W / rect.width;
    const scaleY = SIM_H / rect.height;
    const x = Math.max(0, Math.min(SIM_W - 1, (e.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(SIM_H - 1, (e.clientY - rect.top) * scaleY));
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const { x, y } = getCanvasCoords(e);
    if (engineRef.current && engineRef.current.isSupported) {
      engineRef.current.stroke(x, y, brushRadius, 1.0, 1.4, activeSlot, true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const { x, y } = getCanvasCoords(e);
    if (engineRef.current && engineRef.current.isSupported) {
      engineRef.current.stroke(x, y, brushRadius, 1.0, 1.4, activeSlot, false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDrawingRef.current = false;
    if (engineRef.current && engineRef.current.isSupported) {
      engineRef.current.endStroke();
    }
  };

  const handlePigment1Change = (pigment: WetInkPigmentConfig) => {
    setSelectedPigment1(pigment);
    if (engineRef.current && engineRef.current.isSupported) {
      engineRef.current.setPigment(pigment, 1);
    }
  };

  const handlePigment2Change = (pigment: WetInkPigmentConfig) => {
    setSelectedPigment2(pigment);
    if (engineRef.current && engineRef.current.isSupported) {
      engineRef.current.setPigment(pigment, 2);
    }
  };

  const handleCustomColor1Change = (hex: string) => {
    const custom = createPigmentFromHex(hex, 'custom-1', 'Pigment 1', 'Pigment 1');
    handlePigment1Change(custom);
  };

  const handleCustomColor2Change = (hex: string) => {
    const custom = createPigmentFromHex(hex, 'custom-2', 'Pigment 2', 'Pigment 2');
    handlePigment2Change(custom);
  };

  // Evaluate interactive Kubelka-Munk with optional Saunderson (1942) Fresnel correction
  const kmResult = evaluatePigmentMixture(
    [
      { km: selectedPigment1.km, concentration: ratioP1 },
      { km: selectedPigment2.km, concentration: 1 - ratioP1 },
    ],
    kmThickness,
    PAPER_REFLECTANCE,
    applySaunderson
  );

  const rgbBlendResult = naiveRgbBlend(
    [selectedPigment1.r, selectedPigment1.g, selectedPigment1.b],
    ratioP1,
    [selectedPigment2.r, selectedPigment2.g, selectedPigment2.b],
    1 - ratioP1
  );

  // ISO/CIE CIEDE2000 (ΔE₀₀) perceptual divergence between physical optics and naive blending
  const deltaEKmVsRgb = srgbDeltaE(
    [Math.round(kmResult[0] * 255), Math.round(kmResult[1] * 255), Math.round(kmResult[2] * 255)],
    [rgbBlendResult[0], rgbBlendResult[1], rgbBlendResult[2]]
  );

  // Radial Paper Chromatography Simulation
  const chromaResult = React.useMemo(() => {
    const p1Part = PIGMENT_PARTICLE_CATALOG[selectedPigment1.id] || {
      radiusNm: 100,
      retardationFactor: 0.85,
      strainingRate: 0.15,
    };
    const p2Part = PIGMENT_PARTICLE_CATALOG[selectedPigment2.id] || {
      radiusNm: 100,
      retardationFactor: 0.85,
      strainingRate: 0.15,
    };
    return simulateRadialChromatography(
      [
        { pigment: selectedPigment1, initialFraction: ratioP1, particle: p1Part },
        { pigment: selectedPigment2, initialFraction: 1 - ratioP1, particle: p2Part },
      ],
      chromaDropletR,
      chromaDuration,
      90,
      chromaPoreUm
    );
  }, [selectedPigment1, selectedPigment2, ratioP1, chromaDropletR, chromaDuration, chromaPoreUm]);

  // 4. Ink Rheology Calculations
  const selectedRheology = INK_RHEOLOGY_CATALOG[selectedRheologyKey] || INK_RHEOLOGY_CATALOG.pineSootGelatin;
  const crossViscosityPaS = calculateCrossViscosity(rheoShearRate, selectedRheology.cross);
  const carreauViscosityPaS = calculateCarreauYasudaViscosity(rheoShearRate, selectedRheology.carreau);
  const hbResult = calculateHerschelBulkley(rheoShearRate, selectedRheology.yieldStress);
  const thixotropicSS = calculateSteadyStateThixotropy(rheoShearRate, selectedRheology.thixotropy);

  // 5. DLVO Colloid Stability & Wetting Calculations
  const selectedColloid = COLLOID_PIGMENT_CATALOG[selectedColloidKey] || COLLOID_PIGMENT_CATALOG.carbonBlackGelatin;
  const dlvoResult = React.useMemo(() => {
    return simulateEvaporativeDlvo(selectedColloid.particle, selectedColloid.defaultSolution, dlvoWaterFraction);
  }, [selectedColloid, dlvoWaterFraction]);

  const selectedTopography = PAPER_TOPOGRAPHY_CATALOG[selectedTopographyKey] || PAPER_TOPOGRAPHY_CATALOG.shengXuan;
  const wettingReport = React.useMemo(() => {
    return analyzePaperWettingRegime(selectedTopography);
  }, [selectedTopography]);

  // 6. Deegan Evaporation & Coffee-Ring Analysis
  const deeganResult = React.useMemo(() => {
    return analyzeDropletEvaporation({
      contactAngle: (deeganContactAngleDeg * Math.PI) / 180,
      dropRadius: deeganDropRadiusMm * 1e-3,
      baseEvaporativeFlux: deeganBaseFluxG * 1e-3,
    });
  }, [deeganContactAngleDeg, deeganDropRadiusMm, deeganBaseFluxG]);

  return (
    <div id="wet-ink-physics-lab" className="flex flex-col gap-6 w-full max-w-6xl mx-auto text-stone-800">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl shadow-xl border border-stone-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                WebGL2 GPU Pipeline
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono bg-stone-800 text-stone-300 rounded-full border border-stone-700">
                Eulerian-Lagrangian &bull; Ping-Pong FBOs
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-stone-100">
              {lang === 'de'
                ? 'Physik-Labor: Kontinuumsmechanik & WebGL2-Shader'
                : lang === 'es' ? 'Laboratorio de física: mecánica de medios continuos y shaders WebGL2' : 'Physics Laboratory: Continuum Mechanics & WebGL2 Shaders'}
            </h2>
            <p className="text-sm text-stone-400 max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Wissenschaftliche Umsetzung von Navier-Stokes-Advektion, Washburn-Kapillardurchdringung in poröser Zellulose, Deegan-Kaffeering-Randschwärzung und Kubelka-Munk-Spektralglasuren auf der GPU.'
                : lang === 'es' ? 'Ingeniería científica de advección Navier-Stokes, penetración capilar de Washburn en celulosa porosa, oscurecimiento de borde tipo anillo de café de Deegan y veladuras espectrales Kubelka-Munk en la GPU.' : 'Scientific engineering of Navier-Stokes advection, Washburn capillary penetration in porous cellulose, Deegan coffee-ring edge darkening, and Kubelka-Munk spectral glazes on GPU.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/80 px-4 py-2 rounded-xl border border-stone-700/80 shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">GPU Frame Time</span>
              <span className="text-base font-mono font-bold text-emerald-400">{gpuStats.frameTime} ms</span>
            </div>
            <div className="h-6 w-px bg-stone-700" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Frame Rate</span>
              <span className="text-base font-mono font-bold text-stone-100">{gpuStats.fps} FPS</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-800">
          {[
            { id: 'simulation', label: lang === 'de' ? '1. GPU-Simulation' : lang === 'es' ? '1. Simulación en GPU' : '1. GPU Simulation', icon: Zap },
            { id: 'kubelka-munk', label: lang === 'de' ? '2. Kubelka-Munk Farbmischung' : lang === 'es' ? '2. Laboratorio de color Kubelka-Munk' : '2. Kubelka-Munk Color Lab', icon: Sparkles },
            { id: 'chromatography', label: lang === 'de' ? '3. Papier-Chromatographie' : lang === 'es' ? '3. Cromatografía en papel' : '3. Paper Chromatography', icon: Layers },
            { id: 'rheology', label: lang === 'de' ? '4. Tinten-Rheologie & Thixotropie' : lang === 'es' ? '4. Reología y tixotropía' : '4. Ink Rheology & Thixotropy', icon: Activity },
            { id: 'dlvo-wetting', label: lang === 'de' ? '5. Kolloid-Stabilität & Benetzung' : lang === 'es' ? '5. Estabilidad coloidal (DLVO)' : '5. Colloid Stability & Wetting', icon: Droplets },
            { id: 'coffee-ring', label: lang === 'de' ? '6. Deegan-Kaffeering-Effekt' : lang === 'es' ? '6. Anillo de café de Deegan' : '6. Deegan Coffee-Ring', icon: RefreshCw },
            { id: 'fiber-anisotropy', label: lang === 'de' ? '7. Faser-Anisotropie & fBm' : lang === 'es' ? '7. Anisotropía de fibra y fBm' : '7. Fiber Anisotropy & fBm', icon: Wind },
            { id: 'shaders', label: lang === 'de' ? '8. GLSL-Shader-Code' : lang === 'es' ? '8. Código de los shaders GLSL' : '8. GLSL Shader Source', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSel
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700/80 hover:text-stone-200 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Live WebGL2 GPU Simulation Canvas */}
      {activeTab === 'simulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main WebGL2 Canvas View */}
          <div className="lg:col-span-8 flex flex-col gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  {lang === 'de' ? 'Echtzeit-WebGL2-Reaktionsbecken' : lang === 'es' ? 'Cubeta de reacción WebGL2 en tiempo real' : 'Real-time WebGL2 Reaction Basin'}
                </h3>
              </div>

              {/* Active Drawing Slot Toggle */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  onClick={() => setActiveSlot(1)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeSlot === 1
                      ? 'bg-white text-stone-950 shadow-xs ring-1 ring-stone-900/10 font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title={lang === 'de' ? 'Mit Slot 1 zeichnen' : 'Draw with Slot 1'}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: selectedPigment1.colorHex }}
                  />
                  <span>Slot 1: {selectedPigment1.nameDe.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => setActiveSlot(2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeSlot === 2
                      ? 'bg-white text-stone-950 shadow-xs ring-1 ring-stone-900/10 font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title={lang === 'de' ? 'Mit Slot 2 zeichnen' : 'Draw with Slot 2'}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: selectedPigment2.colorHex }}
                  />
                  <span>Slot 2: {selectedPigment2.nameDe.split(' ')[0]}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleInjectDrop(0.35, 0.45, 1)}
                  className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
                  title="Inject drop of Slot 1"
                >
                  <Droplets className="w-3 h-3 text-amber-600" />
                  + Tropfen 1
                </button>
                <button
                  onClick={() => handleInjectDrop(0.65, 0.55, 2)}
                  className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                  title="Inject drop of Slot 2"
                >
                  <Droplets className="w-3 h-3 text-blue-600" />
                  + Tropfen 2
                </button>
                <button
                  onClick={handleClear}
                  className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                  title="Clear Paper"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative aspect-[3/2] w-full bg-[#FAF7EE] rounded-xl overflow-hidden border border-stone-300 shadow-inner flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={SIM_W}
                height={SIM_H}
                className="w-full h-full object-contain cursor-crosshair touch-none select-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              />
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur text-stone-200 text-[10px] px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 border border-stone-700/60 pointer-events-none">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: activeSlot === 1 ? selectedPigment1.colorHex : selectedPigment2.colorHex,
                  }}
                />
                <span>
                  {lang === 'de' ? 'Zeichnen' : 'Drawing'}: Slot {activeSlot} ({activeSlot === 1 ? selectedPigment1.nameDe.split(' ')[0] : selectedPigment2.nameDe.split(' ')[0]})
                </span>
              </div>
              <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur text-stone-200 text-[11px] px-3 py-1 rounded-full font-mono flex items-center gap-2 border border-stone-700/60 pointer-events-none">
                <span>{SIM_W}x{SIM_H} Ping-Pong FBO</span>
                <span>&bull;</span>
                <span className="text-emerald-400">WebGL2 Active</span>
              </div>
            </div>

            {/* Layer Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-medium text-stone-500">{lang === 'de' ? 'Shader-Layer:' : lang === 'es' ? 'Capa del shader:' : 'Shader Layer:'}</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'composite', label: lang === 'de' ? 'Kubelka-Munk Optik' : lang === 'es' ? 'Composición KM' : 'KM Composite' },
                  { id: 'moisture', label: lang === 'de' ? 'Kapillarfront' : lang === 'es' ? 'Frente capilar' : 'Capillary Front' },
                  { id: 'pigment', label: lang === 'de' ? 'Pigment-Dichte' : lang === 'es' ? 'Densidad de pigmento' : 'Pigment Density' },
                  { id: 'paper', label: lang === 'de' ? 'Papier-Relief' : lang === 'es' ? 'Relieve del papel' : 'Paper Relief' },
                  { id: 'vectorField', label: lang === 'de' ? 'Geschwindigkeitsfeld' : lang === 'es' ? 'Campo de velocidades' : 'Velocity Field' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(l.id as any)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                      activeLayer === l.id
                        ? 'bg-stone-900 text-stone-100'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls & Parameters */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-stone-600" />
                {lang === 'de' ? 'Fluid-Parameter (GPU Uniforms)' : lang === 'es' ? 'Uniforms del fluido' : 'Fluid Uniforms'}
              </h4>

              {/* Capillary Speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600">{lang === 'de' ? 'Washburn-Kapillargeschwindigkeit:' : lang === 'es' ? 'Tasa capilar de Washburn:' : 'Washburn Capillary Rate:'}</span>
                  <span className="font-mono font-bold text-stone-800">{params.capillarySpeed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={params.capillarySpeed}
                  onChange={(e) => setParams({ ...params, capillarySpeed: parseFloat(e.target.value) })}
                  className="w-full accent-stone-800"
                />
              </div>

              {/* Edge Darkening (Deegan) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600">{lang === 'de' ? 'Deegan-Kaffeering-Stärke:' : lang === 'es' ? 'Factor anillo de café de Deegan:' : 'Deegan Coffee-Ring Factor:'}</span>
                  <span className="font-mono font-bold text-stone-800">{params.edgeDarkeningStrength.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={params.edgeDarkeningStrength}
                  onChange={(e) => setParams({ ...params, edgeDarkeningStrength: parseFloat(e.target.value) })}
                  className="w-full accent-amber-600"
                />
              </div>

              {/* Capillary Threshold (Smoke bug fix) */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-stone-900">{lang === 'de' ? 'Kapillarschwellwert (ε_min)' : lang === 'es' ? 'Umbral capilar (ε_min)' : 'Capillary Threshold (ε_min)'}</div>
                  <div className="text-[11px] text-stone-500">{lang === 'de' ? 'Verhindert unphysikalische Rauchauflösung' : lang === 'es' ? 'Evita el fallo de desenfoque tipo humo, que no es físico' : 'Prevents unphysical smoke-blur bug'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={params.enableCapillaryThreshold}
                  onChange={(e) => setParams({ ...params, enableCapillaryThreshold: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              {/* Pigment Slots & Color Selector */}
              <div className="pt-3 border-t border-stone-100 space-y-3">
                <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {lang === 'de' ? 'Pigment-Slots & Farbwahl' : lang === 'es' ? 'Slots de pigmento y color' : 'Pigment Slots & Color'}
                </span>

                {/* Slot 1 Selector */}
                <div className="space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">Slot 1:</span>
                    <label className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-stone-200 cursor-pointer" title="Pick hex color for Slot 1">
                      <input
                        type="color"
                        value={selectedPigment1.colorHex}
                        onChange={(e) => handleCustomColor1Change(e.target.value)}
                        className="w-3.5 h-3.5 rounded border-0 p-0 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-[10px] text-stone-600 uppercase">{selectedPigment1.colorHex}</span>
                    </label>
                  </div>
                  <select
                    value={selectedPigment1.id}
                    onChange={(e) => {
                      const found = PIGMENT_PRESETS.find((p) => p.id === e.target.value);
                      if (found) handlePigment1Change(found);
                    }}
                    className="w-full text-xs bg-white border border-stone-300 rounded-lg p-1.5 text-stone-800"
                  >
                    {PIGMENT_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>{p.nameDe}</option>
                    ))}
                  </select>
                </div>

                {/* Slot 2 Selector (Blue by default) */}
                <div className="space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">Slot 2 (Blau / Kontrast):</span>
                    <label className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-stone-200 cursor-pointer" title="Pick hex color for Slot 2">
                      <input
                        type="color"
                        value={selectedPigment2.colorHex}
                        onChange={(e) => handleCustomColor2Change(e.target.value)}
                        className="w-3.5 h-3.5 rounded border-0 p-0 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-[10px] text-stone-600 uppercase">{selectedPigment2.colorHex}</span>
                    </label>
                  </div>
                  <select
                    value={selectedPigment2.id}
                    onChange={(e) => {
                      const found = PIGMENT_PRESETS.find((p) => p.id === e.target.value);
                      if (found) handlePigment2Change(found);
                    }}
                    className="w-full text-xs bg-white border border-stone-300 rounded-lg p-1.5 text-stone-800"
                  >
                    {PIGMENT_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>{p.nameDe}</option>
                    ))}
                  </select>
                </div>

                {/* Brush Radius Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600">{lang === 'de' ? 'Strichstärke:' : 'Brush Radius:'}</span>
                    <span className="font-mono font-bold text-stone-800">{brushRadius} px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="32"
                    step="1"
                    value={brushRadius}
                    onChange={(e) => setBrushRadius(parseInt(e.target.value, 10))}
                    className="w-full accent-stone-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Scientific Architecture Reference */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="font-bold text-stone-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-600" />
                {lang === 'de' ? 'Open-Source-Referenzarchitektur' : lang === 'es' ? 'Arquitectura de código abierto' : 'Open-Source Architecture'}
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {lang === 'de'
                  ? 'Inspiriert von PavelDoGreat/WebGL-Fluid-Simulation für eulerische Navier-Stokes-Vektorfelder und amandaghassaei/FluidSimulation für semi-lagrangesche Advektion mit poröser Darcy-Matrix.'
                  : lang === 'es' ? 'Sintetizado a partir de PavelDoGreat/WebGL-Fluid-Simulation para mallas eulerianas Navier-Stokes y de amandaghassaei/FluidSimulation para advección semilagrangiana con flujo poroso de Darcy.' : 'Synthesized from PavelDoGreat/WebGL-Fluid-Simulation for Eulerian Navier-Stokes grids and amandaghassaei/FluidSimulation for semi-Lagrangian advection with porous Darcy flow.'}
              </p>
              <div className="pt-2 flex flex-col gap-1 font-mono text-[10px] text-stone-500">
                <a
                  href="https://github.com/PavelDoGreat/WebGL-Fluid-Simulation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-700 hover:text-amber-700 flex items-center gap-1"
                >
                  &bull; PavelDoGreat/WebGL-Fluid-Simulation <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href="https://github.com/amandaghassaei/FluidSimulation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-700 hover:text-amber-700 flex items-center gap-1"
                >
                  &bull; amandaghassaei/FluidSimulation <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Kubelka-Munk Physical Color Mixing Lab */}
      {activeTab === 'kubelka-munk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                Scientific Optical Standard
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {lang === 'de' ? 'Kubelka-Munk vs. Naive RGB-Alpha-Mischung' : lang === 'es' ? 'Kubelka-Munk frente a mezcla alfa RGB ingenua' : 'Kubelka-Munk vs. Naive RGB Alpha Blend'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Standard-RGB-Alpha-Blending mittelt Farbwerte linear im RGB-Farbraum. Beim Überlagern von Gelb und Blau entsteht ein schmutziges, aschiges Olivgrau. Das Kubelka-Munk-Modell löst reale Absorptions- (K) und Streukoeffizienten (S): Gelb absorbiert Blau, Blau absorbiert Rot/Gelb – das übrigbleibende Streulicht erzeugt ein leuchtendes, brillantes Smaragdgrün!'
                  : lang === 'es' ? 'La mezcla alfa RGB estándar promedia los canales de color linealmente en el espacio digital. Mezclar amarillo y azul da un marrón oliva apagado y turbio. El modelo diferencial de Kubelka-Munk resuelve los espectros físicos de absorción (K) y dispersión (S): el amarillo absorbe el azul, el azul absorbe el rojo, y la luz dispersada restante produce un verde esmeralda vivo y radiante.' : 'Standard RGB alpha-blending averages color channels linearly in digital space. Mixing yellow and blue yields dull, muddy olive-brown. The Kubelka-Munk differential model solves physical absorption (K) and scattering (S) spectra: yellow absorbs blue, blue absorbs red, and the remaining scattered light produces a vivid, radiant emerald green!'}
              </p>
            </div>

            {/* Live Comparison Box */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Kubelka-Munk Result */}
              <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/30 flex flex-col items-center text-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                  Kubelka-Munk (Physikalisch)
                </span>
                <div
                  className="w-24 h-24 rounded-2xl shadow-inner border border-stone-300 transition-colors"
                  style={{
                    backgroundColor: `rgb(${Math.round(kmResult[0] * 255)}, ${Math.round(kmResult[1] * 255)}, ${Math.round(kmResult[2] * 255)})`,
                  }}
                />
                <div className="text-[11px] font-mono text-stone-600">
                  RGB({Math.round(kmResult[0] * 255)}, {Math.round(kmResult[1] * 255)}, {Math.round(kmResult[2] * 255)})
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {lang === 'de' ? 'Brillantes physikalisches Smaragdgrün' : lang === 'es' ? 'Verde esmeralda luminoso y vivo' : 'Luminous vibrant emerald green'}
                </span>
              </div>

              {/* Naive RGB Result */}
              <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/30 flex flex-col items-center text-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono">
                  Standard RGB Blend (Digital)
                </span>
                <div
                  className="w-24 h-24 rounded-2xl shadow-inner border border-stone-300 transition-colors"
                  style={{
                    backgroundColor: `rgb(${rgbBlendResult[0]}, ${rgbBlendResult[1]}, ${rgbBlendResult[2]})`,
                  }}
                />
                <div className="text-[11px] font-mono text-stone-600">
                  RGB({rgbBlendResult[0]}, {rgbBlendResult[1]}, {rgbBlendResult[2]})
                </div>
                <span className="text-[11px] text-rose-700 font-medium">
                  {lang === 'de' ? 'Schmutziges, mattes Schlammoliv' : lang === 'es' ? 'Marrón turbio y desaturado' : 'Muddy, dull desaturated brown'}
                </span>
              </div>
            </div>

            {/* ISO/CIE CIEDE2000 Perceptual Difference Metric */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-stone-900 flex items-center gap-2">
                  <span>ISO/CIE 11664-6 CIEDE2000:</span>
                  <span className={`font-mono px-2 py-0.5 rounded text-xs font-bold ${
                    deltaEKmVsRgb > 15 ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                    deltaEKmVsRgb > 5 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    ΔE₀₀ = {deltaEKmVsRgb.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {deltaEKmVsRgb > 15
                    ? (lang === 'de' ? 'Massiver wahrnehmbarer Fehler durch naive digitale Farb-Mittelung (ΔE > 15)' : 'Massive perceptual error from naive digital RGB averaging (ΔE > 15)')
                    : deltaEKmVsRgb > 5
                    ? (lang === 'de' ? 'Deutlich sichtbare Farbverschiebung für das menschliche Auge (ΔE > 5)' : 'Clearly noticeable color shift to the human eye (ΔE > 5)')
                    : (lang === 'de' ? 'Subtiler Unterschied (ΔE < 5)' : 'Subtle difference (ΔE < 5)')}
                </div>
              </div>
              <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">Sharma et al. (2005)</span>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-4 pt-3 border-t border-stone-200">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-stone-700">
                    {lang === 'de' ? 'Mischverhältnis: ' : lang === 'es' ? 'Proporción: ' : 'Ratio: '}
                    <strong className="text-amber-800">{selectedPigment1.nameDe.split(' ')[0]}</strong> ({Math.round(ratioP1 * 100)}%) vs.{' '}
                    <strong className="text-blue-800">{selectedPigment2.nameDe.split(' ')[0]}</strong> ({Math.round((1 - ratioP1) * 100)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={ratioP1}
                  onChange={(e) => setRatioP1(parseFloat(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-stone-700">{lang === 'de' ? 'Farbschicht-Dicke (x):' : lang === 'es' ? 'Grosor de la veladura (x):' : 'Glaze Thickness (x):'}</span>
                  <span className="font-mono text-stone-900">{kmThickness.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.05"
                  value={kmThickness}
                  onChange={(e) => setKmThickness(parseFloat(e.target.value))}
                  className="w-full accent-stone-700"
                />
              </div>

              {/* Saunderson (1942) Fresnel Correction Toggle */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-stone-900">
                    {lang === 'de' ? 'Saunderson (1942) Fresnel-Korrektur' : 'Saunderson (1942) Fresnel Boundary'}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {lang === 'de' ? 'Interne diffuse Rückstreuung (k₁=0.04, k₂=0.60) zwischen Luft und Pigmentsubstrat' : 'Internal diffuse back-scattering (k₁=0.04, k₂=0.60) at air-substrate boundary'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={applySaunderson}
                  onChange={(e) => setApplySaunderson(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
              </div>
            </div>
          </div>

          {/* Mathematical Foundations */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-5 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">Kubelka-Munk Differential System</span>
                <button
                  onClick={() => handleCopy(GLSL_KUBELKA_MUNK_SNIPPET, 'km-snippet')}
                  className="text-stone-400 hover:text-stone-100 p-1"
                >
                  {copiedCode === 'km-snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="bg-stone-950 p-3 rounded-lg font-mono text-[11px] text-stone-300 leading-relaxed border border-stone-800">
                <p className="text-amber-300">dI/dx = -(K + S)I + S J</p>
                <p className="text-amber-300">-dJ/dx = -(K + S)J + S I</p>
                <p className="mt-2 text-stone-400">// Reflectance over paper Rg:</p>
                <p>a = 1.0 + K / S</p>
                <p>b = sqrt(a² - 1.0)</p>
                <p className="text-emerald-400">R = (1 - Rg(a - b·coth(bSx))) / (a - Rg + b·coth(bSx))</p>
              </div>

              <div className="text-[11px] text-stone-400 space-y-1.5">
                <p>
                  <strong className="text-stone-200">K (Absorption):</strong> {lang === 'de' ? 'Wahrscheinlichkeit, dass ein Photon absorbiert wird.' : lang === 'es' ? 'Probabilidad de que un fotón se absorba por unidad de profundidad.' : 'Probability that a photon is absorbed per unit depth.'}
                </p>
                <p>
                  <strong className="text-stone-200">S (Scattering):</strong> {lang === 'de' ? 'Wahrscheinlichkeit, dass ein Photon an Pigmentpartikeln zurückgestreut wird.' : lang === 'es' ? 'Probabilidad de retrodispersión del fotón.' : 'Probability of backward photon scatter.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400">
              Duncan (1940) Multicomponent Rule:
              <span className="block font-mono text-stone-200 mt-1">K_mix = Σ c_i · K_i,  S_mix = Σ c_i · S_i</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Radial Paper Chromatography & Multi-Pigment Separation */}
      {activeTab === 'chromatography' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                Lucas (1918) &bull; Washburn (1921) &bull; Consden et al. (1944)
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {lang === 'de' ? 'Radiale Papier-Chromatographie & Pigment-Separation' : lang === 'es' ? 'Cromatografía radial en papel y separación de pigmentos' : 'Radial Paper Chromatography & Pigment Separation'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Werden Pigmente mit unterschiedlichen Partikelgrößen (z. B. feine Kiefernharz-Ruß-Nanopartikel mit 35 nm und grobe Zinnober-Mineralkristalle mit 2400 nm) auf ungeleimtes Xuan/Washi aufgetragen, wandert das Wasser kapillar nach dem Washburn-Gesetz. Die feinen Partikel eilen mit der Wasserfront voraus (hoher Rf-Wert), während grobe Kristalle im Zellulose-Porenfilter zurückgehalten werden (Fen-Mo-Effekt / Pigment-Splitting).'
                  : 'When pigments with distinct hydrodynamic particle sizes (e.g., 35 nm pine soot nanoparticles vs. 2400 nm coarse cinnabar mineral crystals) diffuse into unsized paper, the solvent front advances via the Lucas-Washburn law. Ultrafine particles wick forward with the front (high Rf), while coarse grains suffer steric pore-throat filtration, creating an authentic chromatic halo.'}
              </p>
            </div>

            {/* Chromatography Metrics Summary */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-center font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Front Radius R(t)</span>
                <div className="text-sm font-bold text-stone-900">{chromaResult.solventFrontRadius.toFixed(1)} mm</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">IUPAC Resol. Rs</span>
                <div className="text-sm font-bold text-emerald-700">
                  {chromaResult.resolutions[0] !== undefined ? chromaResult.resolutions[0].toFixed(2) : '1.00'}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Max ΔE₀₀ Shift</span>
                <div className="text-sm font-bold text-amber-700">
                  {Math.max(...Array.from(chromaResult.deltaEProfile)).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Radial Color Gradient Cross-Section Strip */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-800">
                  {lang === 'de' ? 'Spektraler Farbverlauf (Zentrum → Kapillarfront):' : 'Radial Spectral Gradient (Center → Front):'}
                </span>
                <span className="font-mono text-[11px] text-stone-500">
                  dr = {(chromaResult.solventFrontRadius / chromaResult.srgbProfile.length).toFixed(2)} mm / cell
                </span>
              </div>
              <div
                className="h-12 w-full rounded-xl border border-stone-300 shadow-inner flex overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${chromaResult.srgbProfile
                    .filter((_, idx) => idx % 3 === 0)
                    .map((rgb, idx, arr) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) ${(idx / (arr.length - 1)) * 100}%`)
                    .join(', ')})`,
                }}
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500 px-1">
                <span>r = 0 mm (Kern-Mischung)</span>
                <span>r = {(chromaResult.solventFrontRadius * 0.5).toFixed(1)} mm</span>
                <span>r = {chromaResult.solventFrontRadius.toFixed(1)} mm (Kapillarsaum)</span>
              </div>
            </div>

            {/* Retention Factors & Particle Specs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="text-xs font-bold text-stone-800 flex justify-between">
                  <span>{selectedPigment1.nameDe.split(' ')[0]}</span>
                  <span className="font-mono text-amber-800">Rf = {chromaResult.retentionFactors[0]?.toFixed(2) || '0.70'}</span>
                </div>
                <div className="text-[11px] text-stone-600 font-mono">
                  Partikel-Radius: {PIGMENT_PARTICLE_CATALOG[selectedPigment1.id]?.radiusNm || 100} nm
                </div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="text-xs font-bold text-stone-800 flex justify-between">
                  <span>{selectedPigment2.nameDe.split(' ')[0]}</span>
                  <span className="font-mono text-blue-800">Rf = {chromaResult.retentionFactors[1]?.toFixed(2) || '0.90'}</span>
                </div>
                <div className="text-[11px] text-stone-600 font-mono">
                  Partikel-Radius: {PIGMENT_PARTICLE_CATALOG[selectedPigment2.id]?.radiusNm || 100} nm
                </div>
              </div>
            </div>

            {/* Interactive Chromatography Controls */}
            <div className="space-y-3 pt-3 border-t border-stone-200 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-700 font-medium">{lang === 'de' ? 'Tropfen-Startradius R₀:' : 'Initial Droplet Radius R₀:'}</span>
                  <span className="font-mono font-bold text-stone-900">{chromaDropletR.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.2"
                  value={chromaDropletR}
                  onChange={(e) => setChromaDropletR(parseFloat(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-700 font-medium">{lang === 'de' ? 'Diffusionszeit t:' : 'Diffusion Time t:'}</span>
                  <span className="font-mono font-bold text-stone-900">{chromaDuration.toFixed(2)} s</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={chromaDuration}
                  onChange={(e) => setChromaDuration(parseFloat(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-700 font-medium">{lang === 'de' ? 'Papier-Porenradius r_pore:' : 'Paper Pore Radius r_pore:'}</span>
                  <span className="font-mono font-bold text-stone-900">{chromaPoreUm.toFixed(0)} µm</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  step="1"
                  value={chromaPoreUm}
                  onChange={(e) => setChromaPoreUm(parseFloat(e.target.value))}
                  className="w-full accent-stone-700"
                />
              </div>
            </div>
          </div>

          {/* Mathematical Foundations Panel */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-5 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-amber-400">Lucas-Washburn Capillary Kinetics</span>
              <div className="bg-stone-950 p-3 rounded-lg font-mono text-[11px] text-stone-300 leading-relaxed border border-stone-800 space-y-1.5">
                <p className="text-amber-300">// Lucas-Washburn front radius:</p>
                <p>R(t) = sqrt(R₀² + (γ · r_pore · cos θ / 2η) · t)</p>
                <p className="mt-2 text-stone-400">// Stokes-Einstein dispersion:</p>
                <p>D_k = k_B · T / (6πη · r_p,k)</p>
                <p className="mt-2 text-stone-400">// Darcy pore straining loss:</p>
                <p className="text-emerald-400">λ_k ∝ (r_p,k / r_pore)²</p>
              </div>

              <div className="text-[11px] text-stone-400 space-y-2">
                <p>
                  <strong className="text-stone-200">IUPAC Separation Resolution:</strong>
                  <span className="block font-mono text-stone-300 mt-0.5">Rs = 2 |r₂ - r₁| / (w₁ + w₂)</span>
                  {lang === 'de'
                    ? 'Ab Rs ≥ 1.0 gilt die Trennung beider Pigmentzonen in der analytischen Chromatographie als optisch aufgelöst.'
                    : 'At Rs ≥ 1.0, the separation of both pigment zones is considered chromatographically resolved.'}
                </p>
                <p>
                  <strong className="text-stone-200">Fen-Mo (分墨):</strong> {lang === 'de' ? 'Klassischer Farbaufspaltungseffekt in der chinesischen Tuschmalerei bei Mischungen aus Rußtusche und mineralischen Erdpigmenten.' : 'Classical pigment split effect in East Asian ink wash when blending pine soot with mineral pigments.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 text-[10px] font-mono text-stone-400">
              Ettre (1993) IUPAC Recommendations &bull; ISO/CIE 11664-6:2014
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Non-Newtonian Ink Rheology & Thixotropy */}
      {activeTab === 'rheology' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                Cross (1965) &bull; Carreau-Yasuda (1972) &bull; Herschel-Bulkley (1926)
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {lang === 'de' ? 'Nicht-Newtonsche Tinten-Rheologie & Thixotropie' : lang === 'es' ? 'Reología no newtoniana y tixotropía de tinta' : 'Non-Newtonian Ink Rheology & Thixotropy'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Echte Tusche und Tinten (Ruß mit Knochenleim, Zinnober, Eisengallus) verhalten sich strukturviskos (scherverdünnend): In Ruhe schützt eine hohe Viskosität η₀ und Fließgrenze τ_y vor unkontrolliertem Zerfließen. Unter der Scherbeanspruchung der Pinselspitze fällt die Viskosität um Größenordnungen auf η_∞ ab, gefolgt von thixotroper Rückgelierung.'
                  : lang === 'es' ? 'Las tintas auténticas (hollín con gelatina animal, cinabrio, agalla de hierro) son pseudoplásticas y tixotrópicas: en reposo, una alta viscosidad η₀ y límite elástico τ_y evitan derrames. Bajo el esfuerzo cortante de la punta del pincel, la viscosidad cae varios órdenes de magnitud hacia η_∞.' : 'Authentic calligraphy and fountain inks (carbon soot with animal glue, cinnabar, iron gall) are shear-thinning and thixotropic: at rest, high zero-shear viscosity η₀ and yield stress τ_y prevent sagging. Under stylus shear stress, viscosity drops orders of magnitude to η_∞, followed by thixotropic gel recovery.'}
              </p>
            </div>

            {/* Ink Formulation Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-700">{lang === 'de' ? 'Rezeptur / Tinten-Profil:' : 'Ink Formulation / Profile:'}</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(INK_RHEOLOGY_CATALOG).slice(0, 3).map(([key, prof]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRheologyKey(key)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedRheologyKey === key
                        ? 'border-amber-600 bg-amber-50/70 font-semibold text-amber-950 shadow-sm'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="truncate">{prof.nameDe.split('(')[0].trim()}</div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      η₀ = {prof.cross.eta0 < 0.1 ? prof.cross.eta0.toFixed(3) : prof.cross.eta0.toFixed(1)} Pa·s
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rheology Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-center font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Cross η(γ̇)</span>
                <div className="text-sm font-bold text-amber-800">
                  {(crossViscosityPaS * 1000).toFixed(crossViscosityPaS < 0.01 ? 1 : 0)} mPa·s
                </div>
                <span className="text-[9px] text-stone-400">
                  {((crossViscosityPaS / selectedRheology.cross.eta0) * 100).toFixed(1)}% von η₀
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Carreau-Yasuda</span>
                <div className="text-sm font-bold text-stone-900">
                  {(carreauViscosityPaS * 1000).toFixed(carreauViscosityPaS < 0.01 ? 1 : 0)} mPa·s
                </div>
                <span className="text-[9px] text-stone-400">λ={selectedRheology.carreau.lambda}s</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Fließgrenze τ</span>
                <div className="text-sm font-bold text-stone-900">
                  {hbResult.shearStress.toFixed(2)} Pa
                </div>
                <span className={`text-[9px] font-bold ${hbResult.isYielded ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {hbResult.isYielded ? 'Fließend' : 'Ruhe-Gel'}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Thixotropie λ_ss</span>
                <div className="text-sm font-bold text-purple-700">
                  {thixotropicSS.toFixed(2)}
                </div>
                <span className="text-[9px] text-stone-400">
                  τ_rec={selectedRheology.thixotropy.recoveryTime}s
                </span>
              </div>
            </div>

            {/* Interactive Shear Rate Slider */}
            <div className="space-y-3 p-4 bg-stone-50/70 rounded-xl border border-stone-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-800">
                  {lang === 'de' ? 'Schergeschwindigkeit γ̇ (Shear Rate):' : 'Shear Rate γ̇:'}
                </span>
                <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300">
                  {rheoShearRate.toFixed(0)} s⁻¹
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1000"
                step="5"
                value={rheoShearRate}
                onChange={(e) => setRheoShearRate(parseFloat(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span>0.5 s⁻¹ (Ruhe / Stillstand)</span>
                <span>50 s⁻¹ (Pinselstrich)</span>
                <span>1000 s⁻¹ (Schnelle Feder)</span>
              </div>
            </div>
          </div>

          {/* Mathematical Rheology Panel */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-5 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-amber-400">Cross & Carreau-Yasuda Rheology</span>
              <div className="bg-stone-950 p-3 rounded-lg font-mono text-[11px] text-stone-300 leading-relaxed border border-stone-800 space-y-1.5">
                <p className="text-amber-300">// Cross (1965) Viscosity:</p>
                <p>η(γ̇) = η_∞ + (η₀ - η_∞) / [1 + (K · γ̇)^m]</p>
                <p className="mt-2 text-stone-400">// Herschel-Bulkley Yield Stress:</p>
                <p>τ(γ̇) = τ_y + K · (γ̇)^n</p>
                <p className="mt-2 text-stone-400">// Thixotropic Network Recovery:</p>
                <p className="text-purple-300">dλ/dt = (1 - λ)/τ_rec - k_break · γ̇ · λ</p>
              </div>

              <div className="text-[11px] text-stone-300 leading-relaxed space-y-1">
                <p className="text-amber-200 font-semibold">{selectedRheology.nameDe}:</p>
                <p className="text-stone-400 text-[11px]">{selectedRheology.descriptionDe}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 text-[10px] font-mono text-stone-400">
              Cross (1965) J. Colloid Sci. &bull; Mewis & Wagner (2009) Adv. Colloid Interface Sci.
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: DLVO Colloid Stability & Wetting Regimes */}
      {activeTab === 'dlvo-wetting' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                Derjaguin-Landau-Verwey-Overbeek (1941/1948) &bull; Wenzel (1936) &bull; Cassie-Baxter (1944)
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {lang === 'de' ? 'DLVO-Kolloidstabilität & Papierbenetzung' : lang === 'es' ? 'Estabilidad coloidal DLVO y mojado de papel' : 'DLVO Colloid Stability & Paper Wetting'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Pigmentgranulierung und Flockung werden durch die DLVO-Energiebarriere V_max gesteuert. Verdunstet das Wasser, steigt die Ionenstärke I(t), die Debye-Abschirmlänge λ_D bricht ein und Partikel stürzen in das primäre Energieminimum (irreversible Granulierung). Zugleich bestimmt die Faserrelief-Topografie (Wenzel r_w vs. Cassie f_s), ob Tinte kapillar einsaugt oder auf Lufteinschlüssen steht.'
                  : lang === 'es' ? 'La floculación y granulación de pigmentos se rigen por la barrera energética DLVO V_max. A medida que el agua se evapora, la fuerza iónica aumenta, la longitud de Debye λ_D se comprime y la barrera colapsa. Al mismo tiempo, la topografía del papel (Wenzel vs Cassie) rige la transición de mojado.' : 'Pigment granulation and flocculation are governed by the DLVO energy barrier V_max. As water evaporates, ionic strength rises, Debye screening length λ_D compresses, and the barrier collapses. Concurrently, paper fiber topography (Wenzel vs Cassie) dictates capillary imbibition.'}
              </p>
            </div>

            {/* Colloid Pigment & Topography Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-700">{lang === 'de' ? 'Kolloid-Pigment:' : 'Colloid Pigment:'}</span>
                <select
                  value={selectedColloidKey}
                  onChange={(e) => setSelectedColloidKey(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-stone-50 font-mono"
                >
                  {Object.entries(COLLOID_PIGMENT_CATALOG).map(([k, c]) => (
                    <option key={k} value={k}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-700">{lang === 'de' ? 'Papier-Topografie:' : 'Paper Substrate:'}</span>
                <select
                  value={selectedTopographyKey}
                  onChange={(e) => setSelectedTopographyKey(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-stone-50 font-mono"
                >
                  {Object.entries(PAPER_TOPOGRAPHY_CATALOG).map(([k, p]) => (
                    <option key={k} value={k}>{p.nameDe}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DLVO Evaporative Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-center font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Ionenstärke I</span>
                <div className="text-sm font-bold text-stone-900">
                  {(dlvoResult.currentIonicStrength * 1000).toFixed(1)} mM
                </div>
                <span className="text-[9px] text-stone-400">λ_D = {(dlvoResult.profile.debyeLength * 1e9).toFixed(1)} nm</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">DLVO-Barriere V_max</span>
                <div className="text-sm font-bold text-amber-800">
                  {dlvoResult.profile.barrierKBT.toFixed(1)} k_B·T
                </div>
                <span className={`text-[9px] font-bold ${
                  dlvoResult.profile.stability === 'stable'
                    ? 'text-emerald-700'
                    : dlvoResult.profile.stability === 'slow_flocculation'
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}>
                  {dlvoResult.profile.stability === 'stable' ? 'Stabil (Sol)' : dlvoResult.profile.stability === 'slow_flocculation' ? 'Trübung' : 'Granuliert!'}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Wenzel-Winkel θ_W</span>
                <div className="text-sm font-bold text-blue-700">
                  {wettingReport.wenzelAngleDeg.toFixed(1)}°
                </div>
                <span className="text-[9px] text-stone-400">θ_Y = {wettingReport.youngAngleDeg.toFixed(0)}°</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Laplace-Druck ΔP</span>
                <div className="text-sm font-bold text-stone-900">
                  {(wettingReport.laplaceBreakthroughPressurePa / 1000).toFixed(1)} kPa
                </div>
                <span className="text-[9px] text-emerald-600 font-semibold">
                  {wettingReport.stableRegime === 'complete_wetting' ? 'Vollbenetzung' : wettingReport.stableRegime}
                </span>
              </div>
            </div>

            {/* Evaporation Progress Slider */}
            <div className="space-y-3 p-4 bg-stone-50/70 rounded-xl border border-stone-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-800">
                  {lang === 'de' ? 'Verdunstungsfortschritt (Verbliebener Wasseranteil):' : 'Evaporative Progress (Water Fraction):'}
                </span>
                <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300">
                  {(dlvoWaterFraction * 100).toFixed(0)}% Wasser
                </span>
              </div>
              <input
                type="range"
                min="0.02"
                max="1.0"
                step="0.02"
                value={dlvoWaterFraction}
                onChange={(e) => setDlvoWaterFraction(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span>100% (Frisch aufgetragen, Sol stabil)</span>
                <span>50% (Ionen konzentrieren)</span>
                <span>2% (Trocknung, Flockung vollendet)</span>
              </div>
            </div>
          </div>

          {/* Mathematical DLVO & Wetting Panel */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-5 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-amber-400">DLVO & Wetting Equations</span>
              <div className="bg-stone-950 p-3 rounded-lg font-mono text-[11px] text-stone-300 leading-relaxed border border-stone-800 space-y-1.5">
                <p className="text-amber-300">// Total DLVO Potential:</p>
                <p>V_tot(H) = V_A(H) + V_R(H)</p>
                <p className="mt-2 text-stone-400">// Debye Screening Length:</p>
                <p>κ = sqrt(2e² N_A I / (ε_r ε₀ k_B T))</p>
                <p className="mt-2 text-stone-400">// Wenzel Roughness Wetting:</p>
                <p className="text-blue-300">cos θ_W = r_w · cos θ_Y</p>
                <p className="mt-2 text-stone-400">// Cassie-Baxter Air Cushion:</p>
                <p className="text-emerald-300">cos θ_CB = f_s (cos θ_Y + 1) - 1</p>
              </div>

              <div className="text-[11px] text-stone-300 leading-relaxed space-y-1">
                <p className="text-amber-200 font-semibold">{selectedTopography.nameDe}:</p>
                <p className="text-stone-400 text-[11px]">{selectedTopography.descriptionDe}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 text-[10px] font-mono text-stone-400">
              Verwey & Overbeek (1948) &bull; Wenzel (1936) Ind. Eng. Chem.
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Robert Deegan (1997) Coffee-Ring Effect */}
      {activeTab === 'coffee-ring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                Robert Deegan et al. (Nature 1997) &bull; Hu & Larson (2002)
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {lang === 'de' ? 'Der physikalische Kaffeering-Effekt (Edge Darkening)' : lang === 'es' ? 'El efecto anillo de café (oscurecimiento del borde)' : 'The Physical Coffee-Ring Effect (Edge Darkening)'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Wenn ein Tinten- oder Kaffeetropfen auf Papier trocknet, ist seine Kontaktlinie am Papier befestigt (Contact Line Pinning). Da der Meniskus am Rand dünner ist, divergiert der Verdunstungsfluss J(r) nach Deegan mit Exponent λ. Kontinuität pumpt Flüssigkeit von innen nach außen und transportiert Pigmentpartikel an den Rand.'
                  : lang === 'es' ? 'Cuando una gota de tinta se seca sobre el papel, su perímetro queda anclado. Como el menisco es más delgado en el borde, el flujo de evaporación J(r) diverge según el exponente λ de Deegan. La continuidad del fluido bombea líquido hacia el perímetro arrastrando pigmentos.' : 'When an ink droplet dries on paper, its contact line is pinned. Because the meniscus is thinnest at the boundary, evaporative flux J(r) diverges following Deegan’s exponent λ. Fluid continuity pumps liquid outward, carrying pigment particles to the rim.'}
              </p>
            </div>

            {/* Deegan Metrics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-center font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Singularität λ</span>
                <div className="text-sm font-bold text-amber-800">
                  {deeganResult.singularityExponent.toFixed(3)}
                </div>
                <span className="text-[9px] text-stone-400">θ_c = {deeganContactAngleDeg}°</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Kaffeering-Verhältnis</span>
                <div className="text-sm font-bold text-stone-900">
                  {deeganResult.coffeeRingRatio.toFixed(1)} ×
                </div>
                <span className="text-[9px] text-stone-400">Rim / Zentrum</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Peclet Pe</span>
                <div className="text-sm font-bold text-blue-700">
                  {deeganResult.pecletNumber > 1000 ? '> 1000' : deeganResult.pecletNumber.toFixed(0)}
                </div>
                <span className="text-[9px] text-stone-400">Advektion dominiert</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Trocknungszeit</span>
                <div className="text-sm font-bold text-stone-900">
                  {(deeganResult.dryingTimeSeconds / 60).toFixed(1)} min
                </div>
                <span className="text-[9px] text-stone-400">{deeganResult.dryingTimeSeconds.toFixed(0)} s</span>
              </div>
            </div>

            {/* Evaporation Cross-Section SVG Diagram */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-stone-700 uppercase">
                  {lang === 'de' ? 'Berechnetes Meniskusprofil h(r) & Verdunstung J(r)' : 'Calculated Meniscus Profile h(r) & Flux J(r)'}
                </span>
                <span className="text-amber-800">R = {deeganDropRadiusMm.toFixed(1)} mm</span>
              </div>
              <div className="h-32 w-full bg-white rounded-lg border border-stone-300 relative overflow-hidden flex items-end px-4 py-2">
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  {/* Paper plane */}
                  <line x1="0" y1="90" x2="400" y2="90" stroke="#d6d3d1" strokeWidth="3" />
                  {/* Dynamic Droplet Meniscus calculated from contact angle */}
                  <path
                    d={`M 40 90 Q 200 ${Math.max(15, 90 - deeganContactAngleDeg * 1.5)} 360 90`}
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                  {/* Evaporative flux vectors at rim */}
                  <line x1="55" y1="85" x2="55" y2="30" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 3" />
                  <line x1="345" y1="85" x2="345" y2="30" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 3" />
                  <line x1="200" y1="55" x2="200" y2="40" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                  {/* Pigment accumulation at rims */}
                  <circle cx="50" cy="88" r="6" fill="#78350f" />
                  <circle cx="350" cy="88" r="6" fill="#78350f" />
                  {/* Fluid flow arrows from center to rim */}
                  <path d="M 170 82 L 75 86" stroke="#1d4ed8" strokeWidth="2" markerEnd="url(#arrow)" />
                  <path d="M 230 82 L 325 86" stroke="#1d4ed8" strokeWidth="2" markerEnd="url(#arrow)" />
                </svg>
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                <span>Pinned Rim (J divergiert)</span>
                <span>Zentrum (Flüssigkeitsreservoir)</span>
                <span>Pinned Rim (J divergiert)</span>
              </div>
            </div>

            {/* Interactive Deegan Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50/70 rounded-xl border border-stone-200 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-700 font-medium">{lang === 'de' ? 'Kontaktwinkel θ_c:' : 'Contact Angle θ_c:'}</span>
                  <span className="font-mono font-bold text-stone-900">{deeganContactAngleDeg}°</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={deeganContactAngleDeg}
                  onChange={(e) => setDeeganContactAngleDeg(parseFloat(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-700 font-medium">{lang === 'de' ? 'Tropfenradius R:' : 'Droplet Radius R:'}</span>
                  <span className="font-mono font-bold text-stone-900">{deeganDropRadiusMm.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.5"
                  value={deeganDropRadiusMm}
                  onChange={(e) => setDeeganDropRadiusMm(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-5 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h4 className="font-mono font-bold text-amber-400 text-xs">
                Deegan (1997) & Hu-Larson (2002) Continuum Equations
              </h4>
              <div className="bg-stone-950 p-3 rounded-lg font-mono text-[11px] text-stone-300 leading-relaxed border border-stone-800 space-y-1.5">
                <p className="text-amber-300">// Diverging Evaporative Flux:</p>
                <p>J(r) = J₀ · (1 - r²/R²)^(-λ)</p>
                <p className="text-stone-400">λ(θ_c) = (π - 2θ_c) / (2π - 2θ_c)</p>
                <p className="mt-2 text-stone-400">// Outward Convective Velocity:</p>
                <p>v_r(r) = (1/ρrh) · ∫₀ʳ r' J(r') dr'</p>
                <p className="mt-2 text-stone-400">// Edge Deposition Mass Profile:</p>
                <p className="text-emerald-300">M_ring(r) ∝ (1 - r²/R²)^(-μ)</p>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {lang === 'de'
                  ? 'In unserem WebGL2-Fragment-Shader wird die kontinuierliche Strömung durch den räumlichen Feuchtigkeitsgradienten |∇ρ| approximiert: Randzellen erfahren eine (1 + c · |∇ρ|)-fache Pigmentablagerungsrate.'
                  : 'In our WebGL2 fragment shader, this continuous flow is approximated via the spatial moisture gradient |∇ρ|: rim cells receive a (1 + c · |∇ρ|)-boosted pigment deposition rate.'}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-800 text-[10px] font-mono text-stone-400">
              Deegan et al. (1997) Nature 389, 827 &bull; Hu & Larson (2002) J. Phys. Chem. B
            </div>
          </div>
        </div>
      )}


      {/* Tab 4: Paper Fiber Anisotropy & Fractional Brownian Motion */}
      {activeTab === 'fiber-anisotropy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                Porous Medium & Cellulose Fibers
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {lang === 'de' ? 'Papier-Architektur: Faser-Anisotropie & fBm-Zahn' : lang === 'es' ? 'Arquitectura del papel: anisotropía de fibra y grano fBm' : 'Paper Architecture: Fiber Anisotropy & fBm Tooth'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Papier ist keine flache Ebene, sondern ein verfilztes Netz aus Zellulosefasern. Das Papiermikrorelief ("Tooth") wird durch 4 Oktaven fraktioneller Brownscher Bewegung (fBm) generiert. Die Kapillardurchdringung (Darcy’s Law) breitet sich bevorzugt entlang der Faserlaufrichtung aus – dies erzeugt die charakteristischen, gezackten Ausfransungen japanischer Sumi-e-Kalligraphie auf Washi-Papier.'
                  : lang === 'es' ? 'El papel no es un plano 2D uniforme; es una matriz caótica de fibras de celulosa prensadas. La rugosidad de la superficie («grano») se genera con 4 octavas de movimiento browniano fraccionario (fBm). La percolación capilar (ley de Darcy) guía el fluido preferentemente a lo largo de la dirección de la fibra en lugar de en círculo, lo que produce el auténtico deshilachado sumi-e sobre papel washi.' : 'Paper is not a uniform 2D plane; it is a chaotic matrix of pressed cellulose fibers. Paper surface roughness ("tooth") is generated via 4 octaves of Fractional Brownian Motion (fBm). Capillary percolation (Darcy’s Law) routes fluid preferentially along the fiber grain vector rather than in a circle, producing authentic jagged sumi-e feathering on washi paper.'}
              </p>
            </div>

            {/* Fiber Vector Orientation Field */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-stone-800">
                  {lang === 'de' ? 'Anisotrope Leitfähigkeits-Ellipse T_ij' : lang === 'es' ? 'Tensor de permeabilidad anisótropa T_ij' : 'Anisotropic Permeability Tensor T_ij'}
                </span>
                <span className="text-amber-700 font-semibold">{selectedPaper.nameDe.split(' ')[0]}</span>
              </div>
              <div className="bg-stone-900 text-stone-200 p-4 rounded-lg font-mono text-[11px] leading-relaxed">
                <p className="text-emerald-400">T_ij = (1 - σ) · δ_ij + σ · (f_i · f_j)</p>
                <p className="text-stone-400 mt-1">
                  // Alignment = cos²(θ_flow - θ_fiber)
                </p>
                <p className="text-amber-300">
                  flux = (moist - nMoist) · speed · [(1 - σ) + σ · cos²(Δθ)]
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-serif font-bold text-stone-900 text-sm">{lang === 'de' ? 'Papiersorten im Vergleich' : lang === 'es' ? 'Comparación de tipos de papel' : 'Paper Presets Comparison'}</h4>
            <div className="space-y-2">
              {PAPER_PRESETS.map((p) => {
                const isSelected = selectedPaper.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPaper(p)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-stone-900">
                      <span>{p.nameDe}</span>
                      <span className="font-mono text-[10px] text-amber-700">σ = {p.fiberStrength}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-normal">{p.descriptionDe}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: GLSL Fragment Shaders Code Browser */}
      {activeTab === 'shaders' && (
        <div className="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-stone-100">
                {lang === 'de' ? 'Kompilierte WebGL2 Fragment-Shader' : lang === 'es' ? 'Fragment shaders WebGL2 compilados' : 'Compiled WebGL2 Fragment Shaders'}
              </h3>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'km', label: 'Kubelka-Munk Optik' },
                { id: 'advect', label: 'Navier-Stokes Advektion' },
                { id: 'capillary', label: 'Washburn & Darcy' },
                { id: 'coffee', label: 'Deegan Kaffeering' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveShaderTab(s.id as any)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    activeShaderTab === s.id
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                let code = FRAGMENT_SHADER_KUBELKA_MUNK;
                if (activeShaderTab === 'advect') code = FRAGMENT_SHADER_ADVECT;
                if (activeShaderTab === 'capillary') code = FRAGMENT_SHADER_CAPILLARY;
                if (activeShaderTab === 'coffee') code = FRAGMENT_SHADER_COFFEE_RING;
                handleCopy(code, 'active-shader');
              }}
              className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs rounded-lg flex items-center gap-1.5 backdrop-blur border border-stone-700"
            >
              {copiedCode === 'active-shader' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'active-shader' ? 'Copied' : 'Copy GLSL'}</span>
            </button>

            <pre className="bg-stone-900 p-4 rounded-xl font-mono text-[11px] text-stone-300 overflow-x-auto max-h-[480px] border border-stone-800 leading-relaxed">
              <code>
                {activeShaderTab === 'km' && FRAGMENT_SHADER_KUBELKA_MUNK}
                {activeShaderTab === 'advect' && FRAGMENT_SHADER_ADVECT}
                {activeShaderTab === 'capillary' && FRAGMENT_SHADER_CAPILLARY}
                {activeShaderTab === 'coffee' && FRAGMENT_SHADER_COFFEE_RING}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* Subtle Craftsmanship & Extended Architecture Footer */}
      <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-serif italic text-stone-400">
            {lang === 'de'
              ? 'Amélie Werkstatt-Modell (CC0 Public Domain)'
              : lang === 'es'
              ? 'Modelo de taller de Amélie (Dominio público CC0)'
              : 'Amélie Workshop Reference (CC0 Public Domain)'}
          </span>
        </div>
        <div className="text-stone-500 text-center sm:text-right">
          {lang === 'de'
            ? 'Für schlüsselfertige Editor-Plugins (TipTap, React, Obsidian) oder Pro-Integrationen: '
            : lang === 'es'
            ? 'Para plugins de editor (TipTap, React, Obsidian) o versión pro: '
            : 'For turnkey editor plugins (TipTap, React, Obsidian) or pro integrations: '}
          <a
            href="mailto:Felix@amelieproject.org?subject=Wet%20Ink%20Pro%20Integration"
            className="text-stone-400 hover:text-amber-400 font-medium underline underline-offset-2 transition-colors cursor-pointer"
          >
            Felix@amelieproject.org
          </a>
        </div>
      </div>
    </div>
  );
};

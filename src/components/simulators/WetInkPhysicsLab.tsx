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
  generatePaperMaps,
  WetInkPaperConfig,
  WetInkPigmentConfig,
  WetInkSimParams,
  SimulationLayer,
  WebGL2WetInkEngine,
  calculateKMReflectance,
  evaluatePigmentMixture,
  naiveRgbBlend,
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

  const [activeTab, setActiveTab] = useState<'simulation' | 'kubelka-munk' | 'coffee-ring' | 'fiber-anisotropy' | 'shaders'>('simulation');
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

  // Evaluate interactive Kubelka-Munk vs RGB blend
  const kmResult = evaluatePigmentMixture(
    [
      { km: selectedPigment1.km, concentration: ratioP1 },
      { km: selectedPigment2.km, concentration: 1 - ratioP1 },
    ],
    kmThickness
  );

  const rgbBlendResult = naiveRgbBlend(
    [selectedPigment1.r, selectedPigment1.g, selectedPigment1.b],
    ratioP1,
    [selectedPigment2.r, selectedPigment2.g, selectedPigment2.b],
    1 - ratioP1
  );

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
                : 'Physics Laboratory: Continuum Mechanics & WebGL2 Shaders'}
            </h2>
            <p className="text-sm text-stone-400 max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Wissenschaftliche Umsetzung von Navier-Stokes-Advektion, Washburn-Kapillardurchdringung in poröser Zellulose, Deegan-Kaffeering-Randschwärzung und Kubelka-Munk-Spektralglasuren auf der GPU.'
                : 'Scientific engineering of Navier-Stokes advection, Washburn capillary penetration in porous cellulose, Deegan coffee-ring edge darkening, and Kubelka-Munk spectral glazes on GPU.'}
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
            { id: 'simulation', label: lang === 'de' ? '1. GPU-Simulation' : '1. GPU Simulation', icon: Zap },
            { id: 'kubelka-munk', label: lang === 'de' ? '2. Kubelka-Munk Farbmischung' : '2. Kubelka-Munk Color Lab', icon: Sparkles },
            { id: 'coffee-ring', label: lang === 'de' ? '3. Deegan-Kaffeering-Effekt' : '3. Deegan Coffee-Ring', icon: Droplets },
            { id: 'fiber-anisotropy', label: lang === 'de' ? '4. Faser-Anisotropie & fBm' : '4. Fiber Anisotropy & fBm', icon: Wind },
            { id: 'shaders', label: lang === 'de' ? '5. GLSL-Shader-Code' : '5. GLSL Shader Source', icon: Code2 },
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  {lang === 'de' ? 'Echtzeit-WebGL2-Reaktionsbecken' : 'Real-time WebGL2 Reaction Basin'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleInjectDrop(0.35, 0.45, 1)}
                  className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-100 flex items-center gap-1.5"
                >
                  <Droplets className="w-3 h-3 text-amber-600" />
                  + {selectedPigment1.nameDe.split(' ')[0]}
                </button>
                <button
                  onClick={() => handleInjectDrop(0.65, 0.55, 2)}
                  className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1.5"
                >
                  <Droplets className="w-3 h-3 text-blue-600" />
                  + {selectedPigment2.nameDe.split(' ')[0]}
                </button>
                <button
                  onClick={handleClear}
                  className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg"
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
                className="w-full h-full object-contain cursor-crosshair"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  handleInjectDrop(x, y, 1);
                }}
              />
              <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur text-stone-200 text-[11px] px-3 py-1 rounded-full font-mono flex items-center gap-2 border border-stone-700/60">
                <span>{SIM_W}x{SIM_H} Ping-Pong FBO</span>
                <span>&bull;</span>
                <span className="text-emerald-400">WebGL2 Active</span>
              </div>
            </div>

            {/* Layer Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-medium text-stone-500">{lang === 'de' ? 'Shader-Layer:' : 'Shader Layer:'}</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'composite', label: lang === 'de' ? 'Kubelka-Munk Optik' : 'KM Composite' },
                  { id: 'moisture', label: lang === 'de' ? 'Kapillarfront' : 'Capillary Front' },
                  { id: 'pigment', label: lang === 'de' ? 'Pigment-Dichte' : 'Pigment Density' },
                  { id: 'paper', label: lang === 'de' ? 'Papier-Relief' : 'Paper Relief' },
                  { id: 'vectorField', label: lang === 'de' ? 'Geschwindigkeitsfeld' : 'Velocity Field' },
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
                {lang === 'de' ? 'Fluid-Parameter (GPU Uniforms)' : 'Fluid Uniforms'}
              </h4>

              {/* Capillary Speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600">{lang === 'de' ? 'Washburn-Kapillargeschwindigkeit:' : 'Washburn Capillary Rate:'}</span>
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
                  <span className="text-stone-600">{lang === 'de' ? 'Deegan-Kaffeering-Stärke:' : 'Deegan Coffee-Ring Factor:'}</span>
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
                  <div className="text-xs font-semibold text-stone-900">{lang === 'de' ? 'Kapillarschwellwert (ε_min)' : 'Capillary Threshold (ε_min)'}</div>
                  <div className="text-[11px] text-stone-500">{lang === 'de' ? 'Verhindert unphysikalische Rauchauflösung' : 'Prevents unphysical smoke-blur bug'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={params.enableCapillaryThreshold}
                  onChange={(e) => setParams({ ...params, enableCapillaryThreshold: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>
            </div>

            {/* Scientific Architecture Reference */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="font-bold text-stone-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-600" />
                {lang === 'de' ? 'Open-Source-Referenzarchitektur' : 'Open-Source Architecture'}
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {lang === 'de'
                  ? 'Inspiriert von PavelDoGreat/WebGL-Fluid-Simulation für eulerische Navier-Stokes-Vektorfelder und amandaghassaei/FluidSimulation für semi-lagrangesche Advektion mit poröser Darcy-Matrix.'
                  : 'Synthesized from PavelDoGreat/WebGL-Fluid-Simulation for Eulerian Navier-Stokes grids and amandaghassaei/FluidSimulation for semi-Lagrangian advection with porous Darcy flow.'}
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
                {lang === 'de' ? 'Kubelka-Munk vs. Naive RGB-Alpha-Mischung' : 'Kubelka-Munk vs. Naive RGB Alpha Blend'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Standard-RGB-Alpha-Blending mittelt Farbwerte linear im RGB-Farbraum. Beim Überlagern von Gelb und Blau entsteht ein schmutziges, aschiges Olivgrau. Das Kubelka-Munk-Modell löst reale Absorptions- (K) und Streukoeffizienten (S): Gelb absorbiert Blau, Blau absorbiert Rot/Gelb – das übrigbleibende Streulicht erzeugt ein leuchtendes, brillantes Smaragdgrün!'
                  : 'Standard RGB alpha-blending averages color channels linearly in digital space. Mixing yellow and blue yields dull, muddy olive-brown. The Kubelka-Munk differential model solves physical absorption (K) and scattering (S) spectra: yellow absorbs blue, blue absorbs red, and the remaining scattered light produces a vivid, radiant emerald green!'}
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
                  {lang === 'de' ? 'Brillantes physikalisches Smaragdgrün' : 'Luminous vibrant emerald green'}
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
                  {lang === 'de' ? 'Schmutziges, mattes Schlammoliv' : 'Muddy, dull desaturated brown'}
                </span>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-4 pt-3 border-t border-stone-200">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-stone-700">
                    {lang === 'de' ? 'Mischverhältnis: ' : 'Ratio: '}
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
                  <span className="font-medium text-stone-700">{lang === 'de' ? 'Farbschicht-Dicke (x):' : 'Glaze Thickness (x):'}</span>
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
                  <strong className="text-stone-200">K (Absorption):</strong> {lang === 'de' ? 'Wahrscheinlichkeit, dass ein Photon absorbiert wird.' : 'Probability that a photon is absorbed per unit depth.'}
                </p>
                <p>
                  <strong className="text-stone-200">S (Scattering):</strong> {lang === 'de' ? 'Wahrscheinlichkeit, dass ein Photon an Pigmentpartikeln zurückgestreut wird.' : 'Probability of backward photon scatter.'}
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

      {/* Tab 3: Robert Deegan (1997) Coffee-Ring Effect */}
      {activeTab === 'coffee-ring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                Robert Deegan et al. (Nature 1997)
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {lang === 'de' ? 'Der physikalische Kaffeering-Effekt (Edge Darkening)' : 'The Physical Coffee-Ring Effect (Edge Darkening)'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Wenn ein Tinten- oder Kaffeetropfen auf Papier trocknet, ist seine Kontaktlinie am Papier befestigt (Contact Line Pinning). Da der Rand viel dünner ist, verdunstet Wasser dort exponentiell schneller als im Zentrum. Um diese Wasserlücke zu füllen, strömt Flüssigkeit kontinuierlich von innen nach außen und transportiert schwebende Pigmentpartikel an den Rand.'
                  : 'When an ink droplet dries on paper, its perimeter is pinned by surface roughness. Because the meniscus is thinnest at the boundary, water evaporates exponentially faster at the rim than at the center. Fluid continuity forces an outward capillary rush of liquid from center to edge, carrying suspended pigment particles and depositing a dense dark perimeter.'}
              </p>
            </div>

            {/* Evaporation Cross-Section Diagram */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <span className="text-xs font-mono font-bold text-stone-700 uppercase">
                {lang === 'de' ? 'Querschnitt: Verdunstungsfluss J(r) & Randablagerung' : 'Cross-Section: Evaporative Flux J(r) & Rim Deposition'}
              </span>
              <div className="h-32 w-full bg-white rounded-lg border border-stone-300 relative overflow-hidden flex items-end px-4 py-2">
                {/* Droplet curve */}
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  {/* Paper plane */}
                  <line x1="0" y1="90" x2="400" y2="90" stroke="#d6d3d1" strokeWidth="3" />
                  {/* Droplet Meniscus */}
                  <path
                    d="M 50 90 Q 200 15 350 90"
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                  {/* Evaporation vectors at contact lines */}
                  <line x1="60" y1="85" x2="60" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
                  <line x1="340" y1="85" x2="340" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
                  <line x1="200" y1="52" x2="200" y2="35" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                  {/* Pigment accumulation at rims */}
                  <circle cx="58" cy="88" r="5" fill="#78350f" />
                  <circle cx="342" cy="88" r="5" fill="#78350f" />
                  {/* Inward-to-outward arrows */}
                  <path d="M 170 82 L 80 85" stroke="#1d4ed8" strokeWidth="2" markerEnd="url(#arrow)" />
                  <path d="M 230 82 L 320 85" stroke="#1d4ed8" strokeWidth="2" markerEnd="url(#arrow)" />
                </svg>
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                <span>Randschwärzung (Pinned Rim)</span>
                <span>Zentrum (Flüssigkeitsreservoir)</span>
                <span>Randschwärzung (Pinned Rim)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-5 rounded-xl space-y-4">
            <h4 className="font-mono font-bold text-amber-400 text-xs">
              Shader-Approximation: Pigment-Gradient ∇ρ
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === 'de'
                ? 'Die exakte thermische Strömungsgleichung ist in Echtzeit-WebGL2 zu rechenintensiv. Unser Fragment-Shader berechnet den lokalen Dichtegradienten |∇ρ| der Feuchtigkeitsgrenze. Die Pigmentabsorptionsrate wird mit (1 + c · |∇ρ|) multipliziert:'
                : 'Evaluating full conjugate heat transfer in WebGL2 is computationally prohibitive. Our fragment shader evaluates the spatial gradient |∇ρ| of the contact line. Pigment deposition is multiplied by (1 + c · |∇ρ|), enforcing rim darkening wherever expanding fluid boundaries halt.'}
            </p>
            <div className="bg-stone-950 p-3 rounded-lg font-mono text-[11px] text-stone-300 border border-stone-800 space-y-1">
              <p className="text-stone-500">// Coffee-Ring Contact Line Rim Darkening</p>
              <p>vec2 grad = vec2(wR - wL, wU - wD);</p>
              <p>float gradMag = length(grad);</p>
              <p className="text-amber-300">float rimDeposit = susp * (0.04 * factor * (1.0 + 3.0 * gradMag));</p>
              <p>susp -= rimDeposit;</p>
              <p>dep += rimDeposit * 1.5;</p>
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
                {lang === 'de' ? 'Papier-Architektur: Faser-Anisotropie & fBm-Zahn' : 'Paper Architecture: Fiber Anisotropy & fBm Tooth'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Papier ist keine flache Ebene, sondern ein verfilztes Netz aus Zellulosefasern. Das Papiermikrorelief ("Tooth") wird durch 4 Oktaven fraktioneller Brownscher Bewegung (fBm) generiert. Die Kapillardurchdringung (Darcy’s Law) breitet sich bevorzugt entlang der Faserlaufrichtung aus – dies erzeugt die charakteristischen, gezackten Ausfransungen japanischer Sumi-e-Kalligraphie auf Washi-Papier.'
                  : 'Paper is not a uniform 2D plane; it is a chaotic matrix of pressed cellulose fibers. Paper surface roughness ("tooth") is generated via 4 octaves of Fractional Brownian Motion (fBm). Capillary percolation (Darcy’s Law) routes fluid preferentially along the fiber grain vector rather than in a circle, producing authentic jagged sumi-e feathering on washi paper.'}
              </p>
            </div>

            {/* Fiber Vector Orientation Field */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-stone-800">
                  {lang === 'de' ? 'Anisotrope Leitfähigkeits-Ellipse T_ij' : 'Anisotropic Permeability Tensor T_ij'}
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
            <h4 className="font-serif font-bold text-stone-900 text-sm">{lang === 'de' ? 'Papiersorten im Vergleich' : 'Paper Presets Comparison'}</h4>
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
                {lang === 'de' ? 'Kompilierte WebGL2 Fragment-Shader' : 'Compiled WebGL2 Fragment Shaders'}
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
    </div>
  );
};

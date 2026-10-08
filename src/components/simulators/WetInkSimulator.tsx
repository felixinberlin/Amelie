import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Brush,
  PenTool,
  Droplets,
  RotateCcw,
  Trash2,
  Download,
  Play,
  Wind,
  Layers,
  Sparkles,
  Cpu,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Language } from '../../types';
import { WetInkPhysicsLab } from './WetInkPhysicsLab';
import {
  SimulationLayer,
  WetInkPaperConfig,
  WetInkPigmentConfig,
  WetInkSimParams,
} from '../../engine/wet-ink/types';
import { PAPER_PRESETS, PIGMENT_PRESETS, createPigmentFromHex } from '../../engine/wet-ink';
import { WetInkSimulation } from '../../engine/wet-ink/simulation';
import { generatePaperMaps } from '../../engine/wet-ink/paper';
import { WetInkBrushManager, BrushToolType } from '../../engine/wet-ink/brush';
import { PenAudioSynthesizer } from '../../engine/wet-ink/audio';
import { WetInkSVGExporter } from '../../engine/wet-ink/svgExport';

interface WetInkSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

const SIM_WIDTH = 384;
const SIM_HEIGHT = 256;

// Curated palette of authentic historical pigments
const PALETTE_PIGMENTS: WetInkPigmentConfig[] = [
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'sumi') || PIGMENT_PRESETS[0],
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'preussischblau') || PIGMENT_PRESETS[3],
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'koenigsblau') || PIGMENT_PRESETS[4],
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'indigo') || PIGMENT_PRESETS[0],
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'sepia') || PIGMENT_PRESETS[1],
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'zinnober') || PIGMENT_PRESETS[6],
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'krapplack') || PIGMENT_PRESETS[5],
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'kadmiumgelb') || PIGMENT_PRESETS[2],
  PIGMENT_PRESETS.find((p: WetInkPigmentConfig) => p.id === 'viridian') || PIGMENT_PRESETS[7],
];

// 2 Key distinct paper substrates: absorbent Washi vs crisp Sized
const ESSENTIAL_PAPERS: WetInkPaperConfig[] = [
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'washi') || PAPER_PRESETS[0],
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'kopierpapier') || PAPER_PRESETS[3],
];

export const WetInkSimulator: React.FC<WetInkSimulatorProps> = ({
  lang,
}) => {
  const [activeEngineMode, setActiveEngineMode] = useState<'webgl-lab' | 'atelier'>('webgl-lab');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<WetInkSimulation | null>(null);
  const brushManagerRef = useRef<WetInkBrushManager>(new WetInkBrushManager());
  const animFrameIdRef = useRef<number | null>(null);
  const autoStrokeTimerRef = useRef<number | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Core Tools: Brush (medium wet), Pen (fine crisp), Water (dilution & backruns)
  const [currentTool, setCurrentTool] = useState<BrushToolType>('sumi-brush');
  const [brushRadius, setBrushRadius] = useState<number>(6);

  // Substrate & Pigment
  const [selectedPaper, setSelectedPaper] = useState<WetInkPaperConfig>(ESSENTIAL_PAPERS[0]);
  const [selectedPigment, setSelectedPigment] = useState<WetInkPigmentConfig>(PALETTE_PIGMENTS[0]);
  const [customColorHex, setCustomColorHex] = useState<string>('#0c356a');

  // Physics: View mode, capillary bleed speed, board tilt
  const [viewMode, setViewMode] = useState<SimulationLayer>('composite');
  const [bleedSpeed, setBleedSpeed] = useState<number>(1.2);
  const [gravityTilt, setGravityTilt] = useState<'flat' | 'down' | 'left' | 'right'>('flat');

  // Status & Drawing State
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [isWet, setIsWet] = useState<boolean>(false);

  // Simulation Parameters
  const [params, setParams] = useState<WetInkSimParams>({
    capillaryThreshold: 0.14,
    enableCapillaryThreshold: true,
    capillarySpeed: 1.2,
    evaporationRate: 1.0,
    edgeDarkeningStrength: 1.3,
    granulationStrength: 1.1,
    backrunStrength: 1.0,
    dryBrushSensitivity: 1.0,
    tiltX: 0,
    tiltY: 0,
  });

  // Procedural Audio Synthesizer (Nib-on-Paper Friction)
  const audioSynthRef = useRef<PenAudioSynthesizer | null>(null);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    audioSynthRef.current = new PenAudioSynthesizer(soundMuted);
    return () => {
      audioSynthRef.current?.destroy();
      audioSynthRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    audioSynthRef.current?.setMuted(next);
  };

  // Init simulation engine once on mount
  const initSimulation = useCallback(() => {
    const paperMaps = generatePaperMaps(SIM_WIDTH, SIM_HEIGHT, selectedPaper, 42);
    const sim = new WetInkSimulation(
      SIM_WIDTH,
      SIM_HEIGHT,
      paperMaps,
      selectedPaper,
      selectedPigment,
      params
    );
    simRef.current = sim;
    setCanUndo(sim.canUndo());
  }, []);

  // Handle Paper Substrate change
  const handlePaperChange = (paper: WetInkPaperConfig) => {
    setSelectedPaper(paper);
    if (simRef.current) {
      const maps = generatePaperMaps(SIM_WIDTH, SIM_HEIGHT, paper, 42);
      simRef.current.setPaper(maps, paper);
    }
  };

  // Handle Pigment change: changes the ink formula without wiping artwork
  const handlePigmentChange = (pigment: WetInkPigmentConfig) => {
    setSelectedPigment(pigment);
    if (pigment.colorHex) setCustomColorHex(pigment.colorHex);
    if (simRef.current) {
      simRef.current.setPigment(pigment);
    }
  };

  // Handle custom color selection via native color input
  const handleCustomColorChange = (hex: string) => {
    setCustomColorHex(hex);
    const customPig = createPigmentFromHex(hex, 'custom', 'Eigene Tinte', 'Custom Ink');
    setSelectedPigment(customPig);
    if (simRef.current) {
      simRef.current.setPigment(customPig);
    }
  };

  // Handle Bleed Speed (Capillary diffusion rate)
  const handleBleedSpeedChange = (speed: number) => {
    setBleedSpeed(speed);
    setParams((prev) => {
      const next = { ...prev, capillarySpeed: speed };
      if (simRef.current) simRef.current.setParams(next);
      return next;
    });
  };

  // Handle Board Gravity Tilt
  const handleTiltChange = (tilt: 'flat' | 'down' | 'left' | 'right') => {
    setGravityTilt(tilt);
    let tiltX = 0;
    let tiltY = 0;
    if (tilt === 'down') tiltY = 0.5;
    if (tilt === 'left') tiltX = -0.5;
    if (tilt === 'right') tiltX = 0.5;

    setParams((prev) => {
      const next = { ...prev, tiltX, tiltY };
      if (simRef.current) simRef.current.setParams(next);
      return next;
    });
  };

  // Undo Stroke
  const handleUndo = () => {
    if (simRef.current && simRef.current.canUndo()) {
      simRef.current.undo();
      setCanUndo(simRef.current.canUndo());
    }
  };

  // Clear Paper Canvas
  const handleClear = () => {
    if (autoStrokeTimerRef.current) {
      clearInterval(autoStrokeTimerRef.current);
      autoStrokeTimerRef.current = null;
    }
    if (simRef.current) {
      simRef.current.clear();
      setCanUndo(simRef.current.canUndo());
      setIsWet(false);
    }
  };

  // Dry Layer: Instantly binds wet ink into paper fibers
  const handleDryNow = () => {
    if (simRef.current) {
      simRef.current.forceDry();
      setIsWet(false);
    }
  };

  // Blotting Paper: Absorbs surface moisture immediately while fixing settled pigment
  const handleBlot = () => {
    if (simRef.current) {
      simRef.current.waterFilm.fill(0);
      const dep = simRef.current.pigmentDeposited;
      const susp = simRef.current.pigmentSuspended;
      for (let i = 0; i < dep.length; i++) {
        dep[i] += susp[i];
        susp[i] = 0;
      }
      setIsWet(false);
    }
  };

  // Auto-stroke Demo (Ensō)
  const handleAutoDemo = () => {
    if (!simRef.current) return;
    simRef.current.pushSnapshot();
    setCanUndo(true);
    setIsWet(true);
    audioSynthRef.current?.startStroke(selectedPaper.roughness);

    const centerX = SIM_WIDTH * 0.5;
    const centerY = SIM_HEIGHT * 0.5;
    const radius = 62;
    let step = 0;
    const totalSteps = 48;

    if (autoStrokeTimerRef.current) {
      clearInterval(autoStrokeTimerRef.current);
    }

    autoStrokeTimerRef.current = window.setInterval(() => {
      if (!simRef.current) {
        if (autoStrokeTimerRef.current) clearInterval(autoStrokeTimerRef.current);
        audioSynthRef.current?.endStroke();
        return;
      }
      step++;
      const progress = step / totalSteps;
      const angle = progress * Math.PI * 1.88 - Math.PI * 0.45;
      const curR = radius + Math.sin(progress * 4) * 4;
      const x = centerX + Math.cos(angle) * curR;
      const y = centerY + Math.sin(angle) * (curR * 0.88);
      const pressure = 0.4 + Math.sin(progress * Math.PI) * 0.6;
      const dryBrush = progress > 0.8;

      audioSynthRef.current?.updateMotion(1.4, pressure);
      simRef.current.injectInk(x, y, 7 * pressure, 1.2, 1.0, dryBrush);

      if (step >= totalSteps) {
        if (autoStrokeTimerRef.current) clearInterval(autoStrokeTimerRef.current);
        autoStrokeTimerRef.current = null;
        audioSynthRef.current?.endStroke();
      }
    }, 22);
  };

  // Export Artwork as PNG
  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `wet-ink-${Date.now()}.png`;
    a.click();
  };

  // Export Artwork as Vector SVG (Marching Squares Multi-Iso)
  const handleExportSvg = () => {
    if (!simRef.current) return;
    const svg = WetInkSVGExporter.export(simRef.current, {
      colorHex: selectedPigment.colorHex,
      xmlDeclaration: true
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wet-ink-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Mount & init
  useEffect(() => {
    initSimulation();
  }, [initSimulation]);

  // Main Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(SIM_WIDTH, SIM_HEIGHT);

    let needsRender = true;

    const loop = () => {
      const sim = simRef.current;
      if (sim) {
        if (sim.totalWater > 0.005 || isDrawingRef.current) {
          sim.step(0.016);
          setIsWet(true);
          needsRender = true;
        } else {
          setIsWet(false);
        }

        if (needsRender) {
          sim.renderToImageData(imgData, viewMode, 2.4, 0.65);
          ctx.putImageData(imgData, 0, 0);
          if (sim.totalWater <= 0.005 && !isDrawingRef.current) {
            needsRender = false;
          }
        }
      }
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [viewMode]);

  // Pointer drawing handlers
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = SIM_WIDTH / rect.width;
    const scaleY = SIM_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;
    return { x, y, pressure };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    setIsDrawing(true);
    setIsWet(true);
    if (simRef.current) {
      simRef.current.pushSnapshot();
      setCanUndo(true);
    }
    const { x, y, pressure } = getCanvasCoords(e);
    lastPointerRef.current = { x, y, time: performance.now() };
    audioSynthRef.current?.startStroke(selectedPaper.roughness);

    if (simRef.current) {
      brushManagerRef.current.stroke(
        simRef.current,
        x,
        y,
        pressure,
        {
          tool: currentTool,
          baseRadius: brushRadius,
          waterRatio: currentTool === 'water-drop' ? 2.0 : 1.0,
          dryBrush: currentTool === 'sumi-brush',
        },
        true
      );
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !simRef.current) return;
    const { x, y, pressure } = getCanvasCoords(e);
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const dx = x - lastPointerRef.current.x;
    const dy = y - lastPointerRef.current.y;
    const velocity = Math.hypot(dx, dy) / dt;
    lastPointerRef.current = { x, y, time: now };

    audioSynthRef.current?.updateMotion(velocity, pressure);

    brushManagerRef.current.stroke(
      simRef.current,
      x,
      y,
      pressure,
      {
        tool: currentTool,
        baseRadius: brushRadius,
        waterRatio: currentTool === 'water-drop' ? 2.0 : 1.0,
        dryBrush: currentTool === 'sumi-brush',
      },
      false
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDrawingRef.current = false;
    setIsDrawing(false);
    audioSynthRef.current?.endStroke();
    brushManagerRef.current.endStroke();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Engine Switcher */}
      <div className="flex flex-wrap items-center justify-between p-2 rounded-2xl bg-stone-900 border border-stone-800 shadow-sm gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveEngineMode('webgl-lab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${
              activeEngineMode === 'webgl-lab'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{lang === 'de' ? 'WebGL2 Physik-Labor' : lang === 'es' ? 'Laboratorio de física WebGL2' : 'WebGL2 Physics Lab'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-900/30 text-current font-mono font-bold">
              GPU & KM
            </span>
          </button>
          <button
            onClick={() => setActiveEngineMode('atelier')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${
              activeEngineMode === 'atelier'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Brush className="w-4 h-4" />
            <span>{lang === 'de' ? 'Sumi-e Zeichenbrett' : lang === 'es' ? 'Lienzo de dibujo sumi-e' : 'Sumi-e Drawing Canvas'}</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-stone-400 px-2 hidden sm:inline">
          {activeEngineMode === 'webgl-lab'
            ? lang === 'de'
              ? 'Kubelka-Munk Spektren & Navier-Stokes Advektion'
              : lang === 'es' ? 'Espectros Kubelka-Munk y advección Navier-Stokes' : 'Kubelka-Munk spectra & Navier-Stokes advection'
            : lang === 'de'
            ? 'Freies Zeichnen mit Washi & Rußtusche'
            : lang === 'es' ? 'Dibujo libre con washi y tinta de hollín' : 'Free drawing with washi & soot ink'}
        </span>
      </div>

      {activeEngineMode === 'webgl-lab' ? (
        <WetInkPhysicsLab lang={lang} />
      ) : (
        <div className="space-y-4">
          {/* Clean Top Bar */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 sm:p-5 border border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-white tracking-tight">
                {lang === 'de' ? 'Tintenphysik-Simulation' : lang === 'es' ? 'Física de la tinta húmeda' : 'Wet Ink Physics'}
              </h2>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  isWet
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isWet ? 'bg-blue-400 animate-pulse' : 'bg-stone-500'
                  }`}
                />
                {isWet
                  ? lang === 'de'
                    ? 'Flüssig (diffundiert)'
                    : lang === 'es' ? 'Húmeda (difundiendo)' : 'Wet (diffusing)'
                  : lang === 'de'
                  ? 'Trocken'
                  : lang === 'es' ? 'Asentada' : 'Settled'}
              </span>
            </div>
            <p className="text-stone-400 text-xs">
              {lang === 'de'
                ? 'Echte Kapillardiffusion & Kaffeering-Kanten auf Papierfasern.'
                : lang === 'es' ? 'Difusión capilar real y bordes de anillo de café a través de las fibras de celulosa.' : 'Real capillary diffusion & coffee-ring edges through cellulose fibers.'}
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              !soundMuted
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-400 border-stone-700'
            }`}
            title={soundMuted ? (lang === 'de' ? 'Ton aktivieren' : 'Enable Nib Sound') : (lang === 'de' ? 'Ton stummschalten' : 'Mute Sound')}
          >
            {!soundMuted ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>

          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              canUndo
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700 cursor-pointer'
                : 'bg-stone-900/50 text-stone-600 border-stone-800 cursor-not-allowed'
            }`}
            title={lang === 'de' ? 'Rückgängig' : lang === 'es' ? 'Deshacer' : 'Undo'}
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={handleBlot}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
            title={lang === 'de' ? 'Löschpapier: Saugt Oberflächenwasser sofort ab' : lang === 'es' ? 'Papel secante: absorbe agua inmediatamente' : 'Blotting Paper: Absorbs surface moisture immediately'}
          >
            <span>🧻</span>
            <span>{lang === 'de' ? 'Löschpapier' : lang === 'es' ? 'Papel secante' : 'Blot'}</span>
          </button>

          <button
            onClick={handleDryNow}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
            title={
              lang === 'de'
                ? 'Trocknet nasse Tinte sofort (Schicht fixieren)'
                : lang === 'es' ? 'Seca al instante la tinta húmeda (capa de fijación)' : 'Instantly dries wet ink (Fix layer)'
            }
          >
            <Wind className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'de' ? 'Trocknen' : lang === 'es' ? 'Secar ahora' : 'Dry Now'}</span>
          </button>

          <button
            onClick={handleAutoDemo}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            title={lang === 'de' ? 'Ensō-Teststrich zeichnen' : lang === 'es' ? 'Dibujar trazo de prueba' : 'Draw test stroke'}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{lang === 'de' ? 'Demo-Strich' : lang === 'es' ? 'Trazo de prueba' : 'Test Stroke'}</span>
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs transition-colors cursor-pointer"
            title={lang === 'de' ? 'Leeren' : lang === 'es' ? 'Borrar lienzo' : 'Clear canvas'}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>

          <button
            onClick={handleExportPng}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
            title={lang === 'de' ? 'Als PNG speichern' : lang === 'es' ? 'Guardar PNG' : 'Save PNG'}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[10px] font-bold">PNG</span>
          </button>

          <button
            onClick={handleExportSvg}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
            title={lang === 'de' ? 'Als Vektor-SVG exportieren' : lang === 'es' ? 'Exportar SVG vectorial' : 'Export Vector SVG'}
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-[10px] font-bold">SVG</span>
          </button>
        </div>
      </div>

      {/* Main Artboard Canvas */}
      <div className="bg-[#f5f2e9] rounded-2xl border border-stone-300 p-3 sm:p-4 shadow-sm">
        <div className="relative w-full overflow-hidden rounded-xl border border-stone-300 shadow-inner bg-[#faf7ee]">
          <canvas
            ref={canvasRef}
            width={SIM_WIDTH}
            height={SIM_HEIGHT}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-auto block cursor-crosshair touch-none select-none"
          />

          {/* View toggle badge in corner */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-stone-900/80 backdrop-blur-xs p-1 rounded-lg border border-stone-700/60 shadow-xs">
            <button
              onClick={() => setViewMode('composite')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                viewMode === 'composite'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {lang === 'de' ? 'Tinte & Papier' : lang === 'es' ? 'Tinta y papel' : 'Ink & Paper'}
            </button>
            <button
              onClick={() => setViewMode('moisture')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'moisture'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Droplets className="w-3 h-3 text-blue-300" />
              <span>{lang === 'de' ? 'Wasserfront' : lang === 'es' ? 'Frente de agua' : 'Water Front'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Essential Working Controls (Grid layout) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        {/* 1. Drawing Tool & Size */}
        <div className="space-y-3">
          <label className="block font-bold text-stone-700 uppercase tracking-wider text-[11px] font-mono">
            1. {lang === 'de' ? 'Werkzeug' : lang === 'es' ? 'Herramienta' : 'Tool'}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setCurrentTool('sumi-brush')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentTool === 'sumi-brush'
                  ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <Brush className="w-4 h-4 mx-auto mb-1" />
              <span>{lang === 'de' ? 'Pinsel' : lang === 'es' ? 'Pincel' : 'Brush'}</span>
            </button>

            <button
              onClick={() => setCurrentTool('fountain-pen')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentTool === 'fountain-pen'
                  ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <PenTool className="w-4 h-4 mx-auto mb-1" />
              <span>{lang === 'de' ? 'Feder' : lang === 'es' ? 'Plumilla' : 'Fine Pen'}</span>
            </button>

            <button
              onClick={() => setCurrentTool('water-drop')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentTool === 'water-drop'
                  ? 'border-blue-700 bg-blue-700 text-white font-bold shadow-xs'
                  : 'border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-900'
              }`}
            >
              <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <span>{lang === 'de' ? 'Wasser' : lang === 'es' ? 'Agua' : 'Water'}</span>
            </button>
          </div>

          <div>
            <div className="flex justify-between text-stone-600 mb-1">
              <span>{lang === 'de' ? 'Größe' : lang === 'es' ? 'Tamaño del pincel' : 'Brush Size'}:</span>
              <span className="font-mono font-bold">{brushRadius} px</span>
            </div>
            <input
              type="range"
              min="2"
              max="18"
              step="1"
              value={brushRadius}
              onChange={(e) => setBrushRadius(parseInt(e.target.value, 10))}
              className="w-full accent-amber-700 cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Ink & Paper Substrate */}
        <div className="space-y-3">
          <label className="block font-bold text-stone-700 uppercase tracking-wider text-[11px] font-mono">
            2. {lang === 'de' ? 'Farbe & Papier' : lang === 'es' ? 'Tinta y papel' : 'Ink & Paper'}
          </label>

          {/* Historical Pigments & Interactive Color Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-500 font-mono">
                {lang === 'de' ? 'Pigment-Rezeptur' : lang === 'es' ? 'Fórmula del pigmento' : 'Pigment Formula'}
              </span>
              <label className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200/80 px-2 py-0.5 rounded-lg border border-stone-200 cursor-pointer transition-colors" title={lang === 'de' ? 'Farbe frei wählen' : 'Choose custom color'}>
                <input
                  type="color"
                  value={selectedPigment.colorHex || customColorHex}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-4 h-4 rounded border-0 p-0 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-[10px] text-stone-600 font-bold uppercase">
                  {selectedPigment.colorHex || customColorHex}
                </span>
              </label>
            </div>

            {/* Quick Palette Chips */}
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
              {PALETTE_PIGMENTS.map((pig) => {
                const isSelected = selectedPigment.id === pig.id || selectedPigment.colorHex === pig.colorHex;
                return (
                  <button
                    key={pig.id}
                    onClick={() => handlePigmentChange(pig)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 bg-stone-100 font-bold ring-2 ring-stone-900 shadow-xs scale-105'
                        : 'border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                    title={lang === 'de' ? pig.nameDe : pig.nameEn}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/25 shadow-2xs shrink-0"
                      style={{ backgroundColor: pig.colorHex }}
                    />
                    <span className="text-[9px] text-stone-700 truncate w-full text-center leading-tight">
                      {pig.id === 'sumi'
                        ? 'Sumi'
                        : pig.id === 'preussischblau'
                        ? 'Preußisch'
                        : pig.id === 'koenigsblau'
                        ? 'Königsb.'
                        : pig.id === 'indigo'
                        ? 'Indigo'
                        : pig.id === 'sepia'
                        ? 'Sepia'
                        : pig.id === 'zinnober'
                        ? 'Zinnober'
                        : pig.id === 'krapplack'
                        ? 'Krapp'
                        : pig.id === 'kadmiumgelb'
                        ? 'Gelb'
                        : 'Viridian'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2 Essential Papers: Absorbent Washi vs Sized Smooth */}
          <div className="grid grid-cols-2 gap-2">
            {ESSENTIAL_PAPERS.map((paper) => {
              const isSelected = selectedPaper.id === paper.id;
              return (
                <button
                  key={paper.id}
                  onClick={() => handlePaperChange(paper)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-900 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-900 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-semibold text-xs">
                    {paper.id === 'washi'
                      ? lang === 'de'
                        ? 'Washi (Saugfähig)'
                        : lang === 'es' ? 'Washi (mucho sangrado)' : 'Washi (High Bleed)'
                      : lang === 'de'
                      ? 'Geleimt (Glatt)'
                      : lang === 'es' ? 'Encolado (poco sangrado)' : 'Sized (Low Bleed)'}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {paper.id === 'washi'
                      ? lang === 'de'
                        ? 'Starker Kapillar-Wick'
                        : lang === 'es' ? 'Fuerte absorción por la fibra' : 'Strong fiber wicking'
                      : lang === 'de'
                      ? 'Scharfe Ränder'
                      : lang === 'es' ? 'Bordes nítidos' : 'Sharp crisp edges'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Real Physics Simulation Controls */}
        <div className="space-y-3">
          <label className="block font-bold text-stone-700 uppercase tracking-wider text-[11px] font-mono">
            3. {lang === 'de' ? 'Physik-Parameter' : lang === 'es' ? 'Simulación física' : 'Physics Simulation'}
          </label>

          {/* Capillary Bleed Rate */}
          <div>
            <div className="flex justify-between text-stone-600 mb-1">
              <span>{lang === 'de' ? 'Kapillares Ausbluten' : lang === 'es' ? 'Sangrado capilar' : 'Capillary Bleed'}:</span>
              <span className="font-mono font-bold">{bleedSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.4"
              step="0.1"
              value={bleedSpeed}
              onChange={(e) => handleBleedSpeedChange(parseFloat(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
          </div>

          {/* Board Gravity Tilt */}
          <div>
            <div className="text-stone-600 mb-1.5 flex justify-between">
              <span>{lang === 'de' ? 'Schwerkraft-Neigung' : lang === 'es' ? 'Inclinación del tablero' : 'Board Gravity Tilt'}:</span>
              <span className="font-mono text-stone-500 font-bold capitalize">{gravityTilt}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => handleTiltChange('flat')}
                className={`py-1 px-1 rounded-lg border text-center transition-colors cursor-pointer ${
                  gravityTilt === 'flat'
                    ? 'bg-stone-900 text-white border-stone-900 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
                title={lang === 'de' ? 'Flach (keine Schwerkraft)' : lang === 'es' ? 'Plano (sin gravedad)' : 'Flat (no gravity)'}
              >
                0°
              </button>
              <button
                onClick={() => handleTiltChange('down')}
                className={`py-1 px-1 rounded-lg border text-center transition-colors cursor-pointer ${
                  gravityTilt === 'down'
                    ? 'bg-stone-900 text-white border-stone-900 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
                title={lang === 'de' ? 'Nach unten fließen' : lang === 'es' ? 'Inclinar hacia abajo' : 'Tilt downward'}
              >
                ↓
              </button>
              <button
                onClick={() => handleTiltChange('left')}
                className={`py-1 px-1 rounded-lg border text-center transition-colors cursor-pointer ${
                  gravityTilt === 'left'
                    ? 'bg-stone-900 text-white border-stone-900 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
                title={lang === 'de' ? 'Nach links fließen' : lang === 'es' ? 'Inclinar a la izquierda' : 'Tilt left'}
              >
                ←
              </button>
              <button
                onClick={() => handleTiltChange('right')}
                className={`py-1 px-1 rounded-lg border text-center transition-colors cursor-pointer ${
                  gravityTilt === 'right'
                    ? 'bg-stone-900 text-white border-stone-900 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
                title={lang === 'de' ? 'Nach rechts fließen' : lang === 'es' ? 'Inclinar a la derecha' : 'Tilt right'}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Craftsmanship & Extended Architecture Footer */}
      <div className="pt-3 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-serif italic text-stone-600">
            {lang === 'de'
              ? 'Amélie Werkstatt-Modell (CC0 Public Domain)'
              : lang === 'es'
              ? 'Modelo de taller de Amélie (Dominio público CC0)'
              : 'Amélie Workshop Reference (CC0 Public Domain)'}
          </span>
        </div>
        <div className="text-stone-400 text-center sm:text-right">
          {lang === 'de'
            ? 'Für schlüsselfertige Editor-Plugins (TipTap, React, Obsidian) oder Pro-Integrationen: '
            : lang === 'es'
            ? 'Para plugins de editor (TipTap, React, Obsidian) o versión pro: '
            : 'For turnkey editor plugins (TipTap, React, Obsidian) or pro integrations: '}
          <a
            href="mailto:Felix@amelieproject.org?subject=Wet%20Ink%20Pro%20Integration"
            className="text-stone-600 hover:text-amber-800 font-medium underline underline-offset-2 transition-colors cursor-pointer"
          >
            Felix@amelieproject.org
          </a>
        </div>
      </div>
      </div>
      )}
    </div>
  );
};

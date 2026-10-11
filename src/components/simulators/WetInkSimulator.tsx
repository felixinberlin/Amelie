import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Brush,
  PenTool,
  Droplets,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Play,
  Wind,
  Layers,
  Sparkles,
  Cpu,
  Volume2,
  VolumeX,
  Stamp,
  Grid,
  ChevronDown,
  Palette,
} from 'lucide-react';
import { Language } from '../../types';
import { WetInkPhysicsLab } from './WetInkPhysicsLab';
import { WetInkColorSelector } from './WetInkColorSelector';
import {
  SimulationLayer,
  WetInkPaperConfig,
  WetInkPigmentConfig,
  WetInkSimParams,
  SealStyle,
  SealShape,
  SealGlyph,
  BrushTipShape,
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

// Xuan Calligraphy Substrates (宣纸三品)
const XUAN_PAPERS: WetInkPaperConfig[] = [
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'sheng-xuan') || PAPER_PRESETS[0],
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'ban-shu-xuan') || PAPER_PRESETS[0],
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'shu-xuan') || PAPER_PRESETS[0],
];

// Classical Papers
const CLASSIC_PAPERS: WetInkPaperConfig[] = [
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'washi') || PAPER_PRESETS[0],
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'buetten') || PAPER_PRESETS[2],
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'aquarell-rau') || PAPER_PRESETS[1],
  PAPER_PRESETS.find((p: WetInkPaperConfig) => p.id === 'kopierpapier') || PAPER_PRESETS[3],
];

const ESSENTIAL_PAPERS: WetInkPaperConfig[] = [
  ...XUAN_PAPERS,
  ...CLASSIC_PAPERS,
];

// Classical Ink Dilution Shades (墨分五色 - The Five Shades of Ink)
interface InkShade {
  id: string;
  nameZh: string;
  nameDe: string;
  nameEn: string;
  descDe: string;
  descEn: string;
  ratio: number;
  previewColor: string;
}

const FIVE_SHADES_OF_INK: InkShade[] = [
  { id: 'jiao', nameZh: '焦', nameDe: 'Tiefschwarz (Jiāo)', nameEn: 'Scorched (Jiāo)', descDe: 'Trocken, pechschwarz, Feibai-Riss', descEn: 'Dry, pitch-black, Feibai dry brush', ratio: 0.35, previewColor: '#0c0c0c' },
  { id: 'nong', nameZh: '浓', nameDe: 'Sattdunkel (Nóng)', nameEn: 'Dense (Nóng)', descDe: 'Dicht, intensiv, Hauptstrich', descEn: 'Thick, saturated dark, main stroke', ratio: 0.65, previewColor: '#222222' },
  { id: 'zhong', nameZh: '重', nameDe: 'Standard (Zhòng)', nameEn: 'Balanced (Zhòng)', descDe: 'Klassisch, fließend, ausgewogen', descEn: 'Classic, balanced everyday ink', ratio: 1.0, previewColor: '#454545' },
  { id: 'dan', nameZh: '淡', nameDe: 'Lasierend (Dàn)', nameEn: 'Light Wash (Dàn)', descDe: 'Hell, transparent, Ferne Berge', descEn: 'Translucent wash, distant hills', ratio: 1.8, previewColor: '#828282' },
  { id: 'qing', nameZh: '清', nameDe: 'Flüchtig (Qīng)', nameEn: 'Whisper (Qīng)', descDe: 'Zarter Nebelhauch, Wasserreflex', descEn: 'Faint mist wash, subtle reflection', ratio: 2.8, previewColor: '#bebebe' },
];

// Brush Tip Footprint Presets (Pinsel-Formen / 毛笔与画笔形制)
interface TipShapePreset {
  id: BrushTipShape;
  icon: string;
  nameDe: string;
  nameEn: string;
  zh: string;
  descDe: string;
  descEn: string;
}

const BRUSH_TIP_SHAPES: TipShapePreset[] = [
  { id: 'round', icon: '●', nameDe: 'Rund', nameEn: 'Round', zh: '中锋', descDe: 'Zentrierte Spitze, allseitig weicher Meniskus (Zhongfeng)', descEn: 'Centered pointed tip, isotropic soft meniscus' },
  { id: 'flat', icon: '▬', nameDe: 'Flach', nameEn: 'Flat', zh: '排笔', descDe: 'Breiter Flachpinsel, 45°-Kalligrafieband (Paibi)', descEn: 'Wide chisel ribbon, 45° calligraphic modulation' },
  { id: 'slanted', icon: '▰', nameDe: 'Schräg', nameEn: 'Chisel', zh: '侧锋', descDe: 'Asymmetrische Schneidkante mit weicher Flanke (Cefeng)', descEn: 'Asymmetric cutting edge with feathered flank' },
  { id: 'fan', icon: '彡', nameDe: 'Fächer', nameEn: 'Fan', zh: '散笔', descDe: 'Geteilte Borstenbündel, natürliche Maserung (Kuabi)', descEn: 'Split bristle clusters, natural hair/grain striations' },
  { id: 'dagger', icon: '🗡', nameDe: 'Schwert', nameEn: 'Dagger', zh: '竹叶', descDe: 'Tropfenförmige Klinge für Bambusblätter und Farne', descEn: 'Tapered aerodynamic leaf tip for bamboo & botanicals' },
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

  // Core Tools: Brush (medium wet), Pen (fine crisp), Water (dilution & backruns), Calligraphy, Seal
  const [currentTool, setCurrentTool] = useState<BrushToolType>('sumi-brush');
  const [brushRadius, setBrushRadius] = useState<number>(6);
  const [brushTipShape, setBrushTipShape] = useState<BrushTipShape>('round');

  // Calligraphy Grid & Didactics (米字格, 九宫格, 永字八法)
  const [calligraphyGrid, setCalligraphyGrid] = useState<'none' | 'mizige' | 'jiugongge' | 'yongzi'>('none');

  // Seal Stamp Settings (朱砂篆刻印章)
  const [sealStyle, setSealStyle] = useState<SealStyle>('zhuwen');
  const [sealShape, setSealShape] = useState<SealShape>('square');
  const [sealGlyph, setSealGlyph] = useState<SealGlyph>('amelie');
  const [sealSize, setSealSize] = useState<number>(32);

  // Substrate & Pigment
  const [paperCategory, setPaperCategory] = useState<'xuan' | 'classic'>('xuan');
  const [selectedPaper, setSelectedPaper] = useState<WetInkPaperConfig>(XUAN_PAPERS[0] || ESSENTIAL_PAPERS[0]);
  const [selectedPigment, setSelectedPigment] = useState<WetInkPigmentConfig>(PALETTE_PIGMENTS[0]);
  const [previousPigment, setPreviousPigment] = useState<WetInkPigmentConfig | null>(null);
  const [recentPigments, setRecentPigments] = useState<WetInkPigmentConfig[]>([
    PIGMENT_PRESETS[0], // Sumi
    PIGMENT_PRESETS[3], // Preußischblau
    PIGMENT_PRESETS[2], // Kadmiumgelb
    PIGMENT_PRESETS[6], // Zinnoberrot
    PIGMENT_PRESETS[5], // Krapplack
    PIGMENT_PRESETS[7], // Viridian
  ]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  const [customColorHex, setCustomColorHex] = useState<string>('#0c356a');

  // Physics: View mode, capillary bleed speed, board tilt
  const [viewMode, setViewMode] = useState<SimulationLayer>('composite');
  const [bleedSpeed, setBleedSpeed] = useState<number>(1.2);
  const [gravityTilt, setGravityTilt] = useState<'flat' | 'down' | 'left' | 'right'>('flat');

  // Status & Drawing State
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [isWet, setIsWet] = useState<boolean>(false);
  const [inkDilution, setInkDilution] = useState<number>(1.0);

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
    setCanRedo(sim.canRedo());
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
    if (pigment.id !== selectedPigment.id || pigment.colorHex !== selectedPigment.colorHex) {
      setPreviousPigment(selectedPigment);
      setRecentPigments((prev) => {
        const filtered = prev.filter((p) => p.id !== pigment.id && p.colorHex !== pigment.colorHex);
        return [pigment, ...filtered].slice(0, 8);
      });
    }
    setSelectedPigment(pigment);
    if (pigment.colorHex) setCustomColorHex(pigment.colorHex);
    if (simRef.current) {
      simRef.current.setPigment(pigment);
    }
  };

  // Handle custom color selection via native color input or HSL
  const handleCustomColorChange = (hex: string) => {
    setCustomColorHex(hex);
    const customPig = createPigmentFromHex(
      hex,
      'custom',
      lang === 'de' ? `Eigene Tinte (${hex})` : `Custom Ink (${hex})`,
      lang === 'de' ? `Eigene Tinte (${hex})` : `Custom Ink (${hex})`
    );
    handlePigmentChange(customPig);
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
  const handleUndo = useCallback(() => {
    if (simRef.current && simRef.current.canUndo()) {
      simRef.current.undo();
      setCanUndo(simRef.current.canUndo());
      setCanRedo(simRef.current.canRedo());
    }
  }, []);

  // Redo Stroke
  const handleRedo = useCallback(() => {
    if (simRef.current && simRef.current.canRedo()) {
      simRef.current.redo();
      setCanUndo(simRef.current.canUndo());
      setCanRedo(simRef.current.canRedo());
    }
  }, []);

  // Keyboard Shortcuts for Undo & Redo (Ctrl+Z / Ctrl+Y / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        ((e.shiftKey && e.key.toLowerCase() === 'z') || e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Clear Paper Canvas
  const handleClear = () => {
    if (autoStrokeTimerRef.current) {
      clearInterval(autoStrokeTimerRef.current);
      autoStrokeTimerRef.current = null;
    }
    if (simRef.current) {
      simRef.current.clear();
      setCanUndo(simRef.current.canUndo());
      setCanRedo(simRef.current.canRedo());
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
      simRef.current.blot();
      setIsWet(false);
    }
  };

  // Expressive Capillary Bleeding (Yunran 晕染 / Po Mo 破墨): Instant blooming along cellulose fibers
  const handleBleedNow = () => {
    if (simRef.current) {
      simRef.current.pulseBleed(2.2);
      setIsWet(true);
    }
  };

  // Auto-stroke Demo (Ensō)
  const handleAutoDemo = () => {
    if (!simRef.current) return;
    simRef.current.pushSnapshot();
    setCanUndo(true);
    setCanRedo(false);
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
    const { x, y, pressure } = getCanvasCoords(e);

    // Stamping Mode: single tactile seal impression
    if (currentTool === 'seal-stamp') {
      if (simRef.current) {
        simRef.current.pushSnapshot();
        setCanUndo(true);
        setCanRedo(false);
        setIsWet(true);
        simRef.current.injectSeal(x, y, {
          size: sealSize,
          style: sealStyle,
          shape: sealShape,
          glyph: sealGlyph,
          chippedEdge: true,
        });
        audioSynthRef.current?.playStampThud();
      }
      return;
    }

    isDrawingRef.current = true;
    setIsDrawing(true);
    setIsWet(true);
    if (simRef.current) {
      simRef.current.pushSnapshot();
      setCanUndo(true);
      setCanRedo(false);
    }
    lastPointerRef.current = { x, y, time: performance.now() };
    audioSynthRef.current?.startStroke(selectedPaper.roughness);

    if (simRef.current) {
      const isCalligraphyBrush =
        currentTool === 'sumi-brush' ||
        currentTool === 'langhao' ||
        currentTool === 'yanghao' ||
        currentTool === 'jianhao';

      brushManagerRef.current.stroke(
        simRef.current,
        x,
        y,
        pressure,
        {
          tool: currentTool,
          baseRadius: brushRadius,
          waterRatio: currentTool === 'water-drop' ? 2.5 : inkDilution,
          dryBrush: isCalligraphyBrush,
          tipShape: brushTipShape,
        },
        true,
        e.timeStamp || performance.now(),
        selectedPigment
      );
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !simRef.current || currentTool === 'seal-stamp') return;
    const { x, y, pressure } = getCanvasCoords(e);
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const dx = x - lastPointerRef.current.x;
    const dy = y - lastPointerRef.current.y;
    const velocity = Math.hypot(dx, dy) / dt;
    lastPointerRef.current = { x, y, time: now };

    audioSynthRef.current?.updateMotion(velocity, pressure);

    const isCalligraphyBrush =
      currentTool === 'sumi-brush' ||
      currentTool === 'langhao' ||
      currentTool === 'yanghao' ||
      currentTool === 'jianhao';

    brushManagerRef.current.stroke(
      simRef.current,
      x,
      y,
      pressure,
      {
        tool: currentTool,
        baseRadius: brushRadius,
        waterRatio: currentTool === 'water-drop' ? 2.5 : inkDilution,
        dryBrush: isCalligraphyBrush,
        tipShape: brushTipShape,
      },
      false,
      now,
      selectedPigment
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
          {/* Active Ink Well / Palette Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              className="px-2.5 py-1.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700 shadow-sm"
              title={lang === 'de' ? 'Farbwähler öffnen' : 'Open Color Palette'}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs shrink-0 ring-1 ring-white/20"
                style={{ backgroundColor: selectedPigment.colorHex || '#1c1b18' }}
              />
              <span className="font-mono text-[11px] font-bold">
                {selectedPigment.colorHex ? selectedPigment.colorHex.toUpperCase() : '#1C1B18'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isColorPickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Popover Color Selector Dropdown */}
            {isColorPickerOpen && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <WetInkColorSelector
                  selectedPigment={selectedPigment}
                  onSelectPigment={(pig) => {
                    handlePigmentChange(pig);
                  }}
                  lang={lang}
                  recentPigments={recentPigments}
                  previousPigment={previousPigment}
                  variant="popover"
                  isOpen={isColorPickerOpen}
                  onClose={() => setIsColorPickerOpen(false)}
                />
              </div>
            )}
          </div>

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
            title={lang === 'de' ? 'Rückgängig (Strg+Z)' : lang === 'es' ? 'Deshacer (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              canRedo
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700 cursor-pointer'
                : 'bg-stone-900/50 text-stone-600 border-stone-800 cursor-not-allowed'
            }`}
            title={lang === 'de' ? 'Wiederholen (Strg+Y)' : lang === 'es' ? 'Rehacer (Ctrl+Y)' : 'Redo (Ctrl+Y)'}
          >
            <RotateCw className="w-4 h-4 text-amber-400" />
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
            onClick={handleBleedNow}
            className="px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 border border-blue-700/60 text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            title={
              lang === 'de'
                ? 'Ausbluten lassen: Löst expressive Kapillarblüte (Yunran 晕染) entlang der Fasern aus'
                : lang === 'es'
                ? 'Dejar sangrar: desencadena floración capilar expresiva (Yunran)'
                : 'Let the ink bleed: Triggers expressive capillary blooming (Yunran) along paper fibers'
            }
          >
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'de' ? 'Bluten' : lang === 'es' ? 'Sangrar' : 'Bleed'}</span>
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

          {/* Calligraphy Training Grids (米字格, 九宫格, 永字八法) */}
          {calligraphyGrid !== 'none' && (
            <svg
              viewBox="0 0 384 256"
              className="absolute inset-0 pointer-events-none w-full h-full select-none"
            >
              {calligraphyGrid === 'mizige' && (
                <g stroke="#b92c18">
                  {/* Outer border */}
                  <rect x="84" y="20" width="216" height="216" fill="none" strokeWidth="1.2" strokeOpacity="0.40" />
                  {/* Cardinal axes */}
                  <line x1="84" y1="128" x2="300" y2="128" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.32" />
                  <line x1="192" y1="20" x2="192" y2="236" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.32" />
                  {/* Diagonals */}
                  <line x1="84" y1="20" x2="300" y2="236" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.25" />
                  <line x1="84" y1="236" x2="300" y2="20" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.25" />
                </g>
              )}
              {calligraphyGrid === 'jiugongge' && (
                <g stroke="#b92c18">
                  <rect x="84" y="20" width="216" height="216" fill="none" strokeWidth="1.2" strokeOpacity="0.40" />
                  <line x1="156" y1="20" x2="156" y2="236" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.32" />
                  <line x1="228" y1="20" x2="228" y2="236" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.32" />
                  <line x1="84" y1="92" x2="300" y2="92" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.32" />
                  <line x1="84" y1="164" x2="300" y2="164" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.32" />
                  {/* Center Zhonggong emphasis */}
                  <rect x="156" y="92" width="72" height="72" fill="#b92c18" fillOpacity="0.03" stroke="none" />
                </g>
              )}
              {calligraphyGrid === 'yongzi' && (
                <g stroke="#b92c18">
                  {/* Mi Zi Ge background */}
                  <rect x="84" y="20" width="216" height="216" fill="none" strokeWidth="1.2" strokeOpacity="0.40" />
                  <line x1="84" y1="128" x2="300" y2="128" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.28" />
                  <line x1="192" y1="20" x2="192" y2="236" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.28" />
                  <line x1="84" y1="20" x2="300" y2="236" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.20" />
                  <line x1="84" y1="236" x2="300" y2="20" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.20" />

                  {/* Classical watermark template of 永 (Yong) */}
                  <text
                    x="192"
                    y="178"
                    textAnchor="middle"
                    fontSize="148"
                    fontFamily="'Kaiti', 'STKaiti', 'KaiTi', 'Noto Serif SC', serif"
                    fill="#b92c18"
                    fillOpacity="0.14"
                    stroke="none"
                  >
                    永
                  </text>

                  {/* 8 Principles Indicators */}
                  <g fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#b92c18">
                    <circle cx="192" cy="50" r="6" fill="#fef2f2" stroke="#b92c18" strokeWidth="1" />
                    <text x="192" y="53" textAnchor="middle">1</text>

                    <circle cx="145" cy="88" r="6" fill="#fef2f2" stroke="#b92c18" strokeWidth="1" />
                    <text x="145" y="91" textAnchor="middle">2</text>

                    <circle cx="192" cy="120" r="6" fill="#fef2f2" stroke="#b92c18" strokeWidth="1" />
                    <text x="192" y="123" textAnchor="middle">3</text>

                    <circle cx="180" cy="188" r="6" fill="#fef2f2" stroke="#b92c18" strokeWidth="1" />
                    <text x="180" y="191" textAnchor="middle">4</text>

                    <circle cx="140" cy="128" r="6" fill="#fef2f2" stroke="#b92c18" strokeWidth="1" />
                    <text x="140" y="131" textAnchor="middle">5</text>

                    <circle cx="118" cy="180" r="6" fill="#fef2f2" stroke="#b92c18" strokeWidth="1" />
                    <text x="118" y="183" textAnchor="middle">6</text>

                    <circle cx="218" cy="118" r="6" fill="#fef2f2" stroke="#b92c18" strokeWidth="1" />
                    <text x="218" y="121" textAnchor="middle">7</text>

                    <circle cx="258" cy="192" r="6" fill="#fef2f2" stroke="#b92c18" strokeWidth="1" />
                    <text x="258" y="195" textAnchor="middle">8</text>
                  </g>
                </g>
              )}
            </svg>
          )}

          {/* View & Calligraphy Grid Toggles */}
          <div className="absolute top-2.5 right-2.5 flex flex-wrap items-center gap-1.5 bg-stone-900/85 backdrop-blur-xs p-1 rounded-xl border border-stone-700/60 shadow-xs">
            <div className="flex items-center gap-1 border-r border-stone-700/80 pr-1.5 mr-0.5">
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

            {/* Grid overlay pills */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-stone-400 font-mono px-1 flex items-center gap-1">
                <Grid className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">{lang === 'de' ? 'Gitter:' : 'Grid:'}</span>
              </span>
              <button
                onClick={() => setCalligraphyGrid('none')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  calligraphyGrid === 'none' ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {lang === 'de' ? 'Aus' : 'Off'}
              </button>
              <button
                onClick={() => setCalligraphyGrid('mizige')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  calligraphyGrid === 'mizige' ? 'bg-red-700 text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title={lang === 'de' ? 'Mi Zi Ge (8-Stern-Gitter)' : 'Mi Zi Ge (8-Star Grid)'}
              >
                米字格
              </button>
              <button
                onClick={() => setCalligraphyGrid('jiugongge')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  calligraphyGrid === 'jiugongge' ? 'bg-red-700 text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title={lang === 'de' ? 'Jiu Gong Ge (9-Felder-Gitter)' : 'Jiu Gong Ge (Nine Palaces)'}
              >
                九宫格
              </button>
              <button
                onClick={() => setCalligraphyGrid('yongzi')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  calligraphyGrid === 'yongzi' ? 'bg-red-700 text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title={lang === 'de' ? 'Yongzi Bafa (8 Ur-Striche)' : 'Eight Principles of Yong'}
              >
                永字八法
              </button>
            </div>
          </div>
        </div>

        {/* Yongzi Bafa Didactic Guide */}
        {calligraphyGrid === 'yongzi' && (
          <div className="mt-3 bg-red-950/15 border border-red-900/30 rounded-xl p-3 text-xs text-stone-800">
            <div className="flex items-center justify-between font-bold text-red-950 mb-1.5 font-serif">
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs bg-red-800 text-white w-5 h-5 rounded-full inline-flex items-center justify-center">永</span>
                <span>{lang === 'de' ? 'Yongzi Bafa (永字八法) — Die 8 Ur-Striche der Kalligrafie' : 'Eight Principles of Yong (永字八法)'}</span>
              </span>
              <span className="text-[10px] font-mono text-red-800/80 font-normal">Wang Xizhi (王羲之)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone-700">
              <div className="bg-white/85 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="font-bold text-red-950 mr-1">1. 侧 (Cè)</span>
                <span className="text-stone-600">{lang === 'de' ? 'Punkt (Fels)' : 'Dot (rock)'}</span>
              </div>
              <div className="bg-white/85 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="font-bold text-red-950 mr-1">2. 勒 (Lè)</span>
                <span className="text-stone-600">{lang === 'de' ? 'Querstrich (Zügel)' : 'Horizontal (rein)'}</span>
              </div>
              <div className="bg-white/85 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="font-bold text-red-950 mr-1">3. 努 (Nǔ)</span>
                <span className="text-stone-600">{lang === 'de' ? 'Längsstrich (Armbrust)' : 'Vertical (bow)'}</span>
              </div>
              <div className="bg-white/85 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="font-bold text-red-950 mr-1">4. 趯 (Tī)</span>
                <span className="text-stone-600">{lang === 'de' ? 'Haken (Sprungkraft)' : 'Hook (spring)'}</span>
              </div>
              <div className="bg-white/85 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="font-bold text-red-950 mr-1">5. 策 (Cè)</span>
                <span className="text-stone-600">{lang === 'de' ? 'Anstrich (Peitsche)' : 'Up-flick (whip)'}</span>
              </div>
              <div className="bg-white/85 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="font-bold text-red-950 mr-1">6. 掠 (Lüè)</span>
                <span className="text-stone-600">{lang === 'de' ? 'Langer Abstrich (Kamm)' : 'Left sweep (comb)'}</span>
              </div>
              <div className="bg-white/85 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="font-bold text-red-950 mr-1">7. 啄 (Zhuó)</span>
                <span className="text-stone-600">{lang === 'de' ? 'Kurzer Abstrich (Picken)' : 'Short peck (beak)'}</span>
              </div>
              <div className="bg-white/85 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                <span className="font-bold text-red-950 mr-1">8. 磔 (Zhé)</span>
                <span className="text-stone-600">{lang === 'de' ? 'Rechtsabstrich (Schnittfuß)' : 'Right sweep (foot)'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Color Swatch Ribbon below Canvas */}
        <div className="mt-3 pt-3 border-t border-stone-300/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
            <span className="text-[10px] uppercase font-bold text-stone-500 font-mono tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Palette className="w-3.5 h-3.5 text-amber-800" />
              {lang === 'de' ? 'Farbe:' : 'Ink:'}
            </span>
            {recentPigments.slice(0, 8).map((pig) => {
              const isSelected = selectedPigment.id === pig.id || selectedPigment.colorHex === pig.colorHex;
              return (
                <button
                  key={`ribbon-${pig.id}-${pig.colorHex}`}
                  onClick={() => handlePigmentChange(pig)}
                  className={`w-6 h-6 rounded-lg border transition-all cursor-pointer relative shrink-0 flex items-center justify-center ${
                    isSelected
                      ? 'border-stone-900 ring-2 ring-stone-900 scale-110 shadow-xs'
                      : 'border-stone-300 hover:scale-105 hover:border-stone-400'
                  }`}
                  style={{ backgroundColor: pig.colorHex || '#111' }}
                  title={`${lang === 'de' ? pig.nameDe : pig.nameEn} (${pig.colorHex})`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsColorPickerOpen((prev) => !prev)}
            className="px-2 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-mono text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer shrink-0"
            title={lang === 'de' ? 'Farbpalette & Mischer öffnen' : 'Open Palette & Color Mixer'}
          >
            <Palette className="w-3 h-3 text-stone-600" />
            <span>{lang === 'de' ? 'Farbmischer' : 'Color Mixer'}</span>
          </button>
        </div>
      </div>

      {/* Essential Working Controls (Grid layout) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        {/* 1. Drawing Tool & Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block font-bold text-stone-700 uppercase tracking-wider text-[11px] font-mono">
              1. {lang === 'de' ? 'Werkzeug & Pinsel' : lang === 'es' ? 'Herramienta' : 'Tool & Brush'}
            </label>
            <span className="text-[10px] text-amber-800 font-serif italic">
              {currentTool === 'langhao'
                ? '狼毫 (Wiesel)'
                : currentTool === 'yanghao'
                ? '羊毫 (Ziege)'
                : currentTool === 'jianhao'
                ? '兼毫 (Misch)'
                : currentTool === 'seal-stamp'
                ? '朱砂印章'
                : ''}
            </span>
          </div>

          {/* Traditional Mao-Bi Hair Selection */}
          <div className="space-y-1">
            <span className="text-[10px] text-stone-500 font-mono uppercase font-bold">
              {lang === 'de' ? 'Mao-Bi Haartypen (毛笔)' : 'Mao-Bi Brush Hair Types'}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setCurrentTool('langhao')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  currentTool === 'langhao'
                    ? 'border-amber-900 bg-amber-900 text-white font-bold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
                title={lang === 'de' ? 'Langhao: Wieselhaar, hohe Rückfederung (Tanxing), spitze Linien' : 'Langhao: Weasel hair, high elasticity, sharp lines'}
              >
                <div className="font-bold text-[11px]">狼毫</div>
                <div className="text-[9px] opacity-90">{lang === 'de' ? 'Wiesel' : 'Weasel'}</div>
              </button>

              <button
                onClick={() => setCurrentTool('yanghao')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  currentTool === 'yanghao'
                    ? 'border-amber-900 bg-amber-900 text-white font-bold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
                title={lang === 'de' ? 'Yanghao: Ziegenhaar, sehr weich, hohes Tintenreservoir, sattes Fließen' : 'Yanghao: Goat hair, very soft, rich ink reservoir'}
              >
                <div className="font-bold text-[11px]">羊毫</div>
                <div className="text-[9px] opacity-90">{lang === 'de' ? 'Ziege' : 'Goat'}</div>
              </button>

              <button
                onClick={() => setCurrentTool('jianhao')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  currentTool === 'jianhao'
                    ? 'border-amber-900 bg-amber-900 text-white font-bold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
                title={lang === 'de' ? 'Jianhao: Mischhaar, Wieselkern in Ziegenmantel, der ausgewogene Allrounder' : 'Jianhao: Hybrid hair, balanced all-rounder'}
              >
                <div className="font-bold text-[11px]">兼毫</div>
                <div className="text-[9px] opacity-90">{lang === 'de' ? 'Misch' : 'Hybrid'}</div>
              </button>
            </div>
          </div>

          {/* Classical & Seal Tools */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => setCurrentTool('sumi-brush')}
              className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentTool === 'sumi-brush'
                  ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <Brush className="w-3.5 h-3.5 mx-auto mb-0.5" />
              <span className="text-[10px]">{lang === 'de' ? 'Tusche' : 'Ink'}</span>
            </button>

            <button
              onClick={() => setCurrentTool('fountain-pen')}
              className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentTool === 'fountain-pen'
                  ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 mx-auto mb-0.5" />
              <span className="text-[10px]">{lang === 'de' ? 'Feder' : 'Pen'}</span>
            </button>

            <button
              onClick={() => setCurrentTool('water-drop')}
              className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentTool === 'water-drop'
                  ? 'border-blue-700 bg-blue-700 text-white font-bold shadow-xs'
                  : 'border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 mx-auto mb-0.5 text-blue-500" />
              <span className="text-[10px]">{lang === 'de' ? 'Wasser' : 'Water'}</span>
            </button>

            <button
              onClick={() => setCurrentTool('seal-stamp')}
              className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentTool === 'seal-stamp'
                  ? 'border-red-800 bg-red-800 text-white font-bold shadow-xs'
                  : 'border-red-200 bg-red-50/50 hover:bg-red-100 text-red-900'
              }`}
              title={lang === 'de' ? 'Zinnober-Siegelstempel (Zhuanke / 印章)' : 'Cinnabar Seal Stamp (Zhuanke)'}
            >
              <Stamp className="w-3.5 h-3.5 mx-auto mb-0.5 text-red-600" />
              <span className="text-[10px]">{lang === 'de' ? 'Siegel' : 'Seal'}</span>
            </button>
          </div>

          {/* Dynamic Tool Sub-Panel */}
          {currentTool !== 'seal-stamp' ? (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-stone-600 mb-1">
                  <span>{lang === 'de' ? 'Pinsel-Größe' : 'Brush Size'}:</span>
                  <span className="font-mono font-bold">{brushRadius} px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={brushRadius}
                  onChange={(e) => setBrushRadius(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-700 cursor-pointer"
                />
              </div>

              {/* Brush Tip Shape Footprints (Pinsel-Formen / 毛笔形制) */}
              <div className="pt-2 border-t border-stone-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-600 font-mono">
                    {lang === 'de' ? 'Pinsel-Form (Spitze)' : 'Brush Tip Shape'}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 font-serif">
                    {BRUSH_TIP_SHAPES.find((s) => s.id === brushTipShape)?.zh}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {BRUSH_TIP_SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setBrushTipShape(shape.id)}
                      className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        brushTipShape === shape.id
                          ? 'border-amber-900 bg-amber-900 text-white font-bold shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                      title={`${lang === 'de' ? shape.nameDe : shape.nameEn} (${shape.zh}): ${lang === 'de' ? shape.descDe : shape.descEn}`}
                    >
                      <span className="text-xs leading-none mb-0.5">{shape.icon}</span>
                      <span className="text-[10px] font-bold leading-none">{lang === 'de' ? shape.nameDe : shape.nameEn}</span>
                      <span className="text-[8px] opacity-75 font-serif mt-0.5">{shape.zh}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mo Fen Wu Se: Five Shades of Ink & Wash Dilution (墨分五色) */}
              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-600 font-mono">
                    {lang === 'de' ? '墨分五色 (Tintenstufen)' : 'Mo Fen Wu Se (Ink Wash)'}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 font-serif">
                    {inkDilution <= 0.45
                      ? '焦 (Jiāo)'
                      : inkDilution <= 0.8
                      ? '浓 (Nóng)'
                      : inkDilution <= 1.3
                      ? '重 (Zhòng)'
                      : inkDilution <= 2.2
                      ? '淡 (Dàn)'
                      : '清 (Qīng)'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1">
                  {FIVE_SHADES_OF_INK.map((shade) => {
                    const isActive = Math.abs(inkDilution - shade.ratio) < 0.15;
                    return (
                      <button
                        key={shade.id}
                        onClick={() => setInkDilution(shade.ratio)}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isActive
                            ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-xs'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                        title={`${lang === 'de' ? shade.nameDe : shade.nameEn}: ${lang === 'de' ? shade.descDe : shade.descEn}`}
                      >
                        <div
                          className="w-3 h-3 rounded-full border border-stone-400 mb-0.5 shadow-2xs"
                          style={{ backgroundColor: shade.previewColor }}
                        />
                        <div className="text-[11px] font-serif font-bold leading-none">{shade.nameZh}</div>
                        <div className="text-[8px] opacity-80 mt-0.5 leading-none font-mono">
                          {shade.id === 'jiao' ? '0.3x' : shade.id === 'nong' ? '0.7x' : shade.id === 'zhong' ? '1.0x' : shade.id === 'dan' ? '1.8x' : '2.8x'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Fine Dilution Slider */}
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                    <span>{lang === 'de' ? 'Verdünnung (Wasser)' : 'Dilution (Water Ratio)'}:</span>
                    <span className="font-mono font-bold text-stone-700">{inkDilution.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.30"
                    max="2.80"
                    step="0.05"
                    value={inkDilution}
                    onChange={(e) => setInkDilution(parseFloat(e.target.value))}
                    className="w-full accent-stone-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Seal Stamp Configuration Sub-Panel */
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-red-950 uppercase font-mono">
                <span>{lang === 'de' ? 'Siegel-Gravur (篆刻)' : 'Seal Carving'}</span>
                <button
                  onClick={() => {
                    const zinnober = PIGMENT_PRESETS.find((p) => p.id === 'zinnober');
                    if (zinnober) handlePigmentChange(zinnober);
                  }}
                  className="text-[9px] bg-red-800 text-white px-2 py-0.5 rounded cursor-pointer hover:bg-red-700 font-sans"
                >
                  {lang === 'de' ? 'Zinnoberrot' : 'Cinnabar'}
                </button>
              </div>

              {/* Style & Shape */}
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div className="flex gap-1">
                  <button
                    onClick={() => setSealStyle('zhuwen')}
                    className={`flex-1 py-1 rounded border text-center cursor-pointer ${
                      sealStyle === 'zhuwen'
                        ? 'bg-red-800 text-white border-red-800 font-bold'
                        : 'border-red-200 bg-white text-stone-700'
                    }`}
                    title={lang === 'de' ? 'Zhuwen: Rote Linien auf weißem Grund' : 'Zhuwen: Red characters'}
                  >
                    朱文 (Rot)
                  </button>
                  <button
                    onClick={() => setSealStyle('baiwen')}
                    className={`flex-1 py-1 rounded border text-center cursor-pointer ${
                      sealStyle === 'baiwen'
                        ? 'bg-red-800 text-white border-red-800 font-bold'
                        : 'border-red-200 bg-white text-stone-700'
                    }`}
                    title={lang === 'de' ? 'Baiwen: Weißes Zeichen in rotem Block' : 'Baiwen: White characters'}
                  >
                    白文 (Weiß)
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setSealShape('square')}
                    className={`flex-1 py-1 rounded border text-center cursor-pointer ${
                      sealShape === 'square'
                        ? 'bg-red-800 text-white border-red-800 font-bold'
                        : 'border-red-200 bg-white text-stone-700'
                    }`}
                  >
                    方印 (Quad.)
                  </button>
                  <button
                    onClick={() => setSealShape('round')}
                    className={`flex-1 py-1 rounded border text-center cursor-pointer ${
                      sealShape === 'round'
                        ? 'bg-red-800 text-white border-red-800 font-bold'
                        : 'border-red-200 bg-white text-stone-700'
                    }`}
                  >
                    圆印 (Rund)
                  </button>
                </div>
              </div>

              {/* Glyph selection */}
              <div>
                <span className="text-[10px] text-stone-600 block mb-1">
                  {lang === 'de' ? 'Zeichen / Text:' : 'Glyph / Inscription:'}
                </span>
                <div className="grid grid-cols-6 gap-1">
                  {(['amelie', 'mo', 'he', 'ji', 'yong', 'classic'] as SealGlyph[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setSealGlyph(g)}
                      className={`py-1 rounded border text-[11px] font-serif cursor-pointer ${
                        sealGlyph === g
                          ? 'bg-red-800 text-white border-red-800 font-bold'
                          : 'border-red-200 bg-white text-stone-700 hover:bg-red-50'
                      }`}
                    >
                      {g === 'amelie'
                        ? '阿梅莉'
                        : g === 'mo'
                        ? '墨'
                        : g === 'he'
                        ? '和'
                        : g === 'ji'
                        ? '吉'
                        : g === 'yong'
                        ? '永'
                        : '印'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seal Size */}
              <div className="flex items-center justify-between text-[10px] text-stone-600 pt-1">
                <span>{lang === 'de' ? 'Stempelgröße' : 'Seal Size'}:</span>
                <span className="font-mono font-bold text-red-950">{sealSize} px</span>
                <input
                  type="range"
                  min="20"
                  max="48"
                  step="2"
                  value={sealSize}
                  onChange={(e) => setSealSize(parseInt(e.target.value, 10))}
                  className="w-24 accent-red-700 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Ink & Paper Substrate */}
        <div className="space-y-3">
          <label className="block font-bold text-stone-700 uppercase tracking-wider text-[11px] font-mono">
            2. {lang === 'de' ? 'Farbe & Papier' : lang === 'es' ? 'Tinta y papel' : 'Ink & Paper'}
          </label>

          {/* Historical Pigments & Interactive Color Selector */}
          <WetInkColorSelector
            selectedPigment={selectedPigment}
            onSelectPigment={handlePigmentChange}
            lang={lang}
            recentPigments={recentPigments}
            previousPigment={previousPigment}
            variant="inline"
          />

          {/* Substrate Category Selector: Xuan vs Classic */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-500 font-mono">
                {lang === 'de' ? 'Papiersubstrat' : 'Substrate'}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPaperCategory('xuan')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    paperCategory === 'xuan'
                      ? 'bg-amber-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  宣纸 (Xuan)
                </button>
                <button
                  onClick={() => setPaperCategory('classic')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    paperCategory === 'classic'
                      ? 'bg-amber-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {lang === 'de' ? 'Klassisch' : 'Classic'}
                </button>
              </div>
            </div>

            {/* Substrates in active category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {(paperCategory === 'xuan' ? XUAN_PAPERS : CLASSIC_PAPERS).map((paper) => {
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
                    <div className="font-semibold text-xs leading-tight">
                      {paper.id === 'sheng-xuan'
                        ? '生宣 (Roh)'
                        : paper.id === 'ban-shu-xuan'
                        ? '半熟宣 (Halb)'
                        : paper.id === 'shu-xuan'
                        ? '熟宣 (Reif)'
                        : paper.id === 'washi'
                        ? 'Washi'
                        : paper.id === 'kopierpapier'
                        ? 'Geleimt'
                        : paper.id === 'buetten'
                        ? 'Bütten'
                        : 'Aquarell'}
                    </div>
                    <div className="text-[9px] text-stone-500 mt-0.5 line-clamp-1">
                      {paper.id === 'sheng-xuan'
                        ? (lang === 'de' ? 'Max. Ausbluten (Xieyi)' : 'Max. Bleed (Xieyi)')
                        : paper.id === 'ban-shu-xuan'
                        ? (lang === 'de' ? 'Standfest (Kaishu)' : 'Stable (Kaishu)')
                        : paper.id === 'shu-xuan'
                        ? (lang === 'de' ? 'Scharf (Gongbi)' : 'Sharp (Gongbi)')
                        : paper.id === 'washi'
                        ? (lang === 'de' ? 'Faser-Wick' : 'Fiber Wick')
                        : (lang === 'de' ? 'Geringe Saugleistung' : 'Low Bleed')}
                    </div>
                  </button>
                );
              })}
            </div>
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
              <span className="font-mono font-bold text-amber-800">{bleedSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="4.0"
              step="0.1"
              value={bleedSpeed}
              onChange={(e) => handleBleedSpeedChange(parseFloat(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
            {/* Quick Bleed Presets */}
            <div className="grid grid-cols-4 gap-1 mt-1.5">
              {[
                { speed: 0.8, labelDe: 'Zahm', labelEn: 'Tame' },
                { speed: 1.2, labelDe: 'Standard', labelEn: 'Normal' },
                { speed: 2.2, labelDe: 'Xuan-Sog', labelEn: 'Xuan' },
                { speed: 3.6, labelDe: 'Explosiv', labelEn: 'Explosive' },
              ].map((preset) => (
                <button
                  key={preset.speed}
                  onClick={() => handleBleedSpeedChange(preset.speed)}
                  className={`py-0.5 px-1 rounded text-[9px] font-mono border transition-colors cursor-pointer text-center ${
                    Math.abs(bleedSpeed - preset.speed) < 0.15
                      ? 'bg-amber-900 text-white border-amber-900 font-bold'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  {lang === 'de' ? preset.labelDe : preset.labelEn}
                </button>
              ))}
            </div>
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

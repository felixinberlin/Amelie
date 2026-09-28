import {
  WetInkSimulation,
  WetInkBrushManager,
  generatePaperMaps,
  PAPER_PRESETS,
  PIGMENT_PRESETS,
  WET_INK_DT,
  WetInkPaperConfig,
  WetInkPigmentConfig,
  WetInkSimParams
} from '../../../src/engine/wet-ink/index';
import {
  WetInkNodeAttributes,
  WetInkExtensionOptions,
  WetInkLifecycleState,
  WetInkStroke,
  WetInkToolType,
  SVGExportOptions
} from './types';
import { PenAudioSynthesizer } from './audio';
import { WetInkSVGExporter } from './svgExport';

/**
 * ProseMirror / TipTap NodeView for Wet Ink Blocks.
 * 
 * Manages DOM encapsulation, WebGL/2D Canvas simulation, tactile audio feedback,
 * and the 3-Phase Lifecycle:
 * Phase 1: WET (60 FPS on interaction, Web Audio friction sound)
 * Phase 2: SETTLING (capillary decay/evaporation until surface water < DRY_EPS)
 * Phase 3: FROZEN (0 FPS, 0% CPU, static ImageBitmap fallback)
 */
export class WetInkNodeView {
  public dom: HTMLElement;
  public contentDOM?: HTMLElement;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sim: WetInkSimulation;
  private brushManager: WetInkBrushManager;
  private audioSynth: PenAudioSynthesizer;
  private currentStroke: WetInkStroke | null = null;
  private strokes: WetInkStroke[] = [];

  private lifecycleState: WetInkLifecycleState = 'frozen';
  private animationFrameId: number | null = null;
  private settlingStartTime: number = 0;
  private dryingLimitMs: number = 4000;

  private activeTool: WetInkToolType = 'fountain-pen';
  private lastPointerX: number = 0;
  private lastPointerY: number = 0;
  private lastPointerTime: number = 0;

  private nodeAttrs: WetInkNodeAttributes;
  private options: WetInkExtensionOptions;
  private updateAttributes: (attrs: Partial<WetInkNodeAttributes>) => void;

  constructor(
    nodeAttrs: WetInkNodeAttributes,
    options: WetInkExtensionOptions,
    updateAttributes: (attrs: Partial<WetInkNodeAttributes>) => void
  ) {
    this.nodeAttrs = nodeAttrs;
    this.options = options;
    this.updateAttributes = updateAttributes;
    this.dryingLimitMs = options.dryingTimeLimit || 4000;
    this.strokes = [...(nodeAttrs.strokes || [])];
    this.activeTool = options.defaultTool || 'fountain-pen';

    // 1. Audio Synthesizer
    const isMuted = options.enableAudio === false || nodeAttrs.soundMuted === true;
    this.audioSynth = new PenAudioSynthesizer(isMuted);

    // 2. Build Container DOM
    this.dom = document.createElement('figure');
    this.dom.className = 'wet-ink-block';
    this.dom.style.position = 'relative';
    this.dom.style.display = 'inline-block';
    this.dom.style.margin = '1.5em 0';
    this.dom.style.borderRadius = '6px';
    this.dom.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
    this.dom.style.userSelect = 'none';
    this.dom.style.backgroundColor = '#faf8f5';

    // 3. Setup Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = nodeAttrs.width || options.defaultWidth || 480;
    this.canvas.height = nodeAttrs.height || options.defaultHeight || 160;
    this.canvas.style.display = 'block';
    this.canvas.style.cursor = nodeAttrs.readOnly ? 'default' : 'crosshair';
    this.canvas.style.touchAction = 'none';

    this.ctx = this.canvas.getContext('2d')!;
    this.dom.appendChild(this.canvas);

    // 4. Initialize Physical Simulation Engine
    const paperConfig = this.resolvePaperConfig(nodeAttrs.paper);
    const pigmentConfig = this.resolvePigmentConfig(nodeAttrs.pigment);
    const paperMaps = generatePaperMaps(this.canvas.width, this.canvas.height, paperConfig, 42);

    const simParams: WetInkSimParams = {
      capillaryThreshold: 0.08,
      enableCapillaryThreshold: true,
      capillarySpeed: 1.0,
      evaporationRate: 1.0,
      edgeDarkeningStrength: 1.0,
      granulationStrength: 1.0,
      backrunStrength: 0.8,
      dryBrushSensitivity: 1.0
    };

    this.sim = new WetInkSimulation(
      this.canvas.width,
      this.canvas.height,
      paperMaps,
      paperConfig,
      pigmentConfig,
      simParams
    );

    this.brushManager = new WetInkBrushManager();

    // 5. Attach Event Listeners if not read-only
    if (!nodeAttrs.readOnly && !options.readOnly) {
      this.attachPointerHandlers();
      if (options.enableToolbar) {
        this.dom.appendChild(this.createToolbar());
      }
    }

    // 6. Initial Render / Rehydration
    this.initializeState();
  }

  private resolvePaperConfig(paperId: string): WetInkPaperConfig {
    return PAPER_PRESETS.find(p => p.id === paperId) || PAPER_PRESETS[0];
  }

  private resolvePigmentConfig(pigmentId: string): WetInkPigmentConfig {
    return PIGMENT_PRESETS.find(p => p.id === pigmentId) || PIGMENT_PRESETS[0];
  }

  public getLifecycleState(): WetInkLifecycleState {
    return this.lifecycleState;
  }

  public getSimulation(): WetInkSimulation {
    return this.sim;
  }

  public setTool(tool: WetInkToolType): void {
    this.activeTool = tool;
  }

  public setAudioMuted(muted: boolean): void {
    this.audioSynth.setMuted(muted);
    this.nodeAttrs = { ...this.nodeAttrs, soundMuted: muted };
    this.updateAttributes({ soundMuted: muted });
  }

  private initializeState(): void {
    if (this.nodeAttrs.previewImage) {
      // Rehydrate instantly from saved raster preview
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
      };
      img.src = this.nodeAttrs.previewImage;
      this.lifecycleState = 'frozen';
    } else {
      // Render clean dry substrate
      this.renderCurrentFrame();
      this.lifecycleState = 'frozen';
    }
  }

  private attachPointerHandlers(): void {
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.canvas.addEventListener('pointercancel', this.onPointerUp.bind(this));
  }

  private getBrushRadius(): number {
    switch (this.activeTool) {
      case 'sumi-brush':
      case 'wash-brush':
        return 5.5;
      case 'dip-pen':
        return 1.4;
      case 'fountain-pen':
      default:
        return 2.2;
    }
  }

  private onPointerDown(e: PointerEvent): void {
    if (this.nodeAttrs.readOnly) return;
    this.canvas.setPointerCapture(e.pointerId);

    const rect = this.canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(this.canvas.width - 1, e.clientX - rect.left));
    const y = Math.max(0, Math.min(this.canvas.height - 1, e.clientY - rect.top));
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;
    const now = performance.now();

    this.lastPointerX = x;
    this.lastPointerY = y;
    this.lastPointerTime = now;

    this.currentStroke = {
      tool: this.activeTool,
      startTime: now,
      points: [{ x, y, pressure, timeOffset: 0 }]
    };

    // Transition to Phase 1: WET
    this.lifecycleState = 'wet';

    // Start procedural audio
    const paperRoughness = this.sim.paperConfig.roughness;
    this.audioSynth.startStroke(paperRoughness);

    this.brushManager.stroke(
      this.sim,
      x,
      y,
      pressure,
      {
        tool: this.activeTool === 'dip-pen' ? 'fountain-pen' : this.activeTool,
        baseRadius: this.getBrushRadius(),
        waterRatio: this.activeTool === 'dip-pen' ? 0.7 : 1.0,
        dryBrush: false
      },
      true,
      now
    );

    this.startActiveLoop();
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.currentStroke || this.lifecycleState !== 'wet') return;

    const rect = this.canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(this.canvas.width - 1, e.clientX - rect.left));
    const y = Math.max(0, Math.min(this.canvas.height - 1, e.clientY - rect.top));
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;
    const now = performance.now();
    const timeOffset = now - this.currentStroke.startTime;

    // Instantaneous velocity calculation for acoustic feedback
    const dt = Math.max(1, now - this.lastPointerTime);
    const dx = x - this.lastPointerX;
    const dy = y - this.lastPointerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const velocity = dist / dt; // pixels per ms

    this.lastPointerX = x;
    this.lastPointerY = y;
    this.lastPointerTime = now;

    // Update real-time nib friction synthesis
    this.audioSynth.updateMotion(velocity, pressure);

    this.currentStroke.points.push({ x, y, pressure, timeOffset });

    this.brushManager.stroke(
      this.sim,
      x,
      y,
      pressure,
      {
        tool: this.activeTool === 'dip-pen' ? 'fountain-pen' : this.activeTool,
        baseRadius: this.getBrushRadius(),
        waterRatio: this.activeTool === 'dip-pen' ? 0.7 : 1.0,
        dryBrush: false
      },
      false,
      now
    );
  }

  private onPointerUp(e: PointerEvent): void {
    if (!this.currentStroke) return;
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    this.audioSynth.endStroke();

    this.strokes.push(this.currentStroke);
    this.currentStroke = null;

    // Transition to Phase 2: SETTLING
    this.lifecycleState = 'settling';
    this.settlingStartTime = performance.now();
  }

  /**
   * The Physics & Render Loop (Phase 1 & Phase 2)
   */
  private startActiveLoop(): void {
    if (this.animationFrameId !== null) return;

    const loop = () => {
      if (this.lifecycleState === 'frozen') {
        this.stopActiveLoop();
        return;
      }

      // Advance physics simulation
      this.sim.advance(WET_INK_DT);

      // Render to Canvas
      this.renderCurrentFrame();

      // Check Phase 2: SETTLING completion
      if (this.lifecycleState === 'settling') {
        const elapsedSettling = performance.now() - this.settlingStartTime;
        const totalWater = this.sim.totalWater;

        // If water has evaporated or time limit reached -> Freeze
        if (totalWater < 0.001 || elapsedSettling >= this.dryingLimitMs) {
          this.freeze();
          return;
        }
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  private stopActiveLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Blotting paper ("Löschpapier") feature:
   * Instantly absorbs all surface water while preserving pigment deposits and capillary fringe.
   */
  public blot(): void {
    // 1. Absorb surface water immediately
    this.sim.waterFilm.fill(0);

    // 2. Fix all suspended pigment directly into deposited layer
    const dep = this.sim.pigmentDeposited;
    const susp = this.sim.pigmentSuspended;
    for (let i = 0; i < dep.length; i++) {
      dep[i] += susp[i];
      susp[i] = 0;
    }

    // 3. Complete settling immediately
    this.freeze();
  }

  /**
   * Phase 3: FROZEN (0% CPU, 0 FPS)
   */
  public freeze(): void {
    this.lifecycleState = 'frozen';
    this.stopActiveLoop();

    // Final render pass
    this.renderCurrentFrame();

    // Export static PNG preview
    const previewPng = this.canvas.toDataURL('image/png');
    const svgString = this.exportSVG();

    const updatedAttrs: Partial<WetInkNodeAttributes> = {
      strokes: this.strokes,
      previewImage: previewPng,
      isFrozen: true
    };

    this.nodeAttrs = { ...this.nodeAttrs, ...updatedAttrs };
    this.updateAttributes(updatedAttrs);

    if (this.options.onSave) {
      this.options.onSave({
        pngDataUrl: previewPng,
        svgData: svgString,
        strokes: this.strokes,
        attributes: this.nodeAttrs
      });
    }
  }

  public renderCurrentFrame(): void {
    const imgData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.sim.renderToImageData(imgData, 'composite', 2.4, 0.65);
    this.ctx.putImageData(imgData, 0, 0);
  }

  public exportPNG(): string {
    return this.canvas.toDataURL('image/png');
  }

  public exportSVG(options: SVGExportOptions = {}): string {
    return WetInkSVGExporter.export(this.sim, options);
  }

  public clear(): void {
    this.stopActiveLoop();
    this.strokes = [];
    const paperConfig = this.resolvePaperConfig(this.nodeAttrs.paper);
    const pigmentConfig = this.resolvePigmentConfig(this.nodeAttrs.pigment);
    const paperMaps = generatePaperMaps(this.canvas.width, this.canvas.height, paperConfig, 42);

    this.sim = new WetInkSimulation(
      this.canvas.width,
      this.canvas.height,
      paperMaps,
      paperConfig,
      pigmentConfig,
      this.sim.params
    );

    this.renderCurrentFrame();
    this.freeze();
  }

  private createToolbar(): HTMLElement {
    const bar = document.createElement('div');
    bar.className = 'wet-ink-toolbar';
    bar.style.position = 'absolute';
    bar.style.top = '6px';
    bar.style.right = '6px';
    bar.style.display = 'flex';
    bar.style.alignItems = 'center';
    bar.style.gap = '6px';
    bar.style.padding = '4px 8px';
    bar.style.borderRadius = '6px';
    bar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    bar.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.1)';
    bar.style.backdropFilter = 'blur(4px)';
    bar.style.fontSize = '12px';

    // Tool Button Helper
    const makeBtn = (label: string, title: string, onClick: () => void) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.title = title;
      btn.style.border = 'none';
      btn.style.background = 'none';
      btn.style.cursor = 'pointer';
      btn.style.padding = '2px 4px';
      btn.style.color = '#555';
      btn.style.borderRadius = '3px';
      btn.style.fontSize = '12px';
      btn.onmouseenter = () => btn.style.backgroundColor = 'rgba(0,0,0,0.06)';
      btn.onmouseleave = () => btn.style.backgroundColor = 'transparent';
      btn.onclick = (e) => {
        e.preventDefault();
        onClick();
      };
      return btn;
    };

    // 1. Audio Mute Button
    const audioBtn = makeBtn(
      this.audioSynth.getMuted() ? '🔇' : '🔊',
      'Toggle Nib Friction Sound',
      () => {
        const next = !this.audioSynth.getMuted();
        this.setAudioMuted(next);
        audioBtn.textContent = next ? '🔇' : '🔊';
      }
    );
    bar.appendChild(audioBtn);

    // 2. Blotting Paper Button
    const blotBtn = makeBtn('🧻 Blot', 'Blotting Paper: Instantly dry surface ink', () => {
      this.blot();
    });
    bar.appendChild(blotBtn);

    // 3. SVG Download Button
    const svgBtn = makeBtn('SVG', 'Export Multi-Layer Vector SVG', () => {
      const svg = this.exportSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signature-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    });
    bar.appendChild(svgBtn);

    // 4. Clear Button
    const clearBtn = makeBtn('Clear', 'Clear substrate', () => {
      this.clear();
    });
    bar.appendChild(clearBtn);

    return bar;
  }

  public destroy(): void {
    this.stopActiveLoop();
    this.audioSynth.destroy();
  }
}

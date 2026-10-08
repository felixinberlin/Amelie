import {
  WetInkSimulation,
  WetInkBrushManager,
  generatePaperMaps,
  PAPER_PRESETS,
  PIGMENT_PRESETS,
  createPigmentFromHex,
  WET_INK_DT,
  WetInkPaperConfig,
  WetInkPigmentConfig,
  WetInkSimParams
} from '../../../src/engine/wet-ink/index';
import {
  WetInkControllerOptions,
  WetInkLifecycleState,
  WetInkPaperType,
  WetInkPigmentType,
  WetInkToolType,
  WetInkStroke,
  WetInkStrokePoint,
  WetInkSavePayload,
  SVGExportOptions,
  WetInkEventMap
} from './types';
import { WetInkEventEmitter } from './events';
import { PenAudioSynthesizer } from './audio';
import { WetInkSVGExporter } from './svgExport';

/**
 * Universal Headless Canvas Controller for Wet Ink Pro.
 * 
 * Framework-agnostic foundation designed for TipTap, React, Vue, Svelte,
 * Obsidian, and Vanilla Custom Elements.
 */
export class WetInkController {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement | null = null;
  private toolbarEl: HTMLElement | null = null;

  private sim: WetInkSimulation;
  private brushManager: WetInkBrushManager;
  private audioSynth: PenAudioSynthesizer;
  private events: WetInkEventEmitter;

  private lifecycleState: WetInkLifecycleState = 'frozen';
  private animationFrameId: number | null = null;
  private settlingStartTime: number = 0;
  private dryingLimitMs: number = 4000;

  private activeTool: WetInkToolType = 'fountain-pen';
  private activePaper: WetInkPaperType = 'buetten';
  private activePigment: WetInkPigmentType = 'eisengallus';
  private activePigmentConfig: WetInkPigmentConfig;
  private readOnly: boolean = false;

  private currentStroke: WetInkStroke | null = null;
  private strokes: WetInkStroke[] = [];

  private lastPointerX: number = 0;
  private lastPointerY: number = 0;
  private lastPointerTime: number = 0;

  // Bound event handlers for clean removal
  private boundPointerDown: (e: PointerEvent) => void;
  private boundPointerMove: (e: PointerEvent) => void;
  private boundPointerUp: (e: PointerEvent) => void;

  constructor(options: WetInkControllerOptions) {
    this.events = new WetInkEventEmitter();
    // 3. Initialize Physical Fluid Simulation
    this.activePaper = options.paper ?? 'buetten';
    this.activePigmentConfig = this.resolvePigmentConfig(options.pigment ?? 'eisengallus');
    this.activePigment = this.activePigmentConfig.id;
    this.activeTool = options.tool ?? 'fountain-pen';
    this.readOnly = options.readOnly ?? false;
    this.strokes = options.initialStrokes ? [...options.initialStrokes] : [];

    // Register initial event callbacks if passed in options
    if (options.onStateChange) this.events.on('state:change', options.onStateChange);
    if (options.onStrokeStart) this.events.on('stroke:start', options.onStrokeStart);
    if (options.onStrokePoint) this.events.on('stroke:point', options.onStrokePoint);
    if (options.onStrokeEnd) this.events.on('stroke:end', options.onStrokeEnd);
    if (options.onSave) this.events.on('save', options.onSave);

    // 1. Resolve Target Canvas or Container
    const width = options.width ?? 480;
    const height = options.height ?? 160;

    const isCanvas = typeof HTMLCanvasElement !== 'undefined'
      ? options.target instanceof HTMLCanvasElement
      : (options.target && (options.target as any).getContext !== undefined);

    if (isCanvas) {
      this.canvas = options.target as HTMLCanvasElement;
      this.canvas.width = width;
      this.canvas.height = height;
    } else {
      this.container = options.target as HTMLElement;
      if (this.container && this.container.style) {
        this.container.style.position = 'relative';
        this.container.style.display = 'inline-block';
      }

      if (typeof document !== 'undefined') {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.container.appendChild(this.canvas);
      } else {
        this.canvas = options.target as any;
      }
    }

    this.canvas.style.display = 'block';
    this.canvas.style.cursor = this.readOnly ? 'default' : 'crosshair';
    this.canvas.style.touchAction = 'none';

    this.ctx = this.canvas.getContext('2d')!;

    // 2. Audio Synthesizer
    const isMuted = options.enableAudio === false || options.soundMuted === true;
    this.audioSynth = new PenAudioSynthesizer(isMuted);

    // 3. Initialize Physical Fluid Simulation
    this.sim = this.buildSimulation(width, height, this.activePaper, this.activePigmentConfig);
    this.brushManager = new WetInkBrushManager();

    // 4. Bind Input Handlers
    this.boundPointerDown = this.onPointerDown.bind(this);
    this.boundPointerMove = this.onPointerMove.bind(this);
    this.boundPointerUp = this.onPointerUp.bind(this);

    if (!this.readOnly) {
      this.attachEvents();
    }

    // 5. Optional Built-in Toolbar
    if (options.showToolbar && this.container) {
      this.toolbarEl = this.createToolbar();
      this.container.appendChild(this.toolbarEl);
    }

    // 6. Initial Rehydration or Clean Substrate Render
    if (options.initialImage) {
      this.loadPreview(options.initialImage);
    } else {
      this.renderCurrentFrame();
      this.setLifecycleState('frozen');
    }
  }

  private resolvePigmentConfig(pigment: WetInkPigmentType | WetInkPigmentConfig): WetInkPigmentConfig {
    if (typeof pigment === 'object' && pigment !== null && 'km' in pigment) {
      return pigment as WetInkPigmentConfig;
    }
    const clean = String(pigment).trim();
    if (clean.startsWith('#')) {
      return createPigmentFromHex(clean);
    }
    const found = PIGMENT_PRESETS.find(p => p.id === clean);
    if (found) return found;
    if (/^[0-9a-fA-F]{3,8}$/.test(clean)) {
      return createPigmentFromHex(`#${clean}`);
    }
    return PIGMENT_PRESETS[0];
  }

  private buildSimulation(
    w: number,
    h: number,
    paperId: WetInkPaperType,
    pigmentConfig: WetInkPigmentConfig
  ): WetInkSimulation {
    const paperConfig = PAPER_PRESETS.find(p => p.id === paperId) || PAPER_PRESETS[0];
    const paperMaps = generatePaperMaps(w, h, paperConfig, 42);

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

    return new WetInkSimulation(w, h, paperMaps, paperConfig, pigmentConfig, simParams);
  }

  private attachEvents(): void {
    this.canvas.addEventListener('pointerdown', this.boundPointerDown);
    this.canvas.addEventListener('pointermove', this.boundPointerMove);
    this.canvas.addEventListener('pointerup', this.boundPointerUp);
    this.canvas.addEventListener('pointercancel', this.boundPointerUp);
  }

  private detachEvents(): void {
    this.canvas.removeEventListener('pointerdown', this.boundPointerDown);
    this.canvas.removeEventListener('pointermove', this.boundPointerMove);
    this.canvas.removeEventListener('pointerup', this.boundPointerUp);
    this.canvas.removeEventListener('pointercancel', this.boundPointerUp);
  }

  // --- Getters & State ---

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getLifecycleState(): WetInkLifecycleState {
    return this.lifecycleState;
  }

  public getSimulation(): WetInkSimulation {
    return this.sim;
  }

  public getStrokes(): WetInkStroke[] {
    return [...this.strokes];
  }

  public getTool(): WetInkToolType {
    return this.activeTool;
  }

  public setTool(tool: WetInkToolType): void {
    this.activeTool = tool;
  }

  public getPaper(): WetInkPaperType {
    return this.activePaper;
  }

  public setPaper(paper: WetInkPaperType): void {
    this.activePaper = paper;
    this.clear();
  }

  public getPigment(): WetInkPigmentType {
    return this.activePigment;
  }

  public getPigmentConfig(): WetInkPigmentConfig {
    return this.activePigmentConfig;
  }

  public setPigment(pigment: WetInkPigmentType | WetInkPigmentConfig): void {
    this.activePigmentConfig = this.resolvePigmentConfig(pigment);
    this.activePigment = this.activePigmentConfig.id;
    this.sim.setPigment(this.activePigmentConfig);
    this.renderCurrentFrame();
  }

  public setColor(colorHex: string): void {
    this.setPigment(colorHex);
  }

  public getColor(): string {
    return this.activePigmentConfig?.colorHex || '#181615';
  }

  public setAudioMuted(muted: boolean): void {
    this.audioSynth.setMuted(muted);
  }

  public isAudioMuted(): boolean {
    return this.audioSynth.getMuted();
  }

  public setReadOnly(readOnly: boolean): void {
    if (this.readOnly === readOnly) return;
    this.readOnly = readOnly;
    this.canvas.style.cursor = readOnly ? 'default' : 'crosshair';
    if (readOnly) {
      this.detachEvents();
    } else {
      this.attachEvents();
    }
  }

  public isReadOnly(): boolean {
    return this.readOnly;
  }

  // --- Event Subscription ---

  public on<K extends keyof WetInkEventMap>(event: K, handler: WetInkEventMap[K]): void {
    this.events.on(event, handler);
  }

  public off<K extends keyof WetInkEventMap>(event: K, handler: WetInkEventMap[K]): void {
    this.events.off(event, handler);
  }

  private setLifecycleState(state: WetInkLifecycleState): void {
    if (this.lifecycleState === state) return;
    this.lifecycleState = state;
    this.events.emit('state:change', state);
  }

  // --- Pointer Interactions ---

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
    if (this.readOnly) return;
    this.canvas.setPointerCapture(e.pointerId);

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = rect.width > 0 ? this.canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? this.canvas.height / rect.height : 1;
    const x = Math.max(0, Math.min(this.canvas.width - 1, (e.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(this.canvas.height - 1, (e.clientY - rect.top) * scaleY));
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;
    const now = performance.now();

    this.lastPointerX = x;
    this.lastPointerY = y;
    this.lastPointerTime = now;

    this.currentStroke = {
      tool: this.activeTool,
      startTime: now,
      colorHex: this.getColor(),
      points: [{ x, y, pressure, timeOffset: 0 }]
    };

    this.setLifecycleState('wet');
    this.events.emit('stroke:start', this.currentStroke);

    // Audio start
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
    const scaleX = rect.width > 0 ? this.canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? this.canvas.height / rect.height : 1;
    const x = Math.max(0, Math.min(this.canvas.width - 1, (e.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(this.canvas.height - 1, (e.clientY - rect.top) * scaleY));
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;
    const now = performance.now();
    const timeOffset = now - this.currentStroke.startTime;

    // Instantaneous velocity
    const dt = Math.max(1, now - this.lastPointerTime);
    const dx = x - this.lastPointerX;
    const dy = y - this.lastPointerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const velocity = dist / dt;

    this.lastPointerX = x;
    this.lastPointerY = y;
    this.lastPointerTime = now;

    this.audioSynth.updateMotion(velocity, pressure);

    const pt: WetInkStrokePoint = { x, y, pressure, timeOffset };
    this.currentStroke.points.push(pt);
    this.events.emit('stroke:point', pt);

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
    this.events.emit('stroke:end', this.currentStroke);
    this.currentStroke = null;

    // Transition to Phase 2: SETTLING
    this.setLifecycleState('settling');
    this.settlingStartTime = performance.now();
  }

  // --- Physics Loop ---

  private startActiveLoop(): void {
    if (this.animationFrameId !== null) return;

    const loop = () => {
      if (this.lifecycleState === 'frozen') {
        this.stopActiveLoop();
        return;
      }

      this.sim.advance(WET_INK_DT);
      this.renderCurrentFrame();

      if (this.lifecycleState === 'settling') {
        const elapsedSettling = performance.now() - this.settlingStartTime;
        const totalWater = this.sim.totalWater;

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

  // --- Core Lifecycle Actions ---

  /**
   * Blotting paper action: instantly absorbs surface moisture, fixes pigment, and freezes.
   */
  public blot(): void {
    this.sim.waterFilm.fill(0);
    const dep = this.sim.pigmentDeposited;
    const susp = this.sim.pigmentSuspended;
    for (let i = 0; i < dep.length; i++) {
      dep[i] += susp[i];
      susp[i] = 0;
    }
    this.events.emit('blot');
    this.freeze();
  }

  /**
   * Phase 3: FROZEN (0% CPU, 0 FPS)
   */
  public freeze(): void {
    this.setLifecycleState('frozen');
    this.stopActiveLoop();
    this.renderCurrentFrame();

    const payload: WetInkSavePayload = {
      png: this.exportPNG(),
      svg: this.exportSVG(),
      strokes: this.getStrokes()
    };

    this.events.emit('freeze', payload);
    this.events.emit('save', payload);
  }

  public renderCurrentFrame(): void {
    const imgData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.sim.renderToImageData(imgData, 'composite', 2.4, 0.65);
    this.ctx.putImageData(imgData, 0, 0);
  }

  public clear(): void {
    this.stopActiveLoop();
    this.strokes = [];
    this.sim = this.buildSimulation(
      this.canvas.width,
      this.canvas.height,
      this.activePaper,
      this.activePigment
    );
    this.renderCurrentFrame();
    this.events.emit('clear');
    this.freeze();
  }

  public exportPNG(): string {
    return this.canvas.toDataURL('image/png');
  }

  public exportSVG(options: SVGExportOptions = {}): string {
    return WetInkSVGExporter.export(this.sim, options);
  }

  public loadPreview(pngDataUrl: string): void {
    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
      };
      img.src = pngDataUrl;
    }
    this.setLifecycleState('frozen');
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.clear();
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
      btn.onclick = (e) => {
        e.preventDefault();
        onClick();
      };
      return btn;
    };

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

    const blotBtn = makeBtn('🧻 Blot', 'Blotting Paper: Instantly dry surface ink', () => {
      this.blot();
    });
    bar.appendChild(blotBtn);

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

    const clearBtn = makeBtn('Clear', 'Clear substrate', () => {
      this.clear();
    });
    bar.appendChild(clearBtn);

    return bar;
  }

  public destroy(): void {
    this.stopActiveLoop();
    this.detachEvents();
    this.audioSynth.destroy();
    this.events.removeAllListeners();
    if (this.toolbarEl && this.toolbarEl.parentNode) {
      this.toolbarEl.parentNode.removeChild(this.toolbarEl);
    }
  }
}

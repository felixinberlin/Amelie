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
  WetInkStrokePoint
} from './types';
import { serializeStrokes } from './serialization';

/**
 * ProseMirror / TipTap NodeView for Wet Ink Blocks.
 * 
 * Manages DOM encapsulation, WebGL/2D Canvas simulation, and the 3-Phase Lifecycle:
 * Phase 1: WET (60 FPS on interaction)
 * Phase 2: SETTLING (decay/evaporation until surface water < DRY_EPS)
 * Phase 3: FROZEN (0 FPS, 0% CPU, static ImageBitmap fallback)
 */
export class WetInkNodeView {
  public dom: HTMLElement;
  public contentDOM?: HTMLElement;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sim: WetInkSimulation;
  private brushManager: WetInkBrushManager;
  private currentStroke: WetInkStroke | null = null;
  private strokes: WetInkStroke[] = [];

  private lifecycleState: WetInkLifecycleState = 'frozen';
  private animationFrameId: number | null = null;
  private settlingStartTime: number = 0;
  private dryingLimitMs: number = 4000;

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

    // 1. Build Container DOM
    this.dom = document.createElement('figure');
    this.dom.className = 'wet-ink-block';
    this.dom.style.position = 'relative';
    this.dom.style.display = 'inline-block';
    this.dom.style.margin = '1.5em 0';
    this.dom.style.borderRadius = '6px';
    this.dom.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
    this.dom.style.userSelect = 'none';
    this.dom.style.backgroundColor = '#faf8f5';

    // 2. Setup Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = nodeAttrs.width || options.defaultWidth || 480;
    this.canvas.height = nodeAttrs.height || options.defaultHeight || 160;
    this.canvas.style.display = 'block';
    this.canvas.style.cursor = nodeAttrs.readOnly ? 'default' : 'crosshair';
    this.canvas.style.touchAction = 'none';

    this.ctx = this.canvas.getContext('2d')!;
    this.dom.appendChild(this.canvas);

    // 3. Initialize Physical Simulation Engine
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

    // 4. Attach Event Listeners if not read-only
    if (!nodeAttrs.readOnly && !options.readOnly) {
      this.attachPointerHandlers();
      if (options.enableToolbar) {
        this.dom.appendChild(this.createToolbar());
      }
    }

    // 5. Initial Render / Rehydration
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

  private onPointerDown(e: PointerEvent): void {
    if (this.nodeAttrs.readOnly) return;
    this.canvas.setPointerCapture(e.pointerId);

    const rect = this.canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(this.canvas.width - 1, e.clientX - rect.left));
    const y = Math.max(0, Math.min(this.canvas.height - 1, e.clientY - rect.top));
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;

    this.currentStroke = {
      tool: 'fountain-pen',
      startTime: performance.now(),
      points: [{ x, y, pressure, timeOffset: 0 }]
    };

    // Transition to Phase 1: WET
    this.lifecycleState = 'wet';

    this.brushManager.stroke(
      this.sim,
      x,
      y,
      pressure,
      { tool: 'fountain-pen', baseRadius: 2.2, waterRatio: 1.0, dryBrush: false },
      true,
      performance.now()
    );

    this.startActiveLoop();
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.currentStroke || this.lifecycleState !== 'wet') return;

    const rect = this.canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(this.canvas.width - 1, e.clientX - rect.left));
    const y = Math.max(0, Math.min(this.canvas.height - 1, e.clientY - rect.top));
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;
    const timeOffset = performance.now() - this.currentStroke.startTime;

    this.currentStroke.points.push({ x, y, pressure, timeOffset });

    this.brushManager.stroke(
      this.sim,
      x,
      y,
      pressure,
      { tool: 'fountain-pen', baseRadius: 2.2, waterRatio: 1.0, dryBrush: false },
      false,
      performance.now()
    );
  }

  private onPointerUp(e: PointerEvent): void {
    if (!this.currentStroke) return;
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

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
   * Phase 3: FROZEN (0% CPU, 0 FPS)
   */
  public freeze(): void {
    this.lifecycleState = 'frozen';
    this.stopActiveLoop();

    // Final render pass
    this.renderCurrentFrame();

    // Export static PNG preview
    const previewPng = this.canvas.toDataURL('image/png');

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
    bar.style.gap = '6px';
    bar.style.padding = '4px 8px';
    bar.style.borderRadius = '4px';
    bar.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
    bar.style.backdropFilter = 'blur(4px)';
    bar.style.fontSize = '12px';

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = 'Clear';
    clearBtn.style.border = 'none';
    clearBtn.style.background = 'none';
    clearBtn.style.cursor = 'pointer';
    clearBtn.style.color = '#777';
    clearBtn.onclick = (e) => {
      e.preventDefault();
      this.clear();
    };

    bar.appendChild(clearBtn);
    return bar;
  }

  public destroy(): void {
    this.stopActiveLoop();
  }
}

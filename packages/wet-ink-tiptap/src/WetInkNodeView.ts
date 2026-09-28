import {
  WetInkController,
  WetInkSimulation,
  WetInkLifecycleState,
  WetInkStroke,
  WetInkToolType,
  SVGExportOptions
} from '../../wet-ink-core/src/index';
import {
  WetInkNodeAttributes,
  WetInkExtensionOptions
} from './types';

/**
 * ProseMirror / TipTap NodeView for Wet Ink Blocks.
 * 
 * Powered by the headless @wet-ink/core WetInkController.
 * Adapts DOM encapsulation and TipTap transaction synchronization.
 */
export class WetInkNodeView {
  public dom: HTMLElement;
  public contentDOM?: HTMLElement;

  private controller: WetInkController;
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

    // 1. Build Container Figure
    this.dom = document.createElement('figure');
    this.dom.className = 'wet-ink-block';
    this.dom.style.position = 'relative';
    this.dom.style.display = 'inline-block';
    this.dom.style.margin = '1.5em 0';
    this.dom.style.borderRadius = '6px';
    this.dom.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
    this.dom.style.userSelect = 'none';
    this.dom.style.backgroundColor = '#faf8f5';

    // 2. Instantiate Modular Headless Controller
    this.controller = new WetInkController({
      target: this.dom,
      width: nodeAttrs.width || options.defaultWidth || 480,
      height: nodeAttrs.height || options.defaultHeight || 160,
      paper: nodeAttrs.paper || options.defaultPaper,
      pigment: nodeAttrs.pigment || options.defaultPigment,
      tool: options.defaultTool || 'fountain-pen',
      enableAudio: options.enableAudio !== false && nodeAttrs.soundMuted !== true,
      soundMuted: nodeAttrs.soundMuted === true,
      readOnly: nodeAttrs.readOnly || options.readOnly || false,
      dryingLimitMs: options.dryingTimeLimit || 4000,
      initialStrokes: nodeAttrs.strokes,
      initialImage: nodeAttrs.previewImage,
      showToolbar: options.enableToolbar && !nodeAttrs.readOnly && !options.readOnly,
      onSave: (payload) => {
        const updatedAttrs: Partial<WetInkNodeAttributes> = {
          strokes: payload.strokes,
          previewImage: payload.png,
          isFrozen: true
        };
        this.nodeAttrs = { ...this.nodeAttrs, ...updatedAttrs };
        this.updateAttributes(updatedAttrs);

        if (this.options.onSave) {
          this.options.onSave({
            pngDataUrl: payload.png,
            svgData: payload.svg,
            strokes: payload.strokes,
            attributes: this.nodeAttrs
          });
        }
      }
    });
  }

  public getLifecycleState(): WetInkLifecycleState {
    return this.controller.getLifecycleState();
  }

  public getSimulation(): WetInkSimulation {
    return this.controller.getSimulation();
  }

  public getController(): WetInkController {
    return this.controller;
  }

  public setTool(tool: WetInkToolType): void {
    this.controller.setTool(tool);
  }

  public setAudioMuted(muted: boolean): void {
    this.controller.setAudioMuted(muted);
    this.nodeAttrs = { ...this.nodeAttrs, soundMuted: muted };
    this.updateAttributes({ soundMuted: muted });
  }

  public blot(): void {
    this.controller.blot();
  }

  public freeze(): void {
    this.controller.freeze();
  }

  public renderCurrentFrame(): void {
    this.controller.renderCurrentFrame();
  }

  public exportPNG(): string {
    return this.controller.exportPNG();
  }

  public exportSVG(options: SVGExportOptions = {}): string {
    return this.controller.exportSVG(options);
  }

  public clear(): void {
    this.controller.clear();
    this.updateAttributes({
      strokes: [],
      previewImage: null,
      isFrozen: true
    });
  }

  public destroy(): void {
    this.controller.destroy();
  }
}

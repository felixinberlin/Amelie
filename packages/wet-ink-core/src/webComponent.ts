import { WetInkController } from './WetInkController';
import { WetInkPaperType, WetInkPigmentType, WetInkToolType } from './types';

const BaseElement: typeof HTMLElement = typeof HTMLElement !== 'undefined'
  ? HTMLElement
  : (class {} as any);

/**
 * Standard Web Component (<wet-ink-signature>)
 * Works natively in any web browser, Vue, Svelte, Angular, WordPress, or Vanilla HTML.
 */
export class WetInkSignatureElement extends BaseElement {
  private controller: WetInkController | null = null;

  static get observedAttributes() {
    return ['paper', 'pigment', 'color', 'tool', 'width', 'height', 'audio', 'readonly', 'toolbar'];
  }

  connectedCallback() {
    if (this.controller) return;

    const paper = (this.getAttribute('paper') as WetInkPaperType) || 'buetten';
    const color = this.getAttribute('color');
    const pigment = color || (this.getAttribute('pigment') as WetInkPigmentType) || 'eisengallus';
    const tool = (this.getAttribute('tool') as WetInkToolType) || 'fountain-pen';
    const width = parseInt(this.getAttribute('width') || '480', 10);
    const height = parseInt(this.getAttribute('height') || '160', 10);
    const enableAudio = this.getAttribute('audio') !== 'false';
    const readOnly = this.hasAttribute('readonly') && this.getAttribute('readonly') !== 'false';
    const showToolbar = this.getAttribute('toolbar') !== 'false';

    this.controller = new WetInkController({
      target: this as any,
      width,
      height,
      paper,
      pigment,
      tool,
      enableAudio,
      readOnly,
      showToolbar,
      onSave: (payload) => {
        this.dispatchEvent(new CustomEvent('wetink:save', { detail: payload, bubbles: true }));
      },
      onStateChange: (state) => {
        this.dispatchEvent(new CustomEvent('wetink:statechange', { detail: { state }, bubbles: true }));
      }
    });
  }

  disconnectedCallback() {
    if (this.controller) {
      this.controller.destroy();
      this.controller = null;
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (!this.controller || oldValue === newValue) return;

    switch (name) {
      case 'tool':
        if (newValue) this.controller.setTool(newValue as WetInkToolType);
        break;
      case 'paper':
        if (newValue) this.controller.setPaper(newValue as WetInkPaperType);
        break;
      case 'pigment':
        if (newValue) this.controller.setPigment(newValue as WetInkPigmentType);
        break;
      case 'color':
        if (newValue) this.controller.setColor(newValue);
        break;
      case 'audio':
        this.controller.setAudioMuted(newValue === 'false');
        break;
      case 'readonly':
        this.controller.setReadOnly(newValue !== null && newValue !== 'false');
        break;
    }
  }

  // Element API methods
  public exportPNG(): string {
    return this.controller ? this.controller.exportPNG() : '';
  }

  public exportSVG(): string {
    return this.controller ? this.controller.exportSVG() : '';
  }

  public blot(): void {
    this.controller?.blot();
  }

  public clear(): void {
    this.controller?.clear();
  }

  public freeze(): void {
    this.controller?.freeze();
  }

  public getController(): WetInkController | null {
    return this.controller;
  }
}

// Auto-register custom element if in browser window context
if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
  if (!customElements.get('wet-ink-signature')) {
    customElements.define('wet-ink-signature', WetInkSignatureElement);
  }
}

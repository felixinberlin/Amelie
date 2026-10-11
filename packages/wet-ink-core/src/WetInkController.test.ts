import { describe, it, expect, vi } from 'vitest';
import { WetInkEventEmitter } from './events';
import { WetInkController } from './WetInkController';
import { WetInkSignatureElement } from './webComponent';
import { serializeStrokes, deserializeStrokes } from './serialization';
import { PenAudioSynthesizer } from './audio';
import { WetInkSVGExporter } from './svgExport';

describe('@wet-ink/core — Headless Architecture', () => {
  describe('WetInkEventEmitter', () => {
    it('registers, triggers, and deregisters lifecycle events', () => {
      const emitter = new WetInkEventEmitter();
      const stateLog: string[] = [];

      const handler = (state: any) => {
        stateLog.push(state);
      };

      emitter.on('state:change', handler);
      emitter.emit('state:change', 'wet');
      emitter.emit('state:change', 'settling');
      emitter.emit('state:change', 'frozen');

      expect(stateLog).toEqual(['wet', 'settling', 'frozen']);

      emitter.off('state:change', handler);
      emitter.emit('state:change', 'wet');
      expect(stateLog).toHaveLength(3); // No new events added
    });
  });

  describe('WetInkController', () => {
    it('instantiates headless controller and manages tools & audio', () => {
      // Mock Canvas and Context for Headless Node test environment
      const mockCanvas = {
        getContext: () => ({
          createImageData: () => ({ data: new Uint8ClampedArray(480 * 160 * 4) }),
          putImageData: vi.fn(),
          drawImage: vi.fn()
        }),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 480, height: 160 }),
        setPointerCapture: vi.fn(),
        releasePointerCapture: vi.fn(),
        toDataURL: () => 'data:image/png;base64,mock',
        style: {}
      } as unknown as HTMLCanvasElement;

      const stateChanges: string[] = [];
      const controller = new WetInkController({
        target: mockCanvas,
        width: 480,
        height: 160,
        paper: 'buetten',
        pigment: 'eisengallus',
        tool: 'fountain-pen',
        enableAudio: true,
        onStateChange: (state) => stateChanges.push(state)
      });

      expect(controller.getLifecycleState()).toBe('frozen');
      expect(controller.getTool()).toBe('fountain-pen');
      expect(controller.getPaper()).toBe('buetten');
      expect(controller.getPigment()).toBe('eisengallus');
      expect(controller.isAudioMuted()).toBe(false);

      // Tool change
      controller.setTool('sumi-brush');
      expect(controller.getTool()).toBe('sumi-brush');

      // Audio mute
      controller.setAudioMuted(true);
      expect(controller.isAudioMuted()).toBe(true);

      // Export methods
      expect(controller.exportPNG()).toBe('data:image/png;base64,mock');
      const svg = controller.exportSVG();
      expect(svg).toContain('<svg');

      // Blotting paper action
      let blotFired = false;
      controller.on('blot', () => { blotFired = true; });
      controller.blot();
      expect(blotFired).toBe(true);

      // Calligraphy brushes and Xuan paper substrates
      controller.setTool('langhao');
      expect(controller.getTool()).toBe('langhao');
      controller.setTool('yanghao');
      expect(controller.getTool()).toBe('yanghao');
      controller.setTool('jianhao');
      expect(controller.getTool()).toBe('jianhao');

      controller.setPaper('sheng-xuan');
      expect(controller.getPaper()).toBe('sheng-xuan');
      controller.setPaper('ban-shu-xuan');
      expect(controller.getPaper()).toBe('ban-shu-xuan');
      controller.setPaper('shu-xuan');
      expect(controller.getPaper()).toBe('shu-xuan');

      // Seal stamping API & events
      let stampedSealEvent: any = null;
      controller.on('seal:stamp', (seal) => {
        stampedSealEvent = seal;
      });

      controller.setSealOptions({ style: 'baiwen', shape: 'round', glyph: 'amelie', size: 30 });
      expect(controller.getSealOptions()).toMatchObject({
        style: 'baiwen',
        shape: 'round',
        glyph: 'amelie',
        size: 30
      });

      controller.stampSeal(120, 60);
      expect(stampedSealEvent).toEqual({
        x: 120,
        y: 60,
        options: expect.objectContaining({
          style: 'baiwen',
          shape: 'round',
          glyph: 'amelie',
          size: 30
        })
      });
      expect(controller.getLifecycleState()).toBe('settling');

      // Scientific morphology metrics & fractal dimension
      const metrics = controller.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.fractalDimension).toBeDefined();
      expect(metrics.anisotropy).toBeDefined();

      const fractal = controller.getFractalAnalysis();
      expect(fractal.fractalDimension).toBeDefined();

      // Destruction
      controller.destroy();
    });

    it('handles seal-stamp pointerdown as single tactile stamp', () => {
      let pointerDownListener: any = null;
      const mockCanvas = {
        getContext: () => ({
          createImageData: () => ({ data: new Uint8ClampedArray(480 * 160 * 4) }),
          putImageData: vi.fn(),
          drawImage: vi.fn()
        }),
        addEventListener: vi.fn((event, handler) => {
          if (event === 'pointerdown') pointerDownListener = handler;
        }),
        removeEventListener: vi.fn(),
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 480, height: 160 }),
        setPointerCapture: vi.fn(),
        releasePointerCapture: vi.fn(),
        toDataURL: () => 'data:image/png;base64,mock',
        style: {}
      } as unknown as HTMLCanvasElement;

      let strokeEndCalled = false;
      const controller = new WetInkController({
        target: mockCanvas,
        tool: 'seal-stamp',
        onStrokeEnd: (stroke) => {
          expect(stroke.tool).toBe('seal-stamp');
          strokeEndCalled = true;
        }
      });

      expect(pointerDownListener).toBeDefined();
      pointerDownListener({
        pointerId: 1,
        clientX: 100,
        clientY: 50,
        pressure: 0.8
      });

      expect(strokeEndCalled).toBe(true);
      expect(controller.getStrokes()).toHaveLength(1);
      expect(controller.getStrokes()[0].tool).toBe('seal-stamp');
      expect(controller.getLifecycleState()).toBe('settling');

      controller.destroy();
    });
  });

  describe('Native Web Component', () => {
    it('defines WetInkSignatureElement custom element', () => {
      expect(WetInkSignatureElement).toBeDefined();
      expect(typeof WetInkSignatureElement).toBe('function');
    });
  });
});

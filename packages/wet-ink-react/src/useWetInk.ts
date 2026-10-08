import { useEffect, useRef, useState, useCallback, RefObject } from 'react';
import {
  WetInkController,
  WetInkControllerOptions,
  WetInkLifecycleState,
  WetInkPaperType,
  WetInkPigmentType,
  WetInkToolType,
  WetInkStroke,
  SVGExportOptions,
  WetInkSavePayload
} from '../../wet-ink-core/src/index';

export interface UseWetInkOptions extends Omit<WetInkControllerOptions, 'target'> {
  onStrokeEnd?: (stroke: WetInkStroke) => void;
  onSave?: (payload: WetInkSavePayload) => void;
}

export interface UseWetInkReturn {
  controller: WetInkController | null;
  state: WetInkLifecycleState;
  strokes: WetInkStroke[];
  blot: () => void;
  clear: () => void;
  freeze: () => void;
  setTool: (tool: WetInkToolType) => void;
  setPaper: (paper: WetInkPaperType) => void;
  setPigment: (pigment: WetInkPigmentType) => void;
  setAudioMuted: (muted: boolean) => void;
  exportPNG: () => string;
  exportSVG: (options?: SVGExportOptions) => string;
}

/**
 * React Hook for building custom fluid ink & watercolor canvases.
 * Binds a framework-agnostic WetInkController to any HTMLCanvasElement.
 */
export function useWetInk(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseWetInkOptions = {}
): UseWetInkReturn {
  const controllerRef = useRef<WetInkController | null>(null);
  const [state, setState] = useState<WetInkLifecycleState>('frozen');
  const [strokes, setStrokes] = useState<WetInkStroke[]>(options.initialStrokes || []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = new WetInkController({
      ...options,
      target: canvas,
      onStateChange: (newState) => {
        setState(newState);
        options.onStateChange?.(newState);
      },
      onStrokeEnd: (stroke) => {
        setStrokes((prev) => [...prev, stroke]);
        options.onStrokeEnd?.(stroke);
      },
      onSave: (payload) => {
        options.onSave?.(payload);
      }
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [
    canvasRef,
    options.width,
    options.height,
    options.paper,
    options.pigment,
    options.enableAudio,
    options.readOnly
  ]);

  const blot = useCallback(() => {
    controllerRef.current?.blot();
  }, []);

  const clear = useCallback(() => {
    controllerRef.current?.clear();
    setStrokes([]);
  }, []);

  const freeze = useCallback(() => {
    controllerRef.current?.freeze();
  }, []);

  const setTool = useCallback((tool: WetInkToolType) => {
    controllerRef.current?.setTool(tool);
  }, []);

  const setPaper = useCallback((paper: WetInkPaperType) => {
    controllerRef.current?.setPaper(paper);
  }, []);

  const setPigment = useCallback((pigment: WetInkPigmentType) => {
    controllerRef.current?.setPigment(pigment);
  }, []);

  const setAudioMuted = useCallback((muted: boolean) => {
    controllerRef.current?.setAudioMuted(muted);
  }, []);

  const exportPNG = useCallback(() => {
    return controllerRef.current ? controllerRef.current.exportPNG() : '';
  }, []);

  const exportSVG = useCallback((opts?: SVGExportOptions) => {
    return controllerRef.current ? controllerRef.current.exportSVG(opts) : '';
  }, []);

  return {
    controller: controllerRef.current,
    state,
    strokes,
    blot,
    clear,
    freeze,
    setTool,
    setPaper,
    setPigment,
    setAudioMuted,
    exportPNG,
    exportSVG
  };
}

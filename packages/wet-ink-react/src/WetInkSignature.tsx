import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import {
  WetInkController,
  WetInkPaperType,
  WetInkPigmentType,
  WetInkToolType,
  WetInkStroke,
  WetInkLifecycleState,
  SVGExportOptions,
  WetInkSavePayload
} from '../../wet-ink-core/src/index';

export interface WetInkSignatureProps {
  width?: number;
  height?: number;
  paper?: WetInkPaperType;
  pigment?: WetInkPigmentType;
  tool?: WetInkToolType;
  enableAudio?: boolean;
  enableToolbar?: boolean;
  readOnly?: boolean;
  initialImage?: string | null;
  initialStrokes?: WetInkStroke[];
  className?: string;
  style?: React.CSSProperties;
  onStrokeEnd?: (stroke: WetInkStroke) => void;
  onSave?: (payload: WetInkSavePayload) => void;
}

export interface WetInkSignatureHandle {
  exportPNG: () => string;
  exportSVG: (options?: SVGExportOptions) => string;
  clear: () => void;
  blot: () => void;
  freeze: () => void;
  setTool: (tool: WetInkToolType) => void;
  setPaper: (paper: WetInkPaperType) => void;
  setPigment: (pigment: WetInkPigmentType) => void;
  setAudioMuted: (muted: boolean) => void;
  getLifecycleState: () => WetInkLifecycleState;
  getController: () => WetInkController | null;
}

/**
 * Drop-in React Component for Wet Ink Pro.
 * Physical fluid simulation, real-time procedural audio, and resolution-independent vector SVG exports.
 */
export const WetInkSignature = forwardRef<WetInkSignatureHandle, WetInkSignatureProps>(
  (props, ref) => {
    const {
      width = 480,
      height = 160,
      paper = 'buetten',
      pigment = 'eisengallus',
      tool = 'fountain-pen',
      enableAudio = true,
      enableToolbar = true,
      readOnly = false,
      initialImage = null,
      initialStrokes = [],
      className,
      style,
      onStrokeEnd,
      onSave
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<WetInkController | null>(null);

    useImperativeHandle(ref, () => ({
      exportPNG: () => controllerRef.current ? controllerRef.current.exportPNG() : '',
      exportSVG: (options?: SVGExportOptions) => controllerRef.current ? controllerRef.current.exportSVG(options) : '',
      clear: () => controllerRef.current?.clear(),
      blot: () => controllerRef.current?.blot(),
      freeze: () => controllerRef.current?.freeze(),
      setTool: (t: WetInkToolType) => controllerRef.current?.setTool(t),
      setPaper: (p: WetInkPaperType) => controllerRef.current?.setPaper(p),
      setPigment: (pig: WetInkPigmentType) => controllerRef.current?.setPigment(pig),
      setAudioMuted: (muted: boolean) => controllerRef.current?.setAudioMuted(muted),
      getLifecycleState: () => controllerRef.current ? controllerRef.current.getLifecycleState() : 'frozen',
      getController: () => controllerRef.current
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }

      const controller = new WetInkController({
        target: containerRef.current,
        width,
        height,
        paper,
        pigment,
        tool,
        enableAudio,
        showToolbar: enableToolbar,
        readOnly,
        initialImage,
        initialStrokes,
        onStrokeEnd,
        onSave
      });

      controllerRef.current = controller;

      return () => {
        controller.destroy();
        controllerRef.current = null;
      };
    }, [width, height, paper, pigment, readOnly, enableAudio, enableToolbar]);

    useEffect(() => {
      if (controllerRef.current) {
        controllerRef.current.setTool(tool);
      }
    }, [tool]);

    return (
      <div
        ref={containerRef}
        className={`wet-ink-signature-container ${className || ''}`}
        style={{
          display: 'inline-block',
          position: 'relative',
          ...style
        }}
      />
    );
  }
);

WetInkSignature.displayName = 'WetInkSignature';

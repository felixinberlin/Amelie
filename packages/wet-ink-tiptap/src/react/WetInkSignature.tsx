import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import {
  WetInkPaperType,
  WetInkPigmentType,
  WetInkToolType,
  WetInkStroke,
  WetInkLifecycleState,
  SVGExportOptions
} from '../types';
import { WetInkNodeView } from '../WetInkNodeView';

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
  onStrokeEnd?: (strokes: WetInkStroke[]) => void;
  onSave?: (data: { png: string; svg: string; strokes: WetInkStroke[] }) => void;
}

export interface WetInkSignatureHandle {
  exportPNG: () => string;
  exportSVG: (options?: SVGExportOptions) => string;
  clear: () => void;
  blot: () => void;
  freeze: () => void;
  setTool: (tool: WetInkToolType) => void;
  setAudioMuted: (muted: boolean) => void;
  getLifecycleState: () => WetInkLifecycleState;
}

/**
 * Drop-in React Component for Wet Ink Pro.
 * Provides physical fluid paper simulation, nib acoustics, and vector SVG exports
 * with zero configuration needed.
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
    const nodeViewRef = useRef<WetInkNodeView | null>(null);

    useImperativeHandle(ref, () => ({
      exportPNG: () => {
        return nodeViewRef.current ? nodeViewRef.current.exportPNG() : '';
      },
      exportSVG: (options?: SVGExportOptions) => {
        return nodeViewRef.current ? nodeViewRef.current.exportSVG(options) : '';
      },
      clear: () => {
        nodeViewRef.current?.clear();
      },
      blot: () => {
        nodeViewRef.current?.blot();
      },
      freeze: () => {
        nodeViewRef.current?.freeze();
      },
      setTool: (t: WetInkToolType) => {
        nodeViewRef.current?.setTool(t);
      },
      setAudioMuted: (muted: boolean) => {
        nodeViewRef.current?.setAudioMuted(muted);
      },
      getLifecycleState: () => {
        return nodeViewRef.current ? nodeViewRef.current.getLifecycleState() : 'frozen';
      }
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      // Clean existing children
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }

      const nodeView = new WetInkNodeView(
        {
          paper,
          pigment,
          width,
          height,
          strokes: initialStrokes,
          previewImage: initialImage,
          readOnly,
          isFrozen: !!initialImage
        },
        {
          defaultPaper: paper,
          defaultPigment: pigment,
          defaultTool: tool,
          defaultWidth: width,
          defaultHeight: height,
          dryingTimeLimit: 4000,
          enableToolbar,
          enableAudio,
          readOnly,
          onSave: (data) => {
            if (onSave) {
              onSave({
                png: data.pngDataUrl,
                svg: data.svgData || '',
                strokes: data.strokes
              });
            }
            if (onStrokeEnd) {
              onStrokeEnd(data.strokes);
            }
          }
        },
        () => {
          // Attribute update callback
        }
      );

      nodeView.setTool(tool);
      containerRef.current.appendChild(nodeView.dom);
      nodeViewRef.current = nodeView;

      return () => {
        nodeView.destroy();
        nodeViewRef.current = null;
      };
    }, [width, height, paper, pigment, readOnly, enableAudio, enableToolbar]);

    // Handle tool change dynamically
    useEffect(() => {
      if (nodeViewRef.current) {
        nodeViewRef.current.setTool(tool);
      }
    }, [tool]);

    return (
      <div
        ref={containerRef}
        className={`wet-ink-signature-wrapper ${className || ''}`}
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

import type { WetInkPigmentConfig } from '../../../src/engine/wet-ink/presets';

export type WetInkPaperType = 'buetten' | 'washi' | 'aquarell-rau' | 'kopierpapier';
export type WetInkPigmentPresetId =
  | 'sumi'
  | 'sepia'
  | 'preussischblau'
  | 'koenigsblau'
  | 'kadmiumgelb'
  | 'zinnober'
  | 'krapplack'
  | 'viridian'
  | 'eisengallus'
  | 'indigo'
  | 'aquarell-rot';
export type WetInkPigmentType = WetInkPigmentPresetId | string;
export type WetInkToolType = 'fountain-pen' | 'sumi-brush' | 'wash-brush' | 'dip-pen';
export type WetInkLifecycleState = 'wet' | 'settling' | 'frozen';

export type { WetInkPigmentConfig };

export interface WetInkStrokePoint {
  x: number;
  y: number;
  pressure: number;
  timeOffset: number; // ms offset from stroke start
}

export interface WetInkStroke {
  tool: WetInkToolType;
  points: WetInkStrokePoint[];
  colorHex?: string;
  startTime: number;
}

export interface SVGExportOptions {
  thresholds?: {
    wash?: number;
    midtone?: number;
    core?: number;
  };
  colorHex?: string;
  backgroundColor?: string;
  simplifyTolerance?: number;
  xmlDeclaration?: boolean;
}

export interface WetInkSavePayload {
  png: string;
  svg: string;
  strokes: WetInkStroke[];
}

export interface WetInkEventMap {
  'state:change': (state: WetInkLifecycleState) => void;
  'stroke:start': (stroke: WetInkStroke) => void;
  'stroke:point': (point: WetInkStrokePoint) => void;
  'stroke:end': (stroke: WetInkStroke) => void;
  'blot': () => void;
  'clear': () => void;
  'freeze': (payload: WetInkSavePayload) => void;
  'save': (payload: WetInkSavePayload) => void;
}

export interface WetInkControllerOptions {
  /** Target canvas element or container element */
  target: HTMLCanvasElement | HTMLElement;
  /** Width in px (default: 480) */
  width?: number;
  /** Height in px (default: 160) */
  height?: number;
  /** Paper substrate preset (default: 'buetten') */
  paper?: WetInkPaperType;
  /** Pigment formulation preset, custom hex string, or WetInkPigmentConfig (default: 'eisengallus') */
  pigment?: WetInkPigmentType | WetInkPigmentConfig;
  /** Drawing tool nib preset (default: 'fountain-pen') */
  tool?: WetInkToolType;
  /** Enable real-time Web Audio nib friction acoustic synthesis (default: true) */
  enableAudio?: boolean;
  /** Initial audio mute state (default: false) */
  soundMuted?: boolean;
  /** Read-only mode (default: false) */
  readOnly?: boolean;
  /** Maximum settling duration before automatic freezing in ms (default: 4000) */
  dryingLimitMs?: number;
  /** Initial stroke history to restore */
  initialStrokes?: WetInkStroke[];
  /** Initial baked raster preview PNG (data URL) */
  initialImage?: string | null;
  /** Show built-in floating toolbar (default: false) */
  showToolbar?: boolean;
  /** Event callbacks */
  onStateChange?: (state: WetInkLifecycleState) => void;
  onStrokeStart?: (stroke: WetInkStroke) => void;
  onStrokePoint?: (point: WetInkStrokePoint) => void;
  onStrokeEnd?: (stroke: WetInkStroke) => void;
  onSave?: (payload: WetInkSavePayload) => void;
}

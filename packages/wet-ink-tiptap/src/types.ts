export type WetInkPaperType = 'buetten' | 'washi' | 'aquarell-rau' | 'kopierpapier';
export type WetInkPigmentType = 'sumi' | 'sepia' | 'eisengallus' | 'indigo' | 'aquarell-rot';
export type WetInkToolType = 'fountain-pen' | 'sumi-brush' | 'wash-brush' | 'dip-pen';
export type WetInkLifecycleState = 'wet' | 'settling' | 'frozen';

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

export interface WetInkNodeAttributes {
  paper: WetInkPaperType;
  pigment: WetInkPigmentType;
  width: number;
  height: number;
  strokes: WetInkStroke[];
  previewImage: string | null; // Base64 PNG data URL of dried ink
  caption?: string;
  readOnly?: boolean;
  isFrozen?: boolean;
  soundMuted?: boolean;
}

export interface WetInkExtensionOptions {
  defaultPaper: WetInkPaperType;
  defaultPigment: WetInkPigmentType;
  defaultTool?: WetInkToolType;
  defaultWidth: number;
  defaultHeight: number;
  dryingTimeLimit: number; // max settling duration in ms (default: 4000)
  enableToolbar: boolean;
  enableAudio: boolean;    // Web Audio nib synthesizer
  readOnly: boolean;
  onSave?: (data: { pngDataUrl: string; svgData?: string; strokes: WetInkStroke[]; attributes: WetInkNodeAttributes }) => void;
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

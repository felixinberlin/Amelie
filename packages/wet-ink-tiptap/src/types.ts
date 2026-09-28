export type WetInkPaperType = 'buetten' | 'washi' | 'aquarell-rau' | 'kopierpapier';
export type WetInkPigmentType = 'sumi' | 'sepia' | 'eisengallus' | 'indigo' | 'aquarell-rot';
export type WetInkLifecycleState = 'wet' | 'settling' | 'frozen';

export interface WetInkStrokePoint {
  x: number;
  y: number;
  pressure: number;
  timeOffset: number; // ms offset from stroke start
}

export interface WetInkStroke {
  tool: 'fountain-pen' | 'sumi-brush' | 'wash-brush';
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
}

export interface WetInkExtensionOptions {
  defaultPaper: WetInkPaperType;
  defaultPigment: WetInkPigmentType;
  defaultWidth: number;
  defaultHeight: number;
  dryingTimeLimit: number; // max settling duration in ms (default: 4000)
  enableToolbar: boolean;
  readOnly: boolean;
  onSave?: (data: { pngDataUrl: string; strokes: WetInkStroke[]; attributes: WetInkNodeAttributes }) => void;
}

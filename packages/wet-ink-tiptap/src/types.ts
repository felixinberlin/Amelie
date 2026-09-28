export * from '../../wet-ink-core/src/types';
import {
  WetInkPaperType,
  WetInkPigmentType,
  WetInkToolType,
  WetInkStroke
} from '../../wet-ink-core/src/types';

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

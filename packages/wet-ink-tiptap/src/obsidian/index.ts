import { WetInkNodeView } from '../WetInkNodeView';
import { WetInkNodeAttributes, WetInkPaperType, WetInkPigmentType } from '../types';
import { parseStrokes } from '../serialization';

export interface ObsidianWetInkOptions {
  defaultPaper?: WetInkPaperType;
  defaultPigment?: WetInkPigmentType;
  defaultWidth?: number;
  defaultHeight?: number;
  enableAudio?: boolean;
}

/**
 * Obsidian Markdown CodeBlock Processor Adapter.
 * 
 * Usage in Obsidian Plugin main.ts:
 * ```ts
 * import { Plugin } from 'obsidian';
 * import { registerWetInkCodeBlock } from '@wet-ink/pro/obsidian';
 * 
 * export default class MyPlugin extends Plugin {
 *   onload() {
 *     registerWetInkCodeBlock(this, { enableAudio: true });
 *   }
 * }
 * ```
 * 
 * Markdown syntax in note:
 * ````wet-ink
 * paper: washi
 * pigment: eisengallus
 * width: 480
 * height: 160
 * strokes: eyJ0Ijox... (or empty for new signature pad)
 * ````
 */
export function registerWetInkCodeBlock(plugin: any, options: ObsidianWetInkOptions = {}) {
  if (!plugin || typeof plugin.registerMarkdownCodeBlockProcessor !== 'function') {
    throw new Error('registerWetInkCodeBlock must be called with an active Obsidian Plugin instance.');
  }

  plugin.registerMarkdownCodeBlockProcessor('wet-ink', (source: string, el: HTMLElement, ctx: any) => {
    // Parse key-value block configuration
    const lines = source.split('\n');
    const config: Record<string, string> = {};
    for (const line of lines) {
      const match = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
      if (match) {
        config[match[1].toLowerCase()] = match[2].trim();
      }
    }

    const paper = (config.paper as WetInkPaperType) || options.defaultPaper || 'buetten';
    const pigment = (config.pigment as WetInkPigmentType) || options.defaultPigment || 'eisengallus';
    const width = parseInt(config.width, 10) || options.defaultWidth || 480;
    const height = parseInt(config.height, 10) || options.defaultHeight || 160;
    const strokesRaw = config.strokes || '';
    const strokes = strokesRaw ? parseStrokes(strokesRaw) : [];
    const readOnly = config.readonly === 'true' || (strokes.length > 0 && config.editable !== 'true');

    const nodeAttrs: WetInkNodeAttributes = {
      paper,
      pigment,
      width,
      height,
      strokes,
      previewImage: null,
      readOnly,
      isFrozen: readOnly
    };

    const nodeView = new WetInkNodeView(
      nodeAttrs,
      {
        defaultPaper: paper,
        defaultPigment: pigment,
        defaultWidth: width,
        defaultHeight: height,
        dryingTimeLimit: 3500,
        enableToolbar: !readOnly,
        enableAudio: options.enableAudio ?? true,
        readOnly,
        onSave: (data) => {
          // If interactive and in an active note context, save back to document
          if (!readOnly && ctx && typeof ctx.getSectionInfo === 'function') {
            const section = ctx.getSectionInfo(el);
            if (section) {
              const file = plugin.app.vault.getAbstractFileByPath(ctx.sourcePath);
              if (file) {
                // Update codeblock content in note
                const newContent = `paper: ${paper}\npigment: ${pigment}\nwidth: ${width}\nheight: ${height}\nstrokes: ${JSON.stringify(data.strokes)}\n`;
                plugin.app.vault.process(file, (data: string) => {
                  const fileLines = data.split('\n');
                  fileLines.splice(section.lineStart + 1, section.lineEnd - section.lineStart - 1, newContent);
                  return fileLines.join('\n');
                });
              }
            }
          }
        }
      },
      () => {}
    );

    el.appendChild(nodeView.dom);
  });
}

import {
  WetInkController,
  WetInkPaperType,
  WetInkPigmentType,
  WetInkToolType,
  deserializeStrokes
} from '../../wet-ink-core/src/index';

export interface ObsidianWetInkOptions {
  defaultPaper?: WetInkPaperType;
  defaultPigment?: WetInkPigmentType;
  defaultTool?: WetInkToolType;
  defaultWidth?: number;
  defaultHeight?: number;
  enableAudio?: boolean;
}

/**
 * Obsidian Markdown CodeBlock Processor Adapter.
 * 
 * Powered by the headless @wet-ink/core WetInkController.
 * 
 * Usage in an Obsidian plugin:
 * ```ts
 * import { Plugin } from 'obsidian';
 * import { registerWetInkCodeBlock } from '@wet-ink/obsidian';
 * 
 * export default class MyPlugin extends Plugin {
 *   onload() {
 *     registerWetInkCodeBlock(this, { enableAudio: true });
 *   }
 * }
 * ```
 */
export function registerWetInkCodeBlock(plugin: any, options: ObsidianWetInkOptions = {}) {
  if (!plugin || typeof plugin.registerMarkdownCodeBlockProcessor !== 'function') {
    throw new Error('registerWetInkCodeBlock requires an active Obsidian Plugin instance.');
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
    const tool = (config.tool as WetInkToolType) || options.defaultTool || 'fountain-pen';
    const width = parseInt(config.width, 10) || options.defaultWidth || 480;
    const height = parseInt(config.height, 10) || options.defaultHeight || 160;
    const strokesRaw = config.strokes || '';
    const initialStrokes = strokesRaw ? deserializeStrokes(strokesRaw) : [];
    const readOnly = config.readonly === 'true' || (initialStrokes.length > 0 && config.editable !== 'true');

    // Create container element
    const container = document.createElement('div');
    container.className = 'wet-ink-obsidian-block';
    el.appendChild(container);

    const controller = new WetInkController({
      target: container,
      width,
      height,
      paper,
      pigment,
      tool,
      enableAudio: options.enableAudio ?? true,
      readOnly,
      showToolbar: !readOnly,
      initialStrokes,
      onSave: (payload) => {
        // Update markdown codeblock content in active note if editable
        if (!readOnly && ctx && typeof ctx.getSectionInfo === 'function') {
          const section = ctx.getSectionInfo(el);
          if (section) {
            const file = plugin.app.vault.getAbstractFileByPath(ctx.sourcePath);
            if (file) {
              const newContent = `paper: ${paper}\npigment: ${pigment}\nwidth: ${width}\nheight: ${height}\nstrokes: ${JSON.stringify(payload.strokes)}\n`;
              plugin.app.vault.process(file, (data: string) => {
                const fileLines = data.split('\n');
                fileLines.splice(section.lineStart + 1, section.lineEnd - section.lineStart - 1, newContent);
                return fileLines.join('\n');
              });
            }
          }
        }
      }
    });

    // Cleanup hook
    if (ctx && typeof ctx.addChild === 'function') {
      ctx.addChild({
        unload: () => controller.destroy()
      });
    }
  });
}

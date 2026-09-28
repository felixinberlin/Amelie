import { WetInkExtensionOptions, WetInkNodeAttributes } from './types';
import { serializeStrokes, parseNodeAttributesFromDOM } from './serialization';
import { WetInkNodeView } from './WetInkNodeView';

export const DEFAULT_WET_INK_OPTIONS: WetInkExtensionOptions = {
  defaultPaper: 'buetten',
  defaultPigment: 'eisengallus',
  defaultWidth: 480,
  defaultHeight: 160,
  dryingTimeLimit: 4000,
  enableToolbar: true,
  readOnly: false
};

/**
 * Pure ProseMirror NodeSpec for Wet Ink blocks.
 * Works across both raw ProseMirror and TipTap.
 */
export function getWetInkNodeSpec(options: Partial<WetInkExtensionOptions> = {}) {
  const mergedOptions = { ...DEFAULT_WET_INK_OPTIONS, ...options };

  return {
    name: 'wetInk',
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,

    attrs: {
      paper: { default: mergedOptions.defaultPaper },
      pigment: { default: mergedOptions.defaultPigment },
      width: { default: mergedOptions.defaultWidth },
      height: { default: mergedOptions.defaultHeight },
      strokes: { default: [] },
      previewImage: { default: null },
      caption: { default: '' },
      isFrozen: { default: true },
      readOnly: { default: mergedOptions.readOnly }
    },

    parseDOM: [
      {
        tag: 'figure.wet-ink-block',
        getAttrs: (dom: HTMLElement | string) => {
          if (typeof dom === 'string') return {};
          return parseNodeAttributesFromDOM(dom);
        }
      }
    ],

    toDOM: (node: any) => {
      const attrs = node.attrs as WetInkNodeAttributes;
      const figureAttrs: Record<string, string> = {
        class: 'wet-ink-block',
        'data-paper': attrs.paper || mergedOptions.defaultPaper,
        'data-pigment': attrs.pigment || mergedOptions.defaultPigment,
        'data-width': String(attrs.width || mergedOptions.defaultWidth),
        'data-height': String(attrs.height || mergedOptions.defaultHeight),
        'data-strokes': serializeStrokes(attrs.strokes || []),
        'data-frozen': String(attrs.isFrozen ?? true),
        'data-readonly': String(attrs.readOnly ?? false)
      };

      const children: any[] = [];
      if (attrs.previewImage) {
        children.push(['img', { src: attrs.previewImage, alt: attrs.caption || 'Wet Ink Signature' }]);
      }
      if (attrs.caption) {
        children.push(['figcaption', {}, attrs.caption]);
      }

      return ['figure', figureAttrs, ...children];
    }
  };
}

/**
 * Creates the TipTap / ProseMirror NodeView factory.
 */
export function createWetInkNodeView(options: Partial<WetInkExtensionOptions> = {}) {
  const mergedOptions = { ...DEFAULT_WET_INK_OPTIONS, ...options };

  return (node: any, view: any, getPos: () => number | undefined) => {
    return new WetInkNodeView(
      node.attrs as WetInkNodeAttributes,
      mergedOptions,
      (updatedAttrs) => {
        if (typeof getPos === 'function') {
          const pos = getPos();
          if (pos !== undefined && view.state) {
            const tr = view.state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              ...updatedAttrs
            });
            view.dispatch(tr);
          }
        }
      }
    );
  };
}

/**
 * Creates the official TipTap Extension definition.
 * If `@tiptap/core` is present in the host project, this integrates seamlessly.
 */
export function createTipTapWetInkExtension(options: Partial<WetInkExtensionOptions> = {}) {
  const spec = getWetInkNodeSpec(options);
  const nodeViewFactory = createWetInkNodeView(options);

  return {
    name: 'wetInk',
    type: 'node',
    options: { ...DEFAULT_WET_INK_OPTIONS, ...options },
    addOptions() {
      return { ...DEFAULT_WET_INK_OPTIONS, ...options };
    },
    addAttributes() {
      return spec.attrs;
    },
    parseHTML() {
      return spec.parseDOM;
    },
    renderHTML({ HTMLAttributes }: { HTMLAttributes: any }) {
      return spec.toDOM({ attrs: HTMLAttributes });
    },
    addNodeView() {
      return nodeViewFactory;
    }
  };
}

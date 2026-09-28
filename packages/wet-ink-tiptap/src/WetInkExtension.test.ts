import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  serializeStrokes,
  deserializeStrokes,
  parseNodeAttributesFromDOM
} from './serialization';
import { getWetInkNodeSpec, createTipTapWetInkExtension, DEFAULT_WET_INK_OPTIONS } from './WetInkExtension';
import { WetInkStroke, WetInkNodeAttributes } from './types';

describe('Wet Ink TipTap Extension & Serialization', () => {
  const sampleStrokes: WetInkStroke[] = [
    {
      tool: 'fountain-pen',
      startTime: 1000,
      points: [
        { x: 10.5, y: 20.3, pressure: 0.65, timeOffset: 0 },
        { x: 12.1, y: 21.8, pressure: 0.72, timeOffset: 16 },
        { x: 15.0, y: 24.2, pressure: 0.80, timeOffset: 32 }
      ]
    },
    {
      tool: 'sumi-brush',
      startTime: 1050,
      points: [
        { x: 30.0, y: 40.0, pressure: 0.50, timeOffset: 0 },
        { x: 35.5, y: 45.2, pressure: 0.90, timeOffset: 20 }
      ]
    }
  ];

  describe('Stroke Serialization & Delta Compression', () => {
    it('serializes strokes to compact JSON (<2KB)', () => {
      const serialized = serializeStrokes(sampleStrokes);
      expect(typeof serialized).toBe('string');
      expect(serialized.length).toBeLessThan(500); // Compact array representation
      expect(serialized).toContain('"t":0'); // tool: 0 = fountain-pen
      expect(serialized).toContain('"p":[[');
    });

    it('roundtrips strokes with sub-pixel and pressure accuracy', () => {
      const serialized = serializeStrokes(sampleStrokes);
      const deserialized = deserializeStrokes(serialized);

      expect(deserialized).toHaveLength(2);
      expect(deserialized[0].tool).toBe('fountain-pen');
      expect(deserialized[0].points).toHaveLength(3);
      expect(deserialized[0].points[0].x).toBe(10.5);
      expect(deserialized[0].points[0].y).toBe(20.3);
      expect(deserialized[0].points[0].pressure).toBe(0.65);

      expect(deserialized[1].tool).toBe('sumi-brush');
      expect(deserialized[1].points).toHaveLength(2);
      expect(deserialized[1].points[1].pressure).toBe(0.9);
    });

    it('handles empty and malformed stroke streams gracefully', () => {
      expect(deserializeStrokes('')).toEqual([]);
      expect(deserializeStrokes('[]')).toEqual([]);
      expect(deserializeStrokes('invalid json string')).toEqual([]);
    });
  });

  describe('DOM Attribute Parsing', () => {
    it('extracts paper, pigment, dimensions and frozen attributes from DOM', () => {
      const mockElement = {
        getAttribute: (attr: string) => {
          const map: Record<string, string> = {
            'data-paper': 'washi',
            'data-pigment': 'sepia',
            'data-width': '600',
            'data-height': '200',
            'data-strokes': serializeStrokes(sampleStrokes),
            'data-frozen': 'true',
            'data-readonly': 'true'
          };
          return map[attr] || null;
        },
        querySelector: (selector: string) => {
          if (selector === 'img') {
            return { getAttribute: (a: string) => (a === 'src' ? 'data:image/png;base64,mock' : null) };
          }
          if (selector === 'figcaption') {
            return { textContent: 'Authorized Signature' };
          }
          return null;
        }
      } as unknown as HTMLElement;

      const parsed = parseNodeAttributesFromDOM(mockElement);
      expect(parsed.paper).toBe('washi');
      expect(parsed.pigment).toBe('sepia');
      expect(parsed.width).toBe(600);
      expect(parsed.height).toBe(200);
      expect(parsed.isFrozen).toBe(true);
      expect(parsed.readOnly).toBe(true);
      expect(parsed.previewImage).toBe('data:image/png;base64,mock');
      expect(parsed.caption).toBe('Authorized Signature');
      expect(parsed.strokes).toHaveLength(2);
    });
  });

  describe('ProseMirror & TipTap Schema Specification', () => {
    it('produces valid ProseMirror NodeSpec matching TipTap requirements', () => {
      const spec = getWetInkNodeSpec({
        defaultPaper: 'buetten',
        defaultPigment: 'eisengallus'
      });

      expect(spec.name).toBe('wetInk');
      expect(spec.group).toBe('block');
      expect(spec.atom).toBe(true);
      expect(spec.draggable).toBe(true);
      expect(spec.attrs.paper.default).toBe('buetten');
      expect(spec.attrs.pigment.default).toBe('eisengallus');
      expect(spec.attrs.isFrozen.default).toBe(true);
    });

    it('renders clean HTML markup with embedded preview PNG and compact stroke payload', () => {
      const spec = getWetInkNodeSpec();
      const node = {
        attrs: {
          paper: 'washi',
          pigment: 'sumi',
          width: 500,
          height: 180,
          strokes: sampleStrokes,
          previewImage: 'data:image/png;base64,samplepng',
          caption: 'Signed Document',
          isFrozen: true,
          readOnly: false
        } as WetInkNodeAttributes
      };

      const domResult = spec.toDOM(node);
      expect(domResult[0]).toBe('figure');
      expect(domResult[1]['class']).toBe('wet-ink-block');
      expect(domResult[1]['data-paper']).toBe('washi');
      expect(domResult[1]['data-pigment']).toBe('sumi');
      expect(domResult[1]['data-width']).toBe('500');
      expect(domResult[1]['data-height']).toBe('180');
      expect(domResult[1]['data-frozen']).toBe('true');

      // Universal image fallback for print/email/non-js
      const imgChild = domResult[2];
      expect(imgChild[0]).toBe('img');
      expect(imgChild[1].src).toBe('data:image/png;base64,samplepng');

      // Caption child
      const figcaptionChild = domResult[3];
      expect(figcaptionChild[0]).toBe('figcaption');
      expect(figcaptionChild[2]).toBe('Signed Document');
    });

    it('creates TipTap extension definition with parseHTML and renderHTML handlers', () => {
      const extension = createTipTapWetInkExtension();
      expect(extension.name).toBe('wetInk');
      expect(extension.type).toBe('node');
      expect(typeof extension.addAttributes).toBe('function');
      expect(typeof extension.parseHTML).toBe('function');
      expect(typeof extension.renderHTML).toBe('function');
      expect(typeof extension.addNodeView).toBe('function');
    });
  });
});

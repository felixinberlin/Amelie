import { WetInkNodeAttributes, WetInkStroke } from './types';

/**
 * Compact delta-encoding and serialization for Wet Ink strokes.
 */

export function serializeStrokes(strokes: WetInkStroke[]): string {
  if (!strokes || strokes.length === 0) return '[]';
  // Strip out redundant precision to keep JSON minimal (<2KB)
  const compact = strokes.map(stroke => ({
    t: stroke.tool === 'fountain-pen' ? 0 : stroke.tool === 'sumi-brush' ? 1 : 2,
    p: stroke.points.map(pt => [
      Math.round(pt.x * 10) / 10,
      Math.round(pt.y * 10) / 10,
      Math.round(pt.pressure * 100) / 100,
      Math.round(pt.timeOffset)
    ])
  }));
  return JSON.stringify(compact);
}

export function deserializeStrokes(raw: string): WetInkStroke[] {
  if (!raw || raw === '[]') return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.map((item: any) => {
      // Handle compact representation
      if (item.t !== undefined && Array.isArray(item.p)) {
        const toolMap: Record<number, 'fountain-pen' | 'sumi-brush' | 'wash-brush'> = {
          0: 'fountain-pen',
          1: 'sumi-brush',
          2: 'wash-brush'
        };
        return {
          tool: toolMap[item.t] || 'fountain-pen',
          startTime: 0,
          points: item.p.map((pt: number[]) => ({
            x: pt[0],
            y: pt[1],
            pressure: pt[2] ?? 0.5,
            timeOffset: pt[3] ?? 0
          }))
        };
      }
      // Handle standard representation
      return item as WetInkStroke;
    });
  } catch {
    return [];
  }
}

/**
 * Parses node attributes from an existing DOM element (<figure class="wet-ink-block">).
 */
export function parseNodeAttributesFromDOM(element: HTMLElement | Element): Partial<WetInkNodeAttributes> {
  const paper = (element.getAttribute('data-paper') as any) || 'buetten';
  const pigment = (element.getAttribute('data-pigment') as any) || 'eisengallus';
  const width = parseInt(element.getAttribute('data-width') || '480', 10);
  const height = parseInt(element.getAttribute('data-height') || '160', 10);
  const rawStrokes = element.getAttribute('data-strokes') || '[]';
  const isFrozen = element.getAttribute('data-frozen') === 'true';
  const readOnly = element.getAttribute('data-readonly') === 'true';

  const imgEl = element.querySelector('img');
  const previewImage = imgEl ? imgEl.getAttribute('src') : null;

  const captionEl = element.querySelector('figcaption');
  const caption = captionEl ? captionEl.textContent || '' : undefined;

  return {
    paper,
    pigment,
    width,
    height,
    strokes: deserializeStrokes(rawStrokes),
    previewImage,
    caption,
    isFrozen,
    readOnly
  };
}

export { serializeStrokes, deserializeStrokes } from '../../wet-ink-core/src/serialization';
import { deserializeStrokes } from '../../wet-ink-core/src/serialization';
import { WetInkNodeAttributes } from './types';

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

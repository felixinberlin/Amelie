import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PharmaAcquisitionPanel } from './PharmaAcquisitionPanel';

describe('PharmaAcquisitionPanel', () => {
  it('rendert alle Ansätze, den Test und die Quellen in beiden Sprachen', () => {
    for (const lang of ['de', 'en'] as const) {
      const html = renderToStaticMarkup(<PharmaAcquisitionPanel lang={lang} />);
      expect(html).toContain('venture-farmacia-mandate-engine');
      expect(html).toContain('309 %');
      expect(html).toContain('https://www.boe.es/buscar/act.php?id=BOE-A-1997-9022');
      expect(html.match(/<tr[ >]/g)?.length).toBe(9);
    }
  });
});

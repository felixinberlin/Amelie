import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PharmaAcquisitionPanel } from './PharmaAcquisitionPanel';

describe('PharmaAcquisitionPanel', () => {
  it('rendert Tabelle, drei Diagramme, Test und Quellen in allen drei Sprachen', () => {
    for (const lang of ['de', 'en', 'es'] as const) {
      const html = renderToStaticMarkup(<PharmaAcquisitionPanel lang={lang} vectors={{ w: 4, t: 2, c: 2, m: 4, d: 2 }} />);
      expect(html).toContain('venture-farmacia-mandate-engine');
      expect(html).toContain('309 %');
      expect(html).toContain('https://www.boe.es/buscar/act.php?id=BOE-A-1997-9022');
      expect(html.match(/<tr[ >]/g)?.length).toBe(9);
      expect(html.match(/<svg [^>]*role="img"/g)?.length).toBe(3);
      expect(html.match(/<polyline /g)?.length).toBe(7);
    }
  });

  it('Spanisch ist wirklich spanisch', () => {
    const html = renderToStaticMarkup(<PharmaAcquisitionPanel lang="es" />);
    expect(html).toContain('Cartas personales a titulares');
    expect(html).toContain('Prueba de 90 días');
    expect(html).not.toContain('Persönliche Briefe');
  });
});

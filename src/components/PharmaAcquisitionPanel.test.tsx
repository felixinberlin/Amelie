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
      // 1 Kopf + 8 Ansätze, dazu 1 Kopf + 4 Geschäftsmodelle des Lab-Laufs
      expect(html.match(/<tr[ >]/g)?.length).toBe(14);
      expect(html.match(/data-lab-model=/g)?.length).toBe(4);
      expect(html).toContain('https://www.smergers.com/business-brokers-in-spain/c170m15i/');
      expect(html.match(/<svg [^>]*role="img"/g)?.length).toBe(3);
      expect(html.match(/<polyline /g)?.length).toBe(7);
    }
  });

  it('Spanisch ist wirklich spanisch', () => {
    const html = renderToStaticMarkup(<PharmaAcquisitionPanel lang="es" />);
    expect(html).toContain('Cartas personales a titulares');
    expect(html).toContain('Prueba de 90 días');
    expect(html).toContain('Segundo análisis del Lab');
    expect(html).toContain('Intermediación como servicio propio');
    expect(html).toContain('página leída por el Lab');
    expect(html).toContain('Lo que todavía nadie ha respondido');
    expect(html.match(/Se reabre /g)?.length).toBe(2);
    expect(html).not.toContain('Persönliche Briefe');
    expect(html).not.toContain('Zweite Analyse');
  });
});

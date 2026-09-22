/**
 * Dieselben Abnahmefälle wie die Python-Fassung in
 * 04-werkzeug/glasanflug-ampel/test_ampel.py — die elf durchgerechneten
 * Beispiele aus dem Anhang des Beschlusses, beide Vorrangregeln, der vom
 * Beschluss ungeregelte Regelkonflikt und die Schwellenwerte.
 *
 * Wenn diese Datei und die Python-Tests auseinanderlaufen, rechnet die App
 * etwas anderes als das Werkzeug — und eine der beiden Zahlen ist falsch.
 */

import { describe, expect, it } from 'vitest';
import { Eingabe, bewerte, signifikanzschwelle } from './score';
import { KriteriumId, Punktwert } from './schema';

const e = (
  glasanteil: Punktwert | null,
  fassadengestaltung: Punktwert | null,
  umgebung: Punktwert | null,
  gehoelzabstand: Punktwert | null
): Eingabe => {
  const feld = (p: Punktwert | null) => ({
    punkte: p,
    herkunft: (p === null ? 'unbestimmt' : 'eingabe') as Eingabe[KriteriumId]['herkunft'],
  });
  return {
    glasanteil: feld(glasanteil),
    fassadengestaltung: feld(fassadengestaltung),
    umgebung: feld(umgebung),
    gehoelzabstand: feld(gehoelzabstand),
  };
};

describe('Beispiele aus dem Anhang des Beschlusses', () => {
  const faelle: [string, Punktwert, Punktwert, Punktwert, Punktwert, number, string][] = [
    ['Augsburg, Gewerbebetrieb', 2, 4, 4, 3, 13, 'hoch'],
    ['Augsburg, Verwaltungsgebäude', 2, 2, 3, 1, 8, 'mittel'],
    ['Augsburg, Forschungszentrum', 1, 2, 1, 4, 8, 'mittel'],
    ['Augsburg, innerstädtische Wohnbebauung', 2, 1, 1, 1, 5, 'gering'],
    ['Augsburg, Gewerbegebäude', 4, 4, 4, 3, 15, 'hoch'],
    ['Potsdam, Wohnblock', 2, 2, 2, 3, 9, 'mittel'],
    ['Berlin, Bürogebäude (transparente Durchsicht)', 4, 4, 2, 3, 13, 'hoch'],
    ['Potsdam, Kindertagesstätte', 3, 4, 3, 3, 13, 'hoch'],
    ['Berlin, Bürogebäude (Vorbau, stark spiegelnd)', 4, 4, 1, 4, 13, 'hoch'],
  ];

  it.each(faelle)('%s', (_name, g, f, u, h, summe, stufe) => {
    const b = bewerte(e(g, f, u, h));
    expect(b.summe).toBe(summe);
    expect(b.stufe).toBe(stufe);
  });

  it('Berlin, Spiegelfassade ohne Vegetation im Spiegelbild — Fußnote 2 greift gar nicht erst', () => {
    const b = bewerte(e(3, 4, 1, 1));
    expect(b.summe).toBe(9);
    expect(b.stufe).toBe('mittel');
    expect(b.vorrang).toHaveLength(0);
  });

  it('Berlin, Forschungszentrum — der Anhang addiert 3 + 3 zu 7', () => {
    // Nachgerechnet sind es 12 statt 13. Die Risikostufe bleibt "hoch".
    const b = bewerte(e(3, 3, 2, 4));
    expect(b.summe).toBe(12);
    expect(b.stufe).toBe('hoch');
    expect(b.summe).not.toBe(13);
  });
});

describe('Vorrangregeln', () => {
  it('Lochfassade bis 1,5 m² setzt immer "gering", egal was die Summe sagt', () => {
    for (const h of [1, 2, 3, 4] as Punktwert[]) {
      const b = bewerte(e(1, 1, 4, h));
      expect(b.stufe).toBe('gering');
      expect(b.vorrang.some((v) => v.art === 'immer_gering')).toBe(true);
    }
  });

  it('Glasanteil = 4 hebt eine niedrige Summe auf "hoch"', () => {
    const b = bewerte(e(4, 2, 1, 1));
    expect(b.summe).toBe(8);
    expect(b.stufe).toBe('hoch');
    expect(b.vorrang.some((v) => v.art === 'immer_hoch')).toBe(true);
  });

  it('Fußnote 2 hebt die Vorrangregel auf — aber nur mit Begründung', () => {
    const ohne = bewerte(e(4, 2, 1, 1), '   ');
    expect(ohne.stufe).toBe('hoch');

    const mit = bewerte(e(4, 2, 1, 1), 'Straßenflucht ohne Baumbestand');
    expect(mit.summe).toBe(8);
    expect(mit.stufe).toBe('mittel');
    expect(mit.vorrang.some((v) => v.art === 'fussnote_2')).toBe(true);
  });

  it('Regelkonflikt wird gemeldet, nicht still entschieden', () => {
    const b = bewerte(e(4, 1, 1, 1));
    expect(b.vorrang.some((v) => v.art === 'konflikt')).toBe(true);
    expect(b.summe).toBe(7);
    expect(b.stufe).toBe('mittel'); // Rückfall auf die Punktsumme
  });
});

describe('Unbestimmte Werte', () => {
  it('werden nicht geraten', () => {
    const b = bewerte(e(null, 4, 2, 3));
    expect(b.vollstaendig).toBe(false);
    expect(b.summe).toBeNull();
    expect(b.stufe).toBeNull();
    expect(b.unbestimmt).toEqual(['glasanteil']);
  });
});

describe('Schwellenwerte, geprüft an der Münchner Untersuchung', () => {
  it('drei Glaswände: 90 Kollisionen auf 217 m in 13 Wochen', () => {
    const aufsJahr = 90 * (52 / 13);
    const r = signifikanzschwelle(aufsJahr, 217)!;
    expect(r.signifikantErhoeht).toBe(true);
    expect(r.je100m).toBeGreaterThan(100);
  });

  it('Fassaden: 35 Kollisionen auf 1.647 m in 13 Wochen', () => {
    const aufsJahr = 35 * (52 / 13);
    const r = signifikanzschwelle(aufsJahr, 1647)!;
    expect(r.je100m).toBeCloseTo(8.5, 1);
    expect(r.signifikantErhoeht).toBe(true);
  });

  it('ein Vogel im Jahr auf 50 m Fassade ist das normale Risiko', () => {
    const r = signifikanzschwelle(1, 50)!;
    expect(r.je100m).toBe(2);
    expect(r.signifikantErhoeht).toBe(false);
  });

  it('Fassadenlänge 0 ergibt kein Ergebnis', () => {
    expect(signifikanzschwelle(5, 0)).toBeNull();
  });
});

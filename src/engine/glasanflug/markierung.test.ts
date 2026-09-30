/**
 * Abnahmefälle für den Markierungs-Abgleich gegen die WUA-Tabelle.
 * Leitregel: ein unbekanntes Muster ist "nicht getestet", nie "unwirksam".
 */
import { describe, expect, it } from 'vitest';
import { WUA_MUSTER, kategorieFuerAnfluege, pruefeMarkierung } from './markierung';

describe('kategorieFuerAnfluege', () => {
  it('folgt den Grenzen A ≤10, B >10–20, C >20–42, D >42', () => {
    expect(kategorieFuerAnfluege(10)).toBe('A');
    expect(kategorieFuerAnfluege(11)).toBe('B');
    expect(kategorieFuerAnfluege(20)).toBe('B');
    expect(kategorieFuerAnfluege(35)).toBe('C');
    expect(kategorieFuerAnfluege(42)).toBe('C');
    expect(kategorieFuerAnfluege(45)).toBe('D');
  });
});

describe('Tabelle', () => {
  it('hat eindeutige Nummern und zulässige Prozentwerte', () => {
    const nrs = WUA_MUSTER.map((m) => m.nr);
    expect(new Set(nrs).size).toBe(nrs.length);
    for (const m of WUA_MUSTER) {
      expect(m.anfluegeProzent).toBeGreaterThanOrEqual(0);
      expect(m.anfluegeProzent).toBeLessThanOrEqual(100);
      expect(m.nr.endsWith(m.test === 'spiegelung' ? 'S' : 'D')).toBe(true);
    }
  });

  it('nur Spiegelungstests tragen eine Außenreflexion', () => {
    for (const m of WUA_MUSTER.filter((x) => x.test === 'durchsicht')) expect(m.arProzent).toBeUndefined();
  });
});

describe('pruefeMarkierung', () => {
  it('unbekanntes Muster: nicht getestet, keine Kategorie, kein Verdikt', () => {
    const r = pruefeMarkierung({ test: 'spiegelung', musterNr: null, position: 1, arProzent: 10 });
    expect(r.befund).toBe('nicht_getestet');
    expect(r.kategorie).toBeNull();
    expect(JSON.stringify(r)).not.toMatch(/unwirksam|unzulässig/i);
  });

  it('Nummer, die es nicht gibt, ist ebenfalls nicht getestet', () => {
    expect(pruefeMarkierung({ test: 'durchsicht', musterNr: '99D' }).befund).toBe('nicht_getestet');
  });

  it('6S auf Position 2 bei AR 8 %: getestet, Kategorie A', () => {
    const r = pruefeMarkierung({ test: 'spiegelung', musterNr: '6S', position: 2, arProzent: 8 });
    expect(r.befund).toBe('getestet');
    expect(r.kategorie).toBe('A');
  });

  it('6S bei AR 19 %: Geltungsbereich überschritten (der Fall 8S)', () => {
    const r = pruefeMarkierung({ test: 'spiegelung', musterNr: '6S', position: 2, arProzent: 19 });
    expect(r.befund).toBe('geltungsbereich_ueberschritten');
  });

  it('AR unbekannt: nicht geraten, Geltungsbereich offen', () => {
    const r = pruefeMarkierung({ test: 'spiegelung', musterNr: '9S', position: 1, arProzent: null });
    expect(r.befund).toBe('geltungsbereich_ueberschritten');
  });

  it('Durchsichtmuster im Spiegelungsfall: Ergebnis nicht übertragbar', () => {
    const r = pruefeMarkierung({ test: 'spiegelung', musterNr: '4D', position: 1, arProzent: 8 });
    expect(r.befund).toBe('geltungsbereich_ueberschritten');
  });

  it('andere Ebene als geprüft wird gemeldet', () => {
    const r = pruefeMarkierung({ test: 'spiegelung', musterNr: '9S', position: 2, arProzent: 8 });
    expect(r.befund).toBe('ebene_abweichend');
  });

  it('getestetes, aber schwaches Muster bekommt Kategorie D statt eines eigenen Urteils', () => {
    const r = pruefeMarkierung({ test: 'spiegelung', musterNr: '16S', position: 1, arProzent: 8 });
    expect(r.kategorie).toBe('D');
    expect(r.befund).toBe('getestet');
  });

  it('weist immer auf die fehlende Verbindlichkeit hin', () => {
    const r = pruefeMarkierung({ test: 'durchsicht', musterNr: '3D', position: 1 });
    expect(r.hinweise.some((h) => /nicht gesetzlich verbindlich|keine gesetzlich verbindliche/i.test(h.de))).toBe(true);
  });
});

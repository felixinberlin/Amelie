import { describe, it, expect } from 'vitest';
import { findeTreffer, naechsteKarte, pfeife, normalisiere, ROT_FENSTER_MS, ABKUEHLZEIT_MS, Pfiff } from './schiedsrichter';

describe('TischSchiedsrichter', () => {
  it('normalisiert Satzzeichen, Großschreibung und ß', () => {
    expect(normalisiere('Die STEUERN, ja?! Straße.')).toBe('die steuern ja strasse');
  });

  it('trifft Wortanfänge ab vier Buchstaben', () => {
    expect(findeTreffer('Die Parteien streiten wieder', ['Partei'])).toEqual(['Partei']);
    expect(findeTreffer('Beim Parteitag', ['Partei'])).toEqual(['Partei']);
  });

  it('kurze Wörter müssen exakt passen', () => {
    expect(findeTreffer('Wir nehmen ein Taxi', ['tax'])).toEqual([]);
    expect(findeTreffer('Die AfD sagt', ['AfD'])).toEqual(['AfD']);
  });

  it('findet Mehrwortbegriffe', () => {
    expect(findeTreffer('ich finde die grünen gut', ['Die Grünen'])).toEqual(['Die Grünen']);
    expect(findeTreffer('die grüne Bohne', ['Die Grünen'])).toEqual([]);
  });

  it('erste Karte gelb, zweite im Fenster rot, danach wieder gelb', () => {
    const t0 = 1_000_000;
    const v: Pfiff[] = [];
    expect(naechsteKarte(v, t0)).toBe('gelb');
    v.push({ wort: 'Wahl', karte: 'gelb', zeit: t0 });
    expect(naechsteKarte(v, t0 + 60_000)).toBe('rot');
    v.push({ wort: 'Partei', karte: 'rot', zeit: t0 + 60_000 });
    expect(naechsteKarte(v, t0 + 120_000)).toBe('gelb');
  });

  it('gelbe Karte verjährt nach dem Fenster', () => {
    const v: Pfiff[] = [{ wort: 'Wahl', karte: 'gelb', zeit: 0 }];
    expect(naechsteKarte(v, ROT_FENSTER_MS + 1)).toBe('gelb');
  });

  it('derselbe Satz pfeift nicht zweimal (Abkühlzeit)', () => {
    const v: Pfiff[] = [{ wort: 'Wahl', karte: 'gelb', zeit: 0 }];
    expect(pfeife('die Wahl', ['Wahl'], v, ABKUEHLZEIT_MS - 1)).toBeNull();
    expect(pfeife('die Wahl', ['Wahl'], v, ABKUEHLZEIT_MS + 1)?.karte).toBe('rot');
  });
});

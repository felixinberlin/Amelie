import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseZeichen,
  pruefeZaehlfolge,
  exportiereFund,
  assertZulaessigeStufe,
  wertZuRoemisch,
  STUFEN,
  type Bauteil,
  type Stufe,
  type FundMeta,
  type RegelId,
} from './fundbuchEngine';

import faelleDaten from '../../../07-demos/abbundzeichen-fundbuch/data/synthetische-faelle.json';
import bauteilSchema from '../../../07-demos/abbundzeichen-fundbuch/schemas/bauteil.schema.json';
import exportSchema from '../../../07-demos/abbundzeichen-fundbuch/schemas/fund-export.schema.json';

/** Alle Fixtures hier sind SYNTHETISCH — kein Fall stammt aus einem publizierten Register. */
interface Fall {
  id: string;
  synthetisch: boolean;
  beschreibung: string;
  bauteile: Bauteil[];
  erwartet: { regeln: RegelId[]; unlesbar: string[] };
}
const faelle = (faelleDaten as unknown as { faelle: Fall[] }).faelle;
const fall = (id: string): Fall => {
  const f = faelle.find((x) => x.id === id);
  if (!f) throw new Error(`Fixture ${id} fehlt`);
  return f;
};

// ---------------------------------------------------------------------------
// Minimaler JSON-Schema-Prüfer (Draft-07-Teilmenge, die unsere Schemas nutzen)
// ---------------------------------------------------------------------------
type S = Record<string, any>;
function validiere(schema: S, wert: unknown, wurzel: S = schema, pfad = '$'): string[] {
  if (schema.$ref) {
    const ziel = (schema.$ref as string).replace('#/', '').split('/').reduce((o: S, k: string) => o[k], wurzel);
    return validiere(ziel, wert, wurzel, pfad);
  }
  const fehler: string[] = [];
  if (schema.oneOf) {
    const treffer = (schema.oneOf as S[]).filter((s) => validiere(s, wert, wurzel, pfad).length === 0).length;
    if (treffer !== 1) fehler.push(`${pfad}: oneOf trifft ${treffer}`);
  }
  if (schema.anyOf) {
    if (!(schema.anyOf as S[]).some((s) => validiere(s, wert, wurzel, pfad).length === 0)) fehler.push(`${pfad}: anyOf`);
  }
  if ('const' in schema && wert !== schema.const) fehler.push(`${pfad}: const`);
  if (schema.enum && !(schema.enum as unknown[]).includes(wert)) fehler.push(`${pfad}: enum ${String(wert)}`);
  if (schema.type) {
    const typen: string[] = Array.isArray(schema.type) ? schema.type : [schema.type];
    const ist =
      wert === null ? 'null' : Array.isArray(wert) ? 'array' : Number.isInteger(wert) ? 'integer' : typeof wert;
    const ok = typen.some((t) => t === ist || (t === 'number' && ist === 'integer'));
    if (!ok) return [...fehler, `${pfad}: type ${ist} ≠ ${typen.join('|')}`];
  }
  if (typeof wert === 'string') {
    if (schema.minLength && wert.length < schema.minLength) fehler.push(`${pfad}: minLength`);
    if (schema.pattern && !new RegExp(schema.pattern).test(wert)) fehler.push(`${pfad}: pattern`);
  }
  if (typeof wert === 'number' && typeof schema.minimum === 'number' && wert < schema.minimum) {
    fehler.push(`${pfad}: minimum`);
  }
  if (Array.isArray(wert) && schema.items) {
    wert.forEach((w, i) => fehler.push(...validiere(schema.items, w, wurzel, `${pfad}[${i}]`)));
  }
  if (wert && typeof wert === 'object' && !Array.isArray(wert)) {
    const o = wert as S;
    for (const r of (schema.required as string[]) ?? []) if (!(r in o)) fehler.push(`${pfad}.${r}: fehlt`);
    const props = (schema.properties as S) ?? {};
    for (const [k, v] of Object.entries(o)) {
      if (props[k]) fehler.push(...validiere(props[k], v, wurzel, `${pfad}.${k}`));
      else if (schema.additionalProperties === false) fehler.push(`${pfad}.${k}: nicht erlaubt`);
    }
  }
  return fehler;
}

const regelnVon = (bauteile: Bauteil[]) => [...new Set(pruefeZaehlfolge(bauteile).befunde.map((b) => b.regel))].sort();

const staender = (wand: string, zeichen: string[]): Bauteil[] =>
  zeichen.map((z, i) => ({ id: `${wand}-${i + 1}`, wand, position: i + 1, rolle: 'staender', zeichen: z }));

const META: FundMeta = { gemeinde: 'Musterdorf', landkreis: 'Landkreis Beispiel', land: 'DE', erfasstAm: '2026-09-27' };

// ---------------------------------------------------------------------------
describe('Abbundzeichen-Fundbuch — Parser', () => {
  it('liest additive Formen IIII und VIIII als gültig (zimmermannsüblich)', () => {
    const a = parseZeichen('IIII');
    const b = parseZeichen('VIIII');
    expect(a).toMatchObject({ zustand: 'gelesen', wert: 4, notation: 'additiv' });
    expect(b).toMatchObject({ zustand: 'gelesen', wert: 9, notation: 'additiv' });
  });

  it('liest subtraktive Formen IV, IX, XL', () => {
    expect(parseZeichen('IV')).toMatchObject({ wert: 4, notation: 'subtraktiv' });
    expect(parseZeichen('XIV')).toMatchObject({ wert: 14, notation: 'subtraktiv' });
    expect(parseZeichen('XL')).toMatchObject({ wert: 40, notation: 'subtraktiv' });
  });

  it('nennt eindeutige Ziffern wie III und VII neutral', () => {
    expect(parseZeichen('III')).toMatchObject({ wert: 3, notation: 'neutral' });
    expect(parseZeichen('VII')).toMatchObject({ wert: 7, notation: 'neutral' });
  });

  it('liest Serienzeichen mit Typ und Anzahl: XII^ und VII>>', () => {
    expect(parseZeichen('XII^')).toMatchObject({ wert: 12, serie: { typ: 'ausstich', anzahl: 1 } });
    expect(parseZeichen('VII>>')).toMatchObject({ wert: 7, serie: { typ: 'faehnchen', anzahl: 2 } });
    expect(parseZeichen('IIoo')).toMatchObject({ wert: 2, serie: { typ: 'kreis', anzahl: 2 } });
    expect(parseZeichen('V')).toMatchObject({ serie: { typ: 'keine', anzahl: 0 } });
  });

  it('kennt "unlesbar" als eigenen Zustand, nicht als Fehler', () => {
    expect(parseZeichen('unlesbar')).toEqual({ zustand: 'unlesbar', roh: 'unlesbar' });
    expect(parseZeichen('?').zustand).toBe('unlesbar');
    expect(parseZeichen('Unreadable').zustand).toBe('unlesbar');
  });

  it('wirft bei unbekannter Notation statt zu raten', () => {
    expect(() => parseZeichen('')).toThrow();
    expect(() => parseZeichen('IIIII')).toThrow(/Ungültige römische Ziffer/);
    expect(() => parseZeichen('VV')).toThrow();
    expect(() => parseZeichen('XII^>')).toThrow(/Gemischte Serienzeichen/);
    expect(() => parseZeichen('12')).toThrow(/Unbekannte Zeichennotation/);
  });

  it('wandelt Werte für die Klartexte zurück in römische Ziffern', () => {
    expect(wertZuRoemisch(4)).toBe('IV');
    expect(wertZuRoemisch(49)).toBe('XLIX');
  });
});

describe('Abbundzeichen-Fundbuch — Pflichtfälle der Definition of Done (synthetische Fixtures)', () => {
  it('alle Fixtures sind als synthetisch gekennzeichnet und schema-gültig', () => {
    expect(faelle.length).toBeGreaterThanOrEqual(5);
    for (const f of faelle) {
      expect(f.synthetisch).toBe(true);
      expect(f.beschreibung).toMatch(/^Synthetisch/);
      for (const b of f.bauteile) expect(validiere(bauteilSchema as S, b)).toEqual([]);
    }
  });

  it.each(faelle.map((f) => [f.id, f] as const))('Fixture %s liefert genau die erwarteten Regeln', (_id, f) => {
    const e = pruefeZaehlfolge(f.bauteile);
    expect([...new Set(e.befunde.map((b) => b.regel))].sort()).toEqual([...f.erwartet.regeln].sort());
    expect(e.unlesbar).toEqual(f.erwartet.unlesbar);
  });

  it('lückenlose Wand → 0 Befunde', () => {
    const e = pruefeZaehlfolge(fall('luecklose-wand').bauteile);
    expect(e.befunde).toHaveLength(0);
    expect(e.serien[0].dominanteSerie).toEqual({ typ: 'ausstich', anzahl: 1 });
    expect(e.serien[0].zeichensystem).toBe('roemisch-mit-serienzeichen');
  });

  it('fehlender Ständer → R1-LUECKE als Hinweis, benennt III und die Nachbarn', () => {
    const e = pruefeZaehlfolge(fall('fehlender-staender').bauteile);
    expect(e.befunde).toHaveLength(1);
    const b = e.befunde[0];
    expect(b).toMatchObject({ regel: 'R1-LUECKE', stufe: 'hinweis', bauteile: ['S2', 'S4'] });
    expect(b.textDe).toContain('fehlt III');
    expect(b.textEn).toContain('III is missing');
  });

  it('Lücke am Anfang (Folge beginnt bei II) wird gemeldet', () => {
    const e = pruefeZaehlfolge(staender('A', ['II', 'III', 'IIII']));
    expect(e.befunde.map((b) => b.regel)).toEqual(['R1-LUECKE']);
    expect(e.befunde[0].textDe).toContain('fehlt I.');
  });

  it('Balken mit fremdem Ausstich → R3-FREMDE-SERIE als Verdacht Zweitverwendung', () => {
    const e = pruefeZaehlfolge(fall('fremder-ausstich').bauteile);
    const r3 = e.befunde.filter((b) => b.regel === 'R3-FREMDE-SERIE');
    expect(r3).toHaveLength(1);
    expect(r3[0]).toMatchObject({ stufe: 'verdacht', bauteile: ['S3'] });
    expect(r3[0].textDe).toMatch(/Zweitverwendung/);
    expect(r3[0].textEn).toMatch(/reuse/);
  });

  it('ohne strikte Mehrheitsserie gibt es keinen Fremde-Serie-Verdacht', () => {
    const e = pruefeZaehlfolge(staender('B', ['I^', 'II>', 'III^', 'IIII>']));
    expect(e.serien[0].dominanteSerie).toBeNull();
    expect(e.serien[0].zeichensystem).toBe('roemisch-mit-serienzeichen');
    expect(e.befunde.filter((b) => b.regel === 'R3-FREMDE-SERIE')).toHaveLength(0);
  });

  it('IIII neben IV → R4-NOTATIONSBRUCH nur als Hinweis', () => {
    const e = pruefeZaehlfolge(fall('iiii-neben-iv').bauteile);
    expect(e.befunde).toHaveLength(1);
    expect(e.befunde[0]).toMatchObject({ regel: 'R4-NOTATIONSBRUCH', stufe: 'hinweis' });
    expect(e.befunde[0].bauteile.sort()).toEqual(['R4', 'S4']);
    expect(e.befunde[0].textDe).toContain('kein Befund');
  });

  it('neutrale Ziffern (III, VII) lösen keinen Notationsbruch aus', () => {
    expect(regelnVon(staender('C', ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']))).toEqual([]);
  });

  it('unlesbares Zeichen bleibt unlesbar und bricht nichts', () => {
    const e = pruefeZaehlfolge(fall('unlesbares-zeichen').bauteile);
    expect(e.unlesbar).toEqual(['S3']);
    expect(e.befunde).toHaveLength(0);
  });

  it('ein unlesbares Zeichen deckt nicht zwei fehlende Werte', () => {
    const e = pruefeZaehlfolge(staender('D', ['I', 'unlesbar', 'IIII']));
    expect(e.unlesbar).toEqual(['D-2']);
    expect(e.befunde.map((b) => b.regel)).toEqual(['R1-LUECKE', 'R1-LUECKE']);
  });

  it('eine Wand nur aus unlesbaren Zeichen wirft nicht und meldet nichts', () => {
    const e = pruefeZaehlfolge(staender('E', ['unlesbar', '?', 'unlesbar']));
    expect(e.befunde).toEqual([]);
    expect(e.unlesbar).toHaveLength(3);
    expect(e.serien[0].zeichensystem).toBe('unbestimmt');
  });

  it('Umsetzung → R5-RICHTUNGSBRUCH als Verdacht für genau ein Bauteil', () => {
    const e = pruefeZaehlfolge(fall('umsetzung').bauteile);
    const r5 = e.befunde.filter((b) => b.regel === 'R5-RICHTUNGSBRUCH');
    expect(r5).toHaveLength(1);
    expect(r5[0].stufe).toBe('verdacht');
    expect(['S3', 'S4']).toContain(r5[0].bauteile[0]);
    expect(r5[0].textDe).toMatch(/Umsetzung/);
  });

  it('absteigend gezählter Bund (römisch einfach) ist kein Richtungsbruch', () => {
    const e = pruefeZaehlfolge(fall('bund-absteigend').bauteile);
    expect(e.befunde).toHaveLength(0);
    expect(e.serien[0]).toMatchObject({ wand: 'Bund 3', zeichensystem: 'roemisch-einfach' });
    expect(e.serien[0].folgen[0].richtung).toBe('absteigend');
  });

  it('Doppelung → R2-DOPPELUNG als Verdacht mit beiden Bauteilen', () => {
    const e = pruefeZaehlfolge(fall('doppelung').bauteile);
    expect(e.befunde).toHaveLength(1);
    expect(e.befunde[0]).toMatchObject({ regel: 'R2-DOPPELUNG', stufe: 'verdacht', bauteile: ['S2', 'S3'] });
  });

  it('gleiche Werte in verschiedenen Rollen sind keine Doppelung', () => {
    const teile: Bauteil[] = [
      ...staender('F', ['I', 'II', 'III']),
      { id: 'F-r1', wand: 'F', position: 1, rolle: 'riegel', zeichen: 'I' },
      { id: 'F-r2', wand: 'F', position: 2, rolle: 'riegel', zeichen: 'II' },
    ];
    expect(regelnVon(teile)).toEqual([]);
  });

  it('prüft mehrere Wände getrennt voneinander', () => {
    const e = pruefeZaehlfolge([...staender('Nord', ['I', 'II', 'III']), ...staender('Süd', ['I', 'III'])]);
    expect(e.serien.map((s) => s.wand)).toEqual(['Nord', 'Süd']);
    expect(e.befunde).toHaveLength(1);
    expect(e.befunde[0].wand).toBe('Süd');
  });

  it('ist deterministisch: gleiche Eingabe, gleiches Ergebnis — auch bei umsortierter Eingabe', () => {
    const teile = fall('umsetzung').bauteile;
    const a = pruefeZaehlfolge(teile);
    const b = pruefeZaehlfolge([...teile].reverse());
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe('Abbundzeichen-Fundbuch — Invarianten (nie „bestätigt")', () => {
  it('jede Meldung aller Fixtures trägt Regel-ID, Stufe hinweis|verdacht und Klartext De/En', () => {
    const regelIds = ['R1-LUECKE', 'R2-DOPPELUNG', 'R3-FREMDE-SERIE', 'R4-NOTATIONSBRUCH', 'R5-RICHTUNGSBRUCH'];
    let gezaehlt = 0;
    for (const f of faelle) {
      for (const b of pruefeZaehlfolge(f.bauteile).befunde) {
        gezaehlt++;
        expect(regelIds).toContain(b.regel);
        expect(['hinweis', 'verdacht']).toContain(b.stufe);
        expect(b.textDe.length).toBeGreaterThan(20);
        expect(b.textEn.length).toBeGreaterThan(20);
      }
    }
    expect(gezaehlt).toBeGreaterThanOrEqual(5);
  });

  it('das Typsystem kennt keine Stufe „bestaetigt"', () => {
    // @ts-expect-error — 'bestaetigt' ist kein zulässiger Wert von Stufe.
    const verboten: Stufe = 'bestaetigt';
    expect(STUFEN).toEqual(['hinweis', 'verdacht']);
    expect(() => assertZulaessigeStufe(verboten)).toThrow(/nie einen bestätigten Befund/);
    expect(() => assertZulaessigeStufe('bestätigt')).toThrow();
    expect(() => assertZulaessigeStufe('hinweis')).not.toThrow();
  });

  it('das Ergebnis enthält nirgends ein Wort wie „bestätigt" oder „confirmed" als Status', () => {
    for (const f of faelle) {
      const e = pruefeZaehlfolge(f.bauteile);
      for (const b of e.befunde) expect(b.stufe).not.toMatch(/best|confirm|sicher|safe/i);
      expect(e.vorbehaltDe).toContain('keine Bauforschungsbefunde');
      expect(e.vorbehaltEn).toContain('not building-archaeology findings');
    }
  });

  it('wirft bei doppelten IDs, fehlender Wand und ungültiger Position', () => {
    expect(() =>
      pruefeZaehlfolge([
        { id: 'x', wand: 'A', position: 1, rolle: 'staender', zeichen: 'I' },
        { id: 'x', wand: 'A', position: 2, rolle: 'staender', zeichen: 'II' },
      ])
    ).toThrow(/Doppelte Bauteil-ID/);
    expect(() => pruefeZaehlfolge([{ id: 'y', position: 1, rolle: 'staender', zeichen: 'I' }])).toThrow(/weder Wand noch Bund/);
    expect(() => pruefeZaehlfolge([{ id: 'z', wand: 'A', position: NaN, rolle: 'staender', zeichen: 'I' }])).toThrow(
      /Position/
    );
    expect(() => pruefeZaehlfolge([{ id: 'q', wand: 'A', position: 1, rolle: 'staender', zeichen: 'Z' }])).toThrow();
  });

  it('leere Erfassung ergibt ein leeres, gültiges Ergebnis', () => {
    expect(pruefeZaehlfolge([])).toMatchObject({ serien: [], befunde: [], unlesbar: [] });
  });

  it('der Kern enthält keinen Netzwerk- oder Modellaufruf', () => {
    const quelle = readFileSync(resolve(__dirname, 'fundbuchEngine.ts'), 'utf8');
    expect(quelle).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|navigator\.|import\s*\(|from\s+['"](?!\.)/);
  });
});

describe('Abbundzeichen-Fundbuch — JSON-Export', () => {
  it('erzeugt ein schema-gültiges Exportobjekt mit Markierungsart, Werkzeug, Lage, Serie', () => {
    const ex = exportiereFund(fall('fremder-ausstich').bauteile, META);
    expect(validiere(exportSchema as S, ex)).toEqual([]);
    expect(ex.ortsgenauigkeit).toBe('gemeinde');
    expect(ex.bauteile[2]).toMatchObject({
      markierungsart: 'eingeschlagen',
      werkzeug: 'stemmeisen',
      lage: { wand: 'Süd', position: 3, rolle: 'staender', seite: null },
      serie: { typ: 'ausstich', anzahl: 2 },
      lesung: { zustand: 'gelesen', wert: 3, notation: 'neutral' },
    });
    expect(ex.befunde.some((b) => b.regel === 'R3-FREMDE-SERIE')).toBe(true);
  });

  it('exportiert unlesbare Zeichen ohne Wert und ohne Serie', () => {
    const ex = exportiereFund(fall('unlesbares-zeichen').bauteile, META);
    expect(validiere(exportSchema as S, ex)).toEqual([]);
    expect(ex.bauteile[2]).toMatchObject({ serie: null, lesung: { zustand: 'unlesbar' } });
    expect(ex.unlesbar).toEqual(['S3']);
  });

  it('alle Fixtures exportieren schema-gültig', () => {
    for (const f of faelle) expect(validiere(exportSchema as S, exportiereFund(f.bauteile, META))).toEqual([]);
  });

  it('lehnt Ortsangaben genauer als die Gemeinde ab (Straße, Koordinaten, PLZ)', () => {
    const teile = fall('luecklose-wand').bauteile;
    for (const feld of ['strasse', 'lat', 'lon', 'koordinaten', 'plz', 'Hausnummer']) {
      const meta = { ...META, [feld]: 'x' } as unknown as FundMeta;
      expect(() => exportiereFund(teile, meta)).toThrow(/genauer als die Gemeinde/);
    }
    expect(() => exportiereFund(teile, { ...META, foto: 'x' } as unknown as FundMeta)).toThrow(/Unbekanntes/);
    expect(() => exportiereFund(teile, { ...META, erfasstAm: '27.09.2026' })).toThrow(/ISO-Datum/);
    expect(() => exportiereFund(teile, { ...META, gemeinde: '' })).toThrow(/Pflichtfelder/);
  });

  it('der Export ist JSON-serialisierbar und verlustfrei rücklesbar', () => {
    const ex = exportiereFund(fall('umsetzung').bauteile, META);
    expect(JSON.parse(JSON.stringify(ex))).toEqual(ex);
  });
});

describe('Abbundzeichen-Fundbuch — Leistung', () => {
  it('prüft 40 Wände × 12 Ständer (480 Bauteile) in < 50 ms', () => {
    const teile: Bauteil[] = [];
    for (let w = 0; w < 40; w++) {
      for (let p = 1; p <= 12; p++) {
        const wert = w % 5 === 0 && p === 6 ? 7 : p; // einige Doppelungen/Richtungsbrüche
        teile.push({ id: `w${w}-p${p}`, wand: `W${w}`, position: p, rolle: 'staender', zeichen: `${wertZuRoemisch(wert)}^` });
      }
    }
    const t0 = performance.now();
    const e = pruefeZaehlfolge(teile);
    const dauer = performance.now() - t0;
    expect(e.serien).toHaveLength(40);
    expect(e.befunde.length).toBeGreaterThan(0);
    expect(dauer).toBeLessThan(50);
  });
});

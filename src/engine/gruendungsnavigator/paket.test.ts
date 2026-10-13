// Gründungsnavigator — Tests der Branchenpakete. Lizenz: CC0 1.0 Public Domain.
//
// Jedes ausgelieferte Paket muss gegen das Schema gültig sein, die
// inhaltliche Prüfung (pruefePaket) streng bestehen und fertige Texte ohne
// offene Platzhalter liefern. Jeder Prüfer bekommt eine Gegenprobe mit
// absichtlich falschem Eingang.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import {
  euro,
  fuelle,
  platzhalter,
  offenePlatzhalter,
  materialisiereNavigator,
  materialisiereLandkarte,
  pruefePaket,
  pruefeStruktur,
  ZUSCHUSS_HOECHSTBETRAG,
  type Paket,
  type NavigatorDaten,
  type LandkartenDaten,
} from './paket';

const ROOT = resolve(__dirname, '../../..');
const DATA = resolve(ROOT, '07-demos/gruendungsnavigator/data');
const json = <T>(datei: string): T => JSON.parse(readFileSync(resolve(DATA, datei), 'utf8')) as T;

const NAV = json<NavigatorDaten>('navigator.json');
const KARTE = json<LandkartenDaten>('landkarte.json');
const NORMEN = json<Record<string, unknown>>('normen.json');
const SCHEMA = json<Record<string, unknown>>('paket.schema.json');
const PAKETE = readdirSync(resolve(DATA, 'pakete'))
  .filter((d) => d.endsWith('.json'))
  .map((d) => json<Paket>(`pakete/${d}`));
const KONTEXT = { nav: NAV, karte: KARTE, normIds: Object.keys(NORMEN) };

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validiere = ajv.compile(SCHEMA);
const klon = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const paket = (id: string) => {
  const p = PAKETE.find((x) => x.id === id);
  if (!p) throw new Error(`Paket ${id} fehlt`);
  return klon(p);
};

describe('Branchenpakete: Bestand', () => {
  it('liefert das leere Paket, Webentwicklung und mindestens vier weitere Branchen', () => {
    const ids = PAKETE.map((p) => p.id);
    expect(ids).toContain('leer');
    expect(ids).toContain('webentwicklung');
    expect(ids.length).toBeGreaterThanOrEqual(6);
  });

  it('Dateiname = id', () => {
    const dateien = readdirSync(resolve(DATA, 'pakete')).filter((d) => d.endsWith('.json')).sort();
    expect(PAKETE.map((p) => `${p.id}.json`).sort()).toEqual(dateien);
  });
});

describe.each(PAKETE.map((p) => [p.id, p] as const))('Paket %s', (id, p) => {
  it('ist gültig nach paket.schema.json', () => {
    const ok = validiere(p);
    expect(validiere.errors ?? [], JSON.stringify(validiere.errors)).toEqual([]);
    expect(ok).toBe(true);
  });

  it('besteht die inhaltliche Prüfung', () => {
    expect(pruefePaket(p, KONTEXT, id !== 'leer')).toEqual([]);
  });

  it('hinterlässt keine offenen Platzhalter', () => {
    const fertig = [materialisiereNavigator(NAV, p), materialisiereLandkarte(KARTE, p)];
    expect(offenePlatzhalter(fertig)).toEqual([]);
  });

  it('jede Frage hat eine eindeutige id und bekannte Normen', () => {
    const fragen = materialisiereNavigator(NAV, p).fragen;
    expect(new Set(fragen.map((f) => f.id)).size).toBe(fragen.length);
    for (const f of fragen) for (const l of f.laws) expect(NORMEN, `${f.id}: ${l}`).toHaveProperty(l);
  });
});

describe('Leeres Paket', () => {
  const leer = paket('leer');
  it('zeigt Beschriftungen statt Werten', () => {
    const nav = materialisiereNavigator(NAV, leer);
    const worum = nav.fragen.find((f) => f.id === 'worum')!.a;
    expect(worum).toContain('[Beruf]');
    expect(worum).toContain('[Betrag]');
    expect(nav.texte.beantragtZuschuss).toContain('[Posten]');
  });

  it('besteht die strenge Prüfung nicht (Gegenprobe)', () => {
    const p = pruefePaket(leer, KONTEXT, true);
    expect(p.some((x) => x.includes('erfunden'))).toBe(true);
    expect(p.some((x) => x.includes('Wert "beruf" leer'))).toBe(true);
  });
});

describe('Kern ohne Beispielbeträge', () => {
  it('allgemeine Daten enthalten keine Beträge des Webentwicklungs-Pakets', () => {
    const allgemein = JSON.stringify([NAV, KARTE]);
    for (const betrag of ['2.000 €', '1.500 €', '180 €', '21.000 €', '2.600 €']) expect(allgemein).not.toContain(betrag);
    for (const wort of ['Webentwick', 'Laptop', 'Bezirksamt']) expect(allgemein).not.toContain(wort);
  });

  it('jedes Paket ändert die Fragen zum Zuschuss', () => {
    const texte = PAKETE.filter((p) => p.id !== 'leer').map((p) => materialisiereNavigator(NAV, p).fragen.find((f) => f.id === 'zuschuss')!.q);
    expect(new Set(texte).size).toBe(texte.length);
  });
});

describe('Platzhalter', () => {
  it('euro() formatiert deutsch und markiert Lücken', () => {
    expect(euro(2000)).toBe('2.000 €');
    expect(euro(null)).toBe('[Betrag]');
  });

  it('fuelle() kennt Großschreibung und lässt Unbekanntes stehen', () => {
    expect(fuelle('{{^x}} und {{x}} und {{y}} und {name}', { x: 'laptop' })).toBe('Laptop und laptop und {{y}} und {name}');
  });

  it('platzhalter() rechnet abgeleitete Werte', () => {
    const t = platzhalter(paket('webentwicklung').werte);
    expect(t.zuschuss).toBe('2.000 €');
    expect(t.gewinnMonatJ2).toBe('2.800 €');
    expect(t.umsatzReihe).toBe('21.000 € / 38.000 € / 55.000 €');
    expect(t.zuschussPosten).toMatch(/^einen leistungsstarken Laptop \(1\.500 €\), .* und /);
  });
});

describe('pruefePaket: Gegenproben mit absichtlich falschem Eingang', () => {
  const basis = () => paket('handwerk-montage');
  const probe = (aendern: (p: Paket) => void) => {
    const p = basis();
    aendern(p);
    return pruefePaket(p, KONTEXT, true).join('\n');
  };

  it('Zuschuss über dem Höchstbetrag', () => {
    expect(probe((p) => { p.werte.zuschussPosten[0].betrag = ZUSCHUSS_HOECHSTBETRAG; })).toMatch(/Höchstbetrag/);
  });
  it('Gewinn größer als Umsatz', () => {
    expect(probe((p) => { p.werte.gewinn[2] = p.werte.umsatz[2]! + 1; })).toMatch(/Jahr 3: Gewinn/);
  });
  it('Kosten passen nicht zur Differenz Umsatz − Gewinn', () => {
    expect(probe((p) => { p.werte.gewinn[0] = p.werte.umsatz[0]! - 100; })).toMatch(/zwölf Monate laufende Kosten/);
  });
  it('Gewinn im zweiten Jahr unter der eigenen Schwelle', () => {
    expect(probe((p) => { p.werte.schwelleMonat = 9000; })).toMatch(/unter der eigenen Schwelle/);
  });
  it('Ausstieg in falscher Form', () => {
    expect(probe((p) => { p.werte.ausstieg = 'bald'; })).toMatch(/ausstieg/);
  });
  it('Überschreibung, die nichts trifft', () => {
    expect(probe((p) => { p.ueberschreiben = { 'fragen/gibt-es-nicht': { a: 'x' } }; })).toMatch(/trifft nichts/);
  });
  it('Zusatzfrage mit doppelter id, unbekannter Kategorie und Norm', () => {
    const r = probe((p) => { p.fragen = [{ id: 'worum', c: 'Quatsch', q: 'q', a: 'a', show: '–', laws: ['bgb999'] }]; });
    expect(r).toMatch(/id gibt es schon/);
    expect(r).toMatch(/Kategorie "Quatsch"/);
    expect(r).toMatch(/bgb999/);
  });
  it('Versprechenswort', () => {
    expect(probe((p) => { p.werte.kernbotschaft = 'Das wird bewilligt.'; })).toMatch(/Versprechenswort/);
  });
  it('offener Platzhalter durch Tippfehler', () => {
    expect(probe((p) => { p.ueberschreiben = { 'fragen/worum': { a: 'Ich bin {{berfu}}.' } }; })).toMatch(/offener Platzhalter/);
  });
  it('Schema lehnt unbekannte Felder und fehlende Werte ab', () => {
    const p = basis() as unknown as Record<string, unknown>;
    p.zusatz = 1;
    delete (p.werte as Record<string, unknown>).beruf;
    expect(validiere(p)).toBe(false);
  });
});

describe('pruefeStruktur (Formprüfung im Browser) stimmt mit dem Schema überein', () => {
  it('alle ausgelieferten Pakete sind formgültig', () => {
    for (const p of PAKETE) expect(pruefeStruktur(p), p.id).toEqual([]);
  });

  const kaputt: [string, (p: Record<string, any>) => void][] = [
    ['kein Objekt', (p) => { for (const k of Object.keys(p)) delete p[k]; p.x = 1; }],
    ['id mit Großbuchstaben', (p) => { p.id = 'Mein Paket'; }],
    ['Text fehlt', (p) => { delete p.werte.beruf; }],
    ['Zahl als Text', (p) => { p.werte.kostenMonat = '180'; }],
    ['Umsatz mit zwei Jahren', (p) => { p.werte.umsatz = [1, 2]; }],
    ['Posten ohne kurz', (p) => { delete p.werte.zuschussPosten[0].kurz; }],
    ['Zusatzfrage ohne laws', (p) => { p.fragen = [{ id: 'x', c: 'Zahlen', q: 'q', a: 'a', show: '–' }]; }],
    ['Prüfpunkte als Text', (p) => { p.pruefpunkte = 'x'; }],
  ];
  it.each(kaputt)('Gegenprobe %s: beide lehnen ab', (_, aendern) => {
    const p = klon(paket('webentwicklung')) as unknown as Record<string, any>;
    aendern(p);
    expect(pruefeStruktur(p).length).toBeGreaterThan(0);
    expect(validiere(p)).toBe(false);
  });

  it('pruefePaket ohne Landkarte (Navigator-Seite) übergeht landkarte/-Pfade', () => {
    const p = paket('webentwicklung');
    expect(pruefePaket(p, { ...KONTEXT, karte: null }, true)).toEqual([]);
  });
});

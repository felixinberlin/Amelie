// Vernichtungs-Offenlegungsregister — Vitest-Suite. Lizenz: CC0 1.0 Public Domain.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  pruefeOffenlegung,
  erstelleRegister,
  registerAlsCsv,
  cnCodeProblem,
  assertNeutraleSprache,
  SCHEMA_STATUS,
  ANNAHMEN,
  AUSNAHME_GRUENDE,
  BEHANDLUNGSWEGE,
  REGISTER_STATUS,
  type Offenlegung,
  type Position,
  type RegelId,
  type Suchnachweis,
} from './offenlegungsPruefer';

import daten from '../../../07-demos/vernichtungs-offenlegungsregister/data/synthetische-offenlegungen.json';
import schema from '../../../07-demos/vernichtungs-offenlegungsregister/anhang1-schema.json';

/** Alle Fixtures sind SYNTHETISCH — keine bildet eine echte Offenlegung ab. */
interface Fall {
  fall: string;
  beschreibung: string;
  erwartet: RegelId[];
  offenlegung: Offenlegung;
}
const faelle = (daten as unknown as { faelle: Fall[] }).faelle;
const suchnachweise = (daten as unknown as { suchnachweise: Suchnachweis[] }).suchnachweise;
const fall = (id: string): Offenlegung => {
  const f = faelle.find((x) => x.fall === id);
  if (!f) throw new Error(`Fixture ${id} fehlt`);
  return structuredClone(f.offenlegung);
};

import Ajv from 'ajv';
import realeDaten from '../../../07-demos/vernichtungs-offenlegungsregister/data/reale-offenlegungen.json';
type S = Record<string, any>;
const validate = new Ajv({ strict: false }).compile(schema);
const validiere = (_schema: S, value: unknown) => validate(value) ? [] : validate.errors;

const regeln = (o: Offenlegung) => [...new Set(pruefeOffenlegung(o).befunde.map((b) => b.regel))].sort();

const position = (p: Partial<Position> = {}): Position => ({
  id: 'P1',
  warengruppe: 'Pullover',
  cnCode: '61103099',
  stueck: 100,
  gewichtKg: 40,
  geschaetzt: false,
  gruende: ['schaden-nicht-reparierbar'],
  behandlungswege: [{ weg: 'recycling', anteilProzent: 100 }],
  ...p,
});

const offenlegung = (positionen: Position[], extra: Partial<Offenlegung> = {}): Offenlegung => ({
  unternehmen: 'Beispiel GmbH',
  geschaeftsjahr: 2025,
  synthetisch: true,
  format: 'tabelle',
  quelle: { url: 'https://example.org/x.pdf', abgerufenAm: '2026-09-28' },
  positionen,
  ...extra,
});

// ---------------------------------------------------------------------------
describe('Vernichtungs-Offenlegungsregister — Schema-Stand', () => {
  it('Schema und Kern weisen den geprüften Anhang-I-Stand aus', () => {
    expect(SCHEMA_STATUS).toBe('gegen Normtext geprüft am 2026-10-08');
    expect((schema as S).schemaStatus).toBe(SCHEMA_STATUS);
    expect((daten as S).schemaStatus).toBe(SCHEMA_STATUS);
    expect(pruefeOffenlegung(fall('vollstaendig')).schemaStatus).toBe(SCHEMA_STATUS);
  });

  it('jede Annahme im Kern ist im Schema mit Herkunft benannt, und umgekehrt', () => {
    const imSchema = ((schema as S)['x-annahmen'] as { feld: string; herkunft: string }[]).map((a) => a.feld).sort();
    expect(imSchema).toEqual(ANNAHMEN.map((a) => a.feld).sort());
    expect(imSchema).toEqual(['behandlungswege', 'cnCode', 'gewichtKg', 'gruende', 'schaetzungStueck/schaetzungGewicht', 'stueck']);
    for (const a of (schema as S)['x-annahmen']) expect(a.herkunft).toMatch(/DVO2026/);
  });

  it('Ausnahmeliste und Behandlungswege sind in Schema und Kern deckungsgleich', () => {
    expect(AUSNAHME_GRUENDE).toEqual([]);
    const wegEnum = (schema as S).definitions.position.properties.behandlungswege.anyOf[0].items.properties.weg.enum;
    expect(wegEnum).toEqual([...BEHANDLUNGSWEGE]);
  });

  it('alle Fixtures sind synthetisch, schema-gültig und nutzen example.org', () => {
    expect(faelle.length).toBeGreaterThanOrEqual(5);
    for (const f of faelle) {
      expect(f.offenlegung.synthetisch).toBe(true);
      expect(f.offenlegung.quelle.url).toMatch(/^https:\/\/example\.org\//);
      expect(f.offenlegung.unternehmen).not.toMatch(/signify/i);
      expect(validiere(schema as S, f.offenlegung)).toEqual([]);
    }
    for (const s of suchnachweise) expect(s.synthetisch).toBe(true);
  });
});

describe('Vernichtungs-Offenlegungsregister — Regeln', () => {
  it('vollständige Offenlegung → 0 Befunde, keine unbekannten Felder', () => {
    const erg = pruefeOffenlegung(fall('vollstaendig'));
    expect(erg.befunde).toEqual([]);
    expect(erg.felderUnbekannt).toEqual([]);
  });

  it('das Ergebnis enthält kein Gesamturteil (kein ok/grün/erfüllt)', () => {
    const erg = pruefeOffenlegung(fall('vollstaendig')) as unknown as S;
    expect(Object.keys(erg).sort()).toEqual(['befunde', 'felderUnbekannt', 'geschaeftsjahr', 'schemaStatus', 'unternehmen']);
    expect(JSON.stringify(erg)).not.toMatch(/"(ok|gruen|grün|green|erfuellt|erfüllt|compliant|sicher)"/i);
  });

  it('synthetic cases document their exact expected question rules',()=> {
    for (const f of faelle) expect(regeln(f.offenlegung), f.fall).toEqual([...f.erwartet].sort());
  });

  it('Prozentsumme 92 → V1-PROZENTSUMME als Frage nach einem fehlenden Behandlungsweg', () => {
    const [b] = pruefeOffenlegung(fall('prozentsumme-92')).befunde;
    expect(b.regel).toBe('V1-PROZENTSUMME');
    expect(b.frageDe).toBe('Die Anteile der Behandlungswege summieren sich auf 92 %. Fehlt ein Behandlungsweg?');
  });

  it('Prozentsumme über 100 und innerhalb der Rundungstoleranz', () => {
    const zuViel = position({ behandlungswege: [{ weg: 'recycling', anteilProzent: 70 }, { weg: 'beseitigung', anteilProzent: 40 }] });
    expect(pruefeOffenlegung(offenlegung([zuViel])).befunde[0].frageDe).toMatch(/110 %.*doppelt/);
    const gerundet = position({
      behandlungswege: [
        { weg: 'recycling', anteilProzent: 33.3 },
        { weg: 'sonstige-verwertung', anteilProzent: 33.3 },
        { weg: 'beseitigung', anteilProzent: 33.3 },
      ],
    });
    expect(regeln(offenlegung([gerundet]))).toEqual([]);
    expect(regeln(offenlegung([position({ behandlungswege: [] })]))).toEqual(['V1-PROZENTSUMME']);
  });

  it('free disposal reasons are accepted; missing reasons prompt a question', () => {
    expect(regeln(offenlegung([position({ gruende:['No demand'] })]))).toEqual([]);
    expect(regeln(offenlegung([position({ gruende:[] })]))).toEqual(['V2-GRUND']);
  });
  it('CN format uses two digits or Annex II four-digit categories; never eight mandatory', () => {
    expect(cnCodeProblem('61')).toBeNull(); expect(cnCodeProblem('8539')).toBeNull();
    expect(cnCodeProblem('6109')).toBe('granularitaet'); expect(cnCodeProblem('85391000')).toBe('format');
    expect(cnCodeProblem('77')).toBe('kapitel'); expect(cnCodeProblem('A5')).toBe('format');
  });
  it('Stück und Gewicht unplausibel → V4-STUECK-GEWICHT (Spanne und Null-Widerspruch)', () => {
    expect(pruefeOffenlegung(fall('stueck-gewicht-und-schaetzung')).befunde.find(b=>b.regel==='V4-STUECK-GEWICHT')?.frageDe).toMatch(/1500 kg je Stück/);
    // Schuhe (Kap. 64) mit 20 g je Paar
    expect(regeln(offenlegung([position({ cnCode: '64041100', stueck: 1000, gewichtKg: 20 })]))).toEqual([
      'V4-STUECK-GEWICHT',
    ]);
    expect(regeln(offenlegung([position({ stueck: 0, gewichtKg: 12 })]))).toEqual(['V4-STUECK-GEWICHT']);
    expect(regeln(offenlegung([position({ stueck: 0, gewichtKg: 0 })]))).toEqual([]);
  });

  it('unknown estimates are recorded without assuming the quantity is estimated', () => {
    const result=pruefeOffenlegung(offenlegung([position({geschaetzt:undefined})]));
    expect(result.befunde).toEqual([]); expect(result.felderUnbekannt).toContain('P1.schaetzungStueck');
  });
  it('Freitext-Offenlegung ohne Tabelle läuft durch, alle Felder `unbekannt`', () => {
    const erg = pruefeOffenlegung(fall('freitext'));
    expect(erg.befunde.map((b) => b.regel)).toEqual(['V0-FREITEXT']);
    expect(erg.felderUnbekannt).toEqual(expect.arrayContaining(['*.stueck', '*.gewichtKg', '*.gruende', '*.behandlungswege']));
  });

  it('`unbekannt` in Einzelfeldern schaltet die abhängigen Regeln stumm und wird gelistet', () => {
    const p = position({ stueck: 'unbekannt', gewichtKg: 'unbekannt', gruende: 'unbekannt', behandlungswege: 'unbekannt', cnCode: 'unbekannt', geschaetzt: undefined });
    const erg = pruefeOffenlegung(offenlegung([p]));
    expect(erg.befunde).toEqual([]);
    expect(erg.felderUnbekannt).toEqual(expect.arrayContaining(['P1.behandlungswege', 'P1.gewichtKg', 'P1.gruende', 'P1.stueck']));
  });
});

describe('Vernichtungs-Offenlegungsregister — Befunde als Fragen', () => {
  const alleBefunde = faelle.flatMap((f) => pruefeOffenlegung(f.offenlegung).befunde);

  it('jeder Befund trägt Regel-ID, Art „frage" und Klartextfrage De/En', () => {
    expect(alleBefunde.length).toBeGreaterThanOrEqual(6);
    for (const b of alleBefunde) {
      expect(b.regel).toMatch(/^V[0-7]-[A-Z-]+$/);
      expect(b.art).toBe('frage');
      expect(b.frageDe.trim().endsWith('?')).toBe(true);
      expect(b.frageEn.trim().endsWith('?')).toBe(true);
      expect(b.frageDe).not.toBe(b.frageEn);
    }
  });

  it('free reasons containing source accusations are never copied into output', () => {
    const result=pruefeOffenlegung(offenlegung([position({gruende:['Verstoß gegen Sicherheitsvorgaben']})]));
    expect(()=>assertNeutraleSprache(JSON.stringify(result))).not.toThrow();
  });
});

describe('Vernichtungs-Offenlegungsregister — Register und neutrale Sprache', () => {
  const register = erstelleRegister(
    faelle.map((f) => f.offenlegung),
    suchnachweise
  );

  it('kennt genau zwei Status: gefunden / keine Offenlegung gefunden', () => {
    expect([...REGISTER_STATUS]).toEqual(['gefunden', 'keine Offenlegung gefunden']);
    expect(new Set(register.map((z) => z.status))).toEqual(new Set(REGISTER_STATUS));
    expect(register).toHaveLength(faelle.length + suchnachweise.length);
  });

  it('keine Ausgabe enthält „Verstoß", „säumig" oder „violation"', () => {
    const ausgaben = [
      JSON.stringify(register),
      registerAlsCsv(register),
      ...faelle.map((f) => JSON.stringify(pruefeOffenlegung(f.offenlegung))),
    ].join('\n');
    expect(ausgaben).not.toMatch(/verstoß|verstoss|säumig|saeumig|violation/i);
    expect(() => assertNeutraleSprache('Hier liegt ein Verstoß vor')).toThrow(/Vorwurfswort/);
    expect(() => assertNeutraleSprache('company is in violation')).toThrow();
  });

  it('fehlende Offenlegung erscheint nur als „keine Offenlegung gefunden" mit Datum und Suchweg', () => {
    const fehlend = register.filter((z) => z.status !== 'gefunden');
    expect(fehlend).toHaveLength(1);
    const [z] = fehlend;
    expect(z.status).toBe('keine Offenlegung gefunden');
    expect(z.statusText).toMatch(/^keine Offenlegung gefunden \(Stand: \d{4}-\d{2}-\d{2}, Suchweg: Orte: .+; Suchbegriffe: .+\)$/);
    expect(z.quelleUrl).toBeNull();
    expect(z.anzahlFragen).toBeNull();
  });

  it('„gefunden" trägt immer Quell-URL und Abrufdatum und hängt nicht von der Befundzahl ab', () => {
    for (const z of register.filter((x) => x.status === 'gefunden')) {
      expect(z.quelleUrl).toMatch(/^https:\/\//);
      expect(z.abgerufenAm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(z.statusText.startsWith('gefunden (abgerufen am ')).toBe(true);
    }
    expect(register.find((z) => z.unternehmen === 'Probe Leuchten GmbH')?.anzahlFragen).toBeGreaterThan(0);
  });

  it('CSV hat Kopfzeile, eine Zeile je Eintrag und quotet Semikolons', () => {
    const csv = registerAlsCsv(register).split('\n');
    expect(csv[0]).toBe(
      'unternehmen;geschaeftsjahr;status;statusText;stand;suchweg;quelleUrl;abgerufenAm;archivSnapshot;anzahlFragen;schemaStatus;synthetisch'
    );
    expect(csv).toHaveLength(register.length + 1);
    expect(csv.find((l) => l.startsWith('Platzhalter Textil AG'))).toMatch(/;"keine Offenlegung gefunden \(Stand: 2026-09-28, Suchweg: Orte: .*\)";/);
  });
});

describe('Vernichtungs-Offenlegungsregister — Invarianten', () => {
  it('wirft bei fehlender Quelle, ungültigem Datum, Tabelle ohne Positionen, doppelter ID', () => {
    expect(() => pruefeOffenlegung(offenlegung([position()], { quelle: { url: '', abgerufenAm: '2026-09-28' } }))).toThrow(/Quell-URL/);
    expect(() => pruefeOffenlegung(offenlegung([position()], { quelle: { url: 'https://example.org', abgerufenAm: '28.09.2026' } }))).toThrow(/ISO-Datum/);
    expect(() => pruefeOffenlegung(offenlegung([]))).toThrow(/ohne Positionen/);
    expect(() => pruefeOffenlegung(offenlegung([position(), position()]))).toThrow(/Doppelte Positions-ID/);
  });

  it('wirft bei negativem Anteil, Anteil > 100, unbekanntem Behandlungsweg, negativer Menge', () => {
    expect(() => pruefeOffenlegung(offenlegung([position({ behandlungswege: [{ weg: 'recycling', anteilProzent: -5 }] })]))).toThrow(/0–100/);
    expect(() => pruefeOffenlegung(offenlegung([position({ behandlungswege: [{ weg: 'recycling', anteilProzent: 120 }] })]))).toThrow(/0–100/);
    expect(() =>
      pruefeOffenlegung(offenlegung([position({ behandlungswege: [{ weg: 'verbrennung' as never, anteilProzent: 100 }] })]))
    ).toThrow(/unbekannter Behandlungsweg/);
    expect(() => pruefeOffenlegung(offenlegung([position({ stueck: -1 })]))).toThrow(/ungültige Zahl/);
  });

  it('Register wirft ohne Suchweg, ohne Stand und bei Widerspruch gefunden/nicht gefunden', () => {
    const s: Suchnachweis = structuredClone(suchnachweise[0]);
    expect(() => erstelleRegister([], [{ ...s, suchweg: { orte: [], suchbegriffe: ['x'] } }])).toThrow(/ohne Orte/);
    expect(() => erstelleRegister([], [{ ...s, suchweg: { orte: ['x'], suchbegriffe: [' '] } }])).toThrow(/ohne Suchbegriffe/);
    expect(() => erstelleRegister([], [{ ...s, stand: '' }])).toThrow(/ISO-Datum/);
    expect(() => erstelleRegister([fall('vollstaendig')], [{ ...s, unternehmen: 'Beispiel GmbH' }])).toThrow(/Widerspruch/);
    expect(() => erstelleRegister([fall('vollstaendig'), fall('vollstaendig')], [])).toThrow(/Doppelter Eintrag/);
  });

  it('der Kern enthält keinen Netzwerk- oder Modellaufruf und keine Paketimporte', () => {
    const quelle = readFileSync(resolve(__dirname, 'offenlegungsPruefer.ts'), 'utf8');
    expect(quelle).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|navigator\.|import\s*\(|from\s+['"]/);
  });

  it('ist deterministisch: gleiche Eingabe, gleiche Ausgabe', () => {
    const a = JSON.stringify(faelle.map((f) => pruefeOffenlegung(f.offenlegung)));
    const b = JSON.stringify(faelle.map((f) => pruefeOffenlegung(structuredClone(f.offenlegung))));
    expect(a).toBe(b);
  });

  it('Leistung: 500 Offenlegungen × 10 Positionen in < 100 ms', () => {
    const viele = Array.from({ length: 500 }, (_, i) =>
      offenlegung(
        Array.from({ length: 10 }, (_, j) => position({ id: `P${j}`, geschaetzt: j % 3 === 0 ? undefined : true })),
        { unternehmen: `Synthetik ${i} GmbH` }
      )
    );
    const t0 = performance.now();
    const zeilen = erstelleRegister(viele, []);
    const dauer = performance.now() - t0;
    expect(zeilen).toHaveLength(500);
    expect(dauer).toBeLessThan(100);
  });
});

describe('Verified Annex I and historical primary fixture',()=>{
 it('validates the six real rows with actual Ajv and preserves source decimals',()=>{
  const o=realeDaten.offenlegungen[0] as Offenlegung;
  expect(validiere(schema,o)).toEqual([]); expect(o.positionen).toHaveLength(6);
  expect(o.positionen[0].gewichtKg).toBe(0.39);
 });
 it('historic disclosure is not subjected to future mandatory fields or CN granularity',()=>{
  const result=pruefeOffenlegung(realeDaten.offenlegungen[0] as Offenlegung);
  expect(result.befunde).toHaveLength(6);
  expect(result.befunde.every(b=>b.regel==='V6-VERNICHTUNGSSUMME')).toBe(true);
 });
 it('unknown treatment is a legitimate share, subtotal is not counted twice',()=>{
  const p=position({behandlungswege:[{weg:'unbekannt',anteilProzent:40},{weg:'recycling',anteilProzent:60}],vernichtetProzent:60});
  expect(regeln(offenlegung([p]))).toEqual([]);
 });
 it('duplicate treatment routes and nonfinite destruction are rejected',()=>{
  expect(()=>pruefeOffenlegung(offenlegung([position({behandlungswege:[{weg:'recycling',anteilProzent:50},{weg:'recycling',anteilProzent:50}]})]))).toThrow(/doppelter/);
  expect(()=>pruefeOffenlegung(offenlegung([position({vernichtetProzent:NaN})]))).toThrow();
 });
 it('future comparison is explicitly selected and includes prevention, identity, packaging',()=>{
  const result=pruefeOffenlegung(offenlegung([position({cnCode:'85',verpackung:undefined})],{pruefmodus:'anhang-i'}));
  expect(result.felderUnbekannt).toEqual(expect.arrayContaining(['zeitraum','rechtstraeger','praevention.getroffen','praevention.geplant','P1.verpackung']));
  expect(result.befunde.some(b=>b.regel==='V3-CN-CODE')).toBe(true);
 });
 it('whole-number treatment rounding has a documented engineering tolerance',()=>{
  const p=position({behandlungswege:[{weg:'vorbereitung-wiederverwendung',anteilProzent:20},{weg:'recycling',anteilProzent:20},{weg:'sonstige-verwertung',anteilProzent:20},{weg:'beseitigung',anteilProzent:20},{weg:'unbekannt',anteilProzent:18}]});
  expect(regeln(offenlegung([p]))).toEqual([]);
 });
 it('individual estimates never overwrite original quantity precision',()=>{
  const o=offenlegung([position({gewichtKg:0.39,stueck:14,schaetzungStueck:true,schaetzungGewicht:false})]);
  const before=JSON.stringify(o);pruefeOffenlegung(o);expect(JSON.stringify(o)).toBe(before);
 });
});

describe('Extended field invariants',()=>{
 it('rejects malformed headers and wrong field types in historical mode too',()=>{
  for (const extra of [{rechtstraeger:{kennung:'x',typ:'EUID',art:'konsolidiert'}},{praevention:{getroffen:3,geplant:'x'}},{zeitraum:null}]) expect(()=>pruefeOffenlegung(offenlegung([position()],extra as never))).toThrow();
  for (const p of [{cnCode:85},{verpackung:'yes'},{schaetzungStueck:3}]) expect(()=>pruefeOffenlegung(offenlegung([position(p as never)]))).toThrow();
 });
 it('rejects impossible dates and reversed reporting periods',()=>{
  expect(()=>pruefeOffenlegung(offenlegung([position()],{zeitraum:{von:'2025-02-31',bis:'2025-12-31'}}))).toThrow(/ISO-Datum/);
  expect(()=>pruefeOffenlegung(offenlegung([position()],{zeitraum:{von:'2025-12-31',bis:'2025-01-01'}}))).toThrow(/vor Beginn/);
 });
 it('missing treatment components do not silently become zero for destruction arithmetic',()=>{
  const result=pruefeOffenlegung(offenlegung([position({behandlungswege:[{weg:'recycling',anteilProzent:100}],vernichtetProzent:0})]));
  expect(result.befunde.some(b=>b.regel==='V6-VERNICHTUNGSSUMME')).toBe(false);
  expect(result.felderUnbekannt).toContain('P1.vernichtungssumme.berechnung');
 });
 it('future number formatting prompts a question while preserving source decimals',()=>{
  const o=offenlegung([position({cnCode:'61',gewichtKg:0.39,stueck:14})],{pruefmodus:'anhang-i'});
  expect(pruefeOffenlegung(o).befunde.some(b=>b.frageEn.includes('whole-number'))).toBe(true);expect(o.positionen[0].gewichtKg).toBe(0.39);
 });
});

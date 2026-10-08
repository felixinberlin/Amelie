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

// ---------------------------------------------------------------------------
// Minimaler JSON-Schema-Prüfer (Draft-07-Teilmenge, die das Schema nutzt)
// ---------------------------------------------------------------------------
type S = Record<string, any>;
function validiere(s: S, wert: unknown, wurzel: S = s, pfad = '$'): string[] {
  if (s.$ref) {
    const ziel = (s.$ref as string).replace('#/', '').split('/').reduce((o: S, k: string) => o[k], wurzel);
    return validiere(ziel, wert, wurzel, pfad);
  }
  const fehler: string[] = [];
  if (s.anyOf && !(s.anyOf as S[]).some((x) => validiere(x, wert, wurzel, pfad).length === 0)) {
    fehler.push(`${pfad}: anyOf`);
  }
  if ('const' in s && wert !== s.const) fehler.push(`${pfad}: const`);
  if (s.enum && !(s.enum as unknown[]).includes(wert)) fehler.push(`${pfad}: enum ${String(wert)}`);
  if (s.type) {
    const ist = wert === null ? 'null' : Array.isArray(wert) ? 'array' : Number.isInteger(wert) ? 'integer' : typeof wert;
    if (!(s.type === ist || (s.type === 'number' && ist === 'integer'))) return [...fehler, `${pfad}: type ${ist}`];
  }
  if (typeof wert === 'string') {
    if (s.minLength && wert.length < s.minLength) fehler.push(`${pfad}: minLength`);
    if (s.pattern && !new RegExp(s.pattern).test(wert)) fehler.push(`${pfad}: pattern`);
  }
  if (typeof wert === 'number' && typeof s.minimum === 'number' && wert < s.minimum) fehler.push(`${pfad}: minimum`);
  if (Array.isArray(wert) && s.items) wert.forEach((w, i) => fehler.push(...validiere(s.items, w, wurzel, `${pfad}[${i}]`)));
  if (wert && typeof wert === 'object' && !Array.isArray(wert)) {
    const o = wert as S;
    for (const r of (s.required as string[]) ?? []) if (!(r in o)) fehler.push(`${pfad}.${r}: fehlt`);
    const props = (s.properties as S) ?? {};
    for (const [k, v] of Object.entries(o)) {
      if (props[k]) fehler.push(...validiere(props[k], v, wurzel, `${pfad}.${k}`));
      else if (s.additionalProperties === false) fehler.push(`${pfad}.${k}: nicht erlaubt`);
    }
  }
  return fehler;
}

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
  it('Schema und Kern weisen den Stand „vorläufig" aus', () => {
    expect(SCHEMA_STATUS).toBe('vorläufig');
    expect((schema as S).schemaStatus).toBe(SCHEMA_STATUS);
    expect((daten as S).schemaStatus).toBe(SCHEMA_STATUS);
    expect(pruefeOffenlegung(fall('vollstaendig')).schemaStatus).toBe('vorläufig');
  });

  it('jede Annahme im Kern ist im Schema mit Herkunft benannt, und umgekehrt', () => {
    const imSchema = ((schema as S)['x-annahmen'] as { feld: string; herkunft: string }[]).map((a) => a.feld).sort();
    expect(imSchema).toEqual(ANNAHMEN.map((a) => a.feld).sort());
    expect(imSchema).toEqual(['behandlungswege', 'cnCode', 'geschaetzt', 'gewichtKg', 'gruende', 'stueck']);
    for (const a of (schema as S)['x-annahmen']) expect(a.herkunft).toMatch(/schnipsel/i);
  });

  it('Ausnahmeliste und Behandlungswege sind in Schema und Kern deckungsgleich', () => {
    expect((schema as S)['x-ausnahmeGruende']).toEqual([...AUSNAHME_GRUENDE]);
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

  it('jede Fixture liefert genau die erwarteten Regeln', () => {
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

  it('Grund außerhalb der Ausnahmeliste → V2-GRUND; leere Gründe → V2-GRUND', () => {
    const befunde = pruefeOffenlegung(fall('grund-und-cn')).befunde.filter((b) => b.regel === 'V2-GRUND');
    expect(befunde).toHaveLength(1);
    expect(befunde[0].frageDe).toContain('„ueberbestand"');
    expect(regeln(offenlegung([position({ gruende: [] })]))).toEqual(['V2-GRUND']);
  });

  it('ungültiger CN-Code → V3-CN-CODE (HS-Ebene, Kapitel 77, Buchstaben, falsche Länge)', () => {
    const v3 = pruefeOffenlegung(fall('grund-und-cn')).befunde.filter((b) => b.regel === 'V3-CN-CODE');
    expect(v3.map((b) => b.position)).toEqual(['P1', 'P2']);
    expect(cnCodeProblem('6403 99')).toBe('nur-hs-ebene');
    expect(cnCodeProblem('77123456')).toBe('kapitel');
    expect(cnCodeProblem('00123456')).toBe('kapitel');
    expect(cnCodeProblem('98123456')).toBe('kapitel');
    expect(cnCodeProblem('6109A000')).toBe('format');
    expect(cnCodeProblem('610910001')).toBe('format');
    expect(cnCodeProblem('6109.10.00')).toBeNull();
    expect(cnCodeProblem('6109 10 00')).toBeNull();
  });

  it('Stück und Gewicht unplausibel → V4-STUECK-GEWICHT (Spanne und Null-Widerspruch)', () => {
    expect(pruefeOffenlegung(fall('stueck-gewicht-und-schaetzung')).befunde[0].frageDe).toMatch(/1500 kg je Stück/);
    // Schuhe (Kap. 64) mit 20 g je Paar
    expect(regeln(offenlegung([position({ cnCode: '64041100', stueck: 1000, gewichtKg: 20 })]))).toEqual([
      'V4-STUECK-GEWICHT',
    ]);
    expect(regeln(offenlegung([position({ stueck: 0, gewichtKg: 12 })]))).toEqual(['V4-STUECK-GEWICHT']);
    expect(regeln(offenlegung([position({ stueck: 0, gewichtKg: 0 })]))).toEqual([]);
  });

  it('fehlende Schätzkennzeichnung → V5-SCHAETZUNG; false und true sind beide gültig', () => {
    expect(regeln(offenlegung([position({ geschaetzt: undefined })]))).toEqual(['V5-SCHAETZUNG']);
    expect(regeln(offenlegung([position({ geschaetzt: true })]))).toEqual([]);
    expect(regeln(offenlegung([position({ geschaetzt: false })]))).toEqual([]);
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
    expect(erg.felderUnbekannt.sort()).toEqual(['P1.behandlungswege', 'P1.cnCode', 'P1.gewichtKg', 'P1.gruende', 'P1.stueck']);
  });
});

describe('Vernichtungs-Offenlegungsregister — Befunde als Fragen', () => {
  const alleBefunde = faelle.flatMap((f) => pruefeOffenlegung(f.offenlegung).befunde);

  it('jeder Befund trägt Regel-ID, Art „frage" und Klartextfrage De/En', () => {
    expect(alleBefunde.length).toBeGreaterThanOrEqual(6);
    for (const b of alleBefunde) {
      expect(b.regel).toMatch(/^V[0-5]-[A-Z-]+$/);
      expect(b.art).toBe('frage');
      expect(b.frageDe.trim().endsWith('?')).toBe(true);
      expect(b.frageEn.trim().endsWith('?')).toBe(true);
      expect(b.frageDe).not.toBe(b.frageEn);
    }
  });

  it('übertragener Freitext mit Vorwurfswort wird nicht zitiert, sondern nummeriert', () => {
    const p = position({ gruende: ['Verstoß gegen Sicherheitsvorgaben', 'non-compliance'] });
    const befunde = pruefeOffenlegung(offenlegung([p])).befunde;
    expect(befunde.map((b) => b.frageDe)).toEqual([expect.stringContaining('Nr. 1'), expect.stringContaining('Nr. 2')]);
    expect(() => assertNeutraleSprache(JSON.stringify(befunde))).not.toThrow();
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
    expect(register.find((z) => z.unternehmen === 'Probe Leuchten GmbH')?.anzahlFragen).toBe(2);
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

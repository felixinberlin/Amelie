// Straßennamen-Prüfer — Vitest-Suite. Lizenz: CC0 1.0 Public Domain.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  normalisiere,
  koelnerPhonetik,
  editierdistanz,
  pruefeStrassenname,
  pruefeVorschlagsliste,
  assertNeutraleSprache,
  alsJson,
  GELTUNGSGRENZE_DE,
  URTEILSWOERTER,
  type Strasse,
  type Pruefergebnis,
} from './strassennamenPruefer';
import verzeichnisDatei from '../../../07-demos/strassennamen-pruefer/data/synthetisches-verzeichnis.json';
import testpaare from '../../../07-demos/strassennamen-pruefer/data/testpaare.json';
import schema from '../../../07-demos/strassennamen-pruefer/strassenverzeichnis-schema.json';

const V: Strasse[] = verzeichnisDatei.strassen;

describe('Fixture und Schema', () => {
  it('Fixture ist als synthetisch gekennzeichnet und hat eindeutige IDs', () => {
    expect(verzeichnisDatei.datenart).toBe('synthetisch');
    expect(testpaare.datenart).toBe('synthetisch');
    expect(new Set(V.map((s) => s.id)).size).toBe(V.length);
  });
  it('Fixture erfüllt die Pflichtfelder des Schemas', () => {
    for (const k of (schema as { required: string[] }).required) expect(verzeichnisDatei).toHaveProperty(k);
    for (const s of V) expect(s.name.length).toBeGreaterThan(0);
  });
  it('jedes Testpaar nennt eine Herkunft (dossier oder synthetisch)', () => {
    for (const p of testpaare.paare) expect(['dossier', 'synthetisch']).toContain(p.herkunft);
  });
});

describe('Normalisierung', () => {
  it('ß/ss und Umlaute werden gleichgesetzt', () => {
    expect(normalisiere('Weißdornweg').stamm).toBe(normalisiere('Weissdornweg').stamm);
    expect(normalisiere('Mühlbachweg').stamm).toBe(normalisiere('Muehlbachweg').stamm);
  });
  it('streift Grundwort ab und kanonisiert Str.', () => {
    expect(normalisiere('Lindenstraße')).toMatchObject({ stamm: 'linden', grundwort: 'strasse' });
    expect(normalisiere('Lindenstr.')).toMatchObject({ stamm: 'linden', grundwort: 'strasse' });
    expect(normalisiere('Linden-Allee')).toMatchObject({ stamm: 'linden', grundwort: 'allee' });
    expect(normalisiere('Kirchplatz')).toMatchObject({ stamm: 'kirch', grundwort: 'platz' });
  });
  it('streift nicht ab, wenn kein Stamm übrig bleibt', () => {
    expect(normalisiere('Ring')).toMatchObject({ stamm: 'ring', grundwort: null });
  });
  it('wirft bei leerem Namen', () => {
    expect(() => normalisiere('  ')).toThrow();
    expect(() => normalisiere('!!!')).toThrow();
  });
});

describe('Kölner Phonetik und Editierdistanz', () => {
  it('Meier und Maier ergeben denselben Code', () => {
    expect(koelnerPhonetik('Meier')).toBe('67');
    expect(koelnerPhonetik('Maier')).toBe('67');
  });
  it('bekannte Referenzwerte', () => {
    expect(koelnerPhonetik('Müller-Lüdenscheidt')).toBe('65752682');
    expect(koelnerPhonetik('Breschnew')).toBe('17863');
    expect(koelnerPhonetik('Wikipedia')).toBe('3412');
  });
  it('Editierdistanz mit Vertauschung', () => {
    expect(editierdistanz('linden', 'linden')).toBe(0);
    expect(editierdistanz('linden', 'lindne')).toBe(1);
    expect(editierdistanz('kitten', 'sitting')).toBe(3);
  });
});

describe('Regeln', () => {
  it('S2: Grundwort-Doppelung Lindenweg gegen Lindenstraße', () => {
    const e = pruefeStrassenname('Lindenweg', V);
    expect(e.hinweise[0]).toMatchObject({ regelId: 'S2-GRUNDWORT', staerke: 'stark' });
    expect(e.hinweise[0].fundstelle).toMatchObject({ strasse: 'Lindenstraße', id: 'm01' });
    expect(e.hinweise[0].richtlinie.zitat).toBe('nur durch das Grundwort unterschieden');
  });
  it('S1: ß/ss, Umlaut und Abkürzung', () => {
    expect(pruefeStrassenname('Weissdornweg', V).hinweise[0].regelId).toBe('S1-IDENTISCH');
    expect(pruefeStrassenname('Muehlbachweg', V).hinweise[0].regelId).toBe('S1-IDENTISCH');
    expect(pruefeStrassenname('Lindenstr.', V).hinweise[0].regelId).toBe('S1-IDENTISCH');
  });
  it('S3: Klangzwilling Maierweg gegen Meierstraße, nur mittel', () => {
    const h = pruefeStrassenname('Maierweg', V).hinweise[0];
    expect(h.regelId).toBe('S3-KLANG');
    expect(h.staerke).toBe('mittel');
    expect(h.richtlinie.zitat).toBe('gleichklingende Namen sind zu vermeiden');
  });
  it('S4 allein ist schwach und nennt sich Heuristik', () => {
    const h = pruefeStrassenname('Weidestraße', [{ id: 'b', name: 'Heidestraße' }]).hinweise[0];
    expect(h).toMatchObject({ regelId: 'S4-DISTANZ', staerke: 'schwach', distanz: 1 });
    expect(h.richtlinie.quelle).toMatch(/Heuristik/);
  });
  it('unverdächtige Namen liefern 0 Hinweise', () => {
    for (const n of testpaare.ohneHinweis) expect(pruefeStrassenname(n, V).hinweise).toHaveLength(0);
  });
  it('alle Testpaare werden mit der erwarteten Regel erkannt', () => {
    for (const p of testpaare.paare) {
      const e = pruefeStrassenname(p.vorschlag, V);
      const treffer = e.hinweise.find((h) => h.fundstelle.strasse === p.vorhanden);
      expect(treffer, p.id).toBeDefined();
      expect(treffer?.signale, p.id).toContain(p.erwartet);
    }
  });
  it('kurze Namen lösen keinen Klang- oder Distanzhinweis aus', () => {
    // Stämme „ahn“/„ann“ haben 3 Zeichen, Mindestlänge ist 4.
    expect(pruefeStrassenname('Ahnweg', [{ name: 'Annweg' }]).hinweise).toHaveLength(0);
  });
});

describe('Schalter', () => {
  it('Personennamen-Ausnahme unterdrückt Klang/Distanz, nennt es aber', () => {
    const e = pruefeStrassenname({ name: 'Maierweg', personenname: true }, V);
    expect(e.hinweise).toHaveLength(0);
    expect(e.unterdrueckt.length).toBeGreaterThan(0);
    expect(e.unterdrueckt[0].grundDe).toMatch(/Personennamen-Ausnahme/);
  });
  it('Personennamen-Ausnahme unterdrückt nie Grundwort-Doppelung', () => {
    const e = pruefeStrassenname({ name: 'Goetheweg', personenname: true }, V);
    expect(e.hinweise[0].regelId).toBe('S2-GRUNDWORT');
  });
  it('Ausnahme lässt sich abschalten', () => {
    const e = pruefeStrassenname({ name: 'Maierweg', personenname: true }, V, { personennamenAusnahme: false });
    expect(e.hinweise[0].regelId).toBe('S3-KLANG');
    expect(e.unterdrueckt).toHaveLength(0);
  });
  it('räumlicher Zusammenhang wird markiert, nichts wird versteckt', () => {
    const nah = pruefeStrassenname({ name: 'Lindenweg', ortsteil: 'Nord' }, V).hinweise[0];
    const fern = pruefeStrassenname({ name: 'Lindenweg', ortsteil: 'Süd' }, V).hinweise[0];
    expect(nah.raum).toBe('gleicher-ortsteil');
    expect(fern.raum).toBe('anderer-ortsteil');
    expect(fern.regelId).toBe('S2-GRUNDWORT');
    expect(pruefeStrassenname('Lindenweg', V).hinweise[0].raum).toBe('unbekannt');
  });
  it('Schwellen sind einstellbar', () => {
    const vz = [{ name: 'Heidestraße' }];
    expect(pruefeStrassenname('Weidestraße', vz).hinweise).toHaveLength(1);
    expect(pruefeStrassenname('Weidestraße', vz, { maxDistanzKurz: 0 }).hinweise).toHaveLength(0);
  });
});

describe('Vorschlagsliste', () => {
  it('prüft Vorschläge auch gegeneinander', () => {
    const [a, b] = pruefeVorschlagsliste(['Sonnenblumenweg', 'Sonnenblumenallee'], V);
    expect(a.hinweise[0]).toMatchObject({ regelId: 'S2-GRUNDWORT' });
    expect(a.hinweise[0].fundstelle.quelle).toBe('vorschlagsliste');
    expect(b.hinweise[0].fundstelle.strasse).toBe('Sonnenblumenweg');
  });
});

describe('Invarianten', () => {
  const alle = (): Pruefergebnis[] => [
    ...testpaare.paare.map((p) => pruefeStrassenname(p.vorschlag, V)),
    ...testpaare.ohneHinweis.map((n) => pruefeStrassenname(n, V)),
    pruefeStrassenname({ name: 'Maierweg', personenname: true }, V),
  ];
  it('NIE „unzulässig": kein Urteilswort in irgendeiner Ausgabe', () => {
    const json = alsJson(alle());
    // Nur Werte prüfen: Schlüssel wie „begruendungDe“ enthalten zufällig „gruen“.
    const werte: string[] = [];
    JSON.parse(json, (_k, v) => { if (typeof v === 'string') werte.push(v); return v; });
    expect(werte.filter((w) => URTEILSWOERTER.test(w))).toEqual([]);
    expect(werte.join(' ').toLowerCase()).not.toContain('unzulässig');
    expect(werte.join(' ').toLowerCase()).not.toContain('unzulaessig');
  });
  it('kein Gesamturteil-Feld im Ergebnis', () => {
    for (const e of alle()) {
      for (const k of ['ok', 'gueltig', 'zulaessig', 'unzulaessig', 'gruen', 'status', 'urteil']) {
        expect(e).not.toHaveProperty(k);
      }
      expect(e.geltungsgrenzeDe).toBe(GELTUNGSGRENZE_DE);
    }
  });
  it('jeder Hinweis trägt Regel-ID, Fundstelle und Text De/En mit Frage', () => {
    for (const e of alle()) {
      for (const h of e.hinweise) {
        expect(h.regelId).toMatch(/^S[1-4]-/);
        expect(h.fundstelle.strasse.length).toBeGreaterThan(0);
        expect(h.begruendungDe).toMatch(/\?$/);
        expect(h.begruendungEn).toMatch(/\?$/);
      }
    }
  });
  it('Straßen mit Urteilswort im Namen („Grüner Weg“, „Sichere Straße“) lösen keinen Fehler aus', () => {
    expect(() => pruefeStrassenname('Gruener Weg', V)).not.toThrow();
    expect(() => pruefeStrassenname('Sichere Straße', [{ name: 'Sichere Allee' }])).not.toThrow();
  });
  it('Sprachwächter wirft bei Urteilswort', () => {
    expect(() => assertNeutraleSprache('Der Name ist unzulässig')).toThrow();
    expect(() => assertNeutraleSprache('name is inadmissible')).toThrow();
    expect(() => assertNeutraleSprache('Prüfhinweis mit Fundstelle')).not.toThrow();
  });
  it('deterministisch und unabhängig von der Reihenfolge des Verzeichnisses', () => {
    const a = alsJson([pruefeStrassenname('Lindenweg', V)]);
    const b = alsJson([pruefeStrassenname('Lindenweg', [...V].reverse())]);
    expect(a).toBe(b);
  });
  it('ungültige Eingaben werfen', () => {
    expect(() => pruefeStrassenname('', V)).toThrow();
    expect(() => pruefeStrassenname('Lindenweg', [{ id: 'a', name: 'X-Weg' }, { id: 'a', name: 'Y-Weg' }])).toThrow(/Doppelte/);
    expect(() => pruefeStrassenname('Lindenweg', [{ name: '' }])).toThrow();
  });
  it('Engine enthält keinen Netzwerkaufruf', () => {
    const src = readFileSync(resolve(__dirname, 'strassennamenPruefer.ts'), 'utf8');
    expect(src).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|node:http|node:net/);
  });
});

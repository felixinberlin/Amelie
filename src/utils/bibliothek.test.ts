import { describe, it, expect } from 'vitest';
import {
  parseArgs, norm, matches, parseProtokoll, protokollStats, buildProtokollFelder, formatProtokollRow, insertProtokollRow,
  validateGrab, orderGrab, readEnum, parseQuellenmeldung, meldungToArgs, findAll,
} from '../../scripts/bibliothek-lib.mjs';
import { loadGraeber } from '../../scripts/dosen-lib.mjs';
import quellenJson from '../data/quellen.json';

const KLASSISCH = `# Protokoll

## Runde A — 01.01.2026

| Idee | Urteil | Beleg (kurz) | Prüfen ab |
|---|---|---|---|
| **Eins** (eins) | \`besetzt\` | [method: ideenrunde] X | – |
| **Zwei** (zwei) | \`verengt\` | [method: inversion] Y | 09/2027 |

Text danach.

## Runde B — 02.01.2026

| # | Idee | Methode | Urteil (Merge → nach Review) | Beleg (kurz) | Evidenz | Geprüft | Prüfen ab |
|---|---|---|---|---|---|---|---|
| H1 | **Drei** (\`drei\`) | [method: bisociation] | \`unklar\` → **\`unklar\`** | Z | [Schnipsel] | 29.09.2026 | 12/2026 |

| Zähler | Wert |
|---|---|
| a | 1 |
`;

const FELDER = { titel: 'Neu', id: 'neu', was: 'kurz', urteil: 'frei', beleg: 'Beleg', method: 'ideenrunde', evidenz: 'seite', pruefenAb: '09/2027', datum: '30.09.2026' };

describe('Argumente und Suche', () => {
  it('parst Flags, Mehrfachflags, Boolesche und Positionsargumente', () => {
    const a = parseArgs(['find', 'x', 'y', '--any', '--evidence', 'a', '--evidence', 'b', '--runde', 'R 1']);
    expect(a.pos).toEqual(['find', 'x', 'y']);
    expect(a.has('any')).toBe(true);
    expect(a.many('evidence')).toEqual(['a', 'b']);
    expect(a.one('runde')).toBe('R 1');
  });
  it('lässt Schalter den folgenden Begriff nicht verschlucken', () => {
    const a = parseArgs(['find', 'foldit', '--any', 'eterna', 'eyewire', '--wort']);
    expect(a.pos).toEqual(['find', 'foldit', 'eterna', 'eyewire']);
    expect(a.has('any') && a.has('wort')).toBe(true);
  });
  it('kennt die Wortgrenze: pegel trifft nicht Ersatzteilpreis-Pegel-Nachbarn im Wort', () => {
    expect(matches('Wetterverlauf', ['wette'])).toBe(true);
    expect(matches('Wetterverlauf', ['wette'], false, true)).toBe(false);
    expect(matches('Die Wette gilt', ['wette'], false, true)).toBe(true);
    expect(matches('Pegel-Wette (x)', ['pegel', 'wette'], false, true)).toBe(true);
  });
  it('vereinheitlicht Umlaute und Groß-/Kleinschreibung', () => {
    expect(norm('Straßennamen-Prüfer')).toBe('strassennamen-pruefer');
    expect(matches('Der Straßennamen-Prüfer', ['strassennamen', 'PRUEFER'])).toBe(true);
    expect(matches('Der Straßennamen-Prüfer', ['strassennamen', 'xyz'])).toBe(false);
    expect(matches('Der Straßennamen-Prüfer', ['strassennamen', 'xyz'], true)).toBe(true);
    expect(matches('irgendwas', [])).toBe(false);
  });
});

describe('Prüfprotokoll', () => {
  const rows = parseProtokoll(KLASSISCH);
  it('liest 4- und 8-Spalten-Tabellen samt Urteil, Methode und Abschnitt (Tabellen mit zwei Spalten zählen nicht)', () => {
    expect(rows.map((r) => [r.idee.replace(/\*/g, ''), r.urteil, r.method])).toEqual([
      ['Eins (eins)', 'besetzt', 'ideenrunde'],
      ['Zwei (zwei)', 'verengt', 'inversion'],
      ['Drei (`drei`)', 'unklar', 'bisociation'],
    ]);
    expect(rows[2].section).toContain('Runde B');
    expect(rows[2].pruefenAb).toBe('12/2026');
  });
  it('zählt Urteile', () => {
    const s = protokollStats(rows);
    expect(s.gesamt).toMatchObject({ besetzt: 1, verengt: 1, unklar: 1, sonst: 0, summe: 3 });
  });
  it('verlangt Pflichtangaben für eine neue Zeile', () => {
    expect(() => buildProtokollFelder({ ...FELDER, urteil: 'vielleicht' })).toThrow(/urteil/);
    expect(() => buildProtokollFelder({ ...FELDER, evidenz: undefined })).toThrow(/evidenz/);
    expect(() => buildProtokollFelder({ ...FELDER, pruefenAb: '2027' })).toThrow(/pruefen-ab/);
    expect(() => buildProtokollFelder({ ...FELDER, beleg: '' })).toThrow(/beleg/);
  });
  it('fügt in die klassische Tabelle ein und maskiert Pipe-Zeichen', () => {
    const felder = buildProtokollFelder({ ...FELDER, was: 'a | b' });
    const { text, row } = insertProtokollRow(KLASSISCH, { runde: 'Runde A', felder });
    expect(row).toBe('| **Neu** (`neu`) — a \\| b | `frei` | [method: ideenrunde] Beleg [Seite] | 09/2027 |');
    const lines = text.split('\n');
    expect(lines.indexOf(row)).toBe(lines.findIndex((l) => l.includes('**Zwei**')) + 1);
    expect(parseProtokoll(text).find((r) => r.idee.includes('Neu'))?.urteil).toBe('frei');
  });
  it('erkennt die 8-Spalten-Tabelle, zählt die Nummer hoch und ignoriert die Zähltabelle danach', () => {
    const { text, row } = insertProtokollRow(KLASSISCH, { runde: 'Runde B', felder: buildProtokollFelder(FELDER) });
    expect(row).toBe('| H2 | **Neu** (`neu`) — kurz | [method: ideenrunde] | `frei` | Beleg | [Seite] | 30.09.2026 | 09/2027 |');
    const lines = text.split('\n');
    expect(lines.indexOf(row)).toBe(lines.findIndex((l) => l.startsWith('| H1')) + 1);
  });
  it('legt einen neuen Abschnitt nur mit Einleitung an, sonst Fehler', () => {
    const felder = buildProtokollFelder(FELDER);
    expect(() => insertProtokollRow(KLASSISCH, { runde: 'Gibtsnicht', felder })).toThrow(/nicht gefunden/);
    const { text } = insertProtokollRow(KLASSISCH, { runde: 'Runde C — 03.01.2026', felder, neuerAbschnitt: 'Einleitung.' });
    expect(text).toContain('## Runde C — 03.01.2026');
    expect(parseProtokoll(text).at(-1)?.urteil).toBe('frei');
    expect(text.endsWith('\n')).toBe(true);
  });
  it('formatiert beide Tabellenformen aus denselben Feldern', () => {
    const f = buildProtokollFelder({ ...FELDER, nr: 'K1' });
    expect(formatProtokollRow(f, 4).split('|').length).toBe(6);
    expect(formatProtokollRow(f, 8).split('|').length).toBe(10);
  });
});

describe('Friedhof: Totenschein', () => {
  const enums = { cause: ['gebaut'], killer: ['kommerziell'], foundBy: ['englisch'], origin: ['brainstorm'], stage: ['kandidat', 'dose'] };
  const ok = { id: 'x-y', title: 'T', originalIdeaDe: 'a', originalIdeaEn: 'a', whyDiscardedDe: 'b', whyDiscardedEn: 'b', lessonDe: 'c', lessonEn: 'c', domain: 'D', evidence: [], cause: 'gebaut', killer: 'kommerziell', foundBy: 'englisch', origin: 'brainstorm', stage: 'kandidat', bornIn: 'R', diedOn: '2026-09', resurrectIfDe: 'nie', resurrectIfEn: 'never' };
  it('lässt einen vollständigen Totenschein durch', () => {
    expect(validateGrab(ok, { enums })).toEqual([]);
  });
  it('meldet fehlende Pflichtfelder, falsche Werte, Duplikate und noch lebende Dosen', () => {
    const errs = validateGrab({ ...ok, cause: 'tot', diedOn: '29.09.', lessonDe: '' }, { enums, graeber: [{ id: 'x-y' }], doseIds: ['x-y'] });
    expect(errs.join('\n')).toMatch(/lessonDe/);
    expect(errs.join('\n')).toMatch(/cause „tot“/);
    expect(errs.join('\n')).toMatch(/diedOn/);
    expect(errs.join('\n')).toMatch(/gibt es schon/);
    expect(errs.join('\n')).toMatch(/noch als Dose/);
  });
  it('verlangt einen Nachruf, wenn die Idee schon Dose war, und lehnt unbekannte Felder ab', () => {
    expect(validateGrab({ ...ok, stage: 'dose' }, { enums }).join()).toMatch(/nachruf/);
    expect(validateGrab({ ...ok, foo: 1 }, { enums }).join()).toMatch(/unbekanntes Feld/);
  });
  it('ordnet die Felder wie die bestehenden Gräber', () => {
    expect(Object.keys(orderGrab({ ...ok, evidence: ['e'] }))[0]).toBe('id');
    expect(Object.keys(orderGrab(ok)).indexOf('cause')).toBeGreaterThan(Object.keys(orderGrab(ok)).indexOf('evidence'));
  });
  it('liest die Aufzählungen aus src/types.ts, und alle 81+ vorhandenen Gräber bestehen die Prüfung', () => {
    expect(readEnum('Todesursache')).toContain('gebaut');
    const alle = loadGraeber();
    expect(alle.length).toBeGreaterThan(80);
    // Altbestand: gamifizierte-ritzenpflanzen (stage dose) hat keine Grabbeigabe; die Nachruf-Pflicht gilt für neue Gräber.
    for (const g of alle) {
      const errs = validateGrab(g, { graeber: [], doseIds: [] }).filter((e: string) => !(g.id === 'gamifizierte-ritzenpflanzen' && /nachruf/.test(e)));
      expect(errs, g.id).toEqual([]);
    }
  });
});

describe('Quellenmeldung', () => {
  const data = quellenJson as any;
  const bekannt: string = data.quellen[0].id;
  const ctx = { quellen: data.quellen, katalog: data.katalog, typen: data.typen.map((t: any) => t.id), doseIds: new Set(['eine-dose']), graveIds: new Set(['ein-grab']) };
  it('übersetzt eine Meldung zu einer bekannten Quelle in einen log-Aufruf', () => {
    const { eintraege, fehler } = parseQuellenmeldung(`QUELLE ${bekannt} | status=angekratzt | evidenz=schnipsel | zugang=gesperrt [wie: Proxy sperrt, nutze WebFetch] | ertrag=Grab ein-grab, Idee foo-bar | urls=https://a.example https://b.example | note=Nichts abrufbar.`, ctx);
    expect(fehler).toEqual([]);
    const args = meldungToArgs(eintraege[0], { agent: 'ideen-scout', runde: 'R' });
    expect(args.slice(0, 2)).toEqual(['log', bekannt]);
    expect(args).toEqual(expect.arrayContaining(['--erreichbar', 'gesperrt', '--grab', 'ein-grab', '--kandidat', 'foo-bar', '--agent', 'ideen-scout']));
    expect(args.filter((a) => a === '--url')).toHaveLength(2);
  });
  it('legt NEU-Quellen mit Typ, Kategorie und Inhalt an', () => {
    const { eintraege, fehler } = parseQuellenmeldung('- QUELLE NEU: Testportal Heimat | typ=M | kategorie=norm | enthaelt=Inhalt | tags=holz,recht | note=Gefunden.', ctx);
    expect(fehler).toEqual([]);
    const args = meldungToArgs(eintraege[0], { agent: 'a', runde: 'R' });
    expect(args.slice(0, 3)).toEqual(['add', '--id', 'testportal-heimat']);
    expect(args.filter((a) => a === '--tag')).toHaveLength(2);
  });
  it('bucht nichts, wenn eine Zeile die Regeln verletzt', () => {
    const { fehler } = parseQuellenmeldung([
      `QUELLE ${bekannt} | status=durchsucht | evidenz=schnipsel | note=x`,
      'QUELLE gibt-es-nicht | note=x',
      `QUELLE ${bekannt} | ertrag=Grab fehlt-noch | note=x`,
      `QUELLE ${bekannt} | ertrag=Dose keine-dose | note=x`,
      'QUELLE NEU: Ohne Angaben | note=x',
      `QUELLE ${bekannt} | status=foo`,
    ].join('\n'), ctx);
    const text = fehler.join('\n');
    expect(text).toMatch(/Regel 1/);
    expect(text).toMatch(/unbekannte Quelle/);
    expect(text).toMatch(/Grab „fehlt-noch“/);
    expect(text).toMatch(/Dose „keine-dose“/);
    expect(text).toMatch(/NEU braucht typ=/);
    expect(text).toMatch(/note= fehlt/);
    expect(parseQuellenmeldung(`QUELLE NEU: Testquelle | typ=M | kategorie=forschung | enthaelt=x | note=y`, ctx).fehler.join()).toMatch(/erlaubt: fachgremium/);
  });
  it('meldet einen Text ohne Meldungszeilen', () => {
    expect(parseQuellenmeldung('nichts', ctx).fehler[0]).toMatch(/keine/);
  });
});

describe('find über das echte Gedächtnis', () => {
  it('findet eine gepackte Dose, ein Grab und ein Protokollurteil; Unsinn findet nichts', () => {
    const hits = findAll(['strassennamen'], { quellen: quellenJson.quellen });
    const kinds = new Set(hits.filter((h) => h.bindend).map((h) => h.kind));
    expect(kinds).toEqual(new Set(['protokoll', 'grab', 'dose']));
    expect(findAll(['qqqxyzzy-gibtsnicht']).length).toBe(0);
  });
});

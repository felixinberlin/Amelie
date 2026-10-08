// Umsetzungsplan-Register — Vitest-Suite. Lizenz: CC0 1.0 Public Domain.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  pruefeUmsetzungsplan,
  werteAus,
  erstellePlanRegister,
  planRegisterAlsCsv,
  leseBetrag,
  leseZeitrahmen,
  assertNeutral,
  spanneText,
  FASSUNGEN,
  AKTUELLE_FASSUNG,
  STATUS_VOKABULAR,
  PLAN_REGISTER_STATUS,
  SELEKTIONSHINWEIS_DE,
  SELEKTIONSHINWEIS_EN,
  NICHT_ZITIERT,
  type Umsetzungsplan,
  type PlanSuchnachweis,
  type RegelId,
  type Massnahme,
} from './umsetzungsplanPruefer';

import echt from '../../../07-demos/umsetzungsplan-register/data/umsetzungsplaene.json';
import synth from '../../../07-demos/umsetzungsplan-register/data/synthetische-faelle.json';
import schema from '../../../07-demos/umsetzungsplan-register/umsetzungsplan-schema.json';

interface Fall {
  fall: string;
  beschreibung: string;
  erwartet: RegelId[];
  plan: Umsetzungsplan;
}
const plaene = (echt as unknown as { plaene: Umsetzungsplan[] }).plaene;
const faelle = (synth as unknown as { faelle: Fall[] }).faelle;
const suchnachweise = (synth as unknown as { suchnachweise: PlanSuchnachweis[] }).suchnachweise;

const plan = (unternehmen: string): Umsetzungsplan => {
  const p = plaene.find((x) => x.unternehmen === unternehmen);
  if (!p) throw new Error(`Fixture ${unternehmen} nicht gefunden`);
  return structuredClone(p);
};
const fall = (id: string): Umsetzungsplan => {
  const f = faelle.find((x) => x.fall === id);
  if (!f) throw new Error(`Fall ${id} nicht gefunden`);
  return structuredClone(f.plan);
};
const regeln = (p: Umsetzungsplan) => [...new Set(pruefeUmsetzungsplan(p).befunde.map((b) => b.regel))].sort();

const MUSTER = 'Muster GmbH';
const SANOFI = 'Sanofi-Aventis Deutschland GmbH';
const ARDENNE = 'VON ARDENNE GmbH';

const basisPlan = (massnahmen: Massnahme[], p: Partial<Umsetzungsplan> = {}): Umsetzungsplan => ({
  unternehmen: 'Test GmbH',
  datenart: 'synthetisch',
  rechtsstand: 'a. F.',
  merkblattFassung: '2026-09-16',
  erstellt: '2026-01',
  format: 'tabelle',
  quelle: { url: 'https://example.org/test.pdf', abgerufenAm: '2026-09-28' },
  massnahmen,
  ...p,
});
const zeile = (m: Partial<Massnahme> = {}): Massnahme => ({
  id: 'Z1',
  prioritaet: 'A',
  massnahme: 'Pumpentausch',
  investitionsvolumen: '10.000 €',
  zeitrahmen: '03/2026 - 09/2026',
  status: 'Offen',
  ...m,
});

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
  if (s.enum && !(s.enum as unknown[]).includes(wert)) fehler.push(`${pfad}: enum ${String(wert)}`);
  if (s.type) {
    const ist = wert === null ? 'null' : Array.isArray(wert) ? 'array' : Number.isInteger(wert) ? 'integer' : typeof wert;
    if (!(s.type === ist || (s.type === 'number' && ist === 'integer'))) return [...fehler, `${pfad}: type ${ist}`];
  }
  if (typeof wert === 'string') {
    if (s.minLength && wert.length < s.minLength) fehler.push(`${pfad}: minLength`);
    if (s.pattern && !new RegExp(s.pattern).test(wert)) fehler.push(`${pfad}: pattern`);
  }
  if (Array.isArray(wert) && s.items) wert.forEach((w, i) => fehler.push(...validiere(s.items, w, wurzel, `${pfad}[${i}]`)));
  if (wert && typeof wert === 'object' && !Array.isArray(wert)) {
    const o = wert as S;
    for (const r of (s.required as string[]) ?? []) if (!(r in o)) fehler.push(`${pfad}.${r}: nicht vorhanden`);
    const props = (s.properties as S) ?? {};
    for (const [k, v] of Object.entries(o)) {
      if (props[k]) fehler.push(...validiere(props[k], v, wurzel, `${pfad}.${k}`));
      else if (s.additionalProperties === false) fehler.push(`${pfad}.${k}: nicht erlaubt`);
    }
  }
  return fehler;
}

// ---------------------------------------------------------------------------
describe('Schema und Fassungen', () => {
  it('weist seinen Stand aus, gleich in Schema und Kern', () => {
    expect((schema as S).schemaStatus).toBe(FASSUNGEN[AKTUELLE_FASSUNG].schemaStand);
    expect(FASSUNGEN['2026-09-16'].schemaStand).toBe('gegen Merkblatt 16.09.2026 geprüft am 2026-09-28');
    expect(FASSUNGEN['2025-02-12'].schemaStand).toBe('vorläufig');
    expect((echt as S).schemaStand).toBe(FASSUNGEN[AKTUELLE_FASSUNG].schemaStand);
  });

  it('führt je Fassung dieselben Pflichtangaben wie der Kern', () => {
    for (const f of (schema as S)['x-fassungen'] as S[]) {
      const kern = FASSUNGEN[f.fassung as keyof typeof FASSUNGEN];
      expect(f.pflichtangaben).toEqual([...kern.pflichtangaben]);
      expect(f.schemaStatus).toBe(kern.schemaStand);
      expect(f.rechtsstand).toBe(kern.rechtsstand);
    }
    expect(FASSUNGEN['2026-09-16'].pflichtangaben).toHaveLength(5);
    expect(FASSUNGEN['2025-02-12'].pflichtangaben).toHaveLength(7);
  });

  it('kennt das Statusvokabular des Merkblatts', () => {
    expect([...STATUS_VOKABULAR]).toEqual(['Offen', 'In Bearbeitung', 'Abgeschlossen']);
    expect((schema as S)['x-statusVokabular']).toEqual([...STATUS_VOKABULAR]);
  });

  it('jede Fixture ist eine gültige Instanz des Schemas', () => {
    for (const p of [...plaene, ...faelle.map((f) => f.plan)]) {
      expect(validiere(schema as S, p), p.unternehmen).toEqual([]);
    }
  });

  it('echte Fixtures tragen Quell-URL, Abrufdatum und Prüfsumme', () => {
    expect(plaene.map((p) => p.unternehmen).sort()).toEqual([MUSTER, SANOFI, ARDENNE].sort());
    for (const p of plaene) {
      expect(p.quelle.url).toMatch(/^https:\/\//);
      expect(p.quelle.abgerufenAm).toBe('2026-09-28');
      expect(p.quelle.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(p.quelle.url).not.toContain('example.org');
    }
    expect(plan(MUSTER).datenart).toBe('merkblatt-muster');
    expect(plan(SANOFI).datenart).toBe('veroeffentlichter-plan');
    expect(plan(ARDENNE).datenart).toBe('veroeffentlichter-plan');
  });

  it('synthetische Fixtures sind als synthetisch markiert und zeigen auf example.org', () => {
    for (const f of faelle) {
      expect(f.plan.datenart).toBe('synthetisch');
      expect(f.plan.quelle.url).toMatch(/^https:\/\/example\.org\//);
    }
    for (const s of suchnachweise) expect(s.synthetisch).toBe(true);
  });
});

// ---------------------------------------------------------------------------
describe('Drei übertragene Pläne', () => {
  it('Muster GmbH (Merkblatt 16.09.2026): 0 Befunde, 3 offen, 32.000–45.000 € offen', () => {
    const e = pruefeUmsetzungsplan(plan(MUSTER));
    expect(e.befunde).toEqual([]);
    expect(e.planstand).toBe('2025-02');
    expect(e.statusVerteilung).toEqual({ Offen: 3, 'In Bearbeitung': 1, Abgeschlossen: 0, ausserhalbVokabular: 0, unbekannt: 0 });
    expect(e.investitionOffen).toEqual({ vonEuro: 32000, bisEuro: 45000, ohneBetrag: 0 });
    // „bis 20.000 €" hat keine Untergrenze → 0; die Summenzeile 52.000–65.000 liegt in 32.000–65.000
    expect(e.investitionGesamt).toEqual({ vonEuro: 32000, bisEuro: 65000, ohneBetrag: 0 });
  });

  it('Sanofi 11/2025: 0 Befunde, 11 in Bearbeitung, 1 abgeschlossen, Summe 19.712.576 €', () => {
    const e = pruefeUmsetzungsplan(plan(SANOFI));
    expect(e.befunde).toEqual([]);
    expect(e.planstand).toBe('2025-11');
    expect(e.statusVerteilung).toEqual({ Offen: 0, 'In Bearbeitung': 11, Abgeschlossen: 1, ausserhalbVokabular: 0, unbekannt: 0 });
    expect(e.investitionOffen).toEqual({ vonEuro: 0, bisEuro: 0, ohneBetrag: 0 });
    expect(e.investitionGesamt).toEqual({ vonEuro: 19712576, bisEuro: 19712576, ohneBetrag: 0 });
  });

  it('VON ARDENNE 04/2025: „geplant"/„laufend" werden erfragt, nicht still als offen gezählt', () => {
    const e = pruefeUmsetzungsplan(plan(ARDENNE));
    expect(e.befunde.every((b) => b.regel === 'U2-STATUS')).toBe(true);
    expect(e.befunde).toHaveLength(8);
    expect(e.statusAusserhalbVokabular).toEqual({ geplant: 6, laufend: 2 });
    // „abgeschlossen" (klein) ist die Kategorie „Abgeschlossen"
    expect(e.statusVerteilung).toEqual({ Offen: 0, 'In Bearbeitung': 0, Abgeschlossen: 1, ausserhalbVokabular: 8, unbekannt: 0 });
    expect(e.investitionOffen.vonEuro).toBe(0);
    expect(e.investitionAusserhalbVokabular).toEqual({ vonEuro: 2059771, bisEuro: 2059771, ohneBetrag: 0 });
    expect(e.investitionGesamt.vonEuro).toBe(2508771);
    expect(e.befunde[0].frageDe).toContain('„laufend"');
  });

  it('Formatdrift: gegen die vorläufige Fassung 12.02.2025 fragt die Muster GmbH nach Herkunft und Verantwortlichen', () => {
    const e = pruefeUmsetzungsplan(plan(MUSTER), { fassung: '2025-02-12' });
    expect(e.schemaStatus).toBe('vorläufig');
    expect(e.befunde.map((b) => b.regel)).toEqual(['U1-ANGABE', 'U1-ANGABE']);
    expect(e.befunde.every((b) => b.massnahme === null)).toBe(true);
    expect(pruefeUmsetzungsplan(plan(SANOFI), { fassung: '2025-02-12' }).befunde).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
describe('Regeln (synthetische Randfälle)', () => {
  for (const f of faelle) {
    it(`${f.fall}: ${f.beschreibung} → ${f.erwartet.join(', ')}`, () => {
      expect(regeln(f.plan)).toEqual([...f.erwartet].sort());
    });
  }

  it('fehlende Angabe in einer Zeile wird je Zeile erfragt', () => {
    const e = pruefeUmsetzungsplan(fall('angabe-nicht-uebertragen'));
    expect(e.befunde).toHaveLength(1);
    expect(e.befunde[0].massnahme).toBe('Z2');
    expect(e.befunde[0].frageDe).toContain('Zeitrahmen');
  });

  it('Freitext-Plan ohne Tabelle läuft durch, alle Felder unbekannt', () => {
    const e = pruefeUmsetzungsplan(fall('freitext'));
    expect(e.befunde.map((b) => b.regel)).toEqual(['U0-FREITEXT']);
    expect(e.felderUnbekannt).toEqual(expect.arrayContaining(['*.status', '*.investitionsvolumen', '*.zeitrahmen']));
    expect(e.statusVerteilung.Offen).toBe(0);
  });

  it('„unbekannt" wird gelistet, nicht erfragt', () => {
    const e = pruefeUmsetzungsplan(basisPlan([zeile({ investitionsvolumen: 'unbekannt' })]));
    expect(e.befunde).toEqual([]);
    expect(e.felderUnbekannt).toEqual(['Z1.investitionsvolumen']);
    expect(e.investitionOffen).toEqual({ vonEuro: 0, bisEuro: 0, ohneBetrag: 1 });
  });

  it('Merkblatt-Fußnote: nur Gesamtvolumen statt Einzelwerten löst keine Frage aus', () => {
    const m = [zeile({ investitionsvolumen: undefined }), zeile({ id: 'Z2', investitionsvolumen: undefined })];
    const e = pruefeUmsetzungsplan(basisPlan(m, { gesamtInvestitionsvolumen: 'bis 65.000 €' }));
    expect(e.befunde).toEqual([]);
    expect(e.investitionOffen.ohneBetrag).toBe(2);
    const ohneSumme = pruefeUmsetzungsplan(basisPlan(m));
    expect(ohneSumme.befunde.map((b) => b.regel)).toEqual(['U1-ANGABE']);
  });

  it('verantwortliche Person im Kopf gilt für alle Zeilen', () => {
    const e = pruefeUmsetzungsplan(basisPlan([zeile()], { verantwortlichPlan: 'Geschäftsführung' }), { fassung: '2025-02-12' });
    expect(e.befunde.map((b) => b.frageDe).join(' ')).not.toContain('verantwortliche Person');
    expect(e.befunde.map((b) => b.frageDe).join(' ')).toContain('Herkunft der Maßnahme');
  });

  it('vertauschte Bandbreite und vertauschter Zeitrahmen werden erfragt', () => {
    const e = pruefeUmsetzungsplan(basisPlan([zeile({ investitionsvolumen: '5.000 € - 2.000 €', zeitrahmen: '09/2026 - 03/2026' })]));
    expect(e.befunde.map((b) => b.regel).sort()).toEqual(['U3-ZEITRAHMEN', 'U4-INVESTITION']);
    expect(e.befunde.find((b) => b.regel === 'U3-ZEITRAHMEN')?.frageDe).toContain('vertauscht');
  });

  it('abgelaufener Zeitrahmen mit Status „Abgeschlossen" löst keine Frage aus', () => {
    const e = pruefeUmsetzungsplan(fall('zeitrahmen-abgelaufen'));
    expect(e.befunde.map((b) => b.massnahme)).toEqual(['Z1']);
  });

  it('Vorwurfswörter im übertragenen Text werden nicht zitiert', () => {
    const e = pruefeUmsetzungsplan(basisPlan([zeile({ status: 'säumig' })]));
    expect(e.befunde).toHaveLength(1);
    expect(e.befunde[0].frageDe).toContain('in Zeile Z1');
    expect(e.befunde[0].frageDe).not.toMatch(/säumig/i);
    expect(e.statusAusserhalbVokabular).toEqual({ [NICHT_ZITIERT]: 1 });
    expect(JSON.stringify(e)).not.toMatch(/säumig/i);
  });
});

// ---------------------------------------------------------------------------
describe('Beträge und Zeitrahmen lesen', () => {
  it.each([
    ['2.575.074,00 €', 257507400, 257507400],
    ['449.000,00 €', 44900000, 44900000],
    ['bis 20.000 €', 0, 2000000],
    ['2.000 € - 5.000 €', 200000, 500000],
    ['20.000 € – 25.000 €', 2000000, 2500000],
    ['ca. 8.000 €', 800000, 800000],
    ['1,2 Mio. €', 120000000, 120000000],
    ['150 T€', 15000000, 15000000],
    ['30.000', 3000000, 3000000],
  ])('%s', (text, von, bis) => {
    expect(leseBetrag(text)).toEqual({ vonCent: von, bisCent: bis });
  });

  it.each(['auf Anfrage', 'ab 5.000 €', 'vertraulich', '', '1.2.3 €', '5.000 € - 6.000 € - 7.000 €'])('kein Betrag: „%s"', (text) => {
    expect(leseBetrag(text)).toBeNull();
  });

  it.each([
    ['07/2022 - 03/2027', '2022-07', '2027-03'],
    ['Februar 2025 - Juni 2025', '2025-02', '2025-06'],
    ['Juli 2025 - Dezember 2026', '2025-07', '2026-12'],
    ['Q2 - Q3 2024', '2024-04', '2024-09'],
    ['Q1/2024 - Q4/2025', '2024-01', '2025-12'],
    ['Q4/2024 -Q1/2026', '2024-10', '2026-03'],
    ['Q3/2024 -12/2025', '2024-07', '2025-12'],
    ['Q2/2024 & Q1 - Q2/2026', '2024-04', '2026-06'],
    ['Q3 - Q4/2025', '2025-07', '2025-12'],
    ['Q1 - Q3 2026', '2026-01', '2026-09'],
  ])('%s', (text, beginn, ende) => {
    const z = leseZeitrahmen(text);
    expect(z).toMatchObject({ ok: true, beginn, ende });
  });

  it('ein einzelner Zeitpunkt ist das Ende', () => {
    expect(leseZeitrahmen('03/2027')).toEqual({ ok: true, beginn: null, ende: '2027-03', mehrteilig: false });
    expect(leseZeitrahmen('bis Q2 2026')).toEqual({ ok: true, beginn: null, ende: '2026-06', mehrteilig: false });
  });

  it.each(['zeitnah', '13/2025', 'Q5 2025', 'Q1 - Q3', 'laufend', ''])('nicht lesbar: „%s"', (text) => {
    expect(leseZeitrahmen(text)).toEqual({ ok: false, grund: 'format' });
  });

  it('Ende vor Beginn', () => {
    expect(leseZeitrahmen('06/2026 - 01/2026')).toEqual({ ok: false, grund: 'reihenfolge' });
  });

  it('Spannentext', () => {
    expect(spanneText({ vonEuro: 32000, bisEuro: 45000, ohneBetrag: 0 })).toBe('32.000 € – 45.000 €');
    expect(spanneText({ vonEuro: 19712576, bisEuro: 19712576, ohneBetrag: 0 })).toBe('19.712.576 €');
    expect(spanneText({ vonEuro: 0.5, bisEuro: 0.5, ohneBetrag: 2 })).toBe('0,50 € (zuzüglich 2 ohne lesbaren Betrag)');
  });
});

// ---------------------------------------------------------------------------
describe('Invarianten: ungültige Eingaben werfen', () => {
  it.each<[string, Partial<Umsetzungsplan>]>([
    ['Quell-URL', { quelle: { url: 'sanofi.de/plan.pdf', abgerufenAm: '2026-09-28' } }],
    ['Abrufdatum', { quelle: { url: 'https://example.org/x.pdf', abgerufenAm: '28.09.2026' } }],
    ['Rechtsstand', { rechtsstand: 'alt' as never }],
    ['Fassung', { merkblattFassung: '2024-01-01' as never }],
    ['Datenart', { datenart: 'echt' as never }],
    ['Planstand', { erstellt: '11/2025' }],
    ['aktualisiert vor erstellt', { erstellt: '2026-01', aktualisiert: '2025-12' }],
    ['Tabelle ohne Zeilen', { massnahmen: [] }],
    ['Unternehmen', { unternehmen: ' ' }],
  ])('%s', (_name, p) => {
    expect(() => pruefeUmsetzungsplan(basisPlan([zeile()], p))).toThrow();
  });

  it('doppelte Zeilen-ID', () => {
    expect(() => pruefeUmsetzungsplan(basisPlan([zeile(), zeile()]))).toThrow(/Doppelte/);
  });

  it('Widerspruch gefunden / nicht gefunden (Registerkern)', () => {
    const s: PlanSuchnachweis = { ...suchnachweise[0], unternehmen: SANOFI, planjahr: 2025 };
    expect(() => erstellePlanRegister([plan(SANOFI)], [s])).toThrow(/Widerspruch/);
  });

  it('zwei Pläne desselben Unternehmens im selben Planjahr', () => {
    const b = plan(SANOFI);
    b.aktualisiert = '2025-12';
    expect(() => erstellePlanRegister([plan(SANOFI), b], [])).toThrow(/Doppelter Eintrag/);
  });

  it('kein Suchnachweis ohne Stand und Suchweg', () => {
    const s = suchnachweise[0];
    expect(() => erstellePlanRegister([], [{ ...s, stand: '' }])).toThrow();
    expect(() => erstellePlanRegister([], [{ ...s, suchweg: { orte: [], suchbegriffe: ['x'] } }])).toThrow(/Suchweg/);
    expect(() => erstellePlanRegister([], [{ ...s, suchweg: { orte: ['a\nb'], suchbegriffe: ['x'] } }])).toThrow(/Zeilenumbruch/);
  });

  it('Befunde müssen Fragen sein, Sprache muss neutral sein', () => {
    expect(() => assertNeutral('Das Unternehmen ist säumig.')).toThrow();
    expect(() => assertNeutral('Die Angabe fehlt.')).toThrow();
    expect(() => assertNeutral('Violation found')).toThrow();
    expect(assertNeutral('kein Plan gefunden (Stand: 2026-09-28)')).toBe('kein Plan gefunden (Stand: 2026-09-28)');
  });
});

// ---------------------------------------------------------------------------
describe('Register', () => {
  const alle = [...plaene, ...faelle.map((f) => f.plan)];
  const register = erstellePlanRegister(alle, suchnachweise);

  it('kennt genau zwei Status', () => {
    expect([...PLAN_REGISTER_STATUS]).toEqual(['gefunden', 'kein Plan gefunden']);
    expect(new Set(register.map((z) => z.status))).toEqual(new Set(PLAN_REGISTER_STATUS));
  });

  it('„kein Plan gefunden" nur mit Datum und Suchweg', () => {
    const nicht = register.filter((z) => z.status === 'kein Plan gefunden');
    expect(nicht).toHaveLength(1);
    expect(nicht[0].statusText).toMatch(/^kein Plan gefunden \(Stand: 2026-09-28, Suchweg: Orte: .+; Suchbegriffe: .+\)$/);
    expect(nicht[0].anzahlFragen).toBeNull();
    expect(nicht[0].quelleUrl).toBeNull();
  });

  it('„gefunden" mit Quelle, Planstand, Fragenzahl und Schema-Stand', () => {
    const va = register.find((z) => z.unternehmen === ARDENNE)!;
    expect(va).toMatchObject({ status: 'gefunden', planjahr: 2025, planstand: '2025-04', anzahlFragen: 8, rechtsstand: 'a. F.', synthetisch: false });
    expect(va.schemaStatus).toBe(FASSUNGEN['2026-09-16'].schemaStand);
    expect(register.find((z) => z.unternehmen === MUSTER)?.synthetisch).toBe(true);
  });

  it('ist alphabetisch sortiert, nicht nach Investitionsvolumen oder Fragen', () => {
    const namen = register.map((z) => z.unternehmen);
    expect(namen).toEqual([...namen].sort((a, b) => a.localeCompare(b, 'de')));
    const umgekehrt = erstellePlanRegister([...alle].reverse(), suchnachweise);
    expect(umgekehrt).toEqual(register);
    for (const z of register) expect(Object.keys(z).some((k) => /invest|rang|rank/i.test(k))).toBe(false);
  });

  it('CSV über den Registerkern, mit Planjahr, Planstand und Rechtsstand', () => {
    const csv = planRegisterAlsCsv(register);
    const zeilen = csv.split('\n');
    expect(zeilen).toHaveLength(register.length + 1);
    expect(zeilen[0]).toBe(
      'unternehmen;planjahr;status;statusText;stand;suchweg;quelleUrl;abgerufenAm;archivSnapshot;anzahlFragen;schemaStatus;synthetisch;planstand;rechtsstand;datenart'
    );
    expect(zeilen.find((z) => z.startsWith('Sanofi'))).toContain(';2025-11;a. F.;veroeffentlichter-plan');
  });
});

// ---------------------------------------------------------------------------
describe('Auswertung: Aggregat ohne Quote und ohne Ranking', () => {
  const ergebnisse = plaene.map((p) => pruefeUmsetzungsplan(p));
  const a = werteAus(ergebnisse);

  it('Statusverteilung und Investitionssumme „Offen" über die drei Pläne', () => {
    expect(a.anzahlPlaene).toBe(3);
    expect(a.davonKeinVeroeffentlichterPlan).toBe(1);
    expect(a.anzahlMassnahmen).toBe(25);
    expect(a.statusVerteilung).toEqual({ Offen: 3, 'In Bearbeitung': 12, Abgeschlossen: 2, ausserhalbVokabular: 8, unbekannt: 0 });
    expect(a.statusAusserhalbVokabular).toEqual({ geplant: 6, laufend: 2 });
    expect(a.investitionOffen).toEqual({ vonEuro: 32000, bisEuro: 45000, ohneBetrag: 0 });
    expect(a.satzDe).toBe(
      '3 gefundene Pläne, davon 3 Maßnahmen offen, Investitionsvolumen offen 32.000 € – 45.000 €. Weitere 8 Maßnahmen tragen einen Status außerhalb der Merkblatt-Kategorien und sind nicht als offen gezählt. 1 Eintrag ist kein veröffentlichter Plan (Merkblatt-Muster oder synthetisch).'
    );
  });

  it('nur die zwei veröffentlichten Pläne: 0 Maßnahmen mit Status „Offen"', () => {
    const b = werteAus(ergebnisse.filter((e) => e.datenart === 'veroeffentlichter-plan'));
    expect(b.satzDe.startsWith('2 gefundene Pläne, davon 0 Maßnahmen offen, Investitionsvolumen offen 0 €.')).toBe(true);
    expect(b.investitionAusserhalbVokabular.vonEuro).toBe(2059771);
  });

  it('trägt den Selektionshinweis im Kopf', () => {
    expect(a.selektionshinweisDe).toBe(SELEKTIONSHINWEIS_DE);
    expect(a.selektionshinweisEn).toBe(SELEKTIONSHINWEIS_EN);
    expect(Object.keys(a).slice(0, 2)).toEqual(['selektionshinweisDe', 'selektionshinweisEn']);
    expect(werteAus([]).selektionshinweisDe).toBe(SELEKTIONSHINWEIS_DE);
  });

  it('nennt keine Unternehmen und hängt nicht von der Reihenfolge ab (kein Ranking)', () => {
    const json = JSON.stringify(a);
    for (const p of plaene) expect(json).not.toContain(p.unternehmen);
    expect(werteAus([...ergebnisse].reverse())).toEqual(a);
  });

  it('bildet keine Quote gegen die Verpflichtetenzahl', () => {
    const texte = JSON.stringify([a, werteAus([]), ergebnisse]);
    expect(texte).not.toMatch(/16[.\s]?461|24[.\s]?855/);
    expect(texte).not.toContain('%');
    const schluessel = (o: unknown): string[] =>
      o && typeof o === 'object' ? Object.entries(o).flatMap(([k, v]) => [k, ...schluessel(v)]) : [];
    expect(schluessel(a).filter((k) => /quote|anteil|rate|ratio|nenner|verpflichtete/i.test(k))).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
describe('Safety Case über alle Ausgaben', () => {
  const alle = [...plaene, ...faelle.map((f) => f.plan)];
  const ergebnisse = alle.map((p) => pruefeUmsetzungsplan(p));
  const register = erstellePlanRegister(alle, suchnachweise);
  const ausgaben = JSON.stringify([ergebnisse, register, werteAus(ergebnisse)]) + planRegisterAlsCsv(register);

  it('keine Ausgabe enthält „säumig", „Verstoß", „violation" oder „fehlt"', () => {
    expect(ausgaben).not.toMatch(/säumig|saeumig|verstoß|verstoss|violation|non-?complian|\bfehlt\b/i);
  });

  it('kein Gesamturteil: das Prüfergebnis hat nur diese Felder', () => {
    for (const e of ergebnisse) {
      expect(Object.keys(e)).toEqual([
        'unternehmen', 'datenart', 'planstand', 'rechtsstand', 'merkblattFassung', 'schemaStatus', 'befunde',
        'felderUnbekannt', 'statusVerteilung', 'statusAusserhalbVokabular', 'investitionOffen',
        'investitionAusserhalbVokabular', 'investitionGesamt',
      ]);
    }
    expect(ausgaben).not.toMatch(/"(ok|gruen|grün|erfuellt|erfüllt|konform)"/i);
  });

  it('jeder Befund trägt Regel-ID und eine Frage in De und En', () => {
    const befunde = ergebnisse.flatMap((e) => e.befunde);
    expect(befunde.length).toBeGreaterThan(10);
    for (const b of befunde) {
      expect(b.regel).toMatch(/^U[0-7]-/);
      expect(b.art).toBe('frage');
      expect(b.frageDe.trim().endsWith('?')).toBe(true);
      expect(b.frageEn.trim().endsWith('?')).toBe(true);
    }
  });

  it('Registerkern importiert, nicht kopiert; offline ohne fetch', () => {
    const quelle = readFileSync(resolve(__dirname, 'umsetzungsplanPruefer.ts'), 'utf8');
    const importe = [...quelle.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);
    expect(importe).toEqual(['../vernichtungs-offenlegungsregister/offenlegungsPruefer']);
    for (const f of ['erstelleRegister', 'registerAlsCsv', 'assertNeutraleSprache']) {
      expect(quelle).not.toMatch(new RegExp(`function\\s+${f}\\b`));
      expect(quelle).toContain(`${f},`);
    }
    expect(quelle).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|require\(/);
  });

  it('Leistung: 500 Pläne × 20 Zeilen prüfen, registrieren und auswerten in < 500 ms', () => {
    const viele: Umsetzungsplan[] = Array.from({ length: 500 }, (_, i) =>
      basisPlan(
        Array.from({ length: 20 }, (_, j) =>
          zeile({ id: `Z${j}`, status: STATUS_VOKABULAR[j % 3], investitionsvolumen: `${(j + 1) * 1000} € - ${(j + 2) * 1000} €` })
        ),
        { unternehmen: `Firma ${String(i).padStart(3, '0')}` }
      )
    );
    const t0 = performance.now();
    const erg = viele.map((p) => pruefeUmsetzungsplan(p));
    erstellePlanRegister(viele, []);
    const agg = werteAus(erg);
    const dauer = performance.now() - t0;
    expect(agg.anzahlMassnahmen).toBe(10000);
    expect(dauer).toBeLessThan(500);
  });
});

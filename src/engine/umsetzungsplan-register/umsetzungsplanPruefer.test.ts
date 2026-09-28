// Umsetzungsplan-Register — Vitest-Suite. Lizenz: CC0 1.0 Public Domain.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  pruefeUmsetzungsplan,
  erstelleRegister,
  erstelleAuswertung,
  auswertungAlsText,
  registerAlsCsv,
  parseInvestition,
  parseZeitrahmen,
  normalisiereStatus,
  assertNeutraleSprache,
  SCHEMA_STATUS,
  MERKBLATT_GELESEN,
  MERKBLATT_UNGELESEN,
  PFLICHTANGABEN,
  STATUS_VOKABULAR,
  REGISTER_STATUS,
  ANNAHMEN,
  SELEKTIONSHINWEIS_DE,
  VERPFLICHTETE_SCHAETZUNG,
  type Umsetzungsplan,
  type Massnahme,
  type RegelId,
  type Suchnachweis,
} from './umsetzungsplanPruefer';

import daten from '../../../07-demos/umsetzungsplan-register/data/synthetische-plaene.json';
import schema from '../../../07-demos/umsetzungsplan-register/umsetzungsplan-schema.json';

/** Alle Fixtures sind SYNTHETISCH — keine bildet einen echten Plan ab. */
interface Fall {
  fall: string;
  beschreibung: string;
  erwartet: RegelId[];
  plan: Umsetzungsplan;
}
const faelle = (daten as unknown as { faelle: Fall[] }).faelle;
const suchnachweise = (daten as unknown as { suchnachweise: Suchnachweis[] }).suchnachweise;
const plan = (id: string): Umsetzungsplan => {
  const f = faelle.find((x) => x.fall === id);
  if (!f) throw new Error(`Fixture ${id} fehlt`);
  return structuredClone(f.plan);
};
const alle = (): Umsetzungsplan[] => faelle.map((f) => structuredClone(f.plan));

const vollMassnahme = (o: Partial<Massnahme> = {}): Massnahme => ({
  id: 'X1',
  prioritaet: 1,
  bezeichnung: 'Testmaßnahme',
  investitionEur: 1000,
  zeitrahmen: '2027',
  herkunft: 'Energieaudit',
  verantwortlich: 'Leitung Test',
  status: 'Offen',
  ...o,
});
const mitMassnahme = (m: Massnahme): Umsetzungsplan => ({ ...plan('vollstaendig'), massnahmen: [m] });
const regeln = (p: Umsetzungsplan): RegelId[] => pruefeUmsetzungsplan(p).befunde.map((b) => b.regel);

describe('Fixtures und Schema', () => {
  it('kennzeichnet alle Fixtures als synthetisch mit example.org-URLs', () => {
    for (const f of faelle) {
      expect(f.plan.synthetisch).toBe(true);
      expect(f.plan.quelle.url).toMatch(/^https:\/\/example\.org\//);
    }
    for (const s of suchnachweise) expect(s.synthetisch).toBe(true);
    expect((daten as { _hinweis: string })._hinweis).toMatch(/SYNTHETISCH/);
  });

  it('liefert je Fixture genau die erwarteten Regel-IDs', () => {
    for (const f of faelle) {
      expect(regeln(f.plan).sort(), f.fall).toEqual([...f.erwartet].sort());
    }
  });

  it('trägt im Schema Stand vorläufig und die Merkblattfassungen', () => {
    expect(schema.schemaStatus).toBe('vorläufig');
    expect(SCHEMA_STATUS).toBe('vorläufig');
    expect(schema.merkblattFassungGelesen).toBe(MERKBLATT_GELESEN);
    expect(schema.merkblattFassungenUngelesen).toEqual([...MERKBLATT_UNGELESEN]);
    expect(schema.properties.merkblattFassung).toBeDefined();
    expect(schema.required).toContain('merkblattFassung');
  });

  it('hält Schema und Kern deckungsgleich (7 Pflichtangaben, Vokabular, Annahmen)', () => {
    expect(PFLICHTANGABEN).toHaveLength(7);
    expect(schema['x-pflichtangaben']).toEqual([...PFLICHTANGABEN]);
    expect(schema['x-statusVokabular']).toEqual([...STATUS_VOKABULAR]);
    expect(schema['x-annahmen'].map((a) => a.feld)).toEqual(ANNAHMEN.map((a) => a.feld));
  });
});

describe('pruefeUmsetzungsplan — Regeln', () => {
  it('stellt bei einem vollständigen Plan keine Frage (und sagt nichts über das Unternehmen)', () => {
    const e = pruefeUmsetzungsplan(plan('vollstaendig'));
    expect(e.befunde).toEqual([]);
    expect(e.felderUnbekannt).toEqual([]);
    expect(e.schemaStatus).toBe('vorläufig');
    expect(Object.keys(e)).not.toContain('ok');
    expect(Object.keys(e)).not.toContain('erfuellt');
  });

  it('U1: fragt bei jeder Pflichtangabe ohne Wert, einzeln je Feld', () => {
    for (const feld of PFLICHTANGABEN) {
      const m = vollMassnahme();
      delete (m as unknown as Record<string, unknown>)[feld];
      const b = pruefeUmsetzungsplan(mitMassnahme(m)).befunde;
      expect(b.map((x) => x.regel), feld).toEqual(['U1-PFLICHTANGABE']);
    }
    const leer = pruefeUmsetzungsplan(mitMassnahme(vollMassnahme({ bezeichnung: '  ' })));
    expect(leer.befunde[0].frageDe).toContain('Maßnahmenbezeichnung');
  });

  it('U2: Status außerhalb des Vokabulars wird gefragt, Schreibvarianten nicht', () => {
    expect(regeln(mitMassnahme(vollMassnahme({ status: 'geplant' })))).toEqual(['U2-STATUS']);
    expect(regeln(mitMassnahme(vollMassnahme({ status: 'in bearbeitung' })))).toEqual([]);
    expect(normalisiereStatus(' ABGESCHLOSSEN ')).toBe('Abgeschlossen');
    expect(normalisiereStatus('erledigt')).toBeNull();
  });

  it('U3: Zeitrahmen ohne Jahr oder mit Ende vor Beginn', () => {
    expect(regeln(mitMassnahme(vollMassnahme({ zeitrahmen: 'zeitnah' })))).toEqual(['U3-ZEITRAHMEN']);
    expect(regeln(mitMassnahme(vollMassnahme({ zeitrahmen: '2028-2026' })))).toEqual(['U3-ZEITRAHMEN']);
    for (const ok of ['2026', 'Q3 2026', '2026-2027', 'bis 12/2026', '07.04.2025']) {
      expect(regeln(mitMassnahme(vollMassnahme({ zeitrahmen: ok }))), ok).toEqual([]);
    }
    expect(parseZeitrahmen('2026-2028')).toEqual({ von: 2026, bis: 2028 });
    expect(parseZeitrahmen('12345')).toBeNull();
  });

  it('U4: Investitionsvolumen muss numerisch lesbar sein', () => {
    expect(regeln(mitMassnahme(vollMassnahme({ investitionEur: 'nach Angebot' })))).toEqual(['U4-INVESTITION']);
    expect(parseInvestition('12.500 €')).toBe(12500);
    expect(parseInvestition('12.500,50 EUR')).toBe(12500.5);
    expect(parseInvestition('1,2 Mio. €')).toBe(1_200_000);
    expect(parseInvestition('250 Tsd.')).toBe(250_000);
    expect(parseInvestition(-5)).toBeNull();
    expect(parseInvestition('viel')).toBeNull();
  });

  it('U0: Plan ohne Tabelle (Erklärtext) führt die Felder als unbekannt und schweigt bei den Feldregeln', () => {
    const e = pruefeUmsetzungsplan(plan('erklaertext-ohne-tabelle'));
    expect(e.befunde.map((b) => b.regel)).toEqual(['U0-KEINE-TABELLE']);
    for (const f of PFLICHTANGABEN) expect(e.felderUnbekannt).toContain(`*.${f}`);
    expect(e.felderUnbekannt).toContain('merkblattFassung');
  });

  it('unbekannt ist ein gleichberechtigter Feldwert: gelistet, keine Frage', () => {
    const e = pruefeUmsetzungsplan(mitMassnahme(vollMassnahme({ investitionEur: 'unbekannt', status: 'unbekannt' })));
    expect(e.befunde).toEqual([]);
    expect(e.felderUnbekannt).toEqual(['X1.investitionEur', 'X1.status']);
  });

  it('U5: Merkblattfassung ungleich der gelesenen wird gefragt; gelesene und unbekannt nicht', () => {
    const p = plan('neuere-merkblattfassung');
    const e = pruefeUmsetzungsplan(p);
    expect(e.befunde.map((b) => b.regel)).toEqual(['U5-MERKBLATT']);
    expect(e.befunde[0].frageDe).toContain('05/2026');
    expect(e.befunde[0].frageDe).toContain('ungelesen');
    expect(e.merkblattFassungSchema).toBe('02/2025');
    expect(regeln({ ...p, merkblattFassung: '02/2025', massnahmen: [vollMassnahme()] })).toEqual([]);
  });

  it('kennt den Rechtsstand a. F. / n. F. und wirft bei anderen Werten', () => {
    expect(pruefeUmsetzungsplan({ ...plan('vollstaendig'), rechtsstand: 'a.F.' }).rechtsstand).toBe('a.F.');
    expect(pruefeUmsetzungsplan(plan('vollstaendig')).rechtsstand).toBe('n.F.');
    expect(() => pruefeUmsetzungsplan({ ...plan('vollstaendig'), rechtsstand: 'neu' as never })).toThrow(/Rechtsstand/);
  });

  it('jeder Befund trägt Regel-ID, art frage und Klartext De/En mit Fragezeichen', () => {
    const alleBefunde = alle().flatMap((p) => pruefeUmsetzungsplan(p).befunde);
    expect(alleBefunde.length).toBeGreaterThan(5);
    for (const b of alleBefunde) {
      expect(b.regel).toMatch(/^U\d-[A-Z-]+$/);
      expect(b.art).toBe('frage');
      expect(b.frageDe.trim().endsWith('?')).toBe(true);
      expect(b.frageEn.trim().endsWith('?')).toBe(true);
    }
  });

  it('wirft bei ungültiger Eingabe, statt still zu ignorieren', () => {
    expect(() => pruefeUmsetzungsplan({ ...plan('vollstaendig'), quelle: { url: 'kein-link', abgerufenAm: '2026-09-28' } })).toThrow(/Quell-URL/);
    expect(() => pruefeUmsetzungsplan({ ...plan('vollstaendig'), quelle: { url: 'https://example.org/x', abgerufenAm: '28.09.2026' } })).toThrow(/ISO-Datum/);
    expect(() => pruefeUmsetzungsplan({ ...plan('vollstaendig'), massnahmen: [] })).toThrow(/tabelle/);
    expect(() => pruefeUmsetzungsplan({ ...plan('vollstaendig'), merkblattFassung: '' })).toThrow(/merkblattFassung/);
    expect(() => pruefeUmsetzungsplan(mitMassnahme(vollMassnahme({ prioritaet: -1 })))).toThrow(/prioritaet/);
    const doppelt = { ...plan('vollstaendig'), massnahmen: [vollMassnahme(), vollMassnahme()] };
    expect(() => pruefeUmsetzungsplan(doppelt)).toThrow(/Doppelte/);
  });

  it('zitiert Freitext mit Vorwurfswort nicht in der Frage', () => {
    const b = pruefeUmsetzungsplan(mitMassnahme(vollMassnahme({ status: 'säumig' }))).befunde;
    expect(b[0].regel).toBe('U2-STATUS');
    expect(b[0].frageDe).not.toMatch(/säumig/i);
  });
});

describe('Register — genau zwei Status', () => {
  it('kennt nur „gefunden“ und „kein Plan gefunden“, letzteres mit Stand und Suchweg', () => {
    const reg = erstelleRegister(alle(), suchnachweise);
    expect(new Set(reg.map((z) => z.status))).toEqual(new Set(REGISTER_STATUS));
    const nein = reg.find((z) => z.status === 'kein Plan gefunden')!;
    expect(nein.statusText).toMatch(/^kein Plan gefunden \(Stand: 2026-09-28, Suchweg: Orte: .+; Suchbegriffe: .+\)$/);
    expect(nein.quelleUrl).toBeNull();
    const ja = reg.find((z) => z.status === 'gefunden')!;
    expect(ja.quelleUrl).toMatch(/^https:/);
    expect(ja.abgerufenAm).toBe('2026-09-28');
    expect(reg.find((z) => z.unternehmen === 'Beispiel Metall GmbH')!.archivSnapshot).toMatch(/archiv/);
  });

  it('verlangt Stand und Suchweg; Widerspruch und Doppelung werfen', () => {
    const s = structuredClone(suchnachweise[0]);
    expect(() => erstelleRegister([], [{ ...s, stand: 'gestern' }])).toThrow(/ISO-Datum/);
    expect(() => erstelleRegister([], [{ ...s, suchweg: { orte: [], suchbegriffe: ['x'] } }])).toThrow(/Suchweg ohne Orte/);
    expect(() => erstelleRegister([], [{ ...s, suchweg: { orte: ['x'], suchbegriffe: [' '] } }])).toThrow(/Suchbegriffe/);
    expect(() => erstelleRegister([plan('vollstaendig')], [{ ...s, unternehmen: 'Beispiel Metall GmbH', planstand: '2026-01' }])).toThrow(/Widerspruch/);
    expect(() => erstelleRegister([plan('vollstaendig'), plan('vollstaendig')], [])).toThrow(/Doppelter/);
  });
});

describe('Auswertung — Aggregat, Selektionshinweis, kein Ranking', () => {
  it('rechnet Statusverteilung, Statusquote und Investitionssumme der offenen Maßnahmen', () => {
    const a = erstelleAuswertung([plan('vollstaendig')]);
    expect(a.gefundenePlaene).toBe(1);
    expect(a.massnahmenGesamt).toBe(3);
    expect(a.massnahmenOffen).toBe(1);
    expect(a.statusverteilung).toEqual({ Offen: 1, 'In Bearbeitung': 1, Abgeschlossen: 1, ohneLesbarenStatus: 0 });
    expect(a.investitionOffenEur).toBe(120000);
    expect(a.massnahmenOffenOhneVolumen).toBe(0);
    expect(a.statusquoteProzent).toEqual({ Offen: 33.3, 'In Bearbeitung': 33.3, Abgeschlossen: 33.3 });
  });

  it('nennt die Summe eine Untergrenze, wenn offene Maßnahmen kein lesbares Volumen haben', () => {
    const a = erstelleAuswertung([plan('neuere-merkblattfassung')]);
    expect(a.massnahmenOffen).toBe(1);
    expect(a.massnahmenOffenOhneVolumen).toBe(1);
    expect(auswertungAlsText(a)).toContain('Untergrenze');
  });

  it('gibt bei Plänen ohne lesbaren Status keine Quote aus', () => {
    const a = erstelleAuswertung([plan('erklaertext-ohne-tabelle')]);
    expect(a.statusquoteProzent).toBeNull();
    expect(a.massnahmenGesamt).toBe(0);
  });

  it('trägt den Selektionshinweis fest im Kopf jeder Auswertung, auch ohne Pläne und im Text und in der CSV', () => {
    for (const a of [erstelleAuswertung(alle(), suchnachweise), erstelleAuswertung([]), erstelleAuswertung([], suchnachweise)]) {
      expect(a.kopf.selektionshinweisDe).toBe(SELEKTIONSHINWEIS_DE);
      expect(a.kopf.selektionshinweisDe).toMatch(/Sorgfältigen/);
      expect(a.kopf.selektionshinweisDe).toMatch(/Obergrenze-Tendenz/);
      expect(a.kopf.selektionshinweisEn).toMatch(/diligent/);
      const zeilen = auswertungAlsText(a).split('\n');
      expect(zeilen[1]).toBe(SELEKTIONSHINWEIS_DE);
      expect(registerAlsCsv(a.register).split('\n')[0]).toContain('Sorgfältigen');
      expect(a.kopf.schemaStatus).toBe('vorläufig');
      expect(a.kopf.merkblattFassungGelesen).toBe('02/2025');
    }
  });

  it('sortiert nicht: Erfassungsreihenfolge bleibt erhalten, weder nach Firma noch nach Volumen', () => {
    const p = alle().filter((x) => x.format === 'tabelle');
    const vor = erstelleAuswertung(p).einzelnachweise.map((e) => e.unternehmen);
    const nach = erstelleAuswertung([...p].reverse()).einzelnachweise.map((e) => e.unternehmen);
    expect(vor).toEqual(p.map((x) => x.unternehmen));
    expect(nach).toEqual([...vor].reverse());
    const regNamen = erstelleRegister(p, []).map((z) => z.unternehmen);
    expect(regNamen).toEqual(p.map((x) => x.unternehmen));
    const a = erstelleAuswertung(p);
    expect(Object.keys(a)).not.toEqual(expect.arrayContaining(['ranking']));
    expect(JSON.stringify(a)).not.toMatch(/rang(liste)?"|ranking|platz/i);
  });

  it('bildet keine Quote gegen die 16.461-Schätzung und nennt sie nur als Zitat', () => {
    const a = erstelleAuswertung(alle(), suchnachweise);
    const json = JSON.stringify({ ...a, kopf: undefined });
    expect(json).not.toContain(String(VERPFLICHTETE_SCHAETZUNG));
    const quoten = [a.gefundenePlaene / VERPFLICHTETE_SCHAETZUNG, (a.gefundenePlaene / VERPFLICHTETE_SCHAETZUNG) * 100];
    for (const q of quoten) expect(json).not.toContain(String(q));
    expect(a.kopf.nennerHinweisDe).toMatch(/nie als Nenner/);
    expect(a.kopf.nennerHinweisDe).toMatch(/keine Liste der Verpflichteten/);
    expect(Object.keys(a.statusquoteProzent ?? {})).toEqual([...STATUS_VOKABULAR]);
  });
});

describe('Neutrale Sprache — nie „säumig“, „Verstoß“, „violation“, „fehlt“', () => {
  const alleAusgaben = (): string => {
    const a = erstelleAuswertung(alle(), suchnachweise);
    const befunde = alle().flatMap((p) => pruefeUmsetzungsplan(p).befunde);
    return [JSON.stringify(a), auswertungAlsText(a), registerAlsCsv(a.register), JSON.stringify(befunde)].join('\n');
  };

  it('enthält keine Ausgabe ein Vorwurfswort', () => {
    const text = alleAusgaben();
    for (const w of [/säumig/i, /saeumig/i, /verstoß/i, /verstoss/i, /violation/i, /non-?complian/i, /\bfehlt\b/i, /\bfehlend/i, /\bmissing\b/i]) {
      expect(text, String(w)).not.toMatch(w);
    }
  });

  it('erzwingt das per Code', () => {
    expect(() => assertNeutraleSprache('Firma ist säumig')).toThrow(/Vorwurfswort/);
    expect(() => assertNeutraleSprache('Plan fehlt')).toThrow(/Vorwurfswort/);
    expect(() => assertNeutraleSprache('Verstoß')).toThrow(/Vorwurfswort/);
    expect(() => assertNeutraleSprache('kein Plan gefunden (Stand: 2026-09-28)')).not.toThrow();
    expect(() => erstelleRegister([], [{ ...suchnachweise[0], suchweg: { orte: ['x'], suchbegriffe: ['säumig'] } }])).toThrow(/Vorwurfswort/);
  });

  it('meldet nicht gefundene Pläne nur als „kein Plan gefunden“ mit Datum und Suchweg', () => {
    const reg = erstelleRegister(alle(), suchnachweise);
    for (const z of reg.filter((x) => x.status !== 'gefunden')) {
      expect(z.status).toBe('kein Plan gefunden');
      expect(z.statusText).toMatch(/Stand: \d{4}-\d{2}-\d{2}/);
      expect(z.statusText).toMatch(/Suchweg: Orte:/);
    }
  });

  it('kennt keinen Status „erfüllt“, „ok“ oder „grün“ in Register und Auswertung', () => {
    expect([...REGISTER_STATUS]).toEqual(['gefunden', 'kein Plan gefunden']);
    expect(alleAusgaben()).not.toMatch(/erfüllt|\bgrün\b|"ok"/i);
  });
});

describe('Kern-Hygiene', () => {
  it('bleibt offline: kein fetch, keine Netzwerk- oder Modellimporte', () => {
    const quelle = readFileSync(resolve(__dirname, 'umsetzungsplanPruefer.ts'), 'utf8');
    expect(quelle).not.toMatch(/\bfetch\s*\(/);
    expect(quelle).not.toMatch(/XMLHttpRequest|WebSocket|node:http|node:https|node:net/);
    const importe = [...quelle.matchAll(/^import .* from '(.+)';$/gm)].map((m) => m[1]);
    expect(importe).toEqual(['../vernichtungs-offenlegungsregister/offenlegungsPruefer']);
    expect(quelle).toMatch(/CC0 1\.0 Public Domain/);
  });
});

import { describe, it, expect } from 'vitest';
import {
  bewerteEinzelprobe,
  pruefeTemperaturen,
  analysiereLaborbefund,
  erzeugeMieterSchreibenEntwurf,
  LaborbefundInput
} from './legioKlarEngine';
import fs from 'fs';
import path from 'path';

describe('LegioKlar Engine — Deterministic TrinkwV & UBA assessment', () => {
  it('bewertet unauffällige Proben unter 100 KBE/100ml als grün', () => {
    const res = bewerteEinzelprobe(0, 'Küchenarmatur');
    expect(res.stufe).toBe('keine_auffaelligkeit');
    expect(res.ampelFarbe).toBe('gruen');
    expect(res.massnahmenwertErreicht).toBe(false);

    const res99 = bewerteEinzelprobe(99, 'Dusche EG');
    expect(res99.stufe).toBe('keine_auffaelligkeit');
    expect(res99.ampelFarbe).toBe('gruen');
    expect(res99.massnahmenwertErreicht).toBe(false);
  });

  it('erkennt mittleren Befall (100 bis <1000 KBE) als gelbe Kontamination', () => {
    const res100 = bewerteEinzelprobe(100, 'Steigstrang');
    expect(res100.stufe).toBe('mittlere_kontamination');
    expect(res100.ampelFarbe).toBe('gelb');
    expect(res100.massnahmenwertErreicht).toBe(true);

    const res999 = bewerteEinzelprobe(999, 'Zirkulationsleitung');
    expect(res999.stufe).toBe('mittlere_kontamination');
    expect(res999.ampelFarbe).toBe('gelb');
  });

  it('erkennt hohen Befall (1.000 bis <10.000 KBE) als orange Kontamination', () => {
    const res1000 = bewerteEinzelprobe(1000, 'Dusche OG');
    expect(res1000.stufe).toBe('hohe_kontamination');
    expect(res1000.ampelFarbe).toBe('orange');
    expect(res1000.massnahmenwertErreicht).toBe(true);
  });

  it('erkennt extrem hohen Befall (≥ 10.000 KBE) als roten Gefahrenwert', () => {
    const res10000 = bewerteEinzelprobe(10000, 'Zapfstelle Keller');
    expect(res10000.stufe).toBe('extrem_hohe_kontamination');
    expect(res10000.ampelFarbe).toBe('rot');
    expect(res10000.massnahmenwertErreicht).toBe(true);
  });

  it('wirft Fehler bei negativen oder ungültigen KBE-Werten', () => {
    expect(() => bewerteEinzelprobe(-5, 'Test')).toThrow();
    expect(() => bewerteEinzelprobe(NaN, 'Test')).toThrow();
  });

  it('identifiziert Speichertemperaturen unter 60°C nach DVGW W 551', () => {
    const abw = pruefeTemperaturen({ speicherTemperaturC: 56.5 });
    expect(abw.length).toBe(1);
    expect(abw[0].sollMinC).toBe(60.0);
    expect(abw[0].differenzC).toBe(3.5);
    expect(abw[0].normquelle).toContain('DVGW Arbeitsblatt W 551');
  });

  it('identifiziert Zirkulationsrücklauf unter 55°C nach DVGW W 551', () => {
    const abw = pruefeTemperaturen({ zirkulationRuecklaufC: 48.0 });
    expect(abw.length).toBe(1);
    expect(abw[0].sollMinC).toBe(55.0);
    expect(abw[0].differenzC).toBe(7.0);
  });

  it('analysiert vollständigen Laborbefund aus synthetischer Fixture', () => {
    const fixturePath = path.resolve(__dirname, '../../../07-demos/legio-klar/data/synthetischer-aushang-befund.json');
    const data: LaborbefundInput = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

    const analyse = analysiereLaborbefund(data);

    expect(analyse.maximalKbePro100ml).toBe(12500);
    expect(analyse.gesamtStufe).toBe('extrem_hohe_kontamination');
    expect(analyse.gesamtAmpelFarbe).toBe('rot');
    expect(analyse.massnahmenwertUeberschritten).toBe(true);
    expect(analyse.betroffeneEntnahmestellenAnzahl).toBe(3);
    expect(analyse.gesetzlichePflichtenBetreiber.meldungGesundheitsamtPflicht).toBe(true);
    expect(analyse.gesetzlichePflichtenBetreiber.risikoabschaetzungPflicht).toBe(true);
    expect(analyse.gesetzlichePflichtenBetreiber.duschverbotOderFilterEmpfohlen).toBe(true);
  });

  it('generiert ein Mängelanzeigen-Schreiben mit relevanten BGB- und TrinkwV-Normen', () => {
    const fixturePath = path.resolve(__dirname, '../../../07-demos/legio-klar/data/synthetischer-aushang-befund.json');
    const data: LaborbefundInput = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const analyse = analysiereLaborbefund(data);

    const brief = erzeugeMieterSchreibenEntwurf({
      mieterName: 'Max Mustermieter',
      wohnungLage: '3. OG rechts',
      vermieterOderVerwaltung: 'Hausverwaltung Sonnenschein GmbH',
      gebaeudeAdresse: 'Hauptstraße 12, 10115 Berlin',
      analyse,
      aushangDatum: '25.09.2026'
    });

    expect(brief).toContain('Mängelanzeige gem. § 536c BGB');
    expect(brief).toContain('12500 KBE/100 ml');
    expect(brief).toContain('extrem hohe kontamination');
    expect(brief).toContain('§ 51 Abs. 1 Trinkwasserverordnung');
    expect(brief).toContain('Sterilfilter');
  });

  it('erzeugt sauberes Schreiben ohne Mängelvorwurf bei unauffälligem Befund', () => {
    const cleanData: LaborbefundInput = {
      probeDatum: '2026-10-01',
      proben: [
        { entnahmestelle: 'Keller', kbePro100ml: 0 },
        { entnahmestelle: 'Dachgeschoss', kbePro100ml: 15 }
      ]
    };
    const analyse = analysiereLaborbefund(cleanData);
    expect(analyse.massnahmenwertUeberschritten).toBe(false);

    const brief = erzeugeMieterSchreibenEntwurf({
      mieterName: 'Erika Musterfrau',
      wohnungLage: '1. OG',
      vermieterOderVerwaltung: 'Verwaltung Test',
      gebaeudeAdresse: 'Weg 1',
      analyse
    });

    expect(brief).toContain('keine Überschreitung des technischen Maßnahmenwertes');
    expect(brief).not.toContain('Sterilfilter');
  });
});

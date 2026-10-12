/**
 * LegioKlar — Deterministic TrinkwV § 51 / § 52 & UBA Assessment Engine
 *
 * Implements:
 * - Trinkwasserverordnung (TrinkwV 2023) § 31, § 51, § 52
 * - Anlage 3 Teil II TrinkwV (Technischer Maßnahmenwert 100 KBE/100ml)
 * - DVGW Arbeitsblatt W 551 (Temperaturen ≥ 60°C Speicher, ≥ 55°C Zirkulation)
 * - UBA-Empfehlung Risikoabschätzung (Dezember 2018 / 2023) Maßnahmenmatrix
 *
 * SAFETY INVARIANTS:
 * - Does not make legal guarantees or deliver final legal representation (no RDG violations).
 * - Implements neutral, factual classification based directly on published statutes and guidelines.
 * - Extracts CFU/100ml, sampling points, and temperatures deterministically.
 */

export type UbaStufe = 'keine_auffaelligkeit' | 'mittlere_kontamination' | 'hohe_kontamination' | 'extrem_hohe_kontamination';

export interface ProbeBefund {
  id?: string;
  entnahmestelle: string;
  entnahmeTyp?: 'speicheraustritt' | 'zirkulationsruecklauf' | 'steigstrang' | 'peripherie_wohnung' | 'sonstige';
  kbePro100ml: number;
  temperaturC?: number;
  nachweisgrenze?: number;
  spezies?: string;
}

export interface AnlageBefund {
  gebaeudeTyp?: string;
  speicherVolumenLiter?: number;
  rohrleitungsVolumenLiter?: number;
  zirkulationVorhanden?: boolean;
  speicherTemperaturC?: number;
  zirkulationRuecklaufC?: number;
}

export interface LaborbefundInput {
  laborName?: string;
  akkreditierungsNummer?: string;
  befundNummer?: string;
  probeDatum: string;
  eingangDatum?: string;
  ausgabeDatum?: string;
  anlage?: AnlageBefund;
  proben: ProbeBefund[];
}

export interface Einzelbewertung {
  entnahmestelle: string;
  kbePro100ml: number;
  stufe: UbaStufe;
  ampelFarbe: 'gruen' | 'gelb' | 'orange' | 'rot';
  massnahmenwertErreicht: boolean;
  hinweisDe: string;
  hinweisEn: string;
}

export interface TemperaturAbweichung {
  messort: string;
  gemessenC: number;
  sollMinC: number;
  differenzC: number;
  normquelle: string;
  befundDe: string;
  befundEn: string;
}

export interface LegioKlarAnalyse {
  gesamtStufe: UbaStufe;
  gesamtAmpelFarbe: 'gruen' | 'gelb' | 'orange' | 'rot';
  maximalKbePro100ml: number;
  massnahmenwertUeberschritten: boolean;
  betroffeneEntnahmestellenAnzahl: number;
  einzelbewertungen: Einzelbewertung[];
  temperaturAbweichungen: TemperaturAbweichung[];
  gesetzlichePflichtenBetreiber: {
    meldungGesundheitsamtPflicht: boolean;
    risikoabschaetzungPflicht: boolean;
    untersuchungspflichtUrsachen: boolean;
    informationVerbraucherPflicht: boolean;
    duschverbotOderFilterEmpfohlen: boolean;
    normen: string[];
  };
  mieterRechteHinweise: {
    auskunftsanspruchRisikoabschaetzung: boolean;
    maengelanzeigeParagraph: string;
    gesundheitsVorsorge: string[];
    rechtsquellen: string[];
  };
}

/**
 * Bewertet eine einzelne Probe nach der offiziellen UBA-Matrix (KBE/100ml).
 */
export function bewerteEinzelprobe(kbe: number, entnahmestelle: string): Einzelbewertung {
  if (kbe < 0 || isNaN(kbe)) {
    throw new Error(`Ungültiger KBE-Wert: ${kbe}`);
  }

  if (kbe < 100) {
    return {
      entnahmestelle,
      kbePro100ml: kbe,
      stufe: 'keine_auffaelligkeit',
      ampelFarbe: 'gruen',
      massnahmenwertErreicht: false,
      hinweisDe: 'Keine Auffälligkeit. Technischer Maßnahmenwert (100 KBE/100 ml) nicht erreicht.',
      hinweisEn: 'No anomaly. Technical action threshold (100 CFU/100 ml) not reached.'
    };
  } else if (kbe < 1000) {
    return {
      entnahmestelle,
      kbePro100ml: kbe,
      stufe: 'mittlere_kontamination',
      ampelFarbe: 'gelb',
      massnahmenwertErreicht: true,
      hinweisDe: 'Mittlere Kontamination (100 bis <1.000 KBE/100 ml). Technischer Maßnahmenwert nach TrinkwV erreicht.',
      hinweisEn: 'Medium contamination (100 to <1,000 CFU/100 ml). Technical action value reached per Drinking Water Ordinance.'
    };
  } else if (kbe < 10000) {
    return {
      entnahmestelle,
      kbePro100ml: kbe,
      stufe: 'hohe_kontamination',
      ampelFarbe: 'orange',
      massnahmenwertErreicht: true,
      hinweisDe: 'Hohe Kontamination (1.000 bis <10.000 KBE/100 ml). Mittelfristige Sanierungspflicht & Ursachenermittlung.',
      hinweisEn: 'High contamination (1,000 to <10,000 CFU/100 ml). Medium-term remediation and root-cause analysis mandatory.'
    };
  } else {
    return {
      entnahmestelle,
      kbePro100ml: kbe,
      stufe: 'extrem_hohe_kontamination',
      ampelFarbe: 'rot',
      massnahmenwertErreicht: true,
      hinweisDe: 'Extrem hohe Kontamination (≥ 10.000 KBE/100 ml). Akute Gefahrenabwehr: Duschverbot oder endständige Sterilfilter indiziert.',
      hinweisEn: 'Extremely high contamination (≥ 10,000 CFU/100 ml). Acute risk prevention: shower ban or terminal sterilising filters indicated.'
    };
  }
}

/**
 * Überprüft Wassertemperaturen gegen DVGW W 551 (Warmwassertemperatur an Speicher und Zirkulation).
 */
export function pruefeTemperaturen(anlage?: AnlageBefund, proben?: ProbeBefund[]): TemperaturAbweichung[] {
  const abweichungen: TemperaturAbweichung[] = [];

  if (anlage?.speicherTemperaturC !== undefined) {
    const soll = 60.0;
    if (anlage.speicherTemperaturC < soll) {
      abweichungen.push({
        messort: 'Warmwasserspeicher Austritt',
        gemessenC: anlage.speicherTemperaturC,
        sollMinC: soll,
        differenzC: Math.round((soll - anlage.speicherTemperaturC) * 10) / 10,
        normquelle: 'DVGW Arbeitsblatt W 551, Abs. 5.1 (Warmwasserspeicheraustritt ≥ 60 °C)',
        befundDe: `Speichertemperatur liegt mit ${anlage.speicherTemperaturC} °C unter dem DVGW-Mindestwert von 60 °C.`,
        befundEn: `Water heater temperature at ${anlage.speicherTemperaturC} °C is below the DVGW minimum threshold of 60 °C.`
      });
    }
  }

  if (anlage?.zirkulationRuecklaufC !== undefined) {
    const soll = 55.0;
    if (anlage.zirkulationRuecklaufC < soll) {
      abweichungen.push({
        messort: 'Zirkulationsleitung Rücklauf',
        gemessenC: anlage.zirkulationRuecklaufC,
        sollMinC: soll,
        differenzC: Math.round((soll - anlage.zirkulationRuecklaufC) * 10) / 10,
        normquelle: 'DVGW Arbeitsblatt W 551, Abs. 5.2 (Zirkulationsrücklauf ≥ 55 °C)',
        befundDe: `Zirkulationsrücklauf liegt mit ${anlage.zirkulationRuecklaufC} °C unter dem DVGW-Mindestwert von 55 °C (Temperaturabfall > 5 K).`,
        befundEn: `Circulation return temperature at ${anlage.zirkulationRuecklaufC} °C is below the DVGW minimum threshold of 55 °C.`
      });
    }
  }

  if (proben) {
    for (const p of proben) {
      if (p.temperaturC !== undefined && (p.entnahmeTyp === 'steigstrang' || p.entnahmeTyp === 'peripherie_wohnung')) {
        if (p.temperaturC > 25.0 && p.temperaturC < 55.0) {
          abweichungen.push({
            messort: p.entnahmestelle,
            gemessenC: p.temperaturC,
            sollMinC: 55.0,
            differenzC: Math.round((55.0 - p.temperaturC) * 10) / 10,
            normquelle: 'DVGW W 551 / TrinkwV (Vermeidung des Legionellen-Wachstumsbereichs 25–50 °C)',
            befundDe: `Temperatur an Entnahmestelle (${p.temperaturC} °C) liegt im optimalen Vermehrungsbereich für Legionellen (25–50 °C).`,
            befundEn: `Temperature at sampling point (${p.temperaturC} °C) is in the ideal Legionella growth window (25–50 °C).`
          });
        }
      }
    }
  }

  return abweichungen;
}

/**
 * Führt die Gesamtanalyse eines Laborbefunds durch.
 */
export function analysiereLaborbefund(befund: LaborbefundInput): LegioKlarAnalyse {
  if (!befund.proben || befund.proben.length === 0) {
    throw new Error('Laborbefund enthält keine Proben.');
  }

  const einzelbewertungen = befund.proben.map(p => bewerteEinzelprobe(p.kbePro100ml, p.entnahmestelle));
  const maxKbe = Math.max(...befund.proben.map(p => p.kbePro100ml));
  const betroffeneStellen = einzelbewertungen.filter(e => e.massnahmenwertErreicht).length;
  const massnahmenwertUeberschritten = betroffeneStellen > 0;

  let gesamtStufe: UbaStufe = 'keine_auffaelligkeit';
  let gesamtAmpelFarbe: 'gruen' | 'gelb' | 'orange' | 'rot' = 'gruen';

  if (maxKbe >= 10000) {
    gesamtStufe = 'extrem_hohe_kontamination';
    gesamtAmpelFarbe = 'rot';
  } else if (maxKbe >= 1000) {
    gesamtStufe = 'hohe_kontamination';
    gesamtAmpelFarbe = 'orange';
  } else if (maxKbe >= 100) {
    gesamtStufe = 'mittlere_kontamination';
    gesamtAmpelFarbe = 'gelb';
  }

  const temperaturAbweichungen = pruefeTemperaturen(befund.anlage, befund.proben);

  const gesetzlichePflichtenBetreiber = {
    meldungGesundheitsamtPflicht: massnahmenwertUeberschritten,
    risikoabschaetzungPflicht: massnahmenwertUeberschritten,
    untersuchungspflichtUrsachen: massnahmenwertUeberschritten,
    informationVerbraucherPflicht: massnahmenwertUeberschritten,
    duschverbotOderFilterEmpfohlen: gesamtStufe === 'extrem_hohe_kontamination',
    normen: [
      '§ 51 Abs. 1 TrinkwV (Handlungspflichten des Betreibers bei Erreichen des Maßnahmenwertes)',
      '§ 52 TrinkwV (Verbraucherinformation & Information der betroffenen Bewohner)',
      'Anlage 3 Teil II TrinkwV (Technischer Maßnahmenwert: 100 KBE/100 ml)',
      'UBA-Empfehlung Systemische Untersuchungen von Trinkwasser-Installationen auf Legionellen'
    ]
  };

  const mieterRechteHinweise = {
    auskunftsanspruchRisikoabschaetzung: massnahmenwertUeberschritten,
    maengelanzeigeParagraph: '§ 536c BGB (Anzeigepflicht des Mieters) i.V.m. § 536 BGB (Mietminderung bei Sachmangel)',
    gesundheitsVorsorge: [
      'Beim Duschen Aerosolbildung reduzieren (Brausekopf nahe an den Körper halten, gut lüften).',
      ...(gesamtStufe === 'extrem_hohe_kontamination'
        ? ['Duschverbot bis zur Freigabe durch Gesundheitsamt bzw. bis zur Installation geprüfter Sterilfilter.']
        : []),
      'Stagnationswasser nach Abwesenheit ablaufen lassen, bis die Wassertemperatur konstant bleibt.'
    ],
    rechtsquellen: [
      'TrinkwV § 51, § 52',
      'BGB § 535, § 536, § 536c',
      'AG Berlin-Neukölln Az. 11 C 418/14 (Mietminderungsanspruch bei Legionellenbefall)',
      'LG Berlin Az. 65 S 275/15'
    ]
  };

  return {
    gesamtStufe,
    gesamtAmpelFarbe,
    maximalKbePro100ml: maxKbe,
    massnahmenwertUeberschritten,
    betroffeneEntnahmestellenAnzahl: betroffeneStellen,
    einzelbewertungen,
    temperaturAbweichungen,
    gesetzlichePflichtenBetreiber,
    mieterRechteHinweise
  };
}

/**
 * Erzeugt einen rechtlich sauberen Entwurf eines Mieter-Auskunftsersuchens / Mängelanzeige.
 */
export function erzeugeMieterSchreibenEntwurf(params: {
  mieterName: string;
  wohnungLage: string;
  vermieterOderVerwaltung: string;
  gebaeudeAdresse: string;
  analyse: LegioKlarAnalyse;
  aushangDatum?: string;
}): string {
  const { mieterName, wohnungLage, vermieterOderVerwaltung, gebaeudeAdresse, analyse, aushangDatum } = params;

  const datumZeile = aushangDatum ? `nach dem Hausaushang vom ${aushangDatum}` : 'laut aktuellem Aushang';

  let schreiben = `Mängelanzeige gem. § 536c BGB und Auskunftsersuchen gem. § 51 / § 52 TrinkwV\n\n`;
  schreiben += `An: ${vermieterOderVerwaltung}\n`;
  schreiben += `Von: ${mieterName}, Wohnung: ${wohnungLage}, Liegenschaft: ${gebaeudeAdresse}\n\n`;
  schreiben += `Sehr geehrte Damen und Herren,\n\n`;
  schreiben += `in der oben genannten Liegenschaft wurden ${datumZeile} mikrobiologische Laboruntersuchungen des Trinkwassers auf Legionellen (Legionella spec.) bekanntgegeben.\n\n`;
  schreiben += `Befundzusammenfassung:\n`;
  schreiben += `- Höchster gemessener Legionellenwert: ${analyse.maximalKbePro100ml} KBE/100 ml\n`;
  schreiben += `- Gesetzlicher technischer Maßnahmenwert (100 KBE/100 ml): ${analyse.massnahmenwertUeberschritten ? 'ÜBERSCHRITTEN' : 'eingehalten'}\n`;
  schreiben += `- Betroffene Entnahmestellen: ${analyse.betroffeneEntnahmestellenAnzahl} von ${analyse.einzelbewertungen.length}\n`;
  schreiben += `- Risikostufe nach UBA-Maßnahmenmatrix: ${analyse.gesamtStufe.replace(/_/g, ' ')}\n\n`;

  if (analyse.massnahmenwertUeberschritten) {
    schreiben += `Gemäß § 51 Abs. 1 Trinkwasserverordnung (TrinkwV) sind Sie als Betreiber der Trinkwasser-Installation verpflichtet, bei Erreichen des technischen Maßnahmenwertes unverzüglich:\n`;
    schreiben += `1. das zuständige Gesundheitsamt zu unterrichten,\n`;
    schreiben += `2. Untersuchungen zur Aufklärung der Ursachen durchzuführen,\n`;
    schreiben += `3. eine schriftliche Risikoabschätzung (Gefährdungsanalyse) nach UBA-Empfehlungen zu erstellen,\n`;
    schreiben += `4. Maßnahmen zur Abhilfe und zum Schutz der Gesundheit der Bewohner einzuleiten.\n\n`;

    schreiben += `Ich fordere Sie hiermit auf:\n`;
    schreiben += `1. mir unverzüglich schriftlich mitzuteilen, welche Maßnahmen zur Gefahrenabwehr eingeleitet wurden,\n`;
    schreiben += `2. Einsicht in die vorgeschriebene Risikoabschätzung bzw. das Gutachten zu gewähren,\n`;
    schreiben += `3. den Mangel an der Trinkwasseranlage zeitnah und fachgerecht zu beseitigen.\n\n`;

    if (analyse.gesamtStufe === 'extrem_hohe_kontamination') {
      schreiben += `Aufgrund der extrem hohen Keimbelastung (≥ 10.000 KBE/100 ml) besteht eine erhebliche Gesundheitsgefahr durch Aerosole. Ich bitte um unverzügliche Bereitstellung geeigneter endständiger Sterilfilter für die Dusche.\n\n`;
    }

    schreiben += `Ich behalte mir die Geltendmachung weiterer gesetzlicher Mieterrechte (u. a. Mietminderung gem. § 536 BGB sowie Schadensersatz) ausdrücklich vor.\n\n`;
  } else {
    schreiben += `Der Befund weist gegenwärtig keine Überschreitung des technischen Maßnahmenwertes auf. Ich bitte weiterhin um Einhaltung der vorgeschriebenen Untersuchungsturnusse.\n\n`;
  }

  schreiben += `Mit freundlichen Grüßen,\n${mieterName}`;
  return schreiben;
}

/**
 * Rechnet das LAG-VSW-Bewertungsschema aus — und nichts sonst.
 *
 * Gleiche Logik wie die Python-Fassung in 04-werkzeug/glasanflug-ampel/ampel.py,
 * inklusive der beiden Vorrangregeln, der Fußnote-2-Ausnahme, des vom Beschluss
 * ungeregelten Regelkonflikts und der Stufe "unbestimmt", die keine Zahl errät.
 */

import {
  KRITERIEN,
  KriteriumId,
  Punktwert,
  Risikostufe,
  RISIKOSTUFEN,
  RisikostufenEintrag,
  Herkunft,
  SCHEMA_QUELLE,
  SCHWELLENWERTE,
} from './schema';

export interface Eingabewert {
  punkte: Punktwert | null;
  herkunft: Herkunft;
}

export type Eingabe = Record<KriteriumId, Eingabewert>;

export interface VorrangHinweis {
  art: 'immer_hoch' | 'immer_gering' | 'konflikt' | 'fussnote_2';
  de: string;
  en: string;
}

export interface Bewertung {
  vollstaendig: boolean;
  unbestimmt: KriteriumId[];
  summe: number | null;
  stufe: Risikostufe | null;
  eintrag: RisikostufenEintrag | null;
  vorrang: VorrangHinweis[];
  schema: string;
}

const stufeFuerSumme = (summe: number): RisikostufenEintrag => {
  const treffer = RISIKOSTUFEN.find((r) => summe >= r.min && summe <= r.max);
  if (!treffer) throw new Error(`Summe ${summe} liegt außerhalb von 4–16.`);
  return treffer;
};

const nameVon = (id: KriteriumId, lang: 'de' | 'en') => {
  const k = KRITERIEN.find((x) => x.id === id)!;
  return lang === 'de' ? k.nameDe : k.nameEn;
};

/**
 * @param fussnote2Begruendung Wenn gesetzt, greift die Vorrangregel "immer hoch"
 *   nicht — etwa bei einer Spiegelfassade, in der sich nachweislich keine
 *   Vegetation spiegelt. Ohne Begründungstext greift die Regel.
 */
export function bewerte(eingabe: Eingabe, fussnote2Begruendung?: string): Bewertung {
  const ids = KRITERIEN.map((k) => k.id);
  const unbestimmt = ids.filter((id) => eingabe[id].punkte === null);

  if (unbestimmt.length > 0) {
    return {
      vollstaendig: false,
      unbestimmt,
      summe: null,
      stufe: null,
      eintrag: null,
      vorrang: [],
      schema: SCHEMA_QUELLE,
    };
  }

  const summe = ids.reduce((acc, id) => acc + (eingabe[id].punkte as number), 0);
  let eintrag = stufeFuerSumme(summe);
  const vorrang: VorrangHinweis[] = [];

  let glasVorrang = eingabe.glasanteil.punkte === 4;
  const fassadeVorrang = eingabe.fassadengestaltung.punkte === 1;

  if (glasVorrang && fussnote2Begruendung && fussnote2Begruendung.trim().length > 0) {
    vorrang.push({
      art: 'fussnote_2',
      de: `Vorrangregel „immer hoch" nach Fußnote 2 nicht angewandt. Begründung: ${fussnote2Begruendung.trim()}`,
      en: `Priority rule "always high" waived under footnote 2. Reason: ${fussnote2Begruendung.trim()}`,
    });
    glasVorrang = false;
  }

  if (glasVorrang && fassadeVorrang) {
    // Der Beschluss regelt diesen Fall nicht. Nicht still entscheiden.
    vorrang.push({
      art: 'konflikt',
      de: 'Regelkonflikt: Glasanteil = 4 fordert „immer hoch", Fassadengestaltung = 1 fordert „immer gering". Der Beschluss regelt den Fall nicht. Eingestuft wird nach Punktsumme; die fachliche Entscheidung bleibt beim Menschen.',
      en: 'Rule conflict: glass share = 4 demands "always high", façade design = 1 demands "always low". The decision does not cover this case. Classification falls back to the point sum; the professional call stays with a human.',
    });
  } else if (glasVorrang) {
    eintrag = RISIKOSTUFEN.find((r) => r.stufe === 'hoch')!;
    vorrang.push({
      art: 'immer_hoch',
      de: `Vorrangregel Tab. 3: ${nameVon('glasanteil', 'de')} = 4 → Gesamtbewertung immer „hoch", unabhängig von der Punktsumme.`,
      en: `Priority rule (Tab. 3): ${nameVon('glasanteil', 'en')} = 4 → overall rating always "high", regardless of the point sum.`,
    });
  } else if (fassadeVorrang) {
    eintrag = RISIKOSTUFEN.find((r) => r.stufe === 'gering')!;
    vorrang.push({
      art: 'immer_gering',
      de: `Vorrangregel Tab. 3: ${nameVon('fassadengestaltung', 'de')} = 1 → Gesamtbewertung immer „gering", unabhängig von der Punktsumme.`,
      en: `Priority rule (Tab. 3): ${nameVon('fassadengestaltung', 'en')} = 1 → overall rating always "low", regardless of the point sum.`,
    });
  }

  return {
    vollstaendig: true,
    unbestimmt: [],
    summe,
    stufe: eintrag.stufe,
    eintrag,
    vorrang,
    schema: SCHEMA_QUELLE,
  };
}

export interface SchwellenwertErgebnis {
  je100m: number;
  normal: number;
  signifikantErhoehtAb: number;
  signifikantErhoeht: boolean;
}

/** Kategorie 2: rechnet ein Monitoringergebnis auf 100 m Fassadenlänge um. */
export function signifikanzschwelle(
  kollisionenProJahr: number,
  fassadenlaengeM: number
): SchwellenwertErgebnis | null {
  if (!(fassadenlaengeM > 0) || kollisionenProJahr < 0) return null;
  const je100m = (kollisionenProJahr * 100) / fassadenlaengeM;
  return {
    je100m: Math.round(je100m * 100) / 100,
    normal: SCHWELLENWERTE.normal,
    signifikantErhoehtAb: SCHWELLENWERTE.signifikantErhoehtAb,
    signifikantErhoeht: je100m >= SCHWELLENWERTE.signifikantErhoehtAb,
  };
}

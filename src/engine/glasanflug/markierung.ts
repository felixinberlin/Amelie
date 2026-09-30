/**
 * Abgleich einer geplanten Markierung mit den geprüften Mustern der
 * Wiener Umweltanwaltschaft (WUA) — und nichts sonst.
 *
 * Quelle: Wiener Umweltanwaltschaft / Biologische Station Hohenau-Ringelsdorf
 * (M. Rössler, W. Doppler), "Die Prüfung von Vogelschutzglas — Geprüfte Muster",
 * 5. Auflage 2022. Nur Tatsachen (Maße, Prozentwerte) mit Quellenangabe, nicht
 * der Broschürentext. Vor jeder Verwendung gegen wua-wien.at prüfen.
 *
 * Wichtig: Das sind produktspezifische Flugtunnel-Ergebnisse, keine gesetzlich
 * verbindliche Liste (Auskunft NABU, 29.09.2026). Ein Muster, das hier fehlt,
 * ist "nicht getestet", nie "unwirksam". Die Funktion sagt nie "unzulässig".
 */

export const WUA_QUELLE = 'WUA / Biol. Station Hohenau-Ringelsdorf, Geprüfte Muster, 5. Aufl. 2022';

export type Testart = 'durchsicht' | 'spiegelung';
export type Kategorie = 'A' | 'B' | 'C' | 'D';

export const KATEGORIE_TEXT: Record<Kategorie, { de: string; en: string; grenze: string }> = {
  A: { de: 'hoch wirksam („Vogelschutzglas" im Sinne ONR 191040)', en: 'highly effective ("bird-safe glass" per ONR 191040)', grenze: '≤ 10 %' },
  B: { de: 'bedingt geeignet', en: 'conditionally suitable', grenze: '> 10–20 %' },
  C: { de: 'wenig wirksam', en: 'weakly effective', grenze: '> 20–42 %' },
  D: { de: 'unwirksam', en: 'ineffective', grenze: '> 42 %' },
};

/** Kategorien nach Anflügen zur Prüfscheibe in Prozent (WUA, Hohenauer Schema). */
export function kategorieFuerAnfluege(prozent: number): Kategorie {
  if (prozent <= 10) return 'A';
  if (prozent <= 20) return 'B';
  if (prozent <= 42) return 'C';
  return 'D';
}

export interface Muster {
  /** Nummer in der Broschüre: "4S" (Spiegelung/WIN) oder "3D" (Durchsicht/ONR). */
  nr: string;
  test: Testart;
  nameDe: string;
  nameEn: string;
  anfluegeProzent: number;
  /** Aufbringungsebene: 1 = Anflugseite (außen), 2 = Rückseite Einfachscheibe / erste Scheibe Isolierglas. */
  position?: 1 | 2;
  deckungsgradProzent?: number;
  /** Außenreflexion der Prüfscheibe; nur bei Spiegelungstests, sonst undefiniert. */
  arProzent?: number;
  pruefjahr?: number;
  /** Nur zur Orientierung: die Broschüre nennt sie als für Nachrüstung auf Ebene 1 geeignet. */
  hinweisDe?: string;
  hinweisEn?: string;
}

export const WUA_MUSTER: Muster[] = [
  // --- Fenster und Fassaden (Spiegelung, WIN-Test) ---
  { nr: '1S', test: 'spiegelung', nameDe: 'ZooLex/Gasperlmair Astmuster, Digitaldruck RAL 6014', nameEn: 'ZooLex/Gasperlmair branch pattern, digital print RAL 6014', anfluegeProzent: 4, position: 1, deckungsgradProzent: 22.5, arProzent: 8, pruefjahr: 2020, hinweisDe: 'Für Zoos entwickelt; Deckungsgrad 20–25 %.', hinweisEn: 'Developed for zoos; coverage 20–25 %.' },
  { nr: '2S', test: 'spiegelung', nameDe: 'AGC Interpane Siebdruck ähnlich Ätzton, Rechtecke 8 × 30 mm', nameEn: 'AGC Interpane screen print, etched look, rectangles 8 × 30 mm', anfluegeProzent: 6, position: 1, deckungsgradProzent: 11, arProzent: 8, pruefjahr: 2019 },
  { nr: '3S', test: 'spiegelung', nameDe: 'Saflex FlySafe 3D SEEN shiny 9/90 ISO (Isolierglas, Low-E)', nameEn: 'Saflex FlySafe 3D SEEN shiny 9/90 ISO (IGU, low-E)', anfluegeProzent: 6, position: 2, deckungsgradProzent: 0.8, arProzent: 12, pruefjahr: 2020 },
  { nr: '4S', test: 'spiegelung', nameDe: 'Ornilux design lines 5/95, Decochrome, Streifen 5 mm, KA 95 mm', nameEn: 'Ornilux design lines 5/95, Decochrome, 5 mm stripes, 95 mm gap', anfluegeProzent: 8, position: 1, deckungsgradProzent: 5, pruefjahr: 2020 },
  { nr: '5S', test: 'spiegelung', nameDe: 'AviSafe AS/h (hard-eDGe) laminated 70/40, Halbspiegelbeschichtung', nameEn: 'AviSafe AS/h (hard-eDGe) laminated 70/40, half-mirror coating', anfluegeProzent: 9, position: 1, pruefjahr: 2021 },
  { nr: '6S', test: 'spiegelung', nameDe: 'SEEN shiny 9/90 (später Saflex), Aluminiumpunkte 9 mm, MPA 90 mm', nameEn: 'SEEN shiny 9/90 (later Saflex), aluminium dots 9 mm, 90 mm pitch', anfluegeProzent: 9, position: 2, deckungsgradProzent: 0.8, arProzent: 8, pruefjahr: 2019, hinweisDe: 'Auf Position 1 zur Nachrüstung geeignet.', hinweisEn: 'Suitable for retrofit on position 1.' },
  { nr: '7S', test: 'spiegelung', nameDe: 'SEEN matt 9/90, Aluminiumpunkte 9 mm, MPA 90 mm', nameEn: 'SEEN matt 9/90, aluminium dots 9 mm, 90 mm pitch', anfluegeProzent: 9, position: 2, deckungsgradProzent: 0.8, arProzent: 8, pruefjahr: 2019, hinweisDe: 'Auf Position 1 zur Nachrüstung geeignet.', hinweisEn: 'Suitable for retrofit on position 1.' },
  { nr: '8S', test: 'spiegelung', nameDe: 'Saflex FlySafe 3D SEEN shiny 9/90 in VSG mit Sonnenschutzschicht', nameEn: 'Saflex FlySafe 3D SEEN shiny 9/90 in laminated glass with solar coating', anfluegeProzent: 10, position: 2, deckungsgradProzent: 0.8, arProzent: 19, pruefjahr: 2021 },
  { nr: '9S', test: 'spiegelung', nameDe: 'SEDAK Quadrate 12 mm schwarz, Siebdruck RAL 9005, MPA 90 mm', nameEn: 'SEDAK squares 12 mm black, screen print RAL 9005, 90 mm pitch', anfluegeProzent: 10, position: 1, deckungsgradProzent: 1.8, arProzent: 8, pruefjahr: 2019 },
  { nr: '10S', test: 'spiegelung', nameDe: 'Punktraster Anthrazit 10/100, Klebefolie geplottet RAL 7016', nameEn: 'Anthracite dot grid 10/100, plotted adhesive film RAL 7016', anfluegeProzent: 11, position: 1, deckungsgradProzent: 0.8, arProzent: 8, pruefjahr: 2018, hinweisDe: 'Zur Nachrüstung geeignet.', hinweisEn: 'Suitable for retrofit.' },
  { nr: '11S', test: 'spiegelung', nameDe: 'Saflex FlySafe SEEN shiny 3/50, Aluminiumpunkte 3 mm', nameEn: 'Saflex FlySafe SEEN shiny 3/50, aluminium dots 3 mm', anfluegeProzent: 14, position: 2, deckungsgradProzent: 0.3, arProzent: 12, pruefjahr: 2020 },
  { nr: '12S', test: 'spiegelung', nameDe: 'Ornilux design dart 9/90, Decochrome, durchbrochene Punkte', nameEn: 'Ornilux design dart 9/90, Decochrome, open dots', anfluegeProzent: 16, position: 1, deckungsgradProzent: 0.4, pruefjahr: 2020 },
  { nr: '13S', test: 'spiegelung', nameDe: 'AGC Interpane Ipasol grey/bright, Siebdruck, Rechtecke 8 × 30 mm', nameEn: 'AGC Interpane Ipasol grey/bright, screen print, rectangles 8 × 30 mm', anfluegeProzent: 16, position: 1, deckungsgradProzent: 11, arProzent: 8, pruefjahr: 2020 },
  { nr: '14S', test: 'spiegelung', nameDe: 'Vertikale Punktreihen 3 mm schwarz, Siebdruck (Isolierglas)', nameEn: 'Vertical rows of 3 mm black dots, screen print (IGU)', anfluegeProzent: 45, position: 2, deckungsgradProzent: 3.1, pruefjahr: 2021, hinweisDe: 'Laut WUA zu wenig Kontrast auf Position 2.', hinweisEn: 'Per WUA too little contrast on position 2.' },
  { nr: '15S', test: 'spiegelung', nameDe: 'Kolbe birdsticker Silhouetten, transparent, UV-reflektierend', nameEn: 'Kolbe birdsticker silhouettes, transparent, UV-reflective', anfluegeProzent: 47, position: 1, deckungsgradProzent: 21.7, arProzent: 8, pruefjahr: 2017 },
  { nr: '16S', test: 'spiegelung', nameDe: 'Punktraster Anthrazit 3/14, Klebefolie geplottet, Punkte 3 mm', nameEn: 'Anthracite dot grid 3/14, plotted film, 3 mm dots', anfluegeProzent: 48, position: 1, deckungsgradProzent: 3.6, arProzent: 8, pruefjahr: 2018, hinweisDe: 'Laut WUA zu wenig Kontrast.', hinweisEn: 'Per WUA too little contrast.' },
  // --- Lärmschutzwände und Glasbrüstungen (Durchsicht, ONR-Test) ---
  { nr: '1D', test: 'durchsicht', nameDe: 'ZooLex/Gasperlmair Astmuster, Folie RAL 6014, 25 % Transparenz', nameEn: 'ZooLex/Gasperlmair branch pattern, film RAL 6014, 25 % transparency', anfluegeProzent: 2, position: 1, deckungsgradProzent: 22.5, pruefjahr: 2020 },
  { nr: '2D', test: 'durchsicht', nameDe: 'Eckelt 4Bird V3066, vertikale Punktreihen schwarz-orange, DM 8 mm', nameEn: 'Eckelt 4Bird V3066, vertical dot rows black-orange, 8 mm', anfluegeProzent: 2, position: 1, deckungsgradProzent: 9, pruefjahr: 2010 },
  { nr: '3D', test: 'durchsicht', nameDe: 'Eckelt Litex 540, diagonaler schwarzer Punktraster, DM 7,5 mm', nameEn: 'Eckelt Litex 540, diagonal black dot grid, 7.5 mm', anfluegeProzent: 3, position: 1, deckungsgradProzent: 27, pruefjahr: 2010 },
  { nr: '4D', test: 'durchsicht', nameDe: 'Vertikale schwarze Streifen 5 mm, KA 95 mm (Druck auf Polycarbonat)', nameEn: 'Vertical black stripes 5 mm, 95 mm gap (print on polycarbonate)', anfluegeProzent: 3, position: 1, deckungsgradProzent: 5 },
  { nr: '5D', test: 'durchsicht', nameDe: 'Eckelt 4Bird V3067, vertikale Punktreihen schwarz, DM 8 mm', nameEn: 'Eckelt 4Bird V3067, vertical black dot rows, 8 mm', anfluegeProzent: 5, position: 1, deckungsgradProzent: 9, pruefjahr: 2010 },
  { nr: '6D', test: 'durchsicht', nameDe: 'Horizontale schwarze Streifen 3 mm, KA 47 mm (Druck auf Polycarbonat)', nameEn: 'Horizontal black stripes 3 mm, 47 mm gap (print on polycarbonate)', anfluegeProzent: 5, position: 1, deckungsgradProzent: 6 },
  { nr: '7D', test: 'durchsicht', nameDe: 'Vertikale orange Streifen 5 mm, KA 100 mm (Lackspray RAL 2009)', nameEn: 'Vertical orange stripes 5 mm, 100 mm gap (spray paint RAL 2009)', anfluegeProzent: 6, position: 1, deckungsgradProzent: 4.8 },
  { nr: '8D', test: 'durchsicht', nameDe: 'Glasdecor 25, Klebefolie ORACAL Etches Glass Cal 8510, Streifen 15–40 mm', nameEn: 'Glasdecor 25, ORACAL Etches Glass Cal 8510 film, stripes 15–40 mm', anfluegeProzent: 6, position: 1, deckungsgradProzent: 25 },
  { nr: '9D', test: 'durchsicht', nameDe: 'Saflex FlySafe 3D SEEN shiny 9/90, Aluminiumpunkte (VSG 44.2)', nameEn: 'Saflex FlySafe 3D SEEN shiny 9/90, aluminium dots (laminated 44.2)', anfluegeProzent: 6, position: 2, deckungsgradProzent: 0.8, pruefjahr: 2020 },
  { nr: '10D', test: 'durchsicht', nameDe: 'ABC Bird Tape doppelt, lichtdurchlässig, 20 mm Streifen', nameEn: 'ABC Bird Tape double, translucent, 20 mm stripes', anfluegeProzent: 10, position: 1, deckungsgradProzent: 22.8 },
  { nr: '11D', test: 'durchsicht', nameDe: 'Weißer Punktraster, Siebdruck, DM 18 mm, MPA 82 mm', nameEn: 'White dot grid, screen print, 18 mm, 82 mm pitch', anfluegeProzent: 15, position: 1, deckungsgradProzent: 3.8 },
  { nr: '12D', test: 'durchsicht', nameDe: 'Plexiglas Soundstop Smoky Brown, getöntes Acrylglas', nameEn: 'Plexiglas Soundstop Smoky Brown, tinted acrylic', anfluegeProzent: 35 },
  { nr: '13D', test: 'durchsicht', nameDe: 'Ornilux Mikado (Neutralux 1.1, Juni 2011), UV-Beschichtung laut Hersteller', nameEn: 'Ornilux Mikado (Neutralux 1.1, June 2011), UV coating per manufacturer', anfluegeProzent: 37 },
  { nr: '14D', test: 'durchsicht', nameDe: 'Birdpen, Filzstift-Substanz mit UV-Kontrast laut Hersteller', nameEn: 'Birdpen, marker substance with UV contrast per manufacturer', anfluegeProzent: 54, position: 1, deckungsgradProzent: 50 },
];

export type Befund =
  | 'nicht_getestet'
  | 'getestet'
  | 'geltungsbereich_ueberschritten'
  | 'ebene_abweichend';

export interface MarkierungsEingabe {
  test: Testart;
  /** Nummer eines WUA-Musters oder null, wenn das geplante Muster dort nicht vorkommt. */
  musterNr: string | null;
  /** Geplante Aufbringungsebene. */
  position?: 1 | 2;
  /** Außenreflexion der geplanten Scheibe in Prozent; null = unbekannt. */
  arProzent?: number | null;
}

export interface MarkierungsErgebnis {
  befund: Befund;
  muster: Muster | null;
  kategorie: Kategorie | null;
  hinweise: { de: string; en: string }[];
  quelle: string;
}

const STETS_HINWEIS = {
  de: 'Produktspezifische Prüfergebnisse der WUA, keine gesetzlich verbindliche Liste. Kleine Änderungen an Muster, Maßstab, Farbe oder Material können die Wirkung ändern.',
  en: 'Product-specific WUA test results, not a legally binding list. Small changes in pattern, scale, colour or material can change the effect.',
};

export function findeMuster(nr: string): Muster | undefined {
  return WUA_MUSTER.find((m) => m.nr === nr);
}

export function pruefeMarkierung(eingabe: MarkierungsEingabe): MarkierungsErgebnis {
  const hinweise: { de: string; en: string }[] = [STETS_HINWEIS];
  const muster = eingabe.musterNr ? findeMuster(eingabe.musterNr) ?? null : null;

  if (!muster) {
    return {
      befund: 'nicht_getestet',
      muster: null,
      kategorie: null,
      hinweise: [
        {
          de: 'Dieses Muster steht nicht in der WUA-Tabelle: nicht getestet, Wirkung unbekannt. Das ist kein Ausschluss — gleich wirksame Markierungen können zulässig sein, wenn ein Nachweis vorliegt.',
          en: 'This pattern is not in the WUA table: not tested, effect unknown. This is not an exclusion — equally effective markings may be acceptable if evidence exists.',
        },
        STETS_HINWEIS,
      ],
      quelle: WUA_QUELLE,
    };
  }

  let befund: Befund = 'getestet';

  if (muster.test !== eingabe.test) {
    hinweise.push({
      de: `Muster ${muster.nr} wurde im ${muster.test === 'spiegelung' ? 'Spiegelungstest (WIN)' : 'Durchsichttest (ONR)'} geprüft, nicht im gewählten Fall. Das Ergebnis lässt sich nicht übertragen.`,
      en: `Pattern ${muster.nr} was tested in the ${muster.test === 'spiegelung' ? 'reflection test (WIN)' : 'see-through test (ONR)'}, not in the chosen case. The result does not transfer.`,
    });
    befund = 'geltungsbereich_ueberschritten';
  }

  if (eingabe.position && muster.position && eingabe.position !== muster.position) {
    hinweise.push({
      de: `Geprüft auf Position ${muster.position}, geplant auf Position ${eingabe.position}. Siebdruck und Folien wirken bei Spiegelung nur auf der Anflugseite (Position 1).`,
      en: `Tested on position ${muster.position}, planned on position ${eingabe.position}. Screen print and films only work against reflections on the approach side (position 1).`,
    });
    if (befund === 'getestet') befund = 'ebene_abweichend';
  }

  if (muster.test === 'spiegelung' && muster.arProzent !== undefined) {
    if (eingabe.arProzent === null || eingabe.arProzent === undefined) {
      hinweise.push({
        de: `Außenreflexion der geplanten Scheibe unbekannt. Das Ergebnis gilt nur bis AR ${muster.arProzent} %. Kein Wert geraten.`,
        en: `External reflectance of the planned pane unknown. The result holds only up to AR ${muster.arProzent} %. No value guessed.`,
      });
      if (befund === 'getestet') befund = 'geltungsbereich_ueberschritten';
    } else if (eingabe.arProzent > muster.arProzent) {
      hinweise.push({
        de: `Geplante Außenreflexion ${eingabe.arProzent} % liegt über dem geprüften Wert ${muster.arProzent} %. Das Ergebnis gilt dafür nicht; Hinweis: dasselbe Saflex-Raster liegt bei 19 % AR schon bei 10 % Anflügen (8S statt 9 %).`,
        en: `Planned external reflectance ${eingabe.arProzent} % exceeds the tested ${muster.arProzent} %. The result does not apply; note: the same Saflex grid reaches 10 % strikes at 19 % AR (8S instead of 9 %).`,
      });
      befund = 'geltungsbereich_ueberschritten';
    }
  }

  return {
    befund,
    muster,
    kategorie: kategorieFuerAnfluege(muster.anfluegeProzent),
    hinweise,
    quelle: WUA_QUELLE,
  };
}

/**
 * Bewertungsschema Vogelschlag an Glas — LAG VSW Beschluss 21/01, aktualisiert 2023.
 *
 * Quelle: Länderarbeitsgemeinschaft der Vogelschutzwarten, "Vermeidung von
 * Vogelverlusten an Glasscheiben — Bewertung des Vogelschlagrisikos an Glas",
 * Stand 13.11.2023 (ersetzt Beschluss 19/01). Erarbeitet im Auftrag der LANA,
 * von dieser den Bundesländern zur Anwendung empfohlen. Tab. 3 und Tab. 4.
 *
 * Diese Datei bildet das Schema ab. Sie legt es nicht aus und ergänzt es nicht.
 * Die deutschen Wortlaute stammen aus dem Beschluss; die englischen sind
 * Übersetzungen und haben keinen amtlichen Charakter.
 *
 * Die Python-Fassung unter 04-werkzeug/glasanflug-ampel/ ist dieselbe Logik
 * mit denselben Testfällen.
 */

export const SCHEMA_QUELLE = 'LAG VSW Beschluss 21/01, aktualisiert 2023';
export const SCHEMA_STAND = '2023-11-13';

export type KriteriumId = 'glasanteil' | 'fassadengestaltung' | 'umgebung' | 'gehoelzabstand';
export type Punktwert = 1 | 2 | 3 | 4;
export type Risikostufe = 'gering' | 'mittel' | 'hoch';

/** Woher ein Eingabewert stammt. "unbestimmt" heißt: nicht geraten. */
export type Herkunft = 'eingabe' | 'bild' | 'geodaten' | 'unbestimmt';

export const HERKUNFT_LABEL: Record<Herkunft, { de: string; en: string }> = {
  eingabe: { de: 'Eingabe', en: 'entered' },
  bild: { de: 'aus dem Bild', en: 'from image' },
  geodaten: { de: 'aus Geodaten', en: 'from geodata' },
  unbestimmt: { de: 'unbestimmt', en: 'undetermined' },
};

export interface Stufe {
  punkte: Punktwert;
  de: string;
  en: string;
  /** Vorrangregel aus Tab. 3, die die Punktsumme überstimmt. */
  regel?: 'immer_hoch' | 'immer_gering';
}

export interface Kriterium {
  id: KriteriumId;
  nameDe: string;
  nameEn: string;
  /** Wie dieser Wert in der Dose-Idee geschätzt werden soll. */
  quelleDe: string;
  quelleEn: string;
  stufen: Stufe[];
}

export const KRITERIEN: Kriterium[] = [
  {
    id: 'glasanteil',
    nameDe: 'Anteil der frei sichtbaren Glasfläche ohne Markierung',
    nameEn: 'Share of freely visible unmarked glass',
    quelleDe: 'aus dem Fassadenfoto schätzbar (Fenster-Wand-Verhältnis)',
    quelleEn: 'estimable from the façade photo (window-to-wall ratio)',
    stufen: [
      { punkte: 1, de: '< 25 % — oder Scheibenbreite bis 50 cm', en: '< 25 % — or pane width up to 50 cm' },
      { punkte: 2, de: '25–50 %', en: '25–50 %' },
      { punkte: 3, de: '51–75 %', en: '51–75 %' },
      {
        punkte: 4,
        de: '> 75 %, auch freistehende Glaswände, transparente Durchsichten oder Reflexionsgrad sehr hoch (> 30 %, Spiegeleffekt)',
        en: '> 75 %, also free-standing glass walls, transparent see-throughs, or very high reflectance (> 30 %, mirror effect)',
        regel: 'immer_hoch',
      },
    ],
  },
  {
    id: 'fassadengestaltung',
    nameDe: 'Fassadengestaltung',
    nameEn: 'Façade design',
    quelleDe: 'aus dem Bild: Größe zusammenhängender Scheiben, Fassadentyp',
    quelleEn: 'from the image: size of contiguous panes, façade type',
    stufen: [
      {
        punkte: 1,
        de: 'Lochfassade mit Fensteröffnungen bis 1,5 m² — oder Bandfassade mit Fensterhöhe unter 1 m — oder Glas mit hoch wirksamer Markierung, Strukturglas, Drahtglas, mattiertes Glas',
        en: 'Punched façade with openings up to 1.5 m² — or ribbon façade with window height below 1 m — or glass with highly effective marking, structured, wired or frosted glass',
        regel: 'immer_gering',
      },
      {
        punkte: 2,
        de: 'Lochfassade mit Fensteröffnungen von 1,5–3 m² — oder Bandfassade mit Fensterhöhe von mindestens 1–1,5 m',
        en: 'Punched façade with openings of 1.5–3 m² — or ribbon façade with window height of 1–1.5 m',
      },
      {
        punkte: 3,
        de: 'Fassadenabschnitt mit zusammenhängenden Glasflächen > 3–6 m² (ggf. einschließlich Unterteilungen)',
        en: 'Façade section with contiguous glass areas > 3–6 m² (including subdivisions)',
      },
      {
        punkte: 4,
        de: 'Fassadenabschnitt mit zusammenhängenden Glasflächen > 6 m² (ggf. einschließlich Unterteilungen)',
        en: 'Façade section with contiguous glass areas > 6 m² (including subdivisions)',
      },
    ],
  },
  {
    id: 'umgebung',
    nameDe: 'Umgebung',
    nameEn: 'Surroundings',
    quelleDe: 'aus Geodaten: Landnutzung, Versiegelungsgrad',
    quelleEn: 'from geodata: land use, sealed-surface share',
    stufen: [
      {
        punkte: 1,
        de: 'innerhalb dichter Bebauung (Innenstadt, Industriegebiet); typischerweise zu > 75 % versiegelt',
        en: 'within dense development (city centre, industrial estate); typically > 75 % sealed',
      },
      {
        punkte: 2,
        de: 'durchgrünter Siedlungsbereich; typischerweise zu 51–75 % versiegelt',
        en: 'green residential area; typically 51–75 % sealed',
      },
      {
        punkte: 3,
        de: 'am Ortsrand oder im Außenbereich in Grünanlagennähe; typischerweise zu 25–50 % versiegelt',
        en: 'at the edge of town or in open country near green space; typically 25–50 % sealed',
      },
      {
        punkte: 4,
        de: 'weniger als 50 m entfernt von naturnahen Flächen (Wald, Park, Gewässer, Feuchtgebiet, Naturschutzgebiet); typischerweise zu < 25 % versiegelt',
        en: 'less than 50 m from near-natural areas (forest, park, water, wetland, reserve); typically < 25 % sealed',
      },
    ],
  },
  {
    id: 'gehoelzabstand',
    nameDe: 'Abstand unmarkierter Glasscheiben zu Gehölzen',
    nameEn: 'Distance from unmarked glass to woody vegetation',
    quelleDe: 'aus Geodaten: Baumkataster, OSM-Grünflächen',
    quelleEn: 'from geodata: tree cadastre, OSM green space',
    stufen: [
      { punkte: 1, de: '> 50 m entfernt', en: '> 50 m away' },
      { punkte: 2, de: '31–50 m', en: '31–50 m' },
      { punkte: 3, de: '15–30 m', en: '15–30 m' },
      { punkte: 4, de: '< 15 m', en: '< 15 m' },
    ],
  },
];

export interface RisikostufenEintrag {
  stufe: Risikostufe;
  min: number;
  max: number;
  bewertungDe: string;
  bewertungEn: string;
  handlungsbedarfDe: string;
  handlungsbedarfEn: string;
}

export const RISIKOSTUFEN: RisikostufenEintrag[] = [
  {
    stufe: 'gering',
    min: 4,
    max: 6,
    bewertungDe: 'Gering — kein erhöhtes Risiko zu erwarten. Im Regelfall werden artenschutzrechtliche Konflikte vermieden.',
    bewertungEn: 'Low — no elevated risk expected. As a rule, conflicts with species protection law are avoided.',
    handlungsbedarfDe: 'Im Regelfall kein Handlungsbedarf.',
    handlungsbedarfEn: 'As a rule, no action required.',
  },
  {
    stufe: 'mittel',
    min: 7,
    max: 10,
    bewertungDe: 'Mittel — einige Eigenschaften bewirken im Einzelfall ein erhöhtes Risiko. Die Verwirklichung artenschutzrechtlicher Konflikte kann nicht ausgeschlossen werden.',
    bewertungEn: 'Medium — some properties cause elevated risk in individual cases. Conflicts with species protection law cannot be ruled out.',
    handlungsbedarfDe: 'Das ggf. vorhandene Konfliktpotenzial ist im Sinne vorsorglichen Handelns zu minimieren. Die Erforderlichkeit von Vermeidungsmaßnahmen ist im Einzelfall zu entscheiden; hierfür sind Fachleute zu Rate zu ziehen.',
    handlungsbedarfEn: 'Any conflict potential should be minimised as a precaution. Whether mitigation is required is decided case by case; experts should be consulted.',
  },
  {
    stufe: 'hoch',
    min: 11,
    max: 16,
    bewertungDe: 'Hoch — erhöhtes Risiko im Regelfall zu erwarten. Es ist davon auszugehen, dass artenschutzrechtliche Konflikte auftreten.',
    bewertungEn: 'High — elevated risk expected as a rule. Conflicts with species protection law are to be assumed.',
    handlungsbedarfDe: 'Es sind Vermeidungsmaßnahmen zu ergreifen.',
    handlungsbedarfEn: 'Mitigation measures must be taken.',
  },
];

/**
 * Schwellenwerte nach Kap. 3.1.2 — nur für Bestandsbauten MIT Monitoring,
 * nicht als Prognose und nicht als Ersatz für das Punkteschema.
 */
export const SCHWELLENWERTE = {
  bezug: 'je 100 m Fassaden- oder Außenwandlänge und Jahr',
  normal: 2,
  signifikantErhoehtAb: 5,
};

/** Die durchgerechneten Beispiele aus dem Anhang des Beschlusses. */
export interface AnhangBeispiel {
  ortDe: string;
  ortEn: string;
  werte: Record<KriteriumId, Punktwert>;
  anmerkungDe?: string;
  anmerkungEn?: string;
}

export const ANHANG_BEISPIELE: AnhangBeispiel[] = [
  {
    ortDe: 'Augsburg, innerstädtische Wohnbebauung',
    ortEn: 'Augsburg, inner-city housing',
    werte: { glasanteil: 2, fassadengestaltung: 1, umgebung: 1, gehoelzabstand: 1 },
    anmerkungDe: 'Summe 5 — und die Lochfassade bis 1,5 m² setzt ohnehin „gering".',
    anmerkungEn: 'Sum 5 — and the punched façade up to 1.5 m² sets "low" regardless.',
  },
  {
    ortDe: 'Augsburg, Verwaltungsgebäude',
    ortEn: 'Augsburg, administrative building',
    werte: { glasanteil: 2, fassadengestaltung: 2, umgebung: 3, gehoelzabstand: 1 },
    anmerkungDe: 'Summe 8. Vogelschlag nachgewiesen, Ausmaß aber vermutlich unter dem Schwellenwert.',
    anmerkungEn: 'Sum 8. Collisions documented, but probably below the threshold.',
  },
  {
    ortDe: 'Augsburg, Gewerbebetrieb',
    ortEn: 'Augsburg, commercial building',
    werte: { glasanteil: 2, fassadengestaltung: 4, umgebung: 4, gehoelzabstand: 3 },
    anmerkungDe: 'Summe 13, Vogelschlag nachgewiesen.',
    anmerkungEn: 'Sum 13, collisions documented.',
  },
  {
    ortDe: 'Potsdam, Kindertagesstätte',
    ortEn: 'Potsdam, day-care centre',
    werte: { glasanteil: 3, fassadengestaltung: 4, umgebung: 3, gehoelzabstand: 3 },
  },
  {
    ortDe: 'Berlin, Bürogebäude mit transparenter Durchsicht',
    ortEn: 'Berlin, office building with see-through',
    werte: { glasanteil: 4, fassadengestaltung: 4, umgebung: 2, gehoelzabstand: 3 },
    anmerkungDe: 'Auch eine getrennte Bewertung des transparenten Teils und der restlichen Fassade kommt jeweils auf „hoch".',
    anmerkungEn: 'Assessing the transparent part and the rest of the façade separately also yields "high" for each.',
  },
  {
    ortDe: 'Berlin, Spiegelfassade ohne Vegetation im Spiegelbild',
    ortEn: 'Berlin, mirrored façade with no vegetation reflected',
    werte: { glasanteil: 3, fassadengestaltung: 4, umgebung: 1, gehoelzabstand: 1 },
    anmerkungDe: 'Summe 9. Trotz der spiegelnden Flächen keine hohe Stufe — es spiegelt sich keinerlei Vegetation (Fußnote 2).',
    anmerkungEn: 'Sum 9. Despite the mirrored surfaces, not a high class — no vegetation is reflected (footnote 2).',
  },
  {
    ortDe: 'Garmisch-Partenkirchen, Staatliche Vogelschutzwarte',
    ortEn: 'Garmisch-Partenkirchen, state bird conservation station',
    werte: { glasanteil: 1, fassadengestaltung: 1, umgebung: 4, gehoelzabstand: 3 },
    anmerkungDe: 'Punktsumme läge im mittleren Bereich; die Vorrangregel Lochfassade setzt die Gesamtbewertung auf „gering". Wiederholter Vogelschlag an einzelnen Scheiben ist trotzdem nachgewiesen — hier ist eine Markierung sinnvoll.',
    anmerkungEn: 'The point sum would be medium; the punched-façade rule sets the overall rating to "low". Repeated collisions at individual panes are nevertheless documented — marking is advisable here.',
  },
];

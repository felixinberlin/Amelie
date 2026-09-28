/**
 * Vernichtungs-Offenlegungsregister — Prüfer für Offenlegungen nach Art. 24 ESPR
 * (Destruction Disclosure Register — checker for Art. 24 ESPR disclosures)
 *
 * Reiner, deterministischer TypeScript-Kern: kein DOM, kein Netzwerk, kein Modell.
 *
 * SCHEMA-STAND: VORLÄUFIG. Der Normtext der DVO (EU) 2026/2 (Art. 2/3, Anhang I),
 * der Delegierten VO (EU) 2026/296 und von ESPR Art. 24 Abs. 1 wurde NICHT gelesen
 * (Seitenabruf gesperrt). Jedes Feld unten ist eine Annahme aus Sekundärquellen
 * (Kanzlei- und Anbieterschnipsel) und in `ANNAHMEN` einzeln benannt. Es gibt
 * bewusst keine Feldnummern aus Anhang I — die sind unbekannt.
 *
 * Harte Invarianten (Safety Case):
 *  1. Das Register kennt genau zwei Status: `gefunden` und
 *     `keine Offenlegung gefunden`. Letzterer trägt immer Stand (Datum) und
 *     Suchweg. Es gibt keinen Status „erfüllt", „ok" oder „grün" und keinen
 *     Vorwurf („Verstoß", „säumig", „violation").
 *  2. Jeder Befund ist eine Frage mit Regel-ID und Klartext (De/En). Der Prüfer
 *     urteilt nicht über Unternehmen, er stellt Rückfragen an die Übertragung.
 *  3. Kein Ergebnis enthält ein Gesamturteil. Null Befunde heißt nur: keine der
 *     sechs Regeln hat eine Frage ausgelöst.
 *  4. Ungültige Eingaben (fehlende Quelle, leerer Suchweg, negativer Anteil,
 *     unbekannter Behandlungsweg, Widerspruch gefunden/nicht gefunden) werfen
 *     einen Fehler — nichts wird still ignoriert.
 *  5. `unbekannt` ist ein gleichberechtigter Feldwert (Freitext-Offenlegungen):
 *     Regeln, die das Feld brauchen, schweigen, und das Feld wird gelistet.
 *
 * Lizenz: CC0 1.0 Public Domain.
 */

// ---------------------------------------------------------------------------
// Schema-Stand und Annahmen
// ---------------------------------------------------------------------------

/** Stand des Anhang-I-Schemas. Fällt erst, wenn Feld für Feld gegen den Normtext geprüft ist. */
export type SchemaStatus = 'vorläufig' | `gegen Normtext geprüft am ${string}`;

/** Aktueller Stand: vorläufig, weil der Normtext nicht gelesen wurde. */
export const SCHEMA_STATUS: SchemaStatus = 'vorläufig';

/** Eine benannte Annahme über ein Feld, mit Herkunft. */
export interface Annahme {
  feld: string;
  annahmeDe: string;
  annahmeEn: string;
  herkunft: string;
}

/**
 * Alle Feldannahmen des vorläufigen Schemas. Wortgleich (feld) mit
 * `x-annahmen` in `07-demos/vernichtungs-offenlegungsregister/anhang1-schema.json`.
 */
export const ANNAHMEN: readonly Annahme[] = [
  {
    feld: 'stueck',
    annahmeDe: 'Menge je Warengruppe in Stück.',
    annahmeEn: 'Quantity per product group in units.',
    herkunft: 'Kanzlei-Schnipsel (Cooley 07.05.2026, Freshfields) zu ESPR Art. 24 Abs. 1 lit. a; Normtext nicht gelesen',
  },
  {
    feld: 'gewichtKg',
    annahmeDe: 'Gewicht je Warengruppe in Kilogramm.',
    annahmeEn: 'Weight per product group in kilograms.',
    herkunft: 'Kanzlei- und Anbieterschnipsel zu DVO (EU) 2026/2 Anhang I; Normtext nicht gelesen',
  },
  {
    feld: 'gruende',
    annahmeDe: 'Gründe als Codes aus der Ausnahmeliste (ESPR Art. 25 Abs. 5, präzisiert durch Delegierte VO (EU) 2026/296).',
    annahmeEn: 'Reasons as codes from the derogation list (ESPR Art. 25(5), specified by Delegated Reg. (EU) 2026/296).',
    herkunft: 'Kanzleischnipsel (Linklaters, Cattwyk); Liste unten sinngemäß, nicht wortgleich; Normtext nicht gelesen',
  },
  {
    feld: 'behandlungswege',
    annahmeDe: 'Anteile je Behandlungsweg entlang der Abfallhierarchie in Prozent.',
    annahmeEn: 'Shares per treatment route along the waste hierarchy in percent.',
    herkunft: 'Schnipsel zu ESPR Art. 24 Abs. 1 lit. c; Prozentform ist eine Annahme',
  },
  {
    feld: 'cnCode',
    annahmeDe: 'Warengruppe als achtstelliger Code der Kombinierten Nomenklatur (KN/CN).',
    annahmeEn: 'Product group as an eight-digit Combined Nomenclature (CN) code.',
    herkunft: 'Anbieterschnipsel (Generation Impact) zu Anhang I; Normtext nicht gelesen',
  },
  {
    feld: 'geschaetzt',
    annahmeDe: 'Kennzeichnung, ob Mengen gemessen oder geschätzt sind.',
    annahmeEn: 'Flag whether quantities are measured or estimated.',
    herkunft: 'Kanzleischnipsel zu DVO (EU) 2026/2; Normtext nicht gelesen',
  },
] as const;

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

/** Der Wert eines Feldes, das die Quelle nicht hergibt. */
export type Unbekannt = 'unbekannt';

/**
 * Behandlungswege entlang der Abfallhierarchie (Annahme). `sonstige-verwertung`
 * umfasst u. a. energetische Verwertung.
 */
export type Behandlungsweg =
  | 'vorbereitung-wiederverwendung'
  | 'wiederaufbereitung'
  | 'recycling'
  | 'sonstige-verwertung'
  | 'beseitigung';

export const BEHANDLUNGSWEGE: readonly Behandlungsweg[] = [
  'vorbereitung-wiederverwendung',
  'wiederaufbereitung',
  'recycling',
  'sonstige-verwertung',
  'beseitigung',
] as const;

/**
 * Vorläufige Ausnahmeliste (sinngemäß nach Sekundärquellen zu ESPR Art. 25 Abs. 5 /
 * Delegierte VO (EU) 2026/296). Codes sind Amélie-intern, keine Normbezeichner.
 */
export const AUSNAHME_GRUENDE: readonly string[] = [
  'gesundheit-hygiene-sicherheit',
  'schaden-nicht-reparierbar',
  'ungeeignet-fuer-zweck',
  'spende-abgelehnt',
  'ungeeignet-fuer-wiederverwendung',
  'geistiges-eigentum',
  'geringste-umweltwirkung',
] as const;

/** Anteil eines Behandlungswegs in Prozent. */
export interface WegAnteil {
  weg: Behandlungsweg;
  anteilProzent: number;
}

/** Eine Zeile (Warengruppe) einer Offenlegung. */
export interface Position {
  id: string;
  warengruppe: string;
  cnCode?: string | Unbekannt;
  stueck: number | Unbekannt;
  gewichtKg: number | Unbekannt;
  /** Fehlt das Feld, fragt Regel V5 nach. */
  geschaetzt?: boolean;
  gruende: string[] | Unbekannt;
  behandlungswege: WegAnteil[] | Unbekannt;
}

/** Herkunft einer Offenlegung. */
export interface Quelle {
  url: string;
  /** ISO-Datum JJJJ-MM-TT */
  abgerufenAm: string;
  archivSnapshot?: string;
}

/** Eine übertragene Offenlegung eines Unternehmens für ein Geschäftsjahr. */
export interface Offenlegung {
  unternehmen: string;
  geschaeftsjahr: number;
  /** true für konstruierte Testdaten, die keine echte Offenlegung abbilden */
  synthetisch?: boolean;
  format: 'tabelle' | 'freitext';
  quelle: Quelle;
  positionen: Position[];
  freitext?: string;
}

/** Nachweis einer erfolglosen Suche: Stand und Suchweg sind Pflicht. */
export interface Suchnachweis {
  unternehmen: string;
  geschaeftsjahr: number;
  synthetisch?: boolean;
  /** ISO-Datum der Suche */
  stand: string;
  suchweg: { orte: string[]; suchbegriffe: string[] };
}

/** Die sechs deterministischen Regeln. */
export type RegelId =
  | 'V0-FREITEXT'
  | 'V1-PROZENTSUMME'
  | 'V2-GRUND'
  | 'V3-CN-CODE'
  | 'V4-STUECK-GEWICHT'
  | 'V5-SCHAETZUNG';

/** Ein Befund ist immer eine Frage an die Übertragung, nie ein Urteil. */
export interface Befund {
  regel: RegelId;
  art: 'frage';
  position: string | null;
  frageDe: string;
  frageEn: string;
}

/** Ergebnis von `pruefeOffenlegung`. Enthält bewusst kein Gesamturteil. */
export interface PruefErgebnis {
  unternehmen: string;
  geschaeftsjahr: number;
  schemaStatus: SchemaStatus;
  befunde: Befund[];
  /** Felder mit Wert `unbekannt` oder ohne Angabe, als `<position>.<feld>` */
  felderUnbekannt: string[];
}

/** Die einzigen zwei Registerstatus. */
export type RegisterStatus = 'gefunden' | 'keine Offenlegung gefunden';
export const REGISTER_STATUS: readonly RegisterStatus[] = ['gefunden', 'keine Offenlegung gefunden'] as const;

/** Eine Zeile des Registers (Unternehmen × Geschäftsjahr). */
export interface RegisterZeile {
  unternehmen: string;
  geschaeftsjahr: number;
  status: RegisterStatus;
  /** Klartext; bei fehlender Offenlegung mit Stand und Suchweg */
  statusText: string;
  stand: string;
  suchweg: string | null;
  quelleUrl: string | null;
  abgerufenAm: string | null;
  archivSnapshot: string | null;
  anzahlFragen: number | null;
  schemaStatus: SchemaStatus;
  synthetisch: boolean;
}

// ---------------------------------------------------------------------------
// Konstanten und Hilfen
// ---------------------------------------------------------------------------

/** Rundungstoleranz für die Prozentsumme, in Prozentpunkten (Annahme). */
export const PROZENT_TOLERANZ = 0.5;

/**
 * Grobe Spannen kg je Stück nach KN-Kapitel (Heuristik, keine Norm). Sie sollen
 * nur Übertragungsfehler (Tonnen statt kg, Stück vertauscht) sichtbar machen.
 */
export const GEWICHT_JE_STUECK: Readonly<Record<string, readonly [number, number]>> = {
  '42': [0.02, 10], // Lederwaren, Taschen
  '61': [0.01, 5], // Bekleidung, gewirkt
  '62': [0.01, 5], // Bekleidung, nicht gewirkt
  '64': [0.05, 5], // Schuhe
  standard: [0.001, 1000],
};

/** Wörter, die keine Ausgabe dieses Kerns je enthalten darf. */
export const VERBOTENE_WOERTER: readonly RegExp[] = [
  /verstoß/i,
  /verstoss/i,
  /säumig/i,
  /saeumig/i,
  /violation/i,
  /non-?complian/i,
];

/**
 * Wirft, wenn ein Text ein Vorwurfswort enthält. Wird auf jede erzeugte
 * Ausgabe angewendet, damit die neutrale Sprache nicht nur Konvention ist.
 */
export function assertNeutraleSprache(text: string): string {
  for (const muster of VERBOTENE_WOERTER) {
    if (muster.test(text)) throw new Error(`Unzulässiges Vorwurfswort in Ausgabe: ${muster.source}`);
  }
  return text;
}

/** true, wenn der Text kein Vorwurfswort enthält. */
export function istNeutral(text: string): boolean {
  return !VERBOTENE_WOERTER.some((m) => m.test(text));
}

const ISO_DATUM = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function pruefeDatum(wert: unknown, feld: string): string {
  if (typeof wert !== 'string' || !ISO_DATUM.test(wert) || Number.isNaN(Date.parse(wert))) {
    throw new Error(`${feld}: kein gültiges ISO-Datum (JJJJ-MM-TT): ${String(wert)}`);
  }
  return wert;
}

function pruefeKopf(unternehmen: unknown, gj: unknown): void {
  if (typeof unternehmen !== 'string' || unternehmen.trim() === '') throw new Error('Unternehmen fehlt');
  if (typeof gj !== 'number' || !Number.isInteger(gj)) throw new Error(`Geschäftsjahr ungültig: ${String(gj)}`);
}

const fmt = (n: number): string => String(Math.round(n * 100) / 100);

function befund(regel: RegelId, position: string | null, frageDe: string, frageEn: string): Befund {
  if (!frageDe.trim().endsWith('?') || !frageEn.trim().endsWith('?')) {
    throw new Error(`Befund ${regel} ist nicht als Frage formuliert`);
  }
  assertNeutraleSprache(frageDe);
  assertNeutraleSprache(frageEn);
  return { regel, art: 'frage', position, frageDe, frageEn };
}

/**
 * Formale Prüfung eines KN-Codes. Gültig: genau acht Ziffern (Leerzeichen und
 * Punkte werden ignoriert), Kapitel 01–97 ohne das unbelegte Kapitel 77.
 * Liefert `null` bei gültigem Code, sonst den Grund.
 */
export function cnCodeProblem(code: string): 'format' | 'kapitel' | 'nur-hs-ebene' | null {
  const ziffern = code.replace(/[\s.]/g, '');
  if (!/^\d+$/.test(ziffern)) return 'format';
  if (ziffern.length === 4 || ziffern.length === 6) return 'nur-hs-ebene';
  if (ziffern.length !== 8) return 'format';
  const kapitel = Number(ziffern.slice(0, 2));
  if (kapitel < 1 || kapitel > 97 || kapitel === 77) return 'kapitel';
  return null;
}

// ---------------------------------------------------------------------------
// Prüfer
// ---------------------------------------------------------------------------

/**
 * Prüft eine übertragene Offenlegung deterministisch gegen das vorläufige
 * Anhang-I-Schema. Ohne Netz, ohne Modell. Jeder Befund ist eine Frage.
 *
 * Regeln: V0 Freitext ohne Tabelle · V1 Prozentsumme der Behandlungswege ≠ 100 ·
 * V2 Grund außerhalb der vorläufigen Ausnahmeliste · V3 KN-Code formal ·
 * V4 Stück und Gewicht passen nicht zueinander · V5 Schätzkennzeichnung fehlt.
 *
 * @throws bei ungültiger Eingabe (siehe Invariante 4)
 */
export function pruefeOffenlegung(o: Offenlegung): PruefErgebnis {
  pruefeKopf(o?.unternehmen, o?.geschaeftsjahr);
  if (!o.quelle || typeof o.quelle.url !== 'string' || !/^https?:\/\//.test(o.quelle.url)) {
    throw new Error(`${o.unternehmen} ${o.geschaeftsjahr}: Quell-URL fehlt oder ist ungültig`);
  }
  pruefeDatum(o.quelle.abgerufenAm, 'quelle.abgerufenAm');
  if (o.format !== 'tabelle' && o.format !== 'freitext') throw new Error(`Unbekanntes Format: ${String(o.format)}`);
  if (!Array.isArray(o.positionen)) throw new Error('positionen muss ein Array sein');
  if (o.format === 'tabelle' && o.positionen.length === 0) {
    throw new Error('Format „tabelle" ohne Positionen — als „freitext" übertragen oder Positionen ergänzen');
  }

  const befunde: Befund[] = [];
  const felderUnbekannt: string[] = [];

  if (o.format === 'freitext') {
    befunde.push(
      befund(
        'V0-FREITEXT',
        null,
        'Die Offenlegung liegt nur als Fließtext vor. Lassen sich Stückzahl, Gewicht, Gründe und Behandlungswege daraus von Hand übertragen?',
        'The disclosure is prose only. Can units, weight, reasons and treatment routes be transcribed from it by hand?'
      )
    );
    if (o.positionen.length === 0) {
      felderUnbekannt.push('*.stueck', '*.gewichtKg', '*.gruende', '*.behandlungswege', '*.cnCode', '*.geschaetzt');
    }
  }

  const ids = new Set<string>();
  for (const p of o.positionen) {
    if (typeof p.id !== 'string' || p.id === '') throw new Error('Position ohne id');
    if (ids.has(p.id)) throw new Error(`Doppelte Positions-ID: ${p.id}`);
    ids.add(p.id);
    pruefePosition(p, befunde, felderUnbekannt);
  }

  return {
    unternehmen: o.unternehmen,
    geschaeftsjahr: o.geschaeftsjahr,
    schemaStatus: SCHEMA_STATUS,
    befunde,
    felderUnbekannt,
  };
}

function pruefeZahl(wert: number | Unbekannt, feld: string): number | null {
  if (wert === 'unbekannt') return null;
  if (typeof wert !== 'number' || !Number.isFinite(wert) || wert < 0) {
    throw new Error(`${feld}: ungültige Zahl ${String(wert)}`);
  }
  return wert;
}

function pruefePosition(p: Position, befunde: Befund[], unbekannt: string[]): void {
  const stueck = pruefeZahl(p.stueck, `${p.id}.stueck`);
  const kg = pruefeZahl(p.gewichtKg, `${p.id}.gewichtKg`);
  if (stueck === null) unbekannt.push(`${p.id}.stueck`);
  if (kg === null) unbekannt.push(`${p.id}.gewichtKg`);

  // V1 — Prozentsumme der Behandlungswege
  if (p.behandlungswege === 'unbekannt') {
    unbekannt.push(`${p.id}.behandlungswege`);
  } else {
    if (!Array.isArray(p.behandlungswege)) throw new Error(`${p.id}.behandlungswege: Array oder „unbekannt" erwartet`);
    let summe = 0;
    for (const w of p.behandlungswege) {
      if (!BEHANDLUNGSWEGE.includes(w.weg)) throw new Error(`${p.id}: unbekannter Behandlungsweg „${String(w.weg)}"`);
      if (typeof w.anteilProzent !== 'number' || !(w.anteilProzent >= 0 && w.anteilProzent <= 100)) {
        throw new Error(`${p.id}: Anteil für ${w.weg} außerhalb 0–100: ${String(w.anteilProzent)}`);
      }
      summe += w.anteilProzent;
    }
    if (p.behandlungswege.length === 0 || Math.abs(summe - 100) > PROZENT_TOLERANZ) {
      const s = fmt(summe);
      befunde.push(
        befund(
          'V1-PROZENTSUMME',
          p.id,
          summe < 100
            ? `Die Anteile der Behandlungswege summieren sich auf ${s} %. Fehlt ein Behandlungsweg?`
            : `Die Anteile der Behandlungswege summieren sich auf ${s} %. Ist ein Weg doppelt gezählt?`,
          summe < 100
            ? `The treatment-route shares add up to ${s} %. Is a treatment route missing from the transcription?`
            : `The treatment-route shares add up to ${s} %. Is a route counted twice?`
        )
      );
    }
  }

  // V2 — Grund aus der Ausnahmeliste
  if (p.gruende === 'unbekannt') {
    unbekannt.push(`${p.id}.gruende`);
  } else {
    if (!Array.isArray(p.gruende)) throw new Error(`${p.id}.gruende: Array oder „unbekannt" erwartet`);
    if (p.gruende.length === 0) {
      befunde.push(
        befund(
          'V2-GRUND',
          p.id,
          'Zu dieser Warengruppe ist kein Grund übertragen. Nennt die Offenlegung einen?',
          'No reason is transcribed for this product group. Does the disclosure state one?'
        )
      );
    }
    p.gruende.forEach((g, i) => {
      if (typeof g !== 'string') throw new Error(`${p.id}.gruende[${i}]: Zeichenkette erwartet`);
      if (!AUSNAHME_GRUENDE.includes(g)) {
        // Übertragener Freitext wird nur zitiert, wenn er selbst neutral ist;
        // sonst verweist die Frage auf die Nummer des Grundes.
        const zitatDe = istNeutral(g) ? `„${g}"` : `Nr. ${i + 1}`;
        const zitatEn = istNeutral(g) ? `"${g}"` : `no. ${i + 1}`;
        befunde.push(
          befund(
            'V2-GRUND',
            p.id,
            `Der Grund ${zitatDe} steht nicht auf der vorläufigen Ausnahmeliste. Entspricht er einer Ausnahme nach Art. 25 Abs. 5 ESPR, oder ist es ein freier Grund?`,
            `The reason ${zitatEn} is not on the provisional derogation list. Does it match a derogation under Art. 25(5) ESPR, or is it a free-text reason?`
          )
        );
      }
    });
  }

  // V3 — KN-Code formal
  const cnKapitel = pruefeCn(p, befunde, unbekannt);

  // V4 — Stück und Gewicht zueinander
  if (stueck !== null && kg !== null) {
    if ((stueck === 0) !== (kg === 0)) {
      befunde.push(
        befund(
          'V4-STUECK-GEWICHT',
          p.id,
          `Stückzahl ${fmt(stueck)} und Gewicht ${fmt(kg)} kg passen nicht zusammen, weil eine der beiden Angaben null ist. Ist eine Zahl verrutscht?`,
          `Units ${fmt(stueck)} and weight ${fmt(kg)} kg do not fit together because one of them is zero. Has a figure slipped?`
        )
      );
    } else if (stueck > 0) {
      const [min, max] = GEWICHT_JE_STUECK[cnKapitel ?? 'standard'] ?? GEWICHT_JE_STUECK.standard;
      const jeStueck = kg / stueck;
      if (jeStueck < min || jeStueck > max) {
        const js = jeStueck < 0.01 ? jeStueck.toExponential(2) : fmt(jeStueck);
        befunde.push(
          befund(
            'V4-STUECK-GEWICHT',
            p.id,
            `Das ergibt ${js} kg je Stück, außerhalb der groben Spanne ${min}–${max} kg. Sind Einheiten vertauscht (t statt kg, Kartons statt Stück)?`,
            `That gives ${js} kg per unit, outside the rough range ${min}–${max} kg. Are units mixed up (t instead of kg, cartons instead of units)?`
          )
        );
      }
    }
  }

  // V5 — Schätzkennzeichnung
  if ((stueck !== null || kg !== null) && typeof p.geschaetzt !== 'boolean') {
    befunde.push(
      befund(
        'V5-SCHAETZUNG',
        p.id,
        'Die Mengen tragen keine Kennzeichnung „gemessen" oder „geschätzt". Sagt die Offenlegung, wie sie ermittelt wurden?',
        'The quantities carry no "measured" or "estimated" flag. Does the disclosure say how they were determined?'
      )
    );
  }
}

function pruefeCn(p: Position, befunde: Befund[], unbekannt: string[]): string | null {
  if (p.cnCode === undefined || p.cnCode === 'unbekannt') {
    unbekannt.push(`${p.id}.cnCode`);
    return null;
  }
  if (typeof p.cnCode !== 'string') throw new Error(`${p.id}.cnCode: Zeichenkette erwartet`);
  const problem = cnCodeProblem(p.cnCode);
  const z = istNeutral(p.cnCode) ? p.cnCode : '(Code)';
  if (problem === null) return p.cnCode.replace(/[\s.]/g, '').slice(0, 2);
  if (problem === 'nur-hs-ebene') {
    befunde.push(
      befund(
        'V3-CN-CODE',
        p.id,
        `„${z}" ist nur auf HS-Ebene (4 oder 6 Stellen). Nennt die Offenlegung den achtstelligen KN-Code?`,
        `"${z}" is at HS level only (4 or 6 digits). Does the disclosure give the eight-digit CN code?`
      )
    );
    return p.cnCode.replace(/[\s.]/g, '').slice(0, 2);
  }
  befunde.push(
    befund(
      'V3-CN-CODE',
      p.id,
      problem === 'kapitel'
        ? `„${z}" beginnt mit einem Kapitel, das es in der KN nicht gibt. Ist der Code richtig übertragen?`
        : `„${z}" hat nicht die Form eines achtstelligen KN-Codes. Ist der Code richtig übertragen?`,
      problem === 'kapitel'
        ? `"${z}" starts with a chapter that does not exist in the CN. Was the code transcribed correctly?`
        : `"${z}" is not shaped like an eight-digit CN code. Was the code transcribed correctly?`
    )
  );
  return null;
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

function suchwegText(s: Suchnachweis['suchweg']): string {
  return `Orte: ${s.orte.join(', ')}; Suchbegriffe: ${s.suchbegriffe.map((b) => `„${b}"`).join(', ')}`;
}

/**
 * Baut das Register (Unternehmen × Geschäftsjahr) aus gefundenen Offenlegungen
 * und Suchnachweisen. Der Status folgt allein daraus, in welcher Liste ein
 * Eintrag steht und ob er Quelle bzw. Stand und Suchweg trägt.
 *
 * @throws wenn ein Paar Unternehmen × GJ in beiden Listen oder doppelt steht,
 *         wenn Stand oder Suchweg fehlen, oder bei ungültiger Offenlegung.
 */
export function erstelleRegister(offenlegungen: Offenlegung[], suchnachweise: Suchnachweis[]): RegisterZeile[] {
  const gesehen = new Set<string>();
  const schluessel = (u: string, gj: number) => `${u}\u0000${gj}`;
  const zeilen: RegisterZeile[] = [];

  for (const o of offenlegungen) {
    const erg = pruefeOffenlegung(o);
    const k = schluessel(o.unternehmen, o.geschaeftsjahr);
    if (gesehen.has(k)) throw new Error(`Doppelter Eintrag: ${o.unternehmen} GJ ${o.geschaeftsjahr}`);
    gesehen.add(k);
    zeilen.push({
      unternehmen: o.unternehmen,
      geschaeftsjahr: o.geschaeftsjahr,
      status: 'gefunden',
      statusText: assertNeutraleSprache(`gefunden (abgerufen am ${o.quelle.abgerufenAm})`),
      stand: o.quelle.abgerufenAm,
      suchweg: null,
      quelleUrl: o.quelle.url,
      abgerufenAm: o.quelle.abgerufenAm,
      archivSnapshot: o.quelle.archivSnapshot ?? null,
      anzahlFragen: erg.befunde.length,
      schemaStatus: erg.schemaStatus,
      synthetisch: o.synthetisch === true,
    });
  }

  for (const s of suchnachweise) {
    pruefeKopf(s?.unternehmen, s?.geschaeftsjahr);
    pruefeDatum(s.stand, `${s.unternehmen} ${s.geschaeftsjahr}: stand`);
    const orte = s.suchweg?.orte;
    const begriffe = s.suchweg?.suchbegriffe;
    if (!Array.isArray(orte) || orte.filter((x) => x.trim()).length === 0) {
      throw new Error(`${s.unternehmen} ${s.geschaeftsjahr}: Suchweg ohne Orte — ohne Suchweg kein Eintrag`);
    }
    if (!Array.isArray(begriffe) || begriffe.filter((x) => x.trim()).length === 0) {
      throw new Error(`${s.unternehmen} ${s.geschaeftsjahr}: Suchweg ohne Suchbegriffe — ohne Suchweg kein Eintrag`);
    }
    const k = schluessel(s.unternehmen, s.geschaeftsjahr);
    if (gesehen.has(k)) {
      throw new Error(`Widerspruch: ${s.unternehmen} GJ ${s.geschaeftsjahr} steht als gefunden und als nicht gefunden`);
    }
    gesehen.add(k);
    const weg = suchwegText(s.suchweg);
    zeilen.push({
      unternehmen: s.unternehmen,
      geschaeftsjahr: s.geschaeftsjahr,
      status: 'keine Offenlegung gefunden',
      statusText: assertNeutraleSprache(`keine Offenlegung gefunden (Stand: ${s.stand}, Suchweg: ${weg})`),
      stand: s.stand,
      suchweg: weg,
      quelleUrl: null,
      abgerufenAm: null,
      archivSnapshot: null,
      anzahlFragen: null,
      schemaStatus: SCHEMA_STATUS,
      synthetisch: s.synthetisch === true,
    });
  }

  return zeilen.sort((a, b) => a.unternehmen.localeCompare(b.unternehmen, 'de') || a.geschaeftsjahr - b.geschaeftsjahr);
}

const CSV_SPALTEN: readonly (keyof RegisterZeile)[] = [
  'unternehmen',
  'geschaeftsjahr',
  'status',
  'statusText',
  'stand',
  'suchweg',
  'quelleUrl',
  'abgerufenAm',
  'archivSnapshot',
  'anzahlFragen',
  'schemaStatus',
  'synthetisch',
];

/** Statische CSV (Semikolon, RFC-4180-Quoting) aus Registerzeilen. */
export function registerAlsCsv(zeilen: RegisterZeile[]): string {
  const zelle = (v: unknown): string => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const text = [CSV_SPALTEN.join(';'), ...zeilen.map((z) => CSV_SPALTEN.map((k) => zelle(z[k])).join(';'))].join('\n');
  return assertNeutraleSprache(text);
}

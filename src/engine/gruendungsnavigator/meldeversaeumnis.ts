// Meldeversäumnis-Zähler (§ 32, § 7b Abs. 4 SGB II, Recht ab 01.07.2026). Lizenz: CC0 1.0 Public Domain.
//
// Zählt aus eingegebenen Ereignissen (Termine, Vorsprachen, Unterbrechungen)
// zwei Stände, die das Gesetz getrennt führt:
//   - Zählung nach § 32: das wievielte Meldeversäumnis im ununterbrochenen Bezug
//     seit dem 01.07.2026; ab dem zweiten mindert sich der Regelbedarf um 30 %.
//   - Folge nach § 7b Abs. 4: drei aufeinanderfolgende Versäumnisse ohne
//     wichtigen Grund, dann kann der ganze Anspruch entfallen.
//
// Der Kern entscheidet keine Wertungsfrage. Wichtiger Grund, Härte und
// Belehrung sind Eingaben; „offen“ rechnet beide Ausgänge. Wo Quellen sich
// widersprechen (BA-Weisung gegen Wuppertaler Arbeitshilfe), rechnet er die
// Weisung (höherer Rang) und meldet den Widerspruch. Wo kein Text eine Regel
// enthält, sagt er das. Grundlage: Gesetz (gesetze-im-internet.de), BA
// Fachliche Weisungen §§ 7b, 31–32 (Stand 01.07.2026), Arbeitshilfe des
// Jobcenters Wuppertal (Stand 29.06.2026), gelesen am 16.10.2026.

import { parseIso, plusMonate, plusTage, istWerktag, type IsoDatum } from './gruendungsnavigator';

export const STICHTAG = '2026-07-01';

export type Grund = 'keiner' | 'anerkannt' | 'offen';
export type Haerte = 'nein' | 'festgestellt' | 'offen';
export type Belehrung = 'ja' | 'nein' | 'unbekannt';

export interface TerminEreignis {
  art: 'termin';
  datum: IsoDatum;
  erschienen: boolean;
  /** Wichtiger Grund für das Fernbleiben (§ 32 Abs. 1 Satz 2) */
  grund?: Grund;
  /** Außergewöhnliche Härte (§ 31a Abs. 3) */
  haerte?: Haerte;
  /** Stand im Brief, dass bei drei Versäumnissen die ganze Leistung entfällt? (§ 7b Abs. 4 Satz 1) */
  neBelehrung?: Belehrung;
  /** Datum, an dem das Jobcenter das Versäumnis festgestellt hat */
  festgestelltAm?: IsoDatum;
  /** Tag, an dem der Bescheid zur Post ging */
  zurPostAm?: IsoDatum;
}

export interface VorspracheEreignis {
  art: 'vorsprache';
  datum: IsoDatum;
  wie: 'persoenlich' | 'sicherheitsdienst' | 'telefon' | 'email' | 'online';
}

export interface UnterbrechungEreignis {
  art: 'unterbrechung';
  von: IsoDatum;
  bis: IsoDatum;
  wegen: 'mitwirkung66' | 'sonstiges';
}

export type Ereignis = TerminEreignis | VorspracheEreignis | UnterbrechungEreignis;

/** Welche Quelle bei einem Widerspruch gerechnet wird */
export interface Lesart {
  unterbrechung: 'weisung' | 'wuppertal';
  haerteInFolge: 'weisung' | 'wuppertal';
}

export type QuelleArt = 'gesetz' | 'weisung' | 'oertlich' | 'ungeregelt';

export interface Schritt {
  datum: IsoDatum;
  was: string;
  zaehlung32: number;
  folge7b: number;
  rechtsfolge: string;
  /** Monat, ab dem die Rechtsfolge greift (erster Tag), falls aus den Eingaben ableitbar */
  ab?: IsoDatum;
  normen: string[];
  /** Randziffer oder Ziffer der Verwaltungsquelle */
  beleg?: string;
  quelle: QuelleArt;
}

export interface Szenario {
  titel: string;
  schritte: Schritt[];
  stand: { zaehlung32: number; folge7b: number };
}

export interface Konflikt {
  thema: string;
  weisung: string;
  wuppertal: string;
  belege: string[];
}

export interface Zaehlergebnis {
  szenarien: Szenario[];
  konflikte: Konflikt[];
  /** Fragen, die kein gelesener Text regelt und die dieses Ergebnis berühren */
  ungeregelt: string[];
  hinweise: string[];
}

/** Steht in jedem Ergebnis, egal wie der Stand ist. */
export const PFLICHT_HINWEIS =
  'Kündigt ein Brief an, dass die ganze Leistung entfällt, oder stellt das Jobcenter fest, dass Sie nicht erreichbar sind: im Monat danach persönlich im Jobcenter melden. Telefon, E-Mail, Online-Antrag oder ein Gespräch nur am Empfang oder beim Sicherheitsdienst reichen nach der BA-Weisung nicht. Lassen Sie sich die Vorsprache schriftlich bestätigen.';

export const GRENZE_HINWEIS =
  'Diese Zählung entscheidet nichts. Ob ein wichtiger Grund oder eine außergewöhnliche Härte vorliegt und ob ein Brief richtig zugegangen ist, entscheidet das Jobcenter, im Streit das Sozialgericht. Lassen Sie Ihren Fall bei einer Sozialberatung prüfen.';

export const DECKEL_HINWEIS =
  'Alle Minderungen zusammen sind auf 30 Prozent des Regelbedarfs begrenzt; Miete und Heizung werden dadurch nicht gemindert (§ 31a Abs. 4).';

/** Wörter, die der Zähler nie ausgeben darf */
export const ZAEHLER_VERBOTEN = ['kein risiko', 'sie müssen nicht', 'rechtswidrig', 'garantiert', 'unzulässig', 'sicher nicht', 'nichts passieren'];

const UNGEREGELT = {
  f4: 'Ob eine Versagung wegen fehlender Mitwirkung (§ 66 SGB I) die Folge von drei Versäumnissen unterbricht, regelt keiner der gelesenen Texte (Gesetz, Weisungen §§ 7b, 32, Gesetzesbegründung). Gerechnet ist: Die Folge läuft weiter.',
  f12: 'Ob eine persönliche Vorsprache nach dem dritten Versäumnis, aber vor der Feststellung, die Nichterreichbarkeit verhindert, steht nur in der Wuppertaler Arbeitshilfe; die BA-Weisung regelt nur das Erscheinen zur persönlichen Anhörung (Rz 7b.79).',
  f23: 'Ein Versäumnis vor dem 01.07.2026, das erst danach festgestellt wurde: Ob es für die neue Zählung mitzählt, regelt die Weisung nicht ausdrücklich (Rz 32.29 nennt nur Feststellungen bis 30.06.2026). Gerechnet ist: Es zählt nicht.',
  bekanntgabe: 'Fällt der vierte Tag nach der Aufgabe zur Post auf ein Wochenende oder einen Feiertag, ist hier nicht verschoben. Ob sich die Bekanntgabe dann verschiebt, ist nicht geprüft.',
  ausschluss: 'Die Feststellung kam mehr als sechs Monate nach dem Termin. Eine Minderung ist nur innerhalb von sechs Monaten zulässig (§ 31b Abs. 1); ob das auch für die Feststellung des ersten Versäumnisses gilt, ist offen. Prüfen lassen.',
};

const monatsanfang = (d: IsoDatum): IsoDatum => d.slice(0, 8) + '01';
const folgemonat = (d: IsoDatum): IsoDatum => plusMonate(monatsanfang(d), 1);
const vor = (a: IsoDatum, b: IsoDatum) => parseIso(a) < parseIso(b);
const datumDe = (d: IsoDatum) => d.split('-').reverse().join('.');

function ordne(ereignisse: Ereignis[]): Ereignis[] {
  const tag = (e: Ereignis) => (e.art === 'unterbrechung' ? e.von : e.datum);
  return [...ereignisse].sort((a, b) => (tag(a) < tag(b) ? -1 : tag(a) > tag(b) ? 1 : 0));
}

function pruefeEingaben(ereignisse: Ereignis[]): void {
  for (const e of ereignisse) {
    if (e.art === 'unterbrechung') {
      parseIso(e.von);
      parseIso(e.bis);
      if (vor(e.bis, e.von)) throw new Error(`Unterbrechung endet (${e.bis}) vor ihrem Beginn (${e.von})`);
    } else parseIso(e.datum);
    if (e.art === 'termin') {
      if (e.festgestelltAm) parseIso(e.festgestelltAm);
      if (e.zurPostAm) parseIso(e.zurPostAm);
    }
  }
}

type Annahme = 'guenstig' | 'unguenstig';

function rechne(ereignisse: Ereignis[], lesart: Lesart, annahme: Annahme, bewilligungsEnde: IsoDatum | undefined, ungeregelt: Set<string>): Szenario {
  const schritte: Schritt[] = [];
  let z32 = 0;
  let folge = 0;
  /** Laufende Nichterreichbarkeit: Warnmonat (erster Tag) */
  let ne: { warnmonat: IsoDatum } | null = null;
  const liste = ordne(ereignisse);
  const schritt = (s: Omit<Schritt, 'zaehlung32' | 'folge7b'>) => schritte.push({ ...s, zaehlung32: z32, folge7b: folge });

  liste.forEach((e, idx) => {
    if (e.art === 'unterbrechung') {
      if (e.wegen === 'mitwirkung66') {
        ungeregelt.add(UNGEREGELT.f4);
        schritt({ datum: e.von, was: `Leistung versagt oder entzogen (§ 66 SGB I) ${datumDe(e.von)} bis ${datumDe(e.bis)}`, rechtsfolge: 'Die Zählung nach § 32 beginnt dadurch nicht neu (Weisung Rz 32.6 Abs. 8).', normen: ['sgb1_66', 'sgb2_32'], beleg: 'FW § 32 Rz 32.6 Abs. 8', quelle: 'weisung' });
        return;
      }
      const monatLang = !vor(plusTage(e.bis, 1), plusMonate(e.von, 1));
      const neu = lesart.unterbrechung === 'weisung' || monatLang;
      if (neu) {
        z32 = 0;
        folge = 0;
        ne = null;
      }
      schritt({
        datum: e.von,
        was: `Leistungsbezug unterbrochen ${datumDe(e.von)} bis ${datumDe(e.bis)}`,
        rechtsfolge: neu
          ? 'Die Zählung beginnt nach der Unterbrechung von vorn.'
          : 'Die Zählung läuft weiter (Wuppertaler Arbeitshilfe: Neubeginn erst ab einem Monat Unterbrechung).',
        normen: ['sgb2_32'],
        beleg: lesart.unterbrechung === 'weisung' ? 'FW § 32 Rz 32.6 („Die Dauer der Unterbrechung ist unerheblich.“)' : 'Arbeitshilfe JC Wuppertal Ziff. 2',
        quelle: lesart.unterbrechung === 'weisung' ? 'weisung' : 'oertlich',
      });
      return;
    }

    if (e.art === 'vorsprache') {
      if (e.wie !== 'persoenlich') {
        schritt({ datum: e.datum, was: `Kontakt am ${datumDe(e.datum)} (${{ sicherheitsdienst: 'nur am Empfang/Sicherheitsdienst', telefon: 'Telefon', email: 'E-Mail', online: 'online' }[e.wie]})`, rechtsfolge: 'Gilt nach der BA-Weisung nicht als persönliche Meldung.', normen: ['sgb2_7b4'], beleg: 'FW § 7b Rz 7b.84', quelle: 'weisung' });
        return;
      }
      if (ne) {
        const imWarnmonat = !vor(e.datum, ne.warnmonat) && vor(e.datum, plusMonate(ne.warnmonat, 1));
        folge = 0;
        if (imWarnmonat) {
          schritt({ datum: e.datum, was: `Persönlich im Jobcenter gemeldet am ${datumDe(e.datum)}`, rechtsfolge: 'Gilt als durchgehend erreichbar. Für diesen Monat Minderung um 30 % des Regelbedarfs statt Wegfall. Für eine neue Nichterreichbarkeit müssten wieder drei Versäumnisse in Folge kommen.', ab: ne.warnmonat, normen: ['sgb2_7b4', 'sgb2_32'], beleg: 'FW § 7b Rz 7b.74, 7b.85', quelle: 'gesetz' });
        } else {
          schritt({ datum: e.datum, was: `Persönlich im Jobcenter gemeldet am ${datumDe(e.datum)}`, rechtsfolge: 'Erreichbarkeit wiederhergestellt: Anspruch nach der Weisung ab dem Tag der Vorsprache. Lebt nur eine Person in der Bedarfsgemeinschaft, braucht es nach der Weisung zusätzlich einen neuen Antrag.', normen: ['sgb2_7b4'], beleg: 'FW § 7b Rz 7b.90, 7b.91', quelle: 'weisung' });
        }
        ne = null;
        return;
      }
      schritt({ datum: e.datum, was: `Persönlich im Jobcenter ohne Einladung am ${datumDe(e.datum)}`, rechtsfolge: 'Zählt nicht als wahrgenommener Meldetermin; die Folge läuft weiter.', normen: ['sgb2_7b4'], beleg: 'Arbeitshilfe JC Wuppertal Ziff. 4 (letzter Absatz)', quelle: 'oertlich' });
      return;
    }

    // Termin
    const t = e;
    if (vor(t.datum, STICHTAG)) {
      if (!t.erschienen) {
        if (!t.festgestelltAm || !vor(t.festgestelltAm, STICHTAG)) ungeregelt.add(UNGEREGELT.f23);
        schritt({ datum: t.datum, was: `Termin am ${datumDe(t.datum)} versäumt (vor dem 01.07.2026)`, rechtsfolge: 'Für Termine vor dem 01.07.2026 gilt das alte Recht. Der Zähler rechnet es nicht nach; es zählt für die neue Zählung nicht mit.', normen: ['sgb2_65a2'], beleg: 'FW § 32 Rz 32.29; FW § 7b Rz 7b.76', quelle: 'gesetz' });
      }
      return;
    }
    if (t.erschienen) {
      folge = 0;
      schritt({ datum: t.datum, was: `Termin am ${datumDe(t.datum)} wahrgenommen`, rechtsfolge: 'Die Folge nach § 7b beginnt von vorn. Die Zählung nach § 32 bleibt, solange der Bezug nicht unterbrochen ist.', normen: ['sgb2_7b4', 'sgb2_32'], beleg: 'FW § 7b Rz 7b.77; FW § 32 Rz 32.5', quelle: 'weisung' });
      return;
    }

    const grundAnerkannt = t.grund === 'anerkannt' || (t.grund === 'offen' && annahme === 'guenstig');
    if (grundAnerkannt) {
      folge = 0;
      schritt({ datum: t.datum, was: `Termin am ${datumDe(t.datum)} versäumt, wichtiger Grund${t.grund === 'offen' ? ' (angenommen)' : ''}`, rechtsfolge: 'Kein Meldeversäumnis im Sinne des § 32, keine Minderung. Die Folge nach § 7b beginnt von vorn.', normen: ['sgb2_32', 'sgb2_7b4'], beleg: 'FW § 7b Rz 7b.77', quelle: 'gesetz' });
      return;
    }

    const haerte = t.haerte === 'festgestellt' || (t.haerte === 'offen' && annahme === 'guenstig');
    z32 += 1;
    if (haerte && lesart.haerteInFolge === 'weisung') folge = 0;
    else folge += 1;

    const belehrtNE = t.neBelehrung === 'ja' || (t.neBelehrung === 'unbekannt' && annahme === 'unguenstig');
    const was = `Termin am ${datumDe(t.datum)} versäumt, ohne anerkannten wichtigen Grund${t.grund === 'offen' ? ' (angenommen)' : ''}`;
    const hinweisFrist = (s: Schritt) => {
      if (t.festgestelltAm && vor(plusMonate(t.datum, 6), t.festgestelltAm)) {
        ungeregelt.add(UNGEREGELT.ausschluss);
        s.rechtsfolge += ' Achtung: Feststellung mehr als sechs Monate nach dem Termin (§ 31b Abs. 1).';
        s.normen.push('sgb2_31b');
      }
    };

    if (folge >= 3 && belehrtNE && !haerte) {
      // Vorsprache zwischen Termin und Feststellung? (nur Wuppertaler Arbeitshilfe)
      const vorsprache = t.festgestelltAm
        ? liste.slice(idx + 1).find((x): x is VorspracheEreignis => x.art === 'vorsprache' && x.wie === 'persoenlich' && vor(x.datum, t.festgestelltAm!))
        : undefined;
      if (vorsprache) {
        ungeregelt.add(UNGEREGELT.f12);
        const s: Schritt = { datum: t.datum, was, zaehlung32: z32, folge7b: folge, rechtsfolge: `Drittes Versäumnis in Folge, aber persönliche Vorsprache am ${datumDe(vorsprache.datum)} vor der Feststellung. Laut Wuppertaler Arbeitshilfe dann keine Nichterreichbarkeit, stattdessen 30 % für einen Monat; die nächste Einladung droht wieder den Wegfall an.`, normen: ['sgb2_32', 'sgb2_7b4'], beleg: 'Arbeitshilfe JC Wuppertal Ziff. 4', quelle: 'oertlich' };
        hinweisFrist(s);
        schritte.push(s);
        return;
      }
      const ab = t.festgestelltAm ? folgemonat(t.festgestelltAm) : undefined;
      let text = 'Drittes Versäumnis in Folge mit Belehrung über den Wegfall: Das Jobcenter prüft die Nichterreichbarkeit. Vorher soll es Gelegenheit zur persönlichen Anhörung geben (§ 31a Abs. 2). Keine 30-%-Minderung für dieses Versäumnis (§ 32 Abs. 3). Wird die Nichterreichbarkeit festgestellt: ';
      text += ab ? `ab ${datumDe(ab)} ein Monat ohne Regelbedarf (Miete, Heizung und Mehrbedarfe laufen weiter); wer sich in diesem Monat persönlich meldet, gilt als durchgehend erreichbar. ` : 'im Monat nach der Feststellung ein Monat ohne Regelbedarf (Miete, Heizung und Mehrbedarfe laufen weiter); wer sich in diesem Monat persönlich meldet, gilt als durchgehend erreichbar. ';
      text += `Ohne persönliche Meldung entfällt danach der ganze Anspruch bis zur persönlichen Meldung, längstens bis zum Ende des Bewilligungszeitraums${bewilligungsEnde ? ` (${datumDe(bewilligungsEnde)})` : ''}.`;
      const s: Schritt = { datum: t.datum, was, zaehlung32: z32, folge7b: folge, rechtsfolge: text, ab, normen: ['sgb2_7b4', 'sgb2_32', 'sgb2_31a4'], beleg: 'FW § 7b Rz 7b.72–7b.86; FW § 32 Rz 32.25a', quelle: 'gesetz' };
      hinweisFrist(s);
      schritte.push(s);
      if (ab) {
        ne = { warnmonat: ab };
        if (bewilligungsEnde && monatsanfang(t.festgestelltAm!) === monatsanfang(bewilligungsEnde)) {
          // F15b: Feststellung im letzten Monat des Bewilligungszeitraums
          schritte[schritte.length - 1].rechtsfolge += ' Die Feststellung fällt in den letzten Monat des Bewilligungszeitraums; wie das in den neuen Zeitraum wirkt, sehen Weisung und Wuppertaler Arbeitshilfe verschieden (siehe Widersprüche).';
        }
      }
      return;
    }

    let rechtsfolge: string;
    let ab: IsoDatum | undefined;
    let quelle: QuelleArt = 'gesetz';
    let beleg = 'FW § 32 Rz 32.5';
    const normen = ['sgb2_32'];
    if (haerte) {
      rechtsfolge = `Außergewöhnliche Härte${t.haerte === 'offen' ? ' (angenommen)' : ''}: keine Minderung. Das Versäumnis zählt nach § 32 trotzdem mit.`;
      normen.push('sgb2_31a3');
      if (lesart.haerteInFolge === 'weisung') {
        rechtsfolge += ' Die Folge nach § 7b beginnt nach der BA-Weisung von vorn.';
        beleg = 'FW § 32 Rz 32.5, 32.19; FW § 7b Rz 7b.77';
        quelle = 'weisung';
      } else {
        rechtsfolge += ' Die Folge nach § 7b zählt nach der Wuppertaler Arbeitshilfe weiter.';
        beleg = 'Arbeitshilfe JC Wuppertal Ziff. 6';
        quelle = 'oertlich';
      }
    } else if (z32 === 1) {
      rechtsfolge = 'Erstes Meldeversäumnis seit dem 01.07.2026 (oder seit der letzten Unterbrechung): keine Minderung. Das Jobcenter stellt es fest; jedes weitere Versäumnis kostet 30 % des Regelbedarfs für einen Monat.';
    } else {
      rechtsfolge = `${z32}. Meldeversäumnis: Minderung um 30 % des Regelbedarfs für einen Monat.`;
      normen.push('sgb2_31b', 'sgb2_31a4');
      if (t.zurPostAm) {
        const bekannt = plusTage(t.zurPostAm, 4);
        ab = folgemonat(bekannt);
        rechtsfolge += ` Bescheid zur Post am ${datumDe(t.zurPostAm)}, gilt als bekannt gegeben am ${datumDe(bekannt)} (§ 37 Abs. 2 SGB X); Minderung ab ${datumDe(ab)} (§ 31b Abs. 1).`;
        normen.push('sgb10_37');
        if (!istWerktag(bekannt)) ungeregelt.add(UNGEREGELT.bekanntgabe);
      }
      if (folge === 3 && !belehrtNE) rechtsfolge += ' Drittes Versäumnis in Folge, aber ohne Belehrung über den Wegfall der Leistung: nach § 7b Abs. 4 keine Nichterreichbarkeit.';
    }
    const s: Schritt = { datum: t.datum, was, zaehlung32: z32, folge7b: folge, rechtsfolge, ab, normen, beleg, quelle };
    hinweisFrist(s);
    schritte.push(s);
  });

  return { titel: '', schritte, stand: { zaehlung32: z32, folge7b: folge } };
}

const STANDARD: Lesart = { unterbrechung: 'weisung', haerteInFolge: 'weisung' };

function hatOffenes(ereignisse: Ereignis[]): boolean {
  return ereignisse.some((e) => e.art === 'termin' && !e.erschienen && (e.grund === 'offen' || e.haerte === 'offen' || e.neBelehrung === 'unbekannt'));
}

const kurz = (s: Szenario) => s.schritte.map((x) => `${x.datum}:${x.zaehlung32}/${x.folge7b}:${x.rechtsfolge.slice(0, 40)}`).join('|');
const letzte = (s: Szenario) => (s.schritte.length ? s.schritte[s.schritte.length - 1].rechtsfolge : 'keine Ereignisse');

/**
 * Zählt die Meldeversäumnisse. Wirft bei ungültigen Daten; rät nichts.
 * `bewilligungsEnde`: letzter Tag des laufenden Bewilligungszeitraums (optional).
 */
export function zaehleMeldeversaeumnisse(ereignisse: Ereignis[], optionen: { bewilligungsEnde?: IsoDatum } = {}): Zaehlergebnis {
  pruefeEingaben(ereignisse);
  if (optionen.bewilligungsEnde) parseIso(optionen.bewilligungsEnde);
  const ungeregelt = new Set<string>();
  const annahmen: Annahme[] = hatOffenes(ereignisse) ? ['unguenstig', 'guenstig'] : ['unguenstig'];
  const szenarien = annahmen.map((a) => {
    const s = rechne(ereignisse, STANDARD, a, optionen.bewilligungsEnde, ungeregelt);
    s.titel = annahmen.length === 1 ? 'Nach Ihren Angaben' : a === 'unguenstig' ? 'Wenn die offenen Punkte gegen Sie entschieden werden' : 'Wenn die offenen Punkte für Sie entschieden werden';
    return s;
  });

  // Widersprüche: dieselben Eingaben nach der Wuppertaler Lesart rechnen
  const konflikte: Konflikt[] = [];
  const pruefe = (lesart: Lesart, thema: string, belege: string[]) => {
    for (const a of annahmen) {
      const w = rechne(ereignisse, STANDARD, a, optionen.bewilligungsEnde, new Set());
      const o = rechne(ereignisse, lesart, a, optionen.bewilligungsEnde, new Set());
      if (kurz(w) !== kurz(o)) {
        konflikte.push({ thema, weisung: `${letzte(w)} (Stand: § 32 ${w.stand.zaehlung32}, Folge ${w.stand.folge7b})`, wuppertal: `${letzte(o)} (Stand: § 32 ${o.stand.zaehlung32}, Folge ${o.stand.folge7b})`, belege });
        return;
      }
    }
  };
  pruefe({ ...STANDARD, unterbrechung: 'wuppertal' }, 'Unterbrechung des Bezugs kürzer als ein Monat', ['FW § 32 Rz 32.6: „Die Dauer der Unterbrechung ist unerheblich.“', 'Arbeitshilfe JC Wuppertal Ziff. 2: Neubeginn nur, wenn mindestens einen Kalendermonat unterbrochen', 'Gesetz und Gesetzesbegründung (BT-Drs. 21/3541, S. 72) nennen keine Mindestdauer']);
  pruefe({ ...STANDARD, haerteInFolge: 'wuppertal' }, 'Außergewöhnliche Härte und die Folge von drei Versäumnissen', ['FW § 7b Rz 7b.77: bei Härte beginnt die Zählreihenfolge von vorne', 'Arbeitshilfe JC Wuppertal Ziff. 6: Härte-Versäumnis zählt für die Nichterreichbarkeit', '§ 7b Abs. 4 Satz 1 nennt nur den wichtigen Grund']);
  if (optionen.bewilligungsEnde && ereignisse.some((e) => e.art === 'termin' && e.festgestelltAm && monatsanfang(e.festgestelltAm) === monatsanfang(optionen.bewilligungsEnde!))) {
    konflikte.push({ thema: 'Feststellung im letzten Monat des Bewilligungszeitraums', weisung: 'Im ersten Monat des neuen Zeitraums nur Leistungen ohne Regelbedarf, danach Weiterbewilligung abgelehnt bis zur Wiederherstellung der Erreichbarkeit (Rz 7b.81).', wuppertal: 'Keine Wirkung, weil der neue Monat außerhalb des Bewilligungszeitraums liegt (Ziff. 7 b).', belege: ['FW § 7b Rz 7b.81', 'Arbeitshilfe JC Wuppertal Ziff. 7 b', '§ 7b Abs. 4 Satz 3: „bis zum Ablauf des ursprünglichen Bewilligungszeitraums“'] });
  }

  return { szenarien, konflikte, ungeregelt: [...ungeregelt], hinweise: [PFLICHT_HINWEIS, DECKEL_HINWEIS, GRENZE_HINWEIS] };
}

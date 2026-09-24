/**
 * Spielregeln des TischSchiedsrichters, getrennt von Mikrofon und Oberfläche,
 * damit sie testbar sind.
 *
 * Fußballregel: Jeder Treffer ist eine gelbe Karte. Die zweite gelbe Karte
 * innerhalb des Fensters ist Rot — dann schlägt der Schiedsrichter ein
 * anderes Thema vor. Pro Wort gibt es eine Abkühlzeit, weil die
 * Spracherkennung denselben Satz mehrmals als Zwischenergebnis meldet.
 */

export type Karte = 'gelb' | 'rot';

export interface Pfiff {
  wort: string;
  karte: Karte;
  zeit: number;
}

export const ROT_FENSTER_MS = 10 * 60 * 1000;
export const ABKUEHLZEIT_MS = 8 * 1000;

/** Kleinbuchstaben, Umlaute bleiben, Satzzeichen weg, ß → ss. */
export function normalisiere(text: string): string {
  return text
    .toLocaleLowerCase('de-DE')
    .replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Findet Listenwörter im Text. Ab vier Buchstaben zählt auch ein Wort, das
 * mit dem Listenwort beginnt („Partei" trifft „Parteien", „Parteitag"),
 * kürzere Wörter müssen exakt passen („Tax" soll nicht „Taxi" treffen).
 * Mehrwortbegriffe („Die Grünen") werden als Ganzes im Text gesucht.
 */
export function findeTreffer(text: string, liste: string[]): string[] {
  const norm = normalisiere(text);
  if (!norm) return [];
  const tokens = norm.split(' ');
  const treffer: string[] = [];
  for (const original of liste) {
    const w = normalisiere(original);
    if (!w) continue;
    let hit: boolean;
    if (w.includes(' ')) {
      hit = ` ${norm} `.includes(` ${w} `) || ` ${norm}`.includes(` ${w}`);
    } else if (w.length >= 4) {
      hit = tokens.some((t) => t.startsWith(w));
    } else {
      hit = tokens.includes(w);
    }
    if (hit && !treffer.includes(original)) treffer.push(original);
  }
  return treffer;
}

/** Welche Karte der nächste Treffer bekommt. */
export function naechsteKarte(verlauf: Pfiff[], jetzt: number): Karte {
  const letzteGelbe = [...verlauf].reverse().find((p) => p.karte === 'gelb');
  const letzteRote = [...verlauf].reverse().find((p) => p.karte === 'rot');
  // Nach einer roten Karte beginnt die Zählung neu.
  if (letzteGelbe && (!letzteRote || letzteGelbe.zeit > letzteRote.zeit) && jetzt - letzteGelbe.zeit <= ROT_FENSTER_MS) {
    return 'rot';
  }
  return 'gelb';
}

/** Ob ein Wort gerade abkühlt (derselbe Satz, mehrfach erkannt). */
export function kuehltAb(verlauf: Pfiff[], wort: string, jetzt: number): boolean {
  return verlauf.some((p) => p.wort === wort && jetzt - p.zeit < ABKUEHLZEIT_MS);
}

/** Verarbeitet einen erkannten Text und liefert die neuen Pfiffe (höchstens einen). */
export function pfeife(text: string, liste: string[], verlauf: Pfiff[], jetzt: number): Pfiff | null {
  const treffer = findeTreffer(text, liste).filter((w) => !kuehltAb(verlauf, w, jetzt));
  if (treffer.length === 0) return null;
  return { wort: treffer[0], karte: naechsteKarte(verlauf, jetzt), zeit: jetzt };
}

export const THEMENWECHSEL: Record<'de' | 'en' | 'es', string[]> = {
  de: [
    'Wer hat eigentlich den Nachtisch gemacht?',
    'Was war das beste Essen, das ihr je im Urlaub hattet?',
    'Welches Lied lief bei euch in der Schulzeit rauf und runter?',
    'Wenn ihr morgen frei hättet: Was würdet ihr tun?',
    'Welches Haustier hättet ihr als Kind gern gehabt?',
  ],
  en: [
    'Who actually made the dessert?',
    'What is the best meal you ever had on holiday?',
    'Which song did you play to death at school?',
    'If you had tomorrow off, what would you do?',
    'Which pet did you want as a kid?',
  ],
  es: [
    '¿Quién ha hecho el postre?',
    '¿Cuál es la mejor comida que habéis probado de vacaciones?',
    '¿Qué canción escuchabais sin parar en el colegio?',
    'Si mañana tuvierais el día libre, ¿qué haríais?',
    '¿Qué mascota queríais de pequeños?',
  ],
};

// Jobcenter-Hilfe: „Hier stimmt etwas nicht“. Lizenz: CC0 1.0 Public Domain.
//
// Wer einen Fehler sieht, soll ihn melden können, ohne GitHub zu kennen. Der
// Kern baut aus Seite, Abschnitt und Auszug drei Wege: ein vorausgefülltes
// GitHub-Issue (Formular .github/ISSUE_TEMPLATE/korrektur-jobcenter-hilfe.yml),
// eine E-Mail (nur wenn eine Adresse eingetragen ist) und Text zum Kopieren.
// Nichts wird automatisch gesendet; die Person sieht vorher, was rausgeht.

export interface KorrekturKontakt {
  /** GitHub-Repo „besitzer/name“ */
  repo: string;
  /** Dateiname des Issue-Formulars in .github/ISSUE_TEMPLATE/ */
  issueVorlage: string;
  /** Postfach für Korrekturen; leer = kein E-Mail-Weg */
  korrekturMail?: string;
}

export type KorrekturSeite = 'jobcenter-hilfe' | 'navigator' | 'landkarte';

export interface KorrekturEingabe {
  seite: KorrekturSeite;
  /** Abschnitt oder Karte, z. B. „Rückforderung · Bagatellgrenze“ */
  ort: string;
  /** Wörtlicher Auszug der Stelle */
  auszug?: string;
  /** Was falsch ist und wie es richtig wäre (freiwillig) */
  vorschlag?: string;
  /** Stand der Seite, z. B. Prüfdatum der Normen */
  stand?: string;
}

export interface KorrekturMeldung {
  titel: string;
  text: string;
  github: string;
  /** null, wenn kein Postfach eingetragen ist */
  mailto: string | null;
  /** true, wenn der Auszug für die Links gekürzt wurde */
  gekuerzt: boolean;
}

/** Optionen des Dropdowns „Welche Seite?“ im Issue-Formular, wörtlich */
export const SEITE_OPTION: Record<KorrekturSeite, string> = {
  'jobcenter-hilfe': 'Jobcenter-Hilfe (Meldeversäumnis, Rückforderung, Miete, Fristen, Vermögen, Briefe)',
  navigator: 'Gesprächsnavigator (Gründung)',
  landkarte: 'Fall-Landkarte',
};

/** Längen, die Browser und Mailprogramme zuverlässig verkraften */
export const GITHUB_MAX = 7000;
export const MAILTO_MAX = 1800;

const PERSONENDATEN = 'Bitte keine persönlichen Daten (Name, BG-Nummer, Anschrift, Bescheide).';

const eng = (s: string) => s.replace(/\s+/g, ' ').trim();

function kuerze(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)).trimEnd() + '…';
}

function baue(e: KorrekturEingabe, auszug: string) {
  const ort = eng(e.ort) || 'ohne Angabe';
  const titel = `[Korrektur] ${kuerze(ort, 80)}`;
  const stelle = [`Abschnitt: ${ort}`, auszug ? `Auszug: „${auszug}“` : '', e.stand ? `Stand der Seite: ${e.stand}` : ''].filter(Boolean).join('\n');
  const richtig = (e.vorschlag ?? '').trim();
  const text = [
    `Seite: ${SEITE_OPTION[e.seite]}`,
    stelle,
    '',
    'Was ist falsch oder fehlt, und wie wäre es richtig?',
    richtig || '…',
    '',
    'Beleg (Norm, Weisung mit Randziffer, Erfahrung aus der Praxis):',
    '…',
    '',
    PERSONENDATEN,
  ].join('\n');
  return { titel, stelle, richtig, text };
}

export function korrekturMeldung(e: KorrekturEingabe, k: KorrekturKontakt): KorrekturMeldung {
  if (!(e.seite in SEITE_OPTION)) throw new Error(`Unbekannte Seite: ${e.seite}`);
  if (!/^[\w.-]+\/[\w.-]+$/.test(k.repo)) throw new Error(`Repo „${k.repo}“ nicht im Format besitzer/name`);
  const mail = (k.korrekturMail ?? '').trim();
  if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) throw new Error(`Korrektur-Adresse „${mail}“ ist keine E-Mail-Adresse`);

  const voll = eng(e.auszug ?? '');
  let gekuerzt = false;

  const githubUrl = (auszug: string) => {
    const b = baue(e, auszug);
    const q = new URLSearchParams({ template: k.issueVorlage, title: b.titel, seite: SEITE_OPTION[e.seite], stelle: b.stelle });
    if (b.richtig) q.set('richtig', b.richtig);
    return `https://github.com/${k.repo}/issues/new?${q.toString()}`;
  };
  const mailUrl = (auszug: string) => {
    const b = baue(e, auszug);
    return `mailto:${mail}?subject=${encodeURIComponent(b.titel)}&body=${encodeURIComponent(b.text)}`;
  };
  // Auszug so weit kürzen, bis der Link passt; der Rest der Meldung bleibt ganz.
  const passend = (bau: (a: string) => string, max: number): string => {
    let a = voll;
    let url = bau(a);
    while (url.length > max && a.length > 0) {
      gekuerzt = true;
      a = kuerze(a, Math.floor(a.length * 0.8) - 1);
      if (a === '…') a = '';
      url = bau(a);
    }
    return url;
  };

  const github = passend(githubUrl, GITHUB_MAX);
  const mailto = mail ? passend(mailUrl, MAILTO_MAX) : null;
  const { titel, text } = baue(e, voll);
  return { titel, text, github, mailto, gekuerzt };
}

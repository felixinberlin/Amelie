// Jobcenter-Hilfe: Briefe aus festen Bausteinen. Lizenz: CC0 1.0 Public Domain.
//
// Jeder Brief besteht aus festen Sätzen, die sich auf eine Norm im Register
// stützen, und aus den Tatsachen, die die Person selbst einträgt. Keine
// Rechtsprechung, keine erzeugten Argumente: Die Sozialgerichte klagen über
// KI-Schriftsätze mit erfundenen Urteilen (LSG NRW, Jahrespressekonferenz
// 2026); ein Widerspruch braucht Tatsachen, keine Zitate.

export type BriefArt = 'widerspruch' | 'ueberpruefung' | 'vorschuss' | 'akteneinsicht' | 'schriftlich';

export interface BriefFelder {
  name?: string;
  anschrift?: string;
  bg?: string;
  jobcenter?: string;
  /** Ort und Datum des Briefs, z. B. „Wuppertal, 16.10.2026“ */
  ortDatum?: string;
  /** Datum des Bescheids (TT.MM.JJJJ) */
  bescheidVom?: string;
  /** Worum geht der Bescheid, in eigenen Worten (z. B. „Aufhebung und Erstattung für März bis Mai 2026“) */
  gegenstand?: string;
  /** Eigene Begründung: nur Tatsachen. Leer = Begründung folgt. */
  tatsachen?: string;
  /** Datum des Antrags auf Leistungen (für den Vorschuss) */
  antragVom?: string;
  /** Was mündlich gesagt wurde (für „schriftlich bestätigen“) */
  muendlich?: string;
  /** Akteneinsicht zusätzlich beantragen (Widerspruch) */
  mitAkteneinsicht?: boolean;
}

export interface Brief {
  betreff: string;
  text: string;
  /** Normen im Register, auf die sich die festen Sätze stützen */
  normen: string[];
  /** Felder, die noch fehlen (stehen im Text als [Beschriftung]) */
  fehlt: string[];
  hinweise: string[];
}

export const BRIEF_TITEL: Record<BriefArt, string> = {
  widerspruch: 'Widerspruch gegen einen Bescheid',
  ueberpruefung: 'Überprüfungsantrag (§ 44 SGB X)',
  vorschuss: 'Antrag auf Vorschuss (§ 42 SGB I)',
  akteneinsicht: 'Antrag auf Akteneinsicht (§ 25 SGB X)',
  schriftlich: 'Bitte um schriftliche Bestätigung einer mündlichen Aussage',
};

const BESCHRIFTUNG: Record<keyof BriefFelder, string> = {
  name: 'Ihr Name',
  anschrift: 'Ihre Anschrift',
  bg: 'BG-Nummer',
  jobcenter: 'Jobcenter',
  ortDatum: 'Ort, Datum',
  bescheidVom: 'Datum des Bescheids',
  gegenstand: 'worum es im Bescheid geht',
  tatsachen: 'Ihre Tatsachen',
  antragVom: 'Datum Ihres Antrags',
  muendlich: 'was gesagt wurde',
  mitAkteneinsicht: 'Akteneinsicht',
};

/** Wörter, die in Briefen nicht vorkommen sollen: Urteile, Drohungen, Versprechen */
export const BRIEF_VERBOTEN = [/\bAz\.?\s/i, /\bBSG\b/, /\bLSG\b/, /\bBVerfG\b/, /\bUrteil\b/i, /\bBeschluss vom\b/i, /rechtswidrig/i, /garantiert/i, /Dienstaufsichtsbeschwerde/i, /Strafanzeige/i];

const PFLICHT: Record<BriefArt, (keyof BriefFelder)[]> = {
  widerspruch: ['name', 'bg', 'jobcenter', 'ortDatum', 'bescheidVom'],
  ueberpruefung: ['name', 'bg', 'jobcenter', 'ortDatum', 'bescheidVom'],
  vorschuss: ['name', 'bg', 'jobcenter', 'ortDatum', 'antragVom'],
  akteneinsicht: ['name', 'bg', 'jobcenter', 'ortDatum'],
  schriftlich: ['name', 'bg', 'jobcenter', 'ortDatum', 'muendlich'],
};

/** Schützt vor Versehen: Datumsfelder als TT.MM.JJJJ */
const DATUM = /^\d{2}\.\d{2}\.\d{4}$/;

export function erzeugeBrief(art: BriefArt, f: BriefFelder): Brief {
  if (!(art in BRIEF_TITEL)) throw new Error(`Unbekannte Briefart: ${art}`);
  for (const k of ['bescheidVom', 'antragVom'] as const) {
    const v = f[k]?.trim();
    if (v && !DATUM.test(v)) throw new Error(`${BESCHRIFTUNG[k]}: „${v}“ bitte als TT.MM.JJJJ`);
  }
  const fehlt: string[] = [];
  const w = (k: keyof BriefFelder): string => {
    const v = typeof f[k] === 'string' ? (f[k] as string).trim() : '';
    if (!v) {
      if (PFLICHT[art].includes(k)) fehlt.push(BESCHRIFTUNG[k]);
      return `[${BESCHRIFTUNG[k]}]`;
    }
    return v;
  };

  const kopf = [w('name'), f.anschrift?.trim() ? f.anschrift.trim() : null, `BG-Nummer: ${w('bg')}`].filter(Boolean).join('\n');
  const an = `An das ${w('jobcenter')}`;
  const gruss = `\n\nMit freundlichen Grüßen\n\n${w('name')}`;
  const zusatz = f.gegenstand?.trim() ? ` (${f.gegenstand.trim()})` : '';
  let betreff = '';
  let rumpf = '';
  const normen: string[] = [];
  const hinweise: string[] = [];

  switch (art) {
    case 'widerspruch': {
      betreff = `Widerspruch gegen Ihren Bescheid vom ${w('bescheidVom')}${zusatz}`;
      rumpf = `hiermit lege ich Widerspruch gegen Ihren Bescheid vom ${w('bescheidVom')} ein.\n\n`;
      const t = f.tatsachen?.trim();
      rumpf += t ? `Begründung:\n${t}\n\n` : 'Die Begründung reiche ich nach.\n\n';
      if (f.mitAkteneinsicht) {
        rumpf += 'Zugleich beantrage ich Einsicht in die Akten, die dieses Verfahren betreffen (§ 25 SGB X), und bitte um einen Termin oder um Kopien.\n\n';
        normen.push('sgb10_25');
      }
      rumpf += 'Bitte bestätigen Sie mir den Eingang dieses Widerspruchs.';
      normen.push('sgg84', 'sgb2_39', 'sgg86a');
      hinweise.push('Frist: ein Monat ab Bekanntgabe (§ 84 SGG). Die Begründung darf später kommen; der Widerspruch selbst muss in der Frist eingehen.');
      hinweise.push('Gegen eine Aufhebung oder eine festgestellte Minderung hat ein Widerspruch keine aufschiebende Wirkung (§ 39 Nr. 1 SGB II). Eine Erstattungsforderung nennt § 39 nicht; für sie gilt der Grundsatz, dass der Widerspruch aufschiebende Wirkung hat (§ 86a Abs. 1 SGG). Ob Ihr Bescheid beides enthält, prüfen lassen.');
      hinweise.push('In die Begründung gehören Tatsachen mit Datum und Beleg, keine Urteile. Wenn Sie unsicher sind: „Die Begründung reiche ich nach.“ und eine Beratung fragen.');
      if (!t) normen.push('sgb10_25');
      break;
    }
    case 'ueberpruefung':
      betreff = `Antrag auf Überprüfung Ihres Bescheids vom ${w('bescheidVom')}${zusatz}`;
      rumpf = `hiermit beantrage ich die Überprüfung Ihres Bescheids vom ${w('bescheidVom')} nach § 44 SGB X in Verbindung mit § 40 Abs. 1 SGB II.\n\n`;
      rumpf += f.tatsachen?.trim() ? `Begründung:\n${f.tatsachen.trim()}\n\n` : 'Die Begründung reiche ich nach.\n\n';
      rumpf += 'Bitte bestätigen Sie mir den Eingang dieses Antrags.';
      normen.push('sgb10_44', 'sgb2_40', 'sgb10_44_4');
      hinweise.push('Möglich bis vier Jahre nach Ende des Jahres, in dem der Bescheid bekannt gegeben wurde. Nachgezahlt wird höchstens ab dem 1. Januar des Vorjahres des Antrags: früh stellen.');
      break;
    case 'vorschuss':
      betreff = 'Antrag auf Vorschuss';
      rumpf = `am ${w('antragVom')} habe ich Leistungen beantragt. Über den Antrag ist noch nicht entschieden.\n\nHiermit beantrage ich einen Vorschuss nach § 42 Abs. 1 Satz 2 SGB I. Nach dieser Vorschrift beginnt die Vorschusszahlung spätestens nach Ablauf eines Kalendermonats nach Eingang dieses Antrags.\n\n`;
      if (f.tatsachen?.trim()) rumpf += `Zu meiner Lage:\n${f.tatsachen.trim()}\n\n`;
      rumpf += 'Bitte bestätigen Sie mir den Eingang dieses Antrags.';
      normen.push('sgb1_42');
      hinweise.push('Der Vorschuss setzt voraus, dass der Anspruch dem Grunde nach besteht und nur die Höhe länger braucht. Ob er neben einer vorläufigen Entscheidung (§ 41a SGB II) greift, mit einer Beratung klären.');
      hinweise.push('Bei akuter Not (kein Geld für Essen oder Miete) ist ein Eilantrag beim Sozialgericht möglich; dafür eine Beratung oder die Rechtsantragstelle des Sozialgerichts fragen.');
      break;
    case 'akteneinsicht':
      betreff = 'Antrag auf Akteneinsicht';
      rumpf = 'hiermit beantrage ich Einsicht in die Akten, die mich betreffen, soweit ich sie zur Geltendmachung meiner rechtlichen Interessen brauche (§ 25 Abs. 1 SGB X). Ich bitte um einen Termin oder um Kopien (§ 25 Abs. 5 SGB X).\n\n';
      if (f.gegenstand?.trim()) rumpf += `Es geht um: ${f.gegenstand.trim()}.\n\n`;
      rumpf += 'Bitte bestätigen Sie mir den Eingang dieses Antrags.';
      normen.push('sgb10_25');
      hinweise.push('Zur Akteneinsicht dürfen Sie eine Person Ihres Vertrauens mitnehmen (§ 13 Abs. 4 SGB X). Für Kopien kann das Jobcenter angemessenen Aufwendungsersatz verlangen.');
      normen.push('sgb10_13');
      break;
    case 'schriftlich':
      betreff = 'Bitte um schriftliche Bestätigung';
      rumpf = `in unserem Gespräch wurde mir mündlich gesagt:\n${w('muendlich')}\n\nIch bitte Sie, mir das schriftlich zu bestätigen. Handelt es sich um eine Entscheidung, bitte ich um einen schriftlichen Bescheid mit Begründung (§ 33 Abs. 2, § 35 SGB X).\n\nBitte bestätigen Sie mir den Eingang dieses Schreibens.`;
      normen.push('sgb10_33', 'sgb10_35');
      hinweise.push('Erst ein schriftlicher Bescheid lässt eine Widerspruchsfrist laufen; ohne Bescheid gibt es nichts, wogegen Sie Widerspruch einlegen könnten.');
      break;
  }
  hinweise.push('Nachweisbar senden: über jobcenter.digital (Eingangsbestätigung speichern) oder persönlich abgeben und den Eingang auf einer Kopie bestätigen lassen.');

  const text = `${kopf}\n\n${an}\n\n${w('ortDatum')}\n\n${betreff}\n\nSehr geehrte Damen und Herren,\n\n${rumpf}${gruss}`;
  return { betreff, text, normen: [...new Set(normen)], fehlt: [...new Set(fehlt)], hinweise };
}

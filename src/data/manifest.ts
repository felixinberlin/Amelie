export interface RuleItem {
  number: number;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  ruleOfThumbDe: string;
  ruleOfThumbEn: string;
}

export interface LoopStep {
  step: number;
  nameDe: string;
  nameEn: string;
  actionDe: string;
  actionEn: string;
  budgetDe: string;
  budgetEn: string;
  exitCriterionDe: string;
  exitCriterionEn: string;
}

export const MANIFEST_RULES: RuleItem[] = [
  {
    number: 1,
    titleDe: 'Die Zustellung ist das Geschenk, nicht der Fund',
    titleEn: 'The delivery is the gift, not the discovery',
    descriptionDe: 'Ideen sind billig. Jeder hat dreißig. Das Geschenk beginnt erst in dem Moment, in dem du eine Person oder Gruppe recherchierst, die genau diese Idee bauen kann, und ihr ein sendefertiges Paket schnürst.',
    descriptionEn: 'Ideas are cheap. Everyone has thirty. The gift only starts when you research a specific team capable of building it, and deliver a turn-key package.',
    ruleOfThumbDe: 'Pro Idee 1 Stunde Suche, 1 Stunde Prüfung, 2 Stunden Empfänger-Recherche (1:2-Budgetregel).',
    ruleOfThumbEn: '1h discovery, 1h validation, 2h recipient research (the 1:2 budget ratio).'
  },
  {
    number: 2,
    titleDe: 'Signieren, aber nichts verlangen',
    titleEn: 'Sign your name, demand nothing',
    descriptionDe: 'Dein Name steht drunter, CC0 steht darüber. Keine Beteiligungsansprüche, keine Namensnennungspflicht, keine Erwartung einer Antwort. Der Kula-Ring funktioniert, weil die Gabe weiterwandert, nicht zurück.',
    descriptionEn: 'Your name underneath, CC0 above it. No equity demands, no mandatory attribution, zero expectation of a response. The Kula ring thrives because the gift travels onward, not backward.',
    ruleOfThumbDe: '„Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts."',
    ruleOfThumbEn: '"This idea belongs to no one. Take it, build it, sell it — you owe me nothing."'
  },
  {
    number: 3,
    titleDe: 'Einmal zustellen, dann weg',
    titleEn: 'Deliver once, then walk away',
    descriptionDe: 'Kein Nachfassen („Hatten Sie Gelegenheit, meine Mail zu lesen?"). Wer nachfasst, macht aus einem Geschenk eine Aufgabenliste für den Empfänger. Ein Geschenk erzeugt keine Bringschuld.',
    descriptionEn: 'Never follow up ("Did you get a chance to read my email?"). Following up turns an unconditional gift into an uninvited task on the recipient\'s todo list.',
    ruleOfThumbDe: 'Einmal senden. Loslassen. Nie wieder nachhaken.',
    ruleOfThumbEn: 'Send once. Let go. Never follow up.'
  },
  {
    number: 4,
    titleDe: 'Wer nicht gefragt hat, kriegt Werkzeug, kein Projekt',
    titleEn: 'If nobody asked, give tools, not a project',
    descriptionDe: 'Reine Ideen ohne Code gehen nur an Organisationen mit bezahltem Bauauftrag (Firmen, Forschung, Fördertöpfe, Stiftungen). An unbezahlte Open-Source-Maintainer nur mit lauffähigem Code-Skelett.',
    descriptionEn: 'Bare ideas with no code belong exclusively with salaried organizations (companies, research grants, foundations). Unpaid open-source maintainers only receive working skeleton code.',
    ruleOfThumbDe: 'Unbezahlte Maintainer niemals mit unerbetener Arbeit belasten.',
    ruleOfThumbEn: 'Never burden unpaid volunteer maintainers with unsolicited project homework.'
  },
  {
    number: 5,
    titleDe: 'Nicht zur Ausrede machen',
    titleEn: 'Don\'t let it become an excuse',
    descriptionDe: 'Verschenken fühlt sich produktiv an und ist trotzdem kein Bauen. Maximal zwei Ideen pro Jahr behalten und wirklich bis zum Ende durchziehen.',
    descriptionEn: 'Giving ideas away feels productive, yet it is still not building. Keep at most two ideas per cycle and actually finish building them.',
    ruleOfThumbDe: 'Behalte maximal 2 Ideen (z. B. Wet Ink & Spec-Drift Detector). Der Rest geht raus.',
    ruleOfThumbEn: 'Retain at most 2 projects for yourself. Everything else gets gifted.'
  }
];

export const AMELIE_LOOP_STEPS: LoopStep[] = [
  {
    step: 1,
    nameDe: '1. Fund & Erstfilter',
    nameEn: '1. Discovery & Filter',
    actionDe: 'Notiere die Idee in einem Satz. Prüfe sofort: Lässt sich das in 12 Tagen bauen oder nicht? Wenn nein, warum gehört es jemand anderem?',
    actionEn: 'Record the idea in one sentence. Check immediately: Can you build it yourself in 12 days? If not, why does it belong to someone else?',
    budgetDe: '1 Stunde',
    budgetEn: '1 Hour',
    exitCriterionDe: 'Präziser Ein-Satz-Schnitt vorhanden.',
    exitCriterionEn: 'Crisp one-sentence formulation achieved.'
  },
  {
    step: 2,
    nameDe: '2. Radikale Vorab-Prüfung',
    nameEn: '2. Radical Prior-Art Check',
    actionDe: 'Suche aktiv nach Beweisen, dass es das schon gibt. Wenn Firmen es besetzen oder 3 Repos existieren: sofort nach _entsorgt.md!',
    actionEn: 'Actively search for evidence that it already exists. If companies occupy it or 3 repos exist: discard immediately to _entsorgt.md!',
    budgetDe: '1 Stunde',
    budgetEn: '1 Hour',
    exitCriterionDe: 'Lücke eindeutig nachgewiesen oder verworfen.',
    exitCriterionEn: 'Unoccupied gap proven or idea discarded.'
  },
  {
    step: 3,
    nameDe: '3. Empfänger-Recherche',
    nameEn: '3. Recipient Investigation',
    actionDe: 'Finde die Organisation, die davon profitiert. Lies, was sie zuletzt wirklich gebaut haben, um nicht am Bedarf vorbei zu schreiben.',
    actionEn: 'Find the organization that benefits most. Read what they recently shipped to avoid pitching what they already have.',
    budgetDe: '2 Stunden',
    budgetEn: '2 Hours',
    exitCriterionDe: 'Konkreter Ansprechpartner & Bezugspunkt benannt.',
    exitCriterionEn: 'Named contact person & recent work reference identified.'
  },
  {
    step: 4,
    nameDe: '4. Dose packen',
    nameEn: '4. Pack the Tin',
    actionDe: 'Schreibe den standardisierten Einseiter: Problem, Warum jetzt, Skizze, Ticket #1, Wo es kippt, Wer es schon versucht hat.',
    actionEn: 'Write the standardized one-pager: Problem, Why now, Sketch, Ticket #1, Where it breaks, Prior art.',
    budgetDe: '1 Stunde',
    budgetEn: '1 Hour',
    exitCriterionDe: 'Ticket #1 ist von einem Werkstudenten in 2 Tagen lösbar.',
    exitCriterionEn: 'Ticket #1 executable by a student within 2 days.'
  },
  {
    step: 5,
    nameDe: '5. Zustellung',
    nameEn: '5. Delivery',
    actionDe: 'Sende die Kaltmail oder eröffne die Discussion. Erkläre im ersten Satz, warum es ein Geschenk ist. CC0, kein Verhandeln.',
    actionEn: 'Send the outreach email or open the discussion. Explain upfront why it is a free gift. CC0, no negotiation.',
    budgetDe: '20 Minuten',
    budgetEn: '20 Minutes',
    exitCriterionDe: 'Mail versendet, Link gesetzt.',
    exitCriterionEn: 'Email dispatched, link confirmed.'
  },
  {
    step: 6,
    nameDe: '6. Loslassen',
    nameEn: '6. Walk Away & Let Go',
    actionDe: 'Lösche die mentale Wiedervorlage. Kein Nachfassen. Was gebaut wird, ist ein Geschenk; was ignoriert wird, war auch eines.',
    actionEn: 'Clear mental scratchpad. No following up. What gets built is a gift; what gets ignored was equally a gift.',
    budgetDe: '0 Minuten',
    budgetEn: '0 Minutes',
    exitCriterionDe: 'Idee innerlich vollständig abgegeben.',
    exitCriterionEn: 'Idea completely released.'
  }
];

export const AMELIE_PLEDGE = {
  de: `Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.`,
  en: `This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.`,
  es: `Esta idea no pertenece a nadie. Tómala, constrúyela, comercialízala — no me debes nada, ni siquiera una respuesta. Si algún día tienes una idea que no vas a construir, entrégasela a alguien que sí lo haga.`
};

export const TERRITORY_ATLAS = [
  {
    sectorDe: 'Entwickler-Tooling im aktiven Ökosystem (MCP, Git, Router)',
    sectorEn: 'Developer tooling in active ecosystems (MCP, Git, Router)',
    statusDe: 'Fast vollständig besetzt',
    statusEn: 'Almost completely crowded',
    lessonDe: 'Zeitfenster beträgt wenige Monate. Jeder naheliegende Einfall wird parallel gebaut.',
    lessonEn: 'Window of opportunity is months. Any obvious idea is built in parallel.'
  },
  {
    sectorDe: 'Schöne Demos (3D, DLA, Fluidsim)',
    sectorEn: 'Aesthetic demos (3D, DLA, Fluid sim)',
    statusDe: 'Vielfach gebaut',
    statusEn: 'Abundantly built',
    lessonDe: 'Restwert liegt im langweiligen Teil (physikalische Didaktik, Messkalibrierung).',
    lessonEn: 'Residual value lies in the unglamorous didactics and scientific calibration.'
  },
  {
    sectorDe: 'Kommerziell attraktive Endnutzer-Apps (Pendeln, Traumdeutung)',
    sectorEn: 'Commercially attractive consumer apps (Commute, dream analysis)',
    statusDe: 'Von Firmen besetzt',
    statusEn: 'Dominated by companies',
    lessonDe: 'Monetarisierbare Datenpools machen offene Geschenke chancenlos.',
    lessonEn: 'Proprietary ad-funded data moats make open gifts uncompetitive.'
  },
  {
    sectorDe: 'Zivilgesellschaft, Verwaltung, Vereine (Sperrmüll, Lärm, Altbau-Wärme)',
    sectorEn: 'Civil society, public administration, associations (Waste, noise, housing physics)',
    statusDe: 'FREI & UNBESETZT',
    statusEn: 'OPEN & VACANT',
    lessonDe: 'Hier lässt sich kein Geld verdienen — genau dort wirken Geschenke am meisten!',
    lessonEn: 'No money to be extracted here — which is precisely where gifts create the greatest impact!'
  }
];

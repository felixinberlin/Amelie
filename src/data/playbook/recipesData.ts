import { Language } from '../../types';

export interface PlaybookRecipe {
  id: string;
  number: number;
  titleDe: string;
  titleEn: string;
  titleEs?: string;
  formulaDe: string;
  formulaEn: string;
  descriptionDe: string;
  descriptionEn: string;
  queryExample: string;
  fundExampleDe: string;
  fundExampleEn: string;
  warningDe?: string;
  warningEn?: string;
}

export const PLAYBOOK_RECIPES: PlaybookRecipe[] = [
  {
    id: 'recipe-pdf-schema',
    number: 1,
    titleDe: 'Offizielles Bewertungsschema ohne digitales Werkzeug',
    titleEn: 'Official Regulatory Scoring Schema without Software Tool',
    titleEs: 'Esquema de evaluación oficial sin herramienta digital',
    formulaDe: '<Thema> Bewertungsverfahren OR Punktesystem OR Leitfaden',
    formulaEn: '<Topic> "scoring rubric" OR "assessment methodology" OR "guideline"',
    descriptionDe: 'Findet offizielle Leitfäden von Fachgremien, die als 30-Seiten PDF existieren und von Fachleuten oder Bauämtern mühsam per Hand ausgerechnet werden.',
    descriptionEn: 'Discovers official evaluation guidelines published as static PDFs that municipal officers or field volunteers calculate manually on paper.',
    queryExample: '"Vogelschlag" Bewertungsverfahren OR Punktesystem OR Leitfaden',
    fundExampleDe: 'LAG-VSW Leitfaden 21/01 zur Bewertung von Glasanflug an Gebäuden → Dosis glasanflug-ampel.',
    fundExampleEn: 'State Bird Conservation Centers Guideline 21/01 on architectural glass collision → Dose glasanflug-ampel.',
    warningDe: 'Warnung: Dieses Rezept findet die Lücke, prüft sie aber nicht. Immer mit der Auslandsgegenprobe (Rezept 2) kombinieren!',
    warningEn: 'Warning: This recipe discovers the gap but does not audit it. Always combine with the Foreign Counterpart (Recipe 2)!',
  },
  {
    id: 'recipe-foreign-counterpart',
    number: 2,
    titleDe: 'Die Auslandsgegenprobe (Foreign Regulation Counterpart)',
    titleEn: 'The Foreign Regulation Counterpart & International Precedents',
    titleEs: 'La contraprueba internacional y regulaciones extranjeras',
    formulaDe: '<Thema> LEED credit OR "city ordinance compliance" OR "threat factor" OR "DIY assessment app"',
    formulaEn: '<Topic> LEED credit OR "city ordinance compliance" OR "threat factor" OR "rating calculator"',
    descriptionDe: 'Wo ein deutsches Gremium nur ein Faltblatt publiziert, hat ein anderes Land oft bereits ein Gesetz mit Software oder Tabellenkalkulation. Regulierung erzeugt Werkzeuge!',
    descriptionEn: 'Where a domestic committee only publishes a PDF pamphlet, international jurisdictions often already enacted legislation with accompanying calculation tools.',
    queryExample: '"bird collision" LEED credit OR "NYC Local Law 15" OR "threat rating calculator"',
    fundExampleDe: 'LEED Pilot Credit SSpc55 (Bird Collision Threat Rating mit USGBC-Vorlage), FLAP Canada BirdSafe App.',
    fundExampleEn: 'LEED Pilot Credit SSpc55 (Bird Collision Threat Rating with USGBC spreadsheet), FLAP Canada BirdSafe app.',
  },
  {
    id: 'recipe-measurement-vs-calc',
    number: 3,
    titleDe: 'Rechner besetzt → Eingabewerte & Messung frei',
    titleEn: 'Calculator Saturated → Input Measurement & Sensing Open',
    titleEs: 'Calculadora saturada → Medición de valores de entrada libre',
    formulaDe: '<Funktion> smartphone measurement OR "in-situ sensorless" OR "camera proxy"',
    formulaEn: '<Function> smartphone measurement OR "in-situ sensorless" OR "camera proxy"',
    descriptionDe: 'Wenn der mathematische Rechner bereits als Formular existiert, liegt die Lücke eine Schicht tiefer: Wie kommen die Rohdaten (Kanten, Winkel, Lötnaht, Zählfolge) überhaupt in den Rechner?',
    descriptionEn: 'When formula calculators already exist as web forms, the unserved bottleneck moves one layer deeper: how do physical input values get measured on-site without lab gear?',
    queryExample: 'lead pipe non-destructive ultrasonic resonance smartphone measurement',
    fundExampleDe: 'Rechner für Bleirohr-Risiko gab es — die zerstörungsfreie akustische und makroskopische Erkennung vor Ort war die freie Dosis bleifrei-lotse.',
    fundExampleEn: 'Form calculators for lead pipes existed — in-situ non-destructive acoustic and macro visual identification became Dose bleifrei-lotse.',
  },
  {
    id: 'recipe-disclosure-without-register',
    number: 4,
    titleDe: 'Offenlegungspflicht ohne Register (Die 3 Pflichtfragen)',
    titleEn: 'Public Disclosure Duty Without Central Register (The 3 Gatekeepers)',
    titleEs: 'Obligación de divulgación pública sin registro (Las 3 preguntas)',
    formulaDe: '"veröffentlicht auf der Website" OR "disclose on website" <Gesetz/Norm>',
    formulaEn: '"disclose on company website" OR "publish in annual report" <Directive/Act>',
    descriptionDe: 'EU- und Bundesgesetze verpflichten Konzerne oft, Berichte auf ihrer eigenen Homepage zu veröffentlichen, benennen aber keine zentrale Sammelstelle. Drei Pflichtfragen: (1) Ist die Pflicht bedingt? (2) Gibt es eine Verpflichteten-Startliste? (3) Nennt das Gesetz eine amtliche Sammelstelle?',
    descriptionEn: 'Directives often mandate corporate web disclosure without funding a central aggregator. Pass 3 mandatory gates: (1) Is the duty conditional? (2) Is there a known denominator list? (3) Does the statute name an official collector?',
    queryExample: 'ESPR "Article 24" "destruction of unsold" "published on" site:europa.eu',
    fundExampleDe: 'ESPR Art. 24 (vernichtete Textilien/Elektronik) → vernichtungs-offenlegungsregister; EnEfG § 9 (Umsetzungspläne) → umsetzungsplan-register.',
    fundExampleEn: 'ESPR Art. 24 (destroyed apparel/electronics) → vernichtungs-offenlegungsregister; EnEfG § 9 (energy plans) → umsetzungsplan-register.',
  },
  {
    id: 'recipe-funding-inversion',
    number: 5,
    titleDe: 'Die Geldspur & Fördercall-Inversion',
    titleEn: 'The Money Trail & Grant Call Inversion',
    titleEs: 'El rastro del dinero y la inversión de convocatorias de subvenciones',
    formulaDe: '<Thema> Förderrichtlinie Zuwendungszweck "Bundesanzeiger" OR Prototype Fund',
    formulaEn: '<Topic> "grant call" OR "funding guidelines" OR "challenge fund" OR "call for proposals"',
    descriptionDe: 'Wer Geld auslobt (Calls von DBU, Prototype Fund, mFUND, EIC, EU Missions), hat die Ground Truth des Problems bereits behördlich validiert. In Zuwendungszweck steht das exakte Defizit; in der Jury sitzt die Person mit Mandat.',
    descriptionEn: 'Organizations offering grants (DBU, Prototype Fund, mFUND, EIC, EU Missions) have formally verified the authenticity of the pain point. Section 1 describes the exact gap; the jury lists the authentic mandate holder.',
    queryExample: 'Wildbienen Nisthilfen Citizen Science Förderrichtlinie Zuwendungszweck',
    fundExampleDe: 'DBU-Förderkatalog und BMEL-MonViA Projekte führten zur exakten Nistkasten-Sortierarchitektur.',
    fundExampleEn: 'DBU grant registry and BMEL MonViA projects established the exact nesting box triage architecture.',
  },
  {
    id: 'recipe-separate-mechanic-from-object',
    number: 6,
    titleDe: 'Die Mechanik getrennt vom Gegenstand suchen',
    titleEn: 'Search the Core Mechanism Separately from the Subject Matter',
    titleEs: 'Buscar el mecanismo central separado del objeto de estudio',
    formulaDe: '<Mechanik auf Englisch in Produktwörtern>',
    formulaEn: '<Pure mechanics in English product terminology without domain noun>',
    descriptionDe: 'Wenn die Idee „X macht Y" lautet, ist Y fast immer ein eigenes, etabliertes Feld. Suche Y isoliert auf Englisch, um nicht an deutschen Gegenstands-Sakkaden vorbeizusuchen.',
    descriptionEn: 'If an idea proposes "X performs Y", Y is almost always a mature standalone discipline. Search Y alone in English product terms to avoid blind spots.',
    queryExample: 'repeat photography same plant app alignment time-lapse',
    fundExampleDe: '„Ritzenpflanzen-App" schien frei — die Mechanik „time-lapse same plant" war mit GrowApp und Nature\'s Notebook bereits dicht besetzt.',
    fundExampleEn: '"Pavement crack flora app" seemed open — but the core mechanism "time-lapse same plant" was already saturated by GrowApp and Nature\'s Notebook.',
  },
  {
    id: 'recipe-pr-campaign-test',
    number: 7,
    titleDe: 'Der Werbeagentur- & Kampagnen-Test für Anlass-Ideen',
    titleEn: 'The Ad Agency PR Campaign Test for Occasion-Driven Concepts',
    titleEs: 'La prueba de campañas publicitarias para ideas basadas en ocasiones',
    formulaDe: '<Anlass> app detecta OR campaign OR agency <Jahr vor 2020>',
    formulaEn: '<Occasion/Holiday> app agency campaign award <Year before 2020>',
    descriptionDe: 'Ideen an Festtagen oder Anlässen (Weihnachtsstreit, Familienfeier, Wahlabend) haben Werbeagenturen oft schon als kurzlebige Kampagnen-App für Cannes Lions gebaut.',
    descriptionEn: 'Occasion-based tools (Christmas family arguments, election night, dinner table banter) were frequently launched as short-lived agency PR apps for advertising awards.',
    queryExample: 'Christmas dinner table argument detector app agency campaign 2015',
    fundExampleDe: 'TischSchiedsrichter (Mikrofon-Schimpfwortkasse) wurde 2015 von Shackleton als *Noche de Paz* in Spanien als PR-Kampagne gebaut.',
    fundExampleEn: 'Table referee (microphone swear jar) was built by Shackleton in 2015 as the *Noche de Paz* viral app.',
  },
  {
    id: 'recipe-pre-ai-claim-test',
    number: 8,
    titleDe: '„Vor KI unmöglich" ist ein überprüfbarer Faktensatz',
    titleEn: '"Impossible Before AI" is a Testable Factual Claim',
    titleEs: '«Imposible antes de la IA» es una afirmación comprobable',
    formulaDe: '<Funktion> 2015 OR Kickstarter OR patent',
    formulaEn: '<Function> 2015 OR Kickstarter OR "product launch"',
    descriptionDe: 'Jede Idee, deren Daseinsberechtigung auf „Das ging vor modernen LLMs/Vision-Modellen technisch nicht" beruht, sofort mit Jahreszahlen vor 2020 suchen.',
    descriptionEn: 'Every concept claiming "this was computationally impossible before 2024 AI" must be challenged by querying the core mechanic with years prior to 2020.',
    queryExample: 'audio stem separation choir SATB 2018 Kickstarter',
    fundExampleDe: 'Mehrere Audio- und OCR-Konzepte scheiterten an 10 Jahre alten Signalverarbeitungs- und Open-Source-Projekten.',
    fundExampleEn: 'Multiple audio and OCR proposals were invalidated by decade-old open source digital signal processing tools.',
  },
];

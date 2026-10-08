import { Language } from '../../types';

export type SaturationStatus = 'frei' | 'verengt' | 'beim_empfaenger' | 'wird_besetzt' | 'dicht' | 'dicht_kommerziell' | 'dicht_forschung';

export type PlaybookThemeId = 
  | 'all'
  | 'nature'
  | 'construction'
  | 'compliance'
  | 'urban'
  | 'heritage'
  | 'health_water'
  | 'dev_ai';

export interface PlaybookThemeOption {
  id: PlaybookThemeId;
  label: Record<Language, string>;
  icon: string;
  count?: number;
}

export const PLAYBOOK_THEMES: PlaybookThemeOption[] = [
  {
    id: 'all',
    label: {
      de: 'Alle Themenbereiche',
      en: 'All Domains & Themes',
      es: 'Todos los dominios',
    },
    icon: '✨',
  },
  {
    id: 'nature',
    label: {
      de: 'Naturschutz & Biodiversität',
      en: 'Nature & Biodiversity',
      es: 'Conservación y biodiversidad',
    },
    icon: '🌿',
  },
  {
    id: 'construction',
    label: {
      de: 'Bauphysik, Holz & Handwerk',
      en: 'Building Physics, Timber & Trades',
      es: 'Física de edificios, madera y oficios',
    },
    icon: '🪵',
  },
  {
    id: 'compliance',
    label: {
      de: 'Recht, Offenlegungen & Register',
      en: 'Regulation, Disclosures & Public Registries',
      es: 'Regulación, divulgación y registros públicos',
    },
    icon: '⚖️',
  },
  {
    id: 'urban',
    label: {
      de: 'Stadt, Mieter & Kreislaufwirtschaft',
      en: 'Urban Space, Tenants & Circular Economy',
      es: 'Ciudad, inquilinos y economía circular',
    },
    icon: '🏙️',
  },
  {
    id: 'heritage',
    label: {
      de: 'Kulturerbe, Archive & Dialekte',
      en: 'Cultural Heritage, Archives & Dialects',
      es: 'Patrimonio cultural, archivos y dialectos',
    },
    icon: '🏛️',
  },
  {
    id: 'health_water',
    label: {
      de: 'Gesundheit, Wasser & Lärm',
      en: 'Health, Water & Environmental Acoustics',
      es: 'Salud, agua y acústica ambiental',
    },
    icon: '💧',
  },
  {
    id: 'dev_ai',
    label: {
      de: 'Dev-Tools, Forschung & Agenten',
      en: 'Dev Tools, Research & Agents',
      es: 'Herramientas de desarrollo e IA',
    },
    icon: '💻',
  },
];

export interface SaturationAtlasEntry {
  id: string;
  theme: PlaybookThemeId;
  fieldDe: string;
  fieldEn: string;
  fieldEs?: string;
  status: SaturationStatus;
  evidenceDe: string;
  evidenceEn: string;
  evidenceEs?: string;
  lessonDe?: string;
  lessonEn?: string;
  whyNowDe?: string;
  whyNowEn?: string;
  round?: string;
  linkedDoseId?: string;
}

export const SATURATION_ATLAS_DATA: SaturationAtlasEntry[] = [
  // --- NATURSCHUTZ & BIODIVERSITÄT ---
  {
    id: 'nature-conservation-enforcement-schemes',
    theme: 'nature',
    fieldDe: 'Naturschutz-Vollzug (Schemata, Checklisten, Monitoring)',
    fieldEn: 'Conservation Enforcement & Monitoring (Point scoring sheets, manual verification)',
    fieldEs: 'Cumplimiento de conservación y monitoreo (rúbricas y hojas de cálculo)',
    status: 'frei',
    evidenceDe: 'Vogelschlag-Ampel (LAG-VSW Leitfaden 21/01), Wildbienen-Vorsortierer (Thünen-Institut MonViA). Schemata existieren als PDFs, Software fehlt völlig.',
    evidenceEn: 'Bird glass hazard score (LAG-VSW guideline 21/01), wild bee nesting pre-sorter (Thünen Institute MonViA). Official standards exist as PDFs, zero software tools.',
    lessonDe: 'Was Fachgremien als PDF-Punktesystem publizieren, ist der ideale Kern für ein deterministisches Geschenk-Werkzeug.',
    lessonEn: 'What expert committees publish as PDF point scoring rubrics is the prime core for a deterministic CC0 tool.',
    round: 'Runde 1 & 7',
    linkedDoseId: 'glasanflug-ampel',
  },
  {
    id: 'nature-ai-species-recognition',
    theme: 'nature',
    fieldDe: 'Naturschutz: KI-Bilderkennung (Arten-/Biotoptyp aus Foto/Fernerkundung)',
    fieldEn: 'Nature: AI Species & Biotope Recognition (from single photos or aerial data)',
    fieldEs: 'Reconocimiento de especies por IA (fotos y satélite)',
    status: 'dicht_forschung',
    evidenceDe: 'ObsIdentify (~95 % Trefferquote), Flora Incognita, KIBI-Projekt (BfN, FFH-Typen aus Luftbild), Namis-Biotop-App (DBU). Sehr hoher Wettbewerb.',
    evidenceEn: 'ObsIdentify (~95% accuracy), Flora Incognita, KIBI project (BfN, FFH types from aerial surveys), Namis Biotope App (DBU). Heavily saturated.',
    lessonDe: 'Art- und Biotopklassifikation aus Einzelfotos ist durchfinanziert. Nicht als neue KI-App versuchen.',
    lessonEn: 'Single photo species identification is well-funded. Never try to build a generic classifier app.',
    round: 'Runde 3',
  },
  {
    id: 'nature-longitudinal-single-plant',
    theme: 'nature',
    fieldDe: 'Longitudinalbeobachtung derselben Einzelpflanze (Wiederholungsfoto, Zeitraffer)',
    fieldEn: 'Longitudinal Observation of the Same Individual Plant (Repeated angle photos, time-lapse)',
    fieldEs: 'Observación longitudinal de la misma planta individual (time-lapse, alineación)',
    status: 'dicht',
    evidenceDe: 'GrowApp (GLOBE Niederlande, European Phenology Campaign): voriges Foto transparent zum Ausrichten, automatischer Zeitraffer. Nature\'s Notebook (USA-NPN): Einzelpflanzen mit Spitznamen registrieren.',
    evidenceEn: 'GrowApp (GLOBE Netherlands, European Phenology Campaign): transparent ghost overlay for alignment, auto time-lapse. Nature\'s Notebook (USA-NPN): register individual plants with nicknames.',
    lessonDe: '„Dieselbe Pflanze über Jahre beobachten" ist ein eigenes, besetztes Feld — getrennt von Artbestimmung betrachten.',
    lessonEn: '"Observing the same plant over years" is an established, occupied niche — separate it from species ID.',
    round: 'Runde 6',
  },
  {
    id: 'nature-living-game-object',
    theme: 'nature',
    fieldDe: 'Lebendes Objekt im Standortspiel (Organismus mit echter Lebensdauer)',
    fieldEn: 'Living Real-World Organism in Location-Based Games (Real mortality & seasonal dynamics)',
    fieldEs: 'Organismo vivo real en juegos de geolocalización (mortalidad real)',
    status: 'frei',
    evidenceDe: 'Ortsbesitz-Spiele (Pokémon GO, Ingress, Munzee) nutzen statische/virtuelle Marker. Echte Naturspiele spielen in virtuellen Welten. Die Bindung an ein lebendes Individuum außerhalb des Spiels ist frei.',
    evidenceEn: 'Location turf games use curated virtual markers. Nature games operate in synthetic worlds. Binding a game token directly to a living wild plant in urban pavement is completely unserved.',
    round: 'Runde 6',
    linkedDoseId: 'lebendes-spielobjekt',
  },
  {
    id: 'nature-nest-entrance-camera',
    theme: 'nature',
    fieldDe: 'Flugloch-/Eingangskamera mit Eindringling-Erkennung',
    fieldEn: 'Hive & Nest Entrance Monitoring with Intruder Recognition',
    fieldEs: 'Cámaras de entrada de colmena con detección de invasores',
    status: 'dicht',
    evidenceDe: 'VespAI (Communications Biology 2024, quelloffen gegen Asiatische Hornisse), vespCV, HiveWarden für Honigbienen. Für Hummeln und Solitärbienen noch Lücken.',
    evidenceEn: 'VespAI (Communications Biology 2024, open-source Asian Hornet defense), vespCV, HiveWarden for honeybees. Solitary bees remain a slight gap.',
    round: 'Runde 8',
  },

  // --- BAUPHYSIK, HOLZ & HANDWERK ---
  {
    id: 'construction-timber-carpenter-marks',
    theme: 'construction',
    fieldDe: 'Bauforschung an Fachwerk (Abbundzeichen-Fundbuch & Zählfolgen-Prüfer)',
    fieldEn: 'Timber Framing Archaeology (Carpenter joinery marks & sequential counting audit)',
    fieldEs: 'Arqueología de entramados de madera (marcas de carpintero y verificación secuencial)',
    status: 'frei',
    evidenceDe: 'Kein Werkzeug und keine offene Datenbank für Abbundzeichen; IgB-Hausforschung und Ehrenamtliche dokumentieren Funde in Foren von Hand. Raking Light sammelt Belege mühsam.',
    evidenceEn: 'Zero tools or public databases for timber framing joinery marks; IgB historical building researchers document marks manually in forum threads. Raking Light collects records by hand.',
    round: 'Holz-Runde (27.09.2026)',
    linkedDoseId: 'abbundzeichen-fundbuch',
  },
  {
    id: 'construction-thermal-sim-browser',
    theme: 'construction',
    fieldDe: 'Raum-Wärmebedarf, Taupunkt & Sommer-Überhitzung im Browser',
    fieldEn: 'Altbau Room Thermal Demand, Dew Point & Overheating in Browser',
    fieldEs: 'Demanda térmica de edificios antiguos, punto de rocío y sobrecalentamiento',
    status: 'verengt',
    evidenceDe: 'ubakus „Thermische Simulation 2.0" deckt Tabellen-Gebäudezonen ab. SchimmelScan/Silberkraft haben SEO besetzt. Frei bleibt: Schimmel-Eckkanten (2D fRsi), A/B-Sanierungsunsicherheit und Zero-Cloud.',
    evidenceEn: 'ubakus "Thermal Simulation 2.0" covers tabular 1D zones. SEO dominated by SchimmelScan/Silberkraft. Free gap: 2D fRsi thermal bridge corners, parametric uncertainty curves and zero-cloud execution.',
    round: 'Runde 1 & Rechecks',
    linkedDoseId: 'altbau-thermal',
  },
  {
    id: 'construction-firewood-measurement',
    theme: 'construction',
    fieldDe: 'Brennholz für Verbraucher (Volumen per Foto, Trocknungsrechner)',
    fieldEn: 'Consumer Firewood (Volume from stack photo & drying estimation)',
    fieldEs: 'Leña para consumidores (volumen por foto y secado)',
    status: 'dicht_kommerziell',
    evidenceDe: 'Firewood Identifier AI (Stack-Modus 2026), Timberlog PhotoMeasure, Timbeter (B2B). Restlücke nur normgerechte Restfeuchte-Berechnung beim Kauf.',
    evidenceEn: 'Firewood Identifier AI (stack mode 2026), Timberlog PhotoMeasure, Timbeter (B2B). Only remaining gap is purchase-time moisture compliance check.',
    round: 'Holz-Runde',
  },
  {
    id: 'construction-fractography-education',
    theme: 'construction',
    fieldDe: 'Fraktografie-Ausbildung (Bruchflächen von Glas & Keramik lesen)',
    fieldEn: 'Fractography Training (Reading fracture surfaces of glass, ceramics & forensic materials)',
    fieldEs: 'Entrenamiento de fractografía (análisis de superficies de rotura en vidrio y cerámica)',
    status: 'verengt',
    evidenceDe: 'Präsenzkurse am Belegstück (BAM, Gerresheimer, American Glass Research). FractoDB hat Tausende Referenzbilder (metalllastig), bietet aber keine interaktive Übungs-Engine.',
    evidenceEn: 'In-person classroom training with reference samples (BAM, Gerresheimer, American Glass Research). FractoDB holds reference photos (metal-focused) but offers no interactive training engine.',
    round: 'Runde 8',
    linkedDoseId: 'bruchlesen',
  },
  {
    id: 'construction-physical-inspection-ai-pattern',
    theme: 'construction',
    fieldDe: 'Physisches Objekt + wiederkehrende gesetzliche Prüfpflicht + KI',
    fieldEn: 'Physical Asset + Statutory Recurring Inspection Duty + AI (Tree cadastre, playgrounds, lifts)',
    fieldEs: 'Activo físico + inspección legal periódica + IA (arbolado, ascensores, juegos)',
    status: 'dicht_kommerziell',
    evidenceDe: 'Baumplaketten.de, BaumDex, Baumsicht, CheckTrees, TreeTect, PlanRadar, firstaudit. Ganze Software-Branchen existieren bereits für Spielplätze (DIN 1176), Aufzüge, Bäume.',
    evidenceEn: 'Baumplaketten.de, BaumDex, Baumsicht, CheckTrees, TreeTect, PlanRadar, firstaudit. Deep commercial SaaS industries already exist for playground checks (DIN 1176), lifts, municipal trees.',
    lessonDe: 'Muster „Objekt + gesetzliche Prüfung + KI" ist fast immer komplett durchbaut. Zuerst B2B-Inspektions-SaaS suchen.',
    lessonEn: 'The pattern "Physical asset + recurring regulatory inspection + AI" is almost always saturated by B2B SaaS. Pre-filter it.',
    round: 'Runde 3 & Atlas-Faustregel',
  },

  // --- RECHT, REGISTER & OFFENLEGUNGEN ---
  {
    id: 'compliance-disclosure-without-register-espr',
    theme: 'compliance',
    fieldDe: 'Offenlegungspflicht ohne Register: Vernichtete Konsumgüter (ESPR Art. 24 / DVO 2026/2)',
    fieldEn: 'Disclosure Duty Without Central Register: Destroyed Unsold Goods (ESPR Art. 24 / DVO 2026/2)',
    fieldEs: 'Obligación de divulgación sin registro: Destrucción de bienes no vendidos (ESPR Art. 24)',
    status: 'frei',
    evidenceDe: 'Unternehmen müssen Vernichtungsquoten auf ihrer Website publizieren, kein EU-Register sammelt sie. Offenes Register mit deterministischem Anhang-I-Prüfer, der nie unzulässig sagt.',
    evidenceEn: 'Corporations must disclose destroyed goods on their private websites, but no EU registry collects them. Open registry with deterministic Annex-I schema validator that never declares false violations.',
    lessonDe: 'Frei nur, wenn 3 Pflichtfragen erfüllt sind: Pflicht bedingt, Nenner/Startliste vorhanden, keine existierende Behördensammelstelle.',
    lessonEn: 'Open only if 3 mandatory gatekeeper questions pass: conditional duty, clear denominator list, no official reporting collector named in law.',
    round: 'ESPR-Teamrunde (28.09.2026)',
    linkedDoseId: 'vernichtungs-offenlegungsregister',
  },
  {
    id: 'compliance-energy-efficiency-plans-enefg',
    theme: 'compliance',
    fieldDe: 'Offenlegungspflicht ohne Register: Energieeffizienz-Umsetzungspläne (§ 9 EnEfG)',
    fieldEn: 'Disclosure Duty Without Register: Energy Efficiency Implementation Plans (§ 9 EnEfG)',
    fieldEs: 'Divulgación sin registro: Planes de eficiencia energética (§ 9 EnEfG)',
    status: 'frei',
    evidenceDe: 'Große Betriebe (> 7,5 GWh/a) müssen Pläne nach BAFA-Muster (5 Pflichtangaben) veröffentlichen. EED Art. 11 Abs. 2 sichert die Publizität, aber Bund hat kein Register gebaut.',
    evidenceEn: 'Companies (> 7.5 GWh/yr) must publish energy efficiency implementation plans matching BAFA template (5 mandatory fields). EED Art. 11(2) mandates publicity, but federal government built no central portal.',
    round: 'Offenlegungs-Runde Lauf A (28.09.2026)',
    linkedDoseId: 'umsetzungsplan-register',
  },
  {
    id: 'compliance-ai-act-training-data-summaries',
    theme: 'compliance',
    fieldDe: 'KI-Trainingsdaten-Zusammenfassungen (AI Act Art. 53 Abs. 1 lit. d)',
    fieldEn: 'AI Act Training Data Summaries (AI Act Art. 53(1)(d))',
    fieldEs: 'Resúmenes de datos de entrenamiento bajo la Ley de IA (Art. 53(1)(d))',
    status: 'dicht_forschung',
    evidenceDe: 'gpailedger.com (124 Modelle, 31 Anbieter, tägliche Versionierung, CC0-Metadaten); FAccT-2026-Paper zur Qualität bereits publiziert.',
    evidenceEn: 'gpailedger.com (124 models, 31 providers, daily git versioning, CC0 metadata); FAccT 2026 academic paper already published.',
    lessonDe: 'Wo Forschungsgruppen direkt von den Forschungsdaten leben (z.B. AI Act, Tax Transparency), wird das Register binnen Wochen akademisch gebaut.',
    lessonEn: 'Where academic researchers live on the publication data (e.g. AI Act, Tax Transparency), an academic registry is launched within weeks.',
    round: 'Offenlegungs-Runde',
  },
  {
    id: 'compliance-accessibility-bfsg-shop-audits',
    theme: 'compliance',
    fieldDe: 'BFSG Barrierefreiheitserklärungen von Online-Shops prüfen',
    fieldEn: 'European Accessibility Act (BFSG) Web Shop Compliance Audits',
    fieldEs: 'Auditorías de accesibilidad en tiendas online bajo la Ley de Accesibilidad',
    status: 'dicht_kommerziell',
    evidenceDe: 'DataPulse (2.446 Shops gescannt), mindshape (1.000 Websites), dutzende Agenturen; MLBF-Meldeportal nach § 32 BFSG beim BMAS.',
    evidenceEn: 'DataPulse (2,446 shops scanned), mindshape (1,000 websites), dozens of SEO agencies; MLBF reporting portal under § 32 BFSG at federal ministry.',
    round: 'Offenlegungs-Runde',
  },
  {
    id: 'compliance-municipal-heat-transition-plans',
    theme: 'compliance',
    fieldDe: 'Kommunale Wärmepläne (WPG)',
    fieldEn: 'Municipal Heating Transition Plans (WPG / KWW)',
    fieldEs: 'Planes municipales de transición térmica',
    status: 'beim_empfaenger',
    evidenceDe: 'KWW-Wärmewendeatlas (Halle) bietet alle kommunalen Pläne als Download mit Energiemix-Diagrammen; dena-Übersicht.',
    evidenceEn: 'KWW Heat Transition Atlas (Halle) offers all municipal plans with download and energy mix charts; federal dena overview.',
    lessonDe: 'Regime mit höchster politischer Aufmerksamkeit bekommen binnen Monaten ein staatliches Portal. Gehört in den Atlas, nicht in eine Amélie-Runde.',
    lessonEn: 'Regimes with massive political attention receive state portals within months. Belongs in the saturation atlas as a pre-filter.',
    round: 'Offenlegungs-Runde',
  },

  // --- STADT, MIETER & KREISLAUFWIRTSCHAFT ---
  {
    id: 'urban-bulky-waste-upstream-sorting',
    theme: 'urban',
    fieldDe: 'Wiederverwendung im kommunalen Entsorgungsprozess (Sperrmüll-Weiche vor Abholung)',
    fieldEn: 'Bulky Waste Upstream Reuse Triage (Prior to curbside collection)',
    fieldEs: 'Reutilización en la recogida de residuos voluminosos (antes de la recogida)',
    status: 'frei',
    evidenceDe: 'BSR-Buchung und Re-Use/NochMall sind getrennt. UK-Modelle (Somerset/BHF) triagieren erst im Depot. Vor-Ort-Foto-Triage am Gehweg vor der Entsorgung ist unbesetzt.',
    evidenceEn: 'Municipal disposal booking and reuse platforms are disconnected. UK models triage only downstream in depots. Client-side curbside pre-collection triage is unserved.',
    round: 'Runde 8',
    linkedDoseId: 'sperrmuell-weiche',
  },
  {
    id: 'urban-tenant-mold-and-defects',
    theme: 'urban',
    fieldDe: 'Mieter-Tools (Mängelanzeigen, Schimmelberechnung, Nebenkosten)',
    fieldEn: 'Tenant Tools (Defect notices, mold calculators, utility bill checks)',
    fieldEs: 'Herramientas para inquilinos (notificación de defectos, cálculo de moho)',
    status: 'dicht_kommerziell',
    evidenceDe: 'Miet-Akte, SchimmelScan, MietKlar, Conny, Mieterengel haben den Markt mit bezahlter Suchmaschinenwerbung voll besetzt.',
    evidenceEn: 'Miet-Akte, SchimmelScan, MietKlar, Conny, Mieterengel heavily dominate the consumer search funnel with paid acquisition.',
    lessonDe: 'Verbraucher-Briefgeneratoren und Mängel-Tools sind extrem dicht. Nicht mehr suchen.',
    lessonEn: 'Consumer complaint letter generators and tenant calculators are heavily saturated. Stop searching here.',
    round: 'Runde 2 & Atlas',
  },
  {
    id: 'urban-heat-and-shadow-routing',
    theme: 'urban',
    fieldDe: 'Hitze- & Schatten-Routing für Fußgänger',
    fieldEn: 'Urban Heat & Shade Routing for Pedestrians',
    fieldEs: 'Rutas a la sombra y mapas de calor urbano',
    status: 'dicht_forschung',
    evidenceDe: 'HEAL / shaded.ors (Universität Heidelberg), Shadowmap, Berliner Kühle-Orte-Karten decken das Thema mit LiDAR und Sonnenstandsdaten ab.',
    evidenceEn: 'HEAL / shaded.ors (Heidelberg University), Shadowmap, Berlin Cool Places maps cover this via high-res LiDAR and solar ephemeris.',
    round: 'Runde 2',
  },
  {
    id: 'urban-balcony-solar-simulators',
    theme: 'urban',
    fieldDe: 'Balkonsolar-Planung & Ertragsrechner',
    fieldEn: 'Balcony Solar PV Planning & Shading Simulators',
    fieldEs: 'Planificación y simuladores solares para balcones',
    status: 'dicht',
    evidenceDe: 'Horisol (Juli 2026, browserbasierte 3D-Verschattung), HTW-Berlin Stecker-Solar-Simulator, PVGIS.',
    evidenceEn: 'Horisol (July 2026, browser-based 3D shading raycaster), HTW Berlin Plug-in Solar Simulator, PVGIS.',
    round: 'Runde 2',
  },

  // --- KULTURERBE, ARCHIVE & DIALEKTE ---
  {
    id: 'heritage-street-name-phonetics',
    theme: 'heritage',
    fieldDe: 'Straßennamen-Ähnlichkeitsprüfer (Kölner Phonetik & Grundwort-Doppelung)',
    fieldEn: 'Street Name Phonetic & Duplicate Collision Checker (Cologne phonetics & morphology)',
    fieldEs: 'Comprobador fonético de nombres de calles y colisiones morfológicas',
    status: 'frei',
    evidenceDe: 'Kataster- und Vermessungsämter prüfen Straßennamen bei Neubaugebieten manuell. OSM-Tools zeigen nur Etymologie. Deterministischer Ähnlichkeitsprüfer ohne Zensur-Urteil war frei.',
    evidenceEn: 'Surveying and municipal naming boards audit new street names manually. Existing OSM tools only provide etymology. Deterministic phonetic clash detector with zero false bans was open.',
    round: 'Heimatgedächtnis-Runde (29.09.2026)',
    linkedDoseId: 'strassennamen-pruefer',
  },
  {
    id: 'heritage-smartphone-rti-sandstone',
    theme: 'heritage',
    fieldDe: 'Kulturerbe-Physik: Smartphone-RTI & Streiflicht-Relief an verwittertem Sandstein',
    fieldEn: 'Cultural Heritage Physics: Smartphone RTI & Grazing Light Relief for Weathered Epigraphy',
    fieldEs: 'Física del patrimonio: RTI con smartphone y relieve con luz rasante',
    status: 'frei',
    evidenceDe: 'Smartphone-RTI existiert nur als akademische Paper (arXiv/ECCV). CompGen und Archive klagen über Halluzinationen von Vision-LLMs bei verwitterter Schrift. Bilddifferenz-Verfahren als Web-App frei.',
    evidenceEn: 'Smartphone RTI only exists as academic research papers. Genealogy archives report severe Vision-LLM hallucinations on eroded stone. Difference-relief web tool was completely unserved.',
    round: 'Runde 2',
    linkedDoseId: 'smartphone-streiflicht-relief',
  },
  {
    id: 'heritage-dialect-and-speech-apps',
    theme: 'heritage',
    fieldDe: 'Dialekt-Karten, Mundart-Quiz & Sprachaufnahmen',
    fieldEn: 'Dialect Maps, Regional Idiom Quizzes & Audio Crowdsourcing',
    fieldEs: 'Mapas de dialectos, cuestionarios lingüísticos y grabaciones',
    status: 'dicht',
    evidenceDe: 'Dialäkt Äpp, DialektDetect, DICLA, AdA, OeDA Salzburg, dialektatlas.ch, „Grüezi, Moin, Servus". Stark besetzt.',
    evidenceEn: 'Dialäkt Äpp, DialektDetect, DICLA, AdA, OeDA Salzburg, dialektatlas.ch, "Grüezi, Moin, Servus". Saturated by linguistics institutes.',
    round: 'Heimatgedächtnis-Runde',
  },
  {
    id: 'heritage-historical-monument-deterioration-tracker',
    theme: 'heritage',
    fieldDe: 'Denkmale: Ehrenamtlicher Verlaufsblick & Früherkennung von Fassadenschäden',
    fieldEn: 'Historical Monuments: Longitudinal Volunteer Deterioration Tracking',
    fieldEs: 'Monumentos históricos: seguimiento longitudinal de deterioro por voluntarios',
    status: 'frei',
    evidenceDe: 'Profi-Bausoftware (Metigo MAP, ARCHIKART) ist B2B-lastig. DSD-Schwarzbuch meldet nur abgeschlossene Schäden. Laien-Wiederholungsfotos mit automatischer Differenz-Perspektive sind frei.',
    evidenceEn: 'Professional heritage mapping (Metigo MAP, ARCHIKART) is closed B2B software. DSD reporting portals are retrospective. Regular volunteer comparison photos with perspective alignment remain open.',
    round: 'Runde 4',
    linkedDoseId: 'denkmal-verlaufsblick',
  },

  // --- GESUNDHEIT, WASSER & LÄRM ---
  {
    id: 'health-water-lead-pipe-ban-identification',
    theme: 'health_water',
    fieldDe: 'Trinkwasserschutz & Bleirohrverbot (TrinkwV § 17 Stichtag 12.01.2026)',
    fieldEn: 'Drinking Water Safety & Lead Pipe Ban (German TrinkwV § 17 Stichtag Jan 2026)',
    fieldEs: 'Seguridad del agua potable y prohibición de tuberías de plomo',
    status: 'verengt',
    evidenceDe: 'Gesundheitsämter stellen statische Meldeformulare bereit; vzbv informiert mit Texten. Lücke: Zerstörungsfreie Materialidentifikation vor Ort (Magnet + Lötnaht-Makro + Klopfton) mit automatischer Anzeige.',
    evidenceEn: 'Health authorities offer static submission PDFs; consumer associations provide text guides. Free gap: Non-destructive in-situ pipe verification (magnet + soldered seam macro + acoustic tap pitch) with automated notice.',
    round: 'Inversion Run 2 (25.09.2026)',
    linkedDoseId: 'bleifrei-lotse',
  },
  {
    id: 'health-water-legionella-notice-ocr',
    theme: 'health_water',
    fieldDe: 'Legionellen-Befundauswertung & Aushangs-Transparenz (TrinkwV § 31/52)',
    fieldEn: 'Legionella Building Notice OCR & Threshold Classification (TrinkwV § 31/52)',
    fieldEs: 'OCR de avisos de legionela en edificios y clasificación según normativa',
    status: 'verengt',
    evidenceDe: 'Vermieter-Software ist B2B; Portale verlangen manuelle Zahleneingabe. Lücke: Datenschutzfreundliche On-Device-OCR für Treppenhaus-Aushänge mit UBA-Klassifikation und BGB-Mängelanzeige.',
    evidenceEn: 'Property manager tools are closed B2B; portals require manual number typing. Free gap: Privacy-first on-device OCR for hallway notice boards with federal UBA threshold classification.',
    round: 'Inversion Run 2',
  },
  {
    id: 'health-urban-noise-temporal-quiet-windows',
    theme: 'health_water',
    fieldDe: 'Städtischer Lärm: Ruhefenster-Berechnung statt Jahresmittelwerten',
    fieldEn: 'Urban Noise: Temporal Quiet Windows instead of Annual Average dB Maps',
    fieldEs: 'Ruido urbano: cálculo de ventanas de silencio temporal',
    status: 'verengt',
    evidenceDe: 'Hush City kartiert ruhige Orte räumlich; NoiseCapture misst Pegel. Offizielle Lärmkarten zeigen nur Jahresmittel Lden. Frei: Berechnung der exakten Tageszeiten mit < 45 dB für Stoßlüften und Schlaf.',
    evidenceEn: 'Hush City maps quiet locations spatially; NoiseCapture records raw decibels. Official EU noise maps only output annual Lden averages. Open: Calculating exact time windows with < 45 dB for ventilation & sleep.',
    round: 'Runde 2 & 4',
    linkedDoseId: 'laerm-ruhefenster',
  },
  {
    id: 'health-pill-identification-cameras',
    theme: 'health_water',
    fieldDe: 'Pillen per Smartphone-Foto bestimmen & Medikationsplan (BMP) scannen',
    fieldEn: 'Pill Identification via Camera & Medication Plan QR Scan',
    fieldEs: 'Identificación de pastillas por foto y escaneo del plan de medicación',
    status: 'dicht',
    evidenceDe: 'Smart Pill ID, PillPal, AI Pill Identifier, MyTherapy, gesund.de lesen BMP-QR. Zudem arzneimittelrechtliche Haftungsrisiken (Medizinprodukt).',
    evidenceEn: 'Smart Pill ID, PillPal, AI Pill Identifier, MyTherapy, gesund.de scan medication barcodes. Severe medical device regulatory liability.',
    round: 'Recheck 24.09.2026',
  },

  // --- DEV-TOOLS, FORSCHUNG & AGENTEN ---
  {
    id: 'dev-mcp-git-tooling',
    theme: 'dev_ai',
    fieldDe: 'Entwickler-Werkzeuge, MCP-Server & Git-Archäologie',
    fieldEn: 'Developer Tooling, MCP Servers & Git Archaeology',
    fieldEs: 'Herramientas de desarrollo, servidores MCP y arqueología de Git',
    status: 'dicht',
    evidenceDe: 'git-archaeologist, Home-Network MCP, hunderte Open-Source-Repos. Die Entwickler-Community baut Dev-Tools innerhalb von Tagen selbst.',
    evidenceEn: 'git-archaeologist, Home-Network MCP, hundreds of community repos. Developer ecosystem builds dev tools within days.',
    lessonDe: 'Dev-Tools und MCP-Server haben ein extrem kurzes Zeitfenster (< 6 Wochen). Nur selten als nachhaltiges Geschenk geeignet.',
    lessonEn: 'Dev tools and MCP servers have an extremely short innovation window (< 6 weeks). Rarely suitable for long-term CC0 public domain gifts.',
    round: 'Runde 1 & 2',
  },
  {
    id: 'dev-dependency-upgrade-breaking-changes',
    theme: 'dev_ai',
    fieldDe: 'Dependency-Upgrade-Analyse (Changelog ∩ eigene Code-Nutzung)',
    fieldEn: 'Dependency Upgrade Impact Analysis (Changelog ∩ AST code usage)',
    fieldEs: 'Análisis de impacto de actualización de dependencias',
    status: 'dicht_kommerziell',
    evidenceDe: 'Aikido „Upgrade impact analysis" scannt Codebasen nach Library-Symbolen (7+ Sprachen); Endor Labs UIA.',
    evidenceEn: 'Aikido "Upgrade impact analysis" scans AST usage against CVE & changelog symbols; Endor Labs UIA.',
    round: 'Runde 3 Recheck',
  },
  {
    id: 'dev-local-voice-keyword-spotting',
    theme: 'dev_ai',
    fieldDe: 'Offline-Schlüsselworterkennung & Schimpfwort-Detektor am Küchentisch',
    fieldEn: 'Offline Keyword Spotting & Table Swear Alarm (Zero Cloud Privacy)',
    fieldEs: 'Detección de palabras clave offline y alarma en mesa sin nube',
    status: 'dicht',
    evidenceDe: 'Noche de Paz (2015), JarGone, Swearing Jar (App Store 2025). sherpa-onnx und Vosk bieten die Bausteine frei an.',
    evidenceEn: 'Noche de Paz (2015 advertising campaign), JarGone, Swearing Jar (App Store 2025). sherpa-onnx and Vosk provide the underlying libraries.',
    round: 'Runde 9',
  },
];

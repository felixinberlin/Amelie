import { PlaybookThemeId } from './atlasData';

export interface AnchorFrame {
  id: string;
  theme: PlaybookThemeId;
  orgDe: string;
  orgEn: string;
  titleDe: string;
  titleEn: string;
  problemDe: string;
  problemEn: string;
  mandateHolderDe: string;
  mandateHolderEn: string;
}

export interface ColliderFrame {
  id: string;
  theme: PlaybookThemeId;
  titleDe: string;
  titleEn: string;
  techDe: string;
  techEn: string;
  whyZeroCostDe: string;
  whyZeroCostEn: string;
}

export const ANCHOR_FRAMES: AnchorFrame[] = [
  {
    id: 'anchor-thuenen-bees',
    theme: 'nature',
    orgDe: 'Thünen-Institut / MonViA',
    orgEn: 'Thünen Institute for Biodiversity / MonViA',
    titleDe: 'Wildbienen-Nisthilfen Monitoring-Flaschenhals',
    titleEn: 'Wild Bee Nesting Box Analysis Bottleneck',
    problemDe: 'Freiwillige schicken tausende Fotos von Niströhren. Entomologen prüfen 90 Minuten manuell pro Nistblock.',
    problemEn: 'Volunteers submit thousands of nesting hole photos. Entomologists spend 90 mins manually per board.',
    mandateHolderDe: 'Dr. Jens Dauber (Leiter Institut für Biodiversität)',
    mandateHolderEn: 'Dr. Jens Dauber (Head of Biodiversity Institute)',
  },
  {
    id: 'anchor-nabu-vsw-birds',
    theme: 'nature',
    orgDe: 'LAG Vogelschutzwarten / NABU',
    orgEn: 'State Bird Protection Centers / NABU',
    titleDe: 'Vogelschlag an Glasfassaden & Bauprüfungen',
    titleEn: 'Architectural Bird Glass Strike Hazard Audit',
    problemDe: 'Offizieller Prüfleitfaden für Vogelschlag existiert nur als 30-Seiten PDF. Bauämter rechnen mühsam per Hand.',
    problemEn: 'Official bird collision testing guide exists only as a 30-page PDF document. Planning officers calculate manually.',
    mandateHolderDe: 'Dr. Martin Böttcher (LAG Vogelschutzwarten)',
    mandateHolderEn: 'Dr. Martin Böttcher (Bird Conservation Center)',
  },
  {
    id: 'anchor-igb-timber-frames',
    theme: 'construction',
    orgDe: 'Interessengemeinschaft Bauernhaus (IgB)',
    orgEn: 'Historic Farmhouse & Timber Preservation Guild (IgB)',
    titleDe: 'Fachwerk-Abbundzeichen & Kerbmarken-Syntax',
    titleEn: 'Timber Framing Joinery & Chisel Mark Syntax',
    problemDe: 'Eigentümer und Bauforscher finden Rötel- und Kerbzeichen, können die Zählfolge der Holzverbindungen aber nicht zuordnen.',
    problemEn: 'Owners and architectural historians discover chisel marks on historical frames but lack syntax validation for numbering.',
    mandateHolderDe: 'Dr. Julia Ricker (Hausforschung & Bauberatung)',
    mandateHolderEn: 'Dr. Julia Ricker (Building Archaeology & Advice)',
  },
  {
    id: 'anchor-deneff-energy-plans',
    theme: 'compliance',
    orgDe: 'DENEFF (Deutsche Unternehmensinitiative Energieeffizienz)',
    orgEn: 'DENEFF (German Corporate Energy Efficiency Initiative)',
    titleDe: 'EnEfG § 9 Umsetzungspläne ohne Bundesregister',
    titleEn: 'Energy Efficiency § 9 Corporate Plan Registry Gap',
    problemDe: 'Konzerne veröffentlichen ihre Umsetzungspläne auf verstreuten Unterseiten, BAFA führt kein öffentliches Register.',
    problemEn: 'Corporations publish required energy plans on disparate subpages; the federal agency hosts zero public register.',
    mandateHolderDe: 'Christian Noll (Geschäftsführender Vorstand)',
    mandateHolderEn: 'Christian Noll (Managing Director)',
  },
  {
    id: 'anchor-duh-espr-goods',
    theme: 'compliance',
    orgDe: 'Deutsche Umwelthilfe (DUH Kreislaufwirtschaft)',
    orgEn: 'Environmental Action Germany (DUH Circular Economy)',
    titleDe: 'Vernichtung unverkaufter Ware (ESPR Art. 24)',
    titleEn: 'Destruction of Unsold Goods (ESPR Art. 24)',
    problemDe: 'Unternehmen legen Vernichtungsquoten in Nachhaltigkeitsberichten ab, zivilgesellschaftliche NGOs müssen hunderte PDFs durchsuchen.',
    problemEn: 'Companies bury destruction quotas deep in ESG reports; civic watchdogs must crawl hundreds of PDFs by hand.',
    mandateHolderDe: 'Thomas Fischer (Leiter Kreislaufwirtschaft)',
    mandateHolderEn: 'Thomas Fischer (Head of Circular Economy)',
  },
  {
    id: 'anchor-compgen-sandstone',
    theme: 'heritage',
    orgDe: 'CompGen e.V. (Verein für Computergenealogie)',
    orgEn: 'Computer Genealogy Association (CompGen)',
    titleDe: 'Verwitterte Grabstein-Inschriften & Relief',
    titleEn: 'Eroded Tombstone Epigraphy & Historical Sandstone',
    problemDe: 'Generische Vision-LLMs halluzinieren Buchstaben bei Moos und Verwitterung auf historischem Sandstein.',
    problemEn: 'Vision LLMs hallucinate fictional names and dates when processing weathered historical sandstone.',
    mandateHolderDe: 'Dr. Günter Junkers (Vorstand CompGen)',
    mandateHolderEn: 'Dr. Günter Junkers (CompGen Executive Board)',
  },
  {
    id: 'anchor-surveying-street-names',
    theme: 'heritage',
    orgDe: 'Vermessungs- und Katasteramt / Namensbeirat',
    orgEn: 'Municipal Cadastre & Street Naming Committee',
    titleDe: 'Straßennamen-Phonetik & Rettungsdienst-Kollision',
    titleEn: 'Street Name Phonetic Clash in Emergency Dispatch',
    problemDe: 'Bei Neubaugebieten werden ähnliche Straßennamen vergeben, die bei Notrufen phonetisch verwechselt werden.',
    problemEn: 'New urban developments receive similarly sounding street names that cause fatal confusion in emergency dispatch.',
    mandateHolderDe: 'Leitung Geoinformation & Vermessungswesen',
    mandateHolderEn: 'Head of Municipal Geoinformation & Surveying',
  },
  {
    id: 'anchor-bsr-bulky-waste',
    theme: 'urban',
    orgDe: 'BSR / Re-Use Berlin',
    orgEn: 'BSR Berlin Waste Management / Re-Use Berlin',
    titleDe: 'Sperrmüll-Vorsortierung vor dem Müllwagen',
    titleEn: 'Curbside Bulky Waste Upstream Reuse Triage',
    problemDe: 'Wiederverwendbare Massivholzmöbel werden am Gehsteig mit Schadstoffmüll vermischt und im Presswagen zerkleinert.',
    problemEn: 'High-value solid wood furniture gets crushed in compactor trucks because curbside triage is disconnected.',
    mandateHolderDe: 'Referat Re-Use und Zero-Waste Strategie',
    mandateHolderEn: 'Unit for Re-Use and Zero-Waste Strategy',
  },
  {
    id: 'anchor-vzbv-lead-pipes',
    theme: 'health_water',
    orgDe: 'Verbraucherzentrale Bundesverband (vzbv)',
    orgEn: 'Federation of German Consumer Organisations (vzbv)',
    titleDe: 'Bleirohrverbot-Stichtag & Nachweispflicht',
    titleEn: 'Drinking Water Lead Pipe Prohibition Deadline',
    problemDe: 'Mieter und Hausbesitzer wissen nicht, wie sie Bleileitungen zerstörungsfrei und ohne teures Labor erkennen können.',
    problemEn: 'Tenants and home owners cannot verify lead service lines without destructive testing or costly lab fees.',
    mandateHolderDe: 'Team Bauen, Wohnen & Energie',
    mandateHolderEn: 'Building, Housing & Energy Division',
  },
  {
    id: 'anchor-citylab-urban-noise',
    theme: 'health_water',
    orgDe: 'CityLAB Berlin / Noise-Planet',
    orgEn: 'CityLAB Berlin / Noise-Planet Foundation',
    titleDe: 'Städtische Ruhefenster & Schlafqualitäts-Zonen',
    titleEn: 'Urban Quiet Windows & Window Ventilation Times',
    problemDe: 'Lärmkarten liefern nur statische Jahresmittelwerte. Anwohner benötigen stündliche Ruhefenster zum Lüften.',
    problemEn: 'Official noise maps only calculate annual averages. Residents need hourly quiet windows for sleep and ventilation.',
    mandateHolderDe: 'Projektleitung Smart City & Open Data',
    mandateHolderEn: 'Lead Smart City & Open Data Initiatives',
  },
];

export const COLLIDER_FRAMES: ColliderFrame[] = [
  {
    id: 'collider-smartphone-rti',
    theme: 'heritage',
    titleDe: 'Smartphone-RTI & Streiflicht-Differenz',
    titleEn: 'Smartphone Grazing Light RTI & Shadow Subtraction',
    techDe: 'Handy-Taschenlampe flach anhalten (5°–15°), 3 Fotos, Bilddifferenz erzeugt messbare Reliefschatten.',
    techEn: 'Hold phone flashlight flat at grazing angle (5°–15°), 3 photos, relief subtraction reveals incisions.',
    whyZeroCostDe: 'Reine Web-Canvas-Bilddifferenz im Browser, keine GPU-Server.',
    whyZeroCostEn: 'Pure client-side Web Canvas subtraction, zero cloud servers.',
  },
  {
    id: 'collider-deterministic-math',
    theme: 'construction',
    titleDe: 'Deterministischer Formelrechner (No-AI / Client-Side)',
    titleEn: 'Deterministic Formula Calculator (No-AI / Client-Side)',
    techDe: 'Reine Web-Oberfläche, direkte Anwendung des PDF-Punktesystems mit Schiebereglern ohne Halluzinationsrisiko.',
    techEn: 'Pure client-side UI, direct computation of regulatory points with sliders and zero hallucination risk.',
    whyZeroCostDe: '100 % offlinefähig auf GitHub Pages, null Cent Betriebskosten.',
    whyZeroCostEn: '100% offline-ready on GitHub Pages, zero operating cost.',
  },
  {
    id: 'collider-bounding-contrast',
    theme: 'nature',
    titleDe: 'Regelbasierter Kontrastfilter vor KI-Inferenz',
    titleEn: 'Rule-Based Contrast Filter Before AI Inference',
    techDe: 'Leere Röhren (95%) per Kontrast verwerfen. Nur belegte Röhren an Mensch oder Modell weiterreichen.',
    techEn: 'Discard empty nesting holes (95%) by contrast threshold. Only feed occupied holes to human experts.',
    whyZeroCostDe: 'Reduziert Inferenz- oder Expertenaufwand um 95 %.',
    whyZeroCostEn: 'Reduces expert human or inference review workload by 95%.',
  },
  {
    id: 'collider-privacy-db-histogram',
    theme: 'health_water',
    titleDe: 'Datensparsame dB-Aggregation am Gerät',
    titleEn: 'Privacy-First On-Device Decibel Aggregation',
    techDe: 'Mikrofon misst ausschließlich Pegelwerte, niemals Audiosignale. Daten verlassen Gerät nur als Histogramm.',
    techEn: 'Microphone only samples numeric decibels, never raw audio. Leaves device as anonymous aggregated histograms.',
    whyZeroCostDe: 'Keine DSGVO-Probleme, keine Audio-Speicherinfrastruktur.',
    whyZeroCostEn: 'Zero GDPR audio liability, zero cloud storage infrastructure.',
  },
  {
    id: 'collider-cologne-phonetics',
    theme: 'heritage',
    titleDe: 'Kölner Phonetik & Grundwort-Zerlegung',
    titleEn: 'Cologne Phonetics & Compound Word Parsing',
    techDe: 'Deterministischer Silben- und Klangcode-Abgleich (DIN 5007-2) gegen bestehende Katasterdaten.',
    techEn: 'Deterministic syllable and phonetic code comparison (DIN 5007-2) against existing cadastre datasets.',
    whyZeroCostDe: 'Läuft in Millisekunden komplett im Browser.',
    whyZeroCostEn: 'Executes within milliseconds entirely inside the browser.',
  },
  {
    id: 'collider-multi-criteria-physical-test',
    theme: 'health_water',
    titleDe: 'Multikriterielle Sensorlose Materialprobe',
    titleEn: 'Multi-Criteria Sensorless Physical Triad',
    techDe: 'Kombination aus Magnettest (Neodym), Makro-Wulstlötung-Foto und akustischem Klopfton (Resonanzfrequenz).',
    techEn: 'Triangulation of neodymium magnetic adhesion, soldered seam macro photo, and acoustic tap resonance frequency.',
    whyZeroCostDe: 'Nutzt Alltagsgegenstände und Standard-Handysensoren.',
    whyZeroCostEn: 'Leverages household tools and standard smartphone sensors.',
  },
  {
    id: 'collider-pdf-schema-validator',
    theme: 'compliance',
    titleDe: 'Client-Side PDF Text- & Schema-Prüfer',
    titleEn: 'Client-Side PDF Text & Schema Validator',
    techDe: 'Extrahiert Text im Browser (pdfjs), prüft Pflichtfelder nach amtlichem BAFA/EU-Schema und berechnet SHA-256.',
    techEn: 'Extracts PDF text client-side, audits mandatory schema fields against official templates and records SHA-256.',
    whyZeroCostDe: 'Keine Dokumentenübertragung an fremde Server, DSGVO-konform.',
    whyZeroCostEn: 'Zero document upload to external servers, strictly privacy-preserving.',
  },
  {
    id: 'collider-leave-one-out-spatial',
    theme: 'heritage',
    titleDe: 'Leave-One-Out H3-Geofeld-Kalibrierung',
    titleEn: 'Leave-One-Out Spatial H3 Hexagon Calibration',
    techDe: 'Nutzung von Hexagonalen H3-Kacheln mit kontinuierlichem Konfidenz-Scoring gegen historische Nachbarbelege.',
    techEn: 'Hexagonal H3 discrete global grid system with leave-one-out cross-validation against historic records.',
    whyZeroCostDe: 'Deterministische Geometrie ohne teure GIS-Datenbanken.',
    whyZeroCostEn: 'Deterministic spatial geometry without expensive server-side GIS engines.',
  },
];

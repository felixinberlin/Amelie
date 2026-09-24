import { CandidateIdea } from '../types';
import { ALL_NEW_CANDIDATE_IDEAS } from './ideas';

const INITIAL_CANDIDATE_IDEAS: CandidateIdea[] = [
  {
    id: 'glasanflug-ampel',
    title: 'Glasanflug-Ampel',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Foto einer Glasfläche + Standort → Entwurf der LAG-VSW-Punktebewertung (Vogelschlag-Risiko an Glasfassaden).',
    conceptEn: 'Photo of glass facade + location → automatic estimation of the official LAG-VSW bird collision hazard score.',
    status: 'verengt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Runde 7 hat `frei` auf `verengt` korrigiert; als Dose gepackt und zugestellt.',
    suggestedVerdict: 'gift',
    recipientDe: 'LAG Vogelschutzwarten (vogelschutzwarten.de) · NABU Bundesfachausschuss Vogelschutz',
    recipientEn: 'Working Group of German Bird Protection Stations (LAG VSW) · NABU National Bird Protection Committee',
    sourceType: 'Typ A',
    sourceDe: 'LAG VSW 21/01 Bewertungsverfahren Vogelschlag an Glas (20-seitiges PDF-Schema ohne Software)',
    sourceEn: 'LAG VSW 21/01 assessment guideline on bird strikes on glass (20-page PDF rating sheet with no software)',
    evidenceDe: 'Punkteschema existiert als PDF (LAG VSW 21/01), kein digitales Werkzeug für Architekten oder Bauherren gefunden.',
    evidenceEn: 'Point scoring methodology exists as a standard PDF (LAG VSW 21/01); zero interactive calculation tools exist.',
    reviewDate: '09/2027',
    problemDe: 'Über 100 Millionen Vögel verenden jährlich an Glasflächen in Deutschland. Architekten kennen das 20-seitige Bewertungs-PDF der Vogelschutzwarten nicht oder berechnen Punktwerte von Scheiben, Spiegelungen und Umgebungsbewuchs fehlerhaft von Hand.',
    problemEn: 'Over 100 million birds die annually in Germany hitting reflective or transparent glass. Architects overlook the complex 20-page calculation standard or calculate reflection points erratically by hand.',
    whyNowDe: [
      'On-Device Computer Vision klassifiziert Glasreflexion und Umgebungsgrün zuverlässig aus zwei Smartphone-Fotos.',
      'Deterministisches Punkteschema lässt sich ohne Server direkt im Browser ausrechnen.',
      'Kommunen fordern zunehmend Vogelschutz-Nachweise bei Bauanträgen ein.'
    ],
    whyNowEn: [
      'On-device vision classifies glass reflection and surrounding foliage reliably from two photos.',
      'Deterministic point scheme calculates client-side in browser WebGL without servers.',
      'Municipalities increasingly demand bird safety compliance reports for building permits.'
    ],
    firstStepTicketDe: 'Foto-Upload + 4 Schieberegler berechnen LAG-VSW-Punktwert (0–100) mit Rot/Gelb/Grün Ampel',
    firstStepTicketEn: 'Photo upload + 4 sliders calculate LAG-VSW risk score (0-100) with traffic-light indicator',
    firstStepCriteriaDe: 'Fertig, wenn für ein Beispielfoto einer Glasbrüstung der berechnete Punktwert auf 5 Punkte genau dem Norm-PDF entspricht.',
    firstStepCriteriaEn: 'Done when a sample glass balcony photo produces a score matching the official norm PDF within 5 points.',
    tags: ['Artenschutz', 'Vogelschutz', 'PDF-Schema', 'Computer Vision', 'Architektur']
  },
  {
    id: 'brettchen-vorsortierer',
    title: 'Brettchen-Vorsortierer',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'KI-Vorannotation der Brutzellen auf MonViA-Nisthilfe-Fotos zur Entlastung von Wildbienen-Forschern.',
    conceptEn: 'AI pre-annotation of wild bee brood cells on MonViA nesting box monitoring photos.',
    status: 'frei',
    suggestedVerdict: 'gift',
    recipientDe: 'Thünen-Institut für Biodiversität (MonViA Wildbienen-Monitoring, Braunschweig)',
    recipientEn: 'Thünen Institute of Biodiversity (MonViA Wild Bee Monitoring, Braunschweig)',
    sourceType: 'Typ B',
    sourceDe: 'mitforschen.org / Thünen MonViA Monitoringbericht (manueller Engpass)',
    sourceEn: 'mitforschen.org / Thünen MonViA monitoring reports (manual evaluation bottleneck)',
    evidenceDe: 'Thünen wertet eingesendete Fotos manuell aus, bis zu 90 Min. pro Nisthilfe; keine KI-Auswertung oder Vor-Segmentierung erwähnt.',
    evidenceEn: 'Thünen Institute scientists spend up to 90 minutes per wooden nesting block manually counting tubes; zero automated assistance reported.',
    reviewDate: '09/2027',
    problemDe: 'Tausende engagierte Bürger fotografieren Wildbienen-Nisthilfen. Wissenschaftler am Thünen-Institut verbringen hunderte Arbeitsstunden mit manuellem Auszählen geschlossener, belegter und parasitierter Röhren. Ehrenamtliche warten Monate auf Rückmeldung.',
    problemEn: 'Thousands of citizen scientists photograph wooden nesting boards. Thünen researchers spend hundreds of manual hours counting filled and parasitized tubes. Volunteers wait months for confirmation.',
    whyNowDe: [
      'Kreis- & Röhrenerkennung (Circle Hough Transform + leichtes YOLO) segmentiert Brutzellen in Millisekunden.',
      'Automatischer Vorfilter spart 80% Klickarbeit für Forscher und gibt Bürgern Sofort-Feedback.',
      'Läuft datensparsam und lokal im Browser ohne Serverkosten.'
    ],
    whyNowEn: [
      'Tube circle detection (Hough transforms + lightweight YOLO) localizes holes in milliseconds.',
      'Pre-segmentation saves 80% of manual click labor and provides immediate volunteer validation.',
      'Runs privacy-first directly in browser with zero cloud server expenses.'
    ],
    firstStepTicketDe: 'Röhren-Segmentierung auf Testfoto mit Markierung: offen / belegt / parasitiert',
    firstStepTicketEn: 'Nesting tube segmentation on test photo marking: open / occupied / parasitized',
    firstStepCriteriaDe: 'Fertig, wenn auf einem 20-Loch-Brettchen mindestens 18 Röhren korrekt erkannt und der Verschlusstyp annotiert wird.',
    firstStepCriteriaEn: 'Done when on a 20-hole wooden block at least 18 tubes are accurately identified and status classified.',
    tags: ['Biodiversität', 'Wildbienen', 'Citizen Science', 'Thünen', 'Bildverarbeitung']
  },
  {
    id: 'streiflicht',
    title: 'Streiflicht',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Smartphone-RTI am Grabstein + Transkription, die unleserliche Stellen als Lücke markiert statt zu halluzinieren.',
    conceptEn: 'Smartphone Reflectance Transformation Imaging (RTI) on weathered gravestones + transcription flagging honest gaps.',
    status: 'verengt',
    suggestedVerdict: 'gift',
    recipientDe: 'CompGen (Verein für Computergenealogie e.V. / genealogy.net)',
    recipientEn: 'CompGen (Computer Genealogy Society Germany / genealogy.net)',
    sourceType: 'Typ C',
    sourceDe: 'CompGen-Werkstattbericht Mai 2026 (KI-Grenzen bei Verwitterung)',
    sourceEn: 'CompGen AI workshop report May 2026 (LLM hallucinations on weathered stone inscriptions)',
    evidenceDe: 'CompGen nutzt LLMs für Transkription, benennt Halluzination bei Verwitterung als Schwäche; Smartphone-RTI existiert nur als Forschungspaper (Ca\' Foscari, ECCVW 2022).',
    evidenceEn: 'CompGen uses LLMs for OCR, citing weathered hallucination as core vulnerability; mobile RTI exists only in academic papers (ECCVW 2022).',
    reviewDate: '09/2027',
    problemDe: 'Historische Grabsteine verwittern. Wenn Ehrenamtliche KI-Transkription nutzen, errät das LLM bei unleserlichen Zeichen plausible, aber falsche Namen und Jahreszahlen. Das kontaminiert genealogische Archive irreversibel.',
    problemEn: 'Historic stone markers erode over centuries. When volunteers use commercial OCR, models hallucinate plausible but false ancestral names and birth years, permanently polluting genealogical archives.',
    whyNowDe: [
      'Virtuelles Streiflicht (RTI aus 3–4 Handyfotos mit wanderndem Blitzwinkel) rekonstruiert mikroskopische Meißeltiefe.',
      'WebGL-Shader rendern interaktive Streiflicht-Beleuchtung flüssig im mobilen Browser.',
      'Gezielte Transkriptions-Constraints zwingen das Modell zu Konfidenz-Lücken ([?]), statt zu raten.'
    ],
    whyNowEn: [
      'Virtual grazing light (RTI from 3-4 smartphone flash angles) reconstructs microscopic chisel relief.',
      'WebGL shaders render interactive grazing illumination at 60 FPS in mobile browsers.',
      'Constrained output models force verifiable confidence gaps ([?]) rather than hallucinating.'
    ],
    firstStepTicketDe: 'Drei Fotos mit wanderndem Taschenlampenlicht als interaktive Normalenkarte rendern',
    firstStepTicketEn: 'Render three photos with moving light angle into an interactive WebGL normal map',
    firstStepCriteriaDe: 'Fertig, wenn Maus- oder Touchbewegung die scheinbare Lichtquelle über den Stein bewegt und flache Gravuren plastisch hervortreten.',
    firstStepCriteriaEn: 'Done when touching or dragging cursor sweeps the virtual sun across stone surface, highlighting faint engravings.',
    tags: ['Kulturerbe', 'Genealogie', 'RTI', 'WebGL-Shader', 'Archiv']
  },
  {
    id: 'bebauungsplan-leser',
    title: 'Bebauungsplan-Leser für Bürger',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Übersetzung von BauNVO-Kürzeln (GRZ, GFZ, II, B-Plan) in verständliche 3D-Baukörper und Einwendungs-Entwürfe.',
    conceptEn: 'Translation of municipal zoning codes (GRZ, GFZ, heights) into intuitive 3D massing and public comment drafts.',
    status: 'verengt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Recheck 19.09.2026 → `verengt` (DiPlanBeteiligung, Poliscope, InNoWest-Chatbot als Nachbarn).',
    suggestedVerdict: 'gift',
    recipientDe: 'Berliner Beteiligungsplattform (mein.berlin.de) · Mehr Demokratie e.V.',
    recipientEn: 'Berlin Civic Participation Portal (mein.berlin.de) · Democracy NGOs',
    sourceType: 'Typ A',
    sourceDe: 'Behörden-Beteiligungsplattformen & Bauleitplanung (Prüfung ausstehend)',
    sourceEn: 'Civic consultation portals & urban zoning procedures (inquiry pending)',
    evidenceDe: 'Bisherige Websuchen lieferten nur Content-Farmen (bau.de-Klone). Neu suchen mit Berliner Beteiligungsplattform und Stadtteil-Initiativen.',
    evidenceEn: 'Search yielded commercial SEO lead-generation sites. Needs targeted check against municipal civic participation tooling.',
    reviewDate: '12/2026',
    problemDe: 'Bebauungspläne liegen nur 30 Tage öffentlich aus. Kaum ein Bürger versteht GRZ 0.4, GFZ 1.2 oder Baulinien. Bürgerbeteiligung verpufft oft, weil Einwände erst formuliert werden, wenn die Bagger bereits rollen.',
    problemEn: 'Zoning plans are open for citizen input for only 30 days. Laypeople cannot parse floor-area ratios or setback lines, missing formal statutory objection deadlines.',
    whyNowDe: [
      'Offene XPlanung-Vektordaten und OpenStreetMap ermöglichen automatische 3D-Baukörper-Vorschauen im Browser.',
      'LLMs können Fachbegriffe des Baugesetzbuchs in verständliches Alltagsdeutsch übersetzen.'
    ],
    whyNowEn: [
      'Open XPlanung data and OpenStreetMap allow browser-based 3D volumetric preview.',
      'Local language models convert dense administrative planning jargon into plain speech.'
    ],
    firstStepTicketDe: 'XPlanung-Ausschnitt parsen und maximale Baukörperhöhe und Grundflächenzahl als 3D-Box visualisieren',
    firstStepTicketEn: 'Parse XPlanung parcel and visualize maximum building height and plot coverage as 3D envelope',
    firstStepCriteriaDe: 'Fertig, wenn für ein Testflurstück GRZ 0.4 und 3 Vollgeschosse als transparente 3D-Box auf einer OSM-Karte gezeichnet werden.',
    firstStepCriteriaEn: 'Done when a sample parcel with 0.4 coverage and 3 stories renders as transparent 3D boundary on map.',
    tags: ['Stadtplanung', 'Bürgerbeteiligung', 'XPlanung', 'Open Data']
  },
  {
    id: 'tafel-warenannahme',
    title: 'Tafel-Warenannahme per Foto',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Schnelle Erfassung von Mindesthaltbarkeitsdaten und Kisten-Kategorien bei Lebensmittelspenden an der Laderampe.',
    conceptEn: 'Rapid photo capture of best-before dates and crate categories at food bank loading docks.',
    status: 'besetzt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Recheck 18.09.2026 → `besetzt` („Tafel macht Zukunft", Fahrer-App mit Foto-Qualitätserfassung).',
    suggestedVerdict: 'discarded',
    recipientDe: 'Tafel Deutschland e.V. (Projekt Tafel Digital) · Lebensmittelretter',
    recipientEn: 'Tafel Deutschland (Food Bank Federation Germany) · Food Rescue NGOs',
    sourceType: 'Typ B',
    sourceDe: 'mitforschen / Ehrenamts-Logistikberichte',
    sourceEn: 'Volunteer logistics reports and food bank digitization plans',
    evidenceDe: 'Kein leichtes, offenes Werkzeug gefunden; Empfänger zuerst prüfen: Tafel Deutschland digital / Eco-Plattform.',
    evidenceEn: 'No lightweight open utility found; must first survey Tafel Deutschland digital roadmap to ensure zero overlap.',
    reviewDate: '12/2026',
    problemDe: 'Ehrenamtliche Lebensmittelretter erhalten Kisten voller Molkerei- und Trockenwaren mit unterschiedlichem MHD. Das händische Protokollieren dauert an der Rampe zu lange; vieles wird vorsorglich weggeworfen.',
    problemEn: 'Volunteers receive mixed boxes of perishables. Hand logging expiry dates takes too long on the dock, causing safe groceries to be discarded out of caution.',
    whyNowDe: [
      'On-Device OCR liest Datumsstempel auf gewölbten Verpackungen in Sekundenbruchteilen auch ohne Internet an der Laderampe.',
      'Einfache Offline-PWA benötigt keine Serverkosten für gemeinnützige Vereine.'
    ],
    whyNowEn: [
      'On-device OCR reads stamped dates on curved plastic lids in split seconds offline without connectivity.',
      'Lightweight offline PWA incurs zero hosting costs for non-profits.'
    ],
    firstStepTicketDe: 'Foto-OCR auf Lebensmittelverpackung mit Extraktion von TT.MM.JJJJ',
    firstStepTicketEn: 'Photo OCR on food packaging extracting DD.MM.YYYY stamp',
    firstStepCriteriaDe: 'Fertig, wenn 9 von 10 Testfotos von Joghurtdeckeln das korrekte Datum und die Kategorie erkennen.',
    firstStepCriteriaEn: 'Done when 9 of 10 test photos of dairy lids correctly extract the expiry date and item category.',
    tags: ['Lebensmittelrettung', 'Tafel', 'OCR', 'Offline-First']
  },
  {
    id: 'balkonsolar-verschattung',
    title: 'Balkonkraftwerk-Verschattung per Handykamera',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Handykamera schätzt Baum- und Balkonverschattung für 600W/800W Stecker-Solarmodule.',
    conceptEn: 'Smartphone camera estimates tree and parapet shading for plug-in balcony solar panels.',
    status: 'besetzt',
    suggestedVerdict: 'discarded',
    recipientDe: 'Akkudoktor-Forum / PVGIS',
    recipientEn: 'Akkudoktor community / PVGIS',
    sourceType: 'Besetzungsatlas',
    sourceDe: 'Akkudoktor-Forum Juli 2026 & App Stores',
    sourceEn: 'Akkudoktor DIY solar forum July 2026 & app stores',
    evidenceDe: 'Horisol (Akkudoktor-Forum, Juli 2026), SunOnTrack AR und HTW Berlin Solar-Simulator besetzen den Bereich bereits vollständig.',
    evidenceEn: 'Horisol (July 2026), SunOnTrack AR, and HTW Berlin solar simulator already cover this niche thoroughly.',
    reviewDate: '–',
    tags: ['Solar', 'Balkonkraftwerk', 'Besetzt']
  },
  {
    id: 'wheelmap-eingangsfoto',
    title: 'Wheelmap: Eingangsfoto → Barrierefreiheit',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Foto von Eingangsstufen schätzt Stufenhöhe, Rampenneigung und Rollstuhlgängigkeit.',
    conceptEn: 'Photo of building entrance estimates step height and wheelchair accessibility.',
    status: 'besetzt',
    suggestedVerdict: 'discarded',
    recipientDe: 'Sozialhelden e.V. (Wheelmap)',
    recipientEn: 'Sozialhelden e.V. (Wheelmap)',
    sourceType: 'Besetzungsatlas',
    sourceDe: 'HIIG / Wheelmap Open Dataset 2023',
    sourceEn: 'HIIG / Wheelmap open dataset 2023',
    evidenceDe: 'HIIG + Wheelmap haben 2023 bereits einen offenen Datensatz Stufen/Rampen gebaut und forschen intern an automatischer Foto-Erkennung.',
    evidenceEn: 'HIIG and Wheelmap published an open dataset of entrance stairs and ramps in 2023 and are actively testing internal models.',
    reviewDate: '–',
    tags: ['Barrierefreiheit', 'Wheelmap', 'Besetzt']
  },
  {
    id: 'repair-cafe-diagnose',
    title: 'Repair-Café-Diagnoseassistent',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Symptom-Abfrage bei defekten Haushaltsgeräten mit Abgleich gegen Fehlerstatistiken.',
    conceptEn: 'Appliance defect troubleshooting assistant mapped against open repair database fault statistics.',
    status: 'besetzt',
    suggestedVerdict: 'discarded',
    recipientDe: 'Repair Café International / Anstiftung',
    recipientEn: 'Repair Café International / Open Repair Alliance',
    sourceType: 'Besetzungsatlas',
    sourceDe: 'Repair Café International Blog Juli 2026 & GitHub',
    sourceEn: 'Repair Café International blog July 2026 & GitHub',
    evidenceDe: 'Repair Café International Artikel Juli 2026; robotfreak/repair-cafe und Open Repair Alliance Tools existieren bereits.',
    evidenceEn: 'Featured in Repair Café International articles (July 2026); robotfreak/repair-cafe and open repair tooling actively maintained.',
    reviewDate: '–',
    tags: ['Reparatur', 'Kreislauf', 'Besetzt']
  },
  {
    id: 'chor-satb-trennung',
    title: 'Chor-Übedateien aus Aufnahme (SATB-Trennung)',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Gesamtaufnahme einer Chorprobe in Sopran, Alt, Tenor und Bass aufspalten zum individuellen Stimmtraining.',
    conceptEn: 'Split full choral rehearsal recordings into soprano, alto, tenor, and bass audio stems for practice.',
    status: 'besetzt',
    suggestedVerdict: 'discarded',
    recipientDe: 'Chor-Verbände / Kirchenmusik',
    recipientEn: 'Choral associations / vocal ensembles',
    sourceType: 'Besetzungsatlas',
    sourceDe: 'MVSEP SATB / MusiCraft / ChoirMate',
    sourceEn: 'MVSEP SATB models / MusiCraft / ChoirMate',
    evidenceDe: 'MVSEP SATB-Modell, MusiCraft und ChoirMate existieren bereits mit hoher Qualität und decken Chöre ab.',
    evidenceEn: 'MVSEP SATB stem separation models, MusiCraft, and ChoirMate already provide specialized voice separation.',
    reviewDate: '–',
    tags: ['Audio', 'Chor', 'Musik', 'Besetzt']
  },
  {
    id: 'schulweg-gefahrenkarte',
    title: 'Kreuzungs-Falschparker & Schulweg-Gefahrenkarte',
    round: 'Runde 2',
    date: '16.09.2026',
    conceptDe: 'Meldungen von Elterngruppen über Sichtbehinderungen und Gefahrenpunkte vor Grundschulen bündeln.',
    conceptEn: 'Map dangerous sightline obstructions and illegal parking around elementary school pedestrian crossings.',
    status: 'besetzt',
    suggestedVerdict: 'discarded',
    recipientDe: 'Schulwegportal Berlin / VCD / FixMyBerlin',
    recipientEn: 'Berlin Safe Routes to School / VCD / FixMyBerlin',
    sourceType: 'Besetzungsatlas',
    sourceDe: 'Schulwegportal Berlin & FixMyBerlin',
    sourceEn: 'Berlin official Safe Routes portal & FixMyBerlin',
    evidenceDe: 'Schulwegportal Berlin, VCD-Schulwege-Check und FixMyBerlin decken das Thema institutionell und bürgernah ab.',
    evidenceEn: 'Schulwegportal Berlin, VCD Safe Routes Check, and FixMyBerlin institutional platforms already address this in Berlin.',
    reviewDate: '–',
    tags: ['Mobilität', 'Schulweg', 'Verkehr', 'Besetzt']
  },
  {
    id: 'trockenrasen-transekte',
    title: 'Trockenrasen-Transekte (Biotopwert-Livekalibrierer)',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Kamera-Messung von Vegetationslücken & Flechtenbedeckung entlang von FFH-Offenland-Transekten mit Live-Signifikanzstopp.',
    conceptEn: 'Camera measurement of vegetation gaps and lichen ground cover along grassland transects with live statistical significance stop.',
    status: 'verengt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Nachprüfung 23.09.2026 — Variante von Kartierlotse (`verengt`), nicht separat geführt.',
    suggestedVerdict: 'gift',
    recipientDe: 'Stiftung Naturschutz Berlin · Landesamt für Umwelt Brandenburg (LRT 6120/6210)',
    recipientEn: 'Berlin Nature Conservation Foundation · Brandenburg State Environmental Agency',
    sourceType: 'Typ A',
    sourceDe: 'BfN / LANA Kartieranleitung für FFH-Offenlandbiotope',
    sourceEn: 'BfN / LANA habitat assessment mapping guide for dry grasslands',
    evidenceDe: 'Kartierer laufen starre 20m-Transekte bei 35°C auf Papier ab; kein Tool berechnet das statistische Sättigungslimit vor Ort.',
    evidenceEn: 'Ecologists pace fixed 20m transects on clipboards; zero field tools calculate statistical saturation on-site.',
    reviewDate: '09/2027',
    problemDe: 'Gutachter erfassen Zeigerpflanzenarten auf Trockenrasen. Ist die Transektstichprobe unvollständig oder inhomogen, kippt die FFH-Einstufung vor Gericht. Niemand weiß vor Ort, ob 14 Meter bereits genügen.',
    problemEn: 'Ecologists map indicator plants on dry sand ecosystems. Incomplete sampling invalidates legal protected status months later in court.',
    whyNowDe: [
      'ONNX Runtime Web berechnet Textur- und Flechtenbedeckung in Echtzeit ohne Server.',
      'Statistische Wald-Sequentialanalyse läuft client-side und signalisiert das Messende per Vibration.'
    ],
    whyNowEn: [
      'ONNX Runtime Web calculates ground cover and bare-soil ratio in real time client-side.',
      'Sequential probability ratio tests alert surveyors via vibration when statistical confidence is met.'
    ],
    firstStepTicketDe: 'Wasm-Segmentierer für Foto-Streifen: Verhältnis von offenem Sand zu Grasbüscheln mit Konfidenzbalken',
    firstStepTicketEn: 'Wasm texture segmenter for photo strips: ratio of bare sand to grass tufts with confidence indicator',
    workerPersona: {
      name: 'Gisela & Markus',
      role: 'Ehrenamtliche Biotopkartierer',
      location: 'Döberitzer Heide / Havelland',
      storyDe: 'Laufen bei 34 Grad mit Klemmbrett und Maßband durch die Heide, um geschützte Trockenrasen nach LANA-Vorgaben zu erfassen. Nach 14 Metern bricht Gisela wegen Schwindel ab; Monate später verwirft das Umweltamt das Gutachten als „statistisch unzureichende Transektlänge".',
      storyEn: 'Walk dry grassland transects at 34°C with clipboards and tape measures. After 14 meters Gisela gets dizzy and stops; months later authorities discard the survey as statistically insufficient.',
      quoteDe: '„Wir brauchen kein fancy KI-Dashboard. Wir müssen vor Ort im Sand wissen, ob 14 Meter gereicht haben, damit wir nicht umsonst umkippen."',
      quoteEn: '“We do not need a fancy dashboard. We need to know in the field if 14 meters were enough so we do not faint in vain.”'
    },
    realRecipientsList: [
      {
        org: 'Stiftung Naturschutz Berlin',
        person: 'Koordination Biotopkartierung / Vertragsnaturschutz',
        email: 'info@stiftung-naturschutz.de',
        location: 'Potsdamer Straße 68, 10785 Berlin',
        roleDe: 'Projektleitung Flora & FFH-Biotopschutz',
        roleEn: 'Flora & Habitat Protection Lead',
        url: 'https://www.stiftung-naturschutz.de'
      },
      {
        org: 'Landesamt für Umwelt Brandenburg (LfU)',
        person: 'Referat Ökologische Umweltbeobachtung / Biotopkartierung',
        email: 'biotopkartierung@lfu.brandenburg.de',
        location: 'Seeburger Chaussee 2, 14476 Potsdam',
        roleDe: 'Vollzugsbehörde für FFH-LRT 6120/6210',
        roleEn: 'State Environmental Enforcement Agency',
        url: 'https://lfu.brandenburg.de'
      }
    ],
    tags: ['Naturschutz', 'BfN', 'Computer Vision', 'FFH', '18. September']
  },
  {
    id: 'fledermaus-echo-entwirrer',
    title: 'Fledermaus-Echo-Entwirrer (Doppler-Wasserfilter)',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Destruktive Interferenzfilterung von Oberflächenwellen-Echos auf 384-kHz-Ultraschallaufnahmen über Gewässern.',
    conceptEn: 'Destructive phase interference filter for water surface ripple echoes on 384 kHz bat ultrasound recordings.',
    status: 'unklar',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Nachprüfung 23.09.2026 → `unklar`, Prämisse unbelegt. Recheck nur mit NABU-Fledermaus-AG.',
    suggestedVerdict: 'gift',
    recipientDe: 'NABU Bundesfachausschuss Fledermausschutz · Koordinationsstelle für Fledermausschutz',
    recipientEn: 'NABU National Bat Conservation Committee · Regional Bat Protection Centers',
    sourceType: 'Typ B',
    sourceDe: 'NABU Batcorder-Monitoring & Bioakustik-Gewässeraufnahmen',
    sourceEn: 'NABU Batcorder monitoring dataset and water bioacoustic field logs',
    evidenceDe: 'Standard-Klassifikatoren (BatClassify) scheitern an Wasserreflexionen; ehrenamtliche Experten prüfen Monate manuell nach.',
    evidenceEn: 'Standard classifiers fail on water surface multipath reflection; volunteer experts manually audit backlogs for months.',
    reviewDate: '09/2027',
    problemDe: 'Terabytes an nächtlichen Ultraschallaufnahmen an Teichen zeigen Wasserfledermaus-Rufe, die durch Wellenreflexion als Phantom-Doppelrufe klassifiziert werden.',
    problemEn: 'Terabytes of nocturnal ultrasound recordings at ponds create phantom double-calls due to water surface echo multipath.',
    whyNowDe: [
      'Web Audio AudioWorklet verarbeitet 384-kHz-Rohaudiodaten im Browser.',
      'Phasenkorrelations-Algorithmen aus der Musikproduktion laufen in WebAssembly.'
    ],
    whyNowEn: [
      'Web Audio AudioWorklet processes 384 kHz raw ultrasound buffers directly in browser.',
      'Phase cancellation algorithms from studio acoustics run fast in WebAssembly.'
    ],
    firstStepTicketDe: 'WAV-Upload (384 kHz) → Spektrogramm-Vergleich vor und nach der geometrischen Phasen-Echo-Auslöschung',
    firstStepTicketEn: 'WAV upload (384 kHz) → spectrogram viewer showing call isolation before and after multipath cancellation',
    workerPersona: {
      name: 'Dr. Carsten K.',
      role: 'Ehrenamtlicher Bioakustiker & Fledermausschützer',
      location: 'Spreewald / Brandenburg',
      storyDe: 'Hat den Sommer über Batcorder an Teichen aufgestellt. Sitzt jetzt vor 400 GB Ultraschallaufnahmen; Standardsoftware meldet bei jeder Wasserkräuselung Phantom-Doppelrufe. Er prüft 120 Stunden nachts Spektrogramme von Hand, statt Schutzanträge zu schreiben.',
      storyEn: 'Deployed batcorders over ponds all summer. Now faces 400 GB of ultrasound files where standard software confuses water ripple multipath with phantom bats, forcing 120 hours of manual spectrogram auditing.',
      quoteDe: '„Ich verbringe den ganzen Oktober mit Lupe vor Spektrogrammen, nur weil die Software eine Wasserwelle nicht von einem zweiten Tier unterscheiden kann."',
      quoteEn: '“I spend all of October auditing spectrograms with a magnifying glass just because the software cannot tell a water ripple from a second bat.”'
    },
    realRecipientsList: [
      {
        org: 'NABU Bundesfachausschuss Fledermausschutz',
        person: 'Sprecherkreis Bioakustik-Monitoring',
        email: 'fledermaus@nabu.de',
        location: 'Charitéstraße 3, 10117 Berlin',
        roleDe: 'Bundesweite Ehrenamtskoordination Bioakustik',
        roleEn: 'National Bat Acoustic Monitoring Coordinator',
        url: 'https://www.nabu.de'
      },
      {
        org: 'Berliner Artenschutz Team (BAT) e.V.',
        person: 'Projektleitung Gewässer-Fledermausschutz',
        email: 'kontakt@bat-ev.de',
        location: 'Berlin-Spandau',
        roleDe: 'Regionale Koordinationsstelle',
        roleEn: 'Regional Bat Conservation Center'
      }
    ],
    tags: ['Bioakustik', 'Fledermäuse', 'WebAudio', 'NABU', '18. September']
  },
  {
    id: 'sandstein-streiflicht-relief',
    title: 'Sandstein-Streiflicht-Relief (Photometric Stereo)',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Synthese von 4 Taschenlampen-Winkelfotos zu einer Normalen-Höhenkarte verwitterter Sandstein-Grabplatten.',
    conceptEn: 'Synthesis of 4 flashlight angled photos into normal maps revealing weathered sandstone epitaph inscriptions.',
    status: 'verengt',
    userNotes: 'Duplikat von „Streiflicht" (Runde 2, `verengt`) — im Prüfprotokoll nicht separat geführt. Nicht getrennt packen.',
    suggestedVerdict: 'gift',
    recipientDe: 'Verein für Computergenealogie (CompGen) · Landesdenkmalamt Berlin',
    recipientEn: 'CompGen (German Genealogical Society) · Berlin Heritage Authority',
    sourceType: 'Typ C/D',
    sourceDe: 'CompGen-Werkstattbericht 2026 (Halluzination bei Verwitterung) & Ca Foscari RTI Paper',
    sourceEn: 'CompGen Workshop Report 2026 (LLM hallucination on weathered stone) & Ca Foscari RTI paper',
    evidenceDe: 'CompGen nutzt KI, benennt Halluzination als Grenze; Smartphone-RTI existiert nur als akademisches Paper ohne Werkzeug.',
    evidenceEn: 'CompGen names hallucination on eroded stone as primary limit; smartphone RTI exists only as academic paper with no tool.',
    reviewDate: '09/2027',
    problemDe: 'Historische Grabsteine verlieren Lesbarkeit durch Substanzabrieb. LLMs erfinden Buchstaben; Steinmetze auf Leitern haben keine Labor-RTI-Kuppel.',
    problemEn: 'Epitaphs lose legibility through sandstone erosion. LLMs invent hallucinated names; conservators on ladders lack laboratory RTI domes.',
    whyNowDe: [
      'WebGPU berechnet photometrische Normalen-Maps aus 4 Smartphone-Fotos in unter 300ms.',
      'Ehrliche Fehlermarkierung markiert Zonen mit >80% Substanzverlust als unlesbar.'
    ],
    whyNowEn: [
      'WebGPU computes surface normal maps from 4 directional flashlight photos in under 300ms.',
      'Honest uncertainty masking highlights eroded zones with >80% loss as unrecoverable instead of hallucinating.'
    ],
    firstStepTicketDe: '4-Bilder-Upload mit virtueller Lichtquellen-Kugel zum interaktiven Streiflicht-Kippen',
    firstStepTicketEn: '4-image upload with virtual light direction tracker for interactive raking-light relief preview',
    workerPersona: {
      name: 'Günter (71) & Sarah (38)',
      role: 'Familienforscher & Steinrestauratorin',
      location: 'Dorotheenstädtischer Friedhof / Berlin-Mitte',
      storyDe: 'Günter balanciert auf einer Trittleiter vor einem barocken Epitaph von 1740. KI-OCR halluziniert bei Verwitterung Namen. Sarah weiß, dass Streiflicht hilft, aber im Feld hat niemand Labor-RTI-Kuppeln.',
      storyEn: 'Günter stands on a stepladder in front of an eroded 1740 sandstone epitaph. AI OCR invents fantasy names. Sarah knows raking light works, but field workers cannot carry 50kg lab domes.',
      quoteDe: '„Wir wollen keine KI, die uns erfundene Namen andichtet. Wir wollen das Relief so kippen können, dass wir selbst sehen, ob da eine Sieben oder eine Eins stand."',
      quoteEn: '“We do not want AI inventing hallucinated names. We just want to tilt the surface light so we can see for ourselves whether it was a 7 or a 1.”'
    },
    realRecipientsList: [
      {
        org: 'Verein für Computergenealogie e.V. (CompGen)',
        person: 'Projektleitung Grabstein-Projekt',
        email: 'grabsteine@compgen.de',
        roleDe: 'Bundesweites genealogisches Citizen-Science-Netzwerk',
        roleEn: 'National Genealogical Citizen Science Network',
        url: 'https://www.compgen.de'
      },
      {
        org: 'Landesdenkmalamt Berlin',
        person: 'Referat Restaurierung und Bauforschung',
        email: 'denkmalamt@sensw.berlin.de',
        location: 'Klosterstraße 47, 10179 Berlin',
        roleDe: 'Denkmalbehörde Berlin',
        roleEn: 'Berlin Heritage Authority'
      }
    ],
    tags: ['Denkmalpflege', 'Genealogie', 'WebGPU', 'CompGen', '18. September']
  },
  {
    id: 'hummel-schleusenwaechter',
    title: 'Hummel-Schleusenwächter (Kuckuckshummel-Detektor)',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: '10-Sekunden-Videoanalyse am Einflugloch des Hummelkastens zur Früherkennung parasitärer Kuckuckshummeln.',
    conceptEn: '10-second video analysis at nesting box flight hole for early detection of parasitic cuckoo bumblebees.',
    status: 'verengt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Nachprüfung 23.09.2026 → `verengt` (dünn).',
    suggestedVerdict: 'gift',
    recipientDe: 'Thünen-Institut für Biodiversität (MonViA) · NABU Hummelschutz',
    recipientEn: 'Thünen Institute of Biodiversity (MonViA) · Bumblebee Conservation Network',
    sourceType: 'Typ B',
    sourceDe: 'mitforschen.org / Thünen MonViA Wildbienen-Monitoring',
    sourceEn: 'mitforschen.org / Thünen MonViA citizen science report',
    evidenceDe: 'Bürger melden Hummelkästen an; Kuckuckshummel-Übernahmen führen oft zum unbemerkten Volkstod, Auswertung erfolgt erst nach Monaten.',
    evidenceEn: 'Citizen scientists photograph nesting boxes; cuckoo usurpation destroys colonies unnoticed until post-season manual audit.',
    reviewDate: '09/2027',
    problemDe: 'Kuckuckshummeln stechen die Wirtskönigin tot. Bürger erkennen den Eindringling am Flugloch nicht rechtzeitig.',
    problemEn: 'Cuckoo bumblebees kill the host queen inside nesting boxes. Gardeners fail to distinguish invaders in real-time.',
    whyNowDe: [
      'Mobile Video-Objekterkennung erkennt fehlende Corbiculae (Pollenkörbchen) und veränderten Flugstil mit 30 FPS im Browser.',
      'Sofortiger Handlungsrat: Vorbauklappe für 30 Minuten schließen schützt das Volk.'
    ],
    whyNowEn: [
      'Mobile video vision classifies lack of corbiculae (pollen baskets) and distinctive flight jitter at 30 FPS.',
      'Immediate actionable advice: closing entrance flap for 30 minutes repels the invader.'
    ],
    firstStepTicketDe: 'Videoclip-Upload mit Segmentierungs-Bounding-Box: Arbeiterin vs. Kuckuckshummel-Wahrscheinlichkeit',
    firstStepTicketEn: 'Short video upload with morphological bounding box: worker bee vs parasitic cuckoo probability',
    workerPersona: {
      name: 'Renate (68)',
      role: 'Gärtnerin & Wildbienen-Patin',
      location: 'Berlin-Pankow',
      storyDe: 'Hat im März einen Hummelkasten aufgestellt. Im Mai sieht sie eine auffällig große Hummel am Flugloch, hält sie für eine Königin und freut sich. Die MonViA-Meldung wird erst im Winter ausgewertet — das Volk wurde von der Kuckuckshummel schon im Juni abgetötet.',
      storyEn: 'Set up a bumblebee box in March. In May she spots a large bee, thinks it is a queen and is pleased. MonViA audits the photo in winter—by June the colony was already killed by the cuckoo bumblebee.',
      quoteDe: '„Hätte mir das Telefon am selben Tag gesagt: Klappe für eine Stunde zu!, würde mein Volk heute noch fliegen."',
      quoteEn: '“Had the phone told me on that same day: close the flap for an hour!, my colony would still be flying today.”'
    },
    realRecipientsList: [
      {
        org: 'Thünen-Institut für Biodiversität',
        person: 'Projekt MonViA (Nationales Bienen-Monitoring)',
        email: 'monvia@thuenen.de',
        location: 'Bundesallee 65, 38116 Braunschweig',
        roleDe: 'Projektleitung Citizen Science Wildbienen',
        roleEn: 'Lead Citizen Science Wild Bee Monitoring',
        url: 'https://www.thuenen.de/de/bd'
      },
      {
        org: 'NABU Hummelschutzgruppe Berlin',
        person: 'AG Wildbienen-Schutz',
        email: 'hummelschutz@nabu-berlin.de',
        roleDe: 'Praktischer Artenschutz vor Ort',
        roleEn: 'Local Species Conservation Group'
      }
    ],
    tags: ['Wildbienen', 'Artenschutz', 'Citizen Science', 'Thünen', '18. September']
  },
  {
    id: 'orgelpfeifen-bleifrass-resonanz',
    title: 'Orgelpfeifen-Bleifraß-Resonanz',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Akustische Transienten-Analyse des Labien-Einschwingvorgangs zur Früherkennung von Bleifraß an Orgelpfeifen.',
    conceptEn: 'Acoustic transient analysis of pipe organ speech onset to detect internal lead-tin alloy corrosion ("Bleifraß").',
    status: 'unklar',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Runde 4 (19.09.2026) → `unklar`, Problemprämisse nicht belegt.',
    suggestedVerdict: 'gift',
    recipientDe: 'Bund Deutscher Orgelbaumeister (BDO) · Stiftung Orgelklang / Deutsche Stiftung Denkmalschutz',
    recipientEn: 'Association of German Pipe Organ Builders (BDO) · Foundation for Historic Organs',
    sourceType: 'Typ A/C',
    sourceDe: 'Deutsche Stiftung Denkmalschutz Leitfaden Bleifraß-Prävention & BDO Fachtagungen',
    sourceEn: 'German Foundation for Monument Protection Guidelines on Organ Pipe Corrosion',
    evidenceDe: 'Bleifraß wird bisher erst erkannt, wenn Pfeifenfüße kollabieren; keine akustische Vorab-Früherkennung für Sachverständige.',
    evidenceEn: 'Organ pipe corrosion is typically diagnosed only after structural pipe collapse; zero non-destructive acoustic screening exists.',
    reviewDate: '09/2027',
    problemDe: 'Historische Orgelpfeifen zerfallen unbemerkt durch Essigsäure-Dämpfe aus Eichengehäusen. Inspektionen in engen Werken sind gefährlich und lückenhaft.',
    problemEn: 'Centuries-old pipe organs corrode internally from oak wood acetic acid outgassing. Physical inspection inside tight casework is hazardous.',
    whyNowDe: [
      'Smartphone-Mikrofone erfassen 48-kHz-Abtastraten mit linearem Frequenzgang.',
      'Gleitende FFT im Browser trennt die Einschwing-Transiente (das "Spucken" der Pfeife) vom stationären Klang.'
    ],
    whyNowEn: [
      'Smartphone microphones capture 48 kHz linear audio with high SNR.',
      'Browser FFT separates initial speech transient from steady harmonic sustain.'
    ],
    firstStepTicketDe: 'Tonleiter-Aufnahme eines 8-Fuß-Principals → Detektion von Pfeifen mit atypischer Dämpfung im Pfeifenraster',
    firstStepTicketEn: 'Scale recording of an 8ft Principal register → highlighting pipes with anomalous onset damping on a grid',
    workerPersona: {
      name: 'Johannes T.',
      role: 'Orgelbaumeister & Restaurator',
      location: 'Werder (Havel) / Brandenburg',
      storyDe: 'Klettert in staubige, fünf Meter hohe Orgelgehäuse aus dem 18. Jahrhundert. Essigsäuredämpfe aus alten Eichenbalken zersetzen Pfeifenfüße. Oft merkt man es erst, wenn die Pfeife unter ihrem Eigengewicht einknickt.',
      storyEn: 'Climbs 5-meter tall 18th-century organ casework. Acetic acid fumes from historic oak beams corrode pipe feet until pipes collapse under their own weight.',
      quoteDe: '„Wenn ich vom Spieltisch aus mit dem Handy hören könnte, welche Pfeife im Schwellwerk verdächtig anspricht, müsste ich nicht auf wackligen Latten im Dunkeln balancieren."',
      quoteEn: '“If I could diagnose from the organ bench which pipe onset transient is damped, I would not have to balance on rickety slats in the pitch dark.”'
    },
    realRecipientsList: [
      {
        org: 'Bund Deutscher Orgelbaumeister (BDO)',
        person: 'Fachausschuss Denkmalpflege und Restaurierung',
        email: 'info@orgelbau.de',
        roleDe: 'Bundesverband der Orgelwerkstätten',
        roleEn: 'German Pipe Organ Builders Guild',
        url: 'https://www.orgelbau.de'
      },
      {
        org: 'Deutsche Stiftung Denkmalschutz (Stiftung Orgelklang)',
        person: 'Referat Historische Musikinstrumente',
        email: 'orgelklang@ekd.de',
        location: 'Schlegelstraße 1, 53113 Bonn',
        roleDe: 'Förderstiftung für historische Pfeifenorgeln',
        roleEn: 'National Historic Organ Preservation Trust'
      }
    ],
    tags: ['Kulturerbe', 'Akustik', 'Orgelbau', 'Denkmalschutz', '18. September']
  },
  {
    id: 'waldbrand-streu-knistern',
    title: 'Waldbrand-Streuschicht-Tensiometer (Nadelstreu-Knistern)',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Akustische Mikroriss-Analyse beim Zusammendrücken von Kiefernnadelstreu vor dem Handymikrofon zur Feuchtebestimmung.',
    conceptEn: 'Acoustic micro-crack crackle analysis when crushing pine needle litter against phone microphone to quantify fuel moisture.',
    status: 'unklar',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Nachprüfung 23.09.2026 → `unklar`, Prämisse unbelegt. Recheck nur mit Landesforst.',
    suggestedVerdict: 'gift',
    recipientDe: 'Landesfeuerwehrverband Brandenburg · Landesbetrieb Forst Brandenburg',
    recipientEn: 'Brandenburg State Firefighters Association · Brandenburg State Forestry Agency',
    sourceType: 'Typ A',
    sourceDe: 'DWD Waldbrandgefahrenindex (WBI) & forstliche Trockenheits-Messvorschriften',
    sourceEn: 'German Weather Service Wildfire Hazard Index (WBI) & forestry litter moisture guidelines',
    evidenceDe: 'WBI liefert nur 1km-Makrogitter; Einsatzleiter vor Ort haben kein schnelles Messwerkzeug für reale Streuauflagen-Feuchte.',
    evidenceEn: 'WBI provides regional 1km grids; incident commanders on scene lack instant field testing tools for actual needle litter moisture.',
    reviewDate: '09/2027',
    problemDe: 'Feuerwehren müssen bei Waldbränden schätzen, wie tief das Bodenfeuer frisst. Einstichsonden und Trockenöfen dauern Stunden.',
    problemEn: 'Forest firefighters guess ground fire fuel depth by stomping with boots. Lab ovens and probe sensors take hours.',
    whyNowDe: [
      'Hochfrequente Audio-Spektralanalyse trennt feuchtes Faserbiegen von spröden Ultraschall-Bruchspitzen (>8 kHz).',
      'Funktioniert offline im tiefen Wald ohne Mobilfunkverbindung.'
    ],
    whyNowEn: [
      'High-frequency audio analysis distinguishes ductile bending from brittle acoustic fracture spikes (>8 kHz).',
      'Operates completely offline in deep forest zones without cell signal.'
    ],
    firstStepTicketDe: '3-Sekunden-Mikrofon-Aufnahme beim Streu-Zusammendrücken → Feuchte-Ampel (<8% rot, 8-15% gelb, >15% grün)',
    firstStepTicketEn: '3-second microphone recording while crushing needle handful → fuel moisture gauge (<8% red, 8-15% yellow, >15% green)',
    workerPersona: {
      name: 'Brandmeister Torsten',
      role: 'Einsatzleiter Freiwillige Feuerwehr',
      location: 'Treuenbrietzen / Brandenburg',
      storyDe: 'Steht bei Waldbrandstufe 4 an der Rauchgrenze im Kiefernforst. Der DWD meldet grob Stufe 4 für 100 Quadratkilometer. Torsten muss in 60 Sekunden entscheiden, ob Trupps mit Schläuchen in die Schonung vorgehen können oder ob das Bodenfeuer unterirdisch kriecht.',
      storyEn: 'Stands at the smoke perimeter in pine woods during danger stage 4. Regional weather models only give a 100 sq km macro grid. Torsten has 60 seconds to decide whether hose teams can advance safely.',
      quoteDe: '„Wir treten mit dem Stiefel in den Humus und raten. Wenn ich eine Handvoll Nadeln vors Handy drücke und sofort weiß: unter 7%, weiß ich, dass wir den Riegel vorziehen müssen."',
      quoteEn: '“We kick the needle humus with our boots and guess. If I could crush a handful in front of my phone and get a reliable sub-7% reading, my crews would not get cut off.”'
    },
    realRecipientsList: [
      {
        org: 'Landesfeuerwehrverband Brandenburg e.V.',
        person: 'Fachausschuss Waldbrandbekämpfung',
        email: 'geschaeftsstelle@lfv-bb.de',
        location: 'Werderscher Markt 1, 14467 Potsdam',
        roleDe: 'Dachverband der Feuerwehren im waldbrandreichsten Bundesland',
        roleEn: 'State Firefighters Association',
        url: 'https://www.lfv-bb.de'
      },
      {
        org: 'Landesbetrieb Forst Brandenburg',
        person: 'Waldbrandschutzbeauftragter des Landes',
        email: 'waldbrandschutz@forst.brandenburg.de',
        roleDe: 'Landesforstverwaltung',
        roleEn: 'State Forestry Service'
      }
    ],
    tags: ['Katastrophenschutz', 'Feuerwehr', 'Forst', 'Akustik', '18. September']
  },
  {
    id: 'phaenologischer-knospen-countdown',
    title: 'Phänologischer Knospen-Countdown (DWD-Beobachter)',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Sub-Pixel-Kantenvermessung an Knospenschuppen zur Vorhersage des exakten Blühzeitpunkts für DWD-Wetterbeobachter.',
    conceptEn: 'Sub-pixel edge tracking of vegetative bud scale displacement to forecast exact bud burst date for weather observers.',
    status: 'verengt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Nachprüfung 23.09.2026 → `verengt` (dünn).',
    suggestedVerdict: 'gift',
    recipientDe: 'Deutscher Wetterdienst (DWD) Agrarmeteorologie · Naturkalender Plattform',
    recipientEn: 'German Meteorological Service (DWD) Phenology Network · Naturkalender Platform',
    sourceType: 'Typ A/B',
    sourceDe: 'DWD Anleitung für die phänologischen Beobachter (10-Jahreszeiten-Kalender)',
    sourceEn: 'DWD Phenological Observer Handbook (10-season climate calendar)',
    evidenceDe: '1.100 ehrenamtliche Beobachter erfassen Austriebe; verpasste Termine an Wochenenden erzeugen Lücken in 70-Jahres-Reihen.',
    evidenceEn: '1,100 voluntary observers log flowering dates; missed weekend events introduce gaps in 70-year climatological datasets.',
    reviewDate: '09/2027',
    problemDe: 'Klimaerwärmung verschiebt Austriebe unvorhersehbar. Ehrenamtliche verpassen das entscheidende 48-Stunden-Fenster der Knospensprengung.',
    problemEn: 'Climate warming shifts bud burst unpredictably. Volunteers miss the crucial 48-hour bud expansion event.',
    whyNowDe: [
      'Sub-Pixel-Computer-Vision kombiniert Knospenschuppen-Spreizung mit lokalen Temperatursummen (Growing Degree Days).',
      'Errechnet Countdown-Stunden bis zum Aufbrechen der Knospe.'
    ],
    whyNowEn: [
      'Sub-pixel computer vision correlates scale opening distance with local Growing Degree Days.',
      'Calculates countdown hours until bud break for timely field visits.'
    ],
    firstStepTicketDe: 'Foto-Paar-Vergleich im 48h-Abstand → Vorhersage der verbleibenden Stunden bis Austriebsbeginn',
    firstStepTicketEn: 'Two-photo comparison 48h apart → projection of remaining hours until flowering onset',
    workerPersona: {
      name: 'Klaus-Dieter (74)',
      role: 'Ehrenamtlicher DWD-Phänologie-Beobachter',
      location: 'Prenzlau / Uckermark',
      storyDe: 'Erfasst seit 32 Jahren den Austrieb von Hasel und Buche für den Klimadienst. Letztes Frühjahr war er über das Wochenende auf einer Familienfeier; genau am Samstag brach die Knospe auf. Eine permanente Datenlücke in seiner 30-Jahre-Reihe, die ihn schmerzt.',
      storyEn: 'Has tracked hazel and beech bud breaks for 32 years. Last spring he visited family over the weekend; the bud opened precisely on Saturday, causing an irreversible data gap.',
      quoteDe: '„Wenn mir die Kamera am Donnerstag gesagt hätte: Sonntag 14 Uhr springt sie auf!, hätte ich meinen Nachbarn gebeten, kurz nachzusehen."',
      quoteEn: '“If my phone had warned me on Thursday that bud burst was expected Sunday 2 PM, I would have asked my neighbor to take the confirmation photo.”'
    },
    realRecipientsList: [
      {
        org: 'Deutscher Wetterdienst (DWD)',
        person: 'Referat Agrarmeteorologie und Phänologische Beobachtung',
        email: 'phaenologie@dwd.de',
        location: 'Frankfurter Straße 135, 63067 Offenbach',
        roleDe: 'Leitung des 1.100 Beobachter zählenden DWD-Messnetzes',
        roleEn: 'Head of National Phenology Network',
        url: 'https://www.dwd.de/phaenologie'
      }
    ],
    tags: ['Klimaforschung', 'DWD', 'Phänologie', 'Botanik', '18. September']
  },
  {
    id: 'tafel-frische-triage',
    title: 'Tafel-Frische-Triage (Druckstellen- & Ethylen-Kinetik)',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Kamera-Schwenk über Gemüsekisten zur Detektion beginnender Druckstellen und Warnung vor schädlichen Ethylen-Nachbarschaften.',
    conceptEn: 'Camera pan over donated produce crates detecting early bruising and warning of damaging ethylene gas juxtapositions.',
    status: 'verengt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Nachprüfung 23.09.2026 → `verengt` (OneThird hat die Fähigkeit, nicht den Einsatzort Tafel).',
    suggestedVerdict: 'gift',
    recipientDe: 'Tafel Deutschland e.V. · Lokale Foodsharing-Initiativen',
    recipientEn: 'Tafel Deutschland (German Food Bank Network) · Foodsharing communities',
    sourceType: 'Typ C/A',
    sourceDe: 'Tafel Leitfaden Lebensmittelhygiene und Warensortierung im Ehrenamt',
    sourceEn: 'Food bank hygiene and manual sorting volunteer handbook',
    evidenceDe: 'Ehrenamtliche sortieren tausende Kilo nach grober Sicht; versteckter Ethylen-Verderb vernichtet Kisten über Nacht.',
    evidenceEn: 'Volunteers sort thousands of kilos by naked eye; latent ethylene rotting destroys whole crates overnight before distribution.',
    reviewDate: '09/2027',
    problemDe: 'Gemeinnützige Tafeln erhalten gemischte Supermarktkisten. Scheinbar feste Pfirsiche zerfallen über Nacht durch ausgasende Äpfel in derselben Kiste.',
    problemEn: 'Food banks receive bulk donations. Firm peaches turn to mush overnight due to off-gassing ripe apples in the same crate.',
    whyNowDe: [
      'On-Device-Vision erkennt Fruchtarten, Reifegrade und Einsenkungen ohne Cloud-Kosten.',
      'Gibt sofortige Sortier-Empfehlung für ehrenamtliche Helfer.'
    ],
    whyNowEn: [
      'On-device vision classifies fruit species, ripeness stages, and skin depression with zero server costs.',
      'Gives instant sorting recommendations to elderly volunteer helpers.'
    ],
    firstStepTicketDe: 'Foto-Upload einer Obstkiste → Markierung von Unverträglichkeiten (z. B. "Äpfel von Bananen trennen")',
    firstStepTicketEn: 'Produce crate photo upload → visual overlay highlighting incompatible ethylene neighbors',
    workerPersona: {
      name: 'Monika (62)',
      role: 'Ehrenamtliche Sortierhelferin',
      location: 'Berliner Tafel e.V. / Ausgabestelle Neukölln',
      storyDe: 'Sortiert jeden Dienstagmorgen um 7:30 Uhr im kalten Keller hunderte Kilo gespendetes Obst. Wenn ausgasende Äpfel neben festen Pfirsichen bleiben, sind letztere am Ausgabetag matschig und müssen weggeworfen werden.',
      storyEn: 'Sorts hundreds of kilos of donated fruit every Tuesday at 7:30 AM in a chilly basement. If ethylene-emitting apples stay next to firm peaches, the peaches turn to mush by distribution day.',
      quoteDe: '„Wir stehen hier drei Stunden und sortieren mit klammen Fingern. Wenn eine Kiste über Nacht verdirbt, zerreißt es mir das Herz, weil wir den Familien dann nichts mitgeben können."',
      quoteEn: '“We stand here sorting for three hours with cold fingers. When a whole crate rots overnight, it breaks my heart because we have nothing left to give to families.”'
    },
    realRecipientsList: [
      {
        org: 'Tafel Deutschland e.V.',
        person: 'Team Logistik & Lebensmittelsicherheit',
        email: 'info@tafel.de',
        location: 'Germaniastraße 18, 12099 Berlin',
        roleDe: 'Bundesverband der über 970 Tafeln',
        roleEn: 'National Umbrella Association of Food Banks',
        url: 'https://www.tafel.de'
      },
      {
        org: 'Berliner Tafel e.V.',
        person: 'Leitung Logistikzentrum Großmarkt',
        email: 'logistik@berliner-tafel.de',
        roleDe: 'Regionale Logistikkoordination Berlin',
        roleEn: 'Regional Food Bank Logistics Center'
      }
    ],
    tags: ['Lebensmittel', 'Tafel', 'Ehrenamt', 'Computer Vision', '18. September']
  },
  {
    id: 'licht-glocken-kataster',
    title: 'Licht-Glocken-Kataster (Fassaden-Skyglow-Inspector)',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Smartphone-Gyroskop + 2 HDR-Belichtungen zur Berechnung unzulässiger Lichtemission über die Horizontale (ULOR).',
    conceptEn: 'Smartphone gyroscope + 2 HDR exposures calculating prohibited upward light emission ratio (ULOR) under DIN EN 12464-2.',
    status: 'verengt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Nachprüfung 23.09.2026 → `verengt`, Messprinzip fraglich.',
    suggestedVerdict: 'gift',
    recipientDe: 'Paten der Nacht · Senatsverwaltung für Mobilität, Verkehr, Klimaschutz und Umwelt Berlin',
    recipientEn: 'Dark Sky Advocates (Paten der Nacht) · Berlin Department of Environment & Light Pollution',
    sourceType: 'Typ A',
    sourceDe: 'Berliner Leitfaden Bauen mit Licht und Glas (2021) & DIN EN 12464-2',
    sourceEn: 'Berlin Guidelines on Building with Light and Glass (2021) & DIN EN 12464-2 outdoor lighting standard',
    evidenceDe: 'Kommunen haben strenge Richtlinien gegen Himmelsaufhellung; Ordnungsämter verfügen nachts über keinerlei bürgertaugliche Messmittel.',
    evidenceEn: 'Municipalities mandate dark-sky shielding; local enforcement officers have zero portable tools to document skyward leakage.',
    reviewDate: '09/2027',
    problemDe: 'Fassadenstrahler blenden in Vogelschutzkorridore. Ämter können Verstöße gerichtlich nicht beziffern, weil Gutachter nachts nicht ausrücken.',
    problemEn: 'Building spotlights illuminate migratory bird corridors. Regulators fail to substantiate legal violations without expensive night lab rigs.',
    whyNowDe: [
      'Kombination aus Gyroskop-Neigungssensor und kalibrierten Belichtungszeit-Metadaten misst relative Raumwinkel-Leuchtdichten.',
      'Erstellt PDF-Prüfbericht direkt auf dem Smartphone.'
    ],
    whyNowEn: [
      'Combination of hardware inclinometer and calibrated exposure metadata measures angular upward luminance.',
      'Generates compliant compliance audit PDF directly on phone.'
    ],
    firstStepTicketDe: 'Wasserwaagen-Kamera-Overlay: Horizontale Kante einpeilen + ULOR-Prozentwert für Fassadenstrahler berechnen',
    firstStepTicketEn: 'Spirit-level camera overlay: align building horizon + compute upward light emission percentage',
    workerPersona: {
      name: 'Ralf B.',
      role: 'Ehrenamtlicher Naturschutzbeauftragter',
      location: 'Berlin Treptow-Köpenick / Paten der Nacht',
      storyDe: 'Patrouilliert nachts an Gewerbefassaden. Scheinwerfer strahlen senkrecht in den Himmel, Falter und Zugvögel sterben zu tausenden. Das Umweltamt verlangt Messwerte, die Ralf ohne Laborausrüstung nicht beibringen kann.',
      storyEn: 'Patrols commercial facades at night. Upward floodlights kill thousands of nocturnal moths and migratory birds. Environmental offices require certified photometric data Ralf cannot produce without a mobile lab.',
      quoteDe: '„Das Gesetz verbietet Himmelslicht, aber das Amt verlangt kalibrierte Raumwinkel. Wenn mein Handy in dreißig Sekunden ein beweiskräftiges PDF ausspuckt, müssen die Eigentümer endlich abblenden."',
      quoteEn: '“The guidelines ban skyward beams, but enforcement demands calibrated solid angles. If my phone produces an audit PDF in 30 seconds, building owners will finally have to shield their lights.”'
    },
    realRecipientsList: [
      {
        org: 'Paten der Nacht gGmbH',
        person: 'Koordination Lichtverschmutzungs-Kataster',
        email: 'info@paten-der-nacht.de',
        roleDe: 'Bundesweite Initiative gegen Lichtverschmutzung',
        roleEn: 'Dark Sky Advocacy Initiative',
        url: 'https://www.paten-der-nacht.de'
      },
      {
        org: 'Senatsverwaltung für Umwelt Berlin',
        person: 'Referat Immissionsschutz & Naturschutzrecht',
        email: 'immissionsschutz@senmvku.berlin.de',
        location: 'Brückenstraße 6, 10179 Berlin',
        roleDe: 'Herausgeberin des Berliner Leitfadens Bauen mit Licht und Glas',
        roleEn: 'Berlin State Department for Environment'
      }
    ],
    tags: ['Lichtverschmutzung', 'Umweltschutz', 'Verwaltung', 'Sensoren', '18. September']
  },
  {
    id: 'totholz-kolk-peiler',
    title: 'Totholz-Kolk-Peiler für Renaturierungsbäche',
    round: 'Runde 3',
    date: '18.09.2026',
    conceptDe: 'Hydroakustische Resonanzmessung von im Bachgrund verankerten Totholzstämmen via Handy-Beschleunigungssensor am Kescherstab.',
    conceptEn: 'Hydroacoustic resonance measurement of riverbed anchored deadwood logs via phone accelerometer attached to a landing net pole.',
    status: 'verengt',
    userNotes: 'Status an das Prüfprotokoll angeglichen (24.09.2026): Nachprüfung 23.09.2026 → `verengt`.',
    suggestedVerdict: 'gift',
    recipientDe: 'Landesanglerverbände (Gewässerwarte) · Wasser- und Bodenverbände · BUND Bachpatenschaften',
    recipientEn: 'State Angler Associations (River Wardens) · Water and Soil Management Boards · BUND Stream Protectors',
    sourceType: 'Typ A/D',
    sourceDe: 'Wasserrahmenrichtlinie (WRRL) Gewässerstrukturgüte-Kartieranleitung & Totholz-Handbücher',
    sourceEn: 'EU Water Framework Directive habitat assessment mapping guide & wood debris guidelines',
    evidenceDe: 'Bachpaten stochern mit Latten im trüben Wasser; Verkeilungsgrad und Abtreibgefahr von Totholzstämmen werden nur geraten.',
    evidenceEn: 'Stream caretakers poke mud with wooden slats; deadwood log anchoring and bridge collision drift hazard are guessed.',
    reviewDate: '09/2027',
    problemDe: 'Renaturiertes Totholz schafft Kolke für Bachforellen, kann aber bei Hochwasser Brücken rammen. Messung unter Wasser war bisher unmöglich ohne teures Sonar.',
    problemEn: 'Restoration wood creates deep fish pools but risks destroying downstream road culverts during flash floods if unanchored.',
    whyNowDe: [
      'Generic Sensor API tastet Handy-Körperschall und Oszillation mit 100 Hz ab.',
      'Frequenzanalyse unterscheidet lockeres Pendeln von tief verkeilter Strömungsturbulenz.'
    ],
    whyNowEn: [
      'Generic Sensor API samples accelerometer vibration at 100 Hz.',
      'Spectral frequency analysis separates loose log pendulum drift from deep structural sediment anchoring.'
    ],
    firstStepTicketDe: '5-Sekunden-Schwingungs-Logger: Frequenz-Peak-Detektion zur Unterscheidung von "verkeilt" vs. "abtreibend"',
    firstStepTicketEn: '5-second vibration logger: peak frequency detection classifying "firmly locked" vs "drift hazard"',
    workerPersona: {
      name: 'Jochen (55)',
      role: 'Gewässerwart & Bachpate',
      location: 'Nuthe-Urstromtal / Brandenburg',
      storyDe: 'Steht bei 4 Grad Wassertemperatur in der Wathose im Schlamm. Er muss kontrollieren, ob eingebrachte Totholzstämme nach dem Winter noch verkeilt sind oder beim nächsten Starkregen Brückendurchlässe verstopfen.',
      storyEn: 'Stands in 4°C water in mud-soaked waders. Must inspect whether anchored riverbed deadwood logs are still wedged or about to drift and block downstream culverts during floods.',
      quoteDe: '„Ich stochere mit einer Dachlatte im trüben Wasser und rate. Wenn ich das Handy am Stab kurz an den Stamm halte und sofort weiß: sitzt fest!, bin ich nach zehn Minuten wieder im Warmen."',
      quoteEn: '“I poke with a wooden slat in murky water and guess. If I can touch the log with my pole-mounted phone and know instantly that it is locked, I am back in the warm car in ten minutes.”'
    },
    realRecipientsList: [
      {
        org: 'Landesanglerverband Brandenburg e.V.',
        person: 'Referat Gewässerwirtschaft und Hege',
        email: 'hauptgeschaeftsstelle@lavb.de',
        location: 'Anton-Saefkow-Allee 4, 14772 Brandenburg an der Havel',
        roleDe: 'Verband der ehrenamtlichen Gewässerwarte',
        roleEn: 'State Angling & River Warden Association',
        url: 'https://www.lavb.de'
      },
      {
        org: 'BUND Brandenburg',
        person: 'Projektbüro Lebendige Flüsse & Bachpatenschaften',
        email: 'info@bund-brandenburg.de',
        roleDe: 'Gewässerschutz-Initiativen',
        roleEn: 'Living Rivers & Stream Protection Desk'
      }
    ],
    tags: ['Gewässerschutz', 'Renaturierung', 'Sensoren', 'WRRL', '18. September']
  }
];

export const CANDIDATE_IDEAS_DATA: CandidateIdea[] = [
  ...ALL_NEW_CANDIDATE_IDEAS,
  ...INITIAL_CANDIDATE_IDEAS
];


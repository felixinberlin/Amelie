import { DoseItem, DiscardedItem } from '../types';

export const DOSEN_DATA: DoseItem[] = [
  {
    id: 'altbau-thermal',
    title: 'Altbau Thermal',
    oneLinerDe: 'Grundriss zeichnen, Baualtersklasse wählen, sehen, was die eigene Wohnung thermisch tut — an der Ecke hinter dem Schrank, nicht im Mittel. Die Innenperspektive zu dem, was EnergyMap Berlin von außen für jedes Gebäude ausrechnet.',
    oneLinerEn: 'Draw your floor plan, pick a construction-era class, and see what your apartment does thermally — at the corner behind the wardrobe, not on average. The inside view to what EnergyMap Berlin calculates from the outside.',
    date: '19. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Forschungsverbund EnergyMap Berlin (Leitung UdK Berlin, Fachgebiet VPT) · nachrangig: Verbraucherzentrale Berlin (Energieberatung)',
    recipientsEn: 'EnergyMap Berlin research consortium (lead: UdK Berlin, VPT department) · secondary: Verbraucherzentrale Berlin (energy consulting)',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Berlin', 'Energie', 'Zivilgesellschaft', 'WebGL', 'Simulation'],
    problemDe: 'Seit Mai 2025 prognostiziert EnergyMap Berlin den Wärmebedarf des Berliner Gebäudebestands. Offen bleibt: Was tut meine Wohnung? Der Schimmelstreit braucht eine Aussage, die beide Seiten prüfen können („diese Ecke bleibt unter 80 % Oberflächenfeuchte, solange die Raumluft unter X % relativer Feuchte bleibt"). Die 20.000-Euro-Entscheidung braucht einen Variantenvergleich für den eigenen Grundriss, und die Energieberatung braucht etwas, das Ratsuchende mitnehmen können.',
    problemEn: 'Since May 2025, EnergyMap Berlin forecasts the heat demand of Berlin\'s building stock. What remains open: what does my apartment do? The mold dispute needs a statement both sides can check ("this corner stays below 80 % surface humidity as long as room air stays below X % relative humidity"). The €20,000 decision needs a variant comparison for one\'s own floor plan, and energy consulting needs something advice-seekers can take home.',
    whyNowDe: [
      'Grundriss aus Foto oder PDF gibt es als Produkt (RoomSketcher, FloorScan); Öffnungen werden schlechter erkannt als Wände, deshalb bestätigt der Mensch jeden Treffer.',
      'Baualtersklassen-Parameter aus der IWU-Gebäudetypologie (TABULA); die Streuung innerhalb der Klasse ist das Band, das die Oberfläche zeigen muss.',
      'Stationäre 2D-Wärmeleitung läuft mit JavaScript oder WASM im Browser; WebGL2 lohnt erst für die instationäre Echtzeit-Animation.',
      'DWD/BBSR-Testreferenzjahre liefern ortsgenaue Stundenwetterdaten.',
      'EnergyMap bietet CSV-Download und Energieatlas-Dienste, energymap4py ist auf GitHub veröffentlicht; abfragbare Attribute sind vorab zu prüfen.'
    ],
    whyNowEn: [
      'Floor plan from photo or PDF exists as a product (RoomSketcher, FloorScan); openings are recognized worse than walls, so a human confirms every detection.',
      'Construction-era parameters from the IWU building typology (TABULA); the spread within a class is the band the interface has to show.',
      'Steady-state 2D heat conduction runs in the browser with JavaScript or WASM; WebGL2 pays off only for the transient real-time animation.',
      'DWD/BBSR test reference years provide location-specific hourly weather data.',
      'EnergyMap offers CSV download and Energy Atlas services, and energymap4py is published on GitHub; queryable attributes have to be checked first.'
    ],
    sketchDe: 'Rastereditor für Wände, Fenster, Heizkörper; Adresse lädt Gebäudekontext. Wärmeleitung in zwei Schnitten (horizontal für Ecken und Laibungen, vertikal für Decke, Brüstung, Heizkörpernische), Raumluft als durchmischter Knoten. Schimmelrisiko als 80-%-Oberflächenfeuchte (fRsi ≥ 0,70), nicht als Taupunkt; Ausgabe als Temperaturfeld, Feuchtegrenze der Ecke und Verbrauch als Band, nie als Einzelzahl. Direkter A/B-Vergleich zweier Varianten.',
    sketchEn: 'Grid editor for walls, windows, radiators; address loads building context. Heat conduction in two sections (horizontal for corners and reveals, vertical for ceiling, parapet, radiator niche), room air as one well-mixed node. Mold risk as 80 % surface humidity (fRsi ≥ 0.70), not dew point; output as temperature field, the corner\'s humidity limit and consumption as a band, never a single number. Direct A/B comparison of two variants.',
    firstStepDe: {
      ticket: 'Eine Außenecke, ein Fenster, ein Heizkörper, stationär.',
      criteria: 'Rastereditor für einen Raum mit zwei Außenwänden, Regler für Wand-U, Fenster-U, Luftwechsel, Raumfeuchte. Fertig, wenn der 2D-Löser die Testfälle aus Anhang A der DIN EN ISO 10211 reproduziert und die Heizleistung eine Handrechnung nach DIN EN 12831 auf 10 % trifft.'
    },
    firstStepEn: {
      ticket: 'One outer corner, one window, one radiator, steady-state.',
      criteria: 'Grid editor for a room with two exterior walls, sliders for wall U, window U, air exchange, room humidity. Done when the 2D solver reproduces the test cases from Annex A of DIN EN ISO 10211 and the heating power matches a hand calculation per DIN EN 12831 within 10 %.'
    },
    failureModeDe: 'Scheingenauigkeit: Eine Simulation, die präzise aussieht und falsch ist, richtet bei fünfstelligen Sanierungsentscheidungen und im Mietstreit echten Schaden an. Gegenmaßnahme: nie eine Einzelzahl und nie „unbedenklich" (ein 2D-Schnitt unterschätzt echte Raumecken, das Band ist einseitig optimistisch), Validierung gegen etablierte Verfahren, Nicht-Anspruch in der Oberfläche.',
    failureModeEn: 'False precision: a simulation that looks precise and is wrong does real damage in five-figure renovation decisions and rent disputes. Remedy: never a single number and never "harmless" (a 2D section underestimates real room corners, so the band is one-sidedly optimistic), validation against established methods, disclaimer in the interface.',
    priorArtDe: 'Verengt (19.9.2026): Ubakus „Thermische Simulation" (seit 11/2023) rechnet Heizwärme und Sommerüberhitzung als Zonenmodell mit einer Lufttemperatur, ohne Grundriss und Ecken — die Sommerrichtung ist auf Zonenebene besetzt. Wärmebrücken-Werkzeuge (Schöck, Ubakus-U-Wert, ThermCAD, Better Building) rechnen Bauteile für Fachleute; fRsi-Rechner liefern Einzelzahlen. Nicht gefunden: ein Laienwerkzeug aus Grundriss, räumlicher Oberflächentemperatur, Feuchtegrenze und A/B.',
    priorArtEn: 'Narrowed (19 Sep 2026): Ubakus "Thermische Simulation" (since 11/2023) computes heating demand and summer overheating as a zone model with one air temperature, without floor plan or corners — the summer direction is taken at zone level. Thermal-bridge tools (Schöck, Ubakus U-value, ThermCAD, Better Building) compute components for professionals; fRsi calculators give single numbers. Not found: a layperson\'s tool combining floor plan, spatial surface temperature, humidity limit and A/B.'
  },
  {
    id: 'sperrmuell-radar',
    title: 'Sperrmüll-Radar',
    oneLinerDe: 'Foto vom Straßenfund → Klassifikation → Geo-Pin, der nach zwölf Stunden verfällt. Kein Account, kein Besitz, keine Datenhaltung über den Tag hinaus.',
    oneLinerEn: 'Snap street find → on-device classification → geo-pin expiring after 12 hours. No account, no ownership, zero data retention past the day.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'CityLAB Berlin (Technologiestiftung) · nachrangig: BSR, OpenStreetMap Berlin, Prototype Fund',
    recipientsEn: 'CityLAB Berlin (Technology Foundation) · secondary: BSR, OpenStreetMap Berlin, Prototype Fund',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Berlin', 'Kreislaufwirtschaft', 'Bordstein', 'Datenschutz', 'Ephemeral'],
    problemDe: 'Berlin hat ein etabliertes Verschenk-Protokoll ohne Server: Karton, Bordstein, Pappschild. Aber der Kreislauf ist zu langsam: Brauchbare Dinge stehen im Regen, bis sie Müll sind. Eine App existiert nicht, weil sich ohne Accounts und Tracking kein Geld verdienen lässt.',
    problemEn: 'Berlin has a functioning gift protocol with zero servers: cardboard box, curb, handwritten sign. But discovery is too slow: useful furniture sits in rain until ruined. No commercial app exists because a zero-account ephemeral utility has no ad business model.',
    whyNowDe: [
      'Klassifikation on-device ist heute gratis und schnell („Holzstuhl, intakt").',
      'Keine Fotos auf dem Server nötig: nur Kategorie und gerundete Koordinate verlassen das Gerät.',
      '12-Stunden-Halbwertszeit macht Moderation, Löschkonzepte und DSGVO-Speicherfristen obsolet.'
    ],
    whyNowEn: [
      'On-device image classification is free, fast, and local ("wooden chair, usable").',
      'Zero server-side image storage: only anonymous category and jittered coordinates leave device.',
      '12-hour TTL eliminates user moderation, account databases, and GDPR retention hurdles.'
    ],
    sketchDe: 'Progressive Web App. Foto machen → On-device-Klassifikation → Pin mit 50m Unschärfe auf Karte. Nach 12 Stunden automatisch gelöscht. Einziger Interaktionsknopf: „Weg / Schon mitgenommen" löscht Pin sofort.',
    sketchEn: 'Progressive Web App. Snap photo → local classification → pin with 50m jitter on map. Disappears after 12 hours. Only button: "Gone / Taken" immediately clears the pin.',
    firstStepDe: {
      ticket: 'Ein Bezirk, eine Karte, ein Verfall.',
      criteria: 'Zwei Personen setzen in einem Kiez Pins, sehen sie sofort, und am nächsten Morgen ist die Karte automatisch leer.'
    },
    firstStepEn: {
      ticket: 'One neighborhood, one map, one TTL expiration.',
      criteria: 'Two people place pins in one Kiez, see each other\'s finds, and next morning the map is completely clear.'
    },
    failureModeDe: 'Denunziationsgefahr: Stadtverwaltung könnte es als illegale Müllmelder-App missbrauchen. Gegenmaßnahme: Keine Fotos serverseitig, ungenaue Koordinaten (~50m), kurze TTL, kein Archiv.',
    failureModeEn: 'Denunciation risk: Authorities might misuse it as an illegal fly-tipping reporting map. Countermeasure: Grobe coords (~50m), no photos stored, strictly 12h TTL, zero historic archive.',
    priorArtDe: 'Kommunale Müll-Apps (BSR) verwalten offizielle Sperrmüll-Termine; Kleinanzeigen erfordert Accounts und Verhandlung. Die Lücke am Straßenrand bleibt unbesetzt.',
    priorArtEn: 'Municipal waste apps manage scheduled pickups; classifieds (Kleinanzeigen) require accounts and chat negotiations. Real-time curb discovery remains vacant.'
  },
  {
    id: 'kiez-laermkarte',
    title: 'Kiez-Lärmkarte',
    oneLinerDe: 'Nicht wie laut eine Straße im Jahresmittel ist, sondern wann sie leise ist — gemessen von Handys, die nur dB-Pegel erfassen und nie Audio.',
    oneLinerEn: 'Not how loud a street is in yearly averages, but when it is quiet — measured by phones capturing only dB levels and never raw audio.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Noise-Planet / NoiseCapture (Université Gustave Eiffel + CNRS) · parallel: CityLAB Berlin · nachrangig: Prototype Fund',
    recipientsEn: 'Noise-Planet / NoiseCapture (Université Gustave Eiffel + CNRS) · parallel: CityLAB Berlin · secondary: Prototype Fund',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Berlin', 'Lärmschutz', 'Akustik', 'Datenschutz', 'Open Data'],
    problemDe: 'Der Berliner Lärmaktionsplan liefert theoretische Modellwerte und Jahresmittelwerte. Menschen wollen aber wissen: „Kann ich hier schlafen?", „Wann kann ich mit offenem Fenster arbeiten?". Jahresmittelwerte mitteln die Zeitstruktur weg, die eigentlich die Information ist.',
    problemEn: 'Strategic noise action plans publish annual modeled decibel averages. But residents need to know: "Can I sleep here with windows open?", "Which hours are tranquil for focused work?". Averages erase temporal rhythm.',
    whyNowDe: [
      'On-device-Pegelmessung verwirft Audiosignal sofort — Null Abhör-Risiko.',
      'Relative Kalibrierung über viele Messungen löst Streuung von Handymikrofonen.',
      'Amtliche Lärmkarten existieren bereits als Kalibrierungs- und Plausibilitätsanker.'
    ],
    whyNowEn: [
      'On-device measurement discards audio immediately — zero wiretapping/privacy risk.',
      'Relative cross-calibration solves smartphone microphone hardware variances.',
      'Official modeled maps serve as realistic baseline sanity checks.'
    ],
    sketchDe: 'Interaktive Karte mit Zeitschieberegler (Uhrzeit / Wochentag) statt starrem dB-Farbbild. Zeigt „Ruhe-Fenster" je Straßenabschnitt. Vollständige lokale Aggregation auf dem Endgerät.',
    sketchEn: 'Interactive map with time-of-day and day-of-week slider instead of a static average color wash. Highlights quiet windows per street block. Pure on-device aggregation before sync.',
    firstStepDe: {
      ticket: 'Ein Straßenabschnitt, eine Woche, ein Tagesprofil.',
      criteria: 'Zwei Geräte nebeneinander messen innerhalb von 3 dB; das Wochenend-Nachtprofil und der Berufsverkehr zeichnen sich klar ab.'
    },
    firstStepEn: {
      ticket: 'One street segment, one week, one daily profile.',
      criteria: 'Two phones placed together agree within 3 dB; weekend night spikes and commuter rushes clearly emerge in the temporal profile.'
    },
    failureModeDe: 'Audio-Datenschutz: Wenn auch nur eine Millisekunde Roh-Audio auf Festplatte oder Netz landet, scheitert das Projekt. Das muss hardwarenah architektonisch verunmöglicht werden.',
    failureModeEn: 'Audio privacy breach: If even one millisecond of raw audio touches disk or network, the project is fatally compromised. Architecture must make audio capture physically impossible.',
    priorArtDe: 'NoiseCapture sammelt weltweite Lärmmessungen, konzentriert sich aber auf Pegelkarten statt auf das Finden von Ruhe-Fenstern.',
    priorArtEn: 'NoiseCapture collects global noise metrics but focuses on sound intensity rather than temporal tranquility windows.'
  },
  {
    id: 'klarlokal',
    title: 'KlarLokal (The Battering Ram)',
    oneLinerDe: '100% offline, WebGPU-gestützte Übersetzung von bedrohlichem Beamtendeutsch in Leichte Sprache (DIN SPEC 33429) — ohne dass ein einziges Byte das Gerät verlässt.',
    oneLinerEn: '100% offline, WebGPU-powered on-device translation of intimidating bureaucratic letters into plain language (DIN SPEC 33429) — zero bytes ever leave the browser.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Prototype Fund (Runde Herbst 2026 / BMBF) · nachrangig: CityLAB Berlin, GovTech Hackathons, Berliner Flüchtlingsrat & Erwerbslosen-Initiativen',
    recipientsEn: 'Prototype Fund (Autumn 2026 Intake) · secondary: CityLAB Berlin, GovTech Hackathons, Berlin Refugee Council & Freelancers Guild',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Berlin', 'Zivilgesellschaft', 'Behörden', 'Leichte Sprache', 'WebGPU', 'Datenschutz', 'Prototype Fund', 'AI-Native'],
    problemDe: 'Das Öffnen behördlicher Post (Finanzamt, Jobcenter, Ausländerbehörde) löst bei Millionen Menschen Panik aus. Kommerzielle KI-Tools fordern den Upload vertraulicher Finanz-, Rechts- und Aufenthaltsdaten auf US-Cloud-Server — ein fataler Verstoß gegen DSGVO und Sozialgeheimnis. Viele Briefe bleiben aus Angst ungeöffnet, bis Fristen verstreichen.',
    problemEn: 'Navigating German administrative mail (Finanzamt, Arbeitsamt, Ausländerbehörde) induces panic. Commercial AI tools require uploading highly sensitive personal financial and legal documents to third-party cloud servers, violating privacy and eroding trust. Letters sit unopened until deadlines lapse.',
    whyNowDe: [
      'WebLLM führt quantisierte Sprachmodelle per WebGPU direkt im lokalen Browser-Cache aus (0 Byte Netzwerklast).',
      'German4All-Modellgewichte (Ende 2025) sind explizit auf lesbarkeitskontrollierte Textvereinfachung (Leichte Sprache / DIN SPEC 33429) trainiert.',
      'Offene Behörden-KlarText-Systemprompts des BMAS (Bundesministerium für Arbeit und Soziales) entschlüsseln amtlichen Nominalstil mit den eigenen Kriterien des Staates.',
      'WASM-OCR und PDF.js parsen Scans und Handyfotos vollständig auf dem Endgerät.',
      'Vite & Astro 5 PWA-Architektur garantiert vollständigen Offline-Betrieb selbst im Flugmodus.'
    ],
    whyNowEn: [
      'WebLLM runs quantized language models directly in the user browser cache via WebGPU (0 bytes network traffic).',
      'German4All open-weights (late 2025) are explicitly fine-tuned for readability-controlled German text simplification (DIN SPEC 33429).',
      'Open-source system prompts from the Federal Ministry of Labour and Social Affairs (BMAS Behörden-KlarText) decode official Nominalstil using the state\'s own linguistic parameters.',
      'WASM OCR and PDF.js parse scans and photos purely on-device without cloud computer vision.',
      'Vite & Astro 5 PWA caching guarantees 100% offline edge execution even in airplane mode.'
    ],
    sketchDe: 'Lokale PWA: Drag-and-drop eines gescannten Behördenbriefs. Lokales OCR + German4All WebGPU-Pipeline liefert in unter 5 Sekunden exakt drei Dinge: 1. Das Urteil (Was bedeutet das in einem einfachen Satz?), 2. Die Frist (Bis wann muss ich handeln?), 3. Die Checkliste (Welche 3 Schritte gehe ich jetzt der Reihe nach?). Inklusive Vorlage für Fristverlängerung.',
    sketchEn: 'Local-first PWA: Drag-and-drop a scanned administrative letter. Local OCR + German4All WebGPU pipeline delivers strictly three outputs in under 5 seconds: 1. The Verdict (What does this mean in one sentence?), 2. The Deadline (Exactly when must I act?), 3. The Checklist (What 3 steps do I take next?). Includes one-click extension request generator.',
    firstStepDe: {
      ticket: 'Ein Bescheid, ein Browser-Tab, drei Antworten offline.',
      criteria: 'Muster-Finanzamtbescheid wird bei gekappter WLAN-Verbindung im Browser fallengelassen; Ausgabe von Urteil, Fristdatum und 3-Punkte-Checkliste in unter 5 Sekunden via WebGPU.'
    },
    firstStepEn: {
      ticket: 'One letter, one browser tab, three offline answers.',
      criteria: 'Sample tax assessment dropped into browser with Wi-Fi disabled; outputs verdict, deadline date, and 3-step checklist in under 5 seconds via WebGPU.'
    },
    failureModeDe: 'Verwässerung der Zero-Cloud-Grenze oder juristisches Risiko: Sobald Cloud-Fallback einzieht, wird KlarLokal zum schlechteren Klon von Zetteln. Gegenmaßnahme: Zero-Cloud ist das Kernversprechen; deterministischer Datumsfilter parallel zum LLM, Quelltext-Verlinkung und striktes Framing als Lesegerät (kein Anwaltsersatz).',
    failureModeEn: 'Diluting the zero-cloud boundary or legal advice risk: Introducing cloud fallbacks makes KlarLokal a worse clone of Zetteln. Countermeasure: Zero-cloud is the core differentiator; dual deterministic regex alongside LLM, synchronized source highlights, and strict framing as a reading aid.',
    priorArtDe: 'Recherche September 2026: Zetteln (zetteln.app) macht fast genau das (Foto → Leichte Sprache + Fristen, DSGVO-konform), aber mit EU-Cloud-Fallback. KlarLokal besetzt die Nische mit strikter Zero-Cloud-Garantie für Beratungsstellen und Menschen mit unsicherem Aufenthaltsstatus.',
    priorArtEn: 'September 2026 research: Zetteln (zetteln.app) already does letter simplification and deadlines, but uses an EU-cloud fallback. KlarLokal narrows strictly to a 100% zero-cloud edge guarantee for users who cannot accept any external data transmission.',
    emailTemplate: {
      subjectDe: 'Schenkung für den Prototype Fund: KlarLokal – Das Brecheisen gegen Beamtendeutsch (100% Offline PWA)',
      bodyDe: 'Liebes Prototype-Fund-Team und Civic-Tech-Community,\n\nich übergebe hiermit ein fertig durchdachtes Dossier für die Herbst-Runde 2026: „KlarLokal – Das Brecheisen".\n\nZiel: Beseitigung der behördlichen Briefkasten-Panik durch eine 100% offline lauffähige Übersetzungs-Pipeline für Beamtendeutsch in Leichte Sprache (DIN SPEC 33429). Dank WebGPU, WebLLM und German4All verlässt kein einziges Byte das Gerät.\n\nDas Tool beantwortet genau drei Fragen:\n1. Das Urteil (Ein einfacher Satz)\n2. Die Frist (Konkretes Handlungsdatum)\n3. Die Checkliste (Drei aufeinanderfolgende Schritte)\n\nDie Architektur und Primitiven stehen. Nehmen Sie die Idee, reichen Sie sie ein, bauen Sie sie — als bedingungsloses Geschenk (CC0).\n\nMit besten Grüßen aus Berlin,\nFélix',
      subjectEn: 'Gift Proposal for Prototype Fund: KlarLokal – The Battering Ram (100% Offline Civic PWA)',
      bodyEn: 'Dear Prototype Fund team and Civic Tech community,\n\nI am presenting a fully articulated open-source project dossier for the Autumn 2026 Prototype Fund intake: "KlarLokal (The Battering Ram)".\n\nMission: Eradicate administrative letter anxiety through a 100% local-first translation engine decoding Beamtendeutsch into plain language (DIN SPEC 33429). By combining WebGPU, WebLLM, and German4All weights, zero personal data ever touches a server.\n\nDelivers strictly three outputs: The Verdict, The Deadline, and The Checklist.\n\nThe primitives and architecture are resolved. Take the dossier and build it — an unconditional civic gift (CC0).\n\nWarm regards from Berlin,\nFélix',
      to: 'info@prototypefund.de'
    },
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Wortlisten-Übersetzer konnten den verschachtelten Nominalstil und die juristischen Passiv-Konstruktionen deutscher Amtsbriefe nicht sinngemäß auflösen; lokale LLM-Inferenz im Browser ohne Server war vor WebGPU und quantisierten Gewichten technisch undenkbar.',
      impossibleBeforeAiEn: 'Traditional rule-based parsers failed on German administrative Nominalstil and subjunctive legal clauses; running local LLM inference inside browser memory without a GPU server was impossible before WebGPU.',
      aiTechStack: ['WebLLM / WebGPU', 'German4All (Open Readability Weights)', 'BMAS Behörden-KlarText System Prompts', 'PDF.js & WASM OCR', 'Astro 5 + Vite PWA Cache'],
      privacyModelDe: '100% Local-First / Zero-Knowledge: Sämtliche Berechnungen, Texterkennungen und Sprachmodelle laufen im Browser-Arbeitsspeicher auf dem Endgerät. Keine Server, keine Telemetrie, keine DSGVO-Haftung.',
      privacyModelEn: '100% Local-First / Zero-Knowledge: All OCR, inference, and text simplification execute in local browser memory via WebGPU. Zero servers, zero telemetry, zero GDPR liability.',
      ordinaryPeopleBenefitDe: 'Nimmt vulnerablen Menschen, Zugewanderten und Selbstständigen die lähmende Angst vor dem Briefkasten und schützt vor unverschuldeten Kontensperrungen und Fristversäumnissen.',
      ordinaryPeopleBenefitEn: 'Removes debilitating fear of administrative mail for immigrants, freelancers, and working families, preventing unjustified account seizures and missed deadlines.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Lokale Dokumenten-Extraktion', focus: 'WASM-basiertes OCR und PDF.js für schiefe Smartphone-Fotos von Behördenschreiben', milestone: 'Lokale Textextraktion mit Konfidenzwerten in unter 1 Sekunde' },
        { step: 2, title: 'Woche 2: WebGPU-Inferenz mit German4All', focus: 'Streaming-Integration von WebLLM mit quantisiertem German4All-Modell im Browser-Cache', milestone: 'Erste fehlerfreie lokale Inferenz auf Standard-Laptops ohne Netzwerkaufruf' },
        { step: 3, title: 'Woche 3: BMAS Behörden-KlarText Prompts', focus: 'Adaption der Ministeriums-Prompts für DIN SPEC 33429 (Urteil, Frist, Checkliste)', milestone: 'Konsistente Reduktion von 4-seitigen Bescheiden auf den 3-Punkte-Dreiklang' },
        { step: 4, title: 'Woche 4: Deterministischer Frist-Guard & Offline-PWA', focus: 'Regex-Sicherheitsnetz gegen Frist-Halluzinationen und Service-Worker-Offline-Bundle', milestone: 'Funktionsfähiger Prototype-Fund-Bewerbungsprototyp' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Local Document Extraction', focus: 'WASM-based OCR and PDF.js handling skewed smartphone snapshots of official letters', milestone: 'Sub-second on-device optical extraction with confidence scores' },
        { step: 2, title: 'Week 2: WebGPU Inference with German4All', focus: 'Streaming WebLLM integration with quantized German4All weights in IndexedDB cache', milestone: 'First zero-network inference running cleanly on commodity laptops' },
        { step: 3, title: 'Week 3: BMAS Behörden-KlarText System Prompts', focus: 'Adapting ministry prompt architecture for DIN SPEC 33429 output triade', milestone: 'Consistent distillation of 4-page formal notices into verdict, deadline, and checklist' },
        { step: 4, title: 'Week 4: Deterministic Deadline Guard & Offline PWA', focus: 'Regex safety net preventing date hallucinations and offline service worker packaging', milestone: 'Fully testable submission-ready prototype for the Prototype Fund' }
      ]
    }
  },
  {
    id: 'crack-flora-watcher',
    title: 'Crack Flora Watcher (Ritzengrün)',
    oneLinerDe: 'Citizen-Science-App für Pflanzen, die Asphalt und Mauerrisse bezwingen — mit Toughness-Index, Zeitraffer-Tracking und direkter Forschungsbrücke zur Senckenberg #Krautschau.',
    oneLinerEn: 'A citizen science app turning sidewalks and asphalt cracks into a living scavenger hunt with a Toughness Index, time-lapse tracking, and direct research integration with #Krautschau & Flora Incognita.',
    date: 'September 2026',
    reviewAfter: 'Mai 2027',
    recipientsDe: '#Krautschau / Senckenberg Gesellschaft für Naturforschung (Dr. Julia Krohmer) · Flora Incognita Forschungsgruppe (MPI Jena / TU Ilmenau) · NABU StadtNatur Berlin',
    recipientsEn: '#Krautschau / Senckenberg Society for Nature Research · Flora Incognita Research Group (MPI Biogeochemistry / TU Ilmenau) · NABU Urban Biodiversity',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Citizen Science', 'Urbane Ökologie', 'Botanik', 'Gamification', '#Krautschau', 'Biodiversität', 'Berlin'],
    problemDe: 'Täglich laufen Millionen Menschen an faszinierenden Wildpflanzen im Gehwegasphalt vorbei, ohne sie wahrzunehmen („Plant Blindness"). Generische Bestimmungs-Apps bieten keine emotionale Bindung, während Initiativen wie #Krautschau eine dauerhafte mobile Plattform für ganzjähriges Zeitraffer-Monitoring vermissen.',
    problemEn: 'People walk past fascinating plants surviving in concrete cracks every day without noticing them. General plant apps lack thematic focus or community identity, while grassroots campaigns like #Krautschau lack an interactive mobile app for year-round time-lapse observations and crowdsourced urban ecology data.',
    whyNowDe: [
      'Die jährliche #Krautschau der Senckenberg Gesellschaft mobilisiert jeden Mai Zehntausende Bürger zur Kreide-Aktion, sucht aber nach digitaler Verstetigung.',
      'Flora Incognita hat mit Projekten wie GartenDiv und PhänoNetz (DWD) bewiesen, dass spezifische Forschungstags in Citizen-Science-Apps enorm skaliert werden können.',
      'On-Device Edge-Vision (TensorFlow Lite / WebGPU) identifiziert die 50 häufigsten Pflasterritzen-Pioniere sofort offline.',
      'Klimaerwärmung und urbane Hitzeinseln machen die Besiedlung von Pflasterritzen zu einem hochaktuellen Indikator für urbane Resilienz.'
    ],
    whyNowEn: [
      'The annual #Krautschau campaign by Senckenberg mobilizes tens of thousands of citizens with sidewalk chalk each May, but lacks a dedicated persistent app.',
      'Flora Incognita proved with GartenDiv and DWD PhänoNetz that specialized project tags in citizen science apps yield peer-reviewed ecological data.',
      'On-device edge vision instantly classifies the top 50 urban pavement pioneer species without cloud dependencies.',
      'Urban heat island effects and extreme street microclimates make crack flora crucial bio-indicators for city climate resilience.'
    ],
    sketchDe: 'Rebel Botanist Dashboard: Kamera-Schnappschuss einer Pflanze im Riss berechnet sofort Art, Substrat-Schwierigkeit und den „Toughness Index" (1–10). Foto-Ausrichtungstool ermöglicht Zeitraffer-Serien des Wachstums über Monate. Exportfähige Kiez-Heatmap der „grünen Adern" und 1-Klick-Spende an #Krautschau.',
    sketchEn: 'Rebel Botanist Dashboard: Camera snapshot of a plant surviving in a crack calculates species, substrate adversity, and a Toughness Index (1-10). Contour-matching camera guide enables multi-month growth time-lapses. Interactive city heatmap and 1-click export to Senckenberg and Flora Incognita.',
    firstStepDe: {
      ticket: 'Ein Pflasterriss, zwei Fotos, ein Toughness-Score.',
      criteria: 'Foto eines Löwenzahns im Asphalt liefert Artbestimmung, berechnet Toughness-Index (z. B. 8.5/10) und generiert einen validen GeoJSON-Export für Forschungspartner.'
    },
    firstStepEn: {
      ticket: 'One pavement crack, two snapshots, one Toughness score.',
      criteria: 'A sidewalk dandelion photo yields instant species ID, calculates a calibrated Toughness Index (e.g. 8.5/10), and produces valid GeoJSON for academic partners.'
    },
    failureModeDe: 'Verwechslung mit Seek: Seek (iNaturalist) gamifiziert Ritzenpflanzen bereits mit Badges und Challenges. Wer diese Dose als „Seek für Ritzen" liest, sollte sie nicht bauen. Der einzige tragfähige Unterschied ist die Longitudinalspur (dieselbe Pflanze über Wochen/Monate) und der direkte #Krautschau-/GBIF-Export.',
    failureModeEn: 'Confusion with Seek: Seek (iNaturalist) already gamifies sidewalk crack plants with badges. The only defensible niche is the longitudinal per-plant time-lapse across months and the direct #Krautschau/GBIF format pipeline.',
    priorArtDe: 'Recherche September 2026: Die Grundidee existiert bereits. Seek (iNaturalist) gamifiziert Ritzenpflanzen mit Badges; PlantNet & Flora Incognita liefern saubere Taxonomie; #Krautschau macht das Mai-Ritual. Die echte Lücke ist ein Werkzeug für saisonale Longitudinal-Dokumentation derselben Einzelpflanze.',
    priorArtEn: 'September 2026 research: Urban crack gamification exists. Seek (iNaturalist) has badges and challenges; PlantNet and Flora Incognita handle taxonomy; #Krautschau runs the annual May campaign. The real remaining gap is tracking the exact same plant longitudinally across seasons with automated GBIF export.',
    emailTemplate: {
      subjectDe: 'Ideen-Schenkung: Crack Flora Watcher – Ganzjährige App & Toughness-Index für #Krautschau',
      bodyDe: 'Liebe Frau Dr. Krohmer, liebe Frau Prof. Dr. Klein, liebes #Krautschau-Team,\n\nich verfolge Ihre jährliche #Krautschau-Aktionswoche im Mai mit riesiger Begeisterung. Die Idee, mit bunter Straßenkreide und offenen Augen das Bewusstsein für die heimlichen Helden unseres Asphalts zu schärfen, hat den Blick tausender Menschen auf ihre Stadt für immer verändert.\n\nUm diese Welle nicht nach dem Mai abebben zu lassen, habe ich ein vollständiges Produkt- und Interaktionskonzept ausgearbeitet, das ich Ihnen bedingungslos schenken möchte: „Crack Flora Watcher" (Ritzengrün-Wächter).\n\nDer Kern des Konzepts:\n1. Der „Toughness Index" (1–10): Statt trockenem Bestimmungs-Latein bewertet die App den Überlebenswillen der Pflanze — berechnet aus Substrat-Härte (reiner Asphalt vs. Mauerritze), Trittbelastung und städtischem Hitzeinsel-Faktor. Das kürt den wahren „König der Ritzen".\n2. Kanten-ausgerichtetes Zeitraffer-Tracking: Ein Kamera-Overlay gleicht die Konturen des Asphaltrisses ab, sodass Bürger dieselbe Pflanze über Wochen und Monate hinweg vom Keimling bis zur Samenreife fotografieren können.\n3. Direkte Brücke zu Senckenberg & GBIF: Jede Beobachtung wird mit 25m-Geofuzzing (zum Schutz privater Hauseingänge) in standardisiertem GeoJSON erfasst und kann mit einem Klick für die stadtökologische Forschung exportiert werden.\n\nDas Dossier enthält die vollständige Architektur, User Journeys für Schulen, Pendler und Familien, sowie ein erstes minimales Ticket („Ein Pflasterriss, zwei Fotos, ein Toughness-Score").\n\nDieses Konzept ist ein Geschenk (CC0, Public Domain). Sie schulden mir nichts — keine Nennung, keine Rückmeldung. Wenn es Ihnen für die Vorbereitung der Aktionswoche 2027 hilft oder Sie Teile davon in bestehende Schulmaterialien einbauen möchten: Nehmen Sie es, wandeln Sie es ab und machen Sie daraus, was Ihnen nützt.\n\nMit herzlichen Grüßen aus Berlin,\nFélix',
      subjectEn: 'Free Idea Gift: Crack Flora Watcher – Year-Round Mobile Experience & Toughness Index for #Krautschau',
      bodyEn: 'Dear Dr. Julia Krohmer, dear Prof. Dr. Alexandra-Maria Klein, dear #Krautschau team,\n\nI follow your annual #Krautschau week in May with immense admiration. Chalk-marking sidewalk plants has transformed how thousands of city dwellers perceive urban wild nature.\n\nTo carry this momentum year-round, I have structured an end-to-end product and gamification dossier that I want to gift you unconditionally: "Crack Flora Watcher" (Ritzengrün-Wächter).\n\nCore primitives:\n1. The "Toughness Index" (1-10): Gamifying hardiness based on substrate adversity (solid bitumen vs. curb seams), foot compaction, and heat island stress.\n2. Contour-aligned time-lapse: Smartphone camera overlay matching crack fissures so citizens record serialized growth stages over months.\n3. Turnkey citizen science export: 25m geo-fuzzed observations outputting standardized GeoJSON directly ingestible into Senckenberg research databases.\n\nThis dossier is completely CC0 (Public Domain). You owe me nothing — no attribution, no reply. Take it, adapt it, and use whatever serves the movement.\n\nWarm regards from Berlin,\nFélix',
      to: 'julia.krohmer@senckenberg.de'
    },
    emailTemplates: [
      {
        recipientName: '#Krautschau / Senckenberg (Dr. Julia Krohmer)',
        to: 'julia.krohmer@senckenberg.de',
        subjectDe: 'Ideen-Schenkung: Crack Flora Watcher – Ganzjährige App & Toughness-Index für #Krautschau',
        bodyDe: 'Liebe Frau Dr. Krohmer, liebe Frau Prof. Dr. Klein, liebes #Krautschau-Team,\n\nich verfolge Ihre jährliche #Krautschau-Aktionswoche im Mai mit riesiger Begeisterung. Die Idee, mit bunter Straßenkreide und offenen Augen das Bewusstsein für die heimlichen Helden unseres Asphalts zu schärfen, hat den Blick tausender Menschen auf ihre Stadt für immer verändert.\n\nUm diese Welle nicht nach dem Mai abebben zu lassen, habe ich ein vollständiges Produkt- und Interaktionskonzept ausgearbeitet, das ich Ihnen bedingungslos schenken möchte: „Crack Flora Watcher" (Ritzengrün-Wächter).\n\nDer Kern des Konzepts:\n1. Der „Toughness Index" (1–10): Statt trockenem Bestimmungs-Latein bewertet die App den Überlebenswillen der Pflanze — berechnet aus Substrat-Härte (reiner Asphalt vs. Mauerritze), Trittbelastung und städtischem Hitzeinsel-Faktor. Das kürt den wahren „König der Ritzen".\n2. Kanten-ausgerichtetes Zeitraffer-Tracking: Ein Kamera-Overlay gleicht die Konturen des Asphaltrisses ab, sodass Bürger dieselbe Pflanze über Wochen und Monate hinweg vom Keimling bis zur Samenreife fotografieren können.\n3. Direkte Brücke zu Senckenberg & GBIF: Jede Beobachtung wird mit 25m-Geofuzzing (zum Schutz privater Hauseingänge) in standardisiertem GeoJSON erfasst und kann mit einem Klick für die stadtökologische Forschung exportiert werden.\n\nDas Dossier enthält die vollständige Architektur, User Journeys für Schulen, Pendler und Familien, sowie ein erstes minimales Ticket („Ein Pflasterriss, zwei Fotos, ein Toughness-Score").\n\nDieses Konzept ist ein Geschenk (CC0, Public Domain). Sie schulden mir nichts — keine Nennung, keine Rückmeldung. Wenn es Ihnen für die Vorbereitung der Aktionswoche 2027 hilft oder Sie Teile davon in bestehende Schulmaterialien einbauen möchten: Nehmen Sie es, wandeln Sie es ab und machen Sie daraus, was Ihnen nützt.\n\nMit herzlichen Grüßen aus Berlin,\nFélix',
        subjectEn: 'Free Idea Gift: Crack Flora Watcher – Year-Round Mobile Experience & Toughness Index for #Krautschau',
        bodyEn: 'Dear Dr. Julia Krohmer, dear Prof. Dr. Alexandra-Maria Klein, dear #Krautschau team,\n\nI follow your annual #Krautschau week in May with immense admiration. Chalk-marking sidewalk plants has transformed how thousands of city dwellers perceive urban wild nature.\n\nTo carry this momentum year-round, I have structured an end-to-end product and gamification dossier that I want to gift you unconditionally: "Crack Flora Watcher" (Ritzengrün-Wächter).\n\nCore primitives:\n1. The "Toughness Index" (1-10): Gamifying hardiness based on substrate adversity (solid bitumen vs. curb seams), foot compaction, and heat island stress.\n2. Contour-aligned time-lapse: Smartphone camera overlay matching crack fissures so citizens record serialized growth stages over months.\n3. Turnkey citizen science export: 25m geo-fuzzed observations outputting standardized GeoJSON directly ingestible into Senckenberg research databases.\n\nThis dossier is completely CC0 (Public Domain). You owe me nothing — no attribution, no reply. Take it, adapt it, and use whatever serves the movement.\n\nWarm regards from Berlin,\nFélix'
      },
      {
        recipientName: 'Flora Incognita / MPI Jena & TU Ilmenau (Dr. Jana Wäldchen)',
        to: 'kontakt@floraincognita.de',
        subjectDe: 'Kooperations-Idee als Geschenk: Crack Flora Watcher / Kampagnen-Tag für Flora Incognita',
        bodyDe: 'Liebe Frau Dr. Wäldchen, lieber Herr Prof. Dr. Mäder, liebes Flora-Incognita-Team,\n\nFlora Incognita ist zweifellos das wissenschaftliche Gold-Standard-Werkzeug für KI-gestützte Pflanzenbestimmung in Deutschland. Besonders beeindruckt hat mich, wie elegant Sie spezifische Forschungsfragen über Projekt-Tags skaliert haben — wie bei „GartenDiv" oder im PhänoNetz mit dem Deutschen Wetterdienst.\n\nIch möchte Ihnen ein fertig durchdachtes Kampagnen- und Datenmodell schenken: „Crack Flora Watcher" — ein urbanes Biodiversitäts-Modul für Extremstandorte (Pflasterfugen, Asphaltrisse, Mauerwerk).\n\nWarum dieser Zuschnitt wissenschaftlich und gesellschaftlich relevant ist:\n1. Indikator für urbane Hitzeinseln: Pflanzen in bituminösen Dehnungsfugen trotzen extremen Oberflächentemperaturen (>50 °C) und mechanischem Trittstress. Ihre Besiedlungsmuster sind ein hochaktueller Bio-Indikator für städtische Klimaresilienz.\n2. Der „Toughness Index": Eine mathematische Formel, die botanische Taxa mit mikroklimatischen Standortparametern (Substratklasse, Verdichtung, Versiegelungsgrad) verknüpft und so Bürgerwissenschaftlern einen spielerischen Zugang eröffnet.\n3. Nahtlose Integration in Flora Incognita: Statt einer redundanten App könnte das Konzept als offizieller Projekt-Tag (#Krautschau oder #CrackFlora) direkt in Flora Incognita implementiert werden — inklusive Kurzanleitung zum Kanten-synchronisierten Zeitraffer.\n\nIch habe das Konzept als vollständiges Dossier mit Daten-Schema, Risikofaktoren und dem ersten Umsetzungsschritt niedergelegt: Alles steht unter CC0 (Public Domain). Sie können die Architektur, das Scoring-Modell und die Ideen frei nutzen, in Förderanträge (z. B. BfN oder BMBF) einfließen lassen oder im nächsten Release verwerten.\n\nVielen Dank für Ihre herausragende Arbeit für die heimische Pflanzenvielfalt.\n\nBeste Grüße aus Berlin,\nFélix',
        subjectEn: 'Idea Gift & Collaboration Concept: Crack Flora Watcher / Campaign Tag for Flora Incognita',
        bodyEn: 'Dear Dr. Jana Wäldchen, dear Prof. Dr. Patrick Mäder, dear Flora Incognita team,\n\nFlora Incognita is the undisputed scientific gold standard for AI-based botanical recognition in Europe. I am particularly impressed by how successfully you scale focused ecological questions via custom campaign tags — such as "GartenDiv" or "PhänoNetz" with the German Weather Service.\n\nI want to gift you an end-to-end campaign and data blueprint: "Crack Flora Watcher" — an urban biodiversity module targeting hostile pavement cracks, asphalt fissures, and masonry joints.\n\nWhy this focus is ecologically and socially vital:\n1. Heat island bio-indicators: Pioneer flora surviving in pavement joints endure surface temperatures exceeding 50 °C and intense compaction. Their distribution is an invaluable proxy for city resilience under climate change.\n2. The Toughness Index: A deterministic formula marrying botanical taxonomy with micro-habitat adversity (bitumen porosity, soil volume, foot traffic), engaging casual explorers.\n3. Turnkey Flora Incognita integration: Instead of a redundant standalone app, this can function as an official project tag (#Krautschau or #CrackFlora) within Flora Incognita.\n\nThe entire dossier is CC0 (Public Domain). Feel free to adapt the schema, metrics, and workflows into your research grants or upcoming releases.\n\nWarm regards from Berlin,\nFélix'
      }
    ],
    aiFrontier: {
      impossibleBeforeAiDe: 'Automatisierte Bildsegmentierung von extremen Mikrolebensräumen (Erkennung von Rissbreite, Asphaltporosität und Trittschäden direkt aus einem Smartphone-Foto) war vor modernen Vision-Modellen nicht im Ansatz möglich.',
      impossibleBeforeAiEn: 'Automated substrate micro-habitat segmentation (calculating crack depth, asphalt degradation, and pedestrian compaction directly from raw smartphone photos) was impossible before modern computer vision.',
      aiTechStack: ['TensorFlow Lite On-Device Plant Classifier', 'PlantNet / Flora Incognita API Hybrid', 'OpenCV Contour-Alignment for Time-lapse', 'Mapbox / OSM Heatmap Layer', 'Local SQLite / PWA Cache'],
      privacyModelDe: 'Freiwillige Meldungen mit automatischem Noise-Offset (Fuzzing um 25m) im Wohnumfeld zum Schutz privater Hauseingänge.',
      privacyModelEn: 'Voluntary observations with automated 25m coordinate fuzzing around residential doorways to preserve resident privacy.',
      ordinaryPeopleBenefitDe: 'Macht alltägliche Fußwege zur spannenden Entdeckungsreise, bekämpft Pflanzenblindheit und verbindet Stadtmenschen ohne Garten mit ungezähmter Natur.',
      ordinaryPeopleBenefitEn: 'Transforms mundane daily commutes into rewarding nature safaris, cures plant blindness, and reconnects urbanites to resilient wild nature right underfoot.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Die 50 Asphalthelden klassifizieren', focus: 'Zusammenstellung eines Bilddatensatzes der häufigsten Pflasterfugen-Pflanzen Berlins', milestone: 'On-Device Modell erkennt Löwenzahn, Wegerich und Hirtentäschel im Asphalt' },
        { step: 2, title: 'Woche 2: Toughness-Index-Algorithmus', focus: 'Mathematisches Scoring aus Riss-Substrat, Besonnung und Trittfrequenz', milestone: 'Validierte Skala von 1 bis 10 mit nachvollziehbarer Punkteaufschlüsselung' },
        { step: 3, title: 'Woche 3: Kontur-geführtes Zeitraffer-Fotografieren', focus: 'Kamera-Overlay mit Kantenabgleich des Asphaltrisses für serielle Fotos', milestone: 'Drei Fotos im Abstand von Tagen werden pixelgenau übereinandergelegt' },
        { step: 4, title: 'Woche 4: #Krautschau-Datenexport & Übergabe', focus: 'Exportfilter für Senckenberg / GBIF und Versendung des Geschenkdossiers', milestone: 'Fertige Dose im Amélie-Katalog mit interaktivem Explorer' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Classifying the 50 Pavement Survivors', focus: 'Curating image dataset of dominant urban sidewalk crack plants in Berlin', milestone: 'On-device model recognizes dandelion, plantain, and shepherd’s purse in concrete' },
        { step: 2, title: 'Week 2: Toughness Index Algorithm', focus: 'Mathematical scoring factoring substrate adversity, solar exposure, and compaction', milestone: 'Calibrated 1-to-10 scale with clear point breakdown' },
        { step: 3, title: 'Week 3: Contour-Guided Time-Lapse Capture', focus: 'Camera overlay matching crack edges for repeatable multi-day alignment', milestone: 'Three consecutive photos align cleanly into an animated growth loop' },
        { step: 4, title: 'Week 4: #Krautschau Data Pipeline & Handover', focus: 'Export filters compliant with Senckenberg / GBIF and dossier delivery', milestone: 'Packaged dose active in Amélie gallery with interactive explorer' }
      ]
    }
  },
  {
    id: 'agent-postmortem-recorder',
    title: 'Agent Postmortem Recorder',
    oneLinerDe: 'Nicht ein weiteres Dashboard über Agent-Sessions, sondern die Konsequenz daraus — der konkrete CLAUDE.md-Patch gegen die Missverständnis-Klasse, die dich statistisch am meisten kostet.',
    oneLinerEn: 'Not another agent analytics dashboard, but the actionable consequence: a concrete CLAUDE.md patch targeting the mistake class costing you the most time and tokens.',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Claude-Code-Plugin-Community · bestehende Hook-Observability-Projekte · Anthropic DevRel',
    recipientsEn: 'Claude Code Plugin Community · existing Hook Observability projects · Anthropic DevRel',
    domain: 'tools',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['DevTools', 'AI Agents', 'Claude Code', 'Observability', 'Refactoring'],
    problemDe: 'In Multi-Agent-Setups wiederholen sich Fehler: dieselben falschen Annahmen, dieselben Konventionen, die ignoriert werden. Dashboards zeigen nur Token-Verbrauch, aber niemand generiert den 3-Zeilen-Patch für die Instruktionsdatei.',
    problemEn: 'Multi-agent developer setups suffer from repetitive regression loops. Observability tools graph token spend, but never generate the exact 3-line rule patch needed in CLAUDE.md to permanently inoculate against the recurring error.',
    whyNowDe: [
      'Session-Logs und Hook-Events liegen lokal und strukturiert vor.',
      'Clustering von Korrekturschleifen („Mensch greift ein") ist mit LLMs trivial.',
      'Diffs sind direkt anwendbar, Berichte verstauben.'
    ],
    whyNowEn: [
      'Session transcripts and hook logs are structured and stored locally.',
      'Clustering human correction loops across sessions is fast with local models.',
      'A rule diff can be merged immediately, whereas markdown reports get ignored.'
    ],
    sketchDe: 'Lokales Skript scannt Session-Logs nach Abbruch- und Korrekturmustern („nein, mach es anders"). Gruppiert nach Ursachen und generiert CLAUDE.md-Patch-Vorschläge sowie Vorschläge zum Entfernen toter Regeln.',
    sketchEn: 'Local CLI inspects session logs for human override commands. Clusters failure modes and proposes CLAUDE.md rule patches while also flagging dead rules for deletion.',
    firstStepDe: {
      ticket: 'Korrekturschleifen finden und zählen.',
      criteria: 'Gibt die 10 häufigsten menschlichen Korrekturen aus den letzten 20 Sessions mit Häufigkeit und Zitat aus.'
    },
    firstStepEn: {
      ticket: 'Find and count correction loops.',
      criteria: 'Parses last 20 sessions and outputs top 10 human override patterns with token cost and context citation.'
    },
    failureModeDe: 'Instruktions-Wucher: Eine 200-Zeilen-Regeldatei wird schlechter befolgt als eine kurze. Gegenmaßnahme: Das Tool muss zwingend auch ungenutzte Regeln zum Löschen vorschlagen.',
    failureModeEn: 'Rule bloat: A 200-line instruction file degrades model adherence. Remedy: The tool must symmetrically propose dead rule deletions.',
    priorArtDe: 'Verschiedene Hook-Observability-Tools listen Traces und Events, bieten aber keine automatische Regelableitung.',
    priorArtEn: 'Various hook observability tools visualize traces and telemetry, but none synthesize concise instruction file patches.'
  },
  {
    id: 'bugs-spaced-repetition',
    title: 'Bugs als Spaced-Repetition',
    oneLinerDe: 'Lerne aus deinen eigenen behobenen Fehlern — Git-Commits werden zu gezielten Anki-Karten für Denkfehler, die du persönlich machst.',
    oneLinerEn: 'Learn from your own past bugs: git commits automatically turn into personal spaced-repetition flashcards for your recurring mental traps.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Anki-Community / AnkiConnect-Entwickler · GitLens · Weiterbildungsplattformen',
    recipientsEn: 'Anki community / AnkiConnect developers · GitLens · developer education platforms',
    domain: 'knowledge',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Lernen', 'Spaced Repetition', 'Git', 'Psychologie', 'DevTools'],
    problemDe: 'Entwickler machen dieselben Denkfehler mehrfach (Off-by-One, Concurrency-Races, Zeitzonen-Bugs). Man fixt den Bug, vergisst ihn nach drei Tagen, und tritt ein halbes Jahr später in dieselbe Grube.',
    problemEn: 'Engineers fall into the same personal cognitive traps repeatedly (timezones, off-by-one, cache invalidation). Once fixed, the lesson vanishes from memory within days.',
    whyNowDe: [
      'Diffs mit Bug-Präfix lassen sich heute treffsicher zu Frage-Antwort-Paaren synthetisieren.',
      'AnkiConnect ermöglicht nahtlosen Export ohne manuelle Tipparbeit.'
    ],
    whyNowEn: [
      'Bug fix diffs can now be converted into high-signal Q&A reasoning pairs automatically.',
      'AnkiConnect enables direct background sync into flashcard decks without friction.'
    ],
    sketchDe: 'Git-Hook oder CLI: Analysiert Fix-Commits, extrahiert: Was war der Fehlglaube? Warum war es falsch? Wie sieht die Invariante aus? Generiert 1-2 Anki-Karten mit Code-Snippet.',
    sketchEn: 'Git hook or CLI tool: Parses fix commits, distilling: What was the underlying faulty assumption? Why did it break? What is the correct invariant? Generates clean Anki cards.',
    firstStepDe: {
      ticket: 'Aus einem Git-Diff eine Anki-Karte erzeugen.',
      criteria: 'Ein interaktiver Befehl verwandelt den letzten Commit in eine Karte mit Frage, falschem Code und korrigiertem Prinzip.'
    },
    firstStepEn: {
      ticket: 'Generate an Anki card from a git diff.',
      criteria: 'Command takes previous fix commit and generates flashcard showing mistake prompt, broken code, and governing invariant.'
    },
    failureModeDe: 'Kartenmüll: Wer 50 triviale Tippfehler-Karten lernt, bricht nach zwei Tagen ab. Filterung muss strikt auf konzeptionelle Invarianten beschränkt bleiben.',
    failureModeEn: 'Flashcard noise: Reviewing trivial typos causes burnout. Filter must ruthlessly isolate structural conceptual mistakes only.',
    priorArtDe: 'Generische Anki-Programmier-Decks existieren zu Syntax, aber keines basiert auf den realen persönlichen Fehlern im eigenen Code.',
    priorArtEn: 'Generic programming Anki decks exist for language syntax, but none harvest lessons from your own codebase mistakes.'
  },
  {
    id: 'diffgeist',
    title: 'Diffgeist',
    oneLinerDe: 'Kein Changelog für alle, sondern der Teil, den dein Code tatsächlich aufruft — „React 20 ändert X, du nutzt X an vier Stellen, hier sind sie".',
    oneLinerEn: 'Not a generic changelog for everyone, but the specific slice your codebase actually calls: "React 20 changes X, your project calls X in 4 files: here they are."',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Andrew Nesbitt / Ecosyste.ms · nachrangig: Renovate (Mend), Socket.dev',
    recipientsEn: 'Andrew Nesbitt / Ecosyste.ms · secondary: Renovate (Mend), Socket.dev',
    domain: 'tools',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Dependencies', 'Changelog', 'AST', 'Renovate', 'DevTools'],
    problemDe: 'Release-Notes richten sich an ein anonymes Publikum. 95% sind für dein Projekt irrelevant, 5% brechen still die Produktion. PRs von Renovate/Dependabot werden ungesehen gemerged, weil man 20 Seiten Release-Notes nicht lesen kann.',
    problemEn: 'Changelogs are written for an abstract world. 95% is irrelevant to you, but the remaining 5% can silently break production. Teams merge bot PRs blindly because reading twenty pages of release prose is unsustainable.',
    whyNowDe: [
      'LLMs zerlegen Release-Notes zuverlässig in strukturierte Breaking-Change-Tabellen.',
      'AST- und Call-Graph-Prüfung in JavaScript/TypeScript ist in Millisekunden machbar.',
      'Ecosyste.ms liefert die offene Dateninfrastruktur für weltweite Paketmetadaten.'
    ],
    whyNowEn: [
      'LLMs parse prose changelogs into structured breaking symbol tables effortlessly.',
      'AST search for imported symbols runs in milliseconds across repositories.',
      'Ecosyste.ms provides the open registry and release metadata layer.'
    ],
    sketchDe: 'Renovate/GitHub-Action-Plugin: Bei Dependency-Update die Release Notes laden, geänderte Symbole extrahieren, das Repo nach Aufrufen durchsuchen und die Schnittmenge als schlanken PR-Kommentar posten.',
    sketchEn: 'Renovate action: Upon package bump, fetch release notes, extract impacted symbols, check repository call-sites, and post an exact intersection comment into the PR.',
    firstStepDe: {
      ticket: 'Eine Sprache, ein Paket, ein PR-Kommentar.',
      criteria: 'Bei einem echten Major-Update eines NPM-Pakets zeigt die Ausgabe nur die 2-3 Symbole, die tatsächlich im Projekt importiert werden.'
    },
    firstStepEn: {
      ticket: 'One language, one package, one targeted PR comment.',
      criteria: 'During a real major npm package bump, output isolates precisely the 2-3 functions used in the repo.'
    },
    failureModeDe: 'False Negatives bei dynamischen Aufrufen. Muss ehrlich deklarieren, wo dynamische Reflection die statische AST-Suche blendet.',
    failureModeEn: 'Dynamic reflection blind spots: The tool must clearly warn whenever dynamic property access prevents static verification.',
    priorArtDe: 'Renovate bettet rohe Release-Notes ein; Socket.dev prüft Security, aber keine API-Callsite-Schnittmenge.',
    priorArtEn: 'Renovate pastes unparsed changelogs; Socket.dev audits supply chain security, but neither computes the exact call-site intersection.'
  },
  {
    id: 'echter-zufall',
    title: 'Echter Zufall als Service',
    oneLinerDe: 'Ein MCP-Server zwischen Rauschdiode und Agent — dreißig Zeilen, und jeder Würfelwurf, jedes Sigil, jede Kartenziehung zieht aus physikalischem Rauschen statt aus Math.random().',
    oneLinerEn: 'An MCP server between physical hardware avalanche noise diode and AI agent — 30 lines, routing true quantum entropy to every dice roll, sigil, or card draw.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Infinite Noise TRNG (waywardgeek/infnoise) · Crowd Supply / Hackaday · Didaktik',
    recipientsEn: 'Infinite Noise TRNG (waywardgeek/infnoise) · Crowd Supply / Hackaday · Educational crypto',
    domain: 'physics',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['Hardware', 'Entropy', 'TRNG', 'MCP', 'Physics'],
    problemDe: 'Hardware-Zufallsgeneratoren (TRNG) auf USB-Basis kosten unter 100€, werden aber fast nur für Server-Kryptographie genutzt. Kreative Apps (Tarot, I Ging, generative Kunst, Losungen) nutzen banales Pseudo-Randomness, obwohl hier die physische Herkunft des Zufalls die halbe Seele ausmacht.',
    problemEn: 'Affordable hardware true random number generators (TRNG) sit idle in server rooms for crypto keys. Meanwhile creative divination, generative art, and lottery apps use pseudo-random seeds where physical entropy would provide genuine depth.',
    whyNowDe: [
      'MCP (Model Context Protocol) standardisiert die Werkzeug-Schnittstelle universell.',
      'Günstige offene TRNG-Hardware (Infinite Noise USB) ist lieferbar und quelloffen.',
      'Agenten und generative Tools, die Zufall anfordern, boomen.'
    ],
    whyNowEn: [
      'Model Context Protocol provides a plug-and-play standard tool interface for agents.',
      'Hardware TRNG devices (Infinite Noise) are mature and fully documented.',
      'Proliferation of autonomous generative apps needing entropy.'
    ],
    sketchDe: 'Leichter MCP-Server für Raspberry Pi / lokalen Host mit TRNG-Stick: Stellt random_bytes, random_int (mit unvoreingenommener Rejection-Sampling) und draw() bereit. Strenge Health-Checks mit Min-Entropie-Schätzung; wirft Fehler statt heimlich auf Math.random() zurückzufallen.',
    sketchEn: 'Lightweight MCP daemon for USB TRNG sticks exposing random_bytes, unbiased random_int, and draw tools with continuous min-entropy health checks. Never silently falls back to pseudo-random.',
    firstStepDe: {
      ticket: 'Bytes durchreichen und Hardware-Zustand melden.',
      criteria: 'Agent kann würfeln; zieht man den USB-Stick ab, meldet der Server sofort einen klaren Fehler statt gefälschten Zufall.'
    },
    firstStepEn: {
      ticket: 'Pass entropy bytes and verify disconnect safety.',
      criteria: 'Agent rolls physical dice; unplugging USB stick triggers an immediate hard error rather than silent synthetic degradation.'
    },
    failureModeDe: 'Heimlicher Fallback: Ein TRNG-Server, der bei Hardware-Ausfall unbemerkt Math.random() liefert, betrügt den Nutzer.',
    failureModeEn: 'Silent fallback: A physical entropy server that quietly degrades to pseudo-random when hardware disconnects destroys trust.',
    priorArtDe: 'infnoise Daemon existiert für Linux /dev/random; was fehlt, ist die unkomplizierte MCP- und Web-Tool-Schicht für kreative Anwendungen.',
    priorArtEn: 'Low-level Linux kernel drivers feed /dev/random, but no clean high-level MCP tool bridge exists for creative software.'
  },
  {
    id: 'ghost-replay',
    title: 'Ghost Replay',
    oneLinerDe: 'Visueller Differenzabgleich von UI-Interaktionen — zeichnet Benutzeraktionen als Vektorgeister über die Oberfläche, um Usability-Knicke sofort zu sehen.',
    oneLinerEn: 'Visual interaction diff: overlays user sessions as vector ghost trails over UI elements to spot hesitation and usability friction instantly.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'PostHog Plugin Community · rrweb Maintainer · Open Source UX Tools',
    recipientsEn: 'PostHog Plugin Community · rrweb maintainers · Open-source UX tooling',
    domain: 'tools',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['UX', 'rrweb', 'Analytics', 'Ghost Trails', 'Interaction'],
    problemDe: 'Session-Replays (wie Hotjar oder rrweb) zwingen Entwickler, stundenlang Videos in Originalzeit anzuschauen. Man sieht nicht auf einen Blick, wo 50 Nutzer gezögert oder wild im Kreis geklickt haben.',
    problemEn: 'Session replays require watching hours of 1x speed video. Product designers lack a synthetic spatial heatmap showing where 50 users hesitated or looped their cursors.',
    whyNowDe: [
      'rrweb DOM-Mutation-Streams erfassen Mauskoordinaten bereits strukturiert.',
      'Canvas2D und WebGL rendern hunderte semitransparente Pfade flüssig übereinander.'
    ],
    whyNowEn: [
      'rrweb records structured event streams without video bloat.',
      'Browser canvas effortlessly aggregates hundreds of translucent vector cursor traces.'
    ],
    sketchDe: 'Plugin für rrweb/PostHog: Aggregiert 100 Mauspfade über dieselbe Seite. Zeigt Mausbewegungen als leuchtende „Geisterspuren" mit Geschwindigkeits-Farbcodierung.',
    sketchEn: 'rrweb/PostHog extension aggregating 100 sessions into a single view. Renders ghost trails color-coded by velocity to highlight cognitive friction.',
    firstStepDe: {
      ticket: 'Zehn rrweb-Events in Canvas überblenden.',
      criteria: 'Zehn aufgezeichnete Interaktionen werden synchron als transparente Geisterpfade über ein Screenshot gerendert.'
    },
    firstStepEn: {
      ticket: 'Overlay ten rrweb session traces onto a canvas.',
      criteria: 'Ten user recordings render simultaneously as luminous trails over a static UI screenshot.'
    },
    failureModeDe: 'Visuelles Chaos bei responsivem Layout: Pfade müssen an DOM-Elemente relativ gebunden werden, nicht an absolute Bildschirmkoordinaten.',
    failureModeEn: 'Responsive layout misalignment: Cursor coordinates must bind to relative DOM element anchors rather than absolute pixels.',
    priorArtDe: 'Heatmaps zeigen Klickdichte, aber keine Bewegungsdynamik oder Verharren.',
    priorArtEn: 'Traditional click heatmaps highlight click density, but hide path trajectories and hesitation tempo.'
  },
  {
    id: 'kristallwachstum-3d',
    title: 'Kristallwachstum 3D',
    oneLinerDe: 'Diffusionsbegrenzte Aggregation (DLA) in 3D im Browser — echte Mineralisationsphysik als didaktisches Werkzeug statt als starres Standbild.',
    oneLinerEn: 'Diffusion-Limited Aggregation (DLA) in real-time 3D in the browser: physical mineralization didactics instead of static diagrams.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Geowissenschaften FU Berlin / Lehrmittel-Verlage · Three.js Demoszene',
    recipientsEn: 'Geosciences university departments · science educators · Three.js graphics community',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Physik', 'DLA', '3D', 'Three.js', 'Didaktik'],
    problemDe: 'Kristallisation und Dendritenbildung in der Natur (Schneeflocken, Eisblumen, Wismut-Kristalle) werden im Unterricht mit statischen Schemazeichnungen vermittelt, weil 3D-Simulationen früher Supercomputer brauchten.',
    problemEn: 'Mineral crystallization and dendrite growth are taught using static 2D textbook drawings because compute-heavy 3D simulation previously required dedicated scientific workstations.',
    whyNowDe: [
      'WebGPU und WebGL2 Compute-Shader berechnen zehntausende Brownian-Particles parallel im Browser.',
      'Instanced Mesh Rendering erlaubt 100.000 Kristallite bei 60 FPS.'
    ],
    whyNowEn: [
      'WebGL2 and WebGPU compute shaders simulate tens of thousands of Brownian particles in real time.',
      'Hardware instanced rendering displays 100k crystalline nodes at 60 FPS in browsers.'
    ],
    sketchDe: 'Interaktiver 3D-Kristallisator: Keim setzen, Übersättigung und Temperatur regeln, und dem Dendritenwachstum live in 3D zusehen. Export als 3D-Druck-STL.',
    sketchEn: 'Interactive browser crystallizer: Seed crystal, tune supersaturation and temperature gradients, watch dendritic lattices grow, export directly as 3D-printable STL.',
    firstStepDe: {
      ticket: '10.000 Partikel aggregieren in WebGL.',
      criteria: 'Partikel docken an Kristallkeim an, Verästelung bildet sich flüssig mit mindestens 30 FPS.'
    },
    firstStepEn: {
      ticket: 'Aggregate 10,000 particles in browser canvas.',
      criteria: 'Particles Brownian-diffuse and lock to seed lattice, forming organic dendritic arms at 30+ FPS.'
    },
    failureModeDe: 'Nur hübsches Gimmick: Ohne physikalisch exakte Skalierung der Temperatur- und Diffusionsparameter verkommt es zum Bildschirmschoner.',
    failureModeEn: 'Screensaver trap: Without rigorously calibrated physical diffusion coefficients, it degrades into decorative visual noise.',
    priorArtDe: 'Zahlreiche 2D-DLA-Demos existieren; browserbasierte 3D-Echtzeit-Werkzeuge mit physikalischer Parameterführung fehlen.',
    priorArtEn: 'Abundant 2D DLA demos exist; interactive physically-anchored 3D educational tools remain sparse.'
  },
  {
    id: 'pin-tumbler',
    title: 'Pin Tumbler Didaktik',
    oneLinerDe: 'Kein Lockpicking-Spiel, sondern ein Lerngerät — Stifte, Federn, Fertigungstoleranzen und Binding Order als sichtbares Modell, mit Handy-Vibration als Ersatz für das Gefühl, das man noch nicht hat.',
    oneLinerEn: 'Not a lockpicking mini-game, but an educational instrument: visual springs, tolerances, and binding order, paired with haptic feedback to build physical intuition.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'SSDeV (Sportsfreunde der Sperrtechnik Deutschland e. V., OG Berlin) · TOOOL · CCC-Workshops',
    recipientsEn: 'SSDeV (Sportsfreunde der Sperrtechnik) · TOOOL international · Locksport workshops',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Locksport', 'Physik', 'Mechanik', 'Haptik', 'Didaktik'],
    problemDe: 'Locksport lernt man durch Tasten im Dunkeln. Das entscheidende Prinzip — warum Stifte nacheinander binden — beruht auf winzigen Bohrungstoleranzen im Zehntelmillimeter-Bereich. Plexiglas-Schlösser zeigen Geometrie, aber nie die Toleranzen, auf die es ankommt.',
    problemEn: 'Lockpicking is traditionally learned blind through tactile trial and error. The governing principle—why pins bind sequentially—stems from microscopic manufacturing drilling tolerances. Cutaway plastic locks display shape but hide tolerance variance.',
    whyNowDe: [
      'Starrkörper-Kontaktreibung läuft in 2D in Echtzeit im Webbrowser.',
      'Moderne Smartphone-Haptik-Engines erzeugen präzise Impulse für „Stift setzt" vs. „Stift klemmt".',
      'Toleranzen lassen sich in der Simulation gezielt übertreiben und sichtbar schalten.'
    ],
    whyNowEn: [
      '2D rigid body contact mechanics with friction simulate smoothly in browsers.',
      'Modern smartphone vibration motors deliver tactile clicks distinguishing binding from oversetting.',
      'Drilling tolerances can be dynamically amplified and toggled between visible and blind modes.'
    ],
    sketchDe: 'Zylinderschloss im Querschnitt. Umschaltbar zwischen „Sichtbar" (Toleranzen farblich überhöht, Binding-Order ablesbar) und „Blind" (nur Vibration und Klickgeräusch). Regler für Drehspannung am Kern.',
    sketchEn: 'Cylinder lock cutaway with toggles between "Explaining Mode" (exaggerated tolerances, color-coded binding state) and "Tactile Practice Mode" (audio-haptic feedback only).',
    firstStepDe: {
      ticket: 'Fünf Stifte, eine Toleranz, eine sichtbare Binding Order.',
      criteria: 'Ein Laie versteht nach 5 Minuten interaktiver Bedienung, warum bei Drehspannung genau ein Stift blockiert.'
    },
    firstStepEn: {
      ticket: 'Five pins, one tolerance offset, visible binding order.',
      criteria: 'A beginner understands why rotational tension causes a single pin to bind first within five minutes of playing.'
    },
    failureModeDe: 'Gefühlsvortäuschung: Das reale haptische Feedback eines echten Picks im Schloss lässt sich nicht voll digitalisieren. Das Tool muss betonen: Es lehrt das mentale Modell, nicht die Muskelfingerfertigkeit.',
    failureModeEn: 'The digital illusion: A screen cannot replace physical brass resistance. The UI must explicitly position itself as a mental model teacher, not a replacement for hand practice.',
    priorArtDe: 'Es gibt viele Arcade-Lockpick-Minispiele, aber keines mit physikalisch realistischer Binding-Order-Didaktik.',
    priorArtEn: 'Dozens of video game lockpicking mini-games exist; zero focus on rigorous mechanical tolerance didactics.'
  },
  {
    id: 'raeucher-sim',
    title: 'Räucher-Sim',
    oneLinerDe: 'Strömungsdynamik von aufsteigendem Rauch — laminarer Auftrieb, Wirbelablösung und Duftdiffusions-Visualisierung als beruhigende, physikalisch fundierte Simulation.',
    oneLinerEn: 'Fluid simulation of rising incense smoke: laminar plume, vortex shedding, and aesthetic fragrance diffusion as a meditative, physically grounded tool.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Teezeremonie- & Achtsamkeits-Communities · WebGL-Grafik-Kuratoren · Physik-Didaktik',
    recipientsEn: 'Tea ceremony & mindfulness practitioners · WebGL creative coders · Fluid dynamics educators',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Fluidsim', 'Physik', 'Navier-Stokes', 'Achtsamkeit', 'WebGL'],
    problemDe: 'Rauchsimulationen in Apps sind entweder grobe Partikeleffekte oder rechenintensive 3D-Baking-Pipelines. Der zauberhafte Übergang von laminarer Strömung zu turbulenter Wirbelablösung bei einem Räucherstäbchen fehlt im Web.',
    problemEn: 'Smoke visuals in apps are either crude particle emitters or pre-rendered offline videos. The transition from laminar plume to vortex shedding characteristic of burning incense is missing in real-time web code.',
    whyNowDe: [
      'Navier-Stokes auf GPU-Grid (Jos Stam Modell) läuft in 4K bei 60 FPS im WebGL2-Canvas.',
      'Mikro-Luftzüge und Hindernis-Interaktionen lassen sich direkt per Maus oder Touch erzeugen.'
    ],
    whyNowEn: [
      'Grid Navier-Stokes solvers (Jos Stam formulation) execute at 60 FPS in WebGL2.',
      'Touch and cursor gestures generate fluid micro-drafts and obstacle vorticity.'
    ],
    sketchDe: 'Minimalistischer Raum mit glimmendem Punkt. Rauch steigt laminar auf, bricht in Helmholtz-Wirbel auf und diffundiert sanft. Interaktive Hindernisse (Teetasse, Hand, Fächer).',
    sketchEn: 'Minimalist aesthetic canvas with a single glowing ember. Plume rises laminarly, breaks into Kelvin-Helmholtz vortices, and diffuses. Interactive obstacles like bowls and screens.',
    firstStepDe: {
      ticket: 'Stam-Solver mit Dichte- und Temperaturauftrieb koppeln.',
      criteria: 'Aufsteigende Wärmequelle erzeugt selbstständig realistische Wirbelstraße ohne künstliche Turbulenz-Texturen.'
    },
    firstStepEn: {
      ticket: 'Coupled buoyant advection with Stam fluid solver.',
      criteria: 'A thermal point source naturally produces a vortex street without reliance on synthetic noise textures.'
    },
    failureModeDe: 'Verwaschenheit: Zu hohe numerische Dissipation lässt Rauch wie Nebelsuppe aussehen. Braucht vorticity confinement.',
    failureModeEn: 'Numerical dissipation: Naive Euler fluid grids blur out into cloudy fog. Demands vorticity confinement to preserve thin filaments.',
    priorArtDe: 'Hunderte generische 2D-Fluidsims existieren, fast alle als bunte Regenbogen-Spielereien ohne Auftriebsphysik.',
    priorArtEn: 'Generic rainbow fluid toys abound, but almost none accurately simulate thermal plume buoyancy and delicate incense curl dynamics.'
  },
  {
    id: 'spec-drift-detector',
    title: 'Spec-Drift Detector',
    oneLinerDe: 'CI-Wächter für Spec-Driven Development: Schlägt Alarm, wenn Code und Implementierung unbemerkt von der Markdown-Spezifikation weglaufen.',
    oneLinerEn: 'CI gate for spec-driven development: fails the build when code changes drift away from documented specification requirements.',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Tessl (Guy Podjarny) · GitHub Spec-Kit Maintainer · OpenAPI / Optic Ökosystem',
    recipientsEn: 'Tessl (Guy Podjarny) · GitHub Spec-Kit maintainers · OpenAPI / Optic ecosystem',
    domain: 'tools',
    verdict: 'keep',
    status: 'gepackt',
    tags: ['Spec-Driven', 'CI/CD', 'Immunsystem', 'AI Coding', 'DevTools'],
    problemDe: 'Teams schreiben Spezifikationen für KI-Agenten. Dann fixen Entwickler Code direkt im PR. Die Spec veraltet schleichend. Drei Monate später generiert der nächste Agent Code auf Basis der veralteten Spec und reißt alte Bugs wieder auf.',
    problemEn: 'Teams author specs for AI agents. Then engineers make quick fixes directly in code. The spec silently rots. Months later, the next AI agent consults the outdated spec and recreates legacy regressions.',
    whyNowDe: [
      'AST-Extraktion von Interfaces und Signaturen ist standardisiert.',
      'Semantischer Abgleich von Markdown-Anforderungen gegen Code-AST ist im CI-Lauf in Sekunden machbar.'
    ],
    whyNowEn: [
      'AST interface and signature harvesting is fast and reliable.',
      'Semantic diffing between markdown requirement clauses and code exports runs in seconds during CI.'
    ],
    sketchDe: 'GitHub Action: Prüft bei jedem PR geänderte Dateien gegen zugehörige Specs. Zeigt Divergenz im PR-Report und schlägt automatische Spec-Nachführungen vor.',
    sketchEn: 'GitHub Action comparing touched source files against project specs. Fails CI when functionality drifts without corresponding spec updates, proposing synchronized documentation patches.',
    firstStepDe: {
      ticket: 'Funktionssignaturen mit Spec-Tabelle abgleichen.',
      criteria: 'Warnung in CI, wenn ein Parameter im Code umbenannt wurde, aber in der Spec-Tabelle noch der alte Name steht.'
    },
    firstStepEn: {
      ticket: 'Reconcile exported signatures with markdown spec tables.',
      criteria: 'Fails CI if a function signature or parameter was renamed in code without updating the corresponding spec entry.'
    },
    failureModeDe: 'False-Alarm-Müdigkeit: Wenn jeder Kommentar-Typo den Build anhält, deaktivieren Teams den Check.',
    failureModeEn: 'Linter fatigue: If minor doc typos block pull requests, developers will instantly disable the action.',
    priorArtDe: 'Optic und Schemathesis überwachen OpenAPI-Spezifikationen; generelle Prosa- und Architektur-Specs haben bisher keine Drift-Checks.',
    priorArtEn: 'Optic monitors OpenAPI spec drift, but general markdown architectural specs have lacked automated synchronization gates.'
  },
  {
    id: 'tarot-zustandsmaschine',
    title: 'Tarot-Zustandsmaschine',
    oneLinerDe: 'Narratives Debugging und archetypische Zustandsübergänge — Tarot-Karten als formale Zustandsmaschine für kreative Plot- und Systementwürfe.',
    oneLinerEn: 'Narrative debugging and archetypal state machines: Tarot archetypes modeled as a formal finite state automaton for creative writers and system architects.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Kreativschreib-Communities · Game-Design-Forschung · Interactive Fiction (Twine/Ink)',
    recipientsEn: 'Creative writing guilds · Game narrative designers · Interactive fiction tooling (Twine/Ink)',
    domain: 'creative',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Narrativ', 'Zustandsmaschine', 'Tarot', 'Creative Coding', 'Storytelling'],
    problemDe: 'Plot-Entwürfe in Büchern und Spielen geraten in narrative Sackgassen. Tarot wird oft für Brainstorming genutzt, bleibt aber esoterisch-beliebig statt strukturelle dramaturgische Spannungen aufzudecken.',
    problemEn: 'Narrative plots in novels and games deadlock in narrative cul-de-sacs. Writers draw cards for inspiration, but lack formal structural transition mechanics linking archetypes into coherent story engines.',
    whyNowDe: [
      'Formale State-Machine-Engines (wie XState) lassen sich nahtlos im Web visualisieren.',
      'Graph-Layouts (D3 / Dagre) machen komplexe narrative Pfade und Spannungsbögen intuitiv begreifbar.'
    ],
    whyNowEn: [
      'Visual state machine tools (like XState) run directly in modern browsers.',
      'Interactive graph visualizations reveal dramatic tension flow, traps, and resolution pathways.'
    ],
    sketchDe: 'Visualisierer für archetypische Heldenreisen als gerichteter Graph: Karten als Zustände, Übergänge als Konflikte oder Prüfungen. Hebt narrative Zyklen und Sackgassen hervor.',
    sketchEn: 'Visual hero\'s journey state machine: cards represent character states, transitions represent crises. Highlights dead ends and narrative pacing flaws.',
    firstStepDe: {
      ticket: 'Große Arkana als XState-Graph visualisieren.',
      criteria: '22 Archetypen mit validen dramaturgischen Übergängen auf einem interaktiven Canvas durchklickbar.'
    },
    firstStepEn: {
      ticket: 'Model the 22 Major Arcana in an interactive state graph.',
      criteria: 'Users navigate archetypal character transitions with valid dramatic tension rules.'
    },
    failureModeDe: 'Verlust der Poesie durch Über-Formalisierung: Darf kein steriles Diagramm werden, sondern muss narrativen Freiraum lassen.',
    failureModeEn: 'Over-formalization: Stripping the mythological resonance turns it into dry business flowcharting.',
    priorArtDe: 'Esoterische Tarot-Apps simulieren Kartenstapel; formale dramaturgische Zustandsmaschinen fehlen.',
    priorArtEn: 'Countless tarot card drawing apps exist; zero formal dramatic state-transition engines.'
  },
  {
    id: 'traumtagebuch',
    title: 'Lokales Traumtagebuch',
    oneLinerDe: 'Träume erfassen und semantisch clustern — vollständig offline, verschlüsselt und ohne dass deine intimsten Gedanken auf fremden Cloud-Servern landen.',
    oneLinerEn: 'Record and semantically cluster dreams: 100% offline, client-side encrypted, keeping your intimate subconscious thoughts off cloud servers.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Schlaflabore / Oneirogene Forschung · Obsidian / Logseq Plugin-Ökosystem · Privacy Tools',
    recipientsEn: 'Sleep researchers / oneironautics · Obsidian/Logseq plugin communities · Local-first advocates',
    domain: 'knowledge',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Privacy', 'Local-First', 'Vector Search', 'Psychologie', 'Verschlüsselung'],
    problemDe: 'Wer Träume digital erfasst, nutzt Notiz-Apps, die unverschlüsselt in US-Clouds synchronisieren. Träume enthalten privateste Metaphern und Ängste. Gleichzeitig fehlen traditionellen Papierbüchern semantische Querverbindungen („Wann träume ich von alten Bahnhöfen?").',
    problemEn: 'Dreamers who digitize journals use cloud apps that expose their subconscious fears and intimate metaphors. Conversely, paper notebooks prevent semantic clustering of recurring symbolic motifs.',
    whyNowDe: [
      'Kleine Embedding-Modelle (ONNX / Transformers.js) laufen direkt im Browser ohne Backend.',
      'WebCrypto und IndexedDB ermöglichen Zero-Knowledge-Verschlüsselung mit Passwortableitung.'
    ],
    whyNowEn: [
      'Compact embedding models (Transformers.js) execute locally in the browser.',
      'WebCrypto and IndexedDB enable real zero-knowledge client-side encryption.'
    ],
    sketchDe: 'Progressive Web App: Offline-First, Passphrase entsperrt Tresor. Lokale Vektorberechnung. Visualisiert wiederkehrende Symbole und Gefühlsdynamiken als semantische Sternenkarte.',
    sketchEn: 'Offline-first PWA: Passphrase decrypts vault. On-device vector embeddings generate a celestial semantic map of recurring motifs over months.',
    firstStepDe: {
      ticket: 'Verschlüsselter Speicher und lokale Ähnlichkeitssuche.',
      criteria: 'Zwei Träume eingeben, offline Ähnlichkeit über lokale Embeddings berechnen, ohne Netzwerkanfrage.'
    },
    firstStepEn: {
      ticket: 'Encrypted storage with local semantic vector search.',
      criteria: 'Input two dream entries, verify zero outgoing network requests, compute cosine similarity in browser memory.'
    },
    failureModeDe: 'Pseudowissenschaftliche Traumdeutung: Die App darf keine esoterischen Deutungen erfinden, sondern nur eigene semantische Muster spiegeln.',
    failureModeEn: 'Astrology trap: Inventing fake dream interpretations instead of objectively reflecting the user\'s own recurring language.',
    priorArtDe: 'Kommerzielle Traum-Apps monetarisieren Daten mit KI-Deutungen; lokale sichere Alternativen existieren kaum.',
    priorArtEn: 'Commercial dream apps harvest personal entries for targeted ads and dubious AI horoscope readings.'
  },
  {
    id: 'wet-ink',
    title: 'Wet Ink',
    oneLinerDe: 'Tinte auf Papier als echte Simulation — Kapillarfluss, Bleeding, Faser-Anisotropie, Edge Darkening. Eine Physik, tief statt breit.',
    oneLinerEn: 'Real ink on paper physics: capillary flow, fiber anisotropy, bleed spread, and pigment edge darkening in WebGL2.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Escape Motions (Rebelle) · Sumi-e & Kalligrafie-Szene · WebGL Grafik-Lehre',
    recipientsEn: 'Escape Motions (Rebelle) · Sumi-e & calligraphy communities · WebGL graphics education',
    domain: 'creative',
    verdict: 'keep',
    status: 'gepackt',
    tags: ['WebGL2', 'Physik', 'Shader', 'Kalligrafie', 'Implementierungsplan'],
    problemDe: 'Digitale Pinselwerkzeuge in Photoshop oder Procreate nutzen Bitmap-Stempel. Echte Tinte verhält sich physikalisch grundlegend anders: Sie wandert entlang von Papierfasern (Feathering), lagert Pigmente am getrockneten Rand ab (Edge Darkening) und granuliert in Papiertälern.',
    problemEn: 'Digital brushes rely on repeated bitmap stamps. Real wet ink behaves fundamentally like fluid porous physics: capillary bleed along cellulose fibers, coffee-ring edge darkening, and pigment pooling in paper valleys.',
    whyNowDe: [
      'WebGL2 mit Float-Texturen erlaubt gekoppelte Mehrschicht-Simulation in Echtzeit.',
      'Kubelka-Munk Farbmischung ersetzt simples Alpha-Blending durch physikalische Lichtbrechung.',
      'Durchdachter 12-Tage-Plan mit CPU-Referenz-Shadern löst bisherige Testbarkeits-Probleme.'
    ],
    whyNowEn: [
      'WebGL2 float textures support multi-layered physical ink simulation at 60 FPS in browsers.',
      'Kubelka-Munk optical color absorption models realistic glazed pigment wash layering.',
      'Fully specified 12-day engineering plan with CPU-to-GPU unit test harness.'
    ],
    sketchDe: 'Drei gekoppelte Texturschichten: Papierfasern (Höhe, Richtung, Kapazität), Oberflächenwasser (Geschwindigkeit, Pigment), Faserschicht (Deponiertes Pigment). Sieben Shader-Pässe mit Kapillarschwelle.',
    sketchEn: 'Three linked simulation textures: paper substrate (roughness, grain vector, moisture capacity), water layer (velocity, suspended pigment), and stained fiber layer. 7 sequential shader passes.',
    firstStepDe: {
      ticket: 'P0: WebGL2-Harness und prozeduraler Papiergenerator.',
      criteria: 'Ping-Pong FBOs und fBm-Rauschen erzeugen sichtbare Papierkörnung und Faserorientierung.'
    },
    firstStepEn: {
      ticket: 'P0: WebGL2 harness and procedural paper grain generator.',
      criteria: 'Ping-pong FBOs with seeded fBm noise generate authentic paper substrate texture maps.'
    },
    failureModeDe: 'Rauch statt Tinte: Ohne strikte Kapillarschwelle diffundiert das Pigment wolkig wie Rauch. Reihenfolge im Plan: Feathering vor Fluidströmung.',
    failureModeEn: 'The smoke bug: Without a strict capillary threshold, ink bleeds like soft smoke. The 12-day plan enforces capillary threshold before fluid advection.',
    priorArtDe: 'Rebelle bietet herausragende Desktop-Physik; im Webbrowser fehlt eine leichtgewichtige, quelloffene physikalische Tintensimulation.',
    priorArtEn: 'Rebelle by Escape Motions is the gold standard on desktop; open lightweight browser implementations are non-existent.'
  },
  {
    id: 'pillsafe-vision',
    title: 'PillSafe Vision',
    oneLinerDe: 'Ein Foto der 7-Tage-Dosette schützt pflegende Angehörige vor lebensgefährlichen Verwechslungen — multimodale Erkennung von Pillenprägung und Farbe gleicht alles mit dem Medikationsplan ab.',
    oneLinerEn: 'A single overhead photo of a 7-day pillbox shields exhausted family caregivers from fatal medication errors using multimodal imprint and color verification against doctor schedules.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Pflegestützpunkte Deutschland · BAGSO (Seniorenorganisationen) · Pflegende Angehörige e.V.',
    recipientsEn: 'Family Caregiver Alliance · AARP Caregiving · National Institute on Aging',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['AI-Native', 'Pflege', 'Vision AI', 'Senioren', 'Gesundheit', 'Lokal'],
    problemDe: 'Über 4 Millionen Menschen pflegen Angehörige zuhause. Polymedikation (5 bis 12 verschiedene Tabletten täglich) führt bei Erschöpfung regelmäßig zu fatalen Doppelgaben oder Verwechslungen weißer Generika-Tabletten.',
    problemEn: 'Over 40 million informal family caregivers sort polypharmacy regimens late at night. Visually indistinguishable white generic pills lead to thousands of avoidable hospitalizations annually.',
    whyNowDe: [
      'Multimodale Vision-Modelle erkennen mikroskopische Pillenprägungen (z.B. Bruchrillen, Ziffern) selbst bei ungünstigem Küchenlicht.',
      'WebAssembly/WebGPU ermöglicht vollständige Bildanalyse im Browser ohne Übertragung intimer Patientendaten an fremde Clouds.',
      'Standardisierte BMP-QR-Codes auf deutschen Arztbriefen lassen sich sekundenschnell einscannen.'
    ],
    whyNowEn: [
      'Multimodal vision models parse subtle tablet imprints, bevels, and scoring lines under uneven kitchen illumination.',
      'WebGPU/Wasm enables complete on-device inference with zero patient data transmission to corporate clouds.',
      'Standardized national prescription QR codes allow instant schedule synchronization.'
    ],
    sketchDe: 'Kamera erfasst 7x4 Dosetten-Gitter. Ein Segmentierungsmodell isoliert jedes Fach. Ein Zero-Shot Vision-Modell zählt Tabletten und verifiziert Form/Prägung. Farbige Ampel zeigt sofort: „Mittwoch Mittag fehlt Blutdrucksenker".',
    sketchEn: 'Camera scans 7x4 organizer grid. Segmentation isolates compartments. Vision model counts tablets and cross-references imprints against medication schedule, instantly flagging discrepancies.',
    firstStepDe: {
      ticket: 'P0: 4-Fächer-Dosette Foto-Segmentierung und Pillenzählung.',
      criteria: 'Erkennt bei 10 realen Testfotos die exakte Tablettenanzahl pro Fach mit 95% Genauigkeit.'
    },
    firstStepEn: {
      ticket: 'P0: 4-slot pillbox photo segmentation and tablet count.',
      criteria: 'Counts tablet units per compartment with 95% accuracy across 10 sample images.'
    },
    failureModeDe: 'Falsche Sicherheit bei identisch aussehenden weißen Tabletten ohne Prägung: Das System muss bei Unklarheit explizit warnen („Tablette 3 nicht eindeutig unterscheidbar, bitte Beipackzettel prüfen") statt zu raten.',
    failureModeEn: 'False confidence on generic identical unmarked white tablets: Model must output explicit ambiguity warnings rather than ungrounded guesses.',
    priorArtDe: 'Kommerzielle Apotheken-Blisterautomaten kosten 50.000 €; für private Familien gab es bisher nur manuelle Zettel.',
    priorArtEn: 'Commercial pharmacy packaging machines cost $50k; ordinary family caregivers had zero visual verification tools.',
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Computer Vision scheiterte kläglich an Plastikspiegelungen, Schattenwurf in tiefen Fächern und minimalen Unterschieden weißer runder Pillen. Erst multimodale Vision-Netze erfassen semantische Prägungen und Kontext.',
      impossibleBeforeAiEn: 'Traditional OpenCV failed completely on plastic lid reflections, compartment shadow occlusions, and subtle 1mm bevel variations. Multimodal vision models solve this via zero-shot semantic visual reasoning.',
      aiTechStack: ['Florence-2 / Segment Anything Edge', 'WebGPU Multimodal Runtime', 'National BMP QR Parser', 'Local-First IndexDB'],
      privacyModelDe: '100% On-Device: Bilder verlassen niemals das Smartphone. Keine Accounts, keine Telemetrie, DSGVO-souverän.',
      privacyModelEn: '100% On-Device: Images never leave the handset. No accounts, zero analytics, zero health data leakage.',
      ordinaryPeopleBenefitDe: 'Nimmt pflegenden Angehörigen die quälende Angst, die eigene Mutter mit einer falschen Dosis ins Krankenhaus zu befördern.',
      ordinaryPeopleBenefitEn: 'Erases the paralyzing nocturnal dread of accidentally giving an elderly parent a double dose of heart medication.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Bildgeometrie & Gitter-Entzerrung', focus: 'Homographie-Transformation zur Perspektivenkorrektur schiefer Handyfotos von Dosetten', milestone: 'Rechteckiges 4x7 Gitter wird aus jedem Winkel planar ausgerichtet' },
        { step: 2, title: 'Woche 2: Edge-Vision & Pillen-Segmentierung', focus: 'Wasm-basiertes SAM/YOLO zur Erkennung einzelner Pillen-Polygone in Vertiefungen', milestone: 'Exakte Zählung der Pillen pro Fach ohne Server-Roundtrip' },
        { step: 3, title: 'Woche 3: Prägungs- & OCR-Feinabstimmung', focus: 'Kontrastverstärkung und Zero-Shot Vision-Klassifikation von Tabletten-Codes (z.B. "50", "Bayer")', milestone: 'Verlässliche Zuordnung von Wirkstoffstärken' },
        { step: 4, title: 'Woche 4: Medikationsplan-Integration & UI-Ampel', focus: 'Abgleich mit Arzt-QR-Codes und fehlertolerante Benutzeroberfläche für Senioren', milestone: 'Klickbarer Prototyp mit roter/grüner Statusbox und akustischem Signal' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Perspective Homography', focus: 'Correcting angled smartphone snapshots of pillboxes into planar grids', milestone: 'Planar 4x7 grid rectification from hand-held camera angles' },
        { step: 2, title: 'Week 2: Edge-Vision Segmentation', focus: 'Lightweight Wasm segmentation isolating individual pills in shadows', milestone: 'Real-time pill count verification on client device' },
        { step: 3, title: 'Week 3: Micro-Imprint OCR & Classification', focus: 'Contrast enhancement and zero-shot visual parsing of tablet codes', milestone: 'Accurate differentiation between 25mg and 50mg scored pills' },
        { step: 4, title: 'Week 4: Prescription Pairing & High-Contrast UI', focus: 'Matching vision outputs to structured prescription standards with clear cues', milestone: 'Accessible web app with unambiguous green/amber/red indicators' }
      ]
    }
  },
  {
    id: 'paragraphen-dolmetscher',
    title: 'ParagraphenDolmetscher',
    oneLinerDe: 'Ein Foto des gefürchteten Amtsbescheids übersetzt bedrohliches Beamtendeutsch in 3 klare Sätze, deckt 4-Wochen-Fristen auf und formuliert den Widerspruch.',
    oneLinerEn: 'Photograph an intimidating government rejection notice → Instant 3-sentence plain language translation, deadline audit, and enforceable appeal letter draft.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Tacheles e.V. (Erwerbslosenhilfe) · Caritas Schuldner- & Sozialberatung · Mietervereine',
    recipientsEn: 'National Legal Aid Coalition · Citizens Advice (UK) · Tenants Advocacy Guilds',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['AI-Native', 'Bürgerrechte', 'Soziales', 'Juristische KI', 'Amtshilfe', 'Widerspruch'],
    problemDe: 'Millionen Bürger verstehen amtliche Ablehnungsbescheide (Bürgergeld, Pflegegrad, Wohngeld, Mieterhöhung) nicht. Aus Scham oder Überforderung verstreichen Fristen ungenutzt, obwohl bis zu 40% der Bescheide fehlerhaft sind.',
    problemEn: 'Millions of working-class families receive opaque administrative rejection notices. Paralyzed by hostile jargon, they miss 30-day statutory appeal windows despite up to 40% of determinations containing reversible errors.',
    whyNowDe: [
      'Große multimodale Modelle erfassen mehrseitige amtliche Tabellen, Berechnungsbögen und kleingedruckte Rechtsbehelfsbelehrungen im semantischen Zusammenhang.',
      'Juristische Mustersätze lassen sich mit den individuellen Fakten des Bürgers verknüpfen, ohne anwaltliche Stundensätze.',
      'Lokale Zwischenspeicherung schützt Bürger vor Tracking durch private Kanzleien oder Werbenetzwerke.'
    ],
    whyNowEn: [
      'Multimodal reasoning models seamlessly parse complex government calculation grids and fine-print appeal clauses.',
      'Statutory case law templates can be synthesized with the citizen\'s specific factual situation in seconds.',
      'Zero-retention client memory protects marginalized people from surveillance or predatory credit profiling.'
    ],
    sketchDe: 'Foto des Bescheids hochladen. Modell extrahiert: 1. Was das Amt will, 2. Wann die Frist abläuft (mit Kalendereintrag), 3. Wo der Rechenfehler liegt. Ein Klick generiert ein formelles, rechtswahrendes Widerspruchs-PDF zur Fristwahrung.',
    sketchEn: 'Upload notice photo. Model extracts: 1. Plain-text bottom line, 2. Strict statutory filing deadline, 3. Identified deduction errors. One click produces a formal, legally grounded appeal PDF to safeguard rights.',
    firstStepDe: {
      ticket: 'P0: Bescheid-Parser mit Fristerkennung und Zusammenfassung.',
      criteria: 'Extrahiert aus 5 echten Mustern (Jobcenter, Pflegekasse) das genaue Fristdatum und den Kernablehnungsgrund.'
    },
    firstStepEn: {
      ticket: 'P0: Notice parser with deadline extraction and plain summary.',
      criteria: 'Correctly extracts appeal deadline and core reason from 5 distinct municipal test notices.'
    },
    failureModeDe: 'Unerlaubte Rechtsberatung: Das Werkzeug muss sich strikt als „Verständnishilfe und Formulierungshilfe zur Fristwahrung" deklarieren und auf offene Beratungsstellen verweisen.',
    failureModeEn: 'Unauthorized practice of law: Tool must strictly frame itself as a linguistic comprehension and deadline-preservation aid, routing users to certified free legal aid clinics.',
    priorArtDe: 'Kommerzielle LegalTech-Plattformen verlangen 30-50% Provision der Nachzahlung; freie, bedingungslose Werkzeuge für Bürger existieren nicht.',
    priorArtEn: 'Commercial legal-tech startups extract 35% contingency fees; zero unconditional, open-source citizen tools exist.',
    aiFrontier: {
      impossibleBeforeAiDe: 'Regelbasierte Systeme konnten amtliche Briefe mit individuellen Sachbearbeiter-Formulierungen, Tabellenanhängen und handschriftlichen Vermerken nicht interpretieren. Nur moderne LLMs beherrschen juristische Dekodierung.',
      impossibleBeforeAiEn: 'Static regex or traditional OCR broke on irregular government letter layouts, multi-column benefit breakdown grids, and casework notes. Only modern reasoning models grasp the causal legal chain.',
      aiTechStack: ['Vision Document Transformer', 'German Social Code SGB Knowledge Graph', 'Client-side PDF-Kit Generator', 'Session Memory Decoupling'],
      privacyModelDe: 'Ephemere Verarbeitung: Nach dem Erstellen des Widerspruchs-PDFs werden alle Bilddaten sofort im RAM vernichtet.',
      privacyModelEn: 'Ephemeral execution: All document buffers are purged from RAM immediately upon PDF download.',
      ordinaryPeopleBenefitDe: 'Gibt Menschen ohne Geld für Anwälte ihre verfassungsmäßigen Rechte und ihr Selbstwertgefühl vor Behörden zurück.',
      ordinaryPeopleBenefitEn: 'Restores constitutional agency and dignity to ordinary people facing bureaucratic intimidation without hiring attorneys.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Dokumenten-Layout-Analyse & Tabellen', focus: 'Optische Zerlegung mehrspaltiger Ämterbriefe in Absender, Festsetzung, Begründung und Fristklausel', milestone: 'Zuverlässiges Extrahieren von Frist- und Datumsangaben' },
        { step: 2, title: 'Woche 2: Juristischer Begründungs-Parser (SGB II/XI)', focus: 'Semantische Prüfung: Welche Begründung führt das Amt an? (z.B. fehlende Mitwirkung, unzulässige Kürzung)', milestone: 'Automatischer Abgleich gegen Standardfehler von Sozialbehörden' },
        { step: 3, title: 'Woche 3: Alltagssprachliche Didaktik & Barrierefreiheit', focus: 'Übersetzung von Schachtelsätzen in einfache Sprache (Sprachniveau B1/A2) ohne Informationsverlust', milestone: 'Testleser verstehen den Bescheidinhalt in unter 60 Sekunden' },
        { step: 4, title: 'Woche 4: Musterschreiben-Generator zur Fristwahrung', focus: 'Erstellung von formvollendeten Widerspruchsschreiben mit Aktenzeichen, Rechtsgrundlage und Fristrüge', milestone: 'Rechtswahrendes PDF kann direkt ausgedruckt oder gefaxt werden' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Document Layout & Spatial Parsing', focus: 'Decomposing complex bureaucratic notices into header, penalty, rationale, and deadline clauses', milestone: 'Reliable extraction of statutory dates and reference numbers' },
        { step: 2, title: 'Week 2: Administrative Rationale Parsing', focus: 'Semantic classification: identify whether rejection stems from alleged non-compliance, missing receipts, or arbitrary cuts', milestone: 'Automated matching against common administrative review errors' },
        { step: 3, title: 'Week 3: Plain-Language Simplification', focus: 'Distilling multi-clause legal prose into accessible 8th-grade reading level summaries without distortion', milestone: 'User comprehension achieved in under 60 seconds' },
        { step: 4, title: 'Week 4: Enforceable Dispute Letter Engine', focus: 'Generating formal rebuttal notices with correct citations, case numbers, and deadline-preservation language', milestone: 'Print-ready appeal letter safeguarding citizen rights' }
      ]
    }
  },
  {
    id: 'klang-stethoskop',
    title: 'KlangStethoskop',
    oneLinerDe: 'Smartphone an die laute Heizungspumpe oder Waschmaschine halten — akustische Neuronale Netze diagnostizieren Lagerschaden oder Kavitation und zeigen die 10€-Reparatur.',
    oneLinerEn: 'Hold phone to a grinding heating pump or washing machine — acoustic neural networks diagnose bearing failure or cavitation, guiding a $10 DIY repair instead of replacement.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Netzwerk Reparatur-Initiativen (Repair Cafés) · Bund der Energieverbraucher · Verbraucherzentrale',
    recipientsEn: 'iFixit Global Community · Repair Café International · Community Tool Libraries',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['AI-Native', 'Handwerk', 'Repair Café', 'Audio AI', 'Physik', 'Nachhaltigkeit'],
    problemDe: 'Wenn die Umwälzpumpe der Heizung oder das Lager der Waschmaschine schleift, tauschen Installateure meist das gesamte Gerät für 800–2.000 € aus. Verbraucher können normale Laufgeräusche nicht von trivialen, leicht behebbaren Fehlern unterscheiden.',
    problemEn: 'When heating pumps or appliance bearings vibrate, technicians push costly full-unit replacements ($800-$2,500). Normal people cannot distinguish harmless resonance from a dry $8 ball bearing.',
    whyNowDe: [
      'Audio-Transformer und Spektrogramm-KI klassifizieren mechanische Frequenzspitzen und Resonanzen in Echtzeit im Browser.',
      'Web Audio API liefert hochpräzise FFT-Rohdaten direkt über das Smartphone-Mikrofon.',
      'Offene Reparaturdatenbanken von iFixit und Repair Cafés liefern verifizierte Fehler-Acoustic-Profile.'
    ],
    whyNowEn: [
      'Audio transformers and edge spectrogram models classify mechanical harmonics in real time on phones.',
      'Web Audio API captures high-resolution FFT telemetry directly from consumer microphones.',
      'Open repair knowledge from iFixit and Repair Cafés supplies verified harmonic failure signatures.'
    ],
    sketchDe: '5 Sekunden Audioaufnahme bei laufendem Motor. Echtzeit-Wasserfall-Spektrogramm. Neuronales Modell vergleicht Frequenzen mit Fehlerdatenbank (Kavitation, Schaufelradbruch, Fremdkörper, Lagerspiel). Schritt-für-Schritt-Anleitung zur Reparatur.',
    sketchEn: '5-second audio sample while motor runs. Real-time waterfall spectrogram. Neural classifier matches harmonics against mechanical failure benchmarks (cavitation, worn bearing, debris). Outputs visual repair guide.',
    firstStepDe: {
      ticket: 'P0: Spektrogramm-Visualisierung und Peak-Frequenzerkennung im Browser.',
      criteria: 'Zeigt bei laufendem Haushaltsgerät die dominante Rotationsfrequenz und deren Oberschwingungen in Hz an.'
    },
    firstStepEn: {
      ticket: 'P0: Web Audio spectrogram visualizer with harmonic peak detection.',
      criteria: 'Displays primary rotation frequency and harmonic overtone peaks in Hz from live microphone.'
    },
    failureModeDe: 'Mikrofonverzerrung durch Übersteuerung bei lauten Motoren: App muss Nutzer warnen, das Telefon 20 cm entfernt zu halten und Verstärkung automatisch regeln.',
    failureModeEn: 'Microphone clipping: Loud motors saturate consumer mics; app must enforce a 20cm distance rule and autogain normalization.',
    priorArtDe: 'Industrielle Maschinendiagnose-Systeme von SKF oder Fluke kosten 5.000 €; für normale Bürger gab es nur Ratelosigkeit.',
    priorArtEn: 'Industrial vibration analyzers cost $5,000+; ordinary homeowners had zero acoustic diagnostic tools.',
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Frequenzanalyse (einfache FFT) scheiterte an Umgebungsgeräuschen (Kindergeschrei, Verkehrslärm, Hall im Heizungskeller). Erst neuronale Audio-Filter trennen Hintergrundkrach von mechanischen Kausalmustern.',
      impossibleBeforeAiEn: 'Basic Fourier transforms failed due to ambient kitchen echoes, voices, and traffic rumble. Modern neural audio models isolate machine harmonic patterns from chaotic room acoustics.',
      aiTechStack: ['Web Audio API FFT Engine', 'Mel-Spectrogram Convolutional Backbone', 'Edge WebAssembly Inference', 'iFixit Open Repair Graph'],
      privacyModelDe: 'Audiodaten werden ausschließlich flüchtig im Arbeitsspeicher analysiert und niemals auf Server übertragen.',
      privacyModelEn: 'Acoustic samples are evaluated in ephemeral browser memory and immediately discarded with zero cloud upload.',
      ordinaryPeopleBenefitDe: 'Verhindert, dass Mieter und Rentner hunderte Euro an unnötigen Handwerker-Austauschkosten für kleinste Verschleißteile zahlen.',
      ordinaryPeopleBenefitEn: 'Saves households hundreds of dollars in needless appliance replacements by identifying accessible $10 repairs.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Web Audio API & Reales Spektrogramm', focus: 'Mikrofon-Eingang mit hoher Sampling-Rate (44.1/48kHz) und 2D-Wasserfall-Darstellung', milestone: 'Flüssige Visualisierung mechanischer Obertöne im Browser' },
        { step: 2, title: 'Woche 2: Akustische Rauschunterdrückung', focus: 'Filterung von Stimmen und Raumhall zur Isolation periodischer Maschinensignaturen', milestone: 'Sauberes Signal selbst bei hallenden Fliesen im Keller' },
        { step: 3, title: 'Woche 3: Neuronale Klassifikation von Schäden', focus: 'Training eines kompakten Modells auf Lager-Vibration, Kavitation und Unwucht', milestone: 'Diagnostische Genauigkeit >90% bei Test-Audioclips' },
        { step: 4, title: 'Woche 4: Reparaturanleitungs-Matching', focus: 'Verknüpfung der Fehlerdiagnose mit offenen iFixit- und Ersatzteilkatalogen', milestone: 'Benutzer sieht sofort Teilenummer, Werkzeugbedarf und Reparaturaufwand' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Web Audio High-Resolution Spectrogram', focus: 'Capturing clean 48kHz audio streams with canvas waterfall frequency rendering', milestone: 'Smooth browser visualization of mechanical overtones' },
        { step: 2, title: 'Week 2: Ambient Acoustic Denoising', focus: 'Stripping vocal chatter and room reverb to isolate periodic machine vibration', milestone: 'Stable diagnostic baseline in reverberant basement environments' },
        { step: 3, title: 'Week 3: Neural Harmonics Classification', focus: 'Training a compact edge model on bearing wear, cavitation bubbles, and rotor imbalance', milestone: '>90% diagnostic accuracy on open machine acoustic benchmarks' },
        { step: 4, title: 'Week 4: Repair Guide Synthesizer', focus: 'Mapping acoustic failure signatures to open-source repair manuals and replacement part specs', milestone: 'Clear display of replacement part cost, required tools, and DIY difficulty' }
      ]
    }
  },
  {
    id: 'dose-nurse-shift-guardian',
    title: 'DienstplanWächter (Shift Roster Auditor & Bonus Shield)',
    oneLinerDe: 'Fotografiert den Stations-Dienstplan, warnt vor illegalen Ruhezeitverkürzungen und berechnet steuerfreie Nacht- und Sonntagszuschläge.',
    oneLinerEn: 'Photographs hospital breakroom shift rosters, warns against illegal sub-11h turnaround shifts, and audits tax-free overtime wage bonuses.',
    date: '17.09.2026',
    reviewAfter: '10/2026',
    recipientsDe: 'ver.di Fachbereich Gesundheit · DBfK Deutscher Berufsverband für Pflegeberufe · Junge Pflege',
    recipientsEn: 'National Nurses United · Royal College of Nursing · European Federation of Nurses Associations',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    problemDe: 'Pflegekräfte rotieren durch zermürbende Schichten. Wegen handschriftlich korrigierter Aushänge gehen monatlich bis zu 300 € an Zuschlägen verloren, während illegale "Spät-auf-Früh"-Wechsel die Gesundheit zerstören.',
    problemEn: 'Nurses rotate through exhausting shifts. Messy paper breakroom corrections cause missed payroll bonuses of up to $300 monthly, while illegal short-rest turnarounds destroy physical and mental health.',
    whyNowDe: [
      'Multimodale Vision liest selbst unleserliche Kuli-Korrekturen und Pfeile auf laminierten Stations-Plänen.',
      'Edge-Modelle vergleichen Schichtfolgen lokal mit § 5 ArbZG und Tarifverträgen (TVöD-K, AVR) in Sekunden.',
      'Datenschutz: Keine Patientendaten, keine Cloud-Speicherung — schützt die Privatsphäre des Pflegepersonals.'
    ],
    whyNowEn: [
      'Multimodal vision decodes scribbled ballpoint amendments and directional arrows on crumpled staff bulletin boards.',
      'Edge models reconcile shift chronologies against statutory labor rest laws and collective bargaining agreements in seconds.',
      'Zero Cloud Risk: Operates entirely on the nurse\'s phone without uploading sensitive hospital scheduling data.'
    ],
    sketchDe: 'Foto des Dienstplan-Ausschnitts machen. Eigene Zeile antippen. KI berechnet Netto-Zuschläge (25% Nacht, 50% Sonntag, 35% Feiertag) und prüft 11-Stunden-Ruhezeit. Export als Gehalts-Prüfprotokoll.',
    sketchEn: 'Snap photo of ward roster. Tap your name row. AI computes net supplement entitlement (night, Sunday, holiday) and verifies 11-hour rest buffers. Generates payroll audit slip.',
    firstStepDe: {
      ticket: 'P0: Tabellen-Segmentierung für 1-Wochen-Dienstplan mit Erkennung der Schichtkürzel F, S, N.',
      criteria: 'Erkennt bei 10 verschiedenen Schriftbildern 95% der Schichtkürzel und berechnet Stundensummen fehlerfrei.'
    },
    firstStepEn: {
      ticket: 'P0: Roster grid cell extraction for 1-week rosters mapping shift symbols (E, L, N).',
      criteria: 'Achieves 95% parsing accuracy across 10 sample clinic rosters and sums working hours correctly.'
    },
    failureModeDe: 'Schlechtes Licht im Stations-Pausenraum: Bildverbesserungs-Filter (Grauwert-Spreizung und Schärfung) vor der Erkennung zwingend erforderlich.',
    failureModeEn: 'Dim breakroom lighting: Requires automated contrast stretching and adaptive thresholding prior to multimodal inference.',
    priorArtDe: 'Bestehende Krankenhaus-Dienstplan-Software (z.B. SP-Expert) ist für das Management gebaut, nicht für den rechtlichen Selbstschutz der Arbeitnehmer.',
    priorArtEn: 'Enterprise hospital scheduling platforms serve hospital management, never the worker\'s defensive legal self-audit.',
    tags: ['Echte Arbeit', 'Pflege', 'Schichtdienst', 'Arbeitsrecht', 'Lohnschutz', 'AI-Native'],
    emailTemplate: {
      subjectDe: 'Ein Geschenk für Pflegende: DienstplanWächter (CC0 Open Source)',
      bodyDe: 'Liebes Team vom Berufsverband,\n\nwir haben ein werbefreies, quelloffenes Werkzeug gebaut, das Pflegekräften hilft, handschriftliche Dienstpläne zu fotografieren, unberechnete Zuschläge aufzudecken und illegale Ruhezeitverkürzungen abzuwehren. Es ist ein bedingungsloses Geschenk (CC0) ohne kommerzielle Absicht.\n\nHerzliche Grüße,\nAmélie Initiative',
      subjectEn: 'A Gift for Nurses: Open Shift Guardian (CC0 Public Good)',
      bodyEn: 'Dear Nursing Association Team,\n\nWe have developed an ad-free, open-source tool enabling nurses to photograph paper rosters, audit missing shift bonuses, and defend mandatory rest periods. It is offered as an unconditional gift (CC0).\n\nWarm regards,\nAmélie Initiative',
      to: 'kontakt@dbfk.de'
    },
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Tabellen-OCR scheiterte an Pfeilen zwischen Zeilen, handschriftlichen Notizen ("tauscht mit Anna") und ungenormten Abkürzungen.',
      impossibleBeforeAiEn: 'Traditional grid OCR broke on handwritten arrows between staff rows, scribbled notes ("swapped with Anna"), and non-standard ward abbreviations.',
      aiTechStack: ['WebGPU ONNX Runtime', 'Vision-Language Transformer', 'Tarifvertrag (TVöD) Rule Engine', 'Local SQLite Storage'],
      privacyModelDe: 'Vollständig lokale Inferenz im Browser des Smartphones; kein Bild verlässt jemals das Telefon der Pflegekraft.',
      privacyModelEn: 'Strict on-device browser inference; zero images ever leave the healthcare worker’s smartphone.',
      ordinaryPeopleBenefitDe: 'Gibt überarbeiteten Pflegekräften hunderte Euro an rechtmäßigen Nacht- und Feiertagszuschlägen zurück und schützt vor gesundheitsgefährdenden Schichten.',
      ordinaryPeopleBenefitEn: 'Restores hundreds of dollars in earned shift differentials to exhausted hospital workers and shields them from illegal burnout shifts.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Dienstplan-Gitter-Erkennung', focus: 'Kamera-Perspektivenkorrektur und Zeilen-/Spalten-Extraktion von Dienstplan-Fotos', milestone: 'Rechteckiges Roster-Gitter mit korrekten Wochentagen und Namen' },
        { step: 2, title: 'Woche 2: Handschriften- & Kürzel-Disambiguierung', focus: 'Zuordnung von F1/S3/N-Codes und Pfeilkorrekturen zur jeweiligen Pflegekraft', milestone: 'Fehlerfreie chronologische Schichtfolge pro Person' },
        { step: 3, title: 'Woche 3: Tarif- & Arbeitszeitrechts-Prüfer', focus: 'Berechnung von Nachtstunden (21-6 Uhr), Sonntagszuschlägen und ArbZG-11h-Puffern', milestone: 'Warnmeldung bei Unterschreitung der 11h-Mindestruhezeit' },
        { step: 4, title: 'Woche 4: Lohnabrechnungs-Gegenüberstellung', focus: 'Generierung eines einfachen monatlichen Prüf-Belegs für die Personalabteilung', milestone: 'Druck- und exportfähiges PDF mit aufgeschlüsselten Zuschlägen' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Roster Grid Rectification', focus: 'Perspective flattening and grid cell segmentation from handheld smartphone photos', milestone: 'Orthogonal grid representation with dates and worker rows' },
        { step: 2, title: 'Week 2: Handwritten Shift Code Disambiguation', focus: 'Mapping idiosyncratic shift symbols and crossed-out corrections to staff identities', milestone: 'Chronological timeline of shifts per nurse' },
        { step: 3, title: 'Week 3: Labor Law & Premium Calculation', focus: 'Evaluating statutory night hours (9pm-6am), weekend rates, and 11-hour turnaround minimums', milestone: 'Automated notification of illegal shift compressions' },
        { step: 4, title: 'Week 4: Payroll Audit Slip Synthesizer', focus: 'Generating a clear monthly variance report to present to hospital payroll accounting', milestone: 'Exportable PDF with itemized bonus calculations' }
      ]
    }
  },
  {
    id: 'dose-tradesman-liability-shield',
    title: 'BedenkenBlitz (VOB/B Baustellen-Schutzschirm)',
    oneLinerDe: '15 Sekunden Sprachmemo + Foto vom feuchten Estrich: Erstellt sofort eine wasserdichte VOB/B-Bedenkenanmeldung gegen Schadensersatzklagen.',
    oneLinerEn: '15-second voice memo + photo of damp substrate: Instantly creates an enforceable statutory construction liability objection.',
    date: '17.09.2026',
    reviewAfter: '10/2026',
    recipientsDe: 'Fachverband Fliesen und Naturstein · Zentralverband des Deutschen Baugewerbes · IG BAU',
    recipientsEn: 'Associated General Contractors · National Tile Contractors Association · Trades Unions',
    domain: 'tools',
    verdict: 'gift',
    status: 'gepackt',
    problemDe: 'Wer als Fliesenleger oder Handwerker auf unzureichenden Vorleistungen (Risse, Restfeuchte) arbeitet, ohne vorher schriftlich Bedenken nach VOB § 4 anzumelden, haftet mit tausenden Euro. Mit Arbeitshandschuhen schreibt niemand juristische Briefe.',
    problemEn: 'Subcontractors who proceed over cracked concrete or damp screed without formal written warnings under construction law are held liable for thousands of dollars. No one types legal briefs on a dusty building site in work gloves.',
    whyNowDe: [
      'Robuste Spracherkennung versteht Baustellenjargon trotz Baulärms.',
      'Multimodale Modelle erfassen Messwerte von Feuchtemessgeräten und Rissbreitenlinealen im Foto.',
      'DIN-Normen (DIN 18560, DIN 18202) werden automatisch korrekt zitiert.'
    ],
    whyNowEn: [
      'Noise-robust speech models parse colloquial site jargon through generator background hum.',
      'Multimodal models read numerical readings directly off digital moisture meters and crack calipers.',
      'Building codes and statutory warranty exemption paragraphs are quoted with legal precision.'
    ],
    sketchDe: 'Handwerker spricht: "Hier Estrich 3,2% Feuchte, Riss an Türschwelle". Foto schießen. App erzeugt unterschriftsbereites PDF mit DIN 18560 Zitat und schickt es per WhatsApp an Architekt und Bauherr.',
    sketchEn: 'Artisan speaks: "Concrete screed 3.2% moisture, unreinforced crack at doorway". Snap photo. App generates signed PDF citing DIN 18560 and sends via messaging to architect.',
    firstStepDe: {
      ticket: 'P0: Audio-Transkription für Baustellen-Vokabular mit PDF-Generierung nach VOB/B § 4 Abs. 3.',
      criteria: 'Generiert aus 3 Beispielsätzen ein formell gültiges Bedenkenanmeldungs-Schreiben mit Baustellen-Metadaten.'
    },
    firstStepEn: {
      ticket: 'P0: Field audio transcription coupled to statutory defect reservation notice generator.',
      criteria: 'Transforms 3 sample spoken statements into a legally binding defect objection PDF.'
    },
    failureModeDe: 'Mangelhafte Baustellen-Adresse: App muss GPS nutzen, um das Bauvorhaben automatisch mit Straße und Hausnummer zu versehen.',
    failureModeEn: 'Missing jobsite street address: App must utilize reverse geocoding to attach accurate building parcel metadata.',
    priorArtDe: 'Kommerzielle Bausoftware kostet 80 €/Nutzer/Monat und setzt ein Büro-Team voraus — für den 1-Mann-Fliesenleger unbrauchbar.',
    priorArtEn: 'Enterprise construction management suites cost $100/seat/month and require desk staff—useless for solo craftspeople.',
    tags: ['Echte Arbeit', 'Handwerk', 'Baustelle', 'Rechtsschutz', 'Fliesenleger', 'AI-Native'],
    emailTemplate: {
      subjectDe: 'BedenkenBlitz: Kostenloses Schutzschild für Handwerker auf der Baustelle (CC0)',
      bodyDe: 'Liebe Kolleginnen und Kollegen im Handwerk,\n\nwir schenken dem Baugewerbe ein quelloffenes Werkzeug, mit dem Handwerker in 20 Sekunden per Sprachaufnahme eine wasserdichte Bedenkenanmeldung nach VOB/B erstellen können. Es schützt kleine Betriebe vor ruinösen Schadensersatzforderungen.\n\nMit handwerklichem Gruß,\nAmélie Initiative',
      subjectEn: 'Subcontractor Liability Shield: Open Tool for Field Tradespeople (CC0)',
      bodyEn: 'Dear Trades Association Colleagues,\n\nWe are sharing an open-source field utility that allows solo tradespeople to generate enforceable liability warning notices in 20 seconds using voice and photos on site. Unconditional gift (CC0).\n\nBest regards,\nAmélie Initiative',
      to: 'info@zdb.de'
    },
    aiFrontier: {
      impossibleBeforeAiDe: 'Kombination aus verrauschter Sprachaufnahme, Handwerker-Fachbegriffen ("Estrich schüsselt") und juristischer DIN-Norm-Zuordnung war ohne Anwalt unmöglich.',
      impossibleBeforeAiEn: 'Synthesizing reverberant speech with specialized trade jargon into legally binding engineering code references was impossible without a construction attorney.',
      aiTechStack: ['Whisper Small On-Device Engine', 'DIN 18560 / VOB Knowledge Graph', 'Client-Side PDFKit', 'Geolocation Reverse Lookup'],
      privacyModelDe: 'Reine Browser-Anwendung ohne zentrale Speicherung von Baustellendaten oder Kundennamen.',
      privacyModelEn: 'Pure client-side web utility; zero jobsite photos or client identities are retained on any server.',
      ordinaryPeopleBenefitDe: 'Schützt selbstständige Handwerker und Gesellen vor existenzvernichtenden 15.000 € Haftungsklagen.',
      ordinaryPeopleBenefitEn: 'Protects independent working tradespeople from ruinous $15,000 contractor defect counterclaims.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Baustellen-Spracheingabe & Rauschfilter', focus: 'Audio-Aufnahme mit automatischer Normalisierung gegen Hintergrundlärm von Sägen und Rührwerken', milestone: 'Verlässliche Transkription gesprochener Mängelbeschreibungen' },
        { step: 2, title: 'Woche 2: Messwerte- & Riss-Foto-Analyse', focus: 'Optisches Auslesen von CM-Messgeräten, Hygrometern und Risslinealen', milestone: 'Exakter numerischer Messwert im Protokoll hinterlegt' },
        { step: 3, title: 'Woche 3: VOB/B & DIN-Norm-Regelwerk', focus: 'Verknüpfung von Mängelbildern mit DIN 18560 (Estrich) und DIN 18202 (Toleranzen)', milestone: 'Automatische juristische Begründung mit Fristsetzung zur Nachbesserung' },
        { step: 4, title: 'Woche 4: 1-Klick WhatsApp- & PDF-Versand', focus: 'Generierung des fälschungssicheren PDF mit digitalem Unterschriftsfeld und Geotag', milestone: 'Rechtswirksamer Versand an Bauleitung vor Beginn der Verlegearbeiten' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Jobsite Acoustic Voice Input', focus: 'Capturing speech with ambient noise cancellation against power saws and concrete mixers', milestone: 'Accurate transcript of spoken substrate defects' },
        { step: 2, title: 'Week 2: Visual Gauge & Caliper Extraction', focus: 'Reading numerical values from digital moisture meters and crack gauges', milestone: 'Objective numerical evidence embedded in report' },
        { step: 3, title: 'Week 3: Statutory Building Code Mapping', focus: 'Matching defect classes to DIN 18560 (screeds) and DIN 18202 (tolerances)', milestone: 'Enforceable legal rationale with remediation deadline' },
        { step: 4, title: 'Week 4: Instant PDF & Message Dispatch', focus: 'Client-side PDF generation with digital signature field and verified GPS timestamp', milestone: 'Legally binding notice dispatched to general contractor before work begins' }
      ]
    }
  },
  {
    id: 'dose-cleaner-chemical-safety',
    title: 'ChemGefahr-Stopp (Chemical Safety & Poison Shield for Cleaners)',
    oneLinerDe: 'Kamera auf 2 Putzmittelflaschen richten: Warnt laut in 20 Sprachen vor Chlorgas und Verätzungen bei falschem Mischen.',
    oneLinerEn: 'Point phone camera at 2 cleaning chemical bottles: Warns audibly in 20 languages against toxic chlorine gas and acid burns.',
    date: '17.09.2026',
    reviewAfter: '10/2026',
    recipientsDe: 'IG BAU Bundesfachgruppe Gebäudereinigung · Berufsgenossenschaft der Bauwirtschaft (BG BAU)',
    recipientsEn: 'Service Employees International Union (SEIU) · European Cleaning and Facility Services Industry',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    problemDe: 'Reinigungskräfte arbeiten nachts unter Zeitdruck, oft mit Sprachbarrieren. Das versehentliche Mischen von Sanitärreinigern (Säure) mit chlorhaltigen Bleichmitteln setzt tödliches Chlorgas frei.',
    problemEn: 'Commercial cleaners work under extreme speed pressure, frequently facing language hurdles. Accidental mixing of acidic descalers with bleach releases deadly chlorine gas into confined restrooms.',
    whyNowDe: [
      'Vision-Modelle erkennen Inhaltsstoffe auf zerkratzten und gebogenen Flaschenetiketten in Sekundenbruchteilen.',
      'Sofortige laute Audio-Sprachausgabe in der Muttersprache (Ukrainisch, Polnisch, Türkisch, Arabisch, etc.) ohne Textlesen.',
      'Keine Internetverbindung nötig — läuft offline in Kellern und fensterlosen Waschräumen.'
    ],
    whyNowEn: [
      'Vision models parse compound names on warped, wet, and scuffed bottles in milliseconds.',
      'Instant spoken audio warning in the worker\'s mother tongue removes the burden of reading technical German.',
      'Zero internet requirement—runs 100% offline in basement restrooms and custodial closets.'
    ],
    sketchDe: 'Arbeiter hält 2 Flaschen nebeneinander vor die Handykamera. Wenn Säure + Hypochlorit erkannt werden: Bildschirm blinkt grellrot, Handy vibriert, laute Stimme ruft: "STOPP! Nicht mischen! Chlorgas-Gefahr!"',
    sketchEn: 'Worker holds 2 bottles in front of phone camera. If acid + hypochlorite detected: Screen flashes high-contrast red, phone vibrates, loud voice announces: "STOP! Do not mix! Poisonous gas!"',
    firstStepDe: {
      ticket: 'P0: Bildklassifikation von 2 Haushalts-/Gewerbereinigern mit Inkompatibilitäts-Matrix und Sprachausgabe.',
      criteria: 'Warnt bei Mischung von WC-Reiniger (Salz-/Phosphorsäure) und Bleiche (Natriumhypochlorit) innerhalb von 1 Sekunde.'
    },
    firstStepEn: {
      ticket: 'P0: Visual dual-bottle compound classification with incompatibility matrix and audio alert.',
      criteria: 'Triggers audio alarm on acid + hypochlorite combination within 1 second of camera detection.'
    },
    failureModeDe: 'Stummgeschaltetes Telefon: App muss bei akuter Lebensgefahr die Lautstärke automatisch anheben oder haptischen Alarm (Vibrationsmuster) erzwingen.',
    failureModeEn: 'Muted audio settings: App must trigger distinctive high-frequency haptic vibration pulses alongside screen flashes.',
    priorArtDe: '15-seitige Sicherheitsdatenblätter im Personalbüro, die während des Putzens niemand liest oder versteht.',
    priorArtEn: '18-page technical safety data sheets locked in custodial binders that are unreadable during night shifts.',
    tags: ['Echte Arbeit', 'Reinigung', 'Arbeitsschutz', 'Sicherheit', 'Mehrsprachig', 'AI-Native'],
    emailTemplate: {
      subjectDe: 'Lebensschutz für Reinigungskräfte: ChemGefahr-Stopp (Quelloffenes Geschenk)',
      bodyDe: 'Liebe Kolleginnen und Kollegen der Gebäudereinigung,\n\nwir haben eine kostenlose Smartphone-Hilfe entwickelt, die Reinigungskräften per Kamera und Audio in 20 Sprachen sekundenschnell warnt, wenn Reinigungsmittel gefährliche Dämpfe bilden. Ein reines Geschenk (CC0) für den Arbeitsschutz.\n\nMit kollegialem Gruß,\nAmélie Initiative',
      subjectEn: 'Worker Poison Shield for Cleaners: Open Safety Tool (CC0)',
      bodyEn: 'Dear Cleaning Industry Union Colleagues,\n\nWe have created an open-source smartphone tool warning cleaners in 20 native languages whenever cleaning products threaten toxic vapor releases. An unconditional gift (CC0).\n\nBest regards,\nAmélie Initiative',
      to: 'gebaeudereinigung@igbau.de'
    },
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische OCR scheiterte an gewölbten, nassen Flaschen, Spiegelungen und wechselnden Handelsnamen für denselben Wirkstoff.',
      impossibleBeforeAiEn: 'Traditional optical recognition struggled with curved plastic bottles, wet surfaces, and brand synonyms for identical chemical compounds.',
      aiTechStack: ['TensorFlow Lite Micro / WebGPU', 'GHS Hazard Classification Table', 'Polyglot Web Speech Synthesizer', 'Offline Asset Cache'],
      privacyModelDe: 'Lokale Kamera-Auswertung im Gerätespeicher; keinerlei Übertragung von Video- oder Standortdaten.',
      privacyModelEn: 'Strictly on-device visual evaluation; zero video frames or location coordinates ever leave the device.',
      ordinaryPeopleBenefitDe: 'Rettet die Gesundheit von Menschen, die oft ohne ausreichende Einweisung und Schutzkleidung hart arbeiten müssen.',
      ordinaryPeopleBenefitEn: 'Safeguards the lungs and health of vulnerable cleaning staff working without adequate protective training.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Kamera-Flaschen-Erkennung', focus: 'Echtzeit-Erkennung von Produktetiketten auf gewölbten zylindrischen Behältern', milestone: 'Zuverlässiges Auslesen von GHS-Gefahrensymbolen und Produktnamen' },
        { step: 2, title: 'Woche 2: Chemische Unverträglichkeits-Matrix', focus: 'Modellierung gefährlicher Reaktionen (Säure + Chlorid, Ammoniak + Bleiche, Laugen)', milestone: 'Sofortige Erkennung letaler Mischungen in unter 500ms' },
        { step: 3, title: 'Woche 3: Mehrsprachige Audio-Warnungen', focus: 'Audio-Synthese in 20 Sprachen mit klaren Instruktionen und visueller Barrierefreiheit', milestone: 'Verständliche akustische Warnung auch ohne Deutschkenntnisse' },
        { step: 4, title: 'Woche 4: Offline-Robustheit im Keller', focus: 'PWA-Verpackung mit vollständigem Offline-Betrieb ohne jeglichen Serverkontakt', milestone: 'Funktioniert zuverlässig in fensterlosen Tiefgaragen und Bunker-WCs' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Curved Bottle Label Parsing', focus: 'Real-time extraction of product names and GHS pictograms on cylindrical bottles', milestone: 'Accurate OCR on warped reflective containers' },
        { step: 2, title: 'Week 2: Chemical Incompatibility Matrix', focus: 'Encoding hazardous reactions (acids + bleach, ammonia + hypochlorite, caustic lyes)', milestone: 'Sub-500ms lethal interaction detection' },
        { step: 3, title: 'Week 3: Multilingual Voice Warnings', focus: 'Spoken alerts across 20 languages with high-contrast accessibility displays', milestone: 'Instantly comprehensible audio alerts regardless of host language fluency' },
        { step: 4, title: 'Week 4: Zero-Connectivity Basement PWA', focus: 'PWA service worker packaging enabling 100% offline edge inference', milestone: 'Guaranteed reliability in shielded basement bathrooms without cell reception' }
      ]
    }
  }
];

export const DISCARDED_DATA: DiscardedItem[] = [
  {
    id: 'git-archaeologist',
    title: 'git-archaeologist (MCP)',
    originalIdeaDe: 'Repo-History als Frage-Interface: Warum existiert diese Zeile? Kette aus blame → PR → Issue → Diskussion.',
    originalIdeaEn: 'Repo history inquiry interface: Why does this line exist? Connect blame → PR → Issue → discussion thread.',
    whyDiscardedDe: 'Innerhalb von wenigen Monaten mehrfach unabhängig von verschiedenen Entwicklern und Firmen gebaut (u.a. codebase-archaeology MCP, GitKraken MCP).',
    whyDiscardedEn: 'Independently built multiple times within months by different developers and companies (codebase-archaeology MCP, GitKraken MCP tools).',
    lessonDe: 'Bei naheliegenden Tooling-Ideen im aktiven Ökosystem beträgt das Zeitfenster Monate, nicht Jahre.',
    lessonEn: 'In active developer tooling ecosystems, the window of unbuilt obvious ideas is months, not years.',
    domain: 'DevTools & MCP',
    evidence: [
      'codebase-archaeology MCP Server',
      'GitKraken Code History MCP integration',
      'GitHub Copilot commit context tracing'
    ]
  },
  {
    id: 'home-network-mcp',
    title: 'Home-Network MCP',
    originalIdeaDe: 'Router als Tool-Server: Wer ist im Netz, Bandbreite, DNS-Blocklisten togglen per Chat statt Web-Interface.',
    originalIdeaEn: 'Home router as an agent tool server: check active devices, bandwidth, toggle DNS blocklists via chat.',
    whyDiscardedDe: 'Mindestens vier unabhängige FRITZ!Box-MCP-Server und Home Assistant MCP-Integrationen existieren bereits.',
    whyDiscardedEn: 'At least four separate FRITZ!Box MCP servers and deep Home Assistant bidirectional integrations already exist in registries.',
    lessonDe: '„Naheliegendes Gerät + neues Protokoll" ist die am dichtesten besetzte Nische überhaupt. Existiert fast immer bereits.',
    lessonEn: '"Ubiquitous device + new protocol" is the most crowded niche imaginable. Almost always saturated.',
    domain: 'IoT & Smart Home',
    evidence: [
      'fritzbox-mcp (mehrere Forks auf GitHub)',
      'Home Assistant MCP server',
      'OpenWRT chat plugins'
    ]
  },
  {
    id: 'repo-museum',
    title: 'Repo-Museum',
    originalIdeaDe: 'Begehbare 3D-Galerie der eigenen Repos: Repo = Raum, Commits = Exponate, tote Branches = Keller.',
    originalIdeaEn: 'Walkable 3D museum of git repos: repository = exhibition hall, commits = artifacts, stale branches = basement.',
    whyDiscardedDe: 'Bereits mehrfach als 3D-Städte gebaut (Gource, CodeCity, GitHub Skyline, 3D Repo Explorer). Die Museumsmetapher ist nur Designkosmetik, keine neue Fähigkeit.',
    whyDiscardedEn: 'Built repeatedly as 3D cities and galleries (Gource, CodeCity, GitHub Skyline). The museum theme is visual styling, not a functional breakthrough.',
    lessonDe: 'Ein Designunterschied allein ohne funktionale neue Fähigkeit rechtfertigt keine Dose zum Verschenken.',
    lessonEn: 'A visual theme difference alone without new capability does not justify an Amélie tin gift.',
    domain: 'Visualisierung & Demos',
    evidence: [
      'Gource 3D software visualization',
      'GitHub Skyline & 3D city repos',
      'CodeCity academic research'
    ]
  },
  {
    id: 'commute-oracle',
    title: 'Commute Oracle',
    originalIdeaDe: 'Kein offizielles Fahrplan-ETA, sondern ein persönliches Modell, das geloggte Fahrten lernt und sagt, wann man wirklich losmuss.',
    originalIdeaEn: 'Personal departure oracle: learns your real movement speed rather than transit schedule to predict exact departure time.',
    whyDiscardedDe: 'Kommerziell vollständig besetzt durch Citymapper (KI-Pendelprognose 2026) und Google Maps. Eine Einzelperson kann ohne Echtzeitflottendaten nicht konkurrieren.',
    whyDiscardedEn: 'Commercially dominated by Citymapper (AI commute prediction) and Google Maps transit telemetry.',
    lessonDe: 'Gegen Plattformen mit proprietären Milliarden-Echtzeitdatenpunkten kann ein offenes Geschenk ohne Daten nicht bestehen.',
    lessonEn: 'An open gift app cannot compete against commercial giants with billion-point live vehicle telemetry.',
    domain: 'Mobilität & Pendeln',
    evidence: [
      'Citymapper departure prediction AI',
      'Google Maps Commute Assistant',
      'Transit App personal arrival forecasting'
    ]
  }
];

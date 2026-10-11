import { Language } from '../../types';

export interface ArchitectureTier {
  id: string;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  sharePercent: number;
  dosenCount: number;
  descriptionDe: string;
  descriptionEn: string;
  descriptionEs: string;
  techStack: string[];
  halflifeDe: string;
  halflifeEn: string;
  halflifeEs: string;
  color: string;
}

export interface AchillesHeel {
  id: string;
  titleDe: string;
  titleEn: string;
  titleEs: string;
  dangerDe: string;
  dangerEn: string;
  dangerEs: string;
  affectedDosen: string[];
  countermeasureDe: string;
  countermeasureEn: string;
  countermeasureEs: string;
  icon: string;
}

export interface RoundRetrospective {
  id: string;
  roundNameDe: string;
  roundNameEn: string;
  roundNameEs: string;
  date: string;
  topicDe: string;
  topicEn: string;
  topicEs: string;
  statsDe: string;
  statsEn: string;
  keyLessonDe: string;
  keyLessonEn: string;
  keyLessonEs: string;
  dosePackaged: string;
  gravesCount: number;
}

export interface CoreHeuristic {
  id: string;
  number: number;
  titleDe: string;
  titleEn: string;
  titleEs: string;
  summaryDe: string;
  summaryEn: string;
  summaryEs: string;
  detailDe: string;
  detailEn: string;
  detailEs: string;
  tag: string;
}

/**
 * 1. Das Architektur-Trilemma im Gemeinwohl-Sektor (aus amelie-reviewer-learning-log.md)
 */
export const ARCHITECTURE_TIERS: ArchitectureTier[] = [
  {
    id: 'tier-1',
    nameDe: 'Tier 1: 100% Client-Side / Zero-Cloud',
    nameEn: 'Tier 1: 100% Client-Side / Zero-Cloud',
    nameEs: 'Tier 1: 100% Lado del cliente / Cero Nube',
    sharePercent: 56.4,
    dosenCount: 25,
    descriptionDe: 'Reine Browser-Werkzeuge ohne Server, Docker oder Datenbanken. Höchste Überlebenschance bei Übergabe an NGOs oder Unis, da keine Betriebskosten entstehen und kein Bitrot droht.',
    descriptionEn: 'Pure browser instruments without servers, Docker, or databases. Highest survival rate when handed to NGOs or universities: zero operational cost, immune to bitrot.',
    descriptionEs: 'Herramientas web puras sin servidores, Docker ni bases de datos. Máxima probabilidad de supervivencia al donarse a ONGs o universidades.',
    techStack: ['WebAssembly', 'HTML5 Canvas', 'Web Audio API', 'Deterministic TS'],
    halflifeDe: 'Theoretisch Unendlich (keine Serverwartung, keine API-Keys)',
    halflifeEn: 'Theoretically infinite (zero maintenance, zero API keys)',
    halflifeEs: 'Teóricamente infinita (sin mantenimiento de servidores)',
    color: 'emerald',
  },
  {
    id: 'tier-2',
    nameDe: 'Tier 2: Client-Side + Statische Vektordaten',
    nameEn: 'Tier 2: Client-Side + Static Vector Assets',
    nameEs: 'Tier 2: Lado del cliente + Datos vectoriales estáticos',
    sharePercent: 38.5,
    dosenCount: 17,
    descriptionDe: 'Lokale Auswertung raumbezogener oder datenintensiver Aufgaben über moderne offene Web-Standards. Kiez- und Personendaten verlassen den Browser zu keinem Zeitpunkt.',
    descriptionEn: 'Local evaluation of spatial or data-dense tasks using modern open web standards. Citizen and local community data never leaves the browser.',
    descriptionEs: 'Evaluación local de tareas espaciales o densas en datos con estándares web abiertos. Los datos vecinales nunca salen del navegador.',
    techStack: ['PMTiles', 'MiniSearch WASM', 'SQLite WASM', 'IndexedDB'],
    halflifeDe: 'Sehr hoch (statische CDN-Auslieferung auf GitHub Pages)',
    halflifeEn: 'Very high (static CDN asset delivery via GitHub Pages)',
    halflifeEs: 'Muy alta (entrega estática por CDN en GitHub Pages)',
    color: 'blue',
  },
  {
    id: 'tier-3',
    nameDe: 'Tier 3: Ephemere Datenbrücken',
    nameEn: 'Tier 3: Ephemeral Open Data Bridges',
    nameEs: 'Tier 3: Puentes de datos efímeros',
    sharePercent: 5.1,
    dosenCount: 3,
    descriptionDe: 'Physikalisch unvermeidbare Schnittstellen (Wetterradar, Satellitentelemetrie). Amélie-Regel: Nur zulässig, wenn der Rohdatenstrom eine offene behördliche Schnittstelle (DWD, OPERA) ist und keine privaten Daten speichert.',
    descriptionEn: 'Physically unavoidable bridges (weather radar, satellite feeds). Rule: Only permitted if the raw stream is an open official API (DWD, OPERA) storing zero private data.',
    descriptionEs: 'Puentes de datos físicamente inevitables (radar meteorológico, telemetría). Solo permitido con APIs oficiales abiertas sin guardar datos privados.',
    techStack: ['OPERA Radar', 'DWD CDC Open Data', 'PEGELONLINE REST'],
    halflifeDe: 'Gebunden an die Stabilität behördlicher Rohdaten-APIs',
    halflifeEn: 'Tied to the availability of official governmental open APIs',
    halflifeEs: 'Vinculada a la estabilidad de APIs públicas oficiales',
    color: 'amber',
  },
  {
    id: 'tier-4',
    nameDe: 'Tier 4: Schwere Cloud & Benutzerkonten',
    nameEn: 'Tier 4: Heavy Cloud Backends & User Accounts',
    nameEs: 'Tier 4: Nube pesada y cuentas de usuario',
    sharePercent: 0.0,
    dosenCount: 0,
    descriptionDe: 'Klassische SaaS-Architekturen mit Benutzer-Logins, PostgreSQL-Clustern und Abo-Gebühren. In Amélie konsequent eliminiert (Regel 4), da sie im Gemeinwohlbereich nach Projektende verlässlich sterben.',
    descriptionEn: 'Classic SaaS architectures with logins, PostgreSQL clusters, and recurring subscriptions. Conspicuously eliminated in Amélie (Rule 4): guaranteed to rot post-grant.',
    descriptionEs: 'Arquitecturas SaaS tradicionales con cuentas, PostgreSQL y cuotas. Eliminadas por principio en Amélie (Regla 4).',
    techStack: ['Eliminiert gem. Amélie-Regel 4'],
    halflifeDe: '0 Monate nach Ablauf des Förderbudgets',
    halflifeEn: '0 months after initial funding expires',
    halflifeEs: '0 meses tras agotarse la subvención',
    color: 'stone',
  },
];

/**
 * 2. Die Typologie der „Achillesferse“ öffentlicher Geschenke (aus amelie-reviewer-learning-log.md)
 */
export const ACHILLES_HEELS: AchillesHeel[] = [
  {
    id: 'liability-trap',
    titleDe: 'Die juristische Haftungsfalle (Falschberatungs-Angst)',
    titleEn: 'The Legal Liability Trap (Appraisal Confusion)',
    titleEs: 'La trampa de responsabilidad jurídica',
    icon: '⚖️',
    dangerDe: 'Bürger oder Handwerker missverstehen deterministische Berechnungen als rechtsverbindliches Gutachten oder Baugenehmigung.',
    dangerEn: 'Citizens or tradespeople misinterpret deterministic estimations as legally certified expert opinions or permits.',
    dangerEs: 'Los ciudadanos confunden los cálculos deterministas con un peritaje legal vinculante.',
    affectedDosen: ['altbau-thermal', 'dose-tradesman-liability-shield', 'bleifrei-lotse', 'waermesignatur'],
    countermeasureDe: 'Niemals isolierte Einzelzahlen oder das Wort „unbedenklich" ausgeben. Stets deterministische Risikobänder, Konfidenzintervalle und explizite Nicht-Ansprüche führen.',
    countermeasureEn: 'Never output a single isolated scalar or the word "safe". Always provide deterministic risk bands, confidence intervals, and explicit non-claims.',
    countermeasureEs: 'No emitir nunca un valor único aislado ni la palabra «seguro». Presentar bandas de riesgo y límites claros.',
  },
  {
    id: 'sensor-noise',
    titleDe: 'Das physikalische Signal-Rausch-Problem (Sensor-Artefakte)',
    titleEn: 'Physical Signal-to-Noise Floor (Sensor Artefacts)',
    titleEs: 'El problema de ruido físico en sensores',
    icon: '🎙️',
    dangerDe: 'Smartphone-Mikrofone und -Kameras variieren drastisch in Güte, Ausrichtung und Umgebungsrauschen, was zu Fehlalarmen führt.',
    dangerEn: 'Smartphone microphones and cameras vary wildly in hardware calibration and ambient noise, causing false alarms.',
    dangerEs: 'Los micrófonos y cámaras de smartphones varían notablemente en calibración y ruido ambiental.',
    affectedDosen: ['bleifrei-lotse', 'klang-stethoskop', 'raeucher-sim', 'pillsafe-vision'],
    countermeasureDe: 'Redundante Vorfilter vorschalten (z. B. Magnet-Vorprüfung bei Bleirohren, Bandpassfilter bei Körperschall, Schichtungsassistenten bei Fotos).',
    countermeasureEn: 'Mandate redundant physical pre-filters (e.g. magnet test prior to acoustic lead resonance, bandpass filters for vibration, layering UI guides for photos).',
    countermeasureEs: 'Anteponer prefiltros físicos redundantes (imán antes de resonancia acústica, filtros paso banda para vibraciones).',
  },
  {
    id: 'citizen-burnout',
    titleDe: 'Die Beteiligungs-Ermüdung (Citizen Science Burnout)',
    titleEn: 'Citizen Science Engagement Fatigue',
    titleEs: 'El agotamiento de participación ciudadana',
    icon: '🌱',
    dangerDe: 'Werkzeuge, die auf kontinuierliche manuelle Bürger-Eingaben angewiesen sind, verwaisen nach wenigen Wochen.',
    dangerEn: 'Instruments requiring continuous manual citizen data entry collapse after a few initial weeks.',
    dangerEs: 'Herramientas que exigen entradas manuales continuas caen en desuso a las pocas semanas.',
    affectedDosen: ['fugenduell-patenschaft', 'kiez-laermkarte', 'sperrmuell-radar'],
    countermeasureDe: 'Dezentrale Übergabeprotokolle (Paten-Staffelstab per QR-Code) und spurlos verfallende Geopins (z. B. 12-Stunden-TTL beim Sperrmüll-Radar) verhindern Datenmüll und Frust.',
    countermeasureEn: 'Decentralized baton-passing protocols (QR stewardship handoff) and auto-expiring geo-pins (12-hour TTL) eliminate stale data frustration.',
    countermeasureEs: 'Protocolos de relevo descentralizados (traspaso por QR) y pines geoespaciales con caducidad automática (TTL de 12 h).',
  },
  {
    id: 'bureaucratic-blockade',
    titleDe: 'Die behördliche Vollzugsverweigerung (RIS-Blockade)',
    titleEn: 'Bureaucratic Inertia & Administrative Obstruction',
    titleEs: 'El bloqueo burocrático administrativo',
    icon: '🏛️',
    dangerDe: 'Bürgeranliegen treffen auf veraltete IT, Überlastung oder Lobby-Gegenwind in Bau- und Umweltämtern.',
    dangerEn: 'Citizen submissions run into outdated municipal IT, severe staff shortage, or lobbying pushback from developers.',
    dangerEs: 'Las peticiones ciudadanas chocan contra sistemas municipales anticuados o resistencia de promotores.',
    affectedDosen: ['klarlokal', 'glasanflug-ampel', 'lichtplan-check'],
    countermeasureDe: 'Das Geschenk muss die juristische Norm (BImSchG, LAG VSW, OParl) so präzise zitieren, dass Bürger formgerechte Einwendungs-Schreiben auf Knopfdruck erzeugen, die nicht ignoriert werden dürfen.',
    countermeasureEn: 'Tools must cite the binding statutory norm (BImSchG, LAG VSW, OParl) so cleanly that citizens generate legally valid formal objections that officials cannot dismiss.',
    countermeasureEs: 'Citar la norma legal vinculante con tal precisión que los ciudadanos generen alegaciones formales que la administración no pueda desestimar.',
  },
];

/**
 * 3. Kern-Heuristiken & Stoppregeln (aus amelie-suchplaybook.md)
 */
export const CORE_HEURISTICS: CoreHeuristic[] = [
  {
    id: 'heuristic-4-step',
    number: 1,
    titleDe: 'Die 4-Stufen-Prüfreihenfolge pro Idee',
    titleEn: 'The 4-Step Verification Sequence',
    titleEs: 'La secuencia de verificación en 4 pasos',
    summaryDe: 'Friedhof (0 €) → Empfänger-KI → Deutsch (Funktion) → Englisch (Produkt) → Nische/Forum.',
    summaryEn: 'Graveyard (free) → Recipient AI → German (Function) → English (Product) → Niche Forums.',
    summaryEs: 'Cementerio (0 €) → IA del destinatario → Alemán (Función) → Inglés (Producto) → Foros.',
    detailDe: 'Verhindert billige Fehlversuche: Vor jeder Websuche prüft der Friedhof, ob die Idee schon begraben liegt. Die Suche nach „<Empfänger> KI" entlarvt sofort, ob die Zielorganisation die Lösung bereits selbst entwickelt hat.',
    detailEn: 'Prevents wasteful cycles: checking the graveyard stops zombie ideas at zero token cost. Searching "<recipient> AI" instantly exposes whether the target NGO already built the solution.',
    detailEs: 'Evita ciclos innecesarios: el cementerio detiene ideas resucitadas a coste cero. La búsqueda «<destinatario> IA» revela si la organización ya creó la solución.',
    tag: 'Such-Disziplin',
  },
  {
    id: 'heuristic-us-preemption',
    number: 2,
    titleDe: 'Die US-Markt-Vorzieh-Regel für Alltagsideen',
    titleEn: 'The US Market Pre-Emption Rule for Everyday Ideas',
    titleEs: 'La regla de prioridad del mercado estadounidense',
    summaryDe: 'Bei Endnutzer- und Alltagsideen immer zuerst US-Englisch mit Produktbegriffen suchen.',
    summaryEn: 'For consumer and everyday apps, search US English product keywords first.',
    summaryEs: 'Para ideas de consumo y vida cotidiana, buscar siempre primero en inglés estadounidense.',
    detailDe: 'Der US-Markt baut Konsum- und Nachbarschaftsideen meist 12–24 Monate vor Europa. Was im deutschsprachigen Web wie eine Lücke aussieht, läuft in den USA oft schon als venture-finanzierte Plattform.',
    detailEn: 'The US market tests consumer and neighborhood concepts 12–24 months ahead of Europe. What looks like an open gap in German search results is frequently an established US VC platform.',
    detailEs: 'El mercado estadounidense lanza apps vecinales y de consumo 12–24 meses antes que Europa.',
    tag: 'Vorfilter',
  },
  {
    id: 'heuristic-stopping-rule',
    number: 3,
    titleDe: 'Die Stoppregel bei ≤ 12 Monate alten Treffern',
    titleEn: 'The Stopping Rule for Fresh Hits (≤ 12 Months)',
    titleEs: 'La regla de parada para coincidencias recientes (≤ 12 meses)',
    summaryDe: 'Ein Treffer, der die Idee voll abdeckt und ≤ 12 Monate alt ist → sofort Urteil „besetzt".',
    summaryEn: 'A hit covering the idea published ≤ 12 months ago → immediate verdict: "besetzt" (occupied).',
    summaryEs: 'Cualquier resultado que cubra la idea y tenga ≤ 12 meses → veredicto inmediato «ocupado».',
    detailDe: 'Niemals nach Gründen suchen, eine besetzte Idee doch noch künstlich zu retten. Besetzt ist ein valides Forschungsergebnis und spart wertvolle Entwicklungszeit.',
    detailEn: 'Never contrive artificial excuses to rescue a saturated concept. "Occupied" is a high-value finding that preserves development bandwidth.',
    detailEs: 'Nunca inventar justificaciones para rescatar una idea ocupada. Declararla ocupada ahorra tiempo valioso.',
    tag: 'Entscheidungs-Gate',
  },
  {
    id: 'heuristic-narrow-vs-discard',
    number: 4,
    titleDe: 'Verengen statt verwerfen (Strukturelle Schwäche)',
    titleEn: 'Narrow Down Instead of Discarding (Structural Flaws)',
    titleEs: 'Estrechar en vez de descartar (fallo estructural)',
    summaryDe: 'Wenn der Treffer hinter Kontozwang, Tracking oder Paywalls liegt, ist die freie Variante die Lücke.',
    summaryEn: 'If an existing product is locked behind accounts, tracking, or fees, the open local tool is the gap.',
    summaryEs: 'Si el producto existente exige registro, rastreo o pago, la herramienta abierta es la brecha libre.',
    detailDe: 'Eine Schwäche kann technisch sein (z. B. Modell halluziniert bei Randfällen) oder strukturell (z. B. US-App verkauft Nutzerdaten). Die gemeinnützige, lokale Zero-Cloud-Alternative ist dann legitim „verengt".',
    detailEn: 'A flaw can be technical (hallucinations on edge cases) or structural (surveillance data brokering). A privacy-respecting client-side tool is legitimate as "verengt" (narrowed).',
    detailEs: 'Una debilidad puede ser técnica o estructural (monetización de datos). La alternativa libre sin nube es válida.',
    tag: 'Lückenfindung',
  },
];

/**
 * 4. Runden-Retrospektiven & Reallabore (aus amelie-suchplaybook.md & 06-suche/)
 */
export const ROUND_RETROSPECTIVES: RoundRetrospective[] = [
  {
    id: 'heimatgedaechtnis-2026-09-29',
    roundNameDe: 'Heimatgedächtnis & Spiel (Teamrunde 3)',
    roundNameEn: 'Local Heritage & Play (Team Round 3)',
    roundNameEs: 'Memoria local y juego (Ronda de equipo 3)',
    date: '29.09.2026',
    topicDe: 'Ortswissen, Flurnamen, Dialekt und spielerische Mechaniken mit Vektor V8 (Fun)',
    topicEn: 'Local micro-toponyms, dialects, and playful mechanics evaluated with Vector V8 (Fun)',
    topicEs: 'Toponimia menor, dialectos y mecánicas lúdicas con Vector V8 (Diversión)',
    statsDe: '14 geprüfte Ideen → 1 Dose, 9 Needs Research, 12 neue Gräber (81 gesamt)',
    statsEn: '14 reviewed concepts → 1 Dose, 9 Needs Research, 12 new graves (81 total)',
    keyLessonDe: 'Lehre: Keine der Fun-5-Ideen wurde direkt Dose. Datensammeln im Feld ist bereits dicht besetzt; unbesetzte Lücken liegen bei deterministischer Verifikation gegen Messwerte und spielerischen Schichten. V8 Fun kompensiert nie Kernvektoren.',
    keyLessonEn: 'Lesson: None of the Fun-5 concepts graduated to a Dose. Field data collection is already crowded; true gaps lie in deterministic validation against physical data and light game layers. V8 Fun never compensates for core vectors.',
    keyLessonEs: 'Lección: La recolección de datos en campo ya está saturada; las brechas reales radican en la verificación determinista contra mediciones reales. V8 no compensa vectores centrales.',
    dosePackaged: 'strassennamen-pruefer',
    gravesCount: 12,
  },
  {
    id: 'offenlegung-2026-09-28',
    roundNameDe: 'Offenlegungs-Runde Lauf A & B (Teamrunde 2)',
    roundNameEn: 'Corporate Disclosures Round A & B (Team Round 2)',
    roundNameEs: 'Divulgaciones corporativas ronda A y B',
    date: '28.09.2026',
    topicDe: 'Muster „Offenlegungspflicht ohne Register" auf EUDR, CSRD, BattVO, EnEfG und ESPR',
    topicEn: 'Pattern "Public Disclosure Duty Without Register" tested against EUDR, CSRD, BattVO, EnEfG, and ESPR',
    topicEs: 'Patrón «obligación de divulgación sin registro central» probado en directivas de la UE',
    statsDe: '37 geprüfte Konzepte über 2 Läufe → 1 Dose (EnEfG § 9), 1 Needs Research, 13 Gräber',
    statsEn: '37 evaluated concepts across 2 parallel runs → 1 Dose (EnEfG § 9), 1 Needs Research, 13 graves',
    keyLessonDe: 'Lehre: Das Register-Muster trägt nur bei jungen Pflichten ohne benannte Bundes- oder EU-Behörde (wie EnEfG § 9 und ESPR Art. 24). Reife Rechtsregime (LkSG, BattVO) besitzen bereits offizielle Sammelstellen (BAFA, UBA).',
    keyLessonEn: 'Lesson: The "register without registry" pattern only works for young statutory duties lacking designated government collectors (EnEfG § 9, ESPR Art. 24). Mature regimes (LkSG, BattVO) already have official reporting channels.',
    keyLessonEs: 'Lección: El patrón de registro abierto solo funciona con directivas jóvenes sin organismo recolector oficial asignado.',
    dosePackaged: 'umsetzungsplan-register',
    gravesCount: 13,
  },
  {
    id: 'espr-2026-09-28',
    roundNameDe: 'Ökodesign & ESPR Art. 24 (Erste Orchestrierungs-Runde)',
    roundNameEn: 'Ecodesign & ESPR Art. 24 (First Orchestration Round)',
    roundNameEs: 'Ecodiseño y ESPR Art. 24 (Primera ronda orquestada)',
    date: '28.09.2026',
    topicDe: 'Offenlegungspflicht vernichteter unverkaufter Ware (DVO EU 2026/2 & ESPR Art. 24)',
    topicEn: 'Mandatory corporate disclosure of destroyed unsold consumer goods (EU Reg 2026/2 & ESPR Art. 24)',
    topicEs: 'Divulgación obligatoria de bienes no vendidos destruidos (Reglamento UE 2026/2)',
    statsDe: '16 Engine-Kandidaten → Dreifachfund aller 3 Engines → 1 Dose gepackt, 9 Gräber',
    statsEn: '16 engine candidates → triple convergence across all 3 engines → 1 Dose packed, 9 graves',
    keyLessonDe: 'Lehre: Dreifachfunde unabhängiger Entdeckungs-Engines sind das stärkste Signal für echte lakunäre Lücken. Der Kern muss ein deterministischer Anhang-I-Prüfer sein, der niemals „Verstoß" sagt, da die Pflicht bedingt ist.',
    keyLessonEn: 'Lesson: Triple convergence of independent discovery engines is the strongest indicator of authentic lacunar gaps. The core engine must be a deterministic validator that never says "violation", as disclosure is conditional.',
    keyLessonEs: 'Lección: La triple coincidencia de motores independientes es la señal más sólida de una brecha vacía auténtica.',
    dosePackaged: 'vernichtungs-offenlegungsregister',
    gravesCount: 9,
  },
  {
    id: 'holz-2026-09-27',
    roundNameDe: 'Holz- & Fachwerk-Runde',
    roundNameEn: 'Timber & Traditional Joinery Round',
    roundNameEs: 'Madera y carpintería tradicional',
    date: '27.09.2026',
    topicDe: 'Historische Zimmermannszeichen, Holzfeuchte und bauhistorische Bestandserfassung',
    topicEn: 'Historic carpenter assembly marks, firewood moisture, and building archaeology',
    topicEs: 'Marcas históricas de carpintería tradicional y humedad de madera',
    statsDe: '19 geprüfte Ideen → 2 frei, 6 verengt, 3 unklar, 8 besetzt → 1 Dose gepackt',
    statsEn: '19 vetted ideas → 2 open, 6 narrowed, 3 unclear, 8 occupied → 1 Dose packed',
    keyLessonDe: 'Lehre: Im analogen Handwerk (Fachwerk, Abbundzeichen) gibt es echte unbesetzte Zählfolgen-Lücken. Vorsicht vor reinen Suchschnipseln: Web-Zugänge müssen gegen Primärquellen auditiert werden.',
    keyLessonEn: 'Lesson: Traditional analog crafts contain genuine unserved sequential counting gaps. Exercise caution with search snippets: primary publications must be inspected directly.',
    keyLessonEs: 'Lección: En oficios analógicos existen brechas reales de verificación secuencial sin software previo.',
    dosePackaged: 'abbundzeichen-fundbuch',
    gravesCount: 8,
  },
];

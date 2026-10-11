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

export interface GlobalGamingDesire {
  id: string;
  category: 'china' | 'west' | 'cross_cultural';
  titleDe: string;
  titleEn: string;
  titleEs: string;
  originalTerm?: string;
  culturalRootDe: string;
  culturalRootEn: string;
  culturalRootEs: string;
  unmetNeedDe: string;
  unmetNeedEn: string;
  unmetNeedEs: string;
  amelieConnectionDe: string;
  amelieConnectionEn: string;
  amelieConnectionEs: string;
  icon: string;
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

/**
 * 5. Globale & Fernöstliche Spielsehnsüchte (Menschlicher Kompass für Vektor V8 & Gameplay)
 * Erforscht im Oktober 2026 auf Heybox, Zhihu, Bilibili, TapTap und Reddit (r/truegaming).
 */
export const GLOBAL_GAMING_DESIRES: GlobalGamingDesire[] = [
  {
    id: 'china-farming-gene',
    category: 'china',
    titleDe: 'Das genetische Ackerbau-Gen & Anti-Involution',
    titleEn: 'The Farming Gene & Anti-Involution Refuge',
    titleEs: 'El gen agrícola ancestral y refugio anti-estrés',
    originalTerm: '中国人骨子里的种田基因 · 告别内卷',
    culturalRootDe: 'Tiefes psychologisches Bedürfnis nach Selbstversorgung, Vorratshaltung und Verbundenheit mit dem Boden als Zufluchtsort vor städtischem 996-Druck und Konkurrenzüberhitzung (Neijuan).',
    culturalRootEn: 'Deep cultural and psychological drive toward self-sufficiency, food security, and soil connection as an escape from urban 996 hyper-competition (Neijuan).',
    culturalRootEs: 'Profunda necesidad psicológica de autosuficiencia y conexión con la tierra como escape del estrés laboral urbano extremo.',
    unmetNeedDe: 'Keine oberflächlichen Stardew-Klone, sondern tiefgreifende historische Agrarzyklen (die 24 Sonnenknoten / Ershisi Jieqi), phänologische Bewässerung und organische Dorfgemeinschaften.',
    unmetNeedEn: 'Not generic farming clones, but rigorous historical agrarian cycles (the 24 solar terms / Ershisi Jieqi), phenological hydrology, and living village ecosystems.',
    unmetNeedEs: 'No copias superficiales, sino ciclos agrícolas históricos auténticos (los 24 términos solares), hidrología y vida rural orgánica.',
    amelieConnectionDe: 'Erdet Natur- und Ökologiewerkzeuge in echten physischen Zyklen (Boden, Wetter, phänologische Messungen wie DWD-Singularitäten oder Pegel-Wetten).',
    amelieConnectionEn: 'Grounds ecological tools in tangible physical cycles (soil physics, phenological singularities like DWD weather rules, river telemetry).',
    amelieConnectionEs: 'Conecta herramientas ecológicas con ciclos físicos tangibles (física del suelo, reglas meteorológicas reales).',
    icon: '🌾',
  },
  {
    id: 'china-street-life-song',
    category: 'china',
    titleDe: 'Song-Dynastie-Alltag & Markttreiben (Yānhuǒqì)',
    titleEn: 'Living Song Dynasty Street Life (Yānhuǒqì)',
    titleEs: 'Vida cotidiana de la dinastía Song (Yānhuǒqì)',
    originalTerm: '市井生活 & 烟火气 · 清明上河图式模拟',
    culturalRootDe: 'Überdruss an allmächtigen Kriegern und Göttern; Sehnsucht nach „Yānhuǒqì“ (dem Duft von Rauch und Feuer des täglichen Lebens) auf dem belebten Marktplatz (Qingming-Rollenbild).',
    culturalRootEn: 'Fatigue with godlike heroes and immortal emperors; yearning for "Yānhuǒqì" (the warm smoke-and-fire aroma of daily living) as an ordinary citizen on the bustling Qingming scroll.',
    culturalRootEs: 'Cansancio de héroes todopoderosos; anhelo del bullicio cálido de la vida cotidiana en mercados históricos.',
    unmetNeedDe: 'Als kleiner Garkoch, Teeverkäufer oder Bote im Regen den Klängen des Wirtshauses lauschen (客栈听雨), mit autonomen NPCs, die ihr eigenes Leben führen.',
    unmetNeedEn: 'Playing a humble street cook, tea vendor, or mule driver listening to tavern rain (客栈听雨), with living autonomous NPCs that maintain their own schedules.',
    unmetNeedEs: 'Poder ser un modesto cocinero o vendedor de té escuchando la lluvia en la taberna, con aldeanos que tienen vidas propias.',
    amelieConnectionDe: 'Entspricht Amélies Fokus auf Alltagsberufe und kleine Gesten statt heroischem Technosolutionismus.',
    amelieConnectionEn: 'Directly mirrors Amélie’s focus on everyday vocational dignity and micro-utilities rather than heroic techno-solutionism.',
    amelieConnectionEs: 'Refleja la filosofía de Amélie de dignidad laboral cotidiana y pequeñas herramientas útiles.',
    icon: '🏮',
  },
  {
    id: 'china-forensic-court',
    category: 'china',
    titleDe: 'Historische Forensik & Kreisrichter Song Ci',
    titleEn: 'Historical Forensic Deduction & Magistrate Song Ci',
    titleEs: 'Deducción forense histórica y juez Song Ci',
    originalTerm: '宋慈 · 洗冤集录 & 县令断案',
    culturalRootDe: 'Song Cis „Washing Away of Wrongs“ (1247) – das älteste Gerichtsmedizin-Lehrbuch der Menschheit. Reines Kombinieren von Spuren, Zeugen und Reagenzien.',
    culturalRootEn: 'Song Ci’s "Washing Away of Wrongs" (1247) — the world’s earliest forensic medicine treatise. Pure physical clue synthesis without magical hand-holding.',
    culturalRootEs: 'El tratado de medicina forense más antiguo del mundo (1247). Deducción basada en evidencias físicas reales.',
    unmetNeedDe: 'Detektivspiele ohne übernatürliche Magie oder leuchtenden „Detektiv-Modus“; Urteile fällen auf Basis von Tatortinspektion, Silberprüfnadeln und menschlichen Motiven.',
    unmetNeedEn: 'Deductive legal games without glowing objective markers or psychic vision; evaluating evidence using silver needles, vinegar vapors, and human observation.',
    unmetNeedEs: 'Juegos detectivescos sin rayos X mágicos; juzgar casos mediante inspección física de pruebas y testimonios.',
    amelieConnectionDe: 'Perfekte Blaupause für deterministische Prüfwerkzeuge (wie DWD-Bürokratiestempel, Katasterprüfungen oder offene Register).',
    amelieConnectionEn: 'The archetypal blueprint for Amélie’s deterministic audit tools (DWD weather stamps, cadastral verification, open disclosure registers).',
    amelieConnectionEs: 'El modelo perfecto para las herramientas de auditoría determinista de Amélie.',
    icon: '📜',
  },
  {
    id: 'china-intangible-crafts',
    category: 'china',
    titleDe: 'Immaterielles Kulturerbe & Nagellose Holzbaukunst',
    titleEn: 'Intangible Cultural Crafts & Mortise-and-Tenon (Sunmao)',
    titleEs: 'Artesanías intangibles y ensambles de madera Sunmao',
    originalTerm: '非遗 · 榫卯 (Sunmao) · 锔瓷 (Porzellanklammerung)',
    culturalRootDe: 'Bewahrung uralter handwerklicher Tugenden – 3D-Holzverbindungen ohne Nägel (榫卯), geklammertes Porzellan (锔瓷/Kintsugi), Restaurierung antiker Reispapiere.',
    culturalRootEn: 'Preserving ancestral tactile mastercrafts — nail-less 3D interlocking timber joinery (Sunmao), staple-mended ceramics (Juci/Kintsugi), paper scroll restoration.',
    culturalRootEs: 'Preservación de oficios ancestrales: ensambles de madera sin clavos (Sunmao), restauración de porcelana y papel antiguo.',
    unmetNeedDe: 'Traditionelles Handwerk als taktile Physik-Rätsel begreifen, statt es nur distanziert im Museumsvideo anzuschauen.',
    unmetNeedEn: 'Experiencing master crafts as tactile, tactile-satisfying physics puzzles rather than passive museum video exhibits.',
    unmetNeedEs: 'Vivir la artesanía como puzles táctiles de física y montaje, no como simples vídeos de museo.',
    amelieConnectionDe: 'Direkte Parallele zu Amélies Holz-Dose abbundzeichen-fundbuch und den taktilen Zen-Spielen (Crème-Brûlée-Kruste, Steinehüpfen).',
    amelieConnectionEn: 'Direct parallel to Amélie’s timber assembly Dose (abbundzeichen-fundbuch) and tactile Zen games (crème brûlée caramel fractures, stone skipping).',
    amelieConnectionEs: 'Paralelo directo con la lata de carpintería tradicional y los juegos táctiles de Amélie.',
    icon: '🪵',
  },
  {
    id: 'china-anti-gacha-respect',
    category: 'cross_cultural',
    titleDe: 'Kauf-einmal & Respekt vor der Lebenszeit',
    titleEn: 'Buy-Once & Respect for Human Attention',
    titleEs: 'Pago único y respeto al tiempo del jugador',
    originalTerm: '买断制 · 纯单机 · 不逼肝不逼氪',
    culturalRootDe: 'Globaler Gegentrend gegen psychologische Manipulation, Login-Strichlisten, Banner-Pity und künstliche Streckung im Gaming.',
    culturalRootEn: 'Worldwide rebellion against predatory retention loops, battle passes, gacha banner pity counters, and artificial grind mechanics.',
    culturalRootEs: 'Rebelión global contra la manipulación psicológica, pases de batalla y micropagos abusivos.',
    unmetNeedDe: 'Abgeschlossene, ehrliche Softwarewerke, die man in eigenem Tempo genießen und nach dem Durchspielen zufrieden ins Regal stellen kann.',
    unmetNeedEn: 'Complete, self-contained software works that can be experienced at one’s own pace and shelved with satisfaction upon completion.',
    unmetNeedEs: 'Obras de software completas y honestas para disfrutar al propio ritmo sin trampas de retención.',
    amelieConnectionDe: 'Kern-DNA von Amélie: 100 % CC0 Public Domain, keine Accounts, kein Tracking, kein Abofallen-Bitrot.',
    amelieConnectionEn: 'Core DNA of Amélie: 100% CC0 Public Domain, zero accounts, zero telemetry, immune to recurring subscription bitrot.',
    amelieConnectionEs: 'El ADN central de Amélie: 100% dominio público CC0, sin cuentas ni suscripciones.',
    icon: '💎',
  },
  {
    id: 'west-joy-of-repair',
    category: 'west',
    titleDe: 'Die Freude am Instandsetzen (The Joy of Repair)',
    titleEn: 'The Tactile Joy of Repair & Order Restoration',
    titleEs: 'El placer táctil de reparar y restaurar orden',
    originalTerm: 'r/truegaming · r/CozyGamers · Right to Repair',
    culturalRootDe: 'Der psychologische Balsam, Chaos in Ordnung zu verwandeln, zerbrochene Dinge zu reparieren und mechanische Integrität wiederherzustellen.',
    culturalRootEn: 'The psychological solace of turning chaos into order, repairing fractured machinery, and restoring functional integrity with one’s own hands.',
    culturalRootEs: 'El consuelo psicológico de transformar el caos en orden, reparar cosas rotas y restaurar la funcionalidad.',
    unmetNeedDe: 'Spiele und Werkzeuge, die das Gefühl vermitteln, mit eigenen Händen physische Werte zu bewahren (wie Hardspace, Unpacking oder Reparatur-Werkbänke).',
    unmetNeedEn: 'Experiences delivering the deep tactile fulfillment of craftsmanship and salvage (like Hardspace, Unpacking, or workbench diagnostics).',
    unmetNeedEs: 'Juegos y utilidades que transmiten la satisfacción de preservar objetos físicos con las propias manos.',
    amelieConnectionDe: 'Fundament aller Amélie-Dosen zu Kreislaufwirtschaft, ESPR-Vernichtungsstopp, Schadstofferkennung und Abbundzeichen.',
    amelieConnectionEn: 'Foundation of Amélie Doses across circular economy, ESPR waste disclosure, hazardous material detection, and historic timber marks.',
    amelieConnectionEs: 'Fundamento de las latas de Amélie sobre economía circular y derecho a reparar.',
    icon: '🔧',
  },
  {
    id: 'china-classical-gardens-yuanye',
    category: 'china',
    titleDe: 'Klassische Gartenarchitektur & Die Kunst des Leihens',
    titleEn: 'Classical Garden Architecture & Borrowed Scenery (Yuanye 1631)',
    titleEs: 'Arquitectura clásica de jardines y paisajes prestados',
    originalTerm: '计成《园冶》· 巧于因借 · 虽由人作宛自天开',
    culturalRootDe: 'Chinesische Gartenbau-Philosophie (Ji Cheng 1631 AD): „虽由人作，宛自天开“ (Obgleich von Menschenhand geschaffen, wirkt es wie von der Natur selbst gefügt) und „巧于因借“ (Die Meisterschaft liegt im Ausborgen von Landschaft und Licht).',
    culturalRootEn: 'Chinese landscape garden treatise (Ji Cheng 1631 AD): "Though created by human hands, it appears as wrought by nature itself" and "Skill lies in borrowing the scenery (Jiejing)".',
    culturalRootEs: 'Tratado de jardinería clásica china (Ji Cheng 1631): armonía entre arquitectura y naturaleza mediante encuadre visual.',
    unmetNeedDe: 'Überdruss an kachelförmigen SimCity-Gittern; Sehnsucht nach organischer Ästhetik: Mondtore, Gitterfenster (花窗), die ferne Berggipfel und Mondlicht einrahmen, und Taihu-Felsen, die das Plätschern von Regenwasser akustisch leiten.',
    unmetNeedEn: 'Rejection of rigid grid-tile city builders; yearning for organic spatial aesthetics: moon gates, lattice windows framing distant peaks and water reflections, and limestone rockeries acoustic-tuned for rain.',
    unmetNeedEs: 'Rechazo a cuadrículas rígidas; deseo de estética espacial orgánica con ventanas enrejadas y estanques que reflejan la luna.',
    amelieConnectionDe: 'Direkte Brücke zu Amélies taktilen Zen-Simulatoren, Natur-Phänologie und der Verbindung von historischer Baukunst mit offener Geometrie.',
    amelieConnectionEn: 'Direct bridge to Amélie’s tactile Zen simulators, natural phenology, and synthesis of historical architecture with open geometry.',
    amelieConnectionEs: 'Puente directo con los simuladores zen de Amélie y la armonía entre arquitectura e historia.',
    icon: '🪟',
  },
  {
    id: 'china-folklore-suspense-anti-jumpscare',
    category: 'china',
    titleDe: 'Subtile Alltags-Suspense & Spurensuche ohne Jumpscares',
    titleEn: 'Subtle Folklore Suspense & Social Realism without Jumpscares',
    titleEs: 'Misterio folclórico y realismo social sin sustos fáciles',
    originalTerm: '中式悬疑 · 细思极恐 · 拒绝廉价跳脸',
    culturalRootDe: 'Echtes ostasiatisches Grauen entsteht nicht durch laute Schreckmomente („跳脸“ / Jump Scares), sondern durch „细思极恐“ (Schaudern beim genauen Nachdenken): menschliche Tragödien, historische Tabus und familiäre Verstrickungen in alten Akten.',
    culturalRootEn: 'Authentic East Asian suspense arises not from loud jumpscares engineered for streamer reactions, but from "Xì Sī Jí Kǒng" (chilling horror upon careful reflection): human tragedies, historical taboos, and moral consequences embedded in physical artifacts.',
    culturalRootEs: 'El auténtico misterio oriental nace del horror psicológico sutil y tragedias humanas cotidianas, no de sustos baratos de pantalla.',
    unmetNeedDe: 'Kriminal- und Mysteryspiele, die den Verstand der Spieler respektieren: Atmosphäre, historische Akten und reale Logik statt billiger Schockeffekte.',
    unmetNeedEn: 'Mystery and deduction experiences that respect player intellect: atmospheric environment storytelling, yellowed archival files, and logical coherence instead of screeching frights.',
    unmetNeedEs: 'Juegos de misterio que respetan la inteligencia del jugador con atmósfera e investigación en lugar de trucos baratos.',
    amelieConnectionDe: 'Kern von Amélies Song-Ci-Forensik: Unbestechliche Deduktion allein durch physische Befunde, Dokumente und menschliche Würde.',
    amelieConnectionEn: 'Core of Amélie’s Song Ci forensics: unassisted, unbribable deduction strictly via physical evidence, archival sources, and human dignity.',
    amelieConnectionEs: 'El corazón del caso forense Song Ci de Amélie: deducción honesta basada en hechos físicos y documentos históricos.',
    icon: '🕯️',
  },
];


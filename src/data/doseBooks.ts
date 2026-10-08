/**
 * Das Buch zur Dose — die Rohrecherche hinter jeder Idee.
 *
 * Die Dose ist der Einseiter: Behauptung, Skizze, erstes Ticket. Das Buch ist,
 * worauf sie sich stützt — Prüfberichte, Landschaften, Roadmaps, Brainstorms.
 * Für den Empfänger ist das oft der wertvollere Teil: Er sieht nicht nur, dass
 * geprüft wurde, sondern was dagegen spricht.
 *
 * Die Pfade sind repo-relativ. `scripts/check-dose-books.mjs` bricht den Lint,
 * wenn ein Pfad ins Leere zeigt — ohne diesen Wächter verrotten die Kapitel
 * still, sobald jemand eine Datei umbenennt.
 */

/** md = gerendert · patch = als Diff gerendert, mit Download · pdf = nur verlinkt */
export type ChapterKind = 'md' | 'pdf' | 'patch';

export interface BookChapter {
  /** Stabiler Anker für die URL: #dose=<id>&buch=<slug> */
  slug: string;
  /** Repo-relativer Pfad, zugleich Schlüssel für den Quellenlader */
  path: string;
  titleDe: string;
  titleEn: string;
  /** Ein Satz: was dieses Kapitel belegt. Kein Inhaltsverzeichnis-Echo. */
  noteDe: string;
  noteEn: string;
  date: string;
  kind: ChapterKind;
}

export const DOSE_BOOKS: Record<string, BookChapter[]> = {
  'eurobirdcast': [
    {
      slug: 'movement-map', path: '07-demos/eurobirdcast/map/README.md',
      titleDe: 'Animierte Bewegungskarte: Daten und Methode', titleEn: 'Animated movement map: data and method',
      noteDe: '21 Radarstandorte, 168 Stunden; reale Dichte und Bewegungsrichtung mit klaren Datenlücken.',
      noteEn: '21 radar sites, 168 hours; real density and movement bearing with explicit data gaps.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'european-benchmark', path: '07-demos/eurobirdcast/benchmark/README.md',
      titleDe: 'Europäischer Vergleich mit publizierten Daten', titleEn: 'European comparison with published data',
      noteDe: 'Vorhandenes Radar-/ERA5-Benchmark wiederverwenden; chronologischer Test einfacher Modelle.',
      noteEn: 'Reuse an existing radar/ERA5 benchmark; chronological testing of simple models.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'real-test', path: '02-recherche/eurobirdcast-real-test-2026-10-08.md',
      titleDe: 'Realer Amélie-Systemtest', titleEn: 'Real Amélie system test',
      noteDe: 'Unabhängige Prüfungen, korrigierte Datenqualität und Wiederverwendung vorhandener Forschung.',
      noteEn: 'Independent audits, corrected data quality and reuse of existing research.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'contacts', path: '02-recherche/eurobirdcast-contacts-2026-10-08.md',
      titleDe: 'Wer kann helfen? Sechs verifizierte Kontakte', titleEn: 'Who can help? Six verified contacts',
      noteDe: 'Konkrete Fachfragen und zwei unversandte persönliche Entwürfe.',
      noteEn: 'Specific research questions and two unsent personalized drafts.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'bird-weather', path: '02-recherche/eurobirdcast-bird-weather-2026-10-08.md',
      titleDe: 'Bird Weather: aktuelle Daten und historisches Wissen', titleEn: 'Bird Weather: recent data and historical knowledge',
      noteDe: 'Datenfusion, bestehende Prognosen, realer Qualitätsbefund und überprüfbarer Forschungsplan.',
      noteEn: 'Data fusion, existing forecasts, real quality findings and a testable research plan.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'forecast-pilot', path: '07-demos/eurobirdcast/forecast/README.md',
      titleDe: 'Ausführbarer Radar-/Wetter-Pilot', titleEn: 'Runnable radar/weather pilot',
      noteDe: 'Provenienz, feste Filter, chronologischer Vergleich und Datenqualitätsgate ohne erfundene Scores.',
      noteEn: 'Provenance, fixed filters, chronological comparison and quality gating without invented scores.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'historical-map', path: '07-demos/europe-bird-migration/README.md',
      titleDe: 'Interaktive Karte mit echten historischen Daten', titleEn: 'Interactive map with real historical data',
      noteDe: 'Drei deutsche Radarstationen am 01.10.2023; diagnostische Mittelwerte, keine MTR-Validierung.',
      noteEn: 'Three German radars on 1 October 2023; diagnostic averages, no MTR validation.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'revival', path: '02-recherche/eurobirdcast-revival-2026-10-08.md',
      titleDe: 'Wiederaufnahme: Evidenz, Grenzen und Forschungsplan',
      titleEn: 'Revival: evidence, limits and research plan',
      noteDe: 'Primärquellen, BfN-Gegenbefund, niederländischer Regelstand 2026 und offene Validierung.',
      noteEn: 'Primary sources, BfN feedback, Dutch 2026 rules and outstanding validation.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'scaffold', path: '07-demos/eurobirdcast/README.md',
      titleDe: 'CC0-Kern: MTR, Abdeckung und Szenarien',
      titleEn: 'CC0 core: MTR, coverage and scenarios',
      noteDe: 'Lauffähiger TypeScript-Kern mit synthetischen Tests; echte Messfixture noch offen.',
      noteEn: 'Runnable TypeScript core with synthetic tests; real measurement fixture pending.',
      date: '08.10.2026', kind: 'md',
    },
    {
      slug: 'historie', path: '08-friedhof/grabbeigaben/eurobirdcast.md',
      titleDe: 'Historische Fassung und BfN-Kill', titleEn: 'Historical proposal and BfN rejection',
      noteDe: 'Die verworfene Prämisse bleibt nachlesbar.', noteEn: 'The rejected premise stays on record.',
      date: '30.09.2026', kind: 'md',
    },
  ],
  'agent-postmortem-recorder': [
    {
      slug: 'nachpruefung',
      path: '02-recherche/agent-postmortem-recorder-nachpruefung-2026-09-24.md',
      titleDe: 'Nachprüfung: die Präskriptions-Hälfte ist besetzt',
      titleEn: 'Re-check: the prescription half is taken',
      noteDe: 'claude-reflect (~1,6k ★) schreibt Korrekturen schon in CLAUDE.md — offen ist nur, was dessen eigenes Backlog misst.',
      noteEn: 'claude-reflect (~1.6k ★) already writes corrections into CLAUDE.md — what is open is what its own backlog measures.',
      date: '24.09.2026',
      kind: 'md',
    },
    {
      slug: 'fuer-die-maintainer',
      path: '07-demos/agent-postmortem-recorder/README.md',
      titleDe: 'Für die Maintainer (englisch)',
      titleEn: 'For the maintainers',
      noteDe: 'Was der Patch tut, was er bewusst nicht verlangt, und der eine Schritt, um ihn in /reflect einzuhängen.',
      noteEn: 'What the patch does, what it deliberately does not ask for, and the one step to wire it into /reflect.',
      date: '24.09.2026',
      kind: 'md',
    },
    {
      slug: 'patch',
      path: '07-demos/agent-postmortem-recorder/claude-reflect-recurrence.patch',
      titleDe: 'Der Patch für claude-reflect',
      titleEn: 'The patch for claude-reflect',
      noteDe: 'Vier neue Dateien, 567 Zeilen, nur Standardbibliothek; mit git apply auf main 2c892ca, 340 Tests grün.',
      noteEn: 'Four new files, 567 lines, stdlib only; git apply onto main 2c892ca, 340 tests green.',
      date: '24.09.2026',
      kind: 'patch',
    },
  ],
  'altbau-thermal': [
    {
      slug: 'empfaenger',
      path: '02-recherche/altbau-thermal-empfaenger-2026-09-19.md',
      titleDe: 'Empfängerprüfung EnergyMap Berlin',
      titleEn: 'Recipient review: EnergyMap Berlin',
      noteDe: 'Prüft jede Ist-Behauptung der Mail gegen die Primärseiten des Empfängers — drei blieben unbestätigt.',
      noteEn: 'Checks every factual claim in the email against the recipient primary sources — three stayed unconfirmed.',
      date: '19.09.2026',
      kind: 'md',
    },
  ],
  'wet-ink': [
    {
      slug: 'landschaft',
      path: '02-recherche/wet-ink-kommerzielle-landschaft.md',
      titleDe: 'Kommerzielle Landschaft',
      titleEn: 'Commercial landscape',
      noteDe: 'Wer in diesem Feld bereits Geld verdient und woran die bestehenden Werkzeuge scheitern.',
      noteEn: 'Who already earns money in this field and where the existing tools fall short.',
      date: '2026',
      kind: 'md',
    },
  ],
  'fugenduell-asphalt-arena': [
    {
      slug: 'mechanik',
      path: '02-recherche/fugenduell-brainstorm/Mechanics.md',
      titleDe: 'Spielmechanik',
      titleEn: 'Game mechanics',
      noteDe: 'Das Brainstorm, aus dem die Arena entstand — inklusive der elf selbst genannten Vorbilder.',
      noteEn: 'The brainstorm the arena grew out of — including the eleven role models it names itself.',
      date: '2026',
      kind: 'md',
    },
    {
      slug: 'quellen',
      path: '02-recherche/fugenduell-brainstorm/QUELLEN.md',
      titleDe: 'Artenquellen',
      titleEn: 'Species sources',
      noteDe: 'Woher die Artdaten der vierzehn Asphalthelden stammen.',
      noteEn: 'Where the species data for the fourteen asphalt pioneers comes from.',
      date: '2026',
      kind: 'md',
    },
    {
      slug: 'roster',
      path: '02-recherche/fugenduell-brainstorm/crack-flora-starter-roster.md',
      titleDe: 'Starter-Roster',
      titleEn: 'Starter roster',
      noteDe: 'Die Artenliste mit CSR-Werten, aus der die Spielbalance gerechnet wird.',
      noteEn: 'The species list with CSR values the game balance is computed from.',
      date: '2026',
      kind: 'md',
    },
  ],
  'glasanflug-ampel': [
    {
      slug: 'lag-vsw-21-01',
      path: '02-recherche/LAG VSW 21-01_Bewertungsverfahren Vogelschlag Glas.pdf',
      titleDe: 'LAG VSW 21/01 — Bewertungsverfahren (Original-PDF)',
      titleEn: 'LAG VSW 21/01 — assessment scheme (original PDF)',
      noteDe: 'Das Schema selbst. Acht Abrufversuche über fünf Hosts scheiterten; diese Fassung liegt im Repo.',
      noteEn: 'The scheme itself. Eight retrieval attempts across five hosts failed; this copy lives in the repo.',
      date: '2023',
      kind: 'pdf',
    },
  ],
  'couleur-sphinx': [
    {
      slug: 'gatekeeper',
      path: '02-recherche/couleur-sphinx-gatekeeper.md',
      titleDe: 'Couleur-Sphinx: Ursprungskonzept & CapEx/OpEx',
      titleEn: 'Couleur-Sphinx: Initial concept & CapEx/OpEx',
      noteDe: '5V-Relais schlägt ausschließlich die interne Hausklingel, kein Zugriff auf den elektrischen Türöffner.',
      noteEn: '5V relay strikes exclusively the internal doorbell chime, zero physical access to the door strike.',
      date: '24.09.2026',
      kind: 'md',
    },
    {
      slug: 'architektur-preise',
      path: '02-recherche/couleur-sphinx-2.0-architektur-preise.md',
      titleDe: 'Couleur-Sphinx 2.0: Schlafendes Auge & Preistabellen',
      titleEn: 'Couleur-Sphinx 2.0: Sleeping eye & price tables',
      noteDe: 'Mechanisches Shutter-Auge, 1,28″-Avatar-LCD und 3 Hardware-Ausbaustufen (~70–90 €, ~200 €, ~400 €).',
      noteEn: 'Mechanical shutter eyelid, 1.28-inch avatar display, and 3 hardware tiers (~€70–90, ~€200, ~€400).',
      date: '24.09.2026',
      kind: 'md',
    },
  ],
  'kristallwachstum-3d': [
    {
      slug: 'didaktik-physik',
      path: '02-recherche/kristallwachstum-3d-didaktik-physik.md',
      titleDe: 'Didaktische & Physikalische Recherche',
      titleEn: 'Didactic & physical research',
      noteDe: 'Analyse von WebGPU-DLA, Kobayashi-Phasenfeld-Solidification (1993) und der 4-Stufen-Architektur.',
      noteEn: 'Analysis of WebGPU DLA, Kobayashi phase-field solidification (1993), and the 4-stage architecture.',
      date: '25.09.2026',
      kind: 'md',
    },
    {
      slug: 'open-source-scaffolding',
      path: '07-demos/kristallwachstum-3d/README.md',
      titleDe: 'Open-Source-Scaffolding (WebGPU & Phase-Field)',
      titleEn: 'Open-source scaffolding (WebGPU & phase-field)',
      noteDe: 'Kombiniert scttfrdmn WebGPU-DLA, fronkt/solidify Phasenfeld-Shader und markstock/dla-nd Driftkorrektur.',
      noteEn: 'Combines scttfrdmn WebGPU DLA, fronkt/solidify phase-field shaders, and markstock/dla-nd drift bias.',
      date: '25.09.2026',
      kind: 'md',
    },
  ],
  'tarot-zustandsmaschine': [
    {
      slug: 'community-needs',
      path: '02-recherche/tarot-occult-community-needs.md',
      titleDe: 'Foren-Recherche & Community-Bedarfe',
      titleEn: 'Occult forum research & practitioner needs',
      noteDe: 'Auswertung von r/tarot, r/occult und Discord: Kartenkatalog-Reduktionismus, Blockaden durch Reversals, elementare Würden und proprietäre Deck-Fallen.',
      noteEn: 'Survey of r/tarot, r/occult, and Discord: card isolation traps, reversal edge blocks, elemental dignities, and proprietary deck silos.',
      date: '25.09.2026',
      kind: 'md',
    },
    {
      slug: 'recherche-dsl',
      path: '02-recherche/tarot-zustandsmaschine-dsl.md',
      titleDe: 'Architektur & Beziehungs-Graph-Modell',
      titleEn: 'Architecture & relational graph model',
      noteDe: 'Systematischer Abgleich von Tarot-JSON-Katalogen, MCP-Servern, Labyrinthos und Twine/Ink.',
      noteEn: 'Systematic survey of tarot JSON catalogs, MCP servers, Labyrinthos, and Twine/Ink.',
      date: '25.09.2026',
      kind: 'md',
    },
    {
      slug: 'open-source-scaffolding',
      path: '07-demos/tarot-zustandsmaschine/README.md',
      titleDe: 'Open-Source-Scaffolding & JSON-Schema',
      titleEn: 'Open-source scaffolding & JSON schema',
      noteDe: 'Formales JSON-Schema für herstellerunabhängige Spreads mit Slots, Layout und typisierten Relationen.',
      noteEn: 'Formal JSON schema for vendor-independent spreads with slots, layout coordinates, and typed relations.',
      date: '25.09.2026',
      kind: 'md',
    },
    {
      slug: 'open-source-stack',
      path: '07-demos/tarot-zustandsmaschine/open-source-stack.md',
      titleDe: 'Open-Source-Software-Architektur',
      titleEn: 'Open-source software architecture',
      noteDe: 'Baukasten aus tarot-json, XState v5, React Flow, Ajv und Inkjs für vollwertige Graph-Engines.',
      noteEn: 'Component stack from tarot-json, XState v5, React Flow, Ajv, and Inkjs for full graph engines.',
      date: '25.09.2026',
      kind: 'md',
    },
  ],
  'dose-cleaner-chemical-safety': [
    {
      slug: 'chemie-rechtsnormen',
      path: '02-recherche/chemhazard-stop-recherche-chemie-rechtsnormen.md',
      titleDe: 'Chemische Reaktionsmechanismen, CLP-Verordnung & GISCODE-Systematik',
      titleEn: 'Chemical reaction mechanisms, CLP regulation & GISCODE taxonomy',
      noteDe: 'Thermodynamik der Chlorgas-Reaktion, sekundäre Gefahrenpaare (Ammoniak, Peroxid) und deterministischer Hebel des EUH031-CLP-Gefahrensatzes.',
      noteEn: 'Thermodynamics of chlorine gas liberation, secondary hazard pairs, and deterministic EUH031 CLP classification trigger.',
      date: '27.09.2026',
      kind: 'md',
    },
    {
      slug: 'empfaenger-arbeitsrealitaet',
      path: '02-recherche/chemhazard-stop-empfaenger-arbeitsrealitaet.md',
      titleDe: 'Empfängeranalyse, Arbeitsrealität & Sprachbarrieren im Gebäudereiniger-Handwerk',
      titleEn: 'Recipient analysis, cleaning frontline reality & language barriers',
      noteDe: '700.000 Beschäftigte im Reinigungssektor, Nachtarbeit und Scheitern 15-seitiger SDBs; Mandat von IG BAU, BG BAU, DGUV, EFCI und SEIU.',
      noteEn: '700,000 cleaning workers, shift pressure, and why 15-page SDS fail mid-shift; institutional mandate of IG BAU, BG BAU, DGUV, EFCI, and SEIU.',
      date: '27.09.2026',
      kind: 'md',
    },
    {
      slug: 'safety-case-architektur',
      path: '02-recherche/chemhazard-stop-safety-case-architektur.md',
      titleDe: 'Der Sicherheitsnachweis: Formale Spezifikation des Dreizustands-Modells & Ausfallmodi',
      titleEn: 'The safety case: formal three-state model specification & failure modes',
      noteDe: 'Beweis für das absolute Verbot des grünen Zustands (Never says safe) und architektonische Gegenmaßnahmen für 11 reale Ausfallmodi.',
      noteEn: 'Formal proof of the green state ban (Never says safe) and architectural remedies against 11 real-world operational failure modes.',
      date: '27.09.2026',
      kind: 'md',
    },
    {
      slug: 'roadmap-meilensteine',
      path: '07-demos/chemhazard-stop/roadmap-meilensteine.md',
      titleDe: 'Roadmap, Meilensteine & Ausbildungsplan',
      titleEn: 'Roadmap, milestones & training curriculum',
      noteDe: 'Meilensteine M0 (Kernel) bis M2 (Gewerkschaftsauslieferung) und 4-Wochen-Trainingsplan für Reinigungsteams und Betriebsräte.',
      noteEn: 'Milestones M0 (Kernel) through M2 (Union delivery) and 4-week training curriculum for frontline teams and safety stewards.',
      date: '27.09.2026',
      kind: 'md',
    },
  ],
  'abbundzeichen-fundbuch': [
    {
      slug: 'scaffolding',
      path: '07-demos/abbundzeichen-fundbuch/README.md',
      titleDe: 'Scaffolding & Zählfolgen-Prüfer',
      titleEn: 'Scaffolding & sequence checker',
      noteDe: 'Parser für römische Abbundzeichen mit Serienzeichen, fünf Regeln nur als Hinweis oder Verdacht, JSON-Export mit Ort auf Gemeindeebene; 44 Tests mit synthetischen Fixtures.',
      noteEn: 'Parser for Roman assembly marks with series tags, five rules graded only as hint or suspicion, JSON export with municipality-level location; 44 tests on synthetic fixtures.',
      date: '27.09.2026',
      kind: 'md',
    },
    {
      slug: 'ticket-01',
      path: '07-demos/abbundzeichen-fundbuch/ticket-01-pruefe-zaehlfolge.md',
      titleDe: 'Ticket 01: Eine Wand, eine Zählfolge, ein Verdacht',
      titleEn: 'Ticket 01: One wall, one sequence, one suspicion',
      noteDe: 'Kern und Tests fertig; offen sind das Fixture aus einem publizierten Zeichenregister und die statische Offline-Seite.',
      noteEn: 'Kernel and tests done; still open: a fixture from a published mark register and the static offline page.',
      date: '27.09.2026',
      kind: 'md',
    },
  ],
  'vernichtungs-offenlegungsregister': [
    {
      slug: 'scaffolding',
      path: '07-demos/vernichtungs-offenlegungsregister/README.md',
      titleDe: 'Scaffolding & Offenlegungs-Prüfer',
      titleEn: 'Scaffolding & disclosure checker',
      noteDe: 'Deterministischer Prüfer gegen ein vorläufiges Anhang-I-Schema, sechs Regeln nur als Fragen, Register mit genau zwei neutralen Status; 28 Tests mit synthetischen Fixtures.',
      noteEn: 'Deterministic checker against a provisional Annex I schema, six rules phrased only as questions, register with exactly two neutral statuses; 28 tests on synthetic fixtures.',
      date: '28.09.2026',
      kind: 'md',
    },
    {
      slug: 'ticket-01',
      path: '07-demos/vernichtungs-offenlegungsregister/ticket-01-anhang1-pruefer.md',
      titleDe: 'Ticket 01: Anhang I als Schema, ein Prüfer, eine echte Offenlegung',
      titleEn: 'Ticket 01: Annex I as a schema, one checker, one real disclosure',
      noteDe: 'Historischer Vertrag; fachlich durch Ticket 02 korrigiert. Die ursprünglichen Akzeptanzkriterien bleiben erhalten.',
      noteEn: 'Historical contract, technically corrected by Ticket 02. Original acceptance criteria remain available.',
      date: '28.09.2026',
      kind: 'md',
    },
    {
      slug: 'normtext-abgleich',
      path: '07-demos/vernichtungs-offenlegungsregister/normtext-abgleich-2026-10-08.md',
      titleDe: 'Normtext-Abgleich 08.10.2026',
      titleEn: 'Legal-text check, 8 October 2026',
      noteDe: 'Primärtexte, korrigierte Annahmen, Zeitgrenze und Grenzen der Aussage.',
      noteEn: 'Primary texts, corrected assumptions, timing and limits.',
      date: '08.10.2026',
      kind: 'md',
    },
    {
      slug: 'realfixture',
      path: '07-demos/vernichtungs-offenlegungsregister/data/README.md',
      titleDe: 'Signify GJ 2025: Daten und Herkunft',
      titleEn: 'Signify FY 2025: data and provenance',
      noteDe: 'Sechs reale Zeilen, Seitenbelege und SHA-256; Originalwerte bleiben erhalten.',
      noteEn: 'Six real rows, page references and SHA-256; source values preserved.',
      date: '08.10.2026',
      kind: 'md',
    },
    {
      slug: 'ticket-02',
      path: '07-demos/vernichtungs-offenlegungsregister/ticket-02-normtext-und-realfixture.md',
      titleDe: 'Ticket 02: Normtext und reale Fixture',
      titleEn: 'Ticket 02: legal text and real fixture',
      noteDe: 'Quellengebundene Korrektur des vorläufigen Modells.',
      noteEn: 'Source-grounded correction of the provisional model.',
      date: '08.10.2026',
      kind: 'md',
    },
    {
      slug: 'ticket-03',
      path: '07-demos/vernichtungs-offenlegungsregister/ticket-03-kuratierter-pilot.md',
      titleDe: 'Ticket 03: Kuratierter Pilot',
      titleEn: 'Ticket 03: curated pilot',
      noteDe: 'Offen: zweite unabhängige Offenlegung und datierte Auswahl.',
      noteEn: 'Open: second independent disclosure and dated selection.',
      date: '08.10.2026',
      kind: 'md',
    },
  ],
  'umsetzungsplan-register': [
    {
      slug: 'scaffolding',
      path: '07-demos/umsetzungsplan-register/README.md',
      titleDe: 'Scaffolding & Umsetzungsplan-Prüfer',
      titleEn: 'Scaffolding & implementation plan checker',
      noteDe: 'Prüfer gegen das BAFA-Merkblatt 16.09.2026 (fünf Angaben, nicht sieben), acht Regeln nur als Fragen, Aggregat mit Selektionshinweis ohne Quote, Register über den Kern der Schwester-Dose; drei echte Pläne übertragen, 89 Tests.',
      noteEn: 'Checker against the BAFA guidance of 16.09.2026 (five items, not seven), eight rules phrased only as questions, aggregate with selection note and no quota, register via the sister tin’s core; three real plans transcribed, 89 tests.',
      date: '28.09.2026',
      kind: 'md',
    },
    {
      slug: 'ticket-01',
      path: '07-demos/umsetzungsplan-register/ticket-01-pflichtangaben-pruefer.md',
      titleDe: 'Ticket 01: Pflichtangaben als Schema, ein Prüfer, drei echte Pläne',
      titleEn: 'Ticket 01: Required items as a schema, one checker, three real plans',
      noteDe: 'Schema, Prüfer, Register und Auswertung fertig; offen sind Archiv-Snapshots, die Lesung der Merkblattfassung 12.02.2025 und ein sichtbarer Kuratorentscheid zu Statuswörtern wie „geplant".',
      noteEn: 'Schema, checker, register and aggregate done; still open: archive snapshots, reading the 12.02.2025 guidance version and a visible curator decision on status words such as "geplant".',
      date: '28.09.2026',
      kind: 'md',
    },
  ],
  'strassennamen-pruefer': [
    {
      slug: 'scaffolding',
      path: '07-demos/strassennamen-pruefer/README.md',
      titleDe: 'Scaffolding & Straßennamen-Prüfer',
      titleEn: 'Scaffolding & street name checker',
      noteDe: 'Vier Regeln (identisch, Grundwort, Klang, Distanz) nur als Hinweise mit Fundstelle, nie „unzulässig"; Personennamen-Ausnahme sichtbar statt versteckt; 31 Tests mit synthetischen Fixtures.',
      noteEn: 'Four rules (identical, generic word, sound, distance) only as notes with a reference, never "inadmissible"; person-name exception shown, not hidden; 31 tests on synthetic fixtures.',
      date: '29.09.2026',
      kind: 'md',
    },
    {
      slug: 'ticket-01',
      path: '07-demos/strassennamen-pruefer/ticket-01-strassenname-pruefer.md',
      titleDe: 'Ticket 01: Ein Vorschlag, ein Verzeichnis, ein Prüfhinweis',
      titleEn: 'Ticket 01: One proposal, one directory, one note',
      noteDe: 'Kern und Tests fertig; offen sind die echten Richtlinienpaare, ein GovData/OSM-Auszug mit Falschalarm-Messung und die Offline-Seite.',
      noteEn: 'Core and tests done; still open: the real guideline pairs, a GovData/OSM extract with false-alarm measurement and the offline page.',
      date: '29.09.2026',
      kind: 'md',
    },
  ],
};

export function getBook(doseId: string): BookChapter[] {
  return DOSE_BOOKS[doseId] ?? [];
}

export function findChapter(doseId: string, slug: string): BookChapter | undefined {
  return getBook(doseId).find((c) => c.slug === slug);
}

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
  eurobirdcast: [
    {
      slug: 'empfaenger',
      path: '02-recherche/eurobirdcast-empfaenger-2026-09-22.md',
      titleDe: 'Prüfung 1: Empfänger und Gegenrichtung',
      titleEn: 'Review 1: recipients and the opposite direction',
      noteDe: 'Fand, dass ENRAM seit 2017 nicht mehr existiert und der BP/MWh-Index Szenario 3 der zitierten Studie ist.',
      noteEn: 'Found that ENRAM has not existed since 2017 and that the BP/MWh index is scenario 3 of the cited study.',
      date: '22.09.2026',
      kind: 'md',
    },
    {
      slug: 'besetzung',
      path: '02-recherche/eurobirdcast-besetzung-2026-09-22.md',
      titleDe: 'Prüfung 2: internationale Besetzung',
      titleEn: 'Review 2: international occupancy',
      noteDe: 'NL schaltet seit Mai 2023 verpflichtend ab, Robin Radar vollautomatisch — und der Gotthard-Nullbefund steht hier.',
      noteEn: 'The Netherlands have curtailed by law since May 2023, Robin Radar fully automatically — and the Gotthard null result is in here.',
      date: '22.09.2026',
      kind: 'md',
    },
    {
      slug: 'technik',
      path: '02-recherche/eurobirdcast-technik-2026-09-22.md',
      titleDe: 'Prüfung 3: Technik- und Förderclaims',
      titleEn: 'Review 3: technical and funding claims',
      noteDe: 'DWD-Vorhaltezeit gemessen (≈48 h), MistNet auf C-Band, abgelaufene EIC-Frist, falsche Rechtsnorm.',
      noteEn: 'Measured DWD retention (~48 h), MistNet on C-band, an expired EIC deadline, the wrong legal provision.',
      date: '22.09.2026',
      kind: 'md',
    },
    {
      slug: 'roadmap',
      path: '02-recherche/eurobirdcast-roadmap-2026-09-22.md',
      titleDe: 'Roadmap nach der Prüfung',
      titleEn: 'Roadmap after the review',
      noteDe: 'Was von der Idee übrig ist, in Meilensteinen — mit M0 als Kippschalter statt als Vorgeplänkel.',
      noteEn: 'What is left of the idea, as milestones — with M0 as a kill switch rather than a warm-up.',
      date: '22.09.2026',
      kind: 'md',
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
      noteDe: 'Prüfer, Register und Tests fertig; offen sind der Abgleich mit dem Normtext und die von Hand übertragene Signify-Offenlegung GJ 2025.',
      noteEn: 'Checker, register and tests done; still open: checking against the legal text and the hand-transcribed Signify FY 2025 disclosure.',
      date: '28.09.2026',
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
};

export function getBook(doseId: string): BookChapter[] {
  return DOSE_BOOKS[doseId] ?? [];
}

export function findChapter(doseId: string, slug: string): BookChapter | undefined {
  return getBook(doseId).find((c) => c.slug === slug);
}

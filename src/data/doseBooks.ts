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
};

export function getBook(doseId: string): BookChapter[] {
  return DOSE_BOOKS[doseId] ?? [];
}

export function findChapter(doseId: string, slug: string): BookChapter | undefined {
  return getBook(doseId).find((c) => c.slug === slug);
}

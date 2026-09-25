export type Language = 'en' | 'de' | 'es';

export type Verdict = 'gift' | 'build_first' | 'keep' | 'discarded';

export type DoseStatus = 'gefunden' | 'gepackt' | 'zugestellt' | 'antwort' | 'gebaut' | 'entsorgt';

/**
 * Ticket-facing status vocabulary for a Dose's YAML frontmatter (05-dosen/*.md).
 *
 * This is deliberately NOT a second, independent status system: it is a thin,
 * English-language translation of `DoseStatus`, which stays the app's real
 * source of truth. `scripts/sync-idea-frontmatter.mjs` writes it into the
 * frontmatter block of every 05-dosen/*.md file, derived 1:1 from the
 * matching `DoseItem.status` in `src/data/dosen.ts` via
 * `DOSE_STATUS_TO_IDEA_STATUS` (see `src/utils/ideaFrontmatter.ts`). Nothing
 * reads this enum backwards into DoseStatus — it only flows outward, into the
 * frontmatter and from there into `mapIdeaFrontmatterToDeliveryState`.
 */
export enum IdeaStatus {
  Available = 'Available',
  Delivered = 'Delivered',
  InProgress = 'In Progress',
  Launched = 'Launched',
}

/** Strictly-typed shape of a Dose's YAML frontmatter block. */
export interface IdeaFrontmatter {
  status: IdeaStatus;
  /** ISO 8601 timestamp — present once status is no longer Available. */
  date_delivered?: string;
  delivery_method?: string;
  target_maker?: string;
  review_score?: string;
  architecture_tier?: string;
  source_type?: string;
}

/**
 * Derived delivery-state record for an outreach email (see
 * `src/data/deliveries.ts`). Previously persisted by hand in
 * `localStorage` (`amelie_sent_emails`) — now computed from
 * `IdeaFrontmatter` by `mapIdeaFrontmatterToDeliveryState` /
 * `loadSentEmailsMap` in `src/services/ideaDeliveryService.ts`.
 */
export interface SentEmailRecord {
  sent: boolean;
  sentAt: string;
  notes?: string;
}

export type DomainCategory = 'civic' | 'tools' | 'physics' | 'audio' | 'creative' | 'knowledge';

export interface DoseItem {
  id: string;
  title: string;
  titleKey?: string;
  titleEn?: string;
  titleEs?: string;
  /** Dateiname in public/, z. B. 'eurobird.png'. Varianten daneben: scripts/prepare-dose-image.mjs */
  image?: string;
  /** Was auf dem Bild zu sehen ist — für Screenreader und wenn das Bild nicht lädt */
  imageAlt?: string;
  /** Breite geteilt durch Höhe. Reserviert den Platz, damit beim Nachladen nichts springt. */
  imageAspect?: number;
  oneLinerDe: string;
  oneLinerEn: string;
  oneLinerEs?: string;
  date: string;
  reviewAfter: string;
  recipientsDe: string;
  recipientsEn: string;
  recipientsEs?: string;
  domain: DomainCategory;
  verdict: Verdict;
  status: DoseStatus;
  problemDe: string;
  problemEn: string;
  problemEs?: string;
  whyNowDe: string[];
  whyNowEn: string[];
  whyNowEs?: string[];
  sketchDe: string;
  sketchEn: string;
  sketchEs?: string;
  firstStepDe: {
    ticket: string;
    criteria: string;
  };
  firstStepEn: {
    ticket: string;
    criteria: string;
  };
  firstStepEs?: {
    ticket: string;
    criteria: string;
  };
  failureModeDe: string;
  failureModeEn: string;
  failureModeEs?: string;
  priorArtDe: string;
  priorArtEn: string;
  priorArtEs?: string;
  tags: string[];
  emailTemplate?: {
    subjectDe: string;
    bodyDe: string;
    subjectEn: string;
    bodyEn: string;
    to: string;
  };
  emailTemplates?: {
    recipientName: string;
    to: string;
    subjectDe: string;
    bodyDe: string;
    subjectEn: string;
    bodyEn: string;
  }[];
  // Advanced Model & AI-Native Schema
  aiFrontier?: {
    impossibleBeforeAiDe: string;
    impossibleBeforeAiEn: string;
    aiTechStack: string[];
    privacyModelDe: string;
    privacyModelEn: string;
    ordinaryPeopleBenefitDe: string;
    ordinaryPeopleBenefitEn: string;
    learningCurriculumDe: {
      step: number;
      title: string;
      focus: string;
      milestone: string;
    }[];
    learningCurriculumEn: {
      step: number;
      title: string;
      focus: string;
      milestone: string;
    }[];
  };
}

/**
 * Friedhof (08-friedhof/): Jede tote Idee bekommt einen Totenschein. Die
 * Felder unten sind Pflicht, weil sie das Einzige sind, woran sich später
 * Muster ablesen lassen — ein Grab ohne Ursache ist ein Archiveintrag.
 * Taxonomie und Regeln: 08-friedhof/README.md.
 */
export type Todesursache =
  /** gibt es schon als Produkt, Projekt oder Community-Werkzeug */
  | 'gebaut'
  /** der gedachte Empfänger macht es selbst */
  | 'beim-empfaenger'
  /** stand schon im eigenen Bestand (Dose, Protokoll, Atlas) */
  | 'duplikat'
  /** keine neue Fähigkeit — Standardmuster, Mode-Liste */
  | 'mode'
  /** scheitert an Daten, Recht oder Physik, bevor die Existenzfrage zählt */
  | 'reality-check'
  /** das Problem gibt es so nicht */
  | 'praemisse';

/** Wer die Idee schon hat. */
export type Killerart =
  | 'kommerziell'
  | 'gemeinnuetzig'
  | 'behoerde'
  | 'forschung'
  | 'community'
  | 'eigener-bestand'
  | 'keiner';

/** Welche Suche die Idee getötet hat — das Muster, das die Suchreihenfolge verbessert. */
export type Fundweg =
  | 'englisch'
  | 'deutsch'
  | 'forum'
  | 'empfaenger'
  | 'eigener-bestand'
  | 'ohne-suche'
  | 'unbekannt';

/** Woher die Idee kam. */
export type Herkunft = 'ideenliste' | 'brainstorm' | 'quelle' | 'bisoziation' | 'modell-katalog';

/** Wie weit sie kam, bevor sie starb. Je weiter, desto teurer der Tod. */
export type Stadium = 'kandidat' | 'dose' | 'mail-entwurf' | 'zugestellt';

export interface DiscardedItem {
  id: string;
  title: string;
  titleKey?: string;
  originalIdeaDe: string;
  originalIdeaEn: string;
  whyDiscardedDe: string;
  whyDiscardedEn: string;
  lessonDe: string;
  lessonEn: string;
  domain: string;
  evidence: string[];
  cause: Todesursache;
  killer: Killerart;
  foundBy: Fundweg;
  origin: Herkunft;
  stage: Stadium;
  /** Geboren: Runde und Methode, z. B. „Runde 2 · Ideenrunde" */
  bornIn: string;
  /** Gestorben: ISO-Datum oder ISO-Monat (2026-09) */
  diedOn: string;
  /** Unter welcher Bedingung das Grab geöffnet werden darf. „nie" ist eine erlaubte Antwort. */
  resurrectIfDe: string;
  resurrectIfEn: string;
  /** Langer Nachruf oder Grabbeigabe (Originaltext der Dose), Pfad im Repo */
  nachruf?: string;
}

export interface MatrixRow {
  id: string;
  categoryDe: string;
  categoryEn: string;
  name: string;
  nameEn?: string;
  titleKey?: string;
  titleEn?: string;
  effort: 'S' | 'M' | 'L';
  verdict: Verdict;
  beneficiaryDe: string;
  beneficiaryEn: string;
  recipientsDe: string;
  recipientsEn: string;
  channelDe: string;
  channelEn: string;
  hookDe: string;
  hookEn: string;
  status: DoseStatus;
  doseId?: string;
}

export type DeliveryEmail = {
  id: string;
  mailIndex: number;
  titleDe: string;
  titleEn: string;
  recipientOrg: string;
  recipientTypeDe: string;
  recipientTypeEn: string;
  contactPathDe: string;
  contactPathEn: string;
  subjectDe: string;
  subjectEn: string;
  bodyDe: string;
  bodyEn: string;
  doseLinks: string[];
  scheduleDe: string;
  scheduleEn: string;
  sent?: boolean;
  sentAt?: string;
};

/**
 * `ungeprüft`: steht im Katalog, hat aber noch keine Zeile im Prüfprotokoll
 * (06-suche/amelie-pruefprotokoll.md). Kein Urteil, darf nicht gepackt werden.
 * Die anderen vier Werte sind Urteile und brauchen eine Protokollzeile —
 * scripts/check-protokoll-coverage.mjs prüft das.
 */
export type CandidateStatus = 'ungeprüft' | 'frei' | 'verengt' | 'unklar' | 'besetzt';

export interface CandidateIdea {
  id: string;
  title: string;
  titleKey?: string;
  titleEn?: string;
  round: string;
  date: string;
  conceptDe: string;
  conceptEn: string;
  status: CandidateStatus;
  suggestedVerdict: Verdict;
  recipientDe: string;
  recipientEn: string;
  sourceType:
    | 'Typ A'
    | 'Typ B'
    | 'Typ C'
    | 'Typ D'
    | 'Besetzungsatlas'
    | 'Community'
    | 'Google Drive'
    | 'Google Docs'
    | 'Gmail'
    | 'Local-First'
    | 'Home & Finance'
    | 'Community & Rural'
    | 'Micro-Utilities'
    | 'Craft & Workshop'
    | 'Civic & Ecology'
    | 'Health & Care'
    | 'Trade & Guild'
    | string;
  sourceDe: string;
  sourceEn: string;
  evidenceDe: string;
  evidenceEn: string;
  reviewDate: string;
  problemDe?: string;
  problemEn?: string;
  whyNowDe?: string[];
  whyNowEn?: string[];
  firstStepTicketDe?: string;
  firstStepTicketEn?: string;
  firstStepCriteriaDe?: string;
  firstStepCriteriaEn?: string;
  tags?: string[];
  userNotes?: string;
  workerPersona?: {
    name: string;
    role: string;
    location: string;
    avatar?: string;
    storyDe: string;
    storyEn: string;
    quoteDe: string;
    quoteEn: string;
  };
  realRecipientsList?: Array<{
    org: string;
    person?: string;
    email: string;
    location?: string;
    roleDe: string;
    roleEn: string;
    url?: string;
  }>;
  techShift?: {
    beforeAiDe: string;
    beforeAiEn: string;
    nowEasyDe: string;
    nowEasyEn: string;
  };
  readyEmail?: {
    subjectDe: string;
    subjectEn: string;
    bodyDe: string;
    bodyEn: string;
  };
}

export type StorageProvider = 'github_pages' | 'firebase';

export interface IdeasDatabaseExport {
  $schema?: string;
  version: string;
  generatedAt: string;
  license: string;
  storageProvider: string;
  repository?: string;
  stats: {
    totalDosen: number;
    totalUnpacked: number;
    totalDiscarded: number;
  };
  dosen: DoseItem[];
  unpackedCandidates: CandidateIdea[];
  discarded?: any[];
}

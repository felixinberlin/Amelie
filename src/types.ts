export type Language = 'en' | 'de' | 'es';

export type Verdict = 'gift' | 'build_first' | 'keep' | 'discarded';

export type DoseStatus = 'gefunden' | 'gepackt' | 'zugestellt' | 'antwort' | 'gebaut' | 'entsorgt';

export type DomainCategory = 'civic' | 'tools' | 'physics' | 'audio' | 'creative' | 'knowledge';

export interface DoseItem {
  id: string;
  title: string;
  titleKey?: string;
  titleEn?: string;
  oneLinerDe: string;
  oneLinerEn: string;
  date: string;
  reviewAfter: string;
  recipientsDe: string;
  recipientsEn: string;
  domain: DomainCategory;
  verdict: Verdict;
  status: DoseStatus;
  problemDe: string;
  problemEn: string;
  whyNowDe: string[];
  whyNowEn: string[];
  sketchDe: string;
  sketchEn: string;
  firstStepDe: {
    ticket: string;
    criteria: string;
  };
  firstStepEn: {
    ticket: string;
    criteria: string;
  };
  failureModeDe: string;
  failureModeEn: string;
  priorArtDe: string;
  priorArtEn: string;
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
}

export interface MatrixRow {
  id: string;
  categoryDe: string;
  categoryEn: string;
  name: string;
  titleKey?: string;
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
};

export type CandidateStatus = 'frei' | 'verengt' | 'unklar' | 'besetzt';

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

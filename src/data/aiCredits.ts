/**
 * KI-Credits & Runway: wie ein Einzelentwickler ohne Investor die Rechenkosten
 * von Amélie und amelie-lab deckt. Stand 01.10.2026.
 *
 * Evidenz: `read` = Primärseite gelesen, `snippet` = nur Suchschnipsel oder
 * Aggregator (vor jeder Bewerbung auf der Primärseite prüfen).
 * Dossier mit Begründung: `06-suche/amelie-ki-credits-und-runway.md`.
 */

export type CreditFit = 'try' | 'maybe' | 'blocked';
export type CreditKind = 'credits' | 'subscription' | 'free-tier' | 'cash' | 'tooling';
export type CreditEvidence = 'read' | 'snippet';

export interface CreditProgram {
  id: string;
  kind: CreditKind;
  nameDe: string;
  nameEn: string;
  provider: string;
  valueDe: string;
  valueEn: string;
  /** Wer sich bewerben darf. */
  whoDe: string;
  whoEn: string;
  fit: CreditFit;
  /** Was für Félix gilt und was als Nächstes zu tun ist. */
  nextDe: string;
  nextEn: string;
  evidence: CreditEvidence;
  url: string;
  checked: string;
}

export interface CreditPath {
  id: string;
  titleDe: string;
  titleEn: string;
  /** Wie schnell Geld oder Credits fließen. */
  speedDe: string;
  speedEn: string;
  bodyDe: string;
  bodyEn: string;
}

export interface CreditBlocker {
  id: string;
  titleDe: string;
  titleEn: string;
  bodyDe: string;
  bodyEn: string;
}

export interface CreditDate {
  date: string;
  labelDe: string;
  labelEn: string;
}

export interface CreditQuestion {
  de: string;
  en: string;
}

const C = '2026-10-01';

export const AI_CREDIT_SUMMARY = {
  de: 'Rechne nicht damit, dass Credits geschenkt werden: Die großen Programme (Anthropic Startups, Google Scale) verlangen Investoren oder eine Firma, die Open-Source-Programme eine große Nutzerbasis, die Nonprofit-Programme eine gemeinnützige Rechtsform. Verlässlich bleiben drei Hebel: (1) kostenlose Einstiege sofort nutzen, (2) Förderung beantragen, die Geld statt Credits gibt (Prototype Fund, Frist 30.11.2026), (3) ein Einkommen aus Dienstleistung, das den Runway trägt.',
  en: 'Do not expect credits to be given away: the big programmes (Anthropic Startups, Google Scale) want investors or a company, the open-source programmes want a large user base, the nonprofit programmes want a charitable legal form. Three levers are reliable: (1) use the free entry points now, (2) apply for funding that gives money rather than credits (Prototype Fund, deadline 30 Nov 2026), (3) service income that carries the runway.',
};

export const AI_CREDIT_PATHS: CreditPath[] = [
  {
    id: 'free-now',
    titleDe: 'A · Heute kostenlos starten',
    titleEn: 'A · Start free today',
    speedDe: 'Sofort, 0 €',
    speedEn: 'Immediate, €0',
    bodyDe: 'Gemini-API-Gratisstufe, Microsoft Founders Hub (Idea-Stufe), Mistral-Gratisplan, GitHub Copilot und JetBrains für Open-Source-Arbeit. Das deckt kleine Läufe und Experimente, keine vollen Teamrunden mit mehreren Engines.',
    bodyEn: 'Gemini API free tier, Microsoft Founders Hub (idea tier), Mistral free plan, GitHub Copilot and JetBrains for open-source work. Covers small runs and experiments, not full team rounds with several engines.',
  },
  {
    id: 'oss-credits',
    titleDe: 'B · Open-Source-Credits der Anbieter',
    titleEn: 'B · Vendor open-source credits',
    speedDe: 'Wochen, unsicher',
    speedEn: 'Weeks, uncertain',
    bodyDe: 'Anthropic „Claude for Open Source“ (nur Max-Abo, keine API) und OpenAIs Codex Open Source Fund (bis 25.000 $ API-Credits). Beide setzen ein öffentliches Repo mit OSI-Lizenz und nachweisbare Reichweite voraus. Passt nur für einen Code-Kern, nicht für die CC0-Dossiers.',
    bodyEn: 'Anthropic "Claude for Open Source" (Max plan only, no API) and OpenAI’s Codex Open Source Fund (up to $25,000 API credits). Both need a public repo with an OSI licence and demonstrable reach. Fits a code core only, not the CC0 dossiers.',
  },
  {
    id: 'cash',
    titleDe: 'C · Förderung, die Geld statt Credits gibt',
    titleEn: 'C · Funding that gives money, not credits',
    speedDe: 'Antrag jetzt, Auszahlung ab Juni 2027',
    speedEn: 'Apply now, payout from June 2027',
    bodyDe: 'Prototype Fund Klasse 03 (bis 47.500 € für Einzelpersonen, Bewerbung 01.10. bis 30.11.2026, Förderung Juni bis November 2027) und NLnet (5.000 bis 50.000 €, nächste Frist 03.11.2026). Beide verlangen offene Lizenzen; NLnet lehnt KI-generierte Vorhaben ab und verlangt Offenlegung. Mit dem Geld lassen sich Credits kaufen.',
    bodyEn: 'Prototype Fund class 03 (up to €47,500 for individuals, applications 1 Oct to 30 Nov 2026, funding June to November 2027) and NLnet (€5,000 to €50,000, next deadline 3 Nov 2026). Both require open licences; NLnet rejects AI-generated projects and requires disclosure. The money can buy credits.',
  },
  {
    id: 'legal-form',
    titleDe: 'D · Gemeinnützige Rechtsform (Hebel für Nonprofit-Programme)',
    titleEn: 'D · Charitable legal form (unlocks nonprofit programmes)',
    speedDe: 'Monate',
    speedEn: 'Months',
    bodyDe: 'Claude for Nonprofits ($500 Credits, 40 % Rabatt auf Team) und Google for Nonprofits (in Deutschland nur als eingetragene gemeinnützige Organisation, Prüfung über Goodstack) setzen eine anerkannte Gemeinnützigkeit voraus. Welche Form passt (e. V. braucht mehrere Gründungsmitglieder, gUG/gGmbH geht allein), ist offen und ein Fall für Steuerberatung.',
    bodyEn: 'Claude for Nonprofits ($500 credits, 40 % off Team) and Google for Nonprofits (in Germany only for registered charitable organisations, verified via Goodstack) require recognised charitable status. Which form fits (an e. V. needs several founding members, a gUG/gGmbH can be set up alone) is open and a matter for a tax adviser.',
  },
  {
    id: 'income',
    titleDe: 'E · Einkommen aus deinem Handwerk',
    titleEn: 'E · Income from your craft',
    speedDe: 'Wochen, der verlässlichste Hebel',
    speedEn: 'Weeks, the most reliable lever',
    bodyDe: 'Jahre Erfahrung in einem Stack (TYPO3, WordPress, Laravel, Rails, Kubernetes, Datenbanken, Barrierefreiheit, was auch immer) sind der verlässlichste Runway: Wartung und Upgrades, Unteraufträge für Agenturen, Migrationen, Audits, Schulungen, KI-Anbindungen für Bestandsprojekte. Das ist unser Rat und nicht recherchiert: Kein Fördertopf ersetzt laufende Aufträge. Viele Ökosysteme verteilen zudem eigenes Geld an Ideen und Mitwirkende, zum Beispiel das Community Budget der TYPO3 Association (2026: drei Runden, 32.500 € in der ersten), die PHP Foundation, die Sovereign Tech Agency oder die Fördertöpfe großer Open-Source-Stiftungen; prüfe das Ökosystem, in dem du arbeitest.',
    bodyEn: 'Years of experience in a stack (TYPO3, WordPress, Laravel, Rails, Kubernetes, databases, accessibility, whatever it is) are the most reliable runway: maintenance and upgrades, subcontracting for agencies, migrations, audits, training, AI integrations for existing projects. This is our advice and was not researched: no grant replaces ongoing work. Many ecosystems also hand out their own money to ideas and contributors, for example the TYPO3 Association’s Community Budget (2026: three rounds, €32,500 in the first), the PHP Foundation, the Sovereign Tech Agency or the funds of large open-source foundations; check the ecosystem you work in.',
  },
];

export const AI_CREDIT_PROGRAMS: CreditProgram[] = [
  {
    id: 'anthropic-oss',
    kind: 'subscription',
    nameDe: 'Anthropic · Claude for Open Source',
    nameEn: 'Anthropic · Claude for Open Source',
    provider: 'Anthropic',
    valueDe: '6 Monate Claude Max 20x (ca. 1.200 $), keine API-Credits',
    valueEn: '6 months Claude Max 20x (about $1,200), no API credits',
    whoDe: 'Natürliche Person ab 18, GitHub-Konto älter als 2 Jahre, Aktivität in den letzten 90 Tagen, OSI-lizenzierte Projekte. Maintainer-Spur: z. B. 500+ abhängige Repos, 200.000+ Downloads im Monat, 100+ gemergte PRs in fremden Repos oder 20+ externe Mitwirkende. Daneben eine Ermessensspur („Ecosystem Impact“). Höchstens 10.000 Plätze, laufende Prüfung.',
    whoEn: 'Natural person 18+, GitHub account older than 2 years, activity in the last 90 days, OSI-licensed projects. Maintainer track: e. g. 500+ dependent repos, 200,000+ monthly downloads, 100+ merged PRs in others’ repos or 20+ external contributors. Plus a discretionary "Ecosystem Impact" track. Max 10,000 places, rolling review.',
    fit: 'maybe',
    nextDe: 'Amélie selbst erfüllt heute keines der Kriterien (2 Sterne, Repo seit 16.09.2026, Lizenz CC0). Drittseiten nennen 5.000 Sterne und einen Stichtag 30.06.2026; die Bedingungen von Anthropic nennen weder das eine noch das andere. Chance: eigene Beiträge zu irgendeinem OSI-lizenzierten Projekt zählen (100+ gemergte PRs in fremden Repos in 12 Monaten, Committer-Status in einem anerkannten Projekt oder 20+ externe Mitwirkende). Dann mit diesem Nachweis bewerben, nicht mit Amélie. Wiederbewerbung ist nur nach Ablauf der Leistungsdauer geregelt: nicht mit schwachem Antrag verbrennen, keine Kennzahlen aufblähen (Widerrufsgrund).',
    nextEn: 'Amélie itself meets none of the criteria today (2 stars, repo since 16 Sep 2026, CC0 licence). Third-party sites cite 5,000 stars and a 30 Jun 2026 cut-off; Anthropic’s terms state neither. Opportunity: your own contributions to any OSI-licensed project count (100+ merged PRs in others’ repos in 12 months, committer status in a recognised project or 20+ external contributors). Apply with that evidence, not with Amélie. Reapplication is only regulated after the benefit period ends: do not burn it on a weak application, and do not inflate metrics (grounds for revocation).',
    evidence: 'read',
    url: 'https://www.anthropic.com/claude-for-oss-terms',
    checked: C,
  },
  {
    id: 'anthropic-nonprofits',
    kind: 'credits',
    nameDe: 'Anthropic · Claude for Nonprofits',
    nameEn: 'Anthropic · Claude for Nonprofits',
    provider: 'Anthropic',
    valueDe: '500 $ Startguthaben, 40 % Rabatt auf Team, laut Berichten bis 75 % für Team und Enterprise',
    valueEn: '$500 starter credit, 40 % off Team, reportedly up to 75 % on Team and Enterprise',
    whoDe: 'Registrierte gemeinnützige Organisationen und internationale Entsprechungen, Prüfung über TechSoup. Behörden, Parteien und Hochschulen sind ausgeschlossen. Berichte nennen zwei verschiedene Startdaten.',
    whoEn: 'Registered nonprofits and international equivalents, verified via TechSoup. Government, campaigns and universities are excluded. Reports give two different launch dates.',
    fit: 'blocked',
    nextDe: 'Setzt eine anerkannt gemeinnützige Rechtsform voraus, die es für Amélie noch nicht gibt. Erst relevant, wenn die Rechtsform entschieden ist.',
    nextEn: 'Needs a recognised charitable legal form that Amélie does not have yet. Relevant only once the legal form is decided.',
    evidence: 'snippet',
    url: 'https://claude.ai/nonprofits',
    checked: C,
  },
  {
    id: 'anthropic-startups',
    kind: 'credits',
    nameDe: 'Anthropic · Claude for Startups',
    nameEn: 'Anthropic · Claude for Startups',
    provider: 'Anthropic',
    valueDe: 'Üblich 1.000 bis 5.000 $, bis 100.000 $ in der obersten Stufe, ca. 12 Monate gültig',
    valueEn: 'Typically $1,000 to $5,000, up to $100,000 at the top tier, valid about 12 months',
    whoDe: 'Credits-Stufe: Firma unter vier Jahre alt mit Eigenkapital von einem institutionellen Investor. Die offene Stufe gibt Zugang zum Ökosystem, aber keine Credits. Einzelentwickler und Bootstrapper erhalten keine Credits.',
    whoEn: 'Credits tier: company under four years old with equity from an institutional investor. The open tier gives ecosystem access but no credits. Individual developers and bootstrapped founders get no credits.',
    fit: 'blocked',
    nextDe: 'Ohne Firma und Investor nicht erreichbar. Nur als Vermerk für eine spätere Ausgründung (Ventures-Zweig).',
    nextEn: 'Not reachable without a company and investor. A note for a later spin-off (ventures branch) only.',
    evidence: 'snippet',
    url: 'https://claude.com/programs/startups',
    checked: C,
  },
  {
    id: 'anthropic-science',
    kind: 'credits',
    nameDe: 'Anthropic · AI for Science',
    nameEn: 'Anthropic · AI for Science',
    provider: 'Anthropic',
    valueDe: 'API-Credits bis 30.000 $',
    valueEn: 'API credits up to $30,000',
    whoDe: 'Forschung, in der Praxis nur mit Hochschulpartner. Die Frist 2026 (15.07.) ist abgelaufen.',
    whoEn: 'Research, in practice only with a university partner. The 2026 deadline (15 Jul) has passed.',
    fit: 'blocked',
    nextDe: 'Beobachten für 2027. Nur sinnvoll mit einer Hochschule, etwa über die Empfänger der Dosen.',
    nextEn: 'Watch for 2027. Only sensible with a university, for example through the recipients of the tins.',
    evidence: 'snippet',
    url: 'https://support.claude.com/en/articles/11199177-anthropic-s-ai-for-science-program',
    checked: C,
  },
  {
    id: 'openai-codex-oss',
    kind: 'credits',
    nameDe: 'OpenAI · Codex Open Source Fund',
    nameEn: 'OpenAI · Codex Open Source Fund',
    provider: 'OpenAI',
    valueDe: 'Bis 25.000 $ API-Credits; zusätzlich 6 Monate ChatGPT Pro mit Codex im Programm „Codex for Open Source“',
    valueEn: 'Up to $25,000 API credits; plus 6 months ChatGPT Pro with Codex in the "Codex for Open Source" programme',
    whoDe: 'Open-Source-Projekte, die Codex für PR-Review, Maintainer-Automatisierung oder Releases nutzen. Laufende Prüfung.',
    whoEn: 'Open-source projects that use Codex for PR review, maintainer automation or releases. Rolling review.',
    fit: 'maybe',
    nextDe: 'Amélie arbeitet mit Claude. Nur sinnvoll, wenn ein Code-Repo existiert und Codex dafür eingesetzt wird; Lab-Läufe über Gemini zählen nicht.',
    nextEn: 'Amélie works with Claude. Only sensible if a code repo exists and Codex is used on it; lab runs via Gemini do not count.',
    evidence: 'snippet',
    url: 'https://openai.com/form/codex-open-source-fund/',
    checked: C,
  },
  {
    id: 'gemini-free',
    kind: 'free-tier',
    nameDe: 'Google · Gemini-API-Gratisstufe',
    nameEn: 'Google · Gemini API free tier',
    provider: 'Google',
    valueDe: 'Kostenlos ohne Karte, begrenzt pro Minute und Tag (Berichte: Flash ca. 1.500 Anfragen am Tag, Pro ca. 50), 1 Mio. Token Kontext',
    valueEn: 'Free without a card, rate-limited per minute and day (reports: Flash about 1,500 requests a day, Pro about 50), 1M token context',
    whoDe: 'Jede Person mit Google-Konto. Google nennt keine festen Zusagen; die Grenzen stehen je Projekt in AI Studio und wurden zuletzt gesenkt.',
    whoEn: 'Anyone with a Google account. Google guarantees no fixed limits; they appear per project in AI Studio and were cut recently.',
    fit: 'try',
    nextDe: 'Sofort für Lab-Läufe und Besetzt-Prüfungen nutzen (Agenten laufen schon über Gemini). Für ganze Teamrunden zu klein.',
    nextEn: 'Use at once for lab runs and occupancy checks (agents already run on Gemini). Too small for full team rounds.',
    evidence: 'snippet',
    url: 'https://ai.google.dev/gemini-api/docs/rate-limits',
    checked: C,
  },
  {
    id: 'google-startups',
    kind: 'credits',
    nameDe: 'Google · for Startups Cloud Program',
    nameEn: 'Google · for Startups Cloud Program',
    provider: 'Google Cloud',
    valueDe: 'Start-Stufe 2.000 $; Scale bis 200.000 $, 350.000 $ für KI-Startups',
    valueEn: 'Start tier $2,000; Scale up to $200,000, $350,000 for AI startups',
    whoDe: 'Start-Stufe: Firma unter 24 Monaten mit lauffähigem MVP. Scale: Finanzierung durch institutionelle Investoren (Förderungen und Crowdfunding zählen nicht).',
    whoEn: 'Start tier: company under 24 months with a working MVP. Scale: institutional investor funding (grants and crowdfunding do not count).',
    fit: 'maybe',
    nextDe: 'Das Lab läuft schon über Vertex AI (Projekt amelie-agents). Die Start-Stufe wäre erreichbar, wenn eine Firma gegründet ist (etwa für den Ventures-Zweig); dafür nicht den CC0-Kern verwenden.',
    nextEn: 'The lab already runs on Vertex AI (project amelie-agents). The Start tier would be reachable once a company exists (for example for the ventures branch); do not use the CC0 core for it.',
    evidence: 'snippet',
    url: 'https://cloud.google.com/startup',
    checked: C,
  },
  {
    id: 'google-nonprofits',
    kind: 'credits',
    nameDe: 'Google for Nonprofits (Deutschland)',
    nameEn: 'Google for Nonprofits (Germany)',
    provider: 'Google',
    valueDe: 'Gemini in Workspace gratis; Cloud-Guthaben laut Berichten rund 1.000 $ im Jahr',
    valueEn: 'Gemini in Workspace free; cloud credit reportedly about $1,000 a year',
    whoDe: 'In Deutschland als eingetragene gemeinnützige Organisation, Prüfung über Goodstack. Betrag nicht auf der Primärseite bestätigt.',
    whoEn: 'In Germany as a registered charitable organisation, verified via Goodstack. Amount not confirmed on the primary page.',
    fit: 'blocked',
    nextDe: 'Wie bei Claude for Nonprofits: erst nach der Rechtsform-Entscheidung.',
    nextEn: 'As with Claude for Nonprofits: only after the legal-form decision.',
    evidence: 'snippet',
    url: 'https://support.google.com/nonprofits/answer/3215869',
    checked: C,
  },
  {
    id: 'microsoft-founders-hub',
    kind: 'credits',
    nameDe: 'Microsoft for Startups · Founders Hub',
    nameEn: 'Microsoft for Startups · Founders Hub',
    provider: 'Microsoft',
    valueDe: 'Idea-Stufe 1.000 $ Azure-Guthaben (Selbstbewerbung), 5.000 $ MVP-Stufe, bis 150.000 $ nach Wachstum; Azure OpenAI nutzbar',
    valueEn: 'Idea tier $1,000 Azure credit (self-apply), $5,000 MVP tier, up to $150,000 at scale; Azure OpenAI usable',
    whoDe: 'Gründer ohne Investor erlaubt. Stufen verlangen steigende Belege (Produkt, Umsatz, Finanzierung).',
    whoEn: 'Founders without investors allowed. Tiers require growing proof (product, revenue, funding).',
    fit: 'try',
    nextDe: 'Der einzige Weg zu OpenAI-Modellen ohne Investor. Idea-Stufe prüfen; Zugriff auf Claude über Azure ist damit nicht gesichert.',
    nextEn: 'The only route to OpenAI models without an investor. Check the idea tier; access to Claude through Azure is not guaranteed by it.',
    evidence: 'snippet',
    url: 'https://www.microsoft.com/startups',
    checked: C,
  },
  {
    id: 'mistral-free',
    kind: 'free-tier',
    nameDe: 'Mistral · Gratisplan und Experiment-Stufe',
    nameEn: 'Mistral · Free plan and Experiment tier',
    provider: 'Mistral AI',
    valueDe: 'Gratisplan mit 10 $ API-Guthaben im Monat; Experiment-Stufe mit begrenzter Rate; kein offenes Startup-Programm (Mistralship) mehr, Seite 404',
    valueEn: 'Free plan with $10 API credit a month; rate-limited Experiment tier; no open startup programme (Mistralship) any more, page 404',
    whoDe: 'Jede Person. Europäischer Anbieter, relevant für Datenschutzthemen der Apotheken-Linie.',
    whoEn: 'Anyone. European provider, relevant for data-protection topics of the pharmacy line.',
    fit: 'try',
    nextDe: 'Als Ausweichmodell für Vergleichsläufe (Modellvergleich) einplanen, nicht als Hauptquelle.',
    nextEn: 'Plan as a fallback model for comparison runs (model comparison), not as the main source.',
    evidence: 'snippet',
    url: 'https://mistral.ai/pricing',
    checked: C,
  },
  {
    id: 'github-copilot-oss',
    kind: 'tooling',
    nameDe: 'GitHub Copilot Pro für Open-Source-Maintainer · JetBrains frei',
    nameEn: 'GitHub Copilot Pro for open-source maintainers · JetBrains free',
    provider: 'GitHub / JetBrains',
    valueDe: 'Copilot Pro gratis für anerkannte Maintainer, WebStorm und andere JetBrains-IDEs gratis für nichtkommerzielle Arbeit',
    valueEn: 'Copilot Pro free for recognised maintainers, WebStorm and other JetBrains IDEs free for non-commercial work',
    whoDe: 'Copilot: keine Bewerbung, GitHub zeigt es unter github.com/settings/copilot an, Schwellen nicht veröffentlicht (Gemeinde nennt etwa 2.500 Sterne). JetBrains: nur ohne kommerzielle Nutzung, Kundenarbeit zählt nicht.',
    whoEn: 'Copilot: no application, GitHub shows it at github.com/settings/copilot, thresholds unpublished (community cites about 2,500 stars). JetBrains: non-commercial use only, client work does not count.',
    fit: 'maybe',
    nextDe: 'Einmal unter github.com/settings/copilot nachsehen. Spart Werkzeugkosten, deckt aber keine Agentenläufe.',
    nextEn: 'Check github.com/settings/copilot once. Saves tooling costs but does not cover agent runs.',
    evidence: 'snippet',
    url: 'https://github.com/settings/copilot',
    checked: C,
  },
  {
    id: 'prototype-fund',
    kind: 'cash',
    nameDe: 'Prototype Fund · Klasse 03',
    nameEn: 'Prototype Fund · class 03',
    provider: 'Open Knowledge Foundation Deutschland / BMFTR',
    valueDe: 'Bis 47.500 € (Einzelperson, 6 Monate) oder 95.000 € (Team), danach 4 Monate Second Stage',
    valueEn: 'Up to €47,500 (individual, 6 months) or €95,000 (team), then 4-month second stage',
    whoDe: 'Software (keine Hardware), volljährig, wohnhaft und steuerpflichtig in Deutschland, selbstständig oder freiberuflich, Einzelperson oder GbR. Ergebnis muss unter einer Open-Source-Lizenz öffentlich liegen. Schwerpunkte Datensicherheit und Software-Infrastruktur. Bewerbung 01.10. bis 30.11.2026, Förderung Juni bis November 2027.',
    whoEn: 'Software (no hardware), of legal age, resident and taxed in Germany, self-employed or freelance, individual or GbR. Result must be public under an open-source licence. Focus areas data security and software infrastructure. Applications 1 Oct to 30 Nov 2026, funding June to November 2027.',
    fit: 'try',
    nextDe: 'Antragsentwurf v2 liegt vor (`04-werkzeug/prototype-fund-antrag-klasse-03.md`). Zuerst klären: CC0 ist keine OSI-Lizenz, der Code-Kern braucht MIT oder EUPL, Texte bleiben CC0. Die Primärseite war für uns gesperrt (403), alle Angaben aus Suchschnipseln; ältere Wiki-Seiten nennen die Frist 14.03.2026 der Vorrunde. Fördergeld kauft Credits, aber erst ab Juni 2027.',
    nextEn: 'Draft application v2 exists (`04-werkzeug/prototype-fund-antrag-klasse-03.md`). Clarify first: CC0 is not an OSI licence, the code core needs MIT or EUPL, texts stay CC0. The primary page was blocked for us (403), all details come from search snippets; older wiki pages show the previous round’s 14 Mar 2026 deadline. Funding buys credits, but only from June 2027.',
    evidence: 'snippet',
    url: 'https://www.prototypefund.de/en/application',
    checked: C,
  },
  {
    id: 'nlnet',
    kind: 'cash',
    nameDe: 'NLnet · Restack und CodeSupply',
    nameEn: 'NLnet · Restack and CodeSupply',
    provider: 'NLnet Foundation',
    valueDe: '5.000 bis 50.000 € für Erstanträge',
    valueEn: '€5,000 to €50,000 for first grants',
    whoDe: 'Einzelpersonen und Organisationen mit europäischem Bezug. Offene Lizenzen und offene Standards, überwiegend technische Entwicklung. Seit 08.12.2025: KI-generierte Projekte oder Anträge unerwünscht, jede KI-Nutzung offenlegen und Prompts samt Ausgaben dokumentieren (bis 8.000 Zeichen im Formular).',
    whoEn: 'Individuals and organisations with a European dimension. Open licences and open standards, primarily technical development. Since 8 Dec 2025: AI-generated projects or proposals unwanted, all AI use must be disclosed and prompts and outputs documented (up to 8,000 characters in the form).',
    fit: 'maybe',
    nextDe: 'Frist 03.11.2026, 12 Uhr MEZ. Sehr riskant für ein agentengestütztes Projekt wie Amélie: Der Antrag muss ehrlich offenlegen, wie viel KI im Spiel ist, und das Vorhaben darf kein KI-Ergebnis sein. Eher für einen handgeschriebenen Code-Kern geeignet.',
    nextEn: 'Deadline 3 Nov 2026, 12:00 CET. Risky for an agent-assisted project like Amélie: the proposal must honestly disclose how much AI is involved and the project must not be an AI output. Better suited to a hand-written code core.',
    evidence: 'read',
    url: 'https://nlnet.nl/propose/',
    checked: C,
  },
  {
    id: 'typo3-community-budget',
    kind: 'cash',
    nameDe: 'Ökosystem-Budgets, Beispiel TYPO3 Community Budget',
    nameEn: 'Ecosystem budgets, example TYPO3 Community Budget',
    provider: 'TYPO3 Association',
    valueDe: 'Rund 32.500 € auf vier Projekte in der ersten Runde 2026; Mitglieder wählen',
    valueEn: 'About €32,500 across four projects in the first 2026 round; members vote',
    whoDe: 'Ideen aus der Community, abgestimmt von Mitgliedern der Association (ab 7,92 € im Jahr). 2026 gab es drei Runden (Februar bis April, Mai bis August, September bis November).',
    whoEn: 'Ideas from the community, voted on by Association members (from €7.92 a year). 2026 had three rounds (February to April, May to August, September to November).',
    fit: 'maybe',
    nextDe: 'Nur für eine Idee, die dem jeweiligen Ökosystem nützt (Beispiel TYPO3: KI-gestützte Wartung oder ein Prüfwerkzeug für Extensions). Wer in einem anderen Stack arbeitet, sucht das Gegenstück bei dessen Stiftung. Rundenplanung 2027 auf typo3.org verfolgen; Ausschreibungstext und Förderfähigkeit sind nicht gelesen.',
    nextEn: 'Only for an idea that benefits the ecosystem in question (TYPO3 example: AI-assisted maintenance or a checking tool for extensions). If you work in another stack, look for the counterpart at its foundation. Follow the 2027 round schedule on typo3.org; call text and eligibility were not read.',
    evidence: 'snippet',
    url: 'https://news.typo3.com/article/first-call-for-community-budget-ideas-in-2026',
    checked: C,
  },
  {
    id: 'gruendungszuschuss',
    kind: 'cash',
    nameDe: 'Gründungszuschuss (Arbeitsagentur)',
    nameEn: 'Start-up subsidy (Federal Employment Agency)',
    provider: 'Bundesagentur für Arbeit',
    valueDe: 'Bisheriges Arbeitslosengeld plus 300 € Sozialversicherung für 6 Monate, danach bis 9 Monate je 300 €; insgesamt bis ca. 20.700 €',
    valueEn: 'Previous unemployment benefit plus €300 social insurance for 6 months, then up to 9 months at €300; up to about €20,700 in total',
    whoDe: 'Nur wer Arbeitslosengeld I bezieht, noch mindestens 150 Tage Anspruch hat, hauptberuflich (über 15 Wochenstunden) selbstständig wird und eine fachkundige Stellungnahme vorlegt. Ermessensleistung, kein Rechtsanspruch.',
    whoEn: 'Only for those who receive unemployment benefit I, have at least 150 days of entitlement left, become self-employed full time (over 15 hours a week) and provide an expert statement. Discretionary, no legal entitlement.',
    fit: 'maybe',
    nextDe: 'Nur relevant, falls du arbeitslos gemeldet bist oder wirst. Zahlen aus Aggregatoren; vor jeder Entscheidung bei der Arbeitsagentur prüfen. Wir kennen deine Lage nicht.',
    nextEn: 'Only relevant if you are or become registered unemployed. Figures from aggregators; check with the Employment Agency before deciding. We do not know your situation.',
    evidence: 'snippet',
    url: 'https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld/gruendungszuschuss-beantragen',
    checked: C,
  },
  {
    id: 'micro-support',
    kind: 'cash',
    nameDe: 'GitHub Sponsors · Liberapay · Open Collective',
    nameEn: 'GitHub Sponsors · Liberapay · Open Collective',
    provider: 'Plattformen',
    valueDe: 'Kleine, laufende Beträge. GitHub Sponsors ohne Plattformgebühr (Auszahlung in über 100 Ländern), Liberapay ohne Plattformgebühr, Open Source Collective als fiskalischer Host mit 10 % Gebühr',
    valueEn: 'Small recurring amounts. GitHub Sponsors without platform fee (payout in over 100 countries), Liberapay without platform fee, Open Source Collective as fiscal host with a 10 % fee',
    whoDe: 'Einzelpersonen. Steuerliche Behandlung der Einnahmen selbst klären.',
    whoEn: 'Individuals. Clarify the tax treatment of the income yourself.',
    fit: 'try',
    nextDe: 'Deckt keine Teamrunden, aber ein Satz im README („Eine Runde kostet etwa x € Credits“) ist ehrlich und kein Pitch. Passt zu Regel 3.',
    nextEn: 'Does not cover team rounds, but a README line ("one round costs about €x of credits") is honest and not a pitch. Fits rule 3.',
    evidence: 'snippet',
    url: 'https://github.com/sponsors',
    checked: C,
  },
];

export const AI_CREDIT_BLOCKERS: CreditBlocker[] = [
  {
    id: 'cc0-osi',
    titleDe: 'CC0 ist keine OSI-Lizenz',
    titleEn: 'CC0 is not an OSI licence',
    bodyDe: 'Anthropic (Open Source) und der Prototype Fund setzen eine Open-Source-Lizenz für den Code voraus. Amélie gibt alles unter CC0 frei. Lösung: Texte, Dossiers und Ideen bleiben CC0, der Code-Kern (Engines, Bibliotheks-CLI) bekommt eine OSI-Lizenz wie MIT oder EUPL-1.2. Das ist eine Entscheidung, die Félix treffen muss.',
    bodyEn: 'Anthropic (open source) and the Prototype Fund require an open-source licence for code. Amélie releases everything under CC0. Fix: texts, dossiers and ideas stay CC0, the code core (engines, library CLI) gets an OSI licence such as MIT or EUPL-1.2. This is Félix’s decision.',
  },
  {
    id: 'ai-policy',
    titleDe: 'Förderer misstrauen KI-Projekten',
    titleEn: 'Funders distrust AI projects',
    bodyDe: 'NLnet verlangt seit Dezember 2025 Offenlegung jeder KI-Nutzung samt Prompt-Protokoll und lehnt KI-generierte Projekte ab. Amélie ist agentengestützt. Ehrlich beschreiben, was Mensch und Maschine tun; ein Antrag, der Amélie als Ideenverfahren darstellt, gefährdet die Förderung.',
    bodyEn: 'Since December 2025 NLnet requires disclosure of any AI use including a prompt log and rejects AI-generated projects. Amélie is agent-assisted. Describe honestly what human and machine do; an application that presents Amélie as an idea process puts the grant at risk.',
  },
  {
    id: 'legal-form',
    titleDe: 'Ohne Rechtsform keine Nonprofit-Programme',
    titleEn: 'No legal form, no nonprofit programmes',
    bodyDe: 'Claude for Nonprofits und Google for Nonprofits verlangen eine eingetragene, anerkannt gemeinnützige Organisation. Der Prototype Fund nimmt Einzelpersonen und GbR. Die Rechtsform-Frage ist in `CLAUDE.md` weiterhin offen.',
    bodyEn: 'Claude for Nonprofits and Google for Nonprofits require a registered, recognised charitable organisation. The Prototype Fund accepts individuals and GbR. The legal-form question remains open in `CLAUDE.md`.',
  },
  {
    id: 'cc0-vs-commercial',
    titleDe: 'Förderung und Verkauf trennen',
    titleEn: 'Separate funding from selling',
    bodyDe: 'Gefördert wird nur, was Open Source bleibt. Das kommerzielle Kit (`zero-drift-swarm-kit`) und die Venture-Zwillinge dürfen nicht aus Fördergeld entstehen. Vorgehen steht in `04-werkzeug/prototype-fund-antrag-klasse-03.md`, Abschnitt 0.',
    bodyEn: 'Only what stays open source gets funded. The commercial kit (`zero-drift-swarm-kit`) and the venture twins must not come from grant money. The procedure is in `04-werkzeug/prototype-fund-antrag-klasse-03.md`, section 0.',
  },
  {
    id: 'evidence',
    titleDe: 'Fast alles ist Suchschnipsel',
    titleEn: 'Almost everything is a search snippet',
    bodyDe: 'Gelesen auf der Primärseite wurden nur die Anthropic-Bedingungen für Open Source und die NLnet-Seiten; der Prototype Fund war gesperrt. Beträge, Fristen und Zulässigkeit vor jeder Bewerbung auf der Primärseite prüfen und nie abgelaufene Fristen als offen darstellen.',
    bodyEn: 'Only Anthropic’s open-source terms and the NLnet pages were read on primary pages; the Prototype Fund was blocked. Verify amounts, deadlines and eligibility on the primary page before applying and never present expired deadlines as open.',
  },
];

export const AI_CREDIT_DATES: CreditDate[] = [
  { date: '2026-10-01', labelDe: 'Prototype Fund Klasse 03: Bewerbungsfenster öffnet', labelEn: 'Prototype Fund class 03: application window opens' },
  { date: '2026-11-03', labelDe: 'NLnet Restack und CodeSupply: Frist 12 Uhr MEZ', labelEn: 'NLnet Restack and CodeSupply: deadline 12:00 CET' },
  { date: '2026-11-30', labelDe: 'Prototype Fund Klasse 03: Bewerbungsfrist', labelEn: 'Prototype Fund class 03: application deadline' },
  { date: '2027-06-01', labelDe: 'Prototype Fund: Förderbeginn der Klasse 03 (Juni bis November 2027)', labelEn: 'Prototype Fund: class 03 funding starts (June to November 2027)' },
];

export const AI_CREDIT_STEPS: { de: string; en: string }[] = [
  {
    de: 'Diese Woche: Gemini-Gratisstufe und Founders Hub (Idea-Stufe) einrichten, unter github.com/settings/copilot nachsehen.',
    en: 'This week: set up the Gemini free tier and Founders Hub (idea tier), check github.com/settings/copilot.',
  },
  {
    de: 'Vor Bewerbungen: Lizenzfrage entscheiden (Code unter MIT/EUPL, Texte CC0) und Primärseiten von Prototype Fund und Anthropic lesen.',
    en: 'Before applying: decide the licence question (code under MIT/EUPL, texts CC0) and read the Prototype Fund and Anthropic primary pages.',
  },
  {
    de: 'Bis 30.11.2026: Prototype-Fund-Antrag aus Entwurf v2 fertigstellen und ehrlich zur KI-Nutzung schreiben.',
    en: 'By 30 Nov 2026: finish the Prototype Fund application from draft v2 and write honestly about AI use.',
  },
  {
    de: 'Parallel: ein bis zwei Aufträge aus deinem Handwerk (Wartung, Migration, Audit, Unterauftrag für Agenturen) aktivieren, damit der Runway nicht an einer Förderung hängt.',
    en: 'In parallel: activate one or two jobs from your craft (maintenance, migration, audit, agency subcontracting) so the runway does not depend on a grant.',
  },
  {
    de: 'Später: Rechtsform klären (Steuerberatung), dann Claude for Nonprofits und Google for Nonprofits prüfen.',
    en: 'Later: clarify the legal form (tax adviser), then check Claude for Nonprofits and Google for Nonprofits.',
  },
];

export const AI_CREDIT_QUESTIONS: CreditQuestion[] = [
  { de: 'Bist du angestellt, selbstständig oder arbeitslos gemeldet? (entscheidet über Gründungszuschuss und Prototype Fund)', en: 'Are you employed, self-employed or registered unemployed? (decides on start-up subsidy and Prototype Fund)' },
  { de: 'Wo wohnst und versteuerst du? (Prototype Fund verlangt Deutschland)', en: 'Where do you live and pay tax? (Prototype Fund requires Germany)' },
  { de: 'Welches Repo trägt Code, wie viele Sterne und Mitwirkende hat es, und unter welcher Lizenz?', en: 'Which repo carries code, how many stars and contributors does it have, and under which licence?' },
  { de: 'Was sind amelie-lab und tortilladepatatas.org, und gehören sie zur Apotheken-Linie?', en: 'What are amelie-lab and tortilladepatatas.org, and do they belong to the pharmacy line?' },
  { de: 'Wie hoch sind deine tatsächlichen KI-Kosten pro Monat? (Ohne diese Zahl lässt sich keine Förderung begründen.)', en: 'What are your actual AI costs per month? (Without this number no funding can be justified.)' },
];


export interface StarterStep {
  titleDe: string;
  titleEn: string;
  bodyDe: string;
  bodyEn: string;
  /** Optionale Shell-Zeile zum Kopieren. */
  command?: string;
}

/**
 * Für alle, die Agenten-Orchestrierung ausprobieren wollen: ein günstiger Einstieg mit dem,
 * was Amélie schon mitbringt. Alle Befehle stehen in `06-suche/amelie-kommandozeile.md`.
 */
export const AI_STARTER_STEPS: StarterStep[] = [
  {
    titleDe: '1 · Erst ohne Netz und ohne Kosten: der Mock-Lauf',
    titleEn: '1 · First without network and without cost: the mock run',
    bodyDe: 'Die Teamrunde läuft im Mock-Modus mit geskripteten Modellen durch die ganze Kette (Vorflug, drei Engines, Merge, Reviewer, Bibliothekar) und schreibt nie. So siehst du die Orchestrierung, bevor du einen Cent ausgibst.',
    bodyEn: 'The team round runs in mock mode with scripted models through the whole chain (preflight, three engines, merge, reviewer, librarian) and never writes. You see the orchestration before spending a cent.',
    command: 'npm run teamrunde -- "Holz" --mock',
  },
  {
    titleDe: '2 · Dann ein günstiges Modell, nur Trockenlauf',
    titleEn: '2 · Then a cheap model, dry run only',
    bodyDe: 'Trage in `scripts/model-compare/models.local.json` ein Modell ein (zum Beispiel die Gemini-Gratisstufe oder ein kleines Claude-Modell) und setze es als `crew`. Ohne `--write` schreibt die Runde nichts ins Repo; du liest die Akte unter `06-suche/agent-runs/`.',
    bodyEn: 'Enter a model in `scripts/model-compare/models.local.json` (for example the Gemini free tier or a small Claude model) and set it as `crew`. Without `--write` the round writes nothing to the repo; you read the dossier under `06-suche/agent-runs/`.',
    command: 'npm run teamrunde -- "Holz" --model gemini-flash',
  },
  {
    titleDe: '3 · Preise vergleichen, bevor du hochskalierst',
    titleEn: '3 · Compare prices before scaling up',
    bodyDe: 'Der Modellvergleich lässt dieselbe Runde über mehrere Modelle laufen und misst Nachprüfbares (Formtreue, „als frei gemeldet, obwohl begraben“, Kosten). Eine echte Messung steht noch aus; die Preise in der Konfiguration sind Beispiele und gegen die Preisseite des Anbieters zu prüfen.',
    bodyEn: 'The model comparison runs the same round over several models and measures verifiable things (format fidelity, "reported free although buried", cost). A real measurement is still outstanding; prices in the configuration are examples and must be checked against the provider’s price page.',
    command: 'npm run vergleich -- models',
  },
  {
    titleDe: '4 · Eigenes Thema, eigene Agenten',
    titleEn: '4 · Your own topic, your own agents',
    bodyDe: 'Die Rollen liegen als Markdown unter `.claude/agents/` (Scout, Kollider, Inversion, Reviewer, Packer, Bibliothekar). Kopiere eine Definition, ändere Auftrag und Schreibrechte, und lass sie über `npm run agent` laufen. Disjunkte Schreibrechte und ein einziger Schreiber sind der Kern, nicht die Anzahl der Agenten.',
    bodyEn: 'The roles live as Markdown under `.claude/agents/` (scout, collider, inversion, reviewer, packer, librarian). Copy a definition, change the brief and write permissions, and run it through `npm run agent`. Disjoint write permissions and a single writer are the core, not the number of agents.',
    command: 'npm run agent -- list',
  },
];

export const AI_CREDIT_CHECKED = C;

// Ventures-Lauf 30.09.2026 (Anfrage aus Reddit): Kundengewinnung für die
// Vermittlung von Apothekenkäufen und -verkäufen in Spanien.
//
// Alle Zahlen in APPROACHES und BASE_ASSUMPTIONS sind ANNAHMEN, keine
// Messwerte. Belegt (Suchschnipsel, vor Nennung prüfen) sind nur die Einträge
// in PHARMA_FACTS und PHARMA_SOURCES. Der ungemessene Kern sind die
// Konversionsraten; der 90-Tage-Test (PHARMA_TEST_PLAN) misst sie.

export interface PharmaAssumptions {
  /** Durchschnittlicher Kaufpreis einer Apotheke in Euro. */
  dealPriceEur: number;
  /** Provision je Seite in Prozent des Kaufpreises (0.03 = 3 %). */
  feePct: number;
  /** Anteil der Vermittlungsaufträge, die zum Abschluss kommen. */
  mandateToClose: number;
  /** Monate vom unterschriebenen Auftrag bis zur Provision. */
  monthsMandateToClose: number;
}

export const BASE_ASSUMPTIONS: PharmaAssumptions = {
  dealPriceEur: 1_000_000,
  feePct: 0.03,
  mandateToClose: 0.4,
  monthsMandateToClose: 8,
};

export type ApproachSide = 'sell' | 'buy';

export interface PharmaApproach {
  id: string;
  side: ApproachSide;
  nameDe: string;
  nameEn: string;
  whatDe: string;
  whatEn: string;
  /** Einmalige Investition in Euro. */
  setupEur: number;
  /** Laufende Kosten je Monat in Euro. */
  monthlyEur: number;
  /** Monate bis zum ersten qualifizierten Kontakt. */
  monthsToFirstLead: number;
  /** Qualifizierte Kontakte je Jahr im eingeschwungenen Zustand. */
  leadsPerYear: number;
  /** Anteil der Kontakte, die einen Vermittlungsauftrag unterschreiben. */
  leadToMandate: number;
  /** Erfolgsvergütung an Dritte als Anteil der Provision. */
  successFeeShare?: number;
  riskDe: string;
  riskEn: string;
}

export const APPROACHES: PharmaApproach[] = [
  {
    id: 'letters',
    side: 'sell',
    nameDe: 'Persönliche Briefe an Titulare',
    nameEn: 'Personal letters to owners',
    whatDe: '4.000 Briefe pro Jahr an Inhaber mit langer Betriebszeit. Post ist erlaubt, wo E-Mail ohne Einwilligung nicht ist.',
    whatEn: '4,000 letters a year to owners of long-established pharmacies. Post is allowed where unsolicited e-mail is not.',
    setupEur: 1500,
    monthlyEur: 400,
    monthsToFirstLead: 1.5,
    leadsPerYear: 28,
    leadToMandate: 0.12,
    riskDe: 'Adressquelle und Robinson-Abgleich klären; Rücklauf von 0,7 % ist geraten.',
    riskEn: 'Address source and opt-out list check needed; a 0.7 % response rate is a guess.',
  },
  {
    id: 'letters-radar',
    side: 'sell',
    nameDe: 'Briefe mit Nachfolge-Radar',
    nameEn: 'Letters with succession radar',
    whatDe: 'Wie Briefe, aber die Liste wird aus öffentlichen Daten bewertet (Betriebsjahre, Umsatzklasse, Ort). Das ist der Software-Hebel.',
    whatEn: 'As letters, but the list is scored from public data (years open, sales band, location). This is the software lever.',
    setupEur: 7500,
    monthlyEur: 650,
    monthsToFirstLead: 3,
    leadsPerYear: 56,
    leadToMandate: 0.12,
    riskDe: 'Alter der Inhaber ist nicht öffentlich; nur Betriebsdauer und Umsatzklassen als Näherung. Datenschutz vorher prüfen.',
    riskEn: 'Owner age is not public; only years open and sales bands as proxies. Check data protection first.',
  },
  {
    id: 'ads',
    side: 'sell',
    nameDe: 'Google Ads auf Verkaufssuchen',
    nameEn: 'Google Ads on seller searches',
    whatDe: 'Suchanzeigen auf „farmacia vender“ und „valoración farmacia“, Landingpage mit Bewertungsrechner.',
    whatEn: 'Search ads on "sell pharmacy" and "pharmacy valuation" terms, landing page with a valuation calculator.',
    setupEur: 2500,
    monthlyEur: 1000,
    monthsToFirstLead: 0.5,
    leadsPerYear: 60,
    leadToMandate: 0.06,
    riskDe: 'Suchvolumen ist klein; viele Kontakte sind Neugierige. CPC für diese Begriffe ist nicht gemessen.',
    riskEn: 'Search volume is small; many leads are curious, not sellers. CPC for these terms is unmeasured.',
  },
  {
    id: 'field',
    side: 'sell',
    nameDe: 'Besuche und Anrufe (Außendienst)',
    nameEn: 'Visits and calls (field sales)',
    whatDe: 'Eine Person, die Apotheken abfährt und anruft. Anrufe brauchen eine Rechtsgrundlage, E-Mail nicht ohne Einwilligung.',
    whatEn: 'One person visiting and phoning pharmacies. Calls need a legal basis; e-mail needs consent.',
    setupEur: 3000,
    monthlyEur: 3900,
    monthsToFirstLead: 2,
    leadsPerYear: 120,
    leadToMandate: 0.08,
    riskDe: 'Höchste Fixkosten; Ergebnis hängt an der Person. Kalt-Anrufe bei Apothekern sind ein Vertrauensrisiko.',
    riskEn: 'Highest fixed cost; result depends on the person. Cold calls to pharmacists risk trust.',
  },
  {
    id: 'seo',
    side: 'sell',
    nameDe: 'SEO und Inhalte',
    nameEn: 'SEO and content',
    whatDe: 'Ratgeber zu Bewertung, Steuern, Ablauf je Autonomer Gemeinschaft, dazu ein Bewertungsrechner als Köder.',
    whatEn: 'Guides on valuation, tax and process per autonomous community, plus a valuation calculator as bait.',
    setupEur: 8000,
    monthlyEur: 1200,
    monthsToFirstLead: 5,
    leadsPerYear: 24,
    leadToMandate: 0.12,
    riskDe: 'Etablierte Vermittler besetzen die Suchbegriffe seit Jahren. Langsam, aber die Leads sind warm.',
    riskEn: 'Established brokers have held these search terms for years. Slow, but leads are warm.',
  },
  {
    id: 'referral',
    side: 'sell',
    nameDe: 'Empfehler: Steuerberater, Anwälte, Banken',
    nameEn: 'Referral partners: tax advisers, lawyers, banks',
    whatDe: 'Fachleute, die den Verkaufswunsch früh hören, bekommen 15 % der Provision bei Abschluss.',
    whatEn: 'Professionals who hear about a sale early get 15 % of the fee on closing.',
    setupEur: 4000,
    monthlyEur: 700,
    monthsToFirstLead: 8,
    leadsPerYear: 10,
    leadToMandate: 0.3,
    successFeeShare: 0.15,
    riskDe: 'Langsamster Start. Großhändler und Banken haben eigene Interessen (Finanzierung, Belieferung).',
    riskEn: 'Slowest start. Wholesalers and banks have their own interests (financing, supply).',
  },
  {
    id: 'press',
    side: 'sell',
    nameDe: 'Fachpresse und Messe',
    nameEn: 'Trade press and fair',
    whatDe: 'Anzeigen in Apothekenmedien und ein Stand auf der Infarma (Madrid, Ifema). Tarife nur auf Anfrage.',
    whatEn: 'Ads in pharmacy media and a stand at Infarma (Madrid, Ifema). Rates only on request.',
    setupEur: 3000,
    monthlyEur: 1600,
    monthsToFirstLead: 3,
    leadsPerYear: 30,
    leadToMandate: 0.08,
    riskDe: 'Streuverlust; Marke statt Abschluss. Die Infarma 2026 war im März, der nächste Termin ist nicht geprüft.',
    riskEn: 'Wasted reach; brand rather than closings. Infarma 2026 was in March; the next date is unchecked.',
  },
  {
    id: 'buyers',
    side: 'buy',
    nameDe: 'Käuferseite: Liste qualifizierter Käufer',
    nameEn: 'Buy side: list of qualified buyers',
    whatDe: 'LinkedIn-Anzeigen an angestellte Apotheker, Finanzierungsvorprüfung. Bringt keine Provision allein, aber schließt Aufträge ab.',
    whatEn: 'LinkedIn ads to employed pharmacists, financing pre-check. Earns no fee alone, but closes mandates.',
    setupEur: 2000,
    monthlyEur: 800,
    monthsToFirstLead: 1,
    leadsPerYear: 150,
    leadToMandate: 0,
    riskDe: 'Nicht der Engpass: Nachfrage übersteigt das Angebot. Wettbewerber nennen schon 1.000 bis 22.000 Käufer.',
    riskEn: 'Not the bottleneck: demand exceeds supply. Competitors already claim 1,000 to 22,000 buyers.',
  },
];

export interface ApproachResult {
  approach: PharmaApproach;
  mandatesPerYear: number;
  closingsPerYear: number;
  feesPerYear: number;
  opexPerYear: number;
  /** Provision minus laufende Kosten, eingeschwungen. */
  steadyNetPerYear: number;
  /** Erster Provisionseingang in Monaten seit Start. */
  monthsToFirstFee: number | null;
  /** Ergebnis über 24 Monate inklusive Vorlauf, in Euro. */
  net24m: number;
  cost24m: number;
  /** null bei Käuferseite, die keine eigene Provision erzeugt. */
  roi24m: number | null;
  /** Monat, in dem die kumulierte Provision die kumulierten Kosten deckt. */
  paybackMonth: number | null;
}

const HORIZON_MONTHS = 60;

export function computeApproach(
  approach: PharmaApproach,
  a: PharmaAssumptions = BASE_ASSUMPTIONS,
): ApproachResult {
  const mandatesPerYear = approach.leadsPerYear * approach.leadToMandate;
  const closingsPerYear = mandatesPerYear * a.mandateToClose;
  const feePerClosing = a.dealPriceEur * a.feePct;
  const feesPerYear = closingsPerYear * feePerClosing;
  const successCostPerYear = feesPerYear * (approach.successFeeShare ?? 0);
  const opexPerYear = approach.monthlyEur * 12 + successCostPerYear;
  const steadyNetPerYear = feesPerYear - opexPerYear;

  if (closingsPerYear === 0) {
    const cost24m = approach.setupEur + approach.monthlyEur * 24;
    return {
      approach,
      mandatesPerYear,
      closingsPerYear,
      feesPerYear,
      opexPerYear,
      steadyNetPerYear,
      monthsToFirstFee: null,
      net24m: -cost24m,
      cost24m,
      roi24m: null,
      paybackMonth: null,
    };
  }

  // Erste Provision: Vorlauf bis zum Kontakt, ein Monat bis zum Auftrag, dann die Abwicklung.
  const monthsToFirstFee = approach.monthsToFirstLead + 1 + a.monthsMandateToClose;
  const closingsPerMonth = closingsPerYear / 12;
  const share = approach.successFeeShare ?? 0;

  let cumFee = 0;
  let cumCost = approach.setupEur;
  let paybackMonth: number | null = null;
  let net24m = 0;
  let cost24m = 0;
  for (let m = 1; m <= HORIZON_MONTHS; m++) {
    const activeFraction = Math.max(0, Math.min(1, m - monthsToFirstFee));
    const fee = closingsPerMonth * feePerClosing * activeFraction;
    cumFee += fee;
    cumCost += approach.monthlyEur + fee * share;
    if (paybackMonth === null && cumFee >= cumCost) paybackMonth = m;
    if (m === 24) {
      net24m = cumFee - cumCost;
      cost24m = cumCost;
    }
  }

  return {
    approach,
    mandatesPerYear,
    closingsPerYear,
    feesPerYear,
    opexPerYear,
    steadyNetPerYear,
    monthsToFirstFee,
    net24m,
    cost24m,
    roi24m: cost24m > 0 ? net24m / cost24m : null,
    paybackMonth,
  };
}

/** Kumulierter Kassenstand je Monat 0..months (Investition am Start, dann Provision minus Kosten). */
export function cashCurve(
  approach: PharmaApproach,
  a: PharmaAssumptions = BASE_ASSUMPTIONS,
  months = 36,
): number[] {
  const closingsPerMonth = (approach.leadsPerYear * approach.leadToMandate * a.mandateToClose) / 12;
  const feePerClosing = a.dealPriceEur * a.feePct;
  const share = approach.successFeeShare ?? 0;
  const monthsToFirstFee = approach.monthsToFirstLead + 1 + a.monthsMandateToClose;
  const out = [-approach.setupEur];
  let cum = -approach.setupEur;
  for (let m = 1; m <= months; m++) {
    const activeFraction = Math.max(0, Math.min(1, m - monthsToFirstFee));
    const fee = closingsPerMonth * feePerClosing * activeFraction;
    cum += fee * (1 - share) - approach.monthlyEur;
    out.push(cum);
  }
  return out;
}

export function computeAll(a: PharmaAssumptions = BASE_ASSUMPTIONS): ApproachResult[] {
  return APPROACHES.map((ap) => computeApproach(ap, a));
}

// ── Belegte Marktdaten (Suchschnipsel, Stand 30.09.2026) ─────────────────────

export interface PharmaFact {
  de: string;
  en: string;
  sourceId: string;
}

export const PHARMA_FACTS: PharmaFact[] = [
  {
    de: '22.311 Apotheken in Spanien (2024).',
    en: '22,311 pharmacies in Spain (2024).',
    sourceId: 'gomez-cuantas',
  },
  {
    de: 'Nur Apotheker dürfen Apotheken besitzen; ein Inhaber je Offizin. Die Übertragung regeln die Autonomen Gemeinschaften (Andalusien: mindestens fünf Jahre Betrieb).',
    en: 'Only pharmacists may own a pharmacy; one owner per pharmacy. Transfers are regulated by the autonomous communities (Andalusia: at least five years of operation).',
    sourceId: 'boe-16-1997',
  },
  {
    de: 'Andalusien: 120 Verkäufe 2024 gegenüber 148 in 2023 (−19 %); davon 28 Teilübertragungen. Übertragungen durch Erbe oder Schenkung stiegen von 47 auf 67.',
    en: 'Andalusia: 120 sales in 2024 versus 148 in 2023 (−19 %); 28 of them partial transfers. Transfers by inheritance or gift rose from 47 to 67.',
    sourceId: 'imfarmacias',
  },
  {
    de: 'Durchschnittsalter der Kolleg:innen 50,2 Jahre; 12,3 % sind über 70. 46 % der Apotheker in der Offizin sind Inhaber.',
    en: 'Average age of registered pharmacists is 50.2; 12.3 % are over 70. 46 % of community pharmacists are owners.',
    sourceId: 'elglobalfarma',
  },
  {
    de: 'Preis nach Umsatzfaktor, meist 0,8 bis 1,5 Jahresumsätze oder 4 bis 7 EBITDA. Der Durchschnittsumsatz lag 2024 bei 1,12 Mio. €.',
    en: 'Price by sales multiple, usually 0.8 to 1.5 annual sales or 4 to 7 EBITDA. Average turnover was €1.12 m in 2024.',
    sourceId: 'capittal',
  },
  {
    de: 'Vermittlerprovision laut einem Konkurrenzportal 3 bis 5 % je Seite; Quelle ist interessiert, Angaben der Vermittler selbst fehlen.',
    en: 'Broker commission is 3 to 5 % per side according to a competing portal; that source is not neutral, and brokers publish no rates.',
    sourceId: 'comprarfarmacia',
  },
  {
    de: 'Dauer der Übertragung 6 Monate bis 1 Jahr; kurze Angaben nennen 8 bis 16 Wochen ab Preiseinigung.',
    en: 'A transfer takes 6 months to 1 year; shorter claims say 8 to 16 weeks after price agreement.',
    sourceId: 'traspasos',
  },
  {
    de: '17 Vermittler in einer Liste; Farmaconsulting nennt 80 Mitarbeitende und 22.000 bekannte Käufer.',
    en: '17 brokers on one list; Farmaconsulting claims 80 staff and 22,000 known buyers.',
    sourceId: 'farmaconsulting',
  },
  {
    de: 'Unaufgeforderte Werbe-E-Mails sind nach LSSI Art. 21 ohne Einwilligung verboten, auch B2B. Für Anrufe kann berechtigtes Interesse tragen.',
    en: 'Unsolicited advertising e-mail is banned by LSSI Art. 21 without consent, B2B included. For calls, legitimate interest can be a basis.',
    sourceId: 'lssi',
  },
  {
    de: 'LinkedIn-Kosten je Lead in Spanien B2B: 25 bis 100 €, üblich 40 bis 80 €.',
    en: 'LinkedIn cost per lead in Spain B2B: €25 to 100, typically €40 to 80.',
    sourceId: 'linkedin-cpl',
  },
];

export interface PharmaSource {
  id: string;
  title: string;
  url: string;
}

export const PHARMA_SOURCES: PharmaSource[] = [
  { id: 'gomez-cuantas', title: 'Gómez Córdoba: ¿Cuántas farmacias hay en España?', url: 'https://gomezcordoba.com/cuantas-farmacias-hay-espana/' },
  { id: 'boe-16-1997', title: 'BOE: Ley 16/1997 de servicios de las oficinas de farmacia', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1997-9022' },
  { id: 'imfarmacias', title: 'IM Farmacias: compraventas de farmacias en Andalucía 2024', url: 'https://www.imfarmacias.es/noticia/37980/andalucia-registra-un-menor-numero-de-compraventas-de-farmacias-en-2.html' },
  { id: 'elglobalfarma', title: 'El Global: Radiografía de la profesión farmacéutica 2025', url: 'https://elglobalfarma.com/farmacia/radiografia-profesion-farmaceutica-2025-colegiados-estabiliza-empleo/' },
  { id: 'capittal', title: 'Capittal: Cuánto vale una farmacia en España', url: 'https://capittal.es/recursos/blog/cuanto-vale-una-farmacia' },
  { id: 'comprarfarmacia', title: 'ComprarFarmacia.es: Listado de intermediarios', url: 'https://www.comprarfarmacia.es/intermediarios/' },
  { id: 'traspasos', title: 'Gómez Córdoba: Traspasos de farmacias', url: 'https://gomezcordoba.com/traspasos-de-farmacia/' },
  { id: 'farmaconsulting', title: 'Farmaconsulting', url: 'https://www.farmaconsulting.es/' },
  { id: 'lssi', title: 'BOE: Ley 34/2002 (LSSI), Art. 21', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758' },
  { id: 'linkedin-cpl', title: 'Growth LinkedIn: LinkedIn Ads en España', url: 'https://growthlinkedin.com/agencia-linkedin-ads/' },
];

// ── 90-Tage-Test: misst die Konversionsraten, die alles andere tragen ────────

export interface PharmaTestStep {
  de: string;
  en: string;
  budgetEur: number;
}

export const PHARMA_TEST_PLAN: PharmaTestStep[] = [
  { de: '500 Briefe an Titulare mit langer Betriebszeit; Rücklauf zählen.', en: '500 letters to owners of long-established pharmacies; count replies.', budgetEur: 650 },
  { de: 'Landingpage mit Bewertungsrechner und drei Monate Google Ads.', en: 'Landing page with a valuation calculator and three months of Google Ads.', budgetEur: 3500 },
  { de: '15 Gespräche mit Steuerberatern und Anwälten für Apotheken.', en: '15 conversations with tax advisers and lawyers serving pharmacies.', budgetEur: 500 },
  { de: '10 Gespräche mit Inhabern, die nicht verkaufen wollen: Warum nicht, wem würden sie vertrauen?', en: '10 conversations with owners who do not want to sell: why not, and whom would they trust?', budgetEur: 0 },
];

export const PHARMA_TEST_STOP_DE =
  'Stopp, wenn nach 90 Tagen weniger als fünf ernsthafte Verkaufsgespräche und kein unterschriebener Auftrag vorliegen.';
export const PHARMA_TEST_STOP_EN =
  'Stop if after 90 days there are fewer than five serious seller conversations and no signed mandate.';

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
  /** Das Lab (Mark, 30.09.2026) hat die Seite geholt und die Aussage dort gefunden. */
  labChecked?: boolean;
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
  {
    de: 'Ein Apothekenverkauf ist kein gewöhnlicher Unternehmensverkauf: Regionales Recht, Anforderungen an den Inhaber und behördliche Genehmigungen kommen hinzu.',
    en: 'Selling a pharmacy is not a conventional business sale: regional regulation, ownership requirements and administrative authorisations add to it.',
    sourceId: 'blue-mountain',
    labChecked: true,
  },
  {
    de: 'Die Übertragung berührt Verwaltungs-, Regulierungs-, Steuer-, Arbeits- und Vermögensfragen zugleich.',
    en: 'A transfer touches administrative, regulatory, tax, labour and asset questions at once.',
    sourceId: 'in-diem',
    labChecked: true,
  },
  {
    de: 'Ein allgemeiner Unternehmensmakler in Spanien nennt 5 bis 10 % Erfolgshonorar. Das ist kein Apothekentarif; die Spanne 1 bis 10 % für Makler allgemein hat das Lab auf der Seite nicht nachgeprüft.',
    en: 'One general business broker in Spain states a success fee of 5 to 10 %. That is not a pharmacy rate; the lab did not verify the general 1 to 10 % range on the page.',
    sourceId: 'smergers',
    labChecked: true,
  },
  {
    de: 'Apothekenmarkt Spanien (Umsatz der Apotheken): 20,05 Mrd. USD in 2022, Prognose 31,70 Mrd. USD bis 2030. Das misst den Verkauf in Apotheken, nicht den Verkauf von Apotheken.',
    en: 'Spanish retail pharmacy market (pharmacy sales): USD 20.05 bn in 2022, forecast USD 31.70 bn by 2030. This measures sales in pharmacies, not sales of pharmacies.',
    sourceId: 'insights10',
    labChecked: true,
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
  { id: 'blue-mountain', title: 'Blue Mountain: Sell a pharmacy business', url: 'https://blue-mountain.es/en/insights/sell-pharmacy-business/' },
  { id: 'in-diem', title: 'In Diem: Pharmacy purchase and sale', url: 'https://www.in-diem.com/en/lawyers-for-pharmacies/pharmacy-purchase-and-sale/' },
  { id: 'smergers', title: 'Smergers: Business brokers in Spain', url: 'https://www.smergers.com/business-brokers-in-spain/c170m15i/' },
  { id: 'insights10', title: 'Insights10: Spain retail pharmacy market analysis', url: 'https://www.insights10.com/report/spain-retail-pharmacy-market-analysis/' },
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

// ── Zweiter Lauf: Amélie-lab, Agent Mark (30.09.2026) ───────────────────────
//
// Dieselbe Frage lief im Schwesterprojekt. Mark verglich keine Akquisewege,
// sondern vier Geschäftsmodelle. Zeit, Kosten und ROI je Modell lieferte der
// Lauf nicht (die Felder kamen erst danach); die Zahlen oben bleiben die
// einzigen. Alles hier ist ein Vorschlag des Labs, gegen das Modell gelesen.

export interface Tri {
  de: string;
  en: string;
  es: string;
}

export interface LabModel {
  id: string;
  status: 'shortlist' | 'killed';
  /** Eigenes Geschäft des Vermittlers oder Produkt für Dritte. */
  operator: 'actor' | 'third';
  name: Tri;
  note: Tri;
  /** Nur bei verworfenen Modellen: was sich ändern müsste, damit es wieder aufgeht. */
  reopen?: Tri;
}

export const PHARMA_LAB_RUN = {
  runId: 'mark-20260930T144720-a8c5ef',
  date: '2026-09-30',
  model: 'gemini-2.5-flash',
  searches: 21,
  /** Seitenabgleich der 16 Tatsachenbehauptungen des Laufs. */
  factChecks: { supported: 8, partial: 5, unsupported: 1, unchecked: 2 },
};

export const PHARMA_LAB_MODELS: LabModel[] = [
  {
    id: 'V1',
    status: 'shortlist',
    operator: 'actor',
    name: {
      de: 'Vermittlung als eigene Dienstleistung',
      en: 'Brokerage as the broker’s own service',
      es: 'Intermediación como servicio propio',
    },
    note: {
      de: 'Erstgespräch, Wertschätzung, Begleitung durch die Genehmigung, Käufer und Verkäufer zusammenbringen. Das Lab schlägt 3 bis 7 % Erfolgsprovision und 3 bis 6 Monate bis zum ersten Kunden vor.',
      en: 'First consultation, valuation estimate, guidance through authorisation, matching buyers and sellers. The lab proposes a 3 to 7 % success fee and 3 to 6 months to the first client.',
      es: 'Primera consulta, estimación de valor, acompañamiento en la autorización y encaje entre comprador y vendedor. El Lab propone una comisión de éxito del 3 al 7 % y de 3 a 6 meses hasta el primer cliente.',
    },
  },
  {
    id: 'V4',
    status: 'shortlist',
    operator: 'third',
    name: {
      de: 'Bezahlter Leitfaden zum Übertragungsrecht je Autonomer Gemeinschaft',
      en: 'Paid guide to transfer rules per autonomous community',
      es: 'Guía de pago sobre la normativa de transmisión por comunidad autónoma',
    },
    note: {
      de: 'Checklisten, Unterlagen und zuständige Stellen je Region, als Abo oder Einmalkauf. 3 bis 6 Monate juristische Vorarbeit. Kanzleien geben diesen Rat schon; Nachfrage und Preis sind nicht gemessen.',
      en: 'Checklists, documents and competent bodies per region, as a subscription or one-off purchase. 3 to 6 months of legal groundwork. Law firms already give this advice; demand and price are unmeasured.',
      es: 'Listas de comprobación, documentación y organismos competentes por región, por suscripción o pago único. De 3 a 6 meses de trabajo jurídico previo. Los despachos ya dan este consejo; la demanda y el precio no están medidos.',
    },
  },
  {
    id: 'V2',
    status: 'killed',
    operator: 'third',
    name: {
      de: 'SaaS-Plattform für andere Vermittler',
      en: 'SaaS platform for other brokers',
      es: 'Plataforma SaaS para otros intermediarios',
    },
    note: {
      de: 'Verworfen: viel Entwicklung, kleiner Markt, allgemeine Projektwerkzeuge reichen den Vermittlern.',
      en: 'Killed: heavy development, a small market, and generic project tools are good enough for brokers.',
      es: 'Descartado: mucho desarrollo, un mercado pequeño y a los intermediarios les bastan herramientas genéricas de gestión.',
    },
    reopen: {
      de: 'Wieder offen, wenn Vermittler selbst sagen, dass ihnen allgemeine Werkzeuge nicht reichen.',
      en: 'Reopens if brokers themselves say generic tools are not enough for them.',
      es: 'Se reabre si los propios intermediarios dicen que las herramientas genéricas no les bastan.',
    },
  },
  {
    id: 'V3',
    status: 'killed',
    operator: 'third',
    name: {
      de: 'Datenprodukt: Marktdaten und Bewertung',
      en: 'Data product: market intelligence and valuation',
      es: 'Producto de datos: mercado y valoración',
    },
    note: {
      de: 'Verworfen: Vergleichspreise echter Verkäufe bekommt nur, wer selbst vermittelt; dazu Datenpflege und DSGVO.',
      en: 'Killed: comparable prices of real sales are only available to someone who brokers deals; add data upkeep and GDPR.',
      es: 'Descartado: los precios comparables de ventas reales solo los tiene quien intermedia; a eso se suman el mantenimiento de los datos y el RGPD.',
    },
    reopen: {
      de: 'Wieder offen, sobald das eigene Vermittlungsgeschäft Abschlüsse hat: Dann gehören die Vergleichspreise einem selbst.',
      en: 'Reopens once the broker’s own business has closed deals: then the comparable prices are its own.',
      es: 'Se reabre cuando el propio negocio de intermediación tenga cierres: entonces los precios comparables son suyos.',
    },
  },
];

/** Wo der Lab-Lauf das Modell oben bestätigt, ergänzt oder ihm widerspricht. */
export const PHARMA_LAB_CONTRAST: Tri[] = [
  {
    de: 'Das Urteil hält: eigenes Dienstleistungsgeschäft ja, Software für Dritte nein. Das verworfene Datenprodukt ist dieselbe Grenze wie beim Nachfolge-Radar, der nur intern als Hebel der Briefe taugt.',
    en: 'The verdict holds: own services business yes, software for third parties no. The killed data product marks the same limit as the succession radar, which only works internally as a lever for the letters.',
    es: 'El veredicto se mantiene: negocio de servicios propio sí, software para terceros no. El producto de datos descartado marca el mismo límite que el radar de sucesión, que solo sirve por dentro como multiplicador de las cartas.',
  },
  {
    de: 'Provision: Die 3 bis 7 % des Labs stammen aus allgemeinen Maklertarifen, nicht aus Apothekenverkäufen. Das Modell bleibt bei 3 % einer Seite; der Regler reicht jetzt bis 7 %.',
    en: 'Fee: the lab’s 3 to 7 % comes from general brokerage rates, not from pharmacy sales. The model stays at 3 % of one side; the slider now goes up to 7 %.',
    es: 'Comisión: el 3 al 7 % del Lab viene de tarifas de intermediarios generales, no de ventas de farmacias. El modelo sigue en el 3 % de una parte; el control llega ahora hasta el 7 %.',
  },
  {
    de: 'Zeit: 3 bis 6 Monate bis zum ersten Kunden passen zum ersten Auftrag im Modell (je nach Weg 2 bis 9 Monate). Die Provision kommt acht Monate später; kein Weg zahlt vor Monat 10.',
    en: 'Time: 3 to 6 months to the first client fits the first mandate in the model (2 to 9 months depending on the channel). The fee arrives eight months later; no channel pays before month 10.',
    es: 'Tiempo: de 3 a 6 meses hasta el primer cliente encaja con el primer mandato del modelo (de 2 a 9 meses según la vía). La comisión llega ocho meses después; ninguna vía cobra antes del mes 10.',
  },
  {
    de: 'Umsatzziel: 100.000 bis 200.000 € im ersten Jahr wären bei 30.000 € je Abschluss drei bis sieben bezahlte Abschlüsse. Das Modell kommt im ersten Jahr auf keinen ganzen. Das Ziel ist nicht gedeckt.',
    en: 'Revenue target: €100,000 to 200,000 in year one would be three to seven paid closings at €30,000 each. The model does not reach a full one in year one. The target is unsupported.',
    es: 'Objetivo de ingresos: de 100.000 a 200.000 € el primer año serían de tres a siete cierres cobrados a 30.000 € cada uno. El modelo no llega a uno entero en el primer año. El objetivo no tiene respaldo.',
  },
  {
    de: 'Neu: Der Leitfaden je Region ist im Modell nur kostenloser Köder (SEO). Ob jemand dafür zahlt, lässt sich in den 15 Gesprächen mit Steuerberatern und Anwälten mitfragen.',
    en: 'New: in the model the regional guide is only free bait (SEO). Whether anyone would pay for it can be asked in the 15 conversations with tax advisers and lawyers.',
    es: 'Nuevo: en el modelo la guía por comunidad es solo un cebo gratuito (SEO). Si alguien pagaría por ella se puede preguntar en las 15 conversaciones con gestores y abogados.',
  },
];

/** Was der Lab-Lauf offen lässt und ein weiterer Lauf oder der 90-Tage-Test beantworten würde. */
export const PHARMA_LAB_NEXT: Tri[] = [
  {
    de: 'Was kostet jedes der vier Modelle, wann zahlt es und was bringt es? Das Lab hat inzwischen Felder für Zeit, Investition, laufende Kosten und ROI je Modell; in diesem Lauf blieben sie leer.',
    en: 'What does each of the four models cost, when does it pay and what does it return? The lab now has fields for time, investment, running costs and ROI per model; in this run they stayed empty.',
    es: '¿Cuánto cuesta cada uno de los cuatro modelos, cuándo cobra y qué devuelve? El Lab ya tiene campos de tiempo, inversión, costes recurrentes y ROI por modelo; en este análisis quedaron vacíos.',
  },
  {
    de: 'Wie viele Apotheken wechseln in ganz Spanien pro Jahr den Inhaber? Bekannt ist nur Andalusien (120 Verkäufe 2024).',
    en: 'How many pharmacies change owner per year across Spain? Only Andalusia is known (120 sales in 2024).',
    es: '¿Cuántas farmacias cambian de titular al año en toda España? Solo se conoce Andalucía (120 ventas en 2024).',
  },
  {
    de: 'Was nehmen Apothekenvermittler wirklich? Keiner veröffentlicht Tarife; beide Analysen arbeiten mit Näherungen.',
    en: 'What do pharmacy brokers really charge? None publishes rates; both analyses work with proxies.',
    es: '¿Qué cobran de verdad los intermediarios de farmacias? Ninguno publica tarifas; los dos análisis trabajan con aproximaciones.',
  },
  {
    de: 'Würde jemand für den Leitfaden je Region zahlen, und wie viel?',
    en: 'Would anyone pay for the regional guide, and how much?',
    es: '¿Pagaría alguien por la guía por comunidad autónoma, y cuánto?',
  },
  {
    de: 'Wie viele Inhaber antworten auf einen Brief? An dieser einen Zahl hängt das ganze Modell; 500 Briefe messen sie.',
    en: 'How many owners reply to a letter? The whole model hangs on this one number; 500 letters measure it.',
    es: '¿Cuántos titulares responden a una carta? De esa cifra depende todo el modelo; 500 cartas la miden.',
  },
];

/** Abbruchkriterien des Labs für das Vermittlungsgeschäft, mit Anmerkung. */
export const PHARMA_LAB_KILL: Tri[] = [
  {
    de: 'Keine Transaktion in den ersten neun Monaten. Bei acht Monaten Abwicklung träfe das fast jeden Weg vor der ersten Provision; sinnvoller ist: kein unterschriebener Auftrag nach neun Monaten.',
    en: 'No transaction in the first nine months. With eight months of processing this would hit almost every channel before its first fee; more useful: no signed mandate after nine months.',
    es: 'Ninguna operación en los primeros nueve meses. Con ocho meses de tramitación, eso alcanzaría a casi todas las vías antes de su primera comisión; es más útil: ningún mandato firmado a los nueve meses.',
  },
  {
    de: 'Eine Gesetzesänderung, die Ketten zulässt oder die Übertragung stark vereinfacht.',
    en: 'A change in the law that allows chains or greatly simplifies transfers.',
    es: 'Un cambio legal que permita cadenas o simplifique mucho la transmisión.',
  },
  {
    de: 'Keine erkennbare Abgrenzung von den etablierten Vermittlern.',
    en: 'No visible difference from the established brokers.',
    es: 'Ninguna diferencia visible frente a los intermediarios establecidos.',
  },
];

export interface LabName {
  name: string;
  url: string;
}

/** Kanzleien und Berater, die das Lab als direkte Konkurrenz führt. */
export const PHARMA_LAB_FIRMS: LabName[] = [
  { name: 'Marvin Abogados', url: 'https://marvinabogados.com/blog/traspaso-farmacia/' },
  { name: 'Gómez Córdoba', url: 'https://gomezcordoba.com/aspectos-legales-traspasos-farmacia/' },
  { name: 'Traspasso', url: 'https://traspasso.com/es/blog/articulo/como-traspasar-farmacia' },
  { name: 'Asefarma', url: 'https://www.asefarma.com/blog-farmacia/requisitos-traslado-farmacia' },
];

/** Vermittler und Portale aus den Suchtreffern des Labs (nicht einzeln geprüft). */
export const PHARMA_LAB_PORTALS: LabName[] = [
  { name: 'Profarma', url: 'https://profarma.es/' },
  { name: 'Urbagesa', url: 'https://www.comprar-farmacias-urbagesa.es/' },
  { name: 'Traspasodefarmacias.com', url: 'https://traspasodefarmacias.com/' },
  { name: 'Farmatrading', url: 'https://farmatrading.es/farmacias-vendidas/' },
  { name: 'Ideafarma', url: 'https://www.ideafarma.com/farmacias-en-venta' },
  { name: 'Pfarma', url: 'https://pfarma.es/traspaso-de-farmacia-en-madrid/' },
  { name: 'Farcapital', url: 'https://farcapital.es/farmacias-a-la-venta/' },
];

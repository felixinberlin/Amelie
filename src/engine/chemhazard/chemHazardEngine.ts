/**
 * ChemHazard Stop / MischStop — Offline Chemical Mixing Interlock Engine
 * 
 * Safety Case Invariant:
 * The engine NEVER certifies safety. It only warns of detected danger,
 * or admits it cannot verify. No green screen, ever.
 * 
 * License: CC0-1.0 / AGPL-3.0
 */

export type ChemicalGroup =
  | 'acid'
  | 'hypochlorite'
  | 'ammonia'
  | 'peroxide'
  | 'oxidizer'
  | 'caustic_lye'
  | 'flammable'
  | 'organic_solvent'
  | 'neutral';

export type DataSourceLane = 'public_law' | 'licensed_wingis' | 'open_community';

export type ProductSourceType = 'sds' | 'ingredient_datasheet' | 'none';

export interface ProductRecord {
  id: string;
  name: string;
  brand: string;
  /** Alle Gebindegrößen; jede GTIN besteht die GS1-Prüfziffer. */
  gtins?: string[];
  /** Unique Formula Identifier vom Etikett. */
  ufi?: string;
  giscode?: string;
  chemicalGroups: ChemicalGroup[];
  hazardStatements: string[];
  casNumbers?: string[];
  ph?: { min?: number; max?: number };
  verified: boolean;
  dataLane: DataSourceLane;
  sourceType: ProductSourceType;
  provenance: {
    sourceDocument: string;
    sourceUrl?: string;
    sourceHost?: 'manufacturer' | 'retailer';
    revisionDate?: string;
    sha256?: string;
    verificationDate: string;
    gtinSource?: string;
    note?: string;
  };
  activeIngredients?: string;
  descriptionDe?: string;
  descriptionEn?: string;
  typicalUseDe?: string;
  typicalUseEn?: string;
}

export type HazardSeverity =
  | 'LETHAL_GAS'
  | 'TOXIC_VAPOR'
  | 'EXPLOSIVE_EXOTHERM'
  | 'SEVERE_CORROSION';

export interface IncompatibilityRule {
  id: string;
  requiredHazards: ChemicalGroup[];
  requiredStatements?: string[];
  severity: HazardSeverity;
  resultingHazardDe: string;
  resultingHazardEn: string;
  chemicalMechanism: string;
  audioShouts: Record<string, string>;
}

export type InterlockResultState =
  | 'STOP'
  | 'UNVERIFIED'
  | 'NO_KNOWN_INCOMPATIBILITY';

export type UIAlertColor = 'red' | 'amber' | 'grey';

export interface InterlockEvaluationResult {
  state: InterlockResultState;
  color: UIAlertColor;
  isClearance: false; // Absolute safety invariant: ALWAYS false
  triggeredRule?: IncompatibilityRule;
  audioAlert?: {
    language: string;
    text: string;
  };
  hapticPattern: number[]; // Array of vibration pulses in ms
  alarmStreamForced: boolean;
  messageDe: string;
  messageEn: string;
  disclaimerDe: string;
  disclaimerEn: string;
  unverifiedReason?: string;
  evaluationTimeMs: number;
}

const MANDATORY_DISCLAIMER_DE =
  'Keine bekannte gefährliche Kombination in unserer Datenbank. Dies ist keine Sicherheitsfreigabe. Nicht mischen, außer ausdrücklich vom Arbeitgeber angewiesen.';

const MANDATORY_DISCLAIMER_EN =
  'No known dangerous combination in our database. This is not a safety clearance. Do not mix unless instructed by your employer.';

const HAPTIC_STOP_PATTERN = [300, 100, 300, 100, 500];
const HAPTIC_UNVERIFIED_PATTERN = [150, 150, 150];
const HAPTIC_NEUTRAL_PATTERN = [50];

/**
 * Hard safety invariant assertion.
 * Guarantees at runtime that no code path can ever return a green or clearance state.
 */
export function assertSafetyInvariants(result: InterlockEvaluationResult): void {
  if (result.isClearance !== false) {
    throw new Error('SAFETY VIOLATION: Interlock must never grant safety clearance.');
  }
  if ((result.color as string) === 'green') {
    throw new Error('SAFETY VIOLATION: Green color is strictly forbidden in ChemHazard Stop.');
  }
  if ((result.state as string) === 'SAFE' || (result.state as string) === 'CLEAR') {
    throw new Error('SAFETY VIOLATION: Clearance state is strictly prohibited.');
  }
}

/** GS1 check digit for GTIN-8/12/13/14. */
export function isValidGtin(gtin: string): boolean {
  if (!/^(\d{8}|\d{12,14})$/.test(gtin)) return false;
  const digits = gtin.split('').map(Number);
  const check = digits.pop() as number;
  const sum = digits.reverse().reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}

/**
 * Reads the GTIN out of whatever a scanner returns: a bare EAN/GTIN, or a
 * GS1 Digital Link URI such as https://id.gs1.org/01/04031255000121.
 * Leading zeros are dropped so a GTIN-14 from a QR code matches the EAN-13 in the catalog.
 */
export function gtinFromScan(scan: string): string | null {
  const text = scan.trim();
  const link = text.match(/\/01\/(\d{8,14})(?:[/?#]|$)/);
  const digits = link ? link[1] : /^\d{8,14}$/.test(text) ? text : null;
  if (!digits || !isValidGtin(digits)) return null;
  return digits.replace(/^0+(?=\d{8,})/, '');
}

/** GS1 Digital Link URI for a GTIN (the payload of a GS1 QR code). */
export function gs1DigitalLink(gtin: string): string {
  return `https://id.gs1.org/01/${gtin.padStart(14, '0')}`;
}

/**
 * Finds a product in the catalog by ID, GTIN (bare or as GS1 Digital Link), UFI, or GISCODE.
 * A GISCODE names a product group, so it only resolves when exactly one catalog entry carries it.
 */
export function lookupProductByIdentifier(
  identifier: string,
  catalog: ProductRecord[]
): ProductRecord | null {
  if (!identifier || typeof identifier !== 'string') return null;
  const clean = identifier.trim().toLowerCase();
  const scanned = gtinFromScan(identifier);
  const sameGtin = (g: string) => g.replace(/^0+(?=\d{8,})/, '') === scanned;

  const direct = catalog.find(
    (p) =>
      p.id.toLowerCase() === clean ||
      (scanned !== null && (p.gtins ?? []).some(sameGtin)) ||
      (p.ufi && p.ufi.toLowerCase() === clean)
  );
  if (direct) return direct;

  const group = catalog.filter((p) => p.giscode && p.giscode.toLowerCase() === clean.replace(/\s/g, ''));
  return group.length === 1 ? group[0] : null;
}

/**
 * Core deterministic rule evaluation kernel.
 * 
 * Logic:
 * combined = hazards(A) ∪ hazards(B)
 * if rule.required ⊆ combined: return STOP
 * elif product_a.unknown or product_b.unknown: return UNVERIFIED
 * else: return NO_KNOWN_INCOMPATIBILITY (grey, never green)
 */
export function evaluateMixingInterlock(
  productA: ProductRecord | null | undefined,
  productB: ProductRecord | null | undefined,
  rules: IncompatibilityRule[],
  preferredLanguage = 'de'
): InterlockEvaluationResult {
  const startTime = performance.now();

  // 1. Missing or unverified products -> UNVERIFIED (amber)
  if (!productA || !productB) {
    const missing: string[] = [];
    if (!productA) missing.push('Produkt A');
    if (!productB) missing.push('Produkt B');

    const result: InterlockEvaluationResult = {
      state: 'UNVERIFIED',
      color: 'amber',
      isClearance: false,
      hapticPattern: HAPTIC_UNVERIFIED_PATTERN,
      alarmStreamForced: false,
      messageDe: `Prüfung unvollständig: ${missing.join(' und ')} nicht identifiziert.`,
      messageEn: `Check incomplete: ${missing.join(' and ')} not identified.`,
      disclaimerDe: MANDATORY_DISCLAIMER_DE,
      disclaimerEn: MANDATORY_DISCLAIMER_EN,
      unverifiedReason: `Unidentified input: ${missing.join(', ')}`,
      evaluationTimeMs: performance.now() - startTime
    };
    assertSafetyInvariants(result);
    return result;
  }

  // 2. Unverified records or incomplete data -> UNVERIFIED (amber)
  if (!productA.verified || !productB.verified) {
    const unverifiedNames = [
      !productA.verified ? productA.name : null,
      !productB.verified ? productB.name : null
    ]
      .filter(Boolean)
      .join(', ');

    const result: InterlockEvaluationResult = {
      state: 'UNVERIFIED',
      color: 'amber',
      isClearance: false,
      hapticPattern: HAPTIC_UNVERIFIED_PATTERN,
      alarmStreamForced: false,
      messageDe: `Datenbasis unvollständig für: ${unverifiedNames}. Keine Prüfung möglich.`,
      messageEn: `Data unverified for: ${unverifiedNames}. Verification impossible.`,
      disclaimerDe: MANDATORY_DISCLAIMER_DE,
      disclaimerEn: MANDATORY_DISCLAIMER_EN,
      unverifiedReason: 'Product record is marked unverified in database',
      evaluationTimeMs: performance.now() - startTime
    };
    assertSafetyInvariants(result);
    return result;
  }

  // 3. Combine hazard sets and statement sets
  const combinedHazards = new Set<ChemicalGroup>([
    ...productA.chemicalGroups,
    ...productB.chemicalGroups
  ]);

  const combinedStatements = new Set<string>([
    ...productA.hazardStatements,
    ...productB.hazardStatements
  ]);

  // 4. Check incompatibility rules
  for (const rule of rules) {
    const hasAllHazards = rule.requiredHazards.every((req) => combinedHazards.has(req));
    
    // Optional requirement on CLP statements (e.g. EUH031)
    let hasAllStatements = true;
    if (rule.requiredStatements && rule.requiredStatements.length > 0) {
      hasAllStatements = rule.requiredStatements.some((stmt) => combinedStatements.has(stmt));
    }

    if (hasAllHazards && hasAllStatements) {
      const audioText =
        rule.audioShouts[preferredLanguage] ||
        rule.audioShouts['en'] ||
        rule.audioShouts['de'];

      const result: InterlockEvaluationResult = {
        state: 'STOP',
        color: 'red',
        isClearance: false,
        triggeredRule: rule,
        audioAlert: {
          language: preferredLanguage,
          text: audioText
        },
        hapticPattern: HAPTIC_STOP_PATTERN,
        alarmStreamForced: true,
        messageDe: `STOPP! ${productA.name} und ${productB.name} dürfen NIEMALS gemischt werden! Gefahr: ${rule.resultingHazardDe}.`,
        messageEn: `STOP! Never mix ${productA.name} with ${productB.name}! Hazard: ${rule.resultingHazardEn}.`,
        disclaimerDe: MANDATORY_DISCLAIMER_DE,
        disclaimerEn: MANDATORY_DISCLAIMER_EN,
        evaluationTimeMs: performance.now() - startTime
      };
      assertSafetyInvariants(result);
      return result;
    }
  }

  // 5. No known rule triggered -> NO_KNOWN_INCOMPATIBILITY (grey, never green!)
  const result: InterlockEvaluationResult = {
    state: 'NO_KNOWN_INCOMPATIBILITY',
    color: 'grey',
    isClearance: false,
    hapticPattern: HAPTIC_NEUTRAL_PATTERN,
    alarmStreamForced: false,
    messageDe: `Keine bekannte Inkompatibilität zwischen „${productA.name}" und „${productB.name}" gefunden.`,
    messageEn: `No known incompatibility found between "${productA.name}" and "${productB.name}".`,
    disclaimerDe: MANDATORY_DISCLAIMER_DE,
    disclaimerEn: MANDATORY_DISCLAIMER_EN,
    evaluationTimeMs: performance.now() - startTime
  };
  assertSafetyInvariants(result);
  return result;
}

/**
 * End-to-end evaluation using string identifiers (IDs, GTINs, UFIs, or GISCODEs).
 */
export function evaluatePairByIdentifiers(
  idOrCodeA: string,
  idOrCodeB: string,
  catalog: ProductRecord[],
  rules: IncompatibilityRule[],
  preferredLanguage = 'de'
): InterlockEvaluationResult {
  const prodA = lookupProductByIdentifier(idOrCodeA, catalog);
  const prodB = lookupProductByIdentifier(idOrCodeB, catalog);
  return evaluateMixingInterlock(prodA, prodB, rules, preferredLanguage);
}

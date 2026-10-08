export type FlavorProfile = 'vanilla' | 'salted_caramel' | 'pistachio' | 'lavender';

export interface CrackBranch {
  toX: number;
  toY: number;
  width: number;
  alpha: number;
  curveOffset?: number;
}

export interface CrackNode {
  id: string;
  x: number;
  y: number;
  force: number;
  radius: number;
  depth: number;
  timestamp: number;
  branches: CrackBranch[];
}

export interface SecretQuote {
  id: string;
  de: string;
  en: string;
  es: string;
  author: string;
  xRatio: number; // -0.6 to +0.6 relative to center
  yRatio: number;
  icon: string;
  discovered: boolean;
}

export interface CaramelState {
  flavor: FlavorProfile;
  thickness: number; // in mm (e.g. 1.2 mm)
  crispness: number; // 0..1 scale
  cracks: CrackNode[];
  spoonTaps: number;
  satisfactionScore: number; // 0..100
  shatteredAreaRatio: number; // 0..1
  garnished: boolean;
  torchLevel: number; // 0..100
}

export interface AcousticCrackProfile {
  fundamentalFreq: number;
  resonanceQ: number;
  decayTime: number;
  noiseLevel: number;
  snapGain: number;
  detuneCents: number;
}

export const SECRET_QUOTES: SecretQuote[] = [
  {
    id: 'quote-glass-bones',
    de: '„Sie haben keine Knochen aus Glas. Sie können einen Stoß vertragen.“',
    en: '"You don\'t have bones of glass. You can take life\'s knocks."',
    es: '«Usted no tiene los huesos de cristal. Puede soportar los golpes de la vida.»',
    author: 'Raymond Dufayel',
    xRatio: -0.22,
    yRatio: -0.18,
    icon: '✨',
    discovered: false,
  },
  {
    id: 'quote-tour-de-france',
    de: '„Das Glück ist wie die Tour de France: Man wartet so lange darauf, und dann rast es vorbei.“',
    en: '"Luck is like the Tour de France: you wait all year, and it flashes by in a second."',
    es: '«La suerte es como el Tour de Francia: se espera tanto y pasa en un instante.»',
    author: 'Amélie Poulain',
    xRatio: 0.28,
    yRatio: 0.15,
    icon: '🚲',
    discovered: false,
  },
  {
    id: 'quote-little-things',
    de: '„Amélie mag es, die Kruste von Crème Brûlée mit der Spitze eines Teelöffels zu knacken.“',
    en: '"Amélie likes cracking the crust of crème brûlée with the tip of a teaspoon."',
    es: '«A Amélie le gusta romper la costra de la crème brûlée con la punta de una cucharilla.»',
    author: 'Le Narrateur',
    xRatio: 0.05,
    yRatio: -0.32,
    icon: '🥄',
    discovered: false,
  },
  {
    id: 'quote-skipping-stones',
    de: '„Steine über das Wasser des Canal Saint-Martin springen lassen.“',
    en: '"Skipping flat pebbles across the waters of Canal Saint-Martin."',
    es: '«Hacer rebotar piedras planas en el agua del Canal Saint-Martin.»',
    author: 'Amélie Poulain',
    xRatio: -0.3,
    yRatio: 0.28,
    icon: '🌊',
    discovered: false,
  },
];

export const FLAVOR_CONFIGS: Record<
  FlavorProfile,
  {
    nameDe: string;
    nameEn: string;
    nameEs: string;
    descriptionDe: string;
    descriptionEn: string;
    descriptionEs: string;
    crustColor: string;
    custardColor: string;
    rimColor: string;
    basePitch: number;
    accentColor: string;
    speckles: boolean;
  }
> = {
  vanilla: {
    nameDe: 'Bourbon-Vanille Traditionelle',
    nameEn: 'Traditional Bourbon Vanilla',
    nameEs: 'Vainilla Bourbon Tradicional',
    descriptionDe: 'Madagaskar-Vanillemark mit feiner, goldgelber Zuckerkruste.',
    descriptionEn: 'Bourbon vanilla beans with a golden-amber crunchy sugar glaze.',
    descriptionEs: 'Vaina de vainilla Bourbon con un crujiente glaseado de azúcar dorado.',
    crustColor: '#c87d20',
    custardColor: '#fae896',
    rimColor: '#d66838',
    basePitch: 840,
    accentColor: '#e08316',
    speckles: true,
  },
  salted_caramel: {
    nameDe: 'Karamell & Fleur de Sel de Guérande',
    nameEn: 'Salted Butter Caramel & Guérande Salt',
    nameEs: 'Caramelo a la Sal & Fleur de Sel',
    descriptionDe: 'Tiefdunkle, herbe Karamellkruste mit knusprigen Salzkristallen.',
    descriptionEn: 'Deep caramelized dark amber crust with crunchy fleur de sel crystals.',
    descriptionEs: 'Costra profunda de caramelo oscuro con cristales de sal marina crujiente.',
    crustColor: '#8f460a',
    custardColor: '#f1cb7d',
    rimColor: '#a84e1b',
    basePitch: 720,
    accentColor: '#96430b',
    speckles: false,
  },
  pistachio: {
    nameDe: 'Montmartre Pistazie & Orangenblüte',
    nameEn: 'Montmartre Pistachio & Orange Blossom',
    nameEs: 'Pistacho de Montmartre & Azahar',
    descriptionDe: 'Zarte Pistaziencreme mit blütenzarter, dünner Karamellschicht.',
    descriptionEn: 'Silky pistachio cream with a delicate crystalline caramel glaze.',
    descriptionEs: 'Cremosa crema de pistacho con un delicado glaseado de caramelo cristalino.',
    crustColor: '#a68222',
    custardColor: '#dbe8a7',
    rimColor: '#5c7329',
    basePitch: 980,
    accentColor: '#6e8532',
    speckles: true,
  },
  lavender: {
    nameDe: 'Provenzal Lavendel & Akazienhonig',
    nameEn: 'Provençal Lavender & Acacia Honey',
    nameEs: 'Lavanda Provenzal & Miel de Acacia',
    descriptionDe: 'Feines Lavendelaroma mit honigglänzender, krosser Kruste.',
    descriptionEn: 'Subtle floral lavender custard paired with crisp honey-crusted sugar.',
    descriptionEs: 'Aroma sutil de lavanda con costra crujiente de miel caramelizada.',
    crustColor: '#b06f3b',
    custardColor: '#f3e6ce',
    rimColor: '#7b5c87',
    basePitch: 910,
    accentColor: '#8a629b',
    speckles: true,
  },
};

export function createInitialCaramelState(flavor: FlavorProfile = 'vanilla'): CaramelState {
  return {
    flavor,
    thickness: 1.2,
    crispness: 0.95,
    cracks: [],
    spoonTaps: 0,
    satisfactionScore: 0,
    shatteredAreaRatio: 0,
    garnished: false,
    torchLevel: 75,
  };
}

/**
 * Procedurally generates realistic radial and branching fracture lines radiating from impact point.
 */
export function generateCrackPattern(
  originX: number,
  originY: number,
  force: number,
  existingCracksCount: number,
  ramekinRadius: number
): CrackNode {
  const branchCount = Math.max(3, Math.min(8, Math.round(3 + force * 4)));
  const crackLengthBase = Math.min(ramekinRadius * 0.7, 20 + force * 45);
  const branches: CrackBranch[] = [];

  const baseAngle = Math.random() * Math.PI * 2;

  for (let i = 0; i < branchCount; i++) {
    const angleSpread = (Math.PI * 2 * i) / branchCount + (Math.random() - 0.5) * 0.6;
    const currentAngle = baseAngle + angleSpread;
    const branchLength = crackLengthBase * (0.6 + Math.random() * 0.7);

    const endX = originX + Math.cos(currentAngle) * branchLength;
    const endY = originY + Math.sin(currentAngle) * branchLength;

    branches.push({
      toX: endX,
      toY: endY,
      width: Math.max(1, (1.8 + force * 1.5) * (1 - i * 0.08)),
      alpha: 0.75 + Math.random() * 0.25,
      curveOffset: (Math.random() - 0.5) * 8,
    });

    // Sub-forks for higher force impacts
    if (force > 0.45 && Math.random() > 0.3) {
      const subAngle = currentAngle + (Math.random() > 0.5 ? 0.45 : -0.45);
      const subLength = branchLength * (0.35 + Math.random() * 0.35);
      const midX = originX + Math.cos(currentAngle) * (branchLength * 0.5);
      const midY = originY + Math.sin(currentAngle) * (branchLength * 0.5);

      branches.push({
        toX: midX + Math.cos(subAngle) * subLength,
        toY: midY + Math.sin(subAngle) * subLength,
        width: 1.1,
        alpha: 0.6,
        curveOffset: (Math.random() - 0.5) * 4,
      });
    }
  }

  return {
    id: `crack-${Date.now()}-${existingCracksCount}`,
    x: originX,
    y: originY,
    force,
    radius: crackLengthBase,
    depth: Math.min(1.0, 0.3 + force * 0.7),
    timestamp: Date.now(),
    branches,
  };
}

/**
 * Computes acoustic synthesis parameters for pristine ASMR sugar-crack sound.
 */
export function calculateAcousticCrackProfile(
  force: number,
  thickness: number,
  flavor: FlavorProfile
): AcousticCrackProfile {
  const config = FLAVOR_CONFIGS[flavor];
  // Thicker crust -> lower, chunkier crack sound; lighter crust -> higher snap
  const thicknessFactor = Math.max(0.6, Math.min(2.0, thickness / 1.2));
  const fundamentalFreq = Math.round((config.basePitch / thicknessFactor) * (1 + (Math.random() - 0.5) * 0.08));

  return {
    fundamentalFreq,
    resonanceQ: 14 + force * 8,
    decayTime: Math.max(0.04, Math.min(0.28, 0.06 + force * 0.18)),
    noiseLevel: Math.min(0.9, 0.25 + force * 0.6),
    snapGain: Math.min(1.0, 0.35 + force * 0.65),
    detuneCents: Math.round((Math.random() - 0.5) * 120),
  };
}

/**
 * Evaluates whether a spoon strike uncovers a hidden poetic quote under the caramelized custard.
 */
export function evaluateSecretDiscovery(
  caramelState: CaramelState,
  secrets: SecretQuote[],
  clickX: number,
  clickY: number,
  ramekinRadius: number
): { newlyDiscovered: SecretQuote | null; updatedSecrets: SecretQuote[] } {
  const toleranceRadius = ramekinRadius * 0.28;
  let closestSecret: SecretQuote | null = null;
  let minDistance = Infinity;

  for (const secret of secrets) {
    if (secret.discovered) continue;
    const secretX = secret.xRatio * ramekinRadius;
    const secretY = secret.yRatio * ramekinRadius;
    const dist = Math.hypot(clickX - secretX, clickY - secretY);
    if (dist <= toleranceRadius && dist < minDistance) {
      minDistance = dist;
      closestSecret = secret;
    }
  }

  let newlyDiscovered: SecretQuote | null = null;
  const updatedSecrets = secrets.map((secret) => {
    if (closestSecret && secret.id === closestSecret.id) {
      newlyDiscovered = { ...secret, discovered: true };
      return newlyDiscovered;
    }
    return secret;
  });

  return { newlyDiscovered, updatedSecrets };
}

/**
 * Calculates current satisfaction score (0..100) based on crack coverage, rhythm, and secrets uncovered.
 */
export function calculateSatisfaction(
  spoonTaps: number,
  shatteredAreaRatio: number,
  secretsFound: number
): number {
  if (spoonTaps === 0) return 0;
  
  // High satisfaction comes from progressive cracking and discoveries
  const tapFactor = Math.min(40, spoonTaps * 4.5);
  const shatterFactor = Math.min(40, shatteredAreaRatio * 40);
  const secretFactor = secretsFound * 5; // up to 20 for 4 secrets

  return Math.min(100, Math.round(tapFactor * 0.4 + shatterFactor + secretFactor));
}

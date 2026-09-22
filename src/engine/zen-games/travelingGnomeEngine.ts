export interface GnomeCostumeConfig {
  hat: 'classic_red' | 'beret' | 'astronaut' | 'sombrero' | 'viking' | 'party';
  eyewear: 'none' | 'aviators' | 'pixel' | 'heart' | 'monocle';
  prop: 'baguette' | 'camera' | 'pretzel' | 'coconut' | 'selfie' | 'accordion';
  expression: 'grumpy' | 'wink' | 'shocked' | 'smug';
  tilt: number;
}

export interface GnomeDestinationConfig {
  id: string;
  nameDe: string;
  nameEn: string;
  cityDe: string;
  cityEn: string;
  flag: string;
  weatherDe: string;
  weatherEn: string;
  postcardLetterDe: string;
  postcardLetterEn: string;
}

export function generatePostcardSalutation(
  destination: GnomeDestinationConfig,
  costume: GnomeCostumeConfig,
  lang: 'de' | 'en' | 'es' = 'de'
): string {
  const baseLetter = lang === 'de' ? destination.postcardLetterDe : destination.postcardLetterEn;
  const propNote = costume.prop === 'baguette'
    ? (lang === 'de' ? '\n(P.S. Das Baguette schmeckt noch knuspriger als gestern.)' : '\n(P.S. The baguette is even crispier today.)')
    : costume.prop === 'camera'
    ? (lang === 'de' ? '\n(P.S. Ich mache ununterbrochen Schnappschüsse.)' : '\n(P.S. Taking photos of everything in sight.)')
    : '';

  return `${baseLetter}${propNote}`;
}

export function validateCostumeConfig(costume: Partial<GnomeCostumeConfig> | Record<string, unknown>): boolean {
  if (!costume || typeof costume !== 'object') return false;
  const validHats = ['classic_red', 'beret', 'astronaut', 'sombrero', 'viking', 'party'];
  const validEyewear = ['none', 'aviators', 'pixel', 'heart', 'monocle'];
  const validProps = ['baguette', 'camera', 'pretzel', 'coconut', 'selfie', 'accordion'];
  const validExpressions = ['grumpy', 'wink', 'shocked', 'smug'];

  const hat = costume.hat as string;
  const eyewear = costume.eyewear as string;
  const prop = costume.prop as string;
  const expression = costume.expression as string;
  const tilt = typeof costume.tilt === 'number' ? costume.tilt : NaN;

  return (
    validHats.includes(hat) &&
    validEyewear.includes(eyewear) &&
    validProps.includes(prop) &&
    validExpressions.includes(expression) &&
    !Number.isNaN(tilt) &&
    tilt >= -30 &&
    tilt <= 30
  );
}

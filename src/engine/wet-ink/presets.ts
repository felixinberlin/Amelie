import { WetInkPaperConfig, WetInkPigmentConfig } from './types';

export const PAPER_PRESETS: WetInkPaperConfig[] = [
  {
    id: 'washi',
    nameDe: 'Washi (Japanpapier / Kozo)',
    nameEn: 'Washi (Japanese Mulberry Paper)',
    nameEs: 'Washi (Papel japonés de morera)',
    descriptionDe: 'Lange ungeleimte Pflanzenfasern. Ausgeprägtes anisotropes Feathering entlang der Faserlaufrichtung.',
    descriptionEn: 'Long unsized plant fibers. Marked anisotropic feathering along the grain axis.',
    roughness: 0.35,
    fiberStrength: 0.88,
    fiberBaseAngle: Math.PI * 0.15, // slight tilt
    capacity: 0.92,
    evaporationMult: 1.1,
  },
  {
    id: 'aquarell-rau',
    nameDe: 'Aquarell Rau (Torreón 300g)',
    nameEn: 'Rough Watercolor (Torreón 300g)',
    nameEs: 'Acuarela rugosa (Torreón 300g)',
    descriptionDe: 'Ausgeprägte Papiertäler und -berge. Starke Granulation in den Vertiefungen und Dry-Brush-Skipping bei schnellen Strichen.',
    descriptionEn: 'Pronounced valleys and ridges. Strong granulation in hollows and dry-brush skipping on rapid strokes.',
    roughness: 0.82,
    fiberStrength: 0.30,
    fiberBaseAngle: 0,
    capacity: 0.80,
    evaporationMult: 0.9,
  },
  {
    id: 'buetten',
    nameDe: 'Büttenpapier (Handgeschöpft)',
    nameEn: 'Handmade Laid Rag Paper',
    nameEs: 'Papel tina artesanal',
    descriptionDe: 'Subtile Riffelung der Siebdrähte, mittlere Saugleistung mit feinem Randschliff.',
    descriptionEn: 'Subtle wire rib lines, medium absorbency with crisp micro-edges.',
    roughness: 0.55,
    fiberStrength: 0.55,
    fiberBaseAngle: Math.PI * 0.5,
    capacity: 0.75,
    evaporationMult: 1.0,
  },
  {
    id: 'kopierpapier',
    nameDe: 'Kopierpapier (80g geleimt)',
    nameEn: 'Sized Copy Paper (80g)',
    nameEs: 'Papel de copia estándar (80g)',
    descriptionDe: 'Stark oberflächengeleimt. Geringe Sauggeschwindigkeit, nahezu isotrope (kreisförmige) Ausbreitung.',
    descriptionEn: 'Heavy surface sizing. Low capillary absorption, isotropic circular spread.',
    roughness: 0.18,
    fiberStrength: 0.08,
    fiberBaseAngle: 0,
    capacity: 0.40,
    evaporationMult: 1.25,
  },
];

export const PIGMENT_PRESETS: WetInkPigmentConfig[] = [
  {
    id: 'sumi',
    nameDe: 'Sumi-e Rußtusche (Kiefernharz)',
    nameEn: 'Sumi-e Pine Soot Ink',
    nameEs: 'Tinta Sumi-e de hollín de pino',
    colorHex: '#181615',
    r: 24,
    g: 22,
    b: 21,
    density: 0.92,
    granulationFactor: 0.75,
    bleedSpeed: 0.85,
    edgeDarkening: 0.85,
    km: {
      K: [2.8, 2.7, 2.6], // Broad uniform absorption (black carbon soot)
      S: [0.15, 0.14, 0.13],
    },
  },
  {
    id: 'sepia',
    nameDe: 'Sepia Eisengallus-Tinte (18. Jh.)',
    nameEn: 'Sepia Iron Gall Ink (18th C.)',
    nameEs: 'Tinta de agallas de hierro sepia',
    colorHex: '#4a2c17',
    r: 74,
    g: 44,
    b: 23,
    density: 0.88,
    granulationFactor: 0.50,
    bleedSpeed: 0.95,
    edgeDarkening: 0.95,
    km: {
      K: [1.6, 2.4, 3.2], // Higher blue absorption gives warm sepia tone
      S: [0.22, 0.18, 0.12],
    },
  },
  {
    id: 'kadmiumgelb',
    nameDe: 'Kadmiumgelb Lasur (PY35)',
    nameEn: 'Cadmium Yellow Wash (PY35)',
    nameEs: 'Amarillo cadmio transparente',
    colorHex: '#e8b812',
    r: 232,
    g: 184,
    b: 18,
    density: 0.82,
    granulationFactor: 0.35,
    bleedSpeed: 1.10,
    edgeDarkening: 0.75,
    km: {
      K: [0.12, 0.35, 4.2], // Blocks blue strongly, lets red & green reflect
      S: [0.85, 0.78, 0.20],
    },
  },
  {
    id: 'preussischblau',
    nameDe: 'Preußischblau (PB27)',
    nameEn: 'Prussian Blue (PB27)',
    nameEs: 'Azul de Prusia puro',
    colorHex: '#0c356a',
    r: 12,
    g: 53,
    b: 106,
    density: 0.85,
    granulationFactor: 0.45,
    bleedSpeed: 1.05,
    edgeDarkening: 0.85,
    km: {
      K: [3.8, 1.9, 0.25], // Strong red/green absorption, preserves deep blue
      S: [0.18, 0.28, 0.75],
    },
  },
  {
    id: 'koenigsblau',
    nameDe: 'Königsblau (Füllhaltertinte)',
    nameEn: 'Royal Blue (Fountain Pen)',
    nameEs: 'Azul real para pluma estilográfica',
    colorHex: '#1d3e85',
    r: 29,
    g: 62,
    b: 133,
    density: 0.75,
    granulationFactor: 0.30,
    bleedSpeed: 1.15,
    edgeDarkening: 0.70,
    km: {
      K: [3.4, 1.8, 0.30],
      S: [0.20, 0.32, 0.68],
    },
  },
  {
    id: 'krapplack',
    nameDe: 'Krapplack Lasur (Alizarin)',
    nameEn: 'Alizarin Crimson Wash',
    nameEs: 'Carmesí alizarina transparente',
    colorHex: '#80182c',
    r: 128,
    g: 24,
    b: 44,
    density: 0.70,
    granulationFactor: 0.40,
    bleedSpeed: 1.05,
    edgeDarkening: 0.90,
    km: {
      K: [0.35, 3.6, 2.9], // High green/blue absorption, intense ruby red
      S: [0.55, 0.16, 0.22],
    },
  },
  {
    id: 'zinnober',
    nameDe: 'Zinnoberrot (Hanko Siegelrot)',
    nameEn: 'Cinnabar Vermilion (Seal Paste)',
    nameEs: 'Bermellón cinabrio para sellos',
    colorHex: '#b92c18',
    r: 185,
    g: 44,
    b: 24,
    density: 0.95,
    granulationFactor: 0.65,
    bleedSpeed: 0.90,
    edgeDarkening: 0.85,
    km: {
      K: [0.25, 3.2, 3.8],
      S: [0.72, 0.20, 0.15],
    },
  },
  {
    id: 'viridian',
    nameDe: 'Patina Grün (Kupfervitriol)',
    nameEn: 'Verdigris Patina Green',
    nameEs: 'Verde cardenillo patina',
    colorHex: '#1f5442',
    r: 31,
    g: 84,
    b: 66,
    density: 0.80,
    granulationFactor: 0.55,
    bleedSpeed: 1.10,
    edgeDarkening: 0.75,
    km: {
      K: [3.1, 0.45, 2.2], // Absorbs red & blue, reflects lush green
      S: [0.22, 0.65, 0.35],
    },
  },
  {
    id: 'eisengallus',
    nameDe: 'Eisengallus-Tinte (Archivalisch)',
    nameEn: 'Iron Gall Ink (Archival)',
    nameEs: 'Tinta de agallas de hierro de archivo',
    colorHex: '#23201d',
    r: 35,
    g: 32,
    b: 29,
    density: 0.94,
    granulationFactor: 0.60,
    bleedSpeed: 0.90,
    edgeDarkening: 0.95,
    km: {
      K: [2.9, 2.8, 2.7],
      S: [0.14, 0.13, 0.12],
    },
  },
  {
    id: 'indigo',
    nameDe: 'Japanisches Indigo (Aizome)',
    nameEn: 'Japanese Indigo (Aizome)',
    nameEs: 'Índigo japonés tradicional',
    colorHex: '#1a2b4c',
    r: 26,
    g: 43,
    b: 76,
    density: 0.88,
    granulationFactor: 0.45,
    bleedSpeed: 1.05,
    edgeDarkening: 0.85,
    km: {
      K: [3.4, 1.8, 0.35],
      S: [0.19, 0.26, 0.70],
    },
  },
];

/**
 * Generates an authentic physical Kubelka-Munk pigment configuration from any hex color code.
 * Subtractive absorption (K) and scattering (S) spectra are derived from normalized RGB reflectances.
 */
export function createPigmentFromHex(
  hex: string,
  id: string = 'custom',
  nameDe: string = 'Eigene Tinte',
  nameEn: string = 'Custom Ink'
): WetInkPigmentConfig {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16) || 20;
  const g = parseInt(cleanHex.slice(2, 4), 16) || 20;
  const b = parseInt(cleanHex.slice(4, 6), 16) || 20;

  // Normalized substrate-relative reflectances [0.02, 0.95]
  const R_r = Math.max(0.02, Math.min(0.95, r / 255));
  const R_g = Math.max(0.02, Math.min(0.95, g / 255));
  const R_b = Math.max(0.02, Math.min(0.95, b / 255));

  // Kubelka-Munk: K/S = (1 - R_inf)^2 / (2 * R_inf)
  const calcKS = (R: number) => ((1.0 - R) * (1.0 - R)) / (2.0 * R);
  const S_base = 0.35;

  const K_r = Math.max(0.05, Math.min(6.0, calcKS(R_r) * S_base));
  const K_g = Math.max(0.05, Math.min(6.0, calcKS(R_g) * S_base));
  const K_b = Math.max(0.05, Math.min(6.0, calcKS(R_b) * S_base));

  const S_r = S_base * (0.8 + R_r * 0.4);
  const S_g = S_base * (0.8 + R_g * 0.4);
  const S_b = S_base * (0.8 + R_b * 0.4);

  // Density based on darkness
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  const density = 0.70 + (1.0 - brightness) * 0.25;

  return {
    id,
    nameDe,
    nameEn,
    nameEs: nameEn,
    colorHex: `#${cleanHex.toLowerCase()}`,
    r,
    g,
    b,
    density,
    granulationFactor: 0.50,
    bleedSpeed: 1.0,
    edgeDarkening: 0.85,
    km: {
      K: [K_r, K_g, K_b],
      S: [S_r, S_g, S_b],
    },
  };
}

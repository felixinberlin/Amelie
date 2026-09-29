import { Language } from '../types';

/**
 * Stimmungen der Seite. Die Farben selbst stehen in `src/moods.css`
 * (`:root[data-mood="<id>"]`); hier nur, was die Auswahl braucht:
 * Name, Kurzbeschreibung, Emoji und drei Farbtupfer für die Vorschau.
 */
export type MoodId = 'amelie' | 'warm' | 'happy' | 'decisive' | 'calm' | 'kitchen';

export interface MoodDef {
  id: MoodId;
  emoji: string;
  name: Record<Language, string>;
  desc: Record<Language, string>;
  /** Vorschau: Hintergrund, Akzent, Highlight */
  swatch: [string, string, string];
  /** Wert für <meta name="theme-color"> (Browserleiste am Handy) */
  themeColor: string;
}

export const DEFAULT_MOOD: MoodId = 'amelie';

export const MOODS: MoodDef[] = [
  {
    id: 'amelie', emoji: '🎁', swatch: ['#fbf7f0', '#8c1d40', '#f6bd60'], themeColor: '#fbf7f0',
    name: { en: 'Amélie', de: 'Amélie', es: 'Amélie' },
    desc: { en: 'Burgundy, cream and tin gold — the original', de: 'Burgunder, Creme und Blechgold — das Original', es: 'Burdeos, crema y oro de lata — el original' },
  },
  {
    id: 'warm', emoji: '🕯️', swatch: ['#fff4e4', '#b4492a', '#f4b860'], themeColor: '#fff4e4',
    name: { en: 'Warm', de: 'Warm', es: 'Cálido' },
    desc: { en: 'Terracotta, honey and sandstone', de: 'Terrakotta, Honig und Sandstein', es: 'Terracota, miel y arenisca' },
  },
  {
    id: 'happy', emoji: '🌈', swatch: ['#fffbe8', '#e63976', '#ffd23f'], themeColor: '#fffbe8',
    name: { en: 'Happy', de: 'Fröhlich', es: 'Alegre' },
    desc: { en: 'Raspberry, sunshine and mint, extra round', de: 'Himbeere, Sonne und Minze, extra rund', es: 'Frambuesa, sol y menta, extra redondo' },
  },
  {
    id: 'decisive', emoji: '⚡', swatch: ['#f6f6f4', '#0b0b0f', '#ffd60a'], themeColor: '#f6f6f4',
    name: { en: 'Decisive', de: 'Entschlossen', es: 'Decidido' },
    desc: { en: 'Black, signal red, sharp corners', de: 'Schwarz, Signalrot, scharfe Kanten', es: 'Negro, rojo señal, esquinas afiladas' },
  },
  {
    id: 'calm', emoji: '🌿', swatch: ['#f3f7f4', '#3d6b5e', '#c9d8a5'], themeColor: '#f3f7f4',
    name: { en: 'Calm', de: 'Ruhig', es: 'Sereno' },
    desc: { en: 'Sage, mist and linen', de: 'Salbei, Nebel und Leinen', es: 'Salvia, niebla y lino' },
  },
  {
    id: 'kitchen', emoji: '🍅', swatch: ['#fffaf0', '#c8382b', '#f2c14e'], themeColor: '#fffaf0',
    name: { en: 'Kitchen', de: 'Küche', es: 'Cocina' },
    desc: { en: 'Tiled wall, tomato red, basil and butter, gingham trim', de: 'Kachelwand, Tomatenrot, Basilikum und Butter, Vichy-Rand', es: 'Pared de azulejos, rojo tomate, albahaca y mantequilla, borde vichy' },
  },
];

export const isMoodId = (v: unknown): v is MoodId => MOODS.some((m) => m.id === v);

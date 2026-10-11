/**
 * Fugenduell: places in a city. Every city has these places; the weather is the city's, the place changes the rules.
 * All numbers here are SCENARIO ASSUMPTIONS (game design), not measurements. The site profile uses the
 * Ellenberg-type scale of the plant data (L light, F moisture, R reaction, N nutrients, S salt) so that
 * plants can be compared with the place; the place values themselves are estimates and labelled as such.
 */
export interface CityPlace {
  id: string;
  labelDe: string;
  labelEn: string;
  labelEs: string;
  descriptionDe: string;
  descriptionEn: string;
  capacity: number; // shoots that fit
  trample: number; // 0 none · 1 people · 2 heavy foot traffic
  maintenanceMonths: number[]; // northern-hemisphere calendar months with cleaning / weeding
  heatShift: number; // +1 dark asphalt or gravel, −1 shade
  droughtShift: number; // +1 little soil
  winterSalt: boolean; // de-icing salt in cold months
  wallJoint: boolean;
  profile: { L: number; F: number; R: number; N: number; S: number };
}

export const CITY_PLACES: CityPlace[] = [
  { id: 'gehwegfuge', labelDe: 'Gehwegfuge (Asphalt)', labelEn: 'Pavement crack (asphalt)', labelEs: 'Grieta de acera (asfalto)',
    descriptionDe: 'Fußgänger treten täglich darauf, die Stadtreinigung jätet dreimal im Jahr, dunkler Asphalt heizt auf.',
    descriptionEn: 'People walk on it every day, street cleaning weeds it three times a year, dark asphalt heats up.',
    capacity: 40, trample: 1, maintenanceMonths: [4, 7, 10], heatShift: 1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 8, F: 4, R: 7, N: 6, S: 1 } },
  { id: 'platzpflaster', labelDe: 'Pflaster auf dem Marktplatz', labelEn: 'Cobbles on a market square', labelEs: 'Adoquines de una plaza',
    descriptionDe: 'Sehr viel Fußverkehr, zweimal im Jahr gereinigt. Nur flache Pflanzen halten den Tritt aus.',
    descriptionEn: 'Heavy foot traffic, cleaned twice a year. Only flat plants survive the trampling.',
    capacity: 50, trample: 2, maintenanceMonths: [5, 9], heatShift: 0, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 8, F: 5, R: 7, N: 6, S: 1 } },
  { id: 'mauerfuge', labelDe: 'Alte Mauerfuge (Kalkmörtel)', labelEn: 'Old wall joint (lime mortar)', labelEs: 'Junta de muro antiguo (mortero de cal)',
    descriptionDe: 'Niemand tritt darauf und niemand jätet, aber es gibt kaum Erde: Dürre trifft härter, Platz ist knapp.',
    descriptionEn: 'Nobody walks on it and nobody weeds it, but there is hardly any soil: drought hits harder, space is tight.',
    capacity: 25, trample: 0, maintenanceMonths: [], heatShift: 0, droughtShift: 1, winterSalt: false, wallJoint: true,
    profile: { L: 6, F: 3, R: 8, N: 3, S: 0 } },
  { id: 'baumscheibe', labelDe: 'Baumscheibe (Straßenbaum)', labelEn: 'Tree pit (street tree)', labelEs: 'Alcorque (árbol de calle)',
    descriptionDe: 'Schatten des Baums mildert Hitze, Hunde düngen, einmal im Sommer wird gemäht.',
    descriptionEn: 'The tree’s shade softens heat, dogs fertilise, it is cut once in summer.',
    capacity: 60, trample: 1, maintenanceMonths: [6], heatShift: -1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 5, F: 5, R: 7, N: 8, S: 1 } },
  { id: 'bordstein', labelDe: 'Bordstein an der Hauptstraße', labelEn: 'Kerb on a main road', labelEs: 'Bordillo de una avenida',
    descriptionDe: 'Die Kehrmaschine kommt fast jeden zweiten Monat, im Winter Streusalz, Asphalt heizt auf.',
    descriptionEn: 'The street sweeper comes almost every other month, de-icing salt in winter, asphalt heats up.',
    capacity: 35, trample: 0, maintenanceMonths: [3, 5, 7, 9, 11], heatShift: 1, droughtShift: 0, winterSalt: true, wallJoint: false,
    profile: { L: 8, F: 4, R: 8, N: 6, S: 3 } },
  { id: 'brache', labelDe: 'Gleisschotter und Brache', labelEn: 'Railway gravel and wasteland', labelEs: 'Balasto y solar',
    descriptionDe: 'Viel Platz, niemand stört. Schotter wird heiß und hält kein Wasser. Hier wachsen auch Sträucher.',
    descriptionEn: 'Lots of space, nobody disturbs. Gravel gets hot and holds no water. Shrubs grow here too.',
    capacity: 80, trample: 0, maintenanceMonths: [], heatShift: 1, droughtShift: 1, winterSalt: false, wallJoint: false,
    profile: { L: 8, F: 3, R: 8, N: 4, S: 1 } },
];

export function placeById(id: string): CityPlace {
  const p = CITY_PLACES.find(x => x.id === id);
  if (!p) throw new Error(`Unknown place ${id}`);
  return p;
}

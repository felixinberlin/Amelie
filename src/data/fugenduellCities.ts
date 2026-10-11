/**
 * Fugenduell: featured cities and four famous places in each, every place a different ecosystem.
 * The weather is the city's real year (NASA POWER, one grid cell per city). The place changes everything else:
 * space, trampling, cleaning, microclimate (heat/drought shift), salt and the site profile.
 * ALL place values are SCENARIO ASSUMPTIONS (game design), labelled as such in the app. The `verify` lines list
 * the facts about each place that should be checked against a primary source before the place is published.
 */
import { CityPlace } from './fugenduellPlaces';
import type { WeatherYearFixture } from '../engine/fugenduell/weatherYear';
import berlin2025 from './fugenduellWeather/berlin-2025.json';
import frankfurt2025 from './fugenduellWeather/frankfurt-2025.json';
import madrid2025 from './fugenduellWeather/madrid-2025.json';
import tokyo2025 from './fugenduellWeather/tokyo-2025.json';
import shanghai2025 from './fugenduellWeather/shanghai-2025.json';
import mexico2025 from './fugenduellWeather/mexico-2025.json';

export interface NamedPlace extends CityPlace {
  cityId: string;
  nameLocal: string;
  lat: number;
  lon: number;
  baseType: string; // id of the generic place type in fugenduellPlaces.ts it is modelled on
  ecosystemDe: string;
  ecosystemEn: string;
  verify: string[];
}

export interface FeaturedCity { id: string; name: string; lat: number; lon: number; fixtures: Record<number, WeatherYearFixture>; places: NamedPlace[] }

const P = (p: NamedPlace) => p;

const BERLIN: NamedPlace[] = [
  P({ id: 'berlin-mauer', cityId: 'berlin', nameLocal: 'Berliner Mauer, Gedenkstätte Bernauer Straße', lat: 52.5351, lon: 13.3903, baseType: 'mauerfuge',
    labelDe: 'Berliner Mauer (Bernauer Straße)', labelEn: 'Berlin Wall (Bernauer Straße)', labelEs: 'Muro de Berlín (Bernauer Straße)',
    ecosystemDe: 'Betonmauer mit Kalkfugen', ecosystemEn: 'Concrete wall with lime joints',
    descriptionDe: 'Pflanzen, die dort wachsen, wo nichts wachsen durfte. Niemand tritt auf die Mauer, aber die Denkmalpflege entfernt einmal im Jahr Gehölze.',
    descriptionEn: 'Plants growing where nothing was allowed to grow. Nobody walks on the Wall, but heritage care removes woody plants once a year.',
    capacity: 25, trample: 0, maintenanceMonths: [9], heatShift: 0, droughtShift: 1, winterSalt: false, wallJoint: true,
    profile: { L: 7, F: 3, R: 8, N: 3, S: 0 },
    verify: ['Original wall segments at the Bernauer Straße memorial', 'Care regime for vegetation on the memorial wall'] }),
  P({ id: 'berlin-kastanienallee', cityId: 'berlin', nameLocal: 'Straßenbahngleise Kastanienallee', lat: 52.5393, lon: 13.4091, baseType: 'platzpflaster',
    labelDe: 'Straßenbahngleise Kastanienallee', labelEn: 'Tram tracks, Kastanienallee', labelEs: 'Vías del tranvía, Kastanienallee',
    ecosystemDe: 'Pflaster zwischen Schienen, Café-Kiez', ecosystemEn: 'Paving between rails, café street',
    descriptionDe: 'Die Schickimicki-Fuge: Die Tram rüttelt alle paar Minuten, am Wochenende Brunch-Gedränge, verschütteter Latte düngt. Nur flache Pflanzen halten durch.',
    descriptionEn: 'The posh crack: the tram rattles past every few minutes, weekend brunch crowds, spilled latte fertilises. Only flat plants hold on.',
    capacity: 35, trample: 1, maintenanceMonths: [3, 6, 9, 12], heatShift: 1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 7, F: 4, R: 7, N: 7, S: 1 },
    verify: ['Tram route on Kastanienallee', 'Track cleaning frequency (BVG)'] }),
  P({ id: 'berlin-tempelhof', cityId: 'berlin', nameLocal: 'Rollfeld Tempelhofer Feld', lat: 52.473, lon: 13.403, baseType: 'brache',
    labelDe: 'Rollfeld Tempelhofer Feld', labelEn: 'Runway, Tempelhofer Feld', labelEs: 'Pista del Tempelhofer Feld',
    ecosystemDe: 'Offener Beton, Wind, volle Sonne', ecosystemEn: 'Open concrete, wind, full sun',
    descriptionDe: 'Riesige Fläche, niemand jätet. Skater und Drachenflieger auf den Bahnen, der Beton heizt sich auf.',
    descriptionEn: 'A huge open space nobody weeds. Skaters and kite flyers on the runways, the concrete heats up.',
    capacity: 70, trample: 1, maintenanceMonths: [], heatShift: 1, droughtShift: 1, winterSalt: false, wallJoint: false,
    profile: { L: 9, F: 3, R: 8, N: 4, S: 1 },
    verify: ['Runways open to the public as a park', 'No regular weeding of the runway cracks'] }),
  P({ id: 'berlin-suedgelaende', cityId: 'berlin', nameLocal: 'Natur-Park Schöneberger Südgelände', lat: 52.459, lon: 13.356, baseType: 'brache',
    labelDe: 'Natur-Park Südgelände (alter Rangierbahnhof)', labelEn: 'Südgelände nature park (old rail yard)', labelEs: 'Parque natural Südgelände (antigua estación)',
    ecosystemDe: 'Gleisschotter mit Stadtwildnis', ecosystemEn: 'Railway ballast turned urban wilderness',
    descriptionDe: 'Auf dem alten Rangierbahnhof wächst seit Jahrzehnten Wildnis: halbschattig unter Birken und Robinien, stickstoffreich, niemand stört.',
    descriptionEn: 'Wilderness has grown on the old rail yard for decades: half shade under birches and robinias, nitrogen-rich, undisturbed.',
    capacity: 80, trample: 0, maintenanceMonths: [], heatShift: 0, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 6, F: 4, R: 7, N: 6, S: 1 },
    verify: ['Nature park on the former marshalling yard', 'Tree species (birch, robinia) in the park'] }),
];

const FRANKFURT: NamedPlace[] = [
  P({ id: 'ffm-roemerberg', cityId: 'frankfurt', nameLocal: 'Römerberg', lat: 50.1106, lon: 8.6821, baseType: 'platzpflaster',
    labelDe: 'Pflaster am Römerberg', labelEn: 'Cobbles of the Römerberg', labelEs: 'Adoquines del Römerberg',
    ecosystemDe: 'Altstadtpflaster, Touristenströme', ecosystemEn: 'Old-town cobbles, tourist crowds',
    descriptionDe: 'Rathausplatz mit Touristen, Weihnachtsmarkt und häufiger Reinigung. Wer hier wächst, wächst flach.',
    descriptionEn: 'Town hall square with tourists, a Christmas market and frequent cleaning. Whatever grows here grows flat.',
    capacity: 50, trample: 2, maintenanceMonths: [4, 8, 12], heatShift: 0, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 8, F: 5, R: 7, N: 6, S: 1 },
    verify: ['Cobbled square in front of the Römer', 'Christmas market location'] }),
  P({ id: 'ffm-mainkai', cityId: 'frankfurt', nameLocal: 'Ufermauer am Mainkai', lat: 50.1075, lon: 8.683, baseType: 'mauerfuge',
    labelDe: 'Ufermauer am Main', labelEn: 'Main river quay wall', labelEs: 'Muro del muelle del Meno',
    ecosystemDe: 'Sandsteinmauer am Fluss, feucht', ecosystemEn: 'Sandstone river wall, humid',
    descriptionDe: 'Der Fluss kühlt und befeuchtet: Dürre trifft hier schwächer, Hitze auch. Nur Mauerspezialisten finden Halt.',
    descriptionEn: 'The river cools and moistens: drought and heat hit softer here. Only wall specialists find a hold.',
    capacity: 30, trample: 0, maintenanceMonths: [], heatShift: -1, droughtShift: -1, winterSalt: false, wallJoint: true,
    profile: { L: 7, F: 6, R: 7, N: 6, S: 0 },
    verify: ['Quay walls along the Mainkai / Sachsenhausen bank', 'Wall material (sandstone)'] }),
  P({ id: 'ffm-gleisvorfeld', cityId: 'frankfurt', nameLocal: 'Gleisvorfeld Hauptbahnhof', lat: 50.107, lon: 8.656, baseType: 'brache',
    labelDe: 'Gleisvorfeld am Hauptbahnhof', labelEn: 'Track field, Hauptbahnhof', labelEs: 'Playa de vías de la estación central',
    ecosystemDe: 'Heißer Schotter, Bahn-Unkrautbekämpfung', ecosystemEn: 'Hot ballast, railway weed control',
    descriptionDe: 'Viel Platz und Hitze im Schotter, aber zweimal im Jahr kommt die Vegetationskontrolle der Bahn.',
    descriptionEn: 'Plenty of space and heat in the ballast, but railway vegetation control comes twice a year.',
    capacity: 80, trample: 0, maintenanceMonths: [5, 9], heatShift: 1, droughtShift: 1, winterSalt: false, wallJoint: false,
    profile: { L: 9, F: 3, R: 8, N: 4, S: 1 },
    verify: ['Track field west of the main station', 'Railway vegetation control schedule'] }),
  P({ id: 'ffm-zeil', cityId: 'frankfurt', nameLocal: 'Baumscheiben auf der Zeil', lat: 50.1146, lon: 8.6838, baseType: 'baumscheibe',
    labelDe: 'Baumscheiben auf der Zeil', labelEn: 'Tree pits on the Zeil', labelEs: 'Alcorques de la Zeil',
    ecosystemDe: 'Schatten und Dünger in der Einkaufsstraße', ecosystemEn: 'Shade and fertiliser in a shopping street',
    descriptionDe: 'Unter den Straßenbäumen der Fußgängerzone: Schatten, Hunde, Einkaufstaschen, einmal im Sommer wird gemäht.',
    descriptionEn: 'Under the street trees of the pedestrian zone: shade, dogs, shopping bags, cut once in summer.',
    capacity: 45, trample: 1, maintenanceMonths: [6], heatShift: -1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 5, F: 5, R: 7, N: 8, S: 1 },
    verify: ['Street trees in the Zeil pedestrian zone'] }),
];

const MADRID: NamedPlace[] = [
  P({ id: 'mad-plaza-mayor', cityId: 'madrid', nameLocal: 'Plaza Mayor', lat: 40.4155, lon: -3.7074, baseType: 'platzpflaster',
    labelDe: 'Pflaster der Plaza Mayor', labelEn: 'Cobbles of the Plaza Mayor', labelEs: 'Adoquines de la Plaza Mayor',
    ecosystemDe: 'Geschlossener Platz, Hitzefalle', ecosystemEn: 'Enclosed square, heat trap',
    descriptionDe: 'Der Platz staut die Sommerhitze, Touristen treten jeden Spalt. Ein Ort für Hitze- und Trittspezialisten.',
    descriptionEn: 'The enclosed square traps summer heat, tourists tread every crack. A place for heat and trampling specialists.',
    capacity: 45, trample: 2, maintenanceMonths: [3, 6, 9, 12], heatShift: 1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 9, F: 3, R: 8, N: 6, S: 1 },
    verify: ['Paving of the Plaza Mayor', 'Cleaning frequency'] }),
  P({ id: 'mad-muralla', cityId: 'madrid', nameLocal: 'Muralla árabe (Cuesta de la Vega)', lat: 40.415, lon: -3.715, baseType: 'mauerfuge',
    labelDe: 'Arabische Stadtmauer', labelEn: 'Arab city wall', labelEs: 'Muralla árabe',
    ecosystemDe: 'Feuerstein und Kalk, sonnig und trocken', ecosystemEn: 'Flint and lime, sunny and dry',
    descriptionDe: 'Reste der mittelalterlichen Stadtmauer: Kalkmörtel, volle Sonne, kaum Erde. Das Revier der Mauerraute.',
    descriptionEn: 'Remains of the medieval city wall: lime mortar, full sun, hardly any soil. Wall-rue territory.',
    capacity: 25, trample: 0, maintenanceMonths: [], heatShift: 1, droughtShift: 1, winterSalt: false, wallJoint: true,
    profile: { L: 8, F: 2, R: 8, N: 3, S: 0 },
    verify: ['Muralla árabe remains at Cuesta de la Vega (9th century)', 'Wall materials (flint, lime)'] }),
  P({ id: 'mad-rio', cityId: 'madrid', nameLocal: 'Madrid Río (Manzanares)', lat: 40.401, lon: -3.721, baseType: 'gehwegfuge',
    labelDe: 'Uferweg Madrid Río', labelEn: 'Madrid Río riverside path', labelEs: 'Paseo de Madrid Río',
    ecosystemDe: 'Bewässerter Flusspark', ecosystemEn: 'Irrigated river park',
    descriptionDe: 'Am Manzanares wird bewässert: Hier ist Madrid feucht und mild, Joggende und Räder treten die Fugen.',
    descriptionEn: 'The Manzanares park is irrigated: here Madrid is moist and mild, joggers and bikes tread the cracks.',
    capacity: 50, trample: 1, maintenanceMonths: [4, 10], heatShift: 0, droughtShift: -1, winterSalt: false, wallJoint: false,
    profile: { L: 7, F: 6, R: 7, N: 7, S: 1 },
    verify: ['Madrid Río park along the Manzanares', 'Irrigation of the park'] }),
  P({ id: 'mad-castellana', cityId: 'madrid', nameLocal: 'Bordillo del Paseo de la Castellana', lat: 40.44, lon: -3.691, baseType: 'bordstein',
    labelDe: 'Bordstein der Castellana', labelEn: 'Kerb of the Castellana', labelEs: 'Bordillo de la Castellana',
    ecosystemDe: 'Verkehrsachse, Abgas, Kehrmaschine', ecosystemEn: 'Traffic artery, exhaust, sweeper',
    descriptionDe: 'Zehn Spuren Verkehr, die Kehrmaschine kommt jeden zweiten Monat, im seltenen Schneewinter wird gestreut.',
    descriptionEn: 'Ten lanes of traffic, the sweeper comes every other month, and in a rare snowy winter the road is salted.',
    capacity: 35, trample: 0, maintenanceMonths: [2, 4, 6, 8, 10, 12], heatShift: 1, droughtShift: 0, winterSalt: true, wallJoint: false,
    profile: { L: 8, F: 3, R: 8, N: 6, S: 3 },
    verify: ['Street cleaning frequency', 'De-icing salt use in snowy winters (e.g. storm Filomena 2021)'] }),
];

const TOKYO: NamedPlace[] = [
  P({ id: 'tyo-shibuya', cityId: 'tokyo', nameLocal: '渋谷スクランブル交差点 (Shibuya Crossing)', lat: 35.6595, lon: 139.7005, baseType: 'platzpflaster',
    labelDe: 'Shibuya-Kreuzung', labelEn: 'Shibuya Crossing', labelEs: 'Cruce de Shibuya',
    ecosystemDe: 'Die meistbetretene Fuge der Welt', ecosystemEn: 'The most trodden crack on earth',
    descriptionDe: 'Tausende Schritte pro Ampelphase und eine sehr saubere Stadt: Wer hier lebt, ist winzig und flach.',
    descriptionEn: 'Thousands of steps per light cycle in a very clean city: whatever lives here is tiny and flat.',
    capacity: 30, trample: 2, maintenanceMonths: [2, 4, 6, 8, 10, 12], heatShift: 1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 7, F: 5, R: 7, N: 6, S: 1 },
    verify: ['Pedestrian volume at the crossing', 'Street cleaning regime'] }),
  P({ id: 'tyo-edo-walls', cityId: 'tokyo', nameLocal: '江戸城石垣 (Edo Castle stone walls)', lat: 35.6852, lon: 139.7528, baseType: 'mauerfuge',
    labelDe: 'Steinmauern der Burg Edo', labelEn: 'Edo Castle stone walls', labelEs: 'Muros de piedra del castillo de Edo',
    ecosystemDe: 'Trockenmauer am Burggraben, feucht', ecosystemEn: 'Dry-stone wall by the moat, humid',
    descriptionDe: 'Riesige Steine ohne Mörtel über dem Wassergraben: feucht, halbschattig, Gehölze werden entfernt.',
    descriptionEn: 'Huge mortarless stones above the moat: humid, half-shaded, woody plants are removed.',
    capacity: 30, trample: 0, maintenanceMonths: [11], heatShift: 0, droughtShift: -1, winterSalt: false, wallJoint: true,
    profile: { L: 6, F: 6, R: 6, N: 4, S: 0 },
    verify: ['Dry-stone walls and moats of the former Edo Castle', 'Vegetation care on the walls'] }),
  P({ id: 'tyo-odaiba', cityId: 'tokyo', nameLocal: 'お台場 (Odaiba seafront)', lat: 35.627, lon: 139.775, baseType: 'bordstein',
    labelDe: 'Uferpromenade Odaiba', labelEn: 'Odaiba seafront', labelEs: 'Paseo marítimo de Odaiba',
    ecosystemDe: 'Aufgeschüttetes Land, Salzgischt', ecosystemEn: 'Reclaimed land, salt spray',
    descriptionDe: 'Künstliche Insel in der Bucht von Tokio: Wind und Salzgischt das ganze Jahr. Nur salzfeste Pflanzen bleiben.',
    descriptionEn: 'An artificial island in Tokyo Bay: wind and salt spray all year round. Only salt-tolerant plants stay.',
    capacity: 50, trample: 1, maintenanceMonths: [4, 10], heatShift: 0, droughtShift: 0, winterSalt: false, saltSpray: true, wallJoint: false,
    profile: { L: 9, F: 5, R: 7, N: 4, S: 4 },
    verify: ['Odaiba is reclaimed land in Tokyo Bay', 'Salt spray reaching the promenade'] }),
  P({ id: 'tyo-yamanote', cityId: 'tokyo', nameLocal: '山手線の線路 (Yamanote line ballast)', lat: 35.683, lon: 139.702, baseType: 'brache',
    labelDe: 'Schotter der Yamanote-Linie', labelEn: 'Yamanote line ballast', labelEs: 'Balasto de la línea Yamanote',
    ecosystemDe: 'Gleisschotter im feuchten Sommer', ecosystemEn: 'Track ballast in a humid summer',
    descriptionDe: 'Die Ringbahn fährt im Minutentakt, der Schotter wird heiß, einmal im Sommer wird gejätet. Tokios Regen hält ihn feucht.',
    descriptionEn: 'The loop line runs every few minutes, the ballast gets hot, it is weeded once in summer. Tokyo rain keeps it moist.',
    capacity: 70, trample: 0, maintenanceMonths: [6], heatShift: 1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 8, F: 4, R: 7, N: 5, S: 1 },
    verify: ['Ballasted track sections of the Yamanote line', 'Vegetation control on JR tracks'] }),
];

const SHANGHAI: NamedPlace[] = [
  P({ id: 'sha-bund', cityId: 'shanghai', nameLocal: '外滩 (The Bund)', lat: 31.24, lon: 121.49, baseType: 'platzpflaster',
    labelDe: 'Promenade am Bund', labelEn: 'The Bund promenade', labelEs: 'Paseo del Bund',
    ecosystemDe: 'Flusspromenade, Menschenmassen, feuchte Luft', ecosystemEn: 'River promenade, crowds, humid air',
    descriptionDe: 'Am Huangpu flanieren täglich Menschenmassen, die feuchte Flussluft mildert die Dürre.',
    descriptionEn: 'Crowds stroll along the Huangpu every day; the humid river air softens drought.',
    capacity: 40, trample: 2, maintenanceMonths: [3, 6, 9, 12], heatShift: 0, droughtShift: -1, winterSalt: false, wallJoint: false,
    profile: { L: 8, F: 6, R: 7, N: 6, S: 1 },
    verify: ['Paved riverside promenade along the Huangpu'] }),
  P({ id: 'sha-yuyuan', cityId: 'shanghai', nameLocal: '豫园 (Yu Garden)', lat: 31.2272, lon: 121.4921, baseType: 'mauerfuge',
    labelDe: 'Mauern und Steine im Yu-Garten', labelEn: 'Walls and rocks of the Yu Garden', labelEs: 'Muros y rocas del Jardín Yu',
    ecosystemDe: 'Klassischer Garten, schattig und feucht', ecosystemEn: 'Classical garden, shady and humid',
    descriptionDe: 'Alte Mauern, Felsen und Teiche: schattig, feucht, aber die Gärtner pflegen penibel zweimal im Jahr.',
    descriptionEn: 'Old walls, rocks and ponds: shady and humid, but the gardeners weed meticulously twice a year.',
    capacity: 25, trample: 0, maintenanceMonths: [3, 9], heatShift: -1, droughtShift: -1, winterSalt: false, wallJoint: true,
    profile: { L: 5, F: 7, R: 7, N: 5, S: 0 },
    verify: ['Classical garden with walls, rockeries and ponds', 'Garden maintenance'] }),
  P({ id: 'sha-tianzifang', cityId: 'shanghai', nameLocal: '田子坊 (Tianzifang lanes)', lat: 31.21, lon: 121.469, baseType: 'gehwegfuge',
    labelDe: 'Shikumen-Gassen in Tianzifang', labelEn: 'Shikumen lanes of Tianzifang', labelEs: 'Callejones shikumen de Tianzifang',
    ecosystemDe: 'Enge Gassen, wenig Licht, viel Küche', ecosystemEn: 'Narrow lanes, little light, lots of kitchens',
    descriptionDe: 'Zwischen den Steintorhäusern ist es eng und dunkel, Küchen und Teestände düngen kräftig, viele Füße.',
    descriptionEn: 'Between the stone-gate houses it is narrow and dark, kitchens and tea stalls fertilise heavily, many feet.',
    capacity: 30, trample: 2, maintenanceMonths: [4, 8, 12], heatShift: -1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 4, F: 6, R: 7, N: 8, S: 1 },
    verify: ['Lilong (shikumen) lanes of Tianzifang'] }),
  P({ id: 'sha-wukang', cityId: 'shanghai', nameLocal: '武康路梧桐 (Wukang Road plane trees)', lat: 31.208, lon: 121.438, baseType: 'baumscheibe',
    labelDe: 'Platanen-Baumscheiben der Wukang Road', labelEn: 'Plane-tree pits, Wukang Road', labelEs: 'Alcorques de plátanos, Wukang Road',
    ecosystemDe: 'Platanenschatten im alten Konzessionsviertel', ecosystemEn: 'Plane-tree shade in the old concession',
    descriptionDe: 'Unter den alten Platanen ist der Sommer erträglich, der Boden reich, einmal im Juli wird geschnitten.',
    descriptionEn: 'Under the old plane trees summer is bearable, the soil rich, it is cut once in July.',
    capacity: 55, trample: 1, maintenanceMonths: [7], heatShift: -1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 5, F: 6, R: 6, N: 7, S: 1 },
    verify: ['Plane trees lining Wukang Road (former French Concession)'] }),
];

const MEXICO: NamedPlace[] = [
  P({ id: 'cdmx-zocalo', cityId: 'mexico', nameLocal: 'Zócalo (Plaza de la Constitución)', lat: 19.4326, lon: -99.1332, baseType: 'platzpflaster',
    labelDe: 'Pflaster des Zócalo', labelEn: 'Paving of the Zócalo', labelEs: 'Pavimento del Zócalo',
    ecosystemDe: 'Riesiger Platz ohne Schatten, Höhensonne', ecosystemEn: 'Huge shadeless square, high-altitude sun',
    descriptionDe: 'Einer der größten Plätze der Welt auf 2.240 m: grelle Sonne, Kundgebungen, Konzerte, regelmäßige Reinigung.',
    descriptionEn: 'One of the largest squares in the world at 2,240 m: harsh sun, rallies, concerts, regular cleaning.',
    capacity: 60, trample: 2, maintenanceMonths: [3, 6, 9, 12], heatShift: 1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 9, F: 4, R: 7, N: 6, S: 1 },
    verify: ['Size and use of the Zócalo', 'Altitude of the city centre'] }),
  P({ id: 'cdmx-xochimilco', cityId: 'mexico', nameLocal: 'Chinampas de Xochimilco', lat: 19.262, lon: -99.105, baseType: 'mauerfuge',
    labelDe: 'Kanalränder der Chinampas, Xochimilco', labelEn: 'Canal edges of the Xochimilco chinampas', labelEs: 'Bordes de canal de las chinampas de Xochimilco',
    ecosystemDe: 'Aztekische Beetinseln, nass und nährstoffreich', ecosystemEn: 'Aztec garden islands, wet and nutrient-rich',
    descriptionDe: 'Die schwimmenden Gärten der Azteken: Wasser überall, Schlamm voller Nährstoffe, keine Füße, keine Reinigung.',
    descriptionEn: 'The floating gardens of the Aztecs: water everywhere, nutrient-rich mud, no feet, no cleaning.',
    capacity: 40, trample: 0, maintenanceMonths: [], heatShift: 0, droughtShift: -1, winterSalt: false, wallJoint: true,
    profile: { L: 7, F: 8, R: 7, N: 8, S: 2 },
    verify: ['Chinampa canal system of Xochimilco (UNESCO World Heritage)'] }),
  P({ id: 'cdmx-reforma', cityId: 'mexico', nameLocal: 'Paseo de la Reforma', lat: 19.427, lon: -99.167, baseType: 'baumscheibe',
    labelDe: 'Baumscheiben am Paseo de la Reforma', labelEn: 'Tree pits on the Paseo de la Reforma', labelEs: 'Alcorques del Paseo de la Reforma',
    ecosystemDe: 'Alleebäume am Prachtboulevard', ecosystemEn: 'Avenue trees on the grand boulevard',
    descriptionDe: 'Schatten der Alleebäume, Sonntagsradler, einmal im Jahr wird gemäht.',
    descriptionEn: 'Shade of the avenue trees, Sunday cyclists, cut once a year.',
    capacity: 45, trample: 1, maintenanceMonths: [5], heatShift: -1, droughtShift: 0, winterSalt: false, wallJoint: false,
    profile: { L: 6, F: 5, R: 6, N: 7, S: 1 },
    verify: ['Street trees along the Paseo de la Reforma', 'Sunday car-free cycling (Muévete en Bici)'] }),
  P({ id: 'cdmx-pedregal', cityId: 'mexico', nameLocal: 'Reserva Ecológica del Pedregal de San Ángel', lat: 19.318, lon: -99.183, baseType: 'brache',
    labelDe: 'Lavafeld Pedregal (UNAM)', labelEn: 'Pedregal lava field (UNAM)', labelEs: 'Pedregal de San Ángel (UNAM)',
    ecosystemDe: 'Schwarze Basaltlava, lange Trockenzeit', ecosystemEn: 'Black basalt lava, long dry season',
    descriptionDe: 'Risse im erkalteten Lavastrom des Xitle: dunkler Fels heizt auf, Wasser versickert sofort. Ein Ökosystem aus Spalten.',
    descriptionEn: 'Cracks in the cooled lava flow of Xitle: dark rock heats up, water drains away at once. An ecosystem made of crevices.',
    capacity: 70, trample: 0, maintenanceMonths: [], heatShift: 1, droughtShift: 1, winterSalt: false, wallJoint: false,
    profile: { L: 8, F: 3, R: 5, N: 3, S: 0 },
    verify: ['Ecological reserve on the UNAM campus', 'Lava flow of the Xitle volcano'] }),
];

export const FEATURED_CITIES: FeaturedCity[] = [
  { id: 'berlin', name: 'Berlin', lat: 52.52, lon: 13.41, fixtures: { 2025: berlin2025 as WeatherYearFixture }, places: BERLIN },
  { id: 'frankfurt', name: 'Frankfurt am Main', lat: 50.11, lon: 8.68, fixtures: { 2025: frankfurt2025 as WeatherYearFixture }, places: FRANKFURT },
  { id: 'madrid', name: 'Madrid', lat: 40.42, lon: -3.7, fixtures: { 2025: madrid2025 as WeatherYearFixture }, places: MADRID },
  { id: 'tokyo', name: 'Tokyo · 東京', lat: 35.68, lon: 139.76, fixtures: { 2025: tokyo2025 as WeatherYearFixture }, places: TOKYO },
  { id: 'shanghai', name: 'Shanghai · 上海', lat: 31.23, lon: 121.47, fixtures: { 2025: shanghai2025 as WeatherYearFixture }, places: SHANGHAI },
  { id: 'mexico', name: 'Ciudad de México', lat: 19.43, lon: -99.13, fixtures: { 2025: mexico2025 as WeatherYearFixture }, places: MEXICO },
];

export const NAMED_PLACES: NamedPlace[] = FEATURED_CITIES.flatMap(c => c.places);

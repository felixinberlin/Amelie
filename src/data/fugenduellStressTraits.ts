/** Measurement targets, not species observations. Method references do not supply species values. */
export interface StressMeasurement {
 id: string;
 labelDe: string;
 labelEn: string;
 value: number | null;
 unit: string;
 meaningDe: string;
 meaningEn: string;
 methodSource: string;
 observationSource: string | null;
}
export function stressMeasurements(): StressMeasurement[] {
 return [
  {id:'heatPSIIT50',labelDe:'Hitze: PSII-T50',labelEn:'Heat: PSII T50',value:null,unit:'°C',meaningDe:'Blatttemperatur bei 50 % Verlust der gemessenen PSII-Effizienz im definierten Test; nicht automatisch die Todestemperatur der ganzen Pflanze.',meaningEn:'Leaf temperature at 50% loss of measured PSII efficiency in a defined assay; not automatically whole-plant death temperature.',methodSource:'https://www.nature.com/articles/s41598-025-95623-5',observationSource:null},
  {id:'frostInjuryLT50',labelDe:'Frost: EL-LT50',labelEn:'Frost: EL-LT50',value:null,unit:'°C',meaningDe:'Temperatur bei 50 % Elektrolytaustritt nach dem definierten Frosttest und der angegebenen Normierung. Nicht automatisch 50 % tote Pflanzen; Gewebe, Dauer und Akklimatisation gehören zum Wert.',meaningEn:'Temperature at 50% electrolyte leakage in the specified freezing assay and normalization. Not automatically 50% dead plants; tissue, duration and acclimation accompany the value.',methodSource:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8140579/',observationSource:null},
  {id:'chillingElectrolyteLeakage',labelDe:'Kälte ohne Frost: Membranschädigung',labelEn:'Non-freezing chilling: membrane injury',value:null,unit:'% corrected electrolyte leakage',meaningDe:'Membranschädigung bei einer angegebenen positiven niedrigen Temperatur und Einwirkdauer; nicht dasselbe wie Frostresistenz.',meaningEn:'Membrane injury at a specified low positive temperature and exposure duration; distinct from freezing resistance.',methodSource:'https://doi.org/10.1071/BT12225',observationSource:null},
  {id:'lightCompensationPoint',labelDe:'Schatten: Blatt-Lichtkompensationspunkt',labelEn:'Shade: leaf light compensation point',value:null,unit:'µmol photons m⁻² s⁻¹',meaningDe:'Lichtintensität, bei der die Netto-CO₂-Aufnahme des Blatts null ist. Ein niedrigerer Wert allein belegt nicht langfristiges Überleben der ganzen Pflanze im Schatten.',meaningEn:'Light intensity at zero net leaf CO₂ uptake. A lower value alone does not prove long-term whole-plant survival in shade.',methodSource:'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2023.1271341/full',observationSource:null},
 ];
}

/** Synthetic historical coefficients, solely for exercising the archived rule engine. Not botanical evidence. */
import type { PlantRosterItem } from '../../data/fugenduellData';
import coefficients from './prototypeStats.fixture.json';
export function prototypeRoster(roster: PlantRosterItem[]): PlantRosterItem[] {
 return roster.map(plant => {
  const stats=(coefficients as Record<string,{wurzel:number;tritt:number;duerre:number;saat:number;tempo:number;chemie:number}>)[plant.id];
  return {...plant, stats, bannedFromRanked:plant.id==='ailanthus-altissima', totalBudget:Object.values(stats).reduce((sum,n)=>sum+n,0)};
 });
}

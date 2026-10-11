import React, { useState } from 'react';
import { Language } from '../../types';
import { FugenduellPlantView } from './FugenduellPlantView';
import { FugenduellCommunity } from './FugenduellCommunity';
import { FugenduellWeatherWatch } from './FugenduellWeatherWatch';
interface FugenduellArenaProps { lang: Language; onOpenDose?: (doseId:string)=>void; isEmbedded?:boolean }

export const FugenduellArena: React.FC<FugenduellArenaProps> = (props) => {
  const [mode, setMode] = useState<'watch' | 'community' | 'plant'>('watch');
  const de = props.lang === 'de';
  return <div className="space-y-4"><div className="flex flex-wrap gap-2" aria-label={de ? 'Spielmodus' : 'Game mode'}>
    <button className="min-h-11 rounded-lg border px-4" aria-pressed={mode === 'community'} onClick={() => setMode('community')}>{de ? 'Gemeinschaft · 3 Pflanzen + Aktionsdeck' : 'Community · 3 plants + action deck'}</button>
    <button className="min-h-11 rounded-lg border px-4" aria-pressed={mode === 'watch'} onClick={() => setMode('watch')}>{de ? 'Wetterjahr · zuschauen' : 'Weather year · watch'}</button>
  <button className="min-h-11 rounded-lg border px-4" aria-pressed={mode === 'plant'} onClick={() => setMode('plant')}>{de ? 'Pflanze ansehen · echte Botanik' : 'View plant · real botany'}</button>
  </div><div hidden={mode !== 'plant'}><FugenduellPlantView lang={props.lang} /></div><div hidden={mode !== 'community'}><FugenduellCommunity lang={props.lang} /></div><div hidden={mode !== 'watch'}><FugenduellWeatherWatch lang={props.lang} active={mode === 'watch'} /></div></div>;
};

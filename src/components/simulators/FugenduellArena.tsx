import React, { useState } from 'react';
import { Language } from '../../types';
import { FugenduellPlantView } from './FugenduellPlantView';
import { FugenduellCommunity } from './FugenduellCommunity';
interface FugenduellArenaProps { lang: Language; onOpenDose?: (doseId:string)=>void; isEmbedded?:boolean }

export const FugenduellArena: React.FC<FugenduellArenaProps> = (props) => {
  const [mode, setMode] = useState<'community' | 'single' | 'plant'>('plant');
  const de = props.lang === 'de';
  return <div className="space-y-4"><div className="flex flex-wrap gap-2" aria-label={de ? 'Spielmodus' : 'Game mode'}>
    <button className="min-h-11 rounded-lg border px-4" aria-pressed={mode === 'community'} onClick={() => setMode('community')}>{de ? 'Gemeinschaft · 3 Pflanzen + Aktionsdeck' : 'Community · 3 plants + action deck'}</button>
    <button className="min-h-11 rounded-lg border px-4" aria-pressed={mode === 'single'} onClick={() => setMode('single')}>{de ? 'Einzelduell · Regeln folgen' : 'Single duel · rules pending'}</button>
  <button className="min-h-11 rounded-lg border px-4" aria-pressed={mode === 'plant'} onClick={() => setMode('plant')}>{de ? 'Pflanze ansehen · echte Botanik' : 'View plant · real botany'}</button>
  </div><div hidden={mode !== 'plant'}><FugenduellPlantView lang={props.lang} /></div><div hidden={mode !== 'community'}><FugenduellCommunity lang={props.lang} /></div><div hidden={mode !== 'single'}><p className="rounded-xl border bg-amber-50 p-4">{de?'Das Einzelduell wartet auf neue Spielregeln aus den verifizierten Daten. Es werden keine fehlenden Werte geschätzt.':'The single duel awaits new game rules derived from verified data. Missing values are not estimated.'}</p></div></div>;
};

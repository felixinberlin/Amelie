import React, { useState } from 'react';
import { Language } from '../../types';
import { FUGENDUELL_STARTER_ROSTER, SEASONAL_BATTLE_EVENTS } from '../../data/fugenduellData';
import { ACTIONS, CommunityGame, Habitat, cover, emptyGround, playCommunity, startCommunity } from '../../engine/fugenduell/communityEngine';

export function FugenduellCommunity({ lang }: { lang: Language }) {
  const de = lang === 'de';
  const [ids, setIds] = useState(['taraxacum-officinale', 'plantago-major', 'bryum-argenteum']);
  const [habitat, setHabitat] = useState<Habitat>('pavement');
  const [seed, setSeed] = useState('1');
  const [game, setGame] = useState<CommunityGame | null>(null);
  const [target, setTarget] = useState(0);
  const [error, setError] = useState('');
  const name = (id: string) => { const p = FUGENDUELL_STARTER_ROSTER.find(p => p.id === id)!; return de ? p.nameCommonDe : p.nameCommonEn; };
  const start = () => { try { if (!seed.trim()) throw new Error("Missing seed"); setGame(startCommunity(ids, Number(seed))); setError(''); setTarget(0); } catch { setError(de ? 'Drei verschiedene Arten und eine ganze Startzahl zwischen 0 und 4294967295 wählen.' : 'Choose three distinct species and an integer seed from 0 to 4294967295.'); } };
  return <section className="space-y-4 min-w-0">
    <header className="rounded-2xl bg-stone-900 text-white p-4 sm:p-6">
      <h2 className="text-2xl font-bold">{de ? 'Eine Fuge. Drei Pflanzen. Dein Deck.' : 'One crack. Three plants. Your deck.'}</h2>
      <p className="mt-2 text-sm">{de ? 'Spiele eine Aktion pro Saison, unterstütze eine Pflanze und halte die anderen am Leben. Unbenutzte Karten bleiben auf der Hand.' : 'Play one action each season, support one plant and keep the others alive. Unplayed cards stay in your hand.'}</p>
      <p className="mt-2 text-sm text-amber-200">{de ? 'Spielprototyp: Merkmalswerte, Reserven und Deckungsänderungen sind Spielregeln, keine ökologische Vorhersage. Die Fähigkeiten des Einzelduells gelten hier nicht. Ausbreitung steht je nach Art für Samen, Sporen oder vegetatives Wachstum.' : 'Game prototype: trait scores, reserves and coverage changes are game rules, not ecological predictions. Single-duel abilities do not apply here. Dispersal stands for seeds, spores or vegetative spread.'}</p>
    </header>
    {!game && <div className="rounded-xl border bg-white p-4 space-y-3">
      <h3 className="font-bold">{de ? 'Deine Gemeinschaft zusammenstellen' : 'Build your community'}</h3>
      {ids.map((id, index) => <label key={index} className="block text-sm">{de ? 'Pflanze' : 'Plant'} {index + 1}
        <select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={id} onChange={e => setIds(ids.map((old, i) => i === index ? e.target.value : old))}>
          {FUGENDUELL_STARTER_ROSTER.filter(p => !p.bannedFromRanked).map(p => <option key={p.id} value={p.id}>{name(p.id)}</option>)}
        </select></label>)}
      <label className="block text-sm">{de ? 'Lebensraum' : 'Habitat'}<select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={habitat} onChange={e => setHabitat(e.target.value as Habitat)}>
        <option value="pavement">{de ? 'Gehweg · neutraler Spielkontext' : 'Pavement · neutral context'}</option><option value="wall">{de ? 'Mörtelwand · +2 für ausgewählte Mauerarten' : 'Mortar wall · +2 for selected wall species'}</option><option value="roadside">{de ? 'Streusalzrand · im Winter −1 für alle' : 'Salted roadside · −1 for all in winter'}</option>
      </select></label>
      <label className="block text-sm">{de ? 'Startzahl · gleiche Zahl = gleiche Kartenfolge' : 'Seed · same number = same card sequence'}<input type="number" min="0" max="4294967295" step="1" className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={seed} onChange={e => setSeed(e.target.value)} /></label>
      <button onClick={start} className="min-h-11 rounded-lg bg-emerald-800 px-4 text-white font-bold">{de ? 'Saison beginnen' : 'Start season'}</button>
      {error && <p role="alert" className="text-rose-800">{error}</p>}
    </div>}
    {game && <>
      <div className="rounded-xl border bg-white p-4 space-y-2">
        <h3 className="font-bold">{de ? 'Saison' : 'Season'} {game.round}/6 · {de ? SEASONAL_BATTLE_EVENTS[game.round - 1].monthDe : SEASONAL_BATTLE_EVENTS[game.round - 1].monthEn}</h3>
        <p>{de ? SEASONAL_BATTLE_EVENTS[game.round - 1].titleDe : SEASONAL_BATTLE_EVENTS[game.round - 1].titleEn}</p>
        {!game.winner && <p className="text-sm text-stone-600">{de ? 'Danach: ' : 'Coming next: '}{SEASONAL_BATTLE_EVENTS.slice(game.round, game.round + 2).map(e => de ? e.titleDe : e.titleEn).join(' → ') || (de ? 'Saisonende' : 'Season ends')}</p>}
        <div className="flex h-8 rounded-lg overflow-hidden bg-stone-200" aria-label={de ? 'Verteilung der Fläche' : 'Ground allocation'}>
          <div className="bg-emerald-700" style={{ width: `${cover(game.player)}%` }} /><div className="bg-rose-700" style={{ width: `${cover(game.rival)}%` }} />
        </div>
        <p className="text-sm">{de ? 'Du' : 'You'} {cover(game.player).toFixed(1)}% · {de ? 'Rivale' : 'Rival'} {cover(game.rival).toFixed(1)}% · {de ? 'Freier Boden' : 'Empty ground'} {emptyGround(game).toFixed(1)}%</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{game.player.plants.map((p, i) => <button key={p.id} disabled={!!game.winner} aria-pressed={target === i} onClick={() => setTarget(i)} className={`min-h-11 rounded-xl border-2 p-3 text-left ${target === i ? 'border-emerald-700 bg-emerald-50' : 'border-stone-200 bg-white'}`}>
        <strong>{name(p.id)}</strong><p className="text-sm mt-1">{p.cover.toFixed(1)}% · {de ? 'Reserve' : 'Reserve'} {p.reserve} · {de ? 'Wurzeln' : 'Roots'} +{p.roots} · {de ? 'Ausbreitung' : 'Dispersal'} +{p.seeds}</p>
      </button>)}</div>
      {!game.winner ? <div className="rounded-xl border bg-white p-4 space-y-3">
        <h3 className="font-bold">{de ? 'Deine Hand' : 'Your hand'} · {de ? 'Energie' : 'Energy'} {game.player.energy}/6</h3>
        <p className="text-sm">{de ? 'Ziel: ' : 'Target: '}{name(game.player.plants[target].id)}. {de ? '+2 Energie nach jeder Runde. Neue Karten bis Handgröße 3; Ablage wird neu gemischt.' : '+2 energy after each round. Refill to 3 cards; discard is reshuffled.'}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{game.player.hand.map((action, i) => <button key={`${action}-${i}`} disabled={ACTIONS[action].cost > game.player.energy} onClick={() => setGame(playCommunity(game, i, target, habitat))} className="min-h-24 rounded-xl border border-amber-400 bg-amber-50 p-3 text-left disabled:opacity-40">
          <strong>{de ? ACTIONS[action].de : ACTIONS[action].en}</strong><p className="text-sm mt-1">{de ? ACTIONS[action].noteDe : ACTIONS[action].noteEn}</p><p className="text-sm font-bold mt-2">{ACTIONS[action].cost} {de ? 'Energie · spielen' : 'energy · play'}</p>
        </button>)}</div>
      </div> : <div role="status" className="rounded-xl bg-amber-100 p-4 font-bold">{game.winner === 'draw' ? (de ? 'Gleichstand' : 'Draw') : game.winner === 'player' ? (de ? 'Deine Gemeinschaft gewinnt!' : 'Your community wins!') : (de ? 'Die rivalisierende Gemeinschaft gewinnt.' : 'The rival community wins.')}</div>}
      <details className="rounded-xl border bg-white p-4"><summary className="min-h-11 cursor-pointer font-bold">{de ? 'Rivale und Rundenprotokoll' : 'Rival and round log'}</summary>
        {game.rival.plants.map(p => <p key={p.id}>{name(p.id)}: {p.cover.toFixed(1)}% · reserve {p.reserve} · roots {p.roots} · seeds {p.seeds}</p>)}
        <p className="text-sm mt-2">{de ? 'Bot: unterstützt die aktuell schwächste Pflanze; bei niedrigen Reserven zuerst speichern. Die Kartenreihenfolge ist reproduzierbar.' : 'Bot: supports the weakest plant; prefers storage when reserves are low. Card order is reproducible.'}</p>
        <ol className="mt-3 space-y-2 text-sm font-mono">{game.log.map((line, i) => <li key={i}>{line}</li>)}</ol>
      </details>
      <button onClick={() => setGame(null)} className="min-h-11 rounded-lg border px-4">{de ? 'Zur Zusammenstellung' : 'Back to setup'}</button>
      <p className="text-sm text-stone-500">{de ? 'Keine Speicherung: Beim Verlassen beginnt eine neue Saison. Mit derselben Startzahl und denselben Aktionen lässt sie sich wiederholen.' : 'No saved progress: leaving starts a new season. Replay with the same seed and actions.'}</p>
    </>}
  </section>;
}

import React, { useState } from 'react';
import {
  Swords,
  Shield,
  Zap,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
  Calendar,
  Layers,
  Award,
  BookOpen,
  ShoppingBag,
  Leaf
} from 'lucide-react';
import { Language } from '../../types';
import {
  FUGENDUELL_STARTER_ROSTER,
  SEASONAL_BATTLE_EVENTS,
  PlantRosterItem
} from '../../data/fugenduellData';
import { TacticalStance, RoundResolutionResult } from '../../engine/fugenduell/types';
import { resolveDuelRound, calculateSeedReward } from '../../engine/fugenduell/battleEngine';

interface FugenduellArenaProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

type RoundLog = RoundResolutionResult;

export const FugenduellArena: React.FC<FugenduellArenaProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false
}) => {
  const isDe = lang === 'de';
  const isEs = lang === 'es';

  // Selected species
  const [playerSpeciesId, setPlayerSpeciesId] = useState<string>('taraxacum-officinale');
  const [aiSpeciesId, setAiSpeciesId] = useState<string>('plantago-major');

  // Game state
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [playerCoverage, setPlayerCoverage] = useState<number>(50); // 0 to 100%
  const [selectedTactic, setSelectedTactic] = useState<'root_reserve' | 'rapid_spurt' | 'toxin_defense' | 'balanced'>('balanced');
  const [battleLogs, setBattleLogs] = useState<RoundLog[]>([]);
  const [isBattleOver, setIsBattleOver] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<'arena' | 'roster' | 'economy' | 'rules'>('arena');

  // Seed market simulation
  const [collectedSeeds, setCollectedSeeds] = useState<number>(3);
  const [stewardedCracks, setStewardedCracks] = useState<string[]>([
    'Kollwitzstr. 42 (Dehnungsfuge)',
    'Oranienstr. 104 (Bordsteinkante)'
  ]);

  const playerPlant = FUGENDUELL_STARTER_ROSTER.find(p => p.id === playerSpeciesId) || FUGENDUELL_STARTER_ROSTER[0];
  const aiPlant = FUGENDUELL_STARTER_ROSTER.find(p => p.id === aiSpeciesId) || FUGENDUELL_STARTER_ROSTER[1];

  const currentEvent = SEASONAL_BATTLE_EVENTS[Math.min(currentRound - 1, SEASONAL_BATTLE_EVENTS.length - 1)];

  // Reset Duel
  const resetDuel = (newPlayerId?: string, newAiId?: string) => {
    if (newPlayerId) setPlayerSpeciesId(newPlayerId);
    if (newAiId) setAiSpeciesId(newAiId);
    setCurrentRound(1);
    setPlayerCoverage(50);
    setBattleLogs([]);
    setIsBattleOver(false);
  };

  // Resolve one seasonal battle round using modular battle engine
  const resolveRound = () => {
    if (isBattleOver || currentRound > 6) return;

    const roundLog = resolveDuelRound({
      playerPlant,
      aiPlant,
      event: currentEvent,
      currentRound,
      currentCoverage: playerCoverage,
      selectedTactic,
      lang: isDe ? 'de' : isEs ? 'es' : 'en',
    });

    setBattleLogs(prev => [roundLog, ...prev]);
    setPlayerCoverage(roundLog.newCoverage);

    if (roundLog.isBattleOver) {
      setIsBattleOver(true);
      const seedBonus = calculateSeedReward(roundLog.winner, roundLog.newCoverage);
      if (seedBonus > 0) {
        setCollectedSeeds(prev => prev + seedBonus);
      }
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-2xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono mb-2 border border-amber-500/30">
              <Swords className="w-3.5 h-3.5" />
              <span>{isDe ? 'Taktikspiel-Arena · Dose #11' : isEs ? 'Arena Táctica · Lata #11' : 'Tactical Arena · Tin #11'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title tracking-tight text-amber-50">
              {isDe ? 'Fugenduell: Asphaltritzen-Arena' : isEs ? 'Fugenduell: Duelo en el Asfalto' : 'Fugenduell: Sidewalk Crack Arena'}
            </h2>
            <p className="text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              {isDe
                ? '14 reale Pionierarten aus dem Berliner Asphalt im rundenbasierten Ökologie-Duell. Ausbalanciertes 36-Punkte-CSR-Budget, 6 saisonale Prüfungen und Pacht-Stewardship.'
                : '14 real sidewalk pioneer species in a turn-based botanical tug-of-war. Balanced 36-point CSR budget, 6 seasonal crises, and civic stewardship.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewTab('arena')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'arena'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5 inline mr-1" />
              {isDe ? 'Duell-Arena' : 'Duel Arena'}
            </button>
            <button
              onClick={() => setViewTab('roster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'roster'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 inline mr-1" />
              {isDe ? '14-Arten-Kader' : '14-Species Roster'}
            </button>
            <button
              onClick={() => setViewTab('economy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'economy'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 inline mr-1" />
              {isDe ? 'Pacht & Samen-Markt' : 'Stewardship & Seeds'}
            </button>
            <button
              onClick={() => setViewTab('rules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'rules'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 inline mr-1" />
              {isDe ? 'CSR-Regeln' : 'CSR Rules'}
            </button>

            {onOpenDose && (
              <button
                onClick={() => onOpenDose('fugenduell-asphalt-arena')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 border border-amber-400/40 transition-colors flex items-center gap-1.5"
              >
                <span>{isDe ? 'Dossier' : 'Dossier'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: DUEL ARENA */}
      {viewTab === 'arena' && (
        <div className="space-y-6">
          {/* Plant Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player Selection */}
            <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-50/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  {isDe ? 'Deine Pflanze (Pionier A)' : 'Your Plant (Pioneer A)'}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold">
                  {playerPlant.csrLabelDe}
                </span>
              </div>

              <select
                aria-label="Pflanze A wählen"
                value={playerSpeciesId}
                onChange={e => resetDuel(e.target.value, aiSpeciesId)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {FUGENDUELL_STARTER_ROSTER.map(plant => (
                  <option key={plant.id} value={plant.id} disabled={plant.bannedFromRanked}>
                    {plant.nameCommonDe} ({plant.scientificName}) {plant.bannedFromRanked ? '⛔ Gebannt' : ''}
                  </option>
                ))}
              </select>

              {/* Player Mini Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-white/70 p-2.5 rounded-lg border border-emerald-200">
                <div>WURZEL: <strong className="text-emerald-900">{playerPlant.stats.wurzel}</strong>/10</div>
                <div>TRITT: <strong className="text-emerald-900">{playerPlant.stats.tritt}</strong>/10</div>
                <div>DÜRRE: <strong className="text-emerald-900">{playerPlant.stats.duerre}</strong>/10</div>
                <div>SAAT: <strong className="text-emerald-900">{playerPlant.stats.saat}</strong>/10</div>
                <div>TEMPO: <strong className="text-emerald-900">{playerPlant.stats.tempo}</strong>/10</div>
                <div>CHEMIE: <strong className="text-emerald-900">{playerPlant.stats.chemie}</strong>/10</div>
              </div>

              <div className="text-xs text-stone-600 bg-white/90 p-2 rounded border border-emerald-100">
                <span className="font-semibold text-emerald-900">✨ {playerPlant.signatureSkill.nameDe}: </span>
                {playerPlant.signatureSkill.mechanismDe}
              </div>
            </div>

            {/* AI Opponent Selection */}
            <div className="rounded-xl border-2 border-rose-500/40 bg-rose-50/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-rose-700" />
                  {isDe ? 'Kiez-Konkurrent (Pionier B)' : 'Rival Plant (Pioneer B)'}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-semibold">
                  {aiPlant.csrLabelDe}
                </span>
              </div>

              <select
                aria-label="Pflanze B wählen"
                value={aiSpeciesId}
                onChange={e => resetDuel(playerSpeciesId, e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-lg p-2 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {FUGENDUELL_STARTER_ROSTER.map(plant => (
                  <option key={plant.id} value={plant.id} disabled={plant.bannedFromRanked}>
                    {plant.nameCommonDe} ({plant.scientificName}) {plant.bannedFromRanked ? '⛔ Gebannt' : ''}
                  </option>
                ))}
              </select>

              {/* AI Mini Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-white/70 p-2.5 rounded-lg border border-rose-200">
                <div>WURZEL: <strong className="text-rose-900">{aiPlant.stats.wurzel}</strong>/10</div>
                <div>TRITT: <strong className="text-rose-900">{aiPlant.stats.tritt}</strong>/10</div>
                <div>DÜRRE: <strong className="text-rose-900">{aiPlant.stats.duerre}</strong>/10</div>
                <div>SAAT: <strong className="text-rose-900">{aiPlant.stats.saat}</strong>/10</div>
                <div>TEMPO: <strong className="text-rose-900">{aiPlant.stats.tempo}</strong>/10</div>
                <div>CHEMIE: <strong className="text-rose-900">{aiPlant.stats.chemie}</strong>/10</div>
              </div>

              <div className="text-xs text-stone-600 bg-white/90 p-2 rounded border border-rose-100">
                <span className="font-semibold text-rose-900">✨ {aiPlant.signatureSkill.nameDe}: </span>
                {aiPlant.signatureSkill.mechanismDe}
              </div>
            </div>
          </div>

          {/* TUG OF WAR COVERAGE BAR */}
          <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {isDe ? 'Deckungsbalken in der Asphaltritze (Tug-of-War)' : 'Fissure Coverage Tug-of-War'}
                </span>
                <div className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span className="text-emerald-700">{playerCoverage}% {playerPlant.nameCommonDe}</span>
                  <span className="text-stone-400">vs</span>
                  <span className="text-rose-700">{100 - playerCoverage}% {aiPlant.nameCommonDe}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-stone-100 text-stone-700 font-mono">
                  {isDe ? `Runde ${currentRound} von 6` : `Round ${currentRound} of 6`}
                </span>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="relative h-6 bg-stone-200 rounded-full overflow-hidden flex border border-stone-300">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-start pl-2 text-[10px] font-bold text-white shadow-inner"
                style={{ width: `${playerCoverage}%` }}
              >
                {playerCoverage > 15 ? `${playerCoverage}%` : ''}
              </div>
              <div
                className="h-full bg-rose-500 transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-inner"
                style={{ width: `${100 - playerCoverage}%` }}
              >
                {100 - playerCoverage > 15 ? `${100 - playerCoverage}%` : ''}
              </div>
              {/* Midline marker */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/70 transform -translate-x-1/2" />
            </div>

            {/* Current Seasonal Event Card */}
            {!isBattleOver && currentEvent && (
              <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-800" />
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider font-mono">
                      {isDe ? currentEvent.monthDe : currentEvent.monthEn} · {isDe ? 'Saisonale Belastung' : 'Seasonal Crisis'}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    {isDe ? `Geprüfter Wert: ${currentEvent.statLabelDe}` : `Tested Trait: ${currentEvent.statLabelEn}`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">
                  {isDe ? currentEvent.titleDe : currentEvent.titleEn}
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {isDe ? currentEvent.narrativeDe : currentEvent.narrativeEn}
                </p>

                {/* Tactical Stance Selector */}
                <div className="pt-2 border-t border-amber-200/60 space-y-2">
                  <label className="text-xs font-bold text-stone-800 block">
                    {isDe ? 'Wähle deine botanische Taktik für diesen Monat:' : 'Choose your tactical response for this month:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setSelectedTactic('balanced')}
                      className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                        selectedTactic === 'balanced'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold">⚖️ {isDe ? 'Ausgewogen' : 'Balanced'}</div>
                      <div className="text-[10px] opacity-80">{isDe ? '+1 Grundwert' : '+1 Baseline'}</div>
                    </button>
                    <button
                      onClick={() => setSelectedTactic('root_reserve')}
                      className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                        selectedTactic === 'root_reserve'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold">🪵 {isDe ? 'Wurzelbunker' : 'Root Storage'}</div>
                      <div className="text-[10px] opacity-80">{isDe ? '+3 WURZEL/DÜRRE' : '+3 ROOT/DROUGHT'}</div>
                    </button>
                    <button
                      onClick={() => setSelectedTactic('rapid_spurt')}
                      className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                        selectedTactic === 'rapid_spurt'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold">🚀 {isDe ? 'Wachstumsspurt' : 'Speed Spurt'}</div>
                      <div className="text-[10px] opacity-80">{isDe ? '+3 TEMPO/SAAT' : '+3 SPEED/SEED'}</div>
                    </button>
                    <button
                      onClick={() => setSelectedTactic('toxin_defense')}
                      className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                        selectedTactic === 'toxin_defense'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold">🧪 {isDe ? 'Giftbarriere' : 'Toxic Defense'}</div>
                      <div className="text-[10px] opacity-80">{isDe ? '+3 CHEMIE/TRITT' : '+3 CHEM/TRAMPLE'}</div>
                    </button>
                  </div>
                </div>

                {/* Next Turn Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-amber-900 font-medium">
                    {isDe
                      ? `Rechnung: (${playerPlant.stats[currentEvent.testedStat]} Stat + Taktik + Skill) vs (${aiPlant.stats[currentEvent.testedStat]} Gegner + Skill)`
                      : `Formula: (${playerPlant.stats[currentEvent.testedStat]} Stat + Tactic + Skill) vs (${aiPlant.stats[currentEvent.testedStat]} Rival + Skill)`}
                  </span>

                  <button
                    onClick={resolveRound}
                    className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{isDe ? `Runde ${currentRound} ausfechten` : `Resolve Round ${currentRound}`}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Duel Completion Summary */}
            {isBattleOver && (
              <div className={`rounded-xl p-5 border text-center space-y-3 ${
                playerCoverage > 50
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : playerCoverage < 50
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}>
                <Award className="w-10 h-10 mx-auto text-amber-600 animate-bounce" />
                <h3 className="text-xl font-bold font-serif-title">
                  {playerCoverage > 50
                    ? (isDe ? `Sieg für ${playerPlant.nameCommonDe}! (${playerCoverage}%)` : `Victory for ${playerPlant.nameCommonEn}! (${playerCoverage}%)`)
                    : playerCoverage < 50
                    ? (isDe ? `${aiPlant.nameCommonDe} dominiert die Fuge! (${100 - playerCoverage}%)` : `${aiPlant.nameCommonEn} claims the crack! (${100 - playerCoverage}%)`)
                    : (isDe ? 'Ökologisches Gleichgewicht (50:50)' : 'Ecological Equilibrium (50:50)')}
                </h3>
                <p className="text-xs max-w-lg mx-auto leading-relaxed">
                  {playerCoverage > 50
                    ? (isDe
                      ? 'Du hast die Vorherrschaft in der Asphaltritze erobert. 2 Samen-Karten wurden deinem Pacht-Herbarium gutgeschrieben!'
                      : 'You secured dominant coverage in the pavement seam. 2 seed cards added to your stewardship herbarium!')
                    : (isDe
                      ? 'Die gegnerische Art konnte die extremen saisonalen Stressoren effektiver abfedern.'
                      : 'The rival species weathered seasonal stressors with higher phenotypic resilience.')}
                </p>

                <button
                  onClick={() => resetDuel()}
                  className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Neues Duell starten' : 'Start Rematch'}</span>
                </button>
              </div>
            )}
          </div>

          {/* ROUND BATTLE LOGS */}
          {battleLogs.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                {isDe ? 'Rundenprotokoll & Mathematische Auflösung' : 'Round Log & Mathematical Resolution'}
              </h4>

              <div className="space-y-2">
                {battleLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-stone-100 bg-stone-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-stone-900">
                        {log.month}: {log.eventName} ({log.testedStat})
                      </div>
                      <div className="text-[11px] text-stone-600">
                        {playerPlant.nameCommonDe} (Stat {log.playerStatValue} + Taktik {log.playerTacticBonus > 0 ? `+${log.playerTacticBonus}` : log.playerTacticBonus} + Skill +{log.skillBonusPlayer}) vs {aiPlant.nameCommonDe} (Stat {log.aiStatValue} + Skill +{log.skillBonusAi})
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono font-bold">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.coverageShift > 0
                          ? 'bg-emerald-100 text-emerald-900'
                          : log.coverageShift < 0
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-stone-200 text-stone-800'
                      }`}>
                        {log.coverageShift > 0 ? `+${log.coverageShift}%` : `${log.coverageShift}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ROSTER DIRECTORY */}
      {viewTab === 'roster' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-stone-700 leading-relaxed">
            <span className="font-bold text-amber-900">🌱 {isDe ? '14 Asphalthelden & CSR-Balancing:' : '14 Asphalt Heroes & CSR Balancing:'}</span>{' '}
            {isDe
              ? 'Jede Art verfügt über ein striktes Budget von maximal 36 Punkten über 6 ökologische Dimensionen (Wurzel, Tritt, Dürre, Saat, Tempo, Chemie), basierend auf empirischen Datenbanken wie UNDERPLOT, LEDA und SID Kew.'
              : 'Every species conforms to a strict 36-point budget across 6 ecological traits (Root, Trample, Drought, Seed, Speed, Chemistry), calibrated using peer-reviewed databases like UNDERPLOT, LEDA, and SID Kew.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FUGENDUELL_STARTER_ROSTER.map(plant => (
              <div
                key={plant.id}
                className={`p-4 rounded-xl border transition-all ${
                  plant.bannedFromRanked
                    ? 'border-rose-300 bg-rose-50/30'
                    : 'border-stone-200 bg-white hover:border-amber-400 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      {isDe ? plant.nameCommonDe : plant.nameCommonEn}
                    </h4>
                    <div className="text-xs text-stone-500 italic">
                      {plant.scientificName}
                    </div>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                    plant.bannedFromRanked
                      ? 'bg-rose-200 text-rose-900'
                      : 'bg-stone-100 text-stone-800'
                  }`}>
                    {plant.csrLabelDe}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1.5 text-[11px] bg-stone-50 p-2 rounded-lg border border-stone-100 font-mono">
                  <div>WURZEL: <strong>{plant.stats.wurzel}</strong></div>
                  <div>TRITT: <strong>{plant.stats.tritt}</strong></div>
                  <div>DÜRRE: <strong>{plant.stats.duerre}</strong></div>
                  <div>SAAT: <strong>{plant.stats.saat}</strong></div>
                  <div>TEMPO: <strong>{plant.stats.tempo}</strong></div>
                  <div>CHEMIE: <strong>{plant.stats.chemie}</strong></div>
                </div>

                <div className="mt-2 text-xs text-stone-700 bg-amber-50/40 p-2 rounded border border-amber-100">
                  <strong className="text-amber-900">✨ {isDe ? plant.signatureSkill.nameDe : plant.signatureSkill.nameEn}:</strong>{' '}
                  {isDe ? plant.signatureSkill.mechanismDe : plant.signatureSkill.mechanismEn}
                </div>

                <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>📍 {isDe ? plant.urbanHabitatDe : plant.urbanHabitatEn}</span>
                  <span className="font-semibold text-stone-600">Budget: {plant.totalBudget}/36</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STEWARDSHIP & SEED MARKET */}
      {viewTab === 'economy' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold font-serif-title text-stone-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              {isDe ? 'Pacht- und Chronisten-Modell (Stewardship statt Besitz)' : 'Stewardship Custody Model'}
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              {isDe
                ? 'Im Fugenduell können reale Pflanzen in der Natur niemals gekauft, gefangen oder besessen werden. Die echte Pflanze im Asphalt gehört der städtischen Allmende. Du übernimmst als „Chronist" eine Pachtpatenschaft für eine bestimmte Fuge, dokumentierst ihr Wachstum und verdienst handelbare Samen-Karten.'
                : 'In Fugenduell, wild organisms can never be commodified, captured, or owned. The wild plant belongs to the urban commons. Players act as civic chroniclers who adopt caretaking stewardship for specific sidewalk cracks.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  {isDe ? 'Verfügbare Samen-Karten' : 'Available Seed Cards'}
                </span>
                <div className="text-2xl font-bold font-mono text-amber-950">
                  {collectedSeeds} <span className="text-xs font-normal text-amber-800">{isDe ? 'Samen im Beutel' : 'Seeds in pouch'}</span>
                </div>
                <div className="text-[11px] text-amber-800 mt-2">
                  {isDe ? 'Gewinne Duelle oder logge reale Fotos in #Krautschau, um neue Samen freizuschalten.' : 'Win duels or submit verified photos via #Krautschau to earn seeds.'}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  {isDe ? 'Gepachtete Asphaltritzen (Stewardship)' : 'Stewarded Fissures'}
                </span>
                <ul className="text-xs text-stone-800 space-y-1 mt-1">
                  {stewardedCracks.map((crack, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-600">✓</span> {crack}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CSR RULES */}
      {viewTab === 'rules' && (
        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4 shadow-xs text-xs text-stone-700 leading-relaxed">
          <h3 className="text-base font-bold font-serif-title text-stone-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            {isDe ? 'Wissenschaftliche Grundlagen: Das Grime-Dreieck (CSR)' : 'Scientific Basis: Grimes CSR Framework'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1">
              <strong className="text-blue-900 block font-bold">C – Competitor (Konkurrent)</strong>
              <p>Große Biomasse, breites Blattwerk, hohe Lichtausbeute. Dominiert bei ungestörtem Boden, verliert sofort bei starkem Tritt und Kehrmaschinen.</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
              <strong className="text-amber-900 block font-bold">S – Stress-Tolerator (Stresstolerant)</strong>
              <p>Wächst extrem langsam, übersteht monatelange Dürre, Streusalz und alkalischen Kalkstein (z. B. Mauerraute, Silbermoos).</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
              <strong className="text-emerald-900 block font-bold">R – Ruderal (Pionier)</strong>
              <p>Explosive Samenproduktion und schnelles Wachstum in gestörten Zonen (z. B. Rispengras, Schaumkraut). Investiert alles in die nächste Generation.</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-stone-600">
            <span className="font-bold text-stone-900">Fair-Play-Garantie:</span>{' '}
            {isDe
              ? 'Kein Gacha, kein Pay-to-Win. Die Werte sind durch reale Pflanzeneigenschaften gebunden. Wer den mikroklimatischen Kontext versteht, gewinnt.'
              : 'Zero pay-to-win, zero predatory lootboxes. Stats are constrained by actual botanical traits.'}
          </div>
        </div>
      )}
    </div>
  );
};

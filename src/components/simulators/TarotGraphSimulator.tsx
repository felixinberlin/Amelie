import React, { useState, useMemo } from 'react';
import {
  Compass,
  Shuffle,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  FileCode,
  Layers,
  ArrowRight,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Eye,
} from 'lucide-react';
import {
  BUILT_IN_SPREADS,
  TAROT_DECK,
  SpreadDefinition,
  DrawnCardPlacement,
  evaluateSpreadEdge,
  EvaluatedEdge,
  TarotElement,
} from '../../engine/tarot/tarotEngine';

interface TarotGraphSimulatorProps {
  onOpenDose?: (doseId: string) => void;
  lang?: 'de' | 'en' | 'es';
}

export const TarotGraphSimulator: React.FC<TarotGraphSimulatorProps> = ({
  onOpenDose,
  lang = 'de',
}) => {
  const [spreadKey, setSpreadKey] = useState<string>('celtic-cross');
  const [placements, setPlacements] = useState<Record<string, DrawnCardPlacement>>({});
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>('heart_situation');
  const [selectedEdgeIndex, setSelectedEdgeIndex] = useState<number | null>(0);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const isDe = lang === 'de';
  const currentSpread: SpreadDefinition = BUILT_IN_SPREADS[spreadKey] || BUILT_IN_SPREADS['celtic-cross'];

  // Draw cards into all slots
  const handleShuffleAndDraw = () => {
    setIsDrawing(true);
    const shuffledDeck = [...TAROT_DECK].sort(() => Math.random() - 0.5);
    const newPlacements: Record<string, DrawnCardPlacement> = {};

    currentSpread.slots.forEach((slot, index) => {
      const card = shuffledDeck[index % shuffledDeck.length];
      const isReversed = currentSpread.deckContract.allowReversals ? Math.random() < 0.25 : false;
      newPlacements[slot.id] = {
        slotId: slot.id,
        card,
        isReversed,
      };
    });

    setTimeout(() => {
      setPlacements(newPlacements);
      setIsDrawing(false);
      setSelectedSlotId(currentSpread.slots[0].id);
      setSelectedEdgeIndex(0);
    }, 200);
  };

  // Initial draw if empty
  React.useEffect(() => {
    handleShuffleAndDraw();
  }, [spreadKey]);

  // Evaluate all edges dynamically
  const evaluatedEdges: EvaluatedEdge[] = useMemo(() => {
    return currentSpread.relations.map((relation) => {
      const sourcePlacement = placements[relation.source];
      const targetPlacement = placements[relation.target];
      return evaluateSpreadEdge(relation, sourcePlacement, targetPlacement);
    });
  }, [currentSpread, placements]);

  const activeSlot = currentSpread.slots.find((s) => s.id === selectedSlotId);
  const activePlacement = selectedSlotId ? placements[selectedSlotId] : undefined;
  const activeEdge = selectedEdgeIndex !== null ? evaluatedEdges[selectedEdgeIndex] : null;

  // Element badge helper
  const renderElementIcon = (elem: TarotElement) => {
    switch (elem) {
      case 'fire':
        return <Flame className="w-3.5 h-3.5 text-amber-500 inline mr-1" />;
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-blue-400 inline mr-1" />;
      case 'air':
        return <Wind className="w-3.5 h-3.5 text-yellow-300 inline mr-1" />;
      case 'earth':
        return <Mountain className="w-3.5 h-3.5 text-emerald-500 inline mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#261d18] text-[#f5ebd9] border border-[#5c4436] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-typewriter font-bold bg-[#c5832b]/25 text-[#f6bd60] border border-[#c5832b]/40">
              ✦ Open Source Spread DSL Demo
            </span>
            <span className="text-xs font-typewriter text-stone-400">Draft 2020-12</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-amelie font-bold text-[#faf4e8]">
            {isDe ? 'Tarot-Zustandsmaschine: Beziehungs-Graph & Topologie' : 'Tarot State Machine: Relational Graph & Topology'}
          </h3>
          <p className="text-xs text-stone-300 max-w-xl font-sans">
            {isDe
              ? 'Weder Esoterik noch feste Textprosa: Legesysteme als gerichtete Graphen. Berechnet elementare Würden (Golden Dawn), Überlagerungen (90° Drehung) und Reversals als Blockaden.'
              : 'Neither fortune-telling nor static prose: Spreads modeled as typed directed graphs with elemental dignities, orthogonal layers, and reversal flow blocks.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <select
            value={spreadKey}
            onChange={(e) => setSpreadKey(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#3b2b23] border border-[#6b5243] text-xs font-typewriter font-semibold text-[#f5ebd9] focus:outline-hidden cursor-pointer"
          >
            <option value="celtic-cross">{isDe ? 'Keltisches Kreuz (10 Slots)' : 'Celtic Cross (10 Slots)'}</option>
            <option value="three-card">{isDe ? '3-Karten-Zeitstrahl' : 'Three-Card Timeline'}</option>
          </select>

          <button
            onClick={handleShuffleAndDraw}
            disabled={isDrawing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c5832b] hover:bg-[#b07323] text-white text-xs font-typewriter font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isDrawing ? 'animate-spin' : ''}`} />
            <span>{isDe ? 'Neu ziehen' : 'Redraw'}</span>
          </button>

          <button
            onClick={() => setShowJsonInspector((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-typewriter font-semibold transition-colors cursor-pointer ${
              showJsonInspector
                ? 'bg-[#8c1d40] text-white border-[#701531]'
                : 'bg-[#3b2b23] hover:bg-[#4a362c] text-[#f5ebd9] border-[#6b5243]'
            }`}
            title="JSON Schema Inspector"
          >
            <FileCode className="w-3.5 h-3.5 text-[#f6bd60]" />
            <span className="hidden md:inline">DSL JSON</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Board Layout vs Relationship Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Spatial Layout Canvas */}
        <div className="lg:col-span-8 bg-[#1f1713] rounded-3xl border-2 border-[#5c4436] p-6 shadow-inner relative flex flex-col justify-between min-h-[520px]">
          {/* Canvas Subheader / Legend */}
          <div className="flex items-center justify-between pb-3 border-b border-[#3d2d24] text-xs font-typewriter text-[#d8cbba]">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#f6bd60]">{currentSpread.nameDe}</span>
              <span className="text-[11px] text-stone-400">({currentSpread.slots.length} Slots · {currentSpread.relations.length} Relationen)</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> + Nährend
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> - Spannung
              </span>
            </div>
          </div>

          {/* SVG Connection Lines overlay */}
          <div className="relative w-full h-[440px] my-auto">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#c5832b" opacity="0.6" />
                </marker>
              </defs>
              {evaluatedEdges.map((edge, idx) => {
                const sSlot = currentSpread.slots.find((s) => s.id === edge.relation.source);
                const tSlot = currentSpread.slots.find((s) => s.id === edge.relation.target);
                if (!sSlot || !tSlot) return null;

                const isSelected = selectedEdgeIndex === idx;
                const strokeColor =
                  edge.effectiveTension < -0.3
                    ? '#f87171' // Red conflict
                    : edge.effectiveTension > 0.2
                    ? '#34d399' // Green supportive
                    : '#c5832b'; // Amber neutral

                return (
                  <line
                    key={idx}
                    x1={`${sSlot.layout.x}%`}
                    y1={`${sSlot.layout.y}%`}
                    x2={`${tSlot.layout.x}%`}
                    y2={`${tSlot.layout.y}%`}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    strokeDasharray={edge.relation.type === 'leads_to' ? '4 3' : undefined}
                    opacity={isSelected ? 0.95 : 0.45}
                  />
                );
              })}
            </svg>

            {/* Position Slots rendered from Layout Coordinates */}
            {currentSpread.slots.map((slot) => {
              const placement = placements[slot.id];
              const isSelected = selectedSlotId === slot.id;
              const isCrossing = slot.layout.rotation === 90;

              return (
                <div
                  key={slot.id}
                  onClick={() => {
                    setSelectedSlotId(slot.id);
                    // Select edge where this slot is source or target
                    const foundEdge = evaluatedEdges.findIndex(
                      (e) => e.relation.source === slot.id || e.relation.target === slot.id
                    );
                    if (foundEdge !== -1) setSelectedEdgeIndex(foundEdge);
                  }}
                  style={{
                    left: `${slot.layout.x}%`,
                    top: `${slot.layout.y}%`,
                    transform: `translate(-50%, -50%) rotate(${slot.layout.rotation}deg)`,
                    zIndex: isSelected ? 30 : slot.layout.layer === 1 ? 20 : 10,
                  }}
                  className={`absolute w-20 sm:w-24 h-28 sm:h-32 rounded-xl p-2 cursor-pointer transition-all duration-200 select-none shadow-md flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 border-[#f6bd60] ring-4 ring-[#f6bd60]/30 bg-[#35251d]'
                      : 'border border-[#6b5243] hover:border-[#c5832b] bg-[#2a1e18]'
                  }`}
                >
                  {/* Slot Number & Role */}
                  <div className="flex items-center justify-between text-[9px] font-mono-code text-stone-300">
                    <span className="w-4 h-4 rounded-full bg-black/40 flex items-center justify-center font-bold text-[#f6bd60]">
                      {slot.order}
                    </span>
                    <span className="truncate max-w-[55px] uppercase">{slot.role}</span>
                  </div>

                  {/* Card Content or Placeholder */}
                  {placement ? (
                    <div className="text-center my-auto">
                      <div className="text-xs font-amelie font-bold text-[#fbf7f0] leading-tight line-clamp-2">
                        {placement.card.nameDe}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-stone-300 font-mono-code">
                        {renderElementIcon(placement.card.element)}
                        {placement.isReversed && (
                          <span className="text-[9px] px-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            REV
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-stone-500 font-typewriter">
                      {slot.labelDe}
                    </div>
                  )}

                  {/* Footer coordinate badge */}
                  <div className="text-[8px] font-mono-code text-stone-400 text-center truncate">
                    ({slot.layout.x}%, {slot.layout.y}%)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#3d2d24] text-[11px] font-typewriter text-stone-400 flex items-center justify-between">
            <span>Klicke auf einen Slot oder eine Kante zur relationalen Inspektion.</span>
            <span className="font-mono-code text-[#f6bd60]">deckContract: {currentSpread.deckContract.minCards} cards min</span>
          </div>
        </div>

        {/* Right: Relational Topology Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Card Inspector */}
          {activeSlot && activePlacement && (
            <div className="p-5 rounded-2xl bg-[#faf5eb] border border-[#d8cbba] space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e5dac8] pb-2">
                <span className="text-xs font-typewriter font-bold uppercase tracking-wider text-[#8c1d40]">
                  Slot {activeSlot.order}: {activeSlot.labelDe}
                </span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white border border-[#d8cbba] text-[#5c4a3d]">
                  {activeSlot.role}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-amelie font-bold text-[#2b1e16]">
                  {activePlacement.card.nameDe}{' '}
                  {activePlacement.isReversed && (
                    <span className="text-xs text-rose-700 italic font-sans font-normal">(Umgekehrt / Reversal)</span>
                  )}
                </h4>
                <p className="text-xs text-[#5c4a3d] font-typewriter mt-0.5">
                  Element: <span className="font-bold capitalize">{activePlacement.card.element}</span> · Archetyp:{' '}
                  {activePlacement.card.archetype}
                </p>
              </div>

              {/* Keywords */}
              <div className="space-y-1">
                <span className="text-[10px] font-typewriter uppercase text-[#8b6f57] font-bold block">
                  {activePlacement.isReversed ? 'Reversal-Schlüsselworte' : 'Aufrechte Schlüsselworte'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {(activePlacement.isReversed
                    ? activePlacement.card.reversedKeywordsDe
                    : activePlacement.card.keywordsDe
                  ).map((kw, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#d8cbba] text-[#2b1e16] font-typewriter"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-[#6b5647] font-sans leading-relaxed pt-1">
                <strong>Symbolik:</strong> {activePlacement.card.symbolism}
              </div>
            </div>
          )}

          {/* Relational Edge List */}
          <div className="p-5 rounded-2xl bg-[#2b1e16] text-[#fbf7f0] border border-[#5c4a3d] space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#5c4a3d] pb-2">
              <h4 className="text-xs font-typewriter font-bold uppercase tracking-wider text-[#f6bd60]">
                Typisierte Beziehungs-Kanten ({evaluatedEdges.length})
              </h4>
              <span className="text-[10px] font-mono-code text-stone-400">Elemental Dignities</span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {evaluatedEdges.map((edge, idx) => {
                const sName = currentSpread.slots.find((s) => s.id === edge.relation.source)?.labelDe || edge.relation.source;
                const tName = currentSpread.slots.find((s) => s.id === edge.relation.target)?.labelDe || edge.relation.target;
                const isSelected = selectedEdgeIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedEdgeIndex(idx)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#3b2a1c] border-[#f6bd60] text-white shadow-xs'
                        : 'bg-[#1f1713] border-[#4a362c] text-stone-300 hover:border-[#c5832b]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-typewriter">
                      <span className="font-bold text-[#f6bd60]">{edge.relation.type}</span>
                      <span
                        className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded ${
                          edge.effectiveTension < -0.3
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : edge.effectiveTension > 0.2
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        Spannung: {edge.effectiveTension > 0 ? `+${edge.effectiveTension}` : edge.effectiveTension}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-300 mt-1 flex items-center gap-1 truncate">
                      <span className="truncate">{sName}</span>
                      <ArrowRight className="w-3 h-3 text-[#c5832b] shrink-0" />
                      <span className="truncate">{tName}</span>
                    </div>

                    {isSelected && (
                      <p className="text-[11px] text-[#f6bd60]/90 font-sans mt-2 pt-2 border-t border-[#5c4a3d] leading-snug">
                        {edge.descriptionDe}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* JSON Schema Inspector Drawer */}
      {showJsonInspector && (
        <div className="p-6 rounded-3xl bg-[#1f1713] text-[#fbf7f0] border-2 border-[#c5832b] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#4a362c]">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#f6bd60]" />
              <h4 className="font-typewriter text-sm font-bold uppercase tracking-wider text-[#f6bd60]">
                Deklarative Spread-Definition: {currentSpread.name} (JSON DSL)
              </h4>
            </div>
            <button
              onClick={() => setShowJsonInspector(false)}
              className="text-xs text-stone-400 hover:text-white font-typewriter underline"
            >
              Schließen
            </button>
          </div>

          <pre className="font-mono-code text-[11px] leading-relaxed p-4 rounded-xl bg-black/60 border border-[#4a362c] text-emerald-400 overflow-x-auto max-h-[360px]">
            {JSON.stringify(currentSpread, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

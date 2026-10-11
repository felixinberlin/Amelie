import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Compass,
  Trophy,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  X,
  ArrowRight,
  BookOpen,
  Map,
} from 'lucide-react';
import { Language } from '../types';
import {
  HISTORIC_FLURNAMEN_CORPUS,
  FlurnameParcel,
  evaluateParcelGuess,
  GuessEvaluation,
} from '../engine/zen-games/flurnamenEngine';

interface FlurnamenGameModalProps {
  lang: Language;
  onClose: () => void;
}

const pick = (lang: Language, de: string, en: string, es: string) =>
  lang === 'de' ? de : lang === 'es' ? es : en;

export const FlurnamenGameModal: React.FC<FlurnamenGameModalProps> = ({ lang, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [parcels] = useState<FlurnameParcel[]>(() =>
    [...HISTORIC_FLURNAMEN_CORPUS].sort(() => Math.random() - 0.5).slice(0, 5)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [evaluation, setEvaluation] = useState<GuessEvaluation | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentParcel = parcels[currentIdx];

  // Draw the historical cadastral map
  const drawCadastralMap = useCallback(
    (evalResult: GuessEvaluation | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Antique Parchment Background
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#f9f6ed');
      bgGrad.addColorStop(0.5, '#f4eee0');
      bgGrad.addColorStop(1, '#eee6d2');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle paper grain / grid lines (historical cadastral coordinates)
      ctx.strokeStyle = 'rgba(180, 160, 130, 0.25)';
      ctx.lineWidth = 1;
      for (let x = 40; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 40; y < h; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Landscape Features (Topography & Water)
      // A. Peat bog in bottom left (Teufelsmoor area)
      ctx.fillStyle = 'rgba(120, 140, 110, 0.25)';
      ctx.beginPath();
      ctx.ellipse(w * 0.28, h * 0.82, w * 0.18, h * 0.14, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(100, 120, 90, 0.4)';
      ctx.stroke();

      // B. Meandering Village Stream (Bachlauf)
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.45);
      ctx.bezierCurveTo(w * 0.3, h * 0.42, w * 0.4, h * 0.65, w * 0.65, h * 0.55);
      ctx.bezierCurveTo(w * 0.8, h * 0.48, w * 0.9, h * 0.7, w, h * 0.68);
      ctx.stroke();

      // C. Church steeple & village nucleus (Kirchdorf)
      ctx.fillStyle = '#78350f';
      const villageX = w * 0.48;
      const villageY = h * 0.48;
      ctx.beginPath();
      ctx.arc(villageX, villageY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#451a03';
      ctx.font = 'bold 10px serif';
      ctx.textAlign = 'center';
      ctx.fillText('⛪ Kirchdorf', villageX, villageY - 10);

      // D. High Ridge & Windmill in top-right (Galgenberg area)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.ellipse(w * 0.82, h * 0.2, w * 0.14, h * 0.1, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(107, 114, 128, 0.6)';
      ctx.font = 'italic 9px serif';
      ctx.fillText('▲ Kuppe (exponiert)', w * 0.82, h * 0.18);

      // E. Deep Forested Hollow in bottom-right (Wolfskuhle area)
      ctx.fillStyle = 'rgba(22, 101, 52, 0.22)';
      ctx.beginPath();
      ctx.ellipse(w * 0.76, h * 0.78, w * 0.16, h * 0.13, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(20, 83, 45, 0.7)';
      ctx.font = 'italic 9px serif';
      ctx.fillText('🌲 Buchenwald-Senke', w * 0.76, h * 0.78);

      // F. Parish Boundary Line (Gemarkungsgrenze)
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4, 2, 4]);
      ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(185, 28, 28, 0.7)';
      ctx.font = '8px monospace';
      ctx.fillText('--- Gemarkungsgrenze ---', w * 0.5, 20);

      // 3. Draw Player Guess & Ground Truth (if evaluated)
      if (evalResult) {
        const guessX = (evalResult.guessXPercent / 100) * w;
        const guessY = (evalResult.guessYPercent / 100) * h;
        const targetX = (evalResult.parcel.targetXPercent / 100) * w;
        const targetY = (evalResult.parcel.targetYPercent / 100) * h;

        // Dotted error vector line
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(guessX, guessY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Player's Guess Pin (Blue)
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(guessX, guessY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Historical Target Pin (Gold / Emerald)
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Target Label
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 11px serif';
        ctx.textAlign = 'center';
        ctx.fillText(`📍 ${evalResult.parcel.name}`, targetX, targetY - 12);
      }
    },
    []
  );

  useEffect(() => {
    drawCadastralMap(evaluation);
  }, [drawCadastralMap, evaluation]);

  // Handle map click / tap to submit a guess
  const handleMapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (evaluation || completed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const guessXPercent = (clickX / rect.width) * 100;
    const guessYPercent = (clickY / rect.height) * 100;

    const result = evaluateParcelGuess(currentParcel, guessXPercent, guessYPercent);
    setEvaluation(result);
    setTotalScore((prev) => prev + result.score);

    if (result.score >= 75) {
      try {
        void confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#38bdf8'],
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleNextRound = () => {
    if (currentIdx + 1 < parcels.length) {
      setCurrentIdx((prev) => prev + 1);
      setEvaluation(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setEvaluation(null);
    setTotalScore(0);
    setCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Map className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-50">
                {pick(
                  lang,
                  'Flurnamen-Detektiv: Ticket 01 Prototyp',
                  'Field-Name Detective: Ticket 01 Prototype',
                  'Detective de toponimia: Prototipo Ticket 01'
                )}
              </h3>
              <p className="text-xs text-stone-300">
                {pick(
                  lang,
                  'Historisches Kataster-Verortungsspiel (Rostock / Thüringen Korpus)',
                  'Historical cadastral matching puzzle (Rostock / Thuringia corpus)',
                  'Juego de emparejamiento catastral histórico'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {!completed ? (
            <>
              {/* Progress & Prompt Box */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                      {pick(lang, `Runde ${currentIdx + 1} von ${parcels.length}`, `Round ${currentIdx + 1} of ${parcels.length}`, `Ronda ${currentIdx + 1} de ${parcels.length}`)}
                    </span>
                    <span className="text-xs font-semibold text-stone-600">
                      {currentParcel.region}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xl text-stone-900">
                    „{currentParcel.name}“
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed max-w-lg">
                    {pick(lang, currentParcel.clueDe, currentParcel.clueEn, currentParcel.clueEs)}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="block text-[10px] font-mono uppercase text-stone-500">
                    {pick(lang, 'Punkte', 'Score', 'Puntos')}
                  </span>
                  <span className="text-xl font-bold font-mono text-amber-700">{totalScore}</span>
                </div>
              </div>

              {/* Interactive Cadastral Map Viewport */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-inner bg-[#f4eee0]">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={320}
                  onClick={handleMapClick}
                  className={`w-full h-auto block select-none ${
                    evaluation ? 'cursor-default' : 'cursor-crosshair'
                  }`}
                />

                {!evaluation && (
                  <div className="absolute bottom-2.5 left-3 px-3 py-1 rounded-full bg-stone-900/75 backdrop-blur-xs text-[11px] text-amber-200 flex items-center gap-1.5 pointer-events-none">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {pick(
                        lang,
                        'Klicken Sie auf die Karte, um den Flurort zu schätzen',
                        'Click map to estimate parcel location',
                        'Haz clic en el mapa para estimar la ubicación'
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Evaluation Feedback */}
              {evaluation && (
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-stone-800">
                        {pick(
                          lang,
                          evaluation.ratingLabelDe,
                          evaluation.ratingLabelEn,
                          evaluation.ratingLabelEs
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                        Δ {evaluation.distanceMeters} m
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        +{evaluation.score} Pkt
                      </span>
                    </div>
                  </div>

                  {/* Historical Etymology / Lore */}
                  <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 space-y-1">
                    <span className="font-semibold text-stone-800 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      {pick(lang, 'Historische Namensbedeutung:', 'Historical Etymology:', 'Significado etimológico:')}
                    </span>
                    <p className="leading-relaxed italic">
                      {pick(
                        lang,
                        currentParcel.etymologyDe,
                        currentParcel.etymologyEn,
                        currentParcel.etymologyEs
                      )}
                    </p>
                  </div>

                  <button
                    onClick={handleNextRound}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>
                      {currentIdx + 1 < parcels.length
                        ? pick(lang, 'Nächster Flurname', 'Next Field Name', 'Siguiente parcela')
                        : pick(lang, 'Ergebnis anzeigen', 'View Final Score', 'Ver resultado final')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Final Scorecard Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-2xl text-stone-900">
                  {pick(lang, 'Toponymisches Gutachten abgeschlossen!', 'Toponymic Assessment Complete!', '¡Peritaje toponímico finalizado!')}
                </h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  {pick(
                    lang,
                    `Sie haben ${totalScore} von 500 Punkten erzielt. Dieses Mini-Spiel demonstriert den deterministischen Kern von Ticket 01 des Flurnamen-Verortungsspiels.`,
                    `You achieved ${totalScore} out of 500 points. This mini-game validates the deterministic Ticket 01 core of the field-name geolocation idea.`,
                    `Has obtenido ${totalScore} de 500 puntos. Este minijuego valida el núcleo determinista del Ticket 01.`
                  )}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{pick(lang, 'Erneut spielen', 'Play Again', 'Jugar de nuevo')}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors"
                >
                  {pick(lang, 'Schließen', 'Close', 'Cerrar')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

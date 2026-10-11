import React, { useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Scroll,
  Trophy,
  X,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types';
import {
  SONG_CI_CASES_CORPUS,
  ForensicCase,
  ForensicSuspectChoice,
  evaluateSongCiDeduction,
} from '../engine/zen-games/songCiEngine';

interface SongCiGameModalProps {
  lang: Language;
  onClose: () => void;
}

const pick = (lang: Language, de: string, en: string, es: string) =>
  lang === 'de' ? de : lang === 'es' ? es : en;

export const SongCiGameModal: React.FC<SongCiGameModalProps> = ({ lang, onClose }) => {
  const [cases] = useState<ForensicCase[]>(() => SONG_CI_CASES_CORPUS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<ForensicSuspectChoice | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentCase = cases[currentIdx];

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
  };

  // Sound 1: Guqin Saitenzupfer (Traditionelle pentatonische Holzsaite)
  const playGuqinPluck = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.exponentialRampToValueAtTime(216, now + 0.6);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  }, [isMuted]);

  // Sound 2: Bambus-Klapper (Paiban / 拍板 - Hölzerner trockener Anschlag)
  const playBambooClapper = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }, [isMuted]);

  // Sound 3: Bronze-Klangschale (Tongqing / 铜磬 - Schwebender Ausklang bei Lösung)
  const playBronzeGong = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [528, 1056, 1584];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.15 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + idx * 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    });
  }, [isMuted]);

  const handleSelectClue = (clueId: string) => {
    setSelectedClueId(clueId === selectedClueId ? null : clueId);
    playBambooClapper();
  };

  const handleChooseOption = (choice: ForensicSuspectChoice) => {
    if (selectedChoice) return;
    setSelectedChoice(choice);

    if (choice.isCorrect) {
      playBronzeGong();
      setTotalScore((prev) => prev + 100);
      void confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      playGuqinPluck();
      setTotalScore((prev) => prev + 25);
    }
  };

  const handleNextCase = () => {
    if (currentIdx + 1 < cases.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedClueId(null);
      setSelectedChoice(null);
      playGuqinPluck();
    } else {
      setCompleted(true);
      void confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedClueId(null);
    setSelectedChoice(null);
    setTotalScore(0);
    setCompleted(false);
  };

  const finalRanking = evaluateSongCiDeduction(totalScore);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-[#fbf7ee] border-2 border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header: Song-Dynastie Seidenrollen-Optik mit Zinnober-Siegel */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-b-2 border-amber-900/40 px-5 py-4 flex items-center justify-between text-amber-100 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-200 border border-amber-700/50 flex items-center justify-center shadow-inner font-serif text-lg font-black">
              洗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                  {currentCase.eraZh}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/80 border border-red-700/60 text-red-300 font-mono">
                  洗冤集录
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight font-serif text-amber-50">
                {pick(lang, currentCase.titleDe, currentCase.titleEn, currentCase.titleEs)}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-amber-300/80 hover:text-amber-100 hover:bg-white/10 transition-colors"
              title={isMuted ? 'Ton an' : 'Ton aus'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-amber-300/80 hover:text-amber-100 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {!completed ? (
            <>
              {/* Fall-Header & Ortsangabe */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-700 bg-amber-100/60 border border-amber-800/20 rounded-xl px-4 py-2.5 shadow-2xs">
                <span>
                  {pick(
                    lang,
                    `Fallakte ${currentIdx + 1} von ${cases.length}`,
                    `Case File ${currentIdx + 1} of ${cases.length}`,
                    `Expediente ${currentIdx + 1} de ${cases.length}`
                  )}
                </span>
                <span className="font-bold text-stone-900 font-serif">
                  {currentCase.locationZh} · {pick(lang, currentCase.locationDe, currentCase.locationEn, currentCase.locationDe)}
                </span>
                <span className="font-bold text-amber-900 font-mono">
                  {totalScore} {pick(lang, 'Richter-Punkte', 'Points', 'Puntos')}
                </span>
              </div>

              {/* Das Kriminalszenario (Parchment Box) */}
              <div className="relative bg-gradient-to-br from-amber-50 to-stone-100 border-2 border-stone-700/20 rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900/80 font-bold block">
                  {pick(lang, '📜 Historischer Tatbefund (1247)', '📜 Historical Crime Record (1247)', '📜 Registro judicial histórico')}
                </span>
                <p className="font-serif text-sm sm:text-base text-stone-900 leading-relaxed">
                  {pick(lang, currentCase.scenarioDe, currentCase.scenarioEn, currentCase.scenarioEs)}
                </p>
              </div>

              {/* Die 3 physikalischen Indizien / Ermittlungsschritte */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-stone-700 block">
                  {pick(
                    lang,
                    '🔍 Klicke die 3 forensischen Befunde an:',
                    '🔍 Examine the 3 forensic clues:',
                    '🔍 Examina las 3 pruebas forenses:'
                  )}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {currentCase.clues.map((clue) => {
                    const isSelected = selectedClueId === clue.id;
                    return (
                      <button
                        key={clue.id}
                        onClick={() => handleSelectClue(clue.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                          isSelected
                            ? 'bg-amber-100 border-amber-800 shadow-xs ring-2 ring-amber-700/20'
                            : 'bg-white hover:bg-amber-50/70 border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{clue.icon}</span>
                          <span className="font-bold text-xs font-serif text-stone-900">
                            {pick(lang, clue.nameDe, clue.nameEn, clue.nameEs)}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-500">
                          {clue.nameZh}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Ausgewählter Clue Text */}
                {selectedClueId && (
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-stone-800 font-serif leading-relaxed animate-fade-in shadow-2xs">
                    <strong className="text-amber-950 block font-mono text-[10px] uppercase mb-1">
                      {pick(lang, 'Befund-Detail:', 'Clue Finding:', 'Detalle del indicio:')}
                    </strong>
                    {(() => {
                      const c = currentCase.clues.find((x) => x.id === selectedClueId);
                      return c ? pick(lang, c.findingDe, c.findingEn, c.findingEs) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Die deduktive Richter-Entscheidung */}
              {!selectedChoice ? (
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-stone-700 block">
                    {pick(
                      lang,
                      '⚖️ Richterliches Urteil: Welcher physische Schluss ist zwingend?',
                      '⚖️ Judicial Verdict: Which physical deduction holds truth?',
                      '⚖️ Veredicto judicial: ¿Qué deducción física es irrebatible?'
                    )}
                  </span>

                  <div className="space-y-2">
                    {currentCase.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChooseOption(choice)}
                        className="w-full p-3.5 rounded-xl border-2 border-stone-800/40 bg-white hover:bg-stone-50 hover:border-stone-800 text-left font-serif text-xs sm:text-sm text-stone-900 leading-relaxed transition-all shadow-2xs flex items-start gap-2.5 group"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 border border-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          ?
                        </span>
                        <span>{pick(lang, choice.labelDe, choice.labelEn, choice.labelEs)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Fallauflösung & Originalzitat */
                <div className="bg-white border-2 border-stone-300 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
                  {/* Treffer-Stempel */}
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
                    <div
                      className={`px-3 py-1.5 rounded-lg border-2 font-mono text-xs font-black uppercase tracking-wider transform -rotate-1 shadow-xs ${
                        selectedChoice.isCorrect
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                          : 'bg-rose-100 text-rose-900 border-rose-600'
                      }`}
                    >
                      {selectedChoice.isCorrect
                        ? '★ 洗冤辨痕 · RICHTIG GEURTEILT'
                        : '✕ FEHLSCHLUSS IM VERHÖR'}
                    </div>
                    <span className="text-xs font-bold text-stone-800">
                      {selectedChoice.isCorrect
                        ? pick(lang, '(+100 Richter-Punkte)', '(+100 Points)', '(+100 puntos)')
                        : pick(lang, '(+25 Trostpunkte)', '(+25 Points)', '(+25 puntos)')}
                    </span>
                  </div>

                  {/* Erklärung des Befunds */}
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-serif bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                    {pick(
                      lang,
                      selectedChoice.explanationDe,
                      selectedChoice.explanationEn,
                      selectedChoice.explanationEs
                    )}
                  </p>

                  {/* Original-Zitat aus dem Xi Yuan Ji Lu */}
                  <div className="p-4 rounded-xl bg-stone-900 text-amber-100 space-y-2 border border-amber-900/50 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                        南宋法医文献 · 洗冤集录 (1247)
                      </span>
                      <span className="text-xs font-serif text-amber-300">宋慈 原著</span>
                    </div>
                    <p className="font-serif text-xs sm:text-sm text-amber-200/90 leading-relaxed italic border-l-2 border-amber-600 pl-3">
                      {currentCase.originalQuoteZh}
                    </p>
                    <p className="text-[11px] text-stone-300 font-serif leading-relaxed pt-1">
                      {pick(
                        lang,
                        currentCase.originalQuoteTranslationDe,
                        currentCase.originalQuoteTranslationEn,
                        currentCase.originalQuoteTranslationEn
                      )}
                    </p>
                  </div>

                  {/* Validierung durch moderne Kriminalistik */}
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-sans leading-relaxed">
                    <strong className="block text-[10px] uppercase font-mono text-blue-900 mb-0.5">
                      {pick(
                        lang,
                        'Moderne Bestätigung der Forensik:',
                        'Modern Forensic Validation:',
                        'Validación forense moderna:'
                      )}
                    </strong>
                    {pick(
                      lang,
                      currentCase.modernScienceValidationDe,
                      currentCase.modernScienceValidationEn,
                      currentCase.modernScienceValidationEn
                    )}
                  </div>

                  {/* Nächster Fall Button */}
                  <button
                    onClick={handleNextCase}
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>
                      {currentIdx + 1 < cases.length
                        ? pick(lang, 'Nächste Fallakte öffnen', 'Examine Next Case', 'Siguiente caso')
                        : pick(lang, 'Richter-Ernennung erhalten', 'Receive Judicial Rank', 'Ver graduación')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Abschluss: Das Kaiserliche Richter-Diplom */
            <div className="bg-white border-2 border-amber-900/40 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-amber-950 text-amber-200 border-2 border-amber-700 flex items-center justify-center mx-auto shadow-md font-serif text-2xl font-black">
                断
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono tracking-widest uppercase text-amber-800 font-bold block">
                  {pick(
                    lang,
                    'Kaiserliches Abschluss-Dekret · 南宋大理寺',
                    'Imperial Judicial Decree · Court of Judicature',
                    'Decreto judicial imperial'
                  )}
                </span>
                <h4 className="text-xl sm:text-2xl font-serif font-black text-stone-900">
                  {pick(lang, finalRanking.rankTitleDe, finalRanking.rankTitleEn, finalRanking.rankTitleZh)}
                </h4>
                <div className="inline-block mt-1 font-mono text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                  {totalScore} / {cases.length * 100} {pick(lang, 'Richter-Punkte', 'Points', 'Puntos')}
                </div>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed font-serif max-w-lg mx-auto bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                {pick(lang, finalRanking.verdictDe, finalRanking.verdictEn, finalRanking.verdictZh)}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {pick(lang, 'Fallakten erneut untersuchen', 'Review Cases Again', 'Revisar de nuevo')}
                  </span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors"
                >
                  {pick(lang, 'Zurück zur Spiele-Übersicht', 'Back to Games', 'Volver a juegos')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

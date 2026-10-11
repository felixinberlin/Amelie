import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CloudSun,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trophy,
  X,
  ArrowRight,
  Stamp,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Language } from '../types';
import {
  WEATHER_RULES_CORPUS,
  WeatherRule,
  RuleVerdict,
  evaluatePlayerWeatherVerdict,
  PlayerVerdictResult,
  calculateBureaucraticGrade,
} from '../engine/zen-games/bauernregelnEngine';

interface BauernregelnGameModalProps {
  lang: Language;
  onClose: () => void;
}

const pick = (lang: Language, de: string, en: string, es: string) =>
  lang === 'de' ? de : lang === 'es' ? es : en;

export const BauernregelnGameModal: React.FC<BauernregelnGameModalProps> = ({ lang, onClose }) => {
  const [rules] = useState<WeatherRule[]>(() =>
    [...WEATHER_RULES_CORPUS].sort(() => Math.random() - 0.5).slice(0, 5)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [evaluation, setEvaluation] = useState<PlayerVerdictResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentRule = rules[currentIdx];

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

  // Sound 1: Bürokratischer Amtsstempel (Dunkler satter Holzstempel-Aufschlag)
  const playStampSound = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    // Tiefes Holz-Aufprallgeräusch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    // Weißes Rauschen für das Kissen-Klatschen
    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  }, [isMuted]);

  // Sound 2: Klingt komisch, ist aber so (Heitere Maus-Quirke)
  const playChimeSound = useCallback((isCorrect: boolean) => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (isCorrect) {
      // Heiterer Dur-Akkord-Zweiklang
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    } else {
      // Trockenes Loriot-Pappnasen-Hupen
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }, [isMuted]);

  const handleSelectVerdict = (choice: RuleVerdict) => {
    if (evaluation || completed) return;
    playStampSound();

    const result = evaluatePlayerWeatherVerdict(currentRule, choice);
    setEvaluation(result);
    setTotalScore((prev) => prev + result.scoreAwarded);

    setTimeout(() => {
      playChimeSound(result.isCorrect);
    }, 150);

    if (result.isCorrect) {
      try {
        void confetti({
          particleCount: 35,
          spread: 45,
          origin: { y: 0.65 },
          colors: ['#0284c7', '#16a34a', '#f59e0b'],
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleNextRound = () => {
    if (currentIdx + 1 < rules.length) {
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

  const finalGrade = calculateBureaucraticGrade(totalScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-stone-100 rounded-3xl max-w-2xl w-full border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header im Stil des Deutschen Wetterdienstes / Behörden-Design */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-sky-800/40">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <CloudSun className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-sky-900 text-sky-200 border border-sky-700 font-bold">
                  DWD Offenbach · Ref. V
                </span>
                <span className="text-xs text-sky-300/80">Klingt komisch, ist aber so.</span>
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-sky-50">
                {pick(
                  lang,
                  'Bauernregeln vs. DWD: Das amtliche Wetterregel-Orakel',
                  'Folk Weather Rules vs. DWD: The Official Oracle',
                  'Refranes del campo vs. Servicio Meteorológico'
                )}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isMuted ? 'Ton an' : 'Ton aus'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {!completed ? (
            <>
              {/* Runde & Score Tracker */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-600 bg-white border border-stone-200 rounded-xl px-4 py-2.5 shadow-2xs">
                <span>
                  {pick(
                    lang,
                    `Fallakte ${currentIdx + 1} von ${rules.length}`,
                    `Case File ${currentIdx + 1} of ${rules.length}`,
                    `Expediente ${currentIdx + 1} de ${rules.length}`
                  )}
                </span>
                <span className="font-bold text-sky-800">
                  {currentRule.sourceRegion} · {currentRule.timing}
                </span>
                <span className="font-bold text-amber-700 font-mono">
                  {totalScore} {pick(lang, 'Amts-Punkte', 'Points', 'Puntos')}
                </span>
              </div>

              {/* Die Bauernregel in rustikalem Holz-Look */}
              <div className="relative bg-gradient-to-br from-amber-50 to-stone-50 border-2 border-amber-800/30 rounded-2xl p-6 shadow-sm text-center space-y-2 overflow-hidden">
                <span className="absolute top-2 left-3 text-3xl text-amber-900/10 font-serif select-none pointer-events-none">
                  „
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800/80 font-bold block">
                  {pick(lang, 'Überlieferte Bauernweisheit', 'Traditional Peasant Lore', 'Sabiduría popular')}
                </span>
                <p className="font-serif font-bold text-xl sm:text-2xl text-stone-900 leading-snug px-4">
                  „{pick(lang, currentRule.ruleDe, currentRule.ruleEn, currentRule.ruleEs)}“
                </p>
                <span className="text-xs text-stone-500 italic block">
                  {pick(
                    lang,
                    'Frage an den Bürger: Handelt es sich um ein physikalisches Signal oder schlichten Reimnotstand?',
                    'Official inquiry: Is this physical atmospheric signal or sheer desperate rhyming?',
                    'Consulta ciudadana: ¿Es señal física o mera rima forzada?'
                  )}
                </span>
              </div>

              {/* Auswahl-Optionen (Wenn noch nicht ausgewertet) */}
              {!evaluation ? (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block text-center">
                    {pick(
                      lang,
                      'Ihre gutachterliche Beurteilung abgeben:',
                      'Submit your expert appraisal:',
                      'Emite tu dictamen pericial:'
                    )}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Option 1: Echtes Signal */}
                    <button
                      onClick={() => handleSelectVerdict('signal')}
                      className="p-4 rounded-2xl bg-white border-2 border-emerald-500/40 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all shadow-xs group flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-2xl block mb-1">🔬</span>
                        <h4 className="font-bold text-sm text-emerald-950">
                          {pick(lang, 'Echtes Signal', 'Real Signal', 'Señal real')}
                        </h4>
                        <p className="text-[11px] text-stone-600 leading-tight">
                          {pick(
                            lang,
                            'Physikalische Kausalität oder statistische Singularität (Jetstream, Thermik).',
                            'Physical causality or genuine statistical singularity.',
                            'Causalidad física o singularidad estadística.'
                          )}
                        </p>
                      </div>
                      <span className="mt-3 text-[10px] font-mono text-emerald-700 font-semibold">
                        {pick(lang, '→ Als Signal einstufen', '→ Rate as signal', '→ Calificar como señal')}
                      </span>
                    </button>

                    {/* Option 2: Reimnotstand */}
                    <button
                      onClick={() => handleSelectVerdict('rhyme_emergency')}
                      className="p-4 rounded-2xl bg-white border-2 border-amber-500/40 hover:border-amber-600 hover:bg-amber-50/50 text-left transition-all shadow-xs group flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-2xl block mb-1">📝</span>
                        <h4 className="font-bold text-sm text-amber-950">
                          {pick(lang, 'Reimnotstand', 'Rhyme Emergency', 'Rima forzada')}
                        </h4>
                        <p className="text-[11px] text-stone-600 leading-tight">
                          {pick(
                            lang,
                            'Aberglaube oder schlichter Zwang zum Endreim (Potsdamer Korrelation r ≈ 0).',
                            'Superstition or forced rhyming (Potsdam correlation r ≈ 0).',
                            'Superstición o rima forzada sin base estadística.'
                          )}
                        </p>
                      </div>
                      <span className="mt-3 text-[10px] font-mono text-amber-700 font-semibold">
                        {pick(lang, '→ Als Reim einstufen', '→ Rate as rhyme', '→ Calificar como rima')}
                      </span>
                    </button>

                    {/* Option 3: Tautologie */}
                    <button
                      onClick={() => handleSelectVerdict('tautology')}
                      className="p-4 rounded-2xl bg-white border-2 border-purple-500/40 hover:border-purple-600 hover:bg-purple-50/50 text-left transition-all shadow-xs group flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-2xl block mb-1">🐔</span>
                        <h4 className="font-bold text-sm text-purple-950">
                          {pick(lang, 'Amtliche Tautologie', 'Pure Tautology', 'Tautología pura')}
                        </h4>
                        <p className="text-[11px] text-stone-600 leading-tight">
                          {pick(
                            lang,
                            '„…oder ’s bleibt wie ’s ist“. 100 % Justiziabilität bei 0 % Informationsgehalt.',
                            '"...or stays as it is". 100% legal immunity, 0% information gain.',
                            '"...o sigue igual". Inmunidad legal absoluta, información nula.'
                          )}
                        </p>
                      </div>
                      <span className="mt-3 text-[10px] font-mono text-purple-700 font-semibold">
                        {pick(lang, '→ Tautologie rügen', '→ Flag tautology', '→ Señalar tautología')}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Amtlicher DWD-Prüfbefund (Loriot / Die Maus Stil) */
                <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in relative overflow-hidden">
                  {/* Der Rote/Grüne Amtsstempel */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1.5 rounded-lg border-2 font-mono text-xs font-black uppercase tracking-wider transform -rotate-1 shadow-xs ${
                          currentRule.verdict === 'signal'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                            : currentRule.verdict === 'tautology'
                            ? 'bg-purple-100 text-purple-900 border-purple-600'
                            : 'bg-rose-100 text-rose-900 border-rose-600'
                        }`}
                      >
                        {currentRule.verdict === 'signal' && '★ AMTLICH BESTÄTIGT (DWD)'}
                        {currentRule.verdict === 'rhyme_emergency' && '✕ REIMNOTSTAND (VERWORFEN)'}
                        {currentRule.verdict === 'tautology' && '⚖ RECHTLICH UNANGREIFBAR'}
                      </div>
                      <span className="text-xs font-bold text-stone-800">
                        {evaluation.isCorrect
                          ? pick(lang, 'Richtige Beurteilung! (+100 Pkt)', 'Correct appraisal! (+100 pts)', '¡Dictamen correcto! (+100 pts)')
                          : pick(lang, 'Vom DWD korrigiert (+25 Pkt)', 'Corrected by DWD (+25 pts)', 'Corregido por el DWD (+25 pts)')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs text-stone-600">
                      <span>Brier-Skill:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          currentRule.brierSkillScore > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : currentRule.brierSkillScore === 0
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {currentRule.brierSkillScore > 0 ? '+' : ''}
                        {currentRule.brierSkillScore.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Amtlicher Prüfbericht */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wide block">
                      {pick(
                        lang,
                        currentRule.bureaucraticTitleDe,
                        currentRule.bureaucraticTitleEn,
                        currentRule.bureaucraticTitleEs
                      )}
                    </span>
                    <p className="text-sm text-stone-800 leading-relaxed font-sans bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {pick(
                        lang,
                        currentRule.dwdStatementDe,
                        currentRule.dwdStatementEn,
                        currentRule.dwdStatementEs
                      )}
                    </p>
                  </div>

                  {/* Weiter Button */}
                  <button
                    onClick={handleNextRound}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>
                      {currentIdx + 1 < rules.length
                        ? pick(lang, 'Nächste Akte zur Prüfung', 'Next Case File', 'Siguiente expediente')
                        : pick(lang, 'Amtliches Zeugnis ausstellen', 'Issue Official Certificate', 'Expedir certificado oficial')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Abschluss: Amtliche Ernennungsurkunde (Loriot-Stil) */
            <div className="bg-white border-2 border-stone-300 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-sky-800">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-sky-900 font-bold block">
                  {pick(
                    lang,
                    'Bundesrepublik Deutschland · DWD Prüfkommission',
                    'Federal Republic of Germany · DWD Audit Board',
                    'República Federal de Alemania · Comisión DWD'
                  )}
                </span>
                <h4 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                  {pick(lang, finalGrade.gradeTitleDe, finalGrade.gradeTitleEn, finalGrade.gradeTitleEs)}
                </h4>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-100 border border-amber-300 font-mono text-sm font-bold text-amber-900">
                  {totalScore} / 500 {pick(lang, 'Punkte erzielt', 'Points Achieved', 'Puntos logrados')}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200 italic">
                „{pick(lang, finalGrade.verdictReportDe, finalGrade.verdictReportEn, finalGrade.verdictReportEs)}“
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{pick(lang, 'Nachprüfung antreten', 'Re-examination', 'Repetir examen')}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  {pick(lang, 'Urkunde entgegennehmen & Schließen', 'Accept & Close', 'Aceptar y cerrar')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

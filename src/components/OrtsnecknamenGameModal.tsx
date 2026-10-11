import React, { useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Trophy,
  X,
  ArrowRight,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Music,
  Flame,
  Tv,
  Glasses,
} from 'lucide-react';
import { Language } from '../types';
import {
  ORTSNECKNAMEN_CORPUS,
  VillageMockeryEntry,
  evaluatePlayerMockeryGuess,
  PlayerMockeryGuessResult,
  calculateVillageFeudTitle,
} from '../engine/zen-games/ortsnecknamenEngine';

interface OrtsnecknamenGameModalProps {
  lang: Language;
  onClose: () => void;
}

const pick = (lang: Language, de: string, en: string, es: string) =>
  lang === 'de' ? de : lang === 'es' ? es : en;

type CulturalVoiceKey = 'aerzte' | 'onkelz' | 'maus' | 'loriot';

export const OrtsnecknamenGameModal: React.FC<OrtsnecknamenGameModalProps> = ({ lang, onClose }) => {
  const [entries] = useState<VillageMockeryEntry[]>(() =>
    [...ORTSNECKNAMEN_CORPUS].sort(() => Math.random() - 0.5)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [evaluation, setEvaluation] = useState<PlayerMockeryGuessResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<CulturalVoiceKey>('aerzte');

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentEntry = entries[currentIdx];

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

  // Sound 1: Punk-Akkord (Die Ärzte Hommage) - Knackiger verzerrter Powerchord
  const playPunkChord = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    // Drei Töne für den Powerchord (A, E, A)
    const freqs = [220, 330, 440];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + idx * 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  }, [isMuted]);

  // Sound 2: Deutschrock-Bass-Punch (Böhse Onkelz Hommage) - Tiefer, erdiger Sub-Drop
  const playHeavyBassPunch = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.28);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }, [isMuted]);

  // Sound 3: Die Maus "Plopp" / Maultrommel
  const playMausPlopp = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }, [isMuted]);

  // Sound 4: Loriot-Glockenspiel
  const playLoriotChime = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1174.66, now); // D6
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }, [isMuted]);

  const handleVoiceSelect = (voice: CulturalVoiceKey) => {
    setSelectedVoice(voice);
    if (voice === 'aerzte') playPunkChord();
    else if (voice === 'onkelz') playHeavyBassPunch();
    else if (voice === 'maus') playMausPlopp();
    else if (voice === 'loriot') playLoriotChime();
  };

  const handleChooseTown = (town: string) => {
    if (evaluation) return;

    const result = evaluatePlayerMockeryGuess(currentEntry, town);
    setEvaluation(result);
    setTotalScore((prev) => prev + result.scoreAwarded);

    if (result.isCorrect) {
      playPunkChord();
      void confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
      });
    } else {
      playHeavyBassPunch();
    }
  };

  const handleNextRound = () => {
    if (currentIdx + 1 < entries.length) {
      setCurrentIdx((prev) => prev + 1);
      setEvaluation(null);
      setSelectedVoice('aerzte');
    } else {
      setCompleted(true);
      void confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setEvaluation(null);
    setTotalScore(0);
    setCompleted(false);
    setSelectedVoice('aerzte');
  };

  const feudGrading = calculateVillageFeudTitle(totalScore);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-amber-50/95 border-2 border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header: Vintage German Ortsschild Style (Gelbes Schild mit schwarzem Rahmen) */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 border-b-4 border-stone-900 px-5 py-4 flex items-center justify-between text-stone-900 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-yellow-300 flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest font-black uppercase text-stone-800/80 block">
                {pick(lang, 'Ticket #1 Prototyp · Heimatgedächtnis', 'Ticket #1 Prototype · Local Lore', 'Prototipo Ticket #1 · Memoria local')}
              </span>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight font-serif flex items-center gap-1.5 text-stone-950">
                {pick(
                  lang,
                  'Ortsnecknamen: Das Große Dorfrivalitäts-Duell',
                  'Village Mockery: The Great Rural Feud Quiz',
                  'Motes populares: El gran duelo de pueblos rivales'
                )}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-stone-800 hover:text-stone-950 hover:bg-black/10 transition-colors"
              title={isMuted ? 'Ton an' : 'Ton aus'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-700" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-800 hover:text-stone-950 hover:bg-black/10 transition-colors"
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
              <div className="flex items-center justify-between text-xs font-mono text-stone-700 bg-white/80 border border-amber-900/20 rounded-xl px-4 py-2.5 shadow-2xs">
                <span>
                  {pick(
                    lang,
                    `Dorffehde ${currentIdx + 1} von ${entries.length}`,
                    `Feud ${currentIdx + 1} of ${entries.length}`,
                    `Duelo ${currentIdx + 1} de ${entries.length}`
                  )}
                </span>
                <span className="font-bold text-amber-900">
                  {pick(lang, currentEntry.regionDe, currentEntry.regionEn, currentEntry.regionEs)}
                </span>
                <span className="font-bold text-amber-800 font-mono">
                  {totalScore} {pick(lang, 'Ehren-Punkte', 'Feud Points', 'Puntos')}
                </span>
              </div>

              {/* Der historische Spottname in Wappen-Optik */}
              <div className="relative bg-gradient-to-br from-amber-100 to-orange-50 border-3 border-amber-900/30 rounded-2xl p-6 shadow-sm text-center space-y-2 overflow-hidden">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900/70 font-bold block">
                  {pick(lang, 'Überlieferter Spottname der Nachbardörfer', 'Historical Mockery Nickname', 'Mote popular histórico')}
                </span>
                <p className="font-serif font-black text-2xl sm:text-3xl text-amber-950 tracking-tight">
                  „{pick(lang, currentEntry.mockeryNameDe, currentEntry.mockeryNameEn, currentEntry.mockeryNameEs)}“
                </p>
                <span className="text-xs text-stone-600 italic block">
                  {pick(
                    lang,
                    'Welche geschichtsträchtige Stadt bzw. welches Dorf wird so verspottet?',
                    'Which historic town or village earned this mockery title?',
                    '¿A qué ciudad o pueblo histórico se le aplicaba esta burla?'
                  )}
                </span>
              </div>

              {/* Auswahl der 4 Ortschaften (Ortsschild-Optik) */}
              {!evaluation ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentEntry.options.map((town) => (
                      <button
                        key={town}
                        onClick={() => handleChooseTown(town)}
                        className="p-4 rounded-2xl border-2 border-stone-800 bg-yellow-300 hover:bg-yellow-400 text-stone-950 font-bold text-base transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shadow-sm flex items-center justify-center gap-2 group"
                      >
                        <MapPin className="w-4 h-4 text-stone-800 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>{town}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Auswertung & Das Deutsche Kultur-Forum */
                <div className="bg-white border-2 border-stone-300 rounded-2xl p-5 shadow-sm space-y-5 animate-fade-in relative overflow-hidden">
                  {/* Treffer / Fehler Stempel */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1.5 rounded-lg border-2 font-mono text-xs font-black uppercase tracking-wider transform -rotate-1 shadow-xs ${
                          evaluation.isCorrect
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                            : 'bg-rose-100 text-rose-900 border-rose-600'
                        }`}
                      >
                        {evaluation.isCorrect
                          ? pick(lang, '★ VOLLTREFFER IM BIERGARTEN', '★ DIRECT BULLSEYE', '★ ACIERTO TOTAL')
                          : pick(lang, '✕ VOM NACHBARDORF VERSPOTTET', '✕ MOCKED BY NEIGHBORS', '✕ BURLADO')}
                      </div>
                      <span className="text-xs font-bold text-stone-800">
                        {evaluation.isCorrect
                          ? pick(lang, 'Richtig geraten! (+100 Pkt)', 'Correct town! (+100 pts)', '¡Pueblo correcto! (+100 pts)')
                          : pick(lang, `Falsch! Es war ${currentEntry.correctTown} (+25 Pkt)`, `Wrong! It was ${currentEntry.correctTown} (+25 pts)`, `¡No! Era ${currentEntry.correctTown} (+25 pts)`)}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-stone-500">
                      {pick(lang, currentEntry.etymologyDe, currentEntry.etymologyEn, currentEntry.etymologyEs)}
                    </span>
                  </div>

                  {/* Die echte historische Dorflegende */}
                  <div className="space-y-1.5 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                    <span className="text-[11px] font-mono font-bold text-amber-900 uppercase tracking-wide block">
                      {pick(lang, '📜 Was damals wirklich geschah', '📜 What Actually Happened', '📜 Lo que realmente ocurrió')}
                    </span>
                    <p className="text-sm text-stone-800 leading-relaxed font-serif">
                      {pick(lang, currentEntry.legendDe, currentEntry.legendEn, currentEntry.legendEs)}
                    </p>
                  </div>

                  {/* Der Deutsche Kultur-Chor (Die Ärzte vs. Böhse Onkelz vs. Die Maus vs. Loriot) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase text-stone-700 tracking-wider">
                        {pick(lang, 'Deutscher Kultur-Kommentar', 'German Cultural Commentary', 'Comentario cultural alemán')}
                      </span>
                      <span className="text-[10px] text-stone-500 italic">
                        {pick(lang, 'Klicke eine Stimme an:', 'Click a perspective:', 'Elige una perspectiva:')}
                      </span>
                    </div>

                    {/* Umschalter für die 4 Kultur-Stimmen */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => handleVoiceSelect('aerzte')}
                        className={`p-2 rounded-xl border font-sans text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          selectedVoice === 'aerzte'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs scale-102'
                            : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        <Music className="w-3.5 h-3.5" />
                        <span>Die Ärzte (Punk)</span>
                      </button>

                      <button
                        onClick={() => handleVoiceSelect('onkelz')}
                        className={`p-2 rounded-xl border font-sans text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          selectedVoice === 'onkelz'
                            ? 'bg-stone-900 text-amber-400 border-black shadow-xs scale-102'
                            : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Böhse Onkelz</span>
                      </button>

                      <button
                        onClick={() => handleVoiceSelect('maus')}
                        className={`p-2 rounded-xl border font-sans text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          selectedVoice === 'maus'
                            ? 'bg-orange-500 text-white border-orange-600 shadow-xs scale-102'
                            : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>Die Maus</span>
                      </button>

                      <button
                        onClick={() => handleVoiceSelect('loriot')}
                        className={`p-2 rounded-xl border font-sans text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          selectedVoice === 'loriot'
                            ? 'bg-sky-700 text-white border-sky-800 shadow-xs scale-102'
                            : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        <Glasses className="w-3.5 h-3.5" />
                        <span>Loriot</span>
                      </button>
                    </div>

                    {/* Ausgewählter Kommentar-Text */}
                    <div
                      className={`p-4 rounded-xl border leading-relaxed text-sm transition-all ${
                        selectedVoice === 'aerzte'
                          ? 'bg-rose-50 border-rose-200 text-rose-950 font-sans'
                          : selectedVoice === 'onkelz'
                          ? 'bg-stone-900 border-stone-800 text-stone-200 font-serif'
                          : selectedVoice === 'maus'
                          ? 'bg-orange-50 border-orange-200 text-orange-950 font-sans'
                          : 'bg-sky-50 border-sky-200 text-sky-950 font-serif'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-black opacity-75">
                          {selectedVoice === 'aerzte' && '🎸 Punk-Zynismus (Die Ärzte)'}
                          {selectedVoice === 'onkelz' && '⚡ Erdiger Rock-Pathos (Böhse Onkelz)'}
                          {selectedVoice === 'maus' && '🐭 Sachgeschichte (Die Sendung mit der Maus)'}
                          {selectedVoice === 'loriot' && '🦆 Bürgerliche Etikette (Loriot)'}
                        </span>
                      </div>
                      <p className="italic">
                        {selectedVoice === 'aerzte' &&
                          pick(
                            lang,
                            currentEntry.culturalVoices.aerzteDe,
                            currentEntry.culturalVoices.aerzteEn,
                            currentEntry.culturalVoices.aerzteEn
                          )}
                        {selectedVoice === 'onkelz' &&
                          pick(
                            lang,
                            currentEntry.culturalVoices.onkelzDe,
                            currentEntry.culturalVoices.onkelzEn,
                            currentEntry.culturalVoices.onkelzEn
                          )}
                        {selectedVoice === 'maus' &&
                          pick(
                            lang,
                            currentEntry.culturalVoices.mausDe,
                            currentEntry.culturalVoices.mausEn,
                            currentEntry.culturalVoices.mausEn
                          )}
                        {selectedVoice === 'loriot' &&
                          pick(
                            lang,
                            currentEntry.culturalVoices.loriotDe,
                            currentEntry.culturalVoices.loriotEn,
                            currentEntry.culturalVoices.loriotEn
                          )}
                      </p>
                    </div>
                  </div>

                  {/* Nächste Runde Button */}
                  <button
                    onClick={handleNextRound}
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>
                      {currentIdx + 1 < entries.length
                        ? pick(lang, 'Nächste Dorf-Fehde lösen', 'Solve Next Feud', 'Resolver siguiente duelo')
                        : pick(lang, 'Dorfrivalitäts-Diplom abholen', 'Receive Village Feud Diploma', 'Recibir diploma')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Abschluss: Das Große Deutsche Dorfrivalitäts-Diplom */
            <div className="bg-white border-2 border-amber-900/40 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border-2 border-amber-300 shadow-sm">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono tracking-widest uppercase text-amber-800/80 font-bold block">
                  {pick(
                    lang,
                    'Heimatkundliches Abschlusszeugnis',
                    'Folkloric Graduation Diploma',
                    'Diploma de graduación popular'
                  )}
                </span>
                <h4 className="text-xl sm:text-2xl font-serif font-black text-stone-900">
                  {pick(lang, feudGrading.titleDe, feudGrading.titleEn, feudGrading.titleEs)}
                </h4>
                <div className="inline-block mt-1 font-mono text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                  {totalScore} / {entries.length * 100} {pick(lang, 'Ehren-Punkte', 'Points', 'Puntos')}
                </div>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed font-serif max-w-lg mx-auto bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                {pick(lang, feudGrading.verdictDe, feudGrading.verdictEn, feudGrading.verdictEs)}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {pick(lang, 'Erneut ins Scharmützel ziehen', 'Play Feud Again', 'Jugar de nuevo')}
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

import React, { useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Lightbulb, RotateCcw, Volume2, VolumeX, ArrowRight, Flame } from 'lucide-react';
import { Language } from '../types';
import {
  HOF_LEVELS,
  Board,
  hint as hintFor,
  isSolved,
  litCount,
  press,
  solve,
  startBoard,
  warmth,
} from '../engine/zen-games/hofLichterEngine';

interface HofLichterGameProps {
  lang: Language;
}

// Wer hinter dem Fenster wohnt — nur sichtbar, wenn Licht brennt.
const RESIDENTS = ['🪴', '🐈', '🫖', '📖', '🎻', '🍞', '🧶', '🕯️', '🎧', '🌷'];
// Pentatonische Töne, damit jedes Anknipsen freundlich klingt.
const NOTES = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

const pick = (lang: Language, de: string, en: string, es: string) => (lang === 'de' ? de : lang === 'es' ? es : en);

export const HofLichterGame: React.FC<HofLichterGameProps> = ({ lang }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = HOF_LEVELS[levelIdx];
  const [board, setBoard] = useState<Board>(() => startBoard(HOF_LEVELS[0]));
  const [moves, setMoves] = useState(0);
  const [hintCell, setHintCell] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState<Record<number, 1 | 2 | 3>>({});
  const audioRef = useRef<AudioContext | null>(null);

  const par = useMemo(() => solve(startBoard(level), level.rows, level.cols)?.length ?? level.scramble.length, [level]);
  const solved = isSolved(board);
  const stars = solved ? warmth(moves, par) : 0;

  const chime = (index: number) => {
    if (muted) return;
    try {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = NOTES[index % NOTES.length];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.72);
    } catch {
      // Ohne Ton geht es genauso.
    }
  };

  const loadLevel = (idx: number) => {
    setLevelIdx(idx);
    setBoard(startBoard(HOF_LEVELS[idx]));
    setMoves(0);
    setHintCell(null);
  };

  const handlePress = (index: number) => {
    if (solved) return;
    const next = press(board, level.rows, level.cols, index);
    setBoard(next);
    setMoves((m) => m + 1);
    setHintCell(null);
    chime(index);
    if (isSolved(next)) {
      const w = warmth(moves + 1, par);
      setDone((d) => ({ ...d, [level.id]: Math.max(d[level.id] ?? 0, w) as 1 | 2 | 3 }));
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, colors: ['#f6bd60', '#f4a259', '#fde68a', '#fff7ed'], scalar: 0.9 });
    }
  };

  const handleHint = () => setHintCell(hintFor(board, level.rows, level.cols));

  const title = pick(lang, level.titleDe, level.titleEn, level.titleEs);
  const note = pick(lang, level.noteDe, level.noteEn, level.noteEs);
  const hasNext = levelIdx < HOF_LEVELS.length - 1;

  return (
    <div
      id="hof-lichter-game"
      className="rounded-3xl overflow-hidden border border-[#3b2f5c]/40 shadow-md bg-gradient-to-b from-[#1e1b3a] via-[#3b2f5c] to-[#c2703d] text-amber-50"
    >
      <div className="p-5 md:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              {pick(lang, 'Amélies Hinterhof', "Amélie's Courtyard", 'El patio de Amélie')}
            </span>
            <h3 className="text-2xl font-serif font-bold">
              {pick(lang, 'Lichter im Hof', 'Lights in the Courtyard', 'Luces en el patio')}
            </h3>
            <p className="text-sm text-amber-100/85 max-w-xl leading-relaxed">
              {pick(
                lang,
                'Es wird Abend. Ein Fenster anknipsen schaltet auch die Nachbarfenster um. Bring alle zum Leuchten — mit so wenigen Handgriffen wie möglich.',
                'Evening is falling. Switching one window also flips the ones next to it. Get every window glowing, with as few taps as you can.',
                'Cae la tarde. Encender una ventana cambia también las vecinas. Enciende todas con los menos toques posibles.'
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleHint}
              disabled={solved}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-xs font-semibold border border-white/15 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-200" />
              {pick(lang, 'Hinweis', 'Hint', 'Pista')}
            </button>
            <button
              onClick={() => loadLevel(levelIdx)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/15 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {pick(lang, 'Neu', 'Reset', 'Reiniciar')}
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Sound on' : 'Sound off'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {HOF_LEVELS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => loadLevel(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                i === levelIdx ? 'bg-amber-200 text-[#3b2f5c] border-amber-100' : 'bg-white/10 text-amber-50 border-white/15 hover:bg-white/20'
              }`}
            >
              {l.id}. {pick(lang, l.titleDe, l.titleEn, l.titleEs)}
              {done[l.id] ? ` ${'★'.repeat(done[l.id])}` : ''}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-amber-100/90">
            {pick(lang, 'Züge', 'Taps', 'Toques')}: {moves} · {pick(lang, 'Richtwert', 'Par', 'Objetivo')}: {par} ·{' '}
            {litCount(board)}/{board.length} 💡
          </span>
        </div>

        {/* Hausfassade */}
        <div className="mx-auto w-full max-w-md rounded-t-[2rem] rounded-b-lg bg-[#2a2140] border-4 border-[#17122b] p-4 shadow-inner">
          <div className="text-center text-[10px] font-mono uppercase tracking-widest text-amber-200/70 mb-3">{title}</div>
          <div
            className="grid gap-2.5"
            style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}
            role="grid"
            aria-label={title}
          >
            {board.map((lit, i) => (
              <button
                key={i}
                onClick={() => handlePress(i)}
                aria-pressed={lit}
                aria-label={`${pick(lang, 'Fenster', 'Window', 'Ventana')} ${i + 1}: ${
                  lit ? pick(lang, 'hell', 'lit', 'encendida') : pick(lang, 'dunkel', 'dark', 'apagada')
                }`}
                className={`relative aspect-square rounded-t-full rounded-b-md border-2 flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 ${
                  lit
                    ? 'bg-gradient-to-b from-amber-200 to-amber-400 border-amber-100 shadow-[0_0_22px_6px_rgba(251,191,36,0.55)]'
                    : 'bg-[#141029] border-[#3b2f5c] hover:border-amber-200/60'
                } ${hintCell === i ? 'ring-4 ring-white/80 animate-pulse' : ''}`}
              >
                <span className={`transition-opacity duration-300 ${lit ? 'opacity-100' : 'opacity-0'}`} aria-hidden>
                  {RESIDENTS[i % RESIDENTS.length]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {solved && (
          <div className="mx-auto max-w-md rounded-2xl bg-[#fff7ed] text-[#3b2f5c] p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8c1d40]">
                {pick(lang, 'Der Hof leuchtet', 'The courtyard glows', 'El patio brilla')}
              </span>
              <span className="text-lg text-amber-500" aria-label={`${stars}/3`}>
                {'★'.repeat(stars)}
                <span className="text-stone-300">{'★'.repeat(3 - stars)}</span>
              </span>
            </div>
            <p className="font-serif italic leading-relaxed">{note}</p>
            {hasNext ? (
              <button
                onClick={() => loadLevel(levelIdx + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8c1d40] text-white text-sm font-semibold hover:bg-[#741533] transition-colors"
              >
                {pick(lang, 'Nächstes Haus', 'Next building', 'Siguiente edificio')} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <p className="text-sm text-stone-600">
                {pick(lang, 'Das war das letzte Haus. Gute Nacht.', 'That was the last building. Good night.', 'Ese era el último edificio. Buenas noches.')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  RotateCw, 
  Copy, 
  Check, 
  Puzzle, 
  Scissors, 
  Volume2, 
  VolumeX,
  Smile,
  Award,
  Zap
} from 'lucide-react';
import { Language } from '../types';
import {
  createInitialPuzzlePieces,
  swapPuzzlePieces,
  isPuzzleSolved,
  calculatePuzzleProgress,
} from '../engine/zen-games/puzzleEngine';

interface PhotoboothAlbumGameProps {
  lang: Language;
}

type PhotoboothProp = 'none' | 'mustache' | 'beret' | 'glasses' | 'monocle' | 'pipe';
type Expression = 'neutral' | 'silly' | 'shocked' | 'wink' | 'french_chic';

interface PhotoStripItem {
  id: number;
  expression: Expression;
  prop: PhotoboothProp;
  labelDe: string;
  labelEn: string;
  labelEs: string;
  filter: string;
}

export const PhotoboothAlbumGame: React.FC<PhotoboothAlbumGameProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'booth' | 'puzzle'>('booth');
  const [isMuted, setIsMuted] = useState(false);

  // PHOTOBOOTH MACHINE STATE
  const [isShooting, setIsShooting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [selectedProp, setSelectedProp] = useState<PhotoboothProp>('mustache');
  const [flashActive, setFlashActive] = useState(false);
  const [copiedStrip, setCopiedStrip] = useState(false);
  const [justDeveloped, setJustDeveloped] = useState(false);

  // Cancellation ref to ensure clean cleanup if user unmounts or skips
  const sessionAbortRef = useRef<boolean>(false);

  const [finishedStrip, setFinishedStrip] = useState<PhotoStripItem[] | null>([
    { id: 1, expression: 'french_chic', prop: 'beret', labelDe: 'Pose 1: Pariser Chic', labelEn: 'Pose 1: Parisian Chic', labelEs: 'Pose 1: Elegancia parisina', filter: 'sepia(0.25) contrast(1.1)' },
    { id: 2, expression: 'neutral', prop: 'mustache', labelDe: 'Pose 2: Der Schnurrbart', labelEn: 'Pose 2: The Mustache', labelEs: 'Pose 2: El bigote', filter: 'grayscale(0.8) contrast(1.2)' },
    { id: 3, expression: 'silly', prop: 'glasses', labelDe: 'Pose 3: Faxen im Métro', labelEn: 'Pose 3: Metro Grimace', labelEs: 'Pose 3: Mueca en el metro', filter: 'sepia(0.4) contrast(1.05)' },
    { id: 4, expression: 'wink', prop: 'pipe', labelDe: 'Pose 4: Amélie-Lächeln', labelEn: 'Pose 4: Amélie Smile', labelEs: 'Pose 4: Sonrisa cómplice', filter: 'contrast(1.15)' },
  ]);

  // PUZZLE STATE (Nino's torn photo reassembly)
  const [puzzlePieces, setPuzzlePieces] = useState(createInitialPuzzlePieces);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // Web Audio for vintage mechanical photobooth sounds
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      // Abort any ongoing shooting on unmount
      sessionAbortRef.current = true;
    };
  }, []);

  const playCoinSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Coin drop chime: two quick resonant metallic pings
      [0, 0.08].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(idx === 0 ? 1900 : 2400, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.1);
      });
    } catch {
      // Audio fallback
    }
  };

  const playFlashSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Soft vintage mechanical click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Fallback
    }
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Quick, pleasant, non-blocking 4-shot sequence
  const startPhotoboothSession = async () => {
    if (isShooting) return;
    sessionAbortRef.current = false;
    playCoinSound();
    setIsShooting(true);
    setJustDeveloped(false);
    setFinishedStrip(null);

    const poses: Array<{ exp: Expression; prop: PhotoboothProp; labelDe: string; labelEn: string; labelEs: string; filter: string }> = [
      { exp: 'french_chic', prop: 'beret', labelDe: 'Pose 1: Pariser Chic', labelEn: 'Pose 1: Parisian Chic', labelEs: 'Pose 1: Elegancia', filter: 'sepia(0.25) contrast(1.1)' },
      { exp: 'silly', prop: selectedProp, labelDe: 'Pose 2: Verrückte Grimasse', labelEn: 'Pose 2: Goofy Grimace', labelEs: 'Pose 2: Mueca loca', filter: 'grayscale(0.8) contrast(1.2)' },
      { exp: 'shocked', prop: 'glasses', labelDe: 'Pose 3: Geblendet vom Blitz', labelEn: 'Pose 3: Flash Blinded', labelEs: 'Pose 3: Cegado por el flash', filter: 'sepia(0.35) contrast(1.05)' },
      { exp: 'wink', prop: selectedProp, labelDe: 'Pose 4: Das Amélie-Lächeln', labelEn: 'Pose 4: Amélie Smile', labelEs: 'Pose 4: Sonrisa cómplice', filter: 'contrast(1.15)' },
    ];

    try {
      // Quick countdown: 3 -> 2 -> 1
      for (let c = 3; c >= 1; c--) {
        if (sessionAbortRef.current) return;
        setCountdown(c);
        await sleep(400);
      }
      setCountdown(null);

      // Snap the 4 poses in quick, rhythmic succession
      const captured: PhotoStripItem[] = [];
      for (let frame = 0; frame < 4; frame++) {
        if (sessionAbortRef.current) return;
        setCurrentFrameIndex(frame);

        // Gentle camera flash (soft lens glow, strictly non-blinding)
        playFlashSound();
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 90);

        captured.push({
          id: frame + 1,
          expression: poses[frame].exp,
          prop: poses[frame].prop,
          labelDe: poses[frame].labelDe,
          labelEn: poses[frame].labelEn,
          labelEs: poses[frame].labelEs,
          filter: poses[frame].filter,
        });

        await sleep(360);
      }

      setFinishedStrip(captured);
      setJustDeveloped(true);
      setTimeout(() => setJustDeveloped(false), 3000);
    } finally {
      setIsShooting(false);
      setCountdown(null);
    }
  };

  const handleInstantStrip = () => {
    sessionAbortRef.current = true;
    setIsShooting(false);
    setCountdown(null);
    setFlashActive(false);

    setFinishedStrip([
      { id: 1, expression: 'french_chic', prop: 'beret', labelDe: 'Pose 1: Pariser Chic', labelEn: 'Pose 1: Parisian Chic', labelEs: 'Pose 1: Elegancia', filter: 'sepia(0.25) contrast(1.1)' },
      { id: 2, expression: 'silly', prop: selectedProp, labelDe: 'Pose 2: Schnurrbart-Grimasse', labelEn: 'Pose 2: Mustache Grimace', labelEs: 'Pose 2: Mueca con bigote', filter: 'grayscale(0.8) contrast(1.2)' },
      { id: 3, expression: 'shocked', prop: 'glasses', labelDe: 'Pose 3: Geblendet vom Blitz', labelEn: 'Pose 3: Flash Blinded', labelEs: 'Pose 3: Cegado por el flash', filter: 'sepia(0.35) contrast(1.05)' },
      { id: 4, expression: 'wink', prop: selectedProp, labelDe: 'Pose 4: Das Amélie-Lächeln', labelEn: 'Pose 4: Amélie Smile', labelEs: 'Pose 4: Sonrisa cómplice', filter: 'contrast(1.15)' },
    ]);
    setJustDeveloped(true);
    setTimeout(() => setJustDeveloped(false), 3000);
  };

  // Puzzle Swap logic
  const handlePieceClick = (pieceId: number) => {
    if (selectedPieceId === null) {
      setSelectedPieceId(pieceId);
    } else {
      // Swap positions using modular puzzle engine
      setPuzzlePieces((prev) => {
        const next = swapPuzzlePieces(prev, selectedPieceId, pieceId);
        if (isPuzzleSolved(next)) {
          setPuzzleSolved(true);
        }
        return next;
      });
      setSelectedPieceId(null);
    }
  };

  const handleResetPuzzle = () => {
    setPuzzlePieces(createInitialPuzzlePieces());
    setSelectedPieceId(null);
    setPuzzleSolved(false);
  };

  // Render SVG Face Avatar based on expression & prop
  const renderAvatar = (expression: Expression, prop: PhotoboothProp, scale = 1) => {
    return (
      <svg width={140 * scale} height={140 * scale} viewBox="0 0 140 140" className="drop-shadow-sm">
        {/* Soft Metro Booth Portrait Background */}
        <rect width="140" height="140" rx="6" fill="#e2d9cc" />

        {/* Vintage Vignette */}
        <circle cx="70" cy="70" r="65" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />

        {/* Head Shape */}
        <ellipse cx="70" cy="72" rx="34" ry="42" fill="#fbd38d" />

        {/* Hair / Fringe (Iconic Amélie Bob) */}
        <path
          d="M 32 60 C 30 25, 110 25, 108 60 C 104 55, 95 42, 70 42 C 45 42, 36 55, 32 60 Z"
          fill="#271c19"
        />
        {/* Side locks */}
        <path d="M 34 55 C 30 75, 33 90, 40 98 C 36 85, 36 68, 38 55 Z" fill="#271c19" />
        <path d="M 106 55 C 110 75, 107 90, 100 98 C 104 85, 104 68, 102 55 Z" fill="#271c19" />

        {/* Eyes based on expression */}
        {expression === 'wink' ? (
          <g>
            <circle cx="58" cy="68" r="3.5" fill="#2d3748" />
            <path d="M 76 69 Q 82 64 88 69" fill="none" stroke="#2d3748" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ) : expression === 'shocked' ? (
          <g>
            <circle cx="58" cy="66" r="5" fill="#2d3748" />
            <circle cx="82" cy="66" r="5" fill="#2d3748" />
            <circle cx="56" cy="64" r="1.5" fill="#ffffff" />
            <circle cx="80" cy="64" r="1.5" fill="#ffffff" />
          </g>
        ) : expression === 'silly' ? (
          <g>
            {/* Cross-eyed */}
            <circle cx="61" cy="67" r="3.5" fill="#2d3748" />
            <circle cx="78" cy="67" r="3.5" fill="#2d3748" />
          </g>
        ) : (
          <g>
            <circle cx="58" cy="67" r="3.2" fill="#2d3748" />
            <circle cx="82" cy="67" r="3.2" fill="#2d3748" />
            <circle cx="56" cy="65" r="1" fill="#ffffff" />
            <circle cx="80" cy="65" r="1" fill="#ffffff" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <circle cx="48" cy="78" r="6" fill="#f56565" opacity="0.3" />
        <circle cx="92" cy="78" r="6" fill="#f56565" opacity="0.3" />

        {/* Nose */}
        <path d="M 70 69 Q 73 76 68 78" fill="none" stroke="#dd6b20" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth based on expression */}
        {expression === 'shocked' ? (
          <ellipse cx="70" cy="88" rx="6" ry="8" fill="#742a2a" />
        ) : expression === 'silly' ? (
          <g>
            <path d="M 60 84 Q 70 89 80 84" fill="none" stroke="#742a2a" strokeWidth="2" />
            {/* Sticking tongue out */}
            <path d="M 67 85 C 67 94, 73 94, 73 85 Z" fill="#e53e3e" />
          </g>
        ) : (
          <path d="M 62 85 Q 70 92 78 85" fill="none" stroke="#742a2a" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Props */}
        {prop === 'mustache' && (
          <path
            d="M 70 80 C 64 77, 52 79, 48 83 C 54 85, 64 83, 70 82 C 76 83, 86 85, 92 83 C 88 79, 76 77, 70 80 Z"
            fill="#271c19"
          />
        )}

        {prop === 'glasses' && (
          <g>
            <circle cx="58" cy="67" r="10" fill="none" stroke="#1a202c" strokeWidth="2.5" />
            <circle cx="82" cy="67" r="10" fill="none" stroke="#1a202c" strokeWidth="2.5" />
            <line x1="68" y1="67" x2="72" y2="67" stroke="#1a202c" strokeWidth="2.5" />
          </g>
        )}

        {prop === 'beret' && (
          <ellipse cx="70" cy="38" rx="36" ry="12" fill="#701531" transform="rotate(-8 70 38)" />
        )}

        {prop === 'monocle' && (
          <g>
            <circle cx="82" cy="67" r="9" fill="none" stroke="#d69e2e" strokeWidth="2" />
            <line x1="88" y1="74" x2="96" y2="105" stroke="#b7791f" strokeWidth="1" />
          </g>
        )}

        {prop === 'pipe' && (
          <g transform="translate(68, 86)">
            <line x1="0" y1="0" x2="22" y2="4" stroke="#744210" strokeWidth="3" />
            <rect x="20" y="-4" width="8" height="12" rx="2" fill="#975a16" />
            {/* Tiny smoke puff */}
            <circle cx="24" cy="-8" r="2.5" fill="#a0aec0" opacity="0.6" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-white border border-[#d8cbba] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#701531]">
            <Sparkles className="w-4 h-4 text-[#8c1d40]" />
            <span>
              {lang === 'de'
                ? 'Nino Quincampoix’ Pariser Fotomaton-Kabinett'
                : lang === 'es'
                ? 'El fotomatón parisino de Nino Quincampoix'
                : 'Nino Quincampoix’s Paris Photobooth Archive'}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-amelie font-bold text-[#2b1e16]">
            {lang === 'de'
              ? '« L’Album de Photomaton de Nino »'
              : lang === 'es'
              ? '« El álbum de fotomatón de Nino »'
              : '“Nino’s Photobooth Album & The Mystery Man”'}
          </h3>
          <p className="text-xs md:text-sm text-stone-600 font-serif">
            {lang === 'de'
              ? 'Im Métro Abbesses sammelt Nino weggeworfene Passbilder. Schieße deinen eigenen 4-Bilder-Streifen oder setze das zerrissene Porträt des mysteriösen Unbekannten zusammen!'
              : lang === 'es'
              ? 'En la estación Abbesses, Nino colecciona fotos de carnet tiradas. ¡Saca tu propia tira de 4 fotos o reconstruye el retrato roto del misterioso desconocido!'
              : 'At Metro Abbesses, Nino collects discarded passport photos under the booths. Take your own vintage 4-photo strip or piece together the mystery stranger’s torn photo!'}
          </p>
        </div>

        {/* Tab & Audio Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title={isMuted ? 'Ton an' : 'Stummschalten'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-800" />}
          </button>

          <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-mono">
            <button
              onClick={() => setActiveTab('booth')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'booth' ? 'bg-[#8c1d40] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? 'Foto-Automat' : lang === 'es' ? 'Fotomatón' : 'Photobooth'}</span>
            </button>
            <button
              onClick={() => setActiveTab('puzzle')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'puzzle' ? 'bg-[#8c1d40] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? 'Zerrissenes Foto' : lang === 'es' ? 'Foto rota' : 'Torn Portrait'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE A: THE PARIS METRO PHOTOBOOTH */}
      {activeTab === 'booth' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Photobooth Booth & Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* The Vintage Metro Booth Stage */}
            <div className="relative rounded-3xl overflow-hidden border-4 border-stone-800 shadow-xl bg-stone-950 p-6 select-none flex flex-col items-center justify-center min-h-[340px]">
              {/* Soft, gentle camera flash (warm, subtle, strictly non-blinding) */}
              <div
                className={`absolute inset-0 bg-amber-50/20 pointer-events-none transition-opacity duration-100 z-30 ${
                  flashActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Red Velvet Curtain Trim */}
              <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-red-950 to-red-800 border-b border-red-900 z-10 pointer-events-none" />

              {/* Live Preview Window */}
              <div className="relative p-2 bg-stone-800 rounded-2xl border-2 border-stone-600 shadow-inner">
                {renderAvatar(
                  isShooting
                    ? currentFrameIndex === 1
                      ? 'silly'
                      : currentFrameIndex === 2
                      ? 'shocked'
                      : currentFrameIndex === 3
                      ? 'wink'
                      : 'french_chic'
                    : 'french_chic',
                  selectedProp,
                  1.5
                )}

                {/* Gentle, non-explosive countdown badge */}
                {countdown !== null && (
                  <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-stone-900/90 border-2 border-amber-400/80 flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-mono font-bold text-amber-300">
                        {countdown}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Booth Status Light & Frame Counter */}
              <div className="mt-4 flex items-center gap-3 text-xs font-mono text-stone-400">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isShooting ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                  {isShooting
                    ? `${lang === 'de' ? 'Belichtung Bild' : lang === 'es' ? 'Foto' : 'Shot'} #${currentFrameIndex + 1} / 4`
                    : (lang === 'de' ? 'Bereit für 10-Francs-Münze' : lang === 'es' ? 'Listo para la moneda' : 'Insert 10-Franc Coin')}
                </span>
                <span className="text-stone-600">|</span>
                <span>Métro Abbesses · Ligne 12</span>
              </div>
            </div>

            {/* Wardrobe / Prop Selection */}
            <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#d8cbba] space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase text-stone-700 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-[#8c1d40]" />
                {lang === 'de' ? 'Wähle dein Pariser Requisit:' : lang === 'es' ? 'Elige tu accesorio:' : 'Choose your Paris prop:'}
              </span>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-mono">
                {[
                  { id: 'mustache', labelDe: 'Schnurrbart', labelEn: 'Mustache', labelEs: 'Bigote', icon: '🥸' },
                  { id: 'beret', labelDe: 'Baskenmütze', labelEn: 'Beret', labelEs: 'Boina', icon: '🍷' },
                  { id: 'glasses', labelDe: 'Nerd-Brille', labelEn: 'Glasses', labelEs: 'Gafas', icon: '👓' },
                  { id: 'monocle', labelDe: 'Monokel', labelEn: 'Monocle', labelEs: 'Monóculo', icon: '🧐' },
                  { id: 'pipe', labelDe: 'Holzpfeife', labelEn: 'Pipe', labelEs: 'Pipa', icon: '🪵' },
                  { id: 'none', labelDe: 'Ohne', labelEn: 'Natural', labelEs: 'Natural', icon: '✨' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProp(p.id as PhotoboothProp)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                      selectedProp === p.id
                        ? 'bg-[#8c1d40] text-white border-[#8c1d40] font-bold shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-base">{p.icon}</span>
                    <span className="text-[10px] mt-0.5">{lang === 'de' ? p.labelDe : lang === 'es' ? p.labelEs : p.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger with Skip/Instant option */}
            <div className="flex items-center gap-2">
              <button
                onClick={startPhotoboothSession}
                disabled={isShooting}
                className={`flex-1 py-3 rounded-2xl font-bold font-mono text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  isShooting
                    ? 'bg-amber-800/80 text-amber-100 cursor-wait'
                    : 'bg-[#8c1d40] hover:bg-[#701531] text-amber-100 active:scale-[0.99]'
                }`}
              >
                <Camera className="w-4 h-4 text-amber-200" />
                <span>
                  {isShooting
                    ? (lang === 'de' ? `Belichtet Bild ${currentFrameIndex + 1}/4...` : lang === 'es' ? `Foto ${currentFrameIndex + 1}/4...` : `Snapping ${currentFrameIndex + 1}/4...`)
                    : (lang === 'de' ? '10-Francs-Münze einwerfen & 4 Posen schießen 🪙' : lang === 'es' ? 'Echar 10 francos y tomar 4 fotos 🪙' : 'Insert 10 Francs & Snap 4 Poses 🪙')}
                </span>
              </button>

              {isShooting && (
                <button
                  onClick={handleInstantStrip}
                  className="px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-mono text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-1"
                  title={lang === 'de' ? 'Sofort fertigstellen' : 'Finish instantly'}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-800" />
                  <span>{lang === 'de' ? 'Sofort' : lang === 'es' ? 'Listo' : 'Skip'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: The Developed Vertical 4-Photo Strip (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3">
            {justDeveloped && (
              <div className="w-full max-w-60 p-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-mono text-center flex items-center justify-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{lang === 'de' ? '✦ Streifen fertig entwickelt! ✦' : lang === 'es' ? '✦ ¡Tira revelada! ✦' : '✦ Strip developed! ✦'}</span>
              </div>
            )}
            {finishedStrip ? (
              <div className="w-60 bg-white p-3 pb-6 rounded-lg shadow-2xl border border-stone-300 space-y-2 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                {/* Header Stamp */}
                <div className="text-center border-b border-stone-200 pb-1">
                  <div className="text-[9px] font-mono tracking-widest text-stone-400 font-bold uppercase">
                    PHOTOMATON ● PARIS
                  </div>
                  <div className="text-[8px] font-mono text-stone-400">
                    MÉTRO ABBESSES · N° 4018
                  </div>
                </div>

                {/* The 4 vertical frames */}
                <div className="space-y-2">
                  {finishedStrip.map((item) => (
                    <div
                      key={item.id}
                      style={{ filter: item.filter }}
                      className="bg-stone-100 rounded border border-stone-300 p-1 flex flex-col items-center justify-center overflow-hidden"
                    >
                      {renderAvatar(item.expression, item.prop, 0.9)}
                      <span className="text-[9px] font-mono text-stone-500 pt-0.5">
                        {lang === 'de' ? item.labelDe : lang === 'es' ? item.labelEs : item.labelEn}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer metadata */}
                <div className="text-center pt-1 border-t border-stone-200 text-[8px] font-mono text-stone-400 flex items-center justify-between">
                  <span>21.09.2026</span>
                  <span className="font-bold text-stone-600">PHOTO SEC</span>
                </div>

                {/* Copy note */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('Photomaton Paris - Métro Abbesses (4 Poses)');
                    setCopiedStrip(true);
                    setTimeout(() => setCopiedStrip(false), 2000);
                  }}
                  className="w-full py-1.5 mt-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[11px] font-mono text-stone-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedStrip ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
                  <span>{copiedStrip ? (lang === 'de' ? 'Gespeichert!' : lang === 'es' ? '¡Guardado!' : 'Saved!') : (lang === 'de' ? 'In Ninos Album kleben' : lang === 'es' ? 'Pegar en el álbum' : 'Paste into Album')}</span>
                </button>
              </div>
            ) : (
              <div className="w-60 h-96 rounded-2xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-6 text-center text-stone-400 space-y-2">
                <Camera className="w-8 h-8 text-stone-300 animate-bounce" />
                <span className="text-xs font-mono">
                  {lang === 'de'
                    ? 'Wirf eine Münze ein, um den Streifen zu entwickeln!'
                    : lang === 'es'
                    ? '¡Echa una moneda para revelar la tira!'
                    : 'Insert a coin to develop your strip!'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE B: NINO'S TORN PHOTO RECONSTRUCTION PUZZLE */}
      {activeTab === 'puzzle' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#d8cbba] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-[#8c1d40] flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Der Mann mit den roten Schuhen' : lang === 'es' ? 'El hombre de los zapatos rojos' : 'The Man in the Red Shoes'}
              </span>
              <p className="text-xs text-stone-600 font-serif">
                {lang === 'de'
                  ? 'Nino fand diese vier zerrissenen Schnipsel auf den Fliesen der Station Gare de l’Est. Klicke auf zwei Teile, um ihre Plätze zu tauschen und das Gesicht zusammenzusetzen!'
                  : lang === 'es'
                  ? 'Nino encontró estos cuatro pedazos rotos en el suelo de Gare de l’Est. Haz clic en dos piezas para intercambiarlas y revelar su rostro.'
                  : 'Nino found these four torn pieces scattered on the tiles of Gare de l’Est. Click two pieces to swap them and assemble the mystery face!'}
              </p>
            </div>

            <button
              onClick={handleResetPuzzle}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? 'Neu mischen' : lang === 'es' ? 'Mezclar de nuevo' : 'Reshuffle'}</span>
            </button>
          </div>

          {/* 2x2 Puzzle Board */}
          <div className="max-w-md mx-auto p-6 bg-stone-100 border-2 border-stone-300 rounded-3xl shadow-inner">
            <div className="grid grid-cols-2 gap-2 bg-stone-200 p-2 rounded-2xl">
              {[0, 1, 2, 3].map((slotIdx) => {
                const piece = puzzlePieces.find((p) => p.currentSlot === slotIdx);
                const isSelected = piece && piece.id === selectedPieceId;
                const isCorrect = piece && piece.currentSlot === piece.correctSlot;

                return (
                  <div
                    key={slotIdx}
                    onClick={() => piece && handlePieceClick(piece.id)}
                    className={`relative w-40 h-40 rounded-xl overflow-hidden cursor-pointer transition-all border-2 select-none flex items-center justify-center ${
                      isSelected
                        ? 'border-[#8c1d40] ring-4 ring-[#8c1d40]/30 shadow-lg scale-95'
                        : isCorrect && puzzleSolved
                        ? 'border-emerald-500 shadow-sm'
                        : 'border-stone-400/60 hover:border-stone-600'
                    }`}
                  >
                    {/* Torn paper jagged edge overlay */}
                    <div className="absolute inset-0 pointer-events-none border border-white/40 shadow-inner" />

                    {/* Fragment visual */}
                    {piece && (
                      <div className="w-full h-full bg-[#f6eee3] flex items-center justify-center p-2 relative">
                        {/* Cut corner visual */}
                        <div className="absolute top-1 left-1 text-[10px] font-mono text-stone-400">
                          #{piece.id + 1}
                        </div>

                        {/* Fragment graphic */}
                        {piece.id === 0 && (
                          <div className="text-center space-y-1">
                            <span className="text-3xl">🎩</span>
                            <div className="w-12 h-4 bg-stone-800 rounded-full mx-auto" />
                            <span className="text-[10px] font-mono text-stone-500 block">{lang === 'de' ? 'Hut & Stirn' : lang === 'es' ? 'Sombrero' : 'Hat & Forehead'}</span>
                          </div>
                        )}
                        {piece.id === 1 && (
                          <div className="text-center space-y-1">
                            <span className="text-3xl">🧐</span>
                            <div className="w-10 h-3 bg-amber-700/60 rounded-full mx-auto" />
                            <span className="text-[10px] font-mono text-stone-500 block">{lang === 'de' ? 'Brille & Augen' : lang === 'es' ? 'Gafas' : 'Eyes & Glare'}</span>
                          </div>
                        )}
                        {piece.id === 2 && (
                          <div className="text-center space-y-1">
                            <span className="text-3xl">🥸</span>
                            <div className="w-14 h-4 bg-stone-900 rounded-full mx-auto" />
                            <span className="text-[10px] font-mono text-stone-500 block">{lang === 'de' ? 'Zwinkerbart' : lang === 'es' ? 'Bigote' : 'Mustache'}</span>
                          </div>
                        )}
                        {piece.id === 3 && (
                          <div className="text-center space-y-1">
                            <span className="text-3xl">👞</span>
                            <div className="w-10 h-3 bg-red-600 rounded-full mx-auto" />
                            <span className="text-[10px] font-mono text-stone-500 block">{lang === 'de' ? 'Rote Schuhe' : lang === 'es' ? 'Zapatos rojos' : 'Red Shoes'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Puzzle Result Banner */}
          {puzzleSolved && (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-stone-900 space-y-2 animate-in fade-in zoom-in-95 duration-400 max-w-xl mx-auto shadow-md">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-base font-amelie text-emerald-950">
                  {lang === 'de'
                    ? '🎉 Das Rätsel ist gelöst: Es ist Monsieur Dupont!'
                    : lang === 'es'
                    ? '🎉 ¡Misterio resuelto: Es el señor Dupont!'
                    : '🎉 Mystery Solved: It’s Monsieur Dupont!'}
                </h4>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-serif">
                {lang === 'de'
                  ? 'Er ist kein Geist und kein Spion! Es ist der Fotomaton-Reparateur. Er wirft jedes Mal 10 Francs ein, macht eine Grimasse, prüft den Blitz und die Schärfe, reißt das Testbild in vier Teile und geht zur nächsten Station.'
                  : lang === 'es'
                  ? '¡No es un espía ni un fantasma! Es el técnico de mantenimiento del fotomatón. Echa una moneda, hace una mueca para probar el flash, rompe la foto de prueba y va a la siguiente máquina.'
                  : 'He is neither a ghost nor a spy! He is simply the Photobooth technician. He drops in a coin, makes a funny face to test the flash focus, tears up the test strip, and walks to the next station.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

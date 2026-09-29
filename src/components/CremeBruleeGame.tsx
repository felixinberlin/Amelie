import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  Heart,
  Flame,
  Utensils,
  BookOpen,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import {
  FlavorProfile,
  SecretQuote,
  SECRET_QUOTES,
  FLAVOR_CONFIGS,
  CaramelState,
  createInitialCaramelState,
  generateCrackPattern,
  calculateAcousticCrackProfile,
  evaluateSecretDiscovery,
  calculateSatisfaction,
} from '../engine/zen-games/cremeBruleeEngine';

interface CremeBruleeGameProps {
  lang: Language;
}

type SpoonMode = 'back' | 'tip';

const pick = (lang: Language, de: string, en: string, es: string) =>
  lang === 'de' ? de : lang === 'es' ? es : en;

export const CremeBruleeGame: React.FC<CremeBruleeGameProps> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [flavor, setFlavor] = useState<FlavorProfile>('vanilla');
  const [spoonMode, setSpoonMode] = useState<SpoonMode>('back');
  const [isMuted, setIsMuted] = useState(false);
  const [caramelState, setCaramelState] = useState<CaramelState>(() => createInitialCaramelState('vanilla'));
  const [secrets, setSecrets] = useState<SecretQuote[]>(() => SECRET_QUOTES.map((s) => ({ ...s })));
  const [activeSecret, setActiveSecret] = useState<SecretQuote | null>(null);
  const [spoonHover, setSpoonHover] = useState<{ x: number; y: number; isDown: boolean } | null>(null);

  // Web Audio Context for ASMR Sugar Shard Synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playCrackSound = useCallback(
    (force: number) => {
      if (isMuted) return;
      initAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const profile = calculateAcousticCrackProfile(force, caramelState.thickness, flavor);
      const now = ctx.currentTime;

      // 1. High resonant snap / ping (crystalline sugar glass fracture)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(profile.fundamentalFreq, now);
      osc.frequency.exponentialRampToValueAtTime(profile.fundamentalFreq * 0.45, now + profile.decayTime);

      oscGain.gain.setValueAtTime(profile.snapGain * 0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + profile.decayTime);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + profile.decayTime);

      // 2. White noise crunchy crunch burst (fracture friction)
      const bufferSize = Math.floor(ctx.sampleRate * profile.decayTime);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Highpass to keep it crisp and airy
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400 + force * 1200, now);
      filter.Q.setValueAtTime(profile.resonanceQ, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(profile.noiseLevel * 0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + profile.decayTime * 0.85);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + profile.decayTime);
    },
    [isMuted, caramelState.thickness, flavor]
  );

  const handleRamekinClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.82;

    const relX = clickX - centerX;
    const relY = clickY - centerY;
    const distFromCenter = Math.hypot(relX, relY);

    // Only interact inside the ramekin custard pool
    if (distFromCenter > radius) return;

    // Trigger crack based on spoon mode
    const baseForce = spoonMode === 'back' ? 0.65 + Math.random() * 0.45 : 0.35 + Math.random() * 0.4;
    playCrackSound(baseForce);

    const newCrack = generateCrackPattern(relX, relY, baseForce, caramelState.cracks.length, radius);
    const newCracks = [...caramelState.cracks, newCrack];
    const newTaps = caramelState.spoonTaps + 1;

    // Discover secrets
    const { newlyDiscovered, updatedSecrets } = evaluateSecretDiscovery(
      caramelState,
      secrets,
      relX,
      relY,
      radius
    );

    if (newlyDiscovered) {
      setSecrets(updatedSecrets);
      setActiveSecret(newlyDiscovered);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff'],
      });
    }

    const secretsFoundCount = updatedSecrets.filter((s) => s.discovered).length;
    const shatteredArea = Math.min(1.0, newCracks.length * 0.12);
    const satisfaction = calculateSatisfaction(newTaps, shatteredArea, secretsFoundCount);

    setCaramelState((prev) => ({
      ...prev,
      cracks: newCracks,
      spoonTaps: newTaps,
      shatteredAreaRatio: shatteredArea,
      satisfactionScore: satisfaction,
    }));
  };

  const resetRamekin = (newFlavor?: FlavorProfile) => {
    const selectedFlavor = newFlavor || flavor;
    setFlavor(selectedFlavor);
    setCaramelState(createInitialCaramelState(selectedFlavor));
    setActiveSecret(null);
  };

  // Render Ramekin on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const ramekinRadius = Math.min(centerX, centerY) * 0.82;
    const rimRadius = ramekinRadius * 1.15;
    const currentConfig = FLAVOR_CONFIGS[flavor];

    ctx.clearRect(0, 0, width, height);

    // 1. Ceramic Ramekin Outer Rim & Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    // Ceramic border
    ctx.beginPath();
    ctx.arc(centerX, centerY, rimRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fffdfa';
    ctx.fill();
    ctx.restore();

    // Ramekin Ceramic Ridge Rings
    const rimGrad = ctx.createLinearGradient(centerX - rimRadius, centerY - rimRadius, centerX + rimRadius, centerY + rimRadius);
    rimGrad.addColorStop(0, '#fefbf7');
    rimGrad.addColorStop(0.5, '#ede5d8');
    rimGrad.addColorStop(1, '#dfd3c0');

    ctx.beginPath();
    ctx.arc(centerX, centerY, rimRadius, 0, Math.PI * 2);
    ctx.lineWidth = (rimRadius - ramekinRadius);
    ctx.strokeStyle = rimGrad;
    ctx.stroke();

    // Fluted edge ribs on ceramic ramekin
    ctx.save();
    ctx.translate(centerX, centerY);
    const ribCount = 48;
    for (let i = 0; i < ribCount; i++) {
      const angle = (i * Math.PI * 2) / ribCount;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (ramekinRadius + 2), Math.sin(angle) * (ramekinRadius + 2));
      ctx.lineTo(Math.cos(angle) * (rimRadius - 2), Math.sin(angle) * (rimRadius - 2));
      ctx.strokeStyle = 'rgba(180, 160, 140, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();

    // Inner shadow of the ceramic rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, ramekinRadius, 0, Math.PI * 2);
    ctx.clip();

    // 2. Underlying Silky Custard
    const custardGrad = ctx.createRadialGradient(
      centerX - ramekinRadius * 0.2,
      centerY - ramekinRadius * 0.2,
      ramekinRadius * 0.1,
      centerX,
      centerY,
      ramekinRadius
    );
    custardGrad.addColorStop(0, '#fff4b8');
    custardGrad.addColorStop(0.7, currentConfig.custardColor);
    custardGrad.addColorStop(1, '#d8bc5e');

    ctx.fillStyle = custardGrad;
    ctx.fillRect(centerX - ramekinRadius, centerY - ramekinRadius, ramekinRadius * 2, ramekinRadius * 2);

    // Vanilla bean black specks in custard
    if (currentConfig.speckles) {
      ctx.fillStyle = 'rgba(40, 25, 10, 0.45)';
      for (let i = 0; i < 70; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * ramekinRadius * 0.95;
        const sx = centerX + Math.cos(angle) * dist;
        const sy = centerY + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8 + Math.random() * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Caramelized Sugar Glass Crust Layer
    const caramelGrad = ctx.createRadialGradient(
      centerX - ramekinRadius * 0.3,
      centerY - ramekinRadius * 0.35,
      10,
      centerX,
      centerY,
      ramekinRadius
    );
    caramelGrad.addColorStop(0, 'rgba(255, 210, 120, 0.88)');
    caramelGrad.addColorStop(0.35, currentConfig.crustColor);
    caramelGrad.addColorStop(0.75, '#692b04');
    caramelGrad.addColorStop(0.95, '#421601');
    caramelGrad.addColorStop(1, '#2c0c00');

    ctx.fillStyle = caramelGrad;
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ramekinRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Dark caramelized blister bubbles (flambé blisters from the torch)
    const blisters = [
      { x: -0.3, y: -0.25, r: 0.14, color: '#381403' },
      { x: 0.25, y: 0.3, r: 0.18, color: '#2b0c00' },
      { x: -0.15, y: 0.35, r: 0.11, color: '#4a1b02' },
      { x: 0.35, y: -0.2, r: 0.13, color: '#361201' },
      { x: 0.05, y: 0.05, r: 0.16, color: '#522104' },
    ];

    blisters.forEach((b) => {
      const bx = centerX + b.x * ramekinRadius;
      const by = centerY + b.y * ramekinRadius;
      const br = b.r * ramekinRadius;
      const bGrad = ctx.createRadialGradient(bx - br * 0.2, by - br * 0.2, br * 0.1, bx, by, br);
      bGrad.addColorStop(0, 'rgba(120, 50, 10, 0.4)');
      bGrad.addColorStop(0.7, b.color);
      bGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Render Sugar Fracture Cracks
    ctx.save();
    ctx.translate(centerX, centerY);

    caramelState.cracks.forEach((crack) => {
      // Crack center depression
      ctx.beginPath();
      ctx.arc(crack.x, crack.y, 4 + crack.force * 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 240, 180, 0.65)';
      ctx.fill();

      // Branching fracture lines
      crack.branches.forEach((branch) => {
        // Shard white crystalline reflection line
        ctx.beginPath();
        ctx.moveTo(crack.x, crack.y);
        ctx.lineTo(branch.toX, branch.toY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${branch.alpha})`;
        ctx.lineWidth = branch.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Dark refraction line underneath for 3D depth
        ctx.beginPath();
        ctx.moveTo(crack.x + 1, crack.y + 1);
        ctx.lineTo(branch.toX + 1, branch.toY + 1);
        ctx.strokeStyle = 'rgba(40, 15, 0, 0.75)';
        ctx.lineWidth = Math.max(0.8, branch.width * 0.65);
        ctx.stroke();
      });
    });

    ctx.restore();

    // 5. Glossy Crystalline Highlight sheen
    const glossGrad = ctx.createLinearGradient(
      centerX - ramekinRadius * 0.7,
      centerY - ramekinRadius * 0.8,
      centerX + ramekinRadius * 0.4,
      centerY + ramekinRadius * 0.4
    );
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
    glossGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.12)');
    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = glossGrad;
    ctx.beginPath();
    ctx.ellipse(
      centerX - ramekinRadius * 0.25,
      centerY - ramekinRadius * 0.35,
      ramekinRadius * 0.55,
      ramekinRadius * 0.3,
      -Math.PI / 5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 6. Garnish (Fresh Raspberry & Mint leaf) if enabled
    if (caramelState.garnished) {
      const gx = centerX + ramekinRadius * 0.52;
      const gy = centerY - ramekinRadius * 0.48;

      // Mint Leaf
      ctx.save();
      ctx.translate(gx - 12, gy + 4);
      ctx.rotate(-0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#4d8a36';
      ctx.fill();
      ctx.strokeStyle = '#2f5b1d';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Raspberry
      ctx.beginPath();
      ctx.arc(gx, gy, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#b91c47';
      ctx.fill();

      // Raspberry drupelets
      for (let i = 0; i < 7; i++) {
        const dAngle = (i * Math.PI * 2) / 7;
        ctx.beginPath();
        ctx.arc(gx + Math.cos(dAngle) * 7, gy + Math.sin(dAngle) * 7, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = '#9f1239';
        ctx.fill();
      }
    }

    ctx.restore(); // end clip
  }, [flavor, caramelState]);

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shadow-2xs">
            🍮
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                {pick(
                  lang,
                  'Crème Brûlée — Die perfekte Zuckerkruste',
                  'Crème Brûlée — The Perfect Caramelized Crust',
                  'Crème Brûlée — La costra de azúcar perfecta'
                )}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                {caramelState.cracks.length} {pick(lang, 'geknackt', 'cracks', 'roturas')}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {pick(
                lang,
                'Klicke auf die Schale, um die warme Karamellkruste mit dem Löffelrücken zu zerbrechen.',
                'Click on the dish to break the brittle caramel crust with the back of the spoon.',
                'Haz clic en el cuenco para romper la corteza crujiente con el dorso de la cuchara.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Spoon mode toggle */}
          <div className="flex rounded-xl border border-stone-200 bg-stone-50 p-0.5 text-xs font-medium">
            <button
              onClick={() => setSpoonMode('back')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                spoonMode === 'back'
                  ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title={pick(lang, 'Mit dem Löffelrücken schlagen', 'Strike with back of spoon', 'Golpear con el dorso')}
            >
              🥄 {pick(lang, 'Löffelrücken', 'Back of Spoon', 'Dorso')}
            </button>
            <button
              onClick={() => setSpoonMode('tip')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                spoonMode === 'tip'
                  ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title={pick(lang, 'Mit der Löffelspitze tippen', 'Tap with tip of spoon', 'Punta de cuchara')}
            >
              ✨ {pick(lang, 'Löffelspitze', 'Tip of Spoon', 'Punta')}
            </button>
          </div>

          {/* Audio toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
              isMuted
                ? 'bg-stone-100 text-stone-500 border-stone-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title={isMuted ? 'Ton aktivieren' : 'Stummschalten'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset button */}
          <button
            onClick={() => resetRamekin()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{pick(lang, 'Frische Crème', 'Fresh Crème', 'Nueva Crème')}</span>
          </button>
        </div>
      </div>

      {/* Flavor Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['vanilla', 'salted_caramel', 'pistachio', 'lavender'] as FlavorProfile[]).map((fKey) => {
          const cfg = FLAVOR_CONFIGS[fKey];
          const isSelected = flavor === fKey;
          return (
            <button
              key={fKey}
              onClick={() => resetRamekin(fKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {pick(lang, cfg.nameDe, cfg.nameEn, cfg.nameEs)}
            </button>
          );
        })}
      </div>

      {/* Interactive Main Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Ramekin View */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-stone-50 to-amber-50/30 rounded-2xl border border-stone-200/80 relative select-none">
          <div className="relative group cursor-pointer">
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              onClick={handleRamekinClick}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setSpoonHover({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  isDown: e.buttons === 1,
                });
              }}
              onMouseLeave={() => setSpoonHover(null)}
              className="rounded-full touch-manipulation drop-shadow-md transition-transform active:scale-[0.99]"
            />
            {/* Visual Teaspoon Cursor indicator */}
            {spoonHover && (
              <div
                style={{
                  left: `${spoonHover.x}px`,
                  top: `${spoonHover.y}px`,
                }}
                className="pointer-events-none absolute -translate-x-1 -translate-y-4 text-2xl transition-transform duration-75 rotate-[-20deg]"
              >
                🥄
              </div>
            )}
          </div>

          <div className="mt-3 text-center text-xs text-stone-500 font-mono flex items-center gap-2">
            <span>{pick(lang, 'Klicks:', 'Clicks:', 'Golpes:')} {caramelState.spoonTaps}</span>
            <span>•</span>
            <span>{pick(lang, 'Risse:', 'Cracks:', 'Fisuras:')} {caramelState.cracks.length}</span>
          </div>
        </div>

        {/* Dashboard & Satisfaction Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Satisfaction Progress Bar */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-950 font-serif">
                <Award className="w-4 h-4 text-amber-700" />
                {pick(lang, 'Amélie-Zufriedenheitsgrad', 'Amélie Satisfaction Rate', 'Nivel de Satisfacción')}
              </span>
              <span className="text-xs font-mono font-bold text-amber-900">
                {caramelState.satisfactionScore}%
              </span>
            </div>

            <div className="w-full bg-amber-200/60 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-600 to-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${caramelState.satisfactionScore}%` }}
              />
            </div>

            <p className="text-xs text-amber-900/80 italic leading-relaxed">
              {caramelState.satisfactionScore > 75
                ? pick(
                    lang,
                    '„Ein vollkommenes Knuspererlebnis. Wie an einem Sonntagnachmittag im Café des 2 Moulins.“',
                    '"A pristine crunch experience. Like a sunny Sunday at the Café des 2 Moulins."',
                    '«Una experiencia crujiente perfecta. Como un domingo en el Café des 2 Moulins.»'
                  )
                : caramelState.satisfactionScore > 30
                ? pick(
                    lang,
                    '„Die Kruste bricht herrlich auf. Noch ein paar zarte Taps…“',
                    '"The crust fractures delightfully. A few more gentle taps…"',
                    '«La costra se fractura deliciosamente. Unos toques más…»'
                  )
                : pick(
                    lang,
                    '„Setze die Löffelspitze an und lausche dem ersten Knacken.“',
                    '"Place the teaspoon tip and listen to that first crystalline snap."',
                    '«Coloca la punta de la cuchara y escucha el primer crujido.»'
                  )}
            </p>
          </div>

          {/* Quick Actions (Flambé / Garnish) */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCaramelState((prev) => ({ ...prev, garnished: !prev.garnished }));
              }}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                caramelState.garnished
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>{pick(lang, 'Himbeere & Minze', 'Raspberry & Mint', 'Frambuesa & Menta')}</span>
            </button>

            <button
              onClick={() => {
                // Flambé fresh caramel glaze
                setCaramelState((prev) => ({
                  ...prev,
                  cracks: [],
                  thickness: Math.min(2.5, prev.thickness + 0.3),
                  spoonTaps: 0,
                }));
                playCrackSound(0.2);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white border border-amber-600 shadow-2xs transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{pick(lang, 'Nachflambieren', 'Caramelize Crust', 'Flambear')}</span>
            </button>
          </div>

          {/* Secret Quote Discovered Alert */}
          {activeSecret && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-3.5 shadow-xs animate-in fade-in zoom-in-95 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 font-serif">
                <span>{activeSecret.icon}</span>
                <span>{pick(lang, 'Geheimnis entdeckt!', 'Secret Discovered!', '¡Secreto Descubierto!')}</span>
              </div>
              <p className="text-xs text-stone-800 font-serif italic">
                {pick(lang, activeSecret.de, activeSecret.en, activeSecret.es)}
              </p>
              <p className="text-[10px] text-amber-800 font-mono text-right">— {activeSecret.author}</p>
            </div>
          )}

          {/* Secrets collection status */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
              {pick(lang, 'Versteckte Zitate:', 'Secrets found:', 'Secretos hallados:')}
            </span>
            <span className="font-mono font-semibold text-stone-700">
              {secrets.filter((s) => s.discovered).length} / {secrets.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

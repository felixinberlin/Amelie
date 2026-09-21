import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Award, 
  Heart,
  Hand,
  Search,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Language } from '../types';

interface GrainSackZenGameProps {
  lang: Language;
}

interface BuriedTreasure {
  id: string;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  descDe: string;
  descEn: string;
  descEs: string;
  icon: string;
  xRatio: number; // 0..1 in canvas
  yRatio: number; // 0..1 in canvas
  depthThreshold: number; // how much digging is needed nearby
  found: boolean;
  discoveredAt?: number;
}

type GrainType = 'lentils' | 'chickpeas' | 'coffee';

export const GrainSackZenGame: React.FC<GrainSackZenGameProps> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [grainType, setGrainType] = useState<GrainType>('lentils');
  const [isMuted, setIsMuted] = useState(false);
  const [handDepth, setHandDepth] = useState(0); // in cm
  const [grainsStirred, setGrainsStirred] = useState(0);
  const [justFoundTreasure, setJustFoundTreasure] = useState<BuriedTreasure | null>(null);

  // Audio Context for tactile ASMR grain rustling
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  const [treasures, setTreasures] = useState<BuriedTreasure[]>([
    {
      id: 'franc_coin',
      nameDe: '5-Francs-Münze (1960)',
      nameEn: '5-Francs Silver Coin (1960)',
      nameEs: 'Moneda de 5 francos (1960)',
      descDe: 'Kaltes, schweres Messing mit dem Relief der Säerin („La Semeuse“). Lag wohl seit den 60er Jahren im Sack.',
      descEn: 'Cold, heavy silver-plated brass featuring "La Semeuse". Must have slipped out of an apron pocket in the 1960s.',
      descEs: 'Moneda pesada con el relieve de «La Semeuse». Perdida hace décadas en el fondo del saco.',
      icon: '🪙',
      xRatio: 0.25,
      yRatio: 0.35,
      depthThreshold: 14,
      found: false,
    },
    {
      id: 'dino',
      nameDe: 'Grüner Plastik-Mini-Dino',
      nameEn: 'Tiny Green Toy Dinosaur',
      nameEs: 'Dinosaurio diminuto de plástico verde',
      descDe: 'Ein winziger Stegosaurus aus einem Kaugummiautomaten. Beschützt nun die Kaffeebohnen.',
      descEn: 'A miniature green stegosaurus from a vintage gumball dispenser. Now guarding the pulses.',
      descEs: 'Un pequeño estegosaurio de máquina de chicles que ahora custodia las legumbres.',
      icon: '🦖',
      xRatio: 0.72,
      yRatio: 0.28,
      depthThreshold: 18,
      found: false,
    },
    {
      id: 'skeleton_key',
      nameDe: 'Vergessener Messingschlüssel',
      nameEn: 'Antique Skeleton Key',
      nameEs: 'Llave antigua de latón',
      descDe: 'Ein kleiner Bartschlüssel mit winzigem Anhänger: „Passt zu keinem Schloss, öffnet aber jeden Tagtraum.“',
      descEn: 'An ornate small key with a faded tag: "Fits no lock, but unlocks any daydream."',
      descEs: 'Una pequeña llave con una etiqueta descolorida: «No abre cerraduras, pero abre ensueños».',
      icon: '🗝️',
      xRatio: 0.45,
      yRatio: 0.75,
      depthThreshold: 22,
      found: false,
    },
    {
      id: 'blue_marble',
      nameDe: 'Irisierende blaue Glasmurmel',
      nameEn: 'Cobalt Swirl Glass Marble',
      nameEs: 'Canica azul de cristal brillante',
      descDe: 'Fühlt sich kühl und spiegelglatt an zwischen den rauen Linsen.',
      descEn: 'Cool, perfectly spherical, and mirror-smooth against the matte dry lentils.',
      descEs: 'Fría y perfectamente pulida, resalta entre la textura seca del grano.',
      icon: '🔮',
      xRatio: 0.8,
      yRatio: 0.68,
      depthThreshold: 16,
      found: false,
    },
    {
      id: 'folded_note',
      nameDe: 'Gefalteter Zettel mit Botschaft',
      nameEn: 'Folded Secret Note',
      nameEs: 'Nota secreta doblada',
      descDe: 'In winziger Tinte geschrieben: „Du machst das gerade viel besser, als du glaubst.“',
      descEn: 'Penciled in tiny cursive script: "You are doing much better than you think."',
      descEs: 'Escrito con caligrafía diminuta: «Lo estás haciendo mucho mejor de lo que crees».',
      icon: '💌',
      xRatio: 0.2,
      yRatio: 0.72,
      depthThreshold: 20,
      found: false,
    },
    {
      id: 'lucky_dice',
      nameDe: 'Der Würfel, der nur Sechsen hat',
      nameEn: 'Wooden All-Sixes Lucky Die',
      nameEs: 'Dado de madera que solo saca seis',
      descDe: 'Aus Kirschbaumholz geschnitzt. Auf allen sechs Seiten sind sechs kleine Punkte eingekerbt.',
      descEn: 'Hand-carved from cherry wood. Every single face bears six proud dots.',
      descEs: 'Tallado en madera de cerezo. En todas sus caras tiene seis puntos grabados.',
      icon: '🎲',
      xRatio: 0.58,
      yRatio: 0.42,
      depthThreshold: 25,
      found: false,
    },
  ]);

  // Audio synthesis: rustling dry grain sound
  const playGrainRustle = (intensity: number) => {
    if (isMuted) return;
    const now = Date.now();
    if (now - lastSoundTimeRef.current < 45) return;
    lastSoundTimeRef.current = now;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Filtered noise burst for dry grain rubbing
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';

      // Pitch depends on grain type
      if (grainType === 'lentils') {
        filter.frequency.setValueAtTime(2400 + Math.random() * 800, ctx.currentTime);
        filter.Q.setValueAtTime(3.5, ctx.currentTime);
      } else if (grainType === 'chickpeas') {
        filter.frequency.setValueAtTime(900 + Math.random() * 400, ctx.currentTime);
        filter.Q.setValueAtTime(2.0, ctx.currentTime);
      } else {
        filter.frequency.setValueAtTime(1400 + Math.random() * 600, ctx.currentTime);
        filter.Q.setValueAtTime(2.8, ctx.currentTime);
      }

      const gain = ctx.createGain();
      const vol = Math.min(0.18, 0.05 + intensity * 0.12);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio fallback
    }
  };

  const playChimeSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.2); // A6
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Fallback
    }
  };

  // Particles state on canvas
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    rotation: number;
  }>>([]);

  // Digging heat map / displacement
  const mousePosRef = useRef<{ x: number; y: number; isDown: boolean; speed: number }>({
    x: -999,
    y: -999,
    isDown: false,
    speed: 0,
  });
  const lastMouseRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Initialize particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 360;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Color palettes per grain type
    const palettes = {
      lentils: ['#4a5d43', '#5a7051', '#3b4b35', '#6b8261', '#7b9470', '#8da882'],
      chickpeas: ['#e4b568', '#f2c77d', '#c99849', '#dba856', '#ebd097', '#b68337'],
      coffee: ['#3b2219', '#2a160f', '#4f3024', '#5e3a2b', '#1e0e09', '#6d4433'],
    };

    const currentPalette = palettes[grainType];
    const particleCount = grainType === 'chickpeas' ? 320 : 650;
    const baseRadius = grainType === 'chickpeas' ? 7.5 : grainType === 'coffee' ? 5.5 : 3.8;

    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      newParticles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: baseRadius + (Math.random() - 0.5) * (baseRadius * 0.4),
        color: currentPalette[Math.floor(Math.random() * currentPalette.length)],
        rotation: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = newParticles;

    let animId: number;
    let localDigCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Burlap Sack Background
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      if (grainType === 'lentils') {
        grad.addColorStop(0, '#2d3827');
        grad.addColorStop(1, '#1b2318');
      } else if (grainType === 'chickpeas') {
        grad.addColorStop(0, '#8c6527');
        grad.addColorStop(1, '#573c12');
      } else {
        grad.addColorStop(0, '#1c100a');
        grad.addColorStop(1, '#0c0704');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const mouse = mousePosRef.current;
      const isInteracting = mouse.x > 0 && mouse.y > 0;

      // Draw buried treasures under particles
      treasures.forEach((t) => {
        const tx = t.xRatio * width;
        const ty = t.yRatio * height;

        // Draw hint aura if nearby or found
        const distToMouse = Math.hypot(mouse.x - tx, mouse.y - ty);
        const isRevealed = t.found || (isInteracting && distToMouse < 60);

        if (isRevealed) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(tx, ty, t.found ? 24 : 18, 0, Math.PI * 2);
          ctx.fillStyle = t.found ? 'rgba(255, 230, 100, 0.4)' : 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = t.found ? '#ffd700' : 'rgba(255, 255, 255, 0.4)';
          ctx.stroke();

          // Render emoji icon
          ctx.font = t.found ? '24px serif' : '18px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.icon, tx, ty);
          ctx.restore();
        }
      });

      // Update and draw grains
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction physics
        if (isInteracting) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pushRadius = mouse.isDown ? 75 : 45;

          if (dist < pushRadius && dist > 0) {
            const force = (pushRadius - dist) / pushRadius;
            const angle = Math.atan2(dy, dx);
            // Push away with gentle swirl
            p.vx += Math.cos(angle) * force * 2.5 + Math.sin(angle) * (mouse.speed * 0.05);
            p.vy += Math.sin(angle) * force * 2.5 - Math.cos(angle) * (mouse.speed * 0.05);
            localDigCount += 0.02;
          }
        }

        // Return to base position spring
        const returnDx = p.baseX - p.x;
        const returnDy = p.baseY - p.y;
        p.vx += returnDx * 0.04;
        p.vy += returnDy * 0.04;

        // Friction damping
        p.vx *= 0.84;
        p.vy *= 0.84;

        p.x += p.vx;
        p.y += p.vy;

        // Draw grain bean shape
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation + (p.vx + p.vy) * 0.2);

        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (grainType === 'coffee') {
          // Oval coffee bean with center slit
          ctx.ellipse(0, 0, p.radius * 1.3, p.radius * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.fillRect(-p.radius * 0.9, -0.6, p.radius * 1.8, 1.2);
        } else if (grainType === 'chickpeas') {
          // Chunky organic round chickpea
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
          // Highlight shine
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.beginPath();
          ctx.arc(-p.radius * 0.3, -p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Flat round French lentil
          ctx.ellipse(0, 0, p.radius, p.radius * 0.75, 0, 0, Math.PI * 2);
          ctx.fill();
          // Speckle
          ctx.fillStyle = 'rgba(20, 30, 15, 0.4)';
          ctx.fillRect(0, 0, 1, 1);
        }
        ctx.restore();
      }

      // Check treasure discovery
      if (isInteracting && mouse.isDown) {
        setTreasures((prev) =>
          prev.map((t) => {
            if (t.found) return t;
            const tx = t.xRatio * width;
            const ty = t.yRatio * height;
            const dist = Math.hypot(mouse.x - tx, mouse.y - ty);
            if (dist < 40) {
              // Discovered!
              playChimeSound();
              confetti({
                particleCount: 35,
                spread: 55,
                origin: { x: (rect.left + tx) / window.innerWidth, y: (rect.top + ty) / window.innerHeight },
                colors: ['#ffd700', '#f59e0b', '#10b981'],
              });
              setJustFoundTreasure({ ...t, found: true });
              return { ...t, found: true, discoveredAt: Date.now() };
            }
            return t;
          })
        );
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const interval = setInterval(() => {
      if (localDigCount > 0) {
        setGrainsStirred((g) => g + Math.round(localDigCount));
        localDigCount = 0;
      }
    }, 250);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
    };
  }, [grainType, isMuted]);

  // Mouse & Touch events
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = Date.now();
    const dt = Math.max(1, now - lastMouseRef.current.time);
    const dx = x - lastMouseRef.current.x;
    const dy = y - lastMouseRef.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;

    mousePosRef.current = {
      x,
      y,
      isDown: e.buttons > 0 || e.pointerType === 'touch',
      speed,
    };
    lastMouseRef.current = { x, y, time: now };

    // Update hand depth based on Y coordinate + button press
    const calculatedDepth = Math.min(35, Math.round((y / rect.height) * 25 + (mousePosRef.current.isDown ? 10 : 2)));
    setHandDepth(calculatedDepth);

    if (speed > 0.15) {
      playGrainRustle(speed);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    mousePosRef.current.isDown = true;
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    mousePosRef.current.isDown = false;
  };

  const handlePointerLeave = () => {
    mousePosRef.current = { x: -999, y: -999, isDown: false, speed: 0 };
    setHandDepth(0);
  };

  const handleResetTreasures = () => {
    setTreasures((prev) =>
      prev.map((t) => ({
        ...t,
        found: false,
        xRatio: 0.15 + Math.random() * 0.7,
        yRatio: 0.2 + Math.random() * 0.65,
      }))
    );
    setJustFoundTreasure(null);
  };

  const foundCount = treasures.filter((t) => t.found).length;

  return (
    <div className="bg-white border border-[#d8cbba] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#701531]">
            <Sparkles className="w-4 h-4 text-[#8c1d40]" />
            <span>
              {lang === 'de'
                ? 'Amélie Poulains sensorische Oase'
                : lang === 'es'
                ? 'Oasis sensorial de Amélie Poulain'
                : 'Amélie Poulain’s Sensorial Oasis'}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-amelie font-bold text-[#2b1e16]">
            {lang === 'de'
              ? '« Plonger la main au plus profond d’un sac de grains »'
              : lang === 'es'
              ? '« Hundir la mano en lo más profundo de un saco de granos »'
              : '“Dipping your hand deep into a sack of grains”'}
          </h3>
          <p className="text-xs md:text-sm text-stone-600 font-serif">
            {lang === 'de'
              ? 'Fahre mit der Maus oder dem Finger durch den Kornsack. Höre das trockene Knistern, spüre den Widerstand und grabe vergessene Schätze aus.'
              : lang === 'es'
              ? 'Mueve el dedo o el ratón por el saco de granos. Escucha el susurro crujiente, siente la resistencia y desentierra recuerdos olvidados.'
              : 'Swirl your finger or mouse through the burlap sack. Savor the dry ASMR rustle, feel the tactile resistance, and dig out lost vintage treasures.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title={isMuted ? 'Ton an' : 'Stummschalten'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-800" />}
          </button>

          <button
            onClick={handleResetTreasures}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'de' ? 'Neu vergraben' : lang === 'es' ? 'Enterrar de nuevo' : 'Bury Again'}</span>
          </button>
        </div>
      </div>

      {/* Grain Type Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-stone-500 font-semibold">{lang === 'de' ? 'Kornsack:' : lang === 'es' ? 'Saco:' : 'Grain Sack:'}</span>
          <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
            <button
              onClick={() => setGrainType('lentils')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                grainType === 'lentils' ? 'bg-[#3b4b35] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              🌱 {lang === 'de' ? 'Grüne Puy-Linsen' : lang === 'es' ? 'Lentejas verdes' : 'French Green Lentils'}
            </button>
            <button
              onClick={() => setGrainType('chickpeas')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                grainType === 'chickpeas' ? 'bg-[#c99849] text-stone-950 shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              🟡 {lang === 'de' ? 'Goldene Kichererbsen' : lang === 'es' ? 'Garbanzos dorados' : 'Golden Chickpeas'}
            </button>
            <button
              onClick={() => setGrainType('coffee')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                grainType === 'coffee' ? 'bg-[#3b2219] text-amber-100 shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              ☕ {lang === 'de' ? 'Gerösteter Espresso' : lang === 'es' ? 'Café tostado' : 'Dark Roast Coffee'}
            </button>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-stone-600">
          <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200">
            🖐️ {lang === 'de' ? 'Tiefe:' : lang === 'es' ? 'Profundidad:' : 'Depth:'} <strong className="text-stone-900">{handDepth} cm</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200">
            🌾 {lang === 'de' ? 'Granulate gerührt:' : lang === 'es' ? 'Granos:' : 'Stirred:'} <strong className="text-stone-900">{grainsStirred.toLocaleString()}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold">
            🏆 {foundCount} / {treasures.length} {lang === 'de' ? 'Schätze' : lang === 'es' ? 'Tesoros' : 'Treasures'}
          </span>
        </div>
      </div>

      {/* Interactive Grain Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-[#c5832b]/30 shadow-inner bg-stone-900 select-none">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="w-full h-80 md:h-96 cursor-grab active:cursor-grabbing touch-none block"
          title={lang === 'de' ? 'Mit Maus oder Finger wühlen!' : lang === 'es' ? '¡Hunde la mano y remueve!' : 'Swirl and dig with finger or mouse!'}
        />

        {/* Sensory Overlay Hint */}
        <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white/90 text-xs font-mono">
          <Hand className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{lang === 'de' ? 'Klicken & tief eintauchen' : lang === 'es' ? 'Haz clic y sumérgete' : 'Click & dig deep'}</span>
        </div>

        {/* Found Treasure Banner Pop */}
        {justFoundTreasure && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md p-4 rounded-2xl bg-amber-50/95 border-2 border-amber-400 text-stone-900 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{justFoundTreasure.icon}</span>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-800 block">
                    🎉 {lang === 'de' ? 'Neuer Schatz gehoben!' : lang === 'es' ? '¡Nuevo tesoro desenterrado!' : 'Treasure Rescued!'}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">
                    {lang === 'de' ? justFoundTreasure.nameDe : lang === 'es' ? justFoundTreasure.nameEs : justFoundTreasure.nameEn}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setJustFoundTreasure(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-mono px-1.5 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-700 font-serif italic mt-2">
              „{lang === 'de' ? justFoundTreasure.descDe : lang === 'es' ? justFoundTreasure.descEs : justFoundTreasure.descEn}“
            </p>
          </div>
        )}
      </div>

      {/* Recovered Treasures Showcase Shelf */}
      <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#d8cbba] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-700" />
            {lang === 'de' ? 'Geborgene Raritäten aus dem Kornsack' : lang === 'es' ? 'Raridades rescatadas del saco' : 'Rescued Rarities from the Sack'}
          </span>
          <span className="text-xs font-mono text-stone-500">
            {foundCount === treasures.length ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Alle Schätze gefunden!' : lang === 'es' ? '¡Todos los tesoros hallados!' : 'All Treasures Discovered!'}
              </span>
            ) : (
              `${treasures.length - foundCount} ${lang === 'de' ? 'noch verborgen' : lang === 'es' ? 'aún ocultos' : 'still buried'}`
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {treasures.map((t) => (
            <div
              key={t.id}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[90px] ${
                t.found
                  ? 'bg-white border-amber-300 shadow-2xs'
                  : 'bg-stone-100/70 border-dashed border-stone-300 opacity-60'
              }`}
            >
              <span className="text-2xl filter drop-shadow-xs">{t.found ? t.icon : '❓'}</span>
              <span className="text-[11px] font-medium text-stone-800 leading-tight mt-1">
                {t.found
                  ? (lang === 'de' ? t.nameDe : lang === 'es' ? t.nameEs : t.nameEn)
                  : (lang === 'de' ? 'Tief im Sack...' : lang === 'es' ? 'Oculto...' : 'Deep inside...')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

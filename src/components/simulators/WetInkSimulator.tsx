import React, { useState, useRef, useEffect } from 'react';
import { Layers, RefreshCw, ExternalLink } from 'lucide-react';
import { Language } from '../../types';

interface WetInkSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

export const WetInkSimulator: React.FC<WetInkSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  const inkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [inkColor, setInkColor] = useState<'sepia' | 'cobalt' | 'sumi'>('sepia');

  const inkColors = {
    sepia: { stroke: 'rgba(80, 48, 24, 0.85)', bleed: 'rgba(120, 72, 36, 0.18)' },
    cobalt: { stroke: 'rgba(24, 48, 96, 0.85)', bleed: 'rgba(40, 80, 150, 0.16)' },
    sumi: { stroke: 'rgba(26, 26, 26, 0.9)', bleed: 'rgba(60, 60, 60, 0.15)' },
  };

  const clearInkCanvas = () => {
    const canvas = inkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#f8f5ee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // subtle paper texture fibers
    ctx.fillStyle = 'rgba(215, 205, 185, 0.15)';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }
  };

  useEffect(() => {
    clearInkCanvas();
  }, []);

  const drawInkPoint = (x: number, y: number) => {
    const canvas = inkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = inkColors[inkColor];

    // Core stroke
    ctx.fillStyle = colors.stroke;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Capillary bleed into fibers (anisotropic random radius)
    ctx.fillStyle = colors.bleed;
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 3 + Math.random() * 6;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 2 + Math.random() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    drawInkPoint(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    drawInkPoint(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerUp = () => setIsDrawing(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-700" />
            <span>{lang === 'de' ? 'Wet Ink: Kapillardiffusion & Ränder' : 'Wet Ink: Capillary Paper Bleed'}</span>
          </h3>
          <span className="text-xs font-mono-code bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
            Tin #10
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          {lang === 'de'
            ? 'Digitale Tinte (Apple Pencil, Tablets) zeichnet glatte Vektorlinien. Echte Tinte spreizt sich mikroskopisch in Papierfasern und dunkelt am Rand durch Pigmentwanderung nach. Zeichnen Sie auf der Leinwand:'
            : 'Digital ink draws sterile vector lines. Real fountain pen ink bleeds into porous fibers with capillary edge pooling. Draw on the canvas to inspect:'}
        </p>

        {/* Ink Tone Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
            {lang === 'de' ? 'Tinten-Rezeptur:' : 'Ink Formulation:'}
          </label>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setInkColor('sepia')}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                inkColor === 'sepia' ? 'border-amber-900 bg-amber-50 font-bold text-amber-950' : 'border-stone-200'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#503018]" />
              <span>Sepia Eisengallus</span>
            </button>
            <button
              onClick={() => setInkColor('cobalt')}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                inkColor === 'cobalt' ? 'border-blue-900 bg-blue-50 font-bold text-blue-950' : 'border-stone-200'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#183060]" />
              <span>Königsblau</span>
            </button>
            <button
              onClick={() => setInkColor('sumi')}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                inkColor === 'sumi' ? 'border-stone-900 bg-stone-100 font-bold text-stone-950' : 'border-stone-200'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
              <span>Sumi Tusche</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={clearInkCanvas}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'de' ? 'Papier leeren' : 'Clear Paper'}</span>
          </button>

          {onOpenDose && (
            <button
              onClick={() => onOpenDose('wet-ink')}
              className="text-amber-800 hover:underline text-xs flex items-center gap-1 font-semibold"
            >
              <span>{lang === 'de' ? 'Dose: Wet Ink öffnen' : 'Open Tin: Wet Ink'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="lg:col-span-7 bg-[#f8f5ee] rounded-2xl border border-stone-300/80 p-4 shadow-inner flex flex-col items-center">
        <canvas
          ref={inkCanvasRef}
          width={560}
          height={320}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="rounded-xl shadow-xs border border-stone-300 cursor-crosshair touch-none w-full h-auto bg-[#f8f5ee]"
        />
        <span className="text-[11px] text-stone-500 font-mono-code mt-2">
          {lang === 'de' ? 'Zeichnen mit Maus oder Stift · Zeigt anisotrope Kapillarausbreitung' : 'Draw with pointer · Demonstrates microscopic anisotropic fiber diffusion'}
        </span>
      </div>
    </div>
  );
};

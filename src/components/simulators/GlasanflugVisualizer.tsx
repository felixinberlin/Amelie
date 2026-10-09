import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { Eingabe } from '../../engine/glasanflug/score';

interface GlasanflugVisualizerProps {
  lang: Language;
  eingabe: Eingabe;
}

export const GlasanflugVisualizer: React.FC<GlasanflugVisualizerProps> = ({
  lang,
  eingabe,
}) => {
  const de = lang === 'de';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasMarking, setHasMarking] = useState<boolean>(false);
  const [markingType, setMarkingType] = useState<'dots' | 'stripes'>('dots');
  // Illustrative façade only: no flight physics, probabilities or bird-vision claims.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. Background sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, h);
      {
        skyGradient.addColorStop(0, '#93c5fd');
        skyGradient.addColorStop(0.6, '#bfdbfe');
        skyGradient.addColorStop(1, '#e2e8f0');
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.fillStyle = '#4d7c0f';
      ctx.fillRect(0, h - 35, w, 35);

      // 2. Surrounding Trees (distance from gehoelzabstand: 1 = >50m, 4 = <15m)
      const treePoints = eingabe.gehoelzabstand.punkte ?? 2; // illustrative placeholder, not a measurement
      const treeDistance = treePoints === 4 ? 20 : treePoints === 3 ? 45 : treePoints === 2 ? 80 : 130;
      const treeScale = treePoints === 4 ? 1.25 : treePoints === 3 ? 1.0 : treePoints === 2 ? 0.75 : 0.55;

      // Draw trees in foreground / middle
      const treeX = Math.max(30, Math.min(180, treeDistance + 20));
      ctx.save();
      ctx.translate(treeX, h - 35);
      ctx.scale(treeScale, treeScale);

      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-6, -60, 12, 60);

      // Foliage
      ctx.beginPath();
      ctx.arc(0, -85, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#15803d';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-22, -70, 26, 0, Math.PI * 2);
      ctx.arc(22, -70, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Facade on the right side
      const facadeX = w - 190;
      const facadeY = 20;
      const facadeW = 175;
      const facadeH = h - 55;

      // Building wall background
      ctx.fillStyle = '#64748b';
      ctx.fillRect(facadeX, facadeY, facadeW, facadeH);

      // Window grid based on fassadengestaltung and glasanteil
      const glasPoints = eingabe.glasanteil.punkte ?? 3; // illustrative placeholder, not a measurement
      const fassadenPoints = eingabe.fassadengestaltung.punkte ?? 3; // illustrative placeholder, not a measurement

      const cols = fassadenPoints === 1 ? 4 : fassadenPoints === 2 ? 3 : fassadenPoints === 3 ? 2 : 1;
      const rows = fassadenPoints <= 2 ? 3 : 2;
      const margin = fassadenPoints === 1 ? 8 : fassadenPoints === 4 ? 3 : 6;

      const cellW = (facadeW - margin * (cols + 1)) / cols;
      const cellH = (facadeH - margin * (rows + 1)) / rows;

      // Reflection strength depends on glasanteil
      const reflectionAlpha = glasPoints === 4 ? 0.85 : glasPoints === 3 ? 0.65 : glasPoints === 2 ? 0.45 : 0.25;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wx = facadeX + margin + c * (cellW + margin);
          const wy = facadeY + margin + r * (cellH + margin);

          // Glass base (interior look)
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(wx, wy, cellW, cellH);

          // Reflected tree in glass
          ctx.save();
          ctx.beginPath();
          ctx.rect(wx, wy, cellW, cellH);
          ctx.clip();

          // Reflected tree foliage
          ctx.fillStyle = `rgba(34, 197, 94, ${reflectionAlpha})`;
          ctx.beginPath();
          ctx.arc(wx + cellW * 0.4, wy + cellH * 0.6, cellH * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Reflected sky gradient
          const reflGrad = ctx.createLinearGradient(wx, wy, wx, wy + cellH);
          reflGrad.addColorStop(0, `rgba(255, 255, 255, ${reflectionAlpha * 0.4})`);
          reflGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = reflGrad;
          ctx.fillRect(wx, wy, cellW, cellH);

          // Vogelschutz-Markierung overlay
          if (hasMarking) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            if (markingType === 'dots') {
              const dotGap = 16;
              for (let dx = wx + 8; dx < wx + cellW; dx += dotGap) {
                for (let dy = wy + 8; dy < wy + cellH; dy += dotGap) {
                  ctx.beginPath();
                  ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            } else {
              // Stripes
              const stripeGap = 18;
              for (let sx = wx + 10; sx < wx + cellW; sx += stripeGap) {
                ctx.fillRect(sx, wy, 3, cellH);
              }
            }
          }

          ctx.restore();

          // Window frame
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.strokeRect(wx, wy, cellW, cellH);
        }
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [eingabe, hasMarking, markingType]);

  return (
    <div className="rounded-2xl bg-stone-900 border border-stone-800 p-4 sm:p-5 text-white space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif-title font-bold text-stone-100 text-sm">
              {de ? 'Optischer Fassaden- & Flugbahn-Simulator' : 'Visual Façade & Flight Trajectory Simulator'}
            </h4>
            <p className="text-[11px] text-stone-400">
              {de ? 'Schematische Illustration, keine Fotomessung oder Flugprognose' : 'Schematic illustration; not a photograph measurement or flight prediction'}
            </p>
          </div>
        </div>

      </div>

      {/* Canvas Area */}
      <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
        <canvas
          ref={canvasRef}
          width={520}
          height={220}
          className="w-full h-auto block max-h-[260px] object-cover"
        />

      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Toggle Marking */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHasMarking(!hasMarking)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              hasMarking
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-300" />
            <span>{hasMarking ? (de ? 'Markierung aktiv' : 'Marking active') : (de ? '+ Vogelschutzmarkierung' : '+ Bird safety marking')}</span>
          </button>

          {hasMarking && (
            <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-stone-700">
              <button
                onClick={() => setMarkingType('dots')}
                className={`px-2 py-0.5 rounded-lg text-xs transition-all ${
                  markingType === 'dots'
                    ? 'bg-stone-700 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {de ? 'Punkte' : 'Dots'}
              </button>
              <button
                onClick={() => setMarkingType('stripes')}
                className={`px-2 py-0.5 rounded-lg text-xs transition-all ${
                  markingType === 'stripes'
                    ? 'bg-stone-700 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {de ? 'Streifen' : 'Stripes'}
              </button>
            </div>
          )}
        </div>

      </div>
      <p className="text-[11px] text-stone-400 leading-relaxed">{de ? 'Markierungen dienen hier ausschließlich der Illustration. Wirkung und Eignung lassen sich aus dieser Zeichnung nicht ableiten. Maßgeblich sind spezifische Prüfergebnisse und die Bedingungen am Gebäude.' : 'Markings are illustrative only. This drawing cannot establish efficacy or suitability. Use pattern-specific test evidence and real building conditions.'}</p>
    </div>
  );
};

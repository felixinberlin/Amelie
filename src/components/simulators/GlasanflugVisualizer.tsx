import React, { useState, useEffect, useRef } from 'react';
import { Eye, Shield, Play, RotateCcw, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Language } from '../../types';
import { Risikostufe } from '../../engine/glasanflug/schema';
import { Eingabe } from '../../engine/glasanflug/score';

interface GlasanflugVisualizerProps {
  lang: Language;
  eingabe: Eingabe;
  stufe: Risikostufe | null;
  summe: number | null;
}

export const GlasanflugVisualizer: React.FC<GlasanflugVisualizerProps> = ({
  lang,
  eingabe,
  stufe,
  summe,
}) => {
  const de = lang === 'de';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasMarking, setHasMarking] = useState<boolean>(false);
  const [markingType, setMarkingType] = useState<'dots' | 'stripes'>('dots');
  const [visionMode, setVisionMode] = useState<'human' | 'bird'>('human');
  const [isSimulatingFlight, setIsSimulatingFlight] = useState<boolean>(false);
  const [flightOutcome, setFlightOutcome] = useState<'idle' | 'avoided' | 'collision'>('idle');

  // Flight animation state
  const animRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    wingPhase: number;
    active: boolean;
  }>({
    x: 20,
    y: 110,
    vx: 2.8,
    vy: 0.1,
    wingPhase: 0,
    active: false,
  });

  // Calculate avoidance probability based on stufe and marking
  const avoidanceRate = hasMarking
    ? markingType === 'dots'
      ? 94
      : 92
    : stufe === 'gering'
    ? 85
    : stufe === 'mittel'
    ? 52
    : 18;

  const startFlightTest = () => {
    animRef.current = {
      x: 30,
      y: 90 + Math.random() * 40,
      vx: 3.2,
      vy: (Math.random() - 0.5) * 0.8,
      wingPhase: 0,
      active: true,
    };
    setFlightOutcome('idle');
    setIsSimulatingFlight(true);
  };

  const resetFlightTest = () => {
    animRef.current.active = false;
    setIsSimulatingFlight(false);
    setFlightOutcome('idle');
  };

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
      if (visionMode === 'bird') {
        // Avian UV vision perceives subtle UV tints in atmosphere & glass
        skyGradient.addColorStop(0, '#1e1b4b');
        skyGradient.addColorStop(0.6, '#312e81');
        skyGradient.addColorStop(1, '#4c1d95');
      } else {
        skyGradient.addColorStop(0, '#93c5fd');
        skyGradient.addColorStop(0.6, '#bfdbfe');
        skyGradient.addColorStop(1, '#e2e8f0');
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.fillStyle = visionMode === 'bird' ? '#14532d' : '#4d7c0f';
      ctx.fillRect(0, h - 35, w, 35);

      // 2. Surrounding Trees (distance from gehoelzabstand: 1 = >50m, 4 = <15m)
      const treePoints = eingabe.gehoelzabstand.punkte ?? 2;
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
      ctx.fillStyle = visionMode === 'bird' ? '#22c55e' : '#15803d';
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
      const glasPoints = eingabe.glasanteil.punkte ?? 3;
      const fassadenPoints = eingabe.fassadengestaltung.punkte ?? 3;

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
          ctx.fillStyle = visionMode === 'bird' ? `rgba(74, 222, 128, ${reflectionAlpha})` : `rgba(34, 197, 94, ${reflectionAlpha})`;
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
            ctx.fillStyle = visionMode === 'bird' ? '#f43f5e' : 'rgba(255, 255, 255, 0.85)';
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

      // 4. Bird Flight Test Animation
      const flight = animRef.current;
      if (flight.active) {
        flight.x += flight.vx;
        flight.y += flight.vy;
        flight.wingPhase += 0.35;

        // Collision or avoidance boundary near facade
        if (flight.x >= facadeX - 25) {
          const willAvoid = Math.random() * 100 <= avoidanceRate;
          if (willAvoid || hasMarking || stufe === 'gering') {
            // Divert up and away safely
            flight.vx = -1.8;
            flight.vy = -2.8;
            setFlightOutcome('avoided');
          } else {
            // Impact
            flight.vx = 0;
            flight.vy = 2.0;
            setFlightOutcome('collision');
          }
          flight.active = false;
        }

        // Draw flying bird
        ctx.save();
        ctx.translate(flight.x, flight.y);
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 4.5, Math.atan2(flight.vy, flight.vx), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Wings flapping
        const wingSpan = Math.sin(flight.wingPhase) * 9;
        ctx.beginPath();
        ctx.moveTo(-2, 0);
        ctx.lineTo(2, wingSpan);
        ctx.lineTo(6, 0);
        ctx.closePath();
        ctx.fillStyle = '#d97706';
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [eingabe, stufe, hasMarking, markingType, visionMode, avoidanceRate]);

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
              {de
                ? 'Simulation der Spiegeleffekte & Vögel-Meiderate nach ONR 191040'
                : 'Reflection physics & bird avoidance simulation per ONR 191040'}
            </p>
          </div>
        </div>

        {/* Vision mode switch */}
        <div className="flex items-center gap-1.5 bg-stone-800 p-1 rounded-xl border border-stone-700">
          <button
            onClick={() => setVisionMode('human')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              visionMode === 'human'
                ? 'bg-stone-700 text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {de ? 'Menschliches Auge' : 'Human Vision'}
          </button>
          <button
            onClick={() => setVisionMode('bird')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              visionMode === 'bird'
                ? 'bg-purple-900 text-purple-200 border border-purple-600 font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3 h-3 text-purple-400" />
            <span>{de ? 'Vogelsicht (UV)' : 'Avian UV Vision'}</span>
          </button>
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

        {/* HUD Overlay Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-stone-900/90 backdrop-blur-sm border border-stone-700 text-[11px] font-mono text-stone-200 font-bold">
            {de ? 'Vermeidungsrate:' : 'Avoidance:'}{' '}
            <span
              className={
                avoidanceRate >= 80
                  ? 'text-emerald-400'
                  : avoidanceRate >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }
            >
              {avoidanceRate} %
            </span>
          </span>
          {hasMarking && (
            <span className="px-2 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-sm border border-emerald-700 text-[11px] font-mono text-emerald-300 font-bold inline-flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>{markingType === 'dots' ? 'Punktmuster (100×100)' : 'Streifen (5mm)'}</span>
            </span>
          )}
        </div>

        {/* Flight outcome banner */}
        {flightOutcome !== 'idle' && (
          <div className="absolute bottom-3 right-3 animate-fadeIn">
            {flightOutcome === 'avoided' ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-900/90 backdrop-blur-sm border border-emerald-600 text-xs text-emerald-200 font-bold inline-flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{de ? 'Flugbahn abgewendet! (Keine Kollision)' : 'Diverted safely! (No collision)'}</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-rose-900/90 backdrop-blur-sm border border-rose-600 text-xs text-rose-200 font-bold inline-flex items-center gap-1.5 shadow-lg">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>{de ? 'Kollision! Signifikantes Schlagrisiko' : 'Collision! Significant strike risk'}</span>
              </span>
            )}
          </div>
        )}
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

        {/* Flight Simulation Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={startFlightTest}
            disabled={isSimulatingFlight}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isSimulatingFlight
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{de ? 'Flugtest starten' : 'Run Flight Test'}</span>
          </button>

          <button
            onClick={resetFlightTest}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs transition-colors cursor-pointer"
            title={de ? 'Zurücksetzen' : 'Reset'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

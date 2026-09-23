import React, { useState, useRef, useEffect } from 'react';
import { Sun, ExternalLink } from 'lucide-react';
import { Language } from '../../types';

interface StreiflichtSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

export const StreiflichtSimulator: React.FC<StreiflichtSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  const [lightAngle, setLightAngle] = useState<number>(20); // 0° = grazing (horizontal), 90° = direct front
  const [lightAzimuth, setLightAzimuth] = useState<number>(45); // degrees around 360°
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 0, width, height);

    // Weathered sandstone stone base texture
    ctx.fillStyle = '#44403c';
    ctx.fillRect(20, 20, width - 40, height - 40);

    // Light direction vector
    const radAz = (lightAzimuth * Math.PI) / 180;
    const radEl = (lightAngle * Math.PI) / 180;
    const lx = Math.cos(radAz) * Math.cos(radEl);
    const ly = Math.sin(radAz) * Math.cos(radEl);
    const lz = Math.sin(radEl);

    // Render stone surface with virtual RTI normal-map relief
    ctx.font = 'bold 26px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center';

    const text1 = 'ANNO DOMINI 1784';
    const text2 = 'HIER RUHET IN GOTT';
    const text3 = 'JOHANNES KOCH';

    // Relief intensity depends inversely on elevation angle (low angle = maximum grazing shadow)
    const grazingFactor = Math.max(0.1, 1.0 - lz);
    const shadowOffsetX = -lx * 8 * grazingFactor;
    const shadowOffsetY = -ly * 8 * grazingFactor;
    const highlightOffsetX = lx * 5 * grazingFactor;
    const highlightOffsetY = ly * 5 * grazingFactor;

    const contrastRatio = Math.pow(grazingFactor, 1.8);

    // Shadow in engraved groove
    ctx.fillStyle = `rgba(15, 12, 10, ${0.15 + contrastRatio * 0.8})`;
    ctx.fillText(text1, width / 2 + shadowOffsetX, 85 + shadowOffsetY);
    ctx.fillText(text2, width / 2 + shadowOffsetX, 140 + shadowOffsetY);
    ctx.fillText(text3, width / 2 + shadowOffsetX, 195 + shadowOffsetY);

    // Highlight on opposite rim
    ctx.fillStyle = `rgba(235, 225, 210, ${0.05 + contrastRatio * 0.75})`;
    ctx.fillText(text1, width / 2 + highlightOffsetX, 85 + highlightOffsetY);
    ctx.fillText(text2, width / 2 + highlightOffsetX, 140 + highlightOffsetY);
    ctx.fillText(text3, width / 2 + highlightOffsetX, 195 + highlightOffsetY);

    // Base weathered text color
    ctx.fillStyle = `rgba(120, 113, 108, ${0.4 + (1 - contrastRatio) * 0.3})`;
    ctx.fillText(text1, width / 2, 85);
    ctx.fillText(text2, width / 2, 140);
    ctx.fillText(text3, width / 2, 195);

    // Draw virtual flashlight indicator in corner
    ctx.beginPath();
    ctx.arc(60, height - 60, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(28, 25, 23, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Direction line
    ctx.beginPath();
    ctx.moveTo(60, height - 60);
    ctx.lineTo(60 + Math.cos(radAz) * 20, height - 60 + Math.sin(radAz) * 20);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [lightAngle, lightAzimuth]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-700" />
            <span>{lang === 'de' ? 'Streiflicht: Virtuelle RTI-Reliefabtastung' : lang === 'es' ? 'Simulación de relieve RTI con luz rasante' : 'Grazing Light RTI Relief Simulation'}</span>
          </h3>
          <span className="text-xs font-mono-code bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
            Candidate Pipeline
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          {lang === 'de'
            ? 'CompGen zeigte im Mai 2026: Vision-LLMs halluzinieren Buchstaben bei verwitterten Inschriften. Bewegen Sie den Lichtwinkel auf Streiflicht (flach): Die Schattenkante macht die Gravur lesbar, ohne dass KI raten muss.'
            : lang === 'es' ? 'CompGen informó en mayo de 2026: los LLM con visión alucinan texto en inscripciones históricas erosionadas. Lleva la luz a un ángulo rasante: las sombras revelan la topografía tallada de forma determinista.' : 'CompGen reported in May 2026: Vision LLMs hallucinate text on eroded historical inscriptions. Drag the light to a grazing angle: cast shadows reveal carved topography deterministically.'}
        </p>

        {/* Light Elevation Angle Slider */}
        <div>
          <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1">
            <span>{lang === 'de' ? 'Licht-Einfallswinkel (Höhe):' : lang === 'es' ? 'Elevación de la luz:' : 'Light Elevation Angle:'}</span>
            <span className="font-mono-code font-bold text-amber-900">{lightAngle}° {lightAngle <= 25 ? '(Streiflicht / Grazing)' : lightAngle >= 70 ? '(Frontal / Flat)' : ''}</span>
          </div>
          <input
            type="range"
            min="5"
            max="90"
            step="2"
            value={lightAngle}
            onChange={(e) => setLightAngle(Number(e.target.value))}
            className="w-full accent-amber-800 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-mono-code mt-0.5">
            <span>5° (Maximales Streiflicht)</span>
            <span>45° (Schräg)</span>
            <span>90° (Frontal, Text unsichtbar)</span>
          </div>
        </div>

        {/* Azimuth Angle (Around 360) */}
        <div>
          <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1">
            <span>{lang === 'de' ? 'Lichtposition (360° um Inschrift):' : lang === 'es' ? 'Rotación azimutal de la luz:' : 'Light Azimuth Rotation:'}</span>
            <span className="font-mono-code font-bold text-amber-900">{lightAzimuth}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={lightAzimuth}
            onChange={(e) => setLightAzimuth(Number(e.target.value))}
            className="w-full accent-amber-800 cursor-pointer"
          />
        </div>

        {/* Presets */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => { setLightAngle(12); setLightAzimuth(45); }}
            className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium"
          >
            🔦 {lang === 'de' ? 'Optimales Streiflicht (12°)' : lang === 'es' ? 'Rasante óptima (12°)' : 'Optimal Grazing (12°)'}
          </button>
          <button
            onClick={() => { setLightAngle(85); setLightAzimuth(90); }}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
          >
            ☁️ {lang === 'de' ? 'Normales Tageslicht (85°)' : lang === 'es' ? 'Ambiental plana (85°)' : 'Flat Ambient (85°)'}
          </button>
        </div>
      </div>

      {/* Canvas Output */}
      <div className="lg:col-span-6 space-y-4">
        <div className="bg-stone-900 rounded-2xl p-4 shadow-md border border-stone-800 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={480}
            height={260}
            className="rounded-xl border border-stone-700/80 shadow-inner w-full max-w-md h-auto"
          />
          <div className="w-full flex items-center justify-between text-xs text-stone-400 mt-3 px-2">
            <span>{lightAngle <= 25 ? '✅ Relief sichtbar (Topographie lesbar)' : '⚠️ Frontal: Gravur im Stein verwaschen'}</span>
            <span className="font-mono-code text-amber-400">RTI PTM Kernel</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold block text-amber-900">
              {lang === 'de' ? 'Die Lücke für CompGen e.V.:' : lang === 'es' ? 'El hueco para CompGen e.V.:' : 'The Gap for CompGen e.V.:'}
            </span>
            {onOpenDose && (
              <button
                onClick={() => onOpenDose('denkmal-verlaufsblick')}
                className="text-amber-800 hover:underline text-xs flex items-center gap-1 font-semibold"
              >
                <span>{lang === 'de' ? 'Verwandte Dose öffnen' : lang === 'es' ? 'Abrir la lata relacionada' : 'Open related tin'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className="text-amber-900/90 text-[11px] leading-relaxed">
            {lang === 'de'
              ? 'CompGen nutzt KI-Transkription für Grabsteine, kämpft aber mit Halluzinationen. Statt einem noch größeren Sprachmodell genügt die Handytaschenlampe flach an den Stein gehalten — 3 Fotos, Differenzbild, und die Gravur ist deterministisch lesbar.'
              : lang === 'es' ? 'CompGen lucha con LLM que inventan nombres en lápidas erosionadas. Una linterna rasante convierte las microranuras de la superficie en contraste nítido y elimina errores de transcripción.' : 'CompGen struggles with LLMs inventing names on weathered gravestones. A grazing flashlight turns micro-surface grooves into sharp contrast, eliminating transcription errors.'}
          </p>
        </div>
      </div>
    </div>
  );
};

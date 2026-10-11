import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Palette,
  Pipette,
  Check,
  Copy,
  Sparkles,
  Layers,
  Sliders,
  ChevronDown,
  X,
  History,
  Info,
} from 'lucide-react';
import { Language } from '../../types';
import {
  WetInkPigmentConfig,
  PIGMENT_PRESETS,
  createPigmentFromHex,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  calculateKMReflectance,
} from '../../engine/wet-ink';

export interface WetInkColorSelectorProps {
  selectedPigment: WetInkPigmentConfig;
  onSelectPigment: (pigment: WetInkPigmentConfig) => void;
  lang: Language;
  recentPigments?: WetInkPigmentConfig[];
  previousPigment?: WetInkPigmentConfig | null;
  className?: string;
  variant?: 'popover' | 'inline';
  isOpen?: boolean;
  onClose?: () => void;
}

// Curated Category Sets for Artists & Calligraphers
export const EAST_ASIAN_PIGMENTS = PIGMENT_PRESETS.filter((p) =>
  ['sumi', 'zinnober', 'indigo', 'siena', 'umbra'].includes(p.id)
);

export const MINERAL_PIGMENTS = PIGMENT_PRESETS.filter((p) =>
  ['preussischblau', 'ultramarin', 'koenigsblau', 'kadmiumgelb', 'krapplack', 'viridian'].includes(p.id)
);

export const ARCHIVAL_EARTH_PIGMENTS = PIGMENT_PRESETS.filter((p) =>
  ['sepia', 'eisengallus', 'chinacridon', 'titanweiss'].includes(p.id)
);

export const WetInkColorSelector: React.FC<WetInkColorSelectorProps> = ({
  selectedPigment,
  onSelectPigment,
  lang,
  recentPigments = [],
  previousPigment = null,
  className = '',
  variant = 'inline',
  isOpen = true,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'picker' | 'historical' | 'minerals' | 'modern'>('picker');
  const [hexInput, setHexInput] = useState<string>(selectedPigment.colorHex || '#0c356a');
  const [copiedHex, setCopiedHex] = useState<boolean>(false);

  // HSL state derived from selected pigment
  const [hsl, setHsl] = useState<[number, number, number]>(() => {
    return rgbToHsl(selectedPigment.r, selectedPigment.g, selectedPigment.b);
  });

  // Sync when selectedPigment changes externally
  useEffect(() => {
    setHexInput(selectedPigment.colorHex || rgbToHex(selectedPigment.r, selectedPigment.g, selectedPigment.b));
    setHsl(rgbToHsl(selectedPigment.r, selectedPigment.g, selectedPigment.b));
  }, [selectedPigment]);

  // Handle HSL Sliders
  const handleHslChange = (h: number, s: number, l: number) => {
    setHsl([h, s, l]);
    const [r, g, b] = hslToRgb(h, s, l);
    const hex = rgbToHex(r, g, b);
    setHexInput(hex);
    const custom = createPigmentFromHex(
      hex,
      'custom',
      lang === 'de' ? `Lasur (${hex})` : `Wash (${hex})`,
      lang === 'de' ? `Lasur (${hex})` : `Wash (${hex})`
    );
    onSelectPigment(custom);
  };

  // Handle direct Hex input
  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    const clean = val.replace('#', '').trim();
    if (/^[0-9a-fA-F]{6}$/.test(clean)) {
      const hex = `#${clean.toLowerCase()}`;
      const custom = createPigmentFromHex(
        hex,
        'custom',
        lang === 'de' ? `Eigene Tinte (${hex})` : `Custom Ink (${hex})`,
        lang === 'de' ? `Eigene Tinte (${hex})` : `Custom Ink (${hex})`
      );
      setHsl(rgbToHsl(custom.r, custom.g, custom.b));
      onSelectPigment(custom);
    }
  };

  // Handle copy hex code
  const handleCopyHex = () => {
    navigator.clipboard.writeText(selectedPigment.colorHex || hexInput);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1800);
  };

  // Eyedropper API (Chromium / Modern Browsers)
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          handleHexInputChange(result.sRGBHex);
        }
      } catch {
        // User cancelled picker
      }
    }
  };

  // Subtractive Kubelka-Munk mixture preview between current and previous pigment
  const subtractiveMixPreview = useMemo(() => {
    if (!previousPigment || previousPigment.id === selectedPigment.id) return null;
    const p1 = previousPigment;
    const p2 = selectedPigment;
    const km1 = p1.km || { K: [2.5, 2.5, 2.5], S: [0.3, 0.3, 0.3] };
    const km2 = p2.km || { K: [2.5, 2.5, 2.5], S: [0.3, 0.3, 0.3] };

    // 50/50 Subtractive Mixture
    const kMix = [km1.K[0] * 0.5 + km2.K[0] * 0.5, km1.K[1] * 0.5 + km2.K[1] * 0.5, km1.K[2] * 0.5 + km2.K[2] * 0.5];
    const sMix = [km1.S[0] * 0.5 + km2.S[0] * 0.5, km1.S[1] * 0.5 + km2.S[1] * 0.5, km1.S[2] * 0.5 + km2.S[2] * 0.5];

    const r = calculateKMReflectance(kMix[0], sMix[0], 1.0, 0.970);
    const g = calculateKMReflectance(kMix[1], sMix[1], 1.0, 0.955);
    const b = calculateKMReflectance(kMix[2], sMix[2], 1.0, 0.920);

    const rgbHex = rgbToHex(r * 255, g * 255, b * 255);
    return {
      hex: rgbHex,
      name1: lang === 'de' ? p1.nameDe : p1.nameEn,
      name2: lang === 'de' ? p2.nameDe : p2.nameEn,
    };
  }, [selectedPigment, previousPigment, lang]);

  if (!isOpen) return null;

  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200 shadow-md p-4 text-xs select-none space-y-3.5 transition-all ${
        variant === 'popover' ? 'w-80 sm:w-96' : 'w-full'
      } ${className}`}
    >
      {/* 1. Header with Active Swatch, Name & Quick Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          {/* Swatch circle with specular gloss */}
          <div className="relative group shrink-0">
            <span
              className="w-8 h-8 rounded-xl border border-black/20 shadow-xs block transition-transform group-hover:scale-105"
              style={{ backgroundColor: selectedPigment.colorHex }}
            />
            <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/15 to-white/40 pointer-events-none" />
          </div>

          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm tracking-tight leading-tight">
              {lang === 'de' ? selectedPigment.nameDe : selectedPigment.nameEn}
            </h4>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-stone-500">
              <span className="font-bold text-stone-700">{selectedPigment.colorHex}</span>
              <span>·</span>
              <span>
                {lang === 'de' ? 'Dichte' : 'Density'}: {(selectedPigment.density * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Copy Hex */}
          <button
            onClick={handleCopyHex}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title={lang === 'de' ? 'Farbcode kopieren' : 'Copy Hex Code'}
          >
            {copiedHex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* System Pipette (if supported) */}
          {'EyeDropper' in window && (
            <button
              onClick={handleEyeDropper}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title={lang === 'de' ? 'Farbe vom Bildschirm aufnehmen' : 'Pick color from screen'}
            >
              <Pipette className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Native HTML Color Input */}
          <label
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer flex items-center"
            title={lang === 'de' ? 'System-Farbauswahl' : 'System Color Picker'}
          >
            <input
              type="color"
              value={selectedPigment.colorHex}
              onChange={(e) => handleHexInputChange(e.target.value)}
              className="sr-only"
            />
            <Palette className="w-3.5 h-3.5" />
          </label>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-xl border border-stone-200/60 font-mono text-[10px]">
        <button
          onClick={() => setActiveTab('picker')}
          className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'picker' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sliders className="w-3 h-3 text-amber-600" />
          <span>{lang === 'de' ? 'Regler' : 'Mixer'}</span>
        </button>

        <button
          onClick={() => setActiveTab('historical')}
          className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'historical' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>文房</span>
          <span>{lang === 'de' ? 'Tuschen' : 'Asian'}</span>
        </button>

        <button
          onClick={() => setActiveTab('minerals')}
          className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'minerals' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>{lang === 'de' ? 'Minerale' : 'Minerals'}</span>
        </button>

        <button
          onClick={() => setActiveTab('modern')}
          className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'modern' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>{lang === 'de' ? 'Archivalisch' : 'Archival'}</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'picker' && (
        <div className="space-y-3 pt-1">
          {/* Continuous Hue Rainbow Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 font-bold">
              <span>{lang === 'de' ? 'Farbton (Hue)' : 'Hue'}</span>
              <span>{hsl[0]}°</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max="360"
                value={hsl[0]}
                onChange={(e) => handleHslChange(parseInt(e.target.value, 10), hsl[1], hsl[2])}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer outline-none shadow-inner"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              />
            </div>
          </div>

          {/* Continuous Saturation Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 font-bold">
              <span>{lang === 'de' ? 'Sättigung (Chroma)' : 'Saturation'}</span>
              <span>{hsl[1]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl[1]}
              onChange={(e) => handleHslChange(hsl[0], parseInt(e.target.value, 10), hsl[2])}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer outline-none shadow-inner"
              style={{
                background: `linear-gradient(to right, hsl(${hsl[0]}, 0%, ${hsl[2]}%), hsl(${hsl[0]}, 100%, ${hsl[2]}%))`,
              }}
            />
          </div>

          {/* Continuous Lightness / Wash Dilution Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 font-bold">
              <span>{lang === 'de' ? 'Helligkeit / Lasur' : 'Lightness'}</span>
              <span>{hsl[2]}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={hsl[2]}
              onChange={(e) => handleHslChange(hsl[0], hsl[1], parseInt(e.target.value, 10))}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer outline-none shadow-inner"
              style={{
                background: `linear-gradient(to right, hsl(${hsl[0]}, ${hsl[1]}%, 5%), hsl(${hsl[0]}, ${hsl[1]}%, 50%), hsl(${hsl[0]}, ${hsl[1]}%, 95%))`,
              }}
            />
          </div>

          {/* Hex & RGB Numerical Input Row */}
          <div className="pt-1 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
              <span className="font-mono text-[10px] text-stone-400 font-bold">HEX</span>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInputChange(e.target.value)}
                maxLength={7}
                className="w-full bg-transparent font-mono text-[11px] font-bold text-stone-800 outline-none uppercase"
                placeholder="#0C356A"
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
              <span className="text-red-700 font-bold">R{selectedPigment.r}</span>
              <span className="text-emerald-700 font-bold">G{selectedPigment.g}</span>
              <span className="text-blue-700 font-bold">B{selectedPigment.b}</span>
            </div>
          </div>
        </div>
      )}

      {/* Preset Swatch Grids */}
      {activeTab === 'historical' && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {EAST_ASIAN_PIGMENTS.map((pig) => {
            const isSelected = selectedPigment.id === pig.id;
            return (
              <button
                key={pig.id}
                onClick={() => onSelectPigment(pig)}
                className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-900 bg-amber-50/70 font-bold ring-2 ring-amber-900/60 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-black/25 shrink-0 shadow-2xs"
                  style={{ backgroundColor: pig.colorHex }}
                />
                <div className="truncate">
                  <div className="text-[11px] font-bold text-stone-900 truncate">
                    {lang === 'de' ? pig.nameDe.split(' (')[0] : pig.nameEn.split(' (')[0]}
                  </div>
                  <div className="font-mono text-[9px] text-stone-500 uppercase">{pig.colorHex}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === 'minerals' && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {MINERAL_PIGMENTS.map((pig) => {
            const isSelected = selectedPigment.id === pig.id;
            return (
              <button
                key={pig.id}
                onClick={() => onSelectPigment(pig)}
                className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-900 bg-amber-50/70 font-bold ring-2 ring-amber-900/60 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-black/25 shrink-0 shadow-2xs"
                  style={{ backgroundColor: pig.colorHex }}
                />
                <div className="truncate">
                  <div className="text-[11px] font-bold text-stone-900 truncate">
                    {lang === 'de' ? pig.nameDe.split(' (')[0] : pig.nameEn.split(' (')[0]}
                  </div>
                  <div className="font-mono text-[9px] text-stone-500 uppercase">{pig.colorHex}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === 'modern' && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {ARCHIVAL_EARTH_PIGMENTS.map((pig) => {
            const isSelected = selectedPigment.id === pig.id;
            return (
              <button
                key={pig.id}
                onClick={() => onSelectPigment(pig)}
                className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-900 bg-amber-50/70 font-bold ring-2 ring-amber-900/60 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-black/25 shrink-0 shadow-2xs"
                  style={{ backgroundColor: pig.colorHex }}
                />
                <div className="truncate">
                  <div className="text-[11px] font-bold text-stone-900 truncate">
                    {lang === 'de' ? pig.nameDe.split(' (')[0] : pig.nameEn.split(' (')[0]}
                  </div>
                  <div className="font-mono text-[9px] text-stone-500 uppercase">{pig.colorHex}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Subtractive Optical Glaze Preview & Live Mixture (Kubelka-Munk) */}
      <div className="pt-1.5 border-t border-stone-100 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase font-bold">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>{lang === 'de' ? 'Kubelka-Munk Optik-Vorschau' : 'Kubelka-Munk Optics'}</span>
          </span>
          <span>{lang === 'de' ? 'Lasur & Vollton' : 'Glaze & Mass'}</span>
        </div>

        {/* Dual Mass-tone & Thin Wash Preview Bar */}
        <div className="relative h-7 rounded-xl overflow-hidden border border-stone-200/80 shadow-inner flex">
          {/* Half 1: Dense Mass tone */}
          <div
            className="flex-1 flex items-center justify-center font-mono text-[9px] font-bold text-white/90 drop-shadow-xs"
            style={{ backgroundColor: selectedPigment.colorHex }}
          >
            {lang === 'de' ? 'Vollton' : 'Mass'}
          </div>

          {/* Half 2: Translucent Wash over Paper */}
          <div
            className="flex-1 flex items-center justify-center font-mono text-[9px] font-bold text-stone-800 relative bg-[#faf7ee]"
          >
            {/* Translucent wash overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: selectedPigment.colorHex,
                opacity: 0.38,
                mixBlendMode: 'multiply',
              }}
            />
            <span className="relative z-10">{lang === 'de' ? 'Lasur' : 'Wash'}</span>
          </div>
        </div>

        {/* Dynamic Subtractive Mixture Badge with Previous Pigment */}
        {subtractiveMixPreview && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2 flex items-center justify-between gap-2 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                style={{ backgroundColor: previousPigment?.colorHex }}
              />
              <span className="font-bold text-stone-700">+</span>
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                style={{ backgroundColor: selectedPigment.colorHex }}
              />
              <span className="text-stone-500 font-mono">→</span>
              <span
                className="w-4 h-4 rounded-full border border-black/30 shrink-0 shadow-2xs"
                style={{ backgroundColor: subtractiveMixPreview.hex }}
              />
            </div>
            <span className="font-mono text-[9px] font-bold text-amber-900 truncate">
              {lang === 'de' ? 'Subtraktive Mischung' : 'Subtractive Mix'}
            </span>
          </div>
        )}
      </div>

      {/* 5. Recent Pigments Tray (Farbtablett) */}
      {recentPigments.length > 0 && (
        <div className="pt-1.5 border-t border-stone-100 space-y-1.5">
          <div className="flex items-center gap-1 text-[10px] font-mono text-stone-400 font-bold uppercase">
            <History className="w-3 h-3" />
            <span>{lang === 'de' ? 'Zuletzt verwendet' : 'Recent Swatches'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {recentPigments.map((pig, idx) => {
              const isSelected = selectedPigment.id === pig.id || selectedPigment.colorHex === pig.colorHex;
              return (
                <button
                  key={`${pig.id}-${idx}`}
                  onClick={() => onSelectPigment(pig)}
                  className={`w-6 h-6 rounded-lg border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-stone-900 ring-2 ring-stone-900 scale-110 shadow-xs'
                      : 'border-stone-300 hover:scale-105 hover:border-stone-500'
                  }`}
                  style={{ backgroundColor: pig.colorHex }}
                  title={lang === 'de' ? pig.nameDe : pig.nameEn}
                >
                  <span className="sr-only">{pig.colorHex}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

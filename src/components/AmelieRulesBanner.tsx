import React, { useState } from 'react';
import { Sparkles, Heart, Compass, Check, Copy, ChevronDown, ChevronUp, ShieldCheck, Mail, Gift } from 'lucide-react';
import { MANIFEST_RULES, AMELIE_PLEDGE } from '../data/manifest';
import { Language } from '../types';

interface AmelieRulesBannerProps {
  lang: Language;
  onOpenManifest?: () => void;
  onOpenEmails?: () => void;
}

export const AmelieRulesBanner: React.FC<AmelieRulesBannerProps> = ({
  lang,
  onOpenManifest,
  onOpenEmails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRuleNum, setSelectedRuleNum] = useState<number | null>(null);
  const [copiedPledge, setCopiedPledge] = useState(false);

  const copyPledge = () => {
    navigator.clipboard.writeText(AMELIE_PLEDGE[lang]);
    setCopiedPledge(true);
    setTimeout(() => setCopiedPledge(false), 2000);
  };

  const isDe = lang === 'de';
  const isEs = lang === 'es';

  return (
    <div className="relative rounded-2xl bg-[#faf4e8] border border-[#d8cbba] p-5 md:p-6 shadow-xs overflow-hidden transition-all">
      {/* Decorative French Postal Markings */}
      <div className="absolute -right-4 -bottom-6 select-none pointer-events-none opacity-5 hidden lg:block">
        <div className="font-typewriter text-9xl font-black text-[#8c1d40]">PAR AVION</div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e2d5c3]">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#8c1d40] text-[#fbf7f0] flex items-center justify-center shrink-0 shadow-sm border border-[#701531]">
            <Compass className="w-5 h-5 text-[#f6bd60]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-typewriter text-[11px] font-bold uppercase tracking-widest text-[#8c1d40] px-2 py-0.5 rounded bg-[#8c1d40]/10 border border-[#8c1d40]/20">
                {isDe ? 'Die Amélie-Philosophie' : isEs ? 'La Filosofía Amélie' : 'The Amélie Philosophy'}
              </span>
              <span className="text-[11px] font-typewriter text-[#8b6f57]">
                Montmartre · 5 Règles d'Or · CC0
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-amelie text-[#2b1e16] tracking-tight mt-0.5">
              {isDe ? 'Die fünf Regeln: Ideen, die jemand anderem gehören' : isEs ? 'Las cinco reglas: Ideas que pertenecen a alguien más' : 'The Five Rules: Ideas that belong to someone else'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {onOpenEmails && (
            <button
              onClick={onOpenEmails}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-typewriter font-semibold bg-[#ede3d1] hover:bg-[#e2d5c3] text-[#4a3728] border border-[#d4c4b0] transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#8c1d40]" />
              <span>{isDe ? 'Muster-Mails' : isEs ? 'Muestras de Email' : 'Sample Emails'}</span>
            </button>
          )}

          {onOpenManifest && (
            <button
              onClick={onOpenManifest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-typewriter font-semibold bg-[#8c1d40] hover:bg-[#741533] text-[#fff9f5] transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f6bd60]" />
              <span>{isDe ? 'Zum Manifest' : isEs ? 'Al Manifiesto' : 'Manifesto'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-[#6b5849] hover:bg-[#ede3d1] transition-colors cursor-pointer border border-transparent hover:border-[#d4c4b0]"
            title={isExpanded ? (isDe ? 'Einklappen' : isEs ? 'Plegar' : 'Collapse') : (isDe ? 'Ausklappen' : isEs ? 'Desplegar' : 'Expand')}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="pt-3 text-xs sm:text-sm text-[#5c4a3d] font-serif-title italic leading-relaxed">
        « {isDe
          ? 'Amélie Poulain findet eine alte Blechdose hinter einer Fliese, recherchiert vierzig Jahre später den Jungen, dem sie gehörte, legt sie ihm in eine Telefonzelle und verschwindet. Sie sucht sich die Person aus, bevor sie das Geschenk macht, und fragt hinterher nie nach.'
          : isEs
          ? 'Amélie Poulain encuentra una lata detrás de un azulejo, rastrea cuarenta años después al niño al que pertenecía, se la deja en una cabina telefónica y desaparece. Elige a la persona antes de hacer el regalo y nunca pregunta después.'
          : 'Amélie Poulain finds an old tin box behind a bathroom tile, tracks down the boy it belonged to forty years later, leaves it inside a phone booth, and vanishes. She selects the recipient before gifting, and never asks afterward.'} »
      </div>

      {/* 5 Quick Interactive Rule Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-4">
        {MANIFEST_RULES.map((rule) => {
          const isSelected = selectedRuleNum === rule.number;
          return (
            <button
              key={rule.number}
              onClick={() => {
                setSelectedRuleNum(isSelected ? null : rule.number);
                if (!isExpanded) setIsExpanded(true);
              }}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#8c1d40] text-white border-[#701531] shadow-md ring-2 ring-[#f6bd60]/40'
                  : 'bg-[#fffdf9] text-[#2b1e16] border-[#dfd1be] hover:border-[#8c1d40]/40 hover:bg-[#fcf7ed]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span
                  className={`w-5 h-5 rounded-full text-[11px] font-mono-code font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#f6bd60] text-[#701531]' : 'bg-[#ede3d1] text-[#8c1d40]'
                  }`}
                >
                  {rule.number}
                </span>
                <span className={`text-[10px] font-typewriter uppercase tracking-wider ${isSelected ? 'text-[#f6bd60]' : 'text-[#8b6f57]'}`}>
                  {rule.number === 1
                    ? (isDe ? 'Zustellung' : isEs ? 'Entrega' : 'Delivery')
                    : rule.number === 2
                    ? (isDe ? 'Signieren' : isEs ? 'Firmar' : 'Sign & CC0')
                    : rule.number === 3
                    ? (isDe ? 'Klingelverbot' : isEs ? 'Sin acoso' : 'No Follow-up')
                    : rule.number === 4
                    ? (isDe ? 'Werkzeug' : isEs ? 'Herramientas' : 'Tools Only')
                    : (isDe ? 'Max. 2' : isEs ? 'Máx. 2' : 'Build Max 2')}
                </span>
              </div>
              <h4 className="text-xs font-bold font-amelie leading-snug line-clamp-2">
                {isDe ? rule.titleDe : rule.titleEn}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-[#dfd1be] space-y-4 animate-fadeIn">
          {selectedRuleNum ? (
            (() => {
              const rule = MANIFEST_RULES.find((r) => r.number === selectedRuleNum);
              if (!rule) return null;
              return (
                <div className="p-4 rounded-xl bg-white border border-[#8c1d40]/30 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#8c1d40] text-white font-mono-code text-xs font-bold">
                      {isDe ? `Regel #${rule.number}` : isEs ? `Regla #${rule.number}` : `Rule #${rule.number}`}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold font-amelie text-[#2b1e16]">
                      {isDe ? rule.titleDe : rule.titleEn}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4a3b2c] leading-relaxed">
                    {isDe ? rule.descriptionDe : rule.descriptionEn}
                  </p>
                  <div className="pt-2 text-xs font-typewriter text-[#8c1d40] font-semibold">
                    ✦ {isDe ? 'Faustformel: ' : isEs ? 'Regla general: ' : 'Rule of Thumb: '}
                    <span className="font-normal italic text-[#2b1e16]">
                      {isDe ? rule.ruleOfThumbDe : rule.ruleOfThumbEn}
                    </span>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#5c4a3d]">
              <div className="p-3.5 rounded-xl bg-white border border-[#dfd1be] space-y-1">
                <span className="font-typewriter font-bold text-[#8c1d40] uppercase text-[11px] block">
                  ✦ {isDe ? 'Das 1:20 Verhältnis' : isEs ? 'La proporción 1:20' : 'The 1:20 Ratio'}
                </span>
                <p>
                  {isDe
                    ? 'Neue Modelle machen Extraktion & Code spottbillig. Du findest Ideen zwanzigmal schneller als du bauen kannst: 1 baust du selbst, 19 gehören jemand anderem.'
                    : isEs
                    ? 'Los nuevos modelos abaratan la extracción y el código. Encuentras ideas veinte veces más rápido de lo que puedes construir: conservas 1, regalas las otras 19.'
                    : 'Commodity AI makes extraction and coding virtually free. You find ideas 20x faster than you can build: keep 1, gift the other 19.'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#dfd1be] space-y-1">
                <span className="font-typewriter font-bold text-[#1b4332] uppercase text-[11px] block">
                  ✦ {isDe ? 'Der Kula-Ring (Die Gabe)' : isEs ? 'El Anillo de Kula (El Regalo)' : 'The Kula Ring (The Gift)'}
                </span>
                <p>
                  {isDe
                    ? 'Der Amélie-Pledge: „Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort."'
                    : isEs
                    ? 'El Compromiso Amélie: «Esta idea no pertenece a nadie. Tómala, constrúyela, véndela; no me debes nada, ni siquiera una respuesta.»'
                    : 'The Amélie Pledge: "This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even an answer."'}
                </p>
              </div>
            </div>
          )}

          {/* Quick Pledge Copy Bar */}
          <div className="p-3.5 rounded-xl bg-[#2b1e16] text-[#fbf7f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#f6bd60] shrink-0" />
              <span className="italic font-amelie">
                "{AMELIE_PLEDGE[lang]}"
              </span>
            </div>
            <button
              onClick={copyPledge}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8c1d40] hover:bg-[#a3224b] text-white text-xs font-typewriter font-bold transition-colors shrink-0 cursor-pointer"
            >
              {copiedPledge ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#f6bd60]" />
                  <span>{isDe ? 'Kopiert!' : isEs ? '¡Copiado!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Pledge kopieren' : isEs ? 'Copiar compromiso' : 'Copy Pledge'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

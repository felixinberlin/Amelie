import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Heart, 
  Smile, 
  Compass, 
  Coffee, 
  Send, 
  Copy, 
  Check, 
  Utensils, 
  Waves, 
  RotateCw, 
  Lightbulb, 
  FileText, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Award,
  BookOpen,
  Feather,
  Wand2,
  Gift
} from 'lucide-react';
import { Language } from '../types';

interface WhimsyAndGoodnessViewProps {
  lang: Language;
}

export const WhimsyAndGoodnessView: React.FC<WhimsyAndGoodnessViewProps> = ({ lang }) => {
  // Web Audio sound synthesizer for crunchy crème brûlée crack & stone skipping
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playCrackSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Crisp ceramic snap + sweet chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio context may be restricted in some iframes; graceful fallback
    }
  };

  const playSplashSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Graceful fallback
    }
  };

  // State: Crème Brûlée Simulator
  const [cremeCracks, setCremeCracks] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [cremeCrackCount, setCremeCrackCount] = useState<number>(0);

  const handleCrackCreme = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    playCrackSound();
    setCremeCracks((prev) => [...prev.slice(-6), { x, y, id: Date.now() }]);
    setCremeCrackCount((c) => c + 1);
  };

  // State: Stone Skipping
  const [skipsCount, setSkipsCount] = useState(0);
  const [stoneRipples, setStoneRipples] = useState<Array<{ id: number; delay: number }>>([]);

  const handleSkipStone = () => {
    playSplashSound();
    const totalSkips = Math.floor(Math.random() * 4) + 3; // 3 to 6 skips
    setSkipsCount((s) => s + totalSkips);
    const newRipples = Array.from({ length: totalSkips }).map((_, i) => ({
      id: Date.now() + i,
      delay: i * 200,
    }));
    setStoneRipples(newRipples);
    setTimeout(() => setStoneRipples([]), 2500);
  };

  // State: Random Act of Kind Mischief Generator
  const MISCHIEF_IDEAS = [
    {
      titleDe: 'Das vergessene Buch-Lesezeichen',
      titleEn: 'The Forgotten Library Bookmark',
      actionDe: 'Schreibe auf einen schönen Papierstreifen: „Jemand in dieser Stadt wünscht dir heimlich einen wunderschönen Tag." Lege ihn in der Stadtbibliothek in Seite 42 eines verstaubten Geschichtsbuches.',
      actionEn: 'Write on a neat strip of paper: "Someone in this city secretly wishes you a wonderful day." Slip it into page 42 of a dusty library book.',
      tagDe: 'Kleine Poesie',
      tagEn: 'Poetic Mischief'
    },
    {
      titleDe: 'Das 50-Cent-Bäcker-Wunder',
      titleEn: 'The 50-Cent Bakery Wonder',
      actionDe: 'Klebe eine 1-Euro-Münze mit Tesa an den Schaufensterrahmen des Bäckers mit dem Zettel: „Für das nächste Schulkind, dem das Kleingeld für ein Franzbrötchen fehlt."',
      actionEn: 'Tape a €1 coin to the bakery glass with a note: "For the next schoolkid who is short on coins for a cinnamon roll."',
      tagDe: 'Herzenswärme',
      tagEn: 'Warm Kindness'
    },
    {
      titleDe: 'Das 6-Uhr-Morgens-Kreidehüpfspiel',
      titleEn: 'The 6 AM Platform Hopscotch',
      actionDe: 'Male mit Straßenmalkreide um 6:30 Uhr ein klassisches Himmel-und-Hölle-Hüpfspiel auf den grauen Asphalt vor der U-Bahn-Station. Beobachte aus der Ferne, wie gestresste Pendler plötzlich hüpfen.',
      actionEn: 'Draw a classic chalk hopscotch grid on the gray pavement outside a train station at 6:30 AM. Watch hurried commuters secretly hop.',
      tagDe: 'Gegen die Tristesse',
      tagEn: 'Defeating Grayness'
    },
    {
      titleDe: 'Der Liebesbrief an den Parkscheinautomaten',
      titleEn: 'Love Letter on the Parking Meter',
      actionDe: 'Klebe einen kleinen gelben Zettel auf den Münzschlitz: „Du bist eine sehr treue Maschine, aber Bäume sind schöner. An den Fahrer: Atme dreimal tief ein. Alles wird gut."',
      actionEn: 'Stick a small yellow sticky note on the coin slot: "You are a very loyal machine, but trees are prettier. Dear driver: take three deep breaths. Everything will be okay."',
      tagDe: 'Entwaffnender Witz',
      tagEn: 'Gentle Humor'
    },
    {
      titleDe: 'Die Kurier-Dankes-Tafel Schokolade',
      titleEn: 'The Courier Care Chocolate',
      actionDe: 'Befestige eine Tafel gute Schokolade und eine Flasche kaltes Mineralwasser mit einer Schleife an deiner Haustür: „Liebe Paketbotin, lieber Paketbote: Danke für deine schwere Arbeit! Bitte nimm das mit."',
      actionEn: 'Fasten a chocolate bar and cold mineral water to your entrance with a ribbon: "Dear delivery courier: Thank you for your hard work! Please take this with you."',
      tagDe: 'Echte Anerkennung',
      tagEn: 'Real Gratitude'
    },
    {
      titleDe: 'Das Kopierer-Orakel im Großraumbüro',
      titleEn: 'The Office Copier Fortune Slip',
      actionDe: 'Lege ein Blatt ganz unten in den Papierschacht des Büro-Druckers mit der winzigen Fußzeile: „Dieser Ausdruck bescheinigt Ihnen außergewöhnliche Geduld und einen exzellenten Geschmack."',
      actionEn: 'Place a sheet at the very bottom of the office printer tray with a small printed footer: "This printout certifies you possess extraordinary patience and superb taste."',
      tagDe: 'Büro-Magie',
      tagEn: 'Workplace Magic'
    }
  ];

  const [activeMischiefIndex, setActiveMischiefIndex] = useState(0);
  const [copiedMischief, setCopiedMischief] = useState(false);

  const drawNextMischief = () => {
    setActiveMischiefIndex((prev) => (prev + 1) % MISCHIEF_IDEAS.length);
  };

  const handleCopyMischief = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMischief(true);
    setTimeout(() => setCopiedMischief(false), 2000);
  };

  // State: Beamtendeutsch-in-Kinderwitz-Übersetzer
  const [officialText, setOfficialText] = useState(
    'Rückforderungsbescheid gemäß § 45 Zehntes Buch Sozialgesetzbuch (SGB X) wegen Verletzung der gesetzlichen Mitwirkungspflichten nach § 60 Abs. 1 Nr. 2 SGB I'
  );

  const [funnyTranslated, setFunnyTranslated] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Banner */}
      <div className="bg-[#fcfaf6] border border-amber-900/15 rounded-3xl p-6 md:p-10 space-y-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-950 font-semibold">
          <span className="px-3 py-1 rounded-md bg-amber-100/90 border border-amber-300/80 flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
            {lang === 'de' ? 'Das Amélie-Prinzip' : 'The Amélie Principle'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
            {lang === 'de' ? 'Heiter & Besser' : 'Funny & Better'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
            {lang === 'de' ? 'Freude ohne Rechnung' : 'Joy with Zero Invoice'}
          </span>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-2xl md:text-4xl font-serif text-stone-900 tracking-tight leading-tight">
            {lang === 'de'
              ? '„Wir wollen die Welt zu einem heiteren und besseren Ort machen."'
              : '"We want to make the world a funny and better place."'}
          </h1>
          <p className="text-stone-700 text-sm md:text-base leading-relaxed font-serif">
            {lang === 'de'
              ? 'Die Welt ertrinkt in zynischen Apps, Mahnungen, kalten Tabellen und endlosen Abos. Amélie Poulain erinnerte uns daran: Echte Veränderung beginnt oft mit einem Augenzwinkern — einem reisenden Gartenzwerg, dem Knacken des Zuckers auf der Crème Brûlée, einer heimlich bezahlten Tasse Kaffee oder einem Werkzeug, das einer Krankenschwester nachts 300 Euro zustehendes Gehalt rettet.'
              : 'The world is drowning in cynical SaaS apps, debt collection letters, and endless subscription fees. Amélie Poulain reminded us that genuine change begins with a conspiratorial wink—a traveling garden gnome, the crack of caramelized sugar on crème brûlée, an anonymously gifted coffee, or a tool that saves an exhausted nurse €300 in missing night pay.'}
          </p>
        </div>

        {/* Amélie's Secret Joys Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200/80 space-y-1 shadow-2xs">
            <span className="font-bold text-stone-900 block flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-700" />
              {lang === 'de' ? 'Crème Brûlée knacken' : 'Crack Crème Brûlée'}
            </span>
            <span className="text-stone-600 leading-snug block">
              {lang === 'de'
                ? 'Den Teelöffel umdrehen und mit der Spitze die karamellisierte Kruste knacken lassen.'
                : 'Turn the teaspoon upside down and snap the brittle sugar crust with the tip.'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200/80 space-y-1 shadow-2xs">
            <span className="font-bold text-stone-900 block flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-sky-600" />
              {lang === 'de' ? 'Steinehüpfen am Kanal' : 'Stone Skipping on Canal'}
            </span>
            <span className="text-stone-600 leading-snug block">
              {lang === 'de'
                ? 'Flache Kieselsteine auf dem Canal Saint-Martin springen lassen: eins, zwei, drei, vier!'
                : 'Flick flat river stones across calm canal waters: one, two, three, four skips!'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200/80 space-y-1 shadow-2xs">
            <span className="font-bold text-stone-900 block flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-600" />
              {lang === 'de' ? 'Die Kula-Gabe' : 'The Kula Gift'}
            </span>
            <span className="text-stone-600 leading-snug block">
              {lang === 'de'
                ? 'Einem Fremden etwas schenken, das sein Leben leichter macht — und dann spurlos verschwinden.'
                : 'Gift a stranger something that lightens their burden—and quietly vanish.'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE AMÉLIE SENSORIAL SIMULATORS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg md:text-xl font-serif text-stone-900 tracking-tight flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-800" />
              <span>{lang === 'de' ? 'Amélies Taktile Freuden-Werkstatt' : 'Amélie’s Tactile Micro-Joy Workshop'}</span>
            </h2>
            <p className="text-xs text-stone-600">
              {lang === 'de'
                ? 'Interaktive Mini-Oasen gegen den Alltagstrott. Klicken und mit allen Sinnen erleben.'
                : 'Interactive tactile micro-oases against daily fatigue. Click and feel.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SIMULATOR A: Crème Brûlée Crack Dish */}
          <div className="p-6 rounded-3xl bg-white border border-amber-900/15 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-900 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-700" />
                  {lang === 'de' ? 'Die perfekte Zuckerkruste' : 'The Perfect Caramelized Crust'}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                  {cremeCrackCount} {lang === 'de' ? 'geknackt' : 'cracks'}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                {lang === 'de'
                  ? 'Klicke auf die Schale, um die warme Karamellkruste mit dem Löffelrücken zu zerbrechen.'
                  : 'Click on the dish to break the brittle caramel crust with the back of the spoon.'}
              </p>
            </div>

            {/* Interactive Crème Brûlée Dish */}
            <div 
              onClick={handleCrackCreme}
              className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border-4 border-amber-700/20 shadow-inner cursor-pointer select-none overflow-hidden flex items-center justify-center transition-transform active:scale-[0.99]"
              title={lang === 'de' ? 'Klicken zum Knacken!' : 'Click to crack!'}
            >
              {/* Custard surface shimmer */}
              <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-amber-100/60 via-amber-200/40 to-transparent pointer-events-none" />

              {/* Spoon icon indicator */}
              <div className="text-amber-900/40 font-mono text-xs flex items-center gap-1.5 pointer-events-none">
                <Utensils className="w-4 h-4" />
                <span>{lang === 'de' ? 'Hier tippen zum Knacken' : 'Tap here to crack'}</span>
              </div>

              {/* Fissure crack marks */}
              {cremeCracks.map((crack) => (
                <div
                  key={crack.id}
                  style={{ left: crack.x, top: crack.y }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping duration-300"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100/90 border border-amber-700/40" />
                </div>
              ))}

              {cremeCracks.map((crack) => (
                <div
                  key={`perm-${crack.id}`}
                  style={{ left: crack.x, top: crack.y }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <div className="w-3 h-3 rounded-full bg-amber-950/70 shadow-xs" />
                  <div className="w-8 h-0.5 bg-amber-900/60 rotate-45 transform -translate-x-2 -translate-y-1" />
                  <div className="w-6 h-0.5 bg-amber-900/60 -rotate-12 transform translate-x-1" />
                </div>
              ))}
            </div>

            <div className="text-center text-[11px] text-amber-900 font-medium italic">
              {cremeCrackCount === 0
                ? (lang === 'de' ? 'Ein einziger Klick genügt für ein kleines Glück.' : 'A single tap is enough for a momentary joy.')
                : (lang === 'de' ? `„Das Vergnügen, mit der Löffelspitze die Kruste zu zerbrechen." (${cremeCrackCount}x)` : `“The pleasure of cracking burnt sugar with a spoon.” (${cremeCrackCount}x)`)}
            </div>
          </div>

          {/* SIMULATOR B: Canal Saint-Martin Stone Skipping */}
          <div className="p-6 rounded-3xl bg-white border border-amber-900/15 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-sky-900 flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-sky-600" />
                  {lang === 'de' ? 'Steinehüpfen auf dem Canal Saint-Martin' : 'Stone Skipping on the Canal'}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-semibold border border-sky-200">
                  {skipsCount} {lang === 'de' ? 'Sprünge' : 'skips'}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                {lang === 'de'
                  ? 'Flippe flache Kieselsteine über das spiegelglatte Pariser Wasser.'
                  : 'Skip flat stones across the mirror-calm waters of the Paris canal.'}
              </p>
            </div>

            {/* Interactive Water Surface */}
            <div 
              onClick={handleSkipStone}
              className="relative w-full h-44 rounded-2xl bg-gradient-to-r from-sky-300 via-teal-200 to-sky-400 border-4 border-sky-600/20 shadow-inner cursor-pointer select-none overflow-hidden flex items-center justify-around transition-transform active:scale-[0.99]"
              title={lang === 'de' ? 'Klicken, um Stein zu werfen!' : 'Click to skip a stone!'}
            >
              {/* Gentle water reflections */}
              <div className="absolute inset-0 bg-radial from-transparent to-sky-900/20 pointer-events-none" />

              <div className="text-sky-950/50 font-mono text-xs flex items-center gap-1.5 pointer-events-none">
                <Waves className="w-4 h-4" />
                <span>{lang === 'de' ? 'Klicken zum Werfen' : 'Click to skip stone'}</span>
              </div>

              {/* Water Ripples */}
              {stoneRipples.map((ripple, idx) => (
                <div
                  key={ripple.id}
                  style={{
                    left: `${20 + idx * 18}%`,
                    top: `${45 + (idx % 2 === 0 ? -6 : 8)}%`,
                    animationDelay: `${ripple.delay}ms`,
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-white/80 animate-ping" />
                  <div className="w-3 h-3 rounded-full bg-white/70 absolute top-3.5 left-3.5" />
                  <span className="absolute -top-5 left-2 text-[10px] font-mono font-bold text-sky-950 bg-white/80 px-1 rounded">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1">
              <span>{lang === 'de' ? 'Wasser: Spiegelglatt, 16°C' : 'Water: Mirror calm, 16°C'}</span>
              <button
                onClick={handleSkipStone}
                className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 font-medium rounded-lg transition-colors font-mono"
              >
                {lang === 'de' ? 'Nächster Stein 🪨' : 'Next Pebble 🪨'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: AMÉLIE'S RANDOM ACT OF KIND MISCHIEF (Zettel aus der Blechdose) */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#f7f4ec] border border-amber-900/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-800" />
              {lang === 'de' ? 'Amélies Zettelkasten: Ein Streich mit Herz' : 'Amélie’s Tin Box: Kind Mischief for Today'}
            </span>
            <h3 className="text-xl font-serif text-stone-900">
              {lang === 'de' ? 'Zieh einen Zettel aus der Blechdose' : 'Draw a Note from the Tin Box'}
            </h3>
          </div>

          <button
            onClick={drawNextMischief}
            className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-xl text-xs font-semibold font-mono transition-all flex items-center gap-2 shadow-xs shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{lang === 'de' ? 'Nächsten Zettel ziehen' : 'Draw Another Note'}</span>
          </button>
        </div>

        {/* The Pulled Note */}
        {(() => {
          const current = MISCHIEF_IDEAS[activeMischiefIndex];
          return (
            <div className="p-5 md:p-6 rounded-2xl bg-white border border-amber-200/90 shadow-sm space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  {lang === 'de' ? current.tagDe : current.tagEn}
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  {activeMischiefIndex + 1} / {MISCHIEF_IDEAS.length}
                </span>
              </div>

              <h4 className="text-lg font-serif font-bold text-stone-900">
                {lang === 'de' ? current.titleDe : current.titleEn}
              </h4>

              <p className="text-stone-800 text-sm md:text-base leading-relaxed font-serif italic bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                „{lang === 'de' ? current.actionDe : current.actionEn}"
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-500 font-mono">
                  {lang === 'de' ? 'Kosten: 0,00 € · Wirkung: Unbezahlbar' : 'Cost: $0.00 · Value: Priceless'}
                </span>

                <button
                  onClick={() => handleCopyMischief(lang === 'de' ? current.actionDe : current.actionEn)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  {copiedMischief ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  <span>{copiedMischief ? (lang === 'de' ? 'Kopiert!' : 'Copied!') : (lang === 'de' ? 'Text kopieren' : 'Copy')}</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* SECTION 3: BEAMTENDEUTSCH-IN-KINDERWITZ-ÜBERSETZER (Humor heals fear) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-950">
            <Wand2 className="w-4 h-4 text-amber-800" />
            <span>{lang === 'de' ? 'Angst-Entschärfer: Beamtendeutsch in Kinderwitz' : 'Fear Defuser: Bureaucratic Jargon to Bedtime Story'}</span>
          </div>
          <h3 className="text-xl font-serif text-stone-900">
            {lang === 'de' ? 'Warum Humor die Welt besser macht' : 'Why Humor Makes the World Better'}
          </h3>
          <p className="text-xs text-stone-600">
            {lang === 'de'
              ? 'Behördenbriefe lösen bei normalen Menschen schiere Panik aus. Wenn wir den Schrecken in eine heitere Tierfabel übersetzen, weicht die Lähmung und man kann die Sache ruhig erledigen.'
              : 'Official government letters trigger sheer dread. When we translate terrifying jargon into a gentle bedtime fable, fear melts into a chuckle and practical action becomes easy.'}
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <label className="block text-stone-700 font-semibold font-mono">
            {lang === 'de' ? 'Bedrohliches Behördenschreiben / Floskel:' : 'Terrifying Bureaucratic Paragraph:'}
          </label>
          <input
            type="text"
            value={officialText}
            onChange={(e) => {
              setOfficialText(e.target.value);
              setFunnyTranslated(false);
            }}
            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-stone-900 text-xs"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setFunnyTranslated(true)}
            className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-xl text-xs font-medium font-mono transition-all flex items-center gap-2 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'de' ? 'In heiteren Kinderwitz verwandeln' : 'Translate to Cheerful Fable'}</span>
          </button>
        </div>

        {funnyTranslated && (
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="font-bold text-amber-950 font-mono">
                🦡 {lang === 'de' ? 'Die Fabel vom brummigen Försterdachs' : 'The Fable of the Grumpy Forest Badger'}
              </span>
              <span className="text-[10px] text-amber-800 font-mono bg-amber-100 px-2 py-0.5 rounded">
                {lang === 'de' ? 'Angst gelöscht ✓' : 'Fear Dissolved ✓'}
              </span>
            </div>

            <p className="text-stone-800 text-sm leading-relaxed font-serif italic">
              {lang === 'de'
                ? '„Im großen Wald sitzt Herr Dachs mit einer winzigen Brille an einem riesigen Holzschreibtisch. Er hat in seinem großen Buch gesehen, dass du im Sommer einen Topf Brombeermarmelade bekommen hast, aber vergessen hast, ihm den leeren Deckel zu zeigen. Jetzt brummt er mit tiefer Stimme und wirft mit langen Paragraphen um sich, damit alle denken, er sei sehr beschäftigt. In Wahrheit möchte er einfach nur ein Foto von deiner letzten Quittung per Postkarte haben."'
                : '"In the great forest, Mr. Badger sits behind an oversized oak desk with tiny spectacles. He noticed in his ledger that you received a pot of blackberry jam last summer, but forgot to show him the receipt. Now he rumbles with scary legal words so everyone thinks he is terribly busy. In truth, he just needs you to send him a 1-page bank statement so he can stamp his notebook."'}
            </p>

            <div className="p-3 rounded-xl bg-white border border-amber-200 text-stone-800 space-y-1">
              <span className="font-bold block text-stone-900">
                {lang === 'de' ? 'Was in 60 Sekunden wirklich zu tun ist:' : 'What to actually do in 60 seconds:'}
              </span>
              <span className="text-stone-700 block">
                {lang === 'de'
                  ? 'Keine Panik. Schicke einfach das angeforderte Dokument (z.B. Kontoauszug) mit dem Aktenzeichen per E-Mail oder Post. Du musst nicht ins Gefängnis und Herr Dachs ist zufrieden.'
                  : 'Zero panic. Simply upload the requested receipt with the reference number. You are not going to jail, and Mr. Badger will happily stamp his paper.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: AUDIT / SYSTEM REVIEW STATUS */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#fcfaf6] border border-stone-200/90 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-700">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'de' ? 'Gesamt-Review: Was das Amélie-Projekt bereits schenkt' : 'Full Review: What the Amélie Project Already Delivers'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
            <span className="text-stone-500 text-[11px] block">{lang === 'de' ? 'Dosen im Umlauf' : 'Packaged Tins'}</span>
            <span className="text-xl font-bold text-stone-900">5 {lang === 'de' ? 'Dosen' : 'Tins'}</span>
            <span className="text-[10px] text-emerald-700 block">100% CC0 Frei</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
            <span className="text-stone-500 text-[11px] block">{lang === 'de' ? 'Echte Berufe' : 'Everyday Trades'}</span>
            <span className="text-xl font-bold text-stone-900">10 {lang === 'de' ? 'Werke' : 'Tools'}</span>
            <span className="text-[10px] text-emerald-700 block">Echte E-Mails</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
            <span className="text-stone-500 text-[11px] block">{lang === 'de' ? 'Prüf-Simulatoren' : 'Simulators'}</span>
            <span className="text-xl font-bold text-stone-900">10 {lang === 'de' ? 'Rechner' : 'Demos'}</span>
            <span className="text-[10px] text-emerald-700 block">Browser-nativ</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
            <span className="text-stone-500 text-[11px] block">{lang === 'de' ? 'Werbung / Tracker' : 'Ads / Tracking'}</span>
            <span className="text-xl font-bold text-stone-900">0,00</span>
            <span className="text-[10px] text-emerald-700 block">Keine Profite</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-700 leading-relaxed font-serif">
          {lang === 'de'
            ? '„Das Geschenk geht weiter, nicht zurück." Wer diese Ideen übernimmt, schuldet uns keinen Cent, keinen Dank und keine Erwähnung. Nur eine einzige Bitte bleibt: Wenn du eines Tages selbst eine Idee hast, die du nicht bauen wirst — schenke sie weiter an jemanden, der es kann.'
            : '"The gift travels onward, not backward." Whoever builds these ideas owes us zero money, zero equity, and not even a reply. Only one wish remains: if you ever have an idea you won\'t build, gift it to someone who will.'}
        </div>
      </div>
    </div>
  );
};

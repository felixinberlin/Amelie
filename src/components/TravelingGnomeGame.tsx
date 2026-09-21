import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  Smile, 
  RotateCw, 
  Send, 
  Copy, 
  Check, 
  Download,
  Image as ImageIcon,
  Heart,
  Palette,
  Compass
} from 'lucide-react';
import { Language } from '../types';

interface TravelingGnomeGameProps {
  lang: Language;
}

interface LandmarkDestination {
  id: string;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  cityDe: string;
  cityEn: string;
  cityEs: string;
  flag: string;
  bgGradient: string;
  skylineSvg: string; // SVG silhouette or landmark art
  weatherDe: string;
  weatherEn: string;
  weatherEs: string;
  postcardLetterDe: string;
  postcardLetterEn: string;
  postcardLetterEs: string;
}

interface GnomeCostume {
  hat: 'classic_red' | 'beret' | 'astronaut' | 'sombrero' | 'viking' | 'party';
  eyewear: 'none' | 'aviators' | 'pixel' | 'heart' | 'monocle';
  prop: 'baguette' | 'camera' | 'pretzel' | 'coconut' | 'selfie' | 'accordion';
  expression: 'grumpy' | 'wink' | 'shocked' | 'smug';
  tilt: number;
}

interface PolaroidSnapshot {
  id: string;
  destination: LandmarkDestination;
  costume: GnomeCostume;
  timestamp: string;
  letter: string;
}

export const TravelingGnomeGame: React.FC<TravelingGnomeGameProps> = ({ lang }) => {
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const [costume, setCostume] = useState<GnomeCostume>({
    hat: 'classic_red',
    eyewear: 'aviators',
    prop: 'baguette',
    expression: 'grumpy',
    tilt: 0,
  });

  const [snappedPolaroid, setSnappedPolaroid] = useState<PolaroidSnapshot | null>(null);
  const [gallery, setGallery] = useState<PolaroidSnapshot[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Web Audio for vintage mechanical camera shutter
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playShutterSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Sharp mechanical click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);

      // Motor whirr for film ejection
      setTimeout(() => {
        try {
          const whirrOsc = ctx.createOscillator();
          const whirrGain = ctx.createGain();
          whirrOsc.type = 'square';
          whirrOsc.frequency.setValueAtTime(80, ctx.currentTime);
          whirrOsc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.25);
          whirrGain.gain.setValueAtTime(0.12, ctx.currentTime);
          whirrGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          whirrOsc.connect(whirrGain);
          whirrGain.connect(ctx.destination);
          whirrOsc.start();
          whirrOsc.stop(ctx.currentTime + 0.25);
        } catch {
          // Fallback
        }
      }, 70);
    } catch {
      // Audio fallback
    }
  };

  const DESTINATIONS: LandmarkDestination[] = [
    {
      id: 'paris',
      nameDe: 'Eiffelturm & Champ de Mars',
      nameEn: 'Eiffel Tower & Champ de Mars',
      nameEs: 'Torre Eiffel y Campos de Marte',
      cityDe: 'Paris, Frankreich',
      cityEn: 'Paris, France',
      cityEs: 'París, Francia',
      flag: '🇫🇷',
      bgGradient: 'from-amber-200 via-rose-200 to-sky-300',
      skylineSvg: 'tower',
      weatherDe: '21°C · Heiter · Duft nach Buttercroissants',
      weatherEn: '21°C · Sunny · Smells like fresh brioche',
      weatherEs: '21°C · Soleado · Aroma a cruasán recién horneado',
      postcardLetterDe:
        'Lieber Papa,\n\nDie Tauben hier am Eiffelturm haben deutlich weniger Respekt vor Zwergenmützen als die Amseln in deinem Garten in Enghien-les-Bains. Aber die Baguettes sind knusprig und der Wein ist herrlich. Hör auf, das Garagentor zum fünften Mal zu streichen, pack deinen Koffer und komm mich besuchen!\n\nIn Liebe,\nDein reisender Gartenzwerg',
      postcardLetterEn:
        'Dear Papa,\n\nThe pigeons at the Eiffel Tower have much less respect for pointed gnome hats than the blackbirds in your back garden. But the baguettes are crisp and the wine is wonderful. Stop repainting the garage door for the fifth time, pack your suitcase, and come see the world!\n\nWith love,\nYour Traveling Garden Gnome',
      postcardLetterEs:
        'Querido papá:\n\nLas palomas de la Torre Eiffel tienen mucho menos respeto por los sombreros puntiagudos que los pájaros de tu jardín. Pero el pan cruje delicioso y el vino es insuperable. ¡Deja de pintar la puerta del garaje por quinta vez, prepara tu maleta y sal a ver el mundo!\n\nCon cariño,\nTu gnomo viajero',
    },
    {
      id: 'tokyo',
      nameDe: 'Shibuya Crossing & Kirschblüten',
      nameEn: 'Shibuya Crossing & Neon Lights',
      nameEs: 'Cruce de Shibuya y luces de neón',
      cityDe: 'Tokio, Japan',
      cityEn: 'Tokyo, Japan',
      cityEs: 'Tokio, Japón',
      flag: '🇯🇵',
      bgGradient: 'from-fuchsia-300 via-purple-300 to-indigo-400',
      skylineSvg: 'fuji',
      weatherDe: '19°C · Neon-Glanz · Matcha-Eis im Überfluss',
      weatherEn: '19°C · Neon glow · Endless matcha soft-serve',
      weatherEs: '19°C · Neón brillante · Helado de matcha sin fin',
      postcardLetterDe:
        'Konnichiwa Papa,\n\nZweitausend Menschen sind gerade über die Kreuzung gelaufen. Drei Teenager dachten, ich sei ein antiker Waldgeist und machten Selfies mit mir. Ich habe 8 Sorten Ramen probiert. Das Leben ist zu kurz für Rasenmähen.\n\nSayonara,\nDein Zwerg',
      postcardLetterEn:
        'Konnichiwa Papa,\n\nTwo thousand people just crossed this street simultaneously. Three teens thought I was a sacred forest kami and bowed politely. I have eaten 8 bowls of ramen. Life is too short for lawn aeration.\n\nSayonara,\nYour Gnome',
      postcardLetterEs:
        'Konnichiwa papá:\n\nDos mil personas acaban de cruzar a la vez. Tres jóvenes pensaron que era un espíritu sagrado del bosque y me hicieron reverencias. He probado 8 tipos de ramen. La vida es demasiado corta para podar el césped.\n\nSayonara,\nTu gnomo',
    },
    {
      id: 'berlin',
      nameDe: 'Brandenburger Tor & Spree',
      nameEn: 'Brandenburg Gate & Spree River',
      nameEs: 'Puerta de Brandeburgo y el río Spree',
      cityDe: 'Berlin, Deutschland',
      cityEn: 'Berlin, Germany',
      cityEs: 'Berlín, Alemania',
      flag: '🇩🇪',
      bgGradient: 'from-amber-100 via-stone-200 to-sky-300',
      skylineSvg: 'gate',
      weatherDe: '17°C · Trockener Wind · Currywurst mit Pommes',
      weatherEn: '17°C · Crisp breeze · Currywurst & fries',
      weatherEs: '17°C · Brisa fresca · Currywurst con patatas',
      postcardLetterDe:
        'Moin Papa,\n\nIch stand gestern vier Stunden vor dem Berghain an. Der Türsteher musterte meine rote Zipfelmütze schweigend, schüttelte den Kopf und sagte: „Heute leider nicht, Kleiner.“ Habe mir stattdessen eine Currywurst am Mehringdamm geholt. Berlin ist verrückt und wunderbar.\n\nBis bald,\nDein Zwerg',
      postcardLetterEn:
        'Guten Tag Papa,\n\nI stood in line at Berghain for four hours yesterday. The bouncer looked at my red pointy hat in dead silence, shook his head, and mumbled: "Not tonight, little man." So I got a hot currywurst instead. Berlin is unhinged and magnificent.\n\nYours,\nYour Gnome',
      postcardLetterEs:
        'Hola papá:\n\nAyer hice cuatro horas de cola frente al club Berghain. El portero miró fijamente mi gorro rojo, movió la cabeza y dijo: «Hoy no, pequeñajo». Así que me compré un currywurst caliente. Berlín es un disparate encantador.\n\nUn abrazo,\nTu gnomo',
    },
    {
      id: 'giza',
      nameDe: 'Die Großen Pyramiden & Sphinx',
      nameEn: 'The Great Pyramids & Sphinx',
      nameEs: 'Las Grandes Pirámides y la Esfinge',
      cityDe: 'Gizeh, Ägypten',
      cityEn: 'Giza, Egypt',
      cityEs: 'Guiza, Egipto',
      flag: '🇪🇬',
      bgGradient: 'from-amber-300 via-orange-300 to-amber-500',
      skylineSvg: 'pyramid',
      weatherDe: '38°C · Goldener Wüstensand · Sonnenbrandgefahr',
      weatherEn: '38°C · Golden desert dunes · High UV',
      weatherEs: '38°C · Dunas doradas · Mucho calor',
      postcardLetterDe:
        'Salam Papa,\n\nDie Sphinx hat mich gefragt, woher ich diese modische rote Zipfelmütze habe. Ich sagte: „Gartenfachmarkt Enghien-les-Bains.“ Sie war sichtlich beeindruckt von deutscher Keramik-Qualität. Es hat 38 Grad im Schatten — ich hoffe, du gießt die Hortensien!\n\nSonnige Grüße,\nDein Zwerg',
      postcardLetterEn:
        'Salam Papa,\n\nThe Sphinx asked where I bought this stylish pointed red hat. I told her: "Garden Center, Enghien-les-Bains." She seemed very impressed by sturdy European ceramic craftsmanship. It is 38°C in the shade—hope you remembered to water the hydrangeas!\n\nWarmest regards,\nYour Gnome',
      postcardLetterEs:
        'Salam papá:\n\nLa Esfinge me preguntó de dónde saqué este gorro rojo. Le dije: «Centro de jardinería Enghien-les-Bains». Quedó francamente impresionada con la cerámica europea. Hace 38 grados a la sombra; ¡espero que riegues las hortensias!\n\nUn saludo soleado,\nTu gnomo',
    },
    {
      id: 'pisa',
      nameDe: 'Schiefer Turm von Pisa',
      nameEn: 'The Leaning Tower of Pisa',
      nameEs: 'La Torre Inclinada de Pisa',
      cityDe: 'Pisa, Toskana, Italien',
      cityEn: 'Pisa, Tuscany, Italy',
      cityEs: 'Pisa, Toscana, Italia',
      flag: '🇮🇹',
      bgGradient: 'from-sky-200 via-emerald-100 to-amber-200',
      skylineSvg: 'pisa',
      weatherDe: '26°C · Zypressenduft · Pistazieneis',
      weatherEn: '26°C · Cypress breezes · Pistachio gelato',
      weatherEs: '26°C · Brisa de cipreses · Helado de pistacho',
      postcardLetterDe:
        'Ciao Papa,\n\nAlle Touristen tun so, als würden sie den schiefen Turm abstützen. Ich habe mich einfach dagegen gelehnt und ein Eis gegessen. Die Toskana würde dir gefallen, Papa. Die Zypressen brauchen keinen Formschnitt, die wachsen einfach frei.\n\nBaci,\nDein Zwerg',
      postcardLetterEn:
        'Ciao Papa,\n\nEvery single tourist poses pretending to push the leaning tower back up. I simply leaned against it and ate a scoop of pistachio gelato. You would love Tuscany, Papa. The cypress trees grow wild without any hedge trimmers.\n\nBaci,\nYour Gnome',
      postcardLetterEs:
        'Ciao papá:\n\nTodos los turistas fingen empujar la torre para enderezarla. Yo me apoyé tranquilamente y me comí un helado de pistacho. Te encantaría la Toscana: los cipreses crecen libres sin podadora.\n\nBaci,\nTu gnomo',
    },
    {
      id: 'moon',
      nameDe: 'Mondbasis & Mare Tranquillitatis',
      nameEn: 'Tranquility Base, The Moon',
      nameEs: 'Mar de la Tranquilidad, La Luna',
      cityDe: 'Mondoberfläche, Weltall',
      cityEn: 'Lunar Surface, Orbit',
      cityEs: 'Superficie lunar, El Espacio',
      flag: '🚀',
      bgGradient: 'from-slate-900 via-indigo-950 to-stone-900',
      skylineSvg: 'moon',
      weatherDe: '-130°C · Schwerelos · Blick auf die blaue Erde',
      weatherEn: '-130°C · Zero G · Stunning view of blue Earth',
      weatherEs: '-130°C · Gravedad cero · Vista de la Tierra azul',
      postcardLetterDe:
        'Hallo Papa,\n\nDie Schwerelosigkeit tut meiner Keramik-Lendenwirbelsäule erstaunlich gut. Von hier oben sieht die Erde aus wie eine winzige blaue Murmel. Dein Vorgarten ist von hier aus unsichtbar klein, Papa. Die Welt ist viel zu groß, um im Haus zu bleiben!\n\nSternengrüße,\nDein Astronauten-Zwerg',
      postcardLetterEn:
        'Greetings Papa,\n\nZero gravity is surprisingly soothing for my ceramic lumbar spine. From up here, the Earth looks like a tiny cobalt marble. Your front lawn is completely invisible from this altitude. The universe is far too vast to stay indoors!\n\nStarry regards,\nYour Astronaut Gnome',
      postcardLetterEs:
        'Hola papá:\n\nLa gravedad cero le sienta de maravilla a mi columna de cerámica. Desde aquí arriba, la Tierra parece una pequeña canica azul. Tu jardín es invisible a esta distancia. ¡El universo es demasiado grande para encerrarse en casa!\n\nSaludos estelares,\nTu gnomo astronauta',
    },
    {
      id: 'hawaii',
      nameDe: 'Waikiki Beach & Palmen',
      nameEn: 'Waikiki Beach & Palm Trees',
      nameEs: 'Playa de Waikiki y palmeras',
      cityDe: 'Honolulu, Hawaii',
      cityEn: 'Honolulu, Hawaii',
      cityEs: 'Honolulú, Hawái',
      flag: '🌺',
      bgGradient: 'from-amber-200 via-rose-300 to-teal-300',
      skylineSvg: 'beach',
      weatherDe: '29°C · Pazifik-Wellen · Ananas-Cocktail',
      weatherEn: '29°C · Pacific swells · Pineapple in a coconut',
      weatherEs: '29°C · Olas del Pacífico · Cóctel de piña',
      postcardLetterDe:
        'Aloha Papa,\n\nIch trage eine Blumenkette und habe gelernt, auf einem Miniatur-Surfbrett zu stehen. Die Wellen hier sind warm und weich. Bitte wirf deine alten Pantoffeln weg, kauf ein Paar Flip-Flops und flieg los.\n\nMahalo,\nDein Zwerg',
      postcardLetterEn:
        'Aloha Papa,\n\nI am wearing a fresh hibiscus flower lei and learning to balance on a miniature surfboard. The Pacific waves are warm and sparkling. Please throw away your old orthopedic slippers, buy sandals, and fly out here.\n\nMahalo,\nYour Gnome',
      postcardLetterEs:
        'Aloha papá:\n\nLlevo un collar de flores y estoy aprendiendo a surfear sobre una tabla en miniatura. Las olas son templadas y brillantes. Por favor, tira tus viejas pantuflas, cómprate unas sandalias y ven.\n\nMahalo,\nTu gnomo',
    },
  ];

  const currentDest = DESTINATIONS[activeDestIndex];

  const handleSnapPhoto = () => {
    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 220);

    // Confetti pop!
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fbbf24', '#3b82f6', '#10b981'],
    });

    const newSnapshot: PolaroidSnapshot = {
      id: `snap_${Date.now()}`,
      destination: currentDest,
      costume: { ...costume },
      timestamp: new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      letter:
        lang === 'de'
          ? currentDest.postcardLetterDe
          : lang === 'es'
          ? currentDest.postcardLetterEs
          : currentDest.postcardLetterEn,
    };

    setSnappedPolaroid(newSnapshot);
    setGallery((prev) => [newSnapshot, ...prev.slice(0, 5)]);
  };

  const handleCopyLetter = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  // Helper renderers for Gnome accessories
  const renderGnomeHat = () => {
    switch (costume.hat) {
      case 'beret':
        return (
          <ellipse
            cx="100"
            cy="48"
            rx="32"
            ry="14"
            fill="#1c1917"
            transform="rotate(-10 100 48)"
          />
        );
      case 'astronaut':
        return (
          <circle
            cx="100"
            cy="70"
            r="48"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            opacity="0.85"
          />
        );
      case 'sombrero':
        return (
          <g>
            <ellipse cx="100" cy="55" rx="55" ry="12" fill="#d97706" />
            <path d="M 80 50 Q 100 20 120 50 Z" fill="#b45309" />
          </g>
        );
      case 'viking':
        return (
          <g>
            <path d="M 72 45 Q 60 20 45 25 Q 65 40 76 52 Z" fill="#f8fafc" stroke="#475569" />
            <path d="M 128 45 Q 140 20 155 25 Q 135 40 124 52 Z" fill="#f8fafc" stroke="#475569" />
            <path d="M 70 55 C 70 30, 130 30, 130 55 Z" fill="#64748b" />
          </g>
        );
      case 'party':
        return (
          <polygon
            points="100,10 78,58 122,58"
            fill="#ec4899"
            stroke="#fbcfe8"
            strokeWidth="2"
          />
        );
      case 'classic_red':
      default:
        // Classic iconic pointed Amélie gnome hat
        return (
          <polygon
            points="100,15 72,68 128,68"
            fill="#dc2626"
            stroke="#b91c1c"
            strokeWidth="2"
          />
        );
    }
  };

  const renderGnomeEyewear = () => {
    switch (costume.eyewear) {
      case 'aviators':
        return (
          <g transform="translate(0, 1)">
            {/* Aviators frame */}
            <path d="M 82 72 Q 88 68 94 72 Q 94 82 84 83 Q 80 82 82 72 Z" fill="#111827" />
            <path d="M 106 72 Q 112 68 118 72 Q 120 82 110 83 Q 106 82 106 72 Z" fill="#111827" />
            <line x1="94" y1="72" x2="106" y2="72" stroke="#d97706" strokeWidth="2" />
          </g>
        );
      case 'pixel':
        return (
          <g transform="translate(0, 2)">
            <rect x="78" y="70" width="18" height="10" fill="#000000" />
            <rect x="104" y="70" width="18" height="10" fill="#000000" />
            <rect x="96" y="73" width="8" height="4" fill="#000000" />
            <rect x="80" y="72" width="4" height="2" fill="#ffffff" />
            <rect x="106" y="72" width="4" height="2" fill="#ffffff" />
          </g>
        );
      case 'heart':
        return (
          <g transform="translate(0, 0)">
            <path d="M 80 72 A 4 4 0 0 1 88 72 A 4 4 0 0 1 96 72 Q 96 78 88 84 Q 80 78 80 72 Z" fill="#e11d48" />
            <path d="M 104 72 A 4 4 0 0 1 112 72 A 4 4 0 0 1 120 72 Q 120 78 112 84 Q 104 78 104 72 Z" fill="#e11d48" />
            <line x1="96" y1="74" x2="104" y2="74" stroke="#e11d48" strokeWidth="2" />
          </g>
        );
      case 'monocle':
        return (
          <g>
            <circle cx="112" cy="74" r="7" fill="none" stroke="#eab308" strokeWidth="2" />
            <line x1="119" y1="76" x2="128" y2="100" stroke="#ca8a04" strokeWidth="1" />
          </g>
        );
      case 'none':
      default:
        // Expressive eyes
        if (costume.expression === 'wink') {
          return (
            <g>
              <circle cx="88" cy="73" r="2.5" fill="#1e293b" />
              <path d="M 108 74 Q 112 70 116 74" fill="none" stroke="#1e293b" strokeWidth="2" />
            </g>
          );
        } else if (costume.expression === 'shocked') {
          return (
            <g>
              <circle cx="88" cy="73" r="3.5" fill="#1e293b" />
              <circle cx="112" cy="73" r="3.5" fill="#1e293b" />
            </g>
          );
        }
        return (
          <g>
            <circle cx="88" cy="74" r="2.2" fill="#1e293b" />
            <circle cx="112" cy="74" r="2.2" fill="#1e293b" />
          </g>
        );
    }
  };

  const renderGnomeProp = () => {
    switch (costume.prop) {
      case 'baguette':
        return (
          <g transform="translate(115, 95) rotate(-35)">
            <rect x="0" y="0" width="14" height="60" rx="7" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
            <line x1="4" y1="15" x2="10" y2="18" stroke="#78350f" strokeWidth="1.5" />
            <line x1="4" y1="30" x2="10" y2="33" stroke="#78350f" strokeWidth="1.5" />
            <line x1="4" y1="45" x2="10" y2="48" stroke="#78350f" strokeWidth="1.5" />
          </g>
        );
      case 'camera':
        return (
          <g transform="translate(85, 110)">
            <rect x="0" y="0" width="30" height="20" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="15" cy="10" r="6" fill="#64748b" stroke="#e2e8f0" strokeWidth="1.5" />
            <rect x="4" y="-3" width="6" height="3" fill="#e2e8f0" />
            <line x1="-15" y1="-25" x2="0" y2="0" stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="45" y1="-25" x2="30" y2="0" stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
          </g>
        );
      case 'pretzel':
        return (
          <g transform="translate(120, 115) scale(0.9)">
            <circle cx="15" cy="15" r="14" fill="none" stroke="#92400e" strokeWidth="5" />
            <path d="M 5 15 Q 15 28 25 15 Q 15 5 5 15" fill="none" stroke="#92400e" strokeWidth="4" />
          </g>
        );
      case 'coconut':
        return (
          <g transform="translate(122, 115)">
            <circle cx="12" cy="12" r="12" fill="#78350f" />
            <polygon points="12,0 8,-14 16,-14" fill="#ec4899" />
            <line x1="12" y1="0" x2="14" y2="-18" stroke="#10b981" strokeWidth="2" />
          </g>
        );
      case 'selfie':
        return (
          <g transform="translate(125, 60) rotate(-40)">
            <line x1="0" y1="80" x2="0" y2="0" stroke="#64748b" strokeWidth="3" />
            <rect x="-8" y="-12" width="16" height="12" rx="2" fill="#0f172a" />
          </g>
        );
      case 'accordion':
      default:
        return (
          <g transform="translate(70, 115)">
            <rect x="0" y="0" width="10" height="25" fill="#dc2626" rx="2" />
            <path d="M 10 2 L 18 6 L 26 2 L 34 6 L 42 2 L 50 6 L 50 23 L 42 19 L 34 23 L 26 19 L 18 23 L 10 19 Z" fill="#f8fafc" stroke="#64748b" />
            <rect x="50" y="0" width="10" height="25" fill="#dc2626" rx="2" />
          </g>
        );
    }
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
                ? 'Der legendäre Amélie-Gartenzwerg-Streich'
                : lang === 'es'
                ? 'La mítica travesura del gnomo de Amélie'
                : 'The Legendary Amélie Garden Gnome Prank'}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-amelie font-bold text-[#2b1e16]">
            {lang === 'de'
              ? '« Le Nain de Jardin Voyageur »'
              : lang === 'es'
              ? '« El gnomo de jardín viajero »'
              : '“The Globetrotting Garden Gnome”'}
          </h3>
          <p className="text-xs md:text-sm text-stone-600 font-serif">
            {lang === 'de'
              ? 'Amélies Papa verlässt vor Trauer das Haus nicht. Schicke seinen Gartenzwerg auf Weltreise, schieße Polaroids und sende ihm freche Postkarten!'
              : lang === 'es'
              ? 'El padre de Amélie no sale de casa por tristeza. Envía a su gnomo por el mundo, hazle fotos Polaroid y mándale postales divertidas.'
              : 'Amélie’s father refuses to leave home. Send his ceramic garden gnome on a clandestine world tour, snap Polaroids, and mail him cheeky wake-up postcards!'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSnapPhoto}
            className="px-4 py-2.5 bg-[#8c1d40] hover:bg-[#701531] text-amber-50 rounded-xl font-bold font-mono text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-amber-200" />
            <span>{lang === 'de' ? 'Polaroid schießen!' : lang === 'es' ? '¡Disparar Polaroid!' : 'Snap Polaroid!'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Destination & Wardrobe Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Destination Selector */}
          <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#d8cbba] space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-800" />
              {lang === 'de' ? '1. Reiseziel wählen' : lang === 'es' ? '1. Elegir destino' : '1. Select Destination'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DESTINATIONS.map((dest, idx) => (
                <button
                  key={dest.id}
                  onClick={() => setActiveDestIndex(idx)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    idx === activeDestIndex
                      ? 'bg-white border-[#8c1d40] shadow-xs font-bold text-stone-900 ring-2 ring-[#8c1d40]/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                  }`}
                >
                  <span className="text-lg">{dest.flag}</span>
                  <span className="text-[11px] leading-tight line-clamp-1 mt-1">
                    {lang === 'de' ? dest.cityDe.split(',')[0] : lang === 'es' ? dest.cityEs.split(',')[0] : dest.cityEn.split(',')[0]}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-[11px] text-stone-600 font-mono bg-white p-2 rounded-lg border border-stone-200 flex items-center justify-between">
              <span>{lang === 'de' ? currentDest.weatherDe : lang === 'es' ? currentDest.weatherEs : currentDest.weatherEn}</span>
              <span className="text-[10px] text-stone-400 font-bold">{currentDest.flag}</span>
            </div>
          </div>

          {/* Gnome Dress-Up Controls */}
          <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#d8cbba] space-y-3 text-xs">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#8c1d40]" />
              {lang === 'de' ? '2. Zwergen-Garderobe anpassen' : lang === 'es' ? '2. Vestir al gnomo' : '2. Style the Gnome'}
            </span>

            {/* Hat Selection */}
            <div className="space-y-1.5">
              <label className="font-mono text-stone-600 text-[11px] block">{lang === 'de' ? 'Kopfbedeckung:' : lang === 'es' ? 'Sombrero:' : 'Headwear:'}</label>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {[
                  { id: 'classic_red', labelDe: 'Rote Zipfelmütze', labelEn: 'Classic Red Cap', labelEs: 'Gorro rojo' },
                  { id: 'beret', labelDe: 'Pariser Baskenmütze', labelEn: 'French Beret', labelEs: 'Boina parisina' },
                  { id: 'astronaut', labelDe: 'Astronautenhelm', labelEn: 'Space Fishbowl', labelEs: 'Escafandra' },
                  { id: 'sombrero', labelDe: 'Großer Sombrero', labelEn: 'Sombrero', labelEs: 'Sombrero' },
                  { id: 'viking', labelDe: 'Wikingerhelm', labelEn: 'Viking Horns', labelEs: 'Casco vikingo' },
                  { id: 'party', labelDe: 'Party-Hütchen', labelEn: 'Party Cone', labelEs: 'Gorro de fiesta' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCostume((c) => ({ ...c, hat: item.id as GnomeCostume['hat'] }))}
                    className={`px-2 py-1 rounded-lg border text-center transition-all cursor-pointer ${
                      costume.hat === item.id
                        ? 'bg-[#8c1d40] text-white border-[#8c1d40] font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {lang === 'de' ? item.labelDe : lang === 'es' ? item.labelEs : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Eyewear Selection */}
            <div className="space-y-1.5">
              <label className="font-mono text-stone-600 text-[11px] block">{lang === 'de' ? 'Sonnenbrille / Blick:' : lang === 'es' ? 'Gafas:' : 'Eyewear:'}</label>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {[
                  { id: 'none', labelDe: 'Natürlich', labelEn: 'Bare Eyes', labelEs: 'Sin gafas' },
                  { id: 'aviators', labelDe: 'Aviator-Brille', labelEn: 'Aviators', labelEs: 'Aviador' },
                  { id: 'pixel', labelDe: 'Thug Life Pixel', labelEn: 'Pixel Shades', labelEs: 'Píxel' },
                  { id: 'heart', labelDe: 'Herzchen-Brille', labelEn: 'Heart Sunnies', labelEs: 'Corazones' },
                  { id: 'monocle', labelDe: 'Goldenes Monokel', labelEn: 'Gold Monocle', labelEs: 'Monóculo' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCostume((c) => ({ ...c, eyewear: item.id as GnomeCostume['eyewear'] }))}
                    className={`px-2 py-1 rounded-lg border text-center transition-all cursor-pointer ${
                      costume.eyewear === item.id
                        ? 'bg-[#8c1d40] text-white border-[#8c1d40] font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {lang === 'de' ? item.labelDe : lang === 'es' ? item.labelEs : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Prop Selection */}
            <div className="space-y-1.5">
              <label className="font-mono text-stone-600 text-[11px] block">{lang === 'de' ? 'Reise-Accessoire:' : lang === 'es' ? 'Accesorio:' : 'Handheld Prop:'}</label>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {[
                  { id: 'baguette', labelDe: '🥖 Knuspriges Baguette', labelEn: '🥖 Baguette', labelEs: '🥖 Barra de pan' },
                  { id: 'camera', labelDe: '📷 Retro-Kamera', labelEn: '📷 Film Camera', labelEs: '📷 Cámara' },
                  { id: 'pretzel', labelDe: '🥨 Große Brezel', labelEn: '🥨 Pretzel', labelEs: '🥨 Brezel' },
                  { id: 'coconut', labelDe: '🥥 Kokosnuss-Drink', labelEn: '🥥 Coconut Drink', labelEs: '🥥 Coco fresco' },
                  { id: 'selfie', labelDe: '🤳 Selfie-Stick', labelEn: '🤳 Selfie Stick', labelEs: '🤳 Palo selfie' },
                  { id: 'accordion', labelDe: '🪗 Schifferklavier', labelEn: '🪗 Accordion', labelEs: '🪗 Acordeón' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCostume((c) => ({ ...c, prop: item.id as GnomeCostume['prop'] }))}
                    className={`px-2 py-1 rounded-lg border text-center transition-all cursor-pointer ${
                      costume.prop === item.id
                        ? 'bg-[#8c1d40] text-white border-[#8c1d40] font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {lang === 'de' ? item.labelDe : lang === 'es' ? item.labelEs : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Expression & Tilt */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="space-y-1 w-1/2">
                <span className="font-mono text-[10px] text-stone-500 block">{lang === 'de' ? 'Mimik:' : lang === 'es' ? 'Gesto:' : 'Face:'}</span>
                <select
                  value={costume.expression}
                  onChange={(e) => setCostume((c) => ({ ...c, expression: e.target.value as GnomeCostume['expression'] }))}
                  className="w-full px-2 py-1 rounded-lg bg-white border border-stone-300 font-mono text-xs cursor-pointer"
                >
                  <option value="grumpy">{lang === 'de' ? '😠 Brummiger Ernst' : lang === 'es' ? '😠 Ceño fruncido' : '😠 Classic Grumpy'}</option>
                  <option value="wink">{lang === 'de' ? '😉 Verschmitztes Zwinkern' : lang === 'es' ? '😉 Guiño cómplice' : '😉 Cheerful Wink'}</option>
                  <option value="shocked">{lang === 'de' ? '😮 Staunendes O-Gesicht' : lang === 'es' ? '😮 Asombro total' : '😮 Wide Eyed'}</option>
                </select>
              </div>

              <div className="space-y-1 w-1/2">
                <span className="font-mono text-[10px] text-stone-500 block">{lang === 'de' ? 'Pose-Neigung:' : lang === 'es' ? 'Inclinación:' : 'Pose Tilt:'}</span>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  value={costume.tilt}
                  onChange={(e) => setCostume((c) => ({ ...c, tilt: parseInt(e.target.value) }))}
                  className="w-full accent-[#8c1d40] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Photo Stage & Polaroid Eject (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Studio Camera Viewport */}
          <div className="relative rounded-3xl overflow-hidden border-4 border-stone-800 shadow-xl bg-stone-900 select-none">
            {/* White flash overlay */}
            <div
              className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 z-30 ${
                isFlashing ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Viewfinder crosshairs */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/60" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/60" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/60" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/60" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              </div>
              <div className="absolute top-4 left-14 text-[10px] font-mono font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                REC ● {currentDest.cityEn.toUpperCase()}
              </div>
            </div>

            {/* Stage Canvas (Background + Landmark + Custom Gnome) */}
            <div className={`w-full h-80 md:h-96 bg-gradient-to-b ${currentDest.bgGradient} relative overflow-hidden flex items-end justify-center`}>
              {/* Landmark Silhouette Background */}
              {currentDest.skylineSvg === 'tower' && (
                <svg className="absolute bottom-4 right-10 w-44 h-72 text-stone-800/35 pointer-events-none" viewBox="0 0 100 200" fill="currentColor">
                  <path d="M 45 10 L 55 10 L 53 60 L 65 120 L 78 190 L 68 190 L 58 135 L 42 135 L 32 190 L 22 190 L 35 120 L 47 60 Z" />
                  <rect x="38" y="70" width="24" height="6" />
                  <rect x="32" y="130" width="36" height="8" />
                  <circle cx="50" cy="8" r="4" />
                </svg>
              )}

              {currentDest.skylineSvg === 'fuji' && (
                <svg className="absolute bottom-6 left-6 w-72 h-44 text-purple-900/30 pointer-events-none" viewBox="0 0 200 100" fill="currentColor">
                  <path d="M 10 100 Q 100 10 190 100 Z" />
                  <path d="M 80 35 L 120 35 L 110 50 L 100 45 L 90 50 Z" fill="#ffffff" opacity="0.6" />
                </svg>
              )}

              {currentDest.skylineSvg === 'gate' && (
                <svg className="absolute bottom-4 right-6 w-60 h-48 text-stone-800/30 pointer-events-none" viewBox="0 0 200 120" fill="currentColor">
                  <rect x="20" y="40" width="16" height="80" />
                  <rect x="52" y="40" width="16" height="80" />
                  <rect x="84" y="40" width="16" height="80" />
                  <rect x="116" y="40" width="16" height="80" />
                  <rect x="148" y="40" width="16" height="80" />
                  <rect x="15" y="30" width="155" height="12" />
                  <circle cx="92" cy="18" r="10" />
                </svg>
              )}

              {currentDest.skylineSvg === 'pyramid' && (
                <svg className="absolute bottom-4 left-8 w-72 h-52 text-amber-900/35 pointer-events-none" viewBox="0 0 200 120" fill="currentColor">
                  <polygon points="100,10 20,110 180,110" />
                  <polygon points="160,35 110,110 210,110" opacity="0.7" />
                </svg>
              )}

              {currentDest.skylineSvg === 'pisa' && (
                <svg className="absolute bottom-4 right-12 w-32 h-64 text-emerald-950/30 pointer-events-none" viewBox="0 0 100 200" fill="currentColor" transform="rotate(7 50 150)">
                  <rect x="35" y="30" width="30" height="150" rx="4" />
                  <line x1="30" y1="60" x2="70" y2="60" stroke="#000" strokeWidth="3" />
                  <line x1="30" y1="90" x2="70" y2="90" stroke="#000" strokeWidth="3" />
                  <line x1="30" y1="120" x2="70" y2="120" stroke="#000" strokeWidth="3" />
                  <line x1="30" y1="150" x2="70" y2="150" stroke="#000" strokeWidth="3" />
                </svg>
              )}

              {currentDest.skylineSvg === 'moon' && (
                <svg className="absolute top-6 right-10 w-24 h-24 text-sky-400 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="35" fill="#3b82f6" opacity="0.9" />
                  <path d="M 35 40 Q 55 20 70 45 Q 60 70 35 40 Z" fill="#22c55e" opacity="0.8" />
                  <circle cx="20" cy="20" r="1.5" fill="#ffffff" />
                  <circle cx="80" cy="15" r="1" fill="#ffffff" />
                  <circle cx="85" cy="80" r="2" fill="#ffffff" />
                </svg>
              )}

              {currentDest.skylineSvg === 'beach' && (
                <svg className="absolute bottom-4 left-6 w-48 h-64 text-teal-950/30 pointer-events-none" viewBox="0 0 100 150" fill="currentColor">
                  <path d="M 50 140 Q 40 70 20 20 Q 35 40 50 140 Z" />
                  <path d="M 20 20 Q -5 10 -20 30 Q 5 20 20 20 Z" />
                  <path d="M 20 20 Q 50 0 70 10 Q 40 15 20 20 Z" />
                </svg>
              )}

              {/* Foreground Ceramic Garden Gnome Actor */}
              <div
                style={{ transform: `rotate(${costume.tilt}deg)` }}
                className="relative z-20 mb-2 transition-transform duration-200 drop-shadow-2xl"
              >
                <svg width="180" height="230" viewBox="0 0 200 250">
                  {/* Ceramic Feet / Boots */}
                  <ellipse cx="80" cy="235" rx="18" ry="9" fill="#1e293b" />
                  <ellipse cx="120" cy="235" rx="18" ry="9" fill="#1e293b" />

                  {/* Gnome Blue Coat Body */}
                  <path d="M 68 125 C 60 170, 60 215, 75 230 L 125 230 C 140 215, 140 170, 132 125 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />

                  {/* Black Belt with Gold Buckle */}
                  <rect x="68" y="175" width="64" height="14" fill="#0f172a" />
                  <rect x="92" y="172" width="16" height="20" fill="none" stroke="#f59e0b" strokeWidth="3" />

                  {/* White Fluffy Ceramic Beard */}
                  <path
                    d="M 72 82 C 60 115, 65 165, 100 172 C 135 165, 140 115, 128 82 Z"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />

                  {/* Chubby Rosy Face */}
                  <circle cx="100" cy="80" r="28" fill="#fed7aa" />
                  <circle cx="78" cy="86" r="6" fill="#f43f5e" opacity="0.35" />
                  <circle cx="122" cy="86" r="6" fill="#f43f5e" opacity="0.35" />

                  {/* Ceramic Bulbous Nose */}
                  <ellipse cx="100" cy="82" rx="7" ry="5.5" fill="#fb923c" />

                  {/* Eyewear Layer */}
                  {renderGnomeEyewear()}

                  {/* Hat Layer */}
                  {renderGnomeHat()}

                  {/* Handheld Prop Layer */}
                  {renderGnomeProp()}
                </svg>
              </div>

              {/* Floor Shadow */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-5 bg-black/30 rounded-full blur-xs pointer-events-none" />
            </div>

            {/* Bottom Camera Trigger Bar */}
            <div className="p-3 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-300">
              <span className="flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {lang === 'de' ? currentDest.cityDe : lang === 'es' ? currentDest.cityEs : currentDest.cityEn}
              </span>
              <button
                onClick={handleSnapPhoto}
                className="px-3.5 py-1.5 bg-amber-100 hover:bg-white text-stone-900 rounded-xl font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#8c1d40]" />
                <span>{lang === 'de' ? 'Klick!' : lang === 'es' ? '¡Clic!' : 'Click!'}</span>
              </button>
            </div>
          </div>

          {/* DEVELOPED POLAROID POSTCARD RESULT */}
          {snappedPolaroid && (
            <div className="p-6 rounded-3xl bg-[#faf4e8] border-2 border-[#8c1d40]/30 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between border-b border-amber-900/15 pb-3">
                <span className="text-xs font-mono font-bold uppercase text-[#8c1d40] flex items-center gap-1.5">
                  <Camera className="w-4 h-4" />
                  {lang === 'de' ? 'Entwickeltes Sofortbild & Luftpost-Grüße' : lang === 'es' ? 'Polaroid revelada y tarjeta aérea' : 'Developed Polaroid & Airmail Card'}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {snappedPolaroid.timestamp}
                </span>
              </div>

              {/* Vintage Polaroid Card Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Polaroid Frame (5 cols) */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="bg-white p-3.5 pb-8 rounded-lg shadow-xl border border-stone-300 transform -rotate-2 hover:rotate-0 transition-transform duration-300 w-64 max-w-full">
                    {/* Photo area */}
                    <div className={`w-full h-56 rounded bg-gradient-to-b ${snappedPolaroid.destination.bgGradient} relative overflow-hidden flex items-end justify-center border border-stone-200 shadow-inner`}>
                      <span className="absolute top-2 right-2 text-xl drop-shadow">{snappedPolaroid.destination.flag}</span>
                      <div className="text-center font-amelie font-bold text-stone-900/80 text-xs absolute bottom-1">
                        {snappedPolaroid.destination.cityEn.split(',')[0]}
                      </div>
                      {/* Mini Ceramic Gnome silhouette */}
                      <div className="w-20 h-28 relative z-10 mb-1">
                        <svg viewBox="0 0 200 250" className="w-full h-full drop-shadow-md">
                          <polygon points="100,15 72,68 128,68" fill="#dc2626" />
                          <circle cx="100" cy="80" r="28" fill="#fed7aa" />
                          <path d="M 72 82 C 60 115, 65 165, 100 172 C 135 165, 140 115, 128 82 Z" fill="#ffffff" />
                          <path d="M 68 125 C 60 170, 60 215, 75 230 L 125 230 C 140 215, 140 170, 132 125 Z" fill="#2563eb" />
                          <rect x="68" y="175" width="64" height="14" fill="#0f172a" />
                        </svg>
                      </div>
                    </div>
                    {/* Handwritten marker caption */}
                    <div className="text-center pt-3 font-amelie font-bold text-stone-800 text-sm tracking-wide">
                      {lang === 'de' ? snappedPolaroid.destination.nameDe : lang === 'es' ? snappedPolaroid.destination.nameEs : snappedPolaroid.destination.nameEn}
                    </div>
                  </div>
                </div>

                {/* Postcard Letter to Papa (7 cols) */}
                <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-amber-900/15 shadow-xs space-y-3 relative overflow-hidden">
                  {/* Stamp & Postmark */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                        PAR AVION · AIR MAIL
                      </span>
                      <span className="text-xs font-serif italic text-stone-600 block">
                        {lang === 'de' ? 'An: M. Raphaël Poulain' : lang === 'es' ? 'Para: M. Raphaël Poulain' : 'To: M. Raphaël Poulain'}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        Enghien-les-Bains, France
                      </span>
                    </div>

                    {/* Postal Stamp Badge */}
                    <div className="border-2 border-dashed border-red-700 p-1.5 rounded text-center font-mono text-[9px] text-red-800 font-bold rotate-6 bg-red-50">
                      <div>POSTE 1974</div>
                      <div className="text-sm">📮 {snappedPolaroid.destination.flag}</div>
                    </div>
                  </div>

                  {/* Letter Body */}
                  <p className="text-stone-800 text-xs md:text-sm font-serif italic leading-relaxed whitespace-pre-line bg-amber-50/40 p-3.5 rounded-xl border border-amber-200/60">
                    {snappedPolaroid.letter}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-stone-500">
                      {lang === 'de' ? 'Status: Per Postbotin unterwegs 📬' : lang === 'es' ? 'Estado: En camino por correo 📬' : 'Status: En route via airmail 📬'}
                    </span>

                    <button
                      onClick={() => handleCopyLetter(snappedPolaroid.letter)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-xs font-medium text-stone-800 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
                      <span>{copiedLetter ? (lang === 'de' ? 'Kopiert!' : lang === 'es' ? '¡Copiado!' : 'Copied!') : (lang === 'de' ? 'Brief kopieren' : lang === 'es' ? 'Copiar carta' : 'Copy Letter')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery of World Tour Polaroids */}
      {gallery.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#d8cbba] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#8c1d40]" />
              {lang === 'de' ? 'Reisealbum des Zwergs (Heutige Expedition)' : lang === 'es' ? 'Álbum del gnomo (Expedición de hoy)' : 'Gnome’s Travel Album (Today’s Expedition)'}
            </span>
            <span className="text-xs font-mono text-stone-500">
              {gallery.length} {lang === 'de' ? 'Polaroids geschossen' : lang === 'es' ? 'fotos tomadas' : 'snapshots taken'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {gallery.map((snap) => (
              <div
                key={snap.id}
                onClick={() => setSnappedPolaroid(snap)}
                className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs hover:shadow-sm hover:border-[#8c1d40] cursor-pointer transition-all text-center flex flex-col justify-between"
              >
                <div className={`w-full h-20 rounded bg-gradient-to-b ${snap.destination.bgGradient} flex items-center justify-center text-xl`}>
                  {snap.destination.flag}
                </div>
                <span className="text-[11px] font-bold text-stone-800 line-clamp-1 mt-1 font-amelie">
                  {lang === 'de' ? snap.destination.cityDe.split(',')[0] : lang === 'es' ? snap.destination.cityEs.split(',')[0] : snap.destination.cityEn.split(',')[0]}
                </span>
                <span className="text-[9px] font-mono text-stone-400">{snap.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

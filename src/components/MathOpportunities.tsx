import { BirdMigrationDemo } from './BirdMigrationDemo';
import { HeartHandshake, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Language } from '../types';

const COPY = {
  de: {
    label: 'Neue Chancen entdecken',
    title: 'Neue Mathematik. Mehr Möglichkeiten für ein glücklicheres Leben.',
    intro: 'Amélie sucht neue Chancen, das Leben der Menschen glücklicher zu machen. Neue mathematische Erkenntnisse können Türen öffnen: zu leichterer Arbeit, zugänglichen Werkzeugen, geschützter Natur und Freude am Lernen und Spielen.',
    question: 'Wem könnte das helfen — und was würde im Alltag besser?',
    steps: ['Eine neue Erkenntnis verstehen', 'Eine Chance für Menschen finden', 'Den Nutzen im Kleinen testen', 'Ein brauchbares Werkzeug verschenken'],
    exampleTitle: 'Eine erste Forschungsfrage: EuroBirdCast',
    example: 'Können Daten mehrerer Wetterradare helfen, Vogelzug besser zu verstehen und die Natur zu schützen? Wir beginnen mit vorhandenen Daten und einfachen Vergleichsmodellen. Ob neue Kakeya-Ergebnisse dabei helfen, ist eine offene Forschungsfrage.',
    status: 'Forschungsidee · Nutzen noch zu prüfen',
    handoff: 'Arbeitsauftrag für die nächste Runde',
    research: 'EuroBirdCast-Recherche',
    catalogue: 'Mathematische Ergebnisse erkunden',
  },
  en: {
    label: 'Discover new chances',
    title: 'New mathematics. More possibilities for happier lives.',
    intro: 'Amélie looks for new chances to make people’s lives happier. New mathematical insights can open doors to easier work, accessible tools, protected nature, and the joy of learning and playing.',
    question: 'Who could benefit — and what would become better in everyday life?',
    steps: ['Understand a new insight', 'Find an opportunity for people', 'Test the benefit on a small scale', 'Give a useful tool away'],
    exampleTitle: 'A first research question: EuroBirdCast',
    example: 'Could data from several weather radars help us understand bird migration and protect nature? We start with existing data and simple comparison models. Whether new Kakeya results can help remains an open research question.',
    status: 'Research idea · benefit still to be tested',
    handoff: 'Brief for the next research round',
    research: 'EuroBirdCast research',
    catalogue: 'Explore mathematical results',
  },
  es: {
    label: 'Descubrir nuevas oportunidades',
    title: 'Nuevas matemáticas. Más posibilidades para una vida más feliz.',
    intro: 'Amélie busca nuevas oportunidades para hacer más feliz la vida de las personas. Los nuevos conocimientos matemáticos pueden abrir puertas a un trabajo más fácil, herramientas accesibles, naturaleza protegida y el placer de aprender y jugar.',
    question: '¿A quién podría ayudar y qué mejoraría en su vida cotidiana?',
    steps: ['Comprender un nuevo resultado', 'Encontrar una oportunidad para las personas', 'Probar el beneficio a pequeña escala', 'Regalar una herramienta útil'],
    exampleTitle: 'Una primera pregunta de investigación: EuroBirdCast',
    example: '¿Podrían los datos de varios radares meteorológicos ayudarnos a comprender la migración de aves y proteger la naturaleza? Empezamos con datos existentes y modelos sencillos de comparación. La utilidad de los nuevos resultados de Kakeya sigue siendo una pregunta abierta.',
    status: 'Idea de investigación · beneficio pendiente de comprobar',
    handoff: 'Instrucciones para la próxima ronda',
    research: 'Investigación EuroBirdCast',
    catalogue: 'Explorar los resultados matemáticos',
  },
} satisfies Record<Language, {
  label: string; title: string; intro: string; question: string; steps: string[];
  exampleTitle: string; example: string; status: string; handoff: string; research: string; catalogue: string;
}>;

const REPO = 'https://github.com/felixinberlin/Amelie/blob/main/02-recherche/';

export function MathOpportunities({ lang }: { lang: Language }) {
  const copy = COPY[lang];
  return (
    <section id="math-opportunities" aria-labelledby="math-opportunities-title" className="rounded-2xl border border-emerald-800/20 bg-emerald-50/60 p-6 md:p-8 space-y-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">
        <Sparkles className="h-4 w-4" aria-hidden="true" />{copy.label}
      </div>
      <h3 id="math-opportunities-title" className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900">{copy.title}</h3>
      <p className="text-stone-700 leading-relaxed">{copy.intro}</p>
      <p className="flex items-start gap-2 font-semibold text-emerald-900"><HeartHandshake className="h-5 w-5 shrink-0" aria-hidden="true" />{copy.question}</p>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {copy.steps.map((step, index) => <li key={step} className="rounded-xl border border-emerald-900/10 bg-white/80 p-4 text-sm text-stone-800"><span className="block mb-2 font-mono text-emerald-700">{index + 1}.</span>{step}</li>)}
      </ol>
      <div className="rounded-xl bg-white/80 border border-stone-200 p-5 space-y-2">
        <span className="text-xs font-medium text-emerald-800">{copy.status}</span>
        <h4 className="font-semibold text-stone-900">{copy.exampleTitle}</h4>
        <p className="text-sm leading-relaxed text-stone-700">{copy.example}</p>
      </div>
      <BirdMigrationDemo />
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-emerald-900">
        {[
          [copy.handoff, REPO + 'amelie-new-math-agent-handoff.md'],
          [copy.research, REPO + 'eurobirdcast-radar-kakeya-research-2026.md'],
          [copy.catalogue, 'https://github.com/openai/math/blob/main/overview.tex'],
        ].map(([label, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 hover:text-emerald-700">{label}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>)}
      </div>
    </section>
  );
}

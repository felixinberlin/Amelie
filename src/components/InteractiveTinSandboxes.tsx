import { Link, useLocation } from 'react-router-dom';
import { simulatorPath, withPreferences } from '../routing/routes';
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Language } from '../types';
import {
  AltbauThermalSimulator,
  GlasanflugSimulator,
  StreiflichtSimulator,
  WetInkSimulator,
  BalkonkraftwerkSimulator,
  RegenwasserSimulator,
  KlarLokalSimulator,
  CrackFloraSimulator,
  KiezLaermSimulator,
  FugenduellArena,
  TischSchiedsrichterSimulator,
  KristallwachstumSimulator,
  ChemHazardSimulator,
} from './simulators';

export type SandboxKey = import('../data/doseSimulators').SimulatorKey;

interface InteractiveTinSandboxesProps {
  lang: Language;
  initialSandbox?: SandboxKey;
  onOpenDose?: (doseId: string) => void;
}

export const InteractiveTinSandboxes: React.FC<InteractiveTinSandboxesProps> = ({
  lang,
  initialSandbox = 'altbau',
  onOpenDose,
}) => {
  const location = useLocation();
  const activeTab = initialSandbox;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-stone-50 border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-mono-code mb-3 border border-amber-200/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>
                {lang === 'de'
                  ? 'Interaktive Dosen-Simulatoren'
                  : lang === 'es'
                  ? 'Simuladores Interactivos de Latas'
                  : 'Interactive Tin Sandboxes'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
              {lang === 'de'
                ? 'Das physikalische Herz der Dosen ausprobieren'
                : lang === 'es'
                ? 'Experimenta la lógica física central de las latas'
                : 'Experience the Core Physical Logic of the Tins'}
            </h2>
            <p className="text-sm text-stone-600 mt-1.5 max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Jede Amélie-Dose stützt sich auf eine konkrete Formel, physikalische Norm oder API-Lücke. Testen Sie hier die Prototyp-Mechanik direkt im Browser, bevor Sie das Briefing versenden.'
                : lang === 'es'
                ? 'Cada lata Amélie se basa en una fórmula concreta, norma física o brecha de API. Prueba la mecánica de prototipo en el navegador antes de enviar el briefing.'
                : 'Every Amélie tin is grounded in a specific physical formula, regulatory standard, or API gap. Test the prototype mechanics right here in your browser before sending the briefing.'}
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200/80 self-start md:self-auto">
            <Link to={withPreferences(simulatorPath('altbau'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'altbau'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🏢 {lang === 'de' ? 'Altbau' : lang === 'es' ? 'Edificio Antiguo' : 'Old Building'}
            </Link>
            <Link to={withPreferences(simulatorPath('glasanflug'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'glasanflug'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🐦 {lang === 'de' ? 'Glasanflug' : lang === 'es' ? 'Colisión de Aves' : 'Bird Glass'}
            </Link>
            <Link to={withPreferences(simulatorPath('streiflicht'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'streiflicht'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🔦 {lang === 'de' ? 'Streiflicht' : lang === 'es' ? 'Luz Rasante' : 'Raking Light'}
            </Link>
            <Link to={withPreferences(simulatorPath('wetink'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'wetink'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🖋️ {lang === 'de' ? 'Tinte' : lang === 'es' ? 'Tinta Líquida' : 'Wet Ink'}
            </Link>
            <Link to={withPreferences(simulatorPath('balkon'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'balkon'
                  ? 'bg-white text-amber-900 shadow-xs font-bold border border-amber-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ☀️ {lang === 'de' ? 'Balkonkraftwerk' : lang === 'es' ? 'Placas de Balcón' : 'Balcony Solar'}
            </Link>
            <Link to={withPreferences(simulatorPath('regenwasser'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'regenwasser'
                  ? 'bg-white text-blue-900 shadow-xs font-bold border border-blue-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌧️ {lang === 'de' ? 'Regenwasser' : lang === 'es' ? 'Agua de Lluvia' : 'Rainwater'}
            </Link>
            <Link to={withPreferences(simulatorPath('klarlokal'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'klarlokal'
                  ? 'bg-white text-emerald-950 shadow-xs font-bold border border-emerald-400'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🛡️ {lang === 'de' ? 'KlarLokal (Brecheisen)' : lang === 'es' ? 'KlarLokal (Palanca)' : 'KlarLokal (Battering Ram)'}
            </Link>
            <Link to={withPreferences(simulatorPath('crackflora'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'crackflora'
                  ? 'bg-white text-lime-950 shadow-xs font-bold border border-lime-500'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌱 {lang === 'de' ? 'Crack Flora (Ritzengrün)' : lang === 'es' ? 'Crack Flora (Grietas)' : 'Crack Flora (Pavement)'}
            </Link>
            <Link to={withPreferences(simulatorPath('laerm'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'laerm'
                  ? 'bg-white text-[var(--m-accent)] shadow-xs font-bold border border-[var(--m-accent)]/40'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🎧 {lang === 'de' ? 'Kiez-Lärmkarte' : lang === 'es' ? 'Mapa de Ruido' : 'Kiez Noise Map'}
            </Link>
            <Link to={withPreferences(simulatorPath('fugenduell'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'fugenduell'
                  ? 'bg-white text-amber-950 shadow-xs font-bold border border-amber-500 ring-2 ring-amber-400/30'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ⚔️ {lang === 'de' ? 'Fugenduell (Game)' : lang === 'es' ? 'Fugenduell (Juego)' : 'Fugenduell (Arena)'}
            </Link>
            <Link to={withPreferences(simulatorPath('schiedsrichter'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'schiedsrichter'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold border border-emerald-700/50'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🟨 {lang === 'de' ? 'TischSchiedsrichter' : lang === 'es' ? 'Árbitro de sobremesa' : 'Table Referee'}
            </Link>
            <Link to={withPreferences(simulatorPath('kristall'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'kristall'
                  ? 'bg-stone-900 text-cyan-300 shadow-xs font-bold border border-cyan-500 ring-2 ring-cyan-500/30'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              💎 {lang === 'de' ? 'Kristallwachstum 3D' : lang === 'es' ? 'Crecimiento de Cristales' : 'Crystal Growth 3D'}
            </Link>
            <Link to={withPreferences(simulatorPath('chemhazard'), location.search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chemhazard'
                  ? 'bg-red-950 text-red-200 shadow-xs font-bold border border-red-500 ring-2 ring-red-500/30'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ☣️ {lang === 'de' ? 'ChemHazard Stop' : lang === 'es' ? 'ChemHazard Stop' : 'ChemHazard Stop'}
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Content - Modular Simulators */}
      {activeTab === 'altbau' && (
        <AltbauThermalSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'glasanflug' && (
        <GlasanflugSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'streiflicht' && (
        <StreiflichtSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'wetink' && (
        <WetInkSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'balkon' && (
        <BalkonkraftwerkSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'regenwasser' && (
        <RegenwasserSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'klarlokal' && (
        <KlarLokalSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'crackflora' && (
        <CrackFloraSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'laerm' && (
        <KiezLaermSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'fugenduell' && (
        <FugenduellArena lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'schiedsrichter' && (
        <TischSchiedsrichterSimulator lang={lang} onOpenDose={onOpenDose} />
      )}
      {activeTab === 'kristall' && (
        <KristallwachstumSimulator lang={lang} />
      )}
      {activeTab === 'chemhazard' && (
        <ChemHazardSimulator lang={lang} />
      )}
    </div>
  );
};

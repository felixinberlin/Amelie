import { lazy } from 'react';

// Direct imports keep each simulator behind its own chunk boundary.
export const AltbauThermalSimulator = lazy(() => import('./AltbauThermalSimulator').then(m => ({ default: m.AltbauThermalSimulator })));
export const GlasanflugSimulator = lazy(() => import('./GlasanflugSimulator').then(m => ({ default: m.GlasanflugSimulator })));
export const StreiflichtSimulator = lazy(() => import('./StreiflichtSimulator').then(m => ({ default: m.StreiflichtSimulator })));
export const WetInkSimulator = lazy(() => import('./WetInkSimulator').then(m => ({ default: m.WetInkSimulator })));
export const BalkonkraftwerkSimulator = lazy(() => import('./BalkonkraftwerkSimulator').then(m => ({ default: m.BalkonkraftwerkSimulator })));
export const RegenwasserSimulator = lazy(() => import('./RegenwasserSimulator').then(m => ({ default: m.RegenwasserSimulator })));
export const KlarLokalSimulator = lazy(() => import('./KlarLokalSimulator').then(m => ({ default: m.KlarLokalSimulator })));
export const CrackFloraSimulator = lazy(() => import('./CrackFloraSimulator').then(m => ({ default: m.CrackFloraSimulator })));
export const KiezLaermSimulator = lazy(() => import('./KiezLaermSimulator').then(m => ({ default: m.KiezLaermSimulator })));
export const FugenduellArena = lazy(() => import('./FugenduellArena').then(m => ({ default: m.FugenduellArena })));
export const TischSchiedsrichterSimulator = lazy(() => import('./TischSchiedsrichterSimulator').then(m => ({ default: m.TischSchiedsrichterSimulator })));
export const KristallwachstumSimulator = lazy(() => import('./KristallwachstumSimulator').then(m => ({ default: m.KristallwachstumSimulator })));
export const ChemHazardSimulator = lazy(() => import('./ChemHazardSimulator').then(m => ({ default: m.ChemHazardSimulator })));

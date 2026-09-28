# Ticket #2: Taktile Reibungs-Akustik & Multi-Iso SVG-Vektorisierung

**Status:** ABGESCHLOSSEN & VERIFIZIERT  
**Dose:** Wet Ink (`05-dosen/wet-ink.md`)  
**Pakete:** `src/engine/wet-ink/audio.ts`, `src/engine/wet-ink/svgExport.ts`, `packages/wet-ink-core/`  

---

## Zielsetzung

Integration prozeduraler Web-Audio-Akustik (synthetisiertes Reibungsgeräusch der Feder auf Papier) sowie eines hochauflösenden Marching-Squares-Algorithmus zur Vektorisierung kontinuierlicher Pigmentdichten in gestochen scharfe, skalierbare SVG-Pfade.

---

## Definition of Done (DoD)

1. [x] **Web Audio Synthesizer (`PenAudioSynthesizer`):** Bandpass-gefiltertes Rauschen mit Resonanzpeaks, frequenz- und amplitudenmoduliert über Strichgeschwindigkeit, Andruck und Papierkörnung.
2. [x] **Multi-Iso Marching Squares (`WetInkSVGExporter`):** Deterministische Konturierung in drei Schwellenwerten (Wash 0.15, Body 0.40, Core 0.70) mit korrekter Pfad-Schließung und XML-Export.
3. [x] **Löschpapier-Aktion (`handleBlot`):** Sofortiges Absaugen des Oberflächenwassers bei erhaltener Kapillarverteilung.
4. [x] **Simulator-Integration:** Mute-Toggle, SVG-Download und taktile Soundeffekte im interaktiven Amélie-Simulator (`WetInkSimulator.tsx`).
5. [x] **Vitest-Verifikation:** Alle Tests für Controller, Audio-Guards und SVG-Export bestehen fehlerfrei.

# Altbau Thermal — Pitch

- `pitch.html`: 8-slide deck (DE/EN, arrow keys, prints to PDF), self-contained, opens offline. Content is taken from `05-dosen/altbau-thermal.md`.
- The interactive demo is **not** a file here: it is the "Old Building" tab in the app (`src/components/InteractiveTinSandboxes.tsx`, physics in `src/services/altbauThermal.ts`). Run `npm run dev`, then open a tin card "Altbau Thermal" → "Live Heat Loss Simulator", or menu Simulators → Old Building.
- What is faked: nothing is measured. All results are a steady-state estimate from rule-of-thumb U-values (unchecked) and stated assumptions; every result is shown as a band.
- Not validated against DIN 12831 / a full norm calculation yet; the code is only checked against an independent hand calculation of the same formulas.

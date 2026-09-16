# Wet Ink — Implementierungsplan

Tinte auf Papier als echte Simulation: Kapillarfluss, Bleeding, Faser-Anisotropie, Edge Darkening.
Ein WebGL2-Brush, kein Malprogramm. **Eine Physik, tief statt breit.**

---

## 0. Was das Ding können muss (Akzeptanz = Auge, nicht Unit-Test)

Fünf Effekte, die echte Tinte macht und Photoshop nicht. Wenn die da sind, ist das Projekt fertig:

| Effekt | Woher er physikalisch kommt |
|---|---|
| **Feathering** — Ausfransen entlang der Fasern | Kapillarfluss im Fasernetz, anisotrop |
| **Edge Darkening** — dunkler Rand am getrockneten Fleck | Wasser fließt nach außen, verdunstet dort, Pigment bleibt liegen |
| **Backrun / Cauliflower** — Blumenkohl-Kante wenn nass auf feucht trifft | Druckgradient schiebt Pigment in die feuchtere Zone zurück |
| **Granulation** — Pigment sammelt sich in den Papiertälern | Höhenfeld + Deposition proportional zur Wassertiefe |
| **Dry Brush** — Skipping über die Papierberge | Pinsel trägt nur auf, wo Papierhöhe < Wasserfilm |

Alles andere (Ebenen, Pinselbibliothek, Farbräder) ist explizit **out of scope**.

---

## 1. Physikmodell

Drei Schichten, alle als Float-Texturen auf der GPU, Ping-Pong-FBOs.

**Papier (statisch, einmal generiert)**
- `height` — fBm-Noise, die Körnung
- `fiberDir` — anisotropes Richtungsfeld (bei Japanpapier stark, bei Kopierpapier fast isotrop)
- `capacity` — wieviel Wasser die Faser lokal aufnimmt (Leimung/Sizing)

**Oberflächenschicht (das Wasser, das noch oben steht)**
- `h` Wasserhöhe, `u,v` Geschwindigkeit, `p` gelöstes Pigment

**Faserschicht (das, was reingesogen ist)**
- `s` Sättigung, `d` deponiertes Pigment ← *das ist, was du siehst*

**Ein Simulationsschritt** (Reihenfolge zählt):

1. **Input** — Pinselstempel schreibt `h`, `p` additiv rein
2. **Velocity update** — Druck aus `∇h`, Viskosität, Drag aus Papierhöhe
3. **Divergence relax** — 20–40 Jacobi-Iterationen, sonst explodiert's
4. **Advect pigment** — semi-Lagrangian, `p` reitet auf `u,v`
5. **Capillary flow** — `s` diffundiert in der Faserschicht, **mit Schwelle**: fließt erst weiter, wenn `s > εmin`, und gedämpft entlang `fiberDir`. Diese Schwelle ist der ganze Grund, warum ein Fleck eine *fransige* Kante hat und keine runde.
6. **Transfer** — Oberfläche → Faser (Absorptionsrate α), gelöst → deponiert (Deposition/Lift-off, Curtis-Style)
7. **Evaporate** — `h` schrumpft; am Rand am schnellsten → Edge Darkening fällt von selbst raus

**Rendering:** Kubelka-Munk statt Alpha-Blending. K/S-Koeffizienten pro Tinte, Lagen überlagern sich dann wie echte Lasuren statt wie halbtransparente PNGs. Das ist der Unterschied zwischen „sieht aus wie Tinte" und „sieht aus wie ein Filter".

---

## 2. Stack & Struktur

Dein Stack, minus alles Unnötige. **Kein three.js** — es sind Fullscreen-Quads, keine Szene.

- **WebGL2 raw** (+ `twgl` als 3-kB-Zuckerguss), `EXT_color_buffer_float`
- **TypeScript strict**, Vite, Vitest
- **React 19 nur für die UI-Schale**, Zustand für Parameter — die Engine weiß nichts von React
- Kein Canvas2D-Fallback. Kein WebGPU (noch nicht, siehe Risiken)

```
src/
  engine/            # framework-frei, testbar, exportierbar
    paper/           # Generator: fBm, Fasern, Capacity
    sim/             # ein Modul pro Pass, alle gleiche Signatur
      velocity.ts  divergence.ts  advect.ts
      capillary.ts transfer.ts    evaporate.ts
    render/          # Kubelka-Munk Compositing
    gl/              # FBO-Pool, Ping-Pong, Shader-Loader
    reference/       # CPU-Referenzimplementierung derselben Kernel (32×32)
  brush/             # Pointer → Footprint → Stempel
  ui/                # React: Presets, Slider, Export
  presets/           # Tinte + Papier als JSON
```

**Warum die CPU-Referenz:** GPU-Simulationen kann man sonst nicht testen. Jeder Kernel existiert zweimal — einmal als Shader, einmal als langsame TS-Schleife. Der Test lässt beide auf 32×32 laufen und vergleicht. Kostet Disziplin, spart dir die Woche, in der du blind an Shadern rumdrehst.

---

## 3. Phasen

Jede Phase endet mit etwas, das man **anschauen** kann. Kein „Infrastruktur-Sprint".

**P0 — Papier (0,5 Tag)**
WebGL2-Context, Ping-Pong-Helper, Papiergenerator, Render. Du siehst leeres Papier mit Körnung.
✅ Deterministisch: gleicher Seed → gleicher Framebuffer-Hash.

**P1 — Der Klecks (1 Tag)**
Stempel schreibt Wasser+Pigment, Absorption, Verdunstung. Keine Strömung. Ein Klick = ein Fleck, der eintrocknet.
✅ Massenerhaltung: Wasser rein == absorbiert + verdunstet, ±0,1 %.

**P2 — Feathering (2 Tage) ← das Herzstück**
Kapillardiffusion mit Schwelle und Faser-Anisotropie. Der Klecks bekommt eine ausgefranste Kante, die je nach Papier anders aussieht.
✅ Visuell: Japanpapier-Preset franst sichtbar gerichtet, Kopierpapier rund.

**P3 — Strömung (2–3 Tage)**
Shallow Water: Velocity, Divergenz-Relaxation, Pigment-Advektion. Jetzt gibt's Backruns und Blooms.
✅ Stabil bei dt-Sprüngen (Tab-Wechsel) — CFL-Clamp greift, nichts explodiert.

**P4 — Pigment (2 Tage)**
Deposition/Lift-off, Granulation, Edge Darkening, Kubelka-Munk. Ab hier sieht es aus wie Tinte.
✅ Zwei Lagen derselben Tinte übereinander = sichtbar dunkler, nicht matschig.

**P5 — Pinsel (1–2 Tage)**
PointerEvent: `pressure`, `tiltX/Y`, Geschwindigkeit → Footprint-Größe, Wassermenge, Winkel. Stroke-Interpolation zwischen Events (sonst Perlenkette bei schnellen Strichen). Dry Brush.
✅ Schneller Strich = dünner und trockener als langsamer. Ohne dass man's erklärt.

**P6 — Presets & UI (1–2 Tage)**
Tinte: `Sumi`, `Füller-Blau`, `Sepia`. Papier: `Aquarell rau`, `Kopierpapier`, `Japanpapier`, `Löschpapier`.
Presets sind versioniertes JSON und in die URL kodierbar → man kann ein Rezept teilen. Undo = Layer-Snapshot alle N Sekunden.

**P7 — Export (1–2 Tage)**
- **PNG** — primär. High-Res über Re-Simulation auf größerem Grid mit gleichem Seed + Event-Log.
- **SVG** — *ehrlich gesagt das schwächste Glied.* Eine Fluidsim ist raster. Realistisch: Marching Squares auf `d` bei N Iso-Leveln → Douglas-Peucker → gebänderte Vektorform. Das ist ein **Stil**, keine Reproduktion. Verkauf es als „Siebdruck-Export", dann stimmt die Erwartung. Wenn du echte Vektortreue brauchst, ist das ein anderes Projekt.

**Summe: ~12 Arbeitstage.** P2 und P4 sind die, wo Tuning-Zeit reingeht — plan da eher zu viel ein.

---

## 4. Testen (weil du grün sehen willst, bevor die nächste Phase startet)

Vier Ebenen, alle in Vitest:

1. **Invarianten** — Massenerhaltung, keine NaNs, `s` nie > `capacity`. `gl.readPixels`-Readback, headless via Playwright/Chromium.
2. **GPU vs. CPU** — jeder Kernel gegen seine Referenzimplementierung auf 32×32, Toleranz 1e-4.
3. **Determinismus** — fester Seed, fester Timestep, N Schritte → stabiler Hash. Fängt versehentliche Frame-Abhängigkeiten.
4. **Visuelle Regression** — 6 Szenarien (einzelner Klecks, nass-auf-nass, schneller Strich, Dry Brush, zwei Lagen, Japanpapier), Screenshot vs. Golden-PNG mit pixelmatch, 1 % Toleranz. Das ist der Test, der dich wirklich schützt — Physik-Regressions sind *sichtbar*, nicht numerisch.

CI: Node + headless Chromium, läuft in unter 2 Minuten.

---

## 5. Risiken, ehrlich

| Risiko | Realität | Antwort |
|---|---|---|
| **Float-Texturen auf Mobile** | iOS kann Float-Blending eingeschränkt | Von Anfang an `half-float` (RGBA16F) als Default, Full-Float nur als Opt-in |
| **Shallow Water explodiert** | Passiert garantiert bei Tab-Wechsel (dt = 3 s) | Fixed Timestep mit Sub-Steps, Velocity-Clamp, CFL-Check |
| **„Sieht aus wie Rauch, nicht wie Tinte"** | Der wahrscheinlichste Ausgang | Deshalb P2 vor P3: Kapillarschwelle zuerst. Ohne die wird alles weich und wolkig |
| **Tuning frisst das Projekt** | 15 Parameter, alle gekoppelt | Debug-Panel ab P1, Preset-Export ab P2, jede gute Einstellung sofort als JSON festnageln |
| **SVG-Erwartung** | Siehe P7 | Früh kommunizieren, nicht am Ende |

---

## 6. Erstes Ticket

**`P0-1: WebGL2-Harness + Papiergenerator`**

- Vite + TS strict + Vitest Setup, `engine/` ohne React-Import
- `gl/FboPool`: Ping-Pong-Paar, RGBA16F, Resize-Handling, Extension-Check mit klarer Fehlermeldung
- `paper/generate.ts`: seeded fBm (Höhe), Richtungsfeld (Fasern), Capacity-Map → drei Kanäle in eine Textur
- `render/paper.frag`: Höhenfeld mit schrägem Licht, damit die Körnung sichtbar ist
- Debug-Overlay: FPS, Sim-Auflösung, aktiver Puffer
- Test: `paper.determinism.test.ts` — Seed 42, Hash stabil

**Done wenn:** leeres Papier auf dem Schirm, drei Presets sehen unterschiedlich aus, `npm test` grün.

---

## 7. Lesestoff (in dieser Reihenfolge)

1. **Curtis et al., „Computer-Generated Watercolor", SIGGRAPH 1997** — Schichtenmodell, Deposition/Lift-off, Edge Darkening, Kubelka-Munk. Das Fundament.
2. **Chu & Tai, „MoXi: Real-Time Ink Dispersion in Absorbent Paper", SIGGRAPH 2005** — Tinte statt Aquarell, Kapillarfluss im Fasernetz, echtzeitfähig. Näher an dem, was du willst.
3. **Stam, „Stable Fluids", 1999** — die Advektion/Projektions-Mechanik, die du in P3 brauchst.

---
status: Available
delivery_method: E-Mail
target_maker: Escape Motions
review_score: 32/35
architecture_tier: Tier 1
source_type: Type D
---
# Wet Ink

**Ein Satz:** Tinte auf Papier als physikalische Mehrschicht-Simulation im Browser — Kapillarfluss mit Schwellenwert, Faser-Anisotropie, Kubelka-Munk-Lasuroptik, taktile Web-Audio-Akustik und Marching-Squares-Vektorexport in einem headless entkoppelten SDK.

**Stand:** September 2026 · **Prüfen ab:** September 2027  
**Live-Simulator:** [felixinberlin.github.io/Amelie/#dose=wet-ink](https://felixinberlin.github.io/Amelie/#dose=wet-ink)  
**Verdikt:** 🎁 **verschenken** — Vollständig implementiert, getestet und als offenes `@wet-ink/*`-Ökosystem unter CC0 bereitgestellt  
**Review:** 32/35 · Tier 1 · Type D (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))  
**Empfänger:** Escape Motions (Rebelle), Rich-Text- & Editor-Communities (TipTap, ProseMirror, Obsidian, tldraw), Kalligrafie- und Sumi-e-Gemeinschaften, Grafik- und WebGL-Lehre  
**Scaffolding & Tests:** `src/engine/wet-ink/` · `packages/wet-ink-core/` · `packages/wet-ink-tiptap/` · `packages/wet-ink-react/` · `packages/wet-ink-obsidian/` (24 Suiten, 315 Tests grün)

---

## Das Geschenk: Physik statt Bitmap-Stempel

Digitale Zeichen- und Signaturwerkzeuge (in Photoshop, Procreate, DocuSign oder gängigen Web-Editoren) basieren fast ausnahmslos auf **wiederholten Bitmap-Stempeln** entlang von Bézier-Kurven. Sie erzeugen leblose, uniforme Pixel- oder Vektorstriche ohne Gespür für das Trägermaterial.

Echte Tinte auf Papier verhält sich physikalisch grundlegend anders: Sie ist ein lebendiges Zusammenspiel aus Fluiddynamik, poröser Kapillarität und optischer Pigmentüberlagerung.

Mit **Wet Ink** verschenken wir eine schlüsselfertige, framework-freie WebGL2-Engine und ein modulares SDK, das diese Physik ohne native Desktop-Binaries, ohne monatliche Cloud-Abonnements und ohne Serverkosten direkt in jeden Web-Browser bringt.

---

## Die fünf Phänomene der echten Tinte

Aus der 7-Pass-Simulation entstehen die fünf klassischen Verhaltensweisen poröser Tuschezeichnungen deterministisch aus den physikalischen Erhaltungssätzen:

1. **Feathering entlang von Cellulosefasern:** Tinte wandert kapillar durch das mikroskopische Porennetz des Papiers. Auf gerichtetem Japanpapier (Washi) fransen Striche anisotrop entlang der Faserrichtung aus; auf Bütten- oder Aquarellpapier folgt die Ausbreitung der Oberflächenstruktur.
2. **Edge Darkening (Kaffeering-Effekt):** Dünne Ränder verdunsten schneller als der feuchte Kern. Ein hydrodynamischer Ausgleichsstrom transportiert ungebundene Pigmentpartikel an die Trocknungsgrenze, wo sie sich als messerscharfer, dunkler Saum ablagern.
3. **Backruns & Ausbluten bei Nass-in-Nass:** Setzt man einen frischen, nassen Pinselstrich in eine bereits angetrocknete, feuchte Lasur, treiben Oberflächenspannungs- und Konzentrationsunterschiede das Pigment rückwärts in den bestehenden Wasserfilm (Blüten- und Wolkeneffekt).
4. **Granulation in Papiertälern:** Schwere mineralische Pigmente sinken in die mikroskopischen Vertiefungen rauer Papiere ein, während leichtere Bindemittel auf den Papierhöhen verbleiben.
5. **Dry Brush über Papierberge:** Schnelle Pinselbewegungen mit wenig Feuchtigkeit berühren nur die Spitzen der Papiertextur, während die Täler unberührt weiß bleiben.

---

## Warum das jetzt geht

1. **WebGL2 mit Float32-Texturen:** Drei gekoppelte Texturschichten (Papier, Oberflächenwasser, Faserschicht) laufen mit 60 FPS in Echtzeit auf Desktop- und Mobil-GPUs.
2. **Kubelka-Munk statt Alpha-Blending:** Physikalische Modellierung von Lichtabsorption ($K$) und Streuung ($S$). Lasuren mischen sich subtraktiv wie echte Tuschen (Sumi, Eisengallus, Indigo, Zinnober) statt wie durchscheinende Digitalfolien.
3. **Die Kapillarschwelle ($\varepsilon_{\min}$):** Der entscheidende algorithmische Durchbruch. Ohne Kapillarschwelle diffundiert Tinte kontinuierlich wie Rauch. Mit Schwellenwert stoppt die Ausbreitung exakt an den Porengrenzen des Papiers.
4. **Web Audio Haptik:** Prozedurale Synthese von Schreibgeräuschen direkt im Audiokontext — Frequenz und Amplitude modulieren dynamisch nach Schreibgeschwindigkeit, Andruck und Papierkörnung.
5. **Marching-Squares Vektorisierung:** Deterministische Extraktion von Multi-Iso-Konturen (Wash, Body, Core) direkt aus dem Simulationsfeld für gestochen scharfen, auflösungsunabhängigen SVG-Vektorexport.

---

## Die modulare Architektur (`packages/`)

Die Codebasis ist nach dem Vorbild moderner headless SDKs vollständig modular aufgebaut:

* **`@wet-ink/core` (`packages/wet-ink-core/`):**
  - Framework-freier Simulationscontroller (`WetInkController`).
  - Dreiphasiger sparsamer Lifecycle: *Nass 60 FPS* $\rightarrow$ *Trocknen ~3s* $\rightarrow$ *0 FPS / 0% CPU Ruhezustand*.
  - Prozeduraler Web Audio Synthesizer (`PenAudioSynthesizer`).
  - Vektor-Marching-Squares-Konverter (`WetInkSVGExporter`).
  - Native `<wet-ink-signature>` Web Component für Vanilla-HTML, Vue, Svelte und Webkomponenten.
* **`@wet-ink/tiptap` (`packages/wet-ink-tiptap/`):**
  - Schlanker ProseMirror-NodeView für TipTap- und Rich-Text-Editoren.
  - Speichert Striche, serialisiert Vektor-SVGs und bindet handschriftliche Signaturen und Marginalien direkt in den Dokumentenbaum ein.
* **`@wet-ink/react` (`packages/wet-ink-react/`):**
  - Deklarative `<WetInkSignature />`-Komponente mit Turnkey-Presets.
  - Flexibler `useWetInk()`-Hook zur Steuerung beliebiger `<canvas>`-Elemente.
* **`@wet-ink/obsidian` (`packages/wet-ink-obsidian/`):**
  - Markdown-Codeblock-Prozessor (````wet-ink````) für handschriftliche Skizzen und Siegel in Obsidian-Vaults.

---

## Skizze & Simulations-Pipeline

Sieben sequentielle Shader-Pässe pro Animationsschritt:

$$\text{Input (Stylus/Druck)} \longrightarrow \text{Velocity} \longrightarrow \text{Divergenz-Relaxation} \longrightarrow \text{Advektion} \longrightarrow \mathbf{\text{Kapillarfluss}}\ (\varepsilon_{\min}) \longrightarrow \text{Transfer} \longrightarrow \text{Verdunstung}$$

- **Schicht 1 — Papier:** Textur mit mikroskopischer Rauheit $h(x,y)$, Faserrichtung $\vec{f}(x,y)$ und lokaler Feuchtigkeitskapazität.
- **Schicht 2 — Oberflächenwasser:** Freies Wasser mit Geschwindigkeitsvektorfeld $\vec{u}(x,y)$ und gelöstem Pigment.
- **Schicht 3 — Faserschicht:** Gebundene Feuchtigkeit und deponiertes Pigment (das dauerhafte Bild).

---

## Erledigte Tickets & Status

* **Ticket #1: `@wet-ink/core` — Headless Fluid-Kernel & TipTap/RTE Signatur-Block.**
  * *Status:* **Abgeschlossen & verifiziert.** 7-Pass-Simulation, Kapillarschwelle, 3-Phasen-Lifecycle und TipTap-Adapter laufen stabil.
* **Ticket #2: Taktile Reibungs-Akustik, Löschpapier-Aktion & Vektor-SVG-Export.**
  * *Status:* **Abgeschlossen & verifiziert.** Integriert in `@wet-ink/core` und den interaktiven Amélie-Simulator (`WetInkSimulator.tsx`).
* **Testabdeckung:** 24 Test-Suiten mit 315 Tests laufen im Gesamtrepository zu 100 % fehlerfrei durch (`simulation.test.ts`, `kubelka-munk.test.ts`, `WetInkController.test.ts`, `WetInkExtension.test.ts`, `WetInkReact.test.ts`, `WetInkObsidian.test.ts`).

---

## Wo es kippt (Gegenmaßnahmen)

* **„Sieht aus wie Rauch, nicht wie Tinte":** Der häufigste Fallstrick in der Fluiddynamik. Gelöst durch strikte Durchsetzung der Kapillarschwelle $\varepsilon_{\min}$ vor der fluiden Advektion.
* **Akku- und CPU-Hunger:** Kontinuierliches Rendern würde Mobilgeräte überhitzen. Der Ruhezustands-Wächter friert das System nach vollständiger Trocknung ein (0 FPS, Null Last).
* **Vektorexport vs. Rasterfluid:** Rasterbasierte Pigmentverteilung lässt sich nicht trivial in Vektoren wandeln. Gelöst durch Mehrstufen-Marching-Squares, das saubere, geschlossene Iso-Bänder erzeugt.

---

## Wer es schon versucht hat & Abgrenzung

* **Escape Motions / Rebelle 8:** Kommerzieller Desktop-Goldstandard ($89–$150). Exzellente Physik, aber proprietäre Desktop-Software ohne Web-Fähigkeit oder offene SDKs. Wet Ink beweist, dass diese Physik direkt im Browser läuft.
* **Adobe Fresco:** Geschlossene iOS/Windows-App im monatlichen Creative-Cloud-Abo. Wet Ink läuft überall ohne Account, Telemetrie oder Cloud-Zwang.
* **Expresii (MoXi / Chu & Tai 2005):** Herausragende ostasiatische Tintensimulation auf DirectX 11. Wet Ink bringt die Prinzipien auf offene WebGL2-Standards.

---

## Geschenk-Zustellung & Lizenz

Dieses Werkzeug und sein vollständiger Quellcode gehören niemandem. Nimm ihn, binde ihn in deine Editoren ein, erweitere ihn oder baue Produkte darauf — du schuldest niemandem etwas, nicht einmal eine Antwort.

**CC0 1.0 Universal / Public Domain.** — Félix, Berlin · github.com/felixinberlin

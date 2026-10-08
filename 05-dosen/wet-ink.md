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

---

---

---
## External Google AI-Lab Research Findings (Refereed)
*Evaluated by Independent Researcher Agent on 2026-09-29*
**Confidence Score:** `0.90`

### Key Grounded Findings
- **The ink diffusion phenomenon, crucial in calligraphy and digital art, involves ink spreading on paper, influenced by ink particles, water, and paper fibers. Water molecules diffuse faster than larger ink particles, leading to varying ink density in diffused areas.**
  > "In this paper, the ink diffusion phenomenon which is one of the important features in calligraphy is researched. The ink diffusion phenomenon is the phenomenon of ink spreading on the paper. This phenomenon occurs mainly when a stroke is written with the brush contain- ing a large amount of ink or the brush moves slowly. Ink is made of ink particles and water, and when the brush is filled with ink and it is applied to the paper, ink flows to the paper and the water of the ink diffuses with the ink particles. The molecule of water is small, so it dif- fuses between the fibers of paper faster than ink particles. ... The ink particle is large and heavy in comparison with the molecules of water, so particles that are larger than the space between the fibers of paper cannot pass through, and remain there. The ink particles that are smaller than the space between the fibers of paper flow outside from the initial area. Therefore, in the ink diffusion area, the ink density of the outside is thinner than that of the in- side. So the density of ink influences the ink diffusion phenomenon. Generally, thin ink diffuses well, on the other hand, the thicker ink is the more the range of ink diffusion decreases."
  *Source (academic):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGecXYIOjrKiSPMXE01BVEZh9QCIbKuvaDsAEZ5rgzRnIp4P6T145ZBcG90WCafJzrqY41HQYssWzoX1w4aY7gxxVyeX4BqN5Kiead14TSMODYAfSEYN1Sq3d0trX0MmYPa2IHU0_JUX3gRf_6GYfS96e71DiZZexc-49EFuQmwQqu-wuaIdGQgbZy7TM9Pxr8psbte-zwwBo8=](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGecXYIOjrKiSPMXE01BVEZh9QCIbKuvaDsAEZ5rgzRnIp4P6T145ZBcG90WCafJzrqY41HQYssWzoX1w4aY7gxxVyeX4BqN5Kiead14TSMODYAfSEYN1Sq3d0trX0MmYPa2IHU0_JUX3gRf_6GYfS96e71DiZZexc-49EFuQmwQqu-wuaIdGQgbZy7TM9Pxr8psbte-zwwBo8=)
- **The dynamics of writing with ink, including linewidth, depend on pen speed and the physicochemical properties of both ink and paper, driven by capillary forces and resistance within the porous substrate.**
  > "Writing with ink involves the supply of liquid from a pen onto a porous hydrophilic solid surface, paper. The resulting linewidth depends on the pen speed and the physicochemical properties of the ink and paper. Here we quantify the dynamics of this process using a combination of experiment and theory. Our experiments are carried out using a minimal pen, a long narrow tube that serves as a reservoir of liquid, which can write on a model of paper, a hydrophilic micropillar array. A minimal theory for the rate of wicking or spreading of the liquid is given by balancing the capillary force that drives the liquid flow and the resistance associated with flow through the porous substrate."
  *Source (academic):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHeo2lvry1RNXIZuBbukr40OZkPGb5q116VDhqfY3yYKKz5Z2ZY9NFXcrz42V4So7tf1ufVskwrXFfQOYOyeUfH-RQEaF4P125tz8fbAThHwyyeSppZmhXMdfVfmDPns_aDcOUz_OFJDo_GUbgYVBQOu69WCvf4wTzVtwSzBS3Y57KWQg==](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHeo2lvry1RNXIZuBbukr40OZkPGb5q116VDhqfY3yYKKz5Z2ZY9NFXcrz42V4So7tf1ufVskwrXFfQOYOyeUfH-RQEaF4P125tz8fbAThHwyyeSppZmhXMdfVfmDPns_aDcOUz_OFJDo_GUbgYVBQOu69WCvf4wTzVtwSzBS3Y57KWQg==)
- **Digital watercolor simulation often employs a shallow-water fluid simulation for paint flow and the Kubelka-Munk model for optical compositing of pigmented layers, enabling effects like edge-darkening, granulation, and backruns.**
  > "This paper describes the various artistic effects of watercolor and shows how they can be simulated automatically. Our watercolor model is based on an ordered set of translucent glazes, which are created independently using a shallow-water fluid simulation. We use a Kubelka-Munk compositing model for simulating the optical effect of the superimposed glazes. ... The combination of these improvements enables our system to create many additional watercolor effects such as edge-darkening, granulation, backruns, separation of pigments, and glazing, as described in Section 2."
  *Source (academic):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEujhzyYL04G7TBGdxy7Hd_w2RIYuFoRYRy9DNKRy9LR5gvJsyfna4aS9n5B0ZnXmuXaACpe3bENZNomba3TWAt2K5-_S3oLv66XESre0d_XDLS_6j0C5wj4mfAqUup_JYYL2A8cqgy_gbVV455A684WsS_Z6l8rGo8KesRJ5k=](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEujhzyYL04G7TBGdxy7Hd_w2RIYuFoRYRy9DNKRy9LR5gvJsyfna4aS9n5B0ZnXmuXaACpe3bENZNomba3TWAt2K5-_S3oLv66XESre0d_XDLS_6j0C5wj4mfAqUup_JYYL2A8cqgy_gbVV455A684WsS_Z6l8rGo8KesRJ5k=)
- **Rebelle is a commercial software known for simulating realistic watercolor flow, including wet-into-wet blooms and dry brush textures, and is used by artists to test palettes digitally.**
  > "If you want to see how your chosen palette will behave in action, you could use a program called Rebelle. It simulates watercolour flow in a realistic way - from wet-into-wet blooms to dry brush textures."
  *Source (commercial):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGa0YkmqruMTJ6WjtbMwWlP1BwgAEHf8tO61_1NwMv4HsEalDIPhnVdEsE3cXbHqLqntbeZDc_U_QYlXW7fG8ky0nvfjB91RXS_GYEjwshdxAeTfcr3UT2UEGeMMQB9VwQJ-c6XXpHa9HvKF3gXXRlRwD3t54wOCGT7RwfANb3d1IiE2q8qc-Gbg-Mcf0rifQjpnoqyd10RVvaAuBEz0Q==](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGa0YkmqruMTJ6WjtbMwWlP1BwgAEHf8tO61_1NwMv4HsEalDIPhnVdEsE3cXbHqLqntbeZDc_U_QYlXW7fG8ky0nvfjB91RXS_GYEjwshdxAeTfcr3UT2UEGeMMQB9VwQJ-c6XXpHa9HvKF3gXXRlRwD3t54wOCGT7RwfANb3d1IiE2q8qc-Gbg-Mcf0rifQjpnoqyd10RVvaAuBEz0Q==)
- **Krita is a free and open-source digital painting program that offers professional-grade tools, a serious brush engine, and natural-media emulation, making it suitable for realistic painting effects.**
  > "Krita is free and open source digital painting and 2D animation software, and it is the pick for anyone who wants professional-grade tools without a subscription. ... If your goal is realistic painting that behaves like oil, watercolor, chalk, or ink on a physical surface, this is the tool built for it. The brush depth and texture handling are the deepest on this list, which is why traditional painters and realism-focused illustrators keep evaluating it against everything else."
  *Source (opensource):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHpCEk393nWsAPMbtggj-5CHrNdl3y5vcmf_Oqy6pJQCTujCwkWoVgyiqiJtQSm75EJZGxEc-kRx55UAezDmJSHUB6XlxF193QQcRWEXh1L3N3aRlfmja20X_pVNCS2hpmfJpVLwn4NlZQofl87CJJn2y8J](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHpCEk393nWsAPMbtggj-5CHrNdl3y5vcmf_Oqy6pJQCTujCwkWoVgyiqiJtQSm75EJZGxEc-kRx55UAezDmJSHUB6XlxF193QQcRWEXh1L3N3aRlfmja20X_pVNCS2hpmfJpVLwn4NlZQofl87CJJn2y8J)
- **The 'coffee ring effect' is caused by faster evaporation at the edges of a liquid droplet, leading to an outward capillary flow that transports suspended particles to the edge, forming a dark ring.**
  > "The mechanism behind the formation of these and similar rings is known as the coffee ring effect or in some instances, the coffee stain effect, or simply ring stain. It originates from the capillary flow directed from the interior to the edge of the puddle as it evaporates. Stains produced by the evaporation of ... The coffee-ring pattern originates from the capillary flow induced by the evaporation of the drop: liquid evaporating from the edge is replenished by liquid from the interior. The resulting current can carry nearly all the dispersed material to the edge."
  *Source (academic):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEA6SaNDUgttBjZar4BsGQLsp2URP7ova2_m3lRJIDLpCc_LfYsqkmBC3MNe7TPlfqLrTicTGK0ChTL64_NJPWSekIjL1FrgVKjEqXuserYZ8aaZOdMpVMsR8iebUNNIDWkGCt7FHGCDaij2g==](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEA6SaNDUgttBjZar4BsGQLsp2URP7ova2_m3lRJIDLpCc_LfYsqkmBC3MNe7TPlfqLrTicTGK0ChTL64_NJPWSekIjL1FrgVKjEqXuserYZ8aaZOdMpVMsR8iebUNNIDWkGCt7FHGCDaij2g==)
- **Backruns, also known as blooms or cauliflowers, occur in watercolor when fresh water or paint is applied to a still-damp wash, causing the liquid to push pigment outwards due to surface tension and concentration differences.**
  > "have you ever painted something and then once it dries you get these weird watery bursts almost like cauliflower. that's called a background and it happens when water isn't evenly mixed with the paint. so it pushes the pigment around a lot of the time it's seen as a mistake but what if we use that effect intentionally."
  *Source (commercial):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEvzXAMkO-8UtkXZVNXum_lW_iz-DK9MfsQjDzj-bPSsOnCphjJcIRZJ1TTNPD6BUx19yekR9KBakkKikC9qo_HMYu6Kdy1i_Y9u-ZncxBFAubeTnq1x9VSHAleuIH3zvLCSDhJ8ws=](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEvzXAMkO-8UtkXZVNXum_lW_iz-DK9MfsQjDzj-bPSsOnCphjJcIRZJ1TTNPD6BUx19yekR9KBakkKikC9qo_HMYu6Kdy1i_Y9u-ZncxBFAubeTnq1x9VSHAleuIH3zvLCSDhJ8ws=)
- **The Kubelka-Munk model provides a physically-based method for color mixing in paints, inks, and dyes by considering light absorption (K) and scattering (S), leading to more realistic subtractive color mixing than standard RGB blending.**
  > "The Kubelka-Munk (KM) model provides a physically based method for color mixing, particularly useful for rendering paints, and translucent materials. ... In real-world pigment mixing (e.g., paint, ink, or dyes), colors interact based on absorption and scattering rather than simple averaging. The Kubelka-Munk model provides a more accurate representation by considering: Absorption (K) – The amount of light absorbed by the material. Scattering (S) – The amount of light scattered or reflected within the material. This leads to more realistic pigment mixing, where combining yellow and blue, for example, produces a natural green instead of the desaturated result seen in RGB blending."
  *Source (academic):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH-2DF1lQ_UV5B4MUDO-uVX4X8VhHfPuCQzc17aNz_LbZ_f4fRie3xF6NmCNzYbN2xJIokU7Man00AMtUP_avJqy0wmVE-6gJe0wJY0rVFmkupuDO11gAsNdGktABXWBgjj_n48pWrC8KMPNb-xByWRdQ==](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH-2DF1lQ_UV5B4MUDO-uVX4X8VhHfPuCQzc17aNz_LbZ_f4fRie3xF6NmCNzYbN2xJIokU7Man00AMtUP_avJqy0wmVE-6gJe0wJY0rVFmkupuDO11gAsNdGktABXWBgjj_n48pWrC8KMPNb-xByWRdQ==)
- **WebGL2 with Float32 textures is used in real-time GPU-accelerated watercolor simulations, often based on fluid dynamics models, to achieve interactive and high-precision rendering of wet ink effects in web browsers.**
  > "The fluid model is Curtis, Anderson, Seims, Fleischer & Salesin, Computer-Generated Watercolor (SIGGRAPH 1997), as WebGL2 fragment shaders. The source is on GitHub. ... This tool needs JavaScript and WebGL2."
  *Source (opensource):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE9IOGVsTBs4iV0hX0SuqkO7s9tcuMHN7JJzoCxI5TRCOqQC_Kq-FL3mvR6lyGqSa0q3jDcTJ0l-2wSDwF3sIbRoQ859UKpqRJNV_IB_aNDp9SFvoAdoyUHTQ==](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE9IOGVsTBs4iV0hX0SuqkO7s9tcuMHN7JJzoCxI5TRCOqQC_Kq-FL3mvR6lyGqSa0q3jDcTJ0l-2wSDwF3sIbRoQ859UKpqRJNV_IB_aNDp9SFvoAdoyUHTQ==)
- **Capillary action is a fundamental principle explaining how ink flows in pens and spreads on paper, involving adhesion (ink to surface) and cohesion (ink molecules to each other) through narrow channels or paper fibers.**
  > "it all starts with two main forces adhesion and cohesion adhesion is the attraction between ink molecules. and the inside surfaces of the pen's ink feed which are usually made of plastic or metal cohesion is the attraction among the ink molecules. themselves these forces work together to pull ink through very narrow channels or fins inside the pen."
  *Source (commercial):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEvjGmKb8Nso46lZe4CPLjn9PAlEl3u725Mtuz4Bqgel-eaUr0lRYCIokm8_PBtniZVfc5G31GBSTQgiuBtgAzL6x11BdRWWNXdAvzs7K2lL7OfK6xgA-FivjBQaFFu1PYu2nsgHZY=](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEvjGmKb8Nso46lZe4CPLjn9PAlEl3u725Mtuz4Bqgel-eaUr0lRYCIokm8_PBtniZVfc5G31GBSTQgiuBtgAzL6x11BdRWWNXdAvzs7K2lL7OfK6xgA-FivjBQaFFu1PYu2nsgHZY=)
- **Feathering and bleeding of ink on paper occur when ink seeps into the paper's fibers via capillary action, with some inks and papers being more prone to this effect than others.**
  > "Feathering and bleeding happens when an ink seeps into the fibers of the paper by capillary action. The wicking of ink off the applied stroke can ruin the linework. Some inks and some papers are more prone to it than others."
  *Source (commercial):* [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEHo55WNPNKMGxk4R3R17wRomUuAMK26uG9x8OVOkZmvc4gZthBZjYQGU7y84I-LS3QgzNE43uzv9qQYITAvf5FOTWI5T5x7P3vQtzAmH7NpXmtDjyzc4a2-Ue5xNa9jedKjvcIZH9Qo6JBxvSJyiH7mddzEidC1ASXdAwiuTtnHmmxEaRWsLZb](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEHo55WNPNKMGxk4R3R17wRomUuAMK26uG9x8OVOkZmvc4gZthBZjYQGU7y84I-LS3QgzNE43uzv9qQYITAvf5FOTWI5T5x7P3vQtzAmH7NpXmtDjyzc4a2-Ue5xNa9jedKjvcIZH9Qo6JBxvSJyiH7mddzEidC1ASXdAwiuTtnHmmxEaRWsLZb)

### Contradictions & Challenged Premises
- ⚠️ The assumption that simple RGB alpha-blending is sufficient for realistic color mixing in digital paints and inks is contradicted by evidence showing that physical models like Kubelka-Munk are necessary for accurate subtractive color mixing, producing vibrant rather than muddy results.

### Gaps & Unresolved Technical Questions
- ❓ A universally recognized 'capillary threshold' (εmin) as a decisive algorithmic breakthrough for precisely stopping ink spread is not explicitly named or detailed in the search results, though the concept of controlling or limiting capillary action through thresholds is present in various simulation models.
- ❓ While anisotropic feathering along fiber direction on specific papers like Washi is mentioned in the premise, detailed verification of this specific anisotropic behavior in simulation literature was not explicitly found, though the general principle of ink spreading along fibers is supported.
- ❓ Despite its known benefits for realistic color mixing, the Kubelka-Munk model is not universally adopted in commercial digital painting software due to the increased complexity of tracking multiple pigment channels instead of just RGB values.
- ❓ Achieving a truly comprehensive, real-time physical simulation of all complex 'wet ink' phenomena (e.g., detailed paper fiber interactions, multi-component ink dynamics, and drying at various scales) remains a computational challenge, often requiring simplified models or empirical approximations for interactivity.

### Competing & Alternative Terminology
`Wet Ink Simulation`, `Digital Watercolor/Painting`, `Non-Photorealistic Rendering (NPR)`, `Capillary Action`, `Feathering/Bleeding`, `Edge Darkening (Coffee Ring Effect)`, `Backruns/Blooms/Cauliflowers`, `Kubelka-Munk Model`, `Shallow-Water Fluid Simulation`, `Float32 Textures`

# Wet Ink als RTE-Plugin: Konzept, Architektur & Ökosysteme

**Ein Satz:** Wie man die physikalische Tintensimulation (Kapillarfluss, Edge Darkening, Granulation) als leichtgewichtiges Plugin in moderne Open-Source Rich-Text-Editoren und Infinite-Canvas-Werkzeuge einbettet.

**Stand:** September 2026 · **Status:** Architektur-Dokumentation & Spezifikation  
**Bezug:** Dose #10 (`05-dosen/wet-ink.md`) · Implementierungsplan (`00-quelle/wet-ink-plan.md`)

---

## 1. Prämisse: Warum Fluid-Physik in einem Texteditor?

Standardmäßige Freihand-Werkzeuge in digitalen Editoren (Apple Pencil auf iPad, Excalidraw, Notion-Skizzen) erzeugen glatte Bézier-Vektorkurven mit gleichmäßiger Opazität. Sie wirken steril wie CAD-Pfade.

Echte Tinte auf Papier hat drei fundamentale Eigenschaften, die kein Vektor-Renderer liefert:
1. **Substrat-Reaktion:** Die Tinte interagiert mikroskopisch mit dem Papier (Feathering entlang der Zellulosefasern).
2. **Zeitliche Dynamik:** Ein Strich trocknet über mehrere Sekunden ein. Zuerst glänzt der flüssige Wasserfilm, dann wandern Pigmente an die Verdunstungskante (*Edge Darkening*).
3. **Lasur-Überlagerung:** Wo zwei Striche sich kreuzen, entsteht kein simples 50%-Alpha-Matschgrau, sondern eine optische Pigmentverdichtung nach Kubelka-Munk.

### Wo das in Editoren gebraucht wird
* **Korrektur-Marginalia & Rotstift:** Anmerkungen, Unterstreichungen und Ausstreichungen im Textsatz, die sich optisch organisch mit der Buchseite verbinden.
* **Der signierte Dokument-Block:** Digitale Unterschriften, die nicht wie aufgeklebte PNGs aussehen, sondern sichtbar in die Papierkörnung des Dokuments einsickern.
* **Kalligrafische Initialen & Zierabsätze:** Handgezeichnete Drop-Caps, Buchschmuck und Sumi-e-Tuscheskizzen zwischen Fließtext-Absätzen.
* **Das haptische Notizbuch:** Tagebuch-, Zettelkasten- und Geisteswissenschaften-Software (Obsidian, Logseq), in der Gedanken haptische Verankerung suchen.

---

## 2. Drei Integrationsmuster im Rich-Text-DOM

Ein RTE rendert Absätze, Überschriften und Listen als DOM-Knoten. Für Wet Ink existieren drei saubere Integrationsformen:

```
Muster A: Atomarer Block          Muster B: Margin-Overlay         Muster C: Ephemeres Trocknen
┌─────────────────────────┐      ┌───────┬─────────────────┐      ┌─────────────────────────┐
│ Fließtext Absatz        │      │   🖋   │ Fließtext       │      │ Getippter Text oder     │
├─────────────────────────┤      │ (Rand)│ Korrekturlesung │      │ Freihand-Initial        │
│ [ Wet-Ink-Canvas-Block] │      │       │ mit Ausstreichung│     │ [glänzt nass -> trocknet]│
├─────────────────────────┤      └───────┴─────────────────┘      ├─────────────────────────┤
│ Nächster Absatz         │      (Transparenter Layer über Text)  │ Friert als Bitmap ein   │
└─────────────────────────┘                                       └─────────────────────────┘
```

### Muster A: Der atomare Block (`Inline / Block NodeView`)
* **Verhalten:** Verhält sich wie ein Bild- oder Formel-Block (`$$ \LaTeX $$`), ist aber interaktiv.
* **Einsatz:** Unterschriften-Felder, Skizzenkästen, Zierinitialen.
* **Fokus:** Klick/Fokus öffnet die Werkzeugleiste (Feder, Sumi-Pinsel, Tintenton).

### Muster B: Der Randnotizen-Layer (`Margin & Overlay Plugin`)
* **Verhalten:** Ein z-index-entkoppelter Canvas liegt über oder neben dem Textfluss.
* **Anker:** Koordinaten werden an Block-IDs (`data-node-id="p-42"`) gebunden. Fließt der Text nach unten, transformieren die Tintenspuren mit.
* **Einsatz:** Lektorat, Annotationen, handschriftliche Glossen.

### Muster C: Ephemeres "Live-Drying" mit Freeze-State
* **Verhalten:** Während der Stift zeichnet, läuft die Simulation bei 60 FPS. Nach Abschluss verdunsten die Wasserreste innerhalb von 4 Sekunden. Sobald das Wasser verdunstet ist, wird der Zustand in ein statisches `ImageBitmap` gebacken und die Simulationsschleife gestoppt.
* **Einsatz:** Performance-Garantie für lange Dokumente mit Dutzenden Zeichnungen.

---

## 3. Ökosystem-Analyse: Die besten Open-Source-Ziele

### Ziel 1: TipTap / ProseMirror *(Der Industriestandard)*
* **Relevanz:** TipTap ist heute das dominierende Headless-Framework (genutzt von GitBook, GitLab, unzähligen Notion-Alternativen). ProseMirror liefert das deterministische State-Modell.
* **Integrationsweg:**
  * Implementierung als **Custom TipTap Node** (`WetInkExtension`).
  * Eigener `NodeView` (z. B. via `@tiptap/react` oder Plain JavaScript).
  * HTML-Speicherung:
    ```html
    <figure class="wet-ink-block" data-paper="buetten" data-pigment="sepia" data-seed="1042">
      <img src="data:image/png;base64,..." alt="Wet Ink Signature" />
      <script type="application/json" class="wet-ink-raw">
        {"strokes": [...], "params": {...}}
      </script>
    </figure>
    ```
* **Vorteil:** Läuft in jeder modernen Web-App ohne Framework-Lock-in.

### Ziel 2: tldraw *(Der Open-Source Infinite Canvas)*
* **Relevanz:** tldraw ist das modernste kollaborative Whiteboard im Web.
* **Integrationsweg:**
  * Implementierung als benutzerdefinierter Shape (`WetInkShapeUtil`).
  * Ersetzt das bisherige monotone Vektor-Pinsel-Tool durch eine physikalische Texturschicht.
  * Bounding-Box-optimiert: Die Fluidsimulation läuft nur innerhalb der umschließenden Box des Shapes, nicht auf der gesamten unendlichen Fläche.
* **Vorteil:** Natürliche Stift-Unterstützung (Apple Pencil, Wacom, Touch) mit Druck und Neigung ist in tldraw bereits erstklassig implementiert.

### Ziel 3: Obsidian (Community Plugin)
* **Relevanz:** Obsidian hat eine der engagiertesten Communities für haptisches Schreiben, Kalligrafie und Zettelkasten-Ästhetik.
* **Integrationsweg:**
  * Markdown Code-Block-Processor:
    ````markdown
    ```wet-ink
    paper: washi
    pigment: sumi
    preset: signature
    strokes: eJzt1zEOgCAMAMD/kDYs... (komprimierte Koordinaten)
    ```
    ````
  * Live-Vorschau rendert sofort den nassen/getrockneten Block; Klick öffnet das Zeichenfeld.
* **Vorteil:** Hohe virale Verbreitung in der Digital-Gardening- und Writer-Szene.

### Ziel 4: Lexical (Meta)
* **Relevanz:** Moderner Nachfolger von Draft.js, extrem performant und barrierefrei.
* **Integrationsweg:** Als `DecoratorNode` (`WetInkNode`), der einen Canvas-Container mit isoliertem Event-Handling instanziiert.

---

## 4. Das Performance- & Lifecycle-Problem (und seine Lösung)

Ein naiver Einbau würde 15 aktive WebGL/Canvas-Simulationen auf einer Seite halten. Das würde den Lüfter jedes Laptops aufheulen lassen und den Akku leeren.

Deshalb ist das **Drei-Phasen-Lebenszyklus-Modell** zwingend:

```
[INTERACTION]                [SETTLING]                   [FROZEN DORMANT]
Stift berührt Canvas   ──>   Stift abgehoben        ──>   Wasser verdunstet
- 60 FPS Physik-Loop         - 30 FPS Abklingen           - 0 FPS (Loop gekillt!)
- Druck & Advektion          - Edge Darkening finalisiert - Offscreen ImageBitmap
- Fluid-Zellen aktiv         - Verdunstungsphase (t < 5s) - 0% CPU / 0% GPU
                             ▲
                             │ (Klick zum Wiederaufnehmen)
                             └─────────────────────────────
```

1. **Phase 1: WET (Interaktiv, 60 FPS)**
   - Startet nur in der fokussierten NodeView.
   - Puffer laufen aktiv (Geschwindigkeit, Advektion, Kapillartransfer).
2. **Phase 2: SETTLING (Eintrocknen, ~3–5 Sekunden)**
   - Sobald keine neuen Eingaben erfolgen, stoppt die Strömungsberechnung.
   - Nur noch die Verdunstung und das finale Edge Darkening laufen bis zum Schwellenwert $water < 0.001$.
3. **Phase 3: FROZEN (Ruhezustand, 0 FPS)**
   - `cancelAnimationFrame` beendet die Schleife vollständig.
   - Die getrocknete Schicht wird in ein `ImageBitmap` oder ein statisches `HTMLCanvasElement` übertragen.
   - Beim normalen Scrollen, Lesen oder Tippen im Editor verbraucht der Block exakt so viel Ressourcen wie ein gewöhnliches `<img>`-Tag.
4. **Rehydration:** Klickt der Nutzer den Block erneut mit dem Stift an, wird der getrocknete Zustand zurück in die Float-Puffer geladen und neues Wasser kann aufgetragen werden (was wiederum Backruns/Blumenkohlkanten auf den alten Spuren erzeugt!).

---

## 5. Serialisierung: Wie speichert man nasse Tinte?

Ein Editor-Dokument muss als JSON oder Markdown speicherbar, kopierbar und versionierbar sein.

### Das Duale Speicher-Modell

Ein Wet-Ink-Block speichert zwei Dinge gleichzeitig:

1. **Die Event-Quelle (Kompakt, deterministisch, editierbar):**
   * Seed des Papiers (z. B. `seed: 42`)
   * Konfigurations-IDs (`paper: "washi"`, `pigment: "sepia"`)
   * Vektor-Ereignisstrom: Delta-kodierte Strichdaten `[x, y, pressure, dt]`.
   * Größe: Nur **1 bis 4 Kilobyte** pro Zeichnung.
   * Vorteil: Beliebig verlustfrei auf andere Auflösungen re-skalierbar (z. B. für hochauflösenden Druck).

2. **Das gebackene Rendering (Kompatibel, portabel, offline):**
   * PNG-Data-URL oder Referenz auf Bilddatei.
   * Vorteil: Wenn das Dokument als PDF gedruckt, exportiert oder in einem Editor ohne Wet-Ink-Plugin geöffnet wird, sieht man sofort das fertige, getrocknete Kunstwerk.

### Die ehrliche Antwort zum SVG-Export (aus dem Plan)
* Wie im 12-Tage-Plan festgehalten: Eine Fluid-Simulation ist rasterbasiert.
* Ein naiver Vektorisierer erzeugt Millionen Dreiecke.
* **Die saubere Plugin-Lösung:** Marching Squares auf 3 bis 5 Iso-Dichte-Schwellenwerten erzeugt geschichtete Vektorkonturen. Das wird im Editor als **„Siebdruck- / Risographie-Vektor-Export"** deklariert — stilistisch wunderschön, ehrlich und passend für Plotter oder Vektor-Layout-Programme.

---

## 6. Paket-Architektur für ein Open-Source-Projekt

Wenn man das Projekt als Open-Source-Ökosystem ausrollt, empfiehlt sich ein Monorepo mit drei Schichten:

```
packages/
  ├── @wet-ink/core            # Reine TypeScript-Simulation (kein React, kein DOM-Lockin)
  │     ├── paper/             # fBm-Generator, Fasern, Capacity-Maps
  │     ├── sim/               # Kapillarfluss, Edge Darkening, Granulation
  │     └── render/            # Optisches Compositing, Freeze-to-Bitmap
  │
  ├── @wet-ink/tiptap          # TipTap / ProseMirror Extension
  │     ├── WetInkNode.ts      # Schema, Parsing, Serialisierung
  │     └── WetInkView.tsx     # React/DOM NodeView mit Lifecycle & Toolbar
  │
  ├── @wet-ink/tldraw          # tldraw Shape-Erweiterung
  │     └── WetInkShapeUtil.ts # Bounding-Box Shape mit Druckdynamik
  │
  └── @wet-ink/obsidian        # Standalone Obsidian Community Plugin
        └── main.ts            # Markdown Codeblock Processor
```

---

## 7. Fazit & Handlungsfeld

Wet Ink als RTE-Plugin schließt eine Lücke, die seit Jahren zwischen sterilen Vektor-Notiz-Apps und teurer Desktop-Spezialsoftware (wie Rebelle) klafft.

Weil unser Engine-Kern:
- **unter 15 kB groß ist**,
- **keine schweren 3D-Engines (wie Three.js) benötigt**,
- **auf reinem TypeScript und 2D/Float-Buffern basiert**,
- **und dank des 3-Phasen-Lifecycle im Ruhezustand 0% CPU verbraucht**,

ist er der ideale Kandidat für ein **TipTap-** oder **tldraw-Plugin**, das Dokumenten im Web endlich die haptische Tiefe echter Tinte zurückgibt.

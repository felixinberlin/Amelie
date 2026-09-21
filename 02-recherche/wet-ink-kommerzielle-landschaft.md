# Recherche: Kommerzielle Landschaft für Fluid-Tinte & digitale Aquarell-Physik

**Thema:** Kommerzielle Software, Plugins und Pinsel-Ökosysteme für Tinte und Aquarell — und warum die Bereitstellung als freies, quelloffenes Web-Plugin (CC0 / MIT) eine Marktlücke sprengt.

**Stand:** September 2026 · **Autor:** Félix (Berlin) · Amélie-Projekt  
**Bezug:** Dose #10 (`05-dosen/wet-ink.md`), Masterplan (`00-quelle/wet-ink-plan.md`), RTE-Architektur (`04-werkzeug/wet-ink-rte-plugin.md`)

---

## 1. Marktüberblick: Wer verkauft diese Physik bisher und zu welchem Preis?

Die Simulation von porösen Substraten, Kapillarkräften und Pigment-Advektion ist seit 30 Jahren akademisch erforscht (Curtis et al. 1997, Chu & Tai 2005). Dennoch existiert sie im kommerziellen Markt fast ausschließlich als **proprietäre Desktop-Silos**, **teure Abonnements** oder **starre Bitmap-Stempel**:

| Produkt / Anbieter | Preismodell | Typ & Plattform | Technische Realität & Einschränkungen |
|---|---|---|---|
| **Escape Motions: Rebelle 8** | **89,99 $ – 149,99 $** (Einmalkauf) | Desktop (Windows / macOS) | **Goldstandard für Fluid-Physik.** Echte Navier-Stokes-Wasserverteilung, Pigmentgranulation, Farbverläufe. Aber: Geschlossenes proprietäres C++-Desktop-Programm. Keine Web-Version, kein SDK, nicht in andere Apps oder Editoren einbettbar. |
| **Adobe Fresco / Creative Cloud** | **9,99 $/Monat** oder im CC-Abo (~**65 $/Monat**) | iPad / Windows Surface | **„Live Brushes".** Tolle visuelle Aquarell-Verwaschungen, aber an Adobe Cloud, Adobe ID und native Mobil-Apps gebunden. Keine offene API, kein Export der Simulationsdaten, proprietär. |
| **Expresii (Nelson Chu)** | **69,00 $** (Desktop-Lizenz) | Windows Desktop (DirectX 11) | Basierend auf der SIGGRAPH-Forschung *MoXi* (Chu & Tai 2005). Hervorragende ostasiatische Tusche-Physik. Reines Standalone-Malprogramm, extrem GPU-lastig, keine WebGL/Web-Integration. |
| **Corel Painter 2024** | **429,00 $** oder **199 $/Jahr** | Desktop (Windows / macOS) | „Real Watercolor" & „Digital Watercolor". Sehr ressourcenhungrig, historisch gewachsene Codebasis, keine modernen Web-Standards. |
| **Procreate & Photoshop Brush Packs** (GrutBrushes, MaxPacks, Kyle Webster) | **15 $ – 45 $** pro Brush-Set | Add-on Packs | **Die große Illusion:** Das sind keine Fluid-Simulationen! Es sind Bitmap-Stempel mit PNG-Rändern, Smudge-Tool-Tricks und Körnungs-Overlays. Ein Strich weiß nichts von den Fasern des Nachbarstrichs; kein echtes Edge Darkening, kein Backrun. |
| **Digitale Signatur-SaaS** (DocuSign, Adobe Sign, PandaDoc) | **10 $ – 40 $/Nutzer/Monat** | Web-SaaS | Unterschriften sind leblose, uniforme schwarze SVG-Pfade. Null Haptik, kein Papiereinsickern, sofort als digitale Kopie erkennbar. |

---

## 2. Die Anomalie: Warum gibt es das nicht frei im Web?

1. **Die Physik gilt als „zu schwer für den Browser":** Viele Entwickler glauben fälschlicherweise, man brauche 2 GB VRAM und C++/Compute-Shader. Der *Wet Ink*-Masterplan beweist: Auf einem optimierten 384×256 Float32-Gitter läuft die 7-Pass-Simulation mit < 2 ms pro Schritt auf jeder modernen Mobil-CPU.
2. **Die Verwechslung von Malprogramm und Physik-Kernel:** Kommerzielle Anbieter bauen immer ein ganzes Zeichenprogramm (Ebenen, Farbräder, UI-Leisten, PSD-Export). Sie verkaufen die Schale, nicht den Kern.
3. **Der falsche Algorithmus („Rauch-Bug"):** Wer naiv eine Navier-Stokes-Fluid-Gleichung implementiert, bekommt weichen Rauch statt Tinte. Weil die Kapillarschwelle ($\varepsilon_{\min}$) in den Standard-Lehrbüchern nicht hervorgehoben wird, scheitern Open-Source-Versuche meist nach Phase 1.

---

## 3. Die Amélie-Strategie: Verschenken als freie Infrastruktur

Wir bauen kein 150-Dollar-Malprogramm. Wir verschenken die **Infrastruktur als leichtgewichtiges npm-Paket (`@wet-ink/core`)**:

* **Lizenz:** CC0 / Public Domain / MIT — bedingungslos frei für die Welt.
* **Format:** Framework-freie TypeScript-Library (< 15 kB komprimiert), ohne Three.js oder WebAssembly-Zwang.
* **Einsatzgebiet:** Direkt einbettbar als Plugin in:
  - **TipTap / ProseMirror** (Rich-Text-Marginalien, echte Tintensignaturen in Dokumenten)
  - **tldraw** (Haptischer Tusche-Pinsel auf kollaborativen Whiteboards)
  - **Obsidian / Logseq** (Handschriftliche Zettelkasten-Einträge und Skizzen)
  - **Webbasierte E-Signaturen** (Echte, eintrocknende Eisengallus-Unterschriften statt toter Vektoren).

Damit wird eine Technologie, für die Großkonzerne monatliche Abonnements verlangen, zu einem frei verfügbaren Baustein des offenen Webs.

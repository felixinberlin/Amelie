---
status: Available
delivery_method: E-Mail
target_maker: Escape Motions
review_score: 32/35
architecture_tier: Tier 1
source_type: Type D
---
# Wet Ink

**Ein Satz:** Tinte auf Papier als echte Simulation — Kapillarfluss, Bleeding, Faser-Anisotropie, Edge Darkening. Eine Physik, tief statt breit.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Verdikt:** 🔒 **behalten** — aber der **Plan** wird verschenkt  
**Review:** 32/35 · Tier 1 · Type D (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))
**Empfänger des Plans:** Escape Motions (Rebelle), Kalligrafie- und Sumi-Szene, WebGL-Demoszene, Lehre (Grafik-Seminare)

---

## Warum diese Dose anders ist

Hier wird nicht die Idee verschenkt, sondern die **Karte**. Das Ding selbst baue ich.

Das ist kein Widerspruch zu Amélie, sondern die Anwendung von Regel 5: Wer nur verschenkt, baut nie. Zwei Ideen bleiben, das hier ist eine davon — weil es zwölf Tage dauert, keine Infrastruktur braucht und ab Tag drei etwas zu sehen ist.

Verschenkt wird trotzdem etwas Reales: **ein durchgerechneter Implementierungsplan**, den es so nirgends gibt — inklusive CPU-Referenzimplementierung zur Testbarkeit von GPU-Kerneln, visueller Regressionstests und einer ehrlichen Warnung vor dem SVG-Export. Das ist für jemanden, der Ähnliches vorhat, mehr wert als die Idee.

## Das Problem (für die Empfänger des Plans)

Fünf Effekte unterscheiden echte Tinte von einem Photoshop-Filter: Feathering entlang der Fasern, Edge Darkening am getrockneten Rand, Backruns bei nass-auf-feucht, Granulation in den Papiertälern, Dry Brush über die Papierberge. Alle fünf fallen aus Physik heraus, wenn man sie richtig modelliert — und aus keiner Textur, wenn man es nicht tut.

Der Fallstrick, an dem solche Projekte sterben, ist benennbar und steht im Plan: **Ohne Kapillarschwelle wird alles weich und wolkig.** Es sieht dann aus wie Rauch, nicht wie Tinte. Deshalb kommt Feathering (P2) vor Strömung (P3) — eine Reihenfolgeentscheidung, die man normalerweise erst nach zwei verlorenen Wochen trifft.

## Warum das jetzt geht

1. **WebGL2 mit Float-Texturen** macht drei gekoppelte Simulationsschichten in Echtzeit im Browser möglich — vorher Desktop-Software.
2. **Kubelka-Munk statt Alpha-Blending** ist der Unterschied zwischen „sieht aus wie Tinte" und „sieht aus wie ein Filter": Lagen überlagern sich wie echte Lasuren.
3. **Testbarkeit ist gelöst, aber niemand schreibt es auf.** Der Trick — jeden Kernel zweimal implementieren, einmal als Shader und einmal als langsame CPU-Schleife, und beide auf 32×32 vergleichen — ist der Grund, warum das Projekt in zwölf Tagen machbar ist statt in drei Monaten Blindflug.

## Skizze

Drei Schichten als Float-Texturen: Papier (Höhe, Faserrichtung, Kapazität), Oberflächenwasser (Höhe, Geschwindigkeit, gelöstes Pigment), Faserschicht (Sättigung, deponiertes Pigment — das, was man sieht).

Sieben Passes pro Schritt, Reihenfolge zählt: Input → Velocity → Divergenz-Relaxation → Advektion → **Kapillarfluss mit Schwelle** → Transfer → Verdunstung. Edge Darkening fällt aus Schritt 7 von selbst heraus, wenn man es nicht erzwingt.

Der vollständige Plan mit Phasen, Tests, Risiken und Lesestoff: `wet-ink-plan.md`.

## Erster Schritt

**Ticket #1: `@wet-ink/core` — Headless Fluid-Kernel & TipTap/RTE Signatur-Block.**
Eine framework-freie TypeScript-Engine (< 15 kB komprimiert) mit 7-Pass-Simulation, Kapillarschwelle $\varepsilon_{\min}$ und 3-Phasen-Lifecycle (*Nass 60 FPS* $\rightarrow$ *Trocknen 3s* $\rightarrow$ *0 FPS Ruhezustand / 0% CPU*). Lauffähig als quelloffenes Drop-in-Plugin in TipTap/ProseMirror, tldraw und Web-Formularen — ohne 150-Dollar-Lizenz, ohne Serverkosten und ohne native Desktop-Binaries.

**Fertig wenn:** Ein Strich auf Washi-Papier sichtbar entlang der Fasern ausfranst, am Rand durch Verdunstung nachdunkelt, nach 3 Sekunden einfriert und in einem Rich-Text-Dokument als serialisierbarer Block mit 0% CPU-Last ruht.

## Wo es kippt

**„Sieht aus wie Rauch, nicht wie Tinte"** ist der wahrscheinlichste Ausgang, und die Gegenmaßnahme ist eine Reihenfolge, keine Technik: Kapillarschwelle zuerst.

**Tuning frisst das Projekt.** Fünfzehn gekoppelte Parameter; ohne Debug-Panel ab P1 und Preset-Export ab P2 verliert man jede gute Einstellung wieder.

**Der SVG-Export ist das schwächste Glied.** Eine Fluidsimulation ist raster. Was geht, ist Marching Squares auf mehreren Iso-Leveln — eine gebänderte Vektorform. Das ist ein **Stil**, keine Reproduktion, und es muss früh so kommuniziert werden, sonst erzeugt es Enttäuschung.

## Wer es schon versucht hat

**Escape Motions / Rebelle** macht seit Jahren echte Fluid-Aquarellsimulation, aktuell in Version 8.3 — Desktop, kommerziell, sehr gut. Das ist kein Grund, es nicht zu bauen, sondern der Grund, warum sie Empfänger des Plans sind: Eine WebGL2-Variante ist keine Konkurrenz, sondern eine Demonstration, dass diese Physik im Browser läuft.

Akademisch ist das Feld gut bestellt und offen zugänglich: Curtis et al. (SIGGRAPH 1997) für das Schichtenmodell, Chu & Tai („MoXi", SIGGRAPH 2005) für Tinte in saugendem Papier, Stam („Stable Fluids", 1999) für die Advektion. **Die Papers sind nicht das Problem. Die Implementierungsreihenfolge ist es** — und die steht in keinem davon.

## Wie der Plan verschenkt wird

Nicht jetzt. **Sobald P2 läuft und ein GIF existiert**, das gerichtetes Feathering auf Japanpapier zeigt: Plan als Blogpost oder Gist veröffentlichen, das GIF ist der Verteiler. Vorher ist es eine Behauptung, nachher ein Beleg.

---

Der Plan gehört niemandem. Nimm ihn, bau danach, verkauf das Ergebnis — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

# Kristallwachstum 3D

**Ein Satz:** Nicht noch ein DLA-Renderer, sondern die druckfertige Kette dahinter — Parameter, Seed, wasserdichtes Mesh, Stützstruktur-taugliche Geometrie, teilbares Rezept.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Nervous System (Jessica Rosenkrantz & Jesse Louis-Rosenberg) · nachrangig: Printables/Prusa-Community, Mineralogie-Lehre
**Verdikt:** 🎁 verschenken — verengt, siehe unten

---

## Das Problem

Diffusion-limited aggregation ist der meistimplementierte schöne Algorithmus der Generative-Art-Szene. Fast alle Implementierungen enden am selben Punkt: **ein Bild oder ein Punktwolken-Render.**

Von dort bis zu einem Objekt, das ein Drucker tatsächlich ausgibt, liegt die eigentliche Arbeit, und die macht kaum jemand: aus dem Aggregat ein wasserdichtes Mesh machen, Astdurchmesser so steuern, dass dünne Zweige nicht abbrechen, Überhänge begrenzen, Stützstrukturen vermeidbar machen, Skalierung physisch sinnvoll halten. Das ist unspektakuläre Geometrie-Arbeit, und sie ist der Grund, warum es Tausende DLA-Bilder und sehr wenige DLA-Objekte gibt.

Wer leidet: die Maker-Szene, die den Algorithmus kennt und an der Druckbarkeit scheitert — und die Lehre, die Dendritenwachstum erklären will und nur Abbildungen hat.

## Warum das jetzt geht

1. **3D-DLA in Echtzeit mit Live-Parametern** läuft heute auf der GPU. Der Rechenteil, der das früher zu einem Batch-Job machte, ist weg.
2. **Mesh-Reparatur und Wandstärkenprüfung sind als Bibliotheken verfügbar** — der Teil, der früher eigene Forschung war.
3. **Die Verteilkette existiert:** Druckplattformen mit Parameter-Remix, in denen ein Generator samt Seed geteilt werden kann. Ein Objekt ist dort nicht mehr nur eine Datei, sondern ein **Rezept**.

## Skizze

- 3D-DLA mit Live-Parametern: Stickiness, Partikeldichte, Richtungs-Bias (isotrop → dendritisch), Verzweigungswinkel.
- **Physische Zwangsbedingungen als Regler, nicht als Nachbearbeitung:** minimale Astdicke, maximaler Überhangwinkel, Zielgröße in Millimetern. Wer an ihnen dreht, sieht das Wachstum sich ändern, nicht das Ergebnis repariert.
- Export: GLB zum Anschauen, STL/3MF wasserdicht zum Drucken.
- **Seed + Parameter = das Rezept.** Ein String, den man teilen kann und der exakt dasselbe Objekt reproduziert. Das ist der eigentliche Gegenstand des Projekts.

**Nicht dabei:** kein Slicer, kein Shop, keine Galerie-Plattform. Der Generator geht dorthin, wo die Leute schon sind.

## Erster Schritt

**Ticket: Ein Seed, ein druckbares Objekt.**

3D-DLA mit fester Parametrierung, Mesh erzeugen, Wasserdichtheit prüfen, STL exportieren, **tatsächlich drucken**.

**Fertig, wenn:** das Ding aus dem Drucker kommt, ohne dass ein Ast abgebrochen ist — und derselbe Seed dasselbe Objekt nochmal erzeugt.

## Wo es kippt

**Die ehrliche Schwäche dieser Dose: der schöne Teil ist längst gemacht, der nützliche ist Fleißarbeit.** Wer das baut, verbringt 20 % der Zeit mit Wachstum und 80 % mit Geometrie-Sanierung. Wer das nicht weiß, hört nach dem ersten hübschen Render auf — und genau deshalb gibt es so viele erste hübsche Renders.

**Zweites Risiko:** DLA-Objekte sehen einander ähnlich. Nach zwanzig Seeds ist die Formensprache erschöpft. Das spricht dafür, den Richtungs-Bias und die Randbedingungen als Hauptregler zu behandeln — dort liegt die Varianz, nicht im Zufall.

## Wer es schon versucht hat

Recherche September 2026, und das Ergebnis verengt diese Dose deutlich: **DLA-Implementierungen sind im Überfluss vorhanden** — 2D-Morphogenese-Experimente, webbasierte 3D-DLA-Labore, Grasshopper-Definitionen, Blender-Workflows, Skript-Sammlungen. Als „neuer Generator" ist die Idee tot.

**Was ich nicht gefunden habe, ist die Druckkette als Produkt:** physische Zwangsbedingungen als Wachstumsparameter, garantierte Wasserdichtheit, Seed-als-Rezept zum Teilen. Die Dose ist deshalb umgeschrieben — sie handelt jetzt vom langweiligen Teil, weil der der freie ist.

Wer sie nimmt, sollte wissen: Der Neuigkeitswert liegt nicht in der Simulation. Er liegt darin, dass am Ende etwas auf dem Tisch steht.

## Vorarbeit

- **Nervous System** — macht seit 2007 nichts anderes als generatives Design → 3D-Druck, von Schmuck bis Lunge. Sie haben genau die Geometrie-Erfahrung, an der andere scheitern.
- Vorhandene **DLA-Implementierungen** (2D und 3D, offen verfügbar) — der Wachstumsteil muss nicht neu geschrieben werden.
- **Printables / Prusa-Community** — Generator-Projekte mit Seed-Sharing, regelmäßige Wettbewerbe.
- **Mineralogie-Lehre** — DLA erklärt Dendritenwachstum besser als jede Abbildung. In Berlin: TU, Museum für Naturkunde.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

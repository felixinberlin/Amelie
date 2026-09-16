# Tarot als Zustandsmaschine

**Ein Satz:** Ein Legesystem ist bereits ein Programm — Positionen sind Slots, Karten sind typisierte Übergänge, Bedeutung ist eine Funktion der Nachbarschaft. Es wurde nur nie so aufgeschrieben.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Indie-Game-Devs (Kartenspiel-Engines) · nachrangig: Deck-Künstler:innen auf Crowdfunding-Plattformen, Labyrinthos, Lehre („Zustandsmaschinen für Nicht-Informatiker:innen")
**Verdikt:** 🎁 verschenken **als Spezifikation**, nicht als App — verengt, siehe unten

---

## Das Problem

Legesysteme werden seit zweihundert Jahren in Prosa weitergegeben: „Karte 1 ist die Situation, Karte 2 kreuzt sie, Karte 3 ist die Grundlage." Das ist eine Spezifikation, aber eine unpräzise — die interessanten Regeln stehen nie drin:

- Was heißt „kreuzt"? Eine Beziehung zwischen zwei Slots, mit Richtung und Typ — nirgends formalisiert.
- Wie ändert eine umgekehrte Karte die Bedeutung ihrer **Nachbarn**? Jede Leserin weiß, dass sie das tut. Kein System schreibt es auf.
- Wie unterscheidet sich dasselbe Legesystem zwischen zwei Decks mit verschiedener Kartenanzahl?

Die Folge: Jede Tarot-App implementiert Legesysteme fest verdrahtet. Ein neues Legesystem heißt neuer Code. Ein Deck mit eigenen Karten heißt neue App.

Wer leidet: Deck-Künstler:innen, die nicht programmieren können und für ihr Deck einen digitalen Begleiter wollen — ein ganzes Milieu, das per Crowdfunding Decks produziert und dann an der Software hängenbleibt. Und Indie-Devs, die Kartenmechaniken bauen und jedes Mal bei null anfangen.

## Warum das jetzt geht

Der ehrliche Teil: **Das ging schon immer.** Eine DSL für Legesysteme hätte man 2010 schreiben können. Was neu ist, sind zwei Dinge:

1. **Übersetzung aus Prosa.** Die tausenden in Fließtext beschriebenen Legesysteme lassen sich heute automatisiert in eine formale Struktur überführen — der Bestand wird erschließbar, statt einzeln abgetippt zu werden.
2. **Interpretation als Funktion, nicht als Nachschlagetabelle.** Die Bedeutung einer Karte *in dieser Position, neben dieser Karte, in diesem Deck* war früher nur als vorgeschriebener Text möglich. Jetzt kann sie berechnet werden — was die formale Struktur erst nützlich macht.

## Skizze

Eine kleine Sprache, kein Produkt:

- **Slot:** Position mit Rolle, Koordinate, optionalen Bedingungen.
- **Relation:** gerichtete Kante zwischen Slots — `kreuzt`, `stützt`, `führt zu`, `steht gegen`. Typisiert, damit ein Renderer weiß, wie er zeichnet, und ein Interpreter weiß, wie er liest.
- **Deck-Vertrag:** welche Kartenmenge ein Legesystem voraussetzt, damit ein 78-Karten-System sauber scheitert, wenn ein 40-Karten-Deck kommt.
- **Modifikatoren:** wie Umkehrung und Nachbarschaft die Auswertung ändern — als Regel, nicht als Prosa.
- Zwei Referenzimplementierungen: ein Renderer (Layout fällt aus der Struktur) und ein Interpreter.

**Das Geschenk ist das JSON-Schema plus zwei Beispiele.** Nicht die App. Eine Seite Spezifikation, die jemand in seiner eigenen Sprache umsetzen kann.

## Erster Schritt

**Ticket: Keltisches Kreuz als Datei.**

Das bekannteste Legesystem vollständig formal beschreiben, inklusive der „kreuzt"-Relation, und aus der Datei allein das Layout zeichnen.

**Fertig, wenn:** jemand ein zweites Legesystem hinzufügt, ohne eine Zeile Code zu ändern.

## Wo es kippt

**Überformalisierung.** Tarot lebt von Mehrdeutigkeit; eine Sprache, die jede Nuance erfassen will, wird größer als das Problem und wird von niemandem benutzt. Die Grenze muss hart gezogen werden: **Die DSL beschreibt Struktur, nicht Bedeutung.** Was eine Karte heißt, bleibt Text und Deck-Sache.

**Zweites Risiko, das Milieu:** Ein technisch gedachtes Werkzeug kann in dieser Szene als respektlos gelesen werden — als Reduktion einer Praxis auf Datenstruktur. Die Formulierung entscheidet: Es ist eine **Notation** wie Noten für Musik, kein Ersatz für die Praxis. Wer das falsch rahmt, verliert genau die Leute, für die es gedacht ist.

## Wer es schon versucht hat

Recherche September 2026, und sie verengt diese Dose: Es gibt **Tarot-Datensätze als JSON**, Bibliotheken zum Erzeugen digitaler Decks, offene Reflexions-Engines mit Legesystemen und Journaling, und sogar Websites, die Legesysteme als **Schema** sammeln und vergleichen.

**Was ich nicht gefunden habe:** eine formale, deckunabhängige Sprache für Legesysteme mit typisierten Relationen zwischen Positionen. Die Datenseite (welche Karten gibt es) ist gelöst; die Strukturseite (wie hängen Positionen zusammen) ist es nicht.

Die Lücke ist schmal. Wer das nimmt, sollte prüfen, ob die vorhandenen Schema-Sammlungen nicht schon 80 % davon sind — dann ist die richtige Handlung ein Beitrag dorthin und keine neue Spezifikation.

## Vorarbeit

- Vorhandene **Tarot-JSON-Datensätze** — die Kartenseite muss niemand neu machen.
- **Sammlungen von Legesystem-Schemata** — der beste Startpunkt und möglicherweise der richtige Empfänger.
- **Labyrinthos** — Lern-App mit eigenem Deck und didaktischem Anspruch; eine Notation für Legesysteme ist deren Lehrproblem.
- **Indie-Game-Szene** — Deckbuilder-Engines suchen Karten-als-Regel-Repräsentationen.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

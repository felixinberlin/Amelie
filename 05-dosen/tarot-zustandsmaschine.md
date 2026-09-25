---
status: Available
delivery_method: E-Mail
target_maker: Labyrinthos
review_score: 31/35
architecture_tier: Tier 1
source_type: Type B/D
---
# Tarot als Zustandsmaschine (Spread-DSL)

**Ein Satz:** Ein Legesystem ist bereits ein Programm — Positionen sind Slots mit Koordinaten, Karten sind typisierte Zustände, und Bedeutung entsteht aus gerichteten Relationen. Eine offene JSON-Spezifikation für herstellerunabhängige Spreads.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Labyrinthos (Tina Gong) · Interactive Fiction / Game-Narrative (Twine / Inkle) · nachrangig: Crowdfunding Deck-Künstler:innen
**Verdikt:** 🎁 verschenken als Spezifikation & Schema (nicht als geschlossene App) — verengt auf Beziehungs-Graphen  
**Review:** 31/35 · Tier 1 · Type B/D (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Legesysteme werden seit über zweihundert Jahren in Prosa weitergegeben: *„Karte 1 ist die Situation, Karte 2 kreuzt sie, Karte 3 ist die Grundlage, Karte 4 die Vergangenheit..."* Das ist eine Spezifikation, aber eine unpräzise. Die entscheidenden strukturellen Regeln stehen nie maschinenlesbar drin:

- **Was bedeutet „kreuzt"?** Eine orthogonale geometrische Drehung um 90° auf Z-Ebene 1 sowie eine semantische Konflikt-Relation zwischen zwei Knoten — nirgends formalisiert.
- **Wie ändert eine umgekehrte Karte (Reversal) die Bedeutung ihrer Nachbarn?** Jede Kartenleserin weiß, dass eine Umkehrung nicht nur den Einzelwert kippt, sondern Übergangs-Dynamiken zu Nachbarkarten blockiert.
- **Deck-Inkompatibilitäten:** Wie verhält sich dasselbe System, wenn ein 22-Karten-Deck (nur Große Arkana) oder ein 36-Karten-Lenormand-Deck angelegt wird?

**Die Folge:** Jede Tarot-App und jeder Discord-Bot implementiert Legesysteme als starre, fest verdrahtete Arrays (`cards[0]..cards[9]`). Ein neues Legesystem erfordert neuen Code; ein alternatives Deck erfordert eine neue App. Indie-Künstlerinnen, die physische Decks via Kickstarter finanzieren, scheitern an der Software-Entwicklung digitaler Begleiter.

## Warum das jetzt geht

Der ehrliche Teil: **Eine DSL für Legesysteme hätte man schon 2010 schreiben können.** Was heute den Hebel ansetzt:

1. **LLM- und Agenten-Architekturen (MCP-Server):** Tarot-Engines (`tarot-mcp`, `roxyapi`) binden LLMs an, füttern diese jedoch mit unstrukturierten Prompts. Eine typisierte Graph-DSL ermöglicht es Modellen, relationale Spannungsfelder und kausale Pfade exakt zu analysieren, statt nur isolierte Einzelkarten aufzuzählen.
2. **Generatives Graph-Layout im Browser:** Mit modernen deklarativen CSS-Grid-/SVG-Engines rendert ein Frontend das Layout autonom aus den $(x, y, \theta)$-Slot-Koordinaten, ohne dass Entwickler für jedes neue Legesystem hardcodierte Ansichten bauen müssen.
3. **Automatisierte Extraktion aus Prosa:** Historische Textbeschreibungen hunderter Fachbücher lassen sich heute per Multimodal-Parsing verlässlich in das formale JSON-Schema überführen.

## Skizze

Eine formale Spezifikation (`tarot-spread-v1.json`) auf Basis von JSON Schema (Draft 2020-12):

- **Deck-Contract:** Definiert Voraussetzungen (`minCards`, `requiredArcana`, `allowReversals`). Scheitert sauber, wenn ein 10-Karten-Keltisches-Kreuz mit einem unvollständigen Deck aufgerufen wird.
- **Slots (Knoten):** Position mit eindeutiger ID, Name, Reihenfolge, geometrischem Layout $(x, y, \theta, z)$ und funktionaler Rolle (`querent`, `obstacle`, `foundation`, `outcome`).
- **Relations (gerichtete Kanten):** Typisierte semantische Verbindungen:
  - `crosses`: Orthogonaler Konflikt / unmittelbare Hürde.
  - `grounds`: Fundamentierende unbewusste Wurzel.
  - `crowns`: Bewusste Intention / Überbau.
  - `leads_to`: Zeitlicher oder kausaler Übergang.
  - `mirrors`: Symmetrische Gegenüberstellung.
- **Beispiel-Dateien:** Vollständige deklarative Definition des Keltischen Kreuzes (`celtic-cross.json`) und des 3-Karten-Pfades (`three-card-linear.json`).

**Das Geschenk ist die Spezifikation plus Schemata und Parser-Beispiele.** Keine App, sondern der freie Standard.

## Das Buch zur Dose (Rohrecherche & Spezifikation)

- [Kapitel 1: Foren-Recherche & Community-Bedarfe](../02-recherche/tarot-occult-community-needs.md) — Auswertung von r/tarot, r/occult und Discord: Der Kartenkatalog-Reduktionismus, Blockaden durch Reversals, elementare Würden und proprietäre Deck-Fallen.
- [Kapitel 2: Architektur & Beziehungs-Graph-Modell](../02-recherche/tarot-zustandsmaschine-dsl.md) — Analyse bestehender Tarot-JSON-Kataloge, Labyrinthos, MCP-Server und formale Schemata.
- [Kapitel 3: Open-Source-Scaffolding & Beispiele](../07-demos/tarot-zustandsmaschine/README.md) — Vollständiges JSON Schema (`spread.schema.json`), Keltisches Kreuz und Drei-Karten-Referenz.
- [Kapitel 4: Open-Source-Software-Architektur](../07-demos/tarot-zustandsmaschine/open-source-stack.md) — Empfohlene Open-Source-Bibliotheken (`tarot-json`, `XState v5`, `React Flow`, `Ajv`, `Inkjs`) für lauffähige Graph-Engines.

## Erster Schritt

**Ticket: Kanonisches Keltisches Kreuz als typisierte JSON-Spezifikation (Ticket #01).**

1. Formale JSON-Schema-Definition (`spread.schema.json`) für Deck-Vertrag, Slots und gerichtete Relationen aufsetzen.
2. Das 10-Karten-Keltische-Kreuz als `celtic-cross.json` abbilden (inklusive 90°-Drehung von Slot 2 über Slot 1).
3. Validieren, dass ein generischer Renderer das Keltische Kreuz ohne hardcodierte Stile visualisieren kann.

**Fertig, wenn:** Ein zweites Legesystem (z. B. 3-Karten-Linear oder Hufeisen) rein durch Hinzufügen einer JSON-Datei fehlerfrei gerendert wird und unpassende Decks am `deckContract` abgewiesen werden.

## Wo es kippt

**Überformalisierung vs. intuitive Mehrdeutigkeit.** Tarot lebt von assoziativer Projektion und Symbolik; ein System, das versucht, jede Schattierung esoterischer Bedeutungen in starre Enums zu pressen, erstickt die Praxis. Die Grenze muss eisern eingehalten werden: **Die DSL beschreibt Struktur und Relationen, niemals fixe Textbedeutungen.** Was eine Karte bedeutet, bleibt Sache des Decks und der Leserin.

**Zweites Risiko (Akzeptanz in der Community):** Ein technisches Datenformat kann als kalte Reduktion einer spirituellen Praxis missverstanden werden. Die Positionierung ist entscheidend: Es handelt sich um eine **Notation** (wie Notenlinien in der Musik), nicht um einen Ersatz für menschliche Intuition.

## Wer es schon versucht hat

- **metabismuth/tarot-json & yunruse/tarot:** Haben die 78 Rider-Waite-Karten sauber als JSON katalogisiert — die Kartenebene ist gelöst.
- **fzlzjerry/tarot-mcp & RoxyAPI:** Bieten Keltisches Kreuz als REST- oder MCP-Schnittstelle an, aber nur als flache Text-Templates ohne relationale Topologie.
- **Labyrinthos:** Bietet eine exzellente Sammlung von über 30 Spreads, hält diese jedoch in einer proprietären App verschlossen.

**Lücke:** Eine offene, herstellerneutrale Graph-Notation für Legesysteme, die Deck-Künstlerinnen, Tool-Entwicklern und LLM-Pipelines gleichermaßen als Standard dient.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 1.0 Universal / Public Domain. — Félix, Berlin · github.com/felixinberlin

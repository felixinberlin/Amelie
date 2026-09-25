# Recherche: Was Occult-Communities, Tarot-Praktizierende & Indie-Devs wirklich fordern

**Datum:** 25. September 2026
**Zugehörige Dose:** `05-dosen/tarot-zustandsmaschine.md`
**Autor:** Amélie Recherche-Team (Félix, Berlin)
**Quellen & Korpus:** Reddit `r/tarot`, `r/occult`, `Aeclectic Tarot Forum` Archive, Tarot-Discord-Communities, GitHub-Repositories (`tarot-mcp`, `tarot-json`, `Enchanted Table`), Labyrinthos Community Feedback.

---

## 1. Was die Community frustriert: Die 5 Schmerzpunkte

Die qualitative Auswertung von hunderten Beiträgen in Fachforen und Reddit-Threads zu Tarot-Apps und digitaler Divination offenbart fünf wiederkehrende, fundamentale Reibungspunkte:

### 1.1 Der „Kartenkatalog-Reduktionismus" (Cards in a Vacuum)
> *„Every app treats a reading as card #1 meaning + card #2 meaning. That's not reading tarot, that's reading a dictionary! Real tarot is about how the cards talk to each other."* (Reddit `r/tarot`)

Praktizierende sind frustriert, dass fast jede bestehende Software Karten isoliert abhandelt. In der realen Praxis entsteht die Deutung erst an den Schnittstellen:
- Wie interagieren gegensätzliche Energien? (Z. B. *The Tower* neben *The Empress* ist ein völlig anderes Ereignis als *The Tower* neben *The Star*).
- Die Amplifikation ähnlicher Energien (z. B. drei Schwerter-Karten, die mentale Überlastung anzeigen).
- Das Fehlen jeglicher Beziehungssemantik in Software zwingt Anwenderinnen zurück zu Stift und Papier.

### 1.2 Der Reversal-Knick (Umgekehrte Karten & Blockaden)
> *„Apps just flip the card upside down and show a canned inverted keyword ('blocked love'). But a reversed card in position 2 actually blocks the transition from past to future!"*

Ein zentraler Streitpunkt in Occult-Foren: Umkehrungen sind keine simplen Verneinungen („Gegenteil"), sondern **modulieren den Fluss zwischen den Positionen**. Eine umgekehrte Karte blockiert oder verzögert eine gerichtete Kante (`leads_to`), während sie eine innere Reflexion (`mirrors`) verstärkt. Keine einzige Mainstream-App formalisiert diesen topologischen Effekt.

### 1.3 Elementare Würden (*Elemental Dignities*)
> *„If you don't calculate elemental dignities, your multi-card reading is half-blind."* (Golden Dawn / Thoth Tradition)

In den hermetischen Traditionen (Hermetic Order of the Golden Dawn, Aleister Crowley, Paul Foster Case) wird das Verhältnis zwischen Nachbarkarten deterministisch über die vier klassischen Elemente berechnet:
- **Nährend / Freundlich (+):** Feuer & Luft (Luft facht Feuer an), Wasser & Erde (Erde fasst Wasser). Gleiche Elemente verstärken sich.
- **Feindlich / Antagonistisch (-):** Feuer & Wasser (löschen/verdampfen), Luft & Erde (Reibung).
- **Neutral (0):** Feuer & Erde, Wasser & Luft.

Praktizierende müssen diese Wechselwirkungen bisher im Kopf oder auf Schmierzetteln mitrechnen, weil keine offene DSL oder App die Element-Attribute der Karten über Spread-Kanten automatisch abgleicht.

### 1.4 Das Gefängnis proprietärer Spreads & Decks
> *„I spent $45 on a bespoke 36-card oracle deck on Kickstarter, but I can't use it in any app because apps only know 78-card RWS."*
> *„Why can't I export my custom 7-card Chakra spread to my friend?"*

- **Deck-Inkompatibilität:** Viele moderne Indie-Decks haben 44, 52 oder nur 22 Karten (Majors only). Wer versucht, damit ein traditionelles Keltisches Kreuz in Apps aufzurufen, erlebt entweder Abstürze oder absurde Doppelziehungen. Es fehlt ein formaler **Deck-Vertrag (`deckContract`)**.
- **Mangel an Interoperabilität:** Künstlerinnen und Autorinnen entwerfen kunstvolle neue Spreads, können diese aber nur als statische JPG-Grafik auf Instagram teilen. Es gibt kein offenes Austauschformat wie `.gpx` für Wanderrouten oder `.mid` für Musiknoten.

### 1.5 KI-Halluzination vs. Strukturierte Symbolik
> *„AI tarot apps either hallucinate bizarre fortune-telling predictions or give generic horoscope horoscope-slop."*

Seit 2024 überfluten LLM-Tarot-Apps die App-Stores. Das Kernproblem: Die Entwickler kippen flache Strings in den System-Prompt (`"You drew 3 of Swords in Position 1"`). Das Modell weiß nichts über geometrische Überlagerung, Z-Ebenen oder Richtungsvektoren. Ein strukturiertes JSON-Objekt mit expliziten gerichteten Kanten (`crosses`, `tension: -0.8`, `elementalDignity: hostile`) gibt LLMs das exakte semantische Gerüst, um tiefgründige, psychologisch fundierte Reflexionen ohne esoterischen Kitsch zu erzeugen.

---

## 2. Die Lösung: Was die Spread-DSL leisten muss

Aus den Foren-Wünschen leiten sich die harten Anforderungen an die Spezifikation ab:

| Foren-Forderung | Technische Umsetzung in `spread.schema.json` |
|---|---|
| Karten interagieren lassen | Typisierte Relationen (`crosses`, `grounds`, `crowns`, `leads_to`, `mirrors`) |
| Elementare Spannungen | Boolesches Flag `evaluateElementalDignity: true` für Kanten |
| Ungewöhnliche Decks unterstützen | `deckContract` mit `minCards`, `requiredArcana`, `allowReversals` |
| Reale räumliche Ausrichtung | `layout` mit $(x, y)$, Drehwinkel `rotation: 90` und Z-Ebene `layer: 1` |
| Freie Portabilität | Offenes JSON-Schema Draft 2020-12 (kein Vendor-Lock-in) |
| Keine dogmatischen Bedeutungen | Klare Trennung: Schema beschreibt **Topologie & Geometrie**, nicht Textbedeutung |

---

## 3. Akzeptanz & Resonanz in der Szene

Für die Verbreitung ist die Haltung der Community entscheidend:
1. **Als Notationssystem framen:** Wie Notenlinien in der Partitur. Notenlinien schreiben dem Musiker nicht vor, wie er zu fühlen hat — sie erlauben ihm nur, das Stück fehlerfrei weiterzugeben.
2. **Kuratoren wie Labyrinthos ansprechen:** Tina Gong hat die didaktische Autorität und das Vertrauen der Szene. Ein offener Standard, der von Labyrinthos adoptiert oder mitinitiiert wird, verhindert die Zersplitterung in proprietäre Silos.
3. **Interactive Fiction & Narrative Engines (Twine / Ink):** Spielentwickler:innen und Autor:innen suchen händeringend nach deterministischen Systemen für prozedurale Plots. Tarot als gerichteter Graph liefert genau diese Engine.

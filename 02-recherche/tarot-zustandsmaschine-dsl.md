# Recherche: Tarot-Zustandsmaschine (Spread-DSL & Typisierte Beziehungs-Graphen)

**Datum:** 25. September 2026
**Zugehörige Dose:** `05-dosen/tarot-zustandsmaschine.md`
**Autor:** Amélie Recherche-Team (Félix, Berlin)

---

## 1. Ausgangslage & Bestandsaufnahme

Tarot-Karten und deren Legesysteme (Spreads) werden seit über zwei Jahrhunderten nahezu ausschließlich in narrativer Textprosa dokumentiert:
> *„Karte 1 zeigt die aktuelle Situation. Karte 2 kreuzt sie und bezeichnet die unmittelbare Hürde. Karte 3 bildet die bewusste Krone, Karte 4 die unbewusste Wurzel..."*

Diese Beschreibungen enthalten formale semantische Beziehungen, die in der Software-Entwicklung bisher kaum abgebildet werden:
1. **Slots als typisierte Zustands-Knoten:** Jede Position hat geometrische Koordinaten $(x, y, z)$, Rotationswinkel $\theta$, funktionale Rollen (Subjekt, Hindernis, Katalysator, Telos) und Selektions-Filter (z. B. „nur Große Arkana", „nur Hofkarten").
2. **Kanten als typisierte Relationen:** Beziehungen zwischen Slots sind gerichtet und semantisch distinkt:
   - `crosses` (Konflikt, orthogonale Überlagerung $\theta = 90^\circ$).
   - `grounds` / `subtends` (Fundament/Wurzel $\to$ Gegenwart).
   - `crowns` (Bewusste Intention / Überbau).
   - `evolves_to` / `transitions` (Temporale oder kausale Sequenz).
   - `mirrors` / `opposes` (Symmetrische Reflexion oder Antithese).
3. **Kontextuelle Modifikatoren:**
   - Eine umgekehrte Karte (Reversal) kehrt nicht nur ihre eigene Bedeutung um, sondern modifiziert über die Relation auch die Spannung zu benachbarten Slots (z. B. Blockade des Übergangs).
   - Elementare Würden (*Elemental Dignities* nach der Golden-Dawn-Tradition: Feuer nährt Luft, Wasser löscht Feuer) modulieren Kanten-Gewichte zwischen Nachbarkarten deterministisch.

Bestehende Tarot-Software (Apps, Webseiten, Bots) implementiert Legesysteme jedoch fast ausnahmslos als **statische, festverdrahtete Arrays** (`cards[0]`, `cards[1]`). Jedes neue Legesystem erfordert neuen Code; Decks mit abweichender Kartenzahl führen zu unkontrollierten Abstürzen.

---

## 2. Stand der Technik & Nachbarprojekte (Prior Art)

Ein systematischer Abgleich bestehender Repositories, Schemata und APIs zeigt das genaue Profil der bestehenden Ansätze:

| Projekt / Standard | Was es löst | Was fehlt | Lizenz / Status |
|---|---|---|---|
| **Tarotsmith Spread Schema** (`tarotschema/codex`, `tarotsmith.com/spreads-schema.json`) | Open-Source JSON-Schema (`DefinedTermSet` via Schema.org) mit Positionstexten und Instruktionen. | **Rein flache Text-Templates:** Keine gerichteten topologischen Kanten (`crosses`, `grounds` etc.), keine geometrischen Rotations- oder Z-Ebenen ($\theta = 90^\circ, z=1$), keine Deck-Verträge, keine dynamische Spannungs-/Würden-Berechnung. | Open Data / CC |
| **metabismuth/tarot-json** & **Deckaura Dataset** | 78-Karten-RWS-Katalog (Namen, Bedeutungen, Ränge, Elemente, Bilder, Numerologie). | Reine Datenlisten von Karten; keinerlei Legesystem-Logik, Relationen oder Topologie. | MIT / Open Source |
| **Tarot MCP Server** (`fzlzjerry/tarot-mcp`, `deckaura/tarot-mcp-server`, `tarotoo-mcp-server`, `OracleBone`) | Model Context Protocol Server für KI-Assistenten (Claude Desktop, Cursor); Bereitstellung von Tool-Calls (`draw_card`, `get_meaning`). | Behandeln Spreads als simple Prompt-Strings oder flache Arrays. LLMs erhalten keinen Beziehungs-Graphen und halluzinieren generische Einzelkarten-Horoskope. | MIT / Open Source, 2025/2026 |
| **Cybertarot** (`feckom/cybertarot`, `cybertarot.ai`, `cybertarot.xyz`) | Web- und KI-basierte Tarot-Anwendungen (Cyberpunk-Ästhetik, WebGL/Mobile-Kopplung). | Starre, fest verdrahtete Legesysteme (1-Karte, 3-Karten, Keltisches Kreuz) in Code; keine offene, austauschbare Graph-DSL. | Open Source / Kommerziell |
| **RoxyAPI / AstrologyAPI / KundliAPI** | Kommerzielle REST-APIs mit JSON-Endpoints für Standard-Spreads (Celtic Cross, Three Card). | Starre Endpoints; proprietäre Schemata ohne Relationen-Modell oder Deck-Verträge. | Kommerziell / Closed |
| **Labyrinthos (Tina Gong)** | Erstklassige Didaktik, über 30 kuratierte Spreads mit visueller Führung; Standard-Referenz. | Proprietäre Mobile-App; kein offener Datenaustausch-Standard für Spreads oder Indie-Devs. | Proprietär |
| **Twine (Chris Klimas) & Ink (Inkle / Jon Ingold)** | Standard-Engines für interaktive Fiktion; Knoten/Kanten-Strukturen für Verzweigungen. | Exzellente Laufzeit für Narrative State Machines, aber keine native Tarot-/Spread-Repräsentation. | Open Source |

**Befund:** 
- Die **Karten-Katalogebene** ist durch `tarot-json` und `Deckaura` gelöst.
- Die **Text-Vorlagenebene** wird von `Tarotsmith` rudimentär als Begriffs-Set abgedeckt.
- Was im gesamten Open-Source-Ökosystem **vollständig fehlt**, ist die **relationale Topologie**: Eine typisierte Graph-DSL, die Positionen als Knoten mit $(x, y, \theta, z)$-Geometrie, Beziehungen als gerichtete semantische Kanten mit dynamischer Spannungsmodulation (Elementare Würden, Reversal-Flussblockaden) und Decks über formale Verträge (`deckContract`) spezifiziert.

---

## 2.1 Der Open-Source-Beitrag (Public Domain / CC0)

Dieses Vorhaben ist **keine geschlossene Auftragsarbeit für einen einzelnen Empfänger**, sondern ein **bedingungsloser Beitrag an die gesamte Open-Source-Gemeinschaft**:
1. **Für Open-Source-Entwickler & Frameworks:** Ein universelles Schema (`spread.schema.json`), das in React, Vue, Svelte, Flutter oder Python ohne Anpassung gerendert und validiert werden kann.
2. **Für MCP-Server & KI-Agenten:** Ein strukturiertes Graph-Format, mit dem MCP-Server (wie `tarotoo` oder `fzlzjerry/tarot-mcp`) LLMs mit echten relationalen Spannungsfeldern füttern können, statt nur Einzelkarten aufzuzählen.
3. **Für Game-Designer & Interactive Fiction (Twine / Ink):** Eine deterministische Zustandsmaschine für prozedurale Quests und narrative Dynamiken.
4. **Für Indie-Deck-Künstler:innen:** Ein offenes Standardformat, um eigene Legesysteme zusammen mit physischen Decks maschinenlesbar zu veröffentlichen.

---

## 3. Die Tarot-Spread-DSL: Architektur & Schema-Entwurf

Das Geschenk besteht aus einer schlanken, formalen JSON-Schema-Spezifikation (`tarot-spread-v1.json`) und einem deklarativen Graph-Modell.

### 3.1 Das Kern-Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "TarotSpreadDefinition",
  "type": "object",
  "required": ["id", "name", "deckContract", "slots", "relations"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "deckContract": {
      "type": "object",
      "required": ["minCards"],
      "properties": {
        "minCards": { "type": "integer", "minimum": 1 },
        "requiredArcana": { "type": "string", "enum": ["any", "major_only", "full_78"] },
        "allowReversals": { "type": "boolean" }
      }
    },
    "slots": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "order", "role", "layout"],
        "properties": {
          "id": { "type": "string" },
          "order": { "type": "integer" },
          "role": { "type": "string" },
          "layout": {
            "type": "object",
            "required": ["x", "y"],
            "properties": {
              "x": { "type": "number" },
              "y": { "type": "number" },
              "rotation": { "type": "number", "default": 0 },
              "layer": { "type": "integer", "default": 0 }
            }
          },
          "filter": { "type": "string" }
        }
      }
    },
    "relations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["source", "target", "type"],
        "properties": {
          "source": { "type": "string" },
          "target": { "type": "string" },
          "type": {
            "type": "string",
            "enum": ["crosses", "grounds", "crowns", "leads_to", "mirrors", "opposes", "synthesizes"]
          },
          "tension": { "type": "number", "minimum": -1, "maximum": 1 }
        }
      }
    }
  }
}
```

---

## 4. Zielgruppen & Empfänger-Zuordnung

1. **Labyrinthos (Tina Gong, `faculty@labyrinthos.co`):**
   - **Aufhänger:** Größtes didaktisches Spread-Kompendium; eine herstellerneutrale Spread-Notation entlastet App-Entwickler und ermöglicht es Künstlerinnen, eigene Spreads portabel zu publizieren.
2. **Interactive Fiction & Narrative Tools (Twine / Inkle):**
   - **Aufhänger:** Nutzung von Tarot-Spreads als generative Plot-Generatoren und narrative State Machines in Spielen und Textadventures.
3. **Indie Deck-Creator & Crowdfunding-Maker:**
   - Illustrator:innen, die physische Decks via Kickstarter finanzieren und bisher an der Programmierung digitaler Begleiter scheitern.

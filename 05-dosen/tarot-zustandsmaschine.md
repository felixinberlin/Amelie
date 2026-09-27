---
status: Available
delivery_method: E-Mail
target_maker: Open-Source Tarot & Entwickler-Community
review_score: 31/35
architecture_tier: Tier 1
source_type: Type B/D
---
# Tarot als Zustandsmaschine — Arcana Schema

**Ein Satz:** Legesysteme und Tarot-Readdings erhalten mit **Arcana Schema** einen herstellerunabhängigen, open-source JSON-Schema-Standard (`v2.0.0`) für räumliche Layouts, typisierte Beziehungs-Graphen und Deck-Verträge.

**Stand:** September 2026 · **Prüfen ab:** September 2027  
**Projekt & Docs:** [felixinberlin.github.io/Arcana-schema](https://felixinberlin.github.io/Arcana-schema/) · GitHub: [felixinberlin/Arcana-schema](https://github.com/felixinberlin/Arcana-schema)  
**Empfänger / Outreach:** Reddit Community (`r/tarot`, `r/webdev`, `r/indiegames`, `r/occult`) sowie Indie-Künstler:innen und Game-Engine-Entwickler:innen  
**Verdikt:** 🎁 Veröffentlicht & verschenkt als Open-Source-Spezifikation, npm-Paket (`@arcana-schema/validator`) und interaktiver Schema-Spielwiese (MIT / CC BY 4.0)  
**Review:** 31/35 · Tier 1 · Type B/D (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Legesysteme werden seit über zweihundert Jahren in Prosa weitergegeben: *„Karte 1 ist die Situation, Karte 2 kreuzt sie, Karte 3 ist die Grundlage..."* In Software wurde diese Struktur bisher ad-hoc und fest verdrahtet als starres Array (`cards[0]..cards[9]`) abgelegt. Die entscheidenden strukturellen Regeln blieben verborgen:

- **Was bedeutet „kreuzt"?** Eine orthogonale geometrische Drehung um 90° auf Z-Ebene 1 sowie eine semantische Konflikt-Relation zwischen zwei Knoten — bisher nirgends formalisiert.
- **Wie wirken Reversals auf Nachbarkarten?** Eine Umkehrung kippt nicht nur den Einzelwert, sondern blockiert Übergangs-Dynamiken (`leads_to`) und intensiviert Spiegelungen (`mirrors`).
- **Deck-Inkompatibilitäten:** Wie verhält sich dasselbe System bei einem 22-Karten-Deck (nur Große Arkana) oder 36-Karten-Lenormand-Deck?
- **Fragmentierte Reading-Logs:** Jedes Tagebuch und jede Tarot-App speichert historische Legungen in proprietären Formaten, wodurch Daten unübertragbar bleiben.

## Arcana Schema: Die Architektur

Mit **Arcana Schema (v2.0.0)** existiert nun eine formale, dual-validierte JSON-Spezifikation (Draft 2020-12 & Draft-7) inklusive npm-Validator (`@arcana-schema/validator`):

1. **Clean Separation (`TarotSpreadDefinition` vs. `TarotReading`):** Wiederverwendbare Legesysteme sind strikt von historischen Sitzungsprotokollen getrennt.
2. **Deklarativer Deck-Vertrag (`deckContract`):** Erzwingt Mindestkartenzahlen (`minCards`), geforderte Arcana (`requiredArcana`) und Reversal-Unterstützung vor dem Ziehen.
3. **Geometrische Slot-Koordinaten (`layout`):** Relative Koordinaten $(x, y, \theta, z)$ erlauben autonomes Rendern ohne hardcodiertes CSS pro Legesystem.
4. **Typisierte Beziehungs-Kanten (`relations`):** 9 semantische Kantentypen (`crosses`, `grounds`, `crowns`, `leads_to`, `mirrors`, `opposes`, `clarifies`, `culminates_in`, `adjacent_to`).
5. **Kanonischer Katalog & SDK:** Referenz-Spreads (Single Card, 3-Card, Celtic Cross, Tree of Life) und deterministische Markdown/HTML-Renderer.

## Reddit Post / Community Announcement (Schema-Beispiel)

Der Outreach für die Community erfolgt als strukturiertes Reddit-Announcement mit Minimalbeispiel:

```json
{
  "schemaVersion": "2.0.0",
  "id": "past-present-future",
  "name": "Past, Present, Future",
  "deckContract": { "minCards": 3, "allowReversals": true },
  "slots": [
    { "id": "past", "order": 1, "role": "Past Foundations", "layout": { "x": 0.2, "y": 0.5, "rotation": 0 } },
    { "id": "present", "order": 2, "role": "Present Circumstance", "layout": { "x": 0.5, "y": 0.5, "rotation": 0 } },
    { "id": "future", "order": 3, "role": "Emerging Outcome", "layout": { "x": 0.8, "y": 0.5, "rotation": 0 } }
  ],
  "relations": [
    { "source": "past", "target": "present", "type": "leads_to" },
    { "source": "present", "target": "future", "type": "leads_to" }
  ]
}
```

## Logs & Learnings

1. **Community-Regeln & Modmail-Protokoll (Regel 9 - No AI):**
   - Viele spezialisierte Foren (wie `r/tarot`) verbieten ungeprüften KI-Content streng. Ein direktes, unangekündigtes Posten führt zu Löschung oder Ban.
   - **Learning:** Die Vorab-Kontaktaufnahme über Reddit-Modmail mit transparenter Darlegung (Mensch initiated, AI drafting execution) sichert Regelkonformität und baut gegenseitigen Respekt auf.
2. **Erkenntnis der Schema-Entkopplung:**
   - Ursprünglich wurden Legungsdaten und Spread-Kataloge in einer einzigen Struktur vermischt.
   - **Learning:** Die strikte Trennung von statischen `TarotSpreadDefinition` (v2.0.0) und dynamischen `TarotReading` (v1.0.0) vereinfacht die Semver-Garantien und ermöglicht saubere Schnittstellen für Journal-Apps und LLM-Agenten.
3. **Graph-Topologie schlägt UI-Arrays:**
   - Das Ersetzen von starren Arrays durch geometrische $(x, y, \theta, z)$ Koordinaten und 9 typisierte Relationen erlaubt es generischen Renderern, jedes beliebige Legesystem ohne neuen Frontend-Code darzustellen.

## Das Buch zur Dose & Demos

- [Kapitel 1: Foren-Recherche & Community-Bedarfe](../02-recherche/tarot-occult-community-needs.md)
- [Kapitel 2: Architektur & Beziehungs-Graph-Modell](../02-recherche/tarot-zustandsmaschine-dsl.md)
- [Kapitel 3: Open-Source-Scaffolding & Demos](../07-demos/tarot-zustandsmaschine/README.md)
- [Arcana Schema Live Docs & Playground](https://felixinberlin.github.io/Arcana-schema/)

---

CC0 1.0 Universal / MIT & CC BY 4.0. — Félix, Berlin · github.com/felixinberlin/Arcana-schema

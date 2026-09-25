# Mail 10 — Tarot-Zustandsmaschine (Spread-DSL) → Labyrinthos (Tina Gong)

**Status:** Entwurf als Datei, versandfertig.
**An:** faculty@labyrinthos.co — Tina Gong, Gründerin & Autorin von Labyrinthos (Little Palace LLC). Adresse von `labyrinthos.co/pages/contact` abgelesen.
**Betreff:** Idee zu verschenken: Eine herstellerunabhängige Graph-DSL für Tarot-Legesysteme

---

Guten Tag Tina Gong,

ich recherchiere Software-Werkzeuge, die erst seit Kurzem technisch möglich oder fällig sind, und baue nur einen Bruchteil davon selbst. Diese Idee gehört thematisch zu Labyrinthos und der breiteren Indie-Tarot-Community und nicht zu mir — deshalb schenke ich sie Ihnen.

Labyrinthos hat bewiesen, wie viel didaktische Klarheit in einer kuratierten Bibliothek von über dreißig Legesystemen steckt. Gleichzeitig leidet das gesamte digitale Ökosystem (von Indie-Künstlerinnen auf Kickstarter bis zu Entwicklern interaktiver Fiktion) an einem blinden Fleck: Legesysteme werden nach wie vor in unpräziser Prosa oder als starre, festverdrahtete Arrays implementiert. Was es bedeutet, dass Karte 2 Karte 1 „kreuzt", wie umgekehrte Karten benachbarte Übergänge blockieren oder wie ein System mit Nicht-Standard-Decks (22 Große Arkana) umgeht, ist nirgends maschinenlesbar formalisiert.

Die Idee: Eine offene, herstellerunabhängige Graph-Notation für Legesysteme (Tarot Spread DSL):
1. **Deklarativer Deck-Vertrag:** Definiert Mindestkartenzahlen und Arcana-Anforderungen, damit inkompatible Decks deterministisch abgefangen werden.
2. **Geometrische & semantische Slots:** Positionen mit relativen Koordinaten (x, y, Rotation in Grad, Z-Ebene) und funktionaler Rolle.
3. **Typisierte Relationen:** Gerichtete Kanten (crosses, grounds, crowns, leads_to, mirrors), aus denen Render-Engines das Layout autonom berechnen und LLM-Pipelines relationale Spannungen fundiert analysieren können.

Ein kompaktes Dokument mit Architektur, Schemadefinition und den Grenzen (warum Struktur formalisiert werden muss, Bedeutung aber freibleiben muss):
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/tarot-zustandsmaschine.md

Das lauffähige JSON-Schema sowie Referenz-Dateien (Keltisches Kreuz, 3-Karten-Pfad) stehen frei bereit:
https://github.com/felixinberlin/Amelie/tree/main/07-demos/tarot-zustandsmaschine

Keine Bedingungen, CC0 / gemeinfrei, keinerlei Gegenleistung erwartet. Wenn Sie dafür keine Verwendung haben oder bereits an einem eigenen Standard arbeiten, ignorieren Sie diese Nachricht bitte einfach — ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix
Berlin · github.com/felixinberlin/Amelie

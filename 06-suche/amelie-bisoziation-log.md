# Bisoziation-Log

State file for the `lacunar-bisociation` skill. Every run reads this file first and adds to it at the end.
Rows record frame pairs; the retro records what the method learned.

Companion to `amelie-pruefprotokoll.md`, `amelie-suchplaybook.md` and `amelie-quellen.md` — this
file tracks a different idea-generation method (frame collision) rather than search-and-check;
survivors here still go through the normal Amélie existence check before becoming a tin.

## Frame pairs

| Date | Anchor (Frame A, source) | Collider (Frame B) | Distance 1–5 | Candidates | Survivors | Best gap (one sentence, no solution) | Amélie verdict(s) |
|---|---|---|---|---|---|---|---|
| 18.09.2026 | Berliner Biotopkartierung — Kartieranleitung & Geländekartierungsbogen (Senatsverwaltung für Umwelt, Verkehr und Klimaschutz; Typ A, § 30 BNatSchG) | Turngerät-/Eiskunstlauf-Wertung mit KI-Bewegungserfassung (Fujitsu-System, seit ~2017 bei Verbänden im Einsatz, live, pro Auftritt) | 4 | 7 (nach Vorfilter aus ~15 Rohideen) | 3 | Eine sechswöchige Saison-Expertise wird nur im Feld weitergegeben, nirgends kalibriert — neue Kartierer lernen an echten, teuren Doppelbesuchen statt an einem Referenz-Deck mit bekannter Lösung | Eichflächen-Trainer: `frei` · Kartierlotse: `verengt` · Strukturmonitoring/LiDAR: `verengt`, nahe `besetzt` |

## Distance yield

| Distance | Pairs tried | Survivors | Survivors that Amélie judged frei/verengt |
|---|---|---|---|
| 1–2 | 0 | 0 | 0 |
| 3 | 0 | 0 | 0 |
| 4 | 1 | 3 | 3 (1 frei, 2 verengt) |
| 5 | 0 | 0 | 0 |

## Colliders that yielded

- **KI-gestützte Sportwertung (Turnen/Eiskunstlauf, Fujitsu-Motion-Capture-System)** — Distanz 4. Ergiebig, weil die Trennung "Sensor misst das Mechanische, Mensch urteilt über den Rest" direkt auf Kartierschlüssel übertragbar ist, deren Kriterien selbst in ein hartes (Struktur: Höhe, Deckung, Schichtung) und ein weiches (Artdiagnose, Gesamteindruck) Bündel zerfallen. Ertrag: 2 von 3 Überlebenden direkt aus dieser Trennung. Dritter Kandidat (Strukturmonitoring per LiDAR) kam aus demselben Friktionspunkt, war aber schon zu nah an aktiver Forschung — Warnsignal: dieselbe Friktion kann sowohl eine Lücke als auch (wenn die Technik billig genug ist) bereits ein besetztes Forschungsfeld freilegen.

## Retros

### Run 0 (template)
- **Learned:** —
- **Mistake:** —
- **Next time:** Pick a Type B anchor (citizen science with manual evaluation) and a distance-4 collider.

### Run 1 — 18.09.2026 (Researcher #4, lacunar-bisociation)
- **Learned:** Der stärkste Überlebende kam nicht aus der auffälligsten Friktion (Sensor vs. Urteil), sondern aus der unauffälligsten: A's Ritual-Slot ("einmal pro Jahrzehnt, solistisch, Wissen stirbt mit dem Kartierer") gegen B's Ritual-Slot ("jede Saison neu kalibriert, Wissen ist ein Trainingskorpus"). Die Wettkampf-Domäne hat für fast jedes Problem, das sie löst, ein Trainings-/Kalibrierungs-Äquivalent — das ist ein wiederverwendbares Muster, nicht nur ein Zufallstreffer.
- **Mistake:** Zwei der ursprünglich stärksten Kandidaten (phone-LiDAR-Strukturerfassung, Strukturmonitoring zwischen Kartierzyklen) klangen beide originell, kollidierten aber mit demselben aktiven Forschungsfeld (Smartphone-LiDAR für Vegetationsstruktur, 2025/26). Hätte mit einer einzigen Suche *vor* dem Ausformulieren beider Kandidaten geprüft, ob "Smartphone LiDAR Vegetation" schon Preprints hat — hätte eine Suche gespart und früher auf den Trainings-/Kalibrierungs-Friktionspunkt fokussiert.
- **Next time:** Bei Distanz-4-Collidern aus dem Bereich "geübte, gemessene Leistung" (Sport, Musik, Handwerk) zuerst den Ritual-/Zeitachsen-Slot kollidieren, nicht den Material-/Sensor-Slot zuerst — Sensor-Kollisionen laufen zu oft in bereits aktive Forschung, Zeitachsen-Kollisionen (wie oft, wie einsam, wie wird kalibriert) treffen öfter auf echte organisatorische Lücken.

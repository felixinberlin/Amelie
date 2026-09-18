# Eichflächen-Trainer

**Ein Satz:** Ein Kalibrierdeck aus echten, bereits kartierten Biotopflächen — Feldfotos und Artenliste rein, eigenen Code raten, sofort mit dem archivierten Experten-Konsens abgleichen — damit Nachwuchs-Kartierer die seltenen Zweifelsfälle üben können, ohne dafür eine echte Saison im Feld zu verbrauchen.

**Stand:** 18.09.2026 · **Prüfen ab:** 09/2027

## Das Problem

Wer Biotoptypen nach dem amtlichen Kartierschlüssel kartiert (§ 30 BNatSchG, FFH-Lebensraumtypen), lernt das fast ausschließlich, indem er einen erfahrenen Kartierer eine Saison lang begleitet — die Ausbildungsangebote (ANL Bayern, Akademie für angewandte Vegetationskunde, Botanik-Plus-Zertifizierung) sind mehrtägige Präsenzkurse im Gelände. Die Kursbeschreibungen selbst nennen das Problem: pflanzensoziologisches Grundwissen ist die eigentliche Hürde, und es herrscht bereits ein spürbarer Mangel an gut ausgebildeten Kartierern. Die sechswöchige Vegetationsperiode pro Jahr, in der die diagnostischen Arten überhaupt sicher erkennbar sind, macht jede zusätzliche Übungsrunde teuer: ein missklassifizierter Grenzfall wird oft erst am Schreibtisch bemerkt, wenn die Fläche für dieses Jahr schon nicht mehr zugänglich ist.

## Warum das jetzt geht

Mehrere Bundesländer (Niedersachsen, Bayern, Mecklenburg-Vorpommern, Baden-Württemberg, Hamburg, Berlin) veröffentlichen ihre Kartierschlüssel inzwischen als strukturierte PDFs mit Querverweisen, und die zugrundeliegenden Kartierungsergebnisse liegen bei vielen Landesämtern als Geodaten mit Attributen vor. Was bisher fehlte, ist kein neues Verfahren, sondern die Kombination: archivierte Flächen + bekannter Konsens-Code + ein Interface, das den Vergleich sofort zeigt. Das ist heute ein Wochenend-Projekt, nicht mehr ein Digitalisierungsprogramm — vor fünf Jahren hätte allein das Einscannen der Kartierbögen den Aufwand gesprengt.

## Skizze

- Datenbasis: 100–300 georeferenzierte Referenzflächen aus einem Bundesland (Fotos, notierte Artenliste, zugewiesener Code), kuratiert mit dem Landesamt/der Ausbildungsstelle — nicht per Scraping.
- Übungsmodus: Nutzer sieht Fotos + Artenliste einer Fläche, wählt einen Code aus dem offiziellen Schlüssel, bekommt sofort den Konsens-Code plus die Begründung (welche Zeiger- oder Strukturmerkmale den Ausschlag gaben).
- Schwerpunkt auf Grenzfällen (Übergangs-/Mosaik-Typen), weil genau die im Feld die teuersten Fehler sind.
- Kein automatischer Klassifikator, kein Ersatz für die Begehung — reines Trainingsformat.
- Explizit NICHT Teil der Skizze: Live-Einsatz im Feld (das ist eine andere Dose, „Kartierlotse"), automatische Codezuweisung für echte neue Flächen.

## Erster Schritt

Ein Bundesland/eine Ausbildungsstelle (z. B. Akademie für angewandte Vegetationskunde oder ein Landesamt mit digitalem Kartierschlüssel wie NLWKN Niedersachsen) fragen, ob 50 bereits abgeschlossene, nicht mehr strittige Kartierbögen für ein Pilot-Deck freigegeben werden können. Fertig, wenn ein Klick-Prototyp mit diesen 50 Flächen läuft und drei Testnutzer (Kursteilnehmer) ihn eine Stunde lang durchgespielt haben.

## Wo es kippt

Die veröffentlichten Geodaten enthalten meist nur Polygon + finalen Code, nicht die Begründung des Kartierers vor Ort (welche Art wo genau den Ausschlag gab). Ohne diese Begründung ist das Feedback nur „richtig/falsch", nicht „warum" — pädagogisch deutlich schwächer. Gegenmaßnahme: nicht breit scrapen, sondern mit einer einzelnen Ausbildungsstelle starten, die ihre Kartierbögen inklusive Originalnotizen noch besitzt, und das Deck von dort aus wachsen lassen.

## Wer es schon versucht hat

Bestehende Ausbildung ist ausschließlich Präsenz-Begleitung im Feld (ANL Bayern Kartierwochen, Akademie für angewandte Vegetationskunde Feldbotanik-Kurse, Botanik-Plus-Zertifizierung). Der explizit genannte Fachkräftemangel bei Kartierern bestätigt den Engpass. In vier Suchen (deutsch: „Biotopkartierer Nachwuchs Ausbildung Referenzflächen Schulung Kalibrierung"; Varianten zu Kartierschlüssel-Apps; englisch zu Vegetations-Survey-Apps) kein digitales Kalibrier- oder Spaced-Repetition-Tool für diesen Zweck gefunden — nur allgemeine Feld-Datenerfassungs-Apps (Vegapp, e-Surveyor), die Neuerfassung, nicht Training, adressieren.

## Vorarbeit

- Kartierschlüssel für Biotoptypen in Niedersachsen (NLWKN, Stand März 2021, mit interaktivem Inhaltsverzeichnis): https://www.nlwkn.niedersachsen.de/kartierschluessel-biotoptypen/
- Kartieranleitung und Geländekartierungsbogen Berlin (Senatsverwaltung für Umwelt, Verkehr und Klimaschutz, Bearb. Dr. Hanna Köstler): https://www.berlin.de/sen/uvk/_assets/natur-gruen/naturschutz/biotopschutz/kartieranleitung.pdf
- Ridding et al., "Evaluation of the e-Surveyor Mobile Application for Undertaking Plant Surveys and Predicting Habitat Type", Ecology and Evolution, 2026 — zeigt, dass automatisierte Habitattyp-Vorhersage aus Artenlisten methodisch machbar ist (UK-Klassifikation), als Kontrastfolie für ein Trainingsformat statt Live-Klassifikator.
- Akademie für angewandte Vegetationskunde, Ausbildungsprogramm: https://vegetationskun.de/ausbildung-an-der-akademie-fuer-angewandte-vegetationskunde/

---
Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir
nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du
nicht bauen wirst, gib sie jemandem, der es tut.
CC0 / Public Domain. — Félix, Berlin

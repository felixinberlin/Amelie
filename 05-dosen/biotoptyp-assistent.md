---
status: Available
delivery_method: E-Mail
target_maker: >-
  Ökologische Planungsbüros und Gutachter:innen, die Eingriffsausgleich nach der
  Bundeskompensationsverordnung berechnen
review_score: 31/35
architecture_tier: Tier 1/2
source_type: Type A
---
# Biotoptyp-Assistent

**Ein Satz:** Ein Foto-Upload-Tool, das für ein begangenes Gelände einen Vorschlag für den zutreffenden BKompV-Anlage-2-Biotoptyp macht (mit Wertpunkt-Spanne), damit Gutachter:innen nur noch bestätigen statt aus 668 Typen von Hand nachzuschlagen.

**Stand:** 18.09.2026 · **Prüfen ab:** 03/2027 (kurzes Fenster — aktives KI-Forschungsfeld, siehe „Wo es kippt")
**Empfänger:** Ökologische Planungsbüros/Gutachter:innen, die Eingriffsausgleich nach der Bundeskompensationsverordnung berechnen · nachrangig: BfN selbst (Ergänzung zu BfN-Schriften 721) oder das KIBI-Projektteam (Anschluss auf Bodenebene statt Fernerkundung)
**Verdikt:** 🎁 verschenken  
**Review:** 31/35 · Tier 1/2 · Type A (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

## Das Problem
Gutachter:innen, die für Eingriffsvorhaben (Bau, Straßen, Windkraft) die Kompensation nach der Bundeskompensationsverordnung (BKompV) berechnen, müssen jeden kartierten Geländeabschnitt einem von 668 Biotoptypen aus der 315-seitigen BfN-Kartieranleitung (Schrift 721, 2025) zuordnen, bevor die Wertpunkte (0–24) und damit der Kompensationsbedarf feststehen. Das ist Handarbeit mit einem sehr dicken Nachschlagewerk, für jede einzelne Teilfläche einzeln.

## Warum das jetzt geht
Bildklassifikation auf Feldfotos ist inzwischen günstig und schnell — ObsIdentify erreicht bei Artbestimmung aus einem einzelnen Foto rund 95 % Trefferquote. Bisher sind solche Modelle aber auf Artebene trainiert, nicht auf die rechtlich vorgeschriebene 668-Typen-Klassifikation der aktuellen (2025er) BfN-Kartieranleitung — die ist neu genug, dass dafür noch kein öffentlicher Trainingsdatensatz existiert.

## Skizze
Foto(s) + grobe Standortangabe (Bundesland, Nutzungskontext) → Top-3-Vorschläge für den BKompV-Anlage-2-Biotoptyp mit Konfidenzwert und Seitenverweis in Schrift 721, die der Gutachter bestätigt oder korrigiert. Optional Anbindung an einen bestehenden Wertpunkte-Rechner (z. B. das rheinland-pfälzische BWKalk) zur direkten Kompensationsberechnung.
**Nicht dazu gehört:** Ersatz der Vor-Ort-Begehung — nur eine Vorsortierung, die den Katalog-Nachschlag abkürzt.

## Erster Schritt
Trainingsdaten-Frage klären: Existieren bereits gelabelte Bild-Datensätze zu den 668 Typen (z. B. aus Landesbehörden-Biotopkartierungen)? Fertig, wenn: eine Liste möglicher Datenquellen (Länder-Biotopkartierungen, GBIF, Namis-Biotop-App-Exporte) mit Ansprechpersonen steht — das ist Voraussetzung für jedes Modelltraining.

## Wo es kippt
Das BfN-Projekt KIBI und ähnliche Vorhaben gehen dieselbe Grundaufgabe bereits von der anderen Seite an (Fernerkundung/Luftbild statt Bodenfoto) — das bringt eine Vorsortierung in Konkurrenz um Trainingsdaten und Zuständigkeit bei den Landesämtern. Ohne Kooperation mit einer Landesbehörde oder dem BfN bekommt ein unabhängiges Tool vermutlich keinen Zugang zu belastbaren Trainingsdaten. Deshalb das kurze Prüfen-ab-Fenster (6 statt 12 Monate) — das Feld bewegt sich gerade sichtbar.

## Wer es schon versucht hat
[method: ideenrunde] Das BfN-Projekt KIBI kartiert FFH-Lebensraumtypen automatisiert aus Luftbild-/Satellitendaten — andere Datenquelle (Fernerkundung statt Bodenfoto) und schmalerer Typenkatalog (FFH-Lebensraumtypen statt der vollen 668 BKompV-Anlage-2-Typen). Die Namis-Biotop-App (DBU Naturerbe) digitalisiert die Felderfassung, klassifiziert aber nicht automatisch. ObsIdentify/Flora Incognita bestimmen Arten, nicht Biotoptypen. Ein Boden-Foto-zu-BKompV-Typ-Klassifizierer wurde nicht gefunden — Restlücke benannt, aber das Feld ist aktiv in Bewegung, deshalb kurz nachprüfen.
Zusätzlich geprüft: Ökokonto-/Kompensationsflächenkataster-Software (z. B. giscity Ökoflächenkataster) ist GIS-Verwaltung und Monitoring bestehender Kompensationsflächen, keine Bildanalyse zur Typ-Zuordnung — deckt die Idee nicht ab.
Quellen: [KIBI-Vortrag, FOSSGIS 2026](https://media.ccc.de/v/fossgis2026-83204-ki-basierte-kartierung-geschutzter-lebensraume-aus-fernerkundungsbildern), [Namis-Biotop-App/DBU](https://www.dbu.de/en/news/pflanzenwelt-digital-neue-app-macht-naturschutzarbeit-effizienter/), [BfN-Schriften 721](https://www.bfn.de/publikationen/bfn-schriften/bfn-schriften-721-kartieranleitung-fuer-die-biotoptypen-nach-anlage-2), [Biotopwertverfahren/BWKalk](https://de.wikipedia.org/wiki/Biotopwertverfahren), [giscity Ökoflächenkataster](https://www.ibbgdv.de/fachschalen/oekoflaechenkataster/giscity-oekoflaechenkataster/).

## Vorarbeit
BfN-Schriften 721 (Kartieranleitung für die Biotoptypen nach Anlage 2 BKompV, 2025); Bundeskompensationsverordnung (BKompV) Anlage 2; BWKalk (Rheinland-Pfalz); KIBI-Projektseite/Vortrag.

---
Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir
nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du
nicht bauen wirst, gib sie jemandem, der es tut.
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

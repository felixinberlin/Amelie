---
status: Available
delivery_method: E-Mail
target_maker: Landesämter mit digitalisiertem Kartierschlüssel
---
# Kartierlotse

**Ein Satz:** Ein Feld-Assistent für die Biotopkartierung nach deutschem Kartierschlüssel, der während der Begehung anzeigt, welche Zeigerart oder Strukturangabe noch fehlt, um zwischen zwei möglichen Codes sicher zu entscheiden — Live-Hinweis statt nachträglicher Vorhersage am Schreibtisch.

**Stand:** 18.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** Landesämter mit digitalisiertem Kartierschlüssel (NLWKN Niedersachsen als Startpunkt) · nachrangig: Ausbildungsstellen und Planungsbüros mit eigenen Kartierteams
**Verdikt:** 🎁 verschenken

**Verengte Prämisse (siehe „Wer es schon versucht hat"):** Automatisierte Habitattyp-Vorhersage aus Artenlisten existiert bereits als Forschungsprototyp (UK, e-Surveyor). Was nicht existiert: dieselbe Idee für den deutschen Kartierschlüssel, und vor allem als Live-Hinweis *während* der Begehung statt als Vorhersage danach.

## Das Problem

Kartierer arbeiten meist allein und entscheiden die Codezuweisung im Feld anhand eines 100+-seitigen amtlichen Schlüssels. Bei ähnlichen Übergangs- oder Mosaik-Typen hängt die Entscheidung oft an einer einzigen zusätzlichen Beobachtung — einer Zeigerart, die man nicht extra gesucht hat, oder einem Strukturmerkmal (Deckungsgrad, Schichtung), das man nicht separat notiert hat. Bemerkt wird die Lücke meist erst am Schreibtisch beim Ausfüllen des Kartierbogens — dann ist die Fläche oft nicht mehr im richtigen Vegetationsstadium erneut zugänglich, und die engen sechs Wochen der Kartiersaison machen einen zweiten Besuch teuer.

## Warum das jetzt geht

Mehrere Landeskartierschlüssel liegen inzwischen mit strukturierten Querverweisen vor (z. B. NLWKN Niedersachsen, Stand 2021/23), was sie erstmals maschinenlesbar in eine Entscheidungslogik überführbar macht. Kleine Sprachmodelle laufen inzwischen offline auf einem Feldtelefon — wichtig, weil viele Offenlandflächen ohne Netzabdeckung liegen. Und mit der e-Surveyor-Studie (Ridding et al. 2026) gibt es erstmals einen publizierten Beleg, dass automatisierte Habitattyp-Vorhersage aus einer Artenliste grundsätzlich funktioniert — nur eben noch nicht für den deutschen Schlüssel und nicht live im Feld.

## Skizze

- Kartierer trägt Arten/Strukturbeobachtungen wie gewohnt während der Begehung ein (Sprache oder Tipp-Kürzel).
- App hält die digitalisierte Entscheidungslogik eines Kartierschlüssels (Start: ein Bundesland) im Hintergrund und erkennt, wenn zwei Codes nach aktuellem Stand noch gleich wahrscheinlich sind.
- In diesem Moment zeigt sie: „Für Code X vs. Y fehlt noch: Prüfung auf Art Z oder Strukturmerkmal W — typischerweise im Randbereich/Unterwuchs zu finden."
- Kein automatischer Codevorschlag, keine Ersetzung der fachlichen Entscheidung — nur ein Vollständigkeits-Check, solange man noch auf der Fläche steht.
- Explizit NICHT Teil der Skizze: automatische Endklassifikation, Ersatz der Artbestimmung selbst, Einsatz ohne vorherige Validierung durch erfahrene Kartierer.

## Erster Schritt

Den NLWKN-Kartierschlüssel Niedersachsen (liegt bereits mit Querverweisen als PDF/Word vor) für einen einzigen Biotop-Ober-Typ (z. B. Grünland-Untertypen) von Hand in eine Entscheidungstabelle „Code ↔ notwendige Zeigerarten/Strukturmerkmale" übertragen. Fertig, wenn ein erfahrener Kartierer diese Tabelle gegen drei reale, bereits abgeschlossene Kartierfälle prüft und bestätigt, dass die Logik seine damalige Entscheidung korrekt nachvollzieht.

## Wo es kippt

Die reale Entscheidungspraxis vieler Kartierer ist holistischer als der gedruckte Schlüssel suggeriert („Gesamteindruck der Fläche" zählt oft mehr als einzelne Kriterien) — ein Tool, das nur die schriftlichen Kriterien abbildet, kann bei genau den Grenzfällen, auf die es abzielt, falsche Sicherheit erzeugen. Gegenmaßnahme: nie als Klassifikator verkaufen, sondern strikt als „das hier hast du noch nicht geprüft"-Erinnerung, und vor jedem Rollout mit erfahrenen Kartierern gegen echte Altfälle validieren, nicht nur gegen den Text des Schlüssels.

## Wer es schon versucht hat

Die e-Surveyor-App (Ridding et al., *Ecology and Evolution*, 2026) sagt aus einer im Feld erhobenen Artenliste den Habitattyp nach drei UK-Klassifikationssystemen (Broad Habitat, UKHab, NVC) voraus — belegt, dass das Grundprinzip funktioniert, aber für ein anderes Klassifikationssystem und als nachträgliche Vorhersage nach Abschluss der Erhebung, nicht als Live-Lückenhinweis während der Begehung. Vegapp (Schmidtlein 2026) digitalisiert die Felddateneingabe für Vegetationsaufnahmen, ohne Klassifikationslogik. Für den deutschen Kartierschlüssel wurde in vier Suchen kein vergleichbares Werkzeug gefunden — auch keine der Landesämter (Niedersachsen, Bayern, Mecklenburg-Vorpommern, Baden-Württemberg, Hamburg, Berlin) bietet mehr als PDF-Schlüssel mit Querverweisen an.

## Vorarbeit

- Ridding et al., "Evaluation of the e-Surveyor Mobile Application for Undertaking Plant Surveys and Predicting Habitat Type", Ecology and Evolution, 2026: https://onlinelibrary.wiley.com/doi/10.1002/ece3.73901
- Schmidtlein, "Vegapp: A Mobile Application for Vegetation Field Data Collection", Applied Vegetation Science, 2026: https://onlinelibrary.wiley.com/doi/10.1111/avsc.70089
- Kartierschlüssel für Biotoptypen in Niedersachsen (NLWKN, Stand März 2021): https://www.nlwkn.niedersachsen.de/kartierschluessel-biotoptypen/
- Kartieranleitung und Geländekartierungsbogen Berlin: https://www.berlin.de/sen/uvk/_assets/natur-gruen/naturschutz/biotopschutz/kartieranleitung.pdf
- Zum Vergleich, Frame B: KI-gestützte Bewegungserfassung bei Turnen/Eiskunstlauf (Fujitsu-System) trennt seit ~2017 sensorisch messbare Fakten (Rotationen, Winkel) von menschlichem Urteil (Ausführung, Kunstfertigkeit) — dasselbe Prinzip, hier auf „Struktur messbar / Artdiagnose bleibt menschlich" übertragen.

---
Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir
nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du
nicht bauen wirst, gib sie jemandem, der es tut.
CC0 / Public Domain. — Félix, Berlin

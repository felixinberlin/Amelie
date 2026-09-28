# Hitzepixelgarten: Der Urbane Kühlungs-Simulator

## Vision
Städte werden zu Hitzepixelgärten, in denen Bürger:innen und Planer:innen gemeinsam die urbane Kühlung gestalten können. Der Hitzepixelgarten ist ein intuitives, webbasiertes Werkzeug, das es ermöglicht, die Auswirkungen von grüner Infrastruktur (Bäume, Gründächer, Wasserflächen) auf das lokale Mikroklima in Echtzeit zu visualisieren und zu simulieren. Ziel ist es, die Planung von hitzeresilienten Städten spielerisch und datengestützt zu demokratisieren.

## Das Problem: Urbane Hitzeinseln
Städtische Gebiete, insbesondere dicht bebaute und versiegelte Flächen, absorbieren tagsüber mehr Sonnenenergie und speichern Wärme länger als ländliche Umgebungen. Dieser 'Urban Heat Island'-Effekt (UHI) führt zu höheren Temperaturen, erhöhtem Energieverbrauch für Kühlung und ernsthaften Gesundheitsrisiken, insbesondere für vulnerable Bevölkerungsgruppen. Traditionelle Planungswerkzeuge sind oft komplex, teuer und für die breite Öffentlichkeit unzugänglich, was die Partizipation an Klimaanpassungsstrategien erschwert.

## Die Lösung: Hitzepixelgarten
Der Hitzepixelgarten bietet eine interaktive 'Was-wäre-wenn'-Simulation, die auf vereinfachten physikalischen Modellen basiert:

1.  **Interaktive Karte:** Eine Kartenoberfläche (basierend auf OSM-Daten) zeigt die aktuelle Stadtstruktur und potenzielle Hitzeinseln (z.B. basierend auf Satellitendaten oder generischen Temperaturmodellen).
2.  **'Pinsel'-Werkzeuge:** Benutzer:innen können mit digitalen Pinseln verschiedene Arten grüner Infrastruktur (z.B. Einzelbäume, Baumgruppen, Gründächer, kleine Wasserflächen) auf die Karte 'malen'.
3.  **Echtzeit-Simulation:** Jede Veränderung auf der Karte löst eine vereinfachte physikalische Berechnung aus. Diese berücksichtigt Faktoren wie Albedo (Reflexionsgrad), Evapotranspiration (Verdunstungskühlung durch Pflanzen und Wasser) und Wärmespeicherung der Materialien. Das Ergebnis wird sofort als aktualisierte Temperaturkarte (z.B. in Farbabstufungen) visualisiert.
4.  **Physik-Engine im Browser:** Die Kernberechnungen laufen clientseitig im Browser (ggf. über Web Workers oder WebAssembly für Performance), was eine schnelle Rückmeldung ohne Serverlast ermöglicht.
5.  **Zielgruppen:** Stadtplaner:innen können Entwürfe schnell testen, Bürgerinitiativen können ihre Vorschläge visualisieren und untermauern, und Universitäten können das Tool für Lehrzwecke einsetzen.

## Technische Details
*   **Frontend:** React/Vue.js für die Benutzeroberfläche, Mapbox GL JS / Leaflet für die Karteninteraktion, Three.js / WebGL für die 2D/3D-Visualisierung der Temperaturfelder und städtischen Elemente.
*   **Physik-Modell:** Ein gitterbasiertes, vereinfachtes thermodynamisches Modell, das die Energiebilanz jedes 'Pixels' oder Zellenbereichs berechnet. Faktoren sind Sonneneinstrahlung, Albedo, Evapotranspiration und konduktiver/konvektiver Wärmeaustausch. Dies kann mittels Finite-Differenzen-Methoden oder zellulären Automaten realisiert werden.
*   **Datenquellen:** OpenStreetMap (Gebäudeumrisse, bestehende Grünflächen), DTM/DSM (Digitales Höhenmodell für Schattenwurf), lokale Klimadaten (Temperatur, Luftfeuchte, Solarstrahlung).
*   **Performance:** Einsatz von Web Workers oder WebAssembly für rechenintensive Simulationen, um die UI flüssig zu halten.

## Civic Delight & Playfulness
Der Hitzepixelgarten verwandelt die komplexe Aufgabe der Klimaanpassung in ein zugängliches und sogar spielerisches Erlebnis. Das 'Gärtnern' der eigenen Stadt, das Experimentieren mit verschiedenen Grünstrategien und das sofortige visuelle Feedback schaffen ein Gefühl der Ermächtigung und fördern die Bürgerbeteiligung. Es ist ein Werkzeug, das nicht nur informiert, sondern auch inspiriert und zum Handeln anregt.

## Potential & Skalierbarkeit
Das Konzept ist auf jede Stadt übertragbar, für die entsprechende Geodaten verfügbar sind. Es kann um weitere Layer (z.B. Luftqualität, Lärm, Wasserabfluss) und komplexere physikalische Modelle erweitert werden. Langfristig könnte es ein zentrales Werkzeug für partizipative Stadtentwicklung im Zeichen des Klimawandels werden.
# Mikroplastik-Scout WASM

## 1. Problemstellung
Die Verschmutzung durch Mikroplastik ist eine der drängendsten Umweltprobleme unserer Zeit. Diese winzigen Partikel gelangen in alle Ökosysteme und stellen eine ernsthafte Bedrohung für die Biodiversität und die menschliche Gesundheit dar. Die Erfassung und Quantifizierung von Mikroplastik, insbesondere in Wasser- und Sedimentproben, ist jedoch arbeitsintensiv, erfordert teure Spezialausrüstung und geschultes Personal. Dies führt dazu, dass die Datenerhebung oft lückenhaft ist und Bürgerwissenschaftler (Citizen Scientists) oder kleinere Forschungsgruppen kaum effektiv beitragen können. Die fehlende Zugänglichkeit zu schnellen und kostengünstigen Analysemethoden verlangsamt die Forschung und die Entwicklung von Schutzmaßnahmen erheblich.

## 2. Die Amélie-Lösung: Mikroplastik-Scout WASM
Der „Mikroplastik-Scout WASM“ ist ein browserbasiertes Open-Source-Tool, das Künstliche Intelligenz (KI) und WebAssembly (WASM) nutzt, um die Identifizierung und Quantifizierung von Mikroplastik in Mikroskopiebildern zu demokratisieren. Nutzer können Bilder von Wasser- oder Sedimentproben, die unter einem Mikroskop aufgenommen wurden, hochladen. Eine im Browser laufende KI (z.B. ein vortrainiertes ONNX-Modell) analysiert das Bild, erkennt potenzielle Mikroplastikpartikel und klassifiziert diese nach Typ (z.B. Faser, Fragment, Pellet) sowie Größe. Das Tool liefert eine vorläufige Zählung, eine visuelle Markierung der gefundenen Partikel und eine Konfidenzbewertung.

Durch die Ausführung des KI-Modells direkt im Browser mittels WebAssembly werden Datenschutz und Geschwindigkeit maximiert, da keine Daten auf externe Server hochgeladen werden müssen. Dies ermöglicht es Universitäten, NGOs und Gemeinden, kostengünstige und zugängliche Bürgerwissenschaftsprogramme zur Mikroplastiküberwachung zu starten und wertvolle Daten zu sammeln, die sonst unentdeckt blieben.

## 3. Technischer Überblick
*   **Frontend**: Moderne Webtechnologien (React/Vue/Svelte), die eine intuitive Benutzeroberfläche für Upload, Anzeige und Interaktion bieten.
*   **KI-Modell**: Ein vortrainiertes Objekt-Erkennungsmodell (z.B. YOLO, EfficientDet), das auf einem Datensatz von Mikroplastikbildern trainiert wurde. Das Modell wird in ein für den Browser optimiertes Format (z.B. ONNX) konvertiert.
*   **Inferenz im Browser**: Nutzung von ONNX Runtime Web oder TensorFlow.js, um das KI-Modell effizient in WebAssembly im Browser auszuführen. Dies ermöglicht schnelle Analysen direkt auf dem Gerät des Benutzers.
*   **Bildverarbeitung**: Client-seitige Vorverarbeitung der hochgeladenen Bilder (Skalierung, Normalisierung) und Nachverarbeitung der KI-Ergebnisse (Bounding Boxes zeichnen, Klassifikationslabels anzeigen).
*   **Datenexport**: Möglichkeit, die Analyseergebnisse (Anzahl, Typ, Koordinaten) in standardisierten Formaten (CSV, GeoJSON) zu exportieren, um sie in weiteren Forschungs- oder Überwachungsprojekten zu nutzen.
*   **Geolokalisierung (optional)**: Wenn vom Benutzer erlaubt, kann der Standort der Probe erfasst und mit den Analyseergebnissen verknüpft werden.

## 4. Civic Impact (Zivilgesellschaftlicher Nutzen)
Der Mikroplastik-Scout WASM hat das Potenzial, die Bürgerwissenschaft im Bereich Umwelt erheblich zu stärken. Er senkt die Eintrittsbarriere für die Teilnahme an der Mikroplastikforschung und ermöglicht es einer breiteren Öffentlichkeit, aktiv an der Datenerhebung teilzunehmen. Dies führt zu:
*   **Umfassenderen Daten**: Sammlung von mehr geografisch verteilten Datenpunkten über Mikroplastikvorkommen.
*   **Erhöhtem Bewusstsein**: Direkte Beteiligung fördert das Verständnis für die Problematik und die Notwendigkeit von Schutzmaßnahmen.
*   **Bildung**: Das Tool kann als Lehrmittel in Schulen und Universitäten eingesetzt werden, um Schülern und Studenten praktische Erfahrungen in Umweltanalyse und KI zu vermitteln.
*   **Lokaler Handlungsfähigkeit**: Gemeinden und NGOs können gezieltere Maßnahmen ergreifen, basierend auf lokalen Daten, die sie selbst generiert haben.
*   **Datenschutz**: Die client-seitige Verarbeitung gewährleistet, dass sensible Daten nicht unkontrolliert hochgeladen werden.

## 5. Zielinstitution
Das **TU Berlin Open Science Lab** ist eine ideale Zielinstitution. Es hat eine starke Ausrichtung auf Open Science, die Entwicklung von Open-Source-Tools und die Förderung von Bürgerwissenschaft. Die Expertise im Bereich Datenwissenschaft, maschinelles Lernen und Web-Technologien passt perfekt zur technischen Umsetzung des Mikroplastik-Scout WASM. Eine Zusammenarbeit könnte die Modellentwicklung, die Validierung der Ergebnisse durch wissenschaftliche Partner und die breite Adoption des Tools innerhalb der Forschungs- und Bürgerwissenschaftscommunity vorantreiben.
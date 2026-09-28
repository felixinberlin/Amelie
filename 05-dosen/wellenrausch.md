# Wellenrausch: Web-basierte Wellensimulation mit WebAssembly & WebGL

## 1. Ausgangslage & Problemstellung
Die Lehre und Forschung im Bereich der Physik, insbesondere bei Wellenphänomenen wie Beugung, Interferenz, Akustik oder Quantenmechanik, ist oft auf statische Darstellungen in Büchern oder auf teure proprietäre Simulationssoftware angewiesen. Dies schränkt den interaktiven Zugang für Studierende und Forschende ein und erschwert die Reproduzierbarkeit und den Austausch von Simulationsergebnissen. Eine offene, performante und zugängliche Plattform zur Visualisierung und Analyse komplexer Wellenphänomene fehlt im Open-Source-Bereich.

## 2. Die Amélie-Lösung: Wellenrausch
"Wellenrausch" ist ein webbasiertes Tool, das die Simulation und Visualisierung komplexer Wellenphänomene ermöglicht. Durch den Einsatz von WebAssembly (Wasm) für rechenintensive physikalische Algorithmen und WebGL für eine performante 3D-Visualisierung bietet Wellenrausch eine interaktive und leistungsstarke Umgebung direkt im Browser. Es erlaubt die Definition von Wellenquellen, Medienparametern und Beobachtungsfeldern, um dynamische Effekte wie Überlagerung, Brechung und Beugung in Echtzeit darzustellen.

## 3. Zielgruppen & Anwendungsfälle
*   **Universitäten und Hochschulen:** Als Lehrmittel für Physik- und Ingenieurstudiengänge zur Veranschaulichung abstrakter Konzepte. Studierende können Parameter variieren und die Auswirkungen direkt beobachten.
*   **Forschungsinstitute:** Zur schnellen Prototypisierung und Visualisierung von Forschungsergebnissen in der Akustik, Optik, Materialwissenschaft oder Quantenphysik.
*   **Open Science Labs:** Zur Förderung der offenen Forschung und des Austauschs von Simulationsmodellen und -ergebnissen.
*   **Öffentliche Bildungseinrichtungen:** Für interaktive Ausstellungen und Bildungsangebote, die komplexe physikalische Konzepte für ein breiteres Publikum zugänglich machen.

## 4. Technischer Ansatz
*   **Frontend:** TypeScript, React (oder ähnliches Framework) für die Benutzeroberfläche.
*   **Physik-Engine:** Implementierung von Wellengleichungslösern (z.B. FDTD, FEM) in C/C++ und Kompilierung nach WebAssembly für maximale Performance.
*   **Visualisierung:** WebGL/WebGPU für die effiziente und interaktive Darstellung von 2D- und 3D-Wellenfeldern, Isolinien, Vektorfeldern und Spektren.
*   **Datenmanagement:** Speicherung und Laden von Simulationskonfigurationen im Browser (IndexedDB) oder als JSON-Dateien.

## 5. Mehrwert & Nachhaltigkeit
Wellenrausch fördert die offene Wissenschaft, indem es ein leistungsfähiges Werkzeug unter CC0-Lizenz bereitstellt. Es senkt die Einstiegshürde für die Wellensimulation und ermöglicht eine breitere Akzeptanz in Lehre und Forschung. Die Web-Technologien sichern eine breite Kompatibilität und einfache Verteilung. Die modulare Architektur erlaubt zukünftige Erweiterungen für andere physikalische Domänen.

## 6. Risiken & Herausforderungen
Die Hauptanforderungen liegen in der präzisen Implementierung der physikalischen Modelle und der Optimierung der WebAssembly- und WebGL-Pipelines, um auch anspruchsvolle Simulationen flüssig darzustellen. Die Entwicklung einer intuitiven Benutzeroberfläche für komplexe Parameter ist ebenfalls entscheidend.

## 7. Referenzen & Ähnliche Projekte
*   [Online-Wellenrechner (proprietär)](https://www.falstad.com/ripple/)
*   [WebAssembly-Demos für wissenschaftliche Anwendungen](https://webassembly.org/docs/use-cases/)
*   [WebGL-Bibliotheken für 3D-Visualisierung](https://threejs.org/)
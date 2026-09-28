# Dossier: KI-gestützter Datensatz-Harmonisierer für die öffentliche Verwaltung

## 1. Problemstellung
Die öffentliche Verwaltung in Deutschland, insbesondere auf kommunaler Ebene, produziert und verwaltet eine enorme Menge an Daten. Viele dieser Datensätze sind für Open-Data-Initiativen und die datengestützte Politikgestaltung von unschätzbarem Wert. Jedoch leiden sie häufig unter erheblichen Qualitätsmängeln:

*   **Heterogene Formate:** Daten aus verschiedenen Ämtern oder über verschiedene Zeiträume hinweg weisen inkonsistente Formate auf (z.B. Datumsformate, Adressschreibweisen).
*   **Fehlende Metadaten:** Oft fehlen standardisierte Beschreibungen der Datenfelder, Einheiten oder Erfassungszeiträume.
*   **Inkonsistente Einträge:** Freitextfelder oder kategorische Daten enthalten Tippfehler, Abkürzungen oder Synonyme, die eine Aggregation oder Analyse erschweren (z.B. "Berlin", "berlin", "Bln").
*   **Mangelnde Interoperabilität:** Ohne eine gemeinsame semantische Basis können Daten aus verschiedenen Quellen kaum miteinander verknüpft werden.

Diese Probleme führen zu einem hohen manuellen Aufwand bei der Datenbereinigung und -integration, was die Nutzung von Open Data erschwert und die Effizienz der Verwaltung beeinträchtigt.

## 2. Die Amélie-Lösung: Verwaltungsdaten-Harmonisierer
Der "Verwaltungsdaten-Harmonisierer" ist ein Open-Source-Tool, das Künstliche Intelligenz, insbesondere Large Language Models (LLMs), nutzt, um tabellarische Datensätze der öffentlichen Verwaltung automatisch zu standardisieren und anzureichern. Das Ziel ist es, die Qualität und Nutzbarkeit von Verwaltungsdaten signifikant zu steigern.

### 2.1 Kernfunktionen
*   **Intelligente Schema-Inferenz:** Analyse von Spaltennamen und -inhalten zur automatischen Erkennung von Datentypen (Datum, Text, Zahl, Geokoordinaten etc.) und zur Vorschlag von kanonischen Spaltennamen (z.B. "Datum der Erfassung" statt "Erf_Dat").
*   **Inkonsistenz-Erkennung & -Korrektur:** Identifikation und Vorschlag von Korrekturen für inkonsistente Einträge (z.B. Vereinheitlichung von Ortsnamen, Adressbestandteilen, Schreibweisen).
*   **Metadaten-Generierung:** Basierend auf dem Inhalt der Datensätze generiert das Tool Vorschläge für Metadaten wie Beschreibungen, Tags, passende Ontologien (z.B. Schema.org, DCAT-AP.de) und Lizenzinformationen.
*   **Regelbasierte Standardisierung:** Benutzer können die von der KI vorgeschlagenen Regeln überprüfen, anpassen und speichern, um sie auf ähnliche Datensätze anzuwenden.
*   **Datenanreicherung:** Vorschläge zur Ergänzung fehlender Informationen durch externe Quellen oder Ableitung aus bestehenden Daten (z.B. Postleitzahl aus Adresse).
*   **Interaktives Dashboard:** Eine benutzerfreundliche Oberfläche zur Visualisierung der Datenqualität, zur Überprüfung von KI-Vorschlägen und zur Durchführung von Korrekturen.

### 2.2 Technischer Ansatz
Das Tool wird als Webanwendung entwickelt, die im Browser oder auf einem lokalen Server betrieben werden kann. Für die KI-Komponenten wird eine modulare Architektur angestrebt:

*   **LLM-Integration:** Einsatz von Open-Source-LLMs (z.B. über Ollama) für semantische Analysen, Namenserkennung und Regelgenerierung. Eine API-Integration für leistungsfähigere Modelle (z.B. OpenAI, Anthropic) ist optional vorgesehen.
*   **Daten-Parsing & -Transformation:** Nutzung etablierter Bibliotheken für CSV, Excel, JSON etc.
*   **Benutzeroberfläche:** Moderne Frontend-Frameworks (z.B. React/Vue/Svelte) für ein intuitives Daten-Auditing und Regelmanagement.
*   **Regel-Engine:** Eine flexible Engine zur Definition, Anwendung und Speicherung von Normalisierungs- und Anreicherungsregeln.

## 3. Zielinstitution & Nutzen

*   **Senatsverwaltung für Wirtschaft, Energie und Betriebe (Referat Open Data Berlin):** Direkte Unterstützung bei der Aufbereitung von Daten für das Berliner Open Data Portal. Steigerung der Datenqualität und -quantität.
*   **Statistische Ämter:** Effizientere Vorbereitung von Datensätzen für statistische Auswertungen.
*   **Universitäten & NGOs:** Bereitstellung eines Werkzeugs zur Analyse und Vorbereitung von öffentlichen Daten für Forschung und zivilgesellschaftliche Projekte.

Der Hauptnutzen liegt in der Automatisierung zeitaufwändiger Prozesse, der Verbesserung der Datenqualität und der Förderung einer datengestützten, transparenten Verwaltung. Dies führt zu einer höheren Akzeptanz und Nutzbarkeit von Open Data und unterstützt die Entwicklung innovativer digitaler Anwendungen, die auf diesen Daten basieren.

## 4. Langfristige Vision
Der Harmonizer könnte zu einer zentralen Komponente in der Datenpipeline der öffentlichen Verwaltung werden, die eine kontinuierliche Verbesserung der Datenqualität gewährleistet. Durch die Möglichkeit, organisationsspezifische Regeln zu lernen und zu teilen, könnte ein "Wissensnetzwerk" für Datenstandardisierung entstehen. Es könnte auch als Lehrwerkzeug für Datenkompetenz in der Verwaltung dienen.
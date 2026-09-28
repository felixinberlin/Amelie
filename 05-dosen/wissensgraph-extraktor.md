# Amélie Initiative: Wissensgraph-Extraktor

## 1. Überblick

Der **Wissensgraph-Extraktor** ist ein Open-Source-Tool, das Universitäten, Kommunen und NGOs dabei unterstützt, strukturiertes, verifizierbares Wissen aus großen Mengen unstrukturierter Texte (z.B. Forschungsberichte, Gesetzestexte, Sitzungsprotokolle, Bürgerbeteiligungsdokumente) zu extrahieren. Anstatt mühsam manuell Datenpunkte zu identifizieren und zu katalogisieren, ermöglicht dieses Werkzeug die Definition eines *Wissensschemas*, nach dem ein Large Language Model (LLM) relevante Informationen automatisiert identifiziert, extrahiert und in einem strukturierten Format (z.B. JSON-LD oder Graph-Datenbank-kompatibel) ausgibt. Ein zentrales Merkmal ist die **Provenienz**: Jede extrahierte Information wird direkt mit den relevanten Textpassagen im Quelldokument verknüpft, was die Verifizierbarkeit und Transparenz signifikant erhöht.

## 2. Das Problem: Informationsflut und manuelle Hürden

Im öffentlichen Sektor und in der Wissenschaft sind Organisationen mit einer exponentiell wachsenden Informationsmenge konfrontiert. Berichte, Studien, Gesetze und öffentliche Kommentare liegen oft in Form von langen, unstrukturierten Textdokumenten vor. Das manuelle Lesen, Verstehen und Extrahieren relevanter Fakten für Analysen, Entscheidungsfindungen oder die Erstellung neuer Dokumente ist:
*   **Zeitintensiv und kostspielig:** Experten verbringen Stunden mit repetitiver Datenerfassung.
*   **Fehleranfällig:** Menschliche Ermüdung und Interpretationsunterschiede führen zu Inkonsistenzen.
*   **Nicht skalierbar:** Bei steigendem Datenvolumen bricht die manuelle Verarbeitung zusammen.
*   **Mangelnde Verifizierbarkeit:** Ohne direkte Referenzen zu den Originalquellen ist es schwer, die Herkunft von Datenpunkten nachzuvollziehen.

Dies führt zu einer "Reibung" in der Wissensverarbeitung, die Innovation hemmt und die Effizienz öffentlicher Dienstleistungen beeinträchtigt.

## 3. Die Lösung: Asymmetrische Inversion durch Wissensgraph-Extraktion

Der **Wissensgraph-Extraktor** kehrt diesen manuellen, ineffizienten Prozess um (asymmetrische Inversion). Er bietet eine automatisierte, schema-gesteuerte Methode zur Wissensgewinnung:
1.  **Schema-Definition:** Nutzer definieren flexibel, welche Art von Wissen extrahiert werden soll (z.B. "Politik X betrifft demografische Gruppe Y in Region Z mit Auswirkung A"). Dies kann mit Tools wie Zod (TypeScript) oder Pydantic (Python) erfolgen.
2.  **Dokumenten-Input:** Unstrukturierte Texte (PDFs, Markdown, HTML, TXT) werden dem System zugeführt.
3.  **LLM-gesteuerte Extraktion:** Ein Open-Source- oder kommerzielles LLM (z.B. Llama 3, GPT-4) verarbeitet den Text und extrahiert die Informationen gemäß des definierten Schemas.
4.  **Provenienz-Verankerung:** Jede extrahierte Information wird mit direkten Verweisen (z.B. Absatznummer, Seitenbereich) zum Ursprungstext versehen. Dies ermöglicht eine sofortige Verifikation und schafft Vertrauen.
5.  **Strukturierte Ausgabe:** Die Ergebnisse werden als strukturierte Daten (z.B. JSON-Objekte, die in eine Graph-Datenbank importiert werden können) ausgegeben.

## 4. Anwendungsfälle und Zielgruppen

*   **Universitäten (z.B. TU Berlin Open Science Lab, politikwissenschaftliche Institute):** Automatisierung von Literaturreviews, Extraktion von Studienergebnissen, Analyse von Gesetzestexten und deren Auswirkungen.
*   **Kommunalverwaltungen (z.B. Senatsverwaltung Berlin):** Beschleunigung der Analyse von Bürgerbeteiligungen, Extraktion relevanter Passagen aus neuen Verordnungen, Zusammenfassung von Sitzungsprotokollen für die Politik.
*   **NGOs und Think Tanks:** Effiziente Erfassung von Daten für Advocacy-Arbeit, Analyse von Berichten und Studien, Generierung von Faktenblättern.

## 5. Technische Details

*   **Sprachen:** TypeScript (Frontend/Backend Logik), Python (für LLM-Interaktion/Orchestrierung).
*   **LLMs:** Integration mit verschiedenen (Open-Source-)LLMs über APIs (z.B. Hugging Face, Ollama) oder kommerzielle Anbieter.
*   **Schema-Definition:** Zod (TypeScript) oder Pydantic (Python) für robuste und validierbare Datenmodelle.
*   **Datenbank:** Optionale Integration mit Graph-Datenbanken (z.B. Neo4j, DGraph) zur Speicherung und Abfrage des extrahierten Wissensgraphen.
*   **Benutzeroberfläche:** Eine einfache Web-Oberfläche (z.B. React/Vue) zur Schema-Definition, Dokumenten-Upload und Visualisierung/Export der Ergebnisse.

## 6. Amélie 8-Vektor Bewertung

*   **Neuheit:** 9/10 – Spezifische Anwendung von KG-Extraktion mit starker Provenienz für den gemeinnützigen/akademischen Sektor, über generische LLM-Zusammenfassungen hinaus.
*   **Komplexität:** 8/10 – Erfordert robuste NLP/LLM-Entwicklung, Schema-Management und Zitierungsverknüpfung.
*   **Möglichkeit:** 9/10 – Aktuelle LLM-Fähigkeiten, Zod/Pydantic und Graph-Datenbanken machen dies hochgradig realisierbar.
*   **Langlebigkeit:** 8/10 – Das Problem der Informationsüberflutung und des Bedarfs an strukturiertem Wissen ist dauerhaft.
*   **CivicSWOT:** 9/10 – Behebt eine kritische Reibung in der Wissensarbeit des öffentlichen Sektors.
*   **TechTreeFit:** 9/10 – Passt gut zu modernen LLM-APIs/OSS, TypeScript, Graph-Datenbanken; leicht integrierbar.
*   **GroundTruth:** 9/10 – Empirisch beobachteter Schmerzpunkt in Forschung, Politikberatung und NGO-Arbeit.
*   **Spaß:** 9/10 – Befriedigend, unstrukturierte Informationen in strukturiertes, abfragbares Wissen zu verwandeln.

## 7. Fazit

Der Wissensgraph-Extraktor bietet eine transformative Lösung für die Herausforderung der Wissensverarbeitung im öffentlichen Sektor. Durch die Automatisierung der Extraktion und die Sicherstellung der Provenienz wird nicht nur die Effizienz gesteigert, sondern auch die Qualität und Verifizierbarkeit der Entscheidungsgrundlagen verbessert. Es ist ein Paradebeispiel für die "asymmetrische Inversion" von manueller Arbeit in skalierbare, technologiegestützte Prozesse.
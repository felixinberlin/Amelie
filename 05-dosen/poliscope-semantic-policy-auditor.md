# Amélie Projektvorschlag: Poliscope – Semantischer Politik-Auditor

## 1. Überblick

Poliscope ist ein Open-Source-Tool, das darauf abzielt, die Analyse großer Mengen unstrukturierter Textdaten im Kontext von Politik, Gesetzgebung und öffentlicher Beteiligung zu revolutionieren. Es nutzt modernste KI-Technologien wie semantische Suche und große Sprachmodelle (LLMs), um Universitäten, NGOs und Kommunalverwaltungen dabei zu unterstützen, Bürgerfeedback effizient zu synthetisieren, Gesetzesentwürfe auf Konsistenz zu prüfen und thematische Schwerpunkte in Forschungsdokumenten zu identifizieren.

## 2. Problemstellung

Öffentliche Konsultationen, Gesetzgebungsverfahren und wissenschaftliche Studien generieren riesige Mengen an Textdaten – von Bürgerkommentaren über Expertenmeinungen bis hin zu juristischen Gutachten. Die manuelle Auswertung dieser Daten ist extrem zeitaufwändig, ressourcenintensiv und anfällig für menschliche Voreingenommenheit oder das Übersehen subtiler Zusammenhänge. Dies verlangsamt politische Entscheidungsprozesse, kann zu unvollständiger Berücksichtigung von Bürgeranliegen führen und erschwert die kohärente Entwicklung von Gesetzgebung.

## 3. Lösungsansatz: Poliscope

Poliscope bietet eine Plattform, die es ermöglicht, Dokumentenkorpora (z.B. Gesetzesentwürfe, Stellungnahmen, Forschungspapiere) zu ingestieren und mithilfe von KI zu analysieren:

*   **Semantische Themenextraktion:** Identifiziert automatisch wiederkehrende Themen, Argumente und Schlüsselkonzepte.
*   **Konsistenzprüfung:** Flaggt potenzielle Widersprüche oder Inkonsistenzen innerhalb eines Dokuments oder über mehrere Dokumente hinweg.
*   **Stimmungsanalyse/Interessenidentifikation:** Extrahiert die vorherrschende Stimmung und die wichtigsten Bedenken aus Bürgerfeedback.
*   **Querverweise:** Verknüpft neue Entwürfe automatisch mit bestehender Gesetzgebung, relevanten Forschungsergebnissen oder ähnlichen Fällen.
*   **Zusammenfassungen:** Erstellt prägnante Zusammenfassungen komplexer Dokumente oder Diskussionsstränge.

Das Tool wird unter einer CC0-Lizenz entwickelt und ist somit frei für öffentliche Einrichtungen nutzbar und anpassbar.

## 4. Zielinstitutionen

*   **Senatsverwaltung Berlin / Landesregierungen:** Für die Analyse von Stellungnahmen zu Gesetzesentwürfen, die Bewertung öffentlicher Konsultationen und die Sicherstellung der Kohärenz von Politikfeldern.
*   **Universitäten (z.B. TU Berlin Open Science Lab, politikwissenschaftliche Institute):** Zur Unterstützung von Forschungsarbeiten, die große Textkorpora analysieren, z.B. vergleichende Politikwissenschaft, Diskursanalyse oder öffentliche Meinung.
*   **Nichtregierungsorganisationen (NGOs, z.B. BUND Berlin):** Zur effizienten Analyse von Gesetzestexten, zur Identifizierung von Hebelpunkten für Advocacy-Arbeit und zur Aufbereitung komplexer Sachverhalte für die Öffentlichkeit.

## 5. Technische Komponenten (Konzept)

*   **Frontend:** Web-basiertes Interface (React/Vue), das die Dokumentenverwaltung, Analysekonfiguration und Visualisierung der Ergebnisse ermöglicht.
*   **Backend:** Python-basierter Service (FastAPI/Django), der die Datenverarbeitung, LLM-Interaktion und semantische Suche orchestriert.
*   **Datenbank:** Vektor-Datenbank (z.B. ChromaDB, Weaviate) für effiziente semantische Suche; relationale DB für Metadaten.
*   **KI-Modelle:** Einsatz von Open-Source-LLMs (z.B. Llama, Mistral) und Embedding-Modellen, lokal oder über APIs (z.B. Ollama, Hugging Face).
*   **Dokument-Ingestion:** Robuste Parser für verschiedene Dokumentformate (PDF, DOCX, TXT, HTML).

## 6. Amélie 8-Vektor Bewertung

*   **Neuheit (9/10):** Die gezielte Anwendung von RAG/LLM für diese spezifische Form der öffentlichen Politik- und Bürgerfeedback-Analyse in einem Open-Source-Kontext ist innovativ.
*   **Komplexität (8/10):** Die Integration von verschiedenen KI-Komponenten, robustes Document Parsing und eine intuitive Benutzeroberfläche erfordern sorgfältige Entwicklung.
*   **Möglichkeit (9/10):** Die zugrunde liegenden Technologien sind ausgereift; inkrementelle Entwicklung ist gut möglich.
*   **Langlebigkeit (8/10):** Der Bedarf an effizienter Textanalyse in der Politik wird bestehen bleiben und mit der Verbesserung der KI-Modelle wächst der Nutzen des Tools.
*   **Civic SWOT (9/10):** Stärkt die demokratische Teilhabe, verbessert die Qualität von Politikentscheidungen und fördert Transparenz.
*   **Tech Tree Fit (9/10):** Passt gut zur bestehenden Amélie-Infrastruktur und Expertise im Bereich Web-Tools und Datenverarbeitung.
*   **Ground Truth (9/10):** Das Problem der überfordernden Textmengen ist in öffentlichen Verwaltungen und Forschungsinstituten allgegenwärtig.
*   **Spaß (9/10):** Eine intellektuell anspruchsvolle und gesellschaftlich hochrelevante Aufgabe, die cutting-edge Technologie nutzt.

## 7. SWOT-Analyse

*   **Stärken:** Automatisiert die Analyse großer Dokumentenmengen; erhöht die Transparenz und Qualität von Entscheidungsprozessen; reduziert menschliche Voreingenommenheit.
*   **Schwächen:** Initialer Aufwand für die Einarbeitung und Konfiguration; Abhängigkeit von der Qualität der LLM-Ausgaben; erfordert menschliche Überprüfung.
*   **Chancen:** Skalierbar für verschiedene Politikfelder und Sprachen; Potenzial für Integration in bestehende Verwaltungstools; Förderung der interdisziplinären Forschung.
*   **Bedrohungen:** Datenschutzbedenken bei sensiblen Dokumenten; Risiko von "KI-Halluzinationen" erfordert ständige menschliche Aufsicht; Akzeptanzschwierigkeiten bei traditionellen Analysten.
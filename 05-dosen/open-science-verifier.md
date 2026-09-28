# Amélie Dossier: Wissenschafts-Prüfstand (Open Science Verifier)

## 1. Problemstellung (Friction & Enforcement Gap)

In der öffentlichen Debatte und bei der Formulierung von Politikentscheidungen spielen wissenschaftliche Studien eine immer größere Rolle. Doch die Zugänglichkeit und Überprüfbarkeit der zugrunde liegenden Forschungsdaten, Methodologien und Software-Codes sind oft stark eingeschränkt. Dies führt zu einer asymmetrischen Informationsverteilung: Während Forschende und Auftraggeber vollen Einblick haben, fehlt zivilgesellschaftlichen Akteuren, Journalist:innen und sogar Kommunen oft die Möglichkeit, die wissenschaftlichen Grundlagen von Empfehlungen und Beschlüssen transparent zu prüfen. Diese Intransparenz schafft Reibung und eine Durchsetzungslücke im Bereich der evidenzbasierten Politikgestaltung und der öffentlichen Rechenschaftspflicht. Es erschwert eine fundierte Bürgerbeteiligung und ermöglicht es, wissenschaftliche Behauptungen ohne ausreichende unabhängige Prüfung als Entscheidungsgrundlage heranzuziehen.

## 2. Lösungsansatz (Asymmetric Inversion)

Der „Wissenschafts-Prüfstand“ ist ein Open-Source-Werkzeug, das diese Asymmetrie umkehrt. Es ermöglicht nicht-akademischen Akteuren, die Reproduzierbarkeit und Transparenz wissenschaftlicher Publikationen schnell und strukturiert zu bewerten. Anstatt auf die oft langwierige und undurchsichtige akademische Peer-Review zu warten, bietet das Tool eine erste Einschätzung der Offenheit und Prüfbarkeit einer Studie. Durch die Bereitstellung einer leicht verständlichen „Transparenz-Score“ und der Hervorhebung kritischer Metadaten wird die Fähigkeit der Zivilgesellschaft gestärkt, wissenschaftliche Evidenz kritisch zu hinterfragen und informierte Diskussionen zu führen.

## 3. Kernfunktionen

*   **Dokumenten-Upload & Analyse**: Benutzer:innen können wissenschaftliche Artikel (PDFs) oder URLs zu Studien hochladen. Das Tool extrahiert automatisch relevante Informationen.
*   **Metadaten-Extraktion**: Identifizierung von Autor:innen, Institutionen, Fördergebern (zur Erkennung potenzieller Interessenkonflikte), Publikationsdatum und Journal.
*   **Reproduzierbarkeits-Indikatoren**: Scannen des Dokuments nach Hinweisen auf offene Daten (z.B. Links zu Repositorien wie Zenodo, OSF, Dryad), offenem Code (z.B. GitHub-Links) und detaillierten Methodensektionen.
*   **Transparenz-Score**: Eine aggregierte Bewertung basierend auf der Verfügbarkeit von Daten, Code und detaillierten Methodenbeschreibungen. Eine hohe Punktzahl deutet auf eine hohe Reproduzierbarkeit hin.
*   **Schlüsselbehauptungs-Identifikation**: Extraktion und Zusammenfassung der Hauptaussagen und -ergebnisse der Studie.
*   **Strukturierter Bericht**: Generierung eines übersichtlichen Berichts, der die extrahierten Informationen und den Transparenz-Score zusammenfasst, inklusive direkter Links zu gefundenen Repositorien oder relevanten Abschnitten im Originaldokument.

## 4. Zielgruppen & Anwendungsfälle

*   **Universitäten und Open Science Labs**: Zur Förderung und Lehre von Open Science Praktiken, als Werkzeug für Studierende und Forschende zur Selbstbewertung. (z.B. TU Berlin Open Science Lab)
*   **Zivilgesellschaftliche Organisationen (NGOs)**: Für die unabhängige Überprüfung von Studien, die politische Entscheidungen beeinflussen (z.B. Umweltbundesamt, Transparency International Deutschland, BUND Berlin).
*   **Investigativer Journalismus**: Zur schnellen Einschätzung der Glaubwürdigkeit und Überprüfbarkeit wissenschaftlicher Quellen bei Recherchen.
*   **Kommunen und Stadtverwaltungen**: Bei der Bewertung von Gutachten und Studien, die Grundlage für lokale Projekte oder Verordnungen sind.

## 5. Technologische Basis

Das Tool würde auf einer Kombination aus PDF-Parsing-Bibliotheken (z.B. `pdf-parse`, `pdf.js`), Textanalyse (Reguläre Ausdrücke, ggf. leichte LLM-Integration für semantische Extraktion von Schlüsselbehauptungen und Kontextualisierung) und einer Web-Oberfläche basieren. Die Architektur wäre modular, um zukünftige Erweiterungen wie die Integration mit externen Datenbanken für Interessenkonflikte oder die Analyse spezifischer Methodentypen zu ermöglichen.

## 6. Beitrag zu Amélie

Der Wissenschafts-Prüfstand verkörpert das Amélie-Ideal der Stärkung zivilgesellschaftlicher Akteure durch Open-Source-Technologien. Er transformiert komplexe wissenschaftliche Informationen in verständliche, prüfbare Formate und fördert so eine informierte und transparente Demokratie. Durch die Inversion der Informationsasymmetrie wird ein aktiver Beitrag zur Qualität der öffentlichen Debatte geleistet und die Rechenschaftspflicht von Entscheidungsträger:innen erhöht.
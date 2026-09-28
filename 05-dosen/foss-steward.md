# FOSS Steward: Open-Source Projekt-Nachhaltigkeits-Auditor

## Problemstellung
Öffentliche Institutionen wie Universitäten, NGOs und Kommunen verlassen sich zunehmend auf Open-Source-Software (FOSS) für ihre digitalen Infrastrukturen und Dienste. Während die Vorteile von FOSS (Transparenz, Kostenersparnis, Flexibilität) weithin anerkannt sind, fehlt es oft an systematischen Methoden zur Bewertung der langfristigen Nachhaltigkeit, Sicherheit und der Projektgesundheit. Eine unzureichende Bewertung kann zu unerwarteten Wartungskosten, Sicherheitslücken durch veraltete Abhängigkeiten oder gar zum Scheitern der Implementierung führen, wenn Projekte plötzlich nicht mehr gepflegt werden.

## Die Amélie-Lösung: FOSS Steward
"FOSS Steward" ist ein CC0-Werkzeug, das öffentlichen Institutionen hilft, die Gesundheit und Nachhaltigkeit von Open-Source-Projekten objektiv zu bewerten. Durch die Analyse von Git-Repositories und zugehörigen Metadaten liefert FOSS Steward eine datengestützte Grundlage für Entscheidungen bei der Auswahl und dem Einsatz von FOSS.

### Kernfunktionen
1.  **Aktivitäts- und Aktualitätsanalyse:** Bewertung der Häufigkeit von Commits, Release-Zyklen und der Reaktionszeit auf Issues/Pull Requests.
2.  **Community- und Bus-Faktor-Analyse:** Identifizierung der Anzahl aktiver Beitragender, der Diversität der Committer und potenzieller "Bus-Faktor"-Risiken (Abhängigkeit von wenigen Schlüsselpersonen).
3.  **Abhängigkeits-Audit:** Überprüfung der Abhängigkeiten auf bekannte Sicherheitslücken (CVEs), Veraltung und Lizenzkompatibilität.
4.  **Lizenz-Compliance-Check:** Automatische Überprüfung der Projektlizenz und der Lizenzen von Abhängigkeiten auf Kompatibilität und Einhaltung.
5.  **Dokumentations- und Testabdeckungs-Indikatoren:** Abschätzung der Qualität der Dokumentation und des Vorhandenseins von Test-Suiten.
6.  **Zusammenfassende Berichte:** Generierung von leicht verständlichen Berichten und Dashboards, die Entscheidungsträgern einen schnellen Überblick über die Projektgesundheit geben.

### Technologische Basis
FOSS Steward nutzt eine Kombination aus Git-Client-Bibliotheken, Paketmanager-APIs (npm, pip, Maven etc.), statischer Code-Analyse und potenziell Machine Learning zur Mustererkennung in Projektaktivitäten. Die Ergebnisse werden über eine einfache Weboberfläche oder als API zur Integration in bestehende IT-Management-Systeme bereitgestellt.

### Institutioneller Nutzen
*   **Risikominimierung:** Reduziert das Risiko, in unzureichend gepflegte oder unsichere FOSS-Projekte zu investieren.
*   **Informierte Entscheidungen:** Ermöglicht datenbasierte Auswahl von FOSS, die den langfristigen Anforderungen der Institution entspricht.
*   **Ressourceneffizienz:** Vermeidet unnötige Wartungskosten und Sicherheitsaudits durch frühzeitige Erkennung von Problemen.
*   **Förderung nachhaltiger FOSS-Nutzung:** Stärkt das Bewusstsein für die Bedeutung von Projektgesundheit und -community.

FOSS Steward unterstützt öffentliche Institutionen dabei, die Potenziale von Open-Source-Software verantwortungsvoll und nachhaltig zu nutzen.

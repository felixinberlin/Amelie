# Datensatz-Historiker (OpenDataGit)

## Hypothese
Das Fehlen einer transparenten, nachvollziehbaren Versionsverwaltung und klarer Beteiligungsmöglichkeiten für öffentliche Datensätze auf kommunalen und NGO-Open-Data-Portalen führt zu Reibungsverlusten bei Datennutzern und behindert die Verbesserung der Datenqualität.

## Problem
Offene Daten sind ein Eckpfeiler moderner, transparenter Verwaltung und zivilgesellschaftlicher Arbeit. Doch in der Praxis stehen Datennutzer, Forscher und die Öffentlichkeit oft vor Herausforderungen:
*   **Mangelnde Versionierung:** Datensätze werden oft als statische Schnappschüsse ohne klare Historie veröffentlicht. Es ist schwer zu erkennen, wann und wie sich Daten geändert haben.
*   **Fehlende Nachvollziehbarkeit:** Bei Datenänderungen ist oft nicht ersichtlich, wer sie vorgenommen hat, wann und warum. Dies untergräbt das Vertrauen in die Daten.
*   **Schwierige Beteiligung:** Bürger oder Experten, die Fehler entdecken oder Ergänzungen vorschlagen möchten, haben selten einen einfachen, standardisierten Weg, dies zu tun. Der Prozess ist oft intransparent und reaktiv.
*   **Hoher manueller Aufwand:** Datenverantwortliche müssen Änderungen mühsam dokumentieren oder verwalten, was fehleranfällig und ineffizient ist.

Diese Defizite erschweren die Nutzung offener Daten für Forschung, Analyse und bürgerschaftliches Engagement und bremsen die Qualitätsentwicklung der Daten selbst.

## Lösung: Datensatz-Historiker (OpenDataGit)
Der "Datensatz-Historiker" ist ein Open-Source-Tool, das die Leistungsfähigkeit von Git – dem Standard für Code-Versionsverwaltung – auf strukturierte, öffentliche Datensätze überträgt. Es bietet eine benutzerfreundliche Oberfläche, um Datenänderungen transparent zu verfolgen, zu verwalten und die Kollaboration zu fördern.

### Kernfunktionen
1.  **Automatisierte Versionsverwaltung:** Überwacht konfigurierte Datensätze (z.B. CSV, JSON, GeoJSON) in einem Git-Repository. Bei erkannten Änderungen werden diese automatisch als neue Versionen (Commits) gespeichert.
2.  **Detaillierte Änderungsübersicht (Diffs):** Erzeugt menschenlesbare Diffs, die nicht nur technische Unterschiede zeigen, sondern semantische Änderungen hervorheben (z.B. "Zeile X geändert: Feld 'Name' von 'Alt' zu 'Neu'").
3.  **Transparente Historie:** Bietet eine intuitive Weboberfläche zur Durchsuchung der gesamten Datenhistorie, zum Vergleich beliebiger Versionen und zur Nachvollziehbarkeit jeder einzelnen Änderung.
4.  **Kollaborations-Workflow:** Ermöglicht externen Nutzern (z.B. Forschern, interessierten Bürgern), Korrekturen oder Ergänzungen zu Datensätzen vorzuschlagen. Diese "Daten-Pull-Requests" können von den Datenverantwortlichen überprüft, diskutiert und bei Zustimmung in den Hauptdatensatz übernommen werden.
5.  **Rollback-Funktionalität:** Einfaches Zurücksetzen von Datensätzen auf frühere Versionen bei Fehlern oder unerwünschten Änderungen.
6.  **API-Zugriff:** Bietet eine einfache API, um die aktuelle oder historische Versionen von Datensätzen abzurufen.

## Vorteile
*   **Erhöhte Transparenz & Vertrauen:** Jede Datenänderung ist nachvollziehbar, was das Vertrauen in die veröffentlichten Daten stärkt.
*   **Verbesserte Datenqualität:** Der kollaborative Ansatz ermöglicht es der Community, zur Fehlerbehebung und Datenanreicherung beizutragen.
*   **Effiziente Datenverwaltung:** Automatisiert die Versionskontrolle und reduziert den manuellen Aufwand für Datenverantwortliche.
*   **Ermöglicht Forschung & Analyse:** Forscher können Datenänderungen über die Zeit analysieren und ihre Studien auf verifizierbare Datenversionen stützen.
*   **Förderung der Bürgerbeteiligung:** Bietet eine niedrigschwellige Möglichkeit für Bürger, sich aktiv an der Pflege öffentlicher Daten zu beteiligen.

## Zielinstitutionen
*   **Kommunalverwaltungen:** Für Open-Data-Portale (z.B. Senatsverwaltung Berlin, Open Data Portal), zur transparenten Verwaltung von Planungsdaten, Haushaltsdaten, Umweltdaten.
*   **Universitäten & Forschungseinrichtungen:** Zur Versionskontrolle von Forschungsdatensätzen und zur Ermöglichung kollaborativer Datenpflege in Open-Science-Projekten.
*   **Nichtregierungsorganisationen (NGOs):** Zur transparenten Veröffentlichung und Verwaltung von Monitoring-Daten, Projektberichten und Umweltdaten, oft mit Bürgerwissenschafts-Komponente.

Der "Datensatz-Historiker" transformiert Open-Data-Portale von statischen Archiven in dynamische, vertrauenswürdige und kollaborative Datenquellen.
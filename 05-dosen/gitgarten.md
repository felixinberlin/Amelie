# GitGarten: Ein kollaborativer Wissens- und Datengarten auf Git-Basis

## 1. Vision & Mission
GitGarten ist ein Open-Source-Tool, das die Leistungsfähigkeit des Versionskontrollsystems Git für die kollaborative Verwaltung und Bearbeitung von Daten und Dokumenten für nicht-technische Benutzer zugänglich macht. Es zielt darauf ab, die Transparenz, Auditierbarkeit und Zugänglichkeit von Open Data, Forschungsdokumenten und internen Verwaltungsvorschriften zu verbessern. Die Mission ist es, eine intuitive Plattform zu schaffen, die es Universitäten, Kommunen und NGOs ermöglicht, gemeinsam an textbasierten Daten (Markdown, JSON, CSV, Textdateien) zu arbeiten, ohne sich mit der Komplexität von Git-Befehlen auseinandersetzen zu müssen.

## 2. Problemstellung
Viele öffentliche und wissenschaftliche Einrichtungen stehen vor ähnlichen Herausforderungen bei der Verwaltung von Informationen:
*   **Fehlende Versionierung:** Daten und Dokumente werden oft ohne klare Versionshistorie gespeichert, was die Nachvollziehbarkeit von Änderungen erschwert.
*   **Mangelnde Kollaboration:** Die gemeinsame Bearbeitung ist oft auf proprietäre Tools beschränkt oder erfordert manuelle Abstimmungsprozesse, die fehleranfällig sind.
*   **Zugangsbarrieren:** Robuste Versionskontrollsysteme wie Git sind primär für Softwareentwickler konzipiert und für Geisteswissenschaftler, Sachbearbeiter oder Bürgerinitiativen schwer zugänglich.
*   **Transparenzdefizite:** Die öffentliche Bereitstellung von Daten erfolgt oft statisch, ohne die Möglichkeit, Beiträge oder Korrekturen transparent zu verfolgen.

## 3. Lösungsansatz: GitGarten
GitGarten überbrückt diese Lücke, indem es eine webbasierte Benutzeroberfläche bereitstellt, die Git-Operationen abstrahiert. Benutzer können Dokumente und Datensätze direkt im Browser bearbeiten, Änderungen vorschlagen, überprüfen und veröffentlichen, während im Hintergrund alle Aktionen als Git-Commits protokolliert werden. 

**Kernfunktionen:**
*   **Browserbasierte Bearbeitung:** Direkte Bearbeitung von Markdown-, JSON-, CSV- und einfachen Textdateien über einen benutzerfreundlichen Editor.
*   **Intuitive Versionierung:** 'Änderung vorschlagen' und 'Veröffentlichen' ersetzen `git add`, `git commit` und `git push`. Jede Aktion erzeugt einen Git-Commit mit klarer Autorenschaft und Zeitstempel.
*   **Visuelles Diffing:** Einfaches Vergleichen von Versionen mit einer visuellen Darstellung der Änderungen, auch für nicht-code-basierte Inhalte.
*   **Kollaborations-Workflows:** Unterstützung von Branching und Merging durch einfache 'Vorschläge überprüfen' und 'Zusammenführen'-Funktionen, die Pull Requests ähneln.
*   **Zugriffsmanagement:** Granulare Rechteverwaltung, um festzulegen, wer welche Dokumente bearbeiten oder überprüfen darf.
*   **API-Zugang:** Eine API, die den Zugriff auf die Git-Historie und -Inhalte ermöglicht, für Integrationen mit anderen Systemen.

## 4. Technischer Unterbau
*   **Backend:** Node.js (Express.js) oder ähnliches, das eine Git-Bibliothek (z.B. `isomorphic-git` oder Wrapper um systemeigenes Git) nutzt, um Repository-Operationen durchzuführen.
*   **Frontend:** React/Vue/Svelte für eine dynamische und reaktionsschnelle Benutzeroberfläche.
*   **Datenhaltung:** Git-Repository als primärer Datenspeicher. Dateisystem für die Speicherung der Repositorys. Möglicherweise `git-lfs` für größere Binärdateien, falls erforderlich.
*   **Authentifizierung:** OAuth2/OpenID Connect für die Integration in bestehende Identitätssysteme.

## 5. Anwendungsfälle
*   **Open Science:** Gemeinsame Erstellung und Versionierung von Forschungsdaten, Metadaten und Publikationen in Universitäten.
*   **Open Data:** Kollaborative Pflege von Datensätzen und Metadaten auf kommunalen Open-Data-Portalen, z.B. für Baumkataster, Infrastrukturdaten, etc.
*   **Verwaltung:** Erstellung und Versionierung von internen Richtlinien, Handbüchern oder Protokollen in Behörden.
*   **NGOs:** Gemeinsame Erarbeitung von Policy-Papieren, Berichten und Wissensdatenbanken.

## 6. Nachhaltigkeit & Skalierbarkeit
Durch die Nutzung von Git als Kerntechnologie ist GitGarten extrem robust und zukunftssicher. Die Daten sind nicht in einem proprietären Format gefangen und können jederzeit mit Standard-Git-Tools exportiert oder weiterverarbeitet werden. Der modulare Aufbau als Webanwendung ermöglicht eine einfache Skalierung und Anpassung an verschiedene institutionelle Anforderungen.
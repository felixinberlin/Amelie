# OpenScience-Physik-Auditor: Reproduzierbarkeits-Radar für Forschungsartefakte

## Das Problem: Die Reproduzierbarkeitslücke in der Physik
Die moderne Physik, insbesondere in Bereichen wie Computational Physics, Astrophysik, Materialwissenschaften und Biophysik, ist stark von komplexen Datensätzen und elaboriertem Code abhängig. Trotz des wachsenden Bewusstseins und der Forderung nach Open Science bleibt die tatsächliche Reproduzierbarkeit von Forschungsergebnissen eine große Herausforderung. Studien zeigen, dass ein erheblicher Teil der veröffentlichten wissenschaftlichen Resultate nicht reproduzierbar ist, oft weil die zugrundeliegenden Daten, Analyse-Skripte oder Simulationscodes entweder nicht verfügbar, schlecht dokumentiert oder nicht funktionsfähig sind. Dies schafft eine signifikante Reibung für die wissenschaftliche Gemeinschaft: Forschende können Ergebnisse nicht effizient überprüfen, darauf aufbauen oder neue Hypothesen testen. Die 'Enforcement Gap' liegt darin, dass existierende Peer-Review-Prozesse selten die Ressourcen oder die Expertise haben, um die Reproduzierbarkeit von Code und Daten rigoros zu prüfen.

## Die Amélie-Lösung: Reproduzierbarkeits-Radar
Der „OpenScience-Physik-Auditor“ ist ein Open-Source-Tool, das als 'Reproduzierbarkeits-Radar' fungiert. Es soll die Reibung bei der Überprüfung der Reproduzierbarkeit minimieren und die Einhaltung von Open Science-Prinzipien in der Physik fördern. Das Tool analysiert öffentlich zugängliche Forschungsartefakte (z.B. Git-Repositories auf GitHub, GitLab, oder Datenarchive auf OSF) und bewertet deren 'Reproduzierbarkeitsbereitschaft'.

### Funktionsweise:
1.  **Repository-Scan:** Das Tool empfängt Links zu Code- oder Daten-Repositories, die mit einer wissenschaftlichen Publikation verknüpft sind.
2.  **Struktur- und Metadatenanalyse:** Es identifiziert typische Verzeichnisstrukturen (`data/`, `src/`, `notebooks/`), prüft auf Metadatendateien (`CITATION.cff`, `README.md`, `LICENSE`), Abhängigkeitsmanagement-Dateien (`requirements.txt`, `environment.yml`, `package.json`) und Container-Definitionen (`Dockerfile`).
3.  **Indikator-Bewertung:** Basierend auf einer konfigurierbaren Checkliste von Best Practices für reproduzierbare Forschung (z.B. Vorhandensein von Tests, klarer Dokumentation, Umgebungsspezifikationen) generiert das Tool einen 'Reproduzierbarkeits-Score' oder einen detaillierten Bericht.
4.  **Feedback und Empfehlungen:** Es bietet konkrete Verbesserungsvorschläge, um die Transparenz und Reproduzierbarkeit der Artefakte zu erhöhen.
5.  **Visualisierung:** Ein einfaches Dashboard oder eine Berichtseite visualisiert den Status der Reproduzierbarkeitsbereitschaft, ideal für Forschende, Gutachter und Förderorganisationen.

## Zielinstitutionen und Anwendungsbereiche
Universitäten (z.B. TU Berlin Open Science Lab), Forschungsinstitute (z.B. Helmholtz-Zentrum Berlin), wissenschaftliche Verlage und Förderorganisationen. Es kann von Forschenden zur Selbstbewertung, von Gutachtern zur Unterstützung des Peer-Review-Prozesses und von Institutionen zur Förderung von Open Science-Praktiken eingesetzt werden.

## Technologische Basis
Das Backend könnte in Python (mit Bibliotheken wie `Pydantic` für Datenvalidierung, `GitPython` für Repository-Interaktion) und das Frontend mit TypeScript/React entwickelt werden. Die Ausführung in einer containerisierten Umgebung (Docker) ist für die Reproduzierbarkeitsprüfung selbst von Vorteil. Die Integration mit bestehenden Plattformen (GitHub API, GitLab API, OSF API) ist entscheidend.

## Wirkung und Nachhaltigkeit
Der „OpenScience-Physik-Auditor“ trägt direkt zur Erhöhung der wissenschaftlichen Transparenz und Integrität bei. Durch die Automatisierung der Überprüfung reduziert er die Hürden für Forschende, ihre Arbeit reproduzierbar zu gestalten, und ermöglicht Gutachtern eine effizientere Bewertung. Als Open-Source-Projekt kann es von der Gemeinschaft weiterentwickelt und an neue Anforderungen angepasst werden, was seine Langlebigkeit sichert.
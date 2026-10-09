# Mail 6 — Glasanflug-Ampel → NABU Jena

**Status: GESENDET am 09.10.2026, vom Nutzer um 13:36 Uhr (Europe/Berlin) bestätigt.** Kein Versand durch den Agenten; keine unabhängige Postfachprüfung.
**An:** vogelschlag@nabu-jena.de
**Betreff:** Ein offenes Werkzeug für Ihre Vogelschlag-Arbeit: Glasanflug-Ampel
**Dose:** `05-dosen/glasanflug-ampel.md`
**Frontend-ID:** `mail-nabu-jena-2026-10-09` (nicht `mail-6`, dort steht Tessl).

Dies ist der erste bestätigte Versand an NABU Jena. Die frühere Mail an eine NABU-Sammeladresse vom 22.09. und deren Antwort vom 29.09. sind ein eigener Vorgang, keine Antwort von Jena. Nicht automatisch nachfassen.

## Gesendete Fassung

Liebes NABU-Jena-Team,

Sie haben mit dem Vogelschlagmelder eine wichtige Grundlage geschaffen, um gefährliche Glasflächen sichtbar zu machen. Ich bin Softwareentwickler und habe ein kleines, frei nutzbares Werkzeug gebaut, das Ihre Arbeit ergänzen könnte: die **Glasanflug-Ampel**.

Die Idee dahinter: Beobachtungen an einer Fassade in ein nachvollziehbares Bewertungsblatt nach dem LAG-VSW-Schema übertragen – mit sichtbaren Quellen und ausdrücklich offenen Angaben, wenn etwas nicht bekannt ist.

Die aktuelle Demo bietet:
- eine manuelle Bewertung anhand der vier Kriterien,
- eine Adresssuche und Abfragen realer Gehölzdaten aus OpenStreetMap sowie dem offiziellen Berliner Baumkataster,
- einen Export der Bewertung einschließlich Eingaben, Quellen und ungeklärter Punkte.

Hier können Sie das Werkzeug direkt ausprobieren:
https://felixinberlin.github.io/Amelie/#dose=glasanflug-ampel

Mir ist wichtig, die Grenzen offen zu benennen: Die Demo wertet noch keine Fassadenfotos automatisch aus. Die angezeigten Baumabstände beziehen sich auf den ausgewählten Kartenpunkt, nicht auf eine vermessene Glasscheibe. Fehlende Karteneinträge werden deshalb niemals als fehlende Vegetation gewertet. Das Werkzeug ersetzt keine fachliche Beurteilung vor Ort.

Der Code und die Tests liegen offen vor:
https://github.com/felixinberlin/Amelie/tree/main/src/engine/glasanflug

Ich entwickle das im Rahmen meines offenen Projekts **Amélie**: praktische Werkzeuge bauen und sie Menschen zur Verfügung stellen, die damit etwas Gutes bewirken können. Der eigene Code steht unter CC0; für eingebundene Geodaten gelten die jeweiligen Quellenlizenzen.

Falls einzelne Teile für Ihre Beratung oder den Vogelschlagmelder hilfreich sind, dürfen Sie sie übernehmen und weiterentwickeln. Daraus entsteht keine Verpflichtung – weder zur Integration noch zu einer Antwort.

Vielen Dank für Ihre Arbeit zum Schutz der Vögel.

Herzliche Grüße aus Brandenburg
Félix Martínez Resendiz

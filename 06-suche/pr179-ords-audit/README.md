# ORDS-Datentest für bestehenden K3 — 08.10.2026

Deterministischer Voll-CSV-Test für `reparaturfall-pflichtabgleich`, keine Fallprüfung und keine neue Dose. Drei native Recherche-Engines plus unabhängiger Reviewer; keine Vertex-/Jules-/externen Modellaufrufe.

Quelle: [Open Repair Alliance, Release 202507](https://github.com/openrepair/data/tree/90eba80740506b4fa283288780d34e9e7e01deef/aggregated/202507). Revision und SHA-256 stehen in `result.json`; der Rohdatensatz verbleibt außerhalb des Repositories. ORA-Daten sind **CC BY-SA 4.0**, separat vom eigenen Code; keine realen Zeilen oder Freitexte werden hier als CC0 weitergegeben. Auch bei Weitergabe der abgeleiteten Aggregation Quelle und Lizenz beibehalten.

## Reproduktion

Den in `result.json` unter `source_url` fixierten CSV außerhalb des Repositories speichern, dann:

```sh
python3 06-suche/pr179-ords-audit/audit.py /tmp/amelie-ords-202507.csv > /tmp/amelie-ords-recheck.json
cmp 06-suche/pr179-ords-audit/result.json /tmp/amelie-ords-recheck.json
```

Der Test wurde zweimal mit identischem Ergebnis ausgeführt. Das Skript benötigt nur Python-Standardbibliothek, keine Modelle, API-Schlüssel oder Server.

## Befund

305.649 Beobachtungen vom 12.06.2012 bis 31.07.2025; 29.911 ausgefüllte Barrieren. Ersatzteile: 7.151 „nicht verfügbar“ + 4.632 „zu teuer“ = 11.783 Beobachtungen, davon 5.229 mit Alters- oder Baujahrswert. Deutschland: 36.183 Zeilen, davon 1.770 Ersatzteilbarrieren. Diese Zahlen beschreiben Beobachtungen; Alter/Baujahr ist kein Nachweis der Marktbereitstellung. Eine nichtleere Marke ist nicht automatisch eine verifizierte Marke.

Modellkennung, konkrete Teilidentität, Marktbereitstellung, letzte Marktbereitstellung, Bestell-/Lieferdatum und Anfragendenklasse fehlen als strukturierte Spalten. Nichtleere Freitexte wurden nicht auf solche Tatsachen geprüft; fehlende Spalten beweisen keine Abwesenheit in der realen Welt. Kategorien sind zu breit für zuverlässige Rechtszuordnung. Keine Alters-/Kategorie-Kohorte wird als rechtsbetroffen, anspruchsberechtigt oder Verstoß klassifiziert.

Der ursprüngliche quantitative K3-Feasibility-Test ist damit als Abdeckungsprüfung erledigt; die individuelle Pflichtprüfung bleibt **Needs Research (22/35)**. Das Vollständigkeitsgate ist ein Baustein (26/35, V1 2), keine Dose. Wiederaufnahme nur mit empfängergetragener, zulässig nutzbarer Stichprobe zu Modell, Teil, Geltungsbereich und datierten Anfrage-/Ergebnisbelegen. Kein Versand.

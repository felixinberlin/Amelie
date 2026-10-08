# Ticket 02: Normtext-Abgleich und historische Real-Fixture

**Komponente:** `07-demos/vernichtungs-offenlegungsregister` / `src/engine/vernichtungs-offenlegungsregister`
**Status:** Abgeschlossen am 08.10.2026; 39 Kern-Regressionstests, insgesamt 729 Tests grün. Quellen-, Schema- und Produktionsprüfungen bestanden.
**Zuständigkeit:** Civic Tech / Quellenprüfung
**Zugehörige Dose:** [Vernichtungs-Offenlegungsregister](https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister)

## Ziel / Goal

Die fachlich falschen Annahmen des ursprünglichen Ticket 01 werden durch ein quellengebundenes Datenmodell und eine echte Übertragung ersetzt. Dessen historische Akzeptanzkriterien bleiben unverändert dokumentiert; insbesondere die allgemeine Ausnahmeliste wird nicht nachgebaut. This ticket supersedes the provisional assumptions without rewriting the original contract.

## Aufgabenpakete

- Normtext-Abgleich mit konkreten Fundstellen dokumentieren; künftiges Pflichtformat von historischen Angaben trennen.
- Schema und deterministischen Prüfer korrigieren: Kategorien, freie Gründe, gewichtsbezogene Behandlung einschließlich unbekannt, separate Vernichtungssumme, Mengen-Schätzungen, Verpackung, Prävention und Kopf-/Periodenangaben.
- Signify GJ 2025 von Hand mit Seitenbelegen, Quell-URL, Abrufdatum und SHA-256 übertragen; publizierte Widersprüche erhalten.
- Deutsche/englische Dose, Frontend, Buchkapitel, Exporte und Bibliotheksgedächtnis synchronisieren.

## Akzeptanzkriterien / Definition of Done

1. Der Normtext-Abgleich benennt Artikel/Anhänge und erklärt CN-Ziffern, freie Gründe, fünf Behandlungs-Komponenten, Gewichtsbezug, separate Vernichtungssumme und zeitlichen Anwendungsbereich.
2. Beide Fixture-Gruppen validieren gegen das JSON-Schema; die reale Fixture enthält sechs Signify-Zeilen, Quellenherkunft und ausdrücklich unbekannte Ermittlungsmethoden. Die Provenienz erhält Dezimalgewichte und den publizierten Wert 0 % Vernichtung neben 100 % Beseitigung.
3. Tests sichern freie Gründe ohne Ausnahmewhitelist, korrekte CN-Granularität, unbekannte Behandlung, gerundete Anteile, separate Vernichtungssumme, Schätzung je Mengenfeld und historische/künftige Prüfgrenzen ab.
4. Ungültige Eingaben werden abgewiesen; neutrale Registerstatus und als Frage formulierte Befunde bleiben erhalten. Kein Gesamturteil wird eingeführt, und die bestehende Nutzung durch `umsetzungsplan-register` bleibt grün.
5. Die vorhandene Leistungsprüfung für 500 Offenlegungen × 10 Positionen bleibt unter 100 ms. Schema und Engine benennen denselben überprüften Stand; der Testlauf bleibt vollständig grün.
6. Bilinguale Dossiers und Frontend enthalten das datierte Forschungsupdate, Quellen, Grenzen und nächsten Schritt. `export:data`, `lint`, `test` und Produktionsbuild bestehen. Quellen und Nachprüfung sind vom Bibliothekar gebucht.

Lizenz: CC0 1.0 Public Domain.

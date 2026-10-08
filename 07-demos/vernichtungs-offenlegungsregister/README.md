# Vernichtungs-Offenlegungsregister — quellengeprüfter Übertragungskern

Ein lokaler deterministischer Prüfer für übertragene Offenlegungen zu **entsorgten** unverkauften Verbraucherprodukten nach Art. 24 ESPR. Das Register kennt nur **„gefunden“** oder **„keine Offenlegung gefunden (Stand, Suchweg)“**. Das ist keine Prüfung, ob ein Unternehmen einer Pflicht unterliegt oder diese erfüllt.

*Destruction Disclosure Register: a local transcription checker with source provenance and two neutral register statuses. CC0 gift for public-interest use.*

## Forschungsupdate / Research update — 08.10.2026

Die [Normtext-Nachprüfung](normtext-abgleich-2026-10-08.md) ersetzt die vorläufigen Annahmen vom 28.09.2026. DVO (EU) 2026/2 Art. 1–7/Anhänge I–III und ESPR Art. 24–26 wurden gelesen; die Ausnahmen vom Vernichtungsverbot wurden als gesonderter Regelungsbereich geprüft. Die erste reale Fixture enthält sechs Signify-Zeilen für GJ 2025 mit SHA-256 und Seitenbelegen. Beide PDF-Seiten wurden auch visuell geprüft.

**Schema-Stand:** `gegen Normtext geprüft am 2026-10-08`. Das ist der Quellenstand des Übertragungsmodells, keine Zertifizierung. Schema und Prüfer erfassen technische Daten, nicht die vollständige visuelle Darstellung des gesetzlichen Formulars oder sämtliche individuellen Rechtsvoraussetzungen.

*Primary sources replaced the snippet-based assumptions. The first real fixture is manually transcribed and visually checked. The schema status describes source verification, not company compliance.*

## Korrigierte Datenregeln

- KN-Kategorien grundsätzlich zwei Stellen, vier für die in Anhang II genannten Kategorien. Bei unzureichender Produktbeschreibung bleibt die Zuordnung eine Frage.
- Gründe als offene Texte; keine pauschale Liste zulässiger Ausnahmen. Im künftigen Format werden unterschiedliche Gründe auf getrennte Zeilen verteilt.
- Gewichtsbezogene Behandlungsanteile: Vorbereitung zur Wiederverwendung, Recycling, sonstige Verwertung, Beseitigung und ausdrücklich unbekannte Behandlung. Wiederaufarbeitung ist kein zusätzlicher sechster Anteil.
- Vernichtung wird separat als Summe aus Recycling, sonstiger Verwertung und Beseitigung erfasst und nie noch einmal in die Komponentensumme gezählt.
- Schätzkennzeichnungen für Stückzahl und Gewicht getrennt. Eine fehlende Angabe ist kein Nachweis einer Messung. Verpackungsgewicht, Präventionsmaßnahmen, Rechtsträger und Zeitraum können mitgeführt werden; unbelegte Felder bleiben unbekannt.
- Eine Position führt derzeit genau einen KN-Code. Mehrfach-Codes für gemeinsam verkaufte Sets sind nicht vollständig abgebildet; solche Fälle brauchen manuelle Dokumentation und eine spätere Modellerweiterung.
- Die Toleranz gerundeter Prozentwerte und grobe kg/Stück-Spannen sind technische Übertragungshilfen, keine Rechtsnormen. Das normalisierte Modell ersetzt keine Prüfung der amtlichen Formularansicht.

## Historische Quellen und künftiges Format

`pruefmodus: "historisch"` ist der Standard. Ein zukünftiger Anhang-I-Vergleich wird nur mit `pruefmodus: "anhang-i"` ausdrücklich gewählt; auch dann entscheidet der Kern nicht über die individuelle Pflicht. Nach Art. 1/7 der DVO gilt das Format für das erste volle Geschäftsjahr nach dem 02.03.2027; bei Kalender-GJ folgt daraus 2028 mit Veröffentlichung bis Ende 2029. Die zwölfmonatige Frist wird nicht rückwirkend als ursprüngliche Art.-24-Frist ausgegeben.

Die Signify-Fixture bleibt historisch. Ihre Dezimalgewichte werden nicht gerundet, ihre freien Gründe nicht in Ausnahme-Codes umgeschrieben. Die Quelle nennt pro Zeile 100 % Beseitigung und separat 0 % Vernichtung. `V6-VERNICHTUNGSSUMME` fragt nach dieser Übertragung; es gibt keine stille Korrektur und keinen Vorwurf. Siehe [Daten und Provenienz](data/README.md).

## Sicherheitsnachweis / Safety case

1. Keine Gesamtbewertung: Das Ergebnis enthält nur Unternehmen, GJ, Schema-Stand, Fragen und unbekannte Felder.
2. Jede Frage trägt eine Regel-ID, `art: "frage"` und Klartext auf Deutsch/Englisch. Der Sprachwächter verhindert Vorwurfswörter in generierten Ausgaben.
3. Gefundene Angaben brauchen Quell-URL und Abrufdatum; nicht gefundene brauchen Datum und Suchweg. Ein optionaler Snapshot ergänzt die Herkunft, ersetzt die Originalquelle aber nicht.
4. Ungültige Zahlen, Anteile, Wege und doppelte Positionen werden abgewiesen. Unbekannte Werte werden nicht als Null oder als Erfüllung behandelt.
5. Kein Ranking, keine Quote gegen eine angenommene Unternehmensliste, keine automatische Zustellung. Die Registerlogik bleibt mit `umsetzungsplan-register` kompatibel.
6. Der Kern arbeitet offline ohne Modell, Schlüssel oder Server. Keine Vertex-Credits erforderlich.

## Module und Regeln

| Datei | Aufgabe |
|---|---|
| `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.ts` | `pruefeOffenlegung`, `erstelleRegister`, `registerAlsCsv`, Sprachwächter |
| `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.test.ts` | Regression, Primärformat, historische Fixture, JSON-Schema und Invarianten |
| `anhang1-schema.json` | Normalisiertes Übertragungsmodell mit Quellenstand |
| `data/synthetische-offenlegungen.json` | Getrennte konstruierte Testfälle |
| `data/reale-offenlegungen.json` | Signify GJ 2025, sechs echte Übertragungszeilen |
| `data/signify-2025-provenienz.json` | Originalzahlen, Seitenzuordnung, Quelle und SHA-256 |

`V0-FREITEXT`: Übertragung aus Fließtext; `V1-PROZENTSUMME`: Komponentensumme; `V2-GRUND`: Grund/Zeilenzuordnung; `V3-CN-CODE`: künftige Granularität; `V4-STUECK-GEWICHT`: Mengenheuristik; `V5-SCHAETZUNG`: Schätzgrundlage; `V6-VERNICHTUNGSSUMME`: separate Teilsumme; `V7-ANHANG-FELD`: Felder im ausdrücklich gewählten künftigen Vergleich.

## Ausführen / Run

```sh
npx vitest run src/engine/vernichtungs-offenlegungsregister src/engine/umsetzungsplan-register --maxWorkers=2
npm run export:data
npm run lint
npm test -- --maxWorkers=2
npm run build
```

## Tickets und nächste Grenze

- [Ticket 01](ticket-01-anhang1-pruefer.md): ursprünglicher Vertrag, fachlich durch Ticket 02 ersetzt; historische Akzeptanzkriterien bleiben lesbar.
- [Ticket 02](ticket-02-normtext-und-realfixture.md): Quellenabgleich, korrigierter Kern und reale Fixture.
- [Ticket 03](ticket-03-kuratierter-pilot.md): offen; zweite unabhängige Offenlegung, datierte Auswahl und kuratierter Pilot. Empfängerbedarf und Kontakt vor Zustellung verifizieren.

ESPR Art. 26 verlangt künftige konsolidierte Kommissionsinformationen. Der zusätzliche Nutzen eines größeren Registers muss deshalb vor einem Pilot erneut geprüft werden. Diese Runde war Quellen- und Implementierungsarbeit, kein erneuter Neuheitsreview.

[Die Dose / The Dose](https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister)

Lizenz: CC0 1.0 Public Domain. Verlinkte Originaldokumente sind nicht Teil dieser Lizenzzusage.

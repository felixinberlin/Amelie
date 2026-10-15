# Literaturprüfung und Umsetzungsstand — 15.10.2026

**Ergebnis:** Die Offline-Seite verwendet denselben TypeScript-Kern wie die Tests. Acht synthetische Beispiele bleiben von einem begrenzten Literaturbeispiel getrennt. Ticket 01 bleibt insgesamt offen: Der publizierte Folgeabschnitt ist kein vollständiges Zeichenregister mit unabhängig validierter historischer Deutung.

## Direkt geprüfte Primärquelle

Alison de Turberville, Oxford Archaeology, *No 57 and 58a, West Wycombe Village: Historic Building Investigation and Recording*, Issue 1, OA Job 5497. Bericht Juli 2013, Titelseite Juni 2013. [Original-PDF](https://eprints.oxfordarchaeology.com/6442/16/WWBSBS_57-58a_High_Street.pdf), §2.3.1, gedruckte Seite 6, zwölfte PDF-Seite (Index 11). Am 15.10.2026 direkt gelesen; heruntergeladenes PDF als 77 Seiten verifiziert, relevante Seite lokal gerendert und gelesen. SHA-256: `1bca30e150d13d8c991d8ec9681c8037bc76ecd43a4e6fed9d17687440b70524`.

Berichtet wird eine fortlaufende Markierungsreihe von I bis IIII am Westende eines zentralen Balkens. Der Bericht deutet die Situation unter Einbeziehung der Bausubstanz. Unsere Daten übernehmen nur die Zahlenreihe; die Software übernimmt keine bauliche Erweiterungs- oder Unversehrtheitsdiagnose.

Fixture: `data/west-wycombe-2013.json`. Vier Datensätze stehen für **Markierungsstellen an einem Träger**, nicht vier dokumentierte Balken. II und III sind aus dem ausdrücklich fortlaufenden Bereich ausformuliert, nicht einzeln aus Fotos abgelesen. Positionen sind Ordinalzahlen ohne gemessene Abstände oder behauptete Himmelsrichtung. `wand` ist nur ein Gruppenschlüssel, `rolle=sonstiges` kennzeichnet diese Modellübertragung. Das englische Werkzeug „race knife“ ist grob als `reissmesser` abgebildet.

Der Regressionstest erwartet für diesen Abschnitt keine Auffälligkeit. Ein zweiter Test entfernt künstlich III und erwartet einen Lückenhinweis; diese Veränderung ist synthetisch, kein historischer Fehlbefund. Die Prüferausgabe bestätigt weder einen vollständigen Originalbau noch die fachliche Deutung der Quelle. Fremdserien-, Doppelungs- und Umsetzungsregeln sind damit nicht historisch validiert.

## Weitere gelesene Quellen und Zugangsgrenze

- [DSD Kulturspur](https://www.denkmalschutz.de/denkmale-erhalten/kulturspur-2022/forschungsmethoden-und-spuren/abbundzeichen.html) erläutert Montagezeichen und zusammengehörige Verbindungen, bietet im Seitentext aber kein räumliches Einzelregister. Derselbe Wert kann an zusammengehörigen Hölzern beabsichtigt sein.
- [JH-Ingenieure / Hofer](https://www.ing-hofer.de/2019/07/27/abbundzeichen/) erklärt Systeme und Folgen. Die abgebildete Typentafel ist kein Register einer realen Wand. Keine Wand aus einem Zeichenalphabet erfunden.
- [Raking Light](https://rakinglight.co.uk/uk/arabic-assembly-marks-in-medieval-timber-framed-buildings/) berichtet reale arabische Zeichensysteme. Der Roman-Parser ist kein universeller Abbundzeichenleser.
- Ein National-Trust/MOLA-Bericht über Knole, §4.3.4.3 S. 41, erscheint als Suchindex mit vertauschten Werten 4/5. Beide direkten PDF-Abrufe scheiterten; ein als PDF gespeicherter HTTP-Fehler war HTML. Deshalb kein Knole-Fall im ausgeführten Datensatz und kein behaupteter Volltextabgleich.

Die ursprüngliche Recherche vom 27.09.2026 bleibt eine Schnipselrecherche. Die obigen späteren Direktlesungen ersetzen weder deren vollständige Existenzprüfung noch die noch offene VA-49/1-Formatprüfung. Empfängerkontakt weiterhin unverifiziert; nichts versendet.

## Rechte, Reichweite und nächster Schritt

Unsere faktische Transkription und eigener Code stehen unter CC0. Das Original-PDF und Abbildungen sind urheberrechtlich gekennzeichnet; keine fremden Bilder, Zeichnungen oder längeren Textpassagen sind in der Anwendung enthalten. Der Quellbericht wird verlinkt, nicht als CC0 ausgegeben.

Zur vollständigen Ticket-01-Abnahme fehlt ein positionsbezogenes Einzelregister mit publiziertem Befund und nachvollziehbarer Modellabbildung. Fachkundige müssen die Annahmen je Wand/Bund und Rolle prüfen. Die neue Literaturfixture ist ein begrenzter Fortschritt, kein Ersatz für diese Validierung.

Die Dose und der Einstieg zur Demo: https://felixinberlin.github.io/Amelie/#dose=abbundzeichen-fundbuch

Lizenz: CC0 1.0 Public Domain (eigener Text und Daten, nicht die verlinkten Quellen).

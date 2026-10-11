# Gründungsnavigator (Demo der Dose)

Gesprächsvorbereitung für Menschen im Grundsicherungsgeld, die sich selbständig machen wollen. **Seit 11.10.2026 eine Dose:** [`05-dosen/gruendungsnavigator.md`](../../05-dosen/gruendungsnavigator.md) (Reviewer 26/35, erste Dose in der Galerie). Prüfprotokoll: Abschnitt „Gründungsnavigator — 11.10.2026“, Zeile G1 (`verengt`); Konzept in `02-recherche/gruendungsnavigator-konzept-2026-10-11.md`. Nächster Schritt: [Ticket 01](ticket-01-vorlage.md).

Live nach dem Merge auf `main` (GitHub Pages):

- Gesprächsnavigator: https://felixinberlin.github.io/Amelie/gruendungsnavigator/
- Fall-Landkarte: https://felixinberlin.github.io/Amelie/gruendungsnavigator/fall-landkarte.html

Quelle der ausgelieferten Dateien: `public/gruendungsnavigator/` (Vite kopiert `public/` unverändert nach `dist/`). Beide Seiten sind einzelne HTML-Dateien ohne Server, ohne externe Abhängigkeiten, ohne Tracking; Eingaben bleiben im `localStorage` des Browsers.

| Seite | Inhalt |
|---|---|
| Gesprächsnavigator | Vorbereitung, Telefon-Entscheidungsbaum (7 Fragen, 23 Antworten), Fragenkatalog (42 Fragen mit anpassbaren Beispielantworten), Rechte-Karten (17 typische Antworten des Gegenübers), Zusammenfassungs-Mail, Präsentationsmodus ohne Taktik-Notizen |
| Fall-Landkarte | 9 Stationen vom Antrag bis zum Ausstieg als SVG, 31 Fragen, 107 Antworten mit Reaktion, nächstem Schritt, Frist und Normtext; Fristen-Zeitstrahl; 37 Normen |

## Auf dem Handy

Beide Seiten sind fürs Handy gebaut (geprüft mit Playwright bei 375 px, keine JS-Fehler, kein waagrechtes Scrollen):

- Gesprächsnavigator: App-Leiste unten (Start · Anruf · Fragen · Rechte · Mail), kompakter Kopf, Fortschrittsbalken im Telefonat, die gewählte Antwort scrollt ins Bild, Weiter/Zurück bleiben über der Leiste, Tippflächen ab 44 px, Safe-Area für iPhones, Präsentationsmodus als „👁 Zeigen“.
- Fall-Landkarte: Stationen als wischbare Leiste unter dem Kopf, Überblick und Zeitstrahl seitlich wischbar in lesbarer Größe, je Frage farbige Antwortkarten statt des Desktop-Baums, Fristentabelle als Karten.

## Kern und Tests

`src/engine/gruendungsnavigator/` rechnet, was man nicht raten soll: Monatsfristen mit Werktag-Verschiebung (Widerspruch, Klage, Untätigkeit, Finanzamt, Einstiegsgeld-Höchstdauer, Jahresprüfung § 10), Reihenfolge Antrag/Start (§ 37 Abs. 2, sonst „unbekannt“), Freibetrag § 11b. Die Tests lesen `LAW`, `STEPS`, `QA`, `RIGHTS`, `L` und `FRISTEN` direkt aus den HTML-Seiten: Umfang, Baumstruktur, jeder Normverweis, Wortlaut-oder-Kurzfassung, keine Versprechenswörter, gleiche Zitate auf beiden Seiten. `npx vitest run src/engine/gruendungsnavigator` (54 Tests). Im Amélie-Frontend als Simulator „Gründungsnavigator & Fristenrechner“.

## Rechtsstand

SGB II in der Fassung des Dreizehnten Änderungsgesetzes vom 16.04.2026 (BGBl. I Nr. 107), in Kraft seit 01.07.2026. Normtexte am 11.10.2026 über dejure.org geprüft und alle Wortlaut-Zitate maschinell gegen gesetze-im-internet.de abgeglichen (4 Abweichungen behoben: § 10 SGB II „selbständig“, § 16 Abs. 3 SGB I „daß“, § 44 SGB X „Im Übrigen“, § 87 SGG „Verwaltungsakts“) (§§ 10, 11b, 12, 15, 16b, 16c, 31, 31a, 32, 37, 40, 41a SGB II; §§ 14, 16 SGB I; §§ 9, 13, 33, 44 SGB X; §§ 84, 87, 88, 183 SGG; § 138 AO). Wörtliches steht in Anführungszeichen, Sinngemäßes ist als „Kurzfassung“ markiert. Nach jeder SGB-II-Änderung neu prüfen.

## Beispielinhalte

Fragen, Antworten und Zahlen stammen aus einem Beispiel (Gründung als Webentwickler, TYPO3, Einstiegsgeld und 2.350 € Zuschuss für Arbeitsmittel). Ticket 01 im Konzept: Beispielinhalte in eine Datendatei ziehen, damit die Seite zur Vorlage für jede Branche wird.

Keine Rechtsberatung. CC0 / Public Domain.

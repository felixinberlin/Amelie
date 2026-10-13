# Gründungsnavigator (Demo der Dose)

Gesprächsvorbereitung für Menschen im Grundsicherungsgeld, die sich selbständig machen wollen. **Seit 11.10.2026 eine Dose:** [`05-dosen/gruendungsnavigator.md`](../../05-dosen/gruendungsnavigator.md) (Reviewer 26/35, erste Dose in der Galerie). Prüfprotokoll: Abschnitt „Gründungsnavigator — 11.10.2026“, Zeile G1 (`verengt`); Konzept in `02-recherche/gruendungsnavigator-konzept-2026-10-11.md`. [Ticket 01](ticket-01-vorlage.md) (Vorlage und Branchenpakete) ist seit 13.10.2026 umgesetzt, nur der Praxistest mit einer zweiten Person steht aus. Alles Geprüfte (Urteil, Zitat-Abgleich, Tests, Handy, offene Bedingungen): [Prüfakte](pruefakte.md).

Live nach dem Merge auf `main` (GitHub Pages):

- Gesprächsnavigator: https://felixinberlin.github.io/Amelie/gruendungsnavigator/
- Fall-Landkarte: https://felixinberlin.github.io/Amelie/gruendungsnavigator/fall-landkarte.html

Quelle der ausgelieferten Dateien: `public/gruendungsnavigator/` (Vite kopiert `public/` unverändert nach `dist/`). Beide Seiten sind einzelne HTML-Dateien ohne Server, ohne externe Abhängigkeiten, ohne Tracking; Eingaben bleiben im `localStorage` des Browsers. Ihre Inhalte kommen aus [`data/`](data/) und werden mit `npm run build:gn` eingebaut (siehe „Daten und Branchenpakete“).

| Seite | Inhalt |
|---|---|
| Gesprächsnavigator | Vorbereitung, Telefon-Entscheidungsbaum (7 Fragen, 23 Antworten), Fragenkatalog (34 allgemeine Fragen plus Zusatzfragen des Branchenpakets, im Beispiel Webentwicklung 42, mit anpassbaren Beispielantworten), Branchenpakete mit eigener Fassung, Download und Upload, Rechte-Karten (30 typische Antworten des Gegenübers), Zusammenfassungs-Mail, Präsentationsmodus ohne Taktik-Notizen |
| Fall-Landkarte | 9 Stationen vom Antrag bis zum Ausstieg als SVG, 29 Fragen, 107 Antworten mit Reaktion, nächstem Schritt, Frist und Normtext; Fristen-Zeitstrahl; 44 Normen; dasselbe Branchenpaket wie im Gesprächsnavigator |

## Auf dem Handy

Beide Seiten sind fürs Handy gebaut. Prüfbefehl `npm run check:mobile` (360 und 390 px, kein waagrechtes Scrollen, keine JS-Fehler):

- Gesprächsnavigator: App-Leiste unten (Start · Anruf · Fragen · Rechte · Mail), kompakter Kopf, Fortschrittsbalken im Telefonat, die gewählte Antwort scrollt ins Bild, Weiter/Zurück bleiben über der Leiste, Tippflächen ab 44 px, Safe-Area für iPhones, Präsentationsmodus als „👁 Zeigen“.
- Fall-Landkarte: Stationen als wischbare Leiste unter dem Kopf, Überblick und Zeitstrahl seitlich wischbar in lesbarer Größe, je Frage farbige Antwortkarten statt des Desktop-Baums, Fristentabelle als Karten.

## Offline und als App

`manifest.webmanifest`, `icon.svg` und `sw.js` machen beide Seiten installierbar („Zum Startbildschirm“) und offline nutzbar. Der Service Worker lädt Seiten zuerst aus dem Netz (Korrekturen an Normtexten kommen sofort an) und fällt ohne Netz auf den Speicher zurück. Eingaben bleiben im `localStorage`, nie im Service Worker. Bei `file://` wird nichts registriert. Im Fuß steht „✓ Offline verfügbar“, sobald der Speicher bereit ist. Geprüft am 11.10.2026 mit Playwright: Netz aus, beide Seiten laden, Telefonbaum bedienbar. Ein Test hält Manifest, Symbol und Dateiliste des Service Workers gegen die Dateien im Ordner.

## Daten und Branchenpakete

| Datei | Inhalt |
|---|---|
| `data/normen.json` | Normregister beider Seiten: 44 Normen mit §-Angabe, Links zu gesetze-im-internet.de und dejure.org, genau eins von Wortlaut (`q`) oder Kurzfassung (`k`), Fassung und Prüfdatum |
| `data/navigator.json` | Telefonbaum, Fragen, Rechte-Karten, Mitbring-Liste, Ablauf, Kennzahlen; Texte mit Platzhaltern wie `{{beruf}}` oder `{{zuschuss}}` |
| `data/landkarte.json` | Stationen, Fragen und Antworten der Fall-Landkarte, Fristen |
| `data/pakete/*.json` | Branchenpakete: Werte für die Platzhalter, Überschreibungen einzelner Texte, Zusatzfragen, Mitbring-Liste, „Selbst klären“-Punkte |
| `data/paket.schema.json` | Schema für Pakete (auch unter `public/gruendungsnavigator/paket.schema.json`) |

Mitgeliefert: **Webentwicklung** (der ursprüngliche Beispielfall), **Montage und Kleinreparaturen**, **Mobiler Kaffeestand**, **Grafikdesign**, **Alltagsbegleitung**, **Onlinehandel mit gebrauchten Büchern** (alle erfunden) und ein **leeres Paket** als Vorlage. Die „Selbst klären“-Punkte nennen, was man bei Kammer, Amt oder Finanzamt erfragen sollte; sie behaupten keine Paragrafen und sind keine Rechtsauskunft.

**Eigene Fassung ohne Code:** Auf der Seite unter „Branche und Beispielfall“ ein Paket wählen, „Eigene Fassung erstellen“ ausfüllen (Beruf, Zahlen, Zuschussposten) und speichern. Die Antworten unter „Fragen“ lassen sich danach einzeln anpassen. „Paket herunterladen“ speichert alles als JSON (angepasste Antworten als Überschreibungen), „Paket laden“ liest es wieder ein; die Seite prüft die Datei vorher (Form und Inhalt) und meldet Auffälligkeiten. Ein Paket lässt sich per Link vorwählen: `?paket=grafikdesign`.

**Neues Paket ins Repo:** Datei nach `data/pakete/<id>.json` legen (Muster: ein vorhandenes Paket; `$schema` zeigt aufs Schema), `npm run build:gn`, dann `npx vitest run src/engine/gruendungsnavigator`. Die Tests verlangen: Schema gültig, `erfunden: true`, alle Werte gefüllt, Zuschuss höchstens 5.000 € (§ 16c Abs. 1 SGB II), Gewinn nicht über Umsatz, Kosten im ersten Jahr mindestens zwölf Monatskosten, Monatsgewinn im zweiten Jahr über der eigenen Schwelle, jede Überschreibung trifft einen Text, jede Norm steht im Register, keine offenen Platzhalter, keine Versprechenswörter.

**Pfade für Überschreibungen:** `telefon/<schritt>/<antwort>`, `fragen/<frage-id>`, `rechte/<karten-id>`, `landkarte/<station>[/<frage>[/<antwort>]]` (Nummern ab 0).

## Kern und Tests

`src/engine/gruendungsnavigator/` rechnet, was man nicht raten soll: Monatsfristen mit Werktag-Verschiebung (Widerspruch, Klage, Untätigkeit, Finanzamt, Einstiegsgeld-Höchstdauer, Jahresprüfung § 10), Reihenfolge Antrag/Start (§ 37 Abs. 2, sonst „unbekannt“), Freibetrag § 11b. `paket.ts` füllt die Platzhalter aus dem Paket und prüft Pakete; esbuild bündelt ihn in die Seiten, im Browser läuft also derselbe Code wie in den Tests. `gruendungsnavigator.test.ts` prüft Umfang, Baumstruktur, jeden Normverweis, Wortlaut-oder-Kurzfassung und keine Versprechenswörter am Referenzpaket Webentwicklung, dazu einen Drift-Wächter (in die Seiten eingebaute Daten = Dateien in `data/`). `paket.test.ts` prüft jedes Paket und hat zu jeder Regel eine Gegenprobe mit absichtlich falschem Eingang. Im Lint: `check:gn` (Seiten aktuell gebaut). `npx vitest run src/engine/gruendungsnavigator` (Vitest). Im Amélie-Frontend als Simulator „Gründungsnavigator & Fristenrechner“.

## Rechtsstand

SGB II in der Fassung des Dreizehnten Änderungsgesetzes vom 16.04.2026 (BGBl. I Nr. 107), in Kraft seit 01.07.2026. Normtexte am 11.10.2026 über dejure.org geprüft und alle Wortlaut-Zitate maschinell gegen gesetze-im-internet.de abgeglichen (Wiederholung am 13.10.2026 über das gemeinsame Register: 31/31, davon § 138 AO per Hand) (4 Abweichungen behoben: § 10 SGB II „selbständig“, § 16 Abs. 3 SGB I „daß“, § 44 SGB X „Im Übrigen“, § 87 SGG „Verwaltungsakts“) (§§ 10, 11b, 12, 15, 16b, 16c, 31, 31a, 32, 37, 40, 41a SGB II; §§ 14, 16 SGB I; §§ 9, 13, 33, 44 SGB X; §§ 84, 87, 88, 183 SGG; § 138 AO). Wörtliches steht in Anführungszeichen, Sinngemäßes ist als „Kurzfassung“ markiert. Nach jeder SGB-II-Änderung neu prüfen.

## Beispielinhalte

Fragen, Antworten und Zahlen stammen aus **erfundenen** Beispielen, je eins pro Branchenpaket (voreingestellt: Gründung als Webentwickler, Einstiegsgeld und 2.000 € Zuschuss für Arbeitsmittel); Personen, Preise und Planzahlen sind ausgedacht.

Keine Rechtsberatung. CC0 / Public Domain.

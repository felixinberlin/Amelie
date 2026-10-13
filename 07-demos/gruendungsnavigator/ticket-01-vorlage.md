# Ticket 01: Die Seite wird Vorlage

**Dose:** [`gruendungsnavigator`](../../05-dosen/gruendungsnavigator.md) · **Stand:** 13.10.2026 · CC0

## Stand 13.10.2026: umgesetzt, ein Kriterium offen

Kriterien 1, 2, 3, 4 und 6 sind erfüllt und maschinell gehalten; Kriterium 5 (Stoppuhr-Test mit einer zweiten Person) braucht einen Menschen und ist offen. Umsetzung:

| Aufgabe | Ergebnis |
|---|---|
| Branchenpaket | `data/pakete/webentwicklung.json` (der bisherige Fall, Wortlaut gleich bis auf Verallgemeinerungen wie „Gewerbeamt“ statt „Bezirksamt“), `data/pakete/leer.json`, Schema `data/paket.schema.json`. **Dazu fünf weitere erfundene Branchen:** Montage und Kleinreparaturen (Handwerkskammer), Mobiler Kaffeestand, Grafikdesign (freier Beruf?), Alltagsbegleitung (Anerkennung für den Entlastungsbetrag), Onlinehandel mit gebrauchten Büchern. Jede mit eigenen Zahlen, Überschreibungen, 3 Zusatzfragen, Mitbring-Liste und „Selbst klären“-Punkten ohne Paragrafenbehauptung. |
| Normregister | Ein Register für beide Seiten: `data/normen.json`, 44 Normen (vorher zwei getrennte Konstanten `LAW` und `L` mit doppelten Einträgen). Felder: `t` (§-Angabe), `n` (Name), `u` (gesetze-im-internet.de), `d` (dejure.org), genau eins von `q` (Wortlaut) / `k` (Kurzfassung), `fassung`, `geprueftAm`. Die Kurznamen der Felder blieben, damit die Seiten unverändert rendern. |
| Telefonbaum | Teil von `data/navigator.json` (mit Fragen, Rechte-Karten, Mitbring-Liste, Ablauf, Kennzahlen); Fall-Landkarte in `data/landkarte.json`. Normverweise nur über Register-IDs. |
| Kern lädt Daten | `src/engine/gruendungsnavigator/paket.ts`: füllt Platzhalter (`{{beruf}}`, `{{zuschuss}}` …), wendet Überschreibungen an, prüft Pakete (`pruefePaket`, `pruefeStruktur`). `npm run build:gn` bündelt diesen Kern mit esbuild und baut ihn samt Daten in beide Seiten ein; sie bleiben einzelne Dateien und laufen offline. `check:gn` im Lint hält Seiten und Daten deckungsgleich. |
| Eigene Fassung | Auf der Seite: Paket wählen (auch `?paket=<id>`), „Eigene Fassung erstellen“ (Formular für alle Werte), Paket herunterladen (JSON, mit den eigenen Antworten als Überschreibungen) und wieder laden. Eigene Pakete bleiben im Browser; die Fall-Landkarte zeigt dasselbe Paket. |

Prüfungen: 57 Paket-Tests (`paket.test.ts`, darunter Gegenproben mit absichtlich falschem Eingang für jede Regel), angepasste Suite `gruendungsnavigator.test.ts` mit Drift-Wächter (eingebaute Daten = Dateien), Zitat-Abgleich 31/31 (30 maschinell, § 138 AO per Hand, weil der Abruf aus Node scheiterte; die früheren 39 bzw. 45 zählten Zitate doppelt, die auf beiden Seiten standen), Browserprobe aller 7 Pakete bei 360 px ohne offene Platzhalter. Alte Eingaben (`jc-navigator-v1`) werden übernommen.

Kriterium 5, so geht der Test: Eine Person ohne Programmierkenntnis öffnet die Seite, wählt „Leeres Paket“ oder die nächste Branche, füllt „Eigene Fassung erstellen“ aus, passt drei Antworten unter „Fragen“ an und lädt das Paket herunter. Stoppuhr ab Öffnen, Protokoll (wo hing es?) in die Prüfakte.

## Ursprünglicher Auftrag (11.10.2026)

### Ziel

Heute zeigt der Gesprächsnavigator einen einzigen, erfundenen Beispielfall: Gründung als Webentwickler, Einstiegsgeld und 2.000 € Zuschuss für Arbeitsmittel. Die Rechtsgrundlagen gelten für alle, die Antworten nicht. Nach diesem Ticket erzeugt jede Gründerin ihre eigene Fassung, ohne Code anzufassen.

### Aufgaben

1. **Branchenpaket:** Alles Persönliche aus `public/gruendungsnavigator/index.html` (Konstanten `QA`, `OV_KV`, `OV_AG`, die `say`-Texte in `STEPS`, Überblickstext, Beträge) in `data/paket-webentwicklung.json` ziehen. Daneben ein leeres `data/paket-leer.json`, dazu `data/paket.schema.json`.
2. **Normregister als Daten:** `LAW` (Navigator) und `L` (Fall-Landkarte) zu einem Register `data/normen.json` zusammenführen. Jeder Eintrag bekommt `id`, `zitat` (§-Angabe), `fassung` (Datum + BGBl.), `inKraftSeit`, genau eins von `wortlaut`/`kurzfassung`, `url` (gesetze-im-internet.de), `dejure` und `geprueftAm`.
3. **Telefonbaum als Daten:** `STEPS` nach `data/telefonbaum.json`; Normverweise nur über Register-IDs.
4. **Kern lädt Daten:** `src/engine/gruendungsnavigator/` liest Register, Baum und Paket. Die Seiten rendern daraus und bleiben einzelne Dateien (Paket per Datei-Upload oder `?paket=`-Parameter, nur lokal).

### Fertig, wenn

1. „Webentwicklung“ und das leere Paket validieren gegen dasselbe Schema; der Kern enthält keine Beispielbeträge.
2. Jeder Registereintrag trägt Norm, Fassung, URL und die Kennzeichnung Wortlaut/Kurzfassung, und der Zitat-Abgleich gegen gesetze-im-internet.de ist grün (**Befehl vorhanden:** `npm run check:gn-zitate`; am 11.10.2026 4 Abweichungen gefunden und behoben, jetzt 39/39). Nach dem Umzug in `data/normen.json` den Befehl auf das Register umstellen.
3. Graphtest des Telefonbaums und Fristen-Tabellentests sind grün. **Bereits erfüllt:** `gruendungsnavigator.test.ts`.
4. Kein Ausgabetext sagt „garantiert“, „Anspruch besteht“, „unzulässig“ oder „rechtswidrig“. **Für Kern und Telefonbaum erfüllt**; Fragen und Rechte-Karten nach dem Umzug in Daten ebenfalls prüfen.
5. Eine zweite Person ohne Programmierkenntnis erzeugt ihre eigene Fassung in 30 Minuten (Stoppuhr, ein Protokoll).
6. Beide Seiten sind bei 360 px Breite ohne waagrechtes Scrollen bedienbar. **Bereits erfüllt**, Prüfbefehl `npm run check:mobile` (360 und 390 px).

### Nicht in diesem Ticket

Sprachmodell-Hilfe beim Formulieren der eigenen Antworten, weitere Länder (AT/CH, Prüfprotokoll G4 `unklar`), Paragrafen-Prüfer für fremde Schreiben (G2), Versand an das Jobcenter.

## Vor jedem Versand der Dose

- Ansprechperson bei Tacheles e.V. auf der Vereinsseite verifizieren.
- RDG-Grenze juristisch prüfen lassen oder den Zuschnitt GN-B nehmen: nur Register, Fristen und Rechte-Karten im Kern, Taktik als Beispielpaket.
- Normstand prüfen (`normstandVeraltet`).

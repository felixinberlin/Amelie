# Ticket 01: Die Seite wird Vorlage

**Dose:** [`gruendungsnavigator`](../../05-dosen/gruendungsnavigator.md) · **Stand:** 11.10.2026 · CC0

## Ziel

Heute ist der Gesprächsnavigator ein echter Einzelfall: Gründung als Webentwickler (TYPO3), Einstiegsgeld und 2.350 € Zuschuss für Arbeitsmittel. Die Rechtsgrundlagen gelten für alle, die Antworten nicht. Nach diesem Ticket erzeugt jede Gründerin ihre eigene Fassung, ohne Code anzufassen.

## Aufgaben

1. **Branchenpaket:** Alles Persönliche aus `public/gruendungsnavigator/index.html` (Konstanten `QA`, `OV_KV`, `OV_AG`, die `say`-Texte in `STEPS`, Überblickstext, Beträge) in `data/paket-webentwicklung.json` ziehen. Daneben ein leeres `data/paket-leer.json`, dazu `data/paket.schema.json`.
2. **Normregister als Daten:** `LAW` (Navigator) und `L` (Fall-Landkarte) zu einem Register `data/normen.json` zusammenführen. Jeder Eintrag bekommt `id`, `zitat` (§-Angabe), `fassung` (Datum + BGBl.), `inKraftSeit`, genau eins von `wortlaut`/`kurzfassung`, `url` (gesetze-im-internet.de), `dejure` und `geprueftAm`.
3. **Telefonbaum als Daten:** `STEPS` nach `data/telefonbaum.json`; Normverweise nur über Register-IDs.
4. **Kern lädt Daten:** `src/engine/gruendungsnavigator/` liest Register, Baum und Paket. Die Seiten rendern daraus und bleiben einzelne Dateien (Paket per Datei-Upload oder `?paket=`-Parameter, nur lokal).

## Fertig, wenn

1. „Webentwicklung“ und das leere Paket validieren gegen dasselbe Schema; der Kern enthält keine persönlichen Beträge.
2. Jeder Registereintrag trägt Norm, Fassung, URL und die Kennzeichnung Wortlaut/Kurzfassung, und der Zitat-Abgleich gegen gesetze-im-internet.de ist grün (**Befehl vorhanden:** `npm run check:gn-zitate`; am 11.10.2026 4 Abweichungen gefunden und behoben, jetzt 39/39). Nach dem Umzug in `data/normen.json` den Befehl auf das Register umstellen.
3. Graphtest des Telefonbaums und Fristen-Tabellentests sind grün. **Bereits erfüllt:** `gruendungsnavigator.test.ts`.
4. Kein Ausgabetext sagt „garantiert“, „Anspruch besteht“, „unzulässig“ oder „rechtswidrig“. **Für Kern und Telefonbaum erfüllt**; Fragen und Rechte-Karten nach dem Umzug in Daten ebenfalls prüfen.
5. Eine zweite Person ohne Programmierkenntnis erzeugt ihre eigene Fassung in 30 Minuten (Stoppuhr, ein Protokoll).
6. Beide Seiten sind bei 360 px Breite ohne waagrechtes Scrollen bedienbar. **Bereits erfüllt**, Prüfbefehl `npm run check:mobile` (360 und 390 px).

## Nicht in diesem Ticket

Sprachmodell-Hilfe beim Formulieren der eigenen Antworten, weitere Länder (AT/CH, Prüfprotokoll G4 `unklar`), Paragrafen-Prüfer für fremde Schreiben (G2), Versand an das Jobcenter.

## Vor jedem Versand der Dose

- Ansprechperson bei Tacheles e.V. auf der Vereinsseite verifizieren.
- RDG-Grenze juristisch prüfen lassen oder den Zuschnitt GN-B nehmen: nur Register, Fristen und Rechte-Karten im Kern, Taktik als Beispielpaket.
- Normstand prüfen (`normstandVeraltet`).

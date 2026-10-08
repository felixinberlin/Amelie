# Der Friedhof

> Ein Friedhof ist kein Portfolio. Er ist ein Obduktionssaal.

Hier liegt jede Idee, die in Amélie gestorben ist — mit Totenschein. Nicht, um sie aufzubewahren, sondern um zu sehen, **woran** sie gestorben ist. Eine einzelne tote Idee ist eine Anekdote. Dreißig mit Ursache, Fundweg und Herkunft sind ein Muster, und das Muster ist die einzige Stelle, an der die Methode aus ihren Fehlern lernt.

Bis zum 24.09.2026 galt die Gegenregel: *„gelöscht, nicht archiviert"*. Sie hat sich als falsch erwiesen, wie vor ihr „nie unterschreiben" (Regel 2). Gelöschte Ideen tauchten wieder auf (Sandstein-Streiflicht war Streiflicht, ParagraphenDolmetscher war KlarLokal), zurückgezogene Dosen blieben in der App lebendig (Crack Flora Watcher mit zwei fertigen Mails), und niemand konnte sagen, ob die meisten Ideen an der englischen Suche starben oder am eigenen Atlas. Die Begründung steht im Manifest, Abschnitt „Der Friedhof".

---

## Friedhofsordnung

**1 · Trennen.** Was stirbt, verlässt die Dosen am selben Tag — aus `src/data/dosen.ts` (`DOSEN_DATA`; das Grab entsteht in `src/data/graeber.json`), aus `05-dosen/`, aus der Zustellliste. Keine Dose mit Warnbanner, keine Mail an einen Toten.

**2 · Totenschein.** Jedes Grab hat sieben Pflichtangaben. Ein Grab ohne Ursache ist ein Archiveintrag, und Archive sind verboten.

| Feld | Frage | Werte |
|---|---|---|
| `cause` | Woran starb sie? | `gebaut` · `beim-empfaenger` · `duplikat` · `mode` · `reality-check` · `praemisse` |
| `killer` | Wer hatte sie schon? | `kommerziell` · `gemeinnuetzig` · `behoerde` · `forschung` · `community` · `eigener-bestand` · `keiner` |
| `foundBy` | Welche Suche fand es heraus? | `englisch` · `deutsch` · `forum` · `empfaenger` · `eigener-bestand` · `ohne-suche` · `unbekannt` |
| `origin` | Woher kam die Idee? | `ideenliste` · `brainstorm` · `quelle` · `bisoziation` · `inversion` · `modell-katalog` |
| `stage` | Wie weit kam sie? | `kandidat` · `dose` · `mail-entwurf` · `zugestellt` |
| `bornIn` / `diedOn` | Wann? | Runde und Methode · ISO-Datum |
| `resurrectIfDe/En` | Wann darf das Grab geöffnet werden? | Satz — „nie" ist erlaubt |

Die Ursachen genauer:

- **`gebaut`** — ein Produkt, Projekt oder Community-Werkzeug deckt die Idee ab (Stoppregel des Playbooks: ≤ 12 Monate alt, vollständige Abdeckung).
- **`beim-empfaenger`** — der Empfänger, dem wir sie schenken wollten, macht es selbst. Der billigste Tod, wenn man zuerst dort sucht.
- **`duplikat`** — stand schon im eigenen Bestand. Tod durch fehlendes Strg+F.
- **`mode`** — keine neue Fähigkeit, nur ein Standardmuster (die Idee nennt ihre Vorbilder selbst).
- **`reality-check`** — scheitert an Daten, Recht oder Physik, bevor die Existenzfrage überhaupt zählt.
- **`praemisse`** — das Problem gibt es so nicht; keine Quelle nennt es als Engpass.

**3 · Keine Wiedergänger.** Ein Grab wird nur geöffnet, wenn seine Auferstehungsbedingung eingetreten ist — dann mit neuer Protokollzeile, nicht durch Kopieren. **Vor jeder neuen Idee: erst über den Friedhof gehen** (App: Tab „Friedhof", Suche; oder Strg+F hier).

**Was nicht hierher gehört:** Ideen mit Urteil `verengt` oder `unklar` leben noch. Empfänger, die sich als falsch erwiesen haben (Stray Fawn, Sammeladressen), sind keine toten Ideen — sie stehen im Protokoll.

---

## Wie man ein Grab anlegt

1. Totenschein anlegen mit `npm run bib -- grab add --from grab.json` (oder Einzelflags; `--dry-run` zeigt nur). Die Gräber liegen in `src/data/graeber.json`; die CLI prüft alle Pflichtfelder und Aufzählungen aus `src/types.ts`, lehnt doppelte ids und noch als Dose geführte ids ab und regeneriert die Muster (Schritt 4). Vorab prüfen, ob es das Grab schon gibt: `npm run bib -- find <Begriffe>`.
2. War es eine Dose: Eintrag aus `DOSEN_DATA` entfernen, `05-dosen/<id>.md` nach `08-friedhof/grabbeigaben/` verschieben (Originaltext bleibt als Grabbeigabe), `nachruf` darauf zeigen lassen. Mails in `src/data/deliveries.ts`, die nur diese Dose verlinken, löschen.
3. Langer Nachruf, wenn die Geschichte eine Lehre trägt, die nicht in zwei Sätze passt: `nachrufe.md`.
4. `npm run friedhof` — schreibt die Muster unten neu. `npm run lint` prüft, dass sie aktuell sind.

---

## Muster

<!-- MUSTER:START -->

*Automatisch erzeugt aus `src/data/graeber.json` (`DISCARDED_DATA`) mit `npm run friedhof` (läuft nach `npm run bib -- grab add` von selbst). Nicht von Hand bearbeiten — `npm run lint` meldet Abweichungen.*

**140 Gräber.** 3 davon starben erst als Dose oder Mail-Entwurf (teure Tode). Von 130 dokumentierten Fundwegen kamen 16 ohne neue Suche aus (eigener Atlas, eigenes Protokoll oder Reality-Check) — 12 %.

**Woran sie starben**

| | Gräber | Anteil |
|---|---:|---:|
| Schon gebaut | 68 | 49 % |
| Beim Empfänger selbst | 29 | 21 % |
| Reality-Check | 18 | 13 % |
| Falsche Prämisse | 15 | 11 % |
| Keine neue Fähigkeit | 8 | 6 % |
| Duplikat | 2 | 1 % |

**Welche Suche traf**

| | Gräber | Anteil |
|---|---:|---:|
| Deutsche Suche | 54 | 39 % |
| Englische Suche | 42 | 30 % |
| Empfänger-Suche | 17 | 12 % |
| Ohne Suche | 12 | 9 % |
| Nicht dokumentiert | 10 | 7 % |
| Eigener Atlas / Protokoll | 4 | 3 % |
| Forum / Nische | 1 | 1 % |

**Woher sie kamen**

| | Gräber | Anteil |
|---|---:|---:|
| Bisoziation | 59 | 42 % |
| Primärquelle | 35 | 25 % |
| Inversion | 18 | 13 % |
| Brainstorm | 16 | 11 % |
| Ideenliste | 8 | 6 % |
| Modell-Katalog | 4 | 3 % |

**Wer sie schon hatte**

| | Gräber | Anteil |
|---|---:|---:|
| Firma | 40 | 29 % |
| Niemand | 26 | 19 % |
| Forschung | 25 | 18 % |
| Behörde | 19 | 14 % |
| Gemeinnützige | 17 | 12 % |
| Community / Indie | 11 | 8 % |
| Eigener Bestand | 2 | 1 % |

**Wie weit sie kamen**

| | Gräber | Anteil |
|---|---:|---:|
| Kandidat | 137 | 98 % |
| Dose gepackt | 2 | 1 % |
| Mail entworfen | 1 | 1 % |

### Alle Gräber (neueste zuerst)

| Idee | † | Ursache | Wer sie hatte | Gefunden durch | Herkunft | Kam bis | Auferstehung wenn |
|---|---|---|---|---|---|---|---|
| Adaptive, risikobasierte Audit-Planung für Holz-CoC | 01.10.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | Wenn FSC oder PEFC eine offene, risikobasierte Audit-Planung für kleine Zertifikatsinhaber suchen. |
| CE/DoP-Scanner für Stahlprodukte (Leistungserklärung gegen Projektanforderung) | 01.10.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Inversion | Kandidat | Wenn nach Inkrafttreten des DPP für Bauprodukte (CPR 2024/3110) kein freier Leser existiert, der DoPC-Werte gegen ein Leistungsverzeichnis hält, und ein Aparejadores-Kollegium danach fragt. |
| Erinnerungs-Emotionskarte und Friedensimpulse (Brandenburg) | 01.10.2026 | Schon gebaut | Forschung | Englische Suche | Bisoziation | Kandidat | Wenn eine Gedenkstätte oder Landeszentrale eine moderierte Beteiligungskarte ausschreibt und die Methode übernehmen will. |
| Erinnerungsspuren mit Zerfall (ortsgebundene Zeitzeugen-Fragmente, die ohne Besuch verblassen) | 01.10.2026 | Falsche Prämisse | Gemeinnützige | Deutsche Suche | Bisoziation | Kandidat | Nie mit Zerfall von Zeugnissen; allenfalls Zerfall von Besucher-Markierungen, wenn eine Gedenkstätte das ausdrücklich will. |
| Familienanekdote-Verknüpfer (Repressionsgeschichten mit Archiven verbinden) | 01.10.2026 | Beim Empfänger selbst | Behörde | Empfänger-Suche | Inversion | Kandidat | Wenn Arolsen oder die LAkD ein offenes Eingabewerkzeug für Familienanekdoten suchen und die Verknüpfung durch Archivare geprüft wird. |
| Gedenktafel-Faktencheck (Inschriften gegen Opferverzeichnisse) | 01.10.2026 | Reality-Check | Niemand | Deutsche Suche | Inversion | Kandidat | Wenn Bundesarchiv-Gedenkbuch, Arolsen oder die Stiftung Brandenburgische Gedenkstätten Namenslisten als offenen Datensatz oder API anbieten, oder die Stolperstein-Datenbank mit Schnittstelle live geht. |
| Holz-Chargen-Tag mit Umwelt-Fußabdruck und Dauerzertifizierung | 01.10.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Bisoziation | Kandidat | Wenn FSC Trace eingestellt wird oder PEFC für kleine Sägewerke kein digitales CoC-Werkzeug anbietet und danach fragt. |
| Holz-Sortierklasse vor Ort (Bild + Klopfton gegen deklarierte Festigkeitsklasse) | 01.10.2026 | Falsche Prämisse | Forschung | Englische Suche | Inversion | Kandidat | Wenn ein Regelwerk die Nachsortierung verbauten oder gelieferten Holzes durch Laien zulässt und dafür ein offenes Messverfahren benennt. |
| Holzherkunft per Isotopen/DNA (Biosignatur-Scanner) | 01.10.2026 | Schon gebaut | Forschung | Englische Suche | Bisoziation | Kandidat | Wenn ein mobiles Messgerät Isotopen- oder DNA-Herkunft vor Ort liefert und World Forest ID die Referenzdaten frei gibt. |
| Mikro-Storytelling-App für Familienerinnerungen | 01.10.2026 | Schon gebaut | Firma | Deutsche Suche | Bisoziation | Kandidat | Wenn ein Archiv kurze Familienerinnerungen mit Normdaten annehmen will und die kommerziellen Apps keinen Export bieten. |
| Repressions-Berichte-Erschließer lokal (NER für Familien und Gemeindegruppen) | 01.10.2026 | Beim Empfänger selbst | Forschung | Empfänger-Suche | Inversion | Kandidat | Wenn KI.OH oder Arolsen ein Werkzeug für Angehörige ausdrücklich ausschließen und ein Archiv Familienberichte mit Normdaten annehmen will. |
| Repressionsort-Fotoerkenner (Bürgerfotos möglicher Lager- und Haftorte) | 01.10.2026 | Falsche Prämisse | Niemand | Deutsche Suche | Inversion | Kandidat | Nie als Erkennung; allenfalls als Meldeweg an eine Gedenkstätte, die Hinweise auf unbekannte Lager ausdrücklich sammelt. |
| Rostgrad nach ISO 8501-1 per Handykamera | 01.10.2026 | Schon gebaut | Forschung | Englische Suche | Inversion | Kandidat | Wenn ein freier, normnaher Bilddatensatz (Rost- und Vorbereitungsgrade) erscheint und ein Korrosionsschutz-Verband (z. B. GfKORR, Bundesverband Korrosionsschutz) ein offenes Prüfwerkzeug sucht. |
| Sensorhaut je Holzcharge (Klima- und Ortsüberwachung in der Lieferkette) | 01.10.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | Wenn eine Norm oder die EUDR Klimaüberwachung von Holz im Transport verlangt und es dafür kein offenes Werkzeug gibt. |
| Thematische Pheromone für Zeitzeugenberichte (Themen verstärken sich durch Häufigkeit) | 01.10.2026 | Beim Empfänger selbst | Forschung | Empfänger-Suche | Bisoziation | Kandidat | Wenn ein Archiv eine Themenkarte ausdrücklich ohne Häufigkeitsgewichtung sucht und KI.OH sie nicht liefert. |
| Trapezblech-Verformung per LiDAR/Photogrammetrie | 01.10.2026 | Schon gebaut | Firma | Englische Suche | Inversion | Kandidat | Wenn ein Regelwerk die Profilprüfung von Trapezblechen auf der Baustelle verlangt und die kommerziellen Dienste sie nicht abdecken. |
| Zeitzeugen ↔ aktuelle Nachrichten (Matching von Zeugnissen zu Tagesereignissen) | 01.10.2026 | Falsche Prämisse | Niemand | Deutsche Suche | Bisoziation | Kandidat | Wenn eine Gedenkstätte oder die bpb ausdrücklich ein Werkzeug sucht, das Lehrkräften zu Tagesthemen passende Zeitzeugen-Clips vorschlägt, ohne Parallelen zu behaupten. |
| 3D-Palimpsest für Kampfmittel-Bodenanomalien | 30.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | Wenn der KMBD oder ein Erkundungsverband eine offene Schichtansicht für Geophysik-Rohdaten ausdrücklich anfragt. |
| Altmedikamente-Entsorgungskarte (Rücknahme-/Entsorgungsweg je Ort) | 30.09.2026 | Beim Empfänger selbst | Gemeinnützige | Deutsche Suche | Primärquelle | Kandidat | Wenn arzneimittelentsorgung.de eingestellt wird oder eine Karte der tatsächlichen Rücknahmestellen (nicht nur Landkreisweg) gefragt wird. |
| Baumart und Vitalität per Foto-KI | 30.09.2026 | Schon gebaut | Firma | Deutsche Suche | Inversion | Kandidat | Wenn eine Baumschutzbehörde eine belastbare Vitalitätsansprache per Foto als Nachweis zulässt und die Apps diese nicht liefern. |
| Baumumfang per LiDAR-App messen (Baumschutzsatzung) | 30.09.2026 | Schon gebaut | Firma | Deutsche Suche | Inversion | Kandidat | Wenn eine Kommune ein Messprotokoll per App als Antragsanlage verbindlich annimmt und die vorhandenen Apps das nicht leisten. |
| Biofeedback-Halsband mit individueller Frequenz (Mehrtierhaushalt) | 30.09.2026 | Reality-Check | Niemand | Deutsche Suche | Bisoziation | Kandidat | Wenn eine Tierschutz- oder Verhaltensforschungsstelle ein offenes Messprotokoll mit belegter Wirkung verlangt. |
| Bürger-App zur Dokumentation von Kompensationsflächen | 30.09.2026 | Schon gebaut | Gemeinnützige | Englische Suche | Inversion | Kandidat | Wenn das LfU Brandenburg oder eine untere Naturschutzbehörde Bürgermeldungen zu Kompensationsflächen ausdrücklich annehmen will und EKIS um Status-Attribute erweitert wird. |
| Chargen-Wahrnehmungskarte (gleiche Charge, gleiche Klage aggregieren) | 30.09.2026 | Falsche Prämisse | Behörde | Deutsche Suche | Bisoziation | Kandidat | Wenn ein Träger (BfArM/PEI/AMK) freiwillige Patientenbeobachtungen je Charge als offene Daten annimmt. |
| Engpass-Wellenlauf (Ausbreitung von Lieferengpässen über Wirkstoffe/Länder) | 30.09.2026 | Beim Empfänger selbst | Behörde | Deutsche Suche | Bisoziation | Kandidat | Wenn BfArM/EMA das Frühwarnsystem einstellen oder keine Auswertung öffentlich machen. |
| Ersatzbaum-Fotomonitoring durch Bürger | 30.09.2026 | Keine neue Fähigkeit | Niemand | Deutsche Suche | Inversion | Kandidat | Wenn ein Grünflächenamt Bürgerfotos für die Anwuchskontrolle nach Ersatzpflanzung nachweislich auswertet. |
| Fällgenehmigung-KI (Notwendigkeit und Ersatzpflanzung) | 30.09.2026 | Keine neue Fähigkeit | Niemand | Deutsche Suche | Inversion | Kandidat | Wenn eine Kommune ihre Satzung als maschinenlesbare Regeln veröffentlicht und ein Amt einen deterministischen Vorprüfer ausdrücklich anfragt. |
| Habitat-Veränderungs-Detektor (3D-Zeitreihe am Transekt) | 30.09.2026 | Schon gebaut | Forschung | Deutsche Suche | Bisoziation | Kandidat | Wenn ein Tagfalter-Monitoring ein Videoprotokoll je Transekt vorschreibt und die 3D-Auswertung offen nachnutzbar ist. |
| KI-Dauer-Mikro-A/B-Test von Seitenelementen | 30.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | Wenn ein Gemeinwohl-Träger belegt, dass Verwaltungsseiten per Dauertest nachweislich verständlicher werden und keine Plattform das abdeckt. |
| KI-Layer für dynamische Überschriften (TYPO3) | 30.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | Wenn eine öffentliche Stelle Anpassung von Inhalten nach Nutzerabsicht als Barrierefreiheits- oder Verständlichkeitsziel ausschreibt. |
| Kollegen-Fernleihe (Apotheken tauschen Arzneimittel bei Engpass) | 30.09.2026 | Schon gebaut | Community / Indie | Deutsche Suche | Bisoziation | Kandidat | Wenn der Austausch rechtlich geöffnet wird (§ 17 Abs. 6c ApBetrO) und die bestehenden Plattformen ihn nicht bedienen. |
| Kontextabhängige Neuordnung von Inhaltsblöcken | 30.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | Wenn eine Verwaltung kontextabhängige Darstellung als Bürgerdienst fordert und keine Suite sie offen liefert. |
| Mimikry-Detektor (Tarnwirkung eines Falters vor dem Mikrohabitat bewerten) | 30.09.2026 | Schon gebaut | Forschung | Englische Suche | Bisoziation | Kandidat | Wenn ein Zählschema Tarnwirkung als Fehlerquelle ausweist und eine Messgröße belegt ist. |
| Notdienst-/Guardia-Atlas (Notdienst-Abdeckung und Erreichbarkeit von Apotheken) | 30.09.2026 | Beim Empfänger selbst | Behörde | Deutsche Suche | Primärquelle | Kandidat | Wenn ein Land keine öffentliche Notdienstplanung oder Erreichbarkeitsanalyse mehr betreibt oder eine offene, versionierte Historie der Notdienstpläne gefragt wird. |
| Patata de Galicia Wareneingangs-Prüfer | 30.09.2026 | Beim Empfänger selbst | Behörde | Empfänger-Suche | Inversion | Kandidat | Wenn ein Consejo Regulador oder eine Einkaufsgemeinschaft ausdrücklich ein offenes Prüfwerkzeug für Wareneingänge anfragt. |
| Raum-Umbauer und dynamische Raumteilung (Mehrtierhaushalt) | 30.09.2026 | Schon gebaut | Firma | Deutsche Suche | Bisoziation | Kandidat | Wenn eine offene Hardware-Spezifikation mit Tierschutz- oder Forschungsmandat einen Empfänger hat. |
| Retax-Vorprüfer (Rezept vor Abrechnung auf Retaxrisiko prüfen) | 30.09.2026 | Schon gebaut | Firma | Deutsche Suche | Primärquelle | Kandidat | Wenn ein offener, herstellerunabhängiger Retax-Regelkatalog gefragt wird und keine Software ihn abbildet. |
| Robinien-Duftprofil-App (VOC-Stresszustand) | 30.09.2026 | Reality-Check | Niemand | Deutsche Suche | Bisoziation | Kandidat | Wenn ein Forschungsinstitut eine belegte VOC-Signatur für Stockausschlag-Ermüdung publiziert und ein Feldsensor zugänglich ist. |
| Robinien-Risikoflächen aus Geodaten und Luftbildern | 30.09.2026 | Keine neue Fähigkeit | Niemand | Deutsche Suche | Inversion | Kandidat | Wenn ein Landesbetrieb Forst oder eine Naturschutzbehörde Robinien-Polygone offen veröffentlicht und einen Risikoatlas anfragt. |
| Robinienbekämpfung-Dashboard für Kommunen | 30.09.2026 | Keine neue Fähigkeit | Niemand | Deutsche Suche | Inversion | Kandidat | Wenn ein Land Bekämpfungsmaßnahmen an Robinie als offenes Register führt. |
| Rote-Hand-Patientenfassung (Rückruf-/Rote-Hand-Brief in Laiensprache mit Chargenabgleich) | 30.09.2026 | Beim Empfänger selbst | Firma | Deutsche Suche | Inversion | Kandidat | Wenn BfArM oder AMK ausdrücklich Laienfassungen von Rote-Hand-Briefen beauftragen oder ein Register mit Patientenzielgruppe entsteht. |
| Sensorfeld am Transekt (Schall, NIR, Mikroschatten) | 30.09.2026 | Schon gebaut | Forschung | Englische Suche | Bisoziation | Kandidat | Wenn ein Tagfalter-Monitoring (TMD) offene Sensordaten je Transekt als Schnittstelle anbietet. |
| Stimmungsabhängige Tonanpassung von Website-Inhalten | 30.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | Wenn eine Redaktion Tonfall-Hinweise als Freigabe-Vorschlag (nie als stille Änderung) fordert und Werkzeuge fehlen. |
| Tortilla-Heritage Stilzuordnung (mit/ohne Zwiebel, Kerngrad) | 30.09.2026 | Falsche Prämisse | Niemand | Ohne Suche | Bisoziation | Kandidat | Wenn ein Wettbewerb oder eine Zunft eine veröffentlichte, überprüfbare Stilklassifikation mit Referenzbildern anbietet. |
| Tortilla-Setz-Simulation (Struktur und Feuchte über Stunden) | 30.09.2026 | Reality-Check | Niemand | Nicht dokumentiert | Bisoziation | Kandidat | Wenn ein Wettbewerb oder eine Forschungsgruppe Messreihen zu Struktur und Feuchte gegarter Tortillas veröffentlicht. |
| Zertifizierter Spenden-Verpackungsassistent mit AR | 30.09.2026 | Falsche Prämisse | Niemand | Englische Suche | Inversion | Kandidat | Wenn ein Tafel-Landesverband oder eine Lebensmittelaufsicht einen Verpackungs-Vorprüfer ausdrücklich anfragt und der BMEL-Leitfaden die Fragen nicht beantwortet. |
| Augenzähler-Foto (Würfel- oder Kartenaugen per Foto zählen) | 29.09.2026 | Falsche Prämisse | Niemand | Ohne Suche | Primärquelle | Kandidat | Nie, solange Zählen schneller ist als Fotografieren. |
| Bergsonnenuhr-Peiler (Zwölfer-Bergnamen) | 29.09.2026 | Falsche Prämisse | Community / Indie | Ohne Suche | Bisoziation | Kandidat | Wenn eine Forschungsfrage entsteht, die die Benennungsorte statistisch über viele Gipfel eingrenzt und die Liste das nicht leistet. |
| Boule-Messfoto (welche Kugel liegt näher?) | 29.09.2026 | Schon gebaut | Firma | Englische Suche | Primärquelle | Kandidat | Nie als Foto-Messer; nur wenn der Deutsche Pétanque Verband eine offene, geprüfte Messmethode als Turnierstandard ausschreibt, die keine der Apps erfüllt. |
| Cache-Schutzgebiets-Check (Geocaching-Koordinaten gegen BfN-Schutzgebiete) | 29.09.2026 | Schon gebaut | Community / Indie | Deutsche Suche | Primärquelle | Kandidat | Wenn Opencaching oder ein Landesverband Wegpunkte/Finals nachweislich nicht prüft und Cache-Verbände einen offenen Wegpunkt-Checker als Beilage zum Listing anfragen, oder die BfN-Daten unter freier Lizenz einen Browser-Checker tragen. |
| Dialekt-Quiz / Mundart-Diktat / Aufnahme-App | 29.09.2026 | Schon gebaut | Forschung | Deutsche Suche | Primärquelle | Kandidat | Wenn die Apps eingestellt werden und ihre Daten nicht offen bleiben. |
| Hofnamen-Karte mit Adresse und Audio | 29.09.2026 | Schon gebaut | Behörde | Deutsche Suche | Bisoziation | Kandidat | Wenn eine deutsche Landesstelle Hofnamen nachweislich nicht führt und keine Community-Karte besteht. |
| Kader-Zuverlässigkeit (Vereinsfußball als k-aus-n-System) | 29.09.2026 | Falsche Prämisse | Niemand | Ohne Suche | Bisoziation | Kandidat | Wenn ein Kreisspielausschuss oder eine SpielerPlus-/Spond-Auswertung Zusagequoten nach Anlässen veröffentlicht (Datensatz mit Abhängigkeit) und ein Verband daraus eine Kadergrößen-Empfehlung ableiten will. |
| Kernqualität aus der Schalenform (Micro-CT-Abgleich, Handy-Modell je Ernte) | 29.09.2026 | Reality-Check | Niemand | Englische Suche | Bisoziation | Kandidat | Wenn eine begutachtete Studie an Walnüssen belegt, dass Schalenform oder -textur (Foto oder 3D-Scan) den Kernzustand vorhersagt. |
| Kollektivziel-Ledger (Gemeinschaftsziele in Spielen nachweisen) | 29.09.2026 | Beim Empfänger selbst | Gemeinnützige | Englische Suche | Primärquelle | Kandidat | Wenn ein Fördergeber oder eine Aufsicht für Spiele-Impact-Zusagen einen unabhängigen Nachweis verlangt und ein offenes Berichtsformat sucht. |
| LAN-Stromplaner (Lastrechnung für LAN-Partys) | 29.09.2026 | Falsche Prämisse | Niemand | Ohne Suche | Bisoziation | Kandidat | Nie als Rechner; nur wenn ein Veranstalterverband oder eine Elektro-Innung eine Prüfliste für Lastplanung von Veranstaltungen als offenes Formular anfragt. |
| Lootbox-Odds-Auditor (Spieler poolen Öffnungsergebnisse gegen die Herstellerangabe) | 29.09.2026 | Reality-Check | Firma | Englische Suche | Primärquelle | Kandidat | Wenn Deutschland oder die EU eine Odds-Offenlegungspflicht mit Behördenverfahren einführt, das Stichproben als Beschwerdeunterlage annimmt. |
| Namen gegen Ackerzahl | 29.09.2026 | Reality-Check | Niemand | Ohne Suche | Bisoziation | Kandidat | Wenn die Bodenschätzung bundesweit offen wird. |
| Namens-Zeuge (Flurname kennt vergessene Grube) | 29.09.2026 | Reality-Check | Niemand | Ohne Suche | Bisoziation | Kandidat | Wenn ein Landesamt eine Namen-Sachverhalt-Zuordnung an 20 Fällen belegt und den Hinweis selbst tragen will. |
| Omas-Rezept-Mengenübersetzer | 29.09.2026 | Schon gebaut | Firma | Deutsche Suche | Bisoziation | Kandidat | Wenn eine Messreihe historischer Löffel- und Tassenmaße entsteht, die keine Seite trägt. |
| Ortsnamen-Endungen-Atlas | 29.09.2026 | Schon gebaut | Forschung | Deutsche Suche | Bisoziation | Kandidat | Wenn der Atlas offline geht und GN250 die Bestandteile nicht mehr trägt. |
| Plattdeutsch-TTS / -Übersetzer | 29.09.2026 | Beim Empfänger selbst | Behörde | Deutsche Suche | Primärquelle | Kandidat | Wenn das Projekt der Landschaft ohne offene Daten endet und ein anderes Platt (Mecklenburg, Westfalen) unversorgt bleibt. |
| Preisturnier-Ampel (ist mein Kartenturnier erlaubnispflichtig?) | 29.09.2026 | Reality-Check | Behörde | Deutsche Suche | Primärquelle | Kandidat | Wenn eine Glücksspielbehörde der Länder oder ein Skatverband eine maschinenlesbare Prüfliste für Vereinsturniere veröffentlicht und um ein offenes Formular bittet. |
| Sagen-Abenteuer (Ortssage als Kinder-Kurzabenteuer) | 29.09.2026 | Keine neue Fähigkeit | Firma | Ohne Suche | Bisoziation | Kandidat | Wenn ein Heimatverein Sagen offen lizenziert und eine geprüfte Ortsbindung anbietet, die Standortspiele nicht leisten. |
| Skill-Luck-Index (Glücksanteil einer Spielrunde messen, Doppelkopf/Skat) | 29.09.2026 | Reality-Check | Forschung | Englische Suche | Bisoziation | Kandidat | Wenn ein Turnierverband Ergebnisse von mehr als 30 Spielern über viele Runden offen veröffentlicht und einen Glücksanteil-Bericht für die Regelbewertung anfragt. |
| Spielregel-Elemente-Extraktor (Anleitungen maschinell codieren) | 29.09.2026 | Beim Empfänger selbst | Forschung | Deutsche Suche | Primärquelle | Kandidat | Wenn EMPAMOS Daten und Methode offen legt und eine Lücke bei einer Spielschicht für Laien benennt. |
| Straßennamen-Herkunft-Quiz / QR-Schild-Erklärer | 29.09.2026 | Schon gebaut | Community / Indie | Deutsche Suche | Primärquelle | Kandidat | Wenn die OSM-Etymologie-Daten für Deutschland dünn bleiben und keine Kommune Schilder trägt. |
| Tippgemeinschafts-Beleg (Teilnehmerliste und Einzahlung vor der Ziehung festhalten) | 29.09.2026 | Schon gebaut | Firma | Deutsche Suche | Primärquelle | Kandidat | Nie; nur wenn eine Lottogesellschaft ein offenes, herstellerunabhängiges Nachweisformat für Spielgemeinschaften ausschreibt. |
| Vorbewohner-Finder (Adressbücher) | 29.09.2026 | Beim Empfänger selbst | Gemeinnützige | Deutsche Suche | Bisoziation | Kandidat | Wenn CompGen den Zugang schließt oder Adressbücher außerhalb der Abdeckung liegen und Nutzer das nachweisen. |
| Walnuss-Dichte per Photogrammetrie (Volumen aus Video, Gewicht von der Küchenwaage) | 29.09.2026 | Reality-Check | Niemand | Englische Suche | Bisoziation | Kandidat | Wenn eine begutachtete Studie an Walnüssen zeigt, dass die Gesamtdichte (Volumen und Gewicht) Füll- von Hohlnüssen oder schimmligen Kernen trennt. |
| Zeitzeugen-Transkription / Entrauscher | 29.09.2026 | Beim Empfänger selbst | Forschung | Englische Suche | Primärquelle | Kandidat | Wenn Oral-History.Digital die Transkription einstellt oder sie für kleine Heimatarchive nicht zugänglich ist. |
| Akku-Ankaufsuntersuchung (Batteriepass × Pferdekauf) | 28.09.2026 | Schon gebaut | Firma | Nicht dokumentiert | Bisoziation | Kandidat | Nie als Zertifikat. Höchstens, wenn der Batteriepass SoH-Daten öffentlich lesbar macht und kein Händlerprogramm Privatverkäufe abdeckt. |
| Akkutausch-Protokoll (BattVO Art. 11) | 28.09.2026 | Beim Empfänger selbst | Gemeinnützige | Englische Suche | Brainstorm | Kandidat | Nach dem 18.02.2027, wenn eine Marktüberwachungsbehörde Bürgerhinweise zu Art. 11 BattVO anfordert und iFixit sie nicht strukturiert. |
| Barrieren-Spontanmeldung (BFSG × Pharmakovigilanz) | 28.09.2026 | Beim Empfänger selbst | Behörde | Deutsche Suche | Bisoziation | Kandidat | Wenn die MLBF ihr Meldeportal einstellt oder Meldungen nicht aggregiert veröffentlicht und ein Betroffenenverband eine eigene Sammlung verlangt. |
| BFSG-Barrierefreiheitserklärungen-Register | 28.09.2026 | Schon gebaut | Firma | Deutsche Suche | Primärquelle | Kandidat | Wenn die Marktüberwachung keine öffentliche Erklärungsliste führt und kein Verband ein Verzeichnis anbietet. |
| CSRD/ESRS-Berichtsregister | 28.09.2026 | Schon gebaut | Behörde | Englische Suche | Primärquelle | Kandidat | Wenn ESAP die Berichte nicht maschinenlesbar oder nicht kostenfrei bereitstellt. |
| DSA-Anordnungs-Gegenbuch (Art.-15-Berichte gegen DSC-Zahl) | 28.09.2026 | Falsche Prämisse | Forschung | Englische Suche | Bisoziation | Kandidat | Wenn der DSC ein öffentliches Anbieterverzeichnis (Nenner) veröffentlicht oder eine Stelle mit Mandat (GFF, Bundestag) nach der Zahl der nicht übermittelten Anordnungen fragt. |
| Entgeltgefälle-Register (Art. 9 RL 2023/970) | 28.09.2026 | Beim Empfänger selbst | Behörde | Ohne Suche | Primärquelle | Kandidat | Wenn das deutsche Umsetzungsgesetz die Veröffentlichungspflicht der Überwachungsstelle nicht übernimmt oder die Stelle nach Umsetzung keine vergleichbaren Daten veröffentlicht. |
| EPREL-Reparierbarkeits-Nachprüfer | 28.09.2026 | Beim Empfänger selbst | Gemeinnützige | Englische Suche | Primärquelle | Kandidat | Wenn R2R Europe/iFixit das Audit nicht wiederholen und EPREL um weitere Produktgruppen mit Reparierbarkeitsklasse erweitert wird, die niemand prüft. |
| Ersatzteilpreis-Pegel (Ersatzteilpreis-Zeitreihe) | 28.09.2026 | Keine neue Fähigkeit | Gemeinnützige | Englische Suche | Bisoziation | Kandidat | Wenn ein Gericht, eine Behörde oder das deutsche Umsetzungsgesetz „angemessener Preis" relativ zu einem Referenzpreis beziffert — dann wird die Zeitreihe zum Prüfwerkzeug. |
| EzB-Register (Erklärung zur Barrierefreiheit öffentlicher Stellen) | 28.09.2026 | Beim Empfänger selbst | Behörde | Empfänger-Suche | Primärquelle | Kandidat | Wenn der Überwachungsbericht auf die EzB-Kennzahl verzichtet oder die BFIT-Bund öffentlich nach einem Vollverzeichnis fragt. |
| FloraScan / Invasives-Scout (Browser-Native Neophyten-Erkennung) | 28.09.2026 | Schon gebaut | Forschung | Deutsche Suche | Ideenliste | Kandidat | Nie als Allzweck-Kamera-App — nur wenn ein Behörden-Prüfprotokoll für spezifische Neophyten-Meldungen (z. B. Beifuß-Ambrosie) gefordert wird. |
| Gleichstellungsbericht-Archiv (§ 21 EntgTranspG) | 28.09.2026 | Reality-Check | Behörde | Deutsche Suche | Primärquelle | Kandidat | Nie in dieser Form; die Umsetzung der RL 2023/970 ist ein eigenes Thema (Grab entgeltgefaelle-register). |
| GPAI-Trainingsdaten-Zusammenfassungen (Register) | 28.09.2026 | Schon gebaut | Community / Indie | Englische Suche | Primärquelle | Kandidat | Wenn GPAI Ledger aufgegeben wird und das AI Office keine eigene Liste veröffentlicht. |
| Hersteller-Register-Abgleich (BattG / LUCID / PPWR) | 28.09.2026 | Schon gebaut | Behörde | Deutsche Suche | Bisoziation | Kandidat | Wenn ein Register-Träger seine Daten schließt und ein Dritter sie nicht mehr auswerten darf. |
| Kiez-Ohr / Kiez-Radar (Browser-Native Mängelmelder NLP) | 28.09.2026 | Schon gebaut | Behörde | Deutsche Suche | Ideenliste | Kandidat | Nie — Städte akzeptieren keine Mängelberichte über inoffizielle Dritt-Apps ohne verifizierte Authentifizierung. |
| Konfliktmineralien-Berichtsregister (Art. 7 Abs. 3 VO 2017/821) | 28.09.2026 | Reality-Check | Behörde | Deutsche Suche | Primärquelle | Kandidat | Wenn die Kommission oder DEKSOR eine Liste der Unionseinführer veröffentlicht. |
| LkSG-Berichtsregister (BAFA-Berichte) | 28.09.2026 | Falsche Prämisse | Niemand | Deutsche Suche | Primärquelle | Kandidat | Wenn die CSDDD-Umsetzung eine öffentliche Berichtspflicht mit gesetzlich bestimmtem Format einführt und keine Behörde die Berichte selbst veröffentlicht. |
| Nachschraub-Probe (Reparierbarkeitsklasse nachzählen) | 28.09.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Bisoziation | Kandidat | Wenn eine Marktüberwachungsbehörde ein Format veröffentlicht, in dem sie Dritt-Zerlegeprotokolle als Anlass annimmt, und iFixit es nicht bedient. |
| Neuware-Fundbuch (Fundmeldung vernichteter Neuware) | 28.09.2026 | Reality-Check | Niemand | Ohne Suche | Bisoziation | Kandidat | Wenn eine Behörde oder NGO einen geschützten Hinweisgeberkanal für Entsorger-Beschäftigte zu Art. 25 ESPR einrichtet und ein Chargen-Erfassungsformat braucht. |
| pCbCR-Sammler (öffentliche Ertragsteuerinformationsberichte) | 28.09.2026 | Schon gebaut | Firma | Englische Suche | Primärquelle | Kandidat | Wenn Taxplorer eingestellt wird und kein anderer Sammler die pCbCR-Berichte pflegt. |
| PedalPath Planner (WebGPU Radwege-Planer) | 28.09.2026 | Schon gebaut | Community / Indie | Deutsche Suche | Ideenliste | Kandidat | Nie — Streetmix und ADFC decken zivilgesellschaftliche Straßenquerschnittsplanung ab. |
| Quanten-Spielwiese (Browser-Native Quantum Visualizer) | 28.09.2026 | Falsche Prämisse | Forschung | Englische Suche | Ideenliste | Kandidat | Nie als reine Physik-Simulation — nur wenn eine Behörde ein konkretes Quantensensor-Prüfschema vorschreibt. |
| Reparaturformular-Generator (Europäisches Reparaturinformationsformular) | 28.09.2026 | Schon gebaut | Firma | Englische Suche | Primärquelle | Kandidat | Nie für Anbieter. Nur wenn ein Formular-Teil für Verbraucher verpflichtend wird (etwa ein Gegenstück zum Angebot, das der Kunde prüfen muss) und die Anbieter-Tools ihn nicht abbilden. |
| Reparaturverlangen-/Gewährleistungs-Uhr | 28.09.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Primärquelle | Kandidat | Nie als Brief- oder Fristrechner. Höchstens, wenn die Verbraucherzentralen ihre Musterbriefe einstellen. |
| Update-Pegel (Sicherheitsupdates über die Zeit) | 28.09.2026 | Schon gebaut | Community / Indie | Englische Suche | Bisoziation | Kandidat | Nie für den Verlauf. Nur wenn eine Behörde einen konkreten Abgleich „zugesagte Updatejahre (EPREL) gegen gelieferte Patchlevel" als Vollzugsformat verlangt. |
| Wärmeplan-Register (kommunale Wärmepläne nach WPG) | 28.09.2026 | Schon gebaut | Behörde | Deutsche Suche | Primärquelle | Kandidat | Wenn der KWW-Atlas eingestellt wird oder aufhört, neue Pläne aufzunehmen. |
| Bohrmehl-Foto (Borkenkäfer im Privatwald) | 27.09.2026 | Falsche Prämisse | Behörde | Eigener Atlas / Protokoll | Primärquelle | Kandidat | Wenn eine Forstbehörde benennt, dass Waldbesitzer Bohrmehl nicht erkennen (statt nicht ablaufen) — nie für die reine Meldefunktion. |
| Brennholz-Raummaß-Check | 27.09.2026 | Schon gebaut | Firma | Englische Suche | Brainstorm | Kandidat | Nie als Funktion; nur falls Eichbehörden oder eine Verbraucherzentrale ein amtliches Nachmessverfahren für Schüttraummeter fordern, das die Apps nicht abbilden. |
| EUDR-Kleinwald-Erklärung | 27.09.2026 | Schon gebaut | Firma | Empfänger-Suche | Brainstorm | Kandidat | Wenn die EUDR-Vereinfachung für Kleinerzeuger zurückgenommen wird und die bestehenden Forst-Apps die Einreichung hinter eine Bezahlschranke legen. |
| Hausbock-Horcher (Handy-Akustik im Dachstuhl) | 27.09.2026 | Beim Empfänger selbst | Forschung | Deutsche Suche | Primärquelle | Kandidat | Wenn ein Körperschall-Aufsatz fürs Handy (≥ 100 kHz) unter 50 € erhältlich wird und weder WKI noch IADS ein Laienwerkzeug für die Aktiv/Inaktiv-Frage anbieten. |
| Holzart per Handyfoto (EUDR/CITES-Gegencheck) | 27.09.2026 | Beim Empfänger selbst | Forschung | Empfänger-Suche | Primärquelle | Kandidat | Nie für die Holzartbestimmung; höchstens, wenn Thünen die Apps einstellt und die ITWM-KI nie veröffentlicht wird. |
| Holzschutzmittel-Altlast-Lotse (PCP/Lindan/DDT) | 27.09.2026 | Schon gebaut | Firma | Deutsche Suche | Brainstorm | Kandidat | Wenn ein peer-reviewtes Verfahren PCP/Lindan auf Holzoberflächen mit Smartphone plus Billig-Zubehör (Teststreifen-Kolorimetrie, Mini-NIR/Raman) nachweist. |
| Kaminrauch-Beweisbuch (Rauchopazität per Handyvideo + DWD-Wind für Nachbarn) | 27.09.2026 | Reality-Check | Niemand | Deutsche Suche | Brainstorm | Kandidat | Wenn ein Bundesland oder die 1. BImSchV ein bildgestütztes Anlassverfahren (z. B. Foto-/Videomeldung als Auslöser einer Überprüfung) ausdrücklich zulässt und ein kostengünstiger Messweg für die Dunkelheit (PM-Sensor mit Windzuordnung) als Beleg anerkannt wird. |
| Mikrohabitat-Übungsdeck (Habitatbaum-Ansprache) | 27.09.2026 | Schon gebaut | Forschung | Deutsche Suche | Bisoziation | Kandidat | Nie als Übungsdeck; höchstens, wenn das I+-Marteloskop-Netz eingestellt wird. |
| Rückbauholz-Vorsortierer (Handy-Vorsortierung nach DIN 4074 am Rückbauort) | 27.09.2026 | Beim Empfänger selbst | Forschung | Empfänger-Suche | Primärquelle | Kandidat | Wenn der ReFoRe-Abschlussbericht (nach 12/2026) nur ein Scanner-/HoloLens-Konzept ohne Handy-Feldwerkzeug liefert und die Feldtriage am Rückbauort ausdrücklich als offenen nächsten Schritt nennt. |
| Scheitholz-Trocknungsuhr | 27.09.2026 | Keine neue Fähigkeit | Firma | Deutsche Suche | Primärquelle | Kandidat | Wenn eine KI-Messung des Wassergehalts (aus Foto oder Klopfton) belegt machbar wird — dann ist die Messung die Idee, nicht die Uhr. |
| Die Daten-Schicht (Synchronous Transcription Events) | 24.09.2026 | Schon gebaut | Gemeinnützige | Englische Suche | Bisoziation | Kandidat | Wenn eine technologische Neuerung den synchronen Event funktional unabdingbar macht. |
| ParagraphenDolmetscher | 24.09.2026 | Schon gebaut | Firma | Deutsche Suche | Modell-Katalog | Dose gepackt | Wenn jobcenter.guru und die übrigen kostenlosen Angebote verschwinden — und dann zuerst KlarLokal prüfen, nicht diese Dose. |
| Räumungsvorhersage aus Kündigungsfristen | 23.09.2026 | Reality-Check | Niemand | Ohne Suche | Bisoziation | Kandidat | Wenn es eine rechtmäßige, anonymisierte Quelle für Umzugsvolumen gibt. |
| Wunschseite / Nachfrage-Karte | 23.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | nie. |
| Crack Flora Watcher (Ritzengrün-Wächter) | 21.09.2026 | Schon gebaut | Gemeinnützige | Englische Suche | Modell-Katalog | Mail entworfen | Wenn GrowApp und Nature's Notebook eingestellt werden. Die Nachfolgerin ist die Dose „Beobachtungsposten mit Übergabe". |
| Gamifizierte Ritzenpflanzen-Entdeckung | 21.09.2026 | Beim Empfänger selbst | Forschung | Empfänger-Suche | Modell-Katalog | Dose gepackt | nie — beim Empfänger selbst. |
| Samenkarten-Markt, Cross-City-Handel, Auktionshaus | 21.09.2026 | Keine neue Fähigkeit | Niemand | Ohne Suche | Brainstorm | Kandidat | nie. |
| Spiel über echte Pflanzenarten | 21.09.2026 | Schon gebaut | Firma | Englische Suche | Brainstorm | Kandidat | nie — Genre ist besetzt; frei blieb nur das lebende Spielobjekt. |
| Abrechnungsfoto → Raumverbrauch als Kalibrierung | 19.09.2026 | Reality-Check | Niemand | Deutsche Suche | Bisoziation | Kandidat | Wenn Heizkostenverteiler kWh statt dimensionsloser Einheiten liefern (Fernablesung ab 2027 prüfen). |
| Hausakte mit gespiegelten Grundrissen | 19.09.2026 | Duplikat | Eigener Bestand | Eigener Atlas / Protokoll | Bisoziation | Kandidat | nie — lebt in Altbau Thermal weiter. |
| Hausweite Symptomkarte (Schimmel über Etagen) | 19.09.2026 | Reality-Check | Niemand | Deutsche Suche | Bisoziation | Kandidat | Wenn sich die Rechtsprechung zu Wärmebrücken im Bestand ändert. |
| Kirchen-Baubegehung digital | 19.09.2026 | Schon gebaut | Firma | Empfänger-Suche | Primärquelle | Kandidat | nie. |
| Raumscan/LiDAR → Heizlast | 19.09.2026 | Schon gebaut | Firma | Deutsche Suche | Bisoziation | Kandidat | nie. |
| Sandstein-Streiflicht-Relief | 19.09.2026 | Duplikat | Eigener Bestand | Eigener Atlas / Protokoll | Modell-Katalog | Kandidat | nie — lebt als Streiflicht weiter. |
| Schadenskartierung per Foto (Denkmalfassade) | 19.09.2026 | Schon gebaut | Firma | Deutsche Suche | Primärquelle | Kandidat | nie. |
| Schimmel-Symptomdiagnose (Ursachen-Band) | 19.09.2026 | Schon gebaut | Firma | Eigener Atlas / Protokoll | Bisoziation | Kandidat | nie. |
| Baum-Stigmergie (Kontrollhistorie am Baum) | 18.09.2026 | Schon gebaut | Firma | Deutsche Suche | Bisoziation | Kandidat | nie — Muster „Objekt + Prüfpflicht" ist dicht. |
| Baum-Verfallsdatum (Befund verfällt ohne Foto-Bestätigung) | 18.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat | nie. |
| Handy-Barometer/Infraschall für Feuerkugeln | 18.09.2026 | Schon gebaut | Forschung | Englische Suche | Bisoziation | Kandidat | nie. |
| Radio-Meteorscatter × visuelle Zeugenmeldung | 18.09.2026 | Schon gebaut | Forschung | Englische Suche | Bisoziation | Kandidat | nie. |
| Tafel-Warenannahme per Foto | 18.09.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Brainstorm | Kandidat | Wenn das Förderprojekt ausläuft und die App nicht weiterbetrieben wird. |
| Balkonkraftwerk-Verschattung per Handykamera | 16.09.2026 | Schon gebaut | Community / Indie | Forum / Nische | Brainstorm | Kandidat | nie — Balkonsolar ist ein aktiver Bastlermarkt. |
| Betriebskostenabrechnung prüfen | 16.09.2026 | Schon gebaut | Firma | Nicht dokumentiert | Brainstorm | Kandidat | nie. |
| Chor-Übedateien aus Aufnahme (SATB-Trennung) | 16.09.2026 | Schon gebaut | Firma | Englische Suche | Brainstorm | Kandidat | nie — Stem-Trennung ist ein dichter Markt. |
| Hitze-Schattenrouten für Ältere | 16.09.2026 | Schon gebaut | Forschung | Nicht dokumentiert | Brainstorm | Kandidat | nie — Forschung und Kommunen sind aktiv. |
| Kreuzungs-Falschparker & Schulweg-Gefahrenkarte | 16.09.2026 | Schon gebaut | Behörde | Nicht dokumentiert | Brainstorm | Kandidat | nie. |
| Mängelanzeige-/Schimmel-Assistent für Mieter | 16.09.2026 | Schon gebaut | Firma | Nicht dokumentiert | Brainstorm | Kandidat | nie — Mieter-Tools sind kommerziell dicht. |
| Repair-Café-Diagnoseassistent | 16.09.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Brainstorm | Kandidat | nie — beim Empfänger selbst. |
| Wheelmap: Eingangsfoto → Barrierefreiheit | 16.09.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Brainstorm | Kandidat | nie — beim Empfänger selbst. |
| Commute Oracle | 09/2026 | Schon gebaut | Firma | Nicht dokumentiert | Ideenliste | Kandidat | nie — Pendelprognose ist ein Kernprodukt großer Kartenanbieter. |
| git-archaeologist (MCP) | 09/2026 | Schon gebaut | Community / Indie | Nicht dokumentiert | Ideenliste | Kandidat | nie — naheliegendes Tooling im aktiven MCP-Ökosystem wird mehrfach gebaut. |
| Home-Network MCP | 09/2026 | Schon gebaut | Community / Indie | Nicht dokumentiert | Ideenliste | Kandidat | nie — mindestens vier unabhängige Server. |
| Repo-Museum | 09/2026 | Schon gebaut | Community / Indie | Nicht dokumentiert | Ideenliste | Kandidat | nur als eigenes Spielzeug, nie als Geschenk — die Metapher ist Design, keine Fähigkeit. |

<!-- MUSTER:END -->

---

## Was die Gräber sagen (Stand 24.09.2026)

*Von Hand geschrieben, datiert — die Zahlen oben ändern sich, dieser Abschnitt nicht von selbst.*

1. **Alle drei teuren Tode kamen aus Modell-Text.** Crack Flora Watcher (zwei Mails fertig), ParagraphenDolmetscher und die gamifizierte Ritzenpflanzen-Entdeckung wurden zur Dose, ohne je gesucht worden zu sein — alle aus einem Modelllauf (Gemini-Runde, Katalog „AI Frontier 2026"). Laut Stadium-Feld ist keine Idee aus Ideenliste, Brainstorm, Quelle oder Bisoziation nach dem Packen gestorben. **Folge:** Modell-Text trägt `ungeprüft`, bis eine Protokollzeile existiert (seit 24.09. per Guard erzwungen).
2. **„Schon gebaut" ist die Haupttodesursache (69 %), „beim Empfänger" die billigste (13 %).** Alle vier Empfänger-Tode wurden über die Empfänger-Suche gefunden — zwei davon aber erst im Recheck (Tafel, Flora Incognita), weil die Erstprüfung den Empfänger nur halb gelesen hatte: bei Tafel die erste Pressemitteilung statt der ganzen App, bei Flora Incognita nur den ersten statt aller genannten Empfänger. Die Regel „Empfänger zuerst" hilft nur, wenn man den Empfänger ganz liest.
3. **Keine Sprache reicht allein.** Englisch hat 7 getötet, Deutsch 6. Englisch fand die Konsum- und Forschungsfälle (SATB, Olio, GrowApp, FRIPON), Deutsch die Fachnischen und deutschen Anbieter (Baumplaketten, Heizlast-Scanner, jobcenter.guru). Das bestätigt die Vorzieh-Regel in beide Richtungen (Playbook §1, Nachtrag Bruchlesen).
4. **Reality-Checks töten nur Bisoziationsideen** (3 von 3) — und zwar ohne oder mit einer Suche. Kollisionen weit entfernter Felder erzeugen öfter Ideen, die an Recht, Daten oder Physik scheitern. Bei Bisoziation deshalb Datenfrage und Rechtsfrage *vor* die Existenzsuche.
5. **Ein Viertel der Fundwege ist nicht dokumentiert** — Runde 1 und 2 haben nicht festgehalten, welche Suche tötete. Ab jetzt ist `foundBy` Pflicht; der Anteil `unbekannt` sollte nur noch sinken.
6. **Grenze dieser Auswertung:** Gezählt sind Tote, nicht Geborene. Dass Bisoziation und Brainstorm je 11 Gräber haben, sagt nichts über ihre Sterblichkeit, solange nicht gezählt ist, wie viele Ideen jede Methode insgesamt erzeugt hat. Das steht im Prüfprotokoll und ist der nächste Schritt: Sterblichkeit je Herkunft = Gräber ÷ Protokollzeilen je Methode.

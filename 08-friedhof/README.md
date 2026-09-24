# Der Friedhof

> Ein Friedhof ist kein Portfolio. Er ist ein Obduktionssaal.

Hier liegt jede Idee, die in Amélie gestorben ist — mit Totenschein. Nicht, um sie aufzubewahren, sondern um zu sehen, **woran** sie gestorben ist. Eine einzelne tote Idee ist eine Anekdote. Dreißig mit Ursache, Fundweg und Herkunft sind ein Muster, und das Muster ist die einzige Stelle, an der die Methode aus ihren Fehlern lernt.

Bis zum 24.09.2026 galt die Gegenregel: *„gelöscht, nicht archiviert"*. Sie hat sich als falsch erwiesen, wie vor ihr „nie unterschreiben" (Regel 2). Gelöschte Ideen tauchten wieder auf (Sandstein-Streiflicht war Streiflicht, ParagraphenDolmetscher war KlarLokal), zurückgezogene Dosen blieben in der App lebendig (Crack Flora Watcher mit zwei fertigen Mails), und niemand konnte sagen, ob die meisten Ideen an der englischen Suche starben oder am eigenen Atlas. Die Begründung steht im Manifest, Abschnitt „Der Friedhof".

---

## Friedhofsordnung

**1 · Trennen.** Was stirbt, verlässt die Dosen am selben Tag — aus `src/data/dosen.ts` (`DOSEN_DATA` → `DISCARDED_DATA`), aus `05-dosen/`, aus der Zustellliste. Keine Dose mit Warnbanner, keine Mail an einen Toten.

**2 · Totenschein.** Jedes Grab hat sieben Pflichtangaben. Ein Grab ohne Ursache ist ein Archiveintrag, und Archive sind verboten.

| Feld | Frage | Werte |
|---|---|---|
| `cause` | Woran starb sie? | `gebaut` · `beim-empfaenger` · `duplikat` · `mode` · `reality-check` · `praemisse` |
| `killer` | Wer hatte sie schon? | `kommerziell` · `gemeinnuetzig` · `behoerde` · `forschung` · `community` · `eigener-bestand` · `keiner` |
| `foundBy` | Welche Suche fand es heraus? | `englisch` · `deutsch` · `forum` · `empfaenger` · `eigener-bestand` · `ohne-suche` · `unbekannt` |
| `origin` | Woher kam die Idee? | `ideenliste` · `brainstorm` · `quelle` · `bisoziation` · `modell-katalog` |
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

1. Eintrag in `DISCARDED_DATA` (`src/data/dosen.ts`) mit allen Pflichtfeldern — TypeScript lässt kein Grab ohne Totenschein durch.
2. War es eine Dose: Eintrag aus `DOSEN_DATA` entfernen, `05-dosen/<id>.md` nach `08-friedhof/grabbeigaben/` verschieben (Originaltext bleibt als Grabbeigabe), `nachruf` darauf zeigen lassen. Mails in `src/data/deliveries.ts`, die nur diese Dose verlinken, löschen.
3. Langer Nachruf, wenn die Geschichte eine Lehre trägt, die nicht in zwei Sätze passt: `nachrufe.md`.
4. `npm run friedhof` — schreibt die Muster unten neu. `npm run lint` prüft, dass sie aktuell sind.

---

## Muster

<!-- MUSTER:START -->

*Automatisch erzeugt aus `src/data/dosen.ts` (`DISCARDED_DATA`) mit `npm run friedhof`. Nicht von Hand bearbeiten — `npm run lint` meldet Abweichungen.*

**32 Gräber.** 3 davon starben erst als Dose oder Mail-Entwurf (teure Tode). Von 24 dokumentierten Fundwegen kamen 5 ohne neue Suche aus (eigener Atlas, eigenes Protokoll oder Reality-Check) — 21 %.

**Woran sie starben**

| | Gräber | Anteil |
|---|---:|---:|
| Schon gebaut | 22 | 69 % |
| Beim Empfänger selbst | 4 | 13 % |
| Reality-Check | 3 | 9 % |
| Duplikat | 2 | 6 % |
| Keine neue Fähigkeit | 1 | 3 % |

**Welche Suche traf**

| | Gräber | Anteil |
|---|---:|---:|
| Nicht dokumentiert | 8 | 25 % |
| Englische Suche | 7 | 22 % |
| Deutsche Suche | 6 | 19 % |
| Empfänger-Suche | 5 | 16 % |
| Eigener Atlas / Protokoll | 3 | 9 % |
| Ohne Suche | 2 | 6 % |
| Forum / Nische | 1 | 3 % |

**Woher sie kamen**

| | Gräber | Anteil |
|---|---:|---:|
| Bisoziation | 11 | 34 % |
| Brainstorm | 11 | 34 % |
| Ideenliste | 4 | 13 % |
| Modell-Katalog | 4 | 13 % |
| Primärquelle | 2 | 6 % |

**Wer sie schon hatte**

| | Gräber | Anteil |
|---|---:|---:|
| Firma | 13 | 41 % |
| Community / Indie | 4 | 13 % |
| Forschung | 4 | 13 % |
| Gemeinnützige | 4 | 13 % |
| Niemand | 4 | 13 % |
| Eigener Bestand | 2 | 6 % |
| Behörde | 1 | 3 % |

**Wie weit sie kamen**

| | Gräber | Anteil |
|---|---:|---:|
| Kandidat | 29 | 91 % |
| Dose gepackt | 2 | 6 % |
| Mail entworfen | 1 | 3 % |

### Alle Gräber (neueste zuerst)

| Idee | † | Ursache | Wer sie hatte | Gefunden durch | Herkunft | Kam bis |
|---|---|---|---|---|---|---|
| ParagraphenDolmetscher | 24.09.2026 | Schon gebaut | Firma | Deutsche Suche | Modell-Katalog | Dose gepackt |
| Räumungsvorhersage aus Kündigungsfristen | 23.09.2026 | Reality-Check | Niemand | Ohne Suche | Bisoziation | Kandidat |
| Wunschseite / Nachfrage-Karte | 23.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat |
| Crack Flora Watcher (Ritzengrün-Wächter) | 21.09.2026 | Schon gebaut | Gemeinnützige | Englische Suche | Modell-Katalog | Mail entworfen |
| Gamifizierte Ritzenpflanzen-Entdeckung | 21.09.2026 | Beim Empfänger selbst | Forschung | Empfänger-Suche | Modell-Katalog | Dose gepackt |
| Samenkarten-Markt, Cross-City-Handel, Auktionshaus | 21.09.2026 | Keine neue Fähigkeit | Niemand | Ohne Suche | Brainstorm | Kandidat |
| Spiel über echte Pflanzenarten | 21.09.2026 | Schon gebaut | Firma | Englische Suche | Brainstorm | Kandidat |
| Abrechnungsfoto → Raumverbrauch als Kalibrierung | 19.09.2026 | Reality-Check | Niemand | Deutsche Suche | Bisoziation | Kandidat |
| Hausakte mit gespiegelten Grundrissen | 19.09.2026 | Duplikat | Eigener Bestand | Eigener Atlas / Protokoll | Bisoziation | Kandidat |
| Hausweite Symptomkarte (Schimmel über Etagen) | 19.09.2026 | Reality-Check | Niemand | Deutsche Suche | Bisoziation | Kandidat |
| Kirchen-Baubegehung digital | 19.09.2026 | Schon gebaut | Firma | Empfänger-Suche | Primärquelle | Kandidat |
| Raumscan/LiDAR → Heizlast | 19.09.2026 | Schon gebaut | Firma | Deutsche Suche | Bisoziation | Kandidat |
| Sandstein-Streiflicht-Relief | 19.09.2026 | Duplikat | Eigener Bestand | Eigener Atlas / Protokoll | Modell-Katalog | Kandidat |
| Schadenskartierung per Foto (Denkmalfassade) | 19.09.2026 | Schon gebaut | Firma | Deutsche Suche | Primärquelle | Kandidat |
| Schimmel-Symptomdiagnose (Ursachen-Band) | 19.09.2026 | Schon gebaut | Firma | Eigener Atlas / Protokoll | Bisoziation | Kandidat |
| Baum-Stigmergie (Kontrollhistorie am Baum) | 18.09.2026 | Schon gebaut | Firma | Deutsche Suche | Bisoziation | Kandidat |
| Baum-Verfallsdatum (Befund verfällt ohne Foto-Bestätigung) | 18.09.2026 | Schon gebaut | Firma | Englische Suche | Bisoziation | Kandidat |
| Handy-Barometer/Infraschall für Feuerkugeln | 18.09.2026 | Schon gebaut | Forschung | Englische Suche | Bisoziation | Kandidat |
| Radio-Meteorscatter × visuelle Zeugenmeldung | 18.09.2026 | Schon gebaut | Forschung | Englische Suche | Bisoziation | Kandidat |
| Tafel-Warenannahme per Foto | 18.09.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Brainstorm | Kandidat |
| Balkonkraftwerk-Verschattung per Handykamera | 16.09.2026 | Schon gebaut | Community / Indie | Forum / Nische | Brainstorm | Kandidat |
| Betriebskostenabrechnung prüfen | 16.09.2026 | Schon gebaut | Firma | Nicht dokumentiert | Brainstorm | Kandidat |
| Chor-Übedateien aus Aufnahme (SATB-Trennung) | 16.09.2026 | Schon gebaut | Firma | Englische Suche | Brainstorm | Kandidat |
| Hitze-Schattenrouten für Ältere | 16.09.2026 | Schon gebaut | Forschung | Nicht dokumentiert | Brainstorm | Kandidat |
| Kreuzungs-Falschparker & Schulweg-Gefahrenkarte | 16.09.2026 | Schon gebaut | Behörde | Nicht dokumentiert | Brainstorm | Kandidat |
| Mängelanzeige-/Schimmel-Assistent für Mieter | 16.09.2026 | Schon gebaut | Firma | Nicht dokumentiert | Brainstorm | Kandidat |
| Repair-Café-Diagnoseassistent | 16.09.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Brainstorm | Kandidat |
| Wheelmap: Eingangsfoto → Barrierefreiheit | 16.09.2026 | Beim Empfänger selbst | Gemeinnützige | Empfänger-Suche | Brainstorm | Kandidat |
| Commute Oracle | 09/2026 | Schon gebaut | Firma | Nicht dokumentiert | Ideenliste | Kandidat |
| git-archaeologist (MCP) | 09/2026 | Schon gebaut | Community / Indie | Nicht dokumentiert | Ideenliste | Kandidat |
| Home-Network MCP | 09/2026 | Schon gebaut | Community / Indie | Nicht dokumentiert | Ideenliste | Kandidat |
| Repo-Museum | 09/2026 | Schon gebaut | Community / Indie | Nicht dokumentiert | Ideenliste | Kandidat |

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

---
status: Available
delivery_method: E-Mail
target_maker: AG Fraktographie von DGM und DVM an der BAM
review_score: 32/35
architecture_tier: Tier 1
source_type: Type D
---
# Bruchlesen

*(Arbeitstitel im Bisoziation-Log: Ground Truth)*

**Ein Satz:** Ein Übungsgerät für Fraktografie, das Bruchflächen mit exakt bekannter Ursache in beliebiger Zahl erzeugt — du drehst das Streiflicht, zeigst auf den Ursprung, schätzt den Spiegelradius und die Last, und danach läuft der Riss vor deinen Augen rückwärts ab.

**Stand:** 23.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** **AG Fraktographie von DGM und DVM an der BAM** (Leitung Dr.-Ing. Dirk Bettge, rund 126 Mitglieder aus Forschung und Industrie; betreibt die Referenzdatenbank FractoDB und den Kurs „Fraktographie metallischer Werkstoffe") · nachrangig: HVG-DGG (Glas), Glas- und Keramikrestaurierung (ICOM-CC Working Group Glass & Ceramics), forensische Glasanalyse (OSAC-Umfeld)
**Verdikt:** 🎁 verschenken — Organisation mit Weiterbildungsauftrag, eigener Referenzsammlung und Termin in Berlin; die Idee wäre für sie ein Übungsmodus zu dem, was sie schon hat, kein neues Projekt  
**Review:** 32/35 · Tier 1 · Type D (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Wer Bruchflächen lesen lernt, lernt es an echten Stücken, und davon gibt es zu wenige mit sicher bekannter Ursache. Die Norm für Glas und Keramik sagt das selbst: Die Fraktografie bleibt ein „qualitative, judgment-based" Verfahren, und „novices often lose much time searching for the origin" (ASTM C1322). Gelernt wird deshalb im Präsenzkurs am Belegstück — bei Gerresheimer, bei American Glass Research, bei ASM, in der Forensik nach dem OSAC-Entwurf 2023-N-0005 für die Ausbildung von Glasgutachtern.

Das hat zwei Folgen, die jede Übung mit Rückmeldung verhindern:

- **Die Musterlösung ist selbst eine Deutung.** Bei einem Schadensfall steht die Ursache fest, weil ein Fachmann sie festgestellt hat — nicht, weil jemand dabei war. Wer übt, gleicht sich mit einem Urteil ab, nicht mit der Wahrheit.
- **Die Stücke sind endlich.** Ein Kurs hat seine Sammlung. Nach zwanzig Stücken kennt man sie; eine systematische Variation — derselbe Bruch, nur mit tieferem Fehler, höherer Last, anderer Temperatur — gibt es physisch nicht.

Die AG Fraktographie hat das Problem als Erste ernst genommen: Seit 2013 sammelt sie in **FractoDB** tausende Bruchflächenbilder aus Schadensfällen und Vergleichsuntersuchungen, für die Fachgemeinschaft kostenlos auf Anfrage, dazu die Symbolsprache **FractoGraphics**. Das ist die Referenz — aber eine Referenz ist zum Nachschlagen da, nicht zum Üben: Sie zeigt die Lösung mit dem Bild.

**Wer leidet:** Nachwuchs in Schadensanalyse und Werkstoffprüfung, Glas- und Keramikrestaurierung, forensische Glasanalyse, Gutachter für Glasbruch am Bau — alle, die ein Urteil sicher genug fällen müssen, dass jemand dafür haftet, und dafür an einer Handvoll Stücken geübt haben.

## Warum das jetzt geht

1. **Die Merkmale sind simulierbar geworden.** Silling, Bobaru und Wang (Sandia / University of Nebraska) reproduzieren mit Multiskalen-Peridynamik Verzweigung, den Übergang Spiegel–Nebel–Rauhigkeit mit wachsender Rissgröße, die Rissablenkung im Druckbereich und Möwenflügel-Muster an Fehlstellen; der Übergangsradius sinkt mit der Spannung, wie im Experiment. Die geometrische Beschreibung der Oberflächenmerkmale spröder Werkstoffe liegt vor (*Engineering Fracture Mechanics* 2016). Was 2015 ein Konferenzbeitrag war, läuft heute auf einer Grafikkarte.
2. **Die Kraftgeschichte liegt im Solver ohnehin vor.** Ursprung, Last, Fehlergröße und Rissgeschwindigkeit sind Eingaben oder Zwischenergebnisse. Die Musterlösung muss nicht erschlossen werden — sie wird mitprotokolliert. Das ist der ganze Trick: Die Urheberschaft der Lösung wechselt vom Gutachter zur Simulation.
3. **Das Bewertungsschema ist genormt und liegt als Text vor.** ASTM C1322 für die Merkmale, C1678 für Spiegelradius → Bruchspannung. Punkte zu vergeben ist keine Erfindung, sondern Abschreiben.
4. **Die Bildseite ist gelöst.** Streiflicht-Rendering einer Oberfläche mit bekannter Topografie ist Standard; der Lernende dreht das Licht, wie er es am Stereomikroskop tut.

## Skizze

- **Eine Runde:** eine simulierte Bruchfläche (zuerst Glasstab und Glasplatte unter Biegung), gerendert mit frei drehbarem Streiflicht — Winkel und Azimut, nicht Zoom.
- **Drei Antworten:** Ursprung (klicken), Spiegelradius (ziehen), Lastart (wählen: Biegung, Zug, Schlag, thermisch).
- **Auflösung:** Der Riss läuft vom wahren Ursprung aus ab, dein Klick bleibt stehen. Aus dem Spiegelradius rechnet C1678 die Spannung, daneben steht die, die wirklich anlag.
- **Schwierigkeit** über die Fälle, die die Norm selbst als schwer nennt: Ursprung an der Kante, mehrere Fehler, Kontaktschaden, thermischer Bruch ohne klassischen Spiegel.
- **Echte Stücke im Mix:** Jede Stufe enthält blind ein Foto eines realen Belegstücks mit gesicherter Ursache — aus FractoDB oder aus einer Vergleichsuntersuchung. Wer nur die Simulation gelernt hat, fällt dort durch (siehe „Wo es kippt").
- **Spielmodus „Einer bricht, einer liest":** Eine Person stellt das Rezept ein (Fehlstelle, Aufprallpunkt, Vorspannung) und sieht das Ergebnis nie, die andere bekommt nur die Fläche. Man verschickt Seeds, keine Zustände.

**Nicht dabei:** keine Zertifizierung, kein Gutachten-Export, keine Schadensfall-Datenbank (die gibt es — FractoDB), keine automatische Bruchbewertung echter Stücke (das ist ein anderes, dicht besetztes Feld).

## Erster Schritt

**Ticket: Ein Glasstab, eine Biegung, ein Ursprung, ein Streiflichtregler.**

Peridynamik-Lauf für einen Glasstab im Vierpunktbiegeversuch mit einem Oberflächenfehler an bekannter Stelle; Oberfläche exportieren, mit drehbarem Streiflicht im Browser rendern.

**Fertig, wenn:** drei Menschen, die Fraktografie beherrschen, auf dem gerenderten Bild den Ursprung jeweils innerhalb eines Spiegelradius finden — und drei, die es nicht können, deutlich daneben liegen. Gelingt das nicht, ist das Bild zu glatt, und alles Weitere wartet. Der Test gehört an den Anfang, weil er über die ganze Idee entscheidet.

## Wo es kippt

**1. Es trainiert die Simulation statt des Materials.** Das ist nicht der Randfall, sondern der wahrscheinlichste Ausgang. Peridynamik trifft die Merkmale qualitativ und den Trend des Übergangsradius, überschätzt aber die Grenzgeschwindigkeit des Risses (so Silling u. a. selbst). Wer nur an gerenderten Flächen übt, lernt die Handschrift des Lösers. Gegenmittel ist eingebaut, nicht nachgereicht: die blind untergemischten echten Stücke. Wer dort schlechter ist als auf den simulierten, hat das Falsche gelernt, und das Gerät muss es anzeigen.

**2. Metall ist nicht Glas.** FractoDB und der BAM-Kurs kommen aus der Metallfraktografie (Rasterelektronenmikroskop, Schwingstreifen, Waben); die Merkmale, die sich heute gut simulieren lassen, sind die spröder Werkstoffe (Spiegel, Nebel, Rauhigkeit). Der Empfänger ist richtig, weil er die Weiterbildung und die Referenzsammlung besitzt — aber der erste Inhalt ist Glas und Keramik. Wenn die AG das nicht als ihr Thema sieht, ist der nächste Empfänger die Glasbranche (HVG-DGG) oder die Restaurierung.

**3. Die Norm ist nicht frei.** ASTM C1322 und C1678 sind kostenpflichtig. Das Gerät darf das Schema anwenden, aber nicht den Normtext mitliefern; wer es baut, braucht die Norm einmal selbst.

## Wer es schon versucht hat

**Recherche 23.09.2026, englisch zuerst, danach deutsch und beim Empfänger.** Ausführlich: `06-suche/amelie-pruefprotokoll.md`, Nachprüfung 23.09.2026 und Nachtrag Bruchlesen.

- **Referenz, nicht Übung:** FractoDB (AG Fraktographie, BAM/DGM, seit 2013) — tausende reale Bruchflächenbilder aus Schadensfällen und Vergleichsuntersuchungen, kostenlos auf Anfrage (`fraktographie@bam.de`), dazu FractoGraphics. Das ist die größte digitale Sammlung, und sie ist Nachschlagewerk: Die Ursache steht beim Bild.
- **Ausbildung nur in Präsenz:** Gerresheimer „Fractography Practical Training Course", American Glass Research „Fracture 3: Master Class", ASM Failure-Analysis-Training, OSAC 2023-N-0005 für forensische Glasanalyse, DGM-Kurs „Fraktographie metallischer Werkstoffe" (10.–11.03.2027, Berlin). HVG-DGG führt nach eigener Seminarseite keinen Fraktografie-Kurs.
- **Simulation als Forschung, ohne Lernbezug:** Silling, Bobaru, Wang, „Simulation of fractographic features in glass with multiscale peridynamics" (USNCCM13, 2015) — kein Wort zu Ausbildung.
- **Software liest selbst, statt Menschen lesen zu lehren:** DINOv2-basierte REM-Fraktografie mit FFT-Schwingstreifenanalyse (*Materials Characterization* 2026), unüberwachtes Lernen in der Fraktografie (2021), Bruchmodus-Klassifikation per Texturanalyse (2022). Das ist das Gegenteil dieser Dose: Dort verschwindet der Mensch aus dem Urteil, hier wird er darin besser.

**Restlücke:** Bruchflächen mit **exakt** bekannter Ursache in **beliebiger** Zahl und **systematischer** Variation, als **Übung mit Rückmeldung** — für spröde Werkstoffe zuerst.

## Vorarbeit

- **AG Fraktographie (DGM/DVM) an der BAM** — FractoDB, FractoGraphics, Kurz-Webinar zur Datenbank (10.06.2026), Arbeitskreissitzung **20.11.2026 in Berlin** und online, Kurs 10.–11.03.2027 in Berlin.
- **Silling, Bobaru, Wang (2015)** — der Beleg, dass die Merkmale simulierbar sind, samt ehrlicher Abweichung.
- **ASTM C1322 / C1678** — das Bewertungsschema.
- **NIST, Quinn: *Fractography of Ceramics and Glasses*** (SP 960-17, erweitert 2016) — das frei verfügbare Lehrbuch des Felds; Bildquelle für die echten Vergleichsstücke, falls Lizenzen es erlauben.
- **`02-recherche/spielideen-runde6-kandidaten.md`** — Herkunft (Bisoziation Fraktografie × Change Ringing, Run 6): Glockenläuter haben sich vor dreißig Jahren Heim-Simulatoren gebaut, weil der Turm nicht immer offen ist. Die Fraktografie hat das nie getan.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

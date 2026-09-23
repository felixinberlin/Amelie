# Spielideen — Bisoziations-Lauf 6 (20.09.2026)

**Status: Kandidaten, nicht Dosen.** Keine dieser sechs Ideen hat die Amélie-Existenzprüfung durchlaufen. Nichts hier ist `frei`.
Methode, Frame Pairs, Mode-Liste und Retro: `06-suche/amelie-bisoziation-log.md`, Run 6.

---

## Der Fund hinter den Ideen

Materialphysik wird in Spielen ausnahmslos **vorwärts** benutzt: Ich drücke, es bricht, es sieht großartig aus. Rückwärts benutzt ist dieselbe Simulation etwas anderes — ein **Rätselgenerator mit exakt bekannter Lösung**. Der Bruch ist dann nicht das Erlebnis, sondern die Aufgabe.

Das ist deshalb interessant, weil mehrere Fachgemeinschaften genau dieses Rückwärtslesen von Hand lernen müssen und dafür bis heute an einer Handvoll physischer Belegstücke üben, deren Entstehung selbst nur behauptet ist. Die Lücke ist nicht die Physik. Die Lücke ist die **Urheberschaft der Musterlösung**.

---

## 1 · Ground Truth (Arbeitstitel: Bruchlesen) — Paar: Fraktografie × Change Ringing

**Die Lücke:** Wer lernen muss, eine Bruchfläche zu lesen, übt an einer Handvoll physischer Belegstücke, deren Entstehung selbst nur behauptet ist — niemand kann ein Bruchstück mit exakt bekannter Ursache in beliebiger Zahl herstellen, obwohl das die Voraussetzung jeder Übung mit Rückmeldung wäre.

**Ein Satz:** Jede Runde ist ein simulierter Bruch mit bekannter Vorgeschichte; du drehst das Streiflicht, suchst den Ursprung, misst den Spiegelradius und nennst die Last — und erfährst danach, was wirklich passiert ist.

**Boden:** exploratory. Der Möglichkeitsraum „beliebig viele Belegstücke mit bekannter Ursache" war durch physische Knappheit geschlossen, nicht durch Unwissen.

**Warum jetzt:**
1. Thin-Shell-Fraktur und Peridynamik laufen in Echtzeit; die Kraftgeschichte ist im Solver ohnehin vorhanden und muss nur mitprotokolliert werden.
2. Die Bruchfläche lässt sich physikalisch plausibel rendern — Spiegel, Mist, Hackle, Wallner-Linien sind geometrische Folgen von Rissfront und -geschwindigkeit, keine Texturen.
3. Die Norm liefert das Bewertungsschema frei Haus (ASTM C1322 für die Merkmale, C1678 für Spiegelradius → Bruchspannung). Ein Punkteschema ohne Software — der klassische Amélie-Typ A.

**Skizze:** Streiflicht als Hauptwerkzeug (Winkel und Azimut frei), nicht Zoom. Drei Antworten pro Fläche: Ursprungspunkt, Spiegelradius, Lastart. Auflösung zeigt die Simulation rückwärts ab — der Riss läuft vor deinen Augen los, wo du hingezeigt hast oder eben nicht. Schwierigkeit steigt über Mischfälle, die die Norm selbst als schwierig benennt.
**Nicht dabei:** keine Zertifizierung, kein Labor-Workflow, kein Gutachten-Export.

**Empfänger:** Restaurierungs- und Konservierungsausbildung (Glas/Keramik); forensische Werkstofflabore; NIJ-Umfeld „Forensic Fractography of Bone"; Glasschaden-Gutachter.

**Erster Schritt:** Ein Solver-Lauf, eine Fläche, ein bekannter Ursprung, ein Regler fürs Streiflicht. Fertig, wenn jemand, der Fraktografie kann, den Ursprung auf dem gerenderten Bild findet — und jemand, der es nicht kann, daneben liegt.

**Wo es kippt:** Wenn die gerenderte Fläche nicht echt genug ist, trainiert das Spiel das Lesen der *Simulation* statt des *Materials*. Das ist kein Randfall, das ist der wahrscheinlichste Ausgang. Gegenmaßnahme ins Design: Jede Stufe enthält ein Foto eines echten Belegstücks mit bekannter Ursache, blind zwischen die simulierten gemischt. Wer nur die Simulation gelernt hat, fällt dort durch.

---

## 2 · Einer bricht, einer liest — Paar: Fraktografie × Change Ringing

**Die Lücke:** Beim Bruch gibt es genau eine Wahrheit und sie ist billig herstellbar — trotzdem gibt es keine Spielform, in der ein Mensch einem anderen eine physikalische Frage stellt, deren Antwort keiner von beiden aushandeln muss.

**Ein Satz:** Spieler A stellt das Rezept ein (Fehlstelle, Aufprallpunkt, Temperatur, Vorspannung) und sieht das Ergebnis nie; Spieler B bekommt nur die Fläche und rekonstruiert das Rezept.

**Boden:** combinational — aber mit einer ungewöhnlichen Eigenschaft: Der Schiedsrichter ist die Physik, nicht der Server. Punkte = Anteil des zurückgewonnenen Rezepts.

**Warum jetzt:** Dasselbe wie oben, plus: Das Rezept ist ein kurzer String, die Fläche ein deterministisches Ergebnis davon. Asynchron spielbar, kein Netzcode für Physik nötig — man verschickt Seeds, nicht Zustände.

**Empfänger:** dieselbe Fachszene wie 1, aber als *Übungsabend* statt als Kurs; dazu die Puzzle-Szene um asymmetrische Rätselspiele.

**Erster Schritt:** Rezept-String → Fläche → Rezept-String. Fertig, wenn zwei Leute per Messenger eine Runde spielen können, ohne dass das Spiel dazwischen etwas speichert.

**Wo es kippt:** Wenn sich herausstellt, dass wenige Rezeptparameter die Fläche dominieren, ist das Spiel nach zwanzig Runden gelöst. Vorher messen, nicht hinterher.

---

## 3 · Wer hat das gebrochen? (Geofakt-Duell) — Paar: Fraktografie × Change Ringing

**Die Lücke:** Ob ein Steinabschlag von einem Menschen oder von Frost, Trittschaden oder Steinschlag stammt, wird seit Jahrzehnten an denselben Merkmalen gestritten — und der Streit lässt sich nicht entscheiden, weil kaum jemand Vergleichsstücke besitzt, bei denen die Entstehung zweifelsfrei feststeht.

**Ein Satz:** Das Spiel erzeugt Abschläge mit bekannter Ursache und lässt dich sortieren; nebenbei entsteht eine große Stichprobe menschlicher Leseleistung gegen genau die Kriterien, über die die Fachliteratur streitet.

**Boden:** exploratory, mit einem Fuß im Forschungsinstrument. Das ist Stärke und Risiko zugleich.

**Warum jetzt:** Die Lithik führt den Streit aktiv (Archaeometry 2023: „In search of a better method to distinguish artefacts from geofacts"; Eren 2025). Bruchmechanik spröder Materialien ist simulierbar, und für Hertz'sche Kegel und Schlagbulben existieren Modelle. Der teure Teil war nie die Rechnung, sondern das Belegstück mit bekannter Herkunft.

**Empfänger:** Experimentalarchäologie und Lithik-Arbeitsgruppen; Sammlerforen, in denen die Frage „Artefakt oder Geofakt?" täglich gestellt und nie entschieden wird; Museumspädagogik.

**Erster Schritt:** Zwei Klassen genügen — Menschenschlag und Frost. Zwanzig Stück je Klasse, blind vorgelegt. Fertig, wenn Fachleute deutlich besser sortieren als Laien. Wenn nicht: Entweder die Simulation ist zu grob, oder das Merkmal trägt weniger als die Literatur behauptet — beides ist ein Ergebnis.

**Wo es kippt:** Wenn die Simulation die umstrittenen Merkmale selbst *erzeugt*, statt sie zu prüfen, ist der Schluss zirkulär. Die Idee taugt als Spiel in jedem Fall, als Forschungsinstrument nur mit Validierung an echten, dokumentierten Stücken.

---

## 4 · Stammgast — Paar: AI-NPC-Bilanz 2026 × Stammtisch

**Die Lücke:** Ein KI-NPC kostet Geld pro Spielersatz, muss hilfsbereit sein und bleibt trotzdem derselbe — während die Umgangsform, die Menschen tatsächlich über Jahre trägt, umgekehrt funktioniert: man sagt selten etwas, niemand hilft, und die Information liegt darin, wer heute fehlt.

**Ein Satz:** Du tippst nie. Die Runde redet weiter, ob du da bist oder nicht; deine einzigen Eingaben sind, wo du sitzt, wem du eine Runde ausgibst, wann du gehst und was du liegen lässt.

**Boden:** exploratory, nahe an transformational für dieses Genre — die Annahme, die fällt, ist „ein KI-NPC ist ein Gesprächspartner des Spielers".

**Warum jetzt:** Frisson Labs benennt 2026 vier Gründe, warum LLM-NPCs nicht ausliefern, und der Stammtisch kippt jeden einzelnen:
| Benannte Grenze | Was der Stammtisch daraus macht |
|---|---|
| „the more the player chats → the more the dev has to pay" | Der Spieler chattet nicht. Die Dialoge laufen zwischen Agenten, planbar getaktet, lokal und klein. |
| „helpfulness is not the same thing as personhood" | Niemand ist hilfsbereit. Die Figuren wollen nichts von dir. |
| Figuren „do not become different as a result of what happened" | Veränderung ist der ganze Inhalt — über Wochen echter Zeit, nicht über Quests. |
| Das Modell „does not genuinely find things surprising" | Das Erstaunen wird umgelagert: nicht die Figur staunt, du staunst darüber, was aus ihr geworden ist. |
Dazu Ubisofts eigene Grenze für NEO NPC — „these characters do not have free will … they have a narrative arc" — die hier verschwindet: Freiheit über alles, was nicht die Handlung ist, und die Handlung ist das, was du daraus liest.

**Skizze:** Ein Ort, acht bis zwölf Stammgäste, ein Abend pro echtem Tag. Der Abend läuft auch ohne dich; kommst du nicht, erfährst du beim nächsten Mal nur, was übrig blieb. Dein Werkzeug ist Anwesenheit: Sitzplatz, Runde ausgeben, Zuhören, Gehen. **Baustein: Abwesenheit als Signal** — wer heute fehlt, trägt mehr Information als alles Gesagte.
**Nicht dabei:** kein Chatfenster, keine Dialogoptionen, keine Quests, keine Zusammenfassung „das ist bisher passiert".

**Empfänger:** Indie-Studios im Umfeld langsamer Simulationen; die AI-NPC-Szene selbst als Gegenentwurf; Forschung zu Agenten-Gesellschaften, die eine Evaluationsform jenseits von „hat der Spieler gern geredet?" sucht.

**Erster Schritt:** Drei Agenten, ein Abend, kein Spieler. Fertig, wenn ein Außenstehender aus dem Protokoll von zehn Abenden sagen kann, wer sich zerstritten hat — ohne dass es jemand ausspricht.

**Wo es kippt:** Ohne Chatfenster kann sich das Ganze wie ein Bildschirmschoner anfühlen. Der Test dafür ist billig und gehört an den Anfang, nicht ans Ende: Wenn zehn Protokollabende keinen lesbaren Konflikt ergeben, hilft keine Grafik. Zweites Risiko: Kleine lokale Modelle driften ins Beliebige; der Stammtisch braucht Wiederholung mit Abweichung, nicht Zufall.

---

## 5 · Winterprotokoll — Paar: Schneeprofil/ECT × Gedächtnispalast

**Die Lücke:** Die Profilwand ist das Tagebuch des ganzen Winters, wird aber nur auf eine Ja/Nein-Frage hin gelesen — und dass zwei Gruben nebeneinander sich in jedem fünften Fall widersprechen, erfährt eine Kursteilnehmerin nie am eigenen Fehlgriff, sondern höchstens als Fußnote.

**Ein Satz:** Du spielst nicht den Skifahrer, sondern den Winter — Wind, Regenkruste, klare Kaltnächte — und das Ergebnis deiner Saison ist eine Schneedecke, die danach jemand lesen muss.

**Boden:** combinational. Schneedeckenmodelle sind Standard (SNOWPACK/SLF), die Umkehrung der Spielerrolle ist es nicht.

**Warum jetzt:** Die NHESS-Arbeit von 2020 liefert die Zahl, die das Spiel überhaupt erst trägt: „in 21 % of the cases the ECT fracture propagation result differed between two tests in the same snow pit", dazu die Feststellung, dass Fehlalarme die korrekten Warnungen überwiegen. Damit ist die Unsicherheit nicht Stimmung, sondern Regel: Dieselbe Grube zweimal gegraben gibt manchmal zwei Antworten — und genau das muss das Spiel einbauen, nicht wegglätten.

**Skizze:** Zwei Rollen. Der Winter legt Schichten (verdeckt). Die Lesende darf drei Gruben graben und muss die Saison rekonstruieren — nicht „stabil/instabil", sondern *was passiert ist*: wann es geregnet hat, wann es klar und kalt war, wann der Wind von Nordwest kam. Die 21 % sind fest verdrahtet.
**Nicht dabei:** keine Lawinenvorhersage, keine Empfehlung, keine Touren-App.

**Empfänger:** Lawinenausbildung (SLF/White Risk, Ortovox Safety Academy, DAV, Bergschulen); Schneedeckenmodell-Community um SNOWPACK; Schulen im Alpenraum.

**Erster Schritt:** Fünf Wetterereignisse, eine Schichtfolge, drei Gruben. Fertig, wenn ein Ausbilder sagt: „Das ist die Erfahrung, die ich im Kurs nicht herstellen kann."

**Wo es kippt:** Lawinenbildung ist ein Thema, bei dem ein Spiel Sicherheit suggerieren kann, die es nicht gibt. Deshalb sind Vorhersage und Empfehlung bewusst draußen: Das Spiel lehrt genau eine Sache — eine Grube ist eine Stichprobe, kein Urteil.

---

## 6 · Skip — Paar: Live-Funkausbreitung × Vogel-Warnrufe (schwächster Kandidat)

**Die Lücke:** Die Ausbreitungsbedingungen über einem konkreten Ort ändern sich stündlich, sind öffentlich und kostenlos abrufbar — aber außerhalb des Funkbetriebs gibt es nichts, für das sie eine **Regel** wären statt einer Anzeige.

**Ein Satz:** Die Karte ist der Himmel von heute: Wen du erreichst, entscheidet die echte Ausbreitung zwischen echten Locator-Feldern — Senden verrät deine Position, Lauschen ist gratis und allein nutzlos.

**Boden:** combinational.

**Warum jetzt:** WSPRnet, PSK Reporter und das Reverse Beacon Network liefern laufend öffentliche Spot-Daten; SDR-Sticks kosten nichts mehr.

**Ehrliche Einordnung:** Der schwächste der sechs. HamSphere simuliert Funkbetrieb seit Jahren kommerziell, es gibt seit 03/2026 ein Brettspiel *Propagation*, und HamSCI hat „Geocaching in the Ionosphere" schon 2021 versucht. Die Restlücke ist vermutlich nur: **echte Live-Daten statt Simulation, und für Leute ohne Lizenz.** Das ist eine Verengung, kein freies Feld — und sie steht hier nur, weil sie billig zu prüfen ist.

**Erster Schritt:** Eine Stunde Live-Spots holen und daraus eine Erreichbarkeitskarte zwischen zwei Locator-Feldern zeichnen. Fertig, wenn die Karte sich über den Tag sichtbar verändert, ohne dass jemand etwas eingibt.

---

## Was als Nächstes ansteht

1. **Amélie-Existenzprüfung** für 1, 4 und 5 — je drei bis vier Suchen, englisch zuerst (Vorzieh-Regel, Playbook 1). Erst danach fällt das Wort `frei`.
2. Kandidaten 2 und 3 hängen an 1: Stirbt 1, sterben sie mit.
3. Kandidat 6 zuerst prüfen oder verwerfen — er kostet eine Suche und blockiert sonst die Liste.

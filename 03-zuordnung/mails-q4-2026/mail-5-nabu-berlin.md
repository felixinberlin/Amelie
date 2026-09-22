# Mail 5 — Glasanflug-Ampel → NABU Berlin, „Artenschutz am Gebäude"

**Status: ENTWURF, nicht gesendet.**
**An:** artenschutz_am_gebaeude@nabu-berlin.de (Julia Lorenz, Helen Friedlein)
**Betreff:** Idee zu verschenken: aus einer Vogelschlag-Meldung eine LAG-VSW-Einstufung machen
**Dose:** `05-dosen/glasanflug-ampel.md` · **Code:** `04-werkzeug/glasanflug-ampel/`
**Vor dem Senden:** den Melder einmal selbst benutzen und die Formularfelder gegen die Dose prüfen; Dose altern lassen (eine englische Suche).

---

Hallo Frau Lorenz, hallo Frau Friedlein,

ich recherchiere Software, die es ohne die letzten Jahre KI-Fortschritt nicht geben könnte, und baue nur wenige davon selbst. Diese hier gehört zu Ihrem Projekt und nicht zu mir, also schenke ich sie Ihnen. CC0, ohne Bedingungen.

Ihr Vogelschlagmelder sammelt pro Meldung bis zu fünf Fotos, die Ausrichtung der betroffenen Fassade, die Größe der Anprallspur und eine Adresse. Die Gefahrenkarte zeigt daraus, wo schon etwas passiert ist. Was fehlt, ist der Schritt davor: was diese Fassade unter dem Bewertungsschema der Vogelschutzwarten für eine Einstufung bekäme — und das ist genau der Satz, den Sie brauchen, wenn Sie danach einen Eigentümer oder eine Behörde anschreiben.

Seit dem 10. Juni 2026 ist das in Berlin keine Fleißaufgabe mehr: Die Senatsverwaltung hat die Beurteilungshilfe als einheitlichen Standard für Bau- und Planungsverfahren eingeführt, und die verweist für die Einstufung auf genau dieses Schema. Das Schema selbst ist ein PDF.

Die Idee: eine Bewertungsschicht auf den Melder. Aus den Fotos werden die Situationsfaktoren geschätzt — Glasanteil ohne Markierung, Größe zusammenhängender Scheiben, verglaste Ecken und Durchsichten —, aus OpenStreetMap und dem Baumkataster kommt das Umfeld dazu. Heraus kommt kein Urteil, sondern ein ausgefülltes Blatt: jeder Faktor mit seiner Herkunft und seiner Unsicherheit, von Hand überschreibbar, und was das Bild nicht hergibt, steht als „unbestimmt" drin statt als Zahl.

Warum das jetzt geht, ist der Teil, für den sich das Lesen lohnt: Die Messung, an der alles hängt — wie viel einer Fassade ist Glas —, ist in einer anderen Branche längst gelöst. Die Gebäudeenergie-Forschung zieht Fenster-Wand-Verhältnisse aus Straßenbildern; eine Arbeit von 2025 liegt bei 94 Prozent der Fassaden innerhalb von fünf Prozentpunkten gegenüber der Handmessung und veröffentlicht den Workflow. Auf Vogelschlag hat das noch niemand gerichtet.

Damit Sie meine Hausaufgaben sehen: In Kanada gibt es mit FLAPs BirdSafe-App eine kostenlose Risikoeinschätzung pro Fassade, und LEED führt seit April 2026 Vogelschlag in zwei Credits mit eigenem Punkterechner. Beide fragen den Menschen nach den Eingangswerten. Gemessen wird nirgends — und das deutsche Schema, das als einziges am Vollzug nach Paragraf 44 BNatSchG hängt statt an einem Zertifikat, ist bis heute nicht programmiert.

Den ersten Schritt lege ich bei, weil Ihr Melder unter GPLv3 von einem einzelnen Menschen gepflegt wird und ich nichts über den Zaun werfen möchte: das Bewertungsschema aus Beschluss 21/01 (Stand 2023) als Regeldatei, eine Funktion, die daraus Punktsumme, Risikostufe und Begründung rechnet, und eine Testsuite mit allen elf Beispielen aus dem Anhang des Beschlusses. Keine Bilderkennung, keine Abhängigkeiten außer YAML, CC0 und damit in einem GPL-Projekt verwendbar.

Eine Seite mit Skizze, dem nächsten Ticket und der Stelle, an der es kippt: <Link>

Drei Dinge stehen ehrlich darin, weil sie mir wichtig sind. Eine Zahl, die sicherer klingt als die Datenlage, wird in beide Richtungen missbraucht — deshalb Blatt statt Urteil. Eine Karte, die Meldungen zeigt, ist etwas anderes als eine Karte, die Gebäude bewertet; das Zweite gehört ins Anschreiben an den Eigentümer und nicht ins Netz. Und das Schema gehört der LAG VSW: Wenn so etwas gebaut wird, sollte es deren Fassung wortgetreu abbilden und von dort korrigierbar sein.

Eine Antwort ist nicht nötig, ich fasse nicht nach. Falls Sie so etwas längst planen, ignorieren Sie die Mail bitte einfach.

Viele Grüße
Félix

# Mail 5 — Glasanflug-Ampel → NABU Berlin („Artenschutz am Gebäude") + NABU Jena

**Status: ENTWURF, nicht gesendet.** Félix entscheidet, ob und wann.
**An:** artenschutz_am_gebaeude@nabu-berlin.de (Julia Lorenz, Helen Friedlein) — auf der NABU-Berlin-Seite zum Vogelschlagmelder als Projektkontakt genannt.
**In Kopie / zweite Mail:** NABU Jena, Maximilian Schätz (Upstream des Vogelschlagmelders) — **aber erst, wenn Code dabei ist.** Regel 4: kein Zuruf an einen unbezahlten Einzelmaintainer ohne PR.
**Betreff:** Idee zu verschenken: aus einer Vogelschlag-Meldung eine LAG-VSW-Einstufung machen
**Dose:** `05-dosen/glasanflug-ampel.md`

**Vor dem Senden — vier Dinge, ohne die die Mail nicht raus darf:**
1. ~~Punktwerte nachtragen~~ — **erledigt 22.09.2026.** Der Beschluss (21/01, **aktualisiert 2023**) ist eingearbeitet, das Schema liegt als Regeldatei mit Tests unter `04-werkzeug/glasanflug-ampel/`. Die Mail kann das Skelett also mitschicken statt es anzukündigen.
2. **Den Melder selbst einmal benutzen.** Eine Meldung durchspielen und die tatsächlichen Formularfelder mit dem abgleichen, was in der Dose steht. Nichts blamiert schneller als eine Mail, die das Produkt des Empfängers falsch beschreibt.
3. **Dose altert:** eine englische Produktsuche unmittelbar vor dem Versand (FLAP, LEED, ABC).
4. **Dose-Link prüfen** (Datei muss auf `main` liegen).

**Nicht erwähnen:** Prototype Fund — der NABU ist ein Verein und nicht antragsberechtigt (geprüft 20.09.2026).

**Tonlage:** Die Empfängerinnen kennen Vogelschlag besser als ich. Neu ist für sie nicht das Problem, sondern zwei Befunde von außen: dass die Messung des Glasanteils in der Gebäudeenergie-Branche gelöst ist, und dass ihre eigenen Meldedaten bereits die Eingabe dafür sind.

---

Hallo Frau Lorenz, hallo Frau Friedlein,

ich recherchiere Software, die es ohne die letzten Jahre KI-Fortschritt nicht geben könnte, und baue nur wenige davon selbst. Diese hier gehört zu Ihrem Projekt und nicht zu mir, also schenke ich sie Ihnen. CC0, ohne Bedingungen.

Ihr Vogelschlagmelder sammelt pro Meldung bis zu fünf Fotos, die Ausrichtung der betroffenen Fassade, die Größe der Anprallspur und eine Adresse. Die Gefahrenkarte zeigt daraus, **wo schon etwas passiert ist**. Was fehlt, ist der Schritt davor: **was diese Fassade unter dem Bewertungsschema der Vogelschutzwarten (LAG VSW 21/01) eigentlich für eine Einstufung bekäme** — und das ist genau der Satz, den Sie brauchen, wenn Sie danach einen Eigentümer oder eine Behörde anschreiben.

Seit dem 10. Juni 2026 ist das in Berlin keine Fleißaufgabe mehr: Die Senatsverwaltung hat die Beurteilungshilfe als einheitlichen Standard für Bau- und Planungsverfahren eingeführt, und die verweist für die Einstufung auf genau dieses Schema. Das Schema selbst ist ein PDF.

Die Idee: eine Bewertungsschicht auf den Melder. Aus den Fotos werden die Situationsfaktoren geschätzt — Glasanteil, Größe zusammenhängender Scheiben, verglaste Ecken und Durchsichten, und vor allem, **was sich in der Scheibe spiegelt** —, aus OpenStreetMap und dem Baumkataster kommt das Umfeld dazu. Heraus kommt kein Urteil, sondern ein ausgefülltes Blatt: jeder Faktor mit seiner Herkunft und seiner Unsicherheit, von Hand überschreibbar, und was das Bild nicht hergibt, steht als „unbestimmt" drin statt als Zahl.

Warum das ausgerechnet jetzt geht, ist der Teil, für den sich das Lesen lohnt: Die Messung, an der alles hängt — wie viel einer Fassade ist Glas —, ist in einer ganz anderen Branche längst gelöst. Die Gebäudeenergie-Forschung zieht Fenster-Wand-Verhältnisse aus Straßenbildern; eine Arbeit von 2025 liegt bei 94 % der Fassaden innerhalb von fünf Prozentpunkten gegenüber der Handmessung und veröffentlicht den Workflow. Auf Vogelschlag hat das noch niemand gerichtet.

Damit Sie meine Hausaufgaben sehen: In Kanada gibt es mit FLAPs BirdSafe-App eine kostenlose Risikoeinschätzung pro Fassade, und LEED hat seit April 2026 Vogelschlag in zwei Credits mit einem eigenen Punkterechner. Beide **fragen den Menschen** nach den Eingangswerten. Gemessen wird nirgends — und das deutsche Schema, das als einziges am Vollzug nach § 44 BNatSchG hängt statt an einem Zertifikat, ist bis heute nicht programmiert.

Eine Seite mit Skizze, erstem Ticket und der Stelle, an der es kippt: <Link>

Drei Dinge stehen ehrlich darin, weil sie mir wichtig sind. Erstens: Eine Zahl, die sicherer klingt als die Datenlage, wird in beide Richtungen missbraucht — deshalb Blatt statt Urteil. Zweitens: Eine Karte, die Meldungen zeigt, ist etwas anderes als eine Karte, die Gebäude **bewertet**; das Zweite gehört ins Anschreiben an den Eigentümer und nicht ins Netz. Drittens: Das Schema gehört der LAG VSW. Wenn so etwas gebaut wird, sollte es deren Fassung wortgetreu abbilden und von dort korrigierbar sein.

Und weil Ihr Melder unter GPLv3 auf Codeberg liegt und von einem einzelnen Menschen gepflegt wird, werfe ich das nicht über den Zaun, sondern lege den ersten Schritt bei: das Bewertungsschema aus Beschluss 21/01 (Stand 2023) als Regeldatei, eine Funktion, die daraus Punktsumme, Risikostufe und Begründung rechnet, und eine Testsuite — darunter neun der elf Beispiele aus dem Anhang des Beschlusses. Keine Bilderkennung, keine Abhängigkeiten außer YAML, CC0 und damit in einem GPL-Projekt verwendbar.

Zwei Sachen sind mir beim Nachrechnen aufgefallen, die Sie interessieren dürften. Der Anhang des Beschlusses rechnet elf Gebäude durch; bei einem (Berlin, Forschungszentrum) stehen 3 und 3 und darunter „Summe 7". Folgenlos für die Risikostufe, aber ein hübsches Argument dafür, das Addieren der Software zu überlassen. Und: Wenn Glasanteil 4 und Fassadengestaltung 1 zusammentreffen, fordern beide Vorrangregeln das Gegenteil voneinander — der Beschluss regelt das nicht. Mein Rechner entscheidet das deshalb nicht selbst, sondern meldet es.

Eine Antwort ist nicht nötig, ich fasse nicht nach. Falls Sie so etwas längst planen, ignorieren Sie die Mail bitte einfach.

Viele Grüße
Félix
<Link auf das Repo>

---

## Variante für den LBV (zweiter Empfänger, eigener Kontext)

Gleiche Idee, anderer Aufhänger: Der LBV vergibt die Plakette „Vogelfreundliche Glasfläche" über ein Online-Formular mit Foto **plus Besichtigung durch geschultes Personal**, betreibt eine Vogelschlagberatung für Kommunen und Behörden und hat 2020 in München neun Gebäudekomplexe über 1.957 m Fassade von Hand abgelaufen. Der Deckel ist dort dasselbe: Das Projekt reicht so weit, wie Personal fahren kann. Adresse: `vogelschlag@lbv.de`, Dr. Peter Stimmler. **Nicht am selben Tag senden wie die NABU-Mail** — und in der LBV-Fassung die Münchner Studie als *ihre* Arbeit würdigen, nicht als Fundstück.

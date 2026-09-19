# Muster-E-Mails nach der Amélie-Philosophie

> **Der Leitgedanke:**
> Ein Geschenk bürdet dem Empfänger niemals eine Bringschuld auf. Keine Terminanfrage („Lass mal zoomen / Kaffee trinken"), keine Bitte um Feedback, kein Nachfassen („Hatten Sie Gelegenheit...?").
> Jede E-Mail enthält die ausdrückliche Erlaubnis, **nicht** zu antworten.

*Stand nach Runde Altbau Thermal (19.9.2026): Anrede-, Konkurrenz- und Förderhinweis-Regeln ergänzt, Muster 5 und Bausteinkasten neu. Alles Neue stammt aus Fehlern, die bei der Prüfung von Mail 1 gefunden wurden.*

---

## Die 6 Bausteine einer Amélie-E-Mail

1. **Geschenk-Betreff:** Direkt deklariert als „Idee zu verschenken: [Name]".
2. **Die 1:20-Entlastung:** Erklärt sofort, wer schreibt und warum man die Idee verschenkt.
3. **Beweis der Recherche:** Zitiert ein konkretes Tool, Paper oder Feature des Empfängers. **Nur, was auf der Seite des Empfängers oder in einer Primärquelle steht.**
4. **Die Dose verlinkt:** 1 Seite mit Architektur, Ticket #1 und der Bruchstelle („Wo es kippt").
5. **Bedingungslose CC0-Freigabe:** Nimm sie, bau sie, verkauf sie — du schuldest mir nichts.
6. **Das Klingelverbot:** Ausdrückliche Erlaubnis, nicht zu antworten; Versprechen, nie nachzufassen.

---

## Vier Regeln, die vor jedem Muster gelten

1. **Anrede: nie aus dem Vornamen raten.** Weder Geschlecht noch „Herr/Frau". Nur wenn die Seite der Person die Anrede selbst nennt, wird sie übernommen. Sonst neutral: „Guten Tag [Titel] [Nachname]," bzw. „Hallo [Team]," bei Gruppen. Die Muster unten sind entsprechend umgestellt.
2. **Nie „unbeantwortet", „fehlt", „gibt es nicht" behaupten**, solange die Dose keinen belegten Abschnitt „Wer es schon versucht hat" hat. Bis dahin: „nicht abgedeckt **dort**" (bezogen auf das, was der Empfänger tatsächlich anbietet). Wenn die Dose Nachbarwerkzeuge nennt, gehören sie in die Mail nur, wenn sie für den Empfänger relevant sind, aber die Mail darf ihnen nicht widersprechen.
3. **Förderhinweise nur mit Primärquelle.** Beispiel Prototype Fund: fördert Open-Source-Vorhaben von Einzelpersonen und kleinen Teams, **keine** Hochschulinstitute, Lehrstühle oder Abschlussarbeiten. Frist und Beträge nur aus prototypefund.de selbst, nicht aus Zweitquellen; vor dem Senden auf der Fondsseite gegenlesen. **Auch die thematische Passung prüfen:** Laut Refine der Altbau-Dose (19.9.2026, von mir nicht am Original gegengelesen) setzt der Fonds seit 2025 nur Schwerpunkte Datensicherheit und Software-Infrastruktur. Passt die Idee nicht in den Schwerpunkt, steht kein Förderhinweis in der Mail.
4. **Empfängeradressen stehen nie in Dose oder Matrix und werden nie geraten.** Sie werden am Tag des Sendens von der Organisationsseite kopiert; steht sie nicht dort, bleibt sie in der Mail-Datei als „offen" markiert.

---

## Muster 1: An Forschung & Hochschulinstitute

**Zielgruppe:** Lehrstühle, Verbundforschung, Masterarbeiten (z.B. UdK, TU Berlin, Fraunhofer)

```text
Betreff: Idee zu verschenken: [Name der Idee] – [Forschungslücke / Methodik]

Guten Tag [Titel] [Nachname],

ich recherchiere Softwarewerkzeuge, die erst seit kurzer Zeit technisch möglich sind, und baue nur einen Bruchteil davon selbst. Diese Idee passt thematisch exakt zu Ihrer Forschungsgruppe und nicht zu mir, deshalb schenke ich sie Ihnen.

[Konkreter Anker: 1–2 Sätze über deren letzte Publikation oder Tool, z. B.: „Ihr Fachgebiet hat mit dem Tool X gezeigt, wie Y gelöst wird..."].
Nicht abgedeckt ist dort die angrenzende Frage: [Das konkrete Problem]. [Name der Idee] setzt genau dort an: [1 prägnanter Satz zur Lösung / Datennutzung].

[Optional, empfohlen: Eigene-Arbeit-Satz aus dem Bausteinkasten.]

Ein kompakter Einseiter mit Skizze, erstem Arbeitsschritt und der Bruchstelle, an der das Vorhaben scheitern kann:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md

[Optional: Förderhinweis-Satz aus dem Bausteinkasten. Kein „studentische Arbeit" in Verbindung mit dem Prototype Fund.]

Keine Bedingungen, CC0 / gemeinfrei, keinerlei Gegenleistung erwartet. Wenn Sie an ähnlichen Ansätzen bereits arbeiten oder kein Interesse haben, ignorieren Sie diese Nachricht bitte einfach – ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix
Berlin · https://github.com/felixinberlin/Amelie
```

---

## Muster 2: An Stadt-Labs & Stiftungen mit Bauauftrag

**Zielgruppe:** CityLAB Berlin, Technologiestiftung, Open Knowledge Foundation, Kiezlabore

```text
Betreff: Idee zu verschenken: [Name der Idee] für Berlin

Hallo [Team-Name],

ich recherchiere digitale Werkzeuge, die durch neuere Modelle und Schnittstellen plötzlich mit minimalem Aufwand machbar sind. Ich baue nur wenige davon selbst; diese hier ist so lokal zugeschnitten, dass sie zu Ihrer Arbeit gehört und nicht zu mir.

[Name der Idee]: [1–2 Sätze zum konkreten Problem der Stadt/Bürger, z. B. Sperrmüll, Lärm, Bürgerbeteiligung].
Das Konzept löst dies ohne schwerfällige Infrastruktur: [Der Kniff: z. B. dezentrale Aggregation, 12h-Verfall, lokales Handy-Mikrofon].

Eine Seite mit Ablauf, erstem Ticket und der Schwachstelle des Konzepts liegt hier:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md

Das Ganze steht unter CC0 (Public Domain), ohne jede Bedingung. Wenn es als Impuls für das Kiezlabor, einen Hackathon oder ein Bürger-Tool nützlich ist, freut es mich; falls nicht, ist nichts verloren. Eine Rückmeldung ist nicht erforderlich, ich fasse nicht nach.

Viele Grüße
Félix
Berlin · https://github.com/felixinberlin/Amelie
```

---

## Muster 3: An Firmen mit passendem Produkt (Feature-Geschenk)

**Zielgruppe:** DevTools & Software-Produkte (z.B. GitKraken, Tessl, Escape Motions)

```text
Subject: Free idea: [Feature-Name] for [Produktname]

Hi [Team],

I research developer tooling that only recently became feasible, and I only build about one in twenty myself. This idea directly complements what you've shipped with [spezifisches Feature/Produkt], so it's yours to take.

[Problem in einem Satz: z. B. „Agents currently guess why code changed because git history, issues, and PR context are scattered"].
[Lösung in einem Satz: z. B. „A unified blame-to-issue traversal exposed via MCP solves this without altering the developer's workflow"].

[Wenn die Dose Wettbewerber nennt: ein Satz, der sie ehrlich benennt, z. B. „[Tool X] covers [part]; the gap is [Y]". Nie „nobody does this" ohne belegte Prüfung.]

Here is a one-page breakdown with the architecture, the first implementation ticket, and the exact risk that could break it:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md

Released under CC0 (Public Domain) — take it, adapt it, or discard it. You owe me nothing, not even an answer. If this is already on your roadmap or doesn't fit your current focus, please just ignore this email. I won't follow up.

Best regards,
Félix
Berlin · https://github.com/felixinberlin/Amelie
```

---

## Muster 4: An Internationale Open-Source-Netze

**Zielgruppe:** Internationale Sensor- und Open-Source-Netzwerke (z.B. NoiseCapture, OSM)

```text
Subject: Free idea: [Short Concept Title] — [Key shift, e.g. quiet windows instead of averages]

Hello [Project Team],

I research open-source software concepts enabled by recent commodity tooling, and I give away the ones I won't be building myself. This one belongs in your domain.

[Context]: [Project Name] provides excellent [crowdsourced measurements / open telemetry]. However, citizens often face a different practical question: [the gap, e.g. "When is this courtyard actually quiet?"].
[The shift]: [How the idea re-frames existing data with local privacy-by-design].

One page outlining the architecture, the first implementation ticket, and where the assumption might break:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md

Everything is licensed under CC0 / Public Domain with zero obligations. If you are already working on this or it conflicts with current priorities, simply ignore this note.

Félix, Berlin
https://github.com/felixinberlin/Amelie
```

---

## Muster 5: An Communities, Vereine & Ökosysteme (neu)

**Zielgruppe:** Vereine und Ortsgruppen (z. B. SSDeV Berlin), Plugin-/Add-on-Ökosysteme (Obsidian, Anki, Claude-Code-Plugins), Web-Toy- und Maker-Szenen. Menschen mit Zeit und Interesse, aber ohne Auftrag und ohne Budget.

**Wichtig:** Die Community ist kein Firmenpostfach. Die Mail geht an die **öffentliche Kontaktstelle der Gruppe** (Forum, Mailingliste, Ortsgruppen-Wiki, Add-on-Verzeichnis), nicht an Einzelpersonen aus dem Vorstand. Für Einzelmaintainer bleibt die Regel: nur mit lauffähigem Code.

```text
Betreff: Idee zu verschenken: [Name der Idee] – [Nutzen für die Community in vier Wörtern]

Hallo [Gruppe / Ortsgruppe / Forum],

ich recherchiere Software, die erst seit Kurzem technisch möglich ist, und baue nur einen kleinen Teil davon selbst. Diese Idee gehört zu einer Szene mit Zeit und Interesse, nicht zu mir, deshalb lege ich sie euch hin.

[Anker: eine konkrete, öffentlich belegte Sache der Gruppe, z. B. eine Wiki-Seite, ein Workshop, ein Add-on-Verzeichnis.]
[Die Idee in einem Satz, aus Sicht der Leute in der Gruppe.]

Eine Seite mit Skizze, erstem Ticket und der Stelle, an der es schiefgeht:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md

Wenn jemand von euch Lust hat, es zu bauen: nehmt es, CC0, ohne Bedingungen. Wenn es schon jemand macht oder nicht passt: ignoriert die Mail einfach. Ich melde mich nicht nochmal und bitte um nichts.

Viele Grüße
Félix
Berlin · https://github.com/felixinberlin/Amelie
```

**Zusatz:** Ein persönlicher Besuch (Stammtisch, Meetup) ist Félix' Entscheidung und **nicht Teil der Mail**. Die Mail bittet um keinen Termin.

---

## Bausteinkasten: Sätze zum Einsetzen

Jeder Baustein steht nur in der Mail, wenn die Quelle daneben belegt ist. Die Quelle gehört in den Kopf der Mail-Datei (`**Vor dem Senden:**`), nicht in den Mailtext.

| Baustein | Text | Bedingung |
|---|---|---|
| **Eigene-Arbeit-Satz** | „Ihre eigene Arbeit in diesem Feld, etwa [A] und [B], kennen Sie besser als ich. Falls die Idee dort längst mitgedacht ist, umso besser." | A und B stehen auf der Seite der Gruppe. Pflicht, wenn die Gruppe erkennbar Angrenzendes baut. |
| **Förderhinweis** | „Falls jemand das bauen möchte, nicht zwingend Sie: Der Prototype Fund fördert Open-Source-Vorhaben von Einzelpersonen und kleinen Teams, die nächste Bewerbungsphase beginnt am [Datum]." | Datum aus prototypefund.de, gegengelesen, **und** Schwerpunkt des laufenden Aufrufs passt zur Idee (Regel 3). Nach dem Start „beginnt" durch „läuft" ersetzen. Für Altbau Thermal derzeit nicht verwenden. |
| **Paralleler-Versand-Satz** | „Parallel geht dieselbe Idee an [Gruppe X]. Ich sage das offen, damit Sie nicht zweimal davon überrascht werden." | Nur, wenn beide Empfänger dasselbe Projekt teilen oder sich kennen. Erst senden, wenn die andere Mail wirklich raus ist. |
| **Konkurrenz-Satz** | „[Werkzeug X] deckt [Teil] bereits ab; die Lücke ist [Y]." | X steht in der Dose unter „Wer es schon versucht hat". Wenn die Lücke nicht mehr klar benennbar ist: keine Mail, Dose überarbeiten. |
| **Bezugssatz (Forschung)** | „[Projekt] beantwortet seit [Datum] die Frage [A]. Nicht abgedeckt ist dort die Frage danach: [B]." | Datum und Projekt aus Primärquelle. |

---

## Die Mail-Datei: ein Format für alle Mails

Jede Mail liegt als eigene Datei in `03-zuordnung/mails-q4-2026/` (bzw. der jeweiligen Quartalsmappe), damit sie später ohne Nacharbeit in einen Gmail-Draft übernommen werden kann.

```markdown
# Mail <Nr> — <Idee> → <Empfänger>

**Status:** Entwurf als Datei / Gmail-Draft bereit / gesendet (nur Félix setzt das)
**An:** <Adresse, von der Organisationsseite kopiert, mit Quelle und Datum> ODER „Adresse offen"
**Betreff:** …
**Vor dem Senden:** <Liste: welche Bezüge nur aus Zweitquellen stammen, was gegenzulesen ist, was wegfällt, wenn es nicht stimmt>
**Geändert <Datum> (<Rolle>):** <wenn nach Prüfung geändert: was und warum>

---

<Mailtext ab der Anrede bis zur Signatur, direkt kopierbar>
```

**Nicht sendebereit** ist eine ehrliche Status-Zeile. Wenn Empfängerfit oder Bezug nicht belegt sind (Beispiel: Verbraucherzentrale bei Altbau Thermal), steht in der Datei, was zu klären ist, statt eines Mailtextes, der nach fertig aussieht.

---

## Checkliste vor jedem Draft

- [ ] Empfänger ist Firma, Forschung, Topf oder Community. **Kein** unbezahlter Einzelmaintainer, außer mit Code.
- [ ] Empfänger ist konkret (eine Gruppe, ein Team, ein Projekt), nicht „die Forschung" oder „die Szene".
- [ ] Der Bezug im Text steht auf der Seite des Empfängers. Was nur aus Suchschnipseln stammt, ist im Kopf der Datei markiert.
- [ ] Anrede nicht aus dem Vornamen abgeleitet.
- [ ] Kein „unbeantwortet / gibt es nicht", das nicht durch „Wer es schon versucht hat" gedeckt ist.
- [ ] Förderdaten aus der Primärquelle des Fonds.
- [ ] Dose, auf die der Link zeigt, ist auf dem Stand, auf den sich die Mail beruft (Datum, „Prüfen ab", keine offenen Prüfpunkte, die die Mail widerlegen würden).
- [ ] Erlaubnis, nicht zu antworten, und kein Termin, keine Bitte.

---

## Die 5 Anti-Muster (Was verboten ist)

1. **Kein Kaffeetrinken/Zoom verlangen:** Ein Geschenk bürdet niemals einen Kalendertermin auf.
2. **Keine ungefragte Arbeit für unbezahlte Maintainer:** Nur mit lauffähigem Code-Skelett an Einzelpersonen herantreten.
3. **Kein Nachfassen (Telefonzellen-Regel):** Wer fragt „Hatten Sie schon Gelegenheit...", verwandelt die Gabe in eine Bringschuld.
4. **Keine erfundenen oder geratenen Angaben:** keine Adressen, keine Anreden, keine Fördersummen, keine „X hat das gebaut"-Behauptungen ohne Beleg. Lieber „Adresse offen" als eine schöne falsche.
5. **Keine Standardmail an eine ganze Zielgruppe:** Jede Mail hat genau einen Empfänger und einen Bezug, den nur dieser Empfänger hat. Wer den Bezug nicht findet, hat den Empfänger noch nicht geprüft.

# Muster-E-Mails nach der Amélie-Philosophie

> **Der Leitgedanke:**
> Ein Geschenk bürdet dem Empfänger niemals eine Bringschuld auf. Keine Terminanfrage („Lass mal zoomen / Kaffee trinken"), keine Bitte um Feedback, kein Nachfassen („Hatten Sie Gelegenheit...?").
> Jede E-Mail enthält die ausdrückliche Erlaubnis, **nicht** zu antworten.

---

## Die 6 Bausteine einer Amélie-E-Mail

1. **Geschenk-Betreff:** Direkt deklariert als „Idee zu verschenken: [Name]".
2. **Die 1:20-Entlastung:** Erklärt sofort, wer schreibt und warum man die Idee verschenkt.
3. **Beweis der Recherche:** Zitiert ein konkretes Tool, Paper oder Feature des Empfängers.
4. **Die Dose verlinkt:** 1 Seite mit Architektur, Ticket #1 und der Bruchstelle („Wo es kippt").
5. **Bedingungslose CC0-Freigabe:** Nimm sie, bau sie, verkauf sie — du schuldest mir nichts.
6. **Das Klingelverbot:** Ausdrückliche Erlaubnis, nicht zu antworten; Versprechen, nie nachzufassen.

---

## Muster 1: An Forschung & Hochschulinstitute

**Zielgruppe:** Lehrstühle, Verbundforschung, Masterarbeiten (z.B. UdK, TU Berlin, Fraunhofer)

```text
Betreff: Idee zu verschenken: [Name der Idee] – [Forschungslücke / Methodik]

Sehr geehrte/r Frau/Herr Prof. Dr. [Nachname],

ich recherchiere Softwarewerkzeuge, die erst seit kurzer Zeit technisch möglich sind, und baue nur einen Bruchteil davon selbst. Diese Idee passt thematisch exakt zu Ihrer Forschungsgruppe und nicht zu mir, deshalb schenke ich sie Ihnen.

[Konkreter Anker: 1–2 Sätze über deren letzte Publikation oder Tool, z. B.: „Ihr Fachgebiet hat mit dem Tool X gezeigt, wie Y gelöst wird..."]. 
Unbeantwortet bleibt dabei oft die angrenzende Frage: [Das konkrete Problem]. [Name der Idee] setzt genau dort an: [1 prägnanter Satz zur Lösung / Datennutzung].

Ein kompakter Einseiter mit Skizze, erstem Arbeitsschritt und der Bruchstelle, an der das Vorhaben scheitern kann:
https://felixinberlin.github.io/Amelie/ (bzw. https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md)

Falls das Thema für eine Masterarbeit, ein studentisches Projekt oder einen Förderantrag taugt: Der Zuschnitt ist Open Source.

Keine Bedingungen, CC0 / gemeinfrei, keinerlei Gegenleistung erwartet. Wenn Sie an ähnlichen Ansätzen bereits arbeiten oder kein Interesse haben, ignorieren Sie diese Nachricht bitte einfach – ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix
Berlin · https://felixinberlin.github.io/Amelie/
```

---

## Muster 2: An Stadt-Labs & Stiftungen mit Bauauftrag

**Zielgruppe:** CityLAB Berlin, Technologiestiftung, Open Knowledge Foundation, Kiezlabore

```text
Betreff: Idee zu verschenken: [Name der Idee] für Berlin

Hallo [Team-Name / Ansprechpartner],

ich recherchiere digitale Werkzeuge, die durch neuere Modelle und Schnittstellen plötzlich mit minimalem Aufwand machbar sind. Ich baue nur wenige davon selbst; diese hier ist so lokal zugeschnitten, dass sie zu Ihrer Arbeit gehört und nicht zu mir.

[Name der Idee]: [1–2 Sätze zum konkreten Problem der Stadt/Bürger, z. B. Sperrmüll, Lärm, Bürgerbeteiligung]. 
Das Konzept löst dies ohne schwerfällige Infrastruktur: [Der Kniff: z. B. dezentrale Aggregation, 12h-Verfall, lokales Handy-Mikrofon].

Eine Seite mit Ablauf, erstem Ticket und der Schwachstelle des Konzepts liegt hier:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md

Das Ganze steht unter CC0 (Public Domain), ohne jede Bedingung. Wenn es als Impuls für das Kiezlabor, einen Hackathon oder ein Bürger-Tool nützlich ist, freut es mich; falls nicht, ist nichts verloren. Eine Rückmeldung ist nicht erforderlich, ich fasse nicht nach.

Viele Grüße
Félix
Berlin · https://felixinberlin.github.io/Amelie/
```

---

## Muster 3: An Firmen mit passendem Produkt (Feature-Geschenk)

**Zielgruppe:** DevTools & Software-Produkte (z.B. GitKraken, Tessl, Escape Motions)

```text
Subject: Free idea: [Feature-Name] for [Produktname]

Hi [Name / Team],

I research developer tooling that only recently became feasible, and I only build about one in twenty myself. This idea directly complements what you've shipped with [spezifisches Feature/Produkt], so it's yours to take.

[Problem in einem Satz: z. B. „Agents currently guess why code changed because git history, issues, and PR context are scattered"].
[Lösung in einem Satz: z. B. „A unified blame-to-issue traversal exposed via MCP solves this without altering the developer's workflow"].

Here is a one-page breakdown with the architecture, the first implementation ticket, and the exact risk that could break it:
https://felixinberlin.github.io/Amelie/ (or https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md)

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
https://felixinberlin.github.io/Amelie/

Everything is licensed under CC0 / Public Domain with zero obligations. If you are already working on this or it conflicts with current priorities, simply ignore this note.

Félix, Berlin
https://felixinberlin.github.io/Amelie/
```

---

## Die 3 Anti-Muster (Was verboten ist)

1. **Kein Kaffeetrinken/Zoom verlangen:** Ein Geschenk bürdet niemals einen Kalendertermin auf.
2. **Keine ungefragte Arbeit für unbezahlte Maintainer:** Nur mit lauffähigem Code-Skelett an Einzelpersonen herantreten.
3. **Kein Nachfassen (Telefonzellen-Regel):** Wer fragt „Hatten Sie schon Gelegenheit...", verwandelt die Gabe in eine Bringschuld.

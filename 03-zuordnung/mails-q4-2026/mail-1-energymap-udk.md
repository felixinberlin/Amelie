# Mail 1 — Altbau Thermal → EnergyMap Berlin (UdK)

**Status:** Entwurf als Datei, **kein Gmail-Draft** (Gmail-MCP noch nicht freigeschaltet). Nicht gesendet.
**An:** nytsch@udk-berlin.de — Prof. Dr.-Ing. Christoph Nytsch-Geusen, Projektkoordination EnergyMap Berlin. Adresse am 19.9.2026 von `energymap-berlin.de/projektpartner` abgelesen.
**Betreff:** Idee zu verschenken: die Wohnungsebene unter EnergyMap Berlin
**Geändert 19.9.2026 (Sekretär, nach Prüfung durch tester-2):** „unter den Taupunkt fällt" ersetzt durch „schimmelkritisch kalt wird" — die Normen (ISO 13788 / DIN 4108-2) prüfen mit 80 % Oberflächenfeuchte, nicht mit dem Taupunkt; Taupunkt untertreibt das Risiko um ca. 3 K. Die Dose selbst (Abschnitt Skizze) sagt noch „Taupunktunterschreitung" — Korrektur liegt bei der Bibliothekarin.
**Geändert 19.9.2026 (Sekretär, nach tester-1):** Anrede geschlechtsneutral („Guten Tag Prof. Nytsch-Geusen" statt „Sehr geehrter Herr Professor", die Anrede war aus dem Vornamen geraten, keine Quelle nennt sie). Prototype-Fund-Satz umformuliert: der Fonds fördert Einzelpersonen und kleine Teams, keine studentischen Arbeiten oder Institute; Frist laut Sekundärquelle (StartHub Hessen) bis 30.11.2026, prototypefund.de selbst war nicht lesbar, **vor dem Senden auf der Fondsseite gegenlesen**. Neuer Satz zu BuildingSystems und interaktiver Simulationsanalyse: stützt sich auf die VPT-Forschungsseite, wie tester-1 sie gelesen hat, nicht auf meine eigene Lektüre; gegenlesen oder streichen. `energymap4py`: tester-1 bestätigt (GitHub UdK-VPT/energymap4py, HTTP 200); researcher-1 fand es über Suchschnipsel nicht. Primärbeleg gewinnt, die Dose ist damit gedeckt.
**Nachtrag (researcher-4, nur Suchschnipsel):** Raumsimulationen im Browser gibt es schon (ubakus „Thermische Simulation", Thesim 3D, HRC-Hitzetool). Deshalb sagt die Mail „nicht abgedeckt **dort**" statt „unbeantwortet"; die Lücke ist Unsicherheit als Kern plus Schimmelecke, nicht „eine Raumsimulation". Die Dose listet diese Werkzeuge noch nicht (Bibliothekarin). Gilt auch für Mail 1b.
**Angepasst nach dem neuen Dose-Abschnitt „Wer es schon versucht hat" (19.9.2026):** ubakus-Satz und „Ein kurzes Dokument" statt „Eine Seite" (die Dose hat ca. 1200 Wörter, nicht eine Seite). ubakus ist von der Bibliothekarin auf der Seite selbst gelesen (Einzelzonenmodell, keine Oberflächentemperatur, kein Schimmel, kein Grundriss); alle anderen Nachbarn in der Dose nur aus Suchzusammenfassungen, deshalb steht nur ubakus in der Mail.
**Blockiert, bis der Link stimmt:** Der Abschnitt und die Korrekturen (80-%-Kriterium, `energymap4py`) liegen nur uncommitted im Worktree `librarian-audit-06-suche-r4`. Die Mail verlinkt auf `main`. Ohne Merge und Push hat der Empfänger die alte Dose ohne „Wer es schon versucht hat", und der neue Satz in der Mail widerspräche ihr nicht, aber sie zeigte weniger, als die Mail verspricht.
**Widerspruch in der Dose (Bibliothekarin/Félix):** „Das Problem" sagt weiter „Die Frage danach ist unbeantwortet: Was tut meine Wohnung?", der neue Abschnitt sagt „nicht ‚die Wohnungsebene fehlt'". Beides in einer Dose, die dem Empfänger geschickt wird, liest sich widersprüchlich. Die Mail folgt der engen Fassung.
**Noch offen, nicht meine Entscheidung:** Defensive Publikation (Zustellplan-Checkliste, nicht blockierend) und die fehlende Sektion „Wer es schon versucht hat" in der Dose (Bibliothekarin). Beides sollte vor dem Senden geklärt sein, weil die Mail auf die Dose verlinkt.
**Vor dem Senden:** Text im Body unten ab „Sehr geehrter Herr Professor" bis „Félix" kopieren. Repo-Link geprüft (öffentlich, HTTP 200). Prototype Fund öffnet laut Manifest am 1.10.2026 — Satz bleibt richtig, wenn die Mail vorher rausgeht; danach „öffnet" zu „ist offen" ändern und Konditionen auf prototypefund.de gegenprüfen.

Belegte Bezüge im Text: EnergyMap Berlin öffentlich seit der Vorstellung am 28.5.2025 (Berliner Energietage, UdK-Pressemitteilung); `energymap4py` auf der Projektseite genannt (GitHub UdK-VPT/energymap4py); CoolingMap 2026–2029.

---

Guten Tag Prof. Nytsch-Geusen,

ich recherchiere Software, die erst seit Kurzem technisch möglich ist, und baue nur einen kleinen Teil davon selbst. Diese Idee passt zu Ihrem Verbund und nicht zu mir, deshalb schenke ich sie Ihnen.

EnergyMap Berlin beantwortet seit Mai 2025 die Frage, was ein Gebäude braucht, und mit energymap4py sogar programmatisch. Nicht abgedeckt ist dort die Frage danach: was die einzelne Wohnung tut. Grundriss zeichnen, Baualtersklasse wählen, sehen, was das gekippte Fenster im Berliner Zimmer kostet und wo es an der Außenwand schimmelkritisch kalt wird. Kein Konkurrenzprodukt: es verbraucht Ihre Daten, statt sie zu ersetzen, und die Sommerrichtung derselben Gleichung wäre an CoolingMap anschlussfähig.

Einfache Raumsimulationen gibt es bereits, etwa bei ubakus. Die Lücke, die ich sehe, ist enger: Unsicherheit als Kern der Oberfläche und die Schimmelecke, für eine Altbauwohnung, vorher und nachher.

Ein kurzes Dokument mit Skizze, erstem Ticket, den Werkzeugen, die es in der Nähe schon gibt, und der Stelle, an der es schiefgeht, nämlich Scheingenauigkeit bei fünfstelligen Sanierungsentscheidungen:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/altbau-thermal.md

Ihre eigene Arbeit in diesem Feld, etwa die Modelica-Bibliothek BuildingSystems und die interaktive Simulationsanalyse, kennen Sie besser als ich. Falls die Idee dort längst mitgedacht ist, umso besser.

Falls jemand das bauen möchte, nicht zwingend Sie: Der Prototype Fund fördert Open-Source-Vorhaben von Einzelpersonen und kleinen Teams, die nächste Bewerbungsphase beginnt am 1. Oktober.

Keine Bedingungen, CC0, keine Gegenleistung erwartet. Wenn Sie so etwas längst planen, ignorieren Sie diese Mail bitte einfach, ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix
Berlin · github.com/felixinberlin/Amelie

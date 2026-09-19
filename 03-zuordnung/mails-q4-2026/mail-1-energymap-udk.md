# Mail 1 — Altbau Thermal → EnergyMap Berlin (UdK)

**Status:** Entwurf als Datei, **kein Gmail-Draft** (Gmail-MCP blockiert: Google-Cloud-Projekt nicht im Workspace Developer Preview). Nicht gesendet.
**An:** nytsch@udk-berlin.de — Prof. Dr.-Ing. Christoph Nytsch-Geusen, Projektkoordination EnergyMap Berlin. Adresse am 19.9.2026 von `energymap-berlin.de/projektpartner` abgelesen und von tester-1 dort wörtlich bestätigt.
**Betreff:** Idee zu verschenken: die Wohnungsebene unter EnergyMap Berlin

**Änderungen am 19.9.2026 (Sekretär, nach tester-1, tester-2, researcher-1, researcher-4 und dem gemergten Refine der Dose):**
- **Anrede** neutral („Guten Tag Prof. Nytsch-Geusen"). Die frühere Anrede war aus dem Vornamen geraten, keine Quelle nennt sie.
- **Schimmel-Wortlaut:** nicht „unter den Taupunkt", sondern „ab welcher Raumfeuchte eine Ecke über 80 % Oberflächenfeuchte rutscht" (Wortlaut aus dem Refine, stimmt mit der Dose überein). Der Normtext (ISO 13788 / DIN 4108-2) wurde von niemandem im Team selbst gelesen, die 80 %-Grenze stützt sich auf Suchzusammenfassungen und die Berechnung 12,6 °C gegen 9,3 °C, die die Bibliothekarin nachgerechnet hat.
- **„Nicht abgedeckt dort"** statt „unbeantwortet". Raumsimulationen gibt es (ubakus u. a.); die Dose stellt die Lücke inzwischen eng dar („Wer es schon versucht hat", Verdikt `verengt`). ubakus ist im Refine und von der Bibliothekarin auf der Seite gelesen, alle anderen Nachbarn nur aus Suchzusammenfassungen, deshalb nennt die Mail nur ubakus.
- **Prototype-Fund-Satz entfernt.** Laut Refine setzt der Fonds seit 2025 nur Schwerpunkte Datensicherheit und Software-Infrastruktur (Bewerbung 1.10.–30.11.2026), eine Wohnungs-App passt nicht. **Ich konnte prototypefund.de selbst nicht lesen**, der Wortlaut stammt aus dem Refine und aus Sekundärquellen. Stattdessen steht der Refine-Satz zur studentischen Arbeit im Verbund; „Raum" ist dort in „Außenecke" korrigiert, weil das Ticket der Dose jetzt so heißt.
- **Eigene-Arbeit-Satz** (BuildingSystems, interaktive Simulationsanalyse): stützt sich auf die VPT-Forschungsseite, wie tester-1 sie gelesen hat, nicht auf meine eigene Lektüre. **Gegenlesen oder streichen.**
- **„Ein kurzes Dokument"** statt „Eine Seite".
- `energymap4py`: bestätigt (Repo `UdK-VPT/energymap4py`, BSD-3, angelegt 29.4.2025; tester-1, Bibliothekarin, researcher-1). Die Nutzungsbedingungen der *Daten* sind nicht geprüft, die Mail behauptet dazu nichts.

**Noch offen, nicht meine Entscheidung:** Defensive Publikation (Zustellplan-Checkliste, nicht blockierend).
**Vor dem Senden:** Text im Body unten ab „Guten Tag" bis „Félix" kopieren. Repo-Link zuletzt geprüft (öffentlich, HTTP 200, byte-gleich mit dem lokalen Stand vor dem Refine); die Dose auf `main` ist inzwischen neu, den Link einmal öffnen. Den Eigene-Arbeit-Satz gegenlesen (s. o.).

Belegte Bezüge im Text: EnergyMap Berlin öffentlich seit der Vorstellung am 28.5.2025 (Berliner Energietage, UdK-Pressemitteilung); `energymap4py` auf GitHub (UdK-VPT/energymap4py); CoolingMap 2026–2029.

---

Guten Tag Prof. Nytsch-Geusen,

ich recherchiere Software, die erst seit Kurzem technisch möglich ist, und baue nur einen kleinen Teil davon selbst. Diese Idee passt zu Ihrem Verbund und nicht zu mir, deshalb schenke ich sie Ihnen.

EnergyMap Berlin beantwortet seit Mai 2025 die Frage, was ein Gebäude braucht, und mit energymap4py sogar programmatisch. Nicht abgedeckt ist dort die Frage danach: was die einzelne Wohnung tut. Grundriss zeichnen, Baualtersklasse wählen, sehen, was das gekippte Fenster im Berliner Zimmer kostet und ab welcher Raumfeuchte eine Ecke über 80 % Oberflächenfeuchte rutscht. Kein Konkurrenzprodukt: es verbraucht Ihre Daten, statt sie zu ersetzen, und die Sommerrichtung derselben Gleichung wäre an CoolingMap anschlussfähig.

Einfache Raumsimulationen gibt es bereits, etwa bei ubakus. Die Lücke, die ich sehe, ist enger: die Verteilung im Raum, also die Ecke und ihre Feuchtegrenze, als Band statt als Einzelzahl, für eine Altbauwohnung, vorher und nachher.

Ein kurzes Dokument mit Skizze, erstem Ticket, den Werkzeugen, die es in der Nähe schon gibt, und der Stelle, an der es schiefgeht, nämlich Scheingenauigkeit bei fünfstelligen Sanierungsentscheidungen:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/altbau-thermal.md

Ihre eigene Arbeit in diesem Feld, etwa die Modelica-Bibliothek BuildingSystems und die interaktive Simulationsanalyse, kennen Sie besser als ich. Falls die Idee dort längst mitgedacht ist, umso besser.

Falls das eine studentische Arbeit wert ist: der erste Schritt (eine Außenecke, gegen ISO 10211 validiert) ist klein genug dafür.

Keine Bedingungen, CC0, keine Gegenleistung erwartet. Wenn Sie so etwas längst planen, ignorieren Sie diese Mail bitte einfach, ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix
Berlin · github.com/felixinberlin/Amelie

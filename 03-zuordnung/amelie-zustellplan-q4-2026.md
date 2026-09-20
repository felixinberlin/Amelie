# Amélie — Zustellplan Q4 2026

Die erste Runde. Drei Mails, drei Empfängertypen, alle recherchiert und sendebereit.

---

## Zuerst: Was die Recherche verändert hat

**Die Altbau-Thermal-Dose hätte danebengegangen.** Ihre Prämisse war „die rechnen Gebäude durch, aber die Leute darin haben kein anfassbares Werkzeug". Das stimmt nicht mehr:

**EnergyMap Berlin hat seit Mai 2025 eine öffentliche Web-App** — interaktive Karte, KI-Prognose des Wärmebedarfs pro Gebäude, Sanierungsoptionen durchspielbar, angebunden an den Energieatlas. Dazu eine Python-Schnittstelle `energymap4py` auf GitHub. Und es ist kein co2online-Projekt allein, sondern ein **Forschungsverbund unter Leitung der UdK Berlin** mit co2online, SEnerCon, LUP und dem Bezirksamt Charlottenburg-Wilmersdorf.

Eine Mail mit „euch fehlt ein Bürger-Tool" an dieses Team wäre der schlechteste denkbare erste Kontakt gewesen: Sie hätte gezeigt, dass ich ihre Arbeit nicht kenne.

**Die neu gezielte Version ist stärker als die alte.** EnergyMap beantwortet *„was braucht dieses Gebäude"* — von außen, aus Daten. Unbeantwortet bleibt *„was tut meine Wohnung"* — von innen, aus dem Grundriss. Das ist komplementär statt konkurrierend, und die Existenz von `energymap4py` macht aus der Idee erst ein realistisches Vorhaben: Die Wohnungssimulation muss den Gebäudekontext nicht mehr raten, sie kann ihn abfragen.

Dazu zwei Anschlussstellen, die es vorher nicht gab: **CoolingMap** (2026–2029, Kühlbedarfs-Kataster) und **CO2OL ISLANDS** (2026–2030). Die Sommerrichtung derselben Physik — Überhitzung, Verschattung, Nachtlüftung — passt dort hinein.

> **Lehre für den Loop:** Schritt 2 (Zuordnen) ist nicht „wen könnte das interessieren", sondern **„was hat diese Gruppe zuletzt tatsächlich gebaut"**. Eine Stunde Lesen hat hier eine verbrannte Erstansprache verhindert. Genau dafür ist die 1:2-Budgetregel da.

Gegenprüfung für die anderen beiden Berlin-Ideen: **Sperrmüll-Radar** — kein vergleichbares Angebot gefunden, das Phänomen ist medial präsent, die Lücke besteht. **Kiez-Lärmkarte** — der Berliner Lärmaktionsplan 2024–2029 läuft in der Umsetzung; gemessene Ruhe-Fenster sind komplementär zu dessen Modellkarten, nicht konkurrierend. Beide Dosen bleiben, wie sie sind.

---

## Mail 1 — Altbau Thermal → Forschungsverbund EnergyMap Berlin

**Empfängertyp:** Forschung (Rang 2). Kein Code nötig, sie haben Studierende und Methodik.
**Kontaktweg:** Projektkoordination Prof. Dr.-Ing. Christoph Nytsch-Geusen, UdK Berlin — die Adresse steht als offizieller Projektkontakt auf `energymap-berlin.de/projektpartner`.
**Anhang/Link:** `dosen/altbau-thermal.md`
**Konkreter Bezug:** die Web-App seit Mai 2025, `energymap4py`, das Validierungspapier auf der BauSIM 2026, CoolingMap.

> **Betreff:** Idee zu verschenken: die Wohnungsebene unter EnergyMap Berlin
>
> Guten Tag Prof. Nytsch-Geusen,
>
> ich recherchiere Software, die erst seit Kurzem technisch möglich ist, und baue nur einen kleinen Teil davon selbst. Diese Idee passt zu Ihrem Verbund und nicht zu mir, deshalb schenke ich sie Ihnen.
>
> EnergyMap Berlin beantwortet seit Mai 2025 die Frage, was ein Gebäude braucht — und mit `energymap4py` sogar programmatisch. Nicht abgedeckt ist dort die Frage danach: was die einzelne Wohnung tut. Grundriss zeichnen, Baualtersklasse wählen, sehen, was das gekippte Fenster im Berliner Zimmer kostet und ab welcher Raumfeuchte eine Ecke über 80 % Oberflächenfeuchte rutscht. Kein Konkurrenzprodukt — es verbraucht Ihre Daten, statt sie zu ersetzen, und die Sommerrichtung derselben Gleichung wäre an CoolingMap anschlussfähig.
>
> Eine Seite mit Skizze, erstem Ticket und der Stelle, an der es schiefgeht — nämlich Scheingenauigkeit bei fünfstelligen Sanierungsentscheidungen: <Link>
>
> Falls das eine studentische Arbeit wert ist: der erste Schritt (ein Raum, gegen ISO 10211 validiert) ist klein genug dafür.
>
> Keine Bedingungen, CC0, keine Gegenleistung erwartet. Wenn Sie so etwas längst planen, ignorieren Sie diese Mail bitte einfach — ich melde mich nicht erneut.
>
> Mit freundlichen Grüßen
> Félix …

---

## Mail 2 — Sperrmüll-Radar + Kiez-Lärmkarte → CityLAB Berlin

**Empfängertyp:** Organisation mit Bauauftrag und Budget (Rang 1).
**Kontaktweg:** allgemeine Kontaktadresse auf `citylab-berlin.org/kontakt` — sie leiten intern an die passende Person weiter. **Adresse von der Seite kopieren, nicht raten.**
**Anhang/Links:** zwei Dosen.
**Konkreter Bezug:** Prototypen für die Stadt, GovTech TestLAB, Kiezlabor.

> **Betreff:** Zwei Ideen zu verschenken: Sperrmüll-Radar und Ruhe-Fenster-Karte
>
> Hallo CityLAB-Team,
>
> ich recherchiere Apps, die es ohne die letzten Jahre KI-Fortschritt nicht geben könnte, und baue nur wenige davon selbst. Zwei davon sind so berlinerisch, dass sie zu Ihnen gehören und nicht zu mir.
>
> **Sperrmüll-Radar.** „Zu verschenken" ist ein funktionierendes Berliner Protokoll ohne einen einzigen Server: Karton, Bordstein, Schild. Es fehlt nur das Wissen, wo gerade einer steht. Foto → Klassifikation → Geo-Pin mit zwölf Stunden Halbwertszeit. Keine Accounts, kein Besitz, keine Datenhaltung über den Tag hinaus — die Verfallslogik ist das Datenschutzkonzept.
>
> **Kiez-Lärmkarte.** Der Lärmaktionsplan 2024–2029 liefert Modellkarten und Jahresmittel. Menschen suchen aber etwas anderes: das Zeitfenster, in dem diese Straße leise ist. Handy-Mikrofon misst ausschließlich dB-Pegel, nie Audio, Aggregation lokal.
>
> Je eine Seite mit Skizze, erstem Ticket und der Stelle, an der es kippt: <Links>
>
> Beide sind CC0, ohne jede Bedingung. Falls eine davon in Richtung GovTech TestLAB oder Kiezlabor passt, umso besser; falls nicht, ist auch nichts verloren. Eine Antwort ist nicht nötig, ich fasse nicht nach.
>
> Viele Grüße
> Félix …

---

## Mail 3 — Kiez-Lärmkarte (Methode) → Noise-Planet / NoiseCapture

**Empfängertyp:** Forschung, international (Rang 2). Englisch.
**Kontaktweg:** über das NoiseCapture-Repository der Université Gustave Eiffel bzw. die Projektseite `noise-planet.org`.
**Konkreter Bezug:** ihre weltweite Crowdsourcing-Lärmkarte und deren Methodik.

> **Subject:** Free idea: quiet windows instead of average levels
>
> Hello,
>
> I research software ideas and give away the ones I won't build myself. This one belongs with your group.
>
> NoiseCapture maps measured sound levels across the world. Official action plans, including Berlin's for 2024–2029, work with modelled yearly averages. Neither answers the question people actually ask when choosing a flat or arguing with a landlord: **when is this street quiet?**
>
> Same sensors, different question — a quiet-window map per street segment, aggregated on-device, dB levels only, never audio. The privacy-first design is not a feature to add later; it is the only version that survives contact with users.
>
> One page with the sketch, the first ticket, and the part most likely to kill it: <link>
>
> CC0, no strings, no follow-up. If this is already in your roadmap, please just ignore this.
>
> Félix, Berlin

---

## Reihenfolge und Daten

| Wann | Was | Aufwand |
|---|---|---|
| **heute** | Mail 1 (UdK / EnergyMap) — die mit der höchsten Trefferwahrscheinlichkeit | 20 min |
| **diese Woche** | Repo `amelie` anlegen, drei Dosen rein, damit die Links in Mail 2 und 3 existieren | 2 h |
| **nach dem Repo** | Mail 2 (CityLAB) und Mail 3 (NoiseCapture) | 30 min |
| **vor dem 1. Okt** | nichts weiter — der Prototype-Fund-Hinweis steht schon in den Dosen | — |
| **Ende Dezember** | Quartalsreview: Status fortschreiben, Dosen mit abgelaufenem „Prüfen ab" löschen | 30 min |

**Reihenfolge-Logik:** Mail 1 braucht keinen Link auf ein Repo — die Dose kann als Anhang mit. Deshalb geht sie heute raus, bevor die Infrastruktur steht. Das Repo ist sonst genau die Vorbereitung, die sich unendlich dehnen lässt.

---

## Checkliste, für alle drei abgehakt

- [x] Steht drin, warum ich das verschenke? — ja, erster Satz jeder Mail
- [x] Konkreter Bezug zum Empfänger? — Web-App und `energymap4py` / GovTech TestLAB und Lärmaktionsplan / NoiseCapture-Methodik
- [x] „Wo es kippt" in der Dose? — ja, in allen drei
- [x] Empfänger ist Firma, Forschung, Topf oder Community, **kein** unbezahlter Einzelmaintainer? — ja: Forschungsverbund, Stiftung, Forschungsinstitut
- [x] Lizenz **und Name** drunter? — ja
- [x] Datum in der Dose? — Stand 9/2026, prüfen ab 9/2027
- [x] Steht drin, dass sie nicht antworten müssen? — ja
- [ ] Defensive Publikation — für Altbau Thermal erwägen, aber **nicht blockierend**: Das Verfahren ist Stand der Technik, das Risiko der Einzäunung gering. Bei der Lärmkarte relevanter, weil Messverfahren patentierbar sind.
- [x] Kein Nachfassen geplant — wirklich nicht

---

## Status nach dieser Runde

| Idee | Empfänger | Status |
|---|---|---|
| Altbau Thermal | EnergyMap-Verbund / UdK Berlin | **gepackt** → zustellen |
| Sperrmüll-Radar | CityLAB Berlin | gepackt, Dose fehlt noch |
| Kiez-Lärmkarte | CityLAB + Noise-Planet | gepackt, Dose fehlt noch |

Nächste konkrete Arbeit nach Mail 1: die zwei fehlenden Dosen schreiben. Je eine Stunde, das Muster steht.

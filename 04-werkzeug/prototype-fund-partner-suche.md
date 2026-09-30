# Prototype Fund: mögliche Partner:innen für Félix' Antrag

*Stand 30.09.2026. Persönliche Bewerbung, **kein** Amélie-Geschenk: die Kontaktregeln aus den fünf Zustellregeln (einmalig, kein Nachfassen) gelten hier nicht. Alle Angaben stammen aus Suchschnipseln bzw. einer gelesenen Zenodo-Seite. Die Primärseiten `prototypefund.de` und `dl.acm.org` waren gesperrt (HTTP 403). **Vor jeder Kontaktaufnahme auf der Personenseite verifizieren.***

---

## 1. Regeln, die bestimmen, wer „Partner" sein kann

Aus Suchschnipseln zur Ausschreibung Klasse 03 ([StartHub Hessen](https://www.starthub-hessen.de/de/services/navigator/prototype-fund-bewerbung-ab-01-oktober-2026-moglich/), [Prototype Fund Wiki](https://wiki.prototypefund.de/index.php?title=Antragstellung)):

- Bewerbung 01.10.–30.11.2026; Förderzeit Juni–November 2027, Second Stage Dezember 2027–März 2028.
- **Einzelperson** oder **Team bis 4 Personen**. Ein Team muss nach der Jury-Auswahl eine **GbR** gründen; Sitz der GbR in Deutschland, alle geförderten Personen mit Wohnsitz in der EU.
- Teams: bis 95.000 € (6 Monate) bzw. 158.333 € (10 Monate). Einzelperson: bis 47.500 € (6 Monate) bzw. 79.167 € (10 Monate, „kleine Teams" laut Schnipsel, bitte nachlesen).
- Neu ab Klasse 03: Spur **„Up and Coming"** (bis 25 Jahre, Ausbildung oder Studium Informatik).

Daraus folgt: Es gibt zwei Sorten Partner, und sie sind rechtlich verschieden.

| Sorte | Wird bezahlt? | Rechtlich |
|---|---|---|
| **A: Mit-Antragsteller:in** (bis 3 weitere) | ja, aus dem Team-Budget | Teil der GbR, teilt Haftung und Budget |
| **B: Unterstützer:in ohne Förderung** (Beratung, Pilot, Daten, Review) | nein | Absichtserklärung/Support-Brief, keine GbR |

Der Entwurf (`prototype-fund-antrag-klasse-03.md`) ist für eine Einzelperson geschrieben. Mit Sorte A muss Budget und Arbeitspaket-Aufteilung neu gerechnet werden.

---

## 2. Sorte A: Mit-Antragsteller:innen (Profile, keine Namen)

Ich habe keine konkreten Personen als verfügbar belegt. Gesucht wird nach Fähigkeit, nicht nach Namen:

| Profil | Warum | Passendes AP |
|---|---|---|
| TypeScript/Node-Entwickler:in mit Paket- und CLI-Erfahrung | Die Bibliothek als eigenständiges npm-Paket ist der größte Bauposten | AP 2, 3 |
| Daten-/Schema-Person (JSON Schema, Linked Data, Zenodo/Invenio) | Spezifikation und Datensatz-Veröffentlichung | AP 1, 4, 5 |
| UX/Dokumentation (Deutsch/Englisch) | Ohne verständliche „Starte deine Instanz"-Anleitung nutzt niemand das Kit | AP 3, 7 |

Wo suchen (alles Community, keine Kaltakquise nötig):
- **OK Lab Berlin / Code for Germany:** trifft sich laut [Code-for-Germany-Seite](https://codefor.de/berlin/) montags 19 Uhr, ca. 30 Aktive. Direkter Weg zu Entwickler:innen mit Civic-Tech-Erfahrung, und die Gruppe ist selbst Zielgruppe des Kits.
- **Prototype-Fund-Alumni** über das [Wiki](https://wiki.prototypefund.de/index.php?title=Main_Page) und die Projektliste: wer schon gefördert wurde, kennt Antrag und Abrechnung.
- **[opensourcecities/berlin](https://github.com/opensourcecities/berlin):** Verzeichnis Berliner Open-Source-Firmen, Personen und Projekte.
- **Up-and-Coming-Spur:** Wenn du eine:n Studierende:n oder Berufsanfänger:in mitnehmen willst, prüfe, ob das als eigene Bewerbung getrennt laufen muss. Aus den Schnipseln nicht klar.

---

## 3. Sorte B: Fachliche Unterstützer:innen (mit Belegen)

### 3.1 Forschung zu gescheiterter Civic Tech (passt direkt zu AP 5 und 6)

Der Friedhof ist der ungewöhnlichste Teil von Amélie, und dazu gibt es Forschende in Berlin, die dasselbe Problem wissenschaftlich beschreiben: Fehlschläge werden kaum veröffentlicht.

| Wer | Beleg | Bezug |
|---|---|---|
| **Rainer Rehak** (Weizenbaum-Institut, HU/TU Berlin, WZB) | Zenodo-Datensatz gelesen: [„Ten Years of Failed Civic Tech in Germany"](https://zenodo.org/records/20733398), CC BY 4.0, 28.04.2023. Argument: Projekte scheitern an fehlender Verwaltungsanbindung und dauerhafter Finanzierung. | Gutachter/Beirat für die Fehlerkategorien im Totenschein |
| **Andrea Hamm** (Weizenbaum-Institut, Gruppe „Digitalization, Sustainability, and Participation") | [Failed yet successful: Learning from discontinued civic tech initiatives](https://dl.acm.org/doi/10.1145/3544549.3573818), CHI-Workshop 2023, Mitorganisatorin mit Yuya Shibuya (Tokio) | Methodik-Abgleich: Sind die Amélie-Kategorien (`gebaut`, `beim-empfaenger`, `reality-check` …) mit der Forschung kompatibel? Mögliche Mitautorschaft am Datenblatt |
| Workshop-Netzwerk [discontinued-civictech.github.io](https://discontinued-civictech.github.io/contact.html) | Kontaktseite existiert laut Suche | Verteiler für den Friedhof-Datensatz |

Ehrlicher Hinweis: Das sind akademische Kontakte, keine Zusagen. Ob sie Interesse haben, ist offen. Ein Support-Brief ist mit Forschenden üblich, aber nicht garantiert. Die Kategorien im Friedhof (siehe `src/data/graeber.json`) wurden nicht nach dieser Forschung entworfen; ein Abgleich ist eine echte Aufgabe, keine Formalität.

### 3.2 Der Fördergeber selbst

- **Open Knowledge Foundation Deutschland / Prototype Fund-Team:** betreibt laut [Jahresberichten](https://2022.okfn.de/projekte/prototypefund/) eine Wissensbasis und ein Wiki für Alumni. Deine Idee (Wissen aus Fehlschlägen bündeln) ergänzt das. Kein Partner im Sinne eines Briefs, aber sinnvoll für Rückfragen zur Passung **vor** der Abgabe. Kontaktweg: Fragen laufen über die offiziellen Sprechstunden/Workshops laut Wiki, nicht über Kaltmails.

### 3.3 Infrastrukturpartner für AP 4 und 5 (kein Vertrag nötig)

- **[Zenodo](https://www.openaire.eu/zenodo-guide)** (DOI, offene Repository-Software) und **[Technical Disclosure Commons](https://www.tdcommons.org/about.html)** (defensive Veröffentlichung). Beide sind offene Dienste ohne Antragsverfahren; sie sind Werkzeuge, keine Partner, und gehören trotzdem in den Antrag als benannte Abhängigkeit.

### 3.4 Pilot-Nutzer für AP 7

Der Antrag verlangt eine fremde Instanz. Realistische Kandidaten aus dem Repo und der Recherche (nicht angefragt, nur Vorschläge):
- Eine OK-Lab-Gruppe (z. B. Berlin), die ihre eigenen Projektideen und Sackgassen sammeln will.
- Eine Forschungsgruppe aus 3.1 mit dem Friedhof-Datensatz als Anwendung.

---

## 4. Was ich nicht gefunden habe (und nicht erfinden will)

- Kein Projekt, das ein **Register geprüfter Ideen mit Friedhof und Doppelprüfung** anbietet. Die Suchen nach „prior art / Doppelarbeit / Civic-Tech-Register" lieferten keinen Treffer. Das ist ein Hinweis, kein Beweis: Es waren Suchschnipsel. Die Klassenlisten des Prototype Fund selbst sind ungelesen (gesperrt) und müssen für den Besetzt-Test von Hand durchgesehen werden.
- Keine verifizierten Kontaktdaten. Keine Person hier hat zugesagt oder ist angefragt.
- Keine Aussage darüber, ob ein Weizenbaum-Kontakt zeitlich oder inhaltlich mitmacht.

---

## 5. Empfohlene Reihenfolge (diese Woche)

1. **Entscheide Einzelperson oder Team.** Das ist die eigentliche Weiche. Für ein Team brauchst du bis zum Abgabetermin Mit-Antragsteller:innen, die auch selbst den Antrag mittragen.
2. **Montag zum OK Lab Berlin** (19 Uhr laut Seite; Termin vorher prüfen): Projekt in fünf Minuten vorstellen, nach TypeScript-/Daten-/UX-Leuten fragen.
3. **Eine kurze, ehrliche Mail an Rainer Rehak oder Andrea Hamm** (Kontakt über Weizenbaum-Seite verifizieren): was der Friedhof ist, ein konkreter Wunsch (Kategorien gegenlesen, Support-Brief). Ich kann den Entwurf schreiben, sag Bescheid.
4. **Vor Abgabe** beim Prototype-Fund-Team über die offiziellen Kanäle fragen, ob ein „Werkzeug für Ideenprüfung" als Public-Interest-Tech zählt.
5. **Support-Briefe** von 2–3 Unterstützer:innen (Sorte B) sammeln, kurz halten, mit Datum und Name.

# Amélie — Förderlandschaft als Herkunftsort für Ideen und Empfänger

> Stand 28.09.2026 · erste Landkarte · **Evidenz durchgehend Suchschnipsel.** Das Netz zu den Programmseiten war gesperrt und das WebSearch-Budget jedes Rechercheurs nach rund 30 Suchen erschöpft. Beträge, Fristen und Rechtsformen vor jeder Weitergabe auf der Primärseite prüfen. Nichts hier ist ein Versprechen.

Ziel: Geldflüsse als **Suchraum** nutzen. Wer Geld ausgibt, hat ein Mandat; was er finanziert hat, ist besetzt; was er ausschreibt und niemand liefert, ist Bedarf. Das ergänzt die Typ-A-bis-O-Quellen in `amelie-quellen.md` (dort nur „Typ D — Geldgeber, für Schritt 2, nicht für Ideen").

Die fünf Rohkarten mit zusammen rund 190 Programmzeilen liegen unter `06-suche/foerderlandschaft/`:

| Karte | Bereich | Zeilen | Datei |
|---|---|---:|---|
| A | Deutschland Bund (BMFTR, BMWE, BMUKN, BMDS, UBA, BfN, DBU, SPRIND, Sovereign Tech, Prototype Fund, DSEE, Civic Coding) | 37 | `foerderlandschaft/A-bund.md` |
| B | EU-Programme (Horizon, LIFE, Digital Europe, NLnet/Open Internet Stack, EIC, Interreg, Preise, Agentur-Vergaben) | ~40 | `foerderlandschaft/B-eu.md` |
| C | Stiftungen, Preise, Wettbewerbe, Civic-Tech- und Open-Source-Förderer | 47 | `foerderlandschaft/C-stiftungen-preise.md` |
| D | Investoren, Business Angels, Gründungsförderung, Crowdfunding, Exit-Märkte | 39 | `foerderlandschaft/D-investoren.md` |
| E | Städte, Länder, Kommunen, öffentliche Vergabe, Zuwendungs- und Haushaltsdaten | 47 | `foerderlandschaft/E-staedte-vergabe.md` |

## 1. Die vier Signale, die ein Geldfluss liefert

| Signal | Was man liest | Wie es die Suche verändert |
|---|---|---|
| **Besetzt** | Geförderte Projekte, Preisträger, Zuschläge, Finanzierungsrunden | Bevor eine Idee gesucht wird: Projektliste des Förderers durchsuchen. Ein geförderter Vorgänger ist ein Grab-Kandidat (`gebaut`, `forschung`, `gemeinnuetzig`). |
| **Bedarf** | Ausgeschriebene Themen, Challenges, Haushaltstitel, Innovationspartnerschaften, Machbarkeitsstudien | Ein Titel mit Betrag ist ein Bedarf mit Geld. Zählt als Why-Now-Beleg (Reviewer V3). |
| **Empfänger** | Programmträger, Antragsberechtigte, Challenge-Stellen, Jurys | Reale Person und Institution mit Mandat (Zustellregel 2). Kontakt trotzdem vor Versand verifizieren. |
| **Kommerz** | Ticketgrößen, Vergabewerte, Finanzierungsrunden, Exit-Multiples | Eingabe für `ventures/` (siehe `ventures/kapital-und-kanaele.md`), nie in `05-dosen/`. |

## 2. Rangliste: die stärksten Herkunftsorte für Ideen

Ergebnis der fünf Rechercheure, nach Nutzen für die Ideensuche und nach Belegbarkeit geordnet.

| Rang | Quelle | Signal | Was man dort konkret tut |
|---:|---|---|---|
| 1 | **Civic Coding Accelerator** (BMAS/BMUKN/BMFSFJ-Umfeld), 22 dokumentierte Challenges realer NGOs 2026 | Bedarf + Empfänger | Challenge-Katalog lesen (`accelerator-challenges.anmeldung-events.de`). Jede Challenge ist ein Bedarf mit benannter Stelle. Pitch & Connect Berlin im November 2026. Zahlt kein Geld, bis zu 45 Stunden Beratung, alle Rechtsformen. |
| 2 | **Öffentliche Vergabedaten** (`oeffentlichevergabe.de` OpenData, eForms/OCDS/CSV, TED) | Bedarf + Besetzt | Bulk laden, lokal per Volltext filtern (Rezept 3.1). |
| 3 | **Förderkatalog des Bundes** (über 110.000 Vorhaben) + GovData „Zuwendungsdatenbank" | Besetzt + Empfänger | Nach Ressort und Stichwort filtern, Zuwendungsempfänger und Verbundpartner sind Empfängerkandidaten (Rezept 3.2). |
| 4 | **NLnet-Projektarchiv** (`nlnet.nl/project/`, Runden 2026 mit 44, 57 und 67 Projekten) | Besetzt | Bester Besetzt-Atlas für Open-Source-Ideen. NGI Zero ist beendet, das Archiv bleibt nutzbar. |
| 5 | **Prototype Fund** (rund 400 Projekte seit 2016) | Besetzt | Klassenlisten gegen jede Civic-Tech-Idee laufen lassen. Neuer Zuschnitt (Datensicherheit, Software-Infrastruktur) zeigt, was ausfinanziert ist. |
| 6 | **Open Source Wettbewerb** (OSBA, Verleihung 15.10.2026, Smart Country Convention) | Besetzt + Empfänger | Einreichungsliste 2026 = Besetzt-Atlas der Verwaltungs-Open-Source mit benannten Verwaltungsstellen. Nicht abgerufen. |
| 7 | **DBU-Projektdatenbank** (13 Themenfelder, 60–70 Mio. € pro Jahr ab 2026, KMU und Vereine antragsberechtigt) | Besetzt | Umwelt- und Bauthemen dort suchen, bevor sie als Idee gelten. |
| 8 | **Berliner Haushaltsdaten** (`haushaltsdaten.odis-berlin.de`) und Zuwendungsdatenbank | Bedarf | Titel nach Zweckbestimmung durchsuchen. Bezirks- und Kiezkassen-Listen zeigen Bürgerwünsche im Wortlaut. |
| 9 | **LIFE-Programm** (Chemikaliensicherheit, Vollzug, Governance; Selbstständige und Alleinbewerber zugelassen) | Bedarf + Empfänger | Themenlisten lesen. Anschlussstelle zur Dose `dose-cleaner-chemical-safety`. |
| 10 | **Preisträgerlisten** (EU-Preis für Citizen Science, iCapital, Deutscher Umweltpreis, Ecodesign-Nominierte) | Empfänger + Besetzt | Preisträger sind Menschen mit Mandat. Der Umweltpreis 2026 ging an eine Klimaklage-Juristin: Preise honorieren Rechtsdurchsetzung, das passt zum Vollzugslücken-Muster der Inversions-Engine. |
| 11 | **Stiftung Mercator** (Digitalisierte Gesellschaft, Staatsmodernisierung / Re:Form), **Wikimedia DE**, **Aktion Mensch** | Empfänger | Projektlisten sind Empfänger mit Geld und Mandat. |
| 12 | **Mozilla Democracy x AI**, **Google.org AI for Government Innovation** | Besetzt (international) | Zeigen, welche Verwaltungs- und Transparenzthemen gefördert werden. Nur Sekundärquellen. |

## 3. Such-Rezepte

### 3.1 Vergabe- und Bekanntmachungsdaten
1. Datenquelle: OpenData-Schnittstelle von `oeffentlichevergabe.de` (eForms/OCDS/CSV) und TED. Bulk laden, lokal filtern.
2. Suchbegriffe (Hypothesen, **nie gegen echte Treffer getestet**): „Innovationspartnerschaft" (Bedarf ohne Marktlösung, stärkstes Signal), „Machbarkeitsstudie" plus „Software", „Marktsondierung", „Markterkundung", „Vorinformation", „Erstellung eines Werkzeugs", „Datenplattform". „Fachverfahren" zeigt eine bestehende Lösung und ist ein Besetzt-Signal.
3. CPV-Codes (aus Modellwissen, im Portal gegenprüfen): 72200000, 72210000, 72212000, 72220000, 72300000, 72310000, 72320000, 73000000, 73200000.
4. Rangfolge: Innovationspartnerschaft und PCP vor Machbarkeitsstudie vor Rahmenvertrag (Rahmenvertrag = besetzt).
5. Die Zuschlagsbekanntmachung nennt Auftragnehmer und Wert: das ist ein Besetzt-Signal und zugleich ein Kommerz-Signal.

### 3.2 Förderbescheide und Zuwendungen
1. Förderkatalog (`foerderportal.bund.de`): Ressortfilter BMWSB, BMUKN, BMFTR; Stichwörter wie „Klimaanpassung", „Monitoring", „Wärmeplanung". Ergebnis exportieren.
2. GovData: Datensatz „Zuwendungsdatenbank".
3. Berlin: Zuwendungsdatenbank der Senatsfinanzverwaltung und Haushaltsdaten (ODIS).
4. Empfänger ableiten: Zuwendungsempfänger und Verbundpartner, dann Ansprechperson auf der Behördenseite verifizieren.

### 3.3 Projekt- und Preislisten als Besetzt-Check (vor jeder neuen Idee, vor der englischen Suche)
Prototype-Fund-Klassenlisten, NLnet-Projektarchiv, DBU-Projektdatenbank, OSBA-Einreichungen, MPSC-Liste (73 Modellprojekte Smart Cities, 820 Mio. €), EUI-IA (Ergebnisse Dezember 2026), GovTech TestLAB, Bloomberg Mayors Challenge (24 Gewinner), KI-Leuchttürme (53 Projekte, rund 70 Mio. €).

### 3.4 Junge Pflichten mit Registerlücke (Verbindung zum Atlas-Muster)
Das Berliner Klimaanpassungsgesetz (Umsetzungsplanung seit Juni 2026) und die kommunale Wärmeplanung (zweiter Stichtag 30.06.2028) sind junge Pflichten ohne erkennbaren Registerträger. Vor jeder Idee die Vorfilter 0–4 des Atlas anwenden (`amelie-suchplaybook.md`, „Offenlegungspflicht ohne Register").

## 4. Regeln, die aus der Landkarte folgen

1. **Geldgeber sind Signal, nicht Zustellkanal.** Fast alle Programme verlangen einen Antragsteller mit Rechtsform. Amélie stellt keine Anträge, berät nicht und hakt nicht nach (Zustellregeln 1 und 3). Preise und Startup-Awards sind Kontaktbühnen, keine Bewerbungsziele.
2. **Stiftung heißt nicht Budget.** Otto-Umweltstiftung, Schader-Stiftung, Klaus Tschira (2026 keine Ausschreibung) und Postcode Lotterie (Pause bis 2027) nehmen 2026 nichts an.
3. **Vorhabenbeginn prüfen.** Bei Bundeszuwendungen sind bereits begonnene Vorhaben meist nicht förderfähig. Ob ein CC0-Geschenk vor dem Antrag einen Vorhabenbeginn auslöst, wenn die Empfängerin denselben Aufbau beantragen will, ist ungeklärt. **Vor jeder Mail an einen Antragsberechtigten die Richtlinie prüfen.**
4. **Prototype Fund:** Nur Freiberufler:innen und Selbstständige oder GbR bis vier Personen; Stiftungen, Behörden und Vereine sind ausgeschlossen (Notiz 20.09.2026). Open-Source-Pflicht. Vor jedem Hinweis den Status auf `bewerben.prototypefund.de` prüfen.
5. **Tote Programme nicht empfehlen:** NGI Zero (Commons Fund letzte Frist 01.06.2026; Nachfolger NLnet Open Internet Stack), ZIM (Antragsstopp seit 07.07.2026), BENE 2 (seit 18.12.2025 ausgesetzt, Fortsetzung offen), DAS-Richtlinie (endet 31.12.2026).
6. **US-only** sind OpenAI People-First AI Fund, Sloan-OSPO und Knight Cities. Für deutsche Empfänger nicht anwendbar.
7. **Sekundärquellen kennzeichnen.** Anthropic-, Mozilla-, Humanity-AI- und GitHub-Angaben stammen nur von Aggregatoren. Ein Schnipsel nennt für „Claude for Nonprofits" zwei unvereinbare Startdaten.
8. **Schwellenwerte ändern sich.** Bund: Direktvergabe bis 50.000 € netto seit 01.07.2026, auch Dienstleistungen. Berlin: BerlAVG-Novelle seit 16.07.2026, Wertgrenzen widersprüchlich (75.000 / 500.000 / 144.000 €). Immer im Gesetzestext prüfen. Kleinaufträge unter der Schwelle erscheinen in keiner Ausschreibung.

## 5. Kalender: Fristen ab 28.09.2026 (alle [Schnipsel], vor Verwendung prüfen)

| Datum | Programm | Bemerkung |
|---|---|---|
| 01.10.2026 | Digital Europe AI & Data | Konsortium nötig; nur als Themenspiegel |
| 01.10.–30.11.2026 | Prototype Fund Klasse 03 | Rechtsformregel beachten |
| 08.10.2026 | Interreg Ostsee Kleinprojekte; EU-Mission (Vollantrag) | |
| 11.10.2026 | BMDS Digital-Tech-to-Product (Skizze) | Vereine, Stiftungen, Kommunen antragsberechtigt |
| 15.10.2026 | Aktion Mensch (Antragsphase bis); OSBA-Preisverleihung | |
| 16./22.10.2026 | SPRIND | Details ungeprüft |
| 28.10.2026 | EIC Pathfinder Challenges | |
| 01.11.2026 | DSEE „Digital in die Zukunft, engagiert mit KI und Co." | |
| 03.11.2026 | NLnet Restack (danach jeder 3. ungerade Monat) | Budget laut Schnipsel Anfang 2027 vergeben |
| 04.11.2026 | EIC Accelerator Cut-off | |
| 15.11.2026 | 100xDigital (DSEE) | |
| November 2026 | Civic Coding Pitch & Connect (Berlin) | |
| 30.11.2026 | BMFTR Generative KI in den GSW | |
| Dezember 2026 | EUI-IA Ergebnisse | Besetzt-Liste |
| 31.12.2026 | INVEST-Zuschuss endet; DAS-Richtlinie endet | Verlängerung offen |

## 6. Überraschungen der ersten Runde

1. **Direktvergabe:** Der Bund darf seit 01.07.2026 bis 50.000 € netto direkt vergeben. Für Kleinstfirmen gut, für die Bedarfssuche unsichtbar.
2. **Open Internet Stack statt NGI Zero:** NLnet hat umgestellt, Fristen jetzt an jedem dritten ungeraden Monat.
3. **EU Sovereign Tech Fund:** Nur Vorschlag für den Haushalt 2028–34 (mindestens 350 Mio. €), kein beschlossenes Geld. Die EU Open Source Strategy ist seit 03.06.2026 veröffentlicht.
4. **EXIST und Berliner Startup Stipendium** sind für Einzelpersonen ohne Hochschule oder Team praktisch verschlossen.
5. **Complir** (Kopenhagen, 11 Mio. $ Seed, September 2026) besetzt breite Produkt-Compliance; für `ventures/` heißt das, eng auf ESPR Art. 24 zu bleiben.

## 7. Lücken und nächster Schritt

**Nicht recherchiert oder ohne Evidenz** (alle Rechercheure verloren ihr Suchbudget): Interreg außer Ostsee, ESF+ Berlin/Brandenburg, EIT Manufacturing und RawMaterials, European Green Digital/Data Prizes, Agentur-Vergaben (JRC, EFSA, ECHA, EU-OSHA, ACER, AI Office), Sachsen, Hessen, Hamburg, Pro FIT, BVG, Berlin Partner, Microsoft AI for Good, XPRIZE, Bundestag-Hackathon, Hack the Crisis, BMFSFJ-Programme, DFG/NFDI, Förderdatenbank-Gesamtabgleich, Sovereign-Tech-Agency-Investments, konkrete Bosch-2026-Calls. **Nicht bestätigt:** „Digital.Sofa" NRW, SPRIND „Freigeist", Berlin als Mission City, Update-Deutschland-Hackathon 2026, EU Datathon 2026.

**Nächste Schritte:**
1. **Netz freigeben.** Domains: `prototypefund.de`, `nlnet.nl`, `dbu.de`, `oeffentlichevergabe.de`, `foerderportal.bund.de`, `bmbf.de`/`bmftr.de`, `civic-coding.de`, `accelerator-challenges.anmeldung-events.de`, `haushaltsdaten.odis-berlin.de`, `cordis.europa.eu`, `ec.europa.eu/info/funding-tenders`. Ohne Seitenlesung bleibt jede Zahl Schnipsel.
2. **Suchbudget erhöhen** (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`), damit Lücken und Projektlisten nachrecherchiert werden können.
3. **Listen abziehen:** Prototype-Fund-Klassen, NLnet-Projekte, OSBA-Einreichungen, DBU-Datenbank, Civic-Coding-Challenges im Besetzungsatlas-Format in `amelie-suchplaybook.md`.
4. **Stichwortmuster echt testen** (3.1): Bulk laden, Trefferquote messen, dann als Skill-Regel festschreiben.
5. **Neue Engine-Option:** Ein vierter Discovery-Modus „Geldspur" (Förderbescheid oder Ausschreibung → Bedarf → Besetzt-Check → Empfänger) könnte als Erweiterung von `amelie-ideenrunde` laufen. Erst nach Punkt 4 entscheiden.

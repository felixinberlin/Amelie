---
status: Delivered
delivery_method: E-Mail
target_maker: Noise-Planet / NoiseCapture
---
# Kiez-Lärmkarte

**Ein Satz:** Nicht wie laut eine Straße im Jahresmittel ist, sondern **wann sie leise ist** — gemessen von Handys, die nur dB-Pegel erfassen und nie Audio.

**Stand:** 20.09.2026 · **Prüfen ab:** 03/2027
**Empfänger:** Noise-Planet / NoiseCapture (Université Gustave Eiffel + CNRS) · parallel: CityLAB Berlin · **nicht** als Empfänger, aber als Vorarbeit zu würdigen: Hush City
**Verdikt:** 🎁 verschenken — Rang 2 (Forschung) und Rang 1 (CityLAB)

---

## Das Problem

Der Berliner Lärmaktionsplan 2024–2029 arbeitet mit strategischen Lärmkarten: modellierte Jahresmittelwerte, Pegelklassen, Betroffenenzahlen. Das ist für Planung richtig und für Menschen unbrauchbar.

Menschen stellen eine andere Frage. Nicht „wie hoch ist der L<sub>den</sub> dieser Straße", sondern:

- **„Kann ich hier schlafen?"** — bei der Wohnungsbesichtigung, nachmittags um drei, wenn die Kneipe unten noch zu hat.
- **„Wann kann ich mit offenem Fenster arbeiten?"** — die Ruhe-Fenster im Tagesverlauf.
- **„Ist das hier wirklich so schlimm, wie ich denke?"** — für die Beschwerde, die ohne Messwerte nur eine Meinung ist.

Ein Jahresmittelwert beantwortet keine davon, weil er die Zeitstruktur wegmittelt — und die Zeitstruktur *ist* die Information.

## Warum das jetzt geht

1. **On-device-Aggregation.** Das Handy misst den Schalldruckpegel und wirft das Audiosignal sofort weg. Was den Server erreicht, sind Pegelwerte pro Zeitfenster, nie Ton. Das war früher eine Vertrauensfrage; heute ist es eine Architekturfrage, die man offenlegen kann — und es ist der Punkt, an dem sich diese Idee von allem Vorhandenen unterscheidet (siehe unten: Hush City rechnet Pegel aus einer 44,1-kHz-Aufnahme).
2. **Kalibrierung ist lösbar geworden.** Handymikrofone streuen stark. Mit genug Überlappung an denselben Orten lässt sich relativ kalibrieren — für „wann ist es hier ruhiger als sonst" braucht es keine absoluten dB(A).
3. **Der Vergleichsmaßstab existiert.** Die amtlichen strategischen Lärmkarten liegen vor; gemessene Daten können gegen ein Modell geprüft werden. Genau dieser Abgleich ist seit 2025 auch Forschungsthema (Schori u. a., *Mapping Noise Pollution Using Modelled and Crowdsourced Urban Noise Data*) — die Methodik ist also nicht mehr erklärungsbedürftig.

## Skizze

- Messung: dB-Pegel in Zeitfenstern, Standort grob, **kein Audio wird gespeichert oder übertragen**, Aggregation lokal vor dem Upload.
- Auswertung: pro Straßenabschnitt ein **Tagesprofil** statt einer Zahl — „hier ist es werktags zwischen 10 und 15 Uhr am ruhigsten, freitagnachts nie".
- Darstellung: Karte mit Zeitregler. Die Frage „wann", nicht „wie viel", steuert das Interface.
- Abgleich mit den amtlichen Modellkarten als Plausibilitätsprüfung, nicht als Konkurrenz.

**Nicht dabei:** keine Beschwerde-Funktion, keine Nachbarschaftsdenunziation, keine Einzelereignis-Aufnahme, **keine Bewertung von Orten als „ruhig"**. Ein Ort ist nicht ruhig; er ist zu bestimmten Zeiten ruhig. Wer Tonaufnahmen will, baut ein anderes und schlechteres Produkt.

## Erster Schritt

**Ticket: Ein Straßenabschnitt, eine Woche, ein Tagesprofil.**

Messung auf einem Gerät, Pegel in Fünf-Minuten-Fenstern, eine Woche lang, Ausgabe als Tagesprofil mit Wochentagsunterschied.

**Fertig, wenn:** das Profil den Feierabendverkehr und die Wochenendnacht sichtbar macht, und zwei Geräte nebeneinander auf 3 dB übereinstimmen.

## Wo es kippt

**Privacy ist hier keine Eigenschaft, sondern die Existenzbedingung.** In dem Moment, in dem irgendwo Audio gespeichert wird — auch nur für die Pegelberechnung, auch nur kurz — ist das Projekt angreifbar. Die Architektur muss so gebaut sein, dass es technisch nicht geht, nicht nur per Regel verboten ist.

**Zweites Risiko:** Kalibrierung. Wenn Nutzer:innen absolute dB-Werte sehen und für amtlich halten, entstehen falsche Beschwerden und Enttäuschung. Deshalb relative Aussagen („ruhiger als sonst hier"), keine amtlich aussehenden Zahlen.

**Drittes Risiko:** Dichte. Eine Karte mit drei Messpunkten ist Dekoration — und ein Tagesprofil braucht deutlich mehr Messungen als ein einzelner Ruhe-Ort-Eintrag. Das ist der Preis der besseren Frage und der Grund, warum eine bestehende Community (NoiseCapture) der bessere Träger ist als ein Neustart.

**Viertes Risiko, neu:** Hush City hat gezeigt, dass so etwas an *einer Person* hängen bleiben kann. Seit 2020 finanziert die Entwicklerin das Projekt privat. Wer diese Idee aufnimmt, sollte eine Institution im Rücken haben, sonst wiederholt sich das.

## Wer es schon versucht hat

**Recherche 20.09.2026 — Urteil `verengt`.** Die Vorfassung nannte nur NoiseCapture. Das war zu wenig, und zwei der Lücken liegen ausgerechnet in Berlin:

- **Hush City** (Dr. Antonella Radicchi, entstanden an der **TU Berlin**): App zum Kartieren „everyday quiet areas", misst A-bewertete Pegel (Leq, Lmin, Lmax) und ergänzt sie um einen Fragebogen. **Von Berlin 2018 und von Limerick ab 2019 für die Quiet-Areas-Planung übernommen**, international in fünf Sprachen. Zwei Unterschiede bleiben: Die App bewertet **Orte** („dieser Platz ist ruhig"), nicht **Zeitfenster** („diese Straße ist dienstags vormittags ruhig") — und sie **nimmt Audio auf (44,1 kHz)**, um die Pegel zu berechnen. Genau da liegt die Restlücke, und genau deshalb muss diese Dose Hush City nennen statt sie zu übersehen.
- **SoundPrint** (USA, „Find A Quiet Place"): crowdgesourcte Pegel für **Innenräume** — Restaurants, Bars, Cafés —, stark genutzt in der Community der Schwerhörigen. Dieselbe Frage, anderer Raum: Lokale statt Straßenabschnitte.
- **NoiseCapture** (Université Gustave Eiffel + CNRS, Open Source): weltweite Crowdsourcing-Messung mit offener Methodik und offenem Datenbestand. **Was dort fehlt, ist die Fragestellung** — die Karten zeigen gemessene Pegel, nicht Ruhe-Fenster. Dieselben Sensoren, andere Auswertung, anderes Interface. Deshalb Empfänger und nicht Konkurrenz.
- **Forschung, kein Werkzeug:** Modell- und Crowdsourcing-Daten zusammenzuführen ist publiziert (u. a. Schori u. a. 2025, *New Zealand Geographer*; MDPI *Urban Science* 2024 zur Zuordnung von Lärmquellen). Ein Bürgerwerkzeug, das daraus ein Tagesprofil macht, ist nicht darunter.
- **Amtlich:** Der Berliner Lärmaktionsplan 2024–2029 läuft in der Umsetzung; gemessene Zeitprofile sind komplementär, nicht konkurrierend.

**Restlücke, die bleibt:** das **Tagesprofil pro Straßenabschnitt** — „wann", nicht „wo" — erhoben ohne jede Audioaufnahme, getragen von einer Institution statt von einer Einzelperson.

## Vorarbeit

- **NoiseCapture / Noise-Planet** — App, Methodik, Datenbestand, alles offen.
- **Hush City** — Fragebogen-Design, Berliner Feldarbeit, Erfahrung mit einer Verwaltung, die eine Bürger-Lärmkarte tatsächlich übernommen hat. Vor jeder Ansprache lesen; die Arbeit verdient eine Erwähnung.
- **Strategische Lärmkarten Berlin** und der **Lärmaktionsplan 2024–2029** — der amtliche Vergleichsmaßstab.
- **CityLAB Berlin** — für die Berliner Variante und den Zugang in die Verwaltung.
- **Prototype Fund** — Fenster regulär 1.10.–30.11., aber **nur für Freiberufler:innen/Selbstständige oder eine GbR bis vier Personen**; für ein Institut oder eine Stiftung ist er kein Weg. Stand vor jedem Hinweis prüfen.

**Hinweis zur defensiven Publikation:** Messverfahren sind patentierbar. Für diese Dose lohnt sich TDCommons, bevor sie breit verteilt wird.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin


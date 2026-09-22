# EuroBirdCast: Vogelzug-Abschaltung, nachrechenbar

*(englisch: EuroBirdCast: Auditable Migration Curtailment)*
*Arbeitstitel — „EuroBirdCast" kollidiert mit der US-Marke BirdCast (Cornell/CSU) und muss vor jeder Zustellung ersetzt werden.*

**Ein Satz:** Aus bereits öffentlich vorliegenden, wetterradarbasierten Vogelzugprofilen eine turbinenspezifische Abschaltempfehlung erzeugen, die eine Behörde ohne den Dienst selbst nachrechnen kann.

**Stand:** 22. September 2026 (Erstfassung vormittags, nach Prüfung vollständig neu geschrieben) · **Prüfen ab:** März 2027
**Empfänger:** offen — erst nach M0 zu entscheiden. Kandidaten: BfN / BioConsult SH, LfU Brandenburg (Zentrale Fundkartei), Betreiberverbände
**Verdikt:** 🔨 **selbst bauen, wenn überhaupt** — Prüfprotokoll: *verengt, Restlücke unklar*. Die Erstfassung dieser Dose stand auf 🎁 „verifiziert neuartig". Das war falsch; die Korrektur steht unten.

---

## Was diese Dose am 22.09.2026 verloren hat

Drei unabhängige Prüfungen (`02-recherche/eurobirdcast-{empfaenger,besetzung,technik}-2026-09-22.md`) haben die Erstfassung an drei Stellen widerlegt. Das gehört nach vorn, nicht in eine Fußnote:

1. **Der Empfänger existiert nicht.** ENRAM war eine COST-Action 2013–2017; enram.eu ist ein Archiv. Die in der Erstfassung genannte Adresse war nicht belegbar.
2. **Der Index ist nicht neu.** „Kollisionen pro erzeugter Kilowattstunde" ist Szenario 3 in Bauer u. a., *Nature Sustainability*, 2.6.2026 (doi 10.1038/s41893-026-01853-4) — derselben Studie, die die Erstfassung als ihren Hebel zitierte. Code und Daten liegen offen (CC BY 4.0, Zenodo). Vorläufer der Metrik: Bureau Waardenburg 2022 rechnet „Percentage of Collisions Avoided" gegen MWh (30 % = 11 MWh = 0,05 %; 70 % = 545 MWh = 1,65 %; 90 % = 2.294 MWh = 6,14 %).
3. **Das Problem gibt es so nicht.** Onshore in Deutschland existiert keine Vogelzug-Abschaltauflage. Die „pauschalen Nachtabschaltungen August bis Oktober" sind **Fledermaus**-Auflagen und an Temperatur (≥ 10 °C) und Windgeschwindigkeit (< 6 m/s) gekoppelt, also selbst schon bedarfsgesteuert; die phänologischen Abschaltungen gelten **Brutvögeln** (§ 45b Abs. 6 BNatSchG i. V. m. Anlage 1, § 6 WindBG, 4–6 Wochen zwischen 1.3. und 31.8., Sonnenauf- bis Sonnenuntergang). Einschlägig ist § 45b, nicht § 44.

Was übrig bleibt, steht unten — und es ist kleiner, aber echt.

## Das Problem

Nicht „starre Abschaltungen kosten Ertrag". Sondern: **Für den Vogelzug fehlt die Regel, und für die Regel fehlt das Werkzeug, das sie prüfbar machen würde.**

- In Deutschland gibt es onshore keine Zug-Auflage. Wo eine Pflicht besteht — Fledermäuse —, existiert das Werkzeug längst (ProBat 7, BfN). Für den Zug fehlt beides.
- In den Niederlanden ist Start/Stop seit Mai 2023 für alle Windparks mit `kavelbesluit` verpflichtend, Regelbetrieb, Deckel 60 h/Jahr, Rotor < 2 U/min, 48-Stunden-Prognose, behördliche Software EVAS, veröffentlichte Saisonberichte (Herbst 2025: sechs Abschaltungen, 36 Stunden). Die Prognose stammt aus einem Random-Forest-Modell der UvA auf ERA5 plus einem dedizierten Vogelradar bei Luchterduinen — **kein Wetterradar, kein `vol2bird`**. Ein Gutachten von Technolution für Rijkswaterstaat (2025) nennt die Zuverlässigkeit „een lage betrouwbaarheid": Das Modell trifft die Ruhephasen und versagt bei den Zugspitzen. Ein Wechsel auf Wetterradar steht im Ausblick 2026 nicht.
- Kommerzielle Systeme (Robin Radar, Swiss Birdradar) schalten bereits automatisch — proprietär, Hardware je Standort, Preis unveröffentlicht, Entscheidungslogik nicht einsehbar.

Die gemeinsame Leerstelle ist nicht die Messung und nicht die Ökonomie. Es ist die **Nachrechenbarkeit**: Niemand außerhalb des Systems kann prüfen, ob eine Abschaltung richtig war oder eine unterlassene falsch.

## Warum das jetzt geht

1. **Die Profile für Deutschland sind bereits gerechnet und offen.** RMI/KMI Belgien rechnet seit Oktober 2019 **täglich** `vol2bird`-Profile für zwei deutsche Radare — `deess` (Essen) und `denhb` (Neuheilenbach) — frei abrufbar unter `opendata.meteo.be/ftp/observations/radar/vbird/`. Kein eigenes Ingest, kein HDF5, kein Docker nötig.
2. **FlySafe** (UvA / KNMI / niederländische Luftwaffe) liefert seit August 2026 5-Minuten-Echtzeitprofile über NL, BE und **DE**, frei nutzbar über das KNMI Data Platform.
3. **Der Werkzeugkasten ist gepflegt:** `vol2birdR` 1.3.2 (16.09.2026), `bioRad` 0.12.0.9000 (21.07.2026), `getRad` (CRAN) für die DWD-Rohdaten.
4. **Die Schwellenwerte sind veröffentlicht:** 250 und 500 MTR (Welcker 2022, BfN-Schriften 635); NL offshore 500 Vögel/km/h, windabhängig 400 (3–6 m/s) / 900 (6–11) / 500 (> 11) (van Bemmelen u. a. 2022).
5. **Die Gegenrichtung ist besetzt und damit Kalibrierquelle:** Die Vogelschutzwarte im LfU Brandenburg führt seit 2002 die bundesweite Zentrale Fundkartei für Windkraftopfer.

Was **nicht** geht und in der Erstfassung stand: MistNet auf DWD-Daten (braucht `sweep_vol_w`, das der DWD nicht liefert, und ist auf S-Band trainiert — DWD ist C-Band); ein 14-Tage-Rückblick aus DWD-Rohvolumen (Vorhaltezeit gemessen ≈ 48 h, kein PVOL-Archiv); `ρHV < 0,85` als Schwelle (`vol2bird`-Default ist `RHOHVMIN = 0.95`); „Aloft, über 150 Stationen" (141 Stationen in 18 Ländern, täglich nur der `baltrad`-Zweig, `uva` endet 2023, Lizenz research-only).

## Skizze

```
RMI/KMI VPTS (deess, denhb)   ·   FlySafe (Echtzeit, NL/BE/DE)
         │
         ▼
MTR auf Rotorhöhe  ← Nabenhöhe + Rotordurchmesser
  (Vögel je km Frontbreite und Stunde, über die Rotorebene integriert)
         │
         ▼
Schwelle aus Datei (250/500 MTR · NL 400/500/900)  +  Unsicherheitsband
         │
         ▼
Empfehlung  ──▶  Audit-Zeile:
                 Radarquelle · Zeit · Höhenprofil · MTR · Unsicherheit ·
                 Schwelle MIT Quellenangabe · Ertragsverlust · Entscheidung
```

**Die Kennzahl ist MTR auf Rotorhöhe, nicht Vögel/km³.** MTR ist die Einheit, in der die Schwellenwerte in Deutschland, den Niederlanden und Belgien formuliert sind — und damit die einzige, in der sich ein Ergebnis gegen veröffentlichte Grenzwerte prüfen lässt.

**Der Beitrag ist die Audit-Zeile, nicht die Abschaltung.** Aus ihr allein muss die Entscheidung ohne den Dienst reproduzierbar sein. Ziel ist, dass eine Behörde eine Abschaltung nachrechnen kann, ohne dem Betreiber zu glauben — genau das hat keines der kommerziellen Systeme offen.

## Erster Schritt

**Ticket M0: Bedarfsklärung. Zwei Fragen, kein Produkt.**

- An BfN / BioConsult SH: Das Vorhaben FKZ 3523 15 1601 („System für Erfassung und Vorhersage des Vogelzugs für bedarfsgerechte Turbinenabschaltungen in der AWZ", 12/2023–11/2025) ist ausgelaufen. Was fehlt dem Ergebnis zur Betriebsreife — und ist es der offene, nachrechenbare Betriebsdienst?
- An die Vogelschutzwarte im LfU Brandenburg: Wären Totfunddaten aus der Zentralen Fundkartei in einer Form verfügbar, die eine Schwellen-Kalibrierung trägt?

**Fertig, wenn:** aus beiden Richtungen eine Antwort vorliegt, die einen Bedarf entweder benennt oder verneint.

**Kippschalter:** Verneinen beide, wandert die Idee nach `_entsorgt.md`, und das ist ein vollwertiges Ergebnis. Erst danach lohnt M1 (Profil-Lesbarkeit, MTR auf Rotorhöhe) — die vollständige Staffel steht in `02-recherche/eurobirdcast-roadmap-2026-09-22.md`.

## Wo es kippt

- **Der Nullbefund vom Gotthard.** Tettamanti, *J. Environ. Manage.* 401, 1.3.2026: fünf Anlagen, BirdScan-MV1-Radar, turbinenindividuelle MTR-Schwellen seit 2021. Die Abschaltzeit sank von 318 h (Frühjahr 2021/22, alle Anlagen) auf 28–96 h je Anlage 2023/24 — **die Kollisionszahl blieb bei rund 190 Tieren pro Jahr unverändert.** Mehr zeitliche Präzision hat dort nicht mehr Vögel gerettet. Ob das ein Standortartefakt ist (Alpenpass, fünf Anlagen) oder ein Ergebnis, ist offen. Solange es offen ist, steht der Wirkungsanspruch des ganzen Felds auf wackligem Grund — und damit auch der dieser Dose.
- **Kein Käufer.** Ein Werkzeug für eine Pflicht, die es nicht gibt, wird nicht gekauft und nicht betrieben. Deshalb ist M0 der erste Schritt und nicht der Code.
- **Scheingenauigkeit.** Die Messabweichung zwischen Radarsystemen liegt bei 250 MTR bei rund 100 MTR. Eine Ampel ohne Unsicherheitsband behauptet eine Präzision, die die Messung nicht hergibt.
- **Lizenz.** OPERA/Meteogate liefert unter einer research-only-Vereinbarung. Ob ein Betriebsdienst daraus zulässig wäre, ist ungeprüft; die RMI/KMI-Dateien sind der Umweg, ihre Lizenz ebenfalls ungeprüft.
- **Der Name.** „EuroBirdCast" kollidiert mit BirdCast (Cornell/CSU).

## Wer es schon versucht hat

- **Bauer u. a. 2026** (*Nature Sustainability*, 2.6.2026): 37 Radare über DE/FR/BE/NL/LU, ca. 42.000 Turbinen; 50 % Risikoreduktion bei 1,2 % Ertragsverlust, 90 % bei 7,6 %; Szenario 3 ist der Index dieser Dose. Code offen. **Das ist der Vorläufer, nicht der Hebel.**
- **Start/Stop + EVAS (NL, seit Mai 2023):** verpflichtender Regelbetrieb mit behördlicher Software und veröffentlichtem Audit — also genau der Nachweisweg, den diese Dose als Lücke reklamierte. Schwäche: das zugrunde liegende Prognosemodell gilt laut Technolution 2025 als wenig zuverlässig bei Zugspitzen.
- **FlySafe (UvA/KNMI, operativ, seit 8/2026 auch frei für DE):** liefert die Profile, trifft keine betriebliche Entscheidung.
- **Robin Radar Systems:** SCADA-gekoppelte Abschaltung inkl. Algorithmus „mass migration (radar density grids)"; Eneco Maasvlakte 2 fährt sie vollautomatisch über 22 Turbinen. Proprietär.
- **Swiss Birdradar Solution:** BirdScan MV1 („adaptive management of wind parks", automatische Kommunikation mit der Windparksteuerung) — inzwischen als „(legacy)" geführt, abgelöst durch FaunaScan MV2. Proprietär, Hardware je Standort.
- **Bureau Waardenburg 2022 / van Bemmelen u. a. 2022:** die Ökonomie-Schicht als Gutachten, inkl. der Zahlen, die diese Dose neu erfinden wollte.
- **RADBIRD (BfN / Vogelwarte Helgoland, 1.11.2019–31.12.2021):** legte die Methodik für onshore-Abschaltverfahren. Fortgesetzt als FKZ 3523 15 1601 (BioConsult SH, 12/2023–11/2025) für die AWZ — die Erstfassung dieser Dose schrieb, RADBIRD sei „als Forschungsbericht geendet". Das war unvollständig.
- **HiRAD (Biodiversa+):** WSL (Bauer), UvA, INBO, FMI, Agroscope, **mit Swiss BirdRadar Solution AG als Partner**, Arbeitspaket 5 ausdrücklich „data products and tools for stakeholders". Das Konsortium, das die Erstfassungs-Mail vorschlug zu gründen, existiert seit 2024.

## Warum hier kein Mail-Entwurf steht

Weil die Erstfassung zwei hatte — einen an eine Organisation, die es seit 2017 nicht mehr gibt, an eine Adresse, die nicht belegbar war, ausgerichtet auf einen Call, dessen Frist am 12.05.2026 verstrichen war und der ohnehin ≥ 3 Partner und TRL 1–4 verlangt; und einen an den Prototype Fund, der nur Freiberufler und GbR mit ≤ 4 Personen und Sitz in Deutschland fördert, also für keinen der genannten Empfänger in Frage kam.

Beide sind gelöscht. Ein neuer Entwurf entsteht erst, wenn M0 einen Empfänger benannt hat — und mit einer Adresse, die vorher geöffnet wurde. Regel 1 des Manifests: Die Zustellung ist das Geschenk, nicht der Fund. Eine Mail an einen toten Verteiler ist keine Zustellung.

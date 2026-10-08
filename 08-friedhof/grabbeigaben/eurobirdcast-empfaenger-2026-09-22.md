# EuroBirdCast — Empfänger-zuerst-Prüfung und Gegenrichtung

**Dose:** `05-dosen/eurobirdcast.md` · **Stand der Dose:** 22.09.2026 · **Verdikt der Dose:** 🎁 verschenken, „verifiziert neuartig"
**Prüfung:** Rechercheur #1, 22.09.2026
**Gesamturteil:** ⛔ **Verdikt kippt.** Die Empfänger bauen die Idee nicht nur selbst — sie haben sie publiziert (Index), quelloffen implementiert (Pipeline), betrieblich ausgelöst (NL offshore seit 2023) und kommerziell verkauft (Swiss Birdradar). Die Dose stirbt an ihrer eigenen Mail.

---

## Methodische Vorbemerkung: Evidenzstufen und Sperren

- `[Quellcode gelesen]` — Repository geklont und gegrept. Stärkste Stufe.
- `[Seite gelesen]` — Seite per WebFetch abgerufen und gelesen.
- `[nur Suchschnipsel]` — nur Trefferliste, Seite nicht geöffnet.

**Nicht erreichbar in dieser Session:** `curl` über den Agent-Proxy wurde von der Egress-Policy mit 403 abgewiesen für `www.wsl.ch`, `opendata.dwd.de`, `www.vliz.be`, `api.crossref.org`, `ebi.ac.uk` und weitere. Ich habe die Sperre nicht umgangen. `git clone` gegen GitHub funktionierte — deshalb liegt die härteste Evidenz dieses Berichts im Quellcode.
**Per robots.txt / 403 / 404 gesperrt für WebFetch:** `agrarheute.com`, `biodiversitylab.eu`, `prototypefund.de` (403), `bwo-offshorewind.de` (PDF), `lfu.brandenburg.de` (Hauptseite 404, Unterseite erreichbar).

---

## Prüffrage 1 — Betreiben die Empfänger die Idee längst selbst?

**Urteil: JA, vollständig und an jeder Stelle der Kette.** Kein „unklar", kein Teilbefund.

### 1.1 ENRAM — existiert als Adressat nicht mehr

Die Dose adressiert „The ENRAM Coordination Team". ENRAM war eine COST-Aktion mit fester Laufzeit; die Website ist ausdrücklich ein Archiv.

> „ENRAM was a COST action that ran from 2013 to 2017. This website is an archive for information and outputs of the action."

Ein aktueller Koordinator oder eine Kontaktadresse wird auf der Seite nicht genannt. Als Nachfolge wird GloBAM (globam.science) benannt.
Quelle: http://enram.eu/ — `[Seite gelesen]`

**Folge:** Es gibt kein „ENRAM Coordination Team", an das man 2026 schreiben könnte. Die Rolle ist auf drei aktive Träger übergegangen: das **Open science lab for biodiversity (INBO)** für die Daten (Aloft), die **UvA** für die Modelle, und **HiRAD** als gefördertes Konsortium.

### 1.2 Aloft / Open science lab for biodiversity — hat den „Ersten Schritt" der Dose fertig

Der „Erste Schritt" der Dose (Zeile 70–74) lautet: Python-Service, der ungefilterte ODIM-HDF5-Volumenscans des DWD automatisiert herunterlädt, plus dockerisiertes `vol2bird`, das daraus vertikale Profile rechnet.

Genau das ist als R-Paket **getRad** fertig, auf CRAN, aktiv gewartet, von genau diesem Empfänger:

```
R/get_pvol_de.R:15:  default = "https://opendata.dwd.de/weather/radar/sites/sweep_vol_{c('z','v')}/{substr(radar,3,5)}/hdf5/filter_simple/"
R/get_pvol_de.R:20:  default = "https://opendata.dwd.de/weather/radar/sites/sweep_vol_{c('rhohv','phidp','zdr')}/{substr(radar,3,5)}/unfiltered/"
R/get_pvol_de.R:115: source = glue::glue("NOD:{radar},CMT:constructed from opendata.dwd.de")
```

Das Paket zieht also **genau die ungefilterten Dual-Polarisations-Variablen** ($\rho_{HV}$, $\Phi_{DP}$, $Z_{DR}$), die die Dose in Zeile 25 als „entscheidend" bezeichnet, aus dem `unfiltered`-Zweig von `opendata.dwd.de`, rekonstruiert daraus das Polarvolumen und übergibt es direkt an bioRad:

> README: „getRad also facilitates further exploration of the data by other tools such as bioRad by standardizing the data."
> Beispiel im README: `plot(calculate_vp(pvol, h_layer = 50, n_layer = 40, warning = FALSE))`

Unterstützte Quellen laut `vignettes/supported_sources.Rmd`: OPERA (europaweit, letzte 24 h), DE, NL, BE, CZ, SK, RO, AT, SE, DK, EE, FI, UK, US (NEXRAD) — sowie `get_vpts_birdcast.R` für BirdCast-Profile. Für Deutschland: *„Data is downloaded from the unfiltered repository. Polar volumes are reconstructed from separate parameters" / „Only the last three days"*.

Autoren laut `DESCRIPTION`: Bart Kranstauber (UvA, Maintainer), Pieter Huybrechts (INBO), Peter Desmet (INBO), Beiträge von Cecilia Nilsson (Lund), Alexander Tedeschi (Cornell Lab), Hidde Leijnse (KNMI), Bart Hoekstra (UvA). **Finanziert von Biodiversa+ über HiRAD** (`person("Biodiversa+", role = "fnd", comment = "https://hirad.science/")`).

Quelle: https://github.com/aloftdata/getRad (Stand 22.09.2026, v0.4.0.9000) — `[Quellcode gelesen]`
Ergänzend: https://aloftdata.github.io/getRad/ — `[Seite gelesen]`

### 1.3 UvA / Judy Shamoun-Baranes — das Vorhersagemodell löst seit 2023 echte Abschaltungen aus

> „The predictive model developed during the project was used to forecast high migration and trigger temporary shutdown at a wind farm in the North Sea for the first time in spring 2023."

Entwickelt von Prof. Dr. Judy Shamoun-Baranes und Team am IBED der UvA, gemeinsam mit Rijkswaterstaat und dem Windpark Gemini, gefördert von der NWO. Betriebslogik: Vorhersage mindestens 48 h im Voraus, dann temporäre Abschaltung.
Quelle: https://www.uva.nl/en/shared-content/faculteiten/en/faculteit-der-natuurwetenschappen-wiskunde-en-informatica/news/2024/10/making-wind-energy-safer-for-birds.html — `[Seite gelesen]`

Bestätigend, mit Betriebsdetails: Am 13.05.2023 wurden die Offshore-Windparks Borssele und Egmond aan Zee vier Stunden lang abgeschaltet; künftig soll statt Abschaltung auf *„maximal zwei Umdrehungen pro Minute"* gedrosselt werden; das Modell sollte *„in einer Pilotphase weiter getestet und ab Herbst dauerhaft eingesetzt werden"*.
Quelle: https://www.energiezukunft.eu/erneuerbare-energien/windenergie/windraeder-machen-pause-fuer-zugvoegel — `[Seite gelesen]`

**Das ist exakt der Satz, den die Dose bestreitet.** Die Übergabe-Mail sagt dem Empfänger: „Bislang verlassen sich Windparks auf statische, kalendarische Abschaltungen." Der Empfänger hat die dynamische Abschaltung selbst erfunden und ausgelöst.

### 1.4 HiRAD — das Konsortium, das die Mail vorschlägt zu bilden, existiert und ist gefördert

HiRAD („Harmonizing and integrating Radar-based approaches for monitoring Aerial bioDiversity"), Biodiversa+ BiodivMon-Call 2022–2023, finanziert von SNF, BelSPO, NWO und der Academy of Finland.

Partner: **WSL** (Silke Bauer), **UvA/IBED** (Shamoun-Baranes), **INBO** (Aloft/oscibio), **FMI**, **Agroscope**. Selbstfinanzierte Partner: **Swiss BirdRadar Solutions AG**, Météo-France, DLR, Royal Netherlands Air Force.
Arbeitspaket **WP5: „Provide data products and tools for stakeholders"**.
Quelle: https://hirad.science/ — `[Seite gelesen]`

Die Publikationsliste von HiRAD führt sowohl das Aloft-Datenpapier als auch die Nature-Sustainability-Studie:
> „Bauer S, Nussbaumer R, Rojas Tito DA, Shamoun-Baranes J, Farnsworth A (2026) Bird migration and wind-energy production across Western Europe. *Nature Sustainability*."
> „Desmet P, Shamoun-Baranes J, Kranstauber B, Dokter AM, … (2025) Biological data derived from European weather radars. *Scientific Data* 12, 361."
Ebenfalls gelistet: „Bauer S, Lancaster LT, Zimmermann NE (2025) Towards a sustainable energy transition, *Journal of Applied Ecology*".
Quelle: https://hirad.science/publications/ — `[Seite gelesen]`

Im Outreach führt HiRAD einen Vortrag *„The relevance of understanding, mapping and predicting bird movement for wind energy"*, ein Podcast-Stück *„Birds, storms and wind farms: The science of aeroecology"* und ein Interview *„Windkraft ohne Vogeltod"*.
Quelle: https://hirad.science/outreach/ — `[Seite gelesen]`

**Folge für die Mail:** Der Satz „Nehmen Sie die Architektur, binden Sie ein vielversprechendes Hightech-Klima-KMU für die Softwareinfrastruktur ein und sichern Sie sich die EIC-Förderung" beschreibt einen Zustand, der seit 2024 hergestellt ist: das KMU (Swiss BirdRadar Solution AG) ist Partner, die Förderung (Biodiversa+) läuft, das Stakeholder-Arbeitspaket ist geschrieben.

### 1.5 Vogelwarte Sempach / Felix Liechti — operative Vorhersage, öffentlich

> „Durch die Kombination unserer Befunde mit Wettervorhersagen können wir die Zugaktivität für die nächsten zwei Nächte grob vorhersagen."

Datenbasis: eigener BirdScan MR1 („mitentwickelt von der Vogelwarte") plus NOAA-Wettervorhersagen. Öffentliche Werkzeuge: Zweitages-Vorhersage plus Zug der letzten zwei Wochen; Vogelzugrückblick über 365 Tage. Entwicklung: Tom Carrard, Lukas Gudmundsson (ETH Zürich), Baptiste Schmid. Eine technische API wird nicht genannt.
Quelle: https://www.vogelwarte.ch/de/forschen/vogelzug/vorhersage-des-vogelzugs/ — `[Seite gelesen]`

Auf der Projektseite „Vögel und Windenergieanlagen" fand ich **kein** operatives Abschaltsystem, nur Messstudien (Aschwanden et al. 2018; Aschwanden & Liechti 2016 zu Le Peuchapatte). Das ist kein Gegenbeleg, nur eine Lücke in dieser einen Quelle.
Quelle: https://www.vogelwarte.ch/de/projekte/vogel-und-windenergieanlagen/ — `[Seite gelesen]`

### 1.6 Swiss Birdradar Solution AG — die SCADA-Anbindung ist ein Produkt, kein Ticket

BirdScan MV1, beschrieben als System für *„adaptive management of wind parks to mitigate collisions of migratory birds and bats with wind turbines"*. Entscheidend: Es *„can automatically communicate with the wind park controls"*, wenn Schwellenwerte des Kollisionsrisikos überschritten werden. Der Abschaltalgorithmus berücksichtigt *„spatiotemporal distribution"*, *„classification"*, *„mean traffic rate"* und *„environmental conditions"*. Das Produkt ist in der Navigation als *„(legacy)"* geführt — es ist also bereits durch eine Nachfolgegeneration (FaunaScan MV2) abgelöst. Ein Index, der Vogelschutz gegen Ertrag verrechnet, wird auf der Seite nicht genannt.
Quelle: https://swiss-birdradar.com/systems/radar-birdscan-mv1/ — `[Seite gelesen]`

**Folge:** Der Kasten „SCADA / Turbinen-API (Dynamische Drosselung)" in der Skizze der Dose ist seit Jahren kommerziell besetzt — mit einem Gerät, das die Dose in „Wer es schon versucht hat" nicht erwähnt.

### 1.7 Institut für Vogelforschung Helgoland / BfN — RADBIRD und die laufende Fortsetzung

RADBIRD, Leitung Dr. Ommo Hüppop, Institut für Vogelforschung „Vogelwarte Helgoland", BfN-Ressortforschungsplan 2019, FKZ 3519 86 0500, 01.11.2019–31.12.2021. Ziel ausdrücklich: Vogelzug über Deutschland erfassen und vorhersagen und Verfahren identifizieren, um *„switch off wind turbines in real time in relation to bird migration"*. Datenbasis: Archiv- und aktuelle Daten von rund 20 Wetterradarstationen, überwiegend DWD. Zum Endbericht oder zu freigegebener Software macht die Projektseite keine Angabe.
Quelle: https://www.natur-und-erneuerbare.de/en/project-database/radbird/ — `[Seite gelesen]`

**Die Dose schreibt, RADBIRD sei „als Forschungsbericht" geendet. Das stimmt, verschweigt aber die Fortsetzung:**

BfN-Vorhaben „Einsatz von innovativen Vermeidungsmaßnahmen zum Vogelschutz an Offshore-WEA", Auftragnehmer **BioConsult SH GmbH & Co. KG** (Leitung Dr. Jorg Welcker), FKZ 3523 15 1601, Laufzeit **01.12.2023–30.11.2025**, aus Mitteln des Nationalen Artenhilfsprogramms. Ziel wörtlich:

> „Ziel des Vorhabens ist die Konzeptionierung eines Systems für die Erfassung und Vorhersage des Vogelzugs mit welchem bedarfsgerechte Turbinenabschaltungen in der Ausschließlichen Wirtschaftszone (AWZ) realisiert werden können."

und: *„ein Konzept für ein automatisiertes Vogelzugerfassungsnetzwerk zu erarbeiten"*, das erlaubt, *„den Vogelzug im Höhenbereich der Windenergieanlagen modellbasiert vorherzusagen"* und *„temporäre Abschaltungen der Anlagen zielgenau umzusetzen"*.
Quellen: https://www.bfn.de/projektsteckbriefe/einsatz-von-innovativen-vermeidungsmassnahmen-zum-vogelschutz-offshore-wea und https://www.natur-und-erneuerbare.de/projektdatenbank/vogelschutz-an-offshore-windenergieanlagen/ — beide `[Seite gelesen]`

Das Vorhaben endet zehn Monate vor dem Dosendatum. Dass sein Ergebnis eine *Konzeptskizze* und kein Betriebssystem ist, ist der einzige verbliebene Anknüpfungspunkt — aber der Adressat dafür ist das BfN bzw. BioConsult SH, nicht ENRAM.

### 1.8 Adriaan Dokter / Cornell — Werkzeuge vorhanden, Abschaltlogik als Ziel formuliert

Dokter ist Autor von `vol2bird` und `bioRad` und trägt zu getRad bei (`get_vpts_birdcast.R`). Cornell-Studie vom 17.09.2025 (Curley, Dokter u. a., *Journal of Applied Ecology*): Offshore-Singvogelzug in konzentrierten Pulsen, 13–20 % niedrigere Flughöhen offshore. Dokter dazu: *„There might be a sweet spot where we can target these big migration nights and give these birds safe passage, with limited loss of energy."* Konkrete Prozentzahlen nennt die Meldung nicht.
Quelle: https://news.cornell.edu/stories/2025/09/new-research-may-help-offshore-energy-be-more-bird-friendly — `[Seite gelesen]`
BirdCast selbst wird in einem älteren Branchenartikel (06.04.2018) als Werkzeug beschrieben, mit dem man *„hope to provide tools for managing wind turbines and city lights"* — 2018 noch Absicht, kein Betriebsdienst.
Quelle: https://www.windpowerengineering.com/cornells-lab-of-ornithology-offers-forecasts-for-bird-migrations/ — `[Seite gelesen]`

---

## Prüffrage 2 — Verifikation der zentralen Belegbehauptung (Zeile 29 der Dose)

**Urteil: Studie existiert, Autoren/Journal/Datum stimmen, die Zahlenpaare stimmen exakt. EIN Satz ist falsch zugeordnet — und die Studie widerlegt die Neuheit des BP/MWh-Index.**

### 2.1 Die Studie

- **Titel:** Bird migration and wind-energy production across Western Europe
- **Autoren:** Silke Bauer, Raphaël Nussbaumer, Damire Ariel Rojas Tito, Judy Shamoun-Baranes, Andrew Farnsworth
- **Journal:** Nature Sustainability
- **Online:** 2. Juni 2026 (Heft: August 2026)
- **DOI:** 10.1038/s41893-026-01853-4
- **Datenbasis:** 37 Wetterradare aus Deutschland, Frankreich, Belgien, den Niederlanden und Luxemburg, rund 42.000 Onshore-Windturbinen.

Abstract wörtlich (Auszug): *„Integrating bird movement patterns, turbine characteristics and energy production, we estimated the number of birds that are potentially at risk of collision… we derive curtailment scenarios and compare costs and benefits for energy production and conserving biodiversity and show that surprisingly efficient trade-offs may be possible."*
Quellen: https://www.nature.com/articles/s41893-026-01853-4 — `[Seite gelesen, Volltext hinter Paywall]` · https://tethys.pnnl.gov/publications/bird-migration-wind-energy-production-across-western-europe — `[Seite gelesen]` · https://www.wsl.ch/en/news/radar-data-can-help-protect-birds-from-wind-turbines/ — `[Seite gelesen]`

**Die Angabe der Dose „Bauer u. a., Nature Sustainability, Juni 2026" ist korrekt.** Das ist die einzige Behauptung der Dose, die die Prüfung unbeschädigt übersteht.

### 2.2 Die Zahlen — stimmen

> „Das effizienteste Szenario zeigte, dass eine Vermeidung von 50 Prozent der potenziellen Kollisionen zu einem Produktionsverlust von 1,2 Prozent führen würde."
> „Eine Reduktion der Gefahr um 90 Prozent wäre mit einem Stromverlust von 7,6 Prozent verbunden."

Quelle: https://www.watson.ch/wissen/energie/695901417-abschaltung-von-windraedern-kann-millionen-zugvoegel-schuetzen — `[Seite gelesen]`
Bestätigt durch die WSL-Medienmitteilung: *„operators would lose only 1.2 or 7.6 percent of their electricity"* — `[Seite gelesen]`

Ebenfalls belegt: Die Studie beziffert das Grundrisiko auf 114 Mio. Vögel jährlich (realistische Annahme) bzw. 208 Mio. (ohne Berücksichtigung von Flaute und Rotorausrichtung), im Mittel *„nearly 800 birds per turbine were considered at risk"*.

### 2.3 Der Fehler — „starre Abschaltungen kosten 2–20 %" ist falsch zugeordnet

Die Studie vergleicht **drei** Szenarien, und die 2–20 % gelten für die ersten **beiden**:

> Szenario 1: *„the turbines were shut down during the period of peak bird migration"*
> Szenario 2: *„the turbines stopped whenever the bird density in the surrounding area exceeded a certain threshold"*
> Szenario 3: *„the turbines shut down when the number of potential collisions per kilowatt-hour of electricity generated exceeded a defined limit"*
> „The first two scenarios are less attractive to operators because they reduce electricity production by 2 to 20 percent." Für Szenario 3: „operators would lose only 1.2 or 7.6 percent of their electricity."

Quelle: https://ibed.uva.nl/content/news/2026/07/radar-data-can-help-protect-birds-from-wind-turbines.html — `[Seite gelesen]`

**Szenario 2 ist bereits eine dynamische, radarbasierte Dichteschwellen-Abschaltung** — also genau das, was die Dose als ihre eigene Innovation gegenüber dem Kalender verkauft. Die 2–20 % sind deshalb *nicht* die Kosten „starrer Abschaltungen", sondern die Kosten von starren **und** naiv-dynamischen Abschaltungen. Der Satz in Zeile 29 der Dose zitiert eine Zahl korrekt und hängt ihr eine falsche Ursache an.

### 2.4 Der schwerwiegendere Befund: Szenario 3 *ist* der BP/MWh-Index

Die Dose definiert BP/MWh (Zeile 60) als: *„Wie viele Vogel-Durchflüge im Rotorbereich werden pro abgeregelter Megawattstunde verhindert?"*
Szenario 3 der zitierten Studie ist: Abschaltung, wenn *„the number of potential collisions per kilowatt-hour of electricity generated"* eine Schwelle überschreitet.

Das ist dieselbe Kennzahl, in kWh statt MWh. Sie stammt aus derselben Publikation, die die Dose als ihren Beleg anführt, und ihre Autorinnen sind die Empfänger. **Der Kern der Dose — der Index — ist am 2. Juni 2026 in Nature Sustainability veröffentlicht worden.** Die Neuheitsbehauptung in Zeile 9 ist damit widerlegt, nicht nur geschwächt.

---

## Prüffrage 3 — Gegenrichtung: Wer sammelt Rohdaten, wer sammelt Folgen?

**Urteil: Beide Seiten sind besetzt. Beide sind Kalibrierquellen, keine Konkurrenz.**

### 3.1 Eingangsseite — die Rohdaten liegen bereit

| Quelle | Umfang | Latenz | Beleg |
|---|---|---|---|
| DWD Open Data, `sweep_vol_z` / `sweep_vol_v` + `unfiltered` ($\rho_{HV}$, $\Phi_{DP}$, $Z_{DR}$) | deutsche Radarstandorte | *„Only the last three days"* | getRad `R/get_pvol_de.R`, `vignettes/supported_sources.Rmd` — `[Quellcode gelesen]` |
| Aloft / BALTRAD VPTS | *„152 radar stations at 141 locations"* in 18 Ländern, 2012–2023 | *„public access within 48 hours after raw data were collected"* | https://www.nature.com/articles/s41597-025-04641-5 — `[Seite gelesen]` |
| Aloft-Bucket (Betrieb) | baltrad 151 Radare; uva 24 Radare (BE/DE/NL); ecog-04003 84 Radare | *„HDF5 data are typically available 24 hours after… daily and monthly summaries within 48 hours"* | https://aloftdata.eu/faq/ — `[Seite gelesen]` |
| EUMETNET/OPERA via Meteogate | große Auswahl europäischer Länder | *„last 24 hours"*, biologisches Signal in DBZH oft herausgefiltert, TH besser | getRad `supported_sources.Rmd` — `[Quellcode gelesen]` |
| KNMI (NL), FMI (FI), DMI (DK), SHMU (SK), CHMI (CZ), Meteo Romania, GeoSphere AT, SMHI (SE), NEXRAD (US), BirdCast-VPTS | je eigener Konnektor in getRad | unterschiedlich | getRad `R/` — `[Quellcode gelesen]` |

Anmerkung zur Dose: Zeile 26 stellt Aloft als das Argument „die Daten existieren kontinental" hin — richtig. Zeile 86 stellt Aloft als reine *Forschungs*infrastruktur dar — das ist seit getRad zu eng: der Zugriff auf frische DWD-Volumen (3 Tage) ist eingebaut. Die Rechtslage für OPERA ist allerdings eine echte Hürde, die die Dose gar nicht nennt: *„a research-only license agreement between EUMETNET/OPERA members and ENRAM"* (https://aloftdata.eu/faq/ — `[Seite gelesen]`). Eine kommerzielle Abschaltempfehlung an Windparkbetreiber auf OPERA-Daten wäre lizenzrechtlich zu klären. Für DWD-Daten direkt gilt das nicht.

### 3.2 Folgenseite — das Schlagopfer-Monitoring als Kalibrierquelle

**Zentrale Fundkartei der Staatlichen Vogelschutzwarte Brandenburg (LfU).** Wörtlich:

> „für Windkraftopfer ist die Vogelschutzwarte seit 2002 die bundesweite Datenzentrale"

Ansprechperson: Dr. Torsten Langgemach, Staatliche Vogelschutzwarte, Buckower Dorfstraße 34, 14715 Nennhausen OT Buckow, **vogelschutzwarte@lfu.brandenburg.de**. Ein standardisierter Fragebogen zur Dokumentation von Schlagopfern existiert.
Quelle: https://lfu.brandenburg.de/lfu/de/aufgaben/natur/artenschutz/vogelschutzwarte/arbeitsschwerpunkt-erarbeitung-von-grundlagen-fuer-den-vogelschutz/erfassung-von-verlustursachen/ — `[Seite gelesen]`
Ergänzend erscheint in Suchtreffern eine öffentlich abrufbare Tabelle `https://lfu.brandenburg.de/media_fast/4055/wka_voegel_de.xls` — `[nur Suchschnipsel]`, von mir **nicht geöffnet**, Stand und Inhalt unbestätigt.

**PROGRESS** („Ermittlung der Kollisionsraten von (Greif-)Vögeln und Schaffung planungsbezogener Grundlagen für die Prognose und Bewertung des Kollisionsrisikos durch Windenergieanlagen"), Schlussbericht 2016, Konsortialführung BioConsult SH. Schlussbericht öffentlich unter https://www.bioconsult-sh.de/fileadmin/user_upload/Publikationen/2016/PROGRESS_Schlussbericht.pdf und Ergebnispapier der FA Wind unter https://www.fachagentur-wind-solar.de/fileadmin/Veroeffentlichungen/Wind/Natur-_und_Artenschutz/FA_Wind_Ergebnispapier_PROGRESS_03-2017.pdf — beide `[nur Suchschnipsel]`, von mir **nicht geöffnet**. Bemerkenswert ist der personelle Zusammenhang: BioConsult SH führt PROGRESS *und* das laufende BfN-Abschaltkonzept (3523 15 1601).

**Wert für die Idee:** Ein BP/MWh-Index sagt voraus, wie viele Kollisionen eine Abschaltung verhindert. Genau diese Größe ist die unbeobachtete Zwischenvariable der Bauer-Studie („potentially at risk"). Die Fundkartei (seit 2002) und PROGRESS (Systematik der Suchstrecken und Korrekturfaktoren) sind die einzigen deutschen Datensätze, an denen sich der Index überhaupt validieren ließe. Sie gehören in die Dose als Kalibrierquelle und als Antwort auf den „Blackbox-Vorwurf" (Zeile 80) — bisher fehlen sie komplett.

### 3.3 Was ich *nicht* gefunden habe

Eine quelloffene, betriebsfertige Pipeline „Wetterradar → Vogeldichte → Abschaltempfehlung → SCADA/Audit-Trail" habe ich nicht belegen können. Die Suche ergab nur die Bausteine (vol2bird, vol2birdR, bioRad, getRad) und die kommerzielle Vollintegration (Swiss Birdradar). **Urteil für diesen engen Rest: `unklar`, tendenziell frei** — aber es ist ein Integrations- und Genehmigungsproblem, keine Deep-Tech-Lücke, und es rechtfertigt weder die Formulierung „verifiziert neuartig" noch den EIC-Pathfinder-Rahmen (der ausdrücklich frühe Forschungsphasen fördert, nicht Systemintegration).
Suchen: `open source … wind turbine curtailment … vol2bird OR bioRad … SCADA` — `[nur Suchschnipsel]`

---

## Prüffrage 4 — Kontaktprüfung

### 4.1 `enram@biodiversitylab.eu` — nicht belegbar

- Die Adresse steht nicht in der Dose selbst, sondern in `src/data/deliveries.ts` (Zeile 436/437) und `src/data/dosen.ts` (Zeile 174) als `contactPath` bzw. `to`.
- `enram.eu` ist ein Archiv ohne jede Kontaktangabe (*„No email addresses or contact details appear on this page"*) — https://enram.eu/ `[Seite gelesen]`
- `biodiversitylab.eu` löst auf `62.149.128.40` auf (DNS via `getent hosts`), einen Adressbereich, der nicht zu INBO, UvA oder WSL gehört. Die Seite war für WebFetch nicht erreichbar (robots.txt-Timeout), curl per Egress-Policy gesperrt. **Ich konnte keinerlei Verbindung dieser Domain zum „Open science lab for biodiversity" belegen.**
- Das „Open science lab for biodiversity" ist eine Einheit des **INBO** in Belgien und firmiert unter `oscibio.inbo.be`, nicht unter `biodiversitylab.eu`. https://oscibio.inbo.be/ `[Seite gelesen]`

**Urteil: `enram@biodiversitylab.eu` ist nicht belegbar und sollte als erfunden behandelt werden, bis jemand sie primär belegt.**

### 4.2 Die real belegten Kontaktwege

| Weg | Beleg | Stufe |
|---|---|---|
| **oscibio@inbo.be** — Open science lab for biodiversity, INBO | https://oscibio.inbo.be/ (Kontaktangabe auf der Seite) | `[Seite gelesen]` |
| **b.kranstauber@uva.nl** — Bart Kranstauber, UvA, Maintainer von getRad | getRad `DESCRIPTION`, Rolle `cre` | `[Quellcode gelesen]` |
| **pieter.huybrechts@inbo.be** · **peter.desmet@inbo.be** — INBO, Autoren getRad / Erstautor Aloft-Datenpapier | getRad `DESCRIPTION` | `[Quellcode gelesen]` |
| GitHub-Issues: `github.com/aloftdata/getRad/issues`, `github.com/aloftdata/aloftdata.eu` | getRad `DESCRIPTION` (`BugReports`), https://aloftdata.eu/faq/ | `[Quellcode gelesen]` / `[Seite gelesen]` |
| **Vogelwarte Sempach:** Baptiste Schmid +41 41 462 97 72, Barbara Helm +41 41 462 97 82 | https://www.vogelwarte.ch/de/forschen/vogelzug/vorhersage-des-vogelzugs/ | `[Seite gelesen]` |
| **LfU Brandenburg:** vogelschutzwarte@lfu.brandenburg.de (Dr. Torsten Langgemach) | s. 3.2 | `[Seite gelesen]` |
| **BfN-Vorhaben:** BioConsult SH, Dr. Jorg Welcker, FKZ 3523 15 1601 | s. 1.7 | `[Seite gelesen]` |

Eine allgemeine Kontaktadresse für HiRAD habe ich auf https://hirad.science/outreach/ **nicht** gefunden (*„No contact person or email address is provided"*) — `[Seite gelesen]`.

### 4.3 Prototype Fund — für diesen Empfängertyp ausgeschlossen

`prototypefund.de` antwortete WebFetch mit **403**, curl ist per Egress-Policy gesperrt. Belegbar war das Wiki:

> „Einzelpersonen gelten als Freiberufliche Einzelunternehmen"
> Teams: „Gesellschaft bürgerlichen Rechts (GbR)" — „Nur die Gründung einer GbR ist für Teamarbeit zulässig."
> „Wir benötigen eine Geschäftsführung, die die Unterlagen dann rechtsverbindlich unterzeichnet."
> Mitglieder mit Wohnsitz „im innereuropäischen Ausland" sind abrechenbar, sollen aber nicht in Leitungsfunktionen tätig sein.
> volle Förderhöhe 50.000 € bei 5 % Eigenanteil (2.500 €)

Quelle: https://wiki.prototypefund.de/index.php?title=FAQ_Projektträger — `[Seite gelesen]`

**Urteil:** Der Empfängertyp dieser Dose — ein belgisches Landesforschungsinstitut (INBO), eine niederländische Universität (UvA), eine Schweizer Bundesforschungsanstalt (WSL), ein europäisches Biodiversa+-Konsortium — ist **nicht antragsberechtigt**. Weder Rechtsform noch Sitz passen. Der Eintrag „Prototype Fund Alumni / Open-Source Climate-Tech Kollektive" in der Empfängerliste (Zeile 8 der Dose, `recipientsDe` in `dosen.ts`) ist nur dann haltbar, wenn damit eine deutsche Einzelperson oder GbR gemeint ist, die den SCADA-Adapter baut — dann aber gehört er nicht in dieselbe Zeile wie ENRAM.

`kontakt@prototypefund.de`: **nicht belegbar.** Ich habe keine Seite erreicht, die eine Kontaktadresse des Fonds nennt. Ich habe sie auch nicht widerlegt — die Domain war schlicht nicht lesbar.

Hinweis auf frühere Runden: Laut `03-zuordnung/muster-emails.md` (Regel 3) und `02-recherche/altbau-thermal-empfaenger-2026-09-19.md` setzt der Fonds seit 2025 nur die Schwerpunkte Datensicherheit und Software-Infrastruktur. Ein Vogelzug-Abschaltdienst passt in keinen davon. Auch diese Angabe ist im Repo nicht primär belegt.

---

## Was in der Dose falsch ist oder abgeschwächt werden muss

| Ort | Satz | Befund | Nötige Änderung |
|---|---|---|---|
| Z. 9 | Verdikt „verifiziert neuartig — keine offene, automatisierte Pipeline übersetzt ENRAM/DWD-Radarvolumina direkt in einen lokalen ökonomisch-ökologischen Abschalt-Index" | **Falsch.** Die Pipeline ist getRad (CRAN, DWD unfiltered → bioRad), der Index ist Bauer et al. 2026 Szenario 3 | Verdikt auf **„besetzt"** bzw. Abgabe der Idee einstellen; höchstens „Rest-Lücke: Betriebsdienst + Audit-Trail", und die ist `unklar`, nicht `frei` |
| Z. 29 | „Starre Abschaltungen kosten dagegen 2–20 % des Ertrags." | **Falsch zugeordnet.** 2–20 % gelten für Szenario 1 *und* 2; Szenario 2 ist bereits dynamisch-radarbasiert | Umformulieren: „Sowohl kalendarische Abschaltungen als auch eine naive Dichteschwelle kosten 2–20 %; erst die Kollisionen-pro-kWh-Regel drückt das auf 1,2 % bzw. 7,6 %." Und: benennen, dass diese Regel der Studie entstammt |
| Z. 60 | BP/MWh als eigene Erfindung | **Falsch.** Identisch mit Szenario 3 der zitierten Studie | Als Zitat kennzeichnen, DOI 10.1038/s41893-026-01853-4 nennen, Urheberschaft Bauer/Nussbaumer/Rojas Tito/Shamoun-Baranes/Farnsworth |
| Z. 15, 110, 449 („Bislang verlassen sich Windparks auf statische, kalendarische Abschaltungen") | Gegenüber UvA/ENRAM-Kreis | **Falsch gegenüber genau diesem Empfänger.** Er hat die dynamische Abschaltung seit Frühjahr 2023 im Betrieb (Borssele, Egmond aan Zee, Gemini) | Streichen oder auf „in Deutschland an Land" einschränken |
| Z. 68–74 „Erster Schritt" | Python-Ingestion + dockerisiertes vol2bird | **Fertig beim Empfänger.** getRad `get_pvol_de.R` zieht exakt diese Daten, `calculate_vp()` rechnet die Profile | Ticket neu schneiden: nicht Ingestion, sondern SCADA-Adapter, Audit-Trail und Genehmigungsfähigkeit nach § 44/§ 45b BNatSchG |
| Z. 84 | „RADBIRD … endete jedoch als Forschungsbericht ohne offene, schlüsselfertige Betriebssoftware" | **Unvollständig.** Fortsetzung läuft: BfN/BioConsult SH, FKZ 3523 15 1601, 12/2023–11/2025, ausdrücklich „bedarfsgerechte Turbinenabschaltungen" | Fortsetzung nennen; sie ist der plausiblere deutsche Empfänger |
| Z. 86 | „Aloft / bioRad: … kein einsatzbereites API-System für SCADA-Leitsysteme" | **Im Kern haltbar**, aber untertreibt: getRad liefert live (DWD letzte 3 Tage), und OPERA-Daten unterliegen einer *research-only*-Lizenz | Präzisieren; Lizenzfrage als eigenes „Wo es kippt" aufnehmen |
| Z. 87 | „Wer es schon versucht hat" nennt nur IdentiFlight | **Lücke.** Swiss Birdradar BirdScan MV1 kommuniziert automatisch mit der Windparksteuerung, ist bereits „legacy" und durch FaunaScan MV2 abgelöst | Aufnehmen — das ist der direkte Vorläufer, kein Nahbereichs-Kamerasystem |
| Z. 95–96, `deliveries.ts` 436/437, `dosen.ts` 174 | Empfänger „The ENRAM Coordination Team", Adresse `enram@biodiversitylab.eu` | **Adressat existiert nicht** (COST-Aktion 2013–2017, Website ist Archiv); **Adresse nicht belegbar** | Ersetzen durch `oscibio@inbo.be` bzw. die Personenadressen aus getRad — falls die Dose überhaupt verschickt wird |
| Z. 122 | „binden Sie ein vielversprechendes Hightech-Klima-KMU … ein und sichern Sie sich die EIC-Förderung" | **Bereits geschehen.** HiRAD: WSL + UvA + INBO + FMI + Agroscope, mit Swiss BirdRadar Solution AG als Partner, Biodiversa+-gefördert, WP5 = Stakeholder-Werkzeuge | Streichen. In dieser Form liest der Empfänger einen Rat, sein eigenes laufendes Projekt zu gründen |
| Z. 8, `dosen.ts` `recipientsDe` | „Prototype Fund Alumni" in derselben Empfängerzeile | **Unpassend.** PTF fördert nur Einzelpersonen/GbR mit deutscher Geschäftsführung; INBO/UvA/WSL sind ausgeschlossen | Trennen oder streichen |
| — | Fehlende Kalibrierquelle | Zentrale Fundkartei (LfU Brandenburg, seit 2002) und PROGRESS fehlen ganz | Als Validierungsdaten und als Antwort auf den Blackbox-Vorwurf aufnehmen |

---

## Empfehlung

Die Dose in dieser Form nicht versenden. Sie erklärt fünf Institutionen ihre eigene Arbeit, zitiert deren Studie als Beleg dafür, dass diese Arbeit noch fehlt, schlägt ihnen vor, ein Konsortium zu gründen, das sie bereits gebildet haben, und tut das unter einer Adresse, die nicht belegbar ist, an ein Gremium, das seit 2017 nicht mehr existiert.

Falls die verbliebene Rest-Lücke — Betriebsdienst, SCADA-Adapter, revisionssicherer Audit-Trail für deutsche Genehmigungsbehörden — weiterverfolgt werden soll, ist der Empfänger ein anderer: **BfN / BioConsult SH** (das Anschlussvorhaben endete 11/2025 mit einer Konzeptskizze) oder ein deutscher Windpark-Betreiberverband. Nicht ENRAM. Diese Rest-Lücke rechtfertigt allerdings nach dem Prüfprotokoll kein 🎁, sondern höchstens ein `unklar`.

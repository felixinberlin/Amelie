# Amélie — Quellen

Runde 2 hat gezeigt: Überlebende Ideen kommen aus Primärquellen, nicht aus Brainstorming.
Diese Liste sagt, **wo** gegraben wird, und hält fest, **was schon durchgegraben ist**.

**Status:** `offen` · `angekratzt` (eine Suche) · `durchsucht` (Publikationsliste gelesen) · `erschöpft`

---

## Typ A — Fachgremien mit Schemata ohne Software

*Muster: ein PDF mit Punktesystem, Checkliste oder Schwellenwerten, das Menschen von Hand anwenden.*

| Quelle | Wonach suchen | Status | Zuletzt |
|---|---|---|---|
| LAG Vogelschutzwarten (vogelschutzwarten.de) | weitere Bewertungsverfahren außer Glas | `durchsucht` | 18.09.2026 |
| LANA (Bund-Länder-AG Naturschutz) | Beschlüsse mit Bewertungsschemata | angekratzt — Eingriffsregelung/Biotopwertverfahren ist bereits gesetzlich kodifiziert (BKompV); **gegengecheckt in Runde 3:** Ökokonto-/Kompensationsflächen-Software (z. B. giscity) und BWKalk decken Berechnung und Flächenverwaltung, nicht die Zuordnung eines Biotoptyps aus Bild — siehe Biotoptyp-Assistent | 18.09.2026 |
| Bundesamt für Naturschutz (BfN) | Skripten, Leitfäden, Kartieranleitungen | angekratzt — BfN-Schriften 721 „Kartieranleitung für die Biotoptypen nach Anlage 2 der BKompV" gefunden (668 Biotoptypen, feste Schwellenwerte, Kartiermethodik von Hand). Daraus entstanden: Biotoptyp-Assistent (`05-dosen/biotoptyp-assistent.md`) | 18.09.2026 |
| Senatsverwaltung Berlin, Umwelt | Leitfäden (z. B. „Bauen mit Glas und Licht", 2021) · Abfallwirtschaftskonzept 2020–2030 · Re-Use Berlin Übersichtskarte (existiert nur als 2,8-MB-PDF!) | angekratzt — Re-Use Berlin als PDF gefunden; Zahlen zur Stadtreinigung 2025/2026 gesichert (200.000 Meldungen, 13 Mio. €) | 20.09.2026 |
| Denkmalbehörden, Landesämter | Schadenskartierungs-Anleitungen | `angekratzt` (Suchen von zwei Researchern am 19.09.2026, keine Leitfaden-Publikation gelesen) — Leitfäden existieren (Berlin LDA „Leitfaden zur Erstellung von restauratorischen Dokumentationen“, LAD Baden-Württemberg „Dokumentation im konstruktiven Holzbau“, Niedersachsen, Sachsen-Anhalt „Handreichung zur Bestandsuntersuchung“, LVR-Handreichungen, Baubegehungs-Checklisten, z. B. EKBO). **Typ A ist hier kein Schema ohne Software:** Schadenskartierung ist Software-Branche (Metigo MAP, KALIV); Denkmal/Kirche ist „physisches Objekt + wiederkehrende Prüfung“ mit Anbietern (ARCHIKART) und KI-Pilotprojekten (Wiro Rostock). Erträge: Researcher #2 — Denkmal-Verlaufsblick (`verengt`, kam von der Ehrenamts-/Bürgerseite, also eher Typ B); Researcher #1 — 3 Ideen abgeleitet, 0 überlebt (Kirchen-Baubegehung `besetzt`, Schadenskartierung per Foto `besetzt`, Orgel-Resonanz `unklar`). Nicht weiter hier graben; Restwert nur Orgel (Orgelbauer-Kontakt) | 19.09.2026 |
| Landesumweltbehörden „Licht & Naturschutz" (Hamburg BUKEA u. a.) | weitere Länder-Leitfäden ohne Tool (analog zu Hamburg) | angekratzt — **ergiebig, Lichtplan-Check entstand hieraus** | 18.09.2026 |
| Berliner Biotopkartierung — Kartieranleitung & Geländekartierungsbogen (Senatsverwaltung für Umwelt, Verkehr und Klimaschutz; § 30 BNatSchG) | weitere Kriterienbündel, die sich in „hart messbar" und „Urteil des Kartierers" trennen lassen | angekratzt — **ergiebig, Anker von drei Kandidaten** (Eichflächen-Trainer `frei`, Kartierlotse `verengt`, Strukturmonitoring `verengt`, nicht gepackt). als Anker der Bisoziation-Session (Runde 3) genannt, Quelle nicht separat durchgesehen; Nachbarquellen (andere Länder, LRT-Anleitungen) offen | 18.09.2026 |
| FLL-Baumkontrollrichtlinie / kommunale Baumkontrolle (Regelkontrolle, VTA) | — | **erschöpft, Anker dicht** — beide Kandidaten (Baum-Stigmergie, Baum-Verfallsdatum) `besetzt`; kein dritter Kandidat aus dieser Quelle. Muster „physisches Objekt + gesetzliche Sichtprüfung" nur nach Atlas-Check nutzen (Playbook, Atlas) | 18.09.2026 |

**Suchstring:** `<Gremium> Bewertungsverfahren Punktesystem` · `<Gremium> Kartieranleitung` · `<Gremium> Checkliste Vollzug`

---

## Typ B — Citizen Science mit manueller Auswertung

*Muster: Ehrenamtliche liefern Fotos oder Daten, Profis werten monatelang von Hand aus.*

| Quelle | Wonach suchen | Status | Zuletzt |
|---|---|---|---|
| mitforschen.org (Plattform aller deutschen CS-Projekte; Wissenschaft im Dialog, Museum für Naturkunde, BMFTR) | Projekte mit Foto-Upload und Rückmeldung „nach Auswertung" | **offen, bleibt als Quelle** (Entscheidung Félix 23.09.2026). Kein Empfänger, sondern Verzeichnis zum Durchsuchen. Der Vermerk „als Nächstes" ist gestrichen — sie wird genommen, wenn eine Runde eine Typ-B-Quelle braucht, nicht als Schuld. Seite läuft über HTTPS (kanonische URL `https://www.mitforschen.org/`); aus der Sandbox nur per WebFetch erreichbar, `curl` blockt die Allowlist | 23.09.2026 |
| AMS/IMO-Feuerkugelmeldung + deutsche Feuerkugelnetz-Nachfolger (Zeugenmeldeformulare) | Zeugen melden Stunden bis Tage später aus dem Gedächtnis, Profis triangulieren asynchron — „nicht in Echtzeit" (AMS) | angekratzt — **ergiebig, Feuerkugel-Sofortnetz entstand hieraus**; zwei weitere Kandidaten dort `besetzt` (FRIPON, RedVox). Weitere Feuerkugel-/Meteor-Meldenetze ungelesen | 18.09.2026 |
| Deutsche Stiftung Denkmalschutz (Schwarzbuch, Meldeportal, ehrenamtliche Beiräte) | Ehrenamts-Beobachtung mit rückblickender Auswertung | angekratzt (Suchtreffer, Portal nicht gelesen) — Idee: Denkmal-Verlaufsblick | 19.09.2026 |
| Thünen Wildbienen-Monitoring | Hummel-Monitoring zusätzlich zur Nisthilfe | angekratzt | 16.09.2026 |
| CompGen (genealogy.net) | andere Erfassungsprojekte außer Grabsteine (Adressbücher, Verlustlisten) | angekratzt | 16.09.2026 |
| Naturkundemuseum Berlin, Citizen-Science-Bereich | Projekte mit Engpass | offen | – |

**Suchstring:** `<Projekt> Auswertung dauert` · `<Projekt> Rückmeldung Monate` · `<Projekt> Werkstattbericht KI`

---

| **NABU Vogelschlagmelder (Jena, Leipzig, Berlin)** *(neu, 22.09.2026)* | Seit **Februar/März 2026** live, `vogelschlagmelder.de` und `berlin.vogelschlagmelder.de`. Meldung mit **bis zu fünf Fotos**, Anprallspur und Größe, **Fassadenausrichtung**, Geokodierung, Artangabe. **Gefahrenkarte = Heatmap der Meldungen, keine Bewertung.** Quellcode **GPLv3, `codeberg.org/nabu-jena/Vogelschlagmelder`** (Python, Docker, OpenAPI, 159 Commits, aktiv 09/2026, selbst hostbar), Maintainer Maximilian Schätz. Berliner Kontakt: Julia Lorenz, Helen Friedlein, `artenschutz_am_gebaeude@nabu-berlin.de` — sie nutzen die Daten für die Ansprache von Eigentümern und Behörden. **Muster: die Ehrenamtsplattform, die genau die Rohdaten sammelt, die eine Bewertungsschicht braucht.** | **neu, durchsucht — Empfänger** | 22.09.2026 |
| **Untersuchung zum Vogelschlag an Glas in München** *(neu, 22.09.2026)* | Wölfl & Bornemann (LBV) mit LfU Bayern, 2021. Neun Komplexe, **1.957 m Fassade**, 13 Wochen. Markierte Lärmschutzwände **0** auf 93 m, unmarkierte Glaswände **0,41/m**, Fassaden **0,02/m**; drei Glaswände ~46 Kollisionen je 100 m in drei Monaten. Nennt die LAG-VSW-Schwellen im Klartext (**2 normal, ab 5 signifikant erhöht je 100 m und Jahr**) und stuft die Objekte von Hand in Priorität 1/2 ein. **Doppelt wertvoll: Munition und fertige Testfälle.** | **neu, durchsucht** | 22.09.2026 |

## Typ C — Organisationen mit öffentlichen KI-Versuchen

*Muster: ein Blogpost „Kann KI uns helfen?" mit benannten Schwächen. Die Schwäche ist die Idee.*

| Quelle | Benannte Schwäche | Status | Zuletzt |
|---|---|---|---|
| CompGen Grabstein-Projekt | Halluzination bei Verwitterung → Streiflicht | durchsucht | 16.09.2026 |
| Repair Café International | noch nicht gelesen, ob Schwächen genannt | angekratzt | 16.09.2026 |
| Sozialhelden / HIIG | Datensatz 2023; Grenzen im Datensatz-Paper? | angekratzt | 16.09.2026 |
| CityLAB Berlin Blog & Sommerkonferenz | Themen: BärGPT, Beyond Forms, Kiezlabor, Beteiligung, Open Source; Kreislaufwirtschaft fehlt | durchsucht | 20.09.2026 |

---

## Typ D — Geldgeber und Bauaufträge (für Schritt 2, nicht für Ideen)

| Quelle | Zweck | Status |
|---|---|---|
| Prototype Fund | Fristen, Zuschnitt · **Korrektur 20.09.2026:** Nur Freiberufler:innen/Selbstständige oder GbR (≤ 4 Personen) förderfähig. Keine Stiftungen, Behörden oder Vereine. Vor jedem Hinweis Status auf `bewerben.prototypefund.de` prüfen! | aktiv geprüft (20.09.2026) |
| CityLAB Berlin | Empfänger Rang 1 (Bauträger, GovTech TestLAB, Kiezlabor) | bekannt & geprüft (20.09.2026) |
| Re-Use Berlin / Zero-Waste-Agentur (SenUVK) | Domänenpartner Kreislaufwirtschaft | angekratzt (20.09.2026) |
| BSR (Berliner Stadtreinigung) | Kieztage 2026 (~80 Termine, alle Bezirke) als Kaltstart-Bühne; NochMall | angekratzt (20.09.2026) |
| Open Repair Alliance | Datenquelle | angekratzt |

---


## Typ E — Behördliche Mengen- und Kostenstatistiken (neu, Runde 4)

*Muster: Eine Zahl, die den Schmerz quantifiziert, gehört in jede Dose, die an eine Verwaltung oder Stiftung geht.*

| Quelle | Zahlen & Belege | Zweck / Dose | Zuletzt |
|---|---|---|---|
| Berliner Stadtreinigung (BSR) / Berliner Zeitung (22.03.2026) / EUWID (08/2025) | 2025 fast 200.000 Meldungen illegaler Ablagerungen (>500/Tag); Beseitigungskosten >13 Mio. € (2024: 10,3 Mio. €); 54.000 m³ (2024, +8 %). Typisch: Möbel, Kühlschränke, Matratzen. | Sperrmüll-Radar v2 (`05-dosen/sperrmuell-radar.md`), Mail 2 an CityLAB | 20.09.2026 |

---

## Nachtrag 19.09.2026 — Anker aus dem Gemini-Lauf (Quelle genannt, **nicht gelesen**)

Der Lauf nennt diese Anker in `amelie-bisoziation-log.md`. Sie sind hier vermerkt, damit niemand sie für durchgegraben hält: Status `offen`, bis jemand die Quelle selbst geöffnet hat. Ein Kandidat daraus ist noch keine Prüfung der Quelle.

| Quelle | Typ | Wofür genannt | Status |
|---|---|---|---|
| LANA/BfN Kartieranleitung LRT 6120 (Trockenrasen) | A | Trockenrasen-Transekte; Überschneidung mit Kartierlotse klären | offen (BfN-Zeile oben ist wegen Schrift 721 `angekratzt`, LRT-6120-Anleitung selbst ungelesen) |
| NABU-Batcorder-Monitoring Gewässer | B | Fledermaus-Echo-Entwirrer | offen |
| Thünen MonViA, Hummel-Nistkasten | B | Hummel-Schleusenwächter | angekratzt (Nisthilfe-Foto-Auswertung Runde 2; Hummel-Strang wie in Zeile oben vermerkt) |
| Stiftung Denkmalschutz / BDO, Orgelpfeifen-Bleifraß | A/Denkmal | Orgelpfeifen-Resonanz | angekratzt 19.09.2026 — HfK-Bremen/DBU-Projekt, IDW-Meldung, CORDIS COLLAPSE gelesen; Handbuch Orgelkorrosion 2019 (PDF) nicht lesbar; Idee `unklar` |
| DWD Waldbrandgefahrenindex / Landesforst | A | Waldbrand-Streu-Knistern | offen |
| DWD Phänologischer Kalender | B | Knospen-Countdown | offen |
| Tafel Deutschland e. V. | B/Empfänger | Tafel-Frische-Triage | **Achtung:** laufendes BMEL-Projekt „Tafel macht Zukunft" — zuerst dessen Umfang lesen |
| WSA/WRRL Gewässerökologie | A | Totholz-Kolk-Peiler | offen |
| Berliner Leitfaden „Bauen mit Glas und Licht" (2021) | A | Licht-Glocken-Kataster | offen (Senatsverwaltung-Zeile oben; als Anker genannt, Leitfaden nicht gelesen) |

---

## Typ F — Internationale Phänologie-/Beobachtungsplattformen (neu, Runde 6)

*Muster: Werkzeuge, die über ihre **Funktion** definiert sind („dieselbe Pflanze über Zeit"), nicht über ihren Gegenstand. Sie tauchen bei deutschen Themensuchen nie auf und killen trotzdem Ideen.*

| Quelle | Was dort steht | Status | Zuletzt |
|---|---|---|---|
| GrowApp / GLOBE European Phenology Campaign (`growapp.today`, `globe.gov`) | Wiederholungsfoto derselben Einzelpflanze, voriges Bild transparent zum Ausrichten, automatischer Zeitraffer ab Bild 2; GLOBE Niederlande, Update Frühjahr 2024 | angekratzt — **ergiebig, hat Crack Flora Watcher gekippt**; Länderliste, Datenexport und Nutzerzahlen ungelesen | 21.09.2026 |
| USA National Phenology Network / Nature's Notebook (`usanpn.org`) | Einzelpflanzen mit Spitznamen registrieren, im Feld markieren, wiederholt besuchen; kuratierte Artenliste; neue App Frühjahr 2026 mit „leveled approach to monitoring" | angekratzt (FAQ gelesen) — Artenliste nicht durchgesehen, Ritzenunkraut unklar | 21.09.2026 |
| Flora Incognita, Projektseite Krautschau (`floraincognita.de/krautschau/`) | Eigenes Krautschau-Projekt in der App, Abzeichen 40 Arten / fünf Stufen, „Flora-Routine" mit Geozone und Auto-Tagging | `durchsucht` (Seite gelesen) — **Achtung: war in der Dose als nachrangiger Empfänger geführt und ist zugleich Konkurrenz** | 21.09.2026 |
| Senckenberg #Krautschau (`senckenberg.de/de/krautschau/`) | Aktionszeitraum 2026 09.05.–10.06. (85 Spaziergänge, 66 Städte), 2027 14.–23.05.; Koordination Julia Krohmer + Alexandra-Maria Klein (Uni Freiburg); empfiehlt Flora Incognita und ObsIdentify | `durchsucht` (Seite gelesen) | 21.09.2026 |
| USA-NPN *Local Phenology Program Guide* (PDF, `usanpn.org/files/education/2018-0621-localphenologyprogram_guide_final_1.pdf`) | Personalwechsel als Organisationsaufgabe: Nachfolge dokumentieren, zweite Person als Admin, **Gruppen-Eigentümerschaft per „Manage Users" übertragen — „before you depart"** | `durchsucht` (PDF gelesen) — **ergiebig:** hat die Restlücke der neuen Dose präzisiert. Die Projektseite allein hätte den Befund nicht geliefert | 21.09.2026 |
| **Quellcode des Empfängers** — `github.com/technologiestiftung/giessdenkiez-de` (Klon 21.09.2026) | `adoptTree`/`unadoptTree`/`refreshIsTreeAdoptedByOthers`, sonst nichts; null Treffer für Ablauf/Inaktivität/Übertragung; Adoption nicht exklusiv; Oberflächentext „lässt Du Deine Nachbarschaft wissen, dass für diese Bäume gesorgt wird" | `durchsucht` (Volltext) — Issues/Discussions **nicht** lesbar (API gesperrt, robots.txt), vor Zustellung von Hand nachsehen | 21.09.2026 |
| CityLAB Gieß den Kiez (`citylab-berlin.org/en/projects/giess-den-kiez/`) | Baum adoptieren, Gießmenge protokollieren, Patenbäume im Profil; 885.825 Bäume, quelloffen mit Fork-Wiki, seit 2020 laufend | angekratzt (Projektseite gelesen) — zu Exklusivität/Inaktivität/Übertragung sagt die Seite nichts; ggf. Repo/Issues lesen | 21.09.2026 |

---

## Typ G — Spiele mit Wissenschaftsanspruch (neu, Runde 6, Spiel-Strang)

*Muster: Das Feld hat Konferenzen, und deren Programme sind Adressbücher. „Ein Indie-Entwickler" ist keine Adresse.*

| Quelle | Was dort steht | Status | Zuletzt |
|---|---|---|---|
| ECSA 2026, Workshop W16 „Games for good: Games and gamification for Citizen Science" (Oulu, 03.03.2026) | Convenors: Liz Dowthwaite + Nimisha Parashar (Univ. Nottingham), **Jesse Himmelstein (Play Curious)**, **Attila Szantner (MMOS)**; Beiträge: Forschung, Spiel-Demos, Projektvorstellungen | `durchsucht` — **Termin vorbei**, also kein Zustellziel, aber der Adressbestand des Felds. Nächstes Fenster ECSA 2027 | 21.09.2026 |
| MMOS / Project Discovery (`mmos.ch`) | Echte Forschungsaufgaben in bestehende Spiele eingebettet (EVE Online), hunderttausende Spieler, *Nature Biotechnology* 2024, GDC-Talk | angekratzt (Suchtreffer) — **umgekehrtes Modell**, Wissenschaft ins Spiel statt Spiel um Weltstück | 21.09.2026 |
| The Plant Game / Pl@ntNet (`theplantgame.com`, `docs.plantnet.org`) | Drei Modi inkl. **Duell** gegen Freunde oder Zufallsgegner, adaptive Schwierigkeit | angekratzt — Doku nennt **keine Duellregeln, keine Spielerzahlen, kein Datum**; Aktivitätsstand vor Zustellung prüfen | 21.09.2026 |
| Stray Fawn Studio / Publishing (`strayfawnstudio.com`) | Publishing seit 03/2023, Fokus Strategie/Simulation/City-Building, „pitch deck and trailer" an `pitch@strayfawnstudio.com` | `durchsucht` — **kein Empfänger, Verkaufskanal**; als Vorarbeit führen (*Niche*) | 21.09.2026 |
| Scientific Game Jam (itch.io), Green Game Jam (Playing for the Planet) | Jams, die Forschung und Spielentwicklung paaren | offen — als Community-Weg für Ideen **mit** Skelett | – |

---

## Typ H — Regulierung im Ausland (neu, Runde 7)

*Muster: Ein deutsches Gremium veröffentlicht ein PDF. Ein anderes Land macht dieselbe Sache zur Auflage — und dort existiert dann ein Rechenblatt, eine Norm oder eine App.*
**Kein Ideenlieferant, sondern die Stelle, an der ein `frei` stirbt. Vor jedem `frei` aus Typ A abzufragen.**

| Quelle | Befund | Status | Zuletzt |
|---|---|---|---|
| **LEED Pilot Credits (USGBC)** | SSpc55 „Bird Collision Deterrence": `(Zone 1 + Zone 2 gewichtete Fläche) / bereinigte Fassadenfläche = Bird Collision Threat Rating`, Ziel ≤ 15, Zone 1 = erste 36 Fuß über Grund (+ 12 Fuß über Gründach), verglaste Ecken und Durchflüge ≤ 25, Nachweis über **offizielle Tabellenvorlage**. Gewichte = **Material Threat Factors** aus Flugtunneltests. **Die gesamte Pilot-Credit-Bibliothek ist ein Katalog solcher Verfahren** — für andere Themen ungehoben. | durchsucht (Vogelschlag), **sehr ergiebig für andere Themen** | 21.09.2026 |
| **American Bird Conservancy** | Material Threat Factors, „Bird-friendly Building Design", LEED-Innovation-Credit — die Datenbasis hinter dem Rechner | angekratzt | 21.09.2026 |
| **Kommunale Ordnungen USA (NYC Local Law 15/2020 u. a.)** | Bird-friendly-Materials-Pflicht seit 10.01.2021; bedient von Beratungsbüros und Materiallisten, **keine Compliance-Software gefunden** | angekratzt | 21.09.2026 |
| **FLAP Canada** | **BirdSafe DIY Building Risk Assessment App** (`flapapp.ca`): kostenlos, Browser, Tag- und Nachtrisiko pro Fassade, **Fragebogen ohne Bildauswertung**; dazu kostenpflichtige BirdSafe-Begutachtung mit Ortsterminen und „An Analysis of Collision Mitigation Effectiveness" | durchsucht | 21.09.2026 |
| **Schweiz: Zürcher PBG-Ergänzung zu Glasfassaden** | Planungs- und Baugesetz um Vogelschutz an transparenten Fassaden ergänzt — eigene Rechtslage, eigener Markt | offen | 21.09.2026 |

| **LEED v5 (USGBC/CAGBC), Stand 24.04.2026** *(neu, 22.09.2026)* | Vogelschlag jetzt in zwei Credits (BD+C SS 1 Option 2, O+M SS 2 Option 2), verlangt **Threat Factor ≤ 30** nach ABC-Skala; **CSA A460:19 (R2024)** als kanadischer Alternativweg anerkannt (RACP15, Abschnitte 3.2 und 3.3). Toronto seit 2010, NYC Local Law 15 seit 10.01.2021. **Die Zertifizierungsseite verdichtet sich jährlich — deutsche Seite bleibt PDF.** | **neu, durchsucht** | 03/2027 |
| **ONR 191040 / Flugtunnel Hohenau-Ringelsdorf** *(neu, 22.09.2026)* | Österreichische Prüfnorm: Eine Markierung gilt als Vogelschutzglas, wenn **mindestens 90 % der Vögel die markierte Scheibe meiden**. Tunnel seit 2010, geleitet von Martin Rössler; die Wiener Umweltanwaltschaft veröffentlicht die Rangliste geprüfter Muster. **Die Produktwirksamkeit ist damit normiert und öffentlich — als Ideenfeld geschlossen.** | **neu, durchsucht** | 03/2027 |

**Suchstring:** `<Thema> LEED credit` · `<Thema> city ordinance compliance` · `<Thema> standard rating calculator` · `<Thema> threat factor` · `<Thema> DIY assessment app`

---

## Typ I — Messverfahren aus Nachbarbranchen und harte Evidenz (neu, 22.09.2026)

*Muster: Die Messung, an der eine Naturschutzidee hängt, ist in einer ganz anderen Branche längst gelöst und publiziert — und daneben liegt die Studie, die sagt, wie viel Präzision die Sache überhaupt trägt. Beides vor dem Bauen lesen, nicht danach.*

| Quelle | Befund | Status | Zuletzt |
|---|---|---|---|
| **Improving flood detection with large-scale dashboard camera data** *(neu, 25.09.2026)* | Franchi et al., *Nat Commun* 2026: Dashcams for flood detection. **Die Forschung nutzt passive Kamera-Daten, aber die Sicherung durch Anwohner fehlt.** | **neu, durchsucht** | 25.09.2026 |
| **Fenster-Wand-Verhältnis aus Straßenbildern** *(neu, 22.09.2026)* | Suppa, Aliberti, Bottero & Corrado, *Building Simulation* 18(8), 2025: YOLOv9 auf Google Street View, **94 % der Fassaden innerhalb ±5 Prozentpunkten** der Handmessung, 100 % innerhalb ±10, Workflow offen (Turin). Dazu Applied Energy 2026 zur urbanen WWR-Schätzung, DLR zur direkten WWR-Vorhersage, Concordia über Google-3D-Kacheln, Fassadenparsing mit SOLOv2. **Die Gebäudeenergie-Branche hat die Messung gelöst, auf die der Naturschutz wartet.** | **neu, durchsucht** | 22.09.2026 |
| **Li u. a., *Biological Conservation* 310 (2025)** *(neu, 22.09.2026)* | Nationale Citizen-Science-Erhebung China 2021–2023: **3.078 Gebäude, 65.633 Erfassungstage, 676 Arten.** Vegetation wirkt am stärksten auf **1.000 m (Frühjahr) und 10 km (Herbst)**; **Bäume innerhalb 5 m senkten das Herbstrisiko**; niedrigere Gebäude mit hohem Glasanteil gefährlicher. **Steht quer zur Nahbereichs-Spiegelungslogik der deutschen Merkblätter** — gehört in jedes „Wo es kippt" zu diesem Thema. | **neu, durchsucht** | 03/2027 |

**Suchstring:** `<Messgröße> from street view imagery deep learning` · `<Messgröße> urban scale estimation` · `<Phänomen> national citizen science dataset collisions`

## Typ J — Gebührenwerke und Tarife (neu, Runde 8; ursprünglich als „Typ H" committet — H und I waren seit Runde 7 vergeben)

*Muster: eine Preisliste, die von Hand angewandt wird und dabei Anreize setzt. Ein Typ-A-Dokument, nur dass es nicht bewertet, sondern belohnt und bestraft. Nebeneinandergelegt zeigt die Leiter oft, dass der erwünschte Weg der teuerste und der schädliche der kostenlose ist.*

| Quelle | Befund | Status | Zuletzt |
|---|---|---|---|
| **BSR-Gebühren / Sperrmüllbuchung** | 100 € bis 5 m³ (6–15 Werktage) · 96 € Express (≤ 2 m³, 5 Tage) · 50 € ab Tag 16 · Recyclinghof 3 m³ frei, **aber nur mit Auto** · NochMall-Abholservice kostenpflichtig · Straße 0 € und sofort. Ergab die Dose Sperrmüll-Weiche | durchsucht | 23.09.2026 |
| Parkraumbewirtschaftung, Pfandsysteme, Anschluss- und Benutzungsgebühren | noch nicht angesehen — dieselbe Bewegung („Preisleiter steht falsch herum") vermutlich übertragbar | **offen, als Nächstes** | – |

**Suchstring:** `<Betrieb> Gebühren Entgelte Preisliste <Jahr>` · `<Leistung> kostenpflichtig kostenlos Voraussetzung`

---

## Typ K — Amtliche Potenzialstudien (neu, Runde 8; ursprünglich als „Typ I" committet)

*Muster: eine Behörde lässt untersuchen, wo in einem Stoffstrom noch etwas zu holen wäre, und der Bericht sagt selbst, welcher Weg sich nicht lohnt. Der verworfene Weg ist meist der, den die Branche gerade optimiert.*

| Quelle | Befund | Status | Zuletzt |
|---|---|---|---|
| **UBA 2022, Nutzung von Abfallströmen** | Sperrmüll 2017: 2.355.300 t, ~30 % Polstermöbel/Matratzen/Teppiche, 40 % Sortieranlage, 34 % thermisch. Befund: Entlastung kommt aus **Abfallberatung, getrennter Sammlung und Wiederverwendung** — nicht aus besserer Sortiertechnik | durchsucht (Zusammenfassung gelesen, Originalbericht nicht) | 23.09.2026 |
| Weitere UBA-/BMUV-Potenzialstudien zu anderen Stoffströmen | offen | offen | – |

**Suchstring:** `<Stoffstrom> Potenzial Studie Umweltbundesamt ausgeschöpft` · `<Stoffstrom> Wiederverwendung Quote Anteil verwertbar`

---

## Typ L — Fachliche Referenzsammlungen (neu, 23.09.2026)

*Muster: Eine Fachgesellschaft sammelt über Jahre echte Fälle mit dokumentierter Ursache — als Nachschlagewerk. Dieselbe Sammlung ist das Material, das jedem Übungsgerät fehlt.*

| Quelle | Befund | Status | Zuletzt |
|---|---|---|---|
| **FractoDB + FractoGraphics** (AG Fraktographie von DGM/DVM an der BAM, seit 2013) | Tausende reale Bruchflächenbilder aus Schadensfällen und Vergleichsuntersuchungen, kostenlos auf Anfrage (`fraktographie@bam.de`), Symbolsprache für Befunde; Kurs „Fraktographie metallischer Werkstoffe" 03/2027 Berlin, Arbeitskreis 20.11.2026 Berlin. **Referenzsammlung, die niemand als Übungsmaterial nutzt** — Empfänger der Dose Bruchlesen | durchsucht (Seiten gelesen) | 23.09.2026 |

**Suchstring:** `<Fach> Datenbank Referenz Schadensfälle` · `<Fach> Arbeitskreis Schulung` — **auf Deutsch zuerst**, wenn eine deutsche Institution das Feld trägt

---

## Empfänger, in Runde 8 geprüft

| Empfänger | Befund | Status |
|---|---|---|
| **BSR** | Besitzt **beide Enden** der Sperrmüll-Weiche: kostenpflichtige Sperrmüllabholung und NochMall mit eigenem Abholservice (Formular, Fotoupload, Etage, verbindliches Angebot in 48 h). Keine Verbindung zwischen beiden. Rang 1 für alles Entsorgungsnahe | neu, 23.09.2026 |
| **CityLAB Berlin** | **Gesperrt bis auf Weiteres.** Mail 2 ging am 20.09.2026 dorthin, Mail 4 (Patenschaft) liegt bewusst zurück. Eine dritte Sendung an dieselbe Adresse wäre Nachfassen — Manifestregel | – |
| Somerset Council × British Heart Foundation (UK) | Kein Empfänger, sondern **Vorbild mit benannter Schwäche** (Triage erst im Depot nach der Abholung) | 23.09.2026 |

---

## Nicht mehr als Quelle nutzen

- Allgemeine Suchen „KI App <Alltagsthema>" → Content-Farmen, besetzte Märkte (siehe Besetzungsatlas im Playbook).
- Eigenes Brainstorming ohne Quelle → Trefferquote Runde 2: 0 von 10 `frei`; die eine Ausnahme (Bebauungsplan-Leser, nach Recheck 19.09.2026 `verengt`) hat dünne Evidenz und wäre ohne Organisationsnamen-Suche nicht über `unklar` hinausgekommen.
- Typ-A-Anker „physisches Objekt + wiederkehrende gesetzliche Sichtprüfung" (Bäume, Spielplätze, Aufzüge, Feuerlöscher, Brücken) → erst gegen den Atlas halten, nicht zwei Kandidaten aus derselben Quelle prüfen (Runde 3, Baumkontrolle).
- **Nur deutschsprachige Suchen bei Alltagsideen** → Runde 4: Sperrmüll-Radar war nur auf Deutsch frei; auf Englisch existierte CurbAlert bereits viermal. Vor jeder Zusage englische Suche Pflicht. **Runde 6 bestätigt zum dritten Mal:** Crack Flora Watcher war deutsch `verengt`, englisch `besetzt` (GrowApp, Nature's Notebook).
- **Die Projektseite für den Funktionsumfang halten**, wenn der Empfänger quelloffen ist → Runde 6: Die Seite von Gieß den Kiez sagt zu Verfall und Übertragung nichts, der Klon sagt es eindeutig. Bei öffentlichem Repo ist `git clone` + `grep` die stärkere Evidenz und kostet zwei Minuten (GitHub-API und Issue-Seiten können gesperrt sein, `git clone` über HTTPS geht trotzdem).
- **Nur nach dem Gegenstand suchen** („Ritzenpflanzen-App") → findet nie die Werkzeuge, die über ihre **Funktion** definiert sind (Typ F oben). Die Mechanik immer separat suchen, siehe Playbook §2.
- **Typ A allein als Beleg für `frei`** (neu ab Runde 7): „Ein Fachgremium hat ein PDF und niemand hat es programmiert" ist ein Anfangsverdacht, kein Urteil. Ohne Typ-H-Gegenprobe wird daraus kein `frei`.
- **Merkblätter als Quelle für exakte Schwellenwerte** (neu ab Runde 7): vier Behördenmerkblätter zum selben Schema, zwei verschiedene Signifikanzschwellen. Schemawerte kommen aus dem Schema.

- **Eine Idee nur auf der Angebotsseite denken** (neu ab Runde 8): Die Nachfrageseite in Verschenk-Communities („Wanted", WANTED, ISO) ist Standardfunktion bei Olio, Freecycle/Trash Nothing und Buy Nothing. Wer „aber die Wunschliste fehlt doch" denkt, hat die Hilfeseiten nicht gelesen.

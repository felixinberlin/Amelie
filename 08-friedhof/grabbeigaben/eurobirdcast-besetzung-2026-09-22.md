# Besetzungsprüfung: EuroBirdCast / BP-MWh-Index

**Dose:** `05-dosen/eurobirdcast.md` · **Prüfer:** Rechercheur #2 · **Datum:** 22. September 2026
**Prüfrichtung:** Englisch zuerst (NL/EN/US), Deutsch nachrangig.

**Gesamturteil: `verengt` — und zwar auf einen sehr dünnen Rest.**
Die Dosenbehauptung *„verifiziert neuartig"* ist nicht haltbar und muss gestrichen werden.

---

## Strang 1 — Niederlande: Start/Stop (der gefährlichste Strang)

### Befund: gesetzlich verpflichtend, seit 2023 operativ, mit eigener Software

Die niederländische **Start/Stop-Prozedur** ist keine Studie, sondern geltendes Recht
und laufender Betrieb.

- **Rechtspflicht:** „De Start/Stop-procedure is verplicht voor alle Nederlandse
  windparken waarvoor een kavelbesluit geldt." Windparks der 1. und 2. Generation
  treten ab 2026 freiwillig, ab 2027 (OWEZ) bzw. 2028 (Prinses Amalia) verpflichtend bei.
  *(Quelle: Rijkswaterstaat, „Start/Stop terugblik 2025 en vooruitblik",
  https://noordzeeloket.nl/publish/pages/247200/terug-en-vooruitblik-start-stop.pdf — **[Seite gelesen]**)*
- **Betrieb:** Erste Abschaltung international am 13. Mai 2023 (Borssele, Egmond aan Zee,
  4 Stunden). Herbst 2023: drei Abschaltungen (8., 16., 31. Oktober), Rotordrehzahl auf
  max. 2 U/min reduziert. Frühjahr 2025: keine Abschaltung. Herbst 2025: **sechs
  Abschaltereignisse, zusammen 36 Stunden.**
  *(Quellen: Rijksoverheid-Pressemitteilung 13.12.2023,
  https://www.rijksoverheid.nl/actueel/nieuws/2023/12/13/windparken-op-de-noordzee-dit-najaar-3-keer-stilgezet-voor-veilige-vogeltrek — **[Seite gelesen]**;
  terugblik 2025 s. o. — **[Seite gelesen]**)*
- **Eigene Betriebssoftware:** Die Abschaltentscheidung läuft über die Anwendung
  **EVAS**, inzwischen auf Rijkswaterstaat-Infrastruktur gehostet. Es gibt automatisierte
  Nachsaison-Berichte (in Arbeit für 2026) und veröffentlichte „Rapportage Start/Stop"
  je Saison — faktisch der Audit-Trail, den die Dose als Alleinstellung reklamiert.
  *(Quelle: terugblik 2025 — **[Seite gelesen]**)*
- **Datengrundlage — hier liegt der einzige echte Unterschied:** Das Vorhersagemodell
  stammt von der **Universiteit van Amsterdam** (Bradarić 2022), ist ein **Random Forest**
  auf **ERA5-Reanalyse** (Training) und **ECMWF-Vorhersagen** (Betrieb, 2 Tage Vorlauf),
  17–23 Wettervariablen, trainiert auf **dediziertem horizontalem S-Band-Vogelradar**
  im Windpark Luchterduinen (2018–2023). Es nutzt **weder Wetterradar noch vol2bird noch
  ENRAM/Aloft.** Modell 2.0 ist seit 2025 im Betrieb; Version 2.1 wird Q2 2026 beauftragt
  und auf allen sechs horizontalen Vogelradaren der NL-Küste trainiert.
  *(Quellen: „Validation of the outcomes of the bird migration prediction model for
  spring 2024", Kraal/Middelveld/van Bemmelen/Gyimesi,
  https://www.noordzeeloket.nl/publish/pages/237736/validation-of-the-outcomes-of-the-bird-migration-prediction-model-for-spring-2024.pdf — **[Seite gelesen]**;
  terugblik 2025 — **[Seite gelesen]**)*
- **Schwelle:** gesetzliche Definition des Massenzugs 500 Vögel/km/h (MTR, Vertikalradar);
  Auslösewert Frühjahr 2024 lag bei 151 Vögel/km/h. Die feste 500er-Schwelle wurde
  inzwischen **aufgegeben**, eine neue Schwellenmethodik ist für 2026 in Arbeit.
  *(Quellen: Validierungsbericht Frühjahr 2024; terugblik 2025 — **[Seite gelesen]**)*
- **Selbst benannte Schwäche:** Technolution kommt im **Adviesrapport Machine Learning
  Model (2025)** für Rijkswaterstaat zum Schluss, „dat het model in de huidige vorm een
  lage betrouwbaarheid heeft": Das Modell sagt Ruhephasen gut vorher, **versagt aber
  genau bei den Zugspitzen**, auf die es ankommt. Ursache: nur ca. 33–50 Ereignisse über
  der 500-MTR-Schwelle, 95 % des Datensatzes sind Nicht-Spitzen, dazu Radarunsicherheit
  und Wetterprognosefehler. „Quick wins" seien unwahrscheinlich.
  *(Quelle: Kuijper/Dubbeldam/Roggekamp, Technolution 2025,
  https://noordzeeloket.nl/publish/pages/241050/adviesrapport-machine-learning-model.pdf — **[Seite gelesen]**)*
- **Kein Wechsel auf Wetterradar geplant:** Der Ausblick 2026 nennt ausschließlich
  Optimierung der Vogelradare, Vertikalradar-Prüfung, trektellen.nl-Abgleich und eine
  standardisierte MTR-Datenpipeline — **Wetterradar kommt nicht vor.**
  *(Quelle: terugblik 2025 — **[Seite gelesen]**)*

### Der BP/MWh-Index existiert dort bereits — unter anderem Namen

**Van Bemmelen, de Groeve & Potiek (Bureau Waardenburg, 21.10.2022), „Potential
curtailment regimes for offshore wind farms: exploring the relation between wind speed,
bird migration intensity and power yield"** berechnet explizit „Percentage of Collisions
Avoided" (PCA) gegen Ertragsverlust in MWh pro Turbine — das ist der BP/MWh-Index der
Sache nach. Zahlen (Luchterduinen 2019–2021):

| PCA | Ertragsverlust | Anteil Jahresertrag |
|---|---|---|
| 30 % | 11 MWh | 0,05 % |
| 50 % | 82 MWh | — |
| 70 % | 545 MWh | 1,65 % |
| 90 % | 2.294 MWh | 6,14 % |

Kernaussage: „curtailments during low wind speeds yield the largest gain in the
percentage of avoided bird collisions and the lowest loss in power yield" — also
windgeschwindigkeitsabhängige Schwellen statt einer Gesamtschwelle.
*(Quelle: https://noordzeeloket.nl/publish/pages/226851/potential-curtailment-regimes-for-offshore-wind-farms.pdf — **[Seite gelesen]**)*

**Teilurteil Strang 1: `besetzt`.** Das Konzept „dynamische, zugabhängige Abschaltung
statt Kalender, mit Ertragsabwägung und behördlichem Nachweis" ist in den Niederlanden
verpflichtendes Recht, operative Praxis und eigene Software. Offen bleibt allein die
**Datenquelle**: Wetterradar/vol2bird ist dort nicht im Einsatz und auch nicht geplant.

---

## Strang 2 — USA: BirdCast / NEXRAD

- **BirdCast hat kein Windkraft-Curtailment-Produkt.** Die Publikationsliste enthält zum
  Thema Windenergie nur Curley et al. (2025), „Differences between terrestrial and
  offshore bird migration: Implications for offshore wind energy", J. Appl. Ecol. 62(10).
  Keine Abschaltprotokolle, keine Ertragsverlustrechnung, keine operative API für
  Betreiber. Schwerpunkt bleibt Lights Out / Gebäude.
  *(Quelle: https://birdcast.org/science-center/publications/ — **[Seite gelesen]**)*
- **Cohen, Buler, Horton, Loss, Cabrera-Cruz, Smolinsky & Marra (2022), „Using weather
  radar to help minimize wind energy impacts on nocturnally migrating birds",
  Conservation Letters 15:e12887:** Nutzt Wetterradar für Standortwahl *und Betrieb*;
  über ein Drittel der Nachtzieher fliegt in Rotorhöhe, Konzentration bis 20 km von
  Seeufern — deutlich über den geltenden Leitlinien.
  *(Quelle: https://tethys.pnnl.gov/publications/using-weather-radar-help-minimize-wind-energy-impacts-nocturnally-migrating-birds — **[nur Suchschnipsel/Abstract-Seite]**; Volltext
  https://conbio.onlinelibrary.wiley.com/doi/full/10.1111/conl.12887 → **403, nicht gelesen**.
  Konkrete Prozentwerte Risiko vs. Energie konnten nicht belegt werden.)*
- **Begriffsfeld „dynamic aeroconservation"** ist etabliert: Van Doren et al.,
  „Near-term ecological forecasting for dynamic aeroconservation of migratory birds",
  Conservation Biology (2021); Bradarić et al., „Forecasting nocturnal bird migration for
  dynamic aeroconservation: the value of short-term datasets", J. Appl. Ecol. (2024),
  Daten offen auf Dryad/Zenodo.
  *(Quellen: https://conbio.onlinelibrary.wiley.com/doi/10.1111/cobi.13740,
  https://besjournals.onlinelibrary.wiley.com/doi/abs/10.1111/1365-2664.14651,
  https://zenodo.org/records/10884687 — **[nur Suchschnipsel]**)*

**Teilurteil Strang 2: `verengt`.** Das Konzept ist in den USA wissenschaftlich etabliert
und benannt, aber es existiert **kein** BirdCast-Curtailment-Produkt und kein
BP/MWh-artiger Index. Der Dosenname „EuroBirdCast" kollidiert zudem semantisch mit einer
starken US-Marke.

---

## Strang 3 — Kommerzielle Anbieter

- **Robin Radar Systems:** Verkauft ein „Wind Turbine Shutdown"-Plug-in mit
  SCADA-Schnittstelle, das einzelne Turbinen, Cluster oder ganze Parks abschaltet. Drei
  Algorithmusklassen, darunter ausdrücklich **„mass migration (uses radar density grids)"**
  und ein frei konfigurierbarer Entscheidungsbaum. Einführung in drei Phasen inkl.
  Shadow-Mode vor Scharfschaltung. Selbst benannte Schwäche: „depending on the density of
  birds present at the site, the alarm could be triggered frequently, resulting in a
  significant downtime" — Reichweite, Kleinvogeldetektion, Nachtzug und Preis werden
  **nicht** offengelegt.
  *(Quelle: https://www.robinradar.com/blog/guide-automatic-turbine-shutdown-at-wind-farms — **[Seite gelesen]**)*
- **Eneco Maasvlakte 2 (NL), 22 Turbinen:** „world's first dual automated
  Shutdown-on-Demand system with MAX", vollautomatisch, MAX-Radar sendet Echtzeitsignal
  direkt an SCADA, Tag und Nacht. Wirksamkeit wird erst noch gemessen; keine
  Energieverlust- oder Kostenzahlen genannt, kein Audit-Trail erwähnt.
  *(Quelle: https://www.robinradar.com/blog/eneco-leads-the-worlds-first-dual-automated-shutdown-on-demand-system-with-max, 17.03.2025 — **[Seite gelesen]**)*
- **Swiss Birdradar Solution, „BirdScan MV Collision Risk Assessment Algorithm":**
  Echtzeit-Curtailment auf Basis von MTR-Messungen, **individuelle MTR-Grenzwerte je
  Turbine**, Höhenintervalle, Flugrichtungsfilter, Anpassung nach Zeit, Sicht,
  Windgeschwindigkeit, Temperatur. Proprietär, keine Open-Source-Komponenten. Eine
  explizite Kosten-Nutzen-Abwägung Vogel gegen MWh wird **nicht** angeboten — nur
  „unnötige Abschaltungen vermeiden".
  *(Quelle: https://swiss-birdradar.com/birdscan-mv-collision-risk-assessment-algorithm/ — **[Seite gelesen]**)*
- **Gotthard-Windpark (CH), 5 Anlagen auf 2.106 m — der wichtigste Realitätstest:**
  Tettamanti, J. Environ. Manage. 401 (1.3.2026). BirdScan MV1 schaltet seit 2021
  turbinenspezifisch nach MTR-Schwellen ab, Tag und Nacht, seit 2023 ergänzt um eine
  Sichtsonde. Abschaltstunden: 2021/22 alle fünf Anlagen 40,5 h im Herbst, 318 h im
  Frühjahr; 2023/24 nur noch 0–5,9 h (Herbst) bzw. 28–96 h (Frühjahr) je Anlage.
  **Entscheidend: Trotz drastisch reduzierter Abschaltzeit blieb die Zahl der Kollisionen
  praktisch unverändert bei rund 190 geschätzten Todesfällen pro Jahr.**
  *(Quelle: https://sciencedirect.com/science/article/pii/S0301479726004391 — **[Seite gelesen]**)*
- **DTBird/DTBat, IdentiFlight, Bioseco:** optisch/akustisch, Einzelanlage, Großvögel bei
  Tag. Die Einschätzung der Dose hierzu ist korrekt.
  *(Quellen: https://www.dtbird.com/en/, https://www.identiflight.com/howitworks — **[nur Suchschnipsel]**)*

**Teilurteil Strang 3: `besetzt` für die Funktion, `verengt` für die Datenquelle.**
Automatische Abschaltung inkl. SCADA-Kopplung und Massenzug-Algorithmus ist heute ein
kaufbares Produkt. Grenze: dediziertes Hardware-Radar je Standort, proprietär, Preis
unveröffentlicht, kein offener Audit-Trail, keine Ökonomie-Schicht.
Der Gotthard-Befund ist eine ernste Warnung an die Wirkungsannahme der Dose.

---

## Strang 4 — Deutschland/Europa: Regulierung erzeugt Werkzeuge

Hier kippt die Dose in eine unerwartete Richtung.

- **Es gibt in Deutschland keine Abschaltpflicht für den Vogelzug.** § 45b BNatSchG und
  Anlage 1/2 regeln Zumutbarkeitsschwellen für Ertragsverluste ausschließlich für
  **kollisionsgefährdete Brutvogelarten** (Leitart Rotmilan) und **Fledermäuse** — nicht
  für ziehende Vögel. Schwellen: **8 %** Ertragsverlust an besonders windhöffigen
  Standorten (Standortgütefaktor ≥ 90 %), sonst **6 %**. Pauschalannahmen:
  Antikollisionssystem (AKS) **3 %**, Fledermausabschaltung **2,5 %**.
  *(Quelle: KNE, „Zumutbarkeit von Ertragsverlusten durch WEA-Abschaltungen in der
  Betriebsphase", https://www.naturschutz-energiewende.de/fragenundantworten/zumutbarkeit-von-ertragsverlusten-durch-wea-abschaltungen-in-der-betriebsphase/ — **[Seite gelesen]**)*
- **Die Analogie ProBat bestätigt die Amélie-Regel — und widerlegt zugleich die Dose:**
  Für Fledermäuse existiert die gesetzlich verankerte Pflicht, und dazu existiert seit
  Jahren das Rechenwerkzeug **ProBat** (BfN / Naturstiftung David, aktuell Version 7,
  probat.org). Regulierung hat dort tatsächlich ein Werkzeug erzeugt. Für den Vogelzug
  fehlt die Regulierung — und deshalb fehlt auch das Werkzeug. Die Lücke ist kein
  Versehen, sondern **die Abwesenheit einer Pflicht und damit eines Käufers.**
  *(Quellen: https://www.bfn.de/probat-tool-zum-schutz-von-fledermaeusen-windkraftanlagen,
  https://www.probat.org/ueber-probat — **[nur Suchschnipsel]**)*
- **AKS-Pflicht:** Antikollisionssysteme sind für Brutvögel geregelt; BfN führt eine
  Eignungsprüfung. Nachtzug/Breitfrontzug ist nicht Gegenstand.
  *(Quelle: https://www.bfn.de/voegel-und-antikollisionssysteme-aks — **[nur Suchschnipsel]**)*
- **RADBIRD (BfN-Ressortforschung, 1.11.2019–31.12.2021, Institut für Vogelforschung
  „Vogelwarte Helgoland"):** wertete Daten von **rund 20 überwiegend DWD-Wetterradaren**
  aus mit dem erklärten Ziel, den Vogelzug bundesweit zu erfassen, Gefahren in Echtzeit zu
  erkennen und **vogelzugabhängige Anlagenabschaltungen** zu ermöglichen. Das ist die
  Dosenidee, in Deutschland, vor fünf Jahren. Ob ein betriebsfähiges Werkzeug entstand,
  geht aus der Projektdatenbank nicht hervor; ein Nachfolgeprojekt wird nicht genannt.
  *(Quelle: https://www.natur-und-erneuerbare.de/projektdatenbank/radbird/ — **[Seite gelesen]**)*
  Verwandt, aber offshore: TRACKBIRD (FTZ Kiel), BIRDMOVE. **[nur Suchschnipsel]**

**Teilurteil Strang 4: `frei`, aber aus dem falschen Grund.** In Deutschland ist der
Raum unbesetzt, weil es keine Rechtspflicht zur zugabhängigen Abschaltung gibt. Nach der
Amélie-Regel ist das kein Freiraum, sondern ein fehlender Adressat.

---

## Strang 5 — Open Source und offene Daten

Hier liegt der Befund, der den ersten Schritt der Dose entwertet.

- **FlySafe-Dienst, August 2026 — einen Monat alt.** IBED/Universiteit van Amsterdam,
  Koninklijke Luchtmacht und KNMI betreiben ein Dashboard mit
  **5-Minuten-Echtzeitdaten zum Vogelzug** plus Mehrtagesprognose, gespeist aus den
  **Wetterradaren der Niederlande, Belgiens und Deutschlands**. Es ist
  „free-to-use to the whole community". Über das **KNMI Data Platform** sind
  „the bird profiles and migration maps" öffentlich verfügbar, das Platform hat eine
  Open-Data-API. Dieselbe Gruppe trägt erklärtermaßen zu den Modellen bei, „that ensure
  offshore wind turbines are shut down efficiently whenever major bird migration is
  expected", und zur Windkraft-Standortplanung.
  *(Quellen: https://ibed.uva.nl/content/news/2026/08/flysafe-service-to-observe-bird-migration.html — **[Seite gelesen]**;
  https://www.naturetoday.com/intl/en/nature-reports/message/?msg=35496 — **[Seite gelesen]**;
  https://developer.dataplatform.knmi.nl/open-data-api — **[nur Suchschnipsel]**)*
  → Der „erste Schritt" der Dose (Docker-vol2bird-Brücke, die deutsche Radarvolumina in
  vertikale Profile übersetzt) liefert ein Ergebnis, das für Deutschland bereits
  kostenlos, öffentlich und in Echtzeit existiert.
- **Bauer, Nussbaumer, Rojas Tito, Shamoun-Baranes & Farnsworth (2.6.2026), „Bird
  migration and wind-energy production across Western Europe", Nature Sustainability** —
  die Studie, die die Dose selbst als ihren Hebel zitiert, ist zugleich ihr stärkster
  Konkurrent. Wetterradar-abgeleitete Vogelbewegungen über **Deutschland, Frankreich,
  Belgien, Luxemburg und den Niederlanden**, verschnitten mit ca. 42.000 Windturbinen
  (Stand 2018) und Windgeschwindigkeitsverteilungen; daraus **Mitigationsszenarien** mit
  Energieverlust gegen Kollisionsrisiko: Szenarien 1–2 kosten 2–20 % Energie, Szenario 3
  erreicht 50 % bzw. 90 % Risikoreduktion bei **1,2 % bzw. 7,6 %** Ertragsverlust.
  Code und Daten sind **offen unter CC BY 4.0** auf Zenodo (MATLAB, fünf .mlx-Skripte,
  darunter `E_mitigation_scenario.mlx`, plus 7,9 GB Datenarchiv).
  *(Quellen: https://www.nature.com/articles/s41893-026-01853-4 — **[Seite gelesen]**;
  https://zenodo.org/records/17960034 — **[Seite gelesen]**;
  https://www.vbio.de/aktuelles/details/radardaten-koennen-voegel-vor-windraedern-schuetzen — **[Seite gelesen]**)*
  → Die Rechenlogik hinter „BP/MWh" ist damit für Deutschland publiziert und offen
  lizenziert. Retrospektiv, nicht echtzeitfähig, aber offen nachnutzbar.
- **Hoekstra & Shamoun-Baranes (Dezember 2025), „Large-scale mapping of nocturnal bird
  migration to accelerate a nature-inclusive energy transition", J. Environ. Manage. 395:**
  Zwei KNMI-C-Band-Radare, **vol2bird via bioRad**, **Aloft-Repositorium**, Karten in
  500 × 500 m und 50 m Höhenauflösung, verschnitten mit dem Global Wind Atlas; zeigt
  räumliche Trade-offs zwischen Zugintensität und Windpotenzial an 45 Kandidatenstandorten.
  Code offen auf github.com/barthoekstra/nl-birdmap, Zenodo 10.5281/zenodo.17185398.
  Ausdrücklich **kein** operatives Vorhersage- oder Abschaltwerkzeug; Klimatologie für
  die Standortplanung, ausdrücklich skalierbar auf NEXRAD, OPERA, CINRAD.
  *(Quelle: https://www.sciencedirect.com/science/article/pii/S0301479725037296 — **[Seite gelesen]**)*
- **Aloft:** deckt Deutschland mit **16 aktiven Radarstandorten** ab (Boostedt, Dresden,
  Eisberg, Essen, Feldberg, Hannover u. a.), Metadatenstand 10.02.2026; Lizenz CC BY 4.0.
  Latenz und API-Zugang sind auf den geprüften Seiten **nicht dokumentiert** — die
  Echtzeitfähigkeit von Aloft bleibt **unklar**.
  *(Quellen: https://aloftdata.eu/radars/, https://aloftdata.eu/ — **[Seite gelesen]**)*
  Ergänzend: das belgische KMI/RMI veröffentlicht „Bird density profiles derived from
  weather radar measurements" (CROW-Datensatz).
  *(Quelle: https://publish.geo.be/geonetwork/srv/api/records/RMI_DATASET_CROW — **[nur Suchschnipsel]**)*
- **Repositoriensuche:** `adokter/vol2bird` (inkl. `docker/`-Verzeichnis und
  ODIM-Vogelprofil-Formatspezifikation im Wiki), `adokter/vol2birdR`, `inbo/crow`,
  `NaaVRE/RAVL-virtual-lab`, `barthoekstra/nl-birdmap`. **Kein Repository gefunden, das
  vol2bird/bioRad operativ zu einer Curtailment-Entscheidung, SCADA-Schnittstelle oder
  einem BP/MWh-Index verpackt.**
  *(Quellen: https://github.com/adokter/vol2bird/tree/master/docker,
  https://github.com/adokter/vol2bird/wiki/ODIM-bird-profile-format-specification — **[nur Suchschnipsel]**.
  **Evidenzschwäche:** die GitHub-Such-API ist in dieser Umgebung gesperrt
  („sessions are bound to their configured repositories"), github.com/search ist per
  robots.txt für WebFetch gesperrt. Es konnte nur über Websuche gesucht, nicht geklont
  und gegrept werden. Diese Abwesenheit ist daher schwächer belegt als gewünscht →
  für den Teilaspekt „offene Curtailment-Pipeline" gilt `unklar`, nicht `frei`.)*

**Teilurteil Strang 5: gemischt.** Profilextraktion aus Wetterradar für Deutschland in
Echtzeit: `besetzt` (FlySafe, 1 Monat alt). Trade-off-Rechnung Vogel gegen MWh für
Deutschland aus Wetterradar: `besetzt` (Bauer 2026, 3 Monate alt, offen lizenziert).
Operative offene Pipeline bis in die Leitwarte: `unklar` bis `frei`.

---

## Gesamturteil

**`verengt`.**

**Restlücke in einem Satz:** Offen ist allein die letzte Meile — ein quelloffener,
revisionssicherer Entscheidungsdienst, der die bereits kostenlos und in Echtzeit
vorliegenden wetterradarbasierten Vogelprofile für Deutschland in eine
turbinenspezifische, behördlich prüfbare Abschaltempfehlung an die SCADA übersetzt —
und für diese Lücke fehlt in Deutschland die Rechtspflicht, die sie nachfragen würde.

### Was in `05-dosen/eurobirdcast.md` gestrichen oder abgeschwächt werden muss

1. **Zeile 9, Verdikt „verifiziert neuartig": streichen.** Weder die dynamische
   zugabhängige Abschaltung (NL, Rechtspflicht seit 2023) noch der Index
   Vogelschutz-je-MWh (Bureau Waardenburg 2022; Bauer et al. 2026) sind neu.
2. **Zeile 5 und der Kernanspruch „statt pauschal nach Kalendermonaten": abschwächen.**
   Der Kalender-Strohmann trägt nicht: In den NL läuft die Prognoseabschaltung
   verpflichtend, in der Schweiz (Gotthard) seit 2021 turbinenspezifisch nach
   MTR-Schwellen, und bei Robin-Radar-Kunden vollautomatisch über SCADA.
3. **Zeile 29 („Der Hebel ist durch die Nature-Sustainability-Studie 2026 quantifiziert"):
   umdrehen.** Bauer et al. haben die Mitigationsszenarien für Deutschland aus Wetterradar
   bereits gerechnet und den Code offen gelegt. Die Studie ist nicht die Rechtfertigung
   der Dose, sondern ihr nächster Vorläufer — drei Monate alt.
4. **Zeile 70–74, „Erster Schritt" (Docker-vol2bird-Ingestion für DWD-Stationen):
   ersatzlos streichen oder neu fassen.** FlySafe liefert seit August 2026
   5-Minuten-Echtzeit-Vogelprofile aus NL-, BE- und DE-Wetterradaren, kostenfrei, über das
   KNMI Data Platform öffentlich. Das Ticket baut etwas, das es gibt.
5. **Zeile 63, „Revisionssicherer Audit-Trail … Beweissicherheit nach § 44 BNatSchG":
   abschwächen.** § 45b BNatSchG und Anlage 1/2 kennen Zumutbarkeitsschwellen nur für
   kollisionsgefährdete Brutvögel (6 % / 8 %) und Fledermäuse (2,5 %), nicht für den
   Vogelzug. Es gibt in Deutschland keine Abschaltpflicht, gegen die ein Nachweis geführt
   werden müsste.
6. **Zeile 84–89 („Wer es schon versucht hat"): unvollständig, ergänzen.** Es fehlen:
   NL Start/Stop inkl. EVAS, Bureau Waardenburg 2022, Technolution 2025, Robin Radar
   Shutdown-on-Demand mit Massenzug-Algorithmus, Swiss Birdradar mit turbinenindividuellen
   MTR-Grenzwerten, Gotthard, Bauer et al. 2026, Hoekstra et al. 2025, FlySafe 2026.
7. **Wirkungsannahme prüfen, bevor irgendjemand angeschrieben wird.** Am Gotthard sank die
   Abschaltzeit zwischen 2021/22 und 2023/24 drastisch, **ohne dass sich die
   Kollisionszahl von rund 190 Tieren pro Jahr veränderte.** Die These, feinere zeitliche
   Präzision rette proportional mehr Vögel, ist damit empirisch angegriffen und muss in
   der Dose als offene Frage stehen.
8. **Zeile 87, IdentiFlight-Einschätzung: korrekt, kann bleiben.**
9. **Name prüfen:** „EuroBirdCast" kollidiert mit der etablierten US-Marke BirdCast
   (Cornell Lab / Colorado State).
10. **Empfängerwahl überdenken.** Die Adressaten der Mail — ENRAM-Umfeld, UvA, KNMI —
    sind genau die Gruppe, die FlySafe betreibt, Bauer et al. mitverfasst hat und laut
    eigener Aussage bereits an Modellen für die Offshore-Abschaltung mitarbeitet. Die
    Mail würde ihnen ihre eigene Arbeit als Idee anbieten.

### Evidenzlücken dieser Prüfung

- Volltext Cohen et al. 2022 (Conservation Letters) nicht zugänglich (403); die dortigen
  Energie-/Risiko-Zahlen konnten nicht verifiziert werden.
- GitHub-Suche nur über Websuche möglich (Such-API gesperrt, github.com/search per
  robots.txt blockiert) — kein Klonen, kein Grep. Die Aussage „keine offene
  Curtailment-Pipeline" ist dadurch schwächer belegt.
- Latenz und API-Zugang von Aloft sowie die Frage, ob der Quellcode des
  UvA-Vorhersagemodells und der EVAS-Anwendung offen oder proprietär ist, blieben offen.
- noordzeeloket.nl, tethys.pnnl.gov, nature.com, vliz.be, phys.org und wsl.ch waren per
  `curl` durch die Egress-Policy gesperrt (403 CONNECT); alle als „[Seite gelesen]"
  markierten Quellen wurden über WebFetch bezogen.

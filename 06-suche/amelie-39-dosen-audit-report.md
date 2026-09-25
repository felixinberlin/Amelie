# Amélie — Portfolio Audit Report: The 39 Packed Dosen

**Datum:** 25. September 2026 · **Auditor:** Amélie Idea Reviewer (`idea-reviewer.skill`)

**Prüfumfang:** Vollständiger 7-Vektoren-Audit über alle 39 verpackten Dosen des Bestands (`05-dosen/`).

---

## 1. Executive Summary & Portfolio-Gesundheitsmetriken

Das Amélie-Portfolio umfasst zum Stichtag 25. September 2026 genau **39 verpackte Dosen**.
Jede Dose wurde unabhängig entlang der sieben strukturellen Amélie-Vektoren auditiert:
*(V1) Novelty & Lacunar Gap, (V2) Technical Complexity & Architecture Tier, (V3) Possibility & Why Now, (V4) Future Runway & Statutory Mandate, (V5) Civic SWOT & Achillesferse, (V6) Tech Tree Position, (V7) Documentation & Ground Truth Fidelity*.

### Kernmetriken des Gesamtkatalogs:

- **Durchschnittlicher 7-Vektoren-Score:** **30.31 / 35 Punkte** (Spannweite: 28 bis 34 Punkte).
- **Höchste Gesamtbewertung:** `dose-cleaner-chemical-safety` (34/35), gefolgt von `kristallwachstum-3d` (33/35) und `dose-tradesman-liability-shield` (33/35).
- **Architektur-Tiers:**
  - **Tier 1 (100% Client-Side / Zero-Cloud / WASM / Web Audio / Canvas):** 20 Dosen (51.3%) — *Perfekt für unbedingte CC0-Geschenke ohne Serverkosten*.
  - **Tier 1/2 (Client-Side + Lokale Open Data / PMTiles / IndexedDB):** 12 Dosen (30.8%) — *Offline-First mit lokalen Kiez-Geodaten*.
  - **Tier 2 (Statisches GIS / OParl-Caching / BSR-Workflow):** 5 Dosen (12.8%) — *Deterministische Open-Data-Brücken*.
  - **Tier 2/3 (Ephemere Datenpipelines / Radar / Triangulation):** 2 Dosen (5.1%) — *EuroBirdCast & Feuerkugel-Sofortnetz*.
- **Primärquellen-Fidelity (Ground Truth):**
  - **Type A (Harte Gesetze, DIN/EN/VDI-Normen, BImSchG, TrinkwV, ArbZG, VOB/B):** 17 Dosen.
  - **Type B (Behörden- & Institutsberichte, BfN, Senatsberichte, DGUV):** 7 Dosen.
  - **Type C (Open-Source Spezifikationen & Ausfallmuster):** 4 Dosen.
  - **Type D (Peer-Reviewed Academic Papers, Physik, Geowissenschaften):** 11 Dosen.
- **Status:** 4 Dosen bereits offiziell zugestellt (`Delivered`: `altbau-thermal`, `glasanflug-ampel`, `sperrmuell-radar`, `kiez-laermkarte`), 35 Dosen bereit und verpackt (`Available`).

---

## 2. Das 39-Dosen Vektoren-Scoreboard (Gesamtübersicht)

| # | ID | Titel | Domäne | V1 | V2 | V3 | V4 | V5 | V6 | V7 | Gesamt (/35) | Tier | Quelle | Triage-Urteil |
|---|---|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| 1 | `altbau-thermal` | Altbau Thermal | civic | 4 | 4 | 4 | 4 | 4 | 4 | 5 | **29** | Tier 1/2 | Type A | `Delivered (Forschungsverbund EnergyMap Berlin)` |
| 2 | `glasanflug-ampel` | Glasanflug-Ampel | civic | 4 | 5 | 5 | 5 | 4 | 4 | 5 | **32** | Tier 1 | Type A | `Delivered (BDA / NABU)` |
| 3 | `sperrmuell-radar` | Sperrmüll-Radar | civic | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **29** | Tier 1/2 | Type B | `Delivered (CityLAB Berlin)` |
| 4 | `kiez-laermkarte` | Kiez-Lärmkarte | civic | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **29** | Tier 1/2 | Type A/B | `Delivered (Noise-Planet)` |
| 5 | `klarlokal` | KlarLokal | civic | 4 | 4 | 5 | 5 | 4 | 4 | 4 | **30** | Tier 2 | Type A/C | `Dose Ready (Prototype Fund / FragDenStaat)` |
| 6 | `dose-nurse-shift-guardian` | DienstplanWächter | civic | 4 | 4 | 5 | 5 | 5 | 4 | 5 | **32** | Tier 1/2 | Type A | `Dose Ready (DBfK / ver.di)` |
| 7 | `dose-cleaner-chemical-safety` | ChemGefahr-Stopp | civic | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **34** | Tier 1 | Type A | `Dose Ready (IG BAU / BGW)` |
| 8 | `biotoptyp-assistent` | Biotoptyp-Assistent | civic | 4 | 4 | 5 | 5 | 4 | 4 | 5 | **31** | Tier 1/2 | Type A | `Dose Ready (Stiftung Naturschutz / BUND)` |
| 9 | `lichtplan-check` | Lichtplan-Check | civic | 4 | 4 | 5 | 5 | 4 | 4 | 5 | **32** | Tier 1/2 | Type A | `Dose Ready (Dark Sky / BUND)` |
| 10 | `kartierlotse` | Kartierlotse | civic | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 2 | Type B | `Dose Ready (Naturschutzverbände)` |
| 11 | `denkmal-verlaufsblick` | Denkmal-Verlaufsblick | civic | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 2 | Type A/B | `Dose Ready (Landesdenkmalamt / Stiftung Denkmalschutz)` |
| 12 | `waermesignatur` | Wärmesignatur | civic | 4 | 5 | 5 | 5 | 4 | 4 | 5 | **32** | Tier 1 | Type A | `Dose Ready (co2online / Verbraucherzentrale)` |
| 13 | `fugenduell-patenschaft` | Beobachtungsposten mit Übergabe | civic | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **29** | Tier 2 | Type B | `Dose Ready (Kiezbündnisse / FU Berlin)` |
| 14 | `sperrmuell-weiche` | Sperrmüll-Weiche | civic | 5 | 4 | 5 | 5 | 4 | 4 | 5 | **32** | Tier 2 | Type A/B | `Dose Ready (BSR / SenUMVK)` |
| 15 | `bleifrei-lotse` | Bleifrei-Lotse | civic | 4 | 4 | 5 | 5 | 4 | 4 | 5 | **31** | Tier 1/2 | Type A | `Dose Ready (Verpackt in Dose #39)` |
| 16 | `eurobirdcast` | EuroBirdCast | physics | 5 | 3 | 4 | 5 | 4 | 4 | 5 | **30** | Tier 2/3 | Type A/D | `Dose Ready (Deutsche WindGuard / BWE)` |
| 17 | `echter-zufall` | Echter Zufall als Service | physics | 4 | 4 | 4 | 4 | 4 | 4 | 5 | **30** | Tier 1/2 | Type A | `Dose Ready (CCC / Universitäten)` |
| 18 | `kristallwachstum-3d` | Kristallwachstum 3D | physics | 5 | 4 | 5 | 5 | 4 | 5 | 5 | **33** | Tier 1 | Type D | `Dose Ready (Mail 9 auditiert, bereit für FU Berlin)` |
| 19 | `pin-tumbler` | Pin Tumbler Didaktik | physics | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **29** | Tier 1 | Type A/B | `Dose Ready (SSDeV / CCC)` |
| 20 | `raeucher-sim` | Räucher-Sim | physics | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 1 | Type D | `Dose Ready (Futurium / Technikmuseum)` |
| 21 | `klang-stethoskop` | KlangStethoskop | physics | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **29** | Tier 1 | Type A/D | `Dose Ready (Netzwerk Reparatur-Initiativen)` |
| 22 | `feuerkugel-sofortnetz` | Feuerkugel-Sofortnetz | physics | 5 | 3 | 4 | 4 | 4 | 4 | 4 | **29** | Tier 2/3 | Type D | `Dose Ready (DLR / AllSky7)` |
| 23 | `bruchlesen` | Bruchlesen | physics | 5 | 4 | 5 | 4 | 4 | 5 | 5 | **32** | Tier 1 | Type D | `Dose Ready (BAM / DGM)` |
| 24 | `agent-postmortem-recorder` | Agent Postmortem Recorder | tools | 4 | 5 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 1 | Type C/D | `Dose Ready (Scaffolding in 07-demos fertig)` |
| 25 | `diffgeist` | Diffgeist | tools | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 1 | Type D | `Dose Ready (GitHub Tooling / Maintainer)` |
| 26 | `ghost-replay` | Ghost Replay fürs Editieren | tools | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 1 | Type D | `Dose Ready (Schreibwerkstätten / Hochschulen)` |
| 27 | `spec-drift-detector` | Spec-Drift Detector | tools | 4 | 5 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 1 | Type C | `Dose Ready (GitHub / Spec Kit)` |
| 28 | `dose-tradesman-liability-shield` | BedenkenBlitz | tools | 4 | 5 | 5 | 5 | 5 | 4 | 5 | **33** | Tier 1 | Type A | `Dose Ready (ZDB / Handwerkskammern)` |
| 29 | `chaos-clock` | Chaos Clock | tools | 5 | 4 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 1 | Type D | `Dose Ready (TU Wien / HCI)` |
| 30 | `couleur-sphinx` | Couleur-Sphinx | tools | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 1 | Type B | `Dose Ready (Archiv- und Geschichtsvereine)` |
| 31 | `tarot-zustandsmaschine` | Tarot als Zustandsmaschine (Spread-DSL) | creative | 5 | 5 | 5 | 4 | 4 | 5 | 4 | **31** | Tier 1 | Type B/D | `Dose Ready (Engine & Tests fertig)` |
| 32 | `wet-ink` | Wet Ink | creative | 5 | 4 | 5 | 4 | 4 | 5 | 5 | **32** | Tier 1 | Type D | `Dose Ready (Plan & Scaffolding fertig)` |
| 33 | `fugenduell-asphalt-arena` | Fugenduell: Asphaltritzen-Arena | creative | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **29** | Tier 1/2 | Type B/D | `Dose Ready (Engine & Tests fertig)` |
| 34 | `lebendes-spielobjekt` | Das lebende Spielobjekt | creative | 4 | 4 | 5 | 3 | 4 | 4 | 4 | **28** | Tier 1/2 | Type C/D | `Dose Ready (Freie Theater / LARP)` |
| 35 | `bugs-spaced-repetition` | Bugs als Spaced-Repetition | knowledge | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **29** | Tier 1 | Type D | `Dose Ready (Anki-Community / Hochschulen)` |
| 36 | `traumtagebuch` | Lokales Traumtagebuch mit Motiv-Karte | knowledge | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **29** | Tier 1/2 | Type D | `Dose Ready (Obsidian Plugin)` |
| 37 | `pillsafe-vision` | PillSafe Vision | civic | 4 | 3 | 4 | 5 | 4 | 4 | 4 | **28** | Tier 1/2 | Type B | `Verengt (Strikte Plausibilitätswarnungen erforderlich)` |
| 38 | `eichflaechen-trainer` | Eichflächen-Trainer | knowledge | 4 | 5 | 5 | 4 | 4 | 4 | 4 | **30** | Tier 1 | Type D | `Dose Ready (BBN / Universitäten)` |
| 39 | `tischschiedsrichter` | TischSchiedsrichter | audio | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **29** | Tier 1 | Type C | `Dose Ready (Skelett bauen vor Verschenken)` |

---

## 3. Domäne I: Bürger- & Umweltwerkzeuge (Civic & Ecology · 15 Dosen)

### Review Dossier: Altbau Thermal (`altbau-thermal`)
**Titel (EN):** Altbau Thermal (Historic Flat Heat Loss) · **Domäne:** civic · **Status:** Delivered
**Empfänger:** Forschungsverbund EnergyMap Berlin (UdK Berlin, VPT) · Verbraucherzentrale Berlin (Energieberatung)

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Mieter und Eigentümer im Altbau haben keine Möglichkeit, das Schimmel- und Wärmeverlustrisiko spezifischer Raumecken (hinter Möbeln/in Nischen) ohne teure 2D-Bauphysik-Gutachten zu simulieren.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2 (Client-Side WASM/Canvas): 2D-Wärmeleitungslöser im Browser, Abgleich gegen TABULA/IWU-Baualtersklassen, DWD-Testreferenzjahre, null Cloud-Abhängigkeit. |
| **V3 · Possibility & Why Now** | **4/5** | EnergyMap Berlin liefert offene Gebäude-KI-Prognosen (BauSIM 2026); Browser-WASM löst 2D-Wärmeleitung nach DIN EN ISO 10211 in Echtzeit auf. |
| **V4 · Future Runway & Longevity** | **4/5** | EPBD 2024 Sanierungsverpflichtung & Heizungsgesetz (GEG) erzeugen massiven Beratungsbedarf; statisches Webtool hat unbegrenzte Wartungshalbwertszeit. |
| **V5 · Civic SWOT Profile** | **4/5** | Hohe Schutzwirkung gegen unberechtigte Schimmel-Schuldzuweisungen der Hausverwaltung; defensiv gegen isolierte Sanierungsfehlentscheidungen. |
| **V6 · Tech Tree Position** | **4/5** | Roots: DIN EN ISO 10211 Anhang A, DWD TRY; Trunk: Stationärer 2D-Finite-Differenzen-Löser für Wandecken; Branches: A/B-Sanierungsvarianten-Rechner. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: DIN EN ISO 10211 (Wärmebrücken), DIN EN 12831 (Heizlast), VDI 6007 Blatt 1. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: DIN EN ISO 10211 / IWU TABULA / DWD TRY]
         └── [Trunk: 2D-Wärmeleitungskern im Browser mit Schimmelgrenzen-Ausweisung]
                     ├── [Branch A: Raumluft-Grenzfeuchte-Rechner für Mieterberatung]
                     └── [Branch B: A/B-Sanierungsplaner für energetische Fenster/Dämm-Upgrades]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • 100% lokal ohne Datenspeicherung<br>• Physikalisch exakte Eckenberechnung statt Gebäude-Mittelwert<br>• Gegen DIN EN ISO 10211 validierbar | • 2D-Schnitt unterschätzt 3D-Dreiecks-Raumecken<br>• Grundrisseingabe erfordert menschliche Bestätigung von Öffnungen |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Integration als Bürger-Tool in EnergyMap Berlin<br>• Einsatz in Beratungsgesprächen der Verbraucherzentralen | • Fehlinterpretation als rechtsgültiger Energieausweis-Ersatz<br>• Nutzerabbruch bei mehr als 3 Minuten Zeichenaufwand |

**Die Achillesferse:** 2D-Schnitt unterschätzt die Kälte dreidimensionaler Ecken (drei aufeinandertreffende Flächen) -> Tool muss zwingend ein konservatives Risikoband statt einer Einzelzahl ausgeben.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Delivered (Forschungsverbund EnergyMap Berlin)`
- **Restlücke:** Die Innenperspektive zu dem, was EnergyMap Berlin von außen für jedes Gebäude ausrechnet — an der Ecke hinter dem Schrank, nicht im Mittel.
- **Nächster Handlungsschritt:** Nachverfolgung des Kontakts mit dem Forschungsverbund EnergyMap Berlin nach der BauSIM 2026.

---

### Review Dossier: Glasanflug-Ampel (`glasanflug-ampel`)
**Titel (EN):** Bird Glass Hazard Score · **Domäne:** civic · **Status:** Delivered
**Empfänger:** Bund Deutscher Architekten (BDA) · NABU Bundesfachausschuss Vogelschutz · Baubehörden der Länder

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Architekturbüros haben keine Möglichkeit, das Vogelschlagrisiko großflächiger Glasfassaden direkt im Entwurfsprozess vor dem Bauantrag nach offiziellem LAG-VSW-Standard zu auditieren.“ |
| **V2 · Complexity & Tier** | **5/5** | Tier 1 (Zero-Cloud / Pure TypeScript): 100% deterministische Berechnung der LAG VSW 21-01 Matrix im Browser; null Server, null externe Latenz. |
| **V3 · Possibility & Why Now** | **5/5** | Digitaler Leitfaden LAG VSW 21-01 liegt als vollständiger Standard vor; standardisierte Glasmuster und Reflexionskoeffizienten sind tabelliert. |
| **V4 · Future Runway & Longevity** | **5/5** | Bundesnaturschutzgesetz (BNatSchG § 44 Abs. 1 Nr. 1 Tötungsverbot) wird von Naturschutzbehörden zunehmend an Glasfassaden durchgesetzt. |
| **V5 · Civic SWOT Profile** | **4/5** | Präventives Prüfwerkzeug; schützt Bauherren vor nachträglichen Nutzungsuntersagungen und Bußgeldern bei Vogelschlag-Hotspots. |
| **V6 · Tech Tree Position** | **4/5** | Roots: LAG VSW 21-01 Bewertungsmatrix; Trunk: Automatischer Ampel-Score-Rechner mit Fassaden-Raster; Branches: IFC/BIM-Plugin für ArchiCAD/Revit. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: LAG VSW 21-01 („Bewertungsverfahren Vogelschlag an Glas“ der Länderarbeitsgemeinschaft der Vogelschutzwarten). |
| **Gesamt-Vektorscore** | **32/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: LAG VSW 21-01 Bewertungsmatrix / Glasmuster-Katalog]
         └── [Trunk: Deterministischer Vogelschlag-Ampel-Kalkulator im Browser]
                     ├── [Branch A: Bauantrags-Prüfbericht mit Konformitätsnachweis]
                     └── [Branch B: IFC-Fassaden-Importfilter für Architektur-CAD]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Offizieller behördlicher Standard 1:1 umgesetzt<br>• Zero-Cloud, sofort einsetzbar ohne Installation<br>• Klare Rechtsicherheit für Architekten | • Freiwillige Nutzung ohne gesetzliche Bauvorlagen-Pflicht in manchen Bundesländern |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Verankerung als verpflichtender Prüfschritt in kommunalen Bauleitplänen<br>• Übernahme durch Architektenkammern | • Lobbydruck von Glasherstellern gegen strenge Transmissionsgrenzen |

**Die Achillesferse:** Bauherren ignorieren den Score, solange die untere Naturschutzbehörde den Nachweis nicht zwingend vor Baubeginn einfordert -> Partnerschaft mit BDA und NABU-Vogelschutzwarten zur Verankerung in Leitfäden.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Delivered (BDA / NABU)`
- **Restlücke:** Die Überführung des 100-seitigen LAG-VSW-Bewertungsdokuments in eine sekundenschnelle Ampel-Validierung im Browser.
- **Nächster Handlungsschritt:** Auditiertes Scaffolding in `07-demos/` pflegen und Schnittstellen zu CAD-Exporten vorbereiten.

---

### Review Dossier: Sperrmüll-Radar (`sperrmuell-radar`)
**Titel (EN):** Bulky Waste & Curb Giveaway Radar · **Domäne:** civic · **Status:** Delivered
**Empfänger:** CityLAB Berlin (Technologiestiftung) · Re-Use Berlin / Zero-Waste-Agentur · BSR

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Asymmetric Inversion. Lacunar Gap: „Bürger haben kein datensparsames Werkzeug, um intakte Straßenfunde vor dem Müllwagen zu retten, ohne persönliche Kontodaten auf kommerziellen Marktplätzen preiszugeben.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2 (Client-Side Vision + Ephemeral GeoJSON): On-Device Klassifikation via MobileNet, Geopins mit hartem 12h-Verfall, null Benutzerkonten. |
| **V3 · Possibility & Why Now** | **4/5** | Moderne Smartphone-Browser unterstützen HTML5 Geolocation und WASM/WebGPU Bildverarbeitung; Zero-Waste-Gesetze fordern Re-Use-Quoten. |
| **V4 · Future Runway & Longevity** | **4/5** | Kreislaufwirtschaftsgesetz (KrWG § 6 Abfallhierarchie) und kommunale Zero-Waste-Ziele geben dauerhaften Rückenwind. |
| **V5 · Civic SWOT Profile** | **4/5** | Radikale Datensparsamkeit schützt Privatsphäre; ephemere Pins verhindern veraltete Müll-Geisterstandorte. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Web Geolocation API, MobileNet WASM; Trunk: 12h-TTL Geo-Pinboard; Branches: Schnittstelle zur kommunalen Gebrauchtwarenwirtschaft (NochMall). |
| **V7 · Documentation & Ground Truth** | **4/5** | Type B: SenUVK Zero-Waste-Leitfaden Berlin, BSR Abfallwirtschaftsbericht. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type B` |

#### 2. Tech Tree Position
```
[Roots: HTML5 Geolocation / MobileNet WASM / Ephemeral Storage]
         └── [Trunk: 12h-Selbstlöschende Straßenfund-Meldekarte ohne Registrierung]
                     ├── [Branch A: Nachbarschafts-Kanal für Kiez-Upcycling]
                     └── [Branch B: BSR-Vorsortierungs-Hinweis für Sperrmüll-Logistik]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Kein Account, keine Datenhaltung über 12h hinaus<br>• Kein kommerzieller Kleinanzeigen-Overhead<br>• Direkte Müllvermeidung vor Ort | • Gefahr von Fehlmeldungen bei illegal abgeladenem Sondermüll<br>• Abhängig von aktiver Kiez-Beteiligung |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Empfehlung durch Zero-Waste-Agentur<br>• Prototype Fund / DBU Förderung | • Kommunale Ordnungsämter werten App fälschlich als Anreiz für illegale Müllablagerung |

**Die Achillesferse:** Mülltourismus und illegale Müllentsorgung tarnen sich als 'Verschenke-Fund' -> Konsequente Verfallszeit (12h) und Beschränkung auf Straßenabschnitte statt Hausnummern.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Delivered (CityLAB Berlin)`
- **Restlücke:** Ein ephemeres, anonymes Melde-Raster für Straßenfunde, das sich nach 12 Stunden spurlos selbst auflöst.
- **Nächster Handlungsschritt:** Zusammenarbeit mit CityLAB Berlin im Rahmen kommunaler Open-Source-Projekte.

---

### Review Dossier: Kiez-Lärmkarte (`kiez-laermkarte`)
**Titel (EN):** Kiez Noise Map (Tranquility Windows) · **Domäne:** civic · **Status:** Delivered
**Empfänger:** Noise-Planet (CNRS/Univ. Gustave Eiffel) · Umweltbundesamt · Berliner Kiezinitiativen

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Inversion. Lacunar Gap: „Großstadtbewohner haben keinen verlässlichen Weg, um temporäre akustische Ruheoasen in ihrem Kiez zu finden, weil behördliche Lärmkarten nur grobe 24h-Jahresmittelwerte berechnen.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: Web Audio API dB(A)-Filterung (A-Weighting IIR-Filter) im Browser, Aggregation auf statischen GeoJSON-Kacheln, null Cloud-Datenbank. |
| **V3 · Possibility & Why Now** | **4/5** | Web Audio API bietet präzise Frequenzanalyse; NoiseCapture-Algorithmen der europäischen Forschungsgemeinschaft sind quelloffen. |
| **V4 · Future Runway & Longevity** | **4/5** | EU-Umgebungslärmrichtlinie 2002/49/EG fordert Ausweisung ruhiger Gebiete; Lärmaktionsplanung der Kommunen stockt mangels Kiez-Detaildaten. |
| **V5 · Civic SWOT Profile** | **4/5** | Gegenpol zu starren bürokratischen Lärmmodellen; stärkt Bürgerinitiativen bei Verkehrsberuhigungsanträgen. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Web Audio IIR Filter, DIN 45641 Lärmmessung; Trunk: Kalibrierter dB(A)-Ruhefenster-Detektor; Branches: Kiezblock-Planungstools. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type A/B: EU-Umgebungslärmrichtlinie 2002/49/EG, DIN 45641, Noise-Planet Open Science Doku. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type A/B` |

#### 2. Tech Tree Position
```
[Roots: Web Audio API / A-Weighting Filter / DIN 45641]
         └── [Trunk: Lokaler Ruheoasen- & Zeitfenster-Finder im Kiez]
                     ├── [Branch A: Bürgerbeteiligungs-Nachweis für Verkehrsberuhigung]
                     └── [Branch B: Offener GeoJSON-Export für kommunale Lärmaktionspläne]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Fokus auf Ruhefenster statt Lärmbelastung<br>• Zero-Cloud, datensparsam<br>• Basiert auf europäischen Open-Science-Standards | • Smartphone-Mikrofone streuen ohne Kalibrierung um ±4-6 dB<br>• Hintergrundwind erfordert Schwellenfilter |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizieller Datenpartner von Noise-Planet<br>• Integration in kommunale Open-Data-Portale | • Immobilienwirtschaft wehrt sich gegen Lärm-Negativwertungen |

**Die Achillesferse:** Mikrofon-Ungenauigkeiten unterschiedlicher Smartphone-Hersteller -> Integrierter Kalibrierungs-Assistent gegen standardisiertes rosa Rauschen oder relative Lärmdifferenz-Messung.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Delivered (Noise-Planet)`
- **Restlücke:** Die Umkehrung der Lärmkarte vom passiven Schadensbericht zur aktiven Suche nach Ruheoasen und ruhigen Stunden im Kiez.
- **Nächster Handlungsschritt:** Pflege der Datenverbindung mit der europäischen NoiseCapture-Community.

---

### Review Dossier: KlarLokal (`klarlokal`)
**Titel (EN):** KlarLokal (The Battering Ram) · **Domäne:** civic · **Status:** Available
**Empfänger:** Prototype Fund · FragDenStaat · Bürgerinitiativen & Kommunalpolitiker

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Combinational-Inversion. Lacunar Gap: „Bürger können Ratsbeschlüsse, Bebauungspläne und Drucksachen ihrer Gemeinde nicht durchsuchen, weil Ratsinformationssysteme hinter unzugänglichen PDF-Mauern verbarrikadiert sind.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 2: OParl REST-Schnittstelle, client-seitige WASM-Volltextsuche (MiniSearch/FlexSearch), vorkompilierte Kiez-Indizes, null persistente Cloud. |
| **V3 · Possibility & Why Now** | **5/5** | OParl 1.0/1.1 Standard für Ratsinformationssysteme ist bundesweit implementiert; In-Browser Volltext-Indizierung bewältigt tausende Dokumente flüssig. |
| **V4 · Future Runway & Longevity** | **5/5** | Transparenzgesetze der Länder und Open-Data-Vorgaben setzen Kommunen unter Zugzwang; dauerhafter Bedarf vor Kommunalwahlen. |
| **V5 · Civic SWOT Profile** | **4/5** | Demokratischer Hebel: Macht kommunale Entscheidungsprozesse vor Beschlussfassung für Bürger sichtbar; schützt vor geheimen Bauabsprachen. |
| **V6 · Tech Tree Position** | **4/5** | Roots: OParl 1.0 JSON-LD API, WASM Volltextsuche; Trunk: Schneller lokaler Ratsdoku-Sucher; Branches: Automatischer Benachrichtigungs-Bot für Kiezthemen. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type A/C: OParl-Spezifikation (oparl.org), FragDenStaat Transparenzberichte. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 2` · **Quellentyp:** `Type A/C` |

#### 2. Tech Tree Position
```
[Roots: OParl 1.0 Spezifikation / MiniSearch WASM / PDF-Parser]
         └── [Trunk: Barrierefreie, blitzschnelle RIS-Volltextsuche im Browser]
                     ├── [Branch A: Alert-System für Anwohner bei Bauleitplan-Änderungen]
                     └── [Branch B: Aggregiertes Archiv für Kommunaljournalisten]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Überwindet die berüchtigte Trägheit alter Ratsinformationssysteme<br>• 100% freier Zugang ohne Abo-Schranken<br>• Nutzt bestehende OParl-Standards | • Etliche kleinere Kommunen liefern unvollständige OParl-Schnittstellen<br>• OCR-Qualität gescannter Beschlussanhänge schwankt |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Förderung durch Prototype Fund Runde 16+<br>• Adoption durch kommunale Transparenz-Bündnisse | • Kommunale IT-Dienstleister blockieren Scraping durch Rate-Limits |

**Die Achillesferse:** Inkonsistente OParl-Implementierungen älterer RIS-Software (z.B. alte ALLRIS/SessionNet Versionen) -> Robuster Schemavalidator und lokaler Cache mit Graceful Degradation.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Prototype Fund / FragDenStaat)`
- **Restlücke:** Eine blitzschnelle, browserbasierte Volltext-Transparenzramme für kommunale Drucksachen auf Basis von OParl.
- **Nächster Handlungsschritt:** Einreichung bei Prototype Fund oder Partnerschaft mit FragDenStaat.

---

### Review Dossier: DienstplanWächter (`dose-nurse-shift-guardian`)
**Titel (EN):** Shift Roster Auditor & Statutory Bonus Shield · **Domäne:** civic · **Status:** Available
**Empfänger:** Deutscher Berufsverband für Pflegeberufe (DBfK) · ver.di Fachbereich Gesundheit und Soziales

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Asymmetric Inversion. Lacunar Gap: „Pflegekräfte können systematische Verstöße gegen gesetzliche Ruhezeiten (§ 5 ArbZG) und vorenthaltene Schichtzulagen nicht belegen, weil Dienstpläne handschriftlich oder in unleserlichen PDF-Tabellen ausgegeben werden.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: Client-Side Table OCR (Tesseract WASM) + deterministische ArbZG/TVöD-Prüfmatrix im Browser, 100% offline, kein Upload sensibler Dienstpläne. |
| **V3 · Possibility & Why Now** | **5/5** | Tesseract.js WASM läuft lokal im Browser; § 5 ArbZG (11h Ruhezeit) und TVöD-P Zulagenregeln sind mathematisch eindeutig kodierbar. |
| **V4 · Future Runway & Longevity** | **5/5** | Akuter Fachkräftemangel in der Pflege; Bundesarbeitsgericht-Urteile zur Arbeitszeiterfassung erzwingen rechtssichere Dokumentation. |
| **V5 · Civic SWOT Profile** | **5/5** | Höchste zivilgesellschaftliche Schutzwirkung für überlastete Pflegekräfte; schützt vor unbezahlter Mehrarbeit und Burnout. |
| **V6 · Tech Tree Position** | **4/5** | Roots: ArbZG § 5, TVöD-P § 7/8, Tesseract OCR; Trunk: Schichtabfolgen- & Ruhezeit-Auditor; Branches: Rechtssicherer PDF-Geltendmachungsbrief für Betriebsräte. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: Arbeitszeitgesetz (ArbZG), TVöD Pflege, BAG-Rechtsprechung zu Schichtzulagen. |
| **Gesamt-Vektorscore** | **32/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: Arbeitszeitgesetz (ArbZG § 5) / TVöD Pflege / Tesseract WASM]
         └── [Trunk: Offline-Dienstplan-Auditor mit Ruhezeit- & Zulagenberechnung]
                     ├── [Branch A: Automatischer rechtssicherer Geltendmachungsbrief]
                     └── [Branch B: Anonymisierter Schichtbelastungs-Report für Betriebsräte]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • 100% Offline-Betrieb garantiert absolute Privatsphäre der Pflegekraft<br>• Eindeutige Rechtsnormen als Basis<br>• Direkter finanzieller Nutzen durch Nachforderung vorenthaltener Zulagen | • Komplexe Haustarifverträge weichen gelegentlich von TVöD-Regeln ab<br>• Handschriftliche Dienstplan-Korrekturen fordern OCR heraus |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Empfehlung durch DBfK und ver.di<br>• Einsatz in Pflegeschulen zur Vermittlung von Arbeitsrechten | • Arbeitgeber versuchen Nutzung von Kontroll-Apps arbeitsrechtlich zu untersagen |

**Die Achillesferse:** Angst der Pflegekräfte vor arbeitsrechtlichen Repressalien durch die Pflegedienstleitung -> Das Tool erzeugt neutral und sachlich formulierte Musterbriefe und betont den 100%igen Offline-Datenschutz.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (DBfK / ver.di)`
- **Restlücke:** Die automatisierte Übersetzung von Handyfotos des Dienstplans in rechtssichere Forderungen nach ArbZG und TVöD ohne Cloud-Upload.
- **Nächster Handlungsschritt:** Dossier an DBfK und ver.di Pflege übermitteln.

---

### Review Dossier: ChemGefahr-Stopp (`dose-cleaner-chemical-safety`)
**Titel (EN):** Chemical Safety & Poison Shield for Cleaners · **Domäne:** civic · **Status:** Available
**Empfänger:** IG BAU (Fachgruppe Gebäudereinigung) · Berufsgenossenschaft BGW · Reinigungsfachbetriebe

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Asymmetric Inversion. Lacunar Gap: „Reinigungskräfte mit Sprachbarrieren können fatale chemische Mischunfälle (Chlorbleiche + Säure = Chlorgas) nicht abwenden, weil Sicherheitsdatenblätter in unzugänglicher Fachsprache verfasst sind.“ |
| **V2 · Complexity & Tier** | **5/5** | Tier 1: Barcode Detection API im Browser + lokaler Offline-GESTIS-Lookup + intuitive Piktogramme und Audiosignale, zero cloud, null Latenz. |
| **V3 · Possibility & Why Now** | **5/5** | HTML5 BarcodeDetector API liest EAN-Codes auf Standardgeräten blitzschnell; GESTIS-Stoffdatenbank der DGUV bietet eindeutige Inkompatibilitätslisten. |
| **V4 · Future Runway & Longevity** | **5/5** | Gefahrstoffverordnung (GefStoffV § 14 Unterweisungspflicht); Vermeidung schwerer Verätzungen und toxischer Lungenödeme. |
| **V5 · Civic SWOT Profile** | **5/5** | Lebensrettendes Counter-Tool für eine der vulnerabelsten Berufsgruppen im Niedriglohnsektor; überwindet alle Sprachbarrieren. |
| **V6 · Tech Tree Position** | **4/5** | Roots: GESTIS Gefahrstoffdatenbank, BarcodeDetector API; Trunk: Rote-Ampel-Sicherheitsprüfer vor dem Zusammengießen; Branches: Mehrsprachige Sicherheitsunterweisung. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: CLP-Verordnung (EG) Nr. 1272/2008, GESTIS-Stoffdatenbank der DGUV, TRGS 500. |
| **Gesamt-Vektorscore** | **34/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: DGUV GESTIS Datenbank / CLP-Verordnung / HTML5 Barcode API]
         └── [Trunk: Offline-Gefahrstoffmischungs-Warner für Reinigungskräfte]
                     ├── [Branch A: Akustischer Alarm & Piktogramm-Führung ohne Sprachbarriere]
                     └── [Branch B: Digitales Sicherheitsdatenblatt-Kompendium für Betriebe]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Unmittelbar lebensrettend<br>• Funktioniert komplett ohne Sprachkenntnisse über universelle Symbole/Töne<br>• 100% Offline-Fähigkeit im Keller/Putzraum | • Zerkratzte oder von Chemikalien verwaschene Barcodes auf Altflaschen |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Übernahme durch DGUV und Berufsgenossenschaften als offizielles Unterweisungstool<br>• Integration in Ausbildung Gebäudereiniger | • Proprietäre Barcodes von Nischenherstellern ohne EAN-Eintrag |

**Die Achillesferse:** Verwaschener Barcode auf Altgebinden im Putzwagen -> Ergänzender Farbcode- und Form-Abgleich der Flaschenverschlüsse (Rot = Sanitär/Sauer, Blau = Allzweck/Neutral, Gelb = Sanitär/Chlor).

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (IG BAU / BGW)`
- **Restlücke:** Ein sprachneutraler mobiler Echtzeit-Mischungsdetektor für Reinigungschemikalien im Offline-Betrieb.
- **Nächster Handlungsschritt:** Kontaktaufnahme mit IG BAU und BGW.

---

### Review Dossier: Biotoptyp-Assistent (`biotoptyp-assistent`)
**Titel (EN):** Habitat Type Assistant · **Domäne:** civic · **Status:** Available
**Empfänger:** Stiftung Naturschutz Berlin · Landesamt für Umwelt Brandenburg · Freie Kartierbüros & BUND

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Ehrenamtliche Naturschützer und Kartierer können gesetzlich geschützte Biotope nach § 30 BNatSchG im Feld nicht rechtssicher ansprechen, weil die Kartieranleitungen der Länder hunderte Seiten schwere PDF-Bücher sind.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: Client-side Offline-Entscheidungsbaum im Browser + PMTiles GIS-Vektorkacheln, lokaler IndexedDB-Speicher, null Cloud. |
| **V3 · Possibility & Why Now** | **5/5** | Landesbiotopschlüssel liegen digital vor; moderne Mobilbrowser unterstützen Offline-GIS via PMTiles und genaue GNSS-Ortung. |
| **V4 · Future Runway & Longevity** | **5/5** | Bundesnaturschutzgesetz (BNatSchG § 30) und EU-Renaturierungsgesetz verlangen lückenlose Dokumentation geschützter Biotoptypen. |
| **V5 · Civic SWOT Profile** | **4/5** | Schützt gefährdete Lebensräume vor unbemerkter Zerstörung bei Bauvorhaben; untermauert Bürgerstellungnahmen mit exakten BNT-Codes. |
| **V6 · Tech Tree Position** | **4/5** | Roots: BNatSchG § 30, Landes-Kartieranleitungen; Trunk: Geführter Offline-Bestimmungsschlüssel; Branches: Standardisierter QGIS-Export für Landesumweltämter. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: Bundesnaturschutzgesetz § 30, Rote Liste der Biotoptypen Deutschlands (BfN). |
| **Gesamt-Vektorscore** | **31/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: BNatSchG § 30 / BfN Biotoptypenkatalog / PMTiles]
         └── [Trunk: Offline-Kartierassistent mit geführtem Merkmalsbaum im Feld]
                     ├── [Branch A: Plausibilitätsprüfer für Gutachten im Baugenehmigungsverfahren]
                     └── [Branch B: Ehrenamts-Erfassungstool für Schutzgebiets-Monitoring]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Beseitigt die Hürde 500-seitiger Bestimmungsbücher<br>• 100% offline im Funkloch nutzbar<br>• Eindeutige behördliche Codes | • Grenzfälle zwischen sukzessiven Vegetationsstadien erfordern biologische Erfahrung |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizieller Einsatz bei Kartierpraktika an Universitäten<br>• Standardtool für ehrenamtliche Naturschutzbeiräte | • Investoren versuchen Naturschutzgutachten mit Gefälligkeitskartierungen zu schwächen |

**Die Achillesferse:** Unscharfe Übergänge zwischen Sukzessionsstadien (z.B. Vorwald vs. Trockenrasen mit Gehölzanflug) -> Das System weist bei Grenzwerten Übergangs-Wahrscheinlichkeiten und zwingende Indikatorarten-Checklisten aus.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Stiftung Naturschutz / BUND)`
- **Restlücke:** Die Transformation unhandlicher Biotoptypenschlüssel in einen mobilen Offline-Entscheidungsbaum mit GIS-Export.
- **Nächster Handlungsschritt:** Pilot-Test mit ehrenamtlichen Kartierern der Stiftung Naturschutz Berlin.

---

### Review Dossier: Lichtplan-Check (`lichtplan-check`)
**Titel (EN):** Lighting Plan Check · **Domäne:** civic · **Status:** Available
**Empfänger:** Fachgruppe Dark Sky (Vereinigung der Sternfreunde e.V.) · BUND Bundesarbeitskreis Licht · Bauplanungsämter

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Inversion. Lacunar Gap: „Bürgerinitiativen und Naturschutzverbände können schädliche Flutlichtanlagen und Industriebeleuchtungen in Bebauungsplänen nicht prüfen, weil die LAI-Lichtimmissionsrichtlinie für Laien unberechenbar ist.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: Vektorberechnung von Lichtkegeln, Streulicht und Blendung im Browser auf OpenStreetMap-Basis, null Server. |
| **V3 · Possibility & Why Now** | **5/5** | OpenStreetMap bietet hochdetaillierte Laternen- und Gebäudedaten; LAI-Messhinweise definieren exakte Schwellenwerte für Lux und Blendung. |
| **V4 · Future Runway & Longevity** | **5/5** | Bundes-Immissionsschutzgesetz (BImSchG), Insektenschutzgesetz und kommunale Beleuchtungssatzungen verschärfen Grenzwerte. |
| **V5 · Civic SWOT Profile** | **4/5** | Schutz von Insekten, Fledermäusen und Anwohnern vor invasiver Lichtverschmutzung; rechtssichere Einwendungen in der Bauleitplanung. |
| **V6 · Tech Tree Position** | **4/5** | Roots: LAI-Lichtimmissions-Richtlinie, OpenStreetMap Overpass; Trunk: Automatischer Lichtkegel- & Blendungs-Simulator; Branches: Vorlage für Bürger-Einwendung im Bauamt. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: Bundes-Immissionsschutzgesetz (BImSchG), Hinweise der Bund/Länder-Arbeitsgemeinschaft für Immissionsschutz (LAI). |
| **Gesamt-Vektorscore** | **32/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: BImSchG / LAI-Licht-Leitlinie / OpenStreetMap Geodaten]
         └── [Trunk: Browserbasierter Lichtimmissions-Prüfer gegen Grenzwerte]
                     ├── [Branch A: Automatischer Einwendungsbrief für Bauplanungsverfahren]
                     └── [Branch B: Kiez-Lichtverschmutzungs-Kataster für Dark-Sky-Initiativen]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Macht komplexe lichttechnische Gutachten für Laien überprüfbar<br>• Rechtssichere Verankerung in BImSchG<br>• Direkter Artenschutz-Effekt für Nachtinsekten | • Genaue Leuchtmittel-Spezifikationen in Bebauungsplänen oft vage formuliert |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Kooperation mit Vereinigung der Sternfreunde und Dark Sky<br>• Bundesweite Anwendung bei kommunalen Sanierungen | • Beleuchtungsindustrie verweist auf vermeintliche Sicherheitsaspekte |

**Die Achillesferse:** Fehlende Leuchtmitteldaten (Lichtstrom Lumen, Abstrahlcharakteristik) in öffentlichen Planunterlagen -> Tool berechnet Worst-Case- und Best-Case-Szenarien nach standardisierten DIN-Leuchtentypen.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Dark Sky / BUND)`
- **Restlücke:** Die Übersetzung der LAI-Lichtleitlinie in eine interaktive Karte zur Prüfung kommunaler Flutlicht- und Straßenbeleuchtungspläne.
- **Nächster Handlungsschritt:** Bereitstellung für die Fachgruppe Dark Sky.

---

### Review Dossier: Kartierlotse (`kartierlotse`)
**Titel (EN):** Mapping Pilot · **Domäne:** civic · **Status:** Available
**Empfänger:** Landesämter für Naturschutz · Kartierbüros · BUND / NABU Landesverbände

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Freilandbiologen müssen Geländefunde mühsam auf Papier erfassen und abends manuell digitalisieren, weil professionelle GIS-Software im Gelände zu schwerfällig und teuer ist.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 2: Offline PMTiles Karten-Layer, lokales IndexedDB-Speichermodell, automatische Koordinatentransformation (EPSG:25832/25833), zero cloud. |
| **V3 · Possibility & Why Now** | **5/5** | WASM-basierte GIS-Bibliotheken (PMTiles, Proj4js) laufen flüssig in modernen Browsern; GNSS-Empfänger in Smartphones erreichen Sub-Meter-Genauigkeit. |
| **V4 · Future Runway & Longevity** | **4/5** | Dauerhafter Bedarf für FFH-Monitoring, Eingriffs-Ausgleichs-Planung und Umweltverträglichkeitsprüfungen. |
| **V5 · Civic SWOT Profile** | **4/5** | Offenes, barrierefreies Werkzeug für Freilandforscher; verhindert Medienbrüche und Übertragungsfehler von Felddaten. |
| **V6 · Tech Tree Position** | **4/5** | Roots: PMTiles, Proj4js, IndexedDB; Trunk: Leichtgewichtiges Offline-Kartier-Frontend; Branches: Vollständiger GeoPackage- & Shapefile-Export für QGIS. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type B: Kartierstandards der Landesumweltämter, INSPIRE-Geodatenspezifikationen. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 2` · **Quellentyp:** `Type B` |

#### 2. Tech Tree Position
```
[Roots: PMTiles / Proj4js / HTML5 Geolocation / IndexedDB]
         └── [Trunk: Offline-fähiges Freiland-Kartiertool mit QGIS-Export]
                     ├── [Branch A: Standardisierte FFH-Erfassungsbögen im Mobilbrowser]
                     └── [Branch B: Ehrenamts-Plattform für Großschutzgebiete]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • 100% offline im Wald und Moor einsetzbar<br>• Keine teuren Lizenzen (im Ggs. zu ArcGIS Field Maps)<br>• Direkter GeoPackage-Export | • Smartphone-GPS unter dichtem Kronendach kann bis zu 10 Meter driften |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Standardwerkzeug für universitäre Freilandpraktika<br>• Bundesweite Adoption bei Naturschutzverbänden | • Kommerzielle GIS-Anbieter bündeln mobile Apps in geschlossenen Ökosystemen |

**Die Achillesferse:** GPS-Ungenauigkeit im dichten Wald führt zu Fehlkartierungen -> Integration eines visuellen Referenzierungs-Modus gegen Orthofotos und Anzeige des horizontalen HDOP-Fehlerkreises.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Naturschutzverbände)`
- **Restlücke:** Ein radikal einfaches, offlinefähiges Browser-Werkzeug für biologische Felderfassungen mit sauberem QGIS-Export.
- **Nächster Handlungsschritt:** Bereitstellung des lauffähigen Codes für Freiland-Kartiergruppen.

---

### Review Dossier: Denkmal-Verlaufsblick (`denkmal-verlaufsblick`)
**Titel (EN):** Heritage Decay Timeline · **Domäne:** civic · **Status:** Available
**Empfänger:** Landesdenkmalamt Berlin · Deutsche Stiftung Denkmalschutz · Historische Kiezbündnisse

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Inversion. Lacunar Gap: „Bürger und Denkmalschützer können den schleichenden Verfall oder illegale bauliche Veränderungen an Denkmälern nicht lückenlos beweisen, weil historische Bildbestände unstrukturiert verstreut sind.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 2: Split-Screen & Opacity-Blend im Browser, Nutzung offener WMS/WMTS-Dienste der Vermessungsämter, lokale Bildentzerrung, zero cloud. |
| **V3 · Possibility & Why Now** | **5/5** | Länder-Geoportale stellen hochauflösende historische Orthofotos (seit den 1920er Jahren) als Open Data bereit; Canvas-Filter ermöglichen interaktive Überlagerung. |
| **V4 · Future Runway & Longevity** | **4/5** | Denkmalschutzgesetze der Länder fordern Erhaltungsgebote; Bürgerinitiativen benötigen beweiskräftige Dokumente gegen Spekulanten-Leerstand. |
| **V5 · Civic SWOT Profile** | **4/5** | Schutz des baukulturellen Erbes vor schleichendem Abriss durch Vernachlässigung; wirksames Kontrollorgan für überlastete Denkmalbehörden. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Offene WMS-Orthofotos, Canvas 2D Homographie; Trunk: Zeitreihen-Vergleichsviewer mit Schieberegler; Branches: Bürger-Denkmalmelder mit Schadensdossier. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type A/B: Denkmalschutzgesetz Berlin (DSchG Bln), Senatsverwaltung Denkmalliste. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 2` · **Quellentyp:** `Type A/B` |

#### 2. Tech Tree Position
```
[Roots: Geoportal WMS-Dienste / Canvas Homographie / Open Data Luftbilder]
         └── [Trunk: Interaktiver Vorher-Nachher-Vergleichsviewer für Baudenkmäler]
                     ├── [Branch A: Automatisches Schadensprotokoll für Denkmalbehörden]
                     └── [Branch B: Kiez-Archiv für stadtgeschichtliche Rundgänge]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Macht historische Open-Data-Luftbilder sofort ohne GIS-Fachwissen nutzbar<br>• Beweissichere Vorher-Nachher-Dokumentation<br>• Keine laufenden Serverkosten | • Perspektivische Schrägaufnahmen alter Fassadenfotos erfordern manuelle Passpunktsetzung |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Partnerschaft mit der Deutschen Stiftung Denkmalschutz<br>• Einsatz in Schulen für Lokalgeschichte | • Immobilienspekulanten klagen gegen Veröffentlichung von Verfallsdokumentationen |

**Die Achillesferse:** Verzerrung historischer Schrägaufnahmen im Vergleich zu exakten Orthofotos -> Einfacher 4-Punkt-Entzerrungs-Assistent im Browser bringt Fassaden auf eine gemeinsame Projektionsebene.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Landesdenkmalamt / Stiftung Denkmalschutz)`
- **Restlücke:** Ein intuitiver Web-Schieberegler zur Aufdeckung schleichenden Denkmalverfalls durch historische Luft- und Fassadenbildüberlagerung.
- **Nächster Handlungsschritt:** Dossier an Landesdenkmalamt und Kiezgeschichts-Initiativen senden.

---

### Review Dossier: Wärmesignatur (`waermesignatur`)
**Titel (EN):** Heat Signature · **Domäne:** civic · **Status:** Available
**Empfänger:** co2online gGmbH (HeizCheck) · Forschungsverbund EnergyMap Berlin · Verbraucherzentrale Energieberatung

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Combinational. Lacunar Gap: „Hausbesitzer und Mieter kennen die tatsächliche thermische Güte ihres Gebäudes nicht, obwohl 12 Monatsablesungen des Gaszählers kombiniert mit Wetterdaten die Signatur exakt beschreiben.“ |
| **V2 · Complexity & Tier** | **5/5** | Tier 1: Numerische lineare Regression im Browser, DWD-Wetterdaten-Abruf, 100% Client-Side, null Server. |
| **V3 · Possibility & Why Now** | **5/5** | Monatliche Verbrauchsinformationen sind nach § 6a HeizkostenV gesetzlich vorgeschrieben; DWD-Klimadaten sind frei verfügbar. |
| **V4 · Future Runway & Longevity** | **5/5** | Gebäudeenergiegesetz (GEG) und EU-Gebäuderichtlinie fordern Sanierungsfahrpläne; die Wärmesignatur liefert die ehrliche energetische Nullmessung. |
| **V5 · Civic SWOT Profile** | **4/5** | Entlarvt falsche Versprechungen von Heizungsinstallateuren; liefert objektive Vorher-Nachher-Werte für Sanierungsmaßnahmen. |
| **V6 · Tech Tree Position** | **4/5** | Roots: VDI 3807, Lineare Regressionsmodelle, DWD Open Data; Trunk: Deterministischer Wärmesignatur-Kalkulator; Branches: Sanierungsberatungs-Prüfbericht. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: VDI 3807 (Energieverbrauchskennwerte für Gebäude), DIN EN 12831. |
| **Gesamt-Vektorscore** | **32/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: VDI 3807 / DWD Klimadaten / § 6a Heizkostenverordnung]
         └── [Trunk: Deterministischer Wärmesignatur-Rechner im Browser]
                     ├── [Branch A: Vorher-Nachher-Sanierungsvalidierung für Eigentümer]
                     └── [Branch B: Plausibilitäts-Check für Heizkostenabrechnungen]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Benötigt keinen komplexen Grundriss, nur 12 Zählerwerte<br>• Mathematisch exakte Trennung von Warmwasser- und Raumwärmebedarf<br>• Vollkommen herstellerunabhängig | • Geringe Aussagekraft bei extrem schwankenden Bewohnerzahlen im Jahresverlauf |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Direkte Erweiterung für den co2online HeizCheck<br>• Standardwerkzeug für Energieberater | • Energieversorger verzögern die Bereitstellung monatlicher Verbrauchsdaten |

**Die Achillesferse:** Sommerlicher Warmwasserverbrauch verzerrt die Steigung der Heizlinie -> Robuste Trennung der Grundlast (Sommermonate) von der temperaturabhängigen Steigung im Regressionsmodell.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (co2online / Verbraucherzentrale)`
- **Restlücke:** Die Ermittlung der tatsächlichen Gebäudeheizlast aus 12 simplen Monatszählerständen ohne Schätzwerte.
- **Nächster Handlungsschritt:** Erstkontakt mit co2online (Partner im EnergyMap-Verbund).

---

### Review Dossier: Beobachtungsposten mit Übergabe (`fugenduell-patenschaft`)
**Titel (EN):** Observation Post with Handover · **Domäne:** civic · **Status:** Available
**Empfänger:** Kiezbündnisse · Stiftung Naturschutz Berlin · Freie Universität Berlin (Biologie-Didaktik)

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Langzeit-Beobachtungen von Kiez-Biodiversität brechen ab, weil engagierte Einzelpersonen umziehen und es keinen standardisierten Übergabeprozess für Beobachtungsstandorte gibt.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 2: Progressive Web App (PWA) mit verschlüsselter QR-Code-Übergabe, lokaler IndexedDB-Speicher, null Benutzerkonto auf Servern. |
| **V3 · Possibility & Why Now** | **5/5** | PWA-Web-Standards ermöglichen vollständige Offline-Nutzung; Web Share API und QR-Code-Generierung erlauben dezentrale Schlüsselübergaben. |
| **V4 · Future Runway & Longevity** | **4/5** | Städtische Anpassung an Klimawandel und Phänologie-Forschung verlangen verlässliche Mehrjahres-Zeitreihen aus dem Kiez. |
| **V5 · Civic SWOT Profile** | **4/5** | Stärkt nachbarschaftliche Bindungen und ökologische Bürgerwissenschaft ohne Plattform-Lock-in. |
| **V6 · Tech Tree Position** | **4/5** | Roots: IndexedDB, Web Cryptography API, QR-Code-Transfer; Trunk: Dezentrales Patenschafts-Logbuch; Branches: Phänologie-Datenexport für Universitäten. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type B: Stiftung Naturschutz Berichte, Phänologie-Leitfäden des DWD. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 2` · **Quellentyp:** `Type B` |

#### 2. Tech Tree Position
```
[Roots: PWA Standards / WebCrypto / IndexedDB / QR-Code Generator]
         └── [Trunk: Dezentraler, übergabefähiger Beobachtungsposten für Kiez-Flora]
                     ├── [Branch A: Phänologische Mehrjahres-Zeitreihe für Stadtforschung]
                     └── [Branch B: Nachbarschaftliches Übergabeprotokoll für Patenschaften]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Löst das fundamentale Problem des Datenabbruchs bei Umzug von Citizen Scientists<br>• Kein zentraler Server nötig<br>• Schafft echte Kiez-Verbindungen | • Physische Zerstörung des Standorts durch Straßenbau oder Pflastererneuerung |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Pilotprojekt in Berliner Umweltbildungszentren<br>• Wissenschaftliche Begleitung durch FU Berlin | • Nachfolge-Pate vernachlässigt die Dokumentation nach Übergabe |

**Die Achillesferse:** Zerstörung der Fuge durch kommunale Wildkrautbeseitigung mit Heißdampf -> Dokumentation von Sukzession und Wiederbesiedlung nach Zerstörungsereignissen als integraler didaktischer Bestandteil.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Kiezbündnisse / FU Berlin)`
- **Restlücke:** Ein serverloses Übergabeprotokoll, das bürgerwissenschaftliche Mikro-Standorte über Generationen von Paten hinweg am Leben erhält.
- **Nächster Handlungsschritt:** Kooperation mit Berliner Kiez-Umweltgruppen.

---

### Review Dossier: Sperrmüll-Weiche (`sperrmuell-weiche`)
**Titel (EN):** Bulky Waste Switch · **Domäne:** civic · **Status:** Available
**Empfänger:** BSR (Berliner Stadtreinigung) · Re-Use Berlin / SenUMVK

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Asymmetric Inversion. Lacunar Gap: „Kommunale Entsorger verbrennen gut erhaltene Möbel, weil der Bürger bei der Buchung keinen finanziellen Anreiz hat, wiederverwendbare Stücke für Gebrauchtwarenhäuser auszuweisen.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 2: Foto-Klassifikator im Web-Buchungsformular der Stadtreinigung, dynamischer Gebührenrabatt bei Re-Use-Freigabe, Integration in BSR-Routing. |
| **V3 · Possibility & Why Now** | **5/5** | Webbasiertes Mobile Vision erkennt Möbelkategorien und Erhaltungszustand; die BSR betreibt mit der NochMall bereits die physische Verwertungskette. |
| **V4 · Future Runway & Longevity** | **5/5** | Kreislaufwirtschaftsgesetz (KrWG § 6) fordert strikten Vorrang der Wiederverwendung; Berliner Zero-Waste-Gesetz setzt harte Wiederverwendungsquoten. |
| **V5 · Civic SWOT Profile** | **4/5** | Ökologische Lenkungswirkung: Finanzieller Rabatt für Bürger, Erhalt von Rohstoffen, Warenschub für kommunale Gebrauchtwarenkaufhäuser. |
| **V6 · Tech Tree Position** | **4/5** | Roots: KrWG § 6, Mobile Vision API, BSR-Buchungslogik; Trunk: Wiederverwendungs-Weiche mit Preisstaffelung; Branches: Automatisches NochMall-Warenwirtschafts-Routing. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A/B: Kreislaufwirtschaftsgesetz (KrWG), Berliner Zero-Waste-Strategie, BSR-Geschäftsbericht. |
| **Gesamt-Vektorscore** | **32/35** | **Tier-Klasse:** `Tier 2` · **Quellentyp:** `Type A/B` |

#### 2. Tech Tree Position
```
[Roots: KrWG § 6 / BSR Tarifstruktur / Mobile Vision Klassifikator]
         └── [Trunk: Buchungsweiche für Sperrmüll mit Wiederverwendungs-Rabatt]
                     ├── [Branch A: NochMall Warenstrom-Zuführung statt Müllverbrennung]
                     └── [Branch B: Transparente CO2-Einsparungsbilanz für die Stadt]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Finanzieller Anreiz (Rabatt) bringt Bürger zur ehrlichen Mithilfe<br>• Schließt die Lücke zwischen Abholung und NochMall<br>• Erfüllt kommunale Zero-Waste-Ziele | • Bürger deklarieren defekten Schrott fälschlich als 'gut', um Rabatt zu erhalten |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Blaupause für alle kommunalen Entsorgungsbetriebe in Deutschland<br>• Massive Entlastung der Müllverbrennungsanlagen | • Speditionsmitarbeiter der BSR überfordert mit Zustandskontrolle vor Ort |

**Die Achillesferse:** Fehldeklaration durch Bürger zur Gebühreneinsparung -> Vorab-Fotoanalyse mit Plausibilitätsfilter und eindeutiger Klausel: Entpuppt sich das Möbelstück vor Ort als Totalschaden, greift die reguläre Sperrmüllgebühr.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (BSR / SenUMVK)`
- **Restlücke:** Die finanzielle und logistische Weichenstellung vor der Abholung, die Re-Use billiger macht als Müllverbrennung.
- **Nächster Handlungsschritt:** Vorstellung der Weichenlogik bei der BSR Zero-Waste-Abteilung.

---

### Review Dossier: Bleifrei-Lotse (`bleifrei-lotse`)
**Titel (EN):** Lead-Free Navigator · **Domäne:** civic · **Status:** Available
**Empfänger:** Verbraucherzentrale Bundesverband (vzbv) · Deutscher Mieterbund (DMB) · Gesundheitsamt Berlin-Mitte

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Asymmetric Inversion. Lacunar Gap: „Mieter in Altbauten vor 1973 haben keine zerstörungsfreie Methode, um den Bleistatus ihrer Leitungen vor dem gesetzlichen Stilllegungsverbot 2026 ohne 100-€-Laboranalyse rechtssicher zu prüfen.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: 100% Client-Side Web Audio FFT für Klopfton-Resonanz, Smartphone-Makro für Lötnähte, deterministischer Entscheidungsbaum, null Server. |
| **V3 · Possibility & Why Now** | **5/5** | Harter gesetzlicher Stichtag: 12. Januar 2026 (Stilllegungsverbot gem. § 17 TrinkwV); Commodity-Handykameras und Web Audio lösen Messungen sauber auf. |
| **V4 · Future Runway & Longevity** | **5/5** | Bundesgesetzblatt-Norm (§ 17 TrinkwV) gilt dauerhaft fort; unbegrenzte Wartungshalbwertszeit auf GitHub Pages; Millionen betroffene Altbauwohnungen. |
| **V5 · Civic SWOT Profile** | **4/5** | Defensive Publication (CC0); schützt Mieter vor giftigem Trinkwasser und stärkt Durchsetzung der Vermieterpflichten. |
| **V6 · Tech Tree Position** | **4/5** | Roots: TrinkwV § 17, Web Audio FFT; Trunk: 4-Schritt-Prüfkette + PDF-Musteranzeige; Branches: Kommunales Meldeportal für überlastete Gesundheitsämter. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: Trinkwasserverordnung 2023 § 17 (BGBl. I Nr. 159). |
| **Gesamt-Vektorscore** | **31/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: TrinkwV 2023 § 17 / Web Audio FFT / PDFMake]
         └── [Trunk: 4-Schritt-Prüfkette (Magnet/Ritzung/Lötung/Klopfton) + Rechtsanzeige]
                     ├── [Branch A: Zivilgesellschaftliche Meldeplattform für Mietervereine]
                     └── [Branch B: Kommunales Fall-Dashboard für Gesundheitsämter]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • 100% datensparsam und kostenlos<br>• Keine teuren Labor-Kits nötig<br>• Rechtssichere Verankerung in § 17 TrinkwV | • Verdeckte Steigleitungen hinter Mauern bleiben unsichtbar<br>• Keine DIN-ISO Laborakkreditierung |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Übernahme durch vzbv und Mieterbund<br>• Schließt die Vollzugslücke der Gesundheitsämter | • Rechtliche Einschüchterungsversuche durch Vermieterverbände |

**Die Achillesferse:** Verwechslung von verzinktem Eisen mit Blei -> Zwingender Magnet-Vorfilter (Magnete haften an Eisen, nie an Blei) filtert 90% der Fehlalarme vor der Kratzprobe aus.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Verpackt in Dose #39)`
- **Restlücke:** Die geführte mobile Prüfkette vor Ort, die aus dem Smartphone ein diagnostisches Werkzeug macht und direkt den gesetzeskonformen Brief an Vermieter und Amt erzeugt.
- **Nächster Handlungsschritt:** Kaltmail an vzbv und DMB versenden.

---

## 4. Domäne II: Physik, Simulation & Werkstoffsensorik (Physics & Simulation · 8 Dosen)

### Review Dossier: EuroBirdCast (`eurobirdcast`)
**Titel (EN):** EuroBirdCast: Auditable Migration Curtailment · **Domäne:** physics · **Status:** Available
**Empfänger:** Deutsche WindGuard · Bundesverband WindEnergie (BWE) · NABU Bundesfachausschuss Windenergie

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Transformational. Lacunar Gap: „Europäische Windparkbetreiber haben kein auditierbares, quelloffenes Kurzfrist-Prognosemodell für Vogelzug-Dichtewellen, um pauschale Abschaltungen durch bedarfsgerechte Rotorstopps zu ersetzen.“ |
| **V2 · Complexity & Tier** | **3/5** | Tier 2/3: Verarbeitet offene Wetterradar-Daten (OPERA / DWD Dual-Pol) und eBird-Modelle; erfordert automatisierte Datenpipelines für HDF5-Radardaten. |
| **V3 · Possibility & Why Now** | **4/5** | Europäisches Wetterradarnetzwerk OPERA stellt Vogelzug-Echodaten frei zur Verfügung; Dual-Pol-Radar unterscheidet Insekten von Vogelschwärmen. |
| **V4 · Future Runway & Longevity** | **5/5** | EU Renewable Energy Directive (RED III) vs. EU-Vogelschutzrichtlinie erzeugt massiven Druck für bedarfsgerechtes Abschaltmanagement. |
| **V5 · Civic SWOT Profile** | **4/5** | Löst den Zielkonflikt zwischen Energiewende und Artenschutz; verhindert den Verlust von Millionen Kilowattstunden Windstrom. |
| **V6 · Tech Tree Position** | **4/5** | Roots: OPERA HDF5 Radarfeed, Python Py-ART; Trunk: 24h Vogelzug-Biomasse-Fluss-Prognosekern; Branches: SCADA-Abschalt-Schnittstelle für Windkraftanlagen. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A/D: BWE-Abschaltrichtlinien, Studien der Schweizerischen Vogelwarte Sempach (Schmid et al.). |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 2/3` · **Quellentyp:** `Type A/D` |

#### 2. Tech Tree Position
```
[Roots: OPERA Radar API / Dual-Pol Doppler-Radar / Py-ART]
         └── [Trunk: Auditierbare Vogelzug-Vorhersage-Engine mit 24h-Horizont]
                     ├── [Branch A: SCADA-Steuerungsschnittstelle für bedarfsgenaue Abschaltung]
                     └── [Branch B: Unabhängiges Monitoring-Dashboard für Naturschutzbehörden]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Auditierbar und quelloffen statt intransparenter Black-Box-Proprietärsysteme<br>• Echtes europäisches Radarnetzwerk als Datenbasis<br>• Riesiger ökonomischer und ökologischer Hebel | • Wetterradar erfasst nur Schwärme, keine einzelnen Großgreifvögel (z.B. Rotmilan) |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Übernahme durch Windenergie-Verbände und Netzbetreiber<br>• EU-Horizon-Forschungsförderung | • Proprietäre Kamera-Abschaltsystemhersteller lobbyieren für geschlossene Standards |

**Die Achillesferse:** Radar erfasst Schwarmzug in 200–2000m Höhe, aber keine tief fliegenden Einzelvögel im Rotorkreis -> Klares Scoping: EuroBirdCast steuert den massenhaften Nachtzug; tagsüber bleiben lokale Kamerasysteme zuständig.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Deutsche WindGuard / BWE)`
- **Restlücke:** Ein offenes, europäisches Kurzfrist-Prognosemodell für Vogelzug-Dichtewellen auf Basis von Wetterradar-Echos.
- **Nächster Handlungsschritt:** Auditierte Roadmap aus `02-recherche/` an Deutsche WindGuard und BWE übermitteln.

---

### Review Dossier: Echter Zufall als Service (`echter-zufall`)
**Titel (EN):** True Hardware Randomness as a Service · **Domäne:** physics · **Status:** Available
**Empfänger:** Chaos Computer Club (CCC) · Universitäten (Informatik/Kryptographie) · Open-Source-Wahlinitiativen

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Zivilgesellschaftliche Webanwendungen und Bürgerräte haben keine öffentlich auditierbare, physikalisch echte Zufallsquelle ohne Abhängigkeit von intransparenten Cloud-Konzernen.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: Lokale Hardware-TRNG-Anbindung (Avalanche-Dioden / Zener-Rauschen) + WebCrypto API + offener NIST-SP-800-90B-Entropietest im Browser. |
| **V3 · Possibility & Why Now** | **4/5** | Preiswerte USB-TRNG-Hardware (TrueRNG, Infinite Noise) ist für jedermann verfügbar; WebCrypto API unterstützt vollständige Signaturketten. |
| **V4 · Future Runway & Longevity** | **4/5** | Wachsende Bedeutung kryptographisch überprüfbarer Bürgerlosverfahren (Bürgerräte) und auditierbarer Lotterien. |
| **V5 · Civic SWOT Profile** | **4/5** | Transparenzanker gegen Manipulation von Losverfahren und kryptographischen Schlüsseln; vollständige Unabhängigkeit von Cloud-Beacons. |
| **V6 · Tech Tree Position** | **4/5** | Roots: BSI AIS 31, NIST SP 800-90B, WebCrypto; Trunk: Echter Entropie-Harvester mit Von-Neumann-Korrektur; Branches: Auditierbare Bürgerrats-Auslosungs-Suite. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: BSI AIS 20/31 (Zertifizierung von Zufallszahlengeneratoren), NIST SP 800-90B. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: BSI AIS 31 / NIST SP 800-90B / Hardware Avalanche Diode]
         └── [Trunk: Auditierbarer Hardware-Entropie-Service mit Signaturnachweis]
                     ├── [Branch A: Manipulationssicheres Bürgerrat-Auslosungstool]
                     └── [Branch B: Lokaler Entropie-Feed für dezentrale Web-Applikationen]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Physikalisch echter Zufall statt mathematischer Pseudozufall<br>• Vollständig auditierbare Signaturkette<br>• Open-Hardware-Kompatibilität | • Hardware-Abhängigkeit (erfordert physikalische Rauschquelle am Host) |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Einsatz bei kommunalen Bürgerräten und Partizipationsverfahren<br>• Referenzimplementierung für Hochschulen | • Hardware-Defekte oder Temperaturdrift schwächen die Entropie unbemerkt |

**Die Achillesferse:** Temperatur- oder Alterungsdrift der Rauschdiode mindert die Shannon-Entropie -> Kontinuierlicher statistischer Online-Test (NIST SP 800-90B) schlägt bei Autokorrelation sofort Alarm.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (CCC / Universitäten)`
- **Restlücke:** Ein manipulationssicherer, zivilgesellschaftlich auditierbarer Hardware-Zufallsdienst für Los- und Kryptoverfahren.
- **Nächster Handlungsschritt:** Code und Dokumentation an CCC-Foren und Kryptographie-Lehrstühle senden.

---

### Review Dossier: Kristallwachstum 3D (`kristallwachstum-3d`)
**Titel (EN):** 3D Crystal Growth Simulation · **Domäne:** physics · **Status:** Available
**Empfänger:** Prof. Dr. Timm John (FU Berlin, Institut für Geologische Wissenschaften)

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Transformational. Lacunar Gap: „Mineralogie- und Geowissenschafts-Studierende können die 3D-Kinetik der Kristallisation und Dendritenbildung im Magma nicht interaktiv mit physikalisch korrekter Phasenfeld-Relaxation erforschen.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: WebGPU Compute Shaders mit CPU-Fallback, 50-Schritte-Kobayashi-Phasenfeldrelaxation, 3MF/STL-Export, zero cloud, 100% im Browser. |
| **V3 · Possibility & Why Now** | **5/5** | WebGPU Standardisierung 2024+ ermöglicht parallele 3D-Gitter-Berechnung direkt auf der GPU; physikalische Kobayashi-Gleichungen laufen in Echtzeit. |
| **V4 · Future Runway & Longevity** | **5/5** | Dauerhafter Einsatz in mineralogischen und werkstoffkundlichen Hochschulcurricula; verifizierter $D_f$-Fraktaldimensions-Literaturvergleich. |
| **V5 · Civic SWOT Profile** | **4/5** | Didaktischer Meilenstein: Macht unsichtbare mikroskopische Wachstumsgesetze physisch und interaktiv begreifbar; schützt Open-Source-Lehrmittel. |
| **V6 · Tech Tree Position** | **5/5** | Roots: Kobayashi 1993 Equations, WebGPU Shaders; Trunk: Hybrid DLA + Phase-Field Engine in `src/engine/kristallwachstum/`; Branches: 3MF-Farbdruck & Dünnschliff-Vergleich. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type D: Kobayashi (Physica D 1993), Witten & Sander (DLA 1981), Geowissenschaftliche Fachliteratur. |
| **Gesamt-Vektorscore** | **33/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Kobayashi Phasenfeld-Gleichungen 1993 / WebGPU Compute Shaders]
         └── [Trunk: 3D-Kristallwachstums-Engine mit CPU/GPU-Hybridkern (Ticket 1 DoD)]
                     ├── [Branch A: Mehrfarbiger 3MF/STL-Export für 3D-Druck in der Lehre (Ticket 2)]
                     └── [Branch B: Dünnschliff-Gefügeanalyse und Fraktaldimensions-Katalog]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Ticket 1 mit 8 Tests vollständig verifiziert<br>• Reale physikalische Gleichungen statt oberflächlicher Partikel-Tricks<br>• Zero-Cloud im Browser | • WebGPU-Unterstützung auf älteren Mobilgeräten erfordert den CPU-Fallback |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Direkte Übernahme durch FU Berlin (Prof. Dr. Timm John)<br>• Einsatz an Geowissenschafts-Fakultäten weltweit | • Proprietäre Materialsimulations-Software (z.B. Thermo-Calc) blockiert akademische Standards |

**Die Achillesferse:** Numerisches Explodieren der Phasenfeldvariablen $\phi$ bei unpassender Zeitschrittweite $dt$ -> Strikte Neumann-Stabilitätsbegrenzung im Kernel fest verankert.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Mail 9 auditiert, bereit für FU Berlin)`
- **Restlücke:** Die erste interaktive 3D-Echtzeit-Simulation von dendritischem Magma-Kristallwachstum im WebGPU-Browser mit 3D-Druck-Export.
- **Nächster Handlungsschritt:** Versand von Mail 9 an Prof. Dr. Timm John (FU Berlin).

---

### Review Dossier: Pin Tumbler Didaktik (`pin-tumbler`)
**Titel (EN):** Pin Tumbler Lockpick Didactics · **Domäne:** physics · **Status:** Available
**Empfänger:** SSDeV (Sportsfreunde der Sperrtechnik Deutschland e. V.) · CCC-Workshops · Schließtechnik-Ausbildung

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Lockpicking-Lernende begreifen die unsichtbare Binding Order und minimale Fertigungstoleranzen nicht, weil Schnittmodelle das haptische Scherkraftgefühl nicht simulieren können.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: 2D Canvas Physics + Web Vibration API für haptisches Feedback beim Stiftsetzen, zero cloud, 100% offline. |
| **V3 · Possibility & Why Now** | **5/5** | Web Vibration API und präzise 2D-Rigid-Body-Mechanik ermöglichen die sensorische Übersetzung von Toleranzen auf Smartphone-Displays. |
| **V4 · Future Runway & Longevity** | **4/5** | Dauerhafter Ausbildungsbedarf für Sicherheitsdienste, Schlüsseldienste und mechanische Aufklärungsworkshops. |
| **V5 · Civic SWOT Profile** | **4/5** | Schafft physikalisches Sicherheitsbewusstsein für mechanische Schließzylinder; entmystifiziert Schlosssicherheit nach DIN EN 1303. |
| **V6 · Tech Tree Position** | **4/5** | Roots: DIN EN 1303, Hookesches Federgesetz; Trunk: Stiftzylinder-Toleranz-Simulator mit Haptik; Branches: Interaktives Schließplan-Lehrmodul. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type A/B: DIN EN 1303 (Schließzylinder für Schlösser), SSDeV Handbuch zur Sperrtechnik. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type A/B` |

#### 2. Tech Tree Position
```
[Roots: DIN EN 1303 / Hookesches Gesetz / Web Vibration API]
         └── [Trunk: Didaktischer Stiftzylinder-Simulator mit Binding-Order-Modell]
                     ├── [Branch A: Haptisches Trainingsmodul für Sperrtechnik-Anfänger]
                     └── [Branch B: Zylinder-Sicherheitsbewertung gegen Picking-Techniken]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Macht unsichtbare Mikrometer-Toleranzen sichtbar und spürbar<br>• 100% didaktischer Open-Source-Ansatz<br>• Keine teuren Übungszylinder nötig | • Vibrationsmotoren von Smartphones variieren stark in Latenz und Stärke |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Empfehlung durch SSDeV und TOOOL<br>• Einsatz in Berufsschulen für Schlosser | • Missverständnis als Einbruchsanleitung (erfordert klare Sicherheitsdidaktik) |

**Die Achillesferse:** Fehlendes taktiles Feedback billiger Android-Vibratoren -> Visuelle Kraftvektor-Anzeige als redundante Unterstützung für präzises Stiftsetzen.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (SSDeV / CCC)`
- **Restlücke:** Ein didaktisches Simulationswerkzeug, das die unsichtbare Binding Order von Stiftzylindern durch Physik und Handy-Vibration erfahrbar macht.
- **Nächster Handlungsschritt:** Vorstellung bei den Sportsfreunden der Sperrtechnik (SSDeV Berlin).

---

### Review Dossier: Räucher-Sim (`raeucher-sim`)
**Titel (EN):** Smokehouse & Curing Simulator · **Domäne:** physics · **Status:** Available
**Empfänger:** Öffentlichkeit / Web-Toy-Szene · Ausstellungshäuser (Futurium, Technikmuseum Berlin / Spectrum)

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Museumsbesucher und Web-Nutzer können Strömungsdynamik und Rauchverhalten nicht mit dem eigenen Atem interaktiv beeinflussen, ohne teure physikalische Windkanäle zu betreten.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: WebGL2 Navier-Stokes-Fluid-Solver + Web Audio Analyser als Windkanal-Sensorik im Browser, zero cloud, latenzfrei. |
| **V3 · Possibility & Why Now** | **5/5** | WebGL2 GPU-Gitter-Fluid-Solver (Jos Stam Algorithmus) läuft mit 60 FPS im Browser; Mikrofon-Eingang dient als empfindlicher Strömungsmesser. |
| **V4 · Future Runway & Longevity** | **4/5** | Dauerhafter Einsatzwert als interaktives Museumsexponat oder didaktisches Web-Toy für Strömungslehre und Physikvermittlung. |
| **V5 · Civic SWOT Profile** | **4/5** | Freudvolles, barrierefreies Werkzeug; verbindet Biofeedback (ruhiger Atem) mit realer Strömungsphysik ohne Accounts oder Werbung. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Navier-Stokes-Gleichungen, Jos Stam Stable Fluids; Trunk: Echtzeit-Fluid-Gitter mit Mikrofonkopplung; Branches: Achtsamkeits-Atemtrainer & Physikexponat. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type D: Jos Stam (SIGGRAPH 1999: Stable Fluids), Lehrbücher der Strömungsmechanik. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Navier-Stokes-Gleichungen / Jos Stam Fluids / Web Audio API]
         └── [Trunk: Atem-reaktive WebGL2-Rauchströmungs-Simulation in Echtzeit]
                     ├── [Branch A: Interaktives Museumsexponat für Physikdidaktik]
                     └── [Branch B: Stressreduzierendes Biofeedback-Werkzeug]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Faszinierende taktile Erfahrung ohne Berührung (rein über Atem)<br>• Kein Backend, kein Datenabfluss<br>• Perfekt für Kiosk-Modi | • Umgebungslärm im Ausstellungsraum kann Windstoß fälschlich auslösen |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Ausstellung im Futurium oder Deutschem Technikmuseum Berlin<br>• Open-Source-Komponente für EdTech | • Kommerzielle Meditations-Apps monopolisieren visuelle Atemtools |

**Die Achillesferse:** Hintergrundgeräusche im Museum übersteuern den Mikrofoneingang -> Dynamischer Hochpassfilter und adaptive Schwellenwert-Kalibrierung auf Raumpegel.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Futurium / Technikmuseum)`
- **Restlücke:** Eine physikalisch fundierte Rauchsimulation, die unmittelbar auf den menschlichen Atem reagiert — ohne Score, ohne Konto.
- **Nächster Handlungsschritt:** Exponat-Dossier an Ausstellungsgestalter von Futurium und Spectrum senden.

---

### Review Dossier: KlangStethoskop (`klang-stethoskop`)
**Titel (EN):** Acoustic Machine Stethoscope · **Domäne:** physics · **Status:** Available
**Empfänger:** Netzwerk Reparatur-Initiativen · Anstiftung · Handwerkskammern & Sozialbetriebe

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Inversion. Lacunar Gap: „Ehrenamtliche in Reparatur-Cafés können beginnende Lagerschäden an Waschmaschinen und Pumpen nicht objektiv nachweisen, weil professionelle Schwingungssensoren tausende Euro kosten.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: Web Audio AudioWorklet mit Hüllkurvendemodulation (Envelope Analysis) und FFT-Spektralanalyse im Browser, zero cloud. |
| **V3 · Possibility & Why Now** | **5/5** | Übertragung von Körperschall über einen einfachen Metallschraubendreher ans Handymikrofon; moderne Browser rechnen AudioWorklets in Echtzeit. |
| **V4 · Future Runway & Longevity** | **4/5** | EU-Recht auf Reparatur (Right to Repair) und Abfallvermeidung schaffen dauerhaften Bedarf in zivilgesellschaftlichen Werkstätten. |
| **V5 · Civic SWOT Profile** | **4/5** | Demokratisiert professionelle Instandhaltungsdiagnostik; schützt vor voreiligem Wegwerfen reparierbarer Haushaltsgroßgeräte. |
| **V6 · Tech Tree Position** | **4/5** | Roots: DIN ISO 10816, Web Audio Worklet; Trunk: Schockpuls- & Lagerfrequenz-Rechner (BPFI/BPFO); Branches: Reparatur-Café Wissensdatenbank. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type A/D: DIN ISO 10816 (Mechanische Schwingungen von Maschinen), Wälzlager-Berechnungsformeln. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type A/D` |

#### 2. Tech Tree Position
```
[Roots: DIN ISO 10816 / Wälzlagergeometrie / Web Audio Worklet]
         └── [Trunk: Akustisches Körperschall-Stethoskop für Lagerschäden]
                     ├── [Branch A: Fehlermuster-Erkennung für Haushaltsgeräte-Reparatur]
                     └── [Branch B: Open-Hardware Schraubendreher-Messadapter]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Kostet null Euro zusätzliche Hardware (nutzt Schraubendreher als Schallleiter)<br>• Objektive Schadensanalyse statt subjektivem Gehör<br>• Datensparsam | • Umgebungslärm im belebten Reparatur-Café stört Luftmikrofone |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Bundesweiter Einsatz im Netzwerk der Reparatur-Initiativen<br>• Übernahme durch Jugend forscht Projekte | • Hersteller verkleben Gehäuse, sodass kein Körperschallkontaktpunkt erreichbar ist |

**Die Achillesferse:** Störschall aus dem Raum überlagert das schwache Lagerkratzen -> Zwingende Nutzung eines Körperschall-Tastkopfs (Schraubendreher) kombiniert mit steilem Bandpassfilter.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Netzwerk Reparatur-Initiativen)`
- **Restlücke:** Die Umwandlung des Smartphones in ein akustisches Schwingungsstethoskop zur Erkennung von Lagerschäden in Haushaltsgeräten.
- **Nächster Handlungsschritt:** Pilot-Workshop mit Berliner Reparatur-Cafés.

---

### Review Dossier: Feuerkugel-Sofortnetz (`feuerkugel-sofortnetz`)
**Titel (EN):** Fireball Rapid Network · **Domäne:** physics · **Status:** Available
**Empfänger:** AllSky7 Fireball Network · DLR Institut für Planetenforschung · Arbeitskreis Meteore e.V.

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Transformational. Lacunar Gap: „Meteoritenforscher verlieren wertvolle Fundstücke, weil optische All-Sky-Kameras bei hellen Boliden überstrahlen und akustische Überschall-Schockwellen von Bürgern ungenutzt verhallen.“ |
| **V2 · Complexity & Tier** | **3/5** | Tier 2/3: Akustische Schockwellen-Erfassung via Web Audio, automatisches Zeitstempel-Cross-Matching über NTP/GNSS, ephemerer Triangulations-Server. |
| **V3 · Possibility & Why Now** | **4/5** | Smartphone-Zeitsynchronisation erreicht Millisekunden-Genauigkeit; Infraschall- und Knallwellen-Modelle der Planetenforschung sind publiziert. |
| **V4 · Future Runway & Longevity** | **4/5** | Wissenschaftlicher Dauerwert für Meteoritenbergung und planetare Atmosphäreneintritts-Forschung. |
| **V5 · Civic SWOT Profile** | **4/5** | Ermöglicht Bürgerbeteiligung bei seltenen astronomischen Naturereignissen; liefert Forschern binnen Stunden exakte Fallkorridore. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Ceplecha Boliden-Physik, Web Audio FFT, NTP; Trunk: Akustischer Sofort-Detektor für Überschallknall; Branches: AllSky7 Triangulations-Pipeline. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type D: Ceplecha et al. (Meteor Fall Dynamics 1998), DLR-Meteoritennetzwerk-Berichte. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 2/3` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Boliden-Physik / Smartphone NTP-Sync / Web Audio Infraschall]
         └── [Trunk: Dezentrales akustisches Knallwellen-Erfassungsnetzwerk]
                     ├── [Branch A: Sofort-Triangulation des Streufelds für Meteoritenjäger]
                     └── [Branch B: Datenabgleich mit AllSky7 und DLR-Kameras]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Funktioniert auch bei dichter Bewölkung, wenn Kameras blind sind<br>• Extrem hohe Präzision durch Zeitdifferenzmessung<br>• Bürgerwissenschaftlich | • Extrem seltene Ereignisse (Boliden über bewohntem Gebiet nur wenige Male pro Jahr) |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Feste Einbindung in das europäische AllSky7-Netzwerk<br>• Kooperation mit DLR | • Fehlalarme durch Baustellenlärm, Überschall-Militärjets oder Sommergewitter |

**Die Achillesferse:** Überschallknalle von Militärjets erzeugen ähnliche akustische Signaturen -> Automatischer Abgleich mit offenen ADS-B-Flugtransponderdaten zur Ausfilterung von Jet-Knallwellen.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (DLR / AllSky7)`
- **Restlücke:** Ein dezentrales akustisches Sofort-Netzwerk, das den Überschallknall von Feuerkugeln für die Bergung von Meteoriten trianguliert.
- **Nächster Handlungsschritt:** Kontaktaufnahme mit Dr. Mike Hankey (AllSky7) und DLR Planetenforschung.

---

### Review Dossier: Bruchlesen (`bruchlesen`)
**Titel (EN):** Reading Fractures · **Domäne:** physics · **Status:** Available
**Empfänger:** BAM (Bundesanstalt für Materialforschung und -prüfung) · DGM Arbeitskreis Fraktographie · Forensik-Labore

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Transformational. Lacunar Gap: „Glaser, Gutachter und Forensiker können Glasbruchursachen vor Ort nicht berechnen, weil die fraktographische Bruchanalyse (Bruchspiegelradius nach Shand/Orr) Speziallaboren vorbehalten ist.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: Mathematischer Solver für Bruchspannung $\sigma_f = K_B / \sqrt{r_m}$, interaktive Ellipsenmessung auf Fotos im Canvas, zero cloud. |
| **V3 · Possibility & Why Now** | **5/5** | Smartphone-Makrokameras lösen Spiegelzonen und Mist-Hackles von Bruchkanten mikroskopisch auf; mathematische Bruchmechanik läuft im Browser. |
| **V4 · Future Runway & Longevity** | **4/5** | Dauerhafter Streitpunkt bei thermischem Glasbruch vs. mechanischer Beschädigung in Bauschadensgutachten und Kriminalforensik. |
| **V5 · Civic SWOT Profile** | **4/5** | Macht hochentwickelte Werkstoffforensik für Praktiker auf der Baustelle zugänglich; beendet fruchtlose Schuldstreitigkeiten bei Glasbrüchen. |
| **V6 · Tech Tree Position** | **5/5** | Roots: Griffith-Kriterium, Shand-Bruchspiegelgleichung, Orr-Konstanten; Trunk: Interaktiver Fraktographie-Rechner; Branches: BAM-Schulungsmodul für Glaser. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type D: Orr (1972), Shand (1954), Fachliteratur des DGM-Arbeitskreises Fraktographie. |
| **Gesamt-Vektorscore** | **32/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Shand/Orr-Bruchmechanik / Griffith-Kriterium / Canvas 2D]
         └── [Trunk: Mobiles Fraktographie-Messwerkzeug für Glasbruchursachen]
                     ├── [Branch A: Gutachter-Prüfbericht (Thermoschock vs. Biegebruch)]
                     └── [Branch B: Interaktives Didaktik-Modul für Werkstoffprüfung an Hochschulen]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Echte physikalische Quantifizierung der Bruchspannung<br>• Ersetzt das Bauchgefühl von Sachverständigen durch Formeln<br>• 100% Client-Side | • Zersplittertes Einscheibensicherheitsglas (ESG) hinterlässt oft keine lesbaren Bruchenden |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Standard-Schulungswerkzeug des DGM Arbeitskreises Fraktographie<br>• BAM-Kooperation | • Versicherungen zweifeln Smartphone-Messungen im Rechtsstreit an |

**Die Achillesferse:** Fehlmessung durch falsche Identifikation der Spiegelzone bei schrägem Lichteinfall -> Geführter Foto-Assistent mit standardisiertem Streiflicht-Winkel und Kalibriermaßstab (z.B. Münze).

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (BAM / DGM)`
- **Restlücke:** Die Übertragung der klassischen Labor-Fraktographie von Glas in ein feldtaugliches, mobiles optisches Messwerkzeug.
- **Nächster Handlungsschritt:** Dossier an die Bundesanstalt für Materialforschung und -prüfung (BAM) übergeben.

---

## 5. Domäne III: Entwicklerwerkzeuge & Agenten-Infrastruktur (Developer Tooling · 7 Dosen)

### Review Dossier: Agent Postmortem Recorder (`agent-postmortem-recorder`)
**Titel (EN):** Agent Postmortem Recorder · **Domäne:** tools · **Status:** Available
**Empfänger:** Bayram Annakov (claude-reflect) · LangSmith / AutoGen / AGY Communities · Tessl

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Entwickler autonomer KI-Agenten haben kein standardisiertes Flugschreiber-Format, um Endlosschleifen, Tool-Drift und Kontext-Kollapse nach einem Abbruch deterministisch zu sezieren.“ |
| **V2 · Complexity & Tier** | **5/5** | Tier 1: Stdlib-only Python/TypeScript-Logparser, zero cloud, keine externen Datenbanken, lokale Analyse von transcript.jsonl-Traces. |
| **V3 · Possibility & Why Now** | **5/5** | Agentic Frameworks schreiben strukturierte JSONL-Transkripte; Sequence Alignment und Recurrence-Ranking laufen ohne LLM deterministisch. |
| **V4 · Future Runway & Longevity** | **4/5** | Rasanter Anstieg von Multi-Agenten-Systemen in der Softwareentwicklung; akuter Bedarf an robuster Ausfall-Diagnostik. |
| **V5 · Civic SWOT Profile** | **4/5** | Verhindert teure API-Tokens durch frühzeitiges Erkennen von Agenten-Endlosschleifen; liefert unbestechliche Logs für Open-Source-Maintainer. |
| **V6 · Tech Tree Position** | **4/5** | Roots: JSONL Transcript Schema, Sequence Alignment; Trunk: Recurrence-Ranking & Loop-Detector; Branches: Automatisches CI-Regression-Gate für Agenten. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type C/D: claude-reflect Architektur, wissenschaftliche Studien zu Agentic Failure Modes. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type C/D` |

#### 2. Tech Tree Position
```
[Roots: Agent JSONL Transkripte / String Distance / Sequence Alignment]
         └── [Trunk: Deterministischer Agenten-Flugschreiber & Loop-Detektor]
                     ├── [Branch A: PR-Optimierungsmodul für claude-reflect]
                     └── [Branch B: CI-Regressionstest-Suite gegen Prompt-Drift]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • 100% deterministisch (keine LLM-Kosten für die Analyse)<br>• Null Abhängigkeiten (stdlib-only)<br>• Sofortiger Nutzen bei Debugging komplexer Agenten | • Proprietäre Agenten-Frameworks ändern ihre Log-Formate häufig |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Direkter Pull Request in Bayram Annakovs claude-reflect Repo<br>• Standard-Diagnosetool für Antigravity-Agenten | • Große Cloud-Monitoring-Plattformen integrieren ähnliche Basisfunktionen |

**Die Achillesferse:** Inkonsistente Schema-Formate unterschiedlicher Agenten-Laufzeiten -> Flexibler Adapter-Layer für standardisierte Tool-Call- und Message-Typen.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Scaffolding in 07-demos fertig)`
- **Restlücke:** Ein leichtgewichtiger, deterministischer Flugschreiber, der wiederkehrende Korrekturmuster und Schleifen in Agenten-Transkripten isoliert.
- **Nächster Handlungsschritt:** Pull Request auf github.com/BayramAnnakov/claude-reflect eröffnen.

---

### Review Dossier: Diffgeist (`diffgeist`)
**Titel (EN):** Diffgeist · **Domäne:** tools · **Status:** Available
**Empfänger:** GitHub Tooling Community · GitLab · Open-Source-Maintainer

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Code-Reviewer müssen hunderte Zeilen trivialer Refactorings und Formatierungen manuell filtern, weil zeilenbasierte Diffs semantische Umbenennungen nicht verstehen.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: Tree-sitter WASM im Browser für AST-Differenzierung in Echtzeit, zero cloud, keine Server-Infrastruktur. |
| **V3 · Possibility & Why Now** | **5/5** | Tree-sitter WASM läuft in jedem modernen Webbrowser; AST-Diff-Algorithmen (GumTree) sind akademisch ausgereift. |
| **V4 · Future Runway & Longevity** | **4/5** | Dauerhafter Schmerzpunkt im gesamten Software-Engineering; beschleunigt PR-Reviews und senkt kognitive Ermüdung. |
| **V5 · Civic SWOT Profile** | **4/5** | Schützt Entwickler vor subtilen Fehlern, die in riesigen Refactoring-Diffs versteckt werden; datensparsames Open-Source-Tooling. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Tree-sitter Grammars, GumTree-Algorithmus; Trunk: Semantischer AST-Diff-Kern; Branches: Browser-Extension für GitHub und GitLab. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type D: Falleri et al. (Fine-grained and Accurate Source Code Differencing, ASE 2014). |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Tree-sitter WASM / GumTree AST Diff / Web Workers]
         └── [Trunk: Semantische Diff-Engine für Code-Transformationen im Browser]
                     ├── [Branch A: GitHub/GitLab Review-Erweiterung mit Intentions-Filtern]
                     └── [Branch B: Automatischer Changelog-Generator aus semantischen Diffs]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Versteht Umbenennungen und Verschiebungen ohne Rauschen<br>• Läuft 100% lokal im Browser des Reviewers<br>• Unterstützt gängige Programmiersprachen | • Syntaktisch unvollständiger Code während Rebase kann AST-Parser verwirren |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Adoption durch Open-Source-Maintainer großer Repositories<br>• Integration in IDEs | • GitHub rollt eigene semantische Diff-Funktionen aus |

**Die Achillesferse:** Syntaxfehler in unfertigen Zwischen-Commits blockieren AST-Generierung -> Robuste Fehler-Erholung (Error-Tolerant Parsing) von Tree-sitter mit Fallback auf Zeilendiff.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (GitHub Tooling / Maintainer)`
- **Restlücke:** Die semantische Gruppierung von Code-Änderungen nach Entwickler-Absicht statt rohen Zeilennummern.
- **Nächster Handlungsschritt:** Bereitstellung des lauffähigen Web-Demos für Open-Source-Communities.

---

### Review Dossier: Ghost Replay fürs Editieren (`ghost-replay`)
**Titel (EN):** Ghost Replay · **Domäne:** tools · **Status:** Available
**Empfänger:** Schreibwerkstätten · Code-Review-Teams · Creative Writing Communities

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Autoren und Entwickler können ihre eigenen Formulierungssackgassen nicht retrospektiv analysieren, weil Versionskontrollsysteme nur statische Momentaufnahmen speichern.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: Keystroke-Interval-Trees und CRDT-Event-Replay im Browser, zero cloud, 100% lokale Speicherung in IndexedDB. |
| **V3 · Possibility & Why Now** | **5/5** | CRDT-Bibliotheken (Yjs, Automerge) ermöglichen feingranulare Event-Aufzeichnung ohne Leistungsabfall; Canvas-Timeline rendert Schreibflüsse. |
| **V4 · Future Runway & Longevity** | **4/5** | Wachsendes Interesse an kognitiver Schreibforschung, Programmierdidaktik und authentischer menschlicher Urheberschaft. |
| **V5 · Civic SWOT Profile** | **4/5** | Schafft Transparenz über den Schaffensprozess; hilft Schreibblockaden durch Visualisierung von Pausen und Umformulierungen zu überwinden. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Yjs / Automerge CRDTs, Keystroke Timelines; Trunk: Temporaler Ghost-Player im Texteditor; Branches: Schreibdidaktisches Diagnose-Dashboard. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type D: Cognitive Process Theory of Writing (Flower & Hayes 1981), Keystroke Logging Forschung. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: CRDT Event-Streams / Keystroke Logging / IndexedDB]
         └── [Trunk: Ghost-Replay-Engine zur Rekonstruktion des Schreibflusses]
                     ├── [Branch A: Didaktisches Werkzeug für Schreibberatung an Universitäten]
                     └── [Branch B: Proof-of-Human-Craftsmanship Nachweis gegen KI-Plagiate]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Macht Denk- und Formulierungsprozesse rückwärts abspielbar<br>• Kein Server erforderlich, Daten bleiben auf dem Rechner<br>• Didaktisch wertvoll | • Potenzielle Stigmatisierung als 'Keylogger' bei unbedarfter Wahrnehmung |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Einsatz in universitären Schreibzentren<br>• Plugin für Obsidian und VS Code | • Datenschutzbedenken bei Weitergabe von Schreibprozess-Rohdaten |

**Die Achillesferse:** Keylogging-Verdacht -> Strikte Beschränkung auf das aktive Textdokument, keine Erfassung von Passwörtern oder systemweiten Tastenanschlägen, reine Local-First Architektur.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Schreibwerkstätten / Hochschulen)`
- **Restlücke:** Die Wiederbelebung des Entstehungswegs eines Textes als flüssiger 'Geist' zur Analyse kognitiver Formulierungspfade.
- **Nächster Handlungsschritt:** Vorstellung in Foren für Schreibdidaktik und Local-First-Software.

---

### Review Dossier: Spec-Drift Detector (`spec-drift-detector`)
**Titel (EN):** Spec-Drift Detector · **Domäne:** tools · **Status:** Available
**Empfänger:** GitHub Spec Kit Community · Tessl · Open-Source-Maintainer

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Entwicklungsteams bemerken das Auseinanderdriften von Architekturspezifikationen und realem Code erst beim Systemausfall, weil CI nur Syntax, aber keine Doku-Semantik prüft.“ |
| **V2 · Complexity & Tier** | **5/5** | Tier 1: Zero-Cloud TypeScript CLI / Git-Hook, deterministischer AST-Symbolabgleich gegen Markdown-Spezifikationen, null Cloud. |
| **V3 · Possibility & Why Now** | **5/5** | Unified/Remark Markdown-Parser und TypeScript Compiler API erlauben präzisen Abgleich von Funktionssignaturen und Zusicherungen. |
| **V4 · Future Runway & Longevity** | **4/5** | Wichtiger Hebel für Software-Governance, Sicherheits-Audits und langlebige Open-Source-Infrastruktur. |
| **V5 · Civic SWOT Profile** | **4/5** | Verhindert 'Documentation Rot'; sorgt dafür, dass Sicherheitsgarantien im Code mit der Beschreibung im README übereinstimmen. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Unified Markdown AST, TS Compiler API; Trunk: Spec-vs-Code Drift Engine; Branches: Automatisierter GitHub Actions Spec-Gate-Bot. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type C: GitHub Spec Kit Diskussionen, Formal Specification Verification Leitfäden. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type C` |

#### 2. Tech Tree Position
```
[Roots: Markdown AST / TypeScript Compiler API / Git Pre-Commit Hook]
         └── [Trunk: Deterministischer Spec-Drift-Detector für CI-Pipelines]
                     ├── [Branch A: Automatischer Rot-Färber bei Doku-Code-Divergenz]
                     └── [Branch B: Synchronisations-Assistent für API-Dokumentation]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Färbt den CI-Build rot, bevor falsche Doku in Produktion gelangt<br>• Funktioniert ohne LLM deterministisch über Symbol-Graphen<br>• Geringe Laufzeit | • Reine Text-Umschreibungen ohne Code-Auswirkung können Falsch-Alarme erzeugen |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Standard-Baustein im GitHub Actions Marketplace<br>• Kooperation mit Spec-First Initiativen | • Entwickler umgehen den Hook durch `--no-verify` bei Zeitdruck |

**Die Achillesferse:** Fehlalarme bei rein kosmetischen Doku-Edits -> Semantischer Symbol-Cache prüft gezielt deklarierte Typen, Parameter und Verträge statt roher Absätze.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (GitHub / Spec Kit)`
- **Restlücke:** Ein unerbittlicher CI-Check, der Prosa-Spezifikationen gegen tatsächliche Code-Typen abgleicht und bei Divergenz blockiert.
- **Nächster Handlungsschritt:** Veröffentlichung als eigenständiges GitHub Action Modul.

---

### Review Dossier: BedenkenBlitz (`dose-tradesman-liability-shield`)
**Titel (EN):** QuickObjection (Construction Liability Shield) · **Domäne:** tools · **Status:** Available
**Empfänger:** Zentralverband Deutsches Baugewerbe (ZDB) · Handwerkskammern · Bauinnungen

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Asymmetric Inversion. Lacunar Gap: „Handwerker auf der Baustelle haften für Folgeschäden, weil sie Mängel an Vorleistungen anderer Gewerke nicht binnen 60 Sekunden rechtssicher nach VOB/B rügen können.“ |
| **V2 · Complexity & Tier** | **5/5** | Tier 1: Web Speech API / Offline-Sprachdiktat + deterministischer VOB/B § 4 Abs. 3 Formular-Generator + PDFMake im Browser, zero cloud. |
| **V3 · Possibility & Why Now** | **5/5** | Moderne Smartphone-Spracherkennung funktioniert fehlerfrei; VOB/B-Bedenkenanzeigen folgen einem starren juristischen Formalismus. |
| **V4 · Future Runway & Longevity** | **5/5** | VOB/B ist das Standard-Vertragswerk im deutschen Bauwesen; BGH-Rechtsprechung verschärft die Haftung von Handwerkern bei unterlassener Rüge. |
| **V5 · Civic SWOT Profile** | **5/5** | Existenzrettender Haftungsschutzschirm für kleine Handwerksbetriebe gegen existenzbedrohende Regressforderungen von Generalunternehmern. |
| **V6 · Tech Tree Position** | **4/5** | Roots: VOB/B § 4 Abs. 3, Web Speech API; Trunk: 60-Sekunden-Sprachformular mit PDF-Export; Branches: Baustellen-Mängelprotokoll für Handwerkskammern. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type A: Vergabe- und Vertragsordnung für Bauleistungen (VOB/B § 4 Abs. 3), BGH-Baurechtsprechung. |
| **Gesamt-Vektorscore** | **33/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type A` |

#### 2. Tech Tree Position
```
[Roots: VOB/B § 4 Abs. 3 / Web Speech API / PDFMake]
         └── [Trunk: Mobiler 60-Sekunden-Bedenkenanzeigen-Generator auf der Baustelle]
                     ├── [Branch A: Sofortiger PDF-Versand mit rechtssicherem Zustellnachweis]
                     └── [Branch B: Schulungs-Tool für Handwerks-Meisterkurse]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Schützt Handwerker vor fünfstelligen Haftungsansprüchen<br>• Funktioniert komplett per Spracheingabe mit staubigen Händen<br>• 100% datensparsam | • Baustellenlärm kann Spracherkennung stören (erfordert visuelle Schnell-Auswahl) |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Empfehlung durch ZDB und Handwerkskammern<br>• Integration in Handwerker-Software | • Generalunternehmer reagieren gereizt auf formalisierte Bedenkenanzeigen |

**Die Achillesferse:** Baustellenlärm verhindert Sprachbedienung -> 3-Klick-Auswahl typischer Vorleistungsmängel (Estrich zu feucht, Untergrund uneben, Aussparung fehlt) als lautloser Fallback.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (ZDB / Handwerkskammern)`
- **Restlücke:** Die sofortige Umwandlung eines Vorleistungsmangels auf der Baustelle in ein gerichtsfestes VOB/B-Bedenkenschreiben in unter 60 Sekunden.
- **Nächster Handlungsschritt:** Musterdossier an ZDB und Berliner Handwerkskammer übermitteln.

---

### Review Dossier: Chaos Clock (`chaos-clock`)
**Titel (EN):** Chaos Clock · **Domäne:** tools · **Status:** Available
**Empfänger:** Dr. Katta Spiel (TU Wien, Human-Computer Interaction) · Neurodiversity in Tech Netzwerke

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Transformational. Lacunar Gap: „Neurodivergente Menschen mit Time Blindness geraten durch lineare Digitaluhren und starre Timer in Stress, weil ihnen ein organisches, nicht-lineares Flussmaß für Zeit fehlt.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: Lorenz-Attraktor / Phasenraum-Simulation im WebGL Canvas, zero cloud, reine lokale Mathematik, datensparsam. |
| **V3 · Possibility & Why Now** | **5/5** | GPU-beschleunigte dynamische Systeme laufen flüssig im Browser; Erkenntnisse aus der Disability Studies & Neurodivergenz-Forschung liegen vor. |
| **V4 · Future Runway & Longevity** | **4/5** | Wachsendes Bewusstsein für Neurodiversität und adaptive Arbeitswerkzeuge in Technologieunternehmen und Universitäten. |
| **V5 · Civic SWOT Profile** | **4/5** | Befreit von der Disziplinierungs-Ästhetik konventioneller Zeiterfassung; fördert Fokussierung ohne Schuldgefühle. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Runge-Kutta 4. Ordnung Solver, Lorenz-Gleichungen; Trunk: Phasenraum-Zeiterfassungs-Canvas; Branches: Adaptive Assistenzsysteme für ADHS. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type D: Katta Spiel et al. (Neurodivergent HCI Research), Chaos-Theorie Grundlagen. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Nichtlineare Dynamik / Runge-Kutta 4. Ordnung / WebGL Canvas]
         └── [Trunk: Organische, chaostheoretische Zeiterfassungsuhr für Neurodivergenz]
                     ├── [Branch A: Sanfter Übergangs-Timer ohne akustischen Schock]
                     └── [Branch B: Forschungs-Prototyp für Critical Disability Studies]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Entlastet Menschen mit exekutiver Dysfunktion von Timer-Stress<br>• Wunderschöne mathematische Visualisierung<br>• Zero-Cloud | • Gefahr, dass Nutzer vom Attraktor hypnotisiert werden, statt zu arbeiten |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Kooperation mit TU Wien (Dr. Katta Spiel)<br>• Open-Source-Alternative zu dysfunktionalen Pomodoro-Apps | • Klassische Arbeitgeber fordern starre Zeiterfassungssysteme |

**Die Achillesferse:** Visuelle Hyperfokussierung auf die Bewegung des Attraktors -> Sanfte farbliche Sättigungsänderung des Hintergrunds signalisiert Arbeitsphasen ohne ablenkende Detailbewegung.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (TU Wien / HCI)`
- **Restlücke:** Eine Zeitvisualisierung, die Zeit als dynamischen Raumfluss erfahrbar macht, statt sie in tickende Stress-Sekunden zu zerhacken.
- **Nächster Handlungsschritt:** Übermittlung an Dr. Katta Spiel (TU Wien).

---

### Review Dossier: Couleur-Sphinx (`couleur-sphinx`)
**Titel (EN):** Couleur-Sphinx: Air-Gapped S2S Intercom Gatekeeper · **Domäne:** tools · **Status:** Available
**Empfänger:** Couleurstudentische Geschichtsvereine · Convent Deutscher Korporationsverbände · Archivare

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Historische Korporationsarchive können geschützte Mitgliederbestände nicht institutsübergreifend verifizieren, ohne sensible Daten unverschlüsselt ins Netz zu stellen.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: Air-gapped WebCrypto RSA/ECDSA-Signaturen auf statischen JSON-Datensätzen im Browser, zero cloud, kein zentraler Identitätsserver. |
| **V3 · Possibility & Why Now** | **5/5** | WebCrypto API unterstützt asymmetrische Kryptographie und Zero-Knowledge-Proofs offline im Browser; statische Datensätze bleiben air-gapped. |
| **V4 · Future Runway & Longevity** | **4/5** | Strikte Datenschutzanforderungen (DSGVO) bei historischen Matrikeldaten und Schutz vor Doxing und Datenmissbrauch. |
| **V5 · Civic SWOT Profile** | **4/5** | Ermöglicht sicheren wissenschaftlichen Austausch zwischen dezentralen Archiven ohne Risiko von Identitätsdiebstahl. |
| **V6 · Tech Tree Position** | **4/5** | Roots: WebCrypto SubtleCrypto, JSON Canonicalization (RFC 8785); Trunk: Air-Gapped S2S Gatekeeper; Branches: Verbandsweites Archiv-Verifikationsnetz. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type B: Archivordnungen und historische Matrikelbestimmungen der Korporationsverbände. |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type B` |

#### 2. Tech Tree Position
```
[Roots: WebCrypto API / RFC 8785 JSON Canonicalization / Air-Gap Protokoll]
         └── [Trunk: Offline-Verifikations-Gatekeeper für sensible historische Matrikeln]
                     ├── [Branch A: Kryptographischer Berechtigungsnachweis für Archivare]
                     └── [Branch B: Dezentraler Datenabgleich ohne Cloud-Exposition]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Absolute Air-Gap-Sicherheit schützt vor Netzeinbrüchen<br>• Keine zentrale Datenbank, die gehackt werden kann<br>• Basiert auf offenen Kryptostandards | • Hohe Hürde für ältere ehrenamtliche Archivare bei Schlüsselverwaltung |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Blaupause für andere geschützte Vereins- und Familienarchive<br>• Kooperation mit historischen Verbänden | • Verlust privater Schlüssel führt zum dauerhaften Verlust des Archivzugangs |

**Die Achillesferse:** Schlüsselverlust ehrenamtlicher Archivare -> Einfaches, papierbasiertes QR-Code-Schlüssel-Backup mit deterministischer Seed-Phrase.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Archiv- und Geschichtsvereine)`
- **Restlücke:** Ein air-gapped kryptographischer Gatekeeper für geschützte historische Archive ohne Server-Exposition.
- **Nächster Handlungsschritt:** Bereitstellung des Konzepts für interessierte Archivgemeinschaften.

---

## 6. Domäne IV: Computergestützte Kreativwerkzeuge & Simulation (Computational Creative · 4 Dosen)

### Review Dossier: Tarot als Zustandsmaschine (Spread-DSL) (`tarot-zustandsmaschine`)
**Titel (EN):** Tarot Spread Graph DSL · **Domäne:** creative · **Status:** Available
**Empfänger:** Tina Gong (Labyrinthos) · Interactive Fiction / Narrative Game Communities (Twine/Inkle) · Deck-Künstler

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Transformational. Lacunar Gap: „Künstler und narrative Autoren können komplexe Legesysteme nicht digital austauschen, weil es keine herstellerunabhängige Graph-Spezifikation für Spreads gibt.“ |
| **V2 · Complexity & Tier** | **5/5** | Tier 1: Deterministische Graph-Traversierung und JSON-Schema-Validierung im Browser, zero cloud, reine Client-Side-Logik in `src/engine/tarot/`. |
| **V3 · Possibility & Why Now** | **5/5** | JSON Schema Draft 2020-12 und gerichtete Graph-Algorithmen laufen im Browser ohne externe Abhängigkeiten; Spread-DSL liegt formalisiert vor. |
| **V4 · Future Runway & Longevity** | **4/5** | Wachsendes Interesse an digitalem Storytelling, narrativen Spielmechaniken und herstellerunabhängigen offenen Formaten. |
| **V5 · Civic SWOT Profile** | **4/5** | Schützt die Tarot- und Storytelling-Community vor Closed-Source-App-Monopolen; offene Spezifikation (CC0) für freie Deck-Entwickler. |
| **V6 · Tech Tree Position** | **5/5** | Roots: Gerichtete Graphen, JSON Schema; Trunk: Spread-DSL-Interpreter (`tarotEngine.ts`); Branches: Twine/Inkle Narrative Integration & Druck-Export. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type B/D: Formalisierungsmodelle narrativer Graphen, Labyrinthos Dokumentation. |
| **Gesamt-Vektorscore** | **31/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type B/D` |

#### 2. Tech Tree Position
```
[Roots: Gerichtete Graphen / JSON Schema Draft 2020-12 / SVG Rendering]
         └── [Trunk: Deterministische Spread-DSL-Zustandsmaschine (tarotEngine.ts)]
                     ├── [Branch A: Twine/Inkle Story-Plugin für narrative Spiele]
                     └── [Branch B: Offener JSON-Katalog für historische & moderne Spreads]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Erste formale mathematische Graph-Spezifikation für Legesysteme<br>• Vollständig implementierte Engine mit 4 Tests<br>• Zero-Cloud | • Esoterische Zielgruppe hegt Skepsis gegen mathematische Formalisierung |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Kooperation mit Tina Gong (Labyrinthos)<br>• Standard für Crowdfunding-Deck-Projekte | • Kommerzielle Tarot-Apps kapseln ihre Inhalte in geschlossenen Silos ab |

**Die Achillesferse:** Abstrakte JSON-Syntax überfordert nicht-technische Kartenleger -> Visueller Knoten-Editor im Canvas übersetzt Graphen per Drag-and-Drop in die DSL.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Engine & Tests fertig)`
- **Restlücke:** Die formale Abstraktion von Tarot-Spreads als typisierte gerichtete Graphen in einer offenen JSON-Spezifikation.
- **Nächster Handlungsschritt:** Spezifikation und Engine an Tina Gong (Labyrinthos) übergeben.

---

### Review Dossier: Wet Ink (`wet-ink`)
**Titel (EN):** Wet Ink (Capillary Flow Simulator) · **Domäne:** creative · **Status:** Available
**Empfänger:** Open-Source-Zeichenprogramme (Xournal++, Rnote) · Kalligraphie- & Handschriften-Forschung

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **5/5** | Transformational. Lacunar Gap: „Digitale Kalligraphen und Zeichner haben keine physikalisch korrekte Tintensimulation, die Kapillarfluss, Bleeding und Faseranisotropie in Echtzeit berechnet.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: WebGL/WebGPU Gitter-Diffusions-Solver + Kubelka-Munk Pigmentmischung im Browser, zero cloud, 6 Tests in `src/engine/wet-ink/`. |
| **V3 · Possibility & Why Now** | **5/5** | WebGPU Compute Shaders und SIMD ermöglichen mikroskopische Fasersimulationen mit 60 FPS; Kubelka-Munk-Gleichungen sind mathematisch standardisiert. |
| **V4 · Future Runway & Longevity** | **4/5** | Dauerhafter Bedarf in Notiz- und Mal-Apps; Erhaltung des haptisch-visuellen Gefühls echter Tinte im papierlosen Zeitalter. |
| **V5 · Civic SWOT Profile** | **4/5** | Freies physikalisches Fundament gegen proprietäre Apple/Adobe-Brush-Monopole; verschenkt den Plan und Kern an Open-Source-Projekte. |
| **V6 · Tech Tree Position** | **5/5** | Roots: Kubelka-Munk-Optik, Lattice Boltzmann Kapillardiffusion; Trunk: Ink-on-Paper Engine (`paper.ts`, `kubelka-munk.ts`); Branches: Integration in Xournal++. |
| **V7 · Documentation & Ground Truth** | **5/5** | Type D: Curtis et al. (Computer-Generated Watercolor, SIGGRAPH 1997), Baxter et al. (2004). |
| **Gesamt-Vektorscore** | **32/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Kubelka-Munk-Theorie / Lattice Boltzmann Diffusion / WebGL Shaders]
         └── [Trunk: Physikalische Kapillartinten-Engine (wet-ink/paper.test.ts)]
                     ├── [Branch A: C++/Rust-Bibliothek für Xournal++ und Rnote]
                     └── [Branch B: Historischer Tinten- und Papieralterungs-Simulator]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Phänomenal realistische Randsäume (Edge Darkening) und Faserverlauf<br>• Verifizierte Testsuite (6 Tests passing)<br>• 100% Client-Side | • Hohe Rechenlast bei sehr großen Leinwandauflösungen (> 4K) |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Übernahme als Referenz-Engine für Open-Source Stylus-Apps<br>• Einsatz in digitaler Kunstausbildung | • Hardware-Shader-Unterschiede erfordern sorgfältige Precision-Deklarationen |

**Die Achillesferse:** GPU-Überlastung bei schnellen Strichen über große Flächen -> Multi-Resolution Sparse-Grid-Architektur: Physik wird nur im aktiven Faser-Diffusionsbereich gerechnet.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Plan & Scaffolding fertig)`
- **Restlücke:** Die physikalische Simulation von Tinte auf Papier als echter Kapillarfluss statt oberflächlicher Alphakanal-Pinsel.
- **Nächster Handlungsschritt:** Bereitstellung des C++/WASM-Plans für Xournal++ Maintainer.

---

### Review Dossier: Fugenduell: Asphaltritzen-Arena (`fugenduell-asphalt-arena`)
**Titel (EN):** Crack Duel: Asphalt Crack Arena · **Domäne:** creative · **Status:** Available
**Empfänger:** Stiftung Naturschutz Berlin · Botanischer Verein zu Berlin und Brandenburg · Umweltbildungsträger

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Bisoziation. Lacunar Gap: „Stadtbewohner nehmen Straßenritzenflora nur als störendes Unkraut wahr, weil es an einem spielerischen, mikrolokalen Vergleichsmedium für spontane Überlebensstrategien fehlt.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: Canvas 2D Duell-Arena, Anbindung an Flora Incognita / Pl@ntNet APIs, deterministische Battle-Engine in `src/engine/fugenduell/`. |
| **V3 · Possibility & Why Now** | **4/5** | Pflanzenerkennungs-APIs sind hocheffizient; Gamification-Mechaniken lassen sich elegant mit ökologischen Zeigerwerten verknüpfen. |
| **V4 · Future Runway & Longevity** | **4/5** | Städtische Biodiversitätsstrategien und Umweltbildung suchen dringend nach niederschwelligen Wegen für junge Zielgruppen. |
| **V5 · Civic SWOT Profile** | **4/5** | Macht unscheinbare Stadtpflanzen (Löwenzahn, Vogelknöterich) zu Helden; verbindet Spielspaß mit realer botanischer Artenkenntnis. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Ellenberg-Zeigerwerte, Flora Incognita API; Trunk: Battle-Engine (`battleEngine.ts`); Branches: Schulwettbewerbe & städtische Biodiversitätskarten. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type B/D: Ellenberg-Zeigerwerte für Gefäßpflanzen, Rote Liste Berlin. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type B/D` |

#### 2. Tech Tree Position
```
[Roots: Ellenberg-Ökowerte / Flora Incognita / Canvas 2D]
         └── [Trunk: Rundenbasierte Asphaltritzen-Duell-Engine (14 Tests passing)]
                     ├── [Branch A: Gamifizierte Umweltbildungs-App für Schulen]
                     └── [Branch B: Kiez-Biodiversitäts-Monitoring im Gehwegbereich]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Fertige Battle-Engine mit 14 Tests im Repo<br>• Kombiniert echte botanische Ökowerte mit Spielmechanik<br>• Hoher Spaßfaktor | • Gefahr, dass Nutzer Pflanzen für 'Duell-Siege' manipulieren |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Kooperation mit Stiftung Naturschutz Berlin<br>• Aktion 'Langer Tag der StadtNatur' | • Reine Gaming-Wahrnehmung verdeckt den botanischen Bildungsauftrag |

**Die Achillesferse:** Verfälschung von Standortdaten durch Gaming-Ehrgeiz -> Zwingende Bindung von Kampfpunkten an verifizierte botanische Zeigerwerte und GPS-Plausibilität.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Engine & Tests fertig)`
- **Restlücke:** Die spielerische Überführung von Mauerfugen-Ökologie in ein rundenbasiertes Duell-Erlebnis im Straßenraum.
- **Nächster Handlungsschritt:** Vorstellung der fertigen BattleEngine bei der Stiftung Naturschutz Berlin.

---

### Review Dossier: Das lebende Spielobjekt (`lebendes-spielobjekt`)
**Titel (EN):** The Living Game Object · **Domäne:** creative · **Status:** Available
**Empfänger:** Freie Theatergruppen · Live-Rollenspiel-Veranstalter (LARP) · Museumspädagogen

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Theatermacher und Rollenspieler können keine interaktiven, magisch reagierenden Requisiten bauen, ohne komplexe Mikrocontroller-Hardware zu löten.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: Web Bluetooth API + Web Audio Synthesizer im Smartphone-Browser des Schauspielers, zero cloud, kein Arduino-Zwang. |
| **V3 · Possibility & Why Now** | **5/5** | Web Bluetooth verbindet Standard-Smartphones mit preiswerten Bluetooth-Beacons oder Gyroskopen; Web Audio erzeugt dynamische Klangkulissen. |
| **V4 · Future Runway & Longevity** | **3/5** | Dauerhafter Bedarf in freier Theaterarbeit, immersiven Ausstellungen und interaktivem Storytelling. |
| **V5 · Civic SWOT Profile** | **4/5** | Befreit Künstler von teuren Spezialrequisiten-Herstellern; nutzt vorhandene Smartphones als sensorische Requisiten-Gehirne. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Web Bluetooth API, Web Audio Context; Trunk: Sensor-gesteuerte Sound- & Reaktionsengine; Branches: Interaktive Museumsexponate. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type C/D: HCI Interactive Props Forschung, LARP-Didaktik. |
| **Gesamt-Vektorscore** | **28/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type C/D` |

#### 2. Tech Tree Position
```
[Roots: Web Bluetooth API / Gyroskop-Sensorik / Web Audio Synthese]
         └── [Trunk: Reaktive Sound- und Verhaltensengine für Theater-Requisiten]
                     ├── [Branch A: Magische Requisiten für freie Theaterbühnen]
                     └── [Branch B: Interaktive Führungs-Objekte für Ausstellungshäuser]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Verwandelt jedes Handy in eine magische Theater-Requisite<br>• Kein Löten, keine Spezialhardware<br>• Latenzfreie lokale Soundausgabe | • Bluetooth-Verbindungsabbrüche im dichten Theaterpublikum (2,4 GHz Rauschen) |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Einsatz in der museumspädagogischen Vermittlung<br>• Kooperation mit LARP-Verbänden | • Smartphone-Displays müssen im Spiel dunkel bleiben (erfordert Screen-Off Audio-Worklets) |

**Die Achillesferse:** Bluetooth-Verbindungsabriss während des Auftritts -> Robuster Offline-Autonomie-Modus mit internen Handy-Bewegungssensoren ohne externen Funkzwang.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Freie Theater / LARP)`
- **Restlücke:** Die Verwandlung gewöhnlicher Theaterrequisiten in akustisch und sensorisch reaktive Spielobjekte ohne Hardware-Lötaufwand.
- **Nächster Handlungsschritt:** Bereitstellung für freie Theatergruppen und Rollenspiel-Netzwerke.

---

## 7. Domäne V: Didaktik, Wissenssysteme & Gesundheit (Didactics & Knowledge · 4 Dosen)

### Review Dossier: Bugs als Spaced-Repetition (`bugs-spaced-repetition`)
**Titel (EN):** Bugs as Spaced Repetition · **Domäne:** knowledge · **Status:** Available
**Empfänger:** Software-Engineering-Lehrstühle · Anki-Community · Developer-Bootcamps

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Bisoziation. Lacunar Gap: „Software-Entwickler wiederholen dieselben Denkfehler immer wieder, weil behobene Bugs nach dem PR-Merge aus dem Arbeitsgedächtnis verschwinden.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: Lokaler Git-Diff-Parser + deterministische Frage-Antwort-Generierung + Anki APKG/TSV-Export im Browser, zero cloud. |
| **V3 · Possibility & Why Now** | **4/5** | AST-Diffs isolieren den Kern behobener Fehler; Spaced-Repetition-Algorithmen (SM-2) sind frei implementierbar. |
| **V4 · Future Runway & Longevity** | **4/5** | Dauerhafter Hebel für persönliche Entwickler-Produktivität und Exzellenz in der Softwaretechnik-Ausbildung. |
| **V5 · Civic SWOT Profile** | **4/5** | Macht persönliche Fehltritte zu nachhaltigem Lernkapital; verhindert wiederkehrende Regressionsfehler ohne Überwachung. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Git Diff Parser, SuperMemo SM-2 Algorithmus; Trunk: Commit-to-Flashcard-Pipeline; Branches: VS Code Extension & Team-Wissenspool. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type D: Ebbinghaus (1885: Über das Gedächtnis), Wozniak (SM-2 Algorithmus), SE-Fehlermuster-Forschung. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Git Commit Diffs / SM-2 Algorithmus / Anki APKG Format]
         └── [Trunk: Lokale Git-Fehleranalyse mit automatischer Karten-Erzeugung]
                     ├── [Branch A: VS Code / Cursor Plugin für sofortiges Spaced Repetition]
                     └── [Branch B: Team-Retrospektiven-Modul für wiederkehrende Bug-Muster]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Personalisiertes Lernen an echten eigenen Fehlern statt sterilen Beispielen<br>• 100% lokal ohne Datenübertragung<br>• Nahtloser Anki-Export | • Erfordert Entwickler-Disziplin zum täglichen Wiederholen der Karten |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Einsatz in Universitäts-Programmierkursen<br>• Kooperation mit AnkiWeb-Ökosystem | • Entwickler empfinden Bug-Karten als schambehaftet oder lästig |

**Die Achillesferse:** Schamgefühl beim Betrachten alter Fehler -> Didaktische Rahmung: Fehler werden als 'gehärtete mentale Immunkörper' gefeiert, nicht als Mängel protokolliert.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Anki-Community / Hochschulen)`
- **Restlücke:** Die automatische Übersetzung behobener Git-Fehler in persönliche Spaced-Repetition-Flashcards zur dauerhaften Gedächtnisverankerung.
- **Nächster Handlungsschritt:** Testlauf mit Informatik-Fachschaften.

---

### Review Dossier: Lokales Traumtagebuch mit Motiv-Karte (`traumtagebuch`)
**Titel (EN):** Local Offline Dream Journal · **Domäne:** knowledge · **Status:** Available
**Empfänger:** Obsidian-Plugin-Ökosystem · Local-First Community · Schlafforschung

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Inversion. Lacunar Gap: „Menschen dokumentieren ihre Träume nicht digital, weil kommerzielle Apps intimste psychische Daten in unverschlüsselte Cloud-Datenbanken laden.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1/2: Lokales Obsidian-Plugin / Markdown-First, client-seitige WASM-Embeddings (Transformers.js), 100% Offline-Cluster-Visualisierung. |
| **V3 · Possibility & Why Now** | **4/5** | Lokale Transformer-Embeddings laufen performant im Browser/Electron; 2D-Projektionen (UMAP) visualisieren Traumlandschaften. |
| **V4 · Future Runway & Longevity** | **4/5** | Wachsender Trend zu Local-First-Software und striktem Schutz intimer Tagebuchdaten. |
| **V5 · Civic SWOT Profile** | **4/5** | Absoluter Schutz der Intimsphäre; ermöglicht Selbstreflexion und Erkennen wiederkehrender Traummuster ohne Spionage. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Transformers.js WASM, UMAP Dimensionality Reduction; Trunk: Lokaler Motiv-Cluster-Graph; Branches: Schlaf- & Traumforschungs-Plugins. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type D: Hall & Van de Castle (The Content Analysis of Dreams 1966), Local-First Software Manifesto. |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Transformers.js WASM / UMAP 2D Projektion / Obsidian API]
         └── [Trunk: 100% lokales Traumtagebuch mit topologischer Motiv-Landkarte]
                     ├── [Branch A: Zeitreihen-Analyse wiederkehrender Schlafthemen]
                     └── [Branch B: Exportfilter für wissenschaftliche Schlaflabore]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Null Daten verlassen den Rechner (höchster Vertrauensschutz)<br>• Wunderschöne semantische Traumkarte statt linearer Textlisten<br>• Obsidian-Kompatibilität | • Erst-Download des Embedding-Modells erfordert ca. 40-50 MB Speicher |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Veröffentlichung im offiziellen Obsidian Community Plugin Katalog<br>• Kooperation mit Schlafforschern | • Große Cloud-Tagebuchanbieter werben mit aggressiven KI-Funktionen |

**Die Achillesferse:** Performance-Einbruch beim initialen Laden des Embedding-Modells auf Mobilgeräten -> Leichtgewichtiges TF-IDF/BM25 Schlüsselwort-Clustering als sofortiger Fallback vor dem Vektormodell.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Obsidian Plugin)`
- **Restlücke:** Ein radikal lokales, topologisches Traumtagebuch, das wiederkehrende Traummotive als Landschaft visualisiert, ohne ein Byte zu senden.
- **Nächster Handlungsschritt:** Obsidian Plugin Repository aufsetzen.

---

### Review Dossier: PillSafe Vision (`pillsafe-vision`)
**Titel (EN):** PillSafe Vision · **Domäne:** civic · **Status:** Available
**Empfänger:** Pflegestützpunkte Deutschland · Bundesarbeitsgemeinschaft der Seniorenorganisationen (BAGSO) · Pflegende Angehörige e.V.

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Inversion. Lacunar Gap: „Pflegende Angehörige haben keine mobile Verifikationshilfe, um die korrekte Bestückung von Wochendosetten ohne teure Apotheken-Blisterdienste zu prüfen.“ |
| **V2 · Complexity & Tier** | **3/5** | Tier 1/2: Client-Side Mobile Vision im Browser, Segmentierung des 7x4-Dosettenrasters, Farbabgleich gegen Referenzfoto, zero cloud, DSGVO-sicher. |
| **V3 · Possibility & Why Now** | **4/5** | WebRTC Kamera-Feed und OpenCV WASM ermöglichen genaue Konturen- und Farberkennung auf Smartphones; Gesundheitsdaten bleiben auf dem Gerät. |
| **V4 · Future Runway & Longevity** | **5/5** | Demografischer Wandel; Vermeidung fataler Medikationsverwechslungen (eine der häufigsten Ursachen für Notaufnahme-Einweisungen alter Menschen). |
| **V5 · Civic SWOT Profile** | **4/5** | Schutzschild für überlastete Angehörige; verhindert Verwechslungen von Blutdruck- und Herzmedikamenten ohne Cloud-Registrierung. |
| **V6 · Tech Tree Position** | **4/5** | Roots: WebRTC VideoCapture, OpenCV WASM; Trunk: 7x4 Dosetten-Inspektions-Engine; Branches: Automatisches Einnahmeprotokoll für den Pflegedienst. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type B: BfArM Arzneimittelkatalog, BAGSO-Leitfäden für häusliche Pflege. |
| **Gesamt-Vektorscore** | **28/35** | **Tier-Klasse:** `Tier 1/2` · **Quellentyp:** `Type B` |

#### 2. Tech Tree Position
```
[Roots: OpenCV WASM / WebRTC Kamera-API / BfArM Referenzdaten]
         └── [Trunk: Offline-Wochendosetten-Inspektor mit Farbraster-Abgleich]
                     ├── [Branch A: Akustischer Warnton bei fehlender oder doppelter Tablette]
                     └── [Branch B: Medikationsplan-Prüfbericht für pflegende Angehörige]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Höchste Datensicherheit (keine Speicherung intimer Gesundheitsdaten in der Cloud)<br>• Entlastet pflegende Angehörige von enormem Kontrolldruck<br>• Funktioniert mit Standard-Dosetten | • Spiegelungen und Schattenwurf bei schlechtem Kunstlicht im Wohnzimmer |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Offizielle Förderung durch Pflegekassen und Seniorenorganisationen<br>• Einsatz in ambulanten Pflegediensten | • Haftungsbedenken bei Falsch-Positiven oder übersehenen weißen Tabletten |

**Die Achillesferse:** Optische Ähnlichkeit weißer runder Tabletten bei schlechter Beleuchtung -> Zwingender Bestätigungsschritt: Das Tool markiert unklare Fächer gelb und verlangt manuelle Sichtprüfung vor Freigabe.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Verengt (Strikte Plausibilitätswarnungen erforderlich)`
- **Restlücke:** Die optische Prüfung vorbereiteter Wochendosetten gegen ein Referenzbild ohne Übertragung intimer Patientendaten an Cloud-Server.
- **Nächster Handlungsschritt:** Test mit typischen 7x4-Dosetten unter verschiedenen Kunstlichtbedingungen.

---

### Review Dossier: Eichflächen-Trainer (`eichflaechen-trainer`)
**Titel (EN):** Calibration Deck for Habitat Surveyors · **Domäne:** knowledge · **Status:** Available
**Empfänger:** Bundesverband Beruflicher Naturschutz (BBN) · Universitäten (Geobotanik/Landschaftsökologie) · Gutachterbüros

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Exploratory. Lacunar Gap: „Vegetationskundler und Kartierer haben keine standardisierte Methode, um ihre subjektive Deckungsgradschätzung im Feld gegen physikalisch exakte Referenzflächen zu eichen.“ |
| **V2 · Complexity & Tier** | **5/5** | Tier 1: Prozeduraler Vektor-Polygon-Generator im HTML5 Canvas, exakte Pixelauszählung in Echtzeit, zero cloud, 100% Offline-Web-App. |
| **V3 · Possibility & Why Now** | **5/5** | Canvas 2D rendert zufällige Blatt- und Vegetationsstrukturen mit exakt vordefiniertem prozentualen Deckungsgrad; sofortiges Feedback. |
| **V4 · Future Runway & Longevity** | **4/5** | Grundlegendes Ausbildungs- und Eichwerkzeug für alle ökologischen Umweltverträglichkeitsprüfungen und Dauerbeobachtungen. |
| **V5 · Civic SWOT Profile** | **4/5** | Schließt die berüchtigte 20–30%ige Schätzstreuung zwischen Gutachtern; erhöht die juristische Belastbarkeit von Umweltberichten. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Braun-Blanquet Skala, Londo-System, Canvas 2D; Trunk: Prozeduraler Eichflächen-Generator; Branches: Zertifizierungs-Modul für Naturschutz-Kartierer. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type D: Braun-Blanquet (Pflanzensoziologie 1964), Londo (1976 Dezimalskala). |
| **Gesamt-Vektorscore** | **30/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type D` |

#### 2. Tech Tree Position
```
[Roots: Braun-Blanquet / Londo-Skala / Prozedurale Canvas-Vektoren]
         └── [Trunk: Deterministischer Deckungsgrad-Eichtrainer im Browser]
                     ├── [Branch A: Kalibrierungs-Zertifikat für Freiland-Gutachter]
                     └── [Branch B: Didaktisches Lehrmodul für botanische Feldübungen]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Mathematisch unbestechliche Pixelreferenz (Wahrheitswert)<br>• Beseitigt systematische Über- und Unterschätzungen<br>• Zero-Cloud, sofort nutzbar | • 2D-Projektion bildet die Dreidimensionalität mehrschichtiger Krautschichten nur abstrahierend ab |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Standard-Prüfungstool an biologischen Fakultäten<br>• Adoption durch den Bundesverband Beruflicher Naturschutz | • Etablierte Alt-Gutachter verweigern Eichung aus Sorge vor Bloßstellung |

**Die Achillesferse:** Abstrahierte Formen schulen nicht die Unterscheidung überlappender Blattschichten -> Umschaltbarer Modus für 3D-Schichtung mit variabler Transparenz und Klumpungsfaktor.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (BBN / Universitäten)`
- **Restlücke:** Ein browserbasiertes Trainingsdeck, das die subjektive menschliche Schätzung von Vegetationsdeckungen gegen exakte Flächen eicht.
- **Nächster Handlungsschritt:** Vorstellung beim Bundesverband Beruflicher Naturschutz (BBN).

---

## 8. Domäne VI: Echtzeit-Audio & Kiez-Moderation (Real-Time Audio · 1 Dose)

### Review Dossier: TischSchiedsrichter (`tischschiedsrichter`)
**Titel (EN):** Dinner Table Referee · **Domäne:** audio · **Status:** Available
**Empfänger:** Öffentlichkeit / Show HN / FOSDEM · Familien- und Konfliktberatungsstellen

#### 1. Vector Radar
| Vektor | Note (1-5) | Audit-Befund & Empirische Evidenz |
|---|:---:|---|
| **V1 · Novelty & Distance** | **4/5** | Bisoziation. Lacunar Gap: „Familien und Vereinsmitglieder können eskalierende Reizwort-Konflikte am Tisch nicht deeskalieren, weil eine neutrale, unvoreingenommene Moderationsinstanz fehlt.“ |
| **V2 · Complexity & Tier** | **4/5** | Tier 1: 100% Client-Side Web Speech API / Offline-Keyword-Spotter im Browser, Gelb/Rot-Karten-Zustandsmaschine, null Audio-Upload. |
| **V3 · Possibility & Why Now** | **4/5** | Lokale Spracherkennung im Browser erkennt Reizwörter ohne Latenz; absolute Vertraulichkeit garantiert, dass kein Wort den Raum verlässt. |
| **V4 · Future Runway & Longevity** | **4/5** | Dauerhafter zivilgesellschaftlicher Bedarf an friedlicher Debattenkultur und Deeskalation bei festgefahrenen Familienthemen. |
| **V5 · Civic SWOT Profile** | **4/5** | Schafft heiteren, spielerischen Rahmen zur Konfliktvermeidung; schützt vor zerstörerischen Familienstreits an Feiertagen. |
| **V6 · Tech Tree Position** | **4/5** | Roots: Web Speech API, Keyword Spotting WASM; Trunk: Reizwort-Monitor mit Trillerpfeife & Ampelkarte; Branches: Moderations-Assistent für Meetings. |
| **V7 · Documentation & Ground Truth** | **4/5** | Type C: Kommunikationspsychologische Modelle (Schulz von Thun, Gordon-Familienkonferenz). |
| **Gesamt-Vektorscore** | **29/35** | **Tier-Klasse:** `Tier 1` · **Quellentyp:** `Type C` |

#### 2. Tech Tree Position
```
[Roots: Web Speech API / Offline Keyword Spotter / Web Audio Pfeifton]
         └── [Trunk: Lokaler Audio-Tischschiedsrichter mit Gelb/Rot-Kartenlogik]
                     ├── [Branch A: Humorvoller Deeskalations-Trainer für Familienfeiern]
                     └── [Branch B: Neutraler Redezeit- und Reizwortwächter für Bürgerversammlungen]
```

#### 3. Civic SWOT
| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| • Entschärft Konflikte durch Humor und neutrale Spielregeln<br>• Absoluter Abhörschutz (läuft komplett offline auf dem Tisch)<br>• Sofort einsetzbar | • Durcheinanderreden oder lautes Geschirrklappern kann Worterkennung stören |
| **Chancen (Opportunities)** | **Bedrohungen (Threats)** |
| • Viraler Erfolg vor Feiertagen (Show HN, Heise, Social Media)<br>• Einsatz in Mediations-Workshops | • Ein Teilnehmer fühlt sich durch die Pfeife bevormundet und bricht das Spiel ab |

**Die Achillesferse:** Aggressiver Pfeifton eskaliert gereizte Stimmung zusätzlich -> Einstellbare sanfte Deeskalationssignale (Glockenspiel, humorvolle Themenwechsel-Frage) statt schriller Schiri-Pfeife.

#### 4. Triage Verdict & Synthese
- **Urteil:** `Dose Ready (Skelett bauen vor Verschenken)`
- **Restlücke:** Ein neutraler, lokaler Audio-Schiedsrichter, der bei eskalierenden Reizwörtern spielerisch Gelbe Karten zeigt und das Thema wechselt.
- **Nächster Handlungsschritt:** Scaffolding und Demo vor FOSDEM/Weihnachten fertigstellen.

---

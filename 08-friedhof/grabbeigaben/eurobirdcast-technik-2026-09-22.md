# Faktenprüfung: Dose „EuroBirdCast — Dynamisches Vogelzugradar & BP/MWh-Index"

**Prüfer:** Rechercheur #3 · **Datum:** 22. September 2026
**Geprüftes Dokument:** `05-dosen/eurobirdcast.md` (Stand 22.09.2026)
**Auftrag:** Jede technische und förderbezogene Ist-Behauptung belegen oder abschwächen.

## Evidenzstufen

| Kürzel | Bedeutung |
|---|---|
| **[V]** | Verzeichnis/Repo selbst abgefragt (Live-Listing, `git clone`, `grep`) — stärkste Stufe |
| **[S]** | Seite gelesen (Volltext abgerufen und zitiert) |
| **[s]** | nur Suchschnipsel / Sekundärquelle |
| **[—]** | nicht belegbar in dieser Sitzung |

## Werkzeug-Einschränkung dieser Sitzung (für Nachprüfbarkeit)

Der Egress-Proxy verweigert `CONNECT` für fast alle Hosts außer `github.com`, `api.github.com`,
`raw.githubusercontent.com` (403 „policy denial"). `curl` gegen `opendata.dwd.de`, `aloftdata.eu`,
`ec.europa.eu`, `gesetze-im-internet.de`, `nature.com` schlägt daher fehl. **WebFetch war entgegen
der Auftragsannahme nutzbar** und wurde für alle Webseiten verwendet; Repos wurden geklont.
`api.github.com/search/...` ist gesperrt („sessions are bound to their configured repositories"),
gezieltes Klonen funktioniert. Direkte S3-Objektabrufe auf `aloft.s3-eu-west-1.amazonaws.com`
liefern über WebFetch durchgehend 404 — auch für das in der Aloft-FAQ genannte Beispiel-Objekt;
dieser Kanal ist also **nicht aussagekräftig** und wurde nicht als Negativbeleg gewertet.

---

# 1 · DWD Open Data: ungefilterte polare Volumendaten

## Befund: **stimmt teilweise — mit einem Killerdetail bei der Vorhaltezeit**

### 1.1 Gibt es die Daten? — **stimmt**

Live-Listing von `https://opendata.dwd.de/weather/radar/sites/` **[S]**, 22.09.2026:

```
dx/  lmax/  pe/  pf/  pr/  px/  px250/  pz/
sweep_pcp_phidp/  sweep_pcp_rhohv/  sweep_pcp_v/  sweep_pcp_z/  sweep_pcp_zdr/
sweep_vol_phidp/  sweep_vol_rhohv/  sweep_vol_v/  sweep_vol_z/  sweep_vol_zdr/
```

`https://opendata.dwd.de/weather/radar/sites/sweep_vol_z/` **[S]** listet exakt **17 Standorte**:
`asb boo drs eis ess fbg fld hnr isn mem neu nhb oft pro ros tur umd`.
→ Die Zahl „17 Radarstandorte" der Dose **stimmt**.

Unter `sweep_vol_z/pro/` **[S]** existieren zwei Unterordner: `hdf5/` und **`unfiltered/`**.
→ Die Behauptung „ungefilterte polare Volumendaten" **stimmt**; es gibt tatsächlich einen
ungefilterten Zweig. `sweep_vol_rhohv/pro/` **[S]** enthält **nur** `unfiltered/`.

**Präzisierung, die in der Dose fehlt:** Die ungefilterten Dateien tragen das Moment **`th`**
(Total Horizontal Reflectivity, unkorrigiert), die gefilterten `dbzh`:
`ras07-vol5minng01_sweeph5onem_th_00-20260920123557...-pro-10392-hd5` **[S]**.
Wer „ungefiltert" will, muss `TH` verarbeiten, nicht `DBZH` — vol2birds Default ist
`DBZTYPE = DBZH` (`vol2bird/etc/options.conf` Z. 90) **[V]**. Das ist eine Konfigurationsänderung,
die die Dose nicht erwähnt.

### 1.2 Polarimetrische Größen — **stimmt**

`sweep_vol_rhohv`, `sweep_vol_zdr`, `sweep_vol_phidp` sind als eigene Produktbäume vorhanden **[S]**.
RHOHV und ZDR sind also verfügbar.

**Aber:** Es gibt **kein** `sweep_vol_w` / Spektralbreite (WRADH) im gesamten Listing **[S]**.
Das hat eine harte Folge für MistNet (siehe Punkt 2).

**Zweite Folge:** DWD liefert **jedes Moment in einer eigenen Datei je Sweep**. `vol2bird` erwartet
ein zusammengesetztes Polarvolumen. Das Zusammenführen ist möglich (vol2bird NEWS 0.4.0:
„added functionality to vol2bird to read files containing single scans (sweeps) and merge them
into a polar volume (#116)") **[V]**, aber es ist ein eigener Arbeitsschritt, den das erste Ticket
der Dose nicht einplant.

### 1.3 Vorhaltezeit — **die Dose sagt dazu nichts, und genau das kippt Ticket 1**

Gemessen am Live-Verzeichnis `sweep_vol_z/pro/unfiltered/` **[S]** am 22.09.2026:

| | |
|---|---|
| ältester Eintrag | **20-Sep-2026 12:36:50** |
| neuester Eintrag | **22-Sep-2026 12:31:25** |
| Spanne | **≈ 48 Stunden** |

Der Zweig `sweep_vol_z/pro/hdf5/filter_polarimetric/` zeigte im selben Test eine Spanne ab
20-Sep-2026 12:36 **[S]** — gleiche Größenordnung.

Ein Archiv polarer Volumendaten existiert auf dem Open-Data-Server **nicht**:
`opendata.dwd.de/climate_environment/CDC/grids_germany/` **[S]** enthält ausschließlich
Rasterprodukte (`5_minutes/ annual/ daily/ halfyear/ hourly/ monthly/ multi_annual/
return_periods/ seasonal/`), keine PVOL-/Sweep-Archive.

### 1.4 Lizenz — **stimmt eingeschränkt: CC BY 4.0, nicht GeoNutzV**

`opendata.dwd.de/climate_environment/CDC/Terms_of_use.pdf` **[S]**: „CC BY 4.0" gilt für die
CDC-OpenData-Daten; Details zur Quellenangabe unter `dwd.de/copyright`.
`opendata.dwd.de/README.txt` **[S]** verweist nur pauschal auf die DWD-Nutzungsbedingungen und
enthält **keine** Aussage zu Vorhaltezeiten. `dwd.de/EN/service/copyright/...` ist per robots.txt
gesperrt **[—]**, eine wörtliche GeoNutzV-Zitierung war daher nicht zu holen.

| Prüfpunkt | Befund | Beleg | Stufe | **Konsequenz für die Dose** |
|---|---|---|---|---|
| 17 Radarstandorte | stimmt | `…/sweep_vol_z/` | [S] | unverändert lassen |
| ungefilterte PVOL vorhanden | stimmt | `…/pro/unfiltered/` | [S] | unverändert; aber Moment `TH` statt `DBZH` ergänzen |
| ODIM-HDF5 | stimmt | Dateiendung `-hd5`, `sweeph5onem` | [S] | unverändert |
| RHOHV / ZDR enthalten | stimmt | eigene Produktbäume | [S] | unverändert |
| Spektralbreite (W) enthalten | **falsch — gibt es nicht** | vollständiges Produktlisting | [S] | **MistNet-Satz streichen oder einschränken** (s. Punkt 2) |
| ein Moment = eine Datei | in Dose nicht erwähnt | Dateinamen | [S] | Merge-Schritt in Ticket 1 aufnehmen |
| **Vorhaltezeit ≈ 48 h** | **in Dose nicht erwähnt** | gemessenes Listing | [S] | **Ticket 1 („14 Tage historischer Herbstzug") ist so nicht ausführbar** |
| kein PVOL-Archiv beim DWD | bestätigt (für Open Data) | CDC-Verzeichnis | [S] | Ticket 1 umformulieren: 14 Tage **vorwärts** sammeln, nicht rückwärts rechnen |
| Lizenz | CC BY 4.0 | CDC Terms of use | [S] | „GeoNutzV" nicht behaupten; CC BY 4.0 + Quellenangabe schreiben |

> **Konsequenz gesamt:** Die Datengrundlage existiert und ist besser als behauptet (es gibt einen
> expliziten `unfiltered`-Zweig). Aber das **Abnahmekriterium von Ticket 1 ist mit Open Data allein
> nicht erfüllbar**: 14 Tage Herbstzug rückwirkend gibt es nicht, die Daten sind nach rund zwei
> Tagen weg. Entweder das Ticket wird zu „ab Tag 0 selbst archivieren, nach 14 Tagen auswerten"
> umgeschrieben (dann ist es weiterhin ein sauberes 14-Tage-Kriterium, nur vorwärts), oder es
> stützt sich auf einen fremden Volumenarchivbestand, der erst beschafft werden muss.

---

# 2 · vol2bird / bioRad / vol2birdR

## Befund: **stimmt in der Substanz, die Versionsangabe ist knapp richtig, die MistNet-Aussage ist für Deutschland irreführend**

Alle drei Repositories geklont und inspiziert **[V]**:

| Repo | Version | letzter Commit | Bemerkung |
|---|---|---|---|
| `adokter/vol2bird` (C) | 0.6.x (NEWS: „vol2bird 0.6.XXXX") | **2025-09-05** „update to latest vol2birdR" | Kernalgorithmus, ruhiger |
| `adokter/bioRad` (R) | `Version: 0.12.0.9000` (DESCRIPTION) | **2026-07-21** | aktiv, viele Merges |
| `adokter/vol2birdR` (R/C++) | `Version: 1.3.2` (DESCRIPTION) | **2026-09-16** | sehr aktiv, CRAN-Release 6 Tage vor Prüfdatum |

→ Die Angabe der Dose „`bioRad` / `vol2birdR` (v1.3 mit MistNet)" ist **korrekt**; aktuell ist
1.3.2. Repository-Aktivität: **lebendig**, nicht verwaist.

### 2.1 MistNet — **enthalten, aber für DWD-Daten praktisch nicht nutzbar**

MistNet ist eindeutig vorhanden: `vol2bird/libmistnet/`, `vol2bird/docker/Dockerfile.vol2bird-mistnet`,
`bioRad/R/apply_mistnet.R`, `options.conf: USE_MISTNET = FALSE` (Default aus!) **[V]**.
vol2birdR 1.3.2 NEWS: „vol2birdR now uses 'LibTorch' 2.14.0 by default for mistnet runs, up from
1.12.1" **[V]**.

Zwei dokumentierte Einschränkungen aus `bioRad/R/apply_mistnet.R` **[V]**, wörtlich:

> „MistNet requires three single-polarization parameters as input: reflectivity (`DBZH`), radial
> velocity (`VRADH`), and **spectrum width (`WRADH`)**, at 5 specific elevation angles
> (0.5, 1.5, 2.5, 3.5 and 4.5 degrees)."

> „Because the network has been **trained on S-band data, it may not perform as well on C-band**."

Beides trifft die Dose direkt:
1. **DWD liefert kein WRADH** (Punkt 1.2) → MistNet kann auf DWD-Open-Data gar nicht laufen.
2. **DWD-Radare sind C-Band**, MistNet ist auf US-NEXRAD (S-Band) trainiert → selbst mit
   beschafftem WRADH ist die Leistung laut Autoren nicht gesichert.

### 2.2 Klassische Dual-Pol-Filterung — **funktioniert, aber die Schwelle der Dose ist falsch**

`vol2bird/etc/options.conf` **[V]**, wörtlich:

```
# whether to use dual-pol moments for filtering meteorological echoes
DUALPOL = TRUE
# correlation coefficients higher than this threshold will be classified as precipitation
RHOHVMIN = 0.95
```

Die Dose schreibt unter „Wo es kippt": „Strikte Nutzung der polarimetrischen Korrelation
($\rho_{HV} < 0.85$ für biologische Streuer)". **Der Referenzwert des Werkzeugs ist 0,95, nicht 0,85.**
0,85 ist eine frei gewählte, unbelegte Verschärfung.

### 2.3 Verarbeitet es deutsche ODIM-HDF5? — **nicht belegbar aus den Repos**

`grep -rniE '\bDWD\b|German(y)? radar|Germany'` über alle drei Repos: **null Treffer** **[V]**.
Es gibt in vol2bird/bioRad/vol2birdR keine DWD-Beispieldatei, keinen DWD-Test, keine
DWD-Dokumentationszeile. Das ist kein Beweis, dass es nicht geht — ODIM-HDF5 ist ein Standard —
aber es ist auch **kein Beleg, dass es getestet ist**.

**Indirekter Positivbeleg, und ein starker:** Das belgische KMI/RMI rechnet deutsche DWD-Volumen
täglich mit vol2bird durch. Kopfzeilen der Live-Datei
`opendata.meteo.be/ftp/observations/radar/vbird/deess/2026/deess_vpts_20260915.txt` **[S]**:

```
# vol2bird Vertical Profile of Birds (VPB)
# source: WMO:10410,NOD:deess
# polar volume input: /tmp/20260915000000.rad.deess.pvol.th.sc_vol-5min-ng-01_ess.pvol.h5
# date time HGHT u v w ff dd sd_vvp gap dbz eta dens DBZH n n_dbz n_all n_dbz_all
```

Das ist der Beleg, dass (a) vol2bird DWD-ODIM-Volumen verarbeitet, (b) der `th`-Zweig (ungefiltert)
dafür verwendet wird, (c) der Output `dens` tatsächlich Vögel/km³ enthält.

| Prüfpunkt | Befund | Beleg | Stufe | **Konsequenz für die Dose** |
|---|---|---|---|---|
| vol2birdR v1.3 | stimmt (1.3.2, 2026-09-16) | DESCRIPTION, git log | [V] | „v1.3.2" präzisieren |
| Repos aktiv | stimmt | Commits 07/2026 u. 09/2026 | [V] | unverändert |
| MistNet enthalten | stimmt | `libmistnet/`, `apply_mistnet.R` | [V] | unverändert |
| MistNet auf DWD nutzbar | **faktisch nein** | WRADH fehlt beim DWD; S-Band-Training | [V]+[S] | **MistNet aus dem Werbeargument nehmen**; stattdessen Dual-Pol-Filterung nennen |
| ρHV < 0,85 für Biologie | **nicht belegt** | vol2bird-Default `RHOHVMIN = 0.95` | [V] | Zahl auf 0,95 korrigieren oder als frei gewählte Verschärfung kennzeichnen |
| DWD-Support dokumentiert | nicht belegbar aus Repos | 0 Treffer | [V] | keine Aussage „läuft out of the box" |
| DWD-Daten laufen real durch vol2bird | **stimmt** | RMI-Live-Profil `deess` | [S] | als Beleg in die Dose aufnehmen — stärkt sie |

---

# 3 · Aloft / aloftdata.eu

## Befund: **Zahlen leicht zu hoch; Deutschland ist enthalten, aber nicht so, wie die Dose es braucht**

### 3.1 „über 150 Stationen in 18 Ländern" — **stimmt teilweise, die Paper-Zahl ist 141**

Abstract von Desmet et al. (2025), *Scientific Data*, `doi.org/10.1038/s41597-025-04641-5`,
wörtlich **[S]**:

> „The datasets collectively cover **141 radar stations in 18 countries, from 2008 to 2023**."

Die Aufschlüsselung im selben Artikel **[S]**: `BALTRAD_VPTS` = 151 Radare an 140 Orten in 18 Ländern;
`UVA_VPTS` = 24 Radare in drei Ländern (BE, DE, NL); zusammen 152 Radare an 141 Orten.

→ „über 150 **Stationen**" ist **falsch**, wenn man Stationen/Orte zählt (141).
Richtig wäre: „151 Radare in 18 Ländern" oder „141 Radarstandorte in 18 Ländern".

### 3.2 „Scientific Data 2025" — **stimmt**

Titel: „Biological data derived from European weather radars"; Autoren u. a. Peter Desmet,
Judy Shamoun-Baranes, Bart Kranstauber, Adriaan M. Dokter; *Scientific Data*, 2025 **[S]**.

### 3.3 „täglich aktualisiert" — **stimmt, aber nur für eine der drei Quellen**

`pages/faq.md` im geklonten Repo `enram/aloftdata.eu` **[V]**, wörtlich:

```
- `baltrad`: Data provided by OPERA member countries. Coverage: 151 radars, from 2012 to now. **Updated daily.**
- `uva`: … Coverage: 24 radars in Belgium, Germany and the Netherlands, from 2008 to 2023.
- `ecog-04003`: … Coverage: 84 radars, in autumn 2016.
…
`baltrad` data are updated daily. HDF5 data are typically available 24 hours after the radar
collected the raw data, while daily and monthly summaries are available within 48 hours.
```

→ Täglich aktualisiert wird **`baltrad`**. `uva` endet **2023**, `ecog-04003` ist ein
21-Tage-Datensatz von 2016.

### 3.4 Ist Deutschland enthalten? — **ja, aber mit Vorbehalt**

- Zenodo-Record des `baltrad_vpts`-Datensatzes (`zenodo.org/records/14711024`) **[S]**: 151 Radare,
  18 Länder, darunter **Germany**; der Record enthält ein Paket **`de.tgz` mit VPTS-Daten von
  20 Radaren in Deutschland**, Abdeckung „varying coverage from 2012 to 2023".
- Die Radarliste `aloftdata.eu/radars/` **[S]** führt Deutschland mit 24 Einträgen (das ist die
  OPERA-Registrierung inkl. stillgelegter Standorte; im geklonten `_data/OPERA_RADARS_DB.json`
  **[V]** sind es 30 deutsche Einträge, davon 16 mit `status: 1` und ODIM-Code — `deboo`, `depro`,
  `dedrs`, `deess`, `defld`, `dehnr`, `deisn`, `deeis`, `defbg`, `demem`, `deneu`, `denhb`, `deoft`,
  `deros`, `detur`, `deumd`, `deasb`).
- **Warnung auf derselben Seite, wörtlich [S]:** „Note that bird movement data is **not available
  for all radars** listed on this page."
- Ob der **laufende** BALTRAD-Strom deutsche Radare aktuell mitführt, war **nicht verifizierbar**
  **[—]**: direkte S3-Objektabrufe scheiterten pauschal (auch das FAQ-Beispiel `seang`), das
  Changelog nennt nur die 2025 neu hinzugekommenen Länder (CY, GR, HU, IS, IE, LV, LT, MT, RO, RS)
  **[V]**, und CROW ist ohne JavaScript nicht lesbar **[S]**.

### 3.5 Die wichtigere Entdeckung: eine bessere Referenzquelle als Aloft

`pages/datasets.md` im Aloft-Repo **[V]**, wörtlich:

> „**RMI_DATASET_CROW** … provides bird profile data from 9 weather radars in Belgium, the
> Netherlands, France and **Germany** (`behel`, `bejab`, `bewid`, `bezav`, `nldhl`, `nlhrw`,
> `frabb`, `frave`, **`deess`, `denhb`**). **Data are added daily** and go back to October 2019."

Live verifiziert für den 15.09.2026 **[S]** (siehe 2.3). Damit existiert eine **täglich
aktualisierte, offene, aus DWD-Volumen gerechnete vol2bird-Referenz für zwei deutsche Radare**
(Essen und Neuheilenbach) — frei abrufbar unter
`opendata.meteo.be/ftp/observations/radar/vbird/<radar>/<jahr>/<radar>_vpts_<datum>.txt`.

| Prüfpunkt | Befund | Beleg | Stufe | **Konsequenz für die Dose** |
|---|---|---|---|---|
| „über 150 Stationen" | **falsch** | Abstract: 141 Stationen | [S] | auf „151 Radare an 141 Standorten" korrigieren |
| „18 Länder" | stimmt | Abstract | [S] | unverändert |
| „Scientific Data 2025" | stimmt | Artikelkopf | [S] | Zitat + DOI ergänzen |
| „täglich aktualisiert" | stimmt nur für `baltrad` | FAQ-Quelltext | [V] | einschränken |
| Deutschland enthalten | ja (20 Radare, 2012–2023) | Zenodo 14711024 | [S] | unverändert |
| deutsche Aloft-Daten **aktuell** | **nicht belegbar** | S3/CROW nicht abfragbar | [—] | **Abnahmekriterium nicht auf Aloft stützen** |
| bessere Referenz vorhanden | **ja: RMI, `deess` + `denhb`, täglich** | Aloft-Repo + Live-Datei | [V]+[S] | **Ticket 1 auf RMI-CROW umstellen** — Referenz und eigene Rechnung stammen dann aus demselben DWD-Volumen |

> **Konsequenz gesamt:** Das Abnahmekriterium „Korrelation > 95 % zu den Aloft-Referenzprofilen"
> ist in der jetzigen Form riskant — man weiß nicht, ob für das gewählte Pilotradar (Prötzel,
> Boostedt) überhaupt aktuelle Referenzprofile existieren. **Prötzel und Boostedt sind die falschen
> Pilotstationen.** Richtig wäre **Essen (`deess`)** oder **Neuheilenbach (`denhb`)**: für beide
> liegt täglich ein mit vol2bird gerechnetes Referenzprofil aus demselben DWD-Rohvolumen offen vor.
> Damit wird aus einem wackeligen ein prüfbares Kriterium. Zusatzhinweis: Eine Korrelation gegen
> eine Referenz, die mit **demselben** Algorithmus aus **denselben** Rohdaten erzeugt wurde, misst
> die Korrektheit der eigenen Pipeline — nicht die Güte der Methode. Das sollte die Dose so
> benennen, sonst verspricht das Kriterium mehr, als es prüft.

---

# 4 · EIC Pathfinder Open 2026

## Befund: **Der Call existiert — aber die Frist war vier Monate vor dem Datum der Dose. Die Mail ist in der jetzigen Form nicht absendbar.**

Zwei unabhängige Quellen, übereinstimmend:

**EIC-Seite `eic.ec.europa.eu/eic-funding-opportunities/eic-pathfinder_en` [S]:**

| | |
|---|---|
| Was | „For projects in any field of science, technology or application without predefined thematic priorities." |
| Frist 2026 | **„EIC Pathfinder Open: 12 May 2026"** |
| Antragsberechtigung | Konsortium aus **mindestens 3 unabhängigen Rechtspersonen aus verschiedenen Ländern**; Einzelantragsteller sind für Pathfinder **Open** nicht zugelassen (nur für Pathfinder Challenges) |
| Förderhöhe | „Grants of up to EUR 4 million or more if duly justified" |
| Reifegrad | TRL 1–4, bis Proof of Concept |
| Budget 2026 | 166 Mio. EUR für Pathfinder Open |

**Zabala `zabala.eu/eu-funding-programmes/eic-pathfinder/` [S]:** bestätigt Frist „12 May 2026",
„Open requires a consortium of at least three independent legal entities from different eligible
countries", 4 Mio. EUR, „low-TRL technologies", 166 Mio. EUR.

Der Funding-&-Tenders-Portal-Topic wurde versucht, liefert aber nur JS-Gerüst **[—]**.

### Vier Probleme, jedes für sich ausreichend

1. **Frist verstrichen.** Die Dose ist auf den **22.09.2026** datiert und nennt EIC Pathfinder Open
   2026 als „den **kommenden** Horizon Europe Grant". Der Einreichtermin war der **12.05.2026**.
   Die Mail würde an ein Team gehen, das die Frist besser kennt als der Absender — das ist der
   Blamage-Fall, den der Auftrag ausdrücklich vermeiden will.
2. **Konsortialgröße falsch.** Die Mail empfiehlt: „binden Sie **ein** vielversprechendes
   Hightech-Klima-KMU für die Softwareinfrastruktur ein". Das wären ENRAM/OSL + 1 KMU = 2 Partner.
   Pathfinder Open verlangt **≥ 3 unabhängige Rechtspersonen aus verschiedenen Ländern**.
3. **Reifegrad passt nicht.** Pathfinder Open fördert **TRL 1–4**. EuroBirdCast integriert
   ausschließlich existierende, reife Bausteine: DWD-Open-Data (operativ), vol2bird (seit Jahren
   produktiv), ICON-D2 (operativ), SCADA-Schnittstellen (Industriestandard). Das ist Integration
   und Deployment, sinnvoll bei **TRL 5–7**. Der Text der Mail räumt das selbst ein, wenn er von
   „schlüsselfertiger Architektur" und „72-Stunden-MVP-Roadmap" spricht — ein 72-Stunden-MVP ist
   kein TRL-2-Grundlagenrisiko. Die Argumentationslinie „Proof of Principle" der Mail ist damit
   innerlich widersprüchlich.
4. **Der eigentliche wissenschaftliche Durchbruch ist bereits publiziert.** Bauer et al. 2026
   (Punkt 6.1) hat das Prinzip gezeigt; Aufgabe ist jetzt Überführung in Betrieb, nicht
   Prinzipbeweis.

### Passendere Töpfe (jeweils als Vorschlag, nicht als geprüfte Frist)

| Topf | Warum passender | Stufe |
|---|---|---|
| **EIC Transition** | ausdrücklich für die Lücke TRL 4 → 6, Validierung in relevanter Umgebung — genau EuroBirdCasts Lage | [s] |
| **Horizon Europe Cluster 5 (Klima, Energie, Mobilität)** | Wind-onshore-Calls adressieren regelmäßig Umweltverträglichkeit und Akzeptanz | [s] |
| **Horizon Europe Cluster 6 (Biodiversität)** | Biodiversitätsmonitoring mit Fernerkundung | [s] |
| **LIFE (Nature & Biodiversity / Clean Energy Transition)** | fördert explizit Umsetzung und Verbreitung erprobter Naturschutzverfahren, keine Grundlagenforschung | [s] |
| **BfN „Erprobungs- und Entwicklungsvorhaben" (E+E)** | der institutionell nächstliegende Topf: BfN hat RADBIRD (Punkt 5.4) bereits finanziert; E+E ist exakt für „Forschungsergebnis → Praxisverfahren" gemacht | [s] |
| **DBU** | offene Ausschreibung, mittelständisch, Umwelttechnik, keine Konsortialpflicht | [s] |

**Ehrliche Kennzeichnung:** Die Eignung dieser Alternativen ist aus ihrem Programmzweck abgeleitet,
nicht gegen aktuelle Ausschreibungstexte geprüft **[—]**. Bevor eine dieser Optionen in die Mail
geschrieben wird, muss sie einzeln gegen den laufenden Call verifiziert werden.

| Prüfpunkt | Befund | Beleg | Stufe | **Konsequenz für die Dose** |
|---|---|---|---|---|
| Call existiert | stimmt | EIC-Seite | [S] | — |
| Frist | **12.05.2026 — verstrichen** | EIC-Seite + Zabala | [S] | **Mail so nicht versenden** |
| Einzelantrag möglich | **falsch** | „not eligible for Pathfinder Open" | [S] | „ENRAM + 1 KMU" auf ≥ 3 Partner korrigieren |
| Förderhöhe 4 Mio. EUR | stimmt | EIC-Seite | [S] | in Mail aufnehmen, falls Topf bleibt |
| TRL-Passung | **schlecht** | TRL 1–4 vs. Integrationsprojekt | [S] | Topf wechseln (EIC Transition / LIFE / BfN E+E) |

> **Konsequenz gesamt:** Der gesamte Abschnitt „Ausrichtung auf EIC Pathfinder Open 2026" der
> Übergabe-Mail muss ersetzt werden. Die inhaltliche Begründung der Übergabe an ENRAM trägt
> weiterhin — nur die Förderklammer trägt nicht.

---

# 5 · Rechtsrahmen: § 44 vs. § 45b BNatSchG, und ob es das Problem gibt

## Befund: **Die Dose zitiert die richtige Norm für den falschen Zweck — und die zentrale Prämisse hält nicht.**

### 5.1 Welcher Paragraf gilt wofür

- **§ 44 BNatSchG** enthält die allgemeinen artenschutzrechtlichen Zugriffsverbote
  (u. a. Tötungsverbot). Er gilt weiterhin und ist die Grundlage, auf der überhaupt über
  Vermeidungsmaßnahmen gesprochen wird. Insofern ist der Verweis der Dose **nicht falsch**.
- **§ 45b BNatSchG** (eingefügt durch die Novelle 2022) ist die **speziellere Norm für den Betrieb
  von Windenergieanlagen an Land**. Er regelt in Verbindung mit **Anlage 1** die
  Signifikanzprüfung und den Katalog fachlich anerkannter Schutzmaßnahmen.
  Die Volltexte `gesetze-im-internet.de/bnatschg_2009/__45b.html` und `.../anlage_1.html` sind per
  robots.txt gesperrt, `dejure.org` antwortete 402, `buzer.de` 403 **[—]** — der Gesetzeswortlaut
  konnte in dieser Sitzung **nicht direkt zitiert** werden.
- Belegt ist der Zusammenhang über das KNE (Kompetenzzentrum Naturschutz und Energiewende) **[S]**:
  phänologische Abschaltungen stützen sich auf **§ 45b Absatz 6 BNatSchG und § 6 WindBG** und
  betreffen die in **Anlage 1 Abschnitt 1 BNatSchG** gelisteten kollisionsgefährdeten
  **Brutvogelarten**.

→ **Die Dose zitiert § 44 an einer Stelle, an der § 45b einschlägig ist** (Genehmigungspraxis und
Abschaltauflagen für WEA an Land). Auch der Satz im Abschnitt „Skizze" — „Beweissicherheit für
Naturschutzbehörden nach § 44 BNatSchG" — sollte auf § 45b BNatSchG i. V. m. Anlage 1 zeigen.

### 5.2 Prämissenprüfung: Gibt es starre Vogelzug-Abschaltungen onshore? — **Nein.**

KNE, „Zeiträume phänologischer Abschaltungen von Windenergieanlagen für kollisionsgefährdete
Brutvogelarten" **[S]**:

- Adressat sind **Brutvogelarten** nach Anlage 1 Abschnitt 1 (Rotmilan, Seeadler, Weißstorch,
  Baumfalke, Weihenarten).
- Auslöser sind „bestimmte, abgrenzbare Entwicklungs-/Lebensabschnitte mit erhöhter
  Nutzungsintensität des Brutplatzes (z. B. Balz oder Zeit flügger Jungvögel)".
- Typischer Umfang: **4 bis 6 Wochen innerhalb des Zeitraums 1. März bis 31. August**,
  **von Sonnenaufgang bis Sonnenuntergang** — also **tagsüber**, im **Frühjahr/Sommer**.
- Wörtlich festgehalten: Es findet sich in der Quelle **keine Regelung zu nächtlichem
  Breitfrontenzug von Kleinvögeln onshore**.

### 5.3 Was die Dose vermutlich mit „Nachtabschaltungen August bis Oktober" meint: **Fledermäuse**

KNE, „Vorgaben zu Parametern für pauschale Abschaltungen zum Fledermausschutz in den Ländern" **[S]**:

- Zeitraum: häufig **01.04. – 31.10.** (mancherorts bis November)
- Tageszeit: **1 h vor Sonnenuntergang bis Sonnenaufgang** — also nachts
- Temperatur: **≥ 10 °C**
- Windgeschwindigkeit: **< 6 m/s** (neuere Forschung hat in einigen Ländern höhere/differenzierte
  Werte gebracht)
- Grundlage: **RENEBAT (Brinkmann et al. 2011)**, umgesetzt über Länder-Erlasse und -Leitfäden,
  nicht über eine einzelne Bundesnorm.

→ Die nächtlichen Abschaltungen im Spätsommer/Herbst, die die Dose als starre
**Vogelzug**-Auflage beschreibt, sind in der deutschen Genehmigungspraxis **Fledermaus**-Auflagen.
Und sie sind **nicht kalendarisch starr**: sie sind bereits an **Temperatur und Windgeschwindigkeit**
gekoppelt, also zustandsabhängig.

### 5.4 Bedeutet das, die Dose löst kein Problem? — **Nein, aber sie beschreibt das falsche.**

Zwei belegte Anker, die das Vorhaben stützen:

- **RADBIRD** (`natur-und-erneuerbare.de/projektdatenbank/radbird/`) **[S]**: Titel
  „Radargestützte Vermeidungsmaßnahmen von Vogelschlag bei Zugereignissen an Windenergieanlagen",
  Institut für Vogelforschung „Vogelwarte Helgoland", gefördert vom **BfN**, Laufzeit
  **01.11.2019 – 31.12.2021**, Ziel u. a. „Verfahren zur vogelzugabhängigen Abschaltung von
  Anlagen" — **onshore**. Die Angabe der Dose (BfN, Vogelwarte Helgoland, 2019–2021) **stimmt exakt**.
  Dass es dieses Projekt gibt, belegt: Vogelzug-Abschaltung onshore ist ein anerkanntes Zielbild —
  aber eben eines, das **noch nicht Genehmigungspraxis ist**.
- **Niederlande, offshore, seit 2023 im Regelbetrieb** — siehe Punkt 6.4. Dort existiert genau
  das, was die Dose für Deutschland vorschlägt.

| Prüfpunkt | Befund | Beleg | Stufe | **Konsequenz für die Dose** |
|---|---|---|---|---|
| § 44 BNatSchG einschlägig | teilweise (allgemeines Tötungsverbot) | — | [s] | behalten, aber nicht als Auflagengrundlage |
| § 45b BNatSchG einschlägig für WEA an Land | **ja — fehlt in der Dose** | KNE | [S] | **beide Nennungen von § 44 auf § 45b i. V. m. Anlage 1 umstellen** |
| Gesetzeswortlaut zitiert | nicht möglich | robots/402/403 | [—] | vor Versand am Volltext gegenprüfen |
| starre kalendarische **Vogelzug**-Abschaltungen onshore | **existieren nicht** | KNE (Brutvögel, März–Aug., tagsüber) | [S] | **Problembeschreibung neu schreiben** |
| Nachtabschaltungen Aug.–Okt. | = **Fledermausschutz**, nicht Vogelzug | KNE | [S] | korrigieren |
| „starr" | **falsch** — bereits an T und v gekoppelt | KNE (≥10 °C, <6 m/s) | [S] | „starr" streichen |
| RADBIRD-Angaben | **stimmen exakt** | Projektdatenbank | [S] | unverändert |

> **Konsequenz gesamt — das ist der schwerste Befund des Berichts:** Die Dose baut ihr Problem auf
> einer Auflagenpraxis auf, die es onshore in Deutschland so nicht gibt. Damit fällt die
> Nutzenrechnung „wir ersetzen starre Abschaltungen durch dynamische" in sich zusammen: man kann
> keine Ertragsverluste einsparen, die niemandem auferlegt sind. **Die Dose ist damit aber nicht
> tot — ihr Zweck dreht sich nur um:** von *Ertragsverluste vermeiden* zu *einen bislang
> ungeregelten und unbeobachteten Schadensfall überhaupt sichtbar und regelbar machen, bevor die
> Genehmigungspraxis ihn mit einem pauschalen Instrument belegt.* Drei tragfähige Anschlüsse:
> (a) **Fledermausabschaltung präzisieren** — dort existiert die Auflage, dort liegt echtes
> Ertragsgeld, und dort ist die Kopplung an Messgrößen schon etabliert;
> (b) **offshore / deutsche AWZ**, wo Massenzug-Abschaltung international bereits Praxis ist;
> (c) **onshore vorausschauend**, als Angebot an BfN/Länder, bevor eine pauschale Regel entsteht —
> das ist genau die Anschlussstelle an RADBIRD. Variante (c) ist die ehrlichste und macht aus der
> Dose ein Regulierungs-Vorlaufprojekt statt eines Einsparprojekts.

---

# 6 · Physik-Plausibilität: belastbare Größenordnungen mit Quelle

## 6.1 Der Hebel (Behauptung Nr. 5 der Dose) — **stimmt**

Bauer, S.; Nussbaumer, R.; Tito, D.; Shamoun-Baranes, J.; Farnsworth, A. (2026):
**„Bird migration and wind-energy production across Western Europe"**, *Nature Sustainability*,
`doi.org/10.1038/s41893-026-01853-4` **[S]** (Abstract wörtlich gelesen; Zahlen aus der
UvA/IBED-Pressemitteilung vom Juli 2026 **[S]** und der Tethys-Eintragung **[S]**).

| Szenario | Ertragsverlust |
|---|---|
| Abschaltung in Spitzenzugphasen / Dichteschwelle | **2–20 %** |
| Grenzwert „Kollisionen pro kWh": **50 %** der Kollisionen verhindert | **1,2 %** |
| Grenzwert „Kollisionen pro kWh": **90 %** der Kollisionen verhindert | **7,6 %** |

→ Alle vier Zahlen der Dose **stimmen**. Zitat und DOI sollten ergänzt werden.

## 6.2 Zugintensität — in der Praxis **MTR (Vögel/km/h)**, nicht Vögel/km³

| Größe | Wert | Quelle | Stufe |
|---|---|---|---|
| In Deutschland diskutierte Eingriffsschwellen | **250 MTR** und **500 MTR** (Radarsignale·h⁻¹·km⁻¹) | Welcker, J. (2022): *Vergleichbarkeit verschiedener Radarsysteme zur Erfassung des Vogelzugs*, BfN-Schriften 635 | [S] |
| Messunsicherheit zwischen Radarsystemen bei 250 MTR | mittlere absolute Abweichung ≈ **100 MTR** | ebd. | [S] |
| Höhenbänder der Auswertung | 25–200 m, 25–500 m, 25–1000 m; Vögel „bis in Höhen von etwa 1.000 m" | ebd. | [S] |
| NL-Politikvorschlag (Abschaltschwelle offshore) | **500 Vögel/km/h** (nach Krijgsveld et al. 2015) | van Bemmelen, de Groeve & Potiek (2022), „Exploring the relation between wind speed, bird migration and curtailment", S. 9 | [S] |
| windabhängig optimierte Schwellen (Ziel: 30 % Kollisionsvermeidung) | **400** Vögel/km/h bei 3–6 m/s · **900** bei 6–11 m/s · **500** bei >11 m/s | ebd. | [S] |
| Schwelle „intensiver Zug" auf Rotorhöhe, BE offshore | **> 500 birdtracks·km⁻¹·h⁻¹** | Brabant, Rumes & Degraer (2020), Kap. 4: „Occurrence of intense bird migration events at rotor height in Belgian offshore wind farms…" | [S] |
| gemessener Spitzenwert Herbst 2019 (BE offshore) | **995 birdtracks·km⁻¹·h⁻¹** (14.10.2019, 22–23 Uhr MEZ) | ebd. | [S] |
| gemessener Spitzenwert Frühjahr 2021 | **261 birdtracks·km⁻¹·h⁻¹** | ebd. | [S] |
| Zeitpunkt der 14 „intense migration events" Herbst 2019 | **alle nachts**, nachtziehende Singvögel | ebd. | [S] |

**Vögel/km³:** Trotz gezielter Suche **kein publizierter Zahlenwert mit Quelle beschaffbar** **[—]**.
Die zuständigen Primärquellen (Dokter et al. 2011 über PMC, Nilsson & Dokter et al. 2019 über Wiley)
waren über CAPTCHA bzw. 403 nicht lesbar. Belegt ist nur, dass `dens` in vol2bird/bioRad die Einheit
Vögel/km³ trägt (RMI-Live-Profil `deess` **[S]**, biorxiv-Methodik „vertical profiles of bird
density [birds/km³]" **[S]**).
→ **Die Dose sollte ihren Index nicht auf Vögel/km³ normieren, sondern auf MTR auf Rotorhöhe.**
Das ist die Einheit, in der Schwellenwerte, Gutachten und Genehmigungsverfahren in DE/NL/BE
tatsächlich formuliert sind, und für die belegte Zahlen existieren.

## 6.3 Rotorüberstreichungshöhen und Anlagengröße

Fachagentur Wind und Solar e. V., *Status des Windenergieausbaus an Land in Deutschland,
1. Halbjahr 2025*, 15.07.2025 **[S]**, wörtlich für **neu installierte** Anlagen:

> „Ø Nabenhöhe [m] **146** | Ø Rotordurchmesser [m] **150** | Ø Generatorleistung [MW] **5,38**"

Daraus folgt für die Durchschnittsanlage des Zubaus 2025:

| Größe | Wert |
|---|---|
| Nabenhöhe | 146 m |
| Rotorradius | 75 m |
| **Rotorüberstreichungsbereich** | **71 m – 221 m über Grund** |
| Rotorfläche | ≈ 17 670 m² |
| Nennleistung | 5,38 MW |

Zum Vergleich, belgische Offshore-Anlagen: Rotoren „between **24 and 193 m**" (Brabant et al. 2020) **[S]**;
Borssele (NL): „**9,5 MW** capacity of the turbines currently deployed" (van Bemmelen et al. 2022) **[S]**.

→ Die Dose nennt „80–250 m" und an anderer Stelle „typisch 80–220 m" Rotorebene. Das ist
**plausibel, aber unbelegt und intern uneinheitlich**. Belegbar und aktuell ist **71–221 m** für
den deutschen Zubau 2025. Die beiden Angaben in der Dose sollten auf einen Wert vereinheitlicht
und mit der Quelle versehen werden.

## 6.4 Kollisionswahrscheinlichkeit und reale Abregelungskosten

| Größe | Wert | Quelle | Stufe |
|---|---|---|---|
| Ausweichraten im Band-Modell (Standard) | Default **98 %** für nicht gelistete Arten; Rotmilan/Kornweihe/Steinadler **99 %**; Seeadler und Turmfalke **95 %**; große Möwen **99,5 %**; Gänse **99,8 %**; Schwäne **99,5 %** | NatureScot, „Use of Avoidance Rates in the NatureScot Wind Farm Collision Risk Model" | [S] |
| Kollisionswahrscheinlichkeit **pro Rotordurchflug** (Band-Modell, Stufe 1) | **nicht belegbar** — NatureScot- und gov.scot-Seiten beschreiben nur die Methodik („the probability of a bird being struck during a transit of a rotor is multiplied by the transits…"), ohne Zahlenwert; die Beispielrechnungen (Ballinlee-Anhang, Ossian-CRM, tandfonline) waren über 403/404 nicht erreichbar | — | [—] |
| NL-Regelbetrieb offshore: Abregelungsdeckel | **max. 60 Stunden pro Jahr**, beginnend mit dem Herbstzug | Noordzeeloket, „Bird migration predictive modelling, threshold and protocol" | [S] |
| NL-Regelbetrieb: Drehzahl im Stillstandsmodus | **weniger als 2 Umdrehungen pro Minute** | ebd. | [S] |
| NL-Regelbetrieb: Vorwarnzeit | **48 Stunden** Vorhersage, täglich durch ein Expertengremium validiert | ebd. | [S] |
| Modellierter Abregelungsaufwand (30 % Kollisionsvermeidung, optimierte Schwellen) | **26 Stunden** über Frühjahr + Herbst 2019–2021 = **1,6 % der Zeit**; Energieverlust **11 MWh** je Anlage über drei Jahre ≈ **0,05 %** | van Bemmelen et al. (2022), Tab. 3.5 | [S] |

> **Wichtig für die Dose:** Das Band-Modell taucht in der Dose nicht auf — gut so, denn der
> Zahlenwert „Kollisionswahrscheinlichkeit pro Durchflug" ließ sich **nicht belegen**. Eine
> spätere Simulation sollte deshalb **nicht** über eine erfundene Durchflug-Wahrscheinlichkeit
> gehen, sondern über den belegten Weg: **MTR auf Rotorhöhe → Durchflüge durch die Rotorfläche →
> Ausweichrate (98 % Default, NatureScot) → Kollisionen**, und die Kalibrierung gegen die
> van-Bemmelen-Ergebnisse (26 h / 1,6 % / 0,05 %) und Bauer et al. 2026 (1,2 % / 7,6 %) prüfen.
> Jede Zahl in dieser Kette hat dann eine Quelle.

## 6.5 „Wer es schon versucht hat" — eine Lücke in der Dose

Die Dose nennt RADBIRD, FlySafe, Aloft/bioRad und IdentiFlight. Es fehlt der wichtigste Präzedenzfall:

**Die Niederlande schalten seit Mai 2023 Offshore-Windparks bei prognostiziertem Massenzug ab** —
Borssele und ein Park bei Egmond aan Zee, vier Stunden, als internationale Premiere; seither
Regelbetrieb mit Schwellenwert, 48-h-Prognose, Deckel 60 h/Jahr und <2 U/min **[S] (Noordzeeloket)**,
**[s] (Medienberichte)**.

→ Das ist **kein** Argument gegen die Dose — es ist ihr stärkstes Argument: Das Verfahren ist
international bereits behördlich akzeptiert und im Betrieb erprobt. Aber es verschiebt die
Neuheitsbehauptung: Neu ist nicht „radarbasiertes Smart Curtailment", neu ist die **offene,
betreiberseitige, ökonomisch normierte Umsetzung (BP/MWh) auf Basis nationaler Open Data für
Onshore-Anlagen**. So formuliert hält die Neuheit; so wie sie jetzt dasteht, ist sie angreifbar.

**Ebenfalls zu präzisieren — FlySafe:** Die Dose sagt „voll operativ in NL/BE/DE". Das **stimmt**
(UvA/IBED, Royal Netherlands Air and Space Force, KNMI; Dashboard deckt „The Netherlands, Germany
and Belgium based on weather radars"; „free-to-use to the whole community") **[S]**. Aber daraus
folgt: Eine offene, nahezu echtzeitfähige Vogelzug-Information **für Deutschland existiert bereits**.
Die Dose sollte das aktiv einräumen und ihre Abgrenzung entsprechend schärfen — der ungelöste Teil
ist die Brücke von der Information zur **anlagenscharfen, auditierbaren Betriebsentscheidung**,
nicht die Information selbst.

---

# Gesamtbewertung

| # | Prüfpunkt | Verdikt |
|---|---|---|
| 1 | DWD Open Data, ungefilterte PVOL, 17 Standorte, RHOHV/ZDR | **stimmt** — aber ≈48 h Vorhaltezeit kippt Ticket 1; Lizenz ist CC BY 4.0 |
| 2 | vol2bird / bioRad / vol2birdR, MistNet | **stimmt teilweise** — MistNet auf DWD nicht lauffähig (kein WRADH, C-Band); ρHV-Schwelle falsch |
| 3 | Aloft: >150 Stationen, 18 Länder, täglich, Scientific Data 2025 | **stimmt teilweise** — 141 Stationen; „täglich" nur für `baltrad`; DE historisch enthalten, aktuelle Abdeckung unbelegt |
| 4 | EIC Pathfinder Open 2026 | **falsch in der Nutzung** — Frist 12.05.2026 verstrichen, Konsortium ≥3 nötig, TRL passt nicht |
| 5 | § 44 BNatSchG + starre Vogelzug-Abschaltungen onshore | **Prämisse hält nicht** — § 45b ist einschlägig; die beschriebene Auflage existiert onshore nicht |
| 6 | Physik-Größenordnungen | **teils belegt** — MTR, Rotorhöhen, Anlagengröße, Abregelungskosten belegt; Vögel/km³ und Band-Durchflugwahrscheinlichkeit **nicht belegbar** |

## Was vor einem Versand zwingend geändert werden muss

1. **Problembeschreibung** neu schreiben: onshore gibt es keine starren Vogelzug-Abschaltungen.
2. **§ 44 → § 45b BNatSchG i. V. m. Anlage 1** an beiden Stellen.
3. **Fördertopf austauschen** (EIC Pathfinder Open 2026 ist durch) und die neue Wahl einzeln gegen
   den laufenden Call prüfen.
4. **Ticket 1 umbauen:** 48 h Vorhaltezeit → vorwärts sammeln; Pilotradar **Essen oder
   Neuheilenbach** statt Prötzel/Boostedt; Referenz **RMI-CROW** statt Aloft.
5. **MistNet** aus der Begründung nehmen; Dual-Pol-Filterung an seine Stelle.
6. **Zahlen korrigieren:** ρHV 0,85 → 0,95 (oder als eigene Wahl kennzeichnen); Aloft „>150
   Stationen" → „151 Radare an 141 Standorten"; Rotorebene einheitlich **71–221 m** mit Quelle;
   Lizenz CC BY 4.0.
7. **„Wer es schon versucht hat"** um den niederländischen Regelbetrieb seit 2023 ergänzen und die
   Neuheitsbehauptung entsprechend schärfen.

## Offene Punkte (ehrlich als „nicht belegbar" markiert)

- Gesetzeswortlaut § 45b BNatSchG und Anlage 1 — alle drei Volltextquellen gesperrt.
- Aktuelle Abdeckung deutscher Radare im laufenden BALTRAD/Aloft-Strom.
- Vogeldichten in Vögeln/km³ mit publizierter Quelle.
- Kollisionswahrscheinlichkeit pro Rotordurchflug (Band-Modell, Stufe 1).
- Passgenauigkeit und Fristen der alternativen Fördertöpfe.

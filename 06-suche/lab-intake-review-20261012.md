# Shared Lab intake — Reviewer Triage 12.10.2026

Worker `reviewer-one`. 3 neue immutable Batches / 9 Ideen aus PR #200 (Themenfokus Brandenburg, Edge AI / TinyML Vision, Low-Cost DIY-Kits).
Workflow-Zustand aller 3 Batches: **`needs_research`**. **0 neue Dosen gepackt, keine neuen Gräber.**

---

## 1. Übersicht der verarbeiteten Batches

| Batch-ID | Engine | Model | Ideen | Status |
|---|---|---|---|---|
| `amelie-lab-scarcity-scarcity-20261012T162800-brandenburg-bfcf0383978716ba` | scarcity | deepseek/deepseek-chat | 3 (C1–C3) | `needs_research` |
| `amelie-lab-lacunar-lacunar-20261012T162600-brandenburg-vision-8b24bbe93b5be681` | lacunar | gemini-2.5-flash | 3 (C1–C3) | `needs_research` |
| `amelie-lab-inversion-inversion-20261012T162500-brandenburg-diy-333acaf74ea82550` | inversion | deepseek/deepseek-chat | 3 (C1–C3) | `needs_research` |

---

## 2. Detaillierte Prüfung und Triage-Urteile

### Batch 1: `amelie-lab-scarcity-scarcity-20261012T162800-brandenburg-bfcf0383978716ba`
**Intent:** Radikal kostengünstige, autonome persistente Vision-Knoten in Brandenburg unter extremen Randbedingungen (Funkloch, Brand-/Denkmalschutz BbgBO § 32 Abs. 5, LWaldG § 23, VdS 2000).

- **C1 · FeldWacht-DIY (SchwarzwildSchneise)**
  - *Konzept:* Eigensicherer €38 DIY-Vision-Bausatz (ESP32-S3 Cam, IP67-Spelsberg-Gehäuse, 32700 LiFePO4, 5W Solar) zur Erkennung von Schwarzwildrotten im Funkloch via 12-Byte LoRaWAN.
  - *Reviewer-Urteil:* **`unklar` / Needs Research** (V1–V8: `2,3,3,3,3,3,1,2` · Kern **18/35**, Gesamt 20/40).
  - *Gate-Lücke:* Falsch-Positiv-Rate von On-Device INT8-Objekterkennung bei Nacht/Dämmerung im dichten Bewuchs (Mais/Dickicht) unbelegt; Antennen- und Ausbreitungsreichweite von LoRaWAN über welligem Agrarterrain in Senken/Funklöchern ohne Messprotokoll.

- **C2 · ReetWacht / BalkenAuge**
  - *Konzept:* Eigensicherer €52 Denkmalschutz- & ATEX-Bausatz mit Niedrigstlux-DSSC-Solarzellen und 50F-Superkondensatoren zur optischen Überwachung von Dachbalkendurchbiegung und Glimmnestern.
  - *Reviewer-Urteil:* **`unklar` / Needs Research** (V1–V8: `2,2,2,4,3,3,1,2` · Kern **17/35**, Gesamt 19/40).
  - *Gate-Lücke:* Keine nachgewiesene ATEX-/VdS-Zertifizierung oder behördliche Denkmalschutz-Duldung für Eigenbau-Knoten in Reetdecken; Sub-Millimeter-Genauigkeit optischer Passermarken bei schlechten Lichtverhältnissen im Dachstuhl ohne externe Beleuchtung ungeprüft.

- **C3 · GlutHorizont**
  - *Konzept:* €44 Baumstamm-Mikrosensor-Bausatz mit vertikalem bifazialem Solarband und LTO-Zellen zur Erkennung bodennaher Glimmrauch-Vektoren unter der Kiefernkrone bei Waldbrandstufe 5.
  - *Reviewer-Urteil:* **`unklar` / Needs Research** (V1–V8: `2,3,2,4,3,3,1,2` · Kern **18/35**, Gesamt 20/40).
  - *Gate-Lücke:* LWaldG § 23 Zündquellenverbot im Wald verlangt formale Unbedenklichkeitsprüfung forstlicher Elektronik; thermisch-optische Unterscheidung von Bodenfeuer vs. aufgewirbeltem Sand/Staub unter Kronendach erfordert empirischen Sensor-Feldtest.

---

### Batch 2: `amelie-lab-lacunar-lacunar-20261012T162600-brandenburg-vision-8b24bbe93b5be681`
**Intent:** Autonome persistente Niedrigstpreis-Vision-Knoten (<€35) mit Edge-AI und Mikrotelemetrie im ländlichen Handwerks- und Agrarbereich.

- **C1 · DachWächter**
  - *Konzept:* Modularer DIY-Bausatz (<€28 BOM) für Handwerker (Dachdecker/Zimmermann) zur optischen Gerüst- und Notabdichtungs-Telemetrie (sub-gradige Gerüstneigung, Flatterfrequenz von Unterspannbahnen, Diebstahl).
  - *Reviewer-Urteil:* **`unklar` / Needs Research** (V1–V8: `2,3,3,4,3,3,1,2` · Kern **19/35**, Gesamt 21/40).
  - *Gate-Lücke:* Flatterfrequenz-Korrelation zur Reißgrenze von Planen ist nicht physikalisch kalibriert; Haftungsabgrenzung nach VOB/B § 4 Nr. 5 (Sturmschäden) und BG-Bau-Gerüstvorschriften ungelöst.

- **C2 · BeregnungsAuge**
  - *Konzept:* Autonome optische Schlauchtrommel- und Druckpegel-Telemetrie (<€28 BOM). Liest analoge Bourdon-Manometer berührungslos optisch aus und misst Trommelumdrehungen auf märkischen Sandböden.
  - *Reviewer-Urteil:* **`verengt` / Needs Research** (V1–V8: `3,3,3,3,3,3,1,2` · Kern **19/35**, Gesamt 21/40).
  - *Gate-Lücke:* Starker optischer Einfluss durch Verschmutzung, Wassertropfen und Sonnenreflexionen auf analogen Manometer-Glasscheiben; benötigt robuste Bildfilterung und Feldkalibrierung an realen Beregnungsmaschinen (z.B. Bauer/Beinlich).

- **C3 · HelioDrop**
  - *Konzept:* Autonome Sonnenblumen-Heliotropismus- und Wildschwein-Korridor-Telemetrie (Blütenteller-Neigung als Trockenstress-Indikator, 24,50 € BOM).
  - *Reviewer-Urteil:* **`unklar` / Needs Research** (V1–V8: `2,3,2,3,3,3,1,3` · Kern **17/35**, Gesamt 20/40).
  - *Gate-Lücke:* Biomechanische Korrelation zwischen Blütentellerneigung und Bodenfeuchte stark sorten- und stadiumabhängig (vegetativ vs. reproduktiv); ZALF-Forschungsarbeiten bieten keine fertige Lookup-Tabelle für On-Device-Schlüsse.

---

### Batch 3: `amelie-lab-inversion-inversion-20261012T162500-brandenburg-diy-333acaf74ea82550`
**Intent:** Inversion etablierter Miet- und Überwachungssysteme (BauWatch, Leitstellen, Cloud-Kameras) zugunsten von €49 Open-Hardware DIY-Kits für Brandenburger Betriebe.

- **C1 · HofBausatz**
  - *Konzept:* 49-Euro-Selbstbau-Kit (ESP32-S3, 5W Solar, LiFePO4, Schnappschelle) zur Erkennung von Kanister-, Schlauch- und Hebelwerkzeug-Trajektorien an Agrardieseltanks und Maschinenschuppen via TinyML mit 12V-Relais/Telegram-Alarm.
  - *Reviewer-Urteil:* **`unklar` / Needs Research** (V1–V8: `2,3,3,3,2,3,1,2` · Kern **17/35**, Gesamt 19/40).
  - *Gate-Lücke:* Falschalarm-Gefahr durch Hoftiere (Hunde, Katzen, Vögel) oder reguläre Nachtbetankung; rechtliche und haftungsrechtliche Aspekte von Blitzlicht/Sirenenauslösung im Außenbereich; Schwellenwert-Validierung notwendig.

- **C2 · HalmWacht**
  - *Konzept:* Autonomer Solar-Pfahl-Visorknoten für Wald-Feld-Kanten, der Einwechselungen von Schwarzwild und Vegetationsknickungen erfasst und 1,2KB-Schadensprotokolle zur Beweissicherung nach BJagdG generiert.
  - *Reviewer-Urteil:* **`unklar` / Needs Research** (V1–V8: `2,3,2,4,3,3,1,2` · Kern **18/35**, Gesamt 20/40).
  - *Gate-Lücke:* Rechtssicherheit und gerichtliche Beweiskraft automatisierter Bildprotokolle nach § 34 BJagdG / § 40 BbgJagdG vor Schiedsämtern und Gutachtern nicht nachgewiesen; Kanten-Segmentierung von Halmknickung bei Regen/Wind anfällig für Artefakte.

- **C3 · FirstWacht**
  - *Konzept:* Magnetischer Gerüst- und First-Knoten zur Erkennung von Notabdichtungsflattern und Sparrendurchbiegung per optischer Flussanalyse und Fiducial-Markern (AprilTags).
  - *Reviewer-Urteil:* **`unklar` / Needs Research** (V1–V8: `2,3,3,4,3,3,1,2` · Kern **19/35**, Gesamt 21/40).
  - *Gate-Lücke:* Nahezu identischer technischer Kern wie DachWächter (C1 aus Batch 2); Sparrendurchbiegung von 15 mm unter Palettenlast erfordert Millimeter-Referenzmessung und Schutz vor Vibrationen durch Baustellenverkehr.

---

## 3. Fazit und Systemstatus

1. Alle 3 Batches wurden formal per `bib lab claim` übernommen und nach Prüfung mit begründeten Hinweisen auf den Zustand **`needs_research`** gesetzt.
2. Keine Idee erreicht den Schwellenwert für das Dose-Ready-Gate (Kern $\ge 24/35$, V1–V7 jeweils $\ge 3$, verifiziertes Empfängermandat).
3. Die Ideen verbleiben als nicht-bindende Hintergrund-Proposals in `06-suche/proposals/` und im Lab-Index unter `lab-ideas.html`, ohne die offizielle Dosen-Pipeline oder das Prüfprotokoll ungeprüft zu belasten.

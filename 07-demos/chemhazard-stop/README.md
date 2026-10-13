# ChemHazard Stop / MischStop — Scaffolding & Offline Regel-Kernel

> **Kompakter 100% Offline-Mischschutz für gewerbliche Reinigungskräfte**  
> *Gemeinfreies Open-Source-Geschenk (CC0 1.0, gemeinfrei) für BIV (Gebäudereiniger-Handwerk), EU-OSHA, BG BAU, DGUV, IG BAU, SEIU und ver.di.*

---




Ergänzung nach PR #202: Vier weitere Herstellerprodukte (PEROTEX INTENSIV, GASTRO PUR ECO, MILIFEE, PEROCID ECO) sind mit unbekannten Gefahren und unbestätigten GTIN-Zuordnungen auswählbar. Die 43 Datensätze aus der Quellenprüfung bleiben unverändert. Aktueller Bestand: 45 reale Produkte (41 mit belegten Gefahren, vier ungeprüft) plus zwei synthetische Beispiele; 96 GTIN-Zuordnungen (91 bestätigt). Die neuen Einträge bleiben UNVERIFIED. [Recherchebelege](additional-product-research-2026-10-12.md).

## 1. Problem & Lücke

Im gewerblichen Reinigungshandwerk arbeiten Beschäftigte unter massivem Zeitdruck und oft über Sprachbarrieren hinweg. Das versehentliche Mischen eines sauren Entkalkers (z. B. WC-Reiniger mit Phosphorsäure) mit einer Chlorbleiche (Natriumhypochlorit) setzt in engen Sanitärräumen schlagartig tödliches Chlorgas frei ($2\text{H}^+ + \text{OCl}^- + \text{Cl}^- \to \text{Cl}_2 \uparrow + \text{H}_2\text{O}$).

Bestehende Referenzsysteme (WINGIS / GISBAU, GESTIS / IFA, DGUV Regel 101-019) sind **reine Schreibtisch-Suchdatenbanken**. Kein Werkzeug steht im Moment des Mischens an der Putzkammer zwischen der Arbeitskraft und den zwei Flaschen. **ChemHazard Stop** schließt diese Lücke als sekundenschneller, 100% offline lauffähiger Point-of-Action-Interlock.

---

## 2. Getestete Software-Invarianten

> [!CAUTION]
> **Die App attestiert niemals Sicherheit.** Ein falsches „alles sicher" (grüner Haken) ist lebensgefährlich und weitaus schlimmer als gar keine App.

Daraus folgen vier unumstößliche Systemregeln:
1. **Niemals ein grüner Bildschirm:** Es gibt keinen Freigabe-Zustand.
2. **Unsicherheit führt immer zu Warnung (`UNVERIFIED`):** Fehlende Daten, zerkratzte Codes oder unbekannte Produkte werden transparent als unprüfbar ausgewiesen.
3. **Community-Daten können niemals ein `STOP` überstimmen.**
4. **Assistenz-Status:** Das Werkzeug ist ein reiner Warn-Assistent, keine PSA, kein Compliance-Audit und kein Ersatz für die gesetzliche Gefährdungsbeurteilung nach GefStoffV.

### Die drei Systemzustände

```text
Identität unbekannt / mehrdeutig / GTIN-Zuordnung unbestätigt → UNVERIFIED
Sonst: nur bestätigte Gefahren in Regeln prüfen
  Regel belegt → STOP (unabhängig von Vollständigkeit / Aktualität)
  Keine Regel belegt → alle drei Evidenzprüfungen dokumentiert?
    Nein / unbekannte Gruppenableitung → UNVERIFIED
    Ja → NO_KNOWN_INCOMPATIBILITY (grau, keine Freigabe)
```

---

## 3. Die Drei-Spuren-Datenarchitektur

Um Urheberrechts- und Haftungsfallen auszuschließen, sind die Daten in drei rechtlich strikt getrennte Spuren unterteilt:

1. **Öffentlich-rechtliche Spur (immer auslieferbar):** Tatsachen aus dem Sicherheitsdatenblatt (REACH Art. 31) und der CLP-Kennzeichnung (EG Nr. 1272/2008): H- und EUH-Sätze, CAS-Nummern, pH. Der Auslöser ist die **Gefahrengruppe**, die aus der CAS-Nummer folgt (Natriumhypochlorit `7681-52-9`). `EUH031` und `EUH206` sind zusätzliche Hinweise vom Etikett, aber keine Bedingung: Reale Chlorreiniger tragen oft nur `EUH206` oder keinen der beiden Sätze (siehe Abschnitt 3a).
2. **Lizenzierte Spur (nur mit Genehmigung):** WINGIS / GISBAU Daten mit offiziellen GISCODE-Tabellen (nur mit schriftlicher BG-BAU-Zustimmung). Die App läuft ohne diese Spur vollständig autark. **Hard Rule: Kein Scraping von GESTIS/WINGIS.**
3. **Offene Community-Spur:** Tatsachen aus Hersteller-Sicherheitsdatenblättern und Herstellerseiten (die Dokumente selbst stehen **nicht** unter freier Lizenz und liegen nicht im Repository), GS1 Digital Link / GTINs und geprüfte PRs von Reinigungsbetrieben und Gewerkschaften.

**Rechtslage der Daten (Einschätzung, keine Rechtsberatung, Stand 13.10.2026):** Gespeichert sind nur Tatsachen (H-/EUH-Sätze, CAS-Nummern, pH, UFI, GISCODE, EAN), dazu Fundstelle, Datum und Hash sowie eigene Kurzbeschreibungen. Tatsachen sind nicht urheberrechtlich geschützt; Sicherheitsdatenblätter muss der Hersteller nach REACH Art. 31 ohnehin kostenlos abgeben. CC0 verzichtet nur auf unsere eigenen Rechte, nicht auf Rechte Dritter. Restrisiko ist das Datenbankrecht des Herstellers (§ 87b UrhG, RL 96/9/EG) bei Entnahme eines *wesentlichen* Teils einer Datenbank; die Entnahmen hier sind klein (z. B. 12 Kiehl-Produkte). Deshalb: keine PDFs, keine Produktbilder, keine Texte aus dem SDB übernehmen; keine Massenentnahme aus Herstellerkatalogen; WINGIS/GESTIS nie. Wer Gewissheit will, holt eine kurze Zustimmung des Herstellers ein (Vorlage: `data/hersteller-zustimmung-vorlage.md`).

---

## 3a. Herkunft der Referenzdaten (Stand 12.10.2026)

Jeder belegte Eintrag in `data/products.json` stammt aus einem Dokument des Herstellers. Gespeichert sind nur Tatsachen plus Fundstelle, Überarbeitungsdatum und SHA-256 der Datei; die PDFs selbst liegen nicht im Repository.

| Quelle | Produkte | Was sie liefert |
|---|---|---|
| Kiehl, Produktseiten und SDB (`kiehl-group.com`) | 12 | SDB-Hashes und veröffentlichte EAN erneut geprüft |
| Buzil, SDB über das Download-Formular der Produktseite | 3 | SDB, UFI, GISCODE; keine EAN veröffentlicht |
| DR.SCHNELL, SDB-Download und Hersteller-Shop | 22 | Deutsche SDB und veröffentlichte EAN-Zuordnungen geprüft |
| Diversey (Domestos Professional), CP GABA (Dan Klorix) | 2 | Historische Händlerkopien; aktueller Stand offen |
| Meffert (Salmiakgeist 9,5 %) | 1 | Hersteller-SDB von 2025, Materialnummer und UFI geprüft |
| Mellerud, Datenblatt über Inhaltsstoffe (Detergenzien-VO Anhang VII D) | 1 | nur INCI-Namen; H-Sätze und pH fehlen |

Regeln für neue Einträge:

1. `node scripts/chemhazard-sds.mjs extract <pdf|url>` liest H-/EUH-Sätze (nur Abschnitt 2), CAS-Nummern (Abschnitt 3), pH (Abschnitt 9), UFI, GISCODE und Datum. Exit 2 heißt: Abschnitte nicht erkannt, von Hand am SDB prüfen.
2. `chemicalGroups` wird aus diesen Tatsachen abgeleitet (Tabelle `GROUP_RULES` im Skript) und nie von Hand gesetzt. Der Wächter vergleicht beides.
3. Eine GTIN kommt nur kanonisch 14-stellig mit Fundstelle (`gtinSource`), per-Mapping-Bestätigung und gültiger GS1-Prüfziffer in den Bestand. Ein SDB enthält keine EAN; fehlt sie beim Hersteller, bleibt das Feld leer und der Strichcode wird am Gebinde erfasst.
4. Ein GISCODE wird nur übernommen, wenn der Hersteller ihn im eigenen SDB nennt. WINGIS wird nicht abgefragt.
5. `node scripts/chemhazard-sds.mjs check` (auch als Vitest-Wächter) prüft Schema, Prüfziffern, Herkunft und Ableitung.
6. `npm run chemhazard:barcodes` schreibt zu jeder GTIN den Strichcode als SVG nach `data/barcodes/`; `check` meldet fehlende oder veraltete Dateien.

**Befund aus den echten Daten:** Die Chlorgas-Regel verlangte bisher `EUH031` auf einem der beiden Etiketten. Dan Klorix trägt laut SDB `EUH206`, Domestos Professional Original keinen der beiden Sätze. Säure plus diese Produkte wäre ohne Warnung geblieben. Die Regel hängt jetzt allein an den Gefahrengruppen; ein Test prüft jede Säure gegen jeden Chlorreiniger.

**QR-Codes:** In den öffentlichen Unterlagen der Hersteller (SDB, Produktinformation, Betriebsanweisung, Produktbild) ist kein QR-Code enthalten; was auf dem Gebinde gedruckt ist, lässt sich nur am Gebinde auslesen. Die Engine versteht bereits den GS1 Digital Link (`https://id.gs1.org/01/<GTIN>`), den ein GS1-QR-Code trägt, und den UFI vom Etikett.

**Offen:** Die verbleibenden zwei Händlerkopien durch abrufbare Fassungen direkt vom Hersteller ersetzen (Dan Klorix ist von 2020); EAN für Buzil, Domestos und Salmiakgeist am Gebinde erfassen; veröffentlichte DR.SCHNELL-EAN je Gebinde/SDB gegenprüfen; H-Sätze für Mellerud vom Etikett nachtragen.

---

## 3b. Quellenprüfung und aktueller Bestand

Die [Quellenprüfung vom 12.10.2026](product-review-2026-10-12.md) erweitert den Bestand auf **41 reale Produkte plus zwei synthetische Beispiele**, mit **92 GTINs (91 bestätigte Zuordnungen)**. 21 zusätzliche DR.SCHNELL-Produkte sind über Hersteller-SDB und Hersteller-EAN belegt. Mefferts Hersteller-SDB von 2025 ersetzt die alte Händlerkopie. Aktueller Quellenstand ist für 36 Produkte dokumentiert; chemische Vollständigkeit bleibt überall ausstehend. Fünf neue Produkte bleiben in der Gruppe `unknown`.

Die Messkonzentration des pH steht in `ph.concentrationPercent`. Bei DESIFOR-QUICK und ECOLUTION FOROL STICKS gilt sie für 1%ige Lösungen; daraus wird keine pH-Gruppe des Konzentrats abgeleitet. `data/source-review-2026-10-12.json` protokolliert Quellen, Hashes und offene Punkte. `source-audit-manifest.json` und `scripts/chemhazard-source-audit.mjs` erlauben einen erneuten Abruf, ohne Produktdaten automatisch zu ändern.

## Erste Identitätsrecherche (historischer Stand vor der Quellenprüfung)

Die [Recherche vom 12.10.2026](product-research-2026-10-12.md) dokumentiert 13 zusätzliche DR.SCHNELL-Produkte mit 22 Hersteller-EAN sowie vier EAN für das bestehende MILIZID. Der separate Recherchebestand `data/product-candidates.json` enthält nun den Quellenprüfstatus und verweist auf die übernommenen Laufzeitprodukte. Er wird nicht vom Simulator eingelesen. Chemische Vollständigkeit und physischer Gebindeabgleich bleiben offen. Zwei EAN leerer ECOLUTION-Sprühflaschen sind ausdrücklich vom Produktimport ausgeschlossen.

## 4. Repository-Struktur

```
07-demos/chemhazard-stop/
├── README.md                           # Architektur & Sicherheitsnachweis
├── ticket-01-offline-interlock.md      # P0 Implementierungs-Ticket (DoD)
├── ticket-02-camera-barcode-ocr-pipeline.md   # später: native App, Etiketten-OCR
├── ticket-03-polyglot-audio-and-4channel-alert.md  # später: App-Alarm, aufgenommene Warnrufe
├── ticket-04-web-scanner-und-qr-etiketten.md  # NÄCHSTES: Kamera-Scan im Browser + QR-Etiketten
├── schemas/
│   ├── product.schema.json             # JSON-Schema für Reinigungsmittel
│   └── rule.schema.json                # JSON-Schema für Inkompatibilitätsregeln
└── data/
    ├── products.json                   # 41 belegte + 4 ungeprüfte Produkte + 2 synthetische Beispiele
    ├── barcodes/<gtin>.svg             # EAN-13-Strichcode je GTIN (erzeugt, 96 Dateien + Übersicht README.md)
    └── rules.json                      # Inkompatibilitäts-Matrix (Säure+Chlor, etc.)
```

Das Werkzeug dazu liegt in `scripts/chemhazard-sds.mjs` (`extract <pdf|url>` und `check`).

Die TypeScript-Laufzeitengine und die automatisierte Testsuite liegen in `src/engine/chemhazard/`:
* `src/engine/chemhazard/chemHazardEngine.ts` — 100% Offline Regel-Kernel & Multi-Kanal-Logik.
* `src/engine/chemhazard/ean13.ts` — EAN-13-Strichcode aus der GTIN, damit der Simulator den Code des echten Gebindes zeigt.
* `src/engine/chemhazard/chemHazardEngine.test.ts` — Vitest-Regressionstests über alle Zustände und Invarianten, dazu der Datenwächter (Prüfziffern, Herkunft, Ableitung der Gefahrengruppen) mit Gegenproben.

## 5. Live-Demo & Video-Demonstration

* **Interaktiver Web-Simulator:** [felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety](https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety) (Dosis: `ChemHazard Stop`)
* **Video-Demonstration (Point-of-Action Praxistest):** [Auf Google Drive ansehen](https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link) *(extern gestreamt, 0 KB Vorab-Download)*

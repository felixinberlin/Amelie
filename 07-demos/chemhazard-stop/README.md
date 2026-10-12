# ChemHazard Stop / MischStop — Scaffolding & Offline Regel-Kernel

> **Kompakter 100% Offline-Mischschutz für gewerbliche Reinigungskräfte**  
> *Gemeinfreies Open-Source-Geschenk (CC0 / AGPL-3.0) für BIV (Gebäudereiniger-Handwerk), EU-OSHA, BG BAU, DGUV, IG BAU, SEIU und ver.di.*

---

## 1. Problem & Lücke

Im gewerblichen Reinigungshandwerk arbeiten Beschäftigte unter massivem Zeitdruck und oft über Sprachbarrieren hinweg. Das versehentliche Mischen eines sauren Entkalkers (z. B. WC-Reiniger mit Phosphorsäure) mit einer Chlorbleiche (Natriumhypochlorit) setzt in engen Sanitärräumen schlagartig tödliches Chlorgas frei ($2\text{H}^+ + \text{OCl}^- + \text{Cl}^- \to \text{Cl}_2 \uparrow + \text{H}_2\text{O}$).

Bestehende Referenzsysteme (WINGIS / GISBAU, GESTIS / IFA, DGUV Regel 101-019) sind **reine Schreibtisch-Suchdatenbanken**. Kein Werkzeug steht im Moment des Mischens an der Putzkammer zwischen der Arbeitskraft und den zwei Flaschen. **ChemHazard Stop** schließt diese Lücke als sekundenschneller, 100% offline lauffähiger Point-of-Action-Interlock.

---

## 2. Der fundamentale Sicherheitsnachweis (Safety Case)

> [!CAUTION]
> **Die App attestiert niemals Sicherheit.** Ein falsches „alles sicher" (grüner Haken) ist lebensgefährlich und weitaus schlimmer als gar keine App.

Daraus folgen vier unumstößliche Systemregeln:
1. **Niemals ein grüner Bildschirm:** Es gibt keinen Freigabe-Zustand.
2. **Unsicherheit führt immer zu Warnung (`UNVERIFIED`):** Fehlende Daten, zerkratzte Codes oder unbekannte Produkte werden transparent als unprüfbar ausgewiesen.
3. **Community-Daten können niemals ein `STOP` überstimmen.**
4. **Assistenz-Status:** Das Werkzeug ist ein reiner Warn-Assistent, keine PSA, kein Compliance-Audit und kein Ersatz für die gesetzliche Gefährdungsbeurteilung nach GefStoffV.

### Die drei Systemzustände

```
               [ Scanne Flasche A + Flasche B ]
                             │
                             ▼
         [ Beide in lokaler Datenbank verifiziert? ]
                   /                    \
                NEIN                    JA
                 │                       │
                 ▼                       ▼
         🟠 UNVERIFIED           [ Berechne Gefahren-Mengenvereinigung ]
    (Bernsteinfarben, Haptik)     combined = hazards(A) ∪ hazards(B)
                                         /               \
                          Regel ausgelöst?               Keine Inkompatibilität
                                 /                                \
                                JA                               NEIN
                                │                                 │
                                ▼                                 ▼
                             🔴 STOP              ⚪ NO_KNOWN_INCOMPATIBILITY
                        (Rot, 4-Kanal-Alarm)         (Grau — Niemals grün!
                                                      Pflicht-Disclaimer)
```

---

## 3. Die Drei-Spuren-Datenarchitektur

Um Urheberrechts- und Haftungsfallen auszuschließen, sind die Daten in drei rechtlich strikt getrennte Spuren unterteilt:

1. **Öffentlich-rechtliche Spur (immer auslieferbar):** Tatsachen aus dem Sicherheitsdatenblatt (REACH Art. 31) und der CLP-Kennzeichnung (EG Nr. 1272/2008): H- und EUH-Sätze, CAS-Nummern, pH. Der Auslöser ist die **Gefahrengruppe**, die aus der CAS-Nummer folgt (Natriumhypochlorit `7681-52-9`). `EUH031` und `EUH206` sind zusätzliche Hinweise vom Etikett, aber keine Bedingung: Reale Chlorreiniger tragen oft nur `EUH206` oder keinen der beiden Sätze (siehe Abschnitt 3a).
2. **Lizenzierte Spur (nur mit Genehmigung):** WINGIS / GISBAU Daten mit offiziellen GISCODE-Tabellen (nur mit schriftlicher BG-BAU-Zustimmung). Die App läuft ohne diese Spur vollständig autark. **Hard Rule: Kein Scraping von GESTIS/WINGIS.**
3. **Offene Community-Spur:** Hersteller-Sicherheitsdatenblätter (unter freier Lizenz), GS1 Digital Link / GTINs und verifizierte PRs von Reinigungsbetrieben und Gewerkschaften.

---

## 3a. Herkunft der Referenzdaten (Stand 12.10.2026)

Jeder belegte Eintrag in `data/products.json` stammt aus einem Dokument des Herstellers. Gespeichert sind nur Tatsachen plus Fundstelle, Überarbeitungsdatum und SHA-256 der Datei; die PDFs selbst liegen nicht im Repository.

| Quelle | Produkte | Was sie liefert |
|---|---|---|
| Kiehl, Produktseiten und SDB (`kiehl-group.com`) | 12 | SDB, UFI, GISCODE und **alle EAN je Gebindegröße** |
| Buzil, SDB über das Download-Formular der Produktseite | 3 | SDB, UFI, GISCODE; keine EAN veröffentlicht |
| DR.SCHNELL, SDB-Download | 1 | SDB; keine EAN veröffentlicht |
| Diversey (Domestos Professional), CP GABA (Dan Klorix), Meffert (Salmiakgeist) | 3 | SDB des Herstellers, abgerufen als Kopie bei einem Händler |
| Mellerud, Datenblatt über Inhaltsstoffe (Detergenzien-VO Anhang VII D) | 1 | nur INCI-Namen; H-Sätze und pH fehlen |

Regeln für neue Einträge:

1. `node scripts/chemhazard-sds.mjs extract <pdf|url>` liest H-/EUH-Sätze (nur Abschnitt 2), CAS-Nummern (Abschnitt 3), pH (Abschnitt 9), UFI, GISCODE und Datum. Exit 2 heißt: Abschnitte nicht erkannt, von Hand am SDB prüfen.
2. `chemicalGroups` wird aus diesen Tatsachen abgeleitet (Tabelle `GROUP_RULES` im Skript) und nie von Hand gesetzt. Der Wächter vergleicht beides.
3. Eine GTIN kommt nur mit Fundstelle (`gtinSource`) und gültiger GS1-Prüfziffer in den Bestand. Ein SDB enthält keine EAN; fehlt sie beim Hersteller, bleibt das Feld leer und der Strichcode wird am Gebinde erfasst.
4. Ein GISCODE wird nur übernommen, wenn der Hersteller ihn im eigenen SDB nennt. WINGIS wird nicht abgefragt.
5. `node scripts/chemhazard-sds.mjs check` (auch als Vitest-Wächter) prüft Schema, Prüfziffern, Herkunft und Ableitung.
6. `npm run chemhazard:barcodes` schreibt zu jeder GTIN den Strichcode als SVG nach `data/barcodes/`; `check` meldet fehlende oder veraltete Dateien.

**Befund aus den echten Daten:** Die Chlorgas-Regel verlangte bisher `EUH031` auf einem der beiden Etiketten. Dan Klorix trägt laut SDB `EUH206`, Domestos Professional Original keinen der beiden Sätze. Säure plus diese Produkte wäre ohne Warnung geblieben. Die Regel hängt jetzt allein an den Gefahrengruppen; ein Test prüft jede Säure gegen jeden Chlorreiniger.

**QR-Codes:** In den öffentlichen Unterlagen der Hersteller (SDB, Produktinformation, Betriebsanweisung, Produktbild) ist kein QR-Code enthalten; was auf dem Gebinde gedruckt ist, lässt sich nur am Gebinde auslesen. Die Engine versteht bereits den GS1 Digital Link (`https://id.gs1.org/01/<GTIN>`), den ein GS1-QR-Code trägt, und den UFI vom Etikett.

**Offen:** Die drei Händlerkopien durch Fassungen direkt vom Hersteller ersetzen (Dan Klorix ist von 2020); EAN für Buzil, DR.SCHNELL, Domestos und Salmiakgeist am Gebinde erfassen; H-Sätze für Mellerud vom Etikett nachtragen.

---

## 4. Repository-Struktur

```
07-demos/chemhazard-stop/
├── README.md                           # Architektur & Sicherheitsnachweis
├── ticket-01-offline-interlock.md      # P0 Implementierungs-Ticket (DoD)
├── schemas/
│   ├── product.schema.json             # JSON-Schema für Reinigungsmittel
│   └── rule.schema.json                # JSON-Schema für Inkompatibilitätsregeln
└── data/
    ├── products.json                   # 20 belegte Referenzprodukte + 2 erfundene UNVERIFIED-Beispiele
    ├── barcodes/<gtin>.svg             # EAN-13-Strichcode je GTIN (erzeugt, 51 Dateien + Übersicht README.md)
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

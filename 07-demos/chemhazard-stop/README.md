# ChemHazard Stop / MischStop — Scaffolding & Offline Regel-Kernel

> **Kompakter 100% Offline-Mischschutz für gewerbliche Reinigungskräfte**  
> *Gemeinfreies Open-Source-Geschenk (CC0 / AGPL-3.0) für BG BAU, DGUV, IG BAU, SEIU, EFCI und ver.di.*

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

1. **Öffentlich-rechtliche Spur (immer auslieferbar):** EU-CLP-Gefahren- und EUH-Sätze (EG Nr. 1272/2008). Insbesondere `EUH031` (*„Entwickelt bei Berührung mit Säure giftige Gase"*) dient als deterministischer Auslöser.
2. **Lizenzierte Spur (nur mit Genehmigung):** WINGIS / GISBAU Daten mit offiziellen GISCODE-Tabellen (nur mit schriftlicher BG-BAU-Zustimmung). Die App läuft ohne diese Spur vollständig autark. **Hard Rule: Kein Scraping von GESTIS/WINGIS.**
3. **Offene Community-Spur:** Hersteller-Sicherheitsdatenblätter (unter freier Lizenz), GS1 Digital Link / GTINs und verifizierte PRs von Reinigungsbetrieben und Gewerkschaften.

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
    ├── products.json                   # 20 kuratierte Referenzprodukte (P0)
    └── rules.json                      # Inkompatibilitäts-Matrix (Säure+Chlor, etc.)
```

Die TypeScript-Laufzeitengine und die automatisierte Testsuite liegen in `src/engine/chemhazard/`:
* `src/engine/chemhazard/chemHazardEngine.ts` — 100% Offline Regel-Kernel & Multi-Kanal-Logik.
* `src/engine/chemhazard/chemHazardEngine.test.ts` — Vitest-Regressionstests über alle Zustände, Invarianten und 20 Realszenarien.

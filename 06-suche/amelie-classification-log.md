# Amélie — Idea Classification & Review Log

Cumulative record of all candidate evaluations conducted by the Idea Reviewer. Every entry records the 7-vector ratings, civic SWOT, tech tree coordinates, and triage recommendations.

---

## Cumulative Scoreboard

| Date | Idea ID | Title | Origin Engine | Vector Score (/35) | Primary Source | Triage Verdict | Next Action |
|---|---|---|---|:---:|---|:---:|---|
| 2026-09-25 | `bleifrei-lotse` | Bleifrei-Lotse: TrinkwV § 17 Bleirohr-Detektor & Behörden-Melder | `asymmetric-inversion` | 31/35 | Type A (TrinkwV § 17) | `Dose Ready` | Verpacken in `05-dosen/bleifrei-lotse.md` & Erstkontakt mit vzbv |
| 2026-09-25 | `legio-klar` | LegioKlar: TrinkwV § 31/52 Legionellen-Aushang-Decoder | `asymmetric-inversion` | 28/35 | Type A/B (TrinkwV/UBA) | `Verengt` | Tesseract-WASM Extraktion auf Test-Laborberichten validieren |

---

## Detailed Review Dossiers

### Review Dossier: Bleifrei-Lotse (`bleifrei-lotse`)
* **Review Date:** 25.09.2026
* **Origin Engine:** `asymmetric-inversion` (Run 2)
* **Intended Recipient:** Verbraucherzentrale Bundesverband (vzbv) · Deutscher Mieterbund (DMB) · Gesundheitsamt Berlin-Mitte

#### 1. Vector Radar (Score: 31/35)

| Vector | Score (1-5) | Grounding & Empirical Evidence |
|---|:---:|---|
| **V1 · Novelty** | **4/5** | **Asymmetric Inversion**: Flips the landlord's informational monopoly and health department inspection deficit into a citizen evidentiary shield. Lacunar Gap: *„Mieter in Altbauten (vor 1973) haben keine zerstörungsfreie Methode, um den Bleistatus ihrer Keller- und Steigstränge ohne 100-€-Laboranalyse rechtssicher zu prüfen."* |
| **V2 · Complexity** | **4/5** | **Tier 1/2 (Client-Side Static)**: 100% browser-basiertes HTML5/TypeScript. Nutzt Web Audio API (FFT für Klopfton-Resonanz) und Canvas für Makro-Kratzspur-Farbabgleich. Null Cloud-Kosten, null Datenbank, null Benutzerkonto. |
| **V3 · Possibility** | **5/5** | **Harter gesetzlicher Stichtag**: 12. Januar 2026 (ausnahmsloses Stilllegungsverbot gem. § 17 TrinkwV). Commodity-Kameras lösen heute mikroskopische Wulstlötungen und Farbverläufe problemlos auf; Web Audio FFT läuft in Echtzeit. |
| **V4 · Future/Longevity** | **5/5** | **Bundesweite Bundesgesetzblatt-Norm**: Gilt unbefristet fort. Statische Auslieferung über GitHub Pages hat unendliche Wartungshalbwertszeit (kein Backend-Bitrot). Hohe zivilgesellschaftliche Hebelwirkung für hunderttausende Altbaumietende. |
| **V5 · Civic SWOT** | **4/5** | **Defensive Publication (CC0)**: Verhindert Patentierung trivialer mobiler Materialtests. Schwachstelle (*Achillesferse*): Zerstörungsfreie Tests können Rohre hinter Schachtwänden nicht erfassen $\to$ System muss Wahrscheinlichkeitsscore ausweisen. |
| **V6 · Tech Tree** | **4/5** | **Klarer Level-2-Trunk**: Stützt sich auf offene Web-Standards (AudioContext, Canvas, PDFMake). Schaltet nachgelagerte kommunale Kataster freie Bleirohrmeldungen für Gesundheitsämter frei. |
| **V7 · Documentation** | **5/5** | **Type A Mandat**: BGBl. 2023 I Nr. 159 (§ 17, § 64 TrinkwV). Absolute juristische Primärquellentreue. |

#### 2. Tech Tree Position

```
[Layer 0: Roots]
├── TrinkwV 2023 § 17 (BGBl. I Nr. 159, Stilllegungsverbot ab 12.01.2026)
├── Web Audio API (AudioWorklet / AnalyserNode FFT)
└── Client-side Canvas 2D / PDF Generation (pdfmake/jsPDF)
        │
        ▼
[Layer 1: Trunk / First Step Ticket]
└── Minimal Standalone Web-Tool:
    4-Schritt-Entscheidungsbaum (Magnet ➔ Kratzfarbe ➔ Wulstlötung ➔ Klopfton)
    + Automatischer PDF-Musterbrief (Auskunft § 17 Abs. 6 & Gesundheitsamts-Anzeige)
        │
        ▼
[Layer 2: Downstream Civic Branches]
├── Branch A: Zivilgesellschaftliche Meldeplattform für Mietervereine
├── Branch B: Kommunales Fall-Dashboard für überlastete Hygieneämter
└── Branch C: Aggregierte Altbau-Risikokarte (OpenStreetMap-Integration)
```

#### 3. Civic SWOT

| Strengths (S) | Weaknesses (W) |
|---|---|
| • 100% kostenlos und datensparsam (Zero-Cloud)<br>• Keine Abhängigkeit von teuren Labor-Kits<br>• Direkte juristische Verankerung in § 17 TrinkwV | • Kann verdeckte Steigleitungen hinter Mauern nicht sehen<br>• Abhängig von korrekter Ausführung der Ritzprobe<br>• Keine akkreditierte DIN-ISO-Laborzertifizierung |
| **Opportunities (O)** | **Threats (T)** |
| • Offizielle Übernahme durch vzbv oder Mieterbund<br>• Förderfähig durch Prototype Fund / DBU<br>• Schließt die akute Vollzugslücke der Gesundheitsämter | • Rechtliche Einschüchterungsversuche durch Vermieterverbände<br>• Fehlalarme bei verzinnten Kupferrohren erfordern Kalibrierung |

* **Achillesferse:** Verwechslung von verzinktem Eisen/Zinn mit Weichblei bei unsachgemäßer Kratzprobe $\to$ *Architektonische Lösung:* Zwingender Magnet-Vorfilter (Magnete haften an Eisen/Stahl, niemals an Blei oder Kupfer) eliminiert 90 % der potenziellen Falsch-Positiven vor dem Kratztest.

#### 4. Triage Verdict & Synthesis

* **Verdict:** `Dose Ready (Packen)`
* **Restlücke:** Die Lücke ist die geführte mobile Prüfkette vor Ort, die aus dem Smartphone ein diagnostisches Werkzeug macht und direkt den gesetzeskonformen Brief an Vermieter und Amt erzeugt.
* **Empfohlene nächste Aktion:** Erstellung des Dosen-Dossiers `05-dosen/bleifrei-lotse.md` mit erstem lauffähigen Ticket und Testsuite.

---

### Review Dossier: LegioKlar (`legio-klar`)
* **Review Date:** 25.09.2026
* **Origin Engine:** `asymmetric-inversion` (Run 2)
* **Intended Recipient:** Berliner Mieterverein e.V. · Verbraucherzentrale NRW

#### 1. Vector Radar (Score: 28/35)

| Vector | Score (1-5) | Grounding & Empirical Evidence |
|---|:---:|---|
| **V1 · Novelty** | **4/5** | **Layer Inversion**: Die UBA-Berechnungsmatrix ist bekannt; die Lücke ist die automatische Eingabe-Extraktion aus unleserlichen Treppenhaus-Aushängen. Lacunar Gap: *„Mieter haben keinen barrierefreien Weg, um die kryptischen Laborwerte im Treppenhaus sofort in ihre gesetzlichen Schutzrechte zu übersetzen."* |
| **V2 · Complexity** | **3/5** | **Tier 2 (Client-Side WASM OCR)**: Benötigt Tesseract.js WASM oder WebGPU-Vision für tabellarische Beleganalyse im Browser. Etwas höhere Ladezeit (~15 MB WASM-Core), aber 100% offline. |
| **V3 · Possibility** | **4/5** | Lokale OCR auf Tabellen ist in modernen Browsern mit SIMD-WASM stabil lauffähig. Ausreichender Kontrast bei Handykamerabildern im Treppenhaus erforderlich. |
| **V4 · Future/Longevity** | **5/5** | Dauerhafter Prüfzyklus (alle 3 Jahre für Großanlagen gem. TrinkwV § 31). Stabile Mietminderungs-Rechtsprechung (BGB § 536). |
| **V5 · Civic SWOT** | **4/5** | Höchste Datenschutzgarantie: Keine Übermittlung privater Wohnungsanschriften an Cloud-APIs. Schwachstelle: Schlecht ausgeleuchtete Treppenhausfotos können OCR-Zahlen verfälschen (z.B. 100 vs. 1000 KBE). |
| **V6 · Tech Tree** | **4/5** | Root: Tesseract WASM + UBA-Maßnahmenkatalog; Trunk: Multi-Column Table Parser mit UBA-Ampel; Branch: Mietminderungs-Rechner mit Fristenkalender. |
| **V7 · Documentation** | **4/5** | Type A/B: TrinkwV § 31, DVGW W 551 und Umweltbundesamt-Empfehlungen zur Gefährdungsanalyse. |

#### 2. Triage Verdict & Synthesis

* **Verdict:** `Verengt (Testing First)`
* **Restlücke:** Datensparsamer lokaler Tabellen-OCR-Extraktor mit Plausibilitätsfilter (Verifizierung von KBE-Werten gegen Schwellenwerte 100/1.000/10.000).
* **Empfohlene nächste Aktion:** Validierung der Tesseract.js WASM Tabellen-Segmentierung an 5 realen anonymisierten Laborprüfberichten (Eurofins, SGS, synlab).

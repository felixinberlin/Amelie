---
status: Available
delivery_method: E-Mail
target_maker: Tacheles e.V.
review_score: 26/35
architecture_tier: Tier 1
source_type: Type A
---
# Gründungsnavigator

*(englisch: Start-up Navigator)*

**Ein Satz:** Eine kostenlose Web-App bereitet Menschen im Grundsicherungsgeld, die sich selbständig machen wollen, auf das **Gespräch** mit dem Jobcenter vor: was sie sagen, was das Gegenüber antworten kann, welche Norm gilt (wörtlich zitiert und verlinkt) und welche Frist läuft. Alles bleibt im Browser.

**Stand:** 11.10.2026 · **Prüfen ab:** 10/2027 und nach jeder SGB-II-Novelle
**Empfänger:** **Tacheles e.V.** (Wuppertal; Sozialberatung, Materialsammlung zum SGB II) für die fachliche Normprüfung und Aufnahme in die Materialsammlung; nachrangig **Sozialrat Deutschland e.V.** (Relaunch der KI-Tools, bisher nichts zu Selbständigen). **Ansprechperson nirgends verifiziert, vor Versand auf der Vereinsseite prüfen; ohne Verifikation kein Versand. Keine Mail angelegt.**
**Verdikt:** 🎁 verschenken. Prototyp läuft, Kern getestet.
**Review:** 26/35 (Gate 24) · V8 Fun 2 · Tier 1 · Typ A (Normtext) · Details: `06-suche/amelie-classification-log.md`, „Gründungsnavigator — Reviewer 11.10.2026“

**Live-Demo (Handy-tauglich):** [Gesprächsnavigator](https://felixinberlin.github.io/Amelie/gruendungsnavigator/) · [Fall-Landkarte](https://felixinberlin.github.io/Amelie/gruendungsnavigator/fall-landkarte.html) · Dose: https://felixinberlin.github.io/Amelie/#dose=gruendungsnavigator

---

## Das Problem

Wer aus dem Grundsicherungsgeld gründen will, braucht das Jobcenter. Aber **Einstiegsgeld (§ 16b SGB II) und Zuschüsse für Sachgüter (§ 16c SGB II) sind Ermessen**: Ein Gespräch entscheidet über das Geld.

- **Die Reihenfolge ist unbekannt und entscheidend.** „Leistungen nach diesem Buch werden nicht für Zeiten vor der Antragstellung erbracht“ (§ 37 Abs. 2 SGB II). Wer zuerst gründet und dann fragt, verliert die Förderung.
- **Das Gespräch ist ungleich.** Die Fachkraft kennt die Regeln. Die Gründerin ist nervös, sagt am Telefon etwas zu oder vermeidet den Anruf.
- **Seit 01.07.2026 ist es strenger** (13. SGB-II-Änderungsgesetz vom 16.04.2026, BGBl. I Nr. 107):
  - Die Selbständigkeit wird spätestens nach einem Jahr Bezug geprüft (§ 10 Abs. 2 Nr. 5).
  - Nachweise nach dem Widerspruchsbescheid zählen nicht mehr (§ 41a Abs. 3).
  - Wiederholte Meldeversäumnisse kosten 30 % für einen Monat (§ 32).
- **KI-Hilfe ist heute unzuverlässig.** Jobcenter und Sozialgerichte berichten von KI-Schreiben mit unpassenden Paragrafen und erfundenen Urteilen (LSG NRW, Jahrespressekonferenz 2026, laut LTO 24.04.2026; gegen-hartz.de 09.08.2026: 501.667 Widersprüche 2025).

**Wer leidet:** Gründungswillige im Leistungsbezug, besonders ohne Beistand und ohne Rechtskenntnis. Und Beratungsstellen, die dieselben Fragen jedes Mal von Hand beantworten.

## Warum das jetzt geht

1. **Die neue Rechtslage steht fest und ist im Wortlaut abrufbar.** Ein Werkzeug kann sie zitieren statt sie zu erraten. Alle wörtlichen Zitate des Prototyps wurden am 11.10.2026 **maschinell gegen gesetze-im-internet.de** geprüft. Dabei fanden sich vier Abweichungen (z. B. „selbständig“ statt „selbstständig“ in § 10, „daß“ in § 16 SGB I), die korrigiert sind.
2. **Ein Browser reicht:** einzelne HTML-Dateien, kein Server, kein Konto, kein Tracking, Eingaben nur im `localStorage`. Die Seiten sind fürs Handy gebaut (Leiste unten, große Tippflächen, kein waagrechtes Scrollen bei 375 px) und laufen im Wartebereich des Jobcenters, **auch ohne Netz**: Ein Service Worker hält beide Seiten vor, und man kann sie auf den Startbildschirm legen wie eine App.
3. **Deterministisch zuerst:** Fristen, Freibetrag und Normverweise kommen aus einem getesteten Kern (Vitest), nicht aus einem Sprachmodell.

## Skizze

**Gesprächsnavigator** (`public/gruendungsnavigator/index.html`):
- **Vorbereitung:** Angaben nur im Browser, Grundregeln, Mitbring-Liste.
- **Telefonat:** Entscheidungsbaum mit 7 Fragen und 23 möglichen Antworten. Jede Antwort hat Formulierung, Hintergrund und zitierte Norm. Dazu Fortschrittsbalken und Live-Protokoll.
- **Termin:** 42 wahrscheinliche Fragen mit anpassbaren Beispielantworten, Beleg und Norm. Übungsfortschritt und Druckfassung.
- **Rechte-Karten:** 30 typische Antworten des Gegenübers („Das fördern wir nicht“, „Unterschreiben Sie hier“). Ein Tipp zeigt Anliegen, Normtext und formalen nächsten Schritt. Vier Gruppen zum Filtern; allein 9 Karten gegen das Abwimmeln: „Dafür bin ich nicht zuständig“, „Da müssen Sie zur Agentur für Arbeit“, „Das nehme ich so nicht an“, „Rufen Sie die Hotline an“, „Ihre Ansprechperson ist nicht da“, „Ich leite das weiter“ und weitere, jeweils mit der Pflicht zur Weiterleitung (§ 16 Abs. 2 SGB I) oder zur Annahme (§ 20 Abs. 3 SGB X) im Wortlaut.
- **Präsentationsmodus:** Das Gegenüber sieht nur die kooperative Fassung. Taktik bleibt verborgen.
- **Zusammenfassungs-Mail:** wird aus den Klicks gebaut, mit korrekten Normverweisen.

**Fall-Landkarte** (`fall-landkarte.html`):
- 9 Stationen vom Antrag bis zum Ausstieg.
- 29 Fragen mit 107 Antworten, je mit Reaktion, nächstem Schritt, Frist und Normtext.
- Fristen-Zeitstrahl.
- 37 Normen mit Link zu gesetze-im-internet.de und dejure.org. Wörtliches ist zitiert, Sinngemäßes als „Kurzfassung“ markiert.

**Kern** (`src/engine/gruendungsnavigator/`):
- Monatsfristen nach §§ 187, 188 BGB, mit Verschiebung auf den Werktag (§ 64 Abs. 3 SGG; Feiertage per Osterformel, Landesfeiertage zuschaltbar).
- Widerspruch (1 Monat, ohne Belehrung 1 Jahr), Klage, Untätigkeit (6 bzw. 3 Monate).
- Gewerbe- und Finanzamtsanzeige, Einstiegsgeld-Höchstdauer, Jahresprüfung nach § 10 Abs. 2 Nr. 5, Festsetzungsfiktion § 41a Abs. 5.
- Reihenfolgeprüfer Antrag/Start (§ 37 Abs. 2). Fehlt ein Datum, lautet das Ergebnis „unbekannt“.
- Freibetrag nach § 11b Abs. 2, 3.
- Strukturprüfung des Telefonbaums und Sprachwächter („garantiert“, „Anspruch besteht“, „unzulässig“ kommen nie vor).
- Normstand-Wächter: Ist die Prüfung älter als 12 Monate, wird neu gelesen.
- Drift-Wächter lesen die Daten direkt aus den Demo-Seiten.

**Im Amélie-Frontend:** Simulator „Gründungsnavigator & Fristenrechner“ mit Links auf beide Seiten, eingebetteter Demo, Fristenrechner und Freibetrag.

**Nicht dabei:** keine Rechtsberatung im Einzelfall, kein Sprachmodell im Kern, kein Server, kein Versand an das Jobcenter, keine Bewertung von Fallmanagerinnen und Fallmanagern.

## Erster Schritt

**Ticket 01: Die Seite wird Vorlage.** Alle Beispielinhalte (Branche, Beträge, Beispielantworten des erfundenen Webentwickler-Falls) wandert aus `index.html` in ein Branchenpaket (JSON), daneben ein leeres Paket. Normregister und Telefonbaum werden zu Daten, die der getestete Kern lädt.

**Fertig, wenn:**
1. „Webentwicklung“ und ein leeres Paket gegen dasselbe Schema validieren und der Kern keine Beispielbeträge enthält.
2. Jeder Registereintrag Norm, Fassung, URL und die Kennzeichnung Wortlaut/Kurzfassung trägt und der Zitat-Abgleich gegen gesetze-im-internet.de grün ist.
3. Der Graphtest des Telefonbaums (keine toten Knoten, alle Normverweise lösen auf) und die Fristen-Tabellentests grün sind. Diese Tests stehen schon.
4. Kein Ausgabetext „garantiert“, „Anspruch besteht“, „unzulässig“ oder „rechtswidrig“ sagt.
5. Eine zweite Person ohne Programmierkenntnis ihre eigene Fassung in 30 Minuten erzeugt.
6. Beide Seiten bei 360 px Breite ohne waagrechtes Scrollen bedienbar sind. Das ist heute schon erfüllt.

## Wo es kippt

**Rechtsdienstleistung und Aktualität.**
- Allgemeine Information ist erlaubt, die Entscheidung im Einzelfall nicht (RDG). Der Telefonbaum enthält Formulierungsvorschläge eines Nichtjuristen.
- Jede SGB-II-Novelle macht Texte falsch (2023 und 2026 umgebaut).

**Gegenmaßnahme, Zuschnitt des Reviewers („GN-B“, dort 29/35):**
- In den geprüften Kern gehören nur Normregister, Fristen- und Reihenfolgeprüfer und Rechte-Karten mit Wortlaut.
- Taktische Formulierungen bleiben ein austauschbares Beispielpaket.
- Normstand-Wächter, maschineller Zitat-Abgleich, RDG-Grenze vor Versand juristisch prüfen lassen.

**Ton:** Ein Werkzeug, das wie eine Drohung wirkt, schadet. Der Präsentationsmodus erzwingt die kooperative Fassung.

**Offen gelegt:**
- Der Bedarf stützt sich nur auf Sekundärquellen (gegen-hartz.de, LTO); die IAB-Studie ist nicht gelesen.
- Die Empfängerperson ist nicht verifiziert.
- Der Abstand zum Gate beträgt 2 Punkte.
- Fun ist niedrig (2): ruhiges Probespiel bei einem belastenden Thema.

## Wer es schon versucht hat

Recherche 11.10.2026 (Prüfprotokoll G1–G4, Reviewer-Gegensuchen, Lab-Intake). Ergebnis: **verengt**. Nachbarn decken Teile ab, keiner das Gespräch.

- **jobcenter.guru** (GuruSense UG, Mannheim): Briefe per Foto, Widerspruch, In-App-Käufe bis 9,99 €. Das ist Brief, nicht Gespräch.
- **BürgerChat** (github.com/jeannineshiu/buergerchat, MIT): RAG über rund 6.100 amtliche Dokumente, nichts zu Selbständigkeit. Andockpunkt (G3 `besetzt`).
- **Sozialrat Deutschland e.V.:** Brief- und Widerspruchsgeneratoren, Pilot pausiert.
- **Münchner Gründungsbüro:** Leitfaden Grundsicherungsgeld, kein Werkzeug.
- **Gründerplattform:** Businessplan-Tool für den Antrag, nicht fürs Gespräch.
- **Grab `paragraphen-dolmetscher`** (Bescheid per Foto erklären): eine andere Funktion, kein Wiedergänger.
- **Lab-Jobcenter-Cluster** (10.10.2026, Batches 13–15, 35–37, 70–71): BürgerRechte-Copilot, CivicBeistand, HandyFoto-Konverter, Berater-Copilot, Once-Only-Gateway und weitere. Alle blieben Needs Research (13–19/35): Reformideen ohne Mandat, Zahlen ohne Primärquelle. Der Navigator ist der eine zustellbare Kern daraus.
- **Reviewer-Gegensuchen** (4, Schnipsel): kein Werkzeug zur Gesprächsvorbereitung gefunden, nur Ratgebertexte und die BA-App.

**Restlücke:** Gespräch statt Brief, für Gründerinnen und Gründer, mit geprüften Normtexten und einer Ansicht, die man dem Gegenüber zeigen kann.

## Förderbrücke (nur Hinweis)

Wer Ticket 01 finanzieren könnte: **Prototype Fund** (Vereinbarkeit CC0 mit der Lizenzpflicht offen) oder **Civic Coding**. Evidenz nur Schnipsel. Vor jeder Nennung Frist und Zulässigkeit auf der Primärseite prüfen. Keine Mail mit Fördertipp ohne Freigabe.

## Vorarbeit

- Prototyp: `public/gruendungsnavigator/` (Kapitel `07-demos/gruendungsnavigator/README.md`), Konzept `02-recherche/gruendungsnavigator-konzept-2026-10-11.md`, Übergabe `06-suche/scout-an-bibliothekar-2026-10-11-gruendungsnavigator.md`.
- Kern und Tests: `src/engine/gruendungsnavigator/` (Vitest, inklusive Drift-, Zahlen- und Offline-Wächter über beide HTML-Seiten).
- Normtexte: SGB II i. d. F. vom 16.04.2026 (BGBl. I Nr. 107), in Kraft 01.07.2026; §§ 14, 16, 17, 39, 60 SGB I; §§ 9, 13, 25, 33, 35, 44 SGB X; §§ 66, 84, 87, 88, 183 SGG; § 14 GewO; § 138 AO; § 19 UStG. Gelesen auf dejure.org und gesetze-im-internet.de (11.10.2026).
- Quellen im Register: LSG NRW / LTO, gegen-hartz.de, BürgerChat, Sozialrat, Münchner Gründungsbüro, Gründerplattform, jobcenter.guru, dejure.org (`06-suche/amelie-quellen.md`).
- Nebenbefund **Paragrafen-Prüfer** (G2, `verengt`): Das Normregister mit Fassung und Zitat-Abgleich ist dessen Kern.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

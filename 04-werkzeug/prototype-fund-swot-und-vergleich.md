# Prototype Fund: ähnliche Projekte, SWOT und Vergleich mit geförderten Projekten

*Stand 30.09.2026. Persönliche Bewerbung von Félix, kein Amélie-Geschenk. **Evidenzgrenze:** `prototypefund.de` (Projektliste, Evaluationsbericht, Demo-Day-Seite) war für mich gesperrt (HTTP 403). Alles unten stammt aus Suchschnipseln und einzelnen lesbaren Seiten. Der Vergleich mit „Gewinnerprojekten" ist deshalb dünn: ich kenne nur wenige namentlich. Wer den Antrag ernsthaft absichern will, muss die Projektliste selbst durchsehen (siehe §6).*

---

## 1. Was der Fördergeber heute will (das ist die wichtigste Erkenntnis)

| Befund | Beleg (Schnipsel) |
|---|---|
| Seit 2025 liegt der Schwerpunkt auf **Datensicherheit** und **Software-Infrastruktur**. Letzteres meint Bibliotheken und standardisierte Protokoll-Implementierungen, die andere Entwickler:innen brauchen. | [Prototype Fund Förderseite](https://www.prototypefund.de/en/funding), [DSEE-Förderdatenbank](https://foerderdatenbank.d-s-e-e.de/foerderprogramme/prototype-fund) |
| Vier Jury-Kriterien: inhaltlicher Schwerpunkt, Innovationsgrad, technische Machbarkeit, gesellschaftlicher Nutzen und Reichweite. Jedes Jurymitglied bekommt bis zu 25 Skizzen. | [Jury-Blog](https://prototypefund.de/hinter-den-kulissen-jury/), Suchzusammenfassung |
| Förderquote im Schnitt **9,3 %**, ca. 22 Projekte je Runde. Beispiel: 23 ausgewählt aus über 260 Einreichungen (≈ 8,8 %). | Suchzusammenfassung, Eigenrechnung |
| Ziel ist ein **lauffähiger Software-Prototyp**, veröffentlicht unter Open-Source-Lizenz, in 6 Monaten. | [Antragsseite](https://www.prototypefund.de/en/application) |
| Klasse 01 Demo Day (28.11.2025): Themen von Energieverbrauchsmessung im Kernel über kollaboratives Bearbeiten lokaler Textdateien bis 3D-Editor für OpenStreetMap. | Suchzusammenfassung |

**Folgerung:** Die frühere Civic-Tech-Ausrichtung (Bürgerbeteiligung, Verwaltungsdaten) ist nicht mehr der Kern. Amélie in der bisherigen Form („Ideen für Gemeinwohl-Software verschenken") passt inhaltlich **nicht** zu „Datensicherheit" und nur indirekt zu „Software-Infrastruktur". Der Antrag muss deshalb als **Infrastruktur** auftreten (Schema, Bibliothek, CLI, Validator), nicht als Ideensammlung.

---

## 2. Ähnliche Projekte

### 2.1 Verzeichnisse und Register (Was existiert es schon?)

| Projekt | Was es tut | Unterschied zu Amélie |
|---|---|---|
| [Civic Tech Field Guide](https://civictech.guide/) | Größtes kuratiertes Verzeichnis, über 8.000 Civic-Tech-Projekte, kuratiert von Matt Stempeck, gefördert u. a. von Knight Foundation, Luminate, Patrick J. McGovern Foundation | Listet, **was gebaut wurde**. Kein Prüfurteil („frei/besetzt"), kein Totenschein, keine Doppelprüfung vor dem Bauen |
| Civic Tech Index (DemocracyLab) | Globaler Index nützlicher Civic-Tech-Open-Source-Projekte | dito |
| [awesome-civic-tech](https://github.com/briandgoldberg/awesome-civic-tech) | Kuratierte GitHub-Liste | dito, ohne Struktur |
| [openCode.de](https://opencode.de/de) (ZenDiS) | Plattform der öffentlichen Verwaltung zum Veröffentlichen und Wiederverwenden von Open-Source-Code; laut Schnipsel über 5.300 Nutzer:innen und 2.200 Projekte | Nur Verwaltung, nur **vorhandener Code**. Löst „nicht doppelt entwickeln" für Behörden, nicht für Ideen |
| [Code for Germany](https://codefor.de/projekte/alle/) Projektliste | Projekte der deutschen OK Labs | Projektschau, kein Prüfverfahren |

### 2.2 Fehlschlag-Archive (Was ging schief?)

| Projekt | Was es tut | Unterschied |
|---|---|---|
| [Failed yet successful](https://dl.acm.org/doi/10.1145/3544549.3573818) (CHI-Workshop 2023, Hamm/Shibuya u. a.) und [Rehak, „Ten Years of Failed Civic Tech in Germany"](https://zenodo.org/records/20733398) | Wissenschaftliche Aufarbeitung gescheiterter Civic Tech | Einzelfallstudien und Argumente, **kein strukturierter, maschinenlesbarer Datensatz** |
| [Failory Graveyard](https://www.failory.com/graveyard), [Autopsy](https://www.getautopsy.io/), [CB Insights](https://www.cbinsights.com/research/startup-failure-post-mortem/), [danluu/post-mortems](https://github.com/danluu/post-mortems) | Nachrufe auf gescheiterte Startups bzw. technische Ausfälle | Kommerzielle Firmen, nicht Gemeinwohl-Software-Ideen; teils Paywall/Marketing |

### 2.3 Vom Prototype Fund geförderte, namentlich belegte Projekte (Vergleichsbasis)

Nur diese habe ich sicher aus Schnipseln; sie sind keine repräsentative Stichprobe.

| Projekt | Runde | Was | Art |
|---|---|---|---|
| Accidental Contributions | 16 | Verbindet OpenCulturas mit OpenStreetMap, damit Nutzer:innen Barrierefreiheits-Infos ohne OSM-Kenntnis beitragen ([OpenCulturas](https://www.openculturas.org/en/projekte/Accidental-Contributions)) | Konkretes Werkzeug, klares Nutzerproblem |
| OSM2World, StreetCritic, Ardhi, CitRad, OpenTranTicketing, Trans-Europa-Planer, Vantage, Mobiles Datenlabor, @Sat, Pleeenum | 16 | Nur Namen aus Schnipsel, Inhalte nicht gelesen | unbekannt |
| Kernel-Energiemessung, kollaboratives Editieren lokaler Textdateien, 3D-Editor für OSM | Klasse 01 (2025) | Nur Themen aus Demo-Day-Zusammenfassung | Infrastruktur/Entwicklerwerkzeug |

**Ähnlichstes geförderte Projekt:** Ich habe **keines gefunden**, das ein Register geprüfter Ideen mit Friedhof betreibt. Das ist ein Suchschnipsel-Befund, kein Beweis. Es gibt zwei mögliche Lesarten: Lücke oder fehlender Bedarf. Die Jury kann beides denken.

---

## 3. SWOT

### Stärken
- **Alleinstellung in der Kombination.** Verzeichnisse (2.1) zeigen Vorhandenes, Fehlschlag-Studien (2.2) sind narrativ. Amélie verbindet Doppelprüfung vor dem Bauen, strukturierte Urteile und einen Friedhof mit Totenscheinen in maschinenlesbarer Form.
- **Kein Papierprojekt.** Lauffähige Bibliotheks-CLI mit Transaktionen, Rollback, Audit-Log, Rechten; Drift-Guards in CI; 10 Demos mit Tests. Zahlen laut `bib status` (30.09.2026): 44 Dosen, 95 Gräber, 302 Protokollzeilen, 158 Quellen.
- **Datensatz, den es öffentlich nicht gibt.** 95 begrabene Ideen mit Ursache (`gebaut`, `beim-empfaenger`, `reality-check`, `praemisse`, `mode`, `duplikat`). Passt zum dokumentierten Forschungsbedarf (Fehlschläge werden kaum publiziert).
- **Nachhaltigkeit eingebaut:** statisches Hosting, Daten als Dateien, CC0-Inhalte.
- **Ehrlichkeit als Merkmal:** Urteile tragen Evidenzstufe, „frei" heißt „nicht gefunden".

### Schwächen
- **Themenpassung zur neuen Förderausrichtung schwach** (siehe §1). Größte Schwäche.
- **Metaprojekt.** Die Jury bewertet Nutzerproblem und Reichweite. „Ein Werkzeug, das Ideen prüft" ist abstrakter als „Beitragen zu OSM ohne Vorkenntnisse".
- **Nutzen unbelegt.** Kein externer Nutzer, keine Rückmeldung, keine Nutzungszahl. Amélie fasst bewusst nicht nach.
- **Bestand entstand teils mit LLM-Agenten.** Evidenz oft nur Suchschnipsel; Behörden-Seiten waren gesperrt. Ein Teil der „frei"-Urteile ist nie an Primärquellen nachgeprüft (AP 6 im Entwurf misst das).
- **Bestand vor Antrag.** Das Repo existiert; es droht der Einwand „schon gebaut". Nur neue Arbeit ist förderfähig.
- **Einzelperson, Bus-Faktor 1.**
- **Lizenzfrage offen** (CC0 für Code), Rechtsform ungeklärt.

### Chancen
- **„Software-Infrastruktur" wörtlich bedienen:** Schema + Validator + CLI als Bibliotheken, die andere einbinden. Das ist die Kategorie, die die Jury heute sucht.
- **Datensatz als Forschungsinfrastruktur:** Kooperation mit Weizenbaum-Forschenden (siehe `prototype-fund-partner-suche.md`); Zenodo-DOI erhöht Sichtbarkeit.
- **Wiederverwendbarkeit über Civic Tech hinaus:** Das Muster „Doppelprüfung + Friedhof" gilt für jedes Open-Source-Ökosystem. Das würde die Reichweite über Civic Tech hinaus vergrößern.
- **Neue Förderspur:** Second Stage (4 Monate Verlängerung für bis zu 15 Projekte) als Hebel für Pilot und Wartung.
- **Kein Wettbewerber im Kern** (Befund aus Suchschnipseln).

### Risiken
- **Förderquote ≈ 9 %.** Auch ein starker Antrag scheitert mit ~90 % Wahrscheinlichkeit; keine Planung darf davon abhängen.
- **Jury liest „Ideensammlung" statt Infrastruktur** und lehnt wegen Themenabweichung ab.
- **Kritik „Prototyp = Dokumentation":** Amélie besteht großteils aus Markdown und Daten, nicht aus Software. Ohne klaren Software-Kern (AP 1, 2) fällt der Antrag durch.
- **Vorhabenbeginn-Einwand** (Bestand).
- **KI-Skepsis:** Ein LLM-erzeugter Bestand kann Misstrauen wecken. Offenlegung und AP 6 sind die Antwort, nicht Verschweigen.
- **Doppelung mit openCode/ZenDiS** oder einem Civic-Tech-Verzeichnis, wenn sie das Prüf-Urteil dazu bauen.

---

## 4. Vergleich mit geförderten Projekten (soweit belegt)

| Kriterium der Jury | Typisches geförderte Projekt (Beispiel Accidental Contributions) | Amélie Kit (Entwurf) | Einschätzung |
|---|---|---|---|
| Inhaltlicher Schwerpunkt | Civic Tech/Open Data (Runde 16), heute Infrastruktur/Sicherheit | Ideenverfahren + Datenschicht | **Schwach**, außer als Infrastruktur gerahmt |
| Nutzerproblem klar und eng | Ja: Barrierefreiheits-Infos ohne OSM-Wissen | Eher breit: „Doppelarbeit vermeiden" | **Zu breit**, ein konkreter Nutzer fehlt |
| Lauffähiger Prototyp in 6 Monaten | Ja, ein Kernprodukt | Mehrere Arbeitspakete (7) | **Zu viel**, Jury bevorzugt einen fokussierten Kern |
| Innovationsgrad | Verbindung zweier Plattformen | Neu in der Kombination, Kategorie unbelegt | **Mittel bis stark**, wenn Alleinstellung belegt |
| Technische Machbarkeit | Belegt durch Vorarbeit | Stark belegt (lauffähige CLI, Tests) | **Stark** |
| Nutzen/Reichweite | Konkrete Community (OpenCulturas, OSM) | Keine benannte Nutzergruppe | **Schwach**, Pilot nötig |

Vorsicht: Das ist ein Vergleich mit **einem** namentlich gelesenen Projekt plus Themenlisten. Er zeigt Tendenzen, keine Statistik.

---

## 5. Empfehlung (aus der Analyse folgend, deine Entscheidung)

1. **Umrahmen als Software-Infrastruktur.** Titel und Kurzbeschreibung auf Schema, Validator und CLI ausrichten. „Ideen verschenken" in den Hintergrund.
2. **Auf einen Kern zusammenstreichen.** Statt sieben Arbeitspaketen: `amelie-spec` (Schema + Validator) und `amelie-bib` (CLI als Paket) als einziges Lieferergebnis. Friedhof-Datensatz als Nebenergebnis. Feeds, Zenodo-Pipeline, Instanz-Vorlage nur, wenn sie in die Zeit passen.
3. **Einen konkreten Nutzer benennen** (z. B. eine OK-Lab-Gruppe) und dessen Problem in einem Satz formulieren. Ohne das schreibt die Jury „Reichweite unklar".
4. **Bestand offen behandeln:** Was ist schon gebaut (nicht förderfähig), was ist neu (förderfähig)? Ein Absatz genügt.
5. **Realistisch bleiben:** ≈ 9 % Quote. Parallel ein Plan B (z. B. Sovereign Tech Fellowship, NLnet). Der Repo-Katalog nennt beide, Fristen sind dort unverifiziert.

## 6. Was noch fehlt (kann ich nicht von hier lösen)

- **Projektliste des Prototype Fund selbst durchsehen** (Stichwörter: registry, schema, knowledge, documentation, prior art). Einträge dort können Wettbewerber oder Vorbilder sein. Aus dem Sandbox-Zugang nicht möglich; im Browser 30 Minuten.
- **Evaluationsbericht der Förderrunden 15/16** ([PDF](https://www.prototypefund.de/uploads/Evaluation/Evaluationsberichte/Evaluationsbericht_Foerderrunden-15-u-16_2025-09-29_Websiteversion_Korrektur.pdf)) lesen: er nennt vermutlich Erfolgsfaktoren und Wartungsquoten nach der Förderung.
- **Jury-Zusammensetzung Klasse 03** prüfen: Fachlicher Hintergrund bestimmt, ob „Infrastruktur" oder „Civic" gelesen wird.
- Ergebnis der Durchsicht ins Prüfprotokoll eintragen (Besetzt-Test).

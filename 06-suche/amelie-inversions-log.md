# Amélie — Asymmetric Inversion Log

Cumulative record of all runs of the Asymmetric Inversion Protocol. Every run reads the previous retro before starting and writes its own results before concluding.

---

## Log Entries

| Date | Run # | Target System / Anchor | Operator | Candidates Generated | Survivors (frei/verengt) | Best Gap Identified |
|---|---|---|---|---:|---:|---|
| 2026-09-25 | 0 | Initialization & Playbook Pattern Synthesis | OP-1 through OP-5 | 5 | 5 | Formalization of Amélie's five core inversion mechanics into an autonomous discovery protocol |
| 2026-09-25 | 1 | Niederschlagswassergebühr (BWB § 10) & DWA-A 138-1 (10/2024) | OP-2, OP-3, OP-4 | 1 | 1 (verengt) | Vor-Ort-Sickerversuch per Smartphone-Timer/Kamera + DWA-A 138-1 Muldenauslegung + BWB-Änderungsanzeige zur Gebührenbefreiung |
| 2026-09-25 | 2 | Trinkwasserverordnung 2026 (§ 17 Bleiverbot, § 31/52 Legionellen) | OP-2, OP-3, OP-4 | 2 | 2 (verengt) | Zerstörungsfreie Vor-Ort-Materialprüfung & Vollzugsmeldung ans Gesundheitsamt (Bleifrei-Lotse) + Treppenhaus-OCR für Laborbefunde (LegioKlar) |
| 2026-09-27 | 3 | Holz: AltholzV Anh. III, EUDR 2023/1115 (i. d. F. 2025), 1. BImSchV § 3/§ 4 + BImSchG § 22, DIN 4074-1/-5 (2026-05), PCP-Richtlinie, HolzSiG | OP-1, OP-2, OP-3, OP-4 | 7 | 4 (verengt) | Kaminrauch-Beweisbuch: on-device Rauchopazität + DWD-Wind als Belastungsprotokoll für Nachbarn (Industrie/Betreiber haben Rauch-KI, Betroffene nicht) · Altholz-Weiche am Anfallort (stromaufwärts vom TOMRA-Band) |

---

## Retrospectives

### Run 3 (27.09.2026 · Holz: Altholz, EUDR, Kaminrauch, Rückbau-Balken, Brennholz) — Researcher #3, parallel zu Ideenrunde #1 und Bisoziation #2
- **Erledigt/überschrieben:** Der Run-2-Punkt „ESPR/DPP" wurde für diese Runde durch Félix' Themenvorgabe „Holz" ersetzt und bleibt offen.
- **Learned:** Stromaufwärts-Muster bestätigt (Altholz: TOMRA/Monash-Forschung vs. leerer Wertstoffhof). „Fähigkeit besetzt → Einsatzort frei" bei Rauch: Unleash live (Industrie) und FireWell (Betreiber) analysieren Rauch/Flamme, der Nachbar führt ein Papierprotokoll, das Schornsteinfeger und DUH verlangen.
- **Learned:** Frisch vereinfachtes EU-Recht (EUDR: Postadresse statt Geokoordinaten für Niedrigrisiko-Kleinerzeuger) löscht die Vollzugslücke, und die Forst-Apps (Waldpilot, Sachsenforst) standen schon da. Thünen hat die Holzarten-Apps selbst (CITESwoodID, macroHOLZdata).
- **Learned (vom Librarian ergänzt, aus Researcher #1):** Beweismittel-Frage vor Funktionsfrage — ein optisches Rauchprotokoll ist in der 1. BImSchV kein Nachweisverfahren; es begründet höchstens den Anlass für eine Überprüfung.
- **Fehler:** PCP-Lotse ohne Reality-Check angesetzt (Schadstoff optisch unsichtbar; Baujahr-Rechner existiert). Evidenz nur Suchschnipsel, WebFetch gesperrt.
- **Nächstes Mal:** (a) ReFoRe (HTWK/Fraunhofer WKI) lesen, bevor die Balken-Vorsortierung weitergeht; (b) Normtext 1. BImSchV § 3 Abs. 3 und Händlerpflicht verifizieren; (c) OP-5 auf kommunale Fällungen → Brennholz-/Schnittholz-Verschenken; (d) ESPR/DPP aus Run 2 nachholen.

### Run 2 (25.09.2026 · Trinkwasserverordnung 2026: Bleirohrverbot & Legionellen)
- **Erledigt, was in Run 1 als „Nächstes Mal" stand:** Class-A-Norm Trinkwasserverordnung (TrinkwV) mit Stichtag 12.01.2026 (§ 17 Verbot von Bleileitungen) und § 31/§ 52 (Legionellen-Informationspflicht) geprüft.
- **Learned: Die Vollzugslücke erzeugt ein asymmetrisches Vakuum.** Obwohl seit dem 12.01.2026 ein ausnahmsloses gesetzliches Bleirohrverbot gilt und Handwerker nach § 17 Abs. 6 TrinkwV eine sofortige Meldepflicht ans Gesundheitsamt haben, bleiben Mieter im Altbau ahnungslos. Gesundheitsämter haben null Kapazitäten für Kontrollen in Privatgebäuden. Das Gegenwerkzeug (OP-2 & OP-4) dreht den Spieß um: Zerstörungsfreie Materialklassifikation (Magnet, Wulstlötfoto, Klopfton) $\to$ formelle Aufforderung an den Vermieter & Vollzugsmeldung ans Amt.
- **Learned: OCR auf Aushänge bricht das Informationsmonopol (OP-3).** Laborberichte zu Legionellen hängen oft nur wenige Tage im Hausflur und ersticken in KBE-Abkürzungen. Lokales clientseitiges OCR übersetzt den Befund direkt in die UBA-Maßnahmenmatrix und berechnet mögliche Mietminderungen nach BGB § 536.
- **Fehler:** Ursprünglich wurde auch über einen Zirkulations-Wächter (Wassertemperatur am Wasserhahn mit Küchenthermometer) nachgedacht. Allerdings urteilte der BGH, dass Mieter am Hahn keinen Anspruch auf 60 °C haben (Verbrühungsgefahr), sondern nur auf ca. 40–45 °C nach kurzer Vorlaufzeit. Die rechtliche Hebelwirkung liegt deshalb primär bei den nachgewiesenen KBE-Grenzwerten im Laborbericht und dem harten Bleirohrverbot.
- **Nächstes Mal:** EU-Ökodesign-Verordnung (ESPR) & Digitaler Produktpass (DPP) für Textilien/Elektronik: Inversion der Hersteller-Compliance-Schnittstellen in ein Bürger-Reparatur- und Obsoleszenz-Gegenwerkzeug (OP-2 / OP-4).

### Run 1 (25.09.2026 · Hof-Entkoppler / Niederschlagswassergebühr)
- **Learned: Der Gebührenwerk-Anker liefert sofort.** Das in Runde 8 formulierte Rezept („die Preisleiter steht falsch herum", § 2) hat sich bei der Niederschlagswassergebühr bestätigt: Hausbesitzer und Mietergemeinschaften zahlen 1,84 €/m² pro Jahr für versiegelten Beton, weil der Nachweis einer schadlosen Versickerung nach DWA-A 138-1 im Ingenieurbüro 1.500 € kostet.
- **Gelernt: Die Lücke des Empfängers stand auf dessen eigener Website.** Die Berliner Regenwasseragentur betreibt den *RegenRechner* (Stand 2025), schließt sich aber selbst für Laien aus: Das Tool ist desktop-only und setzt ausdrücklich eine „vorherige Bemessung der Maßnahme" voraus. Die Fachsoftware (DWA Versickerungs-Expert, itwh, RAINPLANER) setzt Experteneingaben (kf-Wert, Abflussbeiwert) voraus. Die Lücke ist genau die Brücke: **Vor-Ort-Lochversuch am Smartphone $\to$ Muldenmaße nach DWA-A 138-1 $\to$ fertige BWB-Änderungsanzeige.**
- **Fehler:** Die Idee stand als `communal-rainwater-tank-balancer` („Zisternen-Rechner") mit `ungeprüft` im Katalog. Reine Zisternen-Rechner sind im Atlas `dicht` (Baumärkte, Graf). Erst die Inversion vom Wassertank zur **Gebührenbefreiung per Entsiegelungsnachweis** hat den Kern freigelegt.
- **Nächstes Mal:** Class-A-Norm im Verbraucherschutz prüfen: Trinkwasserverordnung 2026 (Bleileitungsverbot ab 12.01.2026 & Legionellen-Prüfpflicht) für Mieterhaushalte ohne Messprotokoll-Einsicht.

### Run 0 (Initialization · 25.09.2026)
- **Learned**: The five inversion operators capture the implicit patterns that drove Amélie's most resilient tins (Altbau Thermal, Sperrmüll-Radar, Glasanflug-Ampel, Kiez-Lärmkarte). Formalizing them as an explicit protocol provides a distinct alternative to primary-source scavenging (`amelie-ideenrunde`) and combinatorial analogical collision (`lacunar-bisociation`).
- **Mistake**: None yet (initialization).
- **Next Time**: Execute Run 1 focusing on an unfunded European environmental mandate (e.g. EU Ecodesign / Digital Product Passport or EU Soil Monitoring Law) or municipal unsealing / rainwater fee statutes.


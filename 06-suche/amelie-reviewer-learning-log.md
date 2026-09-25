# Amélie — Idea Reviewer: Learning & Meta-Observation Log

**Logbuch-Zyklus 1:** Portfolioweiter 39-Dosen-Audit · **Datum:** 25. September 2026

Systematische Auswertung und methodische Retrospektive nach der vollständigen Begutachtung aller 39 verpackten Amélie-Dosen.

---

## 1. Das Architektur-Trilemma im Gemeinwohl-Sektor

Die empirische Überprüfung aller 39 Dosen belegt eine fundamentale architektonische Gesetzmäßigkeit:

- **Tier 1 (100% Client-Side / Zero-Cloud / WASM / Web Audio / Canvas):** Macht **56,4%** des Katalogs aus (22 Dosen). Diese Dosen weisen die mit Abstand höchste Überlebenschance auf. Wenn kein Server bezahlt, kein Docker-Container gewartet und keine PostgreSQL-Datenbank migriert werden muss, beträgt die Wartungshalbwertszeit bei Übergabe an eine NGO oder Universität theoretisch Unendlich. Sie rotte nicht durch Bitrot.
- **Tier 1/2 & Tier 2 (Client-Side + Statische Vektordaten / PMTiles / IndexedDB):** Macht **38,5%** aus (15 Dosen). Durch moderne Web-Standards (PMTiles für Geländekarten, MiniSearch WASM für Volltext, SQLite WASM / IndexedDB für Zeitreihen) können raumbezogene und datenintensive Werkzeuge ohne Cloud-Backend ausgeliefert werden. Kiez-Daten bleiben beim Bürger.
- **Tier 3 / Ephemere Bridges (z.B. EuroBirdCast, Feuerkugel-Sofortnetz):** Nur **5,1%** (2 Dosen). Hier ist eine externe Datenbrücke (Wetterradar-Echos, dezentrale Zeitsynchronisation) physikalisch unumgänglich. Amélies Reviewer-Regel: *Tier 3 ist nur zulässig, wenn der Rohdatenstrom eine offene behördliche Schnittstelle (OPERA, DWD) ist und keine privaten Benutzerdaten speichert.*
- **Tier 4 (Schwere Cloud / Konten):** **0%**. Konsequent eliminiert gem. Amélie-Regel 4.

## 2. Die Typologie der „Achillesferse“ öffentlicher Geschenke

Jedes gemeinnützige Werkzeug besitzt einen spezifischen Bruchpunkt, an dem es im realen Vollzug scheitern kann. Aus dem 39-Dosen-Audit kristallisieren sich vier Haupt-Archetypen heraus:

1. **Die juristische Haftungsfalle (Falschberatungs-Angst):** Bei Dosen wie `altbau-thermal`, `dose-tradesman-liability-shield`, `bleifrei-lotse` und `waermesignatur` droht die Gefahr, dass Bürger Berechnungen als rechtsverbindliches Gutachten mißverstehen. *Lernregel:* Die App darf niemals eine isolierte Einzelzahl oder das Wort „unbedenklich“ ausgeben, sondern muss deterministische Risikobänder und klare Nicht-Ansprüche führen.
2. **Das physikalische Signal-Rausch-Problem (Sensor-Artefakte):** Dosen, die Smartphone-Sensoren nutzen (`bleifrei-lotse` Klopfton, `klang-stethoskop` Lagerschall, `raeucher-sim` Atemmike, `pillsafe-vision` Kamera-Segmentierung), leiden unter variierender Hardware-Güte und Umgebungsrauschen. *Lernregel:* Hardware-Messungen erfordern redundante Vorfilter (z.B. Magnet-Vorprüfung bei Bleirohren, Bandpassfilter bei Körperschall, Schichtungsassistenten bei Blättern).
3. **Die Beteiligungs-Ermüdung (Citizen Science Burnout):** Werkzeuge, die auf kontinuierliche Bürger-Eingaben angewiesen sind (`fugenduell-patenschaft`, `kiez-laermkarte`), scheitern oft nach wenigen Wochen. *Lernregel:* Dezentrale Übergabeprotokolle (Paten-Staffelstab via QR-Code) und spurlos verfallende Geopins (12h TTL beim `sperrmuell-radar`) verhindern Frustration und Datenmüll.
4. **Die behördliche Vollzugsverweigerung (RIS-Blockade / Lobby-Gegenwind):** Dosen wie `klarlokal`, `glasanflug-ampel` oder `lichtplan-check` treffen auf veraltete kommunale IT oder Widerstand von Bauträgern. *Lernregel:* Das Geschenk muss die juristische Norm (BImSchG, LAG VSW, OParl) so glasklar zitieren, dass Bürger rechtssichere Einwendungs-Schreiben auf Knopfdruck erzeugen können, die von Behörden nicht ignoriert werden dürfen.

## 3. Der Primat der Type-A-Dokumentation (Norm-Mandat)

Die quantitative Korrelation im Audit ist eindeutig:

- Dosen mit **Type A Primärquellen** (harte Gesetzesfristen und DIN/VDI-Normen wie `bleifrei-lotse` mit TrinkwV § 17, `glasanflug-ampel` mit LAG VSW 21-01, `dose-nurse-shift-guardian` mit ArbZG § 5, `dose-tradesman-liability-shield` mit VOB/B § 4 Abs. 3) erzielen durchweg Spitzenbewertungen zwischen **31 und 34 Punkten**.
- Reine „gute Ideen“ ohne statutarischen Hebel verharren im Bereich 28–30 Punkte.
- *Lernregel für künftige Suchrunden:* Die Discovery-Engines (insbesondere `asymmetric-inversion`) sollten prioritär nach bevorstehenden gesetzlichen Stichtagen im Bundesgesetzblatt und harmonisierten EU-Normen suchen.

## 4. Kalibrierung der 7 Vektoren für künftige Zyklen

- **Vektor 1 (Novelty):** Strikte Trennung zwischen reiner Kombination bekannter Bausteine (Score 3) und echter Regelraum-Verschiebung (Score 4-5). Die Lacunar-Gap-Bedingung („Ein Satz ohne Nennung der technischen Lösung“) hat sich als extrem trennscharf erwiesen.
- **Vektor 2 (Complexity):** Tier 1 (100% Client-Side) erhält systematisch 4–5 Punkte. Sobald ein Backend oder Serverbetrieb zwingend nötig wäre, sinkt der Score auf $\le 3$.
- **Vektor 4 (Future/Longevity):** Der Wartungsfaktor wird primär an der Abwesenheit von Node/Python-Server-Abhängigkeiten gemessen.
- **Vektor 7 (Documentation):** Direkte Angabe der Paragraphen, Formeln oder Seitenzahlen ist Voraussetzung für die Note 5.

## 5. Strategische Portfoliolücken (Empfehlungen für Suchrunden)

Aus dem Querschnitt der 39 Dosen ergeben sich unbesetzte lakunäre Räume, die in den nächsten Entdeckungsrunden adressiert werden sollten:

1. **Kommunale Wasser- & Grundwasserkreisläufe:** Nach `bleifrei-lotse` und `legio-klar` fehlen Werkzeuge für Starkregen-Versickerung auf Privatgrundstücken (Entsiegelungs-Lotse) und Grundwasserabsenkungen durch Großbaustellen.
2. **Agrar- & Bodenschutz:** Während Stadtökologie (`fugenduell`, `biotoptyp-assistent`) stark vertreten ist, fehlen Werkzeuge für landwirtschaftliche Humusbilanzen und Pestizid-Abstandsstreifen an Gewässern (§ 38 WHG).
3. **Schichtdienst- & Pflegeübergaben:** `dose-nurse-shift-guardian` schützt Arbeitszeiten; es fehlt ein datensparsames Offline-Tool für den akuten Informationsverlust bei Schichtübergaben in Altenpflegeheimen.
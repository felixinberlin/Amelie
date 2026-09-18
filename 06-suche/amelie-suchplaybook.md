# Amélie — Such-Playbook

Wie Schritt 0,5 (Prüfen) funktioniert und was jede Runde daran verbessert hat.
**Zu Beginn jeder Ideenrunde lesen. Am Ende jeder Runde den Abschnitt „Retro" ergänzen.**

Claude lernt nicht zwischen Chats. Dieses Dokument und `amelie-pruefprotokoll.md` sind das Gedächtnis. Was hier nicht steht, wird wiederholt — inklusive der Fehler.

---

## 1. Reihenfolge pro Idee (max. 4 Suchen, dann Urteil)

| # | Suche | Warum zuerst |
|---|---|---|
| 1 | **`<wahrscheinlicher Empfänger> KI`** (Blog, Projektseite) | Billigster Kill. In Runde 2 hatten 3 von 12 Empfängern die Idee schon selbst (Wheelmap, CompGen, Repair Café). Erspart außerdem die schlechteste Erstansprache. |
| 2 | **Deutsch, Funktionswörter** — was das Ding *tut*, nicht wie es heißt | Findet Vereine, Behörden, Foren |
| 3 | **Englisch, Produktwörter** (`app`, `AI`, `tool`, Jahr) | Findet kommerzielle Produkte, die deutsch nicht auftauchen (SATB-Trennung) |
| 4 | **Forum / Nische** (Akkudoktor, Restarters, Discourse, GitHub) | Indie-Apps unter dem SEO-Radar (Horisol, Juli 2026) |

**Stoppregel:** Ein Treffer, der die Idee vollständig abdeckt und ≤ 12 Monate alt ist → Urteil `besetzt`, keine weitere Suche. Nicht nach einem Grund suchen, die Idee doch zu retten.

**Verengen statt verwerfen**, wenn der Treffer eine *benannte Schwäche* hat (z. B. CompGen: KI halluziniert bei verwitterten Stellen). Die Schwäche ist dann die neue Idee.

---

## 2. Such-Rezepte, die funktioniert haben

**Um freie Lücken zu finden (nicht nur Ideen zu prüfen):**

- **Offizielles Bewertungsschema ohne digitales Werkzeug** → `<Thema> Bewertungsverfahren Punktesystem Leitfaden`. Fund: LAG-VSW-Schema zum Vogelschlag.
- **Von der Organisation selbst genannter Engpass** → `<Projekt> Auswertung dauert` / `bis zu … Minuten` / `ehrenamtlich ausgewertet`. Fund: Thünen, bis zu 90 Minuten pro Nisthilfe.
- **Werkstattberichte über KI-Versuche** → `<Verein> Werkstattbericht KI` / `Erfahrungen KI`. Die Grenzen, die dort stehen, sind fertig formulierte Ideen.
- **Forschung ohne Produkt** → `<Technik> smartphone` auf arXiv/ECCV-Workshops; dann prüfen, ob es ein Werkzeug für Laien gibt.

**Was nicht funktioniert hat:**

- `<Thema> KI verständlich App` auf Deutsch → Content-Farmen (bau.de-Klone). Urteil daraus: **unklar**, nicht „frei". Mit Organisationsnamen neu suchen.
- Abwesenheit von Treffern nach nur einer Suche ist kein Befund.

---

## 3. Besetzungsatlas (Stand 18.09.2026)

Wo Ideen schnell sterben — vor dem Suchen als Vorfilter nutzen.

| Feld | Zustand | Belege |
|---|---|---|
| Dev-Tooling, MCP, Git | **dicht** | git-archaeologist, Home-Network MCP |
| Mieter-Tools (Mängel, Schimmel, Nebenkosten) | **dicht, kommerziell** | Miet-Akte, SchimmelScan, MietKlar |
| Hitze/Schatten-Routing | **dicht, Forschung + Kommunen** | HEAL/shaded.ors, Shadowmap, Berliner Kühle-Orte-Karten |
| Schulweg-Sicherheit | **dicht** | Schulwegportal, VCD-Check, FixMyBerlin |
| Balkonsolar-Planung | **dicht** | Horisol, HTW-Simulator, PVGIS |
| Audio-Trennung (Chor, Stems) | **dicht** | MVSEP SATB, ChoirMate |
| Repair Cafés + KI | **wird gerade besetzt** | Repair Café International, robotfreak/repair-cafe |
| Barrierefreiheit per Foto | **beim Empfänger selbst** | HIIG/Wheelmap-Datensatz 2023 |
| Grabstein-Transkription | **beim Empfänger selbst** | CompGen-Werkstattbericht Mai 2026 |
| **Naturschutz-Vollzug** (Schemata, Monitoring-Auswertung) | **frei** | Vogelschlag, Wildbienen |
| **Kulturerbe-Physik** (Licht, Oberfläche) | **frei als Werkzeug** | Smartphone-RTI nur als Paper |
| Pflanzenbestimmung/-entdeckung, gamifiziert | **dicht** | Seek (iNaturalist) — Badges/Challenges, auch für Ritzenpflanzen; Longitudinalspur derselben Pflanze bleibt Lücke |
| Behördenbrief → Leichte Sprache | **dicht, ein Nachbar sehr nah** | Zetteln (zetteln.app) — live, DSGVO-konform, hybrid Cloud-Fallback; Zero-Cloud-Garantie bleibt Lücke |

**Faustregel, jetzt mit zwei Runden Evidenz:** Wenn Endnutzer dafür zahlen würden oder eine Stadt es als Pressemitteilung verkaufen kann, existiert es. Frei ist, was ein Fachgremium als PDF veröffentlicht und niemand je in Software gegossen hat.

---

## 4. Trefferquote (Kalibrierung)

| Runde | Datum | Geprüft | Frei | Verengt | Unklar | Besetzt |
|---|---|---|---|---|---|---|
| 1 | Sep 2026 | 19 | 8 | 7 | – | 4 |
| 2 | 16.09.2026 | 13 | 2 | 1 | 2 | 8 |
| Nachtrag | 18.09.2026 | 2 | – | 2 | – | – |

Runde-1-Zahlen am 18.09.2026 korrigiert: Die elf Ideen, die ursprünglich als eine Sammelzeile „siehe jeweilige Dose" im Protokoll standen, waren nie einzeln ausgezählt (vorher grob 10/5 geschätzt, tatsächlich 8 frei/7 verengt — siehe `amelie-pruefprotokoll.md`, Runde 1). Der Nachtrag sind Crack Flora Watcher und KlarLokal, beide `verengt` (Seek bzw. Zetteln als Konkurrenz).

Runde 2 zielte bewusst auf „Zivilgesellschaft" — und lag trotzdem bei ~23 %. **Die Zivilgesellschafts-Regel aus `_entsorgt.md` stimmt nur für Nischen ohne Endnutzer.** Alltagsthemen mit Bürgerbezug (Hitze, Miete, Schulweg) sind 2026 voll.

---

## 5. Retro

### Runde 2 — 16.09.2026
- **Gelernt:** Empfänger zuerst suchen. Hätte 3 Suchen gespart.
- **Gelernt:** Die drei Überlebenden kamen nicht aus Brainstorming, sondern aus Primärquellen (Leitfaden, Projektseite, Werkstattbericht). Nächste Runde: **von Quellen aus suchen, nicht von Einfällen aus.**
- **Fehler:** Zu viele naheliegende Konsumideen ins Rennen geschickt; der Atlas oben hätte 5 davon ohne Suche aussortiert.
- **Nächstes Mal ausprobieren:** Veröffentlichungslisten der LANA / Vogelschutzwarten / Thünen / BfN nach weiteren „Schema ohne Tool"-Fällen durchgehen.

### Librarian-Audit — 18.09.2026 (kein Ideenrunde, Konsistenzprüfung)
- **Gefunden:** Elf Runde-1-Ideen standen als eine Sammelzeile „siehe jeweilige Dose" im Protokoll statt einzeln — nicht Strg+F-fähig, Trefferquote war grob geschätzt statt ausgezählt (10/5 statt tatsächlich 8/7). Einzeln aus den Dosen nachgetragen.
- **Gefunden:** Crack Flora Watcher und KlarLokal hatten trotz fertiger Dose und Matrix-Eintrag keine Protokollzeile (kamen als Nachzügler aus einer Runde außerhalb des Protokoll-Rhythmus). Nachgetragen, beide `verengt` — und ihre Konkurrenz (Seek, Zetteln) fehlte im Atlas.
- **Nächstes Mal:** Wenn eine Runde außerhalb des normalen Rundenstart-Ablaufs Dosen erzeugt (z. B. aus einem anderen Tool/Modell), sofort eine Protokollzeile mitschreiben — nicht erst bei der nächsten Konsistenzprüfung.
- **Offen für Runde 3:** die beiden `unklar`-Zeilen aus Runde 2 (Bebauungsplan-Leser, Tafel-Warenannahme) zuerst erneut prüfen, siehe Hinweis über der Runde-3-Tabelle im Protokoll.

### Runde 3 — <Datum>
- Gelernt:
- Fehler:
- Nächstes Mal:

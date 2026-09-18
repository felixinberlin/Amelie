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

## 3. Besetzungsatlas (Stand 16.09.2026)

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
| **Naturschutz-Vollzug: Bewertungsschemata/Checklisten ohne Tool** (Punktesysteme, Monitoring-Auswertung von Hand) | **frei** | Vogelschlag, Wildbienen, Lichtplan-Check |
| **Naturschutz: KI-Bilderkennung** (Arten-/Biotoptyp aus Foto oder Fernerkundung) | **dicht, aktive Forschung + Produkte** | ObsIdentify (~95 % Trefferquote), Flora Incognita, KIBI-Projekt (BfN, FFH-Typen aus Luftbild), Namis-Biotop-App (DBU) |
| **Kulturerbe-Physik** (Licht, Oberfläche) | **frei als Werkzeug** | Smartphone-RTI nur als Paper |

**Faustregel, jetzt mit zwei Runden Evidenz:** Wenn Endnutzer dafür zahlen würden oder eine Stadt es als Pressemitteilung verkaufen kann, existiert es. Frei ist, was ein Fachgremium als PDF veröffentlicht und niemand je in Software gegossen hat.

---

## 4. Trefferquote (Kalibrierung)

| Runde | Datum | Geprüft | Frei | Verengt | Unklar | Besetzt |
|---|---|---|---|---|---|---|
| 1 | Sep 2026 | 19 | 10 | 5 | – | 4 |
| 2 | 16.09.2026 | 13 | 2 | 1 | 2 | 8 |
| 3 (Researcher #1, ideenrunde) | 18.09.2026 | 4 | 1 | 2 | 1 | 0 |

Runde 2 zielte bewusst auf „Zivilgesellschaft" — und lag trotzdem bei ~23 %. **Die Zivilgesellschafts-Regel aus `_entsorgt.md` stimmt nur für Nischen ohne Endnutzer.** Alltagsthemen mit Bürgerbezug (Hitze, Miete, Schulweg) sind 2026 voll.

Runde 3 (Researcher #1) lag bei 75 % „frei + verengt" (3 von 4) — höher als Runde 2, aber auf kleiner Stichprobe (2 Rechecks + 2 neue Ideen aus Typ-A-Quellen) und mit einer besetzt-nahen Erkenntnis erst *innerhalb* der Prüfung einer Idee (Biotoptyp-Assistent → verengt statt frei, weil „Naturschutz-Vollzug" nachträglich in zwei Unterfelder gesplittet werden musste, siehe Atlas).

---

## 5. Retro

### Runde 2 — 16.09.2026
- **Gelernt:** Empfänger zuerst suchen. Hätte 3 Suchen gespart.
- **Gelernt:** Die drei Überlebenden kamen nicht aus Brainstorming, sondern aus Primärquellen (Leitfaden, Projektseite, Werkstattbericht). Nächste Runde: **von Quellen aus suchen, nicht von Einfällen aus.**
- **Fehler:** Zu viele naheliegende Konsumideen ins Rennen geschickt; der Atlas oben hätte 5 davon ohne Suche aussortiert.
- **Nächstes Mal ausprobieren:** Veröffentlichungslisten der LANA / Vogelschutzwarten / Thünen / BfN nach weiteren „Schema ohne Tool"-Fällen durchgehen.

### Runde 3 — 18.09.2026 (Researcher #1, method: ideenrunde)
- **Gelernt:** „Naturschutz-Vollzug" als Atlas-Feld war zu grob gefasst. Punktesysteme/Checklisten (Typ A, von Hand angewendet) sind weiter frei — aber KI-Bilderkennung für Arten- oder Habitat-Typen aus Fotos/Fernerkundung ist bereits ein aktiv besetztes Forschungs- und Produktfeld (KIBI-Projekt beim BfN selbst, ObsIdentify, Flora Incognita, Namis-Biotop-App). Der Atlas wurde entsprechend in zwei Zeilen gesplittet — sonst wäre „Naturschutz + Foto" fälschlich pauschal als frei durchgewunken worden.
- **Gelernt:** Licht-Themen bei LAG Vogelschutzwarten sind Teil des Glas-Dokuments (LAG VSW 21/01), kein eigenes Schema. Die ergiebige Quelle für die Licht-Idee war stattdessen eine **Landesumweltbehörde** (Hamburg BUKEA) plus NABU/BUND-Ratgeber — eine Quellenkategorie, die bisher nicht systematisch in `amelie-quellen.md` stand.
- **Fehler:** Erste Suche zum Biotopwertverfahren fand nur den Rechenteil (BWKalk, Rheinland-Pfalz) und wäre beinahe als „besetzt, weiter" abgehakt worden — der eigentliche Engpass (Biotoptyp *identifizieren*, nicht Punkte *berechnen*) wurde erst durch eine zweite, gezielte Suche nach KI-Bilderkennung sichtbar. Lehre: bei Bewertungsverfahren immer beide Teilschritte einzeln prüfen — Zuordnung/Klassifikation und Berechnung/Aggregation sind oft unterschiedlich weit digitalisiert.
- **Nächstes Mal:** Landesumweltbehörden (Berlin Senatsverwaltung, Bayern LfU, NRW LANUV, weitere) systematisch nach „Leitfaden ohne Tool"-Fällen absuchen — dieselbe Machart wie LAG VSW/Hamburg, aber länderweise bisher nicht durchgegangen. `amelie-quellen.md` um diese Kategorie als eigenen Quellentyp ergänzen, wenn sie sich in Runde 4 erneut als ergiebig erweist. mitforschen.org bleibt offen und laut Quellenliste „ergiebigste Quelle" — dort ansetzen, falls Researcher #2 es noch nicht abgedeckt hat.

# Glasanflug-Ampel

*(englisch, wie die Idee ursprünglich hieß: Bird Glass Hazard Score Calculator)*

**Ein Satz:** Foto einer Fassade plus Standort → Schätzung der Eingangsgrößen des LAG-VSW-Bewertungsschemas (Glasanteil, gespiegeltes Grün, Durchsichten, Ecken, Umfeld) → Risikoklasse mit sichtbarer Herleitung, nicht als Urteil, sondern als ausfüllbarer Vorschlag.

**Stand:** 21.09.2026 · **Prüfen ab:** 03/2027 *(verkürzt: die englischsprachige Seite des Feldes ist kommerziell und bewegt sich)*
**Empfänger:** **LBV — Landesbund für Vogel- und Naturschutz in Bayern**, Projekt „Vogelschlag an Glas verhindern" (2023–2027, Bayerischer Naturschutzfonds), Dr. Peter Stimmler · **Fachlicher Eigentümer des Schemas, unbedingt mitnennen:** LAG VSW (Klemens Steiof) · nachrangig: Schweizerische Vogelwarte Sempach (Fachstelle Vogelglas), BUND NRW
**Verdikt:** 🎁 verschenken

---

## Das Problem

In Deutschland sterben nach LBV-Schätzung **über 100 Millionen Vögel pro Jahr** an Glas; **nur 15–35 % der Opfer werden überhaupt gefunden**. Rechtlich hängt alles an einer einzigen Frage: Ist das Tötungsrisiko an diesem Bauwerk *signifikant erhöht* im Sinne von § 44 Abs. 1 Nr. 1 BNatSchG? Ab etwa **vier bis fünf Schlagopfern pro 100 m Fassadenlänge und Jahr** gilt es als signifikant — die Quellen nennen mal vier, mal fünf, weshalb der maßgebliche Wert aus LAG VSW 21/01 selbst zu nehmen ist, nicht aus Merkblättern.

Für die Frage *vor* dem Bau gibt es seit 2021 ein Werkzeug: das **Bewertungsverfahren der Länderarbeitsgemeinschaft der Vogelschutzwarten (LAG VSW 21/01)**. Ein Punktesystem, das zwischen geringem, mittlerem, hohem und sehr hohem Risiko unterscheidet, mit Faustwerten, die jede Planerin kennen müsste: Fensterscheiben unter 1,5 m² sind meist unproblematisch, **zusammenhängende Glasflächen über 6 m² häufig problematisch**, freistehende Glaswände, Durchsichten, verglaste Gebäudeecken und Übergänge sind die eigentlichen Todesfallen.

Dieses Verfahren existiert als PDF. Sonst nichts.

**Wer darunter leidet, konkret:**

- **Untere Naturschutzbehörden**, die eingereichte Planungen beurteilen sollen und dafür ein Schema haben, das niemand vorgerechnet hat.
- **Architekturbüros**, die in der Entwurfsphase eine Selbsteinschätzung liefern sollen. Berlin hat im **August 2026** ausdrücklich erklärt, der Schutz beginne „bereits bei der Planung", und dazu eine Beurteilungshilfe veröffentlicht. Die Pflicht wächst, das Werkzeug nicht.
- **Gebäudeeigentümer** — Schule, Sparkasse, Stadtwerk —, bei denen jemand tote Vögel meldet und die nicht wissen, ob sie handeln müssen und an welcher Fassade zuerst.
- **Der Empfänger selbst.** Der LBV vergibt die Plakette „Vogelfreundliche Glasfläche": Online-Formular mit Foto und Kurzbeschreibung, danach **Besichtigung durch geschultes Personal**, Punktvergabe nach Planung, Wirksamkeit und Aufklärung. Menschen fahren hin und schauen. Das ist die richtige Endstufe — aber als *einzige* Stufe deckelt sie das Projekt auf so viele Gebäude, wie Personal fahren kann.

## Warum das jetzt geht

Das Schema fragt nach Dingen, die man bis vor Kurzem nur vor Ort beurteilen konnte. Drei davon sind seit zwei, drei Jahren aus einem Bild ableitbar:

1. **Glas erkennen ist gelöste Forschung, nicht mehr Wunschdenken.** Glas- und Transparenzsegmentierung ist ein eigenes, dicht besetztes Feld (Mirror-and-Glass-Detection-Reihe der City University Hong Kong; TransCues, WACV 2026; Glass Segmentation with Multi Scales, arXiv 2402.08571). Fassadenparsing — Fenster, Geschosse, Achsen — ist seit Jahren Standard (Mask R-CNN auf Fassadenbildern, arXiv 2107.10006).
2. **Die Spiegelung selbst ist messbar geworden.** Der entscheidende Faktor des Schemas ist nicht „wie viel Glas", sondern **was sich darin spiegelt** — Bäume und Himmel machen die Scheibe zum Durchflug. Genau darauf zielt aktuelle Arbeit: **NFGlassNet** (arXiv 2511.16887) erkennt Glas über den *Kontrast der Spiegelung* zwischen Blitz- und Nicht-Blitz-Aufnahme. Code ist dort erst „upon acceptance" angekündigt — also Baustein, nicht Abhängigkeit.
3. **Das Umfeld muss niemand schätzen.** Grünflächen, Gewässer, Alleen stehen in OpenStreetMap; Berlin hat ein Baumkataster mit rund 885.000 Einzelbäumen, das über Gieß den Kiez offen abfragbar ist. „Vegetation in Spiegelentfernung" wird damit eine Abfrage statt eines Eindrucks.
4. **Und das, was ohnehin fehlte, ist billig geworden:** ein Text, der erklärt, *warum* eine Fassade in Klasse 3 landet. Eine Punktzahl ohne Begründung überzeugt keine Behörde; eine Begründung pro Faktor war früher Gutachterarbeit.

## Skizze

- **Eingabe:** ein bis drei Fotos je Fassade (Aufnahmerichtung und Uhrzeit werden mitgespeichert, weil Spiegelung davon abhängt) plus Koordinate.
- **Ableitung:** Glasflächen segmentieren → Anteil und **Größe zusammenhängender Scheiben** je Höhenzone → geometrische Sonderfälle erkennen (verglaste Ecke, Durchsicht, freistehende Scheibe) → Spiegelinhalt klassifizieren (Himmel / Vegetation / Bau) → Umfeld aus OSM und Baumkataster.
- **Bewertung:** eine **maschinenlesbare Fassung des LAG-VSW-Schemas** — Faktoren, Punktwerte, Schwellen, im Wortlaut. Die Software rechnet nur; sie interpretiert nichts.
- **Ausgabe:** eine Seite. Foto mit Overlays, darunter jeder Faktor mit geschätztem Wert, **Herkunft der Schätzung** (Bild / Geodaten / Eingabe) und Unsicherheit. Jeder Wert von Hand überschreibbar, die Klasse rechnet sich neu. Was das Bild nicht hergibt, steht als **„unbestimmt"** da und nicht als Zahl.

**Nicht dabei:** keine Produktempfehlung (das macht die Glasbranche, und sie hat ein Interesse daran), kein Zertifikat, kein automatisches §-44-Urteil, keine Prognose toter Vögel pro Jahr, keine flächendeckende Bewertung fremder Gebäude aus Straßenbildern, keine veröffentlichte Karte „gefährlicher Häuser".

## Erster Schritt

**Ticket: Das Schema ausführbar machen — ohne eine Zeile Bilderkennung.**

LAG VSW 21/01 in eine Regeldatei übertragen (YAML oder JSON): jeder Faktor, jeder Punktwert, jede Schwelle, jeweils mit dem Originalwortlaut daneben. Dazu ein Rechner, der Werte von Hand entgegennimmt, und Testfälle aus den Beispielen der Berliner Beurteilungshilfe.

**Fertig, wenn:** drei Gebäude, die der LBV bereits von Hand beurteilt hat, bei manueller Eingabe dieselbe Risikoklasse bekommen — **und jede Abweichung sich auf einen benannten Eingabewert zurückführen lässt, nicht auf die Regeln.**

Das ist absichtlich der langweiligste denkbare Anfang. Er hat zwei Vorzüge: Er ist für sich allein schon nützlich (eine zitierbare, versionierte Fassung des Schemas, die jede Behörde nachnutzen kann), und er beantwortet vor jeder Investition in Bilderkennung die Frage, ob das Schema überhaupt eindeutig genug formuliert ist, um gerechnet zu werden.

## Wo es kippt

**1. Eine Zahl, die sicherer klingt, als sie ist, wird in beide Richtungen missbraucht.** „Klasse 2, alles in Ordnung" ist als Bauherrenargument genauso falsch wie „Klasse 4" als Ablehnungsgrund. Gegenmaßnahme, ohne die das Ding nicht gebaut werden sollte: Die Ausgabe ist ein **ausgefüllter Vorschlag mit sichtbaren Eingangswerten**, kein Ergebnis. Wer die Faktoren nicht sieht, bekommt auch keine Klasse.

**2. Das Foto sieht die Spiegelung nur einmal.** Dieselbe Fassade liefert morgens, im Juli und von schräg unten drei verschiedene Antworten. Der Blitz/Nicht-Blitz-Trick aus der Forschung funktioniert am **einzelnen Fenster auf zwei Meter**, nicht an einer 20-Meter-Fassade. Deshalb: Uhrzeit und Richtung erfassen, mehrere Aufnahmen zulassen, und die Spiegelung im Zweifel als unbestimmt melden statt sie zu raten.

**3. Die Evidenzlage trägt keine Präzision.** Samuels u. a. (PeerJ, 2022) haben an einem Wohnhaus gefilmt: Kleine Oberlichter wurden **fast ebenso oft getroffen wie große Glastüren** — Fluggeschwindigkeit und Anflugwinkel waren die besseren Prädiktoren als die Scheibengröße. Dazu die 15–35 % Fundquote. Eine Ampel kann Situationen **ordnen**, sie kann keine Todeszahlen vorhersagen, und sie darf nicht so tun.

**4. Das Schema gehört nicht dem, der es programmiert.** Eine Software, die LAG VSW 21/01 „auslegt", spaltet die Praxis in zwei Verfahren. Deshalb: wortgetreue Abbildung, Versionsnummer des Schemas im Ausdruck, und ein Korrekturweg für die LAG VSW. Wenn die Vogelschutzwarten nicht mitziehen, sollte es nicht gebaut werden — dann bleibt es bestenfalls der Rechner für die eigene Beratung.

**5. Der Weg vom Planungshilfsmittel zum Prangerwerkzeug ist kurz.** Fassaden lassen sich massenhaft aus Straßenbildern bewerten. Das wäre technisch reizvoll und sozial ruinös: Eigentümer, die einen automatisch erzeugten Risikowert im Netz finden, hören auf zu kooperieren. Gilt nur für eigene Gebäude oder solche mit Auftrag.

## Wer es schon versucht hat

**Urteil `verengt`, nicht `frei`** — Korrektur des Urteils aus Runde 2, das auf einer einzigen deutschen Suche beruhte. Der Rechner als solcher existiert bereits zweimal, nur anderswo und anders:

- **FLAP Canada, „BirdSafe DIY Building Risk Assessment App"** (`flapapp.ca`): kostenlos, im Browser, schätzt Kollisionsrisiko bei Tag und Nacht **pro Fassade** und zeigt, welche Fenster am gefährlichsten sind. Es ist ein geführter **Fragebogen** — der Mensch liefert die Einschätzung, die Software rechnet. Keine Bildauswertung, kanadischer Kontext. Daneben kostenpflichtige BirdSafe-Begutachtung mit Ortsterminen.
- **LEED Pilot Credit SSpc55, „Bird Collision Deterrence"** (USGBC): ein echter Punkterechner mit offizieller Tabellenvorlage. `(Zone 1 gewichtete Fläche + Zone 2 gewichtete Fläche) / bereinigte Fassadenfläche = Bird Collision Threat Rating`, Ziel ≤ 15, Zone 1 sind die ersten 36 Fuß über Grund, verglaste Ecken und Durchflugsituationen ≤ 25. Die Gewichte sind **Material Threat Factors** aus Flugtunnel-Tests der American Bird Conservancy. Entscheidender Unterschied: Das bewertet **Materialien aus der Planung**, nicht die Situation aus dem Bild — und es ist eine Zertifizierungslogik, keine Vollzugshilfe.
- **New York, Local Law 15 (2020)** hat einen Markt für Nachweise geschaffen; bedient wird er von Beratungsbüros und Materiallisten. Compliance-Software dazu: nicht gefunden.
- **Deutschland und Schweiz:** LAG VSW 21/01 (PDF), Berliner Beurteilungshilfe, LfU-Bayern-Merkblätter, Nürnberger Merkblatt 2023, `vogelglas.vogelwarte.ch` der Vogelwarte Sempach mit Broschüren, getesteten Produkten und Beraterlisten. **Kein einziges digitales Werkzeug**, das das Schema rechnet.
- **Der Empfänger selbst hat es nicht gebaut** — aber er hat den Engpass: Die LBV-Plakette läuft über Online-Formular plus Ortsbesichtigung durch geschultes Personal.
- **Forschung:** Fassaden- und Glassegmentierung sind gelöst und veröffentlicht; auf Vogelschlag angewendet hat sie niemand. Ein quelloffenes Projekt zu Vogelschlagrisiko an Gebäuden war nicht zu finden.
- **Abzugrenzen:** `birdmapper.org` (Global Bird Collision Mapper) und die LBV-Meldestelle sammeln **Opferfunde**. Das ist die Gegenrichtung — Nachweis statt Vorhersage — und für die Kalibrierung dieser Ampel die interessanteste Datenquelle überhaupt.

**Restlücke, die bleibt:** das **deutsche Schema** als ausführbares, zitierfähiges Werkzeug, dessen Situationsfaktoren — Glasanteil, gespiegeltes Grün, Durchsichten, Ecken, Umfeldgrün — **aus Foto und Geodaten geschätzt statt abgefragt** werden, und dessen Ergebnis ein prüfbares Blatt für Behörde und Bauherr ist statt einer Zertifikatspunktzahl. Das ist die Idee. Nicht „eine Vogelschlag-App".

## Vorarbeit

- **LAG VSW 21/01**, „Vermeidung von Vogelverlusten an Glasscheiben — Bewertungsverfahren": `vogelschutzwarten.de/glasanflug.htm`. *Hinweis: Die PDF war für diese Recherche maschinell nicht lesbar (robots.txt bzw. 403). Die Punktwerte in der Regeldatei müssen aus dem Original abgeschrieben werden, nicht aus Merkblättern — genau das ist das erste Ticket.*
- **Berlin, Beurteilungshilfe zur Einschätzung des Kollisionsrisikos an Glasflächen** (SenMVKU) und die Pressemitteilung vom 10.08.2026 zur Verankerung in der Planungsphase.
- **LBV-Projekt „Vogelschlag an Glas verhindern"** (2023–2027) mit Beratung, Meldestelle und Plakette; Kontakt `vogelschlag@lbv.de`.
- **Schweizerische Vogelwarte Sempach**, `vogelglas.vogelwarte.ch` — Broschüre „Vogelfreundliches Bauen mit Glas und Licht", Merkblatt 2017, Produkttests.
- **American Bird Conservancy**, Material Threat Factors und LEED-Innovation-Credit; USGBC SSpc55 mit Rechenvorlage.
- **FLAP Canada**, BirdSafe-App und „An Analysis of Collision Mitigation Effectiveness".
- **Bildseite:** Mirror-and-Glass-Detection (CityU HK), TransCues (WACV 2026), arXiv 2402.08571, NFGlassNet (arXiv 2511.16887), Fassaden-Fenstererkennung (arXiv 2107.10006).
- **Geodaten:** OpenStreetMap-Landnutzung, Berliner Baumkataster über Gieß den Kiez.
- **Evidenz und Grenzen:** Samuels, Fenton, Fernández-Juricic, MacDougall-Shackleton (PeerJ, 2022), Video- und Audioaufzeichnung realer Kollisionen.

---

**In one paragraph, for forwarding:** Germany has an official four-level bird-strike risk scheme for glass (LAG VSW 21/01) that exists only as a PDF, while the legal threshold under § 44 BNatSchG turns on whether a building's collision risk is "significantly elevated". North America has calculators — FLAP's BirdSafe questionnaire, LEED's SSpc55 spreadsheet — but they ask the human for the inputs, or score materials off a plan. The gap: estimate the *situational* inputs (glass share, what the panes reflect, corners, fly-throughs, surrounding greenery) from a photo plus open geodata, and hand back a sheet that shows every input and its uncertainty rather than a verdict.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

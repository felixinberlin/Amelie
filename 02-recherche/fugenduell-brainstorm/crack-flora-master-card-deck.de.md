> **Historischer Spielentwurf, keine verifizierte Wertetabelle.** Seit 09.10.2026 ersetzt der wissenschaftliche Artenbestand diese 0–10-Werte; siehe [Datenprüfung](daten-audit-2026-10-09.md). Die folgenden Zahlen und Spielboni bleiben nur als Entwurf dokumentiert.

# Crack Flora: Fugenduell — Master-Kartendeck (deutsche Fassung)

> Quelle: `crack-flora-master-card-deck.docx` (Gemini-Notebook-Export, 14 Kartenbilder, 08.10.2026) (Binärdatei bewusst nicht im Repo, 32 MB). Übersetzung und Prüfung 09.10.2026.
> Grundlage laut Deck: LEDA Traitbase, SID Kew, UNDERPLOT, Protokolle von Cole & Bayfield.

## Prüfbefund

* **Werte:** Alle 14 Werteblöcke und Summen stimmen mit `src/data/fugenduellData.ts` und `crack-flora-starter-roster.md` überein (Summen nachgerechnet). Das Deck liefert keine neuen Zahlen, sondern die **Bedingungen der Fähigkeiten**.
* **Neu und jetzt im Simulator:** Arena-Bedingungen (Vertikalkletterer nur an senkrechter Wand, Kalkanker halbiert auf Asphalt, Salzpumpe nur in der Salzzone, C4-Turbo nur über 35 °C, Trittplatte verdoppelt ab Störung ≥ 7), Milchsaft senkt **nur CHEMIE** (vorher fälschlich alle Werte), Götterbaum −2 auf alle Werte, Resistenzfeld des Berufkrauts halbiert Gifteffekte, Polstergriff/Trockenstarre/Schleudersitz/Pfahlwurzelbohrer als Deckungsregeln.
* **Bewusste Abweichung:** C4-Turbo „verdreifacht DÜRRE“ ergäbe 30 auf einer 0–10-Skala (Deckungswechsel um 80 %). Im Simulator: +6 über 35 °C.
* **Mehrrunden-Fähigkeiten (ebenfalls umgesetzt):** Fallschirmwolke (Klonpunkt je Rundensieg, max. 3, zählt ab der nächsten Runde), Mauerkrone (Risse bis 3, stärken den Sommerflieder und schalten Zimbelkraut-/Mauerraute-Wandboni ab), Nektarrausch (Biodiversitätspunkte, ab 4 ein Zusatzsamen), Dauerblüte (Vorrang: Gleichstand geht an das Rispengras). Dazu kleine Passiva: Frühstarter (+2 in Runde 1), Ameisenpost, Sohlenfracht, Achenensegel, Asphaltsprenger, Vitamingift.
* **Nicht übernommen:** Sporenstaub, Silberschild, Kriechspross, Samenbank, Samenregen und Lichtflucht (reine Ausbreitung ohne Wert, den die Engine prüft).
* **Kartenbilder:** KI-generiert (Wasserzeichen „Gemini Notebook“), jeweils drei Karten als Collage, mit **erfundenen Werten** („+2 Resilience, −1 Stealth“), die dem Regelwerk widersprechen. Als Kartenfront ungeeignet, nicht ins Frontend übernommen.
* **Rechtlich:** Trait-Daten stammen aus offenen Datenbanken; Bildrechte der KI-Bilder ungeklärt, vor CC0-Veröffentlichung nicht ins Repo.

## Die 14 Karten

Werte: WURZEL · TRITT · DÜRRE · SAAT · TEMPO · CHEMIE (Summe von höchstens 36).

### 1. Gewöhnlicher Löwenzahn (*Taraxacum officinale*)
Archetyp: Zähe Regeneratorin · häufig · CSR RC · Arena: Gehwegfuge, Baumscheibe
5 · 5 · 5 · 6 · 7 · 4 = 32
* **Pfahlwurzelbohrer** (passiv): regeneriert aus Wurzelstücken (ca. 1 m tief), halbiert den Deckungsverlust durch Wurzelstress.
* **Fallschirmwolke** (aktiv): Flugsamen setzen nach einem Rundensieg einen Klon in eine Nachbarritze.
„Eine zähe Pionierin der Stadt: Die tiefe Pfahlwurzel macht mechanisches Entfernen fast unmöglich, tausende Achänen suchen neue Betonspalten.“

### 2. Breitwegerich (*Plantago major*)
Archetyp: Trittkönig · häufig · RCS · Arena: Hauptstraße, Pflasterfuge
5 · 9 · 6 · 4 · 4 · 4 = 32
* **Trittplatte** (passiv): Elastische Blattadern und flache Rosette verdoppeln TRITT bei starker Störung (≥ 7).
* **Sohlenfracht** (Nutzen): Klebrige Schleimsamen haften an Schuhsohlen und reisen weit.
„Historisch ‚Fußstapfen des weißen Mannes‘: Die druckfesten Blätter nehmen extreme Trittlast auf, die Schuhe sind seine Autobahn.“

### 3. Einjähriges Rispengras (*Poa annua*)
Archetyp: Schneller Sprinter · häufig · R · Arena: Gehwegfuge, Rasenkante
3 · 6 · 4 · 8 · 10 · 3 = 34
* **Dauerblüte** (Priorität): Schnelle Phänologie gibt in jeder Runde Vorrang; blüht von Frühling bis Spätherbst.
* **Samenregen** (passiv): Hoher Samenausstoß legt sofort eine lokale Samenbank in den Nachbarritzen an.
„Eines der weltweit häufigsten Unkräuter, vom Keimling zur Samenreife in nur 45 Tagen.“

### 4. Behaartes Schaumkraut (*Cardamine hirsuta*)
Archetyp: Frühlingsexplosion · häufig · R · Arena: Pflasterfuge, Mauerfuß
3 · 4 · 3 · 8 · 9 · 5 = 32
* **Schleudersitz** (bei Niederlage): Schoten unter Druck schleudern Samen bis 1 m in Nachbarritzen.
* **Frühstarter** (passiv): Keimt schon beim späten Wintertauwetter.
„Ein kleiner Einjähriger, der seine Samen ballistisch auf Passanten abfeuert.“

### 5. Zimbelkraut (*Cymbalaria muralis*)
Archetyp: Wandkletterer · selten · SR · Arena: Mauerfuge, Kalkmörtel
4 · 3 · 6 · 7 · 6 · 4 = 30
* **Lichtflucht** (Raumnutzen): Stängel krümmen sich nach der Befruchtung vom Licht weg und legen die Kapseln in dunkle Mauerspalten.
* **Vertikalkletterer** (passiv): +3 auf alle Verteidigungswerte in senkrechten Wandarenen.
„Spezialistin alter Mauern, die ihre Samen selbst in die Fuge zurückdrückt.“

### 6. Mauerraute (*Asplenium ruta-muraria*)
Archetyp: Kalkalte · selten · S · Arena: historische Mauerfuge, Brücken
6 · 2 · 9 · 4 · 2 · 5 = 28
* **Kalkanker** (bedingt): Unbesiegbar gegen Dürre in Kalkmörtelfugen; Werte halbiert in Asphaltumgebung.
* **Sporenstaub** (passiv): Sporen driften weit über Steinbauten.
„Ein uralter Kalkfarn, der Minerale direkt aus dem Mörtel zieht und jahrzehntelange Dürre übersteht.“

### 7. Silbermoos (*Bryum argenteum*)
Archetyp: Austrocknungsmeister · häufig · S · Arena: Pflasterritze, Betonritze
3 · 5 · 10 · 3 · 2 · 4 = 27
* **Trockenstarre** (Wiederbelebung): Fällt in Hitzewellen nie unter 5 % Deckung, rehydriert bei Regen sofort.
* **Silberschild** (passiv): Farblose Blattspitzen reflektieren Sonne und Betonhitze.
„Ein poikilohydres Moos, das zu Staub austrocknet und Sekunden nach Regen wieder grünt.“

### 8. Portulak (*Portulaca oleracea*)
Archetyp: C4-Hitzespezialist · ungewöhnlich · SR · Arena: Südwand-Asphalt, Hitzezonen > 50 °C
4 · 4 · 10 · 7 · 6 · 4 = 35
* **C4-Turbo / CAM-Wechsel** (Umweltmultiplikator): Verdreifacht DÜRRE, wenn die Asphaltoberfläche 35 °C übersteigt.
* **Samenbank** (Erbe): Samen bleiben im heißen Boden über 10 Jahre keimfähig.
„Eine Sukkulente, die bei Wassermangel in den CAM-Modus schaltet und auf glühendem Sommerasphalt gedeiht.“

### 9. Kanadisches Berufkraut (*Erigeron canadensis*)
Archetyp: Hoher Windturm · häufig · R · Arena: Gleisbett, Straßenrand
4 · 3 · 5 · 9 · 7 · 5 = 33
* **Resistenzfeld** (chemischer Schild): Halbiert Schäden durch Herbizide und Schadstoffe.
* **Achenensegel** (aktiv): Der hohe Stängel schickt Flugsamen in städtische Aufwinde.
„Ein aufragender Neophyt …“ (im Deck abgeschnitten)

### 10. Großes Schöllkraut (*Chelidonium majus*)
Archetyp: Alkaloidchemiker · ungewöhnlich · CR · Arena: Mauerfuß, schattige Fuge
5 · 4 · 4 · 6 · 5 · 9 = 33
* **Milchsaft** (Schwächung): Leuchtend oranger Isochinolin-Alkaloidsaft senkt die CHEMIE des Gegners um 2 je Runde.
* **Ameisenpost** (passiv, Myrmekochorie): Nährstoffreiche Samenanhängsel locken Ameisen, die die Samen unterirdisch verschleppen.
„Ein botanischer Chemiker mit orangem Latex, der Stadtameisen als Gärtner nutzt.“

### 11. Niederliegendes Mastkraut (*Sagina procumbens*)
Archetyp: Grünes Polster · häufig · SR · Arena: enge Pflasterritze, Feuchtfuge
4 · 8 · 6 · 5 · 5 · 3 = 31
* **Polstergriff** (Verteidigung): Dichte Matte nimmt keinen Trittschaden und heilt +3 % Deckung pro Runde.
* **Kriechspross** (passiv): Wurzelt an den Knoten und kriecht waagerecht entlang der Ritze.
„Bildet smaragdgrüne Polster in engen Fugen und verliert unter Fußgängerverkehr kein Blatt.“

### 12. Dänisches Löffelkraut (*Cochlearia danica*)
Archetyp: Salz-Autobahnreiter · selten · SR (Halophyt) · Arena: Autobahnrand, Streusalz-Zone
4 · 5 · 7 · 5 · 4 · 7 = 32
* **Salzpumpe** (Arena-Spezialistin): Verdoppelt den Deckungszuwachs je Runde in winterlichen Streusalzzonen; ohne Salzboden unspielbar.
* **Vitamingift** (passiv): Hoher Vitamin-C-Gehalt stärkt gegen chemische Belastung.
„Eine Küstenpflanze, die Autobahnen im Binnenland erobert hat und mit Streusalz konkurrierende Arten verdrängt.“

### 13. Sommerflieder (*Buddleja davidii*)
Archetyp: Betonbrecher · selten · CS · Arena: Bahngelände, Ruine
6 · 3 · 6 · 8 · 5 · 4 = 32
* **Mauerkrone** (Substratschaden): Verholzte Wurzeln brechen Mörtelfugen und verändern die Arena dauerhaft.
* **Nektarrausch** (Nutzen): Zieht Bestäuber an und hebt den lokalen Biodiversitätswert.
„Ein schnellwüchsiger Gehölzpionier, der Mörtel und Mauerwerk besiedelt, Millionen Flugsamen je Sommer.“

### 14. Götterbaum (*Ailanthus altissima*)
Archetyp: Invasiver Titan (gebannt) · exotisch/gebannt · C · Arena: Asphaltbruch, Industriebrache
8 · 4 · 7 · 7 · 4 · 6 = 36
* **Ailanthon** (allelopathisches Gift): Wurzelgifte senken alle Werte des Gegners um 2 je Runde.
* **Asphaltsprenger** (passiv): Enormer Wurzeldruck sprengt umliegende Betonplatten.
„Nach EU-Regeln für invasive Arten vom Turnierspiel ausgeschlossen, nur zum Beobachten, Protokollieren und Eindämmen sammelbar.“

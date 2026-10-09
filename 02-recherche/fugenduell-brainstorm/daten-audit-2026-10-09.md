# Fugenduell: Datenprüfung und nachvollziehbare Spielwerte

Stand: 09.10.2026. Prüfung der vorhandenen Recherche, kein neuer Dosenentwurf.

Die Quellenliste in `data-flora-quellen.md` ist ein guter Ausgangspunkt. `QUELLEN.md` kennzeichnet die importierten Brainstorms ausdrücklich als ungeprüft. `skill-tree.md` beschreibt mögliche Merkmalskombinationen und Gewichte; diese Entwurfsformeln belegen noch nicht die konkreten Zahlen im aktuellen Deck. Ein Datenbankname allein ersetzt keinen artspezifischen Datensatz.

## Was jetzt überprüft ist

| Quelle | Zweck | Stand und Grenze |
| --- | --- | --- |
| [Pladias](https://pladias.cz/en/taxon/data/Plantago%20major) | Höhe in m, Lebens-/Wuchsform, Blühmonate, leaf-trait CSR, ökologische Zeigerwerte | 11 exakt zugeordnete Taxa im lokalen Auszug; 10 mit 14 Merkmalen, Cochlearia mit 7. Tschechischer Florenkontext. |
| [UNDERPLOT beim iDiv](https://idata.idiv.de/ddm/data/Showdata/3610), DOI 10.25829/idiv.3610-56acy9 | Unterirdische Merkmale: maximale beobachtete Wurzeltiefe und laterale Ausdehnung, weitere Merkmale | Offizieller CSV-Auszug v39 importiert: 13 exakt passende Arten, davon 7 mit RDepth; Bryum fehlt. SHA-256 und Originalnamen gespeichert. Maximal beobachtet bedeutet nicht typische Tiefe einer Pflanze in einer Fuge. |
| [BiolFlor beim UFZ](https://www.ufz.de/index.php?de=38567) | Biologisch-ökologische Merkmale der deutschen Gefäßpflanzenflora | Offiziell bestätigt. Die migrierte Anwendung verlangt Registrierung; kein Datenexport in dieser Sitzung. |
| LEDA / TRY / SID aus der vorhandenen Recherche | Lebensgeschichte, Blatt-/Samenmerkmale, physiologische Messungen | Geeignete nächste Quellen; noch keine verifizierten Datensatzzeilen für die sechs aktuellen Spielwerte. Zugang, Version und Nutzungsbedingungen je Quelle prüfen. |
| RHS, Kew POWO, World Flora Online, British Bryological Society | Beschreibende Artenprofile und taxonomischer Kontext | Kurze, verlinkte Profile für alle 14 Deck-Arten in `fugenduellBotany.ts`. Keine gemessenen Standortwerte. |

Der reproduzierbare Pladias-Auszug liegt in `src/data/fugenduellScientificTraits.json`; Aktualisierung: `python3 scripts/fugenduell/import-pladias.py`. Der Import verlangt passende Artüberschriften und behält fehlende Werte als fehlend. Die derzeitige Erigeron-Adresse liefert keine passende Artseite: nicht stillschweigend auf Conyza umgestellt. Taraxacum ist ein taxonomisch schwieriger Aggregatkomplex; Bryum ist ein Moos und gehört nicht zur Gefäßpflanzenbasis. Beides wird nicht durch beliebige Nachbararten ersetzt.

Originalreferenzen der importierten Merkmalsgruppen: Kaplan et al. (2019), *Key to the flora of the Czech Republic* (Höhe, Lebensform, Blühperiode); Dřevojan (2020), *Growth form*; Guo & Pierce (2019), *Life strategy*, mit Methode nach Pierce et al. (2017); Chytrý et al. (2018), *Ellenberg-type indicator values for the Czech flora*, Preslia 90:83–103. Weitere Originalreferenzen und Definitionen stehen bei jedem Merkmal auf der verlinkten Artseite.

[Pladias-Nutzungsbedingungen](https://pladias.cz/en/homepage/rules): Nutzung für Wissenschaft, Unterricht, Naturschutz und Umweltzwecke unter Quellenangabe; kommerzielle Nutzung benötigt Zustimmung. Der Auszug wird nicht als CC0-Daten umetikettiert. Projektcode und Datenquellen haben getrennte Herkunft und Bedingungen.

## Konsequenzen für die Lernansicht

- Höhe ist die übliche Spannweite ausgewachsener, generativer Wildpflanzen in der tschechischen Flora, kein globaler Extremwert. RHS-Größenklassen sind ein anderer Quellenkontext und bleiben getrennt sichtbar.
- Zeigerwerte sind ordinale ökologische Präferenzen. Reaktion 6 bedeutet **nicht pH 6**. Das Zusatzzeichen `x` bleibt erhalten; es markiert breite ökologische Amplitude.
- CSR ist methodenabhängig: Plantago major hat bei Pladias/Pierce C/CR und 82,3/0/17,7 %. Eine andere Spielklasse ist keine zweite Messung derselben Methode.
- „Chemie“ darf Salz, Bodenreaktion, Schwermetalle und Allelopathie nicht zu einer vermeintlich gemessenen Eigenschaft vermischen. Küstenverbreitung allein belegt keine Salzdrüsen und keine Konzentrationsschwelle.
- Wurzeltiefe, relative Wachstumsrate, Samenmenge, Wasserpotential und Salzschwelle bleiben als noch nicht verifiziert markiert, bis passende Primärdaten vorhanden sind.

## Umsetzung nach Félix’ Vorgabe: Genauigkeit vor Spielregeln

Jede Art hat vier unterscheidbare, belegte botanische Merkmalskarten in `skills`, mit eigener Quelle und Quellenkontext. Nicht jedes Merkmal ist exklusiv auf eine Art beschränkt, und die vier Karten sind keine erfundenen Immunitäten oder Leistungsboni. Der Portulaca-Sukkulenzbeleg bleibt ausdrücklich als Gattungsbeschreibung markiert.

Die bisherigen sechs 0–10-Werte, das 36-Punkte-Budget, ungeprüfte Wachstumswochen, unbelegte Mechanismen und CSR-Archetypen wurden aus dem wissenschaftlichen Artenbestand entfernt. WURZEL enthält jetzt RDepth in **Metern**, sofern vorhanden. Die anderen fünf Verbundwerte bleiben `null`, bis tatsächlich passende Messungen vorliegen. Null bedeutet fehlend, nicht null Leistung. Leaf-trait CSR wird aus Pladias übernommen; fehlende Taxa erhalten keine Schätzung.

UNDERPLOT v39 (Repository-interne Version, veröffentlichter Datensatz Version 1.0): Bruelheide et al. (2026), DOI 10.25829/idiv.3610-56acy9, CC BY 4.0. Quelle RDepth/LRExtent: RSIP; BBsize: CLO-PLA. Die numerischen CSV-Werte sind Artenmittel der erfassten Merkmale. RDepth mittelt maximale beobachtete Wurzeltiefen, LRExtent mittelt einseitige maximale Radien. Knospenzahl gilt pro Spross bei klonalen Pflanzen, pro Bewurzelungseinheit bei nichtklonalen. Beispiele: Taraxacum RDepth 1,394675 m, Plantago 0,496666666666667 m, Poa 0,17 m, Sagina 0,04 m. Keine Vorhersage für die konkrete Straßenpflanze; Taxonaggregation und regionale Unterschiede beachten.

Reproduktion: offiziellen CSV-Download entpacken, dann `python3 scripts/fugenduell/import-underplot.py /pfad/UNDERPLOT.csv`. Der Auszug speichert Prüfsumme, Datensatzversion, Originalnamen und Fehlwerte. Ein neuer Datensatz erfordert erneute Definitions-/Versionsprüfung.

Die Lernansicht zeigt vier Merkmalskarten, Rohwerte und Lücken. Die Gemeinschaft kann weiterhin zusammengestellt werden. Score-basierte Duelle sind pausiert, bis eine explizite Umrechnung in Spielregeln definiert ist; Meter dürfen nicht versehentlich als Punkte laufen. Historische Koeffizienten liegen ausschließlich in klar gekennzeichneten synthetischen Test-Fixtures für den alten Regelkern. Das bestehende Regelwerk bleibt in der Git-Historie nachvollziehbar.

Nächster Schritt: artspezifische Primärdaten für Tritt, Dürrephysiologie, Samenproduktion, RGR und die getrennten chemischen Merkmale ergänzen. Erst danach eine versionierte, quellengebundene Umrechnung Rohwert → Spielregel entwerfen. Es gibt jetzt kein Balancing, das wissenschaftliche Werte verändert.

## Physiologische Widerstandsfähigkeit: Hitze, Kälte, Schatten

Messbar, aber testabhängig. Hitze: PSII-T50 (°C, 50 % Verlust im angegebenen Fluoreszenztest), nicht pauschal Pflanzentod. Frost: EL-LT50 (°C, 50 % Elektrolytaustritt nach definierter Normierung; kein pauschales Pflanzentod-Kriterium). Nichtfrierende Kälte separat erfassen. Schatten: Blatt-Lichtkompensationspunkt (µmol Photonen m⁻² s⁻¹) sowie Wachstum/Überleben unter definierter Beleuchtung; Blatt-CO₂-Bilanz ist kein Gesamtpflanzen-Überlebenstest. Vollständige Dunkelheit benötigt einen eigenen Überlebens- und Erholungstest mit festgelegten Bedingungen.

Methodenreferenzen: [Standardisierung von EL-Kältegrenzen](https://pmc.ncbi.nlm.nih.gov/articles/PMC8140579/); [Pérez-Harguindeguy et al. (2013), standardisiertes Trait-Handbuch](https://doi.org/10.1071/BT12225); [PSII-Hitzeschwellen](https://www.nature.com/articles/s41598-025-95623-5); [Messung von Lichtkompensationspunkten](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2023.1271341/full). Diese Referenzen belegen Methoden, **keine bereits importierten Messwerte unserer 14 Arten**. Die Datenstruktur enthält getrennte, leere Beobachtungsfelder, nicht aus Zeigerwerten erfundene Schwellen.

## Quellenmeldung für BIB

Pladias: artspezifischer Auszug und Nutzungsregeln geprüft; UNDERPLOT: offizieller iDiv-CSV-Datensatz v39 importiert, exakte Artenzuordnung und NA erhalten; BiolFlor: UFZ-Zugang und Registrierungsanforderung geprüft. Ertrag: nachvollziehbare Pflanzenansicht und präzisere Trennung zwischen Wissenschaft und Spiel. Quellenregister hier nicht direkt bearbeitet.

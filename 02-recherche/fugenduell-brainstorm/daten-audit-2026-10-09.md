# Fugenduell: Datenprüfung und nachvollziehbare Spielwerte

Stand: 09.10.2026. Prüfung der vorhandenen Recherche, kein neuer Dosenentwurf.

Die Quellenliste in `data-flora-quellen.md` ist ein guter Ausgangspunkt. `QUELLEN.md` kennzeichnet die importierten Brainstorms ausdrücklich als ungeprüft. `skill-tree.md` beschreibt mögliche Merkmalskombinationen und Gewichte; diese Entwurfsformeln belegen noch nicht die konkreten Zahlen im aktuellen Deck. Ein Datenbankname allein ersetzt keinen artspezifischen Datensatz.

## Was jetzt überprüft ist

| Quelle | Zweck | Stand und Grenze |
| --- | --- | --- |
| [Pladias](https://pladias.cz/en/taxon/data/Plantago%20major) | Höhe in m, Lebens-/Wuchsform, Blühmonate, leaf-trait CSR, ökologische Zeigerwerte | 11 exakt zugeordnete Taxa im lokalen Auszug; 10 mit 14 Merkmalen, Cochlearia mit 7. Tschechischer Florenkontext. |
| [UNDERPLOT beim iDiv](https://idata.idiv.de/ddm/data/Showdata/3610), DOI 10.25829/idiv.3610-56acy9 | Unterirdische Merkmale: maximale beobachtete Wurzeltiefe und laterale Ausdehnung, weitere Merkmale | Offizieller Datensatz gefunden; artspezifische Werte noch nicht importiert. Maximal beobachtet bedeutet nicht typische Tiefe einer Pflanze in einer Fuge. |
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

## Umsetzung in diesem Arbeitsstand

Die Ansicht „Pflanze ansehen“ zeigt verifizierte Merkmale mit Einheit, Kontext und Quellenlink. Die bisherigen sechs 0–10-Werte bleiben ausdrücklich manuell kuratierte Spielwerte; die bislang pauschale Behauptung einer empirischen Kalibrierung wird korrigiert.

Der Gemeinschaftsmodus nutzt drei Pflanzen, zwölf Aktionskarten und sechs Saisonrunden. Pfahlwurzel, dokumentierte Ausbreitung und Mauerstandort begründen ausgewählte Spezialeffekte. Die Bonusgröße (+2/+3/+4), Reserven und Flächenformeln sind transparente Spielentscheidungen. Importierte Pladias-Zeigerwerte ersetzen noch nicht die sechs Spielwerte.

Nächster Daten-Schritt: je Spielmerkmal tatsächliche Rohwerte importieren; Taxon, Einheit, Methode, Region, Quellenversion und Fehlwerte speichern. Danach eine versionierte Umrechnung Rohwert → Spielpunkt dokumentieren. Die Normalisierung braucht ein festes Vergleichskollektiv; Log-Min-Max und empirischer Perzentilrang sind unterschiedliche Verfahren. Das 36-Punkte-Budget ist Balancing und darf die wissenschaftliche Rohansicht nicht verändern.

## Quellenmeldung für BIB

Pladias: artspezifischer Auszug und Nutzungsregeln geprüft; UNDERPLOT: offizieller iDiv-Datensatz und DOI gefunden, noch kein Artenimport; BiolFlor: UFZ-Zugang und Registrierungsanforderung geprüft. Ertrag: nachvollziehbare Pflanzenansicht und präzisere Trennung zwischen Wissenschaft und Spiel. Quellenregister hier nicht direkt bearbeitet.

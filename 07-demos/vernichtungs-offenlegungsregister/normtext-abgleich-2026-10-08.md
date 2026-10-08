# Normtext-Abgleich / Legal-text check — 08.10.2026

Die bisherige Schnipselbasis wurde für diese Nachprüfung durch gelesene Primärtexte und eine visuell geprüfte reale Offenlegung ergänzt. Das bestätigt keinen vollständigen Marktüberblick und ersetzt keine Prüfung der individuellen Offenlegungspflicht. Die Bewertung vom 28.09.2026 bleibt 24/35.

## Quellen und Zugangsweg

- [DVO (EU) 2026/2](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R0002): Art. 1–7 und Anhänge I–III im EUR-Lex-TXT gelesen. Die ELI-Ansicht lieferte eine Bot-Abfrage.
- [ESPR, VO (EU) 2024/1781](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R1781): Art. 24–26 in der deutschen TXT-Ansicht gelesen; die englische Ansicht war nicht erreichbar.
- [Delegierte VO (EU) 2026/296](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32026R0296): Ausnahmen vom Vernichtungsverbot. Sie ist keine allgemeine Liste zulässiger Offenlegungsgründe. Der Prüfer entscheidet nicht über die Anwendbarkeit einer Ausnahme.
- [Signify GJ 2025](https://www.assets.signify.com/is/content/Signify/Assets/signify/global/20260504-signify-espr-disclosure.pdf): zwei Seiten gelesen und visuell geprüft. Die Publikation nennt April 2026; `20260504` im Dateinamen ist kein Nachweis des Veröffentlichungsdatums. SHA-256, Originalwerte und Seitenbelege: [Provenienz](data/signify-2025-provenienz.json).

## Änderungen gegenüber dem vorläufigen Modell

| Gegenstand | Gelesene Grundlage | Konsequenz für die Übertragung |
|---|---|---|
| Entsorgung / Vernichtung | ESPR Art. 24; DVO Anhang I | Entsorgung umfasst auch Vorbereitung zur Wiederverwendung. Nicht jede entsorgte Menge ist eine Vernichtungsmenge. |
| Produktkategorie | DVO Art. 3, Anhang II | Grundsätzlich zwei KN-Ziffern; vier für die dort aufgelisteten Positionen. Ein pauschales Achtstellengebot war falsch. Ohne ausreichende Produktbeschreibung kann eine Zweistellenkategorie eine Rückfrage auslösen, aber kein Rechtsurteil. |
| Gründe | ESPR Art. 24 Abs. 1 lit. b; Anhang I Fußnote 8 | Offene Gründe; einschlägige Ausnahme nur, soweit geltend gemacht/anwendbar. Keine allgemeine Ausnahmewhitelist. Unterschiedliche Gründe benötigen getrennte Zeilen. |
| Mengen | Anhang I Fußnoten 6–7 | Stück und kg; Schätzung je Mengenfeld mit Kennzeichnung. Unbekannte Ermittlungsmethode bleibt unbekannt. Die Ausgabevorgabe ganzer Zahlen berechtigt nicht zur Änderung historischer Originalwerte. |
| Behandlungswege | Anhang I, Fußnote zu Behandlungswegen | Fünf Komponenten: Vorbereitung zur Wiederverwendung, Recycling, sonstige Verwertung, Beseitigung, unbekannt. Anteile beziehen sich auf Gewicht. |
| Vernichtungssumme | Dieselbe Fußnote | Recycling + sonstige Verwertung + Beseitigung als separate Teilsumme; nie zusätzlich in die 100-%-Summe zählen. |
| Verpackung und Prävention | Anhang I Abschnitt 2, Fußnoten 9–10 | Verpackungsgewicht enthalten ja/nein sowie getroffene und geplante Maßnahmen erfassen. |
| Kopf und Zeitraum | Anhang I Abschnitt 2, Fußnoten 1–3 | Rechtsträgerkennung und Kennungsart, Einzel-/konsolidierte Offenlegung, ggf. einbezogene Unternehmen, Beginn und Ende des GJ. Nicht belegte Angaben bleiben unbekannt. |
| Zeitliche Grenze | DVO Art. 1 und 7 | Anwendung ab 02.03.2027, erstes volles GJ danach, Veröffentlichung binnen zwölf Monaten. Für Kalender-GJ folgt daraus erstmals 2028, Veröffentlichung bis Ende 2029. Nicht rückwirkend auf Signify 2025 anwenden. |

Das aktuelle Modell führt genau einen KN-Code je Position. Mehrfach-Codes für Sets nach Anhang I Fußnote 6 sind noch nicht vollständig abgebildet und benötigen manuelle Dokumentation; keine Vollständigkeitsbehauptung für sämtliche Formularkonstellationen.

Die Toleranz bei gerundeten Prozenten und grobe Stück-/Gewichts-Spannen sind technische Übertragungshilfen, keine gesetzliche Freigrenze und keine sachverständige Bewertung. Ob Zahlen vollständig oder richtig sind, lässt sich aus einer veröffentlichten Tabelle allein nicht feststellen.

## Reale Fixture und Grenze der Aussage

Die sechs Signify-Zeilen erhalten ihre Dezimalgewichte, freien Gründe, Verpackungsangaben und alle Behandlungswerte. Eine fehlende Schätzmarkierung wird nicht in „gemessen“ umgedeutet. Die Quelle nennt jeweils 100 % Beseitigung und in einer separaten Spalte 0 % Vernichtung. Eine Rückfrage dokumentiert diese Übertragungs-/Begriffsfrage; sie behauptet weder einen Verstoß noch die Anwendbarkeit des späteren Pflichtformats. Die Originalpublikation bleibt maßgeblich.

**Wichtige Korrektur zur Vorarbeit:** ESPR Art. 26 verlangt von der Kommission konsolidierte Informationen bis 19.07.2027 und danach alle 36 Monate. Die frühere Behauptung eines fehlenden Sammelanreizes war deshalb zu weitgehend. Das ist kein Nachweis eines heute vorhandenen vollständigen Einzelfallregisters. Vor einem größeren Registerpilot ist der Stand dieser Kommissionsveröffentlichung erneut zu prüfen.

## English handoff

The legal-text check replaces the provisional eight-digit CN requirement, closed reason list and duplicated treatment categories. Treatment shares use weight; destruction is a separate subtotal. Estimated unit counts and weights remain separate, and missing source facts remain unknown. The six-row Signify fixture preserves published decimals and the disposal/destruction discrepancy. Historical mode does not apply the future mandatory format retrospectively. Findings remain questions, without a company compliance verdict. Article 26 also requires future Commission consolidation; novelty was not re-audited in this round.

**Nächster Schritt / Next step:** [Ticket 03: kuratierter Pilot](ticket-03-kuratierter-pilot.md). Ein weiteres unabhängiges Quelldokument, nachvollziehbare Auswahl und bestätigter Empfängerbedarf stehen aus. Keine Zustellung in dieser Runde.

[Die Dose / The Dose](https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister)

Lizenz: CC0 1.0 Public Domain. Eigene Zusammenfassung; die verlinkten Originaldokumente sind nicht Teil dieser Lizenzzusage.

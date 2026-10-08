# Datengrundlage

`synthetische-offenlegungen.json` enthält ausschließlich erfundene Testfälle.

`reale-offenlegungen.json` enthält die erste echte Engine-Fixture im historischen
Prüfmodus. `signify-2025-provenienz.json` dokumentiert ihre Datenübertragung:
Signify N.V., Geschäftsjahr 2025. Die sechs Tabellenzeilen stammen von Seite 2
[dieser veröffentlichten Offenlegung](https://www.assets.signify.com/is/content/Signify/Assets/signify/global/20260504-signify-espr-disclosure.pdf).
Die [Nachhaltigkeitsseite des Unternehmens](https://www.signify.com/global/sustainability)
führt die Offenlegung auf. Abruf und manuelle Sichtprüfung beider PDF-Seiten:
2026-10-08. Der SHA-256 des abgerufenen PDFs steht in der Provenienzdatei.
Die Quelle nennt April 2026 als Veröffentlichungsmonat; aus dem Dateinamen wird
kein genaueres Veröffentlichungsdatum abgeleitet.

Das PDF und Seitenbilder verbleiben außerhalb des Repositorys. Die JSON-Dateien
enthalten übertragene Fakten, kurze Originalwerte und eigene deutsche
Zusammenfassungen. Firmenlogo und längere Originaltexte werden nicht übernommen.
Die CC0-Freigabe dieses Projekts umfasst nicht das verlinkte Originaldokument.

## Übertragungsregeln

- Die Reihenfolge der sechs Zeilen bleibt erhalten. Seiten- und Zeilennummern
  erlauben den Abgleich; Seite 1 liefert Zeitraum, Umfang und Prävention.
- Stückzahlen verwenden in der Quelle Punkte als Tausendertrennzeichen;
  Gewichte verwenden Dezimalkommas und gegebenenfalls Tausenderpunkte.
  `157.922` wird zu 157922 Stück, `136.302,11` zu 136302.11 kg.
  Die Original-Zahlzeichenfolgen bleiben zum Abgleich erhalten. Es findet keine
  Einheitenumrechnung statt: die Quelle gibt bereits Kilogramm an.
- Die Originalkategorien `39`, `85`, `8517`, `8539`, `94`, `48` werden nicht zu
  achtstelligen Codes ergänzt. Deutsche Warengruppen sind knappe eigene
  Beschreibungen, keine amtliche Übersetzung der vollständigen KN-Bezeichnung.
- Verpackung wird je Zeile als nicht enthalten angegeben. Das sagt nichts über
  eine separate Verpackungsentsorgung aus.
- Alle sechs Zeilen nennen fehlende Nachfrage als Grund. Sie enthalten keine
  Aussage darüber, ob eine Ausnahme vom Vernichtungsverbot greift.
- Die Quelle nennt je Zeile 100 % Beseitigung sowie jeweils 0 % für Vorbereitung
  zur Wiederverwendung, Recycling, sonstige Verwertung, Vernichtung und unbekannte
  Behandlung. Diese Angaben bleiben unverändert. Der separate Vernichtungswert
  ist kein zusätzlicher Behandlungsweg und wird nicht zur Behandlungssumme addiert.
  Die Kombination aus Beseitigung 100 % und Vernichtung 0 % wird zur menschlichen
  Klärung vorgelegt, nicht rechnerisch korrigiert.
- Eine Mess- oder Schätzmethode für die Mengen wird nicht genannt. Die Übertragung
  kennzeichnet die Methode als unbekannt; sie behauptet keine gemessenen Mengen.
- Keine Gesamtsumme wird als zusätzliche Tabellenzeile erfunden. Die Quelle
  liefert keine Erklärung für die gleichzeitigen Kategorien 85/8517/8539;
  daraus wird weder eine Hierarchie noch eine Doppelzählung abgeleitet.

Die Fixture ist ein belegter Übertragungsfall, kein Nachweis rechtlicher
Vollständigkeit, Anwendbarkeit einer Pflicht oder korrekter Abfallbehandlung.

# Glasanflug-Ampel

**Ein Satz:** Foto einer Glasfassade oder Balkonbrüstung hochladen, Standort und Reflexion angeben → automatische Berechnung des offiziellen LAG-VSW-Vogelschlag-Risikowertes (0–100) mit druckbarem Prüfnachweis für Bauanträge.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Länderarbeitsgemeinschaft der Vogelschutzwarten (LAG VSW, vogelschutzwarten.de) · nachrangig: NABU Bundesfachausschuss Vogelschutz, BUND Bundesarbeitskreis Naturschutz, Bund Deutscher Architekten (BDA)
**Verdikt:** 🎁 verschenken

---

## Das Problem

Über 100 Millionen Vögel verenden jährlich allein in Deutschland durch Kollisionen mit Glasfassaden, Glasbrüstungen, Lärmschutzwänden und Wintergärten. Nach Bundesnaturschutzgesetz (§ 44 Abs. 1 Nr. 1 BNatSchG) gilt das Tötungsverbot auch für Bauwerke mit vorhersehbarem Kollisionsrisiko.

Die Länderarbeitsgemeinschaft der Vogelschutzwarten (LAG VSW) hat mit dem 20-seitigen Bewertungsleitfaden 21/01 ein präzises, mathematisches Punktesystem definiert: Abhängig von Glasart (Außenreflexionsgrad), Umgebungsvegetation (Distanz spiegelnder Bäume), Durchsichtskorridoren und geprüftem Markierungsraster (z. B. 9×9 cm Punktraster oder 5 mm Streifen) errechnet sich ein Gefährdungswert.

Das Problem: Das Verfahren existiert ausschließlich als 20-seitiges PDF-Dokument. Architekten, Glasereien und kommunale Bauämter rechnen Werte entweder mühsam von Hand nach oder greifen zu unwirksamen Greifvogel-Silhouetten-Aufklebern, die Vögel schlicht umfliegen. Es existiert kein einziges frei zugängliches digitales Rechenwerkzeug im Web.

## Warum das jetzt geht

1. **Deterministische LAG-VSW-Punkteformel im Browser:** Das Berechnungsverfahren benötigt keinen Server und keine teure API — es lässt sich als clientseitige Web-App mit sofortigem Feedback ausführen.
2. **Lokale Bildanalyse (Computer Vision):** Canvas- und On-Device-Analysen können Reflexionskontraste und Umgebungsgrün direkt aus zwei Smartphone-Fotos grob vorsegmentieren.
3. **Kommunaler regulatorischer Druck:** Immer mehr Bundesländer und Städte (u. a. Berlin, Hamburg, München, Zürich) fordern im Rahmen der Baugenehmigung explizite Vogelschutz-Nachweise nach dem Standard der Vogelschutzwarten.

## Skizze

- Web-App (Desktop & Smartphone, ohne Registrierung):
  - Eingabe: 3–4 Parameter (Glasreflexionsgrad, Vegetationsabstand, Durchsicht ja/nein, Markierungsmethode auf Außenseite).
  - Interaktive Fassadensimulation: Visuelle Umschaltung zwischen menschlicher Wahrnehmung und Vogel-Perspektive (die spiegelnde Bäume als offenen Flugraum missversteht).
  - Ampel-Ergebnis: Punktwert 0–100 (Grün <25, Gelb 25–50, Rot >50) mit sofortiger Rechtsbelehrung nach § 44 BNatSchG.
  - PDF-Export: Geprüfter Prüfbericht mit wörtlichen Normzitaten für den Anhang des Bauantrags.

## Erster Schritt

**Ticket: 4 Schieberegler + Ampelbewertung nach LAG VSW 21/01**

Fertig, wenn für drei Testfassaden (Standard-Floatglas mit Baumspiegelung, verspiegeltes Sonnenschutzglas mit Eckdurchsicht, Floatglas mit 9×9cm Punktraster) der berechnete Punktwert auf ±3 Punkte mit der Handrechnung des offiziellen PDF-Prüfbogens übereinstimmt.

## Wo es kippt

**Scheinsicherheit durch falsche Messungen:** Wenn ein Nutzer einen schlechten Markierungsabstand einträgt und das Tool fälschlich „Grün" ausgibt, sterben weiterhin Vögel. Gegenmaßnahme: Konservative Worst-Case-Berechnung, unmissverständliche Warnung bei unwirksamen Silhouetten-Stickern und klarer Vermerk, dass die Einstufung den LAG-VSW-Richtlinien folgt, aber kein biologisches Gutachten am Einzelbauwerk ersetzt.

## Wer es schon versucht hat

- **Leitfaden LAG VSW 21/01:** Offizieller Standard in Deutschland und Österreich, aber nur als PDF/Druckblatt verfügbar.
- **Schweizerische Vogelwarte Sempach:** Umfangreiche Broschüren und Labortests im Flugkanal („Tunnel-Tests"), jedoch keine interaktive Planungs-App.
- **Glashersteller-Datenblätter:** Weisen Lichttransmissions- und Reflexionswerte (g-Wert, Tv, R_ext) aus, übersetzen diese aber nicht in baurechtliche Vogelschutz-Klassen.

## Vorarbeit

- Richtlinie der Länderarbeitsgemeinschaft der Vogelschutzwarten (LAG VSW): „Vogelschlag an Glas", Berichte zum Vogelschutz.
- Broschüre „Vogelfreundliches Bauen mit Glas und Licht" (Schweizerische Vogelwarte Sempach, Schmid et al.).
- NABU Bundesfachausschuss Vogelschutz: Merkblatt Vogelschutz an Glas.

---
Diese Idee gehört niemandem. Nimm sie, bau sie, verschenke sie.
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

# Kiez-Lärmkarte

**Ein Satz:** Nicht wie laut eine Straße im Jahresmittel ist, sondern **wann sie leise ist** — gemessen von Handys, die nur dB-Pegel erfassen und nie Audio.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Noise-Planet / NoiseCapture (Université Gustave Eiffel + CNRS) · parallel: CityLAB Berlin · nachrangig: Prototype Fund, Anwohnerinitiativen
**Verdikt:** 🎁 verschenken — Rang 2 (Forschung) und Rang 1 (CityLAB)

---

## Das Problem

Der Berliner Lärmaktionsplan 2024–2029 arbeitet mit strategischen Lärmkarten: modellierte Jahresmittelwerte, Pegelklassen, Betroffenenzahlen. Das ist für Planung richtig und für Menschen unbrauchbar.

Menschen stellen eine andere Frage. Nicht „wie hoch ist der L<sub>den</sub> dieser Straße", sondern:

- **„Kann ich hier schlafen?"** — bei der Wohnungsbesichtigung, nachmittags um drei, wenn die Kneipe unten noch zu hat.
- **„Wann kann ich mit offenem Fenster arbeiten?"** — die Ruhe-Fenster im Tagesverlauf.
- **„Ist das hier wirklich so schlimm, wie ich denke?"** — für die Beschwerde, die ohne Messwerte nur eine Meinung ist.

Ein Jahresmittelwert beantwortet keine davon, weil er die Zeitstruktur wegmittelt — und die Zeitstruktur *ist* die Information.

## Warum das jetzt geht

1. **On-device-Aggregation.** Der entscheidende Punkt: Das Handy misst den Schalldruckpegel und wirft das Audiosignal sofort weg. Was den Server erreicht, sind Pegelwerte pro Zeitfenster, nie Ton. Das war früher eine Vertrauensfrage; heute ist es eine Architekturfrage, die man nachvollziehbar offenlegen kann.
2. **Kalibrierung ist lösbar geworden.** Handymikrofone streuen stark. Aber mit genug Überlappung an denselben Orten lässt sich relativ kalibrieren — man braucht keine absoluten dB(A) für die Frage „wann ist es hier ruhiger als sonst".
3. **Der Vergleichsmaßstab existiert.** Die amtlichen strategischen Lärmkarten liegen vor. Gemessene Daten müssen nicht für sich stehen, sie können gegen ein Modell geprüft werden — das macht sie erst belastbar.

## Skizze

- Messung: dB-Pegel in Zeitfenstern, Standort grob, **kein Audio wird gespeichert oder übertragen**, Aggregation lokal vor dem Upload.
- Auswertung: pro Straßenabschnitt ein **Tagesprofil** statt einer Zahl — „hier ist es werktags zwischen 10 und 15 Uhr am ruhigsten, freitagnachts nie".
- Darstellung: Karte mit Zeitregler. Die Frage „wann", nicht „wie viel", steuert das Interface.
- Abgleich mit den amtlichen Modellkarten als Plausibilitätsprüfung, nicht als Konkurrenz.

**Nicht dabei:** keine Beschwerde-Funktion, keine Nachbarschaftsdenunziation, keine Einzelereignis-Aufnahme. Wer Tonaufnahmen will, baut ein anderes und schlechteres Produkt.

## Erster Schritt

**Ticket: Ein Straßenabschnitt, eine Woche, ein Tagesprofil.**

Messung auf einem Gerät, Pegel in Fünf-Minuten-Fenstern, eine Woche lang, Ausgabe als Tagesprofil mit Wochentagsunterschied.

**Fertig, wenn:** das Profil den Feierabendverkehr und die Wochenendnacht sichtbar macht, und zwei Geräte nebeneinander auf 3 dB übereinstimmen.

## Wo es kippt

**Privacy ist hier keine Eigenschaft, sondern die Existenzbedingung.** In dem Moment, in dem irgendwo Audio gespeichert wird — auch nur für Klassifikation, auch nur kurz — ist das Projekt tot und sollte es sein. Die Architektur muss so gebaut sein, dass es technisch nicht geht, nicht nur regelpolitisch verboten ist.

**Zweites Risiko:** Kalibrierung. Wenn Nutzer:innen absolute dB-Werte sehen und diese für amtlich halten, entstehen falsche Beschwerden und Enttäuschung. Deshalb: relative Aussagen („ruhiger als sonst hier"), keine amtlich aussehenden Zahlen.

**Drittes Risiko:** Dichte. Eine Karte mit drei Messpunkten ist Dekoration. Deshalb ist eine bestehende Community (NoiseCapture) der bessere Träger als ein Neustart.

## Wer es schon versucht hat

**NoiseCapture** (Université Gustave Eiffel + CNRS, Open Source) betreibt seit Jahren weltweite Crowdsourcing-Lärmmessung mit genau dieser Architektur — das ist der Grund, warum sie Empfänger sind und nicht Konkurrenz. **Was dort fehlt, ist die Fragestellung:** Die Karten zeigen gemessene Pegel, nicht Ruhe-Fenster. Dieselben Sensoren, andere Auswertung, anderes Interface.

Der Berliner **Lärmaktionsplan 2024–2029** läuft in der Umsetzung; gemessene Zeitprofile sind dazu komplementär, nicht konkurrierend.

## Vorarbeit

- **NoiseCapture / Noise-Planet** — App, Methodik, Datenbestand, alles offen.
- **Strategische Lärmkarten Berlin** und der **Lärmaktionsplan 2024–2029** — der amtliche Vergleichsmaßstab.
- **CityLAB Berlin** — für die Berliner Variante und den Zugang in die Verwaltung.
- **Prototype Fund** — ab 1. Oktober.

**Hinweis zur defensiven Publikation:** Messverfahren sind patentierbar. Für diese Dose lohnt sich TDCommons, bevor sie breit verteilt wird.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

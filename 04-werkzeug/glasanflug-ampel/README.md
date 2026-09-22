# Glasanflug-Ampel — Skelett

Das Bewertungsschema der Länderarbeitsgemeinschaft der Vogelschutzwarten, ausführbar.
Mehr nicht, und das mit Absicht.

**Quelle:** LAG VSW Beschluss 21/01, aktualisiert 2023 (ersetzt 19/01), „Vermeidung von
Vogelverlusten an Glasscheiben — Bewertung des Vogelschlagrisikos an Glas", Stand
13.11.2023. Im Auftrag der LANA erarbeitet und von dieser den Bundesländern zur
Anwendung empfohlen. Tab. 3 (Kriterien) und Tab. 4 (Risikostufen).

## Was drin ist

| Datei | Inhalt |
|---|---|
| `schema-lagvsw-21-01.yaml` | Die vier Kriterien mit Punktwerten 1–4, im Wortlaut des Beschlusses, dazu die Risikostufen, die acht Anwendungsgrundsätze und die Schwellenwerte der drei Gebäudekategorien. |
| `ampel.py` | Eine reine Funktion `bewerte(...)`: Punkte rein, Risikostufe mit Begründung raus. Dazu `signifikanzschwelle(...)` für Monitoringergebnisse und `als_blatt(...)` für die lesbare Ausgabe. |
| `test_ampel.py` | Alle elf durchgerechneten Beispiele aus dem Anhang des Beschlusses, plus die Münchner Felddaten für die Schwellenwerte, beide Vorrangregeln und der vom Beschluss ungeregelte Regelkonflikt. |

Keine Bilderkennung, keine Geodaten, keine Datenbank, kein Webserver. Das ist der Punkt:
Bevor irgendetwas geschätzt wird, muss das Schema korrekt rechnen.

## Die vier Kriterien

1. **Anteil der frei sichtbaren Glasfläche ohne Markierung** — < 25 % / 25–50 % / 51–75 % / > 75 %
2. **Fassadengestaltung** — Lochfassade ≤ 1,5 m² / 1,5–3 m² / zusammenhängend > 3–6 m² / > 6 m²
3. **Umgebung** — dichte Bebauung / durchgrünt / Ortsrand / < 50 m zu naturnahen Flächen
4. **Abstand unmarkierter Scheiben zu Gehölzen** — > 50 m / 31–50 m / 15–30 m / < 15 m

Summe 4–16 → **4–6 gering · 7–10 mittel · 11–16 hoch**.

Dazu zwei Vorrangregeln, die die Summe überstimmen:

- Glasanteil = 4 (über 75 %, freistehende Glaswand, transparente Durchsicht oder
  Reflexionsgrad über 30 %) → **immer „hoch"**. Fußnote 2 lässt begründete Ausnahmen zu,
  etwa eine Spiegelfassade ohne Vegetation im Spiegelbild; dafür gibt es das Argument
  `fussnote_2_ausnahme`, das eine Begründung verlangt.
- Fassadengestaltung = 1 (Lochfassade bis 1,5 m², Bandfassade unter 1 m, oder wirksam
  markiertes, strukturiertes, mattiertes Glas) → **immer „gering"**.

Treffen beide zu, entscheidet der Rechner **nicht**: Er meldet einen Regelkonflikt,
stuft nach Punktsumme ein und überlässt den Fall einem Menschen. Der Beschluss regelt
diesen Fall nicht, also darf Software ihn nicht stillschweigend erfinden.

## Benutzen

```python
from ampel import Kriteriumswert, als_blatt, bewerte

b = bewerte(
    Kriteriumswert(2, "bild", "Glasanteil aus Fassadenfoto geschätzt"),
    Kriteriumswert(4, "eingabe"),
    Kriteriumswert(4, "geodaten", "Versiegelung aus OSM-Landnutzung"),
    Kriteriumswert(3, "geodaten", "Baumkataster, nächstes Gehölz 22 m"),
)
print(als_blatt(b))
```

Jeder Wert trägt seine **Herkunft** mit: `eingabe`, `bild`, `geodaten` oder `unbestimmt`.
Ein unbestimmtes Kriterium führt nicht zu einer geschätzten Zahl, sondern zu **keiner
Einstufung** — mit der Angabe, was fehlt. Das ist die wichtigste Eigenschaft dieses
Skeletts: Es rät nicht.

## Was beim Nachrechnen auffiel

Der Anhang des Beschlusses rechnet elf reale Gebäude durch. Zehn stimmen. Beim elften
(Berlin, Forschungszentrum) stehen die Gebäudefaktoren 3 und 3 und darunter „Summe 7";
3 + 3 sind 6, der Gesamtwert wäre 12 statt 13. Die Risikostufe ändert sich dadurch nicht
— beide liegen in „hoch". Der Fall steht als eigener Test drin, weil er genau zeigt,
wofür ein Rechner gut ist: Handarbeit an einem Punkteschema erzeugt still Rechenfehler.

## Grenzen

- Das Schema **prognostiziert keine Todeszahlen.** Es ordnet Situationen.
- Der **Reflexionsgrad** bleibt außer stark spiegelndem Glas bewusst unberücksichtigt;
  der Beschluss sagt dazu, es lägen „noch keine geeigneten Einstufungskriterien" vor.
- Die Schwellenwerte (2 bzw. ab 5 Schlagopfer je 100 m Fassade und Jahr) gelten für
  **Bestandsbauten mit Monitoring**, nicht als Prognose und nicht als Ersatz für das
  Punkteschema. Fundraten sind vorher um Abräumung und Sucheffizienz zu korrigieren.
- Das Schema gehört der LAG VSW. Diese Datei bildet es ab; sie legt es nicht aus.
  Weicht sie ab, gilt der Beschluss.

## Installieren und testen

Eine Laufzeitabhängigkeit (PyYAML), eine Testabhängigkeit (pytest):

```
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python3 -m pytest test_ampel.py -q
```

Ohne venv geht auch `pip install --user -r requirements.txt`; auf Debian/Ubuntu
verlangt ein systemweites `pip` zusätzlich `--break-system-packages`.

26 Tests. Alle elf durchgerechneten Beispiele aus dem Anhang sind abgedeckt — neun als Parametersatz, zwei (Fußnote-2-Fall ohne Vegetation im Spiegelbild, Rechenfehler beim Forschungszentrum) als eigene Tests, weil sie je eine Besonderheit festhalten.

## Lizenz

CC0 / Public Domain — Félix, Berlin. Damit auch in GPL-Projekten verwendbar, etwa im
Vogelschlagmelder (`codeberg.org/nabu-jena/Vogelschlagmelder`, GPLv3).
Die zitierten Wortlaute stammen aus dem Beschluss der LAG VSW und gehören dieser.

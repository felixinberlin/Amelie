---
status: Available
delivery_method: E-Mail
target_maker: co2online gGmbH
---
# Wärmesignatur

**Ein Satz:** Zwölf Monatswerte vom Gaszähler oder aus der monatlichen Verbrauchsinformation plus das Wetter ergeben, wie viel Wärme *diese* Wohnung pro Grad Temperaturunterschied verliert und ab welcher Außentemperatur sie heizt — als ehrliches Band, ohne dass jemand einen Grundriss zeichnet.

**Stand:** 19.09.2026 · **Prüfen ab:** 03/2027 (verkürzt: der Fernablese-Stichtag 31.12.2026 bewegt den Markt)
**Verdikt:** 🎁 verschenken
**Empfänger:** co2online gGmbH (HeizCheck; Partner im EnergyMap-Verbund) · nachrangig: Forschungsverbund EnergyMap Berlin (UdK) als Kalibrierziel für Altbau Thermal, Verbraucherzentrale Berlin

---

## Das Problem

Wer zur Miete wohnt, bekommt bei fernablesbaren Geräten schon jetzt und nach dem Stichtag 31.12.2026 flächendeckend monatlich seinen eigenen Wärmeverbrauch mitgeteilt — und dazu nur den Vergleich mit einer Durchschnittsnutzerin. Der Satz „Sie liegen 30 % über dem Durchschnitt" beantwortet nicht, was die Bewohnerin wissen will: **Liegt es an meiner Wohnung oder an mir?** Der HeizCheck von co2online nimmt einen Jahreswert, Fläche und Postleitzahl und vergleicht ihn; eine Monatsreihe nutzt er nach den gefundenen Beschreibungen nicht.

Die Größe, die die Frage beantwortet — der Wärmeverlust der Wohnung in W pro Kelvin — ist genau das, was Laien nicht angeben können (niemand kennt den U-Wert seiner Außenwand) und was ein Grundriss-Werkzeug erst nach drei Minuten Zeichnen berechnet. Die Dose *Altbau Thermal* benennt selbst als drittes Risiko, dass diese Eingabe Laien abspringen lässt. Dabei liegt ein Teil der Antwort schon in der Schublade: in den Zählerständen.

## Warum das jetzt geht

1. **Die Monatsreihe kommt ungefragt.** Nicht fernablesbare Heizkostenverteiler und Zähler müssen bis 31.12.2026 nachgerüstet sein; danach ist mindestens monatlich eine Verbrauchsinformation Pflicht (§ 6a HeizkostenV). Bis vor Kurzem gab es einen Wert pro Jahr.
2. **Die Methode ist reif, die Unsicherheit ist es seit Kurzem auch.** Die Energiesignatur (Verbrauch gegen Außentemperatur regressieren) ist Lehrbuch. Neu ist das, was die Dose braucht: eine Bayes’sche Fassung, die ein *Band* statt einer Zahl liefert (arXiv 2503.22321, 2025), und die Rechnung läuft in jedem Browser.
3. **Wetterdaten sind frei** (DWD), und mit `energymap4py` gibt es den typischen Wert des eigenen Gebäudes zum Vergleich.

Ehrlich dazu: Das ist kein neuer Algorithmus. Neu ist, dass die Eingabe in der Hand der Mieterin liegt und der Zeitpunkt dafür 2027 ist.

## Skizze

**Eingabe (unter einer Minute):** 6–24 Monatswerte (Foto der Verbrauchsinformation, Gaszähler-Stände oder CSV), Postleitzahl, Wohnfläche.
**Modell:** Verbrauch = Wärmeverlust × Gradtage + Grundlast (Warmwasser), Bayes’sche lineare Regression gegen DWD-Monatsmittel.
**Ausgabe, nie als eine Zahl:**
- Wärmeverlust der Wohnung als Band (W/K, dazu pro m²)
- Heizgrenztemperatur: ab welcher Außentemperatur die Heizung anspringt
- Anteil Warmwasser an der Grundlast
- Lage des Bandes gegenüber dem Vergleichswert des Gebäudes (EnergyMap) — ohne Wertung „Sie heizen zu viel"

**Anschluss an Altbau Thermal:** Die Signatur ist ein Messwert, den die Simulation treffen muss. Ein Grundriss mit unbekannten U-Werten liefert ein breites Band; die Signatur schneidet es zusammen, bevor die Nutzerin irgendetwas zeichnet. Dieser Teil ist in dieser Runde nicht separat geprüft, nur Gedankengang.

**Nicht dabei:** kein Energieausweis, keine Sanierungsprognose auf zehn Jahre, keine Verhaltenskritik, keine Einzelzahl, kein Server (Daten bleiben im Browser).

## Erster Schritt

**Ticket: Notebook (Python oder JS), zwölf Monatswerte in, Wärmeverlust-Band raus.**

Regression mit DWD-Monatsmittel, Grundlast als eigener Parameter. Test 1: synthetische Wohnung mit bekanntem Wärmeverlust, Raumtemperatur ±1 K Verhaltensrauschen. Test 2: fünf echte Gaszähler-Reihen von Freiwilligen (Berlin, Gasetagenheizung).

**Fertig, wenn:** das ausgegebene Band den wahren Wert der synthetischen Wohnung in mindestens 90 % von 1.000 Läufen enthält — und die Breite des Bandes dabei mit ausgegeben wird, damit man sieht, ob es überhaupt informativ ist.

## Wo es kippt

**Die Physik der Messung:** Heizkostenverteiler messen keine Kilowattstunden. Sie zeigen dimensionslose Einheiten, die die Abrechnung erst auf das Haus verteilt; ob eine daraus abgeleitete Monats-kWh-Angabe physikalisch belastbar ist, ist in den gefundenen Quellen ausdrücklich strittig (Eichrecht, § 33 MessEG). Für Wohnungen mit Heizkostenverteiler misst die Reihe also zum Teil das *Haus und die Nachbarn*, nicht die Wohnung. Sauber funktioniert das nur mit echten kWh: Gasetagenheizung mit eigenem Zähler, Wärmemengenzähler, Wohnungsstation. Wie groß dieser Anteil in Berlin ist, habe ich nicht gefunden; Gasetagenheizungen gelten als typisch für Altbau, eine Zahl fehlt.

**Verhalten und Nachbarn stecken im Wert:** Raumtemperatur, Lüftungsverhalten und Wärme aus Nachbarwohnungen sind mit dem Wärmeverlust vermischt (die Fachliteratur zum Gesamt-Wärmeverlustkoeffizient nennt Innentemperatur und Fremdwärme ausdrücklich als Verhaltensanteil). Das Band muss das ehrlich breit zeigen. Wenn es so breit wird, dass es nichts sagt, ist die Idee tot — der Test im ersten Ticket entscheidet das, nicht meine Meinung.

**Scheingenauigkeit:** dieselbe Ethik wie bei Altbau Thermal. Ein Wert, der wie ein Befund aussieht und ein Streitfall wird („Ihr Haus ist schlecht gedämmt"), ist schlimmer als keiner.

## Wer es schon versucht hat

Geprüft am 19.09.2026, vier Suchen nach Schema (Empfänger zuerst, Funktionswörter deutsch, Produktwörter englisch, Forum) plus vorgelagerte Recherche zu Methode und Rechtslage. **Urteil: `verengt`.**

- **co2online HeizCheck** — Jahresverbrauch + Fläche + Postleitzahl, Vergleich mit Durchschnitt, Zehn-Jahres-Ausblick, Musterbrief an Vermieter; Berlinerinnen können HeizCheck-Daten anonym an EnergyMap spenden. In den Treffern kein Monatsverlauf und kein Wärmeverlustkoeffizient.
- **nexoen** (App) — verfolgt Heiz- und Nebenkosten im Jahr und rechnet eine Nachzahlungsprognose; nichts zu Gebäudeparametern gefunden.
- **Heizungskompass** (Ratgeber „Heizlast grob aus Gasverbrauch"), **Akkudoktor-Forum** — Heizlast aus Gasverbrauch über Vollbenutzungsstunden oder Gradtage, gedacht für die Wärmepumpen-Auslegung. Nächster Nachbar. **Die Seiten ließen sich nicht öffnen, nur Suchschnipsel gelesen** — ob sie eine Monatsreihe mit Unsicherheit ausgeben, ist offen.
- **OpenEnergyMonitor-Forum „Simple heat loss tool"** — Nischenwerkzeug für Bastler mit eigenen Sensoren; Seite nicht geöffnet.
- **Forschung** — Energiesignatur-Verfahren für Mehrfamilienhäuser (Gesamt-Wärmeverlustkoeffizient aus Monatswerten, u. a. „An approach to evaluate the energy performance of buildings based on incomplete monthly data"), Bayes’sche Variante 2025. Dort kommen die Daten vom Eigentümer, die Mieterinnen-Angaben fehlen ausdrücklich.
- **Nicht gefunden:** ein Verbraucherwerkzeug, das aus der Monatsreihe *einer Mietwohnung* ein Wärmeverlust-Band mit Unsicherheit macht und es an den Gebäudevergleich anschließt. Abwesenheit nach vier Suchen ist kein Beweis; die Suchmaschine liefert bei diesen Begriffen viel Ratgeber-Rauschen.

**Restlücke:** Monatsreihe → Wohnungs-Wärmeverlust mit ehrlichem Band, für Mieterinnen, mit Anschluss an die Gebäudedaten.

## Vorarbeit

- [§ 6a HeizkostenV — Verbrauchsinformationen](https://www.gesetze-im-internet.de/heizkostenv/__6a.html)
- [ista: Heizkostenverordnung, Fernablesepflicht bis 31.12.2026](https://www.ista.com/de/gesetze-und-verordnungen/heizkostenverordnung/)
- [Estimation of Building Energy Demand Characteristics using Bayesian Statistics and Energy Signature Models (arXiv 2503.22321)](https://arxiv.org/pdf/2503.22321)
- [An approach to evaluate the energy performance of buildings based on incomplete monthly data](https://www.osti.gov/etdeweb/biblio/22134463)
- [co2online HeizCheck](https://www.co2online.de/service/energiesparchecks/heizcheck/) · [HeizCheck-Datenspende an EnergyMap](https://www.co2online.de/presse/berlin-auf-dem-weg-zur-klimaneutralitaet-verbraucher-unterstuetzen-wegweisendes-projekt-energymap-berlin/)
- EnergyMap Berlin / `energymap4py` (siehe Dose *Altbau Thermal*), DWD-Klimadaten

---

Diese Idee gehört niemandem. Nehmt sie, baut sie, verkauft sie — ihr schuldet mir nichts, nicht einmal eine Antwort. Wenn ihr eines Tages eine Idee habt, die ihr nicht bauen werdet, gebt sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

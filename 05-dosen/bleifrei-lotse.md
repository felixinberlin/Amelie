---
status: Available
delivery_method: E-Mail
target_maker: Verbraucherzentrale Bundesverband
review_score: 31/35
architecture_tier: Tier 1/2
source_type: Type A
---
# Bleifrei-Lotse

*(englisch: Lead-Free Navigator)*

**Ein Satz:** Zerstörungsfreie Vor-Ort-Rohrprüfung (Magnet-Check, Wulstlötungs-Makrofoto, Ritzprobe, akustische Klopfton-Resonanz) für Altbauten und automatische Erzeugung des rechtssicheren Mieter-Auskunftsersuchens sowie der Vollzugsanzeige an das Gesundheitsamt nach § 17 TrinkwV.

**Stand:** 25. September 2026 · **Prüfen ab:** September 2027  
**Empfänger:** **Verbraucherzentrale Bundesverband (vzbv)** · **Deutscher Mieterbund (DMB)** · **Gesundheitsamt Berlin-Mitte / Neukölln (Fachdienst Hygiene)**  
**Verdikt:** 🎁 **verschenken** — schließt eine akute bundesweite Vollzugslücke im Mieterschutz nach Ablauf der gesetzlichen Stilllegungsfrist.  
**Review:** 31/35 · Tier 1/2 · Type A (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Seit dem **12. Januar 2026** sind Bleileitungen in Trinkwasserinstallationen in Deutschland durch die novellierte Trinkwasserverordnung (§ 17 Abs. 2 TrinkwV) ausnahmslos **verboten und müssen dauerhaft stillgelegt oder ausgetauscht sein**. Das Nervengift Blei reichert sich im Körper an und schädigt insbesondere die Gehirnentwicklung von Ungeborenen, Säuglingen und Kleinkindern irreversibel.

Dennoch stehen Millionen Mieter in Altbauten (Baujahr vor 1973) vor einer massiven Informationsasymmetrie:
1. **Keine Sichtbarkeit:** Steigstränge und Kellerzuleitungen verlaufen hinter verschlossenen Kellertüren oder in Schächten. Vermieter informieren selten von sich aus oder bestreiten das Vorhandensein von Altinstallationen.
2. **Teure Hürde:** Ein zertifizierter Trinkwassertest im chemischen Labor (ICP-MS) kostet 80–150 € und misst nur Stagnationswerte an einem einzelnen Hahn, ohne Aufschluss über das Leitungsmaterial im Keller zu geben.
3. **Akute Vollzugslücke:** Kommunale Gesundheitsämter haben weder das Personal noch die Kapazitäten, private Wohngebäude proaktiv zu kontrollieren. Sie werden erst tätig, wenn konkrete, substantiierte Hinweise vorliegen.

## Warum das jetzt geht

1. **Zwingender Stichtag 12.01.2026:** Bis Januar 2026 galten Übergangsfristen; seit dem 12.01.2026 ist das Vorhandensein von Bleirohren ein bußgeldbewehrter Verstoß gegen die Trinkwasserverordnung.
2. **Web Audio Spektralanalyse (FFT im Browser):** Blei besitzt eine extrem hohe Dichte ($\rho \approx 11{,}34\ \text{g/cm}^3$) und eine außergewöhnlich hohe Eigendämpfung ($\eta \approx 0{,}015$). Ein leichter Schlag mit einem Schraubenzieher erzeugt ein dumpfes Geräusch mit extrem schneller Amplitudenabklingung ($< 50\ \text{ms}$), während Kupfer und Stahl mit minimaler Dämpfung hell nachklingen ($> 250\ \text{ms}$ bei $> 1\ \text{kHz}$). Das Web Audio API analysiert diesen Resonanzimpuls in Echtzeit ohne Cloud-Upload.
3. **Makro-Kamerainspektion:** Moderne Smartphone-Kameras erfassen die charakteristischen handgetriebenen Wulstlötnähte (*Wulstlötung*) an Muffen und den charakteristischen silbrigen Glanz frischer Ritzspuren unter der grauen Patina.
4. **Zero-Cloud & DSGVO:** Alle Messungen laufen lokal im Browser des Nutzers. Kein Hochladen von Fotos oder Wohnungsadressen an fremde Server.

## Skizze

Geführter 4-Schritt-Entscheidungsbaum:
1. **Baujahr-Filter:** Gebäudeerrichtung vor 1973 in Westdeutschland (1878–1935 in Ostdeutschland).
2. **Magnet-Vorfilter:** Ein Neodym- oder Kühlschrankmagnet wird an das freiliegende Rohr gehalten. Haftet der Magnet $\to$ Verzinkter Stahl (Ausschluss von Blei, Vorgang beendet). Haftet er nicht $\to$ Blei, Kupfer oder Kunststoff.
3. **Optik & Ritzprobe:** Geführter Foto-Abgleich. Blei ist grau-matt, weich und lässt sich mit einer Münze silbrig glänzend anritzen; Verbindungsstellen weisen birnenförmige Wulstnähte auf.
4. **Akustischer Resonanztest:** Smartphone-Mikrofon zeichnet einen 2-Sekunden-Impuls auf. Klopfen mit Schraubendreher $\to$ FFT-Analyse misst Dämpfung und Obertonspektrum.

**Ausgabe:**
* **Blei-Wahrscheinlichkeitsscore:** Unbedenklich / Verdacht / Dringend.
* **Muster-Auskunftsersuchen an den Vermieter:** Formelles Schreiben mit Fristsetzung zur Vorlage des Installationsnachweises gem. § 17 Abs. 6 Satz 3 TrinkwV.
* **Vordruck Verdachtsanzeige Gesundheitsamt:** Vorlage für die zuständige Hygienebehörde zur Einleitung einer behördlichen Überprüfung nach § 64 TrinkwV.

**Nicht dabei:** Keine chemische ICP-MS-Reinstoffgarantie, kein gerichtliches Sachverständigengutachten, kein automatischer Mietminderungsabzug ohne vorherige Mängelanzeige.

## Erster Schritt

**Ticket: Standalone-Entscheidungsbaum mit Web Audio FFT-Resonanzmesser und PDF-Generator.**

- **Umfang:** Single-Page-Anwendung in TypeScript.
- **Funktionen:**
  1. Magnet-Ausschluss-Logik und Farbabgleich-Canvas für Ritzspuren.
  2. AudioContext-Worklet zur Messung der Impulsabklingzeit (Threshold $\tau < 60\ \text{ms}$ = stark gedämpft).
  3. Clientseitiger PDF-Export des juristischen Schreibens nach § 17 TrinkwV.
- **Fertig, wenn:** An Test-Audiodateien von Blei-, Kupfer- und Zinkrohren in 9 von 10 Fällen das Dämpfungsverhalten korrekt differenziert wird und das generierte PDF die Pflichtangaben nach § 17 Abs. 6 TrinkwV fehlerfrei enthält.

## Wo es kippt

**Die falsche Anschuldigung:** Ein Mieter kratzt an einem verzinnten Kupferrohr oder an lackiertem verzinktem Eisen, vermutet fälschlicherweise Blei und gerät in einen eskalierenden Rechtsstreit mit der Hausverwaltung.

*Gegenmaßnahmen:*
1. **Zwingender Magnet-Vorfilter vor jedem Kratztest:** Verzinkter Stahl haftet magnetisch, Blei und Kupfer niemals. Das filtert 90 % der Verwechslungen sofort heraus.
2. **Rechtssichere Tonalität des Anschreibens:** Das Schreiben formuliert keine Straftatanzeige, sondern ein sachliches **„Auskunftsersuchen nach § 17 Abs. 6 Satz 3 TrinkwV“** zur Vorlage des Bestandsnachweises. Dadurch bleibt der Mieter vor Verleumdungs- oder Abmahnrisiken geschützt.
3. **Echtes Risikomanagement:** Bei begründetem Verdacht wird sofort empfohlen, Wasser bis zum Kaltwerden ablaufen zu lassen und Säuglingen kein Leitungswasser zu geben, bis Klarheit herrscht.

## Wer es schon versucht hat

**Verdikt `verengt` (25.09.2026):**
- **Verbraucherzentralen & Deutscher Mieterbund:** Veröffentlichen fundierte Textartikel, raten aber mangels Tooling pauschal zu 100 € teuren Laboranalysen oder zum Anwalt.
- **Kommunale Gesundheitsämter (Kassel, Hannover, Bautzen, Augsburg):** Stellen Online-Meldeformulare (z. B. NOLIS smartForms) bereit, richten sich damit aber an Installationsbetriebe gem. § 17 Abs. 6 TrinkwV. Proaktive Kontrollen im Wohnungsbestand finden mangels Personal nicht statt.
- **US EPA Lead & Copper Rule Inventories:** US-Wasserversorger nutzen ArcGIS Survey123 für Bürger-Selbstauskünfte mit Magnet und Schraubendreher. Das Tool sammelt Daten für den Versorger, liefert dem Bürger aber keine rechtssichere Handlungsgrundlage.

**Die verbleibende Lücke:** Eine geführte, datensparsame Bürger-Diagnosekette am Smartphone, die physikalische Indikatoren (Magnet, Ritzoptik, Klopfton-Dämpfung) bündelt und direkt in die gesetzlichen Durchsetzungsansprüche der deutschen Trinkwasserverordnung übersetzt.

## Vorarbeit

- **Trinkwasserverordnung 2023:** BGBl. 2023 I Nr. 159; § 17 (Verbot von Bleileitungen), § 64 (Anordnungsbefugnis des Gesundheitsamts).
- **Umweltbundesamt (UBA):** Leitfaden „Blei im Trinkwasser" und Sanierungsempfehlungen.
- **Akustische Materialdaten:** Dichte Blei $\approx 11{,}34\ \text{g/cm}^3$, Schallgeschwindigkeit $c \approx 1200\ \text{m/s}$, Dämpfungsfaktor $\eta \approx 0{,}015$ (Kupfer: $\rho \approx 8{,}96$, $c \approx 4700$, $\eta \approx 0{,}001$).
- **US EPA LCRI:** Lead Service Line Identification Procedures (Scratch and Magnet protocols).

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

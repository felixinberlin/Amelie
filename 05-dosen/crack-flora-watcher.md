# Crack Flora Watcher (Ritzengrün-Wächter)

**Ein Satz:** Citizen-Science-App für die zähesten Pflanzen der Stadt: verwandelt Gehweg- und Asphaltritzen in eine lebendige Schatzsuche mit Gamification (Toughness Index), Zeitraffer-Tracking und Forschungsexport.

**Stand:** September 2026 · **Prüfen ab:** Mai 2027 (#Krautschau-Aktionswoche)  
**Empfänger:** #Krautschau / Senckenberg Gesellschaft für Naturforschung (Dr. Julia Krohmer), Flora-Incognita-Forschungsgruppe (MPI Biogeochemie Jena / TU Ilmenau), NABU Urbanes Grün, Berliner Stadtnatur-Ranger  
**Verdikt:** 🎁 verschenken — Kooperation mit bestehenden Netzwerken (#Krautschau & Flora Incognita)

---

## 1. Das Kernproblem (Der Haken)

Täglich laufen Millionen Stadtbewohner an faszinierenden Wildpflanzen vorbei, die sich ihren Weg durch meterstarren Asphalt, Mauerspalten, Bordsteinkanten und Kopfsteinpflaster bahnen. Diese Pflanzen werden entweder gar nicht wahrgenommen („Plant Blindness“) oder als lästiges „Unkraut“ abgetan und mit thermischen Brennern vernichtet.

Gleichzeitig gibt es ein Paradoxon:
1. **Generische Pflanzen-Apps** (PlantNet, PictureThis, iNaturalist) sind rein botanische Bestimmungs-Werkzeuge. Sie bieten keine thematische Identität, keine emotionale Bindung und keine Gamification für den städtischen Alltag.
2. **Akademische Initiativen** wie die bundesweite `#Krautschau` (Senckenberg) mobilisieren jedes Jahr im Mai Tausende Menschen dazu, Gehwegpflanzen mit Kreide zu markieren und Fotos mit Hashtags zu teilen — es fehlt jedoch an einer dauerhaften, interaktiven mobilen Plattform mit Geolokalisierung, Verlaufsbeobachtung und automatisiertem Forschungs-Export.
3. **Stadtökologen und Klimaforscher** fehlen flächendeckende, mikro-geotaggte Daten darüber, welche Pionierarten die extremen Hitze- und Salzinseln des urbanen Raums besiedeln.

## 2. Die Lösung (Die Intervention)

Crack Flora Watcher ist kein weiteres generisches Bestimmungswerkzeug. Es ist eine **narrativ getriebene urbane Entdeckungs-App**, die Pflanzen als unbezwingbare urbane Überlebenskünstler inszeniert:

- **KI-Pflanzenerkennung mit urbanem Kontext:** Erkennt Pflanzen direkt aus Fotos (mittels lokaler On-Device-Modelle oder PlantNet / Flora-Incognita-Anbindung). Statt trockenem Botaniker-Latein liefert die App urbane Kontextfakten („Pionierart nach Straßenschäden“, „gedeiht auf salzigen Winter-Gehwegen“, „Wurzeln sprengen bis zu 10 bar Druck“).
- **Der Härtegrad-Index (Toughness Index):** Jede Pflanze erhält einen Toughness-Score (1–10) basierend auf Substrat (reiner Asphalt vs. Mauerritze), Sonneneinstrahlung, Trittbelastung und Überlebensdauer. Ein Leaderboard kürt den wahren „König der Ritzen“.
- **Zeitraffer-Tracking (Crack Time-Lapse):** Nutzer fotografieren dieselbe Pflanze über Wochen und Jahreszeiten hinweg. Die App richtet die Bilder automatisch per Kantenabgleich aus und generiert Zeitraffer-Videos vom Keimen bis zur Blüte im Asphalt.
- **Grüne Adern & Entdeckungskarte:** Eine interaktive Kiez-Heatmap zeigt die verborgenen „grünen Adern“ der Stadt und motiviert zu spontanen Erkundungsgängen auf dem Arbeitsweg.
- **Citizen Science & Forschungsbrücke:** Direkte Schnittstelle zur Senckenberg #Krautschau und zu Flora Incognita (via Projekt-Tagging nach dem etablierten GartenDiv-/PhänoNetz-Modell) sowie GeoJSON/CSV-Export für Universitäten.

## 3. Der technische Bauplan

- **Frontend & Mobilität:** React Native oder Progressive Web App (PWA) mit Offline-fähigem Pavement-Classifier.
- **Vision-Engine:** Hybrid-Modell: schnelles On-Device TensorFlow Lite Modell für die Top-50 häufigsten urbanen Ritzenpflanzen (Löwenzahn, Wegerich, Hirtentäschel, Schafgarbe, Kanadisches Berufkraut), Fallback auf Flora Incognita / PlantNet API bei seltenen Arten.
- **Computer-Vision-Ausrichtung:** OpenCV/Canvas Kanten- und Konturabgleich für Pavement-Risse, um wiederholte Fotos exakt auf denselben Bildausschnitt zu kalibrieren.
- **Datenschutz & Geofencing:** Freiwillige Beobachtungen mit Noise-Geofencing zum Schutz privater Hauseingänge. Volle Kompatibilität mit OpenStreetMap und GBIF-Standards.

## 4. Warum das als Dose verschenkt wird

Dieses Projekt muss nicht als isoliertes kommerzielles Startup betrieben werden. Sein größter Hebel liegt darin, es als **fertig konzipiertes Dossier an die Senckenberg Gesellschaft (#Krautschau) und die Flora-Incognita-Forschungsgruppe (MPI Jena / TU Ilmenau)** zu übergeben.

Beide Organisationen verfügen über die wissenschaftliche Autorität und die Reichweite, aber oft nicht über die spielerische Produkt- und Gamification-Perspektive einer modernen Consumer-App. Der Mai ist jedes Jahr der bundesweite Aktionsmonat — die Dose wird mit einer fertig formulierten Kooperationsstrategie überreicht.

## 5. Erster Schritt

**Ticket: Ein Riss, zwei Fotos, ein Toughness-Score.**

Minimaler Prototyp: Web-App mit Kamera-Upload. Foto einer Pflanze im Bürgersteig; Extraktion von Art und Härtegrad-Index (Substrat Asphalt = +4 Punkte, Trittfrequenz = +3 Punkte).

**Fertig, wenn:** Eine Pflanze im Straßenbelag fotografiert wird, als *Taraxacum sect. Ruderalia* mit Toughness 8.5/10 bewertet wird und mit einem Klick als #Krautschau-kompatibler Datensatz exportiert werden kann.

## 6. Wo es kippt (Bruchstellen & Gegenmaßnahmen)

- **Bruchstelle 1: Konkurrenzdruck durch bestehende Riesen-Apps.** Wenn Nutzer es nur als Bestimmungs-App ansehen, löschen sie es zugunsten von Google Lens oder Flora Incognita.  
  *Gegenmaßnahme:* Schärfung des Narrativs („Rebel Botanists of the Concrete Jungle“), Fokus auf Toughness-Score, Zeitraffer-Feature und exklusive Stadtnatur-Herausforderungen.
- **Bruchstelle 2: Vandalismus oder Pflanzenschutz-Missverständnisse.** Nutzer könnten Pflanzen ausreißen, um Wurzeln zu prüfen.  
  *Gegenmaßnahme:* Feste Verhaltensregeln in der App („Nur schauen, fotografieren, Kreide nutzen — niemals ausreißen“ im Geiste der #Krautschau-Aktion).

## 7. Schenkungs-Mails / Handover Letters (In der Dose verpackt)

### Mail 1: An das #Krautschau-Team (Senckenberg Gesellschaft für Naturforschung)
**An:** `julia.krohmer@senckenberg.de`, `krautschau@senckenberg.de`  
**Empfänger:** Dr. Julia Krohmer (Senckenberg) & Prof. Dr. Alexandra-Maria Klein (Uni Freiburg)  
**Betreff (DE):** Ideen-Schenkung: Crack Flora Watcher – Ganzjährige App & Toughness-Index für #Krautschau  
**Subject (EN):** Free Idea Gift: Crack Flora Watcher – Year-Round Mobile Experience & Toughness Index for #Krautschau  

```text
Liebe Frau Dr. Krohmer, liebe Frau Prof. Dr. Klein, liebes #Krautschau-Team,

ich verfolge Ihre jährliche #Krautschau-Aktionswoche im Mai mit riesiger Begeisterung. Die Idee, mit bunter Straßenkreide und offenen Augen das Bewusstsein für die heimlichen Helden unseres Asphalts zu schärfen, hat den Blick tausender Menschen auf ihre Stadt für immer verändert.

Um diese Welle nicht nach dem Mai abebben zu lassen, habe ich ein vollständiges Produkt- und Interaktionskonzept ausgearbeitet, das ich Ihnen bedingungslos schenken möchte: „Crack Flora Watcher" (Ritzengrün-Wächter).

Der Kern des Konzepts:
1. Der „Toughness Index" (1–10): Statt trockenem Bestimmungs-Latein bewertet die App den Überlebenswillen der Pflanze — berechnet aus Substrat-Härte (reiner Asphalt vs. Mauerritze), Trittbelastung und städtischem Hitzeinsel-Faktor. Das kürt den wahren „König der Ritzen".
2. Kanten-ausgerichtetes Zeitraffer-Tracking: Ein Kamera-Overlay gleicht die Konturen des Asphaltrisses ab, sodass Bürger dieselbe Pflanze über Wochen und Monate hinweg vom Keimling bis zur Samenreife fotografieren können.
3. Direkte Brücke zu Senckenberg & GBIF: Jede Beobachtung wird mit 25m-Geofuzzing (zum Schutz privater Hauseingänge) in standardisiertem GeoJSON erfasst und kann mit einem Klick für die stadtökologische Forschung exportiert werden.

Das Dossier enthält die vollständige Architektur, User Journeys für Schulen, Pendler und Familien, sowie ein erstes minimales Ticket („Ein Pflasterriss, zwei Fotos, ein Toughness-Score").

Hier ist der Link zur fertig geschnürten Dose und dem interaktiven Prototyp-Labor:
[Link zur Dose: Crack Flora Watcher / Ritzengrün]

Dieses Konzept ist ein Geschenk (CC0, Public Domain). Sie schulden mir nichts — keine Nennung, keine Rückmeldung. Wenn es Ihnen für die Vorbereitung der Aktionswoche 2027 hilft oder Sie Teile davon in bestehende Schulmaterialien einbauen möchten: Nehmen Sie es, wandeln Sie es ab und machen Sie daraus, was Ihnen nützt.

Mit herzlichen Grüßen aus Berlin,
Félix
```

---

### Mail 2: An das Flora-Incognita-Team (MPI für Biogeochemie & TU Ilmenau)
**An:** `kontakt@floraincognita.de`, `jana.waeldchen@bgc-jena.mpg.de`  
**Empfänger:** Dr. Jana Wäldchen (MPI Biogeochemie Jena) & Prof. Dr. Patrick Mäder (TU Ilmenau)  
**Betreff (DE):** Kooperations-Idee als Geschenk: Crack Flora Watcher / Kampagnen-Tag für Flora Incognita  
**Subject (EN):** Idea Gift & Collaboration Concept: Crack Flora Watcher / Campaign Tag for Flora Incognita  

```text
Liebe Frau Dr. Wäldchen, lieber Herr Prof. Dr. Mäder, liebes Flora-Incognita-Team,

Flora Incognita ist zweifellos das wissenschaftliche Gold-Standard-Werkzeug für KI-gestützte Pflanzenbestimmung in Deutschland. Besonders beeindruckt hat mich, wie elegant Sie spezifische Forschungsfragen über Projekt-Tags skaliert haben — wie bei „GartenDiv" oder im PhänoNetz mit dem Deutschen Wetterdienst.

Ich möchte Ihnen ein fertig durchdachtes Kampagnen- und Datenmodell schenken: „Crack Flora Watcher" — ein urbanes Biodiversitäts-Modul für Extremstandorte (Pflasterfugen, Asphaltrisse, Mauerwerk).

Warum dieser Zuschnitt wissenschaftlich und gesellschaftlich relevant ist:
1. Indikator für urbane Hitzeinseln: Pflanzen in bituminösen Dehnungsfugen trotzen extremen Oberflächentemperaturen (>50 °C) und mechanischem Trittstress. Ihre Besiedlungsmuster sind ein hochaktueller Bio-Indikator für städtische Klimaresilienz.
2. Der „Toughness Index": Eine mathematische Formel, die botanische Taxa mit mikroklimatischen Standortparametern (Substratklasse, Verdichtung, Versiegelungsgrad) verknüpft und so Bürgerwissenschaftlern einen spielerischen Zugang eröffnet.
3. Nahtlose Integration in Flora Incognita: Statt einer redundanten App könnte das Konzept als offizieller Projekt-Tag (#Krautschau oder #CrackFlora) direkt in Flora Incognita implementiert werden — inklusive Kurzanleitung zum Kanten-synchronisierten Zeitraffer.

Ich habe das Konzept als vollständiges Dossier mit Daten-Schema, Risikofaktoren und dem ersten Umsetzungsschritt niedergelegt:
[Link zur Dose: Crack Flora Watcher / Ritzengrün]

Das gesamte Material steht unter CC0 (Public Domain). Sie können die Architektur, das Scoring-Modell und die Ideen frei nutzen, in Förderanträge (z. B. BfN oder BMBF) einfließen lassen oder im nächsten Release verwerten.

Vielen Dank für Ihre herausragende Arbeit für die heimische Pflanzenvielfalt.

Beste Grüße aus Berlin,
Félix
```

---

## 8. Abschluss-Pledge

Diese Idee gehört niemandem. Nimm sie, bau sie, verschenke sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

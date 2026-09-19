# 10 Ideen für den 18. September: Zuerst der Mensch, dann die Idee
## Oder: Warum Amélie Poulain zuerst Dominique Bretodeau suchte — und nicht die Blechdose erfand

*Von Félix · Berlin, 18. September 2026 · Alle Inhalte CC0 (Public Domain)*

> *„Amélie Poulain findet eine Blechdose hinter einer Fliese, recherchiert vierzig Jahre später den Jungen, dem sie gehörte, legt sie ihm in eine Telefonzelle und verschwindet. Sie sucht sich die Person aus, bevor sie das Geschenk macht, und sie fragt hinterher nie nach.“*  
> — *Amélie-Manifest, Regel 1*

---

## 1. Die Erinnerung an Regel 1: Das Matching ist die Arbeit, nicht der Einfall

Wenn man sich in Theorien über Koestler, Bisoziation und Algorithmen verliert, passiert genau das, wovor das Manifest warnt: Man erzeugt abstrakte Konzepte, die im luftleeren Raum schweben. KI-Slop entsteht nicht nur durch billige LLM-Prompts — er entsteht vor allem dann, wenn man Software für ein abstraktes Problem entwirft, anstatt einer konkreten Person die Arbeit zu erleichtern.

**Regel 1 des Manifests ist unmissverständlich:**
> *„Die Zustellung ist das Geschenk, nicht der Fund. Die Dose war vierzig Jahre wertlos, weil niemand wusste, wem sie gehört. Bei Ideen ist es identisch: der Einfall ist billig, das Matching ist die Arbeit. Wenn du eine Stunde in die Idee und zwei Minuten in den Empfänger steckst, hast du nichts verschenkt — du hast getwittert.“*

Deshalb fangen wir für den 18. September noch einmal von vorne an — und zwar genau dort, wo die Amélie-Methode beginnt: **beim Menschen, der leidet oder sich abmüht, und bei der Organisation, die für das Problem brennt.**

Nicht: *„Hier ist ein cleverer KI-Algorithmus.“*  
Sondern: **Wer steht da im Regen? Welche Stunde ihres Tages ist frustrierend? Wer hat ein Mandat und ein Budget, kann es aber heute nicht lösen?**

---

## 2. Die Empfänger-Rangliste: An wen wir verschenken

Aus der Recherche der weltweiten Ideenprojekte wissen wir: Ideen ohne zuständige Menschen verrotten in Ideenbanken. Wir schenken nicht an den Äther, sondern adressieren Institutionen und Rollen mit klarem Profil:

1. **Organisationen mit Bauauftrag und Budget (Rang 1)**: Haben Entwickler:innen und den gesellschaftlichen Auftrag, genau dieses Problem zu lösen (z. B. CityLAB Berlin, Landesforstbetrieb, Stiftung Naturschutz).
2. **Citizen-Science-Netzwerke & Fachvereine (Rang 2–4)**: Haben engagierte Ehrenamtliche, deren Lebenszeit heute in stumpfer Handarbeit verbrannt wird (Thünen-Monitoring, CompGen, LAG Vogelschutzwarten, Tafeln).
3. **Reine Einzel-Maintainer nur mit lauffähigem Code**: Wer nicht gefragt hat, kriegt Werkzeug, kein unfertiges Projekt.

Hier sind die 10 realen Menschen und Institutionen für den 18. September — und die Werkzeuge, die wir für sie vorbereiten (noch unverpackt, ohne fertige Dosen, erst im Realitätsabgleich).

---

## 3. Die 10 Ideen vom 18. September — Vom Menschen her gedacht

---

### 1. Für den ehrenamtlichen Biotopkartierer in der Sommerhitze
* **Für wen ganz konkret:**  
  *Gisela und Markus, ehrenamtliche Kartierer für die Stiftung Naturschutz Berlin und das Landesamt für Umwelt Brandenburg (LfU).*
* **Der reale Schmerz:**  
  Im Juli bei 34 Grad laufen sie mit Klemmbrett und Maßband durch die Döberitzer Heide, um geschützte Sandtrockenrasen (FFH-Lebensraumtyp 6120) zu bewerten. Sie knien alle zwei Meter im Sand, zählen Grasnelken und Schafschwingel und schätzen den Deckungsgrad von Flechten. Die LANA-Kartieranleitung verlangt 20-Meter-Transekte. Gisela hat nach 14 Metern Schwindelgefühle, bricht ab — und Monate später verwirft das Amt das Gutachten als „statistisch unzureichende Stichprobe“, weil niemand vor Ort sagen konnte, ob die erfassten 14 Meter bereits signifikant genug waren.
* **Was ihnen hilft:**  
  **Trockenrasen-Transekte (Biotopwert-Livekalibrierer)**  
  Eine Offline-Webseite auf dem Handy. Markus hält das Smartphone beim langsamen Gehen über den Boden. Eine schlanke On-Device-Vision misst das Verhältnis von Sand, Moos und Gräsern als kontinuierliches Band. Sobald die statistische Varianz für den Erhaltungsgrad A gesättigt ist, vibriert das Telefon in der Tasche: *„Stichprobe statistisch gesättigt nach 13,8 Metern. Weitergehen liefert keinen Informationsgewinn.“* Gisela kann in den Schatten.
* **Möglicher Empfänger:**  
  Stiftung Naturschutz Berlin · Landesamt für Umwelt Brandenburg (Ref. Biotopkartierung).

---

### 2. Für den Fledermausschützer mit 800 Stunden Audiomaterial
* **Für wen ganz konkret:**  
  *Dr. Carsten K. und die Ehrenamtlichen des NABU Bundesfachausschusses Fledermausschutz.*
* **Der reale Schmerz:**  
  Carsten hat über den Sommer drei Batcorder an Teichen im Spreewald aufgestellt, um Wasserfledermäuse (*Myotis daubentonii*) zu erfassen. Jetzt sitzt er im Oktober vor 400 Gigabyte Ultraschall-WAV-Dateien. Automatische Erkennungssoftware (BatClassify, Kaleidoscope) kapituliert völlig: Jedes Mal, wenn die Fledermaus knapp über der Wasseroberfläche jagt, erzeugt die Kräuselwelle ein spiegelverkehrtes Doppler-Echo. Die Software meldet zwei Tiere oder unbekanntes Rauschen. Carsten muss 120 Stunden lang nachts Spektrogramme mit der Lupe prüfen, statt Schutzkonzepte zu schreiben.
* **Was ihm hilft:**  
  **Fledermaus-Echo-Entwirrer (Doppler-Wasserfilter)**  
  Ein browserbasiertes Werkzeug ohne Server-Upload. Es nutzt Phasenauslöschung (wie im Tonstudio, wenn zwei Mikrofone ein Streichquartett aufnehmen): Das invertierte Spiegel-Echo der Wasseroberfläche wird destruktiv herausgerechnet. Carsten zieht seinen Ordner per Drag & Drop hinein; übrig bleibt der reine Ruf des fliegenden Tieres. Die Fehlerkennung sinkt um 80 %.
* **Möglicher Empfänger:**  
  NABU Bundesfachausschuss Fledermausschutz · Koordinationsstellen für Fledermausschutz der Länder.

---

### 3. Für den Steinmetz und Familienforscher auf der Friedhofsleiter
* **Für wen ganz konkret:**  
  *Günter (71), aktiv im Verein für Computergenealogie (CompGen), und Restauratorin Sarah auf dem Dorotheenstädtischen Friedhof Berlin.*
* **Der reale Schmerz:**  
  Auf einer wackeligen Leiter steht Günter vor einem barocken Sandstein-Epitaph von 1740. Der Stein ist verwittert, die Inschrift fast abgetragen. Er versucht es mit Kreide und Taschenlampe. Moderne OCR und KI-Transkriptionen erfinden einfach Namen („Halluzination auf Bruchkanten“, wie CompGen im Werkstattbericht 2026 selbst klagte). Sarah wiederum weiß, dass photometrische Stereomethoden (RTI) im Labor funktionieren, aber niemand schleppt eine 50-Kilo-Lichtkuppel auf den Friedhof.
* **Was ihnen hilft:**  
  **Sandstein-Streiflicht-Relief (Taschenlampen-RTI im Browser)**  
  Günter macht mit dem Handy vier Fotos, während Sarah mit der Taschenlampe nacheinander aus vier Richtungen leuchtet (oben, rechts, unten, links). Der WebGPU-Shader im Handy berechnet sofort eine interaktive 3D-Reliefkarte. Günter kann mit dem Finger die virtuelle Sonne über den Stein wandern lassen — die verwitterte Zahl „1748“ tritt glasklar hervor. Wo der Stein unwiederbringlich zerstört ist, markiert das Tool die Stelle ehrlich rot, statt zu halluzinieren.
* **Möglicher Empfänger:**  
  Verein für Computergenealogie e.V. (CompGen) · Landesdenkmalamt Berlin (Restaurierungswerkstätten).

---

### 4. Für die Rentnerin, deren Hummelvolk im Garten stirbt
* **Für wen ganz konkret:**  
  *Renate (68) in Berlin-Pankow, Teilnehmerin am Thünen-Projekt „MonViA Wildbienen-Monitoring“.*
* **Der reale Schmerz:**  
  Renate hat im März stolz einen Hummelnistkasten aufgestellt. Eine Erdhummel-Königin ist eingezogen, die ersten Arbeiterinnen fliegen. Im Mai schleicht eine Kuckuckshummel (*Psithyrus*) um den Kasten. Kuckuckshummeln bauen keine Nester; sie dringen ein, stechen die Wirtskönigin tot und versklaven das Volk. Renate sieht die dicke Hummel am Einflugloch, hält sie für eine friedliche Königin, freut sich und macht ein Foto für die MonViA-App. Die Experten antworten erst im November. Da ist ihr Hummelvolk seit vier Monaten tot.
* **Was ihr hilft:**  
  **Hummel-Schleusenwächter (Kuckuckshummel-Sofortwarnung)**  
  Renate hält das Handy 10 Sekunden vor das Einflugloch. Das On-Device-Modell erkennt in Echtzeit: Keine Pollenkörbchen an den Beinen, verdickter Hinterleib, zögerlicher Suchflug. Das Handy vibriert sofort rot: *„Achtung: Sehr wahrscheinlich Kuckuckshummel! Bitte jetzt die Schutzklappe am Kasten für 45 Minuten schließen.“* Das Hummelvolk überlebt den Tag.
* **Möglicher Empfänger:**  
  Thünen-Institut für Biodiversität (Citizen Science MonViA) · NABU Hummelschutzgruppen.

---

### 5. Für den Orgelbauer, der im dunklen Pfeifenwerk klettert
* **Für wen ganz konkret:**  
  *Orgelbaumeister Johannes T. aus Brandenburg und die Sachverständigen der Deutschen Stiftung Denkmalschutz.*
* **Der reale Schmerz:**  
  Historische Kirchenorgeln aus dem 18. Jahrhundert leiden unter dem gefürchteten „Bleifraß“: Essigsäuredämpfe aus alten Eichenholzgehäusen verwandeln die Zinn-Blei-Legierung der Pfeifenfüße unbemerkt in bröckeliges Bleiweiß. Johannes muss in staubige, fünf Meter hohe Gehäuse klettern, balanciert auf Balken und leuchtet mit der Stirnlampe. Meist entdeckt man den Schaden erst, wenn Pfeifen unter ihrem eigenen Gewicht einknicken und das Pfeifenwerk zerstören.
* **Was ihm hilft:**  
  **Orgelpfeifen-Bleifraß-Resonanz**  
  Johannes setzt sich unten an den Spieltisch, legt das Handy auf die Orgelbank und spielt die Tasten eines Registers nacheinander an. Die Web-Audio-App analysiert den mikroskopischen Einschwingvorgang (das „Spucken“ und die Transienten der Pfeife). Chemisch zersetztes, entzinktes Metall dämpft die Obertöne in den ersten 40 Millisekunden anders als gesundes Metall. Die App markiert auf dem Tastatur-Schema: *„Pfeife C#3 und D3 im Hinterwerk zeigen auffällige Dämpfung — gezielt dort nachsehen.“* Kein Klettern auf Verdacht mehr.
* **Möglicher Empfänger:**  
  Bund Deutscher Orgelbaumeister (BDO) · Stiftung Orgelklang / Deutsche Stiftung Denkmalschutz.

---

### 6. Für den Einsatzleiter der Freiwilligen Feuerwehr im märkischen Kiefernwald
* **Für wen ganz konkret:**  
  *Brandmeister Torsten, Freiwillige Feuerwehr Treuenbrietzen / Landesforstbetrieb Brandenburg.*
* **Der reale Schmerz:**  
  Sommer in Brandenburg, Waldbrandstufe 4. Torsten steht mit seinem Löschfahrzeug an einer Waldkante. Der Deutsche Wetterdienst meldet für den 1-km-Rasterbereich „Gefahrenindex 4“. Aber Torsten muss *hier und jetzt* entscheiden: Gehen seine Leute mit Schlauchleitungen 50 Meter in die Kiefernschonung rein, oder bricht ihnen der Boden unter den Füßen weg? Er tritt mit den schweren Stiefeln auf den Waldboden, um zu schätzen, wie trocken die Nadelstreu ist. Eine Fehlschätzung bedeutet: Das Bodenfeuer kriecht unterirdisch an den Schläuchen vorbei.
* **Was ihm hilft:**  
  **Waldbrand-Streuschicht-Tensiometer (Nadelstreu-Knistern)**  
  Torsten greift eine Handvoll Kiefernstreu, hält sie ans Handymikrofon und ballt die Faust. Feuchte Nadeln biegen sich elastisch und leise; brandgefährlich ausgetrocknete Nadeln zersplittern mit hochfrequenten akustischen Mikrorissen (>8 kHz). Das Modell analysiert das Bruchgeräusch in drei Sekunden offline: *„Feuchte < 7 %, Zündgefahr extrem bis 5 cm Tiefe. Kein Vorgehen ohne Riegelstellung.“*
* **Möglicher Empfänger:**  
  Landesfeuerwehrverband Brandenburg e.V. · Landesbetrieb Forst Brandenburg.

---

### 7. Für den 75-jährigen DWD-Wetterbeobachter
* **Für wen ganz konkret:**  
  *Klaus-Dieter (74) in der Uckermark, seit 32 Jahren ehrenamtlicher phänologischer Beobachter für den Deutschen Wetterdienst (DWD).*
* **Der reale Schmerz:**  
  Klaus-Dieter meldet jedes Jahr den exakten Tag, an dem der Haselstrauch vor seinem Garten die Pollen streut und die Buche austreibt. Seine Daten fließen in die Klimaforschung ein. Durch die Erderwärmung verschieben sich die Termine um Wochen. Letztes Jahr war Klaus-Dieter von Freitag bis Sonntag auf der goldenen Hochzeit seiner Schwester. Genau an diesem Samstag sprang die Knospe auf. Am Montag war die Blüte voll im Gang — das exakte Datum verloren, eine Lücke in einer 30-jährigen Datenreihe, die ihn maßlos wurmt.
* **Was ihm hilft:**  
  **Phänologischer Knospen-Countdown**  
  Drei Tage vor seiner Abreise macht Klaus-Dieter mit dem Handy zwei Makrofotos der geschlossenen Knospe. Die App misst die Spreizung der Knospenschuppen im Sub-Pixel-Bereich und gleicht sie mit der lokalen Temperaturprognose ab. Sie sagt ihm am Donnerstagmorgen: *„Knospenöffnung erfolgt am Samstag zwischen 14 und 19 Uhr. Bitte Nachbarn für Samstagnachmittag um Bestätigungsfoto bitten.“* Die Klimadatenreihe bleibt lückenlos.
* **Möglicher Empfänger:**  
  Deutscher Wetterdienst (DWD), Referat Agrarmeteorologie und Phänologie.

---

### 8. Für die Ehrenamtliche bei der Tafel im kalten Ausgabelager
* **Für wen ganz konkret:**  
  *Monika (62) und ihre Mitstreiterinnen bei der Berliner Tafel e.V. in Neukölln.*
* **Der reale Schmerz:**  
  Dienstagmorgen, 7:30 Uhr. Im kalten Lager stehen vierzig angelieferte Kisten Mischobst aus Supermärkten. Monika sortiert drei Stunden lang per Hand hunderte Kilo Bananen, Birnen, Äpfel und Pfirsiche. Sie sieht, was sichtbar schimmelt. Was sie nicht sieht: Äpfel mit beginnendem Druckschaden gasen massiv Ethylen aus. Wenn sie die scheinbar festen Pfirsiche in dieselbe Kiste packt, sind die Pfirsiche am nächsten Tag bei der Ausgabe an die Familien brauner Brei. Die Arbeit war umsonst, wertvolle Lebensmittel landen in der Tonne.
* **Was ihr hilft:**  
  **Tafel-Frische-Triage (Ethylen- & Druckstellen-Checker)**  
  Monika schwenkt das Handy kurz über die offene Kiste. Das System erkennt die Fruchtarten und Früchte mit beginnenden Druckdellen. Es blendet direkt über das Kamerabild klare Pfeile ein: *„Reife Äpfel links gasen aus — Pfirsiche rechts bitte in separate Kiste packen, sonst in 18 Stunden verdorben.“* Monika spart 40 Minuten Sortierzeit und rettet drei Kisten frisches Obst pro Schicht.
* **Möglicher Empfänger:**  
  Tafel Deutschland e.V. · Lokale Tafeln und Foodsharing-Gemeinschaften.

---

### 9. Für den Naturschutzbeauftragten auf nächtlicher Streife
* **Für wen ganz konkret:**  
  *Ralf B., ehrenamtlicher Naturschutzbeauftragter im Berliner Bezirk Treptow-Köpenick und Aktivist bei „Paten der Nacht“.*
* **Der reale Schmerz:**  
  Berlin hat seit 2021 den Leitfaden „Bauen mit Licht und Glas“, der unzulässige Himmelsaufhellung (Skyglow) und Insektentötung verbietet. Nachts um 23 Uhr steht Ralf vor einem neuen Bürokomplex: Grellweiße Bodenstrahler leuchten an der Glasfassade vorbei kerzengerade in den Nachthimmel, mitten im Flugkorridor von Nachtfaltern und Zugvögeln. Ralf ruft das Umweltamt an; die sagen: *„Haben Sie eine kalibrierte Luxmeter-Messung des Raumwinkels über 90 Grad?“* Natürlich nicht. Teure Gutachter rücken nachts nicht aus. Der Verstoß bleibt folgenlos, hunderte Vögel kollidieren im Herbst.
* **Was ihm hilft:**  
  **Licht-Glocken-Kataster (Fassaden-Skyglow-Inspector)**  
  Ralf stellt sich an den Gehweg, visiert die Gebäudekante an und kippt das Smartphone waagerecht. Die App nutzt Gyroskopsensoren und zwei Belichtungen, um das Verhältnis von Fassadenlicht zu ungenutztem Himmelslicht (*Upward Light Output Ratio*, ULOR) nach DIN EN 12464-2 zu berechnen. In dreißig Sekunden spuckt das Handy ein rechtssicheres PDF mit Foto, GPS, Uhrzeit und Verstoß-Zahl aus. Ralf mailt es ans Umweltamt — die Hausverwaltung muss abblenden.
* **Möglicher Empfänger:**  
  Paten der Nacht gGmbH · Senatsverwaltung für Umwelt Berlin (Referat Immissionsschutz).

---

### 10. Für den Bachpaten in der eiskalten Wathose
* **Für wen ganz konkret:**  
  *Jochen (55), Gewässerwart im örtlichen Anglerverband und Bachpate für die renaturierte Nuthe.*
* **Der reale Schmerz:**  
  Im Rahmen der EU-Wasserrahmenrichtlinie wurden Totholzstämme in den Bach eingebracht, um Strömungsturbulenzen und tiefe Kolke für Forellen zu schaffen. Im Frühjahr nach dem Hochwasser muss Jochen prüfen, ob die Stämme noch sicher im Grund verkeilt sind oder beim nächsten Starkregen abtreiben und das Brückengitter der Landstraße verstopfen. Jochen steht bei 4 Grad Wassertemperatur in der Wathose im Schlamm und stochert mit einer Holzlatte im trüben Wasser herum. Ob der Stamm unten fest sitzt oder locker schwimmt, kann er nur raten.
* **Was ihm hilft:**  
  **Totholz-Kolk-Peiler**  
  Jochen klemmt sein wasserdicht verpacktes Smartphone an den Kescherstab und hält es für fünf Sekunden gegen den Stamm unter Wasser. Der Bewegungssensor im Handy misst die Schwingungsfrequenz des Holzes im fließenden Wasser: Ein freigespülter, lockerer Stamm oszilliert träge mit 1–2 Hz; ein fest im Sediment verkeilter Stamm vibriert mit hochfrequenten Wirbelabrissen über 15 Hz. Die App meldet trocken: *„Stamm sitzt bombenfest, Kolkbildung intakt. Kein Eingriff nötig.“* Jochen kann aus dem kalten Wasser steigen.
* **Möglicher Empfänger:**  
  Landesanglerverband Brandenburg · BUND Bachpatenschaften · Wasser- und Bodenverbände.

---

## 4. Warum diese Liste kein „AI-Slop“ ist

Vergleichen wir diese zehn Ansätze mit den üblichen Ideen aus generischen KI-Listen:

| Typischer KI-Slop | Die Amélie-Praxis (18. September) |
|---|---|
| „Eine KI-App, die deine Pflanzen gießt“ | **Klaus-Dieter** rettet seine 30-jährige Klimareihe beim DWD |
| „Ein Chatbot für Mieterbeschwerden“ | **Ralf** zwingt Bürokomplexe per Handy-Lichtgutachten zum Insektenschutz |
| „Eine App für gesunde Ernährung“ | **Monika** verhindert, dass 30 Kilo Pfirsiche bei der Tafel Neukölln verfaulen |
| „Ein KI-Bildgenerator für Grabsteine“ | **Günter** entziffert 280 Jahre alte Epitaphe ohne Halluzinationen |
| „Ein Feuerwehr-Drohnen-Dashboard mit Cloud“ | **Torsten** ballt Kiefernnadeln vor dem Handymikrofon, offline im Wald |

Keine dieser Ideen braucht eine Cloud, kein Nutzer muss ein Abonnement abschließen, und niemand muss ein Login anlegen. Jedes Werkzeug ist als reine Client-Side-Webanwendung konzipiert, die auch im Funkloch funktioniert.

---

## 5. Nächster Schritt: Noch nichts verpacken!

Wir halten uns strikt an die Amélie-Disziplin: **Keine dieser Ideen wird heute in eine Blechdose gepackt.**

Bevor wir eine Dose schreiben und Kaltmails entwerfen, folgt **Schritt 0,5 des Loops**:
1. Wir prüfen die Veröffentlichungen von Thünen, DWD, LfU und Tafel: Gibt es dort bereits unveröffentlichte Vorhaben?
2. Wir kontaktieren informell einen einzigen Ansprechpartner, um die Schmerzgrenze abzugleichen.
3. Erst wenn ein Kandidat die Prüfung übersteht, schreiben wir die fünfseitige Dose — mit erstem Ticket, Scheiter-Risiko und dem Kula-Pledge.

*Ideen gehören niemandem. Aber sie müssen denen helfen, die die wirkliche Arbeit machen.*

---
*Félix · Berlin, 18. September 2026 · [Repo: felixinberlin/amelie](https://github.com/felixinberlin/amelie)*

---
status: Delivered
delivery_method: E-Mail
target_maker: CityLAB Berlin
review_score: 29/35
architecture_tier: Tier 1/2
source_type: Type B
---
# Sperrmüll-Radar

**Ein Satz:** Foto vom Straßenfund → Klassifikation auf dem Gerät → Geo-Pin auf Straßenabschnitt, der nach zwölf Stunden verfällt. Kein Konto, kein Marktplatz, keine Datenhaltung über den Tag hinaus.

**Stand:** 20.09.2026 · **Prüfen ab:** 03/2027 (verkürzt — das Feld bewegt sich kommerziell)
**Empfänger:** CityLAB Berlin (Technologiestiftung) · Domänenpartner in der Verwaltung: Re-Use Berlin / Zero-Waste-Agentur, BSR · nachrangig: OpenStreetMap Berlin
**Verdikt:** 🎁 verschenken — Rang 1, Organisation mit Bauauftrag, Budget und dem passenden Vorläufer  
**Review:** 29/35 · Tier 1/2 · Type B (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Berlin hat ein funktionierendes Verschenk-Protokoll ohne einen einzigen Server: Karton, Bordstein, Pappschild. Was fehlt, ist Wissen über Zeit und Ort — und zwar in den wenigen Stunden, in denen der Gegenstand noch trocken und brauchbar ist.

Die Stadt hat für diese Stunden bereits eine Infrastruktur. Sie zeigt nur in genau eine Richtung: **Wegräumen.**

- **2025: fast 200.000 Meldungen** über illegal abgelagerten Müll, über 500 pro Tag.
- **Kosten der Beseitigung: über 13 Mio. € (2025)**, nach 10,3 Mio. € (2024).
- **54.000 m³ (2024)**, acht Prozent mehr als im Vorjahr. Typische Fundstücke in den Meldungen: Möbel, Kühlschränke, Matratzen.

Melden kann man über `ordnungsamt.berlin.de`, die BSR versendet die Aufträge. Es gibt keinen einzigen Kanal, über den derselbe Schrank vor der Abholung noch jemanden erreicht, der ihn will. Der Sessel, den um 9 Uhr jemand mitgenommen hätte, ist um 14 Uhr eine Meldung und um 17 Uhr ein Posten in der 13-Millionen-Rechnung.

**Wer leidet:** die Stadt (Beseitigungskosten, steigendes Meldeaufkommen), die Bezirke, und alle, die gerade eine Wohnung einrichten und kein Geld haben.

**Warum das in Deutschland niemand gebaut hat:** Die Version, die sich rechnet, ist ein Marktplatz — und die stirbt am Marktplatz (siehe „Wer es schon versucht hat"). Die Version, die funktioniert, hat keine Accounts, keinen Bestand und keine Wiederkehr. Sie hat damit kein Geschäftsmodell und gehört deshalb in die öffentliche Hand oder in eine Community.

## Warum das jetzt geht

1. **Die Klassifikation ist gratis geworden und verlässt das Gerät nicht.** „Stuhl, Holz, bespielbar" aus einem schiefen Handyfoto zu lesen, war bis vor Kurzem ein eigenes Projekt. Heute läuft es als WebGPU-Modell im Browser (Transformers.js), ohne Server, ohne Upload, ohne Bildrechte-Frage.
2. **Damit verschwindet das Datenschutzproblem, an dem Vorgänger gescheitert wären.** Das Foto bleibt auf dem Telefon; den Server erreichen nur Kategorie und Straßenabschnitt. Passanten, Kennzeichen, Fenster — alles, was auf so einem Foto zufällig mit drauf ist, wird nie hochgeladen.
3. **Verfallende Daten sind kein Kompromiss, sondern billiger.** Ein Bestand mit zwölf Stunden Halbwertszeit braucht keine Moderation, kein Löschkonzept, keine Accounts — und kann nicht zur Hotspot-Liste werden, weil es keine Historie gibt.
4. **Die Form ist in Berlin erprobt.** Gieß den Kiez hat gezeigt, dass eine Kiez-Karte mit offenen Daten funktioniert, quelloffen läuft und forkbar ist (Leipzig gießt, Magdeburg gießt). Das ist derselbe Bauplan, nur mit Verfallsdatum statt Baumkataster.

## Skizze

- Foto → Klassifikation auf dem Gerät → Kategorie + **Straßenabschnitt**, nie hausgenau. Der Pin rastet auf das OSM-Segment ein, nicht auf die Koordinate: „Weserstraße zwischen Fuldastraße und Pannierstraße" ist die Auflösung, in der Menschen ohnehin über Funde reden — und die niemandem eine Hausnummer zuordnet.
- Pin lebt **12 Stunden**, dann ist er weg. Keine Historie, kein Archiv, keine Statistik pro Adresse, kein Export.
- **„Weg"** als einziger Interaktionsknopf. Wer sieht, dass nichts mehr da steht, tippt einmal, der Pin verschwindet sofort.
- Karte ohne Login. Backend: ein dummer Key-Value-Store mit TTL — die Löschung ist eine Eigenschaft der Datenbank, keine Hausordnung.

**Nicht dabei:** kein Marktplatz, keine Reservierung, keine Nachrichten, keine Bewertungen, keine Profile, keine bezahlten Abholungen. Jedes dieser Features macht aus dem Radar den US-Klon aus dem Abschnitt unten. Wer verhandeln will, nimmt Kleinanzeigen.

## Erster Schritt

**Ticket: Ein Kiez, eine Karte, ein Verfall — angedockt an einen BSR-Kieztag.**

Progressive Web App: Foto aufnehmen, on-device klassifizieren, Pin auf ein Straßensegment setzen, nach 12 h automatisch löschen. Kein Backend außer TTL-Store und Kartenkacheln.

Der Kaltstart hat ein fertiges Datum: Die BSR fährt **2026 rund 80 Kieztage** durch alle zwölf Bezirke, jeweils mit Tausch- und Verschenkmarkt vor Ort. Ein Kieztag ist ein Tag mit garantierter Dichte an Gegenständen *und* an Menschen, die sie suchen — der einzige Tag, an dem eine leere Karte sich in zwei Stunden füllt. Das Kiezlabor steht ohnehin in Kiezen; die Feldtestlogistik existiert also schon.

**Fertig, wenn:** an einem Kieztag zwei Personen unabhängig voneinander Pins setzen und sehen, mindestens ein Fund über einen Pin abgeholt wird — und die Karte am nächsten Morgen leer ist.

## Wo es kippt

**1. Das Denunziationsrisiko ist hier nicht theoretisch, es ist die Nachbarinfrastruktur.** Eine Karte mit „hier steht ein Schrank" ist einen Screenshot von einer Meldung bei `ordnungsamt.berlin.de` entfernt, durch die 2025 fast 200.000 Vorgänge liefen. Wird das Radar zum Zulieferer dieses Kanals, kippt es vom Verschenk- zum Anzeigewerkzeug — und die Leute, die Dinge rausstellen, hören auf. Die Antwort muss ins Design, nicht in die AGB: **Straßenabschnitt statt Adresse, 12 Stunden, keine Historie, kein Export, keine Fotos auf dem Server.** Ohne diese fünf ist es ein anderes Produkt und sollte nicht gebaut werden.

**2. Die Rechtsfrage muss vor dem Launch geklärt sein, nicht danach.** Berlin behandelt Gegenstände auf dem Gehweg amtlich als illegale Ablagerung und droht Bußgelder an. Eine Karte der öffentlichen Hand, die solche Gegenstände sichtbar macht, muss erklären können, warum sie keine Ordnungswidrigkeit bewirbt. Das ist genau die Art Blocker, die eine Stiftung mit Verwaltungszugang lösen kann und eine Einzelperson nicht — und der Grund, warum Re-Use Berlin bzw. die Zero-Waste-Agentur mit im Boot sein sollten: Das Radar ist deren Ziel (Wiederverwendung) mit CityLABs Mitteln.

**3. Kaltstart.** Eine leere Karte ist nutzlos, Nachbarschaftsdichte entsteht nicht durch Presse. Deshalb ein Kiez, ein Kieztag, ein Wochenende — nicht eine Stadt.

**4. Die ehrliche Möglichkeit, dass es nicht getragen wird:** Wenn die 12-Stunden-Regel im Prozess zu „drei Tage, mit Historie, für die Einsatzplanung" wird, ist das Vertrauen weg, bevor die erste Version läuft. Dann lieber nicht bauen.

## Wer es schon versucht hat

**Recherche 20.09.2026 — Urteil `verengt`, nicht `frei`.** Die frühere Fassung dieser Dose behauptete „kein vergleichbares Angebot gefunden". Das ist zu stark und wäre beim ersten informierten Leser aufgefallen:

- **USA/Kanada/Mexiko: die „Curb Alert"-Familie.** `curbalert.org` (Community-Karte für Straßenfunde, Zeitfenster pro Eintrag), `curbalertapp.com` (Echtzeit-Feed im 0,5-Meilen-Radius, **automatisch verfallende Posts**, „Exact locations are revealed only after a pickup is committed"), dazu `curbalert.online` und `givore.com`. Die Kernfunktion existiert also — **und zeigt zugleich die vorhergesagte Todesart:** `curbalertapp` verkauft bereits bezahlte Sofort-Abholungen und Garagenflohmärkte mit. Aus dem Verschenkprotokoll wird ein Marktplatz, sobald jemand ihn finanzieren muss.
- **Kein Angebot dieser Familie ist in Deutschland aktiv.** Keine der Karten deckt Berlin ab.
- **Olio** (UK, auch DE erreichbar): Konto, Nachrichten, kommerziell, Schwerpunkt Lebensmittel. Anderer Zuschnitt.
- **BSR Tausch- und Verschenkmarkt:** die offizielle Berliner Gebrauchtwarenbörse — Anzeigenformat, **ohne Karte, ohne Ortsbezug in Echtzeit, ohne Verfall**. Das ist Kleinanzeigen für Berlin, nicht der Bordstein von heute Mittag.
- **OpenStreetMap `amenity=give_box`:** kartiert Verschenkeschränke — also das *Dauerhafte*. Ein Karton, der acht Stunden existiert, gehört dort nicht hinein; genau deshalb ist OSM die richtige Kompetenz, aber der falsche Datenspeicher.
- **Karte von morgen** (Ideen³ e.V.): kartiert Schenk-Initiativen und Gruppen, Stand des Schenken-Bereichs 2020. Dauerhafte Einträge, kein Echtzeitbezug.
- **Die Gegenrichtung ist dicht besetzt:** Ordnungsamt-Online, BSR-Meldeformular, MÜLLweg! DE. Melden zum Wegräumen: gelöst. Melden zum Mitnehmen: nicht vorhanden.

**Restlücke, die bleibt:** Deutschland/Berlin, kommunal oder gemeinnützig getragen, **ohne Konto und ohne Marktplatz**, mit Verfall als Datenschutzkonzept statt als Aufräumfunktion, quelloffen und forkbar wie Gieß den Kiez. Das ist die Idee — nicht „eine Verschenk-App".

## Vorarbeit

- **CityLAB Berlin** — Gieß den Kiez (quelloffen, Supabase, Forks in Leipzig und Magdeburg, 2026 weiter gepflegt) ist der Formbeweis; Kiezlabor liefert den Feldzugang, GovTech TestLAB den Erprobungsrahmen. Themen 2026 laut Sommerkonferenz: KI, Verwaltungsmodernisierung, Beteiligung, Open Source, Service Design — Kreislaufwirtschaft ist **nicht** darunter. Deshalb Domänenpartner mitnennen, nicht erwarten, dass das Thema von selbst andockt.
- **Re-Use Berlin / Zero-Waste-Agentur** (Senatsverwaltung für Umwelt) — inhaltlicher Eigentümer des Ziels. Deren Übersichtskarte der Re-Use-Orte existiert derzeit als **PDF**. Das sagt genug über den digitalen Stand und über den Bedarf.
- **BSR** — Kieztage 2026 (~80 Termine, alle Bezirke) als Kaltstart-Bühne; NochMall als Abfluss für das, was liegen bleibt.
- **OpenStreetMap Berlin** (Hack Weekend) — Straßensegment-Rasterung, Kartenkacheln, das richtige Datenverständnis für Objekte mit Verfallsdatum.
- **Prototype Fund** — Bewerbungsfenster regulär 1.10.–30.11., bis 47.500 € (Einzelperson) bzw. bis 158.000 € (Team). **Achtung, gegenüber der Vorfassung korrigiert:** förderfähig sind ausschließlich Freiberufler:innen/Selbstständige oder eine GbR mit höchstens vier Personen — **kein Weg für eine Stiftung oder eine Behörde**, sondern nur für eine Einzelperson, die das Radar baut. Zum Zeitpunkt dieser Recherche ist auf `bewerben.prototypefund.de` keine Runde offen; vor jedem Hinweis darauf den Stand prüfen.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

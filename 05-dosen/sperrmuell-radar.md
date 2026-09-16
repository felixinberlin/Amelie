# Sperrmüll-Radar

**Ein Satz:** Foto vom Straßenfund → Klassifikation → Geo-Pin, der nach zwölf Stunden verfällt. Kein Account, kein Besitz, keine Datenhaltung über den Tag hinaus.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** CityLAB Berlin (Technologiestiftung) · nachrangig: BSR, OpenStreetMap Berlin, Prototype Fund
**Verdikt:** 🎁 verschenken — Rang 1, Organisation mit Bauauftrag und Budget

---

## Das Problem

Berlin hat ein funktionierendes Verschenk-Protokoll ohne einen einzigen Server: Karton, Bordstein, Pappschild. Es ist so etabliert, dass die Stadt darüber streitet, ob es Nächstenliebe oder getarnte Müllentsorgung ist.

Der einzige fehlende Teil ist Wissen über Zeit und Ort. Wer ein Regal braucht, läuft an dreißig Kartons vorbei, die gestern noch voll waren. Wer etwas rausstellt, weiß nicht, ob es in zwei Stunden mitgenommen oder in zwei Tagen von der BSR abgeholt wird. Das Ergebnis ist ein Kreislauf, der zu langsam ist: Brauchbare Dinge stehen so lange im Regen, bis sie Müll sind, und werden dann als Müll behandelt.

Wer leidet: die Stadt (Entsorgungskosten, Beschwerdeaufkommen), die Bezirke, und alle, die gerade eine Wohnung einrichten und kein Geld haben.

**Warum das niemand gebaut hat:** Es lässt sich damit kein Geld verdienen. Eine App ohne Accounts, ohne Bestand und ohne Wiederkehr hat kein Geschäftsmodell. Genau deshalb gehört sie in die öffentliche Hand oder in eine Community.

## Warum das jetzt geht

1. **Die Klassifikation ist gratis geworden.** „Stuhl, Holz, bespielbar" aus einem schiefen Handyfoto zu lesen war bis vor Kurzem ein eigenes Projekt. Heute ist es ein Aufruf und läuft on-device.
2. **On-device heißt: keine Bilder auf einem Server.** Das Foto muss die Stadt nicht verlassen; nur Kategorie und Koordinate. Damit fällt das gesamte Datenschutzproblem weg, an dem Vorgänger gescheitert wären.
3. **Verfallende Daten sind kein Kompromiss mehr, sondern billiger.** Ein Datenbestand mit zwölf Stunden Halbwertszeit braucht keine Moderation, keine Löschkonzepte, keine Accounts.

## Skizze

- Foto → On-device-Klassifikation → Kategorie + grobe Koordinate (auf ~50 m gerundet, nie hausgenau).
- Pin lebt **12 Stunden**, danach ist er weg. Keine Historie, kein Archiv, keine Statistik über Adressen.
- „Weg" als einziger Interaktionsknopf: Wer sieht, dass nichts mehr da ist, tippt einmal, der Pin verschwindet sofort.
- Karte ohne Login. Keine Nachrichten, keine Reservierung, kein Chat — das sind die Features, an denen Verschenk-Apps sterben.

**Nicht dabei:** kein Marktplatz, keine Bewertungen, keine Reservierung, keine Profile. Wer verhandeln will, nimmt Kleinanzeigen.

## Erster Schritt

**Ticket: Ein Bezirk, eine Karte, ein Verfall.**

Progressive Web App: Foto aufnehmen, Klassifikation on-device, Pin auf eine Karte setzen, nach 12 h automatisch löschen. Kein Backend außer einem dummen Key-Value-Store mit TTL.

**Fertig, wenn:** zwei Personen unabhängig voneinander in einem Kiez Pins setzen und sehen, und am nächsten Morgen die Karte leer ist.

## Wo es kippt

**Die Missbrauchsfrage kommt sofort, und sie ist berechtigt:** Eine Karte mit „hier steht Sperrmüll" ist aus Verwaltungssicht eine Karte mit „hier liegt Müll" — also potenziell ein Denunziationswerkzeug oder eine Hotspot-Liste. Die Antwort muss ins Design, nicht in die AGB: **grobe Koordinaten, kurze Verfallszeit, keine Historie, keine Fotos auf dem Server.** Ohne diese vier ist es ein anderes Produkt und sollte nicht gebaut werden.

**Zweites Risiko:** Kaltstart. Eine leere Karte ist nutzlos, und Nachbarschafts-Apps brauchen Dichte. Deshalb ein Kiez zuerst, nicht eine Stadt — und deshalb ist eine Organisation mit lokaler Reichweite der richtige Träger, nicht ein Einzelentwickler.

## Wer es schon versucht hat

Recherche September 2026: **kein vergleichbares Angebot für Berlin gefunden.** Das Phänomen ist medial präsent, kommunale Apps existieren für Abfuhrtermine (z. B. kommunale Stadtreinigungs-Apps), aber nicht für den Bordstein in Echtzeit. Die Lücke besteht.

## Vorarbeit

- **CityLAB Berlin / GovTech TestLAB** — Prototypen für die Verwaltung, Kiezlabor als Feldzugang.
- **BSR** — fährt Sperrmüllaktionen in den Bezirken; eine Echtzeitkarte senkt Abholvolumen.
- **OpenStreetMap Berlin** (Hack Weekend) — genau das richtige Datenverständnis für verfallende Geo-Objekte.
- **Prototype Fund** — ab 1. Oktober, Open-Source-Pflicht, passt im Zuschnitt.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

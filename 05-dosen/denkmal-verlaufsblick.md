---
status: Available
delivery_method: E-Mail
target_maker: Deutsche Stiftung Denkmalschutz
---
# Denkmal-Verlaufsblick

**Ein Satz:** Ehrenamtliche fotografieren ein gefährdetes Baudenkmal immer vom selben Standpunkt; ein Werkzeug legt die Bilder übereinander und markiert, was sich seit dem letzten Mal verändert hat (Putz ab, Dachfläche eingebrochen, Öffnung neu vernagelt).

**Stand:** 19.09.2026 · **Prüfen ab:** März 2027 (aktives Forschungsfeld, 6 Monate)
**Empfänger:** Deutsche Stiftung Denkmalschutz (Schwarzbuch-Team / ehrenamtliche Beiräte) · nachrangig: Landesdenkmalämter mit Bürgerportal (z. B. BLfD Bayern)
**Verdikt:** 🎁 verschenken — Prämisse verengt, siehe „Wer es schon versucht hat"

---

## Das Problem

Gefährdete Baudenkmale verfallen meist nicht durch ein Ereignis, sondern durch Leerstand über Jahre. Wer das beobachtet, sind Anwohner:innen und Ehrenamtliche — sie haben aber keinen Weg, „es wird schlechter" so festzuhalten, dass ein Amt oder eine Stiftung es als Verlauf lesen kann.

Das, was existiert, ist punktuell oder rückblickend: Die Deutsche Stiftung Denkmalschutz führt ein **Meldeportal** für akut gefährdete oder in den letzten zwei Jahren verlorene Denkmale (auch anonym) und veröffentlicht daraus das **Schwarzbuch der Denkmalpflege** — laut Stiftung zuletzt 324 Seiten zu den Jahren 2024/25, über 1.000 verlorene Denkmale. Das ist ein Verlustverzeichnis. Was fehlt, ist die Zeit *davor*: der Verlauf, an dem man sieht, dass es zu spät wird, bevor es zu spät ist.

Wer leidet: Ortskuratorien und Ehrenamtliche der Stiftung, die einen Zeitpunkt für ihr Eingreifen brauchen; Denkmalämter, die für Bürgerhinweise zwar ein Portal haben, aber keine Verlaufsdaten.

## Warum das jetzt geht

1. **Wiederholte Fotos deckungsgleich zu bekommen ist Standardcode.** Ausrichtung per Merkmalsabgleich gegen ein Referenzfoto ist heute eine Bibliotheksfunktion; früher war der Aufwand der Grund, warum niemand Zeitreihen von Laien-Fotos erwartete.
2. **Bildverständnis in Alltagssprache.** Ein Vision-Language-Modell kann aus zwei ausgerichteten Fotos einen Satz wie „an der Nordost-Ecke ist der Putz auf etwa einem Quadratmeter neu abgefallen" formulieren. Ob das für Denkmalfragen zuverlässig genug ist, ist offen (siehe „Wo es kippt") — aber die Rolle „ein erster Hinweis für Menschen" wäre vor wenigen Jahren nicht ohne eigenes Trainingsprojekt möglich gewesen.
3. **Forschung zeigt die Bausteine.** Für Fachleute sind KI-gestützte Zustandserfassung und Verfallsüberwachung an Baudenkmalen 2025/26 in Papers vorhanden (u. a. eine Handy-App zur Fliesenschädigung, eine Low-Code-Monitoring-App für Steinkonsolen — siehe Vorarbeit). Was diese Arbeiten übergehen, ist der Laie mit dem Handy.

## Skizze

- **Standpunkt anlegen:** Erstfoto mit Ortsmarke, Kompassrichtung und einem Halbtransparent-Overlay für spätere Aufnahmen vom selben Punkt.
- **Wiederholung:** Alle x Wochen ein Foto; Overlay hilft beim Ausrichten.
- **Vergleich:** Ausrichten, Änderungen markieren, ein Satz Beschreibung — **als Vorschlag mit Konfidenz, nie als Befund**.
- **Verlauf:** Zeitleiste pro Objekt, ein Klick erzeugt ein Verlaufsblatt (Bilder, Daten, Text) zum Anhängen an eine Meldung beim Amt oder im Meldeportal der Stiftung.

**Nicht dabei:** keine Statik- oder Schadensbewertung, kein Ersatz für Schadenskartierung durch Restaurator:innen, keine öffentliche Karte gefährdeter Gebäude (Vandalismus- und Diebstahlrisiko), kein Betreten von Grundstücken.

## Erster Schritt

**Ticket: Zwei Fotos, ein Overlay, ein Vergleichsblatt.**

Web-App, die ein Referenzfoto als halbtransparentes Overlay in die Kamera legt, ein zweites Foto aufnimmt, beide ausrichtet und als Schiebe-Vergleich plus PDF-Blatt exportiert. Keine KI im ersten Schritt.

**Fertig, wenn:** eine Ehrenamtliche denselben Standpunkt nach vier Wochen ohne Anleitung so trifft, dass Ausrichtung und Vergleich ohne Handarbeit klappen. Erst danach lohnt die Änderungserkennung.

## Wo es kippt

**Erstens: Falschalarm gegen Vertrauen.** Licht, Jahreszeit, Bewuchs und Schatten verändern Fotos stärker als Putz. Ein Werkzeug, das ständig „Schaden!" meldet, ist nach zwei Wochen aus. Gegenmaßnahme: Erst die Ausrichtung und den Schiebe-Vergleich liefern (Mensch beurteilt), Änderungserkennung nur als schwacher Hinweis.

**Zweitens: Wer nutzt es tatsächlich?** Die Idee setzt Ehrenamtliche voraus, die dranbleiben. Ob die Stiftung solche Beobachter:innen hat, die *wiederholt* hinsehen (statt einmal zu melden), habe ich nicht belegt — ich weiß nur, dass es über 80 ehrenamtlich organisierte Beiräte gibt (Schnipsel der Stiftungsseite), nicht was sie konkret tun.

**Drittens: Rechtliches.** Fotografieren aus dem öffentlichen Raum ist etwas anderes als von einem Privatgrundstück; Personen im Bild; der Eigentümer sieht die Dokumentation als Anschuldigung. Das ist nicht geprüft.

## Wer es schon versucht hat

Recherche 19.09.2026 (vier Suchen, Empfänger zuerst; alles aus Suchtreffern, Portale selbst nicht gelesen):

- **Deutsche Stiftung Denkmalschutz:** Meldeportal + Schwarzbuch (rückblickend, Verlustverzeichnis). In den Treffern keine Verlaufsbeobachtung und keine KI erwähnt — kein Beleg, dass es sie nicht gibt.
- **Landesdenkmalämter:** Das BLfD Bayern führt ein „Bürgerportal Denkmalpflege" für Vereine, Stiftungen und Initiativen — Beratung und Förderung, laut Treffern keine Foto-Verlaufsdaten. Das Berliner Landesdenkmalamt hat einen Leitfaden für restauratorische Dokumentation (Kartierung, Schadbildkataloge) — Fachleute-Werkzeug, kein Bürgerinstrument.
- **Profi-Software:** Metigo MAP und KALIV digitalisieren die *Schadenskartierung* durch Restaurator:innen. Das ist ein anderer Nutzer (Fachleute), anderes Ziel (Maßnahmenplanung), und damit gerade nicht diese Idee.
- **Forschung:** Vision-basierte Verfallserkennung an Denkmalen ist aktiv (Fliesen-App, Steinkonsolen-Monitoring, Review „AI-assisted visual inspection for cultural heritage" u. a.). Diese Werkzeuge richten sich an Fachpersonal; ein Suchtreffer weist darauf hin, dass Systeme für Nicht-Fachleute und Ehrenamtliche oft keine Anleitung bieten — Zuordnung zur genauen Quelle nicht gesichert.

**Konsequenz:** Die Idee „KI erkennt Denkmalschäden" ist nicht frei. Frei ist — soweit gefunden — die Rolle *Laien-Verlauf für gefährdete Objekte, mit Weg zur Meldung*. Das ist deutlich schmaler als der Titel klingt.

## Vorarbeit

- **Deutsche Stiftung Denkmalschutz:** Meldeportal https://www.denkmalschutz.de/denkmale-melden.html, Schwarzbuch https://www.denkmalschutz.de/denkmale-erhalten/schwarzbuch-der-denkmalpflege.html, Ehrenamt https://www.denkmalschutz.de/spenden-helfen/selbst-aktiv-werden/als-ehrenamtler.html
- **BLfD Bürgerportal:** https://www.blfd.bayern.de/blfd/ansprechpersonen/bau-kunstdenkmaeler/buergerportal/index.html
- **Metigo MAP / KALIV** (Romoe-Netzwerk): https://www.romoe.com/de/produkte/software/metigo
- **Forschung:** Handy-App Fliesenschädigung, ScienceDirect S1296207426001548 · Steinkonsolen-Monitoring, Springer 10.1007/978-3-031-98379-5_27 (nur aus Titel/Schnipsel bekannt) · Review AI-assisted visual inspection for cultural heritage, ScienceDirect S1296207424000050
- **Verwandte Dose:** `crack-flora-watcher.md` — gleiches Prinzip (Longitudinalspur derselben Sache statt neuer Funde), anderes Feld.

*Kontaktadresse beim Zustellen von der jeweiligen Organisationsseite kopieren, nicht raten — hier bewusst nicht eingetragen.*

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

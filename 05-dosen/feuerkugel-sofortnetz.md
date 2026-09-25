---
status: Available
delivery_method: E-Mail
target_maker: American Meteor Society und IMO
review_score: 29/35
architecture_tier: Tier 2/3
source_type: Type D
---
# Feuerkugel-Sofortnetz

**Ein Satz:** Eine Echtzeit-Schicht über bestehenden Feuerkugel-Meldenetzen, die Zeugen in den ersten Minuten aktiv zusammenbringt und beiläufig laufende Dashcam-/Türklingelkameras vor dem automatischen Überschreiben rettet — statt beides tagelang dem Zufall zu überlassen.
**Stand:** 18.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** American Meteor Society und IMO (bestehende Meldenetze) · nachrangig: Global Meteor Network, Betreiber bestehender Warn-Apps mit Nutzerbasis
**Verdikt:** 🎁 verschenken  
**Review:** 29/35 · Tier 2/3 · Type D (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

## Das Problem

Wer eine Feuerkugel sieht, meldet sie – wenn überhaupt – Stunden oder Tage später über ein Webformular (AMS, IMO), aus dem Gedächtnis, ohne zu wissen, ob irgendjemand sonst in der Nähe dasselbe gesehen hat. Die American Meteor Society sagt es selbst: Auswertung und Gruppierung der Meldungen passieren nachträglich, nicht in Echtzeit. Ergebnis: Die meisten Ereignisse erreichen nie die kritische Masse unabhängiger Zeugen, die für eine Bahnbestimmung nötig ist – nicht weil zu wenige Menschen es gesehen haben, sondern weil niemand sie in den ersten Minuten zusammenbringt, während die Erinnerung an Richtung und Zeitpunkt noch frisch ist. Parallel dazu filmen längst mehr private Dashcams und Türklingelkameras den Himmel als je eine Astro-Kamera – aber deren Aufnahmen werden binnen 24–48 Stunden automatisch überschrieben, weil kein Mensch und keine Software auf den einen Sekundenbruchteil Lichtblitz wartet.

## Warum das jetzt geht

Zwei Dinge, die vor kurzem noch fehlten: Geofenced-Push an alle Nutzer:innen einer App in einem Umkreis von wenigen Kilometern ist heute Standardinfrastruktur (Wetterwarn-Apps, Waldbrand-Apps wie Watch Duty machen es vor). Und Bewegungs-/Helligkeitserkennung für „kurzer, sehr heller Streifen am Nachthimmel" läuft inzwischen lokal auf Dashcam-Chips oder als Begleit-App auf dem Handy, ohne Cloud-Vision-Kosten – die Modelle, die das billig genug machen, gibt es erst seit ein bis zwei Jahren.

## Skizze

- **Baustein 1 – Sofort-Rekrutierung:** Erste Meldung (Zeit, grober Ort) triggert Geofenced-Push an Nutzer:innen im Umkreis (~50 km, ~20 Min. Fenster): „Hast du das auch gesehen?" – mit strukturiertem Mini-Formular statt Fließtext, damit die Angaben sofort vergleichbar sind.
- **Baustein 2 – Ambient-Rettung:** Kleine On-Device-Erkennung (Dashcam-Firmware oder Begleit-App), die einen kurzen, sehr hellen, schnellen Streifen erkennt und lokal „diesen Clip nicht überschreiben, optional teilen" markiert – rein lokal, kein Dauerstreaming, Opt-in fürs Teilen.
- Beide Bausteine speisen in das bestehende Meldeformat (AMS/IMO-kompatibel) ein, ersetzen die institutionelle Auswertung nicht.
- **Nicht dazu gehört:** keine neue Kamera-Hardware, keine eigene Bahnberechnung (die macht AMS/IMO/Global Meteor Network schon), keine Wetter-/Störgeräusch-Filterung für Baustein 2 in Version 1.

## Erster Schritt

Baustein 1 zuerst als eigenständiges Feature bauen: ein Telegram-/Push-Bot, der an einen bestehenden Feuerkugel-Melde-Feed (z. B. AMS-RSS oder Global Meteor Network) andockt und bei neuer Meldung Nutzer:innen in der Nähe benachrichtigt. Fertig, wenn ein echtes Ereignis innerhalb von 20 Minuten mindestens eine zusätzliche, strukturierte Zeugenmeldung erzeugt hat, die es ohne den Push nicht gegeben hätte.

## Wo es kippt

Baustein 1 funktioniert nur, wenn genug Menschen die App vorher installiert haben – kaltstartet man mit null Nutzer:innen, gibt es niemanden zum Rekrutieren. Gegenmaßnahme: an eine bestehende Nutzerbasis andocken (Wetter-App, Astronomie-App, lokale Warn-App) statt eine neue App zu launchen. Baustein 2 kippt an Fehlalarmen (Blitzlicht, Autoscheinwerfer, Kameraflackern) – ohne guten Filter ist die Löschquote falscher Treffer höher als die Rettungsquote echter.

## Wer es schon versucht hat

Bestehende Infrastruktur deckt die Bausteine explizit **nicht** ab:
- **AMS / IMO Fireball Report:** sammelt Meldungen webbasiert, gruppiert sie aber nachträglich – die AMS-eigene Beschreibung nennt die Daten ausdrücklich nicht echtzeitfähig.
- **FRIPON:** kombiniert Radio- und Video-Stationen für Echtzeit-Trajektorien, aber mit eigens installierten Profi-Stationen, nicht mit Bürger-Handys/Dashcams und ohne aktives Zeugen-Recruiting.
- **AllSky7 / Global Meteor Network / CAMS:** dedizierte, nach oben gerichtete Astro-Kameras (Himmels-Ganzjahresüberwachung), kein Bezug zu gewöhnlichen Dashcams/Türklingelkameras, die zufällig mitfilmen.
- **RedVox:** deckt die Infraschall-Route ab (Handy-Barometer/Mikrofon erkennt Bolide-Signaturen) – ein verwandter, aber anderer Sensorkanal; dieser Ansatz wurde deshalb aus dieser Dose gestrichen.
- Kein gefundenes Werkzeug verbindet „Push-Rekrutierung in den ersten Minuten" oder „Ambient-Dashcam-Rettung vor Überschreiben" mit dem bestehenden Meldefluss.

Urteil: **verengt** – die Bahnberechnung selbst ist besetzt (AMS/IMO/FRIPON/GMN), die Echtzeit-Zuführung von Zeugen und beiläufigem Kamerafootage in diese bestehenden Systeme ist es nicht.

## Vorarbeit

- [AMS Fireball Report / FAQ](https://www.amsmeteors.org/fireballs/faqf/) – Meldeformular, Triangulationsmethode, „nicht in Echtzeit"
- [IMO Fireball Report Program](https://www.imo.net/observations/fireballs/fireball-report-program/)
- [FRIPON](https://arxiv.org/pdf/2111.09742) – Radio+Video-Kombination, professionelle Stationen
- [Global Meteor Network / AllSky7](https://www.allskycams.com/) – offene Kamera-Community, RMS-Software (Raspberry Pi)
- [RedVox – Infraschall-App](https://www.khon2.com/local-news/app-allows-you-to-measure-infrasound-with-your-mobile-device/) – belegt die Infraschall-Route als bereits besetzt
- Watch Duty (Wikipedia) – Vorbild für Geofenced-Push bei Naturereignissen

---
Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir
nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du
nicht bauen wirst, gib sie jemandem, der es tut.
CC0 / Public Domain. — Félix, Berlin

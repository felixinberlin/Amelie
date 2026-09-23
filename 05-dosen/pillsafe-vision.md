---
status: Available
delivery_method: E-Mail
target_maker: Pflegestützpunkte Deutschland
---
# PillSafe Vision

**Ein Satz:** Ein Foto der 7-Tage-Dosette schützt pflegende Angehörige vor lebensgefährlichen Verwechslungen — multimodale Erkennung von Pillenprägung und Farbe gleicht alles mit dem Medikationsplan ab.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Pflegestützpunkte Deutschland · BAGSO (Seniorenorganisationen) · Pflegende Angehörige e.V.
**Verdikt:** 🎁 verschenken

---

## Das Problem

Über 4 Millionen Menschen pflegen Angehörige zuhause. Polymedikation (5 bis 12 verschiedene Tabletten täglich) führt bei Erschöpfung regelmäßig zu fatalen Doppelgaben oder Verwechslungen weißer Generika-Tabletten.

## Warum das jetzt geht

- Multimodale Vision-Modelle erkennen mikroskopische Pillenprägungen (z.B. Bruchrillen, Ziffern) selbst bei ungünstigem Küchenlicht.
- WebAssembly/WebGPU ermöglicht vollständige Bildanalyse im Browser ohne Übertragung intimer Patientendaten an fremde Clouds.
- Standardisierte BMP-QR-Codes auf deutschen Arztbriefen lassen sich sekundenschnell einscannen.

## Skizze

Kamera erfasst 7x4 Dosetten-Gitter. Ein Segmentierungsmodell isoliert jedes Fach. Ein Zero-Shot Vision-Modell zählt Tabletten und verifiziert Form/Prägung. Farbige Ampel zeigt sofort: „Mittwoch Mittag fehlt Blutdrucksenker".

## Erster Schritt

**Ticket:** P0: 4-Fächer-Dosette Foto-Segmentierung und Pillenzählung.

Erkennt bei 10 realen Testfotos die exakte Tablettenanzahl pro Fach mit 95% Genauigkeit.

## Wo es kippt

Falsche Sicherheit bei identisch aussehenden weißen Tabletten ohne Prägung: Das System muss bei Unklarheit explizit warnen („Tablette 3 nicht eindeutig unterscheidbar, bitte Beipackzettel prüfen") statt zu raten.

## Wer es schon versucht hat

Kommerzielle Apotheken-Blisterautomaten kosten 50.000 €; für private Familien gab es bisher nur manuelle Zettel.

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs pillsafe-vision`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

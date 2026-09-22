# DienstplanWächter (Shift Roster Auditor & Bonus Shield)

**Ein Satz:** Fotografiert den Stations-Dienstplan, warnt vor illegalen Ruhezeitverkürzungen und berechnet steuerfreie Nacht- und Sonntagszuschläge.

**Stand:** 17.09.2026 · **Prüfen ab:** 10/2026
**Empfänger:** ver.di Fachbereich Gesundheit · DBfK Deutscher Berufsverband für Pflegeberufe · Junge Pflege
**Verdikt:** 🎁 verschenken

---

## Das Problem

Pflegekräfte rotieren durch zermürbende Schichten. Wegen handschriftlich korrigierter Aushänge gehen monatlich bis zu 300 € an Zuschlägen verloren, während illegale "Spät-auf-Früh"-Wechsel die Gesundheit zerstören.

## Warum das jetzt geht

- Multimodale Vision liest selbst unleserliche Kuli-Korrekturen und Pfeile auf laminierten Stations-Plänen.
- Edge-Modelle vergleichen Schichtfolgen lokal mit § 5 ArbZG und Tarifverträgen (TVöD-K, AVR) in Sekunden.
- Datenschutz: Keine Patientendaten, keine Cloud-Speicherung — schützt die Privatsphäre des Pflegepersonals.

## Skizze

Foto des Dienstplan-Ausschnitts machen. Eigene Zeile antippen. KI berechnet Netto-Zuschläge (25% Nacht, 50% Sonntag, 35% Feiertag) und prüft 11-Stunden-Ruhezeit. Export als Gehalts-Prüfprotokoll.

## Erster Schritt

**Ticket:** P0: Tabellen-Segmentierung für 1-Wochen-Dienstplan mit Erkennung der Schichtkürzel F, S, N.

Erkennt bei 10 verschiedenen Schriftbildern 95% der Schichtkürzel und berechnet Stundensummen fehlerfrei.

## Wo es kippt

Schlechtes Licht im Stations-Pausenraum: Bildverbesserungs-Filter (Grauwert-Spreizung und Schärfung) vor der Erkennung zwingend erforderlich.

## Wer es schon versucht hat

Bestehende Krankenhaus-Dienstplan-Software (z.B. SP-Expert) ist für das Management gebaut, nicht für den rechtlichen Selbstschutz der Arbeitnehmer.

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs dose-nurse-shift-guardian`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

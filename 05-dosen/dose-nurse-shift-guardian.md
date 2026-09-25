---
status: Available
delivery_method: E-Mail
target_maker: ver.di Fachbereich Gesundheit
review_score: 32/35
architecture_tier: Tier 1/2
source_type: Type A
---
# DienstplanWächter (Shift Roster Auditor & Bonus Shield)

*(englisch: Shift Roster Auditor & Statutory Bonus Shield)*

**Ein Satz:** Fotografiert den Stations-Dienstplan, warnt vor illegalen Ruhezeitverkürzungen und berechnet steuerfreie Nacht- und Sonntagszuschläge.

**Stand:** 17.09.2026 · **Prüfen ab:** März 2027
**Empfänger:** ver.di Fachbereich Gesundheit · DBfK Deutscher Berufsverband für Pflegeberufe · Junge Pflege
**Verdikt:** 🎁 verschenken  
**Review:** 32/35 · Tier 1/2 · Type A (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

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

Dienstplan abfotografieren und in den Kalender übernehmen können Shift2Cal AI (ausdrücklich für Pflegekräfte) und allgemeine Foto-zu-Kalender-Apps (Smart Calendars AI, ALMO). Zuschlagsrechner für Nacht, Sonntag und Feiertag gibt es viele und kostenlos (Ordio, Kenjo, rechner-portal.de, schichtlohnrechner.de; TVöD-Sätze in der Schichtplan-Fibel). Dienstplan-Software für Häuser prüft Ruhezeiten für die Leitung. Nicht gefunden: dieselbe Prüfung auf der Seite der Beschäftigten — Ruhezeit nach § 5 ArbZG und Tarifzuschläge aus dem eigenen Plan, als Beleg für Betriebsrat oder Gewerkschaft. Die Lücke ist die Kombination, keine neue Fähigkeit.

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs dose-nurse-shift-guardian`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

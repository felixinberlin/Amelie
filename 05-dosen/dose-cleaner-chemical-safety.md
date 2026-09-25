---
status: Available
delivery_method: E-Mail
target_maker: IG BAU Bundesfachgruppe Gebäudereinigung
review_score: 34/35
architecture_tier: Tier 1
source_type: Type A
---
# ChemGefahr-Stopp (Chemical Safety & Poison Shield for Cleaners)

*(englisch: ChemHazard Stop (Chemical Safety Shield for Cleaners))*

**Ein Satz:** Kamera auf 2 Putzmittelflaschen richten: Warnt laut in 20 Sprachen vor Chlorgas und Verätzungen bei falschem Mischen.

**Stand:** 17.09.2026 · **Prüfen ab:** März 2027
**Empfänger:** IG BAU Bundesfachgruppe Gebäudereinigung · Berufsgenossenschaft der Bauwirtschaft (BG BAU)
**Verdikt:** 🎁 verschenken  
**Review:** 34/35 · Tier 1 · Type A (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Reinigungskräfte arbeiten nachts unter Zeitdruck, oft mit Sprachbarrieren. Das versehentliche Mischen von Sanitärreinigern (Säure) mit chlorhaltigen Bleichmitteln setzt tödliches Chlorgas frei.

## Warum das jetzt geht

- Vision-Modelle erkennen Inhaltsstoffe auf zerkratzten und gebogenen Flaschenetiketten in Sekundenbruchteilen.
- Sofortige laute Audio-Sprachausgabe in der Muttersprache (Ukrainisch, Polnisch, Türkisch, Arabisch, etc.) ohne Textlesen.
- Keine Internetverbindung nötig — läuft offline in Kellern und fensterlosen Waschräumen.

## Skizze

Arbeiter hält 2 Flaschen nebeneinander vor die Handykamera. Wenn Säure + Hypochlorit erkannt werden: Bildschirm blinkt grellrot, Handy vibriert, laute Stimme ruft: "STOPP! Nicht mischen! Chlorgas-Gefahr!"

## Erster Schritt

**Ticket:** P0: Bildklassifikation von 2 Haushalts-/Gewerbereinigern mit Inkompatibilitäts-Matrix und Sprachausgabe.

Warnt bei Mischung von WC-Reiniger (Salz-/Phosphorsäure) und Bleiche (Natriumhypochlorit) innerhalb von 1 Sekunde.

## Wo es kippt

Stummgeschaltetes Telefon: App muss bei akuter Lebensgefahr die Lautstärke automatisch anheben oder haptischen Alarm (Vibrationsmuster) erzwingen.

## Wer es schon versucht hat

Beim Empfänger liegt das Informationssystem schon: Die BG BAU betreibt WINGIS (Gefahrstoff-Informationssystem, auch mobil) mit dem GISCODE für Reinigungsmittel, dazu die DGUV Regel 101-019 mit Sammelbetriebsanweisungen. Mischverbote sind Lehrbuchwissen und stehen in jeder Warnung von Gesundheitsbehörden. Nicht gefunden (Prüfung 24.09.2026): eine Kamera-App, die zwei Flaschen erkennt und vor dem Mischen laut warnt. Kipprisiko: Ein falsches „passt" ist schlimmer als keine App — bei Profiprodukten ist der GISCODE aus Produkt- oder Sicherheitsdatenblatt eine sicherere Eingabe als die Bilderkennung.

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs dose-cleaner-chemical-safety`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

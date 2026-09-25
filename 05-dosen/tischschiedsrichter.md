---
status: Available
delivery_method: E-Mail
target_maker: Die Öffentlichkeit — mit lauffähigem Skelett
review_score: 29/35
architecture_tier: Tier 1
source_type: Type C
---
# TischSchiedsrichter

*(englisch: Dinner Table Referee)*

**Ein Satz:** Handy in die Tischmitte, Wortliste gemeinsam beschließen — fällt ein Reizwort, pfeift es und zeigt Gelb, beim zweiten Mal Rot und ein neues Thema. Erkannt wird nur auf dem Gerät, nie in der Cloud.

**Stand:** 24. September 2026 · **Prüfen ab:** März 2027
**Empfänger:** Die Öffentlichkeit — mit lauffähigem Skelett (Manifest, Regel 4 und Empfängertabelle, letzte Zeile) · Kanal: Blogbeitrag oder Show HN vor dem 1. Advent 2026 · Sammeltalk „Ideen, die ich nicht baue" (FOSDEM)
**Verdikt:** 🔨 erst Skelett, dann verschenken  
**Review:** 29/35 · Tier 1 · Type C (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Niemand will derjenige sein, der den Schwiegervater unterbricht. Wer beim Familienessen „bitte keine Politik" durchsetzt, ist der Böse; wer nichts sagt, erlebt denselben Streit wie letztes Jahr. Die Apps, die zuhören, verknüpfen Ton mit der Identität (Swearing Jar laut App-Store-Angabe) — am privaten Esstisch ein Ausschlussgrund.

## Warum das jetzt geht

- Chrome erkennt Sprache seit Version 139 auf dem Gerät (Web Speech API, `processLocally`). Damit ist das Ganze eine Webseite: kein Server, keine App, kein Konto.
- Freie Wortlisten brauchen kein Training mehr: Open-Vocabulary-Keyword-Spotting (sherpa-onnx) oder eine eingeschränkte Offline-Erkennung genügen.
- Ehrlich: Neu ist das nicht erst durch KI. Noche de Paz lief 2015 als Werbe-App, JarGone 2018 als Gerät. Neu ist, dass es ohne Cloud und ohne Installation geht.

## Skizze

Webseite, drei Schritte: Liste gemeinsam festlegen, Häkchen „alle wissen Bescheid", Anpfiff. Der Browser prüft vorher, ob er offline erkennen kann; wenn nicht, startet der Schiedsrichter nicht (kein Rückfall auf die Cloud). Treffer ab vier Buchstaben per Wortanfang („Partei" trifft „Parteitag"), acht Sekunden Abkühlzeit pro Wort, zweite Gelbe binnen zehn Minuten wird Rot mit Themenvorschlag. Gespeichert wird nichts; das Spielprotokoll hält nur Wort und Uhrzeit, bis die Seite zu ist. Läuft als Skelett in der Amélie-App (Tab „Sandboxes").

## Erster Schritt

**Ticket:** Skelett in echter Tischrunde testen: vier Personen, zehn Minuten Gespräch mit Liste, Erkennung offline in Chrome.

Mindestens 80 % der gesagten Listenwörter erkannt, höchstens zwei Fehlpfiffe; Netzwerk-Tab zeigt während des Spiels keinen Datenverkehr.

## Wo es kippt

Fehlpfiffe. Im Stimmengewirr am Tisch trifft die Erkennung schlechter als am Schreibtisch, und im Deutschen erzwingen eingeschränkte Offline-Modelle gern Treffer (Vosk-Issue #1017). Wenn es beim ersten Essen dreimal falsch pfeift, liegt das Handy danach in der Schublade. Zweites Risiko: heimlich eingesetzt ist es Überwachung — deshalb ist die Einwilligung ein Schritt im Spiel, nicht eine Zeile im Kleingedruckten. Drittes: Offline-Erkennung gibt es derzeit nur in Chrome, und je nach Gerät erst nach einem Sprachpaket-Download.

## Wer es schon versucht hat

Noche de Paz / SilentNight (Agentur Shackleton, 2015): Handy in die Tischmitte, feste Liste politischer Wörter, Alarm und Themenvorschlag — dasselbe Szenario, als Werbe-App. JarGone (Kickstarter 2018): Gerät mit frei eintragbaren Wörtern für die ganze Familie. Swearing Jar (App Store, 2025): eigene Wörter in Echtzeit, Gruppen — Audiodaten laut Store-Angabe mit der Identität verknüpft. Swear Jar 2.0 (itch.io) und mehrere GitHub-Bastelprojekte. Was dieser Dose bleibt: garantiert offline, Deutsch, freie Liste ohne Training, Gelb/Rot als Tischregel, Einwilligung als Spielzug. Prüfprotokoll Runde 9: `verengt` (dünn).

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs tischschiedsrichter`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

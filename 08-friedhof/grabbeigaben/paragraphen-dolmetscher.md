---
status: Available
delivery_method: E-Mail
target_maker: Tacheles e.V.
---
# ParagraphenDolmetscher

> ⚰️ **Grabbeigabe — gestorben am 24.09.2026, `besetzt`.**
> jobcenter.guru macht genau das, kostenlos und in über zehn Sprachen; dazu war die Idee ein Duplikat von KlarLokal.
> Totenschein: App-Tab „Friedhof" · Nachruf: `08-friedhof/nachrufe.md` · Belege: `06-suche/amelie-pruefprotokoll.md`, Abdeckungs-Nachprüfung.
> Der Text unten ist die Dose, wie sie war — inklusive des Satzes „freie, bedingungslose Werkzeuge existieren nicht", der sie getötet hat.

**Ein Satz:** Ein Foto des gefürchteten Amtsbescheids übersetzt bedrohliches Beamtendeutsch in 3 klare Sätze, deckt 4-Wochen-Fristen auf und formuliert den Widerspruch.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Tacheles e.V. (Erwerbslosenhilfe) · Caritas Schuldner- & Sozialberatung · Mietervereine
**Verdikt:** 🎁 verschenken

---

## Das Problem

Millionen Bürger verstehen amtliche Ablehnungsbescheide (Bürgergeld, Pflegegrad, Wohngeld, Mieterhöhung) nicht. Aus Scham oder Überforderung verstreichen Fristen ungenutzt, obwohl bis zu 40% der Bescheide fehlerhaft sind.

## Warum das jetzt geht

- Große multimodale Modelle erfassen mehrseitige amtliche Tabellen, Berechnungsbögen und kleingedruckte Rechtsbehelfsbelehrungen im semantischen Zusammenhang.
- Juristische Mustersätze lassen sich mit den individuellen Fakten des Bürgers verknüpfen, ohne anwaltliche Stundensätze.
- Lokale Zwischenspeicherung schützt Bürger vor Tracking durch private Kanzleien oder Werbenetzwerke.

## Skizze

Foto des Bescheids hochladen. Modell extrahiert: 1. Was das Amt will, 2. Wann die Frist abläuft (mit Kalendereintrag), 3. Wo der Rechenfehler liegt. Ein Klick generiert ein formelles, rechtswahrendes Widerspruchs-PDF zur Fristwahrung.

## Erster Schritt

**Ticket:** P0: Bescheid-Parser mit Fristerkennung und Zusammenfassung.

Extrahiert aus 5 echten Mustern (Jobcenter, Pflegekasse) das genaue Fristdatum und den Kernablehnungsgrund.

## Wo es kippt

Unerlaubte Rechtsberatung: Das Werkzeug muss sich strikt als „Verständnishilfe und Formulierungshilfe zur Fristwahrung" deklarieren und auf offene Beratungsstellen verweisen.

## Wer es schon versucht hat

Kommerzielle LegalTech-Plattformen verlangen 30-50% Provision der Nachzahlung; freie, bedingungslose Werkzeuge für Bürger existieren nicht.

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs paragraphen-dolmetscher`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

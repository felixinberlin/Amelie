---
status: Available
delivery_method: E-Mail
target_maker: 'Katta Spiel, HCI-Gruppe der TU Wien'
---
# Chaos Clock

**Ein Satz:** Ein Google-Kalender-Add-on, das aus Zustand und Absicht einen Fokusmodus, eine Dauer und einen freien Platz würfelt, das Ergebnis als echten Termin einträgt — und je nach Chaos-Regler kleine, abschaltbare Streiche im Kalender spielt. Kein Server, keine KI, alle Daten im eigenen Google-Konto.

**Stand:** 24. September 2026 · **Prüfen ab:** März 2027
**Empfänger:** Katta Spiel, HCI-Gruppe der TU Wien (ERC ACCESSTECH, 2024–2029) — als Forschungssonde, mit Code · nachrangig: Eva Hornecker (Bauhaus-Universität Weimar, Mitautorin derselben CHI-Studie) · danach die Öffentlichkeit (Show HN), sobald das README hält, was der Code tut
**Verdikt:** 🔨 erst Skelett, dann verschenken

---

## Das Problem

Wer mit ADHS oder schlicht leerem Akku vor dem eigenen Kalender sitzt, liest ihn als Vorwurf: Jeder Block ist ein Versprechen, das man gleich bricht. Die Werkzeuge dagegen wollen fast alle dasselbe — die Person an die Norm anpassen, mit Streaks, Punkten und Nutzungsdaten. Die Literaturstudie „ADHD and Technology Research – Investigated by Neurodivergent Readers" (CHI 2022) fand genau das: ADHS-Technik zielt überwiegend darauf, Eigenschaften zu mildern, die neurotypische Verhaltensnormen stören, und Betroffene gestalten fast nie mit.

## Warum das jetzt geht

- Ehrlich zuerst: Das fällt nicht unter die These des Manifests. Chaos Clock enthält keine KI, und Würfeln gegen Entscheidungslähmung ist alt (Würfelmethoden in ADHS-Blogs 2021, RandomTask). Die Uhr, die unberechenbar vorgeht, hat David Seah 2007 beschrieben.
- Neu ist der Ort: Ein Workspace-Add-on in Apps Script läuft ganz im Google-Konto der Nutzerin — Termine im eigenen Kalender, Verlauf in einer Tabelle im eigenen Drive, Einstellungen im Nutzerspeicher. Für eine Studie heißt das: Teilnehmende behalten ihre Daten und teilen die Tabelle nur, wenn sie wollen.
- Neu ist, dass es fertig ist: v0.5.0, 38 Tests grün (unter UTC, siehe erster Schritt), an einem Tag gebaut. Verschenkt wird nicht die Idee, sondern der Code.

## Skizze

Seitenleiste in Google Calendar mit fünf Feldern: Absicht (ein Satz), Energie 1–5, Fokus 1–5, verfügbare Minuten, Chaos 0–100. „Roll" wählt unter sechs Modi (Banish 2–5 min bis Gnosis 30–60 min) einen, den der Zustand zulässt — niedrige Energie würfelt nie Gnosis —, sucht den nächsten freien Platz und legt einen echten Termin an; der Termin ist der Timer. Danach Flow 1–5 eintragen. Der Chaos-Regler schaltet elf einzeln abschaltbare Streiche frei: Zeitdrift, Phantomtermine, Wiederauftauchen, wandernde Termine, der beleidigte Diener („Fine. I'll wait."), Termine in der Vergangenheit, Echos, Prophezeiung, Trickster-Wurf, Anti-Kalender-Tag, Sonntagsbeichte. Nicht dabei, mit Absicht: Streaks, Punkte, Countdown, Benachrichtigungen — alles, was die App öfter öffnen lässt. Code: github.com/felixinberlin/kaosclock (Apps Script, Jest).

## Erster Schritt

**Ticket:** Die Stellen reparieren, an denen der Code weniger hält als die Beschreibung verspricht — bevor irgendjemand es an Menschen testet.

Arbeitszeiten gelten in der Zeitzone der Nutzerin (heute läuft das Skript auf `Etc/UTC`: „9–20 Uhr" ist in Berlin 11–22 Uhr, und `npm test` ist nur mit `TZ=UTC` grün — unter Europe/Berlin fallen 5 von 38 Tests). Die Berechtigung `script.external_request` ist entfernt, weil nichts nach außen ruft. Das README behauptet nicht mehr „gleiche Eingaben, gleiches Ergebnis" (der Wurf nutzt `Math.random`, deterministisch ist er nur bei Chaos 0) und nicht mehr, die Prophezeiung sei bis zu ihrem Tag gesperrt (sie ist ein normaler Termin). Eine LICENSE-Datei liegt im Repo, und zwar CC0 — das README sagt MIT, und MIT verlangt den Copyright-Vermerk, also eine Bedingung, die der Pledge ausschließt.

## Wo es kippt

Ein Streich zu viel. Ein Termin in der Vergangenheit, ein Echo, eine Prophezeiung — für die eine ist das Humor, für den anderen das Gefühl, dass der eigene Kalender einen verspottet, und gerade die Leute mit dem meisten Kalenderstress haben dafür am wenigsten Puffer. Die Tonregel („wer es Freunden erzählt, lacht und will es sofort") ist bisher an niemandem geprüft. Zweitens: Ein Add-on, das selbstständig Termine in einen Arbeitskalender schreibt, kommt in vielen Firmen-Workspaces nicht an der Admin-Freigabe vorbei, und ohne Marketplace-Eintrag ist die Installation per clasp eine Hürde, die die Zielgruppe nicht nimmt. Drittens: Die Sprache der Chaosmagie zieht an und stößt ab — der Satz „es ist ein Kostüm" muss in der Oberfläche stehen, nicht nur im README.

## Wer es schon versucht hat

Würfeln gegen Entscheidungslähmung ist besetzt: RandomTask (Web, Würfel wählt die Aufgabe, Pomodoro, Streaks, Pro-Abo), „Random Task Picker – ADHD Productivity Tool" (itch.io), Würfelmethoden in ADHS-Blogs seit 2021 — keins schreibt in den Kalender oder fragt nach dem Zustand. Planen nach Energie ist besetzt: Lifestack verteilt Aufgaben anhand von Wearable-Daten auf Hochphasen, Tiimo ist der visuelle Planer der Szene; beide optimieren, keins spielt. Sigil-Apps zur Chaosmagie gibt es mehrere (App Store, Google Play), alle ohne Kalender. Die unberechenbar vorgehende Uhr: David Seah, „A Chindogu Clock for Procrastinators" (2007), dort mit Hinweis auf ein Patent auf das Prinzip. Nicht gefunden: der Kalender selbst als Mitspieler — selbstständige, abschaltbare Streiche in den echten Terminen, ohne Server. Die Angabe „is_verified_novel: true" im Gemini-Datensatz ist damit zu stark; der „ADHMe"-Webring war nicht auffindbar, der „Apathetic Genius"-Webring existiert (Neocities, 2026 neu gestartet), ist aber ein Ring persönlicher Seiten, keine Adresse. Prüfprotokoll 24.09.2026: `verengt`.

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs chaos-clock`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

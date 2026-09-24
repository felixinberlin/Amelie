# Entsorgt — Ideen, die es schon gibt

Regel 7 sagt: Was nicht mehr stimmt, wird **gelöscht, nicht archiviert**. Die toten Ideenbanken der letzten vierzig Jahre sind Friedhöfe, weil niemand je etwas weggeworfen hat.

Diese Datei ist die Ausnahme von der Regel und zugleich ihre Begründung: Sie hält fest, **warum** etwas weg ist, damit die Idee nicht in sechs Monaten erneut aufgeschrieben wird. Sie enthält keine Dosen und wird nie welche enthalten.

**Prüfdatum: September 2026.**

---

## git-archaeologist (MCP)

**Ursprüngliche Idee:** Repo-History als Frage-Interface — „warum existiert diese Zeile?" → blame + PR + Issue + Diskussion als eine Kette.

**Warum weg:** Mehrfach gebaut, von verschiedenen Leuten, innerhalb weniger Monate. Gefunden wurden unter anderem ein MCP-Server, der wörtlich „beantwortet, warum Code existiert — git blame, PR-Beschreibungen und verknüpfte Issues", ein zweiter namens „codebase-archaeology", der Begründungen aus Historie, PR-Diskussionen und Issues rekonstruiert und **jede Aussage auf einen Commit oder Kommentar zurückführt**, dazu weitere Git-Intelligence-Server. GitKraken dokumentiert eigene MCP-Werkzeuge zur Untersuchung von Code-Historie.

**Was das über die Idee sagt:** Sie war richtig. Mehrere Leute sind unabhängig voneinander darauf gekommen, sobald MCP existierte. Das ist ein gutes Zeichen für das Ideen-Radar und ein schlechtes für den Vorsprung — bei naheliegenden Tooling-Ideen im aktiven Ökosystem beträgt das Zeitfenster **Monate, nicht Jahre**.

---

## Home-Network MCP

**Ursprüngliche Idee:** Router als Tool-Server — wer ist im Netz, Bandbreite, DNS-Blocklisten togglen, per Chat statt Web-UI.

**Warum weg:** Mindestens **vier** unabhängige FRITZ!Box-MCP-Server gefunden, gelistet in mehreren Verzeichnissen, teils ausdrücklich „für die Verwaltung von AVM Fritz!Box-Routern aus Claude Code". Dazu Home Assistant mit MCP-Integration in beide Richtungen.

**Was das über die Idee sagt:** Dasselbe Muster, noch deutlicher. „Naheliegendes Gerät + neues Protokoll" ist die am dichtesten besetzte Nische überhaupt. Wenn eine Idee sich in einem Satz beschreiben lässt und die Hardware verbreitet ist, existiert sie schon.

---

## Repo-Museum

**Ursprüngliche Idee:** Begehbare 3D-Galerie der eigenen Repos — Repo = Raum, Commits = Exponate, tote Branches = Keller.

**Warum weg:** Bereits gebaut und veröffentlicht („Ich habe ein GitHub-Repo in eine begehbare 3D-Stadt verwandelt"). Die Vorgeschichte ist außerdem lang: CodeCity als Forschungsarbeit, Gource als Film, GitHub Skyline als Gimmick.

**Ehrlich zur Restlücke:** Die Museumsmetapher — Exponate, Keller, Kuratierung — ist ein **Designunterschied, keine neue Fähigkeit**. Das reicht nicht für eine Dose. Wer das trotzdem schön findet, baut es für sich, nicht als Geschenk.

---

## Commute Oracle

**Ursprüngliche Idee:** Kein offizielles ETA, sondern ein Modell, das die eigenen geloggten Fahrten lernt und sagt, wann man wirklich losmuss.

**Warum weg:** Kommerziell besetzt. Citymapper hat 2026 KI-gestützte, personalisierte Routenplanung eingeführt; es existieren dedizierte Produkte für „wann muss ich losgehen"; Google Maps hat Pendel-Funktionen seit Jahren.

**Ehrlich zur Restlücke:** Eine lokale, kontofreie, offene Variante speziell für Berlin wäre noch frei — aber sie konkurriert gegen Firmen mit Echtzeitdaten, die eine Einzelperson nicht hat. Das ist kein Geschenk, das ist eine Zumutung. Weg.

---

## Crack Flora Watcher (Ritzengrün-Wächter) — 21.09.2026

**Ursprüngliche Idee:** Foto derselben Ritzenpflanze über Wochen → Zeitraffer mit Härtegrad-Score → #Krautschau-/GBIF-tauglicher Datensatz.

**Warum weg:** Die Dose stand seit dem 18.09.2026 auf **einem** Satz — „ein Werkzeug, das dieselbe Einzelpflanze über die Saison verfolgt (keine der genannten Apps tut das)". Die erste englische Suche nach dieser *Funktion* (statt nach dem Gegenstand „Ritzenpflanze") hat ihn widerlegt:

- **GrowApp** (GLOBE Niederlande, European Phenology Campaign): dieselbe Einzelpflanze, voriges Foto transparent zum Ausrichten, automatischer Zeitraffer ab Bild 2. Das ist die Skizzenzeile der Dose, Wort für Wort.
- **Nature's Notebook** (USA-NPN): Einzelpflanzen mit Spitznamen registrieren, markieren, wiederholt besuchen; neue App Frühjahr 2026 mit gestuftem Monitoring.

Dazu die zweite Hälfte: Die gamifizierte Entdeckung liegt nicht nur bei Seek, sondern bei **Flora Incognita selbst** — Krautschau-Projekt in der App, Abzeichen über 40 Arten in fünf Stufen, Geozonen-Auto-Tagging, von Senckenberg offiziell empfohlen. Flora Incognita stand in der Dose als *nachrangiger Empfänger*.

**Was das über die Methode sagt:** Zwei Fehler, beide vermeidbar. Erstens wurde nur der **Gegenstand** gesucht („Ritzenpflanzen-App", „Seek") und daraus auf die **Mechanik** geschlossen; Werkzeuge, die sich über ihre Funktion definieren, sind so unsichtbar. Zweitens war der Satz „Was fehlt, nach dieser Recherche, wirklich" selbst eine ungeprüfte Behauptung — er wurde abgeleitet, nie gesucht. Beides steht jetzt als Regel im Playbook (§2 und Retro Runde 6).

**Was überlebt:** Nicht die Longitudinalspur, sondern die Übergabe — dass eine Messreihe weiterläuft, wenn die Person aufhört. Neue Dose: `05-dosen/fugenduell-patenschaft.md`. Die Wettbewerbsmechanik aus dem Brainstorm (Übernahme gegen den Willen der Patin) ist dort bewusst nicht enthalten: ungeprüft (`unklar`) und gegen Ehrenamtliche gerichtet.

**Nachtrag 24.09.2026:** In `src/data/dosen.ts` steht die Dose jetzt als `entsorgt` / `discarded` — vorher zeigte die App sie weiter als 🎁 gepackt. Die Verweise aus `deliveries.ts`, `doseSimulators.ts` und `matrix.ts` bleiben dadurch gültig.

**Noch nicht erledigt, Entscheidung Félix:** Die Datei `05-dosen/crack-flora-watcher.md` ist als zurückgezogen markiert, aber nicht gelöscht — sie hängt an `en/05-dosen/`, an der Matrix, an `src/data/dosen.ts` und an den JSON-Dateien unter `public/data/`. Das Manifest sagt „löschen, nicht archivieren"; der Vollzug fasst die veröffentlichte Seite an und gehört deshalb nicht in eine Rechercherunde.

---

## ParagraphenDolmetscher — 24.09.2026

**Ursprüngliche Idee:** Foto des Amtsbescheids → Beamtendeutsch in drei klaren Sätzen, Frist erkennen, Widerspruch formulieren (Tacheles, Caritas, Mietervereine).

**Warum weg:** Gibt es, kostenlos und in zehn Sprachen. **jobcenter.guru** (GuruSense AI, Seite gelesen, Stand 10.07.2026): Bescheid fotografieren, KI erklärt ihn, erkennt die Frist, entwirft den Widerspruch, iOS, Android und Web, ausdrücklich kostenlos. Daneben amtly.app, briefgeist.de, papierfrei.app, docugov.ai (Suchtreffer). Und im eigenen Protokoll stand seit dem 18.09.2026 **KlarLokal** mit dem Nachbarn **Zetteln** — dieselbe Idee war damit zum zweiten Mal gepackt.

**Was das über die Methode sagt:** Die Dose kam aus dem Katalog in `src/data/ideas/`, nicht aus einer Runde. Dort stand jeder Eintrag auf `frei`, ohne dass je gesucht worden war, und der Satz „freie, bedingungslose Werkzeuge existieren nicht" in „Wer es schon versucht hat" war eine Behauptung des Modells, das den Katalog geschrieben hat. Ein Blick in den eigenen Atlas („Behördenbrief → Leichte Sprache: dicht") hätte genügt. Seit heute steht der Katalog auf `ungeprüft`, und `scripts/check-protokoll-coverage.mjs` lässt keine Dose ohne Protokollzeile mehr durch.

**Vollzug:** Aus `DOSEN_DATA` nach `DISCARDED_DATA` verschoben, `05-dosen/paragraphen-dolmetscher.md` gelöscht (Regel 7; die Dose war nie zugestellt und nirgends verlinkt).

---

## Das Muster hinter allen vieren

Vier von neunzehn Ideen sind tot, und sie sind nicht zufällig verteilt:

| Bereich | Ergebnis |
|---|---|
| **Entwickler-Tooling im aktiven Ökosystem** (MCP, Git, Router) | fast vollständig besetzt |
| **Schöne Demos** (3D-Visualisierung, DLA, Fluidsim) | vielfach gebaut, Restwert liegt im langweiligen Teil |
| **Kommerziell attraktive Endnutzer-Apps** (Pendeln, Traumdeutung) | von Firmen besetzt |
| **Zivilgesellschaft, Verwaltung, Vereine** (Sperrmüll, Lärm, Wohnungsphysik, Lockpicking-Didaktik) | **frei** |

**Die Lehre, und sie ist die wertvollste des Tages:** Frei ist genau das, womit sich kein Geld verdienen lässt und wofür keine Entwicklerszene existiert. Das deckt sich exakt mit dem Befund aus `amelie-bewegungen.md` — Freiwilligkeit skaliert nicht gegen ökonomische Interessen, also funktioniert Verschenken dort, wo nichts Großes auf dem Spiel steht.

Das ist keine Einschränkung des Modells. Das ist sein Anwendungsbereich, und er ist ausgerechnet der, in dem Geschenke am meisten bewirken.

**Konsequenz für den Loop:** Bei Tooling-Ideen ist das Zeitfenster kurz — sofort prüfen, sofort zustellen oder verwerfen. Bei zivilgesellschaftlichen Ideen ist es lang, dort lohnt Sorgfalt. Die 1:2-Budgetregel bleibt richtig, aber der Prüfschritt gehört **vor** das Packen, nicht danach: Eine Stunde Suche hätte diese vier Dosen von vornherein verhindert.

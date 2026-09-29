---
status: Available
delivery_method: E-Mail
target_maker: Eine Person im Fachbereich Vermessung/Geoinformation einer Stadt
---
# Straßennamen-Prüfer

*(englisch: Street Name Checker)*

**Ein Satz:** Ein deterministischer Prüfer, der einen vorgeschlagenen neuen Straßennamen gegen das Straßenverzeichnis einer Gemeinde hält und Doppelungen und Klangzwillinge als Prüfhinweis mit Fundstelle meldet, nie als „unzulässig".

**Stand:** 29.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** Eine Person im Fachbereich **Vermessung/Geoinformation einer Stadt** (z. B. Frankfurt, Hannover, Düsseldorf) oder einer Landesvermessung, die Straßenbenennungen vorbereitet. **Keine Person ermittelt — Name, Zuständigkeit und Adresse vor Versand verifizieren; ohne Verifikation kein Versand.**
**Verdikt:** 🎁 verschenken — knapp (Kern 24/35): ein kleiner, getesteter Kern ohne Betriebsaufwand. Ob die Ämter intern schon prüfen, ist nicht ausgeschlossen (siehe „Wo es kippt").
**Review:** 24/35 · Tier 1 · V8 Fun 2 (Nachschlagen) · Details: `06-suche/amelie-classification-log.md`, Heimatgedächtnis-Runde 29.09.2026

---

## Das Problem

Wenn ein Neubaugebiet entsteht, brauchen Dutzende Straßen Namen. Kommunale Richtlinien verlangen, dass sie sich nicht mit vorhandenen verwechseln lassen: Frankfurts Leitfaden (2023) nennt „gleichklingende Namen sind zu vermeiden" und Namen, die „nur durch das Grundwort unterschieden" sind. Das Vermessungsamt führt eine Vorschlagsliste und prüft die Ähnlichkeit nach den Richtlinien von Hand gegen das Verzeichnis. Ein Werkzeug dafür wurde nicht gefunden.

**Wer leidet:** Sachbearbeitende, die bei jedem Vorschlag das Verzeichnis durchsuchen müssen; im schlechten Fall Rettung, Post und Ortsfremde, wenn ein Zwilling durchrutscht. Der VGH Mannheim hat am 13.11.1978 eine Umbenennung wegen Verwechslungsgefahr bestätigt.

## Warum das jetzt geht

1. **Straßenlisten sind maschinenlesbar** (GovData-Datensätze, OSM über Overpass), das Verzeichnis ist also ohne Sonderzugang zu bekommen.
2. **Die Regeln stehen in veröffentlichten Richtlinien** (Drensteinfurt, Bornheim, Dortmund, Frankfurt 2023) und sind formalisierbar: Normalisierung, Grundwort, Klang, Editierdistanz, Ausnahme für Personennamen.
3. **Ein reiner Client-Kern ist heute trivial auszuliefern:** eine statische Seite, keine Daten verlassen den Rechner.

## Skizze

- **Eingabe:** Straßenliste der Gemeinde (CSV/GeoJSON), ein oder mehrere Namensvorschläge.
- **Logik:** Normalisierung (ß/ss, Umlaute, Groß-/Kleinschreibung, Grundwort -straße/-weg/-allee/-platz abgestreift), Kölner Phonetik **als eines von mehreren Signalen** (für ganze Adressen ungeeignet), Editierdistanz, Grundwort-Doppelung („Lindenweg" gegen „Lindenstraße"); Ausnahme für Personennamen und räumlichen Zusammenhang als Schalter, jede Regel mit ID und Klartextbegründung.
- **Ausgabe:** Prüfhinweis je Vorschlag mit Fundstelle (vorhandene Straße, Regel, Richtlinien-Absatz), **nie „unzulässig"**; die Entscheidung bleibt bei Amt und Gremium.
- **Nicht dabei:** kein Flurnamen-Vorschlagsfundus (Ausbaustufe, nicht Ticket 01), keine Herkunftserklärung der Namen (besetzt: OSM etymology, Städte-Schilder), keine Server, keine Rechtsauskunft.

## Erster Schritt

**Ticket: Ein Vorschlag, ein Verzeichnis, ein Prüfhinweis.** Reiner TypeScript-Kern `pruefeStrassenname(vorschlag, verzeichnis, optionen)` mit den Regeln aus drei kommunalen Richtlinien als Regelquelle, dazu eine statische Offline-Seite.

**Fertig, wenn:**
- eine Vitest-Suite mit mindestens 20 Fällen grün ist, darunter Grundwort-Doppelung, ß/ss, Umlaute, Klangzwilling (z. B. „Meier"/„Maier"), Personennamen-Ausnahme und ein unverdächtiger Name (0 Hinweise);
- ein Testset aus **bekannten Verwechslungspaaren** (aus Richtlinien-Beispielen und dem VGH-Fall) erkannt wird und eine echte Straßenliste (GovData oder OSM-Overpass) ohne unerklärte Treffer-Flut läuft;
- jede Meldung Regel-ID, Fundstelle und Klartextbegründung (De/En) trägt und das Wort „unzulässig" nirgends ausgegeben wird;
- die Seite offline ohne Netzwerkaufruf läuft und alles im Scaffolding unter `07-demos/strassennamen-pruefer/` liegt (Regel 4).

## Wo es kippt

**Gate nur knapp erreicht.** Die Ämter prüfen möglicherweise schon intern: ALKIS-Fachschalen oder Adressverwaltungen könnten eine Ähnlichkeitsprüfung enthalten; gefunden wurde keine, ausgeschlossen ist es nicht. Dann ist das Geschenk höchstens eine Zweitmeinung für kleine Gemeinden ohne Fachschale. Zweitens: **Falschalarm-Flut** durch Phonetik. Gegenmaßnahme: nur Hinweise, Rangfolge nach Regelstärke, Schwellen einstellbar, Kölner Phonetik nie allein.

**Offen gelegt:**
- Empfängerperson **nicht ermittelt**, vor Versand verifizieren.
- Evidenz: Richtlinien als Web-Fetch-Ausschnitte gelesen, Gegen-Suchen nach Werkzeugen (Tool/Software, OSM-Forum „Doppelte Straßennamen finden") ohne Treffer; ALKIS-intern nicht geprüft.
- Fun ist niedrig (2): Nachschlagen, keine Spielschleife.

## Wer es schon versucht hat

Recherche 29.09.2026 (Bisoziation K8, Inversion H2, Reviewer-Nachprüfung). Details: `06-suche/amelie-pruefprotokoll.md`, Abschnitt Heimatgedächtnis-Runde.

- **Von Hand:** Ämter (Münster, Hildesheim, Düsseldorf, Tübingen, Bamberg, Städtetag-Hinweise) prüfen manuell gegen das Verzeichnis; kein Tool gefunden (Suchschnipsel).
- **Nachbarn, andere Lücke:** Herkunftserklärung der Namen ist besetzt (OSM `name:etymology:wikidata`, Schilder-QR in Koblenz, Leipzig, Braunschweig, Hannover), das ist nicht dieselbe Frage.
- **Kein OSM-Werkzeug** für doppelte Straßennamen gefunden (OSM-Forum „Doppelte Straßennamen finden").

**Restlücke:** Ein offenes, prüfbares Werkzeug, das vor der Beschlussvorlage Doppelungen und Klangzwillinge mit Fundstelle meldet.

## Förderbrücke (nur Hinweis)

Wer Ticket 01 finanzieren könnte: **Prototype Fund** (Klasse 03, laut Katalog 01.10.–30.11.2026, Schnipsel, Primärseite noch nicht geprüft; Bedingungen: Wohnsitz DE, Einzelne/Teams bis 4, vollständige Open-Source-Lizenz, Behörden und Vereine ausgeschlossen); nachrangig **mFUND** (Geodaten, Skizzen laufend, Schnipsel) oder **Civic Coding** (Empfänger-Kanal, Bewerbungsfrist 2026 geschlossen). Offen im Projekt: Vereinbarkeit CC0 mit der Lizenzpflicht. Vor jeder Nennung Frist und Zulässigkeit auf der Primärseite prüfen. Kein Fördertipp in Mails ohne Freigabe.

## Vorarbeit

- Kommunale Straßenbenennungs-Richtlinien: Drensteinfurt, Bornheim, Dortmund, Frankfurt am Main (Leitfaden 2023).
- VGH Mannheim, 13.11.1978 (Umbenennung wegen Verwechslungsgefahr).
- Kölner Phonetik (Wikipedia; für ganze Adressen ungeeignet).
- Straßendaten: GovData, OSM über Overpass.
- Herkunft: Bisoziation K8 „Straßennamen-Retter" und Inversion H2 „neubaugebiet-namenswerkstatt" (Heimatgedächtnis-Runde).
- Die Dose online: https://felixinberlin.github.io/Amelie/#dose=strassennamen-pruefer

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

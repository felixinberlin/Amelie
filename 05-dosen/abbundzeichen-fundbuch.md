---
status: Available
delivery_method: E-Mail
target_maker: Interessengemeinschaft Bauernhaus e.V.
review_score: 26/35
architecture_tier: Tier 1
source_type: Type D
---
# Abbundzeichen-Fundbuch

*(englisch: Carpenters' Marks Logbook)*

**Ein Satz:** Ein Prüfer für Zählfolgen von Abbundzeichen: Sanierende tragen die Zeichen einer freigelegten Fachwerkwand ein, das Werkzeug meldet Lücken, Doppelungen und fremde Serien als Hinweis oder Verdacht (etwa auf Zweitverwendung) und legt den Fund in einem Format ab, das Hausforschende sammeln können.

**Stand:** 27.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** **Interessengemeinschaft Bauernhaus e.V. (IgB), Bereich Hausforschung** (Hausforschertreffen, Bauernhausarchiv im Kreismuseum Syke; viele IgB-Hausforschende sitzen im Arbeitskreis für Haus- und Gefügeforschung Nordwest mit der Landesdenkmalpflege). Kontakt laut Suchschnipsel Dr. Julia Ricker (julia.ricker@igbauernhaus.de) — **vor Versand auf igbauernhaus.de verifizieren (Name, Funktion, Adresse); ohne Verifikation kein Versand.** · nachrangig (UK, eigene Mail): Autor von Raking Light, der um Sichtungen bittet, bzw. die Vernacular Architecture Group — Name nicht ermittelt
**Verdikt:** 🎁 verschenken — der Verein hat die Sanierenden als Mitglieder und die Hausforschung im Haus; das Geschenk ist ein kleiner, getesteter Kern ohne Betriebsaufwand, keine Plattform
**Review:** 26/35 · Tier 1 · Type D (Details: `06-suche/amelie-classification-log.md`, Holz-Runde 27.09.2026, Re-Review)

---

## Das Problem

Wer ein Fachwerkhaus saniert, sieht die Abbundzeichen genau einmal: in den wenigen Wochen, in denen Putz und Verkleidung ab sind. Lesen kann sie fast niemand — auf fachwerk.de fragen Eigentümer wiederkehrend „Bedeutung Zeichen auf alten Holzbalken?". Dann wird wieder verputzt.

Auf der anderen Seite stehen die wenigen, die die Zeichen lesen können. Die Zählfolge verrät Umbauten, versetzte Wände und Holz aus einem anderen Verband. Aber gesammelt wird von Hand: Raking Light führt für arabische Abbundzeichen in England eine Datenbank mit 25 Belegen und bittet öffentlich um Sichtungen; *Vernacular Architecture* 49/1 (2018) fordert eine einheitliche Erfassung.

**Wer leidet:** Sanierende, die einen Befund zuschütten, ohne es zu wissen; Hausforschende, denen dadurch nie eine Verteilung entsteht, aus der man Umbauten, Zweitverwendung oder regionale Zeichensysteme ablesen könnte.

## Warum das jetzt geht

1. **Vision-Sprachmodelle (2025/26)** können aus einem Streiflichtfoto Lesungen eingeschlagener oder eingeritzter Zeichen *vorschlagen*: römische Ziffern, Ausstiche und Fähnchen, Rötel. Vorher brauchte es dafür eine Bauforscherin vor Ort. Das ist ungeprüft (siehe „Wo es kippt") und für den Kern nicht nötig.
2. **Die Grammatik macht verrauschte Lesungen prüfbar.** Eine Zählfolge hat Struktur: monoton je Bund bzw. Wand, ein Serienzeichen je Wandseite. Ein deterministischer Prüfer erkennt, wenn eine Lesung nicht in die Folge passt. Modell und Regel zusammen ergeben eine Erfassung, die sich selbst korrigiert; der Kern läuft ohne Modell.
3. **Die Forschung verlangt gerade nach Standardisierung und Sichtungen** (VA 49/1, Raking Light) — das Exportformat hat damit ein Ziel.

## Skizze

- **Eingabe:** je Bauteil Bund bzw. Wand, Position, Rolle (Ständer, Riegel, Strebe, Sparren …) und das Zeichen in einer kleinen Notation, z. B. `IIII`, `IV`, `XII^`, `VII>>` (Ziffer + Ausstich-Typ und -Anzahl). `unlesbar` ist ein eigener Zustand, kein Fehler.
- **Logik:** Parser (Zeichen → Wert, Notation additiv/subtraktiv, Serie) und fünf deterministische Regeln: Lücke, Doppelung, fremde Serie, Notationsbruch, Richtungsbruch — jede mit Regel-ID und Klartextbegründung (De/En).
- **Ausgabe:** Serien, Befunde mit Stufe `hinweis` oder `verdacht` (**nie „bestätigt"**), Liste der unlesbaren Zeichen; JSON-Export mit den Feldern der Erfassungsterminologie aus VA 49/1 (Markierungsart, Werkzeug, Lage, Serie), Ort standardmäßig nur auf Gemeindeebene.
- **Später (optional):** Foto → Modell schlägt Lesung vor → Mensch bestätigt → Prüfer. Foto und bestätigte Lesung werden nebeneinander gespeichert.

**Nicht dabei:** keine eigene Karte, keine Sammeldatenbank, kein Server (Sammeln und Kuratieren bleibt bei IgB bzw. AK Nordwest), keine Datierung, keine Bauforschungsbefunde, keine exakten Standorte.

## Erster Schritt

**Ticket: Eine Wand, eine Zählfolge, ein Verdacht.** Ein reiner TypeScript-Kern `pruefeZaehlfolge(bauteile)` für zwei Zeichensysteme: römisch mit Ausstich/Serienzeichen und römisch einfach. Additive Formen (`IIII`, `VIIII`) sind zimmermannsüblich und gültig.

**Fertig, wenn:**
- eine Vitest-Suite mit mindestens 20 Fällen grün ist, darunter: lückenlose Wand (0 Befunde), fehlender Ständer (Lücke), Balken mit fremdem Ausstich (Verdacht Zweitverwendung), `IIII` neben `IV` (Notationsbruch als Hinweis), unlesbares Zeichen (bleibt `unlesbar`, bricht nichts), Umsetzung (Richtungsbruch);
- mindestens **ein publiziertes Zeichenregister aus der Literatur** (DSD-Kulturspur, ing-hofer.de oder ein Beispiel aus Gerner 1996) von Hand als Fixture übertragen ist und das Ergebnis mit dem publizierten Befund übereinstimmt;
- der Kern als einzelne statische Seite offline im Browser läuft, ohne Netzwerkaufruf und ohne Modell;
- jede Meldung Regel-ID und Klartextbegründung (De/En) trägt;
- alles im Scaffolding unter `07-demos/abbundzeichen-fundbuch/` liegt (Regel 4).

## Wo es kippt

**Fehlgelesene Zeichen erzeugen falsche „Zweitverwendungs"-Befunde.** Eine Laiin hält einen Hinweis für einen Bauforschungsbefund, und eine Sammlung füllt sich mit verrauschten Daten. Gegenmaßnahme ist die Architektur: nur zwei Stufen (`hinweis`, `verdacht`), nie ein Befund; die Modell-Lesung ist nur ein Vorschlag, gespeichert wird die vom Menschen bestätigte Lesung neben dem Foto; `unlesbar` ist gleichberechtigt; keine automatische Karte — Einträge gehen als Export an kuratierende Hausforschende; Standort nur auf Gemeindeebene.

**Zweitens: der Empfänger hat keinen Softwarearm.** Deshalb ist das Geschenk eine einzelne statische Seite mit Tests, ohne Betrieb.

**Offen gelegt:**
- **Evidenz nur aus Suchschnipseln.** Der Egress-Proxy dieser Umgebung sperrte jeden Seitenabruf; keine der unten genannten Quellen wurde im Volltext gelesen.
- **Die Modell-Lesung ist ungeprüft.** Ob ein VLM eingeschlagene Zeichen unter Streiflicht brauchbar liest, hat niemand getestet. Der Kern hängt nicht davon ab.
- **Der Kontakt ist unverifiziert** (Dr. Julia Ricker, nur aus einem Schnipsel).

## Wer es schon versucht hat

**Recherche 27.09.2026 (Holz-Runde; Bisoziation, Nachrecherche Librarian, englische Gegenprobe des Reviewers) — nur Suchschnipsel.** Details: `06-suche/amelie-pruefprotokoll.md`, Abschnitt Holz-Runde.

- **Kein Werkzeug, keine Datenbank, kein Laienmeldeweg** für Abbundzeichen gefunden, weder deutsch noch englisch. Englisch fanden sich nur Papers, CAD-Software und Zimmerei-Rechner; die Suche „Abbundzeichen KI Foto App" lieferte nur Holzarten-KI.
- **Forschung von Hand:** Raking Light (Handdatenbank, 25 Belege, Aufruf zu Sichtungen); *Vernacular Architecture* 49/1 (2018) zur Standardisierung der Erfassung.
- **Vermittlung ohne Erfassung:** Deutsche Stiftung Denkmalschutz, Kulturspur „Abbundzeichen".
- **Archiv ohne Zeichen:** Das IgB-Bauernhausarchiv (Kreismuseum Syke) erfasst Bauaufmaße, keine Zeichen.
- **Dokumentation als Fachbüroarbeit:** BLDAM Brandenburg, „Anforderungen an eine Bestandsdokumentation" (https://bldam-brandenburg.de/wp-content/uploads/2019/01/GrauesHeft-Bauforschung.pdf, nur Schnipsel).

**Restlücke:** Ein Werkzeug, das Sanierende die Zeichen genau in dem Zeitfenster, in dem sie sichtbar sind, in eine prüfbare Zählfolge übersetzen lässt und den Fund in einem Format ablegt, das Hausforschende sammeln können.

## Vorarbeit

- *Vernacular Architecture* 49/1 (2018), „Carpenters' assembly marks in timber-framed buildings": https://www.tandfonline.com/doi/full/10.1080/03055477.2018.1523195
- Raking Light, arabische Abbundzeichen in mittelalterlichen Fachwerkbauten: https://rakinglight.co.uk/uk/arabic-assembly-marks-in-medieval-timber-framed-buildings/
- Deutsche Stiftung Denkmalschutz, Kulturspur „Abbundzeichen": https://www.denkmalschutz.de/denkmale-erhalten/kulturspur-2022/forschungsmethoden-und-spuren/abbundzeichen.html
- Gerner (Hg.), *Abbundzeichen – Zimmererzeichen und Bauforschung*, Fulda 1996: https://katalog.slub-dresden.de/id/0-223434957
- Ingenieurbüro Hofer, Abbundzeichen (Zählfolge verrät Umbauten): https://www.ing-hofer.de/2019/07/27/abbundzeichen/
- Laienfragen auf fachwerk.de: https://www.fachwerk.de/threads/bedeutung-zeichen-auf-alten-holzbalken.285377/ · https://www.fachwerk.de/threads/schriftzeichen-auf-alten-holzbalken.286024/
- IgB-Hausforschung: https://www.igbauernhaus.de/de/2-unsere-themen/hausforschung/hausforschung-in-der-igb.php · Hausforschertreffen: https://www.igbauernhaus.de/de/2-unsere-themen/hausforschung/hausforschertreffen.php · Bauernhausarchiv: https://www.igbauernhaus.de/de/2-unsere-themen/hausforschung/bauernhausarchiv.php
- Herkunft: Bisoziation Abbundzeichen × Laien-Kartierung von Vogeldialekten (Holz-Runde, Researcher #2, K1).
- Die Dose online: https://felixinberlin.github.io/Amelie/#dose=abbundzeichen-fundbuch

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

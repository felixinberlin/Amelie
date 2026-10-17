# Gründungsnavigator und Jobcenter-Hilfe: Präzision, Verfahren und verständliche Selbstvertretung

Stand: 17.10.2026 · Status: Arbeitsplan, keine fachjuristische Freigabe · CC0

## Auftrag und Reihenfolge

Félix: Zuerst müssen Aussagen wesentlich präziser werden und zum deutschen Recht sowie den tatsächlichen Verwaltungsverfahren passen. Danach muss sichergestellt werden, dass Menschen ohne Fachwissen sie verstehen und ihre Position selbst vertreten können.

Dieser Branch enthält ausschließlich Befunde und Umsetzungstickets. Keine Anwendungslogik wurde geändert, keine neue Rechtsrecherche durchgeführt und keine Rechtsauffassung als bestätigt freigegeben. Tickets stehen hier als Markdown, nicht als separat angelegte GitHub-Issues. Kein Versand an Beratungsstellen oder andere Empfänger ist beauftragt.

**Ziel:** Jede handlungsleitende Aussage ist nachvollziehbar belegt, passt zu den bekannten Tatsachen und macht ihre Grenzen verständlich. Ein Mensch kann den empfohlenen nächsten Schritt in eigenen Worten erklären.

**Reihenfolge:** Rechts- und Verfahrensprüfung → belastbare Berechnung → verständliche Darstellung → Praxistest → zusätzliche Funktionen.

## 1. Grundlage und Umfang der Sichtung

Geprüfter Repository-Stand: `1f40b33ee3a9560db860a9721d314f1349d2e890` auf `main`. Vor Umsetzung aktuellen Stand und parallele Änderungen prüfen.

Gelesen wurden:
- `AGENTS.md`
- `07-demos/gruendungsnavigator/README.md`
- `07-demos/gruendungsnavigator/pruefakte.md`
- `07-demos/gruendungsnavigator/ticket-01-vorlage.md`
- `scripts/check-gruendungsnavigator-zitate.mjs`
- `src/engine/gruendungsnavigator/gruendungsnavigator.ts`

Die Repository-Dateiliste wurde zusätzlich gesichtet. Keine vollständige Prüfung aller Daten, Module oder UI-Texte; kein Testlauf in dieser Planungssitzung. Angaben zu früheren Tests sind Dokumentationsbefunde, keine neu reproduzierten Ergebnisse.

### Bereits vorhandene Grundlage

Laut Dokumentation gibt es bereits:
- ein gemeinsames Normregister sowie getrennte Daten für Gesprächsnavigator, Fall-Landkarte und Branchenpakete;
- deterministische Kerne für Fristen, Rechner, Meldeversäumnisse, Briefe und Kalender;
- Tests für Struktur, Berechnung, Datenabgleich und einzelne Gegenproben;
- mobile und Offline-Funktionen, Druckausgabe und ein Kontaktprotokoll.

Diese Bausteine weiterverwenden. Nicht nochmals einen allgemeinen Chatbot oder einen zweiten Rechtsdatenbestand daneben bauen.

## 2. Befunde und offene Prüfungen

| ID | Evidenz | Befund | Konsequenz |
|---|---|---|---|
| F01 | Prüfakte, Abschnitt 3c | Die Dokumentation nennt ausdrücklich die fehlende Prüfung der Rechner durch Juristin/Juristen oder Sozialberatung. | Automatisierte Tests nicht als fachjuristische Freigabe darstellen. |
| F02 | Prüfakte, Abschnitt 3c | Ein früherer Wortlaut war richtig, die erklärende Überschrift jedoch missverständlich; dies ist dort als behoben dokumentiert. | Auch Überschriften, Kurzfassungen und Handlungsschlüsse einzeln prüfen. Kein neuer offener Fehler aus diesem historischen Befund ableiten. |
| F03 | Zitat-Prüfskript | Exit 0 ist bei passenden Zitaten trotz teilweise nicht abrufbarer Quellen möglich. | Diagnose und vollständige Freigabe unterscheiden; unvollständige Prüfung sichtbar erhalten. |
| F04 | Zitat-Prüfskript | Zitatstücke werden unabhängig auf Vorkommen geprüft. Reihenfolge und Kontext sind damit nicht abgesichert. Stücke bis acht Zeichen werden ignoriert; eine leere Stückliste kann ohne Abweichung durchlaufen. | Leere Prüffälle ablehnen und geordnete, nachvollziehbare Fundstellen verlangen. |
| F05 | Zitat-Prüfskript | Datumsaktualisierung nach erfolgreichem Abgleich wird im Kommentar empfohlen. | Abrufdatum, Zitatprüfung und inhaltliche Prüfung getrennt dokumentieren. Ein Treffer beweist keine geprüfte Auslegung. |
| F06 | Kern, VERSPRECHENSWOERTER | Allgemeine Wörter wie „rechtswidrig“ oder „Anspruch besteht“ sind pauschal gesperrt. | Eine Wortliste ist kein Ersatz für Prüfung von Voraussetzungen und Belegen. Änderungen erst mit fachlicher Prüfung; bestehende Schutzwirkung nicht ersatzlos löschen. |
| F07 | Kern, FristEingabe | Bei nicht gesetztem Feld wird eine korrekte Rechtsbehelfsbelehrung angenommen. | Unbekannt als eigenen Zustand modellieren und keine stille Tatsachenannahme verwenden. |
| F08 | Kern, Fristen | Verschiedene Fristarten und Verfahrensfragen teilen Rechenhelfer; zusätzliche Feiertage können übergeben werden. Mehrere Ergebnisse enthalten weitreichende rechtliche Aussagen. | Anwendbarkeit, Ausnahmen, Feiertagszuständigkeit und jede Fristart unabhängig prüfen. Gemeinsam verwendeter Code beweist keine gleiche Rechtsregel. |
| F09 | Prüfakte, Abschnitt 3a | Branchenhinweise beruhen laut Dokumentation teilweise auf allgemeinem Wissen ohne Primärquelle/Fachprüfung. | Als ungeprüft erhalten oder gezielt belegen; keine fachliche Freigabe durch bloße Frageform suggerieren. |
| F10 | Prüfakte, Abschnitte 1 und 5 | RDG-Abgrenzung ist als offene Bedingung dokumentiert. | Konkrete Funktionen und Personalisierung fachjuristisch beurteilen lassen. Ein Disclaimer erledigt diese Frage nicht. |
| F11 | README und Prüfakte | README nennt unter Grenzen „keine Widerspruchstexte“, beschreibt aber zugleich entsprechende Briefbausteine. | Aktuellen Funktionsumfang und rechtliche Grenzen widerspruchsfrei beschreiben. |

F07–F08 sind Review-Anlässe, keine Feststellung, dass eine konkrete Frist falsch berechnet wird. Rechtsstand, Reformbehauptungen und gesetzliche Bezeichnungen im bestehenden Repository wurden in dieser Sitzung nicht extern verifiziert.

## 3. Umsetzungstickets

Die IDs GN-P01 bis GN-P06 sind Plan-IDs, keine Fortsetzung bereits bestehender Ticketnummern und keine GitHub-Issue-Nummern.

### GN-P01 — Rechtsaussagen inventarisieren und belegen

**Priorität:** P0 · **Abhängigkeiten:** keine

**Problem:** Normverweis, richtiges Zitat und richtige Anwendung sind verschiedene Prüfschritte.

**Arbeitsbereich:** `data/normen.json`, `data/navigator.json`, `data/landkarte.json`, `data/pakete/` unter `07-demos/gruendungsnavigator/`; alle drei öffentlichen HTML-Seiten; Engine und Briefbausteine.

**Arbeit:**
- Jede handlungsleitende Aussage erhält eine stabile ID und ihre Fundstellen.
- Erfassen: Aussage, Quelle/Fundstelle, Quellentyp, Voraussetzungen, Ausnahmen, zeitlicher und örtlicher Geltungsbereich, rechtliche Einordnung, Prüfstatus.
- Gesetze, Rechtsprechung, Verwaltungsvorgaben und örtliche Arbeitshilfen getrennt behandeln. Widersprüche dokumentieren und nicht per Mehrheitsentscheidung auflösen.
- Primärquellen tatsächlich lesen; Suchschnipsel, Modellwissen und existierende Repository-Angaben nicht als Bestätigung zählen.
- Wortlaut, Kurzfassung, Berechnung und praktische Empfehlung getrennt bewerten.
- Bestehende Norm-IDs nutzen; kein zweites konkurrierendes Normregister anlegen.

**Abnahme:**
- [ ] Alle Ausgabekanäle einschließlich Überschriften, Druck, Brief und Kalendertext erfasst.
- [ ] Jede Aussage ist belegt, offen gekennzeichnet oder aus dem geprüften Umfang ausgeschlossen.
- [ ] Prüfdatum und Identität/Rolle der prüfenden Stelle nachvollziehbar; KI-Prüfung und externe Fachprüfung unterscheidbar.
- [ ] Stichprobe enthält eine wörtlich richtige, aber inhaltlich irreführende Erklärung, die beanstandet wird.

### GN-P02 — Verfahrensstand und erforderliche Tatsachen modellieren

**Priorität:** P0 · **Abhängigkeiten:** P01 liefert die belegten Regeln; Entwicklung mit offenen Statuswerten möglich.

**Arbeitsbereich:** bestehende Engine, Gesprächsbaum, Landkarte, Jobcenter-Hilfe.

**Arbeit:**
- Verfahrenswege für Antrag, Unterlagenanforderung, Anhörung, Bescheid, Widerspruchsbescheid und gerichtliches Verfahren getrennt spezifizieren.
- Zuständige Stelle, Leistungsart, Dokumentart, relevante Daten und begehrtes Ergebnis nur abfragen, wenn sie für den Pfad gebraucht werden.
- „Weiß ich nicht“ und widersprüchliche Angaben als echte Zustände vorsehen.
- Mündliche Aussage und schriftliche Entscheidung unterscheiden, ohne die Person zu einer rechtlichen Einordnung zu zwingen.
- Pro Pfad: benötigte Tatsachen, mögliche Ausgänge, Belege, nächster Schritt und Grenze der eigenen Hilfe.
- Existenzielle Dringlichkeit als eigenen, fachlich zu prüfenden Beratungsweg behandeln; keine pauschale Warteempfehlung aus einer allgemeinen Zeitgrenze ableiten.

**Abnahme:**
- [ ] Unklare Dokumentart führt zu Klärungsfragen statt Rechtsbehelfsvorschlag.
- [ ] Unbekannte Belehrung wird nicht automatisch als korrekt behandelt.
- [ ] Derselbe Wortlaut in unterschiedlichen Verfahrensstadien kann unterschiedliche, begründete Ergebnisse liefern.
- [ ] Keine Antwort erfindet fehlende Tatsachen oder eine erfolgte Zustellung.

### GN-P03 — Fristen und Rechner fachlich unabhängig prüfen

**Priorität:** P0 · **Abhängigkeiten:** P01 und P02

**Arbeitsbereich:** `src/engine/gruendungsnavigator/`, insbesondere Fristen, Meldeversäumnisse, Rechner und Kalender.

**Arbeit:**
- Jede Regel erhält eine Beschreibung ihrer Anwendbarkeit und unabhängig hergeleitete Sollfälle.
- Prüfkatalog: Bekanntgabe/Zugang, Übermittlungsart, Belehrung, Monatsende, Schaltjahr, relevante Landes-/örtliche Feiertage, Auslandssachverhalte soweit unterstützt, Übergangsrecht und Ausnahmen.
- Verfahrenstexte prüfen: Ablauf einer Wartezeit ist nicht allein der Nachweis sämtlicher Voraussetzungen einer gerichtlichen Handlung.
- Ungeklärte Tatsachen als bedingte Szenarien ausgeben; kein einzelnes sicheres Datum vortäuschen.
- Kalenderexport erst bei ausreichend geklärter Grundlage; Unsicherheit und Herkunft im Export erhalten.
- Testorakel muss unabhängig sein; keine Sollwerte aus derselben Funktion ableiten.

**Abnahme:**
- [ ] Jede Regel hat positiven Fall, Gegenfall und Fall mit fehlenden Angaben.
- [ ] Ausgabe nennt Eingaben, Ergebnisart, Grundlage und relevante Annahmen.
- [ ] Mindestens eine gezielt eingebaute falsche Regel wird durch unabhängige Tests erkannt.
- [ ] Fachliche Reviewer dokumentieren auch Einschränkungen und nicht unterstützte Fälle.
- [ ] Keine blanketartige Freigabe aller Rechner durch Prüfung nur eines Moduls.

### GN-P04 — Quellenprüfung und Freigabestatus härten

**Priorität:** P0 · **Abhängigkeiten:** P01; technische Tests parallel zu P02/P03 möglich.

**Arbeitsbereich:** `scripts/check-gruendungsnavigator-zitate.mjs`, Normregister und Prüfakte.

**Arbeit:**
- Getrennte Ergebnisse: passend, abweichend, nicht prüfbar, unvollständig.
- Strengen Freigabemodus ergänzen, in dem relevante nicht abrufbare Quellen keine vollständige Freigabe ergeben.
- Leere/nicht sinnvoll prüfbare Zitate beanstanden; Fundstellen in korrekter Reihenfolge prüfen.
- Quellversion, Abrufdatum und zitierte Fundstelle protokollieren; bei Bedarf reproduzierbaren Auszug/Hash unter Beachtung der Nutzungsrechte speichern.
- Erreichbarkeits-, Wortlaut-, Auslegungs- und Anwendbarkeitsprüfung voneinander trennen.
- Veraltete oder geänderte Quellen sowie Offline-Stand für Nutzer sichtbar machen.
- Kein vollständiges Prüfdatum nachziehen, wenn nur ein Teil geprüft wurde.

**Abnahme:**
- [ ] Tests für Teilausfall, alle Abrufe fehlgeschlagen, falsches Zitat, vertauschte Fragmente, nur ignorierte Kurzstücke und geänderte Quelle.
- [ ] Passende Zitate mit einer fehlenden Quelle ergeben im strengen Modus keine vollständige Freigabe.
- [ ] Prüfberichte behaupten ausdrücklich keine juristische Bestätigung durch Textabgleich.
- [ ] Einfache Sprache und Kurzfassungen haben eigene inhaltliche Review-Zuordnung.

### GN-P05 — Verständliche Handlungsansicht und Selbstvertretung

**Priorität:** P1 · **Abhängigkeiten:** fachlich geprüfte Teilpfade aus P01–P04

**Arbeitsbereich:** bestehende Seiten, Briefbausteine, Druckansicht, Pakettexte.

**Arbeit:**
- Einheitliche Antwortstruktur: „Das bedeutet für Sie“, „Das können Sie jetzt tun“, „Das brauchen Sie dafür“, „Das ist noch unklar“.
- Fachbegriffe beim ersten Auftreten erklären; Details und Originalquellen aufklappbar anbieten.
- Verlässliche Rechte nicht durch pauschale Vorsichtssprache verschleiern; Ermessensentscheidungen und offene Fragen genauso klar benennen.
- Tatsachen der Person von erfundenen Branchenbeispielen sichtbar trennen.
- Formulierungshilfen bleiben sachlich, anpassbar und enthalten keine erfundenen Begründungen.
- Dokumentation von Einreichung und Gespräch unterstützen; eigene Notiz, Deckblatt und tatsächlicher Eingangsnachweis begrifflich trennen.
- Wortlisten durch kontextbezogene Prüfungen ergänzen; fachlich bestätigte Aussagen dürfen nicht allein wegen eines Wortes scheitern.
- Keine verpflichtende Spracheingabe, Anmeldung oder unnötige Erhebung sensibler Daten. Tastatur, Screenreader, Handy und Druck berücksichtigen.

**Abnahme:**
- [ ] Testpersonen können ohne Erklärung ihren nächsten Schritt und die benötigten Unterlagen nennen.
- [ ] Sie erkennen Unsicherheit und wissen, was noch zu klären ist.
- [ ] Fachreview bestätigt, dass Vereinfachungen Bedingungen und Ausnahmen erhalten.
- [ ] Brief und Ausdruck übernehmen keine erfundenen Beispieldaten als persönliche Tatsachen.

### GN-P06 — Fachreview, Praxistest und überprüfbare Freigabe

**Priorität:** P0 als Freigabebedingung · **Abhängigkeiten:** geprüftes Teilpaket aus P01–P05

**Arbeit:**
- Fachjuristisch Scope und RDG-Frage je Funktion prüfen lassen, insbesondere personalisierte Handlungsempfehlungen und Briefe. Offene Frage, kein vorweggenommenes Rechtsurteil.
- Qualifizierte Sozialrechtsprüfung mit praktischer Beratungserfahrung verbinden.
- Fiktive oder wirksam anonymisierte Fälle verwenden: fehlende Unterlagen, unklarer Brief, mündliche Ablehnung, strittige Entscheidung, unbekannte Bekanntgabe, dringender Geldmangel und örtliche Besonderheiten.
- Tests mit Menschen ohne Verwaltungswissen, darunter Menschen mit wenig Deutschkenntnissen; keine Behauptung formaler „Leichter Sprache“ ohne entsprechende Prüfung.
- Verständnis, sachlich geeigneten nächsten Schritt, Zeitbedarf und gefährliche Fehlinterpretationen messen; Zufriedenheit allein reicht nicht.
- Schwere Fehler sperren das betroffene Modul. Korrektur, erneute Prüfung und Rücknahme veralteter Ausgaben dokumentieren.

**Abnahme:**
- [ ] Reviewer-Rolle, Umfang, Datum, Vorbehalte und offene Punkte schriftlich festgehalten.
- [ ] Keine ungelösten kritischen Befunde im freigegebenen Umfang.
- [ ] Praxistest-Ergebnisse einschließlich Fehlern dokumentiert.
- [ ] Freigabe gilt nur für ausdrücklich geprüfte Module und Rechtsstände.
- [ ] Spätere Änderungen lösen gezielte erneute Prüfung betroffener Aussagen und Ausgaben aus.

## 4. Ideen nach der Präzisionsphase

Diese Ideen sind noch keine Freigabe zur Implementierung:

1. **Gespräch üben:** Skeptische, realistische Nachfragen; Nutzer antworten in eigenen Worten. Fachlich geprüfte Inhalte verwenden und keine Erfolgsgarantie geben.
2. **Schwachstellenprüfung:** Fehlende Nachweise, unklare Kosten und unbelegte Annahmen im Vorhaben zeigen; kein erfundener Tragfähigkeits-Score.
3. **Vage Ablehnung konkretisieren:** Verständliche Fragen anbieten, etwa welche Unterlagen oder Voraussetzungen fehlen. Geeignete Formulierung hängt vom Verfahrensstand ab.
4. **Vorbereitungsblatt:** Ziel, belegte Tatsachen, Unterlagen, Fragen und Platz für Antworten. Bestehende Druckfunktion erweitern.
5. **Kritik als Regressionstest:** Konkrete sachliche Einwände aus Rückmeldungen in Fallprüfungen übersetzen. Keine persönlichen Angriffe oder bloßen Beliebtheitsbewertungen als fachliche Evidenz.
6. **Aktualität sichtbar halten:** Auch offline anzeigen, welchen geprüften Stand eine Ausgabe nutzt. Quellenänderungen führen zu erneuter Prüfung statt automatischer Behauptung einer neuen Rechtslage.

## 5. Empfohlener erster Umsetzungsumfang

Zuerst den vorhandenen Gründungsnavigator mit seinen unmittelbar benötigten Verfahrenspfaden prüfen. Breitere Jobcenter-Hilfe separat modulweise freigeben. Bereits ausgelieferte Module werden trotzdem in P01 inventarisiert; ihr aktueller Prüfstatus darf nicht unsichtbar werden.

Erster umsetzender PR: P01-Inventar plus P04-Prüferhärtung, ohne neue rechtliche Versprechen. Anschließend P02/P03 je überschaubarem Verfahrenspfad. P05 verwendet nur die dafür geprüften Inhalte. P06 ist Voraussetzung für Aussagen über fachlich geprüfte Zuverlässigkeit.

## 6. Übergabe an den nächsten Agenten

1. Aktuelles `main`, `AGENTS.md`, diesen Plan und bestehende Tickets lesen; parallele Änderungen abgleichen.
2. Bestehende Prüfakte als Ausgangspunkt verwenden, nicht als externe Bestätigung.
3. Zuerst P01 starten und ungeklärte Behauptungen sammeln, ohne sie stillschweigend zu korrigieren.
4. Bei Umsetzung gezielte Vitest-Tests, `npm run build:gn`, `npm run check:gn-zitate` bei verfügbarem Netz sowie relevante mobile/Browser-Prüfungen ausführen; Ergebnisse ehrlich dokumentieren. Repository-Pflichtprüfungen gemäß aktuellem AGENTS.md beachten.
5. Bei Änderungen am kanonischen Dosenstatus, Ticket oder Dossier die DE/EN-Dossiers, Frontend-Daten, Exporte und das Prüfprotokoll gemäß AGENTS.md gemeinsam aktualisieren. Dieser neue Arbeitsplan ändert diese kanonischen Angaben nicht.
6. Keine ungeprüften Rechtsaussagen, neuen Quellenbewertungen oder Reviewer-Freigaben erfinden.
7. Keine Vertex-Aufrufe, kostenpflichtigen APIs oder Kontaktaufnahmen aus diesem Plan ableiten.

### Quellenmeldung für den Bibliothekar

Art: interne Repository-Sichtung und Verbesserungsvorschlag, keine externe Rechtsrecherche. Grundlage: oben genannter Commit und gelesene Dateien. Ergebnis: F01–F11, GN-P01–GN-P06, sechs zurückgestellte Funktionsideen. Keine neue Quelle im zentralen Register eingetragen; keine Vektoren oder Existenzurteile verändert. Bibliothekar kann diesen Plan als ungeprüften Arbeitsauftrag verknüpfen, nicht als fachjuristischen Befund.

---
status: Available
delivery_method: E-Mail
target_maker: Deutsche Umwelthilfe e.V.
review_score: 24/35
architecture_tier: Tier 1
source_type: Type A
---
# Vernichtungs-Offenlegungsregister

*(englisch: Destruction Disclosure Register)*

**Ein Satz:** Ein offenes Register der Pflichtangaben, die große Unternehmen nach Art. 24 ESPR über vernichtete unverkaufte Verbraucherprodukte veröffentlichen müssen. Sein Kern ist ein deterministischer Prüfer gegen das Tabellenformat aus Anhang I der DVO (EU) 2026/2, der nie „Verstoß“ sagt, sondern nur „gefunden“ oder „keine Offenlegung gefunden (Stand, Suchweg)“.

**Stand:** 28.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** **Deutsche Umwelthilfe e.V. (DUH), Bereich Kreislaufwirtschaft.** Die DUH führt Kampagnen gegen Retouren- und Warenvernichtung und warnt öffentlich vor Vollzugslücken beim Vernichtungsverbot („fehlende Unternehmenslisten“). **Ansprechperson vor Versand verifizieren** (auf duh.de: Name, Funktion, Adresse). Es ist keine Person ermittelt, und ohne Verifikation geht keine Mail raus. · nachrangig: Greenpeace e.V. (Kampagne Warenvernichtung), Changing Markets. Auch hier ist keine Person ermittelt.
**Verdikt:** 🔨 erst Skelett, dann verschenken. Der Empfänger hat ein Kampagnenmandat, aber keinen Softwarearm. Das Geschenk ist erst dann brauchbar, wenn Schema, Prüfer und eine echte Offenlegung als Fixture im Scaffolding liegen.
**Review:** 24/35 · Tier 1 (Kern) / Tier 2 (Register) · Type A, nur Suchschnipsel (Details: `06-suche/amelie-classification-log.md`, ESPR-Runde 28.09.2026)
**Status:** gepackt, nicht zugestellt. Keine Mail angelegt.

---

## Das Problem

Seit dem Geschäftsjahr 2025 müssen große Unternehmen, die unverkaufte Verbraucherprodukte entsorgen, einmal im Jahr offenlegen, wie viel sie entsorgt haben, warum und auf welchem Weg (Art. 24 ESPR, VO (EU) 2024/1781). Diese Angaben erscheinen verstreut auf Firmenseiten, als eigenes PDF oder als Kapitel im Nachhaltigkeitsbericht. Die Suche nach dem exakten Pflichttitel („Disclosure on Discarded Unsold Consumer Products“) fand genau ein Dokument, die Signify-Offenlegung zum GJ 2025 vom 04.05.2026. Der Lückensatz lautet: **Die Pflichtzahlen über vernichtete Ware stehen jedes Jahr auf hunderten Firmenseiten und in PDFs, aber nirgends nebeneinander.**

**Wer leidet:** Umweltverbände wie DUH und Greenpeace, die die Wirkung des Vernichtungsverbots (Textilien und Schuhe seit 19.07.2026) belegen wollen und dafür jede Offenlegung einzeln suchen müssen. Die Kommission braucht dieselben Zahlen, um über eine Ausweitung des Verbots nach Art. 25 zu entscheiden.

## Warum das jetzt geht

1. **Der erste Jahrgang erscheint jetzt.** Die Offenlegung für GJ 2025 ist binnen 12 Monaten fällig, bei Kalender-Geschäftsjahr also bis 31.12.2026. Das Format ist bis dahin frei. Wer den ersten Jahrgang sammelt, setzt das Format der Debatte.
2. **Das Pflichtformat kommt, aber später.** Die DVO (EU) 2026/2 (ABl. 10.02.2026) gilt ab 02.03.2027. Das Tabellenformat aus Anhang I ist Pflicht für Geschäftsjahre, die am oder nach dem 02.03.2027 beginnen, bei Kalender-GJ also erstmals für GJ 2028, offengelegt 2029. So lautet die Mehrheitslesart in sechs unabhängigen Schnipseln. Eine Minderheitslesart (GJ ab 02.03.2026) ist verworfen, aber nicht widerlegt.
3. **Das Why-Now-Fenster ist befristet und ehrlich benannt.** Für GJ 2025 bis 2027 (veröffentlicht 2026 bis 2028) liegen drei Jahrgänge in freiem, uneinheitlichem Format vor: Tabellen, Fließtext, CSRD-Kapitel, PDF und HTML. Sie lassen sich per LLM-Extraktion mit menschlicher Bestätigung in ein Schema bringen, was vor 2024 nicht mit vertretbarem Aufwand ging. Ab Offenlegungsjahr 2029 genügt ein deterministischer Parser. **Der dauerhafte Kern ist deshalb der deterministische Prüfer gegen Anhang I. Die LLM-Stufe ist ein Übergangsmodul und nicht das Herz der Dose.**

## Skizze

- **Eingabe:** je Unternehmen und Geschäftsjahr eine Offenlegung, von Hand oder per LLM-Vorschlag mit menschlicher Bestätigung in das Anhang-I-Schema übertragen. Dazu kommen Quell-URL, Abrufdatum und ein Archiv-Snapshot. Für fehlende Offenlegungen werden Stand und Suchweg festgehalten (welche Seiten, welche Suchbegriffe, an welchem Tag).
- **Logik:** `pruefeOffenlegung()` ist deterministisch und läuft ohne Netz und ohne Modell. Er prüft, ob die Prozentsummen der Behandlungswege 100 ergeben, ob jeder Grund aus der Ausnahmeliste stammt, ob die CN-Codes formal stimmen, ob Stückzahl und Gewicht je Warengruppe plausibel zueinander passen und ob Schätzungen gekennzeichnet sind. Jeder Befund trägt eine Regel-ID und ist **als Frage formuliert** (z. B. „Die Anteile summieren sich auf 92 %. Fehlt ein Behandlungsweg?“).
- **Ausgabe:** eine statische CSV/JSON-Tabelle je Unternehmen × Geschäftsjahr mit nur zwei Status: **„gefunden“** oder **„keine Offenlegung gefunden (Stand: Datum, Suchweg)“**. Die Ausgabe sagt **nie „Verstoß“, „säumig“ oder „fehlt“**. Der Grund: Die Pflicht ist bedingt. Sie entsteht nur, wenn ein Unternehmen unverkaufte Ware entsorgt, und „keine Offenlegung gefunden“ kann auch „nichts entsorgt“ heißen.
- **Startliste:** Es gibt keine Liste der Verpflichteten. Das Register braucht deshalb eine **kuratierte Startliste**, z. B. große Bekleidungs- und Schuhhändler in Deutschland, die unter das Textilverbot fallen, ergänzt um die Exakttitel-Suche. Die Startliste ist offen gelegt und datiert. Ohne Nenner ist jede Quote eine Behauptung, deshalb gibt das Register keine Quoten aus.
- **Schema-Stand:** Das Anhang-I-Schema ist **`vorläufig`**. Es stammt bisher nur aus Kanzlei- und Anbieterschnipseln, weil der Normtext (DVO 2026/2 Art. 2/3 und Anhang I, ESPR Art. 24 Abs. 1) nicht gelesen werden konnte. Die Markierung fällt erst, wenn das Schema Feld für Feld gegen den Normtext geprüft ist.

**Nicht dabei:** keine Bewertung von Unternehmen, keine Rangliste, kein Pranger, keine Quoten ohne Nenner. Kein Crawler im Dauerbetrieb, kein Server, keine Datenbank (ein jährlicher Lauf beim Kurator genügt). Keine Ersatzteilpreise (die Ersatzteilpreis-Zeitreihe ist ausdrücklich nicht Teil dieser Dose). Keine Rechtsberatung.

## Erster Schritt

**Ticket 01: Anhang I als Schema, ein Prüfer, eine echte Offenlegung.** Das Anhang-I-Format der DVO (EU) 2026/2 wird als JSON-Schema abgebildet (`anhang1-schema.json`), dazu kommt ein deterministischer TypeScript-Prüfer `pruefeOffenlegung(offenlegung)`.

**Vorbedingung:** Vor dem Schema den Normtext DVO 2026/2 (Art. 2/3, Anhang I) und ESPR Art. 24 Abs. 1 im Volltext lesen. Ist er nicht erreichbar, trägt das Schema `"status": "vorläufig"` und nennt je Feld die Schnipselquelle.

**Fertig, wenn:**
- eine Vitest-Suite mit mindestens 15 Fällen grün ist, darunter: vollständige Offenlegung (0 Befunde), Prozentsumme ≠ 100, Grund außerhalb der Ausnahmeliste, ungültiger CN-Code, Stück und Gewicht unplausibel, fehlende Schätzkennzeichnung, Freitext-Offenlegung ohne Tabelle (läuft durch, Felder `unbekannt`);
- die **Signify-Offenlegung zum GJ 2025** (PDF vom 04.05.2026) von Hand als erste Fixture übertragen ist, mit Quell-URL und Abrufdatum;
- ein Test sicherstellt, dass keine Ausgabe die Wörter „Verstoß“, „säumig“ oder „violation“ enthält und dass der einzige Status für fehlende Offenlegungen „keine Offenlegung gefunden“ mit Datum und Suchweg ist;
- jeder Befund eine Regel-ID und eine Klartextfrage (De/En) trägt;
- das Schema seinen Stand ausweist (`vorläufig` oder `gegen Normtext geprüft am …`);
- alles im Scaffolding unter `07-demos/vernichtungs-offenlegungsregister/` liegt (Regel 4).

## Wo es kippt

**Das Register wird als Pranger gelesen, obwohl eine fehlende Offenlegung nichts beweist.** Die Pflicht ist bedingt, und es gibt keine Liste der Verpflichteten. Eine Zeile „keine Offenlegung gefunden“ neben einem Markennamen wirkt trotzdem wie ein Vorwurf, und eine „unplausibel“-Markierung kann eine Abmahnung auslösen. Die Gegenmaßnahme liegt in der Architektur: nur die zwei neutralen Status, Befunde als Fragen, jede Zeile mit Quell-URL, Abrufdatum und Archiv-Snapshot, keine Quoten, eine offen gelegte Startliste.

**Zweitens: Kurator-Ermüdung und Nachzug.** Das Register braucht jedes Jahr Kuratorarbeit. Die Kommission oder ein Compliance-Anbieter kann ein eigenes Register nachziehen (Präzedenz: UK Modern Slavery Act, wo NGOs zuerst sammelten und die Regierung später ein Register baute). Deshalb ist der Kern der Prüfer, nicht die Sammlung. Er bleibt bis 2029 als Selbsttest für Unternehmen nützlich und ist danach der einzige nötige Parser.

**Offen gelegt:**
- **Evidenz nur aus Suchschnipseln.** WebFetch auf eur-lex.europa.eu lieferte `EGRESS_BLOCKED`. Weder der Normtext noch die Signify-Offenlegung wurde im Volltext gelesen.
- **Die Zeitachse beruht auf der Mehrheitslesart** von Kanzleischnipseln. Freshfields widerspricht sich zwischen zwei Schnipseln selbst.
- **Das Anhang-I-Schema ist vorläufig**, bis es gegen den Normtext geprüft ist.
- **Es ist keine Empfängerperson ermittelt.**

## Wer es schon versucht hat

**Recherche 28.09.2026 (ESPR-Runde; Dreifachfund aller drei Engines, 11 unabhängige Gegen-Suchen des Reviewers in DE und EN), nur Suchschnipsel.** Details: `06-suche/amelie-pruefprotokoll.md`, Abschnitt ESPR-Runde.

- **Kein Aggregator gefunden,** weder bei NGOs, im Journalismus noch bei der Kommission. Gesucht wurde u. a. nach „ESPR Article 24 disclosure tracker“, nach Auswertungen von Changing Markets, EEB und Zero Waste Europe sowie nach Auswertungen von Greenpeace und DUH.
- **Nur herstellerseitige Compliance-Werkzeuge:** Flexireo, Generation Impact, Cleo Labs, Complir, Compliance & Risks. Dazu kommen Erklärtexte von Kanzleien (Cooley 07.05.2026, Freshfields, Linklaters, Cattwyk, trade-e-bility).
- **Die Kommission ist Datennutzerin, nicht Sammlerin.** Sie muss die Art.-24-Offenlegungen berücksichtigen, bevor sie das Verbot nach Art. 25 ausweitet. Laut ESPR-Arbeitsplan 2025–2030 plant sie aber keine Ausweitung in den nächsten fünf Jahren, ihr Sammelanreiz ist also kurzfristig schwach.
- **Prämisse belegt:** Signify N.V., „Disclosure on Discarded Unsold Consumer Products“, GJ 2025, eigenes PDF vom 04.05.2026.
- **Muster bekannt:** Beim UK Modern Slavery Act sammelten NGOs (Business & Human Rights Resource Centre, TISCreport) zuerst die verstreuten Pflichterklärungen.

**Restlücke:** Ein offenes, datiertes Register der Art.-24-Offenlegungen mit einem deterministischen Anhang-I-Prüfer, das fehlende Offenlegungen neutral als „keine Offenlegung gefunden (Stand, Suchweg)“ führt.

## Vorarbeit

- Verordnung (EU) 2024/1781 (Ökodesign für nachhaltige Produkte, ESPR), Art. 24 (Offenlegung) und Art. 25 (Vernichtungsverbot): https://eur-lex.europa.eu/eli/reg/2024/1781/oj (nicht abrufbar, `EGRESS_BLOCKED`)
- Durchführungsverordnung (EU) 2026/2, Anhang I (Offenlegungsformat), ABl. 10.02.2026, gilt ab 02.03.2027. Nur als Schnipsel gesehen. **Normtext vor Ticket 01 lesen.**
- Signify N.V., „Disclosure on Discarded Unsold Consumer Products“, GJ 2025, PDF vom 04.05.2026 (assets.signify.com, Dateiname `20260504-signify-espr-disclosure.pdf`, nur Schnipsel, vollständige URL vor Nutzung ermitteln)
- Kanzlei-Erklärtexte (Schnipsel): Cooley (products.cooley.com, 07.05.2026), Freshfields, Linklaters, Cattwyk, trade-e-bility; Anbieter: Generation Impact
- Umweltbundesamt, Themenseite Vernichtungsverbot (umweltbundesamt.de, nur Schnipsel)
- DUH-Pressemitteilung zu fehlenden Unternehmenslisten beim Vernichtungsverbot (duh.de; gespiegelt bei it-boltwise.de, nur Schnipsel)
- Herkunft: Dreifachfund der ESPR-Runde. Ideenrunde („Vernichtungs-Register“), Bisoziation (ESPR Art. 24 × EURING-Ringfundzentrale, „Offenlegungs-Sammelbuch“) und Inversion (OP-4, „Offenlegungsregister“). Atlas-Muster: „Offenlegungspflicht ohne Register → Register frei“.
- Die Dose online: https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

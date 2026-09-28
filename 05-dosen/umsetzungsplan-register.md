---
status: Available
delivery_method: E-Mail
target_maker: 'DENEFF e.V., Christian Noll'
review_score: 25/35
architecture_tier: Tier 1
source_type: Type A
---
# Umsetzungsplan-Register

*(englisch: Implementation Plan Register)*

**Ein Satz:** Ein offenes, datiertes Register der Umsetzungspläne, die Unternehmen nach § 9 EnEfG veröffentlichen müssen. Sein Kern ist ein deterministischer Prüfer gegen die 7 Pflichtangaben des BAFA-Merkblatts, der nie „säumig“ oder „Verstoß“ sagt, sondern nur „gefunden“ oder „kein Plan gefunden (Stand, Suchweg)“.

**Stand:** 28.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** **DENEFF e.V. (Deutsche Unternehmensinitiative Energieeffizienz), Christian Noll, geschäftsführender Vorstand.** DENEFF hat ein Effizienzpolitik-Mandat und wehrt sich gegen die Aufweichung der EnEfG-Novelle. Noll ist nur als Autor der Novellen-Erklärseite vom 07.07.2026 auf deneff.org genannt. **Ansprechperson unverifiziert: vor Versand Name, Funktion und Adresse auf deneff.org verifizieren.** · nachrangig: Umweltinstitut München (Dr. Leonard Burtscher, Autor der EnEfG-Meldung vom 17.07.2024, heutige Funktion **nicht geprüft**, **vor Versand verifizieren**).
**Verdikt:** 🔨 erst Skelett, dann verschenken. Der Empfänger argumentiert bisher mit Modellrechnungen und hat keinen Softwarearm. Das Geschenk ist erst brauchbar, wenn Schema, Prüfer und drei echte Pläne als Fixtures im Scaffolding liegen.
**Review:** 25/35 · Tier 1 (Kern) / Tier 2 (Register) · Type A, Normtexte und drei Pläne gelesen (Details: `06-suche/amelie-classification-log.md`, Offenlegungs-Runde 28.09.2026)
**Status:** gepackt, nicht zugestellt. Keine Mail angelegt.

---

## Das Problem

Unternehmen mit hohem Energieverbrauch müssen nach einem Energieaudit binnen drei Monaten Umsetzungspläne für die wirtschaftlichen Maßnahmen erstellen und veröffentlichen (§ 9 EnEfG, Entwurf BT-Drs. 21/8027 vom 16.09.2026). Die Pläne stehen verstreut auf Firmenwebsites oder in Jahresberichten. Ein Sammler fehlt in EED und EnEfG, und eine Suche in Deutsch und Englisch fand keinen Aggregator, nur Berater-Erklärtexte und Modellrechnungen (Fraunhofer-ISI-Kurzexpertise für DENEFF, Umweltinstitut ~54 TWh Mindereinsparung, nicht aus Plandaten). Der Lückensatz lautet: **Tausende Firmen müssen öffentlich sagen, welche wirtschaftlichen Sparmaßnahmen noch offen sind, aber niemand zählt, wie viele liegen bleiben.**

**Wer leidet:** Effizienz- und Umweltverbände wie DENEFF, die im laufenden Gesetzgebungsverfahren mit Modellrechnungen statt mit Plandaten argumentieren. Dazu kommen Journalistinnen und Wissenschaftler, die die Wirkung der Pflicht prüfen wollen. Pläne verschwinden schon heute: Der Plan der Diakonie Stetten liefert nach gut einem Jahr 404.

## Warum das jetzt geht

1. **Die Debatte läuft jetzt.** Erste Lesung des Regierungsentwurfs am 24.09.2026. Der Bundesrat beantragt die Streichung der Veröffentlichungspflicht (Stellungnahme Nr. 25, „Bürokratieabbau“), die Bundesregierung hält in der Gegenäußerung an der Veröffentlichung fest.
2. **Ein Standardformat existiert faktisch.** Das BAFA-Merkblatt schreibt 7 Pflichtangaben mit Musterbeispiel vor (Priorität, Maßnahmenbezeichnung, Investitionsvolumen, Zeitrahmen, Herkunft, verantwortliche Funktion, Status ∈ {Offen, In Bearbeitung, Abgeschlossen}). Die gelesenen Pläne von Sanofi-Aventis Deutschland (11/2025) und VON ARDENNE (07.04.2025) übernehmen die 7 Spalten wörtlich. Ein geschlossenes Statusvokabular macht den Kern deterministisch prüfbar, ganz ohne Modell.
3. **Wer jetzt archiviert, sichert den Jahrgang.** Links faulen, und die Pflicht ist jährlich zu aktualisieren, es entsteht also eine Zeitreihe („Wie viele ‚Offen‘ werden ‚Abgeschlossen‘?“).
4. **Die Dose trägt unter altem und neuem § 9.** Den Bundestagsbeschluss abzuwarten ist nicht nötig. Das Schema führt ein Feld `rechtsstand` (a. F. / n. F.).

## Skizze

- **Eingabe:** je Unternehmen und Planstand ein veröffentlichter Plan, von Hand aus dem PDF oder der Webseite in das 7-Felder-Schema übertragen. Dazu kommen Quell-URL, Abrufdatum und ein Archiv-Snapshot gegen Linkfäule. Für nicht gefundene Pläne werden Stand und Suchweg festgehalten (welche Seiten, welche Suchbegriffe, an welchem Tag).
- **Logik:** `pruefeUmsetzungsplan()` ist deterministisch und läuft ohne Netz und ohne Modell. Er prüft, ob alle 7 Pflichtangaben vorhanden sind, ob der Status im Vokabular liegt, ob der Zeitrahmen parsebar und das Investitionsvolumen numerisch ist. Er liefert Statusverteilung und Investitionssumme der offenen Maßnahmen. Jeder Befund trägt eine Regel-ID und ist **als Frage formuliert**.
- **Schema-Version:** Das Schema ist **gegen die jeweils gültige Merkblattfassung versioniert** (Feld `merkblattFassung`). Gelesen wurde die Fassung 02/2025 (Stand 12.02.2025, Kopie auf visalvis.de). Laut Suchschnipseln existieren neuere Fassungen von 10/2025 und 05/2026, die **nicht gelesen** sind. Bis die gültige Fassung auf bafa.de gelesen ist, trägt das Schema `vorläufig`.
- **Ausgabe:** eine statische CSV/JSON-Tabelle je Unternehmen × Planstand mit nur zwei Status: **„gefunden“** oder **„kein Plan gefunden (Stand: Datum, Suchweg)“**. Das Werkzeug sagt **nie „säumig“, „Verstoß“ oder „fehlt“**. Der Grund: Die Pflicht ist bedingt. Die Verbrauchsschwelle (2,77 bis < 23,6 GWh) ist von außen nicht bekannt, Unternehmen mit EnMS/UMS sind ausgenommen (§ 9 Abs. 6), Geschäftsgeheimnisse dürfen geschwärzt werden (Abs. 5), und die Frist läuft ab dem Audit, dessen Datum niemand außen sieht.
- **Aggregat statt Ranking:** Ausgabe nur als „N gefundene Pläne, davon M Maßnahmen offen, Investitionsvolumen der offenen Maßnahmen“ und als Einzelnachweis. **Kein Ranking und keine Sortierung nach Firma oder Volumen.** Die Tabelle wäre sonst eine Lead-Liste für Contractoren und Energiedienstleister.
- **Selektionshinweis im Kopf jeder Auswertung:** Veröffentlichen tun die Sorgfältigen. Die Umsetzungsquote der gefundenen Pläne ist eine Obergrenze-Tendenz der Disziplinierten und kein Branchenmaß.
- **Nenner:** Es gibt keine Liste der Verpflichteten. Die Drucksache schätzt rund **16.461 Verpflichtete nach der Novelle** (vorher ~24.855). Das ist eine Behördenschätzung und wird nur als solche zitiert, nie als Quote der gefundenen Pläne dagegen gerechnet.
- **Registerkern:** Zwei Status, Fundstelle, Abrufdatum und Archiv-Snapshot werden aus `src/engine/vernichtungs-offenlegungsregister/` übernommen, nicht neu erfunden.

**Nicht dabei:** keine Bewertung von Unternehmen, kein Ranking, kein Pranger, keine Quote gegen die Schätzung, keine Verpflichtetenliste. Keine Energiemengen: Die Pläne enthalten **weder MWh/a noch Kapitalwert**, eine Einsparsumme lässt sich nicht bilden. Kein Dauer-Crawler, kein Server, keine Datenbank (ein jährlicher Lauf beim Kurator genügt). Keine Rechtsberatung.

## Erster Schritt

**Ticket 01: Schema aus dem BAFA-Merkblatt, ein Prüfer, drei echte Pläne.** `umsetzungsplan-schema.json` wird aus den 7 Pflichtangaben und dem Statusvokabular gebaut, dazu ein deterministischer TypeScript-Prüfer `pruefeUmsetzungsplan(plan)`.

**Vorbedingung:** Die **aktuell gültige** Merkblattfassung auf bafa.de lesen und das Schema daraus ableiten. Ist sie nicht erreichbar, trägt das Schema `"status": "vorläufig"`, nennt die Fassung 02/2025 als Quelle und vermerkt die Fassungen 10/2025 und 05/2026 als ungelesen.

**Fertig, wenn:**
- eine Vitest-Suite mit mindestens 15 Fällen grün ist (vollständiger Plan, fehlende Pflichtangabe, Status außerhalb des Vokabulars, Zeitrahmen nicht parsebar, Investitionsvolumen nicht numerisch, Plan ohne Tabelle wie SWU mit Feldern `unbekannt`, Rechtsstand a. F. / n. F.);
- drei Fixtures von Hand übertragen sind (Muster GmbH aus dem Merkblatt, Sanofi-Aventis 11/2025, VON ARDENNE 04/2025), jeweils mit Quell-URL und Abrufdatum;
- ein Test sicherstellt, dass keine Ausgabe „säumig“, „Verstoß“ oder „violation“ enthält, dass fehlende Pläne nur als „kein Plan gefunden“ mit Datum und Suchweg erscheinen und dass keine Ausgabe nach Firma rangiert oder eine Quote gegen die 16.461-Schätzung bildet;
- jede Auswertung den Selektionshinweis im Kopf trägt;
- das Schema seinen Stand und die Merkblattfassung ausweist (`vorläufig` oder `gegen Merkblatt <Fassung> geprüft am …`);
- jeder Befund eine Regel-ID und eine Klartextfrage (De/En) trägt;
- alles im Scaffolding unter `07-demos/umsetzungsplan-register/` liegt (Regel 4).

## Wo es kippt

**Eine Quote aus gefundenen Plänen wird als Branchenquote gelesen.** Das Register sieht nur, wer veröffentlicht, also die Sorgfältigen. Die Pflicht ist bedingt, ein Nenner fehlt, und „kein Plan gefunden“ neben einem Firmennamen wirkt wie ein Vorwurf. Die Gegenmaßnahme liegt in der Architektur: nur die zwei neutralen Status, Ausgabe nur als „N gefundene Pläne, davon M Maßnahmen offen“, fester Selektionshinweis in jeder Auswertung, kein Ranking, keine Quote gegen die Schätzung.

**Zweitens: Lead-Listen-Lesart.** Offene wirtschaftliche Maßnahmen samt Investitionsvolumen je Firma sind auch eine Vertriebsliste für Contractoren. Die Daten sind Pflichtveröffentlichungen, das ist kein Grund zum Verwerfen. Neutrale Präsentation ohne Ranking und ohne Firmensortierung ist die Abhilfe.

**Drittens: Das Recht kann sich bewegen.** Der Bundesrat beantragt die Streichung der Veröffentlichungspflicht. Das Risiko ist gedeckelt: **EED Art. 11 Abs. 2 UAbs. 3** verlangt, dass Aktionspläne und Umsetzungsquote der Empfehlungen im Jahresbericht aufgeführt und öffentlich zugänglich gemacht werden. Eine Streichung wäre unionsrechtswidrig, könnte aber de facto weniger Pläne bedeuten. Zudem kann das Merkblatt driften (Formatdrift), deshalb die Versionierung, und BAFA oder BfEE können ein eigenes Register bauen. Der Prüfer bleibt auch dann für Unternehmen und BAFA-Stichproben (§ 18 n. F.) nützlich.

**Offen gelegt:**
- **Gelesen wurde das Merkblatt 02/2025.** Die Fassungen 10/2025 und 05/2026 sind nur aus Schnipseln bekannt.
- **Der Nenner ist eine Behördenschätzung**, keine Liste.
- **Die Ansprechpersonen sind unverifiziert** (Noll nur als Autor einer Erklärseite, Burtscher Stand 2024).
- **Heterogene Ausreißer:** SWU liefert ein zweiseitiges Erklärdokument ohne Standardtabelle.

## Wer es schon versucht hat

**Recherche 28.09.2026 (Offenlegungs-Runde, Dreifachfund aller drei Engines, 6 Gegen-Suchen des Reviewers in DE und EN, Normtexte und drei Pläne im Volltext gelesen).**

- **Kein Aggregator der veröffentlichten Pläne gefunden.** Gesucht wurde bei DENEFF, Fraunhofer ISI, Umweltinstitut, BfEE und nach EED-Art.-11-Trackern. Gefunden wurden nur Berater-Erklärtexte, die Fraunhofer-ISI-Kurzexpertise für DENEFF, die Modellrechnung des Umweltinstituts (kritisiert, sammelt nicht) und zwei Springer-Papers 2025 zu **nicht-öffentlichen** Auditdaten der Energieagenturen.
- **Die Norm nennt keinen Sammler.** Art. 11 Abs. 3 EED sieht nur eine Behördenplattform für Verbrauchsdaten vor, nicht für die Pläne. Das Wort „Unternehmensregister“ kommt in BT-Drs. 21/8027 nur als Statistikquelle vor. Schnipsel, die eine Veröffentlichung im Unternehmensregister behaupten (energieundrecht.com, twobirds, Grant Thornton/DQS), sind durch den Primärtext widerlegt und beschreiben vermutlich den Referentenentwurf.
- **Prämisse belegt:** Mindestens 10 Pläne per Exakttitel-Suche (Schnipsel); Sanofi-Aventis und VON ARDENNE im Volltext gelesen.
- **Nachbar im Bestand:** `vernichtungs-offenlegungsregister` (gleiches Muster, anderes Regime, anderer Empfänger). Diese Dose ist kein Baustein davon, übernimmt aber dessen Registerkern.

**Restlücke:** Ein offenes, datiertes Register der veröffentlichten § 9-Umsetzungspläne mit deterministischem Prüfer gegen die 7 Pflichtangaben, neutralem Status und Selektionshinweis.

## Vorarbeit

- BT-Drs. 21/8027 vom 16.09.2026 (Regierungsentwurf EnEfG-Novelle, PDF, 118 S., dserver.bundestag.de), § 9 n. F., § 18, § 19 Abs. 1 Nr. 2, Stellungnahme des Bundesrats Nr. 25 und Gegenäußerung
- Richtlinie (EU) 2023/1791 (EED), Art. 11 Abs. 2 UAbs. 3 und Abs. 3: https://eur-lex.europa.eu/eli/dir/2023/1791/oj (gelesen über publications.europa.eu, CELEX 32023L1791)
- BAFA-Merkblatt zum EnEfG (7 Pflichtangaben, Musterbeispiel), **gelesen Stand 12.02.2025** (Kopie auf visalvis.de); **aktuelle Fassung auf bafa.de vor Ticket 01 lesen**
- Umsetzungspläne als Fixtures: Sanofi-Aventis Deutschland (11/2025), VON ARDENNE (07.04.2025), Muster GmbH aus dem Merkblatt (vollständige URLs vor Nutzung ermitteln)
- DENEFF-Erklärseite zur Novelle vom 07.07.2026 (deneff.org), Umweltinstitut München EnEfG-Meldung vom 17.07.2024
- DIN EN 17463 (Wirtschaftlichkeitsdefinition)
- Herkunft: Dreifachfund der Offenlegungs-Runde (Ideenrunde, Bisoziation, Inversion). Atlas-Muster: „Offenlegungspflicht ohne Register → Register frei“, hier mit der Zusatzfrage „deckelt eine höhere Norm die Pflicht?“.
- Die Dose online: https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

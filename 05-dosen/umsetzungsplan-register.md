---
status: Available
delivery_method: E-Mail
target_maker: DENEFF e.V.
review_score: 25/35
architecture_tier: Tier 1
source_type: Type A
---
# Umsetzungsplan-Register

*(englisch: Implementation Plan Register)*

**Ein Satz:** Ein offenes Register der Umsetzungspläne, die Unternehmen nach § 9 EnEfG (und EED Art. 11 Abs. 2) für ihre wirtschaftlichen Energiesparmaßnahmen veröffentlichen müssen. Sein Kern ist ein deterministischer Prüfer gegen die Pflichtangaben des BAFA-Merkblatts (Fassung 16.09.2026: fünf), der je Plan die Statusverteilung und das Investitionsvolumen der offenen Maßnahmen ausgibt und nie „säumig“ sagt, sondern nur „gefunden“ oder „kein Plan gefunden (Stand, Suchweg)“.

**Stand:** 28.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** **DENEFF e.V. (Deutsche Unternehmensinitiative Energieeffizienz), Christian Noll, geschäftsführender Vorstand.** Die DENEFF arbeitet zur Effizienzpolitik und stellt sich im laufenden Verfahren gegen die Aufweichung der EnEfG-Novelle. Bisher argumentiert sie mit Modellrechnungen und Befragungen, nicht mit den veröffentlichten Plänen. Name und Funktion stehen als Autor auf der Novellen-Erklärseite von deneff.org vom 07.07.2026 [Seite]. **Vor Versand erneut verifizieren** (Name, Funktion, Adresse auf deneff.org). · nachrangig: Umweltinstitut München e.V., Dr. Leonard Burtscher (Autor der EnEfG-Meldung vom 17.07.2024, heutige Funktion **nicht verifiziert**, vor Versand prüfen).
**Verdikt:** 🔨 erst Skelett, dann verschenken. Der Empfänger hat ein politisches Mandat, aber keinen Softwarearm. Das Geschenk ist erst brauchbar, wenn Schema, Prüfer und drei echte Pläne als Fixtures im Scaffolding liegen.
**Review:** 25/35 · Tier 1 (Kern) / Tier 2 (Register) · Type A, Normtexte und drei Plan-PDFs selbst gelesen (Details: `06-suche/amelie-classification-log.md`, Offenlegungs-Runde 28.09.2026)
**Status:** gepackt, nicht zugestellt. Keine Mail angelegt.

---

## Das Problem

Unternehmen oberhalb einer Verbrauchsschwelle müssen nach ihrem Energieaudit einen Umsetzungsplan für alle als wirtschaftlich erkannten Endenergieeinsparmaßnahmen erstellen und **veröffentlichen** (§ 9 EnEfG). Umsetzen müssen sie die Maßnahmen nicht. Die Pläne erscheinen verstreut als PDF auf Firmenseiten oder im Unternehmensbericht. Es gibt kein Register, keine Liste der Verpflichteten und niemanden, der sie zählt. Die Exakttitel-Suche findet mindestens zehn Pläne [Schnipsel]; einer (Diakonie Stetten) liefert nach gut einem Jahr schon 404. Der Lückensatz lautet: **Tausende Firmen müssen öffentlich sagen, welche wirtschaftlichen Sparmaßnahmen noch offen sind, aber niemand zählt, wie viele liegen bleiben.**

**Wer leidet:** Verbände wie DENEFF und Umweltinstitut, die im Bundestagsverfahren zur EnEfG-Novelle (1. Lesung 24.09.2026) gegen die Abschwächung argumentieren und dafür nur Modellrechnungen haben (Fraunhofer-ISI-Kurzexpertise; Umweltinstitut ~54 TWh Mindereinsparung [Schnipsel]). Die Pflichtangaben, die den Streit mit Daten füllen könnten, liegen öffentlich, aber nirgends nebeneinander.

## Warum das jetzt geht

1. **Die Novelle wird gerade verhandelt, und die Veröffentlichung steht zur Disposition.** Regierungsentwurf **BT-Drs. 21/8027 vom 16.09.2026** [Seite]: § 9 n. F. gilt für 2,77 bis < 23,6 GWh/a, Veröffentlichung binnen drei Monaten nach dem Audit, jährliche Aktualisierung (Abs. 4), Pläne und Umsetzungsquote „sollen“ in den Jahresbericht; Ausnahme für Geschäftsgeheimnisse (Abs. 5) und für Unternehmen mit EnMS/UMS (Abs. 6); BAFA-Stichproben auch zur Veröffentlichung (§ 18), Bußgeld bei Nicht-Veröffentlichung (§ 19 Abs. 1 Nr. 2). **Kein Unternehmensregister**, der Fundort bleibt Firmenwebsite oder Jahresbericht. Anderslautende Kanzlei- und Beraterschnipsel sind durch den Primärtext widerlegt (vermutlich Referentenentwurf).
2. **Das Format existiert faktisch.** Das BAFA-Merkblatt EnEfG in der aktuellen Fassung vom 16.09.2026 [Seite] schreibt **fünf** Pflichtangaben mit Musterbeispiel vor: Priorität, Maßnahmenbezeichnung, Investitionsvolumen (auch als Bandbreite), Zeitrahmen, Status. Das Vokabular {Offen, In Bearbeitung, Abgeschlossen} ist nur eine Kann-Regel. Die Fassung vom 12.02.2025 nannte noch sieben Angaben (zusätzlich Herkunft, verantwortliche Funktion); sie entfielen mit der 7. Änderung vom 30.04.2026. Sanofi-Aventis Deutschland (11/2025) übernimmt Spalten und Statuswörter; VON ARDENNE (07.04.2025) übernimmt die Spalten, schreibt aber „geplant“/„laufend“/„abgeschlossen“ [Seite]. Der Prüfer zählt fremde Statuswörter deshalb nie still um, sondern stellt eine Rückfrage.
3. **Die Pflicht ist unionsrechtlich gedeckelt.** **EED (EU) 2023/1791 Art. 11 Abs. 2 UAbs. 3** [Seite]: Die Mitgliedstaaten stellen sicher, dass Aktionspläne und Umsetzungsquote im Jahresbericht aufgeführt und öffentlich zugänglich gemacht werden. Mit der jährlichen Aktualisierung entsteht eine Zeitreihe: Wie viele „Offen“ werden „Abgeschlossen“?
4. **Die Pläne verschwinden.** Wer den Jahrgang jetzt mit Archiv-Snapshot sichert, hat ihn noch; heterogene Ausreißer (z. B. SWU, zweiseitiges Erklärdokument ohne Standardtabelle) lassen sich per LLM-Vorschlag mit menschlicher Bestätigung ins Schema bringen. Die LLM-Stufe ist Hilfsmittel des Kurators, nicht das Herz der Dose.

## Skizze

- **Eingabe:** je Unternehmen und Planstand ein Plan, von Hand oder als bestätigter LLM-Vorschlag in `umsetzungsplan-schema.json` übertragen, mit Quell-URL, Abrufdatum, Archiv-Snapshot und dem Feld **`rechtsstand`** (`a. F.` = § 9 EnEfG in der Fassung vor der Novelle, `n. F.` = nach der Novelle). Für fehlende Pläne werden Stand und Suchweg festgehalten.
- **Logik:** `pruefeUmsetzungsplan()` ist deterministisch und läuft ohne Netz und ohne Modell. Er prüft, ob die Pflichtangaben der gewählten Merkblattfassung vorhanden sind, ob jeder Status aus dem Vokabular stammt (sonst Rückfrage), ob der Zeitrahmen parsebar und das Investitionsvolumen numerisch ist. Er gibt **Statusverteilung** (Offen / In Bearbeitung / Abgeschlossen) und **Investitionssumme der offenen Maßnahmen** aus. Das ist die Kernzahl: Jede Maßnahme im Plan ist per Definition wirtschaftlich (§ 9 Abs. 2), „Offen“ heißt also „wirtschaftlich, aber noch nicht umgesetzt“. Befunde tragen eine Regel-ID und sind als Frage formuliert.
- **Registerkern wiederverwendet:** Status, Fundstelle, Abrufdatum, Suchnachweis, Archiv-Snapshot, CSV-Export und Sprachwächter werden aus `src/engine/vernichtungs-offenlegungsregister/` übernommen (`erstelleRegister`, `registerAlsCsv`, `assertNeutraleSprache`), nicht neu erfunden.
- **Ausgabe:** eine statische CSV/JSON-Tabelle je Unternehmen × Planstand mit nur zwei Status: **„gefunden“** oder **„kein Plan gefunden (Stand: Datum, Suchweg)“**. Die Ausgabe sagt **nie „säumig“, „Verstoß“ oder „fehlt“**. Die Pflicht ist bedingt: Die Verbrauchsschwelle ist nicht öffentlich, Unternehmen mit EnMS/UMS sind ausgenommen, Geschäftsgeheimnisse dürfen geschwärzt werden, und die Frist läuft ab einem Audit, dessen Datum niemand kennt.
- **Kein Nenner, keine Quote:** Es gibt keine Liste der Verpflichteten. Die Drucksache schätzt **rund 16.461** Verpflichtete nach der Novelle (vorher ~24.855) [Seite]. Das ist eine Behördenschätzung, keine Liste. Das Register gibt **nie eine Quote gegen diese Schätzung** aus, sondern nur „N gefundene Pläne, davon M Maßnahmen offen, Investitionsvolumen offen X €“.
- **Selektionshinweis, fest im Kopf jeder Auswertung:** „Veröffentlicht haben die, die veröffentlichen. Die Umsetzungsquote der gefundenen Pläne beschreibt diese Pläne, nicht die Branche und nicht alle Verpflichteten.“
- **Schema-Stand:** Das Schema ist nach Merkblattfassung versioniert. Standard ist die **Fassung 16.09.2026** (fünf Angaben, `gegen Merkblatt 16.09.2026 geprüft am 2026-09-28`); die Fassung 12.02.2025 (sieben Angaben) bleibt `vorläufig`, weil sie nur über das Review bekannt ist.

**Nicht dabei:** **keine Energiemengen (MWh/a) und kein Kapitalwert** — die gelesenen Pläne enthalten beides nicht, eine Einsparsumme lässt sich daraus nicht bilden. Kein Firmenranking, keine Rangliste, kein Pranger; nur Aggregat und Einzelnachweis mit Quelle. Keine Quote der Verpflichteten. Kein Dauer-Crawler, kein Server, keine Datenbank (ein jährlicher Kuratorlauf genügt). Keine Rechts- oder Energieberatung.

## Erster Schritt

**Ticket 01: Pflichtangaben als Schema, ein Prüfer, drei echte Pläne.** `umsetzungsplan-schema.json` aus den BAFA-Pflichtangaben je Merkblattfassung (16.09.2026: fünf; 12.02.2025: sieben) und dem Statusvokabular {Offen, In Bearbeitung, Abgeschlossen}, dazu das Feld `rechtsstand` (`a. F.` / `n. F.`) und ein deterministischer TypeScript-Prüfer `pruefeUmsetzungsplan(plan)`.

**Vorbedingung (erfüllt 28.09.2026):** Die aktuelle Fassung des BAFA-Merkblatts EnEfG (16.09.2026) ist gelesen; das Scaffolding in `07-demos/umsetzungsplan-register/` folgt ihr. Bei jeder neuen Fassung eine neue Schema-Version anlegen.

**Fertig, wenn:**
- eine Vitest-Suite grün ist, die mindestens abdeckt: vollständiger Plan (0 Befunde), fehlende Pflichtangabe, Status außerhalb des Vokabulars, unparsebarer Zeitrahmen, nicht-numerisches Investitionsvolumen, Statusverteilung und Investitionssumme „Offen“ korrekt, Freitext-Plan ohne Tabelle (läuft durch, Felder `unbekannt`);
- drei Fixtures von Hand übertragen sind, jeweils mit Quell-URL und Abrufdatum: **Muster GmbH** (Musterbeispiel aus dem Merkblatt), **Sanofi-Aventis Deutschland 11/2025**, **VON ARDENNE 04/2025**;
- ein Test sicherstellt, dass keine Ausgabe „säumig“, „Verstoß“ oder „violation“ enthält, dass fehlende Pläne nur als „kein Plan gefunden“ mit Datum und Suchweg erscheinen und dass keine Ausgabe eine Quote gegen die Verpflichtetenzahl bildet;
- jede Auswertung den Selektionshinweis trägt und keine Rangfolge nach Firmen ausgibt;
- der Registerkern aus `src/engine/vernichtungs-offenlegungsregister/` importiert statt kopiert wird;
- das Schema seinen Stand ausweist (`vorläufig` oder `gegen Merkblatt <Fassung> geprüft am …`);
- alles im Scaffolding unter `07-demos/umsetzungsplan-register/` liegt (Regel 4).

## Wo es kippt

**Eine Quote aus gefundenen Plänen wird als Branchenquote gelesen.** Veröffentlichen tun die Sorgfältigen; wer keinen Plan zeigt, ist vielleicht ausgenommen, vielleicht unter der Schwelle, vielleicht nachlässig — das Register kann es nicht unterscheiden. Die Gegenmaßnahme liegt in der Architektur: Ausgabe nur „N gefundene Pläne, davon M Maßnahmen offen“, Selektionshinweis fest im Kopf jeder Auswertung, nie „säumig“, keine Quote gegen die 16.461-Schätzung.

**Zweitens: Pranger- und Lead-Listen-Lesart.** Eine Tabelle „offene wirtschaftliche Maßnahmen + Investitionsvolumen je Firma“ ist auch eine Vertriebsliste für Contractoren und Energiedienstleister. Die Daten sind Pflichtveröffentlichungen, das ist kein Grund zum Verzicht, aber ein Grund für neutrale Präsentation: kein Firmenranking, nur Aggregat und Einzelnachweis mit Quelle.

**Drittens: Die Veröffentlichungspflicht wird gestrichen.** Der **Bundesrat beantragt in seiner Stellungnahme (Nr. 25) die Streichung der Veröffentlichungspflicht** als Bürokratieabbau; die Bundesregierung hält in der Gegenäußerung an Veröffentlichung und Drei-Monats-Frist fest [Seite]. Eine Streichung wäre wegen **EED Art. 11 Abs. 2** unionsrechtswidrig, würde aber de facto weniger Pläne bedeuten. Die Dose trägt unter altem und neuem § 9; dafür gibt es das Feld `rechtsstand`.

**Offen gelegt:**
- **Schema an die Merkblattfassung gebunden** (aktuell 16.09.2026, fünf Angaben); ältere Fassung 12.02.2025 bleibt `vorläufig`.
- **Formatdrift:** Mit Wegfall der Drittbestätigung und neuem Merkblatt kann sich das Muster ändern; das Schema läuft versioniert.
- **Keine Energiemengen:** Die Kernzahl ist Statusverteilung + Investitionsvolumen, keine Einsparung in MWh.
- **Empfängerperson** vor Versand erneut verifizieren; Umweltinstitut-Kontakt nicht verifiziert.

## Wer es schon versucht hat

**Recherche 28.09.2026 (Offenlegungs-Runde; Dreifachfund aller drei Engines, 6 Gegen-Suchen des Reviewers in DE und EN, Normtexte und Pläne selbst gelesen).** Details: `06-suche/amelie-classification-log.md`, Abschnitt Offenlegungs-Runde.

- **Kein Aggregator der veröffentlichten Pläne gefunden** — weder bei DENEFF, Fraunhofer ISI, Umweltinstitut, BfEE noch als EED-Art.-11-Tracker.
- **Nur Berater-Erklärtexte** (Luther, IHK Hannover [Seite]; Grant Thornton, DQS, twobirds, energieundrecht.com [Schnipsel], teils mit überholter Referentenentwurfs-Lesart).
- **Fraunhofer-ISI-Kurzexpertise für DENEFF** und **Umweltinstitut-Modellrechnung (~54 TWh Mindereinsparung)** arbeiten mit Modellen und Befragungen, nicht mit Plandaten [Schnipsel]. Die Umweltinstitut-Seite kritisiert die Novelle, sammelt aber nicht [Seite].
- **Zwei Springer-Papers 2025** werten **nicht-öffentliche** Auditdaten von Energieagenturen aus [Schnipsel], nicht die veröffentlichten Pläne.
- **Die Norm nennt keinen Sammler.** EED Art. 11 Abs. 3 sieht nur eine Behördenplattform für Verbrauchsdaten vor, nicht für die Pläne [Seite]. BAFA prüft stichprobenhaft, veröffentlicht aber kein Register.

**Restlücke:** Ein offenes, datiertes Register der § 9-Umsetzungspläne mit einem deterministischen Prüfer gegen die BAFA-Pflichtangaben, das Statusverteilung und offenes Investitionsvolumen ausweist und fehlende Pläne neutral als „kein Plan gefunden (Stand, Suchweg)“ führt.

## Vorarbeit

- § 9 EnEfG (geltende Fassung) [Seite]: https://www.gesetze-im-internet.de/enefg/__9.html
- Regierungsentwurf EnEfG-Novelle, **BT-Drs. 21/8027** vom 16.09.2026, inkl. Stellungnahme des Bundesrats (Nr. 25, Streichungsantrag) und Gegenäußerung [Seite]: dserver.bundestag.de/btd/21/080/2108027.pdf
- Richtlinie (EU) 2023/1791 (EED), Art. 11 Abs. 2 UAbs. 3 und Abs. 3 [Seite]: https://publications.europa.eu/resource/celex/32023L1791
- BAFA-Merkblatt EnEfG, Stand 16.09.2026 (bafa.de, Abschnitt 5) [Seite, demo-builder 28.09.2026]; Fassung 12.02.2025 (Kopie auf visalvis.de) nur über das Review.
- Sanofi-Aventis Deutschland, Umsetzungsplan nach § 9 EnEfG (11/2025) [Seite]: https://www.sanofi.de/assets/dot-de/pages/docs/verantwortung/planet-care/Umsetzungsplan-EnEfg.pdf
- VON ARDENNE, Umsetzungsplan nach § 9 EnEfG (07.04.2025) [Seite]; SWU (Erklärdokument ohne Standardtabelle) [Seite]; Diakonie Stetten (404) [Schnipsel]
- DENEFF, „Energieeffizienzgesetz: EnEfG-Novelle 2026 erklärt“ (07.07.2026) [Seite]: https://deneff.org/energieeffizienzgesetz-enefg-novelle-2026-erklaert/
- Umweltinstitut München, Meldung zur EnEfG-Novelle [Seite]: https://umweltinstitut.org/energie-und-klima/meldungen/enefg-novelle/
- Registerkern (Status, Suchnachweis, Snapshot, CSV, Sprachwächter): `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.ts`, Schwester-Dose https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister
- Herkunft: Dreifachfund der Offenlegungs-Runde. Ideenrunde (S1 „Umsetzungsplan-Register“), Bisoziation und Inversion (OP-4, „Umsetzungsplan-Register“). Atlas-Muster: „Offenlegungspflicht ohne Register → Register frei“, ergänzt um „deckelt eine höhere Norm die Pflicht?“.
- Die Dose online: https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

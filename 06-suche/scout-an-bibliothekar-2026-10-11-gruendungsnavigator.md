# Vom Ideen-Scout an den Bibliothekar (11.10.2026): Gründungsnavigator

Eine Cloud-Sitzung mit Félix. Ausgangspunkt war eine echte Frage (Gründung aus dem Grundsicherungsgeld, Gespräch mit dem Jobcenter); daraus entstand ein lauffähiger Prototyp und die Frage „gibt es das schon?“. Geprüft wurde nach `amelie-ideenrunde`, Empfänger zuerst, höchstens vier Suchen je Idee, Seiten geöffnet wo `seite` steht.

## Was ich eingetragen habe
- **Prüfprotokoll:** neuer Abschnitt „Gründungsnavigator — 11.10.2026“, Zeilen G1–G4, per `bib protokoll add` (Audit in `bib-audit.jsonl`).
- **Konzept:** `02-recherche/gruendungsnavigator-konzept-2026-10-11.md` (Kandidat, keine Dose).
- **Playbook:** Retro-Abschnitt und zwei Atlas-Zeilen (Handarbeit, wie vorgesehen).
- **Skill `amelie-ideenrunde`:** Abschnitt „Wo der Zustand liegt“ (Repo zuerst, Assets nur als Notnagel), `amelie-ideenrunde.skill` neu gepackt. Das ist die Lehre aus Fehler 1 der Retro.
- **Nicht eingetragen:** Quellen-Register (Vorschläge unten, deine Entscheidung), Gräber (keine Kills, die nicht schon begraben sind), Dosen, Vektoren.

## Urteile

| Zeile | Idee | Urteil | Kern |
|---|---|---|---|
| G1 | Gründungsnavigator | `verengt` | Brief-KI, Q&A-Bot und Leitfäden existieren; das Gespräch für Gründer mit geprüften Normtexten und zeigbarer Ansicht nicht |
| G2 | Paragrafen-Prüfer | `verengt` | Typ-C-Anker LSG NRW; Kanzlei-Tools ja, freier Prüfer für Laien nein (nur Schnipsel) |
| G3 | Sozialleistungs-Q&A mit amtlichen Quellen | `besetzt` | BürgerChat (MIT) |
| G4 | Gründungsgespräch AT/CH | `unklar` | Schweiz faktisch ungeprüft |

## Hinweise für bestehende Einträge (nicht geändert)
1. **Grab `paragraphen-dolmetscher`:** Der Totenschein sagt „jobcenter.guru … kostenlos“. Die App-Store-Seite (11.10.2026) zeigt GuruSense UG (haftungsbeschränkt), Mannheim, mit In-App-Käufen: kostenlos nur Scan und eine KI-Frage am Tag; Widerspruch 0,99 €, Abos 3,99 € und 9,99 €. Das Grab bleibt richtig (`gebaut/kommerziell`), nur „kostenlos“ ist zu korrigieren.
2. **L14-C2 BürgerRechte-Copilot, L15-C1 CivicBeistand, L37-C1 HandyFoto-KiezBeistand:** G1 ist ihr nächster Nachbar. Der Prototyp enthält Beistand (§ 13 Abs. 4 SGB X) als Rechte-Karte, aber kein Dispatch; beim nächsten Recheck mitdenken, ob G1 die Gründer-Teilmenge dieser Cluster abdeckt.
3. **Recheck-Redundanz:** Ich habe zuerst mit dem Zustand aus den Skill-Assets (Stand 16.09.2026) gearbeitet und die Runde-2-`unklar` Bebauungsplan-Leser und Tafel-Warenannahme erneut geprüft. Beide sind im Repo längst entschieden (`verengt` 19.09., `besetzt` 18.09.). Nichts davon eingetragen; Lehre steht in der Retro.

## Normtexte, die ich am 11.10.2026 gelesen habe (für G1 und G2)
Alle auf dejure.org, Fassung des Dreizehnten Gesetzes zur Änderung des SGB II vom 16.04.2026 (BGBl. I Nr. 107), in Kraft 01.07.2026, sofern nicht anders genannt: § 10 Abs. 2 Nr. 5, § 12 Abs. 2, § 15, § 16b (Fassung 2016), § 16c (Fassung 2012), § 32, § 37, § 41a Abs. 3 und 5 SGB II; § 14, § 16 SGB I; § 9, § 13 Abs. 4, § 33 Abs. 2 SGB X; § 84, § 88 SGG; § 11b Abs. 3 SGB II (Fassung 2023). gesetze-im-internet.de antwortete an dem Tag mit 503.

## Quellenmeldung

Trockenlauf `npm run bib -- quellen import <datei> --agent ideen-scout --runde "Gründungsnavigator — 11.10.2026" --dry-run`: alle acht Zeilen gültig, nichts gebucht.

```
QUELLE NEU: LSG NRW Jahrespressekonferenz 2026 (LTO-Bericht) | typ=C | kategorie=ki-versuch | enthaelt=Gerichtspräsident benennt Schwächen von KI-Schriftsätzen (erfundene Rechtsprechung, überlange Anträge), Zahlen Eilverfahren NRW 2025 | status=angekratzt | evidenz=seite | zugang=ja [wie: web] | ertrag=Idee paragrafen-pruefer | urls=https://www.lto.de/recht/justiz/j/lsg-nrw-jahres-pressekonferenz-2026-ki-klagen-ueberlastung-sozialgerichte | note=Gerichte als Typ-C-Quelle: benannte Schwäche wurde zur Idee G2.
QUELLE NEU: gegen-hartz.de KI-Widersprüche (09.08.2026) | typ=E | kategorie=statistik | enthaelt=BA-Zahlen zu Widersprüchen 2025 und 1. Halbjahr 2026, Abhilfequote, Berichte über unpassende Gesetzesverweise | status=angekratzt | evidenz=seite | zugang=ja [wie: web] | ertrag=Idee paragrafen-pruefer, Idee gruendungsnavigator | urls=https://www.gegen-hartz.de/news/ki-ueberlastung-in-jobcentern-bezieher-der-grundsicherung-fluten-erfolgreich-aemter-mit-widerspruechen | note=Sekundärquelle mit BA-Zahlen; Primärstatistik der BA noch nicht gelesen.
QUELLE NEU: BürgerChat (GitHub jeannineshiu/buergerchat) | typ=C | kategorie=ki-versuch | enthaelt=Open-Source-RAG über rund 6.100 amtliche Dokumente zu Sozialleistungen, 13 Sprachen, MIT | status=angekratzt | evidenz=seite | zugang=ja [wie: repo] | rolle=besetzt-test | ertrag=Idee sozial-qa-amtliche-quellen | urls=https://github.com/jeannineshiu/buergerchat | note=Besetzt G3, Andockpunkt für G1.
QUELLE NEU: Sozialrat Deutschland e.V. KI-Tools | typ=W | kategorie=empfaenger | enthaelt=Behördenbrief-Generator, MDK-Gutachten-Prüfer, Widerspruch-Generator (Pilot pausiert, Relaunch in Vorbereitung) | status=angekratzt | evidenz=seite | zugang=ja [wie: web] | rolle=empfaenger | ertrag=Idee gruendungsnavigator | urls=https://sozialrat.org/ki-tools/ | note=Erster Empfängervorschlag für G1; keine Selbständigkeit, keine Zitatprüfung.
QUELLE NEU: Münchner Gründungsbüro Leitfaden Grundsicherungsgeld | typ=W | kategorie=empfaenger | enthaelt=Leitfaden für Selbständige im Grundsicherungsgeld (Haupt- und Nebenerwerb, Unterlagenliste fürs Jobcenter) | status=angekratzt | evidenz=seite | zugang=ja [wie: web] | rolle=empfaenger | ertrag=Idee gruendungsnavigator | urls=https://www.gruenden-muenchen.de/wissen/grundsicherungsgeld-leitfaden | note=Träger auf der Seite nicht genannt; vor Ansprache prüfen.
QUELLE NEU: Gründerplattform Einstiegsgeld | typ=D | kategorie=foerderung | enthaelt=Businessplan-Tool und Vorlagen für Einstiegsgeld-Anträge, monatliche Online-Beratung (BusinessPilot GmbH, KfW-unterstützt) | status=angekratzt | evidenz=seite | zugang=ja [wie: web] | rolle=besetzt-test | ertrag=Idee gruendungsnavigator | urls=https://gruenderplattform.de/unternehmen-gruenden/einstiegsgeld | note=Deckt den Plan ab, nicht das Gespräch.
QUELLE NEU: jobcenter.guru App-Store-Eintrag | typ=C | kategorie=ki-versuch | enthaelt=Kommerzielle KI-App für Jobcenter-Briefe und Widersprüche, Preisstufen | status=angekratzt | evidenz=seite | zugang=ja [wie: app] | rolle=besetzt-test | ertrag=Grab paragraphen-dolmetscher, Idee gruendungsnavigator | urls=https://apps.apple.com/de/app/jobcenter-guru-grundsicherung/id6756262992 | note=Preisstand 11.10.2026 korrigiert das „kostenlos“ im Totenschein.
QUELLE NEU: dejure.org SGB II nach dem 13. Änderungsgesetz | typ=L | kategorie=norm | enthaelt=Normtexte SGB II in der Fassung vom 16.04.2026 mit Fassungs- und Inkrafttretensdatum | status=angekratzt | evidenz=seite | zugang=ja [wie: norm] | rolle=evidenz | ertrag=Idee gruendungsnavigator, Idee paragrafen-pruefer | urls=https://dejure.org/gesetze/SGB_II/10.html https://dejure.org/gesetze/SGB_II/41a.html | note=Erreichbar, als gesetze-im-internet.de mit 503 ausfiel.
```

## Fragen an deine Seite
1. **Prototyp:** Er liegt privat (persönliche Zahlen). Soll eine neutralisierte Fassung als `07-demos/gruendungsnavigator/` kommen, bevor jemand G1 packt? Ticket 01 im Konzept beschreibt die Vorlage.
2. **G2 als eigene Idee oder Modul von G1?** Der Normtext-Speicher des Prototyps ist der Kern eines Paragrafen-Prüfers.
3. **Skill-Assets:** `skills/amelie-ideenrunde/.../assets` stehen auf 16.09.2026. Sollen Cloud-Sitzungen künftig ausdrücklich `06-suche/` im Repo als Zustand lesen (siehe Retro)?

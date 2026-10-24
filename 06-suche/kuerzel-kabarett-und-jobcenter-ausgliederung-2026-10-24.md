# Amélie proposal — Kürzel-Kabarett + Jobcenter-Hilfe in den Friedhof

**24.10.2026 · Nutzeridee und expliziter Arbeitsauftrag · öffentliche Amélie (nicht Amelie-lab)**

## 1. Neue Idee: Kürzel-Kabarett

Ein kleines offlinefähiges, privacy-first Wortspiel im Games-Bereich: echte deutsche Behördenkürzel werden in absurde Sätze und teilbare Poster umgeschrieben. Die **Initialen müssen exakt** den Buchstaben der jeweiligen Kürzel entsprechen, auch nach Umordnung der Blöcke. Kein LLM, keine Konten, keine Fall- oder Sozialdaten.

**Die festgehaltenen Lieblingssprüche (Wortlaut respektieren):**

- WBA → **Wieder Briefe, Alter!**
- EK → **Endlose Kürzel**
- EKS → **echt kein Spaß**
- BB → **Bonus? Blabla!**
- II BB → **Immer irgendwelche Bescheide basteln**
- SGB II BB EK EKS → **Scheiße, Geld Brauchen! Ich Ignoriere Behördenbriefe, Bis Ein Kleiner Elf Kohle Schickt.**

Beim langen Satz ist die Initialfolge **SGBIIBBEKEKS** (3/2/2/2/3). Poster-Layouts müssen **die initialen Großbuchstaben sehr deutlich hervorheben**; der ganze Witz lebt davon. Beim Umstellen der Blöcke muss die Zuordnung dynamisch mitwandern.

**MVP:** kuratiertes Kürzellexikon (offizielle Bedeutung und Satire streng getrennt), editierbare Wortgruppen, Block-Reihenfolge ändern (Drag-and-drop plus Tastatur), Live-Initialvalidierung, Copy-Text, SVG/PNG-Posterexport. Optional regionaler Stil: Berlin, Ruhrgebiet, Bayern; später eigene englische und spanische Akronymwitze statt mechanischer Übersetzung. Kreative Vielfalt ja, stereotype Dialektimitationen nein.

**Guardrails:** deutlich als Satire markieren; insbesondere das Ignorieren von Behördenbriefen ist keine Empfehlung. Offizielle Kürzelbedeutungen nur mit verifizierten Quellen. Keine Behauptung juristischer Wirkung oder aktueller Sachbearbeitung. Unabhängige Idee; kein Quellcode oder Geschäftsmodell des privaten Jobcenter-Hilfe-Projekts wird damit veröffentlicht.

**Akzeptanzkriterien für ein späteres Ticket:** Initialenprüfung gegen Unicode-Wörter und Interpunktion; Tests für Umlaut/ß, vertauschte Gruppen, ungültige Wortanfänge; grafisch hervorgehobene Initialen; keine Netzabhängigkeit; Poster für mobile Ansicht und Druck; a11y-Tastaturbedienung.

**Amélie-Status:** nur Kandidat / **ungeprüft**, kein gepacktes Geschenk, kein erfundener Empfänger, keine unbelegte Neuheitsbehauptung. Zuerst Bibliothekar-Dublettenprüfung, unabhängiger Reviewer, dann ggf. Mini-Demo.

---

### Datenbasis — größeres Wörterbuch (24.10.2026)

Die PR enthält jetzt **[das maschinenlesbare Kürzel-Wörterbuch](./kuerzel-kabarett-woerterbuch.json)** mit **65 Kürzel-/Buchstabengruppen**, **178 satirischen Erweiterungen** und **20 vollständigen Kompositionen** aus unserer Unterhaltung (DE, Berlinerisch/Ruhr/Bairisch, EN, ES; auch umgestellte Gruppen).

- **Amtlich belegte Formulare:** HA, AH, WBA, VÄM, EK, EKS, VM, WEP, KI, KDU, BB, SV, VE, HG, MEB, UF, SE und UH1–UH3.
- **Amtlich belegte Fachkürzel:** unter anderem AA, BG, BGB, BMAS, BSG, BuT, DRV, JC, KdU, KV, LSG, pAp, SG, VA, WDB, ZPO sowie SGB/SGG. Die Quellen-URLs liegen in der JSON-Datei; jede amtliche Bedeutung besitzt einen sourceKey.
- **Spielblöcke:** II (als römischer Zahlblock aus SGB II), AMT, WTF, PDF, OMG, UFF, KAFKA, ELF und BRIEF; Spielblöcke werden **nicht** als Jobcenter-Formulare ausgegeben.
- **Historische Kürzel** (etwa EAO/EinV) sind ausdrücklich so markiert und dürfen nicht als aktueller Vordruck erscheinen. **UH1–UH3** benötigen eine Ziffernregel statt des reinen Wortinitial-Checks.
- **Kollision:** KDU (Formular) und KdU (Fachkürzel) teilen dieselben Anfangsbuchstaben, sind aber eigenständige Datensätze mit unterschiedlichen IDs.
- **Kuratierung:** `origin: user | prior | new` trennt Lieblingssprüche von früheren Chat-Ideen und neuen Wortspielen; `favorite: true` schützt die ausgewählten Originalformulierungen. Das ist kein amtliches Sprachlexikon.
- **Datenprüfung:** `node scripts/check-kuerzel-kabarett.mjs` prüft die Initialen aller Einträge und Kombinationen sowie den unveränderten Wortlaut der sechs Lieblingssprüche. Alle 178 + 20 Initialfolgen wurden beim Anlegen der PR vorab geprüft; den Node-Check bitte in CI/lokal ausführen.

**Wichtig:** Im Editor ist jedes Wort eine Einheit; der Algorithmus extrahiert den ersten Unicode-Buchstaben pro Wort, ignoriert Satzzeichen und zählt Apostrophe innerhalb eines Wortes nicht neu. Beim Poster-Export muss die Hervorhebung aus dem tatsächlich geschriebenen Text abgeleitet werden, niemals aus einem separat manuell erfassten Acronym.

Die Satire bleibt rechtlich klar von realen Formularnamen und Handlungsanweisungen getrennt. Der Bibliothekar-Auftrag zur kommerziellen Ausgliederung unten bleibt **unverändert**.

---
## 2. Arbeitsauftrag an den Bibliothekar: bestehende Jobcenter-Dose beerdigen

**Entscheidung des Nutzers:** Die Amélie-Dose **gruendungsnavigator / Gründungsnavigator & Jobcenter-Hilfe** gehört nicht länger in das freie Amélie-Geschenkportfolio. **Eine eigene kommerzielle App existiert inzwischen als separates Entwicklungsprojekt.** Nicht behaupten, sie sei bereits gelauncht oder verkaufe sich. Das ist eine **Ausgliederung**, kein Fund eines fremden Konkurrenten.

**Bitte in einer eigenen nachfolgenden, überprüfbaren PR nach Friedhofsordnung erledigen:**

1. Dosen-ID **gruendungsnavigator** vor Migration auf bestehende Friedhofseinträge und Referenzen prüfen; sie dann von Amélies aktiven Dosen in den Friedhof überführen. Das Forschungsdossier als Grabbeigabe behalten; nicht spurlos löschen.
2. Totenschein in src/data/graeber.json gemäß 08-friedhof/README.md. Vorgeschlagen: **cause = gebaut**, **killer = kommerziell**, **foundBy = eigener-bestand**, **stage = dose**, **diedOn = 2026-10-24**. In die Begründung ausdrücklich schreiben: **„Eigene kommerzielle App existiert (in Entwicklung), daher keine frei zu verschenkende Amélie-Dose mehr.“** Keine fälschliche Aussage über externe Konkurrenz oder kommerziellen Launch.
3. 05-dosen/gruendungsnavigator.md und entsprechende englische Kapitel in die Grabbeigaben überführen; Prüfprotokoll und ggf. verbundene Zustell-/Kandidatenreferenzen aktualisieren. Andere unabhängige Jobcenter-Forschung nicht pauschal vernichten.
4. Als Konsequenz **alle öffentlichen Produktausspielungen entfernen**: Dosen-Galerie, Direkt-URL und Buch, Simulator-Karte, öffentliches Preview unter public/gruendungsnavigator/ einschließlich direkter HTML-Dateien, CTA/Links, SEO-Routen, Exportdateien (dosen.json, amelie-ideas.json etc.), lokale Storage-Wiederimporte. Nur ein UI-Badge auszublenden reicht nicht.
5. Betroffene Pfade zum Audit: src/data/dosen.ts, src/data/doseBooks.ts, src/data/doseSimulators.ts, src/components/InteractiveTinSandboxes.tsx, src/components/simulators/GruendungsnavigatorSimulator.tsx, src/data/ideas/jobcenterRound.ts, scripts/site-pages.mjs, scripts/export-public-data.mjs, src/services/doseStorage.ts, public/data und README/07-demos. Änderungen am kommerziellen Privat-Repo sind **nicht** Teil des Auftrags.
6. Alte öffentliche CC0-Veröffentlichungen/Git-History sind nicht rückwirkend entziehbar. Friedhof und historische Belege bewahren, aber künftig **nicht** als CC0-Produktangebot bewerben; keine privaten Code- oder Geschäftsdetails aus dem separaten Repo kopieren.
7. npm run friedhof, npm run export:data, npm run lint, npm test und URL-Smoke-Tests; aktive öffentliche Dosenlisten, Suchindex, Routen und JSON-Exporte dürfen die ausgegliederte Anwendung nicht mehr als verfügbare Dose oder Simulator präsentieren.

**Akzeptanz dieser PR:** Dokumentierte Idee plus klarer Bibliothekar-Auftrag. **Die Migration selbst ist bewusst noch nicht erfolgt.**

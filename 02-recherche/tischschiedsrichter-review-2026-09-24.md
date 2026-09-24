# TischSchiedsrichter — eigene Prüfung

**Datum:** 24.09.2026 · **Methode:** amelie-ideenrunde (Nutzer bringt die Idee mit, Schritt 3 übersprungen)
**Eingang:** Gemini-Entwicklungsplan (`tischschiedsrichter-plan-gemini.md`) und Datensatz im App-Format (`tischschiedsrichter-gemini.json`), beide von Félix am 24.09.2026 mitgebracht.
**Urteil:** `verengt` (dünn) — **nicht gepackt, keine Dose.** Katalogeintrag in `src/data/ideas/aiNativeFrontier.ts` mit korrigiertem Status.

---

## Die Idee in einem Satz

Ein Handy in der Tischmitte hört offline auf eine vereinbarte Liste von Reizwörtern („Wahl", „Partei", …), pfeift wie ein Schiedsrichter und zeigt Gelb oder Rot, ohne dass Audio das Gerät verlässt.

## Ergebnis in einem Satz

**Das Szenario gibt es seit 2015, die Funktion seit 2018, eine laufende App seit 2025 — übrig bleibt eine Eigenschaft (offline, Deutsch), keine neue Fähigkeit, und kein Empfänger.**

---

## 1 · Wer es schon gemacht hat (Existenzprüfung)

| Treffer | Was | Abdeckung | Beleg |
|---|---|---|---|
| **Noche de Paz / SilentNight** (Werbeagentur Shackleton, Dez. 2015, iOS + Android, kostenlos) | Handy **in die Tischmitte**, erkennt 20–25+ politische Wörter („Podemos", „elecciones", „independencia", „corrupción"), schlägt Alarm bzw. schlägt per Sprachansage ein anderes Thema vor. Englische Version „SilentNight" mit „Taxes", „Donald Trump" | **Szenario vollständig** — Weihnachtsessen, Politik, Handy in der Mitte, automatischer Eingriff. Feste Wortliste, Werbe-Gag, heute vermutlich nicht mehr in den Stores (nicht geprüft) | [Adlatina](http://www.adlatina.com/digital/para-tener-una-%E2%80%9Cnoche-de-paz%E2%80%9D), [ipmark](https://ipmark.com/app-shackleton-noche-de-paz/), [OKDiario](https://okdiario.com/espana/lanzan-una-aplicacion-para-no-hablar-de-politica-en-la-cena-de-navidad-44138) |
| **JarGone** (Kickstarter 2018) | Eigenes Gerät, „always listening", Wörter frei per App eintragbar, **mehrere Familienmitglieder** koppeln ihre eigene Liste, Alarmton + rotes Leuchten | **Funktion vollständig**, inklusive frei wählbarer Liste und Familienbetrieb | [Digital Trends, 25.04.2018](https://www.digitaltrends.com/cool-tech/digital-swear-jar/) |
| **Swearing Jar** (App Store, v1.0 am 26.03.2025) | Echtzeit-Erkennung selbst definierter Wörter/Phrasen, Zähler, „accountability circles" mit Familie/Freunden | **Funktion vollständig, aktuell.** Datenschutzlabel: Audiodaten, Kontakt, Kennungen **mit Identität verknüpft**; Verarbeitungsort nicht angegeben. Das stützt die Datenschutz-Begründung des Gemini-Datensatzes — der einzige Satz dort, den ich belegen konnte | [App Store](https://apps.apple.com/us/app/swearing-jar/id6756890963) (Seite gelesen) |
| **Swear Jar 2.0** (itch.io) | Browser, eigene Wörter, „100+ Sprachen" über die Spracherkennung des Browsers | Funktion, Web | [itch.io](https://hz83.itch.io/swearjar) |
| Bastelprojekte | `scpedicini/swearjar` (Browser, piept bei Wortliste), `handychimp/swear-jar`, `rrotaru/digital-swearjar` (2015), Spokestack-Tutorial „Swear Jar in 100 Lines of Python" (on-device Keyword-Modell) | Funktion als Wochenendprojekt, mehrfach | [GitHub](https://github.com/scpedicini/swearjar), [Spokestack](https://www.spokestack.io/blog/keyword-recognizer-python-tutorial/) |

**Restlücke** (was keiner der Treffer zusammen hat): garantiert offline **und** Deutsch **und** frei wählbare Wörter ohne Training **und** Spielregeln für den Tisch (Gelb/Rot, Abkühlzeit) statt Selbstoptimierung. Das sind vier Eigenschaften, keine neue Fähigkeit. Deshalb `verengt (dünn)`, nicht `frei`.

## 2 · Was am Gemini-Material nicht hält

1. **`status: "frei"` ohne Prüfung.** Dasselbe Muster wie im Gemini-Lauf vom 19.09. (`frei (Kandidat)`), das der Librarian damals auf `ungeprüft` herabgestuft hat. Eine Suche auf Spanisch nach dem Szenario hätte gereicht.
2. **„Vor 2024 unmöglich" (`techShift.beforeAiDe`) ist falsch.** Noche de Paz lief 2015, JarGone 2018, das Spokestack-Tutorial baut die Erkennung on-device. Die Idee fällt damit **nicht unter die These des Manifests** (möglich erst durch neue KI). Neu ist höchstens, dass freie Wortlisten *ohne Training* heute offline gehen (siehe 3).
3. **Konkurrenz im Plan teils nicht auffindbar.** „Buzzedword" (angeblich wichtigster direkter Konkurrent, iOS, „political debate watch parties") — zwei Suchen, kein Treffer; wahrscheinlich erfunden. „Peace on Argue (和平電波)", „Buzzer Said It", „OtosakuKWS-iOS", „onnx-wakeword/voicute (~4,90 $ pro Wort)" — **nicht geprüft**, nicht weiterverwenden, bevor jemand die Seiten gelesen hat. Die echten nächsten Nachbarn (JarGone, Swearing Jar) nennt der Plan nicht.
4. **Custom-Training ist unnötig — und Deutsch das eigentliche Problem.** sherpa-onnx kann eigene Schlüsselwörter **ohne Nachtraining** („open vocabulary keyword spotting", [Doku](https://k2-fsa.github.io/sherpa/onnx/kws/index.html)). Die ganze Phase-2-Planung (Aufnahme von 3–5 Beispielen, voicute-Modelle pro Wort) löst ein Problem, das es nicht gibt. **Aber:** Die vortrainierten KWS-Modelle dort sind Englisch und Chinesisch (gigaspeech-en, wenetspeech-zh, zh-en 2025-12-20) — **kein Deutsch.** Für Deutsch bleibt ein kleines Offline-ASR mit eingeschränkter Grammatik, z. B. Vosk. Dazu ein dokumentiertes Risiko: Im Vosk-Grammatikmodus liefern das deutsche und das spanische Modell fast nie `[unk]` ([Issue #1017](https://github.com/alphacep/vosk-api/issues/1017)) — das Modell presst jedes Gemurmel auf die nächste Vokabel. Genau das erzeugt am Esstisch Fehlpfiffe.
5. **Erstes Ticket „Offline-PWA" ist plausibler als der Plan glaubt.** Chrome hat seit Version 139 On-Device-Spracherkennung in der Web Speech API (`processLocally`, [MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/processLocally)). Sprachumfang für Deutsch und Verhalten auf Android **nicht geprüft**; für macOS ist ein Fehler gemeldet ([Chromium 444393111](https://issues.chromium.org/issues/444393111)). Damit ist ein Prototyp ein Nachmittag, kein 20-Wochen-Projekt mit 2,5 Stellen.
6. **Abnahmekriterium unrealistisch.** „Erkennt 5 Wörter bei Stimmengewirr (Cocktail-Party-Effekt) in unter 500 ms" — überlappende Sprache an einem Tisch mit einem Handymikrofon ist genau der Fall, an dem Schlüsselworterkennung am schlechtesten ist. Ehrlicher: Erkennungsrate und Fehlpfiffe pro Stunde in einer aufgenommenen Tischsituation messen, Schwelle danach setzen.
7. **„Physikalisch unmöglich, Gespräche zu speichern"** ist eine Überbehauptung. Eine App mit Mikrofonzugriff *kann* speichern; beweisbar ist nur „speichert nicht", z. B. durch fehlende Netzwerkberechtigung und quelloffenen Code.
8. **Empfänger sind Sammeladressen.** `mail@ccc.de` und `info@mozilla.org` — das ist die BCC-Mail an große Organisationen, die das Manifest als Anti-Pattern führt. Mozilla Common Voice ist ein Datensatzprojekt, kein App-Träger. „Konfliktlösungs-NGOs" und „Familienberatungsstellen" sind keine Adressen, und eine App, die Angehörige abhört, als Beratungswerkzeug anzubieten, ist heikel.
9. **Persona ist erfunden und inkonsistent.** „Markus Thiel (45), Recklinghausen" spricht auf Deutsch von Weihnachten und auf Englisch von Thanksgiving. Personas sind im Katalog üblich, müssen aber als fiktiv erkennbar sein.

## 3 · Was an der Idee gut ist

- **Die soziale Mechanik stimmt.** Der Kern ist nicht die Technik, sondern die Delegation: Niemand will derjenige sein, der den Schwiegervater unterbricht; eine vorher gemeinsam beschlossene Regel mit neutralem Pfiff nimmt dem Gastgeber diese Rolle ab. Das ist dieselbe Logik wie beim Tabu-Buzzer, nur ohne Mitspieler, der drücken muss.
- **Der Datenschutz-Einwand gegen die bestehenden Apps ist belegbar** (Swearing-Jar-Label: Audio mit Identität verknüpft).
- **Einwilligung als Spielregel.** Alle am Tisch beschließen die Liste vorher — das macht aus Überwachung ein Spiel und gehört in den ersten Bildschirm, nicht in die Datenschutzerklärung.

## 4 · Empfehlung

**Nicht verschenken — es gibt niemanden, dem sie fehlt.** Als Amélie-Dose trägt die Idee nicht: Sie ist nicht erst durch KI möglich geworden, und sie hat keinen Empfänger mit eigenem Interesse. Als Vibecode-Spielzeug passt sie gut in dieses Projekt: eine PWA mit Chrome-On-Device-Erkennung, Wortliste, Pfiff, gelbe Karte — ein Nachmittag. Wenn sie danach Freude macht, kann das lauffähige Ding als CC0-Repo irgendwo liegen; eine Zustellung braucht es nicht.

Im Katalog steht sie deshalb als `verengt` / `build_first`, ohne Empfängeradressen und ohne Mail-Entwurf.

## 5 · Nebenbefund (nicht Teil dieser Idee, aber in dieser Prüfung gefunden)

**Alle 131 Einträge in `src/data/ideas/*.ts` tragen `status: 'frei'`**, und keiner der acht „AI Frontier 2026"-Einträge hat eine Zeile im Prüfprotokoll. Mindestens **sieben Dosen in `05-dosen/`** haben ebenfalls keine Protokollzeile: PillSafe Vision, ParagraphenDolmetscher, KlangStethoskop, ChemGefahr-Stopp, DienstplanWächter, BedenkenBlitz, EuroBirdCast. Die Regel im Protokollkopf („Neue Dose ohne Zeile hier = Fehler, sofort nachtragen") ist damit siebenfach verletzt. In dieser Runde **nicht** repariert — das ist eine eigene Nachprüfung und Félix' Entscheidung.

## Quellen

- Noche de Paz: [Adlatina](http://www.adlatina.com/digital/para-tener-una-%E2%80%9Cnoche-de-paz%E2%80%9D) · [ipmark, 21.12.2015](https://ipmark.com/app-shackleton-noche-de-paz/) · [OKDiario, 23.12.2015](https://okdiario.com/espana/lanzan-una-aplicacion-para-no-hablar-de-politica-en-la-cena-de-navidad-44138) · [Bolsamanía](https://www.bolsamania.com/noticias/tecnologia/noche-de-paz-la-app-que-censura-la-conversaciones-politicas-en-las-cenas-de-navidad--976253.html)
- JarGone: [Digital Trends, 25.04.2018](https://www.digitaltrends.com/cool-tech/digital-swear-jar/)
- Swearing Jar: [App Store](https://apps.apple.com/us/app/swearing-jar/id6756890963)
- Swear Jar 2.0: [itch.io](https://hz83.itch.io/swearjar)
- Bastelprojekte: [scpedicini/swearjar](https://github.com/scpedicini/swearjar) · [rrotaru/digital-swearjar](https://github.com/rrotaru/digital-swearjar) · [Spokestack-Tutorial](https://www.spokestack.io/blog/keyword-recognizer-python-tutorial/)
- Technik: [sherpa-onnx KWS](https://k2-fsa.github.io/sherpa/onnx/kws/index.html) · [Vosk Issue #1017](https://github.com/alphacep/vosk-api/issues/1017) · [MDN processLocally](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/processLocally) · [Chromium 444393111](https://issues.chromium.org/issues/444393111)
- Tabu-Apps (Buzzer von Hand): [Taboo Official, App Store](https://apps.apple.com/gb/app/taboo-official-party-game/id1563932741)

# Amélie — Matrix: Idee → Empfänger

Zu jeder Idee aus `ideas-neue-projekte.md`: wer davon profitiert, warum ausgerechnet die, über welchen Kanal, und mit welchem Satz.

**Verdikt-Legende:** 🎁 verschenken · 🔨 erst Skelett bauen, dann verschenken · 🔒 behalten
**Status** pflegen: `gefunden → gepackt → zugestellt → Antwort → gebaut`

> Regel aus dem Manifest: reine Ideen gehen an Firmen, Forschung, Fördertöpfe und Communities. An einzelne Open-Source-Maintainer nur **mit Code**.

---

## 1. Agent- & MCP-Tooling

### git-archaeologist (MCP) — M · 🔨

**Wer profitiert:** Jedes Team mit einer Codebasis, die älter ist als die Hälfte der Leute, die dran arbeiten. Und vor allem: alle AI-Coding-Tools, deren größte Schwäche fehlende Historie ist. Ein Agent, der `blame → PR → Issue → Diskussion` als eine Kette lesen kann, hört auf, Absichten zu erfinden.

**Empfänger:**
- **GitLens / GitKraken** (Maintainer: Eric Amodio, `@eamodio`) — GitLens macht Blame seit Jahren sichtbar; die Historie als MCP-Tool-Server zu exponieren ist der offensichtliche nächste Schritt, den sie noch nicht gegangen sind. Firma, also Adressat ohne Code-Pflicht.
- **Sourcegraph** — Code-Intelligence ist ihre These, Historie ihr blinder Fleck.
- **MCP-Registries** (offizielle Registry, PulseMCP, Smithery) als Verbreitungsweg, falls du es selbst baust.

**Kanal:** GitHub Discussion im `gitkraken/vscode-gitlens`-Repo (Firma, kein unbezahlter Einzelmaintainer) + parallel als Show-HN, falls ein Prototyp existiert.

**Hook:** „Dein Agent rät, warum der Code so aussieht. Die Antwort existiert — sie ist nur auf blame, PR, Issue und einen Slack-Thread verteilt, und niemand hat sie je zu einer Kette verbunden."

**Warum 🔨:** Ein MCP-Server, der nur `git log` wrappt, ist ein Wochenende. Erst mit dem Skelett wird die Idee für andere real.

---

### Spec-Drift Detector — M · 🔒 (behalten) + Idee trotzdem streuen

**Wer profitiert:** Die gesamte spec-driven-Development-Bewegung, die gerade ihr Immunsystem vermisst: Specs werden geschrieben, Implementierungen laufen weg, niemand merkt es, bis ein Agent auf Basis der alten Spec etwas Falsches baut.

**Empfänger:**
- **Tessl** (Guy Podjarny) — „Spec as source" ist ihr ganzes Produkt. Drift-Erkennung ist die fehlende Hälfte davon; sie haben Framework und Registry, aber der CI-Check, der Divergenz *hart* failt, ist die Lücke. Sie betreiben einen Podcast und suchen aktiv Positionen zum Thema — das ist ein offenes Einfallstor.
- **GitHub Spec Kit** — Open-Source-Toolkit von GitHub (also Firma, nicht Einzelmaintainer), Discussions offen, exakt dieser Problemraum.
- **Optic / OpenAPI-Ökosystem** — machen Drift-Detection für APIs; die Verallgemeinerung auf Prosa-Specs ist ihr angrenzender Markt.

**Kanal:** Discussion im `github/spec-kit`-Repo (öffentlich, sichtbar, kostet niemanden Nerven) + Mail/Podcast-Pitch an Tessl.

**Hook:** „Spec-driven development hat kein Immunsystem. Nichts im Build merkt, wenn die Implementierung von der Spec wegläuft — und ab dem Moment baut der Agent zuverlässig das Falsche, mit Begründung."

**Warum 🔒:** Du hast das Problem real über mehrere Repos (`recipes`, OCR, tortilla-*). Das ist der Kandidat mit dem schnellsten Eigennutzen. Die Idee öffentlich zu machen kostet dich nichts — sie wird sowieso von mehreren Seiten gebaut.

---

### Agent Postmortem Recorder — S · 🔨

**Wer profitiert:** Jeder, der Claude Code ernsthaft nutzt, besonders in Multi-Agent-Setups wie deinem. Die existierende Observability-Szene zeigt dir *dass* etwas schiefging (OTel-Traces, Hook-Event-Dashboards) — aber niemand liefert die Konsequenz: den konkreten `CLAUDE.md`-Patch gegen die Missverständnis-Klasse, die statistisch am teuersten ist.

**Empfänger:**
- **Die Claude-Code-Plugin-/Skill-Community** — der billigste Verbreitungsweg, den es gibt: als Plugin veröffentlichen, fertig.
- **Bestehende Hook-Observability-Projekte** (z. B. `claude-code-multi-agent-observability`) — als PR, nicht als Wunsch.
- **Anthropic DevRel** — Feature-Feedback ist erwünscht, und „Agent-Postmortem" ist eine Kategorie, die sie selbst noch nicht besetzt haben.

**Kanal:** Bauen (ein Wochenende), veröffentlichen, in den einschlägigen Directories listen. Bei diesem hier *ist* Bauen das Verschenken.

**Hook:** „Observability für Agents sagt dir, dass die Session schiefging. Sie sagt dir nicht, welche drei Zeilen in CLAUDE.md gefehlt haben — obwohl genau das in den Logs steht."

---

### Diffgeist — S · 🎁

**Wer profitiert:** Alle, die Release Notes von Dependencies lesen sollten und es nicht tun. Der Trick ist die Personalisierung: nicht „React 20 ändert X", sondern „React 20 ändert X, und du nutzt X an vier Stellen — hier sind sie".

**Empfänger:**
- **Andrew Nesbitt / Ecosyste.ms** — baut die offene Datenschicht über Paket-Ökosysteme, schreibt über Downstream-Testing, FOSDEM-Speaker. Er hat die Daten, die diese Idee erst billig machen, und er ist über Blog/Mastodon erreichbar. Die Idee passt in sein bestehendes Programm, statt Arbeit obendrauf zu legen.
- **Renovate / Mend** — Renovate öffnet die PRs; der personalisierte Changelog *im* PR-Body ist eine reine Ergänzung ihres Produkts.
- **Socket.dev** — analysieren ohnehin, was ein Update tatsächlich ändert.

**Kanal:** Mail an Nesbitt (kurz, eine Seite im Anhang) + Feature-Discussion bei Renovate (Firma).

**Hook:** „Release Notes sind für alle geschrieben. Interessant ist ausschließlich der Teil, den dein Code tatsächlich aufruft — und den kann man heute für ein paar Cent pro Repo ausrechnen."

---

### Home-Network MCP — S · 🔨

**Wer profitiert:** Home Assistant hat bereits MCP in beide Richtungen — aber Router, DNS und Netzwerk sind der unbesetzte Teil. „Wer ist im Netz", „Blockliste an/aus", „wer zieht die Bandbreite" per Chat statt Fritzbox-Web-UI ist ein Wochenendprojekt mit sofortigem Publikum.

**Empfänger:**
- **Home Assistant / Open Home Foundation** (Paulus Schoutsen) — Community-Forum und Integrations-Ökosystem; eine Custom-Integration ist der natürliche Ort.
- **Pi-hole-Community** — DNS-Blocklisten togglen ist ihr Kerngeschäft.
- **AVM-/Fritzbox-Bastelszene** (IPPF, Home-Assistant-Forum) — die haben die API-Arbeit längst gemacht, es fehlt nur die Tool-Server-Schicht.

**Kanal:** Bauen, dann in MCP-Registries listen und im HA-Forum zeigen. Ohne Code ist das im HA-Ökosystem nur ein Wunsch unter tausend.

**Hook:** „Dein Agent kann das Licht erklären, aber nicht, wer gerade dein Netz zumacht."

---

## 2. Physik-Spielzeug

### Wet Ink — M · 🔒 (behalten) + Plan verschenken

**Wer profitiert:** Kurzfristig niemand außer dir — und das ist okay, das ist dein „schönstes Ding". Der *Plan* dagegen ist für andere sofort wertvoll: eine durchgerechnete Roadmap mit CPU-Referenzimplementierung, visuellen Regressionstests und ehrlicher SVG-Warnung gibt es so nirgends.

**Empfänger (für den Plan, nicht das Produkt):**
- **Escape Motions** (Rebelle) — machen echte Fluid-Watercolor-Simulation im Desktop-Bereich, Version 8.3 ist aktuell. Eine WebGL2-Variante mit Kubelka-Munk ist keine Konkurrenz, sondern eine Demonstration, dass das im Browser geht.
- **Kalligrafie-/Sumi-Community und die WebGL-Demoszene** — Shadertoy, Observable, CodePen: dort ist so etwas Währung.
- **Lehre:** Der Plan ist ein besseres Seminarprojekt als alles, was in Grafik-Kursen sonst vergeben wird — inklusive der GPU-vs-CPU-Testmethodik.

**Kanal:** `wet-ink-plan.md` als öffentlichen Blogpost/Gist veröffentlichen, sobald P2 (Feathering) läuft und du ein GIF hast. Das GIF ist der Verteiler.

**Hook:** „Zwölf Tage, eine Physik, kein three.js. Hier ist der komplette Plan inklusive der Stelle, an der es garantiert wie Rauch statt wie Tinte aussieht."

---

### Altbau Thermal — L · 🎁 ← **stärkster Geschenk-Kandidat der ganzen Liste**

**Wer profitiert:** Alle, die gerade versuchen, den Berliner Gebäudebestand energetisch zu verstehen — und das ist derzeit eine erstaunlich große, gut finanzierte Menge Leute.

**Empfänger:**
- **co2online (gemeinnützig) — Projekt „EnergyMap Berlin"**: erfassen mit KI den energetischen Zustand von 360.000 Berliner Gebäuden für die kommunale Wärmeplanung und sammeln über „HeizCheck" freiwillig Verbrauchsdaten von Bürger:innen. Deine Idee ist exakt ihr fehlendes Frontend: Grundriss zeichnen → sehen, was Fenster, Heizkörper und Außenwand tun. Sie haben Daten und Budget, aber kein anfassbares Bürger-Tool. **Das ist die eine Mail, die du diese Woche schreiben solltest.**
- **Verbraucherzentrale Berlin / Verbraucherzentrale Energieberatung** — bieten kostenfreie Energieberatung inkl. Gebäudecheck. Beratung erklärt in Zahlen, was eine Simulation in zehn Sekunden zeigt. Sie suchen Vermittlungswerkzeuge, nicht noch eine Broschüre.
- **Prototype Fund** — Bewerbung 1.10.–30.11.2026, aber seit 2025 nur die Schwerpunkte Datensicherheit und Software-Infrastruktur. Eine Wohnungs-App passt nicht; nur ein offener, validierter 2D-Wärmeleitungskern als Bibliothek könnte als Infrastruktur gelten (vorab klären).
- **Mieter:innen-Initiativen & Berliner Mieterverein** — für die Argumentationsseite („die Wand ist das Problem, nicht mein Lüftungsverhalten").

**Kanal:** Direkte Mail an co2online (Projektteam EnergyMap) mit der Einseiter-Vorlage; parallel Verbraucherzentrale Berlin. kein Prototype-Fund-Hinweis mehr in der Mail (Schwerpunkte passen nicht, siehe oben).

**Hook:** „Ihr rechnet den Zustand von 360.000 Gebäuden aus. Die Leute, die drin wohnen, sehen davon eine Zahl. Ein Grundriss, den man zeichnet, und eine Kurve, die ehrlich zeigt, was ein gekipptes Fenster im Altbau kostet — das ist dieselbe Physik, nur ansehbar."

---

### Pin Tumbler — M · 🎁

**Wer profitiert:** Die Locksport-Szene bringt Gefühl bei; ein Simulator bringt das *Modell* bei, bevor man das Gefühl hat. Stifte, Federn, Toleranzen, Binding Order — das ist genau der Teil, den Anfänger:innen wochenlang blind ertasten.

**Empfänger:**
- **SSDeV — Sportsfreunde der Sperrtechnik Deutschland e. V.**, mit eigener **Ortsgruppe Berlin** und Wiki. Größter organisierter Lockpicking-Verein im deutschsprachigen Raum, ausdrücklich auf Wissensvermittlung ausgerichtet. Community mit Zeit und Interesse: perfekter Empfängertyp.
- **TOOOL** (NL/US) — international dieselbe Rolle.
- **CCC / Congress-Workshops** — Sperrtechnik ist dort seit jeher Programm; ein Simulator als Workshop-Beigabe verteilt sich von selbst.
- **Berufsausbildung Schließtechnik** — der unerwartete Markt: Azubis lernen Zylinder heute an Schnittmodellen aus Plexiglas.

**Kanal:** SSDeV Ortsgruppe Berlin (Stammtisch) persönlich oder über `wiki.ssdev.org`; Workshop-Vorschlag beim nächsten Congress.

**Hook:** „Ihr bringt Leuten Gefühl bei. Das Modell dahinter — Toleranzen, Binding Order, warum ein Stift zuerst setzt — sieht man erst, wenn man es simulieren kann. Haptik über Handy-Vibration ist nah genug dran, um zu lehren."

---

### Räucher-Sim — S · 🎁 durch Veröffentlichen

**Wer profitiert:** Niemand mit Budget. Das ist kein Produkt, das ist ein Geschenk an Fremde im Internet — und genau dafür gibt es eine funktionierende Kultur (Web-Toys ohne Ziel, ohne Score, ohne Account).

**Empfänger:**
- **Die Web-Toy-Öffentlichkeit** — neal.fun-artige Sammlungen, Shadertoy, CodePen. Verteilung ist der ganze Mechanismus.
- **Kinder- und Wissenschaftsmuseen, Ausstellungsbau** — eine Rauchsim, die auf Atem reagiert, ist eine fertige Installation für kleines Geld. Berlin: Futurium, Spectrum/Technikmuseum.
- **Meditations-/Achtsamkeits-Apps** — als Hintergrund-Szene lizenzfrei angeboten.

**Kanal:** Bauen (ein Wochenende), Link posten, Quellcode MIT. Kein Pitch nötig.

**Hook:** entfällt — das Ding ist sein eigener Pitch.

---

### Kristallwachstum 3D — M · 🎁

**Wer profitiert:** Die generative-Design-Szene braucht neue Generatoren, und DLA im Raum mit Live-Parametern und GLB-Export ist ein Generator, der direkt in eine Druckdatei mündet. Jeder Lauf ein Unikat.

**Empfänger:**
- **Nervous System** (Jessica Rosenkrantz & Jesse Louis-Rosenberg) — machen seit 2007 nichts anderes als generatives Design → 3D-Druck, von Schmuck bis Lunge. Sie sind der natürliche Adressat und ansprechbar.
- **Prusa / Printables-Community** — Generator-Projekte mit Seed-Sharing sind dort Gold; Wettbewerbe laufen regelmäßig.
- **Mineralogie-Lehre** — DLA erklärt Dendritenwachstum besser als jede Abbildung. TU Berlin, Museum für Naturkunde.

**Kanal:** Nervous System direkt (Kontaktformular/Instagram, sie antworten auf Substanz); parallel als Printables-Projekt mit Seed-Galerie.

**Hook:** „Diffusion-limited aggregation im Raum, Parameter live, Export als GLB. Jeder Seed ein Objekt, das man drucken kann — und die Parameter sind das eigentliche Kunstwerk."

---

## 3. Berlin / Alltag

### Sperrmüll-Radar — M · 🎁 ← die reinste Amélie-Idee der Liste (verengt, Recheck 20.09.2026)

**Wer profitiert:** „Zu verschenken" ist ein Berliner Protokoll ohne Protokoll. 12 Stunden Halbwertszeit, kein Account, kein Besitz — die technische Umsetzung existiert nicht, weil niemand daran verdient. Fast 200.000 illegale Müllmeldungen 2025 in Berlin (>13 Mio. € Beseitigungskosten); Sperrmüll-Radar macht aus illegalen Müllhaufen vorab gerettete Gebrauchtwaren. In den USA gibt es CurbAlert/Givore (VC/Ad-finanziert, mit Login). Die Lücke in Berlin: kommunal/gemeinnützig, kontolos, OSM-Straßensegment statt Hausnummer, Verfall als Datenschutz.

**Empfänger:**
- **CityLAB Berlin (Technologiestiftung Berlin)** — baut Prototypen für die Stadt (Gieß den Kiez, BärGPT, Beyond Forms), veranstaltet Kiezlabore, betreibt mit dem GovTech TestLAB einen Weg in die Verwaltung. Idealer Bauträger: öffentlich finanziert, sucht Open-Source-Gemeinwohlthemen.
- **Re-Use Berlin / Zero-Waste-Agentur (Senatsverwaltung für Mobilität, Verkehr, Klimaschutz und Umwelt)** — inhaltlicher Domänenpartner (Zero Waste, NochMall, Re-Use-Superstores; deren aktuelle Re-Use-Karte existiert nur als 2,8-MB-PDF).
- **BSR (Berliner Stadtreinigung)** — Beseitigungskosten senken; ca. 80 BSR-Kieztage pro Jahr als Kaltstart-Bühne für Kiez-Adoption.
- **OpenStreetMap Berlin** — Community für offene Geodaten; OSM-Straßensegmente als Datenschutzabstraktion.
- *(Hinweis Fördertopf: Prototype Fund fördert nur Freiberufler/GbR ≤4 Personen, keine Stiftungen/Behörden — CityLAB baut aus Stiftungsmitteln).*

**Kanal:** CityLAB zuerst (die kennen alle anderen). Einseiter + expliziter Hinweis auf 12-Stunden-Verfallslogik und OSM-Straßensegment als Datenschutz.

**Hook:** „Berlin hat ein funktionierendes Verschenk-Protokoll ohne einen einzigen Server: Karton, Bordstein, Schild. Der einzige fehlende Teil ist, zu wissen, wo gerade einer steht — und das braucht keine Accounts, nur Pins mit Halbwertszeit."

---

### Commute Oracle — M · 🔨

**Wer profitiert:** Alle, die den offiziellen ETA nicht brauchen, sondern ihren eigenen. Die offizielle Auskunft kennt den Fahrplan; sie kennt nicht, wie lange *du* zum Bahnsteig brauchst, welchen Aufgang du nimmst und dass du den 21:04 nie erwischst.

**Empfänger:**
- **Jannis Redmann (`derhuerst`)** — betreibt das offene Berliner ÖPNV-Ökosystem (`vbb-rest`, `bvg-rest`, `vbb-gtfs`, transport.rest). Ohne diese APIs ist die Idee teuer, mit ihnen ein Wochenende. **Aber:** Einzelmaintainer → nur mit Code ansprechen, nie als Feature-Wunsch.
- **Träwelling-Community** — loggen bereits freiwillig ihre Fahrten. Die Datenlage, auf der das Modell lernt, existiert dort schon.
- **Transitous / MOTIS** — offene Routing-Infrastruktur, sucht Anwendungsfälle.

**Kanal:** Kleines lauffähiges Ding auf Basis von `vbb-rest` bauen, dann in der Community zeigen. Der Prototyp ist die Eintrittskarte.

**Hook:** „Der offizielle ETA kennt den Fahrplan. Er kennt nicht, dass du sieben Minuten zur Haltestelle brauchst und der Aufgang Nord gesperrt ist. Dreißig eigene Fahrten reichen, damit ein Modell das weiß."

---

### Kiez-Lärmkarte — L · 🎁 (verengt, Recheck 20.09.2026)

**Wer profitiert:** Alle, die in Berlin eine Wohnung suchen oder eine Lärmbeschwerde begründen wollen — und die Forschung, die genau diese Methodik seit Jahren verfeinert. Privacy-first (nur dB-Pegel, nie Audio, lokale Aggregation) ist nicht Beiwerk, sondern die Existenzbedingung. In Berlin entstand an der TU Berlin bereits Hush City (von Berlin 2018 für Quiet-Areas-Planung übernommen; bewertet aber Orte per 44,1-kHz-Audioaufnahme). Die Restlücke: Tagesprofil/Ruhe-Fenster pro Straßenabschnitt („wann" statt „wo"), reine dB-Pegel ohne Audio, getragen von Institutionen statt Einzelpersonen.

**Empfänger:**
- **Noise-Planet / NoiseCapture** (Université Gustave Eiffel + CNRS, Open Source auf GitHub) — betreiben weltweite Crowdsourcing-Lärmkarten mit exakt dieser Architektur. Dein Beitrag wäre die Ruhe-Fenster-Perspektive („wann ist diese Straße leise") statt der Durchschnittskarte. Forschung = idealer Empfänger für eine reine Idee.
- **CityLAB Berlin** — kommunaler Bauträger für die Berliner Bürgeranwendung (Kiezlabor).
- **Senatsverwaltung für Mobilität, Verkehr, Klimaschutz und Umwelt (SenUMVK)** — Lärmaktionsplan 2024–2029 rechnet mit Modellen und Durchschnitten; gemessene Ruhe-Fenster sind komplementär, nicht konkurrierend.
- *(Vorarbeit: Hush City von Dr. A. Radicchi in Dose und Mail als Pionier würdigen; Radicchi finanziert seit 2020 privat → kein Empfänger laut Rangliste).*

**Kanal:** Mail an die NoiseCapture-Gruppe (Forschung, Englisch, ein Absatz Methodik reicht) + CityLAB für die Berliner Variante (gemeinsam mit Sperrmüll-Radar).

**Hook:** „Lärmaktionspläne liefern Jahresmittelwerte. Menschen suchen etwas anderes: das Zeitfenster, in dem diese Straße leise ist. Dieselben Sensoren, andere Frage — und ohne eine einzige Audioaufnahme zu speichern."

---

## 4. Esoterik-Ecke, aber als Software

### Tarot als Zustandsmaschine — M · 🎁 als Spezifikation

**Wer profitiert:** Der Reiz ist nicht die Deutung, sondern die Einsicht: **ein Legesystem ist bereits ein Programm** — typisierte Zustandsübergänge, Positionen als Slots, Bedeutung als Funktion von Nachbarschaft. Das interessiert zwei sehr verschiedene Gruppen gleichzeitig.

**Empfänger:**
- **Labyrinthos** — Tarot-Lern-App mit eigenem Deck und didaktischem Anspruch; eine formale Notation für Legesysteme ist genau ihr Lehrproblem.
- **Indie-Game-Devs** — Deckbuilder-Engines suchen Karten-als-Regel-Repräsentationen. Eine kleine DSL ist dort sofort nutzbar.
- **Deck-Künstler:innen auf Kickstarter** — brauchen digitale Begleiter, können aber nicht programmieren; eine offene Legesystem-DSL plus Renderer ist ein Geschenk an ein ganzes Milieu.
- **Lehre:** „Zustandsmaschinen für Leute, die keine Informatik machen" — Tarot ist ein didaktisch erstaunlich gutes Beispiel.

**Kanal:** Die DSL-Spezifikation (eine Seite JSON-Schema + zwei Beispiele) öffentlich stellen, in r/tarot und Indie-Dev-Kreise streuen. Die Spec ist das Geschenk, nicht die App.

**Hook:** „Ein Legesystem ist schon ein Programm — es wurde nur nie so aufgeschrieben. Positionen sind Slots, Karten sind typisierte Übergänge, die Animation fällt aus der Struktur heraus."

---

### Traumtagebuch mit Motiv-Karte — M · 🔨

**Wer profitiert:** Der Markt ist voll von Traum-Apps, die alles in die Cloud schicken und Deutung versprechen. Keine verspricht das Gegenteil: Einträge werden lokal embedded, wiederkehrende Motive als Cluster über die Zeit, **nichts verlässt das Gerät**. Das ist das Feature, und es ist ein Datenschutz-Argument, kein Marketing-Satz.

**Empfänger:**
- **Obsidian-Plugin-Ökosystem** — billigster Weg: kein eigenes Produkt bauen, sondern ein Plugin. Die Nutzerbasis ist bereits local-first sozialisiert.
- **Local-first-Szene** (Ink & Switch und Umfeld) — suchen überzeugende Endnutzer-Beispiele; „sensibelste denkbare Daten, trotzdem nützlich" ist eines.
- **Schlafforschung / Lucid-Dreaming-Community** — Motiv-Häufigkeiten über Zeit sind ein echtes Forschungsinteresse, das an Datenschutz scheitert.

**Kanal:** Als Obsidian-Plugin bauen, im Obsidian-Forum zeigen. Ohne Artefakt ist das nur eine weitere App-Idee.

**Hook:** „Jede Traum-App verspricht Deutung. Diese verspricht, dass die Träume das Gerät nicht verlassen — und liefert trotzdem die Motivkarte, weil Embeddings lokal laufen."

**Achtung:** Sensible Daten. Wenn du das verschenkst, verschenk die Privacy-Architektur mit, sonst baut jemand das Gegenteil unter deinem Namen.

---

### Echter Zufall als Service — S/Hardware · 🎁

**Wer profitiert:** Die TRNG-Hardware existiert bereits und ist bezahlbar; was fehlt, ist die Brücke ins Agenten-Zeitalter. Ein MCP-Server zwischen Rauschdiode und Modell sind dreißig Zeilen — und danach zieht jede Würfel-, Sigil- oder Kartenapp aus physikalischem Rauschen statt aus `Math.random()`.

**Empfänger:**
- **Infinite Noise TRNG** (`waywardgeek/infnoise`, vertrieben über leetronics in Deutschland, Crowd-Supply-Historie) — fertige, offene Hardware. Ein MCP-Wrapper erweitert ihre Reichweite, ohne ihnen Arbeit zu machen. **Mit Code ansprechen** (kleines Repo, das ihre Hardware nutzt).
- **Crowd-Supply-/Hackaday-Öffentlichkeit** — dort verteilt sich so etwas von selbst.
- **Kryptographie-Lehre** — „Entropie anfassen" ist ein gutes Praktikum.
- **Die eigenen Nachbarideen** — Tarot-DSL und Würfel-Toys sind die ersten Abnehmer. Ein Geschenk, das andere Geschenke bedient.

**Kanal:** MCP-Server bauen, in den Registries listen, im infnoise-Umfeld verlinken.

**Hook:** „Zwischen Rauschdiode und Agent fehlt genau ein Tool-Server. Danach würfelt jede App, die ihn nutzt, mit Physik."

---

## 5. Meta / Dev-Kultur

### Repo-Museum — M · 🎁 durch Bauen und Zeigen

**Wer profitiert:** Software-Visualisierung hat eine lange Geschichte (Gource als Film, CodeCity als Stadtmodell in der Forschung), aber **begehbar** ist sie nie geworden. Repo = Raum, Commits = Exponate, tote Branches = Keller ist eine Metapher, die sofort verstanden wird.

**Empfänger:**
- **Dev-Rel- und Konferenzstände** — ein begehbares Repo ist ein Messemagnet; Firmen zahlen für so etwas.
- **Onboarding in großen Teams** — „das ist unser Haus" ist ein besserer erster Tag als ein Architekturdiagramm.
- **Gource** (Andrew Caudwell) und die **Software-Visualisierungsforschung** (CodeCity-Linie) — die akademische Anschlussfähigkeit ist gegeben, ein Paper daraus realistisch.
- **GitHub** — hatten mit Skyline schon einmal einen 3D-Commit-Gimmick; der Nachfolger ist nicht besetzt.

**Kanal:** Eine Demo mit einem berühmten Repo (z. B. curl oder React) bauen und zeigen. Das verteilt sich selbst; danach kommen die Anfragen.

**Hook:** „Gource zeigt Geschichte als Film, an dem man nichts ändern kann. Niemand zeigt sie als Ort, durch den man läuft — und in dessen Keller die toten Branches liegen."

---

### Ghost Replay fürs Editieren — M · 🎁 an Forschung

**Wer profitiert:** Wir messen Commits und Tastenanschläge. Dazwischen liegen die vierzig Sekunden Scrollen, in denen die Entscheidung fällt — und die misst niemand. Das ist eine Forschungsfrage, verpackt als Trackmania-Gimmick.

**Empfänger:**
- **HCI-/Software-Engineering-Forschung** (CHI, VL/HCC, ICSE-Umfeld; in Deutschland u. a. Gruppen an TU/HPI mit Fokus Developer Experience) — „wie bewegen sich Entwickler:innen durch Code" ist eine offene, publizierbare Frage, und dein Ghost ist ein sofort verständliches Instrument. **Bester Empfängertyp für diese Idee: Forschung, weil du keinen Code mitliefern musst.**
- **WakaTime / Codealike und Nachfolger** — messen Zeit, nicht Bewegung. Naheliegende Produkterweiterung.
- **VS Code / JetBrains DevEx-Teams** — Firmen, ansprechbar über Feature-Discussions.
- **Bootcamps und Mentor:innen** — der Ghost zeigt den Rhythmus, den Code-Reviews nie sehen.

**Kanal:** Kurze Mail an ein bis zwei HCI-Gruppen mit dem Einseiter; parallel als Idee öffentlich, damit ein:e Studi sie als Projekt aufgreift.

**Hook:** „Wir messen Commits und Tastenanschläge. Die eigentliche Arbeit sind die vierzig Sekunden Scrollen davor — und dafür gibt es kein Instrument, obwohl die Daten in jedem Editor anfallen."

---

### Bugs → Spaced Repetition — S · 🔨

**Wer profitiert:** Postmortems werden geschrieben und nie wieder gelesen. Karteikarten schon. Symptom vorne, Root Cause hinten, automatisch aus dem Fix erzeugt — nach drei Monaten weißt du, welche Fehlerklasse dich wirklich kostet.

**Empfänger:**
- **Anki-Ökosystem** — als Add-on plus Git-Hook. Größte Nutzerbasis für Spaced Repetition, offene Add-on-Architektur.
- **Incident-/Postmortem-Tooling** (Sentry und Umfeld) — sie besitzen die Fehlerdaten und das Postmortem-Ritual, aber keinen Lernkreislauf danach. Firma, also ohne Code ansprechbar.
- **Bootcamps und Team-Leads** — „unsere Top-3-Fehlerklassen dieses Quartal" ist ein Onboarding-Material, das sonst niemand hat.

**Kanal:** Git-Hook + CLI bauen (ein Wochenende), Anki-Add-on hinterher, dann zeigen.

**Hook:** „Jeder gefixte Bug ist bereits eine Karteikarte: Symptom vorne, Root Cause hinten. Sie wird nur nie erzeugt — obwohl der Diff beides enthält."

---

## Reihenfolge, falls du diese Woche anfängst

| # | Aktion | Aufwand |
|---|---|---|
| 1 | **Altbau Thermal → co2online (EnergyMap Berlin)** — die Mail mit der höchsten Trefferwahrscheinlichkeit der ganzen Liste | 1 h |
| 2 | **Repo `amelie` anlegen**, CC0, 19 Issues mit Label `up-for-grabs` | 2 h |
| 3 | **Sperrmüll-Radar + Kiez-Lärmkarte → CityLAB Berlin**, eine Mail, zwei Einseiter | 1 h |
| 4 | **Spec-Drift Detector → spec-kit Discussion + Tessl** (die Idee streuen, während du sie selbst baust) | 1 h |
| 5 | **Pin Tumbler → SSDeV Ortsgruppe Berlin** — kein Pitch, ein Stammtischbesuch | 1 Abend |
| 6 | Vor dem 1. Oktober: die drei Prototype-Fund-tauglichen Einseiter fertig haben | 3 h |

---

## Statusliste

*Stand nach der Existenzprüfung vom September 2026. Alle Dosen liegen in `dosen/`.*

| Idee | Verdikt | Empfänger #1 | Status |
|---|---|---|---|
| Altbau Thermal | 🎁 | EnergyMap-Verbund / UdK Berlin | **gepackt**, neu gezielt — Mail-Entwürfe als Dateien, kein Gmail-Draft (Gmail-MCP blockiert, Developer-Preview-Freischaltung fehlt): `mails-q4-2026/mail-1-…` (UdK, #1), `mail-1b-co2online.md` und `mail-1c-verbraucherzentrale.md` (nachrangig; **Adressen offen**, von den Organisationsseiten zu kopieren). Team-Fokus 19.9.2026: alle Rollen arbeiten an dieser Dose |
| Sperrmüll-Radar | 🎁 | CityLAB Berlin | **gepackt** — Mail-Entwurf als Datei (`mail-2-citylab.md`), kein Gmail-Draft |
| Kiez-Lärmkarte | 🎁 | Noise-Planet / NoiseCapture | **gepackt** — Mail-Entwurf als Datei (`mail-3-noisecapture.md`, EN; zusätzlich in Mail 2), kein Gmail-Draft |
| Pin Tumbler | 🎁 | SSDeV Berlin | **gepackt**, verengt |
| Diffgeist | 🎁 | Andrew Nesbitt (Ecosyste.ms) | **gepackt** |
| Echter Zufall als Service | 🔨 | infnoise / leetronics | **gepackt** |
| Bugs → Spaced Repetition | 🔨 | Anki-Ökosystem | **gepackt** |
| Agent Postmortem Recorder | 🔨 | Claude-Code-Plugin-Community | **gepackt**, verengt |
| Räucher-Sim | 🎁 bauen | Web-Toy-Öffentlichkeit | **gepackt** |
| Kristallwachstum 3D | 🎁 | Nervous System | **gepackt**, stark verengt |
| Tarot als Zustandsmaschine | 🎁 Spec | Indie-Devs / Schema-Sammlungen | **gepackt**, verengt |
| Traumtagebuch | 🔨 | Obsidian-Plugin-Ökosystem | **gepackt**, verengt |
| Ghost Replay | 🎁 | HCI-Forschung | **gepackt**, verengt |
| Spec-Drift Detector | 🔒 + streuen | spec-kit / Tessl | **gepackt**, behalten |
| Wet Ink | 🔒 | Plan an Escape Motions u. a. | **gepackt**, behalten |
| Crack Flora Watcher | 🎁 | #Krautschau / Senckenberg | **gepackt**, stark verengt (Seek deckt die Grundidee bereits) |
| KlarLokal | 🎁 | Prototype Fund | **gepackt**, verengt (Zetteln existiert bereits, Zero-Cloud ist die Lücke) |
| Wärmesignatur | 🎁 | co2online (HeizCheck), nachrangig EnergyMap-Verbund | **gefunden** — Dose `waermesignatur.md` liegt vor (verengt, aus der Bisoziations-Runde zu Altbau Thermal); Empfängerprüfung und Zustellplan fehlen, kein Mail-Entwurf. Kommt hinzu, ob co2online nach Mail 1b nicht doppelt angeschrieben wird |
| Denkmal-Verlaufsblick | 🎁 | Deutsche Stiftung Denkmalschutz | **gefunden** — Dose `denkmal-verlaufsblick.md` liegt vor (verengt, Ideenrunde 4); Empfängerprüfung und Zustellplan fehlen, kein Mail-Entwurf |
| Lichtplan-Check | 🎁 | Landesumweltbehörden mit eigenem Leitfaden (z. B. Hamburg BUKEA) | **gefunden** — Dose vorhanden (Protokoll: `frei`, Runde 3); Empfängerprüfung und Zustellplan fehlen |
| Biotoptyp-Assistent | 🎁 | Ökologische Planungsbüros; nachrangig BfN/KIBI | **gefunden** — Dose vorhanden (Protokoll: `verengt`, Prüfen ab 03/2027); Empfängerprüfung und Zustellplan fehlen |
| Kartierlotse | – | Dose nennt keinen Empfänger | **gefunden** — Dose vorhanden (Protokoll: `verengt`); Empfänger und Verdikt noch festzulegen |
| Eichflächen-Trainer | – | Dose nennt keinen Empfänger | **gefunden** — Dose vorhanden (Protokoll: `frei`); Empfänger und Verdikt noch festzulegen |
| Feuerkugel-Sofortnetz | – | Dose nennt keinen Empfänger | **gefunden** — Dose vorhanden (Protokoll: zwei `verengt`-Teile: Sofort-Rekrutierung, Ambient-Rettung); Empfänger und Verdikt noch festzulegen |
| ~~git-archaeologist~~ | ❌ | — | **entsorgt** — mehrfach gebaut |
| ~~Home-Network MCP~~ | ❌ | — | **entsorgt** — ≥4 Fritzbox-MCPs |
| ~~Repo-Museum~~ | ❌ | — | **entsorgt** — bereits gebaut |
| ~~Commute Oracle~~ | ❌ | — | **entsorgt** — kommerziell besetzt |

**Bilanz:** 17 Dosen gepackt (davon 8 mit verengter Prämisse), 2 davon behalten, **4 entsorgt**. Dazu sieben Dosen aus Runde 3/4 mit Status `gefunden` (Wärmesignatur, Denkmal-Verlaufsblick, Lichtplan-Check, Biotoptyp-Assistent, Kartierlotse, Eichflächen-Trainer, Feuerkugel-Sofortnetz): Dose liegt vor, aber keine Empfängerprüfung durch das Sekretariat und kein Zustellplan. Diffgeist gilt laut Bibliothek inzwischen als `verengt`, nicht mehr `frei` (Aikido/Endor Labs), bleibt hier vorerst `gepackt`, bis entschieden ist, ob die Dose bleibt.

*Crack Flora Watcher und KlarLokal kamen am 18.9.2026 unfertig aus der `gemini changes`-Runde: keine Empfängerprüfung, erfundene E-Mail-Adressen, keine „Wer es schon versucht hat"-Sektion. Am selben Tag auf Vorlagen-Standard gebracht und nachrecherchiert (Seek bzw. Zetteln als bislang übersehene Konkurrenz gefunden, Prämisse entsprechend verengt). Empfängeradressen weiterhin bewusst nicht in Dose/Matrix — beim Zustellen von der Organisationsseite kopieren.*

Begründungen für die Entsorgungen und das Muster dahinter: `dosen/_entsorgt.md`.

---

## Quellen & Stand (September 2026)

Alle Empfänger sind geprüft, keine erfundenen Ansprechpartner. Persönliche Kontaktdaten stehen hier bewusst nicht drin — die holst du dir beim Absenden von der jeweiligen Seite.

- co2online / EnergyMap Berlin (KI-Wärmeplanung, 360.000 Gebäude, HeizCheck): [zfk.de](https://www.zfk.de/energie/waerme/ki-tool-berliner-koennen-bei-waermeplanung-mithelfen)
- Verbraucherzentrale Berlin, kostenfreier Gebäudecheck: [verbraucherzentrale-berlin.de](https://www.verbraucherzentrale-berlin.de/gebaeudecheck)
- Prototype Fund, Runde ab 01.10.2026: [prototypefund.de](https://www.prototypefund.de/blog/runde-12-startet) · Konditionen: [StartHub Hessen](https://www.starthub-hessen.de/de/services/navigator/prototype-fund-bewerbung-ab-01-oktober-2026-moglich/)
- CityLAB Berlin / Technologiestiftung, Sommerkonferenz 2026: [technologiestiftung-berlin.de](https://www.technologiestiftung-berlin.de/veranstaltungen/citylab-sommerkonferenz-2026) · GovTech TestLAB: [smart-city-berlin.de](https://smart-city-berlin.de/detail-news/govtech-testlab-testlabor-fuer-die-berliner-verwaltung)
- SSDeV, Ortsgruppe Berlin: [wiki.ssdev.org/wiki/Berlin](https://wiki.ssdev.org/wiki/Berlin) · [blog.ssdev.org](https://blog.ssdev.org/)
- NoiseCapture / Noise-Planet (Université Gustave Eiffel, CNRS): [noise-planet.org](https://noise-planet.org/noisecapture.html) · [GitHub](https://github.com/Universite-Gustave-Eiffel/NoiseCapture)
- Tessl, Spec-Driven Framework & Registry (Guy Podjarny): [tessl.io](https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry)
- GitHub Spec Kit: [github.com/github/spec-kit](https://github.com/github/spec-kit)
- GitLens / GitKraken (Eric Amodio): [github.com/gitkraken/vscode-gitlens](https://github.com/gitkraken/vscode-gitlens)
- Ecosyste.ms / Andrew Nesbitt, FOSDEM 2026: [nesbitt.io](https://nesbitt.io/) · [fosdem.org](https://fosdem.org/2026/schedule/speaker/andrew_nesbitt/)
- Home Assistant MCP-Integrationen: [home-assistant.io/integrations/mcp](https://www.home-assistant.io/integrations/mcp/) · [mcp_server](https://www.home-assistant.io/integrations/mcp_server/)
- Rebelle / Escape Motions (8.3, August 2026): [cgchannel.com](https://www.cgchannel.com/2026/08/escape-motions-releases-rebelle-8/) · [escapemotions.com](https://www.escapemotions.com/products/rebelle/about)
- Nervous System (Rosenkrantz & Louis-Rosenberg, seit 2007): [n-e-r-v-o-u-s.com](https://n-e-r-v-o-u-s.com/about_us.php)
- ÖPNV-Berlin-Ökosystem (`derhuerst`): [vbb-rest](https://github.com/derhuerst/vbb-rest) · [vbb-gtfs](https://github.com/derhuerst/vbb-gtfs)
- Infinite Noise TRNG (waywardgeek / leetronics): [GitHub](https://github.com/waywardgeek/infnoise) · [Crowd Supply](https://www.crowdsupply.com/leetronics/infinite-noise-trng)
- Gource (Andrew Caudwell): [gource.io](https://gource.io/) · CodeCity (Wettel): [ACM](https://dl.acm.org/doi/10.1145/1370175.1370188)
- MCP-Registries, Übersicht zum Listing: [Leitfaden](https://tallyfy.com/how-to-list-mcp-server-registry-smithery-glama-pulsemcp/)
- Claude-Code-Hook-Observability, Beispielprojekt: [claude-code-multi-agent-observability](https://github.com/kcwoodfield/claude-code-multi-agent-observability)
- Labyrinthos Tarot: [App Store](https://apps.apple.com/us/app/labyrinthos-tarot-reading/id1155180220)

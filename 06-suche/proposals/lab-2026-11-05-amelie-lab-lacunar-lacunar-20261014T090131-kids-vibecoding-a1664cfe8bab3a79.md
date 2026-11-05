# Proposals from plan lab-2026-11-05-amelie-lab-lacunar-lacunar-20261014T090131-kids-vibecoding-a1664cfe8bab3a79

Packet: amelie-lab-lacunar-lacunar-20261014T090131-kids-vibecoding-a1664cfe8bab3a79 · Candidate: amelie-lab-lacunar-lacunar-20261014T090131-kids-vibecoding-a1664cfe8bab3a79
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] lacunar: amelie-lab-lacunar-lacunar-20261014T090131-kids-vibecoding-a1664cfe8bab3a79. Absicht: Kindern Programmieren beibringen über Gaming und Vibecoding. Modell: claude-subagent-manual (stand-in, Vertex unavailable). Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Originalfeld accounting, Teil 1 (laut gespeicherter Datei):
{
  "cost_usd": 0.0,
  "model_calls": 0,
  "search_calls": 6,
  "search_queries": 6
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld contract_version, Teil 1 (laut gespeicherter Datei):
"1.2.0"
- [06-suche/amelie-lab-protokoll.md] Originalfeld created_at, Teil 1 (laut gespeicherter Datei):
"2026-10-14T09:01:31Z"
- [06-suche/amelie-lab-protokoll.md] Originalfeld frames, Teil 1 (laut gespeicherter Datei):
{
  "candidates": [
    {
      "check_queries": [
        "AI coding tool for kids that builds a game one small piece at a time, each part must work before the next prompt"
      ],
      "friction_point": "F1",
      "id": "C1",
      "idea": "Trockenmauer-Modus für KI-Spielbaukästen: Ein Prompt darf nur einen 'Stein' erzeugen (eine Mechanik); er wird erst gesetzt, wenn er im Spiel für sich allein sichtbar funktioniert, sonst wird er gedreht (umformuliert) oder verworfen.",
      "typical_probability": 0.06
    },
    {
      "check_queries": [
        "programming environment for children that requires naming existing parts before generating new code"
      ],
      "friction_point": "F1",
      "id": "C2",
      "idea": "Fugenversatz-Regel: Ein neuer Prompt darf nur Code erzeugen, der auf mindestens zwei Teilen aufbaut, die das Kind vorher selbst benannt hat.",
      "typical_probability": 0.03
    },
    {
      "check_queries": [
        "tool removes or breaks one function in a student's game to show what depends on it, teaching program decomposition"
      ],
      "friction_point": "F2",
      "id": "C3",
      "idea": "Stein-herausnehmen-Probe: Die KI entfernt auf Wunsch genau eine Funktion aus dem Spiel des Kindes und zeigt, was 'nachrutscht' (welche Spielteile ausfallen), damit das Kind die tragenden Teile erkennt.",
      "typical_probability": 0.05
    },
    {
      "check_queries": [
        "children sort game components by role before generating code with AI decomposition activity"
      ],
      "friction_point": "F6",
      "id": "C4",
      "idea": "Steine-Sortieren vor dem Bauen: Die KI schüttet alle Bausteine eines gewünschten Spiels unsortiert aus; das Kind sortiert sie zuerst nach Rolle (Fundament, Verbinder, Füllung, Abschluss), erst dann wird gepromptet.",
      "typical_probability": 0.04
    },
    {
      "check_queries": [
        "teaching interfaces between game components to kids with AI code generation"
      ],
      "friction_point": "F1",
      "id": "C5",
      "idea": "Durchbinder-Prompts: Eigene Prompt-Art, die nur Verbindungen zwischen zwei bestehenden Spielteilen (z. B. Grafik und Spielregel) erzeugen darf.",
      "typical_probability": 0.07
    },
    {
      "check_queries": [
        "AI checks generated game code against a child's paper sketch"
      ],
      "friction_point": "F4",
      "id": "C6",
      "idea": "Profillehre aus Papier: Das Kind zeichnet eine Spielskizze, die KI nutzt sie als Lehre und meldet bei jedem generierten Teil, wo es von der Skizze abweicht.",
      "typical_probability": 0.06
    },
    {
      "check_queries": [
        "students reverse engineer program into the prompts that generated it \"prompt problems\" novice programming exercise"
      ],
      "friction_point": "F4",
      "id": "C7",
      "idea": "Lagenweiser Rückbau: Das Kind bekommt ein fertiges kleines Spiel und muss es in die Reihenfolge von Prompts zurückzerlegen, aus der es Lage für Lage wieder entstehen würde; die KI baut nach den Prompts des Kindes nach und vergleicht.",
      "typical_probability": 0.05
    },
    {
      "check_queries": [
        "collaborative classroom game where each student adds one mechanic with AI"
      ],
      "friction_point": "F5",
      "id": "C8",
      "idea": "Gemeinschaftsmauer: Eine Klasse baut ein gemeinsames Spiel, jedes Kind setzt genau einen Stein (eine Mechanik), und ein lockerer Stein ist für alle sichtbar.",
      "typical_probability": 0.08
    },
    {
      "check_queries": [
        "fill in the missing parts of a game exercise kids programming AI"
      ],
      "friction_point": "F6",
      "id": "C9",
      "idea": "Reparaturmodus: Das Kind bekommt ein KI-Spiel mit herausgefallenen Steinen (Lücken) und darf nur diese Lücken prompten oder schreiben.",
      "typical_probability": 0.06
    },
    {
      "check_queries": [
        "AI coding for kids limits prompt size budget to encourage decomposition"
      ],
      "friction_point": "F3",
      "id": "C10",
      "idea": "Tragekraft-Budget: Jeder Prompt kostet Tragekraft nach Größe des erzeugten Codes; große Ganz-Spiel-Prompts sind schwer, kleine präzise billig, das Budget pro Runde ist begrenzt.",
      "typical_probability": 0.04
    },
    {
      "check_queries": [
        "AI coding tool asks child where generated code belongs before inserting it"
      ],
      "friction_point": "F2",
      "id": "C11",
      "idea": "Einmal-in-die-Hand-nehmen: Vor dem Einsetzen jedes generierten Blocks beantwortet das Kind eine einzige Frage der KI, wohin er gehört; ohne Antwort wird er nicht gesetzt.",
      "typical_probability": 0.07
    },
    {
      "check_queries": [
        "sonification of untested code for children"
      ],
      "friction_point": "F2",
      "id": "C12",
      "idea": "Klopfprobe: Beim Spielen klingt jede ungetestete Funktion hohl (eigener Ton), getestete klingen satt, damit lockere Teile hörbar werden.",
      "typical_probability": 0.03
    },
    {
      "check_queries": [
        "parents view structure of child's AI-made game as learning evidence"
      ],
      "friction_point": "F4",
      "id": "C13",
      "idea": "Mauerschau statt Spielschau: Eltern sehen nicht das fertige Spiel, sondern den Lagenaufbau (welche Teile das Kind gesetzt hat) als Lernbeleg.",
      "typical_probability": 0.08
    },
    {
      "check_queries": [
        "kids must write final part of AI generated game by hand"
      ],
      "friction_point": "F6",
      "id": "C14",
      "idea": "Deckstein-Ritual: Ein Spiel gilt erst als fertig, wenn das Kind den letzten Stein (eine kleine Funktion) ohne KI selbst schreibt.",
      "typical_probability": 0.05
    }
  ],
  "contract_version": "1.0.0",
  "distance": 4,
  "frame_a": {
    "friction": "Lernende nutzten den Generator in 74 % der Aufgabenversuche; 61 % davon mit einem einzigen Prompt, nur 8 % zerlegten die Aufgabe in mehrere Prompts. Die Forschenden nennen Übernutzung und das Risiko, dass Lernende den ausgegebenen Code nicht verstehen; ohne Startercode machte die Generator-Gruppe deutlich mehr Fehler.",
    "name": "Raspberry Pi Foundation: KI-Codegenerator mit Programmieranfängern im Schulalter (Studien mit 10-17-Jährigen)",
    "slots": {
      "constraints": "Ohne Startercode machte die Generator-Gruppe deutlich mehr Fehler; Verständnis der Ausgabe wird nicht sichtbar geprüft.",
      "emotions": "Erfolgserlebnis durch mehr gelöste Aufgaben; Sorge der Forschenden vor Übernutzung und Nicht-Verstehen.",
      "goals": "Schneller zu funktionierendem Code kommen und dabei trotzdem Programmieren lernen.",
      "materials": "KI-Codegenerator (Codex), Python-Aufgaben, Startercode, Prompts der Lernenden, 69 bzw. 33 Lernende im Alter von 10-17 Jahren.",
      "mechanics": "Kind formuliert eine Aufgabe als Prompt, übernimmt die Ausgabe; in 61 % der Fälle ein einziger Prompt, nur 8 % zerlegen die Aufgabe in mehrere Prompts.",
      "rituals_timing": "Sofortige Ausgabe pro Prompt; Kurssitzungen, Nachtest nach einer Woche."
    },
    "source_label": "Type C: public AI trial with named limits",
    "source_url": "https://www.raspberrypi.org/blog/using-an-ai-code-generator-with-school-age-beginner-programmers/"
  },
  "frame_b": {
    "domain": "Handwerk / Landschaftsbau",
    "name": "Trockenmauerbau (mörtelloses Mauern aus Feldsteinen)",
    "slots": {
      "constraints": "Kein Kleber verdeckt Fehler; Lastpfad ist sichtbar; Steine sind reichlich da, aber jede Platzierung kostet Handgriff und Zeit.",
      "emotions": "Geduld, Befriedigung beim satten Sitz eines Steins, sichtbarer Ärger bei Ausbauchung oder Einsturz.",
      "goals": "Eine Mauer, die ohne Bindemittel Jahrzehnte steht, weil jedes Teil seinen Platz trägt.",
      "materials": "Lose Feldsteine ohne Mörtel, sortiert nach Rolle: Fundamentsteine, Durchbinder, Füllsteine (Hearting), Decksteine; Schnur und Profillehre.",
      "mechanics": "Jeder Stein wird einzeln gesetzt und muss durch Lage und Gewicht allein halten; Fugen werden versetzt (einer auf zwei, zwei auf einem); wackelt ein Stein, wird er gedreht oder ersetzt.",
      "rituals_timing": "Lage für Lage; zuerst Abräumen und Sortieren der Steine; Lehrling setzt Füllsteine, bevor er Ecksteine setzen darf; Reparatur durch lagenweisen Rückbau."
    }
  },
  "friction_points": [
    "F1: Ein Prompt verklebt das ganze Spiel wie Mörtel; in der Trockenmauer gibt es keinen Mörtel, jeder Stein muss für sich halten.",
    "F2: Im Vibecoding scheitert schlechter Code still (das Spiel läuft halbwegs); in der Trockenmauer wird ein lockerer Stein sichtbar und hörbar.",
    "F3: Beim Codegenerator ist Code überreichlich und die Platzierung kostenlos; beim Waller sind Steine reichlich, aber jede Platzierung ist der knappe Handgriff.",
    "F4: Das Spiel erscheint als Ganzes ohne Bauabfolge; eine Mauer zeigt ihre Lagen und kann lagenweise zurückgebaut werden.",
    "F5: Das Kind arbeitet allein vor dem Bildschirm; der Lehrling arbeitet neben dem Waller und bekommt Rollen (erst Füllsteine, dann Ecksteine).",
    "F6: Die KI ersetzt den Experten ganz; im Handwerk wird der Lehrling durch Sortieren und Teilaufgaben an die Expertise herangeführt."
  ],
  "personas": [
    {
      "who": "Mia, 11, Leipzig, baut am Familientablet mit einem KI-Spielbaukasten ein Jump'n'Run.",
      "would_do": "Sie würde ihr Spiel Stein für Stein setzen lassen und sofort sehen, welcher Teil wackelt, statt nach einem Riesenprompt nicht zu wissen, warum der Sprung kaputt ist."
    },
    {
      "who": "Herr Okonkwo, Informatiklehrer an einer Gesamtschule, leitet eine Spiele-AG mit 14 Kindern.",
      "would_do": "Er kann nicht 14 KI-Spiele debuggen; er würde die Kinder einen Stein herausnehmen lassen, damit sie selbst sehen, was darauf ruht."
    },
    {
      "who": "Jens, Elektriker, programmiert selbst nicht, sitzt abends neben seinem neunjährigen Sohn.",
      "would_do": "Er würde mit seinem Sohn ein fertiges Spiel lagenweise abtragen und über die Reihenfolge reden, ohne selbst Code lesen zu müssen."
    }
  ],
  "shortlist": [
    "C1",
    "C7",
    "C3",
    "C9",
    "C14"
  ]
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld intent, Teil 1 (laut gespeicherter Datei):
"Kindern Programmieren beibringen über Gaming und Vibecoding"
- [06-suche/amelie-lab-protokoll.md] Originalfeld log_entry, Teil 1 (laut gespeicherter Datei):
"<!-- proposed by the Lab's Lacunar agent, run lacunar-20261014T090131-kids-vibecoding; nothing was written to Amélie -->\n| 14.10.2026 | Raspberry Pi Foundation: KI-Codegenerator mit 10-17-jährigen Anfängern (61 % Ein-Prompt, 8 % Zerlegung) | Trockenmauerbau | 4 | 14 | 3: 1. Trockenmauer-Modus für KI-Spielbaukästen: Ein Prompt darf nur einen 'Stein' erzeugen (eine Mechanik); er wird erst gesetzt, wenn er im Spiel für sich allein sichtbar funktioniert, sonst wird er gedreht (umformuliert) oder verworfen. (combinational); 2. Stein-herausnehmen-Probe: Die KI entfernt auf Wunsch genau eine Funktion aus dem Spiel des Kindes und zeigt, was 'nachrutscht' (welche Spielteile ausfallen), damit das Kind die tragenden Teile erkennt. (combinational); 3. Lagenweiser Rückbau: Das Kind bekommt ein fertiges kleines Spiel und muss es in die Reihenfolge von Prompts zurückzerlegen, aus der es Lage für Lage wieder entstehen würde; die KI baut nach den Prompts des Kindes nach und vergleicht. (combinational) | Kinder, die Spiele mit KI erzeugen, schicken meist einen einzigen großen Auftrag ab und bekommen nie zu sehen, welcher einzelne Teil ihres Spiels für sich trägt und welcher nicht. | — (not checked yet) |\n\n### Lacunar run lacunar-20261014T090131-kids-vibecoding — 14.10.2026 (intent: Kindern Programmieren beibringen über Gaming und Vibecoding)\n- **Learned:** Ein Anker mit Zahlen (61 % Ein-Prompt, 8 % Zerlegung) macht die Reibung scharf; der mörtellose Collider trifft genau den Unterschied zwischen Ein-Prompt-Ganzem und tragenden Einzelteilen.\n- **Mistake:** Die Trockenmauer-Mechanik stammt aus Modellwissen, nicht aus einer Quelle; C9 und C14 wurden ohne Suche getötet. Amélie-Zustand (Log, Playbook) fehlte, Topic- und Memory-Check liefen nicht.\n- **Next time:** Einen deutschen Schul-Anker suchen (Evaluationsbericht eines Landesinstituts zu KI im Informatikunterricht) und den Collider-Mechanismus mit einer Quelle belegen.\n- **Prior-art leads (automatic search, for the existence check; not a verdict):**\n  - C1 (ok): AI coding tool for kids that builds a game one small piece at a time, each part must work before the next prompt -> https://university.forwardfuture.ai/skills/video-games, https://lab.rosebud.ai/blog/tips-for-teaching-programming-to-kids-with-ai-assistance, https://university.forwardfuture.ai/lessons/lesson-2-jippity-overview, https://lab.rosebud.ai/coding-for-kids\n  - C7 (ok): students reverse engineer program into the prompts that generated it \"prompt problems\" novice programming exercise -> https://arxiv.org/abs/2401.10759, https://arxiv.org/html/2410.03063v1, https://warwick.ac.uk/fac/cross_fac/eduport/edufund/projects/yang/projects/promptly-using-prompt-problems-to-teach-learners-how-to-effectively-utilize-ai-code-generators/, https://arxiv.org/abs/2607.05034\n  - C3 (ok): tool removes or breaks one function in a student's game to show what depends on it, teaching program decomposition -> https://ieeexplore.ieee.org/document/8166695, https://ken.ieice.org/ken/paper/20100304ZaVI/eng/, https://digitalcommons.calpoly.edu/theses/1759, https://icer2026.acm.org/details/icer-2026-papers/13/Planning-on-Paper-Problem-Decomposition-with-Diagrams-in-Introductory-Computing\n"
- [06-suche/amelie-lab-protokoll.md] Originalfeld model, Teil 1 (laut gespeicherter Datei):
"claude-subagent-manual (stand-in, Vertex unavailable)"
- [06-suche/amelie-lab-protokoll.md] Originalfeld plan, Teil 1 (laut gespeicherter Datei):
{
  "anchor_queries": [
    "study children novice programmers using AI code generators do not understand generated code classroom limits",
    "Erfahrungsbericht Schule KI Programmieren Kinder Spiele Grenzen Lehrkräfte Pilotprojekt"
  ],
  "area": "Kinder (ca. 8-14) lernen Programmieren, indem sie Spiele bauen, zunehmend per Vibecoding (Spiel in natürlicher Sprache beschreiben, KI erzeugt den Code).",
  "collider_hint": "Ein langsames, mörtelloses Handwerk, in dem jedes Teil für sich halten muss (z. B. Trockenmauerbau), als Gegenpol zum Ein-Prompt-Ganzen.",
  "contract_version": "1.0.0",
  "mode_list": [
    "Scratch-ähnliche Blockprogrammierung mit fertigen Spielvorlagen.",
    "Programmierkurse in Minecraft Education oder Roblox Studio.",
    "KI-Tutor-Chatbot, der Kindern ihren Code erklärt.",
    "Vibecoding-Plattform für Kinder: Spiel per Prompt beschreiben, KI generiert ein spielbares Spiel.",
    "Gamifizierte Lernpfade mit Abzeichen, Levels und Bestenlisten.",
    "Programmierbare Roboter (LEGO, micro:bit) mit KI-Assistent.",
    "Kindgerechter Code-Copilot mit Sicherheits- und Inhaltsfiltern.",
    "Game Jams und Coding-Wettbewerbe für Kinder.",
    "Eltern-Dashboard, das den Lernfortschritt des Kindes zeigt.",
    "Unterrichtsmaterial für Lehrkräfte zum Programmieren mit KI.",
    "Modding-Kurse für bestehende Spiele.",
    "Prompt-Engineering-Kurs für Kinder."
  ],
  "notes": "Manuelle Stellvertreter-Ausführung (Vertex nicht verfügbar). Amélie-Zustand fehlt (Bisoziations-Log und Suchplaybook nicht gefunden): keine bereits versuchten Paare, kein 'next time', keine dichten Felder bekannt. Topic-Check (bib find) nicht möglich."
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld prior_art, Teil 1 (laut gespeicherter Datei):
[
  {
    "answer": "Kein Werkzeug gefunden, das den nächsten Prompt sperrt, bis das aktuelle Teil funktioniert. Verwandt: Jippity (Forward Future) baut Spiele in Lektionsstufen; Rosebud AI GameMaker erzeugt aus einer Beschreibung ein spielbares Spiel und rät im Blog zu Schritt-für-Schritt-Prompting ('break your instructions down into smaller steps'); Summer-Engine-Elternratgeber empfiehlt 'eine Sache ändern, wieder spielen'. Hinweise, kein Urteil.",
    "candidate_id": "C1",
    "pages": [
      "https://university.forwardfuture.ai/skills/video-games",
      "https://lab.rosebud.ai/blog/tips-for-teaching-programming-to-kids-with-ai-assistance",
      "https://university.forwardfuture.ai/lessons/lesson-2-jippity-overview",
      "https://lab.rosebud.ai/coding-for-kids",
      "https://www.summerengine.com/blog/make-a-game-with-ai-for-kids",
      "https://dev.to/madebydia/the-parent-developers-guide-to-building-games-with-ai-4nb9",
      "https://www.indiehackers.com/post/teaching-kids-how-to-develop-games-with-ai-3a896250f6"
    ],
    "question": "AI coding tool for kids that builds a game one small piece at a time, each part must work before the next prompt",
    "status": "ok"
  },
  {
    "answer": "Etablierte Übungsform 'Prompt Problems' (CHI 2024, Tool Promptly, University of Auckland): Lernende sehen eine Ein-/Ausgabe-Aufgabe und schreiben einen Prompt, dessen Code die Tests bestehen muss; verwandt 'Explain in Plain English'. Untersucht an Studierenden (Hochschule), Einzelaufgaben, nicht an Kindern und ganzen Spielen. Hinweise, kein Urteil.",
    "candidate_id": "C7",
    "pages": [
      "https://arxiv.org/abs/2401.10759",
      "https://arxiv.org/html/2410.03063v1",
      "https://warwick.ac.uk/fac/cross_fac/eduport/edufund/projects/yang/projects/promptly-using-prompt-problems-to-teach-learners-how-to-effectively-utilize-ai-code-generators/",
      "https://arxiv.org/abs/2607.05034"
    ],
    "question": "students reverse engineer program into the prompts that generated it \"prompt problems\" novice programming exercise",
    "status": "ok"
  },
  {
    "answer": "Kein Werkzeug gefunden, das gezielt eine Funktion aus dem Spiel eines Kindes entfernt und zeigt, was davon abhängt. Verwandt: IDE-Plugin (IEEE 2017), das abhängige Module zu einer Änderung hervorhebt (für Studierende im 2. Jahr); Abhängigkeitsanalyse-Tool aus Japan; Earthworm (Cal Poly 2017); ICER-2026-Studie zu Zerlegungsdiagrammen für ein Spiel. Hinweise, kein Urteil.",
    "candidate_id": "C3",
    "pages": [
      "https://ieeexplore.ieee.org/document/8166695",
      "https://ken.ieice.org/ken/paper/20100304ZaVI/eng/",
      "https://digitalcommons.calpoly.edu/theses/1759",
      "https://icer2026.acm.org/details/icer-2026-papers/13/Planning-on-Paper-Problem-Decomposition-with-Diagrams-in-Introductory-Computing"
    ],
    "question": "tool removes or breaks one function in a student's game to show what depends on it, teaching program decomposition",
    "status": "ok"
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld result, Teil 1 (laut gespeicherter Datei):
{
  "contract_version": "1.1.0",
  "kills": [
    {
      "candidate_id": "C9",
      "failed_checks": [
        "in_mode_or_dense",
        "why_now"
      ],
      "reason": "Lückentext-/Ergänzungsaufgaben mit Startercode sind gängige Programmierdidaktik; die Idee braucht keine neue KI-Fähigkeit. Nicht per Suche geprüft (Prior-Art-Budget aufgebraucht)."
    },
    {
      "candidate_id": "C14",
      "failed_checks": [
        "problem_evidence",
        "why_now"
      ],
      "reason": "Keine Quelle für das Problem in dieser Form und kein Grund, warum es erst jetzt möglich ist; ein Ritual ohne KI-Mechanik."
    }
  ],
  "log_row": {
    "anchor": "Raspberry Pi Foundation: KI-Codegenerator mit 10-17-jährigen Anfängern (61 % Ein-Prompt, 8 % Zerlegung)",
    "best_gap": "Kinder, die Spiele mit KI erzeugen, schicken meist einen einzigen großen Auftrag ab und bekommen nie zu sehen, welcher einzelne Teil ihres Spiels für sich trägt und welcher nicht.",
    "candidates": 14,
    "collider": "Trockenmauerbau",
    "distance": 4,
    "survivors": 3
  },
  "retro": {
    "learned": "Ein Anker mit Zahlen (61 % Ein-Prompt, 8 % Zerlegung) macht die Reibung scharf; der mörtellose Collider trifft genau den Unterschied zwischen Ein-Prompt-Ganzem und tragenden Einzelteilen.",
    "mistake": "Die Trockenmauer-Mechanik stammt aus Modellwissen, nicht aus einer Quelle; C9 und C14 wurden ohne Suche getötet. Amélie-Zustand (Log, Playbook) fehlte, Topic- und Memory-Check liefen nicht.",
    "next_time": "Einen deutschen Schul-Anker suchen (Evaluationsbericht eines Landesinstituts zu KI im Informatikunterricht) und den Collider-Mechanismus mit einer Quelle belegen."
  },
  "survivors": [
    {
      "boden_type": "combinational",
      "buildable": "Ja, als Regel/Gate über bestehenden Codegeneratoren (Prompt-Größe begrenzen, Teil isoliert ausführen). Lead: Rosebud empfiehlt Schritt-für-Schritt-Prompting nur als Tipp; ein erzwingendes Gate wurde in der Suche nicht gesehen.",
      "candidate_id": "C1",
      "collider_mechanism": "Ohne Mörtel muss jeder Stein durch Lage und Gewicht allein halten, bevor der nächste gesetzt wird; ein wackelnder Stein wird gedreht oder ersetzt statt überbaut. Genau diese Setz-Prüf-Drehen-Schleife wird zur Pflicht pro Prompt.",
      "evidence_urls": [
        "https://www.raspberrypi.org/blog/using-an-ai-code-generator-with-school-age-beginner-programmers/",
        "https://lab.rosebud.ai/blog/tips-for-teaching-programming-to-kids-with-ai-assistance"
      ],
      "gap": "Kinder, die Spiele mit KI erzeugen, schicken meist einen einzigen großen Auftrag ab und bekommen nie zu sehen, welcher einzelne Teil ihres Spiels für sich trägt und welcher nicht.",
      "gap_stands_alone": true,
      "idea": "Trockenmauer-Modus für KI-Spielbaukästen: Ein Prompt darf nur einen 'Stein' erzeugen (eine Mechanik); er wird erst gesetzt, wenn er im Spiel für sich allein sichtbar funktioniert, sonst wird er gedreht (umformuliert) oder verworfen.",
      "rank": 1,
      "removed_assumption": "Dass ein KI-Spielbaukasten immer das ganze gewünschte Ergebnis auf einmal liefern soll.",
      "who_has_problem": "Schulkinder von 10-17 Jahren, die mit KI-Codegeneratoren lernen: 61 % der Generator-Nutzungen waren Ein-Prompt-Lösungen, nur 8 % zerlegten (Raspberry Pi Foundation, Studie mit 33 Lernenden).",
      "why_now": "Kinderplattformen erzeugen heute aus einer Beschreibung ein spielbares Spiel in Sekunden (z. B. Rosebud, Jippity); vor fünf Jahren gab es kein Ein-Prompt-Ganzes, gegen das man Zerlegung durchsetzen müsste."
    },
    {
      "boden_type": "combinational",
      "buildable": "Ja, mit statischer Analyse plus LLM-Erklärung im Spielbaukasten. Lead: IDE-Plugin für Studierende hebt abhängige Module hervor; für Kinderspiele wurde nichts gesehen.",
      "candidate_id": "C3",
      "collider_mechanism": "In einer Trockenmauer verdeckt kein Mörtel den Lastpfad: nimmt man einen Stein heraus, rutschen genau die Steine nach, die auf ihm ruhten. Das Herausnehmen als Prüfmethode macht die Tragstruktur sichtbar.",
      "evidence_urls": [
        "https://www.raspberrypi.org/blog/using-an-ai-code-generator-with-school-age-beginner-programmers/",
        "https://ieeexplore.ieee.org/document/8166695"
      ],
      "gap": "Ein Kind, dessen Spiel aus fremdem Code besteht, hat keine Möglichkeit zu erfahren, welche Teile andere Teile tragen, solange alles irgendwie läuft.",
      "gap_stands_alone": true,
      "idea": "Stein-herausnehmen-Probe: Die KI entfernt auf Wunsch genau eine Funktion aus dem Spiel des Kindes und zeigt, was 'nachrutscht' (welche Spielteile ausfallen), damit das Kind die tragenden Teile erkennt.",
      "rank": 2,
      "removed_assumption": "Dass Abhängigkeiten im Code durch Lesen oder Diagramme gelernt werden müssen statt durch gezieltes Herausnehmen.",
      "who_has_problem": "Junge Lernende, bei denen die Forschenden befürchten, dass sie den ausgegebenen Code nicht verstehen (Raspberry Pi Foundation); bestehende Abhängigkeits-Werkzeuge richten sich an Studierende (IEEE 2017).",
      "why_now": "Ein Sprachmodell kann heute im Code eines Kindes eine Funktion sauber entfernen und in Kindersprache erklären, welche Spielteile dadurch ausfallen; Abhängigkeitsgraphen für Laien gab es so nicht."
    },
    {
      "boden_type": "combinational",
      "buildable": "Ja. Lead: 'Prompt Problems'/Promptly ist eine verwandte, etablierte Übungsform (Einzelaufgaben, Hochschule, Prompt vorwärts aus Ein-/Ausgabe); lagenweises Zerlegen ganzer Spiele für Kinder wurde nicht gesehen. Abgrenzung durch Amélie nötig.",
      "candidate_id": "C7",
      "collider_mechanism": "Beim Reparieren räumt der Waller eine Mauer lagenweise ab und legt die Steine in Lagenreihenfolge aus, um sie umgekehrt wieder zu setzen; die Abbauordnung ist der Bauplan.",
      "evidence_urls": [
        "https://www.raspberrypi.org/blog/using-an-ai-code-generator-with-school-age-beginner-programmers/",
        "https://arxiv.org/abs/2401.10759"
      ],
      "gap": "Kinder sehen ein fertiges Spiel immer nur als Ganzes und nie als Reihenfolge von Teilen, in der es entstanden sein könnte.",
      "gap_stands_alone": true,
      "idea": "Lagenweiser Rückbau: Das Kind bekommt ein fertiges kleines Spiel und muss es in die Reihenfolge von Prompts zurückzerlegen, aus der es Lage für Lage wieder entstehen würde; die KI baut nach den Prompts des Kindes nach und vergleicht.",
      "rank": 3,
      "removed_assumption": "Dass Lernen mit KI nur vorwärts läuft (Prompt rein, Code raus) und nicht rückwärts vom Ergebnis zur Bauabfolge.",
      "who_has_problem": "Lernende, die selten zerlegen (nur 8 % mehrere Prompts, Raspberry Pi Foundation); auch Studierende schreiben anfangs zu vage Prompts (Prompt Problems, arXiv 2401.10759).",
      "why_now": "Ein LLM kann aus der Prompt-Folge eines Kindes das Spiel nachbauen und mit dem Original vergleichen; das Rückwärts-Zerlegen wird damit prüfbar."
    }
  ]
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld run_id, Teil 1 (laut gespeicherter Datei):
"lacunar-20261014T090131-kids-vibecoding"
- [06-suche/amelie-lab-protokoll.md] Originalfeld state_missing, Teil 1 (laut gespeicherter Datei):
[
  "06-suche/amelie-bisoziation-log.md",
  "06-suche/amelie-suchplaybook.md"
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld tool_calls, Teil 1 (laut gespeicherter Datei):
[
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t01",
    "status": "ok",
    "summary": "study children novice programmers using AI code generators do not understand generated code classroom limits",
    "tool": "search"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t02",
    "status": "ok",
    "summary": "Erfahrungsbericht Schule KI Programmieren Kinder Spiele Grenzen Lehrkräfte Pilotprojekt",
    "tool": "search"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t03",
    "status": "ok",
    "summary": "Anker-Seite raspberrypi.org abgerufen: '61% involved a single prompt while only 8% involved decomposition' bestätigt",
    "tool": "verify_quote"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t04",
    "status": "ok",
    "summary": "AI coding tool for kids that builds a game one small piece at a time, each part must work before the next prompt",
    "tool": "search"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t05",
    "status": "ok",
    "summary": "students reverse engineer program into the prompts that generated it \"prompt problems\" novice programming exercise",
    "tool": "search"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t06",
    "status": "ok",
    "summary": "tool removes or breaks one function in a student's game to show what depends on it, teaching program decomposition",
    "tool": "search"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t07",
    "status": "ok",
    "summary": "parents worry kids vibe coding games with AI are not actually learning to program",
    "tool": "search"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t08",
    "status": "error",
    "summary": "rosebud.ai Blog: 307-Weiterleitung, nicht abgerufen",
    "tool": "verify_quote"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t09",
    "status": "ok",
    "summary": "lab.rosebud.ai Blog: 'break your instructions down into smaller steps' bestätigt",
    "tool": "verify_quote"
  },
  {
    "call_id": "lacunar-20261014T090131-kids-vibecoding-t10",
    "status": "ok",
    "summary": "arxiv.org/abs/2401.10759: Abstract-Ausschnitte bestätigt",
    "tool": "verify_quote"
  }
]

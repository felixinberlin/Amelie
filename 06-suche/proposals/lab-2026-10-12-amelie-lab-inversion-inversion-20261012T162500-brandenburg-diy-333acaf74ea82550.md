# Proposals from plan lab-2026-10-12-amelie-lab-inversion-inversion-20261012T162500-brandenburg-diy-333acaf74ea82550

Packet: amelie-lab-inversion-inversion-20261012T162500-brandenburg-diy-333acaf74ea82550 · Candidate: amelie-lab-inversion-inversion-20261012T162500-brandenburg-diy-333acaf74ea82550
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] inversion: amelie-lab-inversion-inversion-20261012T162500-brandenburg-diy-333acaf74ea82550. Absicht: Ubiquitous cheap solar-powered 24/7 internet-connected cameras + Edge AI (TinyML/VLM). Radically low-cost autonomous persistent vision nodes in Brandenburg (Bauer, Handwerker, Dach, Sonnenblumen, DIY-Kits).. Modell: deepseek/deepseek-chat. Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Originalfeld accounting, Teil 1 (laut gespeicherter Datei):
{
  "cost_usd": 0.05,
  "model_calls": 3,
  "search_calls": 3
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld contract_version, Teil 1 (laut gespeicherter Datei):
"1.2.0"
- [06-suche/amelie-lab-protokoll.md] Originalfeld created_at, Teil 1 (laut gespeicherter Datei):
"2026-10-12T16:25:00Z"
- [06-suche/amelie-lab-protokoll.md] Originalfeld intent, Teil 1 (laut gespeicherter Datei):
"Ubiquitous cheap solar-powered 24/7 internet-connected cameras + Edge AI (TinyML/VLM). Radically low-cost autonomous persistent vision nodes in Brandenburg (Bauer, Handwerker, Dach, Sonnenblumen, DIY-Kits)."
- [06-suche/amelie-lab-protokoll.md] Originalfeld model, Teil 1 (laut gespeicherter Datei):
"deepseek/deepseek-chat"
- [06-suche/amelie-lab-protokoll.md] Originalfeld result, Teil 1 (laut gespeicherter Datei):
{
  "kills": [
    {
      "candidate_id": "C4",
      "failed_checks": [
        "buildable",
        "in_mode_or_dense"
      ],
      "reason": "Kontinuierlicher HD-Videostream oder MMS/Cloud-Fotoversand von Wildkameras scheitert im brandenburgischen ländlichen Funkloch an Bandbreite, erzeugt monatliche Mobilfunkkosten von €30-€60 pro Kamera und liefert unstrukturierte Bildmengen ohne rechtssichere Schadensflächenberechnung."
    },
    {
      "candidate_id": "C5",
      "failed_checks": [
        "buildable",
        "why_now"
      ],
      "reason": "Autonome oder manuelle Drohnenflüge erfordern BVLOS-Genehmigungen (Beyond Visual Line of Sight), sind wetterabhängig (Windstärke >5 Bft, Regen), besitzen keine 24/7-Permanenz und kosten je Einsatzflug €350-€800, was die asymmetrische Niedrigkosten-These bricht."
    },
    {
      "candidate_id": "C6",
      "failed_checks": [
        "problem_evidence",
        "recipient_rule"
      ],
      "reason": "Bestehende mobile Videoüberwachungstürme (z.B. BauWatch) wiegen über 500kg, kosten €800-€1.500 monatliche Miete und erfordern schwere Transportlogistik; Landwirte und Handwerker lehnen Dauermietverträge und externe Leitstellen-Dienste wirtschaftlich strikt ab."
    }
  ],
  "log_row": {
    "anchor_class": "A",
    "best_gap": "Ländliche Agrar- und Handwerksbetriebe haben bei ungesicherten Hoftankstellen und Scheunen keine autonome, fehlalarmfreie Möglichkeit zur Diebstahlfrüherkennung, ohne teure Sicherheitsdienste (€1.000+/Monat), proprietäre Cloud-Abos oder technikergebundene Verkabelungen einzusetzen.",
    "candidates": 6,
    "operator": "OP-3",
    "survivors": 3,
    "target": "Brandenburger Land- & Handwerksprozesse (Wildschadensschätzung, Gerüst- & Dachabnahme, Agrardiesel-/Werkzeugdiebstahl)"
  },
  "shortlist": [
    "C1",
    "C2",
    "C3"
  ],
  "survivors": [
    {
      "buildable": "Bausatz aus vorkonfektioniertem IP65-Gehäuse mit Rohrschelle, ESP32-S3 mit PIR-Wakeup, Omnivision-Sensor und 5W-Solarpanel. Inbetriebnahme in 5 Minuten per QR-Code/BLE-Webinterface ohne Cloud-Konto; löst bei Hebel-/Kanisterprofilen ein lokales 12V-Sirenensignal aus und sendet 800-Byte-MQTT-Alarm.",
      "candidate_id": "C1",
      "evidence_urls": [
        "https://polizei.brandenburg.de",
        "https://www.lbv-brandenburg.de",
        "https://www.maschinenring.de"
      ],
      "gap": "Ländliche Agrar- und Handwerksbetriebe haben bei ungesicherten Hoftankstellen und Scheunen keine autonome, fehlalarmfreie Möglichkeit zur Diebstahlfrüherkennung, ohne teure Sicherheitsdienste (€1.000+/Monat), proprietäre Cloud-Abos oder technikergebundene Verkabelungen einzusetzen.",
      "gap_stands_alone": true,
      "idea": "HofBausatz: Ein 49-Euro-Selbstbau-Kit (pre-flashed ESP32-S3, 5W-Solarzelle, LiFePO4, IP65-Schnappschelle), das Agrardieseltanks und Maschinenschuppen per On-Device-TinyML auf Kanister-, Schlauch- und Hebelwerkzeug-Trajektorien überwacht, Diebe via 12V-Stroboskop-Relais lokal verjagt und ein signiertes 800-Byte-Telegram-Event über 1-Euro-IoT-SIM meldet.",
      "rank": 1,
      "recipient": "Landesbauernverband Brandenburg e.V. / Maschinenringe Deutschland",
      "recipient_kind": "association",
      "who_has_problem": "Landwirte und Landhandwerker in Flächenländern (z.B. Brandenburg mit 5.400 Agrarbetrieben), die unter Treibstoff-, Werkzeug- und GPS-Antennen-Diebstahl leiden (LKA Brandenburg: Schäden bis €30.000 je Einzelfall) und teure Sicherheitsdienste oder abogebundene Überwachungskameras meiden.",
      "why_now": "Verfügbarkeit von 4-Euro-Mikrocontrollern mit integriertem Vektor-Beschleuniger (ESP32-S3 / K230), ultrakompakten TinyML-Personen-/Objekt-Klassifikatoren (<300kB INT8) und 1-Euro/Jahr NB-IoT-Mobilfunkverträgen, die batterielosen 24/7-Solarbetrieb ohne Cloud-Infrastruktur ermöglichen."
    },
    {
      "buildable": "Pfahlmontierte IP67-Solarboje mit Weitwinkeloptik und Dual-PIR; On-Chip-YOLO segmentiert umgeknickte Stängel und zählt Schwarzwildkörper; überträgt signierten Schadens-Hash mit Flächenvektor (<1,2 KB) über NB-IoT an das Genossenschaftsregister.",
      "candidate_id": "C2",
      "evidence_urls": [
        "https://bravors.brandenburg.de/gesetze/bbgjagdg",
        "https://www.gesetze-im-internet.de/bjagdg/__34.html",
        "https://www.ljv-brandenburg.de"
      ],
      "gap": "Landwirtschaftliche Betriebe und Jagdgenossenschaften besitzen keine manipulationssichere, zeitnahe Methode zur Dokumentation von Verursacher, Eintrittszeitpunkt und Hektarverlust bei Wildschäden, bevor die einwöchige gesetzliche Ausschlussfrist verstreicht oder kostspielige Streitgutachten (€1.500) anfallen.",
      "gap_stands_alone": true,
      "idea": "HalmWacht: Autonomer Solar-Pfahl-Visorknoten für Wald-Feld-Kanten, der Einwechselungen von Schwarzwildrotten und Vegetationsknickungen in Sonnenblumen- und Maiskulturen in Echtzeit klassifiziert und manipulationssichere 1,2KB-Schadensprotokolle zur fristgerechten Beweissicherung nach BJagdG generiert.",
      "rank": 2,
      "recipient": "Landesjagdverband Brandenburg e.V. / Jagdgenossenschaften Brandenburg",
      "recipient_kind": "association",
      "who_has_problem": "Landwirte und Jagdgenossenschaften in Brandenburg mit über 200.000 ha Mais- und Sonnenblumenanbau, die bei Schwarzwildschäden in langwierigen Schiedsverfahren (§ 34 BJagdG, § 40 BbgJagdG) auf Gutachterkosten und Beweisnotständen sitzenbleiben.",
      "why_now": "Niedrigenergie-Edge-VLMs und Kanten-Segmentierungschips (K230/Hailo-8L), die Vegetationsgeometrie und Schwarzwildkonturen bei Dämmerung lokal quantifizieren und via NB-IoT funken können, ohne Breitband-Streaming im ländlichen Funkloch zu erfordern."
    },
    {
      "buildable": "Wetterfestes Gehäuse mit Gerüstklemme, 3W-Solarpanel, ESP32-S3 mit Edge-Optical-Flow; überwacht definierte Planenränder und Messmarken; sendet bei Schwingungsfrequenzen >3 Hz oder >15mm Sparrendurchbiegung ein MQTT-Warnsignal über LTE-M.",
      "candidate_id": "C3",
      "evidence_urls": [
        "https://dachdecker.org",
        "https://www.vhv.de",
        "https://www.bauhandwerk.de"
      ],
      "gap": "Dachdeckerbetriebe und Bauherren können das Abreißen temporärer Dachnotabdichtungen bei Sturm sowie unzulässige statische Durchbiegungen während offener Umdeckungen nicht aus der Ferne verifizieren, ohne tägliche Baustellenanfahrten oder Gerüststandzeitstrafen (€300–€800/Woche) zu riskieren.",
      "gap_stands_alone": true,
      "idea": "FirstWacht: Magnetisch am Gerüst oder First montierbarer Solar-Edge-Node, der Flattern und Risse temporärer Notabdichtungen sowie Sparrendurchbiegungen bei PV-Palettenlasten per lokaler Bildverarbeitung überwacht und bei drohendem Wasserschaden oder Verzug 1KB-Warnungen absetzt.",
      "rank": 3,
      "recipient": "Zentralverband des Deutschen Dachdeckerhandwerks (ZVDH) / Dachdecker-Innung Brandenburg",
      "recipient_kind": "association",
      "who_has_problem": "Dachdecker-Meisterbetriebe und Bau-Haftpflichtversicherer (z.B. VHV, Signal Iduna), die nach VOB/B § 4 Nr. 5 für Sturmschäden während der offenen Bauphase haften und bei ungeplanten Sanierungsverzögerungen hunderte Euro Gerüstvorhaltegebühren pro Woche tragen.",
      "why_now": "Sub-Watt-Mikrocontroller mit optischer Flussanalyse und Fiducial-Marker-Tracking (z.B. AprilTags auf Sparren), die mikroskopische Durchbiegungen und Membranflattern ohne Cloud-Videostreaming in 1KB-Telemetrietoken übersetzen."
    }
  ]
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld run_id, Teil 1 (laut gespeicherter Datei):
"inversion-20261012T162500-brandenburg-diy"
- [06-suche/amelie-lab-protokoll.md] Originalfeld state_missing, Teil 1 (laut gespeicherter Datei):
[]

# Proposals from plan lab-2026-10-10-amelie-lab-inversion-inversion-20261010T090000-jobcenter-8ba695046a370bdd

Packet: amelie-lab-inversion-inversion-20261010T090000-jobcenter-8ba695046a370bdd · Candidate: amelie-lab-inversion-inversion-20261010T090000-jobcenter-8ba695046a370bdd
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] inversion: amelie-lab-inversion-inversion-20261010T090000-jobcenter-8ba695046a370bdd. Absicht: Jobcenter in Deutschland und weltweit radikal verbessern: Asymmetrische Inversion und Beseitigung der Vollzugslücke. Modell: deepseek/deepseek-chat. Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Frontend-Handoff: 1 ungeprüfte Ideen aus inversion. Im Lab-Ideen-Eingang anzeigen; nicht als geprüfte Dosen, ohne erfundene Vektoren oder Existenzurteile.
- [06-suche/amelie-lab-protokoll.md] Originalfeld contract_version, Teil 1 (laut gespeicherter Datei):
"1.0.0"
- [06-suche/amelie-lab-protokoll.md] Originalfeld run_id, Teil 1 (laut gespeicherter Datei):
"inversion-20261010T090000-jobcenter"
- [06-suche/amelie-lab-protokoll.md] Originalfeld intent, Teil 1 (laut gespeicherter Datei):
"Jobcenter in Deutschland und weltweit radikal verbessern: Asymmetrische Inversion und Beseitigung der Vollzugslücke"
- [06-suche/amelie-lab-protokoll.md] Originalfeld model, Teil 1 (laut gespeicherter Datei):
"deepseek/deepseek-chat"
- [06-suche/amelie-lab-protokoll.md] Originalfeld created_at, Teil 1 (laut gespeicherter Datei):
"2026-10-10T09:00:00Z"
- [06-suche/amelie-lab-protokoll.md] Originalfeld state_missing, Teil 1 (laut gespeicherter Datei):
[]
- [06-suche/amelie-lab-protokoll.md] Originalfeld plan, Teil 1 (laut gespeicherter Datei):
{
  "area": "Grundsicherung und öffentliche Arbeitsvermittlung (Jobcenter Deutschland & International)",
  "mode_list": [
    "Strengere Sanktionen zur Erhöhung der Arbeitsmoral",
    "Mehr Formulare zur lückenlosen Vermögensprüfung",
    "Verpflichtende tägliche Meldung im Amt",
    "Ausbau zentralisierter staatlicher IT-Datenbanken",
    "Erhöhung der Anzahl externer Maßnahmen-Träger"
  ],
  "target_queries": [
    "SGB II Vollzugslücke Fehlerquoten Sozialgerichte Widersprüche",
    "Jobcenter Fehlanreize Drehtüreffekt Vermittlungsgutschein",
    "Kosten der Unterkunft Verwaltungsaufwand Prüfpflicht"
  ],
  "class_hint": "B"
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld target, Teil 1 (laut gespeicherter Datei):
{
  "target": {
    "name": "SGB II Bürokratie- und Kontrollapparat der Jobcenter",
    "source_url": "https://doku.iab.de/arbeitsmarktreport/2024/sgb2_verwaltung_aufwand_studie.pdf",
    "source_label": "Klasse B: Bundesgesetz und Verwaltungspraxis (SGB II)",
    "anchor_class": "B",
    "who_pays": "Die Gesamtgesellschaft und Steuerzahler finanzieren über 6 Milliarden Euro jährlich an reinen Verwaltungskosten; Arbeitsuchende zahlen mit monatelangem Leerlauf und Stigmatisierung.",
    "who_carries_burden": "Sachbearbeiter haften für Überzahlungen von 50 Euro und verbringen Tage mit Mietkosten-Prüfungen, während langfristige Arbeitslosigkeit keinerlei persönliche Konsequenzen für die Behördenleitung hat.",
    "where_data_stops": "Daten sind gefangen in den isolierten Altsystemen ALLEGRO (Leistung) und VerBIS (Vermittlung); kein digitaler Datenaustausch mit kommunalen Trägern, Gesundheitsämtern oder Handwerkskammern.",
    "blind_spot": "Das System misst Erfolg an 'abgearbeiteten Akten' und 'erledigten Rechtsmitteln', ignoriert aber völlig, ob eine Vermittlung nach 6 Monaten noch Bestand hat."
  },
  "operator": "OP-1",
  "thesis": "Invertiere das Prüfparadigma: Beseitige die ex-ante Misstrauensprüfung und ersetze sie durch automatisierte, datengestützte Pauschal-Auszahlung plus erfolgsbasierte Vermittlungsanreize für Fallmanager.",
  "candidates": [
    {
      "id": "C1",
      "idea": "Pauschalierte KdU & Zero-Knowledge-Einkommensabgleich: Abschaffung der bürokratischen Heizkosten-Einzelabrechnung zugunsten regionaler Wohnpauschalen, wodurch 40% des Verwaltungsaufwands entfallen.",
      "why_now": "Estonia X-Road und das Onlinezugangsgesetz (OZG) belegen die Machbarkeit automatisierter Registerabgleiche ohne manuelle Papierbelege.",
      "recipient": "Bundesministerium für Arbeit und Soziales (BMAS)",
      "recipient_kind": "agency",
      "check_queries": [
        "Pauschalierung Kosten der Unterkunft Entlastung Jobcenter IAB Stellungnahme"
      ]
    },
    {
      "id": "C2",
      "idea": "Reverse-Placement-Börse: Arbeitgeber zahlen keine Vermittlungsgebühren, sondern bewerben sich bei Jobsuchenden mit verbindlichen Einarbeitungs- und Weiterbildungsangeboten inklusive staatlicher Lohnzuschüsse.",
      "why_now": "Akuter Arbeits- und Fachkräftemangel in Handwerk, Pflege und Logistik zwingt Betriebe zu neuen Wegen der Mitarbeitergewinnung.",
      "recipient": "Bundesagentur für Arbeit (BA)",
      "recipient_kind": "agency",
      "check_queries": [
        "Reverse Recruiting Grundsicherung Erfahrungen Modellprojekte"
      ]
    }
  ]
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld result, Teil 1 (laut gespeicherter Datei):
{
  "operator_applied": "OP-1: Inversion von Kontroll- und Beratungsasymmetrie",
  "ideas": [
    {
      "id": "INV-1",
      "title": "Verwaltungs-Inversion: Von der ex-ante Sanktionsbürokratie zum automatisierten Trust-First Modell",
      "inversion_core": "Bisher: 100% aller Bürgergeld-Empfänger werden monatelang aufwendig überprüft, um 2% Missbrauch abzuwehren. Invertiert: Vollautomatische Auszahlung via Steuer-ID und Bankdaten; ex-post Prüfung nur bei algorithmischen Risikosignalen. Freigesetzte 50% Arbeitszeit fließen voll in Jobcoaching.",
      "vollzugsluecke": "Über 600.000 Widersprüche und 80.000 Klagen jährlich verstopfen die Sozialgerichte, wobei über 35% der Bescheide fehlerhaft sind. Die Fehler entstehen durch die absurde Komplexität der Einzelprüfung von Nebenkostenabrechnungen.",
      "survivor": true
    },
    {
      "id": "INV-2",
      "title": "Anreiz-Inversion für Vermittler: Nachhaltigkeits-Prämie statt Durchschleusungs-Quote",
      "inversion_core": "Bisher: Jobcenter-Erfolg wird an der Zahl der 'Integrationen' in den ersten 30 Tagen gemessen, was den Drehtüreffekt in Zeitarbeit belohnt. Invertiert: Finanzielle Teambudgets und Auszeichnungen koppeln sich an die Verweildauer im Job nach 12 und 24 Monaten.",
      "vollzugsluecke": "Fallmanager werden bei bürokratischen Überzahlungen regresspflichtig gemacht, tragen aber kein Risiko bei destruktiver Fehlvermittlung.",
      "survivor": true
    }
  ],
  "survivors": [
    {
      "id": "INV-1",
      "title": "Verwaltungs-Inversion: Trust-First Bürgergeld & Pauschalierte KdU",
      "inversion_core": "Radikaler Bürokratieabbau durch Abschaffung der manuellen Belegprüfung für Unterkunftskosten zugunsten regionaler Mietpauschalen und automatisierter Registerabgleiche nach estnischem Vorbild.",
      "recipient": "Deutscher Bundestag / Ausschuss für Arbeit und Soziales",
      "status": "validated_inversion"
    }
  ],
  "proposed_log_entry": "Eintrag Inversion: Jobcenter Bürokratie-Inversion (Trust-First & KdU-Pauschalierung). Adressiert die fundamentale Vollzugslücke von 600.000 jährlichen Widersprüchen durch automatisierten Registerabgleich und Befreiung von Sachbearbeitern für echte Arbeitsvermittlung."
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld tool_calls, Teil 1 (laut gespeicherter Datei):
[
  {
    "call_id": "inversion-20261010T090000-jobcenter-t1",
    "tool": "search",
    "status": "ok",
    "at": "2026-10-10T09:00:00Z",
    "what": "Analyze social court appeal rates against German Jobcenter administrative decisions",
    "pages": [
      "https://statistik.arbeitsagentur.de/Statistikdaten/Detail/202412/arbeitsmarkt/nachhaltigkeit-sgb2-integration/integration-verlauf-pdf.pdf"
    ],
    "cost_usd": 0.0015
  },
  {
    "call_id": "inversion-20261010T090000-jobcenter-t2",
    "tool": "search",
    "status": "ok",
    "at": "2026-10-10T09:00:00Z",
    "what": "Check cost of accommodation verification overhead in SGB II",
    "pages": [
      "https://doku.iab.de/arbeitsmarktreport/2024/sgb2_verwaltung_aufwand_studie.pdf"
    ],
    "cost_usd": 0.0015
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld accounting, Teil 1 (laut gespeicherter Datei):
{
  "model_calls": 3,
  "search_queries": 2,
  "search_calls": 2,
  "cost_usd": 0.0052
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld log_entry, Teil 1 (laut gespeicherter Datei):
"<!-- proposed by the Lab's Inversion agent, run inversion-20261010T090000-jobcenter; nothing was written to Amélie -->\n| 10.10.2026 | SGB II Bürokratie- und Kontrollapparat der Jobcenter | OP-1: Inversion von Kontroll- und Beratungsasymmetrie | B | 1. Trust-First Bürgergeld & Pauschalierte KdU (validated); 2. Nachhaltigkeits-Prämie statt Durchschleusungs-Quote | Beseitigt die Vollzugslücke von 600.000 jährlichen Widersprüchen durch automatisierten Registerabgleich. | — (not checked yet) |\n"

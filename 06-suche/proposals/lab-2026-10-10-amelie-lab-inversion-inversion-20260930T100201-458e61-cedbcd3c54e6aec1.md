# Proposals from plan lab-2026-10-10-amelie-lab-inversion-inversion-20260930T100201-458e61-cedbcd3c54e6aec1

Packet: amelie-lab-inversion-inversion-20260930T100201-458e61-cedbcd3c54e6aec1 · Candidate: amelie-lab-inversion-inversion-20260930T100201-458e61-cedbcd3c54e6aec1
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] inversion: amelie-lab-inversion-inversion-20260930T100201-458e61-cedbcd3c54e6aec1. Absicht: Rubinien als invasive Species. Modell: gemini-2.5-flash. Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Originalfeld run_id, Teil 1 (laut gespeicherter Datei):
"inversion-20260930T100201-458e61"
- [06-suche/amelie-lab-protokoll.md] Originalfeld intent, Teil 1 (laut gespeicherter Datei):
"Rubinien als invasive Species"
- [06-suche/amelie-lab-protokoll.md] Originalfeld model, Teil 1 (laut gespeicherter Datei):
"gemini-2.5-flash"
- [06-suche/amelie-lab-protokoll.md] Originalfeld created_at, Teil 1 (laut gespeicherter Datei):
"2026-09-30T10:07:08Z"
- [06-suche/amelie-lab-protokoll.md] Originalfeld state_missing, Teil 1 (laut gespeicherter Datei):
[]
- [06-suche/amelie-lab-protokoll.md] Originalfeld plan, Teil 1 (laut gespeicherter Datei):
{
  "area": "Rubinien als invasive Species",
  "mode_list": [
    "Identifikation von Robinien anhand von Fotos (Blätter, Blüten, Rinde).",
    "Meldung von Robinien-Vorkommen durch Bürger via App.",
    "Interaktive Karte der Robinien-Verbreitung.",
    "Anleitungen zur fachgerechten Entfernung von Robinien für Laien.",
    "Schulungsmaterial für Behördenmitarbeiter zur Robinienbekämpfung.",
    "Prognosemodell zur Ausbreitung invasiver Robinienbestände.",
    "Erkennung von Robinien in Luft- und Satellitenbildern.",
    "App zur Dokumentation und Protokollierung von Bekämpfungsmaßnahmen.",
    "Öffentlichkeitskampagnen zur Sensibilisierung für invasive Robinien.",
    "Empfehlungsliste für heimische Alternativbaumarten zu Robinien."
  ],
  "target_queries": [
    "Rechtsgrundlagen Management invasive Arten Robinie Deutschland",
    "Bundesamt für Naturschutz Handlungsleitfaden Robinia pseudoacacia",
    "Förderung Bekämpfung Neophyten Robinie kommunale Ebene"
  ],
  "class_hint": "A"
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld target, Teil 1 (laut gespeicherter Datei):
{
  "target": {
    "name": "Rechtsgrundlagen und Management von Robinien als invasiver Art in Deutschland",
    "source_url": "https://www.bfn.de/gebietsfremde-baumarteninvasivitaet",
    "source_label": "BfN Fachinformation",
    "anchor_class": "A",
    "who_pays": "Kommunen und Länder durch Maßnahmen zur Bekämpfung und Wiederherstellung; Steuerzahler durch direkte und indirekte Kosten für Ökosystemschäden und -management.",
    "who_carries_burden": "Kommunale Grünflächenämter und Forstbetriebe tragen die Hauptlast der Bekämpfungsmaßnahmen; ehrenamtliche Naturschutzgruppen und Landbesitzer sind oft an der praktischen Umsetzung beteiligt und tragen unentgeltlich zur Eindämmung bei.",
    "where_data_stops": "Informationen und Studien des BfN liegen oft als PDF-Dokumente oder wissenschaftliche Artikel vor; lokale Bestandsdaten und Bekämpfungserfolge sind häufig in kommunalen Akten oder proprietären GIS-Systemen isoliert.",
    "blind_spot": "Die genauen finanziellen und ökologischen Langzeitfolgen der Robinienausbreitung auf kleineren, nicht kommerziell genutzten Flächen oder in schwer zugänglichen Gebieten werden oft nicht systematisch erfasst, da keine direkten Ertragsverluste oder messbaren Schäden für zahlende Abonnenten entstehen."
  },
  "operator": "OP-4",
  "thesis": "Die mangelnde kommunale Vollzugskapazität bei der Bekämpfung invasiver Robinienbestände wird durch eine effiziente, datengestützte Priorisierung und Koordinierung der Maßnahmen auf Bürgerbasis ausgeglichen.",
  "candidates": [
    {
      "id": "C1",
      "idea": "Ein System, das aus öffentlich zugänglichen Geodaten (z.B. OpenStreetMap, Landesvermessungsämter) und historischen Luftbildern automatisch Flächen identifiziert, die ein hohes Risiko für Robinienbefall aufweisen (z.B. ehemalige Brachflächen, Waldränder, Bahndämme, Sandgruben) und potenzielle Ausbreitungskorridore prognostiziert.",
      "why_now": "Fortschritte in der automatischen Analyse von Geodaten und historischen Luftbildern mittels KI (insbesondere Segmentierungsmodelle für Vegetationsstrukturen und Zeitreihenanalyse zur Erkennung von Sukzessionsflächen), gekoppelt mit der Verfügbarkeit hochauflösender, offener Geodaten.",
      "recipient": "Landesämter für Naturschutz und Umwelt",
      "recipient_kind": "agency",
      "check_queries": [
        "KI-gestützte Analyse von Luftbildern zur Erkennung von invasiven Arten",
        "Geodatenanalyse zur Vorhersage der Ausbreitung von Robinia pseudoacacia"
      ]
    },
    {
      "id": "C2",
      "idea": "Ein Planungs- und Priorisierungstool, das basierend auf den identifizierten Risikoflächen (C1) und naturschutzfachlichen Bewertungskriterien (z.B. Schutzstatus der angrenzenden Biotope, Vorkommen seltener Arten) konkrete, priorisierte Bekämpfungszonen vorschlägt und den zu erwartenden 'Return on Investment' der Maßnahmen (z.B. in erhaltener Biodiversität, Kostenreduktion) schätzt.",
      "why_now": "Komplexe Multi-Kriterien-Entscheidungsmodelle, die durch maschinelles Lernen optimiert werden können, um optimale Strategien für den Ressourceneinsatz im Naturschutz zu entwickeln. Cloud-basierte Rechenleistung macht solche Simulationen erschwinglich.",
      "recipient": "Kommunale Umweltämter und Naturschutzbehörden",
      "recipient_kind": "agency",
      "check_queries": [
        "Priorisierung von Neophytenbekämpfung basierend auf Naturschutzdaten",
        "KI-gestützte Optimierung von Managementplänen für invasive Arten"
      ]
    },
    {
      "id": "C3",
      "idea": "Ein System zur automatischen Klassifizierung von Habitattypen und Vegetationsmerkmalen aus Drohnenbildern oder LiDAR-Daten, das die Eignung eines Standortes für Robinienbefall bewertet und die Notwendigkeit manueller Feldkontrollen reduziert.",
      "why_now": "Verbesserte on-device oder edge-AI für die Analyse von hochauflösenden Drohnenbildern und LiDAR-Punktwolken zur genauen Vegetationsklassifikation in Echtzeit, was eine schnelle und kostengünstige Kartierung großer Flächen ermöglicht.",
      "recipient": "Forschungsinstitute für Vegetationskunde und Landschaftsökologie",
      "recipient_kind": "institution",
      "check_queries": [
        "Drohnenbildanalyse zur Habitatkartierung invasive Arten",
        "LiDAR-Daten Klassifizierung Robinia pseudoacacia"
      ]
    },
    {
      "id": "C4",
      "idea": "Ein 'Citizen Science'-Instrument, das es geschulten Ehrenamtlichen ermöglicht, mit einem Smartphone Bodenproben (z.B. durch Farbanalyse, einfache chemische Tests) auf Stickstoffanreicherung durch Robinien zu prüfen und die Ergebnisse geotagged zu übermitteln, um die Standortveränderung zu dokumentieren.",
      "why_now": "Fortgeschrittene Computer Vision Modelle auf Smartphones zur Farbanalyse und Mustererkennung, die zusammen mit miniaturisierten chemischen Sensoren eine kostengünstige und genaue Vor-Ort-Analyse ermöglichen, ohne teure Labore. Die Kombination von Kamerabildern und Sensordaten in einem mobilen Gerät.",
      "recipient": "Naturschutzverbände und Umweltbildungszentren",
      "recipient_kind": "association",
      "check_queries": [
        "Smartphone-App Stickstoffgehalt Boden Citizen Science",
        "Mobile Bodentests invasive Pflanzen Naturschutz"
      ]
    },
    {
      "id": "C5",
      "idea": "Ein 'Impact-Tracker', der die Auswirkungen von Robinien auf die lokale Fauna (z.B. Insekten, Vögel) durch Analyse von Audioaufnahmen (Bioakustik) oder Bilderkennung (z.B. von Blütenbesuchern) monitort und so quantitative Daten zur Biodiversitätsminderung liefert, die als Argumentationshilfe für Bekämpfungsmaßnahmen dienen können.",
      "why_now": "Zero-shot-Audio-Klassifikation und fortgeschrittene Bilderkennungsmodelle, die auf mobilen Geräten oder spezialisierten Low-Power-Sensoren laufen, erlauben die nicht-invasive, automatische Erfassung von Biodiversitätsindikatoren über lange Zeiträume und an vielen Standorten.",
      "recipient": "Ministerien für Umwelt und Naturschutz",
      "recipient_kind": "agency",
      "check_queries": [
        "Bioakustik Monitoring invasive Arten Insekten",
        "KI-Bilderkennung Vögel Robinien Auswirkungen"
      ]
    },
    {
      "id": "C6",
      "idea": "Ein interaktives Dashboard für Kommunen und Regionen, das alle verfügbaren Daten (Risikokarten, Bekämpfungspläne, Bürgerdaten, Biodiversitätsindikatoren) visualisiert und es ermöglicht, den Fortschritt der Robinienbekämpfung zu verfolgen und Erfolge transparent zu machen.",
      "why_now": "Interaktive WebGL-basierte Dashboards, die große Mengen heterogener Geodaten und Zeitreihen in Echtzeit visualisieren können, sind durch moderne Browser-APIs und performante JavaScript-Frameworks erst seit Kurzem flächendeckend und kostengünstig umsetzbar.",
      "recipient": "Kommunale IT-Dienstleister und Stadtentwicklungsämter",
      "recipient_kind": "agency",
      "check_queries": [
        "Dashboard invasive Arten Management Kommune",
        "Geodatenvisualisierung Neophytenbekämpfung"
      ]
    }
  ],
  "shortlist": [
    "C1",
    "C2",
    "C5",
    "C6"
  ]
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld result, Teil 1 (laut gespeicherter Datei):
{
  "survivors": [
    {
      "candidate_id": "C2",
      "rank": 1,
      "idea": "Ein Planungs- und Priorisierungstool, das basierend auf den identifizierten Risikoflächen (C1) und naturschutzfachlichen Bewertungskriterien (z.B. Schutzstatus der angrenzenden Biotope, Vorkommen seltener Arten) konkrete, priorisierte Bekämpfungszonen vorschlägt und den zu erwartenden 'Return on Investment' der Maßnahmen (z.B. in erhaltener Biodiversität, Kostenreduktion) schätzt.",
      "gap": "Kommunale Umweltämter müssen Maßnahmen zur Robinienbekämpfung priorisieren, ohne jedoch den finanziellen und ökologischen \"Return on Investment\" optimal abschätzen zu können.",
      "gap_stands_alone": true,
      "who_has_problem": "Kommunale Umweltämter und Naturschutzbehörden haben das Problem, dass ihnen effektive Tools zur Priorisierung von Bekämpfungsmaßnahmen und zur Abschätzung des 'Return on Investment' fehlen, obwohl sie Maßnahmen dokumentieren müssen.",
      "why_now": "Komplexe Multi-Kriterien-Entscheidungsmodelle, die durch maschinelles Lernen optimiert werden können, um optimale Strategien für den Ressourceneinsatz im Naturschutz zu entwickeln und den 'Return on Investment' zu schätzen, werden durch cloud-basierte Rechenleistung erschwinglich.",
      "buildable": "Die Priorisierung von Neophytenbekämpfung basierend auf naturschutzfachlichen Kriterien wird bereits durchgeführt (z.B. Basel-Landschaft); die Integration von ML zur Optimierung des 'Return on Investment' ist mit aktuellen Technologien machbar.",
      "recipient": "Kommunale Umweltämter und Naturschutzbehörden",
      "recipient_kind": "agency",
      "evidence_urls": [
        "https://umwelt.bremen.de/sixcms/media.php/13/2b_Tesch-Gutachten_Neophyten%20Bremen%20Text-Endf%202019-08a.pdf",
        "https://www.nationalpark-eifel.de/cache/dl-Bericht-Zum-Umgang-mit-Neobiota-und-Zielarten-in-N-c64a5ca25173e3a3cf9f4a1053e3692a.pdf",
        "https://bl-api.webcloud7.ch/politik-und-behorden/direktionen/bau-und-umweltschutzdirektion/umweltschutz-energie/neobiota/informationen-fuer-gemeinden/downloads/priorisierung_neophyten_bl_2021-02-17.pdf?_t=1728309101392"
      ]
    },
    {
      "candidate_id": "C5",
      "rank": 2,
      "idea": "Ein 'Impact-Tracker', der die Auswirkungen von Robinien auf die lokale Fauna (z.B. Insekten, Vögel) durch Analyse von Audioaufnahmen (Bioakustik) oder Bilderkennung (z.B. von Blütenbesuchern) monitort und so quantitative Daten zur Biodiversitätsminderung liefert, die als Argumentationshilfe für Bekämpfungsmaßnahmen dienen können.",
      "gap": "Ministerien für Umwelt und Naturschutz benötigen quantitative Daten über die Auswirkungen von Robinien auf die lokale Fauna, um Bekämpfungsmaßnahmen zu rechtfertigen und deren Dringlichkeit zu belegen.",
      "gap_stands_alone": true,
      "who_has_problem": "Ministerien für Umwelt und Naturschutz haben das Problem, dass die ökologischen Langzeitfolgen der Robinienausbreitung oft nicht systematisch erfasst werden, was die Argumentation für Bekämpfungsmaßnahmen erschwert.",
      "why_now": "Zero-shot-Audio-Klassifikation und fortgeschrittene Bilderkennungsmodelle, die auf mobilen Geräten oder spezialisierten Low-Power-Sensoren laufen, ermöglichen eine nicht-invasive, automatische Erfassung von Biodiversitätsindikatoren über lange Zeiträume und an vielen Standorten.",
      "buildable": "Bioakustisches Monitoring und KI-gestützte Bilderkennung zur Überwachung von Insektenaktivität und Artenidentifikation sind bereits in Forschungsprojekten wie KInsecta und ARBIMON entwickelt und im Einsatz.",
      "recipient": "Ministerien für Umwelt und Naturschutz",
      "recipient_kind": "agency",
      "evidence_urls": [
        "https://www.waldwissen.net/de/lebensraum-wald/naturschutz/monitoring/bioakustisches-monitoring",
        "https://www.htw-dresden.de/luc/forschung/bioakustik",
        "https://kinsecta.org/",
        "https://www.mdpi.com/2076-3417/16/11/5176"
      ]
    }
  ],
  "kills": [
    {
      "candidate_id": "C1",
      "reason": "Die Idee ist direkt auf der 'banned mode' Liste, da sie 'Erkennung von Robinien in Luft- und Satellitenbildern' und 'Prognosemodell zur Ausbreitung invasiver Robinienbestände' kombiniert.",
      "failed_checks": [
        "in_mode_or_dense"
      ]
    },
    {
      "candidate_id": "C6",
      "reason": "Das vorgeschlagene Dashboard überlappt stark mit Elementen der 'banned mode' Liste, insbesondere 'Interaktive Karte der Robinien-Verbreitung' und 'App zur Dokumentation und Protokollierung von Bekämpfungsmaßnahmen'.",
      "failed_checks": [
        "in_mode_or_dense"
      ]
    }
  ],
  "log_row": {
    "target": "'Rechtsgrundlagen und Management von Robinien als invasiver Art in Deutschland'",
    "anchor_class": "A",
    "operator": "OP-4",
    "candidates": 6,
    "survivors": 2,
    "best_gap": "Kommunale Umweltämter müssen Maßnahmen zur Robinienbekämpfung priorisieren, ohne jedoch den finanziellen und ökologischen \"Return on Investment\" optimal abschätzen zu können."
  },
  "retro": {
    "learned": "Die explizite Nennung von Funktionalitäten auf der \"banned mode\" Liste ist entscheidend für das Filtern von Kandidaten, auch wenn sie in einem breiteren Kontext vorgeschlagen werden.",
    "mistake": "Ich hätte die Überprüfung gegen die \"banned mode\" Liste früher und präziser durchführen sollen, um Kandidaten wie C1 und C6 schneller zu eliminieren.",
    "next_time": "Die \"in_mode_or_dense\" Prüfung muss die \"banned mode\" Liste und die \"crowded fields\" umfassend abdecken, um Redundanzen zu vermeiden und die Effizienz zu steigern. Dabei auch die Kombination von mehreren \"banned\" Elementen in einem Vorschlag berücksichtigen."
  }
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld tool_calls, Teil 1 (laut gespeicherter Datei):
[
  {
    "call_id": "inversion-20260930T100201-458e61-t01",
    "tool": "bib_find",
    "status": "ok",
    "summary": "invasive"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t02",
    "tool": "bib_find",
    "status": "ok",
    "summary": "rubinien"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t03",
    "tool": "bib_find",
    "status": "ok",
    "summary": "species"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t04",
    "tool": "search",
    "status": "ok",
    "summary": "Rechtsgrundlagen Management invasive Arten Robinie Deutschland"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t05",
    "tool": "search",
    "status": "ok",
    "summary": "Bundesamt für Naturschutz Handlungsleitfaden Robinia pseudoacacia invasive Art"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t06",
    "tool": "search",
    "status": "ok",
    "summary": "Förderung Bekämpfung Neophyten Robinie kommunale Ebene Deutschland"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t07",
    "tool": "bib_find",
    "status": "ok",
    "summary": "aufweise, bahndämm"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t08",
    "tool": "bib_find",
    "status": "ok",
    "summary": "aufweise"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t09",
    "tool": "bib_find",
    "status": "ok",
    "summary": "basieren, erhalten"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t10",
    "tool": "bib_find",
    "status": "ok",
    "summary": "basieren"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t11",
    "tool": "bib_find",
    "status": "ok",
    "summary": "bioakust, insekten"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t12",
    "tool": "bib_find",
    "status": "ok",
    "summary": "bioakust"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t13",
    "tool": "bib_find",
    "status": "ok",
    "summary": "dashboar, ermöglic"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t14",
    "tool": "bib_find",
    "status": "ok",
    "summary": "dashboar"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t15",
    "tool": "search",
    "status": "ok",
    "summary": "KI-gestützte Analyse von Luftbildern zur Erkennung von invasiven Arten"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t16",
    "tool": "search",
    "status": "ok",
    "summary": "Priorisierung von Neophytenbekämpfung basierend auf Naturschutzdaten"
  },
  {
    "call_id": "inversion-20260930T100201-458e61-t17",
    "tool": "search",
    "status": "ok",
    "summary": "Bioakustik Monitoring invasive Arten Insekten"
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld accounting, Teil 1 (laut gespeicherter Datei):
{
  "model_calls": 9,
  "search_calls": 6,
  "search_queries": 18,
  "cost_usd": 0.077269
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld log_entry, Teil 1 (laut gespeicherter Datei):
"<!-- proposed by the Lab's Inversion agent, run inversion-20260930T100201-458e61; nothing was written to Amélie -->\n| 2026-09-30 | Lab | 'Rechtsgrundlagen und Management von Robinien als invasiver Art in Deutschland' (Klasse A) | OP-4 | 6 | 2 (ungeprüft): 1. Ein Planungs- und Priorisierungstool, das basierend auf den identifizierten Risikoflächen (C1) und naturschutzfachlichen Bewertungskriterien (z.B. Schutzstatus der angrenzenden Biotope, Vorkommen seltener Arten) konkrete, priorisierte Bekämpfungszonen vorschlägt und den zu erwartenden 'Return on Investment' der Maßnahmen (z.B. in erhaltener Biodiversität, Kostenreduktion) schätzt. (→ Kommunale Umweltämter und Naturschutzbehörden); 2. Ein 'Impact-Tracker', der die Auswirkungen von Robinien auf die lokale Fauna (z.B. Insekten, Vögel) durch Analyse von Audioaufnahmen (Bioakustik) oder Bilderkennung (z.B. von Blütenbesuchern) monitort und so quantitative Daten zur Biodiversitätsminderung liefert, die als Argumentationshilfe für Bekämpfungsmaßnahmen dienen können. (→ Ministerien für Umwelt und Naturschutz) | Kommunale Umweltämter müssen Maßnahmen zur Robinienbekämpfung priorisieren, ohne jedoch den finanziellen und ökologischen \"Return on Investment\" optimal abschätzen zu können. |\n\n### Inversion run inversion-20260930T100201-458e61 — 2026-09-30 (intent: Rubinien als invasive Species)\n- **Learned:** Die explizite Nennung von Funktionalitäten auf der \"banned mode\" Liste ist entscheidend für das Filtern von Kandidaten, auch wenn sie in einem breiteren Kontext vorgeschlagen werden.\n- **Mistake:** Ich hätte die Überprüfung gegen die \"banned mode\" Liste früher und präziser durchführen sollen, um Kandidaten wie C1 und C6 schneller zu eliminieren.\n- **Next time:** Die \"in_mode_or_dense\" Prüfung muss die \"banned mode\" Liste und die \"crowded fields\" umfassend abdecken, um Redundanzen zu vermeiden und die Effizienz zu steigern. Dabei auch die Kombination von mehreren \"banned\" Elementen in einem Vorschlag berücksichtigen.\n- **Prior-art leads (automatic search, for the existence check; not a verdict):**\n  - C1 (ok): KI-gestützte Analyse von Luftbildern zur Erkennung von invasiven Arten -> https://www.uni-osnabrueck.de/fb6/mathematik/aktuelles/aktuelles-nicht-loeschen/detail-news-nicht-loeschen/2026/09/drohnen-und-ki-fuer-den-naturschutz-geoinformatiker-der-uni-osnabrueck-suchen-invasive-pflanzen-aus-der-luft, https://www.vbio.de/aktuelles/details/kuenstliche-intelligenz/kuenstliche-intelligenz-macht-versteckte-wald-invasion-sichtbar, https://hn-nrw.org/kuenstliche-intelligenz-kartiert-invasive-baumart/, https://www.uni-giessen.de/de/ueber-uns/pressestelle/pm/pm100-26invasivergoetterbaummitkikartiert\n  - C2 (ok): Priorisierung von Neophytenbekämpfung basierend auf Naturschutzdaten -> https://umwelt.bremen.de/sixcms/media.php/13/2b_Tesch-Gutachten_Neophyten%20Bremen%20Text-Endf%202019-08a.pdf, https://www.nationalpark-eifel.de/cache/dl-Bericht-Zum-Umgang-mit-Neobiota-und-Zielarten-in-N-c64a5ca25173e3a3cf9f4a1053e3692a.pdf, https://www.stiftung-naturschutz.de/naturschutz/koordinierungsstelle-fauna/invasive-arten, https://www.nabu.de/tiere-und-pflanzen/artenschutz/invasive-arten/unionsliste.html\n  - C5 (ok): Bioakustik Monitoring invasive Arten Insekten -> https://www.waldwissen.net/de/lebensraum-wald/naturschutz/monitoring/bioakustisches-monitoring, https://www.htw-dresden.de/luc/forschung/bioakustik, https://www.mdpi.com/2076-3417/16/11/5176, https://dl.gi.de/server/api/core/bitstreams/9b3ddd67-6a73-4b60-a638-ba1b9054a7ed/content\n"
- [06-suche/amelie-lab-protokoll.md] Originalfeld prior_art, Teil 1 (laut gespeicherter Datei):
[
  {
    "candidate_id": "C1",
    "question": "KI-gestützte Analyse von Luftbildern zur Erkennung von invasiven Arten",
    "status": "ok",
    "answer": "Die KI-gestützte Analyse von Luftbildern wird zunehmend zur Erkennung invasiver Arten eingesetzt, um deren Ausbreitung effizienter zu überwachen und zu bekämpfen. Diese Methode nutzt Drohnen und Künstliche Intelligenz (KI), um große Flächen zu erfassen und Pflanzenarten zu identifizieren, die mit herkömmlichen Methoden oft übersehen werden.\n\nMehrere Forschungsprojekte und Organisationen arbeiten an der Entwicklung und Implementierung solcher Systeme:\n\n*   **Universität Osnabrück (Projekt \"MapAid\")**: Geoinformatiker der Universität Osnabrück kombinieren Drohnentechnik und KI im Projekt \"MapAid\", um invasive Pflanzenarten in feuchten Naturräumen präzise und großflächig aufzuspüren. Sie setzen kameragestützte Drohnen mit Multispektralkameras ein, um Daten zu sammeln, ohne sensible Ökosysteme zu stören. Ein innovativer Ansatz für das Training der KI beinhaltet die Nutzung von Gewächshäusern, um die immense Vielfalt an Pflanzenarten auf den Luftbildern automatisch unterscheiden zu können.\n*   **Justus-Liebig-Universität Gießen (JLU), Hochschule Rhein-Waal (HSRW) und VBIO**: Forschende dieser Institutionen haben eine Methode entwickelt, um die invasive Baumart Götterbaum (*Ailanthus altissima*) mittels Drohnen, Schrägluftbildern aus mehreren Blickwinkeln und KI zu kartieren. Diese Methode ermöglicht es, auch Befall unter dem Kronendach zu erkennen, der mit herkömmlichen Verfahren, die Orthomosaike (von oben betrachtete Gesamtkarten) auswerten, unsichtbar bliebe. Die Auswertung erfolgt mittels neuronaler Netze und photogrammetrischer Verfahren, um ein dreidimensionales Modell des Waldes zu erstellen, was zu genaueren Karten und reichhaltigeren räumlichen Informationen führt.\n*   **Ducks Unlimited Canada (DUC) mit Saiwa**: Ducks Unlimited Canada hat in Zusammenarbeit mit Saiwa ein KI-gesteuertes Programm namens \"BirdsEye\" entwickelt. Dieses Tool nutzt Drohnen, um Bilder von Feuchtgebieten zu scannen und invasive Pflanzen durch Mustererkennung schnell zu markieren. Das System hat die im Feld verbrachte Zeit um 50 % reduziert und eine Erkennungsgenauigkeit von 95 % für invasive Arten erreicht. Es wird derzeit zur Entfernung des Europäischen Wasserkastanienbaums eingesetzt und soll auf andere prioritäre invasive Arten ausgeweitet werden.\n*   **CSEM, Universität Zürich, ZHAW und weitere Partner (Projekt \"Neophyten-Radar\")**: Ein Forschungskonsortium, bestehend aus CSEM, der Universität Zürich, der Zürcher Hochschule für Angewandte Wissenschaften (ZHAW) sowie der SBB ",
    "pages": [
      "https://www.uni-osnabrueck.de/fb6/mathematik/aktuelles/aktuelles-nicht-loeschen/detail-news-nicht-loeschen/2026/09/drohnen-und-ki-fuer-den-naturschutz-geoinformatiker-der-uni-osnabrueck-suchen-invasive-pflanzen-aus-der-luft",
      "https://www.vbio.de/aktuelles/details/kuenstliche-intelligenz/kuenstliche-intelligenz-macht-versteckte-wald-invasion-sichtbar",
      "https://hn-nrw.org/kuenstliche-intelligenz-kartiert-invasive-baumart/",
      "https://www.uni-giessen.de/de/ueber-uns/pressestelle/pm/pm100-26invasivergoetterbaummitkikartiert",
      "https://www.hochschule-rhein-waal.de/kennenlernen/presse/news/detail/kuenstliche-intelligenz-macht-versteckte-invasion-im-wald-sichtbar",
      "https://www.ducks.ca/places/ontario/invasive-species-ai-identify-tool/",
      "https://www.zhaw.ch/de/lsfm/institute-zentren/iunr/geooekologie/vegetationsoekologie/news-und-veranstaltungen/detailansicht-news/event-news/hightech-neophyten-radar-mit-drohnen-und-ki-invasive-pflanzen-aufspueren",
      "https://www.csem.ch/de/presse/mit-drohnen-und-ki-invasive-pflanzen-aufspueren/",
      "https://www.aktuelle-technik.ch/mit-drohnen-und-ki-invasive-pflanzen-aufspueren-a-e9ffc31ebecd47ba479f9eecf246dcd0/",
      "https://www.youtube.com/watch?v=IJmxYYTeLvE"
    ]
  },
  {
    "candidate_id": "C2",
    "question": "Priorisierung von Neophytenbekämpfung basierend auf Naturschutzdaten",
    "status": "ok",
    "answer": "Die Priorisierung der Neophytenbekämpfung basiert auf verschiedenen naturschutzfachlichen Kriterien und Daten, um die effektivsten Maßnahmen zum Schutz der heimischen Biodiversität zu gewährleisten.\n\nWesentliche Entscheidungskriterien für prioritäre Bekämpfungsmaßnahmen umfassen den naturschutzfachlichen Wert und den rechtlichen Schutzstatus des betroffenen Lebensraums. Ebenso spielen das Ausbreitungs- und Beeinträchtigungspotenzial der Neophyten am Wuchsort sowie die Gefahr der Fernausbreitung in schutzwürdige Gebiete eine Rolle. Eine Kosten-Nutzen-Abwägung der Bekämpfungsmaßnahmen ist ebenfalls Teil der Priorisierung.\n\nDie Europäische Union hat mit der EU-Verordnung 1143/2014 eine \"Unionsliste\" invasiver gebietsfremder Arten erstellt, die aufgrund ihrer erheblichen nachteiligen Auswirkungen auf die Biodiversität oder damit verbundene Ökosystemleistungen ein koordiniertes Vorgehen erfordern. Auch nationale Behörden wie das Bundesamt für Naturschutz (BfN) bewerten gebietsfremde Arten für Deutschland und erstellen entsprechende Fachgrundlagen. Eine Art wird als invasiv gelistet, wenn ihre negativen Auswirkungen eine bestimmte Schadensschwelle überschreiten, beispielsweise wenn mindestens eine heimische Art in ihrem Bestand gefährdet wird.\n\nInvasive Neophyten können heimische Arten verdrängen, Vegetationsstrukturen und Nahrungsbeziehungen verändern und Ufer destabilisieren, was zu erhöhter Erosion führen kann. Das IPBES Global Assessment stuft invasive gebietsfremde Arten als einen der fünf Faktoren mit den größten Auswirkungen auf die Natur ein.\n\nKonkrete Beispiele für die Priorisierung finden sich in regionalen Konzepten. Der Kanton Basel-Landschaft nutzt beispielsweise eine Matrix, die die Bekämpfung von Neophyten nach Art und betroffener Zone (z.B. Naturschutzgebiete, Gewässerufer, Waldflächen, landwirtschaftliche Flächen, Infrastrukturbereiche) priorisiert. Diese Matrix legt fest, ob Bestände eliminiert, die Weiterverbreitung verhindert und Bestände reduziert oder stabilisiert werden sollen, oder ob keine aktive Bekämpfung notwendig ist.\n\nDas Management invasiver Neophyten zielt darauf ab, negative Auswirkungen zu verhindern, einzudämmen oder zu beseitigen und die Ausbreitung zu begrenzen. Dabei ist die Dokumentation der Auswirkungen und des Ausbreitungsgrades der Neophyten gemäß EU-Verordnung erforderlich. Während Naturschutzfachkräfte aufgrund ihrer Erfahrung die Zweckmäßigkeit und den Erfolg von Bekämpfungsmaßnahmen gut beurteilen können, fehlt lokal",
    "pages": [
      "https://umwelt.bremen.de/sixcms/media.php/13/2b_Tesch-Gutachten_Neophyten%20Bremen%20Text-Endf%202019-08a.pdf",
      "https://www.nationalpark-eifel.de/cache/dl-Bericht-Zum-Umgang-mit-Neobiota-und-Zielarten-in-N-c64a5ca25173e3a3cf9f4a1053e3692a.pdf",
      "https://www.stiftung-naturschutz.de/naturschutz/koordinierungsstelle-fauna/invasive-arten",
      "https://www.nabu.de/tiere-und-pflanzen/artenschutz/invasive-arten/unionsliste.html",
      "https://www.landwirtschaftskammer.de/landwirtschaft/naturschutz/biodiversitaet/neophyten/index.htm",
      "https://www.sias.lu/de/naturschutz/biologische-station/mein-beitrag-fur-eine-vielfaltige-umwelt/invasive-arten-neophyten",
      "https://www.infoflora.ch/de/neophyten/neophyten.html",
      "https://bl-api.webcloud7.ch/politik-und-behorden/direktionen/bau-und-umweltschutzdirektion/umweltschutz-energie/neobiota/informationen-fuer-gemeinden/downloads/priorisierung_neophyten_bl_2021-02-17.pdf?_t=1728309101392",
      "http://www.flora-deutschlands.de/Publikationen/Neophyten%20OEKO-L%202-2017.pdf"
    ]
  },
  {
    "candidate_id": "C5",
    "question": "Bioakustik Monitoring invasive Arten Insekten",
    "status": "ok",
    "answer": "Bioakustisches Monitoring ist eine wissenschaftliche Disziplin, die akustische Signale nutzt, um Informationen über die Umwelt zu gewinnen, einschließlich der Überwachung von Insekten und invasiven Arten. Diese Methode untersucht die Lauterzeugung von Tieren, den Informationsgehalt ihrer Laute und deren ökologische Bedeutung.\n\n**Anwendung bei Insekten und invasiven Arten:**\nDie Bioakustik ermöglicht die Überwachung der Insektenaktivität, die Identifizierung von Arten und die Bewertung von Populationen. Insbesondere für invasive gebietsfremde Arten (IAS) ist das Passive Akustische Monitoring (PAM) ein vielseitiges und effektives Werkzeug, um grundlegende Populationsdaten zu erfassen und diese Arten über große räumliche und zeitliche Skalen hinweg zu erkennen und zu überwachen.\n\n**Technologien und Projekte:**\n*   **Insect Activity Detection System (IADS):** Dieses System nutzt die Schallemissionsanalyse, um holzzerstörende Insekten zu erkennen. Es misst hochfrequente Schallimpulse, die von fressenden Larven erzeugt werden, wenn sie Holzfasern durchtrennen. Diese Geräusche liegen in einem Frequenzbereich von 20.000 Hz bis 2.000.000 Hz und sind für Menschen nicht hörbar, können aber störungsfrei gemessen werden.\n*   **Künstliche Intelligenz (KI) und maschinelles Lernen:** KI-basierte Klassifikationsalgorithmen werden eingesetzt, um große Mengen akustischer Daten zu verarbeiten und Arten automatisch zu identifizieren. Dies ist entscheidend, da die manuelle Auswertung großer Datenmengen eine enorme Herausforderung darstellt.\n*   **KInsecta:** Ein interdisziplinäres Forschungsprojekt, das Multisensorsysteme (optisch, mechanisch, akustisch) und maschinelles Lernen kombiniert, um Insekten zu zählen, zu erkennen und ihre Artenvielfalt digital und automatisiert zu erfassen. Das Projekt verfolgt einen Open-Source-Ansatz und bindet Bürgerwissenschaftler ein.\n*   **Automated Remote Biodiversity Monitoring Network (ARBIMON):** Dieses System integriert Hardware und Software zur automatisierten Datenerfassung, -verwaltung und Artidentifikation basierend auf Audioaufnahmen von Vögeln, Fröschen, Insekten und Säugetieren.\n\n**Vorteile und Herausforderungen:**\nBioakustisches Monitoring bietet den Vorteil, dass es nicht-invasiv ist, eine langfristige Überwachung ermöglicht und auch in schwer zugänglichen oder abgelegenen Gebieten eingesetzt werden kann. Es kann dazu beitragen, Veränderungen in der Artenzusammensetzung und -häufigkeit sowie in der Phänologie zu erkennen und als F",
    "pages": [
      "https://www.waldwissen.net/de/lebensraum-wald/naturschutz/monitoring/bioakustisches-monitoring",
      "https://www.htw-dresden.de/luc/forschung/bioakustik",
      "https://www.mdpi.com/2076-3417/16/11/5176",
      "https://dl.gi.de/server/api/core/bitstreams/9b3ddd67-6a73-4b60-a638-ba1b9054a7ed/content",
      "https://dl.gi.de/items/d3ca672f-9edc-4c0b-80f5-0af34ed3746c",
      "https://www.youtube.com/watch?v=4i3t0MdznHg",
      "https://kinsecta.org/",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC3719130/",
      "https://www.oeaw.ac.at/news/wie-die-oekoakustik-die-artenvielfalt-ueberwacht",
      "https://www.museumfuernaturkunde.berlin/en/research/projects/integration-of-bio-acoustic-methods/",
      "https://www.mdpi.com/2072-4292/14/18/4565",
      "https://groli.de/wir-schreiben-geschichte-akustische-dedektion-nach-der-begasung/",
      "https://insectactivitydetectionsystem.de/",
      "https://www.biodiversa.eu/wp-content/uploads/2024/01/D2.11_IAS-Pilot-Midterm-Report.pdf"
    ]
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld topic_check, Teil 1 (laut gespeicherter Datei):
[
  {
    "term": "invasive",
    "hits": [
      "[protokoll, score 1] **Invasives-Scout / FloraScan** (florascan-invasive-webgpu) — Browser-Native Erkennung invasiver Neophyten — besetzt",
      "[grab, score 1] FloraScan / Invasives-Scout (Browser-Native Neophyten-Erkennung)",
      "[dose, score 1] Fugenduell: Asphaltritzen-Arena",
      "[kandidat, score 1] Invasive Plant Species Pocket Identifier & Reporting Guide"
    ]
  },
  {
    "term": "rubinien",
    "hits": []
  },
  {
    "term": "species",
    "hits": [
      "[protokoll, score 0.6] EnergyMap Berlin heute + `energymap4py` — verengt",
      "[dose, score 0.6] Dossier: Environmental Anomaly Detector for Citizen Science and Municipalities",
      "[dose, score 0.6] ChemGefahr-Stopp / MischStop (ChemHazard Stop)",
      "[dose, score 0.6] Umsetzungsplan-Register",
      "[dose, score 0.6] Wet Ink"
    ]
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld contract_version, Teil 1 (laut gespeicherter Datei):
"1.0.0"

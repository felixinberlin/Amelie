# Proposals from plan lab-2026-10-10-amelie-lab-inversion-inversion-20260930T100431-0c956a-e97a4dfff64d876e

Packet: amelie-lab-inversion-inversion-20260930T100431-0c956a-e97a4dfff64d876e · Candidate: amelie-lab-inversion-inversion-20260930T100431-0c956a-e97a4dfff64d876e
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] inversion: amelie-lab-inversion-inversion-20260930T100431-0c956a-e97a4dfff64d876e. Absicht: Jamlitz, Lieberose. Modell: gemini-2.5-flash. Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Originalfeld run_id, Teil 1 (laut gespeicherter Datei):
"inversion-20260930T100431-0c956a"
- [06-suche/amelie-lab-protokoll.md] Originalfeld intent, Teil 1 (laut gespeicherter Datei):
"Jamlitz, Lieberose"
- [06-suche/amelie-lab-protokoll.md] Originalfeld model, Teil 1 (laut gespeicherter Datei):
"gemini-2.5-flash"
- [06-suche/amelie-lab-protokoll.md] Originalfeld created_at, Teil 1 (laut gespeicherter Datei):
"2026-09-30T10:10:09Z"
- [06-suche/amelie-lab-protokoll.md] Originalfeld state_missing, Teil 1 (laut gespeicherter Datei):
[]
- [06-suche/amelie-lab-protokoll.md] Originalfeld plan, Teil 1 (laut gespeicherter Datei):
{
  "area": "Jamlitz, Lieberose",
  "mode_list": [
    "Digitale Gedenkstätte für das KZ Jamlitz",
    "KI-gestützte Wildtierbeobachtung in der Lieberoser Heide",
    "Führungssystem (Audio/App) für die Lieberoser Heide und das Schloss Lieberose",
    "Erkennung und Kartierung von Kampfmitteln in der Lieberoser Heide",
    "Besucherlenkung und Naturschutzinformationen für die Lieberoser Heide",
    "Digitales Inventar der lokalen Flora und Fauna",
    "Früherkennungssysteme für Waldbrände in der Lieberoser Heide",
    "Bürgerwissenschaftliche Plattform zur Biodiversitätserfassung in der Region",
    "Historische Aufarbeitung der Entwicklung von Lieberose und Jamlitz",
    "Tourenplanung und Informationssystem für Spreewald-Tourismus in der Umgebung",
    "Management von invasiven Arten in Schutzgebieten der Lieberoser Heide",
    "Pädagogische Materialien zur Geschichte des Konzentrationslagers"
  ],
  "target_queries": [
    "Brandenburg Satzung über Ausgleichsabgaben Grünausgleich",
    "Landesbauordnung Brandenburg Abstandsflächen Paragraphen",
    "Verordnung über Verkehrssicherungspflichten für Wege in Gemeinden Brandenburg"
  ],
  "class_hint": "A"
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld target, Teil 1 (laut gespeicherter Datei):
{
  "target": {
    "name": "Flächenpoolverordnung (FPV) Brandenburg zur Kompensation von Eingriffen in Natur und Landschaft",
    "source_url": "https://bravors.brandenburg.de/de/verordnungen-212442",
    "source_label": "Klasse A: Satzung",
    "anchor_class": "A",
    "who_pays": "Bauherren und Investoren, die in Natur und Landschaft eingreifen, durch Kompensationsmaßnahmen oder Ausgleichszahlungen.",
    "who_carries_burden": "Gemeinden und Landkreise tragen den bürokratischen und personellen Aufwand für die Verwaltung, Prüfung und Überwachung der Kompensationsmaßnahmen, oft ohne ausreichende Ressourcen.",
    "where_data_stops": "Informationen über erfolgte Kompensationsmaßnahmen und deren ökologische Wirksamkeit enden oft in lokalen Akten, PDF-Berichten von Gutachtern oder proprietären GIS-Systemen, die nicht öffentlich zugänglich oder vernetzt sind.",
    "blind_spot": "Die tatsächliche Langzeitwirkung und Qualität der Kompensationsmaßnahmen nach ihrer initialen Umsetzung wird selten systematisch und flächendeckend erfasst und bewertet, da hierfür keine dauerhaften Finanzierungs- oder Monitoring-Mechanismen existieren, die nicht direkt an ein Bauprojekt gekoppelt sind."
  },
  "operator": "OP-4",
  "thesis": "Das System wird umgekehrt, indem die fehlende kommunale Vollzugskapazität durch eine partizipative Überwachung und Dokumentation der Langzeitwirkung von Ausgleichsmaßnahmen durch die Zivilgesellschaft gestützt wird.",
  "candidates": [
    {
      "id": "C1",
      "idea": "Eine App, die Bürgerinnen und Bürgern ermöglicht, den Zustand und die Entwicklung von Kompensationsflächen mittels Fotos und einfachen Beobachtungsdaten zu dokumentieren, basierend auf den Vorgaben der FPV.",
      "why_now": "Fortschritte in der automatischen Bilderkennung (z.B. zur Klassifizierung von Vegetationstypen, Artenreichtum oder Flächenzustand) auf mobilen Endgeräten und die Verfügbarkeit von Open-Source-GIS-Bibliotheken, die präzise Georeferenzierung auch ohne teure Hardware ermöglichen.",
      "recipient": "Stiftung NaturSchutzFonds Brandenburg",
      "recipient_kind": "institution",
      "check_queries": [
        "Bürgerwissenschaft Naturbeobachtung App Kompensationsflächen",
        "Citizen science app ecological restoration monitoring"
      ]
    },
    {
      "id": "C2",
      "idea": "Ein KI-gestütztes Tool, das aus einer Reihe von Zeitrafferfotos einer Kompensationsfläche automatisch eine Prognose über den ökologischen Reifegrad und die Zielerreichung der Maßnahme erstellt, basierend auf historischen Referenzdaten.",
      "why_now": "Zeitreihenanalyse und prädiktive Modelle mittels Machine Learning, die aus visuellen Daten Entwicklungsverläufe ableiten können, kombiniert mit immer besser verfügbaren Satellitenbildern und Drohnenaufnahmen als Referenzmaterial.",
      "recipient": "Landesamt für Umwelt Brandenburg",
      "recipient_kind": "agency",
      "check_queries": [
        "KI Prognose ökologischer Reifegrad Kompensationsmaßnahmen",
        "AI predictive modeling ecological succession restoration"
      ]
    },
    {
      "id": "C3",
      "idea": "Eine offene Plattform, die alle in Brandenburg genehmigten Kompensationsflächen und -maßnahmen (anonymisiert) kartiert, deren Status anzeigt und die Möglichkeit zur Eingabe von Mängelmeldungen durch die Öffentlichkeit bietet, die direkt an die zuständigen Behörden weitergeleitet werden.",
      "why_now": "Interaktive Web-GIS-Plattformen mit Open-Source-Komponenten (z.B. Leaflet, OpenLayers) sind heute kostengünstig zu implementieren und erlauben die Integration von Bürger-Feedback-Systemen mit moderner API-Anbindung an behördliche Fachverfahren.",
      "recipient": "Ministerium für Landwirtschaft, Umwelt und Klimaschutz Brandenburg",
      "recipient_kind": "agency",
      "check_queries": [
        "Transparenzportal Ausgleichsmaßnahmen Brandenburg",
        "Public platform ecological compensation mapping"
      ]
    },
    {
      "id": "C4",
      "idea": "Ein 'Ausgleichsmaßnahmen-Tagebuch' für Gemeinden, das die regelmäßige Kontrolle und Dokumentation des Zustands von Ausgleichsflächen durch kommunale Mitarbeiter oder beauftragte Ehrenamtliche strukturiert und vereinfacht, inklusive Erinnerungsfunktionen und Fotodokumentation.",
      "why_now": "Leichte Entwicklung von Low-Code/No-Code-Lösungen für digitale Formulare und Workflow-Automatisierung, die auf mobilen Geräten laufen und Offline-Funktionen bieten, sodass Daten auch ohne ständige Internetverbindung im Feld erfasst werden können.",
      "recipient": "Brandenburgischer Städte- und Gemeindebund",
      "recipient_kind": "association",
      "check_queries": [
        "Digitale Erfassung Kompensationsflächen Gemeinde",
        "Mobile app for municipal ecological monitoring"
      ]
    },
    {
      "id": "C5",
      "idea": "Ein 'Eingriffs-Kompensations-Checker' für Bauherren und Genehmigungsbehörden, der basierend auf den Planungsdaten und den Vorgaben der FPV automatisch den rechnerischen Bedarf an Ausgleichsflächen oder -zahlungen ermittelt und mögliche Synergien mit bestehenden Maßnahmen vorschlägt.",
      "why_now": "Automatisierte Regelwerke und Expertensysteme, die komplexe rechtliche Vorgaben und Berechnungsgrundlagen digital abbilden können, sowie die Integration von Geodaten-Services zur schnellen Ermittlung von Flächenpotenzialen.",
      "recipient": "Bauaufsichtsbehörden der Landkreise Brandenburg",
      "recipient_kind": "agency",
      "check_queries": [
        "Automatisierte Berechnung Ausgleichsabgabe Naturschutz",
        "Environmental impact compensation calculator"
      ]
    },
    {
      "id": "C6",
      "idea": "Ein Gamification-Ansatz für Schulklassen und Jugendgruppen, um 'ihre' lokale Kompensationsfläche über einen längeren Zeitraum zu betreuen, mit Anreizen für regelmäßige Beobachtungen und Pflegemaßnahmen, deren Wirkung dann wiederum in die offizielle Dokumentation einfließt.",
      "why_now": "Entwicklung von Gamification-Plattformen, die mit geografischen Daten arbeiten und Aufgaben, Belohnungen sowie soziale Interaktionen ermöglichen. KI kann dabei helfen, die Qualität der eingereichten Daten zu bewerten und Feedback zu geben.",
      "recipient": "NABU Landesverband Brandenburg",
      "recipient_kind": "association",
      "check_queries": [
        "Gamification Naturschutz Schülerprojekte",
        "Educational app ecological monitoring schools"
      ]
    },
    {
      "id": "C7",
      "idea": "Ein 'Monitoring-Standard-Kit' für Ehrenamtliche und Vereine, das kostengünstige Sensoren (z.B. für Bodenfeuchte, Licht, Temperatur) mit einer einfachen App zur Erfassung von Vegetationsdaten und Tierbeobachtungen kombiniert, um eine fundiertere Langzeitdokumentation zu ermöglichen.",
      "why_now": "Verfügbarkeit von kostengünstiger IoT-Hardware und Sensorik, die über Bluetooth oder WLAN Daten an mobile Apps senden kann, sowie verbesserte Machine-Learning-Modelle zur Analyse von Umweltdaten, die auch von Nicht-Experten erfasst wurden.",
      "recipient": "Dachverband der brandenburgischen Naturparke",
      "recipient_kind": "association",
      "check_queries": [
        "Citizen Science Umweltmonitoring Kit",
        "Low-cost environmental sensor kit for volunteers"
      ]
    },
    {
      "id": "C8",
      "idea": "Eine virtuelle 'Begehung' von Kompensationsflächen mittels 360-Grad-Fotos oder Drohnenaufnahmen, die automatisch mit Informationen aus der Genehmigung und dem Monitoring verknüpft werden, um den Zustand auch aus der Ferne nachvollziehbar zu machen.",
      "why_now": "Fortschritte in der Photogrammetrie und 3D-Modellierung aus Drohnenbildern, kombiniert mit WebGL-basierten 3D-Viewern, die eine immersive Darstellung großer Flächen im Browser ermöglichen. KI kann dabei Objekte und Veränderungen im Zeitverlauf erkennen.",
      "recipient": "Technische Universität Berlin, Fachgebiet Landschaftsplanung",
      "recipient_kind": "institution",
      "check_queries": [
        "Virtuelle Besichtigung Ausgleichsflächen Drohne",
        "Drone-based 360 virtual tour ecological sites"
      ]
    },
    {
      "id": "C9",
      "idea": "Ein 'Öko-Konto'-System für Gemeinden und Landkreise, das die angehäuften 'Ökopunkte' aus Kompensationsmaßnahmen und deren Verbrauch transparent verwaltet, um eine bessere Übersicht über die regionale 'Ökobilanz' zu erhalten und den Handlungsbedarf sichtbar zu machen.",
      "why_now": "Blockchain-ähnliche Technologien oder verteilte Ledger-Systeme können die Transparenz und Unveränderlichkeit von Ökopunkt-Transaktionen gewährleisten, während gleichzeitig moderne Datenbanken eine schnelle Aggregation und Analyse der Daten ermöglichen.",
      "recipient": "Landesplanungsamt Brandenburg",
      "recipient_kind": "agency",
      "check_queries": [
        "Ökopunkte Verwaltungssystem Gemeinde",
        "Ecological credit tracking system municipality"
      ]
    }
  ],
  "shortlist": [
    "C1",
    "C3",
    "C8",
    "C9"
  ]
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld result, Teil 1 (laut gespeicherter Datei):
{
  "survivors": [
    {
      "candidate_id": "C3",
      "rank": 1,
      "idea": "Eine offene Plattform, die alle in Brandenburg genehmigten Kompensationsflächen und -maßnahmen (anonymisiert) kartiert, deren Status anzeigt und die Möglichkeit zur Eingabe von Mängelmeldungen durch die Öffentlichkeit bietet, die direkt an die zuständigen Behörden weitergeleitet werden.",
      "gap": "Es fehlt eine systematische Möglichkeit für die Öffentlichkeit, den Zustand und etwaige Mängel von Kompensationsflächen direkt an die zuständigen Behörden zu melden und dadurch die Langzeitwirkung zu überwachen.",
      "gap_stands_alone": true,
      "who_has_problem": "Gemeinden und Landkreise, die den Aufwand für Verwaltung und Überwachung von Kompensationsmaßnahmen tragen, sowie die Öffentlichkeit, die sich beteiligen möchte.",
      "why_now": "Interaktive Web-GIS-Plattformen mit Open-Source-Komponenten und API-Anbindung an behördliche Fachverfahren sind kostengünstig umsetzbar.",
      "buildable": "Ja, die technischen Komponenten (Web-GIS, Feedback-System, API-Anbindung) sind etabliert und können integriert werden.",
      "recipient": "Ministerium für Landwirtschaft, Umwelt und Klimaschutz Brandenburg",
      "recipient_kind": "agency",
      "evidence_urls": [
        "https://geoportal.brandenburg.de/detailansichtdienst/render?view=gdibb&url=https%3A%2F%2Fgeoportal.brandenburg.de%2Fgs-json%2Fxml%3Ffileid%3DFBD2224B-C64A-48F4-9BF4-24696BBDD2F3",
        "https://lfu.brandenburg.de/lfu/de/aufgaben/natur/planungs-und-genehmigungsverfahren/ekis/",
        "https://bravors.brandenburg.de/de/verordnungen-212442"
      ]
    },
    {
      "candidate_id": "C8",
      "rank": 2,
      "idea": "Eine virtuelle 'Begehung' von Kompensationsflächen mittels 360-Grad-Fotos oder Drohnenaufnahmen, die automatisch mit Informationen aus der Genehmigung und dem Monitoring verknüpft werden, um den Zustand auch aus der Ferne nachvollziehbar zu machen.",
      "gap": "Die effektive Überwachung der Langzeitwirkung und Qualität von Kompensationsmaßnahmen wird durch fehlende Ressourcen für regelmäßige Vor-Ort-Begehungen erschwert, wodurch der Zustand aus der Ferne schwer nachvollziehbar ist.",
      "gap_stands_alone": true,
      "who_has_problem": "Gemeinden und Landkreise, die Kompensationsmaßnahmen überwachen müssen, aber personelle und finanzielle Engpässe haben.",
      "why_now": "Fortschritte in Photogrammetrie, 3D-Modellierung aus Drohnenbildern und WebGL-basierte 3D-Viewer ermöglichen immersive Darstellungen und KI zur Erkennung von Veränderungen.",
      "buildable": "Ja, Drohnen-basierte 3D-Modellierung und virtuelle Rundgänge sind etablierte Technologien und werden bereits im Naturschutz eingesetzt.",
      "recipient": "Technische Universität Berlin, Fachgebiet Landschaftsplanung",
      "recipient_kind": "institution",
      "evidence_urls": [
        "https://www.dronetix.de/drohnenvermessung/3d-modellierung",
        "https://www.aerofly-innovations.com/3d-modellierung",
        "https://nationalpark.ch/forschung/drohnen-im-naturschutz/",
        "https://www.bfn.de/publikationen/broschuere/drohnen-und-naturschutz-informationen-fuer-die-drohnennutzung",
        "https://bravors.brandenburg.de/de/verordnungen-212442"
      ]
    },
    {
      "candidate_id": "C9",
      "rank": 3,
      "idea": "Ein 'Öko-Konto'-System für Gemeinden und Landkreise, das die angehäuften 'Ökopunkte' aus Kompensationsmaßnahmen und deren Verbrauch transparent verwaltet, um eine bessere Übersicht über die regionale 'Ökobilanz' zu erhalten und den Handlungsbedarf sichtbar zu machen.",
      "gap": "Gemeinden und Landkreise fehlt eine transparente, aggregierte Übersicht über die regionalen Ökopunkte aus Kompensationsmaßnahmen und deren Verbrauch, um die ökologische Gesamtbilanz und den Handlungsbedarf klar erkennen zu können.",
      "gap_stands_alone": true,
      "who_has_problem": "Gemeinden und Landkreise, die ihre regionale \"Ökobilanz\" verwalten und den Überblick über Kompensationsmaßnahmen behalten müssen.",
      "why_now": "Blockchain-ähnliche Technologien oder verteilte Ledger-Systeme ermöglichen transparente und unveränderliche Transaktionen, während moderne Datenbanken schnelle Aggregation und Analyse erlauben.",
      "buildable": "Ja, die Implementierung von verteilten Ledger-Systemen und modernen Datenbanken für Transparenz und Datenaggregation ist technisch machbar.",
      "recipient": "Landesplanungsamt Brandenburg",
      "recipient_kind": "agency",
      "evidence_urls": [
        "https://bravors.brandenburg.de/de/verordnungen-212442",
        "https://mleuv.brandenburg.de/mleuv/de/umwelt/natur/eingriffsregelung/flaechenpools/"
      ]
    }
  ],
  "kills": [
    {
      "candidate_id": "C1",
      "reason": "Die Idee eines Bürgerwissenschafts-App zur Dokumentation von Kompensationsflächen ist bereits durch die AuFi-App in Bayern umgesetzt und deckt den Kern der Funktionalität ab.",
      "failed_checks": [
        "in_mode_or_dense"
      ]
    }
  ],
  "log_row": {
    "target": "Flächenpoolverordnung (FPV) Brandenburg zur Kompensation von Eingriffen in Natur und Landschaft",
    "anchor_class": "A",
    "operator": "OP-4",
    "candidates": 9,
    "survivors": 3,
    "best_gap": "Es fehlt eine systematische Möglichkeit für die Öffentlichkeit, den Zustand und etwaige Mängel von Kompensationsflächen direkt an die zuständigen Behörden zu melden und dadurch die Langzeitwirkung zu überwachen."
  },
  "retro": {
    "learned": "The distinction between a system providing data and one enabling public feedback/reporting is crucial when assessing uniqueness against existing government portals. New technologies like DLTs can justify an idea even if the underlying concept (e.g., ecological accounting) exists.",
    "mistake": "Initially, I considered EKIS WebGIS for C3 too broadly, almost killing it, but the specific \"Mängelmeldungen durch die Öffentlichkeit\" aspect made it unique enough.",
    "next_time": "For public-facing data portals, explicitly check if a public feedback/reporting mechanism is present in the \"prior art\", beyond just data provision."
  }
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld tool_calls, Teil 1 (laut gespeicherter Datei):
[
  {
    "call_id": "inversion-20260930T100431-0c956a-t01",
    "tool": "bib_find",
    "status": "ok",
    "summary": "lieberos"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t02",
    "tool": "bib_find",
    "status": "ok",
    "summary": "jamlitz"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t03",
    "tool": "search",
    "status": "ok",
    "summary": "Brandenburg Satzung über Ausgleichsabgaben Grünausgleich"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t04",
    "tool": "search",
    "status": "ok",
    "summary": "Landesbauordnung Brandenburg Abstandsflächen Paragraphen"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t05",
    "tool": "search",
    "status": "ok",
    "summary": "Verordnung über Verkehrssicherungspflichten für Wege in Gemeinden Brandenburg"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t06",
    "tool": "bib_find",
    "status": "ok",
    "summary": "basieren, einfache"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t07",
    "tool": "bib_find",
    "status": "ok",
    "summary": "basieren"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t08",
    "tool": "bib_find",
    "status": "ok",
    "summary": "behörden, kartiert"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t09",
    "tool": "bib_find",
    "status": "ok",
    "summary": "behörden"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t10",
    "tool": "bib_find",
    "status": "ok",
    "summary": "begehung, monitori"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t11",
    "tool": "bib_find",
    "status": "ok",
    "summary": "begehung"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t12",
    "tool": "bib_find",
    "status": "ok",
    "summary": "erhalten, gemeinde"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t13",
    "tool": "bib_find",
    "status": "ok",
    "summary": "erhalten"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t14",
    "tool": "search",
    "status": "ok",
    "summary": "Bürgerwissenschaft Naturbeobachtung App Kompensationsflächen"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t15",
    "tool": "search",
    "status": "ok",
    "summary": "Transparenzportal Ausgleichsmaßnahmen Brandenburg"
  },
  {
    "call_id": "inversion-20260930T100431-0c956a-t16",
    "tool": "search",
    "status": "ok",
    "summary": "Virtuelle Besichtigung Ausgleichsflächen Drohne"
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld accounting, Teil 1 (laut gespeicherter Datei):
{
  "model_calls": 10,
  "search_calls": 6,
  "search_queries": 23,
  "cost_usd": 0.091216
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld log_entry, Teil 1 (laut gespeicherter Datei):
"<!-- proposed by the Lab's Inversion agent, run inversion-20260930T100431-0c956a; nothing was written to Amélie -->\n| 2026-09-30 | Lab | Flächenpoolverordnung (FPV) Brandenburg zur Kompensation von Eingriffen in Natur und Landschaft (Klasse A) | OP-4 | 9 | 3 (ungeprüft): 1. Eine offene Plattform, die alle in Brandenburg genehmigten Kompensationsflächen und -maßnahmen (anonymisiert) kartiert, deren Status anzeigt und die Möglichkeit zur Eingabe von Mängelmeldungen durch die Öffentlichkeit bietet, die direkt an die zuständigen Behörden weitergeleitet werden. (→ Ministerium für Landwirtschaft, Umwelt und Klimaschutz Brandenburg); 2. Eine virtuelle 'Begehung' von Kompensationsflächen mittels 360-Grad-Fotos oder Drohnenaufnahmen, die automatisch mit Informationen aus der Genehmigung und dem Monitoring verknüpft werden, um den Zustand auch aus der Ferne nachvollziehbar zu machen. (→ Technische Universität Berlin, Fachgebiet Landschaftsplanung); 3. Ein 'Öko-Konto'-System für Gemeinden und Landkreise, das die angehäuften 'Ökopunkte' aus Kompensationsmaßnahmen und deren Verbrauch transparent verwaltet, um eine bessere Übersicht über die regionale 'Ökobilanz' zu erhalten und den Handlungsbedarf sichtbar zu machen. (→ Landesplanungsamt Brandenburg) | Es fehlt eine systematische Möglichkeit für die Öffentlichkeit, den Zustand und etwaige Mängel von Kompensationsflächen direkt an die zuständigen Behörden zu melden und dadurch die Langzeitwirkung zu überwachen. |\n\n### Inversion run inversion-20260930T100431-0c956a — 2026-09-30 (intent: Jamlitz, Lieberose)\n- **Learned:** The distinction between a system providing data and one enabling public feedback/reporting is crucial when assessing uniqueness against existing government portals. New technologies like DLTs can justify an idea even if the underlying concept (e.g., ecological accounting) exists.\n- **Mistake:** Initially, I considered EKIS WebGIS for C3 too broadly, almost killing it, but the specific \"Mängelmeldungen durch die Öffentlichkeit\" aspect made it unique enough.\n- **Next time:** For public-facing data portals, explicitly check if a public feedback/reporting mechanism is present in the \"prior art\", beyond just data provision.\n- **Prior-art leads (automatic search, for the existence check; not a verdict):**\n  - C1 (ok): Bürgerwissenschaft Naturbeobachtung App Kompensationsflächen -> https://www.lbv.de/files/user_upload/Bilder/Ausgleichsflaechen/2022/Aktiv%20f%C3%BCr%20Ausgleichsfl%C3%A4chen%20-%20Ein%20Leitfaden.pdf, https://www.lbv.de/naturschutz/standpunkte/ausgleichsflaechen/aufi/, https://www.lbv.de/news/details/1-000-meldungen-mit-der-unserer-app-aufi/, https://play.google.com/store/apps/details?id=com.spobster2&hl=de\n  - C3 (ok): Transparenzportal Ausgleichsmaßnahmen Brandenburg -> https://geoportal.brandenburg.de/detailansichtdienst/render?view=gdibb&url=https%3A%2F%2Fgeoportal.brandenburg.de%2Fgs-json%2Fxml%3Ffileid%3DFBD2224B-C64A-48F4-9BF4-24696BBDD2F3, https://lfu.brandenburg.de/lfu/de/aufgaben/natur/planungs-und-genehmigungsverfahren/ekis/, https://lamadretierra.de/ausgleich-kompensation/ausgleichsmassnahmen-umsetzen/, https://wwholz.com/flaechen/\n  - C8 (ok): Virtuelle Besichtigung Ausgleichsflächen Drohne -> https://www.dronetix.de/drohnenvermessung/3d-modellierung, https://www.aerofly-innovations.com/3d-modellierung, https://www.autarc.energy/wissen/drohnenaufnahme-zum-3d-modell, https://www.virtual-tour.at/drohnen-aufnahmen/\n"
- [06-suche/amelie-lab-protokoll.md] Originalfeld prior_art, Teil 1 (laut gespeicherter Datei):
[
  {
    "candidate_id": "C1",
    "question": "Bürgerwissenschaft Naturbeobachtung App Kompensationsflächen",
    "status": "ok",
    "answer": "Several citizen science apps in Germany and Austria facilitate nature observation, and at least one specifically addresses compensation areas.\n\nThe **AuFi (Ausgleichsflächen-Finder) app** from the Landesbund für Vogel- und Naturschutz in Bayern e.V. (LBV) is a web application designed to help users find and report on compensation areas in Bavaria, Germany. This app allows users to view information about designated compensation and replacement areas from the ecological area cadastre and to report their own observations. The LBV reported a successful first year for the AuFi web app in early 2022, with users reporting 1,000 compensation areas across Bavaria, demonstrating significant voluntary participation. The app aims to increase transparency regarding intervention regulations, allowing individuals to access information on target conditions and responsible authorities for compensation measures.\n\nBeyond specific compensation area monitoring, numerous other citizen science apps contribute to nature observation and biodiversity research in German-speaking regions:\n*   The **naturbeobachtung.at-App** by Naturschutzbund Österreich enables users to quickly and easily photograph and report animal and plant sightings, contributing to biodiversity research in Austria. Experts review these submissions, making the data usable for scientific purposes.\n*   The **Naturblick app** from the Museum für Naturkunde Berlin allows users to record observations of urban animals and plants. It includes features for identifying species through image and sound recognition and provides identification guides for various flora and fauna.\n*   The **NABU Vogelwelt App**, developed by Sunbird Images in collaboration with NABU (Naturschutzbund), is Germany's most popular birdwatching app. It supports annual nationwide biodiversity campaigns like the \"Garden Bird Count\" and \"Insect Count,\" with hundreds of thousands of participants contributing to understanding species abundance and distribution.\n*   The **MonViA project** in Germany is developing a citizen science-based monitoring tool to involve farmers and other rural actors in documenting biodiversity indicators on farms. This initiative aims to increase data on target species in agricultural landscapes and raise awareness about biodiversity.\n*   The **LandSense project** is building a Citizen Observatory for Land Use & Land Cover (LULC) monitoring, connecting citizens with satellite imagery to improve environmental decision-making. It",
    "pages": [
      "https://www.lbv.de/files/user_upload/Bilder/Ausgleichsflaechen/2022/Aktiv%20f%C3%BCr%20Ausgleichsfl%C3%A4chen%20-%20Ein%20Leitfaden.pdf",
      "https://www.lbv.de/naturschutz/standpunkte/ausgleichsflaechen/aufi/",
      "https://www.lbv.de/news/details/1-000-meldungen-mit-der-unserer-app-aufi/",
      "https://play.google.com/store/apps/details?id=com.spobster2&hl=de",
      "https://naturschutzbund.at/naturbeobachtung-at.html",
      "https://www.museumfuernaturkunde.berlin/en/programme/citizen-science/",
      "https://sunbird.tv/citizen-science/",
      "https://eu-cap-network.ec.europa.eu/citizen-science-based-monitoring-agricultural-biodiversity-tool_en",
      "https://citizenscience.eu/project/29"
    ]
  },
  {
    "candidate_id": "C3",
    "question": "Transparenzportal Ausgleichsmaßnahmen Brandenburg",
    "status": "ok",
    "answer": "The \"Transparenzportal Ausgleichsmaßnahmen Brandenburg\" refers to the \"Eingriffs- und Kompensationsflächen-Informationssystem (EKIS WebGIS)\" of the State of Brandenburg. This specialized information system is maintained by the Landesamt für Umwelt (State Office for Environment).\n\nThe primary purpose of EKIS WebGIS is to collect and provide factual and geoinformation regarding approved interventions in nature and landscape, as well as the corresponding compensation measures. These measures are established during project approvals to offset or replace unavoidable impairments to protected natural and landscape assets, in accordance with § 15 of the Federal Nature Conservation Act (BNatSchG).\n\nWithin the system, interventions are represented as points, and compensation areas are depicted as polygons. The data links the interventions to their assigned compensation measures. The legal foundation for this system is § 17 Abs. 6 BNatSchG, in conjunction with § 3 of the Naturschutzzuständigkeitsverordnung (NatSchZustV). The recording of mandated measures in EKIS allows the nature conservation authority to verify their implementation and current status.\n\nVarious organizations and companies, such as WWHolz, Flächenagentur Brandenburg GmbH, and Madre Tierra, are involved in providing or implementing compensation measures in Brandenburg, often utilizing or contributing to the information related to these measures.",
    "pages": [
      "https://geoportal.brandenburg.de/detailansichtdienst/render?view=gdibb&url=https%3A%2F%2Fgeoportal.brandenburg.de%2Fgs-json%2Fxml%3Ffileid%3DFBD2224B-C64A-48F4-9BF4-24696BBDD2F3",
      "https://lfu.brandenburg.de/lfu/de/aufgaben/natur/planungs-und-genehmigungsverfahren/ekis/",
      "https://lamadretierra.de/ausgleich-kompensation/ausgleichsmassnahmen-umsetzen/",
      "https://wwholz.com/flaechen/",
      "https://www.flaechenagentur.de/",
      "https://www.flaechenagentur.de/leistungen/"
    ]
  },
  {
    "candidate_id": "C8",
    "question": "Virtuelle Besichtigung Ausgleichsflächen Drohne",
    "status": "ok",
    "answer": "Drohnen werden zunehmend für die virtuelle Besichtigung und Modellierung von Flächen eingesetzt, was auch auf Ausgleichsflächen angewendet werden kann. Diese Technologie ermöglicht die Erstellung von fotorealistischen und präzisen 3D-Modellen sowie virtuellen Rundgängen.\n\nDie Grundlage dafür ist oft die Photogrammetrie, ein Verfahren, das aus Hunderten von überlappenden Drohnenfotos präzise 2D- und 3D-Modelle berechnet. Drohnen, die für solche Aufgaben geeignet sind, verfügen über Kameras mit mindestens 12 Megapixeln, GPS und eine automatische Flugroutenplanung. Die Genauigkeit der erstellten 3D-Modelle kann dabei ein bis drei Zentimeter betragen.\n\nAnbieter wie Dronetix erstellen fotorealistische 3D-Modelle und digitale Zwillinge, die BIM-ready und CAD-kompatibel sind, für Planung, Präsentation und Dokumentation. Aerofly Innovations bietet ebenfalls realistische 3D-Modelle per Drohne für Planung, Analyse und Visualisierung an, die direkt in Planungssoftware integriert werden können.\n\nIm Bereich des Immobilienmarketings werden Drohnenaufnahmen bereits für 360-Grad-Fotos und virtuelle Touren genutzt, um Kunden neue Perspektiven zu bieten. Ein Konzept des \"virtuellen Tourismus\" ermöglicht es Nutzern sogar, die Blickrichtung und das Tempo einer Drohne mit Kopfbewegungen zu steuern, um das Gefühl zu vermitteln, vor Ort zu sein.\n\nAuch im Naturschutz finden Drohnen Anwendung, beispielsweise zur kostengünstigen Erfassung hochauflösender räumlicher Daten, Luftbilder und digitaler Geländemodelle. Dies umfasst die Überwachung von Wildtieren, natürlichen Prozessen, die Schätzung der Pflanzenvielfalt oder die Kartierung invasiver Arten. Das Bundesamt für Naturschutz (BFN) weist darauf hin, dass Drohnen für das Monitoring im Naturschutz eingesetzt werden können.\n\nDie Nutzung von Drohnen in Schutzgebieten erfordert jedoch eine sorgfältige Planung und Berücksichtigung von Vorschriften, da viele alpine Regionen, Nationalparks und Natura-2000-Zonen für Drohnenflüge gesperrt sind oder nur mit Sondergenehmigung beflogen werden dürfen.",
    "pages": [
      "https://www.dronetix.de/drohnenvermessung/3d-modellierung",
      "https://www.aerofly-innovations.com/3d-modellierung",
      "https://www.autarc.energy/wissen/drohnenaufnahme-zum-3d-modell",
      "https://www.virtual-tour.at/drohnen-aufnahmen/",
      "https://virtual-house.at/drohnenfluege/",
      "https://www.youtube.com/watch?v=tT93Id_7tjo",
      "https://nationalpark.ch/forschung/drohnen-im-naturschutz/",
      "https://www.zenadrone.com/de/umweltueberwachung-und-naturschutz/",
      "https://www.bfn.de/publikationen/broschuere/drohnen-und-naturschutz-informationen-fuer-die-drohnennutzung",
      "https://www.oeamtc.at/presse/oeamtc-ungetruebtes-gipfelerlebnis-mit-drohne-80947097"
    ]
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld topic_check, Teil 1 (laut gespeicherter Datei):
[
  {
    "term": "lieberos",
    "hits": []
  },
  {
    "term": "jamlitz",
    "hits": []
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld contract_version, Teil 1 (laut gespeicherter Datei):
"1.0.0"

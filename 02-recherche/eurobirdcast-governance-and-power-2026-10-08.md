# EuroBirdCast: Institutionelle Macht- und Entscheidungslandkarte & Konzeptionelle Schärfung

**Stand: 8. Oktober 2026.** Ergänzende Governance- und Systemanalyse für das Dossier [`05-dosen/eurobirdcast.md`](../05-dosen/eurobirdcast.md).

---

## 1. Konzeptionelle Schärfung: Das Multi-Skalen-System ("Vogelwetter")

### Die Falle: Warum der reine "Offshore-Abschalt-Autopilot" scheiterte
Das Bundesamt für Naturschutz (BfN, FKZ 3519 86 0500) lehnte wetterradarbasierte automatische Windkraft-Abschaltungen am 30.09.2026 endgültig ab:
1. **Räumlich-vertikale Auflösung:** C-Band-Wetterradar scannt primär in 200 bis 2.000 m Höhe mit kilometergroßen Voxel-Volumina. Die Rotorblatt-Gefahrenzone (50–250 m) wird durch Bodenechos (*Ground Clutter*) und Strahlkrümmung im Nahbereich überblendet.
2. **Artenblindheit:** Wetterradar misst aggregierte Reflektivität ($\eta$) und Biomasse/Dichte, kann jedoch keine gesetzlich geschützten Einzeltiere (Rotmilan, Seeadler, Sterntaucher) von häufigen Singvögeln oder Insekten unterscheiden.
3. **Haftung:** Ein vollautomatisierter Abregelungsbefehl auf Basis grober Radardaten ist unter dem Bundes-Immissionsschutzgesetz (BImSchG) rechtlich nicht standfest und führt zu Entschädigungsansprüchen der Windparkbetreiber.

### Die tragfähige Architektur: EuroBirdCast als synoptische Makro-Frühwarnschicht
EuroBirdCast positioniert sich **nicht** als Mikrosensor an der Turbine, sondern als **synoptische Wetter- und Vorwarnschicht**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Makro-Ebene: Synoptische Frühwarnschicht (EuroBirdCast)               │
│ • C-Band Wetterradar (DWD / EUMETNET OPERA) + Aloft VPTS               │
│ • 24–48 h Vorwarnung synoptischer Massenzugwellen (>500 Vögel/km/h)    │
│ • Adressaten: Übertragungsnetzbetreiber (Redispatch-Vorhaltung),       │
│   Kommunen ("Lights Out"), Flugsicherung / Bundeswehr (BIRDTAM)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Situational Awareness
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Meso-/Mikro-Ebene: Lokale On-Site Detektion & Abschaltung             │
│ • Dediziertes Vogelradar (X-Band / Robin Radar) & KI-Kameras           │
│   (IdentiFlight, gem. § 45b BNatSchG für Rotmilan/Seeadler)            │
│ • Reale Triggerschwelle für SCADA-Trudelmodus (< 2 U/min)              │
│ • BImSchG-konforme Nebenbestimmung an der einzelnen Turbine            │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Netzstabilität & Redispatch-Planung:** Ein plötzlicher Abschaltbefehl ganzer Gigawatt-Offshore-Cluster gefährdet die Frequenzstabilität (50 Hz). Übertragungsnetzbetreiber (TSOs) benötigen 24 bis 48 Stunden Vorlauf, um Regelreserve und Redispatch-Kapazitäten am Strommarkt zu kontrahieren.
2. **Öffentliche Kontroll-Baseline (Auditierbarkeit):** Aktuell betreiben Windparkbetreiber interne Betriebstagebücher. EuroBirdCast liefert den unabhängigen, zivilgesellschaftlichen Maßstab: Wenn die synoptische Radarkarte eine massive Zugnacht anzeigt, können Genehmigungsbehörden und Verbände prüfen, ob behördliche Abschaltauflagen eingehalten wurden.
3. **Sektorübergreifender Schutz:**
   - **Kommunales "Lights Out":** Großflächige Abschaltung von Hochhaus- und Fassadenbeleuchtungen (Frankfurt, Hamburg, Berlin) bei vorhergesagten Zugwellen.
   - **Luftfahrt & Flugsicherheit:** Synergie mit dem Geoinformationsdienst der Bundeswehr (ZGeoBw) und BIRDTAM-Warnstufen.

---

## 2. Macht- und Entscheidungslandkarte: Wer entscheidet wirklich?

Die institutionelle Macht über die Implementierung, Regulierung und Durchsetzung verteilt sich auf vier Ebenen:

| Ebene | Akteure & Institutionen | Formale & Operative Macht | Relevanz für EuroBirdCast |
| :--- | :--- | :--- | :--- |
| **1. Datenhoheit & Sensorik** | **DWD** (Deutscher Wetterdienst) & **EUMETNET / OPERA** | Hoheit über 17 deutsche C-Band-Radarstationen; Open-Data-Mandat (§ 10 DWD-Gesetz). | Ohne Latenz- und unterbrechungsfreie Radardatenströme existiert keine operative Vorhersage. |
| | **INBO / Aloft / CROW** (Peter Desmet, Judy Shamoun-Baranes) | Wissenschaftliche Standards, `vol2bird` und VPTS-Pipelines. | Methodenführerschaft und internationale Datenintegration (CC0). |
| **2. Regulierung & Recht** | **BMUV** & Landesumweltministerien (Niedersachsen, SH, MVP, Brandenburg) | Erlass von Verwaltungsvorschriften (TA Luft) und Windenergie-Erlassen. | Immissionsschutzbehörden erteilen BImSchG-Genehmigungen mit Abschaltauflagen. |
| | **Niederlande (EZK & Rijkswaterstaat)** *(Präzedenzfall!)* | Gesetzliche Anordnung von Offshore-Abschaltungen. | **Die europäische Blaupause:** Per *Staatscourant 2026, 2036* wird in NL bei vorhergesagten Zugwellen eine Abregelung (< 2 U/min, max. 60 h/Jahr) für Windparks (Borssele, Hollandse Kust, IJmuiden Ver) durch den Minister verbindlich angeordnet. |
| **3. Operative Steuerung** | **Übertragungsnetzbetreiber (TSOs)**: 50Hertz, TenneT, Amprion, TransnetBW | Netzsicherheit, Redispatch-Freigabe, Bilanzkreisabrechnung. | Brauchen 24–48 h Vorwarnung zur Koordination mit den Kraftwerksbetreibern. |
| | **Windparkbetreiber**: RWE Offshore, Ørsted, Vattenfall, EnBW | SCADA-Zentralen; direkte Pitch-Steuerung der Rotorblätter. | Führen die eigentliche Abschaltung an den Turbinen durch. |
| **4. Evidenz & Klagerechte** | **DDA / ornitho.de** (Wahl, König) | Bürgerwissenschaftliche Bodenerfassung & akustisches Monitoring (NocMig). | Liefert die notwendige Boden- und Art-Validierung zu den Radarsignalen. |
| | **Anerkannte Umweltverbände** (NABU, BUND, DUH) | Verbandsklagerecht nach UmwRG gegen unzureichende Genehmigungen. | Treiben Betreiber über Klagen und Gutachten zur Akzeptanz moderner Monitoringsysteme. |

---

## 3. Der konkrete Transformationspfad

1. **Referenz auf den niederländischen Rechtsrahmen:** Nutzung der Erkenntnisse aus dem niederländischen Modell (*Staatscourant 2026, 2036* / FlySafe / UvA), wo eine flexible Schwelle und die Einbindung von TenneT bereits erprobt sind.
2. **Brücke über DBU / mFUND:** EuroBirdCast als neutrale Open-Source-Infrastruktur pilotieren, die DWD-Rohdaten, Aloft-VPTS-Algorithmen und offene Netzdaten zusammenführt.
3. **Audit-Schnittstelle für Landesbehörden:** Bereitstellung eines verifizierbaren Prüfwerkzeugs für staatliche Umwelt- und Immissionsschutzämter zur Überprüfung von Zugnächten.

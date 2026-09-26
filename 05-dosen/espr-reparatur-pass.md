---
status: Available
delivery_method: E-Mail
target_maker: Runder Tisch Reparatur e.V.
---
# Reparatur-Lotse (ESPR Citizen Shield)

## Das Problem
Ab 2026/27 führt die EU im Rahmen der Ecodesign for Sustainable Products Regulation (ESPR) schrittweise den Digital Product Passport (DPP) ein, beginnend mit Textilien, Batterien und Elektronik. Hersteller müssen detaillierte Informationen zu Materialien, Lebensdauer, Reparaturanleitungen und Entsorgung digital hinterlegen, meist erreichbar über QR-Codes oder NFC-Tags. Während Marktaufsichtsbehörden und Zoll diese Daten zur Compliance-Prüfung nutzen und Startups Plattformen für den Weiterverkauf (z.B. Phoenix-Nexus) bauen, fehlt den Konsumenten ein verständliches Werkzeug, um diese Datenflut im Alltag zu nutzen. Die Asymmetrie bleibt bestehen: Der Hersteller stellt die Daten bereit, aber der Bürger hat kein Tool, das ihm diese Daten im Moment der Kaufentscheidung (Erkennung geplanter Obsoleszenz) oder bei einem Defekt (schnelle, lokale Reparaturanleitungen) in verwertbarer Form präsentiert.

## Warum das jetzt möglich ist (Der Hebel)
Die ESPR zwingt Hersteller, strukturierte, maschinenlesbare Daten (häufig im Semantic-Web-Format oder als JSON) für ihre Produkte öffentlich zugänglich zu machen. Bisher waren Informationen über geplante Lebensdauer, Verfügbarkeit von Ersatzteilen oder genaue Materialzusammensetzungen Betriebsgeheimnisse oder tief in PDFs vergraben. Mit der Bereitstellung dieser Datenpunkte per offenem Standard (wie dem kommenden EU DPP core ontology) entsteht eine völlig neue Datenquelle, auf die ein On-Device-Scanner direkt zugreifen kann.

## Die Lücke (Die Idee)
**Reparatur-Lotse** invertiert das Compliance-Werkzeug der Behörden in ein "Citizen Shield" (OP-2). Anstatt nur Daten für den Zoll vorzuhalten, scannt der Bürger den DPP-QR-Code (z.B. an einer Waschmaschine oder einer Jacke) mit einer datensparsamen, lokalen App. Die App liest die DPP-Metadaten aus und übersetzt sie in klare, bürgernahe Handlungsanweisungen:
- **Obsoleszenz-Check:** Wie lange garantiert der Hersteller Updates und Ersatzteile? Liegt die geplante Lebensdauer unter dem Durchschnitt?
- **Reparatur-Brücke:** Verknüpfung der DPP-Identifikationsnummer mit offenen Reparatur-Datenbanken (z.B. iFixit, Open Repair Alliance), um sofort Schritt-für-Schritt-Anleitungen anzuzeigen.
- **Rechts-Assistenz:** Falls die garantierte Lebensdauer nicht erreicht wurde, generiert die App direkt aus den DPP-Daten ein formelles Mängel- oder Kulanzschreiben.

## Wer es schon versucht hat
EU-Pilotprojekte und erste Startups (wie *open-dpp* oder *Phoenix-Nexus*) arbeiten intensiv an der DPP-Infrastruktur. Phoenix-Nexus nutzt QR-basierte Identität für Elektronik-Geräte, fokussiert sich aber auf Garantie, Eigentumsnachweise und Weiterverkauf, nicht auf den Endnutzer-Reparatur-Check bei Defekt. Das *CIRPASS-2* Konsortium entwickelt die semantischen Standards. Ein datenschutzfreundliches Endnutzer-Werkzeug, das diese Standards als "Citizen Shield" gegen Obsoleszenz wendet, existiert bislang nicht.

## Wo es kippt (Risiken)
Die genauen semantischen Ontologien und Datenstrukturen des DPP werden aktuell noch in delegierten Rechtsakten der EU-Kommission (geplant bis Mitte 2026) verhandelt. Ein früh gebautes Werkzeug muss flexibel genug sein, um sich an die finalen Standards anzupassen. Außerdem besteht das Risiko, dass Hersteller die Daten hinter herstellereigenen "Walled Garden"-Portalen verstecken, anstatt offene JSON/RDF-Strukturen bereitzustellen, auch wenn die ESPR Interoperabilität fordert.

## Vorarbeit, die es schon gibt
- **CIRPASS-2** (European Commission, öffentlich verfügbare Drafts zur DPP Core Ontology).
- Die Open Repair Alliance (für Reparatur-Statistiken).

## Wer es bauen sollte (Empfänger)
1. **Runder Tisch Reparatur e.V.** (Berlin): Koordiniert die deutsche Vernetzung von Reparatur-Initiativen und setzt sich politisch für das Recht auf Reparatur ein. Die ideale Trägerschaft für ein Werkzeug, das Transparenz schafft.
2. **Open Repair Alliance**: Für die internationale Einbettung der Datenstruktur.

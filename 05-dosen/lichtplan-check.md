---
status: Available
delivery_method: E-Mail
target_maker: Landesumweltbehörden mit eigenem Leitfaden
review_score: 32/35
architecture_tier: Tier 1/2
source_type: Type A
---
# Lichtplan-Check

**Ein Satz:** Ein Web-Formular, das eine geplante Außenbeleuchtung (Lichttyp, Farbtemperatur, Abstrahlwinkel, Standort, Betriebszeiten) automatisch gegen die verstreuten insekten-/vogelfreundlichen Beleuchtungskriterien mehrerer Behörden und Naturschutzverbände prüft und mit Quellenangabe zeigt, wo es kippt.

**Stand:** 18.09.2026 · **Prüfen ab:** 09/2027
**Empfänger:** Landesumweltbehörden, die einen eigenen Leitfaden herausgegeben haben (z. B. Hamburg BUKEA, „Licht & Naturschutz") · nachrangig: NABU/BUND (eigene Ratgeberseiten zu insektenfreundlicher Beleuchtung), kommunale Klimaschutz-/Umweltämter bei Straßenbeleuchtungs-Umrüstung
**Verdikt:** 🎁 verschenken  
**Review:** 32/35 · Tier 1/2 · Type A (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

## Das Problem
Bauherren, Kommunen und Lichtplaner:innen sollen Außenbeleuchtung gegen Vogel- und Insektenschutz-Kriterien prüfen, aber die Kriterien (Abstrahlwinkel möglichst steil, > 70° vermeiden; Farbtemperatur ≤ 2700 K, optimal ~2200 K; Abschirmung; Betriebszeiten/Bewegungsmelder) liegen verstreut über PDF-Leitfäden mehrerer Behörden und Verbände (Hamburg BUKEA, NABU, BUND, licht.de) statt an einer Stelle. Wer keinen Lichtplaner beauftragt — die meisten privaten Bauherren, viele kleine Kommunen — hat keine Möglichkeit, eine Planung selbst schnell gegenzuprüfen.

## Warum das jetzt geht
LLMs können PDF-Leitfäden mehrerer Behörden heute strukturiert zu einem einheitlichen, quellenbelegten Kriterienkatalog zusammenführen — eine Aufgabe, die vor Kurzem noch manuelle Leitfaden-Lektüre pro Bundesland bedeutete. Der eigentliche Check selbst braucht kein ML-Modell, nur Schwellenwerte; der Aufwand liegt komplett in der Recherche, nicht im Bauen.

## Skizze
Formular: Standort (Naturnähe ja/nein, grob per Geokodierung), Leuchtentyp, Farbtemperatur (K), Abstrahlwinkel, Abschirmung ja/nein, Betriebszeiten/Bewegungsmelder → Ampel-Ergebnis pro Kriterium, mit wörtlichem Zitat der jeweiligen Leitfadenstelle und Handlungsempfehlung.
**Nicht dazu gehört:** Bilderkennung/Kamera-Analyse einer bestehenden Anlage (eigenes, viel aufwendigeres Projekt) und jeder Anspruch, ein Fachgutachten im Genehmigungsverfahren zu ersetzen.

## Erster Schritt
Die vier bis fünf Leitfäden (Hamburg BUKEA „Licht & Naturschutz", NABU „Ökologische Stadtbeleuchtung", BUND, LAI-Hinweise zu Lichtimmissionen) in eine gemeinsame Kriterientabelle mit Quellenangabe übertragen. Fertig, wenn: eine Tabelle mit Kriterium, Schwellenwert, Quelle, Quelldatum existiert, die Widersprüche zwischen den Leitfäden (z. B. 2200 K vs. 2700 K als Grenzwert) explizit markiert statt sie zu verstecken.

## Wo es kippt
Die Leitfäden widersprechen sich in Details, und ein Tool, das eine falsche Schwelle als „sicher" ausgibt, ist schlimmer als gar keins. Gegenmaßnahme: jedes Kriterium wird mit Quelle zitiert statt als eigene Wahrheit ausgegeben, und das Tool sagt an jeder Stelle klar, dass es ein Selbstcheck und kein Gutachten-Ersatz ist.

## Wer es schon versucht hat
[method: ideenrunde] Keine automatisierte Prüf-/Check-App gefunden (Suche 18.09.2026, drei Suchen: Bewertungsverfahren-Suche, Hamburg-Arbeitshilfe gezielt, Planungstool-Suche). Es gibt nur Text-Leitfäden (Hamburg BUKEA, NABU, BUND) und ein kommerzielles Beratungsangebot eines Leuchtenherstellers (TRILUX) für Kommunen — kein neutrales Self-Check-Tool.
Quellen: [Hamburg „Licht & Naturschutz"](https://www.hamburg.de/resource/blob/171416/808366fa67647cbc8ce2b010020177f7/download-licht-naturschutz-arbeitshilfe-data.pdf), [NABU Ökologische Stadtbeleuchtung](https://www.nabu.de/umwelt-und-ressourcen/energie/energieeffizienz-und-gebaeudesanierung/artenschutz/28415.html), [BUND SH Insektenverträgliche Beleuchtung](https://www.bund-sh.de/stadtnatur/insektenvertraeglichere-beleuchtung/).

## Vorarbeit
LAI-Hinweise zur Messung, Beurteilung und Minderung von Lichtimmissionen; DIN 5032-7; Hamburg „Leitfaden Licht" (bv-hh.de); Landkreis Ansbach „Insektenfreundliche Beleuchtung" als weiteres Kriterienset.

---
Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir
nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du
nicht bauen wirst, gib sie jemandem, der es tut.
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

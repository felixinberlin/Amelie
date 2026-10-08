# Ticket 03: Zweite reale Offenlegung und kuratierter Pilot

**Komponente:** `07-demos/vernichtungs-offenlegungsregister`
**Status:** Offen
**Zuständigkeit:** Kuratierung / Umweltverbände
**Zugehörige Dose:** [Vernichtungs-Offenlegungsregister](https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister)

## Ziel / Goal

Der quellengeprüfte Kern soll an einer zweiten unabhängigen Veröffentlichung erprobt werden. Auswahl, Herkunft und unbekannte Werte bleiben nachvollziehbar. A second source tests the curated workflow; it does not establish market completeness.

## Aufgabenpakete

- Eine weitere echte Veröffentlichung mit Berichtszeitraum, Quell-URL, Abrufdatum, SHA-256 und Feld-/Seitenbelegen von Hand übertragen.
- Auswahlkriterien und Suchwege datieren; bestehenden Stand der Kommissionskonsolidierung nach ESPR Art. 26 prüfen.
- Beide Veröffentlichungen in einen reproduzierbaren lokalen Registerlauf aufnehmen.
- Vor einer Zustellung Empfängerbedarf und reale Ansprechperson verifizieren; kein Versand gehört zu diesem Ticket.

## Akzeptanzkriterien / Definition of Done

1. Zwei unabhängige reale Veröffentlichungen liegen als dokumentierte Übertragungen vor, mit Herkunft und ausdrücklich unbekannten Werten.
2. Ein datiertes Auswahlprotokoll hält Kriterien und Suchwege fest; es behauptet weder einen vollständigen Nenner noch die Pflicht einzelner Unternehmen.
3. Schema- und Engine-Regressionstests verarbeiten beide Fixtures; JSON/CSV enthalten ausschließlich die zwei neutralen Registerstatus und belegen Quellen bzw. datierte Suchwege.
4. Kein Firmenranking und keine Vollständigkeitsquote entstehen; keine Originalwerte werden still geschätzt oder korrigiert.
5. Der bestehende Leistungstest für 500 × 10 Positionen bleibt unter 100 ms. Exporte, Lint und Tests bleiben grün.

Lizenz: CC0 1.0 Public Domain.

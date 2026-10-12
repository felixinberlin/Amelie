---
status: Available
delivery_method: E-Mail
target_maker: Berliner Mieterverein e.V.
---
# LegioKlar (TrinkwV Legionellen-Aushang-Decoder)

*(englisch: LegioKlar — Stairwell Legionella Notice Board Decoder)*

**Ein Satz:** Liest abfotografierte Laborprüfberichte aus dem Treppenhausaushang ein, übersetzt KBE/100ml und Speichertemperaturen in die amtliche UBA-Risikomatrix und erzeugt sofort das rechtssichere Auskunftsersuchen zur Gefährdungsanalyse sowie die Mängelanzeige nach § 536c BGB.

**Stand:** 12.10.2026 · **Prüfen ab:** September 2027  
**Empfänger:** Berliner Mieterverein e.V. · Verbraucherzentrale NRW (Bereich Wohnen)  
**Verdikt:** 🎁 verschenken  
**Review:** 29/35 · Tier 1 · V8 Fun 3 (Aha-Effekt / Entschlüsselung) · Details: [Klassifikationslog](../06-suche/amelie-classification-log.md)

---

## Das Problem

In Mehrfamilienhäusern mit zentraler Warmwasserbereitung müssen Vermieter nach § 31 TrinkwV alle drei Jahre auf Legionellen beproben lassen. Wird der technische Maßnahmenwert von 100 KBE/100 ml erreicht oder überschritten, hängen die Verwalter oft nur wenige Tage ein unübersichtliches Laborprotokoll ins Treppenhaus. Mieter verstehen die Fachbegriffe (KBE, DVGW W 551, Entnahmestellen, Zirkulationstemperaturen) nicht und verpassen rechtzeitige Schutzmaßnahmen (z. B. Sterilfilter, Duschverbote, Mietminderung).

Gewerbliche Legionellen-Software richtet sich fast ausschließlich an Verwalter und Anlagenbetreiber. Portale für Mieter verlangen mühsame manuelle Zahleneingaben ohne Kontext.

## Warum das jetzt geht

1. **Klare amtliche Matrix:** Das Umweltbundesamt (UBA) und die novellierte TrinkwV 2023 definieren exakte Schwellenwerte (100 / 1.000 / 10.000 KBE/100 ml) und Handlungspflichten für den Betreiber.
2. **On-Device OCR & Strukturierung:** Ein lokaler Parser kann Werte und Temperaturen direkt auf dem Smartphone auslesen, ohne private Adress- oder Mietdaten in eine Cloud zu laden.
3. **Deterministischer Prüfkern:** Temperaturen an Speicher ($\ge 60\,^\circ\text{C}$) und Zirkulation ($\ge 55\,^\circ\text{C}$) lassen sich gegen DVGW W 551 abgleichen und direkt in ein formelles Auskunftsersuchen überführen.

## Skizze

- **Eingabe:** Foto oder strukturierte Werte des Prüfberichts vom Schwarzen Brett im Flur.
- **Logik:** Auslesen von KBE/100ml je Entnahmestelle, Abgleich mit der UBA-Matrix (<100 grün, 100–999 gelb, 1.000–9.999 orange, $\ge$10.000 rot), Prüfung der Speichertemperaturen gegen DVGW W 551.
- **Ausgabe:** Klare Handlungsempfehlungen für Mieter (Aerosolvermeidung, Sterilfilter, Duschverbote) und ein vorformuliertes Schreiben an die Hausverwaltung mit Berufung auf § 51 TrinkwV und § 536c BGB.

## Erster Schritt

**Ticket:** Ticket 01 abgeschlossen am 12.10.2026 (`src/engine/legio-klar/`).

Reiner TypeScript-Kern `analysiereLaborbefund(befund)` mit UBA-Matrix, DVGW-Temperaturprüfung, Mängelanzeigen-Generator und 10 Vitest-Tests. Synthetische Fixtures unter `07-demos/legio-klar/data/`.

## Wo es kippt

Rechtsberatungsgesetz (RDG): Das Tool darf keine Rechtsberatung im Einzelfall erteilen. Es liefert daher eine neutrale fachtechnische Einstufung nach den amtlichen UBA-Vorgaben und formuliert Musterschreiben, die der Mieter eigenverantwortlich anpassen kann.

## Wer es schon versucht hat

Gewerbliche Apps (Trinkwasser-App, Hydrosense, WEKA-Vorlagen) richten sich an Betreiber. Bürgerportale (legionellen-was-tun.de) erfordern isolierte manuelle Eingaben. Ein offener, lokaler Decoder für Treppenhausaushänge mit direkter Mängelanzeige fehlte.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

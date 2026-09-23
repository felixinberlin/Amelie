---
status: Available
delivery_method: E-Mail
target_maker: Netzwerk Reparatur-Initiativen
---
# KlangStethoskop

**Ein Satz:** Smartphone an die laute Heizungspumpe oder Waschmaschine halten — akustische Neuronale Netze diagnostizieren Lagerschaden oder Kavitation und zeigen die 10€-Reparatur.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Netzwerk Reparatur-Initiativen (Repair Cafés) · Bund der Energieverbraucher · Verbraucherzentrale
**Verdikt:** 🎁 verschenken

---

## Das Problem

Wenn die Umwälzpumpe der Heizung oder das Lager der Waschmaschine schleift, tauschen Installateure meist das gesamte Gerät für 800–2.000 € aus. Verbraucher können normale Laufgeräusche nicht von trivialen, leicht behebbaren Fehlern unterscheiden.

## Warum das jetzt geht

- Audio-Transformer und Spektrogramm-KI klassifizieren mechanische Frequenzspitzen und Resonanzen in Echtzeit im Browser.
- Web Audio API liefert hochpräzise FFT-Rohdaten direkt über das Smartphone-Mikrofon.
- Offene Reparaturdatenbanken von iFixit und Repair Cafés liefern verifizierte Fehler-Acoustic-Profile.

## Skizze

5 Sekunden Audioaufnahme bei laufendem Motor. Echtzeit-Wasserfall-Spektrogramm. Neuronales Modell vergleicht Frequenzen mit Fehlerdatenbank (Kavitation, Schaufelradbruch, Fremdkörper, Lagerspiel). Schritt-für-Schritt-Anleitung zur Reparatur.

## Erster Schritt

**Ticket:** P0: Spektrogramm-Visualisierung und Peak-Frequenzerkennung im Browser.

Zeigt bei laufendem Haushaltsgerät die dominante Rotationsfrequenz und deren Oberschwingungen in Hz an.

## Wo es kippt

Mikrofonverzerrung durch Übersteuerung bei lauten Motoren: App muss Nutzer warnen, das Telefon 20 cm entfernt zu halten und Verstärkung automatisch regeln.

## Wer es schon versucht hat

Industrielle Maschinendiagnose-Systeme von SKF oder Fluke kosten 5.000 €; für normale Bürger gab es nur Ratelosigkeit.

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs klang-stethoskop`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

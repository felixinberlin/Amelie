# LegioKlar — Scaffolding & TrinkwV § 51 / § 52 Aushang-Decoder

> Liest abfotografierte Laborprüfberichte aus dem Treppenhausaushang ein, extrahiert KBE/100ml, Entnahmestellen und Warmwassertemperaturen, gleicht sie mit der offiziellen UBA-Maßnahmenmatrix ab und erzeugt die formelle Aufforderung zur Gefährdungsanalyse sowie eine rechtssichere Mängelanzeige nach § 536c BGB.
> *CC0 / Public-Domain-Geschenk für Mietervereine und Verbraucherzentralen (z. B. Berliner Mieterverein e.V., Verbraucherzentrale NRW).*
>
> *(English: LegioKlar — stairwell notice board drinking water laboratory report decoder, mapping Legionella CFU/100ml against German Federal Environment Agency (UBA) matrices and generating formal risk assessment disclosure requests and defect notices.)*

Die Dose online: https://felixinberlin.github.io/Amelie/#dose=legio-klar

---

## 1. Problem & Lücke

Vermieter hängen vorgeschriebene mikrobiologische Trinkwasserbefunde oft nur wenige Tage im Treppenhaus aus. Mieter verstehen die fachchinesischen KBE-Werte, DIN-Entnahmestellen und Temperaturgrenzen nicht und verpassen rechtzeitige Schutzmaßnahmen (z. B. Sterilfilter, Duschverbote, Mietminderung).

Gewerbliche Legionellen-Software richtet sich fast ausschließlich an Verwalter und Anlagenbetreiber. Ein lokaler, datenschutzfreundlicher Decoder für den Aushang mit automatischer Ableitung der mietrechtlichen Mängelanzeige fehlte.

---

## 2. Invarianten und Sicherheitsnachweis

1. **Keine Rechtsberatung im Einzelfall:** LegioKlar gibt neutrale technische Einstufungen nach den amtlichen UBA-Empfehlungen und zitiert die einschlägigen Paragraphen der TrinkwV und des BGB, erteilt aber keine individuelle Rechtsberatung.
2. **Deterministische Ampel:**
   - `< 100 KBE/100 ml`: Grün (Normalzustand, Maßnahmenwert nicht erreicht)
   - `100 bis < 1.000 KBE/100 ml`: Gelb (Mittlere Kontamination, Maßnahmenwert nach § 51 TrinkwV erreicht)
   - `1.000 bis < 10.000 KBE/100 ml`: Orange (Hohe Kontamination, Ursachenuntersuchung und Sanierungspflicht)
   - `≥ 10.000 KBE/100 ml`: Rot (Extrem hohe Kontamination / Gefahrenwert, akute Gefahrenabwehr wie Duschverbot indiziert)
3. **Temperaturabgleich DVGW W 551:**
   - Speicheraustritt: $\ge 60\,^\circ\text{C}$
   - Zirkulationsrücklauf: $\ge 55\,^\circ\text{C}$
   - Stagnationsbereich: Vermeidung des Vermehrungsfensters $25\text{--}50\,^\circ\text{C}$
4. **Client-first & Zero-Cloud:**
   - Läuft offline im Browser. Keine Adress- oder Mietdaten verlassen das Gerät.

---

## 3. Architektur

```
Treppenhaus-Aushang (Foto / JSON)
       │
       ▼
analysiereLaborbefund()
       ├── bewerteEinzelprobe()  --> UBA-Matrix (KBE/100ml)
       └── pruefeTemperaturen()  --> DVGW W 551 Abgleich
       │
       ▼
erzeugeMieterSchreibenEntwurf()  --> BGB § 536c / TrinkwV § 51 Aufforderung
```

| Datei | Zweck |
|---|---|
| `src/engine/legio-klar/legioKlarEngine.ts` | Kern-Berechnungslogik, UBA-Matrix, Temperaturprüfung, Schreiben-Generator |
| `src/engine/legio-klar/legioKlarEngine.test.ts` | Vitest-Testsuite (10 Tests) |
| `07-demos/legio-klar/laborbefund-schema.json` | JSON Schema für strukturierte Befunde |
| `07-demos/legio-klar/data/synthetischer-aushang-befund.json` | Synthetisches Testfixture (Mehrfamilienhaus 24 WE) |
| `07-demos/legio-klar/ticket-01-aushang-decoder.md` | Entwicklungsvertrag für Ticket 01 |

---

## 4. Tests ausführen

```bash
npx vitest run src/engine/legio-klar
```

---

Lizenz: CC0 1.0 Public Domain.

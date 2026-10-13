# Mail 12 — ChemHazard Stop (MischStop) → EU-OSHA (European Agency for Safety and Health at Work)

**Status:** Entwurf, neu geschrieben am 13.10.2026. **Nicht versendet.** Die alte Fassung (September 2026) versprach Kamera-Scan, Etiketten-OCR, Sprachbank in 20+ Sprachen und ein 15-Hz-Stroboskop; nichts davon ist gebaut, und 15 Hz ist ein Anfallsrisiko bei fotosensibler Epilepsie. Alte Fassung: Git-Geschichte (`370f77a`).

**Recipients:** EU-OSHA (`information@osha.europa.eu`)  
**CC:** German National Focal Point at BAuA (`eu-osha@baua.bund.de`)  
**Subject:** An open rule engine for chemical mixing warnings in cleaning work (ChemHazard Stop, CC0)

**Vor dem Versand (Regel 2):**
- `information@osha.europa.eu` ist ein Sammelpostfach, keine Person mit Mandat. Eine namentliche Ansprechperson für Dangerous Substances / Prevention auf osha.europa.eu suchen. Der einzige Name aus der Suche (Tim Tregenza, Project Manager, Reinigungskampagne) stammt aus einer alten, undatierten Präsentation und ist nicht bestätigt.
- BAuA-Adresse `eu-osha@baua.bund.de` auf baua.de bestätigen.
- EU-OSHA hat ein Praxisbeispiel „Limiting exposure to dangerous substances in the cleaning sector“ (2018, Reinigungsfirma aus Estland); es behandelt das Mischen nicht. Kein Besetzt-Signal, aber ein Anknüpfungspunkt.
- Video-Link weggelassen, solange unklar ist, ob das Video einen Kamera-Scan zeigt, den es nicht gibt.

---

```text
Dear EU-OSHA team,
dear colleagues at the German National Focal Point,

mixing an acidic toilet or descaling cleaner with a hypochlorite bleach releases chlorine gas. The rule is textbook knowledge and is written down in safety data sheets and in guidance such as the German DGUV Rule 101-019. What is missing is a check at the moment of mixing, in the language of the person holding the two bottles.

I have built a small open-source starting point for that and am giving it away under CC0 (public domain): ChemHazard Stop.

What exists today:
- A rule engine that runs without a server and is covered by tests. Given two products, it answers STOP (documented hazard, for example acid + hypochlorite), UNVERIFIED (product unknown, ambiguous or data incomplete), or a grey "no known incompatibility in our data", which is explicitly not a safety clearance. It never says "safe".
- Product data from manufacturers' safety data sheets: 45 real cleaning products (41 with sourced hazard groups, 4 still unverified), each with source URL, revision date and file hash. A product counts as chlorine bleach by its ingredient (sodium hypochlorite, CAS 7681-52-9), not by the EUH031 phrase on its label: several common bleach products do not carry EUH031, and an earlier version of the rule missed exactly those (fixed on 12 October 2026).
- A web demo in which you pick two products or enter their GTIN. On STOP it plays a warning tone, vibrates where the browser allows, and speaks the warning via the browser's speech synthesis in German, English, Ukrainian, Polish, Turkish, Arabic or Romanian.

What does not exist yet: camera scanning of the containers, recorded voice warnings, a mobile app. These are written up as open tickets. The tool is a template for others to build on, not a deployable protective system, and it does not replace training or the employer's risk assessment.

Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
Code, tests and data sources: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

If any part of it is useful for your work on dangerous substances or on cleaning workers, please take it. There is no obligation attached, not even a reply, and I will not follow up.

Kind regards,
Félix Martínez Resendiz
Amélie (open project, Berlin)
```

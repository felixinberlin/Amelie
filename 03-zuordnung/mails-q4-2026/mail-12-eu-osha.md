# Mail 12 — ChemHazard Stop (MischStop) → EU-OSHA (European Agency for Safety and Health at Work)

**Status:** Versandfertig (September 2026).  
**Recipients:** EU-OSHA (`information@osha.europa.eu`, Attn: Prevention and Research Unit / Dangerous Substances Campaign)  
**CC:** German National Focal Point at BAuA (`eu-osha@baua.bund.de`)  
**Subject:** Point-of-Action Chemical Safety for Migrant Cleaners: ChemHazard Stop (Open Gift to EU-OSHA)

---

Dear Dangerous Substances Prevention Team at EU-OSHA,
Dear Colleagues at the German National Focal Point,

Across the European Union, millions of commercial cleaners — a predominantly vulnerable, migrant workforce working non-standard hours — handle hazardous chemical formulations daily. 

Despite decades of regulatory efforts under REACH, CLP (Regulation EC 1272/2008), and national safety rules, severe mixing incidents continue to occur in confined spaces. The accidental mixture of acidic descalers with sodium hypochlorite bleaches instantly releases lethal chlorine gas (Cl2). The root cause is structural: 15-page Safety Data Sheets and national technical guidance remain locked in supervisors' folders and are inaccessible across language barriers at 3:00 AM.

To directly support EU-OSHA's mission of safe and healthy workplaces, we have built and open-sourced a turnkey, 100% offline point-of-action safety tool: ChemHazard Stop (MischStop).

We are gifting this entire project unconditionally to the European occupational health community (CC0 Public Domain):

Key Capabilities of ChemHazard Stop:
1. Instant Point-of-Action Verification: Cleaners aim their smartphone camera at two cleaning product containers (GTIN barcode, GISCODE, or label OCR). A deterministic local rule engine evaluates dangerous reaction risks on-device in <1 millisecond without requiring internet or cellular connectivity.
2. Polyglot Audio Alerts: When an incompatible pair is detected, loud spoken emergency instructions immediately trigger in the cleaner's native language (Ukrainian, Polish, Turkish, Arabic, Romanian, Bulgarian, Spanish, German, English, etc.).
3. Sensory Redundancy for Noisy Facilities: If the phone is muted or drowned out by 85 dB machinery, the handset pulses with an unmistakable emergency tactile cadence (300-100-300-100-500 ms) and flashes a high-intensity 15 Hz color optical strobe (red/white) visible even through nitrile gloves.
4. Formal Safety Case (Never Emits "Safe"): The system strictly rejects false reassurance. It never displays a green "safe" clearance. It either halts the worker on verified danger (STOP) or transparently flags incomplete data as UNVERIFIED.

Compliance & European Data Architecture:
The core engine runs on public facts from EU CLP labelling and manufacturers' safety data sheets: a product counts as chlorine bleach by its ingredient (sodium hypochlorite, CAS 7681-52-9), whether or not its label carries EUH031 ("Contact with acids liberates toxic gas"). It operates with zero tracking, zero cloud data transfer, and complete offline sovereignty.

Everything is turnkey, tested, and published under CC0 / Public Domain:
• Interactive Web Simulator & Live Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video Demonstration (Field Demonstration): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Source Code, Test Suite & Specs: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

"This idea belongs to no one. Take it, build it, deploy it across European workplaces — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will."

In solidarity for occupational health and safety across Europe,
Amélie Initiative (Félix, Berlin)

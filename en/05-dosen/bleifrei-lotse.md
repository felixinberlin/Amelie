# Lead-Free Navigator (Bleifrei-Lotse)

**One sentence:** Non-destructive on-site pipe material identification (magnet check, wiped solder joint macro photography, scratch test, acoustic tap resonance) for pre-1973 apartment buildings, generating statutory tenant disclosure requests and public health enforcement notices under German Drinking Water Ordinance § 17.

**As of:** 25 September 2026 · **Recheck by:** September 2027  
**Recipient:** **Federation of German Consumer Organisations (vzbv)** · **German Tenants Association (DMB)** · **Public Health Authorities (Gesundheitsamt Berlin-Mitte / Hygiene Dept)**  
**Verdict:** 🎁 **gift** — closes an acute statutory enforcement deficit in tenant health protection following the federal lead pipe phase-out deadline.

---

## The problem

Since **January 12, 2026**, lead pipes and lead-containing components in drinking water installations in Germany are **strictly banned and must be decommissioned or replaced** under the revised Drinking Water Ordinance (§ 17 Abs. 2 TrinkwV). Lead is a potent neurotoxin that accumulates in the human body, causing irreversible cognitive and neurological deficits in fetuses, infants, and young children.

Yet millions of tenants living in older buildings (constructed prior to 1973) face severe information asymmetry:
1. **Zero Visibility:** Risers and basement water mains sit behind locked basement doors or within vertical wall shafts. Landlords rarely disclose pipe materials proactively and frequently deny the presence of historic lead.
2. **Prohibitive Barrier:** Certified laboratory drinking water analysis (ICP-MS) costs €80–€150 and only measures point-in-time stagnation values at a single faucet, offering zero diagnostic clarity regarding basement piping.
3. **Acute Enforcement Deficit (Vollzugslücke):** Municipal public health offices (*Gesundheitsämter*) lack the inspection staff to proactively examine private residential real estate. They intervene only when provided with substantiated evidence.

## Why now

1. **Hard Statutory Deadline (12.01.2026):** Transition periods expired on January 12, 2026; retaining lead pipes is now a punishable administrative offense (*Ordnungswidrigkeit*).
2. **Web Audio Real-Time Spectral Analysis (FFT):** Lead possesses very high density ($\rho \approx 11.34\ \text{g/cm}^3$) and exceptionally high internal acoustic damping ($\eta \approx 0.015$). A light tap with a screwdriver produces a dull thud with rapid amplitude decay ($< 50\ \text{ms}$), while copper and steel resonate with high ringing overtones ($> 250\ \text{ms}$ at $> 1\ \text{kHz}$). The Web Audio API performs this frequency decay analysis client-side in real time without cloud dependencies.
3. **Macro Vision Inspection:** High-resolution mobile smartphone cameras resolve characteristic hand-worked bulbous wiped solder joints (*Wulstlötung*) and the silvery metallic sheen of fresh scratch marks under oxidized gray patina.
4. **Zero-Cloud & GDPR:** All sensor processing executes 100% locally in the client browser. No photos or tenancy addresses leave the device.

## Sketch

Guided 4-step diagnostic decision tree:
1. **Construction Era Filter:** Building erected prior to 1973 in West Germany (1878–1935 in East Germany).
2. **Magnet Pre-Filter:** A household or neodymium magnet is placed against the exposed pipe. Magnet sticks $\to$ Galvanized steel (lead ruled out, process ends). Magnet does not stick $\to$ Lead, copper, or plastic.
3. **Optical & Scratch Test:** Guided photo comparison. Lead is dull gray, soft, and easily scratched with a coin to reveal a bright silvery line; joints feature characteristic wiped bulbous solder lumps.
4. **Acoustic Resonance Test:** Smartphone microphone records a 2-second audio snippet. Tap pipe with screwdriver $\to$ FFT spectral analysis measures damping decay and overtone ring.

**Output:**
* **Lead Probability Score:** Clear / Suspect / Critical.
* **Formal Tenant Disclosure Request:** Statutory letter template citing landlord disclosure duties under TrinkwV § 17 Abs. 6 Satz 3.
* **Health Department Enforcement Docket:** Pre-filled official notice for municipal health authorities to trigger formal inspection orders under TrinkwV § 64.

**Not included:** No chemical ICP-MS certified laboratory guarantee, no forensic expert legal testimony, no automatic rent reduction deductions without prior formal notification of defect.

## First step

**Ticket: Standalone decision tree with Web Audio FFT resonance analyzer and PDF generator.**

- **Scope:** Single-page TypeScript application.
- **Features:**
  1. Magnet exclusion logic and scratch mark color-matching canvas.
  2. AudioContext worklet measuring impulse decay time (threshold $\tau < 60\ \text{ms}$ = high damping).
  3. Client-side PDF export of statutory tenant notifications under TrinkwV § 17.
- **Done when:** On sample audio files of lead, copper, and galvanized pipes, the damping discriminator correctly distinguishes lead in 9 out of 10 cases, and the exported PDF matches legal notification requirements under § 17 Abs. 6 TrinkwV without error.

## Where it breaks

**False Accusation:** A tenant scratches a tinned copper pipe or painted galvanized steel, mistakenly diagnoses lead, and enters an escalatory legal dispute with building management.

*Remedies:*
1. **Mandatory Magnet Pre-Filter:** Galvanized steel is ferromagnetic; lead and copper are not. This instantly eliminates 90% of false positives before any scratching.
2. **De-escalatory Statutory Tone:** The generated document is framed strictly as a neutral **"Statutory Request for Information pursuant to TrinkwV § 17 Abs. 6"**, asking for plumbing documentation, rather than an aggressive accusation.
3. **Immediate Risk Mitigation:** When suspect lead is flagged, the app instructs tenants to flush stagnant water until cold and avoid giving tap water to infants until certified tests confirm safety.

## Who has already tried this

**Verdict `narrowed` (25 Sep 2026):**
- **Consumer Protection & Tenants Associations:** Publish informational text articles, but uniformly advise paying €100 for private lab tests or hiring lawyers due to lack of diagnostic tooling.
- **Municipal Health Departments (Kassel, Hannover, Bautzen, Augsburg):** Provide online portals (e.g. NOLIS smartForms) targeted strictly at certified plumbing companies under § 17 Abs. 6 TrinkwV. Proactive residential inspections do not occur due to staffing shortages.
- **US EPA Lead & Copper Rule Inventories:** US utilities deploy ArcGIS Survey123 forms for citizen self-reporting with magnets and screwdrivers. These portals harvest data for utilities but offer tenants no actionable legal framework.

**The remaining gap:** A guided, privacy-first mobile citizen diagnostic suite translating physical acoustic/optical indicators into enforceable rights under the statutory Drinking Water Ordinance.

## Prior art

- **TrinkwV 2023:** BGBl. 2023 I Nr. 159; § 17 (lead pipe phase-out), § 64 (health authority enforcement orders).
- **German Environment Agency (UBA):** Official guidance on lead in drinking water.
- **Acoustic Material Parameters:** Lead density $\rho \approx 11.34\ \text{g/cm}^3$, speed of sound $c \approx 1200\ \text{m/s}$, damping factor $\eta \approx 0.015$ (Copper: $\rho \approx 8.96$, $c \approx 4700$, $\eta \approx 0.001$).
- **US EPA LCRI:** Lead Service Line Identification Protocols.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

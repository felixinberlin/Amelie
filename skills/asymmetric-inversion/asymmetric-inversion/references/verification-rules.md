# Verification Rules & Search Standards

Rigorous search order, stopping rules, and evidence standards for the Asymmetric Inversion Protocol.

---

## 1. The 4-Search Sequence

Never perform more than four searches per candidate idea. Suchen are expensive and risk confirmation bias. If four targeted queries do not find a direct counterpart, the candidate is either free or the search terms were flawed.

### Search 1: The Presumptive Recipient (Internal Kill)
* **Goal**: Check if the organization we want to give this to is already building it.
* **Query Format**: `<Name of Institution / Agency / NGO> <Core Technology / Keyword> (KI | AI | App | Projekt)`
* **Example**: `CityLAB Berlin Sperrmüll` or `Senckenberg Krautschau App`.
* **Lesson from Amélie Round 2**: In 3 of 12 cases (Wheelmap, CompGen, Repair Café), the intended recipient had an internal initiative underway. Finding this immediately saves wasted outreach and preserves relationship capital.

### Search 2: German Functional Verification (Civil / Administrative)
* **Goal**: Find domestic non-profits, municipal portals, or university research prototypes.
* **Query Format**: What the tool *does* in everyday German verbs, NOT what it is named.
* **Avoid**: Buzzwords ("Smarte Nachbarschaftsplattform").
* **Use**: Exact functional terms: `Lärmaktionsplan Straßenabschnitt Zeitfenster messen` or `Vogelschlag Fassade Bewertung Rechner`.

### Search 3: English Product Search (The Commercial Frontier)
* **Goal**: Catch commercial VC-backed startups and mature US civic apps.
* **Query Format**: `<Function in English> app free OR open source (2024 OR 2025 OR 2026)`
* **Rule from Playbook Round 4**: For any idea touching daily consumer or neighborhood life, **this becomes Search 1**. The US market builds consumer concepts 12–24 months before Europe (e.g. CurbAlert, SoundPrint). If a US commercial app exists, evaluate its business model: does it monetize through accounts/tracking? If yes, the zero-account public commons variant is `verengt`, not `besetzt`.

### Search 4: Niche Community & Source Code Repositories
* **Goal**: Discover quiet indie projects under the SEO radar.
* **Platforms**: GitHub topics, Discourse forums (Akkudoktor, OpenEnergyMonitor, iNaturalist forum, Photovoltaikforum).
* **Query Format**: `site:github.com <function keywords>` or `site:community.* <problem keywords>`.

---

## 2. Stopping Rules & Verdict Definitions

| Verdict | Meaning | Action |
|---|---|---|
| **`besetzt`** | A product, library, or public project fully covers the premise, was updated $\le 12$ months ago, and is accessible. | **Kill immediately.** Move to Graveyard (`08-friedhof/`) with death certificate. Do not try to rescue the idea. |
| **`verengt`** | An existing solution covers the general topic, but possesses a **documented structural flaw** (e.g. paywalled, proprietary hardware required, locked behind account/tracking, or only works for desktop CAD). | **Carve out the exact remaining gap.** Narrow the tin to that single missing capability. |
| **`frei`** | All four search tiers returned zero direct functional equivalents, and the regulatory/institutional source confirms the problem is currently handled manually or ignored. | **Pack candidate into tin.** |
| **`unklar`** | Searches returned only noise, SEO content farms, or conflicting unverified claims. | Re-formulate search terms for next round. Never treat absence of noisy search hits as proof of `frei`. |

---

## 3. Four Cognitive Traps to Avoid

1. **The "Expensive Pro Tool vs. Nothing for Citizens" Illusion**:
   * *Trap*: Claiming that an industry tool costs €10,000 and "regular citizens have nothing".
   * *Counter*: Always run a quick search for `<Function> app free`. In 6 out of 6 cases in Amélie's catalog, a free or freemium tool already existed.
2. **The "Impossible Before AI" Fallacy**:
   * *Trap*: Claiming an idea was technically impossible before 2024.
   * *Counter*: Search `<Function> Kickstarter` or `<Function> 2015`. Many "AI ideas" were previously implemented with simple heuristics or rule-based vision.
3. **The Foreign Regulation Blind Spot**:
   * *Trap*: Assuming an idea is free because German agencies have no software.
   * *Counter*: Search international standards (LEED, NYC Local Laws, UK DEFRA). If a US or UK ordinance already generated software, examine why European tools lag behind.
4. **The "Empty Search" as Proof**:
   * *Trap*: Searching for an overly specific German neologism ("Fassaden-Vogel-Reflexions-Detektor") and finding zero hits.
   * *Counter*: Search for the underlying mechanics separately from the object.

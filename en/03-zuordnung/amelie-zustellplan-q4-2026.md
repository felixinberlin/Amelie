# Amélie — Delivery Plan Q4 2026

The first round. Three emails, three recipient types, all researched and ready to send.

---

## First: what the research changed

**The Altbau Thermal tin would have missed.** Its premise was "they crunch the numbers on buildings, but the people living inside them have no tangible tool." That's no longer true:

**EnergyMap Berlin has had a public web app since May 2025** — an interactive map, AI-based forecasting of heat demand per building, renovation options you can play through, tied into the Energieatlas. Plus a Python interface, `energymap4py`, on GitHub. And it's not a co2online project alone, but a **research consortium led by UdK Berlin**, with co2online, SEnerCon, LUP, and the Charlottenburg-Wilmersdorf district office.

An email saying "you're missing a resident-facing tool" to this team would have been the worst possible first contact: it would have shown that I don't know their work.

**The retargeted version is stronger than the old one.** EnergyMap answers *"what does this building need"* — from outside, from data. Unanswered is *"what is my apartment doing"* — from inside, from the floor plan. That's complementary rather than competing, and the existence of `energymap4py` is what turns the idea into a realistic undertaking in the first place: the apartment-level simulation no longer has to guess the building context, it can query it.

There are also two connection points that didn't exist before: **CoolingMap** (2026–2029, a cooling-demand cadastre) and **CO2OL ISLANDS** (2026–2030). The summer-direction version of the same physics — overheating, shading, night ventilation — fits right in there.

> **Lesson for the loop:** step 2 (matching) isn't "who might find this interesting," it's **"what has this group actually built most recently."** An hour of reading prevented a burned first contact here. That's exactly what the 1:2 budget rule is for.

Cross-check for the other two Berlin ideas: **Sperrmüll-Radar** — no comparable offering found, the phenomenon is present in the media, the gap exists. **Kiez-Lärmkarte** — the Berlin noise action plan 2024–2029 is being implemented; measured quiet windows are complementary to its model maps, not competing. Both tins stand as they are.

---

## Email 1 — Altbau Thermal → EnergyMap Berlin research consortium

**Recipient type:** research (rank 2). No code needed, they have students and methodology.
**Contact path:** project coordination, Prof. Dr.-Ing. Christoph Nytsch-Geusen, UdK Berlin — the address is listed as the official project contact at `energymap-berlin.de/projektpartner`.
**Attachment/link:** `dosen/altbau-thermal.md`
**Concrete reference:** the web app since May 2025, `energymap4py`, the validation paper at BauSIM 2026, CoolingMap.

> **Subject:** Idea to give away: the apartment level underneath EnergyMap Berlin
>
> Dear Professor Nytsch-Geusen,
>
> I research software that's only recently become technically possible, and I build only a small part of it myself. This idea fits your consortium, not me, so I'm giving it to you.
>
> Since May 2025, EnergyMap Berlin has answered the question of what a building needs — and, with `energymap4py`, even programmatically. The question after that remains unanswered: what the individual apartment is doing. Draw a floor plan, pick a construction-era class, see what a tilted window in a Berlin room costs and at what room humidity a corner passes 80 % surface humidity. Not a competing product — it consumes your data instead of replacing it, and the summer-direction version of the same equation could connect to CoolingMap.
>
> A one-pager with a sketch, a first ticket, and the point where it goes wrong — namely false precision in five-figure renovation decisions: <link>
>
> If this is worth a student thesis: the first step (one room, validated against ISO 10211) is small enough for that.
>
> No conditions, CC0, no reciprocity expected. If you're already planning something like this, please just ignore this email — I won't follow up.
>
> Best regards,
> Félix …

---

## Email 2 — Sperrmüll-Radar + Kiez-Lärmkarte → CityLAB Berlin

**Recipient type:** organization with a build mandate and budget (rank 1).
**Contact path:** general contact address at `citylab-berlin.org/kontakt` — they route internally to the right person. **Copy the address from the site, don't guess it.**
**Attachments/links:** two tins.
**Concrete reference:** prototypes for the city, GovTech TestLAB, Kiezlabor.

> **Subject:** Two ideas to give away: Bulky-Waste Radar and Quiet-Window Map
>
> Hi CityLAB team,
>
> I research apps that couldn't have existed without the last few years of AI progress, and I build only a few of them myself. Two of them are so distinctly Berlin that they belong with you, not with me.
>
> **Sperrmüll-Radar (Bulky-Waste Radar).** "Free to take" is a working Berlin protocol without a single server: a box, a curb, a sign. The only thing missing is knowing where one is right now. Photo → classification → geo-pin with a twelve-hour half-life. No accounts, no ownership, no data retention beyond the day — the decay logic is the privacy design.
>
> **Kiez-Lärmkarte (Neighborhood Noise Map).** The 2024–2029 noise action plan delivers model maps and yearly averages. But people are looking for something else: the time window in which this street is quiet. The phone microphone measures only dB levels, never audio, aggregation happens locally.
>
> One page each, with a sketch, a first ticket, and the point where it breaks: <links>
>
> Both are CC0, with no conditions attached. If either fits with GovTech TestLAB or Kiezlabor, all the better; if not, nothing is lost either. No reply needed, I won't follow up.
>
> Best,
> Félix …

---

## Email 3 — Kiez-Lärmkarte (method) → Noise-Planet / NoiseCapture

**Recipient type:** research, international (rank 2). English.
**Contact path:** via the NoiseCapture repository at Université Gustave Eiffel, or the project page `noise-planet.org`.
**Concrete reference:** their worldwide crowdsourced noise map and its methodology.

> **Subject:** Free idea: quiet windows instead of average levels
>
> Hello,
>
> I research software ideas and give away the ones I won't build myself. This one belongs with your group.
>
> NoiseCapture maps measured sound levels across the world. Official action plans, including Berlin's for 2024–2029, work with modelled yearly averages. Neither answers the question people actually ask when choosing a flat or arguing with a landlord: **when is this street quiet?**
>
> Same sensors, different question — a quiet-window map per street segment, aggregated on-device, dB levels only, never audio. The privacy-first design is not a feature to add later; it is the only version that survives contact with users.
>
> One page with the sketch, the first ticket, and the part most likely to kill it: <link>
>
> CC0, no strings, no follow-up. If this is already in your roadmap, please just ignore this.
>
> Félix, Berlin

---

## Order and dates

| When | What | Effort |
|---|---|---|
| **today** | Email 1 (UdK / EnergyMap) — the one with the highest hit probability | 20 min |
| **this week** | Set up the `amelie` repo, put in the three tins, so the links in emails 2 and 3 exist | 2 h |
| **after the repo** | Email 2 (CityLAB) and email 3 (NoiseCapture) | 30 min |
| **before Oct 1** | nothing further — the Prototype Fund pointer is already in the tins | — |
| **end of December** | quarterly review: update status, delete tins past their "recheck by" date | 30 min |

**Order logic:** email 1 doesn't need a link to a repo — the tin can go as an attachment. So it goes out today, before the infrastructure is in place. Otherwise the repo is exactly the kind of preparation that stretches indefinitely.

---

## Checklist, all three ticked off

- [x] Does it say why I'm giving this away? — yes, first sentence of every email
- [x] Concrete reference to the recipient? — web app and `energymap4py` / GovTech TestLAB and noise action plan / NoiseCapture methodology
- [x] "Where it breaks" in the tin? — yes, in all three
- [x] Recipient is a company, research group, fund, or community, **not** an unpaid solo maintainer? — yes: research consortium, foundation, research institute
- [x] License **and name** underneath? — yes
- [x] Date in the tin? — as of 9/2026, recheck by 9/2027
- [x] Does it say they don't have to reply? — yes
- [ ] Defensive publication — worth considering for Altbau Thermal, but **not blocking**: the method is prior art, the enclosure risk is low. More relevant for the noise map, since measurement methods are patentable.
- [x] No follow-up planned — really, none

---

## Status after this round

| Idea | Recipient | Status |
|---|---|---|
| Altbau Thermal | EnergyMap consortium / UdK Berlin | **delivered** 20 Sep 2026 (Mail 1) → awaiting reply |
| Sperrmüll-Radar | CityLAB Berlin | packed, tin still missing |
| Kiez-Lärmkarte | CityLAB + Noise-Planet | packed, tin still missing |

Next concrete work after email 1: write the two missing tins. An hour each, the pattern is set.

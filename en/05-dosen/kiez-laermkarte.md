# Kiez-Lärmkarte (Neighborhood Noise Map)

**One sentence:** Not how loud a street is on average over the year, but **when it's quiet** — measured by phones that capture only dB levels, never audio.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** Noise-Planet / NoiseCapture (Université Gustave Eiffel + CNRS) · in parallel: CityLAB Berlin · secondary: Prototype Fund, resident initiatives
**Verdict:** 🎁 give away — rank 2 (research) and rank 1 (CityLAB)

---

## The problem

Berlin's 2024–2029 noise action plan works with strategic noise maps: modeled yearly averages, level classes, numbers of people affected. That's right for planning and useless for people.

People ask a different question. Not "what's this street's L<sub>den</sub>," but:

- **"Can I sleep here?"** — at the flat viewing, three in the afternoon, while the bar downstairs is still closed.
- **"When can I work with the window open?"** — the quiet windows over the course of a day.
- **"Is it really as bad as I think?"** — for the complaint that's just an opinion without measurements.

A yearly average answers none of these, because it averages away the time structure — and the time structure *is* the information.

## Why now

1. **On-device aggregation.** The crucial point: the phone measures the sound pressure level and immediately discards the audio signal. What reaches the server is level values per time window, never sound. This used to be a trust question; today it's an architecture question you can transparently disclose.
2. **Calibration has become solvable.** Phone microphones vary a lot. But with enough overlap at the same locations, relative calibration works — you don't need absolute dB(A) to answer "when is it quieter here than usual."
3. **The comparison baseline exists.** Official strategic noise maps already exist. Measured data doesn't have to stand on its own, it can be checked against a model — which is what makes it credible in the first place.

## Sketch

- Measurement: dB levels in time windows, rough location, **no audio is ever stored or transmitted**, aggregation happens locally before upload.
- Analysis: a **daily profile** per street segment instead of a single number — "here it's quietest on weekdays between 10am and 3pm, never on Friday nights."
- Display: a map with a time slider. The interface is driven by "when," not "how much."
- Cross-check against the official model maps as a plausibility check, not competition.

**Not included:** no complaint function, no neighbor-reporting feature, no single-event recording. Anyone who wants audio recordings is building a different, worse product.

## First step

**Ticket: one street segment, one week, one daily profile.**

Measurement on one device, levels in five-minute windows, for one week, output as a daily profile with weekday differences.

**Done when:** the profile makes rush hour and the weekend night visible, and two devices side by side agree within 3 dB.

## Where it breaks

**Privacy isn't a feature here, it's the condition for existing at all.** The moment any audio gets stored anywhere — even just for classification, even briefly — the project is dead, and should be. The architecture has to make it technically impossible, not just prohibited by policy.

**Second risk:** calibration. If users see absolute dB values and take them for official, that creates false complaints and disappointment. Hence: relative statements ("quieter than usual here"), no official-looking numbers.

**Third risk:** density. A map with three data points is decoration. Which is why an existing community (NoiseCapture) is a better carrier than a fresh start.

## Who's already tried it

**NoiseCapture** (Université Gustave Eiffel + CNRS, open source) has run worldwide crowdsourced noise measurement with exactly this architecture for years — which is why they're a recipient, not competition. **What's missing there is the question:** their maps show measured levels, not quiet windows. Same sensors, different analysis, different interface.

Berlin's **2024–2029 noise action plan** is being implemented; measured time profiles are complementary to it, not competing.

## Prior work

- **NoiseCapture / Noise-Planet** — app, methodology, dataset, all open.
- **Strategic noise maps Berlin** and the **2024–2029 noise action plan** — the official comparison baseline.
- **CityLAB Berlin** — for the Berlin variant and access into the administration.
- **Prototype Fund** — from October 1.

**Note on defensive publication:** measurement methods are patentable. TDCommons is worthwhile for this tin before it's distributed widely.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

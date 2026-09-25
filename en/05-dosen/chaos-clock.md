---
status: Available
delivery_method: E-Mail
target_maker: Katta Spiel, HCI group at TU Wien
review_score: 30/35
architecture_tier: Tier 1
source_type: Type D
---
# Chaos Clock

**One sentence:** A Google Calendar add-on that rolls a focus mode, a duration and a free slot from your state and intent, puts the result in as a real event — and, depending on a chaos dial, plays small tricks on your calendar that you can switch off one by one. No server, no AI, all data in your own Google account.

**As of:** 24. September 2026 · **Recheck by:** März 2027  
**Recipient:** Katta Spiel, HCI group at TU Wien (ERC ACCESSTECH, 2024–2029) — as a research probe, with code · secondary: Eva Hornecker (Bauhaus-Universität Weimar, co-author of the same CHI study) · then the public (Show HN)  
**Verdict:** 🎁 **gift**  
**Review:** 30/35 · Tier 1 · Type D (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Anyone with ADHD, or simply an empty battery, who looks at their own calendar reads it as an accusation: every block is a promise about to be broken. The tools on offer nearly all want the same thing — to adjust the person to the norm, with streaks, points and usage data. The literature review "ADHD and Technology Research – Investigated by Neurodivergent Readers" (CHI 2022) found exactly that: ADHD technology mostly aims to mitigate traits that disturb neurotypical norms, and the people concerned almost never co-design it.

## Why now

- Honesty first: this does not fall under the manifesto's thesis. Chaos Clock contains no AI, and rolling dice against decision paralysis is old (dice methods on ADHD blogs in 2021, RandomTask). The clock that runs unpredictably fast was described by David Seah in 2007.
- What is new is the place: a Workspace add-on in Apps Script runs entirely inside the user's Google account — events in their own calendar, history in a sheet in their own Drive, settings in per-user storage, no network calls and no permission for them. For a study that means participants keep their data and share the sheet only if they want to.
- What is new is that it exists: v0.5.2, 47 tests green in any time zone, CC0. What is given away is not the idea but the code.

## Sketch

A sidebar in Google Calendar with five fields: intent (one sentence), energy 1–5, focus 1–5, minutes available, chaos 0–100. "Roll" picks one of six modes (Banish 2–5 min up to Gnosis 30–60 min) that the state allows — low energy never rolls Gnosis —, finds the next free slot and creates a real event; the event is the timer. Afterwards, rate flow 1–5. The chaos dial unlocks eleven tricks, each switchable: time drift, phantom slots, resurfacing, wandering events, the reluctant servitor ("Fine. I'll wait."), events in the past, echoes, prophecy, trickster roll, anti-calendar day, Sunday confession. Deliberately absent: streaks, points, countdowns, notifications — anything that makes you open the app more. Code: github.com/felixinberlin/kaosclock (Apps Script, Jest).

## First step

**Ticket:** Pilot with five people for two weeks: install (test deployment), roll at least once a day, chaos level of their choice; at the end share their own "Chaos Clock Log" sheet or not, plus one conversation about the tricks.

For each of the eleven tricks there is at least one statement on whether it landed as humour or as mockery — the tone rule tested on people for the first time, not at one's own desk.

## Where it breaks

One trick too many. An event in the past, an echo, a prophecy — for one person that is humour, for another it is the feeling of being mocked by their own calendar, and the people with the most calendar stress have the least slack for it. The tone rule ("tell a friend, they laugh and want it") has not been tested on anyone yet. Second: an add-on that writes events into a work calendar on its own will not get past admin approval in many company Workspaces, and without a Marketplace listing, installing via clasp is a hurdle the target group will not clear. Third: chaos-magick vocabulary attracts and repels — "it is a costume" has to be said in the interface, not only in the README.

## Who has already tried this

Rolling dice against decision paralysis is taken: RandomTask (web, the die picks the task, Pomodoro, streaks, Pro subscription), "Random Task Picker – ADHD Productivity Tool" (itch.io), dice methods on ADHD blogs since 2021 — none writes into the calendar or asks about your state. Planning by energy is taken: Lifestack places tasks in high-energy windows from wearable data, Tiimo is the scene's visual planner; both optimise, neither plays. There are several chaos-magick sigil apps (App Store, Google Play), none with a calendar. The unpredictably fast clock: David Seah, "A Chindogu Clock for Procrastinators" (2007), with a note about a patent on the principle. Not found: the calendar itself as a player — autonomous, switchable tricks in your real events, without a server. The Gemini dataset's "is_verified_novel: true" overstates this; the "ADHMe" webring could not be found, and the "Apathetic Genius" webring exists (Neocities, relaunched 2026) but is a ring of personal sites, not an address. Check log 24 Sep 2026: narrowed.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

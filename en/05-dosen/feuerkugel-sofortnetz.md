---
status: Available
delivery_method: E-Mail
target_maker: The American Meteor Society and the IMO
review_score: 29/35
architecture_tier: Tier 2/3
source_type: Type D
---
# Fireball Rapid Network

**One sentence:** A real-time layer over existing fireball reporting networks that actively brings witnesses together in the first minutes and rescues incidental dashcam and doorbell footage before it is automatically overwritten.

**As of:** 18. September 2026 · **Recheck by:** September 2027  
**Recipient:** The American Meteor Society and the IMO (existing reporting networks) · secondary: the Global Meteor Network, operators of existing alerting apps with a user base  
**Verdict:** 🎁 **gift**  
**Review:** 29/35 · Tier 2/3 · Type D (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

People who see a fireball report it — if at all — hours or days later through a web form, from memory, without knowing whether anyone nearby saw the same thing. The American Meteor Society itself says analysis and grouping happen after the fact. As a result most events never reach the critical mass of independent witnesses needed for a trajectory — not because too few people saw it, but because nobody brings them together in the first minutes. Meanwhile more private dashcams film the sky than any astronomical camera ever did, and their footage is overwritten within a day or two.

## Why now

- Geofenced push to everyone within a few kilometres has become standard infrastructure — weather and wildfire alerting apps do it already.
- Motion and brightness detection for "a short, very bright streak in the night sky" runs locally on dashcam chips or as a companion app, without cloud costs; the models that make it cheap enough are only one or two years old.

## Sketch

First building block, immediate recruitment: the first report triggers a geofenced push to users within about fifty kilometres, with a twenty-minute window and a structured mini form instead of free text, so the statements are comparable. Second block, ambient rescue: a small on-device detector that spots a short, very bright, fast streak and marks the clip locally against overwriting, with sharing strictly opt-in. Both feed the existing report format and do not replace institutional analysis. Not included: new camera hardware or a trajectory solver of its own.

## First step

**Ticket:** Build block one on its own: a push bot that hooks into an existing report feed and alerts nearby users when a new report arrives.

Done when one real event produces, within twenty minutes, at least one additional structured witness report that would not have existed without the push.

## Where it breaks

Block one only works if enough people installed the app beforehand — with zero users there is nobody to recruit. Remedy: dock onto an existing user base instead of launching a new app. Block two fails on false alarms from camera flashes, headlights and flicker; without a good filter, the false-positive rate exceeds the rescue rate of real events.

## Who has already tried this

Existing infrastructure explicitly covers neither block. The reporting networks collect reports through the web and group them afterwards, and state themselves that the data is not real time. FRIPON combines radio and video stations for real-time trajectories, but with purpose-installed professional stations and no active witness recruitment. All-sky camera networks run dedicated upward-facing astronomical cameras. An infrasound app covers a related but different sensor channel. Trajectory computation is taken; real-time routing of witnesses and incidental footage into those systems is not.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

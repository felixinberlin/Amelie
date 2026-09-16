# Sperrmüll-Radar (Bulky-Waste Radar)

**One sentence:** Photo of a street find → classification → a geo-pin that expires after twelve hours. No account, no ownership, no data retention beyond the day.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** CityLAB Berlin (Technologiestiftung) · secondary: BSR, OpenStreetMap Berlin, Prototype Fund
**Verdict:** 🎁 give away — rank 1, organization with a build mandate and budget

---

## The problem

Berlin has a functioning giveaway protocol without a single server: a box, a curb, a cardboard sign. It's so established that the city argues over whether it's neighborly generosity or disguised illegal dumping.

The only missing piece is knowledge of time and place. Anyone needing a shelf walks past thirty boxes that were full yesterday. Anyone putting something out doesn't know whether it'll be taken in two hours or picked up by the sanitation department in two days. The result is a cycle that's too slow: usable things sit in the rain until they become trash, and then get treated as trash.

Who suffers: the city (disposal costs, complaint volume), the districts, and everyone currently furnishing a flat with no money.

**Why nobody has built this:** there's no money in it. An app with no accounts, no inventory, and no return visits has no business model. Which is exactly why it belongs in public hands or a community.

## Why now

1. **Classification has become free.** Reading "chair, wood, still usable" from a crooked phone photo used to be its own project. Today it's an API call and runs on-device.
2. **On-device means: no images on a server.** The photo never has to leave the city; only category and coordinate do. That eliminates the entire privacy problem that would have doomed earlier attempts.
3. **Decaying data is no longer a compromise, it's cheaper.** A dataset with a twelve-hour half-life needs no moderation, no deletion policies, no accounts.

## Sketch

- Photo → on-device classification → category + rough coordinate (rounded to ~50m, never house-accurate).
- A pin lives **12 hours**, then it's gone. No history, no archive, no per-address statistics.
- "Gone" as the only interaction button: whoever sees it's no longer there taps once, the pin disappears immediately.
- A map with no login. No messaging, no reservation, no chat — the features that kill giveaway apps.

**Not included:** no marketplace, no ratings, no reservations, no profiles. Anyone who wants to negotiate uses Kleinanzeigen.

## First step

**Ticket: one district, one map, one decay cycle.**

Progressive web app: take a photo, classify on-device, drop a pin on a map, auto-delete after 12h. No backend beyond a dumb key-value store with TTL.

**Done when:** two people independently set and see pins in a neighborhood, and the map is empty the next morning.

## Where it breaks

**The abuse question comes up immediately, and it's justified:** a map saying "there's bulky waste here" is, from an administrative point of view, a map saying "there's trash here" — potentially a denunciation tool or a hotspot list. The answer has to be in the design, not the terms of service: **rough coordinates, short decay time, no history, no photos on the server.** Without these four, it's a different product and shouldn't be built.

**Second risk:** cold start. An empty map is useless, and neighborhood apps need density. So one neighborhood first, not a whole city — and an organization with local reach is the right carrier, not a solo developer.

## Who's already tried it

Research, September 2026: **no comparable offering found for Berlin.** The phenomenon is present in the media, municipal apps exist for pickup schedules (e.g. municipal sanitation apps), but not for the curb in real time. The gap exists.

## Prior work

- **CityLAB Berlin / GovTech TestLAB** — prototypes for public administration, Kiezlabor as field access.
- **BSR** — already runs bulky-waste pickups in the districts; a real-time map reduces pickup volume.
- **OpenStreetMap Berlin** (Hack Weekend) — exactly the right data understanding for decaying geo-objects.
- **Prototype Fund** — from October 1, open-source requirement, fits the scope.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

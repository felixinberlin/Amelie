---
status: Available
delivery_method: E-Mail
target_maker: The public — with a working skeleton
review_score: 29/35
architecture_tier: Tier 1
source_type: Type C
---
# Dinner Table Referee

**One sentence:** Phone in the middle of the table, agree on a word list together — when a trigger word falls it whistles and shows yellow, the second time red and a new topic. Recognition only on the device, never in the cloud.

**As of:** 24. September 2026 · **Recheck by:** März 2027  
**Recipient:** The public — with a working skeleton (manifesto, rule 4 and recipient table, last row) · channel: blog post or Show HN before the first Sunday of Advent 2026 · collected talk "Ideas I won't build" (FOSDEM)  
**Verdict:** 🔨 **build skeleton first, then gift**  
**Review:** 29/35 · Tier 1 · Type C (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Nobody wants to be the one who interrupts the father-in-law. Whoever enforces "no politics, please" at a family dinner is the bad guy; whoever stays quiet sits through last year's argument again. The apps that listen link audio to identity (Swearing Jar per its App Store label) — a deal-breaker at a private table.

## Why now

- Since version 139 Chrome recognises speech on the device (Web Speech API, `processLocally`). That makes the whole thing a web page: no server, no app, no account.
- Free word lists no longer need training: open-vocabulary keyword spotting (sherpa-onnx) or constrained offline recognition is enough.
- Honestly: this was not made possible by AI. Noche de Paz ran in 2015 as an ad-agency app, JarGone in 2018 as a device. What is new is doing it without a cloud and without installing anything.

## Sketch

Web page, three steps: agree the list, tick "everyone knows", kick-off. The browser first checks whether it can recognise offline; if not, the referee does not start (no fallback to the cloud). Matches from four letters on by word prefix ("election" also hits "elections"), eight-second cooldown per word, a second yellow within ten minutes turns red with a topic suggestion. Nothing is stored; the match log holds only word and time until the page closes. Runs as a skeleton in the Amélie app (Sandboxes tab).

## First step

**Ticket:** Test the skeleton at a real table: four people, ten minutes of conversation with a list, offline recognition in Chrome.

At least 80 % of spoken list words detected, at most two false whistles; the network tab shows no traffic during play.

## Where it breaks

False whistles. In table chatter recognition is worse than at a desk, and constrained offline models tend to force matches in German (Vosk issue #1017). If it whistles wrongly three times at the first dinner, the phone ends up in a drawer. Second risk: used secretly it is surveillance — so consent is a step in the game, not a line in the small print. Third: offline recognition currently exists only in Chrome, sometimes after a language-pack download.

## Who has already tried this

Noche de Paz / SilentNight (Shackleton agency, 2015): phone in the middle of the table, fixed list of political words, alarm and topic suggestion — the same scenario, as an ad app. JarGone (Kickstarter 2018): a device with freely entered words for the whole family. Swearing Jar (App Store, 2025): custom words in real time, groups — audio linked to identity per its store label. Swear Jar 2.0 (itch.io) and several GitHub hobby projects. What remains for this tin: guaranteed offline, German, free list without training, yellow/red as a table rule, consent as a move in the game. Check log round 9: narrowed (thin).

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

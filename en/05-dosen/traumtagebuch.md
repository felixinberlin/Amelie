# Dream Journal with a Motif Map

**One sentence:** Entries get embedded locally, recurring motifs show up as clusters over time — and nothing leaves the device. That last part is the product.

**As of:** September 2026 · **Recheck by:** March 2027 (fast-moving market)
**Recipient:** the Obsidian plugin ecosystem · secondary: the local-first scene, sleep and dream research
**Verdict:** 🔨 build first, then give away — as a plugin, not an app. Narrowed, see below.

---

## The problem

Dream journals contain some of the most intimate data a person produces — unfiltered material about fears, relationships, loss, sexuality. And the entire market for dream apps works the same way: upload an entry, get an interpretation back.

That's a remarkable imposition, and it goes unnoticed because it's the standard.

Yet the useful part isn't the interpretation at all. It's the **time series**: which motifs recur? When do they cluster? What disappears after something changes in your life? That's a pattern question, not an oracle question — and it needs no cloud.

Who suffers: anyone who wants to keep a dream journal and bails at the privacy notice. And dream research, which is interested in longitudinal data and doesn't get it, for exactly that reason.

## Why now

1. **Embeddings run locally now.** Small on-device models are enough for text similarity. Two years ago this would have needed an API — and the promise would have been broken.
2. **Motif extraction without transmission.** Pulling "water, being chased, childhood home" out of free text works locally.
3. **That turns privacy from a compromise into a feature.** Exactly the function everyone else needs a server for now runs offline. That's the only reason this tin exists.

## Sketch

- Entries as text, local. No accounts, no syncing except what the user runs themselves.
- Local embeddings, local clustering. Motifs as clusters, not a predefined symbol list.
- **Displayed as a time map:** clusters over months, spikes visible, disappearance visible. The value is in the movement, not the snapshot.
- **No interpretation.** The tool shows patterns and stays silent about their meaning. Anyone who wants to interpret does it themselves, or with another person.

**Not included:** no symbol dictionaries, no personality analysis, no mood scores, no cloud option "for convenience."

## First step

**Ticket: thirty entries, five clusters.**

Read text files, embed locally, cluster, plot the clusters over time.

**Done when:** the clusters make recognizable sense to the person who wrote the entries — and the device was offline the whole time.

## Where it breaks

**This is the most sensitive tin in the whole stack, and the danger isn't technical.** A tool that makes patterns visible in distressing material can put someone in a bad spot — recurring nightmares as a chart are a different thing from recurring nightmares. A product that notices this and offers nothing is negligent; one that offers interpretations is worse. The only defensible path is: **no evaluation, no prognosis, no flagging of anomalies** — and never give the impression, anywhere, that it can judge how someone is doing.

**Second: whoever gives this away has to give away the privacy architecture with it.** Otherwise someone builds the same interface with an API behind it, and it becomes the opposite. Passing on this tin without the "local or not at all" section would be worse than keeping it.

**Third risk, plainly:** privacy alone doesn't sell anything. As a product this is weak. As a **plugin** in an ecosystem whose users already think local-first, it's exactly right — which is why the recipient is a plugin ecosystem, not an app store.

## Who's already tried it

Research, September 2026: **the market is full and pattern recognition is occupied.** There are dream journals with AI interpretation, at least one app whose stated purpose is pattern recognition across dreams, and various journaling apps with motif analysis. On-device processing also already shows up.

**What's left is narrow, but it's the core:** no interpretation, nothing leaves the device, a time series instead of a snapshot, open and verifiable instead of promised. Whoever takes this tin isn't competing on features, but on a commitment — and that can only be honored if the code is open.

## Prior work

- **Obsidian plugin ecosystem** — the cheapest path: no product of your own, a plugin. The user base is already local-first and writes daily anyway.
- **Local-first scene** (Ink & Switch and its orbit) — looking for convincing end-user examples; "the most sensitive data imaginable, still useful" is one.
- **Dream and sleep research** — motif frequency over time is a real research interest that regularly fails on privacy grounds. A tool that does the analysis locally and only knows aggregated, voluntary contributions is an offer there.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

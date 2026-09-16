# Amélie — Ideas to the right people

**The name:** Amélie Poulain finds a tin box behind a tile, spends forty years tracking down the boy it belonged to, leaves it for him in a phone booth, and disappears. She picks the person before she makes the gift, and she never follows up afterward.

That's the whole method — with **one** departure from the film: she stays anonymous, you don't. Why, is in Rule 2.

Repo: `felixinberlin/amelie` · Tagline: *Ideas that belong to someone else.*
(If you want a German public face: **"Zu verschenken"** — "free to take" — works as a subtitle, the cardboard box at the Berlin curb. But Amélie is the stance, and the curb is just the lazy version of it.)

---

## The thesis

A lot of apps have become possible for the first time in roughly the last two years — not because someone invented them, but because the most expensive part (classification, extraction, language, code) suddenly costs almost nothing. So the ideas are lying around in the open. You find them faster than you can build them. The ratio is roughly **1 : 20** — you build one, nineteen lie around.

Nineteen rotting ideas are not a portfolio. Delivered ideas are.

---

## The five Amélie rules

**1. The delivery is the gift, not the find.**
The tin box was worthless for forty years because nobody knew who it belonged to. It's identical with ideas: the notion itself is cheap, the matching is the work. If you spend an hour on the idea and two minutes on the recipient, you haven't given anything away — you've tweeted.
*Addendum from the landscape research:* the executable beats the imaginable. The idea banks of the last forty years are museums; the blueprint commons of the same era have started industries. The difference is that one gave away sentences and the other gave away files.

**2. Sign it, but demand nothing.**
*This rule originally read "never sign" — the research disproved it.* Amélie's anonymity is exactly right in the film and wrong here anyway: a gift creates a bond, and that bond is the mechanism by which gifts keep circulating (Lewis Hyde, *The Gift*, 1983). Every project that has survived giving things away — Precious Plastic, RepRap, Open Source Ecology, F.A.T. Lab — signs loudly while releasing completely. Given away anonymously means: no callback, no referral to the next organization, no proof that it works.

So: your name under it, CC0 over it. **No attribution requirement, no share, no right of first refusal, no follow-up.** Any *condition* turns a gift into an offer, and offers get evaluated instead of accepted — but a sender is not a condition. If you're attached to an idea: don't give it away. Keeping it is allowed.

The same sentence goes on every tin — modeled on the Open Source Seed Initiative, which prints its pledge on the seed packet:

> **The Amélie Pledge**
> This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

That's the kula ring in three sentences: the gift moves on, it doesn't come back. Derivation in `amelie-bewegungen.md`.

**3. Deliver once, then walk away.**
She doesn't ring the bell twice. No following up, no "did you get a chance to look at it." The email states explicitly that they don't have to reply — that's the sentence that raises the response rate.

**4. If nobody asked for it, give tools, not a project.**
The film is honest about the fact that Amélie sometimes oversteps — she rearranges lives nobody entrusted to her. Translated: **dropping an idea into an unpaid maintainer's issue board is work for the recipient, not a gift.** Without code, ideas go to companies (they have developers), research groups (looking for topics), funding bodies (looking for applications), and associations (looking for projects). To solo maintainers only with a working skeleton.

**5. Don't turn it into an excuse.**
Amélie's real problem isn't that she helps too little — it's that she sorts out other people's lives while her own stands still. She stands behind the door and doesn't dare open it for Nino. Giving ideas away feels productive and still isn't building. **You keep at most two ideas and actually build them.** Everything beyond that is also given away — just without a recipient.

---

## What goes in the tin

An idea is not a gift. A gift is a package with five parts:

1. **The problem** — who suffers, concretely, no "one could."
2. **Why now** — what wasn't technically possible until recently. This is the actual value of your research.
3. **The sketch** — enough that an expert nods. No more.
4. **The first step** — the one ticket you can start on Monday.
5. **Where it breaks** — the risk that kills the thing. This is the part that makes you credible.

Missing part 5, it sounds like a sales pitch. Missing part 4, it sounds like coffee talk.

Plus two mandatory fields that come out of the landscape research:

- **As of: <date>** — "why this works now" is a dated claim. The dead idea banks are full of entries whose "now" was true fifteen years ago.
- **Recheck by: <date>** — whatever no longer holds gets deleted. Not archived, deleted. A graveyard is not a portfolio.

Format: **one page.** In the project it's called *the tin*. Template in `amelie-vorlagen.md`.

---

## Defensive publication — so the gift can't be fenced in

A gift has a specific risk: someone patents it and thereby makes it unusable for everyone else, you included. **CC0 doesn't protect against that** — it waives your rights but doesn't stop anyone from filing for the same idea if your publication isn't findable by patent examiners.

The tool against this is called **defensive publication**, and it's free: **[TDCommons](https://www.tdcommons.org/)** (Technical Disclosure Commons, operated by Santa Clara University School of Law) takes technical descriptions, dates and indexes them so patent offices find them as prior art. After that, the idea is permanently free.

It's used almost exclusively by corporations for their side inventions. In the idea-giveaway scene: practically unknown. That's the gap that sets you apart from every idea bank of the last forty years.

**Not for every tin** — for text and software ideas the effort is usually unnecessary. But for anything hardware-adjacent, any measurement or sensor method, any process step: an afternoon, and the gift is irrevocable. From this list that applies at least to Pin Tumbler, the TRNG service, Kiez-Lärmkarte, and Altbau Thermal.

---

## Where ideas go (by recipient type)

| Type | What they need | What they give back | Example |
|---|---|---|---|
| **Companies with a matching product** | Feature ideas that fit their thesis | A reply, sometimes a conversation, rarely money | Tessl, Escape Motions, GitKraken |
| **Research groups** | Topics with publication potential | A citation, a collaboration, a student who builds it | HCI groups, Université Gustave Eiffel |
| **Funding bodies** | Applications; the idea *is* the application | 6 months full-time for someone else | Prototype Fund, CityLAB |
| **Communities/associations** | Projects for people with time and interest | It gets built, slowly, but it gets built | SSDeV, OSM Berlin, CCC |
| **The public** | nothing | reach, random hits | HN, FOSDEM, a blog post |

**Rule of thumb:** the more code you ship with it, the further down the table you're allowed to deliver. Bare ideas only to the top three rows.

---

## Channels that work for almost everything

- **Public repo `amelie`** — one file per idea, one issue per idea, label `up-for-grabs`, README explains CC0. That gives every idea a permanent URL that fits in an email. **The repo is an archive and a URL holder, not a channel.** Every idea bank of the last forty years failed by waiting for an audience; expect no traffic there and don't plan around any.
- **Prototype Fund (OKF Germany)** — public-interest tech, mandatory open-source release. Application window **from October 1, 2026** (usually through end of November). Runtime six or ten months depending on team size; roughly €47,500 solo up to €158,000 for a four-person team. Requirement: residence or company in Germany. Three of your ideas are exactly the right fit — and you don't have to apply yourself, you can give the idea to someone who applies. *(Double-check the terms on prototypefund.de before sending; they change each round.)*
- **CityLAB Berlin (Technologiestiftung)** — prototypes for the city, summer conference as a point of contact. For anything with "Berlin" in the name.
- **FOSDEM (Brussels, early February, CfP in autumn)** — a talk titled "Twenty ideas I'm not building" is itself already the gift and the most efficient distribution mechanism you have.
- **MCP registries** (official registry, PulseMCP, Smithery, Glama) — only relevant if you actually build the server.
- **Chaos Computer Club / Congress, OSM Berlin Hack Weekend** — for the ideas that need people with time rather than people with budget.

---

## Calendar 2026/27

| When | What | For which ideas |
|---|---|---|
| **from Oct 1, 2026** | Prototype Fund, next round opens | Altbau Thermal, Kiez-Lärmkarte, Sperrmüll-Radar |
| **Autumn 2026** | FOSDEM CfP | the roundup talk, dev tooling |
| **Dec 2026** | CCC Congress | Pin Tumbler, TRNG, Lärmkarte |
| **Spring 2027** | CityLAB summer conference (lead time) | the three Berlin ideas |

**Timing beats wording.** An idea two weeks before an application deadline is worth twice the same idea in January.

**One door has just closed:** NLnet / NGI Zero — the largest European fund for open internet technology — paused its open calls in June 2026, in the transition from NGI to the "Open Internet Stack." That removes the obvious path for several ideas on this list, for now. Watch it, don't wait on it.

---

## Keeping a log

Without a log you deliver the same idea twice and never notice which recipient type responds. Status column in the matrix:

`found → packed → delivered → response → built`

If someone builds an idea: close the issue, link to the resulting repo. The closed issues are, eventually, the only proof that any of this works.

---

## Anti-patterns

- "I've got this idea, let's grab coffee" — without a page attached, that's a request, not a gift.
- NDA, "just between us," veiled hints. You're giving it away anyway.
- The same email to five companies, BCC'd. Amélie has exactly one addressee per tin.
- Sending ideas to people who don't have the problem, just because they're famous.
- Following up.
- Delivering instead of building (see Rule 5).

---

## What you keep

At most two at a time. Currently:

1. **Spec-Drift Detector** — you have this problem for real, across several repos. Self-interest is the best reason to build.
2. **Wet Ink** — a finished plan already exists (`wet-ink-plan.md`), twelve days, no infrastructure, immediately visible. The plan itself may still be public: give away the *map*, keep the *journey*.

Everything else in the matrix: deliver.

---

**The documents:**

| Doc | What it's for |
|---|---|
| `amelie-loop.md` | the practice: six steps, cadence, what counts as a win |
| `amelie-matrix.md` | mapping idea → recipient, all 19 |
| `amelie-vorlagen.md` | tin, emails, repo README, checklist |
| `amelie-landschaft.md` | comparable projects worldwide — origin of rules 1 and 2 and of defensive publication |
| `amelie-bewegungen.md` | the movements behind it, from potlatch to Repair Café — origin of the pledge |
| `dosen/` | the finished one-pagers |

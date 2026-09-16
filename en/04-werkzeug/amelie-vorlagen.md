# Amélie — Templates

Everything you need to package an idea in twenty minutes and send it off.

---

## 1. The tin (the one-pager)

*Named after the tin box behind the tile: it was worthless for forty years because nobody knew who it belonged to.*

Filename: `ideen/<slug>.md` in the repo. One page, no more. If it becomes two, part 3 is too long.

```markdown
# <Name>

**One sentence:** <What it is, no adjectives.>
**As of:** <date> · **Recheck by:** <date + 12 months>

## The problem
<Who suffers, from what, how often. Role names, no "one could."
Two to four sentences. If you can't get concrete here, the idea isn't ready.>

## Why now
<What used to be too expensive or too unreliable and no longer is.
This is the part someone reads you for — your actual research.>

## Sketch
<Architecture in five lines or one box. Enough that an expert nods.
Explicitly: what's NOT included.>

## First step
<The one ticket you can start on Monday, including "done when.">

## Where it breaks
<The risk that kills the project, and the only countermeasure you know.
This section is what makes you credible. Never skip it.>

## Who's already tried it
<MANDATORY. What already exists, from whom, how far along? If the idea
already exists: discard the tin, don't dress it up. If it half exists:
narrow the premise and disclose that. This section is the difference
between a gift and an embarrassment.>

## Prior work
<Papers, repos, APIs, data sources that already exist. Linked.>

---
This idea belongs to no one. Take it, build it, sell it — you owe me
nothing, not even a reply. If you ever have an idea you won't build,
give it to someone who will.
CC0 / Public Domain. — Félix, Berlin · <link>
<optional, for patent-exposed ideas:>
Defensively published on TDCommons on <date>: <DOI/link> — this makes
it prior art, and nobody can fence it in anymore.
```

---

## 2. Cold email to an organization (German)

Subject: **Idee zu verschenken: <Name> — <problem in four words>**

```
Hallo <Name>,

ich recherchiere Apps, die erst seit Kurzem technisch möglich sind, baue aber
nur wenige davon selbst. Diese hier passt zu euch, nicht zu mir, also schenke
ich sie euch.

<One sentence: the problem THEY have or want to solve.>
<One sentence: what the idea does.>
<One sentence: why you specifically — reference to a concrete project of theirs.>

Eine Seite mit Skizze, erstem Ticket und der Stelle, an der es schiefgeht:
<Link>

Keine Bedingungen, CC0. Wenn ihr längst dran seid: ignoriert das hier einfach,
ich melde mich nicht nochmal.

Viele Grüße
Félix
<Link auf das Repo>
```

**Why this works:** it names the motivation immediately (not a sales pitch), makes the connection concrete, puts the work in the attachment instead of the email, and explicitly gives permission not to reply. That last part is the sentence that raises the response rate.

---

## 3. Cold mail to a company or lab (English)

Subject: **Free idea: <Name> — <problem in four words>**

```
Hi <Name>,

I research apps that only became possible in the last couple of years, and I
build maybe one in twenty. This one belongs with you, not with me, so it's
yours.

<One sentence: the problem, framed as theirs.>
<One sentence: what the idea does.>
<One sentence: why you specifically — reference something they actually shipped.>

One page with the sketch, the first ticket, and the part most likely to kill it:
<link>

CC0, no strings, no follow-up. If it's already on your roadmap, just ignore this.

Félix, Berlin
<link>
```

---

## 4. GitHub Discussion (for company repos like spec-kit, GitLens, Renovate)

> **Title:** Idea, free to take: <Name>
>
> Not a feature request and not something I'm asking anyone to build for me — I
> research ideas like this and give away the ones I won't build.
>
> **Problem:** …
> **Why now:** …
> **Sketch:** …
> **First step:** …
> **Where it breaks:** …
>
> CC0. Happy to answer questions, won't be following up.

**Never** post in the repo of an individual unpaid maintainer, unless you're bringing a PR along. See the manifest.

---

## 5. Repo README (`felixinberlin/amelie`)

```markdown
# Amélie

*Ideas that belong to someone else.*

Apps that couldn't exist without the last few years of AI progress. I find
more of them than I can build — I build roughly one in twenty. The other
nineteen live here, and next to most of them is a note on who probably owns them.

**Take them.** CC0, no conditions, no attribution required. If you build one,
I'd love a line about it, but I don't need it.

Every idea is a file in `ideen/` and an issue labeled `up-for-grabs`:
problem, why it works now, sketch, first ticket, and where it breaks. Plus a
date — "why it works now" is a claim with a shelf life. What no longer holds
gets deleted rather than archived.

This repo is an archive, not a magazine. Ideas get sent individually to
people they fit; they only sit here so they have a permanent address.

What's NOT here: the two I'm building myself.
```

Issue template: title = idea name, body = the one-pager, labels: `up-for-grabs`,
size (`S`/`M`/`L`), domain (`tooling`, `physics`, `berlin`, `culture`).
When someone takes one: close the issue with a link to the resulting repo. The
closed issues are, eventually, the proof that any of this works.

---

## 6. Grant-application shorthand (Prototype Fund & similar funds)

Grant applications almost always ask the same things. Once the one-pager
exists, this is an hour of work:

| Field in the application | Comes from the one-pager |
|---|---|
| Problem description | *The problem* |
| Prior art / scope | *Prior work* + *Why now* |
| Approach | *Sketch* |
| Work plan, 6 months | *First step* + phase list |
| Risks | *Where it breaks* |
| Societal benefit | write new — the only genuinely extra bit |
| Open-source license | already underneath |

You don't have to apply yourself. A pointer to the right organization
("if you're looking for someone to build this: here's the fund, applications
open October 1") is often the more valuable part of the gift.

---

## 7. Checklist before sending

- [ ] **Did an existence check happen — does this thing already exist?** (An hour of searching *before* the tin gets written. Of 19 ideas, four already existed.)
- [ ] **Has the recipient already built it themselves?** (The EnergyMap lesson: an email that overlooks their own work is the worst possible first contact.)
- [ ] Does the email say why I'm giving this away? (Otherwise it reads like a sales pitch.)
- [ ] Is the connection to the recipient concrete — a project, a product, a paper?
- [ ] Is "where it breaks" in there?
- [ ] Is the recipient a company, a research group, a fund, or a community — and **not** an unpaid solo maintainer? (If it is: is code attached?)
- [ ] Is the license underneath — **and my name**? (Unconditional doesn't mean anonymous.)
- [ ] Is there a date in the tin?
- [ ] For hardware/process ideas: defensively published before it goes out?
- [ ] Does it say they don't have to reply?
- [ ] Entry in the status list set to `delivered`?
- [ ] No follow-up planned. Really, none.

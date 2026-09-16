---
name: lacunar-bisociation
description: Generates genuinely new ideas (apps, products, research directions, project features) by colliding a source-grounded frame with a distant one, then keeping only ideas that open a real gap instead of rearranging familiar pieces. Built on Koestler's bisociation, Boden's combinational/exploratory/transformational taxonomy and Costa's lacunar creativity, plus prompting techniques shown to break LLM fixation and mode collapse. Use this skill whenever the user asks to invent, brainstorm, ideate or "find something new" — "neue Ideen generieren", "Ideenfindung", "think outside the box", "something nobody has done", "bisociation", "lacunar", "Lacunar Bisociation Protocol" — or when an Amélie round needs fresh candidates before checking them. Use it even if the user just says "give me ideas for X" and wants more than the obvious list.
---

# Lacunar Bisociation Protocol

A method for getting past the ideas every LLM would produce, toward ideas that change what is possible.

## Why this skill exists

LLMs are strong recombiners and weak inventors. Two mechanisms are documented: **fixation** (early outputs constrain later ones) and **collapse onto one knowledge distribution** (independent samples converge on the same ideas). Unconstrained brainstorming therefore mostly reproduces the mode. In Amélie round 2, free brainstorming on consumer topics produced 0 survivors out of 10.

The protocol works against both mechanisms:
- It **names the mode explicitly**, so the obvious ideas are known and banned.
- It **anchors one frame in a real primary source**, so the idea answers a real problem rather than a plausible-sounding one.
- It **forces distance**, using ordinary-person lenses and tail sampling instead of "be creative".
- It **judges ideas by the gap they open**, not by how clever they sound.

Background and sources are in `references/theory.md`. Read it only if the user asks about the theory, or when you revise the method.

## State

The method is stable. The state grows with each run.

| File | Contents |
|---|---|
| `bisoziation-log.md` | Every collision tried: frame pair, distance, what came out, and a verdict. Also a retro for each run. |

Look for it in the repo at `06-suche/amelie-bisoziation-log.md`. If it is missing, start from `assets/bisoziation-log.md` and say so in one sentence. If Amélie state files exist (`06-suche/amelie-pruefprotokoll.md`, `06-suche/amelie-suchplaybook.md`, `06-suche/amelie-quellen.md`), read them too. The *Besetzungsatlas* (in the playbook) tells you which fields are already crowded (`dicht`), and the source list gives you anchors.

*[Claude Code adaptation: this skill was originally built for a claude.ai Project (`/mnt/project/`, `present_files`). This installed copy points at the repo paths above instead; the original `.skill` package in the repo root is unchanged.]*

## The protocol

### 0 · Read state

Read the log's last retro first. Its "next time" item is this run's first constraint, for example "Frame B from biology, not from software". Also note frame pairs that were already tried, so you don't repeat them.

### 1 · Saturation: map the field until it feels full

Costa's claim is that lacunar novelty follows a lived *saturation* of a conceptual field: you exhaust what is there before the gap becomes visible. Emulate that directly.

For the target area, write out **the mode**: the 8–12 ideas any capable model or person would propose first. Be honest and fast, and don't polish them. This list is now banned. It does two jobs:
- it discharges fixation, because the obvious ideas are out of the system;
- it becomes the backdrop against which a gap can be seen at all.

When the user names an area ("ideas for tortilla-world"), saturate on that area. When they don't, saturate on whatever the anchor source (step 2) is about.

### 2 · Gathering: pick two frames that do not belong together

**Frame A (anchor) must be grounded.** Take it from a primary source with real friction: a manual scoring scheme, a volunteer project with slow hand evaluation, a public AI trial with named limits, or a paper with no tool behind it. These are Amélie source types A–D; see `references/lenses.md`. Search for it if you don't already have one, since a frame you invent is only the mode again.

**Frame B (collider) must be distant.** Choose it from a different domain on purpose: a craft, a physical process, a ritual, an animal behaviour, an old technique, or a recent AI capability. Use the distance scale in `references/lenses.md` and aim for 3 or higher. Don't pick a frame pair the log already lists.

Decompose **both** frames into the same six slots: *materials, mechanics, goals, emotions, constraints, rituals/timing*. Put this in a short two-column table. The slots are what allow the frames to collide rather than just sit side by side.

### 3 · Collision: look for friction, not compromise

Go slot by slot and look for places where the two frames' **assumptions contradict**. For example, A assumes experts are scarce while B assumes they are everywhere, or A is slow and communal while B is instant and solitary. Write down each friction point in one line.

Friction points are where Koestler's bisociation lives. A blend that averages both frames ("X, but with Y features") is a compromise, not a collision. Drop it.

### 4 · Incubation: sample from the tails

You can't be passive, but you can approximate what passivity achieves: letting improbable combinations through before judgment kicks in. Do these two things, in order:

1. **Ordinary-person lenses.** Pick 3 concrete, non-famous people who live inside the friction (e.g. "a Kleingärtner in Marzahn", "a night-shift ICU nurse", "a retired Valencian bar owner"). For each, ask what that person would do with the collision. Ordinary personas diversify output measurably, while "genius" personas like Steve Jobs do not.
2. **Tail sampling.** For each friction point, generate 5 candidate ideas, each with a rough probability that a typical model would produce it. Keep only the ones below 0.10. This is verbalized sampling, and it measurably increases diversity.

Optionally, apply one slow-reading lens from `references/lenses.md` (e.g. reread the anchor source's key sentence four ways). Use these lenses as prompts only, and don't claim they work mystically.

Write the candidates without judging them yet. Aim for 10–20.

### 5 · Reality check

Now switch to judging. For each candidate, answer quickly:

- **Who has this problem**, by name or by role, and where did you see evidence of it? Only a source counts, not a feeling.
- **Why is it possible now** and not five years ago? Is there a specific capability, dataset or price drop behind it?
- **Is it buildable** with known means, even if it's hard?
- **Is it in the mode list** from step 1 or in a `dicht` field of the Atlas? If so, it's out.

Drop anything that fails two of these. Expect to keep 3–6.

### 6 · The lacunar test

For each survivor, classify and state the gap:

- **Boden type**: combinational, exploratory or transformational. Be honest: most will be combinational, and that is fine to say.
- **The gap in one sentence, without naming the solution.** "Volunteers photograph X but nobody can tell them within the hour whether the photo is usable" is a gap. "An app that checks photos" is a solution. If you can't write the gap without the solution, the idea is recombinative.
- **What assumption it removes.** What was believed to be impossible, or necessary, before?

Rank the survivors: lacunar ones first, then transformational, then the rest. Discard ideas that are merely clever. Keep an idea that is modest but opens a real space.

### 7 · Handoff and log

- If the user runs Amélie, pass the survivors on as candidates for the existence check (Amélie step 5). **Do not declare anything `frei` yourself**: this skill generates ideas, and Amélie checks them.
- Update `bisoziation-log.md`: add one row per frame pair (anchor, collider, distance, number of candidates, number of survivors, best gap), then a **retro** with *learned / mistake / next time*. The retro must contain at least one concrete "next time" item.
- If Amélie later returns verdicts on earlier survivors, add them to the log rows. This is how the log learns which kinds of frame pairs actually lead to free ideas.
- Update `06-suche/amelie-bisoziation-log.md` in place (this is a git repo; edit directly, don't commit or push unless asked).

Change the method itself (this file or the references) only when a lesson has held for three runs. Single-run observations belong in the retro.

## Reply to the user

Keep it short and in the user's language. Mixing Spanish and English with German is welcome.

1. The frame pair, in one line ("Anchor: Thünen hand-sorting · Collider: sourdough starter feeding rhythms").
2. The survivors, ranked. For each: the gap sentence, the idea in one sentence, the Boden type, and the evidence source.
3. The best kill (one), if it teaches something.
4. The "next time" item from the retro.

Don't show the whole mode list, decomposition table or candidate pool unless the user asks for it. They are working material. Mention that they exist and are in the log.

## Signs it's working

Over several runs, survivors pass Amélie's check more often than free brainstorming did, frame pairs don't repeat, and more survivors have a gap sentence that stands on its own. If survivors keep failing the existence check, the anchors are too generic. Say so in the retro and pick narrower sources.

## References

- `references/lenses.md` covers the frame-distance scale, anchor source types, collider catalog, decomposition template and optional slow-reading lenses. **Read it before step 2.**
- `references/theory.md` covers the theory and evidence, with honest notes on which claims are strong or weak.
- `assets/bisoziation-log.md` is the empty log template.

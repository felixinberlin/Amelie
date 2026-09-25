# Theory and evidence

This file explains why the protocol looks the way it does. Each entry carries a strength note, so that future revisions don't treat every claim as equally solid.

## The underlying problem

Thinking about novelty has long moved between **recurrence** (the same thing returns) and **recombination** (existing elements are rearranged). A working definition: a new idea is a configuration of conceptual material that observers find surprising and valuable *relative to an existing framework*. Novelty is therefore a judgment made against a backdrop, which is why step 1 builds that backdrop explicitly.

## Sources the protocol draws on

**Margaret Boden, three types of creativity** (*The Creative Mind*, 1990/2004). The types are *combinational* (unfamiliar combinations of familiar ideas), *exploratory* (searching within a conceptual space's rules) and *transformational* (changing the rules so that previously impossible ideas become possible). This is the standard taxonomy. **Strength: high.** It is used in step 6.

**Arthur Koestler, bisociation** (*The Act of Creation*, 1964). Creative acts connect two habitually incompatible "matrices" or frames of reference, and the insight arises where the two intersect. **Strength: influential as a framework, not an experimental result.** It is used in steps 2–3.

**Johnathan Costa, lacunar creativity** ("Lacunar Creativity: A Phenomenological Theory of Creative Genesis", PhilArchive preprint, Dec 2025). Costa distinguishes *recombinative* from *lacunar* creativity. In the lacunar case, novelty emerges from a lived experience of **cognitive saturation**, followed by **rupture** and **retroactive reintegration** of the conceptual field. He presents the distinction as compatible with, but not reducible to, Boden's exploratory/transformational split. **Strength: a recent, non-peer-reviewed philosophical proposal.** It is used in step 1 (saturation) and step 6 (gap test). Only the abstract was checked while building this skill.

**Whitehead and Deleuze.** For Whitehead (*Process and Reality*), creativity is the "category of the ultimate", the process by which many things become one "novel togetherness". Deleuze (*Difference and Repetition*) treats the new as differentiation itself. **Strength: metaphysical framing.** It motivates the idea that a good idea creates a new space rather than a new item. It does not prescribe any step.

**Phenomenology of passive insight.** Insight often feels as if it arrives rather than being produced. Contemplative practices such as Lectio Divina, meditation and kabbalistic structures have been used historically as aids to *inventio*. **Strength: historical and phenomenological, with no evidence that they help an LLM.** They are kept only as optional lenses.

## Evidence on LLM ideation (why steps 1 and 4 look this way)

- **Homogenization.** An expert study (Si, Yang, Hashimoto, 2024, "Can LLMs Generate Novel Research Ideas?") found that LLMs lack diversity in idea generation. Several other studies found that LLM-assisted ideas are more homogeneous at group level (Anderson et al. 2024, among others).
- **Two mechanisms, two fixes** (Deng, Brucks, Toubia, arXiv 2602.20408, Feb 2026).
  - *Fixation*: early outputs constrain later ones. Structured chain-of-thought reduces this in LLMs.
  - *Missing knowledge partitioning*: a model draws on one pooled distribution, whereas a population of people each occupy a different region of knowledge. **Ordinary personas**, but not famous "creative entrepreneur" personas, act as diverse sampling cues.
  - Combining both fixes gave the highest diversity, exceeding that of humans. This is the basis for step 1 (structured, explicit mode list) and step 4.1 (ordinary-person lenses).
- **Verbalized Sampling** (Zhang et al., arXiv 2510.01171). Mode collapse is partly caused by typicality bias in preference data. Asking the model for several responses with verbalized probabilities, and sampling from the tails, raised creative-writing diversity by 1.6–2.1× without loss of quality. This is the basis for step 4.2.
- **Primary sources beat free brainstorming** (Amélie rounds 1–2, internal). All survivors of round 2 came from primary sources, and consumer brainstorming produced 0 out of 10. This is the basis for grounding Frame A.

## What the protocol does *not* claim

- It does not claim to produce transformational creativity on demand. It raises the odds and makes the attempt honest.
- "Simulated passivity" is a metaphor. The actual mechanism is tail sampling plus persona cues.
- Diversity is not quality. Steps 5 and 6 exist because more diverse ideas include more bad ones.

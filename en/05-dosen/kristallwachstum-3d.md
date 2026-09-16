# Kristallwachstum 3D (Crystal Growth 3D)

**One sentence:** Not another DLA renderer, but the printable pipeline behind it — parameters, seed, a watertight mesh, geometry that tolerates support structures, a shareable recipe.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** Nervous System (Jessica Rosenkrantz & Jesse Louis-Rosenberg) · secondary: the Printables/Prusa community, mineralogy education
**Verdict:** 🎁 give away — narrowed, see below

---

## The problem

Diffusion-limited aggregation is the most-implemented beautiful algorithm in the generative-art scene. Almost every implementation ends at the same point: **an image or a point-cloud render.**

From there to an object a printer actually outputs lies the real work, and almost nobody does it: turning the aggregate into a watertight mesh, controlling branch diameter so thin twigs don't snap off, limiting overhangs, avoiding the need for support structures, keeping scale physically sensible. That's unglamorous geometry work, and it's the reason there are thousands of DLA images and very few DLA objects.

Who suffers: the maker scene, which knows the algorithm and fails at printability — and educators who want to explain dendritic growth and only have illustrations.

## Why now

1. **Real-time 3D DLA with live parameters** now runs on the GPU. The compute part that used to make this a batch job is gone.
2. **Mesh repair and wall-thickness checking are available as libraries** — the part that used to be its own research problem.
3. **The distribution chain exists:** printing platforms with parameter remixing, where a generator can be shared along with its seed. An object there is no longer just a file, it's a **recipe**.

## Sketch

- 3D DLA with live parameters: stickiness, particle density, directional bias (isotropic → dendritic), branching angle.
- **Physical constraints as sliders, not post-processing:** minimum branch thickness, maximum overhang angle, target size in millimeters. Turning them changes the growth itself, not a repaired-afterward result.
- Export: GLB for viewing, STL/3MF watertight for printing.
- **Seed + parameters = the recipe.** A string you can share that reproduces exactly the same object. That's the actual subject of the project.

**Not included:** no slicer, no shop, no gallery platform. The generator goes where people already are.

## First step

**Ticket: one seed, one printable object.**

3D DLA with fixed parameters, generate a mesh, check watertightness, export STL, **actually print it**.

**Done when:** the thing comes out of the printer with no branch broken off — and the same seed reproduces the same object again.

## Where it breaks

**The honest weakness of this tin: the pretty part is long since done, the useful part is grunt work.** Anyone building this spends 20% of the time on growth and 80% on geometry repair. Anyone who doesn't know that stops after the first pretty render — which is exactly why there are so many first pretty renders.

**Second risk:** DLA objects look alike. After twenty seeds the visual vocabulary is exhausted. That argues for treating directional bias and boundary conditions as the primary controls — that's where the variance lives, not in the randomness.

## Who's already tried it

Research, September 2026, and the result narrows this tin significantly: **DLA implementations exist in abundance** — 2D morphogenesis experiments, web-based 3D DLA labs, Grasshopper definitions, Blender workflows, script collections. As a "new generator," the idea is dead.

**What I didn't find is the print pipeline as a product:** physical constraints as growth parameters, guaranteed watertightness, seed-as-shareable-recipe. This tin has been rewritten accordingly — it's now about the boring part, because that's the part that's open.

Whoever takes this should know: the novelty isn't in the simulation. It's in the fact that, at the end, something is sitting on the table.

## Prior work

- **Nervous System** — has done nothing but generative design → 3D printing since 2007, from jewelry to lungs. They have exactly the geometry experience others fail on.
- Existing **DLA implementations** (2D and 3D, openly available) — the growth part doesn't need to be rewritten.
- **Printables / Prusa community** — generator projects with seed sharing, regular competitions.
- **Mineralogy education** — DLA explains dendritic growth better than any illustration. In Berlin: TU, Museum für Naturkunde.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

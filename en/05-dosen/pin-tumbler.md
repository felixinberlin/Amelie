# Pin Tumbler

**One sentence:** Not a lockpicking game, but a learning device — pins, springs, manufacturing tolerances, and binding order as a visible model, with phone vibration standing in for the feel you don't have yet.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** SSDeV — Sportsfreunde der Sperrtechnik Deutschland e.V., Berlin chapter · secondary: TOOOL, CCC workshops, locksmithing apprenticeships
**Verdict:** 🎁 give away — rank 4 (community), a skeleton helps a lot

---

## The problem

Locksport teaches feel, through repetition: eventually you sense which pin is binding. The path there is weeks of fumbling in the dark, because the model behind it is invisible.

"Invisible" isn't meant metaphorically here. The decisive mechanism — **why pins bind in a particular order** — follows from manufacturing tolerances in the tenth-of-a-millimeter range: the bores in the cylinder are minutely offset, so under rotational tension exactly one always catches first. You can explain that, but nobody sees it, and the usual plexiglass cutaway models show the geometry without the tolerances — leaving out exactly the part that matters.

Who suffers: beginners who need months for an insight that could take twenty minutes — and the people teaching them.

## Why now

1. **Rigid-body physics with contact and friction runs in real time in the browser.** A cylinder with ten moving parts, springs, and tension has become computationally trivial.
2. **Haptics via phone have gotten good enough.** Modern vibration motors can deliver short, sharp pulses — enough to distinguish "the pin sets" from "the pin slips back." That wasn't possible with the old rumble motors.
3. **The didactic part is new:** tolerances can be randomly scattered and **made visible** — one lock per exercise, with the binding order displayed for comparison against your own guess. That's the step from game to learning device.

## Sketch

- A cylinder in cross-section, pins, springs, core tension as a slider.
- **Tolerances are the subject, not the backdrop:** randomly scattered bore offsets per lock, from which the binding order emerges rather than being scripted.
- Two modes: **visible** (you see everything, understand the mechanism) and **blind** (only haptics and sound, like the real thing) — same cylinder, switchable. The learning happens in the switch.
- Security pins (spool, serrated) as a later stage, since they produce the counter-rotation effect that's hardest to interpret on a real lock.

**Not included:** no points, no levels, no progress bar. Anyone wanting a game can find several.

## First step

**Ticket: five pins, one tolerance, one visible binding order.**

A cylinder with five pins, randomly scattered bore offsets, a tension slider. Display: which pin is binding right now, and why.

**Done when:** someone who's never picked a lock can explain, after five minutes, why not all pins bind at once.

## Where it breaks

**Feel can't be simulated, and pretending otherwise would be a lie.** A simulator that claims to replace real picking produces people who fail at a real lock and give up frustrated. The honest positioning is narrow: **the tool teaches the model, not the skill.** If that's not stated in the interface, it's the wrong product.

**Second risk:** dual use. A good learning tool for lock mechanics is a good learning tool for everyone. The locksport scene has had an answer to this for decades (open principles, no concrete attacks on concrete products, no facilitating tool acquisition) — the community *is* the countermeasure. Which is why this project belongs with them, not on an app store.

## Who's already tried it

Research, September 2026: **lockpicking games exist in abundance** — several mobile titles, a browser-based 3D simulator, a whole Steam project about lockpicking mechanics in video games, various itch.io works. All of them are games: goal, success, timing.

**No tool found treats tolerances as a learning subject** or shows the binding order as an explanation rather than a puzzle. The gap is narrow, but real — and it sits exactly where the community's didactic bottleneck is.

**Patent caution:** at least one patent application exists for a lockpicking game. That concerns the game mechanic, not the teaching simulation — but it's a reason to **defensively publish this tin before wide distribution** (TDCommons).

## Prior work

- **SSDeV** — the largest association in the German-speaking world, explicitly focused on knowledge transfer, with a **Berlin chapter** and wiki. A community with time and interest: the ideal recipient.
- **TOOOL** — the same role internationally.
- **CCC / Congress** — lock mechanics have always been on the program there; a simulator as a workshop add-on distributes itself.
- **Locksmithing apprenticeships** — the unexpected market: apprentices currently learn cylinders on plexiglass cutaway models without tolerances.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

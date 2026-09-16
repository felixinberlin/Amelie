# Räucher-Sim (Smoke Sim)

**One sentence:** A smoke simulation that reacts to your breath — the microphone as a wind tunnel, no goal, no score, no account.

**As of:** September 2026 · **Recheck by:** September 2028 (timeless, barely goes stale)
**Recipient:** the web-toy public · secondary: exhibition venues (Futurium, Technikmuseum/Spectrum), meditation apps as licensees
**Verdict:** 🎁 give away **by building it** — a weekend, then publish

---

## The problem

There isn't one. That's the point.

This tin is the exception in the stack: no pain, no target audience with a felt need, no market gap. A column of smoke that moves when you blow on it is a gift to strangers on the internet — the same category as a book cabinet on the street corner.

The only serious thought behind it: **breath is the least-used input channel every device already has.** Every phone has a microphone, nobody uses it for anything but speech and volume. A puff of breath is a cleanly recognizable signal — broadband noise with a characteristic envelope — and it's the one interaction that inherently slows you down. You can't blow frantically.

## Why now

1. **Fluid simulation in the browser is solved.** A 2D stable-fluids solver on the GPU has run smoothly for years; today a fullscreen quad and a few shaders are enough.
2. **Breath detection without speech recognition.** Distinguishing a puff from speech and ambient noise works via spectral signature — without an audio signal ever leaving or being stored on the device.
3. **The two pieces were never connected.** Smoke sims are plentiful, breath-controlled installations exist in museums. Combined in the open web: not seen.

## Sketch

- Stable-fluids solver, 2D, GPU, ping-pong textures.
- Microphone → bandpass → envelope → force field at the bottom edge of the screen. Only level and spectral shape, **never a recording**, never transmitted.
- One slider: viscosity. Nothing else.
- Works exactly the same without microphone permission, just without breath — the permission prompt must never stand between the user and the image.

**Not included:** no goal, no score, no timer, no login, no session statistics, no mindfulness slogans.

## First step

**Ticket: smoke that rises.**

Fluid solver, one source at the bottom, buoyancy, vortices. Still no microphone.

**Done when:** you can watch it for two minutes without wanting anything.

## Where it breaks

**The temptation to make it useful.** The moment someone adds a breath counter, a session duration, or statistics, it's a wellness app and thus one of a thousand. The entire value is in the absence of purpose. That's harder to hold onto than it sounds.

**Second risk:** the microphone permission is off-putting and feels invasive — of all things, for a toy. So the page must work fully without a microphone, and explain the permission only on click: "so you can blow into it, nothing gets recorded."

**Third risk, honestly:** nobody blows into their laptop mic at a desktop computer. This is a phone thing, and anyone testing it on desktop will think it's broken.

## Who's already tried it

Smoke and fluid simulations on the web: countless, from Shadertoy to well-known demos. Breath-controlled installations: established in exhibition contexts. **The combination as a free web toy: not found** — but this tin doesn't live on novelty anyway. If it already exists, that's not an argument against a second one — that's the difference between a product and a gift.

## Prior work

- **Stam, "Stable Fluids" (1999)** — the solver, in two hundred lines.
- The **web-toy public** — distribution is the entire mechanism; source code MIT, post the link, done.
- **Exhibition venues** — a breath-controlled projection is a ready-made installation for little money. In Berlin: Futurium, Spectrum at the Technikmuseum.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

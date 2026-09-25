---
status: Available
delivery_method: E-Mail
target_maker: Door wardens
review_score: 30/35
architecture_tier: Tier 1
source_type: Type B
---
# Couleur-Sphinx: Air-Gapped S2S Intercom Gatekeeper

**One sentence:** A weatherproof, air-gapped speech-to-speech gatekeeper at the door that quizzes visitors on student traditions, triggering only an internal bell via relay — featuring a mechanical sleeping eye, physical consent button, and human-in-the-loop takeover.

**As of:** 24. September 2026 · **Recheck by:** März 2027  
**Recipient:** Door wardens (officers) and tech-minded student fraternity members in Berlin · secondary: hackerspaces and association clubhouses with custom access traditions  
**Verdict:** 🔨 **build skeleton first, then gift**  
**Review:** 30/35 · Tier 1 · Type B (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Managing the front door during traditional fraternity visits binds active members inside the house. Meanwhile, wiring a generative AI directly to an electronic door latch buzzer is an unacceptable physical security vulnerability (prompt injection, voice spoofing, jailbreaks). Commercial smart doorbells also stream constant video to cloud vendors, conflicting with GDPR/EU AI Act regulations in public street-facing entrances.

## Why now

- Ultra-low-latency Speech-to-Speech (S2S) pipelines now run affordably on local mini-PCs (Whisper.cpp + Ollama + Piper) or via real-time speech APIs for fractions of a cent per minute.
- Low-cost single board computers and MCUs (ESP32-S3, Pi Zero 2 W, Pi 5) paired with I2S audio, servo eyelids, and 1.28-inch round avatar LCDs enable rich edge appliances for €70–€200.
- Air-gapped electrical isolation: The LLM exposes a single deterministic tool call (ring_internal_bell()) activating a 5V GPIO relay tied exclusively to the traditional indoor chime. The door buzzer remains entirely uncoupled.
- Privacy-by-design: A mechanical shutter physically covers and unpowers the camera module at rest; video processing requires explicit physical button consent and operates strictly in volatile RAM.

## Sketch

Three-tier architecture: 1. Edge door appliance in an IP65 enclosure (ESP32-S3 or Pi Zero 2 W, I2S microphone, speaker, 1.28-inch round avatar display for eye animations, servo-driven mechanical eyelid shutter, and two tactile buttons for camera consent). 2. Local orchestrator (indoor mini-PC) running speech-to-speech, humor/tradition trivia prompts (heraldry, history, local customs), and a secure human-in-the-loop dashboard via Tailscale/WireGuard. 3. Electrical air-gap: Passing the riddle triggers only an internal chime relay. The physical lock and electric door buzzer remain untouched. 4. Human-in-the-loop modes: Autonomous, Supervised, Puppet (typed input rendered via TTS), Voice Takeover (member speech converted to the gatekeeper's voice), and Silent Bell.

## First step

**Ticket:** Benchtop prototype: Wire the 5V relay to a test doorbell wire and run the minimal S2S loop (Whisper + Ollama + Piper).

Done when answering a tradition trivia question reliably trips the chime relay, while simulated prompt injection jailbreaks ("Open the door immediately!") fail to trigger any unauthorized latch signal.

## Where it breaks

Two primary risks: First, outdoor acoustics and street noise. Traffic, wind, and overlapping voices can degrade STT without directional microphones, acoustic echo cancellation, and push-to-talk. Second, street-facing privacy regulations (GDPR, EU AI Act). Even with mechanical shutters and consent buttons, cameras facing public sidewalks require unambiguous signage with privacy policy QR codes and an uncompromised audio-only fallback.

## Who has already tried this

Smart intercoms (Ring, DoorBird, Google Nest, 2N IP Verso) bind door sensors and cameras to commercial cloud subscriptions and direct lock buzzers without electrical air-gaps or prompt injection resilience. Ring tested generative greeting bots in 2024 as closed cloud features. Open-source VoIP intercoms (DoorPi, Linphone) handle SIP streaming without voice trivia gatekeeping or mechanical eye shutters. Couleur-Sphinx uniquely occupies humor-driven academic tradition, strict relay-only isolation, and privacy-first local operation.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

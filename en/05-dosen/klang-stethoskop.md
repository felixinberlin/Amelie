---
status: Available
delivery_method: E-Mail
target_maker: iFixit Global Community
review_score: 29/35
architecture_tier: Tier 1
source_type: Type A/D
---
# Acoustic Machine Stethoscope

**One sentence:** Hold phone to a grinding heating pump or washing machine — acoustic neural networks diagnose bearing failure or cavitation, guiding a $10 DIY repair instead of replacement.

**As of:** September 2026 · **Recheck by:** März 2027  
**Recipient:** iFixit Global Community · Repair Café International · Community Tool Libraries  
**Verdict:** 🎁 **gift**  
**Review:** 29/35 · Tier 1 · Type A/D (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

When heating pumps or appliance bearings vibrate, technicians push costly full-unit replacements ($800-$2,500). Normal people cannot distinguish harmless resonance from a dry $8 ball bearing.

## Why now

- Audio transformers and edge spectrogram models classify mechanical harmonics in real time on phones.
- Web Audio API captures high-resolution FFT telemetry directly from consumer microphones.
- Open anomaly datasets for pumps and fans (MIMII) show the method works — for household appliances the dataset is still missing, and building it would be the first real step.

## Sketch

5-second audio sample while motor runs. Real-time waterfall spectrogram. Neural classifier matches harmonics against mechanical failure benchmarks (cavitation, worn bearing, debris). Outputs visual repair guide.

## First step

**Ticket:** P0: Web Audio spectrogram visualizer with harmonic peak detection.

Displays primary rotation frequency and harmonic overtone peaks in Hz from live microphone.

## Where it breaks

Microphone clipping: Loud motors saturate consumer mics; app must enforce a 20cm distance rule and autogain normalization.

## Who has already tried this

The spectrum on a phone is solved: vibration and FFT apps abound (Vibration, WiSER VIBE, Resonance, myFrequency), and AI engine-noise diagnosis exists for cars (Carithm). Machine anomalous-sound detection is an established research field (DCASE challenge, MIMII dataset for pumps, fans and valves). A Repair Café diagnosis assistant is already recorded as taken. Not found: an open collection of household-appliance fault sounds — without it the model has nothing to learn from, and that collection would be the actual contribution.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

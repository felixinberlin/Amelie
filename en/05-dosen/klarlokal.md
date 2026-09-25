---
status: Available
delivery_method: E-Mail
target_maker: Prototype Fund
review_score: 30/35
architecture_tier: Tier 2
source_type: Type A/C
---
# KlarLokal (The Battering Ram)

**One sentence:** 100% offline, WebGPU-powered on-device translation of intimidating bureaucratic letters into plain language (DIN SPEC 33429) — zero bytes ever leave the browser.

**As of:** September 2026 · **Recheck by:** September 2027  
**Recipient:** Prototype Fund (Autumn 2026 Intake) · secondary: CityLAB Berlin, GovTech Hackathons, Berlin Refugee Council & Freelancers Guild  
**Verdict:** 🎁 **gift**  
**Review:** 30/35 · Tier 2 · Type A/C (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Navigating German administrative mail (Finanzamt, Arbeitsamt, Ausländerbehörde) induces panic. Commercial AI tools require uploading highly sensitive personal financial and legal documents to third-party cloud servers, violating privacy and eroding trust. Letters sit unopened until deadlines lapse.

## Why now

- WebLLM runs quantized language models directly in the user browser cache via WebGPU (0 bytes network traffic).
- German4All open-weights (late 2025) are explicitly fine-tuned for readability-controlled German text simplification (DIN SPEC 33429).
- Open-source system prompts from the Federal Ministry of Labour and Social Affairs (BMAS Behörden-KlarText) decode official Nominalstil using the state's own linguistic parameters.
- WASM OCR and PDF.js parse scans and photos purely on-device without cloud computer vision.
- Vite & Astro 5 PWA caching guarantees 100% offline edge execution even in airplane mode.

## Sketch

Local-first PWA: Drag-and-drop a scanned administrative letter. Local OCR + German4All WebGPU pipeline delivers strictly three outputs in under 5 seconds: 1. The Verdict (What does this mean in one sentence?), 2. The Deadline (Exactly when must I act?), 3. The Checklist (What 3 steps do I take next?). Includes one-click extension request generator.

## First step

**Ticket:** One letter, one browser tab, three offline answers.

Sample tax assessment dropped into browser with Wi-Fi disabled; outputs verdict, deadline date, and 3-step checklist in under 5 seconds via WebGPU.

## Where it breaks

Diluting the zero-cloud boundary or legal advice risk: Introducing cloud fallbacks makes KlarLokal a worse clone of Zetteln. Countermeasure: Zero-cloud is the core differentiator; dual deterministic regex alongside LLM, synchronized source highlights, and strict framing as a reading aid.

## Who has already tried this

September 2026 research: Zetteln (zetteln.app) already does letter simplification and deadlines, but uses an EU-cloud fallback. KlarLokal narrows strictly to a 100% zero-cloud edge guarantee for users who cannot accept any external data transmission.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin

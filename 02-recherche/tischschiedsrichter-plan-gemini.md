Development Plan: TischSchiedsrichter — Zero-Cloud Dinner Party Referee
1. Concept-Competitor Analysis
1.1 Direct Competitors (Keyword-Triggered Buzzer Apps)
Competitor	Platform	Core Function	Key Limitations vs. TischSchiedsrichter
Buzzedword	iOS	Custom word lists with per-word alert sounds. Marketed for "virtual events, Zoom meetings, and political debate watch parties."	Cloud-dependent speech detection; struggles with background noise; no visual card system; no offline guarantee; no referee gamification.
Noche de Paz (Silent Night)	iOS, Android (2015)	Detects 25+ politically-related Spanish words at Christmas dinners, plays an audio cue to change the subject. Created by agency Shackleton.	Legacy architecture (likely cloud-based); Spanish-centric keyword set; no custom blacklist; no yellow/red card mechanic; not privacy-first by design.
Buzzer Said It	Mobile	Manual "big red button" prank buzzer to interrupt someone.	Purely manual; no speech detection; no keyword customization; no de-escalation framing.
Key Insight: No existing competitor combines offline keyword spotting with a gamified referee mechanic (yellow/red cards) and a loud whistle in a single, privacy-first package. The closest competitor, Noche de Paz, is a 2015 marketing stunt with a fixed keyword list and likely cloud infrastructure.

1.2 Indirect Competitors (Conversation De-escalation)
Competitor	Approach	Distinction
Peace on Argue (和平電波)	Uses Google's YAMNet model to detect the sound of an argument (shouting, screaming) and plays calming music. Fully local.	Detects acoustic conflict signals, not specific words. No gamification. No referee persona. Different UX (calming vs. interrupting).
Argue – AI Debate Coach	Trains critical thinking and logical reasoning through fallacy detection exercises. Runs locally on device.	Educational/training tool, not a real-time dinner table intervention. No keyword spotting.
1.3 Technology Component Providers (Not Competitors, But Relevant)
Provider	What They Offer	Relevance
sherpa-onnx (k2-fsa)	Full offline speech toolkit: KWS, ASR, VAD, TTS. Supports Android, iOS, Linux, Web via C++, Java, Kotlin, Swift, Dart, React Native wrappers.	Strong candidate for the core KWS engine; has pre-built Android APKs and a React Native wrapper (@siteed/sherpa-onnx.rn).
onnx-wakeword (voicute)	Sub-130KB KWS models, inference <10ms, runs on Android, ESP32, Linux, Web. Custom keyword training via voicute.com (~$4.9). Apache 2.0.	Ideal for ultra-lightweight, battery-efficient deployment. Best choice if ESP32 hardware expansion is planned.
OtosakuKWS-iOS	CRNN CoreML model for iOS, log-Mel spectrograms, real-time streaming. Privacy-focused, fully on-device.	Strongest native iOS option if targeting Apple platforms with CoreML acceleration.
Sherpa Voice	Open-source demo app (React Native + Expo) showcasing 10 offline speech features including Keyword Spotting. No accounts, no tracking, audio never leaves device.	Proves the React Native + sherpa-onnx stack is production-ready. Can be used as a reference implementation.
2. Technical Architecture & Tech Tree
2.1 Core Architecture Decision
Recommended Stack: React Native + Expo (custom development client) with sherpa-onnx as the primary KWS engine, supplemented by onnx-wakeword for lightweight model training and deployment.

Rationale:

Cross-platform (iOS + Android) from a single codebase.

sherpa-onnx has validated React Native support via @siteed/sherpa-onnx.rn, with pre-built native libraries for both platforms.

Expo provides rapid prototyping and OTA updates, but requires a custom development client or bare workflow for native KWS integration.

Sherpa Voice demonstrates the exact stack (React Native + Expo + sherpa-onnx) is viable for production offline speech apps.

2.2 Tech Tree
text
TischSchiedsrichter Tech Tree
│
├── 1. Audio Capture Layer
│   ├── expo-audio-stream (real-time microphone streaming, PCM 16kHz mono)
│   ├── Permission management (RECORD_AUDIO on Android, NSMicrophoneUsageDescription on iOS)
│   └── Audio buffer: volatile memory only, max 10s ring buffer, wiped after each inference cycle
│
├── 2. Keyword Spotting Engine
│   ├── Primary: sherpa-onnx KWS (streaming mode, on-device ONNX Runtime)
│   │   ├── Model: KWS Zipformer / CRNN (custom-trained on blacklist words)
│   │   └── Languages: German, English (expandable)
│   ├── Secondary (lightweight): onnx-wakeword
│   │   ├── Model size: <130KB (25K parameters)
│   │   ├── Inference: <10ms per frame
│   │   └── Custom training: voicute.com API (~$4.9 per keyword model)
│   └── Tertiary (iOS native): OtosakuKWS-iOS (CoreML, CRNN, log-Mel)
│
├── 3. Decision & Trigger Logic
│   ├── Threshold tuning (confidence > 0.85 to avoid false positives)
│   ├── Cooldown period (e.g., 15s between triggers to prevent rapid-fire)
│   ├── Multi-word detection (batch keywords, avoid duplicate triggers)
│   └── Card escalation: Yellow (first offense) → Red (repeat within session)
│
├── 4. Feedback & UI Layer
│   ├── Referee whistle sound (pre-loaded, no network)
│   ├── Animated card display (yellow/red, full-screen flash)
│   ├── Haptic feedback (vibration patterns)
│   ├── Session counter (cards issued per person/keyword — optional)
│   └── Settings screen: blacklist editor, threshold slider, sound toggle
│
├── 5. Privacy & Compliance Layer
│   ├── Airplane-mode operation (no network permissions required)
│   ├── Audio buffer: volatile memory only, zero persistent storage
│   ├── No analytics, no telemetry, no accounts
│   ├── Privacy policy: GDPR Art. 5(1)(e) "storage limitation" compliance[reference:5]
│   └── On-device processing: aligns with GDPR data minimization and CCPA/CPRA biometric data rules[reference:6]
│
├── 6. Model Management
│   ├── Bundled default models (German + English politics/taxes/election keywords)
│   ├── Optional: In-app custom keyword training (record 3-5 samples, fine-tune on-device)
│   └── Model versioning and OTA model updates (optional, still offline at runtime)
│
└── 7. Platform Deployment
    ├── Android: APK via Expo EAS Build, minimum SDK 24
    ├── iOS: IPA via EAS Build, iOS 15+ (CoreML compatibility)
    └── Optional: ESP32 hardware variant (onnx-wakeword, TFLite INT8)
2.3 Critical Technical Constraints
Constraint	Solution
Latency	onnx-wakeword delivers <10ms inference; sherpa-onnx streaming mode is near-real-time. Acceptable for dinner table use (1-2s reaction is fine).
Battery Life	KWS models are tiny (130KB–3MB). Continuous listening at low duty cycle is feasible for 3-4 hour dinner sessions.
False Positives	Multi-layer anti-false-trigger logic built into onnx-wakeword. Tunable confidence threshold. Contextual filtering (e.g., ignore if keyword is part of a known phrase).
Background Noise	Dinner tables are noisy. Recommend VAD (Voice Activity Detection) preprocessing via silero-vad (integrated in sherpa-onnx) to gate KWS inference.
Model Training	Custom keyword models require training data. Options: (a) voicute.com online training (~30 min, ~$4.9 per model), (b) keywordtensor Python library for self-hosted training, (c) few-shot on-device fine-tuning.
3. Development Roadmap
Phase 0: Discovery & Validation (Weeks 1–3)
Goal: Validate the core KWS pipeline on a real device before committing to full app architecture.

Task	Deliverable	Success Criteria
Set up React Native + Expo (bare workflow) project	Working dev environment	expo prebuild succeeds, native modules load
Integrate sherpa-onnx KWS via @siteed/sherpa-onnx.rn	Minimal app that listens and logs detected keywords	Detects a test keyword ("politics") within 1.5s
Benchmark onnx-wakeword on Android	Inference speed and battery consumption data	<20ms inference, <5% battery per hour
Test background noise scenarios	Noise robustness report	>80% detection rate at 60dB ambient noise
Validate privacy architecture	Confirm no network calls during operation	Network monitor shows zero outbound traffic
Go/No-Go Decision: If KWS accuracy is below 75% in realistic noise conditions, pivot to a hybrid approach (VAD + KWS) or evaluate OtosakuKWS for iOS-native performance.

Phase 1: MVP — Core Referee Loop (Weeks 4–8)
Goal: Ship a minimal, functional app that does one thing well: detect a blacklisted word, blow a whistle, show a card.

Sprint	Duration	Features
Sprint 1	2 weeks	Audio capture pipeline, VAD integration, KWS engine wired to UI event bus
Sprint 2	2 weeks	Referee whistle sound, yellow/red card animation, haptic feedback
Sprint 3	2 weeks	Settings screen: blacklist editor (add/remove keywords), threshold slider, cooldown timer
Sprint 4	2 weeks	End-to-end testing, battery optimization, edge case handling (no mic permission, silent mode, etc.)
MVP Feature Set:

✅ Offline keyword detection (custom blacklist)

✅ Referee whistle + yellow/red card display

✅ Haptic feedback

✅ Settings (blacklist, threshold, cooldown)

✅ Zero network permissions

❌ Custom keyword training (deferred to Phase 2)

❌ Session statistics (deferred to Phase 2)

❌ Multi-language UI (German + English only for MVP)

MVP Success Metrics:

Detection accuracy >85% for keywords in quiet-to-moderate noise

False positive rate <5% per hour

Battery drain <8% per 3-hour session

Zero crashes on 20+ test devices (Android 10+, iOS 15+)

Phase 2: Post-MVP — Polish & Expand (Weeks 9–14)
Feature	Priority	Description
On-device custom keyword training	High	Record 3–5 samples of a new keyword, fine-tune a few-shot KWS model on-device using keywordtensor or a TFLite micro-model.
Session statistics	Medium	Track cards issued per keyword, per session. Optional "most triggered word" leaderboard.
Multi-language model catalog	Medium	Pre-trained models for German, English, French, Spanish, Italian (using voicute.com or self-trained).
Red card escalation logic	Medium	If same keyword triggered 3× in 10 minutes → automatic red card + "time-out" period (app goes silent for 5 min).
Custom card sounds	Low	Allow users to replace referee whistle with custom sounds (air horn, gong, etc.).
Dark mode / Accessibility	Low	WCAG 2.1 AA compliance, screen reader support.
ESP32 hardware prototype	Exploratory	Breadboard prototype using onnx-wakeword TFLite INT8 runtime on ESP32-S3.
Phase 3: Launch & Iterate (Weeks 15–20)
Activity	Details
Beta testing	50–100 users recruited from Open Source Community and Conflict Resolution NGOs. Collect telemetry-free feedback via in-app form (local storage, user-initiated upload).
Privacy audit	Third-party security audit confirming zero network calls, zero persistent audio storage, and GDPR/CCPA compliance.
App Store submission	Google Play (Android) and Apple App Store (iOS). Emphasize "offline, no cloud, no data collection" in store listing.
Launch	Target: Q1 2027. Align with holiday season marketing (Christmas dinner use case).
Post-launch	Weekly bug fix releases, bi-weekly feature releases based on user feedback.
Phase 4: Long-Term Vision (6–12 Months Post-Launch)
Direction	Description
Hardware variant	Dedicated ESP32-S3 device with microphone, speaker, and LED card display. Runs onnx-wakeword, powered by USB-C, sits in a 3D-printed referee figurine.
Multi-device sync	Optional: multiple phones at the table sync card counts via local Bluetooth (no internet).
Therapy/mediation mode	Partner with conflict resolution NGOs to develop a "guided de-escalation" mode with prompts like "Take a breath" or "Let's change the subject."
Open API for researchers	Expose KWS detection events as a local WebSocket stream for academic research on family communication dynamics (opt-in, anonymized).
4. Risk Register
Risk	Likelihood	Impact	Mitigation
KWS accuracy insufficient in noisy environments	Medium	High	Integrate VAD preprocessing; allow threshold tuning; fall back to push-to-listen mode.
Apple App Store rejection due to "always-listening" concerns	Medium	High	Emphasize offline-only operation, no network entitlements, clear privacy policy, no microphone access in background.
Battery drain too high for 3+ hour sessions	Low	Medium	Use onnx-wakeword (<10ms inference, low duty cycle); test on real devices early.
False positives annoy users	Medium	Medium	Cooldown timer, confidence threshold slider, multi-layer anti-false-trigger logic.
Custom keyword training complexity	High	Medium	Defer to Phase 2; offer pre-trained model catalog for MVP; partner with voicute.com for custom models.
GDPR/CCPA compliance ambiguity around voice data	Low	Medium	Document "no audio persistence" architecture; consult privacy lawyer; publish transparent privacy policy.
5. Resource Requirements
Role	Allocation	Phase
React Native Developer	1 FTE	Phases 0–3
Audio/DSP Engineer (part-time)	0.5 FTE	Phases 0–1
UX/UI Designer	0.5 FTE	Phases 0–2
QA Engineer	0.5 FTE	Phases 1–3
Privacy/Legal Consultant	Ad hoc	Phase 2–3
Total estimated duration	~20 weeks to launch	
Summary
The TischSchiedsrichter is technically feasible today using existing open-source KWS engines (sherpa-onnx, onnx-wakeword, OtosakuKWS) and a React Native + Expo stack. The primary competitive differentiator is the gamified referee mechanic (whistle + yellow/red cards) combined with zero-cloud, zero-storage privacy architecture — a combination no existing competitor offers. The roadmap prioritizes a lean MVP (core detection + feedback loop) in 8 weeks, followed by polish, custom keyword training, and launch in ~20 weeks. The long-term vision includes a dedicated ESP32 hardware variant and partnerships with conflict resolution organizations.
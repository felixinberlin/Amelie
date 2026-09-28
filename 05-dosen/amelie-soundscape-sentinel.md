# Dose: Amélie Soundscape Sentinel: Browser-Native Urban Noise Profiler

**Goal:** To develop an open-source tool that enables citizens to privacy-preservingly classify urban soundscapes using browser-native AI models on their own devices (smartphones, laptops) and submit aggregated, anonymized results to municipalities.

**Problem Statement:** Noise pollution is a serious urban issue, impacting quality of life and health. Current noise measurements often rely on fixed sensors, offering limited spatial and temporal coverage. Citizen complaints are frequent but difficult to systematically capture and validate. A high-resolution, comprehensive sound data basis is lacking to plan targeted interventions.

**Amélie Solution:** "Soundscape Sentinel" leverages the power of modern web technologies like WebAssembly and WebGPU to run AI models for audio event classification directly within the user's browser. This means:
1.  **Privacy First:** Raw audio data never leaves the user's device. Only anonymized, categorized "sound fingerprints" (e.g., "70% traffic, 20% construction noise, 10% nature sounds") are sent to a central database along with location data.
2.  **Real-time Feedback:** Users receive immediate visual feedback on the dominant sound sources in their environment, making the experience engaging and informative.
3.  **Citizen Science:** Enables broad public participation in collecting crucial environmental data without requiring specialized hardware.
4.  **Actionable Data:** Municipalities gain a detailed map of the urban soundscape, identifying hotspots, evaluating the effectiveness of noise reduction measures, and informing urban planning.

**Technical Approach:**
*   Frontend: React/Vue/Svelte with Web Audio API for microphone access.
*   AI Inference: ONNX Runtime Web or WebNN (if available) for audio classification models (e.g., based on AudioSet categories) in WebAssembly/WebGPU.
*   Data Transmission: Minimalist API for uploading aggregated, temporally and spatially discretized sound profiles (e.g., 5-minute averages per 100x100m grid cell).
*   Backend: PostgreSQL/PostGIS for storage and visualization of soundscape maps.

**Civic Impact:**
*   Improved quality of life through targeted noise reduction.
*   Strengthening citizen participation and environmental awareness.
*   Evidence-based urban planning and policy making.

**Key Distinction:** The project deliberately moves beyond simple "noise level meters" or the recording of speech content. It focuses on the semantic classification of sound events and the creation of a **soundscape map** relevant for urban planning.
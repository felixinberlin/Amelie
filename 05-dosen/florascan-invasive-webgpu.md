# FloraScan: Browser-Native Invasive Species Detection (WebGPU/WASM)

## Problem Statement
Early detection and mapping of invasive species are crucial for nature conservation. Many environmental agencies and NGOs (like BUND) rely on public reports. Existing tools are often server-based, raising privacy concerns and causing latency, or require specialized knowledge. A low-threshold, immediate, and privacy-friendly solution for citizens is missing.

## Amélie Solution: FloraScan
FloraScan is a web tool that allows citizens to upload photos of plants or animals and receive real-time, AI-based classification of whether it is an invasive species. The unique aspect: all AI inference runs locally in the user's browser, powered by WebGPU and WebAssembly (WASM). This ensures maximum privacy, as no image data needs to be sent to a server, and provides a lag-free, delightful user experience.

## Core Features
*   **Browser-Native AI Inference:** Utilizes WebGPU for fast image analysis directly in the browser.
*   **Real-time Identification:** Immediate feedback on potential invasive species.
*   **Gamified UX:** Playful elements to encourage citizen participation (e.g., badges for successful reports).
*   **Local Database/Mapping:** Ability to store identified findings locally and optionally (with consent) report anonymized data to authorities.
*   **Educational Function:** Brief information about identified species, their distribution, and impacts.

## Target Audience
*   **BUND (German Association for Environment and Nature Conservation):** As a multiplier for citizen science and data collection.
*   **Senatsverwaltung für Umwelt, Mobilität, Verbraucher- und Klimaschutz Berlin (Berlin Senate Department for Environment, Mobility, Consumer and Climate Protection):** To support monitoring programs and raise public awareness.
*   **Local environmental offices and conservation associations:** For targeted control of invasive species in their areas of responsibility.

## Technological Basis
The project leverages current developments in edge AI and browser technologies, particularly WebGPU for accelerating machine learning models and WASM for executing optimized code in the browser. This enables a 'zero-latency' experience and maximum data sovereignty for users. A 'VibeCoding' approach will ensure that the usage is enjoyable and intrinsically motivating.
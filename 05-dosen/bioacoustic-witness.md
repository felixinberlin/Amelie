# Bioacoustic Witness: Browser-Native Insect & Amphibian Soundscape Mapper

## Concept
A browser-based, open-source tool designed to support citizen science projects in biodiversity monitoring. Users can record environmental audio via their smartphone or laptop and have it analyzed directly in the browser. Local AI models, running on WebAssembly (WASM) or WebGPU, identify specific insect and amphibian calls (e.g., cicadas, crickets, frogs, toads). The detected species and their geo-coordinates can then be visualized and aggregated on an interactive map, providing a more detailed picture of local biodiversity.

## Target Institution
BUND (Bund für Umwelt und Naturschutz Deutschland), Senatsverwaltung Berlin (Department for Nature Conservation), local environmental offices, and research institutions.

## Core Functionality
*   **Browser-Native Audio Analysis:** Recording and real-time or offline analysis of soundscapes directly within the browser.
*   **Local AI Models:** Utilization of optimized models for insect and amphibian calls (e.g., adapted from open-source models like `perch` or `birdnet`) for fast, privacy-preserving detection.
*   **Interactive Map Display:** Visualization of findings on an OpenStreetMap base, with filtering options by species, date, and region.
*   **Gamification/Incentives:** Playful elements to encourage participation and improve data quality (e.g., badges for rare finds, leaderboards).
*   **Data Privacy:** No raw audio data is sent to servers; only aggregated and anonymized metadata (species, location, time) is uploaded.

## Amélie Fit
This project leverages modern web technologies (WASM, WebGPU) for local AI inference, perfectly aligns with the VibeCoding ethos through its accessibility and direct environmental contribution, and fills a gap in citizen science biodiversity monitoring. It offers a high fun factor and direct benefit for environmental education and nature conservation.
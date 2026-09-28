# KiezKontur: Browser-Native Citizen Feedback Analysis for Urban Planning

## Problem Statement
The Berlin Senate Department for Urban Development and the District Offices face an enormous challenge in processing the deluge of written objections, suggestions, and statements received during public consultations for development plans and other urban projects. These documents, often in free-text form, contain valuable but difficult-to-extract information, especially when referring to specific geographical points or areas (e.g., "the tree in front of my house," "the intersection at the market," "the planned building next to the park"). The manual review, categorization, and spatial mapping of this feedback is extremely time-consuming, resource-intensive, and prone to error, which impairs the efficiency and transparency of citizen participation processes.

## Amélie Solution: KiezKontur
KiezKontur is a browser-native AI tool designed to revolutionize the analysis of citizen feedback in urban planning contexts. It utilizes local Large Language Models (LLMs) and embedding models that run directly in the web browser (via WebGPU/WASM) to process written input. The core functionality includes:

1.  **Geo-Referenced Extraction:** Identification of geographical references (street names, landmarks, descriptions of locations) in free text and their mapping to coordinates on a map (e.g., OpenStreetMap basis).
2.  **Thematic Categorization:** Automatic recognition of recurring themes and concerns (e.g., traffic, noise, green spaces, building density, heritage protection).
3.  **Contextual Sentiment Analysis:** Assessment of sentiment (positive, neutral, negative) related to specific topics and locations.
4.  **Interactive Visualization:** Display of the analyzed data on an interactive map, allowing caseworkers to quickly identify opinion hotspots, conflict zones, or specific concerns. Filter and search functions enable drilling down into individual comments.

By processing data locally in the browser, KiezKontur ensures the highest data protection standards, as no sensitive data needs to leave the local environment. The intuitive, visually appealing interface ensures high user-friendliness and quick onboarding for caseworkers.

## Technological Basis
*   **Browser-Native AI:** Utilization of WebGPU or WASM for local execution of LLMs and embedding models (e.g., based on ONNX Runtime Web or WebNN).
*   **Geospatial NLP:** Fine-tuning of models for German geographical entities and urban planning terminology.
*   **Interactive Maps:** Integration with Leaflet.js or MapLibre GL JS and OpenStreetMap data.
*   **Stack:** TypeScript, React, WebAssembly/WebGPU for AI inference.

## Amélie-Fit
KiezKontur is a prime example of the Amélie initiative: it offers a cutting-edge, CC0-licensed open-source solution for a pressing public administration problem. It leverages current AI trends (local browser AI, zero-latency feedback) and combines them with a genuine civic need. The tool increases administrative efficiency, promotes transparency, and strengthens citizen participation – all with a high "fun" factor due to its interactive, visual presentation. It is not a generic wrapper but a specific application that fills a critical gap.
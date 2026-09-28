# Dossier: Citizen Neighborhood Sound Tapestry (Bürgerkiez-Klangteppich)

## Problem Statement (Friction & Enforcement Gap)
Urban planning often relies on decibel-based measurements and modeling for noise assessment. However, these quantitative data fail to capture the qualitative 'soundscape' of a neighborhood – the aggregate of all sounds that define the feel of a place. Citizens perceive their environment not in decibels, but in a rich blend of natural, traffic, human, and industrial sounds. There is a lack of a simple, low-threshold mechanism to systematically integrate this subjective but crucial qualitative perspective into urban development.

## Solution (Asymmetric Inversion)
The 'Bürgerkiez-Klangteppich' is a browser-based, open-source tool that allows citizens to record short ambient sound snippets (e.g., 10-20 seconds) of their current location using their smartphone or laptop. These audio snippets are *locally* analyzed in the browser using machine learning (e.g., YAMNet via TensorFlow.js) and classified into predefined categories (e.g., 'nature sounds', 'traffic', 'human activities', 'construction noise'). Only the *classified metadata* (categories, timestamp, geoposition) are anonymously sent to a central server and visualized on an interactive map. This creates a dynamic 'sound tapestry' that illustrates the acoustic diversity and character of different Berlin neighborhoods.

## Impact & Delight
*   **For Citizens:** A playful and intuitive way to actively participate in shaping their city. Immediate visual feedback on the map encourages participation and fosters a sense of co-creation of their neighborhood's 'sound profile'.
*   **For Urban Planners:** A completely new, qualitative data source that goes beyond mere decibel values. Enables a deeper understanding of perceived quality of life and can support more informed decisions for noise protection measures, green space design, or the planning of public spaces. Identifies hotspots of unwanted sounds or particularly cherished soundscapes.

## Technology
*   **Frontend:** Web Components, Web Audio API, WebGPU (for efficient ML inference in the browser).
*   **AI:** Browser-native ML models (e.g., TensorFlow.js with YAMNet) for on-device audio classification to ensure privacy and minimize server load.
*   **Backend:** Minimalist server for aggregation and provision of anonymized, classified metadata (e.g., via GeoJSON).

## Amélie's Fit
The project is CC0-compliant, browser-native, leverages trending AI technologies locally, and addresses a real civic friction point with a playful, visual solution that provides immediate feedback.
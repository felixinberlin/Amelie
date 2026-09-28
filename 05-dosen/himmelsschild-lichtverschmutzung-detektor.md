# Dossier: Sky Shield - AI-Powered Light Pollution Analysis

## Problem Statement (Friction & Enforcement Gap)
Light pollution is increasing globally, with far-reaching negative impacts on ecosystems, human health (e.g., circadian rhythms), and astronomical research. Despite existing guidelines and recommendations for reducing light emissions, there is a lack of accessible, objective, and standardized tools that enable citizens or smaller municipalities to precisely measure light emissions and report violations. Currently available measuring devices are often expensive and complex, leading to an asymmetric information landscape: light emitters find it difficult to verify their impact, while affected parties lack valid data to demand the enforcement of existing or future regulations. This gap creates friction between public interests (environmental and health protection, night sky preservation) and the polluters (urban lighting, advertising, industry).

## Amélie Intervention: Sky Shield

"Sky Shield" is a browser-based (WASM/WebGPU) open-source tool that utilizes physical optics and machine learning to objectively quantify light pollution. It guides users to capture standardized photos (e.g., with smartphone cameras) or input readings from simple external light sensors. The application analyzes this data locally to determine metrics such as skyglow, upward light ratio, and potentially spectral compositions. By integrating with open map data (e.g., OpenStreetMap), light sources can be identified, and measurement results can be georeferenced. This data can then be submitted in a standardized format to relevant authorities (e.g., environmental agencies, urban planning departments) to facilitate informed discussions and the enforcement of light protection measures.

## Key Features & Technology

*   **Edge AI with WASM/WebGPU:** Image and data analysis occurs directly in the user's browser, protecting privacy and delivering fast results.
*   **Physics-Based Models:** Utilizes physical models to derive objective light pollution metrics from photos (e.g., brightness calibration, analysis of stray light patterns).
*   **Gamified Data Collection:** Playful elements motivate participation in data collection to create a dense and valid database.
*   **CC0 License:** All software components and collected data (after anonymization/aggregation) are available as public domain.

## Target Audiences & Use Cases

*   **Citizens:** Documenting light pollution in their own environment, contributing to local environmental research.
*   **Environmental Agencies/Nature Conservation Authorities:** Receiving decentralized, valid data for evaluating and enforcing light protection measures.
*   **Urban Planners:** Modeling the impact of new lighting concepts and identifying hotspots.
*   **Astronomical Societies:** Supporting the preservation of the night sky for observations.

## Contribution to Amélie

"Sky Shield" embodies the spirit of Amélie by providing a powerful, open tool that addresses a specific societal friction in the field of physics, empowers citizens, and provides authorities with better decision-making bases.
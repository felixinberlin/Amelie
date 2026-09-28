# Pollinator Path Designer: Browser-Native Habitat Simulator

## Project Idea
An interactive, browser-native tool that allows citizens and urban planners to playfully and visually participate in designing pollinator-friendly habitats in urban areas. Users can place various native plant species on a map and simulate in real-time how pollinators (e.g., bees, butterflies) would move between these plants. The tool visualizes "pollinator paths" and identifies gaps or optimal routes based on plant attractiveness and distance.

## How it Works
Utilizing WebGPU for the rendering engine and WASM for the simulation logic, an "agent-based" model of pollinators is created. Users select from a database of native, pollinator-friendly plants and place them on a map of their local area. The simulation then dynamically displays how pollinators move, which plants serve as stepping stones, and where "green corridors" emerge or are missing. Visual feedback, such as heatmaps of pollinator activity or animated paths, makes ecological connections immediately visible and understandable.

## Target Audience and Benefits
*   **Citizens:** Enables playful learning about urban ecosystems and active participation in shaping their environment. Fosters understanding of the importance of pollinators.
*   **Environmental/Parks Departments:** Provides a citizen engagement tool for planning and prioritizing planting campaigns. Allows visualization of design decisions and their potential impact on local biodiversity.
*   **BUND/NABU:** Supports educational campaigns and mobilizes volunteers for specific planting projects.

## Technical Approaches
*   **Frontend:** HTML, CSS, JavaScript.
*   **Simulation:** WASM for fast, agent-based simulation of pollinator movement and plant interaction.
*   **Rendering:** WebGPU for performant, browser-native 2D/3D visualization of the map, plants, and pollinator paths.
*   **Data:** Open data on native plant species and their attractiveness to various pollinators; map data (OpenStreetMap-based).
# Urban Canvas: Gestural AI for Citizen Urban Design

**Problem:** Citizen participation processes in urban planning often suffer from the difficulty of articulating complex spatial ideas and desires in textual form. Planners frequently receive unstructured or hard-to-interpret feedback, hindering efficient integration into plans.

**Idea:** A browser-native tool that allows citizens to 'draw' or 'gesture' their urban visions directly onto maps or aerial imagery (e.g., OpenStreetMap, city-provided data). A locally (WASM/WebGPU) running AI interprets these gestural inputs (e.g., a drawn line as a bike path, a circled area as a park, a dot as a bench) in combination with short text prompts, transforming them into structured, semi-formal suggestions for urban planning.

**How it Works:**
1.  **Visual Interaction:** Users load a city area or project zone and can draw, mark, and comment on it. For example, a green area for a park, a red line for a sidewalk that's too narrow, a blue dot for a desired water fountain.
2.  **AI Interpretation:** A client-side AI (e.g., a small vision-language model) analyzes the drawn elements and accompanying text. It recognizes patterns (e.g., 'long, thin line + 'bicycle' = 'bike path'), segments areas ('circled area + 'green' + 'recreation' = 'green space/park'), and suggests categorizations (e.g., 'traffic calming', 'leisure area', 'infrastructure').
3.  **Structured Output:** The AI generates a structured summary of citizen requests, which is easy for planners to filter and analyze (e.g., GeoJSON objects with metadata like 'Type: Bike Path', 'Priority: high', 'User Comment: 'Missing connection to park'').
4.  **Gamification & Feedback:** Playful elements like 'Draw your ideal city' and immediate visual feedback from the AI make the process engaging and low-threshold.

**Benefits:**
*   **For Citizens:** Easier, more intuitive, and effective participation. A sense of direct influence.
*   **For Planners:** Higher quality, contextualized, and pre-structured feedback that can be more easily integrated into planning processes. Better data foundation for decision-making.

**Technology:** WebGL/Canvas for drawing, WASM/WebGPU for AI models (e.g., MobileSAM for segmentation, small LLMs for text interpretation), OpenLayers/Mapbox for map integration.
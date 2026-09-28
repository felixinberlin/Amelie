# Dossier: Public Knowledge Web (V3): Semantic Document Grapher

**Problem Statement:** The Berlin administration, like many others, produces an enormous amount of text-based knowledge: urban development plans, environmental impact assessments, draft legislation, study reports. These documents are often hundreds of pages long, technically complex, and written in language difficult for laypersons to understand. This leads to significant information asymmetry and hinders civic participation, as well as the work of NGOs and journalists who wish to fully grasp the implications of these documents.

**Concept:** The 'Public Knowledge Web' (V3) is an open-source tool designed to transform these static, often PDF-formatted documents into an interactive, semantic knowledge network. Users can upload documents (or provide public URLs), which are then processed locally in the browser using WASM/WebGPU-enabled LLMs. The tool extracts key entities (e.g., locations, actors, regulations, environmental impacts) and their relationships. The result is a dynamic, visual knowledge graph that allows users to explore complex interdependencies, find specific facts, and understand policy implications without needing to read every page. Every extracted piece of information is directly linked back to the original text to ensure transparency and verifiability.

**Added Value:**
*   **Civic Engagement:** Facilitates understanding of complex planning processes and promotes informed decision-making.
*   **Transparency:** Makes public administrative knowledge more accessible and comprehensible.
*   **Efficiency:** Saves time for administrative staff, journalists, and NGOs in research and analysis.
*   **Data Privacy:** Local in-browser processing protects sensitive data and avoids cloud dependencies.
*   **Interactivity:** Playful exploration of the knowledge network fosters deeper understanding.

**Technology:** Utilizes modern web technologies like WebAssembly (WASM) and WebGPU for local execution of specialized LLMs. Visualization through interactive graph libraries (e.g., D3.js). Focus on a responsive and intuitive User Interface (VibeCoding approach).

**Target Audience:** Citizens, civil society organizations, journalists, researchers, and public administration staff involved in the analysis and communication of complex issues.

**Example Scenario:** A resident wants to understand the implications of a new urban development plan on a nearby park. Instead of sifting through hundreds of pages, they upload the plan to V3 and can visually explore which sections of the park are affected, what conditions exist for noise protection or green space compensation, and which authorities or experts are involved – all directly linked to the relevant passages in the original document.
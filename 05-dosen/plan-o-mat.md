# Plan-o-Mat: Citizen-LLM for Urban Development Plans

## Problem Statement
Urban development plans (Bebauungspläne) are central instruments of urban planning, but their complexity, legalistic jargon, and publication format (often as PDFs with maps and texts) make them almost incomprehensible to the general public. This leads to an asymmetrical distribution of information, hinders citizen participation, and undermines trust in transparent planning processes. Citizens often feel excluded and overwhelmed when trying to understand the implications of construction projects in their neighborhoods.

## Solution Idea
The "Plan-o-Mat" is a browser-native (WASM/WebGPU) AI tool that enables citizens to understand urban development plans in natural language. Users can upload PDF documents or link to publicly available plans. A locally running Large Language Model (LLM), fine-tuned for German planning documents, then answers questions about the content, summarizes complex sections, or identifies relevant provisions for a specific address or building project. The user interface is playfully and intuitively designed to lower barriers to entry and provide a delightful user experience.

## Technological Basis
The project leverages the latest developments in browser-native AI. By using WebAssembly (WASM) and WebGPU, powerful LLMs can run directly in the user's browser, ensuring data privacy and low latency. Specific fine-tuning for German construction and planning jargon is crucial to deliver precise and understandable answers. Interaction occurs via a chat-based interface with visual highlights in the original document.

## Target Institution
Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen Berlin (Senate Department for Urban Development, Building and Housing Berlin) or individual district offices (e.g., Bezirksamt Tempelhof-Schöneberg, Urban Planning Department).

## Added Value for Civil Society
*   **Democratization of Knowledge:** Makes complex planning information accessible to everyone.
*   **Strengthening Citizen Participation:** Enables informed opinion-forming and more active participation in planning processes.
*   **Transparency and Trust:** Fosters understanding of administrative decisions and reduces information asymmetries.
*   **Efficiency:** Saves time and resources in researching and interpreting documents.

## Risks and Challenges
The biggest challenge lies in ensuring the accuracy of AI-generated responses, especially for legally binding texts. This requires careful model tuning, clear disclaimers, and the ability for users to refer to original sources if needed. The maintenance and adaptation of the model to new legal frameworks or specialized terminologies is also an ongoing effort.

# Dossier: Regelwerk-Navigator (Interactive Policy Explainer with Local AI)

## Problem Statement
Public administrations, particularly in urban development and construction, publish a multitude of decision-relevant documents such as zoning plans (Bebauungspläne), land use plans (Flächennutzungspläne), or environmental impact assessments. These texts are often written in complex, legal, or highly specialized language, making them nearly incomprehensible for citizens without specific prior knowledge. This leads to significant friction in public participation processes, low engagement, and a feeling of being overwhelmed among those affected. The asymmetrical distribution of knowledge creates a barrier between administration and civil society.

## Amélie's Approach: Asymmetric Inversion
The Regelwerk-Navigator aims to invert this knowledge asymmetry. Instead of passively receiving complex documents, citizens are provided with an active tool to interactively explore their content. Using browser-native, local AI models (WASM/WebGPU), an uploaded document is analyzed. Key functionalities include:

1.  **Interactive Explanation**: Users can highlight sections or ask questions to receive simplified explanations, definitions of technical terms, or implications for their specific context.
2.  **Visualization of Connections**: A graphical representation connects related paragraphs, concepts, or affected parties to clarify the structure of the regulatory framework.
3.  **Scenario Simulation (light)**: Simple 'what if?' questions that can be answered based on the document (e.g., 'Am I allowed to do X on my property if this is the zoning plan?').

The tool runs entirely in the browser, ensuring data privacy and offering an immediate, responsive user experience. It is not a 'black box' AI but a knowledge discovery tool that promotes transparency and significantly improves information accessibility.

## Target Audience & Institution
The primary target audience includes citizens, local initiatives, and small businesses affected by public planning. The Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen in Berlin is an ideal partner, as it regularly faces the challenge of communicating complex urban planning regulations. Environmental agencies or health authorities could also benefit from such a tool.
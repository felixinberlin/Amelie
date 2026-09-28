# Kontext-Komet: Civic Knowledge Constellation Explorer

## Vision
The 'Kontext-Komet' (Context Comet) project is an open-source tool aiming to transform vast, often opaque archives of public documents (e.g., city council minutes, research papers, legislative drafts, NGO reports) into an interactive and visually engaging knowledge constellation. It leverages modern AI technologies to uncover hidden connections, the evolution of concepts, and knowledge gaps. Moving away from static paper mountains towards a dynamic, explorable universe of knowledge that fosters civic engagement and informed decision-making.

## The Problem
Universities, municipalities, and NGOs are sitting on mountains of unstructured textual data. These documents contain countless pieces of information and relationships, but their format and volume make them difficult to access, analyze, or interlink. Citizens, researchers, and decision-makers often miss crucial contextual information, the development of topics over time, or cross-connections between seemingly unrelated documents. The UX is often 'bureaucratic' and does not invite exploration.

## The Amélie Solution: Kontext-Komet
'Kontext-Komet' solves this problem by adopting a playful and 'civic delightful' approach:

1.  **Document Ingestion & AI Analysis:** The tool ingests collections of documents (PDFs, Markdown, text files). Using advanced Large Language Models (LLMs) and Natural Language Processing (NLP), it automatically extracts entities (people, places, concepts, organizations) and the relationships between them.
2.  **Dynamic Knowledge Graph:** The extracted entities and relationships are then transformed into an interactive knowledge graph. This graph visualizes the 'constellations' of ideas and connections.
3.  **Concept Comets & Temporal Evolution:** The tool can track the evolution of concepts over time, presenting them as 'comet trails' within the graph. This allows users to understand how terms or topics develop in public discourse or research.
4.  **'Dark Matter' & Knowledge Gaps:** By analyzing the graph structure, unconnected clusters or topics can be identified, representing 'dark matter' in the knowledge space, pointing to potential areas for further research or action.
5.  **Interactive Exploration:** Users can 'fly through' the graph, click on concepts, explore relationships, filter documents, and view the original source documents. The UX is designed for intuitive discovery and playful interaction.

## Technological Basis
*   **Backend:** Python (FastAPI) for NLP pipelines, LLM integration (e.g., LlamaIndex, LangChain with local or API-based LLMs), graph database (e.g., Neo4j, ArangoDB, or simple JSON graph structures for smaller projects).
*   **Frontend:** TypeScript, React, D3.js, or specialized graph visualization libraries (e.g., React Flow, Sigma.js, Cytoscape.js) for a fluid, interactive user interface.
*   **Deployment:** Docker, Kubernetes for scalability and easy deployment.

## Civic Delight & Playfulness
'Kontext-Komet' transforms the often dry subject of document analysis into an exciting game of discovery. The metaphors of constellations, comet trails, and dark matter invite playful exploration. It is not just a tool, but a portal into the collective knowledge world of civil society and administration.
# Dossier: Berlin Construction Request Radar

## Project Idea
The Berlin Construction Request Radar is an open-source tool aiming to significantly improve transparency and citizen participation in urban development processes across Berlin. It automates the monitoring, extraction, and citizen-friendly preparation of information from publicly accessible building permit applications (Bauvoranfragen, Baugenehmigungen) from Berlin's district offices (Bezirksämter) and the Senate Department for Urban Development, Building and Housing (Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen).

## How it Works
1.  **Automated Data Acquisition:** The tool regularly scans online portals of Berlin authorities for new publications of building applications (often complex PDF documents). It utilizes web-scraping techniques and intelligent document analysis.
2.  **AI-Powered Extraction & Summarization:** Using advanced NLP and Large Language Models (LLMs), relevant information is extracted from the documents: project type, scope, exact address, potential impacts (e.g., on green spaces, traffic, noise), applicant, and deadlines for objections. This information is then summarized in easily understandable language.
3.  **Geospatial Visualization:** All captured projects are visualized on an interactive map of Berlin. Citizens can thus see at a glance what construction projects are planned in their neighborhood or in relevant districts.
4.  **Personalized Notifications:** Users can subscribe to specific districts or thematic areas and receive proactive notifications about new, relevant construction projects.
5.  **Contextualization & Simulation:** A 'VibeCoding' interface allows for playful simulation of project impacts (e.g., shadow casting, traffic volume) and provides contextual information, such as zoning plans or protected areas.

## Civic Utility
*   **Early Information:** Citizens and NGOs receive information about construction projects before they are too far advanced to influence.
*   **Easy Comprehension:** Complex bureaucratic texts are translated into citizen-friendly summaries.
*   **Proactive Participation:** The tool promotes informed and proactive citizen participation instead of reactive protests.
*   **Transparency:** Increases transparency in urban planning processes and strengthens local democracy.

## Technological Direction
The project relies on modern web technologies (React/Vue/Svelte, WebAssembly for local AI models) and open-source LLMs for document analysis. Map visualization is done via established geospatial libraries (e.g., Leaflet, Mapbox GL JS). The focus is on a 'zero-latency feedback' experience and a visual, appealing UX.

## Target Groups
*   Residents and citizen initiatives
*   Local NGOs (e.g., environmental associations, tenants' associations)
*   District assemblies and urban planners (as a tool for better communication)

The Berlin Construction Request Radar is an excellent example of Amélie's mission to make advanced technology accessible for civic benefit and address real administrative friction points.
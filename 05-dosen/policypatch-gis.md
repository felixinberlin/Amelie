# Dossier: PolicyPatch-GIS – Visual Git for Public Data Evolution

**Problem:** Public authorities in Berlin, such as the Senate Department for Urban Development, constantly manage a multitude of documents and data that evolve over time: urban development plans, environmental reports, policy guidelines, and especially spatial data like GeoJSON files for infrastructure projects. Tracking changes in these often complex, non-textual assets is manually intensive, error-prone, and lacks public transparency. Standard file versioning is insufficient to visually and granularly address the 'what-changed-when-and-why' questions.

**Solution (lacunar-bisociation):** We propose 'PolicyPatch-GIS', a browser-native application that applies the powerful concepts of `git` – specifically `diff` and `blame` – to visual and structured, non-code assets. Imagine a tool that provides:

*   **Visual GeoJSON Diffing:** Clearly highlights changes in geometries (points, lines, polygons) and their attributes (e.g., planning status, designation) between two versions of a GeoJSON file. New elements appear green, removed ones red, and changed ones yellow.
*   **PDF and Image Versioning with Annotation:** For policy documents, architectural drawings, or landscape plans, changes can be detected at a pixel level and annotated with comments or markups, reflecting a 'git blame' approach.
*   **Timeline View:** An intuitive timeline displaying all versions of a document or dataset, allowing users to jump back to any revision and compare changes against other versions.

This enables urban planners, environmental agencies, citizen initiatives, and the general public to transparently track the evolution of projects and policies, minimize errors, and enhance collaborative work on critical public data. The implementation leverages modern web technologies (WASM for performance, WebGPU for rendering) and is designed to run directly in the browser, without server-side dependencies for basic functionalities.

**Use Case Example:** The Senate Department for Urban Development could use PolicyPatch-GIS to publicly document the evolution of a new development plan. Citizens could at any time see what changes have been made to the planning, when and by whom (if metadata is available), and how these visually impact the urban structure.
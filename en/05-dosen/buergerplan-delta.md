# Bürgerplan-Delta: Interactive Urban Planning Diff Editor

## Problem Statement
Citizen participation in urban planning, especially in the creation of development plans (Bebauungspläne), is often a process fraught with friction and inefficiency. Current methods require citizens to interpret complex technical plans and submit written statements. These statements are frequently difficult for administrations to aggregate, spatially locate, and systematically integrate into digital planning documents. This leads to an "enforcement gap" where input is collected, but its effective processing and visible impact remain limited. The asymmetry lies in citizens providing unstructured information that the administration must convert into structured plans – a laborious and error-prone process.

## The Amélie Solution: Asymmetric Inversion
"Bürgerplan-Delta" inverts this process. Instead of submitting written comments on a static plan, citizens can directly draw their proposed changes onto a digital map (based on official planning data as GeoJSON layers). The tool captures these changes as a "Delta" or "Diff" between the official planning status and the citizen's proposal.

### Core Features:
1.  **Interactive Map Editor:** Based on a web-GIS (e.g., Leaflet/Mapbox GL JS), official GeoJSON layers (e.g., land use plans, development plans) can be loaded.
2.  **Drawing Tools:** Citizens can add new geometries (points, lines, polygons), edit existing geometries (move, scale, change attributes), or delete them.
3.  **Attribute Editor:** Simple forms allow adding or modifying planning attributes (e.g., "residential area", "green space", "floor height").
4.  **Diff Generation:** The system automatically calculates a "Delta" dataset (similar to a Git diff) between the original official GeoJSON and the citizen's modification. This diff is machine-readable and only contains the modifications made.
5.  **Version Control:** Each citizen proposal is saved as a separate version and can be annotated with comments.
6.  **Delta Visualization:** The administration can visualize, aggregate, and easily identify potential conflicts or common suggestions from all submitted deltas.

## Technical Approach
The frontend will be based on modern web technologies (TypeScript, React/Vue/Svelte) with a mapping library like Leaflet or Mapbox GL JS and drawing extensions (e.g., Leaflet.draw). GeoJSON data and deltas will be stored in a PostgreSQL/PostGIS database. Diff generation can be implemented server-side (e.g., using Python/shapely or Go/gdal) or client-side (with JavaScript libraries for GeoJSON comparisons). Simple authentication can link proposals to specific users.

## Benefits
*   **Citizens:** Enables intuitive, precise, and visual participation; simplifies the communication of complex ideas.
*   **Administration:** Receives structured, spatially referenced, and machine-readable input; reduces manual effort for data integration and analysis; allows for more transparent documentation of the participation process.
*   **Transparency:** Makes visible how proposals are submitted and what potential impact they could have on the plan.
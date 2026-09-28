# Geo-Delta-Audit: Git-like Revision Tracking for Geospatial Data

## Vision
The "Geo-Delta-Audit" is an open-source tool that applies the principles of version control, specifically the `git-diff` algorithm, to geospatial data. It enables universities, municipalities, and NGOs to precisely track, visualize, and audit changes in spatial datasets (such as urban plans, land-use plans, cadastral data, or environmental data). The goal is to increase transparency in planning processes, reduce errors, and foster citizen participation through understandable change reports.

## The Problem
Urban planning departments, environmental protection organizations, and research institutions constantly work with geospatial data that changes over time. Manually identifying and documenting these changes—be it an altered property boundary, a new building zone, or the relocation of a green space—is extremely time-consuming, error-prone, and lacks transparency. During public consultations for development plans, it is often difficult to clearly communicate to citizens *what exactly* has changed compared to a previous version, as typical GIS systems often only allow side-by-side comparisons or overlays that do not highlight actual "deltas."

## The Solution: Analogous Collision "Git Diff" + "Geospatial Data"
The Geo-Delta-Audit takes two versions of a geospatial dataset (e.g., GeoJSON files or exports from a PostGIS database) and generates a detailed change report, similar to `git diff` for code. This report identifies:

*   **Added Features:** New points, lines, or polygons (e.g., a new building, a new road).
*   **Removed Features:** Deleted spatial objects (e.g., a demolished building, a revoked zone).
*   **Modified Features:** Objects whose geometry (e.g., a changed property shape) or attributes (e.g., building height, land use) have been altered.

The tool can present these changes both as a machine-readable report (e.g., as a separate GeoJSON with change metadata) and visually, to make them understandable for both professionals and laypersons.

## Target Institution and Use Cases
*   **Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen Berlin (Berlin Senate Department for Urban Development, Building and Housing):** For transparent tracking of changes to development plans, land-use plans, and other spatially relevant data. Ideal for preparing public consultations.
*   **Environmental Agencies:** For monitoring land-use changes, the expansion of protected areas, or the development of habitats.
*   **Universities and Research Institutions:** For analyzing historical urban development, tracking infrastructure projects, or validating crowdsourced geospatial data.
*   **NGOs and Citizen Initiatives:** To quickly understand proposed plan changes and provide informed feedback.

## Technical Implementation (Idea)
The tool could be developed in TypeScript and rely on proven open-source geospatial libraries such as GDAL/OGR for data import/export, Turf.js or JSTS for geometric operations and diffing algorithms. Output could be a GeoJSON diff format, an interactive web viewer (e.g., with Leaflet/Mapbox GL JS), or a generated PDF report.

## Impact & Benefits
*   **Increased Transparency:** Clearly shows citizens and stakeholders what has changed in a planning document.
*   **Improved Auditability:** Every change to a geospatial dataset becomes traceable.
*   **Efficiency Gains:** Automation of change comparison saves time and reduces manual errors.
*   **Data Quality:** Promotes more precise and versioned data management within public administration.